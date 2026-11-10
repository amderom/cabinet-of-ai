# Tasks: Phase 1.1 — The exhibit page, with Lagado's text

> Plan: [plan.md](./plan.md). Spec: [SPEC.md](../SPEC.md).
> Every task: verify Astro syntax against current Astro 7 docs, run `npm run test`, `npm run check` and `npm run build` before committing, keep `main` untouched, and append to `docs/features/lagado/journal.md` at the end of the session.

---

## T1: Content data ✅

**Description:** Add the research reference to the exhibit model, a description to essays and making-ofs, and a site settings file. Fill them in for Lagado.

**Acceptance criteria:**
- [x] `exhibits` accepts an optional `research` object (title, journal, issue?, year, url, doi?, language); Lagado has its reference filled in as in the spec
- [x] `essays` and `makingOfs` require a `description`; Lagado's essay and making-of have theirs
- [x] `src/lib/site.ts` exports the site name and the LinkedIn URL

**Verification:**
- [x] Unit tests: the research schema accepts Lagado's entry and rejects a bad URL (`npm run test`)
- [x] `npm run check` and `npm run build` pass

**Dependencies:** None
**Files likely touched:** `src/lib/research.ts`, `src/lib/research.test.ts`, `src/content.config.ts`, `src/lib/site.ts`, `src/content/exhibits/lagado/exhibit.yaml`, `src/content/exhibits/lagado/essay.mdx` (frontmatter only), `src/content/exhibits/lagado/making-of.mdx` (frontmatter only)
**Estimated scope:** M

---

## T2: Lagado essay page ✅

**Description:** Put the author's essay on the essay page, with the "About this essay" note, the "Read the full article (in French) ↗" button and the byline near the top.

**Acceptance criteria:**
- [x] The essay text matches the author's wording exactly; only typographic fixes (curly quotes, dashes, italic titles), each listed for the PR
- [x] Under the title: byline (linked to LinkedIn), the note, then the button to the journal article (new tab, `rel="noopener"`, marked "in French")
- [x] The note and the button are visible without scrolling at 390×844 and 375×667 (smaller exhibit header on essay and making-of pages if needed)

**Verification:**
- [x] `npm run test`, `npm run check`, `npm run build` pass
- [x] playwright-cli at 390×844 and 375×667: button visible without scrolling, correct link, no sideways scroll, no console errors
- [x] A word-by-word comparison of the rendered text with the author's original (ignoring typography)

**Dependencies:** T1
**Files likely touched:** `src/content/exhibits/lagado/essay.mdx`, `src/components/ResearchNote.astro`, `src/pages/exhibits/[slug]/essay.astro`, `src/layouts/ExhibitLayout.astro`, `src/styles/global.css`
**Estimated scope:** M

---

## Checkpoint A — author review ✅

- [x] Tests, check and build pass
- [x] Phone screenshots of the essay page sent to the author, with the list of typographic fixes
- [x] The author approves her text and the top of the page before moving on

---

## T3: Shared exhibit frame ✅

**Description:** Add what every exhibit part shares: the calls to action block, the credits block, the play-first link on essay and making-of, and a footer. Remove the "Placeholder" label.

**Acceptance criteria:**
- [x] Every part shows "Read the full article ↗" (hidden if the exhibit has no `research`) and "Follow the series on LinkedIn ↗" (plain link, no widget)
- [x] Essay and making-of show "Play with the machine →" near the top, linking to the demo
- [x] Credits block lists source, author (if known) and licence for each credit; hidden when `credits` is empty

**Verification:**
- [x] `npm run test`, `npm run check`, `npm run build` pass
- [x] playwright-cli on all three parts at 390×844: links present and correct, tap targets at least 44px
- [x] Credits shown correctly with a temporary test credit added locally (not committed), hidden without it

