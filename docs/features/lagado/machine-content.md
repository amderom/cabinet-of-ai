# The Lagado machine: words and texts (T1 draft, for Checkpoint A)

> Draft by the agent on 2026-11-11, revised the same day after the author's feedback (version 2), for the author to edit. Nothing here is on the site yet.
> Edit freely: cross out, add, rename. Whatever survives goes into `src/demos/lagado/words.ts` (T2) and the plates (T8).

## How to read the word lists (version 2, after the author's feedback)

- **One word per block, 6 words per sentence:** **adjective · noun · verb · adjective · noun · adverb**. On a phone, **one sentence** in two lines of three; on desktop, a **6 × 6 square**, one sentence per row, one grammatical place per column. Turning any row or column flips its blocks to new words in place. Prototype: https://claude.ai/artifact/3dDzw1fjczqL1MksyoF8Tf
- The first noun is the one doing something, so it is always **plural** (so that "Comets *monetize*" works). The second noun can be plural or a mass noun (*Musick*, *Gunpowder*).
- **9 letters at most**, so every word fits a block on a 375px phone in Instrument Serif, with cranks on rows and columns (checked on screen, see the sample image).
- **Period spellings, sparingly: marked S.** Only 12 words, the easiest to read (*Musick, Publick, Politicks, Errour…*), about 1 word in 15, so a grid of 18 blocks shows about one or two at a time. Each one is printed that way in Swift's own *Voyage to Laputa* (same Wikisource edition as The original), checked automatically; *Opticks* is the title of Newton's book (1704). Every other word is in modern spelling.
- **⚡ = start-up / AI jargon, mostly in adjectives and verbs** (about 1 in 5 of each), a little in nouns (1 in 10). So the nouns keep the 18th-century world and the adjective or verb carries the joke. About every other row gets one modern word.
- **The domain in brackets** helps the machine spot "good combinations" (see the end).

**Totals:** 40 adjectives, 44 subject nouns, 40 verbs, 46 object nouns, 20 adverbs = **190 words**. Jargon: 29 (8 adjectives, 4 subject nouns, 9 verbs, 5 object nouns, 3 adverbs). Period spellings: 12.

---

## Places 1 and 4: adjectives, 40

