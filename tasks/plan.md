# Implementation Plan: Phase 1.1 — The exhibit page, with Lagado's text

> Spec: [SPEC.md](../SPEC.md). Tasks: [todo.md](./todo.md).
> Branch: `feature/phase-1-1-exhibit-page`. Replaces the Phase 0 plan (done and merged, kept in git history).

## Overview

Turn the Phase 0 placeholder exhibit pages into the real, shared exhibit frame, and fill the Lagado essay with the author's text. In order: the content data first, then the essay page as the first visible result (so the author can review her text early), then the parts every exhibit shares (calls to action, credits, play-first link), then the hidden page information for LinkedIn, then the demo teaser and making-of note, then docs and the PR.

## Architecture Decisions

- **Research reference lives in the exhibit's metadata** (`research` field), so every part of any exhibit can link to its article without repeating it. Its schema sits in `src/lib/research.ts` so it can be unit-tested, and `content.config.ts` imports it.
- **One place for site-wide facts** (`src/lib/site.ts`): site name and LinkedIn URL.
- **Page information is built in `BaseLayout`** from props (title, description, type, optional image). Pages pass their own values; `seo.ts` holds the pure helpers (absolute URL, page title). `og:image` is only written when an image is passed, so the Phase 1.2 images plug in without rework.
- **No React, no new dependency.** Everything in this phase is static Astro.
- Recorded in **ADR 004** (research reference + link-preview approach).

## Dependency graph

```
T1 content data (research, descriptions, site settings)
 ├── T2 essay page (note, button, byline, essay text)
 ├── T3 shared exhibit frame (calls to action, credits, play-first link)
 └── T4 page information (title, description, Open Graph, canonical, font preload)
T5 demo teaser + making-of note   (needs T3 frame)
T6 docs (ADR 004, README, journal) (after T1–T5)
T7 PR, Vercel preview, phone check (after everything)
T8 after merge: Post Inspector on production
```

T2, T3 and T4 are independent of each other once T1 is done, but they all touch the exhibit layout or pages, so they run one after another (no parallel sessions).

## Task List

### Part A: Content and the essay
- [x] T1: Content data — research reference, descriptions, site settings
- [x] T2: Lagado essay page — note, "Read the full article" button, byline, essay text

### Checkpoint A (author review)
- [ ] Tests, check and build pass
- [ ] Phone screenshots of the essay sent to the author: she checks her text and the typography fixes

### Part B: The shared frame
- [x] T3: Shared exhibit frame — calls to action, credits, play-first link, footer
- [x] T4: Page information for LinkedIn — title, description, Open Graph, canonical; mono font preload
- [x] T5: Lagado demo teaser and making-of note

### Checkpoint B
- [ ] All browser checks from the spec pass at 390×844, 375×667 and 1280×800

### Part C: Ship
- [x] T6: ADR 004, README, journal
- [ ] T7: Draft PR, Vercel preview, author's phone check

### Checkpoint C (before merge)
- [ ] Author approves on her phone; merge on her word
- [ ] T8: after merge, Post Inspector on the production essay URL

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| The note and the "Read the full article" button don't fit above the fold on a phone: the giant exhibit title, tagline and tabs already take most of the screen, and LinkedIn's in-app browser shows less than a normal browser | High (it's the author's explicit request) | Measure in T2 at 390×844 and 375×667. If it doesn't fit, use a smaller exhibit header on the essay and making-of pages (the giant title stays on the demo page). Shown to the author at Checkpoint A |
| Astro 7's default Markdown engine (Sätteri) handles some typography or MDX detail differently | Low | Check the rendered essay in T2; fallback documented in docs/project.md (classic remark engine) |
| LinkedIn shows an outdated card if the essay link is pasted before it's final | Low (no posts before 1.2) | Post Inspector forces a fresh read |
| The author's name and LinkedIn URL are hard-coded in several places | Low | Stored once in `src/lib/site.ts` |

## Open Questions

None for this phase. (The 36 vs 40 students question belongs to Phase 1.2.)
