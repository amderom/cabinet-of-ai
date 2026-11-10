# Tasks: Phase 1.2 part 1 — Images and engravings

> Plan: [plan.md](./plan.md). Spec: [SPEC.md](../SPEC.md).
> Every code task: verify Astro APIs against current Astro 7 docs, run `npm run test`, `npm run check` and `npm run build` before committing, keep `main` untouched, and append to `docs/features/lagado/journal.md` at the end of the session.

---

## T1: Engraving shortlist with licences ✅

**Description:** Search the allowed open collections for 19th-century Gulliver illustrations (Laputa, the Academy of Lagado, the word frame) and images for the essay's sections. Present a shortlist with previews, then record it.

**Acceptance criteria:**
- [x] At least 2 texture candidates and 4–6 essay candidates (the hero is the author's Swift drawing, already provided), each with title, artist, date, collection, source URL, licence and suggested use
- [x] Every candidate's licence checked on its own source page (public domain worldwide or CC0); doubtful ones excluded, with the reason noted
- [x] `docs/features/lagado/engravings.md` written; previews shown to the author

**Verification:**
- [x] Each source URL opens and states the licence
- [x] The author has seen the previews

**Dependencies:** None
**Files likely touched:** `docs/features/lagado/engravings.md`
**Estimated scope:** S (research-heavy)

---

## Checkpoint A — the author picks ✅

- [x] The author picks the texture engraving and 1–3 essay engravings
- [x] Picks recorded in `engravings.md`; only the picked files are downloaded

---

## T2: Image model, credits helpers, build guard ✅

**Description:** Extend `credits` with `id`, `file`, `alt` and `caption`; add `texture` to exhibits; add pure helpers and the build guard. Add the picked images (resized originals) to Lagado.

**Acceptance criteria:**
- [x] `credits` entries accept `id`, `file` (checked by Astro's `image()`), optional `phoneFile`, `alt` and `caption?`; ids are unique per exhibit; exhibits accept `texture?` and `hero?` (ids of credited images; unknown ids stop the build)
- [x] The build fails with a clear message on: an image file without a credit, a credit without a licence, a duplicate id
- [x] Lagado's picked images are in `src/content/exhibits/lagado/images/` (longest side ≤ 2400 px), each credited; the Swift drawing (`swift-portrait.jpg`, already in the folder) is credited to the author (all rights reserved) and set as `hero`

**Verification:**
- [x] Unit tests for `src/lib/credits.ts` pass (find by id, unknown-id error, uncredited files, duplicates)
- [x] Each build failure triggered once on purpose, then reverted
- [x] `npm run check` and `npm run build` pass; the credits block on Lagado's pages lists the images

**Dependencies:** Checkpoint A
**Files likely touched:** `src/content.config.ts`, `src/lib/credits.ts`, `src/lib/credits.test.ts`, `src/lib/exhibit-pages.ts`, `src/content/exhibits/lagado/exhibit.yaml` (+ images)
**Estimated scope:** M

---

## T3: Figure component and essay illustrations ✅

**Description:** A `<Figure id>` component that shows an optimised image with its caption and credit, used in the Lagado essay at section breaks.

**Acceptance criteria:**
- [x] `<Figure id="…" />` renders a responsive, optimised image with alt text, caption and a short credit line; serves the `phoneFile` version on small screens when there is one; an unknown id stops the build
- [x] 1–3 figures in the essay at section breaks; the essay's words unchanged (automatic comparison, as in Phase 1.1)
- [x] Images below the first screen load lazily; no layout shift when they load

**Verification:**
- [x] `npm run test`, `npm run check` and `npm run build` pass
- [x] playwright-cli at 390×844, 375×667 and 1280×800: images present with alt text and caption, served at phone size, no sideways scroll
- [x] Phone screenshots sent to the author

**Dependencies:** T2
**Files likely touched:** `src/components/Figure.astro`, `src/content/exhibits/lagado/essay.mdx`, `src/styles/global.css`
**Estimated scope:** M

---

## Checkpoint B — the author reviews the illustrated essay ✅

- [x] Captions and alt texts validated (or corrected) by the author
- [x] Placement of the images approved

---

## T4: Lagado neon engraving texture ✅

**Description:** A texture layer made from the exhibit's `texture` image, tinted in the accent colour with CSS, behind the page.

**Acceptance criteria:**
- [x] Visible as atmosphere on the demo page; much fainter on the essay and making-of, limited to the title area and fading out before the text
- [x] Never over the essay's text area, never catches taps, no sideways scroll; still when reduced motion is requested
- [x] An unknown `texture` id stops the build; exhibits without a `texture` show no layer

**Verification:**
- [x] `npm run check` and `npm run build` pass
- [x] playwright-cli on all three parts at three sizes; reduced-motion check
- [x] Screenshots of the demo and essay pages sent to the author

**Dependencies:** T2
**Files likely touched:** `src/components/Texture.astro`, `src/layouts/BaseLayout.astro`, `src/layouts/ExhibitLayout.astro`, `src/content/exhibits/lagado/exhibit.yaml`, `src/styles/global.css`
**Estimated scope:** M

---

## T5: Three reading-page directions (exploration branch) ✅

**Description:** On `explore/reading-pages` (branched from the feature branch), build three variants of the real Lagado essay: A Editorial, B Fluid, C Margin. Push it to get a Vercel preview link. Never merged.

**Acceptance criteria:**
- [x] Three variants reachable on the preview, each clearly labelled A, B or C, using the real essay, images and texture
- [x] Each works at phone width (no sideways scroll, text readable); B's motion respects reduced motion
- [x] A one-line description of each sent to the author with the links

**Verification:**
- [x] playwright-cli quick check at 390×844 on each variant
- [x] The author opens all three on her phone

**Dependencies:** T3, T4
**Files likely touched:** exploration branch only (temporary variant pages and styles)
**Estimated scope:** M (timeboxed)

---

## Checkpoint C — the author picks a direction ✅

- [x] The author picks A, B, C or a mix; GSAP asked about only if needed
- [x] Decision recorded in the journal; the exploration branch deleted after T6

---

## T6: Chosen direction in the shared exhibit layout ✅

**Description:** Rebuild the chosen direction cleanly on the feature branch, in the shared layout and styles, so every future essay and making-of gets it.

**Acceptance criteria:**
- [x] The essay and making-of pages use the chosen direction; nothing Lagado-specific in shared files
- [x] The article button is still visible without scrolling at 375×667; motion respects reduced motion
- [x] The essay's words unchanged

**Verification:**
- [x] `npm run test`, `npm run check` and `npm run build` pass
- [x] playwright-cli at three sizes; word comparison

**Dependencies:** Checkpoint C
**Files likely touched:** `src/layouts/ExhibitLayout.astro`, `src/styles/global.css`, `src/components/*` as needed (≤ 5 files)
**Estimated scope:** M

---

## T7: Performance and full browser checks ✅

**Acceptance criteria:**
- [x] Lighthouse mobile on the local build, essay page: LCP < 2.5 s, CLS < 0.1
- [x] All spec browser checks pass at 390×844, 375×667 and 1280×800 (alt text, captions and credits, phone-sized images, lazy loading, texture rules, no sideways scroll, no external requests, no console errors)

**Verification:** Lighthouse numbers and check output recorded in the journal

**Dependencies:** T6
**Estimated scope:** S

---

## T8: ADR 005, README, journal ✅

**Acceptance criteria:**
- [x] `docs/adr/005-images-and-credits.md`: images per exhibit, declared once by id, build guard, CSS-tinted texture, exploration-branch practice
- [x] README current state updated; journal entries for each session

**Dependencies:** T7
**Files likely touched:** `docs/adr/005-images-and-credits.md`, `README.md`, `docs/features/lagado/journal.md`
**Estimated scope:** S

---

## T9: PR, preview, phone check ✅

**Acceptance criteria:**
- [x] Draft PR to `main` listing the images with their licences; Vercel checks green
- [x] Checks re-run on the preview; the author approves on her phone; merge on her word
- [x] After merge: production checked; journal updated

**Dependencies:** T8
**Estimated scope:** S
