# Spec: Phase 1.2 part 1 — Images and engravings

> Source: [STARTUP.md → Phase 1.2, Part 1](./STARTUP.md#phase-12--the-lagado-machine).
> Decision filter: [docs/project.md → Project compass](./docs/project.md#project-compass) and Design references ("Engravings are the common thread of the whole site").
> Branch: `feature/phase-1-2-images`. Replaces the Phase 1.1 spec (kept in git history). This file can be deleted before the part is merged.

## Objective

Give the site its images, once and for all: find the first public-domain engravings for Lagado, build one way of showing images everywhere (with credits handled automatically), add Lagado's soft neon engraving texture in the background, illustrate the essay, and give the reading pages more personality.

**Why now:** engravings are the site's common thread, and the machine (Part 2) should be drawn in the same engraving language. The essay is live but not announced, so it can change freely.

**What a visitor sees at the end:** the Lagado pages carry a faint neon engraving in orange behind the title; the essay has one to three engravings at section breaks, each with a caption and credit; the essay page reads with more presence and movement (the direction the author picks); every image is credited at the bottom of the page. On a phone, pages stay fast and the text stays easy to read.

**Users:** visitors arriving from LinkedIn on phones (recruiters, academics); the author, who picks the engravings and the reading-page direction.

**Scope check.** This part bundles four pieces (engravings, image system, texture, reading pages), but they share one data model and one review loop with the author, and none ships usefully alone. One spec, built in a gated order (below), rather than a capability map with four specs.

## The work, in order (each step gated by the author)

### Step 1 — Engraving shortlist (research, no code)

The agent searches open collections and presents a **shortlist** with, for each image: a preview, title, artist, date, collection, source URL, licence, and where it would go (essay illustration, texture, or both). The author picks.

- **Allowed sources:** collections that state public domain or CC0 per item: Wikimedia Commons (only files marked public domain, checked per file), Rijksmuseum, The Met Open Access, Library of Congress, British Library (public-domain Flickr set), Internet Archive scans of out-of-copyright books, Smithsonian Open Access.
- **Avoided:** sources with reuse conditions (e.g. Gallica's "non-commercial with attribution" terms), any image whose licence or artist dates are unclear. *Exception decided by the author on 2026-11-10: the two Grandville 1838 essay images come from Gallica, credited "Source gallica.bnf.fr / BnF", under its non-commercial terms (see `docs/features/lagado/engravings.md`).* If in doubt, the image is dropped (AGENTS.md → Assets and credits).
- **What to look for:** 19th-century illustrated editions of *Gulliver's Travels* (Laputa, Balnibarbi, the Academy of Lagado, the word frame), and images for the essay's sections (dice and frames, Borel's monkey, the spider and the bee). At least 2 candidates for the texture and 4–6 for the essay. (No hero candidates: the hero is the author's own drawing, see below.)
- **Output:** `docs/features/lagado/engravings.md` (shortlist + the author's picks), so the choice is recorded for the making-of.

### Step 2 — One image system, with automatic credits

- Every exhibit image lives in its exhibit's folder: `src/content/exhibits/<slug>/images/`.
- Each image is declared once in `exhibit.yaml` → `credits`, now with an `id`, the `file`, its `alt` text, and an optional `caption`:

```yaml
credits:
  - id: lagado-frame
    file: ./images/lagado-frame.jpg
    alt: "Engraving of a wooden frame covered in word-blocks, turned by students at handles."
    caption: "The word frame of the Academy of Lagado."
    asset: "The Academy of Lagado"
    author: "J. J. Grandville"        # example only; real values come from Step 1
    source: "Wikimedia Commons"
    url: "https://commons.wikimedia.org/…"
    licence: "Public domain"
```

- **In MDX**, an image is placed by its id: `<Figure id="lagado-frame" />`. The component reads the alt, caption and credit from the metadata, so nothing is typed twice.
- Images are optimised by Astro at build (sizes for phone and desktop, modern formats, lazy-loaded below the first screen). No new dependency: Astro already includes its image tool.
- **The credits block** (built in Phase 1.1) lists every image automatically.
- **Build guard:** the build fails, with a clear message, if an image file in an exhibit's `images/` folder has no credit entry, or if a credit has no licence. This enforces the "no asset without its licence" rule mechanically.
- **Phone vs desktop:** every image can have an optional **phone version** (`phoneFile`, e.g. a tighter crop of a wide engraving), served automatically on small screens; layout also differs by screen (full width between paragraphs on a phone; larger or in the margin on desktop, following the reading-page direction chosen in Step 5).
- **Hero:** `exhibit.yaml` gets an optional `hero` (the id of a credited image, distinct from the texture). For Lagado it is **the author's ink drawing of Swift** (`images/swift-portrait.jpg`, credited "Drawing by" the author, all rights reserved; on the dark site shown as light lines on black, possibly tinted, with the file left untouched). It is declared now; it is **displayed in Part 2**, when the landing page is designed with the machine and the plates, and may seed the LinkedIn preview image in Part 3.
- The same system will serve the plates in Part 2 (no plates are built now).

### Step 3 — Lagado essay illustrations

One to three of the picked engravings placed in the essay at section breaks, with caption and credit. The essay's wording stays unchanged.

### Step 4 — Lagado's neon engraving texture

- `exhibit.yaml` gets an optional `texture` (the id of one of its credited images).
- The engraving appears behind the page as **faint lines tinted in the exhibit's colour** on near-black, like neon line-art. Built with CSS from the original image (no image editing by hand).
- **Strength:** visible as atmosphere on the demo page; much fainter on reading pages, and only around the title area, fading out before the text (same rule as the glow).
- Respects reduced motion (no movement of the texture if motion is reduced). Never covers text or controls; never catches taps.

### Step 5 — Reading pages with more personality (ideation, then build)

1. **Explore:** the agent builds **three directions** of the real Lagado essay on a separate exploration branch with its own preview link, viewed by the author on her phone. Starting proposals (to refine when building):
   - **A. Editorial:** a strong opening (first sentence in the large italic serif), a pulled quotation from Swift set large across the column, section numbers as small mono labels, engravings at section breaks.
   - **B. Fluid:** A's typography plus gentle motion as you scroll: headings and images settle in softly, the texture drifts slightly with the scroll.
   - **C. Margin:** engravings and short quotations float beside the text on desktop and between paragraphs on phone, like a scholar's annotated copy.
2. **Pick:** the author chooses one (or a mix). The exploration branch is never merged and is deleted afterwards.
3. **Build:** the chosen direction is built properly into the shared exhibit layout, so every future essay and making-of gets it.

## Tech Stack

See [docs/project.md → Tech Stack](./docs/project.md#tech-stack). Uses Astro's built-in image handling (`astro:assets`, `image()` in content schemas). **No new dependency.** If Step 5's chosen direction needs scroll animation beyond CSS, GSAP (already approved in docs/project.md) may be installed, loaded only on the pages that use it, after asking the author.

## Commands

```
Install:   npm install
Dev:       npm run dev          # http://localhost:4321 (one dev server per folder; stop old ones with `npx astro dev stop`)
Build:     npm run build
Preview:   npm run preview
Test:      npm run test
Check:     npm run check
```

## Project Structure

Expected changes (follows [docs/project.md → Project Structure](./docs/project.md#project-structure)):

```
src/content.config.ts                     credits: id, file (image()), phoneFile?, alt, caption?; exhibits: texture?, hero?
src/content/exhibits/lagado/images/       the picked engravings (originals, credited)
src/content/exhibits/lagado/exhibit.yaml  credits + texture
src/content/exhibits/lagado/essay.mdx     <Figure> placements (text unchanged)
src/components/Figure.astro               image + caption + credit, by id
src/components/Texture.astro              the neon engraving background layer
src/lib/credits.ts (+ credits.test.ts)    pure helpers: find a credit by id, check uncredited files
src/lib/exhibit-pages.ts                  build guard for uncredited images
src/layouts/BaseLayout.astro, ExhibitLayout.astro   texture layer; chosen reading-page direction
src/styles/global.css                     texture and reading-page styles
docs/features/lagado/engravings.md        shortlist and picks
docs/adr/005-images-and-credits.md        the image + credits model
```

## Code Style

As in earlier phases: TypeScript strict, Astro components, Tailwind utilities, custom CSS only in `global.css`, pure helpers in `src/lib/` with Vitest tests.

```ts
// src/lib/credits.ts
export interface CreditLike {
  id: string;
  licence: string;
}

/** The credit for an image id, or a clear error naming the exhibit. */
export function creditFor<T extends CreditLike>(credits: T[], id: string, exhibit: string): T {
  const credit = credits.find((c) => c.id === id);
  if (!credit) throw new Error(`Exhibit "${exhibit}" has no credit with id "${id}" (add it to exhibit.yaml → credits)`);
  return credit;
}
```

## Testing Strategy

- **Unit (Vitest):** `credits.ts`: find by id, unknown id gives a clear error, uncredited file detection, duplicate ids rejected.
- **Build as a test:** `npm run build` fails on an uncredited image, a credit without licence, an unknown `<Figure id>` or an unknown `texture` id (each triggered once on purpose, then reverted).
- **Browser (playwright-cli, 390×844, 375×667, 1280×800):**
  1. Every image has alt text, a caption and a credit; the credits block lists them all.
  2. Images are served in phone-sized versions (no image wider than ~2× its displayed size); images below the first screen load lazily.
  3. The texture is visible on the demo page, fainter on reading pages, never over the essay's text area, never blocks taps; it stands still with reduced motion.
  4. No sideways scroll; no request leaves the site; no console errors.
  5. Performance (Lighthouse mobile, local build): LCP under 2.5 s and CLS under 0.1 on the essay page.
- **Author checks:** the shortlist (Step 1), the three directions on her phone (Step 5), the final PR preview.

## Boundaries

- **Always:** record source, author, licence and URL for every image before it enters the repo; keep the essay's wording unchanged; check every image on a phone; write alt text for every image (author validates); append to `docs/features/lagado/journal.md` after each session; verify Astro image APIs against current Astro 7 docs.
- **Ask first:** using any image (the author picks from the shortlist); installing GSAP; any change to the essay text; changing accent colours or typefaces; editing `docs/project.md`.
- **Never:** use an image with an unclear licence or from a source with reuse conditions; use the operator's photos or drawings except those she explicitly provides for a specific use (her Swift drawing as the Lagado hero); load images from another site at runtime (all images are served from this site); merge the exploration branch; build the plates, the machine or the preview images (Parts 2 and 3).

## Success Criteria

1. `docs/features/lagado/engravings.md` lists the shortlist with licences and the author's picks.
2. Every Lagado image is declared once with id, alt, licence and source; the build fails if any image lacks a credit.
3. The Lagado essay shows 1–3 engravings with captions and credits; the credits block lists them.
4. Lagado's neon engraving texture shows on its pages, faint on reading pages, never hurting readability (the author's judgement on her phone).
5. The author has compared three reading-page directions on her phone, and the chosen one is built into the shared layout.
6. Essay page on mobile: LCP < 2.5 s, CLS < 0.1; no sideways scroll; no external requests.
7. ADR 005 written; journal up to date; PR preview approved by the author on her phone.

## Changes after approval

- 2026-11-10, at the operator's request: phone versions of images (Step 2) and a hero image per exhibit (declared now, displayed in Part 2).
- 2026-11-10: the Lagado hero is the operator's own drawing of Swift. The rule against using her drawings was reworded with her yes (AGENTS.md, docs/project.md): her artwork is used only when she provides it for a specific use; the Vibe Project mood material stays excluded. The "public domain only" rule still applies to every other image.

## Open Questions

1. How many essay images: the author decides from the shortlist (1 to 3).
2. Alt texts and captions: drafted by the agent, validated by the author.
3. Whether the chosen reading-page direction needs GSAP (asked at Step 5).
4. For Part 2, still pending: 36 vs 40 students, to check against Swift.

Spec approved by the operator on 2026-11-10.
