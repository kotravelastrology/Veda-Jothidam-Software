# Dasa-koota (PL9 "Dash-Koota 27.5/44") — research, 2026-10-28

## What the app has

`/porutham` shows the ten South-Indian poruthams (`src/report/tamilPorutham.js`) from Kalaprakasika (N.P. Subramania
Iyer, 1982, printed pp.69-76). Nine of the ten are page-verified. The tenth, Rasi Adhipathi (ராசி அதிபதி, the lords of the
two Rasis), is an earlier port whose rule, "the two lords differ", is not in the book. The module header says so.

PL9 shows an aggregate score, 27.5 out of 44. No book held has that total, and the app deliberately shows no
aggregate of its own (`/matching` report studio audit, 2026-10-05).

## What Kalaprakasika prints for the Rasi lord (item 7, printed pp.74-75)

| Lord (Rasis) | Friends as printed | Enemies as printed |
|---|---|---|
| Mars (Aries, Scorpio) | Mercury, Venus | the other planets |
| Venus (Taurus, Libra) | all except Sun and Moon | Sun, Moon |
| Mercury (Gemini, Virgo) | all except Sun | Sun |
| Moon (Cancer) | Mercury, Jupiter | not stated |
| Sun (Leo) | Jupiter only | not stated |
| Jupiter (Sagittarius, Pisces) | all except Mars | Mars |
| Saturn (Capricorn, Aquarius) | **not stated** | Jupiter |

Checked against the page images, printed p.74 (Mars to Sun) and p.75 (Jupiter, Saturn).

## Why this cannot yet decide the factor

1. **No agreement rule is printed.** The lines above give each lord's friends. Nothing says whether the two lords must
   be friends, identical, or something else. The factor's only stated meaning is "Rasyadhipathi indicates prosperity in
   corn" (printed p.76), inside the ten considerations, where at least five must agree (printed p.76).
2. **The table is not symmetric.** Jupiter's friends are "all except Mars", which includes Saturn, but Saturn's line
   names Jupiter as his enemy. For that pair the book's two lines disagree.
3. **Saturn's friends are missing.** Only his enemy is printed.

## Searches made (`D:\1\astro_library_index\library.db`, FTS)

"dasa koota", "dasakoota", "dasa-koota", "dasa kuta", "dasakuta", "dasha koota", "dasa porutham", "tamil porutham",
"ten poruthams", "rasyadhipathi" (8 hits, Kalaprakasika pp.104-106 and others), "rasi adhipathi", "lords of the janma
rasis", "rasyadhipathi friends", "sudamani porutham". No book in the index gives the 44-point scheme or the 27.5 total.
The index holds no Sudamani Ullamudaiyan text, though the module's test cites one.

## Options for the owner

- **A.** Keep the current "lords differ" rule, shown as unsourced. Nothing changes; the register stays as it is.
- **B.** Adopt "the two lords are friends in either direction", labelled as inferred from the friendship table rather
  than printed. Saturn's missing friends and the Jupiter–Saturn conflict must then be decided first.
- **C.** Find a text that prints the agreement rule (Sudamani Ullamudaiyan, or a Tamil source), then build from it.
- The 44-point scheme and the 27.5 total need a source before any of this is built.

## Decision (2026-10-28): option 2

The Rasi-lord factor is shown, not counted.

- Each match shows whether the two Rasi lords are friends, read in either direction from the printed lists.
  Saturn's friends are not printed, so his pairs are judged by the other lords' lists.
- The factor is not counted. The total goes from 10 to 9. The level thresholds (8, 6, 4) are unchanged, so
  a match now reaches each level one factor sooner in proportion to the total.
- Before this change the factor counted as "the lords differ", which the book does not state. Scores
  therefore change for matches where that factor was the only difference from the book's view.
- Option B (counting it as an inferred rule) is still open, and would need the Jupiter–Saturn reading settled
  in writing.
