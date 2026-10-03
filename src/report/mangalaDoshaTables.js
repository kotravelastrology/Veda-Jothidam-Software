/**
 * Mangala (Kuja) dosha — what each book says, and where.
 *
 * ## Why four readings and not one
 *
 * The rule the repo carried before (`doshas.js`: Mars in 1/2/4/7/8/12 from
 * Lagna or Moon) is a "popular convention" with no page behind it. The books
 * were read on 2026-10-02 and they do not state one rule:
 *
 *   Mansagari (a classical verse)   1, 4, 7, 8, 12 from the Ascendant — no 2nd.
 *   Vishnu Bhaskar                  *contradicts himself.* His chapter summary
 *                                   (printed p.94) gives 1, 4, 7, 8, 12 from Lagna,
 *                                   Moon and Venus and four malefics (no Sun);
 *                                   four pages later (p.98) the list is 12, 1, 2,
 *                                   4, 7, 8 and five malefics; and p.99 adds "in
 *                                   S. India the 2nd is taken in [Lagna's] place",
 *                                   i.e. 2, 4, 7, 8, 12.
 *   S.P. Bhagat                     1, 2, 4, 7, 8, 12 from Lagna, Moon or Venus.
 *
 * So the five-house classical rule, the six-house popular rule and the South
 * Indian variant are all shown, each with its page, and none is called "the"
 * rule. The Tamil texts held (Sudamani, Kalaprakasika, Jathaka Alangaram,
 * Kalachakram) state no Mangala rule at all, so no Tamil reading is invented;
 * the South Indian variant is Vishnu Bhaskar's statement about South India, not
 * a Tamil text's.
 *
 * ## Two kinds of cancellation text
 *
 * Mansagari's *verse* is the classical statement. The list of cancellations
 * beside it is the **translator's own gathering** — he says it is culled from
 * "various savants and sages" and "not sacrosanct". The same caution applies to
 * every list here: they are practitioners' compilations, and several contradict
 * one another (Mansagari: Mars *aspected by malefics* cancels; Bhagat: Mars
 * aspected by Sun, Mercury, Saturn or Rahu cancels; Vishnu Bhaskar: Jupiter
 * with or aspecting Mars cancels "per the classics" but "experience shows" it
 * increases the dosha). They are therefore evaluated per source and never
 * merged into a single verdict.
 *
 * Tables are embedded here (Next replaces `__dirname`); the transcription is in
 * `fixtures/mangala-dosha/definitions.json` and the test asserts they agree.
 */

const { SOURCES: SATURN_SOURCES } = require('./saturnTransitTables');

const deepFreeze = (o) => {
  Object.values(o).forEach((v) => { if (v && typeof v === 'object') deepFreeze(v); });
  return Object.freeze(o);
};

const VISHNU_BHASKAR = SATURN_SOURCES.VISHNU_BHASKAR;

const MANSAGARI = Object.freeze({
  title: 'Maansagari, Volume II',
  author: 'Harji (original); P.K. Vasudev (English translation and commentary)',
  file: 'mansagari-vol2-vasudev/raw-scans/full-scan.pdf',
  tradition: 'Parashari (classical Sanskrit verse with modern commentary)',
});

const BHAGAT = Object.freeze({
  title: 'Practical Astrological Remedies',
  author: 'S.P. Bhagat',
  file: 'practical-astrological-remedies-bhagat/raw-scans/full-scan.pdf',
  tradition: 'Parashari / popular remedies (modern)',
});

/** Vishnu Bhaskar's Chapter 9 in the curated scan: printed 98 = PDF page 12 of volume-1 part 02. */
const VB9 = 'Chapter 9 §VII Graha Compatibility (Kuja Dosha)';
const VB_PAGE_HOUSES = `${VB9}, printed p.98 (PDF page 12 of volume-1 part 02)`;
const VB_PAGE_INTENSITY = `${VB9}, printed p.99 (PDF page 13 of volume-1 part 02)`;
const VB_PAGE_MITIGATION = `${VB9}, printed p.100 (PDF page 14 of volume-1 part 02)`;

/**
 * The formation rule, per source. `references` are the points the houses are
 * counted from; Mars is the dosha-maker in all of them (Vishnu Bhaskar also
 * counts Sun, Saturn, Rahu and Ketu, which the engine reports separately).
 */
