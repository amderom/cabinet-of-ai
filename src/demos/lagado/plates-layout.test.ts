import { describe, expect, it } from "vitest";
import { clampToArea, fanPositions } from "./plates-layout";

describe("fanPositions", () => {
  it("fans the cards from the left edge, in line with the title", () => {
    const pos = fanPositions({ width: 360, height: 330 }, { width: 152, height: 190 }, 3);
    expect(pos[0].x).toBe(0);
    expect(pos[1].x).toBeGreaterThan(pos[0].x);
    expect(pos[2].x).toBeGreaterThan(pos[1].x);
  });

  it("keeps every card inside the area, on a narrow phone and on desktop", () => {
    for (const area of [{ width: 343, height: 330 }, { width: 1180, height: 400 }]) {
      for (const p of fanPositions(area, { width: 236, height: 270 }, 3)) {
        expect(p.x).toBeGreaterThanOrEqual(0);
        expect(p.y).toBeGreaterThanOrEqual(0);
        expect(p.x + 236).toBeLessThanOrEqual(area.width);
        expect(p.y + 270).toBeLessThanOrEqual(area.height);
      }
    }
  });

  it("can start the fan a little in from the edge, so a tilted card's corner lines up with the title", () => {
    const pos = fanPositions({ width: 360, height: 330 }, { width: 152, height: 190 }, 3, 14);
    expect(pos[0].x).toBe(14);
    expect(pos[2].x + 152).toBeLessThanOrEqual(360);
  });

  it("can centre the whole fan in its area (desktop stage)", () => {
    const pos = fanPositions({ width: 700, height: 470 }, { width: 272, height: 330 }, 3, 14, true);
    const left = pos[0].x, right = 700 - (pos[2].x + 272);
    expect(Math.abs(left - right)).toBeLessThan(1);
  });

  it("overlaps the cards like a hand, rather than spreading them across a wide screen", () => {
    const pos = fanPositions({ width: 1180, height: 400 }, { width: 236, height: 270 }, 3);
    expect(pos[1].x - pos[0].x).toBeLessThan(236);
  });
});

describe("clampToArea", () => {
  const area = { width: 300, height: 200 };
  const card = { width: 100, height: 120 };

  it("leaves a card that is inside where it is", () => {
    expect(clampToArea({ x: 50, y: 40 }, area, card)).toEqual({ x: 50, y: 40 });
  });

  it("stops a dragged card at the edges of its area", () => {
    expect(clampToArea({ x: -30, y: 500 }, area, card)).toEqual({ x: 0, y: 80 });
    expect(clampToArea({ x: 999, y: -5 }, area, card)).toEqual({ x: 200, y: 0 });
  });

  it("pins a card to the top left when the area is smaller than the card", () => {
    expect(clampToArea({ x: 10, y: 10 }, { width: 80, height: 80 }, card)).toEqual({ x: 0, y: 0 });
  });
});
