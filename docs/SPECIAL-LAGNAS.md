# Special lagnas (PL9 "Special Lagnas" 009 / "Alternate Lagnas" 012)

Source: BPHS (Santhanam), chapter 5 "Special Ascendants", vv.1-24, printed pp.62-67.

- Bhava Lagna: Sun at sunrise + one sign per 5 ghatis (15 deg per hour).
- Hora Lagna: Sun at sunrise + one sign per 2.5 ghatis (30 deg per hour).
- Ghatika Lagna: Sun at sunrise + one sign per ghati (75 deg per hour).
- Varnada Lagna: counts of the janma lagna and Hora Lagna (odd sign = its number, even sign = 13 - number) are added; an odd total is counted from Aries, an even total backward from Pisces.
- The planets stay in their birth signs; houses are read from each special lagna (v.9).

Engine `src/chart/specialLagnas.js`, sunrise `src/chart/sunriseBefore.js`, page `/special-lagnas`, test `test-special-lagnas.js`
(reproduces the book's worked examples and PL9's screen for 5 Oct 1990 04:30 IST Chennai within 0.15 deg).

The book does not define sunrise. PL9 agrees with the Sun's centre on the horizon, no refraction ("geometric"), and takes the
previous day's sunrise for a pre-sunrise birth. The Panchangam's "visible" sunrise is offered as a switch; it moves the Ghatika
Lagna by over 3 degrees. Both are shown as printed by their convention; neither is called right.

Fix made on the way: `src/report/jaimini.js` computed Varnada Lagna with an old fold that left an even total uncounted from Pisces
(Pisces instead of Aries in the book's own example); it now uses `varnadaLagna`.

Not built: Moon/Sun charts, Sripati bhava, KP chart (no source decision yet).
