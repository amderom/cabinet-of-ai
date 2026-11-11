# Spec: Phase 1.2 part 2 — The Lagado machine

> Source: [STARTUP.md → Phase 1.2, Part 2](./STARTUP.md#phase-12--the-lagado-machine) and [docs/ideas/demo-context.md](./docs/ideas/demo-context.md).
> Decision filter: [docs/project.md → Project compass](./docs/project.md#project-compass) ("Play first, read second", "Scholarship and parody side by side", "Phone first").
> Branch: `feature/phase-1-2-machine`. Replaces the Phase 1.2 part 1 spec (kept in git history).

## Objective

Make Lagado playable. A visitor arriving from LinkedIn lands on the Lagado demo page, sees Swift (the author's drawing), three plates that tell them what the object is, and a word machine they can crank by rows and by columns, until it produces sentences that are funny and *almost* make sense. They keep the best ones in a folio they can copy. Sound is optional, chosen once, and can be muted at any time. A fourth part, **The original**, gives Swift's own passage.

**The bar, in the author's words:** really fun, bold, good-looking, and it works on a phone.

**Users:** LinkedIn visitors on phones (recruiters, academics). The author reviews at each checkpoint.

**What a visitor can do at the end:** arrive on `/exhibits/lagado/`, choose to play with sound or in silence, turn the machine's rows and columns, copy sentences into a folio and copy the folio out, read the plates and the parody banner, then open the essay, the making-of or the original text.

**Scope check.** Several pieces (machine, landing page, sound, The original, making-of), but they ship together as one exhibit and share one review loop with the author. One spec in gated steps (below), not a capability map. The sound module is kept separate in code (`src/sound/`), because the cabinet reuses it in Phase 1.3.

## The machine (how it plays)

**Faithful to Swift's idea, not to his numbers.** In Swift, the frame is covered in little wooden blocks, **one word on each face**, linked by wires; turning the handles turns the blocks "upside down", and the pupils read the lines for "three or four words together, that might make part of a sentence". Here:

- **One word per block, 6 grammatical places** (the author's choice, 2026-11-11, from her own earlier prototype's responsive pattern, rebuilt in this site's look; clickable prototype: https://claude.ai/artifact/3dDzw1fjczqL1MksyoF8Tf):
  - **Desktop: a 6 × 6 square.** Every **column is one grammatical place** (labelled, crank on top); every **row** holds one word per place (crank at the side).
  - **Phone: the same frame on its side.** Each grammatical place is a row: its label, its crank, and **3 words as blocks sized to the word**, on one line, 20px. No fixed boxes, so no word is squeezed. (Row cranks of the square are not shown on a phone, as in the author's example; Shake turns everything.)
  - **The visitor composes:** tap one word per place; the sentence appears large below. Words never need to be on the same row.
  - The logic works with any number of rows; the number of handles doesn't matter.
- **The frame turns both ways, always: by rows AND by columns.** A crank at the end of every row and at the foot of every column, on desktop (6 column cranks + 6 row cranks); on a phone each place has its crank. **Turning = the blocks flip in place** (the author's choice): every block on that row or column shows a new word, like Swift's cubes moving "upside down"; words never slide to another place.
- **"Shake the frame"**: one big lever that turns every block at once (Swift's pupils give the handles "a sudden turn").
- **Each sentence has 6 grammatical places:** *adjective · noun · verb · adjective · noun · adverb*, e.g. **Doleful · Comets · monetize · Celestial · Musick · softly**. Every block only shows words that suit its place. Since blocks flip in place and never move, every sentence stays possible, whichever row or column you turn. (The "pure Swift" mode, any word anywhere, was dropped: grammatical places are now built into the frame.)
- **The students take note.** When a sentence lands on a particularly good combination (e.g. words from the same field), it lights up briefly. Light touch, tuned at Checkpoint B.
- **The folio (modern, not vintage), made for sharing.** The old look stays in the machine; the folio is interface, so it looks like the rest of the 2026 site (Project compass, principle 2). Shaped with the author on 2026-11-11 for "a super good time" and sentences people want to send to friends:
  - **One block, one button:** the sentence being composed is the folio's next line, large, with a single **Keep** button beside it. No separate "your sentence" area.
  - **Kept lines below, newest first**, without numbers (the newest lands right under Keep; the header counts the lines). Copy all gives them in the order they were written.
  - **Every line can be edited** like text (tap it, type, Enter or tap away to finish).
  - **Every line can be shared on its own**, and its icon shows what will really happen: on a phone, the standard **share** icon opens the phone's own share menu (messages, WhatsApp, LinkedIn, X…) with the sentence and the exhibit's link; elsewhere a **clipboard** icon copies them. No third-party share buttons or scripts. Hyphenated words (*Pre-seed*, *Sun-beams*) never break across lines.
  - **Every line can be deleted on its own** (×), and **Clear all** empties the folio; both act at once and offer **Undo** for a few seconds (no double tap, no confirmation dialog).
  - **Copy all** copies the whole folio with the exhibit's link.
  - Kept on the visitor's own device (browser storage only: no account, no server, no cookie), so it is still there when they come back.
  - A shareable image of a line (an engraved card) is parked in IDEAS.md.

### The words on the blocks

- **About 160–200 words**, one per block, **9 letters at most** (so every word fits a block on a 375px phone, cranks included), in English, with an 18th-century flavour, drawn from the period's learned domains: natural philosophy, natural history, astronomy, mathematics, musick, painting, philosophy, politicks, literature, physick.
- **Period spellings, sparingly:** about 1 word in 15 (roughly one on screen at a time), the easiest to read (*Musick, Publick, Politicks, Errour*…), each one printed that way in Swift's *Voyage to Laputa* (or a named period source); no invented "olde" spellings. Every other word in modern spelling. (The author found more of them "a bit complicated".)
- **Start-up and AI jargon mostly in the adjectives and verbs** (about 1 in 5 of each: *Agentic, Pre-seed, monetize, onboard, pivot*…), a little in the nouns (about 1 in 10), so the nouns keep the 18th-century world and the adjective or verb carries the joke. About every other row gets one modern word.
- The full list lives in a data file (`src/demos/lagado/words.ts`), grouped by column role, and **the author reviews it before the machine is drawn** (Checkpoint A).

### Look ("Signal", chosen by the author on 2026-11-11)

> Rule, from the author: **vintage is the content, never the look.** The 18th century lives in the words; the machine looks like a 2026 product. An engraved wooden frame with drawn cranks was built (T5) and rejected ("super vintage", "90s point-and-click", fake 3D); three modern directions were then compared in a clickable prototype (https://claude.ai/artifact/3dDzw1fjczqL1MksyoF8Tf) and **Signal** chosen, after the DeepBook reference.

- **Black, with a slow field of thin vertical lines** behind the machine (a ripple passes through them), fading out at the top and bottom so it never runs behind buttons.
- **Words as plain type** in Instrument Serif, no boxes: unpicked words in soft cream, **picked words glowing in the accent colour**.
- **A glowing dashed thread** runs through the middle of the picked words, in reading order: moving dashes at 40% with a soft orange glow, no dots.
- **Turning = letter scramble:** random letters spin through and settle into the new word, left to right; the word keeps its width meanwhile, so nothing on the page moves.
- **Cranks:** one crisp modern rotate icon, spinning a full turn when used.
- **Phone:** compact rows (small label above the words, crank beside them), words 21px, a row of three long words steps down to 17px at most to stay on one line; the six rows and the sentence fit on a 375×667 screen. Every control at least 44px.
- **Smoothness:** only turned words animate; one shared animation loop; the background lines and the thread are drawn on one canvas about 30 times a second, paused off screen; still when reduced motion is requested.

## The landing page (`/exhibits/lagado/`)

Decided with the author on 2026-11-11: **no separate hero image** (the title with the Engine glowing behind it already plays that role, and a hero would push the machine a screen down on a phone); **her drawing of Swift goes on the quote card**; **the cards come before the machine**, compact, so a stranger understands the object in five seconds and the machine starts about one swipe down on a phone.

Order on a phone (desktop gets more width, same order):

1. **Title and tagline**, with the Engine texture glowing behind (as now).
2. **The three plates** (built 2026-11-11 after several prototype rounds with the author, "Split"): little cream cards fanned like a hand under the title, starting at its left edge; dealt in from a stack on load; draggable inside their own area (never over text or buttons; a drag never opens a plate); tap to open on the same cream paper. Top line says what each plate is (Specimen · Portrait · Figures · 1726); the picture fills the card with the huge orange italic numeral over it; italic caption and plate number below. Above the title, a tilted orange sticker "In beta since 1726" (exhibit.yaml → `sticker`); the title's last word on its own line in italics.
   1. **Pl. I The Engine:** the Engine diagram as ink only. Opened: "A satirical machine from 1726 that writes books by shuffling words at random, three centuries before AI wrote its first sentence. Jonathan Swift dreamt it up to mock the scientists of his day. Turn the handles, read the lines, keep what makes sense." / *Jonathan Swift, Gulliver's Travels (1726)*.
   2. **Pl. II The Pitch:** the author's drawing of Swift, ink on the card (paper removed). Opened: the professor's quote, "Portrait: Amélie Derome".
   3. **Pl. III Spec sheet:** a tiny table (Frame 20 ft · Handles 40 · Pupils 40 · Genius 0). Opened: the product sheet, including "Roadmap: 500 more frames, if the publick would raise a fund".
3. **"Turn the cranks"** and the sound choice (below), then **the machine**, then **the folio**.
4. **The parody banner** (existing scrolling banner) with Lagado's parody lines, drafted by the agent, validated by the author. The banner and the specification card carry the parody; no other format for now (a pitch deck, pricing page etc. is parked in IDEAS.md).
5. The existing calls to action (research, LinkedIn), credits block, and links to the essay, making-of and original.

(Dragging the cards around, as first imagined in the demo plan, is left out unless the author asks for it: on a phone it fights with scrolling, and the swipeable row does the same job.)

## Sound

- **The choice:** two buttons above the machine, *"With sound"* and *"In silence"*. The machine is playable before choosing (silent until then: play first). The choice is remembered on the device (browser storage, never a cookie). In Phase 1.3, the cabinet asks the same question at its first gesture and the answer carries over.
- **Mute toggle** in the site header, on every page, kept across page changes (`transition:persist`), reachable by keyboard, with a clear label.
- **First sounds:** a wooden clack for a crank, a rattle for "Shake the frame", a soft click when a row is kept in the folio. Short, quiet, and never needed to understand anything.
- **Sources:** CC0 recordings only (e.g. Freesound filtered on CC0), licence checked on each file's own page, each declared in Lagado's `credits` (shown in the credits block). Files kept small (compressed, under ~30 KB each).
- **Howler.js** (approved in docs/project.md) is downloaded only after the visitor picks "With sound" or unmutes. Visitors who stay silent never load it.
- iPhone Safari only allows sound after a tap: the "With sound" tap unlocks it.

## The original (`/exhibits/lagado/original/`)

- A fourth part, tab name **"The original"**: Swift's passage on the Academy's word machine, from Part III, chapter 5 (a page or two, not the whole chapter).
- Text from **Wikisource**, *The Works of the Rev. Jonathan Swift*, Volume 6, *A Voyage to Laputa*, Chapter 5 (link and passage provided by the author, saved in `docs/features/lagado/original-passage.md`): from "The first professor I saw" to "without a rival". The page-break marker in the scan ("Vol. VI. p. 212.") is removed; Swift's spelling is kept as printed (*politicks, intirely*). The edition's year and editor are read from the Wikisource page when the page is built. Credited with the edition, Wikisource as source, licence "Public domain".
- Read with the same annotated-copy layout as the essay; links back to the demo (Play first).
- **Only exhibits that have an original get the page and the tab.** Hesse (still in copyright) never will. Adds a route: `docs/project.md → Routes` updated, and the content model change recorded in an ADR.
- The four tabs must fit on one line at 375 px.

## The work, in order (each step gated by the author)

1. **Words and figures (content, no code).** Draft word list by column role (with the source of each period spelling), the specification figures checked against Swift, the quote, the museum label, 6–10 banner lines. → **Checkpoint A:** the author reviews and edits.
2. **Rough machine.** Pure logic with tests, plus a plain, undrawn grid on the demo page; draft PR opened so every push has a preview link. → **Checkpoint B:** the author plays on her phone: is it fun? grid size? does "Shake" feel good? are the sentences funny enough?
3. **The machine, drawn**, plus the folio. → **Checkpoint C:** look and feel on her phone.
4. **Landing page:** the three cards first (designed in the prototype, then built), then the page order and banner around them. → **Checkpoint D.**
5. **Sound:** choice, mute toggle, the three sounds. → **Checkpoint E:** she listens, keeps or replaces.
6. **The original:** page, fourth tab, credits.
7. **Making-of** written from the journal (author validates), performance and browser checks, ADR, README. → PR ready, author approves on her phone, merge on her word.

**Fallback (from STARTUP.md):** if the drawing in Step 3 drags on, the machine ships with the simpler look from Step 2 and is restyled later.

## Tech Stack

See [docs/project.md → Tech Stack](./docs/project.md#tech-stack). New for this part:

- **Howler.js 2.2.x** (approved; exact stable version confirmed against its official docs at install, as docs/project.md requires). Loaded on demand only.
- **No GSAP by default:** animations in CSS and small pointer-event code. If plate dragging or crank motion needs it, ask first.
- The machine is a **React island** (`client:visible`), the only JavaScript-heavy part of the page.

## Commands

```
Install:   npm install
Dev:       npm run dev          # http://localhost:4321
Build:     npm run build
Preview:   npm run preview
Test:      npm run test
Check:     npm run check
```

## Project Structure

Expected changes (follows [docs/project.md → Project Structure](./docs/project.md#project-structure)):

```
src/demos/lagado/Demo.astro           page section: sound choice, island, folio
src/demos/lagado/Machine.tsx          the React island (drawing + interaction)
src/demos/lagado/engine.ts            pure logic: grid, turn row/column, shake, read row, good combinations (seedable randomness)
src/demos/lagado/engine.test.ts       unit tests
src/demos/lagado/folio.ts (+ test)    pure logic: add line, numbering, text for copying, storage read/write (tolerant of no storage)
src/demos/lagado/words.ts             the faces, by column role
src/demos/lagado/sounds/              the CC0 sound files
src/sound/                            sound preference, mute toggle, playback (depends on nothing else in the app)
src/components/Plates.astro (or .tsx) the three draggable plates, tap to enlarge
src/components/Hero.astro             the hero image by credit id
src/components/ExhibitNav.astro       fourth tab, only when an original exists
src/content.config.ts                 originals collection; exhibit fields for plates/banner if needed
src/content/exhibits/lagado/          exhibit.yaml (credits for sounds and text, banner lines, plate texts), original.mdx, making-of.mdx
src/pages/exhibits/[slug]/original.astro
docs/project.md                       Routes: add /exhibits/<slug>/original/ (agreed in demo-context.md)
docs/adr/006-…md                      the machine island, sound module, the original part
IDEAS.md                              parody formats; shareable folio image
```

## Code Style

As in earlier phases: TypeScript strict, Astro components, Tailwind utilities, custom CSS in `global.css` or the demo's own styles, pure logic separate from drawing, with Vitest tests.

```ts
// src/demos/lagado/engine.ts
export type Grid = string[][]; // grid[row][column] = the face showing

/** Turns every block in one row to a new face suited to its column. */
export function turnRow(grid: Grid, row: number, faces: Faces, random: () => number): Grid {
  return grid.map((cells, r) =>
    r === row ? cells.map((_, c) => pick(faces[roleOf(c, cells.length)], random)) : cells,
  );
}
```

## Testing Strategy

- **Unit (Vitest):** `engine.ts`: grid of any size; turning a row changes only that row, a column only that column; every word stays in its grammatical place; shake changes the whole grid; a seeded run is repeatable; good combinations are detected. `folio.ts`: numbering, copied text format, clearing, and working when the browser refuses storage. Sound preference: default silent, remembered choice, mute.
- **Browser (playwright-cli, 390×844, 375×667, 1280×800):**
  1. Cranks for every row and column respond to tap and keyboard; the folio fills, survives a reload, copies, and clears after confirmation.
  2. Plates drag within their area, never cover text or buttons, enlarge on tap and close with Escape.
  3. Silence by default; no Howler download until sound is chosen; mute persists across page changes.
  4. Four tabs on one line at 375 px; The original page exists for Lagado only.
  5. Nothing moves with reduced motion; no sideways scroll; no request leaves the site; no console errors.
  6. Performance (local build, phone profile): demo page LCP < 2.5 s, CLS < 0.1; a crank responds in under 100 ms (INP < 200 ms).
- **Author checks:** Checkpoints A–E on her phone, and the final preview (including sound on her iPhone).

## Boundaries

- **Always:** check every figure, quotation and period spelling against a source before it goes live; record source and licence of every sound and text; test on a phone width first; keep the plates serious except the specification sheet's tech format; keep the parody in the banner and spec sheet; append to `docs/features/lagado/journal.md` after each session; verify Astro, React and Howler APIs against current docs.
- **Ask first:** adding a typeface, installing GSAP or any library not already approved; changing the essay; changing colours; editing the Project compass; any sound or image not yet validated.
- **Never:** use a sound or text with an unclear licence; store anything in cookies or send the folio anywhere (it stays on the device); load Howler for visitors who chose silence; make sound necessary to understand anything; build the LinkedIn preview images (Part 3) or the cabinet (Phase 1.3).

## Success Criteria

1. On a mid-range phone, a visitor can turn every row and every column, shake the frame, and get sentences the author finds funny and almost sensible.
2. The folio grows, survives a reload; each line can be edited, shared (phone share menu, or copy) and deleted with Undo; Copy all and Clear all (with Undo) work.
3. The landing page shows the Swift hero, the three plates (draggable, enlarge on tap), the parody banner and the machine, and the author calls it bold and good-looking on her phone.
4. Every figure on the specification plate, the quote and every period spelling is checked against a source.
5. Sound: silent by default, chosen once, mute toggle kept across pages; silent visitors never download Howler; every sound credited.
6. `/exhibits/lagado/original/` shows Swift's passage, credited; four tabs fit at 375 px.
7. The Lagado making-of is written and validated by the author.
8. Demo page on a phone: LCP < 2.5 s, CLS < 0.1, no sideways scroll, no external requests; unit tests, `npm run check` and `npm run build` pass.
9. ADR 006 written, docs/project.md Routes updated, journal current; PR preview approved by the author on her phone.

## Open Questions

1. ~~Roles or pure Swift~~: settled at Checkpoint A (grammatical places built in; one sentence on a phone, a 6 × 6 square on desktop).
2. ~~Typeface~~: decided at Checkpoint A, Instrument Serif (no new typeface).
3. Grid size and the "students take note" effect: tuned at Checkpoint B.
4. The folio's look: shown at Checkpoint C (modern list by default).

Spec approved by the operator on 2026-11-11.
