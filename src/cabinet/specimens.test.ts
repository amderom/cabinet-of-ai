import { describe, expect, it } from "vitest";
import { MAX_PLATES, hexToRgb, slotsFor, specimensFrom } from "./specimens";

const exhibit = (id: string, order: number, status: "open" | "sealed", extra = {}) => ({
  id,
  data: { title: id.toUpperCase(), accent: "#FF5F1F", status, order, year: "1726", ...extra },
});

describe("specimensFrom", () => {
  it("gives one plate per exhibit, in cabinet order, numbered from 01", () => {
    const plates = specimensFrom([exhibit("hesse", 3, "sealed"), exhibit("lagado", 1, "open"), exhibit("llull", 2, "sealed")]);
    expect(plates.map((p) => [p.slug, p.number])).toEqual([
      ["lagado", "01"],
      ["llull", "02"],
      ["hesse", "03"],
    ]);
  });

  it("links only open exhibits, to their demo page", () => {
    const [open, sealed] = specimensFrom([exhibit("lagado", 1, "open"), exhibit("llull", 2, "sealed")]);
    expect(open.href).toBe("/exhibits/lagado/");
    expect(open.sealed).toBe(false);
    expect(sealed.href).toBeUndefined();
    expect(sealed.sealed).toBe(true);
  });

  it("labels each plate with its number and year, or the number alone", () => {
    const [a, b] = specimensFrom([exhibit("lagado", 1, "open"), exhibit("llull", 2, "sealed", { year: undefined })]);
    expect(a.label).toBe("01 · 1726");
    expect(b.label).toBe("02");
  });

  it("keeps the exhibit's own colour, as hex and as r g b", () => {
    const [p] = specimensFrom([exhibit("hesse", 3, "sealed", { accent: "#00E0FF" })]);
    expect(p.accent).toBe("#00E0FF");
    expect(p.rgb).toBe("0 224 255");
  });
});

describe("hexToRgb", () => {
  it("turns #RRGGBB into space-separated channels", () => {
    expect(hexToRgb("#ff2d55")).toBe("255 45 85");
  });
});

describe("slotsFor", () => {
  it.each([1, 2, 3, 4, 5, 6])("places %i plates inside the case", (n) => {
    const { slots, plateWidth, plateHeight, caseHeight } = slotsFor(n);
    expect(slots).toHaveLength(n);
    for (const s of slots) {
      expect(s.left).toBeGreaterThanOrEqual(0);
      expect(s.left + plateWidth).toBeLessThanOrEqual(100);
      // Heights are in px of the case; plates may tilt a few degrees, so keep a margin.
      expect(s.top).toBeGreaterThanOrEqual(8);
      expect(s.top + plateHeight).toBeLessThanOrEqual(caseHeight - 8);
    }
  });

  it("refuses more plates than it has places for", () => {
    expect(() => slotsFor(MAX_PLATES + 1)).toThrow(/at most 6/);
  });
});
