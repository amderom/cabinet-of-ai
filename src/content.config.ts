import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { researchSchema } from "./lib/research";

// One folder per exhibit under src/content/exhibits/<slug>/. Every collection
// uses the folder name as the entry id, so the three parts share one slug.
// See SPEC.md → Content model.
const base = "./src/content/exhibits";
const folderId = ({ entry }: { entry: string }) => entry.split("/")[0];

const exhibits = defineCollection({
  loader: glob({ base, pattern: "*/exhibit.yaml", generateId: folderId }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    accent: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "accent must be a #RRGGBB colour"),
    status: z.enum(["open", "sealed"]),
    order: z.number().int(),
    credits: z
      .array(
        z.object({
          asset: z.string(),
          source: z.string(),
          author: z.string().optional(),
          licence: z.string(),
          url: z.url().optional(),
        }),
      )
      .default([]),
    research: researchSchema.optional(),
  }),
});

const essays = defineCollection({
  loader: glob({ base, pattern: "*/essay.mdx", generateId: folderId }),
  schema: z.object({ title: z.string(), description: z.string() }),
});

const makingOfs = defineCollection({
  loader: glob({ base, pattern: "*/making-of.mdx", generateId: folderId }),
  schema: z.object({ title: z.string(), description: z.string() }),
});

export const collections = { exhibits, essays, makingOfs };
