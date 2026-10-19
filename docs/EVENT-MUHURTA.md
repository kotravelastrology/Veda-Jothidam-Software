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
