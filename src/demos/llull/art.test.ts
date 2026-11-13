import { describe, expect, it } from "vitest";
import { ALPHABET, LETTERS, chambers, columns, readChamber } from "./art";

describe("the alphabet", () => {
  it("has Llull's nine letters, B to K, without J", () => {
    expect(LETTERS).toEqual(["B", "C", "D", "E", "F", "G", "H", "I", "K"]);
  });

  it("gives every letter its six meanings, D as Eternity (the author's choice)", () => {
    expect(ALPHABET.B).toEqual({
      dignity: "Goodness",
      relation: "Difference",
      question: "Whether?",
      subject: "God",
      virtue: "Justice",
      vice: "Avarice",
    });
    expect(ALPHABET.D.dignity).toBe("Eternity");
    expect(ALPHABET.K).toEqual({
      dignity: "Glory",
      relation: "Minority",
      question: "How? With what?",
      subject: "The instrumentative",
      virtue: "Pity",
      vice: "Inconstancy",
    });
  });
});

describe("the fourth figure and the Table", () => {
  it("turns out Llull's 84 columns, from BCD to IK's last, HIK", () => {
    const all = columns();
    expect(all).toHaveLength(84);
    expect(all[0]).toBe("BCD");
    expect(all[1]).toBe("BCE");
    expect(all.at(-1)).toBe("HIK");
    expect(new Set(all).size).toBe(84);
  });

  it("gives column BCD its 20 chambers in Llull's order (Ars generalis ultima, Part 5)", () => {
    expect(chambers("BCD")).toEqual([
      "BCDT", "BCTB", "BCTC", "BCTD", "BDTB", "BDTC", "BDTD", "BTBC", "BTBD", "BTCD",
      "CDTB", "CDTC", "CDTD", "CTBC", "CTBD", "CTCD", "DTBC", "DTBD", "DTCD", "TBCD",
    ]);
  });

  it("makes 20 chambers in every column, 1,680 in all", () => {
    const total = columns().reduce((n, c) => n + chambers(c).length, 0);
    expect(total).toBe(1680);
  });

  it("reads letters before T as dignities and letters after T as relations", () => {
    expect(readChamber("BCTB")).toEqual(["Goodness", "Greatness", "Difference"]);
    expect(readChamber("BCDT")).toEqual(["Goodness", "Greatness", "Eternity"]);
    expect(readChamber("TBCD")).toEqual(["Difference", "Concordance", "Contrariety"]);
  });
});
