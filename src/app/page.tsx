import {
  Badge,
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  Heading,
  HStack,
  List,
  Stack,
  Text,
} from "@chakra-ui/react";
import type { Metadata } from "next";
import Link from "next/link";
import { LuCheck } from "react-icons/lu";
import Image from "next/image";

import { BrandMark } from "@/components/site/logo";
import { MarketingShell } from "@/components/site/marketing-shell";
import { PRODUCT_LIST, productHref, type ProductStatus } from "@/lib/products";
import { sharedOpenGraph, sharedTwitter, SITE_NAME } from "@/lib/seo";

const STATUS_META: Record<ProductStatus, { label: string; palette: string }> = {
  available: { label: "Available", palette: "green" },
  beta: { label: "Beta", palette: "purple" },
  "coming-soon": { label: "Coming soon", palette: "gray" },
};

const HOME_TITLE = `${SITE_NAME} — creative audio software for modern musicians`;
const HOME_DESCRIPTION =
  "Black Squid builds focused audio tools for producers, drummers, and creators. " +
  "Home of EZStemz and KitForge.";

export const metadata: Metadata = {
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: sharedOpenGraph(HOME_TITLE, HOME_DESCRIPTION),
  twitter: sharedTwitter(HOME_TITLE, HOME_DESCRIPTION),
};

export default function HomePage() {
  return (
    <MarketingShell>
      {/* Hero — white band; the black-on-white logo blends into the background */}
      <Box position="relative" overflow="hidden" bg="white" color="black">
        <Box
          position="absolute"
          inset={0}
          bgGradient="radial-gradient(60% 50% at 50% 0%, rgba(0,0,0,0.05), transparent 70%)"
          pointerEvents="none"
        />
        <Container maxW="4xl" py={{ base: 20, md: 32 }} position="relative">
          <Stack gap={8} align="center" textAlign="center">
            <BrandMark size={96} radius="2xl" />

            <Stack gap={4} align="center">
              <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="medium" color="black">
                Creative audio software for modern musicians.
              </Text>
              <Text fontSize={{ base: "md", md: "lg" }} color="gray.600" maxW="2xl">
                Build, separate, and shape sound with focused tools for producers, drummers,
                and creators.
              </Text>
            </Stack>

            <HStack gap={3} pt={2} flexWrap="wrap" justify="center">
              <Button
                asChild
                size="lg"
                bg="black"
                color="white"
                _hover={{ bg: "gray.800" }}
              >
                <Link href="#products">View Products</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                borderColor="blackAlpha.400"
                color="black"
                _hover={{ bg: "blackAlpha.100" }}
              >
                <Link href="/login">Sign In</Link>
              </Button>
            </HStack>
          </Stack>
        </Container>
      </Box>

      {/* Product cards */}
      <Container maxW="6xl" py={{ base: 12, md: 20 }} id="products" scrollMarginTop="80px">
        <Stack gap={3} mb={10} maxW="2xl">
          <Text
            color="fg.muted"
            fontWeight="semibold"
            fontSize="sm"
            letterSpacing="0.14em"
            textTransform="uppercase"
          >
            The lineup
          </Text>
          <Heading size={{ base: "2xl", md: "3xl" }} letterSpacing="-0.02em">
            Tools built for the way you make music.
          </Heading>
        </Stack>

        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
          {PRODUCT_LIST.map((product) => {
            const status = STATUS_META[product.status];
            const purchasable = product.status === "available";
            return (
              <GridItem key={product.id}>
                <Box
                  p={{ base: 6, md: 8 }}
                  borderWidth="1px"
                  borderColor="border.subtle"
                  borderRadius="2xl"
                  bg="bg.subtle"
                  h="full"
                  display="flex"
                  flexDirection="column"
                  gap={5}
                  transition="border-color 0.15s, transform 0.15s"
                  _hover={{ borderColor: "border.emphasized", transform: "translateY(-2px)" }}
                >
                  <HStack justify="space-between" align="flex-start" gap={4}>
                    <HStack gap={3} align="center">
                      <Box bg="white" borderRadius="xl" p={1.5} flexShrink={0}>
                        {product.image ? (
                          <Image src={product.image} alt={product.name} width={160} height={160} />
                        ) : (
                          <BrandMark size={40} radius="lg" />
                        )}
                      </Box>
                      <Stack gap={0}>
                        <Heading size="lg" letterSpacing="-0.02em">
                          {product.name}
                        </Heading>
                        {product.price && (
                          <Text fontSize="sm" color="fg.muted">
                            from {product.price}
                          </Text>
                        )}
                      </Stack>
                    </HStack>
                    <Badge colorPalette={status.palette} variant="subtle" borderRadius="full">
                      {status.label}
                    </Badge>
                  </HStack>

                  <Text color="fg.muted">{product.description}</Text>

                  <List.Root gap={2} variant="plain">
                    {product.highlights.map((item) => (
                      <List.Item key={item}>
                        <HStack gap={3} align="flex-start">
                          <Box color="white" mt={1} flexShrink={0}>
                            <LuCheck />
                          </Box>
                          <Text fontSize="sm">{item}</Text>
                        </HStack>
                      </List.Item>
                    ))}
                  </List.Root>

                  <HStack gap={3} flexWrap="wrap" mt="auto">
                    {purchasable ? (
                      <Button asChild colorPalette="brand">
                        <Link href="/pricing">
                          Get {product.name}
                          {product.price ? ` — ${product.price}` : ""}
                        </Link>
                      </Button>
                    ) : (
                      <Button colorPalette="brand" disabled>
                        Coming Soon
                      </Button>
                    )}
                    <Button asChild variant="outline" colorPalette="brand">
                      <Link href={productHref(product)}>Learn More</Link>
                    </Button>
                  </HStack>
                </Box>
              </GridItem>
            );
          })}
        </Grid>
      </Container>
    </MarketingShell>
  );
}
