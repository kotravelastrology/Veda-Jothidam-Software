/**
 * Ashtakoota (the eight kootas, 36 gunas) — V.K. Shridhar, *Hindu Electional Astrology* §18.7, pp.478-535.
 *
 * Shridhar gives every koota as a table read with the bride in the rows and the bridegroom in the columns, then a
 * grand table (18.33 a-f) of the total for every pair of birth stars. This file holds his conventional tables, read
 * from the page images (the scan's text layer loses the columns): Varna 18.8, Vashya 18.11, Tara 18.13, Yoni 18.14,
 * Graha Maitri 18.17, Gana 18.18, Bhakuta 18.20 and Nadi 18.22, with his reading of the total (§18.7, p.479). His
 * other tables (the Varna by the sign's lord 18.9, the other opinions of Vashya 18.12, the alternative Gana 18.19, the
 * "suggested" Bhakuta 18.21 whose shaded cells cannot be read in the scan) are named and not computed.
 *
 * Stars 0-26 from Ashwini; rashis 0-11 from Aries; the bride is always the first of a pair.
 */

const { BOOKS: { SHRIDHAR_HEA } } = require('./muhurtaStarTables');

const deepFreeze = (o) => {
  Object.values(o).forEach((v) => { if (v && typeof v === 'object') deepFreeze(v); });
  return Object.freeze(o);
};
const src = (pageLocus) => Object.freeze({ ...SHRIDHAR_HEA, pageLocus });

const KOOTAS = Object.freeze(['VARNA', 'VASHYA', 'TARA', 'YONI', 'GRAHA_MAITRI', 'GANA', 'BHAKUTA', 'NADI']);
const MAX = Object.freeze({ VARNA: 1, VASHYA: 2, TARA: 3, YONI: 4, GRAHA_MAITRI: 5, GANA: 6, BHAKUTA: 7, NADI: 8 });
const KOOTA_TA = Object.freeze({
  VARNA: 'வர்ணம்', VASHYA: 'வச்யம்', TARA: 'தாரை (தினம்)', YONI: 'யோனி', GRAHA_MAITRI: 'கிரக மைத்ரி', GANA: 'கணம்', BHAKUTA: 'பகூட (ராசி)', NADI: 'நாடி',
});
/** PL9's "Area of life" column names, and Shridhar's Table 18.7 for what each koota stands for. */
const AREA_TA = Object.freeze({
  VARNA: 'ஆன்மிக வளர்ச்சி நிலை, கீழ்ப்படிதல், பரஸ்பர அன்பு, வசதி', VASHYA: 'ஒருவரை ஒருவர் கட்டுப்படுத்தல், நட்பு, இணக்கம், செழிப்பு வளர்ச்சி',
  TARA: 'பரஸ்பர நன்மை, அதிர்ஷ்டம், மங்களம் கடத்தல்', YONI: 'உடலுறவு இணக்கம், ஈர்ப்பு, உடலுறுப்புப் பொருத்தம், புதல்வர்',
  GRAHA_MAITRI: 'மனநிலை, மன இயல்பு, பாசம், நட்பு, பகை', GANA: 'காதல், பகை, சண்டை, ஆயுள், செல்வம், செழிப்பு (தேவ - மனுஷ்ய - ராக்ஷஸ)',
  BHAKUTA: 'பிள்ளைகள், செல்வம், குடும்ப வளர்ச்சி, சுகம், அதிர்ஷ்டம்', NADI: 'உடல் தன்மை, பரம்பரை, நரம்பு ஆற்றல், உளவியல், பிறருக்குத் துன்பம், மரணம்',
});

