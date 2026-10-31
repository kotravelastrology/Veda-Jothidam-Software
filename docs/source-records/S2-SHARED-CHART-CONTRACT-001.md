# S2 — Shared Time/Chart-Identity Contract

Status: IMPLEMENTED AND TESTED (working tree only — no commit/push; this project has no git repository yet, and PLAN-001 requires a separately approved frozen patch before any commit/push/release/deployment).

## Source check

S2 depends only on the sources already verified for the first implementation boundary (PLAN-001: "Panchangam + Muhurtham only"):
- S1-B — *Panchangam Calculations*, Karanam Ramakumar (five limbs, sunrise-day boundary).
- S1-E — *Muhurtha*, B. V. Raman (Tarabala/Chandrabala/Panchaka).

No new source was opened for this stage. The Swiss Ephemeris engine decision (S1-C: `@swisseph/node` 1.3.1, Lahiri ayanamsha, Placidus houses) is carried forward as the only currently-supported engine configuration.

## Implementation

- `src/contracts/chartContext.js` — `createChartContext(input)` validates and freezes: date/time fields, IANA timezone + numeric UTC offset (both required, so conversion stays deterministic — matches the existing `swissEphemeris.js` convention), latitude/longitude range checks, place name (optional), ayanamsha (only `Lahiri` admitted, per S1-C), house system (only `Placidus` admitted, per S1-C), calendar mode (`tirukanita` or `vakya` — kept as separate, non-blendable conventions per S1-SOURCE-DISCOVERY-001's convention rule), and day boundary (only `sunrise`, per S1-B's verified rule).
- `attachSource(result, source)` — stamps any calculation result with its exact governing citation (title, author, file, page locus, tradition, convention). Throws `UnsupportedInputError` if any citation field is missing, so a future calculator cannot silently ship a result with no traceable source.
- `sourceRequired(reason)` — the one shared shape for the registered refusal state, returning `{ status: 'SOURCE_REQUIRED', reason, message: 'ஆதாரம் தேவை / SOURCE REQUIRED' }`.
- Unsupported ayanamsha/house system/calendar mode/day boundary, out-of-range latitude/longitude, and missing required fields all throw a typed `UnsupportedInputError` rather than silently defaulting — this is the "missing/unsupported states remain distinct" rule from PLAN-001, expressed in code.

## Tests

- `test-chart-context.js` (new): valid context creation, frozen-object mutation rejection, missing-field rejection for every required field, out-of-range lat/long rejection, unsupported ayanamsha/house-system/calendar-mode rejection, `attachSource` success and missing-citation-field rejection, `sourceRequired` shape check.
- `test-swiss-ephemeris.js` (pre-existing, re-run unchanged): still passes.
- Full suite: `npm test` → both scripts pass (see command output captured in this session; sun longitude, ascendant and chart-context checks all green).

## TypeScript/lint/build

Not applicable — this project is currently plain Node.js (`"type": "commonjs"`, no TypeScript/bundler configured yet, per S1-C). No build step exists to run.

## Desktop/mobile validation

Not applicable — S2 is a backend data contract with no UI surface yet. Will apply from S5 onward (daily Panchangam/Muhurtham UI).

## Backup

Not performed in this session — this project has no git repository and no configured backup target yet. Recorded honestly as an open item rather than a false "done."

## Next registered stage

S3 — Tirukanita Panchangam: Vara, Tithi, Nakshatra, Yoga and Karana with exact start/end times plus sunrise/sunset, built on top of this S2 contract and the S1-B verified source. Every result must go through `attachSource` with the Panchangam Calculations citation; any rule not found at a visually-verified page must return `sourceRequired(...)` instead of a computed guess.
