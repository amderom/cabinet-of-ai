# Spec: Phase 1.3 — The cabinet, as the homepage

> Source: [STARTUP.md → Phase 1.3](./STARTUP.md#phase-13--the-cabinet-as-the-homepage).
> Decision filter: [docs/project.md → Project compass](./docs/project.md#project-compass) ("Play first, read second", "Old ideas, 2026 craft", "Phone first") and [Design references](./docs/project.md#design-references) ("Vintage is content, never look"; "The homepage looks like an actual cabinet").
> Branch: `feature/phase-1-3-cabinet`. Replaces the Phase 1.2 part 3 spec (kept in git history). **Reaching the end of this phase reaches the MVP.**

## Objective

Replace the placeholder home page (a plain list of exhibits) with the entrance to the collection: **a cabinet the visitor opens**, with one drawer per exhibit. Lagado's drawer opens onto its demo; Llull's and Hesse's are visibly there but sealed, to tease the series.

**Users:** visitors arriving on the home page from LinkedIn or a shared link, mostly on phones; desktop gets the same thing, larger. The author reviews at each checkpoint.

**What a visitor can do at the end:** land on `/`, see the closed cabinet, open it with one gesture (tap or click), see the drawers, pull Lagado's to enter `/exhibits/lagado/`, and see that more drawers are coming.

**Scope check:** one capability (the homepage cabinet) with one review loop. One spec, no capability map.

## The tension to resolve first

Two agreed rules pull in different directions:
- "The homepage looks like an actual cabinet (a piece of furniture)", in the same engraving language as the exhibits.
- "Vintage is content, never look": no wood, brass, bevels, fake 3D or skeuomorphic materials; anything the visitor touches looks like a 2026 product.

**Resolution proposed:** the cabinet is **recognisably a cabinet in shape and gesture** (doors that open, drawers that pull) but **built like the Lagado machine**: flat, made of light and lines, near-black, the exhibit accents as colour. The past comes in through **content**: a real public-domain engraving of a cabinet of curiosities, the exhibits' names and dates, the drawers' labels. This is decided at Checkpoint A, from a clickable prototype, not from this text.

## Directions to compare (Checkpoint A)

Shown as a clickable prototype the author can open on her phone (a private Claude artifact, address `claude.ai/artifact/<id>`), with a switch between directions. Each opens and pulls a drawer for real.

1. **Line cabinet** (closest to Lagado's "Signal" look). The cabinet drawn in thin cream lines on black, like a technical drawing that glows. Tap: the two doors swing open flat (no perspective); inside, three drawers as long thin rectangles, each with a mono label (number, title, date) and an edge in its accent colour. Lagado's glows orange; sealed ones are dim, with a line across them.
2. **Monolith** (a single product-launch object, after grail-app.com). A solid near-black shape with hairline seams, the Lagado orange leaking from the gaps. Tap: the panels slide apart and the drawers appear as luminous strips.
3. **Engraving inside.** The closed cabinet is a plain modern shape; opening it reveals a **real engraving of a cabinet of curiosities** (candidate: the frontispiece of Ole Worm's *Museum Wormianum*, 1655, public domain, licence to verify) as the interior, with the drawers as modern tabs floating over it.

Any direction can borrow the engraving as a faint texture, as on the exhibit pages.

## Behaviour (whatever the look)

- **Closed on arrival, open in one gesture.** The whole cabinet is the target (tap anywhere on it); a small mono hint ("Open") for clarity.
- **Drawers come from the content collection** (never a hard-coded list): one per exhibit, in `order`. Open exhibits link to their demo page; sealed ones show "Sealed" and do nothing, apart from a small shake on tap.
- **Pulling Lagado's drawer** slides it out, then the page changes to `/exhibits/lagado/` with the existing view transition (the exhibit title morphs from the drawer into the page title).
- **Coming back** (browser back, or "← Cabinet of AI"): the cabinet is already open for the rest of the visit, so nobody has to open it twice (remembered for the browser tab only).
- **Works without JavaScript and with reduced motion:** drawers are ordinary links in the page; with JavaScript off it shows open; with reduced motion it opens instantly, without movement.
- **Sound:** silent by default, as everywhere. If the visitor has turned sound on (the existing toggle, remembered across pages), opening and pulling play a short sound. The STARTUP plan's "enter with sound / in silence" choice at the first gesture was replaced in Phase 1.2 by the small toggle; this spec keeps the toggle (see Open Questions).
- **Below the cabinet:** one line about the project, the LinkedIn link, and a small site-level credits spot for the cabinet's own assets (engraving, sounds, the site preview image).
- **Speed on a mid-range phone:** the cabinet is visible before any script runs; animations move only position, rotation and opacity; no lag when opening.

## Tech Stack

See [docs/project.md → Tech Stack](./docs/project.md#tech-stack). For this phase:
- **GSAP 3.15** (already approved) for the opening and drawer sequences, loaded on the home page only; if CSS alone does the job smoothly, GSAP is not added (decided in the plan, after the prototype).
- The cabinet is drawn in HTML/CSS (and SVG if needed), no images for the furniture itself; no 3D.
- The drawers are ordinary links rendered by Astro; a small script adds the animation. (docs/project.md says "React island"; a React island isn't needed for this, which keeps the page lighter. Recorded in the ADR.)

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
src/cabinet/Cabinet.astro          the cabinet and its drawers (links from the collection)
src/cabinet/cabinet.ts             opening / pulling / remembering (small script)
src/cabinet/drawers.ts (+ test)    pure: drawers from exhibits (order, open/sealed, label text)
src/cabinet/images/                the engraving, if one is used, with its credit
src/pages/index.astro              the home page: cabinet, line about the project, LinkedIn, credits
src/lib/site.ts                    site-level credits (cabinet assets)
docs/adr/008-…md                   the cabinet: look, script instead of island, credits
docs/project.md                    Domain map: cabinet as script, not island (with the author's yes)
```

## Code Style

As before: TypeScript strict, pure logic apart from drawing, Vitest tests.

```ts
// src/cabinet/drawers.ts
export interface Drawer { slug: string; title: string; label: string; accent: string; href?: string } // no href = sealed

/** One drawer per exhibit, in cabinet order; only open exhibits get a link. */
export function drawersFrom(exhibits: ExhibitLike[]): Drawer[]
```

## Testing Strategy

- **Unit (Vitest):** `drawers.ts`: order, open vs sealed, sealed drawers have no link, labels; the "already opened" memory works when the browser refuses storage.
- **Browser (playwright-cli, Edge, 390×844, 375×667, 1280×800):** open by tap and by keyboard; pull Lagado → lands on `/exhibits/lagado/`; back → cabinet already open; sealed drawers don't navigate; JavaScript off → open, links work; reduced motion → no movement; no sideways scroll; no request leaves the site; no console errors.
- **Speed (local build, phone profile):** home LCP < 2.5 s, CLS < 0.1, opening responds in under 200 ms.
- **Author checks:** Checkpoints A–C on her phone, and the final preview.

## Boundaries

- **Always:** show directions as a clickable prototype before building; keep every touchable thing looking like a 2026 product; credit every engraving and sound; test on phone width first; journal each session in `docs/features/cabinet/journal.md`.
- **Ask first:** adding GSAP (approved, but confirm once the prototype shows it's needed); any new image or sound; changing `docs/project.md` (Domain map); changing the site preview image.
- **Never:** wood, brass, bevels, fake 3D or skeuomorphic textures; a hard-coded exhibit list; anything needed to reach Lagado that fails without JavaScript; Llull or Hesse pages; deleting STARTUP.md without the author's confirmation.

## The work, in order (each step gated by the author)

1. **Checkpoint A — direction:** clickable prototype with the three directions; the author picks or mixes.
2. **Checkpoint B — the cabinet on the site:** built into the home page with real drawers from the content; checked on her phone.
3. **Checkpoint C — sound and details:** opening/pulling sounds (if sound is on), credits spot, the line under the cabinet; optional new site preview image.
4. **Checks, ADR 008, PR, merge on her word.** Then the MVP is reached: reminder to delete STARTUP.md (with her confirmation).

## Success Criteria

1. On a mid-range phone, the home page shows the closed cabinet; one tap opens it smoothly; pulling Lagado's drawer lands on the Lagado demo.
2. Llull and Hesse appear as sealed drawers, from the content collection.
3. The author calls it bold and good-looking on her phone, and nothing in it looks vintage.
4. Works with JavaScript off and with reduced motion; the cabinet stays open when coming back during a visit.
5. Silent by default; sounds only with the toggle on; every asset credited on the home page.
6. Home LCP < 2.5 s, CLS < 0.1; no sideways scroll, no external requests, no console errors; tests, `npm run check` and `npm run build` pass.
7. ADR 008 written, journal current; PR approved on her phone and merged; MVP declared.

## Open Questions

1. **Direction:** line cabinet, monolith, or engraving inside? (Checkpoint A.)
2. **Sound choice at the first gesture:** STARTUP.md asked for an "enter with sound / in silence" choice when the cabinet opens. Phase 1.2 replaced it with a small toggle. Keep the toggle only (recommended: one less step before playing), or ask at the cabinet?
3. **Engraving:** use *Museum Wormianum* (1655) or another public-domain cabinet of curiosities, if its licence checks out?
4. **Site preview image:** redo it from the cabinet at the end, or keep the current one?

Spec approved by the operator on 2026-11-13. Open questions 2–4 default to the recommendations until she says otherwise (toggle only; engraving if its licence checks out; site image decided at the end).
