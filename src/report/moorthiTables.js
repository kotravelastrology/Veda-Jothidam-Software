/**
 * Moorthi Nirnaya — the books' tables.
 *
 * When a planet enters a new sign, the house of the transit Moon counted from
 * the natal Moon gives the planet a "form" (moorthi) for its stay there:
 * 1/6/11 gold (Swarna), 2/5/9 silver (Rajata), 3/7/10 copper (Tamra), 4/8/12
 * iron (Loha). All six books give the same four groups. They differ on what
 * the forms mean:
 *
 *   - Pulippani (Gochar Phaladeepika ch.25 and the Jupiter chapter, 1821 words)
 *     grades benefics gold 1, silver 3/4, copper 1/2, iron 1/4 — and reverses
 *     the order for malefics (silver 1, copper 3/4, iron 1/2, gold 1/4). He
 *     quantifies the form together with the ordinary good/bad house, in two
 *     series that do not agree, and his tables carry print slips.
 *   - Raj Kumar (two books, the same table; 418 words in the longer), A.K. Gour
 *     (329), P.V.R. Narasimha Rao (271) and R. Santhanam (222) grade every
 *     planet the same way, gold best and iron worst.
 *
 * Pulippani explains most and is shown first (owner's rule, 2026-10-03). Each
 * book's words are shown in its own row; nothing is merged into a verdict.
 */

const { SOURCES: { PULIPPANI } } = require('./saturnTransitTables');
const { SANTHANAM_JN } = require('./nakshatraVedhaTables');
const { GOUR } = require('./saptashalakaTables');

const deepFreeze = (o) => {
  Object.values(o).forEach((v) => { if (v && typeof v === 'object') deepFreeze(v); });
  return Object.freeze(o);
};

const RAO = Object.freeze({
  title: 'Vedic Astrology: An Integrated Approach',
  author: 'P.V.R. Narasimha Rao',
  file: 'vedic-astrology-integrated-approach-narasimha-rao/raw-scans/full-scan.pdf',
  tradition: 'Modern English textbook (Parashari / Jaimini)',
});
const RAJ_KUMAR_CHARISMA = Object.freeze({
  title: 'Charisma of Planets: Timing Events',
  author: 'Raj Kumar',
  file: 'charisma-of-planets-raj-kumar/raw-scans/full-scan.pdf',
  tradition: 'Modern English book on timing (Parashari)',
});
const RAJ_KUMAR_DELINEATING = Object.freeze({
  title: 'Delineating a Horoscope',
  author: 'Raj Kumar',
  file: 'delineating-a-horoscope-raj-kumar/raw-scans/full-scan.pdf',
  tradition: 'Modern English book (Parashari)',
});

// ---------------------------------------------------------------------------
// The four forms — the same houses in every book
// ---------------------------------------------------------------------------

const MOORTHIS = deepFreeze([
  { id: 'SWARNA', houses: [1, 6, 11], ta: 'ஸ்வர்ண மூர்த்தி', metalTa: 'பொன்' },
  { id: 'RAJATA', houses: [2, 5, 9], ta: 'ரஜத மூர்த்தி', metalTa: 'வெள்ளி' },
  { id: 'TAMRA', houses: [3, 7, 10], ta: 'தாம்ர மூர்த்தி', metalTa: 'செம்பு' },
  { id: 'LOHA', houses: [4, 8, 12], ta: 'லோஹ மூர்த்தி', metalTa: 'இரும்பு' },
]);
/** House of the transit Moon from the natal Moon (1-12) → form. */
const moorthiOfHouse = (h) => MOORTHIS.find((m) => m.houses.includes(h)).id;

