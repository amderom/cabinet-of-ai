# Spec: Phase 1.2 part 3 — LinkedIn link previews, part 2 (preview images)

> Source: [STARTUP.md → Phase 1.2, Part 3](./STARTUP.md#phase-12--the-lagado-machine) and [ADR 004](./docs/adr/004-research-and-link-previews.md) (link previews in two steps).
> Decision filter: [docs/project.md → Project compass](./docs/project.md#project-compass) ("Play first, read second", "Old ideas, 2026 craft", "Every part is shareable").
> Branch: `feature/phase-1-2-previews`. Replaces the Phase 1.2 part 2 spec (kept in git history).

## Objective

When the author posts a Cabinet of AI link on LinkedIn (or anyone shares one in a message), the card shows **an image that makes people want to tap**, instead of a text-only card. This is the last step before the first Lagado post.

**Users:** LinkedIn readers scrolling a feed, mostly on phones: the image is a thumbnail a few centimetres wide, seen for about a second. The author designs it with the agent and approves it.

**What exists already (Phase 1.1):** every page has its title, description and address for LinkedIn. `BaseLayout` already accepts an optional `image` and writes the image tags (`og:image`, its size and alt text, `twitter:card`) only when one is passed. So this part is mostly **design**, with a small amount of wiring.

**What's being made:**
- **One image for Lagado**, shared by its four parts (demo, essay, original, making-of). LinkedIn's text line under the image already says which part the link goes to (ADR 004).
- **One image for the site**, used by the home page.
- Sealed exhibits (Llull, Hesse) get none: they have no pages.

**Scope check:** one capability (preview images), one review loop. One spec, no capability map.

## The image (design brief)

- **Size:** 1200 × 627 px (LinkedIn's recommended size), PNG or JPG, under 1 MB. The important things stay in the middle: LinkedIn and messaging apps crop the edges differently, and on a phone the card is small.
- **Readable as a thumbnail:** at most a few words, large. Nothing that only works at full size.
- **The site's 2026 look** (Project compass, principle 2): near-black background and the exhibit's accent colour. The old world shows up through its content (a real engraving, Swift's words, the machine's sentences), never through a pastiche "old" design.
- **Not again:** the first mockups ("exhibit name + glow on near-black") didn't work (ADR 004). Each direction below carries a real object, not just a title.

**Directions to compare (Checkpoint A), shown as real 1200 × 627 images, on a phone-sized mock LinkedIn card:**

1. **The machine speaks** (Play first). The Signal machine look (line field, glowing thread) with one of its own absurd sentences picked large in the accent colour, e.g. *Doleful Comets monetize Celestial Musick softly*, and "The Lagado Engine" small. Made entirely from the site's own material, so no licence questions. *Recommended.*
2. **The engraving.** Grandville's word machine (1838), large, with a short line in the site's type. Instantly reads as "a historical object". Public domain with Gallica's non-commercial reuse terms, which fit a portfolio but should be named.
3. **Swift.** The author's ink drawing of Swift with the exhibit's title. Strongest personality, but the drawing was given for the Lagado hero only, so it's used here only if the author says yes (AGENTS.md).

The site image follows the chosen direction for Lagado, with the site's name and a one-line tagline. The home page will become the cabinet in Phase 1.3; the site image is **redone then** if the cabinet gives a better picture (a note goes into Phase 1.3's spec, not this one).

## How the images are made

- **Designed as a small HTML page and turned into a picture** with the project's browser tool (playwright-cli), using the site's own fonts and colours. The finished picture is committed; nothing is generated when the site is built, and **no new dependency** (as ADR 004 decided).
- The design source is kept in `design/previews/` so an image can be remade later (e.g. for Llull) with the same layout.
- **Every image is credited** like the rest of the site (ADR 005): declared in `exhibit.yaml → credits` (author: the author, or the engraving's source if one is used), and named in the exhibit's `preview` field. The site image is declared in `src/lib/site.ts`.

## Wiring

- `exhibit.yaml` gets an optional `preview: <credit id>`. The exhibit layout passes it to `BaseLayout` on all four parts. The build stops if `preview` names an image that isn't credited, or that isn't 1200 × 627.
- The home page passes the site image. The 404 page passes none (it has no address of its own).
- The image is served at a stable address on the site (absolute URL from Astro's `site` setting), so LinkedIn can fetch it.

## Tech Stack

See [docs/project.md → Tech Stack](./docs/project.md#tech-stack). Nothing new.

## Commands

```
Dev:       npm run dev          # http://localhost:4321
Build:     npm run build
Preview:   npm run preview
Test:      npm run test
Check:     npm run check
```

## Project Structure

Expected changes:

```
design/previews/                      HTML design sources + the options shown at Checkpoint A
src/content/exhibits/lagado/images/   the Lagado preview image
src/content/exhibits/lagado/exhibit.yaml  preview credit + `preview` field
src/content.config.ts                 optional `preview` field
src/lib/preview.ts (+ test)           pure check: credited, right size; builds the `image` prop
src/lib/site.ts                       site preview image
src/layouts/ExhibitLayout.astro       passes the preview on every part
src/pages/index.astro                 passes the site preview
docs/adr/007-…md                      how preview images are made and declared
```

## Code Style

As before: TypeScript strict, pure logic apart from Astro components, Vitest tests.

```ts
// src/lib/preview.ts
export const PREVIEW_SIZE = { width: 1200, height: 627 } as const;

/** Returns the image tags' data for an exhibit, or throws a build error naming the fix. */
export function previewFor(slug: string, previewId: string | undefined, credits: Credit[]): PreviewImage | undefined
```

## Testing Strategy

- **Unit (Vitest):** `preview.ts`: no `preview` → no image; an unknown id or an uncredited image → a build error naming the exhibit and the id; wrong size → a build error.
- **Build output:** every Lagado page and the home page contain `og:image` (absolute URL), its width, height and alt text, and `twitter:card`; the 404 and sealed exhibits have no image tags.
- **Browser (playwright-cli, 390×844):** the image opens at its address on the local build and on the PR preview; it looks right on a mock LinkedIn card at phone width.
- **On production (after merge):** LinkedIn's **Post Inspector** shows the card with its image for the four Lagado links and the home page. Done in the author's signed-in browser (she signs in to LinkedIn herself).

## Boundaries

- **Always:** show options as real images before choosing; check them at phone size; credit every image; append to `docs/features/lagado/journal.md` and `docs/features/cabinet/journal.md`.
- **Ask first:** using the author's Swift drawing in the preview; using any image not already credited on the site; adding a dependency.
- **Never:** an image with an unclear licence; generating images at build time; images for sealed exhibits; starting the cabinet (Phase 1.3).

## The work, in order

1. **Checkpoint A — direction:** the three directions as real images on a phone-sized mock card; the author picks (or mixes).
2. **Checkpoint B — final images:** Lagado and site images refined in the chosen direction, author approves.
3. **Wiring and checks:** `preview` field, tests, build output check, ADR 007, README.
4. **PR and Post Inspector:** preview link for her phone; after merge, Post Inspector on production. Then the first Lagado post can go out.

## Success Criteria

1. The author approves the Lagado image and the site image as they appear on a phone-sized LinkedIn card.
2. Both images are 1200 × 627, under 1 MB, credited, and readable as a thumbnail.
3. All four Lagado pages and the home page carry the image tags with an absolute URL; the 404 and sealed exhibits carry none.
4. Unit tests, `npm run check` and `npm run build` pass; the build stops on an uncredited or wrongly sized preview.
5. After merge, LinkedIn's Post Inspector shows the full card (image, title, description) for the four Lagado links and the home page.
6. ADR 007 written; journals and README current.

## Open Questions

1. ~~Direction~~: Swift drawing (C), chosen by the author on 2026-11-13.
2. ~~Swift drawing~~: yes, by choosing C.
3. ~~Site image~~: made now (Swift plate and two sealed plates); redo in Phase 1.3 if needed.
4. **Post Inspector:** it needs a LinkedIn sign-in. Will you sign in yourself in the browser pane so I can run the checks there, or would you rather run it yourself from a short list?

Spec approved by the operator on 2026-11-13.
