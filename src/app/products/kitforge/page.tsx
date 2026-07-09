import { Button } from "@chakra-ui/react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  LuBlend,
  LuFolderInput,
  LuLayoutGrid,
  LuPackageOpen,
  LuSparkles,
  LuTarget,
} from "react-icons/lu";

import { ProductPageLayout, type ProductFeature } from "@/components/site/product-page-layout";
import { isCheckoutEnabled, PRODUCTS } from "@/lib/products";
import { sharedOpenGraph, sharedTwitter } from "@/lib/seo";

const kitforge = PRODUCTS.kitforge;

const TITLE = "KitForge — build your own virtual drum kit";
const DESCRIPTION =
  "KitForge is a visual drum instrument builder for electronic drummers. Create your own kit " +
  "layout, learn your MIDI mapping, import sample libraries, and swap sounds across packs. " +
  "A Black Squid product.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/products/kitforge" },
  openGraph: sharedOpenGraph(TITLE, DESCRIPTION),
  twitter: sharedTwitter(TITLE, DESCRIPTION),
};

const FEATURES: ProductFeature[] = [
  {
    icon: LuLayoutGrid,
    title: "Visual Kit Builder",
    body: "Drag, resize, and arrange your own electronic drum setup.",
  },
  {
    icon: LuTarget,
    title: "Learn My Kit",
    body: "Hit each pad and KitForge learns your MIDI mapping automatically.",
  },
  {
    icon: LuFolderInput,
    title: "Import Your Samples",
    body: "Import SFZ libraries, loose WAV folders, and native KitForge packs.",
  },
  {
    icon: LuBlend,
    title: "Mix Libraries Together",
    body: "Use a kick from one pack, a snare from another, and cymbals from your own recordings.",
  },
  {
    icon: LuSparkles,
    title: "AI Kit Builder",
    body: "Describe the kit you want and KitForge helps build the layout and sample choices.",
  },
  {
    icon: LuPackageOpen,
    title: "Open Format",
    body: "Create, save, and share portable KitForge packs.",
  },
];

export default function KitforgeProductPage() {
  // Placeholder Stripe wiring — no live checkout until a price id is configured.
  const checkoutReady = isCheckoutEnabled(kitforge);

  return (
    <ProductPageLayout
      eyebrow="Black Squid · Coming Soon"
      headline="Build Your Dream Drum Kit."
      subheadline="KitForge is a visual drum instrument builder for electronic drummers. Create your own kit layout, learn your MIDI mapping, import sample libraries, and swap sounds across packs."
      screenshot={{
        src: "/kitforge-screenshot.png",
        alt: "KitForge visual drum kit builder — pads laid out on a canvas with MIDI note numbers, kit library, and per-piece mixer",
        width: 3452,
        height: 1864,
      }}
      heroCta={
        <Button size="lg" colorPalette="brand" disabled={!checkoutReady} alignSelf="flex-start">
          {checkoutReady ? "Join Beta" : "Join Beta — Coming Soon"}
        </Button>
      }
      featuresEyebrow="What KitForge does"
      featuresTitle="Your kit, your samples, your layout."
      features={FEATURES}
      bottomHeading="KitForge is on the way."
      bottomBody="We're putting the finishing touches on the kit builder. Check back soon to join the beta."
      bottomActions={
        <>
          <Button size="lg" colorPalette="brand" disabled={!checkoutReady}>
            {checkoutReady ? "Join Beta" : "Coming Soon"}
          </Button>
          <Button asChild size="lg" variant="outline" colorPalette="brand">
            <Link href="/#products">Back to Products</Link>
          </Button>
        </>
      }
    />
  );
}
