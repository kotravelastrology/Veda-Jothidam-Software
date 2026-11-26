/**
 * The ten evils of a marriage muhurta — the books' rules for the nine besides
 * Latta (Latta is in `muhurtaStarTables.js`), added 2026-10-10.
 *
 * Joshi, Vashistha and Agarwal list the same ten in the same order: Latta,
 * Paata, Yuti, Vedha, Jamitra, Mrityu Panchaka (Bana), Ekargala, Upagraha,
 * Kranti-samya, Dagdha tithi (Shridhar and Kalyanraman's Seegrabodham too).
 *
 * Order by words (owner's rule, 2026-10-03), measured on each book's section
 * for each evil; where the books differ every reading is computed and the most
 * explaining book's is the default. Stars are counted 0 = Ashwini; in the
 * 28-star scheme 21 is Abhijit and Shravana-Revati are 22-27.
 */

const { KALAPRAKASIKA } = require('./classicSources');
const { BOOKS: { SHRIDHAR_HEA, MC_SHARMA, KALYANRAMAN_V1, KALYANRAMAN_V2, JOSHI_KK, VASHISTHA_KUSUM, RANGACHARYA_I, AGARWAL_GS, WILHELM_E, RAMAN_BV } } = require('./muhurtaStarTables');

const deepFreeze = (o) => {
  Object.values(o).forEach((v) => { if (v && typeof v === 'object' && !Object.isFrozen(v)) deepFreeze(v); });
  return Object.freeze(o);
};

/** The nine, in the books' order (Latta, the first, is on the page's own switches). */
const DOSHAS = Object.freeze(['PAATA', 'YUTI', 'VEDHA', 'JAMITRA', 'BANA', 'EKARGALA', 'UPAGRAHA', 'KRANTI', 'DAGDHA']);
/** The five the books call serious: Yuti, Vedha, Mrityu Bana, Kranti-samya, Dagdha tithi. */
const SERIOUS = Object.freeze(['YUTI', 'VEDHA', 'BANA', 'KRANTI', 'DAGDHA']);

const NAME_TA = Object.freeze({
  LATTA: 'லத்தை', PAATA: 'பாத தோஷம்', YUTI: 'யுதி (ஸக்ரஹ சந்திரன்)', VEDHA: 'வேதை', JAMITRA: 'ஜாமித்ரம்',
  BANA: 'பாணம் (மிருத்யு பஞ்சகம்)', EKARGALA: 'ஏகார்கலம் (கர்ஜூரம்)', UPAGRAHA: 'உபக்கிரகம்', KRANTI: 'க்ராந்தி சாம்யம்', DAGDHA: 'தக்த திதி',
});

const MALEFICS = Object.freeze(['Sun', 'Mars', 'Saturn', 'Rahu', 'Ketu']);
const BENEFICS = Object.freeze(['Mercury', 'Jupiter', 'Venus']);

/** Muhurta Chintamani: Abhijit is Uttarashadha's 4th quarter and the first fifteenth of Shravana. */
const ABHIJIT = Object.freeze({ from: 276 + 40 / 60, to: 280 + 53 / 60 + 20 / 3600 });
const ABHIJIT_SOURCE = Object.freeze({ ...MC_SHARMA, pageLocus: 'Vivaha Prakarana, printed p.191 (PDF 195): "The 4th Quarter of the Uttarashadha Nakshtra and the first 15th part of the Shravana Nakshtra added together is the value (period) of the Abhijita Nakshtra"' });

const pairMap = (pairs) => {
  const m = {};
  for (const [a, b] of pairs) { m[a] = b; m[b] = a; }
  return Object.freeze(m);
};

/**
 * Pancha Shalaka (28-star indices): five vertical, five horizontal and the four
 * corner lines. Muhurta Chintamani names the eight pairs that hold marriage
 * stars and draws the rest; Shridhar and Rangacharya list all fourteen.
 */
const PANCHA = pairMap([[0, 10], [1, 16], [2, 15], [3, 21], [4, 20], [5, 19], [6, 18], [7, 17], [8, 23], [9, 22], [11, 27], [12, 26], [13, 25], [14, 24]]);
/** Sapta Shalaka (Muhurta Chintamani's and Rangacharya's fourteen pairs; the chakra of `/gochara-vedha`). */
const SAPTA = pairMap([[2, 22], [3, 21], [4, 20], [5, 19], [6, 18], [7, 17], [8, 16], [9, 1], [10, 0], [11, 27], [12, 26], [13, 25], [14, 24], [15, 23]]);

/** The nine evil yogas (0 = Vishkambha) and the star each puts at the top of the Kharjura chakra (Shridhar, Rangacharya, Kalaprakasika, Kalyanraman). */
const EVIL_YOGAS = Object.freeze([0, 5, 8, 9, 12, 14, 16, 18, 26]);
const MURDHA = Object.freeze({ 0: 0, 5: 16, 8: 4, 9: 18, 12: 6, 14: 7, 16: 8, 18: 9, 26: 13 });
const YOGA_TA = Object.freeze([
  'விஷ்கம்பம்', 'ப்ரீதி', 'ஆயுஷ்மான்', 'சௌபாக்யம்', 'சோபனம்', 'அதிகண்டம்', 'சுகர்மா', 'த்ருதி', 'சூலம்', 'கண்டம்',
  'வ்ருத்தி', 'த்ருவம்', 'வ்யாகாதம்', 'ஹர்ஷணம்', 'வஜ்ரம்', 'சித்தி', 'வ்யதீபாதம்', 'வரீயான்', 'பரிகம்', 'சிவம்',
  'சித்தம்', 'சாத்யம்', 'சுபம்', 'சுக்லம்', 'ப்ரம்மம்', 'ஐந்திரம்', 'வைத்ருதி',
]);
/** Wilhelm's "Nakshatra corresponding to the Yoga": the star of (Sun + Moon + 93°20′) — yoga + 7. */
const WILHELM_YOGA_STAR = 7;
/** Kalaprakasika and Wilhelm: Ekargala does not touch the Moon in these stars. */
const EKARGALA_EXEMPT = Object.freeze([0, 4, 6, 7, 12, 13, 22, 26]);

/** Paata: Harshana, Vaidhriti, Sadhya, Vyatipata, Ganda, Shoola — the star the Moon is in when one ends. */
const PAATA_YOGAS = Object.freeze([13, 26, 21, 16, 9, 8]);
/** Narada and Vashishtha: count from the Sun's star to these; the same counts from Ashwini are struck. */
const NARADA_TARGETS = Object.freeze({ CHITRA: [8, 9, 13, 16, 21, 26], SWATI: [8, 9, 14, 16, 21, 26] });

const UPAGRAHA_13 = Object.freeze([5, 7, 8, 10, 14, 15, 18, 19, 21, 22, 23, 24, 25]);
const UPAGRAHA_MP = Object.freeze([5, 8, 14, 18, 19, 22, 23, 24]);

/** Kranti-samya: the Sun in one sign of a pair and the Moon in the other (0 = Aries). */
const KRANTI_PAIRS = Object.freeze([[0, 4], [1, 9], [6, 10], [5, 11], [3, 7], [2, 8]]);

/** Dagdha: the tithi (of either half) burnt while the Sun is in each sign. */
const DAGDHA_TITHI = Object.freeze({ 8: 2, 11: 2, 1: 4, 10: 4, 3: 6, 0: 6, 5: 8, 2: 8, 4: 10, 7: 10, 9: 12, 6: 12 });

/** Bana: the five places' additions (to the Sun's degrees) and the remainder of tithi + lagna for each. */
const BANAS = Object.freeze(['ROGA', 'AGNI', 'RAJA', 'CHORA', 'MRITYU']);
const BANA_ADD = Object.freeze({ ROGA: 6, AGNI: 3, RAJA: 1, CHORA: 8, MRITYU: 4 });
const BANA_TITHI_LAGNA = Object.freeze({ ROGA: 8, AGNI: 2, RAJA: 4, CHORA: 6, MRITYU: 1 });
const BANA_TA = Object.freeze({ ROGA: 'ரோக', AGNI: 'அக்னி', RAJA: 'ராஜ', CHORA: 'சோர', MRITYU: 'மிருத்யு', SASHALYA: 'சசல்ய' });

const rank = (words, measureTa) => deepFreeze({ order: Object.keys(words).sort((a, b) => words[b] - words[a]), words, measureTa });

// ---------------------------------------------------------------------------
// The readings of each evil
// ---------------------------------------------------------------------------

