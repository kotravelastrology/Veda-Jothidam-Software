/**
 * Each event's own muhurta rules, book by book (added 2026-10-11). First event:
 * entering a newly built house (griha pravesha) in nine books, ordered by
 * their words on it; the default is the most explaining book's.
 *
 * Indices: stars 0 = Ashwini … 26 = Revati; tithis 1-30 (Shukla 1-15, Krishna
 * 16-30, 30 = Amavasya); weekdays 0 = Sunday; lunar months 0 = Chaitra …
 * 11 = Phalguna (amanta: from new moon to new moon, named by the Sun's sign at
 * the new moon); signs 0 = Aries; houses 1-12 from the lagna.
 */

const { BOOKS: { SHRIDHAR_HEA, MC_SHARMA, KALYANRAMAN_V2, JOSHI_KK, VASHISTHA_KUSUM, RANGACHARYA_I, AGARWAL_GS, WILHELM_E, RAMAN_BV } } = require('./muhurtaStarTables');

const deepFreeze = (o) => {
  Object.values(o).forEach((v) => { if (v && typeof v === 'object' && !Object.isFrozen(v)) deepFreeze(v); });
  return Object.freeze(o);
};
const range = (a, b) => [...Array(b - a + 1).keys()].map((i) => a + i);
/** A tithi number within its paksha applied to both pakshas; 15 is the full Moon only. */
const bothPakshas = (ns) => [...new Set(ns.flatMap((n) => (n === 15 ? [15] : [n, n + 15])))].sort((a, b) => a - b);

const DHRUVA = Object.freeze([3, 11, 20, 25]); // Rohini and the three Uttaras
const MRIDU = Object.freeze([4, 13, 16, 26]); // Mrigashira, Chitra, Anuradha, Revati
const FIXED = Object.freeze([1, 4, 7, 10]);
const DUAL = Object.freeze([2, 5, 8, 11]);
const ALL_TITHIS = range(1, 30);
const RIKTA = Object.freeze([4, 9, 14, 19, 24, 29]);
const KUMBHA_MC = Object.freeze([...range(6, 13), ...range(22, 27)]);

/** The door's direction: its tithi class, the Sun "on the left" (houses from the lagna), the stars facing it. */
const DOORS = deepFreeze({
  order: ['E', 'S', 'W', 'N'],
  ta: { E: 'கிழக்கு', S: 'தெற்கு', W: 'மேற்கு', N: 'வடக்கு' },
  tithi: { E: [5, 10, 15], S: [1, 6, 11], W: [2, 7, 12], N: [3, 8, 13] },
  sun: { E: [8, 9, 10, 11, 12], S: [5, 6, 7, 8, 9], W: [2, 3, 4, 5, 6], N: [11, 12, 1, 2, 3] },
  stars: { E: range(2, 8), S: range(9, 15), W: range(16, 21), N: [22, 23, 24, 25, 26, 0, 1] },
});

/** The lunar months (amanta) — not the Tamil solar months, which run by the Sun's sign. */
const MONTH_TA = Object.freeze(['சைத்ர', 'வைசாக', 'ஜ்யேஷ்ட', 'ஆஷாட', 'ஸ்ராவண', 'பாத்ரபத', 'ஆஸ்வின', 'கார்த்திக', 'மார்கசீர்ஷ', 'பௌஷ', 'மாக', 'பால்குன']);

/**
 * A reading: masa { good, mid, strict }, uttarayana 'REQUIRED' | 'PREFERRED',
 * nak { good, mid }, digdwar (door-facing stars are good too), tithi (good
 * tithis), tithiDoor, vara { good, mid }, lagna { good, mid, alt (an upachaya
 * from birth also passes: from 'MOON' | 'EITHER', houses, notMovable),
 * movable ('NAV_TAURUS' | 'BENEFIC_NAV_AND_UPACHAYA') }, nav 'BENEFIC',
 * empty (houses with no planet), emptyPref, beneficIn / maleficIn (where every
 * benefic — Mercury, Jupiter, Venus — and every malefic — the Sun, Mars,
 * Saturn — must be), beneficKendra, moonNot, jupVenNotSet, kumbha (good counts
 * from the Sun's star), sunLeft.
 */
const GRIHA_PRAVESHA = deepFreeze({
  labelTa: 'கிரகப்பிரவேசம் (புது வீடு)',
  default: 'SHRIDHAR',
  order: ['SHRIDHAR', 'MUHURTA_CHINTAMANI', 'WILHELM', 'RAMAN', 'JOSHI', 'KALYANRAMAN', 'RANGACHARYA', 'VASHISTHA', 'AGARWAL'],
  SHRIDHAR: {
    labelTa: 'ஸ்ரீதர் §27.16', booksTa: 'ஸ்ரீதர் (நாரதர், மு.சி., பி.ச., K.P. மேற்கோள்கள்)',
    masa: { good: [10, 11, 2, 1], mid: [8, 7], strict: true }, uttarayana: 'PREFERRED',
    nak: { good: [...DHRUVA, ...MRIDU, 22, 23], mid: [] }, digdwar: true,
    tithi: [16, 2, 3, 5, 10, 13, 15], tithiDoor: true,
    vara: { good: [3, 4, 5], mid: [6, 1] },
    lagna: { good: FIXED, mid: DUAL, movable: 'NAV_TAURUS' },
    empty: [4, 8], beneficIn: [1, 4, 7, 10, 5, 9, 2, 3, 11], maleficIn: [3, 6, 11], moonNot: [1, 3, 6, 8, 12],
    jupVenNotSet: true, kumbha: KUMBHA_MC, sunLeft: true,
  },
  MUHURTA_CHINTAMANI: {
    labelTa: 'முகூர்த்த சிந்தாமணி அத்.13', booksTa: 'முகூர்த்த சிந்தாமணி ஸ்லோ.13/1-6',
    masa: { good: [2, 10, 11, 1], mid: [], strict: true }, uttarayana: 'REQUIRED',
    nak: { good: [...DHRUVA, ...MRIDU], mid: [] }, digdwar: true,
    tithi: ALL_TITHIS.filter((t) => !RIKTA.includes(t) && t !== 30), tithiDoor: true,
    vara: { good: [1, 3, 4, 5, 6], mid: [] },
    lagna: { good: FIXED, mid: [], alt: { from: 'EITHER', houses: [3, 6, 10, 11], notMovable: true } },
    empty: [4, 8], beneficIn: [9, 5, 1, 4, 7, 10, 11, 2, 3], maleficIn: [3, 6, 11],
    jupVenNotSet: true, kumbha: KUMBHA_MC, sunLeft: true,
  },
  WILHELM: {
    labelTa: 'வில்ஹெல்ம்', booksTa: 'வில்ஹெல்ம் (காலப்பிரகாசிகை, மு.சி. மேற்கோள்கள்)',
    masa: { good: [1, 2, 10, 11], mid: [7, 8], strict: true }, uttarayana: 'PREFERRED',
    nak: { good: [3, 4, 11, 16, 20, 25, 26], mid: [6, 7, 12, 21, 23, 13] }, digdwar: false,
    tithi: [16, 2, 3, 5, 7, 10, 17, 18, 20, 22, 25, 11, 13], tithiDoor: true,
    vara: { good: [1, 3, 4, 5], mid: [6] },
    lagna: { good: FIXED, mid: DUAL, movable: 'NAV_TAURUS' }, nav: 'BENEFIC',
    empty: [8], emptyPref: [4], beneficIn: [1, 4, 7, 10, 5, 9, 2, 3, 11], maleficIn: [3, 6, 11],
    jupVenNotSet: true, kumbha: KUMBHA_MC, sunLeft: true,
  },
  RAMAN: {
    labelTa: 'ராமன்', booksTa: 'ராமன்',
    masa: { good: [1, 2, 10, 11], mid: [7, 8], strict: true }, uttarayana: 'REQUIRED',
    nak: { good: [3, 4, 20, 13, 25], mid: [16, 26] }, digdwar: false,
    tithi: [16, 2, 3, 5, 7, 10, 11, 13],
    vara: { good: [1, 3, 4, 5], mid: [6] },
    lagna: { good: FIXED, mid: DUAL, movable: 'NAV_TAURUS' },
    empty: [8], maleficIn: [3, 6, 10, 11], beneficKendra: true,
    jupVenNotSet: true,
  },
  JOSHI: {
    labelTa: 'ஜோஷி', booksTa: 'ஜோஷி',
    masa: { good: [10, 11, 1, 2], mid: [], strict: true }, uttarayana: 'REQUIRED',
    nak: { good: [...DHRUVA, ...MRIDU], mid: [] }, digdwar: true,
    tithi: bothPakshas([2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15]), tithiDoor: true,
    vara: { good: [1, 3, 4, 5, 6], mid: [] },
    lagna: { good: [...FIXED, ...DUAL], mid: [], alt: { from: 'EITHER', houses: [3, 6, 10, 11] } },
    empty: [4, 8], beneficIn: [1, 7, 10, 5, 9, 2, 3, 11], maleficIn: [3, 6, 11],
    jupVenNotSet: true, kumbha: KUMBHA_MC, sunLeft: true,
  },
  KALYANRAMAN: {
    labelTa: 'கல்யாணராமன்', booksTa: 'கல்யாணராமன் (தொ.2)',
    masa: { good: [10, 11, 1, 2], mid: [], strict: false }, uttarayana: 'PREFERRED',
    nak: { good: [3, 4, 11, 13, 16, 20, 25, 26], mid: [] }, digdwar: true,
    tithi: bothPakshas([2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15]), tithiDoor: true,
    vara: { good: [1, 3, 4, 5, 6], mid: [] },
    lagna: { good: [...FIXED, ...DUAL], mid: [], alt: { from: 'MOON', houses: [3, 6, 10, 11] } },
    empty: [4, 8], beneficIn: [1, 7, 10, 5, 9, 2, 3, 11],
    jupVenNotSet: true, kumbha: KUMBHA_MC, sunLeft: true,
  },
  RANGACHARYA: {
    labelTa: 'ரங்காச்சார்யா அத்.VII', booksTa: 'ரங்காச்சார்யா',
    masa: { good: [10, 11, 1, 2], mid: [8, 7], strict: true },
    nak: { good: [13, 16, 22, 11, 20, 25, 26, 23, 3, 4], mid: [] }, digdwar: false,
    tithi: ALL_TITHIS.filter((t) => !RIKTA.includes(t)), tithiDoor: true,
    lagna: { good: [5, 10, 1, 4, 7, 2], mid: [], movable: 'BENEFIC_NAV_AND_UPACHAYA' },
    empty: [4, 8, 12], beneficIn: [1, 4, 7, 10, 5, 9, 2, 3, 11], maleficIn: [3, 6, 11],
    kumbha: [...range(5, 12), ...range(21, 26)], sunLeft: true,
  },
  VASHISTHA: {
    labelTa: 'வசிஷ்டா', booksTa: 'வசிஷ்டா',
    masa: { good: [1, 2, 10, 11], mid: [7, 8], strict: true }, uttarayana: 'REQUIRED',
    nak: { good: [8, 3, 4, 6, 7, 11, 20, 25, 12, 13, 14, 16, 21, 22, 23, 26], mid: [] }, digdwar: false,
    tithi: [16, 2, 3, 5, 7, 10, 11, 13],
    vara: { good: [1, 3, 4, 5, 6], mid: [] },
    lagna: { good: [1, 2, 4, 5, 7, 10, 11], mid: [], alt: { from: 'MOON', houses: [3, 6, 11] } },
    empty: [4, 8], beneficIn: [1, 2, 5, 7, 9, 10, 11], maleficIn: [3, 6, 11], moonNot: [1, 6, 8, 12],
    jupVenNotSet: true,
  },
  AGARWAL: {
    labelTa: 'அகர்வால்', booksTa: 'அகர்வால்',
    masa: { good: [10, 11, 2, 1], mid: [], strict: true },
    nak: { good: [3, 4, 13, 16, 26, 11, 20, 25], mid: [] }, digdwar: false,
    tithi: bothPakshas([2, 3, 5, 6, 7, 10, 11, 13]),
    vara: { good: [1, 3, 4, 5], mid: [] },
    lagna: { good: FIXED, mid: DUAL },
    empty: [4, 8], beneficIn: [1, 4, 7, 10, 5, 9], maleficIn: [3, 6, 11], moonNot: [6, 8, 12],
  },
});

