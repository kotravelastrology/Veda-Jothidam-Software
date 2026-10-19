/**
 * Lagna shuddhi for a marriage muhurta — the books' rules (added 2026-10-11).
 *
 * The muhurta lagna is the sign rising at the event's place. Five checks, each
 * measured by words in every book that treats it; where the books differ
 * every reading is computed and the most explaining book's is the default:
 *
 *  - the planets' houses from the lagna (forbidden places and the twenty
 *    points, "vimshopaka" / "vishvabala");
 *  - the lagna as the 8th (or 4th, 12th) sign from the birth lagna or birth Moon;
 *  - deaf, blind and lame signs by day and night;
 *  - Kartari: the lagna between malefics in the 2nd and 12th;
 *  - lagna Gandanta at the water-fire sign junctions.
 *
 * Later the same day: the lagna's navamsa, shadvarga, decanate, the poison
 * portions, and the lagna for any other auspicious act (COMMON, EVENTS, SCOPE).
 *
 * Houses are 1-12 from the lagna; signs 0 = Aries.
 */

const { BOOKS: { SHRIDHAR_HEA, MC_SHARMA, KALYANRAMAN_V2, JOSHI_KK, VASHISTHA_KUSUM, RANGACHARYA_I, AGARWAL_GS, WILHELM_E, RAMAN_BV, KALYANRAMAN_V1 } } = require('./muhurtaStarTables');

const deepFreeze = (o) => {
  Object.values(o).forEach((v) => { if (v && typeof v === 'object' && !Object.isFrozen(v)) deepFreeze(v); });
  return Object.freeze(o);
};
const rank = (words, measureTa) => deepFreeze({ order: Object.keys(words).sort((a, b) => words[b] - words[a]), words, measureTa });

const PLANETS = Object.freeze(['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu']);
const MALEFICS = Object.freeze(['Sun', 'Mars', 'Saturn', 'Rahu', 'Ketu']);
const BENEFICS = Object.freeze(['Mercury', 'Jupiter', 'Venus']);
const RASI_LORDS = Object.freeze(['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter']);

/**
 * The twenty points (Muhurta Chintamani sloka 87-88, Joshi's Table 6.6,
 * Shridhar's Table 18.5, Rangacharya's table): a planet in one of its good
 * houses gives the lagna its points. Rahu and Ketu, always opposite, cannot
 * both be in 3, 6, 8, 11, so the most is twenty.
 */
const POINTS = deepFreeze({
  Sun: { good: [3, 6, 8, 11], points: 3.5 },
  Moon: { good: [2, 3, 11], points: 5 },
  Mars: { good: [3, 6, 11], points: 1.5 },
  Mercury: { good: [1, 2, 3, 4, 5, 6, 9, 10, 11], points: 2 },
  Jupiter: { good: [1, 2, 3, 4, 5, 6, 9, 10, 11], points: 3 },
  Venus: { good: [1, 2, 4, 5, 9, 10, 11], points: 2 },
  Saturn: { good: [3, 6, 8, 11], points: 1.5 },
  Rahu: { good: [3, 6, 8, 11], points: 1.5 },
  Ketu: { good: [3, 6, 8, 11], points: 1.5 },
});

/** Each book's places to avoid: planet → houses. LAGNA_LORD is the lord of the lagna; ALL any planet. */
const AVOID = deepFreeze({
  // Shridhar's Table 18.5, "adverse places".
  SHRIDHAR: { Sun: [1, 7], Moon: [1, 6, 7, 8, 12], Mars: [1, 7, 8, 10], Mercury: [7, 8, 12], Jupiter: [7, 8, 12], Venus: [3, 6, 7, 8, 12], Saturn: [1, 7, 12], Rahu: [1, 4, 7], Ketu: [1, 4, 7], LAGNA_LORD: [6, 8, 12] },
  // Muhurta Chintamani sloka 86: Saturn 12, Mars 10, Venus 3, the Moon and a malefic in the lagna; the lagna lord, Venus, the Moon in 6; the Moon, the lagna lord, benefics, Mars in 8; every planet in 7.
  MUHURTA_CHINTAMANI: { Sun: [1, 7], Moon: [1, 6, 7, 8], Mars: [1, 7, 8, 10], Mercury: [7, 8], Jupiter: [7, 8], Venus: [3, 6, 7, 8], Saturn: [1, 7, 12], Rahu: [1, 7], Ketu: [1, 7], LAGNA_LORD: [6, 8] },
  // Wilhelm: Saturn 12, Mars 8 or 10, Venus 6, the Moon and malefics in the lagna, the Moon and the lagna lord in 6 or 8, no benefics in 8, all planets unfavourable in 7.
  WILHELM: { Sun: [1, 7], Moon: [1, 6, 7, 8], Mars: [1, 7, 8, 10], Mercury: [7, 8], Jupiter: [7, 8], Venus: [6, 7, 8], Saturn: [1, 7, 12], Rahu: [1, 7], Ketu: [1, 7], LAGNA_LORD: [6, 8] },
  // Rangacharya's "malefic places" (they take the points away).
  RANGACHARYA: { Sun: [1, 7], Moon: [1, 6, 7, 8, 12], Mars: [1, 7, 8, 10], Mercury: [7, 8, 12], Jupiter: [7, 8, 12], Venus: [3, 6, 7, 8, 12], Saturn: [1, 7, 12], Rahu: [1, 7], Ketu: [1, 7], LAGNA_LORD: [] },
  // Joshi (Jyotirvidabharana XIII.21) = Kalyanraman: Sun 1/7, Moon 1/6/7/8, Mars 1/7/8/10, Mercury, Jupiter 7/8, Venus 3/6/7/8, Saturn 1/7/12, Rahu-Ketu 1/7, the lagna lord 6/8.
  JOSHI: { Sun: [1, 7], Moon: [1, 6, 7, 8], Mars: [1, 7, 8, 10], Mercury: [7, 8], Jupiter: [7, 8], Venus: [3, 6, 7, 8], Saturn: [1, 7, 12], Rahu: [1, 7], Ketu: [1, 7], LAGNA_LORD: [6, 8] },
});

/** How each book turns places and points into a verdict. */
const PLACEMENTS = deepFreeze({
  default: 'SHRIDHAR',
  order: ['SHRIDHAR', 'WILHELM', 'MUHURTA_CHINTAMANI', 'RANGACHARYA', 'JOSHI'],
  SHRIDHAR: { labelTa: 'ஸ்ரீதர் — விஸ்வ பலம் 4+ (4-10 கவனம்), தீய இடம் ஒன்றுக்கு மேல் இல்லை', textTa: 'அட்டவணை 18.5: நல்ல இடத்தில் உள்ள கிரகத்தின் புள்ளிகள் (மொத்தம் 20). 16-20 சிறந்தது, 11-15 நடுத்தரம், 4-10 "அவசரத்தில் மட்டும், கவனமாக" — ஏற்கப்பட்டு "கவனம்" எனக் குறிக்கப்படுகிறது (உரிமையாளர் முடிவு 2026-10-11); 4-க்குக் கீழ் விலக்கு. தீய இடத்தில் ஒரு கிரகம் "பரிகாரத்துடன் ஏற்கலாம்", ஒன்றுக்கு மேல் விலக்கு. ராகு/கேது தீய இடம் 1, 4, 7; லக்னாதிபதி 6, 8, 12.', booksTa: 'ஸ்ரீதர்', scoring: 'ADD', grades: [[16, 'BEST'], [11, 'MEDIUM'], [4, 'EMERGENCY']], pass: ['BEST', 'MEDIUM', 'EMERGENCY'], caution: ['EMERGENCY'], maxAvoid: 1 },
  WILHELM: { labelTa: 'வில்ஹெல்ம் — தீய இடம் ஒன்றும் இல்லை', textTa: 'சனி 12, செவ்வாய் 8, 10, சுக்கிரன் 6 (சிலர் 3-ம்), சந்திரனும் பாவரும் லக்னத்தில், சந்திரனும் லக்னாதிபதியும் 6, 8-ல், சுபர் 8-ல், எந்தக் கிரகமும் 7-ல் — இவை இல்லாமல். புள்ளிகள் இல்லை.', booksTa: 'வில்ஹெல்ம்', scoring: null, grades: [], pass: [], maxAvoid: 0 },
  MUHURTA_CHINTAMANI: { labelTa: 'முகூர்த்த சிந்தாமணி — தீய இடம் இல்லாமல், விம்சோபகம் 5+', textTa: 'ஸ்லோ.86-ன் தீய இடங்கள் இல்லாமல்; ஸ்லோ.87-88-ன் விம்சோபகம் 5-க்குக் கீழ் விலக்கு, 5-10 குறைவு, 10-15 நடுத்தரம், 15-20 சிறந்தது.', booksTa: 'முகூர்த்த சிந்தாமணி, அகர்வால் (அதே பட்டியல்)', scoring: 'ADD', grades: [[15, 'BEST'], [10, 'MEDIUM'], [5, 'LOW']], pass: ['BEST', 'MEDIUM', 'LOW'], maxAvoid: 0 },
  RANGACHARYA: { labelTa: 'ரங்காச்சார்யா — தீய இடத்தில் புள்ளி கழிவு, 5+', textTa: 'நல்ல இடத்தில் புள்ளி கூடும், தீய இடத்தில் அதே புள்ளி கழியும், மற்ற இடத்தில் இல்லை; 5-க்குக் கீழ் விலக்கு, 5-10 நடுத்தரம், 10-15 நன்று, 15-20 சிறப்பு.', booksTa: 'ரங்காச்சார்யா', scoring: 'PLUS_MINUS', grades: [[15, 'BEST'], [10, 'MEDIUM'], [5, 'LOW']], pass: ['BEST', 'MEDIUM', 'LOW'], maxAvoid: Infinity },
  JOSHI: { labelTa: 'ஜோஷி — ஜ்யோதிர்வித்யாபரணப் பட்டியல், 5+', textTa: 'சூரியன் 1, 7; சந்திரன் 1, 6, 7, 8; செவ்வாய் 1, 7, 8, 10; புதன், குரு 7, 8; சுக்கிரன் 3, 6, 7, 8; சனி 1, 7, 12; ராகு, கேது 1, 7; லக்னாதிபதி 6, 8 — இல்லாமல்; விஸ்வ பலம் 5-க்குக் கீழ் விலக்கு.', booksTa: 'ஜோஷி, கல்யாணராமன்', scoring: 'ADD', grades: [[15, 'BEST'], [10, 'MEDIUM'], [5, 'LOW']], pass: ['BEST', 'MEDIUM', 'LOW'], maxAvoid: 0 },
});
const GRADE_TA = Object.freeze({ BEST: 'சிறந்தது', MEDIUM: 'நடுத்தரம்', LOW: 'குறைவு', EMERGENCY: 'அவசரத்தில் மட்டும்', REJECT: 'விலக்கு' });

/** The lagna as a sign counted from the birth lagna or the birth Moon. */
const ASHTAMA = deepFreeze({
  default: 'EIGHTH',
  order: ['EIGHTH', 'FOUR_EIGHT_TWELVE'],
  EIGHTH: { labelTa: '8-ஆம் ராசி — அதிபதிகள் ஒன்று அல்லது நண்பர் எனில் இல்லை', textTa: 'பிறந்த லக்னத்துக்கோ ஜன்ம ராசிக்கோ 8-ஆம் ராசி முகூர்த்த லக்னமாகக் கூடாது; இரண்டின் அதிபதியும் ஒருவரே, நண்பர்கள், அல்லது ஒருவர் நட்பு மற்றவர் சமம் எனில் தோஷம் இல்லை (வில்ஹெல்மின் சொல்; BPHS இயற்கை உறவு). இது முகூர்த்த சிந்தாமணி சொல்லும் ஆறு ராசிகளையே — மீனம், ரிஷபம், கடகம், விருச்சிகம், மகரம், கன்னி — தருகிறது; "இருபுறமும் நட்பு" என்றால் மூன்றே வரும்.', booksTa: 'முகூர்த்த சிந்தாமணி, வில்ஹெல்ம், ஜோஷி, அகர்வால்' },
  FOUR_EIGHT_TWELVE: { labelTa: '4, 8, 12-ஆம் ராசிகள்', textTa: '4, 8, 12-ஆம் ராசிகள் தீயவை; 8-க்கு அதே அதிபதி / நட்பு விலக்கு.', booksTa: 'ரங்காச்சார்யா, வசிஷ்டா, ஸ்ரீதர் (8 முழுவதும் விலக்கு; 4, 12 சுபர் மிகுதியாக இருந்தால் ஏற்கலாம்)' },
});

/** Deaf, blind, lame signs (Muhurta Chintamani sloka 80 = Wilhelm = Rangacharya's day and night columns). */
const PDB = deepFreeze({
  DAY: { DEAF: [6, 7], BLIND: [0, 1, 4], LAME: [10] },
  NIGHT: { DEAF: [8, 9], BLIND: [2, 3, 5], LAME: [11] },
});
const PDB_TA = Object.freeze({ DEAF: 'பதிர (செவிடு)', BLIND: 'அந்த (குருடு)', LAME: 'பங்கு (முடம்)' });

const KARTARI = deepFreeze({
  default: 'SCISSORS',
  order: ['SCISSORS', 'RETRO_SECOND', 'HEMMED'],
  SCISSORS: { labelTa: '12-ல் நேர்கதிப் பாவர், 2-ல் வக்கிரப் பாவர்', textTa: 'இரண்டும் லக்னத்தை நோக்கி வருகின்றன — கத்தரிக்கோல் (முகூர்த்த சிந்தாமணி ஸ்லோ.74 மூலம்; உரைக்குறிப்பில் திசை மாறியுள்ளது). ராகு, கேது எப்போதும் வக்கிரம் (சராசரிக் கணு).', booksTa: 'முகூர்த்த சிந்தாமணி, ரங்காச்சார்யா, வசிஷ்டா' },
  RETRO_SECOND: { labelTa: '2-ல் வக்கிரப் பாவர், 12-ல் எந்தப் பாவரும்', textTa: '2-ல் வக்கிரப் பாவ கிரகமும் 12-ல் ஒரு பாவ கிரகமும்.', booksTa: 'ஸ்ரீதர்' },
  HEMMED: { labelTa: '2-லும் 12-லும் பாவர் (சுற்றி வளைப்பு)', textTa: 'லக்னம் இரண்டு பாவருக்கு இடையில் — வக்கிரம் பாராமல்.', booksTa: 'வில்ஹெல்ம், ஜோஷி, அகர்வால்' },
});

const GANDANTA = deepFreeze({
  default: 'MINUTES_12',
  order: ['MINUTES_12', 'DEGREES_3'],
  MINUTES_12: { labelTa: '12 நிமிடம் (½ நாழிகை)', textTa: 'கடகம், விருச்சிகம், மீனம் லக்னத்தின் கடைசி 12 நிமிடம்; மேஷம், சிம்மம், தனுசு லக்னத்தின் முதல் 12 நிமிடம்.', booksTa: 'ஸ்ரீதர், முகூர்த்த சிந்தாமணி, ரங்காச்சார்யா, அகர்வால்', minutes: 12 },
  DEGREES_3: { labelTa: '3 பாகை', textTa: 'அதே ராசிகளின் கடைசி / முதல் 3 பாகை ("½ நாடி லக்ன நகர்வு = 3 பாகை").', booksTa: 'வில்ஹெல்ம்', degrees: 3 },
});
const GANDANTA_END = Object.freeze([3, 7, 11]);
const GANDANTA_START = Object.freeze([0, 4, 8]);

// ---------------------------------------------------------------------------
// Order by words
// ---------------------------------------------------------------------------

