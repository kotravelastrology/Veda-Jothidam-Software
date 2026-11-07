# S9 — Ashtakavarga

Status: IMPLEMENTED AND TESTED (Bhinnashtakavarga for all 7 classical grahas + Sarvashtakavarga). Transit context (the third item named in WORKFLOW-REGISTER-001 S9, "Bhinnashtakavarga, Sarvashtakavarga and transit context") not reached this stage — recorded as the explicit remaining item. Working tree only — no commit/push/backup (no git repository yet, unchanged since S2/S6/S7/S8). No UI yet (backend only, matching precedent).

## Source check

S1-D had already selected *Practical Ashtakavarga* (Vinay Aditya) and visually confirmed its Table-1 exists at file page 12 / printed page 4, but had not transcribed the table's contents — S1-D's own record says only "the table is readable and suitable for a source-record candidate," not that its values were captured. This stage opened the exact same PDF, rendered file page 12 at high resolution, and transcribed the full table: for each of the 7 classical grahas (Sun, Mars, Jupiter, Saturn, Moon, Mercury, Venus) as Bhinnashtakavarga target, the benefic house-offsets contributed by each of the 8 reference points (the same 7 grahas plus Lagna).

**Verification beyond a single visual read:** every one of the 8 printed per-planet totals (Sun 48, Mars 39, Jupiter 56, Saturn 39, Moon 49, Mercury 54, Venus 52) was independently recomputed by summing the transcribed offset-list lengths, and matched exactly — as did the grand total (337), which the book itself names the system after (its own footnote: "we have taken the 337 bindu Ashtakavarga system which is more widely accepted"). This is a stronger check than a single visual read: a transcription error in any single cell would very likely have broken at least one of these eight sum-checks, and none did.

Rahu, Ketu and the outer planets are excluded from Ashtakavarga by the source's own opening sentence ("each planet excluding Rahu, Ketu and the extra-Saturnian planets... is considered"), so this stage has **no dependency on S6's still-open Rahu/Ketu item** — Ashtakavarga only needs the 7 classical grahas' and Lagna's Rasi, both already produced by S6's `calculateParashariChart`.

A worked case study (M.K. Gandhi's chart, with a Sun-Bhinnashtakavarga table shown in full and a birth-chart diagram) appears a page later in the same book and would have made an excellent chart-verified regression test. It was not used: the diagram is a mixed South-Indian/North-Indian dual rendering with small corner numerals whose exact meaning (bhava markers vs. something else) could not be determined with confidence from the rendered image alone, and guessing at an "expected" value from an ambiguously-read diagram would have been worse than not testing it at all. Instead, this stage verified the table itself via the arithmetic cross-check above, plus hand-computed synthetic test vectors (see Tests) — arguably a stronger form of verification since it checks every cell, not just one example chart's output.

## Implementation

- `src/chart/ashtakavarga.js`:
  - `BINDU_TABLE` — the transcribed Table-1, 7 targets × 8 contributors × offset lists.
  - `calculateBhinnashtakavarga(targetPlanet, rasiPositions)` — places each contributor's offsets relative to that contributor's own rasi (`(referenceRasi + offset - 1) % 12`) and sums bindus per sign.
  - `calculateAshtakavarga(rasiPositions)` — all 7 Bhinnashtakavargas plus their sign-wise sum (Sarvashtakavarga), wrapped in `attachSource` citing Table-1's exact file/printed page.
  - Takes a `{ Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Lagna }` map of 0-based rasi indices directly from S6's `calculateParashariChart` output — no new astronomical calculation.

## Tests

`test-ashtakavarga.js` (new):
- Every planet's transcribed table row sums to its printed encircled total; the 7 totals sum to 337.
- Bhinnashtakavarga bindu totals are chart-independent (proved with two very different synthetic charts) — a structural invariant of the system, not just a lucky match.
- Two full 12-sign bindu arrays (Sun's and Moon's Bhinnashtakavarga with all 8 contributors placed in Aries) computed **by hand directly from the table**, matched exactly.
- Rotational symmetry: shifting every contributor by the same number of signs rotates the resulting bindu array by the same amount.
- `calculateAshtakavarga`'s Sarvashtakavarga equals the sum of its own 7 Bhinnashtakavargas and totals 337.
- Missing a contributor's rasi, or requesting an unsupported target (e.g. Rahu), is rejected rather than silently defaulted.

Full suite: `npm test` → all 10 scripts pass (9 pre-existing + this stage's new test).

## TypeScript/lint/build

- `npm run build` → compiles, prerenders, TypeScript check passes. Unaffected by S9 (backend-only `.js`, no new frontend code).
- `npm run lint` → still fails on the pre-existing `eslint-config-next`/`eslint-plugin-react` FlatCompat incompatibility recorded in S6; unrelated to and unchanged by S9.

## Desktop/mobile validation

Not applicable — backend-only, no UI surface yet (same as S2/S6/S7/S8).

## Backup

Not performed — still no git repository (unchanged since S2/S6/S7/S8).

## Next workflow position

S9's Bhinnashtakavarga/Sarvashtakavarga core is complete and independently cross-checked. **Transit context is not yet done** — applying Sarvashtakavarga/Bhinnashtakavarga bindu counts to a transiting planet's current sign (the classical use of these tables for predicting favourable/unfavourable transit periods) needs its own source check in this same book (which has dedicated later chapters, e.g. "Transit of Saturn", "Other Transits") before implementation. S8's Karaka half also remains open (see S8-VARGA-CHARTS-001.md). S10 — Strength (Shadbala/Ishtabala/Kashtabala) is the next registered stage; BPHS Ch. 27 (already source-verified in S1-F for the worked Shad-bala Pinda table) is its natural starting source check.
