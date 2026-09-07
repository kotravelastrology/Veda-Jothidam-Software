# S10-F — Yuddha Bala (Planetary War)

Status: Yuddha Bala's war-detection/winner mechanism is now fully resolved and sourced. Its *magnitude* is honestly derived from each planet's still-partial Shadbala total (Ayana Bala and most Cheshta Bala remain unresolved), so `shadbalaTotal` continues to refuse a final figure. Working tree only — no commit/push/backup (no git repository yet). Per the standing instruction, both reference products were checked before/alongside this pass.

## Source check — a genuine three-way divergence, resolved with a documented default

Ch.27 v.20 (file p.233-234, already read in S10) only states the *mechanism*: "Should there be a war between the starry planets (i.e. between 2 planets from Mars to Saturn), the difference between the Shad-balas of the two should be added to the victor's Shad-bala and deducted from the Shad-bala of the vanquished." It does not itself give a war-detection orb or winner rule, so this admitted BPHS copy's other passages on planetary war were searched:

- **v.9, Ch.79/Sannyasa Yoga context (file p.776-777, printed p.769-770) — Parashara's own verse**: "There is planetary war if Mars, Mercury, Jupiter, Venus and Saturn are together (within one degree of each other). Venus is the conqueror whether he is in North or South, but amongst the other four only one, who is in the North is the Conqueror." This is the same five "starry planets" Ch.27 v.20 itself scopes to (Mars-to-Saturn, no luminaries) — the two passages agree on scope even though they're in different chapters.
- **Translator's own general Notes (file p.100, in the unrelated "Judgement of Houses" chapter)**: a *different* rule — "same degree" orb, winner = lesser longitude, and explicitly says "the luminaries do enter into war" — directly contradicting both v.9's winner criterion (latitude, not longitude) and its scope (luminaries excluded). **Not adopted**: it contradicts Parashara's own verse and Ch.27's own stated scope, and is presented as the translator's general aside rather than a verse.
- **A cited modern secondary source (the late C.G. Rajan), same page**: same-longitude-to-the-minute orb, requires the two planets share the same latitude hemisphere, and declares the one with the *higher* latitude magnitude the winner — with a full worked example (Mars vs Saturn, 03:47 hrs, 15 Dec 1925). The translator explicitly endorses this: "We need not rush to the conclusion that Mr Rajan's version is contrary to Parashara's... For practical purposes, we are well guided by the elaboration of Mr. Rajan."

**Decision**: adopt v.9 (Parashara's own verse) as the default — it agrees with Ch.27's own stated scope, and its "higher-latitude-wins" *direction* is the same one Rajan's endorsed refinement uses (Rajan only tightens the orb and adds a same-hemisphere precondition, which the translator frames as compatible, not contrary). The 1-degree orb is v.9's own literal figure, kept over Rajan's tighter "same minute" refinement since v.9 is Parashara's own words. The contradicting translator's-Notes rule (lesser-longitude-wins, includes luminaries) is recorded here as a known, deliberately-not-adopted divergence, per this project's source-divergence policy.

**Computational cross-check**: reproduced Rajan's own worked example with a modern sidereal-Lahiri ephemeris (Mars vs Saturn, 03:47 hrs, 15 Dec 1925). Book states Mars +0°21' N, Saturn +2°25' N, Saturn declared winner. Computed: Mars +0.36°, Saturn +2.08° — both positive (North), Saturn clearly the higher of the two, reproducing the same winner the book declares, even though the exact degree/minute figures differ slightly (expected for a ~100-year-old source using older tables/precession models, the same kind of small discrepancy already seen and accepted elsewhere in this project, e.g. S6's Bhava verification).

## Implementation

