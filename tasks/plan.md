# Implementation Plan: Phase 1.3 — The cabinet, as the homepage

> Spec: [SPEC.md](../SPEC.md). Tasks: [todo.md](./todo.md).
> Branch: `feature/phase-1-3-cabinet`. Replaces the Phase 1.2 part 3 plan (done and merged, kept in git history).

## Overview

Design the cabinet with the author through a clickable prototype, then build it into the home page as plain links from the content collection with a small animation script, add sound and credits, check speed and behaviour, and ship. The end of this plan is the MVP.

## Architecture Decisions

- **Prototype first** (private Claude artifact with a direction switch), nothing built into the site before the author picks.
- **Links first, motion second:** Astro renders the cabinet and drawers as HTML links (works with JavaScript off); a small script opens the doors and pulls drawers. No React island (ADR 008, docs/project.md Domain map with her yes).
- **GSAP only if needed:** CSS transitions first; GSAP 3.15 (approved) only if the chosen sequence can't stay smooth without it.
- **Reuse:** drawers from the exhibits collection; sound from `src/sound/`; credits pattern from ADR 005; view transition title morph from Phase 0.

## Task List

### Phase 1: Direction (gated)
- [ ] T1: Clickable prototype, three directions → Checkpoint A

### Phase 2: Build (gated)
- [ ] T2: Drawers from content (pure, tested)
- [ ] T3: Cabinet on the home page, links first, then motion; open-for-the-visit memory → Checkpoint B

### Phase 3: Details (gated)
- [ ] T4: Sounds, credits spot, line under the cabinet; engraving if used → Checkpoint C

### Phase 4: Ship
- [ ] T5: Speed and browser checks, ADR 008, docs, journal
- [ ] T6: PR, phone check, merge on her word; MVP; reminder to delete STARTUP.md

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| The cabinet drifts vintage (twice before) | High | Every option judged against "2026 product launch"; no materials, no fake 3D |
| No direction convinces | Med | Three distinct options, mixes allowed, cheap prototype rounds |
| Opening lags on a mid-range phone | Med | Animate only transform/opacity; measure taps in a slowed trace; GSAP only if needed |
| Engraving licence unclear | Low | Verify on the source page; otherwise no engraving, or one already credited |
| Cabinet hides the way into Lagado without JavaScript | Med | Drawers are real links; JS-off check in the browser tests |
