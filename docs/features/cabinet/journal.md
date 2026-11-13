# Build journal — Cabinet (site foundations)

Short, factual, dated entries. The public making-of is written from this journal.

---

## 2026-11-10 — Phase 0: spec, plan, scaffold (T1)

**Built:** Phase 0 spec (`SPEC.md`), plan (`tasks/`), and the Astro project scaffold: Astro 7.4, React, MDX, Vitest, type checking. Dev server, build, tests and type check all pass on Node 26.

**Key instructions from the operator:**
- "Three fonts sounds like a lot" → down to two (Geist for interface, Newsreader for essays); the vintage inscription face waits for the Lagado demo.
- Rejected the first, museum-like accent colours: wanted "very modern and more punchy". The direction she stated: vintage content, super-modern look, an immersive experience that makes people think "I didn't know history could be this cool". People back then are like people now, not the other way round. → neon accents on near-black (Lagado `#FF5F1F`, Llull `#FF2D55`, Hesse `#00E0FF`); the accent rule in `docs/project.md` was reworded with her OK.
- "Please remember to explain trade-offs": asked for concrete risks of each option, including the recommended one.

**What failed or changed:**
- The project docs said Astro 6.3, "validated" the day before. The install showed Astro 7 has been out since June 2026 and current add-ons require it. The agent stopped, explained, and the operator chose Astro 7 (ADR 001), an approved exception to the 6-month rule.
- A worry about Node 26 compatibility turned out to be unfounded once checked (one command). Lesson: check before raising a risk.

**Decisions:** two typefaces; neon accents; Astro 7 (ADR 001); `@astrojs/check` added; placeholder pages stay bare until Phase 1.1.

## 2026-11-10 — T2: design foundations

**Built:** Tailwind 4 with design tokens (near-black `#0A0A0B`, paper text, muted grey, per-exhibit `--accent`), Geist + Newsreader via Astro's built-in Fonts API (downloaded at build, served from the site; no font CDN for visitors), `BaseLayout`, and a temporary design-sample home page for the operator's review.

**Changed:** fonts are no longer hand-copied woff2 files (as the spec first said) but handled by Astro's Fonts API: same outcome, nothing to maintain by hand.

**Caught:** a missing space between inline words ("semibold,black"), caused by Astro 7's new HTML compression. Fixed with `{" "}`; the risk was already listed in ADR 001.

## 2026-11-10 — T2 redone: the "Curio" direction

**What happened:** the operator reviewed the first T2 sample (Geist + Newsreader, rounded cards) and said it still looked "very classical… a bit web 2.0", asking for something "super modern, really fun", pointing back to her references.

**Process:** the agent screenshotted the five reference sites on a phone, then built three throwaway mockups: A "Signal" (black lab, falling lines, condensed caps), B "Pop" (full-colour screens, chunky type, floating cards), C "Glow" (black, accent glow, grain, giant serif). Her answer: C for the serif and colours, B's floating cards and scrolling banner for fun: "the playfulness of B, and the elegance of C".

**Iterations on the mix ("Curio"):** cards became draggable engraving plates ("specimen cards" of the cabinet). Feedback 1: cards must never go over text and buttons → plates confined to their own area, tested by dragging every plate to every corner on a large and a small phone (a first test script was invalid, synthetic events never moved the plates; redone with real mouse drags; it caught a 4px overflow on the small phone). Feedback 2: harmonise colours → glow made only from the accent (the pink mix clashed), one warm cream family for text, paper and greys. Feedback 3: labels smaller → 10px (a CSS specificity bug had made the essay label 18px in the mockup).

**Built:** Instrument Serif + Inter Tight + IBM Plex Mono via Astro's Fonts API, Curio tokens, glow + grain in the base layout, `label` utility, `Ticker` component, favicon, new design sample. Plates are deferred to the exhibit pages (Phase 1.x).

## 2026-11-10 — T3: exhibits as content

**Built:** three content collections (`exhibits`, `essays`, `makingOfs`) read from one folder per exhibit, keyed by the folder name. Lagado is open, with a placeholder essay and making-of; Llull and Hesse are sealed, with metadata only. Helpers in `src/lib/exhibits.ts` (cabinet order, open only, "which open exhibit is missing a part"), written test-first: the tests were seen failing, then passing.

