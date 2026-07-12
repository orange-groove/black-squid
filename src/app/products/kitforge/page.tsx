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

import { BuyButton } from "@/components/site/buy-button";
import { ProductPageLayout, type ProductFeature } from "@/components/site/product-page-layout";
import { getLicenseStatus } from "@/lib/license";
import { isCheckoutEnabled, PRODUCTS } from "@/lib/products";
import { sharedOpenGraph, sharedTwitter } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";

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

export default async function KitforgeProductPage() {
  const checkoutReady = isCheckoutEnabled(kitforge);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const status = user ? await getLicenseStatus(user.id, "kitforge") : null;

  const buy = checkoutReady ? (
    <BuyButton
      product="kitforge"
      productName="KitForge"
      price={kitforge.price ?? undefined}
      hasLicense={status?.hasLicense ?? false}
      isLoggedIn={Boolean(user)}
      returnTo="/products/kitforge"
    />
  ) : (
    <Button size="lg" colorPalette="brand" disabled>
      Coming Soon
    </Button>
  );

  return (
    <ProductPageLayout
      eyebrow="Black Squid · Beta"
      headline="Build Your Dream Drum Kit."
      subheadline="KitForge is a visual drum instrument builder for electronic drummers. Create your own kit layout, learn your MIDI mapping, import sample libraries, and swap sounds across packs."
      screenshot={{
        src: "/kitforge-screenshot.png",
        alt: "KitForge visual drum kit builder — pads laid out on a canvas with MIDI note numbers, kit library, and per-piece mixer",
        width: 3452,
        height: 1864,
      }}
      heroCta={buy}
      featuresEyebrow="What KitForge does"
      featuresTitle="Your kit, your samples, your layout."
      features={FEATURES}
      bottomHeading="Join the KitForge beta."
      bottomBody="KitForge is free while in beta — grab it, build a kit, and help shape where it goes next."
      bottomActions={
        <>
          {buy}
          <Button asChild size="lg" variant="outline" colorPalette="brand">
            <Link href="/#products">Back to Products</Link>
          </Button>
        </>
      }
    />
  );
}
