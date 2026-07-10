// Central product catalogue for the Black Squid hub.
//
// This is the single place to register a Black Squid product. Adding a new
// plugin/app later should be as simple as appending another entry here and
// dropping in a `/products/<slug>` page.
//
// NOTE ON STRIPE: the *live* checkout for EZStemz runs through the
// `/api/checkout` route, which reads the price id straight from the
// `EZSTEMZ_STRIPE_PRICE_ID` env var (server-side). The `priceId` field below is
// metadata used to decide whether a product's purchase button is active. It
// resolves to `null` in the browser bundle (only `NEXT_PUBLIC_*` vars are
// inlined client-side), which is fine — the client only needs the `enabled`
// flag, never the raw id.

import { EZSTEMZ_LICENSE_PRICE } from "./pricing";

export type ProductStatus = "available" | "beta" | "coming-soon";

export type ProductId = "ezstemz" | "kitforge";

export type Product = {
  id: ProductId;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  /** Short feature bullets surfaced on the homepage product listing. */
  highlights: string[];
  status: ProductStatus;
  enabled: boolean;
  priceId: string | null;
  price: string | null;
  image: string | null;
};

export const PRODUCTS: Record<ProductId, Product> = {
  ezstemz: {
    id: "ezstemz",
    name: "EZStemz",
    slug: "ezstemz",
    tagline: "AI stem separation for vocals, drums, bass, and instruments.",
    description:
      "Split any song into drums, bass, vocals, guitar, piano, and other stems — 100% on your own machine. No cloud upload, no subscription.",
    highlights: [
      "6-stem model: drums, bass, vocals, guitar, piano, and other",
      "Runs entirely on your CPU — audio never leaves your computer",
      "Built-in mixer with per-stem gain, mute, solo, and 44.1 kHz WAV export",
      "macOS + Windows · one-time purchase · lifetime updates",
    ],
    status: "available",
    enabled: true,
    // Live EZStemz price id — sourced from EZSTEMZ_STRIPE_PRICE_ID.
    priceId: process.env.EZSTEMZ_STRIPE_PRICE_ID ?? null,
    price: EZSTEMZ_LICENSE_PRICE,
    image: "/ezstemz-logo.png",
  },
  kitforge: {
    id: "kitforge",
    name: "KitForge",
    slug: "kitforge",
    tagline:
      "Build your own virtual electronic drum kit from any compatible samples you own.",
    description:
      "A visual drum instrument builder for electronic drummers. Design your kit layout, learn your MIDI mapping, import sample libraries, and swap sounds across packs.",
    highlights: [
      "Visual drag-and-resize kit builder",
      "Learn My Kit — hit a pad and it maps your MIDI automatically",
      "Import SFZ libraries, loose WAV folders, and native KitForge packs",
      "Mix libraries: kick from one pack, snare from another, your own cymbals",
      "AI Kit Builder — describe a kit and it helps assemble the layout",
    ],
    status: "coming-soon",
    enabled: false,
    // Reads KITFORGE_STRIPE_PRICE_ID once set. To go live: create the Stripe
    // price, set that env var, and flip `enabled` to true (see README).
    priceId: process.env.KITFORGE_STRIPE_PRICE_ID ?? null,
    price: null,
    image: null,
  },
};

export const PRODUCT_LIST: Product[] = Object.values(PRODUCTS);

/** Whether a product can currently be purchased via Stripe checkout. */
export function isCheckoutEnabled(product: Product): boolean {
  return product.enabled && Boolean(product.priceId);
}

export function productHref(product: Product): string {
  return `/products/${product.slug}`;
}
