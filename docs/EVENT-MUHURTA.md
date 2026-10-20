# An event's own muhurta rules — entering a new house (2026-10-11), upanayana (2026-10-12), travel, vidyarambha, education, opening a shop, medicine and surgery (2026-10-13), an old house and the bath after recovery (2026-10-14)

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

## Opening a shop / starting a business — seven books (added 2026-10-13)

| Book | Words | Pages |
|---|---|---|
| Vashistha (default) | 217 | pp.100-101 "7. Vipani karana muhurta" (small-scale business, a shop) |
| Kalyanraman | 190 | vol.2 pp.186-187 "Openings Shops, Opening Commercial Outlets" |
| Wilhelm | 112 | p.193 "Store/Business Opening" |
| Joshi | 83 | ch.9 p.101 "Opening a Shop" |
| Shridhar | 66 | §25.4 p.684 "Opening a shop" (quoting MC) |
| Muhurta Chintamani | 65 | sloka 2/17, p.58 (the shop clause) |
| Rangacharya | 52 | p.128 "Shop Opening" |

Raman and Agarwal have buying and selling only, no shop opening. Six books follow
MC 2/17: not Rikta, not Tuesday, not Aquarius rising; Mitra, Dhruva and Kshipra
stars (Abhijit with them); the Moon and Venus in the lagna; no malefic in the 8th
or 12th; benefics in the 2nd, 10th, 11th. Wilhelm's eleven stars are the same
set without Abhijit; Rangacharya keeps the fixed and soft ones and has no lagna
rule. Vashistha differs most: his own tithis (Shukla 2, 3, 5, 7, 10, 12, 13 and
the full Moon) and sixteen stars, the 8th and 12th empty of every planet, the
Moon and Mercury in the lagna, Jupiter and Venus not combust, Pausha and
Chaturmas, Vyaghata / Vyatipata / Vaidhriti and Bhadra rejected, and the
"Bhurudan" day — Holi, Phalguna's full Moon, is computed (new code `BHURUDAN`);
his "end of month / year Amavasya" is outside his tithis anyway.

Marked, not rejected (our reading): the Moon and Venus (Vashistha: Mercury) in
the lagna — "preferable", "very favorable", "excellent"; the benefics' places.
MC's printed "ध्यायखे" could read 5, 11, 10; its commentary and the other books
say 2, 10, 11, which we use. Not computed: Vashistha's "weak Moon" (no
definition), the karaka planet and Mercury's strength; the large-scale business
rules (Rangacharya, Vashistha p.101), buying, selling and trade-wise stars —
listed in the notes.

Measured at Erode (birth 1990-05-15), 60 days, every check: from 2027-01-20
Vashistha 2 days (Pausha, then a planet in the 8th or 12th), the MC group 10,
Rangacharya 4; from 2027-03-25 Vashistha 3, the MC group 6, Rangacharya 4.

The lagna's marks now show on the page. Every event's `_MID` lagna codes were
computed but never shown on a good lagna; they are now listed after "கவனம்"
(`EVENT_MARK` in `lagnaVerdict`, never rejecting). `/muhurta` judges `business`
at sunrise.

## Taking medicine / beginning treatment — eight books (added 2026-10-13)

| Book | Words | Pages |
|---|---|---|
| Wilhelm (default) | 886 | pp.275-277 "Treatment of disease & taking medicine" (with blood-letting p.269, dental p.272, laxatives p.273) |
| Raman | 633 | ch.XV "Medical Elections", PDF pp.52-53 |
| Shridhar | 328 | §22.3, pp.603-604 |
| Muhurta Chintamani | 218 | sloka 2/15 (p.57), 2/30's blood-letting and purgatives (pp.66-67) |
| Kalyanraman | 215 | vol.2 pp.201-203 |
| Joshi | 106 | ch.13, pp.146-147 |
| Vashistha | 103 | p.133 "Aushadh-Sevana" with its note |
| Rangacharya | 71 | pp.132-133 "Medical matters" |

Counted: treatment and taking medicine, disease by disease, purgatives,
blood-letting and dental work; not the onset-of-disease prognosis, preparing
medicine, the bath after recovery or surgery. Agarwal has the bath only.

Five books follow MC 2/15: Laghu, Mridu and Chara stars and Moola; a dual lagna
with a benefic in it; no planet in the 7th, 8th or 12th; not Rikta or Amavasya;
not the Janma star. Wilhelm and Shridhar call the dual lagna "best" (others
middling) and take the fixed stars as middling (Kalaprakasika, K.P.).
Kalyanraman's own table is stars, tithis and days; MC's lagna rules and the
Janma star are in his notes, so they are marked. Raman gives the stars for
chronic disease only. Vashistha has his own lists, the lagna, 7th, 8th and 12th
free of malefics, and his note's other houses marked, Bhadra rejected.
Rangacharya prints Sunday as good and then "never begin … on Sunday" — middling
here; Thursday is not printed and is rejected.

A benefic in the lagna is marked in every book. MC's verse makes it a
condition (our reading — as for business).

Measured at Erode (birth 1990-05-15), 60 days from 2027-01-20, every check:
Wilhelm and Shridhar 6 days, Raman 10, Kalyanraman 6, Rangacharya 3, MC 1,
Joshi and Vashistha 0 (a dual lagna with the 7th, 8th and 12th empty; Rahu and
Ketu count as planets).

## Surgery — six books (added 2026-10-13)

| Book | Words | Pages |
|---|---|---|
| Wilhelm (default) | 499 | pp.273-275 (surgery, cosmetic surgery) |
| Raman | 194 | PDF p.53 |
| Shridhar | 152 | §22.4, pp.604-605 |
| Vashistha | 65 | p.133 "Shalyakarma" with its note |
| Kalyanraman | 40 | vol.2 p.203 |
| Rangacharya | 32 | p.133 |

MC, Joshi and Agarwal have no surgery section. Wilhelm, Raman and Shridhar's
K.P. take the sharp stars (Ardra, Ashlesha, Jyeshtha, Moola) and Rikta tithis.
Shridhar adds B.J.S.'s eleven stars to them. Kalyanraman leaves out the Rikta
tithis and Saturday.

- **Moon from the birth Moon:** in the same sign, Wilhelm marks it and Raman
  rejects it. Shridhar rejects the 4th, 8th and 12th.
- **New: Mars and Saturn by sign** (`marsSaturn`):
  - Wilhelm: Saturn with Mars or aspecting it (3rd, 7th, 10th) rejects.
  - Raman: a mutual aspect rejects.
- **New: `want`** (places a book asks for — marked): Rangacharya's malefic in
  the 6th, and the Sun and Moon in kendras.
- **Wilhelm's "in addition to treatment":** its 7th and 12th empty are marked.
- **Raman's waxing Moon "when possible":** waning is marked. `/muhurta` now
  takes `krishnaMid` at sunrise.

Not computed:
- Mars "powerful"
- the bhava, lord and tissue planet of the part operated on
- the Moon's sign's body part
- Jupiter and Moon aspecting the lagna
- Ghaata planets
- cosmetic surgery

Measured at Erode, 60 days from 2027-01-20, every check: Wilhelm 3 days,
Kalyanraman 3, Rangacharya 8; Raman, Shridhar and Vashistha 0. At sunrise
(Chennai), Shridhar's three-way rule gives one day in six months: Tuesday,
8 June 2027 (Shukla Chaturthi, Pushya).

