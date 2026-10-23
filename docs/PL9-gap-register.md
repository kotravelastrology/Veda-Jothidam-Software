# PL9 gap register — the second pass (2026-10-21)

Source: `PL9-Audit-Snapshot-2026-09-26.zip` (the owner's own audit of Parashara's Light 9: 979 screen captures, 433
catalogue rows, `option-inventory.csv`, export samples). Unzipped to a scratch folder; `catalogue.json` is what
`scripts/pl9-parity-audit.js` reads (`node scripts/pl9-parity-audit.js <dir containing pl9/catalogue.json>`).

The first pass (`PL9-parity-audit.md`, 2026-09-28) classified every row by pattern rules and has not been kept up to
date: the rules still say **ABSENT** for rows that were built since (solar returns, astronomy, gemstones, the
fabricated Ashtakoota). This register is the corrected list of what is really missing. Page screenshots are the
specification — each gap names its evidence ids (E###, `screenshots/###-*.png` in the snapshot).

## Corrections to the first pass

| Rows | First pass | Now |
|---|---|---|
| 061-085 Annual / Monthly / Daily Solar, Eight-year, Three-month, Three-day, Tithi Pravesh (25) | ABSENT | **built** — `/solar-returns` |
| Astronomy — Details, Sun … Saturn (8) | ABSENT | **built** — `/astronomy` |
| Gem Stone #1, #2, 138 Gem Recommendations | ABSENT | **partial** — `/gemstones` (three books side by side; no PL9-style single score, by design) |
| Compatibility — Ashtkoot Guna Matching | SUSPECT (fabricated) | **removed**; the real thing is *not built* (below) |
| 110 Kaksha Dasha Calendar | partial (Saturn) | **built for the seven planets** — `/kakshya-transit` |

## The real gaps, in the order they will be built

Each item is built the way the other pages are: own UI, own cited classical source read from the page, books side by
side where they differ, tests, docs. Where no classical source is held the row stays open — see "Blocked".

### 1. Compatibility (PL9: "Ashtkoot 22/36, Dash-Koota 27.5/44, Saptapadi 4/7"; E628, E640, E646)
- **Ashtkoot Guna chart** (E628): eight kutas — Varna 1, Vashya 2, Tara 3, Yoni 4, Graha Maitri 5, Gana 6, Bhakoot 7, Nadi 8
  = 36 — with each partner's value, marks gained, dosha flag and "area of life" (Work, Dominance, Destiny, Mentality,
  Friendliness, Temperament, Love, Health), and the Bhakoot / Nadi dosha notes. **Built 2026-10-21** as a section of `/porutham`
  from Shridhar's tables (`docs/ASHTAKOOTA.md`) — with one finding: his grand table 18.33 disagrees with his own eight tables
  in 30 of 54 sampled cells. Muhurta Chintamani's wording is not yet laid beside it.
- **Saptapadi** (E646): seven pairs of signs, 1 mark each (4/7 in the sample). *No source identified.* Blocked until a book
  names the rule.
- Dash-Koota table / compatibility (PL9 27.5/44) — `/porutham` has nine of the ten Kalaprakasika tables page-verified;
  the PL9 layout (per-factor table with "area of life") is the part missing.

### 2. Interpretation worksheets and reports (≈ 60 rows)
Planet in house 042-050, Bhavesh (house lord) 051-056, Interpreting Grahas 020, Nature & Temperament 039, Physical
Characteristics 040, Lucky Points 041, and the Reports / Interpretations set (General #1-2, Sun … Ketu, Bhavesh 1-12,
Nakshatra, Dasha, Transit, Life). Today only `answerEngine.js` (a Q&A corpus, a different shape). *Sources held:*
Phaladeepika (Sastri 1950, Kapoor), Jataka Parijata vols 2-3, Brihat Jataka (Chidambaram 1905), Mansagari vol. 2,
Muthuswami's Encyclopaedia, Raj Kumar's *Delineating a Horoscope*. Plan: one page, a chapter per planet-in-house /
lord-in-house, each book's statement with its page, none merged.

### 3. Charts and tables not yet built
010 Navamsha Ages · 009/012 Special and Alternate Lagnas (partial) · 017 Vimshopaka · 033 Declination · 111 Kota Chakra ·
112 Sanghatta Chakra · 098/099/093 Animated Transits · 102/103 Graphical Ephemeris · 104 Yearly Transit (South Indian) ·
116-123 Events (event charts and the event worksheets).

### 4. Varshaphala interpretation set
Consolidated #1-2, Chart Interpretations, Dasha Interpretations (the annual chart itself is built in `/varshaphala` and
`/solar-returns`).

### 5. Dashas
28 rare dashas (Chara, Sthira, Narayana, Shoola, Drig …) — *blocked on the BPHS pages*, not in the curated library.
Ashtottari and Yogini (15 rows) carry no source stamp; Tribhagi has a source but no worked example; 030/031 Nakshatra and
Rashi dashas have 5 of ~23 systems; Dasha Effects Browser 059 (text per period).

### 6. Classical text layer
1001 Yogas, Classics English — Houses and Planets / Yogas / Curses and Evils, and the six menu entries that name a book
with nothing behind them (BPHS Sanskrit, Saravali, Hora Sara, Garga Hora, Horoscope Interpretation, Lordship effects).
*BPHS, Saravali, Hora Sara and Garga Hora are not held.*