// ---------------------------------------------------------------------------
// Upanayana (added 2026-10-12)
// ---------------------------------------------------------------------------

/** The sixteen stars most books name: Ashwini, Rohini, Mrigashira, Punarvasu, Pushya, the Uttaras, Hasta, Chitra, Swati, Anuradha, Shravana, Dhanishta, Shatabhisha, Revati. */
const SIXTEEN = Object.freeze([0, 3, 4, 6, 7, 11, 12, 13, 14, 16, 20, 21, 22, 23, 25, 26]);
const SHRAVANA_GROUP = Object.freeze([21, 22, 23]); // "some consider Shravana, Dhanishta and Shatabhisha middling"
/** Anadhyaya (MC V.54): the 1st, 8th and 14th of both halves, the full and the new Moon … */
const ANADHYAYA = Object.freeze([1, 8, 14, 15, 16, 23, 29, 30]);
/** … and Ashadha Shukla 10, Jyeshtha Shukla 2, Pausha Shukla 11, Magha Shukla 12 ([month, tithi]). */
const ANADHYAYA_MONTH = deepFreeze([[3, 10], [2, 2], [9, 11], [10, 12]]);
/** Galagraha (Wilhelm; Kalyanraman's note): Krishna 4, 7, 8, 9, 13, 14, Amavasya and Shukla 1. */
const GALAGRAHA = Object.freeze([19, 22, 23, 24, 28, 29, 30, 1]);
/** Shridhar §17.9.9's yogas (0 = Vishkumbha): Vishkumbha, Atiganda, Shoola, Ganda, Vyaghata, Vajra, Vyatipata, Parigha, Vaidhriti. */
const YOGAS_SHRIDHAR = Object.freeze([0, 5, 8, 9, 12, 14, 16, 18, 26]);
const UTTARAYANA_SIGNS = Object.freeze([9, 10, 11, 0, 1, 2]);
/** The navamsas of Mercury, Jupiter and Venus. */
const BENEFIC_PLANET_NAVS = Object.freeze([1, 2, 5, 6, 8, 11]);
const M5 = Object.freeze(['Sun', 'Mars', 'Saturn', 'Rahu', 'Ketu']);
/** The conjunctions MC V.52 names for Jupiter, Venus and the Moon: the Sun, Mars, Saturn (Agarwal's list too). */
const MALEFICS_MC = Object.freeze(['Sun', 'Mars', 'Saturn']);
const BEN3 = Object.freeze(['Mercury', 'Jupiter', 'Venus']);
const KENDRAS = Object.freeze([1, 4, 7, 10]);
/** Jupiter debilitated (Capricorn) or in Mercury's and Venus's signs, his enemies' (MC: "10/3/6/2/7"). */
const JUPITER_BAD_SIGNS = Object.freeze([9, 1, 2, 5, 6]);

/**
 * A reading's rules beyond the house-entry ones (eventMuhurta.js): sunSign { good, mid } (the solar
 * month), harishayana, tithiMid, anadhyaya { tithis, months, sankranti }, galagraha, taraNot / taraMid
 * (counts from the birth star), yogaNot, vishti, vedha ('PANCHA' | 'SAPTA'), bana (Mrityu bana by the
 * Sun's degree), guru / ravi / chandra (the transit from the birth Moon's sign, each book's
 * exceptions), moonNav, conj, natal8, moon8, jupStrong; per lagna stretch: wedCombust, monKrishna,
 * dayParts (1 = the day's first third, 2 = to noon, 3 = to two-thirds, 4 = the last third; night
 * rejects), pradosha, navGood / navMid, emptyBut, notIn [[planets, houses, 'MID'?]], moonLagna,
 * points, panchaka. `linesTa` describes the reading on the page.
 */
