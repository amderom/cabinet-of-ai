# Startup plan — Cabinet of AI

> ⚠️ **Temporary document.** This file holds the project's startup plan up to the MVP. Once the MVP is reached, **DELETE this file** — the git log preserves the history. The project then continues through `/spec` on individual features with agent-skills.
>
> Do NOT extend this file with post-MVP phases. Future ideas go into [IDEAS.md](./IDEAS.md). Major architectural decisions go into `docs/adr/` via the `documentation-and-adrs` skill.

---

## Phase 0 — Technical foundations

**Goal:** Set up the complete technical environment before any visible functional work.

**Content:**
- Astro 6 project with React and MDX, Tailwind CSS 4 (`astro add tailwind`), and Vitest with a working `npm run test` (versions: see docs/project.md)
- One content entry per exhibit (title, accent colour, status, its three parts). Three entries exist from the start: Lagado (open), Llull and Hesse (sealed). Sealed entries need only metadata — no essay or making-of
- Base design: dark theme, typography, per-exhibit accent colours, page transitions (`ClientRouter`), self-hosted fonts
- Empty but working pages: home, and for each **open** exhibit (Lagado only for now) its demo + parody page, essay page and making-of page. Sealed exhibits get no pages
- **Initial deployment to Vercel** from GitHub, with a preview link for every PR
- Build journal convention in place (see AGENTS.md → Making-of journal), so the making-of is captured from the first session

**Done when:** the site runs locally AND on Vercel from `main`, and you can move between placeholder pages with transitions.

---

## Phase 1.1 — The exhibit page, with Lagado's text

**Goal:** Build the page structure every exhibit will share, filled with real Lagado content.

**What a visitor can do at the end:** open a shared link to the Lagado essay, read the summary, follow the link to the journal article, and reach the author's LinkedIn.

**Technical content:**
- Exhibit layout: demo slot (empty for now), essay, making-of, navigation between the three parts
- A separate URL for each part (demo, essay, making-of)
- Calls to action on every part: read the research, follow on LinkedIn
- Essay and making-of pages link prominently back to the demo (Play first)
- Credits block in the exhibit layout (source, author, licence of each third-party asset)
- **LinkedIn link previews, part 1:** title and description for every shareable URL (Open Graph metadata). Preview images come at the end of Phase 1.2
- Lagado essay summary in MDX, with the journal reference and link
- The essay goes live on production with an empty demo slot; it is not announced on LinkedIn until Phase 1.2 ships

**Done when:** after merge, the production Lagado essay reads well on a phone and LinkedIn's Post Inspector reads its title and description (Vercel preview URLs are protected, so LinkedIn can't read them).

---

## Phase 1.2 — The Lagado machine

**Goal:** Make Lagado playable, inside its start-up parody, with sound.

**What a visitor can do at the end:** arrive on the Lagado demo from a LinkedIn link, choose to enter with sound or in silence, play with the machine, read the parody around it, and open the making-of.

Phase 1.2 is specced and shipped in three parts, in this order (each gets its own `/spec`):

**Part 1 — Images and engravings** (images as a whole, done once for the whole site):
- **Reading pages with more personality** (raised by the author after Phase 1.1: the essay page feels a bit bland, she wants something more fluid). Explore two or three directions on real screens first: e.g. a stronger opening in the display serif, the author's quotations pulled out large, gentle motion as you scroll, engraving vignettes at section breaks. Readability on a phone comes first
- **Engravings, first pass (common thread of the site, see docs/project.md → Design references):** find the first public-domain engravings and record their licences
- One way of showing images everywhere: engraving plates, illustrations inside essays and making-ofs (caption, credit, licence), all crisp but light on a phone; credits listed automatically in the credits block
- The soft neon engraving texture, built once as a background layer for the whole site and tuned on the demo, essay and making-of pages (faint enough to keep the essay readable on a phone)
- The engraving style chosen here gives the machine its visual language in Part 2

**Part 2 — The machine:**
- The landing page's **hero image** (picked and declared in Part 1, distinct from the texture) gets its place and size in the landing page design, alongside the machine and the plates
- Lagado demo as a self-contained React island, inside its parody framing (format chosen for this exhibit: pitch, pricing page, etc.), drawn in the engraving language from Part 1
- Sound system: "enter with sound / in silence" choice, mute toggle that persists across page changes (`transition:persist`), first sound effects (Howler.js)
- Demo context as agreed in [docs/ideas/demo-context.md](docs/ideas/demo-context.md): three plates (specimen + museum label, quote, specifications), parody in the scrolling banner, and a fourth part "The original" (adds a route; update docs/project.md → Routes when specifying)
- Unit tests for the machine's logic
- Lagado making-of written from the build journal
- Fallback: if the image search in Part 1 drags on, pause it and build the machine with temporary visuals, then restyle