const RANK_LAGNA = ({
  PLACEMENTS: rank({ SHRIDHAR: 1838, WILHELM: 1051, MUHURTA_CHINTAMANI: 905, RANGACHARYA: 428, JOSHI: 365, AGARWAL: 281, VASHISTHA: 52, KALYANRAMAN: 48 }, 'திருமண லக்னத்தில் கிரகங்களின் இடம், புள்ளிகள் பற்றிய சொற்கள்: ஸ்ரீதர் (§18.3.4-18.3.5, பக்.463-468, அட்டவணை 18.4 உட்பட) 1838; வில்ஹெல்ம் (பக்.137, 139, 262-264) 1051; முகூர்த்த சிந்தாமணி (பக்.213-216) 905; ரங்காச்சார்யா (பக்.55, 99-100) 428; ஜோஷி (பக்.75-76) 365; அகர்வால் (பக்.311-312) 281; வசிஷ்டா 52; கல்யாணராமன் 48.'),
  ASHTAMA: rank({ MUHURTA_CHINTAMANI: 524, SHRIDHAR: 414, RANGACHARYA: 385, WILHELM: 206, VASHISTHA: 111, JOSHI: 75, AGARWAL: 62 }, 'லக்னம் பிறப்பிலிருந்து 8-ஆம் ராசி பற்றிய சொற்கள்: முகூர்த்த சிந்தாமணி (பக்.185-187) 524; ஸ்ரீதர் (பக்.460-462, 467) 414; ரங்காச்சார்யா (பக்.56, 98-99) 385; வில்ஹெல்ம் (பக்.139, 261) 206; வசிஷ்டா 111; ஜோஷி 75; அகர்வால் 62.'),
  PDB: rank({ WILHELM: 336, MUHURTA_CHINTAMANI: 334, SHRIDHAR: 184, RANGACHARYA: 136, AGARWAL: 127 }, 'செவிடு, குருடு, முட ராசிகள் பற்றிய சொற்கள்: வில்ஹெல்ம் (பக்.122-123, 261) 336; முகூர்த்த சிந்தாமணி (பக்.211-212) 334; ஸ்ரீதர் (§8.15, ப.460) 184; ரங்காச்சார்யா (பக்.97-98) 136; அகர்வால் 127. எல்லாம் பகல்/இரவுக்கு ஒரே ராசிகள்.'),
  KARTARI: rank({ MUHURTA_CHINTAMANI: 349, SHRIDHAR: 327, RANGACHARYA: 146, WILHELM: 94, VASHISTHA: 68, JOSHI: 40, AGARWAL: 18 }, 'கர்த்தரி பற்றிய சொற்கள்: முகூர்த்த சிந்தாமணி (பக்.184-185) 349; ஸ்ரீதர் (§8.6) 327; ரங்காச்சார்யா (பக்.54-55) 146; வில்ஹெல்ம் 94; வசிஷ்டா 68; ஜோஷி 40; அகர்வால் 18.'),
  GANDANTA: rank({ SHRIDHAR: 91, WILHELM: 84, MUHURTA_CHINTAMANI: 57, RANGACHARYA: 38, AGARWAL: 22 }, 'லக்ன கண்டாந்தம் பற்றிய சொற்கள்: ஸ்ரீதர் (§8.1.7) 91; வில்ஹெல்ம் 84; முகூர்த்த சிந்தாமணி 57; ரங்காச்சார்யா 38; அகர்வால் 22.'),
});

// ---------------------------------------------------------------------------
// The books' words
// ---------------------------------------------------------------------------

const SOURCES_LAGNA = ({
  PLACEMENTS: {
    SHRIDHAR: Object.freeze({ ...SHRIDHAR_HEA, pageLocus: '§18.3.4-18.3.5, printed pp.463-468 (PDF 502-507): "Malefics are better placed in 3,6, & 11 houses"; Table 18.5 "Vishvabala of marriage chart" — the places producing beneficial points, the points (Sun 3.5, Moon 5, Mars 1.5, Mercury 2, Jupiter 3, Venus 2, Saturn 1.5, Rahu/Ketu 1.5) and the adverse places; "If total points are 4 to 10- it is inauspicious & should be carefully used only in emergency ... 11 to 15 points - average / medium marriage; 16 to 20 points are the most sought for"; "One adverse placement may be acceptable with antidote, but more than one should be shunned"' }),
    WILHELM: Object.freeze({ ...WILHELM_E, pageLocus: 'printed pp.262-264 (PDF 270-272): "Most Unfavorable Bhavas for the Planets: Saturn should be avoided in the 12th house, Mars in the 8th or 10th, Venus in the 6th as well as the 3rd according to some, and the Moon and any malefics in the Lagna. The Moon and the Lagna lord should not be in the 6th or 8th, and no benefics should be in the 8th"; "Planets in the 7th: All planets are very unfavorable in the 7th"; pp.137, 139: Bhrigu Shataka, Kuja Ashtaka, the Moon in the 12th, 6th or 8th' }),
    MUHURTA_CHINTAMANI: Object.freeze({ ...MC_SHARMA, pageLocus: 'Vivaha Prakarana, slokas 86-91, printed pp.213-216 (PDF 217-220): "व्यये शनिः खेऽवनिजस्तृतीये भृगुस्तनौ चन्द्रखला न शस्ताः । लग्नेट् कविग्लौश्च रिपौ मृतो ग्लौर्लग्नेट्शुभाराश्च मदे च सर्वे"; the benefic places; the exceptions; "Mercury and Venus both have 2 Vimshopakas each; the Moon has 5; the Sun 3.5; Jupiter, 3; and Saturn, Rahu, Ketu and Mars each of them has 1.5"; "If the total Vimshopaka strength falls short of 5 in an Ascendant, then that Ascendant is left out"' }),
    RANGACHARYA: Object.freeze({ ...RANGACHARYA_I, pageLocus: '"Placement of planets and vimsopaka evaluation", printed pp.99-100 (PDF 107-108): the table of benefic, malefic and neutral places; "The planets in the benefic places attain their Vimsopakas and the planets in the malefic places lose their Vimsopakas"; "rejected if it gets below 5 Vimsopakas"; the example chart (8 vimsopakas); p.55: Bhrigu shatka, Kujastama, the Moon in 6th, 8th, 12th' }),
    JOSHI: Object.freeze({ ...JOSHI_KK, pageLocus: 'printed pp.75-76 (PDF 90-91): "Where a planet should not be: In the marriage lagna Sun in 1/7 houses; moon in 1/6/7/8 houses; Mars in 1/7/8/10 houses; Mercury in 7/8 houses; Jupiter in 7/8 houses; Venus in 3/6/7/8 houses; Saturn in 1/7/12 houses; Rahu-Ketu in 1/7 houses and marriage lagna lord in 6/8 houses" (Jyotirvidabharana XIII.21); Table 6.6, "Vishwa-bala"' }),
    AGARWAL: Object.freeze({ ...AGARWAL_GS, pageLocus: 'printed pp.311-312 (PDF 310-311): "Avoid: a. Saturn in 12th; b. Mars in 10th; c. Venus in 3rd; d. Moon with a malefic in lagna; e. Lagnesh, Moon or Venus in 6th ... f. Mars in 8th ... g. Moon in 6th, 8th or 12th ... h. Any planet in 7th"' }),
    VASHISTHA: Object.freeze({ ...VASHISTHA_KUSUM, pageLocus: 'printed p.113 (PDF 100): Mercury, Venus, Jupiter in 1, 4, 5, 9, 10 cancel 100, 200, 1,00,000 doshas' }),
    KALYANRAMAN: Object.freeze({ ...KALYANRAMAN_V2, pageLocus: 'printed p.127 (PDF 129): "The Sun or Rahu or Ketu must not be in 1/7; Moon in 1/6/7/8; Mars in 1/7/8/10; Mercury or Jupiter in 7/8; Venus in 3/6/7/8; Saturn in 1/7/12; Marriage Lagna lord in 6/8"' }),
  },
  ASHTAMA: {
    MUHURTA_CHINTAMANI: Object.freeze({ ...MC_SHARMA, pageLocus: 'slokas 78-79, printed pp.185-187 (PDF 189-191): "If the 8th Rashi or sign from the Natal Ascendant and Janama Rashi is there in the Ascendant at Marriage, then such marriage is not auspicious. But when the Planetary lord of the Natal Ascendant or of the Janama Rashi is the Lord of the Ascendant at marriage also or if there is friendship between the two, then this Dosha or Defect does not apply"; "If the 8th sign ... is Pisces, Taurus, Cancer, Scorpio, Capricorn, or Virgo ... this Dosha or Defect does not apply"' }),
    SHRIDHAR: Object.freeze({ ...SHRIDHAR_HEA, pageLocus: 'printed pp.460-462, 467 (PDF 499-501, 506): "3rd, 6th, 10th & 11th signs from the Janma Rashi or Birth ascendant of the couple are especially beneficial"; "4th, 8th & 12th signs ... as rising sign & rising navamsha are inauspicious. 8th sign & navamsha both are prohibited, but 4th & 12th can be used if benefic factors are present in excess"; "Ashtam Lagna Dosha"' }),
    RANGACHARYA: Object.freeze({ ...RANGACHARYA_I, pageLocus: 'printed pp.56, 98-99 (PDF 64, 106-107): "the muhurtha-lagna being the 4th, 8th, or 12th from Janma Lagna or Janma Rasi is condemned ... its evil being in the 4th or 12th is deemed destroyed. The muhurtha-lagna being the 8th, is most inauspicious"; "The lord of Janma Lagna and the lord of muhurtha lagna should be the same, or the two lords should be mutual friends"' }),
    WILHELM: Object.freeze({ ...WILHELM_E, pageLocus: 'printed pp.139, 261 (PDF 147, 269): "Dampatyor Ashtama Lagna ... The Lagna should not be the 8th Rasi from the natal Lagna or Moon of either the individual or their spouse. Exception: If the lords of the natal Rasi and its 8th are the same, friendly, or one friendly and the other neutral"' }),
    VASHISTHA: Object.freeze({ ...VASHISTHA_KUSUM, pageLocus: 'printed pp.112-113 (PDF 99-100): "Either from lagna or janmarashi, 3, 6, 10 and 11 lagnas are good. Either for the groom or the bride, 4, 8 and 12 lagnas from the natal lagna or natal Moon are inauspicious. The eighth house fault is the worst"' }),
    JOSHI: Object.freeze({ ...JOSHI_KK, pageLocus: 'printed p.77 (PDF 92): "Lagnas & navamshas of 8th and 12th rashis from the Janma Rashi (natal moon sign) should be avoided specifically when such natal Lagna lord or natal moon sign lord and their 8th lords are inimical"' }),
    AGARWAL: Object.freeze({ ...AGARWAL_GS, pageLocus: 'printed pp.311, 313 (PDF 310, 312): "8th sign from natal lagna & janam rasi should not be vivaha kundli\'s lagna. (this dosha nullifies if lords of such signs are same or natural friends)"' }),
  },
  PDB: {
    WILHELM: Object.freeze({ ...WILHELM_E, pageLocus: 'printed pp.122-123, 261 (PDF 130-131, 269): "Aries, Taurus and Leo are blind during the daytime, and Gemini, Cancer and Virgo are blind during the night"; "Libra and Scorpio are deaf during the day, and Capricorn and Sagittarius are deaf during the night"; "Aquarius is lame during the day and Pisces during the night"; "Exception: Jupiter aspecting the Lagna or Lagna lord removes the ill effects"' }),
    MUHURTA_CHINTAMANI: Object.freeze({ ...MC_SHARMA, pageLocus: 'slokas 80-82, printed pp.211-212 (PDF 215-216): "The Ascendants of Libra and Scorpio become Badhira (Deaf) in the day time and those of Capricorn and Sagittarius in the night time ..."; the other view; "But if there is the aspect of Jupiter on the Ascendant or on the Ascendant Lord there occurs no Dosha"' }),
    SHRIDHAR: Object.freeze({ ...SHRIDHAR_HEA, pageLocus: '§8.15, printed p.202 (PDF 246), and p.460 (PDF 499): "Blind signs (Andha): Aries, Taurus & Leo are blind during daytime, while Gemini, Cancer & Virgo are blind at night-time"; deaf in the morning, at mid-day and in the evening (K.P.)' }),
    RANGACHARYA: Object.freeze({ ...RANGACHARYA_I, pageLocus: 'printed pp.97-98 (PDF 105-106): the table of deaf, blind and lame signs by evening, daytime, afternoon and night; "If the lord of the Lagna or Jupiter aspects or occupies it, the blemish is mitigated"' }),
    AGARWAL: Object.freeze({ ...AGARWAL_GS, pageLocus: 'printed p.312 (PDF 311): "Bhadhira (deaf) lagnas are Libra, Scorpio during day time. Capricorn, Sagittarius during night time ... these doshas get cancelled if Jupiter aspects lagna or lagnesh"' }),
  },
  KARTARI: {
    MUHURTA_CHINTAMANI: Object.freeze({ ...MC_SHARMA, pageLocus: 'sloka 74, printed pp.184-185 (PDF 188-189): "If a Malefic Planet, being Direct, is posited in the 12th House, from the Ascendant at Marriage, and being Retrograde, is posited in the 2nd place ... \'Kartari\'"; "The Retrograde Planet situated in the 2nd House comes back and reaches the Lagna and the Direct Planet situated in the 12th House goes ahead"; "the 5th, the 7th and the 9th Houses ... should also be free"; p.214: the exceptions' }),
    SHRIDHAR: Object.freeze({ ...SHRIDHAR_HEA, pageLocus: '§8.6 "Kartari Dosha", printed pp.182-183 (PDF 226-227): "A retrograde malefic planet in 2nd house & a malefic planet in 12th house produce Kartari (scissors) Dosha"; the antidotes' }),
    RANGACHARYA: Object.freeze({ ...RANGACHARYA_I, pageLocus: 'printed pp.54-55 (PDF 62-63): "The evil of Karthari is caused if the 12th is occupied by a malefic, while the 2nd is occupied by a retrograde malefic ... If both the 2nd, 12th are occupied by retrograde malefics ... it is no karthari blemish"' }),
    WILHELM: Object.freeze({ ...WILHELM_E, pageLocus: 'printed p.138 (PDF 146): "Malefics in the 2nd and 12th from either the Lagna or 7th form Papakartari Yoga ... If the malefic in the 2nd is retrograde and the malefic in the 12th is moving forward it is especially troublesome"' }),
    VASHISTHA: Object.freeze({ ...VASHISTHA_KUSUM, pageLocus: 'printed p.113 (PDF 100): "A malefic retrograde planet in the 2nd house and a direct malefic in the 12th house produce kartari dosha"' }),
    JOSHI: Object.freeze({ ...JOSHI_KK, pageLocus: 'printed p.73 (PDF 88): "Lagna or seventh house in marriage lagna chart should not be hemmed between malefics. This kartari dosha will be more malefic if the planet in 2nd house is retrograde and planet in 12th house is in direct motion"' }),
    AGARWAL: Object.freeze({ ...AGARWAL_GS, pageLocus: 'printed pp.311, 323 (PDF 310, 322): "There should be no papa kartari dosha for lagna"; "Kartari Dosha: Lagna hemmed between evil planets"' }),
  },
  GANDANTA: {
    SHRIDHAR: Object.freeze({ ...SHRIDHAR_HEA, pageLocus: '§8.1.7, printed pp.173-174 (PDF 217-218): "Ending 12 minutes time of Cancer, Scorpio & Pisces, and starting 12 minutes of Aries, Leo & Sagittarius as rising sign is called Lagna (ascendant) Gandanta"; "If Jupiter is strong then Lagna Gandanta ... powerless (Shakalya Samhita)"' }),
    WILHELM: Object.freeze({ ...WILHELM_E, pageLocus: 'printed p.138 (PDF 146): "One half Nadi of the Lagna\'s movement translates into 3 degrees, therefore, avoid the last 3 degrees of Cancer, Scorpio and Pisces and the first 3 degrees of Aries, Leo, and Sagittarius"' }),
    MUHURTA_CHINTAMANI: Object.freeze({ ...MC_SHARMA, pageLocus: 'sloka 73, printed pp.183-184 (PDF 187-188): "The time of the last ½ ghati (12 minutes) of the Ascendants of Cancer, Scorpio and Pisces, and of the first ½ Ghati of those of Leo, Sagittarius, and Aries, is referred to as the Lagna or Ascendant \'Gandanta\'"; "if Jupiter is endowed with strength the Dosha ... of Lagna ... Gandanta is removed"' }),
    RANGACHARYA: Object.freeze({ ...RANGACHARYA_I, pageLocus: 'printed p.58 (PDF 66): "The last 1/2 ghati of Kataka, Vrischika and Meena and the first 1/2 ghati of Simha, Dhanus and Mesha"' }),
    AGARWAL: Object.freeze({ ...AGARWAL_GS, pageLocus: 'printed p.313 (PDF 312): "Lagna gadanta is last ½ ghati of sign 4, 8, 12 and 1st ½ ghati of sign 1, 5, 9"' }),
  },
});

