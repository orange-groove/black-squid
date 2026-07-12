import { Avatar, Box, Button, Container, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { MarketingShell } from "@/components/site/marketing-shell";
import { fulfillPurchaseFromCheckoutSession } from "@/lib/fulfill-purchase";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Your account" };

type PageProps = {
  searchParams: Promise<{ purchased?: string; session_id?: string }>;
};

export default async function AccountPage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Belt and braces — middleware already redirects unauthenticated users.
  if (!user) redirect("/login?redirectTo=/account");

  // Backup path when Stripe Checkout succeeded but the webhook never reached
  // our server (e.g. a deploy without STRIPE_WEBHOOK_SECRET configured). Runs
  // silently — the account page no longer surfaces product/license state.
  const { session_id: checkoutSessionId } = await searchParams;
  if (checkoutSessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(checkoutSessionId);
      if (session.metadata?.supabase_user_id === user.id) {
        await fulfillPurchaseFromCheckoutSession(session);
      }
    } catch (err) {
      console.error("[account] checkout session fulfillment failed", err);
    }
  }

  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const name =
    (typeof meta.full_name === "string" && meta.full_name) ||
    (typeof meta.name === "string" && meta.name) ||
    user.email?.split("@")[0] ||
    "there";
  const metaAvatar =
    (typeof meta.avatar_url === "string" && meta.avatar_url) ||
    (typeof meta.picture === "string" && meta.picture) ||
    null;
  // Fall back to a deterministic generated avatar seeded by the user id, so
  // everyone has an image even without a Google/profile picture.
  const avatarUrl =
    metaAvatar ?? `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(user.id)}`;

  return (
    <MarketingShell>
      <Container maxW="2xl" py={{ base: 14, md: 20 }}>
        <Stack gap={8}>
          <Heading size="3xl">Your account</Heading>

          <Box
            borderWidth="1px"
            borderColor="border.subtle"
            borderRadius="2xl"
            p={{ base: 6, md: 8 }}
            bg="bg.subtle"
          >
            <Stack gap={8}>
              <HStack gap={5} align="center">
                <Avatar.Root size="2xl">
                  <Avatar.Fallback name={name} />
                  <Avatar.Image src={avatarUrl} alt={name} />
                </Avatar.Root>
                <Stack gap={1}>
                  <Heading size="lg" letterSpacing="-0.02em">
                    {name}
                  </Heading>
                  <Text color="fg.muted">{user.email}</Text>
                </Stack>
              </HStack>

              <form action="/logout" method="post">
                <Button type="submit" variant="outline" size="sm">
                  Log out
                </Button>
              </form>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </MarketingShell>
  );
}
