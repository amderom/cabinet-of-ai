/**
 * The words on the Lagado frame, one list per grammatical place.
 * Source of truth for the wording: docs/features/lagado/machine-content.md
 * (validated by the operator at Checkpoint A, 2026-11-11).
 *
 * A sentence has six places: adjective · noun · verb · adjective · noun · adverb.
 * Period spellings (Musick, Publick, Errour…) are printed that way in Swift's
 * Voyage to Laputa; Opticks is Newton's title. Every word is 9 letters or fewer
 * so it fits a block on a 375px phone.
 */

export type Field =
  | "academy"
  | "astronomy"
  | "natural-philosophy"
  | "natural-history"
  | "physick"
  | "musick"
  | "letters"
  | "politicks"
  | "start-up";

export interface Place {
  name: "Adjective" | "Noun" | "Verb" | "Adverb";
  words: readonly string[];
}

/** Nouns and the field they belong to, so the machine can spot two nouns of the same field. */
const subjects: Record<Field, string[]> = {
  academy: ["Flappers", "Pupils", "Scribes", "Sages", "Doctors"],
  astronomy: ["Comets", "Planets", "Orreries", "Quadrants", "Eclipses"],
  "natural-philosophy": ["Magnets", "Vials", "Monads", "Fluxions", "Vapours"],
  "natural-history": ["Spiders", "Cucumbers", "Hogs", "Bees", "Monkeys", "Oysters"],
  physick: ["Surgeons", "Humours", "Leeches"],
  musick: ["Fiddles", "Flutes", "Trumpets", "Fugues", "Sonatas"],
  letters: ["Painters", "Syllables", "Nouns", "Poets", "Odes", "Satires"],
  politicks: ["Senators", "Statesmen", "Ministers", "Factions", "Whigs", "Tories"],
  "start-up": ["Unicorns", "Founders", "Chatbots", "Investors"],
};

const objects: Record<Field, string[]> = {
  academy: ["Genius", "Study", "Theology"],
  astronomy: ["Sun-beams", "Eternity", "Zodiack"],
  "natural-philosophy": ["Gunpowder", "Marble", "Ice", "Gravity", "Vacuum", "Chaos", "Magnetism", "Opticks"],
  "natural-history": ["Cobwebs", "Acorns", "Silk"],
  physick: ["Spleen", "Bile", "Colick", "Errour"],
  musick: ["Musick", "Harmony", "Discord"],
  letters: ["Poetry", "Colours", "Pigments", "Wit", "Nonsense", "Sonnets", "Satire"],
  politicks: ["Laws", "Politicks", "Virtue", "Liberty", "Commerce", "Traffick", "Bubbles", "Lotteries"],
  "start-up": ["Synergy", "Data", "Growth", "Tokens", "Bandwidth"],
};

const adjectives = [
  "Learned", "Ingenious", "Laborious", "Noble", "Exalted", "Ignorant", "Broken", "Curious",
  "Celestial", "Lunar", "Solar", "Eclipsed",
  "Mechanick", "Electric", "Gilded",
  "Venomous", "Hairy", "Pickled",
  "Inclement", "Sanguine", "Feverish", "Doleful", "Wretched",
  "Sublime", "Pastoral", "Satirical", "Tuneful", "Shrill",
  "Publick", "Domestick", "Factious", "Loyal", "Pious",
  "Scalable", "Agentic", "Viral", "Seamless", "Lean", "Pre-seed", "Stealth", "Unbundled",
];

const verbs = [
  "extract", "calcine", "soften", "condense", "propagate", "contrive", "improve",
  "measure", "observe", "discover", "compute", "dissect", "distil", "magnify",
  "breed", "spin", "devour", "petrify",
  "cure", "purge", "embalm",
  "teach", "rhyme", "varnish", "ridicule", "flatter", "confound",
  "govern", "besiege", "fortify", "bribe",
  "disrupt", "monetize", "pivot", "scale", "onboard", "upsell", "iterate", "prompt", "gamify",
];

const adverbs = [
  "entirely", "softly", "hourly", "nightly", "gravely", "wisely", "sweetly", "backwards", "slowly", "loudly",
  "privately", "gratis", "forever", "daily", "twice", "abroad", "eternally", "virally", "remotely", "on-chain",
];

/** The six places of a sentence, in reading order. */
export const PLACES: readonly Place[] = [
  { name: "Adjective", words: adjectives },
  { name: "Noun", words: Object.values(subjects).flat() },
  { name: "Verb", words: verbs },
  { name: "Adjective", words: adjectives },
  { name: "Noun", words: Object.values(objects).flat() },
  { name: "Adverb", words: adverbs },
];

/** The field of every noun (subject or object). */
export const FIELD_OF: ReadonlyMap<string, Field> = new Map(
  [subjects, objects].flatMap((group) =>
    (Object.entries(group) as [Field, string[]][]).flatMap(([field, words]) => words.map((w) => [w, field] as const)),
  ),
);

/**
 * Swift's own projects at the Academy (Voyage to Laputa, ch. 5). A sentence that
 * lands on one lights up with its name. Each project names words by place index.
 */
export interface Project {
  name: string;
  words: Readonly<Record<number, string>>;
}

export const SWIFT_PROJECTS: readonly Project[] = [
  { name: "Sun-beams out of cucumbers", words: { 2: "extract", 4: "Sun-beams" } },
  { name: "Ice calcined into gunpowder", words: { 2: "calcine", 4: "Ice" } },
  { name: "Marble softened for pillows", words: { 2: "soften", 4: "Marble" } },
  { name: "Silk from spiders", words: { 1: "Spiders", 2: "spin" } },
  { name: "Ploughing with hogs and acorns", words: { 1: "Hogs", 4: "Acorns" } },
];
