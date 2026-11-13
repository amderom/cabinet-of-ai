import { describe, expect, it } from "vitest";
import page from "./original.mdx?raw";

describe("Llull's original page", () => {
  it("says the English is Claude's translation from the Latin", () => {
    expect(page).toContain("Translated from the Latin into English by Claude");
  });

  it("links each passage to its scanned Latin pages", () => {
    expect(page).toContain("archive.org/details/bibliotecabiobib01colluoft/page/373");
    expect(page).toContain("archive.org/details/BIUSante_pharma_res011289/page/n66");
  });

  it("shows the translation only (the Latin stays a link, the author's decision)", () => {
    expect(page).not.toMatch(/Cum Deus principaliter|Pars ista dividitur/);
    expect(page).toContain("## The pitch to the Pope");
    expect(page).toContain("## How to teach the Art");
  });
});
