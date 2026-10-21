# Kakshya in every planet's transit (2026-10-21)

`/kakshya-transit` · `src/report/kakshyaTransit.js` (computation) · `src/report/kakshyaTransitTables.js` (Patel's
doctrine) · test `test-kakshya-transit.js` (uses `fixtures/saturn-transit/ashtakavarga-patel.json`).

C.S. Patel and Subramania Aiyar, *Ashtakavarga* chapter V: each planet in transit crosses the eight Kakshyas of every
bhava; a Kakshya "has a bindu" when its lord gave a bindu in that bhava in the planet's **own** Prastarashtakavarga.
`/saturn-transit` read this for Saturn alone (the "Still open: Kakshya for the other planets" of
`SATURN-TRANSIT-remedies.md`); this page reads it for the seven planets, with the same bhavas, Kakshya parts, lord order
and bindu tables (`saturnAshtakavarga.js`, so Patel's two table differences apply here too).

## What is computed

For the moment chosen (now by default): for each of the Sun, Moon, Mars, Mercury, Jupiter, Venus and Saturn — its sign,
bhava (Patel's Sripati bhavas from the Lagna and MC) or sign, Kakshya 1-8 and the Kakshya's lord, whether the lord gave a
bindu (**bindu / void**), the bhava's bindu count in the planet's own Ashtakavarga, and whether the planet is debilitated,
in an enemy's sign or combust (sloka 5: with a bindu but in such a state, "great sorrow"). Then Patel's slokas 6-10:
how many of the seven are in bindu Kakshyas (4 wealth, 5 honour / health / apparel, 6 coronation, 7 a kingdom) or in void
ones (4 loss of wealth, 5 sickness, 6 misfortune, 7 possible death; certain death if all seven are void and one of
them stands in a bhava where its own Ashtakavarga has no bindu). Sloka 11's extremes (a bhava with 0 or 8 bindus; 7 + 1
and 1 + 7) are shown beside each planet's count. And, for each planet, its Kakshya windows around the moment — dated,
with the bindu / void state; the Moon's are in hours.

Two methods: Patel's bhava method (default) and the sign method (eight equal parts of each sign).

## Verified

- The printed averages (p.71 — Sun 3¾ days, Moon 6¾ hours, Mars 5, Mercury 2½, Jupiter 1½ months, Venus 3, Saturn 3¾ months):
  Sun, Moon, Jupiter and Saturn equal their sidereal periods over 96 Kakshyas to within 2.5 %; the Moon's computed mean
  window is the printed 6¾ hours (sign method, 4 %).
- Every window is contiguous with the next, exactly one is current and is where the planet stands, each lord and bindu
  is recomputed from the planet's Prastara, and at a window's start the planet is at the Kakshya's edge (0.05°).
- Patel's standard horoscope (the p.68 example): the Sun's four bindu Kakshyas in the Lagna bhava are Jupiter, Mars, Sun and
  Mercury. A chart built through the same pipeline as the page runs end to end.

## Our readings

- Rahu and Ketu have no Ashtakavarga and are not here. The Patel p.71 averages for them (2¼ months) are not shown.
- "Debilitated" and "enemy's sign" are Phaladeepika's (I.6, II.21-22); combustion degrees are Kapoor's note to II.36
  and Vishnu Bhaskar's (Mercury 14 / 12 retrograde, Venus 10 / 8). Patel does not define them.
- Sloka 14's "Upachaya / Anupachaya house" is quoted, not computed.
- In the bhava method the Kakshyas are not equal (they follow the bhava's width), so the mean window differs from the
  book's rounded figure.
- A statement of the book, not a prediction.

## The results (chapters VI-XII)

`src/report/kakshyaResultsTables.js`: for each planet, the three slokas that open its chapter — what its transit through
a bhava holding 8 to 0 bindus brings (sloka 1, with the shorter list "given by other authors", different for each planet
and absent for Venus), and what it brings while it crosses a Kakshya with a bindu (sloka 2) or without one (sloka 3).
Read from the page images (the scan's text layer scrambles the columns; Mercury's 2 and 3 run into one another in it).
The Tamil is ours; the cells are the book's. Saturn's first sloka is the one `/saturn-transit` already holds. The page
shows, for each planet now, the text for its bhava's count and for its Kakshya's bindu or void, with the page.

Pages (printed): Sun VI p.76-77, Moon VII pp.87-88, Mars VIII pp.96-97, Mercury IX pp.105-106, Jupiter X pp.115-116,
Venus XI pp.139-140, Saturn XII pp.153-154.

## Not here

The rest of each chapter (the planet's rasi-by-rasi rules, the worked examples, the direction and timing rules — for
example Mars's slokas 4-5 on the direction of the bhava with most bindus), and the other authors Patel cites
at length. Rahu and Ketu have no Ashtakavarga.
