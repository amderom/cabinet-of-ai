# Implementation Plan: Phase 1.2 part 2 — The Lagado machine

> Spec: [SPEC.md](../SPEC.md). Tasks: [todo.md](./todo.md).
> Branch: `feature/phase-1-2-machine`. Replaces the Phase 1.2 part 1 plan (done and merged, kept in git history).

## Overview

The spec's seven gated steps, turned into fifteen tasks. Content comes first (words, figures, plate texts), because the machine is only as funny as its words. Then a rough, playable machine with a rough folio, so the author can judge the fun on her phone before anything is drawn. Then the drawing, then the page around it (hero, plates, banner), then sound, then The original, and finally the making-of and shipping. The author steps in at five checkpoints (A–E) plus the final preview.

## Architecture Decisions

- **The machine's rules live apart from its drawing.** `engine.ts` (sentences of 6 grammatical places, turning rows and columns, shaking) and `folio.ts` (keeping lines, numbering, copied text, saving on the device) are plain TypeScript with tests. The React island only draws and reacts. This is what lets us test the machine without a browser, and restyle it later without breaking it.
- **Randomness can be fixed for tests** (a seed), so a test can say "after this crank, the row reads exactly this".
- **One model for both screens:** a frame of rows × 6 grammatical places, plus the visitor's pick for each place. Desktop shows it as a 6 × 6 square (places as columns); a phone shows it on its side (places as rows, 3 words each). Turning = a list of blocks to flip, so the same rules serve both layouts. Validated with a clickable prototype at Checkpoint A.
- **One React island per page** (`client:visible`): the machine and its folio together, since keeping a row feeds the folio. The plates are a separate, much lighter piece of plain browser code.
- **Sound is its own module** (`src/sound/`), depending on nothing else in the app, so the cabinet can reuse it in Phase 1.3. Howler is downloaded only once sound is chosen.
- **Every sound file is credited like an image.** The build guard from Part 1 is extended: a sound file without a credit stops the build.
- **The original is an optional fourth content file** (`original.mdx`). An exhibit with one gets the page and the tab; an exhibit without one gets neither.
- **The draft PR opens early** (with the rough machine), so every later push has a preview link for the author's phone.
- Recorded in **ADR 006**; `docs/project.md → Routes` gets the new route.

## Dependency graph

```
T1 words, figures, plate & banner texts ──► Checkpoint A (author edits)
        │
T2 engine logic + tests
        │
T3 folio logic + tests
        │
T4 rough machine + rough folio on the demo page, draft PR ──► Checkpoint B (author plays)
        │
T5 machine drawn (frame, blocks, cranks)
T6 motion, word sizing, folio styled ──► Checkpoint C (look & feel)
        │
T7 hero and page order, banner lines
T8 the three plates ──► Checkpoint D
        │
T9 sound module (choice, mute, lazy Howler)      ← independent of T5–T8, could start earlier
T10 Lagado sounds (CC0, credited, wired) ──► Checkpoint E (author listens)
        │
T11 The original (page, fourth tab, route)        ← independent, only needs T1
        │
T12 making-of (author validates)
T13 performance + full browser checks
T14 ADR 006, README, journal
T15 PR ready, phone check, merge on her word
```

Mostly sequential: each checkpoint is the author's decision and shapes what follows. T9 and T11 don't depend on the machine; they stay in this order so the author reviews one thing at a time, but they can move earlier if a checkpoint is waiting.

## Task List

### Part A: Content
- [x] T1: Words, figures, plate and banner texts

### Checkpoint A — the author edits the words and texts ✅

### Part B: The machine, rough
- [x] T2: Engine logic and tests
- [x] T3: Folio logic and tests
- [x] T4: Rough machine and folio on the demo page, draft PR

### Checkpoint B — the author plays on her phone ✅

### Part C: The machine, drawn
- [x] T5: The machine's look (redone as "Signal" after the engraved version was rejected)
- [x] T6: Motion, word sizing, folio styled (folded into T5)

### Checkpoint C — look and feel ✅

### Part D: The page
- [ ] T7: Hero, page order and banner lines
- [ ] T8: The three plates

### Checkpoint D — the landing page

### Part E: Sound
- [ ] T9: Sound module: choice, mute toggle, on-demand Howler
- [ ] T10: Lagado sounds, credited and wired

### Checkpoint E — the author listens

### Part F: The original and shipping
- [ ] T11: The original page and fourth tab
- [ ] T12: Lagado making-of
- [ ] T13: Performance and full browser checks
- [ ] T14: ADR 006, README, journal
- [ ] T15: PR ready, phone check, merge on her word

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation / fallback |
|---|---|---|---|
| The machine isn't fun on a phone | Medium | High | Checkpoint B on a rough version before any drawing; grid size, modes and the "light up" effect are cheap to change at that stage |
| Sentences read as nonsense, even with roles | Medium | High | Word list edited by the author at A; rows tested at B; roles can be tightened (e.g. verbs that suit their nouns) |
| Long period words don't fit a block at 4 columns on a 375px phone | High | Medium | Word length capped in T1 (about 10 letters), text sized to fit in T5; fallback 3 columns on small phones |
| The drawing takes too long | Medium | Medium | STARTUP.md fallback: ship the simpler look from T4, restyle later |
| Plates fight with page scrolling on a phone (drag vs scroll) | Medium | Medium | Drag starts only on the plate itself, with a small threshold; tap to enlarge stays the main way to read |
| iPhone Safari blocks or delays sound | High (known) | Low | Sound starts from the "With sound" tap; checked on the author's iPhone at E |
| No good CC0 sound for a clack or a rattle | Low | Low | Several candidates per sound; worst case, a short sound made in the browser (no file) |
| The page gets slow (island + fonts + images) | Medium | Medium | Island loads when visible; Howler on demand; no new typeface; measured in T13 (LCP < 2.5 s, INP < 200 ms) |
| Four tabs don't fit at 375 px | Medium | Low | Smaller spacing; last resort the tab reads "Original" |

## Open Questions

- Fun; the light-up effect: Checkpoint B.
- Folio look: Checkpoint C. (Typeface settled at Checkpoint A: Instrument Serif.)
- The edition's year and editor for The original: read from the Wikisource page in T11.