const READINGS = deepFreeze({
  PAATA: {
    default: 'YOGA_END',
    order: ['YOGA_END', 'YOGA_END_PADA', 'NARADA', 'NARADA_SWATI', 'NARADA_QUARTER'],
    YOGA_END: { labelTa: 'யோகம் முடியும்போது சந்திரன் நின்ற நட்சத்திரம்', textTa: 'ஹர்ஷணம், வைத்ருதி, சாத்யம், வ்யதீபாதம், கண்டம், சூலம் — இவற்றில் ஒன்று முடியும் நேரத்தில் சந்திரன் நிற்கும் நட்சத்திரம், சந்திரன் அதில் இருக்கும் வரை முழுவதும்.', booksTa: 'ஸ்ரீதர் (முதல் முறை), முகூர்த்த சிந்தாமணி ஸ்லோ.60, ரங்காச்சார்யா, ஜோஷி, வசிஷ்டா, அகர்வால்' },
    YOGA_END_PADA: { labelTa: 'அந்த நேரத்துப் பாதம் மட்டும்', textTa: 'யோகம் முடிந்தபோது சந்திரன் நின்ற பாதம் மட்டும் — ஸ்ரீதரின் எடுத்துக்காட்டு (1998-12-09, வைத்ருதி முடிவு, மகம் 3-ஆம் பாதம் மட்டும்).', booksTa: 'ஸ்ரீதர் (எடுத்துக்காட்டு)' },
    NARADA: { labelTa: 'நாரதர் முறை — சூரியனிலிருந்து எண்ணி', textTa: 'சூரியன் நிற்கும் நட்சத்திரத்திலிருந்து ஆயில்யம், மகம், சித்திரை, அனுஷம், திருவோணம், ரேவதி வரை எண்ணிய ஆறு எண்கள்; அசுவினியிலிருந்து அதே எண்ணுள்ள நட்சத்திரங்களில் சந்திரன்.', booksTa: 'நாரதர், வசிஷ்டர் — முகூர்த்த சிந்தாமணி உரை, ரங்காச்சார்யா, ஜோஷி (அட்டவணை 6.2), வில்ஹெல்ம், கல்யாணராமன்' },
    NARADA_SWATI: { labelTa: 'நாரதர் முறை — சித்திரைக்குப் பதில் சுவாதி', textTa: 'அதே முறை, சித்திரைக்குப் பதில் சுவாதி வரை எண்ணி — ஸ்ரீதரின் உரையும் அட்டவணை 8.9-ம் இப்படியே.', booksTa: 'ஸ்ரீதர் (இரண்டாம் முறை)' },
    NARADA_QUARTER: { labelTa: 'நாரதர் முறை — சூரியனின் பாத எண் உள்ள பாதம் மட்டும்', textTa: 'நாரதர் முறையில் தாக்கப்பட்ட நட்சத்திரத்தில் சந்திரனின் பாத எண் சூரியனின் பாத எண்ணே ஆனால் மட்டும் (முகூர்த்த சிந்தாமணி ஸ்லோ.64 "खेटपत्समः"; வில்ஹெல்ம்: வேறு பாதம் என்றால், வேறு நல்ல நேரம் இல்லாதபோது, புறக்கணிக்கலாம்).', booksTa: 'வில்ஹெல்ம், முகூர்த்த சிந்தாமணி ஸ்லோ.64' },
  },
  YUTI: {
    default: 'SIGN_ANY',
    order: ['SIGN_ANY', 'SIGN_MC', 'STAR'],
    SIGN_ANY: { labelTa: 'சந்திரனின் ராசியில் எந்தக் கிரகமும்', textTa: 'சந்திரன் நிற்கும் ராசியில் வேறு எந்தக் கிரகம் இருந்தாலும் (ராகு, கேது உட்பட).', booksTa: 'ஸ்ரீதர் (வரையறை; நாரத சம்ஹிதை), வில்ஹெல்ம் ("சந்திரன் தனித்திருக்க வேண்டும்"), வசிஷ்டா' },
    SIGN_MC: { labelTa: 'புதன், குரு தவிர', textTa: 'சந்திரனுடன் சூரியன், செவ்வாய், சுக்கிரன், சனி, ராகு, கேது — புதனுடன் சுபம், குருவுடன் சுகம் (முகூர்த்த சிந்தாமணி).', booksTa: 'முகூர்த்த சிந்தாமணி, அகர்வால், ரங்காச்சார்யா, ஸ்ரீதர் (முகூர்த்த கணபதி, மார்த்தாண்ட வல்லபர்)' },
    STAR: { labelTa: 'சந்திரனின் நட்சத்திரத்தில் கிரகம்', textTa: 'சந்திரன் நிற்கும் நட்சத்திரத்திலேயே வேறு கிரகம் (ராசி வேறானால் தீமை குறையும் / இல்லை — ஜோஷி, ரங்காச்சார்யா, ஸ்ரீதர் ஜ்யோதிர்நிபந்தம்).', booksTa: 'ஜோஷி, கல்யாணராமன் (சுக்கிரனுக்கு விலக்கு), ரங்காச்சார்யா (முகூர்த்த கணபதி — தீய கிரகம்)' },
  },
  VEDHA: {
    default: 'PANCHA',
    order: ['PANCHA', 'BOTH', 'SAPTA'],
    PANCHA: { labelTa: 'பஞ்சசலாகை', textTa: 'பஞ்சசலாகைச் சக்கரத்தில் சந்திரனின் நட்சத்திரத்துக்கு எதிர் முனையில் கிரகம். பாவ கிரகம் (சூரியன், செவ்வாய், சனி, ராகு, கேது) — நட்சத்திரம் முழுவதும்; சுப கிரகம் (புதன், குரு, சுக்கிரன்) — 1↔4, 2↔3 பாதம் மட்டும்.', booksTa: 'முகூர்த்த சிந்தாமணி ("பொதுவாகத் திருமணத்துக்கு"), ஸ்ரீதர், ரங்காச்சார்யா, ஜோஷி' },
    BOTH: { labelTa: 'பஞ்ச, சப்த இரண்டும்', textTa: 'இரண்டு சக்கரங்களிலும் வேதை பார்க்க.', booksTa: 'போஜர், வராகமிகிரர் (முகூர்த்த சிந்தாமணி, ஸ்ரீதர் வழியாக)' },
    SAPTA: { labelTa: 'சப்தசலாகை', textTa: 'சப்தசலாகைச் சக்கரத்தில் மட்டும், அதே பாத விதி.', booksTa: 'அகர்வால் (திருமணத்துக்கு); மற்ற நூல்கள் திருமணம் அல்லாத செயல்களுக்கு' },
  },
  JAMITRA: {
    default: 'SEVENTH',
    order: ['SEVENTH', 'NAVAMSA_55', 'STAR_14'],
    SEVENTH: { labelTa: 'சந்திரனுக்கு 7-ஆம் ராசியில் கிரகம்', textTa: 'சந்திரனுக்கு 7-ஆம் ராசியில் எந்தக் கிரகமும் — புதன் தவிர (வாத்ஸ்யாயனர்: பெண் கணவருக்கு எப்போதும் பிரியமாக இருப்பாள்). லக்னத்துக்கு 7-ல் கிரகம் உள்ள லக்னங்கள் தனியே காட்டப்படுகின்றன.', booksTa: 'ஸ்ரீதர், முகூர்த்த சிந்தாமணி ஸ்லோ.67, ஜோஷி, வில்ஹெல்ம்' },
    NAVAMSA_55: { labelTa: '55-வது நவாம்சம் (நுட்பமானது)', textTa: 'சந்திரனின் நவாம்சத்திலிருந்து 55-வது நவாம்சத்தில் (சரியாக எதிர் 3°20′) கிரகம் — புதன் தவிர.', booksTa: 'முகூர்த்த சிந்தாமணி ("இதையே ஏற்பது முறை"), ஸ்ரீதர் (முகூர்த்த மார்த்தாண்டம்), ஜோஷி, ரங்காச்சார்யா' },
    STAR_14: { labelTa: '14-வது நட்சத்திரத்தில் பாவ கிரகம்', textTa: 'சந்திரனின் நட்சத்திரத்திலிருந்து 14-வது நட்சத்திரத்தில் பாவ கிரகம் (சூரியன், செவ்வாய், சனி, ராகு, கேது).', booksTa: 'வசிஷ்டா, அகர்வால், ரங்காச்சார்யா, ஸ்ரீதர் (முகூர்த்த கணபதி, முகூர்த்த பிரகாசம், சாரசங்கிரகம்)' },
  },
  BANA: {
    default: 'SUN_DEGREE',
    order: ['SUN_DEGREE', 'SUN_DEGREE_ORDINAL', 'TITHI_LAGNA'],
    SUN_DEGREE: { labelTa: 'சூரியனின் பாகை (முடிந்த பாகை)', textTa: 'ராசியில் சூரியன் முடித்த பாகைக்கு 6, 3, 1, 8, 4 கூட்டி 9-ஆல் வகுக்க, மீதி 5 வரும் இடம் ரோக, அக்னி, ராஜ, சோர, மிருத்யு பாணம். திருமணத்துக்கு மிருத்யு பாணம் — சூரியன் 1, 10, 19, 28-ஆம் பாகையில்.', booksTa: 'ஸ்ரீதர் (அட்டவணை 8.10), முகூர்த்த சிந்தாமணி (வட இந்தியா), ஜோஷி' },
    SUN_DEGREE_ORDINAL: { labelTa: 'சூரியனின் பாகை (0-1° முதல் பாகை)', textTa: 'அதே கணக்கு, 0-1° "முதல் பாகை" என எண்ணி — மிருத்யு பாணம் 0, 9, 18, 27-ஆம் முடிந்த பாகையில்.', booksTa: 'வில்ஹெல்ம்' },
    TITHI_LAGNA: { labelTa: 'திதி + லக்னம் (தென் இந்தியா)', textTa: 'வளர்பிறைப் பிரதமை முதல் திதி எண் (1-30) + லக்ன எண் (மேஷம் 1), 9-ஆல் வகுத்த மீதி 1 மிருத்யு, 2 அக்னி, 4 ராஜ, 6 சோர, 8 ரோக. இது லக்னத்தைப் பொறுத்தது — இங்கே ஒவ்வொரு நேரத்துக்கும் தவிர்க்க வேண்டிய லக்னங்கள் காட்டப்படுகின்றன, தீர்ப்பில் சேர்க்கப்படவில்லை.', booksTa: 'முகூர்த்த சிந்தாமணி (மகாராஷ்டிரம்), ஸ்ரீதர், ஜோஷி, வசிஷ்டா, வில்ஹெல்ம்' },
  },
  EKARGALA: {
    default: 'KHARJURA_28',
    order: ['KHARJURA_28', 'KHARJURA_27', 'ODD_COUNT', 'ODD_COUNT_27', 'WILHELM'],
    KHARJURA_28: { labelTa: 'கர்ஜூரச் சக்கரம் — அபிஜித்துடன்', textTa: 'தீய யோகங்கள் ஒன்பதில் ஒன்று நடக்கும்போது, அந்த யோகத்தின் நட்சத்திரத்தை (விஷ்கம்பம் அசுவினி, அதிகண்டம் அனுஷம், சூலம் மிருகசீரிடம், கண்டம் மூலம், வ்யாகாதம் புனர்பூசம், வஜ்ரம் பூசம், வ்யதீபாதம் ஆயில்யம், பரிகம் மகம், வைத்ருதி சித்திரை) உச்சியில் வைத்து 28 நட்சத்திரங்களை எழுதி, ஒரே கோட்டின் இரு முனைகளில் சூரியனும் சந்திரனும்.', booksTa: 'கல்யாணராமன் (மூன்றாம் முறை), ஸ்ரீதர்' },
    KHARJURA_27: { labelTa: 'கர்ஜூரச் சக்கரம் — அபிஜித் இல்லாமல்', textTa: 'அதே சக்கரம், 27 நட்சத்திரங்களுடன்.', booksTa: 'ரங்காச்சார்யா (இரண்டாம் முறை), காலப்பிரகாசிகை' },
    ODD_COUNT: { labelTa: 'சூரியனிலிருந்து சந்திரன் ஒற்றைப்படை — அபிஜித்துடன்', textTa: 'தீய யோகம் நடக்கும்போது சூரிய நட்சத்திரத்திலிருந்து சந்திர நட்சத்திரம் வரை (அபிஜித் சேர்த்து) எண்ணிக்கை ஒற்றைப்படை (1, 3, 5 …).', booksTa: 'முகூர்த்த சிந்தாமணி ஸ்லோ.62, ஜோஷி, அகர்வால், ரங்காச்சார்யா (முதல் முறை)' },
    ODD_COUNT_27: { labelTa: 'ஒற்றைப்படை — அபிஜித் இல்லாமல்', textTa: 'அதே, அபிஜித்தை எண்ணாமல்.', booksTa: 'நாரதர் (முகூர்த்த சிந்தாமணி உரை)' },
    WILHELM: { labelTa: 'வில்ஹெல்ம் — யோகத்தின் நட்சத்திரம் (+93°20′)', textTa: 'யோகத்துக்கு உரிய நட்சத்திரம் (சூரியன் + சந்திரன் + 93°20′ — விஷ்கம்பத்துக்குப் பூசம்) முதல் முன்னும் பின்னும் சம தூரத்தில் சூரியனும் சந்திரனும்; சந்திரன் அசுவினி, மிருகசீரிடம், புனர்பூசம், பூசம், அஸ்தம், சித்திரை, அவிட்டம், ரேவதியில் இருந்தால் இல்லை.', booksTa: 'வில்ஹெல்ம்' },
  },
  UPAGRAHA: {
    default: 'UPA13',
    order: ['UPA13', 'UPA13_QUARTER', 'UPA13_ABHIJIT', 'UPA8'],
    UPA13: { labelTa: '5, 7, 8, 10, 14, 15, 18, 19, 21-25', textTa: 'சூரிய நட்சத்திரத்திலிருந்து சந்திர நட்சத்திரம் 5, 7, 8, 10, 14, 15, 18, 19, 21, 22, 23, 24, 25-வது.', booksTa: 'ஸ்ரீதர், முகூர்த்த சிந்தாமணி ஸ்லோ.63, ரங்காச்சார்யா, வில்ஹெல்ம், அகர்வால், வசிஷ்டா' },
    UPA13_QUARTER: { labelTa: 'அதே — சூரியனின் பாத எண் உள்ள பாதம் மட்டும்', textTa: 'சந்திரனின் பாத எண் சூரியனின் பாத எண்ணே ஆனால் மட்டும் (முகூர்த்த சிந்தாமணி ஸ்லோ.64; முகூர்த்த பிரகாசம், முகூர்த்த கணபதி — ஸ்ரீதர் வழியாக; வில்ஹெல்ம்; ரங்காச்சார்யா).', booksTa: 'முகூர்த்த சிந்தாமணி ஸ்லோ.64, வில்ஹெல்ம், ரங்காச்சார்யா, ஸ்ரீதர் (மு.பி., மு.க.)' },
    UPA13_ABHIJIT: { labelTa: 'அதே எண்கள் — அபிஜித் சேர்த்து எண்ணி', textTa: 'எண்ணும்போது அபிஜித்தையும் ஒரு நட்சத்திரமாகச் சேர்த்து.', booksTa: 'ஜோஷி' },
    UPA8: { labelTa: '5, 8, 14, 18, 19, 22, 23, 24 மட்டும்', textTa: 'முகூர்த்த பிரகாசத்தின் எட்டு எண்கள்.', booksTa: 'ஸ்ரீதர் (முகூர்த்த பிரகாசம்)' },
  },
  KRANTI: {
    default: 'SIGN_PAIRS',
    order: ['SIGN_PAIRS'],
    SIGN_PAIRS: { labelTa: 'ராசி ஜோடிகள்', textTa: 'சூரியனும் சந்திரனும் மேஷம்-சிம்மம், ரிஷபம்-மகரம், துலாம்-கும்பம், கன்னி-மீனம், கடகம்-விருச்சிகம், மிதுனம்-தனுசு — ஒரு ஜோடியின் இரு ராசிகளில்.', booksTa: 'ஸ்ரீதர், முகூர்த்த சிந்தாமணி ஸ்லோ.61, ஜோஷி, அகர்வால், வசிஷ்டா' },
  },
  DAGDHA: {
    default: 'BOTH',
    order: ['BOTH', 'BY_SIGN'],
    BOTH: { labelTa: 'இரு பக்ஷத்திலும்', textTa: 'சூரியன் தனுசு/மீனத்தில் துவிதியை, ரிஷபம்/கும்பத்தில் சதுர்த்தி, கடகம்/மேஷத்தில் சஷ்டி, கன்னி/மிதுனத்தில் அஷ்டமி, சிம்மம்/விருச்சிகத்தில் தசமி, மகரம்/துலாத்தில் துவாதசி — வளர்பிறை, தேய்பிறை இரண்டிலும்.', booksTa: 'ஸ்ரீதர் (ஜ்யோதிர்வித்யாபரணம்), முகூர்த்த சிந்தாமணி ஸ்லோ.66, ஜோஷி, அகர்வால், வில்ஹெல்ம்' },
    BY_SIGN: { labelTa: 'ஒற்றை ராசியில் வளர்பிறை, இரட்டையில் தேய்பிறை', textTa: 'அதே திதிகள் — சூரியன் ஒற்றை ராசியில் (மேஷம், மிதுனம் …) இருந்தால் வளர்பிறையில் மட்டும், இரட்டை ராசியில் தேய்பிறையில் மட்டும்.', booksTa: 'ரங்காச்சார்யா, வசிஷ்டா (அட்டவணை), ஸ்ரீதர் (ஜ்யோதிஸ்தத்வம்)' },
  },
});

