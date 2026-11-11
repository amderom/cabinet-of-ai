/**
 * The rules of the Lagado frame, apart from any drawing (see SPEC.md → The machine).
 *
 * The frame is a set of rows, each holding one word per grammatical place
 * (adjective · noun · verb · adjective · noun · adverb). Desktop shows it as a
 * square, places as columns; a phone shows it on its side, places as rows.
 * Turning a crank flips a set of blocks to new words in place: words never move,
 * so every place keeps its grammatical kind. The visitor picks one word per place
 * to compose a sentence.
 *
 * Every function returns a new frame and leaves the old one untouched.
 */
import { FIELD_OF, PLACES, SWIFT_PROJECTS, type Field } from "./words";

export interface Frame {
  /** rows[row][place] = the word showing on that block. */
  rows: string[][];
  /** picks[place] = the row whose word is chosen for that place. */
  picks: number[];
}

/** A number in [0, 1); Math.random in the page, a seeded one in tests. */
export type Random = () => number;

/** A block, as [row, place]. */
type Cell = readonly [number, number];

export function createFrame(rowCount: number, random: Random): Frame {
  if (rowCount < 1) throw new Error("A frame needs at least one row");
  const rows: string[][] = [];
  for (let r = 0; r < rowCount; r++) {
    rows.push(PLACES.map((_, p) => draw(p, rows.map((row) => row[p]), random)));
  }
  return { rows, picks: PLACES.map(() => 0) };
}

/** The crank at the end of a row: every block in that row flips. */
export function turnRow(frame: Frame, row: number, random: Random): Frame {
  checkRow(frame, row);
  return flip(frame, PLACES.map((_, p) => [row, p] as const), random);
}

/** The crank of a grammatical place: every block of that kind flips. */
export function turnPlace(frame: Frame, place: number, random: Random): Frame {
  checkPlace(place);
  return flip(frame, frame.rows.map((_, r) => [r, place] as const), random);
}

/** "Shake the frame": every block flips. */
export function shake(frame: Frame, random: Random): Frame {
  return flip(frame, frame.rows.flatMap((row, r) => row.map((_, p) => [r, p] as const)), random);
}

/** Chooses the word of one row for one place. */
export function pick(frame: Frame, place: number, row: number): Frame {
  checkPlace(place);
  checkRow(frame, row);
  return { rows: frame.rows, picks: frame.picks.map((r, p) => (p === place ? row : r)) };
}

/** The composed sentence: the picked word of each place, in reading order. */
export function sentence(frame: Frame): string[] {
  return frame.picks.map((row, place) => frame.rows[row][place]);
}

export type Combination = { kind: "project"; name: string } | { kind: "field"; field: Field };

/**
 * A sentence worth a little light: one of Swift's own projects (checked first),
 * or two nouns from the same field. Otherwise null.
 */
export function goodCombination(words: readonly string[]): Combination | null {
  const project = SWIFT_PROJECTS.find((p) => Object.entries(p.words).every(([place, word]) => words[Number(place)] === word));
  if (project) return { kind: "project", name: project.name };
  const subject = FIELD_OF.get(words[1]);
  if (subject && subject === FIELD_OF.get(words[4])) return { kind: "field", field: subject };
  return null;
}

/** Small seeded generator (mulberry32), so tests can repeat a run exactly. */
export function seededRandom(seed: number): Random {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Each block gets a new word: never the one it showed, never one already showing in its place.
function flip(frame: Frame, cells: readonly Cell[], random: Random): Frame {
  const rows = frame.rows.map((row) => [...row]);
  for (const [r, p] of cells) {
    rows[r][p] = draw(p, [...rows.map((row) => row[p]), frame.rows[r][p]], random);
  }
  return { rows, picks: [...frame.picks] };
}

function draw(place: number, taken: readonly string[], random: Random): string {
  const free = PLACES[place].words.filter((w) => !taken.includes(w));
  return free[Math.floor(random() * free.length)];
}

function checkRow(frame: Frame, row: number) {
  if (!Number.isInteger(row) || row < 0 || row >= frame.rows.length) {
    throw new Error(`There is no row ${row} (the frame has ${frame.rows.length})`);
  }
}

function checkPlace(place: number) {
  if (!Number.isInteger(place) || place < 0 || place >= PLACES.length) {
    throw new Error(`There is no place ${place} (a sentence has ${PLACES.length})`);
  }
}
