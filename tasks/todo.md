# Tasks: Phase 1.3 — The cabinet, as the homepage

> Plan: [plan.md](./plan.md). Spec: [SPEC.md](../SPEC.md).

## T1: Clickable prototype, three directions
- [ ] Line cabinet, monolith, engraving inside: each opens on tap and pulls a drawer; sealed drawers shake
- [ ] Works at 375px and on desktop; published as a private artifact; the author picks (Checkpoint A)
**Estimated scope:** S

## T2: Drawers from content
- [ ] `src/cabinet/drawers.ts`: one drawer per exhibit in order; only open ones linked; labels (unit-tested)
**Dependencies:** T1 · **Estimated scope:** S

## T3: Cabinet on the home page
- [ ] Chosen direction built in Astro + a small script; drawers are links; JS off → open; reduced motion → no movement
- [ ] Pull Lagado → `/exhibits/lagado/` with the title morph; back → already open (tab memory)
- [ ] The author checks it on her phone (Checkpoint B)
**Dependencies:** T2 · **Estimated scope:** M

## T4: Sounds, credits, details
- [ ] Open/pull sounds only with sound on (CC0, credited); site credits spot; line + LinkedIn under the cabinet; engraving if used
- [ ] The author approves (Checkpoint C)
**Dependencies:** T3 · **Estimated scope:** M

## T5: Checks and docs
- [ ] LCP < 2.5 s, CLS < 0.1, opening < 200 ms; Edge at 390/375/1280: no sideways scroll, no external requests, no console errors
- [ ] ADR 008; docs/project.md Domain map (with her yes); README; journal
**Dependencies:** T4 · **Estimated scope:** S

## T6: Ship and MVP
- [ ] PR preview checked on her phone; merge on her word; production checked
- [ ] MVP declared; ask before deleting STARTUP.md
**Dependencies:** T5 · **Estimated scope:** S
