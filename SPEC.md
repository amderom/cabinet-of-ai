# Spec: About the project

> First post-MVP feature, asked for by the author on 2026-11-13. Branch: `feature/about-page`. Replaces the Phase 1.3 spec (kept in git history).
> Decision filter: [docs/project.md → Project compass](./docs/project.md#project-compass) ("Every part is shareable", "Show the making", "Phone first"; no contact form, LinkedIn is the only channel).

## Objective

A page **about the project** (not a CV): who keeps the cabinet, how a thesis on French translations of *Gulliver's Travels* led to AI's prefigurations, and why the site mixes AI, research, open source, drawing and light humour. It turns curious visitors (recruiters, academics) into LinkedIn followers.

**What a visitor can do:** reach `/about/` from the home page or any exhibit page, read it on a phone in under two minutes, follow the link to the published article, and follow the author on LinkedIn.

## The page

- **Address:** `/about/`, with its own link-preview title and description (the site preview image).
- **Links to it:** a small "About" link in the home page's header and footer, and in every exhibit page's footer.
- **Calls to action:** "Read the article ↗" (the Lagado article, from the exhibit's `research` reference, not typed twice) and "Follow the series on LinkedIn ↗".
- **Facts kept in one place:** name, LinkedIn and job title in `src/lib/site.ts`.

## Text (short, in the author's voice; she edits it on the preview)

> **Title:** About the *cabinet*
>
> Cabinet of AI began, as questionable machines often do, in a library.
>
> I used to be a PhD student at Aix-Marseille Université, working on the French translations of Jonathan Swift's *Gulliver's Travels*. There I met the engine of Lagado, which lets anyone "write books in philosophy, poetry, politics" "without the least assistance from genius or study". It looked less like a joke every year. I followed the thread to the machines it prefigured, gave talks about them at Princeton University, Boston University and Université Paris 8, and wrote a paper about it.
>
> For the past three years I have been AI Adoption and Learning Lead at Logotel France.
>
> I like making things, with my hands and with words. This site is where they meet: AI and technology, research, open source, drawing and a little humour. It is also my workshop for vibe coding: every machine here is built with an AI agent, and the making-of pages show how.
>
> If you came looking for a lesson, I'm afraid there isn't one. Turn the cranks anyway.

## Look (the author, 2026-11-13: "only black and white; use design elements from other pages, don't make anything new")

- No colour on the page: the accent is the site's cream, no page glow, the photo in greyscale.
- The photo sits on a cream plate exactly like Lagado's "Portrait" plate (mono labels on top, picture, italic caption), tilted a little.
- The text uses the essays' reading style (`prose-cabinet`, drop cap); the links are the exhibits' "Go further" links (`ExhibitCta`); the header and footer rows are the existing ones.
- The photo is hers, given for this page only: credited to her, all rights reserved.

## Tech Stack

See [docs/project.md → Tech Stack](./docs/project.md#tech-stack). Nothing new.

## Project Structure

```
src/pages/about.astro              the page (text in the page; the photo as a plate)
src/assets/about/portrait.jpg      the author's photo (cropped to a portrait)
src/lib/site.ts                    job title, about-page description
src/pages/index.astro              "About" link in header and footer
src/layouts/ExhibitLayout.astro    "About" link in the footer
docs/project.md                    Routes: add /about/
```

## Testing Strategy

- **Build:** `/about/` has its title, description, canonical URL and preview image tags.
- **Browser (playwright-cli, Edge, 390×844, 375×667, 1280×800):** readable without sideways scroll; links to the article and LinkedIn work; "About" links reach the page from home and from an exhibit; no console errors.
- **Author:** reads it on her phone on the PR preview.

## Boundaries

- **Always:** her words win; check every quotation against its source; credit her photo to her, all rights reserved.
- **Ask first:** any personal detail not given by her; any other photo or drawing of hers.
- **Never:** a contact form or email address; analytics; using her photo anywhere else on the site.

## Success Criteria

1. The author approves the text and the photo (or none) on her phone.
2. `/about/` is reachable from the home page and every exhibit page, and shares well on LinkedIn (title, description, image).
3. No sideways scroll at 375px; tests, `npm run check` and `npm run build` pass.

## Open Questions

1. The text: she edits it on the preview.
2. ~~Photo~~: hers, given 2026-11-13, for this page only.
3. Talks: add titles and years, or keep them as a list of places?
4. Any other link (GitHub for the open-source side)?
