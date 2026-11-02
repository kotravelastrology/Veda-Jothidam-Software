# PL9 multi-sample audit (2026-11-04)

Five Parashara's Light printouts were compared page by page with the 88-page book (`/book`): Arjun (12 May 1983 15:05 Bengalooru, `HC4 Arjun full.pdf`, English, 360-day dasha year),
meera (14 Oct 2019 08:31 Stavanger, `meera_HC2.pdf`, 25 pages, year about 365.2422), Kotravel V (15 Nov 1973 08:15 Erode: `vkotra hc4.pdf` 88 pages Lahiri 08:15:41,
`KP2+ kotravel.pdf` 23 pages Lahiri, `KOTRAVEL_HP1.pdf` 56 pages with the KP ayanamsha) and the aniruddha sample of the earlier work. Each printout is a different PL9 setting
(ayanamsha, dasha year): judge a chart only on its own.

Method: every page of the book is built for each birth and its numbers (dates to within a day) are compared with the PDF's text (the scratchpad scripts `buildall.js`, `compare.py`,
`side.py`, `rows.py`); components were then isolated per chart. Regression tests: `test-shadbala-pl9.js`, `test-pl9-reductions.js`, `test-avakhada-extra.js`, and the updated page tests.

## Fixed (verified on three or more charts)

