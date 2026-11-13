# ADR 008: The home page as a vitrine of master cards, plain links with a small script

**Status:** Accepted
**Date:** 2026-11-13
**Decided by:** the operator (Phase 1.3 spec approval and Checkpoints A–B, five review rounds), on the agent's recommendations

## Context

STARTUP.md and docs/project.md describe the homepage as "an illustrated cabinet (2D) that looks like a real piece of furniture, animated with GSAP", with drawers. The project also holds that "vintage is content, never look". A first prototype of a literal cabinet (line drawing, monolith, engraving inside) was rejected as literal, unpolished, out of step with the site's glow-and-engraving look, and built from Lagado's orange, which would not suit other exhibits. A second prototype offered three non-literal directions; the operator chose **Specimens** and refined it over four rounds on her phone and computer.

## Decision

- **A vitrine, not furniture.** The cabinet of curiosities is a metaphor: under the title, one tall card per exhibit floats in an invisible case (hand-placed spots for up to six cards, in `src/cabinet/specimens.ts`; the build stops with a message at seven).
- **Cards are the "master" plates.** Same language as the plates inside an exhibit (cream paper, black ink, mono labels): "Exhibit" and the year, the exhibit's engraving, its title, and a round button in its colour (an arrow when open, a lock when sealed). No numerals, no description.
- **Content-driven and exhibit-neutral.** Cards come from the exhibits collection in `order`; new optional fields `year` and `card` (the credit id of the card's image, black ink on a transparent ground; defaults to the texture). Nothing on the page uses one exhibit's colour except that exhibit's own card.
- **One tap enters.** Open cards are plain links (they work without JavaScript). Sealed cards are not links; a tap shakes them and says "Opening later in the series".
- **The page change.** The card's engraving and the exhibit's background texture share a view-transition name (`exhibit-art-<slug>`, class `exhibit-art`): the engraving grows into the texture in 0.6s while the title moves into the page title. The texture keeps its screen blending during the change and the card's image has a transparent ground, so no box shows. The timing rule lives in `global.css`, because the home page's CSS is gone once the new page is in place.
- **Glow only on mouse hover.** No page glow on the home page at rest or on touch screens. Hovering a card (or focusing it with the keyboard) shows one very diffuse glow in its colour, centred behind it, fixed to the screen so nothing clips it into an edge.
- **No React island, no GSAP.** Astro renders the cards; `src/cabinet/vitrine.ts` (about 60 lines) adds the hover glow and the sealed message. CSS transitions and a view transition do the motion.
- **No tap sound.** Sound is off unless a visitor turned it on inside an exhibit; a sound on a link that leaves the page at once would be cut off and would need the sound library on the home page.
- **Fixed on the way:** the site's glow ignored each exhibit's `--accent` (it was resolved once on the page root, so it was always the default orange). `body` now re-reads it; Lagado is unchanged, Llull's pages would have glowed orange.

## Alternatives considered

- **A literal cabinet** (doors, drawers): rejected at Checkpoint A, round 1.
- **Timeline index** and **signal field**: shown in round 2, not chosen.
- **Bring a card forward on the first tap, enter on the second**: rejected ("makes no sense").
- **Deal the exhibit's plates out of the card** during the page change: would fight the plates' own entrance on the Lagado page; the shared engraving is simpler and always present.
- **A page glow that takes the colour of the hovered card; then per-card halos**: rejected (glow from the wrong place; then too visible and oval).

## Consequences

- Each new exhibit needs a `year` and, ideally, a `card` image (ink on a transparent ground) for its home card; its pages' texture becomes the end of the home page's page change.
- More than six exhibits need a new layout for the case.
- docs/project.md still describes the homepage as furniture animated with GSAP and the cabinet as a React island; it is updated once the operator agrees to the new wording.
