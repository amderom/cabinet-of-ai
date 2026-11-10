# ADR 004: Research reference in exhibit metadata; link previews in two steps

**Status:** Accepted
**Date:** 2026-11-10
**Decided by:** the operator (Phase 1.1 spec approval), on the agent's recommendation

## Context

Each exhibit's essay is a short, playful take on a published, peer-reviewed article. The article belongs to its journal (for Lagado: *XVII-XVIII*, no. 77, 2020, in French, CC BY-NC-ND 4.0) and must not be reproduced; the site links to it instead, prominently, from every part of the exhibit. Visitors arrive from LinkedIn, which builds its link card from hidden page information (Open Graph tags). The operator wants preview images designed once the machine and the site's look exist, not before.

## Decision

- **Research reference in the exhibit metadata:** an optional `research` object in `exhibit.yaml` (title, journal, issue?, year, url, doi?, language). Its Zod schema lives in `src/lib/research.ts` (unit-tested) and is imported by `content.config.ts`. When present, every part shows "Read the full article ↗" and the essay page shows an "About this essay" note with the link under the title. When absent, the links are hidden.
- **Site-wide facts in one place:** `src/lib/site.ts` (site name, author name, LinkedIn URL).
- **Essays and making-ofs require a `description`**, used for the page description and `og:description`.
- **Link previews in two steps:**
  1. Phase 1.1: every page outputs `<title>`, description, canonical URL and Open Graph tags (`og:site_name`, `og:type`, `og:title`, `og:description`, `og:url`), with absolute URLs from Astro's `site` setting. Page titles name the part ("Title · Essay · Cabinet of AI") because that is the line LinkedIn writes under the image.
  2. End of Phase 1.2: preview images, **one per exhibit** (not per part) plus one for the site, designed with the operator. `BaseLayout` already accepts an optional `image`; image tags (`og:image`, size, alt, `twitter:card`) are written only when one is passed.
- The 404 page has no canonical URL or `og:url` (it has no fixed address of its own).

## Alternatives considered

- **Reproducing the article (or long extracts) on the site.** Rejected: the article belongs to the journal; the operator wrote a light essay instead.
- **Research link written by hand in each essay.** Would repeat the reference and drift; metadata lets every part reuse it.
- **One preview image per part (demo, essay, making-of), designed now.** Rejected by the operator: too many images, and the first mockups (exhibit name + glow on near-black) didn't work. LinkedIn's text line already says which part the link goes to.
- **Images generated automatically at build time.** Would need a new dependency for a handful of images.

## Consequences

- Until Phase 1.2, LinkedIn shows text-only cards for the site's links. No posts are planned before then.
- Changing the site's address (custom domain) means changing `site` in `astro.config.mjs` and re-checking links in LinkedIn's Post Inspector.
- Future exhibits get the research link and page information for free by filling `research` and `description`.
