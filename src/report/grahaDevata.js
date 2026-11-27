/**
 * The planets' deities (PL9 Charts menu: "Planetary deities"), each book's list as it prints it, side by side; none merged.
 *
 * 1. Annamalai University, Jothidaviyal M.A. first year, Paper I (corpus C73, the owner's scan), §3-3-1 to §3-3-9, printed pp.32-40,
 *    one page a planet: rows 3-5 of each planet's table give தேவதை, அதி தேவதை and பிரத்யதி தேவதை for all nine planets.
 *    Most explained (three deities each, Rahu and Ketu included), so it comes first. Values as printed, read on the page images.
 * 2. Brihat Parashara Hora Shastra ch.3 v.18 (R. Santhanam's translation): one presiding deity each for the Sun to Saturn,
 *    "Fire (Agni), Water (Varuna), Subrahmanya, Maha Vishnu, Indra, Sachi Devi and Brahma"; Rahu and Ketu are not named.
 * 3. Hora Ratnam ch.1 v.115, printed p.103 (Balabhadra, R. Santhanam's translation), giving Saravali's tutelary deities for the
 *    Sun to Saturn: Agni, Water, Kartikeya, Vishnu, Indra, Sachi Devi, Brahma. The same seven as BPHS.
 *
 * A reference table, not a verdict: no deity is recommended for a chart.
 */

const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

const ANNAMALAI = Object.freeze({
  title: 'Jothidaviyal, M.A. first year, Paper I: Jothidaviyalin Adippadai',
  author: 'Annamalai University (Saptharishi Jothida Ariviyal Payirchi & Aaraichi Maiyam, Madurai)',
  file: 'C73-annamalai-jothidaviyal-ma-year1-paper1-scan.pdf',
});
const BPHS = Object.freeze({
  title: 'Brihat Parashara Hora Shastra (BPHS)',
  author: 'R. Santhanam (translation)',
  file: 'C23_BPHS_Santhanam.pdf',
});
const HORA_RATNAM = Object.freeze({
  title: 'Hora Ratnam',
  author: 'Balabhadra (R. Santhanam, translation)',
  file: 'Jyotish_Hora ratnam _Santhanam.pdf',
});

// [planet, section, printed page, தேவதை, அதி தேவதை, பிரத்யதி தேவதை] in Tamil as printed, then the English names (ours)
const A = [
  ['Sun', '§3-3-1', 32, 'சிவன்', 'நெருப்பு', 'ருத்திரன்', 'Shiva', 'Fire', 'Rudra'],
  ['Moon', '§3-3-2', 33, 'பார்வதி', 'நீர்', 'கௌரி', 'Parvati', 'Water', 'Gauri'],
  ['Mars', '§3-3-3', 34, 'சுப்பிரமணியர்', 'பூமி (பூ தேவி)', 'க்ஷேத்திராதிபதி', 'Subrahmanya', 'Earth (Bhu Devi)', 'Kshetradhipati'],
  ['Mercury', '§3-3-4', 35, 'விஷ்ணு', 'விஷ்ணு', 'நாராயணன்', 'Vishnu', 'Vishnu', 'Narayana'],
  ['Jupiter', '§3-3-5', 36, 'பிரம்மன்', 'இந்திரன்', 'பிரம்மன்', 'Brahma', 'Indra', 'Brahma'],
  ['Venus', '§3-3-6', 37, 'லக்ஷ்மி', 'இந்திராணி', 'இந்திரன்', 'Lakshmi', 'Indrani', 'Indra'],
  ['Saturn', '§3-3-7', 38, 'எமன்', 'பிரஜாபதி', 'எமன்', 'Yama', 'Prajapati', 'Yama'],
  ['Rahu', '§3-3-8', 39, 'பத்திரகாளி', 'சர்ப்பம்', 'நிருருதி', 'Bhadrakali', 'Serpent', 'Nirruti'],
  ['Ketu', '§3-3-9', 40, 'இந்திரன்', 'பிரம்மன்', 'சித்திரகுப்தன்', 'Indra', 'Brahma', 'Chitragupta'],
];

// BPHS 3.18 and Hora Ratnam 1.115 (Saravali): one deity each, Sun to Saturn
const SEVEN = [
  ['Sun', 'அக்னி', 'Agni (Fire)'],
  ['Moon', 'வருணன் (நீர்)', 'Varuna (Water)'],
  ['Mars', 'சுப்பிரமணியர் (கார்த்திகேயன்)', 'Subrahmanya (Kartikeya)'],
  ['Mercury', 'மகா விஷ்ணு', 'Maha Vishnu'],
  ['Jupiter', 'இந்திரன்', 'Indra'],
  ['Venus', 'சசி தேவி (இந்திராணி)', 'Sachi Devi (Indrani)'],
  ['Saturn', 'பிரம்மா', 'Brahma'],
];

const BOOKS = [
  {
    id: 'annamalai',
    source: { ...ANNAMALAI, pageLocus: '§3-3-1 to §3-3-9, printed pp.32-40 (scan pp.2-10; rows 3-5 of each planet\'s table)' },
    levels: [
      { key: 'devata', ta: 'தேவதை', en: 'Deity' },
      { key: 'adhi', ta: 'அதி தேவதை', en: 'Adhi devata' },
      { key: 'pratyadhi', ta: 'பிரத்யதி தேவதை', en: 'Pratyadhi devata' },
    ],
    rows: A.map(([planet, section, page, d, ad, pd, dEn, adEn, pdEn]) => ({
      planet, section, page,
      devata: { ta: d, en: dEn }, adhi: { ta: ad, en: adEn }, pratyadhi: { ta: pd, en: pdEn },
    })),
  },
  {
    id: 'bphs',
    source: { ...BPHS, pageLocus: 'Ch.3 v.18, "Planetary deities"' },
    levels: [{ key: 'devata', ta: 'அதிதேவதை', en: 'Presiding deity' }],
    rows: SEVEN.map(([planet, ta, en]) => ({ planet, devata: { ta, en } })),
    note: { ta: 'ராகு, கேதுவுக்கு இந்த ஸ்லோகம் தேவதை சொல்லவில்லை.', en: 'This verse names no deity for Rahu and Ketu.' },
  },
  {
    id: 'hora-ratnam',
    source: { ...HORA_RATNAM, pageLocus: 'Ch.1 v.115, quoting Saravali, printed p.103' },
    levels: [{ key: 'devata', ta: 'காவல் தேவதை', en: 'Tutelary deity' }],
    rows: SEVEN.map(([planet, ta, en]) => ({ planet, devata: { ta, en } })),
    note: { ta: 'சாராவளியை மேற்கோள் காட்டுகிறது; பிருஹத் பராசரரின் ஏழு தேவதைகளே.', en: 'Quotes Saravali; the same seven as BPHS.' },
  },
];

/** Each book's list, in the order shown (most explained first). */
function grahaDevataBooks() {
  return BOOKS;
}

/** One planet's deities across the books: [{ bookId, levels: [{ ta, en, name: {ta, en} }] }], books that name none left out. */
function deitiesOf(planet) {
  return BOOKS.flatMap((b) => {
    const r = b.rows.find((x) => x.planet === planet);
    return r ? [{ bookId: b.id, levels: b.levels.map((l) => ({ ta: l.ta, en: l.en, name: r[l.key] })) }] : [];
  });
}

module.exports = { PLANETS, BOOKS, grahaDevataBooks, deitiesOf };
