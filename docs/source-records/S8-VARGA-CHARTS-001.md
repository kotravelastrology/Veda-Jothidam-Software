# S8 — Varga Charts (Shodasavarga)

Status: ALL 16 BPHS-DEFINED VARGAS IMPLEMENTED AND TESTED. Karaka references (the other half of S8's title in WORKFLOW-REGISTER-001, "Varga and Karaka references") were not reached this stage — recorded as the explicit remaining item, not silently skipped. Working tree only — no commit/push/backup (no git repository yet, unchanged since S2/S6/S7). No UI yet (backend only, matching precedent).

## Source check

S1-F had already identified and page-located BPHS Chapter 6, "The Sixteen Divisions of a Sign" (file page 53, printed page 43) as naming all 16 vargas, but had not verified the calculation method for any individual varga. This stage read the chapter in full — file pages 53-66 / printed pages 43-56, verses 1-41 — extracting the exact rule for each of the 16 divisions, and visually rendered two of the pages (printed pages 401 and 488, used for S7's Ch.46/Ch.51 confirmation, carried over) to confirm page-number alignment between file pages and printed pages holds throughout this range.

**Every rule below is BPHS's own stated formula, not a generic/assumed convention** — this mattered concretely: an initial implementation draft assumed D3 (Drekkana) and D4 (Chathurthamsa) split a sign into sequential neighbouring signs, matching every other equal-division varga in this set. Re-reading BPHS's own printed speculum tables (file pages 54-55) showed this is wrong for exactly these two: **D3 lands on the 1st/5th/9th (trine) sign** from the input sign, and **D4 lands on the 1st/4th/7th/10th (kendra) sign**, not consecutive signs. This was caught by testing against BPHS's own worked example ("The four Chathurthamsa of Aries are respectively ruled by Aries, Cancer, Libra and Capricorn" — file page 55) before it could ship silently wrong.

| Varga | Divisions | Rule (BPHS locus) |
|---|---|---|
| D1 Rashi | 1 | the sign itself |
| D2 Hora | 2 (15°) | odd sign: 0-15°=Sun, 15-30°=Moon; even sign reversed (v.5-6, file p.53) |
| D3 Drekkana | 3 (10°) | 1st/5th/9th (trine) sign from itself, always (v.7-8, file p.54) |
| D4 Chathurthamsa | 4 (7°30′) | 1st/4th/7th/10th (kendra) sign from itself, always (v.9, file p.55) |
| D7 Saptamsa | 7 (4°17′8.6″) | odd sign: from itself; even sign: from the 7th thereof (v.10-11, file p.55-56) |
| D9 Navamsa | 9 (3°20′) | movable: from itself; fixed: from the 9th; dual: from the 5th (v.12, file p.56) |
| D10 Dashamsa | 10 (3°) | odd sign: from itself; even sign: from the 9th thereof (v.13-14, file p.57) |
| D12 Dvadasamsa | 12 (2°30′) | from itself, always, consecutively (v.15, file p.57-58) |
| D16 Shodasamsa | 16 (1°52′30″) | movable→Aries, fixed→Leo, dual→Sagittarius (absolute start) (v.16, file p.58-59) |
| D20 Vimsamsa | 20 (1°30′) | movable→Aries, fixed→Sagittarius, dual→Leo (absolute start) (v.17, file p.59-60) |
| D24 Chaturvimsamsa | 24 (1°15′) | odd sign→Leo, even sign→Cancer (absolute start) (v.22-23, file p.60) |
| D27 Saptavimsamsa | 27 (1°6′40″) | fire→Aries, earth→Cancer, air→Libra, water→Capricorn (absolute start) (v.24-26, file p.61-62) |
| D30 Trimsamsa | 5 irregular spans (5/5/8/7/5°) | odd sign→Aries/Aquarius/Sagittarius/Gemini/Libra by degree band; even sign reversed set (v.27-28, file p.62) |
| D40 Khavedamsa | 40 (45′) | odd sign→Aries, even sign→Libra (absolute start) (v.29-30, file p.62-63) |
| D45 Akshavedamsa | 45 (40′) | movable→Aries, fixed→Leo, dual→Sagittarius (absolute start) (v.31-32, file p.63) |
| D60 Shashtiamsa | 60 (0°30′) | double the degree-into-sign, floor, mod 12, that many signs on from itself (v.33-41, file p.64-65) |

## Implementation

- `src/chart/vargaChart.js`:
  - `EQUAL_DIVISION_VARGAS` — 13 vargas (all but Hora, Trimsamsa, Shashtiamsa) expressed uniformly as `{ divisions, startSign(rasiIndex), step }`, where `step` defaults to 1 (consecutive signs) and is only 3 or 4 for D4/D3 respectively.
  - `equalDivisionVarga(...)` — the shared formula: `divisionIndex = floor(degreeInSign / (30/divisions))`, result sign = `(startSign(rasiIndex) + divisionIndex * step) % 12`.
  - `calculateHora`, `calculateTrimsamsa`, `calculateShashtiamsa` — the three vargas that don't fit the equal-division-with-sign-offset shape (Hora returns a planet lord, not a sign; Trimsamsa has irregular degree spans; Shashtiamsa's rule is a degree-doubling formula, not a starting-sign rule).
  - `calculateVargas(rasiIndex, degreeInSign)` — computes all 16 from one Rasi placement (as already produced by `rasiFromLongitude` in `parashariChart.js`, S6) and returns them under `attachSource`, citing the exact BPHS chapter/verse/page range above.

## Tests

`test-varga-chart.js` (new) — reproduces BPHS's own worked examples and printed tables directly, not just re-derived arithmetic:
- D3: Aries's three decanates are Aries, Leo, Sagittarius (book's own table).
- D4: "The four Chathurthamsa of Aries are Aries, Cancer, Libra and Capricorn" (book's own worked sentence) — this is the exact assertion that caught the trine/kendra bug above.
- D7: Aries (odd) from itself; Taurus (even) from the 7th (book's own worked sentence).
- D9: Aries from itself, Taurus from Capricorn, Gemini from Libra (book's own worked sentence, v.12).
- D12: Aries's twelve divisions run Aries through Pisces in order (book's own worked sentence).
- D16/D20/D45: movable/fixed/dual absolute starts, each checked against the book's own worked sentence.
- D24/D27/D40: odd/even and element-based absolute starts, checked against the printed rule.
- D2 Hora: all four odd/even × half combinations against v.5-6.
- D30 Trimsamsa: five degree bands each for odd and even signs against the printed table.
- **D60 Shashtiamsa: BPHS's own fully worked numeric example** (Venus at Capricorn 13°25′ → Pisces, printed page 55) reproduced exactly.
- `attachSource` provenance present; all 16 varga keys returned.

Full suite: `npm test` → all 9 scripts pass (8 pre-existing + this stage's new test).

## TypeScript/lint/build

- `npm run build` → compiles, prerenders, TypeScript check passes. Unaffected by S8 (backend-only `.js`, no new frontend code).
- `npm run lint` → still fails on the pre-existing `eslint-config-next`/`eslint-plugin-react` FlatCompat incompatibility recorded in S6; unrelated to and unchanged by S8.

## Desktop/mobile validation

Not applicable — backend-only, no UI surface yet (same as S2/S6/S7).

## Backup

Not performed — still no git repository (unchanged since S2/S6/S7).

## Next workflow position

S8's Varga half is complete for all 16 BPHS-defined divisions, each independently verified against the book's own worked examples or printed tables (not re-derived from memory of the general convention, which is exactly what caught the D3/D4 bug). **S8's Karaka half is not yet done** — BPHS's Chara Karaka (degree-based significators among the 7-8 classical planets) and Sthira/Naisargika Karaka (fixed per-planet significations) rules have not been located/verified this session; that is the concrete next step to close S8, or the Owner may prefer to move to S9 (Ashtakavarga, source-verified in S1-D) and return to Karakas later, consistent with WORKFLOW-REGISTER-001's rule that the workflow returns to the next unfinished registered stage after any isolated detour.
