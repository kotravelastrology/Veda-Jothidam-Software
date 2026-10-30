# Solar returns — annual, monthly, daily, at two places

**Delivered:** 2026-09-28 · Closes ~25 PL9 worksheet rows (061–066, 072–085) ·
`src/report/solarReturns.js` · `/solar-returns`

## What PL9 has that this did not

Eighteen worksheets for solar returns — Annual, Monthly and Daily Solar, three
layouts each, at the natal place and at the local place — plus the three-month
and three-day overviews. This software covered exactly one of them: the annual
return at the birthplace, with the solver written inline in `varshaphala.js`
and hardcoded to a whole number of years.

They are one calculation with three step sizes and two sets of coordinates.

## Astronomy and doctrine are not the same claim

This is the distinction the module is built around, and the two halves are
treated differently on purpose.

**Astronomy.** *"When does the Sun next reach sidereal longitude L?"* has one
answer. `findSunAtLongitude` bisects the ephemeris for it, and the test checks
each result by asking the ephemeris back where the Sun actually was at the
instant returned — an independent check rather than a restatement. Accuracy is
about **1e-6°**, four thousandths of an arcsecond.

**Doctrine.** *Which* longitude defines a month or a day is a convention, and a
convention has to come from a text:

| Kind | Step | Status |
|---|---|---|
| Annual — வருஷ பிரவேசம் | 360° (the natal longitude itself) | **VERIFIED** — unambiguous, only one reading exists |
| Monthly — மாத பிரவேசம் | 30° | **CONVENTION_UNVERIFIED** |
| Daily — தின பிரவேசம் | 360 ÷ 365.25636 ≈ 0.985609° | **CONVENTION_UNVERIFIED** |

`assertReturnPromotable` refuses the unverified two unless the caller passes
`allowUnverified`, and the page states the step size and its status above the
table. Same pattern as VJ-027: a method that cannot be sourced is named,
declared and held back rather than quietly shipped.

**Place.** Casting the same instant for the birthplace or for where the native
lives now is purely mechanical — one moment, two sets of coordinates. No
doctrine, so no label.

## What the results show

The physics comes through, and it is worth seeing rather than assuming:

- **Solar months are not equal.** For the 1990 fixture they run **29.45 to
  31.45 days**: the Sun covers 30° fastest near perihelion in early January.
  A solver that divided the year into twelve equal parts would be days out.
- **A solar "day" is not 24 hours.** The step is the Sun's *mean* daily
  motion, so in May each step takes about **1.022 days**. Over a full year they
  average back to one day. The page says so rather than letting it look like a
  bug.
- **The natal/local pair differs only in the Lagna.** Every graha sits at the
  same longitude — it is one moment — but Chennai and London gave Mithuna
  28°25' against Vrishabha 3°31', and **all nine grahas fell in different
  houses**. That difference is the entire reason PL9 prints the pair, so the
  page counts it per row.

## One design decision worth recording

Each step is solved from the *mean rate* near its own expected instant, never
chained from the previous solved instant. Chaining would accumulate the
solver's residual across a long daily series.

And `findSunAtLongitude` steps to the estimated crossing before bracketing,
rather than widening a window outwards. The Sun passes a given longitude once a
year, so a target can be half a year away; the first implementation widened
four days at a time and failed outright on a target 95 days out. Stepping first
also made the whole test run in 0.24s instead of minutes.

## Verified

`npm test` green including `test-solar-returns.js`; typecheck at its baseline
of 20. Browser-verified at `/solar-returns` with Chennai birth and London as
the local place.

## Not done

- **The monthly and daily conventions need a text.** That is the only thing
  standing between these and a client report.
- **Tithi Pravesh** (PL9 069–070) is a different return entirely — the Moon's
  phase rather than the Sun's longitude — and is not implemented.
- **The overview worksheets** (eight-year, three-month, three-day: PL9 067–068,
  084–085) are layouts over these same instants and are not built.
- Only the Lagna and graha houses are compared between the two places; the
  full varshaphala apparatus (Muntha, Varshesha, Patyayini) still runs only on
  the annual chart in `varshaphala.js`, which this module does not yet feed.