const GROUP_SOURCES = Object.freeze({
  PULIPPANI: Object.freeze({ ...PULIPPANI, pageLocus: 'Chapter 25 "Moorthy Nirnaya", printed p.219 (PDF 212): "When a planet is entering a new Rasi the Rasi occupied by transit Moon at that moment happens to be 1,6 and 11th from Janma Rasi, the planet is said to be Swarna Moorty (gold)"; 2, 5, 9 Rajatha; 3, 7, 10 Tamra; 8, 4, 12 Loh' }),
  RAJ_KUMAR: Object.freeze({ ...RAJ_KUMAR_CHARISMA, pageLocus: 'Section 6.2 "Moorthy Nirnaya", PDF pp.261-262, Table No.20 "Moorthy Nirnay for Transiting Planets"' }),
  RAJ_KUMAR_DH: Object.freeze({ ...RAJ_KUMAR_DELINEATING, pageLocus: 'Section 2.6 "Moorthy Nirnaya", PDF pp.112-113, Table No.8 "Moorthy Nirnaya for Transiting Planets" (the same table)' }),
  GOUR: Object.freeze({ ...GOUR, pageLocus: '"The Tale of Two Moons — Murti-Nirnaya", printed pp.30-31 (PDF 33-34), the table "Murti / Transit Moon / Remarks" ("reckon from natal Moon"); Saturn entering Leo at 07.12 hrs on 1st November 2006, the Moon in Aquarius, natal Moon Gemini → Rajat' }),
  RAO: Object.freeze({ ...RAO, pageLocus: 'Section 26.2 "Murthis (Forms/Idols)", printed p.306 (PDF 312), Table 62: "Murthis"' }),
  SANTHANAM: Object.freeze({ ...SANTHANAM_JN, pageLocus: 'Chapter 3 commentary, printed pp.152-153 (PDF 159-160): "Moorthi Lakshana ... The classical verse in this regard is" (a Sanskrit verse, its source not named): Swarna 6, 1, 11; Rajata 5, 2, 9; Tamra 7, 3, 10; Loha 8, 4, 12' }),
});

// ---------------------------------------------------------------------------
// What each book says the form means
// ---------------------------------------------------------------------------

/**
 * Pulippani p.219: benefics gold "good results", silver 3/4, copper 1/2, iron
 * 1/4; "But for the malefic planets" silver good, copper 3/4, iron 1/2, gold
 * 1/4. p.335, the note under Table 24: "Malefic planets give very bad results
 * as Swarna Moorthy and very good results as Rajatha Moorthy".
 */
const PULIPPANI_ORDER = deepFreeze({
  BENEFIC: ['SWARNA', 'RAJATA', 'TAMRA', 'LOHA'],
  MALEFIC: ['RAJATA', 'TAMRA', 'LOHA', 'SWARNA'],
});
const PULIPPANI_FRACTION = deepFreeze([1, 0.75, 0.5, 0.25]);
const PULIPPANI_FRACTION_TA = deepFreeze(['முழு நன்மை', '3/4 நன்மை', '1/2 நன்மை', '1/4 நன்மை']);

/**
 * Pulippani's quantum (pp.220, 223, 334): the whole benefit is one unit — half
 * for the ordinary good/bad house ("conventional aspect": good 0.5, bad nil),
 * half shared among the four forms. He prints the forms' share two ways.
 * TABLE (Tables 17 and 23, the list on p.334) is his 1, 3/4, 1/2, 1/4 of the
 * half; LIST (p.220 and the example's "1/2, 1/4, 1/8, 1/16") halves each time.
 * Both are computed and shown; neither is chosen.
 */
