# Build journal — The Lagado Engine

> Short, dated, factual entries. The public making-of is written from this journal and validated by the operator.

## 2026-11-10 — Phase 1.1 spec

**Done:** `/spec phase 1.1` wrote SPEC.md for the shared exhibit page, with Lagado's real essay.

**Key instruction from the operator:** do not reproduce the journal article (it belongs to the journal). Use her own short, playful essay "Dice and Device: The Lagado Engine" instead, say on the page that it is a condensed, light version, and put the link to the real article high up so people actually see it.

**Decisions:** research reference stored in the exhibit's metadata so every part can link to it; one designed preview image per part, rendered once and committed (no new library); honest teaser on the empty demo page and a short note on the making-of page until Phase 1.2. The article is in French, so the link says so.

**Spotted for 1.2:** the essay counts 36 students writing; the demo-context notes say 40. To check against Swift before the specifications plate.

**Changed the same day:** preview images moved to the end of Phase 1.2, because they're easier to design once the machine and the site's look exist (the operator's call). One image per exhibit, not per part; LinkedIn's text line under the image says which part. The first mockups (name + glow on near-black) were rejected; the design starts fresh. Phase 1.1 keeps only the hidden page title and description. SPEC.md and STARTUP.md updated.

**Spec approved.** LinkedIn URL given; byline, first-person note and current tagline kept; draft wordings accepted.

**Design rule added:** engravings are the common thread of the whole site (plates, soft neon background texture in the exhibit's colour, cabinet). Recorded in docs/project.md → Design references with the operator's yes; engraving work scheduled in Phases 1.2 and 1.3 of STARTUP.md. Not in 1.1: the background layers already exist, so the texture adds a layer without rework.

**Phase 1.2 reorganised:** images handled as a whole, once for the site (engravings, essay illustrations, background texture), then the machine (in the engraving language), then the preview images. The operator asked "why before the machine?"; answer: the machine should share the engraving style; fallback if image sourcing drags on is temporary visuals. Written into STARTUP.md.

## 2026-11-10 — Build: T1 and T2

**T1:** research reference (`research` in the exhibit metadata, schema unit-tested), descriptions on essays and making-ofs, site settings (name, LinkedIn, byline).

**T2:** the operator's essay on the essay page, word-for-word (checked automatically against her original; only curly quotes, apostrophes and italic titles changed). Byline, "About this essay" note and "Read the full article (in French) ↗" button under the title. Measured: the button fitted at 390×844 but not at 375×667, so the essay and making-of pages got a smaller exhibit header (giant title kept on the demo page); it now ends at 561 of 667 px. The dev server couldn't run twice in the same folder (another session had it), so checks ran on the built site.

## 2026-11-10 — Build: T3 to T6

The operator asked to stop the old local server left running by an earlier session (it blocked a second one); stopped, then "keep going".

**T3:** shared exhibit frame: "Read the full article (in French) ↗" and "Follow the series on LinkedIn ↗" on every part (plain links, no LinkedIn widget), credits block (checked with a temporary test credit, then removed), "Play with the machine →" on the essay and making-of, footer. Older links (header, tabs, byline) enlarged to finger size (44px); the article button still fits on the small phone (635 of 667 px).

**T4:** every page has its own title, description, canonical URL and Open Graph tags with absolute URLs (site address set in the config); no image tags until Phase 1.2. The label font is now preloaded (the flash noted at the end of Phase 0). The 404 page claims no address of its own.

**T5:** demo teaser ("In the workshop · The machine is being assembled", link to the essay) and a two-line making-of note.

**Checkpoint B:** all checks pass at 390×844, 375×667 and 1280×800: no sideways scroll, no request leaving the site, all links correct. **T6:** ADR 004, README.

## 2026-11-10 — T7: draft PR

Draft PR amderom/cabinet-of-ai#3 opened; Vercel checks green. On the preview (in the operator's signed-in browser pane): all three Lagado parts return 200 with their own titles and production `og:url`, no image tags, LinkedIn link present, sealed Llull returns 404, no sideways scroll at phone width and no request leaving the site. Waiting for the operator's phone check before merge.

## 2026-11-10 — Preview feedback

The operator, on the preview: the note and the essay's first line felt squashed; cream text on the orange glow felt hard to read; the essay page "a bit bland", she'd like it "more fluid". **Fixed in the PR:** clear space after the note; on reading pages the glow stays behind the title and fades out before the text (in a clipping frame, since a scrolling glow first caused sideways scrolling). **Parked as ideation** at the start of Phase 1.2 part 1, with the engravings: stronger opening, large pulled quotations, gentle scroll motion, engraving vignettes.

## 2026-11-10 — Phase 1.1 done: merged and live

The operator checked the preview on her phone: "Checked, merge it". PR amderom/cabinet-of-ai#3 merged; production serves the essay, demo teaser and making-of note with their own titles and production URLs; sealed Llull returns 404. LinkedIn Post Inspector on the production essay URL: title, description and type (article) read correctly, canonical URL correct; only warning "no og:image", expected until Phase 1.2. Also noted for 1.2: LinkedIn finds no author or publish date (`article:author` / `article:published_time` could be added with the images). The essay is live but not announced.

## 2026-11-10 — Phase 1.2 part 1 spec

`/spec phase 1.2 part 1` (images and engravings). The operator chose: the agent shortlists public-domain engravings and she picks; one neon engraving texture per exhibit (not one shared); three reading-page directions built as real pages on a preview link (not screenshots); 1–3 engravings inside the Lagado essay. One spec in five gated steps: shortlist → image system with automatic credits and a build guard against uncredited images → essay illustrations → texture → reading-page ideation, then build. No new dependency (Astro's own image tool).

**Plan amended at the operator's request:** images can have a phone version (different crop) and their layout differs between phone and desktop (built in T2–T3, layout settled with the reading-page direction); each exhibit gets a hero image for its landing page, distinct from the texture: picked in T1, declared in T2, displayed in Part 2 (written into STARTUP.md).

**The hero is the operator's own drawing.** She shared her ink drawing of Swift (wig in curling lines, cross-hatched shadow) and said: "The hero has to be my drawing of Swift". It clashed with the rule "never use the operator's photos or drawings" (written for the Vibe Project mood material); the rule was reworded with her yes in AGENTS.md and docs/project.md. The drawing is saved in `src/content/exhibits/lagado/images/swift-portrait.jpg` (phone photo, 1247×1663), to be credited in T2 and shown on the landing page in Part 2, as light lines on black. A flat scan would give cleaner lines later.

## 2026-11-10 — T1: engraving shortlist

Searched Wikimedia Commons (incl. Library of Congress and Internet Archive scans) with a paced script, since Commons rate-limited quick requests; The Met's public API turned out to be retired. Found the 1726–27 diagram of "the Engine" (the word frame itself), Gavarni's Academy of Lagado, Llull's figures, and the *Battle of the Books* frontispiece with a spider and a bee in the window. Licence read on each file's page; excluded a commercial archive, a dealer's print, a tiny monkey engraving and an off-topic dice scene. Shortlist in `engravings.md`, previews sent to the operator.
