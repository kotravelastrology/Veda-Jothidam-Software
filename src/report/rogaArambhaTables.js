/**
 * The onset of an illness — the books' statements.
 *
 * "The time a disease begins indicates the outcome of the disease" (Wilhelm). Eight books say it: by
 * the Moon's star at the onset (how long the illness lasts, or that it is fatal), and by combinations
 * of weekday, tithi, karana and the patient's own birth star. Kalaprakasika is the oldest text here;
 * Wilhelm repeats its list and sets Muhurta Chintamani's beside it; Shridhar adds a table of days of
 * trouble for each quarter of the star; the rest give shorter lists. Every cell is as printed.
 * Order by words (owner's rule, 2026-10-03): Wilhelm 681, Shridhar (text 239 + table), Kalaprakasika
 * 356, Muhurta Chintamani 243, Kalyanraman 191, Joshi 180, Raman 134, Rangacharya 98.
 *
 * Stars are 0-26 from Ashwini; weekdays 0 = Sunday; tithis are numbers within a fortnight (4 is both
 * Chaturthis) with `amavasya` for the new moon.
 */

const { KALAPRAKASIKA } = require('./classicSources');
const { BOOKS: { SHRIDHAR_HEA, MC_SHARMA, KALYANRAMAN_V2, JOSHI_KK, RANGACHARYA_I, WILHELM_E, RAMAN_BV } } = require('./muhurtaStarTables');

const deepFreeze = (o) => {
  Object.values(o).forEach((v) => { if (v && typeof v === 'object') deepFreeze(v); });
  return Object.freeze(o);
};

const STAR_COUNT = 27;
const N = Object.freeze({
  Ashwini: 0, Bharani: 1, Krittika: 2, Rohini: 3, Mrigashira: 4, Ardra: 5, Punarvasu: 6, Pushya: 7, Ashlesha: 8, Magha: 9,
  PPhalguni: 10, UPhalguni: 11, Hasta: 12, Chitra: 13, Swati: 14, Vishakha: 15, Anuradha: 16, Jyeshtha: 17, Moola: 18,
  PAshadha: 19, UAshadha: 20, Shravana: 21, Dhanishta: 22, Shatabhisha: 23, PBhadra: 24, UBhadra: 25, Revati: 26,
});
const POORVAS = [N.PPhalguni, N.PAshadha, N.PBhadra];
const [SUN, TUE, SAT] = [0, 2, 6];
const MALEFIC_VARAS = [SUN, TUE, SAT];

// ----------------------------------------------------------------------------------- cells ---
/** A length of illness: [n, unit] pairs, unit one of DAY, NIGHT, FORTNIGHT, MONTH. */
const UNIT_DAYS = { DAY: 1, NIGHT: 1, FORTNIGHT: 15, MONTH: 30 };
const cell = (kind, parts = [], noteTa = null) => ({ kind, parts, noteTa });
const cure = (parts, noteTa) => cell('CURE', parts, noteTa);
const danger = (parts, noteTa) => cell('DANGER', parts, noteTa);
const develop = (n) => cell('DEVELOP', [[n, 'DAY']]);
const DEATH = cell('DEATH');
const LONG = (noteTa) => cell('LONG', [], noteTa);
const HARD = cell('HARD');
const QUICK = cell('QUICK');
const d = (...n) => cure(n.map((x) => [x, 'DAY']));
const nt = (...n) => cure(n.map((x) => [x, 'NIGHT']));
const MONTH = cure([[1, 'MONTH']]);

const partTa = ([n, unit]) => (unit === 'DAY' ? `${n} நாளில்` : unit === 'NIGHT' ? `${n} இரவில்` : unit === 'MONTH' ? 'ஒரு மாதத்தில்' : n === 1 ? 'ஒரு பக்ஷத்தில்' : `${n} பக்ஷத்தில்`);
/** The cell as the page words it. */
function cellTa(c) {
  if (!c) return 'நூலில் இல்லை';
  const span = c.parts.map(partTa).join(' அல்லது ');
  const tail = c.noteTa ? ` — ${c.noteTa}` : '';
  switch (c.kind) {
    case 'CURE': return `${span} குணம்${tail}`;
    case 'DANGER': return `${span} ஆபத்து${tail}`;
    case 'DEVELOP': return `${span} நோய் வளர்ச்சி`;
    case 'DEATH': return 'மரணம் (குணமில்லை)';
    case 'LONG': return `நீண்ட காலம்${tail}`;
    case 'HARD': return 'குணமாவது மிகக் கடினம்';
    case 'QUICK': return 'விரைவில் குணம்';
    default: return '';
  }
}
/** Days, for the date on which the book expects the change (the smaller of two readings first). */
const approxDays = (c) => (c && c.parts.length ? c.parts.map(([n, u]) => n * UNIT_DAYS[u]) : null);

const fill = (pairs) => {
  const a = new Array(STAR_COUNT).fill(null);
  for (const [stars, c] of pairs) for (const s of stars) a[s] = c;
  return a;
};

