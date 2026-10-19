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

// ---------------------------------------------------------------------------
// Travel (yatra), added 2026-10-13
// ---------------------------------------------------------------------------

/**
 * The eight directions, clockwise from the east. A rule the books give for four directions holds
 * for the corner after each too (Shridhar p.613: "east direction includes east to south-east"):
 * `four` spreads it.
 */
const DIRECTIONS = deepFreeze({
  order: ['E', 'SE', 'S', 'SW', 'W', 'NW', 'N', 'NE'],
  ta: { E: 'கிழக்கு', SE: 'தென்கிழக்கு', S: 'தெற்கு', SW: 'தென்மேற்கு', W: 'மேற்கு', NW: 'வடமேற்கு', N: 'வடக்கு', NE: 'வடகிழக்கு' },
});
const four = (m) => ({ E: m.E, SE: m.E, S: m.S, SW: m.S, W: m.W, NW: m.W, N: m.N, NE: m.N });

/** Tithi Shoola and the Yogini's place (Muhurta Chintamani XI.34): tithis within the paksha, 15 the full Moon, 30 the new. */
const TITHI_DIR8 = deepFreeze({ E: [1, 9], SE: [3, 11], S: [5, 13], SW: [4, 12], W: [6, 14], NW: [7, 15], N: [2, 10], NE: [8, 30] });
/** Kalaprakasika's Yogini (Wilhelm's table): tithis 1-30, different in the two pakshas; the 9th, 10th of each are sky and earth. */
const YOGINI_KP = deepFreeze({ E: [1, 11, 21], SE: [3, 13, 23], S: [5, 15, 25], SW: [4, 14, 24], W: [6, 16, 26], NW: [7, 17, 27], N: [2, 12, 22], NE: [8, 18, 28] });
const NAK_SHOOLA_MC = deepFreeze(four({ E: [17], S: [24], W: [3], N: [11] }));
const NAK_SHOOLA_WILHELM = deepFreeze({ E: [17, 20, 21], SE: [17, 24], S: [0, 3, 9, 25], SW: [11, 24], W: [3, 7], NW: [12, 3], N: [12, 11, 21], NE: [0, 11] });
const VAAR_SHOOLA = deepFreeze(four({ E: [1, 6], S: [4], W: [0, 5], N: [2, 3] }));
const VAAR_SHOOLA_JOSHI = deepFreeze({ E: [1, 6], SE: [1, 4], S: [4], SW: [0, 5], W: [0, 5], NW: [2], N: [2, 3], NE: [6, 3] });
const VAAR_SHOOLA_KR = deepFreeze({ E: [1, 6], SE: [1, 2], S: [4], SW: [0, 5], W: [5, 0], NW: [2], N: [2, 3], NE: [3, 6] });
const VAAR_SHOOLA_VASHISTHA = deepFreeze(four({ E: [6, 1], S: [4], W: [5], N: [2, 3] }));
const KONA_SHOOLA = deepFreeze({ SE: [1, 4], SW: [5, 0], NW: [2], NE: [3, 6] });
const KANTAKA = deepFreeze({ SE: [2], SW: [3], NW: [6] });
/** The ghatis after sunrise when the Vaar Shoola lifts, by weekday (0 = Sunday). */
const RELEASE_KP = deepFreeze({ 1: 8, 6: 8, 4: 22, 0: 15, 5: 15, 2: 12, 3: 12 });
const RELEASE_SHRIDHAR = deepFreeze({ 0: 12, 1: 20, 2: 16, 3: 16, 4: 8, 5: 12, 6: 20 });
const RELEASE_RANGACHARYA = deepFreeze({ 4: 22, 2: 12, 3: 12, 0: 15, 1: 8, 6: 8 });
/** The direction lords in the houses that form Lalatika: [planet, houses]. */
const LALATIKA = deepFreeze({ E: ['Sun', [1]], SE: ['Venus', [11, 12]], S: ['Mars', [10]], SW: ['Rahu', [8, 9]], W: ['Saturn', [7]], NW: ['Moon', [5, 6]], N: ['Mercury', [4]], NE: ['Jupiter', [2, 3]] });
const LALATIKA_KR = deepFreeze({ ...LALATIKA, W: ['Mercury', [7]], NE: ['Jupiter', [2]] });
/** The stars after whose first ghatis (of 60) a journey may be made in need (Muhurta Chintamani XI.12). */
const NAK_AFTER_MC = deepFreeze({ 10: 16, 19: 16, 24: 16, 2: 21, 9: 11, 1: 7, 14: 14, 15: 14, 17: 14, 8: 14 });
/** Kaala Shoola (MC XI.11): the stars to leave in each third of the day and of the night; four are good at all times. */
const KAAL_SHOOLA = deepFreeze({
  day: [[3, 11, 20, 25, 15, 2], [18, 17, 5, 8], [12, 0, 7, 'ABHIJIT']],
  night: [[4, 26, 13, 16], [10, 19, 24, 1, 9], [14, 6, 21, 22, 23]],
  always: [21, 12, 7, 4],
});
const KAAL_SHOOLA_WILHELM = deepFreeze({
  day: [[2, 3, 5, 8, 11, 15, 17, 20, 25], [5, 8, 17, 18], [0, 2, 7, 12, 14]],
  night: [[4, 13, 16, 26, 12, 21], [1, 9, 10, 19, 24, 12, 21, 26], [6, 14, 22, 23, 12, 21, 26]],
  always: [],
});
/** Ghaata (by the birth Moon's sign, 0 = Aries): the star, the tithi class (0 Nanda … 4 Poorna), weekday, lagna, the Moon's sign, pada (0-107), lunar month. */
const GHATA = deepFreeze({
  nak: [9, 12, 14, 16, 18, 21, 23, 26, 1, 3, 5, 8],
  tithiClass: [0, 4, 1, 1, 2, 4, 3, 0, 2, 3, 2, 4],
  vara: [0, 6, 1, 3, 6, 6, 4, 5, 5, 2, 4, 5],
  lagna: [0, 1, 3, 6, 9, 11, 5, 7, 8, 10, 2, 4],
  lagnaRangacharya: [0, 2, 5, 9, 0, 4, 11, 2, 4, 7, 0, 3],
  moon: [0, 5, 10, 4, 9, 2, 8, 1, 11, 4, 8, 10],
  padaWilhelm: [8, 37, 94, 38, 88, 22, 73, 15, 98, 39, 75, 98],
  padaKR: [8, 53, 94, 38, 88, 22, 73, 15, 98, 39, 75, 98],
  padaVashistha: [8, 53, 94, 39, 88, 22, 73, 15, 99, 39, 75, 98],
  monthShridhar: [7, 8, 3, 9, 2, 5, 10, 6, 4, 1, 0, 11],
  monthKR: [7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6],
});
/** Vashistha's lagnas to leave in each tithi class (0 Nanda … 4 Poorna), signs 0 = Aries. */
const LAGNA_TITHI_VASHISTHA = deepFreeze([[4, 6, 7, 9], [8, 11], [2, 5], [0, 3], [1, 10]]);
const TARA_1357 = Object.freeze([1, 3, 5, 7, 10, 12, 14, 16, 19, 21, 23, 25]);
const TRAVEL_GOOD_9 = Object.freeze([0, 4, 6, 7, 12, 16, 21, 22, 26]);
const BENEFIC_PLACES = Object.freeze([1, 4, 7, 10, 5, 9]);
const MALEFIC_PLACES = Object.freeze([3, 6, 10, 11]);
const HOUSES_MC56 = deepFreeze([[['Moon'], [1, 12, 6, 8]], [['Saturn'], [10]], [['Venus'], [7]], [['LAGNA_LORD'], [7, 12, 6, 8]]]);
const tithiBoth = (ns) => bothPakshas(ns).filter((t) => t !== 15);

/**
 * Travel's rules beyond the other events': the direction rules run only with a direction.
 * nakAfter { star: ghatis }: the star rejects in its first ghatis, is middling after; tithiNot: with
 * it, a tithi neither good nor bad is middling; pada1Mid, krishnaMid, sunMidThird (the middle third of
 * Cancer and Leo), sankranti, yogaHalfNot (54 halves: 36 = Parigha's first), ghata { month, tithi,
 * nak, pada, moon, vara, lagna }, holanta (Phalguna's bright half), weakMoon (Krishna 10 – Shukla 5);
 * direction: tithiShoola, tithiDir (Nanda east …, Rikta and the new Moon any way), yogini { maps,
 * avoid }, nakShoola, vasanta (rules the Sun in Pisces or Aries lifts), chandraDir (the Moon's sign's
 * quarter: 4 behind, 6 on the left), parigha { free }, venus { rising, sphere, star }, rahuPaksha
 * ('MID' | 'REJECT' for Kartari and Grasta), panchakaSouth, mahadala; per lagna stretch: vaarShoola
 * [{ map, release }], varaUpachaya, kaalaPasha, ayana, kaalShoola, abhijitSouth, digdwarLagna { left },
 * lalatika, chandraKantaka, planetFront, vaarRahu, venusWeak, marsMercWeak, retroKendra, varaLordRetro,
 * varaLordSet, lagnaLordRetro, moonConj, moonNatal, lagnaNatal, lagnaBirth, lordsInLagna, kendras,
 * navNot, nakVara, sarvanka, trianka, panchaka9 { reject, mid }, jupVenLagna, lagnaTithi.
 * `secondary`: the codes the book itself puts after its main rules — marked, not rejecting.
 */
const TRAVEL = deepFreeze({
  labelTa: 'பயணம் (யாத்திரை)',
  default: 'SHRIDHAR',
  order: ['SHRIDHAR', 'MUHURTA_CHINTAMANI', 'WILHELM', 'JOSHI', 'KALYANRAMAN', 'RAMAN', 'RANGACHARYA', 'VASHISTHA', 'AGARWAL'],
  SHRIDHAR: {
    labelTa: 'ஸ்ரீதர் அத்.23', booksTa: 'ஸ்ரீதர் (மு.சி., K.P., J.V., பிருஹஸ்பதி மேற்கோள்கள்)',
    nak: { good: TRAVEL_GOOD_9, mid: [3, 11, 20, 25, 18, 23] }, nakAfter: NAK_AFTER_MC, digdwar: false,
    tithi: [1, ...tithiBoth([2, 3, 5, 10, 11, 13])], tithiNot: tithiBoth([4, 6, 9, 12, 14]),
    vara: { good: [3, 4, 5], mid: [2] }, taraNot: TARA_1357, vishti: true,
    sunSign: { good: [0, 4, 8], mid: [1, 2, 5, 6, 9, 10, 11] }, sunMidThird: true,
    ghata: { month: GHATA.monthShridhar, tithi: true, nak: GHATA.nak, vara: GHATA.vara, lagna: GHATA.lagna },
    tithiShoola: TITHI_DIR8, tithiDir: true, nakShoola: NAK_SHOOLA_MC,
    vaarShoola: [{ map: VAAR_SHOOLA, release: RELEASE_SHRIDHAR }, { map: KONA_SHOOLA }],
    yogini: { maps: ['MC'], avoid: [0, 2] }, chandraDir: [4, 6], parigha: { free: [0, 7, 12, 16, 4, 21, 22, 26] },
    venus: { rising: 'PRINTED' }, planetFront: ['Mercury', 'Mars'], venusWeak: { enemy: true },
    rahuPaksha: 'MID', panchakaSouth: true, abhijitSouth: true, kaalaPasha: true, ayana: true, kaalShoola: KAAL_SHOOLA,
    lagna: { good: [2, 4, 5, 6, 7], mid: [] }, navNot: [10, 11], digdwarLagna: { left: 'MID' }, lalatika: LALATIKA,
    notIn: HOUSES_MC56, lordsInLagna: [6, 8], retroKendra: true, varaLordRetro: true, varaLordSet: true,
    lagnaBirth: { houses: [6], from: 'EITHER' }, lagnaNatal: true, moonNatal: true, kendras: true,
    beneficIn: BENEFIC_PLACES, maleficIn: MALEFIC_PLACES,
    secondary: ['SUN_SIGN', 'SUN_MID_THIRD', 'GHATA_MONTH', 'KAALA_PASHA', 'AYANA', 'KAAL_SHOOLA', 'VARA_LORD_SET', 'KENDRA_NO_BENEFIC', 'KENDRA_MALEFIC'],
    linesTa: [
      'அவரது தோல்விப் பட்டியல் (ப.616) விலக்குகிறது; அத்தியாயத்தின் மற்ற விதிகள் (சௌர மாதம், காத மாதம், காலம்-பாசம், அயனம், நட்சத்திர கால சூலம், கேந்திரத்தில் சுபர், கிழமை அதிபதி அஸ்தங்கம்) குறிக்கப்படும் (எங்கள் வாசிப்பு)',
      'நட்சத்திரம்: அசுவினி, புனர்பூசம், அனுஷம், மிருகசீரிடம், பூசம், அஸ்தம், திருவோணம், அவிட்டம், ரேவதி; ரோகிணி, மூன்று உத்திரம், மூலம், சதயம் நடுத்தரம் · பரணி 7, கிருத்திகை 21, மகம் 11, மூன்று பூர்வம் 16, சுவாதி, விசாகம், கேட்டை, ஆயில்யம் 14 நாழிகை கழிந்து (அவசரத்தில்) · சித்திரை, திருவாதிரை கூடாது · ஜன்ம, விபத், பிரத்யக், வதை தாரைகள் மூன்று சுற்றிலும் கூடாது',
      'திதி: வளர் 1; இரு பக்ஷத்திலும் 2, 3, 5, 10, 11, 13 · 6, 12, ரிக்த கூடாது; மற்றவை நடுத்தரம் · கிழமை: புதன், வியாழன், வெள்ளி; செவ்வாய் நடுத்தரம்; ஞாயிறு, திங்கள், சனி கூடாது · விஷ்டி கூடாது',
      'திசை: திதி சூலம் (1, 9 கிழக்கு …), நந்தா கிழக்கு, பத்ரா தெற்கு, ஜயா மேற்கு, பூர்ணா வடக்கு, ரிக்த / அமாவாசை எந்தத் திசையும் · நட்சத்திர சூலம் (கேட்டை கிழக்கு, பூரட்டாதி தெற்கு, ரோகிணி மேற்கு, உத்திரம் வடக்கு) · வார சூலம் (அட்டவணை 23.3, நாழிகை விடுப்புடன்), கோண சூலம் · யோகினி முன்னும் வலமும் கூடாது · சந்திரன் பின்னும் இடமும் கூடாது · பரிக தண்டம் (எட்டு திக்த்வார நட்சத்திரங்களில் விலக்கு) · சுக்கிரன் முன் (உதயம் — அச்சில் உள்ளபடி), புதன் / செவ்வாய் முன் (லக்னத்திலிருந்து வீடு) · பஞ்சகத்திலும் அபிஜித் முகூர்த்தத்திலும் தெற்கு கூடாது',
      'ராகு: சந்திரன் மிருத பக்ஷத்தில் கூடாது; கர்த்தரி, கிரஸ்தம் நடுத்தரம் · காத திதி, கிழமை, நட்சத்திரம், லக்னம் கூடாது (நட்சத்திரம், லக்னம் — மு.சி. அட்டவணை; அவர் அத்.9-க்குக் குறிப்பிடுகிறார்)',
      'லக்னம்: மிதுனம், சிம்மம், கன்னி, துலாம், விருச்சிகம் (பிருஷ்டோதயமும் கும்பம், மீனமும் இல்லை) · கும்ப, மீன நவாம்சம் கூடாது · திக்த்வார லக்னம் பின்னால் கூடாது, இடம் நடுத்தரம் · லலாடிக யோகம் · சந்திரன் 1, 12, 6, 8; சனி 10; சுக்கிரன் 7; லக்னாதிபதி 7, 12, 6, 8 கூடாது · 6, 8-ஆம் அதிபதி லக்னத்தில், வக்ர கிரகம் கேந்திரத்தில், வக்ரக் கிழமை அதிபதி கூடாது · பிறப்பிலிருந்து 6-ஆம் ராசி, ஜன்ம லக்னம், ஜன்ம ராசியில் சந்திரன் கூடாது',
    ],
  },
  MUHURTA_CHINTAMANI: {
    labelTa: 'முகூர்த்த சிந்தாமணி அத்.11', booksTa: 'முகூர்த்த சிந்தாமணி ஸ்லோ.8-56',
    nak: { good: TRAVEL_GOOD_9, mid: [] }, nakAfter: NAK_AFTER_MC, digdwar: false,
    tithi: [2, 3, 5, 7, 10, 11, 13, 16, 17, 18, 20, 22, 25, 26, 28], taraNot: TARA_1357,
    sunSign: { good: [8, 0, 4], mid: [9, 10, 2, 5, 1, 6, 3, 11, 7] },
    nakShoola: NAK_SHOOLA_MC, vaarShoola: [{ map: VAAR_SHOOLA }], kaalShoola: KAAL_SHOOLA,
    rahuPaksha: 'MID', sarvanka: true, mahadala: true,
    ghata: { tithi: true, nak: GHATA.nak, vara: GHATA.vara, lagna: GHATA.lagna },
    yogini: { maps: ['MC'], avoid: [0, 6] }, kaalaPasha: true, parigha: { free: [16, 12, 7, 0] },
    retroKendra: true, varaLordRetro: true, ayana: true,
    venus: { rising: 'RISING', sphere: true, star: true }, venusWeak: {},
    lagna: { good: range(0, 9), mid: [] }, navNot: [10, 11], digdwarLagna: {}, lalatika: LALATIKA,
    notIn: HOUSES_MC56, abhijitSouth: true, beneficIn: BENEFIC_PLACES, maleficIn: MALEFIC_PLACES,
    secondary: ['VENUS_WEAK'],
    linesTa: [
      'நட்சத்திரம் (ஸ்லோ.9): அசுவினி, புனர்பூசம், அனுஷம், மிருகசீரிடம், பூசம், ரேவதி, அஸ்தம், திருவோணம், அவிட்டம் · மற்றவை கூடாது; மூன்று பூர்வம் 16, கிருத்திகை 21, மகம் 11, பரணி 7, சுவாதி, விசாகம், கேட்டை, ஆயில்யம் 14 நாழிகை கழிந்து — தேவையெனில் (ஸ்லோ.12) · ஜன்ம ராசியிலிருந்து (நட்சத்திரம்) 1, 3, 5, 7 தாரைகள் மூன்று சுற்றிலும் கூடாது (ஸ்லோ.8)',
      'திதி (ஸ்லோ.9): 6, 12, 8, வளர் 1, அமாவாசை, பௌர்ணமி, ரிக்த கூடாது · சூரியன் தனுசு, மேஷம், சிம்மம் நல்லது; கடகம், மீனம், விருச்சிகம் — நீண்ட பயணம் (குறிக்கப்படும்); மற்றவை நடுத்தரம்',
      'திசை: வார சூலம், நட்சத்திர சூலம் (ஸ்லோ.10) · யோகினி முன்னும் இடமும் கூடாது (ஸ்லோ.34) · காலம், பாசம் முன்னால் கூடாது (ஸ்லோ.35) · பரிக தண்டம் (ஸ்லோ.36; அனுஷம், அஸ்தம், பூசம், அசுவினியில் எல்லாத் திசையும் — ஸ்லோ.38) · அயனம் (ஸ்லோ.39) · சுக்கிரன் முன் மூன்று வழியில் — உதயம், கோளம் (மேஷம்–கன்னி வடக்கு), நட்சத்திரம் (ஸ்லோ.40); சந்திரன் ரேவதி முதல் கிருத்திகை 1-ஆம் பாதம் வரை சுக்கிரன் குருடு (ஸ்லோ.42) · அபிஜித்தில் தெற்கு கூடாது (ஸ்லோ.54)',
      'நட்சத்திர கால சூலம் (ஸ்லோ.11) · ராகு: சந்திரன் மிருத பக்ஷத்தில் கூடாது, கிரஸ்தம் / கர்த்தரி நடுத்தரம் (ஸ்லோ.14-15) · சர்வாங்கம் — திதி + கிழமை + நட்சத்திரம் 7, 8, 3-ஆல் மீதியின்றி வகுபட்டால் கூடாது (ஸ்லோ.24) · மகாதளம், பிரமம் — சூரிய நட்சத்திரத்திலிருந்து சந்திரன் 7-ஆல் மீதி 2, 0, 3, 6 (ஸ்லோ.25) · காத திதி, கிழமை, நட்சத்திரம், லக்னம் (ஸ்லோ.30-33; காத சந்திரனும் பாதமும் போர், அரசு சேவை, சண்டைக்கு மட்டும்)',
      'லக்னம்: கும்பம், மீனம், அவற்றின் நவாம்சம் கூடாது (ஸ்லோ.43-44) · திக்த்வாரத்துக்கு எதிர் லக்னம் கூடாது (ஸ்லோ.47) · லலாடிக யோகம் (ஸ்லோ.51) · வக்ர கிரகம் கேந்திரத்தில், வக்ர கிரகத்தின் கிழமை கூடாது (ஸ்லோ.38) · சந்திரன் 1, 12, 6, 8; சனி 10; சுக்கிரன் 7; லக்னாதிபதி 7, 12, 6, 8 கூடாது; சுபர் கேந்திர கோணத்தில், பாவர் 3, 11, 6, 10-ல் நல்லது (ஸ்லோ.56) · சுக்கிரன் வக்ரம், அஸ்தங்கம், நீசம் — போருக்கு (ஸ்லோ.41; குறிக்கப்படும்)',
    ],
  },
  WILHELM: {
    labelTa: 'வில்ஹெல்ம்', booksTa: 'வில்ஹெல்ம் (முகூர்த்த சிந்தாமணி, காலப்பிரகாசிகை, யவனஜாதகம் மேற்கோள்கள்)',
    nak: { good: [0, 4, 7, 12, 16, 21, 22, 26], mid: [3, 6, 11, 13, 18, 20, 23] }, digdwar: false,
    nakAfter: { 2: 21, 1: 7, 9: 14, 10: 16, 19: 16, 24: 16, 14: 14, 8: 14, 15: 14, 5: 14, 17: 14 }, pada1Mid: true, krishnaMid: true,
    tithi: [...tithiBoth([2, 3, 5, 7, 10, 11, 13])], tithiMid: [16], taraNot: TARA_1357,
    vara: { good: [3, 4, 5], mid: [] }, varaUpachaya: { houses: [3, 6, 10, 11], codes: ['VARA', 'VAAR_SHOOLA'] }, varaLordRetro: true, nakVara: [[0, 2], [7, 4], [3, 6]],
    sunSign: { good: [0, 4, 8], mid: [1, 2, 3, 5, 6, 7, 9, 10, 11] }, sunMidThird: true, sankranti: true,
    lagna: { good: [1, 4, 6, 8], mid: [0, 3, 9, 5, 7], natalMoonOk: true }, navGood: BENEFIC_PLANET_NAVS, navNot: [10, 11],
    notIn: [[['Moon'], [1, 4, 6, 8, 12]], [['Saturn'], [10]], [['Venus'], [7]], [['Jupiter'], [3, 7, 8]], [['LAGNA_LORD'], [6, 8, 12, 7]]],
    empty: [12], lordsInLagna: [6], kendras: true, lagnaLordRetro: true, marsMercWeak: true, venusWeak: {}, moonConj: true, moonNatal: true,
    jupVenNotSet: true, beneficIn: BENEFIC_PLACES, maleficIn: MALEFIC_PLACES,
    ayana: true, nakShoola: NAK_SHOOLA_WILHELM, kaalShoola: KAAL_SHOOLA_WILHELM, mahadala: true,
    ghata: { tithi: true, nak: GHATA.nak, pada: GHATA.padaWilhelm, moon: GHATA.moon, vara: GHATA.vara, lagna: GHATA.lagna },
    tithiShoola: TITHI_DIR8, tithiDir: true, vaarShoola: [{ map: VAAR_SHOOLA, release: RELEASE_KP }, { map: KANTAKA }],
    digdwarLagna: {}, lalatika: LALATIKA, chandraKantaka: true, venus: { rising: 'RISING', sphere: true },
    kaalaPasha: true, yogini: { maps: ['KP', 'MC'], avoid: [0, 6] }, panchaka9: { reject: [1, 2, 4, 6, 8], mid: [] }, sarvanka: true, trianka: true,
    secondary: ['AYANA', 'NAK_SHOOLA', 'KAAL_SHOOLA', 'MAHADALA', 'GHATA_TITHI', 'GHATA_NAK', 'GHATA_PADA', 'GHATA_MOON', 'GHATA_VARA', 'GHATA_LAGNA',
      'TITHI_SHOOLA', 'TITHI_DIR', 'VAAR_SHOOLA', 'DIGDWAR_LAGNA', 'LALATIKA', 'CHANDRA_KANTAKA', 'VENUS_FRONT', 'KAALA_PASHA', 'YOGINI',
      'YATRA_PANCHAKA', 'SARVANKA', 'TRIANKA', 'SUN_MID_THIRD', 'JUP_VEN_SET'],
    linesTa: [
      'அவர் (ப.305): இன்றைய சாதாரணப் பயணத்துக்கு அடிப்படை முகூர்த்த அம்சங்களும் வழக்கமான தோஷங்களும் முதன்மை; பயணத்துக்கே உரிய தோஷங்களை முடிந்தவரை — அதனால் அவை குறிக்கப்படும் (திசை, காதம், சூலங்கள், யோகினி, காலம்-பாசம், சுக்கிரன் முன், பஞ்சகம், சர்வாங்கம், த்ரியங்கம், மகாதளம்)',
      'நட்சத்திரம்: அசுவினி, மிருகசீரிடம், பூசம், அஸ்தம், அனுஷம், திருவோணம், அவிட்டம், ரேவதி; ரோகிணி, புனர்பூசம், உத்திரம், சித்திரை, மூலம், உத்திராடம், சதயம் நடுத்தரம் · கிருத்திகை 21, பரணி 7, மகம் 14, மூன்று பூர்வம் 16, சுவாதி, ஆயில்யம், விசாகம், திருவாதிரை, கேட்டை 14 நாழிகை கழிந்து · முதல் பாதம், தேய்பிறை குறிக்கப்படும் · செவ்வாய்–அசுவினி, வியாழன்–பூசம், சனி–ரோகிணி கூடாது · தாரை சாதகமாக',
      'திதி: 2, 3, 5, 7, 10, 11, 13; தேய் 1 நடுத்தரம்; வளர் 1, 4, 6, 8, 9, 12, 14, 15 கூடாது · கிழமை: புதன், வியாழன், வெள்ளி (கிழமை அதிபதி 3, 6, 10, 11-ல் இருந்தால் எந்தக் கிழமையும்); வக்ர கிரகத்தின் கிழமை கூடாது · சங்கிராந்தி கூடாது · சூரியன் மேஷம், சிம்மம், தனுசு நல்லது, மற்றவை நடுத்தரம்; கடக, சிம்ம நடு மூன்றில் ஒன்று குறிக்கப்படும்',
      'லக்னம்: ரிஷபம், சிம்மம், துலாம், தனுசு; மேஷம், கடகம், மகரம், கன்னி, விருச்சிகம் நடுத்தரம்; மிதுனம், கும்பம், மீனம் கூடாது (ஜன்ம ராசி லக்னம் நல்லது) · நவாம்சம்: புதன், குரு, சுக்கிரனுடையது (கும்ப, மீன நவாம்சம் இல்லை) · சந்திரன் 1, 4, 6, 8, 12; சனி 10; சுக்கிரன் 7; குரு 3, 7, 8; லக்னாதிபதி 6, 8, 12, 7 கூடாது · 12 காலி · 6-ஆம் அதிபதி லக்னத்தில் கூடாது · கேந்திரத்தில் சுபர் வேண்டும், பாவர் கூடாது (இரண்டும் — நடுத்தரம்) · லக்னாதிபதி வக்ரம், சுக்கிரன் வக்ரம் / அஸ்தங்கம் / நீசம், செவ்வாய், புதன் வக்ரம் / அஸ்தங்கம் கூடாது · சந்திரன் தனியாக, ஜன்ம லக்ன / ஜன்ம ராசியில் அல்லாமல்',
    ],
  },
  JOSHI: {
    labelTa: 'ஜோஷி', booksTa: 'ஜோஷி (முகூர்த்த சிந்தாமணி, ஜ்யோதிர்விதாபரணம் மேற்கோள்கள்)',
    nak: { good: [12, 0, 7, 4, 26, 16, 6, 21, 22], mid: [11, 20, 25, 3] }, nakAfter: NAK_AFTER_MC, digdwar: false,
    tithi: [...tithiBoth([2, 3, 5, 7, 10, 11, 13]), 16], vishti: true, yogaNot: [16, 26], yogaHalfNot: [36],
    vara: { good: [4, 5], mid: [0, 1, 3] }, vaarShoola: [{ map: VAAR_SHOOLA_JOSHI }], nakShoola: NAK_SHOOLA_MC,
    chandraDir: [4, 6], venus: { rising: 'RISING' }, parigha: { free: [] }, yogini: { maps: ['MC'], avoid: [0, 6] }, rahuPaksha: 'REJECT',
    kaalaPasha: true, ayana: true, kaalShoola: KAAL_SHOOLA, taraNot: TARA_1357, chandra: { good: [3, 6, 10, 11, 1, 7], mid: [2, 5, 9] },
    ghata: { month: GHATA.monthKR, moon: GHATA.moon, vara: GHATA.vara, nak: GHATA.nak, pada: GHATA.padaKR, tithi: true, lagna: GHATA.lagna },
    lagna: { good: range(0, 9), mid: [] }, navNot: [10, 11], digdwarLagna: { left: 'REJECT' },
    notIn: [[['Moon'], [1, 6, 8, 12]], [['Saturn'], [10]], [['Venus'], [7]], [['LAGNA_LORD'], [6, 7, 8, 12]]],
    beneficIn: BENEFIC_PLACES, maleficIn: MALEFIC_PLACES,
    holanta: true, masa: { good: [0, 1, 2, 6, 7, 8, 9, 10, 11], mid: [], strict: true }, jupVenNotSet: true, harishayana: true, weakMoon: true,
    secondary: ['VENUS_FRONT', 'PARIGHA', 'YOGINI', 'RAHU_PAKSHA', 'KAALA_PASHA', 'AYANA', 'KAAL_SHOOLA', 'GHATA_MONTH', 'GHATA_MOON', 'GHATA_VARA',
      'GHATA_NAK', 'GHATA_PADA', 'GHATA_TITHI', 'GHATA_LAGNA', 'HOLANTA', 'MASA', 'JUP_VEN_SET', 'HARISHAYANA', 'WEAK_MOON'],
    linesTa: [
      'அவர் (ப.136): எல்லாவற்றையும் பார்த்தால் "கடைசிப் பயணம்" மட்டுமே — சந்திர / தாரா சுத்தி, முன்னால் சந்திரன், வார / நட்சத்திர சூலம், லக்ன சுத்தி முதன்மை; அவசரத்தில் பஞ்சாங்க சுத்தியும் இவையும் போதும் (ப.130). அதனால் மற்றவை குறிக்கப்படும் (சுக்கிரன் முன், பரிகம், யோகினி, ராகு, காலம்-பாசம், அயனம், கால சூலம், காதம், ஹோலாந்தம்; நீண்ட பயணத்துக்கு — ஆஷாட, ஸ்ராவண, பாத்ரபத மாதங்கள், குரு / சுக்கிரன் அஸ்தங்கம், ஹரிசயனம், தேய் 10 – வளர் 5)',
      'நட்சத்திரம்: அஸ்தம், அசுவினி, பூசம், மிருகசீரிடம், ரேவதி, அனுஷம், புனர்பூசம், திருவோணம், அவிட்டம்; உத்திரம், உத்திராடம், உத்திரட்டாதி, ரோகிணி நடுத்தரம் · மற்றவை கூடாது; அவசரத்தில் மூன்று பூர்வம் 16, பரணி 7, கிருத்திகை 21, மகம் 11, சுவாதி, விசாகம், கேட்டை, ஆயில்யம் 14 நாழிகை கழிந்து · திதி: 2, 3, 5, 7, 10, 11, 13 இரு பக்ஷமும், தேய் 1 · விஷ்டி, வியதீபாதம், வைதிருதி, பரிகத்தின் முதல் பாதி கூடாது · கிழமை: வியாழன், வெள்ளி; ஞாயிறு, திங்கள், புதன் நடுத்தரம்; சனி, செவ்வாய் கூடாது',
      'திசை: வார சூலம் (அட்டவணை 11.2, எட்டு திசை), நட்சத்திர சூலம் · சந்திரன் பின்னும் இடமும் கூடாது (அட்டவணை 11.3) · ஜன்ம நட்சத்திரத்திலிருந்து 1, 3, 5, 7 தாரைகள் (மூன்று சுற்று) கூடாது · சந்திரன் ஜன்ம ராசியிலிருந்து 3, 6, 10, 11, 1, 7 நல்லது, 4, 8, 12 கூடாது, மற்றவை நடுத்தரம்',
      'லக்னம்: கும்பம், மீனம், அவற்றின் நவாம்சம் கூடாது · திசைக்குரிய லக்னம் — சந்திரனைப் போலவே பின்னும் இடமும் கூடாது (அட்டவணை 11.3) · சந்திரன் 1, 6, 8, 12; சனி 10; சுக்கிரன் 7; லக்னாதிபதி 6, 7, 8, 12 கூடாது · சுபர் கேந்திர கோணத்தில், பாவர் 3, 6, 10, 11-ல் (குறிக்கப்படும்)',
    ],
  },
  KALYANRAMAN: {
    labelTa: 'கல்யாணராமன் (தொ.2)', booksTa: 'கல்யாணராமன் (காலப்பிரகாசிகை, முகூர்த்த சிந்தாமணி மேற்கோள்கள்)',
    nak: { good: [16, 0, 22, 12, 4, 6, 7, 26, 21], mid: [11, 20, 25, 3, 18] }, nakAfter: NAK_AFTER_MC, digdwar: false,
    tithi: [...tithiBoth([2, 3, 5, 7, 10, 11, 13]), 16], vishti: true, yogaNot: [16, 26], yogaHalfNot: [36],
    vara: { good: [4, 5], mid: [0, 1, 3, 2, 6] }, taraNot: TARA_1357, chandra: { good: [1, 3, 6, 7, 10, 11], mid: [2, 5, 9] },
    vaarShoola: [{ map: VAAR_SHOOLA_KR, release: RELEASE_KP }, { map: KANTAKA }], nakShoola: NAK_SHOOLA_MC,
    tithiShoola: TITHI_DIR8, tithiDir: true, yogini: { maps: ['MC'], avoid: [0, 6] },
    chandraDir: [4, 6], kaalaPasha: true, kaalShoola: KAAL_SHOOLA, parigha: { free: [] }, venus: { rising: 'RISING' }, rahuPaksha: 'REJECT', ayana: true,
    ghata: { month: GHATA.monthKR, nak: GHATA.nak, pada: GHATA.padaKR, lagna: GHATA.lagna, moon: GHATA.moon, vara: GHATA.vara, tithi: true },
    lagna: { good: range(0, 9).concat([11]), mid: [] }, navNot: [10], digdwarLagna: { left: 'REJECT' }, lalatika: LALATIKA_KR,
    notIn: [[['Moon'], [1, 4, 6, 8, 12]], [['Saturn'], [10]], [['Venus'], [7]], [['LAGNA_LORD'], [6, 7, 8, 12]]],
    beneficIn: BENEFIC_PLACES, maleficIn: MALEFIC_PLACES,
    masa: { good: [0, 1, 2, 6, 7, 8, 9, 10, 11], mid: [], strict: true }, jupVenNotSet: true, holanta: true, harishayana: true, weakMoon: true,
    panchaka9: { reject: [1, 2, 4, 6, 8], mid: [] },
    secondary: ['CHANDRA_DIR', 'KAALA_PASHA', 'KAAL_SHOOLA', 'PARIGHA', 'VENUS_FRONT', 'RAHU_PAKSHA', 'AYANA', 'YOGINI', 'TITHI_SHOOLA', 'TITHI_DIR',
      'GHATA_MONTH', 'GHATA_NAK', 'GHATA_PADA', 'GHATA_LAGNA', 'GHATA_MOON', 'GHATA_VARA', 'GHATA_TITHI', 'DIGDWAR_LAGNA', 'LALATIKA', 'YATRA_PANCHAKA',
      'HARISHAYANA', 'WEAK_MOON'],
    linesTa: [
      'அவர் (ப.204, 211): இன்றைய பயணத்துக்கு விஜய யாத்திரையின் எல்லா விதிகளும் தேவையில்லை — பஞ்சாங்க சுத்தி, திக் சுத்தி, நட்சத்திர சூலம், லக்ன சுத்தி, சந்திர / தாரா பலம் முதன்மை; ஆஷாட, பாத்ரபத, ஸ்ராவண மாதங்கள், குரு / சுக்கிரன் அஸ்தங்கம், பால்குன வளர்பிறை கூடாது; மற்றவை குறிக்கப்படும்',
      'நட்சத்திரம்: அனுஷம், அசுவினி, அவிட்டம், அஸ்தம், மிருகசீரிடம், புனர்பூசம், பூசம், ரேவதி, திருவோணம்; உத்திரம், உத்திராடம், உத்திரட்டாதி, ரோகிணி நடுத்தரம் (மூலம் — "சிறந்தது" என்ற குறிப்பு; நடுத்தரம், எங்கள் வாசிப்பு) · மற்றவை கூடாது; மூன்று பூர்வம் 16, கிருத்திகை 21, மகம் 11, பரணி 7, சுவாதி, விசாகம், கேட்டை, ஆயில்யம் 14 நாழிகை கழிந்து · திதி: 2, 3, 5, 7, 10, 11, 13 இரு பக்ஷமும், தேய் 1 · விஷ்டி, வியதீபாதம், வைதிருதி, பரிகத்தின் முதல் பாதி கூடாது · கிழமை: வியாழன், வெள்ளி; மற்றவை நடுத்தரம் ("செவ்வாய், சனியில் பயணமே இல்லை என்பதல்ல")',
      'திசை: வார சூலம் (முகூர்த்த சிந்தாமணி அட்டவணை, எட்டு திசை; காலப்பிரகாசிகை நாழிகை விடுப்பு), வார கண்டகம், நட்சத்திர சூலம் · திதி சூலம், திதி வகை, யோகினி (முன், இடம்), சந்திர நிவாசம், காலம்-பாசம், கால சூலம், பரிகம், சுக்கிரன் முன், ராகு (மிருத, கிரஸ்த, கர்த்தரி), அயனம் — குறிக்கப்படும் · ஜன்ம நட்சத்திரத்திலிருந்து 1, 3, 5, 7 தாரைகள்; சந்திரன் 1, 3, 6, 7, 10, 11 நல்லது, 4, 8, 12 கூடாது (அஷ்டம ராசி "எப்போதும்")',
      'லக்னம்: கும்ப லக்னமும் நவாம்சமும் "எப்போதும்" கூடாது · சந்திரன் 1, 4, 6, 8, 12; சனி 10; சுக்கிரன் 7; லக்னாதிபதி 6, 7, 8, 12 கூடாது · திசைக்குரிய லக்னம், லலாடிகம் (அச்சில்: மேற்கு — 7-ல் புதன், வடகிழக்கு — 2-ல் குரு), காத அட்டவணை, யாத்திரா பஞ்சகம் குறிக்கப்படும்',
    ],
  },
  RAMAN: {
    labelTa: 'ராமன்', booksTa: 'ராமன்',
    nak: { good: [4, 0, 7, 6, 12, 16, 21, 18, 22, 26], mid: [3, 11, 20, 25, 13, 17, 23] }, digdwar: false,
    nakAfter: { 8: 14, 15: 14, 10: 16, 24: 16, 9: 14, 19: 16, 14: 14 }, pada1Mid: true,
    tithi: tithiBoth([2, 3, 5, 7, 10, 11, 13]), tithiNot: [14, 29, 15, 30], taraNot: [1],
    vara: { good: [0, 1, 3, 4, 5, 6], mid: [2] }, vaarShoola: [{ map: VAAR_SHOOLA, release: RELEASE_KP }],
    lagna: { good: [0, 1, 3, 4, 6, 8], mid: [], natalMoonOk: true }, lagnaBirth: { houses: [1, 5, 7, 9], from: 'LAGNA' }, jupVenLagna: true,
    sankranti: true, panchaka9: { reject: [6], mid: [1, 2, 8] }, panchakaSouth: true,
    linesTa: [
      'நட்சத்திரம்: மிருகசீரிடம், அசுவினி, பூசம், புனர்பூசம், அஸ்தம், அனுஷம், திருவோணம், மூலம், அவிட்டம், ரேவதி (முதல் பாதம் முடிந்தவரை தவிர் — குறிக்கப்படும்) · பரணி, கிருத்திகை எப்போதும் கூடாது; திருவாதிரை கூடாது; ஆயில்யம், விசாகம், மகம், சுவாதி 14, பூரம், பூராடம், பூரட்டாதி 16 நாழிகை கழிந்து · மற்றவை சொல்லப்படவில்லை — நடுத்தரம் (எங்கள் வாசிப்பு) · ஜன்ம நட்சத்திரம் பயணத்துக்குக் கூடாது (PDF ப.8)',
      'திதி: 2, 3, 5, 7, 10, 11, 13 நல்லவை; 14, பௌர்ணமி, அமாவாசை "எந்த விலையிலும்" கூடாது; மற்றவை நடுத்தரம் · வார சூலம் (நாழிகை விடுப்புடன்); செவ்வாய் முடிந்தவரை தவிர் · சூரியன் ராசி மாறும் நாள் கூடாது',
      'லக்னம்: மேஷம், ரிஷபம், கடகம், சிம்மம், துலாம், தனுசு; ஜன்ம ராசி லக்னம் மிக நல்லது · ஜன்ம லக்னமும் அதிலிருந்து 5, 7, 9-ஆம் ராசியும் கூடாது · லக்னத்தில் குரு அல்லது சுக்கிரன் — நல்லது (குறிக்கப்படும்)',
      'பஞ்சகம் (PDF ப.8): திதி + கிழமை + நட்சத்திரம் + லக்னம், 9-ஆல் மீதி — பயணத்துக்குச் சோர பஞ்சகம் (6) கூடாது; மிருத்யு, அக்னி, ரோகம் (1, 2, 8) முடிந்தவரை (குறிக்கப்படும்); ராஜ பஞ்சகம் பயணத்துக்குப் பொருட்டல்ல · நட்சத்திர பஞ்சகத்தில் (அவிட்டம் 3-ஆம் பாதம் – ரேவதி) தெற்குப் பயணம் கூடாது (PDF ப.9)',
    ],
  },
  RANGACHARYA: {
    labelTa: 'ரங்காச்சார்யா அத்.VIII', booksTa: 'ரங்காச்சார்யா',
    nak: { good: [0, 4, 6, 7, 12, 16, 21, 22, 26, 17, 18], mid: [3, 10, 19, 24, 23, 11, 20, 25] }, digdwar: false,
    nakAfter: { 1: 7, 2: 21, 8: 11, 14: 14, 15: 14 }, taraNot: [1, 25, 27],
    tithi: [16, ...tithiBoth([2, 3, 5, 7, 10, 13])], tithiNot: [1, ...tithiBoth([4, 6, 8, 9, 12, 14]), 15, 30],
    ghata: { tithi: true, vara: GHATA.vara, nak: GHATA.nak, lagna: GHATA.lagnaRangacharya },
    tithiShoola: four({ E: [1, 9], S: [5, 13], W: [6, 14], N: [2, 10] }),
    vara: { good: [1, 3, 4, 5], mid: [] }, varaUpachaya: { houses: [3, 6, 11], codes: ['VARA'] }, vaarShoola: [{ map: VAAR_SHOOLA, release: RELEASE_RANGACHARYA }],
    kaalShoola: KAAL_SHOOLA, sarvanka: true, abhijitSouth: true,
    lagna: { good: [0, 3, 6, 9, 2, 5, 8], mid: [1, 4, 7] }, navNot: [10, 11],
    notIn: [[['Moon'], [1, 6, 8, 12]], [['Venus'], [7]], [['Saturn'], [10]], [['LAGNA_LORD'], [6, 7, 8, 12]]],
    beneficIn: BENEFIC_PLACES, maleficIn: MALEFIC_PLACES,
    linesTa: [
      'திதி: 2, 3, 5, 7, 10, 13, தேய் 1 நல்லவை; 1, 4, 6, 8, 9, 12, 14, அமாவாசை, பௌர்ணமி கூடாது; 11 சொல்லப்படவில்லை — நடுத்தரம் (எங்கள் வாசிப்பு) · காத திதி கூடாது (முதல் 6 நாழிகைக்குப் பின் ஏற்கலாம் — கணிக்கப்படவில்லை; முழுத் திதியும் விலக்கு) · திதி சூலம் (நான்கு திசை)',
      'கிழமை: திங்கள், புதன், வியாழன், வெள்ளி; சனி, ஞாயிறு, செவ்வாய் கூடாது — அந்தக் கிழமையின் கிரகம் லக்னத்திலிருந்து 3, 6, 11-ல் இருந்தால் ஏற்கலாம் · வார சூலம் (வியாழன் 22, செவ்வாய் / புதன் 12, ஞாயிறு 15, திங்கள் / சனி 8 நாழிகை கழிந்து) · காத கிழமை கூடாது',
      'நட்சத்திரம்: அசுவினி, மிருகசீரிடம், புனர்பூசம், பூசம், அஸ்தம், அனுஷம், திருவோணம், அவிட்டம், ரேவதி, கேட்டை, மூலம் நல்லவை; ரோகிணி, பூரம், பூராடம், பூரட்டாதி, சதயம், உத்திரம், உத்திராடம், உத்திரட்டாதி நடுத்தரம்; சித்திரை, சுவாதி, விசாகம், மகம், ஆயில்யம், கிருத்திகை, திருவாதிரை, பரணி கூடாது (பரணி 7, கிருத்திகை 21, ஆயில்யம் 11, சுவாதி, விசாகம் 14 நாழிகை கழிந்து) · ஜன்ம நட்சத்திரம், 25, 27-ஆவது கூடாது · காத நட்சத்திரம் · நட்சத்திர கால சூலம் · சர்வாங்கம்',
      'லக்னம்: மேஷம், கடகம், துலாம், மகரம், மிதுனம், கன்னி, தனுசு; கும்பம், மீனம், அவற்றின் நவாம்சம் கூடாது; மற்றவை நடுத்தரம் · காத லக்னம் (அவரது அட்டவணை) · அபிஜித் தெற்கு தவிர · சந்திரன் 1, 6, 8, 12; சுக்கிரன் 7; சனி 10; லக்னாதிபதி 6, 7, 8, 12 கூடாது',
    ],
  },
  VASHISTHA: {
    labelTa: 'வசிஷ்டா', booksTa: 'வசிஷ்டா',
    sunSign: { good: [0, 4, 8], mid: [1, 2, 5, 6, 9, 10] }, tithi: [16, 2, 3, 5, 7, 10, 11, 13],
    ayana: true, vasanta: ['AYANA', 'NAK_SHOOLA', 'VAAR_SHOOLA'], nakShoola: four({ E: [17], S: [24], W: [3], N: [1] }), vaarShoola: [{ map: VAAR_SHOOLA_VASHISTHA }],
    kaalShoola: KAAL_SHOOLA, taraNot: TARA_1357,
    ghata: { tithi: true, vara: GHATA.vara, nak: GHATA.nak, moon: GHATA.moon, pada: GHATA.padaVashistha },
    vaarRahu: true, lagnaTithi: LAGNA_TITHI_VASHISTHA,
    linesTa: [
      'சூரியன் மேஷம், சிம்மம், தனுசு சிறந்தது; ரிஷபம், மிதுனம், கன்னி, துலாம், மகரம், கும்பம் நடுத்தரம்; கடகம், விருச்சிகம், மீனம் கூடாது · திதி: தேய் 1, வளர் 2, 3, 5, 7, 10, 11, 13 · நட்சத்திரப் பட்டியல் இல்லை',
      'அயனம்: சூரியனும் சந்திரனும் உத்தராயணத்தில் கிழக்கு, வடக்கு; தட்சிணாயனத்தில் மேற்கு (தெற்கு); வேறுபட்டால் பகல் சூரியனின், இரவு சந்திரனின் · வசந்தத்தில் (சூரியன் மீனம், மேஷம் — எங்கள் வாசிப்பு) நான்கு திசையும் நல்லது, திசை சூலம் இல்லை',
      'திசை சூலம்: கிழக்கு — கேட்டை, சனி, திங்கள்; தெற்கு — பூரட்டாதி, வியாழன்; மேற்கு — ரோகிணி, வெள்ளி; வடக்கு — பரணி (அச்சில் உள்ளபடி), செவ்வாய், புதன் · கால சூலம் (அச்சில் "மிஸ்ர" இரவின் முதல் பகுதிக்கும், "லக்ன நட்சத்திரம்" சூரிய அஸ்தமனத்துக்குப் பின்னும் — மற்ற நூல்களின் மித்ர, லகு வகைகளாகக் கணிக்கப்படுகிறது, எங்கள் வாசிப்பு) · வார ராகு (ஞாயிறு மேற்கு, திங்கள் தென்கிழக்கு, செவ்வாய் வடமேற்கு, புதன் வடக்கு, வியாழன் தெற்கு, வெள்ளி தென்மேற்கு, சனி வடகிழக்கு) கூடாது',
      'ஜன்மத்திலிருந்து 1, 3, 5, 7 தாரைகள் கூடாது · காத திதி, கிழமை, நட்சத்திரம், சந்திரன் (ராசி), பாதம் (கடகம் — மகம் 4, தனுசு — பூரட்டாதி 4: அச்சில் உள்ளபடி) · திதி வகையில் தவிர்க்க வேண்டிய லக்னங்கள் (நந்தா 5, 7, 8, 10; ஜயா 3, 6; பத்ரா 9, 12; ரிக்த 1, 4; பூர்ணா 2, 11 — அச்சில் "பத்ரா 2, 7, 10"; 2, 7, 12 என்று கணிக்கப்படுகிறது)',
    ],
  },
  AGARWAL: {
    labelTa: 'அகர்வால்', booksTa: 'அகர்வால் (மு.சி. 11/39 மேற்கோள்)',
    ayana: true,
    linesTa: [
      '"Journeys" (ப.325): சூரியனும் சந்திரனும் உத்தராயணத்தில் — கிழக்கு, வடக்கு; தட்சிணாயனத்தில் — மேற்கு, தெற்கு; வேறு வேறு அயனத்தில் — பகலில் சூரியனின் திசை, இரவில் சந்திரனின் திசை (மு.சி. 11/39 — மற்ற வாசிப்புகளின் அதே அயன விதி; திசை தேர்ந்தால் மட்டும்)',
      'சௌகடியா — பகலையும் இரவையும் எட்டாகப் பிரித்து, கிழமைவாரி சுப / அசுபப் பகுதிகள், "எந்தச் சுப காரியத்துக்கும், குறிப்பாகப் பயணத்துக்கு" — கணிக்கப்படவில்லை · நட்சத்திரம், திதி, கிழமை — பயணத்துக்குத் தனி விதி இல்லை',
    ],
  },
});

// ---------------------------------------------------------------------------
// Vidyarambha (Aksharabhyasa — a child's first letters), added 2026-10-13
// ---------------------------------------------------------------------------

/** MC V.37's ten stars: the three small (Hasta, Ashwini, Pushya), Shravana, Swati, Revati, Punarvasu, Ardra, Chitra, Anuradha. */
const AKSHARA_10 = Object.freeze([12, 0, 7, 21, 14, 26, 6, 5, 13, 16]);
/** "Lagnas of benefics leaving movable rashis" (MC V.37 "चरोनसत्तनौ"): Taurus, Gemini, Virgo, Sagittarius, Pisces. */
const AKSHARA_LAGNAS = Object.freeze([1, 2, 5, 8, 11]);
const NOT_AQUARIUS = Object.freeze([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11]);
const MOVABLE_SIGNS = Object.freeze([0, 3, 6, 9]);
const DUAL_SIGNS = Object.freeze([2, 5, 8, 11]);

/**
 * Vidyarambha's rules beyond the other events': abhijitOk (the Moon in Abhijit passes the star rule),
 * karanaFixed (the fixed karanas), vijayadashami (Ashvin Shukla 10: nothing else need be considered),
 * mercNotSet, sunMarsNav (the Sun or Mars in the lagna's navamsa sign), benHouse { houses, planets }
 * (marked when none of them is there), dayParts.nightOk (the night's thirds allowed).
 */
const VIDYARAMBHA = deepFreeze({
  labelTa: 'வித்யாரம்பம் (அக்ஷராப்யாசம்)',
  default: 'KALYANRAMAN',
  order: ['KALYANRAMAN', 'WILHELM', 'VASHISTHA', 'SHRIDHAR', 'AGARWAL', 'JOSHI', 'MUHURTA_CHINTAMANI', 'RAMAN', 'RANGACHARYA'],
  ageTa: 'வயது: 5-ஆம் ஆண்டு (மு.சி., வில்ஹெல்ம் — சௌர ஆண்டு, ஜோஷி, ஸ்ரீதர்); 5-ஆம் ஆண்டின் 5-ஆம் மாதத்தின் 5-ஆம் (ராமன்: 6-ஆம்) நாள் சிறந்தது (ரங்காச்சார்யா, அகர்வால்); கல்யாணராமன் — 3 அல்லது 5-ஆம் ஆண்டு, இரட்டை ஆண்டின் முதல், கடைசி மூன்று மாதமும்; உபநயனத்துக்கு முன். காட்டப்படும், தீர்ப்பில் இல்லை.',
  KALYANRAMAN: {
    labelTa: 'கல்யாணராமன் (தொ.2) — பொதுக் கருத்து', booksTa: 'கல்யாணராமன் (முகூர்த்த சிந்தாமணி, காலவிதானம், காலப்பிரகாசிகை, காலதீபிகை, முகூர்த்தபதவி, மாதவீயம் … தொகுப்பு)',
    nak: { good: [0, 3, 4, 5, 6, 7, 8, 10, 12, 13, 14, 18, 19, 21, 22, 23, 24], mid: [] }, abhijitOk: true, digdwar: false, taraNot: [1],
    tithi: tithiBoth([2, 3, 5, 6, 10, 11, 12]),
    vara: { good: [3, 4, 5], mid: [0] }, yogaNot: YOGAS_SHRIDHAR, vishti: true, karanaFixed: true,
    uttarayana: 'PREFERRED', sunSign: { good: NOT_AQUARIUS, mid: [] }, harishayana: true,
    lagna: { good: MOVABLE_SIGNS, mid: DUAL_SIGNS }, empty: [8], notIn: [[M5, [2, 5]]],
    beneficIn: BENEFIC_PLACES, maleficIn: [3, 6, 11], benHouse: { houses: [9], planets: BEN3 },
    jupVenNotSet: true, mercNotSet: true, dayParts: { good: [1, 2, 3], mid: [], nightOk: [3] }, vijayadashami: true,
    secondary: ['HARISHAYANA'],
    linesTa: [
      'அவரது அட்டவணையும் "பொதுவாக" என்ற வரிகளும் (பக்.94-101): நட்சத்திரம் 18 (அபிஜித் உட்பட) — அசுவினி, ரோகிணி, மிருகசீரிடம், திருவாதிரை, புனர்பூசம், பூசம், ஆயில்யம், பூரம், அஸ்தம், சித்திரை, சுவாதி, மூலம், பூராடம், திருவோணம், அவிட்டம், சதயம், பூரட்டாதி, அபிஜித் · ஜன்ம நட்சத்திரம் கூடாது',
      'திதி: 2, 3, 5, 6, 10, 11, 12 (சித்ர, 1, 7, 8, 13, 15, 30 கூடாது) · கிழமை: "பொதுவாக" திங்கள், செவ்வாய், சனி கூடாது; புதன், வியாழன், வெள்ளி நல்லது; ஞாயிறு — "தயக்கம்" (நடுத்தரம்; அவரது அட்டவணையில் திங்கள் நடுத்தரம்) · தீய யோகங்கள், விஷ்டி, ஸ்திர கரணங்கள் கூடாது',
      'உத்தராயணம் விருப்பம்; கும்ப மாதம் (சூரியன் கும்பத்தில்) கூடாது; ஹரிசயனம் — "சிலர்" (குறிக்கப்படும்) · விஜயதசமி (ஆஸ்வின சுக்ல 10) எனில் "வேறு எதுவும் பார்க்க வேண்டாம்"',
      'லக்னம்: சர ராசிகள் (மேஷம், கடகம், துலாம், மகரம்) நல்லவை; உபய ராசிகள் — சிலர் சிறந்தது, சிலர் நடுத்தரம் (நடுத்தரம்); ஸ்திர ராசிகள் கூடாது · 8 காலி · 2, 5-ல் பாவர் கூடாது · 9-ல் புதன், சுக்கிரன் அல்லது குரு சிறந்தது (குறிக்கப்படும்) · புதன், குரு, சுக்கிரன் அஸ்தங்கம் கூடாது',
      'நேரம்: விடியல் சந்தி, அபராஹ்னம் (பகலின் கடைசி மூன்றில் ஒன்று), மாலைச் சந்தி கூடாது; இரவில் கடைசி மூன்றில் ஒன்று (அபரராத்திரி) மட்டும்',
    ],
  },
  WILHELM: {
    labelTa: 'வில்ஹெல்ம்', booksTa: 'வில்ஹெல்ம் (முகூர்த்த சிந்தாமணி, காலப்பிரகாசிகை மேற்கோள்கள்)',
    uttarayana: 'PREFERRED', sunSign: { good: NOT_AQUARIUS, mid: [] },
    nak: { good: [0, 5, 6, 12, 13, 14, 16, 21, 26], mid: [7] }, digdwar: false,
    tithi: [2, 3, 5, 10, 11, 12, 17, 18, 20], tithiMid: [6, 7, 13],
    galagraha: true, anadhyaya: { tithis: ANADHYAYA, months: ANADHYAYA_MONTH, sankranti: true }, pradosha: true, vishti: true, karanaFixed: true,
    vara: { good: [3, 4, 5], mid: [0, 1] }, lagna: { good: DUAL_SIGNS, mid: MOVABLE_SIGNS }, empty: [8], jupVenNotSet: true,
    dayParts: { good: [1, 2, 3], mid: [] }, benHouse: { houses: [5], planets: BEN3 },
    linesTa: [
      'உத்தராயணம் மிக விருப்பம், கும்ப சௌர மாதம் இல்லாமல் · வளர்பிறை அல்லது தேய்பிறையின் முதல் ஐந்து திதி',
      'நட்சத்திரம்: அசுவினி, திருவாதிரை, புனர்பூசம், அஸ்தம், சித்திரை, சுவாதி, அனுஷம், திருவோணம், ரேவதி; பூசம் நடுத்தரம் (மு.சி.) · ஜன்ம நட்சத்திரமும் 10-வதும் இந்தச் சடங்குக்கு நல்லவை (பக்கத்தின் பொதுத் தாரா பலத்தில் இந்த விலக்கு இல்லை)',
      'திதி: 2, 3, 5, 10, 11, 12; 7, 13 (காலப்பிரகாசிகை), 6 (மு.சி.) நடுத்தரம் · கலக்ரஹ, அனத்யாய (1, 8, 14, பௌர்ணமி, அமாவாசை, நான்கு மாதத் திதிகள், சங்கிராந்தி), பிரதோஷம், ஸ்திர கரணங்கள், விஷ்டி கூடாது',
      'கிழமை: புதன், வியாழன், வெள்ளி; திங்கள், ஞாயிறு நடுத்தரம் · லக்னம்: உபய ராசிகள் சிறந்தவை, சர ராசிகள் ஏற்கலாம், ஸ்திர ராசிகள் கூடாது (அவரது முடிவு) · 8 காலி · குரு, சுக்கிரன் பாதிப்பு கூடாது · நண்பகல் சிறந்தது, முற்பகல் நல்லது; பிற்பகல், சந்தி, இரவு கூடாது · 5-ல் புதன், குரு, சுக்கிரன் மிக நல்லது (குறிக்கப்படும்)',
    ],
  },
  VASHISTHA: {
    labelTa: 'வசிஷ்டா', booksTa: 'வசிஷ்டா',
    masa: { good: [10, 11, 0, 1, 2, 3], mid: [], strict: true }, sunSign: { good: [9, 11, 0, 1, 2], mid: [] },
    tithi: [2, 3, 5, 6, 10, 11, 12], vara: { good: [3, 4, 5], mid: [1, 0] },
    nak: { good: [0, 5, 6, 7, 12, 13, 14, 16, 17, 21, 26], mid: [] }, abhijitOk: true, digdwar: false,
    lagna: { good: AKSHARA_LAGNAS, mid: [] }, empty: [8], jupVenNotSet: true,
    linesTa: [
      'மாதம்: உத்தராயண மாதங்கள், கும்ப சங்கிராந்தி தவிர — மாக, பால்குன, சைத்ர, வைசாக, ஜ்யேஷ்ட, ஆஷாட · திதி: வளர் 2, 3, 5, 6, 10, 11, 12',
      'கிழமை: புதன், வியாழன், வெள்ளி சிறந்தவை; திங்கள், ஞாயிறு நடுத்தரம்; சனி, செவ்வாய் கூடாது · நட்சத்திரம்: அசுவினி, திருவாதிரை, புனர்பூசம், பூசம், அஸ்தம், சித்திரை, சுவாதி, அனுஷம், கேட்டை, அபிஜித், திருவோணம், ரேவதி',
      'லக்னம்: 2, 3, 6, 9, 12 (சர லக்னம் இல்லை) · 8 காலி · குரு, சுக்கிரன் அஸ்தங்கம் கூடாது · ஆசிரியர் கிழக்கு, குழந்தை மேற்கு நோக்கி; குழந்தைக்குச் சந்திரன், புதன் பலம் (பொதுச் சந்திர பலம்)',
    ],
  },
  SHRIDHAR: {
    labelTa: 'ஸ்ரீதர் §17.11.1', booksTa: 'ஸ்ரீதர் (மு.சி., மார்க்கண்டேயர், ஆசார்ய ஸ்ரீதர், M.M. மேற்கோள்கள்)',
    tithi: [2, 3, 5, 10, 11, 12], tithiNot: [...tithiBoth([1, 4, 6, 8, 9, 14]), 15, 30],
    vara: { good: [1, 3, 4, 5], mid: [] }, nak: { good: AKSHARA_10, mid: [] }, digdwar: false,
    lagna: { good: [2, 5, 8, 11], mid: [1] }, uttarayana: 'PREFERRED', sunSign: { good: NOT_AQUARIUS, mid: [] },
    sunMarsNav: true, empty: [8],
    linesTa: [
      'திதி: 2, 3, 5, 10, 11, 12 — வளர்பிறையில் (ஆசார்ய ஸ்ரீதர்); 1, 6, 8, 15, ரிக்த கூடாது (மார்க்கண்டேயர்; மு.சி. 6-ஐ ஏற்கிறது); தேய்பிறையின் நல்ல திதிகளும் மற்றவையும் நடுத்தரம் (எங்கள் வாசிப்பு)',
      'கிழமை: திங்கள், புதன், வியாழன், வெள்ளி · நட்சத்திரம்: அஸ்தம், அசுவினி, பூசம், திருவோணம், சுவாதி, ரேவதி, புனர்பூசம், திருவாதிரை, சித்திரை, அனுஷம் (P.K. திருவாதிரையைச் சேர்க்கவில்லை)',
      'லக்னம்: 2, 3, 6, 9, 12-ஆம் ராசிகள்; "ஸ்திர லக்னம் கூடாது" — அதனால் ரிஷபம் நடுத்தரம் (எங்கள் வாசிப்பு) · லக்ன நவாம்சத்தில் சூரியன், செவ்வாய் கூடாது · 8 காலி · உத்தராயணம் நல்லது, கும்பத்தில் சூரியன் இல்லாமல் · சந்திரன், புதன் கோசாரம் சாதகமாக (சந்திரன் — பொதுச் சந்திர பலம்)',
    ],
  },
  AGARWAL: {
    labelTa: 'அகர்வால்', booksTa: 'அகர்வால்',
    uttarayana: 'REQUIRED', masa: { good: range(0, 10), mid: [], strict: true },
    tithi: tithiBoth([2, 3, 5, 6, 10, 11, 12]), vara: { good: [1, 3, 4, 5], mid: [] },
    nak: { good: [12, 0, 7, 14, 6, 21, 26, 13, 16, 17], mid: [] }, abhijitOk: true, digdwar: false,
    lagna: { good: AKSHARA_LAGNAS, mid: [] }, empty: [8], dayParts: { good: [1, 2], mid: [] }, benHouse: { houses: [9], planets: BEN3 },
    linesTa: [
      '5-ஆம் ஆண்டில் உத்தராயணத்தில் (சூரியன் மகரம் – மிதுனம்) · பால்குன மாதம் கூடாது · திதி: 2, 3, 5, 6, 10, 11, 12 · கிழமை: திங்கள், புதன், வியாழன், வெள்ளி',
      'நட்சத்திரம்: க்ஷிப்ர (அஸ்தம், அசுவினி, பூசம், அபிஜித்), சுவாதி, புனர்பூசம், திருவோணம், ரேவதி, சித்திரை, அனுஷம், கேட்டை · லக்னம்: 2, 3, 6, 9, 12 · 8 காலி · முற்பகலில் · 9-ல் புதன், சுக்கிரன், குரு — எல்லாத் தீமையும் நீங்கும் (குறிக்கப்படும்)',
    ],
  },
  JOSHI: {
    labelTa: 'ஜோஷி', booksTa: 'ஜோஷி',
    uttarayana: 'REQUIRED', nak: { good: [0, 6, 7, 12, 13, 14, 16, 17, 21, 26], mid: [] }, abhijitOk: true, digdwar: false,
    tithi: tithiBoth([2, 3, 5, 6, 10, 11, 12]), vara: { good: [1, 3, 4, 5], mid: [] },
    lagna: { good: AKSHARA_LAGNAS, mid: [] }, empty: [8], benHouse: { houses: [7, 10], planets: BEN3 },
    linesTa: [
      '5-ஆம் ஆண்டில், உத்தராயணத்தில் · நட்சத்திரம்: க்ஷிப்ர (அஸ்தம், அசுவினி, பூசம், அபிஜித்), சுவாதி, புனர்பூசம், திருவோணம், ரேவதி, சித்திரை, அனுஷம், கேட்டை · திதி: 2, 3, 5, 6, 10, 11, 12 · கிழமை: திங்கள், புதன், வியாழன், வெள்ளி',
      'லக்னம்: 2, 3, 6, 9, 12 (சுபர் ராசிகள், சர ராசி இல்லாமல்) · 7 அல்லது 10-ல் சுபர் பலமாக (குறிக்கப்படும்) · 8 காலி · சந்திர, தாரா சுத்தி முக்கியம் · ஆசிரியர் கிழக்கு, குழந்தை மேற்கு நோக்கி',
    ],
  },
  MUHURTA_CHINTAMANI: {
    labelTa: 'முகூர்த்த சிந்தாமணி அத்.5', booksTa: 'முகூர்த்த சிந்தாமணி ஸ்லோ.5/37',
    uttarayana: 'REQUIRED', tithi: tithiBoth([11, 12, 10, 2, 6, 5, 3]), nak: { good: AKSHARA_10, mid: [] }, digdwar: false,
    vara: { good: [3, 4, 5], mid: [] }, lagna: { good: AKSHARA_LAGNAS, mid: [] }, empty: [8],
    linesTa: [
      'ஸ்லோ.5/37: "…पञ्चमाब्दके तिथौ शिवार्कदिग्द्विषट्शरत्रिके रवावुदक् …" — 5-ஆம் ஆண்டில், உத்தராயணத்தில் (ஆங்கில மொழிபெயர்ப்பில் விடுபட்டது), திதி 11, 12, 10, 2, 6, 5, 3',
      'நட்சத்திரம்: லகு (அஸ்தம், அசுவினி, பூசம்), திருவோணம், சுவாதி, ரேவதி, புனர்பூசம், திருவாதிரை, சித்திரை, அனுஷம் · "चरोनसत्तनौ" — சுபர் ராசி லக்னம், சர ராசி இல்லாமல் (2, 3, 6, 9, 12) · "सतां दिने" — சுபர் கிழமை: புதன், வியாழன், வெள்ளி (எங்கள் வாசிப்பு; கல்யாணராமன்: "மு.சி. திங்களை ஏற்கவில்லை") · குறிப்பு: 8 காலி (மார்க்கண்டேயர் 6-ஐ விலக்குகிறார் — குறிப்பில் மட்டும்)',
    ],
  },
  RAMAN: {
    labelTa: 'ராமன்', booksTa: 'ராமன்',
    vara: { good: [1, 3, 4, 5], mid: [] }, nak: { good: [0, 6, 5, 12, 13, 14, 21, 26], mid: [] }, digdwar: false,
    lagna: { good: [...MOVABLE_SIGNS, ...DUAL_SIGNS], mid: [] }, empty: [8], dayParts: { good: [1, 2, 3], mid: [4] }, benHouse: { houses: [9], planets: BEN3 },
    linesTa: [
      '5-ஆம் ஆண்டின் 5-ஆம் மாதத்தின் 6-ஆம் நாள் சிறந்தது · கிழமை: திங்கள், புதன், வியாழன், வெள்ளி · நட்சத்திரம்: அசுவினி, புனர்பூசம், திருவாதிரை, அஸ்தம், சித்திரை, சுவாதி, திருவோணம், ரேவதி · திதி சொல்லப்படவில்லை',
      'லக்னம்: சர, உபய ராசிகள் · முற்பகல், நண்பகல் விருப்பம் (பிற்பகல் — குறிக்கப்படும்; இரவு — விலக்கு, எங்கள் வாசிப்பு) · 8 காலி · 9-ல் புதன், சுக்கிரன், குரு — எல்லாத் தீமையும் நீங்கும் (குறிக்கப்படும்)',
    ],
  },
  RANGACHARYA: {
    labelTa: 'ரங்காச்சார்யா', booksTa: 'ரங்காச்சார்யா',
    uttarayana: 'REQUIRED', sunSign: { good: [9, 11, 0, 1, 2], mid: [] }, dayParts: { good: [1, 2, 3], mid: [] }, jupVenNotSet: true,
    tithi: tithiBoth([2, 3, 5, 6, 10, 11, 12]), vara: { good: [1, 3, 4, 5], mid: [] },
    nak: { good: [0, 7, 12, 6, 21, 5, 26, 14, 13, 16], mid: [] }, digdwar: false,
    lagna: { good: MOVABLE_SIGNS, mid: DUAL_SIGNS }, empty: [8], beneficIn: BENEFIC_PLACES, maleficIn: [3, 6, 11], benHouse: { houses: [9], planets: BEN3 },
    linesTa: [
      '5-ஆம் ஆண்டின் 5-ஆம் மாதத்தின் 5-ஆம் நாள் · உத்தராயணத்தில், கும்ப மாதம் தவிர · முற்பகல் அல்லது நண்பகல் · குரு, சுக்கிரன் மௌட்யம் கூடாது',
      'திதி: 2, 3, 5, 6, 10, 11, 12 · கிழமை: திங்கள், புதன், வியாழன், வெள்ளி · நட்சத்திரம்: அசுவினி, பூசம், அஸ்தம், புனர்பூசம், திருவோணம், "மிதுனம்" (அச்சில் — மு.சி.யின் பட்டியலில் அந்த இடத்தில் உள்ள திருவாதிரை, மிதுன ராசியின் நட்சத்திரம், என்று கணிக்கப்படுகிறது), ரேவதி, சுவாதி, சித்திரை, அனுஷம்',
      'லக்னம்: மேஷம், கடகம், துலாம், மகரம்; மிதுனம், கன்னி, தனுசு, மீனம் நடுத்தரம் · 8 காலி · 9-ல் புதன், சுக்கிரன் அல்லது குரு சிறந்தது (குறிக்கப்படும்) · பாவர் 3, 6, 11-ல், சுபர் கேந்திர கோணத்தில் (குறிக்கப்படும்)',
    ],
  },
});

// ---------------------------------------------------------------------------
// Starting education after upanayana (Vidya / Upavidya), added 2026-10-13
// ---------------------------------------------------------------------------

/** MC 5/38's sixteen: Mrigashira, Ardra, Punarvasu; Hasta, Chitra, Swati; Shravana, Dhanishtha, Shatabhisha; Ashwini, Moola, the three Purvas; Pushya, Ashlesha. */
const EDUCATION_16 = Object.freeze([4, 5, 6, 12, 13, 14, 21, 22, 23, 0, 18, 10, 19, 24, 7, 8]);
/** The navamsas of Mars and Saturn (Aries, Scorpio, Capricorn, Aquarius). */
const MARS_SATURN_NAVS = Object.freeze([0, 7, 9, 10]);
/** J.V.'s Matrika chakra (Shridhar): counted from the Sun's star (the 1st), the 1st-7th and 12th-15th are unfavourable. */
const MATRIKA_GOOD = Object.freeze([...range(8, 11), ...range(16, 27)]);

/**
 * Education's rules beyond the other events': matrika (good counts from the Sun's star),
 * lagnaLordBenefic (the lagna's lord Mercury, Jupiter or Venus — marked).
 */
const EDUCATION = deepFreeze({
  labelTa: 'கல்வி தொடக்கம் (உபநயனத்துக்குப் பின்)',
  default: 'WILHELM',
  order: ['WILHELM', 'SHRIDHAR', 'RAMAN', 'KALYANRAMAN', 'JOSHI', 'VASHISTHA', 'MUHURTA_CHINTAMANI', 'RANGACHARYA', 'AGARWAL'],
  ageTa: 'வயது: ஒற்றை ஆண்டுகள் சிறந்தவை; இரட்டை ஆண்டின் முதல், கடைசி மூன்று மாதமும் நல்லவை (வில்ஹெல்ம், ஸ்ரீதர் — J.V., ஜோஷி, கல்யாணராமன்). காட்டப்படும், தீர்ப்பில் இல்லை.',
  WILHELM: {
    labelTa: 'வில்ஹெல்ம் — வித்யா, உபவித்யா', booksTa: 'வில்ஹெல்ம் (காலப்பிரகாசிகை, முகூர்த்த சிந்தாமணி மேற்கோள்கள்)',
    nak: { good: [0, 4, 5, 6, 7, 12, 13, 14, 21, 22, 23], mid: [3, 11, 20, 25, 26, 8, 10, 18, 19, 24] }, digdwar: false,
    tithi: tithiBoth([2, 3, 5, 6, 10, 11]), tithiMid: [...tithiBoth([1, 12])], tithiNot: [...tithiBoth([4, 8, 9, 14]), 15, 30],
    galagraha: true, anadhyaya: { tithis: ANADHYAYA, months: ANADHYAYA_MONTH, sankranti: true }, pradosha: true,
    vara: { good: [0, 3, 4, 5], mid: [] }, lagna: { good: DUAL_SIGNS, mid: MOVABLE_SIGNS }, navNot: MARS_SATURN_NAVS,
    empty: [8], emptyPref: [4], notIn: [[M5, [4]]], beneficIn: BENEFIC_PLACES, maleficIn: [3, 6, 11], jupVenNotSet: true,
    dayParts: { good: [1, 2, 3], mid: [] },
    linesTa: [
      'நட்சத்திரம்: அசுவினி, மிருகசீரிடம், திருவாதிரை, புனர்பூசம், பூசம், அஸ்தம், சித்திரை, சுவாதி, திருவோணம், அவிட்டம், சதயம் சிறந்தவை; ரோகிணி, மூன்று உத்திரம், ரேவதி (காலப்பிரகாசிகை), ஆயில்யம், பூரம், மூலம், பூராடம், பூரட்டாதி (மு.சி.) நடுத்தரம் · ஜன்ம நட்சத்திரமும் 10-வதும் நல்லவை (பொதுத் தாரா பலத்தில் இந்த விலக்கு இல்லை)',
      'திதி: 2, 3, 5, 6, 10, 11; 1 (காலப்பிரகாசிகை), 12 (மு.சி.) நடுத்தரம்; 4, 8, 9, 14, 15 குறிப்பாகக் கூடாது · கலக்ரஹ, அனத்யாய (1, 8, 14, பௌர்ணமி, அமாவாசை, நான்கு மாதத் திதிகள், சங்கிராந்தி), பிரதோஷம் கூடாது',
      'கிழமை: செவ்வாய், சனி, திங்கள் கூடாது (ஞாயிறு — "ஆயுள் வளரும்"; சிலர் "முன்னேற்றம் தடைபடும்") · லக்னம்: உபய ராசிகள் சிறந்தவை, சர ராசிகள் நடுத்தரம், ஸ்திர ராசிகள் கூடாது · செவ்வாய், சனியின் நவாம்சம் கூடாது',
      '8 காலி; 4 காலி — சிலர் (குறிக்கப்படும்); 4-ல் பாவர் "நிச்சயமாகக்" கூடாது · பாவர் 3, 6, 11-ல், சுபர் கேந்திர கோணத்தில் சிறந்தது (குறிக்கப்படும்) · குரு, சுக்கிரன் பாதிப்பு கூடாது · முற்பகல், நண்பகல் சிறந்தவை; பிற்பகல், இரவு கூடாது · சரஸ்வதி / வித்யா யோகங்கள் (கணிக்கப்படவில்லை)',
    ],
  },
  SHRIDHAR: {
    labelTa: 'ஸ்ரீதர் §17.11.2-3', booksTa: 'ஸ்ரீதர் (நிருசிம்மர், ஸ்ரீபதி, K.P., J.V., மு.சி. மேற்கோள்கள்)',
    nak: { good: [4, 5, 6, 7, 12, 13, 14, 21, 22, 23], mid: [0, 3, 10, 19, 24, 8, 9, 15, 16, 17, 18, 26] }, digdwar: false,
    tithi: [2, 3, 5, 10, 11], tithiNot: [...tithiBoth([1, 4, 6, 8, 9, 14]), 15, 30],
    anadhyaya: { tithis: ANADHYAYA, months: ANADHYAYA_MONTH, sankranti: true }, harishayana: true, matrika: MATRIKA_GOOD,
    vara: { good: [3, 4, 5], mid: [0] }, lagna: { good: DUAL_SIGNS, mid: MOVABLE_SIGNS }, navNot: MARS_SATURN_NAVS,
    empty: [8], emptyPref: [4], notIn: [[BEN3, [3, 6, 11]]], beneficIn: BENEFIC_PLACES, maleficIn: [3, 6, 11], jupVenNotSet: true,
    dayParts: { good: [1, 2, 3], mid: [] }, secondary: ['MATRIKA'],
    linesTa: [
      'நட்சத்திரம்: மிருகசீரிடம், திருவாதிரை, புனர்பூசம், பூசம், அஸ்தம், சித்திரை, சுவாதி, திருவோணம், சதயம், அவிட்டம் சிறந்தவை; அசுவினி, ரோகிணி, மூன்று பூர்வம் நடுத்தரம்; பரணி, கிருத்திகை, மூன்று உத்திரம் கூடாது, மற்றவை ஏற்கலாம் (மு.சி. — நடுத்தரம்) · J.V.: சூரியனின் நட்சத்திரத்திலிருந்து 1-7, 12-15 தீயவை (மாத்ருகா சக்கரம் — குறிக்கப்படும்)',
      'திதி: 2, 3, 5, 10, 11 வளர்பிறையில்; 4, 6, 8, 9, பௌர்ணமி, அமாவாசை கூடாது; அனத்யாய திதிகள் கூடாது; படிப்புக்குத் தடையான நேரம் (§17.11.3): 1, 8, 14, அமாவாசை, பௌர்ணமி, சங்கிராந்தி, ஹரிசயனம் · மற்றவை நடுத்தரம் (எங்கள் வாசிப்பு)',
      'கிழமை: புதன், வியாழன், வெள்ளி சிறந்தவை; ஞாயிறு — மு.சி. (நடுத்தரம்); திங்கள் — "பெரும்பாலோர்" விலக்கு; செவ்வாய், சனி, அவற்றின் நவாம்சம் லக்னத்தில் கூடாது · லக்னம்: உபயம் சிறந்தது, சரம் நடுத்தரம், ஸ்திரம் கூடாது (K.P.)',
      'பாவர் 3, 6, 11-ல் மகிழ்ச்சி (குறிக்கப்படும்); சுபர் அங்கே இருந்தால் "நிச்சயமாகத் தடை" · சுபர் கேந்திர கோணத்தில் (குறிக்கப்படும்) · 8 காலி, 4 காலி — சிலர் · குரு, சுக்கிரன் அஸ்தங்கம் கூடாது (J.V.) · முற்பகல், நண்பகல்; பிற்பகல், இரவு கூடாது · சந்திகள், யோகங்கள் — கணிக்கப்படவில்லை',
    ],
  },
  RAMAN: {
    labelTa: 'ராமன் அத்.XI', booksTa: 'ராமன்',
    nak: { good: [4, 5, 6, 7, 12, 13, 14, 21, 22, 23], mid: [0, 3, 11, 20, 26] }, digdwar: false,
    tithi: [16, ...tithiBoth([2, 3, 5, 6, 10, 11])], tithiNot: [...tithiBoth([4, 8, 9, 14]), 15, 30],
    vara: { good: [1, 3, 4, 5], mid: [0] }, lagna: { good: DUAL_SIGNS, mid: MOVABLE_SIGNS }, empty: [8], maleficIn: [3, 6, 11],
    linesTa: [
      '"Elections Pertaining to Education" (PDF ப.39-40): நட்சத்திரம் — மிருகசீரிடம், திருவாதிரை, புனர்பூசம், பூசம், அஸ்தம், சித்திரை, சுவாதி, திருவோணம், அவிட்டம், சதயம் சிறந்தவை; அசுவினி — "சிலர் சிறந்தது", ரோகிணி, உத்திரம், உத்திராடம், ரேவதி — நடுநிலை (நடுத்தரம்); மற்றவை கூடாது',
      'செவ்வாய், சனி "எப்போதும்" கூடாது; ஞாயிறு — மற்றவை நன்றாக இருந்தால் (நடுத்தரம்) · திதி: பிரதமை (தேய்பிறையில் மட்டும்), 2, 3, 5, 6, 10, 11; 4, 8, 9, 14, அமாவாசை, பௌர்ணமி கூடாது; மற்றவை நடுத்தரம் (எங்கள் வாசிப்பு) · லக்னம்: உபயம் சிறந்தது, சரம் சாதாரணம், ஸ்திரம் கூடாது',
      'பாவர் 3, 6, 11-ல் (குறிக்கப்படும்) · 8 காலி · முற்பகல், நண்பகல் சிறந்தவை; புதன் காலை மிகச் சிறந்தது (கணிக்கப்படவில்லை) · சரஸ்வதி, வித்யா யோகங்கள்; பாடவாரி நட்சத்திரங்கள் (வேதம், ஜோதிடம், இலக்கணம், மருத்துவம், இசை) — கணிக்கப்படவில்லை',
    ],
  },
  KALYANRAMAN: {
    labelTa: 'கல்யாணராமன் (தொ.2) — பொதுக் கல்வி', booksTa: 'கல்யாணராமன் (முகூர்த்த சிந்தாமணி, மாதவீயம் … தொகுப்பு)',
    nak: { good: [0, 3, 4, 5, 6, 7, 8, 10, 12, 13, 14, 18, 19, 21, 22, 23, 24], mid: [] }, abhijitOk: true, digdwar: false,
    tithi: tithiBoth([2, 3, 5, 6, 10, 11, 12]), tithiMid: [...tithiBoth([1, 7, 8, 13]), 15],
    vara: { good: [3, 4, 5], mid: [0, 1] }, lagna: { good: MOVABLE_SIGNS, mid: [...DUAL_SIGNS, ...FIXED] },
    empty: [8], beneficIn: BENEFIC_PLACES, maleficIn: [3, 6, 11],
    linesTa: [
      'அட்டவணை (ப.151): நட்சத்திரம் 18 (அபிஜித் உட்பட) — அசுவினி, ரோகிணி, மிருகசீரிடம், திருவாதிரை, புனர்பூசம், பூசம், ஆயில்யம், பூரம், அஸ்தம், சித்திரை, சுவாதி, மூலம், பூராடம், திருவோணம், அவிட்டம், சதயம், பூரட்டாதி, அபிஜித்',
      'திதி: 2, 3, 5, 6, 10, 11, 12; "சிலர்" 1, 7, 8, 13, 15-ம் (நடுத்தரம்) · கிழமை: புதன், வியாழன், வெள்ளி சிறந்தவை; ஞாயிறு, திங்கள் நடுத்தரம்; செவ்வாய் "பொதுவாக" விலக்கு (ப.149)',
      'லக்னம் (ப.100, பொதுக் கல்விக்கு): சர ராசி லக்னம், கேந்திர கோணங்களில் சுபர், 3, 6, 11-ல் பாவர் — நல்லது; மற்ற லக்னங்கள் நடுத்தரம் (எங்கள் வாசிப்பு) · 8 காலி · சந்திர, தாரா சுத்தி (பொது)',
    ],
  },
  JOSHI: {
    labelTa: 'ஜோஷி அத்.8', booksTa: 'ஜோஷி',
    uttarayana: 'PREFERRED', harishayana: true, jupVenNotSet: true,
    nak: { good: [14, 6, 21, 22, 23, 12, 0, 7, 18, 10, 19, 24, 4, 13, 5, 8], mid: [] }, digdwar: false,
    tithi: tithiBoth([2, 3, 5, 6, 10, 11, 12]), vara: { good: [3, 4, 5], mid: [0, 1] },
    lagna: { good: MOVABLE_SIGNS, mid: [] }, empty: [8], beneficIn: BENEFIC_PLACES, maleficIn: [3, 6, 10, 11],
    taraNot: [3, 5, 7, 12, 14, 16, 21, 23, 25], chandra: { good: [1, 2, 3, 5, 6, 7, 9, 10, 11], mid: [] },
    linesTa: [
      'சூரியன் உத்தராயணத்தில் நல்லது (சிலர்: ஹரிசயனம் தவிர முழு ஆண்டும்) · குரு, சுக்கிரன் அஸ்தங்கம் கூடாது',
      'நட்சத்திரம்: சர (சுவாதி, புனர்பூசம், திருவோணம், அவிட்டம், சதயம்), க்ஷிப்ர (அஸ்தம், அசுவினி, பூசம்), மூலம், பூரம், பூராடம், பூரட்டாதி, மிருகசீரிடம், சித்திரை, திருவாதிரை, ஆயில்யம் · திதி: 2, 3, 5, 6, 10, 11, 12 · கிழமை: புதன், வியாழன், வெள்ளி சிறந்தவை; ஞாயிறு, திங்கள் நடுத்தரம்; சனி, செவ்வாய் கூடாது',
      'லக்னம்: சர ராசி, கேந்திர கோணங்களில் சுபர், 3, 6, 10, 11-ல் பாவர் (குறிக்கப்படும்) · 8 காலி · சந்திர சுத்தி (ஜன்ம ராசியிலிருந்து 4, 8, 12 இல்லாமல்), தாரா சுத்தி (3, 5, 7 தாரைகள் இல்லாமல்)',
    ],
  },
  VASHISTHA: {
    labelTa: 'வசிஷ்டா', booksTa: 'வசிஷ்டா',
    uttarayana: 'REQUIRED', masa: { good: range(0, 10), mid: [], strict: true },
    tithi: [2, 3, 5, 7, 10, 11, 13], vara: { good: [0, 3, 4, 5], mid: [] },
    nak: { good: range(0, 26).filter((s) => ![1, 2, 9, 11, 20, 25].includes(s)), mid: [] }, digdwar: false,
    lagna: { good: [1, 4, 7], mid: [] }, beneficIn: BENEFIC_PLACES, maleficIn: [3, 6, 11],
    linesTa: [
      '"Starting main line of education" (ப.84-85): பால்குனம் தவிர உத்தராயண மாதங்கள் · திதி: வளர் 2, 3, 5, 7, 10, 11, 13 · கிழமை: ஞாயிறு, புதன், வியாழன், வெள்ளி',
      'நட்சத்திரம்: 27-ல் பரணி, கிருத்திகை, மகம், மூன்று உத்திரம் மட்டும் கூடாது · லக்னம்: ரிஷபம், சிம்மம், விருச்சிகம் (கும்பம் தவிர ஸ்திர லக்னம்) · சுபர் கேந்திர கோணத்தில், பாவர் 3, 6, 11-ல் (குறிக்கப்படும்)',
    ],
  },
  MUHURTA_CHINTAMANI: {
    labelTa: 'முகூர்த்த சிந்தாமணி அத்.5', booksTa: 'முகூர்த்த சிந்தாமணி ஸ்லோ.5/38',
    nak: { good: EDUCATION_16, mid: [] }, digdwar: false, tithi: tithiBoth([6, 5, 3, 11, 12, 10, 2]), vara: { good: [0, 4, 3, 5], mid: [] },
    beneficIn: BENEFIC_PLACES, lagnaLordBenefic: true,
    linesTa: [
      'ஸ்லோ.5/38: "मृगात्कराच्छ्रुतेस्त्रयेऽश्विमूलपूर्विकात्रये गुरुद्वयेऽर्कजीववित्सितेऽह्नि षट्छरत्रिके …" — நட்சத்திரம் 16: மிருகசீரிடம் முதல் மூன்று, அஸ்தம் முதல் மூன்று, திருவோணம் முதல் மூன்று, அசுவினி, மூலம், மூன்று பூர்வம், பூசம், ஆயில்யம் · கிழமை: ஞாயிறு, வியாழன், புதன், வெள்ளி · திதி: 6, 5, 3, 11, 12, 10, 2',
      '"शुभैरधीतिरुत्तमा त्रिकोणकेन्द्रगैः" — சுபர் கோண கேந்திரத்தில் சிறந்தது (குறிக்கப்படும்) · "லக்னாதிபதி சுபர்" — ஆங்கில உரையில் மட்டும், ஸ்லோகத்தில் இல்லை (குறிக்கப்படும்) · "ध्रुवान्त्यमित्रभे परैः" — வில்வித்தைக்கு (உரை), இங்கே சேர்க்கப்படவில்லை',
    ],
  },
  RANGACHARYA: {
    labelTa: 'ரங்காச்சார்யா அத்.IX', booksTa: 'ரங்காச்சார்யா',
    tithi: [16, ...tithiBoth([2, 3, 5, 6, 10, 11, 12])], tithiNot: [...tithiBoth([4, 8, 9, 14]), 15, 30],
    vara: { good: [3, 4, 5], mid: [0, 1] }, lagna: { good: [...MOVABLE_SIGNS, ...DUAL_SIGNS], mid: [] },
    nak: { good: [0, 4, 5, 6, 7, 8, 10, 19, 24, 12, 13, 14, 21, 22, 23], mid: [] }, digdwar: false,
    linesTa: [
      'திதி: தேய் 1, 2, 3, 5, 6, 12, 10, 11 நல்லவை; 4, 8, 9, 14, அமாவாசை, பௌர்ணமி கூடாது; மற்றவை நடுத்தரம் (எங்கள் வாசிப்பு) · கிழமை: புதன், வியாழன், வெள்ளி; ஞாயிறு, திங்கள் நடுத்தரம்; செவ்வாய், சனி கூடாது',
      'லக்னம்: சர, உபய ராசிகள் · நட்சத்திரம்: அசுவினி, மிருகசீரிடம், திருவாதிரை, புனர்பூசம், பூசம், ஆயில்யம், மூன்று பூர்வம், அஸ்தம், சித்திரை, சுவாதி, திருவோணம், அவிட்டம், சதயம்',
    ],
  },
  AGARWAL: {
    labelTa: 'அகர்வால் — நட்சத்திர வகைகள்', booksTa: 'அகர்வால் (பொதுப் பட்டியல்)',
    nak: { good: [0, 6, 7, 12, 14, 21, 22, 23], mid: [3, 4, 11, 13, 16, 20, 25, 26] }, abhijitOk: true, digdwar: false,
    noteTa: 'பொதுப் பட்டியல் (உபநயனத்துக்குப் பின் கல்விக்குத் தனிப் பகுதி இல்லை; வித்யாரம்பம் தனி): க்ஷிப்ரம் (அபிஜித் உட்பட) — "கல்வி தொடங்குதல்"; சரம் — "க்ஷிப்ரத்தின் காரியங்களும்"; மிருது — "கற்றல்" (பொதுவாக — நடுத்தரம்); ஸ்திரம் — "மிருதுவின் காரியங்களும்" (நடுத்தரம்) · திதி, கிழமை — விதி இல்லை',
  },
});

// ---------------------------------------------------------------------------
// Starting a business / opening a shop (vipani), added 2026-10-13
// ---------------------------------------------------------------------------

/** MC 2/17's stars for a shop: Mitra (Mrigashira, Chitra, Anuradha, Revati), Dhruva (Rohini, the Uttaras), Kshipra (Hasta, Ashwini, Pushya; Abhijit). */
const SHOP_STARS = Object.freeze([4, 13, 16, 26, 3, 11, 20, 25, 12, 0, 7]);
const NOT_RIKTA = Object.freeze(ALL_TITHIS.filter((t) => !RIKTA.includes(t)));
const NOT_AQUARIUS_LAGNA = Object.freeze({ good: range(0, 9).concat([11]), mid: [] });
const SHOP_PLACES = deepFreeze({ empty8_12: [[M5, [8, 12]]], benefic: [2, 10, 11] });

/** Business's rules beyond the other events': benHouse.code (the code for a mark), holi (Phalguna's full Moon). */
const BUSINESS = deepFreeze({
  labelTa: 'வியாபாரம் தொடங்குதல் / கடை திறப்பு',
  default: 'VASHISTHA',
  order: ['VASHISTHA', 'KALYANRAMAN', 'WILHELM', 'JOSHI', 'SHRIDHAR', 'MUHURTA_CHINTAMANI', 'RANGACHARYA', 'AGARWAL', 'RAMAN'],
  VASHISTHA: {
    labelTa: 'வசிஷ்டா — விபணி கரணம்', booksTa: 'வசிஷ்டா',
    tithi: [2, 3, 5, 7, 10, 12, 13, 15], vara: { good: [0, 1, 3, 4, 5, 6], mid: [] },
    nak: { good: [0, 3, 4, 6, 11, 20, 25, 12, 13, 14, 16, 18, 21, 22, 24, 26], mid: [] }, abhijitOk: true, digdwar: false,
    lagna: NOT_AQUARIUS_LAGNA, empty: [8, 12], beneficIn: SHOP_PLACES.benefic, benHouse: { houses: [1], planets: ['Moon', 'Mercury'], code: 'MOON_MERC_LAGNA_MID' },
    jupVenNotSet: true, masa: { good: [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11], mid: [], strict: true }, harishayana: true,
    yogaNot: [12, 16, 26], vishti: true, holi: true,
    linesTa: [
      '"சிறிய அளவில் வியாபாரம் தொடங்க அல்லது கடை திறக்க" (ப.100-101): திதி — வளர் 2, 3, 5, 7, 10, 12, 13, பௌர்ணமி · கிழமை — செவ்வாய் தவிர · நட்சத்திரம் — அசுவினி, ரோகிணி, மிருகசீரிடம், புனர்பூசம், மூன்று உத்திரம், அஸ்தம், சித்திரை, சுவாதி, அனுஷம், மூலம், திருவோணம், அபிஜித், அவிட்டம், பூரட்டாதி, ரேவதி',
      'லக்னம்: கும்பம் தவிர எதுவும் (சர, உபயம் நல்லது; ரிஷபம், மிதுனம், சிம்மம், கன்னி, விருச்சிகம், மகரம் நல்லவை) · லக்னத்தில் சந்திரன், புதன் சிறந்தது (குறிக்கப்படும்) · 8, 12 காலி · சுபர் 2, 10, 11-ல் (குறிக்கப்படும்)',
      'குரு, சுக்கிரன் அஸ்தங்கம் கூடாது · பௌஷ மாதம், சாதுர்மாஸ்யம் (ஹரிசயனம்), வியாகாதம், வியதீபாதம், வைதிருதி, பத்ரை (விஷ்டி), ரிக்த, செவ்வாய் கூடாது · "பூருதன" நாள் — மாத / ஆண்டு இறுதி அமாவாசை, ஹோலி (பால்குன பௌர்ணமி), செவ்வாய் — கூடாது · "சந்திரன் பலவீனமாக இருக்கக்கூடாது" (வரையறை இல்லை — கணிக்கப்படவில்லை) · காரியத்தின் காரக கிரகமும் புதனும் பலம் (கணிக்கப்படவில்லை)',
    ],
  },
  KALYANRAMAN: {
    labelTa: 'கல்யாணராமன் (தொ.2)', booksTa: 'கல்யாணராமன் (முகூர்த்த சிந்தாமணி மேற்கோள்)',
    nak: { good: SHOP_STARS, mid: [] }, abhijitOk: true, digdwar: false,
    tithi: [...tithiBoth([1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13]), 15], vara: { good: [0, 1, 3, 4, 5, 6], mid: [] },
    lagna: NOT_AQUARIUS_LAGNA, notIn: SHOP_PLACES.empty8_12, beneficIn: SHOP_PLACES.benefic, benHouse: { houses: [1], planets: ['Moon', 'Venus'], code: 'MOON_VENUS_LAGNA_MID' },
    linesTa: [
      '"Openings Shops, Opening Commercial Outlets" (பக்.186-187): நட்சத்திரம் 12 — மிருது (மிருகசீரிடம், ரேவதி, சித்திரை, அனுஷம்), துருவ (ரோகிணி, மூன்று உத்திரம்), க்ஷிப்ர (அஸ்தம், அசுவினி, பூசம், அபிஜித்) · திதி: 1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, பௌர்ணமி · கிழமை: செவ்வாய் தவிர',
      'ரிக்த திதி, செவ்வாய், கும்ப லக்னம் கூடாது · 2, 10, 11-ல் சுபர் (குறிக்கப்படும்) · லக்னத்தில் சுக்கிரன், சந்திரன் (குறிக்கப்படும்) · 8, 12-ல் பாவர் கூடாது',
    ],
  },
  WILHELM: {
    labelTa: 'வில்ஹெல்ம்', booksTa: 'வில்ஹெல்ம்',
    nak: { good: [0, 3, 4, 7, 11, 12, 13, 16, 20, 25, 26], mid: [] }, digdwar: false,
    tithi: NOT_RIKTA, vara: { good: [0, 1, 3, 4, 5, 6], mid: [] }, lagna: NOT_AQUARIUS_LAGNA,
    notIn: SHOP_PLACES.empty8_12, beneficIn: SHOP_PLACES.benefic, benHouse: { houses: [1], planets: ['Moon', 'Venus'], code: 'MOON_VENUS_LAGNA_MID' },
    linesTa: [
      '"Store/Business opening" (ப.193): நட்சத்திரம் — அசுவினி, ரோகிணி, மிருகசீரிடம், பூசம், உத்திரம், அஸ்தம், சித்திரை, அனுஷம், உத்திராடம், உத்திரட்டாதி, ரேவதி · நல்ல திதி — 4, 9, 14 "நிச்சயமாகக்" கூடாது · செவ்வாய் கூடாது · கும்ப லக்னம் கூடாது',
      'லக்னத்தில் சுக்கிரன் அல்லது சந்திரன் மிக நல்லது (குறிக்கப்படும்) · 8, 12-ல் பாவர் கூடாது · சுபர் 2, 10, 11-ல் சிறந்தது (குறிக்கப்படும்) · தொழிலுக்கு உரிய நட்சத்திரங்கள் (பொன், ஓவியம் …) இன்னும் சிறந்தவை — கணிக்கப்படவில்லை',
    ],
  },
  JOSHI: {
    labelTa: 'ஜோஷி அத்.9', booksTa: 'ஜோஷி',
    nak: { good: SHOP_STARS, mid: [] }, abhijitOk: true, digdwar: false,
    tithi: NOT_RIKTA, vara: { good: [0, 1, 3, 4, 5, 6], mid: [] }, lagna: NOT_AQUARIUS_LAGNA,
    notIn: SHOP_PLACES.empty8_12, beneficIn: SHOP_PLACES.benefic, benHouse: { houses: [1], planets: ['Moon', 'Venus'], code: 'MOON_VENUS_LAGNA_MID' },
    linesTa: [
      '"Opening a Shop" (ப.101): ரிக்த திதி, செவ்வாய், கும்ப லக்னம் கூடாது; மற்றவை எல்லாம் நல்லவை · நட்சத்திரம் — ஸ்திர (மூன்று உத்திரம், ரோகிணி), மிருது (மிருகசீரிடம், ரேவதி, சித்திரை, அனுஷம்), லகு (அஸ்தம், அசுவினி, பூசம், அபிஜித்)',
      'லக்னத்திலிருந்து 2, 10, 11-ல் சுபர்; லக்னத்தில் சுக்கிரன், சந்திரன் விருப்பம் (குறிக்கப்படும்) · 8, 12-ல் பாவர் கூடாது · சந்திர / தாரா சுத்தி அவசியம் (பொது)',
    ],
  },
  SHRIDHAR: {
    labelTa: 'ஸ்ரீதர் §25.4', booksTa: 'ஸ்ரீதர் (மு.சி. மேற்கோள்)',
    nak: { good: SHOP_STARS, mid: [] }, abhijitOk: true, digdwar: false,
    tithi: NOT_RIKTA, vara: { good: [0, 1, 3, 4, 5, 6], mid: [] }, lagna: NOT_AQUARIUS_LAGNA,
    notIn: SHOP_PLACES.empty8_12, beneficIn: SHOP_PLACES.benefic, benHouse: { houses: [1], planets: ['Moon', 'Venus'], code: 'MOON_VENUS_LAGNA_MID' },
    linesTa: [
      '"Opening a shop" (ப.684, மு.சி.யை மேற்கோளிட்டு): மிருது, ஸ்திர, லகு நட்சத்திரங்கள் (அபிஜித் உட்பட) · லக்னத்தில் சந்திரன், சுக்கிரன் (குறிக்கப்படும்) · சுபர் 2, 10, 11-ல் (குறிக்கப்படும்) · 8, 12-ல் பாவர் கூடாது · ரிக்த திதி, செவ்வாய், கும்ப லக்னம் கூடாது',
    ],
  },
  MUHURTA_CHINTAMANI: {
    labelTa: 'முகூர்த்த சிந்தாமணி அத்.2', booksTa: 'முகூர்த்த சிந்தாமணி ஸ்லோ.2/17',
    nak: { good: SHOP_STARS, mid: [] }, abhijitOk: true, digdwar: false,
    tithi: NOT_RIKTA, vara: { good: [0, 1, 3, 4, 5, 6], mid: [] }, lagna: NOT_AQUARIUS_LAGNA,
    notIn: SHOP_PLACES.empty8_12, beneficIn: SHOP_PLACES.benefic, benHouse: { houses: [1], planets: ['Moon', 'Venus'], code: 'MOON_VENUS_LAGNA_MID' },
    linesTa: [
      'ஸ்லோ.2/17: "रिक्ताभौमघटान्विना च विपणिर्मैत्रध्रुवक्षिप्रभैर्लग्ने चन्द्रसिते व्ययाष्टरहितैः पापैः शुभैर्ध्यायखे" — கடை: ரிக்த, செவ்வாய், கும்பம் இல்லாமல்; மைத்ர, துருவ, க்ஷிப்ர நட்சத்திரங்களில்; லக்னத்தில் சந்திரன், சுக்கிரன் (குறிக்கப்படும் — எங்கள் வாசிப்பு); 12, 8-ல் பாவர் இல்லாமல்; சுபர் 2, 11, 10-ல் (அச்சில் "ध्यायखे" — 5, 11, 10 என்றும் படிக்கலாம்; உரையும் மற்ற நூல்களும் 2, 10, 11 — குறிக்கப்படும்)',
    ],
  },
  RANGACHARYA: {
    labelTa: 'ரங்காச்சார்யா', booksTa: 'ரங்காச்சார்யா',
    nak: { good: [3, 11, 20, 25, 4, 13, 16, 26], mid: [] }, digdwar: false,
    tithi: NOT_RIKTA, vara: { good: [0, 1, 3, 4, 5, 6], mid: [] },
    notIn: SHOP_PLACES.empty8_12, beneficIn: SHOP_PLACES.benefic, benHouse: { houses: [1], planets: ['Moon', 'Venus'], code: 'MOON_VENUS_LAGNA_MID' },
    linesTa: [
      '"Shop opening" (ப.128): செவ்வாய், ரிக்த திதி கூடாது · ஸ்திர, மிருது நட்சத்திரங்கள் (ரோகிணி, மூன்று உத்திரம்; மிருகசீரிடம், சித்திரை, அனுஷம், ரேவதி) · லக்னத்தில் சந்திரன், சுக்கிரன் மிகச் சிறந்தது (குறிக்கப்படும்) · 8, 12-ல் பாவர் கூடாது · 2, 11, 10-ல் சுபர் நல்லது (குறிக்கப்படும்)',
    ],
  },
  RAMAN: {
    labelTa: 'ராமன் அத்.IV — லகு நட்சத்திரம்', booksTa: 'ராமன் (பொதுப் பட்டியல்)',
    nak: { good: [0, 7, 12], mid: [] }, abhijitOk: true, digdwar: false,
    noteTa: 'பொதுப் பட்டியல் (கடை திறப்புக்குத் தனிப் பகுதி இல்லை; அத்.X வாங்குதல் / விற்றல் மட்டும்): லகு நட்சத்திரங்கள் "தொழில் தொடங்குதலுக்கு" · திதி, கிழமை — விதி இல்லை',
  },
  AGARWAL: {
    labelTa: 'அகர்வால் — நட்சத்திர வகைகள்', booksTa: 'அகர்வால் (பொதுப் பட்டியல்)',
    nak: { good: [0, 3, 4, 6, 7, 11, 12, 13, 14, 16, 20, 21, 22, 23, 25, 26], mid: [] }, abhijitOk: true, digdwar: false,
    noteTa: 'பொதுப் பட்டியல் (கடை திறப்புக்குத் தனிப் பகுதி இல்லை; ப.329 வாங்குதல் / விற்றல் மட்டும்): க்ஷிப்ரம் (அபிஜித் உட்பட) — "கடை தொடங்குதல், விற்றல்"; மிருது — "தொழில் / வேலை / வியாபாரம் தொடங்குதல்"; ஸ்திரம் — "மிருதுவின் காரியங்களும்"; சரம் — "க்ஷிப்ரத்தின் காரியங்களும்" · திதி, கிழமை — விதி இல்லை',
  },
});

// ---------------------------------------------------------------------------
// Taking medicine / beginning treatment, and surgery, added 2026-10-13
// ---------------------------------------------------------------------------

/** MC 2/15's stars for the first dose: Laghu (Hasta, Ashwini, Pushya; Abhijit), Mridu (Mrigashira, Revati, Chitra, Anuradha), Chara (Swati, Punarvasu, Shravana, Dhanishtha, Shatabhisha), Moola. */
const MEDICINE_13 = Object.freeze([12, 0, 7, 4, 26, 13, 16, 14, 6, 21, 22, 23, 18]);
const FIXED_STARS = Object.freeze([3, 11, 20, 25]);
/** The sharp (Tikshna) stars: Jyeshtha, Ardra, Ashlesha, Moola. */
const SHARP_STARS = Object.freeze([17, 5, 8, 18]);
const NOT_RIKTA_AMAVASYA = Object.freeze(NOT_RIKTA.filter((t) => t !== 30));
const NOT_DUAL = Object.freeze(range(0, 11).filter((s) => !DUAL_SIGNS.includes(s)));
const BEN_LAGNA = deepFreeze({ houses: [1], planets: ['Moon', 'Mercury', 'Jupiter', 'Venus'], code: 'BEN_LAGNA_MID' });
const EMPTY_7_8_12 = Object.freeze([7, 8, 12]);

/**
 * Medicine's rules beyond the other events': benHouse BEN_LAGNA (a benefic in the lagna — marked).
 * Disease by disease (fever, leprosy, rheumatism …), purgatives, blood-letting, preparing medicine: notes.
 */
const MEDICINE = deepFreeze({
  labelTa: 'மருந்து உட்கொள்ளுதல் / சிகிச்சை தொடக்கம்',
  default: 'WILHELM',
  order: ['WILHELM', 'RAMAN', 'SHRIDHAR', 'MUHURTA_CHINTAMANI', 'KALYANRAMAN', 'JOSHI', 'VASHISTHA', 'RANGACHARYA', 'AGARWAL'],
  WILHELM: {
    labelTa: 'வில்ஹெல்ம் — நோய்ச் சிகிச்சை, மருந்து', booksTa: 'வில்ஹெல்ம் (மு.சி., காலப்பிரகாசிகை மேற்கோள்கள்)',
    nak: { good: [0, 4, 6, 7, 12, 13, 14, 16, 21, 22, 23, 26], mid: [18, ...FIXED_STARS] }, digdwar: false, taraNot: [1],
    tithi: ALL_TITHIS.filter((t) => ![...RIKTA, 30].includes(t)), vara: { good: [0, 1, 3, 4, 5], mid: [] },
    lagna: { good: DUAL_SIGNS, mid: NOT_DUAL }, benHouse: BEN_LAGNA, empty: EMPTY_7_8_12,
    linesTa: [
      '"Treatment of disease & taking medicine" (ப.275-277): நட்சத்திரம் — அசுவினி, மிருகசீரிடம், புனர்பூசம், பூசம், அஸ்தம், சித்திரை, சுவாதி, அனுஷம், திருவோணம், அவிட்டம், சதயம், ரேவதி; மூலம் (மு.சி.), ரோகிணி, மூன்று உத்திரம் (காலப்பிரகாசிகை) நடுத்தரம் · ஜன்ம நட்சத்திரம் "குறிப்பாகக்" கூடாது',
      'திதி: 4, 9, 14, அமாவாசை "குறிப்பாகக்" கூடாது · கிழமை: ஞாயிறு, திங்கள், புதன், வியாழன், வெள்ளி · லக்னம்: சுபருடன் உபய ராசி சிறந்தது (மற்றவை நடுத்தரம்; லக்னத்தில் சுபர் — குறிக்கப்படும்) · 7, 8, 12-ல் கிரகம் கூடாது',
      'உக்ர யோகங்கள் (திதி–நட்சத்திரச் சேர்க்கைகள்) எந்த நோய்க்கும் நல்லவை; சந்திரன், புதன், குரு, சுக்கிரன் தம் வர்க்கங்களில், சர லக்னம் / நவாம்சம் — காய்ச்சலுக்குச் சிறப்பு; நோய்வாரி விதிகள் — கணிக்கப்படவில்லை (குறிப்புகளில்)',
    ],
  },
  RAMAN: {
    labelTa: 'ராமன் அத்.XV', booksTa: 'ராமன்',
    nak: { good: [0, 3, 4, 6, 7, 11, 20, 25, 12, 13, 14, 16, 21, 22, 23, 26], mid: [] }, digdwar: false,
    linesTa: [
      '"Beginning Treatment" (ப.52): நீண்ட நாள் நோய்க்குச் சிகிச்சை — அசுவினி, ரோகிணி, மிருகசீரிடம், புனர்பூசம், பூசம், மூன்று உத்திரம், அஸ்தம், சித்திரை, சுவாதி, அனுஷம், திருவோணம், அவிட்டம், சதயம், ரேவதி · திதி, கிழமை, லக்னம் — பொது விதி இல்லை',
      'நீண்ட நாள் நோய், மீண்டும் வரும் காய்ச்சல்: திங்கள்–அஸ்தம், புதன்–அசுவினி, வியாழன்–சித்திரை, வெள்ளி–புனர்பூசம், சந்திரன், புதன், குரு, சுக்கிரன் தம் வர்க்கங்களில், சர ராசி / அம்சம் உதயம் · உக்ர யோகங்கள் · நோய்வாரி விதிகள் — கணிக்கப்படவில்லை (குறிப்புகளில்)',
    ],
  },
  SHRIDHAR: {
    labelTa: 'ஸ்ரீதர் §22.3', booksTa: 'ஸ்ரீதர் (மு.சி., J.V., K.P. மேற்கோள்கள்)',
    nak: { good: MEDICINE_13, mid: FIXED_STARS }, digdwar: false, taraNot: [1],
    tithi: NOT_RIKTA_AMAVASYA, vara: { good: [1, 3, 4, 5], mid: [0] },
    lagna: { good: DUAL_SIGNS, mid: NOT_DUAL }, benHouse: BEN_LAGNA, empty: EMPTY_7_8_12,
    linesTa: [
      '"Administration of medicine" (ப.603): நட்சத்திரம் — லகு (அஸ்தம், அசுவினி, பூசம்), மிருது (மிருகசீரிடம், சித்திரை, அனுஷம், ரேவதி), சர (புனர்பூசம், சுவாதி, திருவோணம், சதயம், அவிட்டம்), மூலம் (மு.சி.); ஸ்திர (ரோகிணி, மூன்று உத்திரம்) — K.P. (நடுத்தரம்); ஜன்ம நட்சத்திரம் கூடாது (K.P.)',
      'திதி: ரிக்த அல்லாத சுப திதி (அமாவாசையும் இல்லை — எங்கள் வாசிப்பு); J.V.: நந்தா, பூர்ணா, பௌர்ணமி அருகில் · கிழமை: திங்கள், புதன், வியாழன், வெள்ளி; ஞாயிறு — J.V. (நடுத்தரம்)',
      'லக்னம்: உபய ராசி சிறந்தது (J.V.: ஒற்றை ராசி; மற்றவை நடுத்தரம்) · லக்னத்தில் சந்திரன் உட்பட சுபர் (குறிக்கப்படும்) · 7, 8, 12 காலி · ஆயுள் யோகங்கள் நல்லவை (காஷ்யபர், ஸ்ரீபதி — கணிக்கப்படவில்லை)',
    ],
  },
  MUHURTA_CHINTAMANI: {
    labelTa: 'முகூர்த்த சிந்தாமணி அத்.2', booksTa: 'முகூர்த்த சிந்தாமணி ஸ்லோ.2/15',
    nak: { good: MEDICINE_13, mid: [] }, abhijitOk: true, digdwar: false, taraNot: [1],
    tithi: NOT_RIKTA_AMAVASYA, vara: { good: [0, 1, 3, 4, 5], mid: [] },
    lagna: { good: DUAL_SIGNS, mid: [] }, benHouse: BEN_LAGNA, empty: EMPTY_7_8_12,
    linesTa: [
      'ஸ்லோ.2/15: "भैषज्यं सल्लघुमृदुचरे मूलभे द्व्यङ्गलग्ने शुक्रेन्द्विज्ये विदि च दिवसे चापि तेषां रवेश्च । शुद्धे रिःफद्युनमृतिगृहे सत्तिथौ नो जनर्क्षे" — மருந்து: லகு, மிருது, சர நட்சத்திரங்கள், மூலம் (அபிஜித் உட்பட); உபய லக்னம், அதில் சுக்கிரன், சந்திரன், குரு, புதன் (குறிக்கப்படும் — எங்கள் வாசிப்பு); 12, 7, 8 சுத்தம்',
      'கிழமை: அந்தச் சுபர்களுடையவை, ஞாயிறும் · நல்ல திதி — ரிக்த, அமாவாசை தவிர (உரை) · ஜன்ம நட்சத்திரம் கூடாது · தையல் (சூசி கர்மம்): புனர்பூசம், அவிட்டம், சித்திரை, அனுஷம், அசுவினி, பூசம் (கணிக்கப்படவில்லை)',
    ],
  },
  KALYANRAMAN: {
    labelTa: 'கல்யாணராமன் (தொ.2)', booksTa: 'கல்யாணராமன் (முகூர்த்த சிந்தாமணி மேற்கோள்)',
    nak: { good: MEDICINE_13, mid: [] }, abhijitOk: true, digdwar: false, taraNot: [1],
    tithi: bothPakshas([1, 2, 3, 5, 7, 10, 11, 13]), vara: { good: [1, 3, 4, 5], mid: [0] },
    lagna: { good: DUAL_SIGNS, mid: [] }, benHouse: BEN_LAGNA, empty: EMPTY_7_8_12,
    secondary: ['LAGNA', 'EMPTY_7', 'EMPTY_8', 'EMPTY_12', 'TARA_NOT'],
    linesTa: [
      '"Taking Medicines" (ப.201-202): நட்சத்திரம் 13 + அபிஜித் — அசுவினி, மிருகசீரிடம், புனர்பூசம், பூசம், அஸ்தம், சித்திரை, சுவாதி, அனுஷம், மூலம், திருவோணம், அவிட்டம், சதயம், ரேவதி · திதி: 1, 2, 3, 5, 7, 10, 11, 13 · கிழமை: திங்கள், புதன், வியாழன், வெள்ளி',
      'குறிப்புகள் (மு.சி.யின்படி — குறிக்கப்படும்): ஞாயிறும் (நடுத்தரம்), ஜன்ம நட்சத்திரம், ரிக்த, அமாவாசை கூடாது; உபய லக்னத்தில் சுக்கிரன், சந்திரன், குரு, புதன்; 12, 7, 8-ல் கிரகம் இல்லாமல்',
      '"Commencing Treatment" (ப.203): ரோகிணி, திருவோணம், சதயம்; "Herbal medication": பரணி — இவை தனிப் பட்டியல்கள், கணிக்கப்படவில்லை',
    ],
  },
  JOSHI: {
    labelTa: 'ஜோஷி அத்.13', booksTa: 'ஜோஷி',
    nak: { good: MEDICINE_13, mid: [] }, abhijitOk: true, digdwar: false, taraNot: [1],
    tithi: bothPakshas([1, 2, 3, 5, 7, 10, 11, 13]), vara: { good: [1, 3, 4, 5], mid: [] },
    lagna: { good: DUAL_SIGNS, mid: [] }, benHouse: BEN_LAGNA, empty: EMPTY_7_8_12,
    linesTa: [
      '"For taking medicines" (ப.146-147): லகு (அஸ்தம், அசுவினி, பூசம், அபிஜித்), மைத்ர (மிருகசீரிடம், ரேவதி, சித்திரை, அனுஷம்), சர (சுவாதி, புனர்பூசம், திருவோணம், அவிட்டம், சதயம்), மூலம் · திதி: 1, 2, 3, 5, 7, 10, 11, 13 · கிழமை: திங்கள், புதன், வியாழன், வெள்ளி',
      'லக்னம்: உபய ராசி, சுபருடன் (லக்னத்தில் சுபர் — குறிக்கப்படும்); 7, 8, 12-ல் கிரகம் இல்லை · ஆயுள் யோகங்கள் கூடுதல் நன்மை (கணிக்கப்படவில்லை) · ஜன்ம நட்சத்திரம் "எப்போதும்" கூடாது',
    ],
  },
  VASHISTHA: {
    labelTa: 'வசிஷ்டா — ஔஷத சேவனம்', booksTa: 'வசிஷ்டா',
    tithi: [16, 2, 3, 5, 7, 10, 11, 12], vara: { good: [0, 1, 3, 4, 5], mid: [] },
    nak: { good: [0, 2, 3, 4, 6, 7, 9, 11, 20, 25, 12, 13, 14, 15, 16, 17, 18, 21, 22, 23, 26], mid: [] }, digdwar: false,
    lagna: { good: DUAL_SIGNS, mid: [] }, notIn: [[M5, [1, 7, 8, 12]], [M5, [4, 6, 10], true]], vishti: true,
    linesTa: [
      '"Aushadh-Sevana muhurta" (ப.133): திதி — தேய் 1, வளர் 2, 3, 5, 7, 10, 11, 12 · கிழமை: ஞாயிறு, திங்கள், புதன், வியாழன், வெள்ளி · நட்சத்திரம்: அசுவினி, கிருத்திகை, ரோகிணி, மிருகசீரிடம், புனர்பூசம், பூசம், மகம், மூன்று உத்திரம், அஸ்தம், சித்திரை, சுவாதி, விசாகம், அனுஷம், கேட்டை, மூலம், திருவோணம், அவிட்டம், சதயம், ரேவதி',
      'லக்னம்: 3, 6, 9, 12 (உபயம்); லக்னம், 7, 8, 12 பாதிப்பின்றி (பாவர் இல்லாமல்) · குறிப்பு (சிகிச்சைக்கு): 1, 4, 7, 10, 6, 8, 12 பாதிப்பின்றி (4, 6, 10 — குறிக்கப்படும்), பத்ரை கூடாது; அம்ருத யோகம், குரு சுபம், தாரா சுத்தி — பொதுப் பகுதியில் / கணிக்கப்படவில்லை',
    ],
  },
  RANGACHARYA: {
    labelTa: 'ரங்காச்சார்யா', booksTa: 'ரங்காச்சார்யா',
    nak: { good: MEDICINE_13, mid: [] }, digdwar: false, taraNot: [1],
    tithi: NOT_RIKTA_AMAVASYA, vara: { good: [1, 3, 5], mid: [0] },
    lagna: { good: DUAL_SIGNS, mid: NOT_DUAL }, benHouse: BEN_LAGNA, empty: [6, 12],
    linesTa: [
      '"Medical matters" (ப.132-133): சர, லகு, மிருது நட்சத்திரங்கள், மூலம் · ஜன்ம நட்சத்திரத்தில் "ஒருபோதும்" கூடாது · உபய லக்னம் விருப்பம் (மற்றவை நடுத்தரம்); சுக்கிரன், சந்திரன், குரு, புதன் — "மிக விருப்பம்" (குறிக்கப்படும்) · 6, 12 காலி',
      'கிழமை: "ஞாயிறு-திங்கள், புதன், வெள்ளி நல்லவை" — பின் "ஞாயிறு, செவ்வாயில் ஒருபோதும் தொடங்கக் கூடாது": ஞாயிறு நடுத்தரம் (எங்கள் வாசிப்பு); வியாழன் அச்சில் இல்லை · சுப திதி (ரிக்த, அமாவாசை தவிர — எங்கள் வாசிப்பு)',
    ],
  },
  AGARWAL: {
    labelTa: 'அகர்வால் — உக்ர நட்சத்திரம்', booksTa: 'அகர்வால் (பொதுப் பட்டியல்)',
    nak: { good: [1, 9, 10, 19, 24], mid: [] }, digdwar: false,
    noteTa: 'பொதுப் பட்டியல் (மருந்துக்குத் தனிப் பகுதி இல்லை): உக்ர நட்சத்திரம் — "மருந்து கொடுத்தல்" (கொல்லுதல், விஷம், அறுவை … உடன்; அச்சில் உள்ளபடி — மற்ற நூல்கள் லகு, மிருது, சரம்) · மிஸ்ர நட்சத்திரம் — "மருந்து தயாரித்தல்" (தனிக் காரியம்) · திதி, கிழமை — விதி இல்லை',
  },
});

/**
 * Surgery's rules beyond the other events': marsSaturn ('INFLUENCE': Saturn with Mars or aspecting it;
 * 'MUTUAL': each aspecting the other), want [{ planets, houses, all, code }] (places a book asks for — marked).
 */
const SURGERY = deepFreeze({
  labelTa: 'அறுவை சிகிச்சை',
  default: 'WILHELM',
  order: ['WILHELM', 'RAMAN', 'SHRIDHAR', 'VASHISTHA', 'KALYANRAMAN', 'RANGACHARYA', 'JOSHI', 'AGARWAL'],
  WILHELM: {
    labelTa: 'வில்ஹெல்ம் — அறுவை (பல் உட்பட)', booksTa: 'வில்ஹெல்ம்',
    nak: { good: SHARP_STARS, mid: [2] }, digdwar: false, taraNot: [1], chandra: { good: range(2, 12), mid: [1] },
    tithi: RIKTA, tithiMid: [3, 13, 18, 28], tithiNot: [...bothPakshas([6, 8, 12]), 15, 30],
    vara: { good: [2, 6], mid: [1, 3, 4, 5] }, lagna: { good: [0, 1, 3, 5], mid: [2, 4, 6, 7, 8, 9, 10, 11] },
    empty: [8], emptyPref: [7, 12], marsSaturn: 'INFLUENCE',
    linesTa: [
      '"Surgery (including oral surgery, pulling & drilling teeth)" (ப.273-274): நட்சத்திரம் — திருவாதிரை, ஆயில்யம், கேட்டை, மூலம் சிறந்தவை, பின் கிருத்திகை (நடுத்தரம்) · ஜன்ம நட்சத்திரம் கூடாது; சந்திரன் ஜன்ம ராசியில் இல்லாமல் இருப்பது சிறந்தது (குறிக்கப்படும்)',
      'திதி: ரிக்த (4, 9, 14) சிறந்தவை, பின் 3, 13 (நடுத்தரம்); பௌர்ணமி, 6, 8, 12, அமாவாசை கூடாது; மற்றவை நடுத்தரம் (எங்கள் வாசிப்பு) · கிழமை: செவ்வாய், சனி சிறந்தவை; ஞாயிறு தவிர மற்றவை ஏற்கலாம் (நடுத்தரம்)',
      'லக்னம்: மேஷம், ரிஷபம், கடகம், கன்னி சிறந்தவை (மற்றவை நடுத்தரம்) · 8 காலி; "சிகிச்சைக்கு" சொன்ன 7, 12 காலியும் (குறிக்கப்படும்) · செவ்வாய் மீது சனியின் தொடர்பு (சேர்க்கை, 3 / 7 / 10 பார்வை) கூடாது · உறுப்புக்குரிய பாவமும் அதிபதியும், திசு கிரகம், செவ்வாய் பலம் — கணிக்கப்படவில்லை',
    ],
  },
  RAMAN: {
    labelTa: 'ராமன் அத்.XV', booksTa: 'ராமன்',
    nak: { good: SHARP_STARS, mid: [] }, digdwar: false, tithi: RIKTA, krishnaMid: true, chandra: { good: range(2, 12), mid: [] },
    vara: { good: [2, 6], mid: [] }, empty: [8], marsSaturn: 'MUTUAL',
    linesTa: [
      '"Surgical Operations" (ப.53): முடிந்தால் வளர்பிறையில் (தேய்பிறை — குறிக்கப்படும்); சரியான பௌர்ணமியில் ஒருபோதும் இல்லை · சந்திரன் ஜன்ம ராசியில் இருக்கக் கூடாது',
      'செவ்வாய் அல்லது சனிக்கிழமை · திருவாதிரை, கேட்டை, ஆயில்யம், மூலம் — 4, 9, 14 திதியுடன் · 8 காலி · செவ்வாய், சனி பரஸ்பரப் பார்வை கூடாது · செவ்வாய் பலம், உறுப்புக்குரிய பாவம், சந்திரன் செல்லும் ராசியின் உறுப்பு — கணிக்கப்படவில்லை',
    ],
  },
  SHRIDHAR: {
    labelTa: 'ஸ்ரீதர் §22.4', booksTa: 'ஸ்ரீதர் (B.J.S., K.P. மேற்கோள்கள்)',
    nak: { good: [12, 13, 14, 0, 7, 23, 3, 4, 21, 16, 17, 5, 8, 18], mid: [] }, digdwar: false,
    tithi: RIKTA, vara: { good: [0, 2], mid: [] }, lagna: { good: [0, 1, 3, 5], mid: [] }, empty: [8],
    chandra: { good: [1, 2, 3, 5, 6, 7, 9, 10, 11], mid: [] }, lagnaLordBenefic: true,
    linesTa: [
      '"Surgery" (ப.604-605): B.J.S. — அஸ்தம், சித்திரை, சுவாதி, அசுவினி, பூசம், சதயம், ரோகிணி, மிருகசீரிடம், திருவோணம், அனுஷம், கேட்டை சிறந்தவை; K.P. — தீக்ஷ்ண நட்சத்திரங்கள் (கேட்டை, திருவாதிரை, ஆயில்யம், மூலம்): இரண்டும் சேர்த்து',
      'K.P.: ரிக்த திதி; செவ்வாய் அல்லது ஞாயிறு; செவ்வாய் பலம் (கணிக்கப்படவில்லை); 8 காலி; லக்னம் மேஷம், ரிஷபம், கடகம், கன்னி · சந்திரன் ஜன்ம ராசிக்கு 4, 8, 12-ல் கூடாது; தாரா சுபம், வைநாசிகம் தவிர் (பொது); லக்னம் ஜன்ம ராசி / லக்னத்துக்கு 8 இல்லை (பொது லக்ன சுத்தி)',
      'லக்னம் சுப ராசி (லக்னாதிபதி சுபர் — குறிக்கப்படும்), குரு, சந்திரன் பார்வையுடன் (கணிக்கப்படவில்லை) · கோசாரத்தில் காத கிரகம் இல்லை (கணிக்கப்படவில்லை) · "விரை அறுவை" பத்தி (ரேவதி, பூசம் …; ஞாயிறு, செவ்வாய், வியாழன்) — §26.13-லும் உள்ளது, இங்கே சேர்க்கப்படவில்லை',
    ],
  },
  VASHISTHA: {
    labelTa: 'வசிஷ்டா — சல்ய கர்மம்', booksTa: 'வசிஷ்டா',
    tithi: [4, 9, 14], tithiMid: [19, 24, 29], vara: { good: [0, 2, 4], mid: [] },
    nak: { good: [0, 4, 6, 12, 14, 16, 17, 21, 23], mid: [] }, digdwar: false,
    notIn: [[M5, [1, 4, 6, 7, 8, 10, 12], true]], vishti: true,
    linesTa: [
      '"Shalyakarma muhurta" (ப.133): திதி — 4, 9, 14, வளர்பிறையில் சிறப்பு (தேய்பிறை ரிக்த — நடுத்தரம்) · கிழமை: ஞாயிறு, செவ்வாய், வியாழன் · நட்சத்திரம்: அசுவினி, மிருகசீரிடம், புனர்பூசம், அஸ்தம், சுவாதி, அனுஷம், கேட்டை, திருவோணம், சதயம்',
      'குறிப்பு: 1, 4, 7, 10, 6, 8, 12 பாவங்கள் பாதிப்பின்றி (பாவர் — குறிக்கப்படும்), பத்ரை கூடாது; அம்ருத யோகம், குரு சுபம், தாரா சுத்தி — பொதுப் பகுதியில் / கணிக்கப்படவில்லை',
    ],
  },
  KALYANRAMAN: {
    labelTa: 'கல்யாணராமன் (தொ.2)', booksTa: 'கல்யாணராமன்',
    nak: { good: [0, 5, 8, 9, 17, 18], mid: [] }, digdwar: false,
    tithi: [...tithiBoth([1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13]), 15], vara: { good: [0, 1, 2, 3, 4, 5], mid: [] },
    linesTa: [
      '"Performing Surgery" (ப.203): நட்சத்திரம் — அசுவினி, திருவாதிரை, ஆயில்யம், மகம், கேட்டை, மூலம் · திதி: 1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, பௌர்ணமி (ரிக்த, அமாவாசை இல்லை) · கிழமை: சனி தவிர',
    ],
  },
  RANGACHARYA: {
    labelTa: 'ரங்காச்சார்யா', booksTa: 'ரங்காச்சார்யா',
    vara: { good: [0, 2], mid: [] }, empty: [8],
    want: [{ planets: M5, houses: [6], code: 'MALEFIC_6_MID' }, { planets: ['Sun', 'Moon'], houses: [1, 4, 7, 10], all: true, code: 'SUN_MOON_KENDRA_MID' }],
    linesTa: [
      '"Surgical operation" (ப.133): செவ்வாய் அல்லது ஞாயிறு · 8 காலி · 6-ல் பாவர், சூரியன், சந்திரன் கேந்திரத்தில் (குறிக்கப்படும் — எங்கள் வாசிப்பு) · நட்சத்திரம், திதி — விதி இல்லை',
    ],
  },
  JOSHI: {
    labelTa: 'ஜோஷி அத்.2 — உக்ர நட்சத்திரம்', booksTa: 'ஜோஷி (பொதுப் பட்டியல்)',
    nak: { good: [1, 9, 10, 19, 24], mid: [] }, digdwar: false, vara: { good: [2], mid: [0, 1, 3, 4, 5, 6] },
    noteTa: 'பொதுப் பட்டியல் (அறுவைக்குத் தனிப் பகுதி இல்லை): உக்ர நட்சத்திரம், செவ்வாய் — "அறுவை சிகிச்சை" · மற்ற கிழமை நடுத்தரம் (எங்கள் வாசிப்பு) · திதி — விதி இல்லை',
  },
  AGARWAL: {
    labelTa: 'அகர்வால் — உக்ர நட்சத்திரம்', booksTa: 'அகர்வால் (பொதுப் பட்டியல்)',
    nak: { good: [1, 9, 10, 19, 24], mid: [] }, digdwar: false,
    noteTa: 'பொதுப் பட்டியல் (அறுவைக்குத் தனிப் பகுதி இல்லை): உக்ர நட்சத்திரம் — "அறுவை சிகிச்சை" · திதி, கிழமை — விதி இல்லை',
  },
});

// ---------------------------------------------------------------------------
// Entering an old house (bought, rented, repaired, rebuilt), added 2026-10-14
// ---------------------------------------------------------------------------

/** MC 13/2's stars for an old house: Shatabhisha (Ambupa), Pushya (Ijya), Swati (Anila), Dhanishtha (Vasava). */
const OLD_HOUSE_STARS = Object.freeze([23, 7, 14, 22]);
/** … and its months besides the new house's: Kartika, Margashirsha, Shravana. */
const OLD_HOUSE_MONTHS = Object.freeze([7, 8, 4]);
/**
 * A book's old-house reading: its new-house reading with the months and stars added (the new house's middling
 * months become good), Jupiter's and Venus's combustion not considered, and no Uttarayana rule — the added
 * months fall in Dakshinayana (Shridhar says so; for the others our reading).
 */
const oldHouseOf = (base, labelTa) => {
  const { uttarayana, jupVenNotSet, ...rest } = base;
  void uttarayana; void jupVenNotSet;
  return {
    ...rest, labelTa,
    masa: { good: [...new Set([...base.masa.good, ...base.masa.mid, ...OLD_HOUSE_MONTHS])], mid: [], strict: base.masa.strict },
    nak: { good: [...new Set([...base.nak.good, ...OLD_HOUSE_STARS])], mid: base.nak.mid.filter((s) => !OLD_HOUSE_STARS.includes(s)) },
  };
};
const OLD_HOUSE = deepFreeze({
  labelTa: 'பழைய வீட்டில் நுழைதல் (வாங்கிய, வாடகை, பழுது பார்த்த, மீண்டும் கட்டிய வீடு)',
  default: 'SHRIDHAR',
  order: ['SHRIDHAR', 'RAMAN', 'JOSHI', 'WILHELM', 'MUHURTA_CHINTAMANI', 'AGARWAL'],
  SHRIDHAR: oldHouseOf(GRIHA_PRAVESHA.SHRIDHAR, 'ஸ்ரீதர் §27.16 (b)'),
  // Raman gives moving house its own rules, not the new house's with additions.
  RAMAN: {
    labelTa: 'ராமன் அத்.XII — வேறு வீட்டுக்கு மாறுதல்', booksTa: 'ராமன்',
    tithi: ALL_TITHIS.filter((t) => !RIKTA.includes(t)), vara: { good: [1, 3, 4, 5], mid: [] },
    noteTa: 'ராமனின் தனி விதி (புது வீட்டு விதிகள் சேர்க்கப்படவில்லை) · ஞாயிறு, செவ்வாய், சனி கூடாது · ரிக்த திதி = "எதிர்மறைத் திதிகள்" · தாரா பலம், சந்திர பலம் "வழக்கம் போல" — "தாரை · சந்திரன்" நெடுவரிசை · நல்ல திதி, நட்சத்திரம், கிழமை "மிக அவசியம்" · குடியிருப்பு அல்லாத நோக்கம் என்றால் அதற்குரிய பாவம் பலமாக (முதலீடு — 11-ஆம் பாவம்) — கணிக்கப்படவில்லை',
  },
  JOSHI: oldHouseOf(GRIHA_PRAVESHA.JOSHI, 'ஜோஷி'),
  WILHELM: oldHouseOf(GRIHA_PRAVESHA.WILHELM, 'வில்ஹெல்ம்'),
  MUHURTA_CHINTAMANI: oldHouseOf(GRIHA_PRAVESHA.MUHURTA_CHINTAMANI, 'முகூர்த்த சிந்தாமணி ஸ்லோ.13/2'),
  AGARWAL: oldHouseOf(GRIHA_PRAVESHA.AGARWAL, 'அகர்வால்'),
});

// ---------------------------------------------------------------------------
// The first bath after recovering from illness (roga-mukta snana), added 2026-10-14
// ---------------------------------------------------------------------------

/** MC 2/40: all stars but Revati, Punarvasu, the Dhruvas (Rohini, the Uttaras), Magha, Swati, Ashlesha. */
const BATH_MC_18 = Object.freeze(range(0, 26).filter((s) => ![26, 6, 3, 11, 20, 25, 9, 14, 8].includes(s)));
/** Kalyanraman's and Joshi's printed eighteen: Punarvasu in, Anuradha out. */
const BATH_KR_18 = Object.freeze([...BATH_MC_18.filter((s) => s !== 16), 6].sort((a, b) => a - b));
/** Wilhelm's, Raman's and Agarwal's thirteen. */
const BATH_13 = Object.freeze([0, 1, 2, 4, 5, 7, 10, 12, 13, 15, 18, 19, 24]);
const NOT_4_8_9_14_30 = Object.freeze(ALL_TITHIS.filter((t) => ![...bothPakshas([4, 8, 9, 14]), 30].includes(t)));
const NOT_CHANDRASHTAMA = deepFreeze({ good: range(1, 12).filter((h) => h !== 8), mid: [] });
const KENDRA_KONA_11 = Object.freeze([1, 4, 7, 10, 5, 9, 11]);

/**
 * The recovery bath's rules beyond the other events': moonWeak { from: 'LAGNA' | 'NATAL', houses, want }
 * (MC's "हीने विधौ" — the Moon in the 4th, 8th or 12th; marked when not, or, want false, when it is).
 * Two schools: MC (Rikta tithis, a movable lagna, malefics in kendras, konas and the 11th, the Moon weak)
 * and K.P. (Wilhelm, Raman, Agarwal: no Rikta, malefics in 3 and 6, no Chandrashtama).
 */
const ROGA_SNANA = deepFreeze({
  labelTa: 'நோய் நீங்கிய முதல் குளியல் (ரோகமுக்த ஸ்நானம்)',
  default: 'SHRIDHAR',
  order: ['SHRIDHAR', 'WILHELM', 'KALYANRAMAN', 'MUHURTA_CHINTAMANI', 'JOSHI', 'RANGACHARYA', 'RAMAN', 'AGARWAL'],
  SHRIDHAR: {
    labelTa: 'ஸ்ரீதர் §22.5', booksTa: 'ஸ்ரீதர் (மு.சி., J.V., K.P. மேற்கோள்கள்)',
    nak: { good: BATH_MC_18, mid: [] }, digdwar: false, tithi: RIKTA, vara: { good: [0, 2, 3, 4, 6], mid: [] },
    lagna: { good: MOVABLE_SIGNS, mid: [] }, maleficIn: KENDRA_KONA_11, moonWeak: { from: 'NATAL', houses: [4, 8, 12], want: true },
    linesTa: [
      '"Bath after recovery from illness" (ப.605): திதி — ரிக்த (4, 9, 14) · கிழமை — ஞாயிறு, செவ்வாய், புதன், வியாழன், சனி · நட்சத்திரம் — ஸ்திர (ரோகிணி, மூன்று உத்திரம்), மகம், சுவாதி, ஆயில்யம், புனர்பூசம், ரேவதி (9) தவிர மற்ற 18',
      'லக்னம்: சர ராசி · பாவர் (சூரியன், செவ்வாய், சனி, ராகு, கேது) 1, 4, 7, 10, 5, 9, 11-ல் (குறிக்கப்படும்) · "க்ஷீண" சந்திரன் ஜன்ம ராசிக்கு 4, 8, 12-ல் (இல்லையெனில் குறிக்கப்படும்)',
      'J.V.: க்ஷீண சந்திரன் = தேய் 10 முதல் வளர் 5 வரை; 1-8-ல் பாவர், 10-ல் சுபர்; ஞாயிறு, செவ்வாய்; அசுவினி, சித்திரை, கிருத்திகை, அவிட்டம் · K.P. இதற்கு மாறாக: சந்திராஷ்டமம், ஜன்ம / 3, 5, 7, 10, 12, 14, 16, 22-வது நட்சத்திரம், ரிக்த, அமாவாசை கூடாது; செவ்வாய், புதன், வியாழன்; சுபர் கேந்திர கோணத்தில், பாவர் 3, 6, 11-ல் — வில்ஹெல்ம், ராமன், அகர்வால் வாசிப்புகளில்',
    ],
  },
  WILHELM: {
    labelTa: 'வில்ஹெல்ம்', booksTa: 'வில்ஹெல்ம் (மு.சி. மேற்கோள்)',
    nak: { good: BATH_13, mid: [16, 17, 21, 22, 23] }, digdwar: false, taraNot: [1, 3, 5, 7, 10, 12, 14, 16, 22], chandra: NOT_CHANDRASHTAMA,
    tithi: NOT_4_8_9_14_30, vara: { good: [2, 3, 4], mid: [0, 6] },
    lagna: { good: [2, 5, 7, 8, 11], mid: [1, 4, 10] }, navMid: [0, 7, 2, 5, 8, 11], maleficIn: [3, 6], beneficIn: [1, 4, 7, 10, 5, 9],
    linesTa: [
      '"Medical- Bathing after illness" (ப.268-269): நட்சத்திரம் — அசுவினி, பரணி, கிருத்திகை, மிருகசீரிடம், திருவாதிரை, பூசம், பூரம், அஸ்தம், சித்திரை, விசாகம், மூலம், பூராடம், பூரட்டாதி; அனுஷம், கேட்டை, திருவோணம், அவிட்டம், சதயம் (மு.சி.) நடுத்தரம்',
      'ஜன்ம நட்சத்திரமும் அதிலிருந்து 3, 5, 7, 10, 12, 14, 16, 22-வதும் கூடாது; சந்திராஷ்டமம் கூடாது · திதி: 4, 8, 9, 14, அமாவாசை கூடாது · கிழமை: செவ்வாய், புதன், வியாழன்; திங்கள், வெள்ளி "மிகத் தீயவை"; ஞாயிறு (இரண்டாம் குளியலுக்கு), சனி நடுத்தரம்',
      'லக்னம்: செவ்வாய், புதன், குருவின் ராசி / நவாம்சம் (நவாம்சம் — குறிக்கப்படும்); சர ராசி கூடாது; மற்றவை நடுத்தரம் (எங்கள் வாசிப்பு) · பாவர் 3, 6-ல், சுபர் கேந்திர கோணத்தில் (குறிக்கப்படும்) · "சந்திரன் பாவராக இருக்கக் கூடாது" — கணிக்கப்படவில்லை',
    ],
  },
  KALYANRAMAN: {
    labelTa: 'கல்யாணராமன் (தொ.2)', booksTa: 'கல்யாணராமன்',
    nak: { good: BATH_KR_18, mid: [] }, digdwar: false, tithi: RIKTA, vara: { good: [0, 2, 3, 4, 6], mid: [] },
    lagna: { good: MOVABLE_SIGNS, mid: [] }, maleficIn: [1, 4, 7, 10, 5, 9], moonWeak: { from: 'LAGNA', houses: [4, 8, 12], want: false },
    linesTa: [
      '"Rogamuktha Snana" (ப.202): நட்சத்திரம் 18 (அச்சில்) — அசுவினி, பரணி, கிருத்திகை, மிருகசீரிடம், திருவாதிரை, புனர்பூசம், பூசம், பூரம், அஸ்தம், சித்திரை, விசாகம், கேட்டை, மூலம், பூராடம், திருவோணம், அவிட்டம், சதயம், பூரட்டாதி · திதி: ரிக்த · கிழமை: ஞாயிறு, செவ்வாய், புதன், வியாழன், சனி',
      'குறிப்புகள்: மு.சி. ஒன்பதைத் தவிர்க்கிறது (அதில் புனர்பூசமும் — அச்சுப் பட்டியலுடன் முரண்); சர லக்னம், கேந்திர கோணத்தில் பாவர் (குறிக்கப்படும்); சந்திரன் "க்ஷீணமாக" — 4, 8, 12-ல் — இருக்கக் கூடாது (குறிக்கப்படும்); குறிப்பு 5 "பாவர் 11, கேந்திர, கோணத்தில் கூடாது" — குறிப்பு 3-க்கு முரண், கணிக்கப்படவில்லை; செவ்வாய் பலவீனம் நல்லது (கணிக்கப்படவில்லை)',
    ],
  },
  MUHURTA_CHINTAMANI: {
    labelTa: 'முகூர்த்த சிந்தாமணி அத்.2', booksTa: 'முகூர்த்த சிந்தாமணி ஸ்லோ.2/40',
    nak: { good: BATH_MC_18, mid: [] }, digdwar: false, tithi: RIKTA, vara: { good: [0, 2, 3, 4, 6], mid: [] },
    lagna: { good: MOVABLE_SIGNS, mid: [] }, maleficIn: KENDRA_KONA_11, moonWeak: { from: 'LAGNA', houses: [4, 8, 12], want: true },
    linesTa: [
      'ஸ்லோ.2/40: "व्यन्त्यादितिध्रुवमघानिलसार्पधिष्ण्ये रिक्ते तिथौ चरतनौ विकवीन्दुवारे । स्नानं रुजा विरहितस्य जनस्य शस्तं हीने विधौ खलखगैर्भवकेन्द्रकोणे" — ரேவதி, புனர்பூசம், துருவ (ரோகிணி, மூன்று உத்திரம்), மகம், சுவாதி, ஆயில்யம் தவிர; ரிக்த திதி; சர லக்னம்; வெள்ளி, திங்கள் தவிர',
      '"हीने विधौ" — சந்திரன் க்ஷீணம் (உரை: 4, 8, 12 வீடுகளில் — லக்னத்திலிருந்து, எங்கள் வாசிப்பு; இல்லையெனில் குறிக்கப்படும்) · "खलखगैर्भवकेन्द्रकोणे" — பாவர் 11, கேந்திர, கோணத்தில் (குறிக்கப்படும்)',
    ],
  },
  JOSHI: {
    labelTa: 'ஜோஷி அத்.13', booksTa: 'ஜோஷி',
    nak: { good: BATH_KR_18, mid: [] }, digdwar: false, tithi: RIKTA, vara: { good: [0, 2, 3, 4, 6], mid: [] },
    lagna: { good: MOVABLE_SIGNS, mid: [] }, maleficIn: [1, 4, 7, 10, 5, 9],
    linesTa: [
      '"Roga-mukta Snana" (ப.147): நட்சத்திரம் 18 (கல்யாணராமனின் பட்டியலே) · திதி: ரிக்த "நல்லவை" · கிழமை: ஞாயிறு, செவ்வாய், புதன், வியாழன், சனி',
      'லக்னம்: சர ராசி, பாவர் (சூரியன், செவ்வாய், சனி, ராகு, கேது) கேந்திர கோணத்தில் (குறிக்கப்படும்) · செவ்வாய் கோசாரத்தில் பலவீனம் நல்லது (கணிக்கப்படவில்லை)',
    ],
  },
  RANGACHARYA: {
    labelTa: 'ரங்காச்சார்யா', booksTa: 'ரங்காச்சார்யா',
    nak: { good: BATH_MC_18, mid: [] }, digdwar: false, tithi: RIKTA, vara: { good: [0, 2, 3, 4, 6], mid: [] },
    lagna: { good: MOVABLE_SIGNS, mid: [] }, maleficIn: KENDRA_KONA_11, moonWeak: { from: 'LAGNA', houses: [4, 8, 12], want: true },
    linesTa: [
      '"First bath after illness" (ப.133): ரேவதி, புனர்பூசம், உத்திரம், உத்திராடம், உத்திரட்டாதி, ரோகிணி, மகம், சுவாதி, ஆயில்யம், வெள்ளி, திங்கள் கூடாது',
      'அச்சில் "Avoid the rikta tithis, Sunday, Tuesday, Wednesday, Thursday and Saturday" — அப்படியெனில் எந்தக் கிழமையும் மிஞ்சாது; மு.சி.யைப் போல "ரிக்த திதி, ஞாயிறு, செவ்வாய், புதன், வியாழன், சனி நல்லவை" என்று படித்தோம் (எங்கள் வாசிப்பு) · சர லக்னம், சந்திரன் பலவீனம் (மு.சி. உரைப்படி 4, 8, 12 — குறிக்கப்படும்), கேந்திர, கோண, 11-ல் பாவர் (குறிக்கப்படும்) · தாரா, சந்திர பலம் அவசியம் (பொது)',
    ],
  },
  RAMAN: {
    labelTa: 'ராமன் அத்.XV', booksTa: 'ராமன்',
    nak: { good: BATH_13, mid: [] }, digdwar: false, tithi: NOT_4_8_9_14_30, vara: { good: [2, 3, 4], mid: [] }, chandra: NOT_CHANDRASHTAMA,
    linesTa: [
      '"Taking First Bath after illness" (PDF ப.53-54): அசுவினி, பரணி, கிருத்திகை, மிருகசீரிடம், திருவாதிரை, பூசம், பூரம், அஸ்தம், சித்திரை, விசாகம், மூலம், பூராடம், பூரட்டாதி · தாரா பலம் (பொது); சந்திராஷ்டமம் கூடாது · செவ்வாய், புதன், வியாழன் · 4, 8, 9, 14, அமாவாசை கூடாது',
    ],
  },
  AGARWAL: {
    labelTa: 'அகர்வால்', booksTa: 'அகர்வால்',
    nak: { good: BATH_13, mid: [] }, digdwar: false, tithi: ALL_TITHIS.filter((t) => ![...bothPakshas([1, 4, 8, 9, 14]), 30].includes(t)),
    vara: { good: [0, 2, 3, 4], mid: [] }, chandra: NOT_CHANDRASHTAMA,
    linesTa: [
      '"Taking first bath after prolonged illness" (ப.329): ஞாயிறு, செவ்வாய், புதன், வியாழன் · 1, 4, 8, 9, 14, அமாவாசை தவிர எல்லாத் திதியும் · மூன்று பூர்வம், பரணி, கிருத்திகை, திருவாதிரை, மிருகசீரிடம், பூசம், சித்திரை, அஸ்தம், அசுவினி, மூலம், விசாகம் · சந்திராஷ்டமம் கூடாது',
    ],
  },
});

// ---------------------------------------------------------------------------
// Vehicles, added 2026-10-14
// ---------------------------------------------------------------------------

/** Shridhar §25.5's stars: Small (Hasta, Ashwini, Pushya; Abhijit), Movable, Sweet, Rohini, Jyeshtha, Vishakha. */
const CHARIOT_STARS = Object.freeze([12, 0, 7, 6, 14, 21, 23, 22, 4, 13, 16, 26, 3, 17, 15]);
/** Nanda, Jaya and Poorna in both halves; the new Moon Shridhar leaves out (p.29: Pitri works only). */
const NANDA_JAYA_POORNA = Object.freeze([...bothPakshas([1, 6, 11, 3, 8, 13, 5, 10]), 15]);
const SHRIDHAR_CHARIOT = deepFreeze({
  labelTa: 'ஸ்ரீதர் §25.5', booksTa: 'ஸ்ரீதர் (B.J.S. மேற்கோள்)',
  nak: { good: CHARIOT_STARS, mid: [] }, abhijitOk: true, digdwar: false, tithi: NANDA_JAYA_POORNA,
  vara: { good: [0, 1, 3, 4, 5], mid: [] }, lagna: { good: [2, 5, 8, 11, 1, 6], mid: [] },
  noteTa: 'B.J.S.: ஞாயிறு வாகனம் ஓட்டத் தொடங்கச் "சிறப்பு" (கணிக்கப்படவில்லை) · பூர்ண திதியில் அமாவாசை — ஸ்ரீதர் ப.29: சுப காரியத்துக்கு இல்லை',
});
const VEHICLE = deepFreeze({
  labelTa: 'புது வாகனம் — வாங்குதல், முதலில் ஓட்டுதல்',
  default: 'WILHELM',
  order: ['WILHELM', 'SHRIDHAR', 'VASHISTHA', 'KALYANRAMAN_BUY', 'KALYANRAMAN', 'JOSHI', 'AGARWAL', 'RANGACHARYA', 'MUHURTA_CHINTAMANI', 'RAMAN'],
  WILHELM: {
    labelTa: 'வில்ஹெல்ம் — வாகனம் ஓட்டுதல்', booksTa: 'வில்ஹெல்ம்',
    nak: { good: [0, 3, 4, 6, 9, 11, 12, 13, 14, 16, 20, 21, 25, 26], mid: [7, 15, 22] }, digdwar: false,
    tithi: bothPakshas([2, 3, 5, 7, 10, 12]), tithiMid: bothPakshas([13]), tithiNot: [...bothPakshas([1, 4, 6, 9, 11, 14]), 15],
    vara: { good: [1, 3, 4, 5], mid: [6] }, lagna: { good: [1, 2, 3, 5, 6], mid: [9], natalMoonOk: true }, navMid: [1, 2, 5, 6, 8, 11],
    noteTa: 'புதன், குரு, சுக்கிரனின் நவாம்சம் "மிகச் சிறந்தது" (குறிக்கப்படும்) · சுக்கிரன் கேந்திர / கோணத்தில், ஆட்சி / உச்சம் / நட்பு ராசியில் — "மிக நல்லது" (கணிக்கப்படவில்லை) · அஷ்டமியும் அமாவாசையும் அச்சில் இல்லை — நடுத்தரம் (எங்கள் வாசிப்பு)',
  },
  SHRIDHAR: SHRIDHAR_CHARIOT,
  VASHISTHA: {
    labelTa: 'வசிஷ்டா', booksTa: 'வசிஷ்டா',
    tithi: [...bothPakshas([2, 3, 5, 6, 7, 8, 10, 11, 12, 13]), 16, 15], vara: { good: [0, 1, 3, 4, 5], mid: [] },
    nak: { good: [8, 4, 6, 7, 12, 13, 14, 21, 22, 23, 26, 16, 3], mid: [] }, digdwar: false,
    lagna: { good: [0, 3, 6, 9, 2, 5, 8, 11], mid: [] }, empty: [8], notIn: [[M5, [4], true]],
    noteTa: 'சந்திரன், சுக்கிரன் பலம்; வாகன உரிமையாளரின் பெயர் — கணிக்கப்படவில்லை · 4-ஆம் வீடு "பாதிப்பின்றி" — பாவர் இல்லாமல் (குறிக்கப்படும், எங்கள் வாசிப்பு) · நட்சத்திரப் பட்டியலில் ஆயில்யம் உண்டு, அசுவினி இல்லை — அச்சில் உள்ளபடி',
  },
  KALYANRAMAN_BUY: {
    labelTa: 'கல்யாணராமன் — வாங்குதல், ஓட்டப் பழகுதல்', booksTa: 'கல்யாணராமன் (தொ.2)',
    nak: { good: [0, 4, 6, 7, 12, 14, 22, 23, 26], mid: [] }, digdwar: false,
    tithi: [...tithiBoth([1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13]), 15], vara: { good: [0, 1, 3, 4, 5, 6], mid: [] },
    noteTa: 'தலைப்பு: குதிரை ஏற்றம், வாகனம் வாங்குதல் / விற்றல், ஓட்டப் பழகுதல் · சந்திர, தாரா சுத்தி (பொது) · செவ்வாய், ரிக்த கூடாது',
  },
  KALYANRAMAN: {
    labelTa: 'கல்யாணராமன் — புது வாகனம் ஓட்டுதல்', booksTa: 'கல்யாணராமன் (தொ.2)',
    nak: { good: [0, 2, 3, 4, 5, 9, 11, 12, 13, 14, 16, 18, 19, 20, 22, 24, 25, 26], mid: [] }, digdwar: false,
    tithi: [...tithiBoth([1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13]), 15], vara: { good: [0, 1, 3, 4, 5], mid: [] },
  },
  MUHURTA_CHINTAMANI: {
    labelTa: 'மு.சி. ஸ்லோ.2/4, 2/9 — சர, திர்யக் நட்சத்திரம்', booksTa: 'முகூர்த்த சிந்தாமணி (பொதுப் பட்டியல்)',
    nak: { good: [6, 14, 21, 22, 23], mid: [0, 12, 16, 17] }, digdwar: false, vara: { good: [1], mid: [0, 2, 3, 4, 5, 6] },
    noteTa: 'பொதுப் பட்டியல் (வாகனத்துக்குத் தனிப் பகுதி இல்லை): ஸ்லோ.2/4 — சர நட்சத்திரம், திங்கள் "யானை முதலியவற்றில் ஏறுதல்"; ஸ்லோ.2/9 உரை — திர்யக் முக நட்சத்திரம் "மோட்டார் பஸ் ஓட்டப் பழகுதல்" (உரையில் மட்டும் — நடுத்தரம்) · மற்ற கிழமை நடுத்தரம் (எங்கள் வாசிப்பு)',
  },
  JOSHI: {
    labelTa: 'ஜோஷி அத்.2 — நட்சத்திர, ராசி இயல்பு', booksTa: 'ஜோஷி (பொதுப் பட்டியல்)',
    nak: { good: [0, 4, 6, 7, 12, 13, 14, 16, 17, 21, 22, 23, 26], mid: [] }, abhijitOk: true, digdwar: false,
    vara: { good: [1, 4], mid: [0, 2, 3, 5, 6] }, lagna: { good: [0, 3, 6, 9], mid: [1, 2, 4, 5, 7, 8, 10, 11] },
    noteTa: 'பொதுப் பட்டியல் (வாங்குதல் / ஓட்டுதலுக்குத் தனிப் பகுதி இல்லை; ப.107 தயாரித்தல் / வியாபாரம் மட்டும்): சர நட்சத்திரம், திங்கள் — "வாகனம், குதிரை, யானை ஏறுதல்"; க்ஷிப்ரம் (அபிஜித், வியாழன்) — "சர காரியங்களும்"; திர்யக் முகம் — "ஏறுதல், ஓட்டுதல்"; சர ராசி லக்னம் — "ஏறுதல், ஓட்டுதல்" · மற்ற கிழமை, லக்னம் நடுத்தரம் (எங்கள் வாசிப்பு)',
  },
  RAMAN: {
    labelTa: 'ராமன் அத்.IV — சர நட்சத்திரம்', booksTa: 'ராமன் (பொதுப் பட்டியல்)',
    nak: { good: [6, 14, 21, 22, 23], mid: [] }, digdwar: false,
    noteTa: 'பொதுப் பட்டியல் (வாகனத்துக்குத் தனிப் பகுதி இல்லை): சர நட்சத்திரங்கள் "வாகனம் பெறுதலுக்கு" · திதி, கிழமை — விதி இல்லை',
  },
  RANGACHARYA: {
    labelTa: 'ரங்காச்சார்யா — திதி, நட்சத்திர வகைகள்', booksTa: 'ரங்காச்சார்யா (பொதுப் பட்டியல்)',
    nak: { good: [0, 4, 6, 7, 12, 13, 14, 16, 17, 21, 22, 23, 26], mid: [] }, abhijitOk: true, digdwar: false,
    tithi: bothPakshas([2, 7, 12]), tithiNot: [],
    noteTa: 'பொதுப் பட்டியல் (வாகனத்துக்குத் தனிப் பகுதி இல்லை): பத்ர திதி (2, 7, 12) — "வாகனம் சம்பந்தமான காரியங்கள்"; சர நட்சத்திரம் — "வாகனம் ஓட்டுதல்"; லகு (அபிஜித் உட்பட) — "சர காரியங்களும்"; திர்யக் — "மோட்டார் சைக்கிள் ஓட்டுதல்" · மற்ற திதி நடுத்தரம் (எங்கள் வாசிப்பு) · கிழமை — விதி இல்லை',
  },
  AGARWAL: {
    labelTa: 'அகர்வால் — நட்சத்திர வகைகள்', booksTa: 'அகர்வால் (பொதுப் பட்டியல்)',
    nak: { good: [0, 4, 6, 7, 12, 13, 14, 16, 17, 21, 22, 23, 26], mid: [] }, abhijitOk: true, digdwar: false,
    noteTa: 'பொதுப் பட்டியல் (வாகனத்துக்குத் தனிப் பகுதி இல்லை): சரம் — "வாகனம், குதிரை, யானை ஏறுதல்; தொழிற்சாலை / இயந்திரம் / வாகனம் தொடங்குதல்"; க்ஷிப்ரம் (அபிஜித்) — "சரத்தின் காரியங்களும்"; திர்யக் — "ஏறுதல், ஓட்டுதல், பயணம்" · திதி, கிழமை — விதி இல்லை',
  },
});
const VEHICLE_MAKE = deepFreeze({
  labelTa: 'வாகனம் — தயாரித்தல், வாகன வியாபாரம்',
  default: 'KALYANRAMAN',
  order: ['KALYANRAMAN', 'SHRIDHAR', 'JOSHI', 'WILHELM'],
  KALYANRAMAN: {
    labelTa: 'கல்யாணராமன் (தொ.2)', booksTa: 'கல்யாணராமன்',
    nak: { good: CHARIOT_STARS, mid: [] }, abhijitOk: true, digdwar: false,
    tithi: [...bothPakshas([1, 6, 11, 3, 8, 13, 5, 10]), 15, 30], vara: { good: [0], mid: [] },
    lagna: { good: [1, 2, 5, 6, 8, 11], mid: [0, 3, 4, 7, 9, 10] },
    noteTa: 'கிழமை அச்சில் ஞாயிறு மட்டும் · லக்னம் 2, 3, 6, 7, 9, 12 "விருப்பம்" (மற்றவை நடுத்தரம்) · பூர்ண திதியில் அமாவாசையும் (அச்சில் உள்ளபடி)',
  },
  SHRIDHAR: SHRIDHAR_CHARIOT,
  JOSHI: {
    labelTa: 'ஜோஷி (ப.107)', booksTa: 'ஜோஷி',
    nak: { good: CHARIOT_STARS, mid: [] }, abhijitOk: true, digdwar: false, tithi: NANDA_JAYA_POORNA,
    vara: { good: [0], mid: [] }, lagna: { good: [1, 2, 5, 6, 8, 11], mid: [] },
    noteTa: 'வாகனம் தயாரித்தல், வியாபாரம் "எல்லாம்" · பூர்ணா 5, 10, 15 (அமாவாசை அச்சில் இல்லை) · கிழமை ஞாயிறு மட்டும்',
  },
  WILHELM: {
    labelTa: 'வில்ஹெல்ம் — வாகனம் தயாரித்தல்', booksTa: 'வில்ஹெல்ம்',
    nak: { good: [0, 3, 4, 6, 7, 12, 13, 14, 15, 16, 17, 21, 22, 23, 26], mid: [] }, digdwar: false,
    tithi: bothPakshas([1, 3, 5, 6, 10, 11, 13]), tithiMid: [...bothPakshas([2, 7]), 15], lagna: { good: [1, 2, 5, 6, 8, 11], mid: [] },
    noteTa: 'கிழமை — விதி இல்லை · சொல்லப்படாத திதிகள் கூடாது (எங்கள் வாசிப்பு)',
  },
});

// ---------------------------------------------------------------------------
// Clothes and ornaments, added 2026-10-14
// ---------------------------------------------------------------------------

/** MC 2/10: Revati, Ashwini, Hasta's five (to Anuradha), Dhanishtha, Pushya, Punarvasu; the Dhruvas (the English and notes). */
const CLOTHES_MC = deepFreeze({
  labelTa: 'முகூர்த்த சிந்தாமணி ஸ்லோ.2/10', booksTa: 'முகூர்த்த சிந்தாமணி',
  nak: { good: [26, 0, 12, 13, 14, 15, 16, 22, 7, 6, 3, 11, 20, 25], mid: [] }, digdwar: false,
  tithi: NOT_RIKTA, vara: { good: [0, 3, 4, 5], mid: [] },
  noteTa: 'பவளம், யானைத் தந்தம், சங்கு, தங்கம், ஆடை — இதே விதி · துருவ நட்சத்திரங்கள் ஆங்கில உரையிலும் குறிப்பிலும் (ஸ்லோகம்: "ध्रुवादितियुगे सुभगा न दध्यात्" — சுமங்கலிக்குத் துருவம், புனர்பூசம், பூசம் கூடாது; கணிக்கப்படவில்லை) · சிவப்பு ஆடைக்குச் செவ்வாய் நல்லது',
});
/** Joshi ch.13: fixed, short (with Abhijit), Revati, Chitra, Anuradha, Swati, Punarvasu, Dhanishtha, Vishakha. */
const CLOTHES_JOSHI = deepFreeze({
  labelTa: 'ஜோஷி அத்.13', booksTa: 'ஜோஷி',
  nak: { good: [11, 20, 25, 3, 12, 0, 7, 26, 13, 16, 14, 6, 22, 15], mid: [] }, abhijitOk: true, digdwar: false,
  tithi: NOT_RIKTA_AMAVASYA, vara: { good: [0, 1, 4, 5], mid: [] }, yogaNot: [16, 26], vishti: true,
  noteTa: 'ஆடை, ஆபரணம் இரண்டுக்கும் · திதி-வார-நட்சத்திரத் தீய யோகங்கள் — கணிக்கப்படவில்லை · சந்திர, தாரா சுத்தி (பொது) · சுமங்கலி ஞாயிறு, மூன்று உத்திரம், ரோகிணி, புனர்பூசம், பூசத்தில் கூடாது (கணிக்கப்படவில்லை)',
});
/** Kalyanraman p.235, "Making and Wearing new Ornaments". */
const ORNAMENTS_KR = deepFreeze({
  labelTa: 'கல்யாணராமன் (தொ.2 ப.235)', booksTa: 'கல்யாணராமன் (மு.சி., காலப்பிரகாசிகை மேற்கோள்கள்)',
  nak: { good: [0, 3, 6, 7, 11, 12, 14, 20, 21, 22, 23, 25], mid: [] }, abhijitOk: true, digdwar: false,
  tithi: NOT_RIKTA_AMAVASYA, vara: { good: [1, 3, 4, 5], mid: [0] }, yogaNot: [16, 26],
  noteTa: 'செவ்வாய், சனி கூடாது; ஞாயிறு நடுத்தரம் · மு.சி.: திரிபுஷ்கர யோக நாள் விருப்பம்; வைரம், ரத்தினம் — தீக்ஷ்ண, உக்ர நட்சத்திரம், ஞாயிறு / செவ்வாய், மேஷ / விருச்சிக / சிம்ம லக்னம்; முத்து — சர, மிருது, துருவ, க்ஷிப்ர · காலப்பிரகாசிகை: 1, 5, 6, 10, 11, 15; லக்னம் ரிஷபம், மிதுனம், கன்னி, தனுசு, மீனம் — வில்ஹெல்மின் வாசிப்பில்',
});
const NEW_CLOTHES = deepFreeze({
  labelTa: 'புது ஆடை அணிதல்',
  default: 'SHRIDHAR',
  order: ['SHRIDHAR', 'WILHELM', 'KALYANRAMAN', 'MUHURTA_CHINTAMANI', 'JOSHI', 'RAMAN', 'VASHISTHA', 'RANGACHARYA', 'AGARWAL'],
  SHRIDHAR: {
    labelTa: 'ஸ்ரீதர் §19.14.1', booksTa: 'ஸ்ரீதர் (K.P., M.G. மேற்கோள்கள்)',
    tithi: bothPakshas([2, 3, 5, 7, 10, 11, 13]), tithiNot: [...RIKTA, 30], vara: { good: [3, 4, 5], mid: [0, 1] },
    nak: { good: [3, 11, 20, 25, 12, 0, 7, 6, 13, 14, 15, 16, 22, 26], mid: [] }, digdwar: false, lagna: { good: [1, 2, 5, 6, 10, 11], mid: [] },
    noteTa: 'அச்சில் ரிக்த "4, 9, 13" — 4, 9, 14 என்று படித்தோம் · ஞாயிறு "நடுத்தரம்", பின் "ஞாயிறு, செவ்வாய் கூடாது" — நடுத்தரம் (எங்கள் வாசிப்பு); சனி சொல்லப்படவில்லை — கூடாது · மனைவி அணியும்போது கணவனின் ஜன்ம ராசிக்கு 4, 8, 12-ல் சந்திரன் கூடாது (கணிக்கப்படவில்லை) · பட்டு, கம்பளி, சிவப்பு, கருப்பு ஆடைகளுக்குத் தனி நட்சத்திரங்கள் — குறிப்புகளில்',
  },
  WILHELM: {
    labelTa: 'வில்ஹெல்ம்', booksTa: 'வில்ஹெல்ம்',
    nak: { good: [0, 3, 6, 7, 11, 12, 13, 14, 15, 16, 20, 22, 25, 26], mid: [] }, digdwar: false,
    tithi: bothPakshas([2, 3, 5, 7, 10, 11, 12]), tithiNot: [...RIKTA, 30], vara: { good: [3, 4, 5], mid: [0, 1] },
    lagna: { good: [1, 2, 3, 5, 6], mid: [9], natalMoonOk: true }, navMid: [1, 2, 5, 6, 8, 11],
    noteTa: 'சுமங்கலிக்கு ரோகிணி, புனர்பூசம், பூசம், மூன்று உத்திரம் கூடாது — சிலர் (கணிக்கப்படவில்லை) · சுக்கிரன் கேந்திர / கோணத்தில் ஆட்சி / உச்சம் / நட்பில் — "மிக நல்லது" (கணிக்கப்படவில்லை) · திருமணம், அரசனைக் காணல் — முகூர்த்தம் பார்க்க வேண்டாம்',
  },
  KALYANRAMAN: {
    labelTa: 'கல்யாணராமன் (தொ.2 ப.237)', booksTa: 'கல்யாணராமன் (மு.சி., காலப்பிரகாசிகை மேற்கோள்கள்)',
    nak: { good: [0, 3, 6, 7, 11, 12, 13, 14, 15, 16, 20, 22, 25, 26], mid: [] }, abhijitOk: true, digdwar: false,
    tithi: [...tithiBoth([1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13]), 15], vara: { good: [0, 1, 4, 5], mid: [] },
    noteTa: 'புது ஆடை, ஆபரணம் பெறுதல், தயாரித்தல், அணிதல் · காலப்பிரகாசிகை (குறிப்பு 4): 2, 3, 5, 7, 10, 11, 13; 4, 9, 14, அமாவாசை "கண்டிப்பாக" கூடாது; ஞாயிறு, திங்கள் நடுத்தரம், புதன் ஏற்கத்தக்கது; மேஷ, சிம்ம, விருச்சிக, தனுசு, கும்ப லக்னம் கூடாது · சந்திர, தாரா சுத்தி (பொது) · சுமங்கலிக்குத் தனி வாசிப்பு (ப.238) — கணிக்கப்படவில்லை',
  },
  MUHURTA_CHINTAMANI: CLOTHES_MC,
  JOSHI: CLOTHES_JOSHI,
  RAMAN: {
    labelTa: 'ராமன் அத்.X', booksTa: 'ராமன்',
    nak: { good: [0, 3, 6, 7, 11, 12, 13, 14, 15, 22, 26], mid: [] }, digdwar: false,
    tithi: ALL_TITHIS.filter((t) => ![...RIKTA, 30].includes(t)), vara: { good: [1, 3, 4, 5], mid: [0] },
    noteTa: 'செவ்வாய், சனி "அசுபம்" · சந்திரன் சூரியனுடன் நல்ல பார்வையில் — "முடிந்தவரை" (கணிக்கப்படவில்லை)',
  },
  RANGACHARYA: {
    labelTa: 'ரங்காச்சார்யா', booksTa: 'ரங்காச்சார்யா',
    nak: { good: [12, 13, 14, 15, 16, 22, 26, 7, 0, 11, 20, 25, 6, 3], mid: [] }, digdwar: false, vara: { good: [0, 3, 4, 5], mid: [] },
    noteTa: 'பெண்களுக்கு அஸ்தம், சித்திரை, சுவாதி, விசாகம், அனுஷம், அவிட்டம், ரேவதி மட்டும்; ஆண்களுக்கு இவற்றுடன் பூசம், அசுவினி, மூன்று உத்திரம், புனர்பூசம், ரோகிணி (கணிப்பது ஆண்களின் பட்டியல்) · திதி — விதி இல்லை',
  },
  VASHISTHA: {
    labelTa: 'வசிஷ்டா — திதி, கிழமை, நட்சத்திரப் பட்டியல்கள்', booksTa: 'வசிஷ்டா (பியூஷதாரா மேற்கோள்; பொதுப் பட்டியல்)',
    nak: { good: [3, 4, 5, 8, 11, 13, 16, 17, 20, 25, 26], mid: [] }, digdwar: false,
    tithi: [...bothPakshas([1, 6, 10, 11]), 13], tithiNot: [30], vara: { good: [0, 4, 5], mid: [1, 2, 3, 6] },
    noteTa: 'பொதுப் பட்டியல் (புது ஆடைக்குத் தனிப் பகுதி இல்லை): திதி — சஷ்டி ("ஆடை"), தசமி ("வஸ்திரம்"), வளர் திரயோதசி, நந்தா (1, 6, 11); அமாவாசையில் சுப காரியம் கூடாது · கிழமை — ஞாயிறு, வியாழன், வெள்ளி · நட்சத்திரம் — துருவம், மிருது, தீக்ஷ்ணம் (அச்சில் உள்ளபடி; மூலம் எந்த வகையிலும் இல்லை) · மற்ற திதி, கிழமை நடுத்தரம் (எங்கள் வாசிப்பு)',
  },
  AGARWAL: {
    labelTa: 'அகர்வால் — நட்சத்திர வகைகள்', booksTa: 'அகர்வால் (பொதுப் பட்டியல்)',
    nak: { good: [3, 4, 11, 13, 16, 20, 25, 26], mid: [] }, digdwar: false,
    noteTa: 'பொதுப் பட்டியல் (புது ஆடைக்குத் தனிப் பகுதி இல்லை): மிருது — "ஆடை செய்தல், அணிதல்"; ஸ்திரம் — "மிருதுவின் காரியங்களும்" · திதி, கிழமை — விதி இல்லை',
  },
});
const NEW_ORNAMENTS = deepFreeze({
  labelTa: 'புது ஆபரணம் அணிதல்',
  default: 'KALYANRAMAN',
  order: ['KALYANRAMAN', 'SHRIDHAR', 'WILHELM', 'MUHURTA_CHINTAMANI', 'VASHISTHA', 'JOSHI', 'AGARWAL', 'RANGACHARYA', 'RAMAN'],
  KALYANRAMAN: ORNAMENTS_KR,
  SHRIDHAR: {
    labelTa: 'ஸ்ரீதர் §19.13.1', booksTa: 'ஸ்ரீதர் (J.V., B.J.S., K.P., பாதராயணர் மேற்கோள்கள்)',
    vara: { good: [4, 5], mid: [0, 1, 2, 3] }, tithi: [...bothPakshas([1, 5, 6, 10, 11]), 15],
    nak: { good: [12, 13, 14, 15, 16, 22, 0, 26], mid: [9, 5, 21, 4, 23, 10, 7, 19, 11, 20, 25, 6, 3] }, digdwar: false,
    lagna: { good: [1, 2, 5, 8, 11], mid: [] }, empty: [8],
    noteTa: 'வியாழன், வெள்ளி "பெரும்பாலோர்"; ஞாயிறு, செவ்வாய் (J.V.), புதன் (B.J.S.), திங்கள் (J.V.) — நடுத்தரம் · நட்சத்திரம்: J.V.-யின் எட்டு; பெண்களின் ரத்தின ஆபரணம் (மகம், திருவாதிரை …), பாதராயணரின் தங்கம் (பூசம், பூராடம், மூன்று உத்திரம் …) — நடுத்தரம் · K.P.: 8 காலி; சுக்கிரன் கேந்திர / கோணத்தில் ஆட்சி / உச்சத்தில் (கணிக்கப்படவில்லை) · சுமங்கலி ரோகிணி, மூன்று உத்திரம், பூசம், புனர்பூசம், செவ்வாயில் கூடாது (கணிக்கப்படவில்லை)',
  },
  WILHELM: {
    labelTa: 'வில்ஹெல்ம்', booksTa: 'வில்ஹெல்ம்',
    nak: { good: [0, 3, 4, 6, 7, 9, 11, 12, 13, 14, 16, 20, 21, 25, 26], mid: [] }, digdwar: false,
    tithi: [...bothPakshas([1, 5, 6, 10, 11]), 15], vara: { good: [1, 3, 4, 5], mid: [] },
    lagna: { good: [1, 2, 5, 8, 11], mid: [3, 6] }, navGood: [3, 2, 5, 8, 11, 1, 6], empty: [8], beneficIn: [1, 4, 7, 10, 5, 9], maleficIn: [3, 6, 11],
    noteTa: 'சாதாரண ஆபரணத்துக்கு: 4, 9, 14, அமாவாசை மட்டும் கூடாது, ஞாயிறும் ஏற்கலாம், கடகம் / துலாம் நல்லது (கணிப்பது முழு விதி) · ஜன்ம நட்சத்திரமும் 10-வதும் நல்லவை (பொதுப் பகுதி விலக்கும்) · கிரக சாந்திக்கான ஆபரணம்: குரு லக்னத்தில், சூரியன் 10-ல், சந்திரன் 4-ல்; குரு / சுக்கிரன் அஸ்தங்கம் கூடாது (கணிக்கப்படவில்லை)',
  },
  MUHURTA_CHINTAMANI: CLOTHES_MC,
  JOSHI: CLOTHES_JOSHI,
  VASHISTHA: {
    labelTa: 'வசிஷ்டா — திதி, கிழமை, நட்சத்திரப் பட்டியல்கள்', booksTa: 'வசிஷ்டா (பியூஷதாரா மேற்கோள்; பொதுப் பட்டியல்)',
    nak: { good: [0, 3, 5, 7, 8, 11, 12, 17, 20, 25], mid: [6, 14, 21, 22, 23] }, abhijitOk: true, digdwar: false,
    tithi: [...bothPakshas([2, 3, 5, 6, 7, 10, 12]), 13, 15], tithiNot: [30], vara: { good: [1, 4, 5], mid: [0, 2, 3, 6] },
    noteTa: 'பொதுப் பட்டியல் (ஆபரணத்துக்குத் தனிப் பகுதி இல்லை): திதி — துவிதியை, திருதியை, சஷ்டி, சப்தமி, தசமி, வளர் திரயோதசி, பௌர்ணமி, பத்ரா (2, 7, 12); பஞ்சமி (2, 3-ன் காரியங்கள்); அமாவாசை கூடாது · கிழமை — திங்கள், வியாழன், வெள்ளி · நட்சத்திரம் — துருவம், க்ஷிப்ரம் (அபிஜித்), தீக்ஷ்ணம்; சரம் "தங்கம், வெள்ளி, ரத்தின ஆபரணம் பெறுதல்" — நடுத்தரம் · மற்ற திதி, கிழமை நடுத்தரம் (எங்கள் வாசிப்பு)',
  },
  RANGACHARYA: {
    labelTa: 'ரங்காச்சார்யா — திதி, நட்சத்திர வகைகள்', booksTa: 'ரங்காச்சார்யா (பொதுப் பட்டியல்)',
    nak: { good: [3, 5, 8, 11, 17, 18, 20, 25], mid: [] }, digdwar: false, tithi: bothPakshas([2, 7, 11, 12]), tithiNot: [13, 28],
    noteTa: 'பொதுப் பட்டியல் (ஆபரணத்துக்குத் தனிப் பகுதி இல்லை): பத்ர திதி (2, 7, 12) — "ஆபரணம் அணிதல்"; ஏகாதசி — "புது ஆடை, ஆபரணம்"; திரயோதசியில் கூடாது; மற்ற திதி நடுத்தரம் (எங்கள் வாசிப்பு) · ஸ்திர நட்சத்திரம் — "புது ஆடை, ஆபரணம்"; தீக்ஷ்ணம் — "தங்க ஆபரணம் அணிதல்" (அச்சில் உள்ளபடி) · அஷ்டமி "dance ornaments" — தெளிவில்லை, சேர்க்கவில்லை · கிழமை — விதி இல்லை',
  },
  RAMAN: {
    labelTa: 'ராமன் அத்.IV — லகு நட்சத்திரம்', booksTa: 'ராமன் (பொதுப் பட்டியல்)',
    nak: { good: [0, 7, 12], mid: [] }, abhijitOk: true, digdwar: false,
    noteTa: 'பொதுப் பட்டியல்: லகு நட்சத்திரங்கள் "ஆபரணம் அணிதலுக்கு" · ஆபரணம் வாங்குதல் (அத்.X) — வாங்குதல் குடும்பத்தில் வரும் · திதி, கிழமை — விதி இல்லை',
  },
  AGARWAL: {
    labelTa: 'அகர்வால் — நட்சத்திர வகைகள்', booksTa: 'அகர்வால் (பொதுப் பட்டியல்)',
    nak: { good: [0, 3, 4, 6, 7, 11, 12, 13, 14, 16, 20, 21, 22, 23, 25, 26], mid: [] }, abhijitOk: true, digdwar: false,
    noteTa: 'பொதுப் பட்டியல் (ஆபரணத்துக்குத் தனிப் பகுதி இல்லை): க்ஷிப்ரம் (அபிஜித்), மிருது — "ஆபரணம் செய்தல், அணிதல்"; சரம் — "க்ஷிப்ரத்தின் காரியங்களும்"; ஸ்திரம் — "மிருதுவின் காரியங்களும்" · திதி, கிழமை — விதி இல்லை',
  },
});
const ORNAMENT_MAKING = deepFreeze({
  labelTa: 'ஆபரணம் செய்தல் (தங்கம், ரத்தினம், முத்து)',
  default: 'KALYANRAMAN',
  order: ['KALYANRAMAN', 'WILHELM', 'JOSHI', 'SHRIDHAR', 'MUHURTA_CHINTAMANI', 'AGARWAL', 'VASHISTHA', 'RANGACHARYA'],
  KALYANRAMAN: ORNAMENTS_KR,
  JOSHI: {
    labelTa: 'ஜோஷி (ப.107-108) — பொன் வேலை', booksTa: 'ஜோஷி',
    nak: { good: [14, 6, 21, 22, 23, 15, 2, 12, 0, 7, 4, 13], mid: [] }, abhijitOk: true, digdwar: false,
    vara: { good: [0, 2, 4, 5], mid: [] }, lagna: { good: [0, 1, 4, 6, 7, 8, 11], mid: [] },
    want: [{ planets: ['Jupiter', 'Moon'], houses: [1], all: true, code: 'JUP_MOON_LAGNA_MID' }],
    noteTa: 'குரு, சந்திரன் லக்னத்தில் "பலமாக" (இருப்பு குறிக்கப்படும்; பலம் கணிக்கப்படவில்லை) · வெள்ளி நகை, செயற்கை ஆபரணம் தயாரித்தல் / வியாபாரத்துக்கும் இதே விதி · ரத்தினம் வெட்டுதல் (ப.107) — கைத்தொழில் குடும்பத்தில்',
  },
  WILHELM: {
    labelTa: 'வில்ஹெல்ம் — ஆபரணம் செய்தல்', booksTa: 'வில்ஹெல்ம்',
    nak: { good: [0, 3, 6, 7, 11, 12, 14, 20, 21, 22, 23, 25], mid: [4, 13, 16, 26] }, digdwar: false,
    vara: { good: [1, 3, 4, 5], mid: [0, 2] }, lagna: { good: [1, 2, 5, 6, 8, 11], mid: [] },
    noteTa: 'தங்கம்: அசுவினி, மிருகசீரிடம், … சதயம் "மிகச் சிறந்தவை"; ஞாயிறு, செவ்வாய், வியாழன், வெள்ளி; மேஷம், ரிஷபம், சிம்மம், துலாம், விருச்சிகம், தனுசு, மீனம் · முத்து: மிருகசீரிடம், சித்திரை, அனுஷம், ரேவதியும் · ரத்தினம், வைரம்: பரணி, திருவாதிரை, ஆயில்யம், மகம், பூரம், கேட்டை, மூலம், பூராடம், பூரட்டாதி கூடாது; ஞாயிறு, செவ்வாய்; மேஷம், சிம்மம், விருச்சிகம் · குரு / சுக்கிரன் பாதிப்பு கூடாது (ரத்தினம், முத்து, தந்தம்) — கணிக்கப்படவில்லை',
  },
  SHRIDHAR: {
    labelTa: 'ஸ்ரீதர் §19.13.2', booksTa: 'ஸ்ரீதர் (M.M. மேற்கோள்)',
    nak: { good: [0, 3, 4, 6, 7, 11, 20, 25, 12, 13, 14, 15, 16, 21, 22, 23, 26], mid: [] }, digdwar: false, vara: { good: [1, 3, 4, 5], mid: [] },
    noteTa: 'ரத்தின ஆபரணம்: இவற்றுடன் கிருத்திகை; சனி தவிர எல்லாக் கிழமையும்; திரிபுஷ்கர யோகம் நல்லது · முத்து, வைரம் பதித்த வெள்ளி: விசாகம், கிருத்திகை தவிர; வெள்ளி, வியாழன் (M.M.)',
  },
  MUHURTA_CHINTAMANI: {
    labelTa: 'முகூர்த்த சிந்தாமணி ஸ்லோ.2/16', booksTa: 'முகூர்த்த சிந்தாமணி',
    nak: { good: [6, 14, 21, 22, 23, 12, 0, 7, 3, 11, 20, 25], mid: [] }, abhijitOk: true, digdwar: false,
    noteTa: 'சர, க்ஷிப்ர, துருவ நட்சத்திரங்கள்; திரிபுஷ்கர யோக நாள் (பத்ர திதி + சனி / செவ்வாய் / ஞாயிறு + விசாகம், உத்திரம், பூரட்டாதி, புனர்பூசம், கிருத்திகை, உத்திராடம்) நல்லது (கணிக்கப்படவில்லை) · வைரம், ரத்தினம்: தீக்ஷ்ண, உக்ர தவிர; ஞாயிறு, செவ்வாய்; மேஷ, விருச்சிக, சிம்ம லக்னம் · முத்து: சர, மிருது, துருவ, க்ஷிப்ர',
  },
  VASHISTHA: {
    labelTa: 'வசிஷ்டா — திதி, கிழமை, நட்சத்திரப் பட்டியல்கள்', booksTa: 'வசிஷ்டா (பியூஷதாரா மேற்கோள்; பொதுப் பட்டியல்)',
    nak: { good: [3, 4, 11, 13, 16, 20, 25, 26], mid: [] }, digdwar: false,
    tithi: [...bothPakshas([2, 7, 9, 10, 12]), 13], tithiNot: [30], vara: { good: [1], mid: [0, 2, 3, 4, 5, 6] },
    noteTa: 'பொதுப் பட்டியல்: திதி — சப்தமி ("ஆபரணம் செய்து அணிதல்"), நவமி ("ஆபரணம் செய்தல்" — அச்சில் உள்ளபடி), பத்ரா (2, 7, 12); தசமி, வளர் திரயோதசி (சப்தமியின் காரியங்களும்); அமாவாசை கூடாது · கிழமை — திங்கள் · நட்சத்திரம் — துருவம், மிருது · மற்ற திதி, கிழமை நடுத்தரம் (எங்கள் வாசிப்பு)',
  },
  RANGACHARYA: {
    labelTa: 'ரங்காச்சார்யா — நட்சத்திர வகைகள்', booksTa: 'ரங்காச்சார்யா (பொதுப் பட்டியல்)',
    nak: { good: [0, 6, 7, 12, 14, 21, 22, 23], mid: [] }, abhijitOk: true, digdwar: false,
    noteTa: 'பொதுப் பட்டியல்: சர நட்சத்திரம் — "தங்கம், வெள்ளி, ஆபரணம் செய்யக் கொடுத்தல்"; லகு (அபிஜித் உட்பட) — "சர காரியங்களும்" · திதி, கிழமை — விதி இல்லை',
  },
  AGARWAL: {
    labelTa: 'அகர்வால் — நட்சத்திர வகைகள்', booksTa: 'அகர்வால் (பொதுப் பட்டியல்)',
    nak: { good: [0, 3, 4, 6, 7, 11, 12, 13, 14, 16, 20, 21, 22, 23, 25, 26], mid: [] }, abhijitOk: true, digdwar: false,
    noteTa: 'பொதுப் பட்டியல் (ஆபரணத்துக்குத் தனிப் பகுதி இல்லை): க்ஷிப்ரம் (அபிஜித்), மிருது — "ஆபரணம் செய்தல், அணிதல்"; சரம் — "க்ஷிப்ரத்தின் காரியங்களும்"; ஸ்திரம் — "மிருதுவின் காரியங்களும்" · திதி, கிழமை — விதி இல்லை',
  },
});
const CLOTHES_WASHING = deepFreeze({
  labelTa: 'ஆடை துவைத்தல் (புது ஆடை)',
  default: 'MUHURTA_CHINTAMANI',
  order: ['MUHURTA_CHINTAMANI', 'SHRIDHAR', 'WILHELM', 'KALYANRAMAN', 'RANGACHARYA'],
  MUHURTA_CHINTAMANI: {
    labelTa: 'முகூர்த்த சிந்தாமணி ஸ்லோ.2/20', booksTa: 'முகூர்த்த சிந்தாமணி',
    nak: { good: [22, 0, 12, 13, 14, 15, 16, 6, 7], mid: [] }, digdwar: false,
    tithi: ALL_TITHIS.filter((t) => ![...bothPakshas([4, 6, 9, 14]), 15, 30].includes(t)), vara: { good: [0, 1, 2, 4, 5], mid: [] },
    noteTa: 'பர்வ திதி — பௌர்ணமி, அமாவாசை (எங்கள் வாசிப்பு); பெற்றோரின் சிராத்த திதி — கணிக்கப்படவில்லை · சண்டேஸ்வரர்: சனி, செவ்வாய், ஞாயிறு, சங்கிராந்தி, பௌர்ணமி, துவாதசி கூடாது',
  },
  SHRIDHAR: {
    labelTa: 'ஸ்ரீதர் §19.14.2', booksTa: 'ஸ்ரீதர்',
    nak: { good: [0, 6, 7, 12, 13, 14, 15, 16, 22], mid: [] }, digdwar: false,
    tithi: ALL_TITHIS.filter((t) => ![...bothPakshas([4, 6, 9, 14]), 15, 30].includes(t)), vara: { good: [1, 2, 4, 5], mid: [] },
    noteTa: 'சிராத்தம், நவராத்திரி, விரத நாள் — கணிக்கப்படவில்லை; பர்வ திதி — பௌர்ணமி, அமாவாசை (எங்கள் வாசிப்பு) · ஞாயிறு சொல்லப்படவில்லை — கூடாது',
  },
  WILHELM: {
    labelTa: 'வில்ஹெல்ம்', booksTa: 'வில்ஹெல்ம்',
    nak: { good: [0, 6, 7, 12, 13, 14, 15, 16, 22], mid: [] }, digdwar: false,
    tithi: ALL_TITHIS.filter((t) => ![...bothPakshas([4, 6, 8, 9, 14]), 15, 30].includes(t)), sankranti: true, vara: { good: [0, 1, 2, 4, 5], mid: [] },
    noteTa: 'பெற்றோரின் சிராத்த திதி — கணிக்கப்படவில்லை',
  },
  RANGACHARYA: {
    labelTa: 'ரங்காச்சார்யா', booksTa: 'ரங்காச்சார்யா',
    tithi: ALL_TITHIS.filter((t) => ![6, 21, 30].includes(t)), vara: { good: [0, 1, 2, 4, 5], mid: [] },
    noteTa: '"புது ஆடையைச் சனி, புதன், சஷ்டி, அமாவாசை, சிராத்த நாளில் ஒருபோதும் துவைக்க வேண்டாம்" · நட்சத்திரம் — விதி இல்லை',
  },
  KALYANRAMAN: {
    labelTa: 'கல்யாணராமன் (தொ.2 ப.247)', booksTa: 'கல்யாணராமன் (மு.சி., சண்டேஸ்வரர் மேற்கோள்கள்)',
    nak: { good: [22, 12, 0, 13, 14, 15, 16, 6, 7], mid: [] }, digdwar: false,
    tithi: ALL_TITHIS.filter((t) => ![...bothPakshas([4, 6, 9, 12, 14]), 15].includes(t)), tithiMid: [12, 15, 27], vara: { good: [1, 4, 5], mid: [0, 2, 3] },
    noteTa: 'மு.சி.: ரிக்த, சஷ்டி, சிராத்த திதி, சனி, புதன் கூடாது; சண்டேஸ்வரர்: சனி, செவ்வாய், ஞாயிறு, பௌர்ணமி, துவாதசி கூடாது — இருவரும் தள்ளியது (சனி) கூடாது, ஒருவர் மட்டும் தள்ளியவை நடுத்தரம் (எங்கள் வாசிப்பு) · சிராத்த திதி — கணிக்கப்படவில்லை',
  },
});
const STITCHING = deepFreeze({
  labelTa: 'ஆடை தைத்தல் / தையல் கடை',
  default: 'WILHELM',
  order: ['WILHELM', 'SHRIDHAR', 'RANGACHARYA', 'MUHURTA_CHINTAMANI'],
  WILHELM: {
    labelTa: 'வில்ஹெல்ம் — துணி செய்தல், நெய்தல், தைத்தல்', booksTa: 'வில்ஹெல்ம்',
    nak: { good: [3, 4, 6, 13, 14, 16, 17, 21, 22, 23, 26], mid: [] }, digdwar: false, tithi: NOT_RIKTA, vara: { good: [0, 1, 4, 5], mid: [] },
  },
  SHRIDHAR: {
    labelTa: 'ஸ்ரீதர் §19.14.3', booksTa: 'ஸ்ரீதர்',
    nak: { good: [0, 3, 4, 6, 7, 12, 13, 14, 15, 16, 17, 22, 26], mid: [] }, digdwar: false, vara: { good: [0, 1, 3, 4, 5], mid: [] },
    noteTa: 'தையல் கற்றல், தையல் கடை திறத்தல் · செவ்வாய், சனி தவிர',
  },
  RANGACHARYA: {
    labelTa: 'ரங்காச்சார்யா', booksTa: 'ரங்காச்சார்யா',
    nak: { good: [4, 13, 16, 0, 7, 3, 12, 17, 6, 22], mid: [] }, digdwar: false, vara: { good: [1, 3, 4, 5], mid: [] },
    noteTa: 'புனர்பூசம், அவிட்டம் "விருப்பம்" — நல்லவற்றுடன் சேர்த்தோம்',
  },
  MUHURTA_CHINTAMANI: {
    labelTa: 'முகூர்த்த சிந்தாமணி ஸ்லோ.2/15', booksTa: 'முகூர்த்த சிந்தாமணி',
    nak: { good: [6, 22, 13, 16, 0], mid: [7] }, digdwar: false,
    noteTa: '"सूचीकर्माप्यदितिवसुभ त्वाष्ट्रमैत्राश्विधिष्ण्ये" — புனர்பூசம், அவிட்டம், சித்திரை, அனுஷம், அசுவினி; பூசம் ஆங்கில உரையில் மட்டும் (நடுத்தரம்)',
  },
});
// ---------------------------------------------------------------------------
// Agriculture, added 2026-10-14
// ---------------------------------------------------------------------------
const AGRI_GENERAL = deepFreeze({
  labelTa: 'விவசாயப் பொது வேலைகள்',
  default: 'KALYANRAMAN',
  order: ['KALYANRAMAN', 'JOSHI', 'RAMAN', 'AGARWAL', 'VASHISTHA'],
  KALYANRAMAN: {
    labelTa: 'கல்யாணராமன் (தொ.2 ப.165)', booksTa: 'கல்யாணராமன்',
    nak: { good: [12, 0, 7, 4, 13, 16, 26], mid: [] }, abhijitOk: true, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 21, 22, 23, 25, 26, 27, 28],
    yogaNot: [16, 26],
    lagna: { good: [0, 2, 4, 6, 8, 10], mid: [] },
    benHouse: { houses: [4, 10], planets: ['Mercury', 'Jupiter', 'Venus'], code: 'BEN_4_10_MID' },
    noteTa: 'அச்சில் "4 and 06" — ஜோஷியின் "4th and 10th" எனப் படித்தோம்; சுபர் 4, 10-ல் — குறிக்கப்படும் · குரு கேந்திரத்தில், புதன் 2-ல், மற்ற சுபர் 11-ல், பாவர் 6-ல் — சிறப்பு (கணிக்கப்படவில்லை) · எல்லாக் கிழமையும்',
  },
  JOSHI: {
    labelTa: 'ஜோஷி (ப.107)', booksTa: 'ஜோஷி',
    nak: { good: [12, 0, 7, 4, 13, 16, 26], mid: [] }, abhijitOk: true, digdwar: false,
    lagna: { good: [0, 2, 4, 6, 8, 10], mid: [] },
    benHouse: { houses: [4, 10], planets: ['Mercury', 'Jupiter', 'Venus'], code: 'BEN_4_10_MID' },
    noteTa: 'சுபர் 4, 10-ல் — குறிக்கப்படும் · குரு கேந்திரத்தில், புதன் 2-ல், சுபர் 11-ல், பாவர் 6-ல் — வெற்றி (கணிக்கப்படவில்லை)',
  },
  RAMAN: {
    labelTa: 'ராமன் அத்.XIII', booksTa: 'ராமன்',
    empty: [8],
    noteTa: 'சந்திரன் பலமாக, ராகு, கேது, சனி பாதிப்பின்றி, சுபனாக — கணிக்கப்படவில்லை',
  },
  AGARWAL: {
    labelTa: 'அகர்வால் — நட்சத்திர வகைகள்', booksTa: 'அகர்வால் (பொதுப் பட்டியல்)',
    nak: { good: [3, 11, 20, 25, 4, 13, 16, 26], mid: [] }, digdwar: false,
    noteTa: 'பொதுப் பட்டியல்: ஸ்திரம் — "விவசாயம், தோட்டக்கலை"; மிருது — "ஸ்திரத்தின் காரியங்களும்" · திதி, கிழமை — விதி இல்லை',
  },
  VASHISTHA: {
    labelTa: 'வசிஷ்டா — திதி வகை', booksTa: 'வசிஷ்டா (பியூஷதாரா மேற்கோள்; பொதுப் பட்டியல்)',
    tithi: [1, 6, 11, 16, 21, 26], tithiNot: [30],
    noteTa: 'பொதுப் பட்டியல்: நந்தா திதி (1, 6, 11) — "விவசாயம்"; அமாவாசை கூடாது; மற்றவை நடுத்தரம் (எங்கள் வாசிப்பு)',
  },
});
const FIELD_ENTRY = deepFreeze({
  labelTa: 'விவசாய நிலத்தில் முதல் அடி',
  default: 'WILHELM',
  order: ['WILHELM', 'SHRIDHAR', 'SHRIDHAR_OLD'],
  WILHELM: {
    labelTa: 'வில்ஹெல்ம்', booksTa: 'வில்ஹெல்ம்',
    nak: { good: [1, 5, 7, 9, 11, 13, 14, 16, 20, 25], mid: [] }, digdwar: false,
    tithi: [1, 2, 3, 5, 7, 10, 11, 13, 15, 16, 17, 18, 20, 22, 25, 26, 28], tithiMid: [9, 24],
    vara: { good: [1, 2, 3, 4], mid: [6] },
    lagna: { good: [1, 5, 7], mid: [0, 2, 3, 4, 6, 8, 9, 10, 11], natalMoonOk: true },
    noteTa: 'ஜன்ம நட்சத்திரமும் அதிலிருந்து 10-வதும் இங்கே நல்லவை (பொதுத் தாரா விதிக்கு விலக்கு — கணிக்கப்படவில்லை) · 9 — ரிக்த என்பதால் "சிலர்" தள்ளுவர் (நடுத்தரம்) · "பொதுவான நல்ல லக்னங்களும் போதும்" — மற்ற லக்னம் நடுத்தரம் (எங்கள் வாசிப்பு)',
  },
  SHRIDHAR: {
    labelTa: 'ஸ்ரீதர் §21.1 — புது நிலம்', booksTa: 'ஸ்ரீதர் (B.D.R. மேற்கோள்)',
    nak: { good: [1, 5, 7, 9, 13, 14, 16, 11, 20, 25], mid: [0, 22, 3] }, digdwar: false,
    tithi: [1, 3, 5, 10, 11, 13, 15, 16, 18, 20, 25, 26, 28], tithiMid: [2, 7, 17, 22],
    vara: { good: [1, 3, 4, 5], mid: [6, 2] },
    benHouse: { houses: [1], planets: ['Jupiter', 'Mercury', 'Venus'], code: 'JMV_LAGNA_MID' },
    noteTa: '"இரட்டைத் திதிகளில் 2, 10 தவிர" — 2, 10 மட்டும் (வில்ஹெல்ம் போல) · பத்ர திதி (2, 7, 12) — "சிலர்" தள்ளுவர் (நடுத்தரம்) · சனி ("சிலர்"), செவ்வாய் (B.D.R.) — நடுத்தரம்; B.D.R.-ன் அசுவினி, அவிட்டம், ரோகிணி — நடுத்தரம் · குரு / புதன் / சுக்கிரன் லக்னத்தில் (பார்வை கணிக்கப்படவில்லை) — குறிக்கப்படும்',
  },
  SHRIDHAR_OLD: {
    labelTa: 'ஸ்ரீதர் §21.1 — பயன்பட்ட நிலம்', booksTa: 'ஸ்ரீதர்',
    nak: { good: [14, 7, 5, 1, 9, 11, 20, 25], mid: [] }, digdwar: false,
    tithi: [1, 3, 5, 10, 11, 13, 15, 16, 18, 20, 25, 26, 28], tithiMid: [2, 7, 17, 22],
    vara: { good: [2], mid: [4, 3] },
    benHouse: { houses: [1], planets: ['Jupiter', 'Mercury', 'Venus'], code: 'JMV_LAGNA_MID' },
    noteTa: 'திதி: பகுதியின் முதல் வாக்கியம் ("பயன்படுத்த அல்லது புதிதாகப் பயன்படுத்த") — இரண்டுக்கும் (எங்கள் வாசிப்பு) · செவ்வாய் சிறந்தது; வியாழன், புதன் நடுத்தரம்; திங்கள், "மற்ற அசுப நாட்கள்" கூடாது',
  },
});
const PLOUGHING = deepFreeze({
  labelTa: 'உழுதல் (முதல் உழவு)',
  default: 'KALYANRAMAN',
  order: ['KALYANRAMAN', 'SHRIDHAR', 'WILHELM', 'MUHURTA_CHINTAMANI', 'RAMAN', 'JOSHI', 'RANGACHARYA'],
  KALYANRAMAN: {
    labelTa: 'கல்யாணராமன் (தொ.2 ப.165)', booksTa: 'கல்யாணராமன் (மு.சி., காலப்பிரகாசிகை, காலதீபிகை … மேற்கோள்கள்)',
    nak: { good: [18, 15, 9, 6, 14, 21, 22, 23, 3, 11, 20, 25, 4, 13, 16, 26, 12, 0, 7], mid: [] }, abhijitOk: true, digdwar: false,
    tithi: [1, 3, 5, 8, 10, 11, 13, 15, 16, 18, 20, 23, 25, 26, 28], tithiMid: [2, 7, 12, 17, 22, 27],
    vara: { good: [1, 2, 3, 4, 5], mid: [] },
    yogaNot: [16, 26],
    karanaOnly: [0, 1, 4],
    starCount: [{ from: 'Sun', of: 27, good: [2, 3, 4, 5, 9, 10, 11, 12, 13, 17, 18, 19, 20, 21, 25, 26, 27], code: 'HALA_CHAKRA' }],
    agniNakshatra: true,
    lagna: { good: [1, 2, 3, 9, 11], mid: [0, 4, 5, 6, 7, 8, 10] },
    notIn: [[['Moon'], [4]], [['Sun'], [10]]],
    noteTa: 'குறிப்பு 11: பத்ர திதி 2, 7, 12 கூடாது (அட்டவணையில் உண்டு — நடுத்தரம்) · குறிப்பு 14 (சூரியனின் நட்சத்திரமும் 6-8, 14-16, 22-24-ம் கூடாது) — கணிப்பு; மற்ற நூல்களின் சக்கரங்கள் (காலப்பிரகாசிகை 3-7, 11-12, 19-20, 24-26; காலதீபிகை, முகூர்த்தபதவி, காலவிதானத்தின் கோண நட்சத்திரம்) — குறிப்புகளில் · லக்னம் 2, 3, 4, 10, 12 "விருப்பம்" (குறிப்பு 13; மற்றவை நடுத்தரம்) · அக்னி நட்சத்திர நாள் (சூரியன் 20° முதல் 43°20′) "விவசாயத்துக்கு நல்லதல்ல" (காலவிதானம்) · டிராக்டருக்குக் கிருத்திகை, கேட்டையும்; உழவருக்குச் சந்திர, தாரா சுத்தி',
  },
  SHRIDHAR: {
    labelTa: 'ஸ்ரீதர் §21.3', booksTa: 'ஸ்ரீதர் (மு.சி., K.P., ஜோதிஷசாரம், J.V., நாரதர், B.J.S. மேற்கோள்கள்)',
    nak: { good: [18, 15, 9, 6, 14, 21, 22, 23, 3, 4, 13, 16, 26, 12, 0, 7], mid: [11, 20, 25] }, digdwar: false,
    tithi: [1, 3, 5, 7, 11, 13], tithiMid: [2, 10],
    vara: { good: [1, 4, 5], mid: [2, 3] },
    vishti: true,
    starCount: [{ from: 'Sun', of: 27, good: [4, 5, 6, 7, 8, 9, 10, 11, 21, 22, 23, 24, 25], code: 'HALA_CHAKRA' }, { from: 'Sun', of: 28, good: [4, 5, 6, 10, 11, 12, 13, 14, 18, 19, 20, 21, 22, 26, 27, 28], code: 'HALA_CHAKRA', mark: true }],
    moonNavMid: { not: [0, 1, 2, 4, 5, 6, 7, 8] },
    lagna: { good: [1, 2, 5, 8, 11], mid: [3, 9] },
    noteTa: 'J.V.: செவ்வாய், புதன், மூன்று உத்திரம், இரட்டைத் திதி (2, 10) கூடாது — நடுத்தரம்; பத்ரை கணிப்பு; தீய யோகம், ஆனியின் முதல் பாதி, உரிமையாளரின் நாம ராசிக்குச் சந்திரன் — கணிக்கப்படவில்லை · ஹல சக்கரம்: நாரதர் (27) கணிப்பு; J.V. / B.J.S. (அபிஜித் உட்பட 28) குறிக்கப்படும் · லக்னம்: மு.சி. 2, 3, 6, 9, 12; K.P.-யின் 4, 10 நடுத்தரம் · குரு லக்னத்தில், சுக்கிரன் பலம், பாவர் பலவீனம்; சந்திரன் ரோகிணியில் சுப நவாம்சம் / ரிஷப லக்னத்துடன் — கணிக்கப்படவில்லை · "எருதுகளால் உழும்போது"; வடக்கிலிருந்து கிழக்காகத் தொடங்குக',
  },
  WILHELM: {
    labelTa: 'வில்ஹெல்ம்', booksTa: 'வில்ஹெல்ம் (மு.சி., காலப்பிரகாசிகை மேற்கோள்கள்)',
    nak: { good: [3, 6, 7, 11, 12, 16, 18, 20, 25], mid: [0, 4, 9, 13, 14, 15, 21, 22, 23] }, digdwar: false,
    tithi: [1, 2, 3, 5, 7, 10, 11, 13], tithiNot: [4, 6, 9, 14, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
    vara: { good: [1, 3, 4, 5], mid: [] },
    starCount: [{ from: 'Sun', of: 27, good: [3, 4, 5, 6, 7, 11, 12, 13, 14, 15, 19, 20, 24, 25, 26], code: 'HALA_CHAKRA' }],
    moonNavMid: { not: [0, 1, 2, 4, 5, 6, 8, 9, 10] },
    lagna: { good: [1, 2, 11], mid: [3, 5, 6, 7, 8, 9], natalMoonOk: true },
    notIn: [[['Sun', 'Mars', 'Saturn', 'Rahu', 'Ketu'], [1]]],
    noteTa: 'வளர்பிறை மட்டும்; 8, 12, பௌர்ணமி சொல்லப்படவில்லை — நடுத்தரம் (எங்கள் வாசிப்பு) · ஜன்ம நட்சத்திரமும் 10-வதும் நல்லவை (பொதுத் தாரா விதிக்கு விலக்கு) · குரு லக்னத்தில் "மிக நல்லது"; சூரியன், செவ்வாய், சனி பலவீனம், சுக்கிரன், சந்திரன் பலம் — கணிக்கப்படவில்லை · நீர் ராசி நவாம்சம் (கடகம், விருச்சிகம், மீனம் — எங்கள் வாசிப்பு) — குறிக்கப்படும் · முதல் உழவு: கிழக்கு / வடக்கு; ஒன்று, மூன்று, ஐந்து சால்',
  },
  MUHURTA_CHINTAMANI: {
    labelTa: 'முகூர்த்த சிந்தாமணி ஸ்லோ.2/28', booksTa: 'முகூர்த்த சிந்தாமணி',
    nak: { good: [18, 15, 9, 6, 14, 21, 22, 23, 3, 11, 20, 25, 4, 13, 16, 26, 12, 0, 7], mid: [] }, abhijitOk: true, digdwar: false,
    tithi: [1, 2, 3, 5, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 22, 23, 25, 26, 27, 28, 30],
    vara: { good: [1, 2, 3, 4, 5], mid: [] },
    starCount: [{ from: 'Sun', of: 28, good: [1, 2, 3, 4, 5, 6, 7, 8, 18, 19, 20, 21, 22, 23, 24, 25], code: 'HALA_CHAKRA' }],
    moonNavMid: { not: [0, 1, 2, 4, 5, 6, 7, 8] },
    lagna: { good: [1, 2, 5, 7, 8, 11], mid: [] },
    want: [{ planets: ['Jupiter'], houses: [1], code: 'JUP_LAGNA_MID' }],
    noteTa: 'ஹல சக்கரம்: சூரியனின் நட்சத்திரத்துக்கு முந்தைய மூன்று தீயவை, பின் 8 நல்லவை, 9 தீயவை, 8 நல்லவை (3 + 8 + 9 + 8 = 28 — அபிஜித் உட்பட; சூரியனின் நட்சத்திரம் 1 எனில் 1-8, 18-25 நல்லவை — எங்கள் வாசிப்பு) · க்ஷிப்ர வகை (ஸ்லோ.2/6) அபிஜித் உட்பட · குரு லக்னத்தில், சந்திரன் நீர் ராசி (4, 10, 11, 12) நவாம்சத்தில் — குறிக்கப்படும்; பாவர் பலவீனம், சுக்கிரன், சந்திரன் முழு பலம் — கணிக்கப்படவில்லை',
  },
  RAMAN: {
    labelTa: 'ராமன் அத்.XIII', booksTa: 'ராமன்',
    nak: { good: [3, 6, 7, 11, 12, 16, 18, 20, 25], mid: [] }, digdwar: false,
    tithi: [1, 2, 3, 5, 7, 11, 12, 13, 14, 15, 16, 17, 18, 20, 22, 26, 27, 28, 29],
    krishnaMid: true,
    vara: { good: [1, 3, 4, 5], mid: [] },
    lagna: { good: [1, 2, 3, 9, 11], mid: [4, 5, 6, 8] },
    empty: [8],
    notIn: [[['Sun', 'Mars', 'Saturn', 'Rahu', 'Ketu'], [1]]],
    noteTa: 'சிம்மம், சூரியன் இருக்கும் ராசி, சூரியனின் நட்சத்திரங்கள் "பொதுவாக நல்லவை" — கணிக்கப்படவில்லை · மேஷம், விருச்சிகம், கும்பம் கூடாது; மற்றவை நடுத்தரம் (எங்கள் வாசிப்பு) · 8 காலி: "எல்லா விவசாய வேலைகளுக்கும்" (PDF ப.48) · முதல் நாள் கிழக்கு / வடக்கு நோக்கி',
  },
  JOSHI: {
    labelTa: 'ஜோஷி (ப.104)', booksTa: 'ஜோஷி',
    nak: { good: [18, 15, 9, 6, 14, 21, 22, 23, 3, 11, 20, 25, 4, 13, 16, 26, 12, 0, 7], mid: [] }, digdwar: false,
    tithi: [1, 2, 3, 5, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 22, 23, 25, 26, 27, 28],
    vara: { good: [1, 2, 3, 4, 5], mid: [] },
    vishti: true,
    moonNavMid: { not: [0, 1, 2, 4, 5, 6, 8, 10] },
    lagna: { good: [1, 2, 5, 7, 8, 11], mid: [] },
    want: [{ planets: ['Jupiter'], houses: [1], code: 'JUP_LAGNA_MID' }],
    noteTa: 'குரு லக்னத்தில், சந்திரன் நீர் ராசி (4, 8, 10, 12) நவாம்சத்தில் — "மிக மங்களம்" (குறிக்கப்படும்); பாவர் பலவீனம், சுக்கிரன் / சந்திரன் பலம் — கணிக்கப்படவில்லை · உழவருக்குச் சந்திர சுத்தி "கட்டாயம்" (பக்கத்தின் சந்திரன் நெடுவரிசை) · வடக்கிலிருந்து தொடங்குக',
  },
  RANGACHARYA: {
    labelTa: 'ரங்காச்சார்யா', booksTa: 'ரங்காச்சார்யா',
    nak: { good: [0, 3, 4, 6, 7, 9, 12, 14, 16, 11, 20, 25, 18, 21, 22, 26], mid: [] }, digdwar: false,
    tithi: [1, 5, 10, 11, 13, 16, 20, 25, 26, 28],
    vara: { good: [0, 1, 4, 5], mid: [] },
    starCount: [{ from: 'Sun', of: 27, good: [4, 5, 6, 10, 11, 12, 13, 14, 18, 19, 20, 21, 22, 26, 27], code: 'HALA_CHAKRA' }],
    lagna: { good: [1, 2, 5, 7, 8, 11], mid: [] },
    noteTa: 'ஹல சக்கர சுத்தி "கட்டாயம்" · உழும்போது சகுனங்கள் (ஆமை, ஏர்க்கால் / நுகம் உடைதல் …) — கணிக்கப்படவில்லை · திதி இரு பக்ஷமும் (எங்கள் வாசிப்பு)',
  },
});
const SOWING = deepFreeze({
  labelTa: 'விதைத்தல்',
  default: 'KALYANRAMAN',
  order: ['KALYANRAMAN', 'SHRIDHAR', 'WILHELM', 'RAMAN', 'MUHURTA_CHINTAMANI', 'RANGACHARYA', 'AGARWAL', 'JOSHI', 'VASHISTHA'],
  KALYANRAMAN: {
    labelTa: 'கல்யாணராமன் (தொ.2 ப.168)', booksTa: 'கல்யாணராமன் (மு.சி., காலப்பிரகாசிகை, மாதவீயம், காலதீபிகை … மேற்கோள்கள்)',
    nak: { good: [18, 9, 14, 22, 3, 11, 20, 25, 4, 13, 16, 26, 12, 0, 7], mid: [] }, digdwar: false,
    tithi: [1, 2, 3, 5, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 22, 23, 25, 26, 27, 28],
    vara: { good: [1, 3, 4, 5], mid: [] },
    starCount: [{ from: 'Rahu', of: 27, good: [9, 10, 11, 13, 14, 15, 17, 18, 19, 21, 22, 23], code: 'RAHU_CHAKRA', mark: true }],
    agniNakshatra: true,
    noteTa: 'மு.சி.யின் ராகு (ஹல) சக்கரம் குறிப்பில் — குறிக்கப்படும் · காலப்பிரகாசிகை (பருவம்; அசுவினி, மிருகசீரிடம், புனர்பூசம், அவிட்டம் நடுத்தரம்), மாதவீயம் (ரிக்த, பத்ர திதி கூடாது; 1, 6, 10 நடுத்தரம்), காலதீபிகை (ராகுவிலிருந்து 11, 15, 19, 23-லிருந்து 12; குருவிலிருந்து 12 கூடாது), முகூர்த்தபதவி, காலவிதானம் — குறிப்புகளில் · அக்னி நட்சத்திர நாள் (சூரியன் 20° முதல் 43°20′) "விவசாயத்துக்கு நல்லதல்ல" (காலவிதானம்)',
  },
  SHRIDHAR: {
    labelTa: 'ஸ்ரீதர் §21.4', booksTa: 'ஸ்ரீதர் (நாரதர், B.D.R., J.V., B.J.S., ஸ்ரீபதி, K.P. மேற்கோள்கள்)',
    nak: { good: [12, 0, 7, 4, 13, 16, 26, 3, 11, 20, 25, 18], mid: [9, 14, 22, 2, 21] }, digdwar: false,
    tithi: [3, 5, 7, 11, 12, 13, 18, 20, 22, 26, 27, 28], tithiMid: [2, 6, 10, 17, 21, 25],
    sankranti: true,
    vara: { good: [0, 1, 3, 4, 5], mid: [2, 6] },
    starCount: [{ from: 'Rahu', of: 27, good: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], code: 'RAHU_CHAKRA' }, { from: 'Rahu', of: 27, good: [9, 10, 11, 13, 14, 15, 17, 18, 19, 21, 22, 23], code: 'RAHU_CHAKRA', mark: true }, { from: 'Venus', of: 27, good: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], code: 'VENUS_CHAKRA', mark: true }],
    bhuRajasvala: true,
    lagna: { good: [1, 3, 4, 9, 11], mid: [2, 6, 10, 5, 7, 8] },
    navMid: [1, 2, 3, 5, 6, 8, 11],
    empty: [8],
    notIn: [[['Venus'], [7]], [['Moon'], [1, 6, 8, 9, 12], true]],
    noteTa: 'பர்வ திதி — 8, 14, 15, 30, சங்கிராந்தி (எங்கள் வாசிப்பு); பிரதோஷ திதி — கணிக்கப்படவில்லை · நாரதரின் நட்சத்திரங்கள்; J.V. தள்ளிய மகம், சுவாதி, அவிட்டம், சேர்த்த கிருத்திகை, திருவோணம் — நடுத்தரம் · ராகு சக்கரம்: ஸ்ரீபதி (7-18) கணிப்பு; B.J.S. குறிக்கப்படும்; K.P.: சுக்கிரனிலிருந்து 7-18 — குறிக்கப்படும் · லக்னம்: 2, 4, 5, 10, 12 சிறந்தவை; 3, 7, 11 நடுத்தரம்; "சிலர்" 6, 8, 9 — நடுத்தரம்; மேஷம் கூடாது · சந்திரன் 2, 3, 4, 5, 7, 10, 11-ல் (K.P., குறிக்கப்படும்) · பூ-ருதன் (மாதக் கடைசி, அமாவாசை, ஹோலிகை, சங்கிராந்தி, செவ்வாய்) · பயிர்வாரிக் கிழமை, நட்சத்திரம் — குறிப்புகளில்',
  },
  WILHELM: {
    labelTa: 'வில்ஹெல்ம்', booksTa: 'வில்ஹெல்ம்',
    nak: { good: [3, 7, 9, 11, 12, 14, 15, 16, 18, 20, 21, 23, 25, 26], mid: [0, 4, 6, 22] }, digdwar: false,
    tithi: [3, 5, 8, 10, 12, 13, 15, 18, 20, 23, 25, 27, 28, 30],
    vara: { good: [1, 3, 4, 5], mid: [] },
    vishti: true,
    karanaFixed: true,
    starCount: [{ from: 'Rahu', of: 27, good: [9, 10, 11, 13, 14, 15, 17, 18, 19, 21, 22, 23], code: 'RAHU_CHAKRA' }, { from: 'Venus', of: 27, good: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], code: 'VENUS_CHAKRA', mark: true }],
    lagna: { good: [1, 3, 4, 9, 11], mid: [6, 2, 10], natalMoonOk: true },
    navMid: [1, 2, 3, 5, 6, 8, 11],
    empty: [8],
    maleficIn: [3, 6, 11],
    notIn: [[['Venus'], [8]], [['Moon'], [1, 6, 8, 9, 12], true]],
    varaLordLagna: 'MARK',
    noteTa: 'சகுனி கரணம் அச்சில் இல்லை (கணிப்பது நான்கு ஸ்திர கரணமும்) · சுக்கிரனிலிருந்து 7-18: "தானிய வயல் விதைக்க" — குறிக்கப்படும் · கிழமை அதிபதியின் ராசி லக்னம் "மிக நல்லது" — குறிக்கப்படும்; லக்னாதிபதி பயிரின் அதிபதி — நல்லது · வேர், பூ / பழம், மரம் / கொடிக்குத் தனி நட்சத்திரங்கள் (மரம் — "மரம் நடுதல்" காரியத்தில்); பயிர்வாரிச் சேர்க்கைகள் — கணிக்கப்படவில்லை',
  },
  RAMAN: {
    labelTa: 'ராமன் அத்.XIII', booksTa: 'ராமன்',
    nak: { good: [12, 13, 14, 9, 7, 11, 20, 25, 3, 26, 0, 18, 16], mid: [] }, digdwar: false,
    tithi: [1, 2, 3, 5, 7, 11, 13, 15, 16, 17, 18, 20, 22, 26, 28], tithiMid: [4, 10, 19, 25],
    empty: [8],
    varaLordLagna: 'REQUIRED',
    noteTa: 'அச்சில் "இரட்டைத் திதிகளில் 2, 4 தவிர மற்றவை கூடாது" — 4 ரிக்த; மற்ற நூல்களின் இதே விதி "2, 10" — 4, 10 நடுத்தரம் (எங்கள் வாசிப்பு) · கிழமை அதிபதியின் ராசி லக்னம் "எப்போதும்" · ராசிவாரி, நட்சத்திரவாரிப் பயிர்கள்; வளர்பிறை சந்திரன் — கணிக்கப்படவில்லை',
  },
  MUHURTA_CHINTAMANI: {
    labelTa: 'முகூர்த்த சிந்தாமணி ஸ்லோ.2/29', booksTa: 'முகூர்த்த சிந்தாமணி',
    nak: { good: [18, 9, 14, 22, 3, 11, 20, 25, 4, 13, 16, 26, 12, 0, 7], mid: [] }, abhijitOk: true, digdwar: false,
    tithi: [1, 2, 3, 5, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 22, 23, 25, 26, 27, 28, 30],
    vara: { good: [1, 3, 4, 5], mid: [] },
    starCount: [{ from: 'Rahu', of: 27, good: [9, 10, 11, 13, 14, 15, 17, 18, 19, 21, 22, 23], code: 'RAHU_CHAKRA' }],
    noteTa: 'உரை: திருவோணம், சதயம், புனர்பூசம், விசாகம், செவ்வாய் தவிர எல்லாம் — மாற்று வாசிப்பு (கணிக்கப்படவில்லை) · திதி: உழவுக்குச் சொன்னதே (ரிக்த, சஷ்டி கூடாது) · க்ஷிப்ர வகை அபிஜித் உட்பட',
  },
  RANGACHARYA: {
    labelTa: 'ரங்காச்சார்யா', booksTa: 'ரங்காச்சார்யா (காலாம்ருதம் மேற்கோள்)',
    nak: { good: [0, 3, 4, 7, 9, 12, 14, 16, 11, 20, 25, 18, 22, 26], mid: [] }, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 21, 22, 23, 25, 26, 27, 28, 30],
    vara: { good: [0, 1, 3, 4, 5], mid: [] },
    starCount: [{ from: 'Rahu', of: 27, good: [9, 10, 11, 13, 14, 15, 17, 18, 19, 21, 22, 23], code: 'RAHU_CHAKRA' }],
    lagna: { good: [1, 2, 3, 5, 11], mid: [7, 8] },
    noteTa: 'பணி சக்கர சுத்தி "கட்டாயம்" · அச்சில் 8-3-1-3-1-3-"1 நல்லவை"-4 = 24 — ஒரு குழு விடுபட்டது; மு.சி.யின் 8-3-1-3-1-3-1-3-4 (27) எனப் படித்தோம் · செவ்வாய் — எலிகள், சனி — பூச்சிகள் · லக்னம்: ரிஷபம், மீனம், கன்னி, மிதுனம், கடகம் (காலாம்ருதம்) நல்லவை; மேஷம், துலாம், மகரம், சிம்மம், கும்பம் கூடாது; விருச்சிகம், தனுசு நடுத்தரம் (எங்கள் வாசிப்பு)',
  },
  AGARWAL: {
    labelTa: 'அகர்வால் (ப.329)', booksTa: 'அகர்வால்',
    nak: { good: [3, 11, 20, 25, 14, 26, 16, 4, 7, 13, 22, 12, 0, 18, 9], mid: [] }, digdwar: false,
    tithi: [1, 2, 3, 5, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 22, 23, 25, 26, 27, 28],
    vara: { good: [1, 3, 5], mid: [] },
    vishti: true,
    varaLordLagna: 'REQUIRED',
    noteTa: 'தாரா, சந்திர சுத்தி "கட்டாயம்" (ப.329 குறிப்பு — பக்கத்தின் நெடுவரிசைகள்); "தீய யோகங்கள்" — கணிக்கப்படவில்லை',
  },
  JOSHI: {
    labelTa: 'ஜோஷி (ப.104)', booksTa: 'ஜோஷி',
    nak: { good: [18, 9, 14, 22, 3, 11, 20, 25, 4, 13, 16, 26, 12, 0, 7], mid: [] }, digdwar: false,
    tithi: [1, 2, 3, 5, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 22, 23, 25, 26, 27, 28],
    vara: { good: [1, 3, 4, 5], mid: [] },
    vishti: true,
  },
  VASHISTHA: {
    labelTa: 'வசிஷ்டா — நட்சத்திர வகைகள்', booksTa: 'வசிஷ்டா (பொதுப் பட்டியல்)',
    nak: { good: [3, 11, 20, 25, 5, 8, 17], mid: [] }, digdwar: false,
    noteTa: 'பொதுப் பட்டியல் (விதைத்தலுக்குத் தனிப் பகுதி இல்லை): துருவ நட்சத்திரம் — "விதை விதைத்தல்"; தீக்ஷ்ணம் — "விதைத்தல்" (அச்சில் உள்ளபடி) · திதி, கிழமை — விதி இல்லை',
  },
});
const TRANSPLANTING = deepFreeze({
  labelTa: 'நாற்று நடுதல் (தான்ய ரோபணம்)',
  default: 'SHRIDHAR',
  order: ['SHRIDHAR', 'MUHURTA_CHINTAMANI', 'WILHELM', 'KALYANRAMAN', 'RANGACHARYA'],
  SHRIDHAR: {
    labelTa: 'ஸ்ரீதர் §21.5', booksTa: 'ஸ்ரீதர் (B.J.S., மு.சி. மேற்கோள்கள்)',
    nak: { good: [3, 11, 20, 25, 4, 13, 16, 26, 12, 0, 7, 9, 18, 22], mid: [15, 24, 23] }, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 21, 22, 23, 25, 26, 27, 28, 30],
    vara: { good: [1, 3, 4, 5], mid: [0] },
    noteTa: 'B.J.S. பட்டியல் கணிப்பு; மு.சி.யின் விசாகம், பூரட்டாதி, சதயம் — நடுத்தரம் · "சுப நாட்கள்" — திங்கள், புதன், வியாழன், வெள்ளி; ஞாயிறு நடுத்தரம் (எங்கள் வாசிப்பு)',
  },
  MUHURTA_CHINTAMANI: {
    labelTa: 'முகூர்த்த சிந்தாமணி ஸ்லோ.2/32', booksTa: 'முகூர்த்த சிந்தாமணி',
    nak: { good: [15, 24, 18, 3, 23, 11], mid: [] }, digdwar: false,
    vara: { good: [0, 1, 3, 4, 5], mid: [] },
  },
  WILHELM: {
    labelTa: 'வில்ஹெல்ம்', booksTa: 'வில்ஹெல்ம்',
    nak: { good: [15, 24, 18, 3, 23, 11], mid: [] }, digdwar: false,
    vara: { good: [0, 1, 3, 4, 5], mid: [] },
    noteTa: 'ஜன்ம ராசியே லக்னம் — "எப்போதும் நல்லது"',
  },
  KALYANRAMAN: {
    labelTa: 'கல்யாணராமன் (தொ.2 ப.177)', booksTa: 'கல்யாணராமன் (மு.சி. மேற்கோள்)',
    nak: { good: [15, 24, 18, 3, 23, 11], mid: [] }, digdwar: false,
    vara: { good: [0, 1, 3, 4, 5], mid: [] },
  },
  RANGACHARYA: {
    labelTa: 'ரங்காச்சார்யா — "Plantation"', booksTa: 'ரங்காச்சார்யா',
    nak: { good: [15, 24, 18, 3, 23], mid: [] }, digdwar: false,
    vara: { good: [0, 1, 3, 4, 5], mid: [] },
    noteTa: 'மு.சி. 2/32-ன் நாற்று நடுதல் பட்டியல் (உத்திரம் இல்லாமல்) — "நடுதல்"',
  },
});
const TREE_PLANTING = deepFreeze({
  labelTa: 'மரம், கொடி நடுதல்',
  default: 'SHRIDHAR',
  order: ['SHRIDHAR', 'KALYANRAMAN', 'JOSHI', 'WILHELM', 'MUHURTA_CHINTAMANI', 'AGARWAL', 'RAMAN'],
  SHRIDHAR: {
    labelTa: 'ஸ்ரீதர் §21.6', booksTa: 'ஸ்ரீதர் (வராஹமிஹிரர், B.D.R., B.J.S. மேற்கோள்கள்)',
    masa: { good: [1, 4, 8, 7], mid: [], strict: true },
    nak: { good: [3, 11, 20, 25, 4, 13, 16, 26, 12, 0, 7, 23, 18], mid: [15, 21] }, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 8, 10, 11, 13, 15], tithiMid: [4, 9, 12, 14, 30],
    vara: { good: [1, 3, 4, 5], mid: [2, 0] },
    starCount: [{ from: 'Sun', of: 27, good: [4, 5, 6, 13, 14, 15, 22, 23, 24, 25, 26, 27], code: 'VRIKSHA_CHAKRA' }],
    jupVenNotSet: true,
    noteTa: 'வளர்பிறைச் சுப திதிகள் (ரிக்த, அமாவாசை, 12 தவிர — எங்கள் வாசிப்பு); B.D.R.: ரிக்த, அமாவாசை, 12, செவ்வாய், ஞாயிறு — நடுத்தரம் · சனியில் சந்திரன், தாரை பலவீனமானால் கூடாது · B.D.R. விசாகத்தைத் தள்ளுவார், வராஹமிஹிரர் திருவோணம் சேர்ப்பார் — நடுத்தரம் · சூரியனும் குருவும் ஒரே ராசியில், சிம்மத்தில் குரு — கூடாது (கணிக்கப்படவில்லை) · விருக்ஷ சக்கரம் (B.J.S., பிரம்மயாமளம்)',
  },
  KALYANRAMAN: {
    labelTa: 'கல்யாணராமன் (தொ.2 ப.178)', booksTa: 'கல்யாணராமன் (மு.சி. மேற்கோள்)',
    nak: { good: [0, 3, 4, 7, 11, 12, 13, 15, 16, 18, 20, 23, 25, 26], mid: [] }, digdwar: false,
    tithi: [2, 3, 5, 6, 7, 10, 11, 12, 13, 15, 17, 18, 20, 21, 22, 25, 26, 27, 28],
    vara: { good: [0, 4, 5], mid: [] },
    starCount: [{ from: 'Sun', of: 27, good: [4, 5, 6, 13, 14, 15, 22, 23, 24, 25, 26, 27], code: 'VRIKSHA_CHAKRA', mark: true }],
    noteTa: 'சூரியனிலிருந்து எண்ணிக்கை — "நல்லதாகக் கொள்ளலாம்" (குறிக்கப்படும்) · மு.சி.: மிருது, துருவ, க்ஷிப்ர (அபிஜித்), விசாகம், மூலம், சதயம் — மரம், கொடி',
  },
  JOSHI: {
    labelTa: 'ஜோஷி (ப.106)', booksTa: 'ஜோஷி',
    nak: { good: [15, 18, 23, 4, 13, 16, 26, 3, 11, 20, 25, 12, 0, 7], mid: [] }, digdwar: false,
    vara: { good: [0, 4, 5], mid: [] },
    starCount: [{ from: 'Sun', of: 27, good: [4, 5, 6, 13, 14, 15, 22, 23, 24, 25, 26, 27], code: 'VRIKSHA_CHAKRA' }],
  },
  WILHELM: {
    labelTa: 'வில்ஹெல்ம் — மரம், கொடி விதைகள்', booksTa: 'வில்ஹெல்ம்',
    nak: { good: [0, 3, 4, 7, 11, 12, 13, 15, 16, 18, 23, 20, 25, 26], mid: [] }, digdwar: false,
    tithi: [3, 5, 8, 10, 12, 13, 15, 18, 20, 23, 25, 27, 28, 30],
    vara: { good: [1, 3, 4, 5], mid: [] },
    vishti: true,
    karanaFixed: true,
    starCount: [{ from: 'Sun', of: 27, good: [4, 5, 6, 13, 14, 15, 22, 23, 24, 25, 26, 27], code: 'VRIKSHA_CHAKRA', mark: true }],
    lagna: { good: [1, 3, 4, 9, 11], mid: [6, 2, 10], natalMoonOk: true },
    navMid: [1, 2, 3, 5, 6, 8, 11],
    empty: [8],
    maleficIn: [3, 6, 11],
    notIn: [[['Venus'], [8]], [['Moon'], [1, 6, 8, 9, 12], true]],
    varaLordLagna: 'MARK',
    noteTa: 'விதைத்தல் பகுதியின் "மரம், காய்க்காத கொடி" பட்டியல்; திதி, கிழமை, லக்னம், பாவங்கள் — அதே பகுதியினுடையவை · சூரியனிலிருந்து எண்ணிக்கை "குறிப்பாக நல்லது" — குறிக்கப்படும் · நீண்ட ஆயுள் பழமரம்: வியாழன், குரு லக்னத்தில் (கணிக்கப்படவில்லை)',
  },
  MUHURTA_CHINTAMANI: {
    labelTa: 'முகூர்த்த சிந்தாமணி ஸ்லோ.2/13', booksTa: 'முகூர்த்த சிந்தாமணி',
    nak: { good: [15, 18, 23, 4, 13, 16, 26, 3, 11, 20, 25, 12, 0, 7], mid: [] }, abhijitOk: true, digdwar: false,
    noteTa: 'க்ஷிப்ர வகை அபிஜித் உட்பட · திதி, கிழமை — விதி இல்லை',
  },
  AGARWAL: {
    labelTa: 'அகர்வால் — "Horticulture" (ப.329)', booksTa: 'அகர்வால்',
    nak: { good: [15, 18, 23, 4, 13, 16, 26, 3, 11, 20, 25, 12, 0, 7], mid: [] }, digdwar: false,
    tithi: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    vara: { good: [1, 3, 5], mid: [] },
    noteTa: '"Horticulture" — நட்சத்திரப் பட்டியல் மு.சி. 2/13-ன் மரம், கொடி நடுதலுடையதே (ஆகவே இங்கே) · வளர்பிறையில் (பௌர்ணமி உட்பட — எங்கள் வாசிப்பு) · தாரா, சந்திர சுத்தி "கட்டாயம்" (ப.329)',
  },
  RAMAN: {
    labelTa: 'ராமன் அத்.IV — ஸ்திர நட்சத்திரம்', booksTa: 'ராமன் (பொதுப் பட்டியல்)',
    nak: { good: [3, 11, 20, 25], mid: [] }, digdwar: false,
    noteTa: 'பொதுப் பட்டியல் (மரம் நடுதலுக்குத் தனிப் பகுதி இல்லை): ஸ்திர நட்சத்திரம் — "மரம் நடுதல்"; அத்.XIII: "ரோகிணி மரங்களுக்கு நல்லது"; நீண்ட ஆயுள் பழமரம் — வியாழன், குரு லக்னத்தில்; வியாழனில் தனுசு / மீன லக்னம் (கணிக்கப்படவில்லை) · திதி, கிழமை — விதி இல்லை',
  },
});
const GARDEN = deepFreeze({
  labelTa: 'தோட்டம், பழத்தோட்டம் அமைத்தல்',
  default: 'MUHURTA_CHINTAMANI',
  order: ['MUHURTA_CHINTAMANI', 'KALYANRAMAN', 'WILHELM', 'JOSHI', 'VASHISTHA', 'RANGACHARYA', 'RAMAN'],
  MUHURTA_CHINTAMANI: {
    labelTa: 'முகூர்த்த சிந்தாமணி ஸ்லோ.2/61', booksTa: 'முகூர்த்த சிந்தாமணி',
    masa: { good: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], mid: [], strict: true },
    uttarayana: 'REQUIRED',
    nak: { good: [4, 13, 16, 26, 12, 0, 7, 6, 14, 21, 22, 23, 3, 11, 20, 25], mid: [] }, abhijitOk: true, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15],
    vara: { good: [0, 1, 3, 4, 5, 6], mid: [] },
    maleficIn: [3, 6, 11],
    notIn: [[['Mercury', 'Jupiter', 'Venus'], [8, 12]], [['Moon'], [1, 2, 4, 5, 7, 8, 9, 10, 12], true]],
    jupVenNotSet: true,
    noteTa: 'உத்தராயணம் (சித்திரை தவிர), சுக்கிரன் உதயம், வளர்பிறை · சந்திரன், பாவர் 3, 6, 11-ல் (குறிக்கப்படும்) · தெய்வத்தின் நட்சத்திரம், திதி, லக்னம் — பிரதிஷ்டைக்கு மட்டும் · க்ஷிப்ர வகை அபிஜித் உட்பட',
  },
  KALYANRAMAN: {
    labelTa: 'கல்யாணராமன் (தொ.2 ப.177)', booksTa: 'கல்யாணராமன் (மு.சி. மேற்கோள்)',
    nak: { good: [0, 4, 6, 7, 9, 13, 14, 19, 21, 22, 23], mid: [] }, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 21, 22, 23, 25, 26, 27, 28],
    vara: { good: [1, 4, 5], mid: [] },
    lagna: { good: [0, 2, 4, 6, 8, 10], mid: [] },
    beneficKendra: true,
    noteTa: 'மு.சி.: தோட்டம், பழத்தோட்டம் — தெய்வப் பிரதிஷ்டை விதிகள் (16 நட்சத்திரம்) — மு.சி. வாசிப்பில் · "சுபர் கேந்திரத்தில்" — ஒரு சுபர் போதும் (எங்கள் வாசிப்பு)',
  },
  WILHELM: {
    labelTa: 'வில்ஹெல்ம்', booksTa: 'வில்ஹெல்ம்',
    uttarayana: 'PREFERRED',
    nak: { good: [3, 4, 6, 11, 13, 14, 16, 20, 21, 22, 23, 25, 26], mid: [] }, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 21, 22, 23, 25, 26, 27, 28, 30],
    krishnaMid: true,
    vara: { good: [0, 1, 3, 4, 5, 6], mid: [] },
    maleficIn: [3, 6, 11],
    notIn: [[['Mercury', 'Jupiter', 'Venus'], [8, 12]], [['Moon'], [1, 2, 4, 5, 7, 8, 9, 10, 12], true]],
    noteTa: 'லக்னத்தில் சுக்கிரன் "மிக நல்லது"; ஜன்ம ராசியே லக்னம் — நல்லது (கணிக்கப்படவில்லை)',
  },
  JOSHI: {
    labelTa: 'ஜோஷி (ப.108) — தோட்டக்காரர்', booksTa: 'ஜோஷி',
    nak: { good: [6, 14, 21, 22, 23, 19, 0, 7, 9, 13, 4], mid: [] }, digdwar: false,
    vara: { good: [1, 4, 5], mid: [] },
    lagna: { good: [0, 2, 4, 6, 8, 10], mid: [] },
    beneficKendra: true,
  },
  VASHISTHA: {
    labelTa: 'வசிஷ்டா — கிழமை, நட்சத்திர வகைகள்', booksTa: 'வசிஷ்டா (பொதுப் பட்டியல்)',
    nak: { good: [3, 11, 20, 25, 6, 14, 21, 22, 23, 5, 8, 17], mid: [] }, digdwar: false,
    vara: { good: [1], mid: [0, 2, 3, 4, 5, 6] },
    noteTa: 'பொதுப் பட்டியல் (தோட்டத்துக்குத் தனிப் பகுதி இல்லை): துருவம் — "தோட்டம் நடுதல்"; சரம் — "தோட்டம் அமைத்தல், முதன்முறை நுழைதல்"; தீக்ஷ்ணம் — "தோட்டம் அமைக்கத் தொடங்குதல்" (அச்சில் உள்ளபடி); திங்கள் — "தோட்டம் நடுதல்" · மற்ற கிழமை நடுத்தரம் (எங்கள் வாசிப்பு)',
  },
  RANGACHARYA: {
    labelTa: 'ரங்காச்சார்யா — நட்சத்திர வகைகள்', booksTa: 'ரங்காச்சார்யா (பொதுப் பட்டியல்)',
    nak: { good: [6, 14, 21, 22, 23, 12, 0, 7], mid: [] }, abhijitOk: true, digdwar: false,
    noteTa: 'பொதுப் பட்டியல்: சரம் — "தோட்டம்"; லகு (அபிஜித் உட்பட) — "சரத்தின் காரியங்களும்" · திதி, கிழமை — விதி இல்லை',
  },
  RAMAN: {
    labelTa: 'ராமன் அத்.IV — சர நட்சத்திரம்', booksTa: 'ராமன் (பொதுப் பட்டியல்)',
    nak: { good: [6, 14, 21, 22, 23], mid: [] }, digdwar: false,
    noteTa: 'பொதுப் பட்டியல்: சர நட்சத்திரங்கள் — "தோட்டம்" · திதி, கிழமை — விதி இல்லை',
  },
});
const HARVEST = deepFreeze({
  labelTa: 'அறுவடை',
  default: 'KALYANRAMAN',
  order: ['KALYANRAMAN', 'WILHELM', 'SHRIDHAR', 'MUHURTA_CHINTAMANI', 'RAMAN', 'JOSHI', 'SHRIDHAR_PADDY', 'RANGACHARYA'],
  KALYANRAMAN: {
    labelTa: 'கல்யாணராமன் (தொ.2 ப.172)', booksTa: 'கல்யாணராமன் (மு.சி., காலப்பிரகாசிகை, மாதவீயம் மேற்கோள்கள்)',
    nak: { good: [18, 17, 5, 8, 24, 12, 2, 22, 21, 4, 14, 9, 11, 20, 25, 19, 1, 13, 7], mid: [] }, abhijitOk: true, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 21, 22, 23, 25, 26, 27, 28],
    vara: { good: [0, 1, 3, 4, 5], mid: [] },
    yogaNot: [16, 26],
    vishti: true,
    karanaFixed: true,
    noteTa: 'மு.சி.: ஸ்திர லக்னம் 2, 5, 8, 11 (குறிப்பு) · காலப்பிரகாசிகை: 15 நட்சத்திரம்; 4, 8, 9, 11, 12, 14, 30 கூடாது; சுபர் நாள், ராசி; சேர்க்கைகள் · மாதவீயம் — குறிப்புகளில்',
  },
  WILHELM: {
    labelTa: 'வில்ஹெல்ம்', booksTa: 'வில்ஹெல்ம்',
    nak: { good: [1, 3, 4, 5, 7, 9, 11, 12, 15, 16, 20, 21, 25, 26], mid: [] }, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 10, 13, 15, 16, 17, 18, 20, 21, 22, 25, 28],
    vara: { good: [1, 3, 4, 5], mid: [0] },
    taraNot: [1, 10, 19],
    vishti: true,
    karanaFixed: true,
    lagna: { good: [1, 2, 3, 5, 6, 8, 11], mid: [], natalMoonOk: true },
    dayParts: { good: [1, 2, 3, 4], mid: [] },
    noteTa: 'சுபர் ராசிகளில் ஸ்திரம் சிறப்பு; 4-ல் குரு இருந்தால் எல்லா லக்னமும் (கணிக்கப்படவில்லை) · ஞாயிறு சொல்லப்படவில்லை — நடுத்தரம் · பழம் பறிக்க மேஷம், கடகம் · சேர்க்கைகள்: மீனம்-பரணி, விருச்சிகம்-திருவோணம், கடகம்-விசாகம்',
  },
  SHRIDHAR: {
    labelTa: 'ஸ்ரீதர் §21.8', booksTa: 'ஸ்ரீதர் (K.P. மேற்கோள்)',
    nak: { good: [3, 11, 20, 25, 1, 4, 5, 7, 9, 12, 15, 16, 21, 26], mid: [] }, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 10, 13, 16, 17, 18, 20, 21, 22, 25, 28],
    vara: { good: [1, 3, 4, 5], mid: [] },
    taraNot: [1, 10, 19],
    vishti: true,
    karanaFixed: true,
    lagna: { good: [1, 2, 3, 5, 6, 8, 11], mid: [] },
    want: [{ planets: ['Jupiter'], houses: [4], code: 'JUP_4_MID' }],
    dayParts: { good: [1, 2, 3, 4], mid: [] },
    noteTa: 'நாளதிபதி, லக்னம் சுபர் (சுபர் கிழமை, ராசி — எங்கள் வாசிப்பு) · 4-ல் குரு — குறிக்கப்படும் · பழம் சேகரிக்க மேஷம், கடகம் · K.P. சேர்க்கைகள் (மீனம்-பரணி, விருச்சிகம்-திருவோணம், கடகம்-விசாகம்)',
  },
  MUHURTA_CHINTAMANI: {
    labelTa: 'முகூர்த்த சிந்தாமணி ஸ்லோ.2/31', booksTa: 'முகூர்த்த சிந்தாமணி',
    nak: { good: [18, 17, 5, 8, 24, 12, 2, 22, 21, 4, 14, 9, 11, 20, 25, 19, 1, 13, 7], mid: [] }, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 21, 22, 23, 25, 26, 27, 28, 30],
    vara: { good: [0, 1, 3, 4, 5], mid: [] },
    lagna: { good: [1, 4, 7, 10], mid: [] },
  },
  RAMAN: {
    labelTa: 'ராமன் அத்.XIII', booksTa: 'ராமன்',
    nak: { good: [1, 3, 4, 5, 7, 9, 11, 12, 15, 16, 20, 21], mid: [] }, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 10, 13, 15, 16, 17, 18, 20, 21, 22, 25, 28],
    lagna: { good: [1, 2, 5, 6, 8, 11], mid: [] },
    empty: [8],
    noteTa: 'சேர்க்கைகள்: மீனம்-பரணி, விருச்சிகம்-திருவோணம், கடகம்-விசாகம் "செழிப்பு" (கணிக்கப்படவில்லை) · 8 காலி: எல்லா விவசாய வேலைகளுக்கும் (PDF ப.48)',
  },
  JOSHI: {
    labelTa: 'ஜோஷி (ப.104)', booksTa: 'ஜோஷி',
    nak: { good: [18, 17, 5, 8, 24, 12, 2, 22, 21, 4, 14, 9, 11, 20, 25, 19, 1, 13, 7], mid: [] }, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 21, 22, 23, 25, 26, 27, 28],
    vara: { good: [0, 1, 3, 4, 5], mid: [] },
    lagna: { good: [1, 4, 7, 10], mid: [] },
  },
  SHRIDHAR_PADDY: {
    labelTa: 'ஸ்ரீதர் §21.5 — நெல் அறுவடை', booksTa: 'ஸ்ரீதர்',
    nak: { good: [18, 17, 5, 8, 24, 12, 2, 22, 21, 4, 14, 9, 11, 20, 25, 19, 1, 13, 7], mid: [10] }, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 21, 22, 23, 25, 26, 27, 28, 30],
    vara: { good: [0, 1, 3, 4, 5], mid: [] },
    lagna: { good: [1, 4, 7, 10], mid: [] },
  },
  RANGACHARYA: {
    labelTa: 'ரங்காச்சார்யா', booksTa: 'ரங்காச்சார்யா',
    nak: { good: [4, 5, 6, 9, 12, 14, 18, 21, 22], mid: [] }, digdwar: false,
    vara: { good: [1, 3, 4, 5], mid: [] },
    lagna: { good: [1, 4, 7, 10], mid: [] },
  },
});
const THRESHING = deepFreeze({
  labelTa: 'போரடித்தல், தானியம் பிரித்தல்',
  default: 'KALYANRAMAN',
  order: ['KALYANRAMAN', 'MUHURTA_CHINTAMANI', 'WILHELM', 'JOSHI', 'SHRIDHAR', 'RANGACHARYA'],
  KALYANRAMAN: {
    labelTa: 'கல்யாணராமன் (தொ.2 ப.177)', booksTa: 'கல்யாணராமன் (மு.சி. மேற்கோள்)',
    nak: { good: [10, 11, 21, 9, 17, 3, 18, 16, 26], mid: [] }, digdwar: false,
    tithi: [2, 3, 5, 6, 7, 10, 11, 12, 13, 15, 17, 18, 20, 21, 22, 25, 26, 27, 28],
    noteTa: 'எல்லாக் கிழமையும்',
  },
  MUHURTA_CHINTAMANI: {
    labelTa: 'முகூர்த்த சிந்தாமணி ஸ்லோ.2/32', booksTa: 'முகூர்த்த சிந்தாமணி',
    nak: { good: [10, 11, 21, 9, 17, 3, 18, 16, 26], mid: [] }, digdwar: false,
  },
  WILHELM: {
    labelTa: 'வில்ஹெல்ம்', booksTa: 'வில்ஹெல்ம்',
    nak: { good: [10, 11, 21, 9, 17, 3, 18, 16, 26], mid: [] }, digdwar: false,
    vara: { good: [0, 1, 3, 4, 5], mid: [] },
    noteTa: 'ஜன்ம ராசியே லக்னம் — "எப்போதும் நல்லது"',
  },
  JOSHI: {
    labelTa: 'ஜோஷி (ப.105)', booksTa: 'ஜோஷி',
    nak: { good: [10, 11, 21, 9, 17, 3, 18, 16, 26], mid: [] }, digdwar: false,
  },
  SHRIDHAR: {
    labelTa: 'ஸ்ரீதர் §21.5 — உமி நீக்குதல்', booksTa: 'ஸ்ரீதர்',
    nak: { good: [10, 11, 21, 9, 17, 3, 18, 16, 26], mid: [] }, digdwar: false,
  },
  RANGACHARYA: {
    labelTa: 'ரங்காச்சார்யா', booksTa: 'ரங்காச்சார்யா',
    nak: { good: [10, 11, 21, 9, 17, 3, 18, 16, 26], mid: [] }, digdwar: false,
  },
});
const GRAIN_STORAGE = deepFreeze({
  labelTa: 'தானியம் சேகரித்தல், களஞ்சியத்தில் வைத்தல்',
  default: 'KALYANRAMAN',
  order: ['KALYANRAMAN', 'WILHELM', 'SHRIDHAR_GATHER', 'RAMAN', 'RANGACHARYA', 'SHRIDHAR', 'JOSHI', 'MUHURTA_CHINTAMANI', 'VASHISTHA'],
  KALYANRAMAN: {
    labelTa: 'கல்யாணராமன் (தொ.2 ப.174)', booksTa: 'கல்யாணராமன் (மு.சி., காலப்பிரகாசிகை, மாதவீயம், காலதீபிகை … மேற்கோள்கள்)',
    nak: { good: [0, 3, 4, 6, 7, 11, 12, 13, 14, 16, 20, 21, 22, 23, 25, 26], mid: [] }, abhijitOk: true, digdwar: false,
    tithi: [2, 3, 5, 6, 7, 10, 11, 12, 13, 15, 17, 18, 20, 21, 22, 25, 26, 27, 28],
    vara: { good: [0, 4, 5], mid: [] },
    noteTa: 'மு.சி.: மிஸ்ர, உக்ர, திருவாதிரை, ஆயில்யம், கேட்டை தவிர 17 (மூலம் உட்பட) — மு.சி. வாசிப்பில் · காலப்பிரகாசிகை (சிராவணம், பாத்ரபதம் தவிர; 4-ல் சனி; 4, 6, 8, 9, 12, 14, 30 கூடாது; சர லக்னம் கூடாது …), மாதவீயம், காலதீபிகை (கும்ப பூர்த்தி நட்சத்திரம்), முகூர்த்தபதவி (பஞ்சபூர்த்தி), காலவிதானம் — குறிப்புகளில் · குளிகோதயம் தானியம் சேகரிக்க நல்லது',
  },
  WILHELM: {
    labelTa: 'வில்ஹெல்ம்', booksTa: 'வில்ஹெல்ம் (காலப்பிரகாசிகை, மு.சி. மேற்கோள்கள்)',
    masa: { good: [0, 1, 2, 3, 6, 7, 8, 9, 10, 11], mid: [], strict: true },
    nak: { good: [3, 4, 6, 7, 11, 12, 14, 16, 18, 20, 21, 25, 26], mid: [1, 5, 9, 10, 0, 13, 22, 23] }, digdwar: false,
    tithi: [1, 2, 3, 5, 7, 10, 11, 13, 15, 16, 17, 18, 20, 22, 25, 26, 28],
    vara: { good: [1, 4, 5, 6], mid: [3] },
    vishti: true,
    karanaFixed: true,
    lagna: { good: [1, 4, 7, 10], mid: [2, 5, 8, 11, 9], natalMoonOk: true },
    navNot: [0, 4, 7],
    beneficIn: [1, 5, 7, 9, 10],
    maleficIn: [3, 6, 11],
    notIn: [[['Sun', 'Mars', 'Saturn'], [1, 2, 12]]],
    want: [{ planets: ['Saturn'], houses: [4], code: 'SAT_4_MID' }],
    noteTa: 'லக்னம்: ஸ்திரம் சிறந்தது; உபயம் நடுத்தரம்; சரம் கூடாது, ஆனால் மு.சி.: மகரம் சரி (நடுத்தரம்) · பாவர் இருக்கும், அடுத்து வரும், விட்டுச் சென்ற ராசி — லக்னம், 2, 12-ல் பாவர் கூடாது (ஸ்ரீதரின் K.P. விளக்கம் — எங்கள் வாசிப்பு) · 4-ல் சனி — குறிக்கப்படும் · தான்ய பர்வத யோகம் முதலிய சேர்க்கைகள் — கணிக்கப்படவில்லை',
  },
  SHRIDHAR_GATHER: {
    labelTa: 'ஸ்ரீதர் §21.9 — பயிர் சேகரித்தல்', booksTa: 'ஸ்ரீதர் (K.P., M.G. மேற்கோள்கள்)',
    nak: { good: [3, 11, 20, 25, 1, 4, 5, 6, 7, 10, 9, 12, 14, 16, 18, 21, 26], mid: [] }, digdwar: false,
    tithi: [1, 2, 3, 5, 7, 10, 13, 16, 17, 18, 20, 22, 25, 28],
    vara: { good: [1, 4, 5, 6], mid: [3] },
    vishti: true,
    karanaFixed: true,
    lagna: { good: [1, 10], mid: [2, 5, 8, 11] },
    navNot: [0, 4, 7],
    beneficIn: [1, 4, 5, 7, 9, 10],
    maleficIn: [3, 6, 11],
    notIn: [[['Sun', 'Mars', 'Saturn'], [1, 2, 12]]],
    want: [{ planets: ['Saturn'], houses: [4], code: 'SAT_4_MID' }],
    noteTa: 'ஸ்திர லக்னம் சிறந்தது; ஆனால் ஞாயிறு, செவ்வாய் அதிபதிகளின் ராசி, நவாம்சம் (சிம்மம், மேஷம், விருச்சிகம்) கூடாது — ரிஷபம், கும்பம் மட்டும்; உபயம் நடுத்தரம் (எங்கள் வாசிப்பு) · 4-ல் சனி — குறிக்கப்படும் · குரு, சனி ஊர்த்வமுக நட்சத்திரத்தில், ஸ்திர நவாம்சத்தில் — மிகச் சிறப்பு; M.G.: விசாகம், ரோகிணி, கேட்டை … தானியம் பெருகும் (கணிக்கப்படவில்லை)',
  },
  RAMAN: {
    labelTa: 'ராமன் அத்.XIII', booksTa: 'ராமன்',
    nak: { good: [1, 3, 4, 10, 5, 6, 7, 9, 11, 12, 14, 16, 18, 21, 26], mid: [] }, digdwar: false,
    tithi: [1, 2, 3, 5, 7, 10, 11, 13, 15, 16, 17, 18, 20, 22, 25, 26, 28],
    vara: { good: [1, 4, 5, 6], mid: [3] },
    lagna: { good: [1, 2, 4, 5, 7, 8, 10, 11], mid: [] },
    navMid: [1, 3, 6, 8, 9, 10, 11],
    empty: [8],
    want: [{ planets: ['Saturn'], houses: [4], code: 'SAT_4_MID' }],
    noteTa: 'புதன் சொல்லப்படவில்லை — நடுத்தரம் · 4-ல் சனி — குறிக்கப்படும் · தான்ய பர்வத யோகம் (மாசி-மகம், பங்குனி-உத்திரம், ரிஷப லக்னம்) — கணிக்கப்படவில்லை · 8 காலி: எல்லா விவசாய வேலைகளுக்கும்',
  },
  RANGACHARYA: {
    labelTa: 'ரங்காச்சார்யா — களஞ்சியம்', booksTa: 'ரங்காச்சார்யா',
    nak: { good: [12, 13, 14, 6, 3, 21, 22], mid: [] }, digdwar: false,
    lagna: { good: [1, 4, 7, 10], mid: [] },
    noteTa: 'வைக்கோல் போர் (சுவாதி, மூலம், அஸ்தம் …), உணவுக்குத் தானியம் சேமித்தல் (மு.சி.-யின் பட்டியல்; துலாம், மேஷம், கடகம் லக்னம் கூடாது), விற்பனைக்குச் சேமித்தல் — குறிப்புகளில்',
  },
  SHRIDHAR: {
    labelTa: 'ஸ்ரீதர் §21.10 — சேமித்தல்', booksTa: 'ஸ்ரீதர் (M.G. மேற்கோள்)',
    nak: { good: [12, 0, 7, 4, 13, 16, 26, 3, 11, 20, 25, 6, 14, 21, 22, 23], mid: [] }, digdwar: false,
    tithi: [2, 3, 5, 7, 10, 11, 13, 15, 17, 18, 20, 22, 25, 26, 28],
    vara: { good: [0, 1, 4, 5], mid: [] },
    lagna: { good: [1, 2, 5, 8, 11], mid: [] },
    noteTa: 'விதை சேமிக்க (§21.11): ரோகிணி, புனர்பூசம், அஸ்தம், சித்திரை, சுவாதி, அவிட்டம் (M.G.: திருவோணமும்); புதன், வியாழன், வெள்ளி; ஸ்திர லக்னம் — கணிக்கப்படவில்லை',
  },
  JOSHI: {
    labelTa: 'ஜோஷி (ப.106)', booksTa: 'ஜோஷி',
    nak: { good: [3, 11, 20, 25, 12, 0, 7, 4, 13, 16, 26, 6, 14, 21, 22, 23], mid: [] }, abhijitOk: true, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 21, 22, 23, 25, 26, 27, 28],
    vara: { good: [0, 4, 5], mid: [] },
    yogaNot: [16, 26],
    vishti: true,
    noteTa: '"தீய யோகங்கள்" — வ்யதீபாதம், வைத்ருதி (ஜோஷி ப.104: "Vyatipaat, Vaidriti etc.")',
  },
  MUHURTA_CHINTAMANI: {
    labelTa: 'முகூர்த்த சிந்தாமணி ஸ்லோ.2/33', booksTa: 'முகூர்த்த சிந்தாமணி',
    nak: { good: [0, 3, 4, 6, 7, 11, 12, 13, 14, 16, 18, 20, 21, 22, 23, 25, 26], mid: [] }, digdwar: false,
    vara: { good: [1, 3, 4, 5], mid: [0] },
    lagna: { good: [1, 2, 4, 5, 7, 8, 9, 10, 11], mid: [] },
    noteTa: '"எல்லா சுப நாட்களிலும்" — திங்கள், புதன், வியாழன், வெள்ளி; ஞாயிறு நடுத்தரம் (எங்கள் வாசிப்பு) · தானியக் கடன் (ஸ்லோ.2/33 பிற்பகுதி) — கடன் குடும்பத்தில்',
  },
  VASHISTHA: {
    labelTa: 'வசிஷ்டா — கிழமை', booksTa: 'வசிஷ்டா (பொதுப் பட்டியல்)',
    vara: { good: [3], mid: [0, 1, 2, 4, 5, 6] },
    noteTa: 'பொதுப் பட்டியல் (தானியம் சேகரிக்கத் தனிப் பகுதி இல்லை): புதன் — "தானியம் சேகரித்தல்" · மற்ற கிழமை நடுத்தரம் (எங்கள் வாசிப்பு)',
  },
});
const NEW_GRAIN = deepFreeze({
  labelTa: 'புதுத் தானியம் உண்ணுதல் (நவான்னம்)',
  default: 'SHRIDHAR',
  order: ['SHRIDHAR', 'WILHELM', 'MUHURTA_CHINTAMANI'],
  SHRIDHAR: {
    labelTa: 'ஸ்ரீதர் §21.12', booksTa: 'ஸ்ரீதர் (மு.சி., K.P., B.J.S., பியூஷதாரா மேற்கோள்கள்)',
    masa: { good: [1, 2, 4, 5, 6, 7, 11], mid: [3, 8, 10], strict: true },
    nak: { good: [6, 14, 21, 22, 23, 12, 0, 7, 4, 13, 16, 26], mid: [3, 9, 11, 15, 18, 20, 25] }, digdwar: false,
    tithi: [2, 3, 5, 7, 10, 13, 17, 18, 20, 22, 25, 28], tithiMid: [1, 11, 16, 26],
    vara: { good: [3, 4, 5], mid: [] },
    vishti: true,
    starCount: [{ from: 'Mercury', of: 27, good: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 21, 22, 23, 24, 27], code: 'NAVANNA_CHAKRA' }],
    sunStarNot: [15],
    lagna: { good: [1, 3, 4, 5, 6, 8, 9, 10, 11], mid: [2] },
    emptyPref: [9, 10],
    maleficIn: [3, 6, 11],
    notIn: [[['Moon'], [8, 12]]],
    noteTa: 'சிலர்: நந்தா திதி (1, 6, 11) கூடாது — 1, 11 நடுத்தரம் · விஷகடிகை — பக்கத்தின் லக்ன சுத்தி · K.P.: பரணி, கிருத்திகை, திருவாதிரை, ஆயில்யம், பூர்வங்கள், கேட்டை தவிர எல்லாம் — நடுத்தரம்; ஆடி, மார்கழி, மாசி — நடுத்தரம்; 9, 10 காலி — குறிக்கப்படும் · சித்திரை, தை (Pausha) கூடாது (மு.சி. 2/37) · சூரியன் விசாகத்தில் இருக்கும்போது கூடாது · நவான்ன சக்கரம் (B.J.S.) புதனிலிருந்து',
  },
  WILHELM: {
    labelTa: 'வில்ஹெல்ம்', booksTa: 'வில்ஹெல்ம் (காலப்பிரகாசிகை, மு.சி. மேற்கோள்கள்)',
    masa: { good: [1, 2, 4, 5, 6, 7, 11], mid: [3, 8, 10, 0, 9], strict: false },
    nak: { good: [0, 4, 6, 7, 12, 13, 14, 16, 21, 22, 23, 26], mid: [3, 9, 11, 15, 18, 20, 25] }, digdwar: false,
    tithi: [1, 2, 3, 5, 7, 10, 11, 13, 16, 17, 18, 20, 22, 25, 26, 28],
    vara: { good: [3, 4, 5], mid: [0, 1] },
    vishti: true,
    lagna: { good: [1, 3, 4, 5, 6, 8, 9, 10], mid: [2] },
    navMid: [1, 2, 5, 6, 8, 11],
    empty: [9, 10],
    maleficIn: [3, 6, 11],
    notIn: [[['Moon'], [8, 12]]],
    jupVenNotSet: true,
    noteTa: 'மாதம்: காலப்பிரகாசிகை (ஆடி, மார்கழி, மாசி), மு.சி. (சித்திரை, தை — "Pushya" மாதம்) — "தவிர்ப்பது நல்லது", நடுத்தரம் · "15-வது திதி" — பௌர்ணமி, அமாவாசை இரண்டும் (எங்கள் வாசிப்பு) · குரு, சுக்கிரன் பாதிப்பு — அஸ்தங்கம் மட்டும் கணிப்பு · விஷநாடி எல்லா வகையும் — பக்கத்தின் லக்ன சுத்தி · பூ — மேஷம், பழம் — மீனம், இலை — விருச்சிகம்',
  },
  MUHURTA_CHINTAMANI: {
    labelTa: 'முகூர்த்த சிந்தாமணி ஸ்லோ.2/37', booksTa: 'முகூர்த்த சிந்தாமணி',
    masa: { good: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11], mid: [], strict: true },
    nak: { good: [6, 14, 21, 22, 23, 12, 0, 7, 4, 13, 16, 26], mid: [] }, abhijitOk: true, digdwar: false,
    tithi: [2, 3, 4, 5, 7, 8, 9, 10, 12, 13, 14, 15, 17, 18, 19, 20, 22, 23, 24, 25, 27, 28, 29, 30],
    vara: { good: [0, 1, 3, 4, 5], mid: [] },
    jupVenNotSet: true,
    noteTa: 'விஷகடிகை (நட்சத்திரவாரி அட்டவணை, குறிப்பு) — பக்கத்தின் லக்ன சுத்தி · "சுப லக்னம்" — கணிக்கப்படவில்லை · க்ஷிப்ர வகை அபிஜித் உட்பட',
  },
});
// ---------------------------------------------------------------------------
// Government, service and legal acts, added 2026-10-19
// ---------------------------------------------------------------------------
const ASSUMING_OFFICE = deepFreeze({
  labelTa: 'பதவி ஏற்பு — முடிசூட்டு, சத்தியப் பிரமாணம்',
  default: 'SHRIDHAR',
  order: ['SHRIDHAR', 'MUHURTA_CHINTAMANI', 'WILHELM', 'RANGACHARYA', 'VASHISTHA', 'JOSHI', 'KALYANRAMAN', 'AGARWAL', 'RAMAN'],
  SHRIDHAR: {
    labelTa: 'ஸ்ரீதர் §20.1', booksTa: 'ஸ்ரீதர் (J.V., K.P., வசிஷ்டர், தேவலர், காஷ்யபர், ஸ்ரீபதி, M.C. மேற்கோள்கள்)',
    masa: { good: [1, 2, 6, 7, 8, 9, 10, 11], mid: [], strict: true },
    uttarayana: 'PREFERRED',
    nak: { good: [12, 0, 7, 4, 16, 26, 3, 11, 20, 25, 21], mid: [13, 17] }, digdwar: false,
    tithi: [2, 3, 5, 7, 10, 11, 13, 16], tithiNot: [4, 9, 14, 19, 24, 29, 30],
    vara: { good: [1, 3, 4, 5], mid: [0, 6] },
    starCount: [{ from: 'Sun', of: 27, good: [3, 4, 5, 6, 8, 9, 10, 11, 12, 15, 16, 17, 18, 23, 24, 25, 26, 27], code: 'KING_CHAKRA' }],
    lagna: { good: [2, 4, 5, 6, 7, 10], mid: [1, 8, 11], alt: { houses: [3, 6, 11] } },
    empty: [8],
    beneficIn: [1, 2, 3, 4, 5, 7, 9, 10, 12],
    maleficIn: [3, 6, 11],
    notIn: [[['Sun', 'Mars', 'Saturn', 'Rahu', 'Ketu'], [1, 8, 12]]],
    jupVenNotSet: true,
    dayParts: { good: [1, 2, 3, 4], mid: [] },
    harishayana: true,
    sunSign: { good: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], mid: [] },
    noteTa: 'செவ்வாய் — "தள்ளுக" (பாதுகாப்பு அமைச்சர் செவ்வாயிலும் ஆகலாம்); வசிஷ்டர்: செவ்வாய், புதன் தள்ளு; தேவலர்: வெள்ளி, சனி, புதன் — ஞாயிறு, சனி நடுத்தரம் (எங்கள் வாசிப்பு) · சித்ரா (வசிஷ்டர், சந்திரேஸ்வரர் தள்ளுவர்), கேட்டை (J.V., K.P. தள்ளுவர்) — நடுத்தரம் · வளர் திதிகள் நல்லவை, தேய் 1 சேர்த்து; ரிக்த, அமாவாசை கூடாது; மற்ற திதி நடுத்தரம் · ஆடி, ஆவணி, புரட்டாசி, சித்திரை, அதிக மாதம், சூரியன் மீனத்தில் — கூடாது; J.V.: சூரியன் துலாம், விருச்சிகத்தில்; மார்கழி, ஐப்பசி சிறந்தவை · உத்தராயணம் "மிகப் பொருத்தம்" · லக்னம்: சிரோதய ராசி சிறந்தது (கூடுதல்: ஸ்திரம், உபயம் — நடுத்தரம்; சர ராசி "முயன்று தவிர்க்க"); ஜன்ம ராசி / ஜன்ம லக்னத்திலிருந்து 3, 6, 11 சிறப்பு; 8-ஆம் ராசி கூடாது (கணிக்கப்படவில்லை) · K.P.: 6, 7, 8, 10 தவிர எல்லா ராசிகளும் — தனி வாசிப்பு அல்ல · J.V.: ஸ்திர ராசி, நவாம்சம் — குறிப்புகளில் · பாவர் 1, 8, 12-ல் கூடாது (எல்லா நூல்களும்: லக்னத்தில் நோய், 8-ல் மரணம், 2 / 12-ல் வறுமை); மற்ற இடங்களில் குறிக்கப்படும் (வசிஷ்டர்: 1, 6, 8, 12-ல் கூடாது — 6-ல் J.V. நல்லது) · குருவின் கேந்திர / கோண இருப்பு, செவ்வாய் 6, சுக்கிரன் 10 — செல்வம் (கணிக்கப்படவில்லை) · சந்திரன் 6, 8, 12-ல் பலவீனம் · சூரிய நட்சத்திரத்திலிருந்து 1-2, 7, 13-14, 19-22-ஆவது கூடாது · இரவு — வசிஷ்டர் / சந்திரேஸ்வரர் தள்ளுவர்',
  },
  MUHURTA_CHINTAMANI: {
    labelTa: 'மு.சி. அத்.10 (ஸ்லோ.1-4)', booksTa: 'முகூர்த்த சிந்தாமணி',
    masa: { good: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], mid: [], strict: true },
    uttarayana: 'REQUIRED',
    nak: { good: [17, 21, 12, 0, 7, 4, 13, 16, 26, 3, 11, 20, 25], mid: [] }, abhijitOk: true, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 21, 22, 23, 25, 26, 27, 28, 30],
    lagna: { good: [2, 4, 5, 6, 7, 10], mid: [], alt: { houses: [3, 6, 10, 11] } },
    beneficIn: [1, 4, 7, 10, 5, 9, 11, 2, 3],
    maleficIn: [3, 6, 11],
    jupVenNotSet: true,
    noteTa: 'அதிபதிகளின் பலம் (சூரியன், செவ்வாய், ஜன்ம லக்னாதிபதி, தச நாதன், ஜன்ம ராசி நாதன்), சந்திரன் அஸ்தங்கம் இல்லை, செவ்வாயின் இரவு — கணிக்கப்படவில்லை (அஸ்தங்கம்: குரு, சுக்கிரன் மட்டும்) · கிழமை, சந்திர / தாரா — விதி இல்லை · அதிக மாசம் — கூடாது (பக்கத்தின் மாத விதியுடன்) · லக்னம்: தலையால் உதிக்கும் ராசிகள்; அல்லது அரசரின் ஜன்ம லக்னம் / ஜன்ம ராசியிலிருந்து 3, 6, 10, 11 (இங்கே ஜன்ம ராசியிலிருந்து எண்ணப்படும்) · சுபர் கேந்திர, கோண, 11, 2, 3-ல் · பாவர் 3, 6, 11-ல்; லக்னத்தில் நோய், 8-ல் மரணம், 5-ல் மகனுக்குத் துன்பம், 2 / 12-ல் வறுமை, 10-ல் சோம்பல், 4 / 7-ல் உரிமையிழப்பு · ஸ்லோ.3-4 சேர்க்கைகள் (குரு லக்னம் / கோணம், செவ்வாய் 6, சுக்கிரன் 10; சனி 3, சூரியன் 11, குரு 10 / 4) — குறிப்புகளில்',
  },
  WILHELM: {
    labelTa: 'வில்ஹெல்ம் — பதவி ஏற்பு', booksTa: 'வில்ஹெல்ம் (காலப்பிரகாசிகை, மு.சி. மேற்கோள்கள்)',
    masa: { good: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], mid: [], strict: true },
    uttarayana: 'PREFERRED',
    nak: { good: [0, 3, 4, 7, 11, 12, 16, 20, 21, 25, 26], mid: [13, 17, 6] }, digdwar: false,
    tithi: [1, 2, 3, 5, 7, 10, 11, 13, 15], tithiNot: [4, 9, 14, 19, 24, 29],
    vara: { good: [0, 1, 3, 4, 5], mid: [2, 6] },
    lagna: { good: [2, 4, 10], mid: [0, 1, 3, 5, 6, 7, 8, 11], natalMoonOk: true, alt: { houses: [3, 6, 10, 11], from: 'MOON' } },
    empty: [8],
    beneficIn: [1, 4, 7, 10, 5, 9, 2, 3, 11],
    maleficIn: [3, 6, 11],
    jupVenNotSet: true,
    noteTa: 'சனி, செவ்வாய் கிழமை சொல்லப்படவில்லை (செவ்வாய் இரவு கூடாது) — நடுத்தரம்; "சுபர் கிழமை" — சந்திரன், புதன், குரு, சுக்கிரன் (எங்கள் வாசிப்பு) · ஜன்ம நட்சத்திரமும் அதிலிருந்து 10-வதும் நல்லவை (பொதுத் தாரா விதிக்கு விலக்கு) · கேட்டை, சித்திரை (மு.சி.), புனர்பூசம் (காலப்பிரகாசிகை) — நடுத்தரம்; கிருஷ்ண பக்ஷம் நடுத்தரம் ("இயலாவிட்டால்") · லக்னம்: மிதுனம், சிம்மம், கும்பம் சிறந்தவை; காலப்பிரகாசிகை: மேஷம், ரிஷபம், கடகம், தனுசு, மீனம்; மு.சி.: கன்னி, துலாம், விருச்சிகம் — நடுத்தரம்; மகரம் சொல்லப்படவில்லை — கூடாது · பலமான சுபர் லக்னத்தில் / பார்வையில் (கணிக்கப்படவில்லை) · சந்திரன், குரு, சுக்கிரன் அஸ்தங்கம் கூடாது; சூரியன், செவ்வாய் பலம்; தச நாதன் பலம் — கணிக்கப்படவில்லை · சேர்க்கைகள்: குரு லக்னம் / கோணம், செவ்வாய் 6, சுக்கிரன் 10; சனி 3, சூரியன் 11, குரு 4 / 10',
  },
  RANGACHARYA: {
    labelTa: 'ரங்காச்சார்யா (அத்.IX)', booksTa: 'ரங்காச்சார்யா',
    masa: { good: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], mid: [], strict: true },
    uttarayana: 'PREFERRED',
    nak: { good: [3, 4, 7, 17, 11, 20, 25, 26, 0, 12, 13, 21], mid: [] }, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 21, 22, 23, 25, 26, 27, 28, 30],
    vara: { good: [0, 3, 4, 5], mid: [1, 6] },
    lagna: { good: [1, 2, 4, 6, 7], mid: [], alt: { houses: [3, 6, 10, 11] } },
    empty: [8, 12],
    beneficIn: [1, 2, 3, 4, 5, 7, 9, 10, 11],
    maleficIn: [3, 6, 11],
    dayParts: { good: [1, 2, 3, 4], mid: [] },
    noteTa: 'செவ்வாய் — "அமைச்சர், ஆளுநருக்கு ஆகாது; இராணுவத் தலைவருக்கு நல்லது" (அவர்களுக்கு: தள்ளாமல் நடுத்தரம் — கணிக்கப்படவில்லை) · திங்கள் சொல்லப்படவில்லை — நடுத்தரம்; சனி "நடுத்தரம்"; ஞாயிறு + நல்ல திதி — சிறப்பு · குரு சிம்மம் / மகரத்தில் இருக்கும்போது கூடாது (கணிக்கப்படவில்லை); அதிக / க்ஷய மாதம் கூடாது (பக்கத்தின் மாத விதி) · விம்சோபக அட்டவணை (ஒவ்வொரு கிரகத்தின் நல்ல / தீய இடம், புள்ளிகள்) — கணிக்கப்படவில்லை · நல்ல யோகங்கள்: குரு லக்னம் / 5 / 9, செவ்வாய் 6, சுக்கிரன் 10; சனி 3, சூரியன் 11, குரு 10 / 4 · திதி: ரிக்த தவிர எல்லாம் (எங்கள் வாசிப்பு)',
  },
  VASHISTHA: {
    labelTa: 'வசிஷ்டா — ராஜ்யாபிஷேகம்', booksTa: 'வசிஷ்டா',
    masa: { good: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], mid: [], strict: true },
    uttarayana: 'REQUIRED',
    nak: { good: [8, 3, 4, 6, 11, 20, 25, 12, 13, 16, 17, 21, 26], mid: [] }, digdwar: false,
    tithi: [2, 3, 5, 7, 10, 11, 13, 16], tithiNot: [4, 9, 14, 19, 24, 29],
    vara: { good: [0, 1, 4, 5], mid: [3, 6, 2] },
    lagna: { good: [1, 2, 4, 6, 7], mid: [], alt: { houses: [3, 6, 10, 11] } },
    empty: [8, 12],
    beneficIn: [1, 4, 7, 10, 5, 9],
    maleficIn: [3, 6, 11],
    noteTa: 'ரிக்த திதி, குறிப்பாகச் செவ்வாயுடன் — "பயன்படுத்தக்கூடாது" (செவ்வாய் நடுத்தரம்; புதன், சனி சொல்லப்படவில்லை — நடுத்தரம் — எங்கள் வாசிப்பு) · குரு சிம்மம் / மகரத்தில், மால மாதம் — கூடாது (மாத விதி: பக்கத்தின் அதிக மாசம்; குருவின் ராசி — கணிக்கப்படவில்லை) · ஜன்ம ராசி / லக்னத்திலிருந்து 3, 6, 10, 11 இடங்களில் சுபர் அல்லது சுபர் பார்வை — இங்கே அவை லக்னமாக வருவது · கிரகங்களின் நல்ல இடங்கள் (அட்டவணை: சூரியன் 3, 6, 9, 11 …) — கணிக்கப்படவில்லை · பாவர் லக்னம், 8, 5, 2 / 12, 10, 4 / 7-ல் தீயவை; சந்திரன் 6 / 8 / 12-ல் "பாலாரிஷ்டம்" — குறிக்கப்படும் இடங்கள் (3, 6, 11) · சுக்கிரன், குரு உதயம்; பலமான சூரியன், செவ்வாய், லக்னாதிபதி, தசமாதிபதி — கணிக்கப்படவில்லை · ஸ்திர லக்னம் விரும்பப்படும்',
  },
  JOSHI: {
    labelTa: 'ஜோஷி அத்.12', booksTa: 'ஜோஷி',
    uttarayana: 'REQUIRED',
    nak: { good: [17, 21, 12, 0, 7, 4, 13, 16, 26, 3, 11, 20, 25], mid: [] }, abhijitOk: true, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 21, 22, 23, 25, 26, 27, 28, 30],
    vara: { good: [0, 1, 4, 5], mid: [3, 6] },
    lagna: { good: [2, 4, 5, 6, 7, 10], mid: [], alt: { houses: [3, 6, 10, 11] } },
    beneficIn: [1, 4, 7, 10, 5, 9, 2, 3, 11],
    maleficIn: [3, 6, 11],
    jupVenNotSet: true,
    dayParts: { good: [1, 2, 3, 4], mid: [] },
    sunSign: { good: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], mid: [] },
    noteTa: 'செவ்வாய் "கூடாது"; புதன், சனி சொல்லப்படவில்லை — நடுத்தரம் (எங்கள் வாசிப்பு) · குரு, சுக்கிரன், செவ்வாய் உதயம், பலமான சூரியன், செவ்வாய், லக்னாதிபதிகள் — கணிக்கப்படவில்லை (அஸ்தங்கம் மட்டும்) · சந்திரன் 6 / 8 / 12-ல் கூடாது; சந்திர, தாரா சுத்தி "கட்டாயம்" (பக்கத்தின் நெடுவரிசைகள்)',
  },
  KALYANRAMAN: {
    labelTa: 'கல்யாணராமன் (தொ.2 ப.220)', booksTa: 'கல்யாணராமன் (மு.சி., J.V., காலப்பிரகாசிகை மேற்கோள்கள்)',
    masa: { good: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], mid: [], strict: true },
    uttarayana: 'REQUIRED',
    nak: { good: [0, 3, 4, 7, 11, 12, 13, 16, 17, 20, 21, 25, 26], mid: [] }, abhijitOk: true, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 21, 22, 23, 25, 26, 27, 28], tithiNot: [4, 9, 14, 19, 24, 29],
    vara: { good: [0, 1, 4, 6], mid: [3, 5] },
    lagna: { good: [2, 4, 5, 6, 7, 10], mid: [], alt: { houses: [3, 6, 10, 11] } },
    beneficIn: [1, 4, 7, 10, 5, 9, 2, 3, 11],
    maleficIn: [3, 6, 11],
    jupVenNotSet: true,
    dayParts: { good: [1, 2, 3, 4], mid: [] },
    sunSign: { good: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], mid: [] },
    noteTa: '"ஒற்றைப்படைத் திதிகள் 1/3/5/7/9/11/13/15" என்ற இரண்டாம் வரிசை (9 உட்பட) — முதல் வரிசையின் (ரிக்த கூடாது) சுருக்கமாக எடுத்தோம்; அதில் 9 ரிக்த · செவ்வாய் "கூடாது" (குறிப்பு 5) — பட்டியலில் இல்லை; புதன், வெள்ளி சொல்லப்படவில்லை — நடுத்தரம் (எங்கள் வாசிப்பு); சிலர் சனியையும் தள்ளுவர் · அதிபதிகளின் பலம் (குறிப்பு 2-3), சந்திரன் 6 / 8 / 12-ல் (குறிப்பு 8) — கணிக்கப்படவில்லை · ஜன்ம லக்னத்திலிருந்து சிரோதய ராசி, அல்லது ஜன்ம ராசியிலிருந்து 3, 6, 10, 11 (இங்கே ஜன்ம ராசியிலிருந்து) · சந்திரன் அஸ்தங்கம் கூடாது; செவ்வாய் / சுக்கிரன் / குரு உதயம் விரும்பப்படும் (கணிக்கப்படவில்லை) · இரவு, தட்சிணாயனம், சூரியன் மீனத்தில் கூடாது',
  },
  AGARWAL: {
    labelTa: 'அகர்வால் (ப.326)', booksTa: 'அகர்வால் (மு.சி. மேற்கோள்)',
    uttarayana: 'REQUIRED',
    nak: { good: [3, 4, 13, 16, 26, 11, 20, 25, 8, 6, 7, 12, 17, 21], mid: [] }, abhijitOk: true, digdwar: false,
    tithi: [2, 3, 5, 7, 10, 11, 13, 17, 18, 20, 22, 25, 26, 28],
    vara: { good: [1, 4, 5], mid: [] },
    lagna: { good: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11], mid: [], alt: { houses: [3, 6, 10, 11] } },
    empty: [8],
    beneficIn: [1, 4, 7, 10, 5, 9],
    maleficIn: [3, 6, 11],
    sunSign: { good: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], mid: [] },
    noteTa: 'லக்னம்: நான்கு பார்வைகளின் கூட்டு — சிரோதய ராசிகள், ஸ்திரம், 2 / 3 / 4 / 6 / 7 / 9 / 12, ஜன்ம ராசி / லக்னத்திலிருந்து 3, 6, 10, 11 (மேஷம், மகரம் மட்டும் இதில் இல்லை) · ஜன்ம ராசிக்குச் சந்திரன் 3, 6, 10, 11 முதலிய "பொருந்தாத" சேர்க்கைகள் — லக்ன / மாதம், லக்ன / திதி, கிழமை / திதி-நட்சத்திரம் — குறிப்புகளில் (கணிக்கப்படவில்லை) · லக்னம், 10-ஆம் வீடு, அதிபதிகள், சூரியன், சந்திரன் பலம்; குரு சூரியன் / சந்திரனைப் பார்த்தல் — கணிக்கப்படவில்லை · சந்திரன் 6 / 8 / 12-ல் — குறிப்பு இல்லை',
  },
  RAMAN: {
    labelTa: 'ராமன் அத்.XVI', booksTa: 'ராமன்',
    nak: { good: [0, 3, 4, 6, 7, 11, 12, 16, 20, 21, 25, 26], mid: [] }, digdwar: false,
    tithi: [1, 2, 3, 5, 7, 10, 11, 13, 15], tithiNot: [4, 9, 14, 19, 24, 29],
    lagna: { good: [0, 1, 2, 3, 4, 8, 10, 11], mid: [] },
    empty: [8],
    noteTa: 'கிருஷ்ண பக்ஷம் சொல்லப்படவில்லை — நடுத்தரம் (எங்கள் வாசிப்பு); கிழமை — விதி இல்லை · சூரியன், சந்திரன், லக்னம், 10-ஆம் வீடு, அவற்றின் அதிபதிகள் பலம்; பாவர் உபசய இடங்களில் (3, 6, 10, 11); சூரியன், சந்திரன் கடகம் / சிம்மத்தில் குரு பார்வையுடன் — கணிக்கப்படவில்லை · தாரா, சந்திர பலம், பஞ்சகம் — பக்கத்தின் நெடுவரிசைகள் · முடிசூட்டு: சிம்ம லக்னத்தில் சூரியன் + குரு பார்வை; மக்களாட்சி: கும்ப லக்னத்தில் சனி, அல்லது துலாத்தில் (குரு / சுக்கிர பார்வையுடன்)',
  },
});
const MEET_SUPERIOR = deepFreeze({
  labelTa: 'அரசர், மேலதிகாரியைச் சந்தித்தல்',
  default: 'SHRIDHAR',
  order: ['SHRIDHAR', 'WILHELM', 'KALYANRAMAN', 'JOSHI', 'AGARWAL', 'MUHURTA_CHINTAMANI'],
  SHRIDHAR: {
    labelTa: 'ஸ்ரீதர் §20.3', booksTa: 'ஸ்ரீதர் (K.P. மேற்கோள்)',
    nak: { good: [3, 11, 20, 25, 4, 13, 16, 26, 12, 0, 7, 21, 22], mid: [] }, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15], tithiNot: [4, 9, 14, 19, 24, 29, 30],
    vara: { good: [0, 3, 4, 5], mid: [1, 2, 6] },
    vishti: true,
    lagna: { good: [1, 4, 7, 10], mid: [0, 2, 3, 5, 6, 8, 9, 11] },
    beneficKendra: true,
    noteTa: 'வளர்பிறைத் திதிகள் (ரிக்த தவிர); தேய்பிறை நடுத்தரம் (எங்கள் வாசிப்பு) · சுபர் கிழமை, அவற்றின் அம்சம் — "பலன்தரும்"; மற்ற கிழமை நடுத்தரம் · ஸ்திர லக்னம் சிறந்தது; மற்றவை நடுத்தரம்; K.P.: புத ராசி, குரு வர்கோத்தமம் லக்னத்தில்; சந்திரன் உள்ள ராசி "வசியம்" — கணிக்கப்படவில்லை · பத்ர கரணம் (§20.4) கூடாது; சுபர் கேந்திர, கோணத்தில் (ஒருவர் போதும் — எங்கள் வாசிப்பு)',
  },
  WILHELM: {
    labelTa: 'வில்ஹெல்ம் — அரசரைக் காணுதல்', booksTa: 'வில்ஹெல்ம் (மு.சி., காலப்பிரகாசிகை மேற்கோள்கள்)',
    nak: { good: [0, 3, 4, 7, 11, 12, 13, 16, 21, 22, 26], mid: [20, 25] }, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15], tithiNot: [4, 9, 14, 19, 24, 29],
    vara: { good: [0, 3, 4, 5], mid: [1, 2, 6] },
    lagna: { good: [1, 4, 7, 10], mid: [2, 5, 8, 11] },
    navMid: [1, 2, 4, 5, 6, 8, 11],
    jupVenNotSet: true,
    noteTa: 'கிருஷ்ண பக்ஷம் "முடியாவிட்டால்" — நடுத்தரம் · "சுபர் கிழமை" சொல்லப்படாததால் சந்திரன், சனி, செவ்வாய் — நடுத்தரம் (எங்கள் வாசிப்பு) · நவாம்சம்: சூரியன் (சிம்மம்), புதன் (மிதுனம், கன்னி), குரு (தனுசு, மீனம்), சுக்கிரன் (ரிஷபம், துலாம்) — குறிக்கப்படும் · சந்திரன் இருக்கும் ராசி சந்திப்பவரின் ஜன்ம ராசிக்கு வசியம் (நாற்கால், மனிதன், நீர், காடு, பூச்சி வகை — அட்டவணை) — கணிக்கப்படவில்லை · குரு, சுக்கிர பாதிப்பு — அஸ்தங்கம் மட்டும் · புதன் லக்னம் + வர்கோத்தம குரு — மிகவும் நல்ல நேரம்',
  },
  KALYANRAMAN: {
    labelTa: 'கல்யாணராமன் (தொ.2 ப.220)', booksTa: 'கல்யாணராமன் (மு.சி. மேற்கோள்)',
    nak: { good: [0, 3, 4, 7, 11, 12, 13, 16, 20, 22, 25, 26], mid: [] }, abhijitOk: true, digdwar: false,
    tithi: [2, 3, 5, 7, 10, 11, 13, 15, 17, 18, 20, 22, 25, 26, 28],
    vara: { good: [0, 1, 3, 4, 5], mid: [] },
    beneficIn: [1, 4, 7, 10, 5, 9],
    maleficIn: [3, 6, 11],
    noteTa: 'மு.சி.: திருவோணமும், 6 / 12 திதிகளும் சேர்க்கும்; ஞாயிறு, வியாழன், வெள்ளி மட்டும் (திங்கள், புதன் "சிலர்" ஏற்பர்) — இங்கே நான்கு நூல்களின் பட்டியல் · வர்கோத்தம லக்னம் விரும்பப்படும் (கணிக்கப்படவில்லை) · சந்திர, தாரா சுத்தி "கட்டாயம்"',
  },
  JOSHI: {
    labelTa: 'ஜோஷி (ப.143)', booksTa: 'ஜோஷி',
    nak: { good: [3, 11, 20, 25, 4, 13, 16, 26, 12, 0, 7, 22], mid: [] }, abhijitOk: true, digdwar: false,
    vara: { good: [0, 4, 5], mid: [1, 3, 2, 6] },
    noteTa: '"சுப திதிகள், யோகங்கள்" — பட்டியல் இல்லை; கணிக்கப்படவில்லை · மற்ற கிழமை நடுத்தரம் (எங்கள் வாசிப்பு)',
  },
  AGARWAL: {
    labelTa: 'அகர்வால் (ப.326)', booksTa: 'அகர்வால்',
    nak: { good: [3, 4, 13, 16, 26, 11, 20, 25, 8, 7, 12], mid: [] }, abhijitOk: true, digdwar: false,
    tithi: [2, 3, 5, 7, 10, 11, 13, 17, 18, 20, 22, 25, 26, 28],
    vara: { good: [0, 1, 3, 4, 5], mid: [] },
    noteTa: 'தாரா, சந்திர பலம் "உறுதி செய்யலாம்" (பக்கத்தின் நெடுவரிசைகள்)',
  },
  MUHURTA_CHINTAMANI: {
    labelTa: 'மு.சி. ஸ்லோ.2/13 — அரசரைக் காணுதல்', booksTa: 'முகூர்த்த சிந்தாமணி',
    nak: { good: [21, 22, 4, 13, 16, 26, 3, 11, 20, 25, 12, 0, 7], mid: [] }, abhijitOk: true, digdwar: false,
    noteTa: 'க்ஷிப்ர வகை அபிஜித் உட்பட · திதி, கிழமை — விதி இல்லை',
  },
});
const JOIN_SERVICE = deepFreeze({
  labelTa: 'வேலையில் சேருதல், பணி தொடங்குதல்',
  default: 'SHRIDHAR',
  order: ['SHRIDHAR', 'JOSHI', 'KALYANRAMAN', 'WILHELM', 'MUHURTA_CHINTAMANI', 'AGARWAL', 'RANGACHARYA'],
  SHRIDHAR: {
    labelTa: 'ஸ்ரீதர் §20.5', booksTa: 'ஸ்ரீதர் (J.V. மேற்கோள்)',
    nak: { good: [3, 11, 20, 25, 4, 13, 16, 26, 12, 0, 7, 21, 22], mid: [] }, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 21, 22, 23, 25, 26, 27, 28],
    vara: { good: [0, 1, 3, 4, 5], mid: [6] },
    empty: [8],
    notIn: [[['Sun', 'Mars', 'Saturn', 'Rahu', 'Ketu'], [1, 2, 4, 7, 12]]],
    want: [{ planets: ['Venus', 'Moon'], houses: [1], code: 'VEN_MOON_LAGNA_MID' }, { planets: ['Sun'], houses: [10, 11], code: 'SUN_10_11_MID' }],
    nripBana: true,
    rajaPanchaka: true,
    noteTa: '"சுப திதிகள்" — ரிக்த, அமாவாசை தவிர எல்லாம் (எங்கள் வாசிப்பு) · செவ்வாய் கூடாது; சனி "சிலர்" — நடுத்தரம் · நட்சத்திரம்: "அரசரைக் காண" பட்டியலே · J.V. (அரசுப் பணிக்கு): சுக்கிரன் / சந்திரன் லக்னத்தில்; காத சந்திரன் கூடாது (கணிக்கப்படவில்லை); ந்ருப பாணம் (சூரியன் 5, 14, 23 பாகை) கூடாது; ராஜ பஞ்சகம் (திதி + லக்னம் ÷ 9 = 4; நர்மதைக்குத் தெற்கே) கூடாது · சூரியன் 10 / 11-ல் (குறிக்கப்படும்); ராசி மைத்ரி, யோனிப் பொருத்தம், நாடி; எஜமானரின் நாம நட்சத்திரம் வேலையாளுடையதற்கு 2-ஆவது எனில் இழப்பு — கணிக்கப்படவில்லை · 1, 2, 4, 7, 12-ல் பாவர் கூடாது; 8 காலி; 8-ஆம் அதிபதி லக்னத்தைத் தொடக்கூடாது (பிரகாஷ்)',
  },
  JOSHI: {
    labelTa: 'ஜோஷி (ப.103)', booksTa: 'ஜோஷி (மு.சி. மேற்கோள்; J.V. சிலர்)',
    nak: { good: [12, 0, 7, 4, 13, 16, 26, 3, 11, 20, 25, 21, 22], mid: [] }, abhijitOk: true, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 21, 22, 23, 25, 26, 27, 28, 30],
    vara: { good: [0, 1, 3, 4, 5], mid: [6] },
    want: [{ planets: ['Jupiter'], houses: [7], code: 'JUP_7_MID' }, { planets: ['Saturn'], houses: [6], code: 'SAT_6_MID' }, { planets: ['Sun', 'Mars'], houses: [3, 10, 11], code: 'SUN_MARS_3_10_11_MID' }, { planets: ['Venus', 'Moon'], houses: [1, 4], code: 'VEN_MOON_1_4_MID' }],
    noteTa: 'ஞாயிறு விடுமுறை எனினும் அன்றைய சூரிய ஹோரையும் ஏற்கப்படும் · "சிலர்" (J.V.): பூரங்கள், பரணி, கிருத்திகை, திருவாதிரை, ஆயில்யம், கேட்டை; தீய யோகங்கள், ரிக்த, 6 / 8 / 12 / 14 / 30; செவ்வாய், புதன், சனி — மாற்று வாசிப்பு (கணிக்கப்படவில்லை; இங்கே ரிக்த, செவ்வாய் மட்டும்) · ஷ்ராவணம், திருவோணம் "அனுமதி" · குரு 7, சனி 6, சூரியன் / செவ்வாய் 3 / 10 / 11, சுக்கிரன் / சந்திரன் 4 / லக்னம் — குறிக்கப்படும் · எஜமான் / வேலையாள் ராசி அதிபதி நட்பு, யோனிப் பொருத்தம், நட்சத்திர முன்பின் — கணிக்கப்படவில்லை; 10-ஆம் வீடு, லக்னம் பலம்; சந்திர (4, 8, 12), தாரா (3, 5, 7) — பக்கத்தின் நெடுவரிசைகள்',
  },
  KALYANRAMAN: {
    labelTa: 'கல்யாணராமன் (தொ.2 ப.221)', booksTa: 'கல்யாணராமன் (மு.சி., J.V. மேற்கோள்கள்)',
    nak: { good: [0, 3, 4, 7, 11, 12, 13, 16, 20, 21, 22, 25, 26], mid: [] }, abhijitOk: true, digdwar: false,
    tithi: [1, 2, 3, 5, 7, 10, 11, 13, 15, 16, 17, 18, 20, 22, 25, 26, 28],
    vara: { good: [0, 1, 3, 4, 5], mid: [] },
    want: [{ planets: ['Jupiter'], houses: [7], code: 'JUP_7_MID' }, { planets: ['Saturn'], houses: [6], code: 'SAT_6_MID' }, { planets: ['Sun', 'Mars'], houses: [3, 10, 11], code: 'SUN_MARS_3_10_11_MID' }, { planets: ['Venus', 'Moon'], houses: [1, 4], code: 'VEN_MOON_1_4_MID' }],
    noteTa: 'ஒரே பகுதி: அரசுப் பணி, நிறுவனப் பணி, வேலைக்காரரை வைத்தல், எஜமானரிடம் பணி · J.V.: பூரங்கள், பரணி, கிருத்திகை, திருவாதிரை, ஆயில்யம், கேட்டை; 4, 9, 14, 6, 8, 12, 30; செவ்வாய், சனி, புதன் "சிலர்" — தள்ளுவர்; மு.சி.: திங்கள் தள்ளும்; 8 நட்சத்திரம் மட்டும் (குறிப்பு 2); லக்னத்தில் சுபர், சூரியன் / செவ்வாய் 10 / 11-ல் · குரு 7-ல், சனி 6-ல், சூரியன் / செவ்வாய் 3 / 10 / 11-ல், சுக்கிரன் / சந்திரன் 4 / லக்னத்தில் — குறிக்கப்படும் · 10-ஆம் வீடு, லக்னம் பலம்; எஜமான், வேலையாளின் ராசி அதிபதிகள் நட்பு; எஜமானரின் நட்சத்திரம் வேலையாளுடையதற்கு முன் வரக்கூடாது; ஜன்ம நட்சத்திரத்திலிருந்து 3, 5, 7 கூடாது — கணிக்கப்படவில்லை (தாரா பக்கத்தில்) · ஞாயிறு — "முறைக்காக" கையெழுத்து; சூரிய ஹோரை',
  },
  WILHELM: {
    labelTa: 'வில்ஹெல்ம் — பணியாளர்', booksTa: 'வில்ஹெல்ம்',
    nak: { good: [0, 4, 7, 12, 13, 16, 26], mid: [3, 11, 20, 25] }, digdwar: false,
    vara: { good: [0, 3, 4, 5], mid: [1] },
    benHouse: { houses: [1], planets: ['Mercury', 'Jupiter', 'Venus', 'Moon'], code: 'BEN_LAGNA_MID' },
    want: [{ planets: ['Jupiter'], houses: [7], code: 'JUP_7_MID' }, { planets: ['Sun', 'Mars'], houses: [3, 10, 11], code: 'SUN_MARS_3_10_11_MID' }, { planets: ['Saturn'], houses: [6, 11], code: 'SAT_6_11_MID' }, { planets: ['Venus', 'Moon'], houses: [4], code: 'VEN_MOON_4_MID' }],
    noteTa: 'பணியாளரை வைக்கும்போதும், பணியாளர் பணி தொடங்கும்போதும், ஒருவர் எஜமானரிடம் பணி தொடங்கும்போதும் · சந்திரன் சொல்லப்படவில்லை — நடுத்தரம் (எங்கள் வாசிப்பு); செவ்வாய், சனி கூடாது · "சுபர் லக்னத்தில்" — சந்திரன், புதன், குரு, சுக்கிரன் (எங்கள் வாசிப்பு) · சனி / 6-ஆம் அதிபதி 11 / 6-ல் (அதிபதி — கணிக்கப்படவில்லை); சனிக்குச் செவ்வாய், ராகு பாதிப்பு கூடாது — கணிக்கப்படவில்லை · சேர்க்கை: வியாழக்கிழமை, குரு லக்னம், சூரியன் 11, சனி 6',
  },
  MUHURTA_CHINTAMANI: {
    labelTa: 'மு.சி. ஸ்லோ.2/26', booksTa: 'முகூர்த்த சிந்தாமணி',
    nak: { good: [12, 0, 7, 4, 13, 16, 26], mid: [] }, digdwar: false,
    vara: { good: [0, 3, 4, 5], mid: [1, 2, 6] },
    benHouse: { houses: [1], planets: ['Mercury', 'Jupiter', 'Venus', 'Moon'], code: 'BEN_LAGNA_MID' },
    want: [{ planets: ['Sun', 'Mars'], houses: [10, 11], code: 'SUN_MARS_10_11_MID' }],
    noteTa: 'கிழமை: புதன், வெள்ளி, ஞாயிறு, வியாழன்; மற்றவை நடுத்தரம் (எங்கள் வாசிப்பு) · லக்னத்தில் சுபர் (சந்திரன் உட்பட — எங்கள் வாசிப்பு), சூரியன் / செவ்வாய் 10 / 11-ல் — குறிக்கப்படும் · யோனி, ராசி அதிபதி நட்பு; எஜமானரின் நட்சத்திர வரிசை — கணிக்கப்படவில்லை · க்ஷிப்ரம் — ஆங்கிலப் பதிப்பில் அபிஜித் இல்லை',
  },
  AGARWAL: {
    labelTa: 'அகர்வால் (ப.326)', booksTa: 'அகர்வால்',
    nak: { good: [3, 4, 13, 16, 26, 11, 20, 25, 0, 7, 12], mid: [22, 21] }, abhijitOk: true, digdwar: false,
    tithi: [2, 3, 5, 7, 10, 11, 12, 13, 17, 18, 20, 22, 25, 26, 27, 28],
    vara: { good: [0, 1, 3, 4, 5], mid: [] },
    want: [{ planets: ['Jupiter'], houses: [7], code: 'JUP_7_MID' }, { planets: ['Saturn'], houses: [6], code: 'SAT_6_MID' }, { planets: ['Sun', 'Mars'], houses: [3, 10, 11], code: 'SUN_MARS_3_10_11_MID' }, { planets: ['Venus', 'Moon'], houses: [1, 4], code: 'VEN_MOON_1_4_MID' }],
    noteTa: 'குரு 7, சனி 6, சூரியன் / செவ்வாய் 3 / 10 / 11, சுக்கிரன் / சந்திரன் லக்னம் / 4 — குறிக்கப்படும் · தாரா, சந்திர சுத்தி "கட்டாயம்"',
  },
  RANGACHARYA: {
    labelTa: 'ரங்காச்சார்யா (ப.132)', booksTa: 'ரங்காச்சார்யா',
    nak: { good: [12, 13, 16, 26, 4, 7], mid: [] }, digdwar: false,
    vara: { good: [0, 3, 4, 5], mid: [1, 2, 6] },
    want: [{ planets: ['Sun', 'Mars'], houses: [10, 11], code: 'SUN_MARS_10_11_MID' }],
    noteTa: '"சுப திதிகள்" — பட்டியல் இல்லை · சூரியன் / செவ்வாய் 10 / 11-ல் "மிகவும் விரும்பப்படும்" (குறிக்கப்படும்) · மற்ற கிழமை நடுத்தரம் (எங்கள் வாசிப்பு)',
  },
});
const JOB_APPLICATION = deepFreeze({
  labelTa: 'வேலைக்கு / கட்சிச் சீட்டுக்கு விண்ணப்பித்தல்',
  default: 'SHRIDHAR',
  order: ['SHRIDHAR', 'KALYANRAMAN', 'AGARWAL', 'RANGACHARYA'],
  SHRIDHAR: {
    labelTa: 'ஸ்ரீதர் §20.6-20.7', booksTa: 'ஸ்ரீதர்',
    nak: { good: [0, 3, 4, 11, 20, 25, 13, 26], mid: [] }, digdwar: false,
    janmaCount: { good: [1, 2, 3, 4, 5, 6, 7, 15, 16, 17, 18, 19, 20, 21], code: 'JANMA_BODY' },
    noteTa: '"சந்திரன் சுபனாக இருக்கும் எல்லா நாளும்" (தனிப்பட்டது — பக்கத்தின் சந்திர பலம்) · திதி, கிழமை — விதி இல்லை · ஜன்ம நட்சத்திரத்திலிருந்து எண்ணிக்கை: 28-ல் அபிஜித் உட்பட (ஜன்ம நட்சத்திரம் மட்டும் இருந்தால்)',
  },
  KALYANRAMAN: {
    labelTa: 'கல்யாணராமன் (தொ.2 ப.222)', booksTa: 'கல்யாணராமன்',
    nak: { good: [0, 3, 4, 7, 11, 12, 13, 16, 20, 25, 26], mid: [] }, abhijitOk: true, digdwar: false,
    tithi: [2, 3, 5, 7, 10, 11, 13, 15, 17, 18, 20, 22, 25, 26, 28],
    vara: { good: [0, 1, 4, 5], mid: [] },
    noteTa: 'சந்திர, தாரா சுத்தி "கட்டாயம்" (பக்கத்தின் நெடுவரிசைகள்)',
  },
  AGARWAL: {
    labelTa: 'அகர்வால் (ப.326)', booksTa: 'அகர்வால்',
    nak: { good: [3, 4, 13, 16, 26, 11, 20, 25, 0, 7, 12], mid: [] }, abhijitOk: true, digdwar: false,
    tithi: [2, 3, 5, 7, 10, 11, 13, 15, 17, 18, 20, 22, 25, 26, 28],
    vara: { good: [0, 1, 4, 5], mid: [] },
  },
  RANGACHARYA: {
    labelTa: 'ரங்காச்சார்யா (ப.132)', booksTa: 'ரங்காச்சார்யா',
    nak: { good: [0, 26, 4, 7, 11, 20, 25, 12, 13, 16, 21, 22, 23], mid: [] }, digdwar: false,
    tithi: [2, 3, 5, 7, 11, 13, 15, 16],
    vara: { good: [0, 1, 4, 5], mid: [] },
    noteTa: '"1 (D)" — தேய்பிறை பிரதமை; மற்ற திதிகள் வளர்பிறையில் (எங்கள் வாசிப்பு); மற்றவை நடுத்தரம் · சொல்லாத திதி — நடுத்தரம் · "உத்தர" — மூன்று உத்திரமும் (அச்சில் "Uttara, Uttarashada, Uttarabhadra")',
  },
});
const EMPLOY_SERVANT = deepFreeze({
  labelTa: 'வேலைக்காரரை, பணியாளரை வைத்தல்',
  default: 'SHRIDHAR',
  order: ['SHRIDHAR', 'JOSHI', 'KALYANRAMAN', 'WILHELM', 'MUHURTA_CHINTAMANI', 'AGARWAL', 'RAMAN', 'RANGACHARYA'],
  SHRIDHAR: {
    labelTa: 'ஸ்ரீதர் §20.7', booksTa: 'ஸ்ரீதர்',
    janmaCount: { good: [1, 2, 3, 4, 5, 6, 7, 15, 16, 17, 18, 19, 20, 21], code: 'JANMA_BODY' },
    noteTa: 'எஜமானரின் ஜன்ம நட்சத்திரத்திலிருந்து எண்ணிக்கை (28 — அபிஜித் உட்பட): 1-7, 15-21 நல்லவை · "தாஸ", "தாசி" சக்கரங்கள் (எஜமானரின் நட்சத்திரம் வேலையாளுடையதிலிருந்து எண்ணி), நாடி, கணம், மைத்ரி, வசியம், பகூடம் — வேலையாளின் நட்சத்திரம் தேவை; கணிக்கப்படவில்லை · M.G.: அடிமையர் — ஸ்திர நட்சத்திரங்கள்',
  },
  JOSHI: {
    labelTa: 'ஜோஷி (ப.103) — வேலைக்காரரை வைத்தல்', booksTa: 'ஜோஷி (மு.சி. மேற்கோள்; J.V. சிலர்)',
    nak: { good: [12, 0, 7, 4, 13, 16, 26, 3, 11, 20, 25, 21, 22], mid: [] }, abhijitOk: true, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 21, 22, 23, 25, 26, 27, 28, 30],
    vara: { good: [0, 1, 3, 4, 5], mid: [6] },
    want: [{ planets: ['Jupiter'], houses: [7], code: 'JUP_7_MID' }, { planets: ['Saturn'], houses: [6], code: 'SAT_6_MID' }, { planets: ['Sun', 'Mars'], houses: [3, 10, 11], code: 'SUN_MARS_3_10_11_MID' }, { planets: ['Venus', 'Moon'], houses: [1, 4], code: 'VEN_MOON_1_4_MID' }],
    noteTa: 'ஞாயிறு விடுமுறை எனினும் அன்றைய சூரிய ஹோரையும் ஏற்கப்படும் · "சிலர்" (J.V.): பூரங்கள், பரணி, கிருத்திகை, திருவாதிரை, ஆயில்யம், கேட்டை; தீய யோகங்கள், ரிக்த, 6 / 8 / 12 / 14 / 30; செவ்வாய், புதன், சனி — மாற்று வாசிப்பு (கணிக்கப்படவில்லை; இங்கே ரிக்த, செவ்வாய் மட்டும்) · ஷ்ராவணம், திருவோணம் "அனுமதி" · குரு 7, சனி 6, சூரியன் / செவ்வாய் 3 / 10 / 11, சுக்கிரன் / சந்திரன் 4 / லக்னம் — குறிக்கப்படும் · எஜமான் / வேலையாள் ராசி அதிபதி நட்பு, யோனிப் பொருத்தம், நட்சத்திர முன்பின் — கணிக்கப்படவில்லை; 10-ஆம் வீடு, லக்னம் பலம்; சந்திர (4, 8, 12), தாரா (3, 5, 7) — பக்கத்தின் நெடுவரிசைகள்',
  },
  KALYANRAMAN: {
    labelTa: 'கல்யாணராமன் (தொ.2 ப.221) — வேலைக்காரரை வைத்தல்', booksTa: 'கல்யாணராமன் (மு.சி., J.V. மேற்கோள்கள்)',
    nak: { good: [0, 3, 4, 7, 11, 12, 13, 16, 20, 21, 22, 25, 26], mid: [] }, abhijitOk: true, digdwar: false,
    tithi: [1, 2, 3, 5, 7, 10, 11, 13, 15, 16, 17, 18, 20, 22, 25, 26, 28],
    vara: { good: [0, 1, 3, 4, 5], mid: [] },
    want: [{ planets: ['Jupiter'], houses: [7], code: 'JUP_7_MID' }, { planets: ['Saturn'], houses: [6], code: 'SAT_6_MID' }, { planets: ['Sun', 'Mars'], houses: [3, 10, 11], code: 'SUN_MARS_3_10_11_MID' }, { planets: ['Venus', 'Moon'], houses: [1, 4], code: 'VEN_MOON_1_4_MID' }],
    noteTa: 'ஒரே பகுதி: அரசுப் பணி, நிறுவனப் பணி, வேலைக்காரரை வைத்தல், எஜமானரிடம் பணி · J.V.: பூரங்கள், பரணி, கிருத்திகை, திருவாதிரை, ஆயில்யம், கேட்டை; 4, 9, 14, 6, 8, 12, 30; செவ்வாய், சனி, புதன் "சிலர்" — தள்ளுவர்; மு.சி.: திங்கள் தள்ளும்; 8 நட்சத்திரம் மட்டும் (குறிப்பு 2); லக்னத்தில் சுபர், சூரியன் / செவ்வாய் 10 / 11-ல் · குரு 7-ல், சனி 6-ல், சூரியன் / செவ்வாய் 3 / 10 / 11-ல், சுக்கிரன் / சந்திரன் 4 / லக்னத்தில் — குறிக்கப்படும் · 10-ஆம் வீடு, லக்னம் பலம்; எஜமான், வேலையாளின் ராசி அதிபதிகள் நட்பு; எஜமானரின் நட்சத்திரம் வேலையாளுடையதற்கு முன் வரக்கூடாது; ஜன்ம நட்சத்திரத்திலிருந்து 3, 5, 7 கூடாது — கணிக்கப்படவில்லை (தாரா பக்கத்தில்) · ஞாயிறு — "முறைக்காக" கையெழுத்து; சூரிய ஹோரை',
  },
  WILHELM: {
    labelTa: 'வில்ஹெல்ம் — பணியாளர்', booksTa: 'வில்ஹெல்ம்',
    nak: { good: [0, 4, 7, 12, 13, 16, 26], mid: [3, 11, 20, 25] }, digdwar: false,
    vara: { good: [0, 3, 4, 5], mid: [1] },
    benHouse: { houses: [1], planets: ['Mercury', 'Jupiter', 'Venus', 'Moon'], code: 'BEN_LAGNA_MID' },
    want: [{ planets: ['Jupiter'], houses: [7], code: 'JUP_7_MID' }, { planets: ['Sun', 'Mars'], houses: [3, 10, 11], code: 'SUN_MARS_3_10_11_MID' }, { planets: ['Saturn'], houses: [6, 11], code: 'SAT_6_11_MID' }, { planets: ['Venus', 'Moon'], houses: [4], code: 'VEN_MOON_4_MID' }],
    noteTa: 'பணியாளரை வைக்கும்போதும், பணியாளர் பணி தொடங்கும்போதும், ஒருவர் எஜமானரிடம் பணி தொடங்கும்போதும் · சந்திரன் சொல்லப்படவில்லை — நடுத்தரம் (எங்கள் வாசிப்பு); செவ்வாய், சனி கூடாது · "சுபர் லக்னத்தில்" — சந்திரன், புதன், குரு, சுக்கிரன் (எங்கள் வாசிப்பு) · சனி / 6-ஆம் அதிபதி 11 / 6-ல் (அதிபதி — கணிக்கப்படவில்லை); சனிக்குச் செவ்வாய், ராகு பாதிப்பு கூடாது — கணிக்கப்படவில்லை · சேர்க்கை: வியாழக்கிழமை, குரு லக்னம், சூரியன் 11, சனி 6',
  },
  MUHURTA_CHINTAMANI: {
    labelTa: 'மு.சி. ஸ்லோ.2/26 — வேலைக்காரரை வைத்தல்', booksTa: 'முகூர்த்த சிந்தாமணி',
    nak: { good: [12, 0, 7, 4, 13, 16, 26], mid: [] }, digdwar: false,
    vara: { good: [0, 3, 4, 5], mid: [1, 2, 6] },
    benHouse: { houses: [1], planets: ['Mercury', 'Jupiter', 'Venus', 'Moon'], code: 'BEN_LAGNA_MID' },
    want: [{ planets: ['Sun', 'Mars'], houses: [10, 11], code: 'SUN_MARS_10_11_MID' }],
    noteTa: 'கிழமை: புதன், வெள்ளி, ஞாயிறு, வியாழன்; மற்றவை நடுத்தரம் (எங்கள் வாசிப்பு) · லக்னத்தில் சுபர் (சந்திரன் உட்பட — எங்கள் வாசிப்பு), சூரியன் / செவ்வாய் 10 / 11-ல் — குறிக்கப்படும் · யோனி, ராசி அதிபதி நட்பு; எஜமானரின் நட்சத்திர வரிசை — கணிக்கப்படவில்லை · க்ஷிப்ரம் — ஆங்கிலப் பதிப்பில் அபிஜித் இல்லை',
  },
  AGARWAL: {
    labelTa: 'அகர்வால் (ப.325)', booksTa: 'அகர்வால்',
    vara: { good: [0, 1, 3, 4, 5], mid: [] },
    lagna: { good: [1, 4, 7, 10], mid: [0, 2, 3, 5, 6, 8, 9, 11] },
    want: [{ planets: ['Saturn'], houses: [11], code: 'SAT_11_MID' }],
    noteTa: 'ஸ்திர லக்னம் "இருக்க வேண்டும்" — மற்றவை நடுத்தரம் (எங்கள் வாசிப்பு) · புதன் பாதிப்பு, 6-ஆம் அதிபதி 11-ல், 11-ஆம் அதிபதி பலம் — கணிக்கப்படவில்லை; சனி 11-ல் (செவ்வாய், ராகு பார்வையின்றி) — குறிக்கப்படும்',
  },
  RAMAN: {
    labelTa: 'ராமன் அத்.X', booksTa: 'ராமன்',
    vara: { good: [0, 1, 3, 4, 5], mid: [] },
    lagna: { good: [1, 4, 7, 10], mid: [0, 2, 3, 5, 6, 8, 9, 11] },
    want: [{ planets: ['Saturn'], houses: [11], code: 'SAT_11_MID' }],
    noteTa: 'செவ்வாய், சனி கூடாது · 11-ஆம் அதிபதி பலம், 6-ஆம் அதிபதி 11-ல்; சனிக்குச் செவ்வாய், ராகு பார்வை கூடாது; புதன் பாதிப்பு (திருட்டு) — கணிக்கப்படவில்லை (சனி 11-ல் — குறிக்கப்படும்) · ஸ்திர லக்னம் "முடிந்தவரை" — மற்றவை நடுத்தரம்',
  },
  RANGACHARYA: {
    labelTa: 'ரங்காச்சார்யா (ப.132)', booksTa: 'ரங்காச்சார்யா',
    nak: { good: [4, 26, 16, 13, 11, 20, 25, 3], mid: [] }, digdwar: false,
    vara: { good: [0, 1, 4, 5], mid: [] },
    noteTa: 'செவ்வாய், புதன், சனி கூடாது · "உத்தர" — மூன்று உத்திரம் (அச்சில் "Uttara, Uttarashada, Uttarabhadra")',
  },
});
const FILE_SUIT = deepFreeze({
  labelTa: 'வழக்குத் தொடுத்தல் (நீதிமன்றம்)',
  default: 'JOSHI',
  order: ['JOSHI', 'KALYANRAMAN', 'SHRIDHAR', 'WILHELM', 'RAMAN', 'VASHISTHA', 'AGARWAL', 'RANGACHARYA'],
  JOSHI: {
    labelTa: 'ஜோஷி (ப.137)', booksTa: 'ஜோஷி (மு.சி. 11-ஆம் அத். மேற்கோள்)',
    nak: { good: [14, 1, 8, 22, 26, 12, 16, 6, 11, 20, 25, 3], mid: [18, 5, 23] }, digdwar: false,
    tithi: [1, 3, 5, 7, 9, 11, 13, 15, 16, 18, 20, 22, 24, 26, 28], tithiMid: [2, 6, 10, 17, 21, 25, 30],
    vara: { good: [0, 1, 4, 6], mid: [3] },
    noteTa: 'அபிஜித் "குலாகுல" (நடுத்தரம்) — சந்திரன் அபிஜித்தில் இருக்கும் அற்ப நேரம் இங்கே கணிக்கப்படவில்லை · அமாவாசை சொல்லப்படவில்லை — நடுத்தரம் (எங்கள் வாசிப்பு) · குலம் — தள்ளப்படும் (நட்சத்திரம், திதி 4 / 8 / 12 / 14, செவ்வாய், வெள்ளி) · "ஜீவ பக்ஷம், ம்ருத பக்ஷம்"; சந்திர / தாரா சுத்தி; வாதிக்கு வெற்றிச் சேர்க்கைகள் (8) — கணிக்கப்படவில்லை',
  },
  KALYANRAMAN: {
    labelTa: 'கல்யாணராமன் (தொ.2 ப.199)', booksTa: 'கல்யாணராமன் (மு.சி. மேற்கோள்)',
    nak: { good: [14, 1, 8, 22, 26, 12, 16, 6, 11, 20, 25, 3], mid: [18, 5, 23] }, digdwar: false,
    tithi: [1, 3, 5, 7, 9, 11, 13, 15, 16, 18, 20, 22, 24, 26, 28], tithiMid: [2, 6, 10, 17, 21, 25, 30],
    vara: { good: [0, 1, 4, 6], mid: [3] },
    noteTa: 'குலாகுல (மு.சி.) — நடுத்தரம்; அமாவாசை சொல்லப்படவில்லை — நடுத்தரம் (எங்கள் வாசிப்பு) · குலம் — தள்ளப்படும்',
  },
  SHRIDHAR: {
    labelTa: 'ஸ்ரீதர் §20.9d, §20.21', booksTa: 'ஸ்ரீதர்',
    nak: { good: [14, 1, 8, 22, 26, 12, 16, 6, 11, 20, 25, 3], mid: [18, 5, 23] }, digdwar: false,
    tithi: [1, 3, 5, 7, 9, 11, 13, 15, 16, 18, 20, 22, 24, 26, 28, 30], tithiMid: [2, 6, 10, 17, 21, 25],
    vara: { good: [0, 1, 4, 6], mid: [3] },
    noteTa: 'ஸ்ரீதரின் அட்டவணை 20.6: அகுல திதிகளில் 30 (அமாவாசை) உண்டு — இங்கே நல்லது; குலாகுல திதிகள் 2, 6, 10 — நடுத்தரம்; அபிஜித் குலாகுலத்தில் (நடுத்தரம்) · "மூன்றும் ஒன்றாக வந்தால்தான் யோகம்" என்கிறார் — அதாவது நட்சத்திரம், திதி, கிழமை மூன்றும் அகுலமாக இருக்க வேண்டும்; ஒன்று குறைந்தாலும் பலன் இல்லை (மூன்றும் இங்கே தனித்தனியாகக் குறிக்கப்படுகின்றன) · நாடி ஸ்வரம், ஸ்வர சித்தாந்தம் — கணிக்கப்படவில்லை · வாதியா பிரதிவாதியா என்பதைப் பொறுத்து (வெற்றி / தோல்வி / சமரசம்) தேர்வு — வாதிக்கான வாசிப்பு',
  },
  WILHELM: {
    labelTa: 'வில்ஹெல்ம் — வழக்கு', booksTa: 'வில்ஹெல்ம்',
    nak: { good: [14, 1, 8, 22, 26, 12, 16, 6, 11, 20, 25, 3], mid: [18, 5, 23] }, digdwar: false,
    tithi: [1, 3, 5, 7, 11, 13, 15, 16, 18, 20, 22, 26, 28], tithiMid: [2, 10, 17, 25, 30],
    vara: { good: [0, 1, 4, 6], mid: [3] },
    lagna: { good: [0, 1, 4, 8], mid: [3, 5, 6, 7, 9] },
    notIn: [[['Moon'], [4], true]],
    noteTa: '"எல்லா ஒற்றைத் திதிகளும்" — ஆனால் "பக்ஷ சித்ரம்" (4, 6, 8, 9, 12, 14) தவிர்க்கப்படும்: சித்ர திதிகள் (6, 9) தள்ளப்படும் (6, 9 இங்கே அகுல / குலாகுலத்தில் இருந்தாலும்); குலம் (4, 8, 12, 14) — தள்ளப்படும் · செவ்வாய், வெள்ளி குலம்; புதன் குலாகுல; அபிஜித் சொல்லப்படவில்லை · லக்னம்: மேஷம், ரிஷபம், சிம்மம், தனுசு சிறந்தவை; மற்ற சரம் (கடகம், துலாம், மகரம்), கன்னி, விருச்சிகம் நல்லவை — நடுத்தரம்; மிதுனம் "எப்போதும் தவிர்க்க"; கும்பம், மீனம் சொல்லப்படவில்லை — கூடாது · சந்திரன் 4-ல் — முதலில் வெற்றி, முடிவு அழிவு (குறிக்கப்படும்) · செவ்வாய்–சனி தொடர்பு; ஊக்கொள்ளுதல்; நிலத் தகராறில் கடக லக்னம், சந்திரன் பரணி / திருவாதிரை / விசாகம் / அஸ்தம் 4-ஆம் பாதம் — கணிக்கப்படவில்லை · புதன் நல்ல நிலை (சட்டத்தின் காரகன்) — கணிக்கப்படவில்லை',
  },
  RAMAN: {
    labelTa: 'ராமன் அத்.XVII', booksTa: 'ராமன்',
    nak: { good: [0, 3, 4, 7, 11, 12, 13, 16, 22, 26], mid: [] }, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 21, 22, 23, 25, 26, 27, 28],
    vara: { good: [0, 1, 3, 4, 5], mid: [] },
    lagna: { good: [0], mid: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
    notIn: [[['Sun', 'Mars', 'Saturn', 'Rahu', 'Ketu'], [6]]],
    want: [{ planets: ['Jupiter'], houses: [1, 5, 9], code: 'JUP_TRIKONA_MID' }],
    noteTa: '"வழக்கமான கெட்ட திதிகள்" — ரிக்த, அமாவாசை (ராமனின் பிற பகுதிகளின்படி — எங்கள் வாசிப்பு) · செவ்வாய், சனி கூடாது · லக்னம் அல்லது நவாம்சமாவது மேஷம் — "வெற்றிக்கு" (நவாம்சம் கணிக்கப்படவில்லை; மேஷம் அல்லாத லக்னம் நடுத்தரம்) · குரு திரிகோணத்தில் (குறிக்கப்படும்); 6-ல் பாவர் கூடாது; லக்னாதிபதி, 6-ஆம் அதிபதி தொலைவில் — கணிக்கப்படவில்லை · சுபர் கேந்திரத்தில் / ஆண் ராசிகளில், சுப பார்வை — "வழக்காடுவோரிடையே சமாதானம்" (கணிக்கப்படவில்லை)',
  },
  VASHISTHA: {
    labelTa: 'வசிஷ்டா — சிவில் வழக்கு', booksTa: 'வசிஷ்டா',
    nak: { good: [1, 5, 8, 9, 10, 19, 24, 17, 18], mid: [] }, digdwar: false,
    tithi: [3, 5, 8, 10, 13, 15],
    vara: { good: [0, 3, 4, 5], mid: [] },
    lagna: { good: [2, 5, 6, 7, 10], mid: [] },
    empty: [8],
    beneficIn: [1, 4, 7, 10],
    maleficIn: [3, 6, 11],
    noteTa: 'வளர்பிறைத் திதிகள் மட்டும் (தேய்பிறை நடுத்தரம் — எங்கள் வாசிப்பு) · சந்திரன், செவ்வாய் பலம், சந்திர சஞ்சாரம் நல்லது — கணிக்கப்படவில்லை · வழக்கறிஞரிடம் ஆலோசித்த பின் · குற்ற வழக்கு (ஷத்ரு தண்ட) தனிக் காரியம்',
  },
  AGARWAL: {
    labelTa: 'அகர்வால் (ப.325)', booksTa: 'அகர்வால்',
    nak: { good: [3, 4, 6, 12, 13, 22, 16, 26, 11, 20, 25, 0], mid: [] }, digdwar: false,
    tithi: [3, 5, 8, 10, 13, 15, 18, 20, 23, 25, 28],
    vara: { good: [2, 3, 4, 5], mid: [] },
    lagna: { good: [2, 5, 6, 7, 10], mid: [] },
    empty: [8],
    beneficIn: [1, 4, 7, 10, 5, 9],
    maleficIn: [3, 11],
    notIn: [[['Sun', 'Mars', 'Saturn', 'Rahu', 'Ketu'], [6]]],
    want: [{ planets: ['Jupiter'], houses: [5, 9], code: 'JUP_KONA_MID' }],
    noteTa: '"அல்லது அகுல யோகப்படி" — ஜோஷி / கல்யாணராமன் / வில்ஹெல்மின் அகுல அட்டவணை வேறு வாசிப்பு (கணிக்கப்படவில்லை) · "குருவின் கோணம்" — 5, 9 (குறிக்கப்படும்) · செவ்வாய் இங்கே நல்ல கிழமை; ராமன், ஜோஷி தள்ளுவர்',
  },
  RANGACHARYA: {
    labelTa: 'ரங்காச்சார்யா (ப.132)', booksTa: 'ரங்காச்சார்யா',
    nak: { good: [1, 17, 9, 10, 19], mid: [] }, digdwar: false,
    tithi: [3, 5, 8, 10, 13, 15, 18, 20, 23, 25, 28],
    vara: { good: [0, 3, 4, 5], mid: [] },
    noteTa: 'நட்சத்திரப் பட்டியலில் "Jyeshtta" இருமுறை அச்சாகியுள்ளது (வசிஷ்டாவின் 9 நட்சத்திரங்களில் இரண்டாவது ஆயில்யம் / திருவாதிரையாக இருக்கலாம்) — அச்சில் உள்ளபடி ஐந்து · திதிக்குப் பக்ஷம் சொல்லப்படவில்லை — இரு பக்ஷமும் (எங்கள் வாசிப்பு) · சந்திர பலம் "கட்டாயம்" (பக்கத்தின் நெடுவரிசை)',
  },
});
const COMPROMISE = deepFreeze({
  labelTa: 'சமரசம், ஒப்பந்தம், சமாதானம்',
  default: 'RAMAN',
  order: ['RAMAN', 'WILHELM', 'KALYANRAMAN'],
  RAMAN: {
    labelTa: 'ராமன் அத்.XVI', booksTa: 'ராமன்',
    nak: { good: [0, 1, 2, 3, 6, 7, 8, 9, 10, 11, 12, 15, 17, 18, 19, 20, 21, 24, 26], mid: [] }, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 10, 11, 13, 14, 16, 17, 18, 20, 21, 25, 26, 28, 29],
    lagna: { good: [1, 5, 11], mid: [0, 2, 3, 4, 6, 7, 8, 9, 10] },
    want: [{ planets: ['Saturn'], houses: [3, 6, 10, 11, 12], code: 'SAT_UPACHAYA_12_MID' }],
    conj: { planets: ['Mars', 'Saturn', 'Rahu'], with: ['Mars', 'Saturn', 'Rahu'] },
    noteTa: 'ராமனின் தள்ளிய எட்டில் அனுஷம் உண்டு (வில்ஹெல்ம், கல்யாணராமன் அனுஷத்தைச் சிறந்ததாகச் சொல்கிறார்கள்) — இங்கே ராமனின் பட்டியலின்படி கூடாது; மற்ற நட்சத்திரங்கள் நல்லவை (எங்கள் வாசிப்பு) · லக்னம் அல்லது நவாம்சம் ரிஷபம், கன்னி, மீனம் (நவாம்சம் கணிக்கப்படவில்லை; மற்ற லக்னம் நடுத்தரம்) · குரு பலம்; சுபர் பலம்; ஜாதகங்களின் இணக்கம் — கணிக்கப்படவில்லை · சனி 12 / உபசயம் (3, 6, 10, 11) — குறிக்கப்படும் · செவ்வாய்–ராகு, செவ்வாய்–சனி, ராகு–சனி சேர்க்கை கூடாது',
  },
  WILHELM: {
    labelTa: 'வில்ஹெல்ம் — சமாதானம், ஒப்பந்தம்', booksTa: 'வில்ஹெல்ம்',
    nak: { good: [7, 10], mid: [0, 1, 2, 3, 6, 8, 9, 11, 12, 15, 16, 17, 18, 19, 20, 21, 24, 26] }, digdwar: false,
    tithi: [8, 12, 23, 27], tithiNot: [4, 7, 9, 14, 15, 19, 22, 24, 29],
    lagna: { good: [1, 5, 11], mid: [0, 2, 3, 4, 6, 7, 8, 9, 10] },
    want: [{ planets: ['Saturn'], houses: [3, 6, 10, 11, 12], code: 'SAT_UPACHAYA_12_MID' }],
    conj: { planets: ['Mars', 'Saturn', 'Rahu'], with: ['Mars', 'Saturn', 'Rahu'] },
    noteTa: 'அனுஷம் "மிகச் சிறந்தவை"யிலும் "தவிர்க்க"விலும் அச்சாகியுள்ளது — நடுத்தரம் (அச்சில் உள்ளபடி) · "மற்ற நல்ல நட்சத்திரங்களும் ஏற்கப்படும்" — நடுத்தரம் (எங்கள் வாசிப்பு) · திதி: 8, 12 "குறிப்பாக நல்லவை"; "நல்ல திதி தேர்க" — மற்றவை நடுத்தரம் · தைதில கரணம் "குறிப்பாக நல்லது" (மற்ற நல்ல கரணமும் ஏற்கும்) — கணிக்கப்படவில்லை · குரு லக்னத்தில் / பார்வை, சுக்கிரன் லக்னப் பார்வை — கணிக்கப்படவில்லை · சமாதானம் நீடிக்கும் சேர்க்கைகள் (5) — குறிப்புகளில்',
  },
  KALYANRAMAN: {
    labelTa: 'கல்யாணராமன் (தொ.2 ப.199)', booksTa: 'கல்யாணராமன்',
    nak: { good: [7, 10, 16], mid: [] }, digdwar: false,
    tithi: [8, 12, 23, 27],
    vara: { good: [1, 3, 4, 5], mid: [] },
    yogaNot: [0, 5, 8, 9, 12, 14, 16, 18, 26],
    karanaOnly: [3],
    noteTa: 'தீய யோகங்கள் — "சுப யோகங்கள்" பட்டியலில் இல்லாத ஒன்பது (விஷ்கம்பம், அதிகண்டம், சூலம், கண்டம், வ்யாகாதம், வஜ்ரம், வ்யதீபாதம், பரிகம், வைத்ருதி) · தைதில கரணம் மட்டும் (அச்சில் "Karana: Taitila") · லக்னத்தில் சுக்கிரப் பார்வை — கணிக்கப்படவில்லை · குறிப்பு: வழக்கின் குறிப்புகளையும் பார்க்க (அகுல / குல)',
  },
});
// ---------------------------------------------------------------------------
// Money and trade acts, added 2026-10-19
// ---------------------------------------------------------------------------
const LEND_MONEY = deepFreeze({
  labelTa: 'கடன் கொடுத்தல், வட்டித் தொழில்',
  default: 'KALYANRAMAN',
  order: ['KALYANRAMAN', 'MUHURTA_CHINTAMANI', 'RANGACHARYA', 'WILHELM', 'SHRIDHAR', 'JOSHI', 'RAMAN', 'VASHISTHA', 'AGARWAL'],
  KALYANRAMAN: {
    labelTa: 'கல்யாணராமன் (தொ.2 ப.217-218)', booksTa: 'கல்யாணராமன் (மு.சி. மேற்கோள்)',
    nak: { good: [0, 4, 6, 7, 12, 13, 14, 16, 21, 22, 23, 26], mid: [] }, abhijitOk: true, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 21, 22, 23, 25, 26, 27, 28],
    vara: { good: [0, 1, 4, 5], mid: [2, 6] },
    yogaNot: [10, 16],
    vishti: true,
    karanaFixed: true,
    lagna: { good: [0, 3, 6, 9], mid: [] },
    empty: [5, 8, 9],
    noteTa: 'வணிகம் / கடன் பகுதியின் பதின்மூன்று நட்சத்திரங்கள் (அபிஜித் உட்பட) — பணப் பரிவர்த்தனைப் பட்டியலின் பத்தோடு அஸ்தம், புனர்பூசம், சித்திரை சேர்ந்தவை · புதன் தள்ளப்பட்டது (குறிப்பு 3) · செவ்வாய்: குறிப்பு 2 "வாங்கவும் கொடுக்கவும் தள்ளு", குறிப்பு 5 "வாங்கத் தள்ளியவை கொடுக்க ஏற்கத்தக்கவை" — முரண், நடுத்தரம் (எங்கள் வாசிப்பு) · சனி: பணப் பரிவர்த்தனைப் பட்டியலில் உண்டு, வணிகப் பட்டியலில் இல்லை — நடுத்தரம் · அம்ருத சித்தி யோகம் (ஞாயிறு + அஸ்தம்) கணிக்கப்படவில்லை',
  },
  MUHURTA_CHINTAMANI: {
    labelTa: 'மு.சி. ஸ்லோ.2/27 + 2/24', booksTa: 'முகூர்த்த சிந்தாமணி',
    nak: { good: [14, 6, 4, 13, 16, 26, 7, 21, 22, 23, 0], mid: [15] }, digdwar: false,
    vara: { good: [0, 1, 2, 4, 5, 6], mid: [] },
    yogaNot: [16],
    vishti: true,
    lagna: { good: [0, 3, 6, 9], mid: [] },
    empty: [5, 8, 9],
    noteTa: 'ஸ்லோ.2/27-இன் பன்னிரண்டில் விசாகம் உண்டு; ஸ்லோ.2/24-இன் மிஶ்ர (கார்த்திகை, விசாகம்) தள்ளுகிறது — விசாகம் நடுத்தரம் (எங்கள் வாசிப்பு, கல்யாணராமனும் இதையே சுட்டுகிறார்) · திதி சொல்லப்படவில்லை',
  },
  RANGACHARYA: {
    labelTa: 'ரங்காச்சார்யா (ப.129)', booksTa: 'ரங்காச்சார்யா',
    nak: { good: [14, 6, 7, 21, 4, 26, 13, 16, 0], mid: [] }, digdwar: false,
    vara: { good: [0, 1, 2, 4, 5, 6], mid: [] },
    lagna: { good: [0, 3, 6, 9], mid: [] },
    empty: [5, 8, 9],
    want: [{ planets: ['Mercury'], houses: [5, 8, 9], code: 'MERC_589_MID' }],
    noteTa: 'புதன் தள்ளப்பட்டது ("கொடுத்தால் திரும்பி வராது") · வட்டித் தொழிலுக்குப் புதன் 5, 8, 9-இல் — குறிக்கப்படுகிறது · தனஷ்டா பஞ்சகம், த்விபுஷ்கர / த்ரிபுஷ்கர யோகம் (வட்டித் தொழிலுக்கு) — கணிக்கப்படவில்லை · திதி சொல்லப்படவில்லை',
  },
  WILHELM: {
    labelTa: 'வில்ஹெல்ம் — கடன் கொடுத்தல், அடகு', booksTa: 'வில்ஹெல்ம்',
    nak: { good: [0, 4, 6, 7, 12, 13, 14, 16, 21, 22, 23, 26, 5], mid: [3, 11, 20, 25] }, digdwar: false,
    vara: { good: [0, 1, 2, 4, 5, 6], mid: [] },
    vishti: true,
    noteTa: 'வில்ஹெல்ம் தள்ளும் பத்து (பரணி, கார்த்திகை, ஆயில்யம், மகம், பூரம், விசாகம், கேட்டை, மூலம், பூராடம், பூரட்டாதி); ரோகிணி, 3 உத்திரங்கள் "அவ்வளவு வலுவில்லை" — நடுத்தரம்; திருவாதிரை அவர் பட்டியலில் இல்லை (மு.சி.யின் தீக்ஷ்ணத்தில் உண்டு) · சனிக்கிழமை அமாவாசையுடன் சேர்ந்தால் மிகக் கெட்டது — இரண்டின் சேர்க்கை கணிக்கப்படவில்லை · திதி சொல்லப்படவில்லை',
  },
  SHRIDHAR: {
    labelTa: 'ஸ்ரீதர் §25.2.1', booksTa: 'ஸ்ரீதர் (பீயூஷதாரா, K.P. மேற்கோள்கள்)',
    nak: { good: [6, 14, 21, 22, 23, 4, 13, 16, 26, 0], mid: [15] }, digdwar: false,
    vara: { good: [0, 1, 2, 4, 5, 6], mid: [] },
    yogaNot: [16],
    vishti: true,
    lagna: { good: [0, 3, 6, 9], mid: [] },
    empty: [5, 8, 9],
    noteTa: 'விசாகம் ஸ்ரீதரின் பட்டியலில் உண்டு, பீயூஷதாராவின் மிஶ்ரத்திலும் உண்டு — நடுத்தரம் (எங்கள் வாசிப்பு) · சதயம், புனர்பூசம் நல்ல பட்டியலில்; தங்கத்துக்கு மட்டும் அவை தள்ளப்படுகின்றன (K.P.) — குறிப்பு மட்டும் · திதி சொல்லப்படவில்லை',
  },
  JOSHI: {
    labelTa: 'ஜோஷி (ப.103)', booksTa: 'ஜோஷி',
    nak: { good: [14, 6, 21, 22, 23, 4, 26, 13, 16, 0, 7, 15], mid: [] }, digdwar: false,
    vara: { good: [0, 1, 4, 5, 6], mid: [] },
    yogaNot: [10],
    lagna: { good: [0, 3, 6, 9], mid: [] },
    empty: [5, 8, 9],
    noteTa: '"கடன் வாங்கவும் கொடுக்கவும் தள்ள வேண்டியவை: செவ்வாய்; வ்ருத்தி யோகம்; சங்கராந்தி" — செவ்வாயும் வ்ருத்தியும் இரண்டுக்கும்; சங்கராந்தி வாங்குவதற்கு மட்டும் என்று வாசிக்கிறோம் · புதன் கொடுக்கத் தள்ளு · திதி சொல்லப்படவில்லை',
  },
  RAMAN: {
    labelTa: 'ராமன் அத்.X — கடன் கொடுத்தல், அடகு', booksTa: 'ராமன்',
    nak: { good: [0, 1, 3, 4, 5, 7, 8, 10, 12, 13, 14, 15, 16, 17, 19, 20, 21, 22, 24, 25, 26], mid: [] }, digdwar: false,
    tithi: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29], tithiMid: [30],
    vara: { good: [0, 1, 3, 4, 6], mid: [] },
    noteTa: '"உத்திரம்" (Uttara) — உத்திரப் பல்குனி மட்டும் என்று வாசிக்கிறோம் (ஸ்ரீதர், வில்ஹெல்ம் K.P. பட்டியலில் U.Falguni) · ஜன்ம நட்சத்திரத்தில் கொடுக்கக் கூடாது — பக்கத்தில் தனியே குறிக்கப்படுகிறது · சனிக்கிழமை வரும் அமாவாசையில் ஒருபோதும் கொடுக்கக் கூடாது: அமாவாசை நடுத்தரம், சேர்க்கை கணிக்கப்படவில்லை · அடகு: விசாகம், கார்த்திகை, பரணி, மகம், 3 பூரங்கள், திருவாதிரை, ஆயில்யம், கேட்டை, மூலம் — மேலே தள்ளப்பட்டவற்றுக்கு வெளியே உள்ளவை இங்கே நல்லவையாகவே இருக்கின்றன (அடகுக்கு மட்டும் தள்ளு) · லக்னாதிபதி–7-ஆம் அதிபதி பொருத்தம், சந்திரன் விருச்சிகத்தில் — கணிக்கப்படவில்லை',
  },
  VASHISTHA: {
    labelTa: 'வசிஷ்டா (ப.135)', booksTa: 'வசிஷ்டா',
    nak: { good: [8, 4, 6, 7, 13, 14, 16, 17, 21, 22, 23, 26], mid: [] }, digdwar: false,
    tithi: [2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 16],
    vara: { good: [0, 1, 4, 5, 6], mid: [] },
    lagna: { good: [0, 3, 6, 9], mid: [] },
    empty: [8],
    want: [{ planets: ['Mercury', 'Jupiter', 'Venus'], houses: [5, 9], code: 'BEN_5_9_MID' }],
    noteTa: 'ஆயில்யமும் கேட்டையும் வசிஷ்டாவின் பட்டியலில் உண்டு — மற்ற நூல்கள் (மு.சி.யின் தீக்ஷ்ணம்) அவற்றைத் தள்ளுகின்றன; அச்சில் உள்ளபடியே வைக்கிறோம் · திதி: தேய்பிறைப் பிரதமை + வளர்பிறை 2-13, பௌர்ணமி · செவ்வாய், புதன் தள்ளு',
  },
  AGARWAL: {
    labelTa: 'அகர்வால் (ப.328)', booksTa: 'அகர்வால்',
    nak: { good: [0, 4, 6, 7, 12, 13, 14, 16, 21, 22, 23, 26], mid: [] }, digdwar: false,
    yogaNot: [16],
    vishti: true,
    noteTa: 'தள்ள வேண்டிய பதினைந்து மட்டுமே கொடுக்கிறார் (மு.சி. 2/24 அதே பட்டியல்); மீதி பன்னிரண்டு நல்லவை · திதி, கிழமை சொல்லப்படவில்லை · தாரா சுத்தி, சந்திர சுத்தி கட்டாயம் (அவரது பொதுக் குறிப்பு)',
  },
});
const BORROW_MONEY = deepFreeze({
  labelTa: 'கடன் வாங்குதல்',
  default: 'KALYANRAMAN',
  order: ['KALYANRAMAN', 'MUHURTA_CHINTAMANI', 'RANGACHARYA', 'JOSHI', 'WILHELM', 'RAMAN', 'SHRIDHAR', 'VASHISTHA'],
  KALYANRAMAN: {
    labelTa: 'கல்யாணராமன் (தொ.2 ப.218)', booksTa: 'கல்யாணராமன் (மு.சி. மேற்கோள்)',
    nak: { good: [1, 2, 3, 8, 9, 10, 15, 13, 18, 19, 23, 24], mid: [] }, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 21, 22, 23, 25, 26, 27, 28],
    sankranti: true,
    vara: { good: [0, 1, 3, 4, 5, 6], mid: [] },
    yogaNot: [10],
    vishti: true,
    karanaFixed: true,
    lagna: { good: [0, 3, 6, 9], mid: [] },
    empty: [5, 8, 9],
    noteTa: 'வாங்குவதற்கான நட்சத்திரப் பட்டியல் கொடுப்பதற்கானதற்கு நேர் எதிரானது (உக்ர / மிஶ்ர / த்ருவ சார்ந்தவை) — அச்சில் உள்ளபடியே · கிழமை வரிசையில் ஏழும் உள்ளன; குறிப்பு 2, 6 செவ்வாயைத் தள்ளுகின்றன · ரிக்தா திதி தள்ளு · அம்ருத சித்தி யோகம் (ஞாயிறு + அஸ்தம்) கணிக்கப்படவில்லை',
  },
  MUHURTA_CHINTAMANI: {
    labelTa: 'மு.சி. ஸ்லோ.2/27', booksTa: 'முகூர்த்த சிந்தாமணி',
    nak: { good: [14, 6, 4, 13, 16, 26, 15, 7, 21, 22, 23, 0], mid: [] }, digdwar: false,
    sankranti: true,
    vara: { good: [1, 3, 4, 5, 6], mid: [] },
    yogaNot: [10],
    lagna: { good: [0, 3, 6, 9], mid: [] },
    empty: [5, 8, 9],
    noteTa: 'அஸ்தம் மு.சி.யின் நல்ல பட்டியலில் இல்லை — வாங்கத் தள்ளப்பட்டதோடு ஒத்துப்போகிறது · ஞாயிறு தனியே தள்ளப்படுகிறது (அம்ருத சித்தி: ஞாயிறு + அஸ்தம்) · திதி சொல்லப்படவில்லை',
  },
  RANGACHARYA: {
    labelTa: 'ரங்காச்சார்யா (ப.129)', booksTa: 'ரங்காச்சார்யா',
    nak: { good: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26], mid: [] }, digdwar: false,
    vara: { good: [1, 3, 4, 5, 6], mid: [] },
    yogaNot: [10],
    lagna: { good: [0, 3, 6, 9], mid: [] },
    empty: [5, 8, 9],
    noteTa: 'வாங்குவதற்குத் தனி நட்சத்திரப் பட்டியல் இல்லை; அஸ்தம் மட்டும் தள்ளப்படுகிறது (மீதி நல்லவை — எங்கள் வாசிப்பு) · லக்னம், வீடுகள் கடன் பகுதியின் பொதுவானவை · திதி சொல்லப்படவில்லை',
  },
  JOSHI: {
    labelTa: 'ஜோஷி (ப.103)', booksTa: 'ஜோஷி',
    nak: { good: [14, 6, 21, 22, 23, 4, 26, 13, 16, 0, 7, 15], mid: [] }, digdwar: false,
    sankranti: true,
    vara: { good: [0, 1, 3, 4, 5, 6], mid: [] },
    yogaNot: [10],
    lagna: { good: [0, 3, 6, 9], mid: [] },
    empty: [5, 8, 9],
    noteTa: 'அஸ்தம் ஜோஷியின் பட்டியலிலும் இல்லை · அம்ருத சித்தி (ஞாயிறு + அஸ்தம்) கணிக்கப்படவில்லை · திதி சொல்லப்படவில்லை',
  },
  WILHELM: {
    labelTa: 'வில்ஹெல்ம் — கடன் வாங்குதல்', booksTa: 'வில்ஹெல்ம்',
    nak: { good: [0, 4, 6, 7, 13, 14, 15, 16, 21, 22, 23, 26], mid: [] }, digdwar: false,
    sankranti: true,
    vara: { good: [1, 3, 4, 5, 6], mid: [] },
    yogaNot: [10],
    lagna: { good: [0, 3, 6, 9], mid: [2, 5, 8, 11] },
    empty: [8],
    emptyPref: [5, 9],
    noteTa: '"சர ராசிகளே சிறந்தவை, குறிப்பாகத் துலாம்; ஸ்திர ராசிகளைத் தள்ளு" — த்விஸ்வபாவ ராசிகள் நடுத்தரம் (எங்கள் வாசிப்பு) · 8 காலியாக இருக்க வேண்டும்; 5, 9 காலியாக இருந்தால் நல்லது — குறிப்பு · கடன் எதற்காகவோ அதன் கிரகம் / பாவம் வலுவாக இருக்க வேண்டும் — கணிக்கப்படவில்லை · திதி சொல்லப்படவில்லை',
  },
  RAMAN: {
    labelTa: 'ராமன் அத்.X — கடன் வாங்குதல்', booksTa: 'ராமன்',
    nak: { good: [0, 1, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19, 20, 21, 23, 24, 25, 26], mid: [] }, digdwar: false,
    conj: { planets: ['Moon'], with: ['Mars', 'Saturn'] },
    noteTa: 'ஜன்ம நட்சத்திரத்தில் வாங்கக் கூடாது — பக்கத்தில் தனியே குறிக்கப்படுகிறது · சந்திரன் செவ்வாய் / சனியுடன் சேரக் கூடாது — சேர்க்கை குறிக்கப்படுகிறது (மூன்றில் எவை இரண்டு சேர்ந்தாலும்) · "திதி, கிழமை, நட்சத்திர சுத்தியும் தாராபலமும் முதன்மை" — பட்டியல் தரவில்லை',
  },
  SHRIDHAR: {
    labelTa: 'ஸ்ரீதர் §25.2.2', booksTa: 'ஸ்ரீதர் (ரத்னமாலா, ஜ்யோதிப்ரகாஷ் மேற்கோள்கள்)',
    nak: { good: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26], mid: [] }, digdwar: false,
    sankranti: true,
    vara: { good: [3], mid: [1, 4, 5, 6] },
    yogaNot: [10],
    noteTa: 'புதன் மட்டுமே பெயர் சொல்லி நல்லது; ஞாயிறு, செவ்வாய் தள்ளு; மீதி மூன்று கிழமைகள் சொல்லப்படவில்லை — நடுத்தரம் (எங்கள் வாசிப்பு) · அஸ்தம் தள்ளு · திதி சொல்லப்படவில்லை',
  },
  VASHISTHA: {
    labelTa: 'வசிஷ்டா (ப.136)', booksTa: 'வசிஷ்டா',
    nak: { good: [4, 13, 16, 26], mid: [8, 6, 7, 14, 17, 21, 22, 23] }, digdwar: false,
    tithi: [2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 16],
    sankranti: true,
    vara: { good: [1, 4, 5, 6], mid: [] },
    yogaNot: [10],
    lagna: { good: [0, 3, 6, 9], mid: [] },
    empty: [8],
    want: [{ planets: ['Mercury', 'Jupiter', 'Venus'], houses: [5, 9], code: 'BEN_5_9_MID' }],
    noteTa: 'கடன் கொடுக்கும் முகூர்த்தத்தின் அதே திதி, கிழமை, நட்சத்திரம், லக்னம்; மிருகசீரிடம், சித்திரை, அனுஷம், ரேவதி "விசேஷமாக நல்லவை" — அவை நல்லவை, மற்ற எட்டு நடுத்தரம் (எங்கள் வாசிப்பு) · ஞாயிறு, செவ்வாய் தள்ளு (கொடுக்கும் பட்டியலில் ஞாயிறு இருந்தாலும் வாங்குவதற்குத் தள்ளப்படுகிறது) · அஸ்தம் + சித்தி யோகம், சங்கராந்தி, வ்ருத்தி யோகம் தள்ளு',
  },
});
const REPAY_DEBT = deepFreeze({
  labelTa: 'கடன் திருப்பிச் செலுத்துதல்',
  default: 'WILHELM',
  order: ['WILHELM', 'KALYANRAMAN', 'JOSHI', 'SHRIDHAR', 'RANGACHARYA'],
  WILHELM: {
    labelTa: 'வில்ஹெல்ம் — கடனை அடைத்தல்', booksTa: 'வில்ஹெல்ம்',
    nak: { good: [0, 6, 7, 14, 23], mid: [2, 5, 9, 10, 15, 17, 18, 21, 22] }, digdwar: false,
    tithi: [4, 9, 14, 19, 24, 29], tithiNot: [6, 8, 12, 21, 23, 27],
    vara: { good: [1, 4, 5, 6], mid: [0, 2] },
    vishti: true,
    lagna: { good: [1, 2, 6], mid: [0, 3, 5, 8, 11] },
    want: [{ planets: ['Sun', 'Mars', 'Saturn', 'Rahu', 'Ketu'], houses: [8], code: 'MAL_8_MID' }],
    noteTa: 'ரிக்தா திதிகளே (4, 9, 14) மிகச் சிறந்தவை; 6, 8, 12 தள்ளு; மீதி நடுத்தரம் · "வழக்கமான நல்ல கிழமைகளுடன் சனியும்" — திங்கள், வியாழன், வெள்ளி, சனி நல்லவை; புதன் (புதன் கிரகம்) விசேஷமாகத் தள்ளு; ஞாயிறு, செவ்வாய் சொல்லப்படவில்லை — நடுத்தரம் · "ஸ்திர ராசிகளைத் தள்ளு" என்றாலும் ரிஷபம் சிறந்ததாகச் சொல்லப்படுகிறது — ரிஷபம் நல்லது (அச்சில் உள்ளபடி); சிம்மம், விருச்சிகம், கும்பம் தள்ளு · 8-இல் பாபன் நல்லது — குறிக்கப்படுகிறது',
  },
  KALYANRAMAN: {
    labelTa: 'கல்யாணராமன் (தொ.2 ப.219)', booksTa: 'கல்யாணராமன்',
    nak: { good: [4, 0], mid: [] }, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 21, 22, 23, 25, 26, 27, 28],
    vara: { good: [0, 1, 3, 4, 5], mid: [] },
    noteTa: 'தலைப்புப் பகுதி மிருகசீரிடம் மட்டும்; குறிப்பு 2 அசுவினியையும் சேர்க்கிறது — இரண்டும் நல்லவை · கிழமை: ஞாயிறு, திங்கள், புதன், வியாழன், வெள்ளி (செவ்வாய், சனி தள்ளு — இரு இடத்திலும் ஒன்றே)',
  },
  JOSHI: {
    labelTa: 'ஜோஷி (ப.103)', booksTa: 'ஜோஷி',
    nak: { good: [12], mid: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26] }, digdwar: false,
    vara: { good: [2], mid: [0, 1, 3, 4, 5, 6] },
    noteTa: '"கடன் வாங்கத் தள்ள வேண்டிய நாட்கள் திருப்பிச் செலுத்த நல்லவை" — செவ்வாய் நல்லது; அஸ்தம் (அம்ருத சித்தி ஞாயிற்றுடன்) நல்லது; மற்றவை நடுத்தரம், எதுவும் தள்ளப்படவில்லை (எங்கள் வாசிப்பு) · வ்ருத்தி யோகமும் சங்கராந்தியும் இங்கே "நல்லவை" என்று கணிக்கப்படவில்லை',
  },
  SHRIDHAR: {
    labelTa: 'ஸ்ரீதர் §25.2.2', booksTa: 'ஸ்ரீதர்',
    nak: { good: [12], mid: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26] }, digdwar: false,
    vara: { good: [0, 2], mid: [1, 3, 4, 5, 6] },
    noteTa: '"மேலே சொன்ன நேரத்தில் திருப்பிச் செலுத்துவது நல்லது" — சங்கராந்தி, வ்ருத்தி யோகம், அஸ்தம், ஞாயிறு, செவ்வாய் · அஸ்தமும் ஞாயிறு-செவ்வாயும் நல்லவை; மீதி நடுத்தரம், எதுவும் தள்ளப்படவில்லை (எங்கள் வாசிப்பு) · திதி சொல்லப்படவில்லை',
  },
  RANGACHARYA: {
    labelTa: 'ரங்காச்சார்யா (ப.129)', booksTa: 'ரங்காச்சார்யா',
    vara: { good: [2], mid: [0, 1, 3, 4, 5, 6] },
    noteTa: 'ஒரே வரி: செவ்வாய்க்கிழமை கடனை அடைக்க முயல் · மற்ற கிழமைகள் நடுத்தரம் (எங்கள் வாசிப்பு) · நட்சத்திரம், திதி சொல்லப்படவில்லை',
  },
});
const COLLECT_MONEY = deepFreeze({
  labelTa: 'பணம் வசூல், கொடுத்த பணம் திரும்பப் பெறுதல்',
  default: 'SHRIDHAR',
  order: ['SHRIDHAR', 'RAMAN', 'RANGACHARYA', 'MUHURTA_CHINTAMANI'],
  SHRIDHAR: {
    labelTa: 'ஸ்ரீதர் §25.2.3', booksTa: 'ஸ்ரீதர் (நாரதர் மேற்கோள்)',
    nak: { good: [3, 12, 26, 16, 7, 21], mid: [2, 9, 18, 17, 10, 19, 24, 15, 4, 13, 0] }, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 21, 22, 23, 25, 26, 27, 28], tithiMid: [4, 9, 14, 19, 24, 29, 30],
    vara: { good: [0, 3, 5], mid: [2] },
    noteTa: 'முதன்மைப் பட்டியலின் பதினைந்து நட்சத்திரங்களில் எட்டை (3 பூரங்கள், மகம், விசாகம், கார்த்திகை, மூலம், கேட்டை) நாரதர் தள்ளுகிறார் — அவை நடுத்தரம் (எங்கள் வாசிப்பு) · "சில அறிஞர்கள் மது (மிருகசீரிடம், சித்திரை, அனுஷம், ரேவதி), லகு (அஸ்தம், அசுவினி, பூசம்) சிறந்தவை என்கின்றனர்" — புதிதாக வரும் மிருகசீரிடம், சித்திரை, அசுவினி நடுத்தரம் · செவ்வாய் முதன்மைப் பட்டியலில் உண்டு, நாரதர் தள்ளுகிறார் — நடுத்தரம்; திங்கள், வியாழன், சனி சொல்லப்படவில்லை — தள்ளு · ரிக்தா, அமாவாசை நாரதர் வழி நடுத்தரம்',
  },
  RAMAN: {
    labelTa: 'ராமன் அத்.X — பணம் திரும்பப் பெறுதல்', booksTa: 'ராமன்',
    nak: { good: [2, 9, 18, 23, 11, 6], mid: [0, 1, 3, 4, 5, 7, 8, 10, 12, 13, 14, 15, 16, 17, 19, 20, 21, 22, 24, 25, 26] }, digdwar: false,
    lagnaBirth: { houses: [8, 9], from: 'EITHER' },
    noteTa: '"கொடுக்கக் கூடாத நட்சத்திரங்களில் பணம் பெற முயலு" — அந்த ஆறு நல்லவை, மீதி நடுத்தரம் (எங்கள் வாசிப்பு); ஜன்ம நட்சத்திரமும் அவற்றில் ஒன்று — பக்கத்தில் தனியே குறிக்கப்படுகிறது · முகூர்த்த லக்னம் ஜன்ம லக்னத்திலிருந்து (ஜன்ம ராசியிலிருந்தும்) 8 அல்லது 9-ஆம் ராசியாக இருக்கக் கூடாது · லக்னாதிபதி, 2-ஆம் அதிபதி வலு — கணிக்கப்படவில்லை',
  },
  RANGACHARYA: {
    labelTa: 'ரங்காச்சார்யா (ப.129)', booksTa: 'ரங்காச்சார்யா',
    nak: { good: [1], mid: [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26] }, digdwar: false,
    vara: { good: [3], mid: [0, 1, 2, 4, 5, 6] },
    noteTa: 'பரணி மட்டுமே பெயர் சொல்லப்படுகிறது; மற்ற நட்சத்திரங்களும் கிழமைகளும் நடுத்தரம், எதுவும் தள்ளப்படவில்லை (எங்கள் வாசிப்பு) · திதி சொல்லப்படவில்லை',
  },
  MUHURTA_CHINTAMANI: {
    labelTa: 'மு.சி. ஸ்லோ.2/27 குறிப்பு', booksTa: 'முகூர்த்த சிந்தாமணி',
    vara: { good: [3], mid: [0, 1, 2, 4, 5, 6] },
    noteTa: 'ஒரே வரி — புதன்கிழமை · மற்ற கிழமைகள் நடுத்தரம் (எங்கள் வாசிப்பு) · நட்சத்திரம், திதி சொல்லப்படவில்லை',
  },
});
const DEPOSIT_WEALTH = deepFreeze({
  labelTa: 'பணம் / நகை வைப்பு, வங்கி டெபாசிட், முதலீடு',
  default: 'WILHELM',
  order: ['WILHELM', 'MUHURTA_CHINTAMANI', 'KALYANRAMAN', 'SHRIDHAR', 'JOSHI', 'RANGACHARYA'],
  WILHELM: {
    labelTa: 'வில்ஹெல்ம் — சேமிப்பு, வைப்பு, முதலீடு', booksTa: 'வில்ஹெல்ம்',
    nak: { good: [4, 5, 7, 11, 12, 16, 20, 21, 22, 23, 25], mid: [0, 3, 6, 13, 14, 26] }, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 16, 17, 18, 20, 21, 22, 23, 25, 26, 27, 28, 30],
    vishti: true,
    karanaFixed: true,
    lagna: { good: [1, 4, 7, 10], mid: [2, 5, 8, 11] },
    navMid: [1, 2, 3, 5, 6, 8, 11],
    empty: [8],
    want: [{ planets: ['Jupiter', 'Saturn'], houses: [1], code: 'JUP_SAT_LAGNA_MID' }],
    noteTa: 'தள்ளப்பட்ட பத்து (பரணி, கார்த்திகை, ஆயில்யம், மகம், பூரம், விசாகம், கேட்டை, மூலம், பூராடம், பூரட்டாதி); சொல்லப்படாத ஆறு (அசுவினி, ரோகிணி, புனர்பூசம், சித்திரை, சுவாதி, ரேவதி) நடுத்தரம் (எங்கள் வாசிப்பு) · அமாவாசை தள்ளப்படவில்லை (பௌர்ணமி தள்ளப்படுகிறது) · ஸ்திர ராசி சிறந்தது, த்விஸ்வபாவம் நடுத்தரம் — சர ராசி தள்ளு · சந்திரன், புதன், குரு, சுக்கிரன் நவாம்சம் — குறிக்கப்படுகிறது · லக்னத்தில் குரு / சனி — குறிக்கப்படுகிறது',
  },
  MUHURTA_CHINTAMANI: {
    labelTa: 'மு.சி. ஸ்லோ.2/27 + 2/24', booksTa: 'முகூர்த்த சிந்தாமணி',
    nak: { good: [14, 6, 4, 13, 16, 26, 7, 21, 22, 23, 0], mid: [15] }, digdwar: false,
    yogaNot: [16],
    vishti: true,
    lagna: { good: [0, 3, 6, 9], mid: [] },
    empty: [5, 8, 9],
    noteTa: '"பெட்டியில் வைத்தல், புதைத்தல்" ஸ்லோ.2/24-இல் கடனோடு சேர்ந்தே சொல்லப்படுகிறது — அதே பதினைந்து தள்ளப்படுகின்றன; விசாகம் இரு பட்டியலிலும் இருப்பதால் நடுத்தரம் · திதி சொல்லப்படவில்லை',
  },
  KALYANRAMAN: {
    labelTa: 'கல்யாணராமன் (தொ.2 ப.217)', booksTa: 'கல்யாணராமன் (மு.சி. மேற்கோள்)',
    nak: { good: [0, 4, 7, 14, 15, 16, 21, 22, 23, 26], mid: [6, 13] }, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 21, 22, 23, 25, 26, 27, 28],
    vara: { good: [0, 1, 3, 4, 5, 6], mid: [] },
    yogaNot: [10],
    vishti: true,
    karanaFixed: true,
    lagna: { good: [0, 3, 6, 9], mid: [] },
    empty: [5, 8, 9],
    noteTa: 'கல்யாணராமனின் பத்து நல்லவை; மு.சி. சேர்க்கும் புனர்பூசம், சித்திரை நடுத்தரம் (எங்கள் வாசிப்பு) · புதன் வைப்புக்கு நல்லது (குறிப்பு 3) · செவ்வாய் மட்டும் தள்ளப்படுகிறது',
  },
  SHRIDHAR: {
    labelTa: 'ஸ்ரீதர் §20.16 + §25.2.4', booksTa: 'ஸ்ரீதர் (K.P. மேற்கோள்)',
    nak: { good: [4, 5, 7, 12, 16, 21, 22, 23, 11, 20, 25], mid: [15, 19, 26, 3] }, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 16, 17, 18, 20, 21, 22, 23, 25, 26, 27, 28],
    vara: { good: [1, 3, 4, 5], mid: [] },
    vishti: true,
    karanaFixed: true,
    lagna: { good: [1, 4, 7, 10], mid: [2, 5, 8, 11] },
    empty: [8],
    maleficIn: [3, 6, 11],
    want: [{ planets: ['Saturn', 'Jupiter'], houses: [1], code: 'JUP_SAT_LAGNA_MID' }],
    noteTa: '§20.16 (கருவூலம்) முதன்மை; §25.2.4 (புதைத்தல் / ரகசியமாக வைத்தல்) தரும் தனிஷ்டா, உத்திரம், விசாகம், பூராடம், ரேவதி, ரோகிணி — அவற்றில் புதிதாக வருபவை நடுத்தரம் (புதைப்பதற்கு மட்டும் — எங்கள் வாசிப்பு) · ரிக்தா, அமாவாசை, பௌர்ணமி தள்ளு · லக்னத்தில் சனி (தங்கம், ரத்தினம், தானியம்), குரு — குறிக்கப்படுகிறது; வர்கோத்தம குரு + கேந்திரத்தில் புதன், சுக்கிரன் — கணிக்கப்படவில்லை',
  },
  JOSHI: {
    labelTa: 'ஜோஷி (ப.103)', booksTa: 'ஜோஷி',
    nak: { good: [14, 6, 21, 22, 23, 4, 26, 13, 16, 0, 7, 15], mid: [] }, digdwar: false,
    vara: { good: [3], mid: [0, 1, 2, 4, 5, 6] },
    lagna: { good: [0, 3, 6, 9], mid: [] },
    empty: [5, 8, 9],
    noteTa: 'புதன் மட்டுமே வைப்புக்குப் பெயர் சொல்லப்படுகிறது; மற்ற கிழமைகள் நடுத்தரம் (எங்கள் வாசிப்பு) · திதி சொல்லப்படவில்லை',
  },
  RANGACHARYA: {
    labelTa: 'ரங்காச்சார்யா (ப.129)', booksTa: 'ரங்காச்சார்யா',
    nak: { good: [1], mid: [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26] }, digdwar: false,
    vara: { good: [3], mid: [0, 1, 2, 4, 5, 6] },
    noteTa: '"வங்கி வைப்பு பரணியில்" — பரணி மட்டுமே; மற்றவை நடுத்தரம் (எங்கள் வாசிப்பு) · மற்ற நூல்களின் பட்டியலில் பரணி தள்ளப்பட்ட நட்சத்திரம் — ரங்காச்சார்யா வேறுபடுகிறார் · திதி சொல்லப்படவில்லை',
  },
});
const MAKE_WILL = deepFreeze({
  labelTa: 'உயில் எழுதுதல்',
  default: 'SHRIDHAR',
  order: ['SHRIDHAR', 'RAMAN'],
  SHRIDHAR: {
    labelTa: 'ஸ்ரீதர் §20.19', booksTa: 'ஸ்ரீதர்',
    masa: { good: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], mid: [0], strict: false },
    uttarayana: 'PREFERRED',
    nak: { good: [0, 3, 4, 7, 11, 20, 25, 12, 13, 16, 17, 21, 26], mid: [] }, digdwar: false,
    tithi: [2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 16],
    vara: { good: [0, 1, 3, 4, 5, 6], mid: [] },
    lagna: { good: [2, 4, 5, 6, 7, 10], mid: [] },
    beneficIn: [1, 2, 4, 5, 7, 9, 10, 11],
    maleficIn: [3, 6, 11],
    want: [{ planets: ['Jupiter'], houses: [1, 5, 9], code: 'JUP_TRIKONA_MID' }, { planets: ['Mars'], houses: [6], code: 'MARS_6_MID' }, { planets: ['Venus'], houses: [10], code: 'VENUS_10_MID' }],
    jupVenNotSet: true,
    dayParts: { good: [1, 2, 3, 4], mid: [] },
    noteTa: 'திதி: தேய்பிறைப் பிரதமை + வளர்பிறை 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, பௌர்ணமி · இரவு தள்ளு · உத்தராயணம் விரும்பத்தக்கது, சித்திரை மாதம் தவிர்க்க · க்ஷய / அதிக மாதம் — கணிக்கப்படவில்லை · சூரியன், செவ்வாய், லக்னாதிபதி, ஜன்ம லக்னாதிபதி, சொத்துக்கு உரிய ராஜேஷ் வலு — கணிக்கப்படவில்லை · சனி 3-இல், சூரியன் 11-இல், குரு 4 / 10-இல் — கணிக்கப்படவில்லை',
  },
  RAMAN: {
    labelTa: 'ராமன் அத்.X', booksTa: 'ராமன்',
    nak: { good: [7], mid: [0, 1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26] }, digdwar: false,
    vara: { good: [3, 4], mid: [0, 1, 6] },
    lagna: { good: [1], mid: [4, 7, 10, 6, 8, 11] },
    want: [{ planets: ['Mars', 'Saturn'], houses: [3, 11], code: 'MARS_SAT_3_11_MID' }],
    noteTa: '"ஸ்திர ராசி" (ரிஷபம், சிம்மம், விருச்சிகம், கும்பம்) மற்றும் "குரு / சுக்கிரனின் ராசி" (ரிஷபம், துலாம், தனுசு, மீனம்) — இரண்டிலும் வருவது ரிஷபம் மட்டுமே; அது நல்லது, மற்ற நான்கும் (சிம்மம், விருச்சிகம், கும்பம், துலாம், தனுசு, மீனம்) நடுத்தரம் (எங்கள் வாசிப்பு) · பூசம் சிறந்தது, மற்ற நட்சத்திரங்கள் நடுத்தரம் · செவ்வாய், வெள்ளி தள்ளு · சந்திரனும் லக்னாதிபதியும் ஸ்திர ராசியில், 8-ஆம் வீட்டு வலு — கணிக்கப்படவில்லை · செவ்வாயும் சனியும் 3 / 11-இல் — குறிக்கப்படுகிறது',
  },
});
const PURCHASE_GOODS = deepFreeze({
  labelTa: 'பொருள் வாங்குதல் (வியாபாரம்)',
  default: 'KALYANRAMAN',
  order: ['KALYANRAMAN', 'WILHELM', 'SHRIDHAR', 'RANGACHARYA', 'RAMAN', 'MUHURTA_CHINTAMANI', 'AGARWAL'],
  KALYANRAMAN: {
    labelTa: 'கல்யாணராமன் (தொ.2 ப.218)', booksTa: 'கல்யாணராமன்',
    nak: { good: [0, 4, 6, 7, 12, 13, 14, 16, 21, 22, 23, 26], mid: [] }, abhijitOk: true, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 21, 22, 23, 25, 26, 27, 28],
    vara: { good: [0, 1, 3, 4, 5], mid: [] },
    noteTa: '"வணிகத்தில் நல்ல பலன், தொழில் தொடங்குதல், கடன் கொடுத்தல் / வாங்குதல் / திருப்பிச் செலுத்துதல்" — ஒரே பகுதி; வாங்குதல், விற்றல் என்று பிரிக்கவில்லை · சர (5), லகு (4), மது (4) நட்சத்திரங்கள் + அபிஜித்',
  },
  WILHELM: {
    labelTa: 'வில்ஹெல்ம் — எல்லா வணிகப் பரிவர்த்தனையும்', booksTa: 'வில்ஹெல்ம்',
    nak: { good: [26, 23, 0, 14, 21, 13], mid: [3, 4, 5, 6, 7, 9, 10, 11, 12, 15, 17, 18, 20, 25] }, digdwar: false,
    tithi: [1, 2, 3, 5, 7, 10, 11, 13, 15, 16, 17, 18, 20, 22, 25, 26, 28, 30],
    vara: { good: [0, 1, 3, 4, 5, 6], mid: [] },
    lagna: { good: [1, 2, 4, 6, 7], mid: [] },
    noteTa: 'வாங்குவதற்கு விசேஷமானவை ஆறு (அசுவினி, சித்திரை, சுவாதி, திருவோணம், சதயம், ரேவதி); எல்லா வணிகத்துக்கும் உரிய பதினேழில் மீதியவை நடுத்தரம் (எங்கள் வாசிப்பு) · செவ்வாய்க்கிழமை வாங்குவதற்கு மிகக் கெட்டது (வாங்கிய பொருளை செவ்வாய் ஆண்டால் தவிர) · விலங்குகளுக்குத் தனி விதிகள் (இங்கே இல்லை) · வாங்கும் பொருளை ஆளும் கிரகத்தை குரு பார்ப்பது நல்லது — கணிக்கப்படவில்லை',
  },
  SHRIDHAR: {
    labelTa: 'ஸ்ரீதர் §25.3.1, §25.3.3', booksTa: 'ஸ்ரீதர் (M.G., B.J.S., K.P. மேற்கோள்கள்)',
    nak: { good: [23, 0, 13, 21, 14, 26], mid: [7, 24, 11, 20, 25, 12, 4, 16, 8, 3] }, digdwar: false,
    tithi: [1, 2, 3, 5, 7, 10, 11, 13, 15, 16, 17, 18, 20, 22, 25, 26, 28, 30],
    vara: { good: [1, 4, 5], mid: [] },
    lagna: { good: [1, 2, 4, 6, 7], mid: [] },
    noteTa: '§25.3.1 (M.G.) தரும் ஆறே வாங்குவதற்கு உரியவை; §25.3.3-இன் கொள்முதல்-விற்பனைப் பட்டியல்களில் (B.J.S., M.G.) புதிதாக வருபவை நடுத்தரம் (எங்கள் வாசிப்பு) · கெட்ட திதிகள் 4, 6, 8, 9, 12, 14 (K.P.) · லக்னம் ரிஷபம், மிதுனம், சிம்மம், துலாம், விருச்சிகம் (K.P.) · ஒரு நட்சத்திரத்தில் வாங்கிய பொருளை அதே நட்சத்திரத்தில் விற்கக் கூடாது · நல்ல சகுனம் பார்க்க வேண்டும் (B.J.S.) — கணிக்கப்படவில்லை',
  },
  RANGACHARYA: {
    labelTa: 'ரங்காச்சார்யா (ப.128-129)', booksTa: 'ரங்காச்சார்யா',
    nak: { good: [26, 23, 0, 14, 21, 13], mid: [] }, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 21, 22, 23, 25, 26, 27, 28],
    lagna: { good: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11], mid: [] },
    beneficIn: [2, 4, 5, 7, 9, 10],
    maleficIn: [3, 10, 11],
    noteTa: 'கும்ப லக்னம் ஒருபோதும் கூடாது · ரிக்தா திதிகளும் அமாவாசையும் தள்ளு · சுபர் 2, 5, 9, 4, 7, 10-இல்; பாபர் 3, 10, 11-இல் — குறிக்கப்படுகின்றன · கிழமை சொல்லப்படவில்லை (வீடு / நிலத்துக்கு வியாழன், வெள்ளி, நந்தா திதி — அது தனிக் காரியம்)',
  },
  RAMAN: {
    labelTa: 'ராமன் அத்.X — வியாபாரத்துக்கு வாங்குதல்', booksTa: 'ராமன்',
    nak: { good: [7], mid: [0, 1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26] }, digdwar: false,
    tithi: [10, 25], tithiNot: [],
    vara: { good: [4], mid: [0, 1, 3, 5, 6] },
    noteTa: 'பூசம், வியாழன், தசமி "சிறந்தவை"; மற்ற நட்சத்திரங்களும் திதிகளும் நடுத்தரம் (எங்கள் வாசிப்பு) · செவ்வாய் முற்றிலும் தள்ளு; சனி "ஓரளவு" — நடுத்தரம் · புதன், 2-ஆம் அதிபதி, 2-ஆம் வீடு வலு; புதன் செவ்வாயால் பாதிக்கப்படுதல்; லக்னத்தில் புதன்-குரு சேர்க்கை — கணிக்கப்படவில்லை',
  },
  MUHURTA_CHINTAMANI: {
    labelTa: 'மு.சி. ஸ்லோ.2/16', booksTa: 'முகூர்த்த சிந்தாமணி',
    nak: { good: [26, 23, 0, 14, 21, 13], mid: [] }, digdwar: false,
    noteTa: 'ஆறு நட்சத்திரங்கள் மட்டும்; திதி, கிழமை, லக்னம் இந்த ஸ்லோகத்தில் இல்லை · விற்கும் நட்சத்திரத்தில் வாங்கக் கூடாது (ஸ்லோ.2/17-இன் விற்பனைப் பட்டியல்)',
  },
  AGARWAL: {
    labelTa: 'அகர்வால் (ப.328)', booksTa: 'அகர்வால்',
    nak: { good: [26, 23, 0, 14, 21, 13], mid: [] }, digdwar: false,
    noteTa: 'அதே ஆறு · "வாங்குதல் தொடர்ச்சியான செயல் — கடையில் விற்பதற்காகச் சரக்கு வைக்கும் கொள்முதலுக்கே இது" · திதி, கிழமை சொல்லப்படவில்லை · தாரா சுத்தி, சந்திர சுத்தி கட்டாயம் (அவரது பொதுக் குறிப்பு)',
  },
});
const SALE_GOODS = deepFreeze({
  labelTa: 'பொருள் விற்றல் (வியாபாரம்)',
  default: 'KALYANRAMAN',
  order: ['KALYANRAMAN', 'WILHELM', 'SHRIDHAR', 'RANGACHARYA', 'RAMAN', 'AGARWAL', 'JOSHI', 'MUHURTA_CHINTAMANI'],
  KALYANRAMAN: {
    labelTa: 'கல்யாணராமன் (தொ.2 ப.218)', booksTa: 'கல்யாணராமன்',
    nak: { good: [0, 4, 6, 7, 12, 13, 14, 16, 21, 22, 23, 26], mid: [] }, abhijitOk: true, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 21, 22, 23, 25, 26, 27, 28],
    vara: { good: [0, 1, 3, 4, 5], mid: [] },
    noteTa: '"வணிகத்தில் நல்ல பலன்" — வாங்குதல், விற்றல் என்று பிரிக்காத ஒரே பகுதி; எனவே விற்பதற்கான ஏழு நட்சத்திரங்களோடு இது முரண்படுகிறது (அச்சில் உள்ளபடியே)',
  },
  WILHELM: {
    labelTa: 'வில்ஹெல்ம் — எல்லா வணிகப் பரிவர்த்தனையும்', booksTa: 'வில்ஹெல்ம்',
    nak: { good: [1, 2, 8, 10, 15, 19, 24], mid: [0, 3, 4, 5, 6, 7, 9, 11, 12, 17, 18, 20, 23, 25, 26] }, digdwar: false,
    tithi: [1, 2, 3, 5, 7, 10, 11, 13, 15, 16, 17, 18, 20, 22, 25, 26, 28, 30],
    lagna: { good: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11], mid: [] },
    noteTa: 'விற்பதற்கு விசேஷமானவை ஏழு; எல்லா வணிகத்துக்கும் உரிய பதினேழில் மீதியவை நடுத்தரம் (எங்கள் வாசிப்பு) · "விற்பதற்கு மட்டும், கும்பம் தவிர எல்லா லக்னமும் நல்லது" · செவ்வாய்க்கிழமை வாங்குவதற்கே கெட்டது, விற்பதற்கு அல்ல',
  },
  SHRIDHAR: {
    labelTa: 'ஸ்ரீதர் §25.3.2, §25.3.3', booksTa: 'ஸ்ரீதர் (M.C., M.G., B.J.S., K.P. மேற்கோள்கள்)',
    nak: { good: [15, 2, 8, 1, 10, 19, 24], mid: [7, 24, 11, 20, 25, 14, 21, 0, 12, 4, 16, 8, 26, 3, 13] }, digdwar: false,
    tithi: [1, 2, 3, 5, 7, 10, 11, 13, 15, 16, 17, 18, 20, 22, 25, 26, 28, 30],
    vara: { good: [1, 4, 5], mid: [] },
    lagna: { good: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11], mid: [] },
    beneficIn: [1, 4, 5, 7, 9, 10],
    maleficIn: [3, 6, 11],
    noteTa: '§25.3.2 (M.C., M.G.) தரும் ஏழு விற்பதற்கு உரியவை; §25.3.3-இன் கொள்முதல்-விற்பனைப் பட்டியல் நடுத்தரம் (எங்கள் வாசிப்பு) · கும்பம் உதயமாகக் கூடாது · சுபர் கேந்திர / திரிகோணத்தில், பாபர் 3, 6, 11-இல் — குறிக்கப்படுகின்றன · "நல்ல திதிகளில்" = K.P.யின் கெட்ட திதிகள் (4, 6, 8, 9, 12, 14) நீங்கலாக (எங்கள் வாசிப்பு)',
  },
  RANGACHARYA: {
    labelTa: 'ரங்காச்சார்யா (ப.128-129)', booksTa: 'ரங்காச்சார்யா',
    nak: { good: [10, 19, 24, 15, 2, 8, 1], mid: [] }, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 21, 22, 23, 25, 26, 27, 28],
    lagna: { good: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11], mid: [] },
    beneficIn: [2, 4, 5, 7, 9, 10],
    maleficIn: [3, 10, 11],
    noteTa: 'விற்பதற்கு ஏழு: பூரம், பூராடம், பூரட்டாதி, விசாகம், கார்த்திகை, ஆயில்யம், பரணி · கும்ப லக்னம் கூடாது · ரிக்தா, அமாவாசை தள்ளு · கிழமை சொல்லப்படவில்லை',
  },
  RAMAN: {
    labelTa: 'ராமன் அத்.X — லாபத்துக்கு விற்றல்', booksTa: 'ராமன்',
    vara: { good: [1, 3, 4], mid: [0, 6] },
    want: [{ planets: ['Mercury'], houses: [1, 4, 7, 10], code: 'MERC_KENDRA_MID' }],
    conj: { planets: ['Moon', 'Mercury'], with: ['Mars'] },
    noteTa: 'செவ்வாய், வெள்ளி தள்ளு; சனி நடுத்தரம்; ஞாயிறு சொல்லப்படவில்லை — நடுத்தரம் (எங்கள் வாசிப்பு) · சந்திரன், புதன் செவ்வாயுடன் சேரக் / பார்க்கக் கூடாது — சேர்க்கை மட்டும் குறிக்கப்படுகிறது · புதன் கேந்திரத்தில் — குறிக்கப்படுகிறது · சந்திரன் ரிஷபம் / கடகம் / மீனத்தில் — கணிக்கப்படவில்லை · நட்சத்திரம், திதி சொல்லப்படவில்லை',
  },
  AGARWAL: {
    labelTa: 'அகர்வால் (ப.328)', booksTa: 'அகர்வால்',
    nak: { good: [10, 19, 24, 15, 2, 8, 1], mid: [] }, digdwar: false,
    tithi: [1, 2, 5, 7, 10, 11, 13, 16, 17, 20, 22, 25, 26, 28],
    lagna: { good: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11], mid: [] },
    beneficIn: [1, 2, 4, 5, 7, 9, 10],
    maleficIn: [3, 6, 11],
    noteTa: 'திதி 1, 2, 5, 7, 10, 11, 13 (இரு பக்ஷமும் — எங்கள் வாசிப்பு) · கும்ப லக்னம் கூடாது · கிழமை சொல்லப்படவில்லை · தாரா சுத்தி, சந்திர சுத்தி கட்டாயம்',
  },
  JOSHI: {
    labelTa: 'ஜோஷி (ப.101)', booksTa: 'ஜோஷி',
    nak: { good: [10, 19, 24, 15, 2, 8, 1], mid: [] }, digdwar: false,
    tithi: [1, 2, 3, 5, 7, 10, 11, 13, 16, 17, 18, 20, 22, 25, 26, 28],
    yogaNot: [0, 5, 8, 9, 12, 14, 16, 18, 26],
    lagna: { good: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11], mid: [] },
    beneficIn: [1, 2, 4, 5, 7, 9, 10],
    maleficIn: [3, 6, 11],
    noteTa: '"சுப திதிகள் (1/2/3/5/7/10/11/13)" — இரு பக்ஷமும் (எங்கள் வாசிப்பு) · "சுப யோகங்கள்" — அந்தப் பட்டியலில் இல்லாத ஒன்பது தீய யோகங்கள் தள்ளப்படுகின்றன (எங்கள் வாசிப்பு) · கும்ப லக்னம் கூடாது · சந்திர சுத்தி, தாரா சுத்தி கட்டாயம் (அத்தியாயக் குறிப்பு)',
  },
  MUHURTA_CHINTAMANI: {
    labelTa: 'மு.சி. ஸ்லோ.2/17', booksTa: 'முகூர்த்த சிந்தாமணி',
    nak: { good: [10, 19, 24, 15, 2, 8, 1], mid: [] }, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 21, 22, 23, 25, 26, 27, 28],
    lagna: { good: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11], mid: [] },
    beneficIn: [1, 4, 5, 7, 9, 10],
    maleficIn: [3, 6, 11],
    noteTa: '"நல்ல திதிகளில்" — ரிக்தாவும் அமாவாசையும் நீங்கலாக என்று வாசிக்கிறோம் · கும்பம் தவிர வேறு லக்னம் · சுபர் கேந்திர / திரிகோணத்தில், பாபர் 3, 6, 11-இல் — குறிக்கப்படுகின்றன · கடை திறத்தல் இதே ஸ்லோகத்தில் (அது "வியாபாரம் தொடங்குதல்" காரியத்தில்)',
  },
});
const SPECULATION = deepFreeze({
  labelTa: 'ஊக வணிகம் (பங்கு, சட்டை வியாபாரம்)',
  default: 'KALYANRAMAN',
  order: ['KALYANRAMAN'],
  KALYANRAMAN: {
    labelTa: 'கல்யாணராமன் (தொ.2 ப.218)', booksTa: 'கல்யாணராமன்',
    nak: { good: [1, 2, 8, 9, 10, 15, 18, 19, 24, 25], mid: [] }, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 21, 22, 23, 25, 26, 27, 28],
    vara: { good: [0, 1, 3, 4, 5], mid: [] },
    noteTa: 'பத்து நட்சத்திரங்கள், திதி வரிசை பணப் பரிவர்த்தனையின் அதே, கிழமை ஐந்து (செவ்வாய், சனி தள்ளு) · லக்னம், வீடு சொல்லப்படவில்லை',
  },
});
const LOTTERY = deepFreeze({
  labelTa: 'லாட்டரி, போட்டி, சூதாட்டம்',
  default: 'RAMAN',
  order: ['RAMAN', 'AGARWAL', 'KALYANRAMAN'],
  RAMAN: {
    labelTa: 'ராமன் அத்.XVII', booksTa: 'ராமன்',
    nak: { good: [0, 1, 6, 7, 12, 13, 15, 19, 26], mid: [] }, digdwar: false,
    tithi: [2, 3, 5, 6, 11, 13, 17, 18, 20, 21, 26, 28],
    vara: { good: [0, 1, 3, 4, 5], mid: [] },
    lagna: { good: [1, 2, 5, 6, 8, 11], mid: [] },
    notIn: [[['Mars'], [8]]],
    noteTa: 'சுப கிரகங்களின் ராசி லக்னம் (புதன், குரு, சுக்கிரன் — மிதுனம், கன்னி, தனுசு, மீனம், ரிஷபம், துலாம்) · செவ்வாய் 8-இல் கூடாது · திதி இரு பக்ஷமும் (எங்கள் வாசிப்பு) · "முகூர்த்தத்தை விட ஜாதக வலுவே முக்கியம்" என்பது ராமனின் எச்சரிக்கை',
  },
  AGARWAL: {
    labelTa: 'அகர்வால் (ப.325)', booksTa: 'அகர்வால்',
    nak: { good: [0, 1, 6, 7, 12, 13, 15, 19, 26], mid: [] }, digdwar: false,
    tithi: [2, 3, 5, 6, 11, 13, 17, 18, 20, 21, 26, 28],
    vara: { good: [0, 1, 3, 4, 5], mid: [] },
    lagna: { good: [1, 2, 5, 6, 8, 11], mid: [] },
    notIn: [[['Mars'], [8]]],
    noteTa: 'ராமனின் அதே விதிகள் (அகர்வால் சுருக்கமாகத் தருகிறார்) · தாரா சுத்தி, சந்திர சுத்தி கட்டாயம்',
  },
  KALYANRAMAN: {
    labelTa: 'கல்யாணராமன் (தொ.2 ப.219)', booksTa: 'கல்யாணராமன்',
    nak: { good: [4, 26], mid: [] }, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 21, 22, 23, 25, 26, 27, 28],
    vara: { good: [0, 1, 3, 4, 5], mid: [] },
    yogaNot: [0, 5, 8, 9, 12, 14, 16, 18, 26],
    vishti: true,
    noteTa: 'மிருகசீரிடம், ரேவதி மட்டும் · "நல்ல திதி, யோகம், கரணம்" — ரிக்தா / அமாவாசை தள்ளு, தீய ஒன்பது யோகங்கள் தள்ளு, விஷ்டி தள்ளு (எங்கள் வாசிப்பு) · லக்னம் சொல்லப்படவில்லை',
  },
});
const ACCOUNTS = deepFreeze({
  labelTa: 'கணக்கு எழுதத் தொடங்குதல், கடிதப் போக்குவரத்து',
  default: 'JOSHI',
  order: ['JOSHI', 'WILHELM'],
  JOSHI: {
    labelTa: 'ஜோஷி (ப.149)', booksTa: 'ஜோஷி',
    nak: { good: [12, 0, 7, 3, 11, 20, 25, 4, 13, 16, 26, 6, 21], mid: [] }, abhijitOk: true, digdwar: false,
    tithi: [1, 2, 3, 5, 7, 10, 11, 13, 16, 17, 18, 20, 22, 25, 26, 28],
    vara: { good: [0, 1, 3, 4, 5], mid: [] },
    lagna: { good: [1, 2, 5, 6, 8, 11], mid: [] },
    empty: [8, 12],
    beneficIn: [1, 4, 5, 7, 9, 10],
    noteTa: 'லகு (அஸ்தம், அசுவினி, பூசம், அபிஜித்), ஸ்திர (3 உத்திரங்கள், ரோகிணி), மது (மிருகசீரிடம், ரேவதி, சித்திரை, அனுஷம்) + புனர்பூசம், திருவோணம் · திதி இரு பக்ஷமும் (எங்கள் வாசிப்பு) · சுப கிரக ராசி லக்னம்; சுபர் கேந்திர / திரிகோணத்தில் — குறிக்கப்படுகிறது; 8, 12 காலி',
  },
  WILHELM: {
    labelTa: 'வில்ஹெல்ம் — கணக்கு, கடிதம்', booksTa: 'வில்ஹெல்ம்',
    nak: { good: [0, 3, 4, 6, 7, 11, 12, 13, 16, 20, 21, 25, 26], mid: [] }, digdwar: false,
    vara: { good: [0, 1, 3, 4, 5], mid: [] },
    lagna: { good: [1, 2, 5, 6, 8, 11], mid: [] },
    empty: [8, 12],
    noteTa: 'பதின்மூன்று நட்சத்திரங்கள் (ஜோஷியின் பட்டியலோடு கிட்டத்தட்ட ஒன்றே; அபிஜித் இல்லை) · திதி சொல்லப்படவில்லை · சுப கிரக ராசி லக்னம்; 8, 12 காலி',
  },
});
// ---------------------------------------------------------------------------
// Land and property acts, added 2026-10-19
// ---------------------------------------------------------------------------
const BUY_LAND = deepFreeze({
  labelTa: 'நிலம் வாங்குதல் (கட்டிடத்துக்கு)',
  default: 'RAMAN',
  order: ['RAMAN', 'WILHELM', 'SHRIDHAR', 'JOSHI', 'RANGACHARYA', 'VASHISTHA', 'AGARWAL'],
  RAMAN: {
    labelTa: 'ராமன் அத்.XII', booksTa: 'ராமன்',
    nak: { good: [0, 3, 4, 6, 7, 11, 12, 14, 16, 20, 21, 22, 23, 25], mid: [] }, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 21, 22, 23, 25, 26, 27, 28, 30],
    vara: { good: [1, 3, 4, 6], mid: [] },
    lagna: { good: [1, 4, 7, 10], mid: [0, 2, 3, 5, 6, 8, 9, 11] },
    notIn: [[['Mars'], [1]]],
    want: [{ planets: ['Jupiter'], houses: [1, 4, 5, 7, 9, 10], code: 'JUP_KENDRA_KONA_MID' }, { planets: ['Mars'], houses: [11], code: 'MARS_11_MID' }],
    varaLordLagna: 'MARK',
    noteTa: '"சில பழைய நூல்கள் செவ்வாயையும் சொல்கின்றன; எங்கள் தாழ்மையான கருத்தில் செவ்வாய் தள்ளப்பட வேண்டும்" — ராமன் தள்ளுகிறார் · ஸ்திர ராசி "விரும்பத்தக்கது" (இறுதிப் பேரம் பேசும்போது) — மற்ற ராசிகள் நடுத்தரம் (எங்கள் வாசிப்பு) · கிழமை அதிபதி லக்னத்தில், குரு கேந்திர / திரிகோணத்தில், செவ்வாய் 11-இல் — குறிக்கப்படுகின்றன; செவ்வாய் லக்னத்தில் கூடாது · லக்னாதிபதி–7-ஆம் அதிபதி பொருத்தம், 11-ஆம் அதிபதி 12-இல் — கணிக்கப்படவில்லை',
  },
  WILHELM: {
    labelTa: 'வில்ஹெல்ம் — ரியல் எஸ்டேட் வாங்குதல்', booksTa: 'வில்ஹெல்ம்',
    nak: { good: [0, 3, 4, 6, 7, 11, 12, 14, 16, 20, 21, 22, 23, 25], mid: [] }, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 21, 22, 23, 25, 26, 27, 28, 30],
    vara: { good: [1, 2, 3, 6], mid: [] },
    vishti: true,
    lagna: { good: [1, 4, 7, 10], mid: [2, 5, 8, 11] },
    empty: [8],
    want: [{ planets: ['Sun', 'Ketu'], houses: [1], code: 'SUN_KETU_LAGNA_MID' }],
    varaLordLagna: 'MARK',
    noteTa: 'ராமனின் அதே பதினான்கு நட்சத்திரங்கள் · திங்கள், செவ்வாய், புதன், சனி (ராமன் செவ்வாயைத் தள்ளுகிறார், வியாழனைச் சேர்க்கிறார்) · ஸ்திர ராசி சிறந்தது, த்விஸ்வபாவம் நடுத்தரம் — சர ராசி தள்ளு · 8 காலி · லக்னத்திலோ நவாம்சத்திலோ சூரியனும் கேதுவும் — நிலம் நிரந்தரமாகத் தங்கும் (குறிக்கப்படுகிறது; நவாம்சம் கணிக்கப்படவில்லை)',
  },
  SHRIDHAR: {
    labelTa: 'ஸ்ரீதர் §25.3.4, §27.17.1', booksTa: 'ஸ்ரீதர் (J.V. மேற்கோள்)',
    nak: { good: [4, 6, 8, 9, 15, 16, 10, 19, 24, 18, 26], mid: [] }, digdwar: false,
    tithi: [5, 6, 10, 11, 15, 16],
    vara: { good: [4, 5], mid: [] },
    noteTa: '§27.17.1-இல் "மிருகசீரிடம்" இருமுறை அச்சாகியுள்ளது; §21.17, §25.3.4 மற்றும் வசிஷ்டாவின் அதே பட்டியலில் அந்த இடத்தில் மூலம் உள்ளது — மூலம் என்று வாசிக்கிறோம் · திதி: §27.17.1-இன் தெளிவான பட்டியல் (தேய்பிறைப் பிரதமை + வளர்பிறை 5, 6, 10, 11, பௌர்ணமி); §25.3.4 "நந்தா, பூர்ணா திதிகள்" என்கிறது (1, 6, 11 / 5, 10, 15) — அகலமான வாசிப்பு ஜோஷி, ரங்காச்சார்யாவிடம் உள்ளது',
  },
  JOSHI: {
    labelTa: 'ஜோஷி (ப.102)', booksTa: 'ஜோஷி',
    nak: { good: [6, 8, 9, 15, 16, 10, 19, 24, 18, 26, 4], mid: [] }, digdwar: false,
    tithi: [1, 5, 6, 10, 11, 15, 16, 20, 21, 25, 26],
    vara: { good: [4, 5], mid: [1, 3] },
    noteTa: 'ஸ்ரீதரின் அதே பட்டியல் (பதினொன்று; ஸ்ரீதரிடம் உள்ள ரேவதியும் உண்டு) · நந்தா (1, 6, 11) + பூர்ணா (5, 10, 15) — இரு பக்ஷமும் (எங்கள் வாசிப்பு) · "சுப கிழமைகள், குறிப்பாக வியாழன், வெள்ளி" — அவ்விரண்டு நல்லவை, மற்ற சுப கிழமைகள் (திங்கள், புதன்) நடுத்தரம் (எங்கள் வாசிப்பு)',
  },
  RANGACHARYA: {
    labelTa: 'ரங்காச்சார்யா (ப.129)', booksTa: 'ரங்காச்சார்யா',
    nak: { good: [18, 4, 10, 16, 6], mid: [] }, digdwar: false,
    tithi: [1, 6, 11, 16, 21, 26],
    vara: { good: [4, 5], mid: [] },
    beneficIn: [2, 4, 5, 7, 9, 10],
    maleficIn: [3, 10, 11],
    noteTa: 'ஐந்து நட்சத்திரங்கள் மட்டும் — ஸ்ரீதர் / ஜோஷியின் பட்டியலின் சுருக்கம் · நந்தா திதி (1, 6, 11, இரு பக்ஷமும் — எங்கள் வாசிப்பு) · சுபர் 2, 5, 9, 4, 7, 10-இல்; பாபர் 3, 10, 11-இல் — குறிக்கப்படுகின்றன · வீடும் நிலமும் ஒரே விதி',
  },
  VASHISTHA: {
    labelTa: 'வசிஷ்டா (ப.119)', booksTa: 'வசிஷ்டா',
    nak: { good: [4, 6, 8, 9, 15, 16, 10, 19, 24, 18, 26], mid: [] }, digdwar: false,
    tithi: [5, 6, 10, 11, 15, 16],
    vara: { good: [4, 5], mid: [] },
    noteTa: 'ஸ்ரீதர் §27.17.1-இன் அதே திதி, கிழமை, நட்சத்திரம் (ஒரே மரபு) · லக்னம், வீடு சொல்லப்படவில்லை',
  },
  AGARWAL: {
    labelTa: 'அகர்வால் (ப.325) — கட்டிடத்துக்கு', booksTa: 'அகர்வால்',
    nak: { good: [0, 3, 4, 6, 7, 11, 12, 14, 16, 20, 21, 22, 23, 25], mid: [] }, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 21, 22, 23, 25, 26, 27, 28, 30],
    vara: { good: [1, 3, 4, 6], mid: [] },
    varaLordLagna: 'MARK',
    noteTa: 'ராமனின் அதே பதினான்கு நட்சத்திரங்களும் அதே நான்கு கிழமைகளும் · ரிக்தா திதி தள்ளு · "பரிவர்த்தனை நேரத்தில் கிழமை அதிபதி லக்னத்தில் இருந்தால் நல்லது" (விவசாய நிலப் பகுதியின் கீழ் அச்சிடப்பட்டது; இரண்டுக்கும் பொருந்தும் — எங்கள் வாசிப்பு) · தாரா சுத்தி, சந்திர சுத்தி கட்டாயம்',
  },
});
const BUY_FARMLAND = deepFreeze({
  labelTa: 'விவசாய நிலம் வாங்குதல்',
  default: 'RAMAN',
  order: ['RAMAN', 'AGARWAL', 'SHRIDHAR'],
  RAMAN: {
    labelTa: 'ராமன் அத்.XIII', booksTa: 'ராமன்',
    nak: { good: [0, 3, 4, 6, 7, 11, 21, 23, 25], mid: [] }, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 21, 22, 23, 25, 26, 27, 28, 30],
    krishnaMid: true,
    vara: { good: [1, 3, 6], mid: [] },
    vishti: true,
    want: [{ planets: ['Mars'], houses: [4], code: 'MARS_4_MID' }],
    noteTa: '"சந்திரன் வளர்பிறையில்" — தேய்பிறை நடுத்தரம் (எங்கள் வாசிப்பு) · "உத்திரம்" = உத்திரப் பல்குனி மட்டும் (கட்டிட நிலப் பட்டியலோடு ஒத்தது) · செவ்வாய் 4-இல் — குறிக்கப்படுகிறது · விஷ்டி கரணம் தள்ளு',
  },
  AGARWAL: {
    labelTa: 'அகர்வால் (ப.325) — விவசாயத்துக்கு', booksTa: 'அகர்வால்',
    nak: { good: [0, 3, 4, 6, 7, 11, 12, 14, 16, 20, 21, 22, 23, 25], mid: [] }, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 21, 22, 23, 25, 26, 27, 28, 30],
    vara: { good: [1, 3, 6], mid: [] },
    varaLordLagna: 'MARK',
    noteTa: 'கட்டிட நிலத்தின் அதே பதினான்கு நட்சத்திரங்கள்; கிழமை மட்டும் வேறு (வியாழன் இல்லை) · ரிக்தா திதி தள்ளு · கிழமை அதிபதி லக்னத்தில் — குறிக்கப்படுகிறது',
  },
  SHRIDHAR: {
    labelTa: 'ஸ்ரீதர் §21.17', booksTa: 'ஸ்ரீதர் (M.G. மேற்கோள்)',
    nak: { good: [4, 6, 8, 9, 15, 16, 10, 19, 24, 18, 26], mid: [] }, digdwar: false,
    tithi: [5, 6, 10, 11, 15, 16],
    vara: { good: [4, 5], mid: [] },
    noteTa: 'விவசாய அத்தியாயத்தில் அச்சிடப்பட்டாலும் §27.17.1 (வீட்டுக்கான நிலம்) அதே பட்டியலையே தருகிறது — ஸ்ரீதர் இரண்டையும் பிரிக்கவில்லை · ராமன், அகர்வால் தரும் திங்கள் / புதன் / சனிக்கு மாறாக இவர் வியாழன், வெள்ளி',
  },
});
const BUY_HOUSE = deepFreeze({
  labelTa: 'வீடு வாங்குதல்',
  default: 'AGARWAL',
  order: ['AGARWAL', 'RAMAN', 'RANGACHARYA'],
  AGARWAL: {
    labelTa: 'அகர்வால் (ப.325)', booksTa: 'அகர்வால்',
    nak: { good: [4, 1, 0, 10, 15, 18, 6, 26], mid: [] }, digdwar: false,
    tithi: [1, 5, 11, 16, 20, 26],
    vara: { good: [4, 5], mid: [] },
    lagna: { good: [1, 2, 4, 6, 7], mid: [] },
    notIn: [[['Mars'], [1]], [['Sun', 'Mars', 'Saturn', 'Rahu', 'Ketu'], [7]]],
    want: [{ planets: ['Mars'], houses: [11], code: 'MARS_11_MID' }],
    noteTa: '"நந்தா, அதாவது 1, 5, 11" என்று அச்சில் — வழக்கமான நந்தா 1, 6, 11; அச்சில் உள்ளபடியே வைக்கிறோம் (இரு பக்ஷமும் — எங்கள் வாசிப்பு) · இறுதிப் பேரத்தின்போது ஸ்திர ராசி உதயமாக வேண்டும், செவ்வாய் 11-இல் — குறிக்கப்படுகிறது · லக்னாதிபதி–7-ஆம் அதிபதி பொருத்தம், 11-ஆம் அதிபதி 12-இல் — கணிக்கப்படவில்லை',
  },
  RAMAN: {
    labelTa: 'ராமன் அத்.XII', booksTa: 'ராமன்',
    nak: { good: [4, 8, 9, 10, 15, 18, 6, 26], mid: [] }, digdwar: false,
    tithi: [1, 6, 11, 16, 21, 26],
    vara: { good: [4, 5], mid: [] },
    lagna: { good: [1, 2, 4, 6, 7], mid: [] },
    notIn: [[['Mars'], [1]], [['Sun', 'Mars', 'Saturn', 'Rahu', 'Ketu'], [7]]],
    noteTa: 'நந்தா திதிகள் (1, 6, 11 — ராமனின் பிற்சேர்க்கையின்படி, இரு பக்ஷமும்) · ஸ்ரீதர் / ஜோஷியின் நிலப் பட்டியலையே ஒத்தது (ஆயில்யம், மகம் உட்பட) · 7-இல் பாபன் கூடாது; செவ்வாய் லக்னத்தில் கூடாது',
  },
  RANGACHARYA: {
    labelTa: 'ரங்காச்சார்யா (ப.129)', booksTa: 'ரங்காச்சார்யா',
    nak: { good: [18, 4, 10, 16, 6], mid: [] }, digdwar: false,
    tithi: [1, 6, 11, 16, 21, 26],
    vara: { good: [4, 5], mid: [] },
    beneficIn: [2, 4, 5, 7, 9, 10],
    maleficIn: [3, 10, 11],
    noteTa: 'வீட்டுக்கும் நிலத்துக்கும் ஒரே விதி (நிலம் வாங்குதல் காரியத்திலும் இதே வாசிப்பு) · நந்தா திதி · சுபர், பாபர் இடங்கள் குறிக்கப்படுகின்றன',
  },
});
const LAND_POSSESSION = deepFreeze({
  labelTa: 'நிலத்தை ஆட்கொள்ளுதல் (ஒரு பிடி மண்)',
  default: 'SHRIDHAR',
  order: ['SHRIDHAR', 'RAMAN', 'WILHELM'],
  SHRIDHAR: {
    labelTa: 'ஸ்ரீதர் §25.3.4 (K.P.)', booksTa: 'ஸ்ரீதர் (K.P. மேற்கோள்)',
    nak: { good: [0, 3, 4, 6, 7, 11, 12, 14, 16, 20, 21, 22, 23, 25], mid: [] }, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 21, 22, 23, 25, 26, 27, 28, 30],
    vishti: true,
    want: [{ planets: ['Sun', 'Ketu'], houses: [1], code: 'SUN_KETU_LAGNA_MID' }],
    noteTa: 'K.P.யின் பதினான்கு நட்சத்திரங்கள் (கட்டிட நிலம் வாங்கும் அதே பட்டியல்) · ரிக்தா திதி, விஷ்டி கரணம் தள்ளு · சூரியனும் கேதுவும் லக்னத்தில் — குறிக்கப்படுகிறது (நவாம்சம் கணிக்கப்படவில்லை) · ஒரு பிடி மண் விதி (கடக லக்னம் + பரணி / திருவாதிரை / விசாகம் / அஸ்தத்தின் 4-ஆம் பாதம்) வில்ஹெல்ம், ராமன் வாசிப்புகளில் கணிக்கப்படுகிறது',
  },
  RAMAN: {
    labelTa: 'ராமன் அத்.XII, XIII', booksTa: 'ராமன்',
    nak: { good: [1, 5, 15], mid: [] }, digdwar: false,
    lagna: { good: [3], mid: [] },
    want: [{ planets: ['Sun', 'Ketu'], houses: [1], code: 'SUN_KETU_LAGNA_MID' }],
    padaOnly: [4],
    noteTa: 'ஸ்ரீதர், வில்ஹெல்ம் தரும் நான்கில் அஸ்தம் ராமனிடம் இல்லை · "கடைசிப் பாதம்" = நான்காம் பாதம் · கடக லக்னம் · சூரியனும் கேதுவும் லக்னத்தில் / நவாம்சத்தில் — குறிக்கப்படுகிறது (லக்னம் மட்டும்) · திதி, கிழமை சொல்லப்படவில்லை',
  },
  WILHELM: {
    labelTa: 'வில்ஹெல்ம் — தகராறு நிலம்', booksTa: 'வில்ஹெல்ம்',
    nak: { good: [1, 5, 15, 12], mid: [] }, digdwar: false,
    lagna: { good: [3], mid: [] },
    padaOnly: [4],
    noteTa: 'ஸ்ரீதரின் அதே நான்கு நட்சத்திரங்கள் (அஸ்தம் உட்பட), நான்காம் பாதம், கடக லக்னம் · "மற்ற முகூர்த்தக் கூறுகளும் சாதகமாக இருக்கட்டும்" — பக்கத்தின் பொதுச் சோதனைகள் · திதி, கிழமை சொல்லப்படவில்லை',
  },
});
const DIVIDE_PROPERTY = deepFreeze({
  labelTa: 'சொத்துப் பிரிவினை',
  default: 'KALYANRAMAN',
  order: ['KALYANRAMAN', 'JOSHI', 'SHRIDHAR', 'WILHELM'],
  KALYANRAMAN: {
    labelTa: 'கல்யாணராமன் (தொ.2 ப.243)', booksTa: 'கல்யாணராமன்',
    nak: { good: [0, 3, 4, 6, 7, 11, 12, 13, 14, 20, 21, 22, 23, 25, 26], mid: [] }, abhijitOk: true, digdwar: false,
    tithi: [2, 3, 5, 7, 10, 11, 13, 17, 18, 20, 22, 25, 26, 28],
    vara: { good: [0, 1, 3, 4, 5], mid: [] },
    lagna: { good: [1, 2, 5, 6, 8, 11], mid: [] },
    noteTa: 'லகு (4, அபிஜித் உட்பட), ஸ்திர (4), சர (5) + மிருகசீரிடம், சித்திரை, ரேவதி = 15 + அபிஜித் · திதி இரு பக்ஷமும் (எங்கள் வாசிப்பு) · சுப கிரக ராசி லக்னம், லக்ன சுத்தி',
  },
  JOSHI: {
    labelTa: 'ஜோஷி (ப.149)', booksTa: 'ஜோஷி',
    nak: { good: [0, 3, 4, 6, 7, 11, 12, 13, 14, 20, 21, 22, 23, 25, 26], mid: [] }, digdwar: false,
    tithi: [2, 3, 5, 7, 10, 11, 13, 17, 18, 20, 22, 25, 26, 28],
    vara: { good: [0, 1, 3, 4, 5], mid: [] },
    lagna: { good: [1, 2, 5, 6, 8, 11], mid: [] },
    noteTa: 'கல்யாணராமனின் அதே பதினைந்து (ஜோஷி அபிஜித்தைச் சேர்க்கவில்லை) · திதி, கிழமை ஒன்றே · சுப கிரக ராசி லக்னம், லக்ன சுத்தி',
  },
  SHRIDHAR: {
    labelTa: 'ஸ்ரீதர் §20.18', booksTa: 'ஸ்ரீதர்',
    nak: { good: [0, 3, 4, 6, 7, 11, 12, 13, 14, 21, 22, 25, 26, 20], mid: [] }, digdwar: false,
    tithi: [2, 3, 5, 7, 10, 11, 13, 15, 17, 18, 20, 22, 25, 26, 28, 30],
    vara: { good: [0, 1, 3, 4, 5], mid: [] },
    lagna: { good: [1, 2, 5, 6, 8, 11], mid: [] },
    beneficKendra: true,
    noteTa: 'அச்சில் "2,3,5,7,19,11,13,15" — 19 என்பது பத்தின் அச்சுப்பிழை (மற்ற மூன்று நூல்களும் 10 தருகின்றன); 10 என்று வாசிக்கிறோம் · பௌர்ணமியும் அமாவாசையும் "இரு பக்ஷத்திலும் 15" என்பதால் சேர்க்கப்படுகின்றன (மற்ற நூல்கள் 13-உடன் நிறுத்துகின்றன) · சதயம் இவரது பட்டியலில் இல்லை · கேந்திரத்தில் சுபர் — குறிக்கப்படுகிறது',
  },
  WILHELM: {
    labelTa: 'வில்ஹெல்ம் — சொத்துப் பிரிவினை', booksTa: 'வில்ஹெல்ம்',
    nak: { good: [0, 3, 4, 6, 7, 11, 12, 13, 14, 20, 21, 22, 23, 25, 26], mid: [] }, digdwar: false,
    tithi: [2, 3, 5, 7, 10, 11, 13, 17, 18, 20, 22, 25, 26, 28],
    vara: { good: [0, 1, 3, 4, 5], mid: [] },
    noteTa: 'கல்யாணராமன், ஜோஷியின் அதே பதினைந்து நட்சத்திரம், அதே திதி, அதே கிழமை — மூன்று நூல்களும் ஒரே மரபு · லக்னம் சொல்லப்படவில்லை',
  },
});
// ---------------------------------------------------------------------------
// House building, part 1 (starting construction, digging, the foundation), added 2026-10-19
// ---------------------------------------------------------------------------
const CONSTRUCTION_START = deepFreeze({
  labelTa: 'வீடு கட்டத் தொடங்குதல் (கிருஹாரம்பம்)',
  default: 'SHRIDHAR',
  order: ['SHRIDHAR', 'WILHELM', 'RAMAN', 'VASHISTHA', 'JOSHI', 'RANGACHARYA', 'MUHURTA_CHINTAMANI', 'KALYANRAMAN'],
  SHRIDHAR: {
    labelTa: 'ஸ்ரீதர் §27.2', booksTa: 'ஸ்ரீதர் (பராசரர், கர்க்கர், வாஸ்துப்ரதீபம், வாஸ்துராஜவல்லபம், M.C., B.S., K.P., நாரதர், வசிஷ்டர் மேற்கோள்கள்)',
    masa: { good: [1, 4, 8, 9, 11], mid: [7, 10], strict: true },
    uttarayana: 'PREFERRED',
    nak: { good: [3, 11, 20, 25, 4, 13, 16, 26, 23, 14, 22, 12, 7], mid: [12, 6, 21, 0, 18] }, digdwar: false,
    tithi: [2, 3, 5, 7, 10, 11, 12, 13, 15], tithiNot: [1, 4, 8, 9, 14, 16, 19, 23, 24, 29, 30],
    vara: { good: [3, 4, 5, 6], mid: [1] },
    yogaNot: [14, 12, 8, 16, 5, 9, 0, 18],
    karanaOnly: [1, 2],
    starCount: [{ from: 'Sun', of: 27, good: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], code: 'VASTU_CHAKRA' }],
    lagna: { good: [1, 2, 5, 7, 8, 10, 11], mid: [4] },
    notIn: [[['Sun', 'Mars', 'Saturn', 'Rahu', 'Ketu'], [7]]],
    dayParts: { good: [1, 2, 3, 4], mid: [] },
    sunSign: { good: [0, 3, 6, 7, 9, 10], mid: [1, 4] },
    noteTa: 'நட்சத்திரம்: பராசரர், கர்க்கர், வாஸ்துப்ரதீபம், மு.சி. தரும் பதின்மூன்று நல்லவை; B.S. சேர்க்கும் அஸ்தம், புனர்பூசம், திருவோணம், அசுவினி, பராசரர் சேர்க்கும் மூலம் — நடுத்தரம் (எங்கள் வாசிப்பு). K.P. அசுவினி, அஸ்தம், சித்திரை, தனிஷ்டா, சதயம் "நடுத்தரம்" என்பதால் அவற்றில் நல்ல பட்டியலில் உள்ளவை அப்படியே வைக்கப்படுகின்றன · திதி: வளர்பிறை 2, 3, 5, 7, 10, 11, 12, 13, பௌர்ணமி நல்லவை; 1, 4, 8, 9, 14, அமாவாசை (இரு பக்ஷமும்) தள்ளு; M.G. ஆறாம் திதியையும் தள்ளுகிறார், J.V. இரு பக்ஷமும் ஏற்கிறார் — எனவே தேய்பிறையும் வளர்பிறை ஆறும் நடுத்தரம் · கிழமை: ஞாயிறு, செவ்வாய் தள்ளு; திங்கள் "சந்திரன் சாதகமானால்" (B.S.) — நடுத்தரம் · இரவு தள்ளு · கரணம்: பவ, தைதுல, கரஜ, வணிஜ, சகுனி, கிம்ஸ்துக்னம் தள்ளு — பாலவ, கௌலவ மட்டும் எஞ்சுகின்றன (அச்சில் உள்ளபடியே; வசிஷ்டாவும் அதே பட்டியல்) · லக்னம்: ஸ்திர + த்விஸ்வபாவம்; வாஸ்துப்ரதீபம் சிம்மத்தையும் தள்ளுவதால் சிம்மம் நடுத்தரம் · மாதம்: எல்லாரும் ஒப்பும் திருவோணம், பங்குனி; வாஸ்துராஜவல்லபம் வைகாசி, மார்கழி, தையையும் சேர்க்கிறது; கார்த்திகை, மாசி முரண் — நடுத்தரம் · சூரிய ராசி: மிதுனம், கன்னி, தனுசு, மீனம் தள்ளு (நாரதர்); ரிஷபம், சிம்மம் நடுத்தரம் · சித்ர, கலக்ரக திதிகள், க்ருஹ நாடி, ஆயா — கணிக்கப்படவில்லை',
  },
  WILHELM: {
    labelTa: 'வில்ஹெல்ம் — கட்டுமானத் தொடக்கம் (அடிக்கல்)', booksTa: 'வில்ஹெல்ம்',
    masa: { good: [11, 4, 8, 9, 1], mid: [0, 2, 3, 5, 6, 7, 10], strict: false },
    nak: { good: [3, 4, 7, 11, 13, 14, 16, 18, 20, 21, 25, 26], mid: [0, 6, 12, 22, 23] }, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 10, 11, 13, 15, 16, 17, 18, 20, 21, 22, 25, 26, 28],
    vara: { good: [1, 3, 4, 5, 6], mid: [] },
    lagna: { good: [1, 4, 7, 10], mid: [2, 5, 8, 11] },
    empty: [8],
    emptyPref: [12],
    jupVenNotSet: true,
    sunSign: { good: [0, 1, 3, 4, 6, 7, 9, 10], mid: [] },
    noteTa: '"அடிக்கல் நாட்டும் நேரமே கட்டுமானத்தின் மிக முக்கிய நேரம்" — தொடக்கமும் அடிக்கலும் ஒரே பகுதி (அடிக்கல் காரியத்திலும் இதே வாசிப்பு) · திதி: 2, 6, 10 மற்றும் 9 தவிர எல்லா ஒற்றைத் திதிகளும் (இரு பக்ஷமும் — எங்கள் வாசிப்பு) · 8-இல் எந்தக் கிரகமும் கூடாது; 12 காலியாக இருப்பது விருப்பம் · குரு, சுக்கிரன் அஸ்தமனம் தள்ளு · கதவின் திசைக்கேற்ற மாதம் / திதி / நட்சத்திரம், சூரியன் விட்டகன்ற ராசி, மனைவி கர்ப்பமாக இருத்தல் — கணிக்கப்படவில்லை',
  },
  RAMAN: {
    labelTa: 'ராமன் அத்.XII — அடிக்கல்', booksTa: 'ராமன்',
    masa: { good: [0, 1, 4, 7, 10], mid: [6], strict: true },
    nak: { good: [3, 4, 13, 12, 17, 11, 20, 21], mid: [14, 7, 16, 0, 23, 25, 26] }, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 10, 11, 13, 15, 16, 17, 18, 20, 21, 22, 25, 26, 28],
    krishnaMid: true,
    vara: { good: [1, 3, 4, 5], mid: [0] },
    lagna: { good: [1, 4, 7, 10], mid: [2, 5, 8, 11] },
    empty: [8],
    maleficIn: [3, 6, 11],
    beneficKendra: true,
    sunSign: { good: [1, 4, 7, 10], mid: [0, 3, 6, 9] },
    noteTa: 'தள்ளப்பட்ட மாதங்கள் ஏழு (ஆனி, ஆடி, ஆவணி, புரட்டாசி, மார்கழி, தை, பங்குனி); ஆனால் "புரட்டாசி"யும் (Aswayuja) தள்ளப்பட்டதில் உள்ளது, நல்ல ஐந்தில் இல்லை — நடுத்தரமாக வைத்துள்ளோம் (எங்கள் வாசிப்பு) · சூரியன் ஸ்திர ராசியில் சிறந்தது, சர ராசி பரவாயில்லை, த்விஸ்வபாவத்தில் கூடாது · திதி: 9 தவிர ஒற்றைகள் + 2, 6, 10 · "சந்திரன் தேய்பிறையில் இருந்தால் திங்களும் தள்ளு" — தேய்பிறை நடுத்தரம் · சனி தள்ளு (திருட்டு பயம்), ஞாயிறு நடுத்தரம் · 8 காலி, பாபர் 3, 6, 11-இல், சுபர் கேந்திர / திரிகோணத்தில் · வீட்டின் ஆயுளைச் சொல்லும் ஆறு கிரக சேர்க்கைகள் — கணிக்கப்படவில்லை',
  },
  VASHISTHA: {
    labelTa: 'வசிஷ்டா அத்.10', booksTa: 'வசிஷ்டா',
    masa: { good: [2, 3, 5, 6, 7, 9, 10], mid: [0, 1, 4, 8, 11], strict: false },
    nak: { good: [3, 4, 6, 7, 11, 20, 25, 12, 13, 14, 16, 21, 22, 23, 26], mid: [] }, digdwar: false,
    tithi: [2, 3, 5, 6, 7, 10, 11, 12, 13],
    vara: { good: [1, 3, 4, 5, 6], mid: [] },
    yogaNot: [14, 12, 8, 16, 5, 9, 0, 18, 26],
    karanaOnly: [1, 2],
    lagna: { good: [1, 2, 4, 5, 8, 11], mid: [] },
    maleficIn: [3, 6, 11],
    notIn: [[['Moon'], [1, 6, 8, 12]]],
    jupVenNotSet: true,
    sunSign: { good: [0], mid: [1, 2, 3, 4, 6, 7, 9, 10, 11] },
    noteTa: 'வளர்பிறை மட்டும் (தேய்பிறை தள்ளு) · ரிக்தா தள்ளு · பஞ்சகத்தில் தொடங்கக் கூடாது; பூரட்டாதி தள்ளு (நட்சத்திரப் பட்டியலில் இல்லை) · கரணம்: பவ, தைதுல, கரஜ, வணிஜ, சகுனி, கிம்ஸ்துக்னம் நீக்கி பாலவ, கௌலவ மட்டும் (ஸ்ரீதரின் அதே பட்டியல்) · லக்னம் 2, 3, 5, 6, 9, 12 — சுபர் இருக்க / பார்க்க வேண்டும்; விருச்சிகம், கும்பம் தள்ளு · சனி + ரேவதி, செவ்வாய் அஸ்தம் / பூசத்தில், பூமி சயனம் செவ்வாயில், அக்னி பாணம், அக்னி பஞ்சகம், 21 தோஷங்கள் — கணிக்கப்படவில்லை',
  },
  JOSHI: {
    labelTa: 'ஜோஷி (ப.116-118)', booksTa: 'ஜோஷி (மு.சி., காளிதாசர் மேற்கோள்கள்)',
    masa: { good: [11, 4, 8, 9, 1], mid: [0, 2, 3, 5, 6, 7, 10], strict: false },
    nak: { good: [3, 11, 20, 25, 4, 13, 16, 26, 23, 14, 22, 12, 7], mid: [] }, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 10, 11, 12, 13, 15, 16, 17, 18, 20, 21, 22, 25, 26, 27, 28],
    vara: { good: [0, 1, 3, 4, 5, 6], mid: [] },
    yogaNot: [14, 12, 8, 16, 5, 9, 0, 18, 26],
    vishti: true,
    starCount: [{ from: 'Sun', of: 27, good: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], code: 'VASTU_CHAKRA' }],
    lagna: { good: [1, 4, 7, 10, 2, 5, 8, 11], mid: [] },
    maleficIn: [3, 6, 11],
    sunSign: { good: [0, 1, 3, 4, 6, 7, 9, 10], mid: [] },
    noteTa: 'ஸ்ரீதர், மு.சி., கல்யாணராமனின் அதே பதின்மூன்று நட்சத்திரங்கள் · ரிக்தா, அமாவாசை, அஷ்டமி தள்ளு; மீதி எல்லாத் திதிகளும் நல்லவை · செவ்வாய் மட்டும் தள்ளு; ஞாயிறும் சனியும் நல்லவை என்று இவர் ஏற்கிறார் (ஸ்ரீதர், மு.சி. ஞாயிற்றைத் தள்ளுகின்றனர்) · சர லக்னம் தள்ளு · "சுப யோகம்" — பட்டியலில் இல்லாத ஒன்பது தீய யோகங்கள் தள்ளு (எங்கள் வாசிப்பு) · சப்தசலாக வேதை, கதவின் திசை விதிகள் — கணிக்கப்படவில்லை',
  },
  RANGACHARYA: {
    labelTa: 'ரங்காச்சார்யா அத்.VI', booksTa: 'ரங்காச்சார்யா',
    masa: { good: [1, 4, 7, 8, 10, 11], mid: [0, 2, 3, 5, 6, 9], strict: false },
    nak: { good: [0, 13, 16, 26, 21, 4, 14, 23, 12, 7, 22, 11, 20, 25, 3, 6], mid: [] }, digdwar: false,
    tithi: [2, 3, 5, 6, 7, 10, 11, 12, 13, 15],
    krishnaMid: true,
    vara: { good: [3, 4, 5], mid: [1, 6] },
    lagna: { good: [1, 2, 5, 8, 11], mid: [4, 7] },
    beneficIn: [1, 2, 3, 4, 5, 7, 9, 10, 11],
    maleficIn: [3, 6, 11],
    sunSign: { good: [0, 1, 3, 4, 6, 7, 9, 10], mid: [] },
    noteTa: 'திதி வளர்பிறை; "தேய்பிறை பத்தாம் திதி வரை நடுத்தரம்" — தேய்பிறை முழுவதும் நடுத்தரமாக வைத்துள்ளோம் (எங்கள் வாசிப்பு) · கிழமை: புதன், வியாழன், வெள்ளி நல்லவை; சனி நடுத்தரம்; திங்கள் "சந்திரன் வளர்பிறையில் இருந்தால்" — நடுத்தரம்; ஞாயிறு, செவ்வாய் தள்ளு · லக்னம்: மிதுனம், கன்னி, தனுசு, மீனம், ரிஷபம் நல்லவை; விருச்சிகம், சிம்மம் நடுத்தரம்; சர லக்னம் தள்ளு · விம்சோபக மதிப்பீட்டு அட்டவணை — கணிக்கப்படவில்லை',
  },
  MUHURTA_CHINTAMANI: {
    labelTa: 'மு.சி. ஸ்லோ.15, 18', booksTa: 'முகூர்த்த சிந்தாமணி',
    nak: { good: [3, 11, 20, 25, 4, 13, 16, 26, 23, 14, 22, 12, 7], mid: [] }, digdwar: false,
    tithi: [2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 17, 18, 20, 21, 22, 23, 25, 26, 27, 28],
    vara: { good: [1, 3, 4, 5, 6], mid: [] },
    lagna: { good: [1, 4, 7, 10, 2, 5, 8, 11], mid: [] },
    maleficIn: [3, 6, 11],
    noteTa: 'பதின்மூன்று நட்சத்திரங்கள் (மற்ற நூல்களின் அதே பட்டியல்) · "ரிக்தா, அமாவாசை, பிரதமை தவிர மற்ற எல்லாத் திதிகளும்" — பிரதமை இரு பக்ஷமும் தள்ளப்படுகிறது · ஞாயிறு, செவ்வாய் தள்ளு · சர லக்னம் தள்ளு · பஞ்சக நட்சத்திரங்கள் பற்றிய முரண் (ஸ்லோ.13 தனிஷ்டா, சதயம், உத்திரட்டாதி, ரேவதியை நல்லவை என்கிறது; மாண்டவ்யரின்படி பஞ்சகத் தள்ளுதல் மரக் கதவு நிலைக்கு மட்டும்) — குறிப்பு மட்டும் · கதவின் திசைக்கேற்ற திதி விதிகள் — கணிக்கப்படவில்லை',
  },
  KALYANRAMAN: {
    labelTa: 'கல்யாணராமன் (தொ.2 ப.192)', booksTa: 'கல்யாணராமன் (மு.சி. மேற்கோள்)',
    masa: { good: [11, 4, 8, 9, 1], mid: [0, 2, 3, 5, 6, 7, 10], strict: false },
    nak: { good: [3, 11, 20, 25, 4, 13, 16, 26, 23, 14, 22, 12, 7], mid: [] }, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 10, 11, 12, 13, 15, 16, 17, 18, 20, 21, 22, 25, 26, 27, 28],
    vara: { good: [0, 1, 3, 4, 5, 6], mid: [] },
    yogaNot: [14, 12, 8, 16, 5, 9, 0, 18, 26],
    vishti: true,
    starCount: [{ from: 'Sun', of: 27, good: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], code: 'VASTU_CHAKRA' }],
    sunSign: { good: [0, 1, 3, 4, 6, 7, 9, 10], mid: [] },
    noteTa: 'பதின்மூன்று நட்சத்திரங்கள் — ஸ்ரீதர், மு.சி., ஜோஷியின் அதே பட்டியல் · திதி அச்சில் உள்ளபடி (ரிக்தா, அமாவாசை, அஷ்டமி நீங்கலாக — இரு பக்ஷமும்) · செவ்வாய் தள்ளு · வாஸ்து சக்கரம் 8-18 · பத்ரை (விஷ்டி), தீய யோகங்கள் தள்ளு · லக்னம் சொல்லப்படவில்லை',
  },
});
const DIGGING = deepFreeze({
  labelTa: 'அடித்தளம் தோண்டத் தொடங்குதல்',
  default: 'SHRIDHAR',
  order: ['SHRIDHAR', 'KALYANRAMAN', 'JOSHI', 'WILHELM'],
  SHRIDHAR: {
    labelTa: 'ஸ்ரீதர் §27.9', booksTa: 'ஸ்ரீதர் (சில்பசாஸ்திரம், வாஸ்துபூஷணம், நாரதீயம், M.M. மேற்கோள்கள்)',
    nak: { good: [18, 8, 15, 2, 9, 10, 19, 24, 3, 11, 20, 25, 4, 13, 16, 26], mid: [] }, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 21, 22, 23, 25, 26, 27, 28], tithiMid: [1, 4, 12, 16, 21],
    yogaNot: [14, 12, 8, 16, 5, 9, 0, 18, 26],
    starCount: [{ from: 'Sun', of: 27, good: [1, 2, 3, 4, 6, 8, 10, 11, 13, 14, 15, 16, 17, 18, 20, 21, 22, 23, 24, 25, 27], code: 'BHU_SHAYANA' }],
    lagna: { good: [0, 3, 6, 9], mid: [] },
    noteTa: 'கீழ்நோக்கு நட்சத்திரங்களில் ஸ்ரீதர் பரணியைச் சேர்க்கவில்லை (கல்யாணராமன், ஜோஷி சேர்க்கின்றனர்) · "சுப திதிகள்" — ரிக்தா, அமாவாசை தள்ளு (எங்கள் வாசிப்பு); வாஸ்துபூஷணத்தின் பூமி சயனத் திதிகள் (1, 4, 12, 16, 21) நடுத்தரம் · தேர்ந்த நட்சத்திரத்தில் செவ்வாய் இருக்கக் கூடாது; ராகு முகம், திசை, இடம், சகுனம் — கணிக்கப்படவில்லை',
  },
  KALYANRAMAN: {
    labelTa: 'கல்யாணராமன் (தொ.2 ப.190)', booksTa: 'கல்யாணராமன்',
    nak: { good: [1, 2, 3, 4, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 19, 20, 22, 23, 24, 25, 26], mid: [] }, digdwar: false,
    tithi: [2, 3, 5, 7, 10, 11, 13, 17, 18, 20, 22, 25, 26, 28],
    vara: { good: [0, 1, 3, 4, 5, 6], mid: [] },
    starCount: [{ from: 'Sun', of: 27, good: [1, 2, 3, 4, 6, 8, 10, 11, 13, 14, 15, 16, 17, 18, 20, 21, 22, 23, 24, 25, 27], code: 'BHU_SHAYANA' }],
    lagna: { good: [0, 3, 6, 9], mid: [] },
    noteTa: 'இருபத்திரண்டு நட்சத்திரங்கள் = கீழ்நோக்கு ஒன்பது + கட்டுமானத்துக்கு உரிய பதின்மூன்று (ஜோஷியின் அதே பட்டியல்) · திதி இரு பக்ஷமும் (எங்கள் வாசிப்பு) · செவ்வாய் தள்ளு · சர லக்னம் · ராகு முகத் திசை, தேர்ந்த நட்சத்திரத்தில் செவ்வாய் / சனி, சங்கராந்தியிலிருந்து எண்ணும் பூமி சயனம் — கணிக்கப்படவில்லை',
  },
  JOSHI: {
    labelTa: 'ஜோஷி (ப.114-115)', booksTa: 'ஜோஷி',
    nak: { good: [1, 2, 3, 4, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 19, 20, 22, 23, 24, 25, 26], mid: [] }, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 10, 11, 12, 13, 15, 16, 17, 18, 20, 21, 22, 25, 26, 27, 28],
    yogaNot: [14, 12, 8, 16, 5, 9, 0, 18, 26],
    starCount: [{ from: 'Sun', of: 27, good: [1, 2, 3, 4, 6, 8, 10, 11, 13, 14, 15, 16, 17, 18, 20, 21, 22, 23, 24, 25, 27], code: 'BHU_SHAYANA' }],
    lagna: { good: [0, 3, 6, 9], mid: [] },
    noteTa: 'கல்யாணராமனின் அதே இருபத்திரண்டு · "சுப திதிகள், சுப யோகங்கள்" — அவரது கட்டுமானப் பகுதியின் அதே வாசிப்பு (ரிக்தா, அமாவாசை, அஷ்டமி தள்ளு; தீய ஒன்பது யோகங்கள் தள்ளு) · சர லக்னம் · கிழமை சொல்லப்படவில்லை · ராகு முகம், செவ்வாய் / சனி சேர்க்கை — கணிக்கப்படவில்லை',
  },
  WILHELM: {
    labelTa: 'வில்ஹெல்ம் — தோண்டுதல்', booksTa: 'வில்ஹெல்ம்',
    nak: { good: [2, 3, 4, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 19, 20, 21, 22, 23, 24, 25, 26], mid: [] }, digdwar: false,
    starCount: [{ from: 'Sun', of: 27, good: [1, 2, 3, 4, 6, 8, 10, 11, 13, 14, 15, 16, 17, 18, 20, 21, 22, 23, 24, 25, 27], code: 'BHU_SHAYANA' }],
    lagna: { good: [0, 3, 6, 9], mid: [2, 5, 8, 11] },
    noteTa: 'இருபத்திரண்டு நட்சத்திரங்கள் — கல்யாணராமன், ஜோஷியின் பட்டியலோடு கிட்டத்தட்ட ஒன்றே (இவரிடம் பரணி இல்லை, திருவோணம் உண்டு) · "சர ராசி சிறந்தது, ஸ்திர ராசி தள்ளு" — த்விஸ்வபாவம் நடுத்தரம் (எங்கள் வாசிப்பு) · சங்கராந்தியிலிருந்து எண்ணும் பூமி சயனத்தை அவர் சூரியனின் பாகைகளாகத் தருகிறார் (4-5°, 6-7°, 8-9°, 9-10°, 20-21°, 23-24°) — கணிக்கப்படவில்லை · திதி, கிழமை சொல்லப்படவில்லை',
  },
});
const FOUNDATION = deepFreeze({
  labelTa: 'அடிக்கல் நாட்டுதல் (சிலாந்நியாசம்)',
  default: 'WILHELM',
  order: ['WILHELM', 'RAMAN', 'SHRIDHAR', 'AGARWAL', 'KALYANRAMAN', 'JOSHI', 'VASHISTHA'],
  WILHELM: {
    labelTa: 'வில்ஹெல்ம் — அடிக்கல் (கட்டுமானத் தொடக்கம்)', booksTa: 'வில்ஹெல்ம்',
    masa: { good: [11, 4, 8, 9, 1], mid: [0, 2, 3, 5, 6, 7, 10], strict: false },
    nak: { good: [3, 4, 7, 11, 13, 14, 16, 18, 20, 21, 25, 26], mid: [0, 6, 12, 22, 23] }, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 10, 11, 13, 15, 16, 17, 18, 20, 21, 22, 25, 26, 28],
    vara: { good: [1, 3, 4, 5, 6], mid: [] },
    lagna: { good: [1, 4, 7, 10], mid: [2, 5, 8, 11] },
    empty: [8],
    emptyPref: [12],
    jupVenNotSet: true,
    sunSign: { good: [0, 1, 3, 4, 6, 7, 9, 10], mid: [] },
    noteTa: 'வில்ஹெல்ம் அடிக்கலையும் கட்டுமானத் தொடக்கத்தையும் பிரிக்கவில்லை — "வீடு கட்டத் தொடங்குதல்" காரியத்திலும் இதே வாசிப்பு',
  },
  RAMAN: {
    labelTa: 'ராமன் அத்.XII — அடிக்கல்', booksTa: 'ராமன்',
    masa: { good: [0, 1, 4, 7, 10], mid: [6], strict: true },
    nak: { good: [3, 4, 13, 12, 17, 11, 20, 21], mid: [14, 7, 16, 0, 23, 25, 26] }, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 10, 11, 13, 15, 16, 17, 18, 20, 21, 22, 25, 26, 28],
    krishnaMid: true,
    vara: { good: [1, 3, 4, 5], mid: [0] },
    lagna: { good: [1, 4, 7, 10], mid: [2, 5, 8, 11] },
    empty: [8],
    maleficIn: [3, 6, 11],
    beneficKendra: true,
    sunSign: { good: [1, 4, 7, 10], mid: [0, 3, 6, 9] },
    noteTa: 'ராமனும் அடிக்கலையே தொடக்கமாகக் கொள்கிறார் — "வீடு கட்டத் தொடங்குதல்" காரியத்திலும் இதே வாசிப்பு · வராகமிஹிரர்: பூஜைக்குப் பின் முதல் கல் வடகிழக்கு மூலையில்',
  },
  SHRIDHAR: {
    labelTa: 'ஸ்ரீதர் §27.10', booksTa: 'ஸ்ரீதர் (சாரங்கதரர், பிரம்மசம்பு, காஶ்யபர், வராகமிஹிரர், M.M., உத்பலர், K.P. மேற்கோள்கள்)',
    nak: { good: [0, 3, 4, 7, 12, 21, 26, 11, 20, 25], mid: [] }, digdwar: false,
    tithi: [2, 3, 5, 7, 10, 11, 12, 13, 16],
    vara: { good: [1, 3, 4, 5, 6], mid: [] },
    lagna: { good: [1, 4, 7, 10], mid: [2, 5, 8, 11] },
    noteTa: 'திதி: தேய்பிறைப் பிரதமை + வளர்பிறை 2, 3, 5, 7, 10, 11, 12, 13 (வசிஷ்டா 10-ஐத் தவிர்த்து அதே பட்டியல்) · ஸ்திர ராசி சிறந்தது; சுபர் இருக்கும் த்விஸ்வபாவம் நடுத்தரம் · சூரியன் விட்டகன்ற ராசி லக்னமாக வருவது நல்லது, சூரியன் இருக்கும் ராசி கூடாது (K.P.) — கணிக்கப்படவில்லை · சித்த / அமிர்த யோகம், வாஸ்து புருஷனின் தொப்புள் இடம், பூஜை — கணிக்கப்படவில்லை',
  },
  AGARWAL: {
    labelTa: 'அகர்வால் (ப.325)', booksTa: 'அகர்வால்',
    masa: { good: [9, 10, 11, 1, 4], mid: [0, 2, 3, 5, 6, 7, 8], strict: false },
    nak: { good: [3, 4, 6, 12, 13, 14, 22, 16, 23, 26, 11, 20, 25], mid: [] }, digdwar: false,
    tithi: [2, 3, 5, 7, 10, 11, 13, 17, 18, 20],
    vara: { good: [1, 3, 4, 5], mid: [] },
    lagna: { good: [1, 2, 4, 5, 7, 8, 10], mid: [] },
    empty: [8, 12],
    beneficIn: [1, 4, 5, 7, 9, 10],
    maleficIn: [3, 6, 11],
    sunSign: { good: [0, 1, 3, 4, 6, 7, 9, 10], mid: [] },
    noteTa: '"வளர்பிறையை விரும்பு, தேய்பிறையில் ஐந்தாம் திதி வரை" — வளர்பிறை 2, 3, 5, 7, 10, 11, 13 + தேய்பிறை 2, 3, 5 (எங்கள் வாசிப்பு) · "திங்கள், ஆனால் சந்திரன் தேய்பிறையில் இருக்கும்போது அல்ல" — திங்கள் நல்லது, தேய்பிறைக் கட்டுப்பாடு மேலே திதியில் · லக்னப் பட்டியல் (2, 3, 5, 6, 8, 9, 11) "ஸ்திர ராசியாக இருக்க வேண்டும்" என்பதோடு முரண்படுகிறது — அச்சில் உள்ள பட்டியலையே எடுக்கிறோம் · பூரட்டாதி பஞ்சகம் என்பதால் தள்ளப்படுகிறது',
  },
  KALYANRAMAN: {
    labelTa: 'கல்யாணராமன் (தொ.2 ப.191)', booksTa: 'கல்யாணராமன் (கர்க்கர் மரபு)',
    nak: { good: [3, 11, 20, 25], mid: [4, 7, 12, 13, 14, 16, 22, 23, 26] }, digdwar: false,
    tithi: [2, 3, 5, 7, 10, 11, 13, 17, 18, 20, 22, 25, 26, 28], tithiMid: [1, 6, 8, 12, 15, 16, 21, 23, 27],
    vara: { good: [0, 1, 3, 4, 5, 6], mid: [] },
    lagna: { good: [1, 4, 7, 10], mid: [] },
    noteTa: 'ஸ்திர (த்ருவ) நட்சத்திரங்கள் நான்கே சிறந்தவை (கர்க்கரின் மரபு; ஜோஷியும் இதையே தருகிறார்); கட்டுமானத்துக்கு உரிய ஒன்பது நடுத்தரம் · திதி 1, 6, 8, 12, 15 "பரவாயில்லை" — நடுத்தரம் (அச்சில் உள்ளபடி) · செவ்வாய் தள்ளு · ஸ்திர ராசி லக்னம்',
  },
  JOSHI: {
    labelTa: 'ஜோஷி (ப.116)', booksTa: 'ஜோஷி (கர்க்கர் மேற்கோள்)',
    nak: { good: [3, 11, 20, 25], mid: [4, 26, 13, 16, 23, 14, 22, 12, 7] }, digdwar: false,
    tithi: [1, 2, 3, 5, 6, 7, 10, 11, 12, 13, 15, 16, 17, 18, 20, 21, 22, 25, 26, 27, 28],
    vara: { good: [0, 1, 3, 4, 5, 6], mid: [] },
    yogaNot: [14, 12, 8, 16, 5, 9, 0, 18, 26],
    lagna: { good: [1, 4, 7, 10], mid: [] },
    noteTa: 'கல்யாணராமனின் அதே வாசிப்பு (கர்க்கர்): ஸ்திர நான்கு சிறந்தவை, கட்டுமானத்தின் ஒன்பது நடுத்தரம் · "சுப திதி, சுப யோகம்" — அவரது கட்டுமானப் பகுதியின் அதே வாசிப்பு · செவ்வாய் தள்ளு · ஸ்திர ராசி லக்னம்',
  },
  VASHISTHA: {
    labelTa: 'வசிஷ்டா — சிலாந்நியாசம்', booksTa: 'வசிஷ்டா',
    nak: { good: [0, 3, 4, 7, 11, 20, 25, 12, 21, 26], mid: [] }, digdwar: false,
    tithi: [2, 3, 5, 7, 11, 12, 13, 16],
    vara: { good: [1, 3, 4, 5, 6], mid: [] },
    noteTa: 'ஸ்ரீதர் §27.10-இன் அதே பத்து நட்சத்திரம், அதே கிழமை; திதியில் வளர்பிறைப் பத்தாம் திதி மட்டும் இவரிடம் இல்லை · லக்னம் சொல்லப்படவில்லை',
  },
});

const RANK = deepFreeze({
  CONSTRUCTION_START: {
    order: CONSTRUCTION_START.order,
    words: { SHRIDHAR: 3626, WILHELM: 1672, RAMAN: 602, VASHISTHA: 545, JOSHI: 412, RANGACHARYA: 346, MUHURTA_CHINTAMANI: 328, KALYANRAMAN: 152 },
    measureTa: 'வீடு கட்டத் தொடங்குதல் பற்றிய சொற்கள்: ஸ்ரீதர் (§27.2, ப.704-715) 3626; வில்ஹெல்ம் (ப.217-223) 1672; ராமன் (அத்.XII, PDF ப.42-43) 602; வசிஷ்டா (அத்.10, ப.120-123) 545; ஜோஷி (ப.116-118) 412; ரங்காச்சார்யா (அத்.VI, ப.102-104) 346; முகூர்த்த சிந்தாமணி (ஸ்லோ.15, 18, ப.303, 305) 328; கல்யாணராமன் (தொ.2 ப.192) 152.',
  },
  DIGGING: {
    order: DIGGING.order,
    words: { SHRIDHAR: 733, KALYANRAMAN: 498, JOSHI: 315, WILHELM: 134 },
    measureTa: 'தோண்டுதல் பற்றிய சொற்கள்: ஸ்ரீதர் (§27.9, ப.724-726) 733; கல்யாணராமன் (தொ.2 ப.190) 498; ஜோஷி (ப.114-115) 315; வில்ஹெல்ம் (ப.223) 134.',
  },
  FOUNDATION: {
    order: FOUNDATION.order,
    words: { WILHELM: 1672, RAMAN: 602, SHRIDHAR: 392, AGARWAL: 119, KALYANRAMAN: 118, JOSHI: 113, VASHISTHA: 36 },
    measureTa: 'அடிக்கல் பற்றிய சொற்கள்: வில்ஹெல்ம் (ப.217-223) 1672; ராமன் (அத்.XII, PDF ப.42-43) 602; ஸ்ரீதர் (§27.10, ப.726-727) 392; அகர்வால் (ப.325) 119; கல்யாணராமன் (தொ.2 ப.191) 118; ஜோஷி (ப.116) 113; வசிஷ்டா (ப.123) 36.',
  },
  BUY_LAND: {
    order: BUY_LAND.order,
    words: { RAMAN: 133, WILHELM: 104, SHRIDHAR: 69, JOSHI: 46, RANGACHARYA: 46, VASHISTHA: 44, AGARWAL: 28 },
    measureTa: 'நிலம் வாங்குதல் பற்றிய சொற்கள்: ராமன் (அத்.XII, PDF ப.45) 133; வில்ஹெல்ம் (ப.287) 104; ஸ்ரீதர் (§25.3.4 ப.684 + §27.17.1 ப.738) 69; ஜோஷி (ப.102) 46; ரங்காச்சார்யா (ப.129) 46; வசிஷ்டா (ப.119) 44; அகர்வால் (ப.325) 28.',
  },
  BUY_FARMLAND: {
    order: BUY_FARMLAND.order,
    words: { RAMAN: 46, AGARWAL: 39, SHRIDHAR: 35 },
    measureTa: 'விவசாய நிலம் பற்றிய சொற்கள்: ராமன் (அத்.XIII, PDF ப.47) 46; அகர்வால் (ப.325) 39; ஸ்ரீதர் (§21.17, ப.599) 35.',
  },
  BUY_HOUSE: {
    order: BUY_HOUSE.order,
    words: { AGARWAL: 78, RAMAN: 68, RANGACHARYA: 46 },
    measureTa: 'வீடு வாங்குதல் பற்றிய சொற்கள்: அகர்வால் (ப.325) 78; ராமன் (அத்.XII, PDF ப.45) 68; ரங்காச்சார்யா (ப.129) 46.',
  },
  LAND_POSSESSION: {
    order: LAND_POSSESSION.order,
    words: { SHRIDHAR: 90, RAMAN: 90, WILHELM: 61 },
    measureTa: 'நிலம் ஆட்கொள்ளுதல் பற்றிய சொற்கள்: ஸ்ரீதர் (§25.3.4 K.P., ப.684) 90; ராமன் (அத்.XII + XIII, PDF ப.45, 47) 90; வில்ஹெல்ம் (ப.250) 61.',
  },
  DIVIDE_PROPERTY: {
    order: DIVIDE_PROPERTY.order,
    words: { KALYANRAMAN: 97, JOSHI: 76, SHRIDHAR: 43, WILHELM: 36 },
    measureTa: 'சொத்துப் பிரிவினை பற்றிய சொற்கள்: கல்யாணராமன் (தொ.2 ப.243) 97; ஜோஷி (ப.149) 76; ஸ்ரீதர் (§20.18, ப.583) 43; வில்ஹெல்ம் (ப.287) 36.',
  },
  LEND_MONEY: {
    order: LEND_MONEY.order,
    words: { KALYANRAMAN: 481, MUHURTA_CHINTAMANI: 260, RANGACHARYA: 171, WILHELM: 142, SHRIDHAR: 136, JOSHI: 128, RAMAN: 106, VASHISTHA: 66, AGARWAL: 29 },
    measureTa: 'கடன் கொடுத்தல் பற்றிய சொற்கள்: கல்யாணராமன் (தொ.2 ப.217, 218 — பணப் பரிவர்த்தனை + வணிகம் / கடன்) 481; முகூர்த்த சிந்தாமணி (ஸ்லோ.2/27 + 2/24, ப.64, 62) 260; ரங்காச்சார்யா (ப.129, கடன் 12 குறிப்புகள்) 171; வில்ஹெல்ம் (ப.191) 142; ஸ்ரீதர் (§25.2.1, ப.682) 136; ஜோஷி (ப.103) 128; ராமன் (அத்.X, PDF ப.38 — கடன் கொடுத்தல் + அடகு) 106; வசிஷ்டா (ப.135) 66; அகர்வால் (ப.328) 29.',
  },
  BORROW_MONEY: {
    order: BORROW_MONEY.order,
    words: { KALYANRAMAN: 305, MUHURTA_CHINTAMANI: 193, RANGACHARYA: 171, JOSHI: 128, WILHELM: 113, RAMAN: 105, SHRIDHAR: 82, VASHISTHA: 58 },
    measureTa: 'கடன் வாங்குதல் பற்றிய சொற்கள்: கல்யாணராமன் (தொ.2 ப.217, 218) 305; முகூர்த்த சிந்தாமணி (ஸ்லோ.2/27) 193; ரங்காச்சார்யா (ப.129) 171; ஜோஷி (ப.103) 128; வில்ஹெல்ம் (ப.190-191) 113; ராமன் (அத்.X, PDF ப.38) 105; ஸ்ரீதர் (§25.2.2, ப.682) 82; வசிஷ்டா (ப.136) 58.',
  },
  REPAY_DEBT: {
    order: REPAY_DEBT.order,
    words: { WILHELM: 340, KALYANRAMAN: 70, JOSHI: 16, SHRIDHAR: 10, RANGACHARYA: 8 },
    measureTa: 'கடன் திருப்பிச் செலுத்துதல் பற்றிய சொற்கள்: வில்ஹெல்ம் (ப.192-193) 340; கல்யாணராமன் (தொ.2 ப.219) 70; ஜோஷி (ப.103) 16; ஸ்ரீதர் (§25.2.2, ப.682) 10; ரங்காச்சார்யா (ப.129, குறிப்பு 6) 8.',
  },
  COLLECT_MONEY: {
    order: COLLECT_MONEY.order,
    words: { SHRIDHAR: 76, RAMAN: 40, RANGACHARYA: 27, MUHURTA_CHINTAMANI: 8 },
    measureTa: 'வசூல் பற்றிய சொற்கள்: ஸ்ரீதர் (§25.2.3, ப.683) 76; ராமன் (அத்.X, PDF ப.38 — "Recovering Money Due") 40; ரங்காச்சார்யா (ப.129, குறிப்பு 7-8) 27; முகூர்த்த சிந்தாமணி (ஸ்லோ.2/27 குறிப்பு) 8.',
  },
  DEPOSIT_WEALTH: {
    order: DEPOSIT_WEALTH.order,
    words: { WILHELM: 474, MUHURTA_CHINTAMANI: 260, KALYANRAMAN: 251, SHRIDHAR: 141, JOSHI: 128, RANGACHARYA: 20 },
    measureTa: 'வைப்பு / முதலீடு பற்றிய சொற்கள்: வில்ஹெல்ம் (ப.193-195) 474; முகூர்த்த சிந்தாமணி (ஸ்லோ.2/27 + 2/24) 260; கல்யாணராமன் (தொ.2 ப.217) 251; ஸ்ரீதர் (§20.16 ப.583 + §25.2.4 ப.683) 141; ஜோஷி (ப.103) 128; ரங்காச்சார்யா (ப.129, குறிப்பு 8) 20.',
  },
  MAKE_WILL: {
    order: MAKE_WILL.order,
    words: { SHRIDHAR: 161, RAMAN: 78 },
    measureTa: 'உயில் பற்றிய சொற்கள்: ஸ்ரீதர் (§20.19, ப.584) 161; ராமன் (அத்.X, PDF ப.39) 78.',
  },
  PURCHASE_GOODS: {
    order: PURCHASE_GOODS.order,
    words: { KALYANRAMAN: 230, WILHELM: 229, SHRIDHAR: 173, RANGACHARYA: 134, RAMAN: 71, MUHURTA_CHINTAMANI: 48, AGARWAL: 45 },
    measureTa: 'பொருள் வாங்குதல் பற்றிய சொற்கள்: கல்யாணராமன் (தொ.2 ப.218 — வணிகம்) 230; வில்ஹெல்ம் (ப.190) 229; ஸ்ரீதர் (§25.3.1 + §25.3.3, ப.683-684) 173; ரங்காச்சார்யா (ப.128-129) 134; ராமன் (அத்.X, PDF ப.38) 71; முகூர்த்த சிந்தாமணி (ஸ்லோ.2/16, ப.57) 48; அகர்வால் (ப.328) 45.',
  },
  SALE_GOODS: {
    order: SALE_GOODS.order,
    words: { KALYANRAMAN: 230, WILHELM: 229, SHRIDHAR: 195, RANGACHARYA: 134, RAMAN: 65, AGARWAL: 65, JOSHI: 61, MUHURTA_CHINTAMANI: 53 },
    measureTa: 'பொருள் விற்றல் பற்றிய சொற்கள்: கல்யாணராமன் (தொ.2 ப.218 — வணிகம்) 230; வில்ஹெல்ம் (ப.190) 229; ஸ்ரீதர் (§25.3.2 + §25.3.3, ப.683-684) 195; ரங்காச்சார்யா (ப.128-129) 134; ராமன் (அத்.X, PDF ப.38) 65; அகர்வால் (ப.328) 65; ஜோஷி (ப.101) 61; முகூர்த்த சிந்தாமணி (ஸ்லோ.2/17, ப.58) 53.',
  },
  SPECULATION: {
    order: SPECULATION.order,
    words: { KALYANRAMAN: 48 },
    measureTa: 'ஊக வணிகம் பற்றிய சொற்கள்: கல்யாணராமன் (தொ.2 ப.218) 48.',
  },
  LOTTERY: {
    order: LOTTERY.order,
    words: { RAMAN: 132, AGARWAL: 52, KALYANRAMAN: 35 },
    measureTa: 'லாட்டரி பற்றிய சொற்கள்: ராமன் (அத்.XVII, PDF ப.55) 132; அகர்வால் (ப.325) 52; கல்யாணராமன் (தொ.2 ப.219 — பந்தயம் / சூதாட்டம்) 35.',
  },
  ACCOUNTS: {
    order: ACCOUNTS.order,
    words: { JOSHI: 91, WILHELM: 50 },
    measureTa: 'கணக்கு / கடிதம் பற்றிய சொற்கள்: ஜோஷி (ப.149) 91; வில்ஹெல்ம் (ப.189) 50.',
  },
  ASSUMING_OFFICE: {
    order: ASSUMING_OFFICE.order,
    words: { SHRIDHAR: 1291, MUHURTA_CHINTAMANI: 711, WILHELM: 430, RANGACHARYA: 415, VASHISTHA: 385, JOSHI: 378, KALYANRAMAN: 320, AGARWAL: 221, RAMAN: 155 },
    measureTa: 'பதவி ஏற்பு பற்றிய சொற்கள்: ஸ்ரீதர் (§20.1-20.2, ப.567-571) 1291; முகூர்த்த சிந்தாமணி (அத்.10, ஸ்லோ.1-4, ப.232-234) 711; வில்ஹெல்ம் (ப.280-282) 430; ரங்காச்சார்யா (அத்.IX, ப.117-118) 415; கல்யாணராமன் (தொ.2 ப.220-221) 320; வசிஷ்டா (ப.93-95) 385; ஜோஷி (அத்.12, ப.142-143) 378; அகர்வால் (ப.326) 221; ராமன் (அத்.XVI, PDF ப.54-55) 155.',
  },
  MEET_SUPERIOR: {
    order: MEET_SUPERIOR.order,
    words: { SHRIDHAR: 266, WILHELM: 260, KALYANRAMAN: 149, JOSHI: 62, AGARWAL: 39, MUHURTA_CHINTAMANI: 20 },
    measureTa: 'சந்திப்பு பற்றிய சொற்கள்: ஸ்ரீதர் (§20.3-20.4, ப.571-572) 266; வில்ஹெல்ம் (ப.279-280) 260; கல்யாணராமன் (தொ.2 ப.220) 149; ஜோஷி (ப.143) 62; அகர்வால் (ப.326) 39; முகூர்த்த சிந்தாமணி (ஸ்லோ.2/13 — அரசரைக் காணுதல், ஒரு வாக்கியம்) 20.',
  },
  JOIN_SERVICE: {
    order: JOIN_SERVICE.order,
    words: { SHRIDHAR: 397, JOSHI: 300, KALYANRAMAN: 294, WILHELM: 185, MUHURTA_CHINTAMANI: 136, AGARWAL: 68, RANGACHARYA: 36 },
    measureTa: 'வேலையில் சேருதல் பற்றிய சொற்கள்: ஸ்ரீதர் (§20.5, ப.572-573) 397; கல்யாணராமன் (தொ.2 ப.221-222) 294; ஜோஷி (ப.103-104) 300; வில்ஹெல்ம் ("Employees / servants", ப.237 — "employer-இடம் பணி தொடங்குதல்" உட்பட) 185; மு.சி. (ஸ்லோ.2/26, ப.64) 136; அகர்வால் (ப.326) 68; ரங்காச்சார்யா (ப.132) 36.',
  },
  JOB_APPLICATION: {
    order: JOB_APPLICATION.order,
    words: { SHRIDHAR: 208, KALYANRAMAN: 82, AGARWAL: 45, RANGACHARYA: 36 },
    measureTa: 'விண்ணப்பம் பற்றிய சொற்கள்: ஸ்ரீதர் (§20.6 + §20.7 வேலை தேடுதல், ப.573) 208; கல்யாணராமன் (தொ.2 ப.222-223) 82; அகர்வால் (ப.326) 45; ரங்காச்சார்யா (ப.132) 36.',
  },
  EMPLOY_SERVANT: {
    order: EMPLOY_SERVANT.order,
    words: { SHRIDHAR: 396, JOSHI: 300, KALYANRAMAN: 294, WILHELM: 185, MUHURTA_CHINTAMANI: 136, AGARWAL: 50, RAMAN: 48, RANGACHARYA: 18 },
    measureTa: 'வேலைக்காரரை வைத்தல் பற்றிய சொற்கள்: ஸ்ரீதர் (§20.7, ப.573-574, தாஸ சக்கரம் உட்பட) 396; கல்யாணராமன் (தொ.2 ப.221-222) 294; ஜோஷி (ப.103-104) 300; வில்ஹெல்ம் (ப.237) 185; மு.சி. (ஸ்லோ.2/26) 136; அகர்வால் (ப.325) 50; ராமன் (அத்.X, PDF ப.36) 48; ரங்காச்சார்யா (ப.132) 18.',
  },
  FILE_SUIT: {
    order: FILE_SUIT.order,
    words: { JOSHI: 329, KALYANRAMAN: 293, SHRIDHAR: 230, WILHELM: 164, RAMAN: 97, VASHISTHA: 90, AGARWAL: 76, RANGACHARYA: 27 },
    measureTa: 'வழக்கு பற்றிய சொற்கள்: ஸ்ரீதர் (§20.9d அட்டவணை 20.6, §20.21 — ப.577, 584) 230; ஜோஷி (ப.137-138, அட்டவணை 11.7 உட்பட) 329; கல்யாணராமன் (தொ.2 ப.199, மு.சி. வரையறையுடன்) 293; வில்ஹெல்ம் (ப.325-327 "எதிரிகளை வெல்லப் பயணம்" — வழக்குக்கும் அதே, ப.250) 164; ராமன் (அத்.XVII, PDF ப.55) 97; வசிஷ்டா (ப.99-100) 90; அகர்வால் (ப.325) 76; ரங்காச்சார்யா (ப.132) 27.',
  },
  COMPROMISE: {
    order: COMPROMISE.order,
    words: { RAMAN: 233, WILHELM: 228, KALYANRAMAN: 77 },
    measureTa: 'சமரசம் பற்றிய சொற்கள்: ராமன் (அத்.XVI, PDF ப.56 — "Making Peace") 233; வில்ஹெல்ம் (ப.329-330 "War — making peace & treaties") 228; கல்யாணராமன் (தொ.2 ப.199) 77. மற்ற நூல்களில் தனிப் பகுதி இல்லை.',
  },
  AGRI_GENERAL: {
    order: AGRI_GENERAL.order,
    words: { KALYANRAMAN: 104, JOSHI: 78, RAMAN: 45, AGARWAL: 17, VASHISTHA: 1 },
    measureTa: 'விவசாயப் பொது வேலைகள் பற்றிய சொற்கள்: கல்யாணராமன் (தொ.2 ப.165) 104; ஜோஷி (ப.107) 78; ராமன் (அத்.XIII, PDF ப.48 — இரண்டு வாக்கியங்கள்) 45. பொதுப் பட்டியல்கள் (இக்காரியத்தைக் குறிக்கும் சொற்கள் மட்டும்): அகர்வால் (ப.298-299) 17; வசிஷ்டா (ப.46) 1.',
  },
  FIELD_ENTRY: {
    order: FIELD_ENTRY.order,
    words: { WILHELM: 129, SHRIDHAR: 76, SHRIDHAR_OLD: 54 },
    measureTa: 'விவசாய நிலத்தில் முதல் அடி பற்றிய சொற்கள்: வில்ஹெல்ம் ("Setting foot on farmland", ப.185) 129; ஸ்ரீதர் (§21.1, ப.587 — புது நிலம் 76, பயன்பட்ட நிலம் 54).',
  },
  PLOUGHING: {
    order: PLOUGHING.order,
    words: { KALYANRAMAN: 1192, SHRIDHAR: 582, WILHELM: 453, MUHURTA_CHINTAMANI: 228, RAMAN: 143, JOSHI: 125, RANGACHARYA: 117 },
    measureTa: 'உழவு பற்றிய சொற்கள்: கல்யாணராமன் (தொ.2 ப.165-168, பல நூல்களின் கருத்துகள்) 1192; ஸ்ரீதர் (§21.3, ப.587-589) 582; வில்ஹெல்ம் (ப.183-185) 453; முகூர்த்த சிந்தாமணி (ஸ்லோ.2/28, 2/29 பிற்பகுதி) 228; ராமன் (அத்.XIII, PDF ப.47) 143; ஜோஷி (ப.104) 125; ரங்காச்சார்யா (ப.125-126, ஹல சக்கரம் உட்பட) 117.',
  },
  SOWING: {
    order: SOWING.order,
    words: { KALYANRAMAN: 1329, SHRIDHAR: 899, WILHELM: 673, RAMAN: 518, MUHURTA_CHINTAMANI: 262, RANGACHARYA: 173, AGARWAL: 48, JOSHI: 46, VASHISTHA: 5 },
    measureTa: 'விதைத்தல் பற்றிய சொற்கள்: கல்யாணராமன் (தொ.2 ப.168-172, பல நூல்களின் கருத்துகள்) 1329; ஸ்ரீதர் (§21.4, ப.589-592) 899; வில்ஹெல்ம் (ப.185-188) 673; ராமன் (அத்.XIII, PDF ப.47-48) 518; முகூர்த்த சிந்தாமணி (ஸ்லோ.2/29, உரை) 262; ரங்காச்சார்யா (ப.126-127, பணி சக்கரம் உட்பட) 173; அகர்வால் (ப.329) 48; ஜோஷி (ப.104) 46; வசிஷ்டா (பொதுப் பட்டியல் — இக்காரியத்தைக் குறிக்கும் சொற்கள் மட்டும்) 5.',
  },
  TRANSPLANTING: {
    order: TRANSPLANTING.order,
    words: { SHRIDHAR: 48, MUHURTA_CHINTAMANI: 43, WILHELM: 31, KALYANRAMAN: 24, RANGACHARYA: 17 },
    measureTa: 'நாற்று நடுதல் பற்றிய சொற்கள்: ஸ்ரீதர் (§21.5, ப.592) 48; முகூர்த்த சிந்தாமணி (ஸ்லோ.2/32 பிற்பகுதி, ப.68) 43; வில்ஹெல்ம் (ப.188) 31; கல்யாணராமன் (தொ.2 ப.177, மு.சி. மேற்கோள்) 24; ரங்காச்சார்யா ("Plantation", ப.127) 17.',
  },
  TREE_PLANTING: {
    order: TREE_PLANTING.order,
    words: { SHRIDHAR: 323, KALYANRAMAN: 149, JOSHI: 100, WILHELM: 77, MUHURTA_CHINTAMANI: 41, AGARWAL: 25, RAMAN: 11 },
    measureTa: 'மரம் நடுதல் பற்றிய சொற்கள்: ஸ்ரீதர் (§21.6, ப.593-594) 323; கல்யாணராமன் (தொ.2 ப.178-179) 149; ஜோஷி (ப.106) 100; வில்ஹெல்ம் (விதைத்தலில் "மரம், கொடி", ப.186-187) 77; முகூர்த்த சிந்தாமணி (ஸ்லோ.2/13, ப.56) 41; அகர்வால் ("Horticulture", ப.329) 25; ராமன் (பொதுப் பட்டியல், அத்.IV; அத்.XIII ஒரு வரி) 11.',
  },
  GARDEN: {
    order: GARDEN.order,
    words: { MUHURTA_CHINTAMANI: 245, KALYANRAMAN: 175, WILHELM: 119, JOSHI: 46, VASHISTHA: 23, RANGACHARYA: 9, RAMAN: 2 },
    measureTa: 'தோட்டம் அமைத்தல் பற்றிய சொற்கள்: முகூர்த்த சிந்தாமணி (ஸ்லோ.2/61-62, ப.88-89 — குளம், தெய்வப் பிரதிஷ்டையுடன்) 245; கல்யாணராமன் (தொ.2 ப.177-178) 175; வில்ஹெல்ம் (ப.183) 119; ஜோஷி (ப.108) 46. பொதுப் பட்டியல்கள் (இக்காரியத்தைக் குறிக்கும் சொற்கள் மட்டும்): வசிஷ்டா 23; ரங்காச்சார்யா 9; ராமன் 2.',
  },
  HARVEST: {
    order: HARVEST.order,
    words: { KALYANRAMAN: 315, WILHELM: 175, SHRIDHAR: 96, MUHURTA_CHINTAMANI: 87, RAMAN: 81, JOSHI: 69, SHRIDHAR_PADDY: 49, RANGACHARYA: 25 },
    measureTa: 'அறுவடை பற்றிய சொற்கள்: கல்யாணராமன் (தொ.2 ப.172-173) 315; வில்ஹெல்ம் (ப.180-181) 175; ஸ்ரீதர் (§21.8, ப.595) 96; முகூர்த்த சிந்தாமணி (ஸ்லோ.2/31, ப.67-68) 87; ராமன் (அத்.XIII, PDF ப.48) 81; ஜோஷி (ப.104-105) 69; ஸ்ரீதர் (§21.5 நெல் அறுவடை, ப.592-593) 49; ரங்காச்சார்யா (ப.127) 25.',
  },
  THRESHING: {
    order: THRESHING.order,
    words: { KALYANRAMAN: 66, MUHURTA_CHINTAMANI: 44, WILHELM: 35, JOSHI: 29, SHRIDHAR: 27, RANGACHARYA: 19 },
    measureTa: 'போரடித்தல் பற்றிய சொற்கள்: கல்யாணராமன் (தொ.2 ப.177) 66; முகூர்த்த சிந்தாமணி (ஸ்லோ.2/32, ப.68) 44; வில்ஹெல்ம் (ப.188) 35; ஜோஷி (ப.105) 29; ஸ்ரீதர் (§21.5, ப.593) 27; ரங்காச்சார்யா (ப.127) 19.',
  },
  GRAIN_STORAGE: {
    order: GRAIN_STORAGE.order,
    words: { KALYANRAMAN: 1089, WILHELM: 515, SHRIDHAR_GATHER: 224, RAMAN: 149, RANGACHARYA: 101, SHRIDHAR: 84, JOSHI: 84, MUHURTA_CHINTAMANI: 78, VASHISTHA: 5 },
    measureTa: 'தானியம் சேகரித்தல் பற்றிய சொற்கள்: கல்யாணராமன் (தொ.2 ப.174-177, பல நூல்களின் கருத்துகள்) 1089; வில்ஹெல்ம் (ப.181-183) 515; ஸ்ரீதர் (§21.9 சேகரித்தல், ப.595-596) 224; ராமன் (அத்.XIII, PDF ப.48) 149; ரங்காச்சார்யா (ப.127-128, களஞ்சியம், வைக்கோல் போர் …) 101; ஸ்ரீதர் (§21.10-11 சேமித்தல், விதை, ப.596) 84; ஜோஷி (ப.106-107) 84; முகூர்த்த சிந்தாமணி (ஸ்லோ.2/33, ப.68) 78; வசிஷ்டா (பொதுப் பட்டியல் — இக்காரியத்தைக் குறிக்கும் சொற்கள் மட்டும்) 5.',
  },
  NEW_GRAIN: {
    order: NEW_GRAIN.order,
    words: { SHRIDHAR: 380, WILHELM: 210, MUHURTA_CHINTAMANI: 97 },
    measureTa: 'நவான்னம் பற்றிய சொற்கள்: ஸ்ரீதர் (§21.12, ப.596-598) 380; வில்ஹெல்ம் (ப.178-179) 210; முகூர்த்த சிந்தாமணி (ஸ்லோ.2/37, ப.73-74) 97. கல்யாணராமன், ஜோஷி, ராமன், ரங்காச்சார்யா, வசிஷ்டா, அகர்வாலில் இல்லை.',
  },
  NEW_CLOTHES: {
    order: NEW_CLOTHES.order,
    words: { SHRIDHAR: 686, WILHELM: 432, KALYANRAMAN: 389, MUHURTA_CHINTAMANI: 226, JOSHI: 97, RAMAN: 60, VASHISTHA: 49, RANGACHARYA: 39, AGARWAL: 18 },
    measureTa: 'புது ஆடை அணிதல் பற்றிய சொற்கள் (பக்கத் தலைப்புகள் தவிர): ஸ்ரீதர் (§19.14.1, ப.561-563) 686; வில்ஹெல்ம் (ப.216-217) 432; கல்யாணராமன் (தொ.2 ப.237-238) 389; முகூர்த்த சிந்தாமணி (ஸ்லோ.2/10 உரை, குறிப்புகள், ப.53-54) 226; ஜோஷி (ஆடை, ஆபரணம், ப.146) 97; ராமன் (அத்.X, PDF ப.36) 60; ரங்காச்சார்யா (ப.131) 39. பொதுப் பட்டியல்கள் (இக்காரியத்தைக் குறிக்கும் சொற்கள் மட்டும்): வசிஷ்டா (ப.42-46, 54-58) 49; அகர்வால் (ப.299) 18.',
  },
  NEW_ORNAMENTS: {
    order: NEW_ORNAMENTS.order,
    words: { KALYANRAMAN: 594, SHRIDHAR: 511, WILHELM: 497, MUHURTA_CHINTAMANI: 226, VASHISTHA: 99, JOSHI: 97, AGARWAL: 37, RANGACHARYA: 28, RAMAN: 2 },
    measureTa: 'புது ஆபரணம் அணிதல் பற்றிய சொற்கள்: கல்யாணராமன் (தொ.2 ப.235-236, செய்தலும் அணிதலும்) 594; ஸ்ரீதர் (§19.13.1, ப.558-559) 511; வில்ஹெல்ம் (ப.248-249) 497; முகூர்த்த சிந்தாமணி (ஸ்லோ.2/10 — பவளம், தந்தம், சங்கு, தங்கம், ஆடை) 226; ஜோஷி (ஆடை, ஆபரணம்) 97; பொதுப் பட்டியல்கள் (இக்காரியத்தைக் குறிக்கும் சொற்கள் மட்டும்): வசிஷ்டா (ப.41-46, 54-58) 99; அகர்வால் (ப.299) 37; ரங்காச்சார்யா (ப.6, 10, 17-18) 28; ராமன் (அத்.IV, PDF ப.9) 2.',
  },
  ORNAMENT_MAKING: {
    order: ORNAMENT_MAKING.order,
    words: { KALYANRAMAN: 594, WILHELM: 178, JOSHI: 106, SHRIDHAR: 90, MUHURTA_CHINTAMANI: 75, AGARWAL: 37, VASHISTHA: 35, RANGACHARYA: 20 },
    measureTa: 'ஆபரணம் செய்தல் பற்றிய சொற்கள்: கல்யாணராமன் (தொ.2 ப.235-236, செய்தலும் அணிதலும்) 594; வில்ஹெல்ம் ("Jewelry- Making & Gold smithing", ப.247) 178; ஜோஷி (பொன் வேலை, ப.107-108) 106; ஸ்ரீதர் (§19.13.2, ப.559-560) 90; முகூர்த்த சிந்தாமணி (ஸ்லோ.2/16 உரை, ஆயுதம் தவிர, ப.59) 75; பொதுப் பட்டியல்கள் (இக்காரியத்தைக் குறிக்கும் சொற்கள் மட்டும்): அகர்வால் (ப.299) 37; வசிஷ்டா (ப.42-46, 54-58) 35; ரங்காச்சார்யா (ப.17-18) 20. ராமனில் இல்லை.',
  },
  CLOTHES_WASHING: {
    order: CLOTHES_WASHING.order,
    words: { MUHURTA_CHINTAMANI: 123, SHRIDHAR: 64, WILHELM: 60, KALYANRAMAN: 58, RANGACHARYA: 16 },
    measureTa: 'ஆடை துவைத்தல் பற்றிய சொற்கள்: முகூர்த்த சிந்தாமணி (ஸ்லோ.2/20 உரை, குறிப்பு, ப.59-60) 123; ஸ்ரீதர் (§19.14.2, ப.563) 64; வில்ஹெல்ம் (ப.216) 60; கல்யாணராமன் (ப.247, மு.சி., சண்டேஸ்வரர் மேற்கோள்கள்) 58; ரங்காச்சார்யா (ப.131) 16.',
  },
  STITCHING: {
    order: STITCHING.order,
    words: { WILHELM: 44, SHRIDHAR: 36, RANGACHARYA: 25, MUHURTA_CHINTAMANI: 17 },
    measureTa: 'தைத்தல் பற்றிய சொற்கள்: வில்ஹெல்ம் ("Cloth- Making, Weaving, Sewing", ப.215) 44; ஸ்ரீதர் (§19.14.3, ப.563) 36; ரங்காச்சார்யா (ப.132) 25; முகூர்த்த சிந்தாமணி (ஸ்லோ.2/15 உரை, ப.57) 17.',
  },
  VEHICLE: {
    order: VEHICLE.order,
    words: { WILHELM: 152, SHRIDHAR: 102, VASHISTHA: 85, KALYANRAMAN_BUY: 76, KALYANRAMAN: 67, JOSHI: 54, AGARWAL: 32, RANGACHARYA: 18, MUHURTA_CHINTAMANI: 12, RAMAN: 4 },
    measureTa: 'வாகனம் வாங்குதல் / முதலில் ஓட்டுதல் பற்றிய சொற்கள் (பக்கத் தலைப்புகள் தவிர): வில்ஹெல்ம் ("Vehicles- Driving", ப.328-329) 152; ஸ்ரீதர் (§25.5, ப.684-685) 102; வசிஷ்டா (ப.136) 85; கல்யாணராமன் (தொ.2 ப.186 — வாங்குதல், ஓட்டப் பழகுதல்) 76; கல்யாணராமன் (ப.242 — புது வாகனம் ஓட்டுதல்) 67. பொதுப் பட்டியல்கள் (இக்காரியத்தைக் குறிக்கும் சொற்கள் மட்டும்): ஜோஷி (அத்.2, ப.9-11, 25) 54; அகர்வால் (ப.298-299) 32; ரங்காச்சார்யா (ப.6, 17-18) 18; மு.சி. (ஸ்லோ.2/4, 2/9 உரை) 12; ராமன் (அத்.IV, PDF ப.9) 4. ஜோஷியின் தனிப் பகுதி (ப.107) தயாரித்தல் / வியாபாரம் — அங்கே.',
  },
  VEHICLE_MAKE: {
    order: VEHICLE_MAKE.order,
    words: { KALYANRAMAN: 109, SHRIDHAR: 102, JOSHI: 81, WILHELM: 56 },
    measureTa: 'வாகனம் தயாரித்தல் / வியாபாரம் பற்றிய சொற்கள்: கல்யாணராமன் (தொ.2 ப.189) 109; ஸ்ரீதர் (§25.5, ப.684-685) 102; ஜோஷி (ப.107) 81; வில்ஹெல்ம் ("Vehicles- Manufacturing", ப.329) 56.',
  },
  ROGA_SNANA: {
    order: ROGA_SNANA.order,
    words: { SHRIDHAR: 251, WILHELM: 199, KALYANRAMAN: 186, MUHURTA_CHINTAMANI: 128, JOSHI: 89, RANGACHARYA: 72, RAMAN: 70, AGARWAL: 37 },
    measureTa: 'நோய் நீங்கிய முதல் குளியல் பற்றிய சொற்கள் (பக்கத் தலைப்புகள் தவிர): ஸ்ரீதர் (§22.5, ப.605) 251; வில்ஹெல்ம் (ப.268-269) 199; கல்யாணராமன் (தொ.2 ப.202) 186; முகூர்த்த சிந்தாமணி (ஸ்லோ.2/40 உரை, ப.76) 128; ஜோஷி (ப.147) 89; ரங்காச்சார்யா (ப.133) 72; ராமன் (PDF ப.53-54) 70; அகர்வால் (ப.329) 37. வசிஷ்டாவில் இல்லை.',
  },
  OLD_HOUSE: {
    order: OLD_HOUSE.order,
    words: { SHRIDHAR: 264, RAMAN: 108, JOSHI: 102, WILHELM: 99, MUHURTA_CHINTAMANI: 94, AGARWAL: 16 },
    measureTa: 'பழைய வீட்டில் நுழைதல் பற்றிய சொற்கள் (பக்கத் தலைப்புகள் தவிர): ஸ்ரீதர் (§27.16, ப.732-733) 264; ராமன் (அத்.XII "வேறு வீட்டுக்கு மாறுதல்", PDF ப.46) 108; ஜோஷி (ப.124) 102; வில்ஹெல்ம் (ப.246) 99; முகூர்த்த சிந்தாமணி (13/1 உரையின் ஒரு வாக்கியம், 13/2 உரை, ப.314) 94; அகர்வால் (ப.326) 16. ரங்காச்சார்யா ஒரு வரி மட்டும் (மௌட்யத்திலும் செய்யலாம், ப.42); கல்யாணராமன், வசிஷ்டாவில் இல்லை.',
  },
  MEDICINE: {
    order: MEDICINE.order,
    words: { WILHELM: 886, RAMAN: 633, SHRIDHAR: 328, MUHURTA_CHINTAMANI: 218, KALYANRAMAN: 215, JOSHI: 106, VASHISTHA: 103, RANGACHARYA: 71, AGARWAL: 2 },
    measureTa: 'மருந்து / சிகிச்சை பற்றிய சொற்கள் (நோய்வாரி சிகிச்சை, பேதி மருந்து, ரத்தம் எடுத்தல், பல் உட்பட; நோய் தொடங்கிய நட்சத்திரப் பலன், மருந்து தயாரித்தல், நோய் நீங்கிய குளியல், அறுவை தவிர): வில்ஹெல்ம் (ப.269, 272-273, 275-277) 886; ராமன் (அத்.XV, ப.52-53) 633; ஸ்ரீதர் (§22.3, ப.603-604) 328; முகூர்த்த சிந்தாமணி (ஸ்லோ.2/15, 2/30 உரை) 218; கல்யாணராமன் (தொ.2 ப.201-203) 215; ஜோஷி (அத்.13, ப.146-147) 106; வசிஷ்டா (ப.133) 103; ரங்காச்சார்யா (ப.132-133) 71. அகர்வால் (பொதுப் பட்டியல் — உக்ர நட்சத்திரம், ப.299) 2; தனிப் பகுதி இல்லை (நோய் நீங்கிய குளியல் மட்டும்).',
  },
  SURGERY: {
    order: SURGERY.order,
    words: { WILHELM: 499, RAMAN: 194, SHRIDHAR: 152, VASHISTHA: 65, KALYANRAMAN: 40, RANGACHARYA: 32, JOSHI: 3, AGARWAL: 2 },
    measureTa: 'அறுவை சிகிச்சை பற்றிய சொற்கள்: வில்ஹெல்ம் (அறுவை, அழகு அறுவை / பச்சை குத்தல், ப.273-275) 499; ராமன் (ப.53) 194; ஸ்ரீதர் (§22.4, ப.604-605) 152; வசிஷ்டா (ப.133, குறிப்புடன்) 65; கல்யாணராமன் (தொ.2 ப.203) 40; ரங்காச்சார்யா (ப.133) 32. பொதுப் பட்டியல்கள் (உக்ர நட்சத்திரம் — "அறுவை"): ஜோஷி (அத்.2, ப.10) 3; அகர்வால் (ப.299) 2. முகூர்த்த சிந்தாமணியில் இல்லை.',
  },
  BUSINESS: {
    order: BUSINESS.order,
    words: { VASHISTHA: 217, KALYANRAMAN: 190, WILHELM: 112, JOSHI: 83, SHRIDHAR: 66, MUHURTA_CHINTAMANI: 65, RANGACHARYA: 52, AGARWAL: 40, RAMAN: 2 },
    measureTa: 'கடை திறப்பு / வியாபாரம் தொடங்குதல் பற்றிய சொற்கள்: வசிஷ்டா ("Vipani karana", பக்.100-101) 217; கல்யாணராமன் (தொ.2 பக்.186-187) 190; வில்ஹெல்ம் (ப.193) 112; ஜோஷி (அத்.9, ப.101) 83; ஸ்ரீதர் (§25.4, ப.684) 66; முகூர்த்த சிந்தாமணி (ஸ்லோ.2/17 — கடை திறப்புப் பகுதி, ப.58; ஒரு உரைப் படிவம்) 65; ரங்காச்சார்யா (ப.128) 52. பொதுப் பட்டியல்கள் (இக்காரியத்தைக் குறிக்கும் சொற்கள் மட்டும்): அகர்வால் (நட்சத்திர வகைகள், ப.298-299) 40; ராமன் (அத்.IV, PDF ப.9) 2 — இவ்விருவரிலும் கடை திறப்புக்குத் தனிப் பகுதி இல்லை (வாங்குதல் / விற்றல் மட்டும்).',
  },
  EDUCATION: {
    order: EDUCATION.order,
    words: { WILHELM: 1038, SHRIDHAR: 863, RAMAN: 656, KALYANRAMAN: 313, JOSHI: 222, VASHISTHA: 153, MUHURTA_CHINTAMANI: 147, RANGACHARYA: 70, AGARWAL: 32 },
    measureTa: 'உபநயனத்துக்குப் பின் கல்வி தொடங்குதல் பற்றிய சொற்கள்: வில்ஹெல்ம் (பக்.233-237, பாடவாரி நட்சத்திரங்கள், யோகங்கள் உட்பட) 1038; ஸ்ரீதர் (§17.11.2-3, பக்.436-438) 863; ராமன் (அத்.XI, PDF பக்.39-40, பாடவாரி நட்சத்திரங்கள் உட்பட) 656; கல்யாணராமன் (தொ.2 பக்.151-152) 313; ஜோஷி (அத்.8, பக்.96) 222; வசிஷ்டா (பக்.84-85) 153; முகூர்த்த சிந்தாமணி (ஸ்லோ.5/38, பக்.135; ஒரு உரைப் படிவம்) 147; ரங்காச்சார்யா (பக்.118-119) 70. அகர்வால் (பொதுப் பட்டியல் — நட்சத்திர வகைகள், ப.299) 32; தனிப் பகுதி இல்லை.',
  },
  VIDYARAMBHA: {
    order: VIDYARAMBHA.order,
    words: { KALYANRAMAN: 2542, WILHELM: 632, VASHISTHA: 534, SHRIDHAR: 230, AGARWAL: 207, JOSHI: 188, MUHURTA_CHINTAMANI: 173, RAMAN: 141, RANGACHARYA: 135 },
    measureTa: 'அக்ஷராப்யாசம் / வித்யாரம்பம் பற்றிய சொற்கள்: கல்யாணராமன் (தொ.2 பக்.94-101; பல நூல்களின் தொகுப்பு) 2542; வில்ஹெல்ம் (பக்.231-233) 632; வசிஷ்டா (பக்.82-83) 534; ஸ்ரீதர் (§17.11.1, பக்.435-436) 230; அகர்வால் (பக்.309, 328) 207; ஜோஷி (பக்.58-59) 188; முகூர்த்த சிந்தாமணி (ஸ்லோ.5/37, பக்.134-135; ஒரு உரைப் படிவம்) 173; ராமன் (PDF ப.19) 141; ரங்காச்சார்யா (பக்.76-77) 135.',
  },
  TRAVEL: {
    order: TRAVEL.order,
    words: { SHRIDHAR: 18112, MUHURTA_CHINTAMANI: 16536, WILHELM: 7634, JOSHI: 4375, KALYANRAMAN: 4304, RAMAN: 1908, RANGACHARYA: 1510, VASHISTHA: 994, AGARWAL: 75 },
    measureTa: 'பயணம் பற்றிய சொற்கள்: ஸ்ரீதர் (அத்.23, பக்.611-666) 18112; முகூர்த்த சிந்தாமணி (அத்.11, பக்.235-287; ஒரு உரைப் படிவம்) 16536; வில்ஹெல்ம் (பக்.304-322) 7634; ஜோஷி (அத்.11, பக்.126-141) 4375; கல்யாணராமன் (தொ.2 பக்.204-215) 4304; ராமன் (அத்.XIV, PDF பக்.49-51) 1908; ரங்காச்சார்யா (அத்.VIII, பக்.109-116) 1510; வசிஷ்டா (பக்.126-132) 994; அகர்வால் (ப.325, அயன விதி மட்டும்) 75.',
  },
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
  TRAVEL: {
    AGARWAL: { ...AGARWAL_GS, pageLocus: '"Journeys", printed p.325 (PDF 324): "If Sun and Moon are in Uttarayana, then the journey towards east and north is auspicious. If Sun and Moon are in Dakshinayana, then the journey towards west and south is auspicious. If situation of Sun and Moon are different ayans, then the journey in the direction indicated by Sun may be made during daytime and that indicated by Moon will be auspicious if made during nighttime. (Sl.39, Ch 11 Muhurta Chintamani)"' },
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: 'Chapter 23 "Travel", printed pp.611-666 (PDF 647-702): p.613 "When only four directions are mentioned, east direction includes east to south"; p.616 "Travel started in the following results in failure ...: in Shoolas (nakshatra - Vaar - Tithi); in Lalaatika Yoga; violation of Parigh Danda; when Venus is set, retrograde, in debilitated sign or in inimical sign; Venus, Mercury or Mars are in the direction of travel; retrograde planets are in quadrants; weekday lord is retrograde; 6th, 12th & Rikta Tithis; luminaries in Mrit Paksha of Rahu; the Moon is in the back or left to the direction of travel; when Vishti Karan is current; in Ghaata Vaar - Nakshatra - Tithi - Karan & ascendant; in Janma Lagna - Rashi - nakshatra; travel to south direction in Panchaka & Abhijit Muhurt; ... on a malefic day like Sunday, Monday or Saturday; in 8th or 6th sign from Janma Rashi or Janma Lagna; lords of 6th or 8th signs of election chart in election ascendant; in Aquarius or Pisces signs as election ascendant; when Prishtodya signs are rising; Saturn in 10th or Venus in 7th house"; p.617 §23.3 Sharad and Vasant; p.617 §23.4 "The solar months of Aries, Leo & Sagittarius are considered the best; Taurus, Gemini, Virgo, Libra & Capricorn are middling; while Cancer, Scorpio & Pisces are inauspicious ... K.P. commends that one should not travel in the middle part of Leo & Cancer"; p.618 table 23.1 Ghaat Maasas; "Tithi: 1st (B.H); & 2,3,5,10,11,13 of both the halves are beneficial"; p.619 Ghaat Tithi, Tithi Dik-Shoola table, "One should not travel towards east during Nanda Tithis; towards south during Bhadra Tithis; towards west during Jaya Tithis; & towards north during Poorna Tithis; & in any direction during Rikta Tithis & the New Moon days"; p.621 "Travelling on a weekday whose lord is retrograde causes destruction ... if the weekday lord is set then that day should not be used"; §23.6.1 Vaar-Shoola "after expiry of 12 Ghatis from the beginning of Sunday ... leave 20, 16, 16, 8, 12 & 20 Ghatis on Monday to Saturday"; p.622 Kona-Shoola, table 23.3; p.623 Ghaat Vaar, "towards south during Abhijin Muhurt"; p.624 §23.7.1-2 benefic and malefic constellations and M.C.\'s ghatis; p.625 "Journey undertaken in Janma, Vipat, Pratiyari & Vadha Taras ... in all the three triads"; p.626 table 23.6 Nakshatra Shoola; p.627 table 23.7 Nakshatra Kaal-Shoola; p.631 table 23.9 Ascendants & favourable directions; p.636 "The Moon in 1st, 12th, 6th, 8th; Venus in 7th; Saturn in 10th; & ascendant lord in 7th, 12th, 6th, or 8th house are not auspicious (M.C.-11/56)"; p.637 "Journey should not begin when quadrants in election chart are unoccupied by benefic planets. If benefic & malefic planets occupy quadrants, the results shall be middling (K.P.)"; pp.639-640 Parigh Danda and its Digdwar antidote; pp.640-641 §23.12 the direction of Venus "a) In the direction of her rising (If longitude of Venus is more than that of the Sun - then Venus rises in the east ...) b) Location of Venus in the election chart ... M.C. opines that Venus remains blind when the Moon is in Revati to first quarter of Krittika"; p.643 "The Moon in Jeeva Paksha is like nector & in Mrit Paksha is like dead"; p.646 §23.14 Lalaatik Yoga; p.650 "for all other purposes like business travel & pilgrimage, Yogini should be kept on the left side"; p.650 §23.16 Kaal & Paash "should not exist in the travelling direction for the purpose of war, financial gain etc."' },
    MUHURTA_CHINTAMANI: { ...MC_SHARMA, pageLocus: 'Chapter 11 "Journeys and Travels", printed pp.235-287 (PDF 239-291): sloka 8 "If at the time of the Journey the Sun is in the signs of Sagittarius, Aries, and Leo, the journey is auspicious ... Capricorn, Aquarius, Gemini, Virgo, Taurus and Libra ... medium ... Cancer, Pisces and Scorpio, then the journey undertaken in such times is a long one"; "in the Nakshtras 1/3/5/7/10/12/14/16/19/21/23/25 from the Janama Nakshtra, journey should not be undertaken"; sloka 9 "A Journey is not auspicious if it is undertaken on the Tithis of 6th, 12th, 8th, the Pratipada or the First Tithi of the Shukla Paksha ..., Amavasya ..., Pauranmasi ... and on the Tithis named as Rikta (4/9/14). It ... is auspicious if it is undertaken in the Nakshtras of Ashwini, Punar Vasu, Anuradha Mrigashira, Pushya, Rewati, Hasta, Shravana and Dhanishtha"; sloka 10 Vaar and Nakshtra Shoola; sloka 11 Kaala Shoola; sloka 12 "The 16 first ... ghatis of the Nakshtras of the three Poorvas, 21 ghatis of the Kritika Nakhstra, 11 ghatis of Magha, 7 ghatis of Bharani, and 14 ghatis of the Swati, Vishakha, Jyeshtha and Ashlesha"; slokas 14-15 Jeeva, Mrita, Kartari, Grasta; sloka 24 the sum divided by 7, 8 and 3; sloka 25 Mahadala and Bhrama; slokas 27-33 the Ghaata Chandra ("does not need to be avoided in other things"), quarters, tithis, days, Nakshtras, ascendants; sloka 34 "Yogini is not auspicious if she remains in the front or on the left side"; sloka 35 "\'Kaala\' and \'Paasha\' should not be in the front side in journey"; slokas 36-38 Parigha Danda, "In the Nakshtras of Anuradha, Hasta, Pushya and Ashwini the journey in all the Four Directions is auspicious. If a Retrograde Planet is in an Angle ... and the day of a Retrograde Planet is also prohibited"; sloka 39 Ayana; slokas 40-42 Venus in front in three ways, Venus blind "As long as the Moon remains from Rewati to the First Quarter of the Kritika"; slokas 43-44 Aquarius and Pisces ascendant and navamsha; sloka 47 the Digdwar ascendant; sloka 51 Lalatika; sloka 54 "in the Abhijita ... in all the other ones than in the Southern"; sloka 56 "The Moon in the 1/12/6/8 House from the Ascendant, Saturn in the 10th House, Venus in the 7th House, and the Ascendant Lord in the 7/12/6/8 House - these ... are inauspicious"' },
    WILHELM: { ...WILHELM_E, pageLocus: '"Travel - Commencing a Journey", printed pp.304-322 (PDF 312-330): p.305 "For an average trip taken these days, one can give most attention to the basic Muhurta factors, avoid the usual Doshas and then try to avoid as many other specific travel Doshas as possible, without becoming overwhelmed"; p.306 Ayana; "Asvini, Mrigasira, Pushya, Hasta, Anuradha, Sravana, Dhanishtha and Revati are most favorable. Rohini, Punarvasu, Uttaraphalguni, Chitra, Mula, Uttarashadha and Satabhisha are middling ... Krittika after 21 Nadis, Bharani after 7 Nadis, Magha after 14 Nadis, Purvaphalguni, Purvashadha and Purvabhadrapada after 16 Nadis; Svati, Aslesha, Visakha, Ardra, Jyeshtha and the Janma Nakshatra after 14 Nadis"; pp.307-308 Ghata Nakshatra and Padas; p.309 "The 2nd, 3rd, 5th, 7th, 10th, 11th, 13th are favorable. The 1st of Shukla Paksha, and the 4th, 6th, 8th, 9th, 12th, 14th and 15th should be avoided. The 1st Tithi of Krishna Paksha is middling"; Sula; Ghata Tithis; p.310 "The Vara of Mercury, Jupiter and Venus are favorable. The Vara of a retrograde planet should be avoided"; p.311 "Any Vara, including Sula and Kantaka Varas, becomes favorable if the lord of the Vara is in an Upachaya"; "Taurus, Leo, Libra and Sagittarius are most favorable. Other moveable Rasis and other Sirodaya Rasis (Virgo and Scorpio) are middling. Gemini should always be avoided ... Aquarius, as well as Aquarius Navamsa, is particularly unfavorable ... Pisces or Pisces Navamsa"; p.315 "The Navamsas of Mercury, Jupiter and Venus are favorable"; "The Moon is most unfavorable in the 1st, 4th, 6th, 8th or 12th, Saturn in the 10th, Venus in the 7th, Jupiter in the 3rd, 7th, or 8th, and the Lagna lord in the 6th, 8th, 12th or 7th ... No planet should be in the 12th. The 6th lord should not be in the Lagna"; p.316 "Do not begin a journey when the angles are unoccupied by benefics, or if they are occupied by malefic planets. If the angles are occupied by malefics and benefics, the results will only be mediocre"; Venus in front; p.317 "Venus should also not be retrograde, combust, or debilitated"; "Mars and Mercury should not be retrograde or combust. The Moon: The Moon must be alone ... The Moon should not be in the Rasi of the natal Lagna or the natal Moon"; p.318 "the middle third of Leo and Cancer"; "Avoid traveling during Sankranti"; Kala & Pasha; Yogini; p.319 Travel Panchaka, the sum by 7, 8, 3; p.320 the tithi, weekday and star multiplied by 2, 3, 4 and divided by 6, 8, 6' },
    JOSHI: { ...JOSHI_KK, pageLocus: 'Chapter 11 "Journey", printed pp.126-141 (PDF 141-156): "Hasta, Ashwini, Pushya, Mrigashira, Revati, Anuradha, Shravana, Dhanistha and Punarvasu these nine are considered best. All fixed nakshatras ... are medium. Others should be avoided. If it is Urgent ... avoid first 16 ghatis ... of Three Poorvas; first 7 ghaties ... of Bharani; first 21 ghatis ... of Kritika; first 11 ghatis ... of Magha and first 14 ghatis ... of Swati, Vishakha, Jyestha and Ashlesha"; table 11.2 Dik-Shoola; "2/3/5/7/10/11/13 tithis of both bright half and dark half and 1st tithi of dark half ... are considered good"; "Avoid Bhadra"; "Thursday and Friday are best, Sunday Monday and Wednesday are medium, rest ... should be avoided"; "Avoid malefic yogas particularly Vyatipaat, Vaidhriti and first half of Parigha"; table 11.3 Chandra-Nivasa "Benefic positions of Moon and Lagna"; Sammukha Shukra; Parigha-Danda; Yogini "in front and on left hand side should be avoided"; Rahu "Moon should not be placed in \'Mrita Paksha\' ... Even \'Grasta\' and \'Kartari\' nakshatras should be avoided"; Kaala-Pasha; Ayana; "1st, 3rd, 5th, 7th, 10th 12th, 14th, 16th, 19th, 21st, 23rd and 25th nakshatra from one\'s Janma nakshatra should be avoided"; Chandra Shuddhi; table 11.6 Ghaata; Lagna (a)-(e); p.136 "If one considers all the factors discussed above only journey one can afford is the \'Last Journey\'. One must fix priorities ... Chandra/Tara Shuddhi; Sammukha Chandra ... Avoiding \'Vaar and Nakshatra Shoola\' and proper Lagna Shuddhi\' should be given more importance"; "Holanta Paksha (i.e. Phalguna Shukla Paksha) should be avoided for all types of journeys"; long distance journeys' },
    KALYANRAMAN: { ...KALYANRAMAN_V2, pageLocus: '"Undertaking Travel", printed pp.204-215 (PDF 206-217): "it may not be necessary to enforce all those rigid rules intended for Vijayayaatra"; "the best are the nine - Anuradha, Aswini, Dhanishta, Hasta, Mrigasira, Punarvasu, Pushyami, Revati and Sravana. The four nakshatras - Uttara phalguni, Uttarashada, Uttarabhadrapada and Rohini are accepted as mediocre"; "The tithis acceptable ... are 2/3/5/7/10/11/ and 13 of both fortnights. Prathama of Krishna Paksha is however, admitted"; "Thursday and Friday are the best. Sunday, Monday and Wednesday are medium. Nevertheless it cannot be construed that none can undertake any travel on Tuesdays and Saturdays"; Kaalaprakaasika\'s tithi and weekday directions, ghatikas, Vaara Kandakam; Kaala-Pasha; "Avoid Bhadra Karana; and bad Yogas especially, Vyatipata, Vaidhruthi and the first half of Parigha"; Kaalashoola; "Ashtamaraasi days ... must invariably be avoided"; Chandra Nivaasa; p.209 Lalatika as printed ("West when Mercury is in the 7th ... NE when Jupiter is in the 2nd"), "raasi 11 - Aquarius - as Lagna or navaamsa must invariably be avoided"; "Moon must not be in 1/4/6/8/12 houses. Saturn in 10th and Venus in the 7th are not auspicious. Lagna-lord must not be posited in 6/7/8/12"; Yogini; p.211 "only the Panchanga Suddhi, Dik-Suddhi, Nakshatra shoola, Lagna-Suddhi and the Chandra and Taaraabala must be given priority"; Chandra Kandakam; Jeeva, Mrita; Ayanas; Tara and Chandrasuddhi; p.213 "The months to be avoided are Ashada, Bhadrapada and Sravana. Combustion Venus and Jupiter must also be avoided. For long distance journeys ... Harisayana ... Phalguna Shuklapaksha is not also suitable"; Yaatra Panchaka; p.214 the Ghaata table' },
    RAMAN: { ...RAMAN_BV, pageLocus: 'Chapter XIV "Travel", PDF pp.49-51: "The best lunar days are the 2nd, 3rd, 5th, 7th, 10th, 11th and 13th. The 14th lunar day and Full and New Moon days should be avoided at any cost"; "Mrigasira, Aswini, Pushya, Punarvasu, Hasta, Anuradha, Sravana, Moola, Dhanishta and Revati. It is better that the journey is commenced in the 2nd, 3rd or last quarter"; "No journey should be undertaken on days ruled by Krittika, Bharani. Aslesha. Visakha, Pubba, Poorvabhadra and Aridra. Of these, the following ... fit ... beyond the spheres of evil influence: - Krittika - 13 ghatis; Bharani - 7; Makha - 14; Pubba, Poorvashadha and Poorvabhadra - 16; Swati, Aslesha and Visakha - 14 ... Bharani and Krittika should be invariably rejected"; the Vaar Shoola "Provided the journey is timed to begin beyond 22 ghatis on Thursday ... In our view, Tuesday must preferably be avoided"; "Aries, Taurus, Cancer, Leo, Libra and Sagittarius are favourable"; "Rising sign at the time of journey being one\'s Janma Rasi is highly favoured. But it should never be the sign of one\'s Janma Lagna ... nor ... the 5th, 7th or the 9th from one\'s Janma Lagna"; "(d) the absence of Panchaka Dosha"; "Avoid days of vernal and autumnal equinox and the days on which the Sun enters a new sign"; PDF p.8 Panchaka: "If the remainder is 1 (mrityu panchakam) ... 2 (agni ...) ... 4 (raja ...) ... 6 (chora ...) ... 8 (roga ...) ... In regard to travel, Chora Panchaka should be rejected ... we ignore raja panchaka for travelling"; "But it is inauspicious for ... travel" (the Janma Nakshatra); PDF p.9: "Beginning from the third quarter of Dhanishta and ending with the last part of Revati ... Nakshatra Panchaka ... one should avoid journey towards the south"' },
    RANGACHARYA: { ...RANGACHARYA_I, pageLocus: 'Chapter VIII, printed pp.109-116 (PDF 117-124): "1,4,6,8,9,12,14, amavasya and poornima should be avoided. 2,3,5,7,10,13 and 1 (D) are favoured. The ghatha tithi of one\'s birth-sign should also be discarded ... Leaving the first 6 ghatis ... in the ghata tithis, in the rest of them travel is acceptable"; Tithi Soola; "Monday, Wednesday, Thursday and Friday are good. Saturday, Sunday and Tuesday are evil. The weekday of the planet placed in 3,6,11 is accepted for travel"; Ghata Vara; Vara Soola and its ghatis; "Aswini, Mrigasira Punarvasu, Pushyami, Hasta, Anuradha, Sravana, Dhanishtta and Revati are excellent ... Jyeshtta and Moola also are favoured. Rohini, Pubba, Poorvashada, Poorvabhadra, Satabhisha, Uttara, Uttarashada and Uttarabhadra are mediocre. Chitra, Swati, Visakha, Makha, Aslesha, Krittika, Ardra and Bharani should be avoided. One should not make a journey in his birth-asterism and in the 25th and 27th"; Ghatha-asterisms; Nakshatra Kala Soola; Sarvanka Yoga; "Mesha, Kataka, Tula, Makha, Mithuna, Kanya and Dhanus good. Kumbha and Meena and their navamsas should be avoided"; "The Abhijit Lagna is good except to the South"; Gatha Lagnas; "The moon should not occupy in 1,6,8,12 and Venus should not occupy the 7th house. Saturn is not good in the 10th. The lord of the Muhurtha Lagna should not occupy in 6,7,8, 12"' },
    VASHISTHA: { ...VASHISTHA_KUSUM, pageLocus: '"Yatra (travel)", printed pp.126-132 (PDF 113-119): "When Moon and Sun are in any sign from Makara to Mithuna (10 to 3), yatra towards east and north is good ... During Basanta (spring), travelling in all the four directions is good. Dishashoola is not taken into account during Basanta"; "Best: When Sun transits in Mesha, Singha and Dhanu. Medium: ... Vrisha, Mithuna, Kanya, Tula, Makara and Kumbha. Inauspicious: ... Karka, Vrishchika and Meena"; "Tithi: 1 (krishna paksha), 2, 3, 5, 7, 10, 11 and 13 of shukla paksha"; Disha Shool "East; Jyeshtha nakshatra, Saturday or Monday; South: Poorvabhadra nakshatra, Thursday; West: Rohini nakashatra and Friday; North: Bharani nakashatra, Tuesday or Wednesday"; Kaal Shool; Ghatak Tithi, Ghat Vara, Ghat Nakshatras, Moon\'s Ghat Rashi ("prohibited in ... travel"), Ghat of Nakshatra charana; Rahu Vaas "Do not travel in the above-mentioned directions"; Tara "1, 3, 5 and 7 taras are unfortunate"; "Leave the following lagnas in the tithis stated against them"' },
  },
  VIDYARAMBHA: {
    KALYANRAMAN: { ...KALYANRAMAN_V2, pageLocus: '"Aksharaabhyasa or Aksharaarambha — initiating a child to learn its first alphabets", printed pp.94-101 (PDF 96-103): the table "Nakshatra Abhijith included 17+1=18 … Tithis 2/3/5/6/10/11/12 Reject - Chidra/1/7/8/13/15/30 … Weekdays Wednesday, Thursday and Friday best. Sunday and Monday medium. Reject - Tuesday and Saturday … Yoga 2/3/4/5/7/8/11/12/14/16/18/20/21/22/23/24/25/26 Vydhruti and Vyatipata … Karana … Reject - Sthira Karanas and Vishti … Remarks Prefer Uttaraayana. Some say that except Harisayanakaala … the whole year is good. Avoid combustion of Jupiter and Venus. Lagna: of movable raasis (1-4-7-10) … 8th house must be free"; p.96: "The month of Kumbha … must be avoided … If the day selected is Vijayadasami day, nothing need be considered further … For Vidya arambha, during daytime Praatasandhya, aparahna and Sayam sandhya must be rejected. If done during night-time; Apararaatra has to be preferred"; p.98: "Janma nakshatra is to be avoided"; p.100: "So in general Monday, Tuesday and Saturday must be strictly avoided. While Thursday and Friday are good, Wednesday is very good" ("Regarding Sunday there appears to be some hesitation"); p.101: "In general preference is for Uttaraayana, 5th year, Chandra Suddhi and Tara Suddhi. For the Lagna, some hold the Ubhayaraasis … as the best while others hold them mediocre. Chara raasis Mesha, Kataka, Thula and Makara are good. Fixed raasis Taurus, Leo, Vruschika and Kumbha must be rejected. For Meena opinions differ. It will be excellent to have Mercury, Venus or Jupiter in the 9th. Vidyaa kaaraka Mercury must not be combust. Kuja must not be in house 08. There must be no malefics in houses 02 and 05"' },
    WILHELM: { ...WILHELM_E, pageLocus: '"Education - Alphabet, Learning", printed pp.231-233 (PDF 239-241): "Age: Should be done in the 5th Saura year from birth"; "Ayana: Uttarayana is by far preffered, though not in the Saura month of Aquarius. Paksha: Should be performed in Shukla Paksha or the first five Tithis of Krishna Paksha. Nakshatra: Asvini, Ardra, Punarvasu, Hasta, Chitta, Svati, Anuradha, Sravana, and Revati are favorable. Muhurta Chintamani also favors Pushya, which may be taken as middling in favor. Tara: In addition to the normally favorable Taras, the Janma Nakshatra as well as the 10th from there is favorable. Tithi: The 2nd, 3rd, 5th, 10th, 11th and 12th Tithis are favorable. Kalaprakasika also considers the 7th and 13th to be favorable, while Muhurta Chintamani also considers the 6th to be favorable, all of these which may be considered as middling"; Galagraha, Anadhyaya, Pradosha; "Karana: Sthira Karanas and Vishti Karana should be avoided. Vara: The Varas of Mercury, Jupiter and Venus are most favorable, the Moon\'s and Sun\'s are middling. Lagna: Dual Rasis are by far the best … it seems reasonable to avoid fixed Rasis, and to accept moveable Rasis … Bhavas: The 8th house must be unoccupied. Grahas: Avoid the afflictions of Jupiter and Venus"; "Noon is best, forenoon is quite good, afternoon, twilight and night should be avoided"; "Mercury, Jupiter and Venus in the 5th are very beneficial"' },
    VASHISTHA: { ...VASHISTHA_KUSUM, pageLocus: 'Chapter 7 "1. Starting Education (General)", printed pp.82-83 (PDF 69-70): "the first reading and writing (initiation) of the child can be started after worshipping lord Ganesha, Saraswati devi … Months — All months in the Uttarayana excepting Kumbha sankranti, such as Magha, Phalguna, Chaitra, Baishakha, Jyeshtha and Ashadha; Tithis — Shukla 2, 3, 5, 6, 10, 11, and 12; Varas — Medium: Monday and Sunday; Best: Wednesday, Thursday and Friday; Avoidable: Saturday and Tuesday; Nakshatras — Ashwini, Ardra, Punarvasu, Pushya, Hasta, Chitra, Swati, Anuradha, Jyeshtha, Abhijita, Sravana, and Revati; Lagnas — 2, 3, 6, 9 and 12: 1. Leave the movable lagnas. 2. There should be no planet in the 8th house"; footnote 3: "The period when Jupiter or Venus is combust must be avoided"' },
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§17.11.1 "Starting of alphabets - Aksharaarambh", printed pp.435-436 (PDF 475-476): "Tithi: 2,3,5,10,11,12. Day: Monday, Wednesday, Thursday, and Friday. Const.: Small (Hasta, Ashvani, Pushya), Shravana, Swati, Revati, Punarvasu, Ardra, Chitra, Anuradha. Ascendant: 2,3,6,9,12 signs. Fixed sign as ascendant is prohibited. As per Sage Markandeya 1,6,8,15 & Rikta (4,9,14) Tithis should be left out. But M.C. has recommended 6th Tithi. Uttrayana is held as auspicious, but not when the Sun transits Aquarius … The Moon & Mercury should be favourable in transits. P.K. has not included Ardra"; "Acharya Shridhar recommends that Akshar Aarambh should be initiated … in B.H., leaving 1st, 6th, 8th & Rikta Tithis; when fixed or common sign is rising, but rising navamsha should not have the Sun or Mars; & 8th house in the election chart should be vacant"' },
    AGARWAL: { ...AGARWAL_GS, pageLocus: 'printed pp.309, 328 (PDF 308, 327): "6. Vidyarambh … Best is 5th day of the 5th month of the 5th year of birth. Very auspicious is in 5th year in uttarayan (Sun in Capricorn to Gemini). Good tithis are 2,3,5,6,10,11,12 on a good vaar in short or swati, punarvasu, shravana, revati, chitra, anuradha, jyestha nakshatras. Lagna be in 2,3,6,9,12 rasi and 8th should be vacant during before-noon. Avoid phalguna month. In muhurta kundli Mercury, Venus or Jupiter in 9th counteract all evil influences"; p.328 "Vidyarambha: … Days: Monday, Wednesday, Thursday, Friday"' },
    JOSHI: { ...JOSHI_KK, pageLocus: '"Educational Samskaras (1) Akshararambha", printed pp.58-59 (PDF 73-74): "The Guru … sits facing the east and the child sits facing the west … Time: Akshararambha can be done in 5th year and in Uttarayana. Nakshatras: All short nakshatras (Hasta, Ashwini, Pushya and Abhijit). Swati, Punarvasu, Shravana, Revati, Chitra, Anuradha and Jyestha nakshatras are considered auspicious. Tithis: 2/3/5/6/10/11/12 tithis. Days: Monday, Wednesday, Thursday and Friday. Lagnas: Lagnas of 2/3/6/9/12 rashis (i.e., Lagnas of benefics leaving movable rashis) with benefics strongly placed in 7th or 10th house and 8th house not having any planet. Proper Chandra and Tara Shuddhi is an important requirement"' },
    MUHURTA_CHINTAMANI: { ...MC_SHARMA, pageLocus: 'Chapter 5 sloka 37, printed pp.134-135 (PDF 138-139): "गणेशविष्णुवाग्रमाः प्रपूज्य पञ्चमाब्दके तिथौ शिवार्कदिग्द्विषट्शरत्रिके रवावुदक् । लघुश्रवोऽनिलान्त्यभादितीशतक्षमित्रभे चरोनसत्तनौ शिशोर्लिपिग्रहः सतां दिने ॥" — "In the 5th year from the birth … on the Tithis of 11,12,10,2,6,5, and 3, in the Nakshtras named as Laghu or small (Hasta, Ashwini and Pushya), in those of Shravana Swati, Rewati, Punarvasu, Ardra, Chitra and Anuradha, in the auspicious or benefic Lagnas or Ascendants (2/3/6/9/12) except the Lagnas or Ascendants of the Chara Rashis (movable signs) and on auspicious days. Notes: According to Markandeya, the Shashthi (6th) Tithi should be rejected … there should be no planet in the 8th House"' },
    RAMAN: { ...RAMAN_BV, pageLocus: '"Commencing Education (Aksharabhyasa)", PDF p.19-20: "The most propitious period for commencing education is the 6th day in the 5th month of the 5th year. The following days constellations are good: Monday, Wednesday, Thursday and Friday; Aswini, Punarvasu, Aridra, Hasta, Chitta, Swati, Sravana and Revati. Movable and common signs are good. Forenoon and noon are preferable. The 8th house should be unoccupied. Mercury, Venus, Jupiter in the 9th counteracts all evil influences"' },
    RANGACHARYA: { ...RANGACHARYA_I, pageLocus: '"Aksharabhyasa (Learning of alphabet)", printed pp.76-77 (PDF 84-85): "should be done in the 5th day of the 5th month of the 5th year of the child. It should be done in the Uttarayana. Kumbha masa should be avoided. It should be done in the forenoon or in the noon. The moudyam of Jupiter and Venus should be avoided. TITHI 2,3,5,6,10,11,12 WEEKDAY Monday, Wednesday, Thursday, Friday. ASTERISM Aswini, Pushyami, Hasta, Punarvasu, Sravana, Mithuna, Revathi, Swati, Chitra, Anuradha. LAGNA Mesha, Kataka, Tula and Makara are commended. Midhuna, Kanya, Dhanus and Meena are mediocre. The 8th house should lie vacant. Mercury, Venus or Jupiter in the 9th house is par excellence. The malefics in 3,6,11 and the benefics in the kendras and konas are favoured"' },
  },
  EDUCATION: {
    AGARWAL: { ...AGARWAL_GS, pageLocus: 'Classification of nakshatras, printed pp.298-299 (PDF 297-298): "5. Short and dynamic kshipra, laghu Hasta, Aswini, Pushya, Abhijit … Suitable for construction & starting a shop, selling, sex. starting education, making and wearing ornaments, fine arts, learning & display of arts etc., travelling, dancing, singing, acting, beauty parlours. All acts mentioned in movable nakshatras can also be done in these nakshatars"; "2. Movable chara, chala Swati, Punarvasu, Shravana, Dhanishtha, Satabhisha … Good for riding on vehicles, horses, elephants, starting of factory/machinery/vehical (wherever motion is profitable). All acts mentioned in Short and Dynamic nakshatras can also be done in diese nakshatras"; "6. Gentle friendly mridu, maitri Mrigshira, Revati, Chitra, Anuradha … Good for all auspicious ceremonies, 16 samskaras, start of occupation/service/business, singing, learning, music, making & wearing clothes, playing, learning game, making friends, making & wearing ornamnets … All acts mentioned in Fixed and Constant nakshatras can also be done in these nakshatras"; "A. 1. Fixed sthira (constant) Utlaraphalguni, Uttarashada, Uttarabhadra, Rohini … Good for coronation, foundation laying, digging a well, house building, upnayana, nagar or graha pravesha, agriculture or horticulture, starting service, etc. and All acts mentioned in Gentle and Friendly nakshatras can also be done in these"' },
    RAMAN: { ...RAMAN_BV, pageLocus: 'Chapter XI "Elections Pertaining to Education", PDF pp.39-40: "The most beneficial constellations for commencing education are Mrigasira, Aridra, Punarvasu, Pushya, Hasta, Chitta, Swati, Sravana, Dhanishta and Satabhisha. Aswini is held by some writers to be one of the best. Rohini, Uttara, Uttarashadha and Revati are neutral. The remaining ones are to be rejected. Tuesday and Saturday should invariably be avoided. Sunday can be considered permissible if other astrological conditions are satisfactory. The following lunar days are auspicious: 1st (of dark half), 2nd, 3rd, 5th, 6th, 10th and 11th. The 4th, 8th, 9th, 14th and New and Full Moon days should be avoided. The Lagna should not be a fixed sign. Common signs are the best and the movable ones ordinary … The forenoon and the noon are the best. Malefics should be disposed in the 3rd, 6th and 11th houses. The 8th house should be clean and unoccupied by benefic or malefic planets"' },
    WILHELM: { ...WILHELM_E, pageLocus: '"Education - Vidya & Upavidya", printed pp.233-237 (PDF 241-245): "Nakshatra: Asvini, Mrigasira, Ardra, Punarvasu, Pushya, Hasta, Chitta, Svati, Sravana, Dhanishtha and Satabhisha are best. Kalaprakasika also considers Rohini, Uttaraphalguni, Uttarashadha, Uttarabhadrapada and Revati to be middling, while Muhurta Chintamani considers Aslesha, Purvaphalguni, Mula, Purvashadha and Purvabhadrapada as also favorable, which all of these may be considered as middling"; "Tithi: The 2nd, 3rd, 5th, 6th, 10th and 11th are favorable. Kalaprakasika also considers the 1st as favorable, while Muhurta Chintamani also considers the 12th as favorable, both of which may be considered as middling. Particularly avoid the 4th, 8th, 9th, 14th and 15th Tithis"; Galagraha, Anadhyaya, Pradosha; "Vara: Avoid the Varas of Mars and Saturn, as well as the Moon\'s … The Sun\'s Vara prolongs life, though according to some it impedes progress"; "Lagna: Dual Rasis are best, moveable Rasis are middling, while fixed Rasis should be avoided … Navamsa: Avoid the Navamsas of Mars and Saturn. Bhavas: The 8th must be unoccupied and, according to some, the 4th as well. Malefics should certainly not be in the 4th. Malefics are best in the 3rd, 6th and 11th … Benefics are best in angles and trines. Grahas: Avoid the afflictions of Jupiter and Venus. Miscellaneous: Forenoon and noon are best, the afternoon and night should be avoided"' },
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§17.11.2 "All types of educations" and §17.11.3 "Prohibited time for study", printed pp.436-438 (PDF 476-478): "Tithi: 2,3,5,10 & 11 Tithis are favourable. B.H. is recommended … Avoid 4,6,8,9 Tithis, the Full Moon & New Moon days. Anadhyaya Tithis are prohibited. Day: Wednesday, Thursday, Friday are the best … M.C. has recommended Sunday also … Tuesday & Saturday, & their navamshas in the rising should be avoided … Majority of exponents including Acharya Shripati commend that Monday is prohibited"; "Constellation: Mrigshira, Ardra, Punarvasu, Pushya, Hasta, Chitra, Swati, Shravana, Shatbhish, Dhanishta … the best; Ashvani, Rohini, 3 Poorvas are … neutral. M.C. opines that Bharni, Krittika & 3 Uttras (5 nos.) should be avoided & balance can be used. J.V. … constellation number 1st to 7th, & 12th to 15th from that of the Sun are unfavourable"; p.437: "Ascendant: The common signs are the best; movable signs are of middling quality …; while the fixed signs are bad according to K.P. Malefics in 3,6 & 11 houses will increase happiness; while benefics in these houses will certainly cause obstructions. Benefics in quadrants or trines are beneficial. There should be no planet in the 8th house … Some opine that 4th house should also be vacant"; "According to J.V. Jupiter & Venus should not be set; avoid Vishnu Shayana"; "Time: Forenoon & the Noontime are the best; afternoon & night-time should be avoided"; p.438 §17.11.3: "1st Tithi …, 8th Tithi …, 14th & the New Moon …, the Full Moon …; Ayana & Vishuva Sankranti, Harishayan & Haibodhan"' },
    KALYANRAMAN: { ...KALYANRAMAN_V2, pageLocus: '"Educational — Commencing General Education", printed pp.149-152 (PDF 151-154): "Tuesdays are generally to be rejected for such deeds"; the table "Nakshatra Abhijith, Aswini, Rohini, Mrigasira, Aridra, Punarvasu, Pushyami, Aslesha, Poorvaphalguni, Hasta, Chitra, Swati, Moola, Poorvashada, Sravana, Dhanishta, Satabhisha, Poorvabhadrapada (17+1) … Tithis 2/3/5/6/10/11/12 Some accept 1/7/8/13/15 as well. Weekdays Wednesday, Thursday and Friday are the best. Sunday and Monday are mediocre"; vol.2 p.100: "Lagna of movable raasis (1-4-7-10) with benefics in Kendra and Trikonas (1-4-7-10-5-9) and malefics in 3-6-11 is considered good for starting general education. 8th house must be free"' },
    JOSHI: { ...JOSHI_KK, pageLocus: 'Chapter 8 "Educational Muhurtas — Muhurta for Starting Education - General", printed p.96 (PDF 111): "Time: Sun in Uttarayana is considered auspicious. Some Learned say that except \'Harishayana\' … whole year is good. Combustion of Jupiter and Venus should be avoided. Nakshatras: All movable nakshatras …, all short nakshatras (i.e. Hasta, Ashwini and Pushya) Moola, Poorvaphalguni, Poorvashada, Poorvabhadrapad, Mrigshira, Chitra, Ardra and Ashlesha are considered good. Tithis: 2/3/5/6/10/11/12 tithis are good. Days: Wednesday, Thursday and Friday are best; Sunday and Monday medium and rest … should be avoided. Lagna: Lagna of movable rashis (1/4/7/10 rashis) with benefics in kendras and Trikonas … and malefics in 3/6/10/11 are considered good. 8th house should not have any planet. Age: … odd years … Chandra/Tara-Shuddhi: … avoiding 4/8/12 positions of Moon from natal Moon … avoiding 3/5/7 Taras"' },
    VASHISTHA: { ...VASHISTHA_KUSUM, pageLocus: '"2. Starting main line of education", printed pp.84-85 (PDF 71-72): "Mas — Excepting Phalguna, any other month in Uttarayana; Tithi — 2, 3, 5, 7, 10, 11 and 13 shukla tithis; Vara — Sunday, Wednesday, Thursday and Friday; Nakshatra — Mrigashirsha, Ardra, Punarvasu, Hasta, Chitra, Swati, Sravana, Dhanishtha, Shatabhisha, Ashwini, Moola, all the three poorvas, Ashlesha. Also dhruva (fixed) nakshatras i.e. Anuradha and Revati. It means that out of 27 nakshatras, only 6 nakshatras i.e. Bharani, Krittika, Magha and the three uttaras are to be avoided. Lagna — 2, 5, 8 (fixed lagnas excepting Kumbha) i. Benefics in Kendra or Trikona … ii. Malefics in 3, 6, and 11 from lagna"' },
    MUHURTA_CHINTAMANI: { ...MC_SHARMA, pageLocus: 'Chapter 5 sloka 38, printed p.135 (PDF 139): "मृगात्कराच्छ्रुतेस्त्रयेऽश्विमूलपूर्विकात्रये गुरुद्वयेऽर्कजीववित्सितेऽह्नि षट्छरत्रिके । शिवार्कदिग्द्विके तिथौ ध्रुवान्त्यमित्रभे परैः शुभैरधीतिरुत्तमा त्रिकोणकेन्द्रगैः स्मृता ॥" — "THE MUHURTA FOR THE BEGINNING OF GETTING EDUCATION: … the auspicious Nakshtras are Mrigashira, Ardra, Punarvasu, Hasta, Chitra, Swati, Shravana, Dhanishtha, Shatabhisha, Ashwini, Moola, Poorvaphalguni, Poorvashadha, Poorvabhadrapada, Pushya and Ashlesha, the auspicious days are Sunday, Thursday, Wednesday and Friday and the auspicious Tithis are 6/5/3/11/12/10/2; and the Lord of the Ascendant … should be a benefic planet and there should be benefic planets in the Angles and Trines from the Ascendant. Notes: Some Acharyas have said that for beginning to learn archery the Nakshtras named as Dhruwa, those of Rewati and Anuradha are the auspicious ones"' },
    RANGACHARYA: { ...RANGACHARYA_I, pageLocus: 'Chapter IX "Commencing Education", printed pp.118-119 (PDF 126-127): "The 1st (D) 2,3,5,6,12,10,11 are good, 4,8,9,14 Amavasya and Poornima should be avoided. Wednesday, Thursday and Friday are good. Sunday and Monday are mediocre. Tuesday and Saturday should be avoided. The movable and the dual lagnas should be the choice. Aswini, Mrigasira, Aridra, Punarvasu, Pushyami, Aslesha, Poorva (3) Hasta, Chitra, Swati, Sravana, Dhanishtta and Satabhisha are acceptable"' },
  },
  BUSINESS: {
    RAMAN: { ...RAMAN_BV, pageLocus: 'Chapter IV "Influence of Constellations", PDF p.9: "Aswini, Pushya, Hasta and Abhijit are light constellations, and they can be selected for putting ornamentation, pleasures and sports, administering medicine, starting industries and undertaking travels"' },
    AGARWAL: { ...AGARWAL_GS, pageLocus: 'Classification of nakshatras, printed pp.298-299 (PDF 297-298): "5. Short and dynamic kshipra, laghu Hasta, Aswini, Pushya, Abhijit … Suitable for construction & starting a shop, selling, sex. starting education, making and wearing ornaments, fine arts, learning & display of arts etc., travelling, dancing, singing, acting, beauty parlours. All acts mentioned in movable nakshatras can also be done in these nakshatars"; "6. Gentle friendly mridu, maitri Mrigshira, Revati, Chitra, Anuradha … Good for all auspicious ceremonies, 16 samskaras, start of occupation/service/business, singing, learning, music, making & wearing clothes, playing, learning game, making friends, making & wearing ornamnets … All acts mentioned in Fixed and Constant nakshatras can also be done in these nakshatras"; "A. 1. Fixed sthira (constant) Utlaraphalguni, Uttarashada, Uttarabhadra, Rohini … Good for coronation, foundation laying, digging a well, house building, upnayana, nagar or graha pravesha, agriculture or horticulture, starting service, etc. and All acts mentioned in Gentle and Friendly nakshatras can also be done in these"; "2. Movable chara, chala Swati, Punarvasu, Shravana, Dhanishtha, Satabhisha … Good for riding on vehicles, horses, elephants, starting of factory/machinery/vehical (wherever motion is profitable). All acts mentioned in Short and Dynamic nakshatras can also be done in diese nakshatras"' },
    VASHISTHA: { ...VASHISTHA_KUSUM, pageLocus: '"7. Vipani karana muhurta", printed pp.100-101 (PDF 87-88): "To start a business on a small scale or to open a shop the following muhurta is advised: Tithi — 2, 3, 5, 7, 10, 12, 13 (shukla) and 15; Vara — Sunday, Monday, Wednesday, Thursday, Friday and Saturday; Nakshatra — Ashwini, Rohini, Mrigashirsha, Punarvasu, 3 uttaras, Hasta, Chitra, Swati, Anuradha, Moola, Sravana, Abhijita, Dhanishtha, Poorva Bhadra and Revati; Lagna — Any lagna except Kumbha. It is better to take either chara (movable) or dual lagna … The business should not be started on Bhurudan day. (Bhu-rudan day is end of month, end of year amavasya, festival of Holi and Tuesday.) Taurus, Gemini, Leo, Virgo, Scorpio and Capricorn lagnas are good. Moon and Mercury in lagna are best, 8 and 12 bhava should be vacant (no planet). Benefics should be in 2, 10 and 11 houses … Jupiter and Venus should not be combust. Pausha, Chaturmas, Vyaghata, Bhadra, Vyatipata, Vaidhriti should be rejected. Moon should not be weak. Rikta tithis and Tuesday should also be rejected"' },
    KALYANRAMAN: { ...KALYANRAMAN_V2, pageLocus: '"Openings Shops, Opening Commercial Outlets", printed pp.186-187 (PDF 188-189): "Nakshatra Abhijith, Aswini, Rohini, Mrigasira, Pushyami, Uttaraphalguni, Hasta, Chitra, Anuradha, Uttarashada, Uttarabhadrapada and Revati (11+1) … Tithis 1/2/3/5/6/7/8/10/11/12/13/15. Weekdays Sunday, Monday, Wednesday, Thursday, Friday, Saturday. Notes: … 2. Avoid Rikta tithis, Tuesday and Aquarius as ascendant. 3. Lagna should have benefics in 2/10/11 houses. 4. Venus and the Moon are preferable in Lagna. 5. Malefics must not occupy 8/12 houses"' },
    WILHELM: { ...WILHELM_E, pageLocus: '"Business/Finance - Store/Business Opening", printed p.193 (PDF 201): "Nakshatra: Asvini, Rohini, Mrigasira, Pushya, Uttaraphalguni, Hasta, Chitta, Anuradha, Uttarashadha, Uttarabhadrapada and Revati are favorable. Tithi: Choose a favorable Tithi and definitely avoid the 4th, 9th and 14th. Vara: Avoid Mars\'s Vara particularly. Lagna: Avoid Aquarius. Bhavas: Venus or the Moon is very favorable in the Lagna. There should be no malefics in the 8th and 12th. Benefics are best in the 2nd, 10th and 11th"' },
    JOSHI: { ...JOSHI_KK, pageLocus: 'Chapter 9 "Opening a Shop", printed p.101 (PDF 116): "Avoid Rikta Tithis (4/9/14), Tuesday and Aquarius Ascendent. All other tithis, days and ascendents are good. All fixed nakshatras …, all Mridu nakshatras … and all Laghu or short nakshatras (Hasta, Ashwini, Pushya and Abhijit) are considered auspicious for starting a shop. The Lagna should have benefics in 2/10/11 houses; Venus and Moon are preferred in lagna; and 8/12 houses should not have malefics"' },
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§25.4 "Opening a shop", printed p.684 (PDF 719): "In Sweet (Mrigshira, Chitra, Anuradha, Revati), Stationary (Rohini, 3 Uttras), Small (Hasta, Ashvani, Pushya, Abhijit); the Moon & Venus in ascendant; benefics in 2,10,11 houses, & malefics not in 8th or 12th houses; is fortuitous time to open a shop …; but Rikta Tithis, Tuesday, & Aquarius should not be rising at that time (M.C)"' },
    MUHURTA_CHINTAMANI: { ...MC_SHARMA, pageLocus: 'Chapter 2 sloka 17, printed p.58 (PDF 62): "… रिक्ताभौमघटान्विना च विपणिर्मैत्रध्रुवक्षिप्रभैर्लग्ने चन्द्रसिते व्ययाष्टरहितैः पापैः शुभैर्ध्यायखे ॥१७॥" — "The opening of a shop is auspicious, on other tithis, days and in ascendant leaving Rikta tithis, the day of Tuesday and the Ascendant of Aquarius, in the Nakshtras called Mitra, Dhruwa and Kshipra, if Venus and the Moon are in the Ascendant, if there are no malefics in the 8/12 Houses and if there are benefics in the 2/10/11 Houses"' },
    RANGACHARYA: { ...RANGACHARYA_I, pageLocus: '"Shop Opening", printed p.128 (PDF 136): "Avoid Tuesday, and the rikta tithis. Choose the fixed and soft asterisms. The placement of the moon and Venus in Lagna is excellent for opening any shop. The malefics should not occupy the 8th and 12th houses. The placement of the benefics in the 2nd, 11th and 10th is good"' },
  },
  ROGA_SNANA: {
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§22.5 "Bath after recovery from illness", printed p.605 (PDF 642): "Tithi: Rikta (4.9.14) Tithis. Day: Sunday, Tuesday, Wednesday, Thursday & Saturday. Cont.: Barring Fixed (Rohini, 3 Uttras), Magha, Swati, Aslesha, Punarvasu & Revati (9 No.), the balance 18 number of the asterisms are beneficial. Ascendant: Movable signs are favourable. Malefics (the Sun, Mars, Saturn, Rahu, and Ketu) should be in 1,4,7,10, 5,9,11 houses; & emaciated Moon should be in 4,8,12 signs from J.R. J.V. further directs that emaciated Moon should be in 10th Tithi of D.H. to 5th Tithi of B.H. … K.P. mostly differs from the above … It has been advised to avoid the Moon in 8th; Janma Nakshatra, 3rd, 5th, 7th, 10th, 12th, 14th, 16th & 22nd asterisms from Janma Nakshatra. Tuesday, Wednesday & Thursday; their signs & Vargas are held as benefic. Rikta Tithis & New Moon should be avoided. Benfics should be in trines or in squares; & malefics in 3,6,11 places"' },
    WILHELM: { ...WILHELM_E, pageLocus: '"Medical- Bathing after illness", printed pp.268-269 (PDF 276-277): "Nakshatra: Asvini, Bharani, Krittika, Mrigasira, Ardra, Pushya, Purvaphalguni, Hasta, Chitra, Visakha, Mula, Purvashadha and Purvabhadrapada are favorable. Muhurta Chintamani additionally considers Anuradha, Jyeshtha, Sravana, Dhanishtha and Satabhisha as favorable, which may be considered middling. Tara: Avoid the Janma Nakshatra and the 3rd, 5th, 7th, 10th, 12th, 14th, 16th and 22nd Nakshatras from there. Avoid Chandra Ashtama. Tithi: Avoid the 4th, 8th, 9th, 14th and Amavasya … Vara: The Varas of Mars, Mercury and Jupiter are favorable. The Moon\'s and Venus\'s are very unfavorable. Lagna: Rasis and Navamsas of Mars, Mercury and Jupiter are favorable. Moveable Rasis are unfavorable. Bhavas: Avoid malefics in the angles, trines and 11th as much as possible. Malefics are favorable in the 3rd and 6th and benefics in the angles and trines. Grahas: The Moon should not be a malefic"' },
    KALYANRAMAN: { ...KALYANRAMAN_V2, pageLocus: '"Taking the First Bath for the Recovered Patients (Rogamuktha Snana)", printed p.202 (PDF 204): "Nakshatra Aswini, Bharani, Krittika, Mrigasira, Aridra, Punarvasu, Pushyami, Poorvaphalguni, Hasta, Chitra, Visaka, Jyeshta, Moola, Poorvashada, Sravana, Dhanishta, Satabhisha and Poorvabhadrapada (18) … Tithis The Rikta tithis 4/9/14. Weekdays Sunday, Tuesday, Wednesday, Thursday and Saturday. Notes: 1. Muhoortha Chintaamani wants to avoid the five nakshatras Revati, Punarvasu, Makha, Swati, Aslesha and the four Dhruva nakshatras … 2. Mondays and Fridays are unsuitable. 3. The Lagna must be moveable raasis 1/4/7/10 with Malefics - Sun, Mars, Saturn, Raahu, Ketu - in Kendras or Trikonas. 4. The Moon must not be emaciated - i.e., must not be in 4/8/12 houses; 5. Malefics must not be in 11th house, angles or trines. 6. Mars, when weak in transit is considered auspicious"' },
    MUHURTA_CHINTAMANI: { ...MC_SHARMA, pageLocus: 'Chapter 2 sloka 40, printed p.76 (PDF 80): "व्यन्त्यादितिध्रुवमघानिलसार्पधिष्ण्ये, रिक्ते तिथौ चरतनौ विकवीन्दुवारे । स्नानं रुजा विरहितस्य जनस्य शस्तं, हीने विधौ खलखगैर्भवकेन्द्रकोणे ॥४०॥" — "The bathing of a patient when he is relieved of the disease he has been suffering from is auspicious in all the other Nakshtras than those of Rewati, Punarvasu, the Nakshtras named \'Dhruwa\' … those of Magha, Swati and Ashlesha, on the Rikta Tithis (4/9/14), in the chara or Movable Ascendants (1/4/7/10), on other days than those of Friday and Monday, in the event of the Moon being emaciated (she is emaciated when she is in the 4/8/12 Houses) when the Malefic Planets are in the 11th House, or in Angles or in Trines"' },
    JOSHI: { ...JOSHI_KK, pageLocus: '"\'Roga-mukta Snana\' or taking bath after recovering from illness", printed p.147 (PDF 162): "Nakshatras: Ashwini, Bharani, Kritika, Mrigshira, Ardra, Punarvasu, Pushya, Poorvaphalguni, Hasta, Chitra, Vishakha, Jyestha, Moola, Poorvashada, Shravana, Dhanistha, Shatbhisha and Poorvabhadrapad nakshatras. Tithis: Rikta tithis (4/9/14 tithis) are considered auspicious. Days: Sunday, Tuesday, Wednesday, Thursday and Saturday are good. Lagnas: Lagnas of movable rashis (1/4/7/10 rashis) with malefics (Sun, Mars, Saturn, Rahu, Ketu) in Kendras and Trikonas, and Mars weak in transit is considered auspicious"' },
    RANGACHARYA: { ...RANGACHARYA_I, pageLocus: '"First bath after illness", printed p.133 (PDF 141): "After the recovery of long illness, one should not take his first bath in Revati, Punarvasu, Uttara, Uttarashada, Uttarabyhadra, Rohini, Makha, Swati, Aslesha and on Friday and Monday. Avoid the rikta tithis, Sunday, Tuesday, Wednesday, Thursday and Saturday. Cardinal lagnas are good for bath when the Moon also is week and when the kendras, konas and 11th house are occupied by the malefics, Tarabala and Chandrabala are necessary"' },
    RAMAN: { ...RAMAN_BV, pageLocus: 'Chapter XV "Medical Elections", PDF pp.53-54: "Taking First Bath after illness. - When one has completely recovered from an illness of long duration the first bath should be given on a day ruled by Aswini, Bharani, Krittika, Mrigasira, Aridra, Pushya, Pubba, Hasta, Chitta, Visakha, Moola, Poorvashadha and Poorvabhadra. There must be Tarabala also. Chandrashtamas should be avoided. Tuesday, Wednesday and Thursday are good. The 4th, 8th, 9th, 14th and New Moon days should be avoided"' },
    AGARWAL: { ...AGARWAL_GS, pageLocus: '"Taking first bath after prolonged illness", printed p.329 (PDF 328): "Days: Sunday, Tuesday, Wednesday, Thursday. Tithis: all except 1, 4, 8, 9, 14, 30. Nakshatras: all 3 Poorvas, Bharni, Krittika, Aridra, Mrigashira, Pushya, Chitra, Hasta, Aswini, Moola, Vishakha. Avoid chandrashtama"' },
  },
  OLD_HOUSE: {
    RAMAN: { ...RAMAN_BV, pageLocus: 'Chapter XII "House Building", PDF p.46: "Removing to Another House. - This can be done when the usual Tarabala and Chandrabala are present, one\'s birth constellation would be propitious. Monday, Wednesday, Thursday and Friday are favourable. Saturday, Sunday and Tuesday should be rejected as also Riktha tithis or negative lunar days. If the house is taken for a purpose other than residential, then strengthen the Bhava or house denoting the purpose. Thus if the house is taken for investment purposes, see that the 11th house is strongly disposed. In any case an auspicious lunar day, a favourable constellation and a good weekday are very necessary"' },
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§27.16 "Entering into house", printed pp.732-733 (PDF 766-767): "b) entry into an old house (rented, repaired, or reconstructed house destroyed in fire / flood / lightening / cyclone etc.) … For entry into old houses defined above, lunar months of Margshirsha, Karttika, Shravana; asterisms of Shatbhish, Pushya, Swati, Dhanishta are beneficial (M.C). B.S. commends that asterisms of Chitra, 3 Uttras, Rohini, Mrigshira, Anuradha, Dhanishta, Shatbhish & Revati bestow longevity, wealth, health, fame, sons & grandsons … Exponents opine that maleficence due to combustion of Jupiter & Venus, their Baal & Vridh Avasthas, Jupiter in Leo are not considered in entry into an old house … Although in all types of houses Uttrayana is auspicious, but entry into such houses can be made in Dakshinayana. M.G. recommends that asterisms of Dhanishta, Shatbhish, Pushya, 3 Uttras, Rohini, Mrigshira, Chaitra, Swati & Anuradha are auspicious in entry into an old house"' },
    JOSHI: { ...JOSHI_KK, pageLocus: '"For entering in to an old house", printed p.124 (PDF 139): "For entering in to a old house (i.e. purchased house, rented house or repaired house) Vaishakh, Jyestha, Magha, Falguna, Margsheersha, Kartika and Shravana months (lunar) are considered auspicious. There is no need to consider combustor of Jupiter and Venus and Jupiter\'s placement in LEO or CAPRICORN. All other considerations regarding tithi, nakshatra, lagna etc. are similar to those of entering in to a new house. In addition to the nakshatras stated for entry in to new house. Shatbhisha, Pushya, Swati and Dhanistha nakshatras can also be chosen for entry in to an old house"' },
    WILHELM: { ...WILHELM_E, pageLocus: '"House/Buildings — Entering an old dilapidated house", printed p.246 (PDF 254): "If the house is old and dilapidated such that there is concern of fire or other disasters the following should be adhered to: Masa: The months stated above for ENTERING A NEW HOUSE as well as Karttika, Margasira and Sravana are favorable. Nakshatra: The Nakshatras stated above for ENTERING A NEW HOUSE as well as Pushya, Svati, Dhanishtha and Satabhisha are favorable. Miscellaneous: Unlike ENTERING A NEW HOUSE, no consideration need be given the combustion and afflictions of Jupiter and Venus. Other factors are the same as ENTERING A NEW HOUSE above"' },
    MUHURTA_CHINTAMANI: { ...MC_SHARMA, pageLocus: 'Chapter 13 sloka 2, printed p.314 (PDF 318): "जीर्णे गृहेऽग्न्यादिभयान्नवेऽपि मार्गोर्जयोः श्रावणिकेऽपि सत्स्यात् । वेशोऽम्बुपेज्यानिलवासवेषु नावश्यमस्तादिविचारणात्र ॥२॥" — "Entering an old, dilapidated, newly constructed house because of the fear of fire etc. is excellent or auspicious in the months stated above and in the month of Kartika, Margashirsha, and Shravana, and in the Nakshtras of Shatabhisha, Pushya, Swati and Dhanishtha also, and no consideration should be made of the combustion of Jupiter and Venus when entering an old, dilapidated house"' },
    AGARWAL: { ...AGARWAL_GS, pageLocus: '"Entering an old house", printed p.326 (PDF 325): "Above muhurtas plus months Shravana, Kartika, Margashirsha. Nakshatras, Satbhisha, Pushya, Swati, Dhanishta"' },
  },
  MEDICINE: {
    AGARWAL: { ...AGARWAL_GS, pageLocus: 'Classification of nakshatras, printed pp.298-299 (PDF 297-298): "3. Aggressive, cruel uggara, karoora Poorvaphalguni, Poorvashada, Poorvabhadra, Bharani, Magha … Suitable for killing, cheating, works involving use of fire, theft, poisoning, research on poisonous medicines, purchase sale and use of arms, surgical operations, obtaining licence of a gun etc, administering medicine, ignite, vandalism and violent acts"; "4. Mixed & ordinary … Vishakha and Krittika … Good for fire works, welding, melting, gas works, fabrications, preparing medicines …"' },
    WILHELM: { ...WILHELM_E, pageLocus: '"Medical- Treatment of disease & taking medicine", printed pp.275-277 (PDF 283-285): "Nakshatra: Asvini, Mrigasira, Punarvasu, Pushya, Hasta, Chitra, Svati, Anuradha, Sravana, Dhanishtha, Satabhisha and Revati are favorable. Muhurta Chintamani also considers Mula as favorable while Kalaprakasika also considers Rohini, Uttaraphalguni, Uttarashadha and Uttarabhadrapada as favorable, which all of these can be taken as mediocre. Tara: Particularly avoid the Janma Nakshatra. Tithi: Particularly avoid the 4th, 9th, 14th and Amavasya. Vara: The Varas of the Sun, Moon, Mercury, Jupiter and Venus are favorable. Lagna: Dual Rasis with a benefic are best. Bhavas: There should be no planets in 7th, 8th and 12th"; also blood-letting (p.269), dental cleaning (p.272), laxatives (p.273)' },
    RAMAN: { ...RAMAN_BV, pageLocus: 'Chapter XV "Medical Elections", PDF pp.52-53: "Beginning Treatment. - If one is suffering from a chronic disease, the treatment should begin under Aswini, Rohini, Mrigasira, Punarvasu, Pushyami, Uttara, Uttarashadha, Uttarabhadra, Hasta, Chitta, Swati, Anuradha, Sravana, Dhanishta, Satabhisha, and Revati … In regard to long-standing diseases or recurrent fevers, the best time for taking medicine is Monday, Wednesday, Thursday and Friday, coinciding with Hasta, Aswini, Chitta and Punarvasu respectively and especially at the time when the Moon, Mercury, Jupiter and Venus occupy their own vargas and a moveable Rasi or Amsa is rising"' },
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§22.3 "Administration of medicine", printed p.603 (PDF 640): "Tithi: a benefic Tithi other than Rikta. J.V. commends that Nanda & Poorna Tithis are suitable, especially when the Moon is Full. Day: Monday, Wednesday, Thursday & Friday. J.V. recommends Sunday also, but not Wednesday in the above list. Const.: Small (Hasta, Ashvani, Pushya), Sweet (Mrigshira, Chitra, Anuradha, Revati), Movable (Punarvasu, Swati, Shravana, Shatbhisha, Dhanishta) & Moola (M.C.) K.P. recommends Fixed (Rohini, 3 Uttras) in addition to the above asterisms; but directs to avoid Janma Nakshatra. Ascendant: Common signs are the best. J.V. recommends odd signs. Ascendant should be occupied by benefic including the Moon. 7, 8 & 12th houses should be vacant"' },
    MUHURTA_CHINTAMANI: { ...MC_SHARMA, pageLocus: 'Chapter 2 sloka 15, printed p.57 (PDF 61): "भैषज्यं सल्लघुमृदुचरे मूलभे द्व्यङ्गलग्ने शुक्रेन्द्विज्ये विदि च दिवसे चापि तेषां रवेश्च । शुद्धे रिःफद्युनमृतिगृहे सत्तिथौ नो जनर्क्षे …" — "At the time when the patient takes the First Dose of a medicine there should be the Nakshtras called Laghu, Mridu and Chara and the Nakshtras of Moola; there should be the presence of the benefic planets like Venus, the Moon, Jupiter and Mercury in the Ascendant of Dual Nature (3/6/9/12) and there should be no planet in the 12/7/8 Houses from the Ascendant; and there should be the day of Friday, Monday, Thursday, Wednesday and Sunday and any Tithis leaving the tithis called Rikta and Amavasya. It is inauspicious to take medicine in the Nakshtra of one\'s own birth"' },
    KALYANRAMAN: { ...KALYANRAMAN_V2, pageLocus: '"Taking Medicines", printed pp.201-202 (PDF 203-204): "Nakshatra Abhijith, Aswini, Mrigasira, Punarvasu, Pushyami, Hasta, Chitra, Swati, Anuradha, Moola, Sravana, Dhanishta, Satabhisha, Revati (13+1) … Tithis 1/2/3/5/7/10/11/13. Weekdays Monday, Wednesday, Thursday, Friday. Notes: Muhoortha Chintaamani admits Sunday also. It wants to avoid Janma Nakshatra - Rikta tithis and Amavasya. It prefers benefic like Venus, the Moon, Jupiter, Mercury in the ascendant of dual nature (3/6/9/12) with no planet in 12/7/8 houses from the ascendant"' },
    JOSHI: { ...JOSHI_KK, pageLocus: 'Chapter 13 "For taking medicines", printed pp.146-147 (PDF 161-162): "Nakshatras: All short nakshatras (i.e. Hasta, Ashwini, Pushya and Abhijit), all friendly nakshatras (i.e. Mrigshira, Revati, Chitra and Anuradha) all movable nakshatras (i.e. Swati, Punarvasu, Shravana, Dhanistha and Shatbhisha) and Moola nakshatras are considered auspicious for taking medicines. Tithis: 1/2/3/5/7/10/11/13 tithis. Days: Monday, Wednesday, Thursday and Friday. Lagnas: Lagnas of dual signs (3/6/9/12 rashis) occupied by benefics with no planet placed in 7th, 8th and 12th house. Combinations of long life if present will be an additional advantage. Always avoid Janma nakshatra for taking medicine"' },
    VASHISTHA: { ...VASHISTHA_KUSUM, pageLocus: '"Aushadh-Sevana muhurta (Time for taking medicine)", printed p.133 (PDF 120): "Tithi — 1 (krishna paksha), 2, 3, 5, 7, 10, 11 and 12 (shukla paksha); Vara — Sunday, Monday, Wednesday, Thursday and Friday; Nakashatra — Ashwini, Krittika, Rohini, Mrigashirsha, Punarvasu, Pushya, Magha, all the 3 uttaras, Hasta, Chitra, Swati, Vishakha, Anuradha, Jyeshtha, Moola, Sravana, Dhanishtha, Shatabhisha, Revati; Lagna — 3, 6, 9, 12. Lagna, saptama, ashtama and dwadasha (12) bhavas should be free of affliction … Note: For taking treatment Amrit yoga, 1, 4, 7, 10, 6, 7, 8 and 12 bhavas, unblemished in transit, Jupiter should be auspicious, tara shuddhi from natal Moon are recommended. Leave Bhadra"' },
    RANGACHARYA: { ...RANGACHARYA_I, pageLocus: '"Medical matters", printed pp.132-133 (PDF 140-141): "For taking medicine, the movable the light and the soft asterisms and Moola are commended. Never begin taking the medicine in your janma Nakshatra. Prefer the dual lagnas. The placement of venus, Moon Jupiter or Mercury is most preferred. Sunday-Monday, Wednesday and Friday are good. The 6th and 12th house should lie vacant. Take medicine in the auspicious tithis. Never begin taking medicine on Sunday and Tuesday"' },
  },
  SURGERY: {
    JOSHI: { ...JOSHI_KK, pageLocus: 'Chapter 2 "Basic Components of Muhurta", printed p.10 (PDF 25): "(3) Ugra-Kroora (Aggressive Cruel) Poorvaphalguni, Poorvashada, Poorva bhadrapad, Bharani, Magha, and Tuesday are aggressive in nature and suitable for killing, cheating, works involving use of fire, theft, poisoning, research on poisonous medicines, purchase sale and use of arms, surgical operations, obtaining licence of a gun etc."' },
    AGARWAL: { ...AGARWAL_GS, pageLocus: 'Classification of nakshatras, printed pp.298-299 (PDF 297-298): "3. Aggressive, cruel uggara, karoora Poorvaphalguni, Poorvashada, Poorvabhadra, Bharani, Magha … Suitable for killing, cheating, works involving use of fire, theft, poisoning, research on poisonous medicines, purchase sale and use of arms, surgical operations, obtaining licence of a gun etc, administering medicine, ignite, vandalism and violent acts"' },
    WILHELM: { ...WILHELM_E, pageLocus: '"Medical- Surgery (including oral surgery, pulling & drilling teeth)", printed pp.273-274 (PDF 281-282): "In addition to what is given below for TREATMENT OF DISEASE … Nakshatra: Ardra, Aslesha, Jyeshtha and Mula are particularly favorable, followed by Krittika. Tara: Not only should the Janma Nakshatra particularly be avoided, it is best if the Moon is not in the same Rasi as the natal Moon. Tithi: Rikta Tithis (4th, 9th and 14th) are particularly favorable, followed by the 3rd and 13th … Avoid Purnima and the other generally unfavorable Tithis (6th, 8th, 12th and Amavasya). Vara: The Varas of Mars and Saturn are particularly favorable, though Varas other than that of the Sun are quite acceptable. Lagna: Aries, Taurus, Cancer and Virgo are most favorable. Bhavas: The 8th must be unoccupied … Grahas: Mars should be favorable and not influenced by Saturn"; cosmetic surgery, p.275' },
    RAMAN: { ...RAMAN_BV, pageLocus: 'Chapter XV "Medical Elections", PDF p.53: "Surgical Operations. - When possible, operate in the period of the intrease [sic] of the Moon. Never operate at the exact time of the Full Moon … Let not the Moon at the time of the operation be in the same sign as at birth … For surgical operations Tuesday or Saturday is recommended. Mars must be powerful. The 8th house should be unoccupied. And the ruling constellation is Aridra, Jyeshta, Aslesha or Moola coinciding with the 4th, 9th or 14th lunar day … Mutual aspects between Mars and Saturn should be avoided"' },
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§22.4 "Surgery", printed pp.604-605 (PDF 641-642): "B.J.S recommends Hasta, Chitra, Swati, Ashvani, Pushya, Shatbhisha, Rohini, Mrigshira, Shravana, Anuradha & Jyeshta are the best. However K.P recommend that surgery & other external treatments are beneficial in Sharp asterisms (Jyeshta, Ardra, Ashlesha, Moola); on Rikta Tithis; on Tuesday or Sunday, when Mars is powerful. 8th house should be unoccupied. Rising signs should be Aries, Taurus, Cancer or Virgo … The Moon should not be in 4th or 8th or 12th from J.R. Tara should be benefic & avoid Vinashika Tara. The rising sign should not be in 8th from J.R. or Janma Lagna. Planets should not be Ghaata in transit. The rising sign should be benefic having aspects of Jupiter & the Moon"' },
    VASHISTHA: { ...VASHISTHA_KUSUM, pageLocus: '"Shalyakarma muhurta (Surgery muhurta)", printed p.133 (PDF 120): "Tithi — 4, 9, 14 Shukla specially good (Rikta tithis); Vara — Sunday, Tuesday and Thursday; Nakshatra — Ashwini, Mrigashirsha, Punarvasu, Hasta, Swati, Anuradha, Jyeshtha, Sravana and Shatabhisha. Note: For taking treatment Amrit yoga, 1, 4, 7, 10, 6, 7, 8 and 12 bhavas, unblemished in transit, Jupiter should be auspicious, tara shuddhi from natal Moon are recommended. Leave Bhadra"' },
    KALYANRAMAN: { ...KALYANRAMAN_V2, pageLocus: '"Performing Surgery", printed p.203 (PDF 205): "Nakshatra Aswini, Aridra, Aslesha, Makha, Jyeshta, Moola (6) … Tithis 1/2/3/5/6/7/8/10/11/12/13/15. Weekdays Sunday, Monday, Tuesday, Wednesday, Thursday, Friday"' },
    RANGACHARYA: { ...RANGACHARYA_I, pageLocus: '"Medical matters", printed p.133 (PDF 141): "Surgical operation should be done on Tuesday or Sunday, when the 8th house is vacant and the 6th house is occupied by malefics, the sun and Moon should be in the kendras"' },
  },
  VEHICLE: {
    AGARWAL: { ...AGARWAL_GS, pageLocus: 'Classification of nakshatras, printed pp.298-299 (PDF 297-298): "2. Movable chara, chala Swati, Punarvasu, Shravana, Dhanishtha, Satabhisha … Good for riding on vehicles, horses, elephants, starting of factory/machinery/vehical (wherever motion is profitable). All acts mentioned in Short and Dynamic nakshatras can also be done in diese nakshatras"; "5. Short and dynamic kshipra, laghu Hasta, Aswini, Pushya, Abhijit … Suitable for construction & starting a shop, selling, sex. starting education, making and wearing ornaments, fine arts, learning & display of arts etc., travelling, dancing, singing, acting, beauty parlours. All acts mentioned in movable nakshatras can also be done in these nakshatars"; "Straight or side looking Mrigshira, Revati, Chitra, Anuradha, Hasta, Swati, Punarvasu, Aswini and Jyestha are suitable for riding, driving, journey, construction of roads, buying pets, departure"' },
    MUHURTA_CHINTAMANI: { ...MC_SHARMA, pageLocus: 'Chapter 2 sloka 4, printed p.50 (PDF 54): "The Nakshtras Swati, Punarvasu, Shravana, Dhanistha, Satbhisha and the day of Monday-these are called Chara and Chala. In these Nakshtras and on this day such things as riding an elephant etc. walking in a garden and things which are too be done in the Nakshtras called Laghu may be auspiciously performed"; sloka 9 notes, printed p.53 (PDF 57): "And Anuradha, Hasta, Swati, Poonarvasu, Jyestha and Ashwini, these are called Tiryaka Mukha Nakshtras … In these Nakshtras it is auspicious to make purchases of elephant, horse, camel, ox etc. and to train them. Ploughing, … learning to drive motor bus …"' },
    JOSHI: { ...JOSHI_KK, pageLocus: 'Chapter 2 "Basic Components of Muhurta", printed pp.9-11 (PDF 24-26): "(2) Char-Chala (Movable) Swati, Punarvasu, Shravana, Dhanishtha Satbhisha and Monday are movable in nature. All movable activities like riding on vehicles, horses, elephants and journeys and any other act needing motion can be done in these nakshatras"; "(5) Kshipra - Laghu … Hasta, Ashwini, Pushya, Abhijit and Thursday … All acts done under Char-Chala (Movable) nakshatras can also be done in these"; "(iii) Tiryang-Mukha … Mrigshira, Revati, Chitra, Anuradha, Hasta, Swati, Punarvasu, Ashwini and Jyestha are facing straight and are suitable for riding, driving, journey"; p.25 (PDF 40): "chose movable signs (1/4/7/10 rashis) for activities needing motion e.g., journey, riding, driving, starting business and so on"' },
    RAMAN: { ...RAMAN_BV, pageLocus: 'Chapter IV "Influence of Constellations", PDF p.9: "Saravana, Dhanishta, Satabhisha, Punarvasu and Swati are movable stars and they are auspicious for acquiring vehicles, for gardening and for going on procession"' },
    RANGACHARYA: { ...RANGACHARYA_I, pageLocus: '"Kinds of tithis", printed p.6 (PDF 14): "2) BHADRA [2nd, 7th, 12th] Upanayana, marriage, wearing of ornaments, activities connected with vehicles"; "Kinds of asterisms", printed pp.17-18 (PDF 25-26): "(2) MOVABLE : Punarvasu, Swati, Sravana, Dhanishtta, Satabhisha --favoured for vehicle-drive …"; "(4) LIGHT : Aswini, Pushyami, Hasta, Abhijit - for the activities mentioned for the movable asterisms …"; "(10) OBLIQUE : Aswini, Mrigasira, Punarvasu, Hasta, Chitra, Swati, Anuradha, Jyeshtta and Revati - for ploughing, driving motor cycles., air-travel, water-journey etc."' },
    WILHELM: { ...WILHELM_E, pageLocus: '"Vehicles- Driving", printed pp.328-329 (PDF 336-337): "The first time that one drives a particularly type of vehicle as well as the first time one drives a new vehicle are important and a favorable Muhurta should be selected. Nakshatra: Asvini, Rohini, Mrigasira, Punarvasu, Magha, Uttaraphalguni, Hasta, Chitra, Svati, Anuradha, Uttarashadha, Sravana, Uttarabhadrapada and Revati are favorable. Pushya, Visakha and Dhanishtha are middling. Tithi: The 2nd, 3rd, 5th, 7th, 10th, and 12th are favorable. Avoid the 1st, 4th, 6th, 9th, 11th, 14th and 15th. The 13th is middling. Vara: Avoid the Varas of the Sun and Mars. Saturn\'s Vara is middling. Other Varas are favorable. Lagna: Taurus, Gemini, Cancer, Virgo and Libra are favorable. Capricorn is middling. The Lagna being the Rasi of the natal Moon is also quite favorable. Navamsa: The Navamsas of Mercury, Jupiter, and Venus are most favorable. Combinations: Venus in an angle or trine, in own, exaltation or friendly Rasi is very favorable"' },
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§25.5 "Chariot - transport works", printed pp.684-685 (PDF 719-720): "In Small (Hasta, Ashvani, Pushya, Abhijit), Movable (Punarvasu, Swati, Shravana, Shatbhish, Dhanishta), Sweet (Mrigshira, Chitra, Anuradha, Revati), Rohini, Jyeshta, Vishakha; on benefic weekdays (including Sunday); Jaya, Nanda & Pooma Tithis; in rising signs ruled by Mercury, Jupiter & Venus; all types of works related to chariot are benefical. B.J.S recommends the above asterisms along with benefic days especially Sunday as auspicious for starting automotive vehicles & man driven devices (Rikshaw)"; Poorna tithis "5th, 10th, 15th & 30th … Though 30th is a Poorna Tithi in technical terms, it is not recommended for the above elections", p.29' },
    VASHISTHA: { ...VASHISTHA_KUSUM, pageLocus: '"Muhurta for Driving and Buying a New Vehicle", printed p.136 (PDF 123): "Tithi — 2, 3, 5, 6, 7, 8, 10, 11, 12 and 13 of both the pakshas; pratipada of krishna pakasha and poornima are good. Nakashatra — Ashlesha, Mrigashirsha, Punaravasu, Pushya, Hasta, Chitra, Swati, Sravana, Dhanishtha, Shatabhisha, Revati, Anuradha and Rohini. Vara — Sunday, Monday, Wednesday, Thursday and Friday. Lagna — Chara or dwiswabhava (1, 4, 7, 10, 3, 6, 9 and 12) Moon and Venus strong, unafflicted 4th house, the vehicle owner\'s name has importance, 8th house should be vacant"' },
    KALYANRAMAN_BUY: { ...KALYANRAMAN_V2, pageLocus: '"Training or Riding Horses, Getting Trained in Riding of Houses, Selling, Purchasing Conveyances, Getting Trained in driving Conveyances, Learning Driving", printed p.186 (PDF 188): "Nakshatra Aswini, Mrigasira, Punarvasu, Pushyami, Hasta, Swati, Dhanishta, Satabhisha and Revati. (9) Tithis 1/2/3/5/6/7/8/10/11/12/13/15 Weekdays Sunday, Monday, Wednesday, Thursday, Friday, Saturday. Notes: Ensure Chandra Suddhi and Tara Suddhi. Avoid Tuesday and Rikta tithis"' },
    KALYANRAMAN: { ...KALYANRAMAN_V2, pageLocus: '"Driving New Vehicles", printed p.242 (PDF 244): "Nakshatra Aswini, Krittika, Rohini, Mrigasira, Aridra, Makha, Uttaraphalguni, Hasta, Chitra, Swati, Anuradha, Moola, Poorvashada, Uttarashada, Dhanishta, Poorvabhadrapada, Uttarabhadrapada and Revati. (18) … Tithis 1/2/3/5/6/7/8/10/11/12/13/15 Weekdays Sunday, Monday, Wednesday, Thursday, Friday"' },
  },
  VEHICLE_MAKE: {
    JOSHI: { ...JOSHI_KK, pageLocus: '"For acts relating to vehicles (i.e. manufacturing trading etc)", printed p.107 (PDF 122): "All short nakshatras (Hasta, Ashwini, Pushya and Abhijit), all movable nakshatras (i.e. Swati, Punarvasu, Shravana, Dhanistha and Shatbhisha), all friendly nakshatras (Mrigshira, Revati, Chitra and Anuradha), Rohini, Jyestha and Vishakha nakshatras; Nanda, Jaya and Pooma tithis (i.e. 1/6/11/3/8/13/5/10/15 tithis), Sunday and ascendent of 2/3/6/7/9/12 rashis are good for all acts or businesses relating to vehicle"' },
    KALYANRAMAN: { ...KALYANRAMAN_V2, pageLocus: '"Manufacturing, Sale or Purchase of Vehicles, Doing Business Connected with Vehicles", printed p.189 (PDF 191): "Nakshatra Abhijith, Aswini, Rohini, Mrigasira, Punarvasu, Pushyami, Hasta, Chitra, Swati, Visaka, Anuradha, Jyeshta, Sravana, Dhanishta, Satabhisha, Revati, (15+1) … Tithis 1/6/11/3/8/13/5/10/15 Nanda- 1/6/11 Jaya- 3/8/13 Poorna- 5/10/15/30 Weekdays Sunday. Notes: Prefer Ascendant of raasis 2, 3, 6, 7, 9 or 12"' },
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§25.5 "Chariot - transport works", printed p.684 (PDF 719): "In Small (Hasta, Ashvani, Pushya, Abhijit), Movable (Punarvasu, Swati, Shravana, Shatbhish, Dhanishta), Sweet (Mrigshira, Chitra, Anuradha, Revati), Rohini, Jyeshta, Vishakha; on benefic weekdays (including Sunday); Jaya, Nanda & Pooma Tithis; in rising signs ruled by Mercury, Jupiter & Venus; all types of works related to chariot are benefical"' },
    WILHELM: { ...WILHELM_E, pageLocus: '"Vehicles- Manufacturing", printed p.329 (PDF 337): "Nakshatra: Asvini, Rohini, Mrigasira, Punarvasu, Pushya, Hasta, Chitra, Svati, Visakha, Anuradha, Jyeshtha, Sravana, Dhanishtha, Satabhisha and Revati are favorable. Tithi: The 1st, 3rd, 5th, 6th, 10th, 11th and 13th are most favorable. The 2nd, 7th and Purnima are middling. Lagna: Taurus, Gemini, Virgo, Libra, Sagittarius and Pisces are favorable"' },
  },
  NEW_CLOTHES: {
    AGARWAL: { ...AGARWAL_GS, pageLocus: 'Classification of nakshatras, printed pp.298-299 (PDF 297-298): "6. Gentle friendly mridu, maitri Mrigshira, Revati, Chitra, Anuradha … Good for all auspicious ceremonies, 16 samskaras, start of occupation/service/business, singing, learning, music, making & wearing clothes, playing, learning game, making friends, making & wearing ornamnets … All acts mentioned in Fixed and Constant nakshatras can also be done in these nakshatras"; "A. 1. Fixed sthira (constant) Utlaraphalguni, Uttarashada, Uttarabhadra, Rohini … Good for coronation, foundation laying, digging a well, house building, upnayana, nagar or graha pravesha, agriculture or horticulture, starting service, etc. and All acts mentioned in Gentle and Friendly nakshatras can also be done in these"' },
    VASHISTHA: { ...VASHISTHA_KUSUM, pageLocus: 'Tithi uses (after Piyooshdhara), printed pp.42-44 (PDF 29-31): "(vi) Shashthi All auspicious works related to war, shilpa, vastu, ornaments, dresses …"; "(x) Dashami … vastra, ornaments …"; "(xiii) Trayodashi (Shukla Paksha) … wearing of new clothes and jewellery etc. are all suitable"; "(xvi) Amavasya (30) … auspicious works and cohabitation should not be done"; p.46 (PDF 33): "(i) Nanda (Lord Venus) One can use new clothes …"; weekdays, printed pp.54-55 (PDF 41-42): Sunday "… wearing of new clothes etc.", Thursday "… wearing of new clothes …", Friday "… wearing of new clothes and ornaments …"; nakshatras, printed pp.56-58 (PDF 43-45): "Dhruva (fixed) nakshatra … new clothing …"; "Mridu … Wearing of new clothes …"; "Teekshna or daruna … wearing of new clothes and ornaments are permissible"' },
    RAMAN: { ...RAMAN_BV, pageLocus: 'Chapter X "Elections Concerning General Matters", PDF p.36: "Wearing New Clothes. - Aswini, Rohini, Punarvasu, Pushyami, Uttara, Hasta, Chitta, Swati, Visakha, Dhanishta and Revati are the best. Monday, Wednesday, Thursday and Friday are good. Sunday is middling. Tuesday and Saturday are inauspicious. The 4th, 9th, 14th lunar days and New Moon day should be avoided. The Moon should be as far as possible in good aspect to the Sun"' },
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§19.14.1 "Wearing of new clothes", printed pp.561-562 (PDF 599-600): "Tithi: 2,3,5,7,10,11 & 13 are the best Tithis. Rikta (4,9,13) Tithis & the New Moon day should be avoided. Day: Wednesday, Thursday & Friday are the best; & their lords\' amshas are benefic. Sunday & Monday are middling; avoid Sunday & Tuesday … Const.: Stationary (Rohini, 3 Uttras), Small (Hasta, Ashvani, Pushya), Punarvasu, Chitra, Swati, Vishakha, Anuradha, Dhanishta & Revati, are the most felicitous … Ascendant: 2,3,6,7,11 & 12 are suitable, balance be rejected … New clothes should not be worn by wife when the Moon is transiting 4,8,12 places from the husband\'s J.R."' },
    WILHELM: { ...WILHELM_E, pageLocus: '"Clothes- Wearing, new", printed pp.216-217 (PDF 224-225): "Nakshatra: Asvini, Rohini, Punarvasu, Pushya, Uttaraphalguni, Hasta, Chitta, Svati, Visakha, Anuradha, Uttarashadha, Dhanishtha, Uttarabhadrapada and Revati are favorable; the remaining are unfavorable. For Women: Additionally, it is not considered favorable by some authorities for a married woman to wear clothes under Rohini, Punarvasu, Pushya, Uttaraphalguni, Uttarashadha or Uttarabhadrapada … Tithi: The 2nd, 3rd, 5th, 7th, 10th, 11th, and 12th are best. The 4th, 9th, 14th, and Amavasya should be strictly avoided, other Tithis are middling. Vara: The Varas of Mercury, Jupiter and Venus are best, the Sun and Moon\'s are middling … Lagna: Taurus, Gemini, Cancer, Virgo and Libra are favorable. Capricorn is middling. The Lagna being the Rasi of the natal Moon is also quite favorable … Navamsa: The Navamsa of Mercury, Jupiter, and Venus are most favorable"' },
    KALYANRAMAN: { ...KALYANRAMAN_V2, pageLocus: '"Getting new clothes and Ornaments, Preparing and Wearing them", printed pp.237-238 (PDF 239-240): "Nakshatra (Abhijith included) Abhijith Aswini, Rohini, Punarvasu, Pushyami, Uttaraphalguni, Hasta, Chitra, Swati, Visaka, Anuradha, Uttarashada, Dhanishta, Uttarabhadrapada and Revati. (14+1) … Tithis 1/2/3/5/6/7/8/10/11/12/13/15 Weekdays Sunday, Monday, Thursday, Friday. Notes: … 4. Kaalaprakaasika admits only tithis 2/3/5/7/10/11/13 and says 4/9/14 and Amavasya to be strictly avoided. Sunday and Monday are held as mediocre. However, Wednesday is admitted. It wants to avoid raasis Lagnas: Aries, Leo, Scorpio, Sagittarius Aquarius and Pisces … 6. Malefic Tithi-vaara-nakshatra Yogas must be avoided and Chandra Suddhi and Tara Suddhi must be ensured"' },
    MUHURTA_CHINTAMANI: { ...MC_SHARMA, pageLocus: 'Chapter 2 sloka 10, printed pp.53-54 (PDF 57-58): "पौष्ण्याश्विकरपञ्चकवासवेज्यादित्ये प्रवालरदशंखसुवर्णवस्त्रम् । धार्यं विरिक्तशनिचन्द्रकुजेऽह्नि न रक्तं भौमे ध्रुवादितियुगे सुभगा न दध्यात् ॥१०॥" — "Revati, the Nakshtras called Dhruwa, Ashwini, Hasta, Chitra, Swati, Vishakha, Anuradha, Dhanishtha, Pushya and Punarvasu Nakshtras, the Rikta Tithis (4/9/14), the days of Saturday, Monday and Tuesday — in the Nakshtras tithis and days except these … it is not proper to wear Coral, things made of tusk (elephant teeth), Sankha, gold and clothes … in the Nakshtras called Dhruwa, Punarvasu and Pushya, a woman whose husband is living should not wear new clothes. To wear red clothes Tuesday has been considered to be auspicious"' },
    JOSHI: { ...JOSHI_KK, pageLocus: 'Chapter 13 "Wearing clothes and ornaments", printed p.146 (PDF 161): "Nakshatras: All fixed nakshatras (i.e. Uttaraphalguni, Uttarashada, Uttarabhadrapad and Rohini), all short nakshatras (i.e. Hasta, Ashwini, Pushya and Abhijit), Revati, Chitra, Anuradha, Swati, Punarvasu, Dhanistha and Vishakha nakshatras. Tithis: Avoid Rikta tithis and Amavasya. Days: Sunday, Monday, Thursday and Friday are considered auspicious. Yogas: Avoid Vyatipaat and Vaidhriti yogas. One should also avoid Bhadra and malefic yogas formed by tithi-vaar-nakshatra. Proper Chandra/Tara Shuddhi is necessary. A married women should not wear new clothes or ornaments on Sunday and in Uttaraphalguni, Uttarashada, Uttarabhadrapad Rohini, Punarvasu and Pushya nakshatras"' },
    RANGACHARYA: { ...RANGACHARYA_I, pageLocus: '"Wearing new clothes", printed p.131 (PDF 139): "Hasta, Chitra, Swati, visakha, Anuradha, Dhanishtta and Revati are good for women, and for men those asterisms and Pushyami, Aswini, Uttara, Uttarashada and Uttarabhadra, Punarvasu and Rohini are good. Sunday, Wednesday, thursday and Friday are good"' },
  },
  NEW_ORNAMENTS: {
    AGARWAL: { ...AGARWAL_GS, pageLocus: 'Classification of nakshatras, printed pp.298-299 (PDF 297-298): "5. Short and dynamic kshipra, laghu Hasta, Aswini, Pushya, Abhijit … Suitable for construction & starting a shop, selling, sex. starting education, making and wearing ornaments, fine arts, learning & display of arts etc., travelling, dancing, singing, acting, beauty parlours. All acts mentioned in movable nakshatras can also be done in these nakshatars"; "6. Gentle friendly mridu, maitri Mrigshira, Revati, Chitra, Anuradha … Good for all auspicious ceremonies, 16 samskaras, start of occupation/service/business, singing, learning, music, making & wearing clothes, playing, learning game, making friends, making & wearing ornamnets … All acts mentioned in Fixed and Constant nakshatras can also be done in these nakshatras"; "2. Movable chara, chala Swati, Punarvasu, Shravana, Dhanishtha, Satabhisha … Good for riding on vehicles, horses, elephants, starting of factory/machinery/vehical (wherever motion is profitable). All acts mentioned in Short and Dynamic nakshatras can also be done in diese nakshatras"; "A. 1. Fixed sthira (constant) Utlaraphalguni, Uttarashada, Uttarabhadra, Rohini … Good for coronation, foundation laying, digging a well, house building, upnayana, nagar or graha pravesha, agriculture or horticulture, starting service, etc. and All acts mentioned in Gentle and Friendly nakshatras can also be done in these"' },
    VASHISTHA: { ...VASHISTHA_KUSUM, pageLocus: 'Tithi uses (after Piyooshdhara), printed pp.41-44 (PDF 28-31): "(ii) Dwiteeya Marriage, travel, bhushan (ornaments) …"; "(iii) Triteeya … abhushan-related works … purchase and use of jewellery are permissible"; "(v) Panchami … all the works that are permissible on dwiteeya and triteeya can be performed on this tithi"; "(vi) Shashthi … ornaments, dresses …"; "(vii) Saptami … making of ornaments and wearing them …"; "(x) Dashami … vastra, ornaments …"; "(xiii) Trayodashi (Shukla Paksha) … wearing of new clothes and jewellery"; "(xv) Poornamasi Shilpa, ornaments …"; "(xvi) Amavasya (30) … auspicious works … should not be done"; p.46 (PDF 33): "(ii) Bhadra … making of ornaments and their use"; weekdays, pp.54-55 (PDF 41-42): Monday "Making and wearing of ornaments", Thursday "purchase and sale of ornaments … donning of new ornaments", Friday "wearing of new clothes and ornaments"; nakshatras, pp.56-58 (PDF 43-45): Dhruva "making and wearing of ornaments", Chara "getting gold, silver and gem jewellery", Kshipra "using and purchasing ornaments", Teekshna "wearing of new clothes and ornaments are permissible"' },
    RANGACHARYA: { ...RANGACHARYA_I, pageLocus: '"Kinds of tithis", printed p.6 (PDF 14): "2) BHADRA … Upanayana, marriage, wearing of ornaments, activities connected with vehicles"; p.10 (PDF 18): "11th Temple activities, house construction, preparation of liquors, travel wearing new clothes and ornaments etc."; "13th All auspicious activities mentioned above, but oilbath, wearing new clothes and ornaments and yajnopaveeta dharana are prohibited"; "Kinds of asterisms", pp.17-18 (PDF 25-26): "(1) FIXED : Rohini, Uttara, Uttarashada, Uttarabhadra favourable for the seed-sowing, wearing new clothes, and ornaments …"; "(6) SHARP : Ardra, Aslesha, Moola and Jyeshtta - for … wearing gold ornaments …"' },
    RAMAN: { ...RAMAN_BV, pageLocus: 'Chapter IV "Influence of Constellations", PDF p.9: "Aswini, Pushya, Hasta and Abhijit are light constellations, and they can be selected for putting ornamentation, pleasures and sports, administering medicine, starting industries and undertaking travels"' },
    KALYANRAMAN: { ...KALYANRAMAN_V2, pageLocus: '"Making and Wearing new Ornaments", printed pp.235-236 (PDF 237-238): "Nakshatras Abhijith, Aswini, Rohini, Punarvasu, Pushya, Uttaraphalguni, Hasta, Swati, Uttarashada, Sravana, Dhanishta, Satabhisha, Uttarabhadrapada. (12+1) … Tithis Avoid Rikta tithis and Amavasya. Weekdays Monday, Wednesday, Thursday, Friday. Avoid Tuesday, Saturday, Sunday mediocre. Yoga Avoid Vydhruti and Vyatipata. Notes: 1. Muhoortha Chintaamani prefers days of Tripushkarayoga in addition to the nakshatras approved …"' },
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§19.13.1 "Wearing of new ornaments", printed pp.558-559 (PDF 596-597): "Day: Thursday & Friday are considered best by most of the exponents. J.V. recommends Sunday & Tuesday also; B.J.S. opines Wednesday as favourable & Sunday is middling … J.V. recommends that Monday, Wednesday, Thursday & Friday … are auspicious … Tithi: 1,5,6, 10, 11 & the Full Moon are favourable & other Tithis be avoided (K.P.) Const.: J.V. opines that in Hasta, Chitra, Swati, Vishakha, Anuradha, Dhanishta, Ashvani & Revati wearing of clothes & jewellery … In addition to the above stars, ladies should wear jewellery studded with gems on Magha, Ardra, Shravana, Mrighsirsha, Shatbhish & P. Falguni … According to Sage Badrayan, wearing of gold jewellery is auspicious in Hasta, Anuradha, Pushya, P. Shada, Dhanishta, Chitra, 3 Uttras, Punarvasu, Rohini & fixed ascendant. Ascendant: 2,3,6,9 & 12 produce good. K.P. opines that 8th house should be vacant"' },
    WILHELM: { ...WILHELM_E, pageLocus: '"Jewelry- Wearing, new", printed pp.248-249 (PDF 256-257): "Nakshatra: Asvini, Rohini, Mrigasira, Punarvasu, Pushya, Magha, Uttaraphalguni, Hasta, Chitra, Svati, Anuradha, Uttarashadha, Sravana, Uttarabhadrapada and Revati are favorable … Tithi: The 1st, 5th, 6th, 10th, 11th and Purnima are favorable. Other Tithis should be avoided. For casual jewelry, only the 4th, 9th and 14th Tithis and Amavasya need to be avoided. Vara: The Varas of the Moon, Mercury, Jupiter and Venus are favorable … The other Varas should be avoided … Lagna: Taurus, Gemini, Virgo, Sagittarius and Pisces are favorable. Cancer and Libra are middling … Navamsa: The Navamsas of the Moon, Mercury, Jupiter and Venus are favorable; others should be avoided. Bhavas: The 8th should be vacant. Benefics are best in angles and trines and the malefics in the 3rd, 6th and 11th"' },
    MUHURTA_CHINTAMANI: { ...MC_SHARMA, pageLocus: 'Chapter 2 sloka 10, printed pp.53-54 (PDF 57-58): "पौष्ण्याश्विकरपञ्चकवासवेज्यादित्ये प्रवालरदशंखसुवर्णवस्त्रम् । धार्यं विरिक्तशनिचन्द्रकुजेऽह्नि न रक्तं भौमे ध्रुवादितियुगे सुभगा न दध्यात् ॥१०॥" — "Revati, the Nakshtras called Dhruwa, Ashwini, Hasta, Chitra, Swati, Vishakha, Anuradha, Dhanishtha, Pushya and Punarvasu Nakshtras, the Rikta Tithis (4/9/14), the days of Saturday, Monday and Tuesday — in the Nakshtras tithis and days except these … it is not proper to wear Coral, things made of tusk (elephant teeth), Sankha, gold and clothes … in the Nakshtras called Dhruwa, Punarvasu and Pushya, a woman whose husband is living should not wear new clothes. To wear red clothes Tuesday has been considered to be auspicious"' },
    JOSHI: { ...JOSHI_KK, pageLocus: 'Chapter 13 "Wearing clothes and ornaments", printed p.146 (PDF 161): "Nakshatras: All fixed nakshatras (i.e. Uttaraphalguni, Uttarashada, Uttarabhadrapad and Rohini), all short nakshatras (i.e. Hasta, Ashwini, Pushya and Abhijit), Revati, Chitra, Anuradha, Swati, Punarvasu, Dhanistha and Vishakha nakshatras. Tithis: Avoid Rikta tithis and Amavasya. Days: Sunday, Monday, Thursday and Friday are considered auspicious. Yogas: Avoid Vyatipaat and Vaidhriti yogas. One should also avoid Bhadra and malefic yogas formed by tithi-vaar-nakshatra. Proper Chandra/Tara Shuddhi is necessary. A married women should not wear new clothes or ornaments on Sunday and in Uttaraphalguni, Uttarashada, Uttarabhadrapad Rohini, Punarvasu and Pushya nakshatras"' },
  },
  ORNAMENT_MAKING: {
    AGARWAL: { ...AGARWAL_GS, pageLocus: 'Classification of nakshatras, printed pp.298-299 (PDF 297-298): "5. Short and dynamic kshipra, laghu Hasta, Aswini, Pushya, Abhijit … Suitable for construction & starting a shop, selling, sex. starting education, making and wearing ornaments, fine arts, learning & display of arts etc., travelling, dancing, singing, acting, beauty parlours. All acts mentioned in movable nakshatras can also be done in these nakshatars"; "6. Gentle friendly mridu, maitri Mrigshira, Revati, Chitra, Anuradha … Good for all auspicious ceremonies, 16 samskaras, start of occupation/service/business, singing, learning, music, making & wearing clothes, playing, learning game, making friends, making & wearing ornamnets … All acts mentioned in Fixed and Constant nakshatras can also be done in these nakshatras"; "2. Movable chara, chala Swati, Punarvasu, Shravana, Dhanishtha, Satabhisha … Good for riding on vehicles, horses, elephants, starting of factory/machinery/vehical (wherever motion is profitable). All acts mentioned in Short and Dynamic nakshatras can also be done in diese nakshatras"; "A. 1. Fixed sthira (constant) Utlaraphalguni, Uttarashada, Uttarabhadra, Rohini … Good for coronation, foundation laying, digging a well, house building, upnayana, nagar or graha pravesha, agriculture or horticulture, starting service, etc. and All acts mentioned in Gentle and Friendly nakshatras can also be done in these"' },
    VASHISTHA: { ...VASHISTHA_KUSUM, pageLocus: 'Tithi uses (after Piyooshdhara), printed pp.42-44 (PDF 29-31): "(vii) Saptami … making of ornaments and wearing them …"; "(ix) Navami Hunting, quarrel, gambling, making ornaments …"; "(x) Dashami … All ceremonies that can be done on dwiteeya, triteeya, panchami and saptami can be done on dashami also"; "(xvi) Amavasya (30) … auspicious works … should not be done"; p.46 (PDF 33): "(ii) Bhadra … making of ornaments and their use"; weekdays, p.54 (PDF 41): "Monday … Making and wearing of ornaments"; nakshatras, pp.57-58 (PDF 44-45): Dhruva "making and wearing of ornaments"; Mridu "making of ornaments"' },
    RANGACHARYA: { ...RANGACHARYA_I, pageLocus: '"Kinds of asterisms", printed pp.17-18 (PDF 25-26): "(2) MOVABLE : Punarvasu, Swati, Sravana, Dhanishtta, Satabhisha --favoured for vehicle-drive, gardening, opening shop, sexual intercourse, for giving to make the articles of gold, silver and for jewellery"; "(4) LIGHT : Aswini, Pushyami, Hasta, Abhijit - for the activities mentioned for the movable asterisms …"' },
    JOSHI: { ...JOSHI_KK, pageLocus: '"Acts relating to gold, gold ornaments", printed pp.107-108 (PDF 122-123): "All movable nakshatras (i.e. Swati, Punarvasu, Shravana, Dhanistha and Shatbhisha), all ordinary nakshatras (i.e. Vishakha and Kritika), all short nakshatras (Hasta, Ashwini, Pushya and Abhijit) Mrigshira and Chitra nakshatras; Sunday, Tuesday, Thursday and Friday; ascendents of 1/2/5/7/8/9/12 rashis with Jupiter and Moon strongly placed in lagna are considered good for all acts relating to gold. The above muhurta can also be used for starting a business relating to manufacturing/trading in silver ornaments, artificial jewellery and the like"' },
    KALYANRAMAN: { ...KALYANRAMAN_V2, pageLocus: '"Making and Wearing new Ornaments", printed pp.235-236 (PDF 237-238): "Nakshatras Abhijith, Aswini, Rohini, Punarvasu, Pushya, Uttaraphalguni, Hasta, Swati, Uttarashada, Sravana, Dhanishta, Satabhisha, Uttarabhadrapada. (12+1) … Tithis Avoid Rikta tithis and Amavasya. Weekdays Monday, Wednesday, Thursday, Friday. Avoid Tuesday, Saturday, Sunday mediocre. Yoga Avoid Vydhruti and Vyatipata. Notes: 1. Muhoortha Chintaamani prefers days of Tripushkarayoga in addition to the nakshatras approved …"' },
    WILHELM: { ...WILHELM_E, pageLocus: '"Jewelry- Making & Gold smithing", printed p.247 (PDF 255): "Nakshatra: Asvini, Rohini, Punarvasu, Pushya, Uttaraphalguni, Hasta, Svati, Uttarashadha, Sravana, Dhanishtha, Satabhisha, and Uttarabhadrapada are favorable. Gold Jewelry and Gold Smithing: Asvini, Mrigasira, Punarvasu, Pushya, Hasta, Chitta, Svati, Sravana, Dhanishtha, and Satabhisha are most favorable. Jewelry with Pearls: Additionally, Mrigasira, Chitra, Anuradha and Revati are particularly favorable … Vara: The Varas of benefics are favorable. For jewelry with gems and diamonds the Varas of the Sun and Mars are particularly favorable. For gold jewelry and gold smithing the Varas of the Sun, Mars, Jupiter and Venus are particularly favorable. Lagna: The Rasis of benefics are favorable …"' },
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§19.13.2 "Manufacture of ornaments", printed pp.559-560 (PDF 597-598): "Asterisms of Ashvani, Rohini, Mrigshira, Punarvasu, Pushya, 3 Uttras, Hasta, Chitra, Swati, Vishakha, Anuradha, Shravana, Dhanishta, Shatbhish & Revati; Monday, Wednesday, Thursday & Friday are auspicious for making ornaments. For manufacture of jewellery studded with gems, one should select Ashvani, Krittika, Rohini … & Revati; & days other than Saturday. Tripushkar Yoga is also beneficial. Silver jewellery studded with pearl & Diamond should be manufactured in just above said asterisms except Vishakha & Krittika; & on Friday & Thursday (M.M.)"' },
    MUHURTA_CHINTAMANI: { ...MC_SHARMA, pageLocus: 'Chapter 2 sloka 16, printed p.59 (PDF 63): "It is auspicious to get Jewels made on the day in which Tripushkar yoga falls … and in the Nakshtras called Chara, Kshipra and Dhruwa. Jewels studded with diamonds and gems should be got prepared in the other Nakshtras except the Nakshtras called Tikshna and Ugra, on Sundays and Tuesdays and in the Ascendants of Aries, Scorpio and Leo. Jewels studded with Pearls should be got prepared in the Nakshtras called Chara, Mridu, Dhruwa and Kshipra and on an auspicious day and in an auspicious Ascendant"' },
  },
  CLOTHES_WASHING: {
    KALYANRAMAN: { ...KALYANRAMAN_V2, pageLocus: '"Getting Clothes Washed", printed p.247 (PDF 249): "Muhoortha Chintaamani takes nakshatras Dhanishta, Hasta, Aswini, Chitra, Swati, Visakha, Anuradha, Punarvasu and Pushyami for getting clothes washed. It disallows Rikta- 4/9/14 tithis for this. Shasti and Sraddha tithis are also to be rejected. Likewise are Saturday and Wednesday. Chandeshwar however, rejects Saturday, Tuesday and Sunday. He rejects Pournami, Dwadasi also for washing clothes."' },
    MUHURTA_CHINTAMANI: { ...MC_SHARMA, pageLocus: 'Chapter 2 sloka 20, printed pp.59-60 (PDF 63-64): "… वस्त्राणां क्षालनं सद्वसुहयदिनकृत्पञ्चकादित्यपुष्ये नो रिक्तापर्वषष्ठीपितृदिनरविजज्ञेषु कार्यं कदापि ॥२०॥" — "It is auspicious to get clothes washed in the Nakshtras of Dhanistha, Ashwini, Hasta, Chitra, Swati, Vishakha, Anuradha, Punarvasu and Pushya And it is not auspicious to get clothes washed on Rikta tithis (4/9/14) tithi of a Parva (any Parva or festival) Shashthi tithi and the Shradhdha tithis of father and mother … and on the days of Saturday and Wednesday"' },
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§19.14.2 "Washing of new clothes", printed p.563 (PDF 601): "In Ashvani, Punarvasu, Pushya, Hasta, Chitra, Swati, Vishakha, Anuradha, Dhanishta; on Monday, Tuesday, Thursday & Friday are beneficent. But Saturday & Wednesday are prohibited. It should not be done during Shradh, Navratris, day of fasting, Parva Tithis, 6th & Rikta Tithis. Acharya Chandeshvar opines that on Sunday, Tuesday, Saturday; 12th Tithi, Full Moon & Sankranti days are prohibited in washing clothes"' },
    WILHELM: { ...WILHELM_E, pageLocus: '"Clothes- Washing", printed p.216 (PDF 224): "Nakshatra: Asvini, Punarvasu, Pushya, Hasta, Chitra, Svati, Visakha, Anuradha and Dhanishtha are favorable. Tithi: Avoid the 4th, 6th, 8th, 9th, 14th, Amavasya, Purnima, the Tithi prevailing during Sankranti, and the Shraddha Tithis (lunar dates of death) of one\'s parents. Vara: Avoid the Varas of Mercury and Saturn"' },
    RANGACHARYA: { ...RANGACHARYA_I, pageLocus: '"Wearing new clothes", printed p.131 (PDF 139): "Never wash the new clothes on Saturday and Wednesday, Shastti, amavasya on the day of sraddha"' },
  },
  STITCHING: {
    WILHELM: { ...WILHELM_E, pageLocus: '"Cloth- Making, Weaving, Sewing, etc.", printed p.215 (PDF 223): "Nakshatra: Rohini, Mrigasira, Punarvasu, Chitta, Svati, Anuradha, Jyeshtha, Sravana, Dhanishtha, Satabhisha and Revati are favorable. Tithi: Particularly avoid the 4th, 9th and 14th Tithis. Vara: The Varas of the Sun, Moon, Jupiter and Venus are favorable"' },
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§19.14.3 "Works related to stitching of clothes", printed p.563 (PDF 601): "For learning tailoring & opening tailoring shop, asterisms of Ashvani, Rohini, Mrigshira, Punarvasu, Pushya, Hasta, Chitra, Swati, Vishakha, Anuradha, Jyeshta, Dhanishta & Revati; & all days except Tuesday & Saturday are felicitous"' },
    RANGACHARYA: { ...RANGACHARYA_I, pageLocus: '"Stiching of new clothes", printed p.132 (PDF 140): "Mrigasira, Chitra, Anuradha, Aswini, Pushyami, Rohini, Hasta, Jyeshtta, Monday, Wednesday, Thursday, and Friday, are good. Punarvasu and dhanishtta also are preferred"' },
    MUHURTA_CHINTAMANI: { ...MC_SHARMA, pageLocus: 'Chapter 2 sloka 15, printed p.57 (PDF 61): "… सूचीकर्माप्यदितिवसुभ त्वाष्ट्रमैत्राश्विधिष्ण्ये ॥१५॥" — "Doing the work of stitching is auspicious in the Nakshtras of Punarvasu, Dhanishtha, Chitra, Anuradha, Ashwini and Pushya"' },
  },
  AGRI_GENERAL: {
    KALYANRAMAN: { ...KALYANRAMAN_V2, pageLocus: '"General Agricultural works", printed p.165 (PDF 167): "Nakshatra Abhijith, Aswini, Mrigasira, Pushyami, Hasta, Chitra, Anuradha, Revati (7+1) … Tithis 1/2/3/5/6/7/8/10/11/12/13/15 Weekdays All days. Yoga Avoid Vydhruti and Vyatipata. Note: The Lagna must be male raasis. 1/3/5/7/9/11. Benefics must be in houses 4 and 06 [10]. Jupiter in Kendra, Mercury in the 2nd, other benefics in the 11th will be ideal. Malefics in the 6th are desirable for success"' },
    JOSHI: { ...JOSHI_KK, pageLocus: '"For all agricultural acts in general", printed p.107 (PDF 122): "All short nakshatras (i.e. Hasta, Ashwini, Pushya and Abhijit), all friendly nakshatras (i.e. Mrigshira, Revati, Chitra and Anuradha) and Lagna of male rashis (i.e. 1/3/5/7/9/11 rashis) with benefics in 4th and 10th house is good for all agricultural activities in general. Jupiter in Kendras, Mercury in second house, benefics in eleventh house and malefics in sixth house ensure success in agricultural activities"' },
    RAMAN: { ...RAMAN_BV, pageLocus: 'Chapter XIII, PDF p.48: "While beginning all agricultural operations, see that the 8th house is unoccupied" … "In all agricultural operations, the position of the Moon is very important. See that the Moon is strong and free from affliction by Rahu, Ketu or Saturn. The Moon should be a benefic"' },
    AGARWAL: { ...AGARWAL_GS, pageLocus: 'Classification of nakshatras, printed pp.298-299 (PDF 297-298): "A. 1. Fixed sthira (constant) Utlaraphalguni, Uttarashada, Uttarabhadra, Rohini … Good for coronation, foundation laying, digging a well, house building, upnayana, nagar or graha pravesha, agriculture or horticulture, starting service, etc. and All acts mentioned in Gentle and Friendly nakshatras can also be done in these"; "6. Gentle friendly mridu, maitri Mrigshira, Revati, Chitra, Anuradha … All acts mentioned in Fixed and Constant nakshatras can also be done in these nakshatras"' },
    VASHISTHA: { ...VASHISTHA_KUSUM, pageLocus: 'Tithi groups, printed p.46 (PDF 33): "(i) Nanda (Lord Venus) One can use new clothes, do works related to music and dance, farming, attend parties or celebrations …"; p.44 (PDF 31): "(xvi) Amavasya (30) … auspicious works and cohabitation should not be done"' },
  },
  FIELD_ENTRY: {
    WILHELM: { ...WILHELM_E, pageLocus: '"Agriculture- Setting foot on farmland for purpose of agriculture", printed p.185 (PDF 193): "Nakshatra: Bharani, Ardra, Pushya, Magha, Uttaraphalguni, Chitta, Svati, Anuradha, Uttarashadha and Uttarabhadrapada are favorable. Tara: In addition to the normally favorable Taras, the Janma Nakshatra as well as the 10th from there is favorable. Tithi: All odd Tithis except the 9th are favorable. Even Tithis, except for the 2nd and 10th should be avoided. Some astrologers do not recommend the 9th since it is a Rikta Tithi. Vara: The Varas of the Moon, Mars, Mercury and Jupiter are favorable, as also Saturn\'s according to some, which can be considered as middling. Lagna: Taurus, Virgo and Scorpio are most favorable, though the generally favorable Lagnas will do. The Lagna being the Rasi of the natal Moon is always favorable"' },
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§21.1 "Entering into the field", printed p.587 (PDF 624): "For the purpose of putting an agriculture land in use or in fresh usage, one should enter into the field on odd Tithis except 9th; on even Tithis except 2 & 10. In the opinion of some Bhadra (2,7,12) Tithis should be left. Benefic days are fruitful, while some recommend Saturday also. Suitable constellations are: Bharni, Ardra, Pushya, Magha, Chitra, Swati, Anuradha & 3 Uttras. B.D.R. recommends Anuradha, Ashvani, Dhanishta, Rohini, Uttar Bhadra & Tuesday … Jupiter, Mercury or Venus in the ascendant or aspecting it is beneficial"' },
    SHRIDHAR_OLD: { ...SHRIDHAR_HEA, pageLocus: '§21.1, printed p.587 (PDF 624): "A land, which has already been in use, should be entered in Swati, Pushya, Ardra, Bharni, Magha 3 Uttras. Tuesday is the best; Thursday & Wednesday are middling; & one should not enter into an agriculture field on Monday & other inauspicious days. Jupiter, Mercury or Venus in the ascendant or aspecting it is beneficial"' },
  },
  PLOUGHING: {
    KALYANRAMAN: { ...KALYANRAMAN_V2, pageLocus: '"Commencing Land cultivation, Ploughing", printed pp.165-168 (PDF 167-170): "Nakshatra Abhijith, Aswini, Rohini, Mrigasira, Punarvasu, Pushyami, Makha, Uttaraphalguni, Hasta, Chitra, Swati, Visaka, Anuradha, Moola, Uttarashada, Sravana, Dhanishta, Satabhisha, Uttarabhadrapada and Revati. (19+1) … Tithis 1/2/3/5/7/8/10/11/12/13/15. Weekdays Monday, Tuesday, Wednesday, Thursday and Friday. Yoga Avoid Vydhruti and Vyatipata. Karanas Reject Sthira and Kaulava, Vishti, Taitila and Vanija; Bhava, Baalava, Gara are good"; notes: "10. Agninakshatra days (when the Sun is from 20° of Bharani till Rohini at 43°20′) are not good for agricultural activities … 11. Rikta tithis and Shasti must be avoided as also Tithis 2/7/12 … 13. Prefer Taurus, Gemini, Cancer, Capricorn, Pisces, raasis. 14. The nakshatra where the Sun stands and its 6/7/8/14/15/16/22/23/24 nakshatras must be rejected. 15. Moon in 4 and the Sun in 10 from the select Lagna must be avoided … 19. Chandra Suddhi and Tara Suddhi for the cultivator are desirable"' },
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§21.3 "Ploughing", printed pp.587-589 (PDF 624-626): "Tithi: 1,2,3,5,7,10,11,13 of B.H. are favourable; reject D.H. Day: Other than Sunday & Saturday. Const.: Movable …, Stationary …, Small …, Sweet …, Vishakha, Magha & Moola - are Beneficial when ploughing is done by bullocks. Ascendant: 2,3,6,9,12 signs are beneficent (M.C.); K.P. opines that 2,3,4,10 &12 are beneficial … The efficacious Moon in signs & navamshas of watery signs (4,10,11,12) is beneficial for the tillage … J.V. opines that Tuesday, Wednesday & Saturday; Krittka, Bharni, Ardra, Ashlesha, 3 Uttras; malefic yogas; Adal asterisms; even Tithis; … 1st first half of Jyeshta; & Bhadra (Vishti) are prohibited in ploughing. Favourable asterisms are also selected as per Hal Chakra … Table 21.1 - Hal Chakra [from the Sun\'s star] 1-3 Troubles to bullocks, 4-6 Wealth, 7-11 Comfort, 12-20 Death, 21-25 Wealth, 26-27 Bad result … Table 21.2 — Hal Chakra - another opinion [J.V. & B.J.S., Abhijit counted] 1 to 3 Bad, 4 to 6 Good, 7 to 9 Bad, 10 to 14 Good, 15 to 17 Bad, 18 to 22 Good, 23 to 25 Bad, 26 to 28 Good"' },
    WILHELM: { ...WILHELM_E, pageLocus: '"Agriculture- Ploughing", printed pp.183-185 (PDF 191-193): "Paksha: Shukla Paksha is favorable; avoid Krishna Paksha. Nakshatra: Rohini, Punarvasu, Pushya, Uttaraphalguni, Hasta, Anuradha, Mula, Uttarashadha and Uttarabhadrapada are most favorable. Muhurta Chintamani and others also consider Asvini, Mrigasira, Magha, Chitra, Svati, Visakha, Sravana, Dhanishtha and Satabhisha favorable, all which may be considered as middling. The 3rd, 4th, 5th, 6th, 7th, 11th, 12th, 13th, 14th, 15th, 19th, 20th, 24th, 25th and 26th Nakshatras from the one occupied by the Sun are favorable; the other Nakshatras are troublesome. Tara: … the Janma Nakshatra as well as the 10th from there is favorable. Tithi: The 1st, 2nd, 3rd, 5th, 7th, 10th, 11th, and 13th are favorable. The 4th, 6th, 9th and 14th are particularly unfavorable … Vara: The Varas of benefic planets are favorable, while those of malefics are troublesome … Lagna: Taurus, Gemini and Pisces are most favorable. Cancer, Virgo, Libra, Scorpio, Sagittarius and Capricorn are mediocre. Aries, Leo and Aquarius should be avoided … Bhavas: No malefic planet should be in the Lagna … Grahas: … The Moon is very favorable in a watery Navamsa"' },
    MUHURTA_CHINTAMANI: { ...MC_SHARMA, pageLocus: 'Chapter 2 sloka 28, printed p.65 (PDF 69): "Ploughing (First ploughing at the beginning of the year or the session) has been said to be auspicious in the Nakshtras of Moola, Vishakha, Magha, in those named as \'Chara\' …, in all the three Uttaras and Rohini, in those called Mridu …, in those called Kshipra …, on days other than Sundays and Saturdays; when the Malefics (the Sun, Mars and Saturn) are weakened; when the Moon is in the Navamsha of the watery signs (4/10/11/12); when the Planets of Venus and the Moon have full strength and when Jupiter is posited in the Ascendant. There is loss in Agriculturing if ploughing is performed in the Ascendants of Leo, Aquarius, Cancer, Aries, Capricorn and Libra, on the Rikta Tithis (4/9/14) and on the Shashthi (6th) Tithi"; sloka 29, p.66 (PDF 70): "the three Nakshtras before the Nakshtra in which the Sun is there are inauspicious for ploughing, then 8 Nakshtras are auspicious, then again 9 Nakshtras are inauspicious and 8 Nakshtras are auspicious"; sloka 6, p.50 (PDF 54): Kshipra — Hasta, Ashwini, Pushya, Abhijit' },
    RAMAN: { ...RAMAN_BV, pageLocus: 'Chapter XIII "Agriculture and Farming", PDF p.47: "Ploughing the Land. - The soil should be tilled on days ruled by benefic planets. Generally, the sign Leo, or the sign occupied by the Sun or the constellation governed by him is favourable. The benefic stars are Rohini, Punarvasu, Pushya, Uttara, Hasta, Anuradha, Moola, Uttarashadha and Uttarabhadra. All lunar days except the 4th, 6th, 8th, 9th and 10th and New Moon days are good. At the time of ploughing, let Taurus, Gemini, Cancer, Capricorn or Pisces be rising. Avoid Scorpio and Aquarius, if the rising sign is Mesha, it proves fatal to the cattle … See that the Lagna is free from malefic association. It is better that the bright half of the lunar month is selected. On the first day start ploughing eastward or northward"; PDF p.48: "While beginning all agricultural operations, see that the 8th house is unoccupied"' },
    JOSHI: { ...JOSHI_KK, pageLocus: '"Land Cultivation", printed p.104 (PDF 119): "Moola, Vishakha, Magha, Swati, Punarvasu, Shravana, Dhanistha, Shatbhisha, Uttaraphalguni, Uttarashada, Uttarabhadrapad, Rohini, Mrigshira, Revati, Chitra, Anuradha, Hasta, Ashwini and Pushya nakshatras; Monday, Tuesday, Wednesday, Thursday and Friday; All tithis except Rikta Tithis (4/9/14 tithis), 6th tithi and Amavashya (30th tithi) are considered good for starting cultivation of land. Avoid Bhadra and also avoid ascendents of 1/4/5/7/10/11 signs. At the time of Cultivation if malefics are weak, Venus and Moon are strong, Moon is placed in watery navamsha i.e. navamsha of (4/8/10/12 signs) and Jupiter is placed in lagna it is considered highly auspicious - Proper Chandra Shuddhi for the farmer is a must. It is better to start cultivation from north direction"' },
    RANGACHARYA: { ...RANGACHARYA_I, pageLocus: '"Agricultural work", printed pp.125-126 (PDF 133-134): "The following are commended for the first- ploughing. Aswini, Rohini, Mrigasira, Punarvasu, Pushyami, Makha, Hasta, Swati, Anuradha, Uttara, Uttarashada, Uttarabhadra, Moola, Sravana, Dhanishtta and Revati Tithis 10th, 11th, 13th, 5th, and the 1st and Sunday, Monday, Thursday and Friday - Lagnas Vrishabha, Mithuna, Kanya, Vrischika, Dhanus and Meena … Halachakra suddhi is a must for ploughing … HALA CHAKRA : Find out the asterism in which the sun transits. Count from this asterism to the Moon\'s asterism on the day. The first 3 asterism are evil, the next 3 are good, the next 3 are evil, the next 5 are good, the next 3 are evil, the next 5 are good, the next 3 are evil, the next 2 are good"' },
  },
  SOWING: {
    KALYANRAMAN: { ...KALYANRAMAN_V2, pageLocus: '"Sowing Seeds", printed pp.168-172 (PDF 170-174): "Nakshatra Aswini, Rohini, Mrigasira, Pushyami, Makha, Uttaraphalguni, Hasta, Chitra, Swati, Anuradha, Moola, Uttarashada, Dhanishta, Uttarabhadrapada, Revati. (15) … Tithis 1/2/3/5/7/8/10/11/12/13/15 Rikta tithis and Shasti must be avoided … Weekdays Monday, Wednesday, Thursday, Friday"; notes: "(ii). The 8 nakshatras from the one where Raahu is posited are inauspicious for sowing, the next three auspicious, then next one is inauspicious, then three auspicious, one inauspicious, again 3 auspicious and one inauspicious, 3 auspicious and final four inauspicious. (8-3-1-3-1-3-1-3-4). This is called Raahu chakra or Hala chakra"; "Agninakshatra days … are not good for agricultural activities"' },
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§21.4 "Sowing", printed pp.589-592 (PDF 626-629): "Tithi Leave Rikta Tithis, the New Moon day, 5 Parva Tithis & Prodosha Tithis. 2nd, 6th, & 10th are middling; 1st, 9th & 30th should be left; & balance Tithis are beneficial (B.D.R.). Day: Benefic days & Sunday are fruitful … Tuesday & Saturday are suitable only for particular kind of seeds & plants. Const: Small (Hasta, Ashvani, Pushya), Sweet (Mrigshira, Chitra, Anuradha, Revati), Fixed (Rohini, 3 Uttras), Magha, Moola, Swati & Dhanishta (Sage Narad). J.V. does not recommend Magha, Swati & Dhanishta … but recommends Krittika & Shravana … Table 21.3 Rahu Chakra (Acharya Shripati) [from Rahu\'s star] 1 to 3 head Loss of crop by insects, 4 to 6 Throat Brings illness, 7 to 18 Stomach Best for expansion, 19 to 22 Tail Less grain, 23 to 27 Naval Fear of fire; Table 21.4 — Rahu Chakra – another opinion (B.J.S.) 1 to 8 Bad, 9 to 11 Good, 12 Bad, 13 to 15 Good, 16 Bad, 17 to 19 Good, 20 Bad, 21 to 23 Good, 24-27 bad. K.P. recommends that 7th to 18th asterisms from that of the asterism occupied by Venus results in maximum growth … Ascendant: 2,4,5,10,12 signs are the best; 3,7,11 signs are middling. Some opine that 2,3,6,8,9,12 signs are held as the best … Amshas of the Moon, Mercury, Jupiter & Venus are beneficent. 8th house should be vacant, & Venus in 7th is inauspicious. The Moon in 2,3,4,5,7,10 & 11 houses in election does much good, in the opinion of K.P."; p.592 (PDF 629): "B.J.S. recommends that first three days from the time the Sun enters Ardra asterism (the Sun transiting Sidereal Gemini 6° 40′ to 9° 40′ …) … should be prohibited in sowing seeds"' },
    WILHELM: { ...WILHELM_E, pageLocus: '"Agriculture- Sowing seeds & planting", printed pp.185-188 (PDF 193-196): "Nakshatra: Rohini, Pushya, Magha, Uttaraphalguni, Hasta, Svati, Visakha, Anuradha, Mula, Uttarashadha, Sravana, Satabhisha, Uttarabhadrapada and Revati are favorable. Asvini, Mrigasira, Punarvasu and Dhanishtha are middling. Other Nakshatras should be avoided … Hala Chakra: From the Nakshatra that Rahu is in, the 9th through 11th, the 13th through 15th, the 17th through 19th, and the 21st through 23rd Nakshatras are favorable for sowing seeds. Sowing a Field of Grains: … the 7th through 18th [from Venus] grant luxuriant growth and only one of these should be chosen … Tithi: The 3rd, 5th, 8th, 10th, 12th, 13th, Amavasya and Purnima are favorable. Karana: Avoid Vishti, Chatushpada, Naga and Kintughna. Vara: The Varas of the Moon, Mercury, Jupiter and Venus are favorable. Lagna: Taurus, Cancer, Leo, Capricorn and Pisces are the most favorable. Libra, Gemini and Aquarius are okay. Aries, Virgo, Scorpio and Sagittarius are unfavorable. The Lagna being a Rasi of the lord of the Vara is very favorable. The Lagna of the Rasi of the natal Moon is also quite favorable … Navamsa: The Navamsas of the Moon, Mercury, Jupiter and Venus are favorable. Bhavas: No Planet should be in the 8th. The Moon in the 2nd, 3rd, 4th, 5th, 7th, 10th or 11th is very favorable. Venus is most unfavorable in the 8th. Malefics … are most favorable in the 3rd, 6th and 11th"' },
    RAMAN: { ...RAMAN_BV, pageLocus: 'Chapter XIII, PDF pp.47-48: "Sowing and Planting. - Any seeds can be sown on a day ruled by Hasta, Chitta, Swati, Makha, Pushyami, Uttara, Uttarashadha, Uttarabhadra, Rohini, Revati, Aswini, Moola or Anuradha provided the lunar day is also propitious. Choose a Lagna, owned by the planet who is lord of the weekday in question … Always choose a Lagna owned by the planet who is lord of the weekday in question … All odd lunar days except the 9th are good. All even tithis except the 2nd and 4th should be avoided … While beginning all agricultural operations, see that the 8th house is unoccupied"' },
    MUHURTA_CHINTAMANI: { ...MC_SHARMA, pageLocus: 'Chapter 2 sloka 29, printed pp.65-66 (PDF 69-70): "The sowing of seeds is auspicious on the tithis and days and in the Nakshtras which have been said as auspicious for ploughing, that is, the sowing of seeds is auspicious in the Nakshtras of Moola, Magha, Swati, Dhanishtha, Uttaraphalguni, Uttarashadha, Uttara Bhadrapada, Rohini, Mrigshira, Rewati, Chitra, Anuradha, Hasta, Ashwini and Pushya and on the days of Monday, Wednesday Thursday and Friday; 8 Nakshtras from the Nakshtra in which Rahu is there are inauspicious for the sowing of seeds; three Nakshtras after it are auspicious, then one Nakshtra is inauspicious, then three … then four Nakshtras are inauspicious. Seeds are to be sown in the auspicious Nakshtras only. This is called Rahu Chakra or Hala Chakra"; notes: "The sowing of seeds is auspicious in all the Nakshtras except those of Shravana, Shatbhisha, Punarvasu and Vishakha and the day of Tuesday. The Rikta and the Shashthi Tithis … should be rejected in reference to the sowing of seeds also"' },
    RANGACHARYA: { ...RANGACHARYA_I, pageLocus: '"Seed- sowing", printed pp.126-127 (PDF 134-135): "Except Sravana, Satabhisha, Punarvasu, Visakha and Jyeshtta, the asterisms mentioned for ploughing hold good in the case of seed-sowing. If the seeds are sown on Tuesday, rats destroy the sprouts, if sown on Saturday, locusts and other insects destroy the sprouts. Rikta tithis should be avoided. Vrishabha, Meena, Kanya and Mithuna are good for sowing the seeds. According to Kalamritam 1) Mesha Lagna causes cattle extinct. 2) Kataka lagna gives good crop 3) Tula lagna portends death. 4) Crops fall for Makara Lagna 5) Simha gives troubles from thieves. 6) Kumbhalagna causes fear of theft … Phanichakra suddhi is a must for the seed - sowing … PHANI CHAKRA : The count is from Rahu\'s asterism to the moon\'s asterism on the day of seed- sowing. The first 8 are evil, the next 3 are good, the next 1 is evil, the next 3 are good, the next 1 is evil, the next 3 are good, the next 1 are good and the next 4 are evil"' },
    AGARWAL: { ...AGARWAL_GS, pageLocus: '"Sowing seeds", printed p.329 (PDF 328): "Tithis: 1,2, 3, 5, 7, 8, 10, 11, 12, 13, 15. Days: Monday, Wednesday, Friday. Nakshatras: all 3 Uttaras, Rohini, Swati, Revati, Anuradha, Mrigashira, Pushya, Chitra, Dhanishta, Hasta, Aswini, Moola, Magha. Avoid vishti karna. Muhurta Kundli: Lagna should be owned by lord of week - day"; "Important notes: i. In the case of all the muhurtas stated in these charts, tara shuddhi and chandra shuddhi is a must. ii. Particularly all malefic yogas & Vishti karna be avoided in all cases"' },
    JOSHI: { ...JOSHI_KK, pageLocus: '"Sowing Seeds", printed p.104 (PDF 119): "Moola, Magha, Swati, Dhanistha, Uttaraphalguni, Uttarashada, Uttarabhadrapad, Rohini, Mrigshira, Revati, Chitra, Anuradha, Hasta, Ashwini, and Pushya nakshtras; Monday, Wednesday, Thursday and Friday, and 1/2/3/5/7/8/10/11/12/13/15 tithis are good for sowing seeds. Bhadra should be avoided"' },
    VASHISTHA: { ...VASHISTHA_KUSUM, pageLocus: 'Nakshatras, printed pp.56-58 (PDF 43-45): "(a) Dhruva or sthira — Rohini, Uttarashadha, Uttaraphalguni, Uttarabhadra … (g) Teekshna or darun — Aridra, Ashlesha, Jyeshtha"; "Dhruva (fixed) nakshatra — It gives success in sowing plant seeds …"; "Teekshna or daruna (severe) nakshatra — … sowing seeds, starting work of laying out a garden …"' },
  },
  TRANSPLANTING: {
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§21.5 "Paddy cultivation — Paddy replantation", printed p.592 (PDF 629): "Paddy re-plantation should be done in fixed (Rohini, 3 Uttras), Sweet (Mrigshira, Chitra, Anuradha, Revati), Small (Hasta, Ashvani, Pushya), Magha, Moola, Dhanishta asterisms; & on benefic days. Rikta, Saturday & Tuesday are prohibited (B.J.S.). M.C. recommends Vishakha, Poorva Bhadra, Uttra Falguni, Moola, Rohini, & Shatbhish"' },
    MUHURTA_CHINTAMANI: { ...MC_SHARMA, pageLocus: 'Chapter 2 sloka 32, printed p.68 (PDF 72): "Dhanya Ropana is auspicious in the Nakshtras of Vishakha, Poorva Bhadrapada, Moola, Rohini, Shatbhisha and Uttaraphalguni, and on other days than those of Saturday and Tuesday"' },
    WILHELM: { ...WILHELM_E, pageLocus: '"Agriculture- Transplanting", printed p.188 (PDF 196): "Nakshatra: Rohini, Uttaraphalguni, Visakha, Mula, Satabhisha and Purvabhadrapada are favorable. Vara: Avoid Mars\'s and Saturn\'s Vara. Lagna: The Lagna being the Rasi of the natal Moon is always favorable"' },
    KALYANRAMAN: { ...KALYANRAMAN_V2, pageLocus: 'printed p.177 (PDF 179), threshing notes: "For transplanting (danyaropana) it [Muhoortha Chintaamani] suggests six (6) nakshatras- Visaka, Poorvabhadrapada, Moola, Rohini, Satabhisha and Uttara phalguni and wants to avoid Saturday and Tuesday"' },
    RANGACHARYA: { ...RANGACHARYA_I, pageLocus: '"Plantation", printed p.127 (PDF 135): "Visakha, Poorvabhadra, Moola, Rohini and Satabhisha are excellent for plantation. Tuesday and Saturday should be avoided"' },
  },
  TREE_PLANTING: {
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§21.6 "Planting trees", printed pp.593-594 (PDF 630-631): "Tithi: auspicious Tithis in B.H. Day: Monday, Wednesday, Thursday & Friday. Const.: Fixed (Rohini, 3 Uttras), Sweet (Mrigshira, Chitra, Anuradha, Revati), Small (Hasta, Ashvani, Pushya), Shatbhish, Vishakha, Moola. In addition to the above Acharya Varah Mihir recommends Shravana also. Month: Vaishakha, Shravana, Margshirsha, Karttika. B.D.R. opines that Rikta, the New Moon, 12th Tithi, Tuesday & Sunday are middling. In Saturday when the Moon & Tara are weak, it is inauspicious to plant trees. Asterisms of Bharni, Krittika, Ardra, Ashlesha, Vishakha, 3 Poorvas; the Sun & Jupiter in one sign, Jupiter in Leo, when Jupiter & Venus are set, must be left in plantation of the trees (B.D.R.). Further benefic asterisms are found from Vriksha Chakra - table 21.6 … [from the Sun\'s star] 1 to 3 root illness, 4 to 6 skin wealth gain, 7 to 10 branch loss, 11 to 12 leaves poverty, 13 to 15 head benefic, 16 east death, 17 to 21 south loss of son, 22 to 23 west wealth gain, 24 to 27 north benefit"' },
    KALYANRAMAN: { ...KALYANRAMAN_V2, pageLocus: '"Tree planting", printed pp.178-179 (PDF 180-181): "Nakshatra Aswini, Rohini, Mrigasira, Pushyami, Uttaraphalguni, Hasta, Chitra, Visaka, Anuradha, Moola, Uttarashada, Satabhisha, Uttarabhadrapada, Revati. (14) … Tithis 2/3/5/6/7/10/11/12/13/15. Weekdays Sunday, Thursday, Friday. Others Count from the Sun\'s Nakshatra to the day\'s Nakshatra. If it is 4,5,6,13,14,15,22,23,24,25,26 & 27 Nakshatra, it can be taken as good. Notes: Muhoortha Chintaamani accepts Mridu (4) … Dhruva (4) … Kshipra (4)- Hasta, Aswini, Pushyami and Abhijith and others (3) Visaka, Moola, and Satabhisha for planting trees and creepers"' },
    JOSHI: { ...JOSHI_KK, pageLocus: '"Tree Plantation", printed p.106 (PDF 121): "Vishakha, Moola, Mrigshira, Revati, Chitra, Anuradha, Uttaraphalguni, Uttarashada, Uttarabhadrapad, Rohini, Shatbhisha, Hasta, Ashwini and Pushya nakshatras and Sunday, Thursday and Friday are considered good for tree plantation. Count from Sun\'s nakshatra to Moon\'s nakshatra at the time of starting tree plantation. First three nakshatras from Sun\'s nakshatra are malefic; next three benefic; next six malefic; next three benefic, next six malefic and next six benefic. To put it in other words if we count from Sun\'s nakshatra, 4th, 5th, 6th, 13th, 14th, 15th, 22th, 23rd, 24th, 25th, 26th, and 27th nakshatras are good for tree plantation"' },
    WILHELM: { ...WILHELM_E, pageLocus: '"Agriculture- Sowing seeds & planting", printed pp.186-187 (PDF 194-195): "Trees and Creepers: For sowing seeds of trees and non-fruit-bearing creepers the following are particularly favorable: Asvini, Rohini, Mrigasira, Pushya, Uttaraphalguni, Hasta, Chitra, Visakha, Anuradha, Mula, Satabhisha, Uttarashadha, Uttarabhadrapada and Revati. Of these, the 4th, 5th, 6th, 13th, 14th, 15th, 22nd, 23rd, 24th, 25th, 26th and 27th Nakshatras from the Sun are particularly favorable … Fruit Trees: Seedlings of long-lived fruit trees are very favorably planted on Jupiter\'s Vara when Jupiter occupies the Lagna"; the section\'s Tithi, Karana, Vara, Lagna, Navamsa and Bhavas' },
    MUHURTA_CHINTAMANI: { ...MC_SHARMA, pageLocus: 'Chapter 2 sloka 13, printed p.56 (PDF 60): "The planting of creepers and trees is auspicious in the Nakshtras of Vishakha, Moola, Shatbhisha, the Nakshtras called Mridu, Dhruwa and Kshipra"; sloka 6, p.50 (PDF 54): Kshipra — Hasta, Ashwini, Pushya, Abhijit' },
    AGARWAL: { ...AGARWAL_GS, pageLocus: '"Horticulture", printed p.329 (PDF 328): "Days: Monday, Wednesday, Friday, in the period of the waxing Moon. Nakshatras: all 3 Uttaras, Rohini, Revati, Anuradha, Mrigashira, Pushya, Chitra, Vishakha, Hasta, Aswini, Moola, Shatbhisha"' },
    RAMAN: { ...RAMAN_BV, pageLocus: 'Chapter IV, PDF p.9: "Rohini, Uttara, Uttarashadha and Uttarabhadra are supposed to be fixed constellations and they are favourable for coronations, laying the foundations of cities, sowing operations, planting trees and other permanent things"; Chapter XIII, PDF p.48: "Rohini is good for trees … Seedlings of long-lived fruit trees should be planted on Thursday when Jupiter is in Lagna"' },
  },
  GARDEN: {
    MUHURTA_CHINTAMANI: { ...MC_SHARMA, pageLocus: 'Chapter 2 slokas 61-62, printed pp.88-89 (PDF 92-93): "It is auspicious to begin the digging and building of a tank, the planting of a Garden or an orchard and the establishing of an image of some god or goddess in the Uttarayana of the Sun which is there from January 14 to July 16 (except in the month of Chaitra), at the rising of Venus, in the Naksthras called Mridu …, in those called Kshipra …, those called Chara …, in those called Dhruwa … in the Shukla Paksha … in all the other Tithis and Days excepting the Rikta Tithis (4/9/14) and on the day of Tuesday, at those times when the Moon and the Malefic Planets are in the Houses of 3/6/11, when the Benefic Planets are there in the other houses than those of 8 and 12"; sloka 1/47, p.37 (PDF 41): "When Jupiter and Venus are in old age, in the combustion stage or in childhood stage … the building and the using of a small well, garden, tank, well and house …"' },
    KALYANRAMAN: { ...KALYANRAMAN_V2, pageLocus: '"Gardening", printed pp.177-178 (PDF 179-180): "Nakshatra Aswini, Mrigasira, Punarvasu, Pushyami, Makha, Chitra, Swati, Poorvashada, Sravana, Dhanishta, Satabhisha, (11) … Tithis 1/2/3/5/6/7/8/10/11/12/13/15 Weekdays Monday, Thursday, Friday. Others Prefer male raasi (1, 3, 5, 7, 9 and 11) as the Lagna Benefics must be in Kendras. Notes: 1. However, for planting garden or an orchard Muhoortha Chintaamani prefers the conditions prescribed for the installation of deities to be followed"' },
    WILHELM: { ...WILHELM_E, pageLocus: '"Agriculture- Planting an orchard or garden", printed p.183 (PDF 191): "The garden meant here is a recreational garden, park, yard, etc. not a garden for growing home vegetables … Ayana: Uttarayana is by far preferred. Paksha: Shukla Paksha is preferred. Nakshatra: Rohini, Mrigasira, Punarvasu, Uttaraphalguni, Chitta, Svati, Anuradha, Uttarashadha, Sravana, Dhanishtha, Satabhisha, Uttarabhadrapada and Revati are favorable. Tithi: Particularly avoid the 4th, 9th and 14th. Vara: Avoid Mars\'s Vara. Lagna: The Lagna being the Rasi of the natal Moon is always favorable. Bhavas: Venus is very favorable in the Lagna. Benefics should not be in the 8th and 12th. The Moon and malefics are favorable in the 3rd, 6th and 11th"' },
    JOSHI: { ...JOSHI_KK, pageLocus: '"For Gardners", printed p.108 (PDF 123): "All movable nakshatras (i.e. Swati, Punarvasu, Shravana, Dhanistha and Shatbhisha), Poorvashada, Ashwini, Pushya, Magha, Chitra and Mrigshira nakshatras; Monday, Thursday and Friday and male rashis as lagnas with benefics placed in Kendras are considered good to start all acts relating to gardening"' },
    VASHISTHA: { ...VASHISTHA_KUSUM, pageLocus: 'Weekdays, printed p.54 (PDF 41): "Monday: … planting a garden …"; nakshatras, printed pp.56-58 (PDF 43-45): "Dhruva (fixed) nakshatra — It gives success in … planting a garden …"; "Chara (moveable) nakshatra — … laying out a garden, and entering that garden for the first time …"; "Teekshna or daruna (severe) nakshatra — … starting work of laying out a garden …"' },
    RANGACHARYA: { ...RANGACHARYA_I, pageLocus: '"Kinds of asterisms", printed pp.17-18 (PDF 25-26): "(2) MOVABLE : Punarvasu, Swati, Sravana, Dhanishtta, Satabhisha --favoured for vehicle-drive, gardening …"; "(4) LIGHT : Aswini, Pushyami, Hasta, Abhijit - for the activities mentioned for the movable asterisms …"' },
    RAMAN: { ...RAMAN_BV, pageLocus: 'Chapter IV, PDF p.9: "Saravana, Dhanishta, Satabhisha, Punarvasu and Swati are movable stars and they are auspicious for acquiring vehicles, for gardening and for going on procession"' },
  },
  HARVEST: {
    KALYANRAMAN: { ...KALYANRAMAN_V2, pageLocus: '"Cutting crops, harvesting", printed pp.172-173 (PDF 174-175): "Nakshatra Abhijith, Bharani, Krittika, Mrigasira, Aridra, Pushyami, Aslesha, Makha, Uttaraphalguni, Hasta, Chitra, Swati, Jyeshta, Moola, Poorvashada, Uttarashada, Sravana, Dhanishta, Poorvabhadrapada and Uttarabhadrapada. (19) … Tithis 1/2/3/5/6/7/8/10/11/12/13/15 - avoid Rikta tithis. Weekdays Sunday, Monday, Wednesday, Thursday & Friday. Reject Tuesday and Saturday. Yoga Avoid Vydhruti and Vyatipata. Karana Avoid Sthira Karanas and Vishti"' },
    WILHELM: { ...WILHELM_E, pageLocus: '"Agriculture- Harvest", printed pp.180-181 (PDF 188-189): "Nakshatra: Bharani, Rohini, Mrigasira, Ardra, Pushya, Magha, Uttaraphalguni, Hasta, Visakha, Anuradha, Uttarashadha, Sravana, Uttarabhadrapada and Revati are favorable. Tara: Avoid especially the Janma Nakshatra and the 10th and 19th Nakshatras from there … Tithi: The 1st, 2nd, 3rd, 5th, 6th, 7th, 10th, 13th and Purnima are favorable. Karana: Sthira Karanas and Vishti Karana should definitely be avoided. Vara: The Varas of the benefics are favorable. The Varas of Mars and Saturn are most adverse. Lagna: The Rasis of benefics are favorable. Of these, fixed Rasis are particularly favorable. All Lagnas are favorable if Jupiter is in the 4th. The Lagna being the Rasi of the natal Moon is also quite favorable … Miscellaneous: Never begin harvesting after nightfall"' },
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§21.8 "Harvesting", printed p.595 (PDF 632): "Tithi: 1,2,3,5,6,7,10,13. Const.: Stationary (Rohini, 3 Uttras), Bharni, Mrigshira, Ardra, Pushya, Magha, Hasta, Vishakha, Anuradha, Shravana & Revati. Avoid Janma Nakshatra, & 10th & 19th therefrom. Karan: Reject Sthir (fixed) & Vishti Karanas. Harvesting should not be done at the night-time. Day lord & ascendant should be benefics. Jupiter should be in 4th house from any ascendant. Aries & Cancer are benefic signs for collecting fruits"' },
    MUHURTA_CHINTAMANI: { ...MC_SHARMA, pageLocus: 'Chapter 2 sloka 31, printed pp.67-68 (PDF 71-72): "Corn should be reaped in the Nakshtras called Tikshna (Moola, Jyeshtha, Ardra and Ashlesha), Poorva Bhadrapada, Hasta, Kritika, Dhanishtha, Shravana, Mrigshira, Swati, Magha, all the three Uttaras, Poorvashadha, Bharani, Chitra and Pushya, on the days other than those of Saturdays and Tuesdays and on the Tithis other than those of Rikta, and in the Ascendants that are sthir or fixed (2/5/8/11)"' },
    RAMAN: { ...RAMAN_BV, pageLocus: 'Chapter XIII, PDF p.48: "Reaping the Crop. - Bharani, Rohini, Mrigasira, Aridra, Pushyami, Makha, Uttara, Hasta, Visakha, Anuradha, Uttarashadha and Sravana are favourable constellations to start reaping the crop. Avoid 4th, 8th, 9th, 11th, 12th and 14th lunar days as also the New Moon. Taurus, Gemini, Virgo, Libra, Sagittarius or Pisces should be rising. Harvesting. - This can be commenced in Pisces Lagna on a day ruled by Bharani; Scorpio on a day ruled by Sravana; Cancer under Visakha. These pairs form special combinations and promote prosperity"' },
    JOSHI: { ...JOSHI_KK, pageLocus: '"Cutting Crops", printed pp.104-105 (PDF 119-120): "Moola, Jyestha, Ardra, Ashlesha, Poorvabhadrapad, Hasta, Kritika, Dhanistha, Shravana, Mrigshira, Swati, Magha, Uttaraphalguni, Uttarashada, Uttarabhadrapad, Poorvashada, Bharani, Chitra and Pushya nakshatras; All days except Tuesday and Saturday; 1/2/3/5/6/7/8/10/11/12/13/15 tithis and Ascendents of fixed rashis (i.e. 2/5/8/11 rashis) are considered good for cutting crops"' },
    SHRIDHAR_PADDY: { ...SHRIDHAR_HEA, pageLocus: '§21.5 "Paddy harvesting", printed pp.592-593 (PDF 629-630): "Sharp (Jyeshta, Ardra, Ashlesha, Moola), 3 Uttras, P.Bhadra, P.Shada, Hasta, Chitra, Swati, Krittika, Mrigshira, Pushya, Bharni, Shravana, Dhanishta, Magha; fixed signs are beneficent. Rikta, Tuesday & Saturday be avoided. Some opine that P.Falguni is also beneficial. Ascendant of 2,5,8,11 sign is beneficial"' },
    RANGACHARYA: { ...RANGACHARYA_I, pageLocus: '"Crop-cut", printed p.127 (PDF 135): "Mrigasira, Ardra, Punarvasu, Makha, Hasta, Swati, Moola, Sravana and Dhanishtta are good. Fixed Lagnas should be chosen. Monday, Wednesday, Thursday and Friday are good"' },
  },
  THRESHING: {
    KALYANRAMAN: { ...KALYANRAMAN_V2, pageLocus: '"Threshing, using Threshers or other Mechanical devices to separate grains", printed p.177 (PDF 179): "Nakshatra Rohini, Makha, Poorvaphalguni, Uttaraphalguni, Anuradha, Jyeshta, Moola, Sravana and Revati. (9) … Tithis 2/3/5/6/7/10/11/12/13/15 Weekdays All are acceptable"' },
    MUHURTA_CHINTAMANI: { ...MC_SHARMA, pageLocus: 'Chapter 2 sloka 32, printed p.68 (PDF 72): "Kanmardana or Threshing should be done in the Nakshtras of Poorvaphalguni, Uttaraphalguni, Shravana, Magha, Jyeshtha, Rohini, Moola, Anuradha and Rewati"' },
    WILHELM: { ...WILHELM_E, pageLocus: '"Agriculture- Threshing grains", printed p.188 (PDF 196): "Nakshatra: Rohini, Magha, Purvaphalguni, Uttaraphalguni, Anuradha, Jyeshtha, Mula, Sravana and Revati are favorable. Vara: Avoid Mars\'s and Saturn\'s Vara. Lagna: The Lagna being the Rasi of the natal Moon is always favorable"' },
    JOSHI: { ...JOSHI_KK, pageLocus: '"Thrashing-manual and mechanical", printed p.105 (PDF 120): "Poorvaphalguni, Uttaraphalguni, Shravana, Magha, Jyestha, Rohini, Moola, Anuradha and Revati nakshatras are good for thrashing, use of mechanical instruments (thrashers etc.) for separating grains"' },
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§21.5 "Separation of rice from husk", printed p.593 (PDF 630): "It is beneficial to separate grains (from husk & others) in Anuradha, Shravana, Moola, Magha, P.Falguni, U.Falguni, Jyeshta, Rohini & Revati asterisms"' },
    RANGACHARYA: { ...RANGACHARYA_I, pageLocus: '"Threshing", printed p.127 (PDF 135): "This includes beating, dehusking and winnowing. Anuradha, Sravana, Moola, Revati, Makha, Pubba, Uttara, Jyeshtta and Rohini are good"' },
  },
  GRAIN_STORAGE: {
    KALYANRAMAN: { ...KALYANRAMAN_V2, pageLocus: '"Storing food grains, fruits, flowers, Medicinal plants, Juices, Storing of Agricultural Producs", printed pp.174-177 (PDF 176-179): "Nakshatra Abhijith, Aswini, Rohini, Mrigasira, Punarvasu, Pushyami, Uttaraphalguni, Hasta, Chitra, Swati, Anuradha, Uttarashada, Sravana, Dhanishta, Satabhisha, Uttarabhadrapada and Revati. (16+1) … Tithis 2/3/5/6/7/10/11/12/13/15 Avoid Rikta tithis & Amavasya. Weekdays Sunday, Thursday and Friday"' },
    WILHELM: { ...WILHELM_E, pageLocus: '"Agriculture- Harvest, gathering & storing", printed pp.181-183 (PDF 189-191): "Masa: Avoid the months of Sravana and Bhadrapada. Nakshatra: Rohini, Mrigasira, Punarvasu, Pushya, Uttaraphalguni, Hasta, Svati, Anuradha, Mula, Uttarashadha, Sravana, Uttarabhadrapada and Revati are favorable. Kalaprakasika also considers Bharani, Ardra, Magha and Purvaphalguni as favorable, while Muhurta Chintamani instead considers Asvini, Chitta, Dhanishtha and Satabhisha as favorable; all of which may be considered as middling. Tithi: The 1st, 2nd, 3rd, 5th, 7th, 10th, 11th, 13th and Purnima are favorable. Karana: Sthira Karanas and Vishti Karana should definitely be avoided. Vara: The Varas of the Moon, Jupiter, Venus and Saturn are best. Mercury\'s is middling. Avoid the Varas of the Sun and Mars … Lagna: … Avoid especially the Navamsas of the Sun and Mars. Fixed Rasis are the best, dual Rasis give profit as well as loss, while moveable Rasis should definitely be avoided for collecting grains, though Muhurta Chintamani considers Capricorn to be okay. The Rasi occupied by a malefic, that to be next occupied, or that just vacated by a malefic should not be considered … Bhavas: Benefics are best in the 1st, 5th, 7th, 9th and 10th, and malefics in the 3rd, 6th and 11th. Saturn in the 4th is favorable for gathering and storing grain"' },
    SHRIDHAR_GATHER: { ...SHRIDHAR_HEA, pageLocus: '§21.9 "Gathering of crop", printed pp.595-596 (PDF 632-633): "Tithi: 1,2,3,5,7,10,13 are good. Day: Monday, Thursday, Friday & Saturday; their rulers\' Signs & navamshas (as ascendant) are the best. Wednesday, its lord\'s sign & navamsha is middling in effect. Avoid Sunday & Tuesday, & signs & navamshas of lords of these days. Const.: Stationary (Rohini, 3 Uttras), Bharni, Mrigshira, Ardra, Punarvasu, Pushya, P.Falguni, Magha, Hasta, Swati, Anuradha, Moola, Shravana & Revati are good. Karan: Reject Sthir (fixed) & Vishti Karanas. Ascendant: Fixed signs are the best as they augur many benefits. Common signs results both in profits & loss. Reject movable signs. K.P. opines that … the malefics should not occupy 1st, 2nd & 12th houses in the election chart … In the election chart benefics should be in 1,4,5,7,9,10 houses; & malefics in 3,6,11. Saturn in the 4th house is beneficial for this activity"' },
    RAMAN: { ...RAMAN_BV, pageLocus: 'Chapter XIII, PDF p.48: "In-Gathering of Corn. - After the harvest is over, the produce has to be gathered in. This can be advantageously done under the constellations of Bharani, Rohini, Mrigasira, Pubba, Aridra, Punarvasu, Pushya, Makha, Uttara, Hasta, Swati, Anuradha, Moola, Sravana and Revati. Saturn may be located in the 4th house. All lunar days except the 4th, 6th, 8th, 9th, 12th, 14th and New Moon are auspicious. Monday, Thursday, Friday and Saturday are good. The Amsas of Moon, Jupiter, Venus, and Saturn are also auspicious. Tuesdays and Sundays should be avoided. Movable signs must be rejected …"' },
    RANGACHARYA: { ...RANGACHARYA_I, pageLocus: '"Storing grains in granary", printed p.127 (PDF 135): "Hasta, chitra, swati, Punarvasu, Rohini, Sravana and Dhanishtta are good. Fixed lagnas should be chosen"; also "Haystack", "Storing grains for rice food", p.128 (PDF 136) "Storing grains for sale"' },
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§21.10 "Storing of agricultural produces", printed p.596 (PDF 633): "Tithi: 2,3,5,7,10,11,13 & Full Moon. Day: Sunday, Monday, Thursday, Friday. Const.: Small (Hasta, Ashvani, Pushya), Sweet (Mrigshira, Chitra, Anuradha, Revati), Fixed (Rohini, 3 Uttras), Movable (Punarvasu, Swati, Shravana, Shatbhish, Dhanishta). Ascendant: 2,3,6,9,12 signs are beneficial"; §21.11 "Storing of seeds": "It is beneficial to store seeds in Rohini, Punarvasu, Hasta, Chitra, Swati, Dhanishta; on Wednesday, Thursday, Friday; when a fixed sign is rising. M.G. recommends Shravana also"' },
    JOSHI: { ...JOSHI_KK, pageLocus: '"Storing of fruits, flowers, foodgrains and other agricultural products", printed pp.106-107 (PDF 121-122): "All fixed nakshatras (i.e. Uttaraphalguni, Uttarashada, Uttarabhadrapad & Rohini), all short nakshtras (i.e. Hasta, Ashwini, Pushya and Abhijit), all friendly nakshatras (i.e. Mrigshira, Revati, Chitra and Anuradha) and all movable nakshatras (i.e. Swati, Punarvasu, Shravana, Dhanistha, Shatbhisha) are good for storing agricultural products, fruits, flowers, medicinals plants and juices. Avoid Bhadra, Rikta tithis (4/9/14 tithi), Amavashya (New Moon day) and malefic yogas. Sunday, Thursday and Friday are good"' },
    MUHURTA_CHINTAMANI: { ...MC_SHARMA, pageLocus: 'Chapter 2 sloka 33, printed p.68 (PDF 72): "The storage of the grains is auspicious in the Nakshtras other than those called Mishra or Mixed (Vishakha and Kritika), those called Ugra or intense (All the three Poorvas … Bharani and Magha) Ardra, Ashlesha and Jyeshtha, in all the Ascendants other than those of Cancer, Aries, and Libra and on all the auspicious days"' },
    VASHISTHA: { ...VASHISTHA_KUSUM, pageLocus: 'Weekdays, printed p.54 (PDF 41): "Wednesday: The deity is Vishnu. Classified as mixed nature. Starting literature, learning of music and art, writing work, making of idols, panigrahana (marriage), and collection of cereals and grains etc."' },
  },
  NEW_GRAIN: {
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§21.12 "Eating of new grains", printed pp.596-598 (PDF 633-635): "Tithi: 1,2,3,5,7,10,11,13, are beneficial. Some opine that Nanda Tithis & Vishghatis should be avoided. Day: Wednesday, Thursday & Friday; navamshas & decanate of the lords of these days are auspicious. Const.: Movable …, Small …, Sweet … are beneficent according to M.C., but avoid their Vish Ghatis. According to K.P., chose constellations other than Bharni, Krittika, Ardra, Ashlesha, 3 Poorvas, Jyeshta. According to B.J.S.; auspicious asterism should also be selected from Navanha Chakra - table 21.9 - wherein stellar position is examined with reference to the asterism occupied by Mercury: 1 to 5 good, 6 to 10 good, 11 to 15 good, 16 to 20 Wealth loss, 21 to 24 good, 25 to 26 bad, 27 Best. Month: According to Peeyueshdhara, the lunar month of Paush … & Chaitra … are prohibited (M.C.-2/37). According to K.P., Ashada, Margshirsha & Magha months are only inauspicious. Also when the Sun transits Vishakha asterism it is held that new grain should not be taken. Ascendant: 2,4,5,6,7,9,10,11,12 - are the best. Gemini is middling. The meals should not be taken when the Moon occupies 8th or 12th house of the election chart. Avoid Vishti Karan. 9th & 10th houses in the election chart should be vacant; otherwise it adversely affects prosperity of the grain eater (K.P.). Malefics should be only in 3,6,11"' },
    WILHELM: { ...WILHELM_E, pageLocus: '"Agriculture- Eating new grains & first use of flowers, fruits & leaves", printed pp.178-179 (PDF 186-187): "Masa: Ashada, Margasira and Magha are best avoided according to Kalaprakasika, whereas Muhurta Chintamani recommends avoiding Chaitra and Pushya. Nakshatra: Asvini, Mrigasira, Punarvasu, Pushya, Hasta, Chitta, Svati, Anuradha, Sravana, Dhanishtha, Satabhisha, and Revati are favorable. Kalaprakasika also considers Rohini, Magha, Uttaraphalguni, Visakha, Mula, Uttarashadha and Uttarabhadrapada as favorable, which may be considered as middling. Tithi: The 4th, 6th, 8th, 9th, 12th, 14th and 15th Tithis should be avoided. Karana: Particularly avoid Vishti Karana. Vara: Mercury\'s, Jupiter\'s and Venus\'s Varas are very favorable. Mars\'s and Saturn\'s Varas should be avoided. Lagna: Taurus, Cancer, Leo, Virgo, Libra, Sagittarius, Capricorn and Aquarius are favorable. Gemini is middling. Navamsa/Drikkana: The Navamsas and Drikkanas of Mercury, Jupiter and Venus are favorable … Bhavas: The 9th and 10th should be vacant; otherwise it will have an adverse effect on prosperity. The Moon must not be in the 8th or 12th. Malefics are best in the 3rd, 6th and 11th. Grahas: Avoid the afflictions of Jupiter and Venus. Miscellaneous: Definitely avoid all types of Vishanadi"' },
    MUHURTA_CHINTAMANI: { ...MC_SHARMA, pageLocus: 'Chapter 2 sloka 37, printed pp.73-74 (PDF 77-78): "The eating of the new grains is auspicious in the Nakshtras named as \'Chara\' or Movable (Swati, Poonarvasu, Shravana, Dhanishtha, Shatbhisha), those called Kshipra (Hasta, Ashwini and Pushya), those called Mridu or Delicate (Mrigashira, Rewati, Chitra and Anuradha), in an auspicious Ascendant, in all the tithis, Months, Ascendants Ghatis and Days except on the Nanda Tithis (Pratipada, Shashthi and Ekadashi 1/6/11 Tithis) in the Ghati called Vishghati, in the months of Chaitra and Pausha and on the days of Saturday and Tuesday"; sloka 1/47, p.37 (PDF 41): "When Jupiter and Venus are in old age, in the combustion stage or in childhood stage … eating newly grown grains …" should not be performed' },
  },
  ASSUMING_OFFICE: {
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§20.1 "Coronation - oath by head of the state", printed pp.567-568 (PDF 604-605): "Tithi: 1 (D.H.); 2,3,5,7,10,11,13 (B.H.) Some exponents commend B.H. Rikta & the New Moon are prohibited. Day: Monday, Wednesday, Thursday & Friday are benefic. Tuesday should be rejected, but defence minister can be coronated / appointed on Tuesday … Const.: Small (Hasta, Ashvani, Pushya) Sweet (Mrigshira, Chitra, Anuradha, Revati), Stationary (Rohini, 3 Uttras), Jyeshta & Shravana are favourable. J.V. & K.P. do not recommend Jyeshta. Sage Vasist & Acharya Chandeshvar do not recommend Chitra … Count the Moon\'s asterism from that of the Sun\'s; 1st & 2nd - induce loss of power & finance; 13th & 14th - inculcate fear; 7th, 19th to 22nd - there exists chances of loosing kingdom. Balance asterisms are beneficent. Month: Uttrayana is the most suitable … Chaitra lunar month & when the Sun is in Pisces is prohibited … Ashada, Shravana, Bhadrapada, Adhika (Mal) Maasas & Hari Shayan should be left. Ascendant: Shirodhya signs (3,5,6,7,8,11) are the best. Movable signs as ascendant should be left with efforts … M.C. & Acharya Chandeshvar do not recommend night-time … 8th sign from J.R. or radical ascendant should not be selected … 3, 6 or 11 signs from either radical ascendant or J.R. of the king as election ascendant are the most favourable … There should be no planet in 8th house. Sage Vasist recommends that benefics should occupy 1,2,3,12, houses, angles & trines; & malefics should not be in 1,6,8,or 12 houses"' },
    MUHURTA_CHINTAMANI: { ...MC_SHARMA, pageLocus: 'Chapter 10 "The Coronation of a King", slokas 1-4, printed pp.232-234 (PDF 236-238): "The auspicious Muhurta for the Coronation of a king is when the Sun is in Uttarayana (moving towards the North and is in the signs from Capricorn to Gemini), Jupiter, the Moon and Venus are not combust, Mars, the Sun, the Lord of the Natal Ascendant, the Lord of the present Dasha of the would-be-king and the Lord of the Janama Rashi or sign are endowed with strength. Coronation should not be done in the Chaitra month, on the Rikta Tithis (4/9/14), in the night on Tuesday and in the Adhimaas … The Rajyabhisheka or Coronation of a King is auspicious in the Nakshtras of Jyeshtha, Shravana, those named as Kshipra (Hasta, Ashwini and Pushya), those named as Mridu (Mrigshira, Rewati, Chitra and Anuradha), those named as Dhruwa (the 3 Uttaras and Rohini), in the Ascendant rising with its head (Gemini, Leo, Virgo, Libra Scorpio and Aquarius) or the King\'s natal Ascendant and in the Ascendant of the 3/6/10/11 Houses from the Janama Rashi or sign, when the Malefic Planets are in the 3/6/11 Houses and when there are Benefic Planets in the Angles, the Trines and 11/2/3 … If there are Malefic Planets in the Ascendant … the king will be affected by diseases; … in the 8th House … death; … 5th House … trouble and pain to the King\'s son; … 2nd and the 12th House the King will suffer from poverty; … 10th House … lazi[ness]; … 4th and the 7th Houses, the King will be without rights"; sloka 6, p.50 (PDF 54): Kshipra — Hasta, Ashwini, Pushya, Abhijit' },
    WILHELM: { ...WILHELM_E, pageLocus: '"Politics- Coronation & swearing in", printed pp.280-282 (PDF 288-290): "Ayana: If possible, Uttarayana is preferred. Masa: Avoid Chaitra and Adhi Masa. Paksha: Shukla Paksha is preferred. Nakshatra: Asvini, Rohini, Mrigasira, Pushya, Uttaraphalguni, Hasta, Anuradha, Uttarashadha, Sravana, Uttarabhadrapada and Revati are favorable. Muhurta Chintamani also considers Chitta and Jyeshtha as favorable, while Kalaprakasika also considers Punarvasu as favorable, which can all be considered as middling. Tara: … the Janma Nakshatra as well as the 10th from there is favorable. Tithi: All odd Tithis of Shukla Paksha are favorable, except for the 9th. Of the even Tithis, the 2nd and 10th are favorable. Definitely avoid the 4th, 9th and 14th Tithis. Vara: Varas of benefics and that of the Sun are favorable. Mars\'s Vara at night must be avoided. Lagna: Gemini, Leo and Aquarius are most favorable. Kalaprakasika additionally favors Aries, Taurus, Cancer, Sagittarius and Pisces, while Muhurta Chintamani additionally favors Virgo, Libra and Scorpio … the Lagna of the individual and the Upachaya Rasis from the Moon of the individual are also favorable. Bhavas: There should be no planet in the 8th. Malefics in the 3rd, 6th, and 11th produce pecuniary gains … Benefics are favorable in angles, trines, the 2nd, 3rd and 11th. Malefics in the Lagna afflict the king with disease; in the 8th with death; in the 5th … trouble to the king\'s children; in the 10th … indolent and lazy; in the 2nd or 12th … poverty; and if there are malefics in the 4th or 7th the king will be without rights"' },
    RANGACHARYA: { ...RANGACHARYA_I, pageLocus: 'Chapter IX "Miscellany — Swearing-in-ceremony (Rajyabhisheka)", printed pp.117-118 (PDF 125-126): "MONTH: The Uttarayana is preferred, in the lunar months except chaitra. The intercalary and the suppressed months should be avoided. It should not be performed when Jupiter is in Simha and Makara. The riktha tithis should be avoided. Tuesday is inauspicious, for the ministers, governors etc. but is auspicious for the army - chiefs to swear in. The ceremony should not be performed in the night. Saturday is mediocre. Wednesday, Thursday and Friday are preferred. Sunday with good tithi is most preferred. ASTERISM: Rohini, Mrigasira, Pushyami, Jyeshtta, Uttara, Uttarashada, Uttarabhadra, Revati, Aswini, Hasta, Chitra and Sravana should be the choice. LAGNA: Vrishabha, Mithuna, Simha, Tula, Vrischika should be the choice. The 3rd 6th, 10th, 11th signs of one\'s Janma Rasi or Janma Lagna are preferred. PLANETARY PLACEMENT: The malefic planets should occupy the places, 3,6,11. The benefic planets should occupy 1,2,3,4,5, 7,9,10,11 places. The 8th and 12th should lie vacant. The planets in exaltation, own house, friends house are preferred in more number …"; the Vimsopaka table, p.118' },
    VASHISTHA: { ...VASHISTHA_KUSUM, pageLocus: '"2. Rajyabhisheka muhurta", printed pp.93-95 (PDF 80-82): "This muhurta can be used for oath-taking ceremonies of prime ministers, chief ministers and ministers. Mas: Any month excepting Chaitra in Uttarayana means powerful Venus and Jupiter. Jupiter should not be in Singh (5) or Makara rashi. The month should not be malmas. Tithi: Krishna pratipada, shukla 2, 3, 5, 7, 10, 11 and 13. Rikta tithi - particularly a combination of Tuesday and rikta tithi - is not to be used. Vara: Monday, Sunday, Thursday and Friday. Nakshatra: Ashlesha, Rohini, Mrigashirsha, Punarvasu, 3 uttaras, Hasta, Chitra, Anuradha, Jyeshtha, Sravana and Revati. Lagna: 2, 3, 5, 7 and 8. From the horoscope of the person whose abhisheka is being done, 3, 6, 10 and 11 places from the lagna or janmarashi should be either aspected by benefics or benefics posited in them … benefics in Kendra and Trikona. Houses 8 and 12 should be vacant"; the planets\' table: "Sun 3, 6, 9, 11 / Moon 2, 3, 4, 5, 7, 9, 10, 11 / Mars 6 / Jupiter 1, 4, 5, 9, 11 / Venus 5, 10 / Saturn 3, 11, 12"; "If lagna has a malefic - some ailment, … 8th - death … 5th house - sorrow due to son, … 2nd or 12th - loss of wealth. Malefics in 10th give lassitude, in 4th and 7th loss of prosperity. The Moon in 6, 8, or 12 causes Balarishta yoga"' },
    JOSHI: { ...JOSHI_KK, pageLocus: 'Chapter 12 "Coronation and related muhurtas", printed pp.142-143 (PDF 157-158): "FOR coronation or oath taking ceremony. Sun in Uttarayana … Jupiter Venus and Mars rising, and strong Sun, Mars Natal Lagna lord, muhurta lagna lord, present dasha lord … are considered auspicious. One should avoid Sun in Pisces; Rikta Tithis (4/9/14 tithis); Tuesday, night time and Sun in Dakshinayana … Nakshatras: all short nakshatras (i.e. Hasta, Ashwini, Pushya and Abhijit); all friendly nakshatras (i.e. Mrigshira, Revati, Chitra and Anuradha); all fixed nakshatras (i.e. Uttaraphalguni, Uttarashada, Uttarabhadrapad and Rohini) Jyestha and Shravana are considered auspicious. Days: Sunday, Monday, Thursday and Friday are best. Tithis: All except Rikta Tithis (4/9/14). Lagna: Lagnas of Sirsodaya rashis (i.e. Gemini, Leo, Virgo, Libra, Scorpio and Aquarius lagnas) or lagnas of rashis falling in 3/6/10/11 places from natal moon sign or natal lagna are considered good. In coronation lagna benefics placed in Kendras (1/4/7/10 houses), Trikonas (5/9 houses), 2/3/11 houses are considered good. Malefics placed in 3/6/11 houses give auspicious results. Malefics placed in lagna will cause disease to the king, … Moon placed in 6/8/12 houses in muhurta lagna will not be good for the longevity of the king"' },
    KALYANRAMAN: { ...KALYANRAMAN_V2, pageLocus: '"Taking an Oath, Coronation, Assuming High Office", printed pp.220-221 (PDF 222-223): "Nakshatra Abhijith, Aswini, Rohini, Mrigasira, Pushyami, Uttaraphalguni, Hasta, Chitra, Anuradha, Jyeshta, Uttarashada, Sravana, Uttarabhadrapada and Revati. (13+1) … Tithis 1/2/3/5/6/7/8/10/11/12/13/15 - Avoid Rikta Odd Tithis 1/3/5/7/9/11/13/15. Weekdays Sunday, Monday, Thursday, Saturday are good. Notes: 1. Prefer Uttarayana … Jupiter, the Moon and Venus must be not combust … 4. The Lagna in Sirshodaya (3/5/6/7/8/11 raasis from the natal ascendant or in 3/6/10/11 from the natal Moon of the person and the natal Lagna are acceptable. 5. Avoid the Sun in Pisces; Dakshinaayana; Tuesday and night time; Chaitra month; Rikta tithis and Adhimaasa. 6. Benefics must be in Kendras or Trikonas or 2/3/11 and the malefics must be in 3/6/11. 7. The results of malefics occupying various positions … 8. Moon in 6/8/12 affects the longevity of the king … 10. Some want to avoid Saturday also"' },
    AGARWAL: { ...AGARWAL_GS, pageLocus: '"Coronation ceremony - assuming high office-oath taking-rajyabhishek", printed p.326 (PDF 326): "Days: Monday, Thursday, Friday. Tithis: 2, 3,5, 7, 10,11,13. Nakshatras: Rohini, Mrigshira, Chittra, Anuradha, Revati, all 3 Uttaras Asiesha, Punarvasu, Pushya, Hasta, Jyestha, Shravana, Abhijit. Months: Sun in Uttarayan. Muhurta kundli: lagna signs - 4 views: i. All Shirshodaya rasis: ii. Fixed signs: iii. Signs 2, 3, 4, 6, 7, 9, 12: iv. Lagnas of rasis falling in 3, 6, 10, 11 from natal Moon or natal lagna. Benefics should be in kendras & konas, malefics in 3, 6, 11. 8th should be vacant. Lagna, lagnesh, 10th house, 10th lord, Sun and Moon should be strong … Unfit combinations: lagna sign/month … lagna sign and tithi … Avoid Sun in Pisces"' },
    RAMAN: { ...RAMAN_BV, pageLocus: 'Chapter XVI "Public Matters", PDF pp.54-55: "Electing Head of the State. - The best constellations are Aswini, Rohini, Mrigasira, Punarvasu, Pushya, Uttara, Hasta, Anuradha, Uttarashadha, Sravana, Uttarabhadra and Revati. All odd lunar days (in the bright half) except the 9th are good. The 2nd and 10th lunar days are also favourable. The rising sign must be Aries, Taurus, Gemini, Cancer, Leo, Sagittarius, Aquarius or Pisces. Strengthen the Sun and the Moon. Fortify the Lagna and the 10th and their lords. Let the 8th house be vacant. Confine malefics to Upachayas. If possible, the Sun and the Moon should be placed in Cancer or Leo preferably subject to the aspect of Jupiter. As usual, the Tarabala, Chandrabala, Panchaka, etc., should be carefully looked into. Coronation. - The foregoing rules apply to coronation also. If possible, let Lagna be Leo occupied by the Sun and aspected by Jupiter. In case of democratic rule, the new Government may begin at a time when Kumbha is rising with Saturn in Lagna or in Thula aspected in either case by Jupiter or Venus"' },
  },
  MEET_SUPERIOR: {
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§20.3 "To see a king or paying tributes to him", printed p.571 (PDF 608): "Tithi: Any Tithi of B.H. except 4,9,14 (Rikta). Day: Sunday, Wednesday, Thursday & Friday & amshas of lords of these days are fruitful. Const.: Stationary (Rohini, 3 Uttras), Sweet (Mrigshira, Chitra, Ashvani, Revati), Small (Hasta, Anuradha, Pushya), Shravana & Dhanishta. Ascendant: Fixed signs are the best. K.P. recommends that rising sign be of Mercury & Vargottama Jupiter should be in the ascendant …"; §20.4 "To see master": "Rikta Tithis & Bhadra Karan should be avoided. Benefic Yoga, benefic day, fixed rising sign; & benefics in angle & trine make the time beneficial"' },
    WILHELM: { ...WILHELM_E, pageLocus: '"Politics- Audience with and paying respects to the king or authority figure", printed pp.279-280 (PDF 287-288): "Nakshatra: Asvini, Rohini, Mrigasira, Pushya, Uttaraphalguni, Hasta, Chitta, Anuradha, Sravana, Dhanishtha and Revati are favorable. Some sources also favor Uttarashadha and Uttarabhadrapada as favorable, which can be considered as middling. Tithi: Any Tithi in the Shukla Paksha, except the 4th, 9th or 14th is favorable. If this is not possible, select a normally favorable Tithi in Krishna Paksha. Vara: The Varas of the Sun, Mercury, Jupiter and Venus are most favorable. Lagna: Fixed Rasis are best. Dual Rasis are middling. Navamsa: The Navamsas of the Sun, Mercury, Jupiter and Venus are favorable. Grahas: Avoid the afflictions of Jupiter and Venus the first time visiting the king. Miscellaneous: It is favorable if the Rasi occupied by the Moon at the time is Vasya \\"amenable\\" to the individual\'s Janma Rasi …"' },
    KALYANRAMAN: { ...KALYANRAMAN_V2, pageLocus: '"Meeting Ministers, VIPs, Seniors Officers or Higher Authorities", printed p.220 (PDF 222): "Nakshatra Abhijith, Aswini, Rohini, Mrigasira, Pushyami, Uttaraphalguni, Hasta, Chitra, Anuradha, Uttarashada, Dhanishta, Uttarabhadrapada, Revati, (12+1) … Tithis 2/3/5/7/10/11/13/15 Weekdays Sunday, Monday, Wednesday, Thursday, Friday. Notes: 1. Muhoortha Chintaamani admits Sravana nakshatra also to the list. It admits tithis 6/12/15 also though others admit tithis 2/3/5/7/10/11/13 only. Though it admits only Sunday, Thursday and Friday; Monday and Wednesday are also seen approved, in addition, by some. 2. Chandra and Tara Suddhi are essential. Prefer vargottama lagna with benefics in 1/4/7/10/5/9 houses and malefics in 3/6/11 houses"' },
    JOSHI: { ...JOSHI_KK, pageLocus: '"To meet the kings or senior officials", printed p.143 (PDF 158): "All fixed nakshatras (i.e. Uttaraphalguni, Uttarashada, Uttarabhadrapad and Rohini), all friendly nakshatras (i.e. Mrigshira, Revati, Chitra and Anuradha), all short nakshatras (Hasta, Ashwini, Pushya and Abhijit) and Dhanistha and Sunday, Thursday and Friday are considered auspicious for meeting kings, ministers, senior officials and the like. One should chose benefic tithis & yogas"' },
    AGARWAL: { ...AGARWAL_GS, pageLocus: '"To meet higher authorities", printed p.326 (PDF 326): "Days: Sunday, Monday, Wednesday, Thursday, Friday. Tithis: 2, 3, 5, 7, 10, 11, 13. Nakshatras: Rohini, Mrigshira, Chittra, Anuradha, Revati, all 3 Uttaras Asiesha, Pushya, Hasta, Abhijit. Muhurta kundli: Tarabala and Chandrabala may be insured"' },
    MUHURTA_CHINTAMANI: { ...MC_SHARMA, pageLocus: 'Chapter 2 sloka 13, printed p.56 (PDF 60): "The seeing of Royalty is auspicious in the Nakshtras of Shravana, Dhanistha, the Nakshtras called Mridu, Dhruwa and Kshipra"; sloka 6, p.50 (PDF 54): Kshipra — Hasta, Ashwini, Pushya, Abhijit' },
  },
  JOIN_SERVICE: {
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§20.5 "Starting or joining a service", printed p.572 (PDF 609): "Tithi: Auspicious Tithis except Rikta & the New Moon. Day: Except Tuesday; some do not recommend Saturday also. Const.: Stationary (Rohini, 3 Uttras), Sweet (Mrigshira, Chitra, Anuradha, Revati), Small (Hasta, Ashvani, Pushya), Shravana & Dhanishta. (same as for seeing a king) J.V. recommends that Venus or the Moon should occupy the ascendant, & Ghaat Chandrma should be avoided. Nrip-Baana (the Sun in 5,14,23 degrees in a sign) should be specifically avoided in joining a government service. Add number of Tithi counted from 1st of the B.H. to the ascendant, counted from Aries; & divide the sum by 9. If remainder is 4, then Raja-Panchaka is prevailing; which should be avoided. This is prevalent in south of river Narbada. The Sun is beneficial in 10th or 11th houses. There should be Rashi Maitri & Yoni compatibility among the ruler (employer) & the servant … PRAKASH: … Abhijit Muhurt - when the strong Sun is in the 10th house bestows administrative powers. Avoid malefics in 1, 4, 7, 2 & 12 houses; 8th house should be unoccupied; 8th lord should not have influence on election ascendant"' },
    JOSHI: { ...JOSHI_KK, pageLocus: '"Starting Government Service", printed pp.103-104 (PDF 118-119): "For starting government service, all Laghu nakshatras (i.e. Hasta, Ashwini, Pushya, Abhijit) all Mridu or Friendly nakshtras (i.e. Mrigshira, Revati, Chitra, Anuradha) and all Fixed nakshatras (Uttaraphalguni, Uttarashada, Uttarabhadrapad and Rohini) are considered auspicious. Shravana and Dhanistha are also permitted. Sunday, Wednesday, Thursday, Friday and Monday are good. Jupiter in 7th house, Saturn in 6th house. Sun and/or Mars in 3rd, 10th, or 11th house and Venus and/or Moon in 4th house or Lagna are considered auspicious for starting government service. Avoid Rikta Tithis (4/9/14 tithi) and Tuesday. The above muhurta can also be used for keeping servant or starting service of a master. It is good if there is friendship between Rashi-lords of Servant and Master and proper Yoni-matching … Nakshatra of Master should not be before the nakshatra of Servant … One should see the strength of 10th house and Lagna at the time of joining any service. Proper Chandra Shuddhi (i.e. avoiding Moon\'s placement in 4/8/12 positions from natal Moon) and Tara Shuddhi (Avoiding 3/5/7 Taras) should be done. Some learned are of the view that in all acts concerning business, profession or service one should avoid Poorvaphalguni, Poorvashada, Poorvabhadrapad, Bharani, Kritika, Ardra, Ashlesha and Jyestha nakshatras; Malefic Yogas … malefic Tithis (i.e. Rikta Tithis, 6/8/12/14/30 tithis) Tuesday, Wednesday and Saturday"' },
    KALYANRAMAN: { ...KALYANRAMAN_V2, pageLocus: '"Joining Government Service, Starting any Service in an Establishment, Keeping a Servant, Starting Service under a Master", printed pp.221-222 (PDF 223-224): "Nakshatra Abhijith, Aswini, Rohini, Mrigasira, Pushyami, Uttaraphalguni, Hasta, Chitra, Anuradha, Uttarashada, Sravana, Dhanishta, Uttarabhadrapada and Revati. (13+1) … Tithis 1/2/3/5/7/10/11/13/15 Weekdays Sunday, Monday, Wednesday, Thursday, Friday. Notes: 1. Jyothishavidyaabharana wants to avoid Poorvaphalguni, Poorvashada, Poorvabhadrapada, Bharani, Krittika, Aridra, Aslesha and Jyeshta nakshatras; Tithis 4/9/14 & 6/8/12/14/30; and weekdays Tuesday & Saturday. Some want to reject Wednesday also. Muhoortha Chintaamani rejects Monday. 2. Muhoortha Chintaamani admits only (8) eight Nakshatras … 3. Muhoortha Chintaamani wants benefics in ascendant and the Sun or Mars in 10 or 11. 4. Jupiter must be in the 7th house; Saturn in the 6th; Sun/or Mars in the 3th [3rd], 10th or 11th; Venus/or Moon in the 4th house or Lagna. 5. The 10th house and Lagna must be strong for joining service. 6. Raasi lords of the servant master must be friends. 7. Nakshatra of the master must not precede the nakshatra of the servant. 8. Ensure Chandra and Tara Suddhi and avoid 3-5-7 Nakshatras from the Janmanakshatra. 9. The admission of Sunday … even a token joining formality can be completed on that day. Or else choosing a Surya Hora on any other day can also give the same benefic effect"' },
    WILHELM: { ...WILHELM_E, pageLocus: '"Employees/servants- Employing", printed p.237 (PDF 245): "The following guidelines are to be considered both when employing a servant and also when the servant begins to work. This would also apply to hiring employees or to starting work under an employer. Nakshatra: Asvini, Mrigasira, Pushya, Hasta, Chitta, Anuradha and Revati are favorable. Rohini, Uttaraphalguni, Uttarashadha and Uttarabhadrapada are middling. Vara: The Varas of the Sun, Mercury, Jupiter and Venus are favorable. Avoid the Varas of Mars and Saturn. Bhavas: Benefics are very favorable in the Lagna and Jupiter is also very favorable in the 7th. The Sun and Mars are very favorable in the 10th and 11th and also quite good in the 3rd. Saturn or the 6th lord is very favorable in the 11th or 6th. Venus and the Moon are very favorable in the 4th. Grahas: Saturn should not be influenced by Mars or Rahu. Combinations: Jupiter\'s Vara when Jupiter is in the Lagna, the Sun in the 11th and Saturn is in the 6th indicates that everything will prosper if servants are hired or begin to work at the time"' },
    MUHURTA_CHINTAMANI: { ...MC_SHARMA, pageLocus: 'Chapter 2 sloka 26, printed p.64 (PDF 68): "THE MUHURTA FOR JOINING SERVICE: It is in the Nakshtras named Kshipra (Hasta, Ashwini and Pushya), Maitra (Mrigshira, Rewati, Chitra, Anuradha); on the days of Wednesday, Friday, Sunday and Thursday, when the benefic planets are in the Ascendant and the Sun or Mars are in the 10th or in the 11th House, when there is friendship in the Lords of the Yoni and the Rashi of the Master and the servant … that servants should serve the Masters. Notes: The serial No. of the Nakshtra of the Master should not be before that of the servant"' },
    AGARWAL: { ...AGARWAL_GS, pageLocus: '"To join service", printed p.326 (PDF 326): "Days: Sunday, Monday, Wednesday, Thursday, Friday. Tithis: 2, 3, 5, 7, 10, 11, 12, 13. Nakshatras: Rohini, Mrigshira, Chittra, Anuradha, Revati, all 3 Uttaras, Aswini, Pushya, Hasta, Abhijit, Dhanishta and Saravana are middling. Muhurta kundli: Jupiter should be in 7th, Saturn in 6th, Sun or/and Mars in 3, 10th or 11th. Venus or/and Moon in lagna or 4th house"' },
    RANGACHARYA: { ...RANGACHARYA_I, pageLocus: '"Entering into service or job", printed p.132 (PDF 140): "Hasta, Chitra, Anuradha, Revati, Mrigasira, Pushyami, Wednesday, Thursday, Friday and Sunday and the auspicious tithis are commended. The sun or Mars in the 10th or in the 11th is most preferred"' },
  },
  JOB_APPLICATION: {
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§20.6 "Making an application to the employer", printed p.573 (PDF 610): "Select Ashvani, Rohini, Mrigshira, 3 Uttras, Chitra or Revati; on all days when the Moon is benefic to the aspirant. Lord of the ascendant should be more powerful than lord of the 10th house of the election chart"; §20.7 "Employing a servant - seeking employment": "Divide the 28 asterisms (Abhijit included) in 4 parts, & place them in head, back, stomach & feet … place the asterisms from Janma Nakshatra of the servant, & similarly asterism allocated to head & stomach (numbers 1 to 7th & 15th to 21st) are beneficial to the servant in seeking employment"; Table 20.1: 1st-7th head, 8th-14th back, 15th-21st stomach, 22nd-28th feet' },
    KALYANRAMAN: { ...KALYANRAMAN_V2, pageLocus: '"Applying for Jobs or Party Tickets, Applying for Admission to Governing Bodies", printed pp.222-223 (PDF 224-225): "Nakshatra Abhijith, Aswini, Rohini, Mrigasira, Pushyami, Uttaraphalguni, Hasta, Chitra, Anuradha, Uttarashada, Uttarabhadrapada, Revati. (11+1) … Tithis 2/3/5/7/10/11/13/15. Weekdays Sunday, Monday, Thursday, Friday. Others Chandra-Tara Suddhi is essential"' },
    AGARWAL: { ...AGARWAL_GS, pageLocus: '"To apply for a job or party ticket", printed p.326 (PDF 326): "Days: Sunday, Monday, Thursday, Friday. Tithis: 2, 3, 5, 7, 10, 11, 13, poornima. Nakshatras: Rohini, Mrigshira, Chittra, Anuradha, Revati, all 3 Uttras, Aswini, Pushya, Hasta, Abhijit. Muhurta kundli: tarabala and chandra bala may be done and assured"' },
    RANGACHARYA: { ...RANGACHARYA_I, pageLocus: '"Applying for anything like job etc.", printed p.132 (PDF 140): "1 (D) 2,3,5,7,11,13, and Poornima, Sunday, Monday, Thursday, Friday, Aswini, Revati, Mrigasira, Pushyami, Uttara, Uttarashada, Uttarabhadra, Hasta, Chitra, Anuradha, Sravana, Dhavishtta and Satabhisha are good"' },
  },
  EMPLOY_SERVANT: {
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§20.7 "Employing a servant - seeking employment", printed p.573 (PDF 610): "Divide the 28 asterisms (Abhijit included) in 4 parts, & place them in head, back, stomach & feet. If a master wants to employ a servant then; place the asterisms counting from Janma Nakshatra of the Master. Employing a servant in asterisms allocated to head & stomach is beneficial to the master … Table 20.1 - Beneficence of service to master & servant: 1st to 7th Head, 8th to 14th Back, 15th to 21st Stomach, 22nd to 28th Feet — Beneficial to employ servant: head, stomach; Not beneficial: back, feet"; Daas Chakra, Daasi Chakra (Tables 20.2, 20.3), p.574; "M.G. advises that Daas & Daasis (slave servants) should be collected in Stationary asterisms (Rohini, 3 Uttras)"' },
    JOSHI: { ...JOSHI_KK, pageLocus: '"Starting Government Service", printed pp.103-104 (PDF 118-119): "For starting government service, all Laghu nakshatras (i.e. Hasta, Ashwini, Pushya, Abhijit) all Mridu or Friendly nakshtras (i.e. Mrigshira, Revati, Chitra, Anuradha) and all Fixed nakshatras (Uttaraphalguni, Uttarashada, Uttarabhadrapad and Rohini) are considered auspicious. Shravana and Dhanistha are also permitted. Sunday, Wednesday, Thursday, Friday and Monday are good. Jupiter in 7th house, Saturn in 6th house. Sun and/or Mars in 3rd, 10th, or 11th house and Venus and/or Moon in 4th house or Lagna are considered auspicious for starting government service. Avoid Rikta Tithis (4/9/14 tithi) and Tuesday. The above muhurta can also be used for keeping servant or starting service of a master. It is good if there is friendship between Rashi-lords of Servant and Master and proper Yoni-matching … Nakshatra of Master should not be before the nakshatra of Servant … One should see the strength of 10th house and Lagna at the time of joining any service. Proper Chandra Shuddhi (i.e. avoiding Moon\'s placement in 4/8/12 positions from natal Moon) and Tara Shuddhi (Avoiding 3/5/7 Taras) should be done. Some learned are of the view that in all acts concerning business, profession or service one should avoid Poorvaphalguni, Poorvashada, Poorvabhadrapad, Bharani, Kritika, Ardra, Ashlesha and Jyestha nakshatras; Malefic Yogas … malefic Tithis (i.e. Rikta Tithis, 6/8/12/14/30 tithis) Tuesday, Wednesday and Saturday"' },
    KALYANRAMAN: { ...KALYANRAMAN_V2, pageLocus: '"Joining Government Service, Starting any Service in an Establishment, Keeping a Servant, Starting Service under a Master", printed pp.221-222 (PDF 223-224): "Nakshatra Abhijith, Aswini, Rohini, Mrigasira, Pushyami, Uttaraphalguni, Hasta, Chitra, Anuradha, Uttarashada, Sravana, Dhanishta, Uttarabhadrapada and Revati. (13+1) … Tithis 1/2/3/5/7/10/11/13/15 Weekdays Sunday, Monday, Wednesday, Thursday, Friday. Notes: 1. Jyothishavidyaabharana wants to avoid Poorvaphalguni, Poorvashada, Poorvabhadrapada, Bharani, Krittika, Aridra, Aslesha and Jyeshta nakshatras; Tithis 4/9/14 & 6/8/12/14/30; and weekdays Tuesday & Saturday. Some want to reject Wednesday also. Muhoortha Chintaamani rejects Monday. 2. Muhoortha Chintaamani admits only (8) eight Nakshatras … 3. Muhoortha Chintaamani wants benefics in ascendant and the Sun or Mars in 10 or 11. 4. Jupiter must be in the 7th house; Saturn in the 6th; Sun/or Mars in the 3th [3rd], 10th or 11th; Venus/or Moon in the 4th house or Lagna. 5. The 10th house and Lagna must be strong for joining service. 6. Raasi lords of the servant master must be friends. 7. Nakshatra of the master must not precede the nakshatra of the servant. 8. Ensure Chandra and Tara Suddhi and avoid 3-5-7 Nakshatras from the Janmanakshatra. 9. The admission of Sunday … even a token joining formality can be completed on that day. Or else choosing a Surya Hora on any other day can also give the same benefic effect"' },
    WILHELM: { ...WILHELM_E, pageLocus: '"Employees/servants- Employing", printed p.237 (PDF 245): "The following guidelines are to be considered both when employing a servant and also when the servant begins to work. This would also apply to hiring employees or to starting work under an employer. Nakshatra: Asvini, Mrigasira, Pushya, Hasta, Chitta, Anuradha and Revati are favorable. Rohini, Uttaraphalguni, Uttarashadha and Uttarabhadrapada are middling. Vara: The Varas of the Sun, Mercury, Jupiter and Venus are favorable. Avoid the Varas of Mars and Saturn. Bhavas: Benefics are very favorable in the Lagna and Jupiter is also very favorable in the 7th. The Sun and Mars are very favorable in the 10th and 11th and also quite good in the 3rd. Saturn or the 6th lord is very favorable in the 11th or 6th. Venus and the Moon are very favorable in the 4th. Grahas: Saturn should not be influenced by Mars or Rahu. Combinations: Jupiter\'s Vara when Jupiter is in the Lagna, the Sun in the 11th and Saturn is in the 6th indicates that everything will prosper if servants are hired or begin to work at the time"' },
    MUHURTA_CHINTAMANI: { ...MC_SHARMA, pageLocus: 'Chapter 2 sloka 26, printed p.64 (PDF 68): "THE MUHURTA FOR JOINING SERVICE: It is in the Nakshtras named Kshipra (Hasta, Ashwini and Pushya), Maitra (Mrigshira, Rewati, Chitra, Anuradha); on the days of Wednesday, Friday, Sunday and Thursday, when the benefic planets are in the Ascendant and the Sun or Mars are in the 10th or in the 11th House, when there is friendship in the Lords of the Yoni and the Rashi of the Master and the servant … that servants should serve the Masters. Notes: The serial No. of the Nakshtra of the Master should not be before that of the servant"' },
    AGARWAL: { ...AGARWAL_GS, pageLocus: '"Employing servants", printed p.325 (PDF 325): "Days: all days except Tuesday and Saturday. Muhurta kundli: lagna should be a fixed sign. There should not be any affliction to Mercury. 6th lord should be in 11th and 11th lord should be strong, Prefer Saturn in 11th without aspect of Mars and Rahu"' },
    RAMAN: { ...RAMAN_BV, pageLocus: 'Chapter X "Elections Concerning General Matters", PDF p.36: "Employing Servants. - Avoid Tuesdays and Saturdays. Look to the strength of the 11th house lord. Saturn must be in the 11th free from the aspect of Mars or Rahu. Make the lord of the sixth occupy the 11th and as far as possible, choose a fixed sign. Afflictions to Mercury should also be avoided as they bring about theft in the house"' },
    RANGACHARYA: { ...RANGACHARYA_I, pageLocus: '"Employing servants", printed p.132 (PDF 140): "Avoid Tuesday, Wednesday and Saturday. Mrigasira, Revati, Anuradha, Chitra, Uttara, Uttarashada, Uttarabhadra and Rohini are good"' },
  },
  FILE_SUIT: {
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§20.21 "Litigation", printed p.584 (PDF 621): "Help is taken from Kul, Akul & Kulakul Tithis, weekdays & nakshatras mentioned under 20.9. The relevant elements should be selected. Based on whether the aspirant is Petitioner or Respondent; & also whether he desires to win, lose or compromise; he may select the suitable elements for filing papers in the court or inserting signatures on the court papers / petition etc. Other matters as discussed under war may also considered similarly in litigation. Nadi Swar shall play a significant role in arguments." §20.9 d) Table 20.6, printed p.577 (PDF 614): "Kul, Akul & Kula-Kul elements … These are considered in war & litigation. The Yoga is formed when all the three elements are concurrent; if either is missing then, the said effect … does not happen. Asterism — Kul: Chitra, Vishakha, Jyeshta, P.Shada, Shravana, P.Bhadra, Ashvani, Krittika, Mrigshira, Pushya, Magha, P.Falguni; Akul: Bharni, Rohini, Punarvasu, Ashlesha, Hasta, Swati, Anuradha, Dhanishta, Revati, 3 Uttras; Kula-Kul: Moola, Ardra, Abhijit, Shatbhish. Tithi — Kul 4,8,12,14; Akul 1,3,5,7,9,11,13,15,30; Kula-Kul 2,6,10. Day — Kul Tuesday, Friday; Akul Sunday, Monday, Thursday, Saturday; Kula-Kul Wednesday. Result — Kul: attacked party wins (respondent in litigation); Akul: attacker wins (petitioner in litigation); Kula-Kul: treaty results"' },
    JOSHI: { ...JOSHI_KK, pageLocus: '"Journey for war, disputes etc.", printed pp.137-138 (PDF 152-153): "… the factors discussed here can be used not only to decide \\"when to attack\\" but also for filing a suit in a Court of law or any other type of dispute. 1. \'Kula\' - \'Akula\' - \'Kulakula\' nakshatras, tithis and days: Swati, Bharani, Ashlesha, Dhanistha, Revati, Hasta, Anuradha, Punarvasu, Uttaraphalguni, Uttarashada, Uttara bhadrapad and Rohini, these twelve nakshatras; odd tithis (i.e. 1/3/5/7/9/11/13/15 tithis) and Sunday, Monday, Thursday and Saturday these four days are called \'Akula\'. If a war or dispute starts in \'Akula\' nakshatras, tithis and days the attacker or the plaintiff will win. … Moola, Shatbhisha, Ardra and Abhijit these four nakshatras; 2/6/10 tithis and Wednesday are \'Kulakula\' and any war or dispute in these nakshatras, tithis and days will lead to a compromise. Poorvaphalguni, Poorvashada, Poorvabhadrapad, Ashwini, Pushya, Magha, Mrigshira, Shravana, Kritika, Vishakha, Jyestha and Chitra these twelve nakshatras; 4/8/12/14 tithis and Tuesday and Friday are called \'Kula\' and any war or dispute in these tithis, nakshatras and days will lead to the victory of the attacked or defendant. These should be avoided while chosing a muhurta for attacking or for filing a suit in a court of law. See Table 11.7"; p.149 (PDF 164): "For filing a suit in a court of law - see the muhurta for \'vijay yatra\' in chapter 11"' },
    KALYANRAMAN: { ...KALYANRAMAN_V2, pageLocus: '"Waging War or Attacking or Filing a Court Case or Involving in Litigation", printed p.199 (PDF 201): "Nakshatra Bharani, Rohini, Punarvasu, Aslesha, Uttaraphalguni, Hasta, Swati, Anuradha, Uttarashada, Dhanishta, Uttarabhadrapada, Revati. (12) … Tithis 1/3/5/7/9/11/13/15 Weekdays Sunday, Monday, Thursday and Saturday. Notes: 1. Admitted factors called Akula are good to start such activities to gain victory. Rejected factors are called Kula, which will be advantageous to the opponent. 2. Avoid nakshatras Poorvaphalguni, Poorvashada, Poorvabhadra pada, Aswini, Pushyami, Makha, Mrigasira, Sravana, Krittika, Visaka, Jyeshta, Chitra and tithis 4/8/12/14. Avoid Tuesday & Friday called Kula, which will be advantageous to the opponent. 3. Muhoortha Chintaamani defines Akula; Kula-Kula and Kula … The nakshatras Moola, Satabhisha, Aridra, and Abhijith; the tithis 2/6/10 and Wednesday - each of these is named as Kula-Kula … Akula brings victory to plaintiff, Kula to the defendant and Kula-Kula to both as of a compromise. 4. These nakshatras, weekdays and tithis are good for embarking on a Vijayayaatra"' },
    WILHELM: { ...WILHELM_E, pageLocus: '"Litigation", printed p.250 (PDF 258): "The guidelines set forth for TRAVEL- SETTING OUT TO OVERCOME ENEMIES are those that are to be followed for determining a time to engage in litigation. For making settlements, see WAR- MAKING PEACE. Mercury is the karaka for man made law, therefore make sure that Mercury is well-disposed at the time of filing lawsuits, and for all legal matters"; "Travel- setting out to overcome enemies", printed pp.325-327 (PDF 333-335): "Akula Nakshatras, Tithis and Varas: Bharani, Rohini, Punarvasu, Aslesha, Uttaraphalguni, Hasta, Svati, Anuradha, Uttarashadha, Dhanishtha, Uttarabhadrapada and Revati; all odd Tithis; and the Varas of the Sun, Moon, Jupiter and Saturn are known as Akula … A war, fight, or litigation begun under Akula … give victory to the invader, attacker, visitor or plaintiff. Kula Nakshatras, Tithis and Varas: Asvini, Krittika, Mrigasira, Pushya, Magha, Purvaphalguni, Chitra, Visakha, Jyeshtha, Purvashadha, Sravana and Purvabhadrapada; the 4th, 8th, 12th and 14th Tithis; and the Varas of Mars and Venus … Kulaakula: Ardra, Mula and Satabhisha, the 2nd, 6th and 10th Tithis, and Mercury\'s Vara … Tithi: Paksha Chidra (4th, 6th, 8th, 9th, 12th and 14th) Tithis should be avoided … Lagna: Aries, Taurus, Leo and Sagittarius are most favorable … Other moveable Rasis and other Sirodaya Rasis (Virgo and Scorpio) are also favorable. Gemini should always be avoided, even if holding benefics … The Moon should not be in the 4th, if it is there will be some initial success, but the end will be fatal"' },
    RAMAN: { ...RAMAN_BV, pageLocus: 'Chapter XVII "Miscellaneous Elections", PDF p.55: "Filing Law-suits. - Avoid the usual unfavourable lunar days. Aswini, Rohini, Mrigasira, Pushya, Uttara, Hasta, Chitta, Anuradha, Dhanishta and Revati are good. Tuesday and Saturday should be avoided. Strengthen the Lagna by placing Jupiter in a Trikona. Let there be no malefic in the 6th house. The lords of Lagna and the 6th should be as far apart as possible. The Lagna or at least the Navamsa must be Aries in order to assure success to the litigation. If benefics occupy kendras or occupying the male signs, have beneficial aspects, there will be peace between the parties"' },
    VASHISTHA: { ...VASHISTHA_KUSUM, pageLocus: '"4. To file a suit or litigation — Civil suit", printed pp.99-100 (PDF 86-87): "Tithi: 3, 5, 8, 10, 13 (shukla), 15. Vara: Sunday, Wednesday, Thursday and Friday. Nakshatra: Bharani, Ardra, Ashlesha, Magha, 3 poorvas, Jyeshtha, Moola. Lagna: 3, 6, 7, 8 and 11. Benefics in Kendras, malefics in 3, 6, 11 and 8th vacant. Moon and Mars should be strong, transit favourable for the native. After consulting a lawyer, if one files a suit in an appropriate muhurta, there will be success"' },
    AGARWAL: { ...AGARWAL_GS, pageLocus: '"Filing law suits or nomination paper", printed p.325 (PDF 325): "Days: Tuesday, Wednesday, Thursday, Friday. Tithis: 3, 5, 8, 10, 13, 15, 30. Nakshatras: Rohini, Mrigshira, Punarvasu, Hasta, Chittra, Dhanishta, Anuradha, Revati, all 3 Uttras, Aswini. Or do as per Akula yoga. Muhurta kundli: Benefics in kendras & konas, malefics in 3, 11. 8th should be vacant. Signs 3, 6, 7, 8, or 11 should be lagna. There should not be a malefic in 6th. Prefer Jupiter to be in a kona"' },
    RANGACHARYA: { ...RANGACHARYA_I, pageLocus: '"To file a suit", printed p.132 (PDF 140): "3,5,8,10,13 and Poornima, Sunday, Wednesday, Thursday, Friday, Bharani, Jyeshtta, Makha, Pubba, Poorvashada, Jyeshtta, are good. Chandrabala is a must"' },
  },
  COMPROMISE: {
    RAMAN: { ...RAMAN_BV, pageLocus: 'Chapter XVI "Public Matters", PDF p.56: "Making Peace. - This is an important item in the lives of nations. Peace must be under a strong influence of Jupiter. The ascending sign and amsa must be either Pisces or Taurus or Virgo. Benefics should be strongly placed. Saturn must be either in the 12th or in Upachaya. There should be no conjunction between Mars and Rahu or Mars and Saturn or Rahu and Saturn. The signatories to the Peace Treaty must themselves have their horoscopes harmoniously disposed. The constellations of Mrigasira, Chitta, Dhanishta, Aridra, Swati, Satabhisha, Anuradha and Uttarabhadra should be avoided, as also the 4th, 7th, 8th, 9th and 12th lunar days and New and Full Moon days. Peace made under the following combinations is said to last for a long time: (1) The Moon should be in the 10th house, Jupiter in the 4th and Mars and Saturn in the 11th … (5) Jupiter in Lagna (which should be a fixed sign), Mercury in the 7th and the Moon in the 10th"' },
    WILHELM: { ...WILHELM_E, pageLocus: '"War- Making peace & treaties", printed pp.329-330 (PDF 337-338): "Nakshatra: Pushya, Anuradha and Purvaphalguni are most favorable. Avoid Mrigasira, Ardra, Chitta, Svati, Anuradha, Dhanishtha, Satabhisha and Uttarabhadrapada. Other favorable Nakshatras are also acceptable. Tithi: Avoid the 4th, 7th, 9th, 14th and 15th Tithis and select a favorable Tithi. The 8th and 12th Tithis are particularly favorable. Karana: Taitila Karana is particularly favorable, though any favorable Karana will do. Lagna: The Lagna or Navamsa Lagna is very favorable if Taurus, Virgo or Pisces. Jupiter in or aspecting the Lagna does much to insure peace. Bhavas: Saturn is very favorable in an Upachaya or the 12th. Grahas: Conjunctions between Mars and Saturn, Mars and Rahu, or Saturn and Rahu should be avoided. Combinations: 1. Venus aspecting the Lagna supports the treaty. 2. The Moon in the 10th, Jupiter in the 4th and Mars or Saturn in the 11th make peace last a long time …"' },
    KALYANRAMAN: { ...KALYANRAMAN_V2, pageLocus: '"Striking Compromise, Signing Treaties or Agreements", printed p.198 (PDF 200): "Nakshatra Pushyami, Poorvaphalguni, Anuradha. Tithis 8/12. Weekdays Monday, Thursday, Friday, Wednesday are good. Yoga Benefic yogas - 2/3/4/5/7/8/11/12/14/16/18/20/21/22/23/24/25/26. Karana Taitila. Others The Lagna must have aspect of Venus. Note: Refer to the notes below Waging war or attacking or filing a court case or involving in litigation"' },
  },
  LEND_MONEY: {
    KALYANRAMAN: { ...KALYANRAMAN_V2, pageLocus: '"Making Monetary Transactions, Lending Or Borrowing, Depositing In A Bank, Taking Insurance Policy", printed p.217 (PDF 219): "Nakshatra Aswini, Mrigasira, Pushyami, Swati, Visaka, Anuradha, Sravana, Dhanishta, Satabhisha and Revati. (10) … Tithis 1/2/3/5/6/7/8/10/11/12/13/15 Weekdays Sunday, Monday, Wednesday, Thursday, Friday, Saturday. Notes: 1. Muhoortha Chintaamani admits the eight (8) nakshatras - Swati, Punarvasu, Visaka, Pushyami, Sravana, Dhanishta, Satabhisha, Aswini and the four (4) Mridu nakshatras - Mrigasira, Revati, Chitra and Anuradha - in all 12. It adds Punarvasu and Chitra to the list provided above. 2. For taking or giving loan Tuesdays must be avoided. So also the 11th yoga namely - Vriddhi Yoga - and Sthira Karanas and Bhadra must be avoided and also Amrita Siddhi yoga. 3. Avoid Wednesdays for giving loan but it is good for depositing. 4. The ascendant must be movable 1/4/7/10 raasis. Houses 5/8/9 must be unoccupied. 5. Days rejected for taking loans are accepted for giving. 6. Borrowing is prohibited on Tuesday and Samkranti days"; "Obtaining Beneficial Results in Trade, Starting Industries, Giving Loans, Paying Back or Taking Loans", printed p.218 (PDF 220): "Nakshatra Abhijith, Aswini, Mrigasira, Punarvasu, Pushyami, Hasta, Chitra, Swati, Anuradha, Sravana, Dhanishta, Satabhisha, Revati (13) … Tithis 1/2/3/5/6/7/8/10/11/12/13/15 Weekdays Sunday, Monday, Wednesday, Thursday, Friday. Notes: Muhoortha Chintaamani says that loans given on days of four (4) nakshatras of Teekshna, (Moola, Jyeshta, Aridra and Aslesha); the two (2) of Misra, (Visaka and Krittika) the four (4) of Dhruva, (Uttaraphalguni, Uttarashada, Uttarabhadrapada and Rohini) and the five (5) of Ugra (Poorvaphalguni, Poorvashada, Poorvabhadrapada, Bharani and Makha) could be lost becoming unrecoverable … Bhadra Karana and Vyatipata yoga also come under this list. When the (15) Teekshna - Misra - Dhruva - Ugra - nakshatras are to be rejected for giving loans only the rest - (13) thirteen nakshatras are suitable for giving loans"' },
    MUHURTA_CHINTAMANI: { ...MC_SHARMA, pageLocus: 'Chapter 2 sloka 27, printed p.64 (PDF 68): "THE MUHURTA OF LENDING AND BORROWING MONEY: The use of money (the exchange of money, depositing money in the Bank, taking LIC Policy and lending money etc) is auspicious in the Swati, Punarvasu, the Nakshtras called Mridu (Mrigshira, Rewati, Chitra and Anuradha) Vishakha, Pushya, Shravana, Dhanishtha, Shatbhisha, and Ashwini Nakshtras; in the Ascendants called chara (Movable) which are 1/4/7/10 and if there is no planet in the 9th, 5th and 8th Houses from the Ascendant. Money is not to be borrowed on Tuesday. On the day of the Sankranti of the Sun in the Vridhi yoga, in the Hasta Nakshtra and on Sunday - money borrowed at these times continues to exist in the borrower\'s family for ever … Money should not be lent to any one on Wednesday. Notes: … Collection of money is good on Wednesday"; sloka 2/24, printed p.62 (PDF 66): "THE NAKSHTRAS WHICH SHOULD BE REJECTED IN LENDING AND BORROWING AND AMASSING MONEY: The money which is lent to some one as a loan, is kept in a chest or buried under ground, is given to some one on interest or is lost in the Nakshtras named Teekshana, Mishra, Dhruwa and Ugra and the yogas of Bhadrakarana and Vyatipaata is not got back"' },
    RANGACHARYA: { ...RANGACHARYA_I, pageLocus: '"Loans", printed p.129 (PDF 137): "1) For giving loan or for interest business, prefer the asterisms viz. Swati, Punarvasu, Pushyami, Sravana, Mrigasira, Revati, Chitra, Anuradha, Aswini. 2) Choose the cardinal signs for Lagnas. 3) The 5th, 8th and 9th houses should lie vacant. 4) Never lend money on Wednesday. If you do so you will never get it back. 5) Never borrow money on Tuesday. If you do so your life time doesn\'t suffice to repay it. 6) Try to clear off the debt on Tuesday. 7) Collect and accumulate money on Wednesday. 8) Bharani is good for collection and accumulation of money. Deposits of money in Banks should be done in Bharani, 9) Do not make debt in Vriddhi yoga, in Hasta and on Sunday. If you do so you can never make repayment. 10) For interest business the placement of Mercury in the 8th 9th and 5th is commended. 11) Dhanishatta Panchaka may be chosen for interest business. 12) Choose the dwipushkara yoga or the tripushakara yoga for interest business"' },
    WILHELM: { ...WILHELM_E, pageLocus: '"Business/Finance - Lending & Pledging", printed p.191 (PDF 199): "Nakshatra: Things lent or pledged under Bharani, Krittika, Aslesha, Magha, Purvaphalguni, Visakha, Jyeshtha, Mula, Purvashadha or Purvabhadrapada do not return or are not a source of gain. Rohini, Uttaraphalguni, Uttarashadha and Uttarabhadrapada are similar in effect, though not as powerful. Loaning or Giving Gold: Parting with gold when the Nakshatra is Krittika, Magha, Mula, Satabhisha, Uttaraphalguni, Punarvasu, or under one\'s Janma Nakshatra is said to cause destitution, though the person that receives the gold will flourish … Karana: Things lent or pledged during Vishti Karana do not return or are not a source of gain. Vara: Avoid Mercury\'s Vara when lending. It is very unfavorable to lend on Saturn\'s Vara during Amavasya"' },
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§25.2.1 "Lending money", printed p.682 (PDF 717): "Money lending in Movable (Punarvasu, Swati, Shravana, Shatbhish, Dhanishta), Sweet (Mrigshira, Chitra, Anuradha, Revati), Vishakha & Ashvani; in movable signs; when there is no planet in 5th, 8th or 9th houses; is auspicious. According to Peeyueshdhara, if in Sharp, Cruel, Mixed & Stationary asterisms; Bhadra & Vyatipaata Yoga; money or precious material is lent or buried or kept in a box or given to someone; it is destroyed - does not come back (it is either stolen or lost). K.P. also agrees that in the above asterisms things given or pledged or money lent with interest do not return. It is further advised that the person who parts with his gold in asterisms of Krittika, Magha, Moola, Shatbhish, U.Falguni, Punarvasu & Janma nakshatra will be reduced to penury; & he who receives shall prosper"; §25.2.2, p.682 (PDF 718): "Money should not be lent on Wednesday, it is bad for the person who gives money on loan"' },
    JOSHI: { ...JOSHI_KK, pageLocus: '"Monetary Transactions", printed p.103 (PDF 118): "Swati, Punarvasu, Shravana, Dhanistha Shatbhisha, Mrigshira, Revati, Chitra, Anuradha, Ashwini, Pushya and Vishkha nakshatras; movable lagnas (i.e. lagnas of 1/4/7/10 rashis) with 5/8/9 houses unoccupied are considered good for monetary transactions e.g. taking and giving money, depositing money in bank, taking Insurance Policy and the like. To be avoided in taking loan and giving loan: Avoid Tuesday; Vriddhi Yoga (11th Yoga), Samkranti day … and Amrit Siddhi Yoga formed by Sunday and Hasta nakshatra for taking loan as it will create difficulty in repayment. Avoid Wednesday for giving loan. Wednesday is good for depositing money. The days which are to be avoided for taking loan are good for repayment of loan"' },
    RAMAN: { ...RAMAN_BV, pageLocus: 'Chapter X "Elections for Business", PDF p.38: "Lending Money. - One should not lend money on days ruled by Krittika, Makha, Moola, Satabhisha, Uttara, Punarvasu or one\'s Janma Nakshatra day. One should try to receive money on these days. Tuesdays and Fridays are also inauspicious. Never lend money on a New Moon day happening to be Saturday. The lords of the ascendant and the 7th should be harmoniously disposed. The Moon\'s situation in Scorpio is bad for the lender"; "Pledging. - Articles pledged under Visakha, Krittika (Sadhana), Bharani, Makha, Pubba, Poorvashadha, Poorvabhadra (Vajra), Aridra, Aslesha, Jyeshta and Moola (Theekshana) do not return. Jupiter and the Moon should be mutually well disposed. Tuesdays and Fridays are inauspicious as also lunar days declared generally evil"' },
    VASHISTHA: { ...VASHISTHA_KUSUM, pageLocus: '"Loan-giving Muhurta", printed p.135 (PDF 122): "Tithi: 1 (krishna paksha), 2, 3, 5, 6, 7, 8, 10, 11, 12, 13 (shukla) and 15. Vara: Sunday, Monday, Thursday, Friday and Saturday. Nakshatra: Ashlesha, Mrigashirsha, Punarvasu, Pushya, Chitra, Swati, Anuradha, Jyeshtha, Sravana, Dhanishtha, Shatabhisha and Revati. Lagna: 1, 4, 7 and 10. Benefics in 5 and 9. Eighth vacant. Note: Do not give loan on a Tuesday and Wednesday"' },
    AGARWAL: { ...AGARWAL_GS, pageLocus: '"Lending of money", printed p.328 (PDF 328): "Nakshatras to be avoided: Moola, Jyestha, Aridra, Ashlesha, all 3 Poorvas, Bharani, Magha, Vishakha, Krittika, all 3 uttaras, Rohini. Avoid: Bhadra (vishti karan) and Vyatipat yoga"; "Important notes: i. In the case of all the muhurtas stated in these charts, tara shuddhi and chandra shuddhi is a must. ii. Particularly all malefic yogas & Vishti karna be avoided in all cases"' },
  },
  BORROW_MONEY: {
    KALYANRAMAN: { ...KALYANRAMAN_V2, pageLocus: '"Borrowing", printed p.218 (PDF 220): "Nakshatra Bharani, Krittika, Rohini, Aslesha, Makha, Poorvaphalguni, Visaka, Chitra, Moola, Poorvashada, Satabhisha and Poorvabhadrapada (12) … Tithis 1/2/3/5/6/7/8/10/11/12/13/15 - Avoid Rikta. Weekdays Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday"; with "Making Monetary Transactions …", p.217 (PDF 219): "2. For taking or giving loan Tuesdays must be avoided. So also the 11th yoga namely - Vriddhi Yoga - and Sthira Karanas and Bhadra must be avoided and also Amrita Siddhi yoga … 4. The ascendant must be movable 1/4/7/10 raasis. Houses 5/8/9 must be unoccupied … 6. Borrowing is prohibited on Tuesday and Samkranti days (days of Sun\'s ingress to raasis). 7. Muhoortha Chintaamani says that money borrowed on an Amrita Siddhi Yoga which is formed when on a Sunday, Hasta Nakshatra is prevalent, it will create difficulty in repayment"' },
    MUHURTA_CHINTAMANI: { ...MC_SHARMA, pageLocus: 'Chapter 2 sloka 27, printed p.64 (PDF 68): "THE MUHURTA OF LENDING AND BORROWING MONEY: The use of money … is auspicious in the Swati, Punarvasu, the Nakshtras called Mridu (Mrigshira, Rewati, Chitra and Anuradha) Vishakha, Pushya, Shravana, Dhanishtha, Shatbhisha, and Ashwini Nakshtras; in the Ascendants called chara (Movable) which are 1/4/7/10 and if there is no planet in the 9th, 5th and 8th Houses from the Ascendant. Money is not to be borrowed on Tuesday. On the day of the Sankranti of the Sun in the Vridhi yoga, in the Hasta Nakshtra and on Sunday - money borrowed at these times continues to exist in the borrower\'s family for ever, that is, such debt is never completely paid off … Notes: The family burdened with debt should keep fast on Tuesday"' },
    RANGACHARYA: { ...RANGACHARYA_I, pageLocus: '"Loans", printed p.129 (PDF 137): "2) Choose the cardinal signs for Lagnas. 3) The 5th, 8th and 9th houses should lie vacant … 5) Never borrow money on Tuesday. If you do so your life time doesn\'t suffice to repay it … 9) Do not make debt in Vriddhi yoga, in Hasta and on Sunday. If you do so in either of the three, you can never make repayment"' },
    JOSHI: { ...JOSHI_KK, pageLocus: '"Monetary Transactions", printed p.103 (PDF 118): "Swati, Punarvasu, Shravana, Dhanistha Shatbhisha, Mrigshira, Revati, Chitra, Anuradha, Ashwini, Pushya and Vishkha nakshatras; movable lagnas (i.e. lagnas of 1/4/7/10 rashis) with 5/8/9 houses unoccupied are considered good for monetary transactions e.g. taking and giving money … To be avoided in taking loan and giving loan: Avoid Tuesday; Vriddhi Yoga (11th Yoga), Samkranti day (day when Sun Changes sign) and Amrit Siddhi Yoga formed by Sunday and Hasta nakshatra for taking loan as it will create difficulty in repayment"' },
    WILHELM: { ...WILHELM_E, pageLocus: '"Business/Finance - Borrowing", printed pp.190-191 (PDF 198-199): "Nakshatra: Asvini, Mrigasira, Punarvasu, Pushya, Chitra, Svati, Visakha, Anuradha, Sravana, Dhanishtha, Satabhisha and Revati are favorable. Avoid Hasta; else the debt is never repaid. Vara: Avoid the Sun\'s Vara, else the debt is never repaid, and also Mars\'s Vara. Lagna: Moveable Rasis are best, especially Libra. Avoid fixed Rasis. Yoga: Avoid Vriddhi Yoga; else the debt is never paid. Bhavas: The 8th Bhava must be unoccupied, and the 5th and 9th are best unoccupied as well. Miscellaneous: Avoid Sankranti; else the debt is never repaid. The planet and Bhava that rules that which the borrowed money is meant for should be well-disposed"' },
    RAMAN: { ...RAMAN_BV, pageLocus: 'Chapter X "Elections for Business", PDF p.38: "Borrowing Money. - Do not borrow money on days ruled by Krittika, Moola, Punarvasu, Dhanishta and Janma Nakshatra. Moon\'s conjunction with Mars and Saturn should be avoided as otherwise there will be quarrels and litigation. If the money is intended for quick use on domestic or personal matters, the Moon should be in good aspect to the ascendant. If the borrowed money is to be spent on business the Moon must be in a favourable situation with regard to Mercury and lord of Lagna. For any election, purity of lunar day, weekday, any constellation and Tarabala are essential and further considerations come in only later on"' },
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§25.2.2 "Borrowing money", printed p.682 (PDF 717-718): "Money should not be borrowed in Sankranti, Vridhi yoga, Hasta asterism, Sunday & Tuesday; as the loan remains a burden for generations. It is beneficial to return money in the above time. Money should not be borrowed on Tuesday even by a mistake … Wednesday is beneficial for taking loan - it is beneficial for the person who takes loan (Ratanmala, Jyotiprakash)"' },
    VASHISTHA: { ...VASHISTHA_KUSUM, pageLocus: '"Loan-taking Muhurta", printed p.136 (PDF 123): "Tithi: The same as in the loan-giving muhurta above. Vara: The same as above. Nakshatra: The same as above. Mrigashirsha, Chitra, Anuradha and Revati are specially good. Lagna: The same as above. Note: One should not accept loan on a Tuesday, Samkranti day, Sunday and Hasta nakshatra forming Siddhi yoga and Vriddhi yoga"' },
  },
  REPAY_DEBT: {
    WILHELM: { ...WILHELM_E, pageLocus: '"Business/Finance - Paying debts", printed pp.192-193 (PDF 200-201): "The first payment on the particular debt is the most important time to consider. The times of subsequent payments are much less significant. Nakshatra: Asvini, Punarvasu, Pushya, Svati and Satabhisha are best. Krittika, Ardra, Magha, Purvaphalguni, Visakha, Jyeshtha, Mula, Sravana and Dhanishtha are middling. Tithi: Rikta (4th, 9th and 14th) Tithis are the most favorable. Avoid the 6th, 8th and 12th. Karana: Avoid Vishti Karana. Vara: In addition to the normally favorable Varas, Saturn\'s Vara is favorable. Particularly avoid Mercury\'s Vara. Lagna: Taurus, Gemini and Libra are most favorable. Avoid fixed Rasis. Bhavas: A malefic in the 8th is favorable. Combinations: 1. The Moon in the Lagna in Asvini or Anuradha forms Maitra \'friendly\' Muhurta … 2. Gulika in the Lagna on Mars\'s, Saturn\'s or the Sun\'s Vara coinciding with the 9th, 14th or 4th Tithi respectively … 3. A moveable Lagna on Saturn\'s Vara accompanied by Pradosha is an auspicious time for discharging debts … 4. Vishti Karana during the period of Gulika on the Sun\'s, Mars\'s, or Saturn\'s Vara coinciding with the 4th, 9th or 14th Tithi is a very unfortunate time for starting to liquidate a debt"' },
    KALYANRAMAN: { ...KALYANRAMAN_V2, pageLocus: '"Repaying or Clearing Debts", printed p.219 (PDF 221): "Mrigasira is considered good for repaying and clearing debts on a day with benefic Tithi. Of the Weekdays - Sunday, Monday, Wednesday, Thursday and Friday are acceptable"; note 2 under "Obtaining Beneficial Results in Trade …", p.218 (PDF 220-221): "For repaying loans, clearing debts or taking loans Aswini and Mrigasira Nakshatras are deemed good as also tithis 1/2/3/5/6/7/8/10/11/12/13/15 and weekdays except Tuesdays and Saturdays"' },
    JOSHI: { ...JOSHI_KK, pageLocus: '"Monetary Transactions", printed p.103 (PDF 118): "Avoid Tuesday; Vriddhi Yoga (11th Yoga), Samkranti day (day when Sun Changes sign) and Amrit Siddhi Yoga formed by Sunday and Hasta nakshatra for taking loan as it will create difficulty in repayment … The days which are to be avoided for taking loan are good for repayment of loan"' },
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§25.2.2 "Borrowing money", printed p.682 (PDF 717): "Money should not be borrowed in Sankranti, Vridhi yoga, Hasta asterism, Sunday & Tuesday; as the loan remains a burden for generations. It is beneficial to return money in the above time"' },
    RANGACHARYA: { ...RANGACHARYA_I, pageLocus: '"Loans", printed p.129 (PDF 137): "6) Try to clear off the debt on Tuesday"' },
  },
  COLLECT_MONEY: {
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§25.2.3 "Collection of money", printed p.683 (PDF 718): "Money should be collected in Rohini, Krittika, Hasta, Magha, Moola, Jyeshta, 3 Poorvas, Revati, Anuradha, Pushya, Shravana & Vishakha asterisms; & on Sunday, Tuesday, Wednesday & Friday. Some opine that Sweet & Small asterisms are the best for collection of wealth. According to Sage Narad, in Rikta, the New Moon; Tuesday & Saturday; 3 Poorvas, Bharni, Magha, Vishakha, Krittika, Moola, Jyeshta, Ardra, Ashlesha; it is difficult to get back the money which is deposited, lent, or lost"' },
    RAMAN: { ...RAMAN_BV, pageLocus: 'Chapter X "Elections for Business", PDF p.38: "Recovering Money Due. - The lord of Lagna should be strong and the election rising sign should not fall in the 8th or 9th from the radical rising sign. The lords of Lagna and the 2nd must also be well situated"; "Lending Money. - One should not lend money on days ruled by Krittika, Makha, Moola, Satabhisha, Uttara, Punarvasu or one\'s Janma Nakshatra day. One should try to receive money on these days"' },
    RANGACHARYA: { ...RANGACHARYA_I, pageLocus: '"Loans", printed p.129 (PDF 137): "7) Collect and accumulate money on Wednesday. 8) Bharani is good for collection and accumulation of money"' },
    MUHURTA_CHINTAMANI: { ...MC_SHARMA, pageLocus: 'Chapter 2 sloka 27 notes, printed p.64 (PDF 68): "Collection of money is good on Wednesday"' },
  },
  DEPOSIT_WEALTH: {
    WILHELM: { ...WILHELM_E, pageLocus: '"Business/Finance - Storing and depositing wealth & investing", printed pp.193-195 (PDF 201-203): "Storing wealth includes putting up anything of value, including collections, books, silver ware and other expensive articles, and, of course, opening bank accounts and making large deposits. The following guidelines are also those to be followed for making any kind of investments, be it real estate, stocks, etc. Nakshatra: Mrigasira, Ardra, Pushya, Uttaraphalguni, Hasta, Anuradha, Uttarashadha, Sravana, Dhanishtha, Satabhisha and Uttarabhadrapada are favorable. It will not benefit the individual at all to store things under Bharani, Krittika, Aslesha, Magha, Purvaphalguni, Visakha, Jyeshtha, Mula, Purvashadha or Purvabhadrapada, instead only financial loss or destruction will happen. Tithi: Particularly avoid Rikta Tithis (4th, 9th, 14th), and the 15th. Karana: Sthira Karanas (Sakuna, Chatushpada, Naga and Kintughna) and Vishti Karana should be avoided. Lagna: Fixed Rasis are most favorable and dual Rasis middling. Navamsa: The Navamsas of the Moon, Mercury, Jupiter and Venus are favorable. Bhavas: No planet should be in the 8th. Combinations: 1. Jupiter in the Lagna, Venus in the 2nd, Mercury in the 11th and the Moon in the 10th is the best planetary position … 2. Malefics in the 3rd, 6th and 11th while benefics are in angles and trines bestow prosperity … 4. Jupiter in the Lagna gives prosperity. 5. Saturn in the Lagna is a fortunate condition for gathering and depositing gold, grain and gems"' },
    MUHURTA_CHINTAMANI: { ...MC_SHARMA, pageLocus: 'Chapter 2 sloka 27, printed p.64 (PDF 68): "THE MUHURTA OF LENDING AND BORROWING MONEY: The use of money (the exchange of money, depositing money in the Bank, taking LIC Policy and lending money etc) is auspicious in the Swati, Punarvasu, the Nakshtras called Mridu (Mrigshira, Rewati, Chitra and Anuradha) Vishakha, Pushya, Shravana, Dhanishtha, Shatbhisha, and Ashwini Nakshtras; in the Ascendants called chara (Movable) which are 1/4/7/10 and if there is no planet in the 9th, 5th and 8th Houses from the Ascendant"; sloka 2/24, printed p.62 (PDF 66): "The money which is lent to some one as a loan, is kept in a chest or buried under ground, is given to some one on interest or is lost in the Nakshtras named Teekshana, Mishra, Dhruwa and Ugra and the yogas of Bhadrakarana and Vyatipaata is not got back"' },
    KALYANRAMAN: { ...KALYANRAMAN_V2, pageLocus: '"Making Monetary Transactions, Lending Or Borrowing, Depositing In A Bank, Taking Insurance Policy", printed p.217 (PDF 219): "Nakshatra Aswini, Mrigasira, Pushyami, Swati, Visaka, Anuradha, Sravana, Dhanishta, Satabhisha and Revati. (10) … Tithis 1/2/3/5/6/7/8/10/11/12/13/15 Weekdays Sunday, Monday, Wednesday, Thursday, Friday, Saturday. Notes: 1. Muhoortha Chintaamani … adds Punarvasu and Chitra to the list provided above. 2. … the 11th yoga namely - Vriddhi Yoga - and Sthira Karanas and Bhadra must be avoided … 3. Avoid Wednesdays for giving loan but it is good for depositing. 4. The ascendant must be movable 1/4/7/10 raasis. Houses 5/8/9 must be unoccupied"' },
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§20.16 "Laying up treasure", printed p.583 (PDF 620): "Tithi: All Tithis except Rikta, the New & Full Moon are felicitous. Day: Monday, Wednesday, Thursday & Friday are suitable. Const.: Mrigshira, Ardra, Pushya, Hasta, Anuradha, Shravana, Dhanishta, Shatbhish, and 3 Uttras. Ascendant: Fixed signs are the best, & common signs are middling. Malefics should be in 3,6,11; & 8th house should be vacant. Sthir Karanas & Vishti Karnas should be avoided. According to K.P. the time is very fortunate to gather & deposit gold, gems & grain when Saturn is in ascendant. Jupiter in ascendant also increases prosperity. Vargottama Jupiter, Mercury & Venus in quadrants are very lucky period to gather & deposit gold"; §25.2.4 "Burrying or hiding money", printed p.683 (PDF 718): "Dravaya (gold, money, valuables etc.) & coffer should be kept in a secret place or buried under the ground in asterisms of Dhanishta, U.Falguni, Vishakha, P.Shada, Revati & Rohini"' },
    JOSHI: { ...JOSHI_KK, pageLocus: '"Monetary Transactions", printed p.103 (PDF 118): "Swati, Punarvasu, Shravana, Dhanistha Shatbhisha, Mrigshira, Revati, Chitra, Anuradha, Ashwini, Pushya and Vishkha nakshatras; movable lagnas (i.e. lagnas of 1/4/7/10 rashis) with 5/8/9 houses unoccupied are considered good for monetary transactions e.g. taking and giving money, depositing money in bank, taking Insurance Policy and the like … Wednesday is good for depositing money"' },
    RANGACHARYA: { ...RANGACHARYA_I, pageLocus: '"Loans", printed p.129 (PDF 137): "7) Collect and accumulate money on Wednesday. 8) Bharani is good for collection and accumulation of money. Deposits of money in Banks should be done in Bharani"' },
  },
  MAKE_WILL: {
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§20.19 "Making a will", printed p.584 (PDF 621): "Tithi: 1st of D.H.; 2,3,5,6,7,8,10,11,12,13 & 15 of B.H. Day: all days except Tuesday; night-time is prohibited. Const.: Ashvani, Rohini, Mrigshira, Pushya, 3 Uttras, Hasta, Chitra, Anuradha, Jyeshta, Shravana, Revati. Ascendant: 3,5,6,7,8,11 signs. Ascendant should be 3,6,10 or 11th sign from JR. of the recipient. Benefics should be in 1,2,4,5,7,9,10,11; but malefics in these houses are unfavourable. Malefics in 3,6,11 houses are beneficial. The Sun, Mars, ascendant lord, lord of radical ascendant, lord of the property (Rajesh) should be strong. In Uttrayana (leave Chaitra month), & when the Moon, Jupiter & Venus are strong & not combust, is auspicious. Leave Kshaya & Adhika Maasas. Jupiter in 1,5,9; Mars in 6th; & Venus in 10th of the election chart are auspicious. Saturn in 3rd; the Sun in 11th; & Jupiter in 4th or 10th is another beneficial combination"' },
    RAMAN: { ...RAMAN_BV, pageLocus: 'Chapter X "Elections for Business", PDF p.39: "Making a Will. - The Moon, the Lagna and the lord of the Lagna should all be in fixed signs. The constellation of Pushyami is the best as also Wednesday and Thursday - Tuesday and Friday should be avoided. For the benefit of the legatee, the rising sign should be one of Jupiter or Venus. Let Mars and Saturn be in the 3rd or 11th house. The 8th house must also be rendered strong as otherwise the testator will die"' },
  },
  PURCHASE_GOODS: {
    KALYANRAMAN: { ...KALYANRAMAN_V2, pageLocus: '"Obtaining Beneficial Results in Trade, Starting Industries, Giving Loans, Paying Back or Taking Loans", printed p.218 (PDF 220): "Nakshatra Abhijith, Aswini, Mrigasira, Punarvasu, Pushyami, Hasta, Chitra, Swati, Anuradha, Sravana, Dhanishta, Satabhisha, Revati (13) Movable: Swati, Punarvasu, Sravana, Dhanishta and Satabhisha. (5) Short/Laghu: Hasta, Aswini, Pushyami and Abhijith. 4 Friendly/Mridu: Mrigasira, Revati, Chitra and Anuradha. 4 … Tithis 1/2/3/5/6/7/8/10/11/12/13/15 Weekdays Sunday, Monday, Wednesday, Thursday, Friday"' },
    WILHELM: { ...WILHELM_E, pageLocus: '"Business/Finance - All business transactions including buying & selling", printed p.190 (PDF 198): "The following guidelines are those to be followed for all financial transactions, and the buying and selling of all things except for animals … Nakshatra: Asvini, Rohini, Mrigasira, Ardra, Punarvasu, Pushya, Magha, Purvaphalguni, Uttaraphalguni, Hasta, Visakha, Jyeshtha, Mula, Uttarashadha, Satabhisha, Uttarabhadrapada, and Revati are beneficial for all business transactions, buying and selling. Purchasing: Asvini, Chitta, Svati, Sravana, Satabhisha and Revati are particularly favorable for purchasing, but not so favorable for selling. Selling: Bharani, Krittika, Aslesha, Purvaphalguni, Visakha, Purvashadha and Purvabhadrapada are particularly favorable for selling, but not so favorable for purchasing. Tithi: All Tithis except the 4th, 6th, 8th, 9th, 12th and 14th are beneficial for all business transactions, buying and selling. Vara: Mars\'s Vara is the most unfortunate for buying, especially if what is bought is to be resold, except if Mars rules that bought. Lagna: Taurus, Gemini, Leo, Libra and Scorpio are beneficial for all business transactions, buying and selling. For selling specifically, all Lagnas are considered favorable outside of Aquarius. Grahas: It is favorable if Jupiter is influencing the planet that rules the thing purchased"' },
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§25.3 "Trading", printed pp.683-684 (PDF 718-719): "25.3.1 Purchase: Shatbhish, Ashvani, Chitra, Shravana, Swati & Revati are auspicious for purchase (M.G.). 25.3.2 Sale: Vishakha, Krittika, Ashlesha, Bharni & 3 Poorvas asterisms; benefics in angles & trine; malefics in 3/6/11 houses; on benefic Tithis; when Aquarius sign is not rising; selling is beneficial (& not purchase) - (M.C. & M.G.). 25.3.3 Purchase sale: Pushya, P.Bhadra, 3 Uttras, Swati, Shravana, Ashvani, Hasta, Mrigshira, Anuradha, Ashlesha, Revati asterisms; on Monday, Thursday & Friday; on seeing a good omen; sale-purchase should be done (B.J.S.). An item purchased in an asterism should not be sold in the same asterism; & vice versa … Anuradha, 3 Uttras, Pushya, Revati, Rohini, Mrigshira, Hasta, Chitra & Ashvani asterisms; on an auspicious day are beneficial for trading (M.G.). K.P. opines that Taurus, Gemini, Leo, Libra & Scorpio are the beneficial signs for all transactions, sale, and purchase. Malefic Tithis are 4th, 6th, 8th, 9th, 12th & 14th. In the opinion of Acharya Kalidas, sale-purchase of living beings (animals, birds), minerals, clothes & food items should be done in asterisms of Small (Hasta, Ashvani, Pushya), Shravana, Dhanishta, Jyeshta, Revati, Pushya, Punarvasu, Vishakha, Chitra; & on benefic weekdays"' },
    RANGACHARYA: { ...RANGACHARYA_I, pageLocus: '"Sale and purchase", printed pp.128-129 (PDF 136-137): "The asterisms mentioned for sale should not be chosen for purchase. The asterisms mentioned for purchase should not be chosen for sale. Favourable asterisms for sale: Pubba, Porvashada, Poorvabhadra, Vishaka, Krittaka, Aslesha, Bharani. Favourable asterisms for purchase: Revati, Satabhisha, Aswini, Chitra, Swati and Sravana. Avoid the rikta tithis and new moonday. Never choose Kumbha Lagna for sale or purchase. The benefics in the 2nd, 5th, 9th, 4th, 7th and 10th houses, and the malefics in 3rd, 10th and 11th houses are good for sale and purchase"' },
    RAMAN: { ...RAMAN_BV, pageLocus: 'Chapter X "Elections for Business", PDF p.38: "Buying for Business. - Thursday, the 10th lunar day and the constellation of Pushyami are the best. Tuesday should be completely rejected. Saturday is passable. Mercury, the 2nd lord and the 2nd house should all be fortified. Avoid buying for trade when Mercury is afflicted by Mars as this will destroy stocks and cause discord and wrangling. Mercury and Jupiter in conjunction in Lagna or in mutual aspects would be highly propitious"' },
    MUHURTA_CHINTAMANI: { ...MC_SHARMA, pageLocus: 'Chapter 2 sloka 16, printed p.57 (PDF 61): "THE MUHURTA OF MAKING PURCHASE AND SALE: It is inauspicious to make a sale in the Nakshtras of making purchase and to make a purchase in the Nakshtras of making sale. The Nakshtras of Revati, Shatabhisha, Ashwini, Swati, Shravana and Chitra are auspicious with regard to making purchase"' },
    AGARWAL: { ...AGARWAL_GS, pageLocus: '"Purchase of goods", printed p.328 (PDF 328): "Nakshatras: Revati, Satbhisha, Aswini, Swati, Sravana, Chitra are good for making purchases but bad for making sales. Note: Purchase is a continuous process and so purchase should be considered which is meant for keeping articles in store of a shop for sale"' },
  },
  SALE_GOODS: {
    KALYANRAMAN: { ...KALYANRAMAN_V2, pageLocus: '"Obtaining Beneficial Results in Trade, Starting Industries, Giving Loans, Paying Back or Taking Loans", printed p.218 (PDF 220): "Nakshatra Abhijith, Aswini, Mrigasira, Punarvasu, Pushyami, Hasta, Chitra, Swati, Anuradha, Sravana, Dhanishta, Satabhisha, Revati (13) Movable: Swati, Punarvasu, Sravana, Dhanishta and Satabhisha. (5) Short/Laghu: Hasta, Aswini, Pushyami and Abhijith. 4 Friendly/Mridu: Mrigasira, Revati, Chitra and Anuradha. 4 … Tithis 1/2/3/5/6/7/8/10/11/12/13/15 Weekdays Sunday, Monday, Wednesday, Thursday, Friday"' },
    WILHELM: { ...WILHELM_E, pageLocus: '"Business/Finance - All business transactions including buying & selling", printed p.190 (PDF 198): "The following guidelines are those to be followed for all financial transactions, and the buying and selling of all things except for animals … Nakshatra: Asvini, Rohini, Mrigasira, Ardra, Punarvasu, Pushya, Magha, Purvaphalguni, Uttaraphalguni, Hasta, Visakha, Jyeshtha, Mula, Uttarashadha, Satabhisha, Uttarabhadrapada, and Revati are beneficial for all business transactions, buying and selling. Purchasing: Asvini, Chitta, Svati, Sravana, Satabhisha and Revati are particularly favorable for purchasing, but not so favorable for selling. Selling: Bharani, Krittika, Aslesha, Purvaphalguni, Visakha, Purvashadha and Purvabhadrapada are particularly favorable for selling, but not so favorable for purchasing. Tithi: All Tithis except the 4th, 6th, 8th, 9th, 12th and 14th are beneficial for all business transactions, buying and selling. Vara: Mars\'s Vara is the most unfortunate for buying, especially if what is bought is to be resold, except if Mars rules that bought. Lagna: Taurus, Gemini, Leo, Libra and Scorpio are beneficial for all business transactions, buying and selling. For selling specifically, all Lagnas are considered favorable outside of Aquarius. Grahas: It is favorable if Jupiter is influencing the planet that rules the thing purchased"' },
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§25.3 "Trading", printed pp.683-684 (PDF 718-719): "25.3.1 Purchase: Shatbhish, Ashvani, Chitra, Shravana, Swati & Revati are auspicious for purchase (M.G.). 25.3.2 Sale: Vishakha, Krittika, Ashlesha, Bharni & 3 Poorvas asterisms; benefics in angles & trine; malefics in 3/6/11 houses; on benefic Tithis; when Aquarius sign is not rising; selling is beneficial (& not purchase) - (M.C. & M.G.). 25.3.3 Purchase sale: Pushya, P.Bhadra, 3 Uttras, Swati, Shravana, Ashvani, Hasta, Mrigshira, Anuradha, Ashlesha, Revati asterisms; on Monday, Thursday & Friday; on seeing a good omen; sale-purchase should be done (B.J.S.). An item purchased in an asterism should not be sold in the same asterism; & vice versa … Anuradha, 3 Uttras, Pushya, Revati, Rohini, Mrigshira, Hasta, Chitra & Ashvani asterisms; on an auspicious day are beneficial for trading (M.G.). K.P. opines that Taurus, Gemini, Leo, Libra & Scorpio are the beneficial signs for all transactions, sale, and purchase. Malefic Tithis are 4th, 6th, 8th, 9th, 12th & 14th. In the opinion of Acharya Kalidas, sale-purchase of living beings (animals, birds), minerals, clothes & food items should be done in asterisms of Small (Hasta, Ashvani, Pushya), Shravana, Dhanishta, Jyeshta, Revati, Pushya, Punarvasu, Vishakha, Chitra; & on benefic weekdays"' },
    RANGACHARYA: { ...RANGACHARYA_I, pageLocus: '"Sale and purchase", printed pp.128-129 (PDF 136-137): "The asterisms mentioned for sale should not be chosen for purchase. The asterisms mentioned for purchase should not be chosen for sale. Favourable asterisms for sale: Pubba, Porvashada, Poorvabhadra, Vishaka, Krittaka, Aslesha, Bharani. Favourable asterisms for purchase: Revati, Satabhisha, Aswini, Chitra, Swati and Sravana. Avoid the rikta tithis and new moonday. Never choose Kumbha Lagna for sale or purchase. The benefics in the 2nd, 5th, 9th, 4th, 7th and 10th houses, and the malefics in 3rd, 10th and 11th houses are good for sale and purchase"' },
    RAMAN: { ...RAMAN_BV, pageLocus: 'Chapter X "Elections for Business", PDF p.38: "Selling for Profit. - Let the Moon and Mercury be free from the conjunction or aspect of Mars. The Moon\'s situation in Taurus, Cancer or Pisces would greatly help the seller. Try to keep Mercury in a kendra from Lagna or at least in good aspect to Jupiter. Tuesday should be avoided. Monday, Wednesday and Thursday are the best. While Friday is unpropitious, Saturday is middling"' },
    AGARWAL: { ...AGARWAL_GS, pageLocus: '"Sale of goods", printed p.328 (PDF 328): "Nakshatras: all 3 Poorvas, Vishakha, Krittika, Aslesha, Bharani. Tithis: 1,2,5,7,10,11,13. Lagna should not be Aquarius. Benefics should be in 1,4,7,10,5,9,2 and malefic should be in 3,6,11. Note: Sale is a continuous process and it should be considered for those things which are to be kept in market shop for sale"' },
    JOSHI: { ...JOSHI_KK, pageLocus: 'Chapter 9 "Muhurta for selling goods", printed p.101 (PDF 116): "For Selling, Poorvaphalguni, Poorvashada, Poorvabhadrapad, Vishkha, Kritika, Ashlesha and Bharani nakshatras are considered good. One should chose benefic tithis (1/2/3/5/7/10/11/13) and benefic yogas. The Selling lagna should not be Aquarius. It should have benefics in 1/4/7/10/5/9/2 houses and malefics in 3/6/11 houses"; chapter note, p.101: "In all the muhurtas discussed in this chapter proper Chandra Shuddhi and/or Tara Shuddhi … is a must"' },
    MUHURTA_CHINTAMANI: { ...MC_SHARMA, pageLocus: 'Chapter 2 sloka 17, printed p.58 (PDF 62): "THE MUHURTA OF OPENING (INAUGURATING) A SHOP AND OF SELLING: The selling of a thing is auspicious, in the three \'Poorva Nakshtras\', that is Poorva Phalguni, Poorvashadha and Poorvabhadrapada, Vishakha, Kritika, Ashlesha, and Bharani Nakshtras, if benefics are there in angles and trines and malefics are in 3/6/11 Houses, there is another Ascendant except Aquarius and on auspicious tithis"' },
  },
  SPECULATION: {
    KALYANRAMAN: { ...KALYANRAMAN_V2, pageLocus: '"Involving in Speculation", printed p.218 (PDF 220): "Nakshatra Bharani, Krittika, Aslesha, Makha, Poorvaphalguni, Visaka, Moola, Poorvashada, Poorvabhadrapada, Uttarabhadrapada (10) … Tithis 1/2/3/5/6/7/8/10/11/12/13/15 Weekdays Sunday, Monday, Wednesday, Thursday, Friday"' },
  },
  LOTTERY: {
    RAMAN: { ...RAMAN_BV, pageLocus: 'Chapter XVII "Miscellaneous Elections", PDF p.55: "Lotteries and Competitions. - Success in lotteries and competitions generally depends upon the strength of the birth horoscope in regard to the house of finance and the nature of the directional influences at the time concerned. Therefore, much reliance cannot be placed on the strength of election in regard to chance-games. Aswini, Bharani, Punarvasu, Pushya, Hasta, Chitta, Visakha, Poorvashadha and Revati are excellent for entering into competitions. The 2nd, 3rd, 5th, 6th, 11th and 13th lunar days are good. All weekdays are suitable except Tuesday and Saturday. Let the Lagna belong to a benefic planet. Fortify the Moon and the 5th and the 9th houses. Avoid the 11th lord in the 12th and Mars in the 8th. Saturn should cast no aspect either on the 2nd house or on the 2nd lord"' },
    AGARWAL: { ...AGARWAL_GS, pageLocus: '"Lottery & competitions", printed p.325 (PDF 325): "Days: all days except Tuesday and Saturday. Tithis: 2, 3, 5, 6, 11, 13. Nakshatras: Aswini, Bharani Punarvasu, Pushya, Hasta, Chitra, Vishakha Revati, Poorvashdha. Muhurta kundli: lagna of a benefic planet, avoid Mars in 8th, avoid 11th lord in 12th, avoid Saturn\'s aspect 2nd house and 2nd lord"' },
    KALYANRAMAN: { ...KALYANRAMAN_V2, pageLocus: '"Betting Or Gambling", printed p.219 (PDF 221): "Mrigasira and Revati are preferred for the above with beneficial tithis, yogas and Karanas. Of the Weekdays Sunday, Monday, Wednesday, Thursday and Friday are acceptable"' },
  },
  ACCOUNTS: {
    JOSHI: { ...JOSHI_KK, pageLocus: '"For correspondence, accounts etc.", printed p.149 (PDF 164): "Nakshatras: All short nakshatras (i.e. Hasta Ashwini, Pushya and Abhijit) all fixed nakshatras (i.e. Uttaraphalguni, Uttarashada, Uttarabhadrapad and Rohini), all friendly nakshatras (i.e. Mrigshira, Revati, Chitra, Anuradha) Punarvasu and Shravana nakshatras are considered auspicious for starting correspondence or starting work relating to Accountancy and book-keeping. Tithis: 1/2/3/5/7/10/11/13. Days: Sunday, Monday, Wednesday, Thursday and Friday. Lagna: Lagna of benefic planets with benefics occupying Kendras and Trikonas and no planet posited in 8th or 12th house"' },
    WILHELM: { ...WILHELM_E, pageLocus: '"Business/Finance - Accounting, bookkeeping & business correspondence", printed p.189 (PDF 197): "Nakshatra: Asvini, Rohini, Mrigasira, Punarvasu, Pushya, Uttaraphalguni, Hasta, Chitra, Anuradha, Uttarashadha, Sravana, Uttarabhadrapada and Revati are favorable. Vara: The Varas of the Sun, Moon, Mercury, Jupiter and Venus are favorable. Lagna: The Lagna should be of a benefic. Bhavas: The 8th and 12th should be empty"' },
  },
  BUY_LAND: {
    RAMAN: { ...RAMAN_BV, pageLocus: 'Chapter XII "House Building", PDF p.45: "Buying Lands for Buildings. - The best asterisms for buying a land are Aswini, Rohini, Mrigasira, Punarvasu, Pushyami, Uttara, Hasta, Swati, Anuradha, Uttarashadha, Sravana, Dhanishta, Satabhisha and Uttarabhadra. Riktha tithis must be scrupulously avoided. Monday, Wednesday, Thursday and Saturday are good. It would be better if the lord of the weekday concerned occupies the Lagna at the time of the transaction. Some ancient astrological works recommend Tuesday also as suitable. But in our humble view, Tuesday should be rejected. At the time of making the final negotiations, let preferably a fixed sign rise and let Jupiter occupy a kendra or trikona. Mars should be placed in the 11th house and he should not be in Lagna. The lords of Lagna and the 7th should be harmoniously disposed. Avoid the 11th lord in the 12th"' },
    WILHELM: { ...WILHELM_E, pageLocus: '"Real estate - Purchasing", printed p.287 (PDF 295-296): "Nakshatra: Asvini, Rohini, Mrigasira, Punarvasu, Pushya, Uttaraphalguni, Hasta, Svati, Anuradha, Uttarashadha, Sravana, Dhanishtha, Satabhisha, and Uttarabhadrapada are favorable. Tithi: Particularly avoid the 4th, 9th and 14th Tithis. Karana: Definitely avoid Vishti Karana. Vara: The Varas of the Moon, Mars, Mercury and Saturn are favorable. Lagna: Fixed Rasis are most favorable and dual Rasis middling. Bhavas: No planet should be in the 8th. Miscellaneous: It is very favorable to have the lord of the Vara in the Lagna. Combinations: The Lagna or Navamsa Lagna occupied by the Sun and Ketu indicates that the land obtained will be a permanent possession"' },
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§25.3.4 "Sale - purchase of land", printed p.684 (PDF 719): "Sale & purchase of land during asterisms of Punarvasu, Mrigshira, Anuradha, Revati, Magha, Moola, Ashlesha, Vishakha & 3 Poorvas; Nanda & Poorna Tithis; & on Thursday & Friday; brings prosperity (J.V.)"; §27.17.1 "Purchase of land", printed p.738 (PDF 772): "1st (D.H.); 5,6,10,11 Tithis of B.H. & the Full Moon; Thursday & Friday; asterisms of Mrigshira, Punarvasu, Ashlesha, Magha, Vishakha, Anuradha, 3 Poorvas, Mrigshira & Revati are auspicious"' },
    JOSHI: { ...JOSHI_KK, pageLocus: 'Chapter 9 "Sale-Purchase of Land", printed p.102 (PDF 117): "Punarvasu, Mrigshira, Revati, Anuradha, Magha, Moola, Ashlesha, Vishakha, Poorvaphalguni, Poorvashada and Poorvabhadrapad nakshatras; Nanda and Poorna Tithis (i.e. 1/6/11/5/10/15 tithis) and benefic days, particularly Thursday and Friday, are considered auspicious for sale and purchase of land"' },
    RANGACHARYA: { ...RANGACHARYA_I, pageLocus: '"Sale and purchase", printed p.129 (PDF 137): "The benefics in the 2nd, 5th, 9th, 4th, 7th and 10th houses, and the malefics in 3rd 10th and 11th houses are good for sale and purchase. Thursday and Friday and the Nanda tithis are favoured for sale and purchase of houses and lands etc. Prefer asterisms viz. Moola, Mrigasira, Pubba, Anuradha, and Punarvasu for sale and purchase of houses, lands etc. sale of paddy is profitable in Rohini Dhanishtta, Satabhisha, Uttarashada, Uttarabhadra"' },
    VASHISTHA: { ...VASHISTHA_KUSUM, pageLocus: '"Land-buying muhurta", printed p.119 (PDF 106): "Tithi 1 of krishna paksha, 5, 6, 10, 11, and 15 (shukla), Thursday, Friday. Nakshatra - Mrigashirsha, Punarvasu, Ashlesha, Magha, Vishakha, Anuradha, 3 poorvas, Moola and Revati"' },
    AGARWAL: { ...AGARWAL_GS, pageLocus: '"Buying lands (for buildings)", printed p.325 (PDF 325): "Days: Monday, Wednesday, Thursday, Saturday. Tithis: avoid Rikta tithi. Nakshatras: Rohini, Mrigshira, Punarvasu, Pushya, Hasta, Swati, Aswini, Anuradha, Shatbhisha, Dhanishta all 3 Uttras, Shravana"; under the agriculture block: "Better if lord of week day occupies lagna at the time of transaction"' },
  },
  BUY_FARMLAND: {
    RAMAN: { ...RAMAN_BV, pageLocus: 'Chapter XIII "Agricultural Operations", PDF p.47: "Buying Land for Agriculture. - Monday, Wednesday and Saturday are good. Let the Moon be waxing and Mars be in the 4th house. As usual, avoid the Riktha tithis. The best asterisms are: Aswini, Rohini, Mrigasira, Punarvasu, Pushyami, Uttara, Sravana, Satabhisha, Uttarabhadra. Vishitikarana may also be avoided"' },
    AGARWAL: { ...AGARWAL_GS, pageLocus: '"Buying lands (for agriculture)", printed p.325 (PDF 325): "Days: Monday, Wednesday, Saturday. Tithis: avoid Rikta tithi. Nakshatras: Rohini, Mrigshira, Punarvasu, Pushya, Hasta, Swati, Aswini, Anuradha, Shatbhisha, Dhanishta all 3 Uttras, Shravana. Better if lord of week day occupies lagna at the time of transaction"' },
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§21.17 "Sale - purchase of land", printed p.599 (PDF 636): "5,6,10,11,15 - of B.H., & 1 of D.H. Day: Thursday & Friday. Const.: Mrigshira, Punarvasu, Ashlesha, Magha, Vishakha, Anuradha, 3 Poorvas, Moola & Revati are beneficial (M.G.)"' },
  },
  BUY_HOUSE: {
    AGARWAL: { ...AGARWAL_GS, pageLocus: '"Buying a house", printed p.325 (PDF 325): "Days: Thursday, Friday. Tithis: Nanda, i.e. 1, 5, 11. Nakshatras: Mrigshira, Bharani, Aswini, P. phalguni, Vishakha, Moola, Punarvasu, Revati. Muhurta kundli: Lagna signs should be 2, 3, 5, 7, 8. Mars should not be in lagna and there should not be any malefic in 7. At the time of making final negotiation, fixed sign should rise, Mars should be in 11th and not in lagna. Lagnesh and 7th lord be harmoniously disposed. Avoid 11th lord in 12th"' },
    RAMAN: { ...RAMAN_BV, pageLocus: 'Chapter XII "House Building", PDF p.45: "Buying Houses. - As usual Nanda thithis are favourable. New and old houses can be purchased on Thursdays and Fridays. The auspicious constellations are Mrigasira, Aslesha, Makha, Pubba, Visakha, Moola, Punarvasu and Revati. Taurus, Gemini, Leo, Libra and Scorpio are the best signs. Malefics should be avoided in the 7th house, as they may cause trouble and annoyance. Mars should not be in Lagna"' },
    RANGACHARYA: { ...RANGACHARYA_I, pageLocus: '"Sale and purchase", printed p.129 (PDF 137): "The benefics in the 2nd, 5th, 9th, 4th, 7th and 10th houses, and the malefics in 3rd 10th and 11th houses are good for sale and purchase. Thursday and Friday and the Nanda tithis are favoured for sale and purchase of houses and lands etc. Prefer asterisms viz. Moola, Mrigasira, Pubba, Anuradha, and Punarvasu for sale and purchase of houses, lands etc."' },
  },
  LAND_POSSESSION: {
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§25.3.4 "Sale - purchase of land", printed p.684 (PDF 719): "K.P. opines that the best asterisms to take possession of land are, Ashvani, Rohini, Mrigshira, Punarvasu, Pushya, 3 Uttras, Hasta, Swati, Anuradha, Shravana, Dhanishta, Shatbhish: Rikta Tithis & Vishti Karan be avoided. If the Sun & Ketu (both) are in rising sign & navamsha, then there is permanent possession of the land. Further to gain possession of the rightful land, the claimant may scoop out & carry a handful of the land when Cancer is rising; & the Moon is in 4th quarter of any of the four asterisms - Bharni, Ardra, Vishakha or Hasta"' },
    RAMAN: { ...RAMAN_BV, pageLocus: 'Chapter XII "House Building", PDF p.45: "The land can be taken possession of when the Lagna and Navamsa are occupied by the Sun and Ketu. When these planets are together in Lagna or Navamsa, the land is supposed to remain with the purchaser, permanently"; Chapter XIII "Agricultural Operations", PDF p.47: "If due to any unavoidable circumstances, it is not possible to be present at the land to gain possession at the auspicious moment selected, then pick up and carry away a handful of earth, from that land when Cancer is rising and the last pada of Bharani, Aridra or Visakha is ruling"' },
    WILHELM: { ...WILHELM_E, pageLocus: '"Land Contestation", printed p.250 (PDF 258): "To gain possession of land of which one\'s rights to which is contested, scoop out and carry away a handful of earth from the land at a time when the Lagna is Cancer and the Moon is in the fourth Pada of Bharani, Ardra, Visakha, or Hasta. (Also make sure that other Muhurta factors are favorable when doing this.)"' },
  },
  DIVIDE_PROPERTY: {
    KALYANRAMAN: { ...KALYANRAMAN_V2, pageLocus: '"Doing Partitions of Properties", printed p.243 (PDF 245): "Nakshatra Abhijith, Aswini, Rohini, Mrigasira, Punarvasu, Pushyami, Uttaraphalguni, Hasta, Chitra, Swati, Uttarashada, Sravana, Dhanishta, Satabhisha, Uttarabhadrapada and Revati, (15+1) Short: Hasta, Aswini, Pushyami, Abhijith, (4) Fixed: Uttaraphalguni, Uttarashada, Uttarabhadrapada, Rohini (4) Movable: Swati, Punarvasu, Sravana, Dhanishta, Satabhisha, (5) Others: Mrigasira, Chitra, Revati (3) … Tithis 2/3/5/7/10/11/13 Weekdays Sunday, Monday, Wednesday, Thursday, Friday. Note: The Lagna Suddhi and the Lagna of benefic raasis are needed"' },
    JOSHI: { ...JOSHI_KK, pageLocus: '"To divide property", printed p.149 (PDF 164): "To divide property among co-borns the following considerations are necessary. Nakshatras: All short nakshatras (i.e. Hasta, Ashwini and Pushya), all fixed nakshatras (i.e. Uttaraphalguni, Uttarashada, Uttarabhadrapad and Rohini), all movable nakshatras (i.e. Swati, Punarvasu, Shravana, Dhanistha and Shatbhisha) Mrigshira, Chitra and Revati nakshatras. Tithis: 2/3/5/7/10/11/13 tithis. Days: Sunday, Monday, Wednesday, Thursday and Friday. Lagna of benefics with proper lagna shuddhi should be chosen"' },
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§20.18 "Division of property", printed p.583 (PDF 620-621): "Tithi: 2,3,5,7,10,11,13,15 of both halves. Day: Sunday, Monday, Wednesday, Thursday, Friday. Const: Ashvani, Rohini, Mrigshira, Punarvasu, Pushya, 3 Uttras, Hasta, Chitra, Swati, Shravana, Dhanishta, Revati. In benefic ascendant; & benefics in angles"' },
    WILHELM: { ...WILHELM_E, pageLocus: '"Real estate - Dividing property", printed p.287 (PDF 295): "Nakshatra: Asvini, Rohini, Mrigasira, Punarvasu, Pushya, Uttaraphalguni, Hasta, Chitta, Svati, Uttarashadha, Sravana, Dhanishtha, Satabhisha, Uttarabhadrapada and Revati are favorable. Tithi: The 2nd, 3rd, 5th, 7th, 10th, 11th and 13th are favorable. Vara: The Varas of the Sun, Moon, Mercury, Jupiter and Venus are favorable"' },
  },
  CONSTRUCTION_START: {
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§27.2 "Auspicious time for starting construction", printed pp.704-711 (PDF 738-745): "27.2.1 Month: All the exponents agree that lunar months of Shravana & Falguni are auspicious in starting house. Vaasturajballabh recommends months of Vaishakha, Shravan, Margshirsh, Paush & Falguni … if a house is started in lunar month of Chaitra, there shall be sorrow; Vaishakha brings money; Jyeshta results in death; Ashada destroys animals; Shravana multiplies cattle; Bhadrapada nullifies all results; Ashvin brings quarrels; Karttika destroys servants; Margshirsha & Pausha results in gain of grains; Magha inculcates fear of fire; & Falguni augurs wealth. Vaastupradeep commends Karttika but not Pausha; while effects of Magha are mixed … According to Sage Narad, construction of house augurs auspicious results when started during the transit of the Sun in Aries … Gemini causes certain death; the Sun in Cancer sign gives auspicious effects; in Leo helps in increase of servants; in Virgo there shall be illness; in Libra there shall be comforts; in Scorpio there shall be increase of wealth; the Sun in Sagittarius causes great losses; while in Capricorn & Aquarius there shall be gain of money; and when the Sun is in Pisces there shall be fear. 27.2.2 Tithi & day: 2,3,5,6,7,10,11,12,13 & 15 of B.H. are auspicious. 1,4,8,9,14 & the New moon are inauspicious. M.G. considers 6th also as inauspicious. \\"Krishan Naga Chaturdashi\\" is always prohibited, J.V. opines that both the halves are suitable. Weekdays other than Sunday, Tuesday & Monday are auspicious. B.S. recommends Friday, Thursday, Saturday, Wednesday; & Monday, if the Moon is favourable … Sage Vasist recommends daytime of B.H. … & night-time should be avoided. Chidra & Galgraha Tithis should also be avoided. 27.2.3 Constellation: … Stationary (Rohini, 3 Uttras), Sweet (Mrigshira, Chitra, Anuradha, Revati), Swati, Pushya, Dhanishta & Shatbhish are excellent in starting construction of house. However B.S. does not recommend Swati & Dhanishta of the above list but recommends Hasta, Punarvasu, Shravana & Ashvani. Sage Parashar recommends Moola also … However K.P. opines that Ashvani, Hasta, Chitra, Dhanishta & Shatbhish have middling effects. Panchakas in general are prohibited in starting house but Dhanishta & Shravana are acceptable by majority … 2) According to Vaastusaar, the seven asterisms from that of the asterism occupied by the Sun (the sun\'s asterism included) are inauspicious; next 11 asterisms are auspicious; & the next 10 asterisms are again inauspicious. 27.2.4 Yoga, Karan & Ayana: Construction of house is prohibited in Vajra, Vyaghata, Shula, Vyatipaata, Atiganda, Ganda, Vishkumbha & Paridh (Matasya Puraan). Bava, Taitil, Gar, Vanija, Shakuni & Kintughna Karanas are not auspicious in starting house. Majority of the writers have preferred Uttrayana but, have also accepted Dakshinayana in starting house. 27.2.5 Ascendant: Most of the exponents agree that house should be constructed in fixed & common rising signs. However Vaastupradeep commends that movable & Leo as rising signs should be left. Benefic planet should occupy or aspect the ascendant … Malefic in the 7th house at the time of starting of house generates arrogance & egoism resulting in constant quarrels"' },
    WILHELM: { ...WILHELM_E, pageLocus: '"Construction - Beginning construction (laying foundations)", printed pp.217-223 (PDF 225-231): "The time of laying the foundation is the most important time in the construction of a house or building … Masa: Phalguna, Sravana, Margasiras, Pushya and Vaisakha are favorable if the Sun is not in dual Rasis … Nakshatra: Rohini, Mrigasira, Pushya, Uttaraphalguni, Chitra, Svati, Anuradha, Mula, Uttarashadha, Sravana, Uttarabhadrapada and Revati are favorable. Asvini, Punarvasu, Hasta, Dhanishtha and Satabhisha are middling. The rest should be avoided … Tara: In addition to the normally favorable Taras, the Janma Nakshatra as well as the 10th from there is favorable. Tithi: The 2nd, 6th and 10th Tithis and all odd Tithis except the 9th are favorable … Vara: The Varas of the Moon, Mercury, Jupiter, Venus and Saturn are favorable. Other Varas should be rejected. Lagna: Fixed Rasis are best, dual Rasis occupied by benefics are middling. Moveable Rasis should be avoided … The Urdhva Mukha Rasi (the Rasi just vacated by the Sun) is favorable. The Adho Mukha Rasi (the Rasi occupied by the Sun), even when occupied by a benefic, should be avoided … Bhavas: Benefics are very favorable in the Lagna, 2nd and 9th. Malefics in the 3rd, 6th and 11th are beneficial. Any planet located in the 8th causes disaster. Some astrologers hold that the 12th house must also be vacant … Grahas: Avoid the afflictions of Jupiter and Venus, particularly combustion … The construction of a house should not be commenced when the wife is pregnant"' },
    RAMAN: { ...RAMAN_BV, pageLocus: 'Chapter XII "House Building", PDF pp.42-43: "No house-building should be commenced in the lunar months of Jyeshta, Ashadha, Bhadrapada, Aswayuja, Margasira, Pushya and Phalguna … The lunar months of Chaitra, Vaisakha, Sravana, Kartika and Magha are the best. The Sun should occupy fixed signs or at least movable signs but no building work should be undertaken when the Sun is in common signs. Rohini, Mrigasira, Chitta, Hasta, Jyeshta, Uttara, Uttarashadha and Sravana are the best constellations to lay the foundation. Swati, Pushya, Anuradha, Aswini, Satabhisha, Uttarabhadra and Revati are ordinary or middling while the remaining twelve asterisms should invariably be avoided. All odd tithis (lunar days) except the 9th are good. Of the even tithis the 2nd, 6th and 10th are auspicious. Monday, Wednesday, Thursday and Friday are the best. Even Monday should be rejected when the Moon is waning. Sunday and Saturday are approved by some but in our opinion Saturday should be rejected as it connotes frequent thefts. Sunday should also be avoided unless the day is otherwise very auspicious. Fixed signs are the best. Movable signs should be rejected. Common signs may be preferred provided they are occupied by strong benefics … The rising sign at the time of laying the foundation should be highly fortified by the disposition of malefics in 3rd, 6th and 11th houses and benefics in kendras and trines. The 8th house should be vacant and in no case should it have the aspect of malefic planet"' },
    VASHISTHA: { ...VASHISTHA_KUSUM, pageLocus: 'Chapter Ten "Muhurta for starting construction of a new house", printed pp.120-123 (PDF 107-110): "It is auspicious to start constructing a house when the Sun is in Mesha (exalted). Jyeshtha, Ashadha, Bhadrapada, Ashwina, Kartika, Pausha, Magha are good for starting construction of a new house. When the Sun is transiting Kanyarashi (Virgo) or Dhanu (Sagittarius), it is not good to start construction of a new house. Tithi: 2, 3, 5, 6, 7, 10, 11, 12, and 13 (shukla), rikta tithis should not be used. Vara: Monday, Wednesday, Thursday, Friday and Saturday. Paksha: Shukla. Nakshatra: Rohini, Mrigashirsha, Punarvasu, Pushya, 3 uttaras, Hasta, Chitra, Swati, Anuradha, Sravana, Dhanishtha, Shatabhisha and Revati. One should not start construction of a new house in panchaka. Yoga: The following yogas should be left out: Vishakumbha, Atiganda, Shoola, Ganda, Vyaghata, Vajra, Vyatipata, Parigha and Vaidhriti. Karana: Bava, Taitila, Gara, Vanija, Shakuna, Kistughna. Lagna: 2, 3, 5, 6, 9 and 12 (rashi) aspected or posited by benefics. The malefics should be in 3, 6 and 11 houses … Moon should not be in 1, 6, 8 and 12 houses … The following are prohibited in griharambha: 1. Saturday - Revati nakshatra 2. Mars in the constellation of Hasta or Pushya 3. Jupiter and Venus combust 4. Krishna paksha 5. Any prohibited month 6. Rikta etc. bad tithis … 11. Bhadra, Poorvabhadra nakshatras 12. Vrishchika and Kumbha lagnas"' },
    JOSHI: { ...JOSHI_KK, pageLocus: 'Chapter 10 "(C) Starting construction", printed pp.116-118 (PDF 131-133): "(i) Months: Lunar months of Falguna, Shravana, Margsheersha, Pausa and Vaishakha are good provided Sun is not transiting in dual rashis (i.e. 3/6/9/12 rashis) … (ii) Nakshatras: All fixed nakshatras (i.e. Uttaraphalguni, Uttarashada, Uttarabhadrapad, Rohini), All Mridu Nakshatras (i.e. Mrigshira, Revati, Chitra and Anuradha); Shatbhisha, Swati, Dhanistha, Hasta and Pushya are considered good for starting construction of a house. The nakshatra selected should not be occupied by a malefic and should not suffer vedha from a malefic in Saptasalaka Chakra … Vastu Chakra: Counting from Sun\'s nakshatra first 7 nakshatras are malefic, next 11 nakshatras are benefic and next 10 nakshatras are malefic … (iii) Tithis Yoga etc.: Avoid Rikta (4/9/14 tithis), Amavshya (New Moon day) and Ashtami. All other tithis are good. Avoid Bhadra and malefic Yogas. Tuesday is highly malefic. Other days are good. Even Sunday, being a fixed (Dhruva) Vaar and Saturday - day of a slow moving planet, are considered good. (iv) Lagna-Shuddhi: Avoid movable rashi as Lagna (i.e. 1/4/7/10 rashis). Benefics should be powerfully placed in any house except 8th and 12th house. Malefics should be placed in 3/6/11 houses"' },
    RANGACHARYA: { ...RANGACHARYA_I, pageLocus: 'Chapter VI "House construction", printed pp.102-104 (PDF 110-112): "The lunar months of Vaisakha, Sravana, Kartika, Margasira, Magha and Phalguna are favoured for the commencement of house-construction. But the Vaisakha, Sravana and Phalguna are the best preferred months … The month\'s when the sun in Mithuna, Kanya, Dhanus and Meena should be prohibited. The bright fortnight (Suklapaksha) should be the first choice. The dark fortnight till the 10th lunar day is mediocre. Tithi: 2,3,5,6,7,10,11,12,13 and Poornima are good. Weekday: Wednesday, Thursday and Friday are good. Saturday is mediocre. Sunday and Tuesday should be discarded. Monday is preferred if the Moon is waxing. Asterism: Aswini, Chitra, Anuradha, Revati, Sravana, Mrigasira, Swati, Satabhisha, Hasta, Pushyami, Dhanishtta, Uttara, Uttarashada, Uttarabhadra, Rohini, Punarvasu are good. For Vastu Pooja and sthambha Prathishtta, Punarvasu, Moola and Jyeshtta are acceptable. Lagna: Mithuna, Kanya, Dhanus, Meena, Vrishabha are good. Vrischika and Simha are mediocre. Chara Lagnas and Charanavamsas should be discarded. The malefic planets in 3,6,11 and the benefic planets in 1,2,3,4,5,7,9,10,11 are ordinarily favoured"' },
    MUHURTA_CHINTAMANI: { ...MC_SHARMA, pageLocus: 'Chapter "Living in a city or village", sloka 15, printed p.303 (PDF 307): "The beginning of the construction of house is auspicious in these 13 Nakshtras - the Nakshtras named as Mridu or (Delicate), (Mrigashira, Rewati, Chitra and Anuradha) those named as Dhruwa or constant (the 3 Uttaras and Rohini), the nakshtras of Shatabhisha, Swati, Dhanishtha, Hasta and Pushya"; sloka 18, printed p.305 (PDF 309): "AUSPICIOUS TITHIS AND VAARS (DAYS) ETC. FOR THE BEGINNING OF THE CONSTRUCTION OF HOUSE: The beginning of the construction of house is regarded as auspicious on the days and Tithis other than the days of Tuesday and Sunday, the Tithis named as Rikta Tithis (4/9/14), those of Amavasya and Pratipada (the 8th Tithi according to symbol), in the other Ascendants than the Lagna or Ascendant called Chala or Movable (1/4/7/10), when the Benefic Planets are in the other House than the 12th and the 8th House and when the Malefic Planets are in the 3/6/11 Houses, in all the Nakshtras except the Panchaka Nakshtras"' },
    KALYANRAMAN: { ...KALYANRAMAN_V2, pageLocus: '"Starting Construction", printed p.192 (PDF 194): "Nakshatra Rohini, Mrigasira, Pushyami, Uttaraphalguni, Hasta, Chitra, Swati, Anuradha, Uttarashada, Dhanishta, Satabhisha, Uttarabhadrapada and Revati, (13) Fixed: Uttaraphalguni, Uttarashada, Uttarabhadrapada, Rohini (4) Friendly/Mridu: Mrigasira, Revati, Chitra, Anuradha, (4) Others: Satabhisha, Swati, Dhanishta, Hasta, Pushyami, (5) Tithis 1/2/3/5/6/7/10/11/12/13/15 Avoid Rikta, Amavasya & Ashtami. Weekdays Sunday, Monday, Wednesday, Thursday, Friday, Saturday, Avoid Tuesday. Notes: 1. Count from the Sun\'s Nakshatra to the day. It must be 8 to 18. Others are bad. 2. Lunar months Phalguna, Sravana, Margasheersha, Pausa, Vaisaka are good provided the Sun is not transiting raasis 3-6-9-12. 3. Nakshatra selected should not be occupied with malefic planets. It must not suffer from Vedha from a malefic in Saptasloki Chakra. 4. Avoid Rikta, Amavasya and Ashtami; Bhadra, malefic Yogas and Tuesday"' },
  },
  DIGGING: {
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§27.9 "Starting of digging", printed pp.724-726 (PDF 758-760): "27.9.2 Sleeping of the earth: The Earth is said to be in sleeping mode when the Moon\'s asterism is 5th, 7th, 9th, 12th, 19th & 26th from that of the Sun at the time of digging. According to Vaastubhushan, the earth sleeps during 1st, 4th, 12th, 16th & 21st Tithis. Naardeeya opines that the Earth sleeps for three months in each direction … No digging should be done in the direction on which the Earth is sleeping. 27.9.3 Constellation: Downward looking asterisms (Moola, Ashlesha, Vishakha, Krittika, Magha, and 3 Poorvas), Stationary (Rohini, 3 Uttras) & Sweet (Mrigshira, Chitra, Anuradha, Revati) asterisms are suitable for digging. The asterism chosen should not be conjoined with Mars. Benefic Yogas, benefic Tithis & movable signs for digging are auspicious. 27.9.4 Direction of digging … 27.9.5 Place of digging: … Divide the length, starting from SW to SE side, in 28 parts. Digging & foundation should be done around the left side of his navel which is at 18th part … If during initial stage of digging, inauspicious items like hair, coal / charcoal, bone, skin or iron are seen then, portends evil"' },
    KALYANRAMAN: { ...KALYANRAMAN_V2, pageLocus: '"Digging Foundation", printed p.190 (PDF 192): "Nakshatra Bharani, Krittika, Rohini, Mrigasira, Pushyami, Aslesha, Makha, Poorvaphalguni, Uttaraphalguni, Hasta, Chitra, Swati, Visaka, Anuradha, Moola, Poorvashada, Uttarashada, Dhanishta, Satabhisha, Poorvabhadrapada, Uttarabhadrapada and Revati. (22) Adhomukha: downwards looking - Moola, Aslesha, Visaka, Krittika, Poorvaphalguni, Poorvashada, Poorvabhadrapada, Bharani and Makha. (9) and also the following Nakshatras suitable for construction activities: Fixed … Mridu … Others: Satabhisha, Swati, Dhanishta, Hasta, Pushyami (5) Tithis Benefic Tithis 2/3/5/7/10/11/13 Weekdays Sunday, Monday, Wednesday, Thursday, Friday, Saturday. Notes: 1. Raasis 1/4/7/10 good for the Lagna. When the Sun is in 5/6/7 raasis start digging from Agni corner SE … 2. Mars or Saturn must not be with the chosen Nakshatra. Do not dig the earth while she is sleeping. She sleeps on the 5th, 7th, 9th, 10th, 21st and 24th days from solar ingress (Samkranti day). Do not dig the earth if the Moon\'s Nakshatra is the 5th, 7th, 9th, 12th, 19th or 26th from the Sun\'s Nakshatra on a particular day"' },
    JOSHI: { ...JOSHI_KK, pageLocus: 'Chapter 10 "(A) Digging for foundation laying", printed pp.114-115 (PDF 129-130): "It is only concerned with digging of earth and is different from actual foundation laying … (i) When Sun is in Leo, Virgo and Libra digging should be started from Agni Corner (South-East) … This is called consideration of Rahu Mukha or Shesha Naaga. (ii) One should not start digging when earth is sleeping, earth is said to sleep on 5th, 7th, 9th, 10th, 21st and 24th day from Solar ingress day or Samkranti day. Alternatively, Earth is said to sleep if Moon\'s nakshatra is 5th, 7th, 9th, 12th, 19th or 26th from Sun\'s nakshatra on a particular day. (iii) For digging (Khata) purpose, downward looking nakshatras i.e. Moola, Ashlesha, Vishakha, Kritika, Poorvaphalguni, Poorvashada, Poorvabhadrapad, Bharani and Magha, and nakshatras recommended for construction i.e. Uttaraphalguni, Uttarashada, Uttarabhadrapad, Rohini (All Fixed nakshatras), Mrigshira, Revati, Chitra, Anuradha (All Mridu nakshatras), Shatbhisha, Swati, Dhanistha, Hasta and Pushya are considered good. Benefic tithis, benefic yogas and movable lagnas (Lagna of 1/4/7/10 rashis) are considered good. The nakshatra chosen should not be conjoined with Mars or Saturn"' },
    WILHELM: { ...WILHELM_E, pageLocus: '"Construction - Digging", printed p.223 (PDF 231): "Nakshatra: Krittika, Rohini, Mrigasira, Pushya, Aslesha, Magha, Purvaphalguni, Uttaraphalguni, Hasta, Chitra, Svati, Visakha, Anuradha, Mula, Purvashadha, Uttarashadha, Sravana, Dhanishtha, Satabhisha, Purvabhadrapada, Uttarabhadrapada and Revati are favorable. Lagna: Moveable Rasis are best. Avoid fixed Rasis. Miscellaneous: Digging should not be done on days that Earth is sleeping. Earth is sleeping on the 5th, 7th, 9th, 10th, 21st and 24th Saura days following each Sankranti … Earth is also sleeping when the Moon is in the 5th, 7th, 9th, 12th, 19th or 26th Nakshatra from the Sun\'s Nakshatra"' },
  },
  FOUNDATION: {
    WILHELM: { ...WILHELM_E, pageLocus: '"Construction - Beginning construction (laying foundations)", printed pp.217-223 (PDF 225-231): "The time of laying the foundation is the most important time in the construction of a house or building; it is then that the building of the house is begun … Nakshatra: Rohini, Mrigasira, Pushya, Uttaraphalguni, Chitra, Svati, Anuradha, Mula, Uttarashadha, Sravana, Uttarabhadrapada and Revati are favorable. Asvini, Punarvasu, Hasta, Dhanishtha and Satabhisha are middling … Tithi: The 2nd, 6th and 10th Tithis and all odd Tithis except the 9th are favorable … Vara: The Varas of the Moon, Mercury, Jupiter, Venus and Saturn are favorable … Lagna: Fixed Rasis are best, dual Rasis occupied by benefics are middling … Bhavas: … Any planet located in the 8th causes disaster"' },
    RAMAN: { ...RAMAN_BV, pageLocus: 'Chapter XII "House Building", PDF pp.42-43: "Rohini, Mrigasira, Chitta, Hasta, Jyeshta, Uttara, Uttarashadha and Sravana are the best constellations to lay the foundation. Swati, Pushya, Anuradha, Aswini, Satabhisha, Uttarabhadra and Revati are ordinary or middling while the remaining twelve asterisms should invariably be avoided … Varahamihira suggests that after finishing the puja, the first foundation-stone shall be laid on the north-eastern corner of the site … The durability or duration of a dwelling house in a state of prosperity should be determined from the moment at which the foundation-stone is laid"' },
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§27.10 "Foundation laying", printed pp.726-727 (PDF 760-761): "After digging, the next important activity is laying of foundation. It should be done either in the north-east or south-east direction. Majority of the treatises & exponents like Sage Sharangdhar, Brahamshambhuji, Kashyap & Varah Mihir commend that it should be first done in SE direction … 1 (D.H.); 2, 3, 5, 7, 10, 11, 12 & 13 of (B.H.); Monday, Wednesday, Thursday, Friday & Saturday; & asterisms of Ashvani, Rohini, Mrigshira, Pushya, Hasta, Shravana, Revati & 3 Uttras are auspicious. K.P. advises that the day must be governed by a fortunate yoga like Siddha or Amrit yoga. Fixed signs are the best. Common signs occupied by the benefics have middling influence. A sign just vacated by the Sun is an auspicious rising sign. A sign occupied by the Sun even if it is occupied by benefics should be avoided. And a sign next to the Sun is good, if aspected by a benefic planet (K.P.) … Before laying the foundation stone, worshipping of Lord Brahma, Vaastupurush, Panchlokpaal, Kurma, Ganesh should be done"' },
    AGARWAL: { ...AGARWAL_GS, pageLocus: '"Laying foundation of a house", printed p.325 (PDF 325): "Days: Monday (but not when Moon is waning), Wednesday, Thursday, Friday. Tithis: 2, 3, 5, 7, 10, 11, 13 (prefer shukla paksha to 5th of krishna paksha). Nakshatras: Rohini, Mrigshira, Punarvasu, Hasta, Chitra, Swati, Dhanishta, Anuradha, Shatbhisha, Revati, all 3 Uttras (avoid P. bhadra being panchak). Months: Pausa, Magha, Phalguna, Vaisakha, Sravana (avoid Sun in dual sign). Lagna in Signs: 2, 3, 5, 6, 8, 9, 11. Muhurta kundli: Benefics in kendras & konas, malefics in 3, 6, 11. 8th and 12th should be vacant, fixed sign should be lagna. Avoid movable signs as lagna"' },
    KALYANRAMAN: { ...KALYANRAMAN_V2, pageLocus: '"Laying Foundation", printed p.191 (PDF 193-194): "Nakshatra Rohini, Uttarabhadrapada, Uttaraphalguni, Uttarashada are the best. (4) Fixed: Uttaraphalguni, Uttarashada, Uttarabhadrapada, Rohini (4) Tithis 2/3/5/7/10/11/13 (1/6/8/12/15 can also be accepted as mediocre) Weekdays Sunday, Monday, Wednesday, Thursday, Friday, Saturday, Avoid Tuesday. Notes: 1. Laying foundation is different from digging. The Isana NE and Agni SE corners are best suited. 2. Prefer Fixed Raasis - 2/5/8/11 - as Lagna. 3. Those Nakshatras recommended for construction are also good for this. They are: Mrigasira, Pushya, Hasta, Chitra, Swati, Anuradha, Dhanishta, Satabhisha and Revati"' },
    JOSHI: { ...JOSHI_KK, pageLocus: 'Chapter 10 "(B) Laying foundation", printed p.116 (PDF 131): "Laying foundation is different from digging. Most of the classics prescribe North East (Ishan) or South East (Agni) direction for laying foundation stone. Maharashi Garga says: For laying foundation Fixed nakshatras i.e. (Uttaraphalguni, Uttarashada, Uttarabhadrapad and Rohini) are best. Other nakshatras recommended for construction i.e. Mrigshira, Revati, Chitra, Anuradha, Shatbhisha, Swati, Dhanistha, Hasta and Pushya are also good. One should select benefic tithis, Yogas and Fixed rashis as lagnas. All days except Tuesday are good"' },
    VASHISTHA: { ...VASHISTHA_KUSUM, pageLocus: '"Shilanyasa muhurta", printed p.123 (PDF 110): "Tithi: 1 (Krishna pakasha), 2, 3, 5, 7, 11, 12 and 13 of shukla paksha. Vara: Monday, Wednesday, Thursday, Friday and Saturday. Nakashatra: Ashwini, Rohini, Mrigashirsha, Pushya, 3 uttaras, Hasta, Shravan and Revati"' },
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
  // Travel (a code ending in _MID that is not listed reads as its base code, marked).
  NAK_GHATI: 'நட்சத்திரத்தின் முதல் நாழிகைகள்', NAK_LATE_MID: 'நட்சத்திரம் — நாழிகைகள் கழிந்து (அவசரத்தில்)', PADA1_MID: 'முதல் பாதம்', KRISHNA_MID: 'தேய்பிறை',
  SUN_MID_THIRD: 'கடக / சிம்மத்தின் நடு மூன்றில் ஒன்றில் சூரியன்', HOLANTA: 'ஹோலாந்த பக்ஷம் (பால்குன வளர்பிறை)', WEAK_MOON: 'பலவீன சந்திரன் (தேய் 10 – வளர் 5)',
  GHATA_MONTH: 'காத மாதம்', GHATA_TITHI: 'காத திதி', GHATA_NAK: 'காத நட்சத்திரம்', GHATA_PADA: 'காத பாதம்', GHATA_MOON: 'காத சந்திரன் (ராசி)', GHATA_VARA: 'காத கிழமை', GHATA_LAGNA: 'காத லக்னம்',
  TITHI_SHOOLA: 'திதி சூலம் (இந்தத் திசைக்கு)', TITHI_DIR: 'திதி வகை இந்தத் திசைக்கு இல்லை', YOGINI: 'யோகினி முன் / பக்கம்', NAK_SHOOLA: 'நட்சத்திர சூலம்',
  VAAR_SHOOLA: 'வார சூலம்', CHANDRA_DIR: 'சந்திரன் பின்னால் / இடப்புறம்', PARIGHA: 'பரிக தண்டம் கடக்கிறது', VENUS_FRONT: 'சுக்கிரன் முன்னால்',
  RAHU_PAKSHA: 'சந்திரன் ராகுவின் மிருத பக்ஷத்தில்', RAHU_PAKSHA_MID: 'சந்திரன் கர்த்தரி / கிரஸ்த நட்சத்திரத்தில்', PANCHAKA_SOUTH: 'பஞ்சகத்தில் தெற்கு', MAHADALA: 'மகாதளம் / பிரமம்',
  KAALA_PASHA: 'காலம் / பாசம் முன்னால்', AYANA: 'அயனத்துக்கு எதிர்த் திசை', KAAL_SHOOLA: 'நட்சத்திர கால சூலம் (பகல் / இரவின் பகுதி)', ABHIJIT_SOUTH: 'அபிஜித் முகூர்த்தத்தில் தெற்கு',
  DIGDWAR_LAGNA: 'லக்னம் திசைக்கு எதிர் (பின்)', DIGDWAR_LAGNA_MID: 'லக்னம் திசைக்கு இடப்புறம்', LALATIKA: 'லலாடிக யோகம்', CHANDRA_KANTAKA: 'சந்திர கண்டகம்',
  PLANET_FRONT: 'புதன் / செவ்வாய் முன்னால் (வீடு)', VAAR_RAHU: 'வார ராகு', VENUS_WEAK: 'சுக்கிரன் வக்ரம் / அஸ்தங்கம் / நீசம்', MARS_MERC_WEAK: 'செவ்வாய் / புதன் வக்ரம் அல்லது அஸ்தங்கம்',
  RETRO_KENDRA: 'வக்ர கிரகம் கேந்திரத்தில்', VARA_LORD_RETRO: 'கிழமை அதிபதி வக்ரம்', VARA_LORD_SET: 'கிழமை அதிபதி அஸ்தங்கம்', LAGNA_LORD_RETRO: 'லக்னாதிபதி வக்ரம்',
  MOON_CONJ: 'சந்திரன் தனியாக இல்லை', MOON_NATAL: 'சந்திரன் ஜன்ம ராசி / ஜன்ம லக்ன ராசியில்', LAGNA_NATAL: 'ஜன்ம லக்னமே லக்னம்', LAGNA_BIRTH: 'பிறப்பிலிருந்து தவிர்க்க வேண்டிய ராசி லக்னம்',
  LORD_IN_LAGNA: '6 / 8-ஆம் அதிபதி லக்னத்தில்', KENDRA_NO_BENEFIC: 'கேந்திரத்தில் சுபர் இல்லை', KENDRA_MALEFIC: 'கேந்திரத்தில் பாவர் மட்டும்', KENDRA_MIXED_MID: 'கேந்திரத்தில் சுபரும் பாவரும்',
  NAK_VARA: 'கிழமை–நட்சத்திரச் சேர்க்கை', SARVANKA: 'சர்வாங்கம் (திதி + கிழமை + நட்சத்திரம்)', TRIANKA: 'த்ரியங்கம்', YATRA_PANCHAKA: 'பஞ்சகம்', YATRA_PANCHAKA_MID: 'பஞ்சகம் (முடிந்தவரை தவிர்)',
  JUP_VEN_LAGNA_MID: 'லக்னத்தில் குரு / சுக்கிரன் இல்லை', LAGNA_TITHI: 'இந்தத் திதி வகைக்கு லக்னம் கூடாது', NAV_NOT: 'தவிர்க்க வேண்டிய நவாம்சம் (கும்பம் / மீனம்)',
  // Vidyarambha.
  STHIRA_KARANA: 'ஸ்திர கரணம்', MERC_SET: 'புதன் அஸ்தங்கம்', SUN_MARS_NAV: 'லக்ன நவாம்சத்தில் சூரியன் / செவ்வாய்', BEN_HOUSE_MID: 'சொன்ன இடத்தில் புதன் / குரு / சுக்கிரன் இல்லை',
  // Education.
  MATRIKA: 'மாத்ருகா சக்கரம் (சூரிய நட்சத்திரத்திலிருந்து 1-7, 12-15)', LAGNA_LORD_MID: 'லக்னாதிபதி சுபர் அல்ல',
  // Business.
  MOON_VENUS_LAGNA_MID: 'லக்னத்தில் சந்திரன் / சுக்கிரன் இல்லை', MOON_MERC_LAGNA_MID: 'லக்னத்தில் சந்திரன் / புதன் இல்லை', BHURUDAN: 'பூருதன நாள் (ஹோலி — பால்குன பௌர்ணமி)',
  // Medicine, surgery.
  EMPTY_6: '6-ல் கிரகம்', EMPTY_7: '7-ல் கிரகம்', BEN_LAGNA_MID: 'லக்னத்தில் சுபர் (சந்திரன், புதன், குரு, சுக்கிரன்) இல்லை',
  MARS_SATURN: 'செவ்வாய் மீது சனியின் தொடர்பு (சேர்க்கை / பார்வை)', MARS_SATURN_MUTUAL: 'செவ்வாய், சனி பரஸ்பரப் பார்வை',
  JUP_MOON_LAGNA_MID: 'லக்னத்தில் குரு, சந்திரன் இல்லை', MALEFIC_6_MID: '6-ல் பாவர் இல்லை', SUN_MOON_KENDRA_MID: 'சூரியன், சந்திரன் கேந்திரத்தில் இல்லை',
  // The recovery bath.
  MOON_NOT_WEAK_MID: 'சந்திரன் "க்ஷீணம்" இல்லை (4 / 8 / 12-ல் இல்லை)', MOON_WEAK_MID: 'சந்திரன் க்ஷீணம் (4 / 8 / 12-ல்)',
  // Agriculture.
  HALA_CHAKRA: 'ஹல சக்கரம்: தீய நட்சத்திரம் (சூரியனிலிருந்து எண்ணி)', RAHU_CHAKRA: 'ராகு (பணி) சக்கரம்: தீய நட்சத்திரம்',
  VENUS_CHAKRA: 'சுக்கிரனிலிருந்து எண்ணி நல்ல நட்சத்திரம் அல்ல', VRIKSHA_CHAKRA: 'விருக்ஷ சக்கரம்: தீய நட்சத்திரம் (சூரியனிலிருந்து)',
  NAVANNA_CHAKRA: 'நவான்ன சக்கரம்: தீய நட்சத்திரம் (புதனிலிருந்து)', BHU_RAJASVALA: 'பூமி ரஜஸ்வலை (சூரியன் திருவாதிரையில் நுழைந்த மூன்று நாள்)',
  AGNI_NAKSHATRA: 'அக்னி நட்சத்திர நாட்கள்', KARANA: 'நூல் சொன்ன கரணம் அல்ல', VARA_LORD_LAGNA: 'லக்னம் கிழமை அதிபதியின் ராசி அல்ல',
  JUP_LAGNA_MID: 'லக்னத்தில் குரு இல்லை', JUP_4_MID: '4-ல் குரு இல்லை', SAT_4_MID: '4-ல் சனி இல்லை',
  JANMA_BODY: 'ஜன்ம நட்சத்திரத்திலிருந்து எண்ணி முதுகு / பாதப் பகுதி (ஸ்ரீதர் §20.7)', CONJ: 'நூல் தவிர்க்கச் சொன்ன கிரக சேர்க்கை',
  JUP_7_MID: '7-ல் குரு இல்லை', SAT_6_MID: '6-ல் சனி இல்லை', SUN_MARS_3_10_11_MID: '3 / 10 / 11-ல் சூரியன், செவ்வாய் இல்லை', SUN_MARS_10_11_MID: '10 / 11-ல் சூரியன், செவ்வாய் இல்லை',
  VEN_MOON_1_4_MID: 'லக்னம் / 4-ல் சுக்கிரன், சந்திரன் இல்லை', VEN_MOON_LAGNA_MID: 'லக்னத்தில் சுக்கிரன், சந்திரன் இல்லை', SUN_10_11_MID: '10 / 11-ல் சூரியன் இல்லை',
  SAT_11_MID: '11-ல் சனி இல்லை', SAT_6_11_MID: '6 / 11-ல் சனி இல்லை', VEN_MOON_4_MID: '4-ல் சுக்கிரன், சந்திரன் இல்லை', JUP_TRIKONA_MID: 'குரு 1 / 5 / 9-ல் இல்லை',
  JUP_KONA_MID: 'குரு 5 / 9-ல் இல்லை', SAT_UPACHAYA_12_MID: 'சனி 3 / 6 / 10 / 11 / 12-ல் இல்லை',
  BHU_SHAYANA: 'பூமி சயனம் (சூரிய நட்சத்திரத்திலிருந்து 5, 7, 9, 12, 19, 26)', VASTU_CHAKRA: 'வாஸ்து சக்கரம்: சூரிய நட்சத்திரத்திலிருந்து 8-18 அல்ல',
  PADA: 'நூல் சொன்ன பாதம் அல்ல', MARS_4_MID: '4-ல் செவ்வாய் இல்லை', JUP_KENDRA_KONA_MID: 'குரு கேந்திரம் / திரிகோணத்தில் இல்லை', SUN_KETU_LAGNA_MID: 'லக்னத்தில் சூரியனும் கேதுவும் இல்லை', MARS_11_MID: '11-ல் செவ்வாய் இல்லை',
  MERC_589_MID: 'புதன் 5 / 8 / 9-ல் இல்லை', BEN_5_9_MID: '5 / 9-ல் சுபர் இல்லை', MAL_8_MID: '8-ல் பாபன் இல்லை',
  JUP_SAT_LAGNA_MID: 'லக்னத்தில் குருவோ சனியோ இல்லை', MARS_6_MID: '6-ல் செவ்வாய் இல்லை', VENUS_10_MID: '10-ல் சுக்கிரன் இல்லை',
  MARS_SAT_3_11_MID: 'செவ்வாயும் சனியும் 3 / 11-ல் இல்லை', MERC_KENDRA_MID: 'புதன் கேந்திரத்தில் இல்லை',
  KING_CHAKRA: 'சூரியனிலிருந்து எண்ணி அரசுக்கு ஆகாத நட்சத்திரம்', NRIP_BANA: 'ந்ருப பாணம் (சூரியன் 5, 14, 23 பாகை)', RAJA_PANCHAKA: 'ராஜ பஞ்சகம்',
  JMV_LAGNA_MID: 'லக்னத்தில் குரு / புதன் / சுக்கிரன் இல்லை', BEN_4_10_MID: '4, 10-ல் சுபர் இல்லை', SUN_STAR: 'சூரியன் நூல் தள்ளிய நட்சத்திரத்தில்',
});
/** The agricultural chakras' names (the page's rule lines). */
const CHAKRA_TA = Object.freeze({
  HALA_CHAKRA: 'ஹல சக்கரம்', RAHU_CHAKRA: 'ராகு (பணி) சக்கரம்', VENUS_CHAKRA: 'சுக்கிர சக்கரம்', VRIKSHA_CHAKRA: 'விருக்ஷ சக்கரம்', NAVANNA_CHAKRA: 'நவான்ன சக்கரம்', KING_CHAKRA: 'அரசு சக்கரம் (பதவி ஏற்பு)',
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

const NOTES_TRAVEL_TA = Object.freeze([
  'திசை = பயணம் தொடங்கும் இடத்திலிருந்து போகும் இடத்தின் திசை (ஜோஷி: டில்லியிலிருந்து பம்பாய் தெற்கு). திசை தேர்ந்தால் மட்டும் திசை விதிகள் (சூலங்கள், யோகினி, சந்திரன், சுக்கிரன், பரிகம், காலம்-பாசம், அயனம், லலாடிகம், திக்த்வார லக்னம்) கணிக்கப்படும்.',
  'நான்கு திசைக்குச் சொன்ன விதி அதற்கு அடுத்த கோணத்துக்கும் (கிழக்கு — தென்கிழக்கும், தெற்கு — தென்மேற்கும், மேற்கு — வடமேற்கும், வடக்கு — வடகிழக்கும்; ஸ்ரீதர் ப.613). இரண்டு பகுதியாக (அயனம், பரிகம்): கிழக்கு, தென்கிழக்கு, வடக்கு, வடகிழக்கு ஒன்று; தெற்கு, தென்மேற்கு, மேற்கு, வடமேற்கு ஒன்று.',
  'முன் / வலம் / பின் / இடம்: பயணத் திசையை நோக்கி நிற்கும்போது — கிழக்கே போகும்போது தெற்கு வலம், வடக்கு இடம். சந்திரனின் திசை அதன் ராசியால் (மேஷம், சிம்மம், தனுசு கிழக்கு; ரிஷபம், கன்னி, மகரம் தெற்கு; மிதுனம், துலாம், கும்பம் மேற்கு; கடகம், விருச்சிகம், மீனம் வடக்கு); லக்னத்தின் திசையும் அப்படியே.',
  'ராகுவின் பக்ஷம்: அபிஜித் உட்பட 28 நட்சத்திரங்கள்; ராகு நிற்கும் நட்சத்திரம் கர்த்தரி (1), அதிலிருந்து முன்னோக்கி 2-14 ஜீவ பக்ஷம், 15 கிரஸ்தம், 16-28 மிருத பக்ஷம் (மு.சி. ஸ்லோ.14; ஸ்ரீதர் அட்டவணை 23.11).',
  'சுக்கிரன் உதயம்: சூரியனை விடக் குறைந்த பாகையில் இருந்தால் கிழக்கில் உதிக்கிறார் (வில்ஹெல்ம், ஜோஷி). ஸ்ரீதர் அச்சில் இதற்கு எதிராக ("சூரியனை விட அதிகம் — கிழக்கு") — அவரது வாசிப்பில் அச்சில் உள்ளபடி; உங்கள் முடிவுக்கு. வில்ஹெல்மின் "வடக்கு / தெற்கு கிராந்தி" மு.சி.யின் கோளமாக (மேஷம்–கன்னி வடக்கு) கணிக்கப்படுகிறது (எங்கள் வாசிப்பு).',
  'நாழிகை: ஒரு நட்சத்திரத்தின் 60-ல் (மு.சி. "60 என்று கொண்டு, விகிதப்படி"); வார சூல விடுப்பு — சூரிய உதயத்திலிருந்து நாழிகை (24 நிமிடம்). பகல் / இரவின் மூன்றில் ஒன்று: உதயம் முதல் அஸ்தமனம், அஸ்தமனம் முதல் உதயம். அபிஜித் முகூர்த்தம்: பகலின் 15 முகூர்த்தங்களில் 8-வது.',
  'காதம்: ஜன்ம ராசியால் (சந்திரன் பிறப்பில் நின்ற ராசி) — மாதம், திதி வகை, கிழமை, நட்சத்திரம், பாதம், சந்திரன் நிற்கும் ராசி, லக்னம். நூல்களின் அட்டவணைகள் பெரும்பாலும் ஒன்றே; வேறுபடுபவை — மாதம் (ஸ்ரீதர் அட்டவணை 23.1; ஜோஷி, கல்யாணராமன்: மேஷத்துக்குக் கார்த்திகை முதல் வரிசையாக), பாதம் (ரிஷபம் — வில்ஹெல்ம், மு.சி. மகம் 2; ஜோஷி, கல்யாணராமன், வசிஷ்டா சித்திரை 2), லக்னம் (ரங்காச்சார்யாவின் தனி அட்டவணை).',
  'சர்வாங்கம், பஞ்சகம்: திதி 1-30 (வளர் பிரதமை 1), கிழமை (ஞாயிறு 1), நட்சத்திரம் (அசுவினி 1), லக்னம் (மேஷம் 1). பஞ்சகம்: கூட்டுத்தொகை 9-ஆல் மீதி 1, 2, 4, 6, 8 (காலப்பிரகாசிகையின் +15, +12, +10, +8, +4 முறையும் இதுவே).',
  '"குறிக்கப்படும்" — அந்த நூலே முதன்மை விதிகளுக்குப் பின் வைப்பவை (வில்ஹெல்ம் ப.305, ஜோஷி ப.130/136, கல்யாணராமன் ப.211, ஸ்ரீதரின் ப.616 பட்டியலுக்கு வெளியே உள்ளவை): விலக்கவில்லை, காட்டப்படும்.',
  'கணிக்கப்படாதவை: சகுனம், உடல் நிலை, மனைவி கர்ப்பம், குடும்ப ஆசௌசம், திரிநவமி (திரும்பிய நாளிலிருந்து), கிரகணம், சம இரவு-பகல் நாள், க்ஷய / அதிக மாதம், ஹோரை, வேளை, மாத–திதி அட்டவணை, கண்ட / யாமார்த்த / முகூர்த்த ராகு, வார யோகினி, உஷை / கோதூளி / நள்ளிரவுக் காலபலம், கிரக யுத்தம், லக்னாதிபதியின் ஷட்வர்க்க வக்ரம் (ராசி மட்டும்), பிறந்த 8, 6-ஆம் அதிபதி லக்னத்தில், ரங்காச்சார்யாவின் காத திதியின் 6 நாழிகை விடுப்பு, வசிஷ்டாவின் திதி யாத்திரா சக்கரம், ஜாதகத்தில் சுபர் நின்ற ராசி லக்னம், ராஜ யோகங்கள், வெற்றி யோகங்கள்.',
]);

const NOTES_VIDYARAMBHA_TA = Object.freeze([
  'இங்கே வித்யாரம்பம் = அக்ஷராப்யாசம் / அக்ஷராரம்பம் — குழந்தைக்கு முதல் எழுத்துகள், உபநயனத்துக்கு முன் (கல்யாணராமன்: "வித்யாரம்பம் பதினாறு சம்ஸ்காரங்களில் பத்தாவது"). உபநயனத்துக்குப் பின் கல்வி தொடங்குதல் (ஸ்ரீதர் §17.11.2, மு.சி. 5/38, வில்ஹெல்ம் "Vidya & Upavidya", ஜோஷி அத்.VIII, கல்யாணராமன் அத்.4.1, வசிஷ்டா "Starting main line of education") தனி நிகழ்வு — அடுத்து.',
  'பகலின் பகுதிகள் உபநயனத்தைப் போலவே (மூன்றில் ஒன்று, நண்பகல், மூன்றில் இரண்டு); இரவு — கல்யாணராமன் கடைசி மூன்றில் ஒன்றை (அபரராத்திரி) ஏற்கிறார், மற்ற நூல்களுக்கு விலக்கு (சொல்லாதவற்றுக்கும் — எங்கள் வாசிப்பு). சந்தி நேரங்களின் அளவு சொல்லப்படவில்லை.',
  'ஸ்திர கரணங்கள்: சகுனி, சதுஷ்பாதம், நாகம் (தேய் 14-ன் இரண்டாம் பாதி, அமாவாசை), கிம்ஸ்துக்னம் (வளர் 1-ன் முதல் பாதி).',
  'விஜயதசமி: ஆஸ்வின (சந்திர) மாத சுக்ல தசமி — அந்தத் திதி நடக்கும் நேரம் (கல்யாணராமன்: உதயத்துக்குப் பின் 6 நாழிகைக்கு மேல் இருக்கும் நாள்; நாள் கணக்கு செய்யப்படவில்லை). அவரது வாசிப்பில் அந்த நேரத்துக்கு நூலின் தனி விதிகள் எதுவும் இல்லை; பொது விதிகள் (தாரை, சந்திரன், லக்ன சுத்தி) பக்கத்தில் உள்ளபடி.',
  'அபிஜித் (கல்யாணராமன், வசிஷ்டா, ஜோஷி, அகர்வால்): சந்திரன் உத்திராடம் 4-ஆம் பாதம் முதல் திருவோணத்தின் முதல் 4/60 வரை.',
  'கணிக்கப்படாதவை: வயது (காட்டப்படும்), இரட்டை ஆண்டு, அடுத்த நாள் அனத்யாயம் (கல்யாணராமன்), ஷட் / கர்த்ரு / நித்ய தோஷங்கள், புதன் கோசாரம் (ஸ்ரீதர்), சாரஸ்வத / வித்யா யோகங்கள், பாப உதயம், பாப பார்வை, திசை (ஆசிரியர் கிழக்கு, குழந்தை மேற்கு — காட்டப்படும்), வில்ஹெல்மின் ஜன்ம / 10-வது தாரை "நல்லது" (பக்கத்தின் பொதுத் தாரா பலம் மாறவில்லை).',
]);

const NOTES_EDUCATION_TA = Object.freeze([
  'உபநயனத்துக்குப் பின் கல்வி (வித்யா — வேதங்கள், வேதாங்கங்கள், நியாயம், மீமாம்சை, தர்ம சாஸ்திரம், புராணங்கள்; உபவித்யா — மருத்துவம், இசை, பொருளியல், ஆயுதம்) தொடங்குதல் — பொது விதிகள். குழந்தையின் முதல் எழுத்துகள் "வித்யாரம்பம்" தனி நிகழ்வு.',
  'பாடவாரி நட்சத்திரங்கள் (இலக்கணம், தர்க்கம், ஜோதிடம், கணிதம், மருத்துவம், வில்வித்தை, இசை, நடனம், சட்டம், ஓவியம் …) நூல்களில் உள்ளன (வில்ஹெல்ம் ப.234, ஸ்ரீதர் §17.11.4-6, ராமன் அத்.XI, ஜோஷி அத்.8, கல்யாணராமன் பக்.150-154, வசிஷ்டா ப.85-87, ரங்காச்சார்யா ப.119-120) — இங்கே கணிக்கப்படவில்லை; பொது விதிகள் மட்டும்.',
  'பகலின் பகுதி: முற்பகல், நண்பகல் (பகலின் முதல் மூன்றில் இரண்டு); பிற்பகல் (கடைசி மூன்றில் ஒன்று), இரவு கூடாது — வில்ஹெல்ம், ஸ்ரீதர்; மற்ற நூல்கள் சொல்லவில்லை.',
  'கணிக்கப்படாதவை: வயது (காட்டப்படும்), சந்திகள் (அயன, ருது, ஆண்டு சந்தி — ஸ்ரீதர், J.V.), சரஸ்வதி / வித்யா யோகங்கள், புதன் பலம் (ஜோஷி), சுப நவாம்சம் / புதன் வர்க்கம் / புதன் ஹோரை "சிறந்தது" (ஸ்ரீதர்), J.V.யின் கலக்ரஹ வரிசை (இரு பக்ஷமும் 1, 7, 8, 9, 13, 14, 15, 30 — தேய் 4), சோமபாத, யுகாதி, மன்வாதி திதிகள், வில்ஹெல்மின் ஜன்ம / 10-வது தாரை "நல்லது".',
]);

const NOTES_BUSINESS_TA = Object.freeze([
  'இங்கே: சிறிய அளவில் வியாபாரம் தொடங்குதல் / கடை திறப்பு (விபணி). பெரிய வியாபாரம் (ரங்காச்சார்யா: மேஷ, ரிஷப, மிதுன, துலா, விருச்சிக, மகர, கும்ப சௌர மாதங்கள், வளர் 2, 3, 5, 7, 11, புதன்–வெள்ளி, பூசம், மூன்று உத்திரம், அஸ்தம், சித்திரை; வசிஷ்டா ப.101 அதையே ஒத்து), விற்றல், வாங்குதல், தொழில்வாரி நட்சத்திரங்கள் — கணிக்கப்படவில்லை.',
  '"லக்னத்தில் சந்திரன், சுக்கிரன்" — வில்ஹெல்ம் "சுக்கிரன் அல்லது சந்திரன்", ஜோஷி / கல்யாணராமன் "விருப்பம்", ரங்காச்சார்யா "மிகச் சிறந்தது": இரண்டில் ஒன்றும் இல்லையெனில் குறிக்கப்படும், விலக்கவில்லை (மு.சி., ஸ்ரீதருக்கும் — எங்கள் வாசிப்பு). சுபர் 2, 10, 11-ல் — குறிக்கப்படும். 8, 12-ல் பாவர் (ராகு, கேது உட்பட) — விலக்கு; வசிஷ்டா: 8, 12-ல் எந்தக் கிரகமும் கூடாது.',
  '"நல்ல திதி" (வில்ஹெல்ம்) — வரையறை இல்லை; ரிக்த (4, 9, 14) மட்டும் விலக்கு. ஜோஷி, மு.சி., ஸ்ரீதர், ரங்காச்சார்யா: ரிக்த தவிர எல்லாத் திதியும் (அமாவாசை உட்பட — அச்சில் உள்ளபடி).',
  'கணிக்கப்படாதவை: வசிஷ்டாவின் "சந்திரன் பலவீனமில்லாமல்" (வரையறை இல்லை), காரக கிரகம், புதன் பலம்; மாத / ஆண்டு இறுதி அமாவாசை அவரது திதிப் பட்டியலிலேயே இல்லை; சந்திர / தாரா சுத்தி பொதுப் பகுதியில்.',
]);

const NOTES_ROGA_SNANA_TA = Object.freeze([
  'இரண்டு மரபுகள்: மு.சி. (ஸ்ரீதர், கல்யாணராமன், ஜோஷி, ரங்காச்சார்யா) — ரிக்த திதி நல்லது, சர லக்னம், பாவர் கேந்திர கோணத்தில் (மு.சி.: 11-லும்), சந்திரன் க்ஷீணம்; K.P. (வில்ஹெல்ம், ராமன், அகர்வால்) — ரிக்த, அமாவாசை கூடாது, சந்திராஷ்டமம் கூடாது, பாவர் 3, 6-ல், சுபர் கேந்திர கோணத்தில். ஸ்ரீதர் இரண்டையும் தருகிறார்; அவரது முதல் வாசிப்பு மு.சி.',
  'பாவர் / சுபர் இருக்க வேண்டிய இடங்கள், சந்திரன் க்ஷீணம் — குறிக்கப்படும், விலக்கவில்லை (எங்கள் வாசிப்பு — மற்ற காரியங்களைப் போல). "க்ஷீண சந்திரன்": மு.சி. உரை — 4, 8, 12 வீடுகள் (லக்னத்திலிருந்து — எங்கள் வாசிப்பு); ஸ்ரீதர் — ஜன்ம ராசிக்கு 4, 8, 12; J.V. — தேய் 10 முதல் வளர் 5 வரை (கணிக்கப்படவில்லை); கல்யாணராமன் — "க்ஷீணமாக இருக்கக் கூடாது" (மாறாக).',
  'அச்சுப் பிழைகள் போலத் தெரிபவை: கல்யாணராமன், ஜோஷியின் 18-ல் புனர்பூசம் உள்ளது, அனுஷம் இல்லை (மு.சி.யின் 18-ல் அனுஷம் உண்டு, புனர்பூசம் இல்லை) — அச்சில் உள்ளபடி; ரங்காச்சார்யாவின் "Avoid the rikta tithis, Sunday …" — "நல்லவை" என்று படித்தோம்; கல்யாணராமனின் குறிப்பு 5 குறிப்பு 3-க்கு முரண் — கணிக்கப்படவில்லை.',
  'கணிக்கப்படாதவை: செவ்வாய் கோசாரத்தில் பலவீனம் (ஜோஷி, கல்யாணராமன்), "சந்திரன் பாவராக இருக்கக் கூடாது" (வில்ஹெல்ம்), இரண்டாம் குளியலுக்கு ஞாயிறு / சூரியனின் ராசி (வில்ஹெல்ம்), நோய் நீங்கிய பின் வெளியே செல்லுதல் (ஸ்ரீதர் §22.6), எண்ணெய்க் குளியல்.',
]);
const NOTES_OLD_HOUSE_TA = Object.freeze([
  'பழைய வீடு — வாங்கிய, வாடகை, பழுது பார்த்த, தீ / வெள்ளம் முதலியவற்றால் அழிந்து மீண்டும் கட்டிய வீடு. ஒவ்வொரு நூலும் புது வீட்டு விதிகளுடன் கூடுதலாக: கார்த்திக, மார்கசீர்ஷ, ஸ்ராவண மாதங்கள் (புது வீட்டின் நடுத்தர மாதங்கள் இங்கே நல்லவை); சதயம், பூசம், சுவாதி, அவிட்டம்; குரு, சுக்கிரன் அஸ்தங்கம் (பால்ய, விருத்த நிலை, சிம்மத்தில் குரு) பார்க்க வேண்டாம். திதி, கிழமை, லக்னம், கும்ப சக்கரம், வாசல் திசை — அந்த நூலின் புது வீட்டு வாசிப்பே.',
  'உத்தராயணம்: ஸ்ரீதர் — பழைய வீட்டுக்கு தக்ஷிணாயனத்திலும் நுழையலாம். மற்ற நூல்கள் சேர்த்த மாதங்கள் தக்ஷிணாயன மாதங்கள்; ஆகவே அவற்றிலும் உத்தராயண விதி இல்லை (எங்கள் வாசிப்பு).',
  'ஸ்ரீதரின் மற்ற மேற்கோள்கள் (கணிக்கப்படவில்லை): வசிஷ்டர் — பஞ்சாங்க சுத்தி மட்டும், மாதம் / அயனம் பார்க்க வேண்டாம்; M.M. — ஏற்கெனவே நுழைந்த வீடு அல்லது நீண்ட பயணத்துக்குப் பின்: ஸ்திர, மிருது நட்சத்திரங்கள்; பயத்தால் விட்டுச் சென்ற வீட்டுக்குத் திரும்ப: திருவோணம், மூலம், அசுவினியும்; மூன்று வகை நுழைவிலும் வேதை உள்ள நட்சத்திரம் கூடாது; தேய்பிறை 10 வரை மட்டும் (அவரது திதிப் பட்டியல் ஏற்கெனவே அப்படி).',
  'ரங்காச்சார்யா (ப.42): பழைய வீட்டில் நுழைவு மௌட்யத்திலும் (குரு / சுக்கிரன் அஸ்தங்கம்) செய்யலாம் — அவரது புது வீட்டு வாசிப்பிலேயே அஸ்தங்க விதி இல்லை, ஆகவே தனி வாசிப்பு இல்லை. கல்யாணராமன், வசிஷ்டாவில் பழைய வீட்டுக்குத் தனி விதி இல்லை. ராமன் (அத்.XII, PDF ப.46) "வேறு வீட்டுக்கு மாறுதல்" — தனி விதி: கிழமை, ரிக்த திதி, தாரா / சந்திர பலம்; புது வீட்டு விதிகளிலிருந்து பெறப்பட்டது அல்ல.',
]);
const NOTES_MEDICINE_TA = Object.freeze([
  'இங்கே: மருந்தின் முதல் வேளை / சிகிச்சை தொடக்கம். கணிக்கப்படாதவை (நூல்களில் உள்ளன): நோய்வாரி சிகிச்சைகள் — காய்ச்சல், தொழுநோய், வாதம், பித்தம், கபம், மேகநோய், காசம், ஜலோதரம், வலிப்பு, மூக்கு (வில்ஹெல்ம், ராமன், ஸ்ரீதர்); பேதி / வாந்தி மருந்து, ரத்தம் எடுத்தல் (மு.சி. 2/30, ஸ்ரீதர், வில்ஹெல்ம்); ஊசி, பல் (ராமன், வில்ஹெல்ம்); மருந்து தயாரித்தல் (ஸ்ரீதர் §22.2, வில்ஹெல்ம், ராமன்); உக்ர யோகங்கள்.',
  'ஜன்ம நட்சத்திரம் — பெரும்பாலான நூல்கள் விலக்கு (பொதுப் பகுதியிலும் விலக்கு). "லக்னத்தில் சுபர்" — மு.சி.யின் ஸ்லோகத்தில் நிபந்தனையாக உள்ளது; மற்ற நூல்கள் "சிறந்தது", "விருப்பம்": எல்லா நூலிலும் குறிக்கப்படும், விலக்கவில்லை (எங்கள் வாசிப்பு — வியாபாரத்தைப் போல).',
  'நோய் தொடங்கிய நட்சத்திரப் பலன் (எத்தனை நாளில் குணம்), பாம்புக்கடி நட்சத்திரங்கள் — சிகிச்சை முகூர்த்தம் அல்ல; காட்டப்படவில்லை. நோய் நீங்கிய முதல் குளியல் (ரோகமுக்த ஸ்நானம்) — தனிக் காரியம், இன்னும் கட்டப்படவில்லை.',
]);
const NOTES_SURGERY_TA = Object.freeze([
  'செவ்வாய் "பலமாக" (ராமன், ஸ்ரீதர் — K.P.), "சாதகமாக" (வில்ஹெல்ம்) — வரையறை இல்லை, கணிக்கப்படவில்லை. அறுக்கும் உறுப்புக்குரிய பாவம், அதன் அதிபதி, திசு கிரகம் — அறுவையின் இடம் தெரிய வேண்டும்; கணிக்கப்படவில்லை.',
  'செவ்வாய்–சனி: வில்ஹெல்ம் — "சனியின் தாக்கம் இல்லாமல்": சேர்க்கை அல்லது சனியின் 3, 7, 10 பார்வை விலக்கு; ராமன் — "பரஸ்பரப் பார்வை": செவ்வாய் சனியை (4, 7, 8), சனி செவ்வாயை (3, 7, 10) இரண்டும் பார்த்தால் விலக்கு. ராசிப் பார்வை (எங்கள் வாசிப்பு).',
  'வில்ஹெல்ம்: "சிகிச்சைக்குச் சொன்னதுடன் கூடுதலாக" — அதன் 7, 12 காலி குறிக்கப்படும்; நட்சத்திரம், திதி, கிழமை, லக்னம் அறுவையின் சொந்தப் பட்டியல். அழகு அறுவை / பச்சை குத்தல் (திதி 1, 3, 11, 13; வெள்ளியும்; துலாமும்) — கணிக்கப்படவில்லை.',
]);

const NOTES_VEHICLE_TA = Object.freeze([
  'வாகனம் வாங்குதல், முதன்முதலில் ஓட்டுதல், ஓட்டப் பழகுதல். வசிஷ்டா (ப.137): வாகனம் ஓட்டுதல் / வாங்குதல் "சர இயல்புடைய காரியம் — சர லக்னமே பொருத்தம்".',
  'கல்யாணராமனில் இரண்டு பகுதிகள் — வாங்குதல் / ஓட்டப் பழகுதல் (ப.186), புது வாகனம் ஓட்டுதல் (ப.242): இரண்டும் தனி வாசிப்புகள். ஸ்ரீதர் §25.5 "தேர் — போக்குவரத்து வேலைகள்": வாகனம் தயாரித்தலிலும் அதே வாசிப்பு.',
  'மு.சி., ஜோஷி, ராமன், ரங்காச்சார்யா, அகர்வாலில் வாங்குதல் / ஓட்டுதலுக்குத் தனிப் பகுதி இல்லை — அவற்றின் திதி / நட்சத்திர / ராசி வகைப் பட்டியல்களில் இக்காரியம் பெயரிடப்பட்ட இடங்களிலிருந்து வாசிப்பு (பொதுப் பட்டியல்: பெயரிட்ட நட்சத்திரங்கள் மட்டும்; பெயரிட்ட திதி / கிழமை / லக்னம் நல்லவை, மற்றவை நடுத்தரம் — எங்கள் வாசிப்பு). ஜோஷி (ப.107) — தயாரித்தல் / வியாபாரம்.',
]);
const NOTES_VEHICLE_MAKE_TA = Object.freeze([
  'வாகனம் தயாரித்தல், விற்றல் / வாங்குதல் — வியாபாரமாக. ஸ்ரீதர் §25.5 "தேர் சம்பந்தமான எல்லா வேலைகளும்" — வாங்கி ஓட்டுதலிலும் அதே வாசிப்பு.',
]);

const NOTES_NEW_CLOTHES_TA = Object.freeze([
  'புது ஆடையை முதலில் அணிதல். பெண்களுக்குத் தனி விலக்குகள் (சுமங்கலிக்கு ரோகிணி, மூன்று உத்திரம், புனர்பூசம், பூசம்; சிலர் ஞாயிறு / செவ்வாய்) — அணிபவர் யார் எனத் தெரியாததால் கணிக்கப்படவில்லை; ஒவ்வொரு நூலின் குறிப்பிலும்.',
  'திருமணம், பண்டிகை, அரசன் / பெரியோர் கொடுத்த ஆடை — முகூர்த்தம் பார்க்க வேண்டாம் (மு.சி., ஸ்ரீதர், வில்ஹெல்ம்). புது ஆடை எரிந்தால் / கிழிந்தால் பலன் (ஒன்பது பாகம்) — காட்டப்படவில்லை.',
]);
const NOTES_NEW_ORNAMENTS_TA = Object.freeze([
  'புது ஆபரணம் முதலில் அணிதல். மு.சி. ஸ்லோ.2/10, ஜோஷி — ஆடைக்கும் ஆபரணத்துக்கும் ஒரே விதி. கல்யாணராமனின் ப.235 — செய்தலுக்கும் அணிதலுக்கும்.',
  'சேர்க்கைகள் (குரு உச்சத்தில் லக்னத்தில், சுக்கிரன் கேந்திர கோணத்தில் …), மோதிரம், தலை ஆபரணம், வளையல் (ஸ்ரீதர் §19.12) — கணிக்கப்படவில்லை.',
]);
const NOTES_ORNAMENT_MAKING_TA = Object.freeze([
  'ஆபரணம் செய்ய / செய்விக்க. தங்கம், ரத்தினம் / வைரம், முத்து — நூல்கள் வேறுபடுத்துகின்றன; கணிப்பது பொது விதி, மற்றவை குறிப்புகளில்.',
]);
const NOTES_CLOTHES_WASHING_TA = Object.freeze([
  'புது ஆடையை முதலில் துவைத்தல் (ஸ்ரீதர், ரங்காச்சார்யா "புது ஆடை"; மு.சி., வில்ஹெல்ம் பொதுவாக). பர்வ திதி — பௌர்ணமி, அமாவாசை என்று எடுத்தோம்; அஷ்டமி, சதுர்த்தசி, சங்கிராந்தியும் பர்வம் என்பர் சிலர்.',
]);
const NOTES_STITCHING_TA = Object.freeze([
  'ஆடை தைத்தல், தையல் கற்றல், தையல் கடை திறத்தல். நெய்தல், துணி ஆலை, சாயம் — கைத்தொழில் குடும்பத்தில் தனியாக வரும்.',
]);

const NOTES_AGRI_GENERAL_TA = Object.freeze([
  'தனி விதி இல்லாத விவசாய வேலைகளுக்கு (கல்யாணராமன், ஜோஷி). ராமன்: "எல்லா விவசாய வேலைகளுக்கும்" — 8 காலி, சந்திரன் பலம்.',
  'எரு இடுதல் (கல்யாணராமன் ப.172: புனர்பூசம், பூசம், ஆயில்யம், உத்திரம், அஸ்தம், சித்திரை, சுவாதி, அனுஷம், உத்திராடம், பூரட்டாதி, உத்திரட்டாதி; 4, 9, 14, 30 தவிர; ஞாயிறு, திங்கள், புதன், வியாழன், வெள்ளி) — கணிக்கப்படவில்லை.',
]);
const NOTES_FIELD_ENTRY_TA = Object.freeze([
  'நிலத்தைப் பயிருக்குப் பயன்படுத்தத் தொடங்குதல் — முதன்முறை வயலில் நுழைதல் (ஸ்ரீதர், வில்ஹெல்ம்). ஸ்ரீதர்: புது நிலம், ஏற்கெனவே பயன்பட்ட நிலம் — தனி நட்சத்திரங்கள், கிழமைகள்.',
  'மற்ற நூல்களில் இதற்குத் தனிப் பகுதி இல்லை.',
]);
const NOTES_PLOUGHING_TA = Object.freeze([
  'ஆண்டின் / பருவத்தின் முதல் உழவு. ஹல சக்கரம் — சந்திரனின் நட்சத்திரம் சூரியனின் நட்சத்திரத்திலிருந்து எண்ணி; நூல்கள் வேறுபடுகின்றன (27 அல்லது அபிஜித் உட்பட 28).',
  'எருது பூட்டுதல் (ஸ்ரீதர் §21.2: வளர் 2, 3, 5, 7, 10, 11, 13, தேய் 1, பௌர்ணமி; திங்கள், புதன், வியாழன், வெள்ளி; ரோகிணி, மிருகசீரிடம், மகம், அஸ்தம், சுவாதி, மூலம், உத்திராடம், உத்திரட்டாதி, ரேவதி) — கணிக்கப்படவில்லை.',
  'அகர்வால், வசிஷ்டாவில் உழவுக்குத் தனி விதி இல்லை.',
]);
const NOTES_SOWING_TA = Object.freeze([
  'விதை விதைத்தல் (வயல், தோட்டம்). ராகு (பணி / ஹல) சக்கரம் — சந்திரனின் நட்சத்திரம் ராகுவின் நட்சத்திரத்திலிருந்து; சுக்கிர சக்கரம் — சுக்கிரனின் நட்சத்திரத்திலிருந்து (தானிய வயலுக்கு).',
  'பயிர்வாரி நட்சத்திரம், கிழமை, லக்னம் (வேர், பூ, பழம், நெல், கரும்பு, தென்னை …) — ஒவ்வொரு நூலின் குறிப்பில்; கணிக்கப்படவில்லை.',
]);
const NOTES_TRANSPLANTING_TA = Object.freeze([
  'நாற்றைப் பிடுங்கி வேறு இடத்தில் நடுதல் (நெல் நடவு). மு.சி. 2/32-ன் ஆறு நட்சத்திரங்கள் பல நூல்களிலும்.',
  'நீர் பாய்ச்சுதல் (ஸ்ரீதர்: நடவு நட்சத்திரங்கள், மகம், அஸ்தம், புதன், ஞாயிறு தவிர) — நீர் / கிணறு குடும்பத்தில்.',
]);
const NOTES_TREE_PLANTING_TA = Object.freeze([
  'மரம், கொடி, பழமரக் கன்று நடுதல். விருக்ஷ சக்கரம் — சந்திரனின் நட்சத்திரம் சூரியனின் நட்சத்திரத்திலிருந்து: 4-6, 13-15, 22-27 நல்லவை (ஸ்ரீதர், கல்யாணராமன், ஜோஷி, வில்ஹெல்ம்).',
  'வீட்டிலிருந்து தூரம், திசைவாரி மரங்கள் (ஸ்ரீதர் §21.6) — கணிக்கப்படவில்லை. பொழுதுபோக்குத் தோட்டம், பழத்தோட்டம் — "தோட்டம்" காரியத்தில்.',
]);
const NOTES_GARDEN_TA = Object.freeze([
  'பூந்தோட்டம், பழத்தோட்டம், பூங்கா அமைத்தல் (வில்ஹெல்ம்: பொழுதுபோக்குத் தோட்டம்; காய்கறித் தோட்டம் — "விதைத்தல்"). மு.சி.: குளம், தோட்டம், தெய்வப் பிரதிஷ்டை — ஒரே விதி.',
  'மு.சி. ஸ்லோ.1/47 (ப.37): குரு, சுக்கிரன் அஸ்தங்கம் / பால்ய / விருத்த நிலையில் தோட்டம், குளம், கிணறு கூடாது.',
]);
const NOTES_HARVEST_TA = Object.freeze([
  'பயிர் அறுத்தல் தொடங்குதல். சேர்க்கைகள் (மீன லக்னம் — பரணி, விருச்சிகம் — திருவோணம், கடகம் — விசாகம்; 4-ல் குரு) பல நூல்களில் — கணிக்கப்படவில்லை.',
  'அறுத்த பின் சேகரித்தல், களஞ்சியம் — "தானியம் சேகரித்தல்" காரியத்தில்.',
]);
const NOTES_THRESHING_TA = Object.freeze([
  'போரடித்தல், உமி நீக்குதல், புடைத்தல், இயந்திரத்தால் தானியம் பிரித்தல். ஆறு நூல்களும் மு.சி. 2/32-ன் ஒன்பது நட்சத்திரங்களையே தருகின்றன.',
]);
const NOTES_GRAIN_STORAGE_TA = Object.freeze([
  'அறுவடையான தானியத்தைச் சேகரித்து, களஞ்சியத்தில் / கிடங்கில் வைத்தல் (பழம், பூ, மருந்துச் செடி, சாறுகளும் — கல்யாணராமன், ஜோஷி). ஸ்ரீதர் §21.9 (சேகரித்தல்), §21.10 (சேமித்தல்) — இரண்டு வாசிப்புகள்.',
  'தானியக் கடன், தானியம் செலவிடுதல் / விற்றல் (மு.சி. 2/33, வில்ஹெல்ம், ஸ்ரீதர் §21.13) — கடன், விற்பனைக் குடும்பங்களில்.',
]);
const NOTES_NEW_GRAIN_TA = Object.freeze([
  'புதிதாக விளைந்த தானியத்தை முதலில் உண்ணுதல்; பருவத்தின் முதல் பூ, பழம், கீரை (வில்ஹெல்ம், ஸ்ரீதர்: பூ — மேஷ லக்னம், பழம் — மீனம், இலை — விருச்சிகம்).',
  'மு.சி. ஸ்லோ.1/47: குரு, சுக்கிரன் அஸ்தங்கம் / பால்ய / விருத்த நிலையில் புதுத் தானியம் கூடாது. ஹோமம் செய்த பின்பே அரிசி, யவம் … (ஸ்ரீதர்).',
]);

const NOTES_ASSUMING_OFFICE_TA = Object.freeze([
  'அரசர் / முதல்வர் / அமைச்சர் பதவி ஏற்பு, சத்தியப் பிரமாணம், முடிசூட்டு. மக்களாட்சி அரசு தொடங்குவதும் (ராமன்: கும்ப லக்னம், சனி லக்னத்தில்).',
  'கணிக்கப்படாதவை (நூல்களில் உள்ளன): சூரியன், செவ்வாய், ஜன்ம லக்னாதிபதி, லக்னாதிபதி, தச நாதன், ஜன்ம ராசி நாதன், பத்தாம் அதிபதி பலம்; குரு, சுக்கிரன் உச்ச / ஆட்சி வர்கம்; தச நாதனுக்கு ஷட்வர்கம், அஷ்டகவர்க்கம்; சந்திர, தாரா சுத்தி (பக்கத்தின் நெடுவரிசைகள்); அபசகுனம், பூஜை (ஸ்ரீதர்: முடிசூட்டுக்கு முன் கணபதி, சிவன், சூரியன், மகாலட்சுமி, திக்பாலர், கிரகங்கள்).',
  'பதவி ஏற்பவரின் ஜாதகம் (ஜன்ம ராசி, ஜன்ம லக்னம்) இங்கே கொடுக்கப்பட்ட நபருடையது. கூட்டுச் சத்தியப் பிரமாணத்துக்கு (ஸ்ரீதர் §20.2) முஹூர்த்த பலம் (தோ-கடியா, சார்-கடியா, சிவ ப்ரோக்த) முக்கியம்; 8-ஆம் பாவ தோஷம் குறைவு; 1, 2, 4, 7, 12-ல் பாவர் கூடாது — அமைச்சர்கள் அவரவர் தனி நேரத்தில் இருக்கையில் அமர்வர்.',
  'முடிசூட்டு பதவிக்குப் புதிய அரசு, பதவி ஏற்பவர்; வேலையில் சேர்வது "வேலையில் சேருதல்" காரியத்தில்; அகர்வாலின் "பதவி எடுத்தல்" (மாற்றலில்) சர்வார்த்த சித்தி, சித்த, அம்ருத, ரவி யோகம் அல்லது அபிஜித் முகூர்த்தம் — கணிக்கப்படவில்லை.',
]);
const NOTES_MEET_SUPERIOR_TA = Object.freeze([
  'அரசர், அமைச்சர், உயர் அதிகாரிகள், எஜமானரை முதன்முறை பார்த்தல் / மரியாதை செலுத்துதல்.',
  'ஸ்ரீதர் §20.4 (எஜமானரைப் பார்த்தல்): பிராமண எஜமானர் — ஞாயிறு, க்ஷத்ரியர் — செவ்வாய், வைசியர், சூத்திரர் — சனி — எஜமானரின் வர்ணம் தெரிந்தால் மட்டும்; கணிக்கப்படவில்லை. சந்திரன் சுப நவாம்சம், பத்ர கரணம் கூடாது, இடது நாசி சுவாசம் ("சுவர சாஸ்திரம்") — குறிப்புகளில்.',
]);
const NOTES_JOIN_SERVICE_TA = Object.freeze([
  'அரசுப் பணி, நிறுவனப் பணி, எஜமானரிடம் பணி தொடங்குதல் (கையெழுத்து இடும் நேரம் — ஸ்ரீதர்: "சேர்வு அறிக்கையில் கையெழுத்து" முஹூர்த்தமாக).',
  'உயர் அரசுப் பதவிக்கு "பதவி ஏற்பு" விதிகளையும் பார்க்க (ஸ்ரீதர்). அபிஜித் முஹூர்த்தத்தில் வலிமையான சூரியன் 10-ல் — நிர்வாக அதிகாரம் (ஸ்ரீதர்); பக்கத்தில் அபிஜித் கணிக்கப்படுகிறது.',
  'வேலைக்காரரை வைத்தல் — தனிக் காரியம் ("வேலைக்காரரை வைத்தல்"): கல்யாணராமன், ஜோஷி, மு.சி. இரண்டுக்கும் ஒரே பகுதி.',
]);
const NOTES_JOB_APPLICATION_TA = Object.freeze([
  'வேலை, கட்சிச் சீட்டு, நிர்வாகக் குழு அனுமதிக்கு விண்ணப்பித்தல் (கல்யாணராமன்); வேலை முதலியவற்றுக்கு விண்ணப்பம் (ரங்காச்சார்யா); முதலாளிக்கு விண்ணப்பம் (ஸ்ரீதர்).',
  'ஸ்ரீதர் §20.7: வேலை தேடும்போது — தம் ஜன்ம நட்சத்திரத்திலிருந்து 28 நட்சத்திரங்களில் (அபிஜித் உட்பட) 1-7 (தலை), 15-21 (வயிறு) நல்லவை; 8-14 (முதுகு), 22-28 (பாதம்) நல்லவையல்ல — கணிக்கப்படுகிறது.',
  'லக்னாதிபதி 10-ஆம் அதிபதியைவிட வலிமை (ஸ்ரீதர்), எஜமானரின் "தாஸ சக்கரம்" — எஜமானரின் நட்சத்திரம் தேவை; கணிக்கப்படவில்லை.',
]);
const NOTES_EMPLOY_SERVANT_TA = Object.freeze([
  'வேலைக்காரர், பணியாளரை அமர்த்தும்போது (எஜமானர்). வேலையாளர் தாம் பணி தொடங்குவது — "வேலையில் சேருதல்".',
  'கல்யாணராமன், ஜோஷி, மு.சி. — "வேலையில் சேருதல்" பகுதியே வேலைக்காரரை வைப்பதற்கும் (தலைப்பிலும், உரையிலும்); வில்ஹெல்ம் ஒரே பகுதி இரண்டுக்கும்.',
  'ஸ்ரீதர் §20.7: எஜமானரின் ஜன்ம நட்சத்திரத்திலிருந்து 28-ல் (அபிஜித் உட்பட) 1-7, 15-21 — பக்கத்தில் கணிக்கப்படுகிறது; தாஸ, தாசி சக்கரங்கள் வேலையாளின் நட்சத்திரத்தையும் வேண்டுவதால் கணிக்கப்படவில்லை.',
]);
const NOTES_FILE_SUIT_TA = Object.freeze([
  'வழக்குத் தாக்கல், போர் / தாக்குதல் தொடக்கம். அகுல நட்சத்திரம், திதி, கிழமையில் தொடங்கினால் வாதிக்கு (தாக்குபவருக்கு) வெற்றி; குல — பிரதிவாதிக்கு; குலாகுல — சமரசம்.',
  'ஸ்ரீதர், ஜோஷி, கல்யாணராமன், வில்ஹெல்ம்: "அகுல / குல / குலாகுல" அட்டவணை (விஜய யாத்திரைக்கும் அதே). வசிஷ்டா, ராமன், அகர்வால், ரங்காச்சார்யா: வழக்குக்கான தனிப் பட்டியல்.',
  'குற்ற வழக்கு (எதிரியைத் தண்டித்தல் — வசிஷ்டா "ஷத்ரு தண்ட", ஜோஷி "எதிரிகளைத் தண்டித்தல்"), குற்றவாளி விசாரணை (கல்யாணராமன்) — தனிக் காரியங்கள் (இன்னும் இல்லை). சமரசம் — தனிக் காரியம்.',
  'ஜோஷி: முஹூர்த்த லக்னத்தில் வாதிக்கு வெற்றிச் சேர்க்கைகள் (எட்டு) — கணிக்கப்படவில்லை; "ஜீவ பக்ஷம், ம்ருத பக்ஷம்"; சந்திர, தாரா சுத்தி.',
]);
const NOTES_COMPROMISE_TA = Object.freeze([
  'வழக்கு / போரில் சமரசம், ஒப்பந்தத்தில் கையெழுத்து, சமாதான உடன்படிக்கை. வில்ஹெல்ம் "வழக்கு"க்கு — "சமரசத்துக்கு சமாதானப் பகுதியைப் பார்க்க".',
  'கையெழுத்திடுவோரின் ஜாதகங்கள் இணக்கமாக இருக்க வேண்டும் (ராமன்); சமாதானம் நீடிக்கும் சேர்க்கைகள் (வில்ஹெல்ம் ஐந்து, ராமன் ஐந்து) — குறிப்புகளில், கணிக்கப்படவில்லை.',
]);

const NOTES_LEND_MONEY_TA = Object.freeze([
  'பணம் / பொருளைக் கடனாகக் கொடுத்தல், வட்டிக்கு விடுதல், அடகு வாங்குதல். புதன்கிழமை கடன் கொடுக்கக் கூடாது என்பதில் ஸ்ரீதர், மு.சி., கல்யாணராமன், ஜோஷி, ரங்காச்சார்யா, வசிஷ்டா ஆறு நூல்களும் ஒன்றுபடுகின்றன.',
  'மு.சி. 2/24: தீக்ஷ்ண (ஆயில்யம், கேட்டை, மூலம், திருவாதிரை), மிஶ்ர (கார்த்திகை, விசாகம்), த்ருவ (ரோகிணி, 3 உத்திரங்கள்), உக்ர (பரணி, மகம், 3 பூரங்கள்) — இந்தப் பதினைந்து நட்சத்திரங்களில், பத்ரை கரணத்தில், வ்யதீபாத யோகத்தில் கொடுத்த கடன் திரும்பி வராது. மீதி பன்னிரண்டே கடன் கொடுக்க உரியவை (கல்யாணராமன், அகர்வால்).',
  'தங்கம் / பணத்தைக் கையளிப்பவர் கார்த்திகை, மகம், மூலம், சதயம், உத்திரம், புனர்பூசம், தன் ஜன்ம நட்சத்திரத்தில் கொடுத்தால் வறுமை அடைவார்; பெறுபவர் செழிப்பார் (ஸ்ரீதர் K.P., வில்ஹெல்ம், ராமன்) — ஜன்ம நட்சத்திரம் பக்கத்தில் தனியே குறிக்கப்படுகிறது.',
  'வசூல் / திருப்பிச் செலுத்துதல் / வைப்பு — தனிக் காரியங்கள். தனஷ்டா பஞ்சகம், த்விபுஷ்கர / த்ரிபுஷ்கர யோகம், அம்ருத சித்தி யோகம் (ஞாயிறு + அஸ்தம்) — கணிக்கப்படவில்லை.',
]);
const NOTES_BORROW_MONEY_TA = Object.freeze([
  'பணம் கடனாக வாங்குதல், வங்கிக் கடன். செவ்வாய்க்கிழமை கடன் வாங்கக் கூடாது (ஸ்ரீதர், மு.சி., கல்யாணராமன், ஜோஷி, ரங்காச்சார்யா, வசிஷ்டா); சங்கராந்தி, வ்ருத்தி யோகம், அஸ்தம், ஞாயிறு — இவற்றில் வாங்கிய கடன் தலைமுறைகளாகத் தொடரும் என்கிறது மு.சி.',
  'அம்ருத சித்தி யோகம் (ஞாயிறு + அஸ்தம்) — கணிக்கப்படவில்லை; அஸ்தம், ஞாயிறு தனித்தனியே குறிக்கப்படுகின்றன.',
  'கடன் கொடுத்தல், திருப்பிச் செலுத்துதல் — தனிக் காரியங்கள்.',
]);
const NOTES_REPAY_DEBT_TA = Object.freeze([
  'கடனை அடைத்தல். முதல் தவணையே முக்கியம் (வில்ஹெல்ம்); பின் தவணைகளுக்கு முகூர்த்தம் தேவையில்லை.',
  'ஸ்ரீதர், ஜோஷி, ரங்காச்சார்யா: "கடன் வாங்கத் தள்ளப்பட்டவை திருப்பிச் செலுத்த நல்லவை" — செவ்வாய், ஞாயிறு, அஸ்தம், சங்கராந்தி, வ்ருத்தி யோகம். சங்கராந்தியும் வ்ருத்தி யோகமும் "நல்லவை" என்று இங்கே கணிக்கப்படவில்லை (தள்ளவும் இல்லை).',
  'வில்ஹெல்மின் சேர்க்கைகள் — மைத்ர முகூர்த்தம் (லக்னத்தில் சந்திரன் அசுவினி / அனுஷத்தில்), குளிகன் லக்னத்தில் செவ்வாய் / சனி / ஞாயிறு + 9 / 14 / 4 திதி, சர லக்னம் + சனிக்கிழமை + ப்ரதோஷம் — கணிக்கப்படவில்லை.',
]);
const NOTES_COLLECT_MONEY_TA = Object.freeze([
  'கொடுத்த கடனை / பாக்கியை வசூலித்தல், பணம் சேர்த்தல். புதன்கிழமை வசூலுக்கு நல்லது என்பதில் மு.சி., ரங்காச்சார்யா, ஸ்ரீதர் ஒன்றுபடுகின்றன.',
  'நாரதர் (ஸ்ரீதர் வழி): ரிக்தா, அமாவாசை; செவ்வாய், சனி; 3 பூரங்கள், பரணி, மகம், விசாகம், கார்த்திகை, மூலம், கேட்டை, திருவாதிரை, ஆயில்யம் — இவற்றில் வைத்த / கொடுத்த / தொலைந்த பணம் திரும்பக் கிடைப்பது கடினம். ஸ்ரீதரின் முதன்மைப் பட்டியலோடு முரண்படும் இடங்கள் நடுத்தரமாகக் குறிக்கப்படுகின்றன.',
  'ராமனின் விதி ஜாதகத்தைச் சார்ந்தது: முகூர்த்த லக்னம் ஜன்ம லக்னத்திலிருந்து 8 / 9-ஆம் ராசியாக இருக்கக் கூடாது (ஜன்ம ராசியிலிருந்தும் இங்கே பார்க்கப்படுகிறது).',
]);
const NOTES_DEPOSIT_WEALTH_TA = Object.freeze([
  'பணம், தங்கம், நகை, தானியம் சேமித்து வைத்தல்; வங்கியில் வைப்புத் தொகை; முதலீடு (வில்ஹெல்ம்: அசையா சொத்து, பங்கு உட்பட); புதையல் / ரகசியமாக வைத்தல் (ஸ்ரீதர் §25.2.4).',
  'புதன்கிழமை வைப்புக்கு நல்லது (கல்யாணராமன், ஜோஷி, ரங்காச்சார்யா) — கடன் கொடுக்கத் தள்ளப்பட்ட அதே கிழமை.',
  'வில்ஹெல்மின் சேர்க்கைகள் (லக்னத்தில் குரு, 2-இல் சுக்கிரன், 11-இல் புதன், 10-இல் சந்திரன்; லக்னத்தில் சனி — தங்கம், தானியம், ரத்தினம்; வர்கோத்தம குரு + கேந்திரத்தில் புதன், சுக்கிரன் — தங்கம்; உலோகம், நறுமணப் பொருள், நூலகம், வெள்ளிப் பாத்திரம் என்று பொருள்வாரியான விதிகள்) — கணிக்கப்படவில்லை.',
]);
const NOTES_MAKE_WILL_TA = Object.freeze([
  'உயில் (மரண சாசனம்) எழுதுதல், கையெழுத்திடுதல். இரண்டு நூல்களே இதைத் தருகின்றன.',
  'ஸ்ரீதர்: உயில் பெறுபவரின் ஜன்ம ராசியிலிருந்து 3, 6, 10, 11-ஆம் ராசி லக்னமாக இருக்க வேண்டும் — பெறுபவரின் ஜாதகம் இங்கே இல்லை, கணிக்கப்படவில்லை.',
  'ராமன்: சந்திரனும் லக்னமும் லக்னாதிபதியும் ஸ்திர ராசியில்; உயில் பெறுபவருக்கு நன்மை வேண்டுமானால் குரு / சுக்கிரனின் ராசி உதயமாக வேண்டும்; 8-ஆம் வீடு வலுவாக இல்லாவிட்டால் எழுதியவர் இறப்பார் — 8-ஆம் வீட்டு வலு கணிக்கப்படவில்லை.',
]);
const NOTES_PURCHASE_GOODS_TA = Object.freeze([
  'கடைக்கு / வியாபாரத்துக்குப் பொருள் வாங்குதல், சரக்கு கொள்முதல். "விற்கும் நட்சத்திரத்தில் வாங்கக் கூடாது, வாங்கும் நட்சத்திரத்தில் விற்கக் கூடாது" (மு.சி. 2/16, ஸ்ரீதர், ரங்காச்சார்யா, வில்ஹெல்ம், அகர்வால்).',
  'வாங்கும் ஆறு நட்சத்திரங்கள் — ரேவதி, சதயம், அசுவினி, சுவாதி, திருவோணம், சித்திரை — ஐந்து நூல்களில் ஒரே மாதிரி.',
  'வீடு, நிலம், மாடு, குதிரை, யானை, நகை வாங்குதல் — தனிக் காரியங்கள் (இன்னும் இல்லை). கடை திறத்தல் ஏற்கெனவே "வியாபாரம் தொடங்குதல்" காரியத்தில் உள்ளது.',
]);
const NOTES_SALE_GOODS_TA = Object.freeze([
  'சரக்கு / பொருள் விற்றல். விற்கும் ஏழு நட்சத்திரங்கள் — 3 பூரங்கள், விசாகம், கார்த்திகை, ஆயில்யம், பரணி — ஆறு நூல்களில் ஒரே மாதிரி (வில்ஹெல்ம் உத்திரட்டாதிக்குப் பதிலாகப் பூரட்டாதி என ஏழு).',
  'கும்ப லக்னம் விற்பதற்குக் கூடாது (மு.சி., ஸ்ரீதர், ஜோஷி, ரங்காச்சார்யா, அகர்வால், வில்ஹெல்ம்).',
  'வாங்குதல் — தனிக் காரியம்; ஒரே நட்சத்திரத்தில் வாங்கியதை விற்கக் கூடாது.',
]);
const NOTES_SPECULATION_TA = Object.freeze([
  'ஊக வணிகம் — ஒரே நூலே (கல்யாணராமன்) இதைத் தனியே தருகிறது.',
  'அவர் தரும் நட்சத்திரங்கள் விற்பதற்கான உக்ர / மிஶ்ர வகையைச் சார்ந்தவை; கடன் கொடுக்கத் தள்ளப்பட்டவையும் இவற்றுள் உண்டு.',
  'லாட்டரி / சூதாட்டம் — தனிக் காரியம்.',
]);
const NOTES_LOTTERY_TA = Object.freeze([
  'லாட்டரி, போட்டிகள், பந்தயம், சூதாட்டம். ராமன்: "இதில் வெற்றி பெரும்பாலும் ஜாதகத்தின் தன ஸ்தான வலுவையும் நடக்கும் தசை-புக்தியையும் சார்ந்தது; முகூர்த்தத்தின் மீது அதிகம் நம்ப முடியாது."',
  'ராமனும் அகர்வாலும் ஒரே விதிகளையே தருகின்றனர் (நட்சத்திரம், திதி, கிழமை, லக்னம்); கல்யாணராமன் பந்தயம் / சூதாட்டத்துக்கு மிருகசீரிடம், ரேவதி மட்டும்.',
  'கணிக்கப்படவில்லை: 11-ஆம் அதிபதி 12-இல் இருக்கக் கூடாது; சனி 2-ஆம் வீட்டையோ 2-ஆம் அதிபதியையோ பார்க்கக் கூடாது; சந்திரனும் 5, 9-ஆம் வீடுகளும் வலுவாக இருக்க வேண்டும்.',
]);
const NOTES_ACCOUNTS_TA = Object.freeze([
  'கணக்குப் புத்தகம் தொடங்குதல், கணக்கு எழுதுதல், வணிகக் கடிதப் போக்குவரத்து.',
  'இரண்டு நூல்களே இதைத் தருகின்றன; இரண்டிலும் கிழமை ஒன்றே (ஞாயிறு, திங்கள், புதன், வியாழன், வெள்ளி) — செவ்வாயும் சனியும் தள்ளு.',
]);

const NOTES_BUY_LAND_TA = Object.freeze([
  'கட்டிடத்துக்கான நிலம் / மனை வாங்குதல், விற்றல். இரு மரபுகள்: ஸ்ரீதர், ஜோஷி, வசிஷ்டா, ரங்காச்சார்யா — M.G. / J.V.யின் பன்னிரண்டு நட்சத்திரம், நந்தா / பூர்ணா திதி, வியாழன் - வெள்ளி; வில்ஹெல்ம், ராமன், அகர்வால் — பதினான்கு நட்சத்திரம், ரிக்தா தவிர்த்து, திங்கள் - புதன் - சனி.',
  'இரு மரபுகளின் நட்சத்திரப் பட்டியல்கள் கிட்டத்தட்ட முற்றிலும் வேறு; இரண்டையும் தனித்தனியே கணிக்கிறோம், ஒன்றையொன்று கலக்கவில்லை.',
  'கிழமை அதிபதி லக்னத்தில் இருப்பது சிறப்பு (ராமன், அகர்வால், வில்ஹெல்ம்) — குறிக்கப்படுகிறது. நிலம் நல்லதா என்பதை அளவு + பெயர் எழுத்துகளால் பார்க்கும் B.D.R.யின் கணக்கு (ஸ்ரீதர் §27.17.2) — கணிக்கப்படவில்லை.',
  'விவசாய நிலம், வீடு வாங்குதல், நிலத்தை ஆட்கொள்ளுதல், சொத்துப் பிரிவினை — தனிக் காரியங்கள்.',
]);
const NOTES_BUY_FARMLAND_TA = Object.freeze([
  'விவசாயத்துக்கு நிலம் வாங்குதல். ராமனும் அகர்வாலும் கட்டிட நிலத்திலிருந்து இதைத் தனியே பிரிக்கின்றனர் — கிழமை வேறு (திங்கள், புதன், சனி; வியாழன் இல்லை).',
  'ஸ்ரீதர் §21.17 (விவசாய அத்தியாயத்தில்) தரும் பட்டியல் அவரது §27.17.1 (வீட்டு அத்தியாயம்) பட்டியலே — அவர் இரண்டையும் பிரிக்கவில்லை.',
  'நிலத்தை ஆட்கொள்ளுதல் (ஒரு பிடி மண்) — தனிக் காரியம்.',
]);
const NOTES_BUY_HOUSE_TA = Object.freeze([
  'புதிய அல்லது பழைய வீடு வாங்குதல். மூன்று நூல்களும் வியாழன், வெள்ளி மற்றும் நந்தா திதிகளைச் சொல்கின்றன.',
  'ராமனும் அகர்வாலும் ஒரே நட்சத்திரப் பட்டியலையே தருகின்றனர் (அகர்வால் புனர்பூசத்துக்குப் பதிலாக பரணி, அசுவினியையும் சேர்க்கிறார்); லக்னம் ரிஷபம், மிதுனம், சிம்மம், துலாம், விருச்சிகம்; 7-இல் பாபன் கூடாது; செவ்வாய் லக்னத்தில் கூடாது.',
  'புது வீட்டில் நுழைதல் (கிரகப்பிரவேசம்) மற்றும் பழைய வீட்டில் நுழைதல் — ஏற்கெனவே தனிக் காரியங்கள்.',
]);
const NOTES_LAND_POSSESSION_TA = Object.freeze([
  'வாங்கிய / உரிமையுள்ள நிலத்தை ஆட்கொள்ளுதல்; தகராறில் உள்ள நிலத்தை உரிமை கொள்ளுதல். மூன்று நூல்களும் ஒரே விதியைத் தருகின்றன: கடக லக்னத்தில், சந்திரன் பரணி / திருவாதிரை / விசாகம் (ஸ்ரீதர், வில்ஹெல்ம்: அஸ்தமும்) நட்சத்திரத்தின் நான்காம் பாதத்தில் இருக்கும்போது அந்த நிலத்திலிருந்து ஒரு பிடி மண்ணை எடுத்துச் செல்ல வேண்டும்.',
  'லக்னத்திலோ நவாம்சத்திலோ சூரியனும் கேதுவும் இருந்தால் நிலம் நிரந்தரமாகத் தங்கும் (ஸ்ரீதர் K.P., வில்ஹெல்ம், ராமன்) — லக்னம் மட்டும் கணிக்கப்படுகிறது, நவாம்சம் இல்லை.',
  'ஸ்ரீதரின் K.P. பதினான்கு நட்சத்திரங்கள் ஆட்கொள்ளுதலுக்குப் பொதுவானவை; ஒரு பிடி மண் விதி அவற்றுக்கு வெளியே தனி வழி.',
]);
const NOTES_DIVIDE_PROPERTY_TA = Object.freeze([
  'உடன்பிறந்தோருக்கிடையே சொத்தைப் பிரித்தல். நான்கு நூல்களும் கிட்டத்தட்ட ஒரே விதிகளைத் தருகின்றன: பதினைந்து நட்சத்திரம் (லகு, ஸ்திர, சர + மிருகசீரிடம், சித்திரை, ரேவதி), திதி 2, 3, 5, 7, 10, 11, 13, கிழமை ஞாயிறு - திங்கள் - புதன் - வியாழன் - வெள்ளி.',
  'சுப கிரகத்தின் ராசி லக்னம், லக்ன சுத்தி (கல்யாணராமன், ஜோஷி, ஸ்ரீதர்); ஸ்ரீதர் கேந்திரத்தில் சுபர்களையும் கேட்கிறார்.',
  'திருமணத்தின்போதோ தந்தை பிரித்துக் கொடுக்கும்போதோ தனி முகூர்த்தம் தேவையில்லை என்று சிலர்; சிலர் தேவை என்கின்றனர் (ஸ்ரீதர் §27-இன் குறிப்பு) — கணிக்கப்படவில்லை.',
]);

const NOTES_CONSTRUCTION_START_TA = Object.freeze([
  'வீடு / கட்டிடம் கட்டத் தொடங்குதல் — பூமி பூஜை, தோண்டுதல், அடிக்கல் மூன்றுக்கும் தனித்தனி முகூர்த்தம் வேண்டும் என்கிறார் ஸ்ரீதர்; வில்ஹெல்மும் ராமனும் "அடிக்கல் நாட்டுதலே தொடக்கம்" என்று ஒன்றாகவே கொள்கின்றனர் (அவர்களின் வாசிப்பு இரு காரியங்களிலும் உள்ளது).',
  'பதின்மூன்று நட்சத்திரங்கள் (த்ருவ 4, மது 4, சதயம், சுவாதி, தனிஷ்டா, அஸ்தம், பூசம்) — பராசரர், கர்க்கர், வாஸ்துப்ரதீபம், மு.சி., கல்யாணராமன், ஜோஷி ஆறிடத்திலும் ஒரே பட்டியல்.',
  'வாஸ்து சக்கரம்: சூரியனின் நட்சத்திரத்திலிருந்து 8 முதல் 18 வரை நல்லது (வாஸ்துசாரம், கல்யாணராமன், ஜோஷி) — கணிக்கப்படுகிறது.',
  'கணிக்கப்படவில்லை: வாஸ்து புருஷனின் படுக்கை / திசை, ராகு முகம், ஆயா-வ்யயா, க்ருஹ நாடி, வீட்டின் அளவு, கதவின் திசைக்கேற்ற மாதம் / திதி / நட்சத்திரம், சப்தசலாக வேதை, வீட்டின் ஆயுளைச் சொல்லும் கிரக சேர்க்கைகள், உரிமையாளரின் ஜன்ம ராசியிலிருந்து சூரியன் / சந்திரன் / குரு / சுக்கிரன் கோசாரம்.',
]);
const NOTES_DIGGING_TA = Object.freeze([
  'வீட்டுக்கு அடித்தளம் தோண்டத் தொடங்குதல் — அடிக்கல் நாட்டுதலிலிருந்து வேறானது (ஸ்ரீதர், கல்யாணராமன், ஜோஷி மூவரும் இதைத் தெளிவாகப் பிரிக்கின்றனர்).',
  'கீழ்நோக்கு (அதோமுக) நட்சத்திரங்கள் — மூலம், ஆயில்யம், விசாகம், கார்த்திகை, மகம், 3 பூரங்கள், பரணி — தோண்டுவதற்கு உரியவை; கட்டுமானத்துக்கு உரிய பதின்மூன்றும் சேரும். சர லக்னம்.',
  'பூமி சயனம் (பூமி உறங்கும் நாள்): சந்திரனின் நட்சத்திரம் சூரியனிலிருந்து 5, 7, 9, 12, 19, 26-ஆவது என்றால் தோண்டக் கூடாது — நான்கு நூல்களும் ஒப்புக்கொள்கின்றன, கணிக்கப்படுகிறது. சங்கராந்தியிலிருந்து 5, 7, 9, 10, 21, 24-ஆம் சூரிய நாட்களும் பூமி சயனம் — கணிக்கப்படவில்லை.',
  'ராகு முகம் (எந்தத் திசையிலிருந்து தோண்டத் தொடங்குவது), தேர்ந்த நட்சத்திரத்தில் செவ்வாய் / சனி இருக்கக் கூடாது, தோண்டும்போது தென்படும் சகுனங்கள் — கணிக்கப்படவில்லை.',
]);
const NOTES_FOUNDATION_TA = Object.freeze([
  'அடிக்கல் / முதல் கல் நாட்டுதல். ஈசான்யம் (வடகிழக்கு) அல்லது ஆக்னேயம் (தென்கிழக்கு) மூலையில் — பெரும்பாலான நூல்கள் ஆக்னேயத்தை முதலில் சொல்கின்றன.',
  'ஸ்ரீதர், வசிஷ்டா இருவரும் ஒரே பட்டியலைத் தருகின்றனர் (அசுவினி, ரோகிணி, மிருகசீரிடம், பூசம், 3 உத்திரங்கள், அஸ்தம், திருவோணம், ரேவதி; தேய்பிறைப் பிரதமை + வளர்பிறை திதிகள்; திங்கள், புதன், வியாழன், வெள்ளி, சனி). கர்க்கரின்படி ஸ்திர நட்சத்திரங்களே சிறந்தவை (கல்யாணராமன், ஜோஷி).',
  'வில்ஹெல்மும் ராமனும் அடிக்கலையே கட்டுமானத் தொடக்கமாகக் கொள்வதால் அவர்களின் வாசிப்பு இரு காரியங்களிலும் ஒன்றே.',
  'கணிக்கப்படவில்லை: வாஸ்து புருஷனின் தொப்புள் இடம் (28 பகுதிகளில் 18-ஆவது), K.P.யின் 16 பகுதி வரைபடம், பிரம்மா / வாஸ்து புருஷ பூஜை, சித்த / அமிர்த யோகம், சூரியன் விட்டகன்ற ராசி லக்னமாக வருதல்.',
]);

const EVENTS = deepFreeze({
  order: ['GRIHA_PRAVESHA', 'OLD_HOUSE', 'UPANAYANA', 'TRAVEL', 'VIDYARAMBHA', 'EDUCATION', 'BUSINESS', 'MEDICINE', 'SURGERY', 'ROGA_SNANA', 'VEHICLE', 'VEHICLE_MAKE', 'NEW_CLOTHES', 'NEW_ORNAMENTS', 'ORNAMENT_MAKING', 'CLOTHES_WASHING', 'STITCHING', 'AGRI_GENERAL', 'FIELD_ENTRY', 'PLOUGHING', 'SOWING', 'TRANSPLANTING', 'TREE_PLANTING', 'GARDEN', 'HARVEST', 'THRESHING', 'GRAIN_STORAGE', 'NEW_GRAIN', 'ASSUMING_OFFICE', 'MEET_SUPERIOR', 'JOIN_SERVICE', 'JOB_APPLICATION', 'EMPLOY_SERVANT', 'FILE_SUIT', 'COMPROMISE', 'LEND_MONEY', 'BORROW_MONEY', 'REPAY_DEBT', 'COLLECT_MONEY', 'DEPOSIT_WEALTH', 'MAKE_WILL', 'PURCHASE_GOODS', 'SALE_GOODS', 'SPECULATION', 'LOTTERY', 'ACCOUNTS', 'BUY_LAND', 'BUY_FARMLAND', 'BUY_HOUSE', 'LAND_POSSESSION', 'DIVIDE_PROPERTY', 'CONSTRUCTION_START', 'DIGGING', 'FOUNDATION'],
  GRIHA_PRAVESHA, OLD_HOUSE, UPANAYANA, TRAVEL, VIDYARAMBHA, EDUCATION, BUSINESS, MEDICINE, SURGERY, ROGA_SNANA, VEHICLE, VEHICLE_MAKE, NEW_CLOTHES, NEW_ORNAMENTS, ORNAMENT_MAKING, CLOTHES_WASHING, STITCHING, AGRI_GENERAL, FIELD_ENTRY, PLOUGHING, SOWING, TRANSPLANTING, TREE_PLANTING, GARDEN, HARVEST, THRESHING, GRAIN_STORAGE, NEW_GRAIN, ASSUMING_OFFICE, MEET_SUPERIOR, JOIN_SERVICE, JOB_APPLICATION, EMPLOY_SERVANT, FILE_SUIT, COMPROMISE, LEND_MONEY, BORROW_MONEY, REPAY_DEBT, COLLECT_MONEY, DEPOSIT_WEALTH, MAKE_WILL, PURCHASE_GOODS, SALE_GOODS, SPECULATION, LOTTERY, ACCOUNTS, BUY_LAND, BUY_FARMLAND, BUY_HOUSE, LAND_POSSESSION, DIVIDE_PROPERTY, CONSTRUCTION_START, DIGGING, FOUNDATION,
});

module.exports = {
  EVENTS, DOORS, MONTH_TA, RANK, SOURCES, CODE_TA, CHAKRA_TA,
  NOTES_TA: deepFreeze({
    ...NOTES_TA, UPANAYANA: NOTES_UPANAYANA_TA, TRAVEL: NOTES_TRAVEL_TA, VIDYARAMBHA: NOTES_VIDYARAMBHA_TA, EDUCATION: NOTES_EDUCATION_TA, BUSINESS: NOTES_BUSINESS_TA,
    MEDICINE: NOTES_MEDICINE_TA, SURGERY: NOTES_SURGERY_TA, OLD_HOUSE: NOTES_OLD_HOUSE_TA, ROGA_SNANA: NOTES_ROGA_SNANA_TA,
    VEHICLE: NOTES_VEHICLE_TA,
    VEHICLE_MAKE: NOTES_VEHICLE_MAKE_TA,
    NEW_CLOTHES: NOTES_NEW_CLOTHES_TA,
    NEW_ORNAMENTS: NOTES_NEW_ORNAMENTS_TA,
    ORNAMENT_MAKING: NOTES_ORNAMENT_MAKING_TA,
    CLOTHES_WASHING: NOTES_CLOTHES_WASHING_TA,
    STITCHING: NOTES_STITCHING_TA,
    AGRI_GENERAL: NOTES_AGRI_GENERAL_TA,
    FIELD_ENTRY: NOTES_FIELD_ENTRY_TA,
    PLOUGHING: NOTES_PLOUGHING_TA,
    SOWING: NOTES_SOWING_TA,
    TRANSPLANTING: NOTES_TRANSPLANTING_TA,
    TREE_PLANTING: NOTES_TREE_PLANTING_TA,
    GARDEN: NOTES_GARDEN_TA,
    HARVEST: NOTES_HARVEST_TA,
    THRESHING: NOTES_THRESHING_TA,
    GRAIN_STORAGE: NOTES_GRAIN_STORAGE_TA,
    NEW_GRAIN: NOTES_NEW_GRAIN_TA,
    ASSUMING_OFFICE: NOTES_ASSUMING_OFFICE_TA,
    MEET_SUPERIOR: NOTES_MEET_SUPERIOR_TA,
    JOIN_SERVICE: NOTES_JOIN_SERVICE_TA,
    JOB_APPLICATION: NOTES_JOB_APPLICATION_TA,
    EMPLOY_SERVANT: NOTES_EMPLOY_SERVANT_TA,
    FILE_SUIT: NOTES_FILE_SUIT_TA,
    COMPROMISE: NOTES_COMPROMISE_TA,
    LEND_MONEY: NOTES_LEND_MONEY_TA,
    BORROW_MONEY: NOTES_BORROW_MONEY_TA,
    REPAY_DEBT: NOTES_REPAY_DEBT_TA,
    COLLECT_MONEY: NOTES_COLLECT_MONEY_TA,
    DEPOSIT_WEALTH: NOTES_DEPOSIT_WEALTH_TA,
    MAKE_WILL: NOTES_MAKE_WILL_TA,
    PURCHASE_GOODS: NOTES_PURCHASE_GOODS_TA,
    SALE_GOODS: NOTES_SALE_GOODS_TA,
    SPECULATION: NOTES_SPECULATION_TA,
    LOTTERY: NOTES_LOTTERY_TA,
    ACCOUNTS: NOTES_ACCOUNTS_TA,
    BUY_LAND: NOTES_BUY_LAND_TA,
    BUY_FARMLAND: NOTES_BUY_FARMLAND_TA,
    BUY_HOUSE: NOTES_BUY_HOUSE_TA,
    LAND_POSSESSION: NOTES_LAND_POSSESSION_TA,
    DIVIDE_PROPERTY: NOTES_DIVIDE_PROPERTY_TA,
    CONSTRUCTION_START: NOTES_CONSTRUCTION_START_TA,
    DIGGING: NOTES_DIGGING_TA,
    FOUNDATION: NOTES_FOUNDATION_TA,
  }),
  AKSHARA_10, AKSHARA_LAGNAS, EDUCATION_16, MATRIKA_GOOD, SHOP_STARS, MEDICINE_13, SHARP_STARS, OLD_HOUSE_STARS, OLD_HOUSE_MONTHS, BATH_MC_18, BATH_KR_18, BATH_13,
  DHRUVA, MRIDU, bothPakshas, UPANAYANA_YEARS, SIXTEEN, ANADHYAYA, ANADHYAYA_MONTH, GALAGRAHA, YOGAS_SHRIDHAR, BENEFIC_PLANET_NAVS,
  DIRECTIONS, TITHI_DIR8, YOGINI_KP, GHATA, KAAL_SHOOLA, LALATIKA, TARA_1357,
};
