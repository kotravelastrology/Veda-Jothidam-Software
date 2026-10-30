# The band of years — the 35-year cycle of planets (2026-10-11)

`/band-of-years` · `src/report/bandOfYears.js` (computation) ·
`src/report/bandOfYearsTables.js` · `test-band-of-years.js` with
`fixtures/band-of-years/books.json`.

Lal Kitab gives each planet a span of years — Jupiter 6, Sun 2, Moon 1,
Venus 3, Mars 6, Mercury 2, Saturn 6, Rahu 6, Ketu 3 — that together make 35,
and the cycle runs three times over a life. Three books, by words on it:

| Book | Words | What it gives |
|---|---|---|
| Raj Kumar, *Charisma of Planets* (Table No.3, para 10.1, §6.5) | 902 | Saturn's band from birth: Saturn 1-6, Rahu 7-12, Ketu 13-15, Jupiter 16-21, Sun 22-23, Moon 24, Venus 25-27, Mars 28-33, Mercury 34-35; the ruler's progression round the zodiac during its band; the ruler in transit |
| B.M. Gosvami, *Lal Kitab* §§20-21, pp.77-78 | 444 | "Supposing Jupiter's circulation started from the birthday": Jupiter 1-6 … Ketu 33-35; "it is also possible that the first planet could be say Saturn"; each band in three parts with an intervening planet |
| U.C. Mahajan, *Lal Kitab* §§XIII-XV, pp.24-26 | 326 | The same, with the same three-part table; "total years" Jupiter 16, Sun 22, Moon 24, Venus 25, Mars 28, Mercury 34, Saturn 36, Rahu 42, Ketu 48 |

Two orders are computed: Saturn first (Raj Kumar, default) and Jupiter first
(the Lal Kitab books' example). A year is 365.25 days from the birth moment,
as in Raj Kumar's arithmetic.

Raj Kumar's progression: during its band the ruler moves from its birth
longitude once round the zodiac at an even pace, 1/12 of the band in each sign,
the birth sign in two stages. The page lists the stages and the windows when
the progressed ruler is in a birth planet's sign or nakshatra or aspects its
sign ("through sign, Nakshtra, Navamsha or Parashari aspects"; the navamsa
contact is not computed — he does not say how). §6.5: the ruler causes an
event "during its transit over the relevant house" when it is the event's
karaka in birth and transit; the page shows the ruler's transit sign, its houses
from the birth lagna and Moon and its contacts — no verdict.

Findings:

- Raj Kumar's example (born 16 Oct 1946, Venus 6° Scorpio): he says that on the
  12 Feb 1973 wedding "progressed Venus was traversing Libra". By his own
  arithmetic — the 25th year from 16 Oct 1970, 73.04 days, then 91.3 days a sign
  — Venus is in Leo that day; Libra is 28 Jun – 27 Sep 1973. His remainder
  "365.25×3 − 1077.34 = 18.34" is 18.41 (exactly, 18.26).
- Mahajan's "total years" are, for every planet, the first year of its band with
  Saturn first (Saturn, Rahu, Ketu in the second cycle) — our observation; he
  does not say so. Raj Kumar's "Ketu ... ruler of 48-50th year" fits too.
- Gosvami and Mahajan: with Saturn first "Jupiter would start from the 7th year"
  and the second cycle "from 41 years complete" — this fits neither order and is
  not computed.

Tested on Table 3, the Ketu 48-50 statement, Mahajan's column, the two books'
three-part tables (identical), Raj Kumar's example (the 25th year, 91.3 and
73.04 days, the stages), the contact windows recomputed from the progressed
longitude, and the transit sign against the ephemeris. Both Lal Kitab books were
added to the curated library (73 entries) and the registry.