const SOURCES = deepFreeze({
  OVERVIEW: src('§18.7 "Horoscope matching", printed pp.478-480 (PDF 517-519): "In considering Ashtakuta (Kutas No. 1 to 8 in table 18.6), the total Gunas is 36. If total Gunas are 31 to 36 - then the union is excellent; 21 to 30 Gunas - Very good; 17 to 20 - middling; & if the Gunas are less than 17 - it is not recommended"'),
  VARNA: src('§18.7.1 Table 18.8 "Varna compatibility - (Casts of Rashis)", printed p.482 (PDF 521): "Bridegroom\'s Varna should be superior or equal to that of the bride ... one point (Guna) is accorded"'),
  VASHYA: src('§18.7.2 Table 18.11 "Vashya compatibility - conventional", printed p.485 (PDF 524)'),
  TARA: src('§18.7.3 Table 18.13 "Tara Compatibility", printed pp.486-488 (PDF 525-527): "If in both the modes of counting it is auspicious, then 3 Gunas (maximum) are accorded; if auspicious in one mode & inauspicious in the other mode then, 1.5 Gunas"'),
  YONI: src('§18.7.4 Table 18.14 "Yoni compatibility", printed p.490 (PDF 529)'),
  GRAHA_MAITRI: src('§18.7.5 Table 18.17 "Graha Maitri (planetary friendship) - compatibility", printed p.493 (PDF 532)'),
  GANA: src('§18.7.6 Table 18.18 "Gana compatibility", printed p.495 (PDF 534)'),
  BHAKUTA: src('§18.7.7 Table 18.20 "Bhakuta compatibility (conventional)", printed p.501 (PDF 540)'),
  NADI: src('§18.7.8 Table 18.22 "Nadi (Tri Parva Gadna) compatibility", printed p.504 (PDF 543)'),
  TOTALS: src('§18.7 Table 18.33 (a-f) "Total Gunas in Ashtakuta", printed pp.535-540 (PDF 574-579): the total, with the doshas under it, for every bride / bridegroom pair of birth stars'),
});

// ------------------------------------------------------------------------------ Varna ---
/** 0 Brahmin 1 Kshatriya 2 Vaishya 3 Shudra — by the Janma Rashi (Table 18.8): Cancer, Scorpio, Pisces Brahmin; Aries, Leo, Sagittarius Kshatriya; Taurus, Virgo, Capricorn Vaishya; Gemini, Libra, Aquarius Shudra. */
/** Rashi names in Tamil, Mesha first. */
const RASI_TA = Object.freeze(['மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கடகம்', 'சிம்மம்', 'கன்னி', 'துலாம்', 'விருச்சிகம்', 'தனுசு', 'மகரம்', 'கும்பம்', 'மீனம்']);
const VARNA_OF_RASHI = Object.freeze([1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0]);
const VARNA_TA = Object.freeze(['பிராமணர்', 'க்ஷத்ரியர்', 'வைசியர்', 'சூத்திரர்']);
// Table 18.8 prints Taurus, Virgo, Capricorn (2, 6, 10) as Vaishyas and Gemini, Libra, Aquarius (3, 7, 11) as Shudras.

// ------------------------------------------------------------------------------ Vashya ---
/** Groups: 0 Biped, 1 Quadruped, 2 Aquatic, 3 Vanchar (Leo), 4 Insect (Scorpio); Sagittarius and Capricorn are split at 15 degrees. */
const VASHYA_TA = Object.freeze(['இருகால் (மனிதன்)', 'நாற்கால்', 'நீர்வாழ்', 'வனசாரி (சிங்கம்)', 'பூச்சி (தேள்)']);
function vashyaGroup(rashi, degreeInSign) {
  const firstHalf = degreeInSign < 15;
  if ([2, 5, 6, 10].includes(rashi)) return 0;
  if ([0, 1].includes(rashi)) return 1;
  if (rashi === 8) return firstHalf ? 0 : 1;
  if (rashi === 9) return firstHalf ? 1 : 2;
  if ([3, 11].includes(rashi)) return 2;
  if (rashi === 4) return 3;
  return 4; // Scorpio
}
/** Table 18.11: [bride group][bridegroom group]. */
const VASHYA = deepFreeze([
  [2, 1, 0.5, 0, 1],
  [1, 2, 1, 0, 1],
  [0.5, 1, 2, 1, 1],
  [0, 0, 1, 2, 0],
  [1, 1, 1, 0, 2],
]);

// -------------------------------------------------------------------------------- Tara ---
/**
 * Count the bride's star from the bridegroom's (inclusive) and the bridegroom's from the bride's, each divided by nine:
 * a remainder of 3, 5 or 7 is inauspicious (-G: death to the bride when she is the 3rd, 5th, 7th from him; -B: to him).
 * Both fine 3 gunas, one bad 1.5, both bad 0 (the book says that cannot happen).
 */
