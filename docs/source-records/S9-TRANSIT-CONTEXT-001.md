# S9 (continued) — Ashtakavarga Transit Context

Status: IMPLEMENTED, TESTED, AND WIRED INTO THE LIVE REPORT (S12) as "இன்றைய கோசரம் (Transit)". S9 is now fully complete — Bhinnashtakavarga/Sarvashtakavarga (first pass) and transit context (this pass) are both done. Working tree only — no commit/push/backup (no git repository yet, unchanged since S2/S6-S13).

## Process note — first stage built under the new feature-reference workflow

Per the Owner's instruction this session (see memory: `feedback-reference-software-ui-only`, `reference-competitor-feature-checklist`), Parashara's Light 9 and Cosmic Insights were checked before implementing this feature. Cosmic Insights' own feature description reads: *"Advanced Ashtakavarga... You also get access to compute transit scores based on Ashtakavarga"* — confirming "Ashtakavarga transit scoring" as a real, named feature worth building, and Parashara's Light 9's release notes describe graphical/step-through transit UI ideas (noted in the checklist memory for later UI work). **Only the feature framing and UI ideas were taken from these sites — the actual calculation below is sourced entirely from this project's own already-admitted corpus book**, per the Owner's explicit boundary.

## Source check

*Practical Ashtakavarga* (Vinay Aditya) — already S1-D/S9's admitted source — has two directly relevant chapters, read in full this stage:

- **Chapter 3, "General Principles"** (file pages 17-19 / printed pages 9-11): gives two complete, numbered classification scales:
  - **Bhinnashtakavarga** (item 9): "Maximum Bhinnashtaka bindus a planet can have in a sign are 8 and the minimum is 0. Therefore, 4 is the average, above which results are good and below which results are bad" — with a named tier for every value 0-8 (0=Calamitous, 1=Adverse, 2=Mediocre, 3=Tolerable, 4=Average, 5=Advantageous, 6=Fortunate, 7=Remarkable, 8=Magnificent).
  - **Sarvashtakavarga** (items 1 & 3): total is always 337 over 12 signs, average 337/12 ≈ 28; "in practice... 25 to 30 bindus are considered average," above 30 increasingly favourable, and a malefic transiting a sign under 21 bindus risks "annihilation of the significations of that house."
- **Chapter 15, "Transit of Saturn"** (file pages 172-173 / printed pages 164-165): gives the actual *transit* rule — "if the planet is transiting a house (or sign) that has high Sarvashtaka bindus and high Bhinnashtaka (the planet's own) bindus, the transit results will be good... higher weightage has to be given to the Bhinnashtaka bindus."

**Deliberately not implemented, and why:** the combining rule above is qualitative ("higher weightage"), not a stated numeric formula — inventing a specific weighting (e.g. "70% Bhinna + 30% Sarva") would be fabricating a rule the source doesn't give, so both classifications are returned side by side instead of collapsed into one invented score. Two deeper refinements the same chapter names are also left out, each for a concrete, stated reason: **Sadhe Sati's extra checks** (retrograde/combustion/nakshatra-lord state, transiting-nakshatra-lord friendship, 3rd/5th/7th Tara position) are Saturn-specific and add real complexity beyond this pass's scope; **Kakshya-based narrowing** (dividing each sign into 8 parts of 3°45′, ruled in turn by Saturn/Jupiter/Mars/Sun/Venus/Mercury/Moon/Lagna) is explicitly deferred by the book itself to the author's *other*, uncatalogued book ("this has been explained in details in the author's previous book Dots of Destiny") — so it cannot be implemented from a source this project has actually verified.

## Implementation

- `src/chart/ashtakavargaTransit.js`: `classifyBhinnaBindus`/`classifySarvaBindus` (the two classification scales above, cited to their exact verse/page), `evaluateTransit(planet, transitRasiIndex, natalAshtakavarga)` (one planet's reading), `calculateTransitContext(transitRasiPositions, natalAshtakavarga)` (all 7 classical grahas, skipping any not supplied rather than fabricating a position). Wrapped in `attachSource` citing both chapters.
- `src/report/reportData.js` — added `currentTransitRasiPositions(latitude, longitude)`, computing each classical graha's *current* (server-render-time) sidereal rasi via the existing `calculateChart`, independent of the birth chart's own date; wired a new `transit` field into the report using the birth chart's own natal Ashtakavarga as the comparison baseline (matching how a real astrologer reads "today's transit against my chart").
- `app/report/ReportBuilder.tsx` — new "இன்றைய கோசரம் (Transit)" section: each graha's current Rasi, its Bhinnashtakavarga bindus + classification (colour-coded teal/grey/rose), and the sign's Sarvashtakavarga bindus + classification, side by side as the source itself presents them (not merged into a single invented score).

## Tests

`test-ashtakavarga-transit.js` (new):
- All 9 Bhinnashtakavarga tiers spot-checked (0→Calamitous, 4→Average, 8→Magnificent, plus two more).
- Sarvashtakavarga classification boundaries checked exactly at 20/21/24/25/28/30/31/37 (the four-band edges the source states).
- `evaluateTransit` checked against a real `calculateAshtakavarga` natal result, confirming it reads the exact stored bindu values rather than recomputing them.
- `calculateTransitContext` integration: all 7 grahas present when supplied; a planet omitted from the transit input is skipped, not guessed.

`test-report-data.js` (updated) — asserts the new `transit` field carries a valid rasi and bindu classification for all 7 classical grahas.

Full suite: `npm test` → all 16 scripts pass (15 pre-existing + this stage's new test).

## TypeScript/lint/build

- `npm run build` → compiles, prerenders all three routes, TypeScript check passes.
- `npm run lint` → still fails on the pre-existing `eslint-config-next`/`eslint-plugin-react` FlatCompat incompatibility recorded in S6; unrelated to and unchanged by this stage.

## Desktop/mobile validation

Verified live in-browser: submitted the report form and confirmed the new Transit section renders real, correctly-classified data for all 7 grahas (e.g. Jupiter transiting Karkataka showing "5 · Advantageous" Bhinna and "21 · Inauspicious" Sarva — correctly landing exactly on the book's own 21-bindu boundary). Zero console errors. (Also restarted the dev server this session after it exited on its own between turns — same intermittent Windows/Turbopack process-exit behaviour noted in earlier stages, not something this change caused.)

## Backup

Not performed — still no git repository (unchanged since S2/S6-S13).

## Next workflow position

**S9 is now fully complete.** Two named, source-backed follow-ups remain open if the Owner wants to go deeper later: Sadhe Sati's fuller Saturn-specific rule set, and Kakshya-based transit narrowing (needs a separate source — the book that would define it, "Dots of Destiny," is not in this project's corpus). Remaining open items elsewhere are unchanged: S6 (Rahu/Ketu), S10 (six Shadbala components), S11 (Raja Yogas/Dosha/Varshaphala). S14 still needs the Owner's explicit go-ahead before any work starts.
