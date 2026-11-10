# ADR 003: Typefaces — Instrument Serif, Inter Tight, IBM Plex Mono, self-hosted via Astro's Fonts API

**Status:** Accepted
**Date:** 2026-11-10
**Decided by:** the operator, after reviewing mockups

## Context

The visual direction ("Curio", see `docs/project.md` → Design references) pairs vintage content with an unmistakably 2026 look: near-black, a glow in the exhibit's colour, giant display serif, tiny mono labels. The Project compass and boundaries forbid third-party font or CDN calls at runtime (no tracking, no cookies). Visitors are mostly on phones, so font weight matters.

## Decision

Three open-licence (SIL OFL) typefaces:

- **Instrument Serif** (400, normal + italic): display — titles, exhibit names, the banner. Used very large.
- **Inter Tight** (variable 100–900): reading text, essays, buttons, interface.
- **IBM Plex Mono** (400): tiny uppercase labels only (the `label` utility, 10px).

They are declared in `astro.config.mjs` with Astro's built-in **Fonts API** (`fontProviders.fontsource()`): files are downloaded at build time and served from the site itself (`/_astro/fonts`); the two main faces are preloaded. A vintage inscription face for objects arrives with the Lagado demo, loaded only there.

## Alternatives considered

- **Geist + Newsreader** (first T2 attempt): clean, but the operator found the result "very classical… a bit web 2.0". Rejected with that direction.
- **Two typefaces only** (the operator first preferred fewer fonts): the mono is kept because the tiny labels are a signature of the Curio look; it is small (one weight) and not preloaded.
- **Hand-copied woff2 files in `public/`** (the first spec): same privacy outcome, but manual upkeep. The Fonts API does it at build time.
- **Google Fonts / a font CDN at runtime:** forbidden by the project's no-third-party-calls rule.

## Consequences

- No request leaves the site for fonts (verified in the browser network log at Checkpoint B).
- The build needs network access to Fontsource to fetch the files (it does on Vercel).
- Changing a typeface is a config change plus an update here.
