import { Badge, Box, Container, Grid, GridItem, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import Image from "next/image";

import { FaqSchema } from "@/components/seo/site-schemas";

export type ProductFeature = {
  icon: React.ElementType;
  title: string;
  body: string;
};

export type ProductScreenshot = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type ProductFaqEntry = { q: string; a: string };

type ProductPageLayoutProps = {
  /** Small pill above the headline, e.g. "Black Squid · Available". */
  eyebrow: string;
  headline: string;
  subheadline: React.ReactNode;
  screenshot: ProductScreenshot;
  /** Primary hero call-to-action area (buy button, coming-soon button, etc.). */
  heroCta: React.ReactNode;
  featuresEyebrow: string;
  featuresTitle: string;
  features: ProductFeature[];
  /** Optional FAQ section (also emits FAQ structured data). */
  faq?: ProductFaqEntry[];
  bottomHeading: string;
  bottomBody: React.ReactNode;
  bottomActions: React.ReactNode;
};

// Shared marketing layout so every product page matches: a hero with the
// description on the left and the app screenshot on the right (stacked on
// mobile), a feature-card grid, an optional FAQ, and a closing CTA band.
export function ProductPageLayout({
  eyebrow,
  headline,
  subheadline,
  screenshot,
  heroCta,
  featuresEyebrow,
  featuresTitle,
  features,
  faq,
  bottomHeading,
  bottomBody,
  bottomActions,
}: ProductPageLayoutProps) {
  return (
    <>
      {faq && <FaqSchema entries={faq} />}

      {/* Hero: description (left) + screenshot (right), wraps on mobile */}
      <Box position="relative" overflow="hidden" borderBottomWidth="1px" borderColor="border.subtle">
        <Box
          position="absolute"
          inset={0}
          bgGradient="radial-gradient(60% 60% at 85% 0%, rgba(255,255,255,0.05), transparent 70%)"
          pointerEvents="none"
        />
        <Container maxW="6xl" py={{ base: 14, md: 24 }} position="relative">
          <Grid
            templateColumns={{ base: "1fr", lg: "1fr 1.15fr" }}
            gap={{ base: 10, lg: 12 }}
            alignItems="center"
          >
            <Stack gap={6}>
              <Badge colorPalette="gray" variant="subtle" borderRadius="full" alignSelf="flex-start">
                {eyebrow}
              </Badge>
              <Heading as="h1" size={{ base: "3xl", md: "5xl" }} lineHeight="1.05" letterSpacing="-0.03em">
                {headline}
              </Heading>
              <Text fontSize={{ base: "lg", md: "xl" }} color="fg.muted">
                {subheadline}
              </Text>
              {heroCta}
            </Stack>

            <Box
              position="relative"
              borderWidth="1px"
              borderColor="border.subtle"
              borderRadius="xl"
              overflow="hidden"
              bg="bg.subtle"
              boxShadow="0 24px 80px rgba(0, 0, 0, 0.6)"
            >
              <Image
                src={screenshot.src}
                alt={screenshot.alt}
                width={screenshot.width}
                height={screenshot.height}
                sizes="(max-width: 1024px) 100vw, 55vw"
                priority
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </Box>
          </Grid>
        </Container>
      </Box>

      {/* Features */}
      <Container maxW="6xl" py={{ base: 16, md: 24 }} id="features">
        <Stack gap={3} mb={12} maxW="2xl">
          <Text color="fg.muted" fontWeight="semibold" fontSize="sm" letterSpacing="0.1em" textTransform="uppercase">
            {featuresEyebrow}
          </Text>
          <Heading size={{ base: "2xl", md: "3xl" }} letterSpacing="-0.02em">
            {featuresTitle}
          </Heading>
        </Stack>

        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
          {features.map((feature) => (
            <GridItem key={feature.title}>
              <Box
                p={6}
                borderWidth="1px"
                borderColor="border.subtle"
                borderRadius="xl"
                h="full"
                bg="bg.subtle"
                _hover={{ borderColor: "border.emphasized" }}
                transition="border-color 0.15s"
              >
                <HStack mb={4} gap={3}>
                  <Box p={2} borderRadius="md" bg="bg.muted" color="white" fontSize="xl">
                    <feature.icon />
                  </Box>
                  <Heading size="md">{feature.title}</Heading>
                </HStack>
                <Text color="fg.muted">{feature.body}</Text>
              </Box>
            </GridItem>
          ))}
        </Grid>
      </Container>

      {/* FAQ (optional) */}
      {faq && (
        <Container maxW="3xl" py={{ base: 4, md: 8 }} pb={{ base: 16, md: 24 }} id="faq">
          <Stack gap={3} mb={10}>
            <Text color="fg.muted" fontWeight="semibold" fontSize="sm" letterSpacing="0.1em" textTransform="uppercase">
              FAQ
            </Text>
            <Heading size={{ base: "2xl", md: "3xl" }} letterSpacing="-0.02em">
              Questions before you buy.
            </Heading>
          </Stack>
          <Stack gap={4}>
            {faq.map((entry) => (
              <Box key={entry.q} borderWidth="1px" borderColor="border.subtle" borderRadius="lg" p={5}>
                <Heading size="sm" mb={2}>
                  {entry.q}
                </Heading>
                <Text color="fg.muted">{entry.a}</Text>
              </Box>
            ))}
          </Stack>
        </Container>
      )}

      {/* Closing CTA */}
      <Box borderTopWidth="1px" borderColor="border.subtle" bg="bg.subtle/40">
        <Container maxW="4xl" py={{ base: 14, md: 20 }} textAlign="center">
          <Heading size={{ base: "2xl", md: "3xl" }} letterSpacing="-0.02em" mb={4}>
            {bottomHeading}
          </Heading>
          <Text color="fg.muted" fontSize="lg" mb={6}>
            {bottomBody}
          </Text>
          <HStack justify="center" gap={3} flexWrap="wrap">
            {bottomActions}
          </HStack>
        </Container>
      </Box>
    </>
  );
}
