/**
 * The star of a muhurta — the books' rules (added 2026-10-10).
 *
 * A muhurta's star is the one the Moon stands in. Two kinds of rule reject it:
 *
 *  - Latta, for anyone: a planet "kicks" the star at a fixed count from its
 *    own — the counts of the transit latta (Phaladeepika XXVI.42-44), applied
 *    here to the muhurta star (Muhurta Chintamani VI.56, the first of the ten
 *    evils of a marriage muhurta).
 *  - For the person: the birth star, the 88th and 108th padas from the birth
 *    pada, and the Vainashika star.
 *
 * Order by words (owner's rule, 2026-10-03), measured on each book's section:
 * Latta — Shridhar 893, Muhurta Chintamani 402, Rangacharya 250, Joshi 223,
 * Wilhelm 192, Kalyanraman 153, Agarwal 73, Vashistha 58; the person's checks —
 * Shridhar 181, Kalyanraman 148, Wilhelm 121, Kalaprakasika 85, Muhurta
 * Chintamani 59. Shridhar is first in both, so his choices are the defaults:
 * Rahu counted backward, the whole kicked star left, the 23rd as Vainashika.
 */

const { KALAPRAKASIKA } = require('./classicSources');
const { KICKS } = require('./lattaTables');

const deepFreeze = (o) => {
  Object.values(o).forEach((v) => { if (v && typeof v === 'object') deepFreeze(v); });
  return Object.freeze(o);
};

const SHRIDHAR_HEA = Object.freeze({
  title: 'Hindu Electional Astrology',
  author: 'V.K. Shridhar',
  file: 'hindu-electional-astrology-shridhar/raw-scans/full-scan.pdf',
  tradition: 'Muhurta compendium (modern English)',
});
const MC_SHARMA = Object.freeze({
  title: 'Muhurta Chintamani (Girish Chand Sharma)',
  author: 'Daivagya Acharya Shriram; Girish Chand Sharma (translation and notes)',
  file: 'muhurta-chintamani-girish-chand-sharma/raw-scans/full-scan.pdf',
  tradition: 'Classical Sanskrit muhurta text (16th century) with an English translation',
});
const KALYANRAMAN_V1 = Object.freeze({
  title: 'Muhoortha Sangraha, Vol. 1',
  author: 'V.S. Kalyanraman',
  file: 'muhoortha-sangraha-kalyanraman-vol1/raw-scans/full-scan.pdf',
  tradition: 'Muhurta (modern English, South Indian sources)',
});
const KALYANRAMAN_V2 = Object.freeze({
  title: 'Muhoortha Sangraha, Vol. 2',
  author: 'V.S. Kalyanraman',
  file: 'muhoortha-sangraha-kalyanraman-vol2/raw-scans/full-scan.pdf',
  tradition: 'Muhurta (modern English, South Indian sources)',
});
const JOSHI_KK = Object.freeze({
  title: 'Muhurta: Traditional & Modern',
  author: 'K.K. Joshi',
  file: 'muhurta-traditional-modern-joshi/raw-scans/full-scan.pdf',
  tradition: 'Muhurta (modern English)',
});
const VASHISTHA_KUSUM = Object.freeze({
  title: 'Muhurta Prakarana',
  author: 'Kusum Vashistha; Dr Lalita Gupta (English translation)',
  file: 'muhurta-prakarana-vashistha/raw-scans/full-scan.pdf',
  tradition: 'Muhurta (modern, translated)',
});
const RANGACHARYA_I = Object.freeze({
  title: 'Muhurtha Sindhu',
  author: 'Iranganti Rangacharya',
  file: 'muhurtha-sindhu-rangacharya/raw-scans/full-scan.pdf',
  tradition: 'Muhurta (modern English, South Indian sources)',
});
const AGARWAL_GS = Object.freeze({
  title: 'Practical Vedic Astrology',
  author: 'G.S. Agarwal',
  file: 'practical-vedic-astrology-agarwal/raw-scans/full-scan.pdf',
  tradition: 'Modern English textbook',
});
const WILHELM_E = Object.freeze({
  title: 'Classical Muhurta',
  author: 'Ernst Wilhelm',
  file: 'classical-muhurta-wilhelm/raw-scans/full-scan.pdf',
  tradition: 'Muhurta (modern English)',
});

