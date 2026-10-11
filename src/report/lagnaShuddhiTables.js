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
  SHRIDHAR: { labelTa: 'ஸ்ரீதர் — விஸ்வ பலம் 11+, தீய இடம் ஒன்றுக்கு மேல் இல்லை', textTa: 'அட்டவணை 18.5: நல்ல இடத்தில் உள்ள கிரகத்தின் புள்ளிகள் (மொத்தம் 20). 16-20 சிறந்தது, 11-15 நடுத்தரம், 4-10 அவசரத்தில் மட்டும் — இங்கே விலக்கு. தீய இடத்தில் ஒரு கிரகம் "பரிகாரத்துடன் ஏற்கலாம்", ஒன்றுக்கு மேல் விலக்கு. ராகு/கேது தீய இடம் 1, 4, 7; லக்னாதிபதி 6, 8, 12.', booksTa: 'ஸ்ரீதர்', scoring: 'ADD', grades: [[16, 'BEST'], [11, 'MEDIUM'], [4, 'EMERGENCY']], pass: ['BEST', 'MEDIUM'], maxAvoid: 1 },
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
    'நவாம்ச விதிகள் (கடைசி நவாம்சம், வர்கோத்தமம், சுப நவாம்சம், குநவாம்சம்), உதய-அஸ்த சுத்தி, ஷட்வர்க்கம், திரேக்காணம், ராசி விஷ நாடிகள் இன்னும் கணிக்கப்படவில்லை.',
    'பொதுவான சுப காரியங்களுக்கான லக்ன சுத்தி (முகூர்த்த சிந்தாமணி ப.79: பிறப்பிலிருந்து உபசய ராசி, 8, 12 காலி, லக்னத்தில் சுபர் பார்வை, லக்னத்துக்கு உபசயத்தில் சந்திரன்) இன்னும் கணிக்கப்படவில்லை — இந்தப் பகுதி திருமணத்துக்கானது.',
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

const RANK = deepFreeze({
  ...RANK_LAGNA,
  ...RANK_SHAD,
  NAV_LAST: rank({ MUHURTA_CHINTAMANI: 156, SHRIDHAR: 146, WILHELM: 46, RANGACHARYA: 35, JOSHI: 32 }, 'கடைசி நவாம்சம், வர்கோத்தமம், சர நவாம்சம் பற்றிய சொற்கள்: முகூர்த்த சிந்தாமணி (ப.213) 156; ஸ்ரீதர் (பக்.458, 461) 146; வில்ஹெல்ம் 46; ரங்காச்சார்யா 35; ஜோஷி 32.'),
  NAV_WHICH: rank({ SHRIDHAR: 390, WILHELM: 80, RANGACHARYA: 56, MUHURTA_CHINTAMANI: 43, AGARWAL: 22, RAMAN: 18, JOSHI: 16 }, 'எந்த நவாம்சம் என்பது பற்றிய சொற்கள்: ஸ்ரீதர் (பக்.459-461, 463 — நாரதர், காளிதாசர், வசிஷ்டர், பி.க. மேற்கோள்கள்) 390; வில்ஹெல்ம் (பக்.123, 261) 80; ரங்காச்சார்யா (ப.54) 56; முகூர்த்த சிந்தாமணி (ப.212) 43; அகர்வால் 22; ராமன் 18; ஜோஷி 16. ஸ்ரீதர் தானே விதியாகச் சொல்வது நாரதருடையது.'),
  NAV_NATAL: rank({ MUHURTA_CHINTAMANI: 145, SHRIDHAR: 127, WILHELM: 83, JOSHI: 75 }, 'பிறந்த 8, 12-ன் நவாம்சம் பற்றிய சொற்கள்: முகூர்த்த சிந்தாமணி (ப.187) 145; ஸ்ரீதர் (பக்.461-462) 127; வில்ஹெல்ம் (ப.261) 83; ஜோஷி (ப.77) 75.'),
  UDAYA: rank({ SHRIDHAR: 905, MUHURTA_CHINTAMANI: 789, WILHELM: 135, RANGACHARYA: 95 }, 'உதய-அஸ்த சுத்தி பற்றிய சொற்கள்: ஸ்ரீதர் (§18.3.6, பக்.469-471) 905; முகூர்த்த சிந்தாமணி (ஸ்லோ.75-78, பக்.208-210) 789; வில்ஹெல்ம் (ப.266) 135; ரங்காச்சார்யா (ப.54) 95.'),
});

const SOURCES = deepFreeze({
  ...SOURCES_LAGNA,
  ...SOURCES_SHAD,
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
  RANK, SOURCES, NOTES_TA,
};