// ------------------------------------------------------------------------------ the sources ---
const SOURCES = deepFreeze({
  WILHELM: { ...WILHELM_E, pageLocus: 'Medical - Commencement of disease, printed pp.270-272 (PDF 278-280): "The time a disease begins indicates the outcome of the disease"; Nakshatra: "Acute ailments ... beginning under Ardra, Aslesha, Purvaphalguni, Svati, Jyeshtha, Purvashadha, or Purvabhadrapada are generally problematic and require treatment"; the 27 durations from Kalaprakasika with Muhurta Chintamani beside them; Tara, Tithi, Karana, Combinations' },
  SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§22.1 "Onset of illness", printed pp.601-602 (PDF 638-639): "Illness if started in the asterisms of Swati, Jyeshta, Ardra, Ashlesha & 3 Poorvas, the patient meets certain death"; Table 22.1; B.J.S., B.D.R.; Tri-Nadi — and Table 22.2 "Onset & length of illness, donations", printed p.609 (PDF 646)' },
  SHRIDHAR_TABLE: { ...SHRIDHAR_HEA, pageLocus: '§22.1 Table 22.2 "Onset & length of illness, donations", printed p.609 (PDF 646)' },
  KALAPRAKASIKA: { ...KALAPRAKASIKA, pageLocus: 'Chapter XXX "Concerning disease", printed pp.159-160 (PDF 189-190): "Influence of Ast. at the Commencement of a Disease — Fever that begins under Aswini will shake off in nine days; under Bharani, it is cured in five days ..."; the Sunday / Tuesday / Saturday combinations; Janma Nakshatra and the 3rd, 5th, 7th, 10th and 19th asterisms' },
  MC: { ...MC_SHARMA, pageLocus: '"The effects of the beginning of a disease as per the difference of Nakshtras" and "The combination which leads to immediate death at the beginning of the disease", printed pp.79-80 (PDF 83-84)' },
  KR: { ...KALYANRAMAN_V2, pageLocus: '"Nakshatras and their influence on diseases", printed p.201 (PDF 203): "Though not vouched by standard texts it is widely seen that the diseases starting on certain nakshatras have some deep impact on the results"' },
  JOSHI: { ...JOSHI_KK, pageLocus: '§13 "Result of onset or start of disease in various nakshatras", Table 13.1 "Rogotpatti", printed pp.147-148 (PDF 162-163): "(This needs research)"' },
  RAMAN: { ...RAMAN_BV, pageLocus: 'Chapter XV "Medical Elections", PDF pp.52-53: "Crises in acute diseases are marked by the transiting Moon ... The most serious crisis day in acute diseases is on the 14th day when the Moon is in opposition to his place when the disease started"; "Beginning Treatment"' },
  RANGACHARYA: { ...RANGACHARYA_I, pageLocus: '"Medical matters", printed p.133 (PDF 141): "If fever occurs in Aswini, Krittika, Moola, the patient\'s recovery is probable after 9 days ..."' },
});

const BOOK_TA = Object.freeze({
  WILHELM: 'எர்ன்ஸ்ட் வில்ஹெல்ம்',
  SHRIDHAR: 'ஸ்ரீதர் (Hindu Electional Astrology)',
  KALAPRAKASIKA: 'காலப்பிரகாசிகை (என்.பி. சுப்ரமணிய ஐயர்)',
  MC: 'முகூர்த்த சிந்தாமணி (கிரிஷ் சந்த் சர்மா)',
  KR: 'கல்யாணராமன் (முகூர்த்த சங்கிரகம்)',
  JOSHI: 'கே.கே. ஜோஷி',
  RAMAN: 'பி.வி. ராமன் (Muhurtha)',
  RANGACHARYA: 'ரங்காச்சார்யா (முகூர்த்த சிந்து)',
});

// ---------------------------------------------------------------- the lengths of illness ---
/** Kalaprakasika, ch. XXX; Wilhelm gives the same list (Visakha and Anuradha in nights). */
const KALAPRAKASIKA_CELLS = fill([
  [[N.Ashwini], d(9)], [[N.Bharani], d(5)], [[N.Krittika], d(7)], [[N.Rohini], d(21)],
  [[N.Mrigashira], d(5, 9)],
  [[N.Ardra], danger([[5, 'DAY'], [3, 'FORTNIGHT']], 'நூல்: "disastrous"')],
  [[N.Punarvasu], nt(7)], [[N.Pushya], d(8)],
  [[N.Ashlesha], danger([[8, 'DAY']], 'அல்லது நீண்ட காலத்தில்')],
  [[N.Magha], danger([[10, 'NIGHT']], 'அல்லது சந்திரன் மீண்டும் மகத்துக்கு வருமுன்')],
  [[N.PPhalguni], d(21)], [[N.UPhalguni], d(9)], [[N.Hasta], nt(7)],
  [[N.Chitra], cure([[8, 'NIGHT']], 'அல்லது சந்திரன் மீண்டும் சித்திரைக்கு வருமுன்')],
  [[N.Swati], cure([[10, 'NIGHT'], [3, 'FORTNIGHT']])],
  [[N.Vishakha], d(25)], [[N.Anuradha], d(10)], [[N.Jyeshtha], d(12)],
  [[N.Moola], nt(10)], [[N.PAshadha], nt(8)], [[N.UAshadha], MONTH],
  [[N.Shravana], nt(8)], [[N.Dhanishta], nt(10)],
  [[N.Shatabhisha], develop(6)], [[N.PBhadra], develop(12)],
  [[N.UBhadra], cure([[1, 'FORTNIGHT']])], [[N.Revati], d(8)],
]);
const WILHELM_CELLS = KALAPRAKASIKA_CELLS.map((c, i) => (i === N.Vishakha ? nt(25) : i === N.Anuradha ? nt(10) : c));

