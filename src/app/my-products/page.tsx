import { Box, Button, Container, Grid, GridItem, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { MarketingShell } from "@/components/site/marketing-shell";
import { ProductCard } from "@/components/site/product-card";
import { getLicenseStatus } from "@/lib/license";
import type { Product } from "@/lib/products";
import { PRODUCTS } from "@/lib/products";
import { createClient } from "@/lib/supabase/server";

const TITLE = "My Products";
const DESCRIPTION = "The Black Squid products you own.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: false, follow: false },
};

export default async function MyProductsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Owned-products view is authenticated-only. Middleware already bounces
  // logged-out users; guard here too in case the matcher is ever loosened.
  if (!user) redirect("/login?redirectTo=/my-products");

  const license = await getLicenseStatus(user.id);

  // Only surface products the user actually owns. Extend this as more products
  // gain their own ownership checks.
  const owned: Product[] = license.hasLicense ? [PRODUCTS.ezstemz] : [];

  return (
    <MarketingShell>
      <Container maxW="6xl" py={{ base: 14, md: 20 }}>
        <Stack gap={2} mb={10}>
          <Heading size={{ base: "3xl", md: "4xl" }} letterSpacing="-0.03em">
            My Products
          </Heading>
          <Text color="fg.muted" fontSize="lg">
            Signed in as {user.email}.
          </Text>
        </Stack>

        {owned.length > 0 ? (
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
            {owned.map((product) => (
              <GridItem key={product.id}>
                <ProductCard
                  product={product}
                  showStatus
                  footer={
                    <HStack gap={3} flexWrap="wrap">
                      <Button asChild colorPalette="brand">
                        <Link href="/download">Download</Link>
                      </Button>
                      <Button asChild variant="outline" colorPalette="brand">
                        <Link href="/account">Manage</Link>
                      </Button>
                    </HStack>
                  }
                />
              </GridItem>
            ))}
          </Grid>
        ) : (
          <Box
            borderWidth="1px"
            borderColor="border.subtle"
            borderRadius="2xl"
            bg="bg.subtle"
            p={{ base: 8, md: 12 }}
            textAlign="center"
          >
            <Stack gap={4} align="center">
              <Heading size="lg">You don&apos;t own any products yet.</Heading>
              <Text color="fg.muted" maxW="md">
                Browse the Black Squid catalogue to find the right tool for your workflow.
              </Text>
              <Button asChild colorPalette="brand" size="lg">
                <Link href="/#products">Browse Products</Link>
              </Button>
            </Stack>
          </Box>
        )}
      </Container>
    </MarketingShell>
  );
}
