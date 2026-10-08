# Latta — the planets' "kick" (2026-10-08)

`/latta` · `src/report/latta.js` (computation) · `src/report/lattaTables.js`
(the books' tables) · test `test-latta.js` with `fixtures/gochara-vedha/latta.json`
(transcribed from the page images).

A transiting planet kicks the star at a fixed count from the star it occupies
(that star is the 1st): the Sun the 12th, Mars the 3rd, Jupiter the 6th, Saturn
the 8th forward; the Moon the 22nd, Mercury the 7th, Venus the 5th, Rahu the 9th
backward. When the kicked star is the natal star, the books give an evil effect.

## Seven books, one source

Phaladeepika XXVI.42–47 is the source; every English author paraphrases it.

| Book | Words | Notes |
|---|---|---|
| P.V.R. Narasimha Rao, *Vedic Astrology: An Integrated Approach* §26.7 pp.313–315, 322 | 804 | also the **lagna star**; the effect by the kicking planet's natal houses; Example 113 (5 Dec 1996) |
| M. Ramakrishna Bhat, *Fundamentals of Astrology* pp.255–256 | 485 | effects for Mars ("utter ruination") and Saturn ("same as the Sun") |
| Raj Kumar, *Charisma of Planets* §6.3 | 374 | counts Ketu; attributes to Phaladeepika effects the verse does not have |
| A.K. Gour, *The Celestial Delivery Boy* pp.95–96 | 339 | counts Ketu; "distress in direct proportion to the number of Lattas" |
| G.S. Kapoor, *Phala Deepika* (e-text) ch.26 sl.42–47 | 311 | **Rahu's 8th** |
| Pulippani, *Gochar Phaladeepika* pp.75–76 | 297 | counts Ketu; Saturn "even danger to life" |
| V. Subrahmanya Sastri, *Phaladeepika* (1950) XXVI.42–47 pp.303–304 | 224 | the Sanskrit verses: "राहोस्तु नवमं" — Rahu's **9th** |

The Tamil books held (Sudamani, Jathaka Alangaram ×2, Kalachakram) have no
Latta; the "லத்தை" hits in their text are pieces of other words.

## Where they differ

- **Rahu 8th or 9th:** the verse and six books 9th; Kapoor 8th (as does the
  Shiva-Vishnu Mandir *Reference Manual*, p.27, which uses Kapoor's words). Both
  computed; 9th is the default.
- **Ketu:** counted (9th backward) by Raj Kumar, Gour, Pulippani; the verse
  names the nodes only in the effects (verse 45, "तमसोः", dual), as Bhat does;
  Rao and Kapoor have no Ketu. Computed and labelled as those three books.
- **Effects:** the verse has none of its own for Mars and Saturn; Bhat, Raj
  Kumar and Pulippani supply them. The Moon: "great loss" (verse, Sastri, Bhat,
  Gour) / "excessive financial loss" (Kapoor) / "loss of honour" (Raj Kumar,
  Pulippani). Jupiter's "death" is in the verse but not in Raj Kumar or Gour.
- **Rao alone** reads the lagna star too and judges by the kicker's natal houses.
- **Gour's example** puts Rahu in U.Phalguni; on his Mars example's date (10 Oct
  2006) it was Ketu there.

## What is computed

- Today: the star each planet kicks (Rao's Table 70 shape), marked when it is
  the natal or lagna star.
- For the natal star and the lagna star: the star from which each planet kicks
  it, and every stay there — the Moon for a year, the Sun, Mercury, Venus for
  three, Mars four, Jupiter 13, Saturn 31, the nodes 20 — with each book's effect
  and, for Rao, the planet's natal houses (owned, occupied).
- The periods when two or more kicks on the natal star coincide (verse 47).

## Verified

`test-latta.js`: the counts of all seven books; the 26 worked counts in the
books (Kapoor, Bhat, Rao, Raj Kumar, Gour, Pulippani); Rao's Table 70 — all
eight planets' stars on 5 Dec 1996 against the ephemeris, the lattas on
Poorvabhadrapada and Hasta, and the lords Rao names (Jupiter 4/7, Mars 3/8,
Mercury 1/10); Rao's Exercise 45 (8 Jun 2000), Raj Kumar's 1 Oct 2011, Gour's
10 Oct 2006; every window against the ephemeris; the coincidences. Browser-
checked with a manually entered chart.

## Not here

Muhurta books use the same counts to reject a day's star for marriage (Muhurta
Chintamani's commentary, G.S. Agarwal, K.K. Joshi, Ernst Wilhelm, Muhurtha
Sindhu), with their own effects, a pada rule, and — in Muhurta Chintamani's
commentary and Agarwal — Rahu's 9th counted **forward** "because of the backward
movement of Rahu". That belongs to a muhurta page and is not computed here.
