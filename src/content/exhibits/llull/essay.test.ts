import { describe, expect, it } from "vitest";
import draft from "../../../../docs/features/llull/sources/essay-draft.md?raw";
import page from "./essay.mdx?raw";

/** The words only: no front matter, imports, figures, heading marks, italics marks, blank lines. */
const words = (s: string) =>
  s
    .replace(/^---[\s\S]*?---/, "")
    .split("\n")
    .map((l) => l.replace(/^#+\s*/, "").replace(/\*([^*\n]+)\*/g, "$1").trim())
    .filter((l) => l && !l.startsWith("import ") && !l.startsWith("<Figure") && !l.startsWith(">"));

describe("Llull's essay page", () => {
  it("has the author's words exactly, as in her draft (her title is the page title)", () => {
    // Her "Sources:" line is a heading on the page, without the colon.
    const d = words(draft).map((l) => (l === "Sources:" ? "Sources" : l));
    // The draft opens with its own heading and the title; the page carries the title in its front matter.
    expect(d[0]).toMatch(/^Essay draft/);
    expect(d[1]).toBe("Turn and Turn Again: Llull’s Great Art");
    expect(page).toContain('title: "Turn and Turn Again: Llull’s Great Art"');
    expect(words(page)).toEqual(d.slice(2));
  });
});
