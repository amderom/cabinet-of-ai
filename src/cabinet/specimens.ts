/**
 * The home page's vitrine (Phase 1.3, "Specimens", chosen by the author on 2026-11-13):
 * one floating plate per exhibit, read from the content collection. Pure, so it can be tested.
 */

export interface ExhibitLike {
  id: string;
  data: { title: string; accent: string; status: "open" | "sealed"; order: number; year?: string };
}

export interface Specimen {
  slug: string;
  title: string;
  /** "01 · 1726": the plate's number in the cabinet, then the year of the idea if known. */
  label: string;
  number: string;
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

/** One plate per exhibit, in cabinet order; only open exhibits get a link. */
export function specimensFrom(exhibits: ExhibitLike[]): Specimen[] {
  return [...exhibits]
    .sort((a, b) => a.data.order - b.data.order)
    .map((exhibit, i) => {
      const number = String(i + 1).padStart(2, "0");
      const { title, accent, status, year } = exhibit.data;
      const sealed = status === "sealed";
      return {
        slug: exhibit.id,
        title,
        number,
        year,
        label: year ? `${number} · ${year}` : number,
        accent,
        rgb: hexToRgb(accent),
        sealed,
        href: sealed ? undefined : `/exhibits/${exhibit.id}/`,
      };
    });
}

/** Where each plate floats in the case: left in % of the case's width, top in px, tilt in degrees. */
export interface Slot {
  left: number;
  top: number;
  tilt: number;
}

export const MAX_PLATES = 6;

// Hand-placed so plates overlap a little, like objects laid in a case, without hiding each
// other's titles (the title sits at the bottom of each plate). Phone first: the case is the
// width of the column; heights in px.
const LAYOUTS: Record<number, Slot[]> = {
  1: [{ left: 26, top: 40, tilt: -3 }],
  2: [
    { left: 2, top: 30, tilt: -5 },
    { left: 51, top: 150, tilt: 4 },
  ],
  3: [
    { left: 2, top: 30, tilt: -5 },
    { left: 52, top: 160, tilt: 5 },
    { left: 0, top: 330, tilt: -2 },
  ],
  4: [
    { left: 2, top: 24, tilt: -5 },
    { left: 51, top: 130, tilt: 5 },
    { left: 6, top: 290, tilt: -2 },
    { left: 51, top: 400, tilt: 3 },
  ],
  5: [
    { left: 2, top: 24, tilt: -5 },
    { left: 51, top: 120, tilt: 5 },
    { left: 4, top: 280, tilt: -2 },
    { left: 51, top: 380, tilt: 3 },
    { left: 18, top: 540, tilt: -4 },
  ],
  6: [
    { left: 2, top: 24, tilt: -5 },
    { left: 51, top: 120, tilt: 5 },
    { left: 4, top: 280, tilt: -2 },
    { left: 51, top: 380, tilt: 3 },
    { left: 2, top: 540, tilt: -4 },
    { left: 51, top: 640, tilt: 4 },
  ],
};

/** Plate size: 47% of the case's width, 226px tall (168 × 226 on a 358px phone column). */
export const PLATE = { width: 47, height: 226 } as const;

export function slotsFor(count: number) {
  if (count > MAX_PLATES) {
    throw new Error(`The vitrine holds at most ${MAX_PLATES} plates for now (${count} exhibits); it needs a new layout.`);
  }
  const slots = LAYOUTS[count] ?? [];
  const lowest = Math.max(0, ...slots.map((s) => s.top));
  return {
    slots,
    plateWidth: PLATE.width,
    plateHeight: PLATE.height,
    // Room under the lowest plate for the chosen plate's caption and button.
    caseHeight: count === 0 ? 0 : lowest + PLATE.height + 24,
  };
}