- `src/chart/planetaryWar.js` (new): `WAR_ELIGIBLE_PLANETS` (Mars/Mercury/Jupiter/Venus/Saturn), `WAR_ORB_DEGREES` (1), `eclipticLatitude(planet, jd)` (fetched directly via `@swisseph/node`'s `calculatePosition`, since the existing chart pipeline in `parashariChart.js` only keeps longitude, not the ecliptic latitude this technique specifically needs), and `warWinner(planetA, planetB, longitudes, jd)` implementing v.9's rule.
- `src/chart/shadbala.js`: after the main per-planet loop (which now includes every other resolved component), a second short pass computes each planet's *partial* total-so-far (Sthana + Dig + Kaala-partial + Naisargika + Drik + Cheshta-if-resolved) and, for every pair of the 5 war-eligible planets within the 1-degree orb, transfers the absolute difference between their partial totals from loser to winner via `warWinner`. Every planet's `yuddhaBala` field is now a real number (0 for the luminaries always, and 0 for any of the 5 eligible planets not currently at war with anything) rather than a `sourceRequired(...)` refusal. `shadbalaTotal`'s refusal reason updated to name only the remaining real gaps (Ayana Bala, most Cheshta Bala).

## UI/UX check — Parashara's Light 9 (desktop) and Cosmic Insights (web)

- **Parashara's Light 9**: re-examined the "Detailed Shad Bala" report captured in S10-E — its Kaala Bala section lists a "Yuddha Bala" sub-row alongside Nata-Unnata/Paksha/Tri-Bhaga/Varsha/Maasa/Vaara/Hora/Ayana, all as columns-by-planet. This project keeps Yuddha Bala as its own top-level Shadbala field (matching BPHS's own verse structure, where v.20 frames it as a post-hoc adjustment to a *complete* total, not a Kaala Bala component) rather than moving it under Kaala Bala for display — UI/UX ideas are taken from PL9, not its category groupings, consistent with the policy already applied in S10-E.
- **Cosmic Insights**: re-confirmed (per the S10-E finding, now in memory) that cosmicinsights.net is a marketing/download page with no live calculator; no new UI detail available for this specific sub-feature beyond what was already established.

## Tests

- `test-planetary-war.js` (new): `warWinner` checked for Venus always winning (regardless of latitude), no war outside the 1-degree orb, luminaries never participating even when conjunct within the orb, and the reproduced Rajan worked example (confirms Saturn's higher latitude beats Mars's, matching the book's declared winner). `eclipticLatitude` checked to return the expected small positive (North) values for both planets in that same worked example.
- `test-shadbala.js`: added assertions that the Sun's and Moon's `yuddhaBala` are always exactly 0 (not merely finite — luminaries are excluded by v.9's own scope, a sourced fact, not an estimate), and an invariant check that all 7 planets' `yuddhaBala` values sum to exactly 0 across any chart (every war transfers points from loser to winner; nothing is created or destroyed) — this would catch a sign-flip or double-counting bug in the two-pass computation.
- Full suite: `npm test` → all 22 scripts pass (21 pre-existing + this stage's new `test-planetary-war.js`, wired into `package.json`).

## TypeScript/lint/build

`npm run build` → compiles, TypeScript check passes, all 4 routes prerender successfully.

## Desktop/mobile validation

Verified live via the dev server (Browser pane; the dev server had exited again between turns, a known recurring issue this session — restarted via a direct background `npm run dev` after `preview_start`'s attach-only launch config left nothing actually listening) with the same 1990-05-15 07:30 IST test input used throughout S10: zero console errors; the Graha Bala breakdown's யுத்தம் (Yuddha) column now shows `0.0` for all 7 planets as a real number rather than a `ஆதாரம் தேவை` badge (no war fell within the 1-degree orb for this particular birth, which is itself expected and correctly represented — a real computed zero, not a placeholder).

## Backup

Not performed — still no git repository.

## Next workflow position

Remaining Shadbala gaps: **Ayana Bala** (a genuine, already-fully-diagnosed BPHS-internal formula/table contradiction — not resolvable without either accepting a guess or finding a second admitted source to arbitrate) and **Cheshta Bala** for 6 of 7 planets (needs the classical Seeghrocha/mean-motion apogee model, a genuinely new astronomical sub-system this project hasn't built, distinct from anything already implemented). Both remaining gaps are now larger, more foundational undertakings than the ones just closed (S10-B through S10-F each resolved a self-contained rule with its own worked example); Bhava Bala and the honest Shodasa Bala placeholder are unaffected. Given how much of S10 is now resolved (Sthana, Dig, Drik, Yuddha Bala, and 4 of 6 Kaala Bala sub-parts all fully sourced and implemented), this is a natural point to consider returning to WORKFLOW-REGISTER-001's next unfinished registered stage (S14/S15) rather than continuing to chase the two remaining, harder Shadbala gaps immediately — though the Owner may prefer to continue on Shadbala given the momentum.