`/muhurta` splits the old "medical" purpose into "medical" (medicine) and
"surgery".

## Entering an old house — five books (added 2026-10-14)

| Book | Words | Pages |
|---|---|---|
| Shridhar (default) | 264 | §27.16 (b), pp.732-733 |
| Joshi | 102 | p.124 |
| Wilhelm | 99 | p.246 |
| Muhurta Chintamani | 94 | sloka 13/2 and a line of 13/1's notes, p.314 |
| Agarwal | 16 | p.326 |

An old house is one bought, rented, repaired or rebuilt after fire or flood.
Each book gives its new-house rules plus three changes:
- Kartika, Margashirsha and Shravana are added to the months (MC 13/2:
  "मार्गोर्जयोः श्रावणिकेऽपि").
- Shatabhisha, Pushya, Swati and Dhanishtha are added to the stars.
- Jupiter's and Venus's combustion is not considered ("नावश्यमस्तादिविचारणात्र").

So each reading is built from the same book's new-house reading (`oldHouseOf`).
The new house's middling months become good, and the Uttarayana rule goes.
Shridhar allows Dakshinayana; for the others the added months fall in
Dakshinayana anyway (our reading). Tithis, weekdays, lagna, Kumbha chakra and
the door rules stay the new house's.

Not computed: Shridhar's other quotes — Vasishtha's "panchanga only", M.M.'s
re-entry after a journey or after leaving in fear, and Vedha. Rangacharya
(p.42) only says an old house may be entered during combustion; his new-house
reading has no combustion rule, so there is no separate reading.
Kalyanraman, Raman and Vashistha have no old-house rule.

Measured at Erode, 60 days, every check, new house → old house:
- From 2026-11-10 (Kartika): Joshi 0 → 1 day, Agarwal 0 → 2, Wilhelm 1 → 1.
- From 2027-01-20: Joshi and MC 1 → 3, Agarwal 1 → 3, Shridhar 0 → 1
  (combustion lifted).

`/muhurta` has it as "oldhouse" (பழைய வீட்டில் நுழைதல்).

## The first bath after recovering from illness — eight books (added 2026-10-14)

| Book | Words | Pages |
|---|---|---|
| Shridhar (default) | 251 | §22.5, p.605 |
| Wilhelm | 199 | pp.268-269 |
| Kalyanraman | 186 | vol.2 p.202 |
| Muhurta Chintamani | 128 | sloka 2/40, p.76 |
| Joshi | 89 | p.147 |
| Rangacharya | 72 | p.133 |
| Raman | 70 | PDF pp.53-54 |
| Agarwal | 37 | p.329 |

The books follow two schools.

- **MC 2/40** ("…रिक्ते तिथौ चरतनौ विकवीन्दुवारे … हीने विधौ खलखगैर्भवकेन्द्रकोणे"),
  followed by Shridhar (his first reading), Kalyanraman, Joshi and Rangacharya:
  - all stars but nine (Revati, Punarvasu, the Dhruvas, Magha, Swati, Ashlesha);
  - Rikta tithis;
  - a movable lagna;
  - not Monday or Friday;
  - a weak Moon;
  - malefics in the kendras, konas and 11th.
- **K.P.** (quoted by Shridhar), followed by Wilhelm, Raman and Agarwal:
  - thirteen stars;
  - no Rikta tithi or Amavasya;
  - no Chandrashtama;
  - Tuesday, Wednesday, Thursday;
  - malefics in 3 and 6, benefics in kendras and konas.

