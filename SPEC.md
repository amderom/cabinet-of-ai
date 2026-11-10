# Spec: Phase 0 — Technical foundations

> Source: [STARTUP.md → Phase 0](./STARTUP.md#phase-0--technical-foundations).
> Decision filter: [docs/project.md → Project compass](./docs/project.md#project-compass).
> Branch: `feature/phase-0-foundations`. This file can be deleted before the phase is merged.

## Objective

Set up the whole technical base of Cabinet of AI before any visible feature work: an Astro site running locally and on Vercel, with exhibits stored as content, the look's foundations in place (black screen, neon accents, two modern typefaces), and placeholder pages linked by smooth page transitions.

**Visual intent (agreed with the operator).** The content is vintage: engravings, 18th-century inscriptions, well-written essays. The presentation is unmistakably 2026: near-black background, big confident type, saturated neon accents, fluid motion. The impact comes from that contrast. People from the past should feel like people now, not the other way round. Phase 0 doesn't deliver the "wow" (that belongs to the machine in 1.2 and the cabinet in 1.3), but it lays down the tokens, type and transitions those moments depend on.

**Users of this phase**
- An agent (or the operator) who clones the repo and needs it to run on the first try (UC0.1).
- The operator, who opens every PR's Vercel preview on her phone (UC0.2).

**What the operator can do at the end:** open the production URL on her phone, see a black home page listing Lagado (open) with its electric-orange accent and Llull and Hesse marked as sealed, tap through to Lagado's demo, essay and making-of placeholders, and feel the page transitions between them.

## Tech Stack

See [docs/project.md → Tech Stack](./docs/project.md#tech-stack). Phase 0 installs only: Astro 7.4.x (see ADR 001), `@astrojs/react` + React 19, `@astrojs/mdx`, Tailwind CSS 4 (`npx astro add tailwind`), Vitest. GSAP, Howler and Tone.js are **not** installed in Phase 0.

Local machine runs Node 26.x (even-numbered, satisfies Astro 7's 22.23.4+). `package.json` declares `"engines": { "node": ">=22.23.4" }` so Vercel uses its default supported Node version.

## Commands

```
Install:   npm install
Dev:       npm run dev          # http://localhost:4321
Build:     npm run build        # static output in dist/
Preview:   npm run preview      # serves dist/ locally
Test:      npm run test         # vitest run
Check:     npm run check        # astro check (types + content schema)
```

No linter or formatter is added in Phase 0 (each would be a new dependency).

## Project Structure

Follows [docs/project.md → Project Structure](./docs/project.md#project-structure). Phase 0 creates:

```
src/
├── content.config.ts                 Collection definitions + schemas
├── content/exhibits/
│   ├── lagado/exhibit.yaml           Metadata (status: open)
│   ├── lagado/essay.mdx              Placeholder essay
│   ├── lagado/making-of.mdx          Placeholder making-of
│   ├── llull/exhibit.yaml            Metadata only (status: sealed)
│   └── hesse/exhibit.yaml            Metadata only (status: sealed)
├── lib/exhibits.ts                   Pure helpers: sort, filter open/sealed
├── lib/exhibits.test.ts              Vitest tests for those helpers
├── layouts/BaseLayout.astro          <html>, fonts, tokens, <ClientRouter />, per-page accent
├── layouts/ExhibitLayout.astro       Wraps the three exhibit parts, links between them
├── components/ExhibitNav.astro       Demo / Essay / Making-of links
├── styles/global.css                 Tailwind import + @theme tokens + @font-face
├── pages/index.astro                 Home placeholder (lists exhibits from the collection)
├── pages/exhibits/[slug]/index.astro      Demo + parody placeholder
├── pages/exhibits/[slug]/essay.astro      Essay page (renders essay.mdx)
├── pages/exhibits/[slug]/making-of.astro  Making-of page (renders making-of.mdx)
└── demos/lagado/                     Empty for now (placeholder component only)
docs/features/cabinet/journal.md      Build journal, first entry dated
docs/adr/001-astro-7.md               ADR: start on Astro 7 instead of 6
docs/adr/002-exhibit-content-model.md ADR for the content model
docs/adr/003-typefaces.md             ADR for the font choice and self-hosting
```

## Content model

One folder per exhibit. Three collections, all keyed by the folder name (the slug):

| Collection | Files | Required for |
|---|---|---|
| `exhibits` | `*/exhibit.yaml` | every exhibit |
| `essays` | `*/essay.mdx` | open exhibits only |
| `makingOfs` | `*/making-of.mdx` | open exhibits only |

`exhibits` schema (Zod, in `content.config.ts`):

| Field | Type | Notes |
|---|---|---|
| `title` | string | e.g. "The Lagado Engine" |
| `tagline` | string | one line, shown on the home |
| `accent` | hex colour string | validated `#RRGGBB` |
| `status` | `"open"` \| `"sealed"` | |
| `order` | integer | display order in the cabinet |
| `credits` | array of `{ asset, source, author?, licence, url? }` | defaults to `[]` |

Rules:
- Pages are generated only for `status: "open"`. Sealed slugs return the 404 page.
- The build **fails** if an open exhibit is missing its essay or making-of (checked in `getStaticPaths`).
- Nothing lists exhibits by hand: the home and nav read the collection.

Initial entries (all text is a clearly marked placeholder):

| Slug | Status | Order | Accent (provisional) |
|---|---|---|---|
| `lagado` | open | 1 | `#FF5F1F` electric orange (red-hot iron) |
| `llull` | sealed | 2 | `#FF2D55` hot magenta-red (rubric ink as neon) |
| `hesse` | sealed | 3 | `#00E0FF` acid cyan (glass beads lit from behind) |

## Design foundations

Tokens are Tailwind 4 theme variables in `src/styles/global.css`:

```css
@import "tailwindcss";

@theme {
  --color-ink: #0A0A0B;        /* near-black background */
  --color-paper: #F2F0EB;      /* main text */
  --color-muted: #8A8780;      /* secondary text */
  --color-accent: #FF5F1F;     /* default; overridden per exhibit */
  --font-sans: "Geist", ui-sans-serif, system-ui, sans-serif;
  --font-serif: "Newsreader", ui-serif, Georgia, serif;
}
```

- **Per-exhibit accent:** the exhibit layout sets `style="--color-accent: {exhibit.accent}"` on its root, so `text-accent`, `bg-accent`, etc. follow the exhibit automatically.
- **Typefaces (two, provisional):** Geist (sans, for titles and interface, used large and bold) and Newsreader (serif, for essay and making-of body text). Both are SIL Open Font License. They're self-hosted through Astro's built-in Fonts API (`fonts` in `astro.config.mjs`, Fontsource provider): files are downloaded at build time and served from this site, `font-display: swap`. Visitors never request a font CDN. (Changed from hand-copied woff2 files during T2: same outcome, no files or licences to maintain by hand.) The vintage inscription typeface is **not** part of Phase 0 (it arrives with the Lagado demo in 1.2, loaded only there).
- **Dark only.** No light theme.
- **Page transitions:** `<ClientRouter />` in `BaseLayout`; exhibit title carries a `transition:name` so it morphs between the three parts. Respect `prefers-reduced-motion` (Astro's default fallback).
- **Placeholders are honest stubs:** page title, which part this is, links to the other parts, accent applied, a visible "Placeholder" label. No layout design yet: that is Phase 1.1.

## Code Style

TypeScript strict (Astro's `strict` tsconfig preset). Astro components for static UI; React only for future interactive islands. Tailwind utility classes in markup; custom CSS only in `global.css`. Small pure functions in `src/lib/` so they're unit-testable.

```ts
// src/lib/exhibits.ts
import type { CollectionEntry } from "astro:content";

type Exhibit = CollectionEntry<"exhibits">;

export function sortByOrder(exhibits: Exhibit[]): Exhibit[] {
  return [...exhibits].sort((a, b) => a.data.order - b.data.order);
}

export function openExhibits(exhibits: Exhibit[]): Exhibit[] {
  return sortByOrder(exhibits).filter((e) => e.data.status === "open");
}
```

Naming: kebab-case files and slugs, PascalCase components, camelCase functions. English for all code and user-facing text.

## Testing Strategy

- **Unit (Vitest):** `src/lib/exhibits.test.ts` covers sorting, open/sealed filtering, and (with a small fixture) the "open exhibit missing its essay" check. Run with `npm run test`.
- **Build as a test:** `npm run build` must pass. It validates the content schema and the missing-essay rule.
- **Browser (playwright-cli, phone viewport 390×844 first, then desktop):**
  1. Home loads, shows Lagado as open and Llull and Hesse as sealed, with no console errors.
  2. Home → Lagado demo → essay → making-of → back: each URL is correct, and navigation happens without a full page reload (a marker set on `window` survives navigation).
  3. `/exhibits/llull/` returns the 404 page.
  4. Computed body font is Geist; essay body is Newsreader; no request goes to a font CDN (network log).
  5. The Lagado pages' accent is `#FF5F1F`.
- Same checks repeated on the Vercel preview URL, and the operator opens it on her phone.

## Boundaries

- **Always:** work on `feature/phase-0-foundations`; run `npm run test` and `npm run build` before each commit; read the collection rather than hard-coding exhibits; record font licences; append a dated entry to `docs/features/cabinet/journal.md` at the end of each session; verify Astro/Tailwind syntax against current Astro 7 docs (Context7, or docs.astro.build when Context7 only covers v6) rather than from memory.
- **Ask first:** any dependency not listed in this spec; changing accent colours or typefaces beyond these provisional values; editing `docs/project.md`; anything in the Vercel dashboard (the operator does it, guided).
- **Never:** push or merge to `main` directly; add analytics, cookies or third-party font/CDN calls; add SSR, API routes or an adapter; commit `.env` files; use the operator's personal photos or drawings; install GSAP, Howler or Tone.js in this phase.

## Vercel setup (operator, guided)

Once the first PR is open, the operator imports the GitHub repo `amderom/cabinet-of-ai` in the Vercel dashboard (framework auto-detected as Astro, no settings changed). This needs her own login and permission grant. After that, every PR gets a preview link and `main` deploys to production.

## Success Criteria

1. `git clone` → `npm install` → `npm run dev` works on a clean checkout with Node ≥ 22.23.4 (UC0.1).
2. `npm run test` passes; `npm run build` passes and produces a fully static `dist/`.
3. Three content entries exist (Lagado open, Llull and Hesse sealed); pages exist only for Lagado: `/exhibits/lagado/`, `/essay/`, `/making-of/`.
4. All five playwright-cli checks pass on a phone viewport, locally and on the Vercel preview.
5. The PR has a working Vercel preview link the operator has opened on her phone (UC0.2).
6. After merge, the production URL serves the same site, and the real URL is written into `docs/project.md` (Deployment → URLs).
7. `docs/features/cabinet/journal.md` exists with its first dated entry; ADRs 001, 002 and 003 are written.

## Resolved decisions (operator, 2026-11-10)

1. `docs/project.md` design references reworded: accents are "inspired by the object, pushed to a saturated, modern colour".
2. `@astrojs/check` + `typescript` approved as dev dependencies; `npm run check` is part of the commands.
3. Geist + Newsreader approved as the starting pair (still swappable later via ADR 003).
4. Node 26 accepted; Astro compatibility confirmed at install.
5. Astro 7 instead of 6 (Astro 6 no longer updated since 2026-06-17; current add-ons require 7). Approved as an exception to the 6-month rule — ADR 001.

Spec approved by the operator on 2026-11-10.
