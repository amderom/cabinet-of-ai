import { describe, expect, it } from "vitest";
import { exhibitTabs, missingParts, openExhibits, sortByOrder, withOriginal } from "./exhibits";

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

describe("withOriginal", () => {
  it("gives the original page only to open exhibits that have an original text", () => {
    expect(withOriginal([babbage, hesse, lagado, llull], ["lagado", "hesse"]).map((e) => e.id)).toEqual(["lagado"]);
  });

  it("gives it to no exhibit when none has an original", () => {
    expect(withOriginal([lagado, babbage], [])).toEqual([]);
  });
});

describe("exhibitTabs", () => {
  it("shows The original between the essay and the making-of when the exhibit has one", () => {
    expect(exhibitTabs("lagado", true)).toEqual([
      { key: "demo", label: "Demo", href: "/exhibits/lagado/" },
      { key: "essay", label: "Essay", href: "/exhibits/lagado/essay/" },
      { key: "original", label: "The original", href: "/exhibits/lagado/original/" },
      { key: "making-of", label: "Making-of", href: "/exhibits/lagado/making-of/" },
    ]);
  });

  it("has no original tab for an exhibit without one", () => {
    expect(exhibitTabs("babbage", false).map((t) => t.key)).toEqual(["demo", "essay", "making-of"]);
  });
});
