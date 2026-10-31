# S3 — Tirukanita Panchangam

Status: IMPLEMENTED, TESTED, AND EXTERNALLY CROSS-CHECKED (working tree only — no commit/push; no git repository exists yet in this project).

## Source check

Built directly on S1-B (*Panchangam Calculations*, Karanam Ramakumar): five-limb definitions (file page 1), Tithi = Moon−Sun distance / 12° (file page 10), Karana = two 6° halves per Tithi (file page 13), Nakshatra = absolute Nirayana Moon longitude / 13°20′ (file page 15), Yoga = Nirayana Sun+Moon sum / 13°20′ (file page 18). Karana naming (4 fixed + 7 movable repeating 8×) follows the rule visually confirmed in S1-E (B. V. Raman, *Muhurtha*, file page 6). Engine/ayanamsha/house-system identity follows S1-C and the S2 contract (Swiss Ephemeris, Lahiri, sunrise day boundary).

## Implementation

- `src/ephemeris/siderealPositions.js` (new): `sunMoonLongitudes(jd, ayanamsha)` — lightweight Sun/Moon sidereal longitude lookup (kept separate from the full `calculateChart` in `swissEphemeris.js`, since limb-boundary search calls this hundreds of times per request). `sunriseJulianDay(jd, lat, lon)` — wraps `@swisseph/node`'s `calculateRiseTransitSet` for the sunrise-day-boundary rule.
- `src/panchangam/tirukanitaPanchangam.js` (new): `calculateTirukanitaPanchangam(chartContext)` computes Vara (weekday at sunrise), and Tithi/Nakshatra/Yoga/Karana each with name, index, and local start/end time. Boundary times are found by scanning outward from sunrise in 30-minute steps (safely below the shortest realistic limb duration) and then bisecting (30 iterations, sub-second precision) to the exact crossing. Every result is run through S2's `attachSource` with the exact S1-B page citation — the function cannot return a panchangam without it. Calling it with any `calendarMode` other than `'tirukanita'` throws, per the registered rule that Tirukanita and Vakya must never blend.

## Tests

- `test-tirukanita-panchangam.js` (new): asserts Vara/Tithi/Nakshatra/Yoga/Karana names and end-times for 2026-09-05 at Erode (11.34°N 77.72°E); asserts non-zero-width limb windows; asserts the 30/27/27/7 name-table sizes; asserts all four fixed-karana names and two movable-karana positions; asserts `calendarMode: 'vakya'` is rejected.
- `test-chart-context.js`, `test-swiss-ephemeris.js`: still pass, unchanged.
- Full suite: `npm test` → all three scripts pass (captured in this session).

## External cross-check (new for this stage)

Fetched `drikpanchang.com`'s panchangam for 2026-09-05 (New Delhi coordinates, a different location from this test's Erode fixture) as an independent, non-corpus reference:

| Limb | This implementation (Erode) | drikpanchang.com (Delhi) |
|---|---|---|
| Vara | Shanivara | Saturday ✓ |
| Tithi | Navami, ends 21:54 | Navami, ends 21:53 |
| Nakshatra | Mrigashira, ends 21:31 | Mrigashira, ends 21:30 |
| Yoga | Vajra, ends 12:47 | Vajra, ends 12:47 |
| Karana | Taitila, ends 11:05 | Taitila, ends 11:04 |

All five limb names match exactly; all four end-times match to within one minute despite the two locations differing (end-times are absolute moments, so only the reporting location's clock differs) — this is strong independent evidence the Sun/Moon longitude, ayanamsha and boundary-search logic are correct, not just internally consistent. The 1-minute deltas are consistent with rounding/ephemeris-version differences between two independent engines, not a systematic error. This cross-check is recorded here as evidence; it is not re-run automatically since it depends on a live third-party site the test suite should not require network access to reach.

## TypeScript/lint/build

Not applicable yet — plain Node.js, no TypeScript/bundler configured (unchanged since S1-C/S2).

## Desktop/mobile validation

Not applicable — no UI surface yet. Applies from S5 (daily Panchangam/Muhurtham UI).

## Backup

Not performed — same open item recorded in S2; no git repository or backup target configured yet in this project.

## Next registered stage

S4 — Vakya Panchangam: the same five-limb contract under a separately selected Vakya convention (traditional table-based calculation, not astronomical/Drik-style), per the convention rule in S1-SOURCE-DISCOVERY-001 — must not reuse or blend with this Tirukanita implementation. A Vakya source still needs its own S1-style discovery and page verification before S4 can be implemented.
