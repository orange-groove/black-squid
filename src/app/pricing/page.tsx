import {
  Badge,
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  Heading,
  HStack,
  Link as ChakraLink,
  List,
  Stack,
  Text,
} from "@chakra-ui/react";
import type { Metadata } from "next";
import Link from "next/link";
import { LuCheck } from "react-icons/lu";

import { BuyButton } from "@/components/site/buy-button";
import { MarketingShell } from "@/components/site/marketing-shell";
import { getLicenseStatus } from "@/lib/license";
import { EZSTEMZ_LICENSE_PRICE } from "@/lib/pricing";
import { PLATFORMS_SHORT } from "@/lib/platforms";
import { isCheckoutEnabled, PRODUCTS } from "@/lib/products";
import { sharedOpenGraph, sharedTwitter } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";

const PRICING_TITLE = "Pricing — Black Squid products";
const PRICING_DESCRIPTION =
  `Buy EZStemz for ${EZSTEMZ_LICENSE_PRICE} once — lifetime updates and downloads on ${PLATFORMS_SHORT}. ` +
  `KitForge pricing coming soon.`;

export const metadata: Metadata = {
  title: PRICING_TITLE,
  description: PRICING_DESCRIPTION,
  alternates: { canonical: "/pricing" },
  openGraph: sharedOpenGraph(PRICING_TITLE, PRICING_DESCRIPTION),
  twitter: sharedTwitter(PRICING_TITLE, PRICING_DESCRIPTION),
};

const EZSTEMZ_INCLUDED = [
  "macOS and Windows desktop apps",
  "Lifetime updates",
  "6-stem separation (drums, bass, vocals, guitar, piano, other)",
  "Built-in mixer + 44.1 kHz WAV export",
  "Use on all of your personal computers",
];

export default async function PricingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const status = user ? await getLicenseStatus(user.id) : null;
  const kitforgeReady = isCheckoutEnabled(PRODUCTS.kitforge);

  return (
    <MarketingShell>
      <Container maxW="6xl" py={{ base: 16, md: 24 }}>
        <Stack gap={3} textAlign="center" mb={12}>
          <Heading size={{ base: "3xl", md: "4xl" }} letterSpacing="-0.03em">
            Pricing
          </Heading>
          <Text color="fg.muted" fontSize="lg" maxW="xl" mx="auto">
            One-time purchases — not subscriptions. Pay once, download anytime, run offline
            forever.
          </Text>
        </Stack>

        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6} alignItems="stretch">
          {/* EZStemz — live Stripe checkout preserved */}
          <GridItem>
            <Box
              borderWidth="1px"
              borderColor="border.emphasized"
              borderRadius="2xl"
              p={{ base: 6, md: 8 }}
              bg="bg.subtle"
              h="full"
            >
              <Stack gap={6} h="full">
                <HStack justify="space-between" align="flex-start" flexWrap="wrap" gap={4}>
                  <Stack gap={1}>
                    <Badge colorPalette="green" variant="subtle" alignSelf="flex-start" borderRadius="full">
                      Available
                    </Badge>
                    <Heading size="xl">EZStemz</Heading>
                  </Stack>
                  <HStack alignItems="baseline" gap={1}>
                    <Heading size="4xl" letterSpacing="-0.04em">
                      {EZSTEMZ_LICENSE_PRICE}
                    </Heading>
                    <Text color="fg.muted">USD</Text>
                  </HStack>
                </HStack>

                <List.Root gap={2} variant="plain">
                  {EZSTEMZ_INCLUDED.map((item) => (
                    <List.Item key={item}>
                      <HStack gap={3} align="flex-start">
                        <Box color="white" mt={1} flexShrink={0}>
                          <LuCheck />
                        </Box>
                        <Text>{item}</Text>
                      </HStack>
                    </List.Item>
                  ))}
                </List.Root>

                <Box mt="auto">
                  <BuyButton hasLicense={status?.hasLicense ?? false} isLoggedIn={Boolean(user)} />
                  <Text fontSize="sm" color="fg.muted" mt={4}>
                    Account required for download access. 14-day refund if it doesn&apos;t work on
                    your machine —{" "}
                    <ChakraLink href="mailto:hello@ezstemz.com" color="white" textDecoration="underline">
                      hello@ezstemz.com
                    </ChakraLink>
                    .
                  </Text>
                </Box>
              </Stack>
            </Box>
          </GridItem>

          {/* KitForge — placeholder, no live checkout yet */}
          <GridItem>
            <Box
              borderWidth="1px"
              borderColor="border.subtle"
              borderRadius="2xl"
              p={{ base: 6, md: 8 }}
              bg="bg.subtle"
              h="full"
            >
              <Stack gap={6} h="full">
                <HStack justify="space-between" align="flex-start" flexWrap="wrap" gap={4}>
                  <Stack gap={1}>
                    <Badge colorPalette="gray" variant="subtle" alignSelf="flex-start" borderRadius="full">
                      Coming soon
                    </Badge>
                    <Heading size="xl">KitForge</Heading>
                  </Stack>
                  <HStack alignItems="baseline" gap={1}>
                    <Heading size="4xl" letterSpacing="-0.04em" color="fg.muted">
                      TBA
                    </Heading>
                  </HStack>
                </HStack>

                <Text color="fg.muted">{PRODUCTS.kitforge.description}</Text>

                <Box mt="auto">
                  <HStack gap={3} flexWrap="wrap">
                    <Button colorPalette="brand" disabled={!kitforgeReady}>
                      {kitforgeReady ? "Buy KitForge" : "Coming Soon"}
                    </Button>
                    <Button asChild variant="outline" colorPalette="brand">
                      <Link href="/products/kitforge">Learn More</Link>
                    </Button>
                  </HStack>
                  <Text fontSize="sm" color="fg.muted" mt={4}>
                    KitForge pricing isn&apos;t live yet — check back soon to join the beta.
                  </Text>
                </Box>
              </Stack>
            </Box>
          </GridItem>
        </Grid>

        <Text color="fg.muted" fontSize="sm" textAlign="center" mt={10}>
          More questions? See the{" "}
          <ChakraLink asChild color="white" textDecoration="underline">
            <Link href="/products/ezstemz#faq">EZStemz FAQ</Link>
          </ChakraLink>
          .
        </Text>
      </Container>
    </MarketingShell>
  );
}