Every reading is computed as printed. Where a book seems to have a misprint,
we chose a reading:
- Kalyanraman's and Joshi's printed eighteen stars have Punarvasu and not
  Anuradha (MC's eighteen are the reverse). We kept them as printed.
- Rangacharya prints "Avoid the rikta tithis, Sunday, Tuesday, Wednesday,
  Thursday and Saturday". Taken literally, no weekday would remain, so we read
  it as MC's "good".
- Kalyanraman's note 5 contradicts his note 3 and is not computed. His note 4
  says the Moon "must not be emaciated" (in 4/8/12); that is marked.

Marked, not rejected, as in the other events:
- **The places of malefics and benefics.**
- **The weak Moon (new `moonWeak`):**
  - MC's commentary puts it in the 4th, 8th or 12th house. We count from the
    lagna (our reading); Rangacharya is read the same way.
  - Shridhar counts from the birth Moon.
  - J.V.'s phase rule (Krishna 10 to Shukla 5) is not computed.

Wilhelm's lagna: the signs of Mars, Mercury and Jupiter that are not movable
are good; movable signs are rejected; the rest are middling. Their navamsas
are marked.

Not computed:
- Mars weak in transit
- "the Moon not a malefic"
- the second bath
- going out after recovery

Measured at Erode, 60 days, every check (the MC school / Wilhelm / Raman / Agarwal):
- from 2027-01-20: 0 / 5 / 6 / 7 days
- from 2027-03-25: 3 / 3 / 0 / 4
- from 2027-06-01: 2 / 1 / 3 / 3

`/muhurta` has it as "rogasnana".

## The other acts, family by family (added 2026-10-14)

The owner asked for every act the books give. Each act is an event in
`eventMuhurtaTables.js` with one reading per book, a fixture block under `acts`
in `books.json` (the exact rule keys, names, words, default), and a generic test
(`test-event-muhurta.js`). `/muhurta` lists them as `act:<EVENT>`; the page's
chooser groups them by family. Only the chosen act is computed (`events` option).

**Vehicles** (buying / first drive; making / trade), **clothes and ornaments**
(new clothes, new ornaments, making ornaments, washing, stitching).

**Agriculture** (11 acts): general farm work, first step on the field,
ploughing, sowing, transplanting, trees and creepers, garden / orchard, harvest,
threshing, gathering and storing grain, eating new grain. Shridhar ch.21,
Kalyanraman vol.2 pp.165-183, Wilhelm pp.178-188, Muhurta Chintamani 2/28-37,
Raman ch.XIII, Joshi pp.104-107, Rangacharya pp.125-128, Agarwal p.329.

New engine keys for the farm family:
- **`starCount`** — the Moon's star counted from a planet's (the Sun's: Hala and
  Vriksha chakras; Rahu's: Rahu / Phani chakra; Venus's; Mercury's: Navanna
  chakra), among 27 or among 28 with Abhijit. A count is good, bad, or marked.
  The Sun's, Rahu's (mean node), Venus's and Mercury's stars are passed to every
  piece (and computed at sunrise for `/muhurta`).
- **`agniNakshatra`** (Kalyanraman: the Sun from 20° to 43°20′), **`bhuRajasvala`**
  (B.J.S.: three days from the Sun's entry into Ardra), **`sunStarNot`** (no new
  grain with the Sun in Vishakha), **`karanaOnly`** (Kalyanraman: Bava, Balava,
  Gara), **`varaLordLagna`** (the lagna the weekday lord's), **`moonNavMid`**.

How the chakras differ between books (all computed as printed):
- *Hala chakra, ploughing:*
  - Muhurta Chintamani 2/29: counts 1-8 and 18-25 of 28 (Abhijit in) from the
    Sun's star (printed 3 bad before, 8 good, 9 bad, 8 good).
  - Wilhelm (Kalaprakasika): 3-7, 11-15, 19, 20, 24-26 of 27.
  - Kalyanraman note 14: the Sun's star and the 6-8, 14-16, 22-24th rejected.
  - Rangacharya: 4-6, 10-14, 18-22, 26-27.
  - Shridhar: Narad's table (1-3 bad, 4-6, 7-11, 12-20 death …) as page-read;
    J.V. / B.J.S.'s 28-count marked.
- *Rahu chakra, sowing:* 9-11, 13-15, 17-19, 21-23 from Rahu's star (MC, Wilhelm,
  Shridhar's B.J.S.; Kalyanraman marks it; Rangacharya's print drops a group —
  we read it as MC's 8-3-1-3-1-3-1-3-4).
- *Vriksha chakra, trees:* 4-6, 13-15, 22-27 from the Sun's star (Shridhar's
  B.J.S., Kalyanraman, Joshi, Wilhelm).

**General-list readings.** Where a book has no section for an act but its tithi,
weekday or star-class lists name it (Vashistha, Rangacharya, Raman, MC's notes,
Joshi, Agarwal), a reading is built from the named stars only; named tithis and
weekdays are good and the rest middling. The words counted are the clauses naming
the act, so these rank last. The owner kept this method (2026-10-14).

**The audit (2026-10-14).** The first searches covered only each book's act
chapters. A whole-book search added: Joshi (vehicle trade, gold), Raman (new
clothes, education, moving house), Agarwal (travel's ayana rule, the star classes),
Kalyanraman (washing clothes), and the general lists above.

**Government, service and law** (7 acts, added 2026-10-19): assuming office (coronation / oath,
nine books), meeting a superior (six), joining service (seven), applying for a job (four),
employing a servant (eight), filing a suit (seven), compromise / peace (three). Sources:
Shridhar ch.20, Muhurta Chintamani ch.10 and 2/13, 2/26, Wilhelm pp.237, 250, 279-282, 325-330,
Kalyanraman vol.2 pp.198-199, 220-223, Joshi pp.103, 137-138, 142-143, Vashistha pp.93-100,
Raman ch.X, XVI, XVII, Rangacharya pp.117-118, 132, Agarwal pp.325-326.

New engine keys: `nripBana` (the Sun in the 5th / 14th / 23rd degree — Shridhar's joining a government
service), `rajaPanchaka` (tithi + lagna by 9 leaving 4), `janmaCount` (the day's star counted from the
person's janma star among the 28 with Abhijit: 1-7 and 15-21 good — Shridhar §20.7, employing a servant /
seeking employment), `conj` (Mars, Saturn, Rahu together — the peace books), and `lagna.alt` for the signs
counted from the birth lagna or Moon (the coronation books). Coronation also uses the Sun-count chakra
(Shridhar: the 1st, 2nd, 7th, 13th, 14th and 19th-22nd from the Sun's star lose power or the kingdom).

Akula / Kulakula / Kula (Shridhar §20.9d / §20.21, Joshi, Kalyanraman, Wilhelm — a suit in an Akula star, tithi and weekday is won by the
plaintiff; Kulakula ends in a compromise; Kula is won by the defendant): Akula stars are good, Kulakula
middling, Kula rejected. Wilhelm adds the Chidra tithis and the lagna.

Not computed here: the planets' strength (the Sun, Mars, the lagna and dasha lords), the master's star for
Shridhar's Daas chakra, the master's and servant's yoni and rashi lords, "the master's star not before the
servant's", the caste of the master (Shridhar 20.4), Agarwal's unfit lagna / month / tithi / day tables,
Joshi's eight victory combinations for the plaintiff, the Jeeva / Mrita paksha, criminal cases (Vashistha
"shatru danda", Joshi "punishing enemies"), questioning criminals (Kalyanraman), taking charge on transfer,
dealing with government bodies, and war.

**Money and trade** (11 acts, added 2026-10-19): lending money / pledging (nine books), borrowing
(eight), repaying a debt (five), collecting money due (four), depositing or storing wealth and
investing (six), making a will (two), purchasing goods (seven), selling goods (eight),
speculation (one), lottery and competitions (three), starting accounts and correspondence (two).
Sources: Shridhar §20.16, §20.19, §25.2-25.3 (pp.583-584, 682-684), Muhurta Chintamani 2/16, 2/17,
2/24, 2/27 (pp.57, 58, 62, 64), Wilhelm pp.189-195, Kalyanraman vol.2 pp.217-219, Joshi pp.101,
103, 149, Raman ch.X and XVII (PDF pp.38-39, 55), Rangacharya pp.128-129, Agarwal pp.325, 328,
Vashistha pp.135-136.

The 15 stars Muhurta Chintamani 2/24 rejects for a loan given, buried or kept in a chest —
Teekshna (Ardra, Ashlesha, Jyeshtha, Moola), Mishra (Krittika, Vishakha), Dhruva (Rohini and the
three Uttaras), Ugra (Bharani, Magha and the three Poorvas), with Bhadra karana and Vyatipata —
leave the other twelve for lending (Kalyanraman, Agarwal). Wednesday is barred for lending and
good for depositing and collecting; Tuesday is barred for borrowing and good for repaying; the
days barred for borrowing (Sankranti, Vriddhi yoga, Hasta, Sunday, Tuesday) are the good days to
repay (Shridhar, Joshi, Rangacharya). Purchase has one six-star list in five books (Revati,
Shatabhisha, Ashwini, Swati, Shravana, Chitra) and sale a seven-star list (the three Poorvas,
Vishakha, Krittika, Ashlesha, Bharani) in six; what is bought under a star should not be sold
under it.

New engine keys: `lagnaBirth` for an event (Raman's recovering money due — the muhurta lagna not
the 8th or 9th from the birth lagna or Moon; the key already existed for travel) and `conj` with
different `planets` and `with` lists (Raman: the Moon with Mars or Saturn when borrowing; the Moon
and Mercury with Mars when selling). `CONJ`'s Tamil now names the rule generically, the planets
being printed in the rule line.

Not computed here: Amrita Siddhi yoga (Sunday with Hasta), Dhanishtha Panchaka and the
dwipushkara / tripushkara yogas (Rangacharya's interest business), Wilhelm's Gulika, Pradosha and
Maitra combinations for paying debts and his object-by-object storing rules (metals, fragrant
substances, libraries, silverware), Shridhar's vargottama Jupiter with Mercury and Venus in
quadrants, the recipient's janma rashi for a will, the 8th house's strength (Raman's will), the
Moon's sign for a lender or seller (Raman), the 11th lord in the 12th and Saturn's aspect on the
2nd (lottery), the planet ruling the thing bought or the purpose of a loan (Wilhelm).

Not done in this family: buying land, a house or a shop site, cattle, horses, elephants, jewellery
and utensils (Raman ch.X, Joshi pp.101-102, Shridhar §25.3.4, Vashistha pp.134-135), horse races
(Raman), coining money, treasure hunting and catching a thief (Shridhar §20.17), the division of
property (Shridhar §20.18), tribute and contributions (Wilhelm), transport and chariot works
(Shridhar §25.5).

**Land and property** (5 acts, added 2026-10-19): buying a building site (seven books), buying
farm land (three), buying a house (three), taking possession of land (three), dividing property
(four). Sources: Shridhar §20.18, §21.17, §25.3.4, §27.17.1 (pp.583, 599, 684, 738), Wilhelm
pp.250, 287, Kalyanraman vol.2 p.243, Joshi pp.102, 149, Raman ch.XII and XIII (PDF pp.45, 47),
Rangacharya p.129, Agarwal p.325, Vashistha p.119.

Buying a site has two traditions that barely overlap: Shridhar, Joshi, Vashistha and Rangacharya
give M.G./J.V.'s twelve stars (Mrigashira, Punarvasu, Ashlesha, Magha, Vishakha, Anuradha, the
three Poorvas, Moola, Revati), Nanda and Poorna tithis and Thursday–Friday; Wilhelm, Raman and
Agarwal give fourteen (Ashwini, Rohini, Mrigashira, Punarvasu, Pushya, UPhalguni, Hasta, Swati,
Anuradha, UAshadha, Shravana, Dhanishtha, Shatabhisha, UBhadra), Rikta avoided, and Monday,
Wednesday and Saturday. Both are computed, neither is merged into the other. Dividing property
is the opposite case: Kalyanraman, Joshi, Wilhelm and Shridhar give the same fifteen stars, the
same tithis (2, 3, 5, 7, 10, 11, 13) and the same five weekdays, which a test asserts.

New engine key: `padaOnly` — the Moon only in the named padas of its star. It computes the one
rule the three possession books share: to claim contested land, carry away a handful of its earth
with Cancer rising and the Moon in the 4th pada of Bharani, Ardra, Vishakha (Shridhar and Wilhelm
add Hasta).

Not computed here: the Sun and Ketu in the navamsa lagna (the lagna is), B.D.R.'s arithmetic for
whether a plot is auspicious (Shridhar §27.17.2), the lagna lord with the 7th lord, the 11th lord
in the 12th, and whether a division made at a marriage or by the father needs a muhurta at all.

Not done in this family: starting construction, Bhumi Puja, digging, laying the foundation, bricks,
pillars, door frames, roofs, upper storeys, repairs and whitewashing (Shridhar ch.27, Kalyanraman
pp.190-199, Wilhelm pp.217-232, MC's Griha Arambha chapter, Raman ch.XII, Vashistha ch.10,
Agarwal p.325), wells, tanks and ponds with their Koop and Tadag chakras (Shridhar §21.18),
temples and installing a deity, and town planning.

**House building, part 1** (3 acts, added 2026-10-19): starting construction / Griharambha (eight
books), digging the foundation (four), laying the foundation stone (seven). Sources: Shridhar
§27.2, §27.9, §27.10 (pp.704-727), Wilhelm pp.217-223, Kalyanraman vol.2 pp.190-192, Joshi
pp.114-118, Raman ch.XII (PDF pp.42-43), Rangacharya ch.VI pp.102-104, Vashistha ch.10
pp.120-123, Muhurta Chintamani slokas 15 and 18 (pp.303, 305), Agarwal p.325.

Six books print the same thirteen stars for starting a house — the four Dhruva, the four Mridu,
Shatabhisha, Swati, Dhanishtha, Hasta and Pushya — and a test asserts it. Wilhelm and Raman do
not separate the start from the foundation ("the time of laying the foundation is the most
important time in the construction"), so their one reading stands under both acts. Digging is
separate in Shridhar, Kalyanraman and Joshi: the downward-looking stars plus the construction
stars, a movable lagna, and the earth's sleep.

Two chakras are computed, both counted from the Sun's star: `BHU_SHAYANA` (the earth sleeps at
the 5th, 7th, 9th, 12th, 19th and 26th — all four digging books) and `VASTU_CHAKRA` (only the 8th
to the 18th are good — Vaastusaar through Shridhar, Kalyanraman and Joshi). Both use the existing
`starCount` key.

Not computed here: the Vastu Purusha's posture and the navel spot, Rahu Mukha's digging corner,
the door-direction tables of months, tithis and stars (Wilhelm, MC, Joshi), Saptashalaka vedha,
Aaya-Vyaya and the house's Nadi, the building's lifespan yogas, the owner's gochara from his natal
Moon, the Sun's degrees for the earth's sleep (Wilhelm's version), Siddha and Amrita yoga, and
whether the wife is pregnant.

**House building, part 2** (6 acts, added 2026-10-19): fixing the pillars (four books), the door
frame and hanging the door (five), laying the roof (four), upper storeys (one), repairs,
whitewashing and cleaning (four), wells, tanks and bore-wells (five). Sources: Shridhar §21.18,
§27.12, §27.13.3-4, §27.14-27.15, §27.17.3-4, §27.17.8, Wilhelm pp.223-226, Kalyanraman vol.2
pp.193-195, Joshi pp.116, 119, 121, Raman ch.XII (PDF pp.43, 45), Rangacharya pp.105-106,
Muhurta Chintamani sloka 1/63 (p.63).

Three more chakras are computed from the Sun's star through `starCount`: `STAMBHA_CHAKRA` (the
28 with Abhijit — only the 7th to the 26th, the pillar's centre, are good), `DWAR_CHAKRA` (which
part of the door frame the count falls on; Shridhar's 27-count and Kalyanraman's own list) and
`TADAG_CHAKRA` (the 28 with Abhijit — which counts give water, which give none). Rangacharya's
Vrishabha chakra was added to starting construction at the same time: he counts 7 bad, 11 good,
10 bad over the 28 with Abhijit, where Shridhar's Vastu chakra counts the same shape over 27.

Wilhelm and Raman print the same eight stars for the door frame and the same three for hanging
the door; Kalyanraman and Joshi print the same nine upward-looking stars for the pillars. Tests
assert both. Wilhelm's roof, pillars and doorframe sections each say "in addition to the
guidelines for beginning construction", so his beginning-construction tithis, weekdays and 8th
house carry into them.

Not computed here: the second Dwar chakra counted from Mars and the Kapaat chakra for the door
panels (the print is unreadable), the Koop chakra for a well, the Marjari chakra for cleaning,
Mars's transit star for repairs (the three books' shared prohibition), Dhanishtha's first two
padas for the roof, the direction of the first pillar, the well's direction and shape, and the
depth at which rock will obstruct the water.

**Temple and worship** (8 acts, added 2026-10-19): the whole of Shridhar's chapter 24 plus building
a temple — listening to a religious discourse (one book), taking a mantra initiation (four), making
an idol (one), installing a deity or kumbhabhisheka (five), performing a havan or yajna (five),
Agnyadhaan or establishing the fire (five), starting a yantra-mantra sadhana (two), starting a
temple or hall (two). Sources: Shridhar §24.1-24.7 (pp.667-679), Muhurta Chintamani 2/35-36 and
ch.9, Wilhelm pp.288-292, Kalyanraman vol.2 pp.224-229, Raman ch.XVI, Agarwal p.325, Joshi pp.40-42.

Two more chakras are computed. The **Agni chakra** (Shridhar §24.5, M.C. 2/35) divides the 27 stars
from the Sun's into blocks of three belonging to the Sun, Mercury, Venus, Saturn, the Moon, Mars,
Jupiter, Rahu and Ketu; the ahuti is good only in a benefic's block, and the Chintamani gives an
effect for each of the nine where Shridhar's table omits Rahu and Ketu. The **Katha chakra** (B.J.S.)
counts the day's star from Jupiter's: 1-4 wealth, 5-8 siddhi, 9-12 benefit, 13-16 death, 17-20 fear
from the ruler, the last three moksha. That is 23 counts, so 21-24 go unnamed in the print; only the
eight the book calls bad are rejected. Where the fire rests (the tithi plus one plus the weekday, by
four) is computed under both havan readings.

Three readings each stand under two acts, because the book prints one section for both: Wilhelm's
and Kalyanraman's Agnihotra entry (performing a havan, and Agnyadhaan — the Chintamani's note says
the two names mean one thing), and Wilhelm's "initiation into or beginning a mantra" (the initiation
and the sadhana). Four books print the same ten stars for the fire; tests assert that, and assert
that Kalyanraman's print keeps exactly the four signs the other three bar.

