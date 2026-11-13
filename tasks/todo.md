# Tasks: Phase 1.3 — The cabinet, as the homepage

> Plan: [plan.md](./plan.md). Spec: [SPEC.md](../SPEC.md).

## T1: Clickable prototype ✅
- [x] Round 1 (line, monolith, engraving inside) rejected; round 2 (specimens, timeline, signal) published
- [x] The author picks: Specimens (Checkpoint A)
**Estimated scope:** S

## T2: Specimens from content ✅
- [x] `src/cabinet/specimens.ts`: one plate per exhibit in order; only open ones linked; labels; places in the case for 1–6 plates (unit-tested)
**Dependencies:** T1 · **Estimated scope:** S

## T3: The vitrine on the home page ✅
- [x] Built in Astro + a small script; plates are links; JS off → Lagado still a link; reduced motion → no movement
- [x] Choose → forward + glow in its colour; enter → `/exhibits/lagado/` with the title morph; sealed → no navigation
- [ ] The author checks it on her phone (Checkpoint B)
**Dependencies:** T2 · **Estimated scope:** M

## T4: Sounds, credits, details ✅
- [x] Open/pull sounds only with sound on (CC0, credited); site credits spot; line + LinkedIn under the cabinet; engraving if used
- [x] The author approves (Checkpoint C)
**Dependencies:** T3 · **Estimated scope:** M

## T5: Checks and docs
- [x] LCP < 2.5 s, CLS < 0.1, opening < 200 ms; Edge at 390/375/1280: no sideways scroll, no external requests, no console errors
- [ ] ADR 008; docs/project.md Domain map (with her yes); README; journal
**Dependencies:** T4 · **Estimated scope:** S

## T6: Ship and MVP
- [ ] PR preview checked on her phone; merge on her word; production checked
- [ ] MVP declared; ask before deleting STARTUP.md
**Dependencies:** T5 · **Estimated scope:** S
