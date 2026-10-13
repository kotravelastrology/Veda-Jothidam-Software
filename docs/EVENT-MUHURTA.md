# An event's own muhurta rules — entering a new house (2026-10-11), upanayana (2026-10-12), travel, vidyarambha and education (2026-10-13)

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

## Travel — eight books (added 2026-10-13)

| Book | Words | Pages |
|---|---|---|
| Shridhar (default) | 18112 | ch.23, pp.611-666 |
| Muhurta Chintamani | 16536 | ch.11, pp.235-287 (one OCR copy counted) |
| Wilhelm | 7634 | pp.304-322 |
| Joshi | 4375 | ch.11, pp.126-141 |
| Kalyanraman | 4304 | vol.2 pp.204-215 |
| Raman | 1908 | ch.XIV, PDF pp.49-51 (panchaka PDF p.8, Nakshatra Panchaka p.9) |
| Rangacharya | 1510 | ch.VIII, pp.109-116 |
| Vashistha | 994 | pp.126-132 |

Agarwal has no travel section. The direction is an input (`direction`, 'E' …
'NE'; the page's பயணத் திசை switch recomputes); without it the direction rules
are not computed. A four-direction rule covers the corner after each direction
(Shridhar p.613); the two halves (ayana, Parigha) are E, SE, N, NE against S, SW, W,
NW; front, right, behind and left are taken facing the direction of travel.

The rules (each book's own; all page images read): the stars, with the cruel
stars' first ghatis of 60 (MC XI.12; Wilhelm's and Raman's own lists) — rejected
inside them, middling after; the first pada (Wilhelm, Raman); the tithis (good,
bad, and for Shridhar, Raman and Rangacharya the unnamed ones middling); the
weekdays and Wilhelm's/Rangacharya's lord-in-upachaya release; the tara counts;
Chandra bala (Joshi, Kalyanraman); Vishti, Vyatipata, Vaidhriti and Parigha's
first half (54 half-yogas); the solar month and the middle third of Cancer and
Leo; Sankranti; Holanta, the months and the weak Moon (Joshi, Kalyanraman);
Ghaata — month, tithi class, weekday, star, pada, the Moon's sign, lagna — from
each book's table (they differ in the month, Taurus's pada and Rangacharya's
lagnas); and with a direction: Tithi Shoola, the tithi classes by direction
(Rikta and the new Moon any way), Yogini (MC's eight-direction map; Wilhelm adds
Kalaprakasika's paksha table; MC, Joshi, Kalyanraman bar the front and the left,
Shridhar the front and the right), Nakshatra Shoola, Vaar Shoola with each book's
ghati release (Kalaprakasika's; Shridhar's table 23.3; Rangacharya's), Kona Shoola
and Kantaka, Kaala and Paasha, the ayana, the Moon's direction by sign (behind,
left), Parigha danda (the Digdwar stars free), Venus in front (rising — Shridhar's
print reversed —, sphere, star; blind while the Moon is in Revati–Krittika 1),
Mercury and Mars in front by house (Shridhar's method b), Rahu's halves (28 stars
with Abhijit: Mrita rejected, Kartari and Grasta middling or rejected), the
Panchaka and Abhijit muhurta southward, Kaala Shoola by the stars of each third of
the day and the night, Vaar Rahu (Vashistha), the digdwar lagna, Lalatika
(Kalyanraman's print: Mercury west, Jupiter only in the 2nd), Chandra Kantaka,
Mahadala, Sarvanka, Trianka, the travel panchaka (Raman: Chora rejected, the
others marked, Raja ignored), Vashistha's lagnas by tithi class; the lagna signs and
navamsas, the houses (MC XI.56), the 6th/8th lords in the lagna, a retrograde
planet in a kendra, the weekday's lord retrograde or set, Venus retrograde,
combust or debilitated, Mars and Mercury retrograde or combust (Wilhelm), the
Moon alone and not in the birth signs, the lagna not the birth lagna or the 6th
from birth (Shridhar), not the birth lagna or its 5th, 7th, 9th (Raman), and the
kendras' benefics.

`secondary`: what a book itself sets after its main rules is marked, not
rejected — Wilhelm p.305 (basic factors first, the specific travel doshas "as
many as possible"), Joshi pp.130/136 (Chandra/Tara, the Moon in front, Vaar and
Nakshatra Shoola, lagna shuddhi first; in urgency the rest may be left),
Kalyanraman pp.204/211 (Panchanga, Dik and Nakshatra Shoola, lagna, Chandra and
Tara first), and for Shridhar what is outside his p.616 failure list (the solar
month, Ghaata month, Kaala-Paasha, ayana, Kaala Shoola, a set weekday lord, the
kendras).

The engine adds: the Moon's star cut at 11, 13, 14, 16 and 21 ghatis of 60 (16
cuts a star), half-yogas, Venus's side of the Sun, Rahu's place among the 28
stars; lagna stretches cut at the night's thirds, at 8, 12, 15, 16, 20, 22 ghatis
after sunrise and at the Abhijit muhurta (the 8th of the day's 15).

Measured at Erode, 60 days, the 1990 test birth, with every check on the page
(Latta, the person's stars, tara, chandra bala, general lagna shuddhi): from
2027-01-20 going east — Shridhar 0, MC 0, Wilhelm 0 (Mars retrograde all 60
days), Joshi 15 minutes (1 day), Kalyanraman 167 (4), Raman 823 (12),
Rangacharya 0, Vashistha 233 (2); from 2027-06-01 east — Shridhar, MC, Wilhelm 0,
Joshi 78 (2), Kalyanraman 94 (2), Raman 178 (5). The three longest books leave
nothing in any direction: each factor rejects its expected share (the Moon's
direction ~52%, the tara 45%, Rahu's Mrita 42%, the tithi classes 43%, a
retrograde planet in a kendra ~58% …) and together they close every window —
Joshi's "only journey one can afford is the 'Last Journey'". An owner decision.

`/muhurta` judges travel at sunrise without a direction (star and its ghatis,
tithi, months, yoga, Vishti, weekday, Holanta); the rest are on `/muhurta-stars`.

## Vidyarambha (Aksharabhyasa) — nine books (added 2026-10-13)

| Book | Words | Pages |
|---|---|---|
| Kalyanraman (default) | 2542 | vol.2 pp.94-101 — a compilation |
| Wilhelm | 632 | pp.231-233 |
| Vashistha | 534 | pp.82-83 ("Starting Education (General)": the child's first reading and writing) |
| Shridhar | 230 | §17.11.1, pp.435-436 |
| Agarwal | 207 | pp.309, 328 |
| Joshi | 188 | pp.58-59 |
| Muhurta Chintamani | 173 | sloka 5/37, pp.134-135 (one OCR copy counted) |
| Raman | 141 | PDF p.19 |
| Rangacharya | 135 | pp.76-77 |

The child's first letters, before upanayana. Starting education after upanayana
(Shridhar §17.11.2, MC 5/38, Wilhelm "Vidya & Upavidya", Joshi ch.VIII, Kalyanraman
ch.4.1, Vashistha's "main line of education") is a separate event, not built yet.

Kalyanraman's reading is his table and his "in general" lines: 18 stars with
Abhijit, the tithis, Wednesday–Friday (Monday, Tuesday, Saturday "strictly
avoided"; Sunday "some hesitation"), the yogas of his list, no Vishti or fixed
karana, Uttarayana preferred, the Kumbha month avoided, movable lagnas good, dual
middling, fixed rejected, the 8th empty, no malefic in the 2nd or 5th, Mercury,
Jupiter, Venus not combust, Praatasandhya / aparahna / Sayamsandhya rejected and
the night's last third allowed, and Vijayadashami: "nothing need be considered
further". Vijayadashami is a day, sunrise to sunrise at the place: the one on which
Ashvin Shukla 10 runs six ghatis or more after sunrise, else the day before
(`vijayadashamiDays`; 2026: 21 October at Chennai).

MC 5/37's Sanskrit carries two things its English leaves out: "रवावुदक्" (the
Sun in Uttarayana) and "सतां दिने" (the benefics' days — Wednesday, Thursday,
Friday, our reading; Kalyanraman: "MC does not admit Monday"). Our readings:
Shridhar's "2,3,6,9,12 signs" with "fixed sign prohibited" — Taurus middling; his
tithis in the bright half (Acharya Shridhar), the dark half's middling;
Rangacharya's printed "Mithuna" among the stars read as Ardra (MC's list, Gemini's
star); night rejected where a book is silent. The engine adds the fixed karanas,
the Moon in Abhijit, the planets' navamsa signs (Shridhar: no Sun or Mars in the
rising navamsa) and Vijayadashami's day (pieces cut at its sunrises).

Measured at Erode for a child born 2021-03-10 (the 5th year from 2025-03-10),
60 days, every check on the page: from 2026-01-15 — Kalyanraman 0 (Mercury
combust 65% of the time, Jupiter or Venus 56%), Joshi 2 days, MC 2, Shridhar 1,
Raman 1; from 2026-10-05 — Kalyanraman 4 days (Vijayadashami among them), the
Uttarayana books 0.

`/muhurta` judges it as "education" at sunrise (star, Abhijit, tithi, months,
yoga, karanas, weekday, Vijayadashami's day); "Ritual" no longer borrows it.

## Starting education after upanayana — seven books (added 2026-10-13)

| Book | Words | Pages |
|---|---|---|
| Wilhelm (default) | 1038 | pp.233-237 "Vidya & Upavidya" (subject stars and yogas included) |
| Shridhar | 863 | §17.11.2-3, pp.436-438 |
| Kalyanraman | 313 | vol.2 pp.151-152 |
| Joshi | 222 | ch.8, p.96 |
| Vashistha | 153 | pp.84-85 "Starting main line of education" |
| Muhurta Chintamani | 147 | sloka 5/38, p.135 |
| Rangacharya | 70 | ch.IX pp.118-119 |

Raman and Agarwal have no such section. The general rules only; the books'
subject-by-subject stars (grammar, logic, astrology, mathematics, medicine,
archery, music, law, painting …) are listed, not computed. New: J.V.'s Matrika
chakra (Shridhar; marked) and MC's "lagna lord a benefic" — in the English
commentary, not in the verse (marked); the navamsas of Mars and Saturn avoided
(Wilhelm, Shridhar); a benefic in the 3rd, 6th or 11th "will certainly cause
obstructions" (Shridhar, rejected); a malefic in the 4th (Wilhelm, rejected).

Measured at Erode for a child born 2013-06-20, 60 days, every check: from
2027-02-01 Wilhelm 6 days, Shridhar 3, Kalyanraman 14, MC 6, Rangacharya 11;
from 2027-06-01 Wilhelm 0 (Jupiter or Venus combust), Kalyanraman 7.

`/muhurta` has it as its own purpose ("கல்வி தொடக்கம்", `study`).

## /muhurta rebuilt

Its per-purpose lists ("classical convention") had no page behind them and are
removed. House entry is judged by the chosen book at sunrise (month, star,
tithi, weekday, Kumbha chakra; verdict உத்தமம் / நல்லது / தவிர்க்க). The other
purposes show their panchanga with "ஆதாரம் தேவை / SOURCE REQUIRED" until their
rules are read; marriage points to `/muhurta-stars`. Shridhar's lists are
narrow — about one day in sixty passes at sunrise.

## Not done

Business, medical treatment and the other events; an old house (the books'
second list); the subject-by-subject education stars; for house entry: Yogini, Kala Rahu,
forenoon, the wife's pregnancy. For travel: omens, Trinavami, eclipses, the
equinox days, kshaya / adhika months, horas, velas, the month–tithi table,
Khanda / Yamardha / Muhurta Rahu, Vaar Yogini, dawn / dusk / midnight kaala
bala, planetary war, the lagna lord's other vargas, Rangacharya's 6-ghati
release of the Ghaata tithi, Vashistha's tithi yatra chakra, victory yogas.