const READINGS = deepFreeze({
  MANSAGARI: {
    id: 'MANSAGARI',
    label: 'Mansagari (1, 4, 7, 8, 12 from Lagna)',
    labelTa: 'மானசாகரி — லக்னத்திலிருந்து 1, 4, 7, 8, 12',
    houses: [1, 4, 7, 8, 12],
    references: ['LAGNA'],
    otherMalefics: [],
    classical: true,
    note: 'A classical verse. Says nothing of the 2nd house, nor of the Moon or Venus as the point of count.',
    source: { ...MANSAGARI, pageLocus: `printed p.794 (PDF 229), verse 4: "लग्ने व्यये च पाताले यामित्रे चाष्टमे कुजः" — Mars in the Ascendant, the 12th, the 4th, the 7th or the 8th` },
  },
  VISHNU_BHASKAR_SUMMARY: {
    id: 'VISHNU_BHASKAR_SUMMARY',
    label: 'Vishnu Bhaskar, chapter summary (1, 4, 7, 8, 12 from Lagna, Moon, Venus)',
    labelTa: 'விஷ்ணு பாஸ்கர் — அத்தியாயச் சுருக்கம்: 1, 4, 7, 8, 12; லக்னம், சந்திரன், சுக்கிரனிலிருந்து',
    houses: [1, 4, 7, 8, 12],
    references: ['LAGNA', 'MOON', 'VENUS'],
    otherMalefics: ['Saturn', 'Rahu', 'Ketu'],
    classical: false,
    note: 'The same book\'s own summary of the rule, four pages before the detailed list that adds the 2nd house and the Sun. The two cannot both be the rule.',
    source: { ...VISHNU_BHASKAR, pageLocus: `Chapter 9 §II.2 Planetary Compatibility, printed p.94 (PDF page 8 of volume-1 part 02): "Kuja Dosha: Mars, Saturn, Rahu or Ketu in Lagna, 4H, 7H, 8H or in 12H from Lagna, Moon Lagna or Venus"` },
  },
  VISHNU_BHASKAR: {
    id: 'VISHNU_BHASKAR',
    label: 'Vishnu Bhaskar (12, 1, 2, 4, 7, 8 from Lagna, Moon, Venus)',
    labelTa: 'விஷ்ணு பாஸ்கர் — 12, 1, 2, 4, 7, 8; லக்னம், சந்திரன், சுக்கிரனிலிருந்து',
    houses: [1, 2, 4, 7, 8, 12],
    references: ['LAGNA', 'MOON', 'VENUS'],
    otherMalefics: ['Sun', 'Saturn', 'Rahu', 'Ketu'],
    classical: false,
    note: 'A modern compilation. Counts the Sun, Saturn, Rahu and Ketu as well as Mars.',
    source: { ...VISHNU_BHASKAR, pageLocus: `${VB_PAGE_HOUSES}: "Sun, Mars, Saturn, Rahu or Ketu in 12 H, Lagna, 2H, 4H, 7H or in 8H give rises to Kuja Dosha ... seen from Lagna, Moon Lagna and Venus"` },
  },
  VISHNU_BHASKAR_SOUTH: {
    id: 'VISHNU_BHASKAR_SOUTH',
    label: 'South India per Vishnu Bhaskar (2, 4, 7, 8, 12)',
    labelTa: 'தென்னிந்திய முறை (விஷ்ணு பாஸ்கர்) — 2, 4, 7, 8, 12',
    houses: [2, 4, 7, 8, 12],
    references: ['LAGNA', 'MOON', 'VENUS'],
    otherMalefics: ['Sun', 'Saturn', 'Rahu', 'Ketu'],
    classical: false,
    note: 'Vishnu Bhaskar says South India takes the 2nd house in place of Lagna, and advises considering both. This is his statement about a regional practice, not a Tamil text.',
    source: { ...VISHNU_BHASKAR, pageLocus: `${VB_PAGE_INTENSITY}: "In N. India Lagna is taken as relevant house and in S. India 2H is taken in its place"` },
  },
  BHAGAT: {
    id: 'BHAGAT',
    label: 'Bhagat (1, 2, 4, 7, 8, 12 from Lagna, Moon, Venus)',
    labelTa: 'பகத் — 1, 2, 4, 7, 8, 12; லக்னம், சந்திரன், சுக்கிரனிலிருந்து',
    houses: [1, 2, 4, 7, 8, 12],
    references: ['LAGNA', 'MOON', 'VENUS'],
    otherMalefics: [],
    classical: false,
    note: 'A modern book; takes the Moon chart and, "sometimes", Venus as the point of count.',
    source: { ...BHAGAT, pageLocus: 'Chapter 28 Manglik Dosha, printed p.115 (PDF 116): "Mars exists in 1,2,4,7,8,12 Houses of horoscope in birth horoscope, Moon horoscope, or sometimes Venus position"' },
  },
});

