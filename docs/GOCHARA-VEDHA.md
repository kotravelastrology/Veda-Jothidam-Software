# Gochara vedha — all nine planets (2026-10-06)

`/gochara-vedha` · `src/report/gocharaVedha.js` (computation) ·
`src/report/gocharaVedhaTables.js` (the books' tables) · test
`test-gochara-vedha.js` with `fixtures/gochara-vedha/books.json`.

Counted from the natal Moon's sign: a planet in a good house is obstructed when
another planet stands in the paired house (vedha); a planet in a bad house is
relieved when another stands in its paired house (vipareetha vedha). The dates
are astronomy; the pairs are the books'.

## Eight books, four computed

Ordered by the words each spends on gochara and vipareetha vedha (owner's
rule, 2026-10-03):

| Book | Section | Words | Computed? |
|---|---|---|---|
| Pulippani, *Gochar Phaladeepika* | ch.22, pp.204–206 | 614 | **yes — default** |
| R. Santhanam, *Jyotisharnava Navanitam* | ch.3 commentary, pp.146–149 | 575 | **yes** (no rows for Rahu, Ketu) |
| Jataka Parijata vol.3 (Subrahmanya Sastri) | notes to XIII.60, pp.833–834 | 465 | no — reprints Kalaprakasika's table |
| Mantreswara, *Phaladeepika* (V. Subrahmanya Sastri, 1950) | XXVI.2–8, pp.286–288 | 396 | **yes** (no vipareetha; no vedha for the nodes) |
| *Phala Deepika* (G.S. Kapoor, e-text) | ch.26 sl.2–8, pp.246–247 | 350 | no — two lists short (below) |
| Sudamani (Tamil) | verses 341–343 with commentary, pp.148–150 | 251 Tamil words | no — sets only; Venus's line five of eight read (below) |
| Kalaprakasika (N.P.S. Iyer, 1982) | pp.209–210 | 248 | no — gives each house's result, not a good/bad list |
| Vishnu Bhaskar | ch.14 §II, p.139 | 185 | **yes** |

**Decision pending — the measure.** Santhanam also gives a third kind,
"Vedha for bad places only" (p.151, 185 words), which Pulippani has no
counterpart for. Counting like for like (gochara + vipareetha) keeps Pulippani
first; counting each book's whole rasi-vedha discussion puts Santhanam first
(760) and would make him the default — changing the report's gochara section
(Venus's 11th/12th pairs, no Venus–Sun exemption, nothing for Rahu and Ketu).
The default is unchanged until the owner chooses.

## Where they differ

Everything not listed here agrees across all the books.

| Cell | Pulippani | Phaladeepika (Sastri) | Santhanam | Jataka Parijata / Kalaprakasika | Sudamani | Vishnu Bhaskar |
|---|---|---|---|---|---|---|
| Mercury in 10th → vedha in | 8 | 8 ("नैधन") | 8 | 10 printed (same house) | its set holds 8, not 7 | 7 |
| Venus in 11th / 12th → | 3 / 6 | 3 / 6 ("सहज" / "वैरि") | 6 / 3 | 3 / 6 | verse 3 / (reconstructed 6); commentary 3 / 6 | 6 / 3 |
| 10th as a good house | Rahu, Ketu (no pair) | Rahu, Ketu ("similar to the Sun") | — (no node rows) | maps to itself | Mars, Saturn, Rahu (no pair) | — |
| Rahu / Ketu vedha | Saturn's (3→12, 6→9, 11→5) | not stated | — | — | — | Saturn's |
| Exemptions | Sun–Saturn, Moon–Mercury, **Venus not by Sun** | Sun–Saturn, Moon–Mercury (verse by verse) | Sun–Saturn, Moon–Mercury | Sun–Saturn, Moon–Mercury | — | Sun–Saturn, Moon–Mercury |
| Vipareetha | own table | none | reverse + **bad-places table** | bad-places table (prose) | reverse (v.343) | reverse (note 4) |

**Phaladeepika XXVI.2–8 (2026-10-08).** The classical source behind most of
these books, read in Sastri's 1950 edition (verse and translation) and Kapoor's
e-text. Its pairs are Pulippani's, cell for cell — in the Sanskrit, Mercury's
10th pairs with "नैधन" (8th) and Venus's 11th and 12th with "सहज" (3rd) and
"वैरि" (6th), against Vishnu Bhaskar and Santhanam. It names Rahu and Ketu's
good houses only ("similar to the Sun": 3, 6, 10, 11), gives each planet's
exemption in its own verse (none for Venus), and has no vipareetha. Computed
as the fourth method: its nodes are good with no vedha house (our reading — a
reader who extends "similar to the Sun" to the vedha would use the Sun's
pairs). Kapoor's translation drops Sastri's "1st" from Mercury's vedha list and
the 1st and 9th from Venus's houses; with them restored the pairs are the same.

The table this repo carried until 2026-10-06 under the unchecked label
"Phaladeepika 26.3-8" (ported from the prior AstrologicLab code) matches these
verses for the seven planets and both exemptions; it left out the nodes' 10th
and gave them Saturn's pairs. Of the two changes the switch to Pulippani made,
Phaladeepika agrees with Rahu and Ketu good in the 10th, and not with the
Venus–Sun exemption, which only Pulippani has.

**Sudamani's Venus line (2026-10-08).** Read again from the page image
(verses 341–342, p.148). Verse 341 gives Venus eight good houses — 11, 12, 2,
1, 4, 3, 5, 9; the 8th is the commentary's addition (the table had carried the
commentary's nine under the verse's name; corrected). Verse 342's Venus line,
printed "புகர்மூன்றோன் விட்டீராறு சேட்டீரம் சொன்றோடொன்பான் வியன்ற
பதினொன்றில்": its first number, மூன்று (3), and its last four — ஈரஞ்சு
(10; printed "ஈரம்"), ஒன்று (1), ஒன்பான் (9), பதினொன்று (11) — are read with
certainty. They are Pulippani's and Kalaprakasika's vedha places for Venus's
11th, 4th, 3rd, 5th and 9th, in the order verse 341 names those houses. The
middle ("ஓன் விட்டீராறு சேட்டு") is not read; on that order it holds the
vedha of the 12th, 2nd and 1st, which those books give as 6, 7, 8 — our
reconstruction, marked on the page. So Sudamani sides with Pulippani on the
11th (3, not Santhanam's and Vishnu Bhaskar's 6). The commentary's seven vedha
places (3, 6, 7, 5, 8, 11, 9) are all in Pulippani's set; only its first two
pairs line up with its good-house list.

**Kalaprakasika's bad-house columns explained (2026-10-06).** They are
Santhanam's "Vedha for bad places only" (p.151): Sun 8/8 cells, Moon 6/6,
Mercury 6/6, Venus 3/3, Mars (= Saturn) 7/9, Jupiter 5/7 — 35 of 39. The four
that differ are all places where Santhanam gives the same house and
Kalaprakasika the neighbouring one (Mars 4th: 3 / 4; Mars 12th: 11 / 12;
Jupiter 8th: 7 / 8; Jupiter 12th: 11 / 12). Santhanam states the rule
Kalaprakasika's prose implies — a planet in a bad house is checked by another
in the house given — and his p.152 settles what "the same house" means:
"Sade Sathi effects are checked by another planet (except the Sun, Rahu etc.)
in simultaneous transit with Saturn himself". Kalaprakasika is still not
computed, because it describes each house's result rather than listing good
and bad houses, and sorting results into good and bad would be our judgement.

**Two books contradict each other on Sade Sati companions.** Santhanam (p.152):
another planet travelling with Saturn checks Sade Sati. Pulippani (p.206): with
Jupiter not in the 3rd, fast planets passing Saturn's sign bring "more ordeal".
Both are on the Saturn page.

**Santhanam's method, our readings:** his reversal table and his bad-places
table both relieve a bad house (the Sun in the 4th is relieved from the 10th or
the 3rd); "the same house" means a planet in the same sign; the "Rahu etc." of
his Sade Sati sentence is not applied (named for that case only, "etc."
unspecified). His p.148 example prints Mars's vedha points as "12th, 2nd and
5th" where both his tables have 12, 9, 5 — read as a slip.

**Findings:**

- Pulippani's own vipareetha table pairs Venus 6↔11 and 3↔12 — the pairs Vishnu
  Bhaskar uses in his gochara table. What the Saturn stage recorded as a print
  swap is the books' disagreement showing up inside one book.
- Kalaprakasika's table (columns I–XII, one row per planet) is laid out as
  "planet in house N — vedha in the house printed under N". Read that way, every
  good-house cell of all six rows is Pulippani's except Mercury's 10th, which
  prints 10. The bad-house columns are not the reversal of the good pairs
  (except Venus's); they are Santhanam's bad-places table (above). The reading
  of the layout is ours.
- The 1982 Kalaprakasika print differs from Jataka Parijata's letterpress
  reprint in six cells ("a", "S", and 6/8 for 5/3) — re-typesetting errors by
  their look. The reprint is used; the 1982 cells are listed on the page.
- Sudamani's commentary gives the Moon's vedha places as 8, 10, 3, 4, 12 (five
  only), which matches neither its own verse (5, 9, 12, 2, 4, 8) nor any other
  book. The verse is followed.
- Rahu and Ketu always stand opposite. No book says whether they obstruct each
  other; counting them would make Rahu's 11th always obstructed. They are shown,
  not counted (our reading).
- Vishnu Bhaskar adds that "in South India Mercury's benefic places are taken as
  6, 8, 12" — recorded, not applied.

## What changed elsewhere

`src/report/gocharaPhala.js` (the report's "சந்திர கோசார பலன் + வேதை" section
and the answer engine) used its own copy of the tables, ported from the prior
AstrologicLab code with a citation — Phaladeepika 26.3–8 — whose page was never
seen; no translation of that chapter is in the library. It now reads the
default method's table, so two answers change, both by Pulippani's own text:
Rahu and Ketu in the 10th are good (no vedha house), and the Sun no longer
obstructs Venus. Vipareetha is now reported in the report's vedha column. The
answer engine's source labels name Pulippani's pages.

## Spans

Each planet's stays are listed over a span that shows a few of its cycles: the
Moon two months, the Sun, Mercury and Venus a year, Mars two years, Jupiter
twelve, Rahu and Ketu eighteen, Saturn thirty (the same window as the Saturn
page, and the test checks the two computations agree stay for stay).

## Nakshatra vedha (added the same day)

`src/report/nakshatraVedha.js` · `nakshatraVedhaTables.js` · test
`test-nakshatra-vedha.js` · same page, own section.

Counts *stars*, from each planet's own natal star: when a named planet transits
the Nth star from (say) the natal Sun's star, the transit's good effects are
held back. Sixteen positions — two for each of the seven planets, two jointly
for the nodes.

| Book | Section | Words |
|---|---|---|
| Pulippani, *Gochar Phaladeepika* | ch.23, Table 14, pp.207–208 | 238 |
| R. Santhanam, *Jyotisharnava Navanitam* (added to the curated library and registry) | ch.3 commentary, pp.149–150 | 235 |

The two tables are identical in all sixteen cells, and the sentences nearly so;
three words separate the counts, and the page says the order is practically a
tie. The Tamil texts held have no nakshatra vedha.

**Where they read it differently** (shown, not settled): Pulippani's opening
says the planet's own transit effects, good or evil, are neutralised; his
example says the good effects of *other* transits are suspended and only
malefic ones come; Santhanam, for Ketu in the 15th from the natal Sun's star,
says "all good effects of the Sun will vanish". Both add an exception when the
"directional influences" are strongly favourable — probably the dasha; not
computed.

**Our readings, labelled on the page:** counting is inclusive — the books'
own example (Sun in Aswini; Aslesha 9th, Swati 15th) fixes this; "Rahu/Ketu"
as the natal planet is counted from both nodes' stars (they are 13 or 14 stars
apart and neither book says which); either node in the Sun's 9th counts. The
Moon's spells (about a day a month) are listed for the next thirteen months.

**Found on the way:** Santhanam's next table, "Vedha for bad places only"
(p.151), turned out to be Kalaprakasika's bad-house columns — compared cell by
cell the same day (35 of 39; see "Kalaprakasika's bad-house columns explained"
above), and Santhanam became a third computed method.

## Phaladeepika XXVI — house results, timing, general rules (added 2026-10-08)

`src/report/phaladeepikaGocharaTables.js`, computed in `gocharaVedha.js`; same
page — a column in the "now" table and the timeline, and its own section.

- **Verses 9–24:** each planet's result in each house from the Moon, condensed
  into Tamil from Sastri's translation (pp.289–296). Verse 24 is Rahu's alone
  ("तमः"); Ketu has none (Kapoor: "probably the same as Rahu") and none is shown.
  Rahu's good results fall in 3, 6, 10, 11 — verse 2's "similar to the Sun".
- **Verse 25:** the third of a sign in which a planet gives its result — Mars
  and the Sun the first, Jupiter and Venus the middle, the Moon and Saturn the
  last, Mercury and Rahu throughout (Vishnu Bhaskar says the same). Computed as
  dated windows within every stay, retrograde returns included.
- **Verse 33:** Saturn, the Sun, Mars, Jupiter in the 12th, 8th or 1st — marked
  on the stays. The verse says "द्वादशाष्टमजन्म" (12, 8, 1); Kapoor's "10th" is
  recorded as his.
- **Verse 34:** the eight positions, counted for the present ("if all the
  conditions exist").
- **Verses 31–32** (computed 2026-10-08): "स्वोच्चस्वगेह" — exalted or own sign
  in a bad house does no harm, in a good house gives the full result;
  "नीचारिमौढ्यं" — debilitated, in an enemy's sign or combust in a good house
  loses its result, in a bad house gives much suffering. Definitions from the
  same book: lords and exaltation I.6 (= BPHS, checked), natural enmity
  II.21–22 (= BPHS v.55, checked) and II.35 for the nodes; Mantreswara gives the
  nodes no exaltation or own sign (Kapoor's note), so only the enemy's sign is
  judged for them. Combustion degrees are not in the verses: Kapoor's note to
  II.36 and Vishnu Bhaskar give the same (Moon 12°, Mars 17°, Mercury 14°/12°
  retrograde, Jupiter 11°, Venus 10°/8° retrograde, Saturn 15°). Good/bad house
  by verse 2. Shown now and per stay (by sign), with combust spells as dated
  windows; where both verses hold (Jupiter exalted and combust) both are shown —
  the verse does not say which prevails.
- **Verse 30** (computed 2026-10-08): a planet giving bad results aspected by a
  benefic, or good results aspected by a malefic, is void; so is one aspected
  by an enemy ("…यः शत्रुणा … विलोकितश्च" — Sastri "the same will be the case";
  Kapoor narrows it to "the capability to do good"). Aspects II.23 (all the
  7th; Saturn 3/10, Jupiter 5/9, Mars 4/8 full; quarter/half/three-quarter
  glances shown for the present, not counted — our reading); the nodes are
  given no aspect. Benefic/malefic II.27 (waning Moon = Krishna paksha, our
  reading; Mercury malefic in a malefic's company); enmity II.21–22, 35.
  Shown now and as dated windows per stay (the Moon's passes counted, Mercury's
  nature split by his company), checked against the sky both ways.
- **Verse 41** (ashtakavarga bindus) is shown as a statement: "more" is not
  defined.

## Saptashalaka chakra (added 2026-10-07)

`src/report/saptashalaka.js` · `saptashalakaTables.js` · test
`test-saptashalaka.js` with `fixtures/gochara-vedha/saptashalaka.json` · same
page, own section.

The 28 stars (Abhijit included, from Krittika at the north-east) on the ends
of seven horizontal and seven vertical lines; stars on one line are in vedha.

| Book | Section | Words | Reading |
|---|---|---|---|
| M. Ramakrishna Bhat, *Fundamentals of Astrology* | ch.XXI, pp.251–253 | 808 | straight lines ("stars face one another"), plain grid — **default** |
| Pulippani, *Gochar Phaladeepika* | ch.24, pp.209–211 | 387 | text: straight lines; drawing: a diamond lattice |
| A.K. Gour, *The Celestial Delivery Boy* | ch.VIII, pp.91–93 | 355 | three lines (straight + two diagonals), same lattice drawn |
| Mantreswara, *Phaladeepika* (Sastri 1950) | XXVI.26–29, pp.296–299 | 310 | the source verses; chakra drawn on p.297 (added 2026-10-08) |

**Phaladeepika XXVI.26–29 (2026-10-08).** The source behind all three.
Pulippani's chapter 24 text follows Sastri's translation closely: the drawing
instruction, the four rules and Sastri's footnote on Ulka, mostly in the same
words, a few changed, and verse 29's planetary war, meteor fall and portents
left out. Their agreement is therefore not independent. Verse 28 names its seven stars
instead of numbering them: Adhana, Karmarksha, Vipat, Janma, **Vainashika**,
Pratyari, Vadha. Sastri (and Kapoor) number Vainashika the 23rd, citing Jataka
Parijata, whose IX.79 says so in the verse ("त्रयोविंशतिनक्षत्रं वैनाशिकम्",
printed p.625 — Sastri's note says p.635); Kalaprakasika (p.167) makes it the
22nd, which is Gour's number. Both stars are now computed, the 22nd labelled as
that reading. Jataka Parijata vol. II was added to the curated library and the
registry.

Bhat and Gour were added to the curated library and the registry, with K.S.
Charak's *Elements of Vedic Astrology* for the span of Abhijit (276°40′–
280°53′20″), which none of the three gives. Both readings are computed; the
chakra is encoded as coordinates, so both follow from the drawing, and the test
reproduces Pulippani's layout, Bhat's fourteen lines and his worked example
(natal Mrigashira → Uttarashadha; 19th Dhanishta → Vishakha), and Gour's two
examples (Ardra → Purvashadha, Uttarabhadra, Hasta; Shravana → Krittika,
Dhanishta, Magha).

**The rules, computed as dated windows:**

1. The Sun in a star in vedha with the natal (Janma), 10th (Karma) or 19th
   (Adhana) star — with any malefic in the Sun's sign during the window noted.
2. Malefics (Mars, Saturn, Rahu, Ketu) and benefics (Jupiter, Venus, Mercury)
   in those vedha stars, with the days a benefic stands in vedha with the same
   star while a malefic does (Bhat: then "no danger to life").
3. Malefics and benefics occupying the 1st, 3rd, 5th, 7th, 10th, 19th or 23rd
   star (Bhat: occupation, "another kind of Vedha"; Pulippani: "afflicted";
   Gour: vedha, and the 22nd instead of the 23rd). Since 2026-10-08 the 22nd
   is computed too, labelled as Kalaprakasika's and Gour's Vainashika.
4. A planet changing sign while the Moon is in the natal, 10th or 19th star
   (eclipses, planetary war and meteors not computed).

**Our readings, labelled on the page:** Janma, Karma and Adhana are counted in
27 stars, then set on the chakra (Bhat's example); malefic/benefic by natural
nature, the Moon left out (not classified in this section of any book); "the
Sun with a malefic" as the same sign; at rule 4 the Moon's star at the moment
of the sign change (Pulippani says "day").

The books' statements include danger to life and death; they are shown as the
books' words, attributed and collapsed under each rule, and the page states they
are not the software's predictions. Ulka (10th or 21st from the Sun's star) is
recorded but has no stated effect there, so it is not computed.

## Not done

- The default-method decision (see "Decision pending" above).
- Sudamani's Venus line — needs a Tamil reader's decoding of the verse.

## Verified

`test-gochara-vedha.js`: the four books' tables against an independent
transcription; the three Pulippani/VB cells that differ; Kalaprakasika's
layout reading; Sudamani's sets; both methods' pairs; word order; every
citation registered; window boundaries against the ephemeris; Saturn identical
to `/saturn-transit`. `test-nakshatra-vedha.js`: both books' tables against an
independent transcription, the books' example count, word order, citations,
every window's entry and exit against the ephemeris, and "now".
`test-saptashalaka.js`: the layout, both readings, the books' examples,
Abhijit, word order, citations, and every window and sign change against the
ephemeris. Browser-checked with a manually entered chart (nothing written to
the library): the present table, the method switch, the per-planet timelines,
the comparison, the nakshatra section and the Saptashalaka section.
