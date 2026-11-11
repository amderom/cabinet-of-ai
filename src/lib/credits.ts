/**
 * Pure helpers for exhibit credits: every image is declared once, by id, in
 * the exhibit's `credits`, and everything else (figures, texture, hero)
 * refers to that id. See ADR 005.
 */

export interface CreditLike {
  id: string;
  licence: string;
}

/** The credit for an image id, or a clear error naming the exhibit. */
export function creditFor<T extends CreditLike>(credits: T[], id: string, exhibit: string): T {
  const credit = credits.find((c) => c.id === id);
  if (!credit) {
    throw new Error(`Exhibit "${exhibit}" has no credit with id "${id}" (add it to exhibit.yaml → credits)`);
  }
  return credit;
}

/** Duplicate ids, references to unknown ids, empty licences. */
export function creditProblems(credits: CreditLike[], referencedIds: string[]): string[] {
  const problems: string[] = [];
  const seen = new Set<string>();
  for (const credit of credits) {
    if (seen.has(credit.id)) problems.push(`duplicate credit id "${credit.id}"`);
    seen.add(credit.id);
    if (!credit.licence.trim()) problems.push(`credit "${credit.id}" has no licence`);
  }
  for (const id of referencedIds) {
    if (!seen.has(id)) problems.push(`no credit with id "${id}"`);
  }
  return problems;
}

/**
 * Image files in an exhibit's folder that no credit points to.
 * `sources` are the image URLs Astro gives credited files: the original name
 * followed by a hash (build) or a query string (dev).
 */
export function uncreditedFiles(files: string[], sources: string[]): string[] {
  const names = sources.map((src) => decodeURIComponent(src.split("?")[0].split("/").pop() ?? ""));
  return files.filter((file) => {
    if (file.startsWith(".")) return false;
    const stem = file.slice(0, file.lastIndexOf(".")) || file;
    return !names.some((name) => name === file || name.startsWith(`${stem}.`));
  });
}

/**
 * Sound files in a demo's sounds/ folder that no credit declares. A credit names a sound
 * once (`sound: crank`); every format of it (crank.ogg, crank.m4a) is covered.
 */
export function uncreditedSounds(files: string[], declared: string[]): string[] {
  return files.filter((file) => {
    if (file.startsWith(".")) return false;
    const stem = file.slice(0, file.lastIndexOf(".")) || file;
    return !declared.includes(stem);
  });
}
