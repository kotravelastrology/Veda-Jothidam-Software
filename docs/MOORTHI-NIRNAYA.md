# Moorthi Nirnaya — the form of a sign entry (2026-10-08)

`/moorthi-nirnaya` · `src/report/moorthi.js` (computation) ·
`src/report/moorthiTables.js` (the books' tables) · test `test-moorthi.js`
with `fixtures/gochara-vedha/moorthi.json` (transcribed from the page images).

When a planet enters a new sign, the house of the transit Moon counted from
the natal Moon gives the planet a "form" for its stay there: 1/6/11 gold
(Swarna), 2/5/9 silver (Rajata), 3/7/10 copper (Tamra), 4/8/12 iron (Loha).

## Six books, one set of groups

| Book | Words | What the forms mean |
|---|---|---|
| Pulippani, *Gochar Phaladeepika* ch.25 pp.219–223 and the Jupiter chapter pp.332–335 | 1821 (1044 + 777) | benefics gold 1, silver 3/4, copper 1/2, iron 1/4; **malefics reversed**: silver 1, copper 3/4, iron 1/2, gold 1/4; quantified with the ordinary good/bad house |
| Raj Kumar, *Charisma of Planets* §6.2 (Table 20) and *Delineating a Horoscope* §2.6 (Table 8, the same table) | 418 (279) | ++ / + / − / −−; gold in a bad house "considerably reduces" the evil, iron in a good house reduces the good |
| A.K. Gour, *The Celestial Delivery Boy* pp.30–31 | 329 | gold best, iron lowest; silver "promises good results"; "there are different opinions" |
| P.V.R. Narasimha Rao, *Vedic Astrology: An Integrated Approach* §26.2 (Table 62) | 271 | highly favorable / favorable / unfavorable / highly unfavorable |
| R. Santhanam, *Jyotisharnava Navanitam* ch.3 commentary pp.152–153 | 222 | auspicious / moderately / somewhat grievous / highly grievous; quotes a Sanskrit verse for the groups |

Pulippani says the method is "greatly explained in Tamil texts only"; none of
the five Tamil books held (Sudamani, Jathaka Alangaram ×2, Kalachakram,
Kalaprakasika) has it.

## What is computed

For Sun, Mars, Mercury, Jupiter, Venus, Saturn, Rahu and Ketu, each sign entry
over a window (a year back for the fast planets, three for Saturn; one to ten
years ahead): the entry moment to 30 seconds, the transit Moon's sign, degree
and house from the natal Moon, the form, the planet's ordinary good/bad house
(Pulippani's gochara table, ch.22), and Pulippani's grade and quantum — the
conventional half (good 0.5, bad 0) plus the form's share, in both of his
series. For each planet's current entry, the same for all twelve natal signs
(the shape of his Tables 17 and 23).

## The minute matters — "close"

The Moon moves a sign in about 2¼ days; Saturn moves 3–7′ a day. An almanac
that puts an entry a few hours earlier or later can change the form. Each
entry carries the hours since the Moon entered its sign and until it leaves,
and the arc the planet moves in that time. Under **2′** the entry is marked
close and the neighbouring sign's form is shown.

Why 2′: where the books' own examples agree with this ephemeris, their printed
entry moments are within 1.1′ of ours (Rao 0.7′, Gour 0.0′, Raj Kumar 2002
0.2′ and 1.1′). The two that disagree are both inside 2′:

- **Pulippani 1998** — Jupiter into Kumbha. He prints "9.1.1998 1.38 a.m., Moon
  in Mesha". Lahiri: 8 Jan 15:51 IST, 1.4 hours after the Moon entered
  Rishabha (0.76′); at his own printed moment the Moon is at Rishabha 6°. His
  forms follow exactly from a Mesha Moon — the neighbour.
- **Raj Kumar 1958** — Indira Gandhi's Sade Sati, Saturn into Sagittarius. He
  has 9 Nov with the Moon in Virgo (Rajat). Lahiri: 7 Nov 15:30 IST, the Moon at
  Leo 27°28′, 4.2 hours from Virgo (1.05′) — iron, with Rajat as the neighbour.

## Pulippani's print, recorded not corrected

- Two quantum series: p.220 and the example's 1/2, 1/4, 1/8, 1/16; Tables 17,
  23 and the p.334 list 0.5, 0.375, 0.25, 0.125. Both are shown.
- Table 17: no Libra row; Aries' conventional "0300"; Capricorn mixes the two
  series (iron 0.625, total 0.5625).
- Table 23: the good rows' totals leave out the conventional 0.5.
- Table 24 (Jupiter + Saturn together): the forms are right (Moon in Pisces and
  in Cancer), the quanta do not reproduce — not computed.
- The 1998 narrative: Gemini "7th" (9th); Capricorn among the bad seven
  (Pisces); Sagittarius "Loha" (his list and table: Rajatha); "12th for
  Capricorn" (Pisces).
- Copper in a bad house: p.222 "intensified considerably more", p.332
  "slightly reduced".

## Our readings, labelled on the page

- Every entry has its own form, retrograde re-entries included (marked).
- The Moon is left out: at her own entry the transit Moon is the planet.
- The good/bad house is Pulippani's gochara table for every book.
- Pulippani's benefic/malefic: Sun, Mars, Saturn, Rahu, Ketu malefic; Jupiter,
  Venus benefic; Mercury by the planets in his sign at the entry, otherwise
  both shown (as on `/nakshatra-gochara`).

## Verified

`test-moorthi.js`: the groups of all six books; Pulippani's grades both ways
and both quantum series; his 1998 list and Table 17 reproduced row for row
(with the Libra, Capricorn slips asserted as printed); Table 23 forms and form
quanta, and that its printed totals omit the conventional half; Table 24's
Saturn forms; Rao's, Gour's and Raj Kumar's 2002 examples against the
ephemeris; the two disagreeing examples as close with the book's form as the
neighbour; every entry of a 2026 window against the ephemeris (a minute either
side) and the Moon's sign. Browser-checked with a manually entered chart.
