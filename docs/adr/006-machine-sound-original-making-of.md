# ADR 006: The machine as an island with pure rules, on-demand sound, an optional original part, and one design scale

**Status:** Accepted
**Date:** 2026-11-11
**Decided by:** the operator (Phase 1.2 part 2 spec approval and checkpoints A–E), on the agent's recommendations

## Context

Phase 1.2 part 2 makes Lagado playable: a word machine visitors crank on a phone, a folio to keep lines, three plates, a parody banner, optional sound, Swift's own text, and a making-of. Visitors arrive from LinkedIn on phones; the site must stay fast, silent by default, and honest about every source. The look was settled with the operator through clickable prototypes ("vintage is content, never look": the past lives in words and engravings, every control is a 2026 product). Several pieces will be reused by the next exhibits (sound, the original part, the making-of format, the type and spacing scale).

## Decision

- **Rules apart from drawing.** The machine's rules are plain TypeScript with seedable randomness and tests (`src/demos/lagado/engine.ts`, `folio.ts`, `words.ts`): turn a row or a place, shake, pick, read the sentence, spot a good combination; the folio keeps, edits, deletes and shares lines and survives refused storage. `Machine.tsx` is a React island (`client:visible`) that only draws and reacts. A test ties the word list to the operator-validated `machine-content.md`.
- **Sound as a separate module** (`src/sound/`, imports nothing else from the app): a preference (unset / on / off) kept on the device, never in a cookie; one small "Sound" toggle placed where the play is (right of the demo's play heading), none on reading pages, since sounds only answer the visitor's gestures; Howler 2.2.4 is downloaded with a dynamic import only once sound is on. Exhibits register their sounds (`registerSounds`) and call `play`.
- **Sounds and texts credited like images.** A credit may name a `sound`; the build stops on a file in `src/demos/<slug>/sounds/` that no credit declares (same guard as images, ADR 005). Lagado's three sounds are CC0 (Kenney, I.fekry), trimmed, softened and levelled together, served as AAC with a WAV fallback.
- **An optional fourth part, "The original"**: an `originals` collection (`original.mdx`: title, description, lead, and the id of the text's credit), a page at `/exhibits/<slug>/original/`, and a tab between Essay and Making-of, only for exhibits whose source is in the public domain (`withOriginal`, `exhibitTabs`, tested). A test keeps Lagado's passage word for word identical to the saved Wikisource copy.
- **The making-of as made-up scenes.** Shared components (`src/components/making-of/`: `Scene`, `Line`, `Point`) tell a making-of as short scripted exchanges that each make one point, with commentary; on desktop the commentary sits in the margin ("margin notes", like the essay's annotations). Lagado adds a numbers piece and a rejection pile of its own.
- **One type and spacing scale for every exhibit page** (`:root` in `global.css`): type 10 / 15 / 18 / 24 / 40px (labels, small, reading, quotes, section titles), spacing 20 / 44 / 80px (paragraphs, around objects, between sections) plus a block step (104px on a phone, 144px on desktop) between big standalone blocks. Page titles and the objects' own type (the machine's words, the plate captions) stay with their components.
- **Speed on phones.** The engraving texture is preloaded with high priority (it is the largest element on the first screen); the plates' pictures are served small (AVIF, 440px) and their large versions load only when a plate is opened.

## Alternatives considered

- **A canvas or game engine for the machine.** Heavier and harder to make accessible; plain buttons with a single background canvas for lines and the thread are enough.
- **Howler bundled with the page.** Every silent visitor would download it; the dynamic import keeps them at zero.
- **A sound control in every header, or pinned to the screen.** Built and rejected by the operator (annoying, and on pages that never make a sound).
- **Engraved, wooden or 3D machine looks, and a period typeface.** Built and rejected ("the vintage is the content, not the look").
- **The original text pasted into the essay.** It would blur whose words are whose; a separate, credited page keeps Swift's text intact.
- **Per-page spacing and sizes.** They had drifted (section gaps from 56 to 128px, five sizes of small text); one scale keeps the design system cohesive.

## Consequences

- A new exhibit gets sound by adding credited files and a `registerSounds` call; silent visitors pay nothing.
- A new exhibit gets "The original" by adding `original.mdx` and a text credit; Hesse (in copyright) never will.
- The making-of components and the scale apply to the next exhibits as they are.
- Known cost: on a slowed phone profile, the site-wide drifting glow, fixed behind the machine, makes a crank take about 250–380ms to show (157ms when the glow scrolls away with the top of the page); left as designed pending the operator's choice.
