/**
 * Static paths for an exhibit's essay or making-of page. Stops the build with
 * a clear message if any open exhibit is missing one of its parts.
 */
import { getCollection, type CollectionEntry } from "astro:content";
import { creditProblems, uncreditedFiles, uncreditedSounds } from "./credits";
import { missingParts, openExhibits, withOriginal, type ExhibitPart } from "./exhibits";

/**
 * Stops the build if an exhibit's images or sounds break the credits rule: a file in
 * its images/ folder or its demo's sounds/ folder with no credit, a duplicate id, an
 * empty licence, or a texture/hero/preview pointing to an unknown id. See ADR 005.
 */
// Every file in any exhibit's images/ folder and any demo's sounds/ folder (paths only; nothing is loaded).
const imageFiles = Object.keys(import.meta.glob("/src/content/exhibits/*/images/*"));
const soundFiles = Object.keys(import.meta.glob("/src/demos/*/sounds/*"));

export function checkExhibitAssets(exhibits: CollectionEntry<"exhibits">[]) {
  const lines: string[] = [];
  for (const exhibit of exhibits) {
    const { credits, texture, hero, preview, card } = exhibit.data;
    const referenced = [texture, hero, preview, card].filter((id): id is string => Boolean(id));
    const problems = creditProblems(credits, referenced);

    const prefix = `/src/content/exhibits/${exhibit.id}/images/`;
    const files = imageFiles.filter((f) => f.startsWith(prefix)).map((f) => f.slice(prefix.length));
    const sources = credits.flatMap((c) => [c.file?.src, c.phoneFile?.src]).filter((s): s is string => Boolean(s));
    for (const file of uncreditedFiles(files, sources)) {
      problems.push(`images/${file} has no credit (declare it in exhibit.yaml → credits, with its licence)`);
    }

    const soundPrefix = `/src/demos/${exhibit.id}/sounds/`;
    const sounds = soundFiles.filter((f) => f.startsWith(soundPrefix)).map((f) => f.slice(soundPrefix.length));
    const declared = credits.map((c) => c.sound).filter((s): s is string => Boolean(s));
    for (const file of uncreditedSounds(sounds, declared)) {
      problems.push(`sounds/${file} has no credit (add a credit with "sound: ${file.split(".")[0]}" and its licence)`);
    }
    lines.push(...problems.map((p) => `  - ${exhibit.id}: ${p}`));
  }
  if (lines.length > 0) throw new Error(`Exhibit images or sounds break the credits rule:\n${lines.join("\n")}`);
}

export async function partPaths(part: ExhibitPart) {
  const [exhibits, essays, makingOfs] = await Promise.all([
    getCollection("exhibits"),
    getCollection("essays"),
    getCollection("makingOfs"),
  ]);

  checkExhibitAssets(exhibits);

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

/** Static paths for the optional original page: only open exhibits with an original.mdx. */
export async function originalPaths() {
  const [exhibits, originals] = await Promise.all([getCollection("exhibits"), getCollection("originals")]);
  return withOriginal(
    exhibits,
    originals.map((o) => o.id),
  ).map((exhibit) => ({
    params: { slug: exhibit.id },
    props: { exhibit, entry: originals.find((o) => o.id === exhibit.id)! },
  }));
}
