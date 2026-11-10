import { describe, expect, it } from "vitest";
import { missingParts, openExhibits, sortByOrder } from "./exhibits";

// Minimal fixtures shaped like `exhibits` collection entries.
const exhibit = (id: string, order: number, status: "open" | "sealed") => ({
  id,
  data: { order, status },
});

const hesse = exhibit("hesse", 3, "sealed");
const lagado = exhibit("lagado", 1, "open");
const llull = exhibit("llull", 2, "sealed");
const babbage = exhibit("babbage", 4, "open");

describe("sortByOrder", () => {
  it("returns exhibits in cabinet order without changing the input", () => {
    const input = [hesse, lagado, llull];
    expect(sortByOrder(input).map((e) => e.id)).toEqual(["lagado", "llull", "hesse"]);
    expect(input.map((e) => e.id)).toEqual(["hesse", "lagado", "llull"]);
  });
});

describe("openExhibits", () => {
  it("keeps only open exhibits, in order", () => {
    expect(openExhibits([babbage, hesse, lagado, llull]).map((e) => e.id)).toEqual([
      "lagado",
      "babbage",
    ]);
  });
});

describe("missingParts", () => {
  it("reports nothing when every open exhibit has its essay and making-of", () => {
    expect(missingParts([lagado, llull], ["lagado"], ["lagado"])).toEqual([]);
  });

  it("names each open exhibit and the parts it lacks", () => {
    expect(missingParts([lagado, babbage], ["lagado"], [])).toEqual([
      { id: "lagado", missing: ["making-of"] },
      { id: "babbage", missing: ["essay", "making-of"] },
    ]);
  });

  it("ignores sealed exhibits, which have no pages", () => {
    expect(missingParts([hesse, llull], [], [])).toEqual([]);
  });
});
