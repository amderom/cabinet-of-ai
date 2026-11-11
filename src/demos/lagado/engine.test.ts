import { describe, expect, it } from "vitest";
import contentDoc from "../../../docs/features/lagado/machine-content.md?raw";
import {
  createFrame,
  goodCombination,
  pick,
  seededRandom,
  sentence,
  shake,
  turnPlace,
  turnRow,
  type Frame,
} from "./engine";
import { FIELD_OF, PLACES, SWIFT_PROJECTS } from "./words";

const column = (frame: Frame, place: number) => frame.rows.map((row) => row[place]);
const hasDuplicates = (words: string[]) => new Set(words).size !== words.length;

describe("words", () => {
  it("keeps every word to 9 letters or fewer, so it fits a block on a phone", () => {
    const long = PLACES.flatMap((p) => p.words).filter((w) => w.length > 9);
    expect(long).toEqual([]);
  });

  it("has no word twice in the same place", () => {
    for (const place of PLACES) expect(hasDuplicates([...place.words])).toBe(false);
  });

  it("matches the word list validated by the author (machine-content.md)", () => {
    // Every word of the document's lists, cleaned of marks and notes.
    const section = contentDoc.slice(contentDoc.indexOf("## Places 1 and 4"), contentDoc.indexOf("## Samples"));
    const fromDoc = new Set<string>();
    for (const line of section.split("\n")) {
      if (!line.startsWith("|") || /^\|\s*(-|Domain|Words)/.test(line)) continue;
      const cells = line.split("|");
      const cell = cells[cells.length - 2].replace(/\([^)]*\)/g, "");
      for (const raw of cell.split(",")) {
        const word = raw.replace("⚡", "").replace(/\sS\s*$/, "").trim();
        if (word) fromDoc.add(word);
      }
    }
    const inCode = new Set(PLACES.flatMap((p) => p.words));
    expect([...inCode].filter((w) => !fromDoc.has(w))).toEqual([]);
    expect([...fromDoc].filter((w) => !inCode.has(w))).toEqual([]);
  });

  it("gives every noun a field", () => {
    const nouns = [...PLACES[1].words, ...PLACES[4].words];
    expect(nouns.filter((n) => !FIELD_OF.has(n))).toEqual([]);
  });

  it("builds Swift's projects only from real words in the right places", () => {
    for (const project of SWIFT_PROJECTS) {
      for (const [place, word] of Object.entries(project.words)) {
        expect(PLACES[Number(place)].words).toContain(word);
      }
    }
  });
});

describe("createFrame", () => {
  it("makes rows of six words, each from its own place", () => {
    const frame = createFrame(3, seededRandom(1));
    expect(frame.rows).toHaveLength(3);
    for (const row of frame.rows) {
      expect(row).toHaveLength(6);
      row.forEach((word, place) => expect(PLACES[place].words).toContain(word));
    }
  });

  it("never shows the same word twice in one place", () => {
    for (let seed = 1; seed <= 50; seed++) {
      const frame = createFrame(6, seededRandom(seed));
      for (let place = 0; place < 6; place++) expect(hasDuplicates(column(frame, place))).toBe(false);
    }
  });

  it("starts with the first row picked in every place", () => {
    expect(createFrame(6, seededRandom(1)).picks).toEqual([0, 0, 0, 0, 0, 0]);
  });

  it("is repeatable with the same seed", () => {
    expect(createFrame(6, seededRandom(42))).toEqual(createFrame(6, seededRandom(42)));
  });

  it("refuses a frame with no rows", () => {
    expect(() => createFrame(0, seededRandom(1))).toThrow(/at least one row/);
  });
});

