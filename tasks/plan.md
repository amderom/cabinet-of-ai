# Implementation Plan: Phase 0 — Technical foundations

> Spec: [SPEC.md](../SPEC.md) (approved 2026-11-10). Tasks: [todo.md](./todo.md).
> Branch: `feature/phase-0-foundations`. Plan and tasks can be deleted before merge.

## Overview

Scaffold the static Astro site, put the design foundations in place (Curio: tokens, glow + grain, neon accents, Instrument Serif + Inter Tight + IBM Plex Mono, dark only), model exhibits as content, generate the home page and Lagado's three placeholder pages from that content, link them with page transitions, then deploy to Vercel with a preview link per PR.

## Dependency graph

```
T1 Scaffold (Astro, React, MDX, Vitest, astro check)
 ├── T2 Design foundations (Tailwind 4, tokens, fonts, BaseLayout)
 └── T3 Content model (collections, 3 entries, helpers + tests)
        └── T4 Home page  ← also needs T2
               └── T5 Lagado demo page + exhibit layout/nav
                      └── T6 Essay + making-of pages, missing-part guard
                             └── T7 Page transitions + 404
                                    └── T8 Docs (ADRs, journal, README)
                                           └── T9 PR + Vercel + phone check
```

T2 and T3 are independent once T1 is done, but they're small and share `package.json`, so they run one after the other in this session.

## Architecture decisions (from the spec)

- Three content collections keyed by folder slug: `exhibits` (YAML), `essays` and `makingOfs` (MDX). Pages exist only for `open` exhibits. → ADR 002.
- Tailwind 4 `@theme` tokens. The exhibit accent is a CSS variable overridden on the exhibit layout root.
- Instrument Serif + Inter Tight + IBM Plex Mono self-hosted via Astro's Fonts API (Fontsource provider, downloaded at build). → ADR 003.
- `<ClientRouter />` in the base layout. The exhibit title carries `transition:name`.
- Astro 7 (not 6): approved 2026-11-10 → ADR 001.
- Exact Astro 7 / Tailwind 4 syntax (content loaders, `@theme`, fonts) is checked against current docs via Context7 before writing, not from memory.

## Task list

See [todo.md](./todo.md) for acceptance criteria and verification per task.

### Phase A: Foundation
- [x] T1: Scaffold Astro 7 project
- [x] T2: Design foundations
- [x] T3: Exhibit content model

### Checkpoint A
- [ ] `npm run test`, `npm run check`, `npm run build` all pass
- [ ] Short report to the operator (what's in place, anything surprising, e.g. Node 26)

### Phase B: Pages
- [x] T4: Home page from the collection
- [x] T5: Lagado demo page, exhibit layout and nav
- [x] T6: Essay and making-of pages
- [x] T7: Page transitions and 404

### Checkpoint B
- [ ] Full playwright-cli run on a phone viewport (spec checks 1–5), then desktop
- [ ] Operator sees screenshots before deployment

### Phase C: Ship
- [ ] T8: ADRs, journal, README
- [ ] T9: Draft PR, Vercel connection, preview checks

### Checkpoint C (Phase 0 done)
- [ ] All spec success criteria met
- [ ] Operator has opened the preview on her phone
- [ ] Merge only on the operator's go-ahead; production URL written into `docs/project.md`

## Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| ~~Astro not happy on Node 26~~ | — | Resolved in T1: Astro 7 runs on Node 26. |
| Sätteri (Astro 7's new Markdown engine) mishandles essay features such as footnotes | Medium | Placeholder essay in T3 includes a footnote. Fallback: classic remark engine via `@astrojs/markdown-remark`. |
| Astro 7 / Tailwind 4 syntax differs from what agents remember | Medium | Docs check (Context7 or docs.astro.build) before each config file. `npm run check` + build after each task. |
| Vercel build uses a different Node than local | Medium | `engines.node >=22.23.4`. Check the first Vercel build log. |
| Build depends on Fontsource being reachable | Low | Only at build time, never for visitors. If it fails, switch to the local-files provider. |
| Vercel preview URLs are login-protected | Low | Expected: the operator is logged in on her phone. LinkedIn previews are a Phase 1.1 concern, on production. |
| "No full reload" hard to prove | Low | `window` marker survives navigation in playwright-cli. |

## Open questions

None. All spec questions were resolved by the operator on 2026-11-10.