/** What Wilhelm says Muhurta Chintamani gives, star by star (he gives it for 22 stars). */
const WILHELM_MC_REMARKS = fill([
  [[N.Bharani, N.Chitra, N.Vishakha, N.Shravana, N.Dhanishta, N.Shatabhisha], d(11)],
  [[N.Krittika, N.Moola, N.UBhadra], d(9)],
  [[N.Rohini, N.Pushya], d(7)], [[N.Mrigashira], MONTH], [[N.Hasta], d(15)],
  [[N.Ardra, N.Ashlesha, N.PPhalguni, N.Swati, N.Jyeshtha, N.PAshadha, N.PBhadra], DEATH],
  [[N.Anuradha, N.Revati], LONG('ஜுரம் நீடிக்கும்')],
]);

const MC_CELLS = fill([
  [[N.Swati, N.Jyeshtha, N.PPhalguni, N.PAshadha, N.PBhadra, N.Ardra, N.Ashlesha], DEATH],
  [[N.Revati, N.Anuradha], LONG('ஜுரம் நீடிக்கும்')],
  [[N.Bharani, N.Shravana, N.Shatabhisha, N.Chitra], d(11)],
  [[N.Vishakha, N.Hasta, N.Dhanishta], d(15)],
  [[N.Moola, N.Krittika, N.Ashwini], d(9)],
  [[N.UBhadra, N.UPhalguni, N.Pushya, N.Punarvasu, N.Rohini], d(7)],
  [[N.Mrigashira, N.UAshadha], MONTH],
]);

const KR_CELLS = fill([
  [[N.Swati, N.Jyeshtha, N.PPhalguni, N.PAshadha, N.PBhadra, N.Ardra, N.Ashlesha], HARD],
  [[N.Bharani, N.Shravana, N.Shatabhisha, N.Vishakha, N.Hasta, N.Dhanishta, N.Chitra], cure([[1, 'FORTNIGHT']], 'அதற்குள்')],
  [[N.Revati, N.Anuradha], LONG('குணம் தாமதமாகலாம்')],
  [[N.Moola, N.Krittika, N.Ashwini], QUICK],
  [[N.Magha], LONG('ஒரு மாதத்துக்கு மேல் தாமதம்')],
  [[N.UPhalguni, N.UBhadra, N.Pushya, N.Punarvasu, N.Rohini], d(7)],
  [[N.Mrigashira, N.UAshadha], LONG('குணம் நீளலாம்')],
]);

const JOSHI_CELLS = fill([
  [[N.Swati, N.Jyeshtha, N.PPhalguni, N.PAshadha, N.PBhadra, N.Ardra, N.Ashlesha], DEATH],
  [[N.Revati, N.Anuradha], LONG('"Delayed recovery"')],
  [[N.Bharani, N.Shravana, N.Shatabhisha, N.Chitra], d(11)],
  [[N.Vishakha, N.Hasta, N.Dhanishta], d(15)],
  [[N.Moola, N.Krittika, N.Ashwini], d(9)],
  [[N.Magha], d(20)],
  [[N.UPhalguni, N.UBhadra, N.Pushya, N.Punarvasu, N.Rohini], d(7)],
  [[N.Mrigashira, N.UAshadha], d(30)],
]);

const RANGACHARYA_CELLS = fill([
  [[N.Ashwini, N.Krittika, N.Moola], d(9)],
  [[N.Rohini, N.UBhadra, N.Punarvasu, N.Pushya, N.UPhalguni], d(7)],
  [[N.Magha], d(20)],
  [[N.Shatabhisha, N.Bharani, N.Chitra, N.Shravana], d(11)],
  [[N.Vishakha, N.Hasta, N.Dhanishta], d(15)],
  [[N.Mrigashira, N.UAshadha], MONTH],
  [[N.Revati, N.Anuradha], LONG('"after a pretty long time with much difficulty"')],
]);

/** Shridhar: the table's "days of illness" column (Revati is not in the table; the text says a long time). */
const SHRIDHAR_CELLS = [
  d(9), d(11), d(9), d(7), d(30), DEATH, d(7), d(7), DEATH, d(20), DEATH, d(7), d(15), d(11), DEATH, d(15),
  LONG('"long illness" (அட்டவணை)'), DEATH, d(7), DEATH, d(30), d(11), d(15), d(11), DEATH, d(7), LONG('"cured after a long time" (உரை)'),
];

/**
 * Shridhar's Table 22.2, read from the page image: days of trouble for the 1st-4th quarter of the star, and what
 * to give away. The 0s are as printed; the text does not say what they mean.
 */