### 7. Remedies and health
Lucky Stone 139 (the one source read, Raj Kumar PDF 121-122, is Western), Health report (only longevity exists),
Sadhesati / Dhayya / Kantaka / Mangala "results" in PL9's own shape (the books' text is built).

### 8. Print and export
Print screen, Model Printing, Printer Setup, Print Model F7, default set Ctrl+F7 (PL9's 88-page set), Ephemeris / Panchang /
Krishnamurti / Transit-dasha prints, 1-5-level dashas, Compact lifetime, Copy screen, Birth export and Ephemeris export
(E683, E686: `birthdat`, `ephemeri`). VJ-019 already builds a verified PDF; no button calls it for these.

### 9. Preferences and settings
Fonts, Color Coding, Nature of Planets, Yoga, Panchang, System, Printing, Reset all options; Edit → native's current
location, astrologer's location and settings, cover-page text; Language English / Tamil; chart style (North / South
works).

### 10. Research and statistics
Statistics for ascendant, nakshatras, aspects, dignities, conjunctions, Shad Bala, houses (VJ-028 predicates exist; no
statistics output or graph); Export Ephemeris; Calculator.

### 11. Help, lessons, windows
Tutorial TOC and Vedic Astrology Tutorial, Vedic Deities, balloon help, About, Check for updates; Cascade / Tile windows;
Change Location Tool (F8) and Change Time Tool (F9) — the menu links 404 and were removed; Interpretation hints.

## Blocked — need a book or a decision, so not started

- The 28 rare dashas and the 8 unverified source locators: the BPHS pages.
- Saptapadi: no source for its rule.
- Reset all options / Deactivate: PL9 licence actions; not applicable to this product.
- Kala Sarpa effects (Mangala page "not yet"): only modern authors held; owner's decision on whether modern books count.

## What PL9 found about itself (do not copy)

The audit also recorded PL9's own faults, which we should not reproduce: Nakshatra statistics column headings overlap,
the preference "North" did not persist, a saved group came back empty, File Manager refresh made the window vanish
(E797, E915-E918, E948-E952).

2026-10-21: BPHS ch.46 nakshatra dashas (docs/BPHS-DASHAS.md) and Chara, Sthira, Yogardha, Mandooka (docs/BPHS-RASHI-DASHAS.md) built. Left: Kendradi, Trikona, Shoola, Dirga, Navamsha, Narayana, Drig, Padanadhamsa, Shastihayani.

2026-10-21 (later): group 5 (dashas) closed for now. Built: BPHS ch.46 nakshatra dashas, Chara/Sthira/Yogardha/Mandooka/Dirga/Lagnadi, Yogini sourced, Jaimini Niryana Shoola, Jaimini Chara, Narayana. Not built, with reasons: Padanadhamsa (needs the Jaimini navamsa chart and the Arudha lagna; years rule only in articles - Rangacharya, Y. Krishna Rao in "Jaimini dashas"), Jaimini Navamsha/Mandooka/Drig (commentators disagree on the start and order; Rath notes both views), Kendradi/Trikona/Shoola/Sandhya/Pachaka/Panchaswara (BPHS), Shastihayani (table cut off). Next in the register: group 2, the interpretation worksheets.

2026-10-21: group 2 started - planets in houses from Saravali ch.30 (docs/PLANET-HOUSE.md). Correction to group 6: Saravali (Santhanam vols 1-2, Bhagat), Hora Sara and Brihat Jataka (several editions) ARE held in D:\1\astro books english\3-CLASSICS_nadi, though not in the curated library. Next: more books for the same page, then lords of houses (bhavesh) and the nakshatra/dasha/transit interpretation sets.

2026-10-21: bhavesh (house-lord) readings from BPHS ch.24 added to the same page (docs/PLANET-HOUSE.md). Still open in group 2: nakshatra, dasha-period and transit interpretation sets, Characteristics 040, Lucky Points 041.

2026-10-23: group 3 started - Vimshopaka (017) built, `/vimshopaka`, docs/VIMSHOPAKA.md. Group 2 additions since 10-21: `/planet-house` now carries lagna sign, Moon sign, birth star, planet in house, dasha-lord effects (BPHS 47-48) and house lords, book by book (docs/PLANET-HOUSE.md).

2026-10-23: Declination (033) built - `/declination` (src/chart/declination.js, test-declination.js): the Sun-to-Saturn declination from the ephemeris in equatorial mode, the same Kranti the Ayana Bala reads; no result is claimed. PL9's Uranus, Neptune, Pluto, Rahu/Ketu rows and its KP lord/sub column are not built.
Not built, with the reason found: Kota Chakra (111) and Sanghatta Chakra (112) - the only held sources are modern articles (Imran, "Kota Chakra and Professional Setback"; Vishnu Bhaskar; JHora's help) and Narapati Jayacharya's chapter list, which names the chakra and gives no rule; no classical rule with a printed page was found. Navamsha Ages (010) - PL9 lists the 108 navamshas numbered round the zodiac against each planet; no source for "ages" found yet.
