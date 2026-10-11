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

const RANK = deepFreeze({
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

const EVENTS = deepFreeze({ order: ['GRIHA_PRAVESHA'], GRIHA_PRAVESHA });

module.exports = { EVENTS, DOORS, MONTH_TA, RANK, SOURCES, CODE_TA, NOTES_TA, DHRUVA, MRIDU, bothPakshas };
