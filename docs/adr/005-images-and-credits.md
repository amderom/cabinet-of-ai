# ADR 005: Images declared once by id, credits enforced by the build, CSS-tinted texture

**Status:** Accepted
**Date:** 2026-11-10
**Decided by:** the operator (Phase 1.2 part 1 spec approval and checkpoints), on the agent's recommendation

## Context

Engravings are the site's common thread (docs/project.md → Design references). They appear in several roles: illustrations inside essays, a neon background texture per exhibit, a hero image on each exhibit's landing page (from Part 2), and later the plates and preview images. Every asset must carry its source, author and licence (AGENTS.md → Assets and credits). Visitors are mostly on phones, so images must stay light. The operator's own artwork may now be used when she provides it for a specific use (first case: her ink drawing of Swift as the Lagado hero).

## Decision

- **One place per image.** Each exhibit's images live in `src/content/exhibits/<slug>/images/` and are declared once in `exhibit.yaml → credits`: `id`, `file` (validated and optimised by Astro's `image()`), optional `phoneFile` (a tighter crop for small screens), `alt`, optional `caption`, `asset`, `author`, `source`, `url`, `licence`.
- **Placed by id everywhere:** `<Figure id="…" />` in MDX, `texture: <id>` and `hero: <id>` in the exhibit metadata (plates in Part 2 will follow). Alt text and credit come from the metadata; nothing is retyped.
- **The build enforces the licence rule** (`src/lib/credits.ts`, `checkExhibitAssets` in `src/lib/exhibit-pages.ts`): it stops on an image file without a credit, an empty licence, a duplicate id, an unknown `texture`/`hero`/`<Figure>` id, or an image credit without alt text. The files are listed through Astro's bundler (`import.meta.glob`), so no Node type package is needed.
- **Credits line under every figure** (author · source) and the full list in the exhibit's credits block. Gallica images carry "Source gallica.bnf.fr / BnF" as its terms require.
- **Texture tinted with CSS only:** the engraving is inverted, multiplied by the accent colour and screen-blended onto the page, so any black-on-white engraving becomes neon lines without hand editing. Served as a small AVIF (480px) since it is faint and blended. On desktop the glow is centred on it.
- **Reading pages: "annotated copy"** (direction C, chosen from three built on a throwaway branch): engravings and pulled quotes as annotations beside the text on a phone and in the right margin on desktop, orange marginalia, soft reveal on scroll via a small IntersectionObserver script; scroll-linked extras only where scroll timelines exist.
- **Exploration on throwaway branches.** Design directions are compared as real pages on their own preview link, then the chosen one is rebuilt cleanly; the exploration branch is deleted, never merged.

## Alternatives considered

- **Images referenced by path in each MDX file.** Credits and alt text would be retyped and drift; no central check.
- **Captions under every image.** Built, then removed at the operator's request: the credit line alone keeps the plates quiet.
- **Pre-tinted texture images edited by hand.** One more manual step per exhibit and per accent change.
- **Scroll animation with GSAP.** Not needed: CSS and a 20-line script cover it. Note: the CSS minifier folds `animation-timeline` into the `animation` shorthand, which browsers reject; the timeline must sit in a separate rule.
- **Only public-domain/CC0 sources.** Still the rule, with one recorded exception: two Grandville 1838 plates from Gallica (free for non-commercial reuse with attribution). If the site ever earns money, they must be licensed from the BnF or replaced by the same plates from the Internet Archive copy (see `docs/features/lagado/engravings.md`).

## Consequences

- Adding an image = dropping the file in `images/` and one credit entry; forgetting the credit breaks the build with a clear message.
- The hero's credit appears in the credits block before the hero is displayed (Part 2).
- The italic fonts are no longer preloaded (speed on phones); they arrive a moment later, causing a small layout shift (CLS 0.07, within the 0.1 target).
