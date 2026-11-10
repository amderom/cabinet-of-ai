# Cabinet of AI

A cabinet of curiosities of the historical prefigurations of artificial intelligence. Each exhibit is a playable reconstruction of an old idea (Lagado's machine, Llull's Ars Magna, Hesse's Glass Bead Game…) rebuilt with vibe coding, set inside a start-up parody, with a scholarly essay and a short making-of. It is also a research and AI portfolio, built to support a LinkedIn series.

---

## Current state

**Current phase:** Phase 0 — Technical foundations
**Target MVP:** end of Phase 1.3 (cabinet homepage + complete Lagado exhibit)

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

### Run
```bash
npm run dev
```

Site available at http://localhost:4321.

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
├── docs/
│   ├── project.md
│   ├── adr/
│   └── features/
├── design/
└── src/                ← created in Phase 0 (see docs/project.md)
```

---

## Contributing

This project uses **agent-skills** (https://github.com/addyosmani/agent-skills) installed globally in the development tools. See [AGENTS.md](./AGENTS.md) for the project-specific conventions and pointers for agents.