const SHRIDHAR_QUARTERS = [
  [[9, 11, 10, 20], 'தங்கம், நெய்'],
  [[0, 80, 40, 11], 'நெய், வெல்லம், சாயாதானம்'],
  [[9, 11, 16, 28], 'தங்கம், பசு'],
  [[7, 9, 18, 30], 'ஏழு தானியம், பசு'],
  [[9, 5, 7, 10], 'அரிசி, தயிர், பசு'],
  [[0, 18, 0, 0], 'கருப்பு எருது, கருப்பு ஆடை'],
  [[7, 14, 2, 21], 'தங்கம், ஆடை, தாமரை'],
  [[7, 7, 20, 21], 'தங்கம், வாற்கோதுமை, மஞ்சள் ஆடை'],
  [[0, 0, 41, 0], 'கருப்புப் பசு, சாயாதானம்'],
  [[15, 7, 17, 20], 'ஆடை, உளுந்து, எள்'],
  [[0, 15, 0, 30], 'தங்கம், பித்தளை, வாற்கோதுமை, பசு'],
  [[7, 14, 7, 60], 'தங்கம், வெள்ளி, பசு, ஆடை, தானியம்'],
  [[15, 17, 15, 0], 'தங்கம், பசு'],
  [[11, 9, 11, 16], 'புள்ளி எருது, எள், வெல்லம், சாயாதானம்'],
  [[60, 17, 30, 0], 'தங்கம், சிவப்புப் பசு, Panchann (அச்சில் வெட்டுப்பட்டுள்ளது)'],
  [[15, 0, 4, 13], 'கருப்பு எருது, சிவப்பு-மஞ்சள் ஆடை, சாயா-பாத்திரம்'],
  [[60, 12, 36, 20], 'தங்கம், பசு, சாயா-பாத்திரம்'],
  [[59, 9, 6, 4], 'தங்கம், எள், நீல ஆடை'],
  [[0, 9, 15, 6], 'பசு, ஆடை, சாயாதானம்'],
  [[0, 15, 24, 10], 'தங்கம், எள், அரிசி, ஆடை, தண்ணீர்க் குடம்'],
  [[30, 24, 26, 16], 'தங்கம், சமைக்காத தானியம்'],
  [[60, 24, 6, 9], 'தங்கம், வாற்கோதுமை, சாயாதானம்'],
  [[15, 4, 20, 21], 'தங்கம், பசு, குதிரை, காலணி, குடை'],
  [[0, 45, 3, 2], 'தங்கம், குதிரை, எள், தானியம், தண்ணீர்க் குடம், சாயாதானம்'],
  [[0, 12, 21, 19], 'தங்கம், வெள்ளி, வெள்ளை ஆடை, சாயாதானம்'],
  [[10, 2, 9, 15], 'தங்கம், வெள்ளி, எள், கருப்பு ஆடை'],
  null,
].map((r) => (r ? { quarters: r[0], donationTa: r[1] } : null));

/** The words in Shridhar's table (name, days, four numbers, the items) plus his text, §22.1. */
const SHRIDHAR_TABLE_WORDS = SHRIDHAR_QUARTERS.filter(Boolean).reduce((s, r) => s + 6 + r.donationTa.split(/[\s,]+/).filter(Boolean).length, 0);

const WORDS = Object.freeze({
  WILHELM: 681, SHRIDHAR: 239 + SHRIDHAR_TABLE_WORDS, KALAPRAKASIKA: 356, MC: 243, KR: 191, JOSHI: 180, RAMAN: 134, RANGACHARYA: 98,
});
const ORDER = Object.freeze(Object.keys(WORDS).sort((a, b) => WORDS[b] - WORDS[a]));

// ------------------------------------------------------------------ the stars with a flag ---
/** Lists that mark a star without giving a length. */
const FLAGS = deepFreeze({
  WILHELM: { NEEDS_TREATMENT: [N.Ardra, N.Ashlesha, N.PPhalguni, N.Swati, N.Jyeshtha, N.PAshadha, N.PBhadra] },
  RAMAN: { NEEDS_TREATMENT: [N.PPhalguni, N.PAshadha, N.PBhadra, N.Ashlesha, N.Jyeshtha, N.Ardra, N.Swati] },
  RANGACHARYA: { FATAL: [N.PPhalguni, N.PAshadha, N.PBhadra, N.Ashlesha, N.Bharani, N.Shatabhisha] },
  SHRIDHAR: { SNAKE: [N.Krittika, N.Vishakha, N.Ardra, N.Magha, N.Moola, N.Bharani, N.Ashlesha] },
  MC: { SNAKE: [N.Bharani, N.Ashlesha, N.Moola, N.Krittika, N.Vishakha, N.Ardra, N.Magha] },
  KR: { SNAKE: [N.Bharani, N.Ashlesha, N.Moola, N.Krittika, N.Vishakha, N.Ardra, N.Magha] },
  JOSHI: { SNAKE: [N.Bharani, N.Ashlesha, N.Moola, N.Krittika, N.Vishakha, N.Ardra, N.Magha] },
});
const FLAG_TA = Object.freeze({
  NEEDS_TREATMENT: 'சிகிச்சை அவசியம்',
  FATAL: 'மரணத் தருவாய் நட்சத்திரம்',
  SNAKE: 'இதில் பாம்புக்கடி — மரணம்',
});

