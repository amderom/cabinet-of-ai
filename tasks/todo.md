# Tasks: Phase 0 — Technical foundations

> Plan: [plan.md](./plan.md). Spec: [SPEC.md](../SPEC.md).
> Every task: verify syntax against current docs (Context7), run `npm run test` and `npm run build` before committing, and keep `main` untouched.

---

## T1: Scaffold Astro 7 project ✅

**Description:** Create the Astro 7.4.x project (ADR 001) in the repo root (keeping the existing docs), add React and MDX integrations, Vitest and `@astrojs/check`, and the npm scripts from the spec. Confirm everything works on Node 26.

**Acceptance criteria:**
- [x] `npm run dev` serves a page at http://localhost:4321
- [x] `npm run build` produces a static `dist/`; `npm run test` runs (a trivial test passes); `npm run check` runs clean
- [x] `package.json` has `engines.node >=22.23.4`; tsconfig uses Astro's `strict` preset

**Verification:**
- [ ] Commands above, run locally on Node 26
- [ ] `git status` shows no `node_modules/`, `dist/` or `.astro/` (already in `.gitignore`)

**Dependencies:** None
**Files likely touched:** `package.json`, `package-lock.json`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `src/pages/index.astro`
**Estimated scope:** M

---

## T2: Design foundations ✅

**Description:** Add Tailwind 4 via `npx astro add tailwind`, define the tokens (ink, paper, muted, accent, sans, serif) in `src/styles/global.css`, self-host Geist and Newsreader through Astro's Fonts API (downloaded at build, served from the site), and create `BaseLayout.astro` (html lang="en", dark body, fonts, global CSS).

**Acceptance criteria:**
- [x] The index page renders with near-black background, paper text, Geist as body font
- [x] Font files load from the site itself (`/_astro/fonts/…`); no request leaves the site
- [x] Font licences (OFL) recorded in ADR 003 (T8)

**Verification:**
- [ ] `npm run build` + `npm run check` pass
- [ ] playwright-cli: computed `font-family` on body resolves to Geist; network log has no external font request

**Dependencies:** T1
**Files likely touched:** `src/styles/global.css`, `src/layouts/BaseLayout.astro`, `astro.config.mjs`, `package.json`
**Estimated scope:** M

---

## T3: Exhibit content model

**Description:** Define the `exhibits`, `essays` and `makingOfs` collections in `src/content.config.ts` with the spec's schema. Add Lagado (open, with placeholder essay and making-of), Llull and Hesse (sealed, metadata only). Write `src/lib/exhibits.ts` helpers test-first: sort by order, filter open, find open exhibits missing a part.

**Acceptance criteria:**
- [ ] Schema rejects a bad accent (not `#RRGGBB`) or an unknown status
- [ ] Helpers return exhibits in `order`, and only open ones when asked
- [ ] `missingParts()` (or equivalent) reports an open exhibit without essay or making-of
- [ ] Lagado's placeholder essay contains a footnote; it renders as a proper footnote (Sätteri check, see plan risks)

**Verification:**
- [ ] `npm run test`: helper tests written first, seen failing, then passing
- [ ] `npm run build` + `npm run check` pass with the three entries

**Dependencies:** T1
**Files likely touched:** `src/content.config.ts`, `src/content/exhibits/{lagado,llull,hesse}/*`, `src/lib/exhibits.ts`, `src/lib/exhibits.test.ts`
**Estimated scope:** M

---

## Checkpoint A
- [ ] test, check, build all pass
- [ ] Short report to the operator

---

## T4: Home page from the collection

**Description:** `src/pages/index.astro` uses `BaseLayout`, reads the collection through the helpers and lists every exhibit in order: open ones link to `/exhibits/<slug>/`, sealed ones are shown as "Sealed" without a link. Each item shows its accent. Visible "Placeholder" label.

**Acceptance criteria:**
- [ ] Lagado appears as a link; Llull and Hesse appear as sealed, not links
- [ ] No exhibit name is hard-coded in the page

**Verification:**
- [ ] `npm run build` passes
- [ ] playwright-cli at 390×844: the three items are visible and readable, no console errors

**Dependencies:** T2, T3
**Files likely touched:** `src/pages/index.astro`
**Estimated scope:** S

---

## T5: Lagado demo page, exhibit layout and nav

**Description:** Create `ExhibitLayout.astro` (sets `--color-accent` from the exhibit, shows the title, renders `ExhibitNav`) and `ExhibitNav.astro` (Demo / Essay / Making-of, current part marked). Create `src/pages/exhibits/[slug]/index.astro` with `getStaticPaths` over open exhibits, rendering a placeholder demo component from `src/demos/lagado/`.