/** Vishnu Bhaskar's percentage by the house Mars is in (pp.98-99). */
const INTENSITY_PERCENT = deepFreeze({
  percent: { 12: 50, 1: 60, 2: 80, 4: 80, 7: 100, 8: 100 },
  source: { ...VISHNU_BHASKAR, pageLocus: `${VB_PAGE_HOUSES} and ${VB_PAGE_INTENSITY}: Mars in 12H (50%), Lagna (60%), 2H (80%), 4H (80%), 7H or 8H (100%)` },
});

/**
 * Vishnu Bhaskar's "Kuja Dosha units" (p.99), by the dignity of the planet.
 * Rows read from the page image: Deb., E.H., N.H., F.H., O.H., Exal.
 */
const UNITS = deepFreeze({
  dignities: ['DEB', 'EH', 'NH', 'FH', 'OH', 'EXAL'],
  // "7H and 8H" then "1H, 2H, 12H and 4H"; within each: Mars, Sat/Rah/Ket, Sun.
  houses7_8: {
    Mars: { DEB: 100, EH: 90, NH: 80, FH: 70, OH: 60, EXAL: 50 },
    SaturnNodes: { DEB: 75, EH: 67.5, NH: 60, FH: 52.5, OH: 45, EXAL: 37.5 },
    Sun: { DEB: 50, EH: 45, NH: 40, FH: 35, OH: 30, EXAL: 25 },
  },
  houses1_2_12_4: {
    Mars: { DEB: 50, EH: 45, NH: 40, FH: 35, OH: 30, EXAL: 25 },
    SaturnNodes: { DEB: 37.5, EH: 33.75, NH: 30, FH: 26.25, OH: 22.5, EXAL: 18.75 },
    Sun: { DEB: 25, EH: 22.5, NH: 20, FH: 17.5, OH: 15, EXAL: 12.5 },
  },
  source: { ...VISHNU_BHASKAR, pageLocus: `${VB_PAGE_INTENSITY}: "Kuja Dosha units" table` },
  notStated: [
    'how the units of several planets, or of the three points of count, are summed',
    'what dignity row Rahu and Ketu take, so their units are not computed',
    'whether E.H./N.H./F.H. mean natural or compound friendship; natural friendship is used',
  ],
  notStatedTa: [
    'பல கிரகங்களின் அலகுகளை, அல்லது மூன்று எண்ணும் புள்ளிகளின் அலகுகளை எப்படிக் கூட்டுவது',
    'ராகு-கேதுவுக்கு எந்த வரிசை (உச்சம்/நீசம்…) பொருந்தும் — அதனால் அவற்றின் அலகுகள் கணக்கிடப்படவில்லை',
    'பகை/சம/நட்பு வீடு என்பது இயற்கை நட்பா, கூட்டு நட்பா — இயற்கை நட்பு எடுக்கப்பட்டது',
  ],
});

