# Spec: The Llull exhibit (Llull's Ars Magna)

> Second exhibit, the next feature after the MVP. Branch: `feature/llull-exhibit`. Replaces the About-page spec (kept in git history).
> Decision filter: [docs/project.md → Project compass](./docs/project.md#project-compass). Working notes and sources: [docs/features/llull/](./docs/features/llull/) (journal, the author's essay and notes, engravings, source texts, question shortlist).

## Objective

Open Llull's sealed card: a playable reconstruction of Ramon Llull's *Ars generalis ultima* (1305–1308), the "Great Art" that answers questions by turning paper wheels. It gets the same four parts as Lagado: Demo, Essay, The original and Making-of. Visitors arrive from LinkedIn on phones, so they must be able to **ask the Art a question within seconds and get a verdict worth sharing**.

The exhibit's argument, from the author's essay: Lagado hoped for knowledge by luck, Llull by rule. **Generate, test, discard the false, keep the true.** "Saying everything" already means "saying one thing". The machine must make that difference playable, not just describe it.

### What the visitor gets

1. **The demo page** (`/exhibits/llull/`):
   - Lagado's structure: the sticker, the title with its last word in italics, three draggable plates, the tabs, the machine, the scrolling parody banner, links and credits.
   - **Plate I, Specimen.** The fourth figure from the 1517 Lyon edition (a real paper volvelle), with a short label. Its opened text explains the Art for a stranger.
   - **Plate II, "The pitch to the Pope".** The author's ink drawing of Llull, with Llull's real campaign to win funding from five popes. Facts from Peers's 1929 biography (public domain), with one short line of his own translated by us.
   - **Plate III, Spec sheet.** The Art as a start-up product sheet: 9 letters, 4 figures, 84 columns, 1,680 chambers, true statements guaranteed. Every figure is checked against the sources.
   - **The sticker and banner lines** are new jokes about Llull. They're drafted and picked at Checkpoint A.
2. **The machine.** It answers **nine questions** by Llull's real procedure:
   - **Six real questions**, asked and answered by Llull in the *Ars generalis ultima*:
     1. Is the world eternal? (the only one Llull runs through a whole column, BCD)
     2. Is the imagination of animals less than ours? (the golden mountain)
     3. Why do people enjoy new things?
     4. Is it legitimate to lie in order to communicate a greater truth?
     5. Why can someone who strives to be honoured never find his fill of honour?
     6. Why is a glutton never satisfied?
   - **Three start-up questions**, asked in 2026 and answered only with Llull's own definitions and analogies, labelled as such on the page:
     1. Will AI take my job?
     2. Should we pivot?
     3. Will the Pope fund my Art?
   - **How a question plays:** tap a question → its letters light up → the three rings of the fourth figure turn to its column → a few chambers pass as reasons, one line each → a verdict lands with its source line → keep or share it (with the exhibit's link).
   - **What it does not do:** answer typed questions. That would need AI running on the site (out of scope: static site, no runtime AI), and it would no longer be Llull.
   - **The look** is decided from 2–3 directions shown as a clickable prototype (Checkpoint B). It must be a 2026 product, not a manuscript (rule: "vintage is content, never look").
3. **The essay** (`/essay/`): the author's "Turn and Turn Again: Llull's Great Art", word for word, illustrated with 1–3 engravings in the annotated-copy layout. It has no `research` reference (no article behind it). Her own source list stays at the end, as she wrote it.
4. **The original** (`/original/`): a short passage of Llull's own words, **translated by us from a public-domain Latin edition** and credited as such, ideally the one that introduces the alphabet or the fourth figure. No public-domain English translation exists.
5. **The making-of** (`/making-of/`): the shared making-of components, written from this exhibit's journal and validated by the author.
6. **The home card and the page change:** `year: "1308"` and a `card` image (the fourth figure as ink on a transparent ground), and the same image as the pages' neon `texture`. The card's engraving grows into the texture on entering (ADR 008).
7. **A link-preview image** (1200 × 627), designed like Lagado's (ADR 007), with the author's drawing of Llull.
8. **Sound** with the existing module: a few small sounds tied to the gestures (rings turning, a verdict stamp). They must be CC0 or similar, credited, chosen by ear by the author.
9. **Opening:** `status: open` is the last step, on the author's word. Until then Llull stays sealed and its URLs return 404.

### Acceptance criteria

- On a 375 × 667 phone, a visitor can pick a question and see its verdict without scrolling past the machine. The first question's verdict arrives in under 4 seconds of animation, and can be skipped by tapping.
- Every real question shows its source line. Every start-up question says it was asked in 2026 and answered with Llull's definitions.
- Every quoted or translated word is checked against its source, and a test keeps the questions and answers in the code identical to the validated document (as Lagado's word list is).
- Every image, text and sound is credited with a clear licence. The build guard (ADR 005) stops on anything uncredited.
- Nothing on the home page uses Llull's pink except Llull's own card. Llull's pages glow pink, never Lagado orange.
- There is no sideways scroll at 375, 390, 1280 and 1440px, and no console errors. No request leaves the site, and the sound library isn't downloaded while silent.
- Speed on a phone (Slow 4G, 4× slower CPU): LCP under 2.5s, CLS under 0.1, and a tap on the machine answers in under 200ms.
- With reduced motion, the rings jump instead of turning and the verdict appears at once.
- Lagado and the home page are unchanged, apart from Llull's card opening.

## Tech Stack

See [docs/project.md → Tech Stack](./docs/project.md#tech-stack). There are no new dependencies. The machine is a React island like Lagado's (ADR 006); Tone.js is not needed.

## Commands

```
Dev:        npm run dev        (http://localhost:4321; restart after adding content files, ADR 002)
Build:      npm run build
Test:       npm run test
Type check: npm run check
Browser:    playwright-cli, one named session per task (AGENTS.md)
```

## Project Structure

Same pattern as Lagado (ADR 002, 005, 006):

```
src/content/exhibits/llull/   exhibit.yaml (metadata, credits, banner, sticker, year, card, texture, preview),
                              essay.mdx, original.mdx, making-of.mdx, images/
src/demos/llull/              Demo.astro, Hero.astro (plates), Machine.tsx, the machine's rules
                              (art.ts: alphabet, columns, chambers, questions) with tests, CSS, sounds/
docs/features/llull/          journal, sources, engravings, source texts, question shortlist
docs/adr/                     an ADR if the machine introduces a lasting pattern
```

The shared layout, components and the home page don't change, except where a shared piece proves Lagado-specific (named first and asked).

## Code Style

As in `src/demos/lagado/`: the rules are plain TypeScript with no React, seedable where random, and tested; the island only draws and reacts. Data lives in one file and is validated by a test against the author-approved document. Hand-written CSS only for the machine.

```ts
// art.ts — the alphabet as Llull gives it (Ars brevis, 1308), one entry per letter
export const ALPHABET = {
  B: { dignity: "Goodness", relation: "Difference", question: "Whether?", subject: "God", virtue: "Justice", vice: "Avarice" },
  // …
} as const;
export function columnFor(letters: string): Column { /* one of the 84 */ }
```

## Testing Strategy

- **Vitest for the rules:**
  - the alphabet;
  - the 84 columns (all 3-letter combinations of B–K, BCD to HIK);
  - the 20 chambers of a column in Llull's order (BCD → bcd, bcdt, bctb … tbcd);
  - each question's letters and column;
  - the questions and verdicts identical to the validated document.
- **Tests first** for the rules, as for Lagado's engine.
- **playwright-cli** at 375, 390 and 1280px, then 1440: the play-through of every question, keep and share, reduced motion, no sideways scroll, console and network clean.
- A speed trace on the local build before the PR.

## Boundaries

- **Always:**
  - show options as a clickable prototype (private artifact) before building a look;
  - check every fact and quotation against a source;
  - credit every asset;
  - verify at phone width first, with screenshots in Edge;
  - keep the journal entry for each session.
- **Ask first:**
  - any change to a shared component or to Lagado;
  - any wording on the page the author hasn't seen;
  - writing to Dambergs or anyone else (her message);
  - using her drawing beyond plate II;
  - a new dependency;
  - changing the Project compass.
- **Never:**
  - vintage interface looks (wood, parchment, fake 3D, period typefaces);
  - presenting a start-up question as Llull's;
  - quoting the copyrighted translations beyond short, credited answers;
  - an asset whose licence is unclear (the Palma third figure stays out);
  - opening the exhibit or merging without her explicit word.

## Success Criteria

The author plays all nine questions on her phone on the PR preview and says it's fun. Every source line holds up. The Llull card opens from the home page into a pink-lit page. The four parts can be shared on LinkedIn with their own preview.

## Decisions at approval (2026-11-13) and what stays open

Approved by the author on 2026-11-13 with these decisions:
- **Llull's answers in English:** short quotations from Yanis Dambergs' translation, credited to him (her call: "It's small quotes. It's fine. We can just credit him"). **The original** is translated by us from the Latin.
- **D = Eternity** everywhere on the site; the engraving's DURATIO stays as printed.
- **The essay's date:** "between 1305 and 1308".
- **Her drawing** on plate II **and** on the link-preview image.
- **Card and texture:** the volvelle (the 1517 fourth figure).
- **Animation length** as specified.

Still open, settled at their checkpoints:
1. The machine's look (Checkpoint B prototype).
2. The exact Latin on the banderole in her drawing (agent reads it closely; she confirms).
3. Which Latin passage for The original.
4. Sounds (auditioned by ear).

## Plan outline (detailed in `tasks/plan.md` after approval)

1. **Content (Checkpoint A).** The nine questions with letters, columns, reasons and verdicts; plate texts; sticker and banner lines; translations. All in one validated document.
2. **The rules, tests first.**
3. **The machine look as a prototype (Checkpoint B).**
4. **The machine built, rough then final (Checkpoint C: is it fun?).**
5. **Plates, hero, page (Checkpoint D).**
6. **The essay with engravings, The original.**
7. **Sound (Checkpoint E).**
8. **Card, texture, preview image.**
9. **Making-of.**
10. **Checks, ADR, PR, and opening on her word.**
