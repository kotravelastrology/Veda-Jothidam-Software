# S10-D — Drik Bala (aspectual strength)

Status: Drik Bala (one of Shadbala's six categories) is now FULLY RESOLVED. Shadbala overall remains partial: Kaala Bala still missing Ayana and Varsha-Masa-Dina-Hora Bala; Cheshta Bala for 6 of 7 planets; Yuddha Bala. Working tree only — no commit/push/backup (no git repository yet). Per the user's standing instruction, Parashara's Light 9 (the Owner's own licensed desktop install) and a Cosmic-Insights-adjacent live calculator were checked for UI/UX ideas before/alongside this pass — see the dedicated section below.

## Source check

- **Ch.27 v.19 (file p.233, printed p.223): Drig Bala's own rule.** "Reduce one fourth of the Drishti Pinda if a planet has malefic aspects on it and add a fourth if it is aspected by a benefic. Super add the entire aspect of Mercury and Jupiter to get the net strength of a planet." This assumes the reader already has a "Drishti Pinda" (aspectual value) procedure from elsewhere in the book.
- **Ch.26 "Evaluation of Planetary Aspects" (file p.209-212, printed p.199-202), located by searching this same admitted BPHS copy for the missing Drishti Pinda definition:**
  - v.2-5: the general graded-aspect framework -- 3rd/10th, 5th/9th, 4th/8th and 7th houses get aspects increasing in quarters (1/4, 1/2, 3/4, full); every planet aspects the 7th fully; Saturn/Jupiter/Mars get special full-strength extra aspects on 3rd&10th / 5th&9th / 4th&8th respectively.
  - v.6-8 plus the translator's own "Rule 1-6" restatement (Notes, same pages): a precise, continuous six-segment formula converting the exact angular distance between aspector and aspected (0-360 degrees) into a 0-60 Virupa aspectual value -- 0 at conjunction, rising through six linear/half-linear segments to a peak of exactly 60 at opposition (180 degrees, matching v.2-5's "7th house is always full"), back down to 0 by 300 degrees.
  - v.9-12 plus the Notes: Mars/Jupiter/Saturn's special extra aspects get a fixed additive bonus (+15/+30/+45 Virupas respectively) in their special-aspect angle ranges, on top of the ordinary six-segment value.
  - The chapter's own printed "Speculum of Aspectual Values (Computerized)" table (file p.211 onward) is a precomputed lookup of the same six-rule formula. **Hand-verified two rows against the Rule 1-6 formula exactly**: 47°00' -> table gives 8.50 Virupas, formula gives (47-30)/2 = 8.5; 64°00' -> table gives 19.00, formula gives (64-60)+15 = 19. Also verified the six rules are mutually continuous at every segment boundary (30/60/90/120/150/180/300 degrees) by direct substitution -- no internal inconsistency of the kind found in Ayana Bala.

## Implementation

- `src/chart/aspectStrength.js` (new): `drishtiPinda(angle)` (the six-rule speculum), `specialAspectBonus(aspectorPlanet, angle)` (Mars/Jupiter/Saturn's extra bonus), `aspectualValue(aspectorPlanet, aspectorLongitude, aspectedLongitude)` (combines both, handling the angle direction/wraparound). Kept as its own module (distinct BPHS chapter, `BPHS_ASPECT_SOURCE` citing Ch.26 specifically) rather than folded into `shadbala.js`, since planetary aspects are a foundational Parashari concept likely wanted again later (a future dedicated "Graha Drishti" feature was implicitly suggested by seeing PL9's own aspect-related displays during the UI check below).
- `src/chart/shadbala.js`: added `drikBala(planet, longitudes, isWaxingMoon)` -- for every other of the 7 classical planets, computes `aspectualValue` on this planet, then nets it in per v.19: Mercury/Jupiter's aspects added in full; the Moon's added at a quarter if waxing (benefic) or subtracted at a quarter if waning (malefic), reusing the same Paksha convention already established for Paksha Bala; Venus's added at a quarter; Sun/Mars/Saturn's subtracted at a quarter. `calculateShadbala` now computes `isWaxingMoon` once (same formula already used inside `pakshaBala`) and wires the real `drikBala(...)` result in, replacing the previous `sourceRequired(...)` refusal.
- `shadbalaTotal`'s refusal reason, the module's top docstring, and `attachSource`'s `pageLocus` all updated to reflect Drik Bala's resolution and cite Ch.26 alongside Ch.27.
- `app/report/ReportBuilder.tsx`: the Graha Bala expandable breakdown's "திருக்" (Drik) column now shows the real signed number instead of a `SourceRequiredBadge`, and the bar-chart partial totals now include Drik Bala's (possibly negative) contribution.

## UI/UX check — Parashara's Light 9 (Owner's own desktop install) and a live calculator

