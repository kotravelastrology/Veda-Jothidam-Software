# S7 — Dasha Hierarchy (Vimshottari)

Status: IMPLEMENTED AND TESTED for Mahadasha through 5-level nesting (Dasha/Bhukti/Antara/Sookshma/Prana), using BPHS's own explicitly-recursive formula (working tree only — no commit/push, no git repository yet, unchanged since S2/S6). No UI yet (backend only, matching S2/S6 precedent).

## Source check

S1-F had already identified BPHS Ch. 46 ("Dasha (Periods) of Planets") as containing Vimshottari's opening statement, and S1-J/S1-K had verified two secondary sources (K. K. Pathak; Rohiniranjan) for the dasha order, the nine durations, and the general subdivision concept — but neither the exact BPHS duration table nor its sub-period formula had been visually confirmed. This stage opened the same admitted-candidate BPHS/Santhanam PDF (already extracted to text during S6) and located, then visually rendered and read, the actual governing pages:

- **File pages 407-409 / printed pages 400-402 (Ch. 46, vv. 12-16):** confirms the fixed 9-lord cycle (Sun, Moon, Mars, Rahu, Jupiter, Saturn, Mercury, Ketu, Venus, starting from Krittika), the nine Mahadasha durations (Sun 6, Moon 10, Mars 7, Rahu 18, Jupiter 16, Saturn 19, Mercury 17, Ketu 7, Venus 20 — sum 120), the full nakshatra-to-lord table (all 27 nakshatras in groups of three per lord), and the balance-at-birth rule (v.16): multiply the planet's full Dasha years by the elapsed fraction of the Moon's transit through the birth nakshatra. BPHS's own notes add that "modern researchers... devised a much simpler method... based on the longitude of the Moon" in place of the original Ghatika/Panchanga-based worked method in the same verse — this project uses that longitude-based method, per BPHS's own attribution, not a substitution of its own.
- **File pages 495-497 / printed pages 488-490 (Ch. 51, vv. 1-2):** confirms the sub-period ("Antardasa") formula — `parentDurationYears × sublordYears / 120` — worked through two full numeric examples (Antardasha of Venus in Venus's own Mahadasha = 3y4m; Pratyantar Dasha of Venus in that Antardasha = 6m20d; Antardasha of Mercury in Saturn's Mahadasha = 2y8m9d), and v.2's rule that each level's first sub-lord is the parent's own lord, then the remaining 8 in the same fixed cycle order. Both worked examples are reproduced exactly by this stage's implementation (see Tests).

**Naming note, recorded rather than silently resolved:** BPHS's own verse-level names are "Dasha" (level 1), "Antardasa" (level 2) and "Pratyantar Dasha" (level 3) — universally synonymous with WORKFLOW-REGISTER-001's registered names "Bhukti" (level 2) and "Antara" (level 3) respectively. Levels 4-5 ("Sookshma", "Prana") are not named on any BPHS page located this session; BPHS itself states the sub-period tables for still-deeper levels "will be given later" (Ch. 51, printed page 489) beyond what has been read. This stage's depth-4/5 output is the direct mathematical extension of BPHS's own explicitly-recursive v.1-2 rule (documented inline in `vimshottariDasha.js`), not a value copied from a printed level-4/5 table — a follow-up visual check of BPHS's later chapters (or S1-K's Rohiniranjan primer, which independently names "Antara, Pratyantara and Sukshma" as further levels) is recorded as the next step if the Owner wants those exact page loci pinned before deeper reliance.

Calendar-date conversion (Dasha-years → an actual start/end date) uses 365.25 days/year — the ordinary modern-software civil-year approximation, not a BPHS-specific convention (BPHS's own worked method uses Ghatika/Panchanga units); this is recorded explicitly in the module rather than left unstated.

## Implementation

- `src/dasha/vimshottariDasha.js`:
  - `birthNakshatraAndBalance(moonLongitude)` — nakshatra index/lord and balance-at-birth years, per BPHS Ch.46 v.16.
  - `orderFrom(lord)` / `subPeriods(parentLord, parentDurationYears, parentStartYears)` — the fixed-cycle sub-period formula, per BPHS Ch.51 vv.1-2.
  - `buildVimshottariDasha(birthJulianDay, moonLongitude, utcOffsetMinutes, { depth })` — the full 9-Mahadasha lifetime sequence (balance-adjusted first entry, full-duration remainder), recursively nested to `depth` levels (1-5, default 2) under the keys `Dasha`/`Bhukti`/`Antara`/`Sookshma`/`Prana`, each period carrying both raw `durationYears`/`startYears`/`endYears` and calendar `startLocal`/`endLocal` (reusing the `julianDayToDate` + local-time-formatting pattern already used by `tirukanitaPanchangam.js`). Result is wrapped in `attachSource` citing the exact BPHS loci above.
  - Feeds directly from S6's output: a caller passes `chart.julianDay`, `chart.grahas.Moon.longitude` (from `calculateParashariChart`) and the birth profile's `utcOffsetMinutes` — no new astronomical calculation needed, only the already-computed sidereal Moon longitude.

## Tests

`test-vimshottari-dasha.js` (new):
- Nakshatra-lord table spot checks (Ashwini→Ketu, Mrigasira→Mars, Revati→Mercury) and duration-sum-to-120 check.
- `orderFrom` cycle-rotation correctness.
- Balance-at-birth: full balance at a nakshatra's exact start, half balance at its midpoint.
- **Exact reproduction of all three BPHS Ch.51 worked numeric examples**: Antardasha of Venus in Venus = 3y4m (40 months); Pratyantar Dasha of Venus in that Antardasha = 6m20d; Antardasha of Mercury in Saturn = 2y8m9d.
- Full 9-Mahadasha cycle sums to exactly 120 years from a nakshatra-boundary birth.
- Depth parameter (1 through 5) correctly nests/omits `Bhukti`/`Antara`; every period carries calendar `startLocal`/`endLocal`, never a bare number; out-of-range depth (`0`, `6`) throws `RangeError`.

Full suite: `npm test` → all 8 scripts pass (7 pre-existing + this stage's new test).

## TypeScript/lint/build

- `npm run build` → compiles, prerenders, TypeScript check passes. Unaffected by S7 (backend-only `.js`, no new frontend code).
- `npm run lint` → still fails on the pre-existing `eslint-config-next`/`eslint-plugin-react` FlatCompat incompatibility recorded in S6 (S6-BIRTH-PROFILE-PARASHARI-CHART-001.md); unrelated to and unchanged by S7.

## Desktop/mobile validation

Not applicable — backend-only, no UI surface yet (same as S2/S6).

## Backup

Not performed — still no git repository (unchanged since S2/S6).

## Next workflow position

S7 gives a working, BPHS-verified Vimshottari Dasha/Bhukti/Antara/Sookshma/Prana calculator, fed by S6's birth profile and Moon longitude. Two explicit open items carried forward rather than silently closed: (1) BPHS's own level-4/5 names and any dedicated printed sub-period table beyond Pratyantardasha, if the Owner wants that specific citation pinned; (2) S6's own two open items (Bhava/house placement, Rahu/Ketu node convention) remain independent of S7 and don't block it, since Dasha only needed the Moon's longitude. S8 — Varga and Karaka references — is the next registered stage; BPHS Ch. 6 (already source-verified in S1-F for the 16 varga definitions) is its natural starting source check.