const NOTES_LAGNA = ({
  PLACEMENTS: [
    'நீக்கங்கள் (காட்டப்படுகின்றன, தீர்ப்பில் இல்லை): 6-ல் சுக்கிரன் நீசம் / பகை ராசியில், 8-ல் செவ்வாய் அஸ்தங்கம் / நீசம் / பகை ராசியில், 6, 8, 12-ல் சந்திரன் நீசம் எனில் தோஷம் இல்லை (முகூர்த்த சிந்தாமணி, ஸ்ரீதர், ரங்காச்சார்யா); புதன், குரு, சுக்கிரன் 1, 4, 10, 5, 9-ல் எல்லாத் தோஷங்களையும் நீக்கும் (முகூர்த்த சிந்தாமணி; வசிஷ்டா: 100, 200, 1,00,000).',
    'ஸ்ரீதர்: "பலமுள்ள கிரகங்கள் மட்டுமே புள்ளி தரும்" — பலம் இங்கே கணிக்கப்படவில்லை. ஐந்து கிரகங்கள் நல்ல இடத்தில் — "பஞ்சேஷ்ட லக்னம்".',
  ],
  ASHTAMA: ['பிறந்த லக்னம் இந்த நபருடையது; துணையின் பிறப்பையும் பார்க்க வேண்டும் (வில்ஹெல்ம், ஸ்ரீதர்) — இங்கே ஒருவருக்கு மட்டும். 8-ஆம் அதிபதி கேந்திரத்தில் சுபர் பார்வையுடன், சுப/சொந்த/நட்பு நவாம்சத்தில் எனில் நீக்கம் (முகூர்த்த சிந்தாமணி உரை, ரங்காச்சார்யா) — காட்டப்படுகிறது.'],
  PDB: ['பகல் = இந்த இடத்தின் சூரிய உதயம் முதல் அஸ்தமனம் வரை. குரு லக்னத்தையோ லக்னாதிபதியையோ பார்த்தால் (5, 7, 9-ஆம் பார்வை) தோஷம் இல்லை (முகூர்த்த சிந்தாமணி, வில்ஹெல்ம், அகர்வால்) — கணிக்கப்படுகிறது.', 'மற்றொரு கருத்து (முகூர்த்த சிந்தாமணி, ஸ்ரீதர், ரங்காச்சார்யா): பிற்பகல், மாலைச் சந்தி வேறு ராசிகள் — கணிக்கப்படவில்லை.'],
  KARTARI: ['சந்திரனுக்கும், 5, 7, 9-ஆம் இடங்களுக்கும் கர்த்தரி கூடாது (முகூர்த்த சிந்தாமணி, வசிஷ்டா, வில்ஹெல்ம்) — காட்டப்படவில்லை. நீக்கம்: லக்னத்தில் சுபர், 2-ல் சுபர், 12-ல் குரு, கர்த்தரிக் கிரகங்கள் நீசம் / பகை / அஸ்தங்கம் (ரங்காச்சார்யா, முகூர்த்த சிந்தாமணி).'],
  GANDANTA: ['பலமுள்ள குரு லக்ன கண்டாந்தத்தை நீக்கும் (முகூர்த்த சிந்தாமணி, ஸ்ரீதர்); அபிஜித் முகூர்த்தத்தில் கண்டாந்தம் இல்லை (வசிஷ்டர்). சிலர்: ஒவ்வொரு ராசியின் முதல், கடைசி 2 நிமிடமும் (ஸ்ரீதர்) — கணிக்கப்படவில்லை.'],
  GENERAL: [
    'மற்ற சுப காரியங்களுக்கு (மேலே "நிகழ்ச்சி" தேர்வு): பொது லக்ன சுத்தியும், எல்லாச் சுப காரியங்களுக்கும் என்று ஒரு நூல் சொல்லும் சோதனைகளும் மட்டும்; ஒவ்வொரு காரியத்துக்குமான தனி விதிகள் இன்னும் இல்லை.',
  ],
});

// ---------------------------------------------------------------------------
// The lagna's navamsa (added 2026-10-11)
// ---------------------------------------------------------------------------
// The lagna's navamsa: 108 to the zodiac, nine to a sign; its sign is the
// navamsa index mod 12. Vargottama when it is the lagna's own sign (the 1st of
// movable signs, the 5th of fixed, the 9th of dual).

const MOVABLE = Object.freeze([0, 3, 6, 9]);
const DUAL = Object.freeze([2, 5, 8, 11]);

/** The last navamsa, vargottama, and the movable navamsa of a movable lagna. */
const NAV_LAST = deepFreeze({
  default: 'MUHURTA_CHINTAMANI',
  order: ['MUHURTA_CHINTAMANI', 'SHRIDHAR', 'RANGACHARYA'],
  MUHURTA_CHINTAMANI: { labelTa: 'முகூர்த்த சிந்தாமணி ஸ்லோ.85', textTa: 'கடைசி (9-ஆம்) நவாம்சம் கூடாது — வர்கோத்தமம் எனில் சிறப்பு (உபய ராசிகளின் 9-ஆம் நவாம்சம் வர்கோத்தமம்). சந்திரன் துலாம் அல்லது மகரத்தில் இருந்தால் சர லக்னத்தில் சர நவாம்சம் கூடாது — வர்கோத்தமமும்.', booksTa: 'முகூர்த்த சிந்தாமணி, வில்ஹெல்ம், ஜோஷி' },
  SHRIDHAR: { labelTa: 'ஸ்ரீதர்', textTa: 'கடைசி நவாம்சம் கூடாது; மிதுனம், கன்னி, தனுசுவின் வர்கோத்தமம் விரும்பத்தக்கது; மீனம் வர்கோத்தமமும் கண்டாந்தம் — அதன் கடைசி நவாம்சம் கூடாது; துலாம், மகர வர்கோத்தமம் கூடாது ("மு.சி. 6/85" என அவர்); சந்திரன் துலாம் / மகரத்தில் எனில் சர லக்னத்தில் சர நவாம்சம் கூடாது — மேஷம், கடக வர்கோத்தமம் ஏற்கலாம்.', booksTa: 'ஸ்ரீதர் (முகூர்த்த மார்த்தாண்டம்)' },
  RANGACHARYA: { labelTa: 'ரங்காச்சார்யா', textTa: 'கடைசி நவாம்சம் வர்கோத்தமம் அல்லாவிட்டால் கூடாது; சர ராசிகளின் முதல் நவாம்சமும் குநவாம்சம்.', booksTa: 'ரங்காச்சார்யா' },
});

/** Which navamsas a marriage lagna may rise in (signs; 8 with `firstHalf` = the first half of Sagittarius's). */
const NAV_WHICH = deepFreeze({
  default: 'NARADA',
  order: ['NARADA', 'BENEFIC_LORD', 'RANGACHARYA', 'MUHURTA_CHINTAMANI', 'JOSHI', 'BIPED'],
  NARADA: { labelTa: 'மிதுனம், கன்னி, துலாம், தனுசு (முதல் பாதி)', textTa: 'இவை தவிர மற்ற நவாம்சங்கள் தீயவை (நாரத சம்ஹிதை 29/69-70, ஸ்ரீதர் வழியாக). காளிதாசர் (ஜ்யோதிர்வித்யாபரணம்): இதே; கடகம் நல்லதல்ல.', booksTa: 'ஸ்ரீதர் (நாரதர், காளிதாசர்)', signs: [2, 5, 6, 8], firstHalf: true },
  BENEFIC_LORD: { labelTa: 'சுப கிரகத்தின் நவாம்சம்', textTa: 'சந்திரன், புதன், குரு, சுக்கிரனின் நவாம்சம் (ரிஷபம், மிதுனம், கடகம், கன்னி, துலாம், தனுசு, மீனம்); சூரியன், செவ்வாய், சனியின் நவாம்சம் குநவாம்சம்.', booksTa: 'வில்ஹெல்ம், ராமன், அகர்வால் (குநவாம்சம்), ஸ்ரீதர் ("சுபர் நவாம்சம் அதிக நன்மை")', signs: [1, 2, 3, 5, 6, 8, 11], firstHalf: false },
  RANGACHARYA: { labelTa: 'ரிஷபம், மிதுனம், கன்னி, துலாம், தனுசு (முதல் பாதி)', textTa: 'இவை தவிர மற்றவை குநவாம்சம்.', booksTa: 'ரங்காச்சார்யா (வசிஷ்டர்: ரிஷபம்)', signs: [1, 2, 5, 6, 8], firstHalf: true },
  MUHURTA_CHINTAMANI: { labelTa: 'மிதுனம், கன்னி, துலாம், தனுசு, மீனம்', textTa: '"இந்த நவாம்சங்களில் மணமான பெண் கணவருக்கு உண்மையாக இருப்பாள்" (ஸ்லோ.84).', booksTa: 'முகூர்த்த சிந்தாமணி, வில்ஹெல்ம்', signs: [2, 5, 6, 8, 11], firstHalf: false },
  JOSHI: { labelTa: 'மிதுனம், கன்னி, துலாம், தனுசு', textTa: '"எந்த லக்னத்திலும் 7, 9, 3, 6-ஆம் ராசிகளின் நவாம்சம் சுபம்".', booksTa: 'ஜோஷி', signs: [2, 5, 6, 8], firstHalf: false },
  BIPED: { labelTa: 'இரு கால் ராசி — மிதுனம், கன்னி, துலாம்', textTa: '"உதய நவாம்சம் இரு கால் ராசியாக இருக்க வேண்டும்" (பிருஹத் சம்ஹிதை 100.7-8).', booksTa: 'அகர்வால்', signs: [2, 5, 6], firstHalf: false },
});

/** The navamsa of the birth chart's 8th and 12th. */
const NAV_NATAL = deepFreeze({
  default: 'MUHURTA_CHINTAMANI',
  order: ['MUHURTA_CHINTAMANI', 'JOSHI'],
  MUHURTA_CHINTAMANI: { labelTa: 'பிறந்த 8, 12-ன் நவாம்ச ராசி / அதிபதி லக்னத்தில்', textTa: 'பிறந்த லக்னத்தின் நவாம்ச எண்ணில் 8-ஆம், 12-ஆம் ராசிகளின் நவாம்ச ராசி முகூர்த்த லக்னமானால், அல்லது பிறந்த 8-ஆம் / 12-ஆம் அதிபதி இப்போது முகூர்த்த லக்னத்தில் இருந்தால் கூடாது (8 — தீமை, 12 — சண்டை). வில்ஹெல்மின் எடுத்துக்காட்டு: மேஷம் 6° (2-ஆம் நவாம்சம்) — விருச்சிகத்தின் 2-ஆம் நவாம்சம் சிம்மம்; சிம்ம லக்னம் கூடாது.', booksTa: 'முகூர்த்த சிந்தாமணி ஸ்லோ.79, வில்ஹெல்ம்' },
  JOSHI: { labelTa: 'உதய நவாம்சம் பிறப்பிலிருந்து 8, 12-ஆம் ராசி', textTa: 'உதய நவாம்ச ராசி பிறந்த லக்னத்துக்கோ ஜன்ம ராசிக்கோ 8, 12-ஆம் ராசி — அதிபதிகள் ஒன்று, நண்பர், அல்லது நட்பு-சமம் எனில் விலக்கு.', booksTa: 'ஜோஷி, ஸ்ரீதர் ("4, 8, 12 ராசியும் நவாம்சமும்")' },
});

/** Udaya (the lagna and its navamsa, for the groom) and asta (the 7th and the 7th navamsa, for the bride). */
const UDAYA = deepFreeze({
  default: 'SHRIDHAR',
  order: ['SHRIDHAR', 'MUHURTA_CHINTAMANI', 'ANY_OF_FOUR'],
  SHRIDHAR: { labelTa: 'ஸ்ரீதர் — எட்டில் ஒன்று / ஆறில் ஒன்று', textTa: 'உதயம்: (1) லக்னாதிபதி லக்னத்தைப் பார்க்க / இருக்க; (2) நவாம்சாதிபதி லக்னத்தைப் பார்க்க / இருக்க; (3) 7-ஆம் அதிபதி 7-ஐப் பார்க்க; (7) லக்ன, நவாம்ச, 7-ஆம் அதிபதிகளின் நண்பரான சுபர் லக்னத்தையோ நவாம்ச ராசியையோ பார்க்க; (8) நவாம்சாதிபதி, அவர் நண்பர், அல்லது சுபர் நவாம்ச ராசியில் இருக்க, அல்லது சுபர் அதைப் பார்க்க. அஸ்தம்: (a) 7-ஆம் நவாம்சாதிபதி அதைப் பார்க்க / இருக்க; (b) 7-ஆம் ராசியில் அவர் இருக்க / பார்க்க; (c) லக்னாதிபதி லக்னத்தைப் பார்க்க; (f) சுப நண்பர் 7-ஐயோ 7-ஆம் நவாம்ச ராசியையோ பார்க்க. இரண்டும் வேண்டும் ("இல்லையெனில் தவிர்ப்பது நல்லது"). (4), (5), (6), (d), (e) இவற்றுக்குள் அடங்கும்.', booksTa: 'ஸ்ரீதர் (§18.3.6)' },
  MUHURTA_CHINTAMANI: { labelTa: 'முகூர்த்த சிந்தாமணி ஸ்லோ.76', textTa: 'நவாம்சாதிபதி நவாம்ச ராசியையோ லக்னத்தையோ பார்க்க / இருக்க (மணமகனுக்கு); 7-ஆம் நவாம்சாதிபதி தன் ராசியையோ லக்னத்துக்கு 7-ஐயோ பார்க்க / இருக்க (மணமகளுக்கு); "இல்லையெனில் இருவருக்கும் தீது".', booksTa: 'முகூர்த்த சிந்தாமணி' },
  ANY_OF_FOUR: { labelTa: 'நான்கில் ஒன்று (லக்னாதிபதி / நவாம்சாதிபதி)', textTa: 'லக்னாதிபதியோ நவாம்சாதிபதியோ லக்னத்தையோ நவாம்ச ராசியையோ பார்க்க / இருக்க; 7-க்கும் அதே போல் 7-ஆம் அதிபதி, 7-ஆம் நவாம்சாதிபதி.', booksTa: 'ரங்காச்சார்யா, வில்ஹெல்ம்' },
});

/** Full aspects (Muhurta Chintamani's sloka on aspects = Parashara): the 7th for all; Mars 4, 8; Jupiter 5, 9; Saturn 3, 10. */
const ASPECTS = deepFreeze({ Sun: [7], Moon: [7], Mars: [4, 7, 8], Mercury: [7], Jupiter: [5, 7, 9], Venus: [7], Saturn: [3, 7, 10] });

// ---------------------------------------------------------------------------
// Shadvarga, decanate and the poison portions of the lagna (added 2026-10-11)
// ---------------------------------------------------------------------------

/** The benefics of the vargas (Rangacharya: the signs of Taurus … Pisces, the Moon's hora). */
const VARGA_BENEFICS = Object.freeze(['Moon', 'Mercury', 'Jupiter', 'Venus']);
/** The six vargas' lords (Rangacharya's definitions = Parashara): D1, D2 (hora), D3, D9, D12, D30. */
const VARGAS = Object.freeze(['D1', 'D2', 'D3', 'D9', 'D12', 'D30']);
const VARGA_TA = Object.freeze({ D1: 'ராசி', D2: 'ஹோரை', D3: 'திரேக்காணம்', D9: 'நவாம்சம்', D12: 'துவாதசாம்சம்', D30: 'திரிம்சாம்சம்' });
/** Trimsamsa: odd signs Mars 5°, Saturn 5°, Jupiter 8°, Mercury 7°, Venus 5°; even signs the reverse. */
const TRIMSAMSA = deepFreeze({ ODD: { ends: [5, 10, 18, 25, 30], lords: ['Mars', 'Saturn', 'Jupiter', 'Mercury', 'Venus'] }, EVEN: { ends: [5, 12, 20, 25, 30], lords: ['Venus', 'Mercury', 'Jupiter', 'Saturn', 'Mars'] } });

const SHADVARGA = deepFreeze({
  default: 'RANGACHARYA',
  order: ['RANGACHARYA', 'WILHELM', 'SHRIDHAR'],
  RANGACHARYA: { labelTa: 'ஆறில் நான்கு சுபர்', textTa: 'ராசி, ஹோரை, திரேக்காணம், நவாம்சம், துவாதசாம்சம், திரிம்சாம்சம் — ஆறில் குறைந்தது நான்கின் அதிபதி சுபர் (சந்திரன், புதன், குரு, சுக்கிரன்) எனில் ஏற்கலாம், இல்லையெனில் விலக்கு. எடுத்துக்காட்டு: மிதுனம் 26° — புதன், சந்திரன், சனி, சுக்கிரன், செவ்வாய், சுக்கிரன் — நான்கு.', booksTa: 'ரங்காச்சார்யா, வசிஷ்டா', min: 4 },
  WILHELM: { labelTa: 'பாவர் சுபரைவிட அதிகம் இல்லாமல்', textTa: 'பாவ வர்க்கங்கள் சுப வர்க்கங்களைவிட அதிகம் இருக்கக் கூடாது; மூன்று-மூன்று எனில் நவாம்ச அதிபதி சுபர்.', booksTa: 'வில்ஹெல்ம்', min: 3, tieNavamsa: true },
  SHRIDHAR: { labelTa: 'ஆறில் மூன்று சுபர்', textTa: 'மூன்று சுப வர்க்கம் — நடுத்தரம்; நான்கு அல்லது மேல் — நன்மை; நான்கு அல்லது மேல் பாவர் — தீமை. சுப அதிபதிகள் வக்கிரமாக இருக்கக் கூடாது (கணிக்கப்படவில்லை).', booksTa: 'ஸ்ரீதர் (நாரத சம்ஹிதை 29/17-18)', min: 3 },
});

