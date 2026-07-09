import type { Metadata } from "next";

import { EZSTEMZ_LICENSE_PRICE } from "@/lib/pricing";
import { PLATFORMS_SHORT } from "@/lib/platforms";

/** Canonical marketing site URL — must match NEXT_PUBLIC_SITE_URL in production. */
export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.blacksquid.com").replace(/\/$/, "");
}

export const SITE_NAME = "Black Squid";

/**
 * Primary search phrases. Use naturally in titles, H1s, and copy — not stuffed.
 * Google largely ignores the meta keywords tag; these guide our metadata strings.
 */
export const SEO_KEYWORDS = [
  "stem separator",
  "AI stem separation",
  "split song into stems",
  "vocal remover",
  "isolate vocals",
  "drum stem extractor",
  "bass stem separation",
  "guitar stem separation",
  "piano stem separation",
  "local stem separation",
  "offline stem splitter",
  "demucs",
  "stem separation software",
  "macOS stem separator",
  "Windows stem separator",
  "DAW stems export",
] as const;

export const DEFAULT_DESCRIPTION =
  `Black Squid builds creative audio software for modern musicians — focused tools for ` +
  `producers, drummers, and creators. Home of EZStemz (local AI stem separation) and ` +
  `KitForge (a visual drum instrument builder).`;

export const OG_IMAGE = {
  url: "/ezstemz-screenshot.png",
  width: 3438,
  height: 1910,
  alt: "Black Squid — creative audio software for modern musicians",
} as const;

/** Shared Open Graph / Twitter defaults for marketing pages. */
export function sharedOpenGraph(title: string, description: string): Metadata["openGraph"] {
  const base = siteUrl();
  return {
    title,
    description,
    url: base,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
    images: [{ ...OG_IMAGE, url: `${base}${OG_IMAGE.url}` }],
  };
}

export function sharedTwitter(title: string, description: string): Metadata["twitter"] {
  return {
    card: "summary_large_image",
    title,
    description,
    images: [`${siteUrl()}${OG_IMAGE.url}`],
  };
}

/** License price as a number for schema.org Offer (strip "$"). */
export function licensePriceAmount(): string {
  return EZSTEMZ_LICENSE_PRICE.replace(/[^0-9.]/g, "") || "20";
}
