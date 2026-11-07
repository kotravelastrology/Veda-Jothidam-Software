# VJ-017 — deterministic dasha timeline

**Delivered:** 2026-09-27 · Deps VJ-003, VJ-006, VJ-014 met · Acceptance:
*period boundary drill; selected-date replay; cancellation of long scans*

## The determinism defect this fixes

`app/dasha-timeline/actions.ts` called `Date.now()` in the middle of its
computation to decide whether each period was past, current or future. The
same request therefore produced **different output tomorrow**, which is the
same family of problem as F01: a result that changes without its inputs
changing.

It also made the dasha timeline unusable as stored evidence. VJ-016's
`ChartSnapshot` deliberately excludes time-dependent values for exactly this
reason; with a clock read inside, a snapshot could never have included it.

`src/dasha/timeline.js` takes the instant as an argument everywhere and reads
no clock. `computeDashaTimeline(input, asOfMs?)` now takes the reference
instant as a parameter; the default is resolved at the caller's boundary, not
buried in the engine.

## Selected-date replay

`chainAtDate(dasha, date)` returns the full chain of periods active at an
instant — Dasha, Bhukti, Antara, Sookshma, as deep as the tree was built.

The page has a date control: pick any date and see what was running. Verified
in the browser — today gives *Rahu → Sun*, and 2000-06-15 gives *Moon
(1994-12-09 → 2004-12-09) → Saturn (1999-03-11 → 2000-10-09)*.

The test replays the same instant five times and asserts an identical chain,
checks that a `Date` and its ISO string agree, and asserts the requested
instant really does lie inside every level returned.

Outside the 120-year cycle it returns nothing rather than extrapolating.
Inventing a period beyond the cycle would be fabrication.

## Period boundary drill

`boundariesBetween(dasha, fromJd, toJd, { level })` lists crossings at a
chosen level, each carrying the chain of parent lords.

The test asserts the properties that make a drill trustworthy rather than
merely present:

- nine mahadasha starts in a cycle, in order;
- **each start equals the previous end** — the periods tile the cycle with no
  gap and no overlap;
- each mahadasha divides into exactly nine bhuktis that tile it;
- every level of a chain sits inside its parent;
- at an exact boundary instant, the chain names the period that *begins*, not
  the one that ends.

## Cancellation of long scans

`scanForChanges()` steps through time and yields to the event loop
periodically, so an `AbortSignal` is actually honoured rather than checked
only after the work finishes.

The test runs a real 14,610-step scan, then cancels one part-way and asserts
it stopped **early** — comparing steps completed against the full run, rather
than merely that it threw. `ScanCancelled` carries how much work was done, and
an already-aborted signal stops before any work at all. A completed scan is
reproducible.

## Not done yet

- The scanner is a general mechanism; no transit page uses it yet. Wiring it
  to an ingress or aspect search belongs with VJ-018.
- `src/dasha/altDashas.js` still defaults `nowMs = Date.now()`. That is
  injectable rather than buried, so it is honest, but the alternative dasha
  systems should move onto the same explicit-instant convention when touched.
