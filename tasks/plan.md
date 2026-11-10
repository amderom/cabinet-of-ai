# Implementation Plan: Phase 1.2 part 1 — Images and engravings

> Spec: [SPEC.md](../SPEC.md). Tasks: [todo.md](./todo.md).
> Branch: `feature/phase-1-2-images`. Exploration branch for Step 5: `explore/reading-pages` (never merged). Replaces the Phase 1.1 plan (done and merged, kept in git history).

## Overview

The spec's five gated steps, turned into nine tasks. Research comes first, so nothing gets built on images we might not be allowed to use. Then the image system, proven on the real picks; then the essay illustrations; then the texture; then the reading-page exploration; and finally the chosen direction, checks and shipping. The author steps in at three checkpoints: picking the engravings, reviewing the illustrated essay, and picking a reading-page direction.

## Architecture Decisions

- **Images live with their exhibit** (`src/content/exhibits/<slug>/images/`) and are declared once in `exhibit.yaml → credits` with an `id`. Astro's content `image()` helper checks that each file exists and optimises it at build.
- **Placed by id everywhere:** `<Figure id="…" />` in MDX, `texture: <id>` in metadata, and the plates in Part 2. Alt text, caption and credit come from the metadata and are never retyped.
- **The licence rule is enforced by the build:** an image file without a credit, or a credit without a licence, stops the build with a clear message.
- **Originals are resized before committing** (longest side about 2400 px, with macOS's built-in `sips`), so the repository doesn't fill up with 20 MB scans. Astro then makes the phone and desktop sizes.
- **The texture is tinted with CSS only** (blend modes over the accent colour), so any engraving works without hand editing.
- **Exploration happens on its own branch**, with its own Vercel preview link. Nothing from it is merged; the chosen direction is rebuilt cleanly on the feature branch.
- Recorded in **ADR 005**.

## Dependency graph

```
T1 shortlist (research)  ──► Checkpoint A: author picks
        │
T2 image model + credits + build guard (uses the picks)
        │
T3 Figure + essay illustrations ──► Checkpoint B: author reviews captions / alt texts
        │
T4 Lagado texture
        │
T5 three reading-page directions (explore branch) ──► Checkpoint C: author picks
        │
T6 chosen direction in the shared layout
        │
T7 performance + full browser checks
T8 ADR 005, README, journal
T9 PR, preview, phone check, merge on her word
```

Everything is sequential: each step builds on the previous one, and the checkpoints are the author's decisions.

## Task List

### Part A: Engravings
- [x] T1: Engraving shortlist with licences

### Checkpoint A — the author picks the engravings

### Part B: Image system and essay
- [x] T2: Image model, credits helpers, build guard
- [x] T3: Figure component and essay illustrations

### Checkpoint B — the author reviews the illustrated essay

### Part C: Texture and reading pages
- [x] T4: Lagado neon engraving texture
- [x] T5: Three reading-page directions on the exploration branch

### Checkpoint C — the author picks a direction

- [x] T6: Chosen direction in the shared exhibit layout

### Part D: Ship
- [ ] T7: Performance and full browser checks
- [ ] T8: ADR 005, README, journal
- [ ] T9: PR, preview, phone check

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| No engraving of the Lagado frame itself has a clear licence | Med | Widen to other Laputa and Academy plates and to period engravings of machines, dice, spiders and bees. The essay doesn't need the frame itself; the frame matters most for Part 2 |
| A collection's licence is ambiguous (e.g. a Wikimedia file marked public domain in one country only) | Med | Only "public domain worldwide" or CC0 items, from artists who died long ago; otherwise the image is dropped |
| The texture's colour blending looks different in Safari on iPhone | Med | Checked on the author's phone at Checkpoint C and in the PR preview. Fallback: a plain, faint grey engraving without tint |
| Images slow the essay down on a phone | Med | Optimised sizes, lazy loading below the first screen, and a Lighthouse check (LCP < 2.5 s) in T7 |
| The three exploration directions take long to build | Med | Each direction is a variant of the same page (styles and small markup changes), not a separate site. Timeboxed; the motion direction can start with CSS only |
| The "Fluid" direction needs GSAP | Low | Asked first; loaded only on reading pages if approved |

## Open Questions

- Number of essay images (1–3): decided at Checkpoint A.
- GSAP: only if the author picks the "Fluid" direction and CSS isn't enough.
