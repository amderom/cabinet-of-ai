# ADR 007: Link-preview images designed as HTML, captured once, declared as credits

**Status:** Accepted
**Date:** 2026-11-13
**Decided by:** the operator (Phase 1.2 part 3 spec approval and Checkpoint A), on the agent's recommendations

## Context

ADR 004 split link previews in two: page text first (Phase 1.1), images once the machine and the site's look existed. LinkedIn shows a 1200 × 627 picture above the page title; on a phone it is a few centimetres wide. The operator wants one image per exhibit (not per part) and one for the site, designed with her, and no build-time image generation.

## Decision

- **Designed as a small HTML page** (`design/previews/previews.html`) in the site's own fonts and colours, **captured once** at 1200 × 627 with playwright-cli, and committed as a PNG. The HTML stays so an image can be remade (or a new exhibit's made) in the same layout. Three directions were compared (`lagado-options.html`, pictures in `design/previews/out/`); the operator chose the author's ink drawing of Swift on a cream plate, beside the exhibit title and its tagline.
- **Declared like every image (ADR 005):** the exhibit's preview is a credit in `exhibit.yaml` named by an optional `preview` field; every part of the exhibit (demo, essay, original, making-of) passes it to `BaseLayout`. The site's preview is `src/assets/site-preview.png`, its alt text in `src/lib/site.ts`, passed by the home page. The 404 page and sealed exhibits have none.
- **Checked at build:** `src/lib/preview.ts` refuses a preview with no file, no alt text or a size other than 1200 × 627; an unknown `preview` id fails the existing credits check.
- **Served as Astro gives it:** the original PNG, unchanged, at a hashed address under `/_astro/`. A new image gets a new address, so LinkedIn fetches it fresh instead of showing a cached one.
- **The author's drawing** is used in both images with her agreement (she chose this direction), credited to her, all rights reserved.

## Alternatives considered

- **The machine's own sentence in its glowing look**, and **Grandville's engraving on a plate**: shown at Checkpoint A, not chosen.
- **Images generated at build time** (e.g. Satori): a new dependency for two images, and harder to tune by eye.
- **Images in `public/`** with a fixed address: no credit check, and LinkedIn would keep a cached old image after a change.

## Consequences

- Each new exhibit needs one designed preview before it opens: copy its section in `previews.html`, capture, credit, name it in `preview`.
- The site image shows Lagado open and two sealed plates; redo it in Phase 1.3 if the cabinet gives a better picture.
- The site-level credits spot comes with the cabinet (Phase 1.3); until then the site image's credit lives in this ADR and in the code comment.
- After any change of image or domain, re-check the links in LinkedIn's Post Inspector.