/** Decanates: Shridhar's malefic ones and the nature of the three in movable, fixed and dual signs. */
const DREKKANA_MALEFIC = deepFreeze({ '3:2': 'SARPA', '11:2': 'SARPA', '7:0': 'SARPA', '7:1': 'PASHA', '9:0': 'NIGADA' });
const DREKKANA_NATURE = deepFreeze({ MOVABLE: ['AUSPICIOUS', 'NEUTRAL', 'NOT_DIGNIFIED'], FIXED: ['INAUSPICIOUS', 'AUSPICIOUS', 'NEUTRAL'], DUAL: ['NOT_DIGNIFIED', 'NEUTRAL', 'AUSPICIOUS'] });
const DREKKANA_TA = Object.freeze({ SARPA: 'சர்ப்ப திரேக்காணம்', PASHA: 'பாச திரேக்காணம்', NIGADA: 'நிகள திரேக்காணம்', AUSPICIOUS: 'சுபம்', NEUTRAL: 'சமம்', NOT_DIGNIFIED: 'சிறப்பில்லை', INAUSPICIOUS: 'அசுபம்' });
const DREKKANA = deepFreeze({
  default: 'MALEFIC',
  order: ['MALEFIC', 'MALEFIC_INAUSPICIOUS', 'AUSPICIOUS_ONLY'],
  MALEFIC: { labelTa: 'சர்ப்ப, பாச, நிகள திரேக்காணம் தவிர', textTa: 'கடகம், மீனத்தின் கடைசி, விருச்சிகத்தின் முதல் திரேக்காணம் சர்ப்பம்; விருச்சிகத்தின் 2-ஆவது பாசம்; மகரத்தின் முதலாவது நிகளம் — தவிர்க்க.', booksTa: 'ஸ்ரீதர்' },
  MALEFIC_INAUSPICIOUS: { labelTa: 'அவையும் "அசுப" திரேக்காணமும் தவிர', textTa: 'மேலும் ஸ்திர ராசிகளின் முதல் திரேக்காணம் (அட்டவணை 13.2: அசுபம்).', booksTa: 'ஸ்ரீதர் (அட்டவணை 13.2)' },
  AUSPICIOUS_ONLY: { labelTa: 'சுப திரேக்காணம் மட்டும்', textTa: 'சர ராசியின் முதல், ஸ்திரத்தின் நடு, உபயத்தின் கடைசி திரேக்காணம் மட்டும் ("பொதுவாகச் சுபம்").', booksTa: 'ஸ்ரீதர் (§18.3.2)' },
});

/** The poison portions of the lagna (vishanadi / visha ghatika / tyajya). Weekdays 0 = Sunday. */
const VISHANADI = deepFreeze({
  default: 'WILHELM',
  order: ['WILHELM', 'DEGREES', 'AGARWAL_DAYS', 'HALF_GHATI'],
  WILHELM: { labelTa: 'புஜங்க, க்ருத்ர, வராக நவாம்சம் (கிழமைப்படி)', textTa: 'மேஷம், ரிஷபம், கன்னி, தனுசுவின் 1-ஆம் நவாம்சம் (புஜங்கம்) — புதன், சனிக்கிழமை; மிதுனம், சிம்மம், துலாம், கும்பத்தின் 5-ஆம் (க்ருத்ரம்) — திங்கள், வெள்ளி; கடகம், விருச்சிகம், மகரம், மீனத்தின் 9-ஆம் (வராகம்) — செவ்வாய், வியாழன், ஞாயிறு.', booksTa: 'வில்ஹெல்ம், ஸ்ரீதர் (அட்டவணை 13.1)', groups: [{ signs: [0, 1, 5, 8], nav: 1, days: [3, 6] }, { signs: [2, 4, 6, 10], nav: 5, days: [1, 5] }, { signs: [3, 7, 9, 11], nav: 9, days: [2, 4, 0] }] },
  DEGREES: { labelTa: 'பாகைகள் — முதல் 3°, நடு 13°30′–16°30′, கடைசி 3°', textTa: 'மேஷம், ரிஷபம், தனுசு, கன்னியின் முதல் 3° (புஜங்கம்); மீனம், மகரம், கடகம், விருச்சிகத்தின் கடைசி 3° (ராகு); மிதுனம், துலாம், சிம்மம், கும்பத்தின் 13°30′–16°30′ (க்ருத்ரம்) — எல்லாக் கிழமையிலும்.', booksTa: 'ராமன், அகர்வால்' },
  AGARWAL_DAYS: { labelTa: 'எந்த ராசியிலும் கிழமைக்கு உரிய நவாம்சம்', textTa: 'எந்த ராசியிலும் 1-ஆம் நவாம்சம் புதன், சனி; நடு (5-ஆம்) திங்கள், வெள்ளி; கடைசி (9-ஆம்) செவ்வாய், வியாழன், ஞாயிறு.', booksTa: 'அகர்வால்' },
  HALF_GHATI: { labelTa: '½ நாழிகை (12 நிமிடம்)', textTa: 'அதே ராசிக் குழுக்களில் லக்னத்தின் முதல், நடு, கடைசி 12 நிமிடம்.', booksTa: 'கல்யாணராமன்; ஸ்ரீதர் ("சிலர்")' },
});
const VARA_TA = Object.freeze(['ஞாயிறு', 'திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி', 'சனி']);

const RANK_SHAD = {
  SHADVARGA: rank({ RANGACHARYA: 499, SHRIDHAR: 346, WILHELM: 145, VASHISTHA: 40, KALYANRAMAN: 16, RAMAN: 12, JOSHI: 9 }, 'ஷட்வர்க்கம் பற்றிய சொற்கள்: ரங்காச்சார்யா (பக்.52-54, எடுத்துக்காட்டுடன்) 499; ஸ்ரீதர் (பக்.309, 462-463) 346; வில்ஹெல்ம் (பக்.136-137) 145; வசிஷ்டா 40; கல்யாணராமன் 16; ராமன் 12; ஜோஷி 9. ராமனும் கல்யாணராமனும் "பாவர் ஷட்வர்க்கத்தில் பலமாக இருக்கக் கூடாது" என்கிறார்கள் — வேறு பொருள், கணிக்கப்படவில்லை.'),
  DREKKANA: rank({ SHRIDHAR: 203 }, 'திரேக்காணம் பற்றி ஸ்ரீதர் மட்டும் (பக்.311, 462) 203.'),
  VISHANADI: rank({ WILHELM: 213, SHRIDHAR: 191, RAMAN: 162, AGARWAL: 152, KALYANRAMAN: 97 }, 'லக்ன விஷ நாடி / தியாஜ்யம் பற்றிய சொற்கள்: வில்ஹெல்ம் (பக்.139-140) 213; ஸ்ரீதர் (ப.310, அட்டவணை 13.1) 191; ராமன் (PDF பக்.6, 12) 162; அகர்வால் (பக்.312, 324) 152; கல்யாணராமன் (ப.121) 97.'),
};
const SOURCES_SHAD = {
  SHADVARGA: {
    RANGACHARYA: Object.freeze({ ...RANGACHARYA_I, pageLocus: '"Papa Shadvarga", printed pp.52-54 (PDF 60-62): the six vargas and their lords — hora "In the odd sign the 1st hora (0°-15°) is ruled by the Sun and the 2nd hora (15°-30°) is ruled by the Moon"; drekkanas by the lords of the sign, its 5th and 9th; trimsamsa "in the odd signs, by mars for 5°, by Saturn for 5°, by Jupiter for 8°, by Mercury for 7°, and by Venus for 5°"; "If out of 6 vargas if even four belong to the benefic planets, the Muhurtha is acceptable, if otherwise it should be discarded. If the Moon is placed in the 11th house, the evil shadvarga has no effect"; the example "Muhurtha Lagna is Mithuna 26° ... gets four benefic lords (Mercury, Moon, Venus, Venus)"' }),
    SHRIDHAR: Object.freeze({ ...SHRIDHAR_HEA, pageLocus: 'printed pp.309, 462-463 (PDF 353, 501-502): "Lords of Shadvargas of the Muhurt ascendant should be benefic planets which should not be retrograde. If there are three benefic Vargas - average results are expected, if 4 or more than 4 benefic Vargas - benefic results follow; if 4 or more Vargas are of malefic planets - adverse results"; "More the benefic Shadvargas are present in the marriage ascendant, better"' }),
    WILHELM: Object.freeze({ ...WILHELM_E, pageLocus: 'printed pp.136-137 (PDF 144-145): "Papashadvarga- Malefic Shadvarga: The Lagna should not be in the Shadvargas of the malefics ... the Lagna should not be in more Rasis of malefics than it is in the Rasis of benefics. Ideally, the Lagna should be in more Rasis of benefics than of malefics or, if it is in an equal amount of benefic and malefic Rasis, the Navamsa Lagna should be in a benefic\'s Rasi"' }),
    VASHISTHA: Object.freeze({ ...VASHISTHA_KUSUM, pageLocus: 'printed p.108 (PDF 95): "Malefics in 6 vargas (shadvargas): Out of the 6 divisional charts, if benefics are the lords of more than 4 vargas lagnas, the marriage is auspicious, if less than 4 vargas lagna lords are malefics then leave the match"' }),
    KALYANRAMAN: Object.freeze({ ...KALYANRAMAN_V1, pageLocus: 'printed p.120 (PDF 130): "Paapa shadvarga: The malefics should never be strong in the Shadvargas of any election chart"' }),
    RAMAN: Object.freeze({ ...RAMAN_BV, pageLocus: 'Chapter V, PDF p.11: "Papashadvargs. - Malefics should not be strong in shadvargas in an election chart"' }),
    JOSHI: Object.freeze({ ...JOSHI_KK, pageLocus: 'printed p.73 (PDF 88): "\'Shadvargas\' (Six divisions) of malefics in muhurta lagna"' }),
  },
  DREKKANA: {
    SHRIDHAR: Object.freeze({ ...SHRIDHAR_HEA, pageLocus: 'printed pp.311, 462 (PDF 355, 501): "The last Decanate of Cancer & Pisces, & first of Scorpio are Sarp (snake) Decanate, 2nd Decanate of Scorpio is Paash (trapped in net), & 1st decanate of Capricorn is Nigada (tied with chain, fetters) - all these are malefic & hence be shunned"; Table 13.2, "Nature of decanates"; "First, middle & the last Decanate of moving, fixed & common signs respectively are auspicious in general"' }),
  },
  VISHANADI: {
    WILHELM: Object.freeze({ ...WILHELM_E, pageLocus: 'printed pp.139-140 (PDF 147-148): "Bhujanga: The 1st Navamsa of Aries, Taurus, Virgo and Sagittarius ... Exception: On Varas other than that of Mercury and Saturn, Bhujanga does not prevail. Gridhra: The 5th Navamsa of Gemini, Leo, Libra and Aquarius ... On Varas other than that of the Moon and Venus, Gridhra does not prevail. Varaha: The 9th Navamsa of Cancer, Scorpio, Capricorn and Pisces ... On Varas other than that of Mars, Jupiter and the Sun, Varaha does not prevail"; the exceptions' }),
    SHRIDHAR: Object.freeze({ ...SHRIDHAR_HEA, pageLocus: 'printed p.310 (PDF 354): "the first navamshas of Aries, Taurus, Virgo, & Sagittarius (called Bhujanga) should be avoided on Wednesday & Saturday. On other days there is no ill effect"; Table 13.1 "Malefic navamshas & days"; "Some opine that 12 minutes (half Ghati) in the beginning, middle & last should be avoided instead of the said navamshas"' }),
    RAMAN: Object.freeze({ ...RAMAN_BV, pageLocus: 'PDF p.6: "In Aries, Taurus, Sagittarius and Virgo, the first three degrees should be avoided ... (bhujanga) ... Pisces, Capricorn, Cancer and Scorpio, the last (three degrees) ... Rahu. The middle half ghati (13° 30\' to 16° 30\') should be rejected with regard to Gemini, Libra, Leo and Aquarius ... Gridhra"' }),
    AGARWAL: Object.freeze({ ...AGARWAL_GS, pageLocus: 'printed pp.312, 324 (PDF 311, 323): "The first navamsa of any sign on Wednesday and Saturday, the middle navamsa on Monday and Friday and the last navamsa on Tuesday, Thursday and Sunday"; the same degree portions as Raman' }),
    KALYANRAMAN: Object.freeze({ ...KALYANRAMAN_V1, pageLocus: 'printed p.121 (PDF 131): "For Aries, Taurus, Sagittarius and Virgo - the first ½ ghatika or 12 minutes ... For Cancer, Scorpio, Capricorn and Pisces - the last ½ ghatika ... For Gemini, Leo, Libra and Aquarius - the middle ½ ghatika"' }),
  },
};
const NOTES_SHAD = {
  SHADVARGA: ['ஹோரை, திரேக்காணம், துவாதசாம்சம், திரிம்சாம்சம் — ரங்காச்சார்யாவின் வரையறை (= பராசரர்). சந்திரன் 11-ல் இருந்தால் தீய ஷட்வர்க்கம் பலனற்றது (ரங்காச்சார்யா); குரு அல்லது சுக்கிரன் லக்னத்தில் / பார்த்தால் (வில்ஹெல்ம்) — காட்டப்படுகிறது, தீர்ப்பில் இல்லை.'],
  DREKKANA: ['திரேக்காண அதிபதி ஷட்வர்க்கத்திலும் எண்ணப்படுகிறார்; இது அதிலிருந்து தனி விதி.'],
  VISHANADI: ['கிழமை = இந்த இடத்தின் சூரிய உதயம் முதல் அடுத்த உதயம் வரை. நீக்கங்கள் (வில்ஹெல்ம்): சந்திரன் நல்ல நிலையில், குரு கேந்திரத்தில், லக்னத்தில் / லக்னத்தைப் பார்க்கும் சுபர் — காட்டப்படவில்லை. அகர்வால் நவாம்சம்-கிழமை, பாகை இரண்டு முறைகளையும் தருகிறார்.'],
};

// ---------------------------------------------------------------------------
// Lagna shuddhi for any auspicious act (added 2026-10-11)
// ---------------------------------------------------------------------------

const UPACHAYA = Object.freeze([3, 6, 10, 11]);
const KENDRA = Object.freeze([1, 4, 7, 10]);
/** Wilhelm's favourable lagnas, the benefics' signs: Taurus, Gemini, Cancer, Virgo, Libra, Sagittarius, Pisces. */
const BENEFIC_SIGNS = Object.freeze([1, 2, 3, 5, 6, 8, 11]);
/** Debilitation (BPHS): Jupiter in Capricorn, Venus in Virgo. */
const DEBILITATED = Object.freeze({ Jupiter: 9, Venus: 5 });
/**
 * The malefics for "malefics in 3, 6, 11" (Varahamihira) and "malefics in upachaya" (Agarwal):
 * the Sun, Mars and Saturn. Rahu and Ketu are always opposite and can never both be in
 * 3, 6, 11 or 3, 6, 10, 11, so a reading counting them could never pass (our reading).
 */
const MALEFICS_SEVEN = Object.freeze(['Sun', 'Mars', 'Saturn']);

