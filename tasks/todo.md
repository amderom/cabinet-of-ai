# Tasks: Phase 1.2 part 3 — LinkedIn preview images

> Plan: [plan.md](./plan.md). Spec: [SPEC.md](../SPEC.md).

## T1: Three directions as real images ✅

**Acceptance criteria:**
- [x] Machine sentence, engraving, and Swift drawing directions, each a 1200 × 627 picture made from HTML in `design/previews/`
- [x] Shown full size and on a mock LinkedIn card at phone width
- [x] The author picks a direction (or a mix)

**Verification:** pictures are exactly 1200 × 627; screenshots of the mock cards sent to the author
**Dependencies:** none
**Files likely touched:** `design/previews/*`
**Estimated scope:** S

## T2: Final Lagado and site images ✅

**Acceptance criteria:**
- [x] Lagado image and site image refined in the chosen direction; under 1 MB each
- [x] The author approves both (2026-11-13: "perf", with rounded plate corners)

**Verification:** size and weight checked; mock card screenshots
**Dependencies:** T1
**Files likely touched:** `design/previews/*`, `src/content/exhibits/lagado/images/`, site image location
**Estimated scope:** S

## T3: Wiring ✅

**Acceptance criteria:**
- [x] Optional `preview` field in the exhibit schema; Lagado's credited preview passed on all four parts; site image on the home page; none on 404 or sealed exhibits
- [x] `src/lib/preview.ts` refuses an unknown/uncredited id or a wrong size, with a message naming the fix (unit-tested)
- [x] Built pages carry `og:image` (absolute URL), width, height, alt and `twitter:card`; the image URL answers

**Verification:** `npm run test`, `npm run check`, `npm run build`; grep the built HTML; fetch the image on the local preview
**Dependencies:** T2
**Files likely touched:** `src/content.config.ts`, `src/lib/preview.ts` (+ test), `src/lib/site.ts`, `src/layouts/ExhibitLayout.astro`, `src/pages/index.astro`, `exhibit.yaml`
**Estimated scope:** M

## T4: ADR 007, README, journals ✅

**Acceptance criteria:**
- [x] `docs/adr/007-…md`: how previews are made, declared and checked
- [x] README current state; Lagado and cabinet journals updated

**Dependencies:** T3
**Estimated scope:** S

## T5: PR, merge, Post Inspector ✅

**Acceptance criteria:**
- [x] Draft PR with the preview link; the author checks it on her phone; merge on her word
- [x] After merge: Post Inspector shows the full card for the four Lagado links and the home page
- [x] Journal updated; reminder that Phase 1.3 (the cabinet) comes next

**Dependencies:** T4
**Estimated scope:** S