const TARA_BAD = Object.freeze([3, 5, 7]);

// -------------------------------------------------------------------------------- Yoni ---
const YONI_NAMES = Object.freeze(['Horse', 'Elephant', 'Sheep', 'Serpent', 'Dog', 'Cat', 'Rat', 'Cow', 'Buffalo', 'Tiger', 'Hare', 'Monkey', 'Mongoose', 'Lion']);
const YONI_TA = Object.freeze(['குதிரை', 'யானை', 'ஆடு', 'பாம்பு', 'நாய்', 'பூனை', 'எலி', 'பசு', 'எருமை', 'புலி', 'முயல் / மான்', 'குரங்கு', 'கீரி', 'சிங்கம்']);
/**
 * The animal of each star (Table 18.14's male and female columns give one animal to each star). The table prints Uttarabhadrapada
 * twice (the Lion's male star and the Cow's female star) and has no Purvabhadrapada: the Lion's is read as Purvabhadrapada.
 */
const YONI_OF_STAR = Object.freeze([0, 1, 2, 3, 3, 4, 5, 2, 5, 6, 6, 7, 8, 9, 8, 9, 10, 10, 4, 11, 12, 11, 13, 0, 13, 7, 1]);
/** Table 18.14: [bride animal][bridegroom animal]. */
const YONI = deepFreeze([
  [4, 2, 2, 3, 2, 2, 2, 1, 0, 1, 3, 3, 2, 1],
  [2, 4, 3, 3, 2, 2, 2, 2, 3, 1, 2, 3, 2, 0],
  [2, 3, 4, 2, 1, 2, 1, 3, 3, 1, 2, 0, 3, 1],
  [3, 3, 2, 4, 2, 1, 1, 1, 1, 2, 2, 2, 0, 2],
  [2, 2, 1, 2, 4, 2, 1, 2, 2, 1, 0, 2, 1, 1],
  [2, 2, 2, 2, 2, 4, 0, 2, 2, 1, 3, 3, 2, 2],
  [2, 2, 1, 1, 1, 0, 4, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 3, 2, 2, 2, 2, 4, 3, 0, 3, 2, 2, 1],
  [0, 3, 3, 2, 2, 2, 2, 3, 4, 1, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 1, 2, 0, 1, 4, 1, 1, 2, 2],
  [3, 2, 2, 2, 0, 3, 2, 3, 2, 1, 4, 2, 2, 2],
  [3, 3, 0, 2, 2, 3, 2, 2, 2, 1, 2, 4, 3, 2],
  [2, 3, 3, 0, 1, 2, 1, 2, 2, 2, 2, 3, 4, 2],
  [1, 0, 1, 2, 1, 1, 1, 1, 3, 2, 2, 2, 2, 4],
]);

// ---------------------------------------------------------------------- Graha Maitri ---
/** The lord's group of the Janma Rashi (the table's columns): 0 Mars (1, 8), 1 Venus (2, 7), 2 Mercury (3, 6), 3 Moon (4), 4 Sun (5), 5 Jupiter (9, 12), 6 Saturn (10, 11). */
const MAITRI_GROUP_OF_RASHI = Object.freeze([0, 1, 2, 3, 4, 2, 1, 0, 5, 6, 6, 5]);
const MAITRI_LORD_TA = Object.freeze(['செவ்வாய்', 'சுக்கிரன்', 'புதன்', 'சந்திரன்', 'சூரியன்', 'குரு', 'சனி']);
/** Table 18.17: [bride's lord][bridegroom's lord]. */
const GRAHA_MAITRI = deepFreeze([
  [5, 3, 0.5, 4, 5, 5, 0.5],
  [3, 5, 5, 0.5, 0, 0.5, 5],
  [0.5, 5, 5, 1, 4, 0.5, 4],
  [4, 0.5, 1, 5, 5, 4, 0.5],
  [5, 0, 4, 5, 5, 5, 0],
  [5, 0.5, 0.5, 4, 5, 5, 3],
  [0.5, 5, 4, 0.5, 0, 3, 5],
]);

// -------------------------------------------------------------------------------- Gana ---
const GANA_TA = Object.freeze(['தேவ', 'மனுஷ்ய', 'ராக்ஷஸ']);
const groupsToStars = (groups) => { const a = new Array(27); groups.forEach((list, g) => list.forEach((st) => { a[st] = g; })); return Object.freeze(a); };
/** Deva, Manushya, Rakshasa — the columns of Table 18.18. */
const GANA_OF_STAR = groupsToStars([[0, 4, 6, 7, 12, 14, 16, 21, 26], [1, 3, 5, 10, 11, 19, 20, 24, 25], [2, 8, 9, 13, 15, 17, 18, 22, 23]]);
/** Table 18.18: [bride gana][bridegroom gana]. */
const GANA = deepFreeze([
  [6, 5, 1],
  [6, 6, 0],
  [0, 0, 6],
]);

// ----------------------------------------------------------------------------- Bhakuta ---
/** Table 18.20 (conventional): the bridegroom's sign counted from the bride's: 1, 7, 3, 11, 4, 10 give 7; 2, 12, 5, 9, 6, 8 give 0. */
const BHAKUTA_GOOD_DISTANCES = Object.freeze([1, 3, 4, 7, 10, 11]);
const BHAKUTA_PRINTED = deepFreeze([
  [7, 0, 7, 7, 0, 0, 7, 0, 0, 7, 7, 0],
  [0, 7, 0, 7, 7, 0, 0, 7, 0, 0, 7, 7],
  [7, 0, 7, 0, 7, 7, 0, 0, 7, 0, 0, 7],
  [7, 7, 0, 7, 0, 7, 7, 0, 0, 7, 0, 0],
  [0, 7, 7, 0, 7, 0, 7, 7, 0, 0, 7, 0],
  [0, 0, 7, 7, 0, 7, 0, 7, 7, 0, 0, 7],
  [7, 0, 0, 7, 7, 0, 7, 0, 7, 7, 0, 0],
  [0, 7, 0, 0, 7, 7, 0, 7, 0, 7, 7, 0],
  [0, 0, 7, 0, 0, 7, 7, 0, 7, 0, 7, 7],
  [7, 0, 0, 7, 0, 0, 7, 7, 0, 7, 0, 7],
  [7, 7, 0, 0, 7, 0, 0, 7, 7, 0, 7, 0],
  [0, 7, 7, 0, 0, 7, 0, 0, 7, 7, 0, 7],
]);

// --------------------------------------------------------------------------------- Nadi ---
/** Table 18.22: Adi (wind), Madhya (bile), Antya (phlegm); the same nadi gives 0, otherwise 8. */
const NADI_OF_STAR = groupsToStars([[0, 5, 6, 11, 12, 17, 18, 23, 24], [1, 4, 7, 10, 13, 16, 19, 22, 25], [2, 3, 8, 9, 14, 15, 20, 21, 26]]);
const NADI_TA = Object.freeze(['ஆதி (வாதம்)', 'மத்யம் (பித்தம்)', 'அந்த்யம் (கபம்)']);

// ------------------------------------------------------------------------- the verdict ---
/** §18.7 p.479: the total in 36; and when Bhakuta is unfavourable, the stricter bands (B.D.R. and Jyotirnibandha). */
const BANDS = Object.freeze({
  NORMAL: [
    { from: 31, textTa: 'மிகச் சிறந்த இணைப்பு', code: 'EXCELLENT' }, { from: 21, textTa: 'மிக நல்லது', code: 'VERY_GOOD' },
    { from: 17, textTa: 'நடுத்தரம்', code: 'MIDDLING' }, { from: 0, textTa: 'பரிந்துரைக்கப்படவில்லை', code: 'NOT_RECOMMENDED' },
  ],
  BHAKUTA_ABSENT: [
    { from: 31, textTa: 'மிகச் சிறந்த இணைப்பு', code: 'EXCELLENT' }, { from: 26, textTa: 'மிக நல்லது', code: 'VERY_GOOD' },
    { from: 21, textTa: 'நடுத்தரம்', code: 'MIDDLING' }, { from: 0, textTa: 'நிந்தை — நிராகரி', code: 'REJECT' },
  ],
});
const NADI_REJECT_TA = 'நாடி தோஷம் இருக்கையில் 28 குணம் இருந்தாலும் இணைப்பு நிராகரிக்கப்படும் (§18.7, ப.480)';

const OUR_READINGS_TA = Object.freeze([
  'மணமகள் வரிசை, மணமகன் நெடுவரிசை — ஷ்ரீதரின் ஒவ்வொரு அட்டவணையும் அப்படியே படிக்கப்படுகிறது; மணமகளின் நிலை முதலில். அட்டவணைகளின் எண்கள் ஸ்கேன் படத்தைப் பார்த்துப் பதியப்பட்டவை.',
  'ஜன்ம ராசி = சந்திரன் இருக்கும் ராசி; பாதம் தேவை (வச்யத்தில் தனுசு, மகரத்தின் முதல் / இரண்டாம் பாதி 15° வைத்துப் பிரிக்கப்படுகிறது).',
  'தாரை: நூலின் விதிப்படி இரு திசையிலும் எண்ணி 9 ஆல் வகுத்து 3, 5, 7 வந்தால் தீது; அட்டவணை 18.13 இன் ஓர் அச்சுப் பிழை (2, 11, 20 வரிசை × 9, 18, 27 நெடுவரிசை: "3 (-G)") விதியின்படி 1.5.',
  'ஷ்ரீதரின் மற்ற அட்டவணைகள் (18.9, 18.12, 18.19, 18.21) பெயர் மட்டும்; அவற்றின் முறைகள் கணிக்கப்படவில்லை.',
  'எச்சரிக்கை: நூலின் மொத்த அட்டவணை 18.33 (ப.535-540) ஒவ்வொரு ஜோடிக்கும் ஒரு மொத்தம் தருகிறது. அதில் மூன்று மணமகள்கள் × 18 மணமகன்கள் (54 கட்டங்கள்) படத்தில் பார்த்து ஒப்பிட்டதில் எங்கள் மொத்தம் 24 இல் மட்டுமே அதனுடன் ஒத்தது; மற்ற 30 இல் நூலின் மொத்தம் அதன் சொந்த எட்டு அட்டவணைகளின் கூட்டலிலிருந்து 1-2 குணம் வேறுபடுகிறது (அஸ்வினி மணமகள் வரிசையில் வேறுபாடு மணமகனின் யோனி மிருகத்துடன் ஒத்துப்போகிறது; பரணி வரிசையில் அப்படி இல்லை — காரணம் தெரியவில்லை). இரண்டும் அச்சில் உள்ளபடி; இங்கே எட்டு அட்டவணைகளின் கூட்டல்.',
  'பகூட தோஷம், நாடி தோஷம் எதிர்கொள்ளும் விதிவிலக்குகள் (கிரக மைத்ரி இருந்தால் கண நாடி தோஷம் இல்லை, நவாம்ச அதிபதிகள் முதலியன — §18.7, §18.8.1) இங்கே கணிக்கப்படவில்லை; தனிக் குறிப்பாக.',
  'இது பொருத்தத்தின் ஒரு பகுதி மட்டுமே: நூல் "குணக் கூட்டலை மட்டும் வைத்துத் தீர்ப்பளிப்பது ஜோதிடத்துக்குக் களங்கம்" என்கிறது (§18.7). ஆயுள், ஜாதகங்கள், தசைகள் தனியே பார்க்க வேண்டும்.',
]);

module.exports = {
  KOOTAS, MAX, KOOTA_TA, AREA_TA, SOURCES, RASI_TA, VARNA_OF_RASHI, VARNA_TA, VASHYA_TA, vashyaGroup, VASHYA, TARA_BAD,
  YONI_NAMES, YONI_TA, YONI_OF_STAR, YONI, MAITRI_GROUP_OF_RASHI, MAITRI_LORD_TA, GRAHA_MAITRI,
  GANA_TA, GANA_OF_STAR, GANA, BHAKUTA_GOOD_DISTANCES, BHAKUTA_PRINTED, NADI_OF_STAR, NADI_TA, BANDS, NADI_REJECT_TA, OUR_READINGS_TA,
};