const UPANAYANA = deepFreeze({
  labelTa: 'உபநயனம்',
  default: 'KALYANRAMAN',
  order: ['KALYANRAMAN', 'SHRIDHAR', 'WILHELM', 'MUHURTA_CHINTAMANI', 'JOSHI', 'RANGACHARYA', 'RAMAN', 'AGARWAL', 'VASHISTHA'],
  KALYANRAMAN: {
    labelTa: 'கல்யாணராமன் (தொ.2) — பொதுக் கருத்து', booksTa: 'கல்யாணராமன் (முகூர்த்த சிந்தாமணி, காலவிதானம், காலப்பிரகாசிகை, மாதவீயம் … தொகுப்பு)',
    masa: { good: [0, 1, 2, 10, 11], mid: [], strict: true }, sunSign: { good: UTTARAYANA_SIGNS, mid: [] }, harishayana: true,
    nak: { good: SIXTEEN, mid: [] }, digdwar: false,
    tithi: [2, 3, 5, 10, 11, 12, 17, 18, 20], anadhyaya: { tithis: [], months: ANADHYAYA_MONTH, sankranti: true }, galagraha: true,
    vara: { good: [0, 1, 3, 4, 5], mid: [] }, wedCombust: true, dayParts: { good: [1], mid: [2, 3] },
    guru: { good: [2, 5, 7, 9, 11], mid: [1, 3, 6, 10], okSigns: [3, 8, 11], okNavs: [0, 7, 4], vargottama: true, badSigns: JUPITER_BAD_SIGNS, chaitra: 'ANY' },
    ravi: { good: [3, 6, 10, 11], mid: [1, 2, 5, 7, 9], okSigns: [0, 3, 4, 7, 8, 11], okNavs: [4], vargottama: true, after13: [4, 8, 12] },
    chandra: { good: [1, 2, 3, 5, 6, 7, 9, 10, 11], mid: [12] },
    emptyBut: { 8: ['Venus'] }, natal8: true, moon8: true,
    notIn: [[['Mars', 'Saturn'], [2, 12]], [['Sun', 'Mars', 'Rahu'], [9]], [['Jupiter'], [3]], [['Moon'], [1]]],
    moonLagna: 'CANCER_JUPITER', vedha: 'SAPTA',
    linesTa: [
      'மாதம் (சந்திர): சைத்ர, வைசாக, ஜ்யேஷ்ட, மாக, பால்குன · சூரியன் மகரம் முதல் மிதுனம் வரை · ஹரிசயனம் (ஆஷாட சுக்ல 11 – கார்த்திக சுக்ல 11) கூடாது',
      'நட்சத்திரம்: பதினாறு — அசுவினி, ரோகிணி, மிருகசீரிடம், புனர்பூசம், பூசம், உத்திரம், அஸ்தம், சித்திரை, சுவாதி, அனுஷம், உத்திராடம், திருவோணம், அவிட்டம், சதயம், உத்திரட்டாதி, ரேவதி (புனர்பூசம் அந்தணருக்கு இல்லை) · சப்த சலாகை வேதை கூடாது',
      'திதி: வளர் 2, 3, 5, 10, 11, 12; தேய் 2, 3, 5 · ஆஷாட சு.10, ஜ்யேஷ்ட சு.2, பௌஷ சு.11, மாக சு.12, சங்கிராந்தி, கலக்ரஹ திதிகள் கூடாது',
      'கிழமை: ஞாயிறு, திங்கள், புதன், வியாழன், வெள்ளி (புதன் அஸ்தங்கம் எனில் புதன்கிழமை இல்லை) · பகலின் முதல் மூன்றில் ஒன்று நல்லது, கடைசி மூன்றில் ஒன்று கூடாது',
      'குரு (ஜன்ம ராசியிலிருந்து): 2, 5, 7, 9, 11 நல்லது; 1, 3, 6, 10 நடுத்தரம் (சாந்தியுடன்); 4, 8, 12 கூடாது — கடகம், தனுசு, மீனத்தில் அல்லது வர்கோத்தமம் / மேஷ, விருச்சிக, சிம்ம நவாம்சத்தில் விலக்கு; நீசம் / பகை ராசியில் நல்ல இடமும் இல்லை; சைத்ர மாதம் எல்லாவற்றையும் நீக்கும்',
      'சூரியன்: 3, 6, 10, 11 நல்லது; 1, 2, 5, 7, 9 நடுத்தரம்; 4, 8, 12 கூடாது — உச்சம், சொந்தம், நட்பு ராசி, சொந்த நவாம்சம், வர்கோத்தமம் எனில் நல்லது; தீய இடத்தில் 13 நாள் கழிந்து அடுத்த ராசி நல்லதெனில் விலக்கு · சந்திரன்: 4, 8 கூடாது, 12 நடுத்தரம்',
      'லக்னம் (பொது, உருப்படி 13-14): 8-ல் சுக்கிரன் தவிர எதுவும் கூடாது · சூரியன், செவ்வாய், ராகு 9-ல் கூடாது · குரு 3-ல் கூடாது · செவ்வாய், சனி 2, 12-ல் கூடாது · சந்திரன் லக்னத்தில் கூடாது (கடக லக்னத்தில் சந்திரன் + குரு, பாவர் 3, 6, 11 எனில் விலக்கு) · ஜன்ம ராசிக்கும் முகூர்த்தச் சந்திரனுக்கும் 8-ல் சுக்கிரன் தவிர எதுவும் கூடாது',
      'அவர் "மற்றவர்கள்" என்று தரும் பட்டியல் (உருப்படி 8: குரு, சுக்கிரன், சந்திரன், லக்னாதிபதி 6, 8-ல்; சுக்கிரன், சந்திரன் 12-ல்; பாவர் 5, 8-ல்; சந்திரனின் சொந்த நவாம்சம்; புதன், குரு, சுக்கிரன், சந்திரன் பாவருடன்), "சிலர்" லக்னங்கள், ராமனின் தீய யோகங்கள் — அவரது பொதுக் கருத்தில் சேர்க்கப்படவில்லை; ஜோஷி, ராமன் வாசிப்புகளில் உள்ளன.',
    ],
  },
  SHRIDHAR: {
    labelTa: 'ஸ்ரீதர் §17.9', booksTa: 'ஸ்ரீதர் (நாரதர், K.P., M.C., J.V. மேற்கோள்கள்)',
    uttarayana: 'REQUIRED', sunSign: { good: [11, 0, 1, 2], mid: [9, 10] }, harishayana: true,
    nak: { good: SIXTEEN.filter((s) => !SHRAVANA_GROUP.includes(s)), mid: SHRAVANA_GROUP }, digdwar: false,
    taraNot: [10, 16, 18, 23, 25], taraMid: [5, 7, 19, 22, 27],
    tithi: [2, 3, 5, 7, 10, 11, 12], tithiMid: [6, 16, 17, 18, 20],
    anadhyaya: { tithis: ANADHYAYA, months: [...ANADHYAYA_MONTH, [6, 12], [6, 9]], sankranti: true }, galagraha: true,
    vara: { good: [3, 4, 5], mid: [0, 1] }, monKrishna: true, wedCombust: true,
    yogaNot: YOGAS_SHRIDHAR, vishti: true, vedha: 'PANCHA', bana: true, dayParts: { good: [1, 2], mid: [] }, pradosha: true,
    lagna: { good: [1, 2, 3, 4, 5, 6, 8, 11], mid: [] }, navGood: BENEFIC_PLANET_NAVS, empty: [8, 12],
    notIn: [[['Moon'], [1, 6, 8, 12]], [BEN3, [6, 8, 12]], [M5, [1, 8, 12]], [M5, KENDRAS]],
    maleficIn: [3, 6, 11], jupVenNotSet: true,
    guru: { good: [2, 5, 7, 9, 11], mid: [1, 3, 6, 10], vedha: { 2: 12, 5: 4, 11: 8, 7: 3, 9: 10 }, okSigns: [3, 8, 11], okSignNav: { signs: [0, 4, 7], navs: [8, 11] }, badSigns: JUPITER_BAD_SIGNS, chaitra: 'PISCES' },
    ravi: { good: [3, 6, 10, 11], mid: [1, 2, 5, 7, 9], vedha: { 3: 9, 6: 12, 10: 4, 11: 5 }, vedhaFree: ['Saturn'], okSigns: [0, 3, 4, 7, 8, 11], vargottama: true, after13: [1, 2, 4, 5, 7, 9] },
    linesTa: [
      'உத்தராயணம் வேண்டும்: சூரியன் மீனம், மேஷத்தில் சிறந்தது; மகரம், கும்பத்தில் நடுத்தரம் · ஹரிசயனம், சங்கிராந்தி கூடாது',
      'நட்சத்திரம்: பதினாறு (திருவோணம், அவிட்டம், சதயம் நடுத்தரம் — சிலர்) · ஜன்மத்திலிருந்து 10, 16, 18, 23, 25-வது கூடாது; 5, 7, 19, 22, 27 — சிலர் (குறிக்கப்படும்) · வேதை நட்சத்திரம் கூடாது',
      'திதி: வளர் 2, 3, 5, 7, 10, 11, 12; வளர் 6, தேய் 1, 2, 3, 5 நடுத்தரம் · அனத்யாய (1, 8, 14, பௌர்ணமி, அமாவாசை; நான்கு மாதத் திதிகள்; ஆஸ்வின சு.9, 12), கலக்ரஹ திதிகள் கூடாது (தேய் 1 அனத்யாயத்தால் விலகும்)',
      'கிழமை: புதன், வியாழன், வெள்ளி; ஞாயிறு, திங்கள் நடுத்தரம்; தேய்பிறைத் திங்கள், அஸ்தங்கப் புதன் கூடாது · யோகம்: விஷ்கம்பம், அதிகண்டம், சூலம், கண்டம், வியாகாதம், வஜ்ரம், வியதீபாதம், பரிகம், வைதிருதி கூடாது · விஷ்டி கரணம், மிருத்யு பாணம், பிரதோஷம் கூடாது · நண்பகலுக்குள்',
      'லக்னம்: ரிஷபம், மிதுனம், கடகம், சிம்மம், கன்னி, துலாம், தனுசு, மீனம் · சுபர் நவாம்சம் (கடகம் இல்லை) · 8, 12 காலி · சந்திரன் 1, 6, 8, 12-ல் கூடாது · சுபர் 6, 8, 12-ல் கூடாது · பாவர் (ராகு, கேது உட்பட) 1, 8, 12-ல், கேந்திரங்களில் கூடாது · குரு, சுக்கிரன் அஸ்தங்கம் கூடாது',
      'குரு: 2, 5, 7, 9, 11 (12, 4, 8, 3, 10-ல் கிரகம் இருந்தால் வேதை — நடுத்தரம்); 1, 3, 6, 10 பூஜையுடன்; 4, 8, 12 கூடாது — கடகம், தனுசு, மீனத்தில் எப்போதும் ஏற்கலாம்; மேஷம், சிம்மம், விருச்சிகத்தில் சொந்த நவாம்சத்துடன் ஏற்கலாம்; மகரம், ரிஷபம், மிதுனம், கன்னி, துலாமில் நல்ல இடமும் இல்லை; சைத்ரத்தில் சூரியன் மீனத்தில் எனில் விலக்கு',
      'சூரியன்: 3, 6, 10, 11 (9, 12, 4, 5-ல் சனி தவிர கிரகம் இருந்தால் வேதை); 1, 2, 5, 7, 9 பூஜையுடன்; 4, 8, 12 கூடாது — 1, 2, 4, 5, 7, 9-ல் 13 நாள் கழிந்து அடுத்த ராசி நல்லதெனில் விலக்கு; உச்சம், சொந்தம், நட்பு ராசி, வர்கோத்தமத்தில் எப்போதும் நல்லது',
    ],
  },
  WILHELM: {
    labelTa: 'வில்ஹெல்ம்', booksTa: 'வில்ஹெல்ம் (முகூர்த்த சிந்தாமணி, காலப்பிரகாசிகை மேற்கோள்கள்)',
    uttarayana: 'PREFERRED',
    nak: { good: SIXTEEN.filter((s) => !SHRAVANA_GROUP.includes(s)), mid: SHRAVANA_GROUP }, digdwar: false,
    taraNot: [1, 5, 7, 10, 16, 18, 19, 22, 23, 25, 27],
    tithi: [2, 3, 5, 10, 16, 17, 18], tithiMid: [6, 7, 11, 12, 13, 20],
    anadhyaya: { tithis: ANADHYAYA, months: ANADHYAYA_MONTH, sankranti: true }, galagraha: true, pradosha: true, vishti: true,
    vara: { good: [3, 4, 5], mid: [0, 1] }, wedCombust: true, monKrishna: true, dayParts: { good: [1, 2], mid: [] },
    lagna: { good: [1, 2, 3, 4, 5, 6, 8, 11], mid: [] }, navMid: BENEFIC_PLANET_NAVS, empty: [8],
    notIn: [[['Moon', 'Jupiter', 'Venus', 'LAGNA_LORD'], [6, 8]], [BEN3, [6, 8, 12]], [M5, [1, 5, 8]], [M5, KENDRAS], [['Moon'], [1]]],
    moonLagna: 'OWN_EXALTED', maleficIn: [3, 6, 11], jupVenNotSet: true,
    guru: { good: [2, 5, 7, 9, 11], mid: [1, 3, 6, 10], okSigns: [3, 8, 11], okNavs: [3, 8, 11], vargottama: true, badSigns: JUPITER_BAD_SIGNS, badNavs: JUPITER_BAD_SIGNS },
    linesTa: [
      'உத்தராயணம் விருப்பம் · ஜ்யேஷ்ட மாதம் மூத்தவருக்கு இல்லை (கணிக்கப்படவில்லை)',
      'நட்சத்திரம்: பதினாறு (திருவோணம், அவிட்டம், சதயம் நடுத்தரம் — சிலர்) · ஜன்மத்திலிருந்து 1, 5, 7, 10, 16, 18, 19, 22, 23, 25, 27-வது கூடாது',
      'திதி: வளர் 2, 3, 5, 10; தேய் 1, 2, 3 சிறந்தவை; வளர் 6, 7, 11, 12, 13, தேய் 5 நடுத்தரம் · 4, 8, 9, 14, 15 கூடாது · அனத்யாய, கலக்ரஹ, பிரதோஷம், விஷ்டி கரணம் கூடாது (அனத்யாயத்தின் "1" தேய் 1-ஐயும் விலக்குகிறது — எங்கள் வாசிப்பு)',
      'கிழமை: புதன், வியாழன், வெள்ளி; ஞாயிறு, திங்கள் நடுத்தரம்; அஸ்தங்கப் புதன், தேய்பிறைத் திங்கள் கூடாது · மதியம், இரவு, சந்தி கூடாது',
      'லக்னம்: ரிஷபம், மிதுனம், கடகம், சிம்மம், கன்னி, துலாம், தனுசு, மீனம் · நவாம்சம் — புதன், குரு, சுக்கிரனுடையது நல்லது (மற்றவை குறிக்கப்படும்) · 8 காலி · சந்திரன் லக்னத்தில் கூடாது (உச்சம் / சொந்த ராசி தவிர) · சந்திரன், குரு, சுக்கிரன், லக்னாதிபதி 6, 8-ல் கூடாது · சுபர் 6, 8, 12-ல் கூடாது · பாவர் 1, 5, 8-ல், கேந்திரங்களில் கூடாது · குரு, சுக்கிரன் அஸ்தங்கம் கூடாது',
      'குரு (ஜன்ம ராசியிலிருந்து): 2, 5, 7, 9, 11; 1, 3, 6, 10 சாந்தியுடன்; 4, 8, 12 கூடாது — சொந்த / உச்ச ராசி அல்லது நவாம்சம், வர்கோத்தமம் எனில் குறை நீங்கும்; நீச / பகை ராசி அல்லது நவாம்சம் எனில் நல்ல இடமும் இல்லை',
    ],
  },
  MUHURTA_CHINTAMANI: {
    labelTa: 'முகூர்த்த சிந்தாமணி அத்.5', booksTa: 'முகூர்த்த சிந்தாமணி ஸ்லோ.39-57',
    nak: { good: [12, 0, 7, 11, 20, 25, 3, 8, 14, 6, 21, 22, 23, 18, 4, 26, 13, 16, 10, 19, 24, 5], mid: [] }, digdwar: false,
    tithi: [2, 3, 5, 10, 11, 12, 16, 17, 18, 19, 20], anadhyaya: { tithis: ANADHYAYA, months: ANADHYAYA_MONTH, sankranti: true }, galagraha: true, pradosha: true,
    vara: { good: [0, 1, 3, 4, 5], mid: [] }, dayParts: { good: [1], mid: [2, 3] },
    navMid: BENEFIC_PLANET_NAVS, moonNavMid: { not: [3], quarters: true },
    notIn: [[['Venus', 'Jupiter', 'Moon', 'LAGNA_LORD'], [6, 8]], [M5, [1, 8, 5]], [BEN3, [6, 8, 12]], [['Moon'], [1], 'MID']],
    moonLagna: 'OWN_EXALTED', maleficIn: [3, 6, 11],
    guru: { good: [5, 9, 11, 2, 7], mid: [10, 6, 3, 1], okSignNav: { signs: [3, 8, 11, 4, 0, 7], navs: [8, 11, 3], vargottama: true }, badSigns: JUPITER_BAD_SIGNS },
    linesTa: [
      'மாதம்: சொல்லப்படவில்லை — சைத்ரம் (சூரியன் மீனத்தில்) மிகச் சிறந்தது',
      'நட்சத்திரம் (ஸ்லோ.40): க்ஷிப்ர, த்ருவ, சர, ம்ருது, ஆயில்யம், மூலம், மூன்று பூர்வங்கள், திருவாதிரை — 22 (வசிஷ்டர், காசியபர், நாரதர்: பதினாறு மட்டும்)',
      'திதி: வளர் 2, 3, 5, 10, 11, 12; தேய் 1-5 · தேய் 6 முதல் அமாவாசை வரை, அனத்யாய (1, 8, 14, 15, 30; நான்கு மாதத் திதிகள்; சங்கிராந்தி), கலக்ரஹ, பிரதோஷம் கூடாது',
      'கிழமை: ஞாயிறு, திங்கள், புதன், வியாழன், வெள்ளி; சனி கூடாது · பகலின் முதல் மூன்றில் ஒன்று (பூர்வாஹ்னம்); இரண்டாவது — லக்னம் கிடைக்காவிட்டால்; மூன்றாவது (அபராஹ்னம்) கூடாது',
      'லக்னம் (ஸ்லோ.41-42): சுக்கிரன், குரு, சந்திரன், லக்னாதிபதி 6, 8-ல் கூடாது · பாவர் 1, 8, 5-ல் கூடாது · சுபர் 6, 8, 12-ல் கூடாது · பாவர் 3, 6, 11 நல்லது · சந்திரன் லக்னத்தில் ரிஷபம் / கடகம் தவிர நல்லதல்ல (குறிக்கப்படும்) · லக்ன நவாம்சம், சந்திரனின் நவாம்சம் — பலன்கள் (குறிக்கப்படும்)',
      'குரு (ஸ்லோ.47): 5, 9, 11, 2, 7 சிறந்தது; 10, 6, 3, 1 பூஜையுடன்; 4, 8, 12 கூடாது — உச்சம், சொந்தம், நட்பு ராசியில் சொந்த / உச்ச நவாம்சம் அல்லது வர்கோத்தமம் எனில் 4, 8, 12-லும் நல்லது; நீசம், பகை ராசியில் நல்ல இடமும் இல்லை',
    ],
  },
  JOSHI: {
    labelTa: 'ஜோஷி', booksTa: 'ஜோஷி',
    sunSign: { good: UTTARAYANA_SIGNS, mid: [] }, harishayana: true,
    nak: { good: SIXTEEN, mid: [] }, digdwar: false,
    tithi: [2, 3, 5, 10, 11, 12, 17, 18, 20], anadhyaya: { tithis: [], months: ANADHYAYA_MONTH, sankranti: true }, galagraha: true,
    vara: { good: [0, 1, 3, 4, 5], mid: [] }, dayParts: { good: [1], mid: [2, 3] },
    navGood: BENEFIC_PLANET_NAVS, moonNav: { not: [0, 3, 4, 7, 9, 10], quarters: true },
    notIn: [[['Jupiter', 'Venus', 'Moon', 'LAGNA_LORD'], [6, 8]], [['Venus', 'Moon'], [12]], [M5, [5, 8]]],
    beneficIn: [1, 4, 7, 10, 5, 9], maleficIn: [3, 6, 11], conj: { planets: ['Jupiter', 'Venus', 'Moon'], with: MALEFICS_MC },
    guru: { good: [2, 5, 7, 9, 11], mid: [1, 3, 6, 10] }, chandra: { good: [1, 3, 6, 7, 10, 11], mid: [2, 5, 9] },
    linesTa: [
      'சூரியன் மகரம் முதல் மிதுனம் வரை, ஹரிசயனம் தவிர (மூத்த மகனுக்கு ரிஷபம் இல்லை; மிதுனம் க்ஷத்ரிய, வைசியருக்கு மட்டும் — கணிக்கப்படவில்லை)',
      'நட்சத்திரம்: பதினாறு (அபிஜித் உட்பட; புனர்பூசம் அந்தணருக்கு இல்லை) · திதி: வளர் 2, 3, 5, 10, 11, 12; தேய் 2, 3, 5 · நான்கு மாதத் திதிகள், சங்கிராந்தி, ரிக்த, கலக்ரஹ கூடாது',
      'கிழமை: செவ்வாய், சனி தவிர · பகலின் முதல் மூன்றில் ஒன்று நல்லது, கடைசி மூன்றில் ஒன்று கூடாது',
      'லக்னம்: சுபர் கேந்திர கோணங்களில், பாவர் 3, 6, 11-ல் (குறிக்கப்படும்) · குரு, சுக்கிரன், சந்திரன், லக்னாதிபதி 6, 8-ல்; சுக்கிரன், சந்திரன் 12-ல்; பாவர் 5, 8-ல் கூடாது · லக்னமும் சந்திரனும் புதன், குரு, சுக்கிரன் நவாம்சத்தில் (சந்திரன் கடக நவாம்சம் திருவோணம் / புனர்பூசம் 4-ஆம் பாதத்தில் மட்டும்) · குரு, சுக்கிரன், சந்திரன் பாவருடன் கூடாது',
      'ஜன்ம ராசியிலிருந்து: குரு 2, 5, 7, 9, 11 பலம், 4, 8, 12 பலவீனம், மற்றவை நடுத்தரம்; சந்திரன் 3, 6, 10, 11, 1, 7 பலம், 4, 8, 12 கூடாது, மற்றவை நடுத்தரம்',
    ],
  },
  RANGACHARYA: {
    labelTa: 'ரங்காச்சார்யா', booksTa: 'ரங்காச்சார்யா',
    masa: { good: [0, 1, 2, 10, 11], mid: [], strict: true },
    nak: { good: SIXTEEN, mid: [] }, digdwar: false, vedha: 'SAPTA',
    tithi: [2, 3, 5, 7, 10, 11, 13, 16], tithiMid: [6, 12, 17, 18, 20],
    vara: { good: [1, 3, 4, 5], mid: [] }, wedCombust: true, dayParts: { good: [1, 2], mid: [] },
    lagna: { good: [1, 2, 4, 5, 8], mid: [0, 3, 6, 7, 9, 10, 11] },
    points: {
      vimsi: { Sun: 3.5, Moon: 5, Mars: 1.5, Mercury: 2, Jupiter: 3, Venus: 2, Saturn: 1.5, Rahu: 1.5 },
      good: { Sun: [3, 6, 11], Moon: [2, 3, 11, 4, 7, 10], Mars: [3, 6, 11], Mercury: [1, 4, 5, 7, 9, 10, 11, 2, 3], Jupiter: [1, 2, 3, 4, 5, 7, 9, 10, 11], Venus: [1, 4, 5, 7, 9, 10, 11, 2], Saturn: [3, 6, 11], Rahu: [3, 6, 11] },
      bad: { Sun: [1, 4, 5, 7, 8, 10, 12], Moon: [1, 6, 8, 12], Mars: [1, 4, 5, 7, 8, 10, 12, 2], Mercury: [6, 8], Jupiter: [6, 8, 12], Venus: [6, 8, 12, 3], Saturn: [1, 4, 5, 7, 8, 10, 12, 2], Rahu: [1, 4, 5, 7, 8, 10, 12] },
      min: 5, mid: 10,
    },
    linesTa: [
      'மாதம்: சைத்ர, வைசாக, ஜ்யேஷ்ட, மாக, பால்குன (ஆஷாடம் க்ஷத்ரிய, வைசியருக்கு; ஜ்யேஷ்டம் மூத்தவருக்கு இல்லை — கணிக்கப்படவில்லை) · முற்பகலில் மட்டும்',
      'நட்சத்திரம்: பதினாறு (புனர்பூசம் — ராஜமார்த்தாண்டர் விலக்குகிறார்) · சப்த சலாகை வேதை கூடாது',
      'திதி: தேய் 1, வளர் 2, 3, 5, 7, 10, 11, 13 நல்லவை; 6, 12 நடுத்தரம்; தேய்பிறை 5 வரை (தேய் 2, 3, 5 நடுத்தரம் — எங்கள் வாசிப்பு)',
      'கிழமை: திங்கள், புதன், வியாழன், வெள்ளி (புதன் அஸ்தங்கம் எனில் இல்லை)',
      'லக்னம்: ரிஷபம், மிதுனம், சிம்மம், கன்னி, தனுசு சிறந்தவை; மற்றவை சாதாரணம் · விம்சோபக அட்டவணை (ப.80): நல்ல இடத்தில் புள்ளி கூடும், தீய இடத்தில் கழியும்; 5-க்குக் கீழ் விலக்கு, 5-10 நடுத்தரம் — அவரது திருமண அட்டவணையின் தரம் (எங்கள் வாசிப்பு); ராகு/கேது வரிசை ராகுவுக்கு',
    ],
  },
  RAMAN: {
    labelTa: 'ராமன்', booksTa: 'ராமன் (சூர்யநாராயண ராவ் மேற்கோள்)',
    uttarayana: 'PREFERRED', masa: { good: [10, 11, 0, 1], mid: [], strict: false },
    nak: { good: SIXTEEN, mid: [] }, digdwar: false,
    tithi: [2, 3, 5, 7, 10, 13, 16, 17, 18],
    vara: { good: [1, 3, 4, 5], mid: [0] }, wedCombust: true, dayParts: { good: [1, 2], mid: [] },
    lagna: { good: [0, 1, 2, 3, 5, 6, 10], mid: [] }, empty: [8],
    notIn: [[['Moon'], [6, 8, 12]], [M5, KENDRAS], [BEN3, [6]], [['Mars', 'Saturn'], [5, 2, 12]], [['Moon'], [1]]],
    moonLagna: 'CANCER_JUPITER', moonNav: { not: [3, 4, 0, 7], quarters: false },
    linesTa: [
      'உத்தராயணம் சிறந்தது · மாக, பால்குன, சைத்ர, வைசாக மாதங்கள் நல்லவை',
      'நட்சத்திரம்: பதினாறு · திதி: வளர் 2, 3, 5, 7, 10, 13; தேய் 1, 2, 3 (வயது கடந்திருந்தால் 14-ம் — கணிக்கப்படவில்லை) · கிழமை: திங்கள், புதன், வியாழன், வெள்ளி; ஞாயிறு சாதாரணம்; அஸ்தங்கப் புதன், செவ்வாய் கூடாது',
      'லக்னம்: மேஷம், ரிஷபம், மிதுனம், கடகம், கன்னி, துலாம், கும்பம் · நண்பகலுக்கு முன் · 8 காலி · சந்திரன் 6, 8, 12-ல், லக்னத்தில் கூடாது (கடக லக்னத்தில் சந்திரன் + குரு, பாவர் 3, 6, 11 எனில் விலக்கு) · பாவர் கேந்திரத்தில் கூடாது (ஐந்து தீய யோகங்கள்) · 6-ல் சுபர் கூடாது · செவ்வாய், சனி 2, 5, 12-ல் கூடாது · சந்திரன் சொந்த, சூரிய, செவ்வாய் நவாம்சத்தில் கூடாது',
    ],
  },
  AGARWAL: {
    labelTa: 'அகர்வால்', booksTa: 'அகர்வால்',
    uttarayana: 'REQUIRED', sunSign: { good: UTTARAYANA_SIGNS, mid: [] }, harishayana: true,
    nak: { good: SIXTEEN, mid: [] }, digdwar: false,
    tithi: [2, 3, 5, 10, 11, 12, 17, 18, 20], anadhyaya: { tithis: ANADHYAYA, months: ANADHYAYA_MONTH, sankranti: true }, galagraha: true, pradosha: true,
    vara: { good: [0, 1, 3, 4, 5], mid: [] }, wedCombust: true, dayParts: { good: [1, 2], mid: [] },
    empty: [8], notIn: [[['Moon'], [1, 6, 8, 12]]], moonNav: { not: [3, 0, 7, 4], quarters: false },
    conj: { planets: ['Venus', 'Moon'], with: ['Mars', 'Saturn', 'Sun'] }, jupStrong: true, jupVenNotSet: true, panchaka: true,
    linesTa: [
      'உத்தராயணம் (சூரியன் மகரம் – மிதுனம்), ஹரிசயனம் தவிர · நான்கு மாதத் திதிகள், சங்கிராந்தி, ரிக்த, கலக்ரஹ, அனத்யாய, பிரதோஷம், ரோக பஞ்சகம் கூடாது · தேய் 6 முதல் அமாவாசை வரை கூடாது',
      'நட்சத்திரம்: ஸ்திர, மித்ர, க்ஷிப்ர, சர (பதினாறு) · திதி: வளர் 2, 3, 5, 10, 11, 12; தேய் 2, 3, 5 · கிழமை: செவ்வாய், சனி தவிர (அஸ்தங்கப் புதன் இல்லை) · முற்பகல் அல்லது அபிஜித்',
      'லக்னம்: சந்திரன் 1, 6, 8, 12-ல் கூடாது · 8 காலி · சந்திரன் சொந்த, செவ்வாய், சூரிய நவாம்சத்தில் கூடாது · சுக்கிரன், சந்திரன் செவ்வாய், சனி, சூரியனுடன் கூடாது · குரு பலமாக (உச்சம், சொந்த ராசி / நவாம்சம், நட்பு ராசி, வர்கோத்தமம்) · குரு, சுக்கிரன் அஸ்தங்கம் கூடாது',
      'ரோக பஞ்சகம் (ப.310): திதி + கிழமை (ஞாயிறு 1) + நட்சத்திரம் (அசுவினி 1) + லக்ன ராசி (மேஷம் 1), ஒன்பதால் வகுத்து மீதி 8 (திதி 1-30 — எங்கள் வாசிப்பு)',
    ],
  },
  VASHISTHA: {
    labelTa: 'வசிஷ்டா', booksTa: 'வசிஷ்டா',
    masa: { good: [0, 1, 2, 3, 10, 11], mid: [], strict: true },
    nak: { good: [0, 3, 4, 6, 21, 22, 23, 26], mid: [] }, digdwar: false, vedha: 'SAPTA',
    tithi: [16, 2, 3, 5, 10, 11, 12],
    vara: { good: [1, 3, 4, 5], mid: [] }, dayParts: { good: [1, 2, 3, 4], mid: [] },
    lagna: { good: [1, 2, 4, 5, 7, 8, 11], mid: [] }, maleficIn: [3, 6, 11],
    linesTa: [
      'மாதம்: சைத்ர, வைசாக, ஜ்யேஷ்ட, ஆஷாட, மாக, பால்குன (மூத்த மகனுக்கு ஜ்யேஷ்டம் இல்லை) · சுக்ல பக்ஷம் சிறந்தது, கிருஷ்ண பக்ஷம் நடுத்தரம்',
      'திதி: தேய் 1, வளர் 2, 3, 5, 10, 11, 12 · கிழமை: திங்கள், புதன், வியாழன், வெள்ளி',
      'நட்சத்திரம்: அசுவினி, ரோகிணி, மிருகசீரிடம், புனர்பூசம், திருவோணம், அவிட்டம், சதயம், ரேவதி (அந்தணர் புனர்பூசம் தவிர்க்க) · சப்த சலாகை வேதை கூடாது (அத்.8)',
      'லக்னம்: ரிஷபம், மிதுனம், சிம்மம், கன்னி, விருச்சிகம், தனுசு, மீனம் — பாதிப்பு இல்லாமல்; பாவர் 3, 6, 11-ல் · சூரியன், சந்திரன், குருவின் பலம் ஜன்ம ராசியிலிருந்து (விதி சொல்லப்படவில்லை) · பகலின் பகுதி சொல்லப்படவில்லை — இரவு மட்டும் விலக்கு (எங்கள் வாசிப்பு)',
    ],
  },
});

