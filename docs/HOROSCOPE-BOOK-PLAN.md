# Horoscope book: plan (modelled on PL9's 88-page print, aniruddha_HC4.pdf)

Goal: a modern, attractive horoscope book in the same model as PL9's default print set, with every
detail the sample prints. Tamil-first labels, the classical terms kept (as PL9 keeps them), A4, one
section per page group, with a cover. Output: the existing report pipeline (ReportDocument -> printable
HTML -> PDF, see VJ-019), so the book prints from the app.

## Sections, in the sample's order (88 pages)

| Pages | Section | Our status (to verify when built) |
|---|---|---|
| 1 | Birth Particulars, Hindu Calendar, Family Particulars, Avakhada Chakra, Tamil Calendar | Built as data (src/report/horoscopeBook/page1.js, test-horoscope-book-page1.js). Not built: Kartikadi year, Bhayat, Bhabhog, Varga, Yunja, Hansak, Naamakshar, Paya (no source identified). Differs from sample: sunrise (05:58 vs 06:01:42), dasha balance (7y 8m 20d vs 7y 7m 11d), Lahiri (13″), season (solar month, sample uses lunar month) |
| 2 | Birth Chart (chart diagram, planet table: sign, degree, speed, nakshatra, pada, RL, NL, SL, SS, status, shadbala) | Built as data (src/report/horoscopeBook/page2.js, test-horoscope-book-page2.js): three sign grids (Birth Chart, Moon, Navamsha) and the planet table; the table matches the sample on sign, nakshatra, pada, the four lords and status. Not built: shadbala total (engine refuses it). Gulika now follows BPHS ch.3 (Leo 2°36′, sample Leo 3:02). Differs from sample: seconds on Moon speed, Rahu and Ketu (13–19 s). Print: signGrid block in app/print/PrintView.tsx, not yet wired to a print kind |
| 3 | Chandra, Navamsha and Bhava charts | Built as data (src/report/horoscopeBook/charts.js, test-horoscope-book-charts.js): Moon and Navamsha grids, Sripati Bhava grid, Bhava Spashta table. Matches the sample to within 13 seconds (lagna) and Gulika (Leo 2°36′ by BPHS ch.3, sample Leo 3:02) |
| 4 | Sudarshan Chakra | Renderer exists (SudarshanaChakraRenderer) |
| 5-6 | Divisional Charts #1, #2 | Built as data (charts.js): all sixteen grids, in the sample's order. Match the sample on Gulika in 14 of 16 grids (not yet on Akshavedamsha and Kvedamsha); Hora (D2) placed by lord (Sun to Leo, Moon to Cancer) |
| 7 | Sub-Planets (Upagrahas, Gulikaadi group) | To check |
| 8 | Birth Charts (birth chart per division / summary) | To check |
| 9 | Planetary Friendship (Naisargik Maitri Chakra, Tatkalika) | Built as data (src/report/horoscopeBook/planetPages.js, test-horoscope-book-planets.js): natural, temporal and Panchadha lists of the seven classical planets. Rahu and Ketu not built (no sourced relation) |
| 10 | Shodashvarga Summary | Built as data (planetPages.js): signs of the Ascendant and planets in the sixteen vargas, dignities, Vimshopaka. Matches the sample on Lagna, Sun and Moon signs and the Janma, Dreshkana, Chaturthamsha and Saptamsha dignities. Not built: nodes' dignity and Vimshopaka; the Dispositors table is not built yet. Saptavarga differs from the sample for Moon, Mars and Saturn |
| 11, 12, 13 | Shad Bala, Aspects, Avasthas | Not built. Shad Bala total refused by the engine; the aspect page's strength fractions and brackets are not identified; the avasthas engine names differ from PL9 (Shayanadi and Deeptadi states, Lajjitadi a disclosed synthesis) |
| 11 | Shad Bala and Bhava Bala | Shadbala six parts exist; total refused (see register) |
| 12 | Aspects on Planets and Bhavas | Aspect matrix exists |
| 13 | Planetary Avasthas | Exists (avasthas engine) |
| 14-15 | Ashtakavarga Bhinnashtaka #1, #2 | Exists |
| 16 | Sarvashtaka and Chancha Chakra | Chancha chakra built; Sarvashtaka to check |
| 17 | Ashtakavarga Reductions (Trikona, Ekadhipatya) | To check |
| 18 | Divisional charts, Ashtakavarga | To check |
| 19 | Health (influence of grahas on physiology) | BPHS health built |
| 20-29 | Vimshottari MD/AD and detailed AD/PD (9 pages) | Built (dasha timeline) |
| 30-32 | Vimshottari PD and Sookshma (3 pages) | To check |
| 33-37 | Ashtottari MD/AD and short AD/PD (5 pages) | Ashtottari to check |
| 38-40 | Yogini Dasha, three cycles | Yogini sourced (dasha work) |
| 41-46 | Kala Chakra Dasha MD/AD and AD/PD (6 pages) | Built |
| 47-49 | Jaimini System, Chara Dasha (2 pages) | Built |
| 50-61 | Sthira, Niryaana Shoola, Drig, Navamsha, Narayana, Lagna Kendradi Rashi, Shoola (12 pages) | Built (BPHS rashi dashas) |
| 62-66 | Tribhagi, Tribhagi 40 (5 pages) | Tribhagi sourced without worked example (see dasha register) |
| 67-78 | Shodashottari, Dwadashottari, Dwisaptatisama, Shastihayani, Shattrimshatsama, Panchottari, Satabdika, Chaturshitisama (12 pages) | Rare dashas: BPHS pages not in library (register group 5) |
| 79-80 | Sadhesati of Saturn, Laghu Kalyani Dhayya and Kantaka | Built (Saturn transit) |
| 81-82 | Krishnamurti Paddhati: Chart and Significators | Built (KP chart, house significators) |
| 83-88 | Varshaphala Charts, six years (1, 13, 25, 37, 49, 61) | Built (Varshaphala) |

## Build order (one unit at a time, each committed and checked against the sample page)

1. Cover, Birth Particulars, Hindu Calendar, Avakhada Chakra (page 1)
2. Birth Chart page and the planet table (page 2)
3. Chart pages: Chandra, Navamsha, Bhava, Sudarshan, Divisional (pages 3-8)
4. Friendship, Shodashvarga, Shad Bala, Aspects, Avasthas (pages 9-13)
5. Ashtakavarga pages (14-18)
6. Health, then dasha pages (19-78), grouped by family
7. Sadhesati, KP, Varshaphala (79-88)

## Open decisions for the owner

- Colour and type: a modern palette with a Tamil display face; the sample's red headings are PL9's own style.
- Keep the PL9 page titles in English as well as Tamil, so the book is checkable against PL9.
- Personal data: the sample is one real chart. The book is generated only from the chart the user opens.
