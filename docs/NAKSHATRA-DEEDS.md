# Nakshatras and suitable deeds (2026-10-21)

`/nakshatra-deeds` · `src/report/nakshatraDeeds.js` (the table and the search) · `src/report/nakshatraDeedsTables.js`
(classes, mukha groups, Tamil words) · `src/report/data/nakshatraDeeds.json` (the deeds) · test `test-nakshatra-deeds.js`
with `fixtures/nakshatra-deeds/books.json`.

Kalyanraman, *Muhoortha Sangraha* vol. 1, chapter 9 (printed pp.140-215) gives, for each of the 27 nakshatras and
Abhijit, the deeds it is "good for performing" (in paragraphs) and a second, alphabetical list of what it "can also be
selected for". The other nine books give the stars for an act; this gives the acts for a star — the same material read
the other way round. It is not a time rule: no tithi, weekday or lagna.

## What the page shows

- **A star:** its kind, the weekday of that kind, its mukha group, Kula / Akula / Kulakula, both lists as printed, the
  book's introduction (English), and the book's own pages.
- **The seven kinds** (Sthira 4, Chara 5, Misra 2, Ugra 5, Kshipra 3 + Abhijit, Mridu 4, Teekshna 4) with the weekdays
  (Sunday, Monday, Wednesday, Tuesday, Thursday, Friday, Saturday) and what each suits; **the three mukha groups** of
  nine (Urdhva, Adho, Tiryang).
- **Search from a deed to the stars:** Tamil or English; a Tamil word stands for the English the book uses
  (`SYNONYMS`, ~55 words, case endings tolerated); several words must all be in the one deed; the unknown Tamil words are
  named, not guessed. "Marriage hall" is not counted as a marriage.

## Numbers

28 entries, 1,858 deeds in the first lists and 901 in the second. Each kind also takes the deeds of another kind
(Sthira ← Mridu, Chara ← Laghu, Misra ← Ugra, Ugra ← Teekshna, Kshipra ← Chara, Mridu ← Sthira; Teekshna names none);
that borrowing is recorded but those lists are not merged.

## How the text was read

The scan's text layer was too broken (run-together bold words, header fragments), so the 72 pages were re-read with
Tesseract at 3× and the deeds were split by the book's own structure (the "following activities" line, the
"also good for" line, one item per line in the second list). The scan runs many bold words together
("Causingdeceit"); they were separated with a vocabulary taken from the book itself, then the ~190 items holding a
word seen only once were read through and the doubtful ones corrected. Checked against the page images: Bharani,
Chitra, the Ardra page, Abhijit; the rest from the OCR text alone, so a stray misreading may remain. The book prints "Moingspinning" for Chitra where the other lists print "Doing spinning" — read as
the latter. Abhijit sits inside Uttara Ashadha's pages and is given its own entry.

## Our readings

The deeds are the book's English, unchanged except for separating run-together words and the misprints listed above;
the headings, kinds, notes are Tamil. The Kula / Akula statement is read from each star's introduction (12 / 12 / 3).

## Not here

The other kinds' deeds merged into each star; the tithi, weekday and lagna rules (see `/muhurta-stars`); a Tamil
rendering of the deeds themselves (the search words are Tamil; the deeds stay English).

## Verified

`test-nakshatra-deeds.js`: the seven kinds, weekdays, mukha and kula groups against a fixture typed from the book's
introductions; each star's borrowed kind; every deed list free of header noise and run-together words; the
alphabetical order of the second lists; the first and last deed, the counts and the pages of every entry; the start
pages read from the page images; citations (printed pages, never PDF); the search in Tamil and English. Browser-checked.
