import { describe, expect, it } from "vitest";
import draft from "../../../../docs/features/llull/sources/essay-draft.md?raw";
import page from "./essay.mdx?raw";
import yaml from "./exhibit.yaml?raw";

/** The words only: no front matter, imports, figures, quotes pulled out, heading or italics marks, blank lines. */
const words = (s: string) =>
  s
    .replace(/^---[\s\S]*?---/, "")
    .split("\n")
    .map((l) => l.replace(/^#+\s*/, "").replace(/\*([^*\n]+)\*/g, "$1").trim())
    .filter((l) => l && !l.startsWith("import ") && !l.startsWith("<Figure") && !l.startsWith("<PullQuote") && !l.startsWith(">"));

const d = words(draft);
const sourcesAt = d.indexOf("Sources:");

describe("Llull's essay page", () => {
  it("has the author's words exactly, as in her draft (her title is the page title)", () => {
    expect(d[0]).toMatch(/^Essay draft/);
    expect(d[1]).toBe("Turn and Turn Again: Llull’s Great Art");
    expect(page).toContain('title: "Turn and Turn Again: Llull’s Great Art"');
    expect(sourcesAt).toBeGreaterThan(2);
    expect(words(page)).toEqual(d.slice(2, sourcesAt));
  });

  it("credits every one of her sources (they moved into the credits, her decision)", () => {
    const links = d.slice(sourcesAt + 1).map((l) => l.match(/\]\((https?:[^)]+)\)/)?.[1]);
    expect(links).toHaveLength(5);
    for (const url of links) expect(yaml).toContain(`url: "${url}"`);
    expect(yaml.match(/cited: true/g)).toHaveLength(5);
  });
});
