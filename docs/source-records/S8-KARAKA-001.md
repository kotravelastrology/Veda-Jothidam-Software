# S8 (continued) — Karaka References

Status: S8 NOW FULLY COMPLETE (Varga half from S8-VARGA-CHARTS-001.md + Karaka half here). Naisargika Karaka, Bhava Karaka and Yoga Karaka implemented, tested, and wired into the S12 report builder. Chara Karaka explicitly deferred (Jaimini Jyotish, out of PLAN-001's current scope). Working tree only — no commit/push/backup (no git repository yet, unchanged since S2/S6-S13).

## Source check

BPHS Chapter 32, "Planetary Karakatwa (Indications)" (file pages 264-271 / printed pages 254-261), was read in full and two pages visually rendered and confirmed (printed pages 257 and 261, matching the file/printed page numbering already established for this same PDF copy in S6/S7/S8/S9/S10/S11).

**A scope question was checked before implementing anything, not assumed:** the chapter opens (v.1-17) with "Atmakaraka etc." — a set of 7-8 variable, degree-ranked significators. This is Chara Karaka, the defining analytical technique of Jaimini Jyotish. PLAN-001 explicitly defers Jaimini Jyotish ("separate future authorization and method contract required"), and WORKFLOW-REGISTER-001 describes S8's Karaka scope as "source-attested significations" — language matching *fixed* significations, not Jaimini's variable ones. Even though the Chara Karaka verses happen to sit in this same admitted BPHS copy, implementing them would quietly cross the Jaimini deferral boundary just because of where they happen to be printed. **Chara Karaka is therefore not implemented**, and is returned as an explicit `SOURCE_REQUIRED` naming exactly why, rather than silently built or silently omitted.

The rest of the chapter (v.18-34) gives three separate, purely Parashari concepts, each implemented:

- **Naisargika (constant) Karaka**, v.22-24 (file page 267 / printed page 257) — the fixed planet-to-life-area table (Sun=father, Moon=mother, Mars=siblings, Mercury=maternal relatives, Jupiter=children, Venus=spouse, Saturn=longevity). The chapter's own commentary calls this table "as normally discussed in standard literature on astrology," which is why it — rather than the chapter's *other* table — was adopted as the implemented convention.
- **A second, distinct table exists in the same chapter** (v.18-21, same pages): a "stronger of Sun/Venus" and "stronger of Moon/Mars" comparative rule for father/mother, Jupiter=paternal grandfather (not children), Venus=husband, Saturn=sons, plus a Ketu row. BPHS does not reconcile the two verse-sets itself. Per this project's source-divergence rule ("one explicit default convention; alternatives remain separate and are never silently blended"), only v.22-24 (the one the source itself flags as standard) is implemented; v.18-21 is recorded in the code's own comments, not blended in.
- **Bhava (house) Karaka**, v.31-34 (file page 271 / printed page 261) — the fixed house-to-planet table (1st=Sun, 2nd=Jupiter, ... 12th=Saturn): which planet's "portfolio" each house's core matter falls under, independent of chart-specific rulership or occupation.
- **Yoga Karaka**, v.25-30 (file pages 267-268 / printed pages 257-258) — a planet ruling both a kendra (1st/4th/7th/10th) and a trikona (1st/5th/9th) sign from Lagna becomes an especially significant "mutual co-worker" planet. This is rasi-*lordship* logic (which sign a planet rules), not rasi-*occupation* logic (which house a planet sits in) — so, unlike much of S6, it has **no dependency on S6's still-open Sripati Bhava question**.

## Implementation

- `src/chart/karaka.js`: `calculateKarakas(lagnaRasiIndex)` returns `naisargika` (constant table), `bhava` (constant table), `yoga` (computed from Lagna's rasi via standard sign-rulership), and `charaKaraka` (`sourceRequired`, naming the Jaimini-deferral reason). Wrapped in `attachSource` citing the exact chapter/verse/page range.
- `src/report/reportData.js` — wired `calculateKarakas` in as a new `karaka` field, so it's reachable from the report builder rather than an orphaned module.
- `app/report/ReportBuilder.tsx` — added a "காரகங்கள்" (Karakas) section: the Naisargika and Bhava tables side by side, the Yoga Karaka result, and the honest "ஆதாரம் தேவை" badge for Chara Karaka with its Jaimini-deferral reason shown directly in the UI, not just in the data.

## Tests

`test-karaka.js` (new):
- Naisargika Karaka: exactly 7 entries, spot-checked against the book's own "standard literature" table.
- Bhava Karaka: exactly 12 entries, spot-checked (1st=Sun, 9th=Jupiter, 10th=Mercury, 12th=Saturn).
- **Yoga Karaka, two classically well-known cases, both correctly reproduced**: Aries Lagna → Mars (rules Aries, which is simultaneously the 1st-house kendra and the 1st-house trikona); Taurus Lagna → Venus and **Saturn** (Saturn rules Aquarius, the 10th/kendra, *and* Capricorn, the 9th/trikona — two genuinely different signs, not just the trivial 1st-house self-overlap, confirming the cross-sign detection logic actually works and isn't just matching on the easy case).
- `calculateKarakas` integration check: `charaKaraka` stays an explicit refusal; the other three fields carry through correctly.

`test-report-data.js` (updated) — extended to assert the new `karaka` field's shape is present in the orchestrated report output.

Full suite: `npm test` → all 15 scripts pass (14 pre-existing + this stage's new test).

## TypeScript/lint/build

- `npm run build` → compiles, prerenders all three routes, TypeScript check passes.
- `npm run lint` → still fails on the pre-existing `eslint-config-next`/`eslint-plugin-react` FlatCompat incompatibility recorded in S6; unrelated to and unchanged by this stage.

## Desktop/mobile validation

Verified live in-browser: submitted the report form, confirmed the new "காரகங்கள்" section renders both constant tables with correct values, the Yoga Karaka line shows the correctly computed planet (புதன்/Mercury, for that test birth's Lagna), and the Chara Karaka refusal badge with its Jaimini-deferral explanation displays correctly in the actual UI (not just checked in test data). Zero console errors throughout.

## Backup

Not performed — still no git repository (unchanged since S2/S6-S13).

## Next workflow position

**S8 is now fully complete** — both its Varga half (S8-VARGA-CHARTS-001.md) and its Karaka half (this record) are implemented, tested, and reachable from the report builder. The one deliberate, clearly-flagged exception is Chara Karaka, which stays out of scope pending the Owner's separate authorization for Jaimini Jyotish as its own module (per PLAN-001's existing deferred-scope rule — not a new restriction introduced here). Remaining open items across other stages are unchanged: S6 (Bhava/Rahu-Ketu), S9 (Ashtakavarga transit context), S10 (six Shadbala components), S11 (Raja Yogas/Dosha/Varshaphala). S14 (Capacity expansion) still needs the Owner's explicit go-ahead before any work starts, per the register.