**Checked:** a bad accent colour or an unknown status stops the build with a clear message. Footnotes in essays render properly with Astro 7's new Markdown engine (Sätteri), which was a known risk: tested with a throwaway page, then removed.

**Fixed:** Astro 7 ships a newer Zod, where `z.string().url()` is deprecated; switched to `z.url()`.

**Context:** before this task the operator asked what the design sample page was ("an exhibit as a hero, then a menu, then the essay"). It was a swatch sheet, not a real page; the agent should have said so more clearly. The real pages (home, Lagado demo, essay, making-of) arrive in T4–T6.

## 2026-11-10 — T4: home page from the collection

**Built:** the design sample is gone; the home page now lists every exhibit straight from the content folders, in cabinet order, each in its own accent. Lagado links to its page (which arrives in T5); Llull and Hesse show as "Sealed", not clickable. No exhibit name is written in the page. Visible "Placeholder" label; the real cabinet design is Phase 1.1.

**Caught:** the local preview showed an empty list because it had been started before the content folders existed; restarting it fixed it (the built site was fine all along).

## 2026-11-10 — T5: Lagado demo page, exhibit layout and nav

**Built:** a shared exhibit layout (accent colour, title, tagline, "Placeholder · Demo" label, link back to the cabinet) and a three-part menu (Demo / Essay / Making-of, current part in the accent). The demo page is generated only for open exhibits; each exhibit's demo lives in `src/demos/<slug>/Demo.astro` and is picked by its folder name, so the page holds no Lagado-specific code. Lagado's demo is a placeholder box.

**Checked:** only `/exhibits/lagado/` is built (no Llull or Hesse pages); removing Lagado's demo stops the build with a message saying which file to add; at phone size the active menu item is Lagado orange `rgb(255, 95, 31)`, no sideways scroll, no errors.

**Changed:** the plan checked the accent on the title; the title stays cream (Curio look) and the accent shows on the active menu item instead, so that is what the check measures.

**Caught:** the local preview again showed new pages half-styled; the preview server misses styles in files created after it started. The built site was correct. Restarting the preview fixes it; worth knowing when adding exhibits.

## 2026-11-10 — Demo context (idea-refine) and T6: essay and making-of pages

**Discussion:** the operator worried that visitors landing on the demo would have "no idea what is going on", and wanted both her essay and the author's original text. After an idea-refine session: the scrolling banner carries the start-up parody; the three draggable plates carry the real object (specimen engraving with museum label, the author's quote, a spec sheet built from the original text); a fourth part "The original" holds the key passage when its rights allow (not Hesse). Her own refinements drove it: putting the information on the plates rather than extra cards, then keeping all jokes in the banner. Saved in `docs/ideas/demo-context.md`, linked from Phase 1.2; fact-check flips parked in IDEAS.md.

**Built (T6):** essay and making-of pages for every open exhibit, inside the shared exhibit layout, with reading styles (Inter Tight body, Instrument Serif titles, accent links, footnotes set apart). A shared helper builds their paths and stops the build if any open exhibit lacks a part.

**Checked:** removing Lagado's essay stops the build with "lagado is open but has no essay (add …/essay.mdx)"; at phone size the menu moves Demo → Essay → Making-of → Demo, fonts are right, the footnote renders, no sideways scroll, no errors.

## 2026-11-10 — T7: page transitions and 404

**Built:** Astro's `ClientRouter` in the base layout, so pages change without a full reload; the exhibit title carries a shared `transition:name`, so it morphs from the home list into the exhibit page and between its three parts. A dark "Still *sealed*" 404 page with a way back to the cabinet; sealed exhibits like `/exhibits/llull/` land there.

**Checked:** a marker set on the home page survives Home → Demo → Essay → Making-of → Home (no reload); each page keeps its accent; `/exhibits/llull/` returns status 404 with the styled page; with reduced motion requested, Astro's built-in rule turns all transition animations off (0 running).

## 2026-11-10 — Checkpoint B and T8: docs

