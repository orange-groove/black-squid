import "server-only";

import { PRODUCTS, type ProductId } from "@/lib/products";
import { createClient } from "@/lib/supabase/server";

export type LicenseStatus = {
  hasLicense: boolean;
  purchasedAt: string | null;
};

// Postgres error code for "column does not exist" — used so the site keeps
// working on the legacy (pre-migration) schema where `purchases.product`
// hasn't been added yet. Once the migration is applied this path never runs.
const UNDEFINED_COLUMN = "42703";

// One source of truth for "does this user own <product>?".
// Re-used by /account, /download, /products/*, /pricing, and the API routes.
export async function getLicenseStatus(
  userId: string,
  product: ProductId = "ezstemz",
): Promise<LicenseStatus> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("purchases")
    .select("created_at, status")
    .eq("user_id", userId)
    .eq("product", product)
    .eq("status", "paid")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    // Pre-migration fallback: if the `product` column doesn't exist yet, treat
    // any paid purchase as an EZStemz license (the only product before the
    // multi-product migration). Never leak legacy rows to other products.
    if (error.code === UNDEFINED_COLUMN && product === "ezstemz") {
      return legacyEzstemzLicense(userId);
    }
    console.error("[license] lookup failed", error);
    return { hasLicense: false, purchasedAt: null };
  }

  if (!data) {
    return { hasLicense: false, purchasedAt: null };
  }

  return { hasLicense: true, purchasedAt: data.created_at };
}

// Which products does this user own? Powers the /my-products page.
export async function getOwnedProductIds(userId: string): Promise<ProductId[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("purchases")
    .select("product")
    .eq("user_id", userId)
    .eq("status", "paid");

  if (error) {
    if (error.code === UNDEFINED_COLUMN) {
      // Legacy schema: any paid purchase is an EZStemz license.
      const legacy = await legacyEzstemzLicense(userId);
      return legacy.hasLicense ? ["ezstemz"] : [];
    }
    console.error("[license] owned lookup failed", error);
    return [];
  }

  const known = new Set<string>(Object.keys(PRODUCTS));
  const owned = new Set<ProductId>();
  for (const row of data ?? []) {
    if (row.product && known.has(row.product)) {
      owned.add(row.product as ProductId);
    }
  }
  return [...owned];
}

async function legacyEzstemzLicense(userId: string): Promise<LicenseStatus> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("purchases")
    .select("created_at, status")
    .eq("user_id", userId)
    .eq("status", "paid")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return { hasLicense: false, purchasedAt: null };
  }
  return { hasLicense: true, purchasedAt: data.created_at };
}
