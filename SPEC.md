# Spec: Phase 1.3 — The cabinet, as the homepage

> Source: [STARTUP.md → Phase 1.3](./STARTUP.md#phase-13--the-cabinet-as-the-homepage).
> Decision filter: [docs/project.md → Project compass](./docs/project.md#project-compass) ("Play first, read second", "Old ideas, 2026 craft", "Phone first") and [Design references](./docs/project.md#design-references) ("Vintage is content, never look"; "The homepage looks like an actual cabinet").
> Branch: `feature/phase-1-3-cabinet`. Replaces the Phase 1.2 part 3 spec (kept in git history). **Reaching the end of this phase reaches the MVP.**

## Objective

Replace the placeholder home page (a plain list of exhibits) with the entrance to the collection: **a vitrine of specimens**, one floating plate per exhibit. Lagado's plate leads to its demo; Llull's and Hesse's are visibly there but sealed, to tease the series.

**Users:** visitors arriving on the home page from LinkedIn or a shared link, mostly on phones; desktop gets the same thing, larger. The author reviews at each checkpoint.

**What a visitor can do at the end:** land on `/`, see the exhibits floating as plates, bring one forward with a tap, enter Lagado's at `/exhibits/lagado/`, and see that more are coming.

**Scope check:** one capability (the homepage cabinet) with one review loop. One spec, no capability map.

## Direction: Specimens (chosen by the author, 2026-11-13)

Round 1 (a literal cabinet: line drawing, monolith, engraving inside) was rejected: "very literal", "unfinished and unpolished", "doesn't match the vibe of the website, which is glow, engraving texture", and its Lagado-orange details "won't work for other exhibits". She wants it sleek and techie; it doesn't have to be a literal cabinet. Round 2 prototype: https://claude.ai/artifact/Gfk2Xj13NuZGfMskCgeYp6, direction **A · Specimens** chosen.

**The cabinet is a vitrine of specimens** (a cabinet of curiosities as a metaphor, not furniture):
- Under the big "Cabinet *of AI*" title, the exhibits **float as plates** in a glass case marked only by four small "+" corner marks (after DeepBook). Each plate drifts slowly and tilts a little.
- **Every plate is the exhibit's own:** its engraving (the exhibit's `texture` image, inverted to light lines and tinted with its accent), its number and year, its title. **Sealed plates** show a static pattern in their own colour and a "Sealed" tag.
- **Exhibit-neutral:** nothing site-level uses one exhibit's colour or motifs. The page glow is **cream** until a plate is chosen, then takes that exhibit's colour.

## Behaviour

- **First tap brings a plate forward**: it moves to the middle, grows, stops drifting; the others blur and fade; the glow takes its colour; under it, the year and status, and for open exhibits an **"Enter the exhibit →"** button. Tapping the chosen plate again also enters. Tapping outside puts it back.
- **Sealed plates** come forward too (so they can be seen), with "Opening later in the series" instead of a button; tapping again gives a small shake.
- **Entering** goes to `/exhibits/<slug>/` with the existing view transition (the title morphs into the page title).
- **Plates come from the content collection** (never a hard-coded list), in `order`; their places in the case are computed for any number of exhibits (tested up to six; beyond that, a later design question).
- **Without JavaScript:** open plates are plain links straight to the exhibit; sealed plates are plain text. **Reduced motion:** no drifting, no movement when choosing.
- **Sound:** silent by default; with the existing sound toggle on, choosing a plate plays a short sound (Checkpoint C).
- **Below the case:** one line about the project, the LinkedIn link, and a small site-level credits spot (the site preview image; any sound).
- **Speed on a mid-range phone:** the plates are plain HTML and CSS, visible before any script runs; animations move only position, rotation, scale and opacity; the small script only handles choosing.

## Tech Stack

See [docs/project.md → Tech Stack](./docs/project.md#tech-stack). For this phase:
- **No GSAP:** the prototype shows CSS transitions are enough.
- The vitrine is HTML/CSS; the only images are the exhibits' own engravings; no 3D.
- The plates are ordinary links rendered by Astro; a small script adds choosing. (docs/project.md says "React island"; a React island isn't needed for this, which keeps the page lighter. Recorded in the ADR.)

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
src/cabinet/Vitrine.astro          the case and its plates (links from the collection)
src/cabinet/vitrine.ts             choosing a plate (small script)
src/cabinet/specimens.ts (+ test)  pure: plates from exhibits (order, open/sealed, labels, colour) and their places in the case
src/pages/index.astro              the home page: cabinet, line about the project, LinkedIn, credits
src/lib/site.ts                    site-level credits (cabinet assets)
docs/adr/008-…md                   the cabinet: look, script instead of island, credits
docs/project.md                    Domain map: cabinet as script, not island (with the author's yes)
```

## Code Style

As before: TypeScript strict, pure logic apart from drawing, Vitest tests.

```ts
// src/cabinet/specimens.ts
export interface Specimen { slug: string; title: string; label: string; accent: string; href?: string } // no href = sealed

/** One plate per exhibit, in cabinet order; only open exhibits get a link. */
export function specimensFrom(exhibits: ExhibitLike[]): Specimen[]
```

## Testing Strategy

- **Unit (Vitest):** `specimens.ts`: order, open vs sealed, sealed plates have no link, labels; places in the case for 1 to 6 plates stay inside it.
- **Browser (playwright-cli, Edge, 390×844, 375×667, 1280×800):** choose by tap and by keyboard; enter Lagado → lands on `/exhibits/lagado/`; sealed plates don't navigate; JavaScript off → Lagado plate is a working link; reduced motion → no movement; no sideways scroll; no request leaves the site; no console errors.
- **Speed (local build, phone profile):** home LCP < 2.5 s, CLS < 0.1, choosing a plate responds in under 200 ms.
- **Author checks:** Checkpoints A–C on her phone, and the final preview.

## Boundaries

- **Always:** show directions as a clickable prototype before building; keep every touchable thing looking like a 2026 product; credit every engraving and sound; test on phone width first; journal each session in `docs/features/cabinet/journal.md`.
- **Ask first:** adding GSAP (approved, but confirm once the prototype shows it's needed); any new image or sound; changing `docs/project.md` (Domain map); changing the site preview image.
- **Never:** wood, brass, bevels, fake 3D or skeuomorphic textures; a hard-coded exhibit list; anything needed to reach Lagado that fails without JavaScript; Llull or Hesse pages; deleting STARTUP.md without the author's confirmation.

## The work, in order (each step gated by the author)

1. **Checkpoint A — direction:** clickable prototype with the three directions; the author picks or mixes.
1b. **Checkpoint A, round 2:** non-literal directions; Specimens chosen.
2. **Checkpoint B — the cabinet on the site:** built into the home page with real plates from the content; checked on her phone.
3. **Checkpoint C — sound and details:** opening/pulling sounds (if sound is on), credits spot, the line under the cabinet; optional new site preview image.
4. **Checks, ADR 008, PR, merge on her word.** Then the MVP is reached: reminder to delete STARTUP.md (with her confirmation).

## Success Criteria

1. On a mid-range phone, the home page shows the floating plates; a tap brings one forward smoothly; entering Lagado's lands on the Lagado demo.
2. Llull and Hesse appear as sealed plates, from the content collection; nothing site-level uses one exhibit's colour.
3. The author calls it bold and good-looking on her phone, and nothing in it looks vintage.
4. Works with JavaScript off and with reduced motion; the cabinet stays open when coming back during a visit.
5. Silent by default; sounds only with the toggle on; every asset credited on the home page.
6. Home LCP < 2.5 s, CLS < 0.1; no sideways scroll, no external requests, no console errors; tests, `npm run check` and `npm run build` pass.
7. ADR 008 written, journal current; PR approved on her phone and merged; MVP declared.

## Open Questions

1. ~~Direction~~: Specimens (round 2, 2026-11-13).
2. **Sound choice at the first gesture:** STARTUP.md asked for an "enter with sound / in silence" choice when the cabinet opens. Phase 1.2 replaced it with a small toggle. Keep the toggle only (recommended: one less step before playing), or ask at the cabinet?
3. ~~Engraving of a cabinet~~: not needed; each plate carries its exhibit's own engraving. Llull's and Hesse's images come with their exhibits.
4. **Site preview image:** redo it from the cabinet at the end, or keep the current one?

Spec approved by the operator on 2026-11-13. Open questions 2–4 default to the recommendations until she says otherwise (toggle only; engraving if its licence checks out; site image decided at the end).
