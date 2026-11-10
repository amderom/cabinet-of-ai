/**
 * Static paths for an exhibit's essay or making-of page. Stops the build with
 * a clear message if any open exhibit is missing one of its parts.
 */
import { getCollection, type CollectionEntry } from "astro:content";
import { missingParts, openExhibits, type ExhibitPart } from "./exhibits";

export async function partPaths(part: ExhibitPart) {
  const [exhibits, essays, makingOfs] = await Promise.all([
    getCollection("exhibits"),
    getCollection("essays"),
    getCollection("makingOfs"),
  ]);

  const problems = missingParts(
    exhibits,
    essays.map((e) => e.id),
    makingOfs.map((m) => m.id),
  );
  if (problems.length > 0) {
    const lines = problems.map(
      (p) => `  - "${p.id}" is open but has no ${p.missing.join(" or ")} (add src/content/exhibits/${p.id}/${p.missing[0]}.mdx)`,
    );
    throw new Error(`Open exhibits are missing parts:\n${lines.join("\n")}`);
  }

  const entries: (CollectionEntry<"essays"> | CollectionEntry<"makingOfs">)[] =
    part === "essay" ? essays : makingOfs;

  return openExhibits(exhibits).map((exhibit) => ({
    params: { slug: exhibit.id },
    props: { exhibit, entry: entries.find((e) => e.id === exhibit.id)! },
  }));
}
