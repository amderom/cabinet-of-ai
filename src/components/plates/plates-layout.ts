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

/**
 * `inset`: how far from the left edge the first card starts (room for its tilted corner).
 * `centre`: place the whole fan in the middle of the area instead, across and down (desktop stage).
 */
export function fanPositions(area: Size, card: Size, count: number, inset = 0, centre = false): Point[] {
  const step = Math.min(card.width * 0.72, Math.max(0, (area.width - card.width - inset) / Math.max(1, count - 1)));
  const start = centre ? Math.max(inset, (area.width - (card.width + (count - 1) * step)) / 2) : inset;
  const freeHeight = area.height - card.height;
  const ys = Array.from({ length: count }, (_, i) => FAN_Y[i % FAN_Y.length] * freeHeight);
  // Centred: shift the fan down so the room above the highest card equals the room below the lowest.
  const shiftY = centre ? (freeHeight - Math.max(...ys) - Math.min(...ys)) / 2 : 0;
  return ys.map((y, i) => clampToArea({ x: start + i * step, y: y + shiftY }, area, card));
}

export function clampToArea(p: Point, area: Size, card: Size): Point {
  const maxX = Math.max(0, area.width - card.width);
  const maxY = Math.max(0, area.height - card.height);
  return { x: Math.min(maxX, Math.max(0, p.x)), y: Math.min(maxY, Math.max(0, p.y)) };
}