// --------------------------------------------------------------------------- combinations ---
const STHIRA_KARANAS = Object.freeze(['Kimstughna', 'Shakuni', 'Chatushpada', 'Naga']);
const KP_ALTS = deepFreeze([
  { varas: [SUN], tithis: [4], stars: [N.Ardra, N.Ashlesha, N.Magha] },
  { varas: [TUE], tithis: [9], stars: [N.Swati, N.Jyeshtha, N.Bharani] },
  { varas: [SAT], tithis: [14], stars: [N.PPhalguni, N.PAshadha, N.PBhadra] },
]);
const SHRIDHAR_KP_ALTS = deepFreeze([
  KP_ALTS[0],
  { varas: [TUE], tithis: [9], stars: [N.Swati, N.Jyeshtha, N.Magha] },
  KP_ALTS[2],
]);
const TARA_FIVE = Object.freeze([1, 3, 5, 7, 10, 19]);
const TITHI_SIX = Object.freeze([4, 9, 14, 6, 8, 12]);
const MC_COMBO_STARS = Object.freeze([N.Bharani, N.Krittika, N.Ardra, N.Ashlesha, N.PPhalguni, N.Vishakha, N.Jyeshtha, N.PAshadha, N.Dhanishta, N.Shatabhisha, N.PBhadra]);
const KR_COMBO_STARS = Object.freeze([N.Ardra, N.Ashlesha, N.Jyeshtha, N.Shatabhisha, N.Bharani, N.PPhalguni, N.PAshadha, N.PBhadra, N.Vishakha, N.Krittika]);

/**
 * Rules that need more than the star. `any` is a list of alternatives, each of which needs every one of its
 * conditions; a bare `when` is one such alternative. `needs: 'NATAL'` rules need the patient's birth star;
 * `needs: 'BITE'` rules apply only when the illness is a snake or insect bite.
 */
