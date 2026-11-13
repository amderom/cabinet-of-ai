/**
 * The nine questions the machine answers: six of Llull's own, three asked in 2026 and
 * answered with his definitions. Validated by the author (2026-11-13); questions.test.ts keeps
 * this file identical to docs/features/llull/questions.md. Each real question follows Llull's own
 * route: R1 through column BCD of his Table (Part 5), R2–R6 through the paragraph his answer points to
 * (Parts 9 and 10). Llull's English: Ars generalis ultima, trans. Yanis Dambergs (c) 2003, quoted briefly with credit.
 */
import type { Letter } from "./art";

export interface Reason {
  /** The letters this reason combines, all from the question's column (e.g. "FK"). */
  letters: string;
  /** What they combine, in words (e.g. "The imagination + Minority"). */
  combines: string;
  /** The reason in one simple sentence, shown first on the page. */
  plain: string;
  /** The reason with Llull's own words (in curly quotes); the page shows the quoted words under the plain sentence. */
  line: string;
  /** Where it comes from in Llull (e.g. "Llull: chamber BCTB (Part 5, ch. 2)"). */
  where: string;
}

export interface Question {
  id: string;
  /** "llull": asked and answered by Llull. "startup": asked in 2026, answered with his definitions. */
  kind: "llull" | "startup";
  question: string;
  /** The question's letters, and what each stands for here. */
  letters: { letter: Letter; as: string }[];
  /** One of the 84 columns: the question's three letters. */
  column: string;
  reasons: Reason[];
  verdict: string;
  source: string;
}

