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

2026-10-23 (later): Kota Chakra (111) and Sanghatta Chakra (112) built from Narapati's Svarodaya (Chaukhamba 1971, now in the corpus as C47/C47b/C48, with the owner's approval) - `/kota-chakra`, docs/KOTA-SANGHATTA.md. Navamsha Ages (010) built as `/navamsha-years` from Prasna Marga and Hora Sara via Patel; PL9's numbers reproduced. The earlier note above that Kota/Sanghatta had no classical source is superseded.

- 2026-10-23: Special Lagnas (009) / Alternate Lagnas (012) built from BPHS ch.5 (`/special-lagnas`, docs/SPECIAL-LAGNAS.md); Bhava/Hora/Ghatika/Varnada reproduce PL9's screen with the geometric sunrise. Moon/Sun charts, Sripati bhava, KP chart still open.

- 2026-10-23: Sripati bhava built from Sripatipaddhati I.6-11 (`/sripati-bhava`); Sun/Moon lagnas added to `/special-lagnas` from BPHS ch.7 vv.39-43; the KP chart (kpSystem.js) now checked against KP Reader III (test-kp-source.js, registry entries). Open decision: the app's other pages take the Porphyry points as house beginnings, Sripati as house middles (docs/SRIPATI-BHAVA.md). KP Readers I and II (cuspal sub lords) not in the corpus.

- 2026-10-23: KP house significators (levels 1-4 and the golden rule) from Astro Secrets Part 2 pp.148-149, 237-238 (`src/report/kpHouseSignificators.js`); not yet shown on a page; conjunction/aspect and horary levels not computed.

- 2026-10-26: KP Reader IV (C32) rules built as `src/report/kpMarriage.js` + report section (docs/KP-MARRIAGE-ENGINE.md); Porutham C32 second source (docs/PORUTHAM-C32-COMPARISON.md). Partner-description tables, conjunction/aspect conditions and child's sex not built.

- 2026-10-26: Graphical Ephemeris (102/103) built - `/graphical-ephemeris` (docs/GRAPHICAL-EPHEMERIS.md). Animated Transits (093, 098, 099), Yearly Transit South Indian (104) and Events (116-123) still open.

- 2026-10-26: Yearly Transit (South Indian) 104 built - `/yearly-transit` (docs/YEARLY-TRANSIT.md), reproducing PL9's 2026 screen entry for entry. Animated Transits (093, 098, 099) and Events (116-123) still open.

- 2026-10-26: Events 116-123 built as `/events` (docs/EVENT-CHARTS.md): event chart, Kakshas over the birth Ashtakavarga, gochara facts, running dashas, Vimshopaka; matches PL9's screens except the Vimshottari fifth level and Sthira (lagna). Event saving, Shatabdika/Kalachakra rows and the Varshaphala event view still open.

- 2026-10-26: Animated Transits (093, 098, 099) built - `/animated-transits` (docs/ANIMATED-TRANSITS.md). Group 3 of this register (charts and tables) is now complete except the Varshaphala event views (121-123).

- 2026-10-26: Varshaphala interpretations started (group 4) - Muntha, Munthesha and year-lord verses of Tajika Bhushana ch.2-3 on `/varshaphala` (docs/VARSHAPHALA-INTERPRETATION.md). Still open: the annual-chart bhava results (printed 32 on), Mudda dasha results, Varshaphala event views 121-123, and the Varshapati selection of ch.1.

- 2026-10-26: Varshaphala chart interpretation: the planet-in-bhava verses of Tajika Bhushana ch.5 (eight planets x twelve bhavas, printed 45-63) added to `/varshaphala`. Still open: Mudda dasha results (printed 71-89), sahams, yogas and arishta (64-68), monthly entry (90-93), and Varshaphala event views 121-123.

- 2026-10-26: Varshaphala dasha interpretations: the Mudda dasha results of Tajika Bhushana ch.8-9 (graded results per dasha lord, lagna dasha by drekkana, 42 antardasha results; printed 73-90) added to `/varshaphala`. Still open: arishta and yogas (printed 64-68), sahams (68-71), the monthly entry (90-93), and Varshaphala event views 121-123.

- 2026-10-26: Varshaphala arishta, arishta-bhanga, raja-yoga and raja-bhanga conditions of Tajika Bhushana (printed 64-68) added to `/varshaphala` (src/report/varshaYogas.js). Still open: sahams (68-71), the monthly entry (90-93), Rahu's results in Saturn's dasha (v.99), and Varshaphala event views 121-123.

- 2026-10-26: Tajika Bhushana's sahams (printed 68-71) added to `/varshaphala` beside the app's table (src/report/varshaSahams.js); on the sample chart 3 agree, 3 differ by the 30-degree correction only, 11 differ in formula and 2 have no counterpart. Still open: the monthly entry (90-93), the mixed chapter (71-73), Varshaphala event views 121-123.