describe("turning the cranks", () => {
  const before = createFrame(6, seededRandom(7));

  it("turning a row flips every block in that row, and only that row", () => {
    const after = turnRow(before, 2, seededRandom(8));
    after.rows.forEach((row, r) =>
      row.forEach((word, p) => (r === 2 ? expect(word).not.toBe(before.rows[r][p]) : expect(word).toBe(before.rows[r][p]))),
    );
  });

  it("turning a place flips every block of that kind, and only those", () => {
    const after = turnPlace(before, 4, seededRandom(8));
    after.rows.forEach((row, r) =>
      row.forEach((word, p) => (p === 4 ? expect(word).not.toBe(before.rows[r][p]) : expect(word).toBe(before.rows[r][p]))),
    );
  });

  it("shaking flips every block", () => {
    const after = shake(before, seededRandom(8));
    after.rows.forEach((row, r) => row.forEach((word, p) => expect(word).not.toBe(before.rows[r][p])));
  });

  it("keeps every word in its place and never repeats a word in one place", () => {
    let frame = before;
    const random = seededRandom(9);
    for (let i = 0; i < 200; i++) {
      frame = i % 3 === 0 ? turnRow(frame, i % 6, random) : i % 3 === 1 ? turnPlace(frame, i % 6, random) : shake(frame, random);
      for (let place = 0; place < 6; place++) {
        expect(hasDuplicates(column(frame, place))).toBe(false);
        column(frame, place).forEach((word) => expect(PLACES[place].words).toContain(word));
      }
    }
  });

  it("never shows the same adjective in both adjective places, so a sentence can't repeat one", () => {
    let frame = createFrame(6, seededRandom(21));
    const random = seededRandom(22);
    const shared = (f: Frame) => column(f, 0).filter((w) => column(f, 3).includes(w));
    expect(shared(frame)).toEqual([]);
    for (let i = 0; i < 300; i++) {
      frame = i % 3 === 0 ? turnPlace(frame, i % 2 ? 0 : 3, random) : i % 3 === 1 ? turnRow(frame, i % 6, random) : shake(frame, random);
      expect(shared(frame)).toEqual([]);
    }
  });

  it("leaves the original frame untouched", () => {
    const copy = structuredClone(before);
    turnRow(before, 0, seededRandom(3));
    turnPlace(before, 0, seededRandom(3));
    shake(before, seededRandom(3));
    expect(before).toEqual(copy);
  });

  it("refuses a row or place that doesn't exist", () => {
    expect(() => turnRow(before, 6, seededRandom(1))).toThrow(/row 6/);
    expect(() => turnPlace(before, -1, seededRandom(1))).toThrow(/place -1/);
  });
});

describe("composing a sentence", () => {
  const frame = createFrame(3, seededRandom(11));

  it("reads the picked word of each place, in order", () => {
    expect(sentence(frame)).toEqual(frame.rows[0]);
    const mixed = pick(pick(frame, 2, 1), 5, 2);
    expect(sentence(mixed)).toEqual([
      frame.rows[0][0],
      frame.rows[0][1],
      frame.rows[1][2],
      frame.rows[0][3],
      frame.rows[0][4],
      frame.rows[2][5],
    ]);
  });

  it("keeps the picks when the blocks flip, so the sentence shows the new words", () => {
    const picked = pick(frame, 2, 1);
    const turned = turnPlace(picked, 2, seededRandom(12));
    expect(turned.picks).toEqual(picked.picks);
    expect(sentence(turned)[2]).toBe(turned.rows[1][2]);
    expect(sentence(turned)[2]).not.toBe(sentence(picked)[2]);
  });

  it("refuses a pick outside the frame", () => {
    expect(() => pick(frame, 0, 3)).toThrow(/row 3/);
    expect(() => pick(frame, 6, 0)).toThrow(/place 6/);
  });
});

describe("goodCombination", () => {
  it("names one of Swift's own projects", () => {
    expect(goodCombination(["Noble", "Pupils", "extract", "Solar", "Sun-beams", "daily"])).toEqual({
      kind: "project",
      name: "Sun-beams out of cucumbers",
    });
  });

  it("spots two nouns of the same field", () => {
    expect(goodCombination(["Noble", "Fiddles", "teach", "Solar", "Harmony", "daily"])).toEqual({
      kind: "field",
      field: "musick",
    });
  });

  it("prefers Swift's project when both apply", () => {
    expect(goodCombination(["Noble", "Spiders", "spin", "Hairy", "Silk", "daily"])?.kind).toBe("project");
  });

  it("returns nothing for an ordinary sentence", () => {
    expect(goodCombination(["Noble", "Fiddles", "teach", "Solar", "Gravity", "daily"])).toBeNull();
  });
});

describe("seededRandom", () => {
  it("gives numbers between 0 and 1, the same for the same seed", () => {
    const a = seededRandom(5);
    const b = seededRandom(5);
    for (let i = 0; i < 100; i++) {
      const x = a();
      expect(x).toBe(b());
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThan(1);
    }
  });
});
