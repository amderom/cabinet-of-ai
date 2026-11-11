import { describe, expect, it } from "vitest";
import { addLine, editLine, loadFolio, newestFirst, removeLines, saveFolio, shareText, type Line } from "./folio";

const URL = "https://example.test/exhibits/lagado/";
const words = ["Doleful", "Comets", "monetize", "Celestial", "Musick", "softly"];

/** A stand-in for the browser's storage. */
function memoryStorage() {
  const data = new Map<string, string>();
  return {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    data,
  };
}
/** Storage that refuses everything, like some private windows. */
const refusingStorage = {
  getItem: () => {
    throw new Error("denied");
  },
  setItem: () => {
    throw new Error("denied");
  },
};

describe("addLine", () => {
  it("turns the composed words into a sentence with a full stop", () => {
    const folio = addLine([], words, "a");
    expect(folio).toEqual([{ id: "a", text: "Doleful Comets monetize Celestial Musick softly." }]);
  });

  it("keeps lines in the order they were written", () => {
    const folio = addLine(addLine([], words, "a"), ["Noble", "Hogs", "spin", "Lunar", "Silk", "twice"], "b");
    expect(folio.map((l) => l.id)).toEqual(["a", "b"]);
  });

  it("does not change the folio it was given", () => {
    const folio: Line[] = [];
    addLine(folio, words, "a");
    expect(folio).toEqual([]);
  });
});

describe("newestFirst", () => {
  it("shows the newest line first without changing the writing order", () => {
    const folio = addLine(addLine([], words, "a"), words, "b");
    expect(newestFirst(folio).map((l) => l.id)).toEqual(["b", "a"]);
    expect(folio.map((l) => l.id)).toEqual(["a", "b"]);
  });
});

describe("editLine", () => {
  it("replaces the text of one line", () => {
    const folio = addLine(addLine([], words, "a"), words, "b");
    const edited = editLine(folio, "a", "The Comets monetize Musick.");
    expect(edited[0].text).toBe("The Comets monetize Musick.");
    expect(edited[1].text).toBe(folio[1].text);
  });
});

describe("removeLines", () => {
  const folio = addLine(addLine(addLine([], words, "a"), words, "b"), words, "c");

  it("removes one line", () => {
    expect(removeLines(folio, ["b"]).map((l) => l.id)).toEqual(["a", "c"]);
  });

  it("clears everything", () => {
    expect(removeLines(folio, folio.map((l) => l.id))).toEqual([]);
  });

  it("leaves the old folio intact, so Undo can bring it back", () => {
    removeLines(folio, ["a", "b", "c"]);
    expect(folio).toHaveLength(3);
  });
});

describe("shareText", () => {
  it("quotes one line and adds the exhibit's link", () => {
    expect(shareText(["Doleful Comets monetize Celestial Musick softly."], URL)).toBe(
      '"Doleful Comets monetize Celestial Musick softly."\n— written by the Engine of Lagado, no genius or study required\n' + URL,
    );
  });

  it("lists several lines in writing order", () => {
    const text = shareText(["First.", "Second."], URL);
    expect(text.indexOf('"First."')).toBeLessThan(text.indexOf('"Second."'));
    expect(text.endsWith(URL)).toBe(true);
  });
});

describe("saving on the device", () => {
  it("survives a save and load round trip", () => {
    const storage = memoryStorage();
    const folio = addLine(addLine([], words, "a"), words, "b");
    saveFolio(storage, folio);
    expect(loadFolio(storage)).toEqual(folio);
  });

  it("starts empty when nothing was saved", () => {
    expect(loadFolio(memoryStorage())).toEqual([]);
  });

  it("starts empty instead of failing when the saved data is damaged", () => {
    const storage = memoryStorage();
    storage.setItem("lagado-folio", "{not json");
    expect(loadFolio(storage)).toEqual([]);
    storage.setItem("lagado-folio", JSON.stringify([{ id: 1 }, "text", { id: "ok", text: "Kept." }]));
    expect(loadFolio(storage)).toEqual([{ id: "ok", text: "Kept." }]);
  });

  it("works for the visit when the browser refuses storage", () => {
    expect(loadFolio(refusingStorage)).toEqual([]);
    expect(() => saveFolio(refusingStorage, addLine([], words, "a"))).not.toThrow();
    expect(loadFolio(null)).toEqual([]);
    expect(() => saveFolio(null, [])).not.toThrow();
  });
});