**Acceptance criteria:**
- [ ] `/exhibits/lagado/` renders with title, nav and accent `#FF5F1F`
- [ ] No page is generated for `llull` or `hesse`
- [ ] The layout contains no Lagado-specific code

**Verification:**
- [ ] `npm run build`: `dist/exhibits/lagado/index.html` exists, no `llull`/`hesse` folders
- [ ] playwright-cli: computed accent colour on the title is `rgb(255, 95, 31)`

**Dependencies:** T4
**Files likely touched:** `src/layouts/ExhibitLayout.astro`, `src/components/ExhibitNav.astro`, `src/pages/exhibits/[slug]/index.astro`, `src/demos/lagado/LagadoPlaceholder.astro`
**Estimated scope:** M

---

## T6: Essay and making-of pages

**Description:** Create `essay.astro` and `making-of.astro` under `src/pages/exhibits/[slug]/`, rendering the matching MDX entry inside `ExhibitLayout` with Newsreader for body text. `getStaticPaths` throws a clear build error if an open exhibit is missing a part (using the T3 helper).

**Acceptance criteria:**
- [ ] `/exhibits/lagado/essay/` and `/exhibits/lagado/making-of/` render their placeholder MDX in Newsreader
- [ ] Temporarily removing `lagado/essay.mdx` makes the build fail with a message naming the exhibit and the missing part

**Verification:**
- [ ] `npm run build` passes (and fails as expected in the removal test, then restored)
- [ ] playwright-cli: computed font of the essay body is Newsreader; nav moves between all three parts

**Dependencies:** T5
**Files likely touched:** `src/pages/exhibits/[slug]/essay.astro`, `src/pages/exhibits/[slug]/making-of.astro`, `src/layouts/ExhibitLayout.astro`
**Estimated scope:** S

---

## T7: Page transitions and 404

**Description:** Add `<ClientRouter />` to `BaseLayout`, give the exhibit title a `transition:name`, and add a `src/pages/404.astro` in the same dark style.

**Acceptance criteria:**
- [ ] Navigating home → demo → essay → making-of happens without a full page reload
- [ ] The exhibit title morphs between parts; reduced-motion users get no animation
- [ ] `/exhibits/llull/` shows the 404 page

**Verification:**
- [ ] playwright-cli: a `window` marker set on the home survives navigation through all three parts
- [ ] `npm run build` + `npm run preview`: `/exhibits/llull/` returns 404

**Dependencies:** T6
**Files likely touched:** `src/layouts/BaseLayout.astro`, `src/layouts/ExhibitLayout.astro`, `src/pages/404.astro`
**Estimated scope:** S

---

## Checkpoint B
- [ ] Spec browser checks 1–5 pass at 390×844, then on desktop
- [ ] Screenshots shared with the operator

---

## T8: ADRs, journal, README

**Description:** Write `docs/adr/002-exhibit-content-model.md` and `docs/adr/003-typefaces.md` (with the `documentation-and-adrs` skill; ADR 001 Astro 7 already written in T1). Complete `docs/features/cabinet/journal.md` (created in T1) (what was built, key prompts, what changed, e.g. the move to neon accents). Update README's current state and commands.

**Acceptance criteria:**
- [ ] Both ADRs state context, decision, alternatives and consequences
- [ ] Journal entry dated 2026-11-10 (plus any later session), short and factual
- [ ] README commands match `package.json`

**Verification:**
- [ ] Manual read-through; links between docs resolve

**Dependencies:** T7
**Files likely touched:** `docs/adr/002-exhibit-content-model.md`, `docs/adr/003-typefaces.md`, `docs/features/cabinet/journal.md`, `README.md`
**Estimated scope:** M

---

## T9: Draft PR, Vercel connection, preview checks

**Description:** Commit, push the branch and open a draft PR to `main`. Guide the operator through importing `amderom/cabinet-of-ai` in Vercel. Re-run the spec browser checks on the preview URL.

**Acceptance criteria:**
- [ ] Draft PR open with a passing Vercel preview build
- [ ] Spec browser checks pass on the preview URL
- [ ] The operator has opened the preview on her phone

**Verification:**
- [ ] Vercel build log: Astro detected, static output, no errors
- [ ] playwright-cli run against the preview URL

**Dependencies:** T8
**Files likely touched:** none (git, GitHub, Vercel)
**Estimated scope:** S

---

## Checkpoint C — Phase 0 done
- [ ] All spec success criteria met
- [ ] Merge on the operator's go-ahead only, then write the real production URL into `docs/project.md`
