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

## Not here

The per-planet result texts of chapters VI-XII (the effects of 8 to 0 bindus in a bhava, and of a bindu or void Kakshya,
planet by planet — the Sun's are slokas 1-3 of chapter VI) and the other authors Patel cites. Those are the next stage.
