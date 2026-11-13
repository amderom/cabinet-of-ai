# ADR 009: Credits per page, sources inside the credits

**Status:** Accepted (extends ADR 005)
**Date:** 2026-11-13
**Decided by:** the operator, on the agent's recommendation (Llull essay review)

## Context

Every page of an exhibit showed the same full credits list (ADR 005), so a demo page credited the essay's engravings and the essay page credited the plates. Llull's essay also ended with its own "Sources" list just above the credits block, which the operator found confusing: "everything should go in the credits".

## Decision

- Every credit in `exhibit.yaml` says which pages use it: `on: [demo, essay, original, making-of]` (required; the build stops without it). The texture appears on every page, so its credit is on all of them; the link-preview image too, since every page carries it.
- Each page's credits block (`Credits.astro`, `creditsFor` in `src/lib/credits.ts`, tested) lists only that page's credits.
- An essay's references are credits too, marked `cited: true` (no licence asked; optional `year`). They show under a small "Sources" label at the end of the credits block, as "author, linked title (year)". The essay text no longer carries its own sources section; a test checks that every source of the author's draft is credited.

## Alternatives considered

- **One full list on every page, sources added to it** (simplest, Lagado untouched): rejected, too long and mixing things not on the page.
- **Keep sources in the essay**: rejected by the operator (two lists one above the other).

## Consequences

- Lagado's pages now show shorter lists (its demo, essay, original and making-of each list what they use); nothing was removed from the site as a whole.
- Adding a credit = one more line (`on:`); forgetting it stops the build with a clear message.
