import { Box, Button, HStack, Stack, Text } from "@chakra-ui/react";
import type { Metadata } from "next";
import Link from "next/link";
import { LuLock, LuSlidersHorizontal, LuSparkles } from "react-icons/lu";

import { BuyButton } from "@/components/site/buy-button";
import { ProductPageLayout, type ProductFeature } from "@/components/site/product-page-layout";
import { getLicenseStatus } from "@/lib/license";
import { EZSTEMZ_LICENSE_PRICE } from "@/lib/pricing";
import { PLATFORMS_SHORT } from "@/lib/platforms";
import { sharedOpenGraph, sharedTwitter } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";

const TITLE = "EZStemz — AI stem separator (local, offline)";
const DESCRIPTION =
  "Split any song into drums, bass, vocals, guitar, piano, and other stems on your Mac or PC. " +
  "Local AI stem separation — no cloud upload, no subscription. A Black Squid product.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/products/ezstemz" },
  openGraph: sharedOpenGraph(TITLE, DESCRIPTION),
  twitter: sharedTwitter(TITLE, DESCRIPTION),
};

const FEATURES: ProductFeature[] = [
  {
    icon: LuLock,
    title: "100% local",
    body:
      "Separation runs on your CPU — audio is never uploaded for processing. The desktop app works offline. " +
      "Create a free account here only to buy your license and download installers.",
  },
  {
    icon: LuSparkles,
    title: "6-stem model",
    body: "Drums, bass, vocals, guitar, piano, and other",
  },
  {
    icon: LuSlidersHorizontal,
    title: "Mix and export",
    body:
      "Mute, solo, and gain per stem. Export 44.1 kHz WAVs to your DAW or mix in the app using plugins.",
  },
];

const FAQ = [
  { q: "Does this need an internet connection?", a: "No, it runs entirely offline." },
  {
    q: "Will my GPU make it faster?",
    a: "Not yet. Everything runs on the CPU today. Apple Silicon is fastest; Intel and Windows take a bit longer.",
  },
  {
    q: "Which formats can I drop in?",
    a: "MP3, WAV, FLAC, AIFF, OGG, plus M4A on macOS. Output is always 44.1 kHz stereo WAV.",
  },
  {
    q: "Is there a free trial?",
    a: "There's a single one-time purchase that includes lifetime updates and re-downloads on any of your machines. No subscription.",
  },
  {
    q: "Can I get a refund?",
    a: "Yes — if the app doesn't work on your machine, email hello@ezstemz.com within 14 days and we'll refund in full.",
  },
];

export default async function EzstemzProductPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const status = user ? await getLicenseStatus(user.id) : null;

  const heroCta = (
    <Stack gap={4}>
      <BuyButton hasLicense={status?.hasLicense ?? false} isLoggedIn={Boolean(user)} />
      <HStack gap={6} color="fg.muted" fontSize="sm" flexWrap="wrap">
        <HStack gap={2}>
          <Box w="6px" h="6px" borderRadius="full" bg="green.400" />
          <Text>One-time purchase</Text>
        </HStack>
        <HStack gap={2}>
          <Box w="6px" h="6px" borderRadius="full" bg="green.400" />
          <Text>{PLATFORMS_SHORT}</Text>
        </HStack>
        <HStack gap={2}>
          <Box w="6px" h="6px" borderRadius="full" bg="green.400" />
          <Text>14-day refund</Text>
        </HStack>
      </HStack>
    </Stack>
  );

  return (
    <ProductPageLayout
      eyebrow="Black Squid · Available"
      headline="Split any song into clean stems — on your own machine."
      subheadline={
        <>
          Drop in MP3, WAV, FLAC, AIFF, OGG, or M4A (macOS). Get drums, bass, vocals, guitar,
          piano, and &quot;other&quot; as separate 44.1&nbsp;kHz WAVs in a few minutes. No cloud
          upload, no recurring fee.
        </>
      }
      screenshot={{
        src: "/ezstemz-screenshot.png",
        alt: "EZStemz showing six stem tracks with waveforms and a mixer window",
        width: 3438,
        height: 1910,
      }}
      heroCta={heroCta}
      featuresEyebrow="Why EZStemz"
      featuresTitle="Everything runs on your machine."
      features={FEATURES}
      faq={FAQ}
      bottomHeading="Ready to break a song apart?"
      bottomBody="One purchase, lifetime updates, runs forever offline."
      bottomActions={
        <>
          <Button asChild size="lg" colorPalette="brand">
            <Link href="/pricing">Buy EZStemz — {EZSTEMZ_LICENSE_PRICE}</Link>
          </Button>
          <Button asChild size="lg" variant="outline" colorPalette="brand">
            <Link href="/#products">Back to Products</Link>
          </Button>
        </>
      }
    />
  );
}
