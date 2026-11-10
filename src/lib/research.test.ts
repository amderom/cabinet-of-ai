import { describe, expect, it } from "vitest";
import { researchSchema } from "./research";

const lagado = {
  title:
    "Totalité et infini de la machine à tout dire de Gulliver's Travels : du programme littéraire au programme informatique",
  journal: "XVII-XVIII",
  issue: "77",
  year: 2020,
  url: "https://journals.openedition.org/1718/5936",
  doi: "10.4000/1718.5936",
  language: "French",
};

describe("researchSchema", () => {
  it("accepts Lagado's article reference", () => {
    expect(researchSchema.safeParse(lagado).success).toBe(true);
  });

  it("accepts a reference without issue or DOI", () => {
    const { issue, doi, ...minimal } = lagado;
    expect(researchSchema.safeParse(minimal).success).toBe(true);
  });

  it("rejects a link that is not a URL", () => {
    expect(researchSchema.safeParse({ ...lagado, url: "journals.openedition.org" }).success).toBe(false);
  });

  it("rejects a missing title or year", () => {
    const { title, ...noTitle } = lagado;
    const { year, ...noYear } = lagado;
    expect(researchSchema.safeParse(noTitle).success).toBe(false);
    expect(researchSchema.safeParse(noYear).success).toBe(false);
  });
});