const BOOK_TA = Object.freeze({
  SHRIDHAR: 'ஸ்ரீதர் (Hindu Electional Astrology)',
  MUHURTA_CHINTAMANI: 'முகூர்த்த சிந்தாமணி (கிரிஷ் சந்த் சர்மா)',
  RANGACHARYA: 'ரங்காச்சார்யா (முகூர்த்த சிந்து)',
  JOSHI: 'கே.கே. ஜோஷி',
  WILHELM: 'எர்ன்ஸ்ட் வில்ஹெல்ம்',
  KALYANRAMAN: 'கல்யாணராமன் (முகூர்த்த சங்கிரகம்)',
  AGARWAL: 'அகர்வால்',
  VASHISTHA: 'குசும் வசிஷ்டா',
  KALAPRAKASIKA: 'காலப்பிரகாசிகை',
});

// ---------------------------------------------------------------------------
// Latta
// ---------------------------------------------------------------------------

/**
 * The planets whose kick can fall on the muhurta star. The Moon's (the 22nd
 * backward) cannot: the muhurta star is the Moon's own. Ketu is in none of the
 * muhurta books' lists.
 */
const KICKERS = Object.freeze(['Sun', 'Mars', 'Jupiter', 'Saturn', 'Mercury', 'Venus', 'Rahu']);

const LATTA_RANK = deepFreeze({
  order: ['SHRIDHAR', 'MUHURTA_CHINTAMANI', 'RANGACHARYA', 'JOSHI', 'WILHELM', 'KALYANRAMAN', 'AGARWAL', 'VASHISTHA'],
  words: { SHRIDHAR: 893, MUHURTA_CHINTAMANI: 402, RANGACHARYA: 250, JOSHI: 223, WILHELM: 192, KALYANRAMAN: 153, AGARWAL: 73, VASHISTHA: 58 },
  measureTa: 'முகூர்த்த லத்தை பற்றிய பகுதியின் சொற்கள் (அட்டவணைப் பக்கங்கள் தவிர): ஸ்ரீதர் §8.10 (பக்.190-195) 893; முகூர்த்த சிந்தாமணி VI.56, 64 உரையுடன் (பக்.196-199) 402; ரங்காச்சார்யா (பக்.64-65) 250; ஜோஷி (ப.67) 223; வில்ஹெல்ம் (ப.265) 192; கல்யாணராமன் தொ.2 (ப.129) 153; அகர்வால் (ப.316) 73; வசிஷ்டா (பக்.109-110) 58.',
});

/** Rahu's 9th: backward with the verse, or forward because Rahu moves backward. */
const RAHU_DIRECTION = deepFreeze({
  order: ['BACKWARD', 'FORWARD'],
  default: 'BACKWARD',
  BACKWARD: {
    dir: -1,
    labelTa: 'பின்னோக்கி 9-வது',
    booksTa: 'முகூர்த்த சிந்தாமணி ஸ்லோகம் VI.56 ("ज्ञराहुपूर्णेन्दुसिताः स्वपृष्ठे"), ஸ்ரீதர் (அட்டவணை 8.7: முன்னோக்கி எண்ணினால் 20-வது), கல்யாணராமன், ஜோஷி, வசிஷ்டா, வில்ஹெல்ம்; ரங்காச்சார்யாவின் உதாரணமும்',
  },
  FORWARD: {
    dir: 1,
    labelTa: 'முன்னோக்கி 9-வது',
    booksTa: 'முகூர்த்த சிந்தாமணி உரை (ராகு எப்போதும் பின்னோக்கிச் செல்வதால் அதன் "பின்" முன்னே), அகர்வால், ரங்காச்சார்யாவின் விதி வாக்கியம் ("direct count") — ஆனால் அவரது அட்டவணையும் உதாரணமும் பின்னோக்கியே',
  },
});

