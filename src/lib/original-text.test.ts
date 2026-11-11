/**
 * The original text must stay word for word what the operator saved from Wikisource
 * (docs/features/lagado/original-passage.md), apart from the scan's page-break marker,
 * which the saved copy already leaves out. That copy was compared with Wikisource's own
 * rendered chapter on 2026-11-11 (identical once "Vol. VI. p. 212." is removed).
 */
import { describe, expect, it } from "vitest";
import pageText from "../content/exhibits/lagado/original.mdx?raw";
import savedText from "../../docs/features/lagado/original-passage.md?raw";

const START = "The first professor I saw";
const END = "without a rival.";

function passage(text: string): string {
  const from = text.indexOf(START);
  const to = text.indexOf(END, from) + END.length;
  // Images placed between paragraphs (<Figure … />) are not part of the text.
  return text
    .slice(from, to)
    .replace(/<[A-Z][^>]*\/>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

describe("Lagado's original text", () => {
  const page = passage(pageText);
  const saved = passage(savedText);

  it("is Swift's passage word for word, from the first professor to the rival", () => {
    expect(page).toBe(saved);
    expect(page.length).toBeGreaterThan(3000);
  });

  it("carries no page-break marker from the scan", () => {
    expect(page).not.toMatch(/Vol\.\s*VI\.\s*p\./);
  });

  it("keeps Swift's spelling as printed", () => {
    for (const word of ["politicks", "mathematicks", "publick", "intirely"]) expect(page).toContain(word);
  });
});
