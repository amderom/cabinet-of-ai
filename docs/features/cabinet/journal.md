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
