# Print center (`/print`) and the Research exports

PL9's Print menu (Ephemeris, Panchang, Krishnamurthi, Transit/dasha Report, 1-5 level dashas, Compact lifetime 3 levels) and the Research menu's Export Birth Chart / Export Ephemeris
(files `birthdat` and `ephemeri` of PL9), built from this software's own engines in `src/report/printSets.js`; page `app/print`; test `test-print-sets.js`; a **Print** menu in the top bar.

- The document shown on the page is the one that prints: a print stylesheet (`app/globals.css`, `@media print`, `body:has(.print-area)`) hides everything else; the browser's print
  dialog (Ctrl+P) can also save it as a PDF. (VJ-019's verified PDF pipeline for the full report is unchanged; these are table documents.)
- **Ephemeris**: a month, nine grahas, sidereal longitudes and daily speeds (retrograde marked), at 0h UT or at 0h of the person's local time. Against PL9's ephemeris file of the audit
  (row 18-09-26, which is local midnight at UT+5:30) the Sun, Mars, Mercury, Jupiter, Venus and Saturn agree to a second of arc, the Moon to seven, the mean node to eight.
- **Panchang**: each day of a month at the person's place, the Tirukanita limbs with their end times (the sunrise-day rule of `tirukanitaPanchangam.js`).
- **KP**: cusps, planets, four-level house significators (`kpSystem.js`).
- **Dashas 1-5**: Vimshottari; levels 4 and 5 only inside a window of years and at most 800 rows. **Compact lifetime**: nine dashas x nine bhuktis with the antara lords in a cell.
- **Transit/dasha report**: the five-level dasha running on a date, and the nine grahas' transit longitudes with the houses from the birth lagna and the birth Moon.
- **Birth data file** (tab separated, one record: name, place, date, time, Julian day, offset, coordinates, ayanamsha, lagna and the nine longitudes) and **ephemeris CSV**: this
  software's own layouts; PL9's file layouts are not reproduced and no claim of compatibility is made.
- "Copy screen to clipboard" is the text of the document (`உரையாக நகலெடு`), not a picture.

## Not built
User Defined Printouts / Design Tool and PL9's 88-page default print set (a fixed list of its own report pages), Printer Setup (the browser's print dialog does it), the Printing
preferences (fonts, colour coding), and printing every report page as PL9 does.
