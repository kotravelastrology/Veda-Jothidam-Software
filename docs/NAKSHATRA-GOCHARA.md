# Nakshatra gochara — taras, star classes, anga phala, weekday (2026-10-08)

`/nakshatra-gochara` · `src/report/nakshatraGochara.js` (computation) ·
`src/report/nakshatraGocharaTables.js` (the books' tables) · test
`test-nakshatra-gochara.js` with `fixtures/gochara-vedha/nakshatra-gochara.json`
· `src/ui/PartyChooser.tsx` (the "யாருக்கு?" block, shared from now on).

The rest of Pulippani's chapter 24, after the Saptashalaka chakra (which is on
`/gochara-vedha`): each planet's star counted from the natal star (the natal
star is the 1st).

## What is computed

For every planet — the Moon over the next month, the others from a year back
to five ahead — each star it occupies, with:

- **Tara** (count mod 9): Pulippani's names and results (Janma medium, Sampath
  very good, Vipath bad, Kshema good, Prathyak bad, Deivanukula good, Vadha bad,
  Maithra good, Parama Maithra moderate); Bhat's names beside them where they
  differ (Sadhana, Nidhana for the 6th and 7th).
- **Pulippani's Table 16** (p.213): the stars that are good or bad for each
  planet; "no results in remaining stars".
- **Pulippani's combination rules** (pp.213–214): the star's class with the
  house from the natal Moon's sign — a benefic in a good star in the 5th/9th
  "very much benefic", in a kendra "moderate", elsewhere neutral; a malefic in a
  bad star in the 8th/12th "intensified"; in the 5th/9th neutral (bad star) or
  "practically no bad results" (good star).
- **Anga phala** in four books, the one that explains most first.
- **Weekday:** for the coming year, the days on which the natal star runs at
  sunrise at the birth place, with Pulippani's result for that weekday (p.218).

## Anga phala — four books

| Book | Words | Notes |
|---|---|---|
| M. Ramakrishna Bhat, *Fundamentals of Astrology* pp.254–255 | 897 | default |
| Pulippani, *Gochar Phaladeepika* pp.214–218 | 587 | two versions: his "ancient tradition", and Sudamani in English |
| Sudamani (Tamil), verses 344–347, pp.150–151 | 254 | read from the Tamil verses |
| A.K. Gour, *The Celestial Delivery Boy* pp.93–95 | 228 | Bhat's table, row for row |

**Findings:**

- Bhat and Gour agree row for row; Gour drops Saturn's 9th–11th row (printing).
- Pulippani's "ancient tradition" gives the same result per range as Bhat for
  every planet but the Moon, under partly different limbs (Mars 9–11 neck v.
  chest; hands swapped left/right in places; Saturn's hands and legs).
- **The Moon** is a real disagreement: Bhat/Gour 16–18 left hand "hatred",
  19–24 feet "going abroad", 25–27 right hand "gain"; Pulippani 16–17 right hand
  "enmity", 18–24 legs "living in his own house", 24–27 left hand "gain".
- Pulippani's print overlaps: the Moon's 24th and Saturn's 25th sit in two
  ranges each, and Mercury-Jupiter-Venus print "20th, 27th" for 20–27. Both
  overlapping rows are shown.
- **Sudamani in Tamil against Pulippani's English:** the Sun's results are
  shifted one limb in the English (Tamil: head → rule, mouth → learning,
  stomach → feasting, hand → gold, legs → travel); Mars's right side is "good"
  in the verse and "bad" in the English; the Saturn verse names Saturn only (the
  English extends it to Rahu and Ketu); the commentary on Mars omits the right
  hand that the verse has; on Mercury-Jupiter-Venus's feet the verse says "good"
  and the commentary "women". The page follows the Tamil verse. Sudamani has no
  verse for the Moon.

## Our readings, labelled on the page

- Mercury's nature for the combination rules: benefic or malefic by the planets
  in his sign (aspects not computed), otherwise not determined; the Moon by her
  fortnight.
- The last two combination rules say "planets"; read as malefics so they do
  not contradict the first.
- "The weekday on which the natal star falls": the day whose sunrise at the
  birth place has the natal star (the panchanga convention).

## Verified

`test-nakshatra-gochara.js`: Table 16, the anga ranges of all four books against
an independent transcription (Sudamani's from the verse's limb counts, which add
to 27), the coverage of 1–27 with exactly the printed slips, Pulippani's two
worked examples (Hasta native, Venus in Mrigashira = 20th, Sampath; Chitra
native, Saturn in Shravana = 9th, Pulippani "right leg, loss", Sudamani "legs,
travel"), word order, citations, every stay against the ephemeris, and every
natal-star sunrise. Browser-checked with a manually entered chart (nothing
written to the library).
