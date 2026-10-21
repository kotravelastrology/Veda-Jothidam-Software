# BPHS chapter 46 sign dashas

Page `/bphs-rashi-dashas`; engine `src/dasha/bphsRashiDashas.js`; test `test-bphs-rashi-dashas.js`.
Source: Brihat Parashara Hora Sastra, Santhanam ed., Vol.2, ch.46, printed pp.553-558 (Chara, Sthira, Brahma Graha), p.560 (Yogardha), p.564 (Mandooka). PDF page = printed - 489. Read from page images.

Built (register level SOURCED): Chara, Sthira, Yogardha, Mandooka. Each starts at birth (no balance).

- Chara: direction by the pada of the 9th sign from lagna; each sign counts to its lord's sign, forward for odd pada and backward for even; own sign = 12; Scorpio/Aquarius use the printed tie rules; +1 for an exalted planet in the counted sign, -1 for a debilitated one.
- Sthira: 7/8/9 for movable/fixed/dual from the Brahma Graha's sign. Brahma Graha: the lord of 6/8/12 from the stronger of lagna and 7th, standing in an odd sign among the six signs counted backward from that house; most degrees wins. Rahu and Ketu are not taken as lords. If none qualifies the page says so and builds nothing.
- Yogardha: (Chara + Sthira)/2, from the stronger of lagna and 7th.
- Mandooka: Sthira years, every third sign; fixed, then dual, then movable.

The printed example (Aquarius lagna chart, p.558) is the test. Cells where the printed table does not follow the printed rule are recorded, not forced:
- Chara Scorpio: table 6, rule gives 1 (Ketu's dual sign beats Mars's fixed sign; Yogardha's table also uses 6).
- Chara Capricorn: table 5, rule gives 2 (the Yogardha table, 4½, uses 2).
- Yogardha Leo: table 8, (7+8)/2 = 7½.

Not built, with reasons on the page: Kendradi, Trikona (printed years do not follow its rule), Shoola, Dirga, Navamsha, Narayana, Niryana Shoola, Drig, Padanadhamsa.
Open choices recorded: start sign of Chara is lagna as in the example (the text does not say "stronger of lagna/7th" for Chara); the 4 Atmakaraka variants are not built.

Added 2026-10-21: Dirga (vv.185-187, pp.567-568: 9th/10th/11th signs each followed by the signs it aspects; movable backward, fixed onward, dual odd onward / even backward; Sthira years) and Lagnadi (vv.188-190, pp.569-570: elapsed fraction of the birth star x 12 signs added to lagna longitude; first dasha has a balance). Both reproduce the printed example. Dirga is no longer in the "not built" list.
Yogini (BPHS vv.195-199, pp.571-572) promoted STRUCTURE_ONLY -> SOURCED 2026-10-21.

Niryana Shoola (Jaimini Sutras 2.3.18, Sastri printed pp.217-219, strength ladder from Rangacharya's Sutramritam pp.125-127; `src/dasha/jaiminiShoola.js`, test `test-jaimini-shoola.js`): 9 years per sign from the stronger of lagna and 7th, onward if odd and backward if even; Shoola signs = 1st, 5th, 9th from the start. Listed on the same page. Tested on Rangacharya's worked chart (7th, Taurus, wins because Venus is exalted against Mars in moolatrikona). Rahu/Ketu are not taken as lords of Scorpio/Aquarius in the ladder; degrees of the worked chart are not printed, so mid-sign values are used.
Dirga: when the 9th/10th/11th are not movable/fixed/dual in that order, signs repeat and some are never reached; the page reports the gap.

Jaimini Chara and Narayana (Rath, Jaimini Maharishi's Upadesa Sutras: 1.1.26-29 with Table 1.9, printed pp.12-14 and 20; 2.4.7-10 with Table 2.7, printed pp.205-208; `src/dasha/jaiminiRashiDashas.js`, test `test-jaimini-rashi-dashas.js`), also on `/bphs-rashi-dashas`:
- Years: sign to its lord's sign, less one; forward for odd-footed signs, backward for the rest; own sign 12; lord exalted +1, debilitated -1; Scorpio/Aquarius co-lords by the second source of strength (Atmakaraka, Mercury, Jupiter and the sign's lord joining or aspecting; then planets in it; then dual > fixed > movable); equal, the larger period. Reproduces Table 1.9 for all twelve signs (Rajiv Gandhi chart). Differs from the BPHS Chara above in the co-lord rule and in applying exaltation to the lord, not the counted-to sign.
- Narayana: start at the stronger of lagna and 7th (the same ladder as Niryana Shoola), direction by the 9th sign from the start (odd-footed = forward); movable: in order, fixed: every sixth, dual: trines then the tenth. Reproduces all 144 cells of Table 2.7.
- Antardashas (twelve equal, from the lord's sign or the 7th, 2.4.13 / 1.1.29) are not shown yet. The choice of the stronger of lagna/7th for Narayana uses the first source of strength; Rath's note says the second source is used in Narayana, which is ambiguous for that choice.
