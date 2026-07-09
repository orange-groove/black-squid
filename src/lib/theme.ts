"use client";

import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

// Black Squid brand — a minimal, premium monochrome palette. Pure-black
// canvas, white text, subtle gray surfaces and borders. `colorPalette="brand"`
// resolves to a white solid button with black text for a clean, high-end
// audio-software feel.
const config = defineConfig({
  globalCss: {
    "html, body": {
      backgroundColor: "black",
      color: "white",
    },
    "::selection": {
      backgroundColor: "whiteAlpha.300",
    },
  },
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#fafafa" },
          100: { value: "#f4f4f5" },
          200: { value: "#e4e4e7" },
          300: { value: "#d4d4d8" },
          400: { value: "#a1a1aa" },
          500: { value: "#71717a" },
          600: { value: "#52525b" },
          700: { value: "#3f3f46" },
          800: { value: "#27272a" },
          900: { value: "#18181b" },
          950: { value: "#09090b" },
        },
      },
      fonts: {
        heading: {
          value:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
        body: {
          value:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
        mono: {
          value:
            'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        },
      },
    },
    semanticTokens: {
      colors: {
        // Premium monochrome: solid surfaces are white so primary CTAs read as
        // white-on-black. Accents (eyebrows, links) fall back to light grays.
        brand: {
          solid: { value: "white" },
          contrast: { value: "black" },
          fg: { value: "{colors.brand.200}" },
          muted: { value: "{colors.brand.800}" },
          subtle: { value: "{colors.brand.900}" },
          emphasized: { value: "{colors.brand.300}" },
          focusRing: { value: "{colors.brand.400}" },
        },
        // Pin the neutral surface + border tokens to a true-black scheme so
        // cards sit just above the black canvas with subtle gray hairlines.
        bg: {
          DEFAULT: { value: "#000000" },
          subtle: { value: "#0b0b0d" },
          muted: { value: "#111114" },
          emphasized: { value: "#17171b" },
          panel: { value: "#0b0b0d" },
        },
        border: {
          DEFAULT: { value: "rgba(255,255,255,0.12)" },
          subtle: { value: "rgba(255,255,255,0.08)" },
          muted: { value: "rgba(255,255,255,0.06)" },
          emphasized: { value: "rgba(255,255,255,0.18)" },
        },
        // Pin foreground so text stays legible regardless of color mode.
        fg: {
          DEFAULT: { value: "#fafafa" },
          muted: { value: "#a1a1aa" },
          subtle: { value: "#71717a" },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
