# S6 (continued) — Bhava (House) Resolution

Status: RESOLVED — Bhava placement is now computed for the Lagna and all 7 classical grahas, using a source-verified method reproducing a dedicated primary source's own worked example exactly. S6's only remaining open item is Rahu/Ketu node convention. Working tree only — no commit/push/backup (no git repository yet, unchanged since S2/S6-S13).

## Source check — and a correction to S6's original record

S6's first pass (S6-BIRTH-PROFILE-PARASHARI-CHART-001.md) read BPHS/Santhanam's preface as saying Bhava determination was "further complicated by Chapter 5's merged Ghatika/Hora/Bhava-Lagna chart concept." Re-reading Chapter 5 in full this stage showed **that was a misreading**: Chapter 5's "Bhava Lagna" is a *different*, specific technique — one of three special ascendants (Bhava Lagna, Hora Lagna, Ghatika Lagna) computed from elapsed birth time, used for particular predictive purposes — not the general house-cusp system that determines which house a planet occupies. That general system is what the preface separately names "Sripati Paddhati." Conflating the two was this project's own error, not a genuine textual complication; it is recorded here rather than quietly corrected, since the original S6 record is left standing as history and this note explains why it was wrong.

With that confusion cleared, the actual task was to find Sripati Paddhati's mathematical definition. BPHS itself only names the system in passing; it does not give the formula. A corpus search (per PLAN-001's "search Owner-curated and local corpora first" rule) found a dedicated source: ***Sripatipaddhati***, translated into English by V. Subrahmanya Sastri (1937 edition, `D:\1\astro books english\3-CLASSICS_nadi\Jyotish_Sripatipaddhati.pdf`, 195 pages) — a full classical text on exactly this system, including "a sample horoscope worked out."

**The formula (Adhyaya I, Sloka 6-7, file page 21 / printed page 10, visually verified):**
1. The 1st (Lagna), 4th, 7th and 10th Bhava are the four angles: 4th = 10th − 6 signs (i.e. IC = MC + 180°); 7th = 1st − 6 signs (i.e. Descendant = Ascendant + 180°) — both already available, house-system-independent, from the engine's own `ascendant`/`mc` output.
2. Each pair of intermediate cusps (2nd/3rd between 1st and 4th; 5th/6th between 4th and 7th; 8th/9th between 7th and 10th; 11th/12th between 10th and 1st) is obtained by taking **one-third and two-thirds of the ecliptic-longitude arc** between the two bounding angular cusps and adding each to the earlier angle.

This is simple ecliptic-arc trisection between the four angles — the classical definition of what Western astrology calls the **Porphyry house system**, already present (unused) in `@swisseph/node` as `HouseSystem.Porphyrius`. **This was verified computationally, not assumed from the name alone:** the source's own worked example (Lagna = 0s14°31′46″, 4th Bhava = 3s7°42′11″ → 2nd Bhava = 1s12°15′14″) was reproduced by hand from the stated rule, and separately, `HouseSystem.Porphyrius`'s output for an unrelated test chart was checked against the same 1/3-and-2/3 trisection formula applied directly to its own Ascendant/4th-cusp values — matching to 4 decimal places. Both checks agree, closing the gap between "the book's named system" and "the engine's available option" with actual evidence, not a plausible-sounding label match.

## Implementation

- `src/contracts/chartContext.js` (S2) — `SUPPORTED_HOUSE_SYSTEMS` now includes `'Porphyrius'` (Placidus remains supported but unused by any current calculator); the default `houseSystem` changed from `'Placidus'` to `'Porphyrius'`, since Placidus was never a deliberate choice (S6's first-pass record already noted it was "inherited from the ephemeris wrapper's example default and was never exercised by Panchangam") and Porphyrius is now the actually-verified, actually-needed convention.
- `src/chart/parashariChart.js` — new `houseOfLongitude(longitude, cusps)` locates which of the 12 Bhava a longitude falls into (handling the 360°/0° wraparound at the 12th-to-1st boundary). `calculateParashariChart`'s per-graha output now carries a `house` (1-12) field; the chart result also exposes `houseSystem` and the raw `cusps` array. **The old top-level `bhava: sourceRequired(...)` field is removed** — it is superseded by the real per-graha `house` values, not left alongside them as dead weight.
- `app/report/ReportBuilder.tsx` — the Lagna/Graha table now has a real "பாவம்" (Bhava) column instead of a "ஆதாரம் தேவை" badge; the Rahu/Ketu badge remains, since that gap is unaffected by this stage.

## Tests

- `test-parashari-chart.js` (updated): `houseOfLongitude` checked against **Sripatipaddhati's own worked-example cusp values** (1st/2nd/3rd/4th Bhava, converted from the book's sign-degree-minute-second notation) across six cases — mid-house placement in houses 1-4, an exact-cusp boundary case, and a wraparound case (house 12); every classical graha now asserted to carry an integer house 1-12; `houseSystem === 'Porphyrius'` and the 13-element `cusps` array are asserted directly.
- `test-chart-context.js` (updated): default `houseSystem` assertion changed to `'Porphyrius'`; added an explicit check that `'Placidus'` still works when requested by name.
- `test-report-data.js` (updated): asserts each classical graha's `house` is in range 1-12 and `houseSystem === 'Porphyrius'`, replacing the old `bhava.status === 'SOURCE_REQUIRED'` check.
- Full suite: `npm test` → all 15 scripts pass (14 pre-existing, updated in place rather than adding a new file, since this stage completes rather than adds a calculator).

## TypeScript/lint/build

- `npm run build` → compiles, prerenders all three routes, TypeScript check passes.
- `npm run lint` → still fails on the pre-existing `eslint-config-next`/`eslint-plugin-react` FlatCompat incompatibility recorded in S6's first pass; unrelated to and unchanged by this stage.

## Desktop/mobile validation

Verified live in-browser: submitted the report form and confirmed the Lagna/Graha table's new "பாவம்" column shows real, distinct house numbers (1, 11, 7, 11, 10, 9, 12, 7 for that test birth's Lagna and 7 grahas) instead of the old refusal badge, while the Rahu/Ketu badge correctly still shows "ஆதாரம் தேவை" since that item is untouched by this stage. Zero console errors.

## Backup

Not performed — still no git repository (unchanged since S2/S6-S13).

## Scope note — not retroactively applied elsewhere

S10's Kendradi Bala (Shadbala) and S11's Nabhasa Yoga house-counting were both built using whole-sign house-from-Lagna counting, explicitly because Bhava was unavailable at the time. Now that exact Bhava placement exists, those *could* be revisited to use it — but BPHS's own verses for both (Kendradi Bala v.5, Nabhasa Yoga v.7-17) give no fractional-cusp treatment themselves, unlike Dig-Bala's explicit degree-based language, so whole-sign counting remains a defensible reading of those specific rules, not a stand-in that this stage's fix makes obsolete. Retrofitting them was judged out of scope for "finish S6's Bhava gap" and is recorded here as an available, not mandatory, future refinement — changing already-tested S10/S11 modules without being asked risks introducing regressions into stages that are already closed out.

## Next workflow position

S6 now has only one open item: Rahu/Ketu node convention (Mean vs True). Everything else registered for S6 — birth profile intake, stable chart identity, Lagna, the seven classical grahas' Rasi placement, and now Bhava — is complete. Remaining open items elsewhere are unchanged: S9 (Ashtakavarga transit context), S10 (six Shadbala components), S11 (Raja Yogas/Dosha/Varshaphala). S14 (Capacity expansion) still needs the Owner's explicit go-ahead before any work starts, per the register.
