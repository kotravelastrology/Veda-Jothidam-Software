/**
 * PL9 catalogue vs Veda Jothidam — row-by-row.
 *
 * Verdicts:
 *  BUILT     implemented and reachable from a route
 *  PARTIAL   some of it exists (calculation without its report layout, or one
 *            variant where PL9 offers many)
 *  MENU_ONLY named in the UI with nothing behind it
 *  SUSPECT   present but known to be wrong
 *  ABSENT    nothing
 *
 * Presence is not correctness. BUILT means the code exists and a route reaches
 * it; it does not mean the calculation has a verified source. VJ-026 found 8
 * unverified locators and VJ-027 found only 1 of 22 dasha methods fully
 * verified, so a separate column tracks that.
 */
const fs = require('node:fs');
const SC = process.argv[2] || ".";
const catalogue = JSON.parse(fs.readFileSync(`${SC}/pl9/catalogue.json`, 'utf8'));

/** name-pattern -> [verdict, evidence] applied within a group. */
const RULES = {
  File: [
    [/New \/|Open \/|Save|Close|Recent files/i, 'BUILT', '/library, /create-chart (VJ-011)'],
    [/File Manager/i, 'BUILT', '/library'],
    [/Print screen|Printer Setup|Model Printing/i, 'ABSENT', 'no print pipeline wired to UI'],
    [/Copy screen to Clipboard/i, 'ABSENT', ''],
    [/Language/i, 'ABSENT', 'no EN/TA toggle; app is Tamil-first'],
    [/Exit/i, 'BUILT', 'Electron shell (VJ-008)'],
  ],
  Edit: [
    [/Birth data/i, 'BUILT', 'BirthDataForm'],
    [/Chart Notes|Events/i, 'BUILT', 'VJ-022 consultations + journal'],
    [/Anka value/i, 'PARTIAL', 'src/report/numerology.js exists, no dedicated UI'],
    [/location|settings|Cover page/i, 'ABSENT', ''],
  ],
  'Reports / Horoscope': [
    [/Divisional/i, 'BUILT', '/divisional-charts (16 vargas)'],
    [/Sudarshan/i, 'BUILT', 'SudarshanaChakraRenderer'],
    [/Jaimini/i, 'BUILT', 'src/report/jaimini.js'],
    [/Upagraha|Sub-Planets/i, 'BUILT', 'src/report/upagraha.js'],
    [/Birth Chart|Birth Charts|Chandra/i, 'BUILT', 'VedicChartBox'],
    [/Planetary Details/i, 'BUILT', '/report'],
  ],
  'Reports / Calculations': [
    [/Planetary Friendship/i, 'BUILT', 'planetaryRelationship.js'],
    [/Shodashvarga/i, 'BUILT', 'vargaChart.js'],
    [/Bala/i, 'BUILT', 'shadbala.js, bhavaBala.js'],
    [/Aspects/i, 'BUILT', 'aspectMatrix.js'],
    [/Bhinnashtaka|Ashtakavarga/i, 'BUILT', 'ashtakavarga.js + variations'],
    [/Avasthas/i, 'BUILT', 'avasthas.js'],
    [/KP/i, 'BUILT', 'kpSystem.js'],
    [/Sarvashtaka|Chancha/i, 'BUILT', 'ashtakavargaVariations.js'],
    [/Health/i, 'PARTIAL', 'ayurdaya.js (longevity), not a health report'],
    [/Basic Calculations/i, 'BUILT', 'tirukanitaPanchangam.js'],
  ],
  'Reports / Interpretations': [
    [/Opening Page/i, 'PARTIAL', 'reportDocument.js has no cover page'],
    [/Panchanga Details/i, 'BUILT', 'tirukanitaPanchangam.js'],
    [/Classics — Yogas|Classics English/i, 'PARTIAL', 'yoga engines exist; no classical text corpus'],
    [/Classics — Jaimini/i, 'BUILT', 'jaimini.js'],
    [/Curses and Evils/i, 'PARTIAL', 'doshas.js covers some'],
    [/1001 Applicable/i, 'ABSENT', 'no 1001-yoga corpus'],
    [/Bhavesh/i, 'PARTIAL', 'answerEngine Q&A, not per-lord chapters'],
    [/Interpretations|Lucky Points|Nakshatra/i, 'PARTIAL', 'answerEngine.js Q&A corpus, different shape'],
  ],
  'Reports / Dashas': [
    [/Vimshottari/i, 'BUILT', 'vimshottariDasha.js — the one VERIFIED method (VJ-027)'],
    [/Ashtottari/i, 'PARTIAL', 'altDashas.js — STRUCTURE_ONLY, no source stamp'],
    [/Yogini/i, 'PARTIAL', 'altDashas.js — STRUCTURE_ONLY, no source stamp'],
    [/Kalachakra/i, 'BUILT', 'kalachakraDasha.js — SOURCED'],
    [/Tribhagi/i, 'PARTIAL', 'VJ-027 — SOURCED, no worked example'],
    [/.*/, 'ABSENT', 'DECLARED in VJ-027: start rule not establishable without the text'],
  ],
  'Reports / Varshaphala': [
    [/Tajika Yogas/i, 'BUILT', 'tajikaYogas.js'],
    [/Tripataki/i, 'BUILT', 'varshaphala.js'],
    [/Sahams/i, 'BUILT', 'sahams.js'],
    [/Mudda|Patyayini/i, 'BUILT', 'varshaphala.js'],
    [/Charts|Natal Chart|Planetary/i, 'BUILT', '/varshaphala'],
    [/Monthly|Consolidated|Interpretations/i, 'ABSENT', ''],
    [/Basic Calculations/i, 'BUILT', '/varshaphala'],
  ],
  'Reports / Compatibility': [
    [/Dash-Koota/i, 'PARTIAL', 'tamilPorutham.js — 9 of 10 tables read from Kalaprakasika (page-verified), Rasi Adhipathi unsourced'],
    [/Ashtkoot Guna/i, 'SUSPECT', 'CompatibilityMatrix.tsx: 36-guna from formulas that are not the Ashtakoota rules'],
    [/Mangala Dosha (Consideration|Results)/i, 'BUILT', '/mangala-dosha: every book\'s reading, intensity and the book\'s results by house'],
    [/Mangala Dosha Cancellation/i, 'BUILT', '/mangala-dosha: cancellations per source with pages, partner-chart conditions included'],
    [/Saptapadi/i, 'ABSENT', ''],
    [/Basic Birth Details|Birth Chart|Moon \/ Navamsha/i, 'BUILT', '/porutham shows both charts'],
  ],
  'Reports / Astronomy': [
    [/.*/, 'ABSENT', 'siderealPositions.js computes positions; no astronomy report'],
  ],
  'Reports / Remedies': [
    [/Calculations/i, 'BUILT', '/saturn-transit — saturnTransit.js: dates from the ephemeris, definitions cited to printed pages'],
    [/Sadhesati Remedies/i, 'PARTIAL', '/saturn-transit lists practices recorded in two books, with pages; not the PL9 remedy text'],
    [/Sadhesati Results/i, 'PARTIAL', '/saturn-transit gives the book text per phase and cycle; not the PL9 results wording'],
    [/Dhayya Results|Kantaka Saturn Results/i, 'PARTIAL', '/saturn-transit computes the periods; no results text yet'],
    [/Mangala Consideration/i, 'BUILT', '/mangala-dosha'],
    [/Mangala Results and Remedies/i, 'PARTIAL', '/mangala-dosha: results by house (Vishnu Bhaskar) and remedies as one book records them; not the PL9 wording'],
    [/.*/, 'ABSENT', 'no gemstone module'],
  ],
  'Reports / Astrology Lessons': [
    [/Dictionary/i, 'BUILT', '/learning-resources glossary (VJ-026)'],
    [/.*/, 'ABSENT', ''],
  ],
  Reports: [[/.*/, 'PARTIAL', '/report exists; no preview-control shell']],
  'Classical references': [
    [/Brihat Parashara Hora Shastra$/i, 'PARTIAL', '/references paraphrases; source registry cites it (VJ-026)'],
    [/1001 Yogas/i, 'ABSENT', ''],
    [/.*/, 'MENU_ONLY', 'named in TopMenuBar; no text behind it'],
  ],
  'Classical references / Descriptions': [
    [/Karakas/i, 'BUILT', 'karaka.js'],
    [/Nakshatra/i, 'BUILT', 'nakshatraExtras.js'],
    [/Tithi|Yoga|Karana/i, 'BUILT', 'tirukanitaPanchangam.js'],
    [/Navamsha|Drekkana/i, 'BUILT', 'vargaChart.js'],
    [/.*/, 'PARTIAL', 'classicalReferencesData.ts paraphrase, loose chapter refs'],
  ],
  'Options / Preferences': [
    [/Calculation/i, 'BUILT', 'ayanamsha / house system / node type'],
    [/Chart style|Display/i, 'PARTIAL', 'South/North toggle only'],
    [/Dashas/i, 'BUILT', '/dasha-methods (VJ-027)'],
    [/.*/, 'ABSENT', 'no fonts, colour coding, printing or system preferences'],
  ],
  Options: [
    [/Reset all/i, 'ABSENT', ''],
    [/.*/, 'PARTIAL', 'SettingsPanel covers some'],
  ],
  Tools: [
    [/Rectification/i, 'BUILT', '/rectification'],
    [/Chart navigator/i, 'BUILT', 'CommandPalette (VJ-015)'],
    [/Notes/i, 'BUILT', 'VJ-022'],
    [/Yogas/i, 'BUILT', '/yoga-detection'],
    [/Change Location|Change Time/i, 'MENU_ONLY', 'Sidebar links to /tools/location and /tools/time — both 404'],
    [/.*/, 'ABSENT', ''],
  ],
  Print: [
    [/.*/, 'ABSENT', 'VJ-019 produces a real PDF but no UI calls it; no print sets'],
  ],
  'Print / Dashas': [[/.*/, 'ABSENT', '']],
  Research: [
    [/Search for Charts/i, 'BUILT', 'FTS5 search (VJ-011)'],
    [/Export Birth Chart/i, 'BUILT', 'VJ-012 archive'],
    [/Time of transits/i, 'BUILT', '/kp-time-scan, /dasha-timeline (VJ-017)'],
    [/Statistics/i, 'PARTIAL', '/research cohorts (VJ-028) — no graphs'],
    [/Export Ephemeris|Calculator/i, 'ABSENT', ''],
  ],
  'Research / Statistics': [
    [/.*/, 'PARTIAL', 'VJ-028 predicates cover these dimensions; no statistics output'],
  ],
  Windows: [[/.*/, 'PARTIAL', 'WindowManager exists; claims unaudited (Phase 30)']],
  Help: [
    [/Manual|About/i, 'PARTIAL', 'HelpPanel'],
    [/.*/, 'ABSENT', ''],
  ],
  Toolbar: [
    [/Natal|Varshaphala|Compatibility|Transits|KP|Reports/i, 'BUILT', 'routes exist'],
    [/Preferences/i, 'BUILT', '/settings'],
    [/Chart switch|Favorites/i, 'PARTIAL', 'ChartLibraryManager (old localStorage layer)'],
    [/.*/, 'BUILT', ''],
  ],
  Worksheets: [
    [/Unused|Reserved/i, 'N/A', 'PL9 placeholder'],
    [/Birth Chart|Vargas|Signs in All Vargas/i, 'BUILT', 'vargaChart.js, /divisional-charts'],
    [/Sudarshan|Sunrise Chart/i, 'BUILT', ''],
    [/Special Lagnas|Alternate Lagnas/i, 'PARTIAL', 'jaimini.js has some'],
    [/Lordships|Relationships/i, 'BUILT', 'planetaryRelationship.js'],
    [/Vimshopaka/i, 'PARTIAL', 'referenced in ReportBuilder only'],
    [/Shadbala|Bhava Bala/i, 'BUILT', ''],
    [/Aspects on|Aspects from/i, 'BUILT', 'aspectMatrix.js'],
    [/Jaimini Karakas|Padas/i, 'BUILT', 'jaimini.js, karaka.js'],
    [/Nakshatra Dashas|Rashi Dashas/i, 'PARTIAL', 'VJ-027: 5 of ~23 implemented'],
    [/Declination/i, 'PARTIAL', 'used inside shadbala, not a worksheet'],
    [/Nakshatra Spatial|Nakshatra Deities/i, 'BUILT', 'nakshatraExtras.js'],
    [/Panch Pakshi/i, 'BUILT', 'extendedPorutham.js'],
    [/Yogas/i, 'BUILT', '/yoga-detection'],
    [/Rectification/i, 'BUILT', '/rectification'],
    [/Auspiciousness/i, 'BUILT', '/nallaneram, /muhurta'],
    [/in House$/i, 'PARTIAL', 'answerEngine Q&A, not per-house chapters'],
    [/Bhavesh/i, 'PARTIAL', 'answerEngine Q&A'],
    [/Nature & Temperament|Physical Characteristics|Lucky Points/i, 'PARTIAL', 'answerEngine / numerology'],
    [/Interpreting Grahas/i, 'PARTIAL', 'answerEngine'],
    [/Chart Tutor|Dasha Effects Browser/i, 'ABSENT', ''],
    [/Annual Solar|Monthly Solar|Daily Solar|Tithi Pravesh|Eight-year|Three-month|Three-day/i, 'ABSENT', 'varshaphala.js covers the annual chart only'],
    [/Sahams|Tajika|Tripataki|Annual Dashas|Annual Interpretations/i, 'BUILT', 'varshaphala.js'],
    [/Mangala/i, 'BUILT', '/mangala-dosha (mangalaDosha.js)'],
    [/Compatibility|Dash Koota/i, 'PARTIAL', '/porutham — 9 of 10 tables page-verified (Kalaprakasika); no Ashtakoota'],
    [/Animated Transits/i, 'ABSENT', ''],
    [/Calendar/i, 'BUILT', '/tamil-calendar'],
    [/Graphical Ephemeris/i, 'ABSENT', ''],
    [/Yearly Transit/i, 'PARTIAL', 'transitPositions.js'],
    [/Dasha & Transit Timelines/i, 'BUILT', '/dasha-timeline (VJ-017)'],
    [/Ashtakavarga|Samudaya|Bhinna|Prastar|Sarva & Chancha/i, 'BUILT', 'ashtakavargaVariations.js'],
    [/Kaksha Dasha/i, 'ABSENT', ''],
    [/Kota Chakra|Sanghatta/i, 'ABSENT', ''],
    [/Sarvatobhadra/i, 'BUILT', 'sarvatobhadraChakra.js'],
    [/Events/i, 'PARTIAL', 'VJ-022 journal, not PL9 event worksheets'],
    [/Muhurta/i, 'BUILT', '/muhurta, /classical-muhurta'],
    [/Prashna|Krishnamurti|KP/i, 'BUILT', '/kelvi, /jamakkol, kpSystem.js'],
    [/Sadhesati Calculations/i, 'BUILT', '/saturn-transit (saturnTransit.js)'],
    [/Sadhesati Remedies/i, 'PARTIAL', '/saturn-transit: practices recorded in two books, with pages'],
    [/Sadhesati Results/i, 'PARTIAL', '/saturn-transit: the book text per phase and cycle'],
    [/Lucky Stone/i, 'ABSENT', 'Raj Kumar PDF 121-122 gives Western month/numerology stones; not read as Vedic, not built'],
    [/Gem/i, 'PARTIAL', '/gemstones: three books side by side with pages; no single recommendation, no PL9 gem scoring'],
  ],
};

function verdict(row) {
  const rules = RULES[row.group];
  if (!rules) return ['ABSENT', 'no rule for group'];
  for (const [re, v, ev] of rules) if (re.test(row.name)) return [v, ev];
  return ['ABSENT', ''];
}

const rows = catalogue.map((r) => {
  const [v, evidence] = verdict(r);
  return { group: r.group, name: r.name, verdict: v, evidence };
});

const counts = {};
for (const r of rows) counts[r.verdict] = (counts[r.verdict] ?? 0) + 1;

const real = rows.filter((r) => r.verdict !== 'N/A');
const byGroup = {};
for (const r of real) {
  byGroup[r.group] ??= { total: 0, BUILT: 0, PARTIAL: 0, MENU_ONLY: 0, SUSPECT: 0, ABSENT: 0 };
  byGroup[r.group].total += 1;
  byGroup[r.group][r.verdict] += 1;
}

fs.writeFileSync(`${SC}/audit-rows.json`, JSON.stringify(rows, null, 1));
console.log(JSON.stringify({ counts, realRows: real.length, byGroup }, null, 1));
