# ADR 001: Start on Astro 7 instead of Astro 6

**Status:** Accepted
**Date:** 2026-11-10
**Decided by:** the operator, on the agent's recommendation

## Context

`docs/project.md` listed Astro 6.3.x, "validated with Context7" on 2026-11-09. During Phase 0 / T1 the install showed that this validation was stale:

- Astro 7.0.0 was released on 2026-06-22; the current release is 7.4.8 (2026-11-09).
- Astro 6's last release is 6.4.8 (2026-06-17). No release since.
- The current official integrations require Astro 7 (`@astrojs/mdx@8` peers `astro ^7.2.10`). Astro 6 would need older, frozen integrations (`@astrojs/mdx@6`).
- No code had been written yet, so there was nothing to migrate.

The project's version policy forbids libraries released less than 6 months ago without explicit approval. Astro 7 was 4.5 months old.

## Decision

Start the project on **Astro 7.4.x** with `@astrojs/react@7`, `@astrojs/mdx@8`, `vitest@5`, `@astrojs/check`, `typescript@5`. This is an explicit, approved exception to the 6-month rule. `engines.node` is `>=22.23.4` (Astro 7's minimum); development runs on Node 26.

## Alternatives considered

**Stay on Astro 6.4.8.** Matches the original docs and the 6-month rule. Rejected: the project is long-lived, and Astro 6 receives no updates; a migration to 7 would be forced within months, costlier with every exhibit built.

## Consequences

Checked against the official Astro 7 upgrade guide (docs.astro.build/en/guides/upgrade-to/v7/):

- **Markdown/MDX engine:** Sätteri replaces remark/rehype by default. Risk for scholarly essays (e.g. footnotes); tested in T3. Fallback: `@astrojs/markdown-remark` (classic engine) via config.
- **Stricter HTML:** the new compiler errors on unclosed tags and invalid nesting. Good for quality.
- **`compressHTML: 'jsx'` by default:** whitespace between inline elements can disappear; use `{" "}` where needed.
- **View transitions:** `<ClientRouter />` and `transition:persist` unchanged; only some low-level helpers were removed (not used).
- **Vite 8:** Tailwind's Vite plugin (`^8` supported), Vitest 5 and `@astrojs/check` are all compatible.
- **Agent knowledge:** most AI agents and Context7's indexed docs cover Astro 6 better than 7. Agents must check docs.astro.build for Astro 7 specifics rather than rely on memory.
- **Dev server:** `astro dev` runs as a background process when started non-interactively (agents); stop it with `npx astro dev stop`.