Joshi gives none of these acts a star or tithi list — he names Soma Yagna, Prana Pratishtha, Deeksha
and Havana-Yagna in one list of acts barred while Jupiter or Venus is combust, so that is his
reading for the four, with the combustion computed and the Kshaya-Adhika masa and Jupiter-in-Leo
bars left in the note.

Not computed here: Gurvaditya, Tithi Kshaya and the Dhanu-Meena sankranti for a discourse, the
Chatushka dosha and the per-deity star lists for an installation, Shridhar's second Chintamani fire
count (tithi + weekday + 25 by 3), "Andhyaya" tithis, the eclipse that the print calls specially
good for a mantra, and Wilhelm's favourable sankranti (the engine can only mark a sankranti bad).

**Animals** (8 acts, added 2026-10-19): cattle (four books), horses (six — the widest in the
whole table), elephants (four), goats, sheep and buffaloes (four), keeping pets (five), fish
farming (four), poultry (three), hunting (two). Sources: Shridhar ch.26 (pp.693-699, all thirteen
sections), Wilhelm's Livestock family (pp.250-255), Muhurta Chintamani 2/9-2/10, Kalyanraman vol.2
pp.181-246, Joshi pp.101-105, Raman ch.XIII. Agarwal, Vashistha and Rangacharya have nothing here.

