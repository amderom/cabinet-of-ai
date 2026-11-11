import { describe, expect, it } from "vitest";
import { creditFor, creditProblems, uncreditedFiles, uncreditedSounds } from "./credits";

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
