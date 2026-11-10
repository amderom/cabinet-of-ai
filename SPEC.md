# Spec: Phase 1.1 — The exhibit page, with Lagado's text

> Source: [STARTUP.md → Phase 1.1](./STARTUP.md#phase-11--the-exhibit-page-with-lagados-text).
> Decision filter: [docs/project.md → Project compass](./docs/project.md#project-compass).
> Branch: `feature/phase-1-1-exhibit-page`. Replaces the Phase 0 spec (kept in git history). This file can be deleted before the phase is merged.

## Objective

Build the page structure every exhibit will share and fill it with Lagado's real essay. Every page also carries the hidden title and description that LinkedIn reads to build its link preview. The preview **images** are designed later, at the end of Phase 1.2 (see section 5).

**What a visitor can do at the end:** open a shared link to the Lagado essay on a phone, see at once that it is a light take on a peer-reviewed article, tap through to that article, read the essay comfortably, and reach the author's LinkedIn. From any of the three parts, they can find the research and LinkedIn links.

**Use cases** (from STARTUP.md):
- UC1.1.1: A recruiter taps a LinkedIn post, lands on the Lagado essay and reads it comfortably on a phone.
- UC1.1.2: An academic follows the essay's link to the published journal article.
- UC1.1.3: A visitor reaches the author's LinkedIn from any part of the exhibit.

**The essay is not the article.** The published article belongs to its journal (French, CC BY-NC-ND 4.0) and is never reproduced on the site. The essay page carries the author's own short, playful essay ("Dice and Device: The Lagado Engine"), says plainly near the top that it is a condensed, light version, and links to the real article above the fold on a phone.

The single capability here is "the exhibit page", so no capability map is needed (Phase 0 of the spec skill skipped).

## Tech Stack

See [docs/project.md → Tech Stack](./docs/project.md#tech-stack). **No new dependency.** GSAP, Howler and Tone.js are still not installed (Phase 1.2 / 1.3).

## Commands

```
Install:   npm install
Dev:       npm run dev          # http://localhost:4321
Build:     npm run build        # static output in dist/
Preview:   npm run preview      # serves dist/ locally
Test:      npm run test         # vitest run
Check:     npm run check        # astro check (types + content schema)
```

## What gets built

### 1. Exhibit layout (shared by every exhibit)

Order on the page, top to bottom, on a phone:

1. Header: `← Cabinet of AI` (home). The "Placeholder" label goes.
2. Exhibit title (morphs between parts, as now) and tagline.
3. Part navigation: Demo · Essay · Making-of (current part marked). Built so a fourth part ("The original", Phase 1.2) can be added without redesign.
4. The part's own content (the slot).
5. **Calls to action block**, identical on every part:
   - "Read the full article ↗": the journal article (external, opens in a new tab, marked "in French").
   - "Follow the series on LinkedIn ↗": the author's LinkedIn profile.
6. **Credits block**: source, author (if known) and licence of each third-party asset, read from the exhibit's `credits`. Hidden when `credits` is empty (Lagado has none yet in 1.1).
7. Footer: back to the cabinet.

**Play first:** the essay and making-of pages show a prominent "Play with the machine →" link to the demo near the top (under the navigation), not just in the tabs.

### 2. Lagado essay page (`/exhibits/lagado/essay/`)

Top to bottom:

1. Essay title, "Dice and Device: The Lagado Engine", in the display serif.
2. **"About this essay" note** (draft wording, author to validate):
   > A short, playful take on my peer-reviewed article *Totalité et infini de la machine à tout dire de Gulliver's Travels : du programme littéraire au programme informatique*, published in French in *XVII-XVIII*, no. 77 (2020). For the full argument, notes and sources, read the original.
3. **"Read the full article ↗"** button, right under the note, visible without scrolling on a 390×844 phone.
4. The essay body: the five sections as given by the author, headings as `##`. **Wording is the author's and is not edited.** Only typographic fixes are allowed (curly quotes, en/em dashes, italics for titles such as *Gulliver's Travels*, *Hamlet*, *The Battle of the Books*). Every such change is listed in the PR.
5. Calls to action, credits, footer (from the layout).

**Reading comfort on a phone:** body text in Inter Tight at 18px, line height ~1.65, max ~62ch (existing `prose-cabinet`); headings in Instrument Serif; no sideways scroll at 375px; tap targets at least 44px high.

### 3. Lagado demo page (`/exhibits/lagado/`), honest teaser

The demo slot stays empty until Phase 1.2. It shows a short teaser in the exhibit's style ("The machine is being assembled.") with a link to the essay. No "Placeholder" label. Lagado is not announced on LinkedIn until 1.2, so few people will see this.

### 4. Lagado making-of page (`/exhibits/lagado/making-of/`), short note

Two or three honest lines (draft, author to validate): the machine is being built with AI, and the making-of will follow it. Calls to action and credits as on every part. The real making-of is written in Phase 1.2 from the build journal.

### 5. Link previews: page information now, images in Phase 1.2

When a link is pasted into a LinkedIn post, LinkedIn shows a card built from hidden information on the page. Nothing of this is visible on the site.

**Now (Phase 1.1):** every page (the three Lagado parts, the home, the 404) outputs:

- `<title>` and `<meta name="description">`
- `og:title`, `og:description`, `og:url` (absolute), `og:type` (`article` for essays, `website` otherwise), `og:site_name` ("Cabinet of AI")
- `<link rel="canonical">` with the absolute URL
- `og:image` (+ width, height, alt) and `twitter:card` **only when an image exists** for that page. In 1.1 none exists, so these tags are absent.

Absolute URLs come from Astro's `site` setting, set to the production URL `https://cabinet-of-ai-gx8a.vercel.app` (changed in one place when a custom domain arrives).

The page title says which part the link goes to (e.g. "Dice and Device: The Lagado Engine · Essay · Cabinet of AI"), because that is the line LinkedIn writes under the image.

**Later (end of Phase 1.2, before the first Lagado post):** the preview images are designed with the author, once the machine and the site's look exist. Direction agreed so far: one image per exhibit (not one per part), very few words; the first mockups (name + glow on near-black) were rejected, so the design starts fresh. The layout already accepts an image per exhibit, so adding them needs no rework.

**Descriptions** (drafts, author to validate):
- Demo: the exhibit tagline.
- Essay: "In 1726, Swift imagined a machine that writes every book. A short, playful take on a peer-reviewed article about the first text generator."
- Making-of: "How the Lagado Engine is being rebuilt with AI."

### 6. Small fix carried over from Phase 0

Preload the IBM Plex Mono label font so labels no longer flash in a fallback font on first load.

## Content model changes

| Where | Change |
|---|---|
| `exhibits` schema | Add optional `research`: `{ title, journal, issue?, year, url, doi?, language }`. When present, the calls to action and the essay note use it. When missing, the "Read the full article" link is hidden. |
| `essays` and `makingOfs` schemas | Add `description` (string, required, used for `description` and `og:description`). |
| Site settings | `src/lib/site.ts`: site name and the author's LinkedIn URL (one place, used by every exhibit). |

Lagado's `research` entry:

```yaml
research:
  title: "Totalité et infini de la machine à tout dire de Gulliver's Travels : du programme littéraire au programme informatique"
  journal: "XVII-XVIII"
  issue: "77"
  year: 2020
  url: "https://journals.openedition.org/1718/5936"
  doi: "10.4000/1718.5936"
  language: "French"
```

The content model change and the link-preview approach (page information now, images per exhibit later) are recorded in **ADR 004**.

## Project Structure

Follows [docs/project.md → Project Structure](./docs/project.md#project-structure). Expected changes:

```
astro.config.mjs                         site: production URL; mono font preload
src/content.config.ts                    research, description fields
src/content/exhibits/lagado/exhibit.yaml research reference, real tagline (author validates)
src/content/exhibits/lagado/essay.mdx    the author's essay
src/content/exhibits/lagado/making-of.mdx short "being written" note
src/lib/site.ts                          site name, LinkedIn URL
src/lib/seo.ts (+ seo.test.ts)           pure helpers: absolute URLs, page titles
src/layouts/BaseLayout.astro             Open Graph + canonical tags
src/layouts/ExhibitLayout.astro          play-first link, calls to action, credits, footer
src/components/ExhibitCta.astro          "Read the full article" + "Follow on LinkedIn"
src/components/Credits.astro             credits block
src/components/ResearchNote.astro        "About this essay" note on the essay page
src/demos/lagado/Demo.astro              honest teaser
docs/adr/004-research-and-link-previews.md
docs/features/lagado/journal.md          Lagado build journal (started with this spec)
```

## Code Style

As in Phase 0: TypeScript strict, Astro components for static UI (no React in this phase), Tailwind utility classes, custom CSS only in `global.css`, small pure functions in `src/lib/` with Vitest tests. External links open in a new tab with `rel="noopener"` and a visible ↗.

```ts
// src/lib/seo.ts
import type { ExhibitPart } from "./exhibits";

const PART_NAMES = { demo: null, essay: "Essay", "making-of": "Making-of" } as const;

export function pageTitle(title: string, part: "demo" | ExhibitPart): string {
  const partName = PART_NAMES[part];
  return [title, partName, "Cabinet of AI"].filter(Boolean).join(" · ");
}

export function absoluteUrl(path: string, site: URL): string {
  return new URL(path, site).href;
}
```

## Testing Strategy

- **Unit (Vitest):** `seo.ts` helpers (absolute URLs, page titles per part); the content schema accepts Lagado's `research` and rejects a bad URL.
- **Build as a test:** `npm run build` and `npm run check` pass.
- **Browser (playwright-cli, phone 390×844 first, then 375×667 and desktop 1280×800):**
  1. Essay page: the "About this essay" note and the "Read the full article" button are visible without scrolling at 390×844; the link goes to the journal URL in a new tab.
  2. Every part shows "Follow the series on LinkedIn" with the right URL.
  3. Essay and making-of show "Play with the machine →" near the top, linking to the demo.
  4. No sideways scroll at 375px; no console errors; no request leaves the site except user-clicked links.
  5. Every page's head contains title, description, canonical and Open Graph tags with absolute URLs, and no `og:image` tag (no image yet).
  6. Credits block: hidden for Lagado (no credits); shown correctly when a test credit is added locally (not committed).
  7. Labels render in IBM Plex Mono from the first paint (no fallback flash).
- **After merge, on production:** the essay URL checked in LinkedIn's Post Inspector: it reads the right title and description (no image yet). Vercel previews are protected, so this can only be done on production.
- **Phone check by the author** on the PR's Vercel preview before merge.

## Boundaries

- **Always:** work on `feature/phase-1-1-exhibit-page`; run `npm run test`, `npm run check` and `npm run build` before each commit; read exhibits from the collection; keep the author's essay wording intact; append a dated entry to `docs/features/lagado/journal.md` at the end of each session; verify Astro syntax against current Astro 7 docs.
- **Ask first:** any change to the essay's wording beyond typography; any new dependency; the final wording of the "About this essay" note, descriptions, teaser and making-of note; changing accent colours or typefaces; editing `docs/project.md`.
- **Never:** reproduce the journal article's text on the site; push or merge to `main` directly; add analytics, cookies, tracking or third-party embeds (no LinkedIn widget or "follow" script, just a plain link); use the operator's personal photos or drawings; announce Lagado on LinkedIn before Phase 1.2 ships (the author's call, noted here as a reminder).

## Success Criteria

1. The essay page shows the author's essay, the "condensed version" note and the "Read the full article" link above the fold on a 390×844 phone (UC1.1.1, UC1.1.2).
2. All three Lagado parts carry the calls to action (research + LinkedIn), and the essay and making-of link back to the demo (UC1.1.3).
3. The credits block exists in the layout and appears whenever an exhibit has credits.
4. Every page outputs its title, description, canonical URL and Open Graph tags with absolute URLs.
5. `npm run test`, `npm run check` and `npm run build` pass; all browser checks pass on phone and desktop, locally and on the Vercel preview.
6. The author has read the PR preview on her phone and approved the texts.
7. **Done when:** after merge, the production Lagado essay reads well on a phone, and LinkedIn's Post Inspector shows its right title and description. The full card with image is checked at the end of Phase 1.2.
8. ADR 004 written; `docs/features/lagado/journal.md` started and up to date.

## Assumptions (taken from recommendations, override any of them)

1. **Preview images wait until the end of Phase 1.2** (agreed). *Could go wrong:* a link shared before then shows a card with no image. Unlikely (no posts before 1.2). Impact: a plain card, not a broken one.
2. **Empty demo page:** honest "being assembled" teaser linking to the essay. *Could go wrong:* someone finds it before 1.2 and expects a machine. Unlikely (not announced). Impact: minor.
3. **Making-of page:** a short "being written" note; the real making-of comes in 1.2.
4. **The article is French:** the link says "(in French)" so a recruiter isn't surprised.
5. **Byline:** the essay page shows the author's name under the title, linked to LinkedIn.

## Resolved decisions (operator, 2026-11-10)

1. LinkedIn profile URL: `https://www.linkedin.com/in/ameliederome/` (stored once, in `src/lib/site.ts`).
2. Byline: the author's name under the essay title, linked to LinkedIn. The about-note stays in the first person ("my article").
3. Tagline kept: "Write any book. No genius. No study. Just turn the cranks."
4. Draft wordings (about-note, descriptions, teaser, making-of note) accepted as drafted; final versions shown in the PR.
5. Preview images moved to the end of Phase 1.2, one per exhibit, designed from scratch (first mockups rejected).

## Open Questions

1. For Phase 1.2, not now: the essay says 36 students write the sentences, the demo-context notes say 40. To check against Swift's text before the specifications plate is made.

Spec approved by the operator on 2026-11-10.
