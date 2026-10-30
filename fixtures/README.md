# Calculation fixtures (VJ-002)

Versioned reference charts with their recorded engine output, so a change to
any calculation shows up as a named field diff instead of a quietly different
chart.

## Layout

- `charts/*.json` — the fixture definitions. Each records the birth **input**,
  the **settings** used (ayanamsha, house system, node type, calendar mode),
  and a **referenceSource** block with the doctrine and page locators the
  values are meant to follow.
- `baseline/*.json` — recorded engine output per fixture, with a SHA-256 hash
  and the `@swisseph/node` version that produced it.
- `computeFixture.js` — builds the observable surface a fixture pins and
  hashes it.
- `record-baseline.js` — re-records baselines. Run deliberately, never to
  silence a failure.

## Commands

```bash
npm run test:fixtures      # compare current engine against baselines
npm run fixtures:record    # re-record baselines after an intended change
```

`npm test` runs the fixture check first, so drift fails before the unit
suites.

## What is pinned

Planetary longitudes, rasi and house placements, all 16 vargas per graha,
Bhinnashtakavarga and Sarvashtakavarga, and the full Vimshottari
Dasha/Bhukti tree with local start and end timestamps.

Degrees are rounded to 6 decimal places — far finer than any doctrinal
boundary, coarse enough that platform float formatting cannot flip a hash.

Nothing time-dependent is pinned. "Current dasha" and transits are excluded
on purpose, so a fixture stays valid indefinitely rather than until tomorrow.

Beyond the recorded values, the test asserts two doctrinal invariants that
hold for every chart: Sarvashtakavarga totals 337, and Vimshottari spans nine
mahadashas with a positive balance at birth. It also asserts the engine
honoured the settings the fixture declared, so a plumbing regression that
silently falls back to Lahiri/Porphyrius cannot pass by matching a baseline
recorded under the same fallback.

## Changing a fixture

Bump `fixtureVersion` in the chart file. The test fails while the baseline
version lags, which forces a deliberate re-record rather than an accidental
overwrite.

## Review status — read this before trusting the numbers

Every baseline is currently marked `ENGINE_BASELINE`: recorded from this
repository's own engine to detect **drift**. That is not the same as being
**correct**. These values have not yet been signed off against an independently
published chart or almanac.

The plan's VJ-002 acceptance asks for a domain reviewer. Until a reviewer
verifies a fixture against an outside source and its `review.status` becomes
`DOMAIN_REVIEWED` with the reviewer and date recorded, these fixtures prove
only that the engine has not changed — not that it was ever right.

## Fixture coverage

| Fixture | Why it exists |
|---|---|
| `chennai-1990-05-15` | Primary regression chart. Moon late in Uttara Ashadha gives a short Sun dasha balance, exercising balance-at-birth. |
| `london-1975-12-02-kp` | Non-default settings (Krishnamurti / Placidus / true node) at 51.5°N, where Placidus cusps diverge from Porphyrius. Stops a settings regression hiding behind defaults. |
| `madurai-2004-08-31-sandhi` | Boundary case near a nakshatra edge, where balance-at-birth and the non-equal D30/D60 divisions are most likely to flip. |