const RULES = deepFreeze([
  { id: 'KP_COMBO', book: 'KALAPRAKASIKA', severity: 'DISASTER', any: KP_ALTS,
    textTa: 'ஞாயிறு + சதுர்த்தி + திருவாதிரை / ஆயில்யம் / மகம்; செவ்வாய் + நவமி + சுவாதி / கேட்டை / பரணி; சனி + சதுர்த்தசி + பூரம் / பூராடம் / பூரட்டாதி — பேரிழப்பான முடிவு' },
  { id: 'KP_TITHI', book: 'KALAPRAKASIKA', severity: 'DISASTER', when: { tithis: TITHI_SIX, amavasya: true },
    textTa: 'சதுர்த்தி, நவமி, சதுர்த்தசி, சஷ்டி, அஷ்டமி, துவாதசி, அமாவாசை — அதே பேரிழப்பான முடிவு' },
  { id: 'KP_KARANA', book: 'KALAPRAKASIKA', severity: 'HARM', when: { karanas: 'STHIRA_VISHTI' },
    textTa: 'ஸ்திர கரணங்களிலும் விஷ்டி கரணத்திலும் தொடங்கும் நோய் பெருந்தீங்கு செய்யும்' },
  { id: 'KP_TARA', book: 'KALAPRAKASIKA', severity: 'DISTRESS', needs: 'NATAL', when: { tara: TARA_FIVE },
    textTa: 'ஜன்ம நட்சத்திரம், அதிலிருந்து 3, 5, 7, 10, 19-ஆம் நட்சத்திரத்தில் தொடங்கும் நோய் இழப்பையும் துன்பத்தையும் தரும்' },
  { id: 'W_TARA', book: 'WILHELM', severity: 'DISTRESS', needs: 'NATAL', when: { tara: TARA_FIVE },
    textTa: 'ஜன்ம நட்சத்திரம், 3, 5, 7, 10, 19-ஆம் நட்சத்திரத்தில் தொடங்கும் நோய் மிகுந்த துன்பம் தரும்' },
  { id: 'W_TITHI', book: 'WILHELM', severity: 'TROUBLE', when: { tithis: TITHI_SIX, amavasya: true },
    textTa: '4, 9, 14, 6, 8, 12-ஆம் திதி, அமாவாசையில் தொடங்கும் நோய் பெருந்தொல்லையை நோக்கிச் செல்லும்' },
  { id: 'W_KARANA', book: 'WILHELM', severity: 'HARM', when: { karanas: 'STHIRA_VISHTI' },
    textTa: 'ஸ்திர கரணம் அல்லது விஷ்டி கரணத்தில் தொடங்கும் நோய் பெருந்தீங்கு செய்யும்' },
  { id: 'W_KP_COMBO', book: 'WILHELM', severity: 'DISASTER', any: KP_ALTS,
    textTa: 'காலப்பிரகாசிகையின் மூன்று சேர்க்கைகள் (ஞாயிறு-4-திருவாதிரை/ஆயில்யம்/மகம்; செவ்வாய்-9-சுவாதி/கேட்டை/பரணி; சனி-14-பூரம்/பூராடம்/பூரட்டாதி) — பேரிழப்பான முடிவு' },
  { id: 'W_MC_COMBO', book: 'WILHELM', severity: 'DEATH', when: { stars: MC_COMBO_STARS, varas: MALEFIC_VARAS, tithis: [4, 9, 14, 6, 12] },
    textTa: 'முகூர்த்த சிந்தாமணி: பரணி, கார்த்திகை, திருவாதிரை, ஆயில்யம், பூரம், விசாகம், கேட்டை, பூராடம், அவிட்டம், சதயம், பூரட்டாதி + ஞாயிறு / செவ்வாய் / சனி + 4, 9, 14, 6, 12-ஆம் திதி — விரைவில் மரணம்; இவை சிகிச்சை கட்டாயம்' },
  { id: 'MC_COMBO', book: 'MC', severity: 'DEATH', when: { stars: MC_COMBO_STARS, varas: MALEFIC_VARAS, tithis: [4, 9, 14, 12, 6] },
    textTa: 'பரணி, கார்த்திகை, திருவாதிரை, ஆயில்யம், பூரம், விசாகம், கேட்டை, பூராடம், அவிட்டம், சதயம், பூரட்டாதி + ஞாயிறு / செவ்வாய் / சனி + 4, 9, 14, 12, 6-ஆம் திதி — நோயாளி விரைவில் இறப்பார்' },
  { id: 'KR_COMBO', book: 'KR', severity: 'REMOTE', when: { stars: KR_COMBO_STARS, varas: MALEFIC_VARAS, tithis: [4, 6, 9, 12, 14] },
    textTa: 'திருவாதிரை, ஆயில்யம், கேட்டை, சதயம், பரணி, பூரம், பூராடம், பூரட்டாதி, விசாகம், கார்த்திகை + ஞாயிறு / செவ்வாய் / சனி + 4, 6, 9, 12, 14-ஆம் திதி — குணம் தொலைவில் ("a belief")' },
  { id: 'J_COMBO', book: 'JOSHI', severity: 'DEATH', when: { stars: KR_COMBO_STARS, varas: MALEFIC_VARAS, tithis: [4, 6, 9, 12, 14] },
    textTa: 'திருவாதிரை, ஆயில்யம், கேட்டை, சதயம், பரணி, பூரம், பூராடம், பூரட்டாதி, விசாகம், கார்த்திகை + ஞாயிறு / செவ்வாய் / சனி + 4, 6, 9, 12, 14-ஆம் திதி — நோயாளி பிழைக்க மாட்டார் அல்லது நோய் கடுமையாக இருக்கும்' },
  { id: 'R_COMBO', book: 'RAMAN', severity: 'TREATMENT', any: KP_ALTS,
    textTa: 'ஞாயிறு + 4-ஆம் திதி + திருவாதிரை / ஆயில்யம் / மகம்; செவ்வாய் + 9 + கேட்டை / சுவாதி / பரணி; சனி + 14 + பூரம் / பூராடம் / பூரட்டாதி — படுக்கையில் விழுந்தால் சிகிச்சை முற்றிலும் அவசியம்' },
  { id: 'R_TARA', book: 'RAMAN', severity: 'DISTRESS', needs: 'NATAL', when: { tara: [1, 3, 5, 7] },
    textTa: 'ஜன்ம நட்சத்திரம், அதிலிருந்து 3, 5, 7-ஆம் நட்சத்திரத்தில் தொடங்கும் நோய் மிகுந்த துன்பம் தரும்' },
  { id: 'S_KP_COMBO', book: 'SHRIDHAR', severity: 'DISASTER', any: SHRIDHAR_KP_ALTS,
    textTa: 'K.P. அட்டவணை 22.1: ஞாயிறு + 4 + திருவாதிரை / ஆயில்யம் / மகம்; செவ்வாய் + 9 + சுவாதி / கேட்டை / மகம் (அச்சில் உள்ளபடி — மற்ற நூல்களில் பரணி); சனி + 14 + பூரம் / பூராடம் / பூரட்டாதி' },
  { id: 'S_BJS', book: 'SHRIDHAR', severity: 'DEATH', when: { stars: [N.Swati, N.Ashlesha, N.Ardra, N.Jyeshtha, ...POORVAS], varas: MALEFIC_VARAS, tithis: [4, 9, 14] },
    textTa: 'B.J.S.: செவ்வாய் / ஞாயிறு / சனி + சுவாதி, ஆயில்யம், திருவாதிரை, கேட்டை, மூன்று பூர நட்சத்திரம் + ரிக்த திதி (4, 9, 14) — நிச்சயம் மரணம்' },
  { id: 'S_BDR', book: 'SHRIDHAR', severity: 'DEATH', when: { stars: [N.Ashlesha, N.Shatabhisha, N.Ardra, N.Dhanishta, ...POORVAS, N.Krittika, N.Bharani], varas: MALEFIC_VARAS, tithis: [4, 8, 12] }, daysAssumed: true,
    textTa: 'B.D.R.: ஆயில்யம், சதயம், திருவாதிரை, அவிட்டம், மூன்று பூர நட்சத்திரம், கார்த்திகை, பரணி + "தீய கிழமைகள்" + 4, 8, 12-ஆம் திதி — மரணம் (எந்தக் கிழமைகள் என்று நூல் சொல்லவில்லை; ஞாயிறு, செவ்வாய், சனி என்பது எங்கள் வாசிப்பு)' },
  { id: 'S_NADI', book: 'SHRIDHAR', severity: 'DEATH', needs: 'NATAL', when: { nadi: true },
    textTa: 'ஜன்ம நட்சத்திரம், அப்போதைய சூரிய நட்சத்திரம், சந்திர நட்சத்திரம் மூன்றும் ஒரே திரி-நாடியில் (அட்டவணை 18.22) விழுந்தால் நிச்சயம் மரணம்' },
  { id: 'MC_SNAKE', book: 'MC', severity: 'DEATH', needs: 'BITE', when: { stars: FLAGS.MC.SNAKE },
    textTa: 'பாம்பு கடித்தால் (பரணி, ஆயில்யம், மூலம், கார்த்திகை, விசாகம், திருவாதிரை, மகம்) மரணம்; கடித்த நாளில் கோசாரப்படி சந்திரன் பலமாக இருந்தால் மரணம் இல்லை (குறிப்பு — கணிக்கப்படவில்லை)' },
  { id: 'KR_SNAKE', book: 'KR', severity: 'DEATH', needs: 'BITE', when: { stars: FLAGS.KR.SNAKE },
    textTa: 'நச்சுப் பூச்சி / ஊர்வன கடி இந்த ஏழு நட்சத்திரங்களில் உயிருக்கு ஆபத்து' },
  { id: 'J_SNAKE', book: 'JOSHI', severity: 'DEATH', needs: 'BITE', when: { stars: FLAGS.JOSHI.SNAKE },
    textTa: 'பாம்பு கடித்தால் இறப்பார்' },
  { id: 'S_SNAKE', book: 'SHRIDHAR', severity: 'DEATH', needs: 'BITE', when: { stars: FLAGS.SHRIDHAR.SNAKE },
    textTa: 'B.J.S.: கார்த்திகை, விசாகம், திருவாதிரை, மகம், மூலம், பரணி, ஆயில்யத்தில் பாம்பு கடித்தால் நிச்சயம் மரணம்' },
]);