const PULIPPANI_QUANTA = deepFreeze({
  conventional: { GOOD: 0.5, BAD: 0 },
  series: {
    TABLE: [0.5, 0.375, 0.25, 0.125],
    LIST: [0.5, 0.25, 0.125, 0.0625],
  },
  seriesTa: {
    TABLE: 'அட்டவணை 17, 23 மற்றும் ப.334 பட்டியல்: 0.5, 0.375, 0.25, 0.125 (அவரது 1, 3/4, 1/2, 1/4 பங்கின் பாதி)',
    LIST: 'ப.220 பட்டியலும் 1998 உதாரணமும்: 0.5, 0.25, 0.125, 0.0625 (1/2, 1/4, 1/8, 1/16)',
  },
  sources: [
    Object.freeze({ ...PULIPPANI, pageLocus: 'Chapter 25, printed p.220 (PDF 213): "If we take the full benefic results as one unit and allot 1/2 unit for special aspect ... Benefic results as per conventional aspect = 0.500; Malefic results as per conventional aspect = Nil; Benefic for Swarna Moorthy = 0.500; Rajatha = 0.250; Thambra = 0.125; Loha = 0.0625"' }),
    Object.freeze({ ...PULIPPANI, pageLocus: 'Chapter 25, printed pp.222-223 (PDF 215-216), Table 17: Rasi / Conventional / Quantum / Special / [Quantum] / Total, for Jupiter entering Kumbha in 1998' }),
    Object.freeze({ ...PULIPPANI, pageLocus: 'Jupiter\'s transit in Gemini, "3. Moorthi Nirnaya", printed p.334 (PDF 327): "(a) Swarna Moorthy - 0.500 (b) Rajatha Moorthy - 0375 (c) Thambra Moorthy - 0.250 (d) Loha Moorthy - 0.125" and Table 23' }),
  ],
});

/** Each book's grade for each form. `null` where the book says nothing. */
const GRADES = deepFreeze({
  RAJ_KUMAR: {
    SWARNA: 'மிகவும் சுபம் (++)', RAJATA: 'ஓரளவு சுபம் (+)', TAMRA: 'ஓரளவு அசுபம் (−)', LOHA: 'மிகவும் அசுபம் (−−)',
    noteTa: 'எந்தக் கிரகத்துக்கும் இதே முறை என்கிறார்; பெரும்பாலோர் சனி, குருவுக்கு மட்டும் பயன்படுத்துவதாகச் சொல்கிறார்.',
    sources: [GROUP_SOURCES.RAJ_KUMAR, GROUP_SOURCES.RAJ_KUMAR_DH],
  },
  GOUR: {
    SWARNA: 'மிகச் சிறந்த பலன்', RAJATA: 'நல்ல பலன் — அந்த அளவுக்குக் கிரகத்தின் பலனை மாற்றும்', TAMRA: null, LOHA: 'மிகக் குறைந்த பலன்',
    noteTa: '"பெயருக்கு ஏற்ற பலன்" என்கிறார்; தாம்ரத்துக்குத் தனியாகச் சொல்லவில்லை. "இதில் வேறு கருத்துகளும் உண்டு; இம்முறையை முயன்று பார்க்கலாம்." எந்தக் கிரகத்துக்கும் செய்யலாம் என்கிறார்.',
    sources: [GROUP_SOURCES.GOUR],
  },
  RAO: {
    SWARNA: 'மிகச் சாதகம் — முழுப் பலன் தரும்', RAJATA: 'சாதகம்', TAMRA: 'பாதகம்', LOHA: 'மிகப் பாதகம்',
    noteTa: 'மூர்த்தி = தங்க, வெள்ளி, செம்பு, இரும்பு "வடிவம்"; அவரது உதாரணம் புதன்.',
    sources: [GROUP_SOURCES.RAO, Object.freeze({ ...RAO, pageLocus: 'Section 26.2, printed p.307 (PDF 313): a loha murthi "is highly unfavorable. Even if it is a favorable transit otherwise, Mercury may not give his full results. If it is an unfavorable transit otherwise, then Mercury will make the native suffer much"' })],
  },
  SANTHANAM: {
    SWARNA: 'சுபம்', RAJATA: 'ஓரளவு சுப பலன்', TAMRA: 'சற்றுத் துன்பம்', LOHA: 'மிகுந்த துன்பம்',
    noteTa: 'நுழையும்போது ஏற்படும் மூர்த்தியே அந்த ராசியில் அதன் பயணம் முழுவதற்கும்.',
    sources: [GROUP_SOURCES.SANTHANAM],
  },
});

/**
 * What the books say when the form meets the ordinary good or bad house. Keyed
 * by house verdict and form; each entry is one book's statement. Only
 * statements the book ties to the house are here (Gour's and Rao's general
 * grades are in GRADES). Pulippani's come from his Jupiter examples (a
 * benefic) — he gives none for malefics.
 */