/** How many of the ten may be present. Latta is counted with the page's own Latta switches. */
const RULES = deepFreeze({
  default: 'SIX_OF_TEN',
  order: ['SIX_OF_TEN', 'FIVE_AND_SIX', 'FIVE', 'ALL_TEN', 'NONE'],
  SIX_OF_TEN: { labelTa: 'பத்தில் ஆறாவது இல்லாமல்', textTa: 'பத்தில் குறைந்தது ஆறு தோஷங்கள் இல்லையெனில் திருமணம் அனுமதி — "எல்லாவற்றையும் தவிர்க்க முயன்றால் இந்தப் பிறவியில் திருமணம் இல்லை; பெரும்பான்மை போதும்" (ஜோஷி). யுதி, வேதை, மிருத்யு பஞ்சகம், க்ராந்தி சாம்யம், தக்த திதி மற்றவற்றைவிடத் தீயவை எனக் காட்டப்படுகின்றன.', booksTa: 'ஜோஷி' },
  FIVE_AND_SIX: { labelTa: 'ஐந்து கடுமையானவை இல்லாமல், ஆறாவது இல்லாமல்', textTa: '3, 4, 6, 8, 10 (யுதி, வேதை, மிருத்யு பாணம், க்ராந்தி சாம்யம், தக்த திதி) கட்டாயம் இல்லாமல், மொத்தம் குறைந்தது ஆறு இல்லாமல். வசிஷ்டாவின் வரிசையில் 8-வது க்ராந்தி சாம்யம் — ஸ்ரீதர், ஜோஷி பெயரிட்டுச் சொல்லும் ஐந்தும் இவையே; அகர்வால் அதே எண்களைத் தந்து தன் பட்டியலில் 8-வதாக உபக்கிரகத்தை வைக்கிறார் (9-வது க்ராந்தி) — இங்கே பெயரால் உள்ள ஐந்து.', booksTa: 'அகர்வால் ("6 ரேகைகள் ஏற்கலாம்"), வசிஷ்டா' },
  FIVE: { labelTa: 'ஐந்து கடுமையானவை மட்டும்', textTa: 'யுதி, வேதை, மிருத்யு பாணம், க்ராந்தி சாம்யம், தக்த திதி — "எல்லா இடங்களிலும் விலக்கு"; மற்றவை இடத்தைப் பொறுத்தவை (முகூர்த்த சிந்தாமணி: பாதம் கலிங்கம், வங்காளத்தில், உபக்கிரகம் குருக்ஷேத்திரம், காஷ்மீரில் …).', booksTa: 'ஸ்ரீதர்' },
  ALL_TEN: { labelTa: 'பத்தும் இல்லாமல்', textTa: 'பத்தில் ஒன்றும் இருக்கக் கூடாது — "சிறந்தது".', booksTa: 'வசிஷ்டா, அகர்வால் ("10 ரேகைகள் சிறந்தது")' },
  NONE: { labelTa: 'காட்டு மட்டும் (திருமணம் அல்லாத செயல்)', textTa: 'இந்தத் தோஷங்கள் திருமண முகூர்த்தத்துக்கானவை; மற்ற செயல்களுக்குத் தீர்ப்பில் சேர்க்கப்படுவதில்லை.', booksTa: '' },
});

