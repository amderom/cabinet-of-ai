# Tasks: Phase 1.2 part 2 — The Lagado machine

> Plan: [plan.md](./plan.md). Spec: [SPEC.md](../SPEC.md).
> Every code task: verify Astro, React and Howler APIs against current docs, run `npm run test`, `npm run check` and `npm run build` before committing, check at phone width first (390×844, 375×667, then 1280×800) with playwright-cli, keep `main` untouched, and append to `docs/features/lagado/journal.md` at the end of the session.

---

## T1: Words, figures, plate and banner texts ✅

**Description:** Draft all the words and texts the machine and page need, in one document the author can edit: the word list by column role, the three plate texts, the banner lines.

**Acceptance criteria:**
- [x] `docs/features/lagado/machine-content.md` with: 160–200 single words grouped by role (adjectives, nouns, verbs) from the learned domains in the spec, start-up/AI jargon mostly in adjectives and verbs, period spellings sparingly (about 1 in 15) each with its source in Swift's text; no word longer than 9 letters
- [x] Sample sentences, and a clickable prototype the author can open on her phone (added after two rounds of images proved hard to judge)
- [x] Plate texts: museum label for the Engine, the quote with its signature, the specifications sheet with every figure traced to a sentence of `original-passage.md`; 6–10 parody banner lines
- [x] Screen samples: IM Fell English beside Instrument Serif; the longest words at 375px with the cranks in place

**Verification:**
- [x] Every figure on the specifications plate matches the passage word for word
- [x] The author has read the document

**Dependencies:** None
**Files likely touched:** `docs/features/lagado/machine-content.md`
**Estimated scope:** S (writing-heavy)

---

## Checkpoint A — the author edits ✅

- [x] Word list, plate texts and banner lines validated or corrected by the author
- [x] Typeface decided: Instrument Serif (no new typeface)

---

## T2: Engine logic and tests

**Description:** The machine's rules as plain TypeScript: a frame of rows (3 on a phone, 6 on desktop) × 6 grammatical places; flip a set of blocks (a place or a row), shake, pick one word per place, read the composed sentence, spot a good combination; no duplicate word within a place; randomness that can be fixed for tests. Words from the validated list in `words.ts`.

**Acceptance criteria:**
- [ ] Turning a row changes only that row; a column only that column; shake changes the whole grid; a block never shows the same word twice in a row
- [ ] Every word stays in its grammatical place; place cranks and row cranks each flip exactly the right blocks; the composed sentence follows the picks
- [ ] The same seed gives the same results; good combinations are detected by a simple, documented rule

**Verification:**
- [ ] `npm run test` passes with tests for each rule above; `npm run check` passes

**Dependencies:** Checkpoint A
**Files likely touched:** `src/demos/lagado/engine.ts`, `src/demos/lagado/engine.test.ts`, `src/demos/lagado/words.ts`
**Estimated scope:** M

---

## T3: Folio logic and tests