/** The age (the running year from birth — or from conception), shown, not judged. */
const UPANAYANA_YEARS = deepFreeze({
  BRAHMIN: { ta: 'அந்தணர்', years: [5, 8], limit: 16 },
  KSHATRIYA: { ta: 'க்ஷத்ரியர்', years: [6, 11], limit: 22 },
  VAISHYA: { ta: 'வைசியர்', years: [8, 12], limit: 24 },
});

const RANK = deepFreeze({
  UPANAYANA: {
    order: UPANAYANA.order,
    words: { KALYANRAMAN: 8480, SHRIDHAR: 3443, WILHELM: 3029, MUHURTA_CHINTAMANI: 2701, JOSHI: 968, RANGACHARYA: 861, RAMAN: 742, AGARWAL: 391, VASHISTHA: 265 },
    measureTa: 'உபநயனம் பற்றிய சொற்கள்: கல்யாணராமன் (தொ.2 பக்.103-124; பல நூல்களின் தொகுப்பு) 8480; ஸ்ரீதர் (§17.9, பக்.421-431) 3443; வில்ஹெல்ம் (பக்.292-300) 3029; முகூர்த்த சிந்தாமணி (பக்.136-144; ஒரு உரைப் படிவம்) 2701; ஜோஷி (பக்.59-62) 968; ரங்காச்சார்யா (பக்.77-80) 861; ராமன் (PDF பக்.20-21) 742; அகர்வால் (பக்.307, 309-310) 391; வசிஷ்டா (பக்.91-92) 265.',
  },
  GRIHA_PRAVESHA: {
    order: GRIHA_PRAVESHA.order,
    words: { SHRIDHAR: 2136, MUHURTA_CHINTAMANI: 1329, WILHELM: 1252, RAMAN: 711, JOSHI: 632, KALYANRAMAN: 587, RANGACHARYA: 411, VASHISTHA: 259, AGARWAL: 74 },
    measureTa: 'புது வீட்டில் நுழைதல் பற்றிய சொற்கள்: ஸ்ரீதர் (§27.16, பக்.732-738) 2136; முகூர்த்த சிந்தாமணி (அத்.13, பக்.313-316; ஒரு உரைப் படிவம்) 1329; வில்ஹெல்ம் (பக்.242-246) 1252; ராமன் (PDF பக்.44-45) 711; ஜோஷி (பக்.122-124) 632; கல்யாணராமன் (தொ.2 பக்.195-196) 587; ரங்காச்சார்யா (அத்.VII பக்.107-108) 411; வசிஷ்டா (பக்.123-124) 259; அகர்வால் (ப.326) 74.',
  },
});

