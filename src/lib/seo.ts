/**
 * Pure helpers for the information LinkedIn (and other apps) read to build a
 * link preview: page titles and absolute URLs.
 */
import { SITE_NAME } from "./site";

/** Full URL of a path on the site (link previews need absolute URLs). */
export function absoluteUrl(path: string, site: URL): string {
  return new URL(path, site).href;
}

/** "Title · Part · Cabinet of AI"; the part is optional, the site name never repeated. */
export function pageTitle(title: string, part?: string): string {
  return [...new Set([title, part, SITE_NAME].filter(Boolean))].join(" · ");
}