const P_EX = Object.freeze({ ...PULIPPANI, pageLocus: 'Chapter 25, printed pp.221-222 (PDF 214-215): the 1998 example, Jupiter entering Kumbha, rasi by rasi' });
const P_GE = Object.freeze({ ...PULIPPANI, pageLocus: 'Jupiter\'s transit in Gemini, "3. Moorthi Nirnaya", printed pp.332-333 (PDF 325-326)' });
const RK = [GROUP_SOURCES.RAJ_KUMAR, GROUP_SOURCES.RAJ_KUMAR_DH];
const RAO_LOHA = GRADES.RAO.sources[1];
const COMBINATIONS = deepFreeze({
  GOOD: {
    SWARNA: [
      { book: 'PULIPPANI', benefic: true, textTa: 'நல்ல பலன் கூடும் — "கணிசமாக"', whereTa: 'மேஷம் 11, மிதுனம் 9; ரிஷபம் 2, துலாம் 9', sources: [P_EX, P_GE] },
      { book: 'RAJ_KUMAR', textTa: 'முழு சுப பலன்', sources: RK },
    ],
    RAJATA: [
      { book: 'PULIPPANI', benefic: true, textTa: 'நல்ல பலன் கணிசமாகக் கூடும்', whereTa: 'சிம்மம் 7; கும்பம் 5', sources: [P_EX, P_GE] },
    ],
    TAMRA: [
      { book: 'PULIPPANI', benefic: true, textTa: '"மூர்த்தி பலன் இல்லை"; நல்ல பலன் சற்றுக் குறையும்', whereTa: 'துலாம் 5', sources: [P_EX] },
    ],
    LOHA: [
      { book: 'PULIPPANI', benefic: true, textTa: 'நல்ல பலன் பெரிதும் குறையும்', whereTa: 'மகரம் 2; சிம்மம் 11, தனுசு 7', sources: [P_EX, P_GE] },
      { book: 'RAJ_KUMAR', textTa: 'சுப பலன் கணிசமாகக் குறையும்', sources: RK },
      { book: 'RAO', textTa: 'சாதகமான கோசாரமாக இருந்தாலும் முழுப் பலன் தராமல் போகலாம்', sources: [RAO_LOHA] },
    ],
  },
  BAD: {
    SWARNA: [
      { book: 'PULIPPANI', benefic: true, textTa: 'தீமை பாதிக்கு மேல் குறையும்; "மிகவும் குறையும்"', whereTa: 'விருச்சிகம் 4; மீனம் 4', sources: [P_EX, P_GE] },
      { book: 'RAJ_KUMAR', textTa: 'தீமை கணிசமாகக் குறையும்', sources: RK },
    ],
    RAJATA: [
      { book: 'PULIPPANI', benefic: true, textTa: 'தீமை கணிசமாகக் குறையும்', whereTa: 'கடகம் 12, விருச்சிகம் 8', sources: [P_GE] },
    ],
    TAMRA: [
      { book: 'PULIPPANI', benefic: true, textTa: 'ப.222: தீமை "மேலும் கணிசமாகக் கூடும்" — ஆனால் ப.332: தீமை "சற்றுக் குறையும்", தாம்ரம் நடுத்தர பலன் என்பதால். இரண்டும் அவருடையவை.', whereTa: 'ப.222 கடகம் 8; ப.332 மிதுனம் 1, கன்னி 10, மகரம் 6', sources: [P_EX, P_GE] },
    ],
    LOHA: [
      { book: 'PULIPPANI', benefic: true, textTa: 'தீமை கூடும் — "இரட்டிப்பாகும்"', whereTa: 'ரிஷபம் 10, கன்னி 6; மேஷம் 3', sources: [P_EX, P_GE] },
      { book: 'RAJ_KUMAR', textTa: 'முழுத் தீய பலன்', sources: RK },
      { book: 'RAO', textTa: 'ஜாதகரை மிகவும் துன்புறுத்தும்', sources: [RAO_LOHA] },
    ],
  },
});

