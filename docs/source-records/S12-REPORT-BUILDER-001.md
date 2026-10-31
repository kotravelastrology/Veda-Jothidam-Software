# S12 — Report Builder

Status: IMPLEMENTED AND VERIFIED IN-BROWSER (checkbox selection, reordering, live preview, print/PDF via browser print). Working tree only — no commit/push/backup (no git repository yet, unchanged since S2/S6-S11).

## Source check

S12 adds no new astrological rule of its own — WORKFLOW-REGISTER-001 describes it as orchestration/UI ("checkbox selection, ordering, preview, PDF, print and export of selected sections only"), not a new calculation. The relevant "source check" here is procedural: every section this stage displays must come from a calculator already source-verified in S6-S11, and every gap those calculators already flag (S6's Bhava/Rahu-Ketu, S10's six Shadbala gaps) must stay visibly `SOURCE_REQUIRED` in the report — never silently dropped or filled in for the sake of a tidier printout. This was checked directly against the actual rendered output (see Desktop/mobile validation below), not just assumed from the calculators' own contracts.

## Implementation

- `src/report/reportData.js` — `buildReportData(birthInput)`: one orchestration call wiring S6 (birth profile + Parashari chart), S7 (Vimshottari Dasha, depth 2), S8 (all 16 vargas, for Lagna and all 7 classical grahas), S9 (Ashtakavarga), S10 (Shadbala, all its already-implemented partial components), and S11 (Nabhasa Yoga) into one report-shaped object. Adds no new calculation logic — it is purely wiring, which is reflected in its test passing without any fixes needed (unlike every other stage's module).
- `src/chart/parashariChart.js` — added `mc` to the returned chart object (the Medium Coeli angle, already computed internally by `calculateChart` but not previously surfaced); needed by `reportData.js` to feed S10's Dig Bala. A small, low-risk addition to an already-tested module, not a behaviour change.
- `src/ephemeris/swissEphemeris.js` — **fixed a real bug found while wiring the report page**: the module read `@swisseph/node`'s own version via `require.resolve('@swisseph/node')` + `fs.readFileSync`, which worked fine in S5's Server Component but crashed with `ENOENT`/`Module not found` inside a Next.js **Server Action** (`app/report/actions.ts`), because Turbopack's server-action bundler treats `@swisseph/node` as an external module in a way that makes `require.resolve()` return a synthetic bundler path instead of a real filesystem path. Replaced with a `__dirname`-relative lookup wrapped in try/catch, falling back to `'unknown'` rather than ever crashing chart calculation over a display-only version string. Confirmed fixed by testing the actual report submission in-browser (see below) — not just inferred from reading the diff.
- `app/report/actions.ts` — a Server Action (`computeReport`) calling `buildReportData` and returning a JSON-serializable copy (Server Actions require plain serializable return values).
- `app/report/ReportBuilder.tsx` — the intake form (name, gender, place, date, time, latitude/longitude, UTC offset) plus, once computed: a checkbox list of the 7 available sections (பிறப்பு விவரங்கள், லக்னம் & கிரக நிலைகள், விம்சோத்தரி தசா, வர்க்க அட்டவணை, அஷ்டகவர்க்கம், சட்பலம், நபஸ யோகங்கள்) with up/down reordering, a live preview rendering exactly the checked sections in the chosen order, and a "அச்சிடு / PDF ஆக சேமி" button using the browser's native print (`window.print()`) — the form/controls carry `print:hidden` so only the preview prints, and the browser's own "Save as PDF" satisfies the PDF/export requirement without a new PDF-generation dependency.
- `app/report/page.tsx` — thin page wrapper.
- Every `SOURCE_REQUIRED` value from the underlying calculators (Bhava, Rahu/Ketu, Shadbala's six open components) renders as a dashed "ஆதாரம் தேவை" badge in the report, consistent with S5's established pattern — confirmed visually in-browser, not just in the data.

## Tests

- `test-report-data.js` (new): profile identity, Lagna + all 7 grahas present with a Rasi, `rahuKetu`/`bhava` still `SOURCE_REQUIRED`, `mc` is a finite number, Dasha has 9 Mahadashas each with a Bhukti array, all 8 chart points have all 16 vargas, Sarvashtakavarga totals exactly 337, Shadbala has partial data for all 7 planets with `shadbalaTotal` still `SOURCE_REQUIRED`, Nabhasa Yoga returns an array, and determinism (same birth input twice → same `chartId` and Lagna).
- Full suite: `npm test` → all 13 scripts pass (12 pre-existing + this stage's new test).
- **In-browser verification** (per this session's own instructions to test UI changes live, not just via `npm test`): started the dev server, submitted the intake form twice (including once in a completely fresh browser tab with an empty console, to rule out stale-log false positives from the first attempt that surfaced the Server-Action bug above), and confirmed every section renders real, correct data — the Ashtakavarga table's per-planet totals (48/39/56/39/49/54/52) match S9's own verified constants exactly; the Varga table shows all 16 divisions for all 8 chart points with correct Tamil sign abbreviations; the Shadbala table shows numeric values alongside "ஆதாரம் தேவை" badges exactly where S10 says data is missing; checkbox toggling and up/down reordering both work; the layout reflows correctly on a 375×812 mobile viewport (the wide Varga table scrolls horizontally within its own container rather than breaking the page).

## TypeScript/lint/build

- `npm run build` → compiles, prerenders both routes (`/` and `/report`) successfully, TypeScript check passes.
- `npm run lint` → still fails on the pre-existing `eslint-config-next`/`eslint-plugin-react` FlatCompat incompatibility recorded in S6; unrelated to and unchanged by S12.

## Desktop/mobile validation

Performed and passed this stage (S12 is the second UI-bearing stage after S5): desktop screenshot, mobile (375×812) screenshot, checkbox/reorder interaction, and a full form-submit-to-rendered-report round trip, all confirmed live in the Browser pane as described above.

## Backup

Not performed — still no git repository (unchanged since S2/S6-S11).

## Next workflow position

S12 gives a working, checkbox-driven, reorderable, printable report over everything S6-S11 have verified so far — as those stages close their remaining gaps (S6's Bhava/Rahu-Ketu, S8's Karaka, S9's transit context, S10's six Shadbala items, S11's Raja Yogas/Dosha/Varshaphala), this report automatically picks them up with no further wiring needed, since `reportData.js` passes through whatever each calculator returns. S13 — Consultation layer (explicit request → reading request → direct Owner phone first; no automatic remedy or unsolicited contact) — is the next registered stage.
