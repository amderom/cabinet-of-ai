/**
 * Where the plates sit in their area: a hand of cards fanned from the left edge
 * (in line with the title), and the rule that keeps a dragged card inside the area,
 * so a plate never covers text or buttons.
 */

export interface Size {
  width: number;
  height: number;
}
export interface Point {
  x: number;
  y: number;
}

/** Vertical offsets of the fan, as fractions of the free height (the middle card sits highest). */
const FAN_Y = [0.22, 0.04, 0.28, 0.12, 0.3];

/** `inset`: how far from the left edge the first card starts (room for its tilted corner). */
export function fanPositions(area: Size, card: Size, count: number, inset = 0): Point[] {
  const step = Math.min(card.width * 0.72, Math.max(0, (area.width - card.width - inset) / Math.max(1, count - 1)));
  return Array.from({ length: count }, (_, i) =>
    clampToArea({ x: inset + i * step, y: FAN_Y[i % FAN_Y.length] * (area.height - card.height) }, area, card),
  );
}

export function clampToArea(p: Point, area: Size, card: Size): Point {
  const maxX = Math.max(0, area.width - card.width);
  const maxY = Math.max(0, area.height - card.height);
  return { x: Math.min(maxX, Math.max(0, p.x)), y: Math.min(maxY, Math.max(0, p.y)) };
}