/** Words in each book's Moorthi section (English text layer). */
const MOORTHI_RANK = deepFreeze({
  order: ['PULIPPANI', 'RAJ_KUMAR', 'GOUR', 'RAO', 'SANTHANAM'],
  words: { PULIPPANI: 1821, RAJ_KUMAR: 418, GOUR: 329, RAO: 271, SANTHANAM: 222 },
  measureTa: 'மூர்த்தி நிர்ணயப் பகுதியின் சொற்கள்: புலிப்பாணி 1821 (அத்.25 பக்.219-223 — 1044; குரு மிதுனத்தில் அத்தியாயம் பக்.332-335 — 777); ராஜ் குமார் 418 (Charisma of Planets §6.2; Delineating a Horoscope §2.6 அதே அட்டவணை — 279); கௌர் 329 (பக்.30-31); நரசிம்ம ராவ் 271 (பக்.306-307); சந்தானம் 222 (பக்.152-153).',
});

const BOOK_TA = deepFreeze({ PULIPPANI: 'புலிப்பாணி', RAJ_KUMAR: 'ராஜ் குமார்', GOUR: 'கௌர்', RAO: 'நரசிம்ம ராவ்', SANTHANAM: 'சந்தானம்' });

// ---------------------------------------------------------------------------
// Pulippani's printed tables, for the test and the comparison notes
// ---------------------------------------------------------------------------

/**
 * Table 17 as printed (pp.222-223): natal rasi → [conventional, house, form,
 * special quantum, total]. Libra is not printed. Aries' conventional quantum is
 * printed "0300"; Capricorn's form quantum "0.625" and total "0.5625".
 */
const TABLE_17 = deepFreeze({
  moonSign: 0, planet: 'Jupiter', sign: 10,
  rows: {
    0: ['GOOD', 11, 'SWARNA', 0.5, 1.0], 1: ['BAD', 10, 'LOHA', 0.125, 0.125], 2: ['GOOD', 9, 'SWARNA', 0.5, 1.0],
    3: ['BAD', 8, 'TAMRA', 0.25, 0.25], 4: ['GOOD', 7, 'RAJATA', 0.375, 0.875], 5: ['BAD', 6, 'LOHA', 0.125, 0.125],
    7: ['BAD', 4, 'SWARNA', 0.5, 0.5], 8: ['BAD', 3, 'RAJATA', 0.375, 0.375], 9: ['GOOD', 2, 'LOHA', 0.625, 0.5625],
    10: ['BAD', 1, 'TAMRA', 0.25, 0.25], 11: ['BAD', 12, 'RAJATA', 0.375, 0.375],
  },
  printSlips: { missingRasi: 6, ariesConventional: '0300', capricornSpecial: 0.625, capricornTotal: 0.5625 },
});

/** Table 23 (p.334): Jupiter entering Gemini, the transit Moon in Pisces (p.332). Totals as printed. */
const TABLE_23 = deepFreeze({
  moonSign: 11, planet: 'Jupiter', sign: 2,
  rows: {
    0: ['BAD', 3, 'LOHA', 0.125, 0.125], 1: ['GOOD', 2, 'SWARNA', 0.5, 0.5], 2: ['BAD', 1, 'TAMRA', 0.25, 0.25],
    3: ['BAD', 12, 'RAJATA', 0.375, 0.375], 4: ['GOOD', 11, 'LOHA', 0.125, 0.125], 5: ['BAD', 10, 'TAMRA', 0.25, 0.25],
    6: ['GOOD', 9, 'SWARNA', 0.5, 0.5], 7: ['BAD', 8, 'RAJATA', 0.375, 0.375], 8: ['GOOD', 7, 'LOHA', 0.125, 0.125],
    9: ['BAD', 6, 'TAMRA', 0.25, 0.25], 10: ['GOOD', 5, 'RAJATA', 0.375, 0.375], 11: ['BAD', 4, 'SWARNA', 0.5, 0.5],
  },
});

