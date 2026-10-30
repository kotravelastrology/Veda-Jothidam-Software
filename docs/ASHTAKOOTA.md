# Ashtakoota — the eight kootas, 36 gunas (2026-10-21)

Section on `/porutham` (below the Tamil poruthams) · `src/report/ashtakoota.js` · `src/report/ashtakootaTables.js` ·
test `test-ashtakoota.js` with `fixtures/ashtakoota/shridhar-18-33.json`. The PL9 audit's "Ashtkoot Guna Chart" (E628):
the eight kootas with each partner's value, maximum, marks gained, dosha and "area of life", the total in 36.

Source: V.K. Shridhar, *Hindu Electional Astrology* §18.7, pp.478-540. His conventional tables, bride in the rows and
bridegroom in the columns, read from the page images: Varna 18.8, Vashya 18.11, Tara 18.13, Yoni 18.14, Graha Maitri
18.17, Gana 18.18, Bhakuta 18.20, Nadi 18.22; his verdict bands (31-36 excellent, 21-30 very good, 17-20 middling, below
17 not recommended; with Bhakuta absent 26-30 very good, 21-25 middling, 20 and less rejected; Nadi dosha rejects even
28 gunas).

## What was verified, and the one thing that does not agree

- The printed 12 × 12 Bhakuta table is exactly "the bridegroom's sign is the 1st, 3rd, 4th, 7th, 10th or 11th from the
  bride's" (all 144 cells). The printed Tara table is exactly the counting rule in the text (80 of 81 cells; the one
  cell the rule does not give — bride group 2, bridegroom group 9 — prints "3 (-G)" where its own rule gives 1.5, a misprint).
- Graha Maitri 18.17 is symmetric; Yoni's natural enemies are 0 both ways; each Gana and each Nadi holds nine stars.
- **The book's own grand table, 18.33 (a-f), does not agree with its eight tables.** For three brides (Ashvani, Bharani,
  Krittika pada 1) against 18 bridegroom columns — 54 cells read at 3.4× — the eight tables give the printed total in 24
  and differ by 1 or 2 gunas in 30. For the Ashvani bride the difference follows the bridegroom's yoni animal (the grand
  table behaves as if Horse–Sheep, –Cat, –Rat, –Cow were 3 and Horse–Serpent 2); for the Bharani bride it does not. The
  fixture records every cell, the page shows the eight tables' sum, and the page and this note say so. Not explained.

## Our readings

- Yoni: each star's animal from Table 18.14's two columns. The table prints Uttarabhadrapada twice (Lion's male star, Cow's
  female star) and has no Purvabhadrapada — read as Purvabhadrapada for the Lion. Abhijit is not a separate star here.
- "Dosha" is any koota short of its maximum; "major" is Nadi 0, Bhakuta 0 and Gana 0-1, which is what the underlining in
  Table 18.33 follows in the cells sampled (the book does not state the rule).
- Vashya for Sagittarius and Capricorn is split at 15° of the sign (Table 18.11).

## Not here

Shridhar's other tables (the Varna by the sign's lord 18.9, the other Vashya opinions 18.12, the alternative Gana 18.19, the
"suggested" Bhakuta 18.21 — its shaded cells cannot be read in the scan), Chatur and Panch Nadi, the exceptions
and antidotes (§18.8.1: planetary friendship cancelling Gana / Nadi dosha, navamsha lords), Rajju, Mahendra, Vedha,
Stree-Deergha. And **Saptapadi** (PL9's 4/7 chart, E646): no book held gives its rule. Muhurta Chintamani's wording of the
eight kootas (the Melapaka of marriage) is not yet laid beside Shridhar's.
