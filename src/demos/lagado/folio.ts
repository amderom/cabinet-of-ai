/**
 * The folio: the lines a visitor keeps from the Lagado frame (see SPEC.md → The folio).
 * Lines are stored in writing order and shown newest first. Kept on the visitor's
 * own device only (browser storage, never a cookie, never sent anywhere).
 * Every function returns a new folio and leaves the old one untouched, so Undo
 * is simply "put the previous folio back".
 */

export interface Line {
  id: string;
  text: string;
}

const KEY = "lagado-folio";

/** The part of the browser's storage the folio needs; null when there is none. */
export type FolioStorage = Pick<Storage, "getItem" | "setItem"> | null;

export function addLine(folio: readonly Line[], words: readonly string[], id: string): Line[] {
  return [...folio, { id, text: `${words.join(" ")}.` }];
}

export function editLine(folio: readonly Line[], id: string, text: string): Line[] {
  return folio.map((line) => (line.id === id ? { ...line, text } : line));
}

export function removeLines(folio: readonly Line[], ids: readonly string[]): Line[] {
  return folio.filter((line) => !ids.includes(line.id));
}

export function newestFirst(folio: readonly Line[]): Line[] {
  return [...folio].reverse();
}

/** What Share or Copy hands over: the quoted line(s), a signature, the exhibit's link. */
export function shareText(lines: readonly string[], url: string): string {
  const quoted = lines.map((line) => `"${line}"`).join("\n");
  return `${quoted}\n— written by the Engine of Lagado, no genius or study required\n${url}`;
}

export function loadFolio(storage: FolioStorage): Line[] {
  try {
    const saved: unknown = JSON.parse(storage?.getItem(KEY) ?? "[]");
    return Array.isArray(saved) ? saved.filter(isLine) : [];
  } catch {
    return [];
  }
}

export function saveFolio(storage: FolioStorage, folio: readonly Line[]): void {
  try {
    storage?.setItem(KEY, JSON.stringify(folio));
  } catch {
    // Storage refused (private window, full, blocked): the folio still works for this visit.
  }
}

function isLine(value: unknown): value is Line {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Line).id === "string" &&
    typeof (value as Line).text === "string"
  );
}