const SOURCES = deepFreeze({
  GRIHA_PRAVESHA: {
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§27.16 "Entering into house", printed pp.732-738 (PDF 766-772): "Lunar months of Magha, Falguni, Jyeshta & Vishakha are auspicious months; & Agahan (Margshirsha) & Karttika are medium"; "1 (D.H.), 2,3,5,10, 13 (B.H.) & the full Moon are auspicious. Rikta, 7th, 12th & the New Moon are held as inauspicious. Nanda, Bhadra, Jaya & Poorna Tithis are favourable for entry into house having the main door in the direction of south, west, north & east"; "Thursday, Wednesday & Friday are auspicious. Saturday is also held as a benefic day ... In the opinion of some Monday is middling. Thus only Sunday & Tuesday are prohibited"; "M.C. recommends Stationary & Sweet asterisms ... Brihat Samhita recommends Dhanishta & Shatbhish"; "Fixed signs as rising sign & navamsha are auspicious. K.P. opines that common signs are of middling quality, & movable signs should be avoided; however, movable signs are very fortunate if the rising navamsha is Taurus"; "Benefic planets should be in angles, trines, 2,3,11 houses; & malefics in 3,6, & 11 houses ... The Moon should not be in 1,3,6,8,or12 houses. 4th & 8th house should be vacant"; Kumbha chakra; the Sun on the left by the door; "combustion of Jupiter & Venus" to be refrained' },
    MUHURTA_CHINTAMANI: { ...MC_SHARMA, pageLocus: 'Chapter 13 "Considerations with regard to entering a newly constructed house", slokas 1-6, printed pp.313-316 (PDF 317-320): "सौम्यायने ज्येष्ठतपोऽन्त्यमाधवे यात्रानिवृत्तौ नृपतेर्नव गृहे । स्याद्वेशनं द्वाःस्थमृदुध्रुवोडुभिर्जन्मर्क्षलग्नोपचयोदये स्थिरे"; "in the months of Jyeshtha, Magha, Phalguna and Baisakha when the Sun is in Uttarayana, in the Nakshtras happening to be in the front of the door of the house, in the Nakshtras named as Dhruwa (the 3 Uttaras and Rohini) and those named as Mridu ... and in the Upachaya (3/6/10/11) and the Sthira or Fixed Sign (2/5/8/11) Ascendant from the Janama Rashi and Natal Ascendant"; "Benefic Planets in the 9/5/1/4/7/10/11/2/3 houses and Malefic Planets are in 3/6/11 houses and the 4th and the 8th house are without any Planet ... Sunday and Tuesday, the Tithis named as Riktas (4/9/14), the Ascendants which are named as Chara or Movable (1/4/7/10), Amavasya, and the month of Chaitra, these should be left"; the Sun on the left (sloka 5); Kumbha chakra (sloka 6)' },
    WILHELM: { ...WILHELM_E, pageLocus: '"House/Buildings — Entering a new house (Grihapravesa)", printed pp.242-246 (PDF 250-254): "Vaisakha, Jyeshtha, Magha and Phalguna are most favorable. Karttika and Margasira are middling. Chaitra should be avoided"; "Rohini, Mrigasira, Uttaraphalguni, Anuradha, Uttarashadha, Uttarabhadrapada and Revati are best. Kalaprakasika also considers Punarvasu, Pushya, Hasta, Sravana and Satabhisha as favorable, while Muhurta Chintamani also considers Chitra"; tithis; "The Varas of the Moon, Mercury, Jupiter and Venus are best. Saturn\'s is mediocre"; "Fixed Rasis are best, dual Rasis middling and moveable Rasis should be avoided. Moveable Rasis are only acceptable if the Navamsa Lagna is Taurus"; "The Navamsas of the Moon, Mercury, Jupiter and Venus are favorable"; "The 8th Bhava must be unoccupied ... Some sources also suggest avoiding any planets in the 4th"; Kumbha chakra' },
    RAMAN: { ...RAMAN_BV, pageLocus: '"Entering a New House", PDF pp.44-45: "New houses should be entered when the Sun is in Uttarayana, and when Jupiter and Venus are strongly disposed"; "The lunar months of Vaisakha, Jyeshta, Magha and Phalguna are the best while Kartika and Margasira are neutral or middling. The most auspicious lunar days are the first of the dark fortnight, 2nd, 3rd, 5th, 7th, 10th, 11th and 13th of the bright half. Rohini, Mrigasira, Uttarashada, Chitta and Uttarabhadra are the best constellations. Anuradha and Revati are also permissible"; "Monday, Wednesday, Thursday and Friday are auspicious. Saturday is also recommended by some"; "The Lagna or the ascendant should be a fixed sign. Common signs are ordinary while movable signs should be generally avoided. Provided, however, the Navamsa Lagna is Taurus ... The 8th house from the Lagna should be vacant. Malefics should be disposed in Upachayas, benefics should fortify quadrants"' },
    JOSHI: { ...JOSHI_KK, pageLocus: '"Entering into a new house", printed pp.122-124 (PDF 137-139): "auspicious when Sun is in Uttarayana ... and lunar months of Magha, Falguna, Vaishakha and Jyestha"; "All fixed nakshatras ... all friendly nakshatras ... and all nakshatras falling in the direction of door"; "2/3/5/6/7/8/10/11/12/13/15 tithis are considered good; All days except Tuesday & Sunday"; "Lagna of fixed or dual rashis ... or lagna of rashis falling in 3/6/10/11 houses from natal moon sign or natal lagna ... benefics in 1/7/10/5/9/2/3/11 houses; malefics in 3/6/11 houses and no planet in 4/8 houses"; Kumbha chakra 6-13, 22-27; the Sun and tithis by the door' },
    KALYANRAMAN: { ...KALYANRAMAN_V2, pageLocus: '"Entering New House Or Gruhapravesha", printed pp.195-196 (PDF 197-198): Rohini, Mrigasira, Uttaraphalguni, Chitra, Anuradha, Uttarashada, Uttarabhadrapada, Revati (8); tithis 2/3/5/6/7/8/10/11/12/13/15; Monday, Wednesday, Thursday, Friday, Saturday; Kumbha Chakra Suddhi 6-13, 22-27 from the Sun\'s star; "Benefics are to be in 1/7/10/5/9/2/3/11 houses and there must be no planet in the 4th or 8th house"; "Prefer the Lagna to be the raasis 2/5/8/11/3/6/9/12 or the raasis 3/6/10/11 from the native\'s natal moon sign"; "Prefer Uttaraayana ... Magha, Phalguna, Vaisaka or Jyeshta"; door tithis and the Sun' },
    RANGACHARYA: { ...RANGACHARYA_I, pageLocus: 'Chapter VII "Nootana Griha Pravesha", printed pp.107-108 (PDF 115-116): "The months of Magha, Phalguna, Vaisakha and Jyeshtta are the best ... Margasira and Kartika are mediocre. Chaitra, Ashada, Sravana, Bhadrapada, Aswiyuja and Pushya should be rejected"; "Rikta tithi should be avoided"; "Chitra, Anuradha, Dhanishtta, Uttaratrayam, Revati, Satabhisha, Rohini, Mrigasira are favoured"; Kalasachakra "The first 4 asterisms are evil, the next 8 are good, the next 8 are good evil and the next 6 are good"; "Kanya, Kumbha, Vrishabha, Simha, Vrischika and Mithuna are good. Never select the cardinal lagnas ... But the cardinal lagna with benefic navamsa is acceptable if it is the 3rd, 6th, 10th, or 11th from Janma Rasi or Janma Lagna"; "Benefic planets should be in the kendras, Konas, 2nd, 3rd and 11th. The malefic planets should be in 3rd, 6th, 11th. The 4th, 8th and the 12th houses should lie vacant"' },
    VASHISTHA: { ...VASHISTHA_KUSUM, pageLocus: '"Nutana Griha Pravesha Muhurta", printed pp.123-124 (PDF 110-111): Baisakha, Jyeshtha, Magha, Phalguna best, Kartika, Mrigashirsha average; tithis 1 (Krishna), 2, 3, 5, 7, 10, 11, 13 (Shukla); Monday, Wednesday, Thursday, Friday, Saturday; Ashlesha, Rohini, Mrigashirsha, Punarvasu, Pushya, 3 Uttaras, Hasta, Chitra, Swati, Anuradha, Shravana, Dhanishtha, Shatabhisha, Revati; "2, 3, 5, 6, 8, 11 and 12 lagnas and 3, 6, 11 rashis from janmarashi are auspicious. Malefics in 3rd, 6th, 11th, 4th and 8th should be vacant. 1, 2, 5, 7, 9, 10, and 11 bhavas should be either posited with a benefic or aspected by it. Moon should not be in 1, 6, 8 or 12"; "the Sun is in Uttarayana, Jupiter and Venus not combust"' },
    AGARWAL: { ...AGARWAL_GS, pageLocus: '"Griha parvesha", printed p.326 (PDF 325): Monday, Wednesday, Thursday, Friday; tithis 2, 3, 5, 6, 7, 10, 11, 13; Rohini, Mrigshira, Chitra, Anuradha, Revati, all 3 Uttras; Magha, Phalguna, Jyestha, Vaisakha; "Benefics in kendras & konas, malefics in 3, 6, 11. 8th and 4th should be vacant, Moon should not be in 6th or 8th or 12th. Fixed signs should rise, dual signs are middling. Avoid movable signs"' },
  },
  UPANAYANA: {
    KALYANRAMAN: { ...KALYANRAMAN_V2, pageLocus: '"Performing Upanayana", printed pp.103-124 (PDF 105-126) — his general statements (the summary, "generally", items 9-14; item 8 is "Others want"): the summary, p.103: "Nakshatra 16 (Abhijith included) ... Punarvasu rejected for Brahmins"; "2/3/5/10/11/12 Tithis of Shuklapaksha and 2/3/5 of Krishnapaksha. All Rikta 4/9/14 and Galagraha Tithis 13/14/15/30/1/4/7/8/9 are to avoided"; "Sunday, Monday, Wednesday, Thursday, Friday, All days except Tuesday and Saturday"; p.109 item 6: "Generally only the first one-third part of the day is auspicious and the last one-third part of the day is inauspicious for Upanayana. The solar months of Makara, Kumbha, Meena, Mesha, Vrushabha and Mithuna are acceptable except for the Harisayana period ... The lunar months acceptable are Chaitra, Vaisaaka, Jyeshta, Magha and Phalguna"; p.114 item 8: "the following special tithis must be avoided. 1. Aashaadha Sukla Dasami. 2. Jyeshta Sukla Dwiteeya. 3. Pausha Sukla Ekadasi. 4. Magha Sukla Dwadasi. 5. Samkranti days and Rikta tithis and Galagraha tithis"; p.115: "For choosing Wednesday Mercury must not be combust"; p.112: "The Vedha nakshatra ascertained through Sapta Salaka must also be rejected"; p.122 item 8 "Others want the following good combinations" (not taken into his reading) and items 9-12: "The strength of Jupiter is paramount for Upanayana"; "The Chandra-Guru Suddhi or the auspiciousness of the Moon and Jupiter is very essential"; "For Upanayana the Chandrabala, Taaraabala and Brahaspathibala are essential for the child"; p.123: the table — Moon favourable 1/2/3/5/6/7/9/10/11, unfavourable 4/8, mediocre 12; Sun 3/6/10/11, 4/8/12, 1/2/5/7/9; Jupiter 2/5/7/9/11, 4/8/12, 1/3/6/10 — with the seven exceptions; items 13-14: "The Sun, Mars Raahu must not be in 9th ... Venus in the 8th is auspicious. No other planet can be in the 8th ... The 8th from the Janma raasi of the boy must be free except for Venus. Jupiter must not be in 3rd in any case ... Mars and Saturn in the 2nd or 12th cannot be accepted. Moon in lagna cannot be accepted. If however, the Moon and Jupiter are in Cancer and malefics are in 3/6/11 the lagna Chandra dosha can be condoned"' },
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§17.9 "Upanayana — wearing of the sacred thread", printed pp.421-431 (PDF 461-471): "Full Uttrayana is favourable ... most auspicious when the Sun transits Aries or Pisces; & is middling when the Sun transits Capricorn & Aquarius"; "2,3,5,7,10,11 & 12 of B.H. are auspicious. 6,11 & 12 are middling"; "First five Tithis of D.H. are also beneficial"; "4th, 9th & 14th (Rikta) of both the halves, & Anadhyaya Tithis (1,8,14 of halves, the Full Moon & the New Moon, & others) be avoided"; "Wednesday, Thursday & Friday are the best. Sunday & Monday are middling. Tuesday & Saturday should be avoided. Monday of D.H.; Wednesday, when Mercury is set or afflicted should be avoided"; "Small ..., Sweet ..., Stationary ..., Movable ... 16 nos."; "Some consider Shravana, Shatbhish, Dhanishta as neutral"; "All the exponents advise that 10th, 16th, 18th, 23rd & 25th asterisms from the birth asterism be avoided ... Some feel to avoid 5th, 7th, 19th, 22nd & 27th"; "2,3,4,5,6,7,9,12, signs as ascendant are the best. 8th & 12th houses of the election chart should be Shuddha"; "Cancer navamsha is prohibited"; "The Moon should not be in 1,6,8,or 12 houses of the election chart; malefics should be in 3,6,11; & benefics should not be in 6,8,12 houses"; "Malefic in 1,6,8,12 houses in the election chart destroys the Guru"; "neither of the Sun, Mars, Saturn Rahu or Ketu should occupy quadrant"; §17.9.8 Jupiter 2/5/11/7/9 with vedha 12/4/8/3/10, 1/3/6/10 after Pooja, 4/8/12 "shall not do", the five cancellations; the Sun 3/6/10/11 with vedha 9/12/4/5 (but Saturn), 1/2/5/7/9 after propitiation, 4/8/12 rejected, the three cancellations; §17.9.9: "Dakshinayana, eclipse, Sankranti, Mrityu Baana, D.H. after 5th Tithi, both the twilights, after-noon, night-time, Saturday, Vedha nakshatra, Pradosha ... Anadhyaya ... Gandanta, Vaidhriti, Vyatipaata, Bhadra Karan, Vyaghaata, Vajra, Vishkumbh, Paridh, Shoola, Ganda, Atiganda ... Dosha of Jupiter & Venus ... Hari Shayana, 12th B.H. of Ashvin, Maha Navami"' },
    WILHELM: { ...WILHELM_E, pageLocus: '"Religious — Upanayanam/Baptism", printed pp.292-300 (PDF 300-308): "Ayana: Uttarayana is preferred"; the sixteen Nakshatras, "though some consider Sravana, Dhanishtha and Satabhisha to be only middling"; "Tara: Avoid the 1st, 5th, 7th, 10th, 16th, 18th, 19th, 22nd, 23rd, 25th and 27th Nakshatras from the Janma Nakshatra"; "The 2nd, 3rd, 5th and 10th Tithis of Shukla Paksha and the 1st, 2nd and 3rd Tithis of Krishna Paksha are most favorable. The 6th, 7th, 11th, 12th and 13th Tithis of Shukla Paksha and the 5th of Krishna Paksha are middling. The 4th, 8th, 9th, 14th and 15th should be avoided"; Anadhyaya, Galagraha and Pradosha; "Vishti Karana must be avoided"; "The Varas of Mercury, Jupiter and Venus are favorable, though Mercury\'s should be avoided if Mercury is combust. The Varas of the Sun and Moon are middling. The Varas of Mars and Saturn, and the Moon\'s during Krishna Paksha should be avoided"; "Lagna: Taurus, Gemini, Cancer, Leo, Virgo, Libra, Sagittarius and Pisces are favorable"; "The Moon should not be in the Lagna, unless exalted or in own Rasi ... The Moon, Jupiter, Venus and the Lagna lord should not be in the 6th or 8th. Benefics should not be in the Dusthanas, and malefics should not be in the 1st, 5th or 8th and do best in the 3rd, 6th and 11th"; "there should be no malefics in the angles"; "The 8th house should be unoccupied"; "Avoid the afflictions of Jupiter and Venus, particularly combustion"; Gochara: "Transiting Jupiter in the 2nd, 5th, 7th, 9th or 11th from the natal Moon is very favorable ... Propitiation of Jupiter when in the 1st, 3rd, 6th or 10th is much more effective than when he is in the 4th, 8th or 12th"; "Avoid the afternoon, nights and twilights"' },
    MUHURTA_CHINTAMANI: { ...MC_SHARMA, pageLocus: 'Chapter 5 "The Samskaras", slokas 39-57, printed pp.136-144 (PDF 140-148): sloka 40 "द्वित्रीषुरुद्ररविदिक्प्रमिते तिथौ च कृष्णादिमत्रिलवकेऽपि न चापराह्णे" — "Kshipra ..., Dhruwa ..., Ashlesha, ... Chara ..., Moola, ... Mridu ..., Poorvaphalguni, Poorvashadha, Poorvabhadrapada and Ardra, on the 5 days of Sunday, Wednesday, Thursday, Friday and Monday, on the Tithis of 2/3/5/11/12/10 ... The first 3rd part ... of the Krishna Paksha is also acceptable ... not to be done in the 3rd part of the day"; note: "If there is the lack of an auspicious Ascendant in the Poorvanha, then Upanayana may be performed in the Madhyanha"; sloka 41 "Venus, Jupiter, the Moon and the Ascendant Lord are not in the 6th and the 8th House. And the Malefic Planets are inauspicious in the 1/8/5 Houses"; sloka 42 "there should not be the Benefic Planets in the 6/8/12 Houses. If the Malefic Planets are situated in the 3/6/11 Houses, they are auspicious. The Full Moon will be excellent if she is in her highest exaltation in the Ascendant or in her own sign"; sloka 47 Jupiter "5/9/11/2/7 ... excellent; ... 10/6/3/1 ... pacified ... 4/8/12 ... not acceptable" and its exception; sloka 48 "not ... in the Krishna Paksha ... from Shashthi (the 6th) to Amavasya, on the day of Pradosha, ... Anadhyaya, on Saturday, in the \'Apranha Kaala\' ... and on the Galagraha Tithis"; sloka 54 Anadhyaya "शुचिशुक्रपौषतपसां दिगश्विरुद्रार्कसंख्यसिततिथयः"; sloka 55 Pradosha' },
    JOSHI: { ...JOSHI_KK, pageLocus: '"Upanayana Samskara or Thread Ceremony", printed pp.59-62 (PDF 74-77): "Solar months of Makara, Kumbha, Meena, Mesha, Vrishabha, and Mithuna avoiding Harishayana (i.e. the period from Ashada Shukla 11 to Kartika Shukla 11) are considered good"; the fixed, friendly, short and movable Nakshatras; "Tithis: 2/3/5/10/11/12 tithis of bright half and 2/3/5 tithis of dark half ... Avoid Ashada Shukla-10, Jyestha Shukla-2, Pausa Shukla 11, Magha Shukla 12 and samkranti day. All Rikta tithis (4/9/14) and Galgraha tithis (13/14/15/30/1/4/7/8/9) are avoided"; "All days except Tuesday and Saturday are good"; "Upnayana is considered auspicious in first part of the day and inauspicious in third part of the day"; "benefics placed in Kendras and Trikonas and Malefics placed in 3/6/11 houses are considered good. Avoid Jupiter, Venus, Moon and Lagna Lord in 6th or 8th house, avoid Venus and Moon in 12th house and avoid malefics in 5th or 8th house"; "Upnayana Lagna and moon should be in the navamsha of Mercury, Jupiter or Venus. Moon in its own navamsha is not considered auspicious except when it is placed in 4th quarter of Shravana or Punarvasu nakshatras. Moreover Jupiter, Venus and Moon should not be conjoined with malefics"; "From natal moon Jupiter placed in 2/5/7/9/11 houses is considered strong and Jupiter placed in 4/8/12 houses is considered weak. Other positions are medium"; "Moon is considered strong when it is placed in 3/6/10/11/1/7 houses from natal moon position. It is worse if placed in 4/8/12"' },
    RANGACHARYA: { ...RANGACHARYA_I, pageLocus: '"Upanayana (Investiture of sacred thread)", printed pp.77-80 (PDF 85-88): "The lunar months allowed for Upanayana are Chaitra, Visakha Jyeshtta, Magha and Phalguna"; "The Upanayana should be performed in the forenoon only but never in the afternoon"; "Sukla Paksha is good. Krishna Paksha is allowed till the 5th lunar day. Tithi 1(D),2,3,5,7,10,11,13 are good. 6 and 12 are mediocre"; "Monday, Wednesday, Thursday, Friday ... Wednesday is good if Mercury is not combust"; the sixteen asterisms; "Avoid vedhanakshatra by Saptha Salaka"; "Vrishabha, Mithuna, Simha, Kanya and Dhanus are best preferred. The rest are ordinary"; the table "for Vimsopaka evaluation of Upanayana Muhurtha": benefic, evil and neutral places and the vimsi of each planet' },
    RAMAN: { ...RAMAN_BV, pageLocus: '"Investiture of Sacred Thread (Upanayanam)", PDF pp.20-21: "The best season is when the Sun is in his northern course ... The lunar months of Magha, Phalguna, Chaitra and Vaisakha are good. The 2nd, 3rd, 5th, 7th, 10th and 13th lunar days in the bright half and the 1st, 2nd and 3rd in the dark half are held to be auspicious"; "Monday, Wednesday, Thursday and Friday are propitious. Wednesday must be rejected if Mercury Is combust. Sunday is ordinary while Tuesday should be invariably rejected"; "Aries, Taurus, Gemini, Cancer, Virgo, Libra and Aquarius are good. The other signs should be avoided"; "The Moon must not occupy the 6th, 8th, or 12th house. Malefics should not be posited in quadrants. The ceremony should take place before noon. The 8th house from the Lagna must be unoccupied"; "the 6th should be devoid of a benefic. Mars and Saturn should be avoided in the 5th ... in the 2nd ... in the 12th"; "The Moon should always be avoided in Lagna. But, however, if Cancer is the ascendant and the Moon and Jupiter are in conjunction and malefics are in 3, 6 and 11, the evil ... becomes neutralised"; "The Moon should not be in her own Navamsa, nor in that of the Sun or Mars"' },
    AGARWAL: { ...AGARWAL_GS, pageLocus: 'printed pp.307, 309-310 (PDF 306, 308-309): "Avoid Upanayana Samskara in the afternoon (apranha), from tithis 6 to amavasya in krishna paksha, on the days of anadhyaya tithis, on the days of pradoshatithis, on galagrahatithis"; item 7: "Good solar months for this are when Sun is Uttarayana i.e. in Capricorn to Gemini signs, avoiding ashadha shukal 11 to kartika shukla 11. Avoid ashadh shukal 10, jyestha shukal 2, pausa shukal 11, magha shukal 12 and sankranti day, rikta and galgraha tithis, rog panchaka. Good nakshatras are fixed, friendly, short and moveable ... Good tithis are 2,3,5,10,11,12 of shukal paksha and 2,3,5 of krishan paksha. All days except Tuesday and Saturday are good. Avoid Wednesday if Mercury is combust. In muhurta kundli, Moon should not be in 6, 8 or 12. 8th should be unoccupied. Avoid Moon in lagna or in own navamasa or in that of the Mars or of the Sun. Venus & Moon should not conjunt Mars, Saturn or Sun. Jupiter should be strong (ooncha, own sign/ navamsa, in a friendly sign or vargottam). The period of before-noon or of abhijit muhurta is the best"; p.310 "Tithi panchaka: Add tithi and vaar (taking Sunday as 1 ...) and nakshatra number (as counted from Aswini excluding Abhijit) and lagna (rasi number of the lagna) ... Divide this sum by 9. If remainder is 8, it is rog panchaka (to be avoided for marriage & upanayana)"' },
    VASHISTHA: { ...VASHISTHA_KUSUM, pageLocus: '"8. Upanayana Samskara", printed pp.91-92 (PDF 78-79): "Shukla paksha is the best for upanayana samskara, krishna paksha is the medium"; "Mas — Chaitra, Baishakha, Jyeshtha, Ashadha, Magha, Phalguna"; "Tithi — 1 of krishna paksha and 2, 3, 5, 11, 12 and 10 of shukla paksha"; "Var — Monday, Wednesday, Thursday and Friday"; "Nakshatra — Ashwini, Rohini, Mrigashirsha, Punarvasu, Sravana, Dhanishtha, Shatabhisha and Revati. Brahmins are advised to ignore Punarvasu"; "Lagna — 2, 3, 5, 6, 8, 9 and 12 lagna should not be afflicted. Malefics in 3, 6, and 11"; Chapter 8, p.93: "Nakshatravedha must be watched for yajyopaveeta muhurta ... There should be no planet opposite the nakshatra"' },
  },
  VISHTI: { ...SHRIDHAR_HEA, pageLocus: '§6.3 "Vishti Karan — Bhadra", printed p.127 (PDF 172): "Bhadra prevails during first half of 8th & 15th Tithis of B.H. & 7th & 14th Tithis of D.H.; and second half of 4th & 11th of B.H. & 3rd & 10th Tithis of D.H.; of all the lunar months"' },
  MONTHS: [
    { ...SHRIDHAR_HEA, pageLocus: 'Chapter 9 "The Moon", printed p.236 (PDF 280): "In Amant system a lunar month starts just after conjunction of the Sun & the Moon on a New Moon day & the month ends at the next New Moon day. Lunar month of Chaitra starts at New Moon when the Sun is in sidereal Pisces"' },
    { ...WILHELM_E, pageLocus: '"Calculating lunar months", PDF p.24: "Chaitra ... at the Sun/Moon conjunction in sidereal Pisces. Each succeeding month begins at the Sun/Moon conjunction in the succeeding Rasis"' },
  ],
});

