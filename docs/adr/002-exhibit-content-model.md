# ADR 002: Exhibits as content collections, one folder per exhibit

**Status:** Accepted
**Date:** 2026-11-10
**Decided by:** the operator (spec approval), on the agent's recommendation

## Context

Each exhibit has metadata (title, tagline, accent colour, open/sealed status, order, asset credits), a scholarly essay and a making-of, plus its own interactive demo. The site has no CMS (Project compass: content is edited in code with AI agents). New exhibits must be addable without touching shared pages, and a half-finished exhibit must never be published by mistake.

## Decision

- Exhibits live in `src/content/exhibits/<slug>/`: `exhibit.yaml` (metadata), `essay.mdx`, `making-of.mdx`.
- Three Astro content collections in `src/content.config.ts` (`exhibits`, `essays`, `makingOfs`), all loaded with `glob()` and a `generateId` that uses the **folder name** as the id, so the three parts share one slug.
- The `exhibits` schema (Zod) validates the accent as `#RRGGBB`, the status as `open | sealed`, an integer `order`, and `credits` (default `[]`).
- Pages are generated only for `open` exhibits. The build fails, naming the exhibit and the file, if an open exhibit lacks its essay, making-of (`src/lib/exhibit-pages.ts`) or demo (`src/demos/<slug>/Demo.astro`, picked by slug).
- Pure helpers (`src/lib/exhibits.ts`: order, open filter, missing parts) are unit-tested with small fixtures.
- Nothing lists exhibits by hand: the home page and menus read the collection.

## Alternatives considered

- **One MDX file per exhibit with everything in frontmatter + sections.** Fewer files, but essay and making-of could not have their own pages and links cleanly (Project compass: every part is shareable).
- **A single collection with a `type` field.** Mixes metadata and long texts in one schema; the "is anything missing?" rule becomes harder to express.
- **Hard-coded exhibit list in pages.** Rejected by AGENTS.md: the list must come from content.

## Consequences

- Adding an exhibit = a new folder + a demo component; no shared page changes.
- Sealed exhibits need only `exhibit.yaml`; their URLs show the 404 page.
- A planned fourth part, "The original" (`docs/ideas/demo-context.md`, Phase 1.2), fits the same pattern: an optional collection and one more page type.
- The local dev server can miss content or styles in files created after it started; restart it after adding an exhibit. Production builds are unaffected.
