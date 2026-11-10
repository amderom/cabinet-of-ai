/**
 * Pure helpers over the `exhibits` collection. They take only the fields they
 * need, so they work on real collection entries and on small test fixtures.
 */

export type ExhibitStatus = "open" | "sealed";

export interface ExhibitLike {
  id: string;
  data: { order: number; status: ExhibitStatus };
}

export type ExhibitPart = "essay" | "making-of";

/** Exhibits in cabinet order. Does not change the input. */
export function sortByOrder<T extends ExhibitLike>(exhibits: T[]): T[] {
  return [...exhibits].sort((a, b) => a.data.order - b.data.order);
}

/** Open exhibits only (the ones with public pages), in cabinet order. */
export function openExhibits<T extends ExhibitLike>(exhibits: T[]): T[] {
  return sortByOrder(exhibits).filter((e) => e.data.status === "open");
}

/** Open exhibits that lack their essay or making-of, with what is missing. */
export function missingParts(
  exhibits: ExhibitLike[],
  essayIds: string[],
  makingOfIds: string[],
): { id: string; missing: ExhibitPart[] }[] {
  return openExhibits(exhibits)
    .map((e) => ({
      id: e.id,
      missing: [
        ...(essayIds.includes(e.id) ? [] : (["essay"] as const)),
        ...(makingOfIds.includes(e.id) ? [] : (["making-of"] as const)),
      ],
    }))
    .filter((r) => r.missing.length > 0);
}
