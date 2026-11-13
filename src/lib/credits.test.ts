import { describe, expect, it } from "vitest";
import { creditFor, creditProblems, creditsFor, uncreditedFiles, uncreditedSounds } from "./credits";

const credits = [
  { id: "the-engine", licence: "Public domain" },
  { id: "swift-portrait", licence: "All rights reserved" },
];

describe("creditFor", () => {
  it("finds a credit by id", () => {
    expect(creditFor(credits, "the-engine", "lagado").licence).toBe("Public domain");
  });

  it("names the exhibit and the id when a credit is missing", () => {
    expect(() => creditFor(credits, "the-machine", "lagado")).toThrow(/"lagado".*"the-machine"/);
  });
});

describe("uncreditedFiles", () => {
  // Image sources as Astro gives them: hashed in a build, /@fs/… with a query in dev.
  const sources = ["/_astro/the-engine.B1x2Yz.png", "/@fs/abs/images/swift-portrait.jpg?origWidth=1247"];

  it("returns nothing when every file has a credit", () => {
    expect(uncreditedFiles(["the-engine.png", "swift-portrait.jpg"], sources)).toEqual([]);
  });

  it("returns the files no credit points to", () => {
    expect(uncreditedFiles(["the-engine.png", "stray.jpg"], sources)).toEqual(["stray.jpg"]);
  });

  it("does not mistake a file for another that starts with the same name", () => {
    expect(uncreditedFiles(["the.png"], ["/_astro/the-engine.B1x2Yz.png"])).toEqual(["the.png"]);
  });

  it("ignores hidden files such as .DS_Store", () => {
    expect(uncreditedFiles([".DS_Store"], sources)).toEqual([]);
  });
});

describe("creditProblems", () => {
  it("finds nothing wrong in valid credits and references", () => {
    expect(creditProblems(credits, ["the-engine", "swift-portrait"])).toEqual([]);
  });

  it("reports duplicate ids", () => {
    expect(creditProblems([...credits, { id: "the-engine", licence: "CC0" }], [])).toEqual([
      'duplicate credit id "the-engine"',
    ]);
  });

  it("reports references to unknown ids", () => {
    expect(creditProblems(credits, ["the-engine", "lost"])).toEqual(['no credit with id "lost"']);
  });

  it("reports an empty licence", () => {
    expect(creditProblems([{ id: "x", licence: " " }], [])).toEqual(['credit "x" has no licence']);
  });

  it("does not ask a cited source (a text the essay refers to) for a licence", () => {
    expect(creditProblems([{ id: "zhao", cited: true }], [])).toEqual([]);
  });

  it("still asks every asset for a licence", () => {
    expect(creditProblems([{ id: "x" }], [])).toEqual(['credit "x" has no licence']);
  });
});

describe("creditsFor", () => {
  const all = [
    { id: "texture", licence: "PD", on: ["demo", "essay", "making-of"] },
    { id: "plate", licence: "PD", on: ["demo"] },
    { id: "zhao", cited: true, on: ["essay"] },
    { id: "figure", licence: "PD", on: ["essay"] },
  ];

  it("keeps only what the page uses, assets and sources apart, in their order", () => {
    const essay = creditsFor(all, "essay");
    expect(essay.assets.map((c) => c.id)).toEqual(["texture", "figure"]);
    expect(essay.sources.map((c) => c.id)).toEqual(["zhao"]);
  });

  it("gives the demo page none of the essay's", () => {
    const demo = creditsFor(all, "demo");
    expect(demo.assets.map((c) => c.id)).toEqual(["texture", "plate"]);
    expect(demo.sources).toEqual([]);
  });
});

describe("uncreditedSounds", () => {
  it("finds a sound file whose name no credit declares", () => {
    expect(uncreditedSounds(["crank.ogg", "crank.m4a", "rattle.ogg"], ["crank"])).toEqual(["rattle.ogg"]);
  });

  it("accepts every format of a declared sound (same name, any extension)", () => {
    expect(uncreditedSounds(["keep.ogg", "keep.m4a"], ["keep"])).toEqual([]);
  });

  it("ignores hidden files such as .DS_Store", () => {
    expect(uncreditedSounds([".DS_Store"], [])).toEqual([]);
  });
});