/** Table 24 (p.335): Saturn's form in Taurus for each natal rasi (the transit Moon in Cancer at his entry). Quanta not reproducible. */
const TABLE_24_SATURN = deepFreeze({
  moonSign: 3, planet: 'Saturn', sign: 1,
  forms: { 0: 'LOHA', 1: 'TAMRA', 2: 'RAJATA', 3: 'SWARNA', 4: 'LOHA', 5: 'SWARNA', 6: 'TAMRA', 7: 'RAJATA', 8: 'LOHA', 9: 'TAMRA', 10: 'SWARNA', 11: 'RAJATA' },
});

const TABLE_SOURCES = Object.freeze({
  TABLE_17: PULIPPANI_QUANTA.sources[1],
  TABLE_23: PULIPPANI_QUANTA.sources[2],
  TABLE_24: Object.freeze({ ...PULIPPANI, pageLocus: 'Jupiter\'s transit in Gemini, printed pp.334-335 (PDF 327-328), Table 24 "Jupiter in Gemini / Saturn in Taurus", and its NOTE' }),
  EXAMPLE: Object.freeze({ ...PULIPPANI, pageLocus: 'Chapter 25, printed p.220 (PDF 213): "On 9.1.1998 at 1.38 a.m. Jupiter entered Kumbha from Makara and Moon in Mesha"' }),
});

// ---------------------------------------------------------------------------
// Where the books, and Pulippani's own pages, disagree
// ---------------------------------------------------------------------------