/** Table 18.22 of Shridhar: the three nadis (Adi 'wind', Madhya 'bile', Antya 'phlegm'). */
const NADI = Object.freeze({
  ADI: [N.Ashwini, N.Ardra, N.Punarvasu, N.UPhalguni, N.Hasta, N.Jyeshtha, N.Moola, N.Shatabhisha, N.PBhadra],
  MADHYA: [N.Bharani, N.Mrigashira, N.Pushya, N.PPhalguni, N.Chitra, N.Anuradha, N.PAshadha, N.Dhanishta, N.UBhadra],
  ANTYA: [N.Krittika, N.Rohini, N.Ashlesha, N.Magha, N.Swati, N.Vishakha, N.UAshadha, N.Shravana, N.Revati],
});
const nadiOf = (star) => Object.keys(NADI).find((k) => NADI[k].includes(star));

// --------------------------------------------------------------------- the books disagree ---
const DIFFERENCES = deepFreeze([
  { id: 'MOOLA', textTa: 'மூலம்: ஸ்ரீதரின் அட்டவணை 7 நாள்; முகூர்த்த சிந்தாமணி, ஜோஷி, ரங்காச்சார்யா 9 நாள்; காலப்பிரகாசிகை, வில்ஹெல்ம் 10 இரவு.' },
  { id: 'MAGHA', textTa: 'மகம்: முகூர்த்த சிந்தாமணி ஒன்றும் சொல்லவில்லை; காலப்பிரகாசிகை, வில்ஹெல்ம் "ஆபத்து" (10 இரவு அல்லது சந்திரன் திரும்பும் வரை); ஸ்ரீதர், ஜோஷி, ரங்காச்சார்யா 20 நாள்; கல்யாணராமன் ஒரு மாதத்துக்கு மேல்.' },
  { id: 'DEATH_LISTS', textTa: 'மரண நட்சத்திரங்கள்: முகூர்த்த சிந்தாமணி, ஜோஷி, ஸ்ரீதர் — சுவாதி, கேட்டை, மூன்று பூரங்கள், திருவாதிரை, ஆயில்யம். காலப்பிரகாசிகை, வில்ஹெல்ம் இவற்றுக்கு 21 / 10 இரவு / 12 / 8 இரவு எனக் குணமாகும் காலம் தருகின்றன; கல்யாணராமன் "குணமாவது கடினம்" என்கிறார்; ரங்காச்சார்யாவின் மரணத் தருவாய் பட்டியலில் திருவாதிரை, சுவாதி, கேட்டை இல்லை, பரணி, சதயம் உண்டு.' },
  { id: 'WILHELM_MC', textTa: 'முகூர்த்த சிந்தாமணி என்று வில்ஹெல்ம் தருவது அந்த நூலின் சொந்த சுலோகத்துடன் மூன்று இடத்தில் வேறுபடுகிறது: விசாகம் (வில்ஹெல்ம் 11 நாள், நூல் 15), அவிட்டம் (11 / 15), உத்திரட்டாதி (9 / 7); உத்திரம் (நூல் 7 நாள்) பற்றி வில்ஹெல்ம் எதுவும் சொல்லவில்லை. இங்கே இரண்டும் அவரவர் பக்கத்தில்.' },
  { id: 'TUESDAY_MAGHA', textTa: 'செவ்வாய் + 9-ஆம் திதியின் மூன்றாவது நட்சத்திரம்: ஸ்ரீதரின் அட்டவணை 22.1 "மகம்" என்று அச்சிட்டுள்ளது; காலப்பிரகாசிகை, வில்ஹெல்ம், ராமன் "பரணி". ஸ்ரீதரின் பக்கத்தில் அச்சில் உள்ளபடி.' },
  { id: 'COMBO_STARS', textTa: 'ஞாயிறு-செவ்வாய்-சனி சேர்க்கை: முகூர்த்த சிந்தாமணி 11 நட்சத்திரம் (அவிட்டம் உட்பட; திதி 4, 9, 14, 12, 6); ஜோஷி, கல்யாணராமன் 10 (அவிட்டம் இல்லை; திதி 4, 6, 9, 12, 14).' },
  { id: 'TARA', textTa: 'தாரை: காலப்பிரகாசிகை, வில்ஹெல்ம் — ஜன்மம், 3, 5, 7, 10, 19; ராமன் — ஜன்மம், 3, 5, 7.' },
  { id: 'RANGA_SELF', textTa: 'ரங்காச்சார்யா ஒரே பக்கத்தில் பரணி, சதயத்துக்கு 11 நாள் குணம் என்றும், அவற்றை மரணத் தருவாய் நட்சத்திரம் என்றும் சொல்கிறார்; "Uttara" என்பதை உத்திரம் (பல்குனி) என்று படிக்கிறோம் (முகூர்த்த சிந்தாமணியிலும் 7 நாள்).' },
  { id: 'UNITS', textTa: 'விசாகம், அனுராதா: காலப்பிரகாசிகை "நாள்", வில்ஹெல்ம் "இரவு".' },
  { id: 'SHRIDHAR_TABLE', textTa: 'ஸ்ரீதரின் அட்டவணை 22.2: ரேவதி வரிசை அச்சில் இல்லை (உரை "நீண்ட காலம்" என்கிறது); உரை சொல்லும் மந்திர ஜபக் கணக்கு அட்டவணையில் இல்லை; கால் வாரியான நாட்களில் உள்ள 0-களுக்கு விளக்கம் இல்லை.' },
  { id: 'BOOK_CAUTION', textTa: 'இரு ஆசிரியர்கள் தாங்களே எச்சரிக்கிறார்கள்: கல்யாணராமன் "Though not vouched by standard texts", ஜோஷி "This needs research".' },
]);

