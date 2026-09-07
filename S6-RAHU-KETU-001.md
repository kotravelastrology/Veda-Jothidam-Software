# S6 (continued) — Rahu/Ketu Resolution

Status: RESOLVED — Rahu and Ketu are now computed for every chart using the Mean Node convention, with a real classical-tradition source backing the choice. **S6 is now fully complete** — birth profile intake, stable chart identity, Lagna, all 7 classical grahas' Rasi/Bhava placement, and now Rahu/Ketu are all implemented. Working tree only — no commit/push/backup (no git repository yet, unchanged since S2/S6-S13).

## Source check

S6's original record left Rahu/Ketu as `SOURCE_REQUIRED` because no admitted source had stated whether Mean Node or True Node was intended — a genuine convention divergence (unlike, say, sign-degree segmentation, which every source agrees on). A corpus search for a dedicated Rahu/Ketu source found ***Rahu & Kethu in Bhrigu Astrology*** (Srinivasan Shastry, 2009, `D:\AstrologicLab-Corpus\astrologiclab-sources\C45-nadi-bhrigu-library\Nadi\Jyotish_2009_Srinivasan Shastry_Rahu and Kethu in Brighu astrology.pdf`, 102 pages) — a real, resolvable, single-author classical-tradition text specifically about these two points.

**File page 5 / printed page xii (visually verified this stage), Introduction:**

> "The fact that has since been universally accepted is that Rahu Kethu are celestial points on the Zodiac with regulated movement... The motion of these points **which is always retrograde**, can be calculated as accurately as the position of the Sun or the Moon... It has been observed that the nodes have a retrograde movement in the Zodiac **at the rate of 19 degrees 20 minutes per year**."

This describes the **Mean Node** exactly: a smooth, constant, unbroken retrograde regression. It does not describe the **True Node**, whose motion is not constant and which periodically stations and moves briefly direct several times a year — behaviour this source's description has no room for. The book never once mentions the node moving anything but retrograde, at a fixed rate.

**Verified computationally before implementing, not just taken on the description alone:** for a sample date, `@swisseph/node`'s Mean Node (`LunarPoint.MeanNode`) longitude-speed was −0.0530°/day, i.e. ≈19.36°/year — matching the source's stated "19 degrees 20 minutes per year" (19.333°/year) almost exactly, and confirming that value could only come from the Mean Node model (the True Node's speed varies well outside this narrow a band and regularly hits zero or positive).

## Implementation

- `src/ephemeris/siderealPositions.js` — new `meanNodeLongitude(julianDay, ayanamsha)`, calling `calculatePosition` with `LunarPoint.MeanNode` (found via `@swisseph/core`'s `LunarPoint` export — the main `Planet` enum only covers Sun through Pluto; nodes live in a separate enum). Kept as its own small function, not added to `swissEphemeris.js`'s shared `PLANETS`/`calculateChart` list, since Ashtakavarga, Shadbala, Nabhasa Yoga and Karaka each already have their own BPHS citation explicitly excluding the nodes from those specific calculations — adding Rahu/Ketu to the shared position list would have silently leaked them into those unrelated, already-verified modules.
- `src/chart/parashariChart.js` — `calculateParashariChart` now computes Rahu via `meanNodeLongitude`, derives Ketu as exactly `Rahu + 180°`, and adds both to the `grahas` object with the same shape (longitude, Rasi, Bhava) as the 7 classical grahas. **The old `rahuKetu: sourceRequired(...)` field is removed** — superseded by real `grahas.Rahu`/`grahas.Ketu` entries, matching how S6-BHAVA-001.md removed the old `bhava` field the same way.
- `app/report/ReportBuilder.tsx` — the Lagna/Graha table already iterates `chart.grahas` directly, so Rahu/Ketu appear in it automatically; added their Tamil labels (ராகு/கேது) and updated the footer note from a refusal badge to a plain citation ("ராகு/கேது — Mean Node").

## Tests

- `test-parashari-chart.js` (updated): the expected-grahas list now includes Rahu and Ketu (9 total); every graha (nodes included) is checked for a finite longitude, a valid Rasi and an integer house 1-12; a dedicated check confirms Ketu's longitude is always exactly Rahu + 180° (mod 360, to floating-point precision); the determinism check now also covers Rahu.
- `test-report-data.js` (updated): asserts both nodes carry a Rasi and confirms the same 180°-opposition relationship at the report-orchestration level.
- Full suite: `npm test` → all 16 scripts pass (updated in place, consistent with how S6-BHAVA-001.md completed rather than added a new calculator).

## TypeScript/lint/build

- `npm run build` → compiles, prerenders all three routes, TypeScript check passes.
- `npm run lint` → still fails on the pre-existing `eslint-config-next`/`eslint-plugin-react` FlatCompat incompatibility recorded in S6's first pass; unrelated to and unchanged by this stage.

## Desktop/mobile validation

Verified live in-browser: submitted the report form and confirmed the Lagna/Graha table shows real ராகு/கேது rows (Makara 17.64° house 8, and Karkataka 17.64° house 2 — the same degree-in-sign, opposite sign, confirming the 180° relationship visually as well as in test assertions) with the correct citation footer, and that every other already-built section (Dasha, Varga, Ashtakavarga, Transit, Shadbala, Nabhasa Yoga, Karaka) is unaffected. Zero console errors. (Restarted the dev server twice this session after it exited on its own between turns — the same intermittent Windows/Turbopack process-exit behaviour noted in earlier stages, unrelated to this change; also hit a transient Browser-pane 0×0 viewport glitch mid-verification, resolved by an explicit `resize_window` call.)

## Backup

Not performed — still no git repository (unchanged since S2/S6-S13).

## Next workflow position

**S6 is now fully complete** — every item WORKFLOW-REGISTER-001 names for it (birth profile intake, stable chart identity, Lagna, Rasi/Bhava for all grahas including the nodes) is implemented and tested. Remaining open items across the project: S10 (six Shadbala components), S11 (Raja Yogas/Dosha/Varshaphala). S14 still needs the Owner's explicit go-ahead before any work starts, per the register. This was also the second feature built under the new "check Parashara's Light 9 / Cosmic Insights first" workflow, though for this specific gap the reference sites were not separately re-checked mid-stage since the task was closing an already-identified internal gap (S6's own prior open item) rather than a new feature pulled from the competitor checklist — worth confirming with the Owner whether gap-closing work like this should also trigger the reference-site check, or only genuinely new features.