const CODE_TA = Object.freeze({
  MASA: 'மாதம் இல்லை', MASA_MID: 'மாதம் நடுத்தரம்', UTTARAYANA: 'உத்தராயணம் இல்லை', UTTARAYANA_MID: 'உத்தராயணம் இல்லை (விருப்பம்)',
  NAK: 'நட்சத்திரம் இல்லை', NAK_MID: 'நட்சத்திரம் நடுத்தரம்', TITHI: 'திதி இல்லை', TITHI_DOOR: 'வாசல் திசைக்கு உரிய திதி இல்லை',
  VARA: 'கிழமை இல்லை', VARA_MID: 'கிழமை நடுத்தரம்', KUMBHA: 'கும்ப / கலச சக்கரம் தீது',
  LAGNA: 'லக்னம் இல்லை', LAGNA_MID: 'லக்னம் நடுத்தரம்', NAV: 'சுப நவாம்சம் இல்லை',
  EMPTY_4: '4-ல் கிரகம்', EMPTY_8: '8-ல் கிரகம்', EMPTY_12: '12-ல் கிரகம்', EMPTY_4_MID: '4-ல் கிரகம் (விருப்பம்)',
  BENEFIC_PLACE_MID: 'எல்லாச் சுபரும் சிறந்த இடத்தில் இல்லை', MALEFIC_PLACE_MID: 'எல்லாப் பாவரும் சிறந்த இடத்தில் இல்லை', BENEFIC_KENDRA: 'கேந்திரத்தில் சுபர் இல்லை',
  MOON_PLACE: 'சந்திரன் தீய இடத்தில்', JUP_VEN_SET: 'குரு / சுக்கிரன் அஸ்தங்கம்', SUN_LEFT: 'சூரியன் இடப்புறம் இல்லை (வாசல்)',
  SUN_SIGN: 'சூரியன் இந்த ராசியில் இல்லை (சௌர மாதம்)', SUN_SIGN_MID: 'சௌர மாதம் நடுத்தரம்', HARISHAYANA: 'ஹரிசயனம்',
  TITHI_MID: 'திதி நடுத்தரம்', ANADHYAYA: 'அனத்யாய திதி', SANKRANTI: 'சங்கிராந்தி திதி', GALAGRAHA: 'கலக்ரஹ திதி',
  TARA_NOT: 'ஜன்மத்திலிருந்து தீய எண்ணிக்கை', TARA_MID: 'ஜன்மத்திலிருந்து தவிர்க்கச் சிலர் சொல்வது', YOGA: 'தீய யோகம்', VISHTI: 'விஷ்டி கரணம்',
  VEDHA: 'வேதை நட்சத்திரம்', BANA: 'மிருத்யு பாணம் (சூரிய பாகை)', GURU: 'குரு பலம் இல்லை', GURU_MID: 'குரு — சாந்தியுடன்',
  RAVI: 'சூரிய பலம் இல்லை', RAVI_MID: 'சூரியன் — சாந்தியுடன்', CHANDRA: 'சந்திர பலம் இல்லை (நூலின் பட்டியல்)', CHANDRA_MID: 'சந்திரன் நடுத்தரம்',
  MOON_NAV: 'சந்திரனின் நவாம்சம் கூடாது', MOON_NAV_MID: 'சந்திரனின் நவாம்சம் (பலன் — குறிக்கப்படும்)', CONJ: 'சுபர் / சந்திரன் பாவருடன்',
  NATAL_8: 'ஜன்ம ராசிக்கு 8-ல் கிரகம்', MOON_8: 'சந்திரனுக்கு 8-ல் கிரகம்', JUP_WEAK: 'குரு பலமில்லை',
  WED_COMBUST: 'புதன் அஸ்தங்கம் — புதன்கிழமை இல்லை', MON_KRISHNA: 'தேய்பிறைத் திங்கள்', NIGHT: 'இரவு', DAY_PART: 'பகலின் இந்தப் பகுதி கூடாது',
  DAY_PART_MID: 'பகலின் இந்தப் பகுதி நடுத்தரம்', PRADOSHA: 'பிரதோஷ நாள்', NAV_MID: 'லக்ன நவாம்சம் (பலன் — குறிக்கப்படும்)',
  POINTS: 'விம்சோபகம் 5-க்குக் கீழ்', POINTS_MID: 'விம்சோபகம் நடுத்தரம்', ROGA_PANCHAKA: 'ரோக பஞ்சகம்',
});

