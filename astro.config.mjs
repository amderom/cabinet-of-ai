// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import mdx from "@astrojs/mdx";

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  integrations: [react(), mdx()]
});