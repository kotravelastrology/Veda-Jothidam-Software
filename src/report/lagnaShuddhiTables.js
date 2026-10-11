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

const { BOOKS: { SHRIDHAR_HEA, MC_SHARMA, KALYANRAMAN_V2, JOSHI_KK, VASHISTHA_KUSUM, RANGACHARYA_I, AGARWAL_GS, WILHELM_E } } = require('./muhurtaStarTables');

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

const RANK = deepFreeze({
  PLACEMENTS: rank({ SHRIDHAR: 1838, WILHELM: 1051, MUHURTA_CHINTAMANI: 905, RANGACHARYA: 428, JOSHI: 365, AGARWAL: 281, VASHISTHA: 52, KALYANRAMAN: 48 }, 'திருமண லக்னத்தில் கிரகங்களின் இடம், புள்ளிகள் பற்றிய சொற்கள்: ஸ்ரீதர் (§18.3.4-18.3.5, பக்.463-468, அட்டவணை 18.4 உட்பட) 1838; வில்ஹெல்ம் (பக்.137, 139, 262-264) 1051; முகூர்த்த சிந்தாமணி (பக்.213-216) 905; ரங்காச்சார்யா (பக்.55, 99-100) 428; ஜோஷி (பக்.75-76) 365; அகர்வால் (பக்.311-312) 281; வசிஷ்டா 52; கல்யாணராமன் 48.'),
  ASHTAMA: rank({ MUHURTA_CHINTAMANI: 524, SHRIDHAR: 414, RANGACHARYA: 385, WILHELM: 206, VASHISTHA: 111, JOSHI: 75, AGARWAL: 62 }, 'லக்னம் பிறப்பிலிருந்து 8-ஆம் ராசி பற்றிய சொற்கள்: முகூர்த்த சிந்தாமணி (பக்.185-187) 524; ஸ்ரீதர் (பக்.460-462, 467) 414; ரங்காச்சார்யா (பக்.56, 98-99) 385; வில்ஹெல்ம் (பக்.139, 261) 206; வசிஷ்டா 111; ஜோஷி 75; அகர்வால் 62.'),
  PDB: rank({ WILHELM: 336, MUHURTA_CHINTAMANI: 334, SHRIDHAR: 184, RANGACHARYA: 136, AGARWAL: 127 }, 'செவிடு, குருடு, முட ராசிகள் பற்றிய சொற்கள்: வில்ஹெல்ம் (பக்.122-123, 261) 336; முகூர்த்த சிந்தாமணி (பக்.211-212) 334; ஸ்ரீதர் (§8.15, ப.460) 184; ரங்காச்சார்யா (பக்.97-98) 136; அகர்வால் 127. எல்லாம் பகல்/இரவுக்கு ஒரே ராசிகள்.'),
  KARTARI: rank({ MUHURTA_CHINTAMANI: 349, SHRIDHAR: 327, RANGACHARYA: 146, WILHELM: 94, VASHISTHA: 68, JOSHI: 40, AGARWAL: 18 }, 'கர்த்தரி பற்றிய சொற்கள்: முகூர்த்த சிந்தாமணி (பக்.184-185) 349; ஸ்ரீதர் (§8.6) 327; ரங்காச்சார்யா (பக்.54-55) 146; வில்ஹெல்ம் 94; வசிஷ்டா 68; ஜோஷி 40; அகர்வால் 18.'),
  GANDANTA: rank({ SHRIDHAR: 91, WILHELM: 84, MUHURTA_CHINTAMANI: 57, RANGACHARYA: 38, AGARWAL: 22 }, 'லக்ன கண்டாந்தம் பற்றிய சொற்கள்: ஸ்ரீதர் (§8.1.7) 91; வில்ஹெல்ம் 84; முகூர்த்த சிந்தாமணி 57; ரங்காச்சார்யா 38; அகர்வால் 22.'),
});

// ---------------------------------------------------------------------------
// The books' words
// ---------------------------------------------------------------------------

const SOURCES = deepFreeze({
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

const NOTES_TA = deepFreeze({
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

module.exports = {
  PLANETS, MALEFICS, BENEFICS, RASI_LORDS, POINTS, AVOID, PLACEMENTS, GRADE_TA,
  ASHTAMA, PDB, PDB_TA, KARTARI, GANDANTA, GANDANTA_END, GANDANTA_START,
  RANK, SOURCES, NOTES_TA,
};