Per the standing instruction to check both reference products before/alongside building a feature: Parashara's Light 9 turned out to be genuinely installed on this machine (`C:\GeoVision\PL9\PL9.exe`, licensed to V. Kotravel) rather than only researchable secondhand. Launched it directly and captured its live Shad Bala panel (a saved sample chart, "Aniruddha"):

- PL9 shows each planet's Shadbala not as a raw Virupa/Rupa figure but as a **ratio to that planet's own classical minimum requirement** (its "SB%" column and the bar-chart height are the same number, e.g. Mars 1.68 -- consistent with BPHS's own v.32-33 minimum-Rupas table already in this project's `SHADBALA_MINIMUM_VIRUPAS`: 1.68 x 5.0 Rupas = 8.4 Rupas, a plausible real total). This lets every planet share one universal "1.0 = threshold" reference line in the bar chart, rather than needing a different absolute marker position per planet.
- The bars are colour-split green (above the 1.0 line) / red (below), giving an immediate strong/weak read.
- A "VB" column in the same screen sits in the 8-16 range per planet, consistent with Vimshopaka Bala's known 0-20 scale (the already-flagged Shodasa Bala gap) -- noted only as motivation that a real source for that table is worth continuing to look for; **the displayed numbers were not used to infer or back out PL9's formula**, consistent with this project's standing rule that competitor software may only inform UI/UX, never calculation logic.
- While looking for a detailed six-component Bala breakdown screen, another automated session on this same machine was observed independently moving windows around (a separate "Codex" agent window) -- desktop automation was stopped at that point to avoid interference, rather than risk crossed input with an unrelated concurrent session.
- Decision **not** taken from this: adopting PL9's ratio-to-minimum unit *and* its green/red pass/fail coloring together would misrepresent this project's own total, since it is still partial (missing Ayana, Varsha-Masa-Dina-Hora, most Cheshta, Yuddha Bala) -- a planet reading "red" here could simply be under-measured, not truly weak. The existing S10-B decision to keep the bar neutrally coloured (no verdict) stands; the ratio-based *unit* is a candidate for a future pass once Shadbala is complete enough that "green/red" would be an honest read, and is noted here rather than acted on now.

## Tests

- `test-aspect-strength.js` (new): `drishtiPinda` checked against the chapter's own printed Speculum rows (47°->8.50, 64°->19.00, plus four more), the zero-value dead zone (0-30 and 300-360 degrees), the full-aspect peak at opposition (180° -> 60), and continuity across every one of the six rule boundaries. `specialAspectBonus` checked for all three special planets both inside and outside their bonus ranges. `aspectualValue` checked for correct angle-wraparound regardless of which longitude is larger, and that Mars's bonus is included.
- `test-shadbala.js`: added a fully hand-worked `drikBala` integration case (Sun aspected by all six other planets at chosen longitudes exercising every classification branch: waning Moon as malefic, Mars malefic, Mercury landing in the dead zone, Jupiter full-add, Venus benefic, Saturn malefic with its own special bonus) -- manually derived contributions of -10/-5/0/+45/+5/-20 summing to a net 15, matching the function's output exactly. Updated the old `drikBala.status === 'SOURCE_REQUIRED'` assertion to confirm it is now a finite number.
- Full suite: `npm test` → all 20 scripts pass (19 pre-existing + this stage's new `test-aspect-strength.js`, wired into `package.json`).

## TypeScript/lint/build

`npm run build` → compiles, TypeScript check passes, all 4 routes prerender successfully.

## Desktop/mobile validation

Verified live via the dev server (Browser pane) with the same 1990-05-15 07:30 IST test input used throughout S10: zero console errors; the Graha Bala bar-chart totals shifted for every planet (some up, some down, since Drik Bala is a signed net adjustment) versus the S10-C figures; the expandable breakdown's Drik column now shows real signed numbers (e.g. Sun -18.5, Saturn +68.3) with only Cheshta and Yuddha Bala still showing `ஆதாரம் தேவை` for most planets.

## Backup

Not performed — still no git repository.

## Next workflow position

Shadbala's remaining named gaps are now down to: Ayana Bala (genuine BPHS-internal formula/table contradiction, already fully diagnosed), Varsha-Masa-Dina-Hora Bala (Varsha/Hora-lord rules not yet checked), Cheshta Bala for 6 of 7 planets (needs classical Seeghrocha/mean-motion, a Siddhantic model not yet built), and Yuddha Bala (needs a planetary-war detection rule, not yet located in this admitted copy). Bhava Bala and the honest Shodasa Bala placeholder are unaffected. Varsha-Masa-Dina-Hora Bala is the next most tractable target, since it likely needs only a lord-assignment table (year/month/day/hour rulers) rather than a new astronomical model, similar in shape to the already-solved Tribhaga Bala.