**Dependencies:** T1
**Files likely touched:** `src/layouts/ExhibitLayout.astro`, `src/components/ExhibitCta.astro`, `src/components/Credits.astro`, `src/pages/exhibits/[slug]/making-of.astro`
**Estimated scope:** M

---

## T4: Page information for LinkedIn ✅

**Description:** Every page outputs its title, description, canonical URL and Open Graph tags with absolute URLs. `og:image` only when an image is passed (none yet). Preload the mono label font.

**Acceptance criteria:**
- [x] `site` set to the production URL in `astro.config.mjs`
- [x] Every page (three Lagado parts, home, 404) has `<title>`, description, canonical, `og:title`, `og:description`, `og:url`, `og:type`, `og:site_name`; no `og:image`
- [x] Page titles name the part (e.g. "Dice and Device: The Lagado Engine · Essay · Cabinet of AI"); IBM Plex Mono is preloaded

**Verification:**
- [x] Unit tests for `seo.ts` (absolute URLs, page titles) pass
- [x] `npm run check`, `npm run build` pass; the built HTML in `dist/` contains the tags with absolute URLs
- [x] playwright-cli: labels render in IBM Plex Mono from the first paint

**Dependencies:** T1
**Files likely touched:** `astro.config.mjs`, `src/lib/seo.ts`, `src/lib/seo.test.ts`, `src/layouts/BaseLayout.astro`, `src/layouts/ExhibitLayout.astro`
**Estimated scope:** M

---

## T5: Lagado demo teaser and making-of note ✅

**Description:** Replace the demo placeholder with the honest "The machine is being assembled" teaser (link to the essay) and the making-of placeholder with the short "being written" note.

**Acceptance criteria:**
- [x] Demo page shows the teaser in the exhibit's style, with a link to the essay; no "Placeholder" label anywhere on Lagado's pages
- [x] Making-of page shows the two or three lines from the spec, plus the shared calls to action

**Verification:**
- [x] `npm run test`, `npm run check`, `npm run build` pass
- [x] playwright-cli on both pages at 390×844: text present, links correct, no console errors

**Dependencies:** T3
**Files likely touched:** `src/demos/lagado/Demo.astro`, `src/content/exhibits/lagado/making-of.mdx`
**Estimated scope:** S

---

## Checkpoint B ✅

- [x] All seven browser checks from the spec pass at 390×844, 375×667 and 1280×800
- [x] No request leaves the site except links the visitor taps

---

## T6: ADR 004, README, journal ✅

**Description:** Record the decisions and update the docs.

**Acceptance criteria:**
- [x] `docs/adr/004-research-and-link-previews.md`: research reference in metadata; page information now, images per exhibit at the end of Phase 1.2
- [x] README reflects the current state (Phase 1.1)
- [x] Journal entry for the build session(s)

**Verification:**
- [x] Links in the docs resolve; `npm run build` still passes

**Dependencies:** T1–T5
**Files likely touched:** `docs/adr/004-research-and-link-previews.md`, `README.md`, `docs/features/lagado/journal.md`
**Estimated scope:** S

---

## T7: Draft PR, Vercel preview, phone check

**Description:** Push the branch, open a draft PR to `main` listing the typographic fixes and the final wordings, rerun the browser checks on the Vercel preview, and send the preview link to the author.

**Acceptance criteria:**
- [ ] Draft PR open with the Vercel preview link
- [ ] Browser checks pass on the preview
- [ ] The author has read it on her phone

**Verification:**
- [ ] Vercel build green; playwright-cli on the preview (in the author's signed-in browser pane, since previews are protected)

**Dependencies:** T6
**Estimated scope:** S

---

## Checkpoint C — merge and production

- [ ] Merge only on the author's word
- [ ] T8: after merge, LinkedIn Post Inspector on `https://cabinet-of-ai-gx8a.vercel.app/exhibits/lagado/essay/` shows the right title and description (no image yet)
- [ ] Journal updated; remind the author that the preview images are part of Phase 1.2
