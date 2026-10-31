# PL9 menu inventory vs this software

Source: the Parashara's Light 9 user guide installed with the program (`C:\GeoVision\PL9\Res1\Manual`, chapter 20 "Menu Reference",
with chapters 3, 5, 6, 8, 9, 14-18 for the detailed screens). Our side: `src/navigation/TopMenuBar.tsx`.

Status: **have** = present with the same meaning; **partial** = present under another name or only some of the options;
**missing** = not in this software.

## File
Built 2026-10-31 from `src/navigation/pl9Menus.js`: every PL9 entry is in our menu, in PL9's order (test-pl9-menus.js).
| PL9 item | Ours | Status |
|---|---|---|
| New | New | have |
| Open | Open... | have |
| File Manager (groups, search, import old charts, refresh) | File Manager... opens the chart dialog; no groups, import or refresh | partial |
| Save / Save As | Save / Save As... | have |
| Save To (save into a group) | Save To (listed; the library has no groups, so it says so) | missing |
| Close | Close (forgets the working chart, empty report page) | have |
| Model Printing | Model Printing opens the Print Center | partial |
| Print Screen | Print screen... | partial |
| Printer Setup | Printer Setup says the printer is chosen in the browser's print dialog | partial |
| Copy Screen to Clipboard | Copy screen to Clipboard (listed; not built) | missing |
| Language | Language opens Settings | partial |
| Exit | Exit | have |
| (ours only) Recent Charts, Export submenu | Recent Charts, Export | extra |

## Edit
Built 2026-10-31: all eight PL9 entries are in the menu. Those not built are listed, in italics, and say why when clicked.
| PL9 item | Ours | Status |
|---|---|---|
| Birth Data | Birth data | have |
| Anka Value | listed; needs a cited Anka sound table | missing |
| Chart Notes | Chart Notes | have |
| Events | Events | have |
| Native's Current Location (varshaphala and today's events) | listed; not built | missing |
| Astrologer's Location (prashna) | listed; not built | missing |
| Astrologer Specific Settings (50 entries) | listed; not built | missing |
| Cover page text | listed; not built | missing |
| (ours only) Preferences | Preferences opens Settings | extra |