/** Which quarter of the kicked star is rejected. Each is shown; the first is the default. */
const PADA_RULES = deepFreeze({
  order: ['WHOLE', 'SAME_QUARTER', 'JV_QUARTER'],
  default: 'WHOLE',
  WHOLE: {
    labelTa: 'முழு நட்சத்திரம்',
    textTa: 'உதைக்கப்பட்ட நட்சத்திரம் முழுவதும் விலக்கு (முகூர்த்த சிந்தாமணி VI.56). ஸ்ரீதர்: "அவசரத்தில் மட்டும் குறிப்பிட்ட பாதத்தைக் கணக்கில் கொள்ளலாம்; இல்லையேல் முழு நட்சத்திரத்தையும் விடுக".',
  },
  SAME_QUARTER: {
    labelTa: 'உதைக்கும் கிரகத்தின் பாத எண் உள்ள பாதம் மட்டும்',
    textTa: 'முகூர்த்த சிந்தாமணி VI.64 "पातोपग्रहलत्तासु नेष्टोऽङ्घ्रिः खेटपत्समः" — உதைக்கும் கிரகம் தன் நட்சத்திரத்தில் நிற்கும் பாதத்தின் எண்ணுள்ள பாதமே கெட்டது. வில்ஹெல்ம், ரங்காச்சார்யா அதையே; ஜோஷி, அகர்வால்: "பாதத்துக்குப் பாதம் உதை அதிகக் கேடு".',
  },
  JV_QUARTER: {
    labelTa: 'முன் உதைக்கு 1-ஆம் பாதம், பின் உதைக்கு 4-ஆம் பாதம்',
    textTa: 'ஜ்யோதிர்விதாபரணம் (ஸ்ரீதர் மேற்கோள்): சூரியன், செவ்வாய், குரு, சனி உதைக்கப்பட்ட நட்சத்திரத்தின் முதல் பாதத்தையும், புதன், சுக்கிரன், ராகு (சந்திரன்) கடைசிப் பாதத்தையும் மட்டுமே உதைக்கும்; பாபர் உதைத்த நட்சத்திரத்தை முழுவதும் விடுக, சுபர் உதைத்ததில் அந்தப் பாதத்தை மட்டும்.',
  },
});

const LATTA_SOURCES = Object.freeze({
  SHRIDHAR: Object.freeze({ ...SHRIDHAR_HEA, pageLocus: '§8.10 "Latta Dosha", printed pp.190-191 (PDF 234-235): "The Sun, Mars, Jupiter & Saturn give forward kick to 12th, 3rd, 6th, & 8th constellations ... while the Moon, Mercury, Venus & Rahu like wise kick 22nd, 7th, 5th, & 9th constellations, but in the backward direction. Abhijit is excluded in the counting"; Table 8.7 (Rahu 20th counted forward); "As per M.P. the Moon gives Latta only when it is full Moon"' }),
  SHRIDHAR_PADAS: Object.freeze({ ...SHRIDHAR_HEA, pageLocus: 'printed pp.194-195 (PDF 238-239): "J.V. further distinguishes Padas ... the Sun, Mars, Jupiter & Saturn kick only first Pada ... the Moon, Mercury, Venus & Rahu kick only last Pada"; "Aspirants may consider specific Pada of the kicked asterism only in urgency, otherwise full constellation should be left"; "Paata, Latta, Upgraha, & Ekargal Doshas are considered only for that stellar quarter in which the planet causing the Dosha is present"' }),
  MUHURTA_CHINTAMANI: Object.freeze({ ...MC_SHARMA, pageLocus: 'Chapter VI, sloka 56, printed p.196 (PDF 200): "ज्ञराहुपूर्णेन्दुसिताः स्वपृष्ठे भं सप्तगोजातिशरैर्मितं हि । संलत्तयन्त्यर्कशनीज्यभौमाः सूर्याष्टतर्काग्निमितं पुरस्तात्"; "Mercury, Rahu, Full Moon and Venus ... (if counted backwards) the 7th, the 9th, the 22nd and the 5th ... the Sun, Saturn, Jupiter and Mars ... (if counted in the right order) the 12th, the 8th, the 6th and the 3rd"; note: "the 9th Nakshtra from Ashwini in the regular order of counting will be the Latta causing Nakshtra" for Rahu' }),
  MUHURTA_CHINTAMANI_64: Object.freeze({ ...MC_SHARMA, pageLocus: 'Chapter VI, sloka 64, printed p.199 (PDF 203): "पातोपग्रहलत्तासु नेष्टोऽङ्घ्रिः खेटपत्समः"; "in the Latta Dosha or Defect, there is the Dosha only in that Quarter of a Nakshtra in which the Planet which has caused the Dosha or Defect is situated"' }),
  RANGACHARYA: Object.freeze({ ...RANGACHARYA_I, pageLocus: 'printed pp.64-65 (PDF 72-73): "the 9th nakshatra by the direct count from the nakshatra occupied by Rahu"; "from the marriage nakshatra ... the 9th nakshatras of ... Rahu"; "if Swati is the marriage nakshatra ... Dhanishtta of ... Rahu"; "The patha, upagraha and Latta need not be considered evil if the nakshatra padas differ in each"' }),
  JOSHI: Object.freeze({ ...JOSHI_KK, pageLocus: 'Stage 1, (i) Latta, printed p.67 (PDF 82): Table 6.1 (Rahu 9th, backward); "The malefic effects will be more if the planet kicking and planet kicked (moon) are in the same quarter"' }),
  WILHELM: Object.freeze({ ...WILHELM_E, pageLocus: 'Latta Dosha, printed p.265 (PDF 273): "Rahu the 9th" counted in the reverse; "The Moon is only significantly kicked when it is in the same Nakshatra Pada as is the kicking planet"' }),
  KALYANRAMAN: Object.freeze({ ...KALYANRAMAN_V2, pageLocus: 'printed p.129 (PDF 131), Seegrabhodam: "for the rest the count has to be done backwards ... Raahu - 9th backwards"; the table: Raahu in Poorvaphalguni, B9, Krittika' }),
  AGARWAL: Object.freeze({ ...AGARWAL_GS, pageLocus: 'printed p.316 (PDF 315): "Rahu, Sun, Saturn, Jupiter and Mars hit 9th, 12th, 8th, 6th and 3rd nakshatra forwards"; "Pada to pada kick is more malefic. (Rahu kicks backwards but because it is retrograde, its backward kick means towards forward)"' }),
  VASHISTHA: Object.freeze({ ...VASHISTHA_KUSUM, pageLocus: 'printed pp.109-110 (PDF 96-97): "(i) Latta: It means to kick ... Moon kicks 22 nakshatras behind ... and Rahu 9 nakshatras behind"' }),
});

