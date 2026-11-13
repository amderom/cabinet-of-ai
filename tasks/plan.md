# Implementation Plan: Phase 1.2 part 3 — LinkedIn preview images

> Spec: [SPEC.md](../SPEC.md). Tasks: [todo.md](./todo.md).
> Branch: `feature/phase-1-2-previews`. Replaces the Phase 1.2 part 2 plan (done and merged, kept in git history).

## Overview

Design one preview image for Lagado and one for the site with the author, then wire them into the pages LinkedIn reads, and check the cards in LinkedIn's Post Inspector once live. Mostly design; the wiring is small because `BaseLayout` already writes the image tags when given an image.

## Architecture Decisions

- **Images designed as HTML, captured as pictures** with playwright-cli at 1200 × 627 using the site's fonts and colours; the picture is committed, the HTML kept in `design/previews/`. No build-time generation, no new dependency (ADR 004).
- **Declared like every image** (ADR 005): a credit in `exhibit.yaml`, named by a new optional `preview` field; the site image in `src/lib/site.ts`.
- **Checked at build:** a pure helper (`src/lib/preview.ts`) refuses an uncredited or wrongly sized preview.
- **Served as Astro gives it**: the original PNG, unchanged, at a hashed `/_astro/` address (decided in T3; a new image gets a new address, so LinkedIn fetches it fresh). See ADR 007.

## Task List

### Phase 1: Design (gated by the author)
- [x] T1: Three directions as real images on a phone-sized mock card
- [x] T2: Final Lagado and site images in the chosen direction

### Checkpoint A/B: the author picks a direction (after T1) and approves the finals (after T2)

### Phase 2: Wiring
- [x] T3: `preview` field, build check, tags on Lagado pages and home
- [x] T4: ADR 007, README, journals

### Checkpoint: tests, check and build pass; tags present in the built pages

### Phase 3: Ship
- [x] T5: PR, phone check, merge on her word, Post Inspector on production

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| No direction convinces (as with the first mockups) | Med | Three distinct directions with real content; mix allowed; quick iterations on HTML |
| LinkedIn caches an old text-only card | Med | Post Inspector forces a fresh fetch; no Lagado post before it shows the image |
| Astro re-encodes or hashes the image unexpectedly | Low | Check the built tags and fetch the image URL on the local build and the preview |
| Text unreadable at thumbnail size | Med | Every option judged at phone card size, not full size |

## Open Questions

- Direction (Checkpoint A); Swift drawing only with the author's yes.
- Post Inspector: author signs in in the browser pane, or runs it herself from a list.