const OUR_READINGS_TA = Object.freeze([
  'ஒவ்வொரு நூலும் தனித் தனி; இங்கே எந்த நூலும் வேறொன்றுடன் கலக்கப்படவில்லை. அட்டவணையில் "அச்சில் உள்ளபடி" என்பது நூலின் சொற்களின் தமிழ்ச் சுருக்கம்.',
  'நட்சத்திரம் = நோய் தொடங்கிய கணத்தில் சந்திரன் இருக்கும் நட்சத்திரம்; திதி, கரணம், நட்சத்திரம் வானியல் கணக்கு; கிழமை சூரிய உதயத்தில் தொடங்குகிறது (இடம், நேரம் தேவை).',
  'திதி எண் (4, 9, 14 …) இரு பக்ஷத்துக்கும்; நூல்கள் பக்ஷம் சொல்லவில்லை. அமாவாசை தனியாக.',
  'இரவு, நாள், பக்ஷம் ஆகியவை தேதி கணக்கில் நாளாகவே எண்ணப்படுகின்றன (ஒரு பக்ஷம் = 15 நாள், ஒரு மாதம் = 30 நாள்); "அல்லது" என்று இரு மதிப்பு இருந்தால் இரண்டும் காட்டப்படும்.',
  'ஸ்ரீதரின் B.D.R. "தீய கிழமைகள்" என்று மட்டும் சொல்வதால் ஞாயிறு, செவ்வாய், சனி என்று எடுத்துள்ளோம்.',
  'ராமன் சொல்லும் "14-ஆம் நாள் நெருக்கடி" — சந்திரன் நோய் தொடங்கிய இடத்துக்கு நேர் எதிரே வரும் நேரம் — எங்கள் கணக்கு; நூல் நேரத்தைத் தரவில்லை.',
  'முகூர்த்த சிந்தாமணி: பாம்பு கடித்த நாளில் சந்திரன் கோசாரத்தில் பலமாக இருந்தால் மரணம் இல்லை — இது கணிக்கப்படவில்லை.',
  'பாம்பு / பூச்சிக்கடி விதிகள் "கடி" எனத் தேர்ந்தால் மட்டுமே; ஜன்ம நட்சத்திர விதிகள் பிறப்பு விவரம் இருந்தால் மட்டுமே.',
  'இது நோயின் முடிவைச் சொல்லும் முன்கணிப்பு அல்ல; நூல்களின் கூற்றுகளின் ஒப்பீடு. மருத்துவ ஆலோசனைக்கு மாற்று அல்ல.',
]);

module.exports = {
  STAR_COUNT, N, SOURCES, BOOK_TA, ORDER, WORDS, SHRIDHAR_TABLE_WORDS,
  KALAPRAKASIKA_CELLS, WILHELM_CELLS, WILHELM_MC_REMARKS, MC_CELLS, KR_CELLS, JOSHI_CELLS, RANGACHARYA_CELLS, SHRIDHAR_CELLS, SHRIDHAR_QUARTERS,
  FLAGS, FLAG_TA, RULES, NADI, nadiOf, STHIRA_KARANAS, DIFFERENCES, OUR_READINGS_TA, UNIT_DAYS,
  cellTa, approxDays,
};