export const QUESTIONS: Question[] = [
  {
    id: "R1",
    kind: "llull",
    question: "Is the world eternal?",
    letters: [
      {
        letter: "B",
        as: "whether",
      },
      {
        letter: "C",
        as: "greatness, implicit",
      },
      {
        letter: "D",
        as: "eternity",
      },
    ],
    column: "BCD",
    reasons: [
      {
        letters: "BCD",
        combines: "Goodness + Greatness + Eternity",
        plain:
          "If the world were eternal, it would be eternally good, and there could be no evil in it.",
        line: "An eternal world would make good last for ever, so there could be no evil in it. “But there is evil in the world as we know by experience.”",
        where: "Llull: chamber BCDT (Part 5, ch. 1)",
      },
      {
        letters: "BC",
        combines: "Goodness + Greatness, through Difference",
        plain:
          "Then there would be two eternities, God's and the world's. That makes no sense.",
        line: "Two eternities, God's and the world's? Difference makes that a confusion.",
        where: "Llull: chamber BCTB (Part 5, ch. 2)",
      },
      {
        letters: "BC",
        combines: "Goodness + Greatness, through Concordance",
        plain:
          "An eternal world would be in eternal harmony. Yet it is full of conflict.",
        line: "An eternal world would hold eternal concordance, but contrariety opposes it.",
        where: "Llull: chamber BCTC (Part 5, ch. 3)",
      },
    ],
    verdict: "No. “Therefore we conclude that the world is not eternal.”",
    source:
      'Ars generalis ultima, Part 5, "One single question", chambers 1–3 of 20.',
  },
  {
    id: "R2",
    kind: "llull",
    question:
      "Is the imagination of irrational animals less than that of humans?",
    letters: [
      {
        letter: "B",
        as: "whether",
      },
      {
        letter: "F",
        as: "the imagination",
      },
      {
        letter: "K",
        as: "minority",
      },
    ],
    column: "BFK",
    reasons: [
      {
        letters: "FK",
        combines: "The imagination + Minority",
        plain:
          "The lesser a thing, the closer it is to nothing. Animal imagination is drawn to small things.",
        line: "“By reason of minority, the imagination is close to naught and it tends toward this minority by objectifying minor objects.”",
        where:
          "Llull: Part 9, the imagination combined with the principles, #19",
      },
      {
        letters: "BF",
        combines: "Whether + the imagination",
        plain:
          "Animals can't grasp what things really are. If they could, they would be doing science.",
        line: "Do animals reach the essence of things with their imagination? “The answer is no, or else, they would be making science, which is impossible.”",
        where: "Llull: Part 11, questions on the imagination",
      },
    ],
    verdict:
      "Yes. “For instance, no irrational animal can imagine a mountain made of gold.”",
    source:
      "Ars generalis ultima, Part 11 (questions on the imagination) and Part 9, #19.",
  },
  {
    id: "R3",
    kind: "llull",
    question: "Why do people enjoy new things?",
    letters: [
      {
        letter: "E",
        as: "why; beginning",
      },
      {
        letter: "H",
        as: "when: time",
      },
      {
        letter: "I",
        as: "where: place",
      },
    ],
    column: "EHI",
    reasons: [
      {
        letters: "HI",
        combines: "Time + Place",
        plain: "Nothing can be new without time and place.",
        line: "“Newness cannot exist without place, time and motion.” Llull adds that rules H and I, when and where, agree.",
        where: "Llull: Part 10, the hundred forms, Newness, #81",
      },
      {
        letters: "E",
        combines: "Beginning",
        plain: "Everything new began somewhere. There was a first new thing.",
        line: "“There had to be a first newness just as there was a first motion, time and place.”",
        where: "Llull: Part 10, the hundred forms, Newness, #81",
      },
    ],
    verdict: "“Because we are on a road.”",
    source:
      "Ars generalis ultima, Part 11 (questions on newness) and Part 10, #81.",
  },
  {
    id: "R4",
    kind: "llull",
    question:
      "Is it legitimate to lie in order to communicate a greater truth?",
    letters: [
      {
        letter: "B",
        as: "whether",
      },
      {
        letter: "I",
        as: "truth",
      },
      {
        letter: "K",
        as: "minority",
      },
    ],
    column: "BIK",
    reasons: [
      {
        letters: "IK",
        combines: "Truth + Minority",
        plain: "A small truth is enough to expose a lie.",
        line: "“Falsehood is clearly revealed by minor truth.”",
        where: "Llull: Part 9, falsehood combined with the principles, #245",
      },
      {
        letters: "BI",
        combines: "Whether + Truth",
        plain:
          "A lie never acts like the truth. That is how the truth finds it out.",
        line: "“Falsehood does not act with acts of truth, hence it follows that it is detected with acts of truth.”",
        where: "Llull: Part 9, falsehood combined with the principles, #244",
      },
    ],
    verdict:
      "Yes, “on the condition that falsehood is not a cause but an occasion.”",
    source:
      "Ars generalis ultima, Part 11 (questions on falsehood) and Part 9, #244–245.",
  },
  {
    id: "R5",
    kind: "llull",
    question:
      "Why can someone who strives to be honored never find his fill of honor?",
    letters: [
      {
        letter: "C",
        as: "what: rule C",
      },
      {
        letter: "E",
        as: "why",
      },
      {
        letter: "H",
        as: "majority",
      },
    ],
    column: "CEH",
    reasons: [
      {
        letters: "C",
        combines: "What honour is",
        plain: "Honour is something you give, and something you receive.",
        line: "“Honor is an active habit of the one who gives honor and a passive habit of the one who is honored.”",
        where: "Llull: Part 10, the hundred forms, Honor, #115",
      },
      {
        letters: "H",
        combines: "Majority",
        plain: "Whoever gives honour stands higher than whoever gets it.",
        line: "“The one who honors is greater than the one honored.”",
        where: "Llull: Part 10, the hundred forms, Honor, #115",
      },
    ],
    verdict: "“Because only God must be honored by men.”",
    source:
      "Ars generalis ultima, Part 11 (questions on honour) and Part 10, #115.",
  },
  {
    id: "R6",
    kind: "llull",
    question: "Why is a glutton never satisfied?",
    letters: [
      {
        letter: "C",
        as: "gluttony",
      },
      {
        letter: "E",
        as: "why; beginning",
      },
      {
        letter: "G",
        as: "end",
      },
    ],
    column: "CEG",
    reasons: [
      {
        letters: "CG",
        combines: "Gluttony + End",
        plain: "Gluttony never brings rest.",
        line: "“The gluttonous man finds no repose in gluttony.”",
        where: "Llull: Part 9, gluttony combined with the principles, #173",
      },
      {
        letters: "CE",
        combines: "Gluttony + Beginning",
        plain: "It starts with joy and ends in sadness.",
        line: "“Gluttony brings joy in the beginning but sadness in the end.”",
        where: "Llull: Part 9, gluttony combined with the principles, #173",
      },
    ],
    verdict: "“Because he is seeking satisfaction through gluttony.”",
    source:
      "Ars generalis ultima, Part 11 (questions on gluttony) and Part 9, #173.",
  },
  {
    id: "S1",
    kind: "startup",
    question: "Will AI take my job?",
    letters: [
      {
        letter: "B",
        as: "whether",
      },
      {
        letter: "G",
        as: "will",
      },
      {
        letter: "K",
        as: "the instruments",
      },
    ],
    column: "BGK",
    reasons: [
      {
        letters: "GK",
        combines: "Will + the instruments",
        plain: "The will is what makes us want things. A tool wants nothing.",
        line: "“Will is that on account of which goodness, greatness etc. are desirable.” An instrument desires nothing.",
        where: "Llull: Part 3, the definitions",
      },
      {
        letters: "K",
        combines: "The instruments",
        plain: "A tool only goes bad in bad hands.",
        line: "Llull on instruments: “an instrument can be evil when used by an evil man for an evil end.”",
        where: "Llull: Part 11, questions on prudence",
      },
    ],
    verdict: "No. An instrument has no will. Ask who holds it.",
    source:
      "Asked in 2026. Answered with Llull's definitions (Ars generalis ultima, Parts 3 and 11).",
  },
  {
    id: "S2",
    kind: "startup",
    question: "Should we pivot?",
    letters: [
      {
        letter: "E",
        as: "beginning",
      },
      {
        letter: "F",
        as: "middle",
      },
      {
        letter: "G",
        as: "end",
      },
    ],
    column: "EFG",
    reasons: [
      {
        letters: "EG",
        combines: "Beginning + End",
        plain: "A beginning only rests when it reaches its end.",
        line: "“The end is that in which the beginning rests.”",
        where: "Llull: Part 3, the definitions",
      },
      {
        letters: "F",
        combines: "Middle",
        plain: "The middle is the road from the beginning to the end.",
        line: "“The middle is the subject through which the end influences the beginning.”",
        where: "Llull: Part 3, the definitions",
      },
    ],
    verdict:
      "No. A beginning rests only in its end. Turn away from it, and you begin again with nowhere to rest.",
    source:
      "Asked in 2026. Answered with Llull's definitions (Ars generalis ultima, Part 3).",
  },
  {
    id: "S3",
    kind: "startup",
    question: "Will the Pope fund my Art?",
    letters: [
      {
        letter: "B",
        as: "whether",
      },
      {
        letter: "E",
        as: "power",
      },
      {
        letter: "G",
        as: "will",
      },
    ],
    column: "BEG",
    reasons: [
      {
        letters: "E",
        combines: "Power",
        plain: "Power is being able to act. The Pope can.",
        line: "“Power is that on account of which goodness, greatness etc. can exist and act.” The Pope can.",
        where: "Llull: Part 3, the definitions",
      },
      {
        letters: "G",
        combines: "Will",
        plain: "Will is wanting to act. Does he?",
        line: "“Will is that on account of which goodness, greatness etc. are desirable.” Will he?",
        where: "Llull: Part 3, the definitions",
      },
    ],
    verdict: "Yes, on paper. It took five of them and twenty-seven years.",
    source:
      "Asked in 2026. Answered with Llull's definitions (Ars generalis ultima, Part 3) and his life (E. Allison Peers, Ramon Lull: A Biography, 1929).",
  },
];
