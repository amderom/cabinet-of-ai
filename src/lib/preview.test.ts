import { describe, expect, it } from "vitest";
import { PREVIEW_SIZE, previewImage } from "./preview";

const file = { src: "/_astro/preview.abc123.png", width: 1200, height: 627 };

describe("previewImage", () => {
  it("gives nothing when there is no preview", () => {
    expect(previewImage(undefined, "lagado")).toBeUndefined();
  });

  it("gives the image tags' data for a credited image of the right size", () => {
    expect(previewImage({ file, alt: "Swift on a plate" }, "lagado")).toEqual({
      src: file.src,
      alt: "Swift on a plate",
      width: PREVIEW_SIZE.width,
      height: PREVIEW_SIZE.height,
    });
  });

  it("refuses a credit without an image file", () => {
    expect(() => previewImage({ alt: "x" }, "lagado")).toThrow(/lagado.*preview.*no image file/);
  });

  it("refuses a wrongly sized image, naming the size it needs", () => {
    expect(() => previewImage({ file: { ...file, width: 1000 }, alt: "x" }, "lagado")).toThrow(
      /lagado.*1000 × 627.*1200 × 627/,
    );
  });

  it("refuses an image without alt text", () => {
    expect(() => previewImage({ file, alt: " " }, "site")).toThrow(/site.*alt/);
  });
});