// ---------------------------------------------------------------------------
// Order by words
// ---------------------------------------------------------------------------

const RANK = deepFreeze({
  PAATA: rank({ SHRIDHAR: 619, MUHURTA_CHINTAMANI: 247, RANGACHARYA: 237, JOSHI: 212, WILHELM: 75, KALYANRAMAN: 56, VASHISTHA: 27, AGARWAL: 17 }, 'பாத தோஷம் பற்றிய பகுதியின் சொற்கள்: ஸ்ரீதர் (§8.11, பக்.195-197, அட்டவணை 8.9 உட்பட) 619; முகூர்த்த சிந்தாமணி (ப.197, 199) 247; ரங்காச்சார்யா (ப.63, 65) 237; ஜோஷி (ப.68, அட்டவணை உட்பட) 212; வில்ஹெல்ம் 75; கல்யாணராமன் 56; வசிஷ்டா 27; அகர்வால் 17.'),
  YUTI: rank({ SHRIDHAR: 478, RANGACHARYA: 219, MUHURTA_CHINTAMANI: 160, WILHELM: 149, AGARWAL: 109, JOSHI: 94, VASHISTHA: 38, KALYANRAMAN: 28 }, 'யுதி பற்றிய சொற்கள்: ஸ்ரீதர் (§8.5) 478; ரங்காச்சார்யா (ஸக்ரஹ சந்திரன்) 219; முகூர்த்த சிந்தாமணி (ப.185) 160; வில்ஹெல்ம் (இந்து ஸக்ரஹம், ப.139, 264) 149; அகர்வால் 109; ஜோஷி 94; வசிஷ்டா 38; கல்யாணராமன் 28.'),
  VEDHA: rank({ MUHURTA_CHINTAMANI: 1014, SHRIDHAR: 668, RANGACHARYA: 357, JOSHI: 342, AGARWAL: 67, VASHISTHA: 16 }, 'வேதை பற்றிய சொற்கள் (சக்கரங்களின் பெயர்கள் உட்பட): முகூர்த்த சிந்தாமணி (பக்.192-195) 1014; ஸ்ரீதர் (§8.7-8.8) 668; ரங்காச்சார்யா (பக்.60-62) 357; ஜோஷி (பக்.69-71) 342; அகர்வால் 67; வசிஷ்டா 16. வில்ஹெல்மின் வேதை கோசார வேதை மட்டும்.'),
  JAMITRA: rank({ SHRIDHAR: 673, MUHURTA_CHINTAMANI: 526, RANGACHARYA: 241, WILHELM: 175, JOSHI: 138, AGARWAL: 42, VASHISTHA: 15 }, 'ஜாமித்ரம் பற்றிய சொற்கள்: ஸ்ரீதர் (§8.4) 673; முகூர்த்த சிந்தாமணி (பக்.201-203) 526; ரங்காச்சார்யா (பக்.65-66) 241; வில்ஹெல்ம் (ப.265) 175; ஜோஷி 138; அகர்வால் 42; வசிஷ்டா 15.'),
  BANA: rank({ SHRIDHAR: 867, MUHURTA_CHINTAMANI: 728, WILHELM: 597, JOSHI: 552, RANGACHARYA: 489, VASHISTHA: 50, AGARWAL: 17 }, 'பாணம் / மிருத்யு பஞ்சகம் பற்றிய சொற்கள்: ஸ்ரீதர் (§8.12) 867; முகூர்த்த சிந்தாமணி (பக்.205-207) 728; வில்ஹெல்ம் (பக்.149-151) 597; ஜோஷி (பக்.37-38, 71) 552; ரங்காச்சார்யா (பஞ்சக ரஹிதம், பக்.43-45) 489; வசிஷ்டா 50; அகர்வால் 17.'),
  EKARGALA: rank({ KALYANRAMAN: 477, SHRIDHAR: 462, RANGACHARYA: 407, KALAPRAKASIKA: 271, WILHELM: 184, MUHURTA_CHINTAMANI: 166, JOSHI: 62, AGARWAL: 46, RAMAN: 33, VASHISTHA: 19 }, 'ஏகார்கலம் பற்றிய சொற்கள்: கல்யாணராமன் (தொகுதி 1, பக்.113-114, 121-122) 477; ஸ்ரீதர் (§8.9, சக்கர வரைபடங்கள் தவிர) 462; ரங்காச்சார்யா (பக்.58-60) 407; காலப்பிரகாசிகை (பக்.169, 192) 271; வில்ஹெல்ம் 184; முகூர்த்த சிந்தாமணி 166; ஜோஷி 62; அகர்வால் 46; ராமன் 33; வசிஷ்டா 19. கல்யாணராமன் மூன்று முறைகளை முன்னுரிமையின்றித் தருகிறார்; அவற்றில் கர்ஜூரச் சக்கரம் (அபிஜித்துடன்) இரண்டாம் நூலான ஸ்ரீதரின் ஒரே முறையும் — அதுவே இயல்பு. மற்ற இரண்டு (360° − சூரியன்; நட்சத்திர முடிவுப் பகுதிகள்) கணிக்கப்படவில்லை: முதலாவதன் பட்டியல் அவரின் இரு இடங்களில் வேறுபடுகிறது (16-வது ஒரு இடத்தில் மட்டும்), இரண்டாவதன் "முடிவுப் பகுதி" அளவு சொல்லப்படவில்லை.'),
  UPAGRAHA: rank({ SHRIDHAR: 284, MUHURTA_CHINTAMANI: 187, RANGACHARYA: 117, WILHELM: 83, AGARWAL: 44, JOSHI: 40, VASHISTHA: 33 }, 'உபக்கிரகம் பற்றிய சொற்கள்: ஸ்ரீதர் (§8.14) 284; முகூர்த்த சிந்தாமணி (ப.199) 187; ரங்காச்சார்யா 117; வில்ஹெல்ம் 83; அகர்வால் 44; ஜோஷி 40; வசிஷ்டா 33.'),
  KRANTI: rank({ SHRIDHAR: 590, MUHURTA_CHINTAMANI: 226, JOSHI: 115, RANGACHARYA: 93, AGARWAL: 72, VASHISTHA: 12 }, 'க்ராந்தி சாம்யம் பற்றிய சொற்கள்: ஸ்ரீதர் (§8.3) 590; முகூர்த்த சிந்தாமணி (ப.198) 226; ஜோஷி 115; ரங்காச்சார்யா (மகாபாதம்) 93; அகர்வால் 72; வசிஷ்டா 12.'),
  DAGDHA: rank({ SHRIDHAR: 214, MUHURTA_CHINTAMANI: 133, RANGACHARYA: 107, JOSHI: 76, WILHELM: 67, VASHISTHA: 59, AGARWAL: 39 }, 'தக்த திதி பற்றிய சொற்கள்: ஸ்ரீதர் (§2.15, அட்டவணை 2.6) 214; முகூர்த்த சிந்தாமணி (ப.201) 133; ரங்காச்சார்யா 107; ஜோஷி 76; வில்ஹெல்ம் 67; வசிஷ்டா 59; அகர்வால் 39.'),
  RULE: rank({ JOSHI: 73, AGARWAL: 71, SHRIDHAR: 60, VASHISTHA: 35 }, 'எத்தனை தோஷம் இருக்கலாம் என்ற விதியின் சொற்கள்: ஜோஷி (ப.72, 74) 73; அகர்வால் (ப.316) 71; ஸ்ரீதர் (ப.478) 60; வசிஷ்டா (ப.111) 35.'),
});

// ---------------------------------------------------------------------------
// The books' words
// ---------------------------------------------------------------------------