/** Each book's lagna for "all auspicious deeds"; a reading lists the conditions that fail. */
const COMMON = deepFreeze({
  default: 'WILHELM',
  order: ['WILHELM', 'SHRIDHAR', 'MUHURTA_CHINTAMANI', 'VARAHAMIHIRA', 'AGARWAL', 'RAMAN'],
  WILHELM: { labelTa: 'வில்ஹெல்ம் — சுப ராசி, லக்னத்தில் பாவர் இல்லை, 8, 12 காலி', textTa: 'சுபரின் ராசிகள் (ரிஷபம், மிதுனம், கடகம், கன்னி, துலாம், தனுசு, மீனம்) லக்னமாக நல்லவை — சந்திரன் பாவராக (சூரியனிலிருந்து 60°-க்குள்) இருந்தால் கடகம் தவிர. பாவரின் ராசிகள் (மேஷம், சிம்மம், விருச்சிகம், மகரம், கும்பம்) தீயவை; குரு அல்லது சுக்கிரன் (நீச ராசியில் இல்லாமல்) லக்னத்தில் இருக்க / பார்க்க, அல்லது குரு கேந்திரத்தில் நட்பு ராசி அல்லது மேலான நிலையில் இருந்தால் நீங்கும். சந்திரன் உபசயத்தில் (3, 10, 11 — 6 அல்ல) இருந்தால் எந்த லக்னமும் நல்லது. லக்னத்தில் பாவர் கூடாது (சுக்கிரன் அல்லது சந்திரன் 10-ல், குரு கேந்திரத்தில் எனில் நீங்கும்). 8, 12-ஆம் வீடுகள் காலியாக.', booksTa: 'வில்ஹெல்ம் (அத்.15-16)' },
  SHRIDHAR: { labelTa: 'மு.சி. 2/44 — பிறந்த லக்னம் அல்லது ஜன்ம ராசியிலிருந்து உபசயம்', textTa: 'முகூர்த்த லக்னம் பிறந்த லக்னத்திலிருந்தோ ஜன்ம ராசியிலிருந்தோ 3, 6, 10, 11-ஆம் ராசி; சுபர் லக்னத்தில் இருக்க அல்லது பார்க்க; 8, 12-ஆம் வீடுகளில் கிரகம் இல்லை; சந்திரன் லக்னத்துக்கு 3, 6, 10, 11-ல் — "எல்லா வகைக் காரியத் தொடக்கத்துக்கும் நல்லது".', booksTa: 'ஸ்ரீதர் (மு.சி. 2/44-ஐ அவர் படிப்பது)', natal: 'EITHER' },
  MUHURTA_CHINTAMANI: { labelTa: 'மு.சி. 2/44 — பிறந்த லக்னம், ஜன்ம ராசி இரண்டிலிருந்தும் உபசயம்', textTa: 'அதே நான்கு நிபந்தனைகள்; உபசயம் பிறந்த லக்னத்திலிருந்தும் ஜன்ம ராசியிலிருந்தும் (கிரீஷ் சந்த் சர்மா, கல்யாணராமன்; ஸ்லோகம் "उपचये लग्नगे" என்று மட்டும் சொல்கிறது).', booksTa: 'முகூர்த்த சிந்தாமணி ஸ்லோ.2/44, கல்யாணராமன்', natal: 'BOTH' },
  VARAHAMIHIRA: { labelTa: 'வராஹமிஹிரர் (பி.ச. 98/16) — சுபர் 1, 4, 7, 8, 10, 12-ல், பாவர் 3, 6, 11-ல்', textTa: 'சுபர் (புதன், குரு, சுக்கிரன்) 1, 4, 7, 8, 10, 12-ஆம் வீடுகளில், பாவர் (சூரியன், செவ்வாய், சனி) 3, 6, 11-ல், குரு அல்லது சுக்கிரன் கேந்திரம் அல்லது திரிகோணத்தில் — "எல்லா விருப்பங்களும் நிறைவேறும்". எல்லாக் கிரகங்களும் அப்படி என்பது எங்கள் வாசிப்பு; அரிதாகவே வரும்.', booksTa: 'முகூர்த்த சிந்தாமணி உரைக்குறிப்பு, ஸ்ரீதர், கல்யாணராமன் (மேற்கோள்)' },
  AGARWAL: { labelTa: 'அகர்வால் — சர்வாரம்ப முகூர்த்தம்', textTa: '8, 12 காலியாக, பாவர் பார்வையின்றி; சுபர் நல்ல இடங்களில் (6, 8, 12 அல்லாமல் — எங்கள் வாசிப்பு); பாவர் (சூரியன், செவ்வாய், சனி) உபசயத்தில் (3, 6, 10, 11); லக்னம் ஜன்ம லக்னம் அல்லது ஜன்ம ராசியிலிருந்து 3, 6, 10, 11 — இல்லையெனில் கோசார சந்திரன் அவற்றிலிருந்து 3, 6, 10, 11-ல் இருந்தாலும் போதும் ("ராம பாணம்").', booksTa: 'அகர்வால்' },
  RAMAN: { labelTa: 'ராமன் — 21 மகா தோஷங்களில் லக்னக் கிரக நிலைகள்', textTa: 'சந்திரன் லக்னத்துக்கு 6, 8, 12-ல் கூடாது; சந்திரனுடன் வேறு கிரகம் கூடாது ("குறிப்பாகத் திருமணத்தில்"); சுக்கிரன் 6-ல் கூடாது (பிருகு ஷட்கம்); செவ்வாய் 8-ல் கூடாது (குஜாஷ்டமம்). இவரது மற்ற லக்ன தோஷங்கள் (கர்த்தரி, கண்டாந்தம், பாப ஷட்வர்க்கம், விஷ கடிகை, குநவாம்சம், அஷ்டம லக்னம், உதய-அஸ்த சுத்தி) தனிச் சோதனைகளாக.', booksTa: 'ராமன், கல்யாணராமன் (தொ.1)' },
});
const COMMON_WHY_TA = Object.freeze({
  MALEFIC_SIGN: 'பாவர் ராசி', CANCER_MOON: 'கடகம் — சந்திரன் பாவர்', MALEFIC_IN_LAGNA: 'லக்னத்தில் பாவர்', OCC_8: '8-ல் கிரகம்', OCC_12: '12-ல் கிரகம்',
  NOT_UPACHAYA: 'பிறப்பிலிருந்து உபசயம் இல்லை', NO_BENEFIC: 'லக்னத்தில் சுபர் இல்லை, பார்வையும் இல்லை', MOON_NOT_UPACHAYA: 'சந்திரன் உபசயத்தில் இல்லை',
  BENEFIC_PLACE: 'சுபர் 1, 4, 7, 8, 10, 12 அல்லாத இடத்தில்', MALEFIC_PLACE: 'பாவர் 3, 6, 11 அல்லாத இடத்தில்', NO_JUP_VEN: 'குரு / சுக்கிரன் கேந்திர-கோணத்தில் இல்லை',
  AFFLICT_8_12: '8 / 12-ஐ பாவர் பார்க்கிறார்', BENEFIC_DUSTHANA: 'சுபர் 6, 8, 12-ல்', MALEFIC_NOT_UPACHAYA: 'பாவர் உபசயத்தில் இல்லை',
  MOON_6_8_12: 'சந்திரன் 6, 8, 12-ல்', MOON_WITH: 'சந்திரனுடன் கிரகம்', VENUS_6: '6-ல் சுக்கிரன்', MARS_8: '8-ல் செவ்வாய்',
});

// ---------------------------------------------------------------------------
// Shridhar §13.10, adverse combinations for an election ascendant (added 2026-10-11)
// ---------------------------------------------------------------------------

/** Exaltation signs (debilitation is the 7th from them). */
const EXALTATION = Object.freeze({ Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6 });
/** The planets whose retrograde motion and combustion §13.10 looks at (Rahu and Ketu always move back; the Sun is never set). */
const MOVERS = Object.freeze(['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']);
const SETTERS = Object.freeze(['Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']);

const ADVERSE = deepFreeze({
  default: 'ALL',
  order: ['ALL', 'NO_OPINION'],
  ALL: { caution: ['NATAL_LORD_RETRO'], labelTa: 'ஸ்ரீதர் §13.10 — கணிக்கக்கூடிய எல்லாம்', textTa: '(1, 13) லக்னாதிபதி அஸ்தங்கம், 6, 8, 12-ல், நீசம், பகை ராசியில், வக்கிரம்; (3) பிறந்த லக்னம் / ஜன்ம ராசிக்கு 8-ஆம் அதிபதியின் (பிறப்பில்) நவாம்ச ராசி முகூர்த்த லக்னமாக; (4) 8-ஆம் அதிபதி லக்னத்தில்; (5) லக்னத்திலோ உதய நவாம்சத்திலோ பாவர்; (6, 12) பிறந்த லக்னாதிபதி / ஜன்ம ராசியதிபதி அஸ்தங்கம் அல்லது வக்கிரம்; (7) லக்னத்திலோ உதய நவாம்சத்திலோ வக்கிர / அஸ்தங்கக் கிரகம் (புதன் அஸ்தங்கம் பரவாயில்லை); (8) லக்னத்தில் சந்திரன் — மேஷம், ரிஷபம், கடகம் தவிர; (9, 11) லக்னத்துக்கோ சந்திரனுக்கோ 8-ல் பாவர்; (10) சந்திரன் 6, 8, 12-ல்; (14) பிறந்த 6 / 8-ஆம் அதிபதி 1, 6, 8-ல்; (15) சித்ர கிரகம் லக்னத்தில் அல்லது அதைப் பார்க்க.', booksTa: 'ஸ்ரீதர் (பல முனிவர்கள் மேற்கோள்)' },
  NO_OPINION: { caution: ['NATAL_LORD_RETRO'], labelTa: '"என்று கருதப்படுகிறது" தவிர', textTa: 'அதே, உருப்படி 8 (லக்னத்தில் சந்திரன் — "It is opined") இல்லாமல்.', booksTa: 'ஸ்ரீதர்', skip: ['MOON_IN_LAGNA'] },
});
/** Shown as a caution, never rejecting (the owner, 2026-10-11): the birth lords retrograde — Saturn and Jupiter are, for months each year. */
const ADVERSE_CAUTION_TA = 'பிறந்த லக்னாதிபதி / ராசியதிபதி வக்கிரம் — "கவனம்" மட்டும், விலக்கு அல்ல (உரிமையாளர் முடிவு 2026-10-11: சனி, குரு ஆண்டில் பல மாதங்கள் வக்கிரம்).';

/**
 * கட்டாயம் / விரும்பத்தக்கது (the owner, 2026-10-11): a MUST check rejects; a
 * PREFER check is shown as a caution. Our rule for the defaults: a check three
 * or more books state as a rejection is MUST; a check from one book only
 * (the decanate, Shridhar §13.10) is PREFER; udaya-asta is PREFER for acts other
 * than marriage (the owner). Every check's tier can be changed on the page.
 */
