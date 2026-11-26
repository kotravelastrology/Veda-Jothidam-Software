# S5 — Daily Muhurtham (Backend: Neutral Time Windows)

Status: BACKEND IMPLEMENTED, TESTED, AND CROSS-CHECKED. UI (colourful public cards, event-type filters, mobile/desktop layouts) is the remaining part of S5 and has not been started — see "Scope note" below.

## Source check

Same verified source as S3: S1-B, *Panchangam Calculations* (Karanam Ramakumar). New loci within it, visually confirmed this stage:
- File pages 22-23: exact weekday-indexed multiplier tables for Rahu Kalam, Gulika Kalam and Yamagandam (`start = sunrise + dayDuration × multiplier`, `duration = dayDuration × 0.125`), and the Durmuhurtham weekday table (1 or 2 windows per day; Tuesday's second window is measured from sunset using night duration, all others from sunrise using day duration; window duration is always `dayDuration × 0.8/12`).
- File pages 20-21: Amrita Gadiya (Amrit Kaal) and Varjyam formula (`start = nakshatra start + (x/24) × nakshatra duration`, `duration = nakshatra duration × 1.6/24`) and the full 27-nakshatra table of `x` values, including Moola's two Varjyam windows.
- File pages 24-27: the book's own fully worked example — Shillong (25°35′N 91°53′E), 21-6-2009, a Sunday — used directly as this stage's regression check (see Tests).

**Abhijit Muhurta is explicitly not covered** by this source (confirmed by a full-text scan of all 27 pages in S3/S5 work); it is returned as `SOURCE_REQUIRED` rather than computed from an unverified rule, per PLAN-001.

## Implementation

- `src/ephemeris/siderealPositions.js`: added `sunsetJulianDay`, mirroring the existing `sunriseJulianDay`.
- `src/panchangam/kalams.js` (new): `calculateKalams` (Rahu/Gulika/Yamagandam/Durmuhurtham) and `calculateAmritKaalVarjyam` (nakshatra-scaled Amrit Kaal/Varjyam, including Moola's two windows). Both run through S2's `attachSource`.
- `src/panchangam/tirukanitaPanchangam.js`: extended each limb's result with raw `startJulianDay`/`endJulianDay` (previously only formatted local strings) and exported `weekdayIndexAt`, so downstream calculators reuse the same boundary-search results instead of recomputing.
- `src/panchangam/muhurtham.js` (new): `calculateDailyMuhurtham(chartContext)` composes the S3 Tirukanita Panchangam with kalams and Amrit Kaal/Varjyam, and returns Abhijit Muhurta as the registered refusal state.
- This is the "neutral time windows" scope only (WORKFLOW-REGISTER-001 S5's own phrase) — personalised event-muhurtham matching (Tarabala/Chandrabala/Panchaka from S1-E, B. V. Raman) needs a birth profile and is deferred to whichever later stage introduces birth profiles (S6+).

## Tests

- `test-muhurtham.js` (new): reproduces the book's own worked example (Shillong, 21-6-2009) — computed Rahu Kalam (16:33–18:17) lands within 4 minutes of the book's stated 16:37–18:20, using this implementation's own Swiss-Ephemeris sunrise/sunset rather than the book's 2009-era stated values, so a small gap is expected and this margin was chosen deliberately, not tuned to pass. Also checks Erode 2026-09-05 structurally (non-zero windows, Durmuhurtham count, Amrit Kaal/Varjyam present, Abhijit Muhurta refusal shape).
- All prior suites (`test-swiss-ephemeris.js`, `test-chart-context.js`, `test-tirukanita-panchangam.js`, `test-vakya-panchangam.js`) still pass, unchanged.
- Full suite: `npm test` → all five scripts pass.

## External cross-check (additional, beyond the book's own example)

Fetched drikpanchang.com for 2026-09-05 (New Delhi, a different location from this session's Erode fixture): Rahu Kalam 09:10–10:45, Yamaganda 13:54–15:29, Gulika Kalam 06:01–07:36. This implementation's Erode result: Rahu Kalam 09:13–10:46, Yamagandam 13:50–15:22, Gulika Kalam 06:09–07:41 — all three within a few minutes despite the location difference, consistent with the multiplier logic being correct rather than location-coincidental.

## TypeScript/lint/build

Not applicable — plain Node.js, unchanged since S1-C.

## Desktop/mobile validation

Not applicable yet — no UI exists. This is the open remainder of S5.

## Backup

Not performed — same open item as S2/S3; no git repository or backup target configured yet.

## Scope note: S5 is only half done

WORKFLOW-REGISTER-001 describes S5 as "colourful public cards, event-type filters, neutral time windows and mobile/desktop layouts." This record covers the neutral-time-windows backend only. The UI half — an actual page a non-expert can open and read, in Tamil-first, colourful, mobile-and-desktop-responsive cards — has not been started, and this project currently has no frontend framework configured at all (plain Node.js CLI-style library so far). Building that UI is a materially different kind of work (framework choice, visual design, responsive layout) from the calculation work done in S1-S5-backend, and is the natural next concrete step.

## Next workflow position

Build the S5 UI: choose and set up a frontend (a Next.js app would match the sibling AstrologicLab worktrees' stack without touching those legacy repositories, per PLAN-001's read-only rule on legacy repos), then design the daily Panchangam + Muhurtham card layout consuming `calculateTirukanitaPanchangam` and `calculateDailyMuhurtham`, with `SOURCE_REQUIRED` results (Vakya mode, Abhijit Muhurta) rendered as an honest "தேவை" state rather than hidden or faked.
