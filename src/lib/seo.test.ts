import { describe, expect, it } from "vitest";
import { absoluteUrl, pageTitle } from "./seo";

const site = new URL("https://cabinet-of-ai-gx8a.vercel.app");

describe("absoluteUrl", () => {
  it("turns a path into a full URL on the site", () => {
    expect(absoluteUrl("/exhibits/lagado/essay/", site)).toBe(
      "https://cabinet-of-ai-gx8a.vercel.app/exhibits/lagado/essay/",
    );
  });

  it("works for the home page", () => {
    expect(absoluteUrl("/", site)).toBe("https://cabinet-of-ai-gx8a.vercel.app/");
  });
});

describe("pageTitle", () => {
  it("names the part after the title, then the site", () => {
    expect(pageTitle("Dice and Device: The Lagado Engine", "Essay")).toBe(
      "Dice and Device: The Lagado Engine · Essay · Cabinet of AI",
    );
  });

  it("leaves the part out when there is none", () => {
    expect(pageTitle("The Lagado Engine")).toBe("The Lagado Engine · Cabinet of AI");
  });

  it("does not repeat the site name for the home page", () => {
    expect(pageTitle("Cabinet of AI")).toBe("Cabinet of AI");
  });
});
