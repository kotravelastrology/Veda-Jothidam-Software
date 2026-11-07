# Yearly transit overview, South Indian (PL9 104)

Page `/yearly-transit`, engine `src/chart/yearlyTransit.js`, test `test-yearly-transit.js`. Pure astronomy (Swiss Ephemeris) on top of
`graphicalEphemeris.js`; no book. The birth chart is in the middle of a 4 x 4 grid that mirrors the South Indian signs; beside each sign
are the stays of the planets in it during the calendar year.

## What PL9's screen shows (the audit chart, year 2026, evidence E379)
One entry per stay in a sign, cut only at a sign ingress: Mercury in Aquarius "3 Feb to 10 Apr" is one entry although it turned retrograde
on 26 Feb and direct on 21 Mar. An entry is marked R when the planet is retrograde as the stay begins, and (D) stands before the end date
when that planet turns direct inside the stay ("MeR: Jul 7 to (D) Aug 5": the station is on 23 July UT, the stay ends on 5 August).
A stay that begins direct is unmarked even if the planet later turns retrograde in it. "Sa entire year" when a planet never leaves a sign.

`test-yearly-transit.js` reproduces PL9's lines for Aries, Taurus, Gemini, Cancer, Virgo, Libra, Scorpio, Sagittarius, Capricorn,
Aquarius and Pisces, entry for entry (51 lines), from the ephemeris.

## Where this differs from PL9, and why
- **Dates are UT days in PL9.** Its Pisces entry for the Sun is "Mar 14" (14 March 19:33 UT = 15 March 01:03 IST). The page offers UT
  (PL9's) or the birth place's local day; local is the default.
- **Jupiter and Saturn carry no retrograde mark in PL9.** Jupiter was retrograde on 1 January 2026 and is printed "Ju: Jan 1 to Jun 1"; Saturn
  is printed "entire year" though retrograde from July. One screen cannot say whether PL9 omits the slow planets or only the first stay of the
  year, so the "PL9 போல்" switch marks Mars, Mercury, Venus and the nodes only. By default every planet is marked.
- **Leo, Jupiter.** PL9 prints "Ju: Oct 31 to Nov 26" and then has no further entry for Jupiter; the ephemeris keeps Jupiter in Leo to the end
  of the year (it turns retrograde about 11 November inside Leo). Left as the ephemeris has it.
- The stations inside each stay (which PL9 leaves out) are in the entry's tooltip.

The Moon is not included, as in PL9.
