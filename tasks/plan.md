# Implementation Plan: The Llull exhibit

> Spec: [SPEC.md](../SPEC.md) (approved 2026-11-13). Tasks: [todo.md](./todo.md). Journal: [docs/features/llull/journal.md](../docs/features/llull/journal.md).
> Branch: `feature/llull-exhibit`. Replaces the About-page plan (done and merged, kept in git history).

## Overview

Open Llull as the second exhibit: a machine that answers nine questions (six real, three start-up) by Llull's own procedure (letters → fourth-figure rings → column → chambers → verdict), three plates (the volvelle; her drawing with "The pitch to the Pope"; the spec sheet), her essay, a passage translated from the Latin, a making-of, the home card and texture (the volvelle), a preview image with her drawing, and small sounds. Built like Lagado: content validated first, rules tested apart from drawing, every look shown as a clickable prototype before it is built.

## Architecture decisions

- **Rules apart from drawing** (ADR 006). `src/demos/llull/art.ts` holds the alphabet, the 84 columns, the 20 chambers of a column in Llull's order, and how to read a chamber (letters before T as dignities, after T as relations). `questions.ts` holds the nine questions with their letters, column, reasons, verdict and source. Both are tested; a test ties `questions.ts` to the author-validated `questions.md`, word for word.
- **No typed questions, no AI at runtime.** The nine questions are data.
- **The plates: reuse Lagado's, by moving them into a shared component** (`src/components/plates/`), with each exhibit passing its own three plates (images, captions, opened texts). Demos may not import each other (docs/project.md → Dependency Rules), and copying 450 lines of plates would let the two drift apart. **This touches Lagado, so it is asked first (Task 6)**, and Lagado must look and behave exactly the same afterwards (checked with screenshots before and after). Fallback if she prefers not to touch Lagado: copy the plates into `src/demos/llull/`.
- **Images** prepared once as files, as for Lagado's plates: the volvelle as ink on a transparent ground (card, texture, plate I), her drawing as ink on a transparent ground (plate II, preview). sharp, already installed, does it; no new dependency.
- **Possible ADR at the end**, only if the machine introduces a lasting pattern (e.g. "questions as validated data", or the shared plates).

## Dependency graph

```
questions.md (validated content: Checkpoint A)
   ├── art.ts + questions.ts (rules, tests)
   │      └── machine prototype (Checkpoint B) ── Machine.tsx rough (Checkpoint C) ── final look
   ├── plate texts, sticker, banner
   │      └── shared plates (asked) ── Llull hero and demo page (Checkpoint D)
   └── Latin passage + translation ── original.mdx
images (volvelle ink, drawing ink) ── card + texture + plates + preview
essay.mdx (her text) ── figures
sounds (Checkpoint E) ── machine
everything ── making-of ── checks ── PR ── open on her word
```

## Task list (details in todo.md)

### Phase 1: Content first
- Task 1: The nine questions, written out (letters, column, reasons, verdict, source), in `docs/features/llull/questions.md`
- Task 2: Plate texts, sticker and banner lines, in the same document
- **Checkpoint A:** the author validates every word

### Phase 2: The machine
- Task 3: The rules (`art.ts`, `questions.ts`), tests first
- Task 4: Two or three looks for the machine, as a clickable prototype (private artifact)
- **Checkpoint B:** the author picks a look
- Task 5: The machine on the site, rough but playable, Llull still sealed (a preview-only route or a temporary flag; see Task 5)
- **Checkpoint C:** "is it fun?" on her phone, then the final look

### Phase 3: The page
- Task 6: Ask, then move the plates into a shared component (Lagado unchanged)
- Task 7: Llull's images prepared and credited (volvelle ink, drawing ink, essay engravings)
- Task 8: Llull's hero (sticker, title, three plates), banner, `year`, `card`, `texture`
- **Checkpoint D:** the demo page as a whole

### Phase 4: The reading parts
- Task 9: The essay page with its engravings
- Task 10: The original: a Latin passage chosen, translated together, credited
- Task 11: Sound: candidates on a private listening page, then the picks
- **Checkpoint E:** sounds chosen by ear

### Phase 5: Finish
- Task 12: The link-preview image (her drawing)
- Task 13: The making-of, from the journal
- Task 14: Speed, full browser sweep, README, ADR if needed
- Task 15: Draft PR (Llull still sealed); then `status: open` and merge on her word

## Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| The machine is a ritual you watch, not a toy you play | High | Prototype first (Checkpoint B), rough version on her phone (C) before polishing; every animation skippable by a tap |
| Llull's own reasons are too dense for a phone | Medium | One short line per chamber, 2–3 chambers per question, the full answer one tap away |
| Start-up verdicts read as mockery of Llull, or as Llull's own words | Medium | Labelled "Asked in 2026 · answered with Llull's definitions"; built only from his definitions and analogies; her wording |
| Moving the plates breaks Lagado | Medium | Asked first; screenshots of Lagado before and after at 375 and 1280px; plates-layout tests kept |
| Showing Llull on the preview while sealed | Medium | Sealed exhibits have no pages (ADR 002); Task 5 picks a way to preview without publishing (to decide then; asked) |
| The Lagado essay says Llull "cranked the same dream in 1305" | Low | Her text: flagged at Checkpoint A for her to keep or adjust |
| Dambergs' quotes | Low | Her decision (short, credited quotes); credit on every answer and in the credits block |

## Parallelization

One writer at a time on the machine and the page. Can run alongside: image preparation (Task 7), the Latin passage (Task 10), sound candidates (Task 11).

## Open questions

- Task 5: how the author sees a sealed exhibit on the PR preview (a temporary `status: open` on the branch only, never merged open without her word, is the simplest).