const TIERS = deepFreeze({
  MARRIAGE: { PLACEMENTS: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_LAST: 'MUST', NAV_WHICH: 'MUST', NAV_NATAL: 'MUST', UDAYA: 'MUST', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  OTHER: { COMMON: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  GRIHA_PRAVESHA: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  OLD_HOUSE: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  UPANAYANA: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  TRAVEL: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  VIDYARAMBHA: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  EDUCATION: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  BUSINESS: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  MEDICINE: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  SURGERY: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  BOAT_SHIP: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  WEAVING: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  POTTERY: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  PAINTING: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  SCULPTURE: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  CRAFT_LEARN: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  ARMY_RAISE: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  WAR_START: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  WEAPON_MAKE: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  WEAPON_WEAR: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  MISSILE_SETUP: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  ARMY_CAMP: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  DAGGER_TIE: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  TREATY: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  MINT_COINS: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  CATCH_THIEF: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  CATTLE: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  HORSE: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  ELEPHANT: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  GOAT_SHEEP: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  PET_ANIMALS: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  FISH_FARM: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  POULTRY: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  HUNTING: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  DISCOURSE: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  AGNYADHANA: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  MANTRA_SADHANA: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  DEITY_INSTALL: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  TEMPLE_START: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  MANTRA_DEEKSHA: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  HAVAN: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  IDOL_MAKING: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  PILLARS: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  DOOR_FRAME: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  ROOF: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  UPPER_STOREY: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  HOUSE_REPAIR: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  WELL_TANK: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  CONSTRUCTION_START: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  DIGGING: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  FOUNDATION: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  BUY_LAND: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  BUY_FARMLAND: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  BUY_HOUSE: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  LAND_POSSESSION: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  DIVIDE_PROPERTY: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  LEND_MONEY: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  BORROW_MONEY: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  REPAY_DEBT: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  COLLECT_MONEY: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  DEPOSIT_WEALTH: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  MAKE_WILL: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  PURCHASE_GOODS: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  SALE_GOODS: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  SPECULATION: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  LOTTERY: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  ACCOUNTS: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  ASSUMING_OFFICE: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  MEET_SUPERIOR: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  JOIN_SERVICE: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  JOB_APPLICATION: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  EMPLOY_SERVANT: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  FILE_SUIT: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  COMPROMISE: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  AGRI_GENERAL: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  FIELD_ENTRY: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  PLOUGHING: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  SOWING: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  TRANSPLANTING: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  TREE_PLANTING: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  GARDEN: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  HARVEST: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  THRESHING: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  GRAIN_STORAGE: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  NEW_GRAIN: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  NEW_CLOTHES: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  NEW_ORNAMENTS: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  ORNAMENT_MAKING: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  CLOTHES_WASHING: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  STITCHING: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  VEHICLE: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  VEHICLE_MAKE: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
  ROGA_SNANA: { EVENT: 'MUST', ASHTAMA: 'MUST', PDB: 'MUST', KARTARI: 'MUST', GANDANTA: 'MUST', BANA: 'MUST', NAV_WHICH: 'MUST', UDAYA: 'PREFER', SHADVARGA: 'MUST', DREKKANA: 'PREFER', VISHANADI: 'MUST', ADVERSE: 'PREFER' },
});
const TIER_TA = Object.freeze({ MUST: 'கட்டாயம்', PREFER: 'விரும்பத்தக்கது' });
const TIER_NOTE_TA = 'கட்டாயம் — பொருந்தாவிட்டால் விலக்கு; விரும்பத்தக்கது — "கவனம்" எனக் காட்டப்படும். இயல்பு: மூன்று அல்லது அதற்கு மேற்பட்ட நூல்கள் விலக்கச் சொல்பவை கட்டாயம்; ஒரே நூல் சொல்பவை (திரேக்காணம் — ஸ்ரீதர்; §13.10 — ஸ்ரீதர்) விரும்பத்தக்கவை; மற்ற காரியங்களுக்கு உதய-அஸ்த சுத்தி விரும்பத்தக்கது (உரிமையாளர் முடிவு). ஒவ்வொன்றையும் மாற்றலாம்.';
const ADVERSE_TA = Object.freeze({
  LORD_SET: 'லக்னாதிபதி அஸ்தங்கம்', LORD_6_8_12: 'லக்னாதிபதி 6, 8, 12-ல்', LORD_DEBIL: 'லக்னாதிபதி நீசம்', LORD_ENEMY: 'லக்னாதிபதி பகை ராசியில்', LORD_RETRO: 'லக்னாதிபதி வக்கிரம்',
  NAV8_LORD: 'பிறந்த 8-ஆம் அதிபதியின் நவாம்ச ராசி லக்னம்', LORD8_IN_LAGNA: '8-ஆம் அதிபதி லக்னத்தில்', MALEFIC_RISING: 'லக்னம் / உதய நவாம்சத்தில் பாவர்',
  NATAL_LORD_SET: 'பிறந்த லக்னாதிபதி / ராசியதிபதி அஸ்தங்கம்', NATAL_LORD_RETRO: 'பிறந்த லக்னாதிபதி / ராசியதிபதி வக்கிரம்', RISING_RETRO_SET: 'லக்னம் / உதய நவாம்சத்தில் வக்கிர / அஸ்தங்கக் கிரகம்',
  MOON_IN_LAGNA: 'லக்னத்தில் சந்திரன்', MALEFIC_8: 'லக்னம் / சந்திரனுக்கு 8-ல் பாவர்', MOON_6_8_12: 'சந்திரன் 6, 8, 12-ல்', NATAL_6_8_LORD: 'பிறந்த 6 / 8-ஆம் அதிபதி 1, 6, 8-ல்', CHHIDRA: 'சித்ர கிரகம் லக்னத்தில் / பார்வையில்',
});

/**
 * Which checks each kind of event takes. For an act other than marriage, only the checks a
 * book states for every auspicious act (SCOPE below); the marriage tables give way to COMMON.
 * `only` limits a check's readings to those stated for every act.
 */
const EVENTS = deepFreeze({
  default: 'MARRIAGE',
  order: ['MARRIAGE', 'OTHER', 'GRIHA_PRAVESHA', 'OLD_HOUSE', 'UPANAYANA', 'TRAVEL', 'VIDYARAMBHA', 'EDUCATION', 'BUSINESS', 'MEDICINE', 'SURGERY', 'ROGA_SNANA', 'VEHICLE', 'VEHICLE_MAKE', 'NEW_CLOTHES', 'NEW_ORNAMENTS', 'ORNAMENT_MAKING', 'CLOTHES_WASHING', 'STITCHING', 'AGRI_GENERAL', 'FIELD_ENTRY', 'PLOUGHING', 'SOWING', 'TRANSPLANTING', 'TREE_PLANTING', 'GARDEN', 'HARVEST', 'THRESHING', 'GRAIN_STORAGE', 'NEW_GRAIN', 'ASSUMING_OFFICE', 'MEET_SUPERIOR', 'JOIN_SERVICE', 'JOB_APPLICATION', 'EMPLOY_SERVANT', 'FILE_SUIT', 'COMPROMISE', 'LEND_MONEY', 'BORROW_MONEY', 'REPAY_DEBT', 'COLLECT_MONEY', 'DEPOSIT_WEALTH', 'MAKE_WILL', 'PURCHASE_GOODS', 'SALE_GOODS', 'SPECULATION', 'LOTTERY', 'ACCOUNTS', 'BUY_LAND', 'BUY_FARMLAND', 'BUY_HOUSE', 'LAND_POSSESSION', 'DIVIDE_PROPERTY', 'CONSTRUCTION_START', 'DIGGING', 'FOUNDATION', 'PILLARS', 'DOOR_FRAME', 'ROOF', 'UPPER_STOREY', 'HOUSE_REPAIR', 'WELL_TANK', 'DEITY_INSTALL', 'TEMPLE_START', 'MANTRA_DEEKSHA', 'HAVAN', 'IDOL_MAKING', 'DISCOURSE', 'AGNYADHANA', 'MANTRA_SADHANA', 'CATTLE', 'HORSE', 'ELEPHANT', 'GOAT_SHEEP', 'PET_ANIMALS', 'FISH_FARM', 'POULTRY', 'HUNTING', 'ARMY_RAISE', 'WAR_START', 'WEAPON_MAKE', 'WEAPON_WEAR', 'MISSILE_SETUP', 'ARMY_CAMP', 'DAGGER_TIE', 'TREATY', 'MINT_COINS', 'CATCH_THIEF', 'BOAT_SHIP', 'WEAVING', 'POTTERY', 'PAINTING', 'SCULPTURE', 'CRAFT_LEARN'],
  // The page's chooser: the acts by family (every act in `order` is in one group).
  groups: [
    { labelTa: 'திருமணம், பொது', ids: ['MARRIAGE', 'OTHER'] },
    { labelTa: 'வீடு', ids: ['GRIHA_PRAVESHA', 'OLD_HOUSE'] },
    { labelTa: 'சம்ஸ்காரம், கல்வி', ids: ['UPANAYANA', 'VIDYARAMBHA', 'EDUCATION'] },
    { labelTa: 'பயணம், வியாபாரம்', ids: ['TRAVEL', 'BUSINESS'] },
    { labelTa: 'மருத்துவம்', ids: ['MEDICINE', 'SURGERY', 'ROGA_SNANA'] },
    { labelTa: 'வாகனம்', ids: ['VEHICLE', 'VEHICLE_MAKE'] },
    { labelTa: 'ஆடை, ஆபரணம்', ids: ['NEW_CLOTHES', 'NEW_ORNAMENTS', 'ORNAMENT_MAKING', 'CLOTHES_WASHING', 'STITCHING'] },
    { labelTa: 'விவசாயம்', ids: ['AGRI_GENERAL', 'FIELD_ENTRY', 'PLOUGHING', 'SOWING', 'TRANSPLANTING', 'TREE_PLANTING', 'GARDEN', 'HARVEST', 'THRESHING', 'GRAIN_STORAGE', 'NEW_GRAIN'] },
    { labelTa: 'அரசு, வேலை, வழக்கு', ids: ['ASSUMING_OFFICE', 'MEET_SUPERIOR', 'JOIN_SERVICE', 'JOB_APPLICATION', 'EMPLOY_SERVANT', 'FILE_SUIT', 'COMPROMISE'] },
    { labelTa: 'பணம், வியாபாரம்', ids: ['LEND_MONEY', 'BORROW_MONEY', 'REPAY_DEBT', 'COLLECT_MONEY', 'DEPOSIT_WEALTH', 'MAKE_WILL', 'PURCHASE_GOODS', 'SALE_GOODS', 'SPECULATION', 'LOTTERY', 'ACCOUNTS'] },
    { labelTa: 'நிலம், வீடு, சொத்து', ids: ['BUY_LAND', 'BUY_FARMLAND', 'BUY_HOUSE', 'LAND_POSSESSION', 'DIVIDE_PROPERTY'] },
    { labelTa: 'வீடு கட்டுதல்', ids: ['CONSTRUCTION_START', 'DIGGING', 'FOUNDATION', 'PILLARS', 'DOOR_FRAME', 'ROOF', 'UPPER_STOREY', 'HOUSE_REPAIR', 'WELL_TANK'] },
    { labelTa: 'கோவில், தெய்வ வழிபாடு', ids: ['DEITY_INSTALL', 'TEMPLE_START', 'MANTRA_DEEKSHA', 'HAVAN', 'IDOL_MAKING', 'DISCOURSE', 'AGNYADHANA', 'MANTRA_SADHANA'] },
    { labelTa: 'விலங்கு, கால்நடை', ids: ['CATTLE', 'HORSE', 'ELEPHANT', 'GOAT_SHEEP', 'PET_ANIMALS', 'FISH_FARM', 'POULTRY', 'HUNTING'] },
    { labelTa: 'போர், அரசு', ids: ['ARMY_RAISE', 'WAR_START', 'WEAPON_MAKE', 'WEAPON_WEAR', 'MISSILE_SETUP', 'ARMY_CAMP', 'DAGGER_TIE', 'TREATY', 'MINT_COINS', 'CATCH_THIEF'] },
    { labelTa: 'கைவினை, தொழில்', ids: ['BOAT_SHIP', 'WEAVING', 'POTTERY', 'PAINTING', 'SCULPTURE', 'CRAFT_LEARN'] },
  ],
  MARRIAGE: { labelTa: 'திருமணம்', checks: ['PLACEMENTS', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_LAST', 'NAV_WHICH', 'NAV_NATAL', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: {} },
  OTHER: { labelTa: 'மற்ற சுப காரியம்', checks: ['COMMON', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] } },
  // An event with its own rules (eventMuhurtaTables.js): those take the general rule's place.
  GRIHA_PRAVESHA: { labelTa: 'கிரகப்பிரவேசம்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'GRIHA_PRAVESHA' },
  OLD_HOUSE: { labelTa: 'பழைய வீடு', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'OLD_HOUSE' },
  UPANAYANA: { labelTa: 'உபநயனம்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'UPANAYANA' },
  TRAVEL: { labelTa: 'பயணம்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'TRAVEL' },
  VIDYARAMBHA: { labelTa: 'வித்யாரம்பம்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'VIDYARAMBHA' },
  EDUCATION: { labelTa: 'கல்வி தொடக்கம்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'EDUCATION' },
  BUSINESS: { labelTa: 'வியாபாரம்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'BUSINESS' },
  MEDICINE: { labelTa: 'மருந்து / சிகிச்சை', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'MEDICINE' },
  SURGERY: { labelTa: 'அறுவை சிகிச்சை', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'SURGERY' },
  BOAT_SHIP: { labelTa: 'படகு, கப்பல்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'BOAT_SHIP' },
  WEAVING: { labelTa: 'நெசவு, துணி', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'WEAVING' },
  POTTERY: { labelTa: 'மண்பாண்டம்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'POTTERY' },
  PAINTING: { labelTa: 'ஓவியம்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'PAINTING' },
  SCULPTURE: { labelTa: 'சிற்பம், கல் வேலை', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'SCULPTURE' },
  CRAFT_LEARN: { labelTa: 'கைவினை கற்றல்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'CRAFT_LEARN' },
  ARMY_RAISE: { labelTa: 'சேனை, படை', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'ARMY_RAISE' },
  WAR_START: { labelTa: 'போர்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'WAR_START' },
  WEAPON_MAKE: { labelTa: 'ஆயுதம் செய்தல்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'WEAPON_MAKE' },
  WEAPON_WEAR: { labelTa: 'ஆயுதம் தரித்தல்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'WEAPON_WEAR' },
  MISSILE_SETUP: { labelTa: 'ஏவுகணை நிறுத்துதல்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'MISSILE_SETUP' },
  ARMY_CAMP: { labelTa: 'சேனை முகாம்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'ARMY_CAMP' },
  DAGGER_TIE: { labelTa: 'கத்தி கட்டுதல்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'DAGGER_TIE' },
  TREATY: { labelTa: 'உடன்படிக்கை, நட்பு', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'TREATY' },
  MINT_COINS: { labelTa: 'நாணயம் அடித்தல்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'MINT_COINS' },
  CATCH_THIEF: { labelTa: 'திருடனைப் பிடித்தல்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'CATCH_THIEF' },
  CATTLE: { labelTa: 'பசு, மாடு', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'CATTLE' },
  HORSE: { labelTa: 'குதிரை', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'HORSE' },
  ELEPHANT: { labelTa: 'யானை', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'ELEPHANT' },
  GOAT_SHEEP: { labelTa: 'ஆடு, எருமை', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'GOAT_SHEEP' },
  PET_ANIMALS: { labelTa: 'செல்லப் பிராணி', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'PET_ANIMALS' },
  FISH_FARM: { labelTa: 'மீன் வளர்ப்பு', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'FISH_FARM' },
  POULTRY: { labelTa: 'கோழி, பறவை', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'POULTRY' },
  HUNTING: { labelTa: 'வேட்டை', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'HUNTING' },
  DISCOURSE: { labelTa: 'புராணம், சொற்பொழிவு', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'DISCOURSE' },
  AGNYADHANA: { labelTa: 'அக்னியாதானம்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'AGNYADHANA' },
  MANTRA_SADHANA: { labelTa: 'மந்திர சாதனை', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'MANTRA_SADHANA' },
  DEITY_INSTALL: { labelTa: 'விக்கிரக பிரதிஷ்டை', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'DEITY_INSTALL' },
  TEMPLE_START: { labelTa: 'கோவில் கட்டத் தொடங்குதல்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'TEMPLE_START' },
  MANTRA_DEEKSHA: { labelTa: 'மந்திர தீட்சை', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'MANTRA_DEEKSHA' },
  HAVAN: { labelTa: 'ஹோமம், யாகம்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'HAVAN' },
  IDOL_MAKING: { labelTa: 'விக்கிரகம் செய்தல்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'IDOL_MAKING' },
  PILLARS: { labelTa: 'தூண் நடுதல்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'PILLARS' },
  DOOR_FRAME: { labelTa: 'வாசல் நிலை வைத்தல்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'DOOR_FRAME' },
  ROOF: { labelTa: 'கூரை வேய்தல்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'ROOF' },
  UPPER_STOREY: { labelTa: 'மேல் மாடி கட்டுதல்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'UPPER_STOREY' },
  HOUSE_REPAIR: { labelTa: 'வீடு பழுது பார்த்தல்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'HOUSE_REPAIR' },
  WELL_TANK: { labelTa: 'கிணறு வெட்டுதல்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'WELL_TANK' },
  CONSTRUCTION_START: { labelTa: 'வீடு கட்டத் தொடங்குதல்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'CONSTRUCTION_START' },
  DIGGING: { labelTa: 'அடித்தளம் தோண்டுதல்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'DIGGING' },
  FOUNDATION: { labelTa: 'அடிக்கல் நாட்டுதல்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'FOUNDATION' },
  BUY_LAND: { labelTa: 'நிலம் வாங்குதல்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'BUY_LAND' },
  BUY_FARMLAND: { labelTa: 'விவசாய நிலம் வாங்குதல்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'BUY_FARMLAND' },
  BUY_HOUSE: { labelTa: 'வீடு வாங்குதல்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'BUY_HOUSE' },
  LAND_POSSESSION: { labelTa: 'நிலத்தை ஆட்கொள்ளுதல்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'LAND_POSSESSION' },
  DIVIDE_PROPERTY: { labelTa: 'சொத்துப் பிரிவினை', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'DIVIDE_PROPERTY' },
  LEND_MONEY: { labelTa: 'கடன் கொடுத்தல்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'LEND_MONEY' },
  BORROW_MONEY: { labelTa: 'கடன் வாங்குதல்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'BORROW_MONEY' },
  REPAY_DEBT: { labelTa: 'கடன் திருப்பிச் செலுத்துதல்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'REPAY_DEBT' },
  COLLECT_MONEY: { labelTa: 'பணம் வசூல்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'COLLECT_MONEY' },
  DEPOSIT_WEALTH: { labelTa: 'பணம் வைப்பு, முதலீடு', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'DEPOSIT_WEALTH' },
  MAKE_WILL: { labelTa: 'உயில் எழுதுதல்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'MAKE_WILL' },
  PURCHASE_GOODS: { labelTa: 'பொருள் வாங்குதல்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'PURCHASE_GOODS' },
  SALE_GOODS: { labelTa: 'பொருள் விற்றல்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'SALE_GOODS' },
  SPECULATION: { labelTa: 'ஊக வணிகம்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'SPECULATION' },
  LOTTERY: { labelTa: 'லாட்டரி, போட்டி', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'LOTTERY' },
  ACCOUNTS: { labelTa: 'கணக்கு தொடங்குதல்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'ACCOUNTS' },
  ASSUMING_OFFICE: { labelTa: 'பதவி ஏற்பு', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'ASSUMING_OFFICE' },
  MEET_SUPERIOR: { labelTa: 'மேலதிகாரி சந்திப்பு', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'MEET_SUPERIOR' },
  JOIN_SERVICE: { labelTa: 'வேலையில் சேருதல்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'JOIN_SERVICE' },
  JOB_APPLICATION: { labelTa: 'வேலை விண்ணப்பம்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'JOB_APPLICATION' },
  EMPLOY_SERVANT: { labelTa: 'பணியாளரை வைத்தல்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'EMPLOY_SERVANT' },
  FILE_SUIT: { labelTa: 'வழக்குத் தொடுத்தல்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'FILE_SUIT' },
  COMPROMISE: { labelTa: 'சமரசம், ஒப்பந்தம்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'COMPROMISE' },
  AGRI_GENERAL: { labelTa: 'விவசாயப் பொது வேலை', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'AGRI_GENERAL' },
  FIELD_ENTRY: { labelTa: 'விவசாய நிலம் — முதல் அடி', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'FIELD_ENTRY' },
  PLOUGHING: { labelTa: 'உழுதல்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'PLOUGHING' },
  SOWING: { labelTa: 'விதைத்தல்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'SOWING' },
  TRANSPLANTING: { labelTa: 'நாற்று நடுதல்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'TRANSPLANTING' },
  TREE_PLANTING: { labelTa: 'மரம் நடுதல்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'TREE_PLANTING' },
  GARDEN: { labelTa: 'தோட்டம் அமைத்தல்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'GARDEN' },
  HARVEST: { labelTa: 'அறுவடை', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'HARVEST' },
  THRESHING: { labelTa: 'போரடித்தல்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'THRESHING' },
  GRAIN_STORAGE: { labelTa: 'தானியம் சேகரித்தல்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'GRAIN_STORAGE' },
  NEW_GRAIN: { labelTa: 'நவான்னம்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'NEW_GRAIN' },
  NEW_CLOTHES: { labelTa: 'புது ஆடை', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'NEW_CLOTHES' },
  NEW_ORNAMENTS: { labelTa: 'புது ஆபரணம்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'NEW_ORNAMENTS' },
  ORNAMENT_MAKING: { labelTa: 'ஆபரணம் செய்தல்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'ORNAMENT_MAKING' },
  CLOTHES_WASHING: { labelTa: 'ஆடை துவைத்தல்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'CLOTHES_WASHING' },
  STITCHING: { labelTa: 'தைத்தல்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'STITCHING' },
  VEHICLE: { labelTa: 'புது வாகனம்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'VEHICLE' },
  VEHICLE_MAKE: { labelTa: 'வாகனம் தயாரித்தல் / வியாபாரம்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'VEHICLE_MAKE' },
  ROGA_SNANA: { labelTa: 'நோய் நீங்கிய குளியல்', checks: ['EVENT', 'ASHTAMA', 'PDB', 'KARTARI', 'GANDANTA', 'NAV_WHICH', 'UDAYA', 'SHADVARGA', 'DREKKANA', 'VISHANADI', 'ADVERSE'], only: { NAV_WHICH: ['BENEFIC_LORD'], UDAYA: ['ANY_OF_FOUR'] }, event: 'ROGA_SNANA' },
});

const RANK_ADVERSE = {
  ADVERSE: rank({ SHRIDHAR: 492 }, 'லக்னத்தின் பாதகச் சேர்க்கைகள் பற்றி ஸ்ரீதர் மட்டும் (§13.10, பக்.323-325) 492 சொற்கள் — முனிவர்கள் வியாசர், காஷ்யபர் முதலியோரின் மேற்கோள்களுடன். மற்ற நூல்களின் இதே போன்ற தனி விதிகள் (சந்திரன் 6, 8, 12; 8-ல் செவ்வாய்) பொது லக்ன சுத்தியில் ராமனின் வாசிப்பாக.'),
};
const SOURCES_ADVERSE = {
  ADVERSE: {
    SHRIDHAR: Object.freeze({ ...SHRIDHAR_HEA, pageLocus: '§13.10, printed pp.323-325 (PDF 367-369): "1) If the lord of the election ascendant is set -he brings illness; in 6th house - causes fear from enemy; in 8th - causes death; in 12th - loss of money; if debilitated - causes injury to body; if in enemy\'s sign - inculcates fear from enemy. 2) 8th sign from the radical ascendant or the radical Moon sign ... 3) Navamsha sign of lords of 8th from radical Moon or radical ascendant, should not be in election ascendant. 4) Lord of 8th in Muhurt ascendant, or the Moon in 8th ... 5) Malefic(s) in rising sign or rising navamsha. 6) Lord of radical ascendant or radical Moon sign, is weak, set, retrograde ... 7) The rising navamsha or sign, having fast moving or retrograde or set planet (Mercury as set planet is acceptable for most of the applications). 8) It is opined that the Moon in the ascendant is to be avoided. However some opine that the Moon in Aries, Taurus & Cancer coinciding with ascendant is auspicious. 9) A malefic in 8th house from election ascendant or the election Moon ... 10) The Moon is adverse in 6th, 8th & 12th houses ... 11) ... when Mars is in 8th house ... 12) No auspicious work should be done when either lord of radical ascendant or Janma Rashi is set. 13) Lord of the election ascendant either in debilitation or in inimical sign or in retrogression ... also not welcomed in 6th house or 8th house ... 14) Radical 6th or 8th lord, in 1st, 6th & 8th houses of the election chart should be shunned ... 15) Relation / conjunction / aspect of Chhidra Graha ... a) Lord of 8th house. b) Planet(s) placed in 8th house. c) Planet aspecting 8th house. d) Lord of 22nd decanate (Khar Drekkhana) e) Planet conjoined with lord of 8th house. f) Bitter enemy of 8th house. g) Lord of 64th navamsha from the Moon. 16) Election ascendant is hemmed with malefics or afflicted by Kartari Dosha"; combustion, printed p.211 (PDF 255): "Jupiter becomes combust when he is within 11° from the Sun while in direct motion & does not become combust in its retrogration. Venus becomes combust when within 10° while in direct motion & 8° while in retrograde motion"' }),
  },
};
const NOTES_ADVERSE = {
  ADVERSE: [
    'உருப்படி 2 (பிறப்பிலிருந்து 8-ஆம் ராசி), 16 (கர்த்தரி) — தனிச் சோதனைகளாக ஏற்கனவே. 11 (8-ல் செவ்வாய்) உருப்படி 9-க்குள் அடங்கும்.',
    'அஸ்தங்கப் பாகை: சந்திரன் 12° (ஸ்ரீதர் §2.20.3, ப.45: "30, 1 திதிகள்"), குரு 11°, சுக்கிரன் 10° (வக்கிரம் 8°) — ஸ்ரீதர் ப.211; செவ்வாய் 17°, புதன் 14° (வக்கிரம் 12°), சனி 15° — பலதீபிகை, கபூர் குறிப்பு II.36 (ஸ்ரீதர் தரும் மூன்றும் அதே).',
    'நீசம் = உச்ச ராசிக்கு 7-ஆம் ராசி; பகை ராசி = BPHS இயற்கைப் பகைவரின் ராசி. உதய நவாம்சத்தில் கிரகம் = அதன் நவாம்ச ராசி உதய நவாம்ச ராசியே (நவாம்சச் சக்கரம்). வக்கிரம்: செவ்வாய், புதன், குரு, சுக்கிரன், சனி (ராகு, கேது எப்போதும் — கணக்கில் இல்லை).',
    'சித்ர கிரகங்கள் (எங்கள் வாசிப்பு — லக்னத்தில் இருத்தல் அல்லது முழுப் பார்வை "சம்பந்தம்"): 8-ஆம் அதிபதி; 8-ல் உள்ளவர்; 8-ஐப் பார்ப்பவர்; 22-ஆம் திரேக்காணாதிபதி (லக்னத் திரேக்காணம் முதலாக — 8-ஆம் ராசியின் அதே எண் திரேக்காணம்); 8-ஆம் அதிபதியுடன் சேர்ந்தவர்; சந்திரன் நின்ற நவாம்சம் முதலாக 64-ஆம் நவாம்சத்தின் அதிபதி. (f) "8-க்குக் கடும் பகைவர்" (தற்காலிக உறவு தேவை) கணிக்கப்படவில்லை.',
    'கணிக்கப்படாதவை: "பலவீனம்", "வேகமாகச் செல்லும்" (அதிசாரம்) கிரகம், "போரில் தோற்ற", "பகைவர் சேர்ந்த / பார்த்த" லக்னாதிபதி, பிறந்த லக்னம் / ராசியில் உள்ள கிரகங்கள் "பாதகமாக" இருப்பது.',
  ],
};

const RANK_COMMON = {
  COMMON: rank({ WILHELM: 628, SHRIDHAR: 488, MUHURTA_CHINTAMANI: 276, KALYANRAMAN: 261, AGARWAL: 136, RAMAN: 130, VASHISTHA: 108 }, 'எல்லாச் சுப காரியங்களுக்குமான லக்னம் பற்றிய சொற்கள்: வில்ஹெல்ம் (பக்.119-121, 125-126) 628; ஸ்ரீதர் (பக்.317, 319-320 — மு.சி. 2/44, பி.ச. 98/16, அவரது 12 பல நிலைகள்) 488; முகூர்த்த சிந்தாமணி (ப.79, ஸ்லோ.2/44 உரையுடன்) 276; கல்யாணராமன் (தொ.2 ப.231; தொ.1 பக்.117, 120) 261; அகர்வால் (ப.327, சர்வாரம்பம்) 136; ராமன் (அத்.V) 130; வசிஷ்டா (ப.137 — காரியத்தின் தன்மைக்கேற்ப சர / ஸ்திர / உபய லக்னம்; கணிக்கப்படவில்லை) 108. ரங்காச்சார்யா, ஜோஷி ஒவ்வொரு காரியத்துக்கும் தனி லக்னம் தருகிறார்கள்; பொது விதி இல்லை.'),
};
const SOURCES_COMMON = {
  COMMON: {
    WILHELM: Object.freeze({ ...WILHELM_E, pageLocus: 'chapters 15-16, printed pp.119-121, 125-126 (PDF 127-129, 133-134): "The Rasis of the benefic planets: Taurus, Gemini, Cancer, Virgo, Libra, Sagittarius and Pisces are generally favorable for most beneficial activities ... When the Moon is a malefic, Cancer Lagna is best avoided"; "Exception: Jupiter or Venus in or aspecting the Lagna overcomes the adverse effects of an unfavorable Lagna (so long as they are not in debilitation Rasi or Navamsa). Exception: Jupiter in a friendly Rasi or better in an angle overcomes the ill effects of an unfavorable Lagna"; "There should be no malefics in the Lagna or Navamsa Lagna at the time of beginning any activity. Exception: Venus or the Moon in the 10th and Jupiter in an angle"; "any Lagna is rendered favorable if the Moon is in an Upachaya"; "For beneficial events, the 8th and 12th Bhavas are best left unoccupied"' }),
    SHRIDHAR: Object.freeze({ ...SHRIDHAR_HEA, pageLocus: '§13.6-13.7, printed pp.317, 319-320 (PDF 361, 363-364): "According to B.S. (98/16), benefics in 1,4,7,10, 8, 12 houses, malefics in 3,6,11 houses, and Jupiter or Venus in an angle or in a trine bestow fruition of all the desires. But according to M.C. (2/44); 8th & 12th houses should be vacant. If rising sign is 3rd or 6th or 10th or 11th sign either from radical ascendant or J.R. of the doer; & a benefic is either poised in rising sign or aspects it; and, 8th & 12th houses are Shuddha (no planet); & the Moon is either in 3rd or 6th Or 10th or 11th sign from the election ascendant then, such an ascendant is fortuitous for starting all types of works (M.C.-2/44)"; 13.7 "Fortification of election ascendant", items 1-12' }),
    MUHURTA_CHINTAMANI: Object.freeze({ ...MC_SHARMA, pageLocus: 'sloka 2/44, printed p.79 (PDF 83): "व्ययाष्टशुद्धोपचये लग्नगे शुभदृग्युते । चन्द्रे त्रिषड्दशायस्थे सर्वारम्भः प्रसिद्ध्यति"; "THE FAVOURABLE OR SUITABLE LAGNA OR ASCENDANT FOR DOING ALL THE ORDINARY AUSPICIOUS DEEDS ... the 3rd, the 6th, the 10th and the 11th House from the Natal Ascendant and from the sign in which there is the Moon ... there should be no planet in the 8th and the 12th House ... the conjunction or aspect of the Benefic Planets on the Ascendant; and if the Moon is also there in the Upachaya signs (3/6/10/11) from the Ascendant"; note: Varahamihira, Brihat Samhita, "Benefic Planets in the 12/1/4/7/10/8 Houses; the Malefic Planets should remain in the 3/6/11 Houses; and in an Angle or in a Trine there should be Jupiter and Venus"' }),
    KALYANRAMAN: Object.freeze({ ...KALYANRAMAN_V2, pageLocus: '"Conducting Auspicious Functions or Ceremonies", notes, printed p.231 (PDF 233): "Muhoortha Chintaamani prefers the Lagna in Upachaya houses, 3/6/10/11 from the natal ascendant and from the Janma raasi, of the person concerned. Houses 8/12 must be free. Ascendant to be associated or aspected by Benefics. The Moon is in Upachaya 3/6/10/11 from ascendant. 2. Varaahamihira in Brihat Samhita holds that Lagna Suddhi or auspicious ascendant is required for all deeds. Benefics in 1/4/7/8/10/12 houses, malefics in 3/6/11 and Jupiter and Venus in any angle or trine are especially good"; vol.1 printed pp.117, 120 (PDF 127, 130): the Moon "in the 6th, 8th or 12th houses from the Lagna chosen for any election"; "Venus must never be in the 6th house"; "Mars should never be posited in the 8th house"' }),
    AGARWAL: Object.freeze({ ...AGARWAL_GS, pageLocus: '"Sarvarambha muhurta", printed p.327 (PDF 326): "A lagna may be elected where 8th & 12th houses be vacant & free from affliction. Benefics be in auspicious houses and malefics in upachaya, lagna must fall in 3rd, 6th, 10th or 11th from one\'s janma lagna or janma rasi"; "If lagna does not fulfil this condition, it may suffice if Moon is transiting in 3rd, 6th, 10th or 11th from one\'s Janma lagna or Janma rasi. It is rama-bana formula"' }),
    RAMAN: Object.freeze({ ...RAMAN_BV, pageLocus: 'Chapter V, PDF pp.10-11: "There are said to be 21 great evils (ekavimsati mahadoshas) which are to be avoided for any auspicious work"; "4. Shashtashta Riphagatha Chandra Dosha. - The Moon should invariably be avoided in the 6th, 8th and 12th houses from the Lagna"; "5. Sagraha Chandra Dosha. - The Moon\'s association with any other planet, benefic or malefic, should be avoided. This injunction is specially applicable in case of marriage"; "10. Bhrigu Shatka. - The position of Venus in the 6th is injurious"; "11. Kujasthama: - Mars should be avoided in the 8th house"' }),
    VASHISTHA: Object.freeze({ ...VASHISTHA_KUSUM, pageLocus: '"Some Important Principles of Muhurta Election", printed p.137 (PDF 124): "The nature of the work should be looked into first ... The chara lagna is most appropriate ... a sthira or fixed lagna ... Works of mixed nature like setting up machines etc. should be done in dual lagnas"; "Lagna should be unafflicted, strong and powerful"' }),
  },
};
/** The books that state a check for every auspicious act (the reason it applies to OTHER). */
const SCOPE = deepFreeze({
  ASHTAMA: [
    { ...KALYANRAMAN_V1, pageLocus: 'printed p.120 (PDF 130), "12. Ashtama lagna dosha": the rising sign "must not be the 8th from the Janma Lagna of the person doing the deed or of the bride and bridegroom, in the case of any marriage"' },
    { ...SHRIDHAR_HEA, pageLocus: '§13.10, printed p.323 (PDF 367), "Adverse combinations for election ascendant": "2) 8th sign from the radical ascendant or the radical Moon sign, as rising sign of election"' },
  ],
  PDB: [
    { ...WILHELM_E, pageLocus: 'chapter 15 "Lagna", printed pp.122-123 (PDF 130-131): "Blind Rasis cause impediments and should be avoided as Lagnas"; deaf "cause loss"; lame "adverse for longevity"' },
  ],
  KARTARI: [
    { ...KALYANRAMAN_V1, pageLocus: 'printed p.117 (PDF 127), "3. Kartharidosha": "This must be avoided for all auspicious functions and especially marriage"' },
    { ...RAMAN_BV, pageLocus: 'Chapter V, PDF pp.10-11, "3. Karthari Dosha": "it should be rejected for good work particularly in regard to marriage"' },
    { ...SHRIDHAR_HEA, pageLocus: '§13.10, printed p.325 (PDF 369): "16) Election ascendant is hemmed with malefics or afflicted by Kartari Dosha"' },
  ],
  GANDANTA: [
    { ...KALYANRAMAN_V1, pageLocus: 'printed pp.119-120 (PDF 129-130), "8. Gandaanthara": "These three Gandaantha doshas are to be avoided in the selection of any muhoortha"' },
  ],
  NAV_WHICH: [
    { ...WILHELM_E, pageLocus: 'chapter 15, printed p.123 (PDF 131): "The Navamsa Lagna should be that of a benefic planet when performing any beneficial activities"' },
    { ...KALYANRAMAN_V1, pageLocus: 'printed p.121 (PDF 131), "14. Kunavaamsa dosha": "The Lagna selected for any auspicious event should not occupy the navaamsa of any malefic"' },
    { ...RAMAN_BV, pageLocus: 'Chapter V, PDF p.12: "14. Kunavamsa Dosha. - The Lagna selected for an auspicious work should not occupy the Navamsa of a malefic"' },
  ],
  UDAYA: [
    { ...KALYANRAMAN_V1, pageLocus: 'printed p.117 (PDF 127), "6. Udayaasthasudhi": "They have to be strong for all elections. The Lagna can be occupied by its own lord and so also the navaamsa Lagna by its lord. This can be as well vice versa. Or else the lord of Lagna should aspect the navaamsa Lagna or vice versa. Similarly the seventh house and its lord should be favourably disposed"' },
    { ...RAMAN_BV, pageLocus: 'Chapter V, PDF p.11: "The strength of Lagna and the seventh is necessary in all elections but especially so in regard to marriage"' },
  ],
  SHADVARGA: [
    { ...KALYANRAMAN_V1, pageLocus: 'printed p.120 (PDF 130), "9. Paapa shadvarga": "The malefics should never be strong in the Shadvargas of any election chart"' },
    { ...SHRIDHAR_HEA, pageLocus: 'chapter 13 "Purification of election ascendant", printed p.309 (PDF 353)' },
  ],
  DREKKANA: [
    { ...SHRIDHAR_HEA, pageLocus: 'chapter 13 "Purification of election ascendant", printed p.311 (PDF 355)' },
  ],
  ADVERSE: [
    { ...SHRIDHAR_HEA, pageLocus: 'chapter 13 "Purification of election ascendant", §13.10 "Adverse combinations for election ascendant", printed pp.323-325 (PDF 367-369)' },
  ],
  VISHANADI: [
    { ...KALYANRAMAN_V1, pageLocus: 'printed p.121 (PDF 131), "13. Raasi vishaghatika": "Such portions of raasis must not form the part of the Lagna chosen for any auspicious event"' },
    { ...RAMAN_BV, pageLocus: 'Chapter V, PDF p.12: "13. Rasi Visha Ghatika ... They are to be rejected for all auspicious work"' },
  ],
});
/** Why the marriage-only checks are left out for other acts. */
const SCOPE_OUT_TA = Object.freeze({
  PLACEMENTS: 'கிரக நிலை, புள்ளிகள் — திருமண அட்டவணைகள் (ஸ்ரீதர் அட்டவணை 18.5 "திருமண விஸ்வ பலம்", மு.சி. விவாஹ ப்ரகரணம் 86-88); இங்கே பொது லக்ன சுத்தி அதன் இடத்தில்.',
  NAV_LAST: 'கடைசி நவாம்சம் — மு.சி. ஸ்லோ.85 திருமணத்துக்கு ("பெண்ணுக்குக் கடைசி நவாம்சத்தில் திருமணம் கூடாது"). வில்ஹெல்மின் பொது விதி (நட்சத்திர, திதி, வார விஷ நாடியுடன் கடைசி நவாம்சம்) கணிக்கப்படவில்லை.',
  NAV_NATAL: 'பிறந்த 8, 12-ன் நவாம்சம் — மு.சி. ஸ்லோ.79 திருமணத்துக்கு. ஸ்ரீதரின் பொது விதி (§13.10.3: பிறந்த 8-ஆம் அதிபதிகளின் நவாம்ச ராசி லக்னமாகக் கூடாது) வேறு — கணிக்கப்படவில்லை.',
});
const NOTES_COMMON = {
  COMMON: [
    'சுபர் = புதன், குரு, சுக்கிரன்; பார்வை ராசிச் சக்கரத்தில் (முழுப் பார்வை). 8, 12 காலி = ஒன்பது கிரகங்களில் எதுவும் இல்லை.',
    'வில்ஹெல்ம்: நவாம்ச லக்னத்தில் பாவர், குரு / சுக்கிரனின் நவாம்ச நீசம் கணிக்கப்படவில்லை; "கேந்திரங்களில் பாவரைவிட சுபர் அதிகம்" — "நல்ல வழக்கம்", தீர்ப்பில் இல்லை.',
    'ஸ்ரீதரின் §13.10 பாதகச் சேர்க்கைகள் (லக்னாதிபதி அஸ்தங்கம் / 6, 8, 12 / நீசம், 8-ஆம் அதிபதி லக்னத்தில், உதய நவாம்சத்தில் பாவர், சித்ர கிரகங்கள் …), மாச / திதி சூன்ய லக்னங்கள் (ஸ்ரீதர் அட்டவணை 13.4, வில்ஹெல்ம்) இன்னும் கணிக்கப்படவில்லை.',
    'நீக்கங்கள் (காட்டப்படவில்லை): லக்னத்தில் / கேந்திரத்தில் குரு, சுக்கிரன், புதன் பல தோஷங்களை நீக்கும்; சந்திரன் அல்லது சூரியன் 11-ல் (ஸ்ரீதர், ராமன்).',
    'ஒவ்வொரு காரியத்துக்கும் தனி லக்ன விதிகள் (கிரகப்பிரவேசம், உபநயனம், பயணம் …) நூல்களில் உண்டு — இது அவற்றுக்கு முந்தைய பொது விதி.',
  ],
};

const RANK = deepFreeze({
  ...RANK_LAGNA,
  ...RANK_SHAD,
  ...RANK_COMMON,
  ...RANK_ADVERSE,
  NAV_LAST: rank({ MUHURTA_CHINTAMANI: 156, SHRIDHAR: 146, WILHELM: 46, RANGACHARYA: 35, JOSHI: 32 }, 'கடைசி நவாம்சம், வர்கோத்தமம், சர நவாம்சம் பற்றிய சொற்கள்: முகூர்த்த சிந்தாமணி (ப.213) 156; ஸ்ரீதர் (பக்.458, 461) 146; வில்ஹெல்ம் 46; ரங்காச்சார்யா 35; ஜோஷி 32.'),
  NAV_WHICH: rank({ SHRIDHAR: 390, WILHELM: 80, RANGACHARYA: 56, MUHURTA_CHINTAMANI: 43, AGARWAL: 22, RAMAN: 18, JOSHI: 16 }, 'எந்த நவாம்சம் என்பது பற்றிய சொற்கள்: ஸ்ரீதர் (பக்.459-461, 463 — நாரதர், காளிதாசர், வசிஷ்டர், பி.க. மேற்கோள்கள்) 390; வில்ஹெல்ம் (பக்.123, 261) 80; ரங்காச்சார்யா (ப.54) 56; முகூர்த்த சிந்தாமணி (ப.212) 43; அகர்வால் 22; ராமன் 18; ஜோஷி 16. ஸ்ரீதர் தானே விதியாகச் சொல்வது நாரதருடையது.'),
  NAV_NATAL: rank({ MUHURTA_CHINTAMANI: 145, SHRIDHAR: 127, WILHELM: 83, JOSHI: 75 }, 'பிறந்த 8, 12-ன் நவாம்சம் பற்றிய சொற்கள்: முகூர்த்த சிந்தாமணி (ப.187) 145; ஸ்ரீதர் (பக்.461-462) 127; வில்ஹெல்ம் (ப.261) 83; ஜோஷி (ப.77) 75.'),
  UDAYA: rank({ SHRIDHAR: 905, MUHURTA_CHINTAMANI: 789, WILHELM: 135, RANGACHARYA: 95 }, 'உதய-அஸ்த சுத்தி பற்றிய சொற்கள்: ஸ்ரீதர் (§18.3.6, பக்.469-471) 905; முகூர்த்த சிந்தாமணி (ஸ்லோ.75-78, பக்.208-210) 789; வில்ஹெல்ம் (ப.266) 135; ரங்காச்சார்யா (ப.54) 95.'),
});

const SOURCES = deepFreeze({
  ...SOURCES_LAGNA,
  ...SOURCES_SHAD,
  ...SOURCES_COMMON,
  ...SOURCES_ADVERSE,
  NAV_LAST: {
    MUHURTA_CHINTAMANI: Object.freeze({ ...MC_SHARMA, pageLocus: 'sloka 85, printed p.213 (PDF 217): "नो चरलग्ने चरलवयोगं तौलिमृगस्थे शशिमृति कुर्यात्"; "A daughter should not be married in the last Navamsha, but if the Navamsha of a sign is Vargottama and marriage is done in it, then it is excellent. But if the Moon is situated in the Libra or Capricorn sign, then marriage should not be done in the movable Navamsha of a Movable Ascendant, that is, even Vargottama is not auspicious"' }),
    SHRIDHAR: Object.freeze({ ...SHRIDHAR_HEA, pageLocus: 'printed pp.458, 461 (PDF 497, 500): "The Moon, the Lagna & navamsha; all the three should not be in movable signs ... However, Vargottama navamshas of Aries & Cancer are acceptable"; "Last navamsha of a sign should be left in marriage. Vargottama navamsha of Gemini, Virgo, Sagittarius & Pisces are preferred (M.M.). Vargottama navamshas of Libra & Capricorn are bad for marriage (M.C-6/85) ... Pisces sign & navamsha though Vargottama is not acceptable"' }),
    WILHELM: Object.freeze({ ...WILHELM_E, pageLocus: 'printed p.261 (PDF 269): "The Navamsa should not be the last Navamsa of any Rasi, unless it is the Vargottama Navamsa ... If the Moon is in Libra or Capricorn, then marriage should not be performed in the moveable Navamsa of a moveable Rasi"' }),
    RANGACHARYA: Object.freeze({ ...RANGACHARYA_I, pageLocus: 'printed p.54 (PDF 62): "The last navamsa (9th navamsa) though benefic should be eschewed unless it is Vargottama ... The first navamsa of the cardinal signs also are Kunavamsas"' }),
    JOSHI: Object.freeze({ ...JOSHI_KK, pageLocus: 'printed p.77 (PDF 92): "Last navamsha of a sign should be avoided except where it is Vargottama navamsha. Movable lagna, movable navamsha should be avoided when moon is placed in Libra or Capricorn"' }),
  },
  NAV_WHICH: {
    SHRIDHAR: Object.freeze({ ...SHRIDHAR_HEA, pageLocus: 'printed pp.459-461, 463 (PDF 498-500, 502): "Acharya Kalidas opines that Gemini, Virgo & Libra navamshas of all the signs, all the movable signs but without movable navamshas, & first half of Sagittarius are auspicious for wedlock. And Cancer is not beneficial"; "Sage Narad adds Sagittarius navamsha also as a benefic navamsha, & commends that navamshas other than Gemini, Virgo, Libra & Sagittarius (first half), are malefic navamshas (N.S.-29/69-70)"; "Navamshas of benefic planets augur more auspiciousness"' }),
    WILHELM: Object.freeze({ ...WILHELM_E, pageLocus: 'printed pp.123, 261 (PDF 131, 269): "The Navamsa Lagna should be that of a benefic planet when performing any beneficial activities"; "The Navamsas of the Sun, Mars and Saturn should be avoided ... The Navamsas of the Moon, Mercury, Jupiter and Venus are favorable"; "Navamsa: Gemini, Virgo, Libra, Sagittarius and Pisces are favorable"' }),
    RANGACHARYA: Object.freeze({ ...RANGACHARYA_I, pageLocus: 'printed p.54 (PDF 62): "KUNAVAMSA: The benefic navamsas are Mithuna, Kanya, Tula, Vrishabha and the first half of Dhanus and other than these are branded kunavamsas which should be avoided"; "The Kunavamsa evil is nullified if the Muhurtha Lagna is occupied by Jupiter or if the Moon is placed in the 11th house"' }),
    MUHURTA_CHINTAMANI: Object.freeze({ ...MC_SHARMA, pageLocus: 'sloka 84, printed p.212 (PDF 216): "If a marriage is done in the Navamsha of the Sagittarius, Libra, Virgo, Gemini or Pisces sign, then the girl married thus certainly remains faithful to her husband"' }),
    AGARWAL: Object.freeze({ ...AGARWAL_GS, pageLocus: 'printed pp.312, 324 (PDF 311, 323): "Rising navamsa should be a biped sign (Gemini, Virgo or Libra)" (from Brihat Samhita 100.7-8); "Kunavamsa Dosha: Lagna should not occupy a malefic navamsa"' }),
    RAMAN: Object.freeze({ ...RAMAN_BV, pageLocus: 'Chapter V, PDF p.12: "Kunavamsa Dosha. - The Lagna selected for an auspicious work should not occupy the Navamsa of a malefic"' }),
    JOSHI: Object.freeze({ ...JOSHI_KK, pageLocus: 'printed p.77 (PDF 92): "In any sign as lagna, the navamsha of 7/9/3/6 rashis are considered auspicious"' }),
  },
  NAV_NATAL: {
    MUHURTA_CHINTAMANI: Object.freeze({ ...MC_SHARMA, pageLocus: 'sloka 79, printed p.187 (PDF 191): "If the Navamsha Rashi or sign of the 8th House or the Lord of the sign of the 8th House from the Janama Lagna (Natal Ascendant) happens to be there in the Ascendant at marriage, then the celebration of marriage in such Ascendant is not auspicious or if the Navamsha of the 12th sign or the sign of the 12th House or the Lord of the 12th House happens to be there in the Lagna ... quarrel-causing"' }),
    SHRIDHAR: Object.freeze({ ...SHRIDHAR_HEA, pageLocus: 'printed pp.461-462 (PDF 500-501): "If lord of radical 8th house or navamsha lord of radical 8th house, is in marriage ascendant then, it brings death to the bridegroom (J.V.-13/44)"; Narada: "navamsha lords of 8th or 12th signs from the radical ascendant or the radical Moon sign, should not be in the rising election sign"' }),
    WILHELM: Object.freeze({ ...WILHELM_E, pageLocus: 'printed p.261 (PDF 269): "If the Lagna is the Navamsa Rasi of the natal 8th or 12th, or if the natal 8th or 12th lord is in the Lagna, then it is not favorable and is said to cause quarrels. (For example, if in the natal chart 6 degrees Aries is the Lagna, which is the 2nd Navamsa of Aries, then the Navamsa of the natal 8th would be the 2nd Navamsa of Scorpio, Leo. Leo, therefore, would be an unfavorable Lagna)"' }),
    JOSHI: Object.freeze({ ...JOSHI_KK, pageLocus: 'printed p.77 (PDF 92): "Lagnas & navamshas of 8th and 12th rashis from the Janma Rashi (natal moon sign) should be avoided specifically when such natal Lagna lord or natal moon sign lord and their 8th lords are inimical"' }),
  },
  UDAYA: {
    SHRIDHAR: Object.freeze({ ...SHRIDHAR_HEA, pageLocus: '§18.3.6, printed pp.469-471 (PDF 508-510): "If neither of the following factors is available, it is preferred to shun that ascendant & rising navamsha. Uday Shuddhi: 1) When lord of the rising sign aspects ascendant (or is in the ascendant). 2) Lord of the rising navamsha aspects the ascendant (or is in the ascendant) ..."; "Ast Shuddhi ... a) Lord of setting navamsha ... aspects own navamsha ... or is in own navamsha sign ..."; "A suitable election ascendant shall meet both Udaya Shuddhi as well as Ast Shuddhi"' }),
    MUHURTA_CHINTAMANI: Object.freeze({ ...MC_SHARMA, pageLocus: 'slokas 75-78, printed pp.208-210 (PDF 212-214): the aspects (Saturn 3/10, Jupiter 9/5, Mars 4/8, all the 7th); "If the Lord of the Navamsha of the Ascendant at the time of marriage aspects the Navamsha sign or the Ascendant or he is posited in either of them, then it is very auspicious for the bridegroom ... If the above is reversed, then it is inauspicious for both"; the example: Libra rising in Sagittarius navamsa, Jupiter in Gemini aspects Sagittarius and Libra' }),
    WILHELM: Object.freeze({ ...WILHELM_E, pageLocus: 'printed p.266 (PDF 274): "It is very favorable, particularly for the groom, if the Lagna lord or Navamsa Lagna lord is in or aspects the Lagna or Navamsa Lagna. It is equally favorable, particularly for the bride, if the lord of the 7th in the Rasi or Navamsa aspects the 7th in the Rasi or the Navamsa. If the reverse occurs, it is unfavorable for both"' }),
    RANGACHARYA: Object.freeze({ ...RANGACHARYA_I, pageLocus: 'printed p.54 (PDF 62): "UDAYASTHA SUDDHI ... 1) Aspect or occupancy of Lagna lord in Lagna. 2) Aspect or occupancy of Navamsa Lagna Lord in navamsa Lagna. 3) Aspect or occupancy of Navamsa Lord in Lagna. 4) Aspect or occupancy of Lagnalord in the Navamsa Lagna. By any one of these four, Lagna suddhi is attained ... Similarly Sapthama suddhi"' }),
  },
});

const NOTES_TA = deepFreeze({
  ...NOTES_LAGNA,
  ...NOTES_SHAD,
  ...NOTES_COMMON,
  ...NOTES_ADVERSE,
  NAV_LAST: ['சர ராசி: மேஷம், கடகம், துலாம், மகரம்; ஸ்திரம்: ரிஷபம், சிம்மம், விருச்சிகம், கும்பம்; உபயம்: மிதுனம், கன்னி, தனுசு, மீனம்.'],
  NAV_WHICH: ['"தனுசு முதல் பாதி" — தனுசு நவாம்சத்தின் (3°20′) முதல் 1°40′ (எங்கள் வாசிப்பு). குநவாம்ச நீக்கம்: லக்னத்தில் குரு, அல்லது சந்திரன் 11-ல் (ரங்காச்சார்யா) — காட்டப்படுகிறது, தீர்ப்பில் இல்லை.'],
  NAV_NATAL: ['பிறந்த லக்னம், பாகை இந்த நபருடையது. நாரதரின் வாசிப்பு (பிறந்த 8, 12-ஆம் அதிபதி நின்ற நவாம்சத்தின் அதிபதி லக்னத்தில்) கணிக்கப்படவில்லை — பிறந்த கிரகங்களின் நவாம்சம் தேவை.'],
  UDAYA: ['பார்வையும் இருப்பும் ராசிச் சக்கரத்தில் — முகூர்த்த சிந்தாமணியின் சொந்த எடுத்துக்காட்டுப்படி (துலா லக்னம், தனுசு நவாம்சம்: மிதுனத்தில் குரு தனுசையும் துலாமையும் பார்க்கிறார்); நவாம்சச் சக்கரப் பார்வைகள் கணிக்கப்படவில்லை (எங்கள் வாசிப்பு). சுபர் = புதன், குரு, சுக்கிரன்; நட்பு = BPHS இயற்கை நட்பு, ஒருபுறம்.'],
});

module.exports = {
  PLANETS, MALEFICS, BENEFICS, RASI_LORDS, POINTS, AVOID, PLACEMENTS, GRADE_TA,
  ASHTAMA, PDB, PDB_TA, KARTARI, GANDANTA, GANDANTA_END, GANDANTA_START,
  MOVABLE, DUAL, NAV_LAST, NAV_WHICH, NAV_NATAL, UDAYA, ASPECTS,
  VARGA_BENEFICS, VARGAS, VARGA_TA, TRIMSAMSA, SHADVARGA, DREKKANA_MALEFIC, DREKKANA_NATURE, DREKKANA_TA, DREKKANA, VISHANADI, VARA_TA,
  UPACHAYA, KENDRA, BENEFIC_SIGNS, DEBILITATED, MALEFICS_SEVEN, COMMON, COMMON_WHY_TA, EVENTS, SCOPE, SCOPE_OUT_TA,
  EXALTATION, MOVERS, SETTERS, ADVERSE, ADVERSE_TA, ADVERSE_CAUTION_TA, TIERS, TIER_TA, TIER_NOTE_TA,
  RANK, SOURCES, NOTES_TA,
};
