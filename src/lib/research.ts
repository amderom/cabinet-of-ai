/**
 * The published article an exhibit's essay is based on. Stored in the
 * exhibit's metadata so every part (demo, essay, making-of) can link to it.
 */
import { z } from "astro/zod";

export const researchSchema = z.object({
  title: z.string(),
  journal: z.string(),
  issue: z.string().optional(),
  year: z.number().int(),
  url: z.url(),
  doi: z.string().optional(),
  /** Language of the article, shown next to the link (e.g. "French"). */
  language: z.string(),
});

export type Research = z.infer<typeof researchSchema>;
