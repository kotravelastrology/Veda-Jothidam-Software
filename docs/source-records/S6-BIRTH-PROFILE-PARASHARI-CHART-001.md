# S6 — Birth Profile and Parashari Chart

Status: PARTIALLY IMPLEMENTED (birth profile intake, chart identity, Lagna and the seven classical grahas with Rasi placement are implemented and tested; Bhava/house placement and Rahu/Ketu are explicit `SOURCE_REQUIRED` refusals, not guessed values — see Source check). No commit/push/backup (no git repository yet, unchanged since S2). No UI yet (backend only, matching S2's precedent).

## Source check

S1-F already identified *Brihat Parashara Hora Shastra* (BPHS), R. Santhanam translation (`D:\AstrologicLab-Corpus\astrologiclab-sources\C23_BPHS_Santhanam.pdf`) as the verified-candidate primary Parashari source, with Varga/Shadbala/Dasha chapter loci confirmed but explicitly **not yet admitted** for calculation use. This stage needed to check it specifically for Rasi/Bhava/graha rules before writing any Rasi/Bhava code.

The PDF has an extractable text layer (unlike the scanned Vakyakarana/Karana Prakasa files), so the full text was extracted and searched, and the relevant page was rendered to an image and visually inspected (this session's environment has no `pdftoppm`/poppler-utils, unlike whatever rendered prior stages' page images; PyMuPDF's own renderer was used instead — same visual-verification standard, different tool).

**Finding — this changed the implementation plan.** BPHS/Santhanam's own preface (file page 7, visually confirmed) states, in the translator's own numbered summary of what the text proves:

> "1. The point of M.C. is to be found out in the natal horoscope and houses intersected accordingly. This is popularly called Sripati Paddhati. Originally Parāśara advocated this system."
> "3. Lahiri's Ayanamsa is the first best."

Point 3 confirms the project's existing Lahiri ayanamsha choice (S1-C) directly from the primary source. Point 1 means the admitted source's own Bhava (house) system is **Sripati Paddhati** (an MC-based division), not a simple whole-sign/Rasi-Chakra split as generically assumed going in. The same preface (file page 7) further states Chapter 5 "touches various special Lagna, like Ghatika Lagna, Horā Lagna and Bhava Lagna" and that "a final Bhava chart can emerge after merging the different Bhava charts caused by these various special ascendants" — i.e., BPHS's real Bhava method is a multi-Lagna composite, not a one-line formula. The integrated ephemeris library (`@swisseph/node`) has no built-in Sripati house system (closest is Porphyrius, not confirmed equivalent — historically a distinct method), and Chapter 5's exact verses/formula have not yet been visually verified. Implementing Bhava on the whole-sign or Placidus assumption would have silently contradicted this project's own admitted source, so **Bhava placement is refused (`SOURCE_REQUIRED`) rather than guessed**, pending a dedicated follow-up visual verification of BPHS Chapter 5.

A full-text search for a Rahu/Ketu (lunar node) computation rule found no explicit Mean-Node/True-Node statement in BPHS. This is a genuine reliable-source-divergence point (different traditions/software use different node conventions), so **Rahu/Ketu are also refused (`SOURCE_REQUIRED`)** rather than defaulted to either convention.

Sign-degree segmentation itself (0–30° = Mesha, 30–60° = Vrishabha, etc.) is treated as definitional — universal across every sidereal Vedic source, not a book-specific claim — so it is not run through `attachSource`, consistent with how S2's own range checks (e.g., latitude ±90°) carry no book citation.

## Implementation

- `src/contracts/birthProfile.js` — `createBirthProfile({ name, gender, ...astronomicalInput })`: validates a non-blank `name`, builds an S2 chart context from the astronomical fields (defaulting the S2-required-but-natal-irrelevant `calendarMode` to `'tirukanita'`, documented inline as a formality, not an astrological choice), and derives a stable `chartId` — a SHA-256 hash (first 16 hex chars) of only the astronomical fields (date/time/place/ayanamsha/houseSystem). Two different-named people born at the same instant/place deterministically share one `chartId`, which is astronomically correct; `deriveChartId` is exported separately for reuse.
- `src/chart/parashariChart.js` — `calculateParashariChart(chartContext)`: reuses the existing `calculateChart` (S1-C/`swissEphemeris.js`, unchanged) to get Lagna (ascendant) and the seven classical grahas (Sun–Saturn), then applies `rasiFromLongitude` (sign index, sign name, degree-in-sign) to each. Returns `rahuKetu` and `bhava` as `sourceRequired(...)` per the source check above, each reason naming exactly what is missing.
- No change to `src/contracts/chartContext.js` (S2) — still frozen as originally tested; S6 did not need new supported ayanamsha/house-system values since Bhava is deferred rather than computed against an unverified system.

## Tests

- `test-birth-profile.js` (new): valid profile creation with name/gender, name trimming, frozen-profile mutation rejection, missing/blank-name rejection, same-instant-different-name profiles sharing one `chartId`, a one-minute birth-time change producing a different `chartId`, `deriveChartId` agreeing with the profile's own id.
- `test-parashari-chart.js` (new): `rasiFromLongitude` boundary behaviour (0°, just under 30°, exactly 30°, wraparound above 360° and below 0°); full chart calculation returns finite Lagna longitude with a valid Rasi, all seven classical grahas present with finite longitude and valid Rasi; `rahuKetu` and `bhava` are confirmed `SOURCE_REQUIRED` with a non-empty reason (never a silently-guessed value); determinism check (same chart context twice → identical longitudes).
- Full suite: `npm test` → all 7 scripts pass (5 pre-existing + 2 new).

## TypeScript/lint/build

- `npm run build` → compiles and prerenders successfully, TypeScript check passes. Unaffected by S6 (backend-only `.js` files, no new frontend code this stage).
- `npm run lint` → **fails, pre-existing and unrelated to S6.** Root-caused this session: `eslint.config.mjs`'s `FlatCompat.extends('next/core-web-vitals')` (and separately `'next/typescript'`) crashes with `TypeError: Converting circular structure to JSON` inside `@eslint/eslintrc`'s config validator, triggered by `eslint-plugin-react` 7.37.x's plugin object containing a self-reference (`configs.flat...plugins.react` points back to itself) that the validator cannot `JSON.stringify` when formatting a config message. Confirmed this is not an eslint-version issue: reproduced identically on both the originally-installed eslint 9.39.5 (itself flagged "no longer supported" by its own registry metadata) and after a clean upgrade to eslint 10.10.0 (then reverted back to `^9.0.0` to avoid the peer-dependency overrides the 10.x install forced elsewhere, since it fixed nothing). This is a genuine upstream incompatibility between `eslint-config-next` 16.3.4's FlatCompat-based config and current `eslint-plugin-react`, tracked here as an open item rather than worked around by disabling rules.

## Desktop/mobile validation

Not applicable — S6 is a backend calculation module with no UI surface yet, same as S2. A birth-profile intake form is the natural S6 UI follow-up (name/gender/date/time/place fields feeding `createBirthProfile`) but was not built this pass.

## Backup

Not performed — still no git repository and no configured backup target (unchanged since S2).

## Next workflow position

S6 stands as: birth-profile intake, stable chart identity, Lagna, and the seven classical grahas' Rasi placement are done and tested; Bhava (house) placement and Rahu/Ketu remain open, each blocked on a specific, named next step (BPHS Chapter 5 visual verification for Bhava; an explicit Mean/True node source decision for Rahu/Ketu) rather than a vague gap. S7 — Dasha hierarchy — can proceed for Vimshottari (BPHS Ch. 46 already source-verified in S1-F, pending its own admission step) using the Moon's Rasi/longitude already available from this stage's `calculateParashariChart`, without waiting on Bhava or Rahu/Ketu. The `npm run lint` failure is a standing open item independent of the registered stage sequence.