/** The effect of a kick on the muhurta star, by book (the books' words; Ketu absent). */
const LATTA_EFFECTS = deepFreeze({
  SHRIDHAR: {
    labelTa: 'ஸ்ரீதர், அட்டவணை 8.7 — பொதுவாக / திருமணத்தில்',
    byPlanet: {
      Sun: 'செல்வ இழப்பு / செல்வ இழப்பு', Moon: 'அச்சம், எல்லா இழப்பும் / பெண்ணுக்கு இழப்பு', Mars: 'மரணம் / தம்பதியருக்கு இழப்பு',
      Mercury: 'அழிவு / பெண்ணுக்கு இழப்பு', Jupiter: 'உறவினர் இழப்பு / உறவினர் இழப்பு', Venus: 'செயல் தோல்வி, வலி / வலி, தொல்லை',
      Saturn: 'குடும்பத்தில் இழப்பு / குடும்பத்தில் இழப்பு', Rahu: 'மரணம் / பெண்ணுக்கு இழப்பு',
    },
    source: Object.freeze({ ...SHRIDHAR_HEA, pageLocus: 'Table 8.7 "Latta by planets", printed p.191 (PDF 235): "Result in General" and "Results in Marriage"' }),
  },
  MUHURTA_CHINTAMANI: {
    labelTa: 'முகூர்த்த சிந்தாமணி',
    byPlanet: {
      Sun: 'பண இழப்பு', Moon: 'முழு அழிவு', Mars: 'மரணம்', Mercury: 'அழிவு', Jupiter: 'உறவினர் அழிவு',
      Venus: 'செயல் இழப்பு', Saturn: 'குடும்ப அழிவு', Rahu: 'மரணம்',
    },
    source: Object.freeze({ ...MC_SHARMA, pageLocus: 'printed p.197 (PDF 201): "Caused by the Sun - Loss of Money ... by Rahu - Death"' }),
  },
  JOSHI: {
    labelTa: 'ஜோஷி, அட்டவணை 6.1',
    byPlanet: {
      Sun: 'செல்வ இழப்பு', Moon: 'அச்சம்', Mars: 'மரணம்', Mercury: 'அச்சம்', Jupiter: 'உறவினர் இழப்பு',
      Venus: 'செயலில் தோல்வி', Saturn: 'குடும்ப இழப்பு', Rahu: 'மரணம்',
    },
    source: Object.freeze({ ...JOSHI_KK, pageLocus: 'Table 6.1 "Latta Dosha", printed p.67 (PDF 82), row "Results"' }),
  },
  WILHELM: {
    labelTa: 'வில்ஹெல்ம்',
    byPlanet: {
      Sun: 'செல்வ இழப்பு', Moon: 'முழு அழிவு', Mars: 'மரணம்', Mercury: 'அச்சமும் கவலையும்', Jupiter: 'உறவினர் அழிவு',
      Venus: 'வேலையில் தோல்வி', Saturn: 'குடும்ப அழிவு', Rahu: 'மரணம்',
    },
    source: Object.freeze({ ...WILHELM_E, pageLocus: 'Latta Dosha, printed p.265 (PDF 273): "If the Nakshatra is kicked by the Sun there will be loss of wealth ... by Rahu there will be death"' }),
  },
  KALYANRAMAN: {
    labelTa: 'கல்யாணராமன் (சீக்ரபோதம்)',
    byPlanet: {
      Sun: 'செல்வ இழப்பு', Moon: 'அச்சம்', Mars: 'மரணம்', Mercury: 'அச்சம்', Jupiter: 'உறவினர் இழப்பு',
      Venus: 'அழிவு', Saturn: 'குல அழிவு', Rahu: 'துக்கம்',
    },
    source: Object.freeze({ ...KALYANRAMAN_V2, pageLocus: 'printed p.129 (PDF 131), the table\'s "Result" column' }),
  },
});

