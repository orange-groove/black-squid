import { Badge, Box, Button, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";

import { BrandMark } from "@/components/site/logo";
import type { Product, ProductStatus } from "@/lib/products";
import { productHref } from "@/lib/products";

const STATUS_META: Record<ProductStatus, { label: string; palette: string }> = {
  available: { label: "Available", palette: "green" },
  beta: { label: "Beta", palette: "purple" },
  "coming-soon": { label: "Coming soon", palette: "gray" },
};

type ProductCardProps = {
  product: Product;
  /** Show the availability badge in the card header. */
  showStatus?: boolean;
  /** Which description to show. */
  body?: "tagline" | "description";
  /** Custom action area. Falls back to a "Learn More" link. */
  footer?: React.ReactNode;
};

// Compact product card used on the /my-products owned-products view.
export function ProductCard({
  product,
  showStatus = false,
  body = "description",
  footer,
}: ProductCardProps) {
  const status = STATUS_META[product.status];

  return (
    <Box
      p={{ base: 6, md: 7 }}
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
          {/* White tile so the transparent, black-artwork logo stays visible
              against the dark card. */}
          <Box bg="white" borderRadius="xl" p={1.5} flexShrink={0}>
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                width={40}
                height={40}
                style={{ display: "block" }}
              />
            ) : (
              <BrandMark size={40} radius="lg" />
            )}
          </Box>
          <Heading size="lg" letterSpacing="-0.02em">
            {product.name}
          </Heading>
        </HStack>
        {showStatus && (
          <Badge colorPalette={status.palette} variant="subtle" borderRadius="full">
            {status.label}
          </Badge>
        )}
      </HStack>

      <Text color="fg.muted" flex="1">
        {body === "tagline" ? product.tagline : product.description}
      </Text>

      <Box>
        {footer ?? (
          <Button asChild variant="outline" colorPalette="brand">
            <Link href={productHref(product)}>Learn More</Link>
          </Button>
        )}
      </Box>
    </Box>
  );
}