| Domain | Words |
|---|---|
| Learning (Swift's passage) | Learned, Ingenious, Laborious, Noble, Exalted, Ignorant, Broken, Curious |
| Astronomy | Celestial, Lunar, Solar, Eclipsed |
| Natural philosophy | Mechanick S, Electric, Gilded |
| Natural history | Venomous, Hairy, Pickled |
| Weather and humours | Inclement, Sanguine, Feverish, Doleful, Wretched |
| Painting and letters | Sublime, Pastoral, Satirical, Tuneful, Shrill |
| Politicks and home | Publick S, Domestick S, Factious, Loyal, Pious |
| ⚡ Start-up / AI | Scalable ⚡, Agentic ⚡, Viral ⚡, Seamless ⚡, Lean ⚡, Pre-seed ⚡, Stealth ⚡, Unbundled ⚡ |

## Place 2: subject nouns (always plural), 44

| Domain | Words |
|---|---|
| Swift's Academy | Flappers (the servants of Laputa who flap their masters awake), Pupils, Scribes, Sages, Doctors |
| Astronomy | Comets, Planets, Orreries, Quadrants, Eclipses |
| Natural philosophy | Magnets, Vials, Monads, Fluxions, Vapours |
| Natural history | Spiders, Cucumbers, Hogs, Bees, Monkeys, Oysters |
| Physick | Surgeons, Humours, Leeches |
| Musick | Fiddles, Flutes, Trumpets, Fugues, Sonatas |
| Painting and letters | Painters, Syllables, Nouns, Poets, Odes, Satires |
| Politicks | Senators, Statesmen, Ministers, Factions, Whigs, Tories |
| ⚡ Start-up / AI | Unicorns ⚡, Founders ⚡, Chatbots ⚡, Investors ⚡ |

## Place 3: verbs (agree with a plural), 40

| Domain | Words |
|---|---|
| Swift's projects | extract, calcine, soften, condense, propagate, contrive, improve |
| Science | measure, observe, discover, compute, dissect, distil, magnify |
| Nature | breed, spin, devour, petrify |
| Physick | cure, purge, embalm |
| Arts and letters | teach, rhyme, varnish, ridicule, flatter, confound |
| Politicks | govern, besiege, fortify, bribe |
| ⚡ Start-up / AI | disrupt ⚡, monetize ⚡, pivot ⚡, scale ⚡, onboard ⚡, upsell ⚡, iterate ⚡, prompt ⚡, gamify ⚡ |

## Place 5: object nouns (plural or mass), 46

| Domain | Words |
|---|---|
| Swift's projects | Sun-beams S (Swift prints *sun-beams*), Cobwebs, Gunpowder, Marble, Ice, Acorns, Silk |
| The passage itself | Genius, Study, Poetry, Theology, Laws, Politicks S |
| Astronomy and philosophy | Gravity, Eternity, Vacuum, Chaos, Magnetism, Zodiack S, Opticks S |
| Musick | Musick S, Harmony, Discord |
| Painting and letters | Colours, Pigments, Wit, Nonsense, Sonnets, Satire |
| Physick and humours | Spleen, Bile, Colick S, Errour S |
| Politicks and money | Virtue, Liberty, Commerce, Traffick S, Bubbles (the South Sea Bubble, 1720), Lotteries |
| ⚡ Start-up / AI | Synergy ⚡, Data ⚡, Growth ⚡, Tokens ⚡, Bandwidth ⚡ |

## Place 6: adverbs, 20

| Words |
|---|
| intirely S (Swift: "intirely changed"), softly (the pupils "read the several lines softly"), hourly, nightly, gravely, wisely, sweetly, backwards, slowly, loudly, privately, gratis, forever, daily, twice, abroad, eternally, virally ⚡, remotely ⚡, on-chain ⚡ |

---

## Samples: what the rows could look like

Written by hand to show the mix; the real machine is random, so some sentences will be better and many more absurd. About every other sentence carries a modern word; a period spelling turns up every second or third sentence.

### Sample sentences (adjective · noun · verb · adjective · noun · adverb)

1. Doleful · Comets · monetize · Celestial · Musick · softly
2. Ingenious · Spiders · spin · Pastoral · Cobwebs · nightly
3. Pre-seed · Cucumbers · extract · Solar · Sun-beams · gratis
4. Hairy · Senators · propagate · Satirical · Nonsense · abroad
5. Pickled · Fiddles · purge · Lunar · Gravity · twice
6. Agentic · Hogs · compute · Pious · Eternity · hourly
7. Broken · Poets · besiege · Electric · Opticks · backwards
8. Laborious · Bees · iterate · Sublime · Theology · daily
9. Factious · Statesmen · condense · Gilded · Virtue · privately
10. Seamless · Unicorns · varnish · Inclement · Chaos · eternally

### When a sentence lights up (good combinations)

Proposed rule, kept simple:
- **Same field:** the two nouns share a domain (*Comets … Gravity*, *Fiddles … Harmony*, *Founders … Growth*).
- **One of Swift's own projects** turns up: *extract · Sun-beams* (from cucumbers, Laputa ch. 5), *calcine · Ice* (into gunpowder), *soften · Marble* (for pillows and pincushions), *Spiders · spin* (silk), *Hogs … Acorns* (ploughing with hogs). A small label could say which project, e.g. "Project no. 1: sun-beams out of cucumbers".

---

## The three plates

### 1. The specimen (museum label, under the Engine diagram)

> **The Engine**
> Word frame of the Academy of Lagado.
> Imagined by Jonathan Swift, *Gulliver's Travels*, Part III (1726). Gulliver draws it "as in the figure here annexed".
> Wooden blocks covered with words, turned by forty handles. A satire of the projects of the Royal Society.

Short version on the small plate: **The Engine · Academy of Lagado · Swift, 1726.**

### 2. The quote

> "…the most ignorant person, at a reasonable charge, and with a little bodily labour, might write books in philosophy, poetry, politicks, laws, mathematicks, and theology, without the least assistance from genius or study."
>
> — The professor of the Academy of Lagado, in Jonathan Swift, *Gulliver's Travels* (1726)

Short version on the small plate: *"the most ignorant person … might write books … without the least assistance from genius or study."*

### 3. The specifications (start-up product sheet)

Every line traced to a sentence of [original-passage.md](./original-passage.md) (quoted in brackets).

> **THE ENGINE** · Spec sheet · v1.0 (1726)
>
> | | |
> |---|---|
> | Use case | "Improving speculative knowledge, by practical and mechanical operations" |
> | Form factor | 20 ft square ("twenty feet square") |
> | Hardware | Wooden bits "about the bigness of a die", linked "by slender wires" |
> | Vocabulary | "All the words of their language, in their several moods, tenses, and declensions" |
> | Controls | 40 iron handles ("forty fixed round the edges of the frame") |
> | Team | 40 pupils: 36 readers, 4 scribes ("six and thirty of the lads" read; "the four remaining boys, who were scribes") |
> | Human in the loop | Yes: pupils read "softly" and keep "three or four words together, that might make part of a sentence" |
> | Uptime | 6 hours a day ("Six hours a day the young students were employed") |
> | Output | Broken sentences, in large folio ("several volumes in large folio … of broken sentences") |
> | Pricing | "A reasonable charge" |
> | Requirements | No genius. No study. "A little bodily labour" |
> | Roadmap | 500 frames across Lagado, "if the publick would raise a fund" |
> | IP | "Sole inventor" |

Small plate version: the first five or six lines; the full sheet when tapped.

---

## Parody banner lines (pick 6–10)

1. Trained on all the words of the language
2. Human in the loop: 36 readers, 4 scribes
3. No genius. No study. A little bodily labour
4. Now hiring: 40 pupils, six hours a day
5. Shipping broken sentences in large folio since 1726
6. Seeking a publick fund for 500 frames
7. Disrupting the Royal Society since 1726
8. Sole inventor. Rivals in Europe welcome to steal
9. Speculative knowledge, at a reasonable charge
10. Hallucinations, hand-bound
11. Turn the cranks. Write any book.
12. Founded in Lagado. Funded by nobody, yet

---

## Typeface

Instrument Serif, already on the site (the author's choice: no new typeface). The sample image shows the longest words at 375px.

## Questions for the author

1. ~~The mix~~: approved (2026-11-11).
2. Too many words of one domain? Missing domains (e.g. more theology, law, cookery)?
3. Light-up rule: same field + Swift's own projects. Keep both?
4. Which banner lines stay?
