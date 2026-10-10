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

const RAMAN_BV = Object.freeze({
  title: 'Muhurtha (Electional Astrology)',
  author: 'B.V. Raman',
  file: 'muhurtha-raman/raw-scans/full-scan.pdf',
  tradition: 'Muhurta (modern English; retyped e-text, cited by chapter and PDF page)',
});

const BOOK_TA = Object.freeze({
  RAMAN: 'பி.வி. ராமன் (Muhurtha)',
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

// ---------------------------------------------------------------------------
// Tara bala (added 2026-10-10)
// ---------------------------------------------------------------------------

/**
 * Count from the birth star to the muhurta star (the birth star is the 1st),
 * divide by nine: the remainder is the tara (0 is the 9th). The 27 stars make
 * three rounds (paryaya) of nine.
 */
const TARA_NAMES_TA = Object.freeze(['ஜன்ம', 'சம்பத்', 'விபத்', 'க்ஷேம', 'ப்ரத்யக் (ப்ரத்யரி)', 'சாதக', 'வத (நைதன)', 'மைத்ர', 'பரம மைத்ர']);

const TARA_RANK = deepFreeze({
  order: ['WILHELM', 'SHRIDHAR', 'RAMAN', 'KALAPRAKASIKA', 'JOSHI', 'MUHURTA_CHINTAMANI', 'AGARWAL', 'KALYANRAMAN'],
  words: { WILHELM: 1374, SHRIDHAR: 1142, RAMAN: 656, KALAPRAKASIKA: 479, JOSHI: 344, MUHURTA_CHINTAMANI: 257, AGARWAL: 179, KALYANRAMAN: 134 },
  measureTa: 'தாரா பலம் பற்றிய பகுதியின் சொற்கள்: வில்ஹெல்ம் அத்.10 (பக்.89-93) 1,374; ஸ்ரீதர் §9.7 (பக்.223-228) 1,142; ராமன் அத்.III 656; காலப்பிரகாசிகை (பக்.166-167, 190) 479; ஜோஷி (பக்.12-13) 344; முகூர்த்த சிந்தாமணி கோசார ஸ்லோ.12-13 (பக்.108-109) 257; அகர்வால் (பக்.300-301) 179; கல்யாணராமன் (தொ.1 ப.139, தொ.2 ப.111) 134.',
});

/** Which taras are bad. The first is the default (Wilhelm, first by words). */
const TARA_BAD = deepFreeze({
  order: ['T1357', 'T357'],
  default: 'T1357',
  T1357: { set: [1, 3, 5, 7], labelTa: 'ஜன்ம, விபத், ப்ரத்யக், வத (1, 3, 5, 7)', booksTa: 'வில்ஹெல்ம், முகூர்த்த சிந்தாமணி ("1,3,5,7 inauspicious"), ராமன், அகர்வால்' },
  T357: { set: [3, 5, 7], labelTa: 'விபத், ப்ரத்யக், வத மட்டும் (3, 5, 7)', booksTa: 'ஸ்ரீதர் (1, 9 நடுத்தரம்), ஜோஷி, கல்யாணராமன்' },
});

/**
 * How the three rounds are treated. The quarter rule is Muhurta Chintamani's
 * own verse and the default; the others are each a book's.
 */
const TARA_CYCLES = deepFreeze({
  order: ['QUARTERS', 'THIRDS', 'FULL', 'GHATI'],
  default: 'QUARTERS',
  QUARTERS: {
    labelTa: 'சுற்றுவாரியாக — 2-ஆம் சுற்றில் ஒரு பாதம்',
    textTa: 'முதல் சுற்றில் (1-9) தீய தாரை முழுவதும் விலக்கு; இரண்டாம் சுற்றில் (10-18) விபத்தின் 1-ஆம் பாதம், ப்ரத்யக்கின் 4-ஆம் பாதம், வதத்தின் 3-ஆம் பாதம் மட்டும்; மூன்றாம் சுற்றில் (19-27) தீமை இல்லை. முகூர்த்த சிந்தாமணி கோசார ஸ்லோ.13 "द्वितीयेंऽशका नादिप्रान्त्यतृतीयका … सर्वे तृतीये", காலப்பிரகாசிகை, வில்ஹெல்ம், ராமன், கல்யாணராமன்; ஸ்ரீதர் KP-யின் வாசிப்பாக.',
    booksTa: 'முகூர்த்த சிந்தாமணி, வில்ஹெல்ம், ராமன், காலப்பிரகாசிகை, கல்யாணராமன்',
  },
  THIRDS: {
    labelTa: 'சுற்றுவாரியாக — 2-ஆம் சுற்றில் மூன்றில் ஒரு பகுதி',
    textTa: 'இரண்டாம் சுற்றில் விபத்தின் முதல் மூன்றில் ஒரு பகுதி, ப்ரத்யக்கின் கடைசி மூன்றில் ஒரு பகுதி, வதத்தின் நடு மூன்றில் ஒரு பகுதி மட்டும் விலக்கு; மூன்றாம் சுற்றில் தீமை இல்லை.',
    booksTa: 'ஸ்ரீதர், ஜோஷி',
  },
  FULL: {
    labelTa: 'எல்லாச் சுற்றிலும் முழுவதும்',
    textTa: 'ராமன்: "முக்கிய செயல்களுக்கு மூன்றாம் சுற்றிலும் விபத், நைதனத்தைத் தவிர்ப்பது நல்லது"; வில்ஹெல்ம்: "முக்கியமான, நீண்ட கால நிகழ்வுகளுக்குத் தீய தாரையை எப்போதும் தவிர்ப்பது நல்லது".',
    booksTa: 'ராமன், வில்ஹெல்ம் (அவர்களின் அறிவுரை)',
  },
  GHATI: {
    labelTa: 'அவசரத்தில் — முதல் நாழிகைகள் மட்டும்',
    textTa: 'நாள் மற்றபடி நன்றாக இருந்தால், ஜன்ம, விபத், ப்ரத்யக், நைதன நட்சத்திரங்களின் முதல் 7, 3, 8, 6 நாழிகைகள் மட்டும் விலக்கு (ராமன், அகர்வால்). நாழிகை = நட்சத்திரத்தின் 60-ல் ஒரு பங்கு — எங்கள் வாசிப்பு.',
    booksTa: 'ராமன், அகர்வால்',
    ghatis: { 1: 7, 3: 3, 5: 8, 7: 6 },
  },
});

/** The quarter (1-4) or third (0-2) of the star that is rejected in the second round, by tara. */
const SECOND_ROUND = deepFreeze({ quarter: { 3: 1, 5: 4, 7: 3 }, third: { 3: 0, 5: 2, 7: 1 } });

const TARA_SOURCES = Object.freeze({
  WILHELM: Object.freeze({ ...WILHELM_E, pageLocus: 'Chapter 10 "Tara and Chandra Avastha", printed pp.89-92 (PDF 97-100): "If the remainder is 2, 4, 6, 8 or 0, the Tara is favorable. If the remainder is 1, 3, 5 or 7, the Tara is unfavorable"; "In the 2nd Paryaya ... only the 1st Pada of the Vipat Nakshatra, the 4th Pada of the Pratyak Nakshatra, and the 3rd Pada of the Vadha Nakshatra must absolutely be avoided. In the 3rd Paryaya ... practically no adverse qualities"; "it is always best to avoid negative Tara, especially for important or long lasting events"; the list of exceptions' }),
  SHRIDHAR: Object.freeze({ ...SHRIDHAR_HEA, pageLocus: '§9.7 "Tara", printed pp.223-226 (PDF 267-270): "Best results ... 2nd, 4th, 6th & 8th Taras; Medium results — 1st & 9th; Worst results — 3rd, 5th & 7th"; "In the asterisms of the second triad, first 1/3rd part of Vipat Tara (12th), last 1/3rd part of Pratyara Tara (14th) & middle 1/3rd part of Vadha Tara (16th) ... be left out ... KP. commends that 1st quarter of Vipat (12th); 4th quarter of 14th (Pratyara) & 3rd quarter of 16th (Vadha) be avoided"; "As per Sage Narad, Tara is strong during D.H. while the Moon is strong during B.H."' }),
  MUHURTA_CHINTAMANI: Object.freeze({ ...MC_SHARMA, pageLocus: '"Gochara Prakarana", slokas 12-13, printed pp.108-109 (PDF 112-113): "मृत्यौ स्वर्णतिलान्विपद्यपि गुडं शाकं त्रिजन्मस्वथो दद्यात्प्रत्यरितारकासु लवणं सर्वो विपत्प्रत्यरिः । मृत्युश्चादिमपर्यये न शुभदोऽथैषां द्वितीयेंऽशका नादिप्रान्त्यतृतीयका अथ शुभाः सर्वे तृतीये स्मृताः"; note: "of these Taras, 1,3,5, and 7 are inauspicious and 2,4,6,8, and 9 are auspicious"' }),
  RAMAN: Object.freeze({ ...RAMAN_BV, pageLocus: 'Chapter III "The Birth Star and the Birth Moon", PDF pp.7-8: "In the Second Paryaya ... the evil is centred only in the first quarter of the 3rd (Vipat), the 4th quarter of the 5th (Pratyak) and the 3rd quarter of the 7th (Naidhana)"; "In my humble experience, it is better to avoid Vipat and Naidhana stars for all important undertakings ... even if such a star happens to fall in the 3rd-cycle"; "in the Janma, Vipat, Pratyak and Naidhana constellations, the first 7, 3, 8 and 6 ghatis respectively may be considered evil and avoided"' }),
  KALAPRAKASIKA: Object.freeze({ ...KALAPRAKASIKA, pageLocus: 'Chapter XXXIII, printed pp.166-167 (PDF 196-197) — "The 3rd, 5th and 7th asterisms (of the 2nd Pariyaya) ... the first quarter of the 3rd, the fourth quarter of the 5th and the third quarter of the 7th asterism should alone be avoided. The Third Pariyaya.— The asterisms of this Pariyaya, as such, have no adverse qualities"' }),
  JOSHI: Object.freeze({ ...JOSHI_KK, pageLocus: '"Tara", printed pp.12-13 (PDF 27-28): "Vipat, Pratyari and Vadha Taras are melefic for all purposes"; "In the second triad starting 1/3rd portion of Vipat; ending 1/3rd portion of Pratyari and middle 1/3rd portion of Vadha tara should be avoided. In the third triad Vipat, Pratyari and Vadha are fully benefic"; the donations' }),
  AGARWAL: Object.freeze({ ...AGARWAL_GS, pageLocus: 'printed pp.300-301 (PDF 299-300), "viii. Tarabala": "avoid a day that is ruled by the 1st, 3rd, 5th or 7th constellation ... only the negative parts of these constellations, viz. first 7, 3, 8 and 6 ghatis"; "in krishna paksha, nakshatra bala is to be given more weightage"' }),
  KALYANRAMAN: Object.freeze({ ...KALYANRAMAN_V1, pageLocus: 'printed p.139 (PDF 149): "Tara Suddhi means that the 3-5-7 nakshatras from the Janma Nakshatra are to be rejected"' }),
  KALYANRAMAN_2: Object.freeze({ ...KALYANRAMAN_V2, pageLocus: 'printed pp.110-111 (PDF 112-113), Upanayana: "the 3/5/7 nakshatras of the first cycle are to be rejected ... For the second cycle one has to reject only the amsakas i.e., 1st paada of Vipat; 4th paada of pratyara and the 3rd paada of Vadha. For the third cycle all the three can be accepted"' }),
});

const TARA_NOTES_TA = Object.freeze([
  'ஜன்மக் குழு: 1, 10, 19-ஆம் நட்சத்திரங்கள் (ஜன்ம, அனுஜன்ம, த்ரிஜன்ம). வில்ஹெல்ம்: பொதுவாக நல்லதல்ல, நண்பகலுக்குப் பின் ஜன்மத்தின் தீமை இல்லை; காலப்பிரகாசிகை: 10-வது ஜன்மத்தின் பாதி பலம், 19-வது அதன் பாதி. இங்கே 2, 3-ஆம் சுற்று ஜன்மம் "கவனம்" எனக் காட்டப்படுகிறது, விலக்கு அல்ல (எங்கள் வாசிப்பு).',
  'தீய தாரையில் செய்ய வேண்டி வந்தால் தானம் (முகூர்த்த சிந்தாமணி ஸ்லோ.13, ஜோஷி, ஸ்ரீதர்): வதத்துக்குப் பொன்னும் எள்ளும், விபத்துக்கு வெல்லம், ஜன்மக் குழுவுக்குக் காய்கறி, ப்ரத்யக்குக்கு உப்பு.',
  'விலக்குகள் (வில்ஹெல்ம், காலப்பிரகாசிகை ப.190): சந்திரன் முகூர்த்த லக்னத்துக்கு 9, 10-ல் நல்ல நிலையில் சுபர் பார்வையுடன்; சூரியன், குரு, சுக்கிரன் உபசயத்தில்; குரு அல்லது சுக்கிரன் லக்னத்தில் அல்லது பார்த்தால் — முகூர்த்த லக்னம் தேவை; இங்கே கணிக்கப்படவில்லை.',
  'பக்ஷம்: வளர்பிறையில் சந்திர பலம், தேய்பிறையில் தாரா பலம் அதிக முக்கியம் (ஜோஷி, அகர்வால் — வேதாங்க ஜோதிடம்; ஸ்ரீதர் — நாரதர்). ஜ்யோதிர்விதாபரணம்: தேய்பிறை 11 முதல் வளர்பிறை 4 வரை (9 நாள்) தாரா பலம் பார்க்க (ஸ்ரீதர்).',
]);

// ---------------------------------------------------------------------------
// Chandra bala (added 2026-10-10)
// ---------------------------------------------------------------------------

/**
 * The Moon's sign counted from the natal Moon's sign. Chandrashtama (the 8th)
 * is bad in every book; Wilhelm, who explains it most, names six kinds by the
 * tara, three of them harmless. For the other houses the books that give a list
 * are ordered by words, Joshi first.
 */
const CHANDRA_RANK = deepFreeze({
  order: ['WILHELM', 'JOSHI', 'RAMAN', 'MUHURTA_CHINTAMANI', 'RANGACHARYA', 'SHRIDHAR', 'AGARWAL', 'VASHISTHA', 'KALYANRAMAN'],
  words: { WILHELM: 345, JOSHI: 323, RAMAN: 158, MUHURTA_CHINTAMANI: 143, RANGACHARYA: 139, SHRIDHAR: 128, AGARWAL: 68, VASHISTHA: 47, KALYANRAMAN: 17 },
  measureTa: 'சந்திர பலம் பற்றிய பகுதியின் சொற்கள்: வில்ஹெல்ம் (சந்திராஷ்டமம் மட்டும், பக்.94-95) 345; ஜோஷி (பக்.44-45) 323; ராமன் 158; முகூர்த்த சிந்தாமணி (ப.30, 102, 152) 143; ரங்காச்சார்யா (ப.82) 139; ஸ்ரீதர் (பக்.218-220) 128; அகர்வால் 68; வசிஷ்டா (ப.106) 47; கல்யாணராமன் (ப.139) 17. வில்ஹெல்ம் 8-ஆம் இடத்தை மட்டும் சொல்வதால், வீடுகளின் பட்டியலுக்கு ஜோஷி முதல்.',
});

/** Wilhelm's six kinds of Chandrashtama, by the count from the birth star. */
const CHANDRASHTAMA_KINDS = deepFreeze({
  14: { ta: 'சுத்த — தொல்லை, அழிவு', harmless: false },
  15: { ta: 'சோபன — நன்மை', harmless: true },
  16: { ta: 'கைவர்த — நல்லதல்ல', harmless: false },
  17: { ta: 'அமல — சந்திராஷ்டமக் கறையை நீக்கும்', harmless: true },
  18: { ta: 'சித்த — வெற்றி', harmless: true },
  THIRD: { ta: 'க்ஷய (3-ஆம் சுற்று) — தொல்லை, அழிவு', harmless: false },
});

/** The Moon's vedha in its good houses (other planets but Mercury): Muhurta Chintamani p.102 = Joshi; the bright half's three, Joshi's. */
const MOON_VEDHA = deepFreeze({ 1: 5, 3: 9, 6: 12, 7: 2, 10: 4, 11: 8 });
const MOON_VEDHA_BRIGHT = deepFreeze({ 2: 6, 5: 4, 9: 8 });

const CHANDRA_READINGS = deepFreeze({
  order: ['GOOD_LIST', 'BAD_6_8_12', 'BAD_4_8', 'BAD_4_8_12'],
  default: 'GOOD_LIST',
  GOOD_LIST: {
    labelTa: '1, 3, 6, 7, 10, 11 (வளர்பிறையில் 2, 5, 9) — வேதை இல்லாமல்',
    textTa: 'சந்திரன் 1, 3, 6, 7, 10, 11-ல் நல்லது — 5, 9, 12, 2, 4, 8-ல் (புதன் தவிர) வேறு கிரகம் இருந்தால் வேதை; வளர்பிறையில் 2, 5, 9-ம் நல்லது — 6, 4, 8-ல் கிரகம் இல்லையெனில். மற்ற இடங்களில் சந்திர பலம் இல்லை.',
    booksTa: 'ஜோஷி, முகூர்த்த சிந்தாமணி (ப.102; ப.30-ல் 1 இல்லாமல்), ஸ்ரீதர் (வளர்பிறை 5-க்கு வேதை 12 — ஜோஷி 4)',
    good: [1, 3, 6, 7, 10, 11], goodBright: [2, 5, 9],
  },
  BAD_6_8_12: { labelTa: '6, 8, 12 தவிர', textTa: 'சந்திரன் ஜன்ம ராசிக்கு 6, 8, 12-ல் இருக்கக் கூடாது.', booksTa: 'ராமன், அகர்வால்', bad: [6, 8, 12] },
  BAD_4_8: { labelTa: '4, 8 தவிர (12 நடுத்தரம்)', textTa: 'சந்திரன் 1, 2, 3, 5, 6, 7, 9, 10, 11-ல் நல்லது; 4, 8-ல் தீயது; 12-ல் நடுத்தரம் (ரங்காச்சார்யா; திருமணம் முதலியவற்றுக்கு நல்லது), "பூஜ்ய" — பரிகாரத்துடன் (வசிஷ்டா).', booksTa: 'ரங்காச்சார்யா, வசிஷ்டா', bad: [4, 8] },
  BAD_4_8_12: { labelTa: '4, 8, 12 தவிர', textTa: 'சந்திரன் ஜன்ம ராசிக்கு 4, 8, 12-ல் இருக்கக் கூடாது.', booksTa: 'கல்யாணராமன், முகூர்த்த சிந்தாமணி (திருமண அட்டவணை ப.152: 3, 6, 7, 10, 11 நல்லது; 1, 2, 5, 9 சாந்திக்குப் பின்; 4, 8, 12 தீயது), ஜோஷி (மற்ற இடங்களில்)', bad: [4, 8, 12] },
});

const CHANDRA_SOURCES = Object.freeze({
  WILHELM: Object.freeze({ ...WILHELM_E, pageLocus: '"Chandra Ashtama", printed pp.94-95 (PDF 102-103): "For the Moon this place is the 8th Rasi ... There are six types of Chandra Ashtama: ... the 5th Nakshatra of the second Paryaya ... Suddha ... 6th ... Sobhana ... 7th ... Kaivarta ... 8th ... Amala ... 9th ... Siddha ... the third Paryaya ... Kshaya"; "if Tara is present, Chandra Ashtama is not harmful"; "If the lords of the natal Moon and the 8th from there are friends, Chandra Ashtama loses all capacity for ill"' }),
  JOSHI: Object.freeze({ ...JOSHI_KK, pageLocus: 'Chapter 4 "Transit of Planets", printed pp.44-45 (PDF 59-60): "Moon gives benefic results while transiting in 3/6/10/11/1/7 houses from natal moon provided no planet, except mercury, is placed in 9/12/4/8/5/2 houses respectively"; "In bright half Moon will give auspicious results even if it is transiting in 2/5/9 houses provided it is not suffering vedha from 6/4/8 houses"; "When moon is full ... more importance is given to Chandra Shuddhi ... near new-moon day more importance is given to Tara Shuddhi"; "In all muhurtas relating to pregnancy ... marriage, menstruation etc. the Chandra-bala of female should be seen"' }),
  RAMAN: Object.freeze({ ...RAMAN_BV, pageLocus: 'Chapter III, PDF p.7: "the Moon should not occupy in the election chart, a position that happens to represent the 6th, 8th or 12th from the person\'s Janma Rasi"; Chapter V, PDF p.12: "Chandrashtama shows no evil when the Moon is waxing and occupies a benefic sign and a benefic Navamsa, or when there is Tarabala. The sting is lost when the Moon and the 8th lord are friends"' }),
  MUHURTA_CHINTAMANI: Object.freeze({ ...MC_SHARMA, pageLocus: 'printed p.30 (PDF 34), note: "The moon is auspicious if she is in the 3/6/7/10/11 signs from the person\'s Janama Rashi ... and in the bright half of the month she is auspicious in the 2/5/9 signs"; p.102 (PDF 106): "The Moon is auspicious in 10/3/11/1/6/7 when there is no planet respectively in the 4/9/8/5/12/2 places"; p.152 (PDF 156), the Shuddhi table: Moon 3/6/7/10/11 auspicious, 1/2/5/9 auspicious after pacification, 4/8/12 inauspicious' }),
  RANGACHARYA: Object.freeze({ ...RANGACHARYA_I, pageLocus: 'printed p.82 (PDF 90): Moon — favourable 1,2,3,5,6,7,9,10,11; evil 4,8; mediocre 12; "for the marriage, upanayana, garbhadana, coronation ... and travel the 4th and the 8th signs ... much evil, and the moon in the 12th is considered benefic"' }),
  SHRIDHAR: Object.freeze({ ...SHRIDHAR_HEA, pageLocus: '§9.2, printed pp.218-219 (PDF 262-263): "The Moon gives benefic results in transit in 1,3,6,7,10 & 11th signs from J.R., provided there is no planet in 5,9,12,6,7,10 & 8th signs respectively except Mercury. In Bright Half, she is benefic while in 2,5,9 signs from J.R. provided there is no planet in 6,12 & 8 signs respectively"; p.220: the 12th acceptable for some acts' }),
  AGARWAL: Object.freeze({ ...AGARWAL_GS, pageLocus: 'printed p.300 (PDF 299), "vii. Chandrabala": "in shuklapaksha strength of Moon is to be given high weightage, while in krishna paksha, nakshatra bala ... Moon should not occupy ... the 6th, 8th or 12th from the person\'s Janma rasi"' }),
  VASHISTHA: Object.freeze({ ...VASHISTHA_KUSUM, pageLocus: 'printed p.106 (PDF 93), "16. Chandrabala": "Transit Moon in 1, 2, 3, 5, 6, 7, 9, 10 and 11 places from janmarashi (natal Moon) is good. Moon in the 12th house is pujya. In 4th and 8th house, it is bad"' }),
  KALYANRAMAN: Object.freeze({ ...KALYANRAMAN_V1, pageLocus: 'printed p.139 (PDF 149): "Chandra Suddhi means that the Moon must not be in 4-8-12 from natal Moon raasi"' }),
});

const CHANDRA_NOTES_TA = Object.freeze([
  'சந்திராஷ்டமம் (8-ஆம் இடம்) எல்லா வாசிப்பிலும் தீயது. வில்ஹெல்ம்: தாரா பலம் இருந்தால் (சோபன, அமல, சித்த) தீமை இல்லை. ராமன்: வளர்பிறைச் சந்திரன் சுப ராசி, சுப நவாம்சத்தில் இருந்தால், அல்லது தாரா பலம் இருந்தால் தீமை இல்லை; ராமன் — சந்திரனும் 8-ஆம் அதிபதியும் நண்பர்கள் என்றால்; வில்ஹெல்ம் — ஜன்ம ராசி அதிபதியும் 8-ஆம் அதிபதியும் நண்பர்கள் என்றால் (இங்கே BPHS இயற்கை நட்பு, இருவரும் — எங்கள் வாசிப்பு).',
  'யாருடைய சந்திர பலம்: திருமணம், கர்ப்பம் சார்ந்த சடங்குகளுக்குப் பெண்ணுடையது; மற்றவற்றுக்குச் செய்பவருடையது (ஜோஷி, முகூர்த்த சிந்தாமணி). இங்கே தேர்ந்தெடுத்த நபருக்கு.',
  'வேதை கணிக்கப்படுவது வீடு வாசிப்பான "1, 3, 6, 7, 10, 11"-க்கு மட்டும் (அதைச் சொல்லும் நூல்கள் அதைச் சேர்த்தே சொல்கின்றன). ஸ்ரீதரின் அச்சில் வேதை இடங்கள் ஆறுக்கு ஏழு எண்கள் — அச்சுப் பிழை; வளர்பிறை 5-க்கு அவர் 12, ஜோஷி 4 — ஜோஷியுடையது கணிக்கப்படுகிறது.',
]);

module.exports = {
  KICKS, KICKERS, LATTA_RANK, RAHU_DIRECTION, PADA_RULES, LATTA_SOURCES, LATTA_EFFECTS,
  PERSONAL_RANK, PERSONAL_CHECKS, VAINASHIKA, REMEDY_88, NOTES_TA, BOOK_TA,
  TARA_NAMES_TA, TARA_RANK, TARA_BAD, TARA_CYCLES, SECOND_ROUND, TARA_SOURCES, TARA_NOTES_TA,
  CHANDRA_RANK, CHANDRASHTAMA_KINDS, MOON_VEDHA, MOON_VEDHA_BRIGHT, CHANDRA_READINGS, CHANDRA_SOURCES, CHANDRA_NOTES_TA,
};
