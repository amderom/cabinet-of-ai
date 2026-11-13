# AGENTS.md — Cabinet of AI

> Context file for AI coding agents (Cursor, Claude Code, Codex, OpenCode,
> Copilot, etc.). This project uses **agent-skills**
> (https://github.com/addyosmani/agent-skills) installed globally. This file
> provides project-specific context only — it does not duplicate skill content.

---

## Project

A cabinet of curiosities of the historical prefigurations of artificial intelligence, built as a website. Each exhibit is a playable reconstruction of an old idea, rebuilt with vibe coding, set inside a start-up parody, with a scholarly essay and a short making-of. It is also a research and AI portfolio supporting a LinkedIn series. See docs/project.md → Project compass (Why).

**Current phase:** Phase 0 — Technical foundations
**Primary language:** English (user-facing content)
**Users:** LinkedIn audience — mainly recruiters and academics — arriving from posts, mostly on phones.

---

## Operators

Single operator. At session start, greet them by their `git config user.name` —
a light recognition signal, nothing more.

- **Amélie** — product owner, author and designer; not a developer, has vibecoded before. PhD in English literature, background in content and design, draws, systems thinker, works on AI adoption. **How to engage her:** don't drown her in technical detail, but never hide technical complexity — always say what is going on, what is hard, and what is at risk, in terms of outcomes.

---

## Foundation files

Read these for project context (in this order):

1. **[docs/project.md → Project compass](./docs/project.md#project-compass)** —
   Why, principles and out-of-scope, validated with the user. This is the **decision filter**: read it before
   any `/spec` or architecture decision. Every new feature should align with
   it; if alignment isn't clear, or a request falls out of scope, stop and
   clarify before specifying.
2. ~~STARTUP.md~~ — the bootstrap plan from Phase 0 to MVP. **Deleted on
   2026-11-13, MVP reached** (history in git). New work is feature-scoped:
   see "Bootstrap vs post-MVP" below.
3. **docs/project.md** (rest of the file) — Tech Stack, architecture,
   deployment workflow, constraints. **Source of truth for technical matters.**
4. **README.md** — Current state, local setup, deployment workflow summary.
5. **IDEAS.md** — Parking lot of future ideas (consult only when relevant).
6. **design/DESIGN.md** *(if present)* — Design system specification
   following the getdesign.md convention. When generating UI, always consult
   this file for colors, typography, components, and visual language.

---

## Project structure

```
cabinet-of-ai/
├── README.md                   Current state, setup
├── IDEAS.md                    Parking lot for future ideas (English)
├── AGENTS.md                   This file
├── CLAUDE.md                   One-liner: @AGENTS.md (Claude Code compatibility)
├── docs/
│   ├── project.md              Compass + stack + architecture + deployment (source of truth)
│   ├── adr/                    Architecture Decision Records (filled over time)
│   └── features/               Feature-level docs and per-exhibit build journals
├── design/                     Design system + visual assets (may be empty)
│   └── DESIGN.md               Design system spec (OPTIONAL, getdesign.md convention)
├── tasks/                      Created by /plan (agent-skills)
└── public/, src/, tests/       Structure defined in docs/project.md
```

---

## Project-specific conventions

### Source of truth for Tech Stack and Project Structure
- **`docs/project.md` is authoritative.**
- When running `/spec` or any skill that requires Tech Stack / Project
  Structure information, **reference `docs/project.md` instead of
  duplicating** the content into SPEC.md.
- Example in SPEC.md: `## Tech Stack` → `See [docs/project.md](./docs/project.md#tech-stack).`

### Deployment workflow (immutable)

Default workflow:
- Short-lived branches (`feature/*`, `fix/*`, `docs/*`, `chore/*`,
  `refactor/*`) require PR into `main` before merging
- Merge to `main` → auto-deploy to production on Vercel
- Every PR gets a Vercel preview URL — share it with the operator so she can check it on her phone
- No environment variables are needed; never commit `.env` files

Full details in `docs/project.md#deployment-workflow`.

### Git & PR workflow

This repo uses agent-skills for workflow routing. For Git shipping, apply
`/ship` or `git-workflow-and-versioning` with these local conventions.

**Default collaboration model:** short-lived task branches and PRs into `main`.

Use branch names aligned with agent-skills:
- `feature/<short-topic>` for new user-facing features or project phases
- `fix/<short-topic>` for bug fixes
- `docs/<short-topic>` for documentation-only changes
- `chore/<short-topic>` for maintenance/config changes
- `refactor/<short-topic>` for behavior-preserving code simplification

For parallel work, prefer one branch/worktree per task or contributor. Do not
commit or push directly to `main` unless the user explicitly asks.

Before editing files:
- if on `main`, create the appropriate short-lived branch;
- if already on a task branch, keep using it;
- if there are unrelated local changes, stop and ask;
- do not create a branch for pure discussion, planning, preview, or read-only
  inspection.

When the user says `ship it as a PR` or `create a PR`:
1. Review `git status` and the diff.
2. Stage only intended files.
3. Commit with a concise message.
4. Push the branch.
5. Open a draft PR to `main`.
6. Report the PR link, the Vercel preview link, and checks run.
7. Do not merge.

When the user says `merge the PR` or `review and merge`:
1. Review the PR diff.
2. Check mergeability, conflicts, and GitHub checks if available.
3. Merge only if there is no blocker.
4. Fetch and update `main`.
5. Report the local branch state.

After merge, return to `main` and update it before starting a new task.

### STARTUP.md lifecycle (important)
- STARTUP.md is **temporary** — it guides the bootstrap from Phase 0 to MVP
- Once MVP is reached, **STARTUP.md should be deleted**
- Do NOT extend STARTUP.md with post-MVP phases
- Post-MVP work goes through `/spec` directly on individual features
- Ideas for future work go into IDEAS.md

### Documentation conventions
- **Architecture Decision Records** live in `docs/adr/` — use the
  `documentation-and-adrs` skill when making a significant technical decision
- **Feature-level documentation** lives in `docs/features/<feature-name>/README.md`
  when a feature grows complex enough to need its own docs
- Both directories exist at setup (empty) — agents fill them as needed

### Making-of journal (every exhibit)
The making-of is part of the portfolio ("Show the making" in the Project compass), so it must be captured while building, not reconstructed afterwards.
- When work starts on an exhibit, create `docs/features/<exhibit-slug>/journal.md`. The cabinet gets its own journal too: `docs/features/cabinet/journal.md`.
- At the end of each working session on that exhibit or the cabinet, append a short dated entry: what was built, the key prompts or instructions given, what failed or was changed, and the decisions taken.
- Keep entries short and factual. The public making-of page is written from this journal and validated by the operator.

### Exhibits as content
- Each exhibit is a content entry in `src/content/exhibits/<slug>/` (metadata, essay, making-of) plus one self-contained demo in `src/demos/<slug>/`.
- Status `sealed` exhibits appear as sealed drawers in the cabinet and have no public pages.
- Never hard-code the list of exhibits; read the content collection.

### Assets and credits
- Engravings and images come from free-to-use, public-domain collections (e.g. Rijksmuseum, The Met Open Access). Sounds and 3D models must be CC0 or similarly free.
- Record the source, author (if known) and licence of every third-party asset in the exhibit's metadata (`credits`), and display credits on the site.
- Credits are per page (ADR 009): every credit says which pages use it (`on: [demo, essay, original, making-of]`, required), and each page lists only its own. An essay's references are credits too (`cited: true`, optional `year`), shown under "Sources" in that page's credits; an essay never carries its own sources section. Apply this to every new exhibit.
- If a licence is unclear, do not use the asset — ask the operator.

### Design and visual references

- **`design/` folder** at project root — single home for everything design:
  the `DESIGN.md` spec and visual assets (screenshots, mockups, references),
  organized in freeform subfolders. Always exists (may be empty). Consult these
  files before implementing the corresponding screens.
- **`design/DESIGN.md`** (if present) — design system specification following
  the getdesign.md convention. Read before generating any UI.
- The agreed visual direction and reference websites are listed in `docs/project.md` → Design references. No visual files were provided at setup: the operator's photos and drawings shared during Vibe Project were for mood only and must not be used on the site. Her own artwork may be used only when she explicitly provides it for a specific use (e.g. her drawing of Swift as the Lagado hero), credited to her by name, all rights reserved.

---

## Task routing — suggesting the right entry point

This project expects agent-skills to be used for all development work.
The skills handle their own processes — this file does not duplicate them.

The `using-agent-skills` meta-skill defines the official routing flowchart
and 6 core operating behaviors (Surface Assumptions, Manage Confusion Actively,
Push Back When Warranted, Enforce Simplicity, Maintain Scope Discipline,
Verify, Don't Assume). **These behaviors apply to ALL tasks, regardless of
which entry point is chosen.** The section below is a lightweight guide for
suggesting entry points — it does not replace `using-agent-skills`.

**→ For any non-trivial development task, start from `using-agent-skills`,
then apply the project-specific conventions below. If routing is still unclear,
`using-agent-skills` remains the source of truth for the general workflow;
explicit project conventions remain authoritative for scoped implementation
choices such as the browser driver.**

### How to route

When the user formulates a development request, suggest the appropriate entry
point in 2 lines max, announce it as an assumption the user can override, then
proceed. The user overrides with one word — no blocking for confirmation.

**Routing table:**

| User's intent signal | Suggested entry point |
|---|---|
| User doesn't yet know what they want, intent unclear | `interview-me` |
| Vague idea, needs refinement before anything | `idea-refine` |
| Typo, single-line fix, unambiguous self-contained change | `/build` (skipping `/spec` + `/plan`) |
| Modify existing behavior, targeted improvement, clear scope | `/build` (skipping `/spec` + `/plan`) |
| New screen, new data model, new integration, ambiguous requirements | `/spec` (full pipeline) |
| Structural refactor (extract module, change architecture) | `/spec` |
| Cleanup refactor (same code, cleaner) | `/code-simplify` |
| Bug, error, unexpected behavior | `debugging-and-error-recovery` |
| Browser-based behavior to verify (navigation, UI flows, console, network) | `playwright-cli` |
| Code review, verification pass | `/review` — use `code-simplification` if unnecessary complexity is the main finding |
| Security review (input handling, auth, data storage) | `security-and-hardening` |
| Performance issue (latency, memory, throughput) | `performance-optimization` |
| Document a decision, write an ADR | `documentation-and-adrs` |
| Removing/replacing a public API, breaking change with downstream users | `deprecation-and-migration` |
| Pre-ship web quality audit (perf, best practices, SEO) | `web-quality-audit` |
| Deploy, ship to production | `/ship` |

**Context-specific skills activate automatically.** `context-engineering`
activates when starting a session, switching tasks, or when output quality
drops — it ensures the agent has the right information loaded at the right
time. **UI-specific work** (frontend components, accessibility, styling)
activates `frontend-ui-engineering` automatically during `/build`. **API-specific work**
(endpoints, contracts, boundaries) activates `api-and-interface-design`.
**Unfamiliar library or API** activates `source-driven-development` so the agent
verifies syntax against actual docs rather than guessing. **High-stakes or
unfamiliar-code changes** activate `doubt-driven-development` — an adversarial
fresh-context review of every non-trivial decision in-flight. These are not
standalone entry points — they augment `/build` contextually.

**Web quality skills augment work on web projects.** `performance` activates
when work touches loading speed, runtime efficiency, or resource optimization.
`best-practices` activates when work touches security headers, modern web APIs,
or HTTP-exposed surfaces. `core-web-vitals` activates on indexable pages (LCP /
INP / CLS), and `seo` activates on technical SEO, metadata, structured data —
including the Open Graph link previews that LinkedIn displays. Like `frontend-ui-engineering`,
these are background skills that augment `/build` contextually rather than
serving as entry points. The user-triggered `web-quality-audit` (see routing
table above) remains the explicit pre-ship audit across all these dimensions.

**Browser runtime verification uses the project driver defined here while
`using-agent-skills` continues to govern the overall workflow.** Use
`playwright-cli` by default for navigation, reproduction, interactions,
screenshots, routine console/network inspection, and replay after a fix. Use
one named session per project, worktree or port, task, and agent (for example
`<project>-<worktree-or-port>-<task>-<agent>`). Never use the `default` session,
`close-all`, or `kill-all`; each agent closes only the session it owns, and two
controllers never manipulate the same tab. The host's integrated browser may
remain open as a separate, optional visual cockpit. Escalate to
`browser-testing-with-devtools` only for computed styles/CSS cascade, deep
network or runtime investigation, Lighthouse/performance, memory, or a cause
Playwright did not localize. Playwright MCP is not the selected driver.
Do not configure or use Playwright MCP for this workflow.

**For UI work specifically:** always read `design/DESIGN.md` (if present)
and consult the visual assets in `design/` before generating any UI.
`design/DESIGN.md` is the source of truth for visual language — colors,
typography, components, spacing. The screenshots in `design/` are the
concrete examples. Always verify UI on a phone-sized viewport first (Project compass: Phone first).

**Git and CI work activate dedicated skills.** `git-workflow-and-versioning`
covers commits, branches, conflicts, and parallel streams.
`ci-cd-and-automation` activates when touching build/test/deploy pipelines.
Both are background skills — invoke them implicitly through the work, not as
standalone entry points.

**Suggestion format** (to the user, in their language):

> "I'm going with `[entry-point]` — [reason in 1 line]. Tell me if you'd
> prefer something else."

Then proceed. Do not block for explicit confirmation.

### When skipping `/spec` and `/plan` (not skipping everything)

agent-skills explicitly allows skipping `/spec` and `/plan` for changes that
are **"single-line fixes, typo corrections, or changes where requirements are
unambiguous and self-contained"** (`spec-driven-development` — When NOT to use).

**Before going directly to `/build`, run one quick check:** is this really an
unambiguous change, or is it a bug in disguise? A "small fix" that stops
something from breaking is a bug and belongs in `debugging-and-error-recovery`
(with its Prove-It pattern). When in doubt, per `using-agent-skills` rule #1:
*"Check for an applicable skill before starting work."*

Once the check passes, go directly to `/build`. **Verification is still
required** — run the relevant tests, at minimum do a manual verification
against the acceptance criteria. The `incremental-implementation` and
`test-driven-development` skills still apply in the background. For
browser-based features, `playwright-cli` supplies the default runtime proof;
`browser-testing-with-devtools` is the specialized escalation described above.
"Seems right" is never enough.

### When `/spec` is required (non-negotiable)

Per `using-agent-skills`: **"When in doubt, start with a spec."** Always
suggest `/spec` when the request implies:

- A new data model
- A new screen or module
- A third-party integration
- Requirements that are ambiguous or not self-contained
- A structural refactor that changes architecture

A new exhibit always counts as a new screen: it goes through `/spec`.

### Step back before `/spec` or non-trivial implementation

After a brainstorm, exploration, trade-off discussion, or design discussion,
and **before** writing SPEC.md or launching non-trivial `/build` work, do not
jump straight into execution. First, propose a short design sanity-check:

> "Before we jump into `/spec` or implementation, want me to take a quick
> step back and check whether what we've discussed is coherent, simple, and
> cleanly thought through? Often catches things worth adjusting."

If the user accepts, examine what was decided through these lenses:
- **Over-engineering:** features or abstractions added without concrete user
  need.
- **Logical inconsistencies:** flows that do not hold together, impossible
  states, unclear ownership of state or data.
- **Simplifications:** cuts or lighter approaches with no loss of user value.
- **Logic gaps:** edge cases, concurrency, error handling, security, and
  operational failure modes.

Surface whatever tension or ambiguity the conversation might have glossed over,
then recommend the smallest useful adjustment before continuing.

If the user declines or says "let's just /spec" / "let's just build" → go
directly to the requested entry point. Do not force this gate on typo fixes,
single-line changes, or obviously self-contained work.

### Anti-patterns to avoid

- Proposing the full `/spec → /plan → /build → /test → /review → /ship`
  pipeline for a typo fix. Skipping `/spec` and `/plan` on trivial changes
  is explicitly allowed by agent-skills.
- Suggesting "no skill needed" for any non-trivial change. Even quick fixes
  run through `/build`, which activates `incremental-implementation` and
  `test-driven-development` in the background.
- Making a routing choice silently. The choice is an assumption — announce it
  in 2 lines so the user can override in one word.
- Insisting on routing after the user has overridden. Their call ends the
  discussion.
- Skipping verification to save time. Even the smallest change needs evidence
  (tests, build output, manual check against criteria).
- Contradicting the operating behaviors in `using-agent-skills`. It governs the
  general workflow; explicit project conventions may deliberately specialize
  scoped implementation choices such as the browser driver.
- Reading the entire codebase "to understand the project". Only read files
  relevant to the current task — per `using-agent-skills` Scope Discipline.
- Escalating for obvious technical fixes. Escalate only when multiple
  directions are equally valid or when requirements are genuinely ambiguous
  — that's `Manage Confusion Actively` from `using-agent-skills`. For clear
  technical calls, make the decision and move on (while surfacing the
  assumption).

### Bootstrap vs post-MVP

**While STARTUP.md exists (bootstrap phase):** new work usually means a new
phase from STARTUP.md. `/spec` takes the phase description as input; the agent
reads STARTUP.md + docs/project.md (Project compass first) for context.

**Reaching MVP:** when the last phase of STARTUP.md is shipped, **explicitly
remind the user to delete STARTUP.md before continuing**. The git log preserves
the history; keeping STARTUP.md around turns it into a stale context file that
drifts from reality. Do not delete it silently — ask for confirmation first.

**After MVP (STARTUP.md deleted):** new work is feature-scoped. `/spec` takes
a feature description directly, without phase context. The routing table
above applies identically. The next planned features are the Llull exhibit, then
the Hesse exhibit (see IDEAS.md).

**Large post-MVP evolutions:** for a feature that is too big for a single
`/spec` cycle (e.g. a whole new module, a multi-screen flow), split it into
several independent `/spec` cycles rather than creating a new STARTUP.md-like
document. Each sub-feature ships on its own. Do not resurrect STARTUP.md.

---

## React skills (outside agent-skills)

These come from Vercel and are installed separately — they are NOT part of the
agent-skills pipeline (no `/spec→/ship`). Apply them in the background whenever
you write, review, or refactor React code (plain React, Next.js, React Native,
or Expo):

- **`react-best-practices`** — performance: data fetching & waterfalls, bundle
  size, server components (RSC), re-render optimization.
- **`composition-patterns`** — component architecture & reusable APIs: compound
  components, render props, context providers, avoiding boolean-prop bloat.

Like `frontend-ui-engineering`, these augment `/build` by context — but they are
React-specific quality guidance from a different source, not agent-skills entry points.

---

## What agents should NOT do

- Never modify the Project compass in `docs/project.md` (why, principles,
  out of scope) without the user's explicit agreement — it was validated with
  them and drives every decision. Propose the change, show the new wording,
  wait for a yes.
- Never extend `STARTUP.md` with post-MVP phases — those go into IDEAS.md
  or directly into `/spec` work.
- Never duplicate Tech Stack or Project Structure content into other files —
  always reference `docs/project.md`.
- Never commit secrets or real `.env` files.
- Never create `docs/adr/` or `docs/features/` subfolders proactively
  without actually producing the corresponding documentation.
- Never assume a deployment workflow different from the one documented
  in `docs/project.md` — it is immutable unless an ADR supersedes it.
- Never delete STARTUP.md without explicit user confirmation that the MVP
  has been reached.
- Never make an architectural decision without documenting it in `docs/adr/`
  via the `documentation-and-adrs` skill — **an undocumented decision doesn't
  exist**. Use ADRs for anything expensive to reverse (new dependency, new
  data model, API contract, infrastructure choice).
- Never invoke the `accessibility` skill from `web-quality-skills` unless
  docs/project.md (Project compass or Constraints) explicitly states an
  accessibility compliance requirement (WCAG AA/AAA, EAA conformity, or
  similar). The skill remains installed
  and discoverable, but is opt-in per project — never a default.
- Never put operator names in product/technical docs (IDEAS.md,
  docs/project.md). Operator names live in the AGENTS.md "Operators"
  block — nowhere else.
- Never use the operator's photos or drawings on the site unless she explicitly provides them for a specific use (the Vibe Project mood material stays excluded), and never use an asset whose licence is unclear.
