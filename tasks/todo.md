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

## T2: Engine logic and tests ✅

**Description:** The machine's rules as plain TypeScript: a frame of rows (3 on a phone, 6 on desktop) × 6 grammatical places; flip a set of blocks (a place or a row), shake, pick one word per place, read the composed sentence, spot a good combination; no duplicate word within a place; randomness that can be fixed for tests. Words from the validated list in `words.ts`.

**Acceptance criteria:**
- [x] Turning a row changes only that row; a column only that column; shake changes the whole grid; a block never shows the same word twice in a row
- [x] Every word stays in its grammatical place; place cranks and row cranks each flip exactly the right blocks; the composed sentence follows the picks
- [x] The same seed gives the same results; good combinations are detected by a simple, documented rule

**Verification:**
- [x] `npm run test` passes with tests for each rule above; `npm run check` passes

**Dependencies:** Checkpoint A
**Files likely touched:** `src/demos/lagado/engine.ts`, `src/demos/lagado/engine.test.ts`, `src/demos/lagado/words.ts`
**Estimated scope:** M

---

## T3: Folio logic and tests ✅

**Description:** Keeping lines: add the composed sentence, number lines, edit a line, delete one line or all with undo, build the share text for one line and for the whole folio (sentence(s) + the exhibit's link), and save/load on the device, tolerating a browser that refuses storage.

**Acceptance criteria:**
- [x] Lines keep their writing order in storage (shown newest first) and survive a save/load round trip; edits are saved; delete and clear can be undone
- [x] The share text for one line and for the whole folio includes the exhibit's link
- [x] With storage refused (private mode), the folio still works for the visit, without errors

**Verification:**
- [x] `npm run test` passes with tests for each rule above

**Dependencies:** T2 (uses its row reading)
**Files likely touched:** `src/demos/lagado/folio.ts`, `src/demos/lagado/folio.test.ts`
**Estimated scope:** S

---

## T4: Rough machine and folio on the demo page, draft PR ✅

**Description:** A plain, undrawn but fully playable version: grid of word blocks, a crank button for each row and column, "Shake the frame", tap a sentence to keep it, a plain folio with Copy and Clear. Replaces the "being assembled" teaser. Open the draft PR to get a preview link.

**Acceptance criteria:**
- [x] Desktop: a 6 × 6 square, places as columns (crank on top), rows with a crank at the side. Phone (below 760px): the same frame on its side, each place a row of 3 words sized to the word, with its crank. Tap one word per place to compose. Every crank flips its blocks in place; all work by tap and keyboard; controls at least 44 × 44 px
- [x] Keep adds the composed sentence as the folio's newest line; each line can be edited, shared (share menu or copy) and deleted with Undo; Copy all and Clear all (with Undo) work; the folio survives a reload
- [x] No sideways scroll at 375px; no word touches its block's edges

**Verification:**
- [x] `npm run test`, `npm run check`, `npm run build` pass
- [x] playwright-cli at three sizes: crank a row and a column (both on a phone and on desktop), shake, keep two sentences, reload, copy, clear; no console errors; no external requests
- [x] Draft PR open, Vercel preview link sent to the author

**Dependencies:** T2, T3
**Files likely touched:** `src/demos/lagado/Demo.astro`, `src/demos/lagado/Machine.tsx`, `src/demos/lagado/Folio.tsx`
**Estimated scope:** M

---

## Checkpoint B — the author plays on her phone ✅

- [x] Fun? Yes ("it's fun"). Light-up note kept for now. Cranks: not loved yet; options shown against the drawn machine at Checkpoint C
- [x] Decisions recorded in the journal

---

## T5: The machine's look ✅ (redone as "Signal")

**What happened:** the engraved frame with three crank drawings was built, then rejected by the author ("the vintage is the content, not the look"). Three modern directions were compared in a clickable prototype; she chose **Signal** and tuned it over several rounds (scramble animation, compact phone rows, the thread through the picked words, smoothness on desktop). See SPEC.md → Look and the journal.

**Acceptance criteria:**
- [x] Signal look in the real machine: line field, plain glowing words, glowing thread, scramble, crisp crank icon; the temporary crank switch removed
- [x] Tap targets ≥ 44px; keyboard focus visible
- [x] The same adjective never appears twice in a sentence (engine test)
- [x] Editing a kept line falls back to ordinary editing in browsers without plain-text editing (Firefox before 136)

**Verification:**
- [x] `npm run test` (63), `npm run check` (0 errors), `npm run build`
- [x] playwright-cli in Edge at 375×667, 390×844, 1280×800: cranks, picks, keep, edit, delete, undo, reload; the page below doesn't move on a crank or shake; rows on one line; no console errors

---

## T6: Motion, word sizing, folio styled ✅ (folded into T5)

The scramble, word sizing and the modern folio were settled in the prototype rounds and built with T5. Remaining polish, if any, comes from the author's check of the preview.

---

## Checkpoint C — look and feel ✅ ("I LOVE IT", 2026-11-11)

- [x] The author approves the drawn machine and the folio on her phone

---

## T7: The three cards (specimen, quote with Swift's face, spec sheet) ✅

**Description:** Design the three cards in the Signal look (modern cards; the vintage is their content), first in the clickable prototype for the author, then build them on the demo page above the machine. The quote card carries the author's drawing of Swift. Texts from Checkpoint A (`machine-content.md`).

**Acceptance criteria:**
- [x] Prototype version shown to the author on her phone and desktop, and approved before building
- [x] On the page: a compact row (swipe on a phone, side by side on desktop); tap a card to enlarge it, Escape or tap outside to close; works by keyboard; screen readers get the full texts
- [x] The Swift drawing shown by its credit id, credited to the author; full size when enlarged; the spec sheet funny, every figure true to Swift's passage

**Verification:**
- [x] `npm run test`, `npm run check`, `npm run build` pass
- [x] playwright-cli in Edge at 375×667, 390×844, 1280×800: swipe, enlarge, close, keyboard; no sideways scroll; the machine still within about one swipe on a phone

**Dependencies:** Checkpoint C
**Files likely touched:** `src/components/Cards.astro` (or `.tsx`), `src/demos/lagado/Demo.astro`, `src/content/exhibits/lagado/exhibit.yaml`, styles
**Estimated scope:** M

---

## T8: Page order and parody banner ✅

**Description:** Put the page in the agreed order (title → cards → "Turn the cranks" → machine → folio → banner → calls to action and credits) and fill the scrolling banner with the validated parody lines.

**Acceptance criteria:**
- [x] Order as in the spec at phone and desktop sizes; the machine about one swipe down on a phone
- [x] Banner shows Lagado's lines (chosen by the author from `machine-content.md`); still with reduced motion

**Verification:**
- [x] `npm run check`, `npm run build` pass; playwright-cli at three sizes; screenshots to the author

**Dependencies:** T7
**Files likely touched:** `src/demos/lagado/Demo.astro`, `src/layouts/ExhibitLayout.astro`, `src/content/exhibits/lagado/exhibit.yaml`
**Estimated scope:** S

---

## Checkpoint D — the landing page ✅ ("Yes, balanced", 2026-11-11; banner lines chosen the same day)

- [x] The author approves the full demo page on her phone

---

## T9: Sound module: choice, mute toggle, on-demand Howler ✅

**Description:** `src/sound/`: the preference (unset, on, off) saved on the device, never in a cookie; one small "Sound" toggle right of the play heading, the only sound control (decided with the author after two other versions); Howler downloaded only when sound is turned on. Install Howler 2.2.x after confirming the stable version in its docs.

**Acceptance criteria:**
- [x] Silent by default; the choice is remembered; the mute toggle stays put across page changes and is keyboard-reachable with a clear label
- [x] With silence chosen (or never chosen), Howler is never downloaded
- [x] `src/sound/` imports nothing else from the app

**Verification:**
- [x] `npm run test` (preference logic), `npm run check`, `npm run build` pass
- [x] playwright-cli network log: no Howler request while silent; Howler requested after "With sound"; mute state kept from demo to essay and back

**Dependencies:** Checkpoint D (can start earlier if a checkpoint is waiting)
**Files likely touched:** `package.json`, `src/sound/preference.ts` (+ test), `src/sound/player.ts`, `src/sound/SoundToggle.astro`, `src/demos/lagado/Demo.astro`
**Estimated scope:** M

---

## T10: Lagado sounds, credited and wired ✅

**Description:** Find CC0 candidates for a crank clack, a shake rattle and a soft "kept" click; check each licence on its own page; compress; declare each in Lagado's credits; play them from the machine. Extend the build guard so an uncredited sound file stops the build.

**Acceptance criteria:**
- [x] Each sound CC0, licence read on its source page, credited (shown in the credits block); each file under ~30 KB
- [x] Sounds play on crank, shake and keep when sound is on, never when off
- [x] The build fails on an uncredited sound file (triggered once on purpose, then reverted)

**Verification:**
- [x] `npm run test`, `npm run check`, `npm run build` pass
- [x] Preview link sent to the author

**Dependencies:** T9
**Files likely touched:** `src/demos/lagado/sounds/*`, `src/content/exhibits/lagado/exhibit.yaml`, `src/lib/exhibit-pages.ts`, `src/demos/lagado/Machine.tsx`
**Estimated scope:** M

---

## Checkpoint E — the author listens ✅

- [x] The author keeps or replaces each sound: rattle kept; crank and keep replaced (dice click, traditional stamp); all softened, "softest" level
- [x] Checked on her iPhone (sound unlock in Safari): "Yes, I like softest, and please let's move on"

---

## T11: The original page and fourth tab ✅

**Description:** An optional `original.mdx` per exhibit; the page at `/exhibits/<slug>/original/` in the annotated-copy layout with a link back to the demo; the tab "The original" shown only when the file exists. Lagado's passage from `original-passage.md`, with the page-break marker removed and the edition credited.

**Acceptance criteria:**
- [x] Lagado has the page and the tab; an exhibit without `original.mdx` has neither (tested)
- [x] Passage identical to the Wikisource text apart from the removed marker (automatic comparison); edition, year and editor credited
- [x] Four tabs on one line at 375px; own title and link preview description; `docs/project.md → Routes` updated

**Verification:**
- [x] `npm run test`, `npm run check`, `npm run build` pass; playwright-cli at three sizes

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