const MOORTHI_DIFFERENCES = deepFreeze([
  {
    id: 'MALEFIC_ORDER',
    textTa: 'பாபக் கிரகங்களுக்குப் புலிப்பாணி மட்டும் வரிசையைத் திருப்புகிறார்: ரஜதம் முழு நன்மை, தாம்ரம் 3/4, லோஹம் 1/2, ஸ்வர்ணம் 1/4 (ப.219); அட்டவணை 24-ன் குறிப்பு (ப.335): பாபர் ஸ்வர்ண மூர்த்தியாக "மிகத் தீய", ரஜத மூர்த்தியாக "மிக நல்ல" பலன். மற்ற நான்கு நூல்களும் எல்லாக் கிரகங்களுக்கும் ஒரே வரிசை (ஸ்வர்ணம் சிறந்தது, லோஹம் தாழ்ந்தது). ராஜ் குமாரின் சனி உதாரணங்களில் சனிக்கு ரஜதம் "நடுத்தரம்", லோஹம் "மிகவும் அசுபம்" — புலிப்பாணிப்படி சனிக்கு ரஜதம் முழு நன்மை, லோஹம் பாதி.',
  },
  {
    id: 'QUANTA_SERIES',
    textTa: 'புலிப்பாணியின் அளவுகள் இரண்டு: ப.220 பட்டியலும் உதாரணமும் 0.5, 0.25, 0.125, 0.0625; அட்டவணை 17, ப.334 பட்டியல், அட்டவணை 23 — 0.5, 0.375, 0.25, 0.125. அட்டவணை 17-ன் மகர வரிசை இரண்டையும் கலக்கிறது: லோஹம் "0.625", மொத்தம் "0.5625" (= 0.5 + 0.0625). இரண்டு அளவுகளும் காட்டப்படுகின்றன.',
  },
  {
    id: 'TABLE_17_PRINT',
    textTa: 'அட்டவணை 17-ல் துலா ராசி வரிசை அச்சாகவில்லை; மேஷத்தின் வழக்கமான அளவு "0300" (மொத்தம் 1.00 என்பதால் 0.500).',
  },
  {
    id: 'TABLE_23_TOTALS',
    textTa: 'அட்டவணை 23 (குரு மிதுனத்தில்): நல்ல இட வரிசைகளின் மொத்தத்தில் வழக்கமான 0.5 சேர்க்கப்படவில்லை (ரிஷபம்: 0.500 + ஸ்வர்ணம் 0.500 → மொத்தம் "0.500"); அட்டவணை 17 சேர்க்கிறது. இந்தப் பக்கம் அட்டவணை 17-ன் கூட்டலைப் பின்பற்றுகிறது.',
  },
  {
    id: 'TABLE_24',
    textTa: 'அட்டவணை 24 (குரு மிதுனம் + சனி ரிஷபம், ஒவ்வொன்றுக்கும் 0.5): மூர்த்திப் பெயர்கள் சரி (குருவுக்குச் சந்திரன் மீனம், சனிக்குக் கடகம்), ஆனால் அளவுகள் ஒத்துவரவில்லை — ரஜதம் "0.3250" (3/4 × 0.25 = 0.1875), குருவின் வழக்கமான 0.250 தீய இடங்களுக்கு அச்சாகியுள்ளது, மொத்தங்கள் கூட்டலுடன் பொருந்தவில்லை. அதனால் இரு கிரக மொத்தம் கணிக்கப்படவில்லை.',
  },
  {
    id: 'EXAMPLE_TEXT',
    textTa: '1998 உதாரணத்தின் உரைநடை (பக்.221-222) அவரது பட்டியலிலிருந்தும் அட்டவணை 17-லிருந்தும் விலகும் இடங்கள்: மிதுனத்துக்குக் குரு "7-ல்" (கும்பம் மிதுனத்துக்கு 9); தீய பலன் பெறும் ஏழு ராசிகளில் மகரம் (மீனத்துக்குப் பதில்); தனுசுக்கு "லோஹம்" (பட்டியல், அட்டவணை: ரஜதம்); "மகரத்துக்கு 12-ல்" (12 என்பது மீனத்துக்கு; மீனம் ரஜதம்). ப.332: "பிறப்புச் சந்திரன் மீனத்தில்" — கோசாரச் சந்திரன் என்பதே பொருள்.',
  },
  {
    id: 'PULIPPANI_MOON',
    textTa: '1998 உதாரணம்: குரு கும்பத்தில் நுழைந்தது 9.1.1998 அதிகாலை 1.38, சந்திரன் மேஷத்தில் என்கிறார். லஹிரி அயனாம்சத்தில் குருவின் நுழைவு 8.1.1998 மாலை 3.51 (இந்திய நேரம்) — சந்திரன் ரிஷபத்தில் நுழைந்து 1.4 மணி நேரம் கழித்து; அவர் தரும் நேரத்திலும் சந்திரன் ரிஷபம் 6°. அவரது மூர்த்திகள் "சந்திரன் மேஷம்" என்பதிலிருந்து சரியாக வருகின்றன. இங்கு கணக்கு ரிஷபம் தருகிறது; "நெருக்கம்" எனக் குறித்து அவரது மூர்த்தியையும் காட்டும்.',
  },
  {
    id: 'RAJ_KUMAR_1958',
    textTa: 'ராஜ் குமாரின் இந்திரா காந்தி உதாரணம்: சனி தனுசில் 9.11.1958, சந்திரன் கன்னி → (மகரச் சந்திரனுக்கு 9) ரஜதம், "நடுத்தர" ஏழரை. லஹிரியில் சனியின் நுழைவு 7.11.1958 மாலை 3.30 — சந்திரன் சிம்மம் 27°28′, 4.2 மணி நேரத்தில் கன்னிக்குச் செல்லும் → (8) லோஹம். இங்கு கணக்கு "நெருக்கம்" எனக் குறித்து ரஜதத்தையும் காட்டும்.',
  },
  {
    id: 'TAMIL_TEXTS',
    textTa: 'புலிப்பாணி (ப.223): இம்முறை "தமிழ் நூல்களில் மட்டுமே விரிவாக" உள்ளது; வடமொழியில் வ்யவஹார ஜ்யோதிஷ ப்ரகாசிகா சனிக்கு மட்டும் தருகிறது. நம்மிடம் உள்ள தமிழ் நூல்களில் (சூடாமணி, ஜாதக அலங்காரம் இரு பதிப்புகள், காலச்சக்கரம், காலப்பிரகாசிகை) மூர்த்தி நிர்ணயம் இல்லை — உலோகச் சொற்கள் கிரகங்களின் உலோகம், தொழில் பற்றியவை மட்டுமே. சந்தானம் ஒரு வடமொழிச் செய்யுளை மேற்கோள் காட்டுகிறார் (நூல் பெயர் இல்லை) — இடங்கள் அதே.',
  },
]);

