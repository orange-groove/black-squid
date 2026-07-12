import { Box, Button, Container, Flex, HStack, Spacer } from "@chakra-ui/react";
import Link from "next/link";

import { BrandLockup } from "@/components/site/logo";
import { ProductsMenu } from "@/components/site/products-menu";
import { createClient } from "@/lib/supabase/server";

export async function SiteNav() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <Box
      as="header"
      borderBottomWidth="1px"
      borderColor="border.subtle"
      bg="black/70"
      backdropFilter="blur(12px)"
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Container maxW="6xl" py={3}>
        <Flex align="center" gap={6}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <BrandLockup />
          </Link>

          <HStack gap={5} display={{ base: "none", md: "flex" }}>
            <ProductsMenu />
            {user && (
              <Link href="/my-products" style={{ color: "inherit" }}>
                <Box
                  color="fg.muted"
                  _hover={{ color: "fg" }}
                  fontSize="sm"
                  fontWeight="medium"
                  transition="color 0.15s"
                >
                  My Products
                </Box>
              </Link>
            )}
          </HStack>

          <Spacer />

          <HStack gap={2}>
            {user ? (
              <>
                <Button asChild size="sm" colorPalette="brand">
                  <Link href="/account">Account</Link>
                </Button>
                {/* Native form POST → /logout route handler (signs out, 303 home). */}
                <form action="/logout" method="post">
                  <Button type="submit" size="sm" variant="ghost">
                    Log out
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Button asChild size="sm" variant="ghost">
                  <Link href="/login">Log in</Link>
                </Button>
              </>
            )}
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}
