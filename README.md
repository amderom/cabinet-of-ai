# Cabinet of AI

A cabinet of curiosities of the historical prefigurations of artificial intelligence. Each exhibit is a playable reconstruction of an old idea (Lagado's machine, Llull's Ars Magna, Hesse's Glass Bead Game…) rebuilt with vibe coding, set inside a start-up parody, with a scholarly essay and a short making-of. It is also a research and AI portfolio, built to support a LinkedIn series.

---

## Current state

**Current phase:** Phase 1.1 done (live at https://cabinet-of-ai-gx8a.vercel.app); next: Phase 1.2 part 1, images and engravings
**Target MVP:** end of Phase 1.3 (cabinet homepage + complete Lagado exhibit)

What works today: a dark home page listing the exhibits from content (Lagado open; Llull and Hesse sealed). Lagado has three parts with their own links: a demo page (teaser until the machine arrives), the author's essay with a prominent link to the published article, and a making-of note. Every part links to the article and to LinkedIn, lists asset credits when there are any, and carries its own title and description for link previews. Sealed exhibits show a 404 page. Decisions so far: [docs/adr/](./docs/adr/). Build journals: [cabinet](./docs/features/cabinet/journal.md), [Lagado](./docs/features/lagado/journal.md).

> Full startup plan: see [STARTUP.md](./STARTUP.md)
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

When run by an agent (non-interactively), `npm run dev` and `npm run preview` start in the background; stop them with `npx astro dev stop` / `npx astro preview stop`. Restart the dev server after adding new content folders or pages.

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
├── STARTUP.md          ← temporary, deleted after MVP
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