The **Ashva chakra** (Daivyaga Manohar, Shridhar §26.3) is computed: the Moon's star counted from
the Sun's among the 28 with Abhijit, the first fifteen good, the next eleven bad, the last two good
again. Joshi prints the same first fifteen independently, so both readings compute it. J.V.'s
variant — only the first eleven — stays in the note. The **Gaja chakra** (§26.4) is not computed:
the print's number ranges and the elephant's body parts do not line up, so which count means the
mouth and which the heart cannot be read.

Three contradictions are kept as printed rather than smoothed. Shridhar's §26.1 bars Rohini, the
three Uttaras, Chitra and Shravana for quadrupeds, while his own §26.5 and §26.8 recommend exactly
those for bullocks, monkeys and deer; the cow lists are what compute, and the note says so.
Wilhelm calls Saturn's day best for sheep where Shridhar's §26.6 bars it alone of the seven.
Kalyanraman calls the full Moon good for elephants where Shridhar and Wilhelm both bar it, and he
alone recommends the Tikshna stars for training a horse, which every other book bars.

Hunting is the one act in the table where the rules inverse: the Tikshna stars, the Rikta tithis
and the malefic weekdays are the good ones, and the tests assert that. Kalyanraman's preference
for malefic yogas and karanas there is left in the note rather than turned into a rule, since
"prefer" is not the same as "reject the rest". Fish farming is the one animal act where three
books call Tuesday good, against the Tuesday bar that runs through the rest of the family.

The animal's own yoni star is good for keeping or sheltering it in five books, with Wilhelm and
Kalyanraman printing the full table (horse — Ashwini and Shatabhisha, elephant — Bharani and
Revati, and so on). It is not computed, because which animal it is never enters as input.

Not computed here: the Gaja chakra, the yoni star, Shridhar's stable and goad rules (they follow
the house and the Saturday-Capricorn rule), first milking, the half-star rules for sheep and
elephants, catching elephants and snakes, cutting an elephant's teeth, and §26.13 castration
(one book, surgical rather than electional).

**War and state** (10 acts, added 2026-10-19): raising an army and planning its movements (three
books), starting a war (two), making weapons (four), bearing weapons and armour (four), setting up
missiles (two), an army camp and tent (two), tying the dagger — Churika Bandhana (two), a treaty or
friendship (five), minting coins and printing notes (four), catching a thief (three). Sources:
Shridhar §20.8-20.17, Wilhelm's War, Weapons/Armor, Currency, Friendship and Criminals families
(pp.323-332), Muhurta Chintamani 2/19-2/21 and the treaty sloka, Kalyanraman vol.2 pp.187-248,
Joshi p.149, Rangacharya p.36.

Two acts show the closest agreement anywhere in the table. For an **army**, Shridhar, Wilhelm and
Kalyanraman print the same twelve Akul stars, the same Jaya tithis (3, 8, 13) and the same two
weekdays, with no divergence at all; Shridhar calls it collecting an army where the other two call
it planning troop movements, so the three stand as one act. For **minting coins**, four books print
the same four star families (Dhruva, Mridu, Chara and Kshipra), all four reject Monday and Saturday,
and all four want Jupiter and Venus out of combustion. A **treaty** is nearly as close: five books
give Pushya and Anuradha, the 8th or 12th tithi, the Taitila karana and a Venus aspect on the lagna.

This family is where the ordinary rules invert, and the tests assert it. The Tikshna and Ugra stars
and the Rikta tithis — barred almost everywhere else — are the good ones for making a weapon, for
setting up missiles and for catching a thief. Wilhelm argues the inversion explicitly: since the
Vishti karana suits destructive acts, the Rikta tithis must suit them too; but for armour he wants
an ordinary favourable tithi instead. Shridhar's §20.13 carries the same split unresolved — Acharya
Nrisingha calls the Rikta tithis and the Bhadra karana suitable where the Chintamani, in the same
section, bars them. Kalyanraman holds both sides as well: his combatant reading wants benefic stars
and days, his overpowering-enemies reading wants the malefic ones.

Catching a thief is printed in both directions. Shridhar gives it for catching, and notes himself
that the same election would serve a theft but is barred on ethical grounds; Kalyanraman's
Chorakarma and Wilhelm's stealing sections give it for committing one, and those two print the same
eleven stars. Catching is the act's sense here, with the reverse named in the notes.

Rangacharya appears once, through his karana table: he gives the Kaulava karana for making
friendship where the other four books give Taitila, and assigns Taitila to married women instead.

A treaty sits beside the existing **compromise** act (சமரசம், ஒப்பந்தம், சமாதானம்), which already
holds Raman's "Making peace" and Wilhelm's "War - making peace & treaties"; the treaty act takes
Wilhelm's separate "Friendship - establishing" section so that no reading is counted twice, and
Joshi's section, which names both, is noted as standing under either.

Not computed here: all four of Shridhar's direction methods for starting a war (the Vighana Kaal
chakra's diagram does not line up seven weekdays with eight directions, and its heading and its text
state the rule in opposite senses), the Tripushkar yoga, the front Yogini and the Ghata Vaar, Sage
Narada's weapon-length remainder and the weapon's Aya, the omens Shridhar weights heavily for a
thief, and §20.22 filing nomination papers.

**Crafts and trades, part 1** (6 acts, added 2026-10-19): building and launching a boat (three
books), weaving, cloth mills and dyeing (four), pottery (four), painting (four), sculpture and
stonework (three), learning a craft (three). Sources: Shridhar §25.6-25.11, Wilhelm pp.188-253,
Muhurta Chintamani ch.4, Kalyanraman vol.2 pp.154-190, Joshi pp.108-109. Shridhar's chapter 25 runs
to 35 sections, so this family is being built in parts, as the house family was.

