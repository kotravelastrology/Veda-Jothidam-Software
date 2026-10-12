# An event's own muhurta rules — entering a new house (2026-10-11), upanayana (2026-10-12)

`src/report/eventMuhurtaTables.js` (the books' rules) · `src/report/eventMuhurta.js`
(pure: the codes for a moment) · `test-event-muhurta.js` with
`fixtures/event-muhurta/books.json`. Used by `/muhurta-stars` (event
"கிரகப்பிரவேசம்") and `/muhurta` (purpose "House Warming").

## Entering a newly built house — nine books

| Book | Words | Pages |
|---|---|---|
| Shridhar (default) | 2136 | §27.16, pp.732-738 |
| Muhurta Chintamani | 1329 | ch.13, slokas 1-6, pp.313-316 (one OCR copy counted) |
| Wilhelm | 1252 | pp.242-246 |
| Raman | 711 | PDF pp.44-45 |
| Joshi | 632 | pp.122-124 |
| Kalyanraman | 587 | vol.2 pp.195-196 |
| Rangacharya | 411 | ch.VII pp.107-108 |
| Vashistha | 259 | pp.123-124 |
| Agarwal | 74 | p.326 |

Each book's reading is computed: the lunar month (amanta — from new moon to new
moon, named by the Sun's sign at the new moon; Shridhar p.236, Wilhelm),
Uttarayana (required or preferred), the stars (good, middling), the tithis, the
weekdays, the Kumbha chakra (the Moon's star counted from the Sun's), the lagna
(signs, middling signs, an upachaya from birth as an alternative, a movable
lagna only with a Taurus navamsa or — Rangacharya — a benefic navamsa and an
upachaya), a benefic's navamsa (Wilhelm), the empty houses, the Moon's places,
combust Jupiter or Venus. MC's sloka 13.1 ("…स्याद्वेशनं द्वाःस्थमृदुध्रुवोडुभिः
जन्मर्क्षलग्नोपचयोदये स्थिरे") is quoted in the source.

The door's direction is an input on `/muhurta-stars`: with it, the door's tithi
class (Poorna east, Nanda south, Bhadra west, Jaya north), the Sun "on the left"
(east 8-12, south 5-9, west 2-6, north 11-3 from the lagna) and the stars facing
the door (good too for MC, Shridhar, Joshi, Kalyanraman) apply.

Codes ending in `_MID` mark a middling or preferred point and do not reject.
Our readings, recorded in the notes:

- "Benefics in … and malefics in 3, 6, 11" — every benefic (Mercury, Jupiter,
  Venus) and every malefic (Sun, Mars, Saturn) at once — are marked, not
  rejecting: for the Erode test birth over 60 days from 2027-01-20 the malefic
  rule alone blocks 85,662 of 86,400 minutes; Wilhelm calls them "best" and
  Shridhar §13.7 "fortification". The owner decides.
- Door tithis are binding when a door is chosen.
- Rangacharya's Kalasa chakra counts 26 (4 evil, 8 good, 8 evil, 6 good): 5-12 and
  21-26 are taken as good. Vashistha only names it.
- Kalyanraman counts 8 stars; his alphabetical list adds five more — the 8 are
  taken. Vashistha's list prints Ashlesha; kept as printed.

On `/muhurta-stars` the event takes the general lagna checks of "another
auspicious act" (8th from birth, Kartari, Gandanta, shadvarga, … Shridhar §13.10)
with the event's own rules in place of the general rule (MC p.79: "Lagna Shuddhi
is done according to the nature of the Muhurta"). The engine adds to each piece
its month, the Sun's sign and star and every book's panchanga codes (`ev`), and
to each stretch a 12th field into `eventTable` (every book's lagna and weekday
codes, the Sun's house).

For the Erode birth from 2027-01-20 (60 days), the books' own rules pass
466 (Rangacharya) to 1,322 (Vashistha) lagna minutes with the star; with every
general lagna check none — §13.10's retrograde birth lord and udaya-asta close it.

## Upanayana — nine books (added 2026-10-12)

| Book | Words | Pages |
|---|---|---|
| Kalyanraman (default) | 8480 | vol.2 pp.103-124 — a compilation of many texts |
| Shridhar | 3443 | §17.9, pp.421-431 |
| Wilhelm | 3029 | pp.292-300 |
| Muhurta Chintamani | 2701 | ch.5 slokas 39-57, pp.136-144 (one OCR copy counted) |
| Joshi | 968 | pp.59-62 |
| Rangacharya | 861 | pp.77-80 |
| Raman | 742 | PDF pp.20-21 |
| Agarwal | 391 | pp.307, 309-310 |
| Vashistha | 265 | pp.91-92 (Vedha, ch.8 p.93) |

Kalyanraman's reading is what he states generally: the summary on p.103, the
"generally" lines, and items 9-14; his item 8 opens "Others want …" and is left
to the books that hold it (Joshi). The rules, each book's own (all page images
read): the lunar and solar months, Harishayana (Ashadha Shukla 11 – Kartika
Shukla 11), the stars, the tithis (good and middling), Anadhyaya (1, 8, 14,
full and new Moon; Ashadha S10, Jyeshtha S2, Pausha S11, Magha S12; the Sankranti
tithi), Galagraha (Krishna 4, 7, 8, 9, 13, 14, Amavasya, Shukla 1), the stars
counted from the birth star to avoid (Shridhar, Wilhelm), yogas (Shridhar),
Vishti (Shridhar §6.3), Vedha (Pancha or Sapta Shalaka), Mrityu bana, the
weekdays (Wednesday with Mercury combust, Monday in the dark half), the part of
the day (thirds of sunrise–sunset; noon), Pradosha (MC V.55: the day's 12th,
6th or 3rd tithi ending before midnight, 1½ or 1 prahara into the night), the
lagna signs and navamsa, the 8th, planets kept out of houses, the Moon in the
lagna (Taurus/Cancer, or Cancer with Jupiter), the Moon's navamsa, conjunctions
with the Sun, Mars, Saturn (MC V.52), Jupiter, the Sun and the Moon from the
birth Moon's sign with each book's exceptions (own, exalted or friend's sign or
navamsa, vargottama, Chaitra), Rangacharya's vimsopaka table, Agarwal's roga
panchaka. Each book's rules are listed on the page in Tamil (`linesTa`).

The engine adds the karana (cuts at every half-tithi), the Sankranti tithi, the
part of the day (cuts at a third, a half and two-thirds of the day) and
Pradosha; pieces carry every book's codes and are cut where they change.

Our readings: night is rejected for every book (Vashistha does not say);
Anadhyaya's "1st" takes both halves, so Krishna 1 falls where Wilhelm,
Shridhar and MC call it good; Shridhar's navamsas include Virgo; his "malefics
in 1, 6, 8, 12" drops the 6th; Rangacharya's table graded as his marriage table
(below 5 rejected, 5-10 middling) with the Rahu/Ketu row for Rahu; Agarwal's
panchaka with tithis 1-30; the after-the-13th-day rule by the Sun's 13th degree.
Shown, not judged: the age (the running year from birth; the books' years by
varna), varna and Veda lords, the eldest son's Jyeshtha, the birth month.

`/muhurta` judges upanayana at sunrise with the rules a sunrise can judge
alone (month, solar month, Harishayana, star, tithi, Anadhyaya, Galagraha,
yoga, Vishti, weekday); the rest need the child's chart and are on
`/muhurta-stars`.

Measured over 60 days from 2027-01-20 at Erode (best times with every check):
for a child born 2019-03-10 (in the 8th year), Kalyanraman 3, Rangacharya 7,
Vashistha 7, the others 0; for the adult test birth of 1990, Kalyanraman 0 —
Ketu sits 8th from the birth Moon (Sagittarius) all 60 days.

## /muhurta rebuilt

Its per-purpose lists ("classical convention") had no page behind them and are
removed. House entry is judged by the chosen book at sunrise (month, star,
tithi, weekday, Kumbha chakra; verdict உத்தமம் / நல்லது / தவிர்க்க). The other
purposes show their panchanga with "ஆதாரம் தேவை / SOURCE REQUIRED" until their
rules are read; marriage points to `/muhurta-stars`. Shridhar's lists are
narrow — about one day in sixty passes at sunrise.

## Not done

Travel (direction, Parigha danda, Dik shoola, ghata tithis …), education,
business, medical treatment and the other events; an old house
(the books' second list); Yogini, Kala Rahu, forenoon, the wife's pregnancy.