**Description:** Keeping lines: add the composed sentence, number lines, edit a line, delete one line or all with undo, build the share text for one line and for the whole folio (sentence(s) + the exhibit's link), and save/load on the device, tolerating a browser that refuses storage.

**Acceptance criteria:**
- [ ] Lines keep their writing order in storage (shown newest first) and survive a save/load round trip; edits are saved; delete and clear can be undone
- [ ] The share text for one line and for the whole folio includes the exhibit's link
- [ ] With storage refused (private mode), the folio still works for the visit, without errors

**Verification:**
- [ ] `npm run test` passes with tests for each rule above

**Dependencies:** T2 (uses its row reading)
**Files likely touched:** `src/demos/lagado/folio.ts`, `src/demos/lagado/folio.test.ts`
**Estimated scope:** S

---

## T4: Rough machine and folio on the demo page, draft PR

**Description:** A plain, undrawn but fully playable version: grid of word blocks, a crank button for each row and column, "Shake the frame", tap a sentence to keep it, a plain folio with Copy and Clear. Replaces the "being assembled" teaser. Open the draft PR to get a preview link.

**Acceptance criteria:**
- [ ] Desktop: a 6 × 6 square, places as columns (crank on top), rows with a crank at the side. Phone (below 760px): the same frame on its side, each place a row of 3 words sized to the word, with its crank. Tap one word per place to compose. Every crank flips its blocks in place; all work by tap and keyboard; controls at least 44 × 44 px
- [ ] Keep adds the composed sentence as the folio's newest line; each line can be edited, shared (share menu or copy) and deleted with Undo; Copy all and Clear all (with Undo) work; the folio survives a reload
- [ ] No sideways scroll at 375px; no word touches its block's edges

**Verification:**
- [ ] `npm run test`, `npm run check`, `npm run build` pass
- [ ] playwright-cli at three sizes: crank a row and a column (both on a phone and on desktop), shake, keep two sentences, reload, copy, clear; no console errors; no external requests
- [ ] Draft PR open, Vercel preview link sent to the author

**Dependencies:** T2, T3
**Files likely touched:** `src/demos/lagado/Demo.astro`, `src/demos/lagado/Machine.tsx`, `src/demos/lagado/Folio.tsx`
**Estimated scope:** M

---

## Checkpoint B — the author plays on her phone

- [ ] Fun? Light-up effect kept, changed or dropped?
- [ ] Decisions recorded in the journal

---

## T5: Frame, blocks and cranks drawn in the engraving language

**Description:** Draw the machine as an object: the frame and its wires, the wooden blocks, the iron cranks at row ends and column feet, in fine neon orange line-work with cross-hatching (SVG and CSS, no image file), sized to the grid chosen at B.

**Acceptance criteria:**
- [ ] The machine reads as a physical object on a phone (the author's "bold, good-looking"), every word legible at 375px
- [ ] Tap targets unchanged (≥ 44 × 44 px); keyboard focus visible on cranks and sentences

**Verification:**
- [ ] `npm run test`, `npm run check`, `npm run build` pass
- [ ] playwright-cli screenshots at three sizes, sent to the author

**Dependencies:** Checkpoint B
**Files likely touched:** `src/demos/lagado/Machine.tsx`, `src/demos/lagado/machine.css`, `src/demos/lagado/engine.ts`(+ test)
**Estimated scope:** M

---

## T6: Motion, word sizing, folio styled

**Description:** Crank turns and blocks flip with a short stagger (under half a second); the kept row slides into the folio; words in Instrument Serif at 20px on a phone and 24px on desktop; the folio styled as a clean, modern list.

**Acceptance criteria:**
- [ ] Animations short and snappy; with reduced motion, words change instantly and nothing moves
- [ ] Every word in the list fits its block at 375px without touching the edges (automatic check over the whole list)
- [ ] Folio matches the site's 2026 interface (reading font, mono labels), not the vintage look

**Verification:**
- [ ] `npm run check`, `npm run build` pass; reduced-motion check with playwright-cli
- [ ] Preview link sent to the author

**Dependencies:** T5
**Files likely touched:** `astro.config.mjs`, `src/demos/lagado/Machine.tsx`, `src/demos/lagado/Folio.tsx`, `src/demos/lagado/machine.css`
**Estimated scope:** M

---

## Checkpoint C — look and feel

- [ ] The author approves the drawn machine and the folio on her phone

---

## T7: Hero, page order and banner lines

**Description:** The Swift drawing as the hero (light lines on black, by its credit id), the page order from the spec (hero, plates area, "Turn the cranks", machine, folio, banner, calls to action, credits), the validated banner lines.

**Acceptance criteria:**
- [ ] Hero shown by credit id, optimised for phone, no layout shift, credited to the author
- [ ] Page order as in the spec at phone and desktop sizes; the machine reachable within one or two swipes on a phone
- [ ] Banner shows Lagado's lines; still with reduced motion

**Verification:**
- [ ] `npm run check`, `npm run build` pass; playwright-cli at three sizes; screenshots to the author

**Dependencies:** Checkpoint C
**Files likely touched:** `src/components/Hero.astro`, `src/demos/lagado/Demo.astro`, `src/layouts/ExhibitLayout.astro`, `src/content/exhibits/lagado/exhibit.yaml`
**Estimated scope:** M

---

## T8: The three plates

**Description:** Specimen, quote and specifications as floating plates: draggable within their own area, tap to bring one forward larger, Escape or tap outside to put it back. Texts from Checkpoint A.

**Acceptance criteria:**
- [ ] Plates never cover text or buttons; dragging doesn't block page scrolling on a phone
- [ ] Tap enlarges, Escape or tap outside closes; works by keyboard; screen readers get the full texts
- [ ] The specifications plate reads as a start-up product sheet (funny), with true figures

**Verification:**
- [ ] `npm run check`, `npm run build` pass
- [ ] playwright-cli: drag, enlarge, close, scroll past at 390×844; keyboard path; no sideways scroll

**Dependencies:** T7
**Files likely touched:** `src/components/Plates.astro`, `src/components/plates.ts`, `src/content/exhibits/lagado/exhibit.yaml`
**Estimated scope:** M

---

## Checkpoint D — the landing page

- [ ] The author approves the full demo page on her phone

---

## T9: Sound module: choice, mute toggle, on-demand Howler

**Description:** `src/sound/`: the preference (unset, on, off) saved on the device, never in a cookie; "With sound / In silence" buttons above the machine; a mute toggle in the site header kept across page changes; Howler downloaded only when sound is turned on. Install Howler 2.2.x after confirming the stable version in its docs.

**Acceptance criteria:**
- [ ] Silent by default; the choice is remembered; the mute toggle stays put across page changes and is keyboard-reachable with a clear label
- [ ] With silence chosen (or never chosen), Howler is never downloaded
- [ ] `src/sound/` imports nothing else from the app

**Verification:**
- [ ] `npm run test` (preference logic), `npm run check`, `npm run build` pass
- [ ] playwright-cli network log: no Howler request while silent; Howler requested after "With sound"; mute state kept from demo to essay and back

**Dependencies:** Checkpoint D (can start earlier if a checkpoint is waiting)
**Files likely touched:** `package.json`, `src/sound/preference.ts` (+ test), `src/sound/player.ts`, `src/sound/MuteToggle.astro`, `src/layouts/ExhibitLayout.astro`
**Estimated scope:** M

---

## T10: Lagado sounds, credited and wired

**Description:** Find CC0 candidates for a crank clack, a shake rattle and a soft "kept" click; check each licence on its own page; compress; declare each in Lagado's credits; play them from the machine. Extend the build guard so an uncredited sound file stops the build.

**Acceptance criteria:**
- [ ] Each sound CC0, licence read on its source page, credited (shown in the credits block); each file under ~30 KB
- [ ] Sounds play on crank, shake and keep when sound is on, never when off
- [ ] The build fails on an uncredited sound file (triggered once on purpose, then reverted)

**Verification:**
- [ ] `npm run test`, `npm run check`, `npm run build` pass
- [ ] Preview link sent to the author

**Dependencies:** T9
**Files likely touched:** `src/demos/lagado/sounds/*`, `src/content/exhibits/lagado/exhibit.yaml`, `src/lib/exhibit-pages.ts`, `src/demos/lagado/Machine.tsx`
**Estimated scope:** M

---

## Checkpoint E — the author listens

- [ ] The author keeps or replaces each sound, checked on her iPhone (sound unlock in Safari)

---

## T11: The original page and fourth tab

**Description:** An optional `original.mdx` per exhibit; the page at `/exhibits/<slug>/original/` in the annotated-copy layout with a link back to the demo; the tab "The original" shown only when the file exists. Lagado's passage from `original-passage.md`, with the page-break marker removed and the edition credited.

**Acceptance criteria:**
- [ ] Lagado has the page and the tab; an exhibit without `original.mdx` has neither (tested)
- [ ] Passage identical to the Wikisource text apart from the removed marker (automatic comparison); edition, year and editor credited
- [ ] Four tabs on one line at 375px; own title and link preview description; `docs/project.md → Routes` updated

**Verification:**
- [ ] `npm run test`, `npm run check`, `npm run build` pass; playwright-cli at three sizes

**Dependencies:** T1 (independent of the machine)
**Files likely touched:** `src/content.config.ts`, `src/pages/exhibits/[slug]/original.astro`, `src/components/ExhibitNav.astro`, `src/content/exhibits/lagado/original.mdx`, `docs/project.md`
**Estimated scope:** M

---

## T12: Lagado making-of

**Description:** Write the making-of from the journal (Phases 0 to 1.2): what was built with AI, the key prompts and decisions, what failed. Short, readable on a phone.

**Acceptance criteria:**
- [ ] Every fact traceable to the journal; the author's quoted words exact
- [ ] Validated or corrected by the author

**Verification:**
- [ ] `npm run build` passes; read on phone width

**Dependencies:** T11 (so it can mention every part)
**Files likely touched:** `src/content/exhibits/lagado/making-of.mdx`
**Estimated scope:** S

---

## T13: Performance and full browser checks

**Acceptance criteria:**
- [ ] Demo page on a slowed phone profile (local build): LCP < 2.5 s, CLS < 0.1, INP < 200 ms on a crank
- [ ] Every browser check in the spec passes at 390×844, 375×667 and 1280×800 (no sideways scroll, no external requests, no console errors, reduced motion)

**Verification:** numbers and check output recorded in the journal

**Dependencies:** T12
**Estimated scope:** S

---

## T14: ADR 006, README, journal

**Acceptance criteria:**
- [ ] `docs/adr/006-…md`: machine logic apart from drawing, the sound module and on-demand Howler, credited sounds, the optional original part
- [ ] README current state updated; journal entries for each session

**Dependencies:** T13
**Files likely touched:** `docs/adr/006-*.md`, `README.md`, `docs/features/lagado/journal.md`
**Estimated scope:** S

---

## T15: PR ready, phone check, merge on her word

**Acceptance criteria:**
- [ ] PR marked ready, listing sounds and texts with their licences; Vercel checks green
- [ ] Checks re-run on the preview; the author approves on her phone (with sound on her iPhone); merge on her word
- [ ] After merge: production checked; journal updated; reminder that Part 3 (link preview images) comes next

**Dependencies:** T14
**Estimated scope:** S
