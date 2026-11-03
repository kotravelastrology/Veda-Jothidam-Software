/**
 * The horoscope book's sections, in PL9's order (aniruddha_HC4). Each section builds one page from { name, birth } and returns
 * { title, subtitle, blocks }. The print centre lists these, takes the ones the user selects, and prints them as one book.
 *
 * Page 4 (Sudarshan Chakra) and the later pages (20 onwards) are not in the registry until they are built.
 */
const { buildPage1 } = require('./page1');
const { buildPage2 } = require('./page2');
const { buildPage3, buildPage5, buildPage6 } = require('./charts');
const { buildPage8 } = require('./page8');
const { buildPage9, buildPage10 } = require('./planetPages');
const { buildPage11 } = require('./shadbalaPage');
const { buildPage12 } = require('./aspectPage');
const { buildPage13 } = require('./avasthaPage');
const { buildPage14, buildPage15, buildPage16, buildPage17 } = require('./ashtakavargaPage');
const { buildPage18 } = require('./divisionalAshtakavargaPage');
const { buildPage19 } = require('./healthPage');
const { buildPage20 } = require('./dashaPage');
const { buildVimshottariDetail, buildVimshottariSookshma } = require('./vimshottariPages');
const { buildAshtottariMain, buildAshtottariShort, buildYogini, buildYoginiShort } = require('./altDashaPages');
const { buildRarePage } = require('./rarePages');

const { buildKpChart, buildKpSignificators } = require('./kpPages');

const { buildSadhesati, buildLaghuKalyani } = require('./saturnPages');

const { buildVarshaCharts } = require('./varshaPages');

const { buildSubPlanets } = require('./subPlanetsPage');

const { buildSudarshana } = require('./sudarshanaPage');

const { buildRashiDasha } = require('./rashiPages');

const { buildJaiminiSystem } = require('./jaiminiPage');

const { buildKalachakraMain, buildKalachakraShort } = require('./kalachakraPages');

const { buildVimshottariShort } = require('./vimshottariPages');
const { buildMangalaPage, buildSadeSatiRemedies, buildGemstonesPage, buildDashaResults, buildAntardashaResults } = require('./extraPages');