This is the closest-agreeing family in the table. **Weaving**: four books print the same eleven
stars — the five Chara, the four Mridu, Rohini and Jyeshtha — with no divergence. **Pottery**: four
books print the same ten, and three of them add the same rule, a movable lagna with Saturn in a
water sign and benefics in the angles. **Learning a craft**: three books print the same sixteen
(Mridu, Dhruva, Kshipra and Chara together) and all three want Mercury or Jupiter in the lagna or
the 10th. **Stonework**: Kalyanraman's and Joshi's fifteen are identical. For a **boat**, the
Chintamani works by exclusion — it bars eight stars and calls the rest good — and the nineteen that
remain are exactly the nineteen Wilhelm names one by one; the tests assert that equivalence.

Shridhar's §25.11 adds a count the other books do not have: from the Sun's star, the 2nd, 5th, 10th
and 24th suit cutting stone, steel, wood and gems. Four counts out of twenty-seven would reject
almost every day, so it is marked beside the reading rather than made a bar, and the test asserts it
stays marked. His cutting reading also wants what sculpture does not — the 4th, 8th, 11th, 12th and
13th tithis and a malefic in a malefic lagna — the same inversion the weapons acts show; that stays
in the note, since the act here is carving, not demolition.

Two readings could not be taken as printed. Shridhar's loom rule bars "the 10th and the [?]th star
from the Sun's" and the second number is lost in the print, so neither is computed. His boat list
keeps Rohini where the Chintamani explicitly bars it, which Shridhar himself points out; both stand
as printed, and M.M.'s ship stars (the three Poorvas, Ashlesha, Magha) are marked rather than good,
since every other book bars them.

Still to do from chapter 25: the washerman, leatherwork, a salon, salt, drinks, a wrestling ring,
acting and circus, a bridge or dam, perfume, betel, a dairy, a grinding machine, gemology, bed
making, a library, storing metals, bricks and lime, a brick kiln, a lathe, melting iron, and iron,
stone and gem work — most of them Shridhar alone, with Wilhelm, Kalyanraman and Joshi covering
leather, the salon, the dairy and wine.

**Crafts and trades, part 2** (9 acts, added 2026-10-20): leather and shoes (three books), a salon
(three), wine (three), making a bed and first lying on one (three), performing — acting, tricks and
circus (two), dairy, butter and ghee (two), bricks, lime and a kiln (one), melting iron and stone
and gem work (one), fixing a grinding mill (one). Sources: Shridhar §25.12-25.35, Wilhelm,
Muhurta Chintamani 2/9 and 2/21, Kalyanraman vol.2 pp.182-189, Joshi pp.108-109. With part 1 the
crafts group is fifteen acts.

Two more chakras are computed, both from Shridhar alone. The **Khatwa chakra** (§25.28) counts the
Moon's star from the Sun's for making a bed: 1-4 auspicious, 5-12 death, 13-20 and 21-23 auspicious,
24-27 loss, fear and death. The **grinding-mill count** (§25.25) is the only chakra in the whole
table counted from **Saturn's** star — 1-4, 9-16 and 20-23 auspicious, 5-8, 17-19 and 25-27 not; it
is also the only rule that act has, since no star, tithi, weekday or lagna is given. Both prints
name twenty-six counts and leave the 24th unnamed; as with the Katha chakra, it is not rejected.

The agreements continue. Wilhelm's and Joshi's twelve leather stars are identical, and are Shridhar's
shoe list; three books print the same twelve-plus-Abhijit for a salon and all three say to avoid the
early morning; three print the same ten for wine — the four Tikshna, the five Ugra and Shatabhisha,
the same family that suits making a weapon. Shridhar's dairy combinations and Wilhelm's are the same
four, down to the Cancer lagna, the Chara star, and Jyeshtha or Krittika on Mercury's day.

Wine carries a live disagreement: Shridhar wants the malefic weekdays and the tithis (4, 6, 8, 9,
12, 14) that the rest of the table bars, while Kalyanraman allows every weekday and bars the Rikta
tithis. Both stand as printed, and the tests assert the two readings disagree. Melting iron and
working stone keep the same inversion, where storing metals (§25.30) reads the opposite way, so that
list is marked rather than good.

Two acts in chapter 25 were left out deliberately. §25.15 gives the timing for a theft, which
Shridhar himself only prints alongside catching a thief; it is named in the notes of CATCH_THIEF
rather than built as an act of its own. Still to do, all Shridhar alone and a sentence each: the
washerman, salt, a wrestling ring (its own inverted reading, noted under performing), a bridge or
dam, perfume, betel, gemology, a library, and a lathe.

Fixed in passing: four marked chakras in the agriculture family (Hala, Rahu, Venus and Vriksha)
emit their code with the `_MID` suffix, and their Tamil labels had been written under the plain
name, so the page showed a bare code. A test now walks every reading's `starCount` and asserts the
label exists under the name the engine actually emits.

**Showing one book at a time** (2026-10-20, the owner's request). The page always judged a time by
one book's reading per act, with the most-explained book as the default and a switch to change it.
Two things changed in how that is shown.

The readings the switch is not using no longer each take a line of their own: the reading in force
is open, and the rest sit behind a single collapsed line that names them — "மேலும் 3 நூல்களில் — …".

A **"ஒரே நூல்"** switch pins the whole page to one book. Where that book carries the act, its
reading decides; where it does not, the act's own default is used and the page says so in red,
rather than leaving a blank. This matters because no single book covers everything: Shridhar, the
fullest, has a reading in 91 of the 101 acts and is the most-explained in only 46 of them. Making
him the default everywhere would have left ten acts with no rule at all (agriculture in general,
a garden, a compromise, speculation, a lottery, accounts, buying a house, starting a temple,
setting up missiles, learning a craft) and replaced the fuller reading with a shorter one in some
forty-five more, so the switch is offered instead of changing the default.

A reading id is either a book's id or a second reading from the same book (SHRIDHAR_PADDY,
SHRIDHAR_OLD, SHRIDHAR_GATHER, KALYANRAMAN_BUY), which `BOOK_OF` maps back to the book. A test
asserts every id in every act resolves to a named book, so a new variant id cannot be added without
a mapping — which would otherwise make one-book mode skip that act in silence.

**The last readings** (12 acts, added 2026-10-20) close the table at **113 acts**. Nine are the
one-line trades left in Shridhar's chapter 25 — the washerman (§25.12), salt (§25.17), a wrestling
ring and sports (§25.18, with Kalyanraman p.156 and Wilhelm's line inside his education section),
a bridge or dam (§25.21), perfume (§25.22), betel (§25.23), gemology (§25.27), a library (§25.29)
and a lathe (§25.33). Three come from elsewhere: adopting a child (§20.20, with Kalyanraman p.231,
Joshi p.150 and Wilhelm p.211), castration (§26.13) and the cabinet's oath (§20.2).

**Adoption** is one of the table's closest agreements: four books print the same eight stars
(Ashwini, Pushya, Hasta, Chitra, Swati, Vishakha, Anuradha, Dhanishtha) and the same four weekdays,
and Kalyanraman's and Joshi's tithis match exactly. Only Shridhar's tithis differ, and the tests
assert both the agreement and that one difference. **Sports** keeps the inversion: three books put
it on the Tikshna and Ugra stars, the same family as weapons, hunting and wine.

Some of these are the shortest readings in the table, and they are left short rather than padded.
**Salt** is three stars and one weekday. The **lathe** is one star, one weekday and one lagna —
Revati, Sunday, Leo. The **library** and the **cabinet's oath** name no star at all: the library is
Mercury's placement on a Thursday, and the oath is a set of house rules (the 8th empty, no malefic
in the 1st, 2nd, 4th, 7th or 12th, daytime), because Shridhar says the stars and tithis follow the
coronation, which the assuming-office act already carries from nine books. A test asserts those two
readings have no star list, so the gap is deliberate and stays visible.