**Checkpoint B:** all spec browser checks pass at 390×844 and 1280×800 (fonts, 10px labels, no sideways scroll, no external requests, navigation without reload, 404 for sealed exhibits). Phone screenshots sent to the operator; she approved moving on.

**T8:** ADR 002 (exhibits as content collections, one folder per exhibit, build fails on missing parts) and ADR 003 (Instrument Serif, Inter Tight, IBM Plex Mono via Astro's Fonts API; Geist + Newsreader rejected). README updated with the current state, commands and structure.

**Phase 0 summary for the making-of:** the plan held, but two things changed on the way: Astro 7 instead of 6 (ADR 001) and the whole visual direction (Curio, after the first sample looked "web 2.0"). The demo-context discussion (plates, banner, "The original") shaped Phase 1.2 before it started.

## 2026-11-10 — T9: draft PR and Vercel

**Done:** branch pushed, draft PR amderom/cabinet-of-ai#1 opened. The operator imported the repo in Vercel herself (guided through the browser pane). Gotchas worth keeping for the making-of: Vercel's page now leads with its AI builder, "Import Git Repository" sits lower; the Vercel GitHub app only had access to an older repo (`cabinet-of-ai-kit`), so access had to be added; "Framework" is now called "Application Preset" and guessed "Other" because `main` had no site yet; it was set to Astro so the first production build failed safely ("astro: command not found") instead of publishing the private docs. An older Vercel project owns the `cabinet-of-ai` name, so this one is `cabinet-of-ai-gx8a` for now.

**Preview checks** (in the operator's signed-in browser pane, since previews are protected by Vercel login): Vercel build passed; home, demo, essay, making-of render; navigation without reload with the accent kept; `/exhibits/llull/` returns 404 with the sealed page; fonts loaded from the site itself, labels 10px, no sideways scroll. Only extra host: `vercel.live`, Vercel's preview toolbar, absent in production.

## 2026-11-10 — Phase 0 done: merged and live

The operator checked the preview on her phone and said "Seen it, merge". PR amderom/cabinet-of-ai#1 merged into `main`; Vercel deployed production to https://cabinet-of-ai-gx8a.vercel.app. The spec browser checks re-run on production (phone and desktop): all pass, no external requests. Production URL recorded in `docs/project.md`. Noted for Phase 1.1: the mono label font is not preloaded, so labels flash in a fallback font for a moment on first load.

## 2026-11-13 — Phase 1.2 part 3: link-preview images

Spec and plan approved ("Approve, go on"). Three directions made as HTML in `design/previews/lagado-options.html` and captured at 1200 × 627 with playwright-cli (file:// is blocked in playwright-cli, so the repo was served locally): A, the machine's own sentence (*Doleful Comets monetize Celestial Musick softly*) glowing in its line field; B, Grandville's word machine on a cream plate; C, the author's Swift drawing. First pass of C inverted the drawing to cream on black, which turned the black coat and shadow into white blobs; redone as the drawing on a tilted cream plate. The operator, before seeing the mock card: "I already know I like the third best, you can move on" (also her yes to using the drawing). Site image made in the same language: "Cabinet of AI", "The ideas behind AI are centuries old. Play with them.", the Swift plate in front of two sealed plates edged in Llull's and Hesse's colours. Wired: `preview` field and credit in `exhibit.yaml`, `src/lib/preview.ts` (5 tests) refusing a wrong size or missing alt, home page passes the site image. Checked: the four Lagado pages and home carry `og:image` with an absolute URL, 1200 × 627, alt and `twitter:card`; 404 has none; the served PNGs are byte-identical to the designed ones (~200 KB each); an unknown `preview` id stops the build; both cards read at 390px in a plain feed mock. 94 tests, 0 type errors, build OK. ADR 007.

The operator approved both images ("Ok perf") and asked for rounded plate corners: done (18px on the Lagado plate, 16px on the site's three plates), both recaptured at 1200 × 627.

## 2026-11-13 — Phase 1.2 done

Preview images merged (PR amderom/cabinet-of-ai#9) and descriptions lengthened (PR amderom/cabinet-of-ai#10). Post Inspector shows the full card for home and the four Lagado links; the operator confirmed a real draft post shows the sharp image. Next: Phase 1.3, the cabinet.

## 2026-11-13 — Phase 1.3 spec, plan and Checkpoint A prototype

Spec approved ("Approve, go on"); open questions default to the recommendations (sound toggle only; engraving if its licence checks out; site image decided at the end). The spec names the tension between "the homepage looks like a real cabinet" and "vintage is content, never look", and proposes a cabinet that is a cabinet in shape and gesture but built like the Lagado machine. Clickable prototype published as a private artifact (https://claude.ai/artifact/61s3wdgRmFVMVzDGAKVtE3) with three directions: 1 Line (glowing line drawing, doors fold flat, outlined drawers), 2 Monolith (solid black object, orange light in the seam, panels slide apart, luminous strips), 3 Engraving inside (a plain shape lifts to show an engraving, drawers as modern tabs; stand-in engraving: Swift's Engine, since fetching the Museum Wormianum needs the operator's OK). Checked at 390px in playwright-cli: each opens on tap, sealed drawers shake, the Lagado drawer leads on, no sideways scroll, no console errors. First pass of direction 3 set titles beside their labels in pills, which wrapped badly; stacked as in the others. Dates on the drawers (Llull c. 1305, Hesse 1943) to be checked against sources before they go live.

**Checkpoint A, round 1 rejected.** The operator: "not loving any of these"; the cabinet is "very literal", "unfinished and unpolished", "doesn't match the rest of the vibe of the website, which is glow, engraving texture"; and Lagado references (the orange seam, the orange handles) "won't work for other exhibits". It doesn't have to be a literal cabinet; she wants it sleek and techie. Reference sites re-studied in the browser pane: DeepBook (a field of dashes moving in waves, "+" corner marks), Grail (a giant title over a swarm of floating cards); theothersideoftruth.com never got past its yellow loading screen in the pane (its text shows a slash-led index of chapters, dates and places). **Round 2 prototype** (https://claude.ai/artifact/Gfk2Xj13NuZGfMskCgeYp6), all exhibit-neutral (the page glow is cream until an exhibit is chosen, then takes that exhibit's colour): A Specimens (exhibits as floating plates in a vitrine with corner marks; sealed plates show a static pattern in their colour); B Timeline (an editorial index ordered by the year of each idea, ending at "2026, You are here"); C Signal (a live field of dashes where each exhibit is a pulse; tapping sends a ripple in its colour and opens a small card). Fixed before publishing: a plate covering another's title; the engraving drawn over the active row's title.

**Specimens chosen; built into the home page (T2, T3).** The operator chose "A · Specimens". Spec and plan rewritten for it (a vitrine of floating plates; no doors, no drawers, no GSAP). `src/cabinet/specimens.ts` (12 tests): one plate per exhibit in order, only open ones linked, number and year labels, the exhibit's colour as r g b, and hand-placed spots in the case for 1 to 6 plates (the build stops at 7 with a message). An optional `year` field per exhibit (Lagado 1726; Hesse 1943; Llull "c. 1305" marked as a placeholder to check). `Vitrine.astro` renders plain links (Lagado) and plain text (sealed), each plate carrying its exhibit's texture engraving, small (AVIF, 360px), or a static ring pattern when sealed; `vitrine.ts` brings a plate forward, lights the glow in its colour, shows "Enter the exhibit →" or "Opening later in the series", shakes a sealed plate tapped again, puts it back on a tap outside or Escape; re-runs after page changes. Found on the way: **an older bug**: the site's glow always used the default orange, whatever an exhibit's colour, because `--color-accent` was read once at the page root and ignored the exhibit's `--accent` set on the body; invisible while only Lagado was open, Llull would have glowed orange. Fixed by re-reading it on the body (Lagado unchanged: still orange). The glow's deep tone was also a fixed dark orange; it is now a variable, and the home page mixes it from the current colour, so the resting glow is cream. Also fixed: the Glass Bead Game plate covered Llull's title (earlier plates now sit on top); on desktop the cream glow made a grey haze (fainter there). Checked in Edge: 390, 375 and 1280px, no sideways scroll, no console errors; choose Lagado → Enter → `/exhibits/lagado/`; back → home works again; choosing Hesse turns the glow cyan. 106 tests, 0 type errors, build OK.