const NOTES_TA = deepFreeze({
  GRIHA_PRAVESHA: [
    'மாதம் = அமாந்த சந்திர மாதம் (அமாவாசை முதல் அமாவாசை வரை; அமாவாசையில் சூரியன் மீனத்தில் எனில் சித்திரை — ஸ்ரீதர் ப.236, வில்ஹெல்ம்). அதிக மாதம் தனியாகக் காட்டப்படவில்லை.',
    '"நடுத்தரம்" — ஏற்கப்படும், குறிக்கப்படும். "விருப்பம்" (உத்தராயணம், 4-ஆம் வீடு) — தீர்ப்பில் இல்லை, குறிக்கப்படும்.',
    'வாசல் திசை தேர்ந்தால் மட்டும்: அதன் திதி வகை (பூர்ணா கிழக்கு, நந்தா தெற்கு, பத்ரா மேற்கு, ஜயா வடக்கு — எங்கள் வாசிப்பில் கட்டாயம்), சூரியன் "இடப்புறம்" (கிழக்கு 8-12, தெற்கு 5-9, மேற்கு 2-6, வடக்கு 11-3 வீடுகளில்), வாசலை நோக்கிய நட்சத்திரங்கள் (கிருத்திகை-ஆயில்யம் கிழக்கு, மகம்-விசாகம் தெற்கு, அனுஷம்-திருவோணம் மேற்கு, அவிட்டம்-பரணி வடக்கு) சுபமாகவும் (மு.சி., ஸ்ரீதர், ஜோஷி, கல்யாணராமன்).',
    'சுபர் = புதன், குரு, சுக்கிரன்; பாவர் = சூரியன், செவ்வாய், சனி ("பாவர் 3, 6, 11-ல்" — ராகு, கேது இரண்டும் அங்கு வர முடியாது; எங்கள் வாசிப்பு). "சுபர் … இடங்களில், பாவர் 3, 6, 11-ல்" — எல்லா மூன்றும் ஒரே நேரத்தில் அப்படி இருப்பது அரிது (ஈரோடு சோதனை ஜாதகம், 60 நாள்: பாவர் விதி 86,400-ல் 85,662 நிமிடம் தடுக்கிறது); வில்ஹெல்ம் "best", ஸ்ரீதர் §13.7 "பலம் சேர்ப்பவை" என்கிறார்கள் — அதனால் குறிக்கப்படுகிறது, விலக்கவில்லை (எங்கள் வாசிப்பு; உங்கள் முடிவு). வசிஷ்டாவின் "1, 2, 5, 7, 9, 10, 11 சுபருடன் அல்லது சுபர் பார்வையுடன்" — எல்லாச் சுபரும் அந்த இடங்களில் என்று.',
    'கும்ப சக்கரம் (மு.சி. ஸ்லோ.6): சூரியன் நின்ற நட்சத்திரம் முதலாக எண்ணி 6-13, 22-27 நல்லவை. ரங்காச்சார்யாவின் "கலச சக்கரம்" (4 தீது, 8 நல்லது, 8 தீது, 6 நல்லது) 26 மட்டுமே எண்ணுகிறது — 5-12, 21-26 நல்லவை என்று கணிக்கப்படுகிறது. வசிஷ்டா பெயர் மட்டும் சொல்கிறார்.',
    'கல்யாணராமன் 8 நட்சத்திரங்களை எண்ணுகிறார்; அவரது அகர வரிசைப் பட்டியலில் சுவாதி, புனர்பூசம், திருவோணம், அவிட்டம், சதயம் கூடுதலாக உள்ளன (வாஸ்து பூஜை நட்சத்திரங்கள்?) — 8 மட்டும் கணிக்கப்படுகிறது. வசிஷ்டாவின் பட்டியலில் "ஆயில்யம்" அச்சில் உள்ளபடி.',
    'கணிக்கப்படாதவை: காலை / பகல் நேரம் (வில்ஹெல்ம், ரங்காச்சார்யா, வசிஷ்டா), மனைவி கர்ப்பம், பக்கத்தில் சுக்கிரன், யோகினி, திக் சூலம், கால ராகு, பிறப்பு லக்னாதிபதி / தசாதிபதி பலம், பகூட், அதிக மாதம்.',
    'பொது லக்னச் சோதனைகள் (பிறப்பிலிருந்து 8-ஆம் ராசி, கர்த்தரி, கண்டாந்தம், ஷட்வர்க்கம், … ஸ்ரீதர் §13.10) மற்ற சுப காரியங்களுக்கு உள்ளபடியே; பொது லக்ன சுத்தியின் இடத்தில் இந்த நிகழ்வின் விதிகள் (மு.சி. ப.79: "நிகழ்ச்சியின் தன்மைக்கேற்ப லக்ன சுத்தி").',
  ],
});

