# The onset of an illness (2026-10-21)

`/roga-arambha` · `src/report/rogaArambha.js` (computation) · `src/report/rogaArambhaTables.js`
(the books' statements) · test `test-roga-arambha.js` with `fixtures/roga-arambha/books.json`.

"The time a disease begins indicates the outcome of the disease" (Wilhelm). The page lays eight
books' statements side by side for all 27 stars — how long the illness lasts, or that it is grave —
and, for the moment an illness began, what each book says: the star lists, and the combinations of
weekday, tithi, karana and the patient's own birth star.

## Eight books

Order by words (owner's rule, 2026-10-03):

| Book | Words | What it gives |
|---|---|---|
| Wilhelm, *Classical Muhurta* pp.270-272 | 681 | Kalaprakasika's 27 lengths with Muhurta Chintamani's beside them; seven stars "problematic"; tara, tithi, karana; the two combinations |
| Shridhar, *Hindu Electional Astrology* §22.1, pp.601-602, Table 22.2 p.609 | 496 | seven death stars; Table 22.1; B.J.S., B.D.R.; Tri-Nadi; snake bite; and Table 22.2 — length and the days of trouble in each quarter of the star, with what to give away |
| Kalaprakasika (N.P. Subramania Iyer) ch.XXX pp.159-160 | 356 | the original list; the three Sunday / Tuesday / Saturday combinations; tithis; karana; tara |
| Muhurta Chintamani (G.C. Sharma) pp.79-80 | 243 | seven death stars; lengths for 19 more (not Magha); snake bite; the eleven-star combination |
| Kalyanraman, *Muhoortha Sangraha* II p.201 | 191 | groups, not days ("not vouched by standard texts"); snake bite; ten-star combination |
| Joshi, *Muhurta: Traditional & Modern* Table 13.1, pp.147-148 | 180 | the same lengths as Muhurta Chintamani plus Magha 20; "This needs research" |
| Raman, *Muhurtha* ch.XV | 134 | no lengths: seven stars needing treatment, the three combinations, tara 3-5-7, the 14th-day crisis |
| Rangacharya, *Muhurtha Sindhu* p.133 | 98 | 20 lengths; six "fatal" stars |

## Where they differ

- **Moola:** Shridhar's table 7 days; Muhurta Chintamani, Joshi, Rangacharya 9; Kalaprakasika, Wilhelm 10 nights.
- **Magha:** not in Muhurta Chintamani; Kalaprakasika "dangerous"; Shridhar, Joshi, Rangacharya 20 days; Kalyanraman over a month.
- **The seven death stars** (Swati, Jyeshtha, the three Poorvas, Ardra, Ashlesha): Muhurta Chintamani, Joshi, Shridhar say death;
  Kalaprakasika and Wilhelm give 21 / 10 nights / 12 / 8 nights; Kalyanraman "very difficult"; Rangacharya's fatal list is another six.
- **Wilhelm's account of Muhurta Chintamani** parts from the verse itself at Vishakha (11, verse 15), Dhanishta (11, 15) and
  Uttarabhadrapada (9, 7), and is silent on Uttaraphalguni. Both are kept, each on its own page.
- **Shridhar Table 22.1**, Tuesday: Swati, Jyeshtha, **Magha**; Kalaprakasika, Wilhelm and Raman print Bharani. As printed.
- **Combination stars:** Muhurta Chintamani eleven (with Dhanishta; tithis 4, 9, 14, 12, 6); Joshi and Kalyanraman ten (tithis 4, 6, 9, 12, 14).
- **Tara:** Kalaprakasika, Wilhelm — Janma, 3, 5, 7, 10, 19; Raman — Janma, 3, 5, 7.
- Rangacharya prints Bharani and Satabhisha as both 11 days and fatal. Shridhar's table has no Revati row, no mantra counts, and no key to its 0s.

## What is computed

The Moon's star and quarter, tithi, karana and the Sun's star at the moment (astronomical; the weekday begins at sunrise, so the
place is asked); each book's cell for the star with the expected date, Shridhar's quarter days and the donation, the star-list flags;
every combination as met / not met / unknown (the birth-star rules are unknown without a patient — never "false"); snake-bite
rules only when "bite" is chosen. Raman's "14th day" is the Moon opposite its onset place — our calculation, the book gives no time.

## Our readings

"Night" and "day" both count as a day for the date; a fortnight is 15 days, a month 30. Tithi numbers apply to both fortnights.
Shridhar's B.D.R. says only "malefic days" — taken as Sunday, Tuesday, Saturday. Muhurta Chintamani's relief for a snake bite
(the Moon strong by transit) is not computed.

## Not here

The Moon's strength in transit, Kalaprakasika's other critical times (Chandrashtama, Dagdha yoga, the 22nd star, the 88th pada —
the last is `/pada-88`), the remedy mantras Shridhar mentions but does not print, and medical election (taking medicine, surgery,
the first bath — acts on `/muhurta-stars`).

## Verified

`test-roga-arambha.js`: every book's list star by star against a fixture grouped as the book groups it (Shridhar's Table 22.2 and
Joshi's Table 13.1 read from the page images, Revati's missing row noted); Wilhelm equals Kalaprakasika but for two units and its
Muhurta Chintamani remarks part from the verse at exactly three stars; flags and combinations; Tri-Nadi table; word order;
citations (printed pages, never PDF); the moment's star, tithi, karana and weekday against the tirukanita panchangam's reference day
(5 September 2026, Erode) and before / after sunrise; rules with and without a patient; the new moon as its own tithi; the Moon's
opposition about 14-15 days on. Browser-checked.