/** What the book says Mars does from each house (Vishnu Bhaskar pp.98-99). */
const RESULTS_BY_HOUSE = deepFreeze({
  12: {
    percent: 50, houseTa: '12-ஆம் இடம்',
    textTa: '12-ஆம் இடம் 7-க்கு 6-ஆம் இடம்; 7-ன் எதிரிகளைக் குறிக்கும். படுக்கை சுகத்தைப் பாதிக்கும்; மூன்றாம் நபர் வருவதைச் சுட்டும். 3 (வீரியக் குறைவு), 6 (எதிரி பெருக்கம்), 8 (மனைவிக்குப் பாதகம்) பாதிக்கப்படும்.',
    page: `${VB_PAGE_HOUSES}: Bhava wise malefic influence — Mars in 12H`,
  },
  1: {
    percent: 60, houseTa: 'லக்னம்',
    textTa: 'பரஸ்பர அன்பு பாதிப்பு, பொறாமை, வெறுப்பு, வன்முறைப் போக்கு. 4 (குடும்ப சுகம்), 7 (துணையிடம் நடத்தை, தாம்பத்திய சுகம்), 8 (கணவன் ஆயுள், மனைவியின் சௌபாக்கியம்) பாதிக்கப்படும்.',
    page: `${VB_PAGE_HOUSES}: Mars in Lagna`,
  },
  2: {
    percent: 80, houseTa: '2-ஆம் இடம்',
    textTa: 'தனக்கு மாரகம்; 7-க்கு 8-ஆம் இடம் என்பதால் துணையின் ஆயுளைப் பாதிக்கும். 2 (குடும்பக் குழப்பம், துணையிடம் ஆக்ரோஷம், பணப் பற்றாக்குறை), 5 (பிள்ளைகள்), 8 (ஆயுள்), 9 (தர்மம்/பாக்கியம்) பாதிக்கப்படும்.',
    page: `${VB_PAGE_INTENSITY}: Mars in 2H`,
  },
  4: {
    percent: 80, houseTa: '4-ஆம் இடம்',
    textTa: 'குடும்ப சுகக் குறைவு, தகராறு, பகை. 7 (தாம்பத்திய சுகம்), 10 (தொழில்), 11 (லாபம்) பாதிக்கப்படும்.',
    page: `${VB_PAGE_INTENSITY}: Mars in 4H`,
  },
  7: {
    percent: 100, houseTa: '7-ஆம் இடம்',
    textTa: 'தகராறு, வன்முறை, துணையின் ஆயுள் குறைவு.',
    page: `${VB_PAGE_INTENSITY}: Mars in 7H or 8H`,
  },
  8: {
    percent: 100, houseTa: '8-ஆம் இடம்',
    textTa: 'தகராறு, வன்முறை, துணையின் ஆயுள் குறைவு.',
    page: `${VB_PAGE_INTENSITY}: Mars in 7H or 8H`,
  },
});

/** Remedies as Bhagat records them: practices, with no claim they work. */
const REMEDIES = deepFreeze({
  beforeMarriage: {
    textTa: 'திருமணத்துக்கு முன் செய்ய வேண்டியவை: கும்ப விவாகம் (குடத்துடன் திருமணம் செய்து உடைத்தல்), விஷ்ணு விவாகம், அஸ்வத்த விவாகம் (அரசு அல்லது வாழை மரத்துடன் திருமணம் செய்து மரத்தை வெட்டுதல்) — மங்கள தோஷத்துக்கு மிகப் பிரபலமான பரிகாரங்கள் என்று நூல் கூறுகிறது.',
    source: { ...BHAGAT, pageLocus: 'Chapter 28, printed p.118 (PDF 119): Remedies (needs to be performed before marriage)' },
  },
  afterMarriage: {
    items: [
      'வழிபாட்டு அறையில் காவி நிறக் கணபதி சிலை வைத்து தினமும் வழிபடுதல்',
      'அனுமனை ஹனுமான் சாலீசா பாராயணத்துடன் தினமும் வழிபடுதல்',
      'மகா மிருத்யுஞ்சய பாராயணம்',
      'பறவைகளுக்கு இனிப்பு உணவு அளித்தல்',
      'வீட்டில் யானைத் தந்தம் வைத்திருத்தல்',
      'ஆலமரத்துக்குப் பாலில் இனிப்பு கலந்து வழிபடுதல்',
    ],
    source: { ...BHAGAT, pageLocus: 'Chapter 28, printed p.118 (PDF 119): Remedies (can be performed after marriage), six items' },
  },
  yantra: {
    textTa: 'மங்கள யந்திரத்தை உடன் வைத்திருத்தல் அல்லது கோயிலில் வைத்தல் (நூல் யந்திரப் படம் தருகிறது).',
    source: { ...BHAGAT, pageLocus: 'Chapter 28, printed p.117 (PDF 118): Yantra Remedies' },
  },
});

