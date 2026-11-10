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

**Checkpoint A picks:** texture = the Engine (T-1). Essay = two Grandville illustrations from the 1838 Fournier/Furne edition, chosen by the operator from Gallica rather than from the shortlist (a scholar reading; the word machine with cubes "RIEN" and "GLOIRE"). Gallica's terms clash with the spec's source rule; the same edition is on the Internet Archive without conditions, so the scans may be taken from there instead (her call).

**Gallica after all.** After choosing the Internet Archive, the operator asked to use the images she had supplied: "It's fine, you can download them for non commercial use". The Archive search (OCR located Chapter V around leaf 56 of vol. 2) was stopped. Both images saved in the Lagado images folder; credit line "Source gallica.bnf.fr / BnF"; the commercial-use caveat and the Archive fallback recorded in `engravings.md`.

## 2026-11-10 — T2: image system and credits guard

The operator sent the full Grandville scholar scan (1210×1052) and both Gallica links (views 77 and 78 of ark btv1b86002890); the larger machine file she sent first was kept. The Engine diagram downloaded from Commons. Each of the four images is declared once in `exhibit.yaml → credits` (id, file, alt, caption, source, licence), with `texture: the-engine` and `hero: swift-portrait`. New pure helpers in `src/lib/credits.ts` (tested), and a build guard: the build stops on an uncredited file, an empty licence, a duplicate id, an unknown texture/hero id, or an image without alt text. Each failure triggered once on purpose and reverted. Listing the images folder with Node's file tools would have needed a new type package (ask first), so Astro's bundler lists the files instead.

## 2026-11-10 — T3: figures in the essay

`<Figure id="…" />` shows an image by its credit id (alt, caption and credit from `exhibit.yaml`); it finds the exhibit from the page's address. Phone versions (`phoneFile`) served below 640px wide, tested with a temporary setting. Placed: Grandville's word machine after the opening paragraph, the professor and his book before "Neurons and Neurotics". Images come in sizes from 360 to 1360px (no upscaling), lazy-loaded, with their space reserved (no jump). First look showed each scan's beige paper as a darker box inside the plate; fixed by lifting the paper to white and printing it on the plate colour (CSS filter + multiply). Essay words checked identical. No external requests, no console errors at 390, 375 and 1280px.

## 2026-11-10 — Checkpoint B and T4: texture

The operator, on her phone: delete the captions, keep only the credit; she asked where her Swift drawing and the texture were (texture not built yet; the drawing is the landing-page hero, shown in Part 2 as agreed). Captions removed from the metadata.

**T4:** the Engine diagram as a neon texture: the scan is inverted (white lines on black), tinted with the accent (multiply), then screen-blended onto the page so the black disappears: orange lines glowing behind the title. Placed at the top right, tilted, faded at its edges, clipped (no sideways scroll), never in the way of taps. Strong on the demo page, faint on the essay and making-of and gone before the text; on desktop it first ran over the "Making-of" tab, so it was made smaller, fainter and pushed further right there.

**Desktop alignment.** The operator: the glow and the texture "look super good" but feel disconnected on desktop (glow mid-left and drifting, Engine on the right). On desktop, pages with a texture now centre the glow on the engraving and keep its drift small, so the machine looks lit by it; phones unchanged (they already overlapped).

## 2026-11-10 — T5: three reading-page directions

On `explore/reading-pages` (never merged), the real essay in three directions at `/exhibits/lagado/explore-a|b|c/`: **A Editorial** (opening paragraph in the display serif with an orange drop cap, numbered sections § I–IV, two pulled quotations, engravings edge to edge on a phone); **B Fluid** (A plus scroll-driven CSS motion: sections, quotes and engravings settle in, plates "breathe", the Engine drifts up as you scroll; no GSAP, nothing moves with reduced motion or in browsers without support); **C Margin** (an annotated copy: engravings and quotations in the right margin on desktop, small and set to the right on a phone, quotes with an orange rule). Pulled quotations: Swift's "strictest computation", and the essay's own "it means one". Sent to the operator with the preview link.

**Exploration, round 2.** The operator: C has the better look but needs more orange; she wants soft animations but couldn't see any on B. Cause found: the build's CSS minifier folded `animation-timeline` into the `animation` shorthand, which browsers reject, so B never moved anywhere. Fixed: the reveal now uses a tiny IntersectionObserver script (headings, quotes and engravings fade and rise in; works in every current browser, nothing hidden without the script or with reduced motion), and the scroll-linked extras (plates settling, the Engine drifting) keep their timeline in a separate rule. C got orange marginalia: orange first letter, § numbers, hanging quotation marks, orange credits and plate edges, a fine orange margin rule on desktop, plus the soft motion.

## 2026-11-10 — Checkpoint C and T6: direction C built in

The operator: "I love C", but the fine orange margin line felt off. Agent's call (she asked for it): remove the line (it sat 30px from the text while the engravings started 60px away, so it read as a misalignment); the other orange marks carry the accent. C rebuilt cleanly in the shared reading-page styles (every essay and making-of): orange first letter, § I–IV section marks, pulled quotes with a hanging orange quotation mark (`<PullQuote>`, hidden from screen readers since they repeat the text), orange credits and plate edges, engravings as annotations set to the right on a phone and in the right margin from 1024px; soft reveal on scroll (Reveal.astro) plus plate settling and Engine drift where scroll timelines exist. Image download sizes reduced to match (280px margin, ~62% of the column on phones). Checked: words identical, article button above the fold at 375×667, all 8 elements reveal while scrolling, no sideways scroll, no external requests, no console errors.

## 2026-11-10 — T7: speed on a phone

Measured with a Chrome performance trace on the local build, essay page, phone viewport, Slow 4G and 4× slower CPU. First run: LCP 3.07 s (target 2.5 s), CLS 0.00. The largest element was the Engine texture (104 KB), downloading alongside five preloaded fonts. Fixes: texture served as a 480px AVIF (37 KB; it is faint and blended, so detail isn't needed), and only the regular font styles preloaded (italics load when first used). Result: **LCP 2.07 s, CLS 0.07** (the small shift is the italic font arriving; within the 0.1 target).

**T8:** ADR 005 (images declared once by id, build-enforced credits, CSS-tinted texture, annotated-copy reading pages, throwaway exploration branches, the Gallica exception) and README updated.

## 2026-11-10 — T9: draft PR

Draft PR amderom/cabinet-of-ai#5 opened; Vercel checks green. On the preview (operator's signed-in browser pane): both figures and the texture load, 8/8 reading-page elements reveal while scrolling, 4 credits listed, production `og:url`, only extra host `vercel.live` (preview toolbar, absent in production). Waiting for the operator's check on her iPhone (blend modes and scroll motion in Safari not yet verified on a real device) and her word to merge.
