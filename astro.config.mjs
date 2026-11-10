// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  integrations: [react(), mdx()],

  // Fonts are downloaded at build time and served from this site
  // (never from a font CDN at runtime). See ADR 003.
  fonts: [
    {
      // Display serif: titles, exhibit names, the scrolling banner.
      provider: fontProviders.fontsource(),
      name: "Instrument Serif",
      cssVariable: "--font-instrument-serif",
      weights: [400],
      styles: ["normal", "italic"],
      fallbacks: ["ui-serif", "Georgia", "serif"],
    },
    {
      // Text sans: reading text, buttons, interface.
      provider: fontProviders.fontsource(),
      name: "Inter Tight",
      cssVariable: "--font-inter-tight",
      weights: ["100 900"],
      styles: ["normal", "italic"],
      fallbacks: ["ui-sans-serif", "system-ui", "sans-serif"],
    },
    {
      // Small mono labels only (e.g. "Essay · 6 min read").
      provider: fontProviders.fontsource(),
      name: "IBM Plex Mono",
      cssVariable: "--font-ibm-plex-mono",
      weights: [400],
      styles: ["normal"],
      fallbacks: ["ui-monospace", "SFMono-Regular", "monospace"],
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