**§20.22, filing nomination papers, is not built.** Shridhar writes plainly that the treatises have
no reference for it and reasons by analogy to an application to the government, winning over an
enemy and litigation — all three of which are already acts. An act resting on the author's analogy
rather than a source would not belong beside the rest.

Also left out: Muhurta Chintamani p.127 gives a full reading for a child first eating betel leaf,
which is a samskara rather than the betel trade; the samskara family (beyond upanayana) is not
built, so it is named in the betel act's notes instead of being folded in.

**Samskaras, part 1** (7 acts, added 2026-10-20, corrected the same day): conception — Garbhadhana (six books),
Pumsavana (five), Seemanta (six), Jatakarma (five), naming the child (six), the first outing — Nishkramana
(four) and the first solid food — Annaprashana (seven). Sources: Shridhar §17.1-17.8, Muhurta Chintamani
ch.5, Kalyanraman vol.2 pp.19-75, Wilhelm pp.196-215, Joshi pp.49-55, Raman ch.III, Rangacharya ch.III-IV.
Upanayana and the start of education were already acts, so this is the childhood run that comes before
them; ear piercing, tonsure, shaving, the end of study and the funeral rites are part 2.

**Correction.** Part 1 as first committed had missed whole sections: Kalyanraman's own passages for
conception, naming and the first food, Joshi's for conception and the childhood samskaras, and Wilhelm's
for conception and the first outing, and it had clipped Kalyanraman's other sections to their first
sub-heading. Reading part 2 showed it. The books were added, every count now runs to the section's own end
(`sams_counts.py`), and because the default is the most-explained book Kalyanraman now leads conception,
naming, jatakarma and the first food. Conception is the one place the books genuinely part: five print
Shridhar's eleven stars, while Kalyanraman prints seventeen (Ashwini, Moola and Revati among them) and
lists over twenty authors' variations.

The Chintamani's chapter 5 and Shridhar's chapter 17 are the spine, and again the books agree closely.
Garbhadhana: three books print the same eleven stars. Seemanta: four books print the same ten stars, and
five of the six say Sunday, Tuesday and Thursday. **Raman bars Sunday and Tuesday**, the one opposite
reading in the family; Thursday is common to all six, and the test asserts that precisely, so the
disagreement is not overstated. Naming, the jatakarma and the first food all draw on one sixteen-star
family (Mridu, Dhruva, Kshipra and Chara together) that four books give for naming and the first food.

Where books differ they are kept as printed. For the first food, most books bar the child's own birth
star; Narada, Lalla and the Muhurta Deepika recommend it and Rangacharya allows it, so Shridhar and
Wilhelm carry the bar and Rangacharya does not. Shridhar, Rangacharya and Raman all want the 10th house
empty, and the Chintamani and Rangacharya print the same weekday and lagna bars. For the jatakarma and
naming, Wilhelm and the Chintamani each give one section for both, so each stands under both acts.

A rule common to the whole family is noted rather than built: in an act whose month is fixed, the
combustion of Jupiter and Venus and the intercalary month do not count (Brihaspati, repeated for
Pumsavana, Seemanta, naming and the first food), so `jupVenNotSet` is deliberately absent from these
readings. The month of pregnancy and the child's age in months are not inputs, so the month rules,
the lords of the ten months and the day count since birth are noted, not computed.

**Samskaras, part 2** (17 acts, added 2026-10-20): in three groups.

*Hair, ears and the end of study* (6): tonsure — Chudakarana (six books), shaving, hair-cutting and nail-cutting
(five), ear piercing — Karnavedha (six), Keshanta (four), Samavartana (three) and Ankurarpana (Shridhar
alone). Sources: Shridhar §17.7-17.14, Muhurta Chintamani ch.5, Kalyanraman vol.2 pp.76-94 and 124-125,
Wilhelm pp.209-212, 230-231, 239-240 and 303, Joshi pp.56-63, Rangacharya ch.IV.
Tonsure: Kalyanraman and Wilhelm print the same nine best stars; the Chintamani and Joshi the same twelve,
and Shridhar's eleven are those twelve without Jyeshtha (which he calls middling). All six books allow
Monday, Wednesday, Thursday and Friday; Rangacharya takes the bright fortnight only. Keshanta says in
four books "as for tonsure", so each book's keshanta reading is that book's own tonsure reading (the test
asserts it). Shaving follows the tonsure in Shridhar, the Chintamani and Joshi, with their extra bars —
Shridhar adds the five stars the books bar for repeated shaving (Krittika, Anuradha, Rohini, Magha, U.
Phalguni). The Chintamani and Joshi say samavartana takes the upanayana muhurta, which is already an act,
so those two have no separate reading there.

*Rites after death* (2): Pret Kriya (three books) and burning a dummy when the body is not available — Puttal
Daha (three). The three books print one list of nine stars for the rites and the Panchaka stars are not in
it. For the dummy the books **disagree on the fortnight**: Shridhar's printed "D.H." bars the dark fortnight,
the Chintamani bars the bright one, and Wilhelm asks for the dark. All three are kept as printed and the
test asserts each. All three agree on the performer's own bars (his Janma star and the 5th, 10th, 14th,
19th and 23rd from it; the Moon in the 4th, 8th or 12th from his sign), and on barring Friday, Tuesday,
Saturday and Dakshinayana (one is excused if the news came within a year; the date of death is not an
input, so Uttarayana is required). The Tripushkara yoga, the adhika and kshaya months and the sixteen days
of ashaucha are noted, not computed.