const NOTES_UPANAYANA_TA = Object.freeze([
  'வயது (எல்லா நூல்களும்): அந்தணர் 5 அல்லது 8-ஆம் ஆண்டு, க்ஷத்ரியர் 6 அல்லது 11, வைசியர் 8 அல்லது 12 (பிறப்பு அல்லது கருவிலிருந்து); இரண்டு மடங்கு வரை நடுத்தரம்; எல்லை 16, 22, 24. வர்ணமும் வேதமும் கேட்கப்படுவதில்லை — வயது காட்டப்படும், தீர்ப்பில் இல்லை.',
  'வர்ண அதிபதி (அந்தணர் குரு, சுக்கிரன்; க்ஷத்ரியர் சூரியன், செவ்வாய்; வைசியர் சந்திரன்), வேத அதிபதி (ரிக் குரு, யஜுர் சுக்கிரன், சாம செவ்வாய், அதர்வ புதன்) — அவர்களின் கிழமை, லக்னம், பலம், அந்தந்த வேதத்தின் நட்சத்திரங்கள்: காட்டப்படுவதில்லை, கணிக்கப்படவில்லை.',
  'ஜன்ம மாதம், மூத்தவருக்கு ஜ்யேஷ்டம், அதிக மாதம், ருது / மாத / நட்சத்திர முடிவு, கிரகணம், இடி, தாயின் மாதவிலக்கு, குடும்பத் திருமணத்துக்குப் பின் ஆறு மாதம், ஆசார்யரின் அஷ்டம ராசி — கணிக்கப்படவில்லை.',
  'பகலின் பகுதிகள்: சூரிய உதயம் முதல் அஸ்தமனம் வரை — மூன்றில் ஒன்று (பூர்வாஹ்னம்), நண்பகல், மூன்றில் இரண்டு. இரவு எல்லா நூலிலும் விலக்கு (சொல்லாத நூல்களுக்கும் — எங்கள் வாசிப்பு). சந்தி நேரத்தின் அளவு சொல்லப்படவில்லை — உதயம், அஸ்தமனம் மட்டும்.',
  'பிரதோஷம் (மு.சி. ஸ்லோ.55, வில்ஹெல்ம்): உதயத்தில் 12-ஆம் திதி நள்ளிரவுக்குள், 6-ஆம் திதி இரவின் 1½ யாமத்துக்குள், 3-ஆம் திதி முதல் யாமத்துக்குள் முடிந்தால் அந்த நாள் (உதயம் முதல் உதயம் வரை); இரு பக்ஷங்களிலும்; யாமம் = இரவின் நான்கில் ஒன்று.',
  'சங்கிராந்தி: சூரியன் ராசி மாறும் நேரத்தை உள்ளடக்கிய திதி (வில்ஹெல்ம்: "the Tithi prevailing during Sankranti"; மு.சி. "சங்கிராந்தி நாள்").',
  'விஷ்டி கரணம் (ஸ்ரீதர் §6.3): வளர் 8, 15 முதல் பாதி, 4, 11 இரண்டாம் பாதி; தேய் 7, 14 முதல் பாதி, 3, 10 இரண்டாம் பாதி.',
  'அனத்யாயத்தின் "1, 8, 14" இரு பக்ஷங்களுக்கும் (மு.சி.: "Shukla and Krishna both Pakshas") — அதனால் வில்ஹெல்ம், ஸ்ரீதர், மு.சி. நல்லது என்ற தேய் 1 விலகுகிறது; ராமன், ரங்காச்சார்யா, வசிஷ்டா அனத்யாயம் சொல்லவில்லை, அவர்களுக்குத் தேய் 1 நல்லது.',
  'குரு, சூரியன், சந்திரன் ஜன்ம ராசியிலிருந்து (திரிபல சுத்தி); பொதுச் சந்திர பலம் மேலே தனியாக உள்ளது. "நட்பு ராசி" = BPHS இயற்கை நட்பு (குருவுக்கு சூரியன், சந்திரன், செவ்வாய்; சூரியனுக்கு சந்திரன், செவ்வாய், குரு).',
  '"பாவர்": சூரியன், செவ்வாய், சனி, ராகு, கேது (கேந்திரம், 1, 5, 8 போன்ற தடைகளில்); "பாவர் 3, 6, 11-ல்" — சூரியன், செவ்வாய், சனி, குறிக்கப்படும் (கிரகப்பிரவேசம் போல); "பாவருடன் சேர்க்கை" — சூரியன், செவ்வாய், சனி (மு.சி. ஸ்லோ.52 குரு, சுக்கிரன், சந்திரனுக்கு இவை மூன்றையே சொல்கிறது; அகர்வாலும்). "சுபர்": புதன், குரு, சுக்கிரன். "கிரகம் இல்லாமல்" (8-ஆம் இடம்) — ராகு, கேது உட்பட.',
  'ஸ்ரீதரின் நவாம்சப் பட்டியல் "(2,3,7,9,12)" கன்னியை விடுகிறது; புதன் நவாம்சம் "clever" என்று அவரே சொல்வதால் கன்னியும் சுபர் நவாம்சமாகக் கணிக்கப்படுகிறது (எங்கள் வாசிப்பு). அவரது "பாவர் 1, 6, 8, 12-ல் குருவை அழிக்கும்" — "பாவர் 3, 6, 11-ல்" என்ற விதியுடன் முரண்படுவதால் 6 விடப்பட்டது.',
]);

const EVENTS = deepFreeze({ order: ['GRIHA_PRAVESHA', 'UPANAYANA'], GRIHA_PRAVESHA, UPANAYANA });

module.exports = {
  EVENTS, DOORS, MONTH_TA, RANK, SOURCES, CODE_TA, NOTES_TA: deepFreeze({ ...NOTES_TA, UPANAYANA: NOTES_UPANAYANA_TA }),
  DHRUVA, MRIDU, bothPakshas, UPANAYANA_YEARS, SIXTEEN, ANADHYAYA, ANADHYAYA_MONTH, GALAGRAHA, YOGAS_SHRIDHAR, BENEFIC_PLANET_NAVS,
};
