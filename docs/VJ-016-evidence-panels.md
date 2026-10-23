# VJ-016 — natal / varga / bala evidence panels

**Delivered:** 2026-09-27 · Deps VJ-004, VJ-015 met · Acceptance: *shared
snapshot; values agree in chart/table/report*

`/evidence`, reachable from Ctrl+K.

## Agreement by construction, not by checking

The acceptance asks that values agree across chart, table and report. The way
to guarantee that is not to compare three renderings but to leave them nothing
to disagree about: `computeEvidenceSnapshot()` produces **one** VJ-006
`ChartSnapshot`, and all three panels read it.

Any panel that recomputed could drift the moment settings differed, or simply
because it ran a second later. Pages elsewhere in the app each compute their
own chart; here they cannot.

## The panels

| Panel | Shows | Source cited |
|---|---|---|
| ஜனன நிலை | South/North Indian chart + table of longitude, rasi, degree, house | BPHS Ch.3-4 (S6) |
| வர்கம் | Any of 15 vargas as chart + table | BPHS Ch.6 vv.1-41 (S8) |
| பலம் | Sarvashtakavarga and Shadbala (Sthana / Dig) | Practical Ashtakavarga Table-1 (S9); BPHS Ch.27 (S10) |

Every panel lists the rule it rests on with its **page locator**, taken from
the provenance the calculators already stamp via `attachSource` — not written
by hand here.

The bala panel deliberately shows **no Shadbala total** and says why: BPHS's
Ayana Bala verses and table do not reconcile, so the engine returns
`SOURCE_REQUIRED`. A panel inventing a total would be the F01 defect again.

## Completing VJ-022's evidence picker

VJ-022 could store evidence links and a `snapshotId`, but nothing produced
either. This page does: tick the rules a reading rests on, add a summary, and
`citeEvidenceInConsultation()` stores the snapshot against the profile
revision and records a consultation citing exactly those rules.

The note is then bound to an immutable snapshot rather than to "whatever that
chart looks like now" — the ADR-07 property VJ-022 was built for.

Verified end to end: cited two rules, and the library shows the consultation
bound to revision 1 and snapshot `719a8876`, with the snapshot stored and each
cited rule carrying its page locator.

## A bug this found: engine version under bundling

`ChartSnapshot` records the engine version, and the version is part of the
snapshot id. `engineVersion()` read `package.json` via a path relative to
`__dirname`, which does not survive Next.js bundling — the app reported
`unknown` while tests reported `1.3.1`, so **the same chart had two different
snapshot identities** depending on where it was computed. A stored report
could then fail to match a recomputation for no astrological reason.

Now resolved through `require.resolve` with a `process.cwd()` fallback. After
the fix the browser and `test-evidence-snapshot.js` produce the *same* id,
`719a8876baf4651f`, which is the strongest available evidence that app and
tests compute identically.

## Tested

`npm run test:evidence` asserts the acceptance rather than restating it:

- the same request reproduces the same `snapshotId`, and a different ayanamsha
  produces a different one;
- for every graha, `RASI_NAMES[rasiIndex]` equals the `rasi` the table prints,
  and the longitude reconstructs the same rasi — so the chart's placement and
  the table's label cannot diverge;
- the same for all 15 vargas, including the Lagna row;
- Sarvashtakavarga rows sum to the printed total, the total is the classical
  337, and **each rasi's Bhinna columns sum to its Sarva value**, so two bala
  views cannot disagree;
- Shadbala totals stay `SOURCE_REQUIRED` for every planet;
- every applied evidence entry carries a page locator.

## Not done yet

- The report rendering is the third "view" in the acceptance wording, and the
  existing `/report` page still computes independently. Pointing it at the same
  snapshot is the remaining step, and belongs with VJ-019.
- The bala panel shows Sthana and Dig only; the other components are computed
  and stored in the snapshot but not yet surfaced.
