import { Box, Container, HStack, Link as ChakraLink, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";

export function SiteFooter() {
  return (
    <Box as="footer" borderTopWidth="1px" borderColor="border.subtle" mt={20} py={10}>
      <Container maxW="6xl">
        <Stack
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "flex-start", md: "center" }}
          gap={4}
        >
          <Text fontSize="sm" color="fg.muted">
            © {new Date().getFullYear()} Black Squid. Creative audio software for modern musicians.
          </Text>
          <HStack gap={6} fontSize="sm" flexWrap="wrap">
            <ChakraLink asChild color="fg.muted" _hover={{ color: "fg" }}>
              <Link href="/products/ezstemz">EZStemz</Link>
            </ChakraLink>
            <ChakraLink asChild color="fg.muted" _hover={{ color: "fg" }}>
              <Link href="/products/kitforge">KitForge</Link>
            </ChakraLink>
            <ChakraLink asChild color="fg.muted" _hover={{ color: "fg" }}>
              <Link href="/legal/terms">Terms</Link>
            </ChakraLink>
            <ChakraLink asChild color="fg.muted" _hover={{ color: "fg" }}>
              <Link href="/legal/privacy">Privacy</Link>
            </ChakraLink>
          </HStack>
        </Stack>
      </Container>
    </Box>
  );
}