const BOOK_SECTIONS = [
  { id: 'p1', title: 'Page 1 · Birth Particulars', build: buildPage1 },
  { id: 'p2', title: 'Page 2 · Birth Chart', build: buildPage2 },
  { id: 'p3', title: 'Page 3 · Chandra, Navamsha and Bhava charts', build: buildPage3 },
  { id: 'p4', title: 'Page 4 · Sudarshan Chakra', build: buildSudarshana },
  { id: 'p5', title: 'Page 5 · Divisional Charts #1', build: buildPage5 },
  { id: 'p6', title: 'Page 6 · Divisional Charts #2', build: buildPage6 },
  { id: 'p7', title: 'Page 7 · Sub-Planets', build: buildSubPlanets },
  { id: 'p8', title: 'Page 8 · Birth Charts', build: buildPage8 },
  { id: 'p9', title: 'Page 9 · Planetary Friendship', build: buildPage9 },
  { id: 'p10', title: 'Page 10 · Shodashvarga Summary', build: buildPage10 },
  { id: 'p11', title: 'Page 11 · Shad Bala and Bhava Bala', build: buildPage11 },
  { id: 'p12', title: 'Page 12 · Aspects on Planets and Bhavas', build: buildPage12 },
  { id: 'p13', title: 'Page 13 · Planetary Avasthas', build: buildPage13 },
  { id: 'p14', title: 'Page 14 · Bhinnashtakavarga #1', build: buildPage14 },
  { id: 'p15', title: 'Page 15 · Bhinnashtakavarga #2', build: buildPage15 },
  { id: 'p16', title: 'Page 16 · Sarvashtaka and Chancha Chakra', build: buildPage16 },
  { id: 'p17', title: 'Page 17 · Ashtakavarga Reductions', build: buildPage17 },
  { id: 'p18', title: 'Page 18 · Divisional Charts — Ashtakavarga', build: buildPage18 },
  { id: 'p19', title: 'Page 19 · Health', build: buildPage19 },
  { id: 'p20', title: 'Page 20 · Vimshottari MD and AD', build: buildPage20 },
  { id: 'p21', title: 'Page 21 · Vimshottari Detailed AD and PD #1', build: (q) => buildVimshottariDetail({ ...q, index: 0 }) },
  { id: 'p22', title: 'Page 22 · Vimshottari Detailed AD and PD #2', build: (q) => buildVimshottariDetail({ ...q, index: 1 }) },
  { id: 'p23', title: 'Page 23 · Vimshottari Detailed AD and PD #3', build: (q) => buildVimshottariDetail({ ...q, index: 2 }) },
  { id: 'p24', title: 'Page 24 · Vimshottari Detailed AD and PD #4', build: (q) => buildVimshottariDetail({ ...q, index: 3 }) },
  { id: 'p25', title: 'Page 25 · Vimshottari Detailed AD and PD #5', build: (q) => buildVimshottariDetail({ ...q, index: 4 }) },
  { id: 'p26', title: 'Page 26 · Vimshottari Detailed AD and PD #6', build: (q) => buildVimshottariDetail({ ...q, index: 5 }) },
  { id: 'p27', title: 'Page 27 · Vimshottari Detailed AD and PD #7', build: (q) => buildVimshottariDetail({ ...q, index: 6 }) },
  { id: 'p28', title: 'Page 28 · Vimshottari Detailed AD and PD #8', build: (q) => buildVimshottariDetail({ ...q, index: 7 }) },
  { id: 'p29', title: 'Page 29 · Vimshottari Detailed AD and PD #9', build: (q) => buildVimshottariDetail({ ...q, index: 8 }) },
  { id: 'p30', title: 'Page 30 · Vimshottari Dasha – PD and Sookshma #1', build: (q) => buildVimshottariSookshma({ ...q, part: 0 }) },
  { id: 'p31', title: 'Page 31 · Vimshottari Dasha – PD and Sookshma #2', build: (q) => buildVimshottariSookshma({ ...q, part: 1 }) },
  { id: 'p32', title: 'Page 32 · Vimshottari Dasha – PD and Sookshma #3', build: (q) => buildVimshottariSookshma({ ...q, part: 2 }) },
  { id: 'p33', title: 'Page 33 · Ashtottari MD and AD', build: buildAshtottariMain },
  { id: 'p34', title: 'Page 34 · Ashtottari (Short) AD and PD #1', build: (q) => buildAshtottariShort({ ...q, part: 0 }) },
  { id: 'p35', title: 'Page 35 · Ashtottari (Short) AD and PD #2', build: (q) => buildAshtottariShort({ ...q, part: 1 }) },
  { id: 'p36', title: 'Page 36 · Ashtottari (Short) AD and PD #3', build: (q) => buildAshtottariShort({ ...q, part: 2 }) },
  { id: 'p37', title: 'Page 37 · Ashtottari (Short) AD and PD #4', build: (q) => buildAshtottariShort({ ...q, part: 3 }) },
  { id: 'p38', title: 'Page 38 · Yogini Dasha - First Cycle', build: (q) => buildYogini({ ...q, cycle: 0 }) },
  { id: 'p39', title: 'Page 39 · Yogini Dasha - Second Cycle', build: (q) => buildYogini({ ...q, cycle: 1 }) },
  { id: 'p40', title: 'Page 40 · Yogini Dasha - Third Cycle', build: (q) => buildYogini({ ...q, cycle: 2 }) },
  { id: 'p41', title: 'Page 41 · Kala Chakra Dasha - MD and AD', build: buildKalachakraMain },
  { id: 'p42', title: 'Page 42 · Kala Chakra Dasha AD and PD #1', build: (q) => buildKalachakraShort({ ...q, part: 0 }) },
  { id: 'p43', title: 'Page 43 · Kala Chakra Dasha AD and PD #2', build: (q) => buildKalachakraShort({ ...q, part: 1 }) },
  { id: 'p44', title: 'Page 44 · Kala Chakra Dasha AD and PD #3', build: (q) => buildKalachakraShort({ ...q, part: 2 }) },
  { id: 'p45', title: 'Page 45 · Kala Chakra Dasha AD and PD #4', build: (q) => buildKalachakraShort({ ...q, part: 3 }) },
  { id: 'p46', title: 'Page 46 · Kala Chakra Dasha AD and PD #5', build: (q) => buildKalachakraShort({ ...q, part: 4 }) },
  { id: 'p47', title: 'Page 47 · Jaimini System', build: buildJaiminiSystem },
  { id: 'p48', title: 'Page 48 · Jaimini Chara Dasha #1', build: (q) => buildRashiDasha({ ...q, system: "chara-pl9", cycle: 0 }) },
  { id: 'p49', title: 'Page 49 · Jaimini Chara Dasha #2', build: (q) => buildRashiDasha({ ...q, system: "chara-pl9", cycle: 1 }) },
  { id: 'p50', title: 'Page 50 · Sthira Dasha', build: (q) => buildRashiDasha({ ...q, system: "sthira-pl9", cycle: 0 }) },
  { id: 'p51', title: 'Page 51 · Niryaana Shoola Dasha #1', build: (q) => buildRashiDasha({ ...q, system: "drig-pl9", cycle: 0 }) },
  { id: 'p52', title: 'Page 52 · Niryaana Shoola Dasha #2', build: (q) => buildRashiDasha({ ...q, system: "drig-pl9", cycle: 1 }) },
  { id: 'p53', title: 'Page 53 · Drig Dasha #1', build: (q) => buildRashiDasha({ ...q, system: "drig-pl9", cycle: 0 }) },
  { id: 'p54', title: 'Page 54 · Drig Dasha #2', build: (q) => buildRashiDasha({ ...q, system: "drig-pl9", cycle: 1 }) },
  { id: 'p55', title: 'Page 55 · Navamsha Dasha #1', build: (q) => buildRashiDasha({ ...q, system: "navamsha-pl9", cycle: 0 }) },
  { id: 'p56', title: 'Page 56 · Navamsha Dasha #2', build: (q) => buildRashiDasha({ ...q, system: "navamsha-pl9", cycle: 1 }) },
  { id: 'p57', title: 'Page 57 · Narayana Dasha #1', build: (q) => buildRashiDasha({ ...q, system: "narayana-pl9", cycle: 0 }) },
  { id: 'p58', title: 'Page 58 · Narayana Dasha #2', build: (q) => buildRashiDasha({ ...q, system: "narayana-pl9", cycle: 1 }) },
  { id: 'p59', title: 'Page 59 · Lagna Kendradi Rashi Dasha #1', build: (q) => buildRashiDasha({ ...q, system: "kendradi-pl9", cycle: 0 }) },
  { id: 'p60', title: 'Page 60 · Lagna Kendradi Rashi Dasha #2', build: (q) => buildRashiDasha({ ...q, system: "kendradi-pl9", cycle: 1 }) },
  { id: 'p61', title: 'Page 61 · Shoola Dasha', build: (q) => buildRashiDasha({ ...q, system: "shoola-pl9", cycle: 0 }) },
  { id: 'p62', title: 'Page 62 · Tribhagi Dasha #1', build: (q) => buildRarePage({ ...q, method: 'tribhagi', page: 0 }) },
  { id: 'p63', title: 'Page 63 · Tribhagi Dasha #2', build: (q) => buildRarePage({ ...q, method: 'tribhagi', page: 1 }) },
  { id: 'p64', title: 'Page 64 · Tribhagi 40 Dasha #1', build: (q) => buildRarePage({ ...q, method: "tribhagi-40", page: 0 }) },
  { id: 'p65', title: 'Page 65 · Tribhagi 40 Dasha #2', build: (q) => buildRarePage({ ...q, method: "tribhagi-40", page: 1 }) },
  { id: 'p66', title: 'Page 66 · Tribhagi 40 Dasha #3', build: (q) => buildRarePage({ ...q, method: "tribhagi-40", page: 2 }) },
  { id: 'p67', title: 'Page 67 · Shodashottari Dasha', build: (q) => buildRarePage({ ...q, method: 'shodashottari', page: 0 }) },
  { id: 'p68', title: 'Page 68 · Dwadashottari Dasha', build: (q) => buildRarePage({ ...q, method: 'dwadashottari', page: 0 }) },
  { id: 'p69', title: 'Page 69 · Dwisaptatisama Dasha', build: (q) => buildRarePage({ ...q, method: 'dwisaptati-sama', page: 0 }) },
  { id: 'p70', title: 'Page 70 · Dwisaptatisama Dasha #2', build: (q) => buildRarePage({ ...q, method: 'dwisaptati-sama', page: 1 }) },
  { id: 'p71', title: 'Page 71 · Shastihayani Dasha #1', build: (q) => buildRarePage({ ...q, method: 'shashtihayani', page: 0 }) },
  { id: 'p72', title: 'Page 72 · Shastihayani Dasha #2', build: (q) => buildRarePage({ ...q, method: 'shashtihayani', page: 1 }) },
  { id: 'p73', title: 'Page 73 · Shattrimshatsama Dasha #1', build: (q) => buildRarePage({ ...q, method: 'shattrimshat-sama', page: 0 }) },
  { id: 'p74', title: 'Page 74 · Shattrimshatsama Dasha #2', build: (q) => buildRarePage({ ...q, method: 'shattrimshat-sama', page: 1 }) },
  { id: 'p75', title: 'Page 75 · Shattrimshatsama Dasha #3', build: (q) => buildRarePage({ ...q, method: 'shattrimshat-sama', page: 2 }) },
  { id: 'p76', title: 'Page 76 · Panchottari Dasha', build: (q) => buildRarePage({ ...q, method: 'panchottari', page: 0 }) },
  { id: 'p77', title: 'Page 77 · Satabdika Dasha', build: (q) => buildRarePage({ ...q, method: 'shatabdika', page: 0 }) },
  { id: 'p78', title: 'Page 78 · Chaturshitisama Dasha', build: (q) => buildRarePage({ ...q, method: 'chaturashiti-sama', page: 0 }) },
  { id: 'p79', title: 'Page 79 · Sadhesati of Saturn', build: buildSadhesati },
  { id: 'p80', title: 'Page 80 · Laghu Kalyani Dhayya and Kantaka Saturn', build: buildLaghuKalyani },
  { id: 'p81', title: 'Page 81 · Krishnamurti Paddhati - Chart', build: buildKpChart },
  { id: 'p82', title: 'Page 82 · Krishnamurti Paddhati - Significators', build: buildKpSignificators },
  { id: 'p83', title: 'Page 83 · Varshaphala Charts #1', build: (q) => buildVarshaCharts({ ...q, part: 0 }) },
  { id: 'p84', title: 'Page 84 · Varshaphala Charts #2', build: (q) => buildVarshaCharts({ ...q, part: 1 }) },
  { id: 'p85', title: 'Page 85 · Varshaphala Charts #3', build: (q) => buildVarshaCharts({ ...q, part: 2 }) },
  { id: 'p86', title: 'Page 86 · Varshaphala Charts #4', build: (q) => buildVarshaCharts({ ...q, part: 3 }) },
  { id: 'p87', title: 'Page 87 · Varshaphala Charts #5', build: (q) => buildVarshaCharts({ ...q, part: 4 }) },
  { id: 'p88', title: 'Page 88 · Varshaphala Charts #6', build: (q) => buildVarshaCharts({ ...q, part: 5 }) },
  // the pages after the sample's 88 (extraPages.js): what the HP1 prediction print carries besides
  { id: 'p89', title: 'Page 89 · Mangala Dosha', build: buildMangalaPage },
  { id: 'p90', title: 'Page 90 · Sadhesati and Remedies', build: buildSadeSatiRemedies },
  { id: 'p91', title: 'Page 91 · Gemstones', build: buildGemstonesPage },
  { id: 'p92', title: 'Page 92 · Dasha Results', build: buildDashaResults },
  // PL9's shorter print (meera_HC2): the Vimshottari antardashas with only the pratyantardasha beginnings, and the Yogini dasha in two pages
  { id: 'p93', title: 'Page 93 · Vimshottari (Short) AD and PD #1', build: (q) => buildVimshottariShort({ ...q, part: 0 }) },
  { id: 'p94', title: 'Page 94 · Vimshottari (Short) AD and PD #2', build: (q) => buildVimshottariShort({ ...q, part: 1 }) },
  { id: 'p95', title: 'Page 95 · Vimshottari (Short) AD and PD #3', build: (q) => buildVimshottariShort({ ...q, part: 2 }) },
  { id: 'p96', title: 'Page 96 · Vimshottari (Short) AD and PD #4', build: (q) => buildVimshottariShort({ ...q, part: 3 }) },
  { id: 'p97', title: 'Page 97 · Vimshottari (Short) AD and PD #5', build: (q) => buildVimshottariShort({ ...q, part: 4 }) },
  { id: 'p98', title: 'Page 98 · Yogini (Short) MD and AD #1', build: (q) => buildYoginiShort({ ...q, part: 0 }) },
  { id: 'p99', title: 'Page 99 · Yogini (Short) MD and AD #2', build: (q) => buildYoginiShort({ ...q, part: 1 }) },
  // the antardasha results (extraPages.js): the HP1 print's per-antardasha text, from BPHS ch.52-60, a page for each mahadasha from birth
  { id: 'p100', title: 'Page 100 · Antardasha Results #1', build: (q) => buildAntardashaResults({ ...q, index: 0 }) },
  { id: 'p101', title: 'Page 101 · Antardasha Results #2', build: (q) => buildAntardashaResults({ ...q, index: 1 }) },
  { id: 'p102', title: 'Page 102 · Antardasha Results #3', build: (q) => buildAntardashaResults({ ...q, index: 2 }) },
  { id: 'p103', title: 'Page 103 · Antardasha Results #4', build: (q) => buildAntardashaResults({ ...q, index: 3 }) },
  { id: 'p104', title: 'Page 104 · Antardasha Results #5', build: (q) => buildAntardashaResults({ ...q, index: 4 }) },
  { id: 'p105', title: 'Page 105 · Antardasha Results #6', build: (q) => buildAntardashaResults({ ...q, index: 5 }) },
  { id: 'p106', title: 'Page 106 · Antardasha Results #7', build: (q) => buildAntardashaResults({ ...q, index: 6 }) },
  { id: 'p107', title: 'Page 107 · Antardasha Results #8', build: (q) => buildAntardashaResults({ ...q, index: 7 }) },
  { id: 'p108', title: 'Page 108 · Antardasha Results #9', build: (q) => buildAntardashaResults({ ...q, index: 8 }) },
];

/** The sections without their builders, for the print centre's list. */
function bookSectionList() {
  return BOOK_SECTIONS.map(({ id, title }) => ({ id, title }));
}

/**
 * Builds the selected sections for one birth, in the book's order. Returns a Promise of [{ id, title, doc }].
 * Unknown ids are ignored.
 */
async function buildBookSections({ name = '', birth, ids, dashaOptions }) {
  const wanted = new Set(ids);
  const out = [];
  for (const section of BOOK_SECTIONS) {
    if (!wanted.has(section.id)) continue;
    const doc = await section.build({ name, birth, dashaOptions });
    out.push({ id: section.id, title: section.title, doc });
  }
  return out;
}

module.exports = { BOOK_SECTIONS, bookSectionList, buildBookSections };
