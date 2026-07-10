import { NextResponse } from "next/server";

import { env } from "@/lib/env";
import { getLicenseStatus } from "@/lib/license";
import { isCheckoutEnabled, PRODUCTS, type ProductId } from "@/lib/products";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

function parseProduct(value: unknown): ProductId {
  // Default to ezstemz so the existing BuyButton (which posts no body) keeps
  // working unchanged.
  return value === "kitforge" || value === "ezstemz" ? value : "ezstemz";
}

// Creates a Stripe Checkout session for the current user and returns the URL
// for the client to redirect to. The Stripe-side payment metadata carries the
// Supabase user id AND the product slug so the webhook can pin the resulting
// purchase row to the correct account and the correct app.
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const product = parseProduct(body?.product);
  const config = PRODUCTS[product];

  // Guard against buying a product that isn't live yet (e.g. KitForge). This is
  // the server-side twin of the disabled "Coming Soon" button in the UI.
  if (!isCheckoutEnabled(config)) {
    return NextResponse.json(
      { error: `${config.name} is not available for purchase yet.` },
      { status: 400 },
    );
  }

  const priceId = env.productPriceId(product);
  if (!priceId) {
    return NextResponse.json(
      { error: `No Stripe price configured for ${config.name}.` },
      { status: 500 },
    );
  }

  // No double-purchase: if they already own this product, send them to where
  // they can use it. EZStemz has a dedicated /download; everything else goes to
  // the owned-products view.
  const license = await getLicenseStatus(user.id, product);
  if (license.hasLicense) {
    const owned = product === "ezstemz" ? `${env.siteUrl}/download` : `${env.siteUrl}/my-products`;
    return NextResponse.json({ url: owned });
  }

  // Reuse the same Stripe customer across attempts so the dashboard isn't
  // littered with one-payment customers. We persist the id on the
  // `profiles.stripe_customer_id` column managed by the trigger in the
  // migration; service role read because RLS would otherwise hide other users.
  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .maybeSingle();

  let customerId = profile?.stripe_customer_id ?? null;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;
    await admin
      .from("profiles")
      .upsert({ id: user.id, stripe_customer_id: customerId }, { onConflict: "id" });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    allow_promotion_codes: true,
    // session_id lets /account grant the license if the webhook hasn't fired yet
    // (common when testing production URL without a live webhook endpoint).
    success_url: `${env.siteUrl}/account?purchased=1&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.siteUrl}/pricing?cancelled=1`,
    // Metadata is the authoritative join key between Stripe and our DB. The
    // webhook reads `supabase_user_id` and `product` from here, NOT from the
    // customer email, which the user could change in the Stripe portal.
    payment_intent_data: {
      metadata: { supabase_user_id: user.id, product },
    },
    metadata: { supabase_user_id: user.id, product },
  });

  if (!session.url) {
    return NextResponse.json({ error: "Stripe did not return a checkout URL." }, { status: 500 });
  }

  return NextResponse.json({ url: session.url });
}