const SOURCES = deepFreeze({
  PAATA: {
    SHRIDHAR: Object.freeze({ ...SHRIDHAR_HEA, pageLocus: '§8.11 "Paata Dosha", printed pp.195-197 (PDF 239-241): "Asterism occupied by the Moon at the ending moments of Harshana, Vaidhriti, Sadhya, Vytipaata, Ganda, & Shoola (Naisrgika Yogas) is sullied"; the example of 09/12/1998 (Vaidhriti ended with the Moon in the 3rd pada of Magha; "using concept of soiling of one specific Pada only"); "b) According to Sage Narad & Vasist & Acharya Shripati ... Count from the constellation occupied by the Sun upto Ashlesha, Magha, Swati, Anuradha, Shravana, & Revati"; Table 8.9' }),
    MUHURTA_CHINTAMANI: Object.freeze({ ...MC_SHARMA, pageLocus: 'Vivaha Prakarana, sloka 60, printed p.197 (PDF 201): "हर्षणवैधृतिसाध्यव्यतिपातकगण्डशूलयोगानाम् । अन्ते यन्नक्षत्रं पातेन निपातितं तत्स्यात्"; the note: Narada and Vashishtha count "from the Nakshtra of the Sun to the Ashlesha, Magha, Anuradha, Chitra, Shravana and Rewati Nakshtra", example the Sun in Hasta; sloka 64, printed p.199: "पातोपग्रहलत्तासु नेष्टोऽङ्घ्रिः खेटपत्समः"' }),
    RANGACHARYA: Object.freeze({ ...RANGACHARYA_I, pageLocus: 'printed p.63 (PDF 71): "The Moon\'s Nakshatra falling at the end of any one of the six yogas viz, Harshana, Vaidhriti, Sadhya, Vyatipatha, Ganda Soola, is deemed blemished by PATHA"; Vasishtta and Narada: "Count from the Nakshatra occupied by the Sun to Aslesha, Makha, Chitra, Anuradha, Sravana and Revati", example the Sun in Swati; p.65 (PDF 73): "The patha, upagraha and Latta need not be considered evil if the nakshatra padas differ in each"' }),
    JOSHI: Object.freeze({ ...JOSHI_KK, pageLocus: 'printed p.68 (PDF 83): "Those nakshatras in which Harshana, Vaidhriti, Sadhya, Vyatipaat, Ganda and shoola yogas end are said to suffer from Paata dosha"; Table 6.2 (the Sun\'s stars for each marriage star); "If the planets causing Paata dosha (i.e Sun & Moon) are placed in same quarter ... the dosha will be more severe"' }),
    WILHELM: Object.freeze({ ...WILHELM_E, pageLocus: 'printed p.266 (PDF 274): "The Moon should not be in any of the Nakshatras, counted from Asvini, arrived at by counting from the Nakshatra of the Sun to Aslesha, Magha, Chitta, Anuradha, Sravana or Revati. Paata ... is only significantly effective when the Moon is in the same Nakshatra Pada as is the Sun"' }),
    KALYANRAMAN: Object.freeze({ ...KALYANRAMAN_V2, pageLocus: 'printed p.129 (PDF 131), Seegrabodham\'s ten evils: "Paada-dosha happens when the Sun is in Aslesha, Makha, Chitra, Anuradha, Sravana or Revati ... However, this is not considered in many regions"' }),
    VASHISTHA: Object.freeze({ ...VASHISTHA_KUSUM, pageLocus: 'printed p.110 (PDF 97): "Pat: The vivahas nakshatra that falls at the end of the following yogas is prohibited for marriage. Harshana, Vaidhriti, Sadhya, Vyatipata, Ganda and Shoola yoga"' }),
    AGARWAL: Object.freeze({ ...AGARWAL_GS, pageLocus: 'printed p.316 (PDF 315): "Paata dosha: occurs when Yogas Harshana, Vaidhriti, Saadhya, Vyatipata, Ganda an Shoola end in vivaah nakshatra"' }),
  },
  YUTI: {
    SHRIDHAR: Object.freeze({ ...SHRIDHAR_HEA, pageLocus: '§8.5 "Yuti (Sangraha) Dosha", printed pp.181-182 (PDF 225-226): "If there is a planet in the sign occupied by the Moon, Yuti or Sangraha Dosha is caused. According to M.G., if the Moon is with Mercury or Jupiter, then the aspirant should not shun the combination. In the opinion of M.P., the Moon & Venus in same sign does not cause this Dosha"; "N.S. opines that the Moon with any benefic or malefic is considered bad"; the counteractions (M.P., Brihaspati, Jyotirnibandh, M.G.)' }),
    RANGACHARYA: Object.freeze({ ...RANGACHARYA_I, pageLocus: '"Sagraha Chandra", printed p.57 (PDF 65): "The conjunction of the Moon with any other planet is an evil"; Moon + Mercury "Good", + Jupiter "Happiness"; "Some say the evil of sagrahachandra arises if any malefic planet transits in the nakshtra of the Moon (Muhurtha ganapati)"; "Though the Moon and her conjunct planet are in the same nakshatra, the evil doesn\'t arise if they are in the different signs"' }),
    MUHURTA_CHINTAMANI: Object.freeze({ ...MC_SHARMA, pageLocus: 'printed p.185 (PDF 189): "If in the Ascendant at Marriage the Moon is in conjunction with the Sun, then there will be penury; if she is in conjunction with Mars, death; it will be auspicious if with Mercury; there will be happiness if she is with Jupiter; enmity if with Venus"; the note: "If the Moon is in her own sign, or in her highest exaltation sign or in a friend\'s sign, then she will not be affected by this \'Yuti Dosha\'"' }),
    WILHELM: Object.freeze({ ...WILHELM_E, pageLocus: 'printed p.139 (PDF 147): "Indu Sagraha- the Moon with a Planet: The Moon should be alone; its conjunction with any planet indicates a source that prevents the proper growth of the event"; p.264 (PDF 272): Muhurta Chintamani "considers it favorable for the Moon to join Jupiter or Mercury ... though this goes against the Indu Sagraha Dosha"' }),
    AGARWAL: Object.freeze({ ...AGARWAL_GS, pageLocus: 'printed p.316 (PDF 315): "Yuti dosha: If at marriage the Moon is in lagna Sun, then there will be penury; if she is in conjunction with Mars, death; it will be auspicious if with Mercury"; "If the Moon is in her own sign, or in her exaltation sign or in a friend\'s sign, then she will not be affected"' }),
    JOSHI: Object.freeze({ ...JOSHI_KK, pageLocus: 'printed p.69 (PDF 84): "If a planet is posited in the nakshatra of marriage it is called Yuti dosha"; "(c) Moon and malefic planet though posited in same nakshatra are placed in different signs"' }),
    VASHISTHA: Object.freeze({ ...VASHISTHA_KUSUM, pageLocus: 'printed p.110 (PDF 97): "Yuti: There should be no planet with Moon specially Venus. If it is a full Moon or exalted Moon, the fault does not apply. Or, if the Moon is aspected by Jupiter"' }),
    KALYANRAMAN: Object.freeze({ ...KALYANRAMAN_V2, pageLocus: 'printed p.130 (PDF 132): "Yutidosha is nothing but Sagrahadosha when any other planet also occupies the same nakshatra occupied by the Moon on the day. Only Venus is exempt from this disqualification"' }),
  },
  VEDHA: {
    MUHURTA_CHINTAMANI: Object.freeze({ ...MC_SHARMA, pageLocus: 'slokas 56-58, printed pp.192-195 (PDF 196-199): the Pancha Shalaka pairs "Rohini Abhijita, Bharani-Anuradha, Uttarashadha-Mrigashira, Shravana Magha, Hasta-Uttarabhadrapada, Swati-Shatabhisha, Moola-Punarvasu, Uttaraphalguni-Rewati" and the speculum; "the Vedha of the 4th Quarter with the 1st quarter and of the 3rd Quarter with the 2nd quarter"; "if the Vedha is by a Malefic Planet then the whole Nakshtra should be rejected"; the Sapta Shalaka pairs; "Generally it is the \'Pancha Shalaka Chakra\' which is consulted in reference to marriage, but ... Bhoja and Varaha Mihira are of the view that the Sapta Shalaka Chakra should also be consulted"' }),
    SHRIDHAR: Object.freeze({ ...SHRIDHAR_HEA, pageLocus: '§8.7-8.8, printed pp.183-186 (PDF 227-230): "Mutually afflicting constellations are: Ashvani - P.Falguni; Bharni - Anuradha; Krittika - Vishakha; Rohini - Abhijit; ... Swati - Shatbhish"; "afflicted constellation (in full) through a malefic planet be completely avoided, & only corresponding Pada of the afflicted constellation through a benefic planet be avoided"; "Most of the authors agree that Panchashalaka Vedha should be seen in marriage while Saptashalaka Vedha in other elections"' }),
    RANGACHARYA: Object.freeze({ ...RANGACHARYA_I, pageLocus: 'printed pp.60-62 (PDF 68-70): the fourteen Pancha Salaka pairs and the fourteen Sapta Salaka pairs; "Some say the Vedha is only evil, if the padas of the two nakshatras in the pair, are 1-4, 4-1, 2-3, 3-2. But Rajamarthanda states this conditin stands valid only in the case of the benefic planets"' }),
    JOSHI: Object.freeze({ ...JOSHI_KK, pageLocus: 'printed pp.69-71 (PDF 84-86): "For marriage and all ceremonies related to marriage vedha is seen on Panchasalaka chakra"; "A planet placed in 4th quarter causes vedha in 1st quarter and vice versa"; "For all other purposes ... Vedha is to be seen on Sapta-Salaka Chakra"' }),
    AGARWAL: Object.freeze({ ...AGARWAL_GS, pageLocus: 'printed pp.316-317 (PDF 315-316): "Vedha dosha or saptashalaka chakra: ... A planet placed in Rohini nakshatra will cause Vedha to a planet placed in Abhijit nakshatra"' }),
    VASHISTHA: Object.freeze({ ...VASHISTHA_KUSUM, pageLocus: 'printed p.110 (PDF 97): "Vedha chakras have already been given. There should be no nakshatra vedha"' }),
  },
  JAMITRA: {
    SHRIDHAR: Object.freeze({ ...SHRIDHAR_HEA, pageLocus: '§8.4 "Jamitra Dosha", printed pp.179-181 (PDF 223-225): "A planet in the seventh house from the Moon or ascendant causes Jamitra Dosha"; "According to M.C.& M.M., a planet in the 55th navamsha ... produces accurate (Sukshama) Jamitra Dosha ... Others (M.G., M.P.& Saarsangraha) opine that a planet in the 14 constellation causes this Dosha"; "Mercury in the 7th house from the Moon is considered good in marriage (Sage Vatsyayan)"; "planet in 7th house, 14th constellation & 55th navamsha cause Jamitra dosh in the order of increasing severity"' }),
    MUHURTA_CHINTAMANI: Object.freeze({ ...MC_SHARMA, pageLocus: 'sloka 67, printed pp.201-203 (PDF 205-207): "लग्नाच्चन्द्रान्मदनभवनगे खेटे न स्यादिह परिणयनम् । किं वा बाणाशुगमितलवगे जामित्रं स्यादशुभकरमिदम्"; "The more proper thing will be to accept only the brief \'Jamitra Dosha\'"; Vatsyayana: Mercury in the 7th from the Moon keeps the woman dear to her husband' }),
    RANGACHARYA: Object.freeze({ ...RANGACHARYA_I, pageLocus: 'printed pp.65-66 (PDF 73-74): "1) A malefic planet in the 7th of Lagna ... 2) A benefic planet in the 55th navamsa from Lagna in the 7th ... 3) A malefic in the 55th navamsa of the Moon in the 7th or in the 14th nakshatra of the Moon\'s nakshatra causes Jamithra evil"; the exceptions' }),
    WILHELM: Object.freeze({ ...WILHELM_E, pageLocus: 'printed p.265 (PDF 273): "A planet in the 7th from the Lagna or the Moon is very unfavorable. It is also unfavorable if a planet is in the 7th from them in the Navamsa. This blemish is most severe when considered from the Lagna ... Mercury in the 7th from the Moon, however, is void of this Dosha"' }),
    JOSHI: Object.freeze({ ...JOSHI_KK, pageLocus: 'printed p.71 (PDF 86): "If a planet is placed in seventh house from marriage Lagna or Moon it is called Jamitra-dosha. Minute or more malefic Jamitra dosha will be caused if a planet is placed in 55th navamsha"; "Mercury placed in seventh house from moon gives benefic results"' }),
    AGARWAL: Object.freeze({ ...AGARWAL_GS, pageLocus: 'printed p.317 (PDF 316): "Jaimittra dosha: Occurs if malefics occupy 14th nakshatra from that of vivaah nakshatra and vivaah lagna"' }),
    VASHISTHA: Object.freeze({ ...VASHISTHA_KUSUM, pageLocus: 'printed p.110 (PDF 97): "Jamitra: There should be no malefic planet on 14 nakshatras from the vivaha nakshatra"' }),
  },
  BANA: {
    SHRIDHAR: Object.freeze({ ...SHRIDHAR_HEA, pageLocus: '§8.12, printed pp.197-199 (PDF 241-243): "Add 6,3,1,8,4; separately to the completed degrees (ignoring sign, minutes & seconds) of the Sun ... If remainder is 5 in any place ... Roga ... Agni ... Nrip ... Chor ... Mrityu"; Table 8.10 (Mrityu at 1, 10, 19, 28; marriage); §8.12.2: "prevalent in Southern part of India ... adding Tithi number (counting from 1st of B.H.) to the rising sign number ... 8, 2, 4, 6, 1"' }),
    MUHURTA_CHINTAMANI: Object.freeze({ ...MC_SHARMA, pageLocus: 'slokas 71-74, printed pp.205-207 (PDF 209-211): "To the number of the Tithis which have passed since the Pratipada ... of the Shukla Paksha ... is added the Ascendant at the marriage time and this is divided by 9 ... if 1, then Mrityu Baana"; "The Baana Doshas popular in northern India: The traversed degrees of the Sun ... 6,3,1,8 and 4"; "the Mrityu Baana in Marriage Samskar"' }),
    WILHELM: Object.freeze({ ...WILHELM_E, pageLocus: 'printed pp.149-151 (PDF 157-159): "Divide the sum of the Tithi (from 1-30) and the Lagna by 9"; "(If the Sun is from 0-1 degrees it is the first degree, from 1-2 degrees it is the second degree, etc.)"; "Roga and Mrityu Panchaka or Bana should be avoided for marriage"; "Panchaka and Bana have not been found to be very severe blemishes"' }),
    JOSHI: Object.freeze({ ...JOSHI_KK, pageLocus: 'printed pp.37-38 (PDF 52-53) and p.71 (PDF 86): "in 1, 10, 19, 28 degrees in any sign it is Mrityu baana"; "Mrityu baana should be avoided in marriage"; the tithi-and-lagna method "is followed only in Maharastra"' }),
    RANGACHARYA: Object.freeze({ ...RANGACHARYA_I, pageLocus: '"Panchakarahitham", printed pp.43-45 (PDF 51-53): tithi, vara, nakshatra and muhurtha lagna added; "12. Mrityu Panchaka should be avoided for marriage"' }),
    VASHISTHA: Object.freeze({ ...VASHISTHA_KUSUM, pageLocus: 'printed p.110 (PDF 97): "From shukla pratipada to the present tithi + lagnarashi ÷ 9 = (If remainder is...) 1 = mrityu"' }),
    AGARWAL: Object.freeze({ ...AGARWAL_GS, pageLocus: 'printed p.317 (PDF 316): "Mrityu panchaka dosha: This has been explained earlier and it should be avoided in vivaah muhurta"' }),
  },
  EKARGALA: {
    KALYANRAMAN: Object.freeze({ ...KALYANRAMAN_V1, pageLocus: 'printed pp.113-114, 121-122 (PDF 123-124, 131-132): "Deduct the longitude of the Sun from 360°"; "the end portions of Aswini, Aridra, Aslesha, Makha, Hasta, Swati, Anuradha, Moola and Revati"; "Draw 13 small parallel lines ... there will be 28 ends ... Abhijith is to be included in this count ... If the Sun and the Moon occupy the two constellations at the two ends of on any of the lines the dosha emerges"; the table "Vishkumbha - Aswini ... Parigha - Makha"' }),
    SHRIDHAR: Object.freeze({ ...SHRIDHAR_HEA, pageLocus: '§8.9 "Ekargal Dosha", printed pp.187-189 (PDF 231-233): "If both the Sun & the Moon are in the constellations mentioned on opposite sides of any of the lines in the diagram - Ekargal Dosha prevails. Abhijit is included"; "if the number of the Naisargika Yoga is odd, then add one to it & divide the sum by 2 ... If ... even, then add 28 to it & then divide by 2"; "influence of this Dosha prevails only during daytime" (K.P.)' }),
    RANGACHARYA: Object.freeze({ ...RANGACHARYA_I, pageLocus: 'printed pp.58-60 (PDF 66-68): "METHOD-1: Count from the star occupied by the sun to the star occupied by the Moon. Include the Abhijit in the count. If it is an odd number"; "METHOD-2": the yoga\'s star on top, "the remaining 26 nakshatras (exclude the Abhijit)"; Daivajnavilasam: the padas' }),
    KALAPRAKASIKA: Object.freeze({ ...KALAPRAKASIKA, pageLocus: 'printed pp.169-170 and 192 (PDF 199-200, 222): "Vishkambam, Vyatheepatham, Soolam, Parigham, Gandam, Athigandam, Vajram, Vyaghatham, Vaidhrithi which are respectively governed by ... Aswini, Aslesha, Mrigasirsha, Magha, Mula, Anuradha, Pushya, Punarvasu and Chithra"; "This \'bad\' Yoga does not touch the following asterisms:- Aswini, Mrigasirsha, Punarvasu, Pushya, Sravishta, Chithra, Hastha and Revathi"; "powerful only during the day-time"' }),
    WILHELM: Object.freeze({ ...WILHELM_E, pageLocus: 'printed p.141 (PDF 149): "From the Nakshatra corresponding to the Yoga that is running, note the Nakshatras that are the same distance in both the forward and reverse directions. If the Sun is in one of these Nakshatras and the Moon in the other, Ekargala is present"; "Ekargala only prevails during the day"; the eight exempt stars; "if the Yoga prevailing is Vishkambha, the corresponding Nakshatra is Pushya"; the Table of Yogas, printed p.72 (PDF 80)' }),
    MUHURTA_CHINTAMANI: Object.freeze({ ...MC_SHARMA, pageLocus: 'sloka 62, printed pp.198-199 (PDF 202-203): "the Moon is situated in the odd numbered Nakshtra from the Nakshtra of the Sun ... There is the counting in it of all Nakshtras including the Abhijita Nakshtra"; "According to the view of Narada the Abhijita Nakshtra is not counted in it"' }),
    JOSHI: Object.freeze({ ...JOSHI_KK, pageLocus: 'printed p.71 (PDF 86): "Moon\'s nakshatra is in odd positions (1/3/5/7 etc.) from Sun\'s nakshatra it is called Ekargala dosha. The counting is to be done including Abhijit"' }),
    AGARWAL: Object.freeze({ ...AGARWAL_GS, pageLocus: 'printed p.317 (PDF 316): "the count from Sun\'s nakshatra to that of Moon is odd. (In this count Abhijit nakshatra is to be included)"' }),
    RAMAN: Object.freeze({ ...RAMAN_BV, pageLocus: 'Chapter V, PDF p.12: "Ekargala Dosha. - This dosha is powerful only during the daytime ... We need not go into details as it is not of much significance"' }),
    VASHISTHA: Object.freeze({ ...VASHISTHA_KUSUM, pageLocus: 'printed pp.109-110 (PDF 96-97): "Kharjoor: The bad yogas like Vishakumbha, Atiganda, Shoolaganda, Vyaghata, Vajra, Vyatipata, Parigh, Vaidhriti"' }),
  },
  UPAGRAHA: {
    SHRIDHAR: Object.freeze({ ...SHRIDHAR_HEA, pageLocus: '§8.14 "Upgraha Dosha", printed pp.201-202 (PDF 245-246): "If the Moon is in 5th, 7th, 8th, 10th, 14th, 15th, 18th, 19th, 21st, 22nd, 23rd, 24th & 25th constellation from the constellation occupied by the Sun"; "According to M.P. ... 5th, 8th, 14th, 18th, 19th, 22nd, 23rd & 24th ... As per M.P. & M.G. both the luminaries should be in the same quarter of the constellation"' }),
    MUHURTA_CHINTAMANI: Object.freeze({ ...MC_SHARMA, pageLocus: 'sloka 63, printed p.199 (PDF 203): "शराष्टदिक्छक्रनगातिधृत्यस्तिथिर्धृतिश्च प्रकृतेश्च पञ्च । उपग्रहाः सूर्यभतोऽब्जतारा" — 5, 8, 10, 14, 7, 19, 15, 18 and the five from 21; sloka 64: "पातोपग्रहलत्तासु नेष्टोऽङ्घ्रिः खेटपत्समः"' }),
    RANGACHARYA: Object.freeze({ ...RANGACHARYA_I, pageLocus: 'printed pp.63-65 (PDF 71-73): "From the nakshatra occupied by the sun, the 5th, 7th, 8th, 10th, 14th, 15th, 18th, 19th, 21st, 22nd, 23rd, 24th, 25th nakshatras of the Moon are upagraha-blemished"; "The patha, upagraha and Latta need not be considered evil if the nakshatra padas differ in each"' }),
    WILHELM: Object.freeze({ ...WILHELM_E, pageLocus: 'printed pp.265-266 (PDF 273-274): "The Moon should not be in the 5th, 7th, 8th, 10th, 14th, 15th, 18th, 19th, 21st, 22nd, 23rd, 24th or 25th Nakshatra from that of the Sun. Upagraha Dosha is only significantly effective when the Moon is in the same Nakshatra Pada as is the Sun"' }),
    AGARWAL: Object.freeze({ ...AGARWAL_GS, pageLocus: 'printed p.317 (PDF 316): "Upgraha dosha: occurs when vivaah nakshatra as counted from that of Sun is 5, 7, 8, 10, 14, 15, 18, 19, 21, 22, 23, 24 or 25th"' }),
    JOSHI: Object.freeze({ ...JOSHI_KK, pageLocus: 'printed p.71 (PDF 86): "Count from Sun\'s nakshatra to Moon\'s nakshatra including Abhijit. If Moon\'s nakashatra is 5th, 7th, 8th, 10th, 14th 15th, 18th, 19th, 21st, 22nd, 23rd, 24th and 25th"' }),
    VASHISTHA: Object.freeze({ ...VASHISTHA_KUSUM, pageLocus: 'printed p.110 (PDF 97): "Counting the Moon nakshatra from the Sun\'s nakshatra, if the number is 5, 7, 8, 10, 14, 15, 18, 19, 21, 22, 23, 24, and 25, it is called upagriha dosha"' }),
  },
  KRANTI: {
    SHRIDHAR: Object.freeze({ ...SHRIDHAR_HEA, pageLocus: '§8.3 "Kranti-Samya Dosha", printed pp.178-179 (PDF 222-223): "If the Sun & the Moon are in pairs of signs viz., Aries-Leo, Taurus - Capricorn, Libra - Aquarius, Virgo - Pisces, Cancer - Scoipio, & Gemini - Sagittarius"; "According to M.G. if difference between the longitudes of the Sun & the Moon is within 33 minutes, the Dosha is especially malefic"; "It is commended by some that this Dosha should be considered when the planets are in the same stellar quarter"' }),
    MUHURTA_CHINTAMANI: Object.freeze({ ...MC_SHARMA, pageLocus: 'sloka 61, printed p.198 (PDF 202): "पञ्चास्याजौ गोमृगौ तौलिकुम्भौ कन्यामीनौ कर्क्यली चापयुग्मे । तत्रान्योन्यं चन्द्रभान्वोर्निरुक्तं क्रान्तेः साम्यं नो शुभं मंगलेषु"' }),
    JOSHI: Object.freeze({ ...JOSHI_KK, pageLocus: 'printed pp.71-72 (PDF 86-87): "(a) Leo - Aries (b) Taurus - Capricorn (c) virgo - Pisces (d) Cancer - Scorpio and (e) Saggitarius Gemini. If Sun is placed in one sign and Moon in another sign of the same pair"; the Kranti Samya Chakra' }),
    RANGACHARYA: Object.freeze({ ...RANGACHARYA_I, pageLocus: '"Mahapatha", printed pp.62-63 (PDF 70-71): "The Mahapatha is based on the kranthi samya"; Vaidhriti and Vyatipata Mahapatha by the totals of the signs' }),
    AGARWAL: Object.freeze({ ...AGARWAL_GS, pageLocus: 'printed p.317 (PDF 316): "Kranti samya dosha: This dosha occurs if Sun and Moon on vivaah day occupy rasi positions as 1/5 or 2/10 or 9/3 or 4/8 or 6/12 or 7/11"' }),
    VASHISTHA: Object.freeze({ ...VASHISTHA_KUSUM, pageLocus: 'printed p.110 (PDF 97): "Kranti samya: Sun and Moon are on the same kranti"' }),
  },
  DAGDHA: {
    SHRIDHAR: Object.freeze({ ...SHRIDHAR_HEA, pageLocus: '§2.15 "Dagdha Tithis", printed pp.37-38 (PDF 83-84): "When the Sun transits Pisces or Sagittarius and 2nd Tithi of either B.H. & D.H. is concurrent, then the 2nd Tithi is called as Dagdha"; Table 2.6; "According to Jyotistattwa B.H. Tithis are Daghda when the Sun transits odd signs; while D.H. Tithis are Daghda when the Sun transits even signs ... However J.V. has not made such a difference"' }),
    MUHURTA_CHINTAMANI: Object.freeze({ ...MC_SHARMA, pageLocus: 'sloka 66, printed p.201 (PDF 205): "चापान्त्यगे गोघटके पतंगे कर्कजगे स्त्रीमिथुने स्थिते च । सिंहालिगे नक्रघटे समाः स्युस्तिथ्यो द्वितीयाप्रमुखाश्च दग्धाः"; the note: "it is only in Madhya Pradesh region that these Tithis are regarded as defective"' }),
    RANGACHARYA: Object.freeze({ ...RANGACHARYA_I, pageLocus: 'printed p.64 (PDF 72): the six pairs; "The above-mentioned tithis pertain to the Sukla-paksha, for the odd signs ... and to the Krishnapaksha for the even signs"' }),
    JOSHI: Object.freeze({ ...JOSHI_KK, pageLocus: 'printed p.72 (PDF 87): "(a) 2nd tithi when Sun is in Dhanu or Meena ... (f) 12th tithi when Sun is in Makara or Tula"' }),
    WILHELM: Object.freeze({ ...WILHELM_E, pageLocus: 'printed p.260 (PDF 268): "When the Sun is in Sagittarius or Pisces the 2nd Tithi is unfavorable ... and when in Libra or Capricorn, the 12th Tithi is the unfavorable Dagdha \'burnt\' Tithi"' }),
    VASHISTHA: Object.freeze({ ...VASHISTHA_KUSUM, pageLocus: 'printed p.111 (PDF 98): the table — Mesha 6 Shukla, Vrisha 4 Krishna, Mithuna 8 Shukla ... Meena 2 Krishna' }),
    AGARWAL: Object.freeze({ ...AGARWAL_GS, pageLocus: 'printed p.317 (PDF 316): "If Sun at the time of marriage is in signs 9,12; 2, 11; 1,4; 3, 6; 5, 8; 7, 10: and tithi is 2, 4, 6, 8, 10, 12 respectively, tithi gets burnt"' }),
  },
  RULE: {
    JOSHI: Object.freeze({ ...JOSHI_KK, pageLocus: 'printed pp.72, 74 (PDF 87, 89): "Yuti, Vedha by malefics, Mrityu Panchaka, Kranti-Samya and Dagdha tithis are Considered more Malefic than the other\'s"; "Even out of ten important doshas all can\'t be avoided and marriages are permitted when six or more out of ten doshas are avoided"' }),
    AGARWAL: Object.freeze({ ...AGARWAL_GS, pageLocus: 'printed p.316 (PDF 315): "Out of these five doshas should invariably be avoided. Dosha no. 3, 4, 6, 8, and 10 are serious and must be avoided. 6 rekhas are passable and best is 10 rekhas"' }),
    SHRIDHAR: Object.freeze({ ...SHRIDHAR_HEA, pageLocus: 'printed p.478 (PDF 517): "Five Doshas in Marriage : Yuti, Vedha, Baana (Mrityu), Kranti Samya & Dhagdha Tithi, are the five Doshas, which are prohibited at all the places"' }),
    VASHISTHA: Object.freeze({ ...VASHISTHA_KUSUM, pageLocus: 'printed p.111 (PDF 98): "Minium 5 doshas should be rejected. 3, 4, 6, 8, and 10 must be left out. The best thing is to avoid all the ten doshas. If very necessary, 6 doshas can be compromised with"' }),
  },
});

