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

## Not done

- Nakshatra vedha (Pulippani ch.23) — a different system, not started.
- Kalaprakasika's bad-house columns — need a statement of the rule.
- Sudamani's Venus line — needs a Tamil reader's decoding of the verse.

## Verified

`test-gochara-vedha.js`: the four books' tables against an independent
transcription; the three Pulippani/VB cells that differ; Kalaprakasika's
layout reading; Sudamani's sets; both methods' pairs; word order; every
citation registered; window boundaries against the ephemeris; Saturn identical
to `/saturn-transit`. Browser-checked with a manually entered chart (nothing
written to the library): the present table, the method switch, the per-planet
timelines and the comparison.
