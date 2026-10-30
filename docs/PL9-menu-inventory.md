# PL9 menu inventory vs this software

Source: the Parashara's Light 9 user guide installed with the program (`C:\GeoVision\PL9\Res1\Manual`, chapter 20 "Menu Reference",
with chapters 3, 5, 6, 8, 9, 14-18 for the detailed screens). Our side: `src/navigation/TopMenuBar.tsx`.

Status: **have** = present with the same meaning; **partial** = present under another name or only some of the options;
**missing** = not in this software.

## File
| PL9 item | Ours | Status |
|---|---|---|
| New | New Chart | have |
| Open | Open... | have |
| File Manager (groups, search, import old charts, refresh) | — | missing |
| Save / Save As | Save / Save As... | have |
| Save To (save into a group) | — | missing |
| Close | — | missing |
| Model Printing | — | missing |
| Print Screen | Print (File) | partial |
| Printer Setup | — | missing |
| Copy Screen to Clipboard | — | missing |
| Language | Options > Language | partial (moved) |
| Exit | Exit | have |
| (ours only) Recent Charts, Export submenu | Recent Charts, Export | extra |

## Edit
| PL9 item | Ours | Status |
|---|---|---|
| Birth Data | Birth Data | have |
| Anka Value | — | missing |
| Chart Notes | Chart Notes | have |
| Events | Events | have |
| Native's Current Location (varshaphala and today's events) | — | missing |
| Astrologer's Location (prashna) | — | missing |
| Astrologer Specific Settings (50 entries) | — | missing |
| Cover page text | — | missing |

## Charts (worksheets and the Chart & Table selection)
| PL9 item | Ours | Status |
|---|---|---|
| Worksheet and its Favorites (the Charts menu lists the favourites; a worksheet's fields are chosen per field) | fixed list | partial |
| Chart & Table selection: Tables column (Chart, Planetary info, Declination, House cusps, Lordships, Elements/strengths, Mrityu Bhaga, Varga deities, Shashtiamsha deities, Nadiamshas, Dashas, Yogas, …) | — | missing |
| Context column (17 chart contexts: birth, transit, Varshaphala, KP, Muhurta, Prashna, …) | — | missing |
| Special charts (Composite, Sudarshan, Rashi with Navamsha, Bhava, Hora, Karkamsha, …) | Sudarshan Chakra, Composite/Synastry | partial |
| Vargas (all 16 and the rest) | Divisional Charts, Varga Chakra, Navamsha (D9) | partial |
| Ashtakavarga Samudaya | Ashtakavarga Charts | have |
| Sudarshana Chakra | Sudarshan Chakra | have |
| Transits | Transit Charts | have |
| Event List | Events | partial |
| Calendar (dashas in calendar format) | — | missing |
| Graphical Ephemeris | Graphical Ephemeris (Reports) | have (moved) |
| Muhurta | Muhurta Finder (Tools) | partial (moved) |
| Compatibility - Composite | Composite/Synastry | have |
| Rectification | Rectification | have |
| Dasha Effects | — | missing |

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

## Count (missing or partial items above, not counting extras)
Missing: 35. Partial: 24. Have: 38. Extra or not applicable: 5 (counted from the tables above by script).

## Work order (proposal, not started)
1. Options (13 groups): each group is a real setting that the calculations read. Missing settings change results, so they come first.
   Dasha Options (balance method, dasha year) and Miscellaneous Calculations (Ayanamsha and the rest) affect page 20 and the
   Ashtakavarga and Shadbala pages.
2. File and Edit gaps (File Manager, Save To, Anka Value, locations, astrologer settings, cover page).
3. Reports: Remedies group, Astrology Lessons, Reports Overview.
4. Charts: the Chart & Table selection (tables, contexts, special charts, vargas) and the worksheet favourites.
5. Tools, Print (User defined printouts, Print Default Set), Research, Windows, Help.