**Part 3 — LinkedIn link previews, part 2:** preview images designed with the author once the machine exists, one per exhibit (plus one for the site); checked in LinkedIn's Post Inspector on production before the first Lagado post

**Done when:** Lagado is complete (demo + parody, essay, making-of) and playable on a mid-range phone, with sound on and off, and its links show a full preview card (with image) in LinkedIn's Post Inspector.

---

## Phase 1.3 — The cabinet, as the homepage

**Goal:** Build the entrance: a cabinet that looks like a real piece of furniture and opens onto the collection.

**What a visitor can do at the end:** land on the homepage, see the closed cabinet, open it, and pull the Lagado drawer to enter the exhibit's demo page (`/exhibits/lagado/`). Llull and Hesse's drawers are visible but sealed.

**Technical content:**
- An illustrated cabinet (2D, no 3D), animated with GSAP, that works on every phone
- Drawers driven by the exhibit content entries (open vs sealed)
- The "enter with sound / in silence" choice appears at the cabinet's first gesture (opening), reusing the sound system from Phase 1.2
- Cabinet visuals drawn or sourced from free-to-use material (source and licence recorded), in the same engraving language as the exhibits, so the homepage and the exhibits feel like one place
- Site-level credits spot for the cabinet's assets

**Done when:** the homepage opens into the cabinet and leads to Lagado, on both a mid-range phone and a desktop.

---

## 🎯 MVP reached at the end of Phase 1.3

A visitor arriving from LinkedIn can either land directly on any part of the Lagado exhibit (demo, essay, making-of) or enter through the cabinet on the homepage, play with the Lagado machine with or without sound, read the research, and follow the author on LinkedIn. Llull and Hesse are visible as sealed drawers, teasing the rest of the series.

---

## Use cases by phase

### Phase 0
- UC0.1: An agent can clone the repo, install dependencies and run the site locally.
- UC0.2: Every PR produces a Vercel preview link that can be opened on a phone.

### Phase 1.1
- UC1.1.1: A recruiter taps a LinkedIn post, lands on the Lagado essay and reads it comfortably on a phone.
- UC1.1.2: An academic follows the essay's link to the published journal article.
- UC1.1.3: A visitor reaches the author's LinkedIn from any part of the exhibit.

### Phase 1.2
- UC1.2.1: A visitor plays with the Lagado machine on a phone and understands the parody around it.
- UC1.2.2: A visitor in a public place enters in silence; another chooses sound and can mute it at any time.
- UC1.2.3: A visitor reads how the machine was built with AI in the making-of.

### Phase 1.3
- UC1.3.1: A visitor on the homepage opens the cabinet and pulls the Lagado drawer.
- UC1.3.2: A visitor sees that more exhibits are coming (sealed drawers).
- UC1.3.3: A visitor on a mid-range phone opens the cabinet without lag.

---

## Visual references

The permanent design direction lives in `docs/project.md` (Design references) and `AGENTS.md` (Design and visual references), since STARTUP.md is temporary. Design files, if any, live in `design/`.

---

## Open assumptions

- ASSUMPTION: The author provides the Lagado essay summary, the journal reference, and validates the parody copy. Agents use clearly marked placeholders until then.
- ASSUMPTION: The Lagado parody format (pitch, pricing page, etc.) is chosen with the author at the start of Phase 1.2.
- ASSUMPTION: LinkedIn preview images are static images, one per exhibit (not per part), not generated automatically. Designed at the end of Phase 1.2.
- ASSUMPTION: The site uses the free `vercel.app` subdomain for the MVP.

---

## How to use this plan

For each phase, in the IDE with agent-skills installed:

1. `/spec [phase description]` — the agent reads STARTUP.md + docs/project.md (starting with the Project compass) for context
2. `/plan` — the agent breaks the phase into verifiable tasks (tasks/plan.md)
3. `/build` — incremental implementation, slice by slice
4. `/test` — verification with test-driven-development
5. `/review` — code-review-and-quality + security-and-hardening
6. `/ship` — when the phase is deliverable

Then move on to the next phase.

---

## ⚠️ Final reminder

This file will be **deleted** once the MVP is reached. Its role is to carry the project's bootstrap, not to become a history of it. The git log keeps the phases. Lasting architectural decisions go into `docs/adr/`. The Project compass lives at the top of [docs/project.md](./docs/project.md#project-compass).
