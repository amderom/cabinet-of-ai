# Demo context: three plates, a parody banner, the original text

> Agreed with the operator on 2026-11-10 (idea-refine session). To be built in
> Phase 1.2 with the Lagado demo; it does not change Phase 0.

## Problem statement
How might a LinkedIn visitor on a phone understand in five seconds what an old object is, laugh at its start-up version, and still trust the scholarship, without reading before they play?

## Recommended direction
**One job per element.** The scrolling banner tells the start-up parody jokes. The three draggable plates show the real object. Page order: title → three plates → "Turn the cranks" → the machine.

The three plates (short by default; tap a plate to bring it forward, larger, to read it):

1. **The specimen:** a public-domain engraving, with the museum label as its caption (what it is, who imagined it, when). Starts on top so it is never hidden. If an early edition's illustration of the frame is usable (edition and licence to check), it goes here.
2. **The quote:** the author's own words, signed. For Lagado, Swift's professor promising that "the most ignorant person" can write books "without the least assistance from genius or study".
3. **The specifications:** the machine in figures, taken from the original text and laid out like a product spec sheet. For Lagado (to check against Part III, ch. 5): frame 20 feet square; 40 iron handles; 40 students, 6 hours a day; output: broken sentences in folio volumes. True facts in a tech format: the bridge between the serious plates and the parody banner.

Each exhibit also gets a **fourth part, "The original"**: the key passage of the author's text (a page or two, not the whole work), with its own link. Only for exhibits whose text can legally be published. The operator's essay stays separate, on the essay page.

## Key assumptions to validate
- [ ] A stranger can say what the object is after ~5 seconds on the page (test on a phone with someone who knows nothing).
- [ ] Plate texts stay readable at plate size (~150px wide on a phone); full text on tap. Test on a 375px phone.
- [ ] Four tabs (Demo · Essay · Making-of · The original) fit on one line at 375px; otherwise rename to "Source".
- [ ] Each original text has clear rights. Swift: public domain. Llull: needs a public-domain English translation (or the operator's own). Hesse: still in copyright, so no "The original" part, short quotations in the essay only.
- [ ] Every figure and quotation on the plates is checked against the original text before publishing.

## MVP scope (Lagado, Phase 1.2)
- **In:** three plates (specimen + museum label, quote, specifications) with tap-to-enlarge; parody lines in the banner; a "The original" page with Swift's passage from Part III, ch. 5; source and licence of every text and image in Lagado's metadata.
- **Out:** fact-check flips, a parody product tour, margin notes on the original.

## Not doing (and why)
- **Separate cards next to the plates** — two systems on one phone screen felt crowded; the plates carry the information instead.
- **Parody on the plates** — the banner owns the jokes; plates stay serious, so visitors can tell scholarship from parody at a glance (Project compass, principle 3).
- **"Then → now" plate** — it is the essay's argument; too flattened on a plate. Better as the hook into the essay.
- **Full chapters as "The original"** — too long on a phone; the key passage is enough.
- **Fact-check flips** — fun, but they hide the real context behind a tap. Parked in IDEAS.md.

## Open questions
- Name of the fourth tab: "The original", "Source" or "Primary text" (decide when testing width).
- Which English translation of Llull can be used?
- Is an early edition's diagram of the Lagado frame usable (edition, scan source, licence)?
