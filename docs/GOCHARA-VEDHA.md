# Gochara vedha — all nine planets (2026-10-06)

`/gochara-vedha` · `src/report/gocharaVedha.js` (computation) ·
`src/report/gocharaVedhaTables.js` (the books' tables) · test
`test-gochara-vedha.js` with `fixtures/gochara-vedha/books.json`.

Counted from the natal Moon's sign: a planet in a good house is obstructed when
another planet stands in the paired house (vedha); a planet in a bad house is
relieved when another stands in its paired house (vipareetha vedha). The dates
are astronomy; the pairs are the books'.

## Five books, two computed

Ordered by the words each spends on vedha (owner's rule, 2026-10-03):

| Book | Section | Words | Computed? |
|---|---|---|---|
| Pulippani, *Gochar Phaladeepika* | ch.22, pp.204–206 | 614 | **yes — default** |
| Jataka Parijata vol.3 (Subrahmanya Sastri) | notes to XIII.60, pp.833–834 | 465 | no — reprints Kalaprakasika's table |
| Sudamani (Tamil) | verses 341–343 with commentary, pp.148–150 | 251 Tamil words | no — Venus's line not decoded |
| Kalaprakasika (N.P.S. Iyer, 1982) | pp.209–210 | 248 | no — bad-house rule not stated |
| Vishnu Bhaskar | ch.14 §II, p.139 | 185 | **yes** |

Only Pulippani and Vishnu Bhaskar print a complete table that reads without
guessing, so those two are the computable methods.

## Where they differ

Everything not listed here agrees across all five books.

| Cell | Pulippani | Jataka Parijata / Kalaprakasika | Sudamani | Vishnu Bhaskar |
|---|---|---|---|---|
| Mercury in 10th → vedha in | 8 | 10 printed (same house) | its set holds 8, not 7 | 7 |
| Venus in 11th / 12th → | 3 / 6 | 3 / 6 | commentary 3 / 6 | 6 / 3 |
| 10th as a good house | Rahu, Ketu (no pair) | maps to itself | Mars, Saturn, Rahu (no pair) | — |
| Exemptions | Sun–Saturn, Moon–Mercury, **Venus not by Sun** | Sun–Saturn, Moon–Mercury | — | Sun–Saturn, Moon–Mercury |
| Vipareetha | own table | prose only | reverse (v.343) | reverse (note 4) |

**Findings:**

- Pulippani's own vipareetha table pairs Venus 6↔11 and 3↔12 — the pairs Vishnu
  Bhaskar uses in his gochara table. What the Saturn stage recorded as a print
  swap is the books' disagreement showing up inside one book.
- Kalaprakasika's table (columns I–XII, one row per planet) is laid out as
  "planet in house N — vedha in the house printed under N". Read that way, every
  good-house cell of all six rows is Pulippani's except Mercury's 10th, which
  prints 10. The bad-house columns are not the reversal of the good pairs
  (except Venus's), and the text gives no rule for them, so they are recorded,
  not computed. The reading of the layout is ours.
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
(p.151), checks a planet in a bad house by a planet in a nearby house — the Sun
in the 4th by the 3rd, Venus in the 6th by the 12th — which is the pattern in
Kalaprakasika's bad-house columns that this document calls unexplained above.
Not yet compared cell by cell.

## Not done

- Kalaprakasika's bad-house columns against Santhanam's "Vedha for bad places
  only" table (p.151) — a likely explanation, not yet checked cell by cell.
- Sudamani's Venus line — needs a Tamil reader's decoding of the verse.
- The Saptashalaka (seven-line) nakshatra gochara, Pulippani ch.24 — a
  different system.

## Verified

`test-gochara-vedha.js`: the four books' tables against an independent
transcription; the three Pulippani/VB cells that differ; Kalaprakasika's
layout reading; Sudamani's sets; both methods' pairs; word order; every
citation registered; window boundaries against the ephemeris; Saturn identical
to `/saturn-transit`. `test-nakshatra-vedha.js`: both books' tables against an
independent transcription, the books' example count, word order, citations,
every window's entry and exit against the ephemeris, and "now". Browser-checked
with a manually entered chart (nothing written to the library): the present
table, the method switch, the per-planet timelines, the comparison and the
nakshatra section.
