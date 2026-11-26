# KP transit (`/kp-transit`)

Source: K.S. Krishnamurti, *Stellar Astrological Reader No. V: Transit (Gocharapala Nirnayam)* (corpus C33; second scan C67). Printed page = PDF page - 34 in the chapters used (printed 151-163 at PDF 185-197;
the page number is also printed on each page). Engine `src/report/kpTransit.js`, page `app/kp-transit`, test `test-kp-transit.js`. Read on the text layer, the 249-sub table and the worked groups checked against it.

## Read
- **Systematic procedure** (printed 151-155): the native's chart, the four-level order of significators (planets in the star of the occupants, the occupants, planets in the star of the owners, the owners; weakest
  of all the planets conjoined with or aspected by those) and a table of what each planet signifies. The book's chart (Bombay, 23-12-1924 21:00 IST) gives Sun 2, 7, 5; Moon 4, 1, 5, 6, 9; Mars 4, 8, 7, 5, 10;
  Mercury 11, 4, 5, 3, 12; Jupiter 7, 5, 6, 9; Venus 4, 11, 7, 8; Saturn 1, 4, 8, 7; Rahu 3, 12, 5, 1, 4; Kethu 8, 10, 5, 7, 4. The module's four-level table equals the book for the seven planets; for the
  nodes it lacks the house 4 the book adds without derivation (a planet "agent" rule of the nodes is not given in a form the module can apply).
- **The ready reckoner** (printed 156-160): the 27 stars with their lords (stars 1, 10, 19 Kethu at 0-13.20, 120-133.20, 240-253.20, and so on). "Whenever any planet transits a star, it offers the matters signified by the houses of
  the star's lord; the source is indicated by the planet transiting; whether it will materialise, and whether it is favourable, is indicated by the sub lord according to the houses signified by the sub lord" (printed 157, 160-161).
  The event does not come on the day of entry: "wait till the significator of the 6th comes to the sub belonging to the significator of 11" (printed 158).
- **Dasa, bhukti, anthra and transit** (printed 161-163): the points of the zodiac whose sign, star and sub lords are the three lords in any order are transited by the planets of the period, the luminaries and the ascendant;
  also by star, sub and sub-sub. All the book's worked groups are reproduced exactly by `dbaPoints` (Venus-Mars-Venus, Mars-Venus-Sun, Mars-Saturn-Mercury with four points, Mars-Kethu-Kethu 0-0.46.40, Venus-Moon-Mercury,
  Mercury-Rahu-Jupiter, Sun-Venus-Mercury). One difference: for Venus, Jupiter, Moon the book says "only two" (209.26.40-210 and 256.13.20-257.20); the table also has Venus sign, Moon star, Jupiter sub at 43.53.20-45.40.
  The book's day-lord stand-ins for Rahu and Kethu (the planet conjoined, the star lord, the sign lord; Rahu-kalam) are described on the page, not applied.
- **Transit of the ascendant and ruling planets** (printed 192-194): the ruling planets of the moment fix the points and the ascendant's arrival there gives the time. The page lists the instants the ascendant reaches the
  points of the running dasa; the ruling-planet working of the example (an electric failure at 6 p.m. on 20-9-1967 at Delhi, the answer 6:53 p.m.) is not built: its selection of the point among the ruling planets is
  the author's judgement, and our ascendant reaches the sub-sub point he names (sidereal 347 43') at 18:57:11 IST where his table of houses gives 18:52:19.

## What the page shows
The reading of the nine transiting bodies (matter, source, outcome), the sensitive points of the running dasa-bhukti-anthra with the instants the Sun, the Moon (within a month) and the ascendant (within 24 hours, for the place
chosen) enter them, and the star ready reckoner of the chart. Rahu and Kethu are the mean node (Krishnamurti ayanamsha). No prediction.

## Not built
The chapters on Western and Hindu transit for individual charts (printed xvii-xxix, by planet), the significance of each star and sub for each lagna (printed 40-110), the lucky-timing sections (cards, horse racing,
tenders, lottery, printed 195-228), and the ruling-planet working of the ascendant transit. Reader I (C64), Reader II (C65) and KP-Ezine (C69) are not yet read.

## What each star signifies to each lagna (Reader V printed pp.40-110, 2026-10-27)

`src/report/kpLagnaStars.js`, shown on /kp-transit. For the chart's lagna: the nine star groups (three stars per lord), the houses the lord owns from the lagna, and Rahu and Ketu as agents. The houses are derived from ownership and were compared sign by sign with the lists the book prints for all twelve lagnas (`test-kp-lagna-stars.js`). The author's remarks and examples under each lagna are his observations and are not reproduced.
