import { describe, expect, it } from "vitest";
import doc from "../../../docs/features/llull/questions.md?raw";
import { chambers } from "./art";
import { QUESTIONS } from "./questions";

/** The document's wording, as the page shows it: no markdown marks, «» as curly quotes. */
const clean = (s: string) =>
  s
    .replace(/\*\(The author's wording[^)]*\)\*/g, "")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/«/g, "“")
    .replace(/»/g, "”")
    .trim();

/** One block per question in the document, keyed by its id (R1 … S3). */
function blocks() {
  const out = new Map<string, string>();
  for (const part of doc.split("\n### ").slice(1)) out.set(part.slice(0, part.indexOf(" ")), part);
  return out;
}

describe("the nine questions", () => {
  it("are six of Llull's and three asked in 2026", () => {
    expect(QUESTIONS.filter((q) => q.kind === "llull")).toHaveLength(6);
    expect(QUESTIONS.filter((q) => q.kind === "startup")).toHaveLength(3);
  });

  it("each use one of the 84 columns, made of their own letters", () => {
    for (const q of QUESTIONS) {
      expect(q.letters.map((l) => l.letter).sort().join(""), q.id).toBe(q.column);
    }
  });

  it("give every reason a plain sentence for newcomers", () => {
    for (const q of QUESTIONS) for (const r of q.reasons) expect(r.plain.length, q.id).toBeGreaterThan(10);
  });

  it("only combine letters of their own column in each reason", () => {
    for (const q of QUESTIONS) {
      for (const r of q.reasons) for (const l of r.letters) expect(q.column, `${q.id} ${r.letters}`).toContain(l);
    }
  });

  it("only cite chambers that exist in the column, where a reason comes from the Table", () => {
    for (const q of QUESTIONS) {
      for (const r of q.reasons) {
        const m = r.where.match(/chamber ([A-KT]{4})/);
        if (m) expect(chambers(q.column), `${q.id} ${m[1]}`).toContain(m[1]);
      }
    }
  });

  it("match the wording validated by the author (questions.md), word for word", () => {
    const byId = blocks();
    expect([...byId.keys()]).toEqual(QUESTIONS.map((q) => q.id));
    for (const q of QUESTIONS) {
      const block = byId.get(q.id)!;
      expect(q.question, q.id).toBe(block.slice(block.indexOf("· ") + 2, block.indexOf("\n")));
      expect(block, q.id).toContain(`**Column:** ${q.column}`);
      const lettersLine = block.match(/- \*\*Letters:\*\* (.*)/)![1];
      expect(q.letters.map((l) => `${l.letter} (${l.as})`).join(" · "), q.id).toBe(lettersLine);
      const reasons = [
        ...block.matchAll(/^ {2}\d\. \*\*([B-K]+)\*\* — (.*)\n {5}- Plain: (.*)\n {5}- (.*)\n {5}- (.*)$/gm),
      ].map((m) => ({ letters: m[1], combines: m[2], plain: m[3], line: clean(m[4]), where: clean(m[5]) }));
      expect(q.reasons, q.id).toEqual(reasons);
      expect(q.verdict, q.id).toBe(clean(block.match(/- \*\*Verdict[^*]*:\*\* (.*)/)![1]));
      expect(q.source, q.id).toBe(clean(block.match(/- \*\*Source line:\*\* (.*)/)![1]));
    }
  });
});