/** What the books say lifts each evil — shown, not applied (as with Chandrashtama). */
const NOTES_TA = deepFreeze({
  PAATA: ['பாதம், உபக்கிரகம், லத்தை — கிரகத்தின் பாத எண் உள்ள பாதம் மட்டும் தீயது (முகூர்த்த சிந்தாமணி ஸ்லோ.64); ரங்காச்சார்யா: பாதங்கள் வேறானால் தீமை இல்லை.', 'பலமுள்ள சூரியனோ சந்திரனோ லக்னத்தில் இருந்தால் ஏகார்கலம், உபக்கிரகம், பாதம், லத்தை, ஜாமித்ரம், கர்த்தரி அழியும் (முகூர்த்த சிந்தாமணி ஸ்லோ.68) — லக்னம் தேவை; கணிக்கப்படவில்லை.'],
  YUTI: ['சந்திரன் சொந்த ராசி (கடகம்), உச்சம் (ரிஷபம்), நட்பு ராசியில் (சிம்மம், மிதுனம், கன்னி — BPHS இயற்கை நட்பு, எங்கள் வாசிப்பு) இருந்தால் யுதி இல்லை (முகூர்த்த சிந்தாமணி உரை, அகர்வால், ஜோஷி, ரங்காச்சார்யா, ஸ்ரீதர்) — காட்டப்படுகிறது, தீர்ப்பில் சேர்க்கப்படவில்லை.', 'வசிஷ்டா: பௌர்ணமிச் சந்திரன், அல்லது குருவின் பார்வை; ரங்காச்சார்யா, ஸ்ரீதர்: கேந்திரத்தில் சொந்த வர்க்கக் குருவின் பார்வை.', 'கிரகத்தோடு சேர்ந்தால் பலன் (நூல்களின் கூற்று): சூரியன் வறுமை, செவ்வாய் மரணம், புதன் சுபம் / குழந்தையின்மை, குரு சுகம் / துரதிர்ஷ்டம், சுக்கிரன் சக்களத்தி, சனி துறவு, ராகு சண்டை, கேது துயரம்.'],
  VEDHA: ['வேதை இருந்தாலும் தீமை குறையும்: லக்னத்தில் சுப கிரகம்; லக்னாதிபதி 11-ல் சுபர் சேர்க்கை/பார்வையுடன்; சுப கிரகத்தின் ஹோரை; பலமுள்ள சந்திரன் (முகூர்த்த சிந்தாமணி, ஸ்ரீதர், ஜோஷி) — லக்னம், ஹோரை தேவை; கணிக்கப்படவில்லை.', 'அபிஜித்: உத்திராடம் 4-ஆம் பாதம் + திருவோணத்தின் முதல் 1/15 (276°40′–280°53′20″). அதில் உள்ள கிரகம் ரோகிணிக்கும், தன் சொந்த நட்சத்திரத்தின் எதிர் நட்சத்திரத்துக்கும் வேதை — முகூர்த்த சிந்தாமணியின் சொந்த எடுத்துக்காட்டில் உத்திராடம் 4-ஆம் பாதக் கிரகம் மிருகசீரிடத்தைத் தாக்குகிறது (எங்கள் வாசிப்பு: இரண்டும்). அபிஜித் வழி வேதைக்குப் பாத விதி இல்லை, முழுவதும் (எங்கள் வாசிப்பு). எண்ணும் விதிகளில் (ஏகார்கலம், உபக்கிரகம்) அபிஜித் தனி நட்சத்திரம்.', 'வராகமிகிரர்: வேதை விந்திய மலைப் பகுதியில் மட்டும் (முகூர்த்த சிந்தாமணி); ஸ்ரீதர்: நாடு முழுவதும் (முகூர்த்த மார்த்தாண்டம்).'],
  JAMITRA: ['லக்னத்திலிருந்து: ஒவ்வொரு நேரத்துக்கும் 7-ல் கிரகம் உள்ள லக்னங்கள் (ராசி), 55-வது நவாம்சம் வாசிப்பில் தவிர்க்க வேண்டிய லக்ன நவாம்சங்கள் — காட்டப்படுகின்றன; லக்னம் தேர்வைப் பொறுத்தது, தீர்ப்பில் சேர்க்கப்படவில்லை.', 'நீக்கம் (காட்டப்படுகிறது): 7-ல் உள்ள கிரகத்தைச் சுபர் பார்த்தால்; சந்திரன் உச்சம், சொந்த, நட்பு ராசியில்; லக்னத்துக்கு 3, 6, 11-ல் சூரியன் (மார்த்தாண்ட வல்லபர்); 7-ல் உச்சக் குரு அல்லது சந்திரன்.'],
  BANA: ['மிருத்யு பாணம் — திருமணம்; ரோக — உபநயனம்; அக்னி — வீடு; ராஜ — அரசுப் பணி; சோர — பயணம் (முகூர்த்த சிந்தாமணி, ஸ்ரீதர், ஜோஷி). வில்ஹெல்ம்: திருமணத்துக்கு ரோகமும் மிருத்யுவும்; "மிகக் கடுமையானவை அல்ல".', 'நேரம், கிழமை: மிருத்யு சந்தியா காலங்களில், புதன்கிழமை; ரோக, சோர இரவில்; அக்னி, ராஜ பகலில் (முகூர்த்த சிந்தாமணி ஸ்லோ.74).', 'சசல்ய பாணம்: ஐந்து மீதிகளின் கூட்டுத்தொகையை 9-ஆல் வகுத்த மீதி 5 (முகூர்த்த சிந்தாமணி, வில்ஹெல்ம்); ஸ்ரீதர்: இது அக்னி பாணமே (2, 11, 20, 29-ஆம் பாகை).'],
  EKARGALA: ['ஏகார்கலம் பகலில் மட்டும் (காலப்பிரகாசிகை, வில்ஹெல்ம், ராமன், ஸ்ரீதர் — காலப்பிரகாசிகை வழியாக); கல்யாணராமன்: இரவில் குறிப்பாக — காட்டப்படுகிறது; இந்த இடத்துக்குச் சூரிய உதயம் கணிக்கப்படாததால் தீர்ப்பில் சேர்க்கப்படவில்லை.', 'காலப்பிரகாசிகை, வில்ஹெல்ம்: சந்திரன் அசுவினி, மிருகசீரிடம், புனர்பூசம், பூசம், அஸ்தம், சித்திரை, அவிட்டம், ரேவதியில் இருந்தால் ஏகார்கலம் இல்லை — வில்ஹெல்மின் வாசிப்பில் சேர்க்கப்படுகிறது; மற்றவற்றில் காட்டப்படுகிறது.', 'தைவஜ்ஞ விலாசம் (ரங்காச்சார்யா வழியாக): சூரியன், சந்திரன் பாதங்கள் ஒன்றானால் அல்லது 1-4, 2-3 ஆனால் மட்டும் தீயது; ஸ்ரீதர்: "ஒரே பாதத்தில்" என்று சிலர்.', 'முகூர்த்த சிந்தாமணி உரை: சூரியனும் சந்திரனும் ஒரே நட்சத்திரத்தில் இருந்தால் கர்ஜூர தோஷம் இல்லை; ஜோஷி "1/3/5/7" என 1-ஐயும் சேர்க்கிறார் — இங்கே ஒற்றைப்படை வாசிப்பில் 1-ம் சேர்க்கப்படுகிறது.'],
  UPAGRAHA: ['உபக்கிரகம் குருக்ஷேத்திரம், வாஹ்லிகம் (காஷ்மீருக்கு மேற்கு) பகுதிகளில் (முகூர்த்த சிந்தாமணி); கர்க்கர்: சூரியனும் சந்திரனும் ஒரே பாகையில் இருந்தால் மட்டும் (ஸ்ரீதர் வழியாக).'],
  KRANTI: ['இது நட்சத்திரம் அல்லாமல் ராசியைப் பொறுத்தது — ஜோடிகள் அசையும் ராசிக்கு அடுத்த திரிகோணம் (மேஷம்-சிம்மம் …), உபய ராசிகளுக்கு எதிர் ராசி (ஸ்ரீதர்).', 'முகூர்த்த கணபதி: இரு கிரகங்களும் 33 கலைக்குள் — மிகத் தீயது; ஜ்யோதிர்வித்யாபரணம்: ஒரு பாகைக்கு மேல் வேறுபட்டால் நன்மை; சிலர்: ஒரே பாதத்தில் மட்டும் (ஸ்ரீதர்) — "வேறுபாடு" எதற்கு என்று தெளிவில்லை; கணிக்கப்படவில்லை.', 'ஜோஷி ஐந்து ஜோடிகளையே பெயரிடுகிறார் (துலாம்-கும்பம் இல்லை); மற்ற நூல்கள் ஆறு.'],
  DAGDHA: ['தக்த திதி மத்தியப் பிரதேசத்தில் மட்டும் (முகூர்த்த சிந்தாமணி, ரங்காச்சார்யா). இங்கே அந்த நேரத்தில் நடக்கும் திதி (சூரிய உதயத் திதி அல்ல — எங்கள் வாசிப்பு).'],
});

module.exports = {
  DOSHAS, SERIOUS, NAME_TA, MALEFICS, BENEFICS, ABHIJIT, ABHIJIT_SOURCE,
  PANCHA, SAPTA, EVIL_YOGAS, MURDHA, YOGA_TA, WILHELM_YOGA_STAR, EKARGALA_EXEMPT,
  PAATA_YOGAS, NARADA_TARGETS, UPAGRAHA_13, UPAGRAHA_MP, KRANTI_PAIRS, DAGDHA_TITHI,
  BANAS, BANA_ADD, BANA_TITHI_LAGNA, BANA_TA,
  READINGS, RULES, RANK, SOURCES, NOTES_TA,
};
