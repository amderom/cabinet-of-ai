/**
 * Llull's Art, as rules: the alphabet, the 84 columns the fourth figure turns out,
 * and the 20 chambers of each column in the order of his Table.
 * Sources: Ars brevis (1308) and Ars generalis ultima (1305–1308), Part 5;
 * docs/features/llull/sources/how-the-art-works.md. No drawing here (ADR 006).
 */

export const LETTERS = ["B", "C", "D", "E", "F", "G", "H", "I", "K"] as const;
export type Letter = (typeof LETTERS)[number];

export interface Meanings {
  dignity: string;
  relation: string;
  question: string;
  subject: string;
  virtue: string;
  vice: string;
}

/** The six meanings of each letter. D is Eternity (Llull also calls it Duration). */
export const ALPHABET: Record<Letter, Meanings> = {
  B: { dignity: "Goodness", relation: "Difference", question: "Whether?", subject: "God", virtue: "Justice", vice: "Avarice" },
  C: { dignity: "Greatness", relation: "Concordance", question: "What?", subject: "Angel", virtue: "Prudence", vice: "Gluttony" },
  D: { dignity: "Eternity", relation: "Contrariety", question: "Of what?", subject: "Heaven", virtue: "Fortitude", vice: "Lust" },
  E: { dignity: "Power", relation: "Beginning", question: "Why?", subject: "Man", virtue: "Temperance", vice: "Pride" },
  F: { dignity: "Wisdom", relation: "Middle", question: "How much?", subject: "The imaginative", virtue: "Faith", vice: "Accidie" },
  G: { dignity: "Will", relation: "End", question: "What kind?", subject: "The sensitive", virtue: "Hope", vice: "Envy" },
  H: { dignity: "Virtue", relation: "Majority", question: "When?", subject: "The vegetative", virtue: "Charity", vice: "Ire" },
  I: { dignity: "Truth", relation: "Equality", question: "Where?", subject: "The elementative", virtue: "Patience", vice: "Lying" },
  K: { dignity: "Glory", relation: "Minority", question: "How? With what?", subject: "The instrumentative", virtue: "Pity", vice: "Inconstancy" },
};

/** The 84 columns: every set of three letters, in alphabetical order (BCD, BCE … HIK). */
export function columns(): string[] {
  const out: string[] = [];
  for (let a = 0; a < 9; a++)
    for (let b = a + 1; b < 9; b++)
      for (let c = b + 1; c < 9; c++) out.push(LETTERS[a] + LETTERS[b] + LETTERS[c]);
  return out;
}

/**
 * The 20 chambers of a column, in Llull's order. For BCD: BCDT; then, letter by letter,
 * the pairs starting with it followed by T and each letter (BCTB, BCTC, BCTD, BDTB…),
 * and that letter alone before T followed by each pair (BTBC, BTBD, BTCD); last, TBCD.
 */
export function chambers(column: string): string[] {
  const [a, b, c] = column.split("");
  const pairs = [a + b, a + c, b + c];
  const out = [column + "T"];
  for (const first of [a, b, c]) {
    for (const pair of pairs.filter((p) => p[0] === first)) for (const l of [a, b, c]) out.push(pair + "T" + l);
    for (const pair of pairs) out.push(first + "T" + pair);
  }
  out.push("T" + column);
  return out;
}

/** A chamber read aloud: letters before T as dignities, letters after T as relations. */
export function readChamber(code: string): string[] {
  const [before, after = ""] = code.split("T");
  return [
    ...before.split("").filter(Boolean).map((l) => ALPHABET[l as Letter].dignity),
    ...after.split("").filter(Boolean).map((l) => ALPHABET[l as Letter].relation),
  ];
}
