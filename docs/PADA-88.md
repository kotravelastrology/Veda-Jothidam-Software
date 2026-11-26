# The 88th nakshatra pada (2026-10-08)

`/pada-88` · `src/report/pada88.js` (computation) · `src/report/pada88Tables.js`
(the books' statements) · test `test-pada88.js` with `fixtures/gochara-vedha/pada88.json`.

Counted from the pada (quarter, 3°20′) of the natal Moon, that pada being the
1st, the 88th pada — 87 quarters, 290° on — is evil.

## Four books, two uses

| Book | Words | Use |
|---|---|---|
| Raj Kumar, *Charisma of Planets* §6.4, Table 21 | 299 | transit: every planet there gives evil, per-planet results; worse with more planets; Jupiter's aspect gives some relief |
| Kalaprakasika (N.P. Subramania Iyer) pp.40, 160, 167, 190 | 131 | time: avoid for shaving; a patient's critical period; inauspicious; remedy — the rising sign's lord and the 10th lord friends |
| Vishnu Bhaskar, *Advanced Techniques* ch.14, p.141 | 81 | transit: adverse to the planet's significations and houses; consider position, aspect, conjunction |
| K.T. Shubhakaran, *Nakshatra based predictions* p.357 | 21 | time: no auspicious work |

## Where they differ

- **"In the 22nd asterism":** Raj Kumar writes "the 88th pada of the 22nd
  Nakshatra", and Kalaprakasika's translator adds "(in the 22nd asterism)".
  Counting 88 padas from the natal pada lands in the 22nd star only for a
  1st-pada birth (Vishnu Bhaskar: Ashwini 1 → Sravana 4); for the 2nd–4th padas
  it is the 1st–3rd pada of the 23rd star. Raj Kumar's own example (Rohini 3 →
  Uttarabhadrapada 2) is the 23rd. The page follows the count; both examples
  agree with it.
- Kalaprakasika lists the 22nd star (Vainasika) and the 88th pada as separate
  items.
- Raj Kumar's Table 21 lost one row's planet label at the page break; by order
  and elimination it is Jupiter.

## What is computed

The 88th pada (star, pada, sign and degrees); for every planet the periods it
stands there — the Moon for a year (about six hours a month), the others over
the same spans as `/latta` — with whether transiting Jupiter aspects that sign
(5th, 7th, 9th by sign; at the start, middle and end); the periods when two or
more planets are there together. Kalaprakasika's remedy depends on the lagna of
the moment of an act and is not computed.

## Not here

Prasna Marga (Trisphuta / Panchasphuta in the 88th pada), Muhoorta Sangraha
(the 88th and 108th padas as "vainasika padas" for the person doing the act),
Jataka Desa Marga XIV.38 and C. Patel's *Navamsa in Astrology* (the bridegroom's
Moon navamsa 88th from the bride's — matching), Ernst Wilhelm (shaving) and
*Hindu Electional Astrology* (citing Kalaprakasika). These belong to prasna,
muhurta and porutham pages.

## Verified

`test-pada88.js`: both books' examples; for every one of the 108 natal padas,
the 88th lies 87 padas on and in the 22nd star only for a 1st-pada birth;
Raj Kumar's example through the engine; every window against the ephemeris
(in the pada at mid-window, outside it two minutes before and after); the
Jupiter-aspect flags; the Moon about monthly, about six hours; the
coincidences; word order; citations. Browser-checked with a manually entered
chart.