| Page | What was wrong | Now |
|---|---|---|
| all | the book ignored the settings' ayanamsha, house system and node type (always Lahiri), and the birth seconds | passed to every chart context |
| 1 | sunrise was the upper limb; PL9's is the Sun's centre on the horizon (`ctx.sunrise`): Ishtkaal, tithi/nakshatra/yoga/karana ghatis, sunrise degree | disc centre; sample's 06:01:42 and 17:53:35 reproduced |
| 1 | printed ayanamsha was the mean one; PL9 prints the true one (nutation); sidereal time lacked the equation of the equinoxes and the +24 h before sunrise (29:14:37) | true ayanamsha, apparent sidereal time |
| 1 | dasha balance was in dasha years; PL9 prints the calendar time from the birth date to the end of the birth dasha (Arjun 6y 6m 26d, not 6y 8m 2d) | `calendarAge.js`, used on every dasha page and in "From x to y" headings |
| 1 | time zone printed with the wrong sign and no daylight correction | `-05:30:00` and `00:00:00`; meera `-01:00:00` and `01:00:00` |
| 1 | Bhayat, Bhabhog not built; Kartikadi year and month not built; Chaitradi lunar month was the amanta one | Bhayat/Bhabhog in ghatis; Chaitradi = purnimanta, Kartikadi = amanta, both by the Hindu day's sunrise tithi (Kotravel 1973 is one month off in PL9, see open) |
| 1 | Varga, Yunja, Hansak, Naamakshar, Paya (Rashi), Paya (Nakshatra) not built | built: Vishnu Bhaskar ch.9 (Yunja), Shanker Adawal ch.11 (Paya of the nakshatra), the traditional vargas and pada syllables; all four printouts reproduced |
| 2 | Rahu/Ketu 19" off (mean node referred to the mean equinox, Swiss sidereal flag takes the true ayanamsha) | nutation put back in `nodeLongitude` |
| 7 | sunrise (upper limb) for the Gulikaadi portions; wording "mid-day" | disc centre; "between mid-day and sun-set" |
| 8 | Equal Bhava chart put the Ascendant at the start of the first house; PL9 at its middle; header lines missing | middle; birth header added |
| 11 | Sthana Bala (Saptavargaja, Drekkana), Paksha (Moon, Mercury), Naisargika, moolatrikona only inside its degrees | `reading: 'pl9'` in `calculateShadbala`: Ochcha, Saptavargaja, Ojhayugma, Kendradi, Drekkana, Sthana, Dig, Paksha, Tri-Bhaga, Varsha, Maasa, Vaara, Hora, Naisargika identical to the paisa on Arjun, meera and the sample |
| 12 | Rahu/Ketu not built; values off the slab houses printed nothing; Saturn's cells near his 3rd and 10th | nodes aspect as Jupiter does; "- (26)"; Saturn twice the degrees from the boundary: 72 of 72 cells on three charts |
| 17 | Virgo's Rashi multiplier was 5; PL9 and BPHS (Santhanam vol.2 ch.69 p.879) have 6; Ekadhipatya treated a sign with only the Lagna as vacant | 24 of 24 grids and pindas on three charts |
| 33-37 | Ashtottari antardasha subdivided over its lord's years, not its own length; ran to 96 years, PL9 to 100; the settings' dasha year was ignored on Ashtottari and Yogini | corrected; Arjun and Kotravel pages equal |
| 20-46, 62-78 | labels as above; rare dasha pages cut at 120 years (PL9 prints every page in full); headings print whole years | corrected |
| 48-61 | strength of a sign against its seventh (sub-period start): PL9's ladder is occupied/vacant, more grahas, graha of greater degree, lord of greater degree, then the sign itself; Shoola dasha runs through the zodiac from the stronger of lagna and seventh, parts from its own sign; Narayana start by the same ladder | Chara, Sthira, Narayana #1, Kendradi #1, Shoola equal on Arjun; Kotravel Chara, Sthira, Shoola equal |
| 81-82 | seconds rounded; Uranus, Neptune, Pluto, Fortuna, Lagna and Moon sub lords, balance by the KP Moon, KP ayanamsha missing | built (Fortuna Vir 02:07:47, balance 6y 5m 5d reproduced) |
| 83-88 | annual chart cast at the minute, not the second (Ascendant 10' off), time in IST for any birth place, Muntha without degree | cast for the return's second, in the birth zone; Muntha printed with its degree |

## Open (stated, not hidden)

1. **Shad Bala parts that are PL9's own approximations**: Nata-Unnata, Ayana (declination as if the longitude were sidereal + about 24.4, varying by chart), Chesta of Mars, Mercury,
   Jupiter, Venus, Saturn, Drik Bala (Jupiter -93.76 on Arjun). Neither the BPHS nor Raman reproduces them; totals, ranks, Ishta/Kashta and Bhava Bala therefore differ from PL9's.
2. **Navamsha dasha start**: Arjun Sagittarius, the sample Aries, Kotravel Aquarius. The "9th from the lagna" inference fits only the sample; none of 100+ candidate points fits all three.
3. **Rath's years for particular signs on Kotravel** (Narayana, Drig, Kendradi): Scorpio (Mars against Ketu) and Sagittarius (Jupiter debilitated, zero years) differ; second-cycle pages (52, 54, 58, 60)
   follow the Rath/Koch rule where the sample's own pages are inconsistent. Arjun's Drig page ends with Gemini and Pisces repeated where the rule gives Aquarius and Scorpio.
4. **Varshesha (year lord)**: neither the Tajika Bhushana selection nor the "roles" one reproduces PL9's choice for more than about half the years; the lord PL9 chooses is always one of the five office holders.
   Annual-chart Ascendants drift a few minutes of arc from PL9's in the later decades (return time differs by seconds).
5. **Kotravel 1973 lunar months**: PL9 prints Chaitradi Kartika, Kartikadi Ashvina; the calendar (Sewell's rules, amanta Kartika from 26 Oct) gives Margashirsha and Kartika. Meera, Arjun and the sample agree with the rule.
6. **Smaller**: sunset degree (PL9 differs by 10"-31" from the Sun's true motion), upagraha/special-lagna seconds (up to 10"), the Sookshma pages' time of day (30 minutes), Saturn transit dates one day late
   (PL9's are UT dates?), Arjun's KP Sun printed a day early by PL9 (its Fortuna uses the right Sun), sample p.37 last antardashas.

## Not built yet

- Page 7: Indu Lagna, Beeja/Kshetra Sphuta and its odd/even evaluation, Yogi point, Yogi, Avayogi/Duplicate Yogi, 64th Navamsha, 22nd Drekkana (the 8th sign from the Drekkana sign of the lagna/Moon, from the data), Sarpa Dreshkana.
- KOTRAVEL_HP1: Mangala dosha, Sade Sati with remedies, gemstone recommendation, and the long interpretation pages (the printout is 56 pages; the book has the 88 of the HC4 set).
- meera's "Vimshottari (Short)" and "Yogini (Short)" layouts (their dates agree with the detailed pages already built).