// ---------------------------------------------------------------------------
// The person's checks
// ---------------------------------------------------------------------------

const PERSONAL_RANK = deepFreeze({
  order: ['SHRIDHAR', 'KALYANRAMAN', 'WILHELM', 'KALAPRAKASIKA', 'MUHURTA_CHINTAMANI'],
  words: { SHRIDHAR: 181, KALYANRAMAN: 148, WILHELM: 121, KALAPRAKASIKA: 85, MUHURTA_CHINTAMANI: 59 },
  measureTa: 'ஜன்ம நட்சத்திரம், 88/108-வது பாதம், வைநாசிகம் பற்றிய பகுதிகளின் சொற்கள்: ஸ்ரீதர் (ப.105, 227) 181; கல்யாணராமன் (தொ.1 ப.126, 139; தொ.2 ப.111) 148; வில்ஹெல்ம் (பக்.93-94) 121; காலப்பிரகாசிகை (ப.40, 167, 190) 85; முகூர்த்த சிந்தாமணி உரை (ப.78) 59.',
});

const PERSONAL_CHECKS = deepFreeze({
  JANMA: {
    labelTa: 'ஜன்ம நட்சத்திரம்',
    textTa: 'பிறந்த நட்சத்திரமும் அதன் பாதமும் அவருக்கான எந்தச் செயலுக்கும் விலக்கு (கல்யாணராமன்). வில்ஹெல்ம்: பொதுவாக நல்லதல்ல; நண்பகலுக்குப் பின் அதன் தீமை இல்லை; சில செயல்களுக்கு விதிவிலக்கு.',
    sources: [
      Object.freeze({ ...KALYANRAMAN_V1, pageLocus: 'Kartru doshas, "1. Janmanakshatra dosha", printed p.126 (PDF 136): "(a) The Nakshatra and its paada in which a person is born (Janma nakshatra) must be avoided for the conduct of any function by him or her"' }),
      Object.freeze({ ...WILHELM_E, pageLocus: '"Janma, Anujanma & Trijanma Nakshatras", printed p.93 (PDF 101): "It is generally not favorable for the Moon at the time of Muhurta to be in these Nakshatras ... The ill effects of the Janma Nakshatras do not prevail after midday"' }),
    ],
  },
  PADA_88: {
    count: 88,
    labelTa: '88-வது பாதம்',
    textTa: 'பிறந்த பாதத்தை 1 என எண்ணி 88-வது பாதம் — எல்லா நூல்களும் விலக்கச் சொல்கின்றன. லக்னாதிபதியும் 10-ஆம் அதிபதியும் நண்பர்கள் என்றால் அதன் தீமை நீங்கும் (காலப்பிரகாசிகை, வில்ஹெல்ம், ஸ்ரீதர்).',
    sources: [
      Object.freeze({ ...SHRIDHAR_HEA, pageLocus: '§4.16, printed p.105 (PDF 150): "88th stellar quarter from that at the birth is also inauspicious" (K.P. 33/10); p.227 (PDF 271): the remedy, K.P. 34/7' }),
      Object.freeze({ ...KALYANRAMAN_V1, pageLocus: 'printed p.126 (PDF 136): "(b) The 108th and the 88th paada of the Janma nakshatra are to be rejected as these are vainaasikapaadas. For example if the person ... is born in the 1st paada of Aswini, Revati 4th paada becomes its 108th paada and Sravana 4th paada its 88th paada"' }),
      Object.freeze({ ...WILHELM_E, pageLocus: '"The 88th Nakshatra Pada", printed p.94 (PDF 102): "should always be avoided, no matter the Janma Nakshatra. Exception: If the Lagna and 10th lords are friends, the adverse effects of the 88th Pada are said to vanish"' }),
      Object.freeze({ ...KALAPRAKASIKA, pageLocus: 'printed p.167 (PDF 197) — "The 88th Naksathra-Padha (stellar quarter) from that at birth is also inauspicious"; printed p.40 (PDF 70), tonsure — "The 88th quarter from that of the asterism at birth should be avoided"' }),
    ],
  },
  PADA_108: {
    count: 108,
    labelTa: '108-வது பாதம்',
    textTa: '108-வது பாதம் (பிறந்த பாதத்துக்கு முந்தையது) — கல்யாணராமன் மட்டும், 88-வதுடன் சேர்த்து "வைநாசிக பாதங்கள்".',
    sources: [Object.freeze({ ...KALYANRAMAN_V1, pageLocus: 'printed p.126 (PDF 136): "The 108th and the 88th paada of the Janma nakshatra are to be rejected as these are vainaasikapaadas"' })],
  },
});

