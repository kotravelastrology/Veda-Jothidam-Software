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
  order: ['SHRIDHAR', 'MUHURTA_CHINTAMANI', 'WILHELM', 'JOSHI', 'KALYANRAMAN', 'RAMAN', 'RANGACHARYA', 'VASHISTHA'],
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
  order: ['WILHELM', 'SHRIDHAR', 'KALYANRAMAN', 'JOSHI', 'VASHISTHA', 'MUHURTA_CHINTAMANI', 'RANGACHARYA'],
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
  order: ['VASHISTHA', 'KALYANRAMAN', 'WILHELM', 'JOSHI', 'SHRIDHAR', 'MUHURTA_CHINTAMANI', 'RANGACHARYA'],
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
  order: ['WILHELM', 'RAMAN', 'SHRIDHAR', 'MUHURTA_CHINTAMANI', 'KALYANRAMAN', 'JOSHI', 'VASHISTHA', 'RANGACHARYA'],
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
});

/**
 * Surgery's rules beyond the other events': marsSaturn ('INFLUENCE': Saturn with Mars or aspecting it;
 * 'MUTUAL': each aspecting the other), want [{ planets, houses, all, code }] (places a book asks for — marked).
 */
const SURGERY = deepFreeze({
  labelTa: 'அறுவை சிகிச்சை',
  default: 'WILHELM',
  order: ['WILHELM', 'RAMAN', 'SHRIDHAR', 'VASHISTHA', 'KALYANRAMAN', 'RANGACHARYA'],
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
  order: ['SHRIDHAR', 'JOSHI', 'WILHELM', 'MUHURTA_CHINTAMANI', 'AGARWAL'],
  SHRIDHAR: oldHouseOf(GRIHA_PRAVESHA.SHRIDHAR, 'ஸ்ரீதர் §27.16 (b)'),
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
  order: ['WILHELM', 'SHRIDHAR', 'VASHISTHA', 'KALYANRAMAN_BUY', 'KALYANRAMAN'],
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
});
const VEHICLE_MAKE = deepFreeze({
  labelTa: 'வாகனம் — தயாரித்தல், வாகன வியாபாரம்',
  default: 'KALYANRAMAN',
  order: ['KALYANRAMAN', 'SHRIDHAR', 'WILHELM'],
  KALYANRAMAN: {
    labelTa: 'கல்யாணராமன் (தொ.2)', booksTa: 'கல்யாணராமன்',
    nak: { good: CHARIOT_STARS, mid: [] }, abhijitOk: true, digdwar: false,
    tithi: [...bothPakshas([1, 6, 11, 3, 8, 13, 5, 10]), 15, 30], vara: { good: [0], mid: [] },
    lagna: { good: [1, 2, 5, 6, 8, 11], mid: [0, 3, 4, 7, 9, 10] },
    noteTa: 'கிழமை அச்சில் ஞாயிறு மட்டும் · லக்னம் 2, 3, 6, 7, 9, 12 "விருப்பம்" (மற்றவை நடுத்தரம்) · பூர்ண திதியில் அமாவாசையும் (அச்சில் உள்ளபடி)',
  },
  SHRIDHAR: SHRIDHAR_CHARIOT,
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
  order: ['SHRIDHAR', 'WILHELM', 'KALYANRAMAN', 'MUHURTA_CHINTAMANI', 'JOSHI', 'RANGACHARYA'],
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
  RANGACHARYA: {
    labelTa: 'ரங்காச்சார்யா', booksTa: 'ரங்காச்சார்யா',
    nak: { good: [12, 13, 14, 15, 16, 22, 26, 7, 0, 11, 20, 25, 6, 3], mid: [] }, digdwar: false, vara: { good: [0, 3, 4, 5], mid: [] },
    noteTa: 'பெண்களுக்கு அஸ்தம், சித்திரை, சுவாதி, விசாகம், அனுஷம், அவிட்டம், ரேவதி மட்டும்; ஆண்களுக்கு இவற்றுடன் பூசம், அசுவினி, மூன்று உத்திரம், புனர்பூசம், ரோகிணி (கணிப்பது ஆண்களின் பட்டியல்) · திதி — விதி இல்லை',
  },
});
const NEW_ORNAMENTS = deepFreeze({
  labelTa: 'புது ஆபரணம் அணிதல்',
  default: 'KALYANRAMAN',
  order: ['KALYANRAMAN', 'SHRIDHAR', 'WILHELM', 'MUHURTA_CHINTAMANI', 'JOSHI'],
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
});
const ORNAMENT_MAKING = deepFreeze({
  labelTa: 'ஆபரணம் செய்தல் (தங்கம், ரத்தினம், முத்து)',
  default: 'KALYANRAMAN',
  order: ['KALYANRAMAN', 'WILHELM', 'SHRIDHAR', 'MUHURTA_CHINTAMANI'],
  KALYANRAMAN: ORNAMENTS_KR,
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
});
const CLOTHES_WASHING = deepFreeze({
  labelTa: 'ஆடை துவைத்தல் (புது ஆடை)',
  default: 'MUHURTA_CHINTAMANI',
  order: ['MUHURTA_CHINTAMANI', 'SHRIDHAR', 'WILHELM', 'RANGACHARYA'],
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

const RANK = deepFreeze({
  NEW_CLOTHES: {
    order: NEW_CLOTHES.order,
    words: { SHRIDHAR: 686, WILHELM: 432, KALYANRAMAN: 389, MUHURTA_CHINTAMANI: 226, JOSHI: 97, RANGACHARYA: 39 },
    measureTa: 'புது ஆடை அணிதல் பற்றிய சொற்கள் (பக்கத் தலைப்புகள் தவிர): ஸ்ரீதர் (§19.14.1, ப.561-563) 686; வில்ஹெல்ம் (ப.216-217) 432; கல்யாணராமன் (தொ.2 ப.237-238) 389; முகூர்த்த சிந்தாமணி (ஸ்லோ.2/10 உரை, குறிப்புகள், ப.53-54) 226; ஜோஷி (ஆடை, ஆபரணம், ப.146) 97; ரங்காச்சார்யா (ப.131) 39. வசிஷ்டா, ராமன், அகர்வாலில் இல்லை.',
  },
  NEW_ORNAMENTS: {
    order: NEW_ORNAMENTS.order,
    words: { KALYANRAMAN: 594, SHRIDHAR: 511, WILHELM: 497, MUHURTA_CHINTAMANI: 226, JOSHI: 97 },
    measureTa: 'புது ஆபரணம் அணிதல் பற்றிய சொற்கள்: கல்யாணராமன் (தொ.2 ப.235-236, செய்தலும் அணிதலும்) 594; ஸ்ரீதர் (§19.13.1, ப.558-559) 511; வில்ஹெல்ம் (ப.248-249) 497; முகூர்த்த சிந்தாமணி (ஸ்லோ.2/10 — பவளம், தந்தம், சங்கு, தங்கம், ஆடை) 226; ஜோஷி (ஆடை, ஆபரணம்) 97.',
  },
  ORNAMENT_MAKING: {
    order: ORNAMENT_MAKING.order,
    words: { KALYANRAMAN: 594, WILHELM: 178, SHRIDHAR: 90, MUHURTA_CHINTAMANI: 75 },
    measureTa: 'ஆபரணம் செய்தல் பற்றிய சொற்கள்: கல்யாணராமன் (தொ.2 ப.235-236, செய்தலும் அணிதலும்) 594; வில்ஹெல்ம் ("Jewelry- Making & Gold smithing", ப.247) 178; ஸ்ரீதர் (§19.13.2, ப.559-560) 90; முகூர்த்த சிந்தாமணி (ஸ்லோ.2/16 உரை, ஆயுதம் தவிர, ப.59) 75.',
  },
  CLOTHES_WASHING: {
    order: CLOTHES_WASHING.order,
    words: { MUHURTA_CHINTAMANI: 123, SHRIDHAR: 64, WILHELM: 60, RANGACHARYA: 16 },
    measureTa: 'ஆடை துவைத்தல் பற்றிய சொற்கள்: முகூர்த்த சிந்தாமணி (ஸ்லோ.2/20 உரை, குறிப்பு, ப.59-60) 123; ஸ்ரீதர் (§19.14.2, ப.563) 64; வில்ஹெல்ம் (ப.216) 60; ரங்காச்சார்யா (ப.131) 16.',
  },
  STITCHING: {
    order: STITCHING.order,
    words: { WILHELM: 44, SHRIDHAR: 36, RANGACHARYA: 25, MUHURTA_CHINTAMANI: 17 },
    measureTa: 'தைத்தல் பற்றிய சொற்கள்: வில்ஹெல்ம் ("Cloth- Making, Weaving, Sewing", ப.215) 44; ஸ்ரீதர் (§19.14.3, ப.563) 36; ரங்காச்சார்யா (ப.132) 25; முகூர்த்த சிந்தாமணி (ஸ்லோ.2/15 உரை, ப.57) 17.',
  },
  VEHICLE: {
    order: VEHICLE.order,
    words: { WILHELM: 152, SHRIDHAR: 102, VASHISTHA: 85, KALYANRAMAN_BUY: 76, KALYANRAMAN: 67 },
    measureTa: 'வாகனம் வாங்குதல் / முதலில் ஓட்டுதல் பற்றிய சொற்கள் (பக்கத் தலைப்புகள் தவிர): வில்ஹெல்ம் ("Vehicles- Driving", ப.328-329) 152; ஸ்ரீதர் (§25.5, ப.684-685) 102; வசிஷ்டா (ப.136) 85; கல்யாணராமன் (தொ.2 ப.186 — வாங்குதல், ஓட்டப் பழகுதல்) 76; கல்யாணராமன் (ப.242 — புது வாகனம் ஓட்டுதல்) 67. மு.சி., ஜோஷி, ராமன், ரங்காச்சார்யா, அகர்வாலில் வாகனத்துக்குப் பகுதி இல்லை.',
  },
  VEHICLE_MAKE: {
    order: VEHICLE_MAKE.order,
    words: { KALYANRAMAN: 109, SHRIDHAR: 102, WILHELM: 56 },
    measureTa: 'வாகனம் தயாரித்தல் / வியாபாரம் பற்றிய சொற்கள்: கல்யாணராமன் (தொ.2 ப.189) 109; ஸ்ரீதர் (§25.5, ப.684-685) 102; வில்ஹெல்ம் ("Vehicles- Manufacturing", ப.329) 56.',
  },
  ROGA_SNANA: {
    order: ROGA_SNANA.order,
    words: { SHRIDHAR: 251, WILHELM: 199, KALYANRAMAN: 186, MUHURTA_CHINTAMANI: 128, JOSHI: 89, RANGACHARYA: 72, RAMAN: 70, AGARWAL: 37 },
    measureTa: 'நோய் நீங்கிய முதல் குளியல் பற்றிய சொற்கள் (பக்கத் தலைப்புகள் தவிர): ஸ்ரீதர் (§22.5, ப.605) 251; வில்ஹெல்ம் (ப.268-269) 199; கல்யாணராமன் (தொ.2 ப.202) 186; முகூர்த்த சிந்தாமணி (ஸ்லோ.2/40 உரை, ப.76) 128; ஜோஷி (ப.147) 89; ரங்காச்சார்யா (ப.133) 72; ராமன் (PDF ப.53-54) 70; அகர்வால் (ப.329) 37. வசிஷ்டாவில் இல்லை.',
  },
  OLD_HOUSE: {
    order: OLD_HOUSE.order,
    words: { SHRIDHAR: 264, JOSHI: 102, WILHELM: 99, MUHURTA_CHINTAMANI: 94, AGARWAL: 16 },
    measureTa: 'பழைய வீட்டில் நுழைதல் பற்றிய சொற்கள் (பக்கத் தலைப்புகள் தவிர): ஸ்ரீதர் (§27.16, ப.732-733) 264; ஜோஷி (ப.124) 102; வில்ஹெல்ம் (ப.246) 99; முகூர்த்த சிந்தாமணி (13/1 உரையின் ஒரு வாக்கியம், 13/2 உரை, ப.314) 94; அகர்வால் (ப.326) 16. ரங்காச்சார்யா ஒரு வரி மட்டும் (மௌட்யத்திலும் செய்யலாம், ப.42); கல்யாணராமன், ராமன், வசிஷ்டாவில் இல்லை.',
  },
  MEDICINE: {
    order: MEDICINE.order,
    words: { WILHELM: 886, RAMAN: 633, SHRIDHAR: 328, MUHURTA_CHINTAMANI: 218, KALYANRAMAN: 215, JOSHI: 106, VASHISTHA: 103, RANGACHARYA: 71 },
    measureTa: 'மருந்து / சிகிச்சை பற்றிய சொற்கள் (நோய்வாரி சிகிச்சை, பேதி மருந்து, ரத்தம் எடுத்தல், பல் உட்பட; நோய் தொடங்கிய நட்சத்திரப் பலன், மருந்து தயாரித்தல், நோய் நீங்கிய குளியல், அறுவை தவிர): வில்ஹெல்ம் (ப.269, 272-273, 275-277) 886; ராமன் (அத்.XV, ப.52-53) 633; ஸ்ரீதர் (§22.3, ப.603-604) 328; முகூர்த்த சிந்தாமணி (ஸ்லோ.2/15, 2/30 உரை) 218; கல்யாணராமன் (தொ.2 ப.201-203) 215; ஜோஷி (அத்.13, ப.146-147) 106; வசிஷ்டா (ப.133) 103; ரங்காச்சார்யா (ப.132-133) 71. அகர்வாலில் இதற்குப் பகுதி இல்லை (நோய் நீங்கிய குளியல் மட்டும்).',
  },
  SURGERY: {
    order: SURGERY.order,
    words: { WILHELM: 499, RAMAN: 194, SHRIDHAR: 152, VASHISTHA: 65, KALYANRAMAN: 40, RANGACHARYA: 32 },
    measureTa: 'அறுவை சிகிச்சை பற்றிய சொற்கள்: வில்ஹெல்ம் (அறுவை, அழகு அறுவை / பச்சை குத்தல், ப.273-275) 499; ராமன் (ப.53) 194; ஸ்ரீதர் (§22.4, ப.604-605) 152; வசிஷ்டா (ப.133, குறிப்புடன்) 65; கல்யாணராமன் (தொ.2 ப.203) 40; ரங்காச்சார்யா (ப.133) 32. முகூர்த்த சிந்தாமணி, ஜோஷி, அகர்வாலில் அறுவைக்குப் பகுதி இல்லை.',
  },
  BUSINESS: {
    order: BUSINESS.order,
    words: { VASHISTHA: 217, KALYANRAMAN: 190, WILHELM: 112, JOSHI: 83, SHRIDHAR: 66, MUHURTA_CHINTAMANI: 65, RANGACHARYA: 52 },
    measureTa: 'கடை திறப்பு / வியாபாரம் தொடங்குதல் பற்றிய சொற்கள்: வசிஷ்டா ("Vipani karana", பக்.100-101) 217; கல்யாணராமன் (தொ.2 பக்.186-187) 190; வில்ஹெல்ம் (ப.193) 112; ஜோஷி (அத்.9, ப.101) 83; ஸ்ரீதர் (§25.4, ப.684) 66; முகூர்த்த சிந்தாமணி (ஸ்லோ.2/17 — கடை திறப்புப் பகுதி, ப.58; ஒரு உரைப் படிவம்) 65; ரங்காச்சார்யா (ப.128) 52. ராமன், அகர்வாலில் கடை திறப்புக்குத் தனிப் பகுதி இல்லை (வாங்குதல் / விற்றல் மட்டும்).',
  },
  EDUCATION: {
    order: EDUCATION.order,
    words: { WILHELM: 1038, SHRIDHAR: 863, KALYANRAMAN: 313, JOSHI: 222, VASHISTHA: 153, MUHURTA_CHINTAMANI: 147, RANGACHARYA: 70 },
    measureTa: 'உபநயனத்துக்குப் பின் கல்வி தொடங்குதல் பற்றிய சொற்கள்: வில்ஹெல்ம் (பக்.233-237, பாடவாரி நட்சத்திரங்கள், யோகங்கள் உட்பட) 1038; ஸ்ரீதர் (§17.11.2-3, பக்.436-438) 863; கல்யாணராமன் (தொ.2 பக்.151-152) 313; ஜோஷி (அத்.8, பக்.96) 222; வசிஷ்டா (பக்.84-85) 153; முகூர்த்த சிந்தாமணி (ஸ்லோ.5/38, பக்.135; ஒரு உரைப் படிவம்) 147; ரங்காச்சார்யா (பக்.118-119) 70. ராமன், அகர்வாலில் இதற்குத் தனிப் பகுதி இல்லை.',
  },
  VIDYARAMBHA: {
    order: VIDYARAMBHA.order,
    words: { KALYANRAMAN: 2542, WILHELM: 632, VASHISTHA: 534, SHRIDHAR: 230, AGARWAL: 207, JOSHI: 188, MUHURTA_CHINTAMANI: 173, RAMAN: 141, RANGACHARYA: 135 },
    measureTa: 'அக்ஷராப்யாசம் / வித்யாரம்பம் பற்றிய சொற்கள்: கல்யாணராமன் (தொ.2 பக்.94-101; பல நூல்களின் தொகுப்பு) 2542; வில்ஹெல்ம் (பக்.231-233) 632; வசிஷ்டா (பக்.82-83) 534; ஸ்ரீதர் (§17.11.1, பக்.435-436) 230; அகர்வால் (பக்.309, 328) 207; ஜோஷி (பக்.58-59) 188; முகூர்த்த சிந்தாமணி (ஸ்லோ.5/37, பக்.134-135; ஒரு உரைப் படிவம்) 173; ராமன் (PDF ப.19) 141; ரங்காச்சார்யா (பக்.76-77) 135.',
  },
  TRAVEL: {
    order: TRAVEL.order,
    words: { SHRIDHAR: 18112, MUHURTA_CHINTAMANI: 16536, WILHELM: 7634, JOSHI: 4375, KALYANRAMAN: 4304, RAMAN: 1908, RANGACHARYA: 1510, VASHISTHA: 994 },
    measureTa: 'பயணம் பற்றிய சொற்கள்: ஸ்ரீதர் (அத்.23, பக்.611-666) 18112; முகூர்த்த சிந்தாமணி (அத்.11, பக்.235-287; ஒரு உரைப் படிவம்) 16536; வில்ஹெல்ம் (பக்.304-322) 7634; ஜோஷி (அத்.11, பக்.126-141) 4375; கல்யாணராமன் (தொ.2 பக்.204-215) 4304; ராமன் (அத்.XIV, PDF பக்.49-51) 1908; ரங்காச்சார்யா (அத்.VIII, பக்.109-116) 1510; வசிஷ்டா (பக்.126-132) 994. அகர்வாலில் பயணப் பகுதி இல்லை.',
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
    WILHELM: { ...WILHELM_E, pageLocus: '"Education - Vidya & Upavidya", printed pp.233-237 (PDF 241-245): "Nakshatra: Asvini, Mrigasira, Ardra, Punarvasu, Pushya, Hasta, Chitta, Svati, Sravana, Dhanishtha and Satabhisha are best. Kalaprakasika also considers Rohini, Uttaraphalguni, Uttarashadha, Uttarabhadrapada and Revati to be middling, while Muhurta Chintamani considers Aslesha, Purvaphalguni, Mula, Purvashadha and Purvabhadrapada as also favorable, which all of these may be considered as middling"; "Tithi: The 2nd, 3rd, 5th, 6th, 10th and 11th are favorable. Kalaprakasika also considers the 1st as favorable, while Muhurta Chintamani also considers the 12th as favorable, both of which may be considered as middling. Particularly avoid the 4th, 8th, 9th, 14th and 15th Tithis"; Galagraha, Anadhyaya, Pradosha; "Vara: Avoid the Varas of Mars and Saturn, as well as the Moon\'s … The Sun\'s Vara prolongs life, though according to some it impedes progress"; "Lagna: Dual Rasis are best, moveable Rasis are middling, while fixed Rasis should be avoided … Navamsa: Avoid the Navamsas of Mars and Saturn. Bhavas: The 8th must be unoccupied and, according to some, the 4th as well. Malefics should certainly not be in the 4th. Malefics are best in the 3rd, 6th and 11th … Benefics are best in angles and trines. Grahas: Avoid the afflictions of Jupiter and Venus. Miscellaneous: Forenoon and noon are best, the afternoon and night should be avoided"' },
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§17.11.2 "All types of educations" and §17.11.3 "Prohibited time for study", printed pp.436-438 (PDF 476-478): "Tithi: 2,3,5,10 & 11 Tithis are favourable. B.H. is recommended … Avoid 4,6,8,9 Tithis, the Full Moon & New Moon days. Anadhyaya Tithis are prohibited. Day: Wednesday, Thursday, Friday are the best … M.C. has recommended Sunday also … Tuesday & Saturday, & their navamshas in the rising should be avoided … Majority of exponents including Acharya Shripati commend that Monday is prohibited"; "Constellation: Mrigshira, Ardra, Punarvasu, Pushya, Hasta, Chitra, Swati, Shravana, Shatbhish, Dhanishta … the best; Ashvani, Rohini, 3 Poorvas are … neutral. M.C. opines that Bharni, Krittika & 3 Uttras (5 nos.) should be avoided & balance can be used. J.V. … constellation number 1st to 7th, & 12th to 15th from that of the Sun are unfavourable"; p.437: "Ascendant: The common signs are the best; movable signs are of middling quality …; while the fixed signs are bad according to K.P. Malefics in 3,6 & 11 houses will increase happiness; while benefics in these houses will certainly cause obstructions. Benefics in quadrants or trines are beneficial. There should be no planet in the 8th house … Some opine that 4th house should also be vacant"; "According to J.V. Jupiter & Venus should not be set; avoid Vishnu Shayana"; "Time: Forenoon & the Noontime are the best; afternoon & night-time should be avoided"; p.438 §17.11.3: "1st Tithi …, 8th Tithi …, 14th & the New Moon …, the Full Moon …; Ayana & Vishuva Sankranti, Harishayan & Haibodhan"' },
    KALYANRAMAN: { ...KALYANRAMAN_V2, pageLocus: '"Educational — Commencing General Education", printed pp.149-152 (PDF 151-154): "Tuesdays are generally to be rejected for such deeds"; the table "Nakshatra Abhijith, Aswini, Rohini, Mrigasira, Aridra, Punarvasu, Pushyami, Aslesha, Poorvaphalguni, Hasta, Chitra, Swati, Moola, Poorvashada, Sravana, Dhanishta, Satabhisha, Poorvabhadrapada (17+1) … Tithis 2/3/5/6/10/11/12 Some accept 1/7/8/13/15 as well. Weekdays Wednesday, Thursday and Friday are the best. Sunday and Monday are mediocre"; vol.2 p.100: "Lagna of movable raasis (1-4-7-10) with benefics in Kendra and Trikonas (1-4-7-10-5-9) and malefics in 3-6-11 is considered good for starting general education. 8th house must be free"' },
    JOSHI: { ...JOSHI_KK, pageLocus: 'Chapter 8 "Educational Muhurtas — Muhurta for Starting Education - General", printed p.96 (PDF 111): "Time: Sun in Uttarayana is considered auspicious. Some Learned say that except \'Harishayana\' … whole year is good. Combustion of Jupiter and Venus should be avoided. Nakshatras: All movable nakshatras …, all short nakshatras (i.e. Hasta, Ashwini and Pushya) Moola, Poorvaphalguni, Poorvashada, Poorvabhadrapad, Mrigshira, Chitra, Ardra and Ashlesha are considered good. Tithis: 2/3/5/6/10/11/12 tithis are good. Days: Wednesday, Thursday and Friday are best; Sunday and Monday medium and rest … should be avoided. Lagna: Lagna of movable rashis (1/4/7/10 rashis) with benefics in kendras and Trikonas … and malefics in 3/6/10/11 are considered good. 8th house should not have any planet. Age: … odd years … Chandra/Tara-Shuddhi: … avoiding 4/8/12 positions of Moon from natal Moon … avoiding 3/5/7 Taras"' },
    VASHISTHA: { ...VASHISTHA_KUSUM, pageLocus: '"2. Starting main line of education", printed pp.84-85 (PDF 71-72): "Mas — Excepting Phalguna, any other month in Uttarayana; Tithi — 2, 3, 5, 7, 10, 11 and 13 shukla tithis; Vara — Sunday, Wednesday, Thursday and Friday; Nakshatra — Mrigashirsha, Ardra, Punarvasu, Hasta, Chitra, Swati, Sravana, Dhanishtha, Shatabhisha, Ashwini, Moola, all the three poorvas, Ashlesha. Also dhruva (fixed) nakshatras i.e. Anuradha and Revati. It means that out of 27 nakshatras, only 6 nakshatras i.e. Bharani, Krittika, Magha and the three uttaras are to be avoided. Lagna — 2, 5, 8 (fixed lagnas excepting Kumbha) i. Benefics in Kendra or Trikona … ii. Malefics in 3, 6, and 11 from lagna"' },
    MUHURTA_CHINTAMANI: { ...MC_SHARMA, pageLocus: 'Chapter 5 sloka 38, printed p.135 (PDF 139): "मृगात्कराच्छ्रुतेस्त्रयेऽश्विमूलपूर्विकात्रये गुरुद्वयेऽर्कजीववित्सितेऽह्नि षट्छरत्रिके । शिवार्कदिग्द्विके तिथौ ध्रुवान्त्यमित्रभे परैः शुभैरधीतिरुत्तमा त्रिकोणकेन्द्रगैः स्मृता ॥" — "THE MUHURTA FOR THE BEGINNING OF GETTING EDUCATION: … the auspicious Nakshtras are Mrigashira, Ardra, Punarvasu, Hasta, Chitra, Swati, Shravana, Dhanishtha, Shatabhisha, Ashwini, Moola, Poorvaphalguni, Poorvashadha, Poorvabhadrapada, Pushya and Ashlesha, the auspicious days are Sunday, Thursday, Wednesday and Friday and the auspicious Tithis are 6/5/3/11/12/10/2; and the Lord of the Ascendant … should be a benefic planet and there should be benefic planets in the Angles and Trines from the Ascendant. Notes: Some Acharyas have said that for beginning to learn archery the Nakshtras named as Dhruwa, those of Rewati and Anuradha are the auspicious ones"' },
    RANGACHARYA: { ...RANGACHARYA_I, pageLocus: 'Chapter IX "Commencing Education", printed pp.118-119 (PDF 126-127): "The 1st (D) 2,3,5,6,12,10,11 are good, 4,8,9,14 Amavasya and Poornima should be avoided. Wednesday, Thursday and Friday are good. Sunday and Monday are mediocre. Tuesday and Saturday should be avoided. The movable and the dual lagnas should be the choice. Aswini, Mrigasira, Aridra, Punarvasu, Pushyami, Aslesha, Poorva (3) Hasta, Chitra, Swati, Sravana, Dhanishtta and Satabhisha are acceptable"' },
  },
  BUSINESS: {
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
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§27.16 "Entering into house", printed pp.732-733 (PDF 766-767): "b) entry into an old house (rented, repaired, or reconstructed house destroyed in fire / flood / lightening / cyclone etc.) … For entry into old houses defined above, lunar months of Margshirsha, Karttika, Shravana; asterisms of Shatbhish, Pushya, Swati, Dhanishta are beneficial (M.C). B.S. commends that asterisms of Chitra, 3 Uttras, Rohini, Mrigshira, Anuradha, Dhanishta, Shatbhish & Revati bestow longevity, wealth, health, fame, sons & grandsons … Exponents opine that maleficence due to combustion of Jupiter & Venus, their Baal & Vridh Avasthas, Jupiter in Leo are not considered in entry into an old house … Although in all types of houses Uttrayana is auspicious, but entry into such houses can be made in Dakshinayana. M.G. recommends that asterisms of Dhanishta, Shatbhish, Pushya, 3 Uttras, Rohini, Mrigshira, Chaitra, Swati & Anuradha are auspicious in entry into an old house"' },
    JOSHI: { ...JOSHI_KK, pageLocus: '"For entering in to an old house", printed p.124 (PDF 139): "For entering in to a old house (i.e. purchased house, rented house or repaired house) Vaishakh, Jyestha, Magha, Falguna, Margsheersha, Kartika and Shravana months (lunar) are considered auspicious. There is no need to consider combustor of Jupiter and Venus and Jupiter\'s placement in LEO or CAPRICORN. All other considerations regarding tithi, nakshatra, lagna etc. are similar to those of entering in to a new house. In addition to the nakshatras stated for entry in to new house. Shatbhisha, Pushya, Swati and Dhanistha nakshatras can also be chosen for entry in to an old house"' },
    WILHELM: { ...WILHELM_E, pageLocus: '"House/Buildings — Entering an old dilapidated house", printed p.246 (PDF 254): "If the house is old and dilapidated such that there is concern of fire or other disasters the following should be adhered to: Masa: The months stated above for ENTERING A NEW HOUSE as well as Karttika, Margasira and Sravana are favorable. Nakshatra: The Nakshatras stated above for ENTERING A NEW HOUSE as well as Pushya, Svati, Dhanishtha and Satabhisha are favorable. Miscellaneous: Unlike ENTERING A NEW HOUSE, no consideration need be given the combustion and afflictions of Jupiter and Venus. Other factors are the same as ENTERING A NEW HOUSE above"' },
    MUHURTA_CHINTAMANI: { ...MC_SHARMA, pageLocus: 'Chapter 13 sloka 2, printed p.314 (PDF 318): "जीर्णे गृहेऽग्न्यादिभयान्नवेऽपि मार्गोर्जयोः श्रावणिकेऽपि सत्स्यात् । वेशोऽम्बुपेज्यानिलवासवेषु नावश्यमस्तादिविचारणात्र ॥२॥" — "Entering an old, dilapidated, newly constructed house because of the fear of fire etc. is excellent or auspicious in the months stated above and in the month of Kartika, Margashirsha, and Shravana, and in the Nakshtras of Shatabhisha, Pushya, Swati and Dhanishtha also, and no consideration should be made of the combustion of Jupiter and Venus when entering an old, dilapidated house"' },
    AGARWAL: { ...AGARWAL_GS, pageLocus: '"Entering an old house", printed p.326 (PDF 325): "Above muhurtas plus months Shravana, Kartika, Margashirsha. Nakshatras, Satbhisha, Pushya, Swati, Dhanishta"' },
  },
  MEDICINE: {
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
    WILHELM: { ...WILHELM_E, pageLocus: '"Medical- Surgery (including oral surgery, pulling & drilling teeth)", printed pp.273-274 (PDF 281-282): "In addition to what is given below for TREATMENT OF DISEASE … Nakshatra: Ardra, Aslesha, Jyeshtha and Mula are particularly favorable, followed by Krittika. Tara: Not only should the Janma Nakshatra particularly be avoided, it is best if the Moon is not in the same Rasi as the natal Moon. Tithi: Rikta Tithis (4th, 9th and 14th) are particularly favorable, followed by the 3rd and 13th … Avoid Purnima and the other generally unfavorable Tithis (6th, 8th, 12th and Amavasya). Vara: The Varas of Mars and Saturn are particularly favorable, though Varas other than that of the Sun are quite acceptable. Lagna: Aries, Taurus, Cancer and Virgo are most favorable. Bhavas: The 8th must be unoccupied … Grahas: Mars should be favorable and not influenced by Saturn"; cosmetic surgery, p.275' },
    RAMAN: { ...RAMAN_BV, pageLocus: 'Chapter XV "Medical Elections", PDF p.53: "Surgical Operations. - When possible, operate in the period of the intrease [sic] of the Moon. Never operate at the exact time of the Full Moon … Let not the Moon at the time of the operation be in the same sign as at birth … For surgical operations Tuesday or Saturday is recommended. Mars must be powerful. The 8th house should be unoccupied. And the ruling constellation is Aridra, Jyeshta, Aslesha or Moola coinciding with the 4th, 9th or 14th lunar day … Mutual aspects between Mars and Saturn should be avoided"' },
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§22.4 "Surgery", printed pp.604-605 (PDF 641-642): "B.J.S recommends Hasta, Chitra, Swati, Ashvani, Pushya, Shatbhisha, Rohini, Mrigshira, Shravana, Anuradha & Jyeshta are the best. However K.P recommend that surgery & other external treatments are beneficial in Sharp asterisms (Jyeshta, Ardra, Ashlesha, Moola); on Rikta Tithis; on Tuesday or Sunday, when Mars is powerful. 8th house should be unoccupied. Rising signs should be Aries, Taurus, Cancer or Virgo … The Moon should not be in 4th or 8th or 12th from J.R. Tara should be benefic & avoid Vinashika Tara. The rising sign should not be in 8th from J.R. or Janma Lagna. Planets should not be Ghaata in transit. The rising sign should be benefic having aspects of Jupiter & the Moon"' },
    VASHISTHA: { ...VASHISTHA_KUSUM, pageLocus: '"Shalyakarma muhurta (Surgery muhurta)", printed p.133 (PDF 120): "Tithi — 4, 9, 14 Shukla specially good (Rikta tithis); Vara — Sunday, Tuesday and Thursday; Nakshatra — Ashwini, Mrigashirsha, Punarvasu, Hasta, Swati, Anuradha, Jyeshtha, Sravana and Shatabhisha. Note: For taking treatment Amrit yoga, 1, 4, 7, 10, 6, 7, 8 and 12 bhavas, unblemished in transit, Jupiter should be auspicious, tara shuddhi from natal Moon are recommended. Leave Bhadra"' },
    KALYANRAMAN: { ...KALYANRAMAN_V2, pageLocus: '"Performing Surgery", printed p.203 (PDF 205): "Nakshatra Aswini, Aridra, Aslesha, Makha, Jyeshta, Moola (6) … Tithis 1/2/3/5/6/7/8/10/11/12/13/15. Weekdays Sunday, Monday, Tuesday, Wednesday, Thursday, Friday"' },
    RANGACHARYA: { ...RANGACHARYA_I, pageLocus: '"Medical matters", printed p.133 (PDF 141): "Surgical operation should be done on Tuesday or Sunday, when the 8th house is vacant and the 6th house is occupied by malefics, the sun and Moon should be in the kendras"' },
  },
  VEHICLE: {
    WILHELM: { ...WILHELM_E, pageLocus: '"Vehicles- Driving", printed pp.328-329 (PDF 336-337): "The first time that one drives a particularly type of vehicle as well as the first time one drives a new vehicle are important and a favorable Muhurta should be selected. Nakshatra: Asvini, Rohini, Mrigasira, Punarvasu, Magha, Uttaraphalguni, Hasta, Chitra, Svati, Anuradha, Uttarashadha, Sravana, Uttarabhadrapada and Revati are favorable. Pushya, Visakha and Dhanishtha are middling. Tithi: The 2nd, 3rd, 5th, 7th, 10th, and 12th are favorable. Avoid the 1st, 4th, 6th, 9th, 11th, 14th and 15th. The 13th is middling. Vara: Avoid the Varas of the Sun and Mars. Saturn\'s Vara is middling. Other Varas are favorable. Lagna: Taurus, Gemini, Cancer, Virgo and Libra are favorable. Capricorn is middling. The Lagna being the Rasi of the natal Moon is also quite favorable. Navamsa: The Navamsas of Mercury, Jupiter, and Venus are most favorable. Combinations: Venus in an angle or trine, in own, exaltation or friendly Rasi is very favorable"' },
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§25.5 "Chariot - transport works", printed pp.684-685 (PDF 719-720): "In Small (Hasta, Ashvani, Pushya, Abhijit), Movable (Punarvasu, Swati, Shravana, Shatbhish, Dhanishta), Sweet (Mrigshira, Chitra, Anuradha, Revati), Rohini, Jyeshta, Vishakha; on benefic weekdays (including Sunday); Jaya, Nanda & Pooma Tithis; in rising signs ruled by Mercury, Jupiter & Venus; all types of works related to chariot are benefical. B.J.S recommends the above asterisms along with benefic days especially Sunday as auspicious for starting automotive vehicles & man driven devices (Rikshaw)"; Poorna tithis "5th, 10th, 15th & 30th … Though 30th is a Poorna Tithi in technical terms, it is not recommended for the above elections", p.29' },
    VASHISTHA: { ...VASHISTHA_KUSUM, pageLocus: '"Muhurta for Driving and Buying a New Vehicle", printed p.136 (PDF 123): "Tithi — 2, 3, 5, 6, 7, 8, 10, 11, 12 and 13 of both the pakshas; pratipada of krishna pakasha and poornima are good. Nakashatra — Ashlesha, Mrigashirsha, Punaravasu, Pushya, Hasta, Chitra, Swati, Sravana, Dhanishtha, Shatabhisha, Revati, Anuradha and Rohini. Vara — Sunday, Monday, Wednesday, Thursday and Friday. Lagna — Chara or dwiswabhava (1, 4, 7, 10, 3, 6, 9 and 12) Moon and Venus strong, unafflicted 4th house, the vehicle owner\'s name has importance, 8th house should be vacant"' },
    KALYANRAMAN_BUY: { ...KALYANRAMAN_V2, pageLocus: '"Training or Riding Horses, Getting Trained in Riding of Houses, Selling, Purchasing Conveyances, Getting Trained in driving Conveyances, Learning Driving", printed p.186 (PDF 188): "Nakshatra Aswini, Mrigasira, Punarvasu, Pushyami, Hasta, Swati, Dhanishta, Satabhisha and Revati. (9) Tithis 1/2/3/5/6/7/8/10/11/12/13/15 Weekdays Sunday, Monday, Wednesday, Thursday, Friday, Saturday. Notes: Ensure Chandra Suddhi and Tara Suddhi. Avoid Tuesday and Rikta tithis"' },
    KALYANRAMAN: { ...KALYANRAMAN_V2, pageLocus: '"Driving New Vehicles", printed p.242 (PDF 244): "Nakshatra Aswini, Krittika, Rohini, Mrigasira, Aridra, Makha, Uttaraphalguni, Hasta, Chitra, Swati, Anuradha, Moola, Poorvashada, Uttarashada, Dhanishta, Poorvabhadrapada, Uttarabhadrapada and Revati. (18) … Tithis 1/2/3/5/6/7/8/10/11/12/13/15 Weekdays Sunday, Monday, Wednesday, Thursday, Friday"' },
  },
  VEHICLE_MAKE: {
    KALYANRAMAN: { ...KALYANRAMAN_V2, pageLocus: '"Manufacturing, Sale or Purchase of Vehicles, Doing Business Connected with Vehicles", printed p.189 (PDF 191): "Nakshatra Abhijith, Aswini, Rohini, Mrigasira, Punarvasu, Pushyami, Hasta, Chitra, Swati, Visaka, Anuradha, Jyeshta, Sravana, Dhanishta, Satabhisha, Revati, (15+1) … Tithis 1/6/11/3/8/13/5/10/15 Nanda- 1/6/11 Jaya- 3/8/13 Poorna- 5/10/15/30 Weekdays Sunday. Notes: Prefer Ascendant of raasis 2, 3, 6, 7, 9 or 12"' },
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§25.5 "Chariot - transport works", printed p.684 (PDF 719): "In Small (Hasta, Ashvani, Pushya, Abhijit), Movable (Punarvasu, Swati, Shravana, Shatbhish, Dhanishta), Sweet (Mrigshira, Chitra, Anuradha, Revati), Rohini, Jyeshta, Vishakha; on benefic weekdays (including Sunday); Jaya, Nanda & Pooma Tithis; in rising signs ruled by Mercury, Jupiter & Venus; all types of works related to chariot are benefical"' },
    WILHELM: { ...WILHELM_E, pageLocus: '"Vehicles- Manufacturing", printed p.329 (PDF 337): "Nakshatra: Asvini, Rohini, Mrigasira, Punarvasu, Pushya, Hasta, Chitra, Svati, Visakha, Anuradha, Jyeshtha, Sravana, Dhanishtha, Satabhisha and Revati are favorable. Tithi: The 1st, 3rd, 5th, 6th, 10th, 11th and 13th are most favorable. The 2nd, 7th and Purnima are middling. Lagna: Taurus, Gemini, Virgo, Libra, Sagittarius and Pisces are favorable"' },
  },
  NEW_CLOTHES: {
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§19.14.1 "Wearing of new clothes", printed pp.561-562 (PDF 599-600): "Tithi: 2,3,5,7,10,11 & 13 are the best Tithis. Rikta (4,9,13) Tithis & the New Moon day should be avoided. Day: Wednesday, Thursday & Friday are the best; & their lords\' amshas are benefic. Sunday & Monday are middling; avoid Sunday & Tuesday … Const.: Stationary (Rohini, 3 Uttras), Small (Hasta, Ashvani, Pushya), Punarvasu, Chitra, Swati, Vishakha, Anuradha, Dhanishta & Revati, are the most felicitous … Ascendant: 2,3,6,7,11 & 12 are suitable, balance be rejected … New clothes should not be worn by wife when the Moon is transiting 4,8,12 places from the husband\'s J.R."' },
    WILHELM: { ...WILHELM_E, pageLocus: '"Clothes- Wearing, new", printed pp.216-217 (PDF 224-225): "Nakshatra: Asvini, Rohini, Punarvasu, Pushya, Uttaraphalguni, Hasta, Chitta, Svati, Visakha, Anuradha, Uttarashadha, Dhanishtha, Uttarabhadrapada and Revati are favorable; the remaining are unfavorable. For Women: Additionally, it is not considered favorable by some authorities for a married woman to wear clothes under Rohini, Punarvasu, Pushya, Uttaraphalguni, Uttarashadha or Uttarabhadrapada … Tithi: The 2nd, 3rd, 5th, 7th, 10th, 11th, and 12th are best. The 4th, 9th, 14th, and Amavasya should be strictly avoided, other Tithis are middling. Vara: The Varas of Mercury, Jupiter and Venus are best, the Sun and Moon\'s are middling … Lagna: Taurus, Gemini, Cancer, Virgo and Libra are favorable. Capricorn is middling. The Lagna being the Rasi of the natal Moon is also quite favorable … Navamsa: The Navamsa of Mercury, Jupiter, and Venus are most favorable"' },
    KALYANRAMAN: { ...KALYANRAMAN_V2, pageLocus: '"Getting new clothes and Ornaments, Preparing and Wearing them", printed pp.237-238 (PDF 239-240): "Nakshatra (Abhijith included) Abhijith Aswini, Rohini, Punarvasu, Pushyami, Uttaraphalguni, Hasta, Chitra, Swati, Visaka, Anuradha, Uttarashada, Dhanishta, Uttarabhadrapada and Revati. (14+1) … Tithis 1/2/3/5/6/7/8/10/11/12/13/15 Weekdays Sunday, Monday, Thursday, Friday. Notes: … 4. Kaalaprakaasika admits only tithis 2/3/5/7/10/11/13 and says 4/9/14 and Amavasya to be strictly avoided. Sunday and Monday are held as mediocre. However, Wednesday is admitted. It wants to avoid raasis Lagnas: Aries, Leo, Scorpio, Sagittarius Aquarius and Pisces … 6. Malefic Tithi-vaara-nakshatra Yogas must be avoided and Chandra Suddhi and Tara Suddhi must be ensured"' },
    MUHURTA_CHINTAMANI: { ...MC_SHARMA, pageLocus: 'Chapter 2 sloka 10, printed pp.53-54 (PDF 57-58): "पौष्ण्याश्विकरपञ्चकवासवेज्यादित्ये प्रवालरदशंखसुवर्णवस्त्रम् । धार्यं विरिक्तशनिचन्द्रकुजेऽह्नि न रक्तं भौमे ध्रुवादितियुगे सुभगा न दध्यात् ॥१०॥" — "Revati, the Nakshtras called Dhruwa, Ashwini, Hasta, Chitra, Swati, Vishakha, Anuradha, Dhanishtha, Pushya and Punarvasu Nakshtras, the Rikta Tithis (4/9/14), the days of Saturday, Monday and Tuesday — in the Nakshtras tithis and days except these … it is not proper to wear Coral, things made of tusk (elephant teeth), Sankha, gold and clothes … in the Nakshtras called Dhruwa, Punarvasu and Pushya, a woman whose husband is living should not wear new clothes. To wear red clothes Tuesday has been considered to be auspicious"' },
    JOSHI: { ...JOSHI_KK, pageLocus: 'Chapter 13 "Wearing clothes and ornaments", printed p.146 (PDF 161): "Nakshatras: All fixed nakshatras (i.e. Uttaraphalguni, Uttarashada, Uttarabhadrapad and Rohini), all short nakshatras (i.e. Hasta, Ashwini, Pushya and Abhijit), Revati, Chitra, Anuradha, Swati, Punarvasu, Dhanistha and Vishakha nakshatras. Tithis: Avoid Rikta tithis and Amavasya. Days: Sunday, Monday, Thursday and Friday are considered auspicious. Yogas: Avoid Vyatipaat and Vaidhriti yogas. One should also avoid Bhadra and malefic yogas formed by tithi-vaar-nakshatra. Proper Chandra/Tara Shuddhi is necessary. A married women should not wear new clothes or ornaments on Sunday and in Uttaraphalguni, Uttarashada, Uttarabhadrapad Rohini, Punarvasu and Pushya nakshatras"' },
    RANGACHARYA: { ...RANGACHARYA_I, pageLocus: '"Wearing new clothes", printed p.131 (PDF 139): "Hasta, Chitra, Swati, visakha, Anuradha, Dhanishtta and Revati are good for women, and for men those asterisms and Pushyami, Aswini, Uttara, Uttarashada and Uttarabhadra, Punarvasu and Rohini are good. Sunday, Wednesday, thursday and Friday are good"' },
  },
  NEW_ORNAMENTS: {
    KALYANRAMAN: { ...KALYANRAMAN_V2, pageLocus: '"Making and Wearing new Ornaments", printed pp.235-236 (PDF 237-238): "Nakshatras Abhijith, Aswini, Rohini, Punarvasu, Pushya, Uttaraphalguni, Hasta, Swati, Uttarashada, Sravana, Dhanishta, Satabhisha, Uttarabhadrapada. (12+1) … Tithis Avoid Rikta tithis and Amavasya. Weekdays Monday, Wednesday, Thursday, Friday. Avoid Tuesday, Saturday, Sunday mediocre. Yoga Avoid Vydhruti and Vyatipata. Notes: 1. Muhoortha Chintaamani prefers days of Tripushkarayoga in addition to the nakshatras approved …"' },
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§19.13.1 "Wearing of new ornaments", printed pp.558-559 (PDF 596-597): "Day: Thursday & Friday are considered best by most of the exponents. J.V. recommends Sunday & Tuesday also; B.J.S. opines Wednesday as favourable & Sunday is middling … J.V. recommends that Monday, Wednesday, Thursday & Friday … are auspicious … Tithi: 1,5,6, 10, 11 & the Full Moon are favourable & other Tithis be avoided (K.P.) Const.: J.V. opines that in Hasta, Chitra, Swati, Vishakha, Anuradha, Dhanishta, Ashvani & Revati wearing of clothes & jewellery … In addition to the above stars, ladies should wear jewellery studded with gems on Magha, Ardra, Shravana, Mrighsirsha, Shatbhish & P. Falguni … According to Sage Badrayan, wearing of gold jewellery is auspicious in Hasta, Anuradha, Pushya, P. Shada, Dhanishta, Chitra, 3 Uttras, Punarvasu, Rohini & fixed ascendant. Ascendant: 2,3,6,9 & 12 produce good. K.P. opines that 8th house should be vacant"' },
    WILHELM: { ...WILHELM_E, pageLocus: '"Jewelry- Wearing, new", printed pp.248-249 (PDF 256-257): "Nakshatra: Asvini, Rohini, Mrigasira, Punarvasu, Pushya, Magha, Uttaraphalguni, Hasta, Chitra, Svati, Anuradha, Uttarashadha, Sravana, Uttarabhadrapada and Revati are favorable … Tithi: The 1st, 5th, 6th, 10th, 11th and Purnima are favorable. Other Tithis should be avoided. For casual jewelry, only the 4th, 9th and 14th Tithis and Amavasya need to be avoided. Vara: The Varas of the Moon, Mercury, Jupiter and Venus are favorable … The other Varas should be avoided … Lagna: Taurus, Gemini, Virgo, Sagittarius and Pisces are favorable. Cancer and Libra are middling … Navamsa: The Navamsas of the Moon, Mercury, Jupiter and Venus are favorable; others should be avoided. Bhavas: The 8th should be vacant. Benefics are best in angles and trines and the malefics in the 3rd, 6th and 11th"' },
    MUHURTA_CHINTAMANI: { ...MC_SHARMA, pageLocus: 'Chapter 2 sloka 10, printed pp.53-54 (PDF 57-58): "पौष्ण्याश्विकरपञ्चकवासवेज्यादित्ये प्रवालरदशंखसुवर्णवस्त्रम् । धार्यं विरिक्तशनिचन्द्रकुजेऽह्नि न रक्तं भौमे ध्रुवादितियुगे सुभगा न दध्यात् ॥१०॥" — "Revati, the Nakshtras called Dhruwa, Ashwini, Hasta, Chitra, Swati, Vishakha, Anuradha, Dhanishtha, Pushya and Punarvasu Nakshtras, the Rikta Tithis (4/9/14), the days of Saturday, Monday and Tuesday — in the Nakshtras tithis and days except these … it is not proper to wear Coral, things made of tusk (elephant teeth), Sankha, gold and clothes … in the Nakshtras called Dhruwa, Punarvasu and Pushya, a woman whose husband is living should not wear new clothes. To wear red clothes Tuesday has been considered to be auspicious"' },
    JOSHI: { ...JOSHI_KK, pageLocus: 'Chapter 13 "Wearing clothes and ornaments", printed p.146 (PDF 161): "Nakshatras: All fixed nakshatras (i.e. Uttaraphalguni, Uttarashada, Uttarabhadrapad and Rohini), all short nakshatras (i.e. Hasta, Ashwini, Pushya and Abhijit), Revati, Chitra, Anuradha, Swati, Punarvasu, Dhanistha and Vishakha nakshatras. Tithis: Avoid Rikta tithis and Amavasya. Days: Sunday, Monday, Thursday and Friday are considered auspicious. Yogas: Avoid Vyatipaat and Vaidhriti yogas. One should also avoid Bhadra and malefic yogas formed by tithi-vaar-nakshatra. Proper Chandra/Tara Shuddhi is necessary. A married women should not wear new clothes or ornaments on Sunday and in Uttaraphalguni, Uttarashada, Uttarabhadrapad Rohini, Punarvasu and Pushya nakshatras"' },
  },
  ORNAMENT_MAKING: {
    KALYANRAMAN: { ...KALYANRAMAN_V2, pageLocus: '"Making and Wearing new Ornaments", printed pp.235-236 (PDF 237-238): "Nakshatras Abhijith, Aswini, Rohini, Punarvasu, Pushya, Uttaraphalguni, Hasta, Swati, Uttarashada, Sravana, Dhanishta, Satabhisha, Uttarabhadrapada. (12+1) … Tithis Avoid Rikta tithis and Amavasya. Weekdays Monday, Wednesday, Thursday, Friday. Avoid Tuesday, Saturday, Sunday mediocre. Yoga Avoid Vydhruti and Vyatipata. Notes: 1. Muhoortha Chintaamani prefers days of Tripushkarayoga in addition to the nakshatras approved …"' },
    WILHELM: { ...WILHELM_E, pageLocus: '"Jewelry- Making & Gold smithing", printed p.247 (PDF 255): "Nakshatra: Asvini, Rohini, Punarvasu, Pushya, Uttaraphalguni, Hasta, Svati, Uttarashadha, Sravana, Dhanishtha, Satabhisha, and Uttarabhadrapada are favorable. Gold Jewelry and Gold Smithing: Asvini, Mrigasira, Punarvasu, Pushya, Hasta, Chitta, Svati, Sravana, Dhanishtha, and Satabhisha are most favorable. Jewelry with Pearls: Additionally, Mrigasira, Chitra, Anuradha and Revati are particularly favorable … Vara: The Varas of benefics are favorable. For jewelry with gems and diamonds the Varas of the Sun and Mars are particularly favorable. For gold jewelry and gold smithing the Varas of the Sun, Mars, Jupiter and Venus are particularly favorable. Lagna: The Rasis of benefics are favorable …"' },
    SHRIDHAR: { ...SHRIDHAR_HEA, pageLocus: '§19.13.2 "Manufacture of ornaments", printed pp.559-560 (PDF 597-598): "Asterisms of Ashvani, Rohini, Mrigshira, Punarvasu, Pushya, 3 Uttras, Hasta, Chitra, Swati, Vishakha, Anuradha, Shravana, Dhanishta, Shatbhish & Revati; Monday, Wednesday, Thursday & Friday are auspicious for making ornaments. For manufacture of jewellery studded with gems, one should select Ashvani, Krittika, Rohini … & Revati; & days other than Saturday. Tripushkar Yoga is also beneficial. Silver jewellery studded with pearl & Diamond should be manufactured in just above said asterisms except Vishakha & Krittika; & on Friday & Thursday (M.M.)"' },
    MUHURTA_CHINTAMANI: { ...MC_SHARMA, pageLocus: 'Chapter 2 sloka 16, printed p.59 (PDF 63): "It is auspicious to get Jewels made on the day in which Tripushkar yoga falls … and in the Nakshtras called Chara, Kshipra and Dhruwa. Jewels studded with diamonds and gems should be got prepared in the other Nakshtras except the Nakshtras called Tikshna and Ugra, on Sundays and Tuesdays and in the Ascendants of Aries, Scorpio and Leo. Jewels studded with Pearls should be got prepared in the Nakshtras called Chara, Mridu, Dhruwa and Kshipra and on an auspicious day and in an auspicious Ascendant"' },
  },
  CLOTHES_WASHING: {
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
  MALEFIC_6_MID: '6-ல் பாவர் இல்லை', SUN_MOON_KENDRA_MID: 'சூரியன், சந்திரன் கேந்திரத்தில் இல்லை',
  // The recovery bath.
  MOON_NOT_WEAK_MID: 'சந்திரன் "க்ஷீணம்" இல்லை (4 / 8 / 12-ல் இல்லை)', MOON_WEAK_MID: 'சந்திரன் க்ஷீணம் (4 / 8 / 12-ல்)',
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
  'பாடவாரி நட்சத்திரங்கள் (இலக்கணம், தர்க்கம், ஜோதிடம், கணிதம், மருத்துவம், வில்வித்தை, இசை, நடனம், சட்டம், ஓவியம் …) நூல்களில் உள்ளன (வில்ஹெல்ம் ப.234, ஸ்ரீதர் §17.11.4-6, ஜோஷி அத்.8, கல்யாணராமன் பக்.150-154, வசிஷ்டா ப.85-87, ரங்காச்சார்யா ப.119-120) — இங்கே கணிக்கப்படவில்லை; பொது விதிகள் மட்டும்.',
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
  'ரங்காச்சார்யா (ப.42): பழைய வீட்டில் நுழைவு மௌட்யத்திலும் (குரு / சுக்கிரன் அஸ்தங்கம்) செய்யலாம் — அவரது புது வீட்டு வாசிப்பிலேயே அஸ்தங்க விதி இல்லை, ஆகவே தனி வாசிப்பு இல்லை. கல்யாணராமன், ராமன், வசிஷ்டாவில் பழைய வீட்டுக்குத் தனி விதி இல்லை.',
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
  'மு.சி., ஜோஷி, ராமன், ரங்காச்சார்யா, அகர்வாலில் வாகனத்துக்குத் தனிப் பகுதி இல்லை.',
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

const EVENTS = deepFreeze({
  order: ['GRIHA_PRAVESHA', 'OLD_HOUSE', 'UPANAYANA', 'TRAVEL', 'VIDYARAMBHA', 'EDUCATION', 'BUSINESS', 'MEDICINE', 'SURGERY', 'ROGA_SNANA', 'VEHICLE', 'VEHICLE_MAKE', 'NEW_CLOTHES', 'NEW_ORNAMENTS', 'ORNAMENT_MAKING', 'CLOTHES_WASHING', 'STITCHING'],
  GRIHA_PRAVESHA, OLD_HOUSE, UPANAYANA, TRAVEL, VIDYARAMBHA, EDUCATION, BUSINESS, MEDICINE, SURGERY, ROGA_SNANA, VEHICLE, VEHICLE_MAKE, NEW_CLOTHES, NEW_ORNAMENTS, ORNAMENT_MAKING, CLOTHES_WASHING, STITCHING,
});

module.exports = {
  EVENTS, DOORS, MONTH_TA, RANK, SOURCES, CODE_TA,
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
  }),
  AKSHARA_10, AKSHARA_LAGNAS, EDUCATION_16, MATRIKA_GOOD, SHOP_STARS, MEDICINE_13, SHARP_STARS, OLD_HOUSE_STARS, OLD_HOUSE_MONTHS, BATH_MC_18, BATH_KR_18, BATH_13,
  DHRUVA, MRIDU, bothPakshas, UPANAYANA_YEARS, SIXTEEN, ANADHYAYA, ANADHYAYA_MONTH, GALAGRAHA, YOGAS_SHRIDHAR, BENEFIC_PLANET_NAVS,
  DIRECTIONS, TITHI_DIR8, YOGINI_KP, GHATA, KAAL_SHOOLA, LALATIKA, TARA_1357,
};
