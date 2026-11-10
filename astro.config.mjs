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
      provider: fontProviders.fontsource(),
      name: "Geist",
      cssVariable: "--font-geist",
      weights: ["100 900"],
      styles: ["normal"],
      fallbacks: ["ui-sans-serif", "system-ui", "sans-serif"],
    },
    {
      provider: fontProviders.fontsource(),
      name: "Newsreader",
      cssVariable: "--font-newsreader",
      weights: ["200 800"],
      styles: ["normal", "italic"],
      fallbacks: ["ui-serif", "Georgia", "serif"],
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
