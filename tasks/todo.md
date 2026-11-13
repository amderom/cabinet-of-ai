# Tasks: The Llull exhibit

> Plan: [plan.md](./plan.md). Spec: [SPEC.md](../SPEC.md). Verification for every task: `npm run test`, `npm run check`, `npm run build`, plus the browser check named. Journal entry at the end of each session.

> Status 2026-11-13: Tasks 1–5 done; Checkpoints A and B passed (Orbit chosen, prototype v7); Llull open on the branch only for the PR preview (draft PR amderom/cabinet-of-ai#15, reseal before merging). Checkpoint C passed and Tasks 6–8 done the same day; next: Checkpoint D on the preview.

## Phase 1: Content first

- [x] **Task 1: The nine questions, written out**
  - Acceptance: `docs/features/llull/questions.md` gives for each question its letters and column, 2–3 short reasons (Llull's text, or his definitions for the start-up ones), the verdict, the source line (Dambergs credited); R1 uses Llull's own chambers of column BCD. Every quote matches the Dambergs text (checked by script).
  - Verify: script comparison against the saved Dambergs pages; read by the author.
  - Files: `docs/features/llull/questions.md`
- [x] **Task 2: Plate texts, sticker, banner lines**
  - Acceptance: plate I label and opened text (the Art for a stranger); plate II "The pitch to the Pope" (five popes from Peers 1929, page references, one line translated by us); plate III spec sheet (every figure sourced); 3 sticker options; ~12 banner lines. Same document.
  - Verify: facts checked against `source-texts.md` sources; read by the author.
  - Files: `docs/features/llull/questions.md` (or `plates.md`)

### Checkpoint A
- [x] The author validates every word (questions, verdicts, plates, sticker, banner)

## Phase 2: The machine

- [x] **Task 3: The rules, tests first**
  - Acceptance: `art.ts` (alphabet with D = Eternity; 84 columns BCD … HIK; the 20 chambers of a column in Llull's order; reading a chamber, T as the switch) and `questions.ts` (the nine, with letters and column); a test ties them to `questions.md`.
  - Verify: tests seen failing, then passing; full suite green.
  - Files: `src/demos/llull/art.ts`, `art.test.ts`, `questions.ts`, `questions.test.ts`
- [x] **Task 4: Two or three looks, as a clickable prototype**
  - Acceptance: private artifact with 2–3 directions of the same play-through (question → letters → rings turn → chambers → verdict), 2026 look, Llull's pink, phone first; checked at 390 and 1280px.
  - Verify: playwright-cli screenshots; no console errors.
  - Files: none in the repo (artifact)

### Checkpoint B
- [x] The author picks a direction

- [x] **Task 5: The machine on the site, rough but playable**
  - Acceptance: `Machine.tsx` island plays all nine questions, keep and share; reduced motion respected; a way for the author to see it on the PR preview without opening Llull on production (asked).
  - Verify: playwright-cli at 375, 390 and 1280px: every question plays to its verdict, no sideways scroll, no console errors.
  - Files: `src/demos/llull/Demo.astro`, `Machine.tsx`, `machine.css`

### Checkpoint C
- [x] "Is it fun?" on her phone; final look adjustments agreed ("yes", plus two fixes: the glow cut across "How does the Art work?", the wheel's pointer)

## Phase 3: The page

- [x] **Task 6: Shared plates (asked first)**
  - Acceptance: the author agrees; plates move to `src/components/plates/` with each exhibit passing its own plates; Lagado identical before and after.
  - Verify: screenshots of Lagado's hero at 375 and 1280px before and after; plates-layout tests pass; drag and open still work.
  - Files: `src/components/plates/*`, `src/demos/lagado/Hero.astro`, `Plates.tsx`, `plates.css`, `plates-layout.ts`
- [x] **Task 7: Llull's images, prepared and credited** (volvelle + drawing; essay engravings moved to Task 9)
  - Acceptance: the volvelle (1517, scan n39) as ink on transparent (card, texture, plate I); her drawing as ink on transparent (plate II); 1–3 essay engravings (Breviculum miniature, other 1517 figures, as she picks); every one credited in `exhibit.yaml`.
  - Verify: the build guard passes; an uncredited file stops it (tried once, reverted).
  - Files: `src/content/exhibits/llull/images/*`, `exhibit.yaml`, `docs/features/llull/engravings.md`
- [x] **Task 8: Llull's hero, banner, card and texture**
  - Acceptance: sticker, title, three plates, tabs, machine, banner; `year: "1308"`, `card`, `texture`; the home card's engraving grows into the pink texture.
  - Verify: Edge at 375, 390, 1280 and 1440px; the page change pairs `exhibit-art-llull`; Lagado and home unchanged.
  - Files: `src/demos/llull/Hero.astro`, `exhibit.yaml`

### Checkpoint D
- [x] The author approves the demo page ("perf"; follow-the-Art scroll on phones, spec sheet trimmed, short card captions, "decrees", Peers and Dambergs credited)

## Phase 4: The reading parts

- [x] **Task 9: The essay page** (Breviculum, Prima, Tertia, Secunda; `essay.test.ts` locks her words)
  - Acceptance: `essay.mdx` identical to `sources/essay-draft.md` (checked by test or script), engravings placed, her source list at the end, description for the link preview.
  - Verify: Edge at 375 and 1280px; words identical.
  - Files: `src/content/exhibits/llull/essay.mdx`
- [x] **Task 10: The original** (petition to Celestine V + Ars brevis ch. XLVI, translated by Claude, links to the scans, the fourth figure; approved)
  - Acceptance: a short Latin passage (*Ars brevis*, 1617, or the 1517 *Ars generalis ultima*) chosen with her, translated together, Latin source and our translation credited; fourth tab appears.
  - Verify: a test keeps the page text identical to the validated translation.
  - Files: `src/content/exhibits/llull/original.mdx`, `exhibit.yaml`
- [x] **Task 11: Sound** (click on each reason, singing bowl on the answer; none on the tap)
  - Acceptance: candidates (CC0) on a private listening page; her picks credited, softened like Lagado's, registered with the sound module.
  - Verify: silent visit downloads nothing; sound on plays each gesture's sound.
  - Files: `src/demos/llull/sounds/*`, `exhibit.yaml`, `Machine.tsx`

### Checkpoint E
- [x] Sounds chosen by ear

## Phase 5: Finish

- [ ] **Task 12: Link-preview image** (her drawing, 1200 × 627, `design/previews/previews.html`)
- [x] **Task 13: Making-of** (three scenes, numbers in hours, the paper trail; validated by her)
- [ ] **Task 14: Speed, browser sweep, README, ADR if needed**
- [ ] **Task 15: Draft PR, Llull still sealed; open and merge on her word**
