/**
 * The home page's vitrine (Phase 1.3, "Specimens", chosen by the author on 2026-11-13):
 * one floating plate per exhibit, read from the content collection. Pure, so it can be tested.
 */

export interface ExhibitLike {
  id: string;
  data: { title: string; tagline: string; accent: string; status: "open" | "sealed"; order: number; year?: string };
}

export interface Specimen {
  slug: string;
  title: string;
  /** The exhibit's tagline: the card's subtitle. */
  tagline: string;
  /** Year of the idea, if known ("1726", "c. 1305"). */
  year?: string;
  /** The exhibit's own colour, as #RRGGBB and as "r g b" (for rgb(var(--c) / alpha) in CSS). */
  accent: string;
  rgb: string;
  sealed: boolean;
  /** Only open exhibits have a page to go to. */
  href?: string;
}

export function hexToRgb(hex: string): string {
  const n = Number.parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

/** One card per exhibit, in cabinet order; only open exhibits get a link. */
export function specimensFrom(exhibits: ExhibitLike[]): Specimen[] {
  return [...exhibits]
    .sort((a, b) => a.data.order - b.data.order)
    .map((exhibit) => {
      const { title, tagline, accent, status, year } = exhibit.data;
      const sealed = status === "sealed";
      return {
        slug: exhibit.id,
        title,
        tagline,
        year,
        accent,
        rgb: hexToRgb(accent),
        sealed,
        href: sealed ? undefined : `/exhibits/${exhibit.id}/`,
      };
    });
}

/**
 * Where each card floats in the case. Everything is a fraction of the case's width, so the
 * layout keeps its shape on any screen: left and top of the card, and its tilt in degrees.
 */
export interface Slot {
  left: number;
  top: number;
  tilt: number;
}

export const MAX_PLATES = 6;

/** Card size as a fraction of the case's width: tall cards, 5 wide by 7 high. */
export const PLATE = { width: 0.47, height: 0.47 * 1.4 } as const;

// Hand-placed so cards overlap a little, like objects laid in a case, without hiding each
// other's titles (earlier cards sit on top; titles are at the bottom of each card).
const LAYOUTS: Record<number, Slot[]> = {
  1: [{ left: 0.26, top: 0.04, tilt: -3 }],
  2: [
    { left: 0.02, top: 0.04, tilt: -5 },
    { left: 0.51, top: 0.4, tilt: 4 },
  ],
  3: [
    { left: 0.02, top: 0.04, tilt: -5 },
    { left: 0.52, top: 0.42, tilt: 5 },
    { left: 0.01, top: 0.86, tilt: -2 },
  ],
  4: [
    { left: 0.02, top: 0.04, tilt: -5 },
    { left: 0.51, top: 0.42, tilt: 5 },
    { left: 0.01, top: 0.86, tilt: -2 },
    { left: 0.51, top: 1.24, tilt: 3 },
  ],
  5: [
    { left: 0.02, top: 0.04, tilt: -5 },
    { left: 0.51, top: 0.42, tilt: 5 },
    { left: 0.01, top: 0.86, tilt: -2 },
    { left: 0.51, top: 1.24, tilt: 3 },
    { left: 0.02, top: 1.68, tilt: -4 },
  ],
  6: [
    { left: 0.02, top: 0.04, tilt: -5 },
    { left: 0.51, top: 0.42, tilt: 5 },
    { left: 0.01, top: 0.86, tilt: -2 },
    { left: 0.51, top: 1.24, tilt: 3 },
    { left: 0.02, top: 1.68, tilt: -4 },
    { left: 0.51, top: 2.06, tilt: 4 },
  ],
};

export function slotsFor(count: number) {
  if (count > MAX_PLATES) {
    throw new Error(`The vitrine holds at most ${MAX_PLATES} cards for now (${count} exhibits); it needs a new layout.`);
  }
  const slots = LAYOUTS[count] ?? [];
  const lowest = Math.max(0, ...slots.map((s) => s.top));
  return {
    slots,
    plateWidth: PLATE.width,
    plateHeight: PLATE.height,
    /** Height of the case as a fraction of its width (room for the drift and the tilt below). */
    caseHeight: count === 0 ? 0 : lowest + PLATE.height + 0.06,
  };
}
