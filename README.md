# Cabinet of AI

A cabinet of curiosities of the historical prefigurations of artificial intelligence. Each exhibit is a playable reconstruction of an old idea (Lagado's machine, Llull's Ars Magna, Hesse's Glass Bead Game…) rebuilt with vibe coding, set inside a start-up parody, with a scholarly essay and a short making-of. It is also a research and AI portfolio, built to support a LinkedIn series.

---

## Current state

**Current phase:** MVP reached (2026-11-13), plus an About page; the Llull exhibit built on `feature/llull-exhibit` (draft PR, sealed until the author opens it)
**Target MVP:** end of Phase 1.3 (cabinet homepage + complete Lagado exhibit)

What works today: the home page shows one tall card per exhibit, floating, read from the content (Lagado open; Llull and Hesse sealed on the live site). One tap on Lagado's card goes to the exhibit, its engraving growing into the page's background engraving; a mouse hovering a card lights a soft glow in its colour. Lagado has four parts with their own links: the demo, a word machine to crank by rows and columns on a phone (or a 6 × 6 square on desktop) with a folio to keep, edit and share lines, three draggable plates under the title and a scrolling parody banner; the author's essay with a prominent link to the published article; "The original", Swift's passage word for word from the 1801 edition on Wikisource; and the making-of. Sound is optional and off by default. Engravings are the common thread: each exhibit declares its images, sounds and texts once with their credits (the build refuses anything uncredited). Link previews show a designed image on LinkedIn. **Llull** (on its branch): "Ask the Art", a machine that answers nine questions (six of Llull's own, three from 2026) by his procedure, letters on a wheel, then the verdict and the reasons in his words; the same plates as Lagado, shared (`src/components/plates/`); the author's essay with four engravings; "The original", Llull's pitch to Pope Celestine V and his chapter on teaching the Art, translated from the Latin by Claude with links to the scans; a making-of with a paper trail to translate; two sounds. Each page credits only what it shows, sources included (ADR 009). An About page (`/about/`) tells who keeps the cabinet and why. Decisions so far: [docs/adr/](./docs/adr/). Build journals: [cabinet](./docs/features/cabinet/journal.md), [Lagado](./docs/features/lagado/journal.md), [Llull](./docs/features/llull/journal.md).

> Project compass, stack and architecture: see [docs/project.md](./docs/project.md)
> Parked ideas: see [IDEAS.md](./IDEAS.md)

---

## Local setup

### Prerequisites
- Node.js 22.23.4+ (even-numbered versions only — required by Astro 7)
- A GitHub account (for the repo) and a Vercel account (free Hobby tier, for hosting)

### Installation
```bash
git clone <repo-url>
cd cabinet-of-ai
npm install
```

### Environment variables
None. The site is fully static and uses no secrets.

### Commands
```bash
npm run dev       # local site at http://localhost:4321
npm run build     # static build into dist/
npm run preview   # serve the build locally
npm run check     # type and template check (astro check)
npm run test      # unit tests (Vitest)
```

When run by an agent (non-interactively), `npm run dev` and `npm run preview` start in the background; stop them with `npx astro dev stop` / `npx astro preview stop`. Restart the dev server after adding new content folders or pages. Only one dev server can run per folder: stop an old one with `npx astro dev stop`.

**Adding an image to an exhibit:** put the file in `src/content/exhibits/<slug>/images/` (longest side ≤ 2400px), declare it in that exhibit's `exhibit.yaml → credits` (id, file, alt, source, licence, and `on:` the pages that show it), then place it with `<Figure id="…" />` in the MDX or as `texture`/`hero`. The build stops if any image lacks a credit.

---

## Deployment

The site is a static build hosted on Vercel, connected to the GitHub repository.

**Full details:** see [docs/project.md](./docs/project.md#deployment-workflow).

### Default workflow
- Short-lived branches (`feature/*`, `fix/*`, `docs/*`, `chore/*`, `refactor/*`) → PR into `main`
- Every PR gets a Vercel preview link, so changes can be checked on a phone before publishing
- Merge to `main` → automatic deploy to production
- No environment variables to manage

---

## Tests

```bash
npm run test
```

Logic inside demos (combinatorics, rules) is unit-tested with Vitest; pages and interactions are checked in a real browser. Details in [docs/project.md](./docs/project.md#tech-stack).

---

## Project structure

```
cabinet-of-ai/
├── README.md
├── IDEAS.md
├── AGENTS.md
├── CLAUDE.md
├── SPEC.md             ← Phase 0 spec
├── tasks/              ← Phase 0 plan and task list
├── docs/
│   ├── project.md
│   ├── adr/            ← architecture decisions
│   ├── features/       ← build journals
│   └── ideas/          ← agreed directions for later phases
├── design/
├── public/
└── src/
    ├── content/exhibits/<slug>/   ← exhibit.yaml, essay.mdx, making-of.mdx
    ├── content.config.ts          ← content schema
    ├── demos/<slug>/              ← one demo per exhibit
    ├── layouts/, components/, pages/, styles/
    └── lib/                       ← tested helpers
```

---

## Contributing

This project uses **agent-skills** (https://github.com/addyosmani/agent-skills) installed globally in the development tools. See [AGENTS.md](./AGENTS.md) for the project-specific conventions and pointers for agents.