/** Vainashika: three readings, all computed; the first is the default. */
const VAINASHIKA = deepFreeze({
  order: ['STAR_23', 'STAR_22', 'PADA88_STAR'],
  default: 'STAR_23',
  STAR_23: {
    count: 23,
    labelTa: '23-வது நட்சத்திரம்',
    textTa: 'ஸ்ரீதர்: "பெரும்பாலோர் 23-வதையே வைநாசிகமாகக் கொள்கின்றனர்"; நாரதர்; முகூர்த்த சிந்தாமணிக்கு கோவிந்தரின் உரை ("23rd, Vinasha"); கல்யாணராமன் தொ.2 ("23rd Vinaasana"); ஜாதக பாரிஜாதம் IX.79 (/gochara-vedha சப்தசலாகை).',
    sources: [
      Object.freeze({ ...SHRIDHAR_HEA, pageLocus: '§4.16 "Vinashika Nakshatra", printed p.105 (PDF 150): "There are different opinions ... whether it is 23rd or 22nd ... Majority opines that 23rd should be considred as Vinashika nakshatra"; p.227 (PDF 271): "According to Sage Narad, 23rd Tara is Vinashika"' }),
      Object.freeze({ ...MC_SHARMA, pageLocus: 'printed p.78 (PDF 82), Govinda\'s commentary: "the 18th, \'Samudaya Nakshtra\'; the 23rd, \'Vinasha Nakshtra\'; and the 25th, \'Manasa Nakshtra\'"' }),
    ],
  },
  STAR_22: {
    count: 22,
    labelTa: '22-வது நட்சத்திரம்',
    textTa: 'காலப்பிரகாசிகை: 22-வது "அழிவைக் காட்டும், விலக்குக". வில்ஹெல்ம்: 22-வது; ஆனால் ஜன்ம நட்சத்திரம் ரோகிணி, பூசம், மகம், உத்திரம், ஹஸ்தம், சித்திரை, அனுஷம், பூரட்டாதி, உத்திரட்டாதி, ரேவதி என்றால் கேடில்லை.',
    wilhelmExempt: [3, 7, 9, 11, 12, 13, 16, 24, 25, 26],
    sources: [
      Object.freeze({ ...KALAPRAKASIKA, pageLocus: 'printed p.167 (PDF 197): "Vainasika — This word denotes the quality of the 22nd asterism from the Jenma-Nakshathra. It indicates ruin and should, therefore, be avoided"' }),
      Object.freeze({ ...WILHELM_E, pageLocus: '"Vainasika", printed pp.93-94 (PDF 101-102): "The 22nd Nakshatra from the Janma Nakshatra ... is known as Vainasika ... Exception: ... if the Janma Nakshatra is Rohini, Pushya, Magha, Uttaraphalguni, Hasta, Chitta, Anuradha, Purvabhadrapada, Uttarabhadrapada or Revati, Vainasika is not problematic"' }),
    ],
  },
  PADA88_STAR: {
    labelTa: '88-வது பாதம் உள்ள நட்சத்திரம்',
    textTa: 'கல்யாணராமன்: "வைநாசிக நட்சத்திரம் ஜன்ம பாதத்திலிருந்து 88-வது பாதம் உள்ள நட்சத்திரம்" — முதல் பாதப் பிறப்புக்கு 22-வது, மற்ற பாதங்களுக்கு 23-வது; அந்தப் பாதமே விலக்கு, "சிலர் நட்சத்திரம் முழுவதையும் விலக்குவர்".',
    sources: [
      Object.freeze({ ...KALYANRAMAN_V1, pageLocus: 'printed p.139 (PDF 149): "Vainaasika nakshatra is the 88th paada nakshatra from the Janma Nakshatra"' }),
      Object.freeze({ ...KALYANRAMAN_V2, pageLocus: 'printed p.111 (PDF 113): "Vainaasiaka Nakshatra is the 88th paada nakshatra counted from the Janma nakshatra paada. This paada has to be rejected for all auspicious deeds. Some hold that the entire nakshatra has to be rejected"; the same page lists "the 23rd - Vinaasana"' }),
    ],
  },
});