## Charts (the 29 entries of the PL9 Charts menu)
Built 2026-10-31: all 29 entries are in our Charts menu, in PL9's order, from the PL9 menu screenshot. Two new pages
(Lordships, Calendar); the rest go to the nearest existing page or report section. Pending ones are listed in italics.
| # | PL9 item | Ours | Status |
|---|---|---|---|
| 1 | Birth chart I | /report?chart=D1-rasi | have |
| 2 | Vargas I | /divisional-charts | have |
| 3 | Sudarshan Chakra | /report?chart=sudarshan-chakra | have |
| 4 | Lordships | /lordships (new: D1, D9, D10 with exchange marks) | have |
| 5 | Interpreting Grahas | /interpreting-grahas | have |
| 6 | Planetary deities | listed; the guide does not describe it and no cited source yet | missing |
| 7 | Aspects on planets | /report?chart=aspect-matrix | have |
| 8 | Dashas - Nakshatra based | /report?chart=dasha-vimsottari | have |
| 9 | Calendar | /dasha-calendar (new: 8 of 10 dasha starts in the PL9 sample on PL9's day, two a day later; see the gap register) | have |
| 10 | Navamsha ages | /navamsha-years | have |
| 11 | Animated transits I | /animated-transits | have |
| 12 | Animated Transits - Partner | listed; needs the partner's chart beside the transit chart (guide ch.13) | missing |
| 13 | Graphical Ephemeris | /graphical-ephemeris | have |
| 14 | Ashtakavarga - Samudaya | /report?chart=ashtakavarga | have |
| 15 | Events 1-10 | /events (all 20 slots on one page, not split) | partial |
| 16 | Events 11-20 | /events (same page) | partial |
| 17 | Muhurta | /muhurta | have |
| 18 | Varshaphala I | /varshaphala | have |
| 19 | Compatibility - Composite | /report?chart=compatibility | have |
| 20 | Dasha Effects Browser | listed; the rules exist (src/report/dashaEffects.js), no page | missing |
| 21 | Dasha and Transit timelines | /dasha-timeline | have |
| 22 | Sun in house | listed; the guide does not describe it | missing |
| 23 | Rectification | /rectification | have |
| 24 | Chart tutor | /learning-resources (the guide says Interpretation hints replaced the tutor; those are not built) | partial |
| 25 | Tithi Pravesh | listed; the guide names it but does not define it | missing |
| 26 | Graphical ephemeris - 3 month overview | /graphical-ephemeris (month and years only, no 3-month view) | partial |
| 27 | Yearly transit overview (South Indian) | /yearly-transit | have |
| 28 | Sarvatobhadra Chakra | /report?section=sarvatobhadra | have |
| 29 | Interpretations (flyout: Lagna, Rashi, Nakshatra, Planets in houses, Transits) | report sections and /planet-house | partial |

The worksheet system behind the menu (not the 29 entries):
| PL9 item | Ours | Status |
|---|---|---|
| Worksheet and its Favorites (the Charts menu lists the favourites; a worksheet's fields are chosen per field) | fixed list of 29 entries, each its own page | partial |
| Chart & Table selection: Tables column (Chart, Planetary info, Declination, House cusps, Lordships, Elements/strengths, Mrityu Bhaga, Varga deities, Shashtiamsha deities, Nadiamshas, Dashas, Yogas, …) | — | missing |
| Context column (17 chart contexts: birth, transit, Varshaphala, KP, Muhurta, Prashna, …) | — | missing |

## Reports (10 groups)
| PL9 item | Ours | Status |
|---|---|---|
| Horoscope | Horoscope | have |
| Calculations | Calculations | have |
| Interpretations | Interpretations | have |
| Dashas (individual dashas, each printable) | Dashas, BPHS Dashas, BPHS Rashi Dashas | have |
| Varshaphala | Varshaphala | have |
| Compatibility | Compatibility | have |
| Astronomy | Astronomy | have |
| Remedies (Sadhesati and Kantaka, Mangala Dosha, gem recommendation) | Saturn Transit, Mangala Dosha, Gemstones (separate) | partial |
| Astrology Lessons (interactive tutorial, deities, dictionary) | — | missing |
| Reports Overview | — | missing |

## Interpretations (a menu of its own in the guide, `con-menubar`)
| PL9 item | Ours | Status |
|---|---|---|
| Interpretations (Lagna, Rashi, Nakshatra, planets in houses, transits) | Interpretations (Reports) | partial |

## Classical References
| PL9 item | Ours | Status |
|---|---|---|
| Brihat Parashara Hora Shastra and other classical texts (text viewer) | BPHS | partial |
| 1001 Yogas (search applicable yogas in the chart) | Yogas Dictionary | partial |
| Horoscope Interpretation (own and compiled texts) | — | missing |
| Planetary Significations (Karakas), Ascendant effects, Signs, Houses, Nakshatra descriptions, Drekkana, Lordship effects | Planetary Significations, Nakshatra Descriptions | partial |
| (ours only) Saravali, Hora Sara, Garga Hora, Planets in Houses | those four | extra |

## Options (13 groups, one tabbed dialog in PL9)
| PL9 item | Ours | Status |
|---|---|---|
| Chart Style | Chart Style | have |
| Display Options (worksheet background, graphics, varga names, varga headers, cursor, Varshaphala headers) | — | missing |
| Fonts (planet, sign, house number, screen, print, Roman, system) | Colors & Fonts | partial |
| Color Coding (planet colours, screen and print) | Colors & Fonts | partial |
| Nature of Planets (natural and per-ascendant benefic/malefic) | — | missing |
| Calculation Options (Ayanamsha, ayanamsha offset) | Settings | partial |
| Miscellaneous Calculations (Paksha bala, Dig bala, Drig bala, Ekadhipatya, Varshaphala, Rashi multiplier for Virgo, Gulika method, Muhurta dates, Chara dasha, Drekkana bala, Ashtakavarga table choice, sunrise, Karakas with or without Rahu, Rahu and Ketu true or mean) | — | missing |
| Printing Options (margins, colour or black and white, bitmap graphics, research output) | — | missing |
| Dasha Options (dasha year 360/365.25/327.85, month name or number, balance by degree or by time, dasha change date or time, Kalachakra 9/12, Chara method, Varshaphala dasha method, Rahu's exaltation, Mercury's exaltation, Rashi antardasha start) | Settings: Dasha Year and Dasha Balance Method (used by the print centre's dashas, compact and transit reports, and the horoscope book's page 20; the other dasha screens still use 365.25 and by degree) | partial (2 of 13 settings) |
| Yoga Options (all, positive, or positive interpretations only) | — | missing |
| Panchang Options (columns, lagna rising table, Indian calendar, chart style, seconds) | Panchang print only | partial |
| System Options (Indian date entry, astrologer's footer, ascendant at 9 or 12 o'clock, paths, date format, transit cache) | Settings | partial |
| Screen Size (screen and toolbar options) | — | missing |
| (in Options, no number in the guide) Accounting (report log by astrologer, model or language) | — | missing |
| (in Options) Reset all options settings | — | missing |

## Tools (10 entries)
| PL9 item | Ours | Status |
|---|---|---|
| Change Location Tool (ascendant for any place on the map) | Location Finder | partial |
| Change Time Tool | Time Zone Converter | partial |
| Change Time Toolbar (docked at the bottom) | — | missing |
| General Notes | — | missing |
| Chart Notes | Chart Notes (Edit) | partial (moved) |
| Worksheet Notes | — | missing |
| Yogas (side panel) | Yogas Dictionary | partial |
| Interpretation hints (click on an item for its meaning) | — | missing |
| Chart Navigator (Parashara's Light 10 only in the guide) | — | not applicable |
| Rectification Tool | Rectification Tool | have |
| (ours only) Ayanamsha Calculator, Date Converter, Muhurta Star, Nakshatras and Deeds, Transit Finder, Jamakkol, Nalla Neram, Tamil Calendar, Baby Names, Classical Muhurta, KP Muhurta Time Scan | those | extra |

## Print (8 entries)
| PL9 item | Ours | Status |
|---|---|---|
| User defined Printouts (design tool) | — | missing |
| Print Model (a set of pages at once) | Print Center; Horoscope book (new) | partial |
| Print Default Set | — | missing |
| Dashas, 1-5 levels and Compact (lifetime) | Dashas 1-5 levels, Compact lifetime | have |
| Ephemeris | Ephemeris | have |
| Panchang | Panchang | have |
| Krishnamurti | Krishnamurti (KP) | have |
| Transit / Dasha Report | Transit / dasha report | have |

## Research (6 entries)
| PL9 item | Ours | Status |
|---|---|---|
| Search for Charts (by condition) | Search for Charts | have |
| Statistics on Groups of Charts | Statistics on group of charts | have |
| Export Ephemeris | Export Ephemeris (CSV) | have |
| Export Birth Chart | Export Birth Chart | have |
| Time of Transit | Time of transits | have |
| Calculator | Calculator | have |

## Windows (4 entries)
| PL9 item | Ours | Status |
|---|---|---|
| Tile | Tile Horizontally, Tile Vertically | partial |
| Cascade | Cascade | have |
| Tile horizontally | Tile Horizontally | have |
| Listed Charts (switch between open charts) | — | missing |

## Help (5 entries)
| PL9 item | Ours | Status |
|---|---|---|
| On line Manual | Help Contents | partial |
| Use Balloon Help | Balloon Help | have |
| About | About | have |
| Worksheet Help | — | missing |
| Vedic Astrology Tutorial | Vedic Astrology Tutorial | have |
| (ours only) Keyboard Shortcuts, Check for Updates, Deactivate, Contact Support | those | extra |

## Count (rows of the tables above by status, counted by script, 2026-10-31)
Have: 52. Partial: 29. Missing: 33. Extra: 5. Not applicable: 1. (Before the File, Edit and Charts menus were rebuilt on
2026-10-31: have 38, partial 24, missing 35.)

## Work order (proposal)
1. Options (13 groups): each group is a real setting that the calculations read. Missing settings change results, so they come first.
   Dasha Options (balance method, dasha year) and Miscellaneous Calculations (Ayanamsha and the rest) affect page 20 and the
   Ashtakavarga and Shadbala pages. Dasha Options: 2 of 13 done.
2. File and Edit gaps still missing: Save To (needs groups in the library), Copy Screen to Clipboard, Anka Value, Native's and
   Astrologer's locations, Astrologer Specific Settings, Cover page text. All are in the menu now and say why they are not built.
3. Charts menu: 29 of 29 entries are in the menu; 5 are not built (Planetary deities, Animated Transits - Partner, Dasha Effects
   Browser, Sun in house, Tithi Pravesh) and 5 are partial. Next: Dasha Effects Browser (rules exist), Animated Transits - Partner
   (needs the second chart), the Events 1-10 / 11-20 split, the 3-month ephemeris view. Planetary deities, Sun in house and Tithi
   Pravesh need the PL9 screen or a cited definition first.
4. Reports: Remedies group, Astrology Lessons, Reports Overview.
5. Charts: the Chart & Table selection (tables, contexts, special charts, vargas) and the worksheet favourites (the worksheet system
   behind these 29 entries).
6. Tools, Print (User defined printouts, Print Default Set), Research, Windows, Help.
