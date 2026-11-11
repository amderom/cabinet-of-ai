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

/** Every tab an exhibit page can show: the demo, its two written parts and the optional original text. */
export type ExhibitTab = "demo" | ExhibitPart | "original";

/**
 * Open exhibits that have an original text (an `original.mdx`), in cabinet order.
 * Only these get the /original/ page and its tab; an exhibit still in copyright never does.
 */
export function withOriginal<T extends ExhibitLike>(exhibits: T[], originalIds: string[]): T[] {
  return openExhibits(exhibits).filter((e) => originalIds.includes(e.id));
}

/** The tabs of an exhibit, in order; "The original" only when the exhibit has one. */
export function exhibitTabs(slug: string, hasOriginal: boolean): { key: ExhibitTab; label: string; href: string }[] {
  const base = `/exhibits/${slug}/`;
  return [
    { key: "demo", label: "Demo", href: base },
    { key: "essay", label: "Essay", href: `${base}essay/` },
    { key: "making-of", label: "Making-of", href: `${base}making-of/` },
    ...(hasOriginal ? [{ key: "original" as const, label: "The original", href: `${base}original/` }] : []),
  ];
}