/** Kalaprakasika's remedy for the 88th pada, computed for the hours of that pada. */
const REMEDY_88 = deepFreeze({
  textTa: 'லக்னாதிபதியும் 10-ஆம் வீட்டு அதிபதியும் நண்பர்கள் என்றால் 88-வது பாதத்தின் தீமை நீங்கும்.',
  readingTa: '"நண்பர்கள்" = BPHS இயற்கை நட்பு, இருவரும் ஒருவருக்கொருவர் நண்பர், அல்லது இரண்டு வீட்டுக்கும் ஒரே அதிபதி (எங்கள் வாசிப்பு). லக்னம் பிறந்த ஊருக்குக் கணக்கிடப்படுகிறது — செயல் நடக்கும் ஊர் வேறு என்றால் நேரங்கள் சற்று மாறும்.',
  sources: [
    Object.freeze({ ...KALAPRAKASIKA, pageLocus: 'printed p.190 (PDF 220) — "If the lord of the rising sign and that of the 10th house be friends, the adverse effects produced by the 88th stellar quarter (in the 22nd asterism) from that of the Jenma-Nakshathra will vanish"' }),
  ],
});

const NOTES_TA = Object.freeze([
  'முகூர்த்த நட்சத்திரம் = அந்த நேரத்தில் சந்திரன் நிற்கும் நட்சத்திரம். உதைக்கும் கிரகத்தின் நட்சத்திரமும் அதே நேரத்தில். அபிஜித் எண்ணிக்கையில் இல்லை (ஸ்ரீதர்).',
  'சந்திரனின் உதை (22-வது பின்னோக்கி; சில நூல்களில் பௌர்ணமி சந்திரனுக்கு மட்டும்) முகூர்த்த நட்சத்திரத்தின் மேல் விழ முடியாது — அது சந்திரனின் சொந்த நட்சத்திரம். ஸ்ரீதர் அதை முகூர்த்த லக்னத்தின் நட்சத்திரத்துக்குப் பொருத்தலாம் என்று ஊகிக்கிறார்; அது கணிக்கப்படவில்லை.',
  'கேது முகூர்த்த நூல்களின் லத்தைப் பட்டியலில் இல்லை.',
  'லத்தை எந்தப் பகுதியில் பொருந்தும் என்பதிலும் நூல்கள் வேறுபடுகின்றன (ஸ்ரீதர்: முகூர்த்த சிந்தாமணி — சௌராஷ்டிரம், சால்வம்; முகூர்த்த மார்த்தாண்டம் — மாளவம்); இங்கே எல்லா இடத்துக்கும் காட்டப்படுகிறது.',
  'இவை நூல்களின் விதிகள். முகூர்த்தம் பார்க்கத் திதி, வாரம், யோகம், கரணம், லக்ன சுத்தி, தாரா பலம், சந்திர பலம் முதலிய மற்றவையும் தேவை — இந்தப் பக்கம் அவற்றைக் கணிக்கவில்லை.',
]);

module.exports = {
  KICKS, KICKERS, LATTA_RANK, RAHU_DIRECTION, PADA_RULES, LATTA_SOURCES, LATTA_EFFECTS,
  PERSONAL_RANK, PERSONAL_CHECKS, VAINASHIKA, REMEDY_88, NOTES_TA, BOOK_TA,
};
