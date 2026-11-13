import { describe, expect, it } from "vitest";
import { MAX_PLATES, hexToRgb, slotsFor, specimensFrom } from "./specimens";

const exhibit = (id: string, order: number, status: "open" | "sealed", extra = {}) => ({
  id,
  data: { title: id.toUpperCase(), tagline: `${id} tagline`, accent: "#FF5F1F", status, order, year: "1726", ...extra },
});

describe("specimensFrom", () => {
  it("gives one card per exhibit, in cabinet order", () => {
    const cards = specimensFrom([exhibit("hesse", 3, "sealed"), exhibit("lagado", 1, "open"), exhibit("llull", 2, "sealed")]);
    expect(cards.map((c) => c.slug)).toEqual(["lagado", "llull", "hesse"]);
  });

  it("links only open exhibits, to their demo page", () => {
    const [open, sealed] = specimensFrom([exhibit("lagado", 1, "open"), exhibit("llull", 2, "sealed")]);
    expect(open.href).toBe("/exhibits/lagado/");
    expect(open.sealed).toBe(false);
    expect(sealed.href).toBeUndefined();
    expect(sealed.sealed).toBe(true);
  });

  it("carries the title, the tagline as subtitle, and the year when known", () => {
    const [a, b] = specimensFrom([exhibit("lagado", 1, "open"), exhibit("llull", 2, "sealed", { year: undefined })]);
    expect([a.title, a.tagline, a.year]).toEqual(["LAGADO", "lagado tagline", "1726"]);
    expect(b.year).toBeUndefined();
  });

  it("keeps the exhibit's own colour, as hex and as r g b", () => {
    const [c] = specimensFrom([exhibit("hesse", 3, "sealed", { accent: "#00E0FF" })]);
    expect(c.accent).toBe("#00E0FF");
    expect(c.rgb).toBe("0 224 255");
  });
});

describe("hexToRgb", () => {
  it("turns #RRGGBB into space-separated channels", () => {
    expect(hexToRgb("#ff2d55")).toBe("255 45 85");
  });
});

describe("slotsFor", () => {
  it.each([1, 2, 3, 4, 5, 6])("places %i cards inside the case", (n) => {
    const { slots, plateWidth, plateHeight, caseHeight } = slotsFor(n);
    expect(slots).toHaveLength(n);
    for (const s of slots) {
      expect(s.left).toBeGreaterThanOrEqual(0);
      expect(s.left + plateWidth).toBeLessThanOrEqual(1);
      expect(s.top).toBeGreaterThanOrEqual(0.03);
      expect(s.top + plateHeight).toBeLessThanOrEqual(caseHeight - 0.03);
    }
  });

  it("keeps cards tall: 7 high for 5 wide", () => {
    const { plateWidth, plateHeight } = slotsFor(3);
    expect(plateHeight / plateWidth).toBeCloseTo(1.4);
  });

  it("refuses more cards than it has places for", () => {
    expect(() => slotsFor(MAX_PLATES + 1)).toThrow(/at most 6/);
  });
});
