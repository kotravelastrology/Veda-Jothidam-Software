# Varshaphala interpretations (PL9 gap register group 4)

Source: *Tajika Bhushana* of Ganesha Daivajna (Sanskrit verses, Hindi commentary; corpus C28), chapters 2, 3, 5, 8 and 9, printed pp.10-21, 45-63 and 73-90 (printed = PDF - 4),
read on the page images; reading notes in `docs/TAJIKA-BHUSHANA-NOTES.md`. Verses glossed in Tamil in `fixtures/varshaphala/tajika-bhushana.json`, embedded as
`src/report/varshaInterpretationTables.js`. Engine `src/report/varshaInterpretation.js`, test `test-varsha-interpretation.js`, a new section on `/varshaphala`.

## What it gives
For the year's annual chart (built by `varshaphala.js`):
- the verse for the **Muntha's bhava counted from the varsha lagna** (v.11-22);
- the verse for each planet standing in the **Muntha's sign** (v.5-9: Sun, Moon, Mars, Mercury, Jupiter);
- the **Munthesha's** bhava: a verse if it is in 9, 11, 3 or a kendra (v.2) or in 8, 2, 6, 12 (v.1);
- the mixed reading (v.23) when the Muntha is good from one lagna and bad from the other;
- the **year lord's** three readings, strong, middle and weak (v.4-24), beside the Pancha-Vargeeya strength the engine computes. The verses give no
  numbers for the three grades, so none is chosen.

No reading is ranked or merged. The book's own rule (v.24) is that the Munthesha's strength raises or lowers every reading.

- the **planet-in-bhava** verses of chapter 5 (printed 45-63): for the Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn and Rahu, the verse of the bhava each
  holds from the varsha lagna (v.2-98, twelve per planet; Ketu has none). The Moon's v.14 (more light, more auspicious) is shown with her verse, without a figure.
- the **Mudda dasha results** (chapters 8-9, printed 73-90): for each dasha of the year, the four graded results of its lord (strong, middle, weak, destroyed), the
  book's rule for a planet in good places, the lagna dasha graded by the drekkana of the varsha lagna (v.36), and the six antardasha results (v.2-43, 42 in all).
  The book gives no threshold for the four grades, so all four are listed.

## Choices to check
- v.23 does not list the good and bad places. The good places are taken as 1, 2, 3, 5, 9, 10, 11 and the bad as 4, 6, 7, 8, 12 from the tenor of the twelve
  verses (v.12 praises the 2nd; v.14 condemns the 4th).
- The commentary on v.15 prints "9" for the fifth bhava and a reader has written 5; the verse is taken as the 5th. The commentary on v.1 has an overwritten
  first word; the verse itself names the 8th, 2nd, 6th and 12th and the commentary the 2nd, 6th and 12th.
- v.9 (Jupiter with the Muntha) carries the note "the result of Venus too" in the commentary; kept as printed.

## Not built
Saturn with the Muntha (v.10, which runs off the edge of the scan); Rahu-mukha and puccha (v.4; the Muntha is a sign here); Tajika aspects, combustion and
retrogression of the Munthesha (v.1, v.3); the Harsha-sthana chapter (printed 21, built elsewhere as Harsha Bala); Ketu (no verses); the sahams, yogas and arishta (printed 64-68), the
Mudda dasha results (read; see above), the sahams (printed 68-71) and the monthly entry (90-93), which are the rest of the PL9 "Chart" and "Dasha interpretations".

- The commentary's fifth-bhava number is misprinted "9" for seven planets (see the notes); the verse's own word for son fixes it and the verse numbers run in
  order, so it is read as the fifth.

- The book's Mudda dasha divides a 360-day year (printed 75); `varshaphala.js` divides 365.25 days. The page's dates are the engine's; the book's own worked table
  does not fully follow its method (Sun and Jupiter differ; the printed days add to 355), so it is not used as a test. Not changed.
- v.36 of chapter 9 has a printed misprint (Mars for Mercury) in the commentary; the verse's word fixes it as Mercury.

## A difference to resolve
The book selects the Varshapati by strength and aspect on the varsha lagna among the five office-holders (ch.1, v.34-37, printed 10). `varshaphala.js`
selects by the number of roles, with a Pancha-Vargeeya tie-break and a lagna-aspect tier (its own comment calls this a simplification). Not changed here.
