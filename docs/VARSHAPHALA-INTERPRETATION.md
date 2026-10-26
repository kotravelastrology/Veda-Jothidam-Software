# Varshaphala interpretations (PL9 gap register group 4)

Source: *Tajika Bhushana* of Ganesha Daivajna (Sanskrit verses, Hindi commentary; corpus C28), chapters 2 and 3, printed pp.10-21 (printed = PDF - 4),
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

## Choices to check
- v.23 does not list the good and bad places. The good places are taken as 1, 2, 3, 5, 9, 10, 11 and the bad as 4, 6, 7, 8, 12 from the tenor of the twelve
  verses (v.12 praises the 2nd; v.14 condemns the 4th).
- The commentary on v.15 prints "9" for the fifth bhava and a reader has written 5; the verse is taken as the 5th. The commentary on v.1 has an overwritten
  first word; the verse itself names the 8th, 2nd, 6th and 12th and the commentary the 2nd, 6th and 12th.
- v.9 (Jupiter with the Muntha) carries the note "the result of Venus too" in the commentary; kept as printed.

## Not built
Saturn with the Muntha (v.10, which runs off the edge of the scan); Rahu-mukha and puccha (v.4; the Muntha is a sign here); Tajika aspects, combustion and
retrogression of the Munthesha (v.1, v.3); the Harsha-sthana chapter (printed 21, built elsewhere as Harsha Bala); the bhava-by-bhava results of
the annual chart (printed 32 on) and the Mudda dasha results, which are the rest of the PL9 "Chart" and "Dasha interpretations".

## A difference to resolve
The book selects the Varshapati by strength and aspect on the varsha lagna among the five office-holders (ch.1, v.34-37, printed 10). `varshaphala.js`
selects by the number of roles, with a Pancha-Vargeeya tie-break and a lagna-aspect tier (its own comment calls this a simplification). Not changed here.
