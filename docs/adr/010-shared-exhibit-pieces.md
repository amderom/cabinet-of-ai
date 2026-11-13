# ADR 010: Pieces shared between exhibits live in components; exhibit-specific copies stay in demos

**Status:** Accepted
**Date:** 2026-11-13
**Decided by:** the operator (Llull exhibit, Task 6), on the agent's recommendation

## Context

Llull is the second exhibit and reuses several of Lagado's pieces: the three draggable plates under the title, the making-of's numbers, the sound toggle, the original-text page. Demos may not import each other (docs/project.md → Dependency Rules). Moving a piece out of Lagado touches a live page; copying it lets two versions drift apart.

## Decision

- **Shared when the piece is the same and its content differs:** the plates moved to `src/components/plates/` (component, CSS, layout rules and their tests). Each exhibit's `Hero.astro` passes its own plates as data: the face (kind, numeral, caption, a picture or a small table) and the opened plate as ordered blocks (image, title with pill, quote, note, specs, timeline; short texts may use *italics*). The pill colour is a CSS variable per exhibit. Asked first; Lagado checked pixel-identical before and after at 375 and 1280px.
- **The original page** takes one or several source credits (`credit: id` or `credit: [id, id]`).
- **Copied when the piece is small and its content is code:** the making-of's numbers (`src/demos/<slug>/making-of/Numbers.astro`) carry their figures inline; Llull has its own copy. Interludes are per exhibit (Lagado's rejection pile, Llull's paper trail).

## Alternatives considered

- **Copy the plates into each demo:** no risk to Lagado, but about 450 lines twice, and fixes made twice. Offered; the operator chose sharing.
- **Share the numbers too:** possible later; not worth touching Lagado's making-of for one exhibit.

## Consequences

- A new exhibit gets plates by writing a `Hero.astro` with its data; a change to the plates' look reaches every exhibit, so check each exhibit's hero after one.
- If a third exhibit needs the numbers, move them to `src/components/making-of/` with the stats as a prop.