- 2026-10-26: Monthly entries (masa-pravesha) of Tajika Bhushana's last chapter (printed 90-96) added to `/varshaphala` (src/report/masaPravesha.js). Tajika Bhushana is now read except the mixed chapter (71-73). Still open: Varshaphala event views 121-123 and the Varshapati selection of ch.1.

- 2026-10-26: The Varshapati is now selected as Tajika Bhushana ch.1 v.34-37 does (src/report/varsheshaBook.js); the older selection is kept beside it. The book's Pancha-Vargeeya table (hadda, mushallaha) is not transcribed, so the app's strength figure is used. Still open: the mixed chapter (71-73), Varshaphala event views 121-123.
- 2026-10-26: Event page resolved: Vimshottari fifth level (PL9 overview is date-only; its event panel agrees) and Sthira (Rath's Brahma reproduces PL9's Capricorn, shown beside BPHS-Santhanam). Varshaphala event view 121-123 built: the year's solar-return chart for birth place and event place on `/events`, matching PL9.
- 2026-10-26: Event page five-level dashas: Yogini and Ashtottari equal PL9's strings at all five levels; Narayana and the Rath Sthira use Rath 2.4.31-34 (main period equals PL9; lower levels differ, PL9's order unsourced). Rath's printed Sthira example runs zodiacally, so a third Sthira row follows it (Virgo for the audit chart); only the BPHS-direction row equals PL9.
- 2026-10-26: Event saving built: saved_events table (library schema v8), save/list/edit/delete on /events, included in backups (test-saved-events.js). Still open there: PL9's event calendar view and sort options, Shatabdika/Kalachakra rows.
- 2026-10-26: Pancha-Vargeeya bala as Tajika Bhushana gives it (ch.1 v.20-33, printed 5-9) built as src/report/panchaVargeeyaBook.js: hadda from the table and verses (verse number-words settle three cells that do not total 30; Virgo differs from the Egyptian terms), Tajika drekkana, the three-lords mushallaha table (degrees assumed 10 each), 30/20/15/10/5 with friend 3/4, neutral 1/2, enemy 1/4. Now the default strength for the Varshapati (4 of 60 years differ on the audit chart) and the monthly entry; the older figure stays as strengthMethod APP.
- 2026-10-26: Event calendar entry and sorting built: PL9's Indian Calendar box (Vikram Samvat, month, tithi, vriddhi, ghatis) as civil date on /events (src/panchangam/indianCalendar.js, Sewell Indian Chronography 63-76, 97), sort by date, Indian date on each event; adhika months 2001-2026 verified. Kartikadi/Ashadhadi years and PL9's Krishnadi 1/2 not built.
- 2026-10-26: Event page now shows Shatabdika (five levels, condition reported) and Kalachakra (maha, bhukti) at the event; PL9 gives no value for them to compare.
- 2026-10-26: Tajika Bhushana mixed chapter (mishrakadhyaya, printed 71-73, 12 verses) read from the page images and added to /varshaphala as 16 conditions (src/report/varshaYogas.js group mishraka); the book is now read in full.
- 2026-10-26: KP Reader IV partner-description tables (printed 86-97: 7 planets x 12 signs = 84 paragraphs, English as printed with a Tamil rendering) built as src/report/kpPartnerDescription.js + kpPartnerTables.js and shown in the KP marriage report section (test-kp-partner.js). Conjunction/aspect conditions and the child's sex still not built.
- 2026-10-26: Health (group 7) built as /health from BPHS (src/report/healthBphs.js, docs/HEALTH-BPHS.md): dhatus (ch.3 v.31), limbs by the sthoola (ch.4) and sookshma (first-house chapter v.12-15, three diagrams checked) schemes from the ascendant and the Moon, and the Sixth House chapter v.9-28 (diseases, timing of illness, unfortunate years) as 16 conditions. PL9's Lucky Stone (139) and Gem Stone #1/#2 rows are the Jeevan/Karaka/Bhagya gems and the wearing notes already on /gemstones (Tilak Raj printed 20-21); PL9's own wording and its Mani Mala source are not held.
- 2026-10-26: Print and export group built: /print (src/report/printSets.js, docs/PRINT-CENTER.md) with a Print menu: ephemeris and panchang of a month, KP chart, dashas 1-5 levels, compact lifetime, transit/dasha report, birth-data file and ephemeris CSV; the ephemeris equals PL9's file row to a second of arc at the same instant. Print Model F7 / default 88-page set, User Defined Printouts and the Printing preferences are not built.
- 2026-10-26: KP books added to the corpus (C64-C70: Reader I, II, second scans of III, V, VI, KP-Ezine, Astro Secrets IV) and registered; KP horary built as /kp-horary (src/report/kpHorary.js, docs/KP-HORARY.md): number 1-249 table verified against the book, ascendant at the start of the sub, cusps for the place, ruling planets, and 17 questions with the houses the book names.
- 2026-10-26: KP Reader V (transit) built as /kp-transit (src/report/kpTransit.js, docs/KP-TRANSIT.md): star ready reckoner, transit reading (matter, source, outcome), sensitive points of the running dasa-bhukti-anthra (every worked group of the book reproduced) with the instants the Sun, Moon and ascendant reach them. Lucky-timing sections and the ruling-planet ascendant working not built.
- 2026-10-26: KP horary questions extended from 17 to 74 with the houses the book names and 27 questions with its stated sub-lord conditions (src/report/kpHoraryMore.js); derived-house questions and the ruling-planet examples are left.
- 2026-10-27: KP Reader VI printed pp.107-121 built (src/report/kpJudgeTables.js, kpJudge.js, test-kp-judge.js): sign classes, appearance/character/health/finance/romance paragraphs by the sign of the sub-lord's star lord, and the twelve houses' significations; shown in the KP report section. Left from Reader VI: ruling-planet examples pp.123-142, planet strength/retrograde pp.144-153.
- 2026-10-27: KP Reader VI ruling-planet timing (pp.123-130): the zodiac positions ruled by the ruling planets and when the ascendant reaches them (src/report/kpRulingTime.js, shown on /kp-horary); two worked examples reproduced (messenger 4 P.M.; trunk call about a minute earlier than the printed 9:41). Left: derived-house questions of pp.130-142, planet strength pp.144-153.
- 2026-10-27: KP ruling planets for the Moon/Sun/Jupiter and for the birth time (pp.131-143): /kp-ruling (kpRulingTime.js); 1919 and 1948 birth examples reproduced; the drugs example differs (book's Moon 3 degrees behind ours). Left from Reader VI: planet strength/retrograde pp.144-153.
- 2026-10-27: KP Reader VI pp.144-153 built (src/report/kpStrength.js): retrograde-star rules for marriage/divorce/imprisonment/victory and the 12 eclipsed-star paragraphs; no orb in the book, so only the distance from the Sun is shown. Reader VI is now done except pp.154-157 (length of life, not built).
- 2026-10-27: KP Reader V lucky timings (pp.219-234) built as /kp-lucky-time (kpLuckyTime.js): 25 matters, periods + Moon windows + ascendant windows from the planets signifying the houses to take and not those to avoid. Left from Reader V: cards/horse-racing worked examples pp.195-218, star/sub significance per lagna pp.40-110.
- 2026-10-27: KP Reader V per-lagna star significance (pp.40-110): derived from ownership, checked against all twelve lagnas of the book (kpLagnaStars.js, shown on /kp-transit). Reader V is done except the cards/horse-racing worked examples.
- 2026-10-27: Reader II pp.97-116 (the thirteen sign groups) built: src/report/readerIISigns.js + readerIISignTables.js, shown per cusp in the KP report; checked against every list the book prints. Next: pp.117-271, the per-sign meanings (physical, mental, health, finance, profession, places, direction, products, lucky day/number/stone); then the twelve houses (pp.272-344) and the planets (pp.345-488).
- 2026-10-27: Reader II Aries (pp.117-124) built as readerIISignDescriptions.js: sixteen topics with printed pages, English as printed plus Tamil summary; the other eleven signs, houses and planets to follow.
- 2026-10-27: Reader II Taurus (pp.124-138) added to readerIISignDescriptions.js: twenty topics with printed pages; Taurus has its own topic set (weakness, disease, children, colour, cities, animate objects, correction) and is split by its own start heading.
- 2026-10-27: Reader II Gemini (pp.138-150) added to readerIISignDescriptions.js: eighteen topics with printed pages; the "Places indicated by Gemini" label and the "Hand-writing" label (printed that way) are now matched; pinned by test-reader-ii-sign-descriptions-gemini.js.
- 2026-10-27: Reader II Cancer (pp.151-163) added to readerIISignDescriptions.js: eighteen topics with printed pages; the splitter now clips the Gemini end at the Cancer heading and the Cancer end at the Leo heading, matches "Finance and profession", "Countries indicated", "Towns and Cities" and "Lucky Gems", and strips trailing bullets; Gemini's correction paragraph (p.151) is now kept; pinned by test-reader-ii-sign-descriptions-cancer.js.
- 2026-10-27: Reader II Leo (pp.163-178) added to readerIISignDescriptions.js: seventeen topics with printed pages; the "Weakness to be corrected" paragraph is its own topic; the "Places governed by Leo" and "Countries, Cities and Towns indicated by Leo" labels are matched; the label-page search now ignores line breaks; pinned by test-reader-ii-sign-descriptions-leo.js.
- 2026-10-27: Reader II Virgo (pp.178-194) added to readerIISignDescriptions.js: thirteen topics with printed pages; Virgo's labels are matched on the printed text, and its "Characteristics to be corrected" paragraph is its own topic; the same paragraph in Cancer is now split out too (its second copy inside the animate objects stays there); pinned by test-reader-ii-sign-descriptions-virgo.js.
