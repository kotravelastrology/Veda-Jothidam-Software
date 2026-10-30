# Animated transits (PL9 093, 098, 099)

Page `/animated-transits`; stepping engine `src/report/animatedTransit.js`; the moment is read against the birth chart by `eventChart.js`.
Tests: `test-animated-transit.js`.

- **Wheel** (098): houses numbered from the birth lagna, counter-clockwise, house 1 low on the right as PL9 draws it; birth planets inside, the
  moment's planets outside, a retrograde planet marked வ. A South Indian chart with the transit layer beside it.
- **Tables** (099): the transit planets with degree, sign, nakshatra, pada and nakshatra lord; Kakshas over the birth Ashtakavarga; Tara, Chandra
  from the birth Moon, tithi, yoga, karana; the Vimshottari chain (five levels), Yogini and Ashtottari at the moment.
- **Partner** (093): a second person's chart beside the first, at the same moment.
- **Stepping** (PL9's twelve units, each with - and +): 10 Years, Year, Month (the calendar field moves at the same clock time, clamped to the
  month's last day), Week, Day, Hours, 10 Minutes, Minutes, 10 Seconds, Seconds, and two that follow the sky: **Ascendant** (the next or previous
  instant the lagna enters a sign) and **Navamsha** (each 3 deg 20 min of the lagna), found by bisection at the place.
- **Modes**: Stop (by hand), Realtime (the clock, every 2 seconds), Animate (steps the chosen unit forward at the chosen speed). A step is not
  begun while the previous calculation is still running.

Checked against PL9's "Gochara (Transits)" table for 18 Sep 2026 09:08:16 (Bengaluru): the nine planets' degrees to the arc-minute and their
nakshatras, the lagna 14 deg Libra, retrograde Saturn; and the Kakshas, Tara, tithi, yoga, karana and dashas as in docs/EVENT-CHARTS.md.

Differences: the pada-lord column of PL9's table ("3,Ra/Me/Ju") is the star lord / sub lord / sub-sub lord; here only the nakshatra lord is shown.
PL9's navamsha and navarasa dasha rows ("Narayana", Chara) are not shown. Each step costs about 0.2 s on the server, so Animate at the fastest
speed may skip frames. The same Vimshottari fifth-level and Sthira differences as on the event page apply.
