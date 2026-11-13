import { describe, expect, it } from "vitest";
import saved from "../../../../docs/features/llull/original-latin.md?raw";
import page from "./original.mdx?raw";

const norm = (s: string) => s.replace(/\s+/g, " ").trim();
const latinOnPage = [...page.matchAll(/<Latin>\n([\s\S]*?)\n<\/Latin>/g)].map((m) => norm(m[1]));

describe("Llull's original page", () => {
  it("shows two Latin passages, the petition and the Ars brevis", () => {
    expect(latinOnPage).toHaveLength(2);
    expect(latinOnPage[0]).toMatch(/^Cum Deus principaliter/);
    expect(latinOnPage[1]).toMatch(/^Pars ista dividitur/);
  });

  it("keeps the Latin exactly as checked against the page images", () => {
    const savedText = norm(saved);
    for (const block of latinOnPage) expect(savedText).toContain(block);
  });

  it("dates both texts", () => {
    expect(latinOnPage[0]).toContain("Anno MCCXCIV");
    expect(latinOnPage[1]).toContain("M.CCCVII.");
  });
});
