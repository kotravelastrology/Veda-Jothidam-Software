# Gemstones (ரத்தினங்கள்) — `/gemstones`

**What it is:** what three books say to wear for a person's chart, each with
its page, side by side. **What it is not:** a recommendation. The books use
different methods and disagree on particular gems, so the page chooses nothing
and claims no benefit; results a book names are shown as that book's words.

## Book order (owner, 2026-10-03)

"Show the book with the most explanation first, then the others in order."
Measured as words in each book's gem-selection section (PDF text layer):

| # | Book | Words | Section |
|---|------|------:|---------|
| 1 | Kapoor, *Remedial Measures in Astrology* | 8,410 | PDF 72-95 (printed pp.76-99) |
| 2 | Tilak Raj, *Remedies of Astrological Science* | 4,713 | PDF 24-37 (printed pp.20-33) |
| 3 | Raj Kumar, *Astro Remedies: A Vedic Approach* | 3,496 | PDF 123-143 |

Counting whole gem chapters instead keeps Kapoor first (11,807) and puts Raj
Kumar second (11,189) — his extra pages are gem quality, substitutes and
"energising", not choosing. `BOOK_RANK` in `src/report/gemstoneTables.js`
holds both measures; the page and the engine output follow the order.

## What each book contributes

- **Kapoor** (`src/report/gemstoneKapoor.js`) — chapter V, a paragraph for every
  gem and every Ascendant (84) plus one rule for Rahu/Ketu. Each paragraph is
  encoded as: the houses he says the planet rules, his verdict, the placements
  that change it (tried in his order and settled against the chart — e.g.
  "only in its major period, if in its own sign in the 3rd"), his reasons, the
  results he names, the gem to pair it with, and conditions this software
  cannot judge (illness, old age, short life, affliction). Ruling stone p.77.
- **Tilak Raj** — a verdict for each of 7 gems × 12 Ascendants (pp.25-32),
  gomed/cat's eye (pp.32-33), the Jeevan/Karaka/Bhagya-ratna table and the
  yogakaraka/malefic table by Ascendant (p.21), general rules (p.20).
- **Raj Kumar** — benefic/malefic table by Ascendant or Moon sign (PDF
  123-124), "who should wear" each gem (PDF 124-143), counter-gems for a
  troublesome dasha (PDF 143-144), two lordship rules that contradict each other.
- **Wearing** (`src/report/gemstoneWearing.js`) — all three give weight, metal,
  finger, day and gems not to combine; shown side by side, weights in each
  book's own unit (carat / ratti; no book gives a conversion).
- Planet→gem: the *Jataka Parijata* verse, Kapoor p.12 (English names all nine);
  repeated on p.76, where the English omits Saturn.

## Findings recorded, not resolved

- Kapoor's printed errors (page images checked): Sagittarius's lord called
  "Mars" (p.80); Aquarius Jupiter "lord of 2nd and 12th, both wealth giving"
  — really 2nd and 11th (p.92); Taurus Saturn "with emerald, the gem of the
  Ascendant lord" — Venus's gem is diamond (p.96).
- Kapoor is stricter in practice than his stated rule: every pure 6/8/12 lord
  is advised against and every Ascendant lord favoured, but 16 of 41 lords of
  no 6th/8th/12th house are also advised against (3rd house, maraka 2nd/7th).
- Tilak Raj: Pisces Venus "3 and 7" (really 3 and 8); "Emerald" under
  Sagittarius/Jupiter; ruby weight printed "314 Rattis" (read 3¼); his p.20 rule
  bars 2nd/12th lords' gems yet 10 of his verdicts favour them; his p.21 table
  calls the Sun yogakaraka for Taurus while his Taurus paragraph says avoid.
- Raj Kumar: 8 of 12 table rows list as benefic a gem of a 6/7/8/12 lord;
  "who should wear" contradicts itself 7 times (Aries is in both his "limited"
  and "avoid" lists for blue sapphire; Capricorn and Aquarius are "good" while
  his clause bars Saturn as 2nd/12th lord); the PDF drops a line at some page
  breaks (pearl and coral "not with" lists are cut).
- "Not with" lists are not always stated both ways within a book.
- "Agreement" compares Kapoor, Tilak Raj and Raj Kumar's Lagna row; the
  Moon-sign row is shown separately.
- No Tamil book gives an assignment or selection rule; Tamil gem names are OCR
  text of Jathaka Alangaram, page unverified.

## Tests

`node test-gemstones.js` — Kapoor's 84 paragraphs and Tilak Raj's 84 entries
equal an independent second transcription (`fixtures/gemstones/definitions.json`);
the books' stated lordships against the real ones; Tilak Raj's ratna table
against the 1st/5th/9th lords; each book against its own rules; Kapoor's
placement cases on constructed charts; book order follows the word counts.