/** Bhagat's general statements about the dosha and marriage. */
const GUIDANCE = deepFreeze({
  bothManglikOk: {
    textTa: 'இருவரும் மாங்கலிக் ஆக இருந்தால் தீய பலன்கள் நீங்கும் (பகத், மானசாகரி இருவரும் இதைச் சொல்கின்றனர்).',
    sources: [
      { ...BHAGAT, pageLocus: 'Chapter 28, printed p.116 (PDF 117), Characteristics 5: "the marriage between two Manglik individuals cancels the negative effects"' },
      { ...MANSAGARI, pageLocus: 'printed p.794 (PDF 229), translator\'s note: "if both the girl and the boy suffer similar kind of Dosha, they can safely marry"' },
    ],
  },
  delayYears: {
    textTa: 'இருவரும் மாங்கலிக் அல்லாதபோது 27 முதல் 32 வயதுக்கு முன் திருமணம் செய்யக் கூடாது என்று பகத் கூறுகிறார் (வயது மற்ற யோகங்களைப் பொறுத்து மாறலாம்). விஷ்ணு பாஸ்கர் "28 வயதுக்குப் பிறகு தோஷம் முடியும் என்பது நூல்களால் ஆதரிக்கப்படவில்லை" என்கிறார் — இரண்டும் முரண்படுகின்றன.',
    sources: [
      { ...BHAGAT, pageLocus: 'Chapter 28, printed p.115 (PDF 116): "marriage should not be performed before 27 to 32 years of age"' },
      { ...VISHNU_BHASKAR, pageLocus: `${VB_PAGE_INTENSITY}: "Some astrologers consider that the Kuja Dosha effect is over after 28 years. This is not supported by classics"` },
    ],
  },
});

/** The Tamil texts were searched and hold no Mangala rule; stated so the page can say it. */
const TAMIL_NOT_FOUND = deepFreeze({
  names: ['மங்கள தோஷம்', 'செவ்வாய் தோஷம்', 'குஜ தோஷம்'],
  searchedIn: [
    'சூடாமணி உள்ளமுடையான் (முழு OCR உரை)',
    'காலப்பிரகாசிகை (ஆங்கில மொழிபெயர்ப்பு, 1917 OCR)',
    'சாதக அலங்காரம் (சரசுவதி மகால் 2007; வேலுநாயகர் 1964)',
    'காலசக்கரம் (தில்லைநாயகப் புலவர்)',
  ],
  noteTa: 'நம்மிடம் உள்ள தமிழ் நூல்களின் உரையில் செவ்வாய் தோஷத்துக்கான விதி காணப்படவில்லை (OCR தேடல்; சிதைந்த சொல் தவறியிருக்கலாம்). எனவே தமிழ் முறை என்று எதுவும் இங்கே கொடுக்கப்படவில்லை. "தென்னிந்திய முறை" என்பது விஷ்ணு பாஸ்கரின் கூற்று, தமிழ் நூல் அல்ல.',
});

/**
 * Which book is shown first (owner, 2026-10-03: "the book with the most
 * explanation first, then the others in order" — the rule set for gemstones and
 * extended here). Measured as words in each book's Mangala/Kuja dosha section,
 * from the text layer (Vishnu Bhaskar's scan has none; the count is from the
 * owner's library index OCR of the same edition, printed = index page − 15).
 * Within Vishnu Bhaskar, the section that explains (p.98) leads, then his p.99
 * South-India variant, then the one-line chapter summary (p.94).
 */
const BOOK_RANK = deepFreeze({
  decided: '2026-10-03',
  measureTa: 'செவ்வாய் தோஷம் பற்றிய பகுதியில் உள்ள சொற்களின் எண்ணிக்கை',
  order: [
    { key: 'VISHNU_BHASKAR', words: 1167, range: 'Chapter 9 §VII, printed pp.98-100' },
    { key: 'BHAGAT', words: 899, range: 'Chapter 28, printed pp.115-118' },
    { key: 'MANSAGARI', words: 717, range: 'printed pp.794-796, verse 4 with the translator\'s notes and list' },
  ],
  readingOrder: ['VISHNU_BHASKAR', 'VISHNU_BHASKAR_SOUTH', 'VISHNU_BHASKAR_SUMMARY', 'BHAGAT', 'MANSAGARI'],
});

module.exports = {
  TAMIL_NOT_FOUND, BOOK_RANK,
  SOURCES: { MANSAGARI, BHAGAT, VISHNU_BHASKAR },
  READINGS, INTENSITY_PERCENT, UNITS, RESULTS_BY_HOUSE, REMEDIES, GUIDANCE,
};