*Mother and child, Shridhar chapter 19* (9): the bath after menses (two books), the first bath after
delivery (five), the first breast feeding (three), the first cow's milk (two), water worship a month after
delivery (three), the first time on a bed (Shridhar alone, with the Khatwa chakra), the cradle (five), the
first sitting on the earth (four) and the first betel leaf (two). Sources: Shridhar §19.2-19.10,
Muhurta Chintamani ch.5 pp.114-127, Kalyanraman vol.2 pp.61-63 and 231-232, Wilhelm pp.196, 207-208, 214-215, Joshi pp.52-56, Rangacharya p.70.
The books agree to the letter in several places and the tests pin them: water worship is one reading in
three books; the bath after delivery is the same ten stars and Sunday, Tuesday, Thursday in all five;
the cradle is the same eleven stars and the same chakra in all five. **The cradle chakra** (the Moon's star
counted from the Sun's: 1-5 and 21-27 good) is new and computed — `DOLA_CHAKRA`; Kalyanraman gives it as
"another school" so it is marked, not barring, in his reading. Where they part: sitting on the earth is
Shridhar fixed signs against the Chintamani and Wilhelm movable; the first betel is Shridhar's thirteen
stars against the Chintamani's seventeen, with Shridhar's printed "Rohini, 3 Poorvas" read as the three
Uttaras (as the Chintamani prints it).

Not computed in this family, and named in the notes: the child's age (year, month, day count since birth), the mother's
pregnancy and her menses, the lord and the days after a death, the 88th pada and the 22nd star from the Janma
star, Tripushkara, the strength of Mars for the child's first sitting, and the directions of Rahu, Yogini and
Rudra for the first cow's milk.

**Marriage companions** (11 acts, added 2026-10-20): the elections around the wedding that the marriage page does
not take: choosing the bride — Kanya-varana (four books), choosing the bridegroom / engagement — Vara-varana (five,
including Vashistha's "sagana muhurta"), invitation letters (two), the mandap (two), the bride's first entry —
Vadhu-pravesha (four), her second entry — Dwiragamana (four), the first sexual union — Nisheka (five), first cooking
(Shridhar), the first return to her father's house (Shridhar), re-marriage (Shridhar) and love marriage (Joshi).
Sources: Shridhar §18.10, Muhurta Chintamani ch.6-8, Wilhelm pp.255-259, Joshi pp.79-81, Vashistha p.118,
Raman ch.VII, Kalyanraman vol.2 pp.19-33, Rangacharya p.101.
The books agree closely again, and the tests pin each agreement: the Chintamani, Wilhelm and Joshi print the same
seventeen stars for choosing the bride (nine of their own plus the eleven marriage stars) and the same seventeen for
the second entry; Shridhar's second-entry list differs by one star (Ardra for Chitra). The bride's first entry is one
list of sixteen in four books (Shridhar, the Chintamani — who has a whole chapter 7 for it —, Wilhelm and Joshi); the
Chintamani and Joshi bar Tuesday and Sunday, Shridhar and Wilhelm Tuesday and Saturday. For nisheka, Shridhar, Wilhelm
and Raman print the same eleven best and the same six middling stars; Raman's "nuptials" is that list, and
Kalyanraman gives conception and nisheka as one section ("Garbhaadaana, Sekam, Nisheka, Nuptials"), so his reading
stands under both acts, seventeen stars against the others' eleven.
Where they part: the bridegroom's list (Shridhar adds Moola and drops Chitra and Mrigashira; his joint list keeps
Mrigashira, as printed), re-marriage's Brahma-patt table (whose printed effects contradict its
auspicious / inauspicious labels; the labels are taken, and the contradiction is noted), and the first-entry
months — a first-year dosha on a relative — which every book lists but none can be computed without the marriage date.
New computed chakras: the Rudra-patt and Brahma-patt shuddhi (the Moon's star counted from the Sun's) for re-marriage,
and Joshi's Tripadi chakra, counted of 28 with Abhijit, which is the whole of his love-marriage rule.
Not computed: the day count from the wedding, the odd / even years and months, the bride's own Moon (her janma sign is
not an input here), the Venus-in-front travel dosha, and the first-pillar direction.

**Learning by subject** (22 acts, added 2026-10-20): the general education act names the subject-wise lists and says
they are not computed there; this builds them. Mathematics, astrology (with astronomy and palmistry), the Vedas and
grammar, Vedarambha (the samskara of starting the Vedas), philosophy and dharma-shastra, logic, medicine, arms and archery,
music and dance, instruments, other religions, foreign languages, law, writing; and the subjects only Kalyanraman's
tables name: numerology, water divining, computing, the positive sciences, the culinary arts and statecraft, palmistry
and physiognomy, higher and technical studies, the Shudra mantras and expeditions. Sources: Shridhar §17.11.4-25,
Kalyanraman vol.2 pp.152-164, Joshi pp.97-100, Wilhelm pp.234-235 and 301-302, Raman ch.XI, Rangacharya pp.119-120,
Vashistha pp.85-87. The painting, sports, sculpture, craft, gemology and mantra acts that were already built are not
repeated.
Several subjects are one list in several books, and the tests pin each: mathematics is the same eighteen stars (and
Sunday, Wednesday) in Shridhar, Kalyanraman, Joshi and Vashistha; philosophy the same seventeen in Shridhar,
Kalyanraman and Joshi; arms the same sixteen and Sunday, Tuesday, Friday in the same three; the Vedas and grammar the
same thirteen; Kalyanraman and Vashistha print the same eight for astrology. Where they part: Vashistha's medicine list has
Bharani where the others have Mrigashira; Rangacharya's mathematics is seven stars against the others' eighteen
(he gives mathematics, astronomy and astrology as one section, so his reading stands under both); Shridhar's
Vedas, grammar, astrology and dharma-shastra are one section and stand under the first two.
Kalyanraman's rule that the Vedas and the Anadhyaya days exclude each other is computed (the same Anadhyaya tithis the
upanayana and education acts use). New: the `anadhyaya` and `galagraha` keys in the shared reading generator.
Where a book gives only additions to its general list (Wilhelm), the general stars are good and the additions join them;
the subject readings carry only each book's own subject-wise rules and say that the general education rules also apply.

**Farming leftovers** (10 new acts and 5 books added to existing acts, 2026-10-20): yoking oxen, hydraulic devices and
pump sets, manuring, making or getting farm implements, training in their use, storing seeds, selling the crop,
sugar-cane juice, mustard oil (the press) and business in camels, horses, donkeys and birds. Sources: Shridhar
§21.2-21.16, Kalyanraman vol.2 pp.172-183, Joshi pp.105-106 and 150. Three new computed chakras, all the Moon's star
counted from the Sun's: Koop (1-6, 16-18, 22-27 good — Shridhar's table 21.8, whose effects were read from the page
image), sugar-cane (1-4, 7-8, 15-19, 22-27) and Kolhu (1-8). Rahat, the well-bucket's own chakra (the 7 stars before
the Sun's and the 5 from it), is named in the note and not computed because Shridhar gives it as an alternative for one
device. **Books added to acts that already existed** — found by comparing each book's sections with what the acts
cite: Kalyanraman and Joshi for cattle (the same sixteen stars, one list in both books), Kalyanraman for goats and
sheep, Joshi for poultry (the same eighteen stars as Kalyanraman's) and wells. The ranking, sources, notes and fixture
of those acts were updated in place (`retro.py`).

Not done in this family: the crafts (weaving, cloth mills, dyeing, gem cutting),
the crop-by-crop and sign-by-sign planting tables (Raman, Kalyanraman's notes),
omens at ploughing, the garden's directions (Shridhar), keeping animals, buying
and selling cattle, farm implements, water (wells, hydraulic devices), mustard
oil and sugar-cane juice extraction (Shridhar's Kolhu and juice chakras).

## /muhurta rebuilt

Its per-purpose lists ("classical convention") had no page behind them and are
removed. House entry is judged by the chosen book at sunrise (month, star,
tithi, weekday, Kumbha chakra; verdict உத்தமம் / நல்லது / தவிர்க்க). The other
purposes show their panchanga with "ஆதாரம் தேவை / SOURCE REQUIRED" until their
rules are read; marriage points to `/muhurta-stars`. Shridhar's lists are
narrow — about one day in sixty passes at sunrise.

## Not done

The other events; the subject-by-subject education stars; for house entry: Yogini, Kala Rahu,
forenoon, the wife's pregnancy. For travel: omens, Trinavami, eclipses, the
equinox days, kshaya / adhika months, horas, velas, the month–tithi table,
Khanda / Yamardha / Muhurta Rahu, Vaar Yogini, dawn / dusk / midnight kaala
bala, planetary war, the lagna lord's other vargas, Rangacharya's 6-ghati
release of the Ghaata tithi, Vashistha's tithi yatra chakra, victory yogas.
