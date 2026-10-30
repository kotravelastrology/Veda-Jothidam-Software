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

const BOOK_SECTIONS = [
  { id: 'p1', title: 'Page 1 · Birth Particulars', build: buildPage1 },
  { id: 'p2', title: 'Page 2 · Birth Chart', build: buildPage2 },
  { id: 'p3', title: 'Page 3 · Chandra, Navamsha and Bhava charts', build: buildPage3 },
  { id: 'p5', title: 'Page 5 · Divisional Charts #1', build: buildPage5 },
  { id: 'p6', title: 'Page 6 · Divisional Charts #2', build: buildPage6 },
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