/** Our readings, labelled on the page. */
const OUR_READINGS_TA = deepFreeze([
  'ஒவ்வொரு நுழைவுக்கும் தனி மூர்த்தி — வக்கிரத்தில் முந்தைய ராசிக்குத் திரும்பும் நுழைவும் உட்பட ("புதிய ராசிக்குச் செல்லும்போது" என்கின்றன நூல்கள்; வக்கிர நுழைவு பற்றி எதுவும் சொல்லவில்லை). வக்கிர நுழைவுகள் குறிக்கப்படுகின்றன.',
  'சந்திரன் விலக்கப்பட்டது: சந்திரன் ராசி மாறும்போது "கோசாரச் சந்திரன்" அதுவே — மூர்த்தி அது நுழையும் இடத்தாலேயே தீர்மானமாகிவிடும்; எந்த நூலும் சந்திரனுக்கு உதாரணம் தரவில்லை.',
  'நல்ல / தீய இடம் ("வழக்கமான முறை"): புலிப்பாணியின் கோசார அட்டவணை (அத்.22) — அவரது மூர்த்தி அத்தியாயம் குருவுக்கு 2, 5, 7, 9, 11 என்று அதையே பயன்படுத்துகிறது. மற்ற நூல்களின் "சாதகமான / பாதகமான இடம்" என்பதற்கும் இதையே காட்டுகிறோம்.',
  'புலிப்பாணியின் சுபர் / பாபர்: சூரியன், செவ்வாய், சனி, ராகு, கேது பாபர்; குரு, சுக்கிரன் சுபர்; புதன் — நுழையும் நேரத்தில் அவருடன் அதே ராசியில் உள்ள கிரகங்களைக் கொண்டு (பார்வை கணிக்கவில்லை), இல்லையெனில் இரண்டும் காட்டப்படும். நட்சத்திரக் கோசாரப் பக்கத்தின் அதே வாசிப்பு.',
  '"நெருக்கம்": கிரகம் 2′ (கலை) நகரும் நேரத்துக்குள் சந்திரன் ராசி மாறினால். நூல்களின் சொந்தக் கணக்குகள் ஒத்துப்போகும் இடங்களில் அவை தரும் நுழைவு நேரம் இங்குள்ளதிலிருந்து 1.1′-க்குள் (ராவ் 0.7′, கௌர் 0.0′, ராஜ் குமார் 2002 — 0.2′, 1.1′); வேறுபடும் இரண்டு உதாரணங்களும் (புலிப்பாணி 0.76′, ராஜ் குமார் 1958 — 1.05′) 2′-க்குள். அப்போது அடுத்த ராசிச் சந்திரனின் மூர்த்தியும் காட்டப்படும் — பஞ்சாங்கம், அயனாம்சம் சிறிது மாறினாலே மூர்த்தி மாறும்.',
]);

/** A planet must move this far (arc-minutes) for the transit Moon's sign to change before the reading is called close. */
const CLOSE_ARCMIN = 2;

module.exports = {
  MOORTHIS, moorthiOfHouse, GROUP_SOURCES, PULIPPANI_ORDER, PULIPPANI_FRACTION, PULIPPANI_FRACTION_TA,
  PULIPPANI_QUANTA, GRADES, COMBINATIONS, MOORTHI_RANK, BOOK_TA, TABLE_17, TABLE_23, TABLE_24_SATURN,
  TABLE_SOURCES, MOORTHI_DIFFERENCES, OUR_READINGS_TA, CLOSE_ARCMIN,
  SOURCES: { RAO, RAJ_KUMAR_CHARISMA, RAJ_KUMAR_DELINEATING },
};
