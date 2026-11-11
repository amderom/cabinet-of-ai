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
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      tagline: z.string(),
      accent: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "accent must be a #RRGGBB colour"),
      status: z.enum(["open", "sealed"]),
      order: z.number().int(),
      // Every third-party (or author-provided) asset, declared once. Images are
      // placed elsewhere by their id (figures, texture, hero). See ADR 005.
      credits: z
        .array(
          z
            .object({
              id: z.string().regex(/^[a-z0-9-]+$/, "credit id must be kebab-case"),
              asset: z.string(),
              source: z.string(),
              author: z.string().optional(),
              licence: z.string().trim().min(1, "every credit needs a licence"),
              url: z.url().optional(),
              /** Image file, relative to exhibit.yaml (e.g. ./images/the-engine.png). */
              file: image().optional(),
              /** Optional tighter crop served on small screens. */
              phoneFile: image().optional(),
              alt: z.string().optional(),
              caption: z.string().optional(),
              /** Sound name, matching every file of that name in src/demos/<slug>/sounds/ (e.g. crank → crank.ogg, crank.m4a). */
              sound: z.string().regex(/^[a-z0-9-]+$/, "sound name must be kebab-case").optional(),
            })
            .refine((c) => !c.file || (c.alt && c.alt.trim().length > 0), {
              message: "an image credit needs alt text",
            }),
        )
        .default([]),
      research: researchSchema.optional(),
      /** Id of the credited image used as the background texture. */
      texture: z.string().optional(),
      /** Id of the credited image that greets visitors on the landing page (shown from Part 2). */
      hero: z.string().optional(),
      /** Small tilted label above the title on the demo page, e.g. "In beta since 1726". */
      sticker: z.string().optional(),
      /** Parody lines for the scrolling banner under the demo. */
      banner: z.array(z.string().trim().min(1)).optional(),
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

// Optional: the historical text an exhibit rebuilds, when it is in the public domain.
// `credit` is the id of its credit in exhibit.yaml (edition, editor, year, source, licence).
const originals = defineCollection({
  loader: glob({ base, pattern: "*/original.mdx", generateId: folderId }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    /** One line under the title: where the passage comes from (shown as a small label). */
    lead: z.string(),
    credit: z.string(),
  }),
});

export const collections = { exhibits, essays, makingOfs, originals };
