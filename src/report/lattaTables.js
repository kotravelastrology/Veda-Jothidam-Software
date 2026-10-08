/**
 * Latta — the books' tables.
 *
 * A transiting planet "kicks" (latta) the star at a fixed count from the star
 * it occupies: the Sun the 12th, Mars the 3rd, Jupiter the 6th, Saturn the 8th
 * counted forward (puro-latta); the Moon the 22nd, Mercury the 7th, Venus the
 * 5th, Rahu the 9th counted backward (prishtha-latta). The star occupied is the
 * 1st. When the kicked star is the natal star, the books give an evil effect.
 *
 * The source is Phaladeepika XXVI.42-47; seven books are compared. All agree
 * on the counts except one: G.S. Kapoor's translation gives Rahu's latta as the
 * 8th, where the verse has "राहोस्तु नवमं" (9th). They differ on Ketu (counted
 * like Rahu by three books, named only in the effects by the verse) and, most,
 * on the effects. Order by words (owner's rule, 2026-10-03): Narasimha Rao 804,
 * Bhat 485, Raj Kumar 374, Gour 339, Kapoor 311, Pulippani 297, Sastri 224.
 */

const { SOURCES: { PULIPPANI } } = require('./saturnTransitTables');
const { BHAT, GOUR } = require('./saptashalakaTables');
const { SOURCES: { RAO, RAJ_KUMAR_CHARISMA } } = require('./moorthiTables');

const deepFreeze = (o) => {
  Object.values(o).forEach((v) => { if (v && typeof v === 'object') deepFreeze(v); });
  return Object.freeze(o);
};

// Unique names: the citation scanner resolves a spread by its constant's name
// across all of src, and gemstoneTables.js already has a KAPOOR (another book).
const PHALADEEPIKA_SASTRI = Object.freeze({
  title: 'Phaladeepika (V. Subrahmanya Sastri, 1950)',
  author: 'Mantreswara; V. Subrahmanya Sastri (translator), 2nd edition 1950',
  file: 'phaladeepika-subrahmanya-sastri-1950/raw-scans/full-scan.pdf',
  tradition: 'Classical Sanskrit (South Indian, c. 14th century) with an English translation',
});
const PHALADEEPIKA_KAPOOR = Object.freeze({
  title: 'Phala Deepika (G.S. Kapoor, e-text)',
  author: 'Mantreswara; G.S. Kapoor (translation, commentary and annotation)',
  file: 'phaladeepika-kapoor-etext/raw-scans/full-scan.pdf',
  tradition: 'Classical Sanskrit with a modern English translation (retyped e-text)',
});

// ---------------------------------------------------------------------------
// The counts — the same in every book but one cell
// ---------------------------------------------------------------------------

/** Count (the star occupied is the 1st) and direction (+1 forward, −1 backward). */
const KICKS = deepFreeze({
  Sun: { count: 12, dir: 1 },
  Mars: { count: 3, dir: 1 },
  Jupiter: { count: 6, dir: 1 },
  Saturn: { count: 8, dir: 1 },
  Moon: { count: 22, dir: -1 },
  Mercury: { count: 7, dir: -1 },
  Venus: { count: 5, dir: -1 },
  Rahu: { count: 9, dir: -1 },
  Ketu: { count: 9, dir: -1 },
});
/** The star (0-26) kicked by a planet in `star`, for a count and direction. */
const kickedStar = (star, count, dir) => (((star + dir * (count - 1)) % 27) + 27) % 27;
/** The star a planet must occupy to kick `target`. */
const kickerStar = (target, count, dir) => (((target - dir * (count - 1)) % 27) + 27) % 27;

/** Rahu's count: the verse's 9th, or Kapoor's 8th. Both are computed. */
const RAHU_READINGS = deepFreeze({
  NINTH: { count: 9, ta: '9-வது (ஸ்லோகம் "राहोस्तु नवमं"; சாஸ்திரி, ராவ், பட், ராஜ் குமார், கௌர், புலிப்பாணி)' },
  EIGHTH: { count: 8, ta: '8-வது (கபூர் மட்டும்)' },
});
const DEFAULT_RAHU = 'NINTH';

/** Which books count Ketu. */
const KETU = deepFreeze({
  counted: ['RAJ_KUMAR', 'GOUR', 'PULIPPANI'],
  effectOnly: ['SASTRI', 'BHAT'],
  absent: ['RAO', 'KAPOOR'],
  ta: 'கேது: ராஜ் குமார், கௌர், புலிப்பாணி ராகுவைப் போலவே 9-வது பின்னோக்கி என்கின்றனர். ஸ்லோகம் 42-44 எண்ணிக்கையை ராகுவுக்கு மட்டும் தருகிறது; ஸ்லோகம் 45 பலனில் "तमसोः" (இரட்டை எண் — ராகு, கேது இருவரும்) என்கிறது; பட்டும் பலனில் மட்டும் கேதுவைச் சொல்கிறார். ராவ், கபூர் கேதுவைச் சொல்லவில்லை. கேதுவின் லத்தை அந்த மூவரின் வாசிப்பாகக் கணிக்கப்படுகிறது.',
});

const COUNT_SOURCES = Object.freeze({
  SASTRI: Object.freeze({ ...PHALADEEPIKA_SASTRI, pageLocus: 'Adhyaya XXVI, slokas 42-44, printed pp.303-304 (PDF 338-339) — "The 12th asterism counted from that occupied by the Sun at the time, the 3rd from that of Mars, the 6th from that of Jupiter, and the 8th from that of Saturn are termed ... forward Lattas. The 5th star reckoned from that of Venus, the 7th from that of Mercury; the 9th from that of Rahu and the 22nd from that of the Moon are called ... rear Lattas"; the verse: "राहोस्तु नवमं चैव द्वाविंशं हिमद्युतेः"' }),
  KAPOOR: Object.freeze({ ...PHALADEEPIKA_KAPOOR, pageLocus: 'Chapter 26, slokas 42-44, e-text p.255 — "(c) the 8th from that occupied by Rahu"; notes p.256: "if the Sun should occupy ... Moola, his Latta nakshatra ... will be krittika ... Venus occupies Sravana, his Latta nakshatra ... will be Jyestha"' }),
  RAO: Object.freeze({ ...RAO, pageLocus: 'Section 26.7 "Latta (Kick)", printed pp.313-314 (PDF 319-320) — eight rules with an example each; Table 70, printed p.315 (PDF 321)' }),
  BHAT: Object.freeze({ ...BHAT, pageLocus: 'Chapter XXI, "Latta", printed pp.255-256 (PDF 273-274) — Purolatta: the Sun, Mars, Jupiter and Saturn; Prsthalatta: the Moon, Mercury, Venus and Rahu; an example for each' }),
  RAJ_KUMAR: Object.freeze({ ...RAJ_KUMAR_CHARISMA, pageLocus: 'Section 6.3 "Latta", PDF pp.263-265 — "for Rahu/ Ketu the 9th Nakshtra counted in backward direction"; examples for 01 Oct 2011' }),
  GOUR: Object.freeze({ ...GOUR, pageLocus: 'Chapter VIII, "The Lattas", printed pp.95-96 (PDF 98-99) — "for Rah and Ketu it is the 9th star"; Mars in Chitra on 10th October 2006 → Vishakha' }),
  PULIPPANI: Object.freeze({ ...PULIPPANI, pageLocus: '"Some More Links", section 2 "Results of Latta", printed pp.75-76 (PDF 86-87) — "The 9th star from that occupied by Rahu and Ketu"' }),
});

// ---------------------------------------------------------------------------
// The effects, book by book
// ---------------------------------------------------------------------------

/**
 * When the kicked star is the natal star. `null` where the book gives no
 * separate effect for the planet (then only its general effect applies).
 */
const EFFECTS = deepFreeze({
  RAO: {
    generalTa: 'ஜன்ம (அல்லது லக்ன) நட்சத்திரத்தை உதைக்கும் கிரகம் ஜாதகத்தில் எந்த வீடுகளுக்கு அதிபதியோ, எங்கு இருக்கிறதோ அந்த விஷயங்களில் சாதகமற்ற பலன். 6-ஆம் அதிபதி — வழக்கு, நோய், எதிரிகள்; 7-ஆம் அதிபதி — திருமணம், துணை, உறவுகள்; 10-ல் உள்ள முக்கியக் கிரகம் — தொழில். ஜன்ம நட்சத்திர லத்தை லக்ன நட்சத்திர லத்தையைவிட முக்கியம்.',
    byPlanet: {},
    multipleTa: null,
    sources: [Object.freeze({ ...RAO, pageLocus: 'Section 26.7, printed pp.313-315 (PDF 319-321) — "If a transit planet has latta on the constellation occupied by Moon (or lagna) in natal chart, then we may expect some unfavorable results related to the signification of the planet in natal chart"; Example 113 (5 Dec 1996)' })],
  },
  BHAT: {
    generalTa: 'நோயும் துக்கமும்.',
    byPlanet: {
      Sun: 'தன் உடைமைகள் அனைத்தும் இழப்பு', Moon: 'பெரும் இழப்பு', Mars: 'முழுமையான அழிவு',
      Mercury: 'வீழ்ச்சி, அழிவு', Jupiter: 'மரணம், உறவினர் அழிவு, பாதுகாப்பின்மை', Venus: 'சண்டை',
      Saturn: 'சூரியனுக்குச் சொன்னதே (உடைமை இழப்பு)', Rahu: 'துன்பம்', Ketu: 'துன்பம்',
    },
    multipleTa: 'இரண்டு அல்லது அதற்கு மேற்பட்ட கிரகங்களின் லத்தை சேர்ந்தால் தீமை பெரிதும் கூடும்.',
    sources: [COUNT_SOURCES.BHAT],
  },
  RAJ_KUMAR: {
    generalTa: 'மிகத் தீய பலன் — நோய், மனவேதனை.',
    byPlanet: {
      Sun: 'செல்வ இழப்பு அல்லது தொழில் நாசம்', Moon: 'மான இழப்பு அல்லது பெரும் அச்சம்',
      Mercury: 'பதவி, இடம் அல்லது செல்வ இழப்பு', Jupiter: 'உறவினர் நாசம், அச்சம், பாதுகாப்பின்மை',
      Venus: 'சண்டைகள் அல்லது முயற்சிகள் அழிதல்', Mars: 'மரணம் உட்பட எல்லா வகைத் துன்பமும்',
      Saturn: 'மரணம் உட்பட எல்லா வகைத் துன்பமும்', Rahu: 'மரணம் உட்பட எல்லா வகைத் துன்பமும்',
      Ketu: 'மரணம் உட்பட எல்லா வகைத் துன்பமும்',
    },
    multipleTa: null,
    sources: [Object.freeze({ ...RAJ_KUMAR_CHARISMA, pageLocus: 'Section 6.3, PDF p.265 — "As per Phaldeepika, chapter 26, sloka 42 to 47 ... i) The Sun: Loss of wealth or ruin of business ... vi) Mars, Saturn or Nodes: Unhappiness of all kinds including death"' })],
  },
  GOUR: {
    generalTa: 'நோயும் மனவேதனையும்.',
    byPlanet: {
      Sun: 'எல்லாத் தொழிலும் நாசம்', Rahu: 'துன்பம்', Ketu: 'துன்பம்', Jupiter: 'உறவினர் நாசம், பாதுகாப்பின்மை',
      Venus: 'சண்டைகள்', Mercury: 'பதவி இழப்பு', Moon: 'பெரும் இழப்பு',
    },
    multipleTa: 'இரண்டு அல்லது அதற்கு மேற்பட்ட லத்தைகள் ஜன்ம நட்சத்திரத்தைத் தாக்கினால், லத்தைகளின் எண்ணிக்கைக்கு நேர் விகிதத்தில் துன்பம் கூடும் (மந்த்ரேஸ்வரர் சொல்வதாக).',
    sources: [Object.freeze({ ...GOUR, pageLocus: 'Chapter VIII, "The Lattas", printed pp.95-96 (PDF 98-99) — "Whenever these Latta Nakshatras coincide with the natal star ... sickness and anguish result"; "Sun\'s Latta causes the ruin of every business; Rahu and Ketu spell misery ..."' })],
  },
  KAPOOR: {
    generalTa: 'நோயும் மனக்கவலையும்.',
    byPlanet: {
      Sun: 'ஒவ்வொரு முயற்சியிலும் பண இழப்பு', Rahu: 'துக்கம், மகிழ்ச்சியின்மை',
      Jupiter: 'ஜாதகருக்கு மரணம், உறவினர் அழிவு, அச்சம்', Venus: 'சண்டைகள்', Mercury: 'பதவி இழப்பு',
      Moon: 'மிகுந்த பண இழப்பு',
    },
    multipleTa: 'இரண்டு அல்லது அதற்கு மேற்பட்ட லத்தைகள் சேர்ந்தால் விளைவு இரண்டு, மூன்று மடங்கு; தீமை மட்டுமே எதிர்பார்க்கலாம்.',
    sources: [Object.freeze({ ...PHALADEEPIKA_KAPOOR, pageLocus: 'Chapter 26, slokas 45-47, e-text p.256 — "During the Sun\'s Latta there will be financial loss in every venture ..."' })],
  },
  PULIPPANI: {
    generalTa: 'இரண்டு திசையிலும் லத்தை ஜன்ம நட்சத்திரத்தில் விழுந்தால் நோயும் கவலைகளும்.',
    byPlanet: {
      Sun: 'தொழில் முழுவதும் நாசம்', Jupiter: 'மரணம், சில உறவினருக்குத் துன்பம், அச்சம், பாதுகாப்பின்மை',
      Rahu: 'எல்லா வகைச் சிரமங்களும்', Ketu: 'எல்லா வகைச் சிரமங்களும்', Venus: 'சண்டைகள்',
      Moon: 'அவமானம், மான இழப்பு', Mercury: 'அந்தஸ்து இழப்பு, தேவையற்ற நிகழ்வுகள்',
      Saturn: 'பல சிரமங்கள், உயிருக்கு ஆபத்தும்',
    },
    multipleTa: null,
    sources: [COUNT_SOURCES.PULIPPANI],
  },
  SASTRI: {
    generalTa: 'நோயும் மனவேதனையும் (ஸ்லோகம் 44: "जन्मभे व्यथा").',
    byPlanet: {
      Sun: 'எல்லாத் தொழிலும் நாசம்', Rahu: 'துன்பம்', Ketu: 'துன்பம்',
      Jupiter: 'மரணம், உறவினர் நாசம், பொதுவான அச்சம் / பாதுகாப்பின்மை', Venus: 'சண்டை',
      Mercury: 'பதவி இழப்பு அல்லது அது போன்ற தீய நிகழ்வு', Moon: 'பெரும் இழப்பு',
    },
    multipleTa: 'இரண்டு அல்லது அதற்கு மேற்பட்ட லத்தைகள் சேர்ந்தால் விளைவு இரண்டு, மூன்று மடங்கு; தீமை மட்டுமே சொல்ல வேண்டும் (ஸ்லோகம் 47).',
    sources: [
      Object.freeze({ ...PHALADEEPIKA_SASTRI, pageLocus: 'Adhyaya XXVI, slokas 45-46, printed p.304 (PDF 339) — "During the Sun\'s Latta there will be the ruin of every business. Misery will result during the Latta of Rahu and Ketu ..."' }),
      Object.freeze({ ...PHALADEEPIKA_SASTRI, pageLocus: 'Adhyaya XXVI, sloka 47, printed p.304 (PDF 339) — "When two or more Lattas synchronise, the cumulative effect will proportionately increase in intensity being twice or thrice"' }),
    ],
  },
});

const LATTA_RANK = deepFreeze({
  order: ['RAO', 'BHAT', 'RAJ_KUMAR', 'GOUR', 'KAPOOR', 'PULIPPANI', 'SASTRI'],
  words: { RAO: 804, BHAT: 485, RAJ_KUMAR: 374, GOUR: 339, KAPOOR: 311, PULIPPANI: 297, SASTRI: 224 },
  measureTa: 'லத்தா பகுதியின் சொற்கள்: நரசிம்ம ராவ் 804 (§26.7 பக்.313-315, பயிற்சி 45-ன் விடை ப.322); பட் 485 (பக்.255-256); ராஜ் குமார் 374 (Charisma of Planets §6.3); கௌர் 339 (பக்.95-96); கபூர் 311 (ஸ்லோகம் 42-47 உரையுடன்); புலிப்பாணி 297 (பக்.75-76); சாஸ்திரி 224 (பலதீபிகை XXVI.42-47 — மூல ஸ்லோகமும் மொழிபெயர்ப்பும்).',
});

const BOOK_TA = deepFreeze({
  RAO: 'நரசிம்ம ராவ்', BHAT: 'பட்', RAJ_KUMAR: 'ராஜ் குமார்', GOUR: 'கௌர்',
  KAPOOR: 'கபூர் (பலதீபிகை)', PULIPPANI: 'புலிப்பாணி', SASTRI: 'சாஸ்திரி (பலதீபிகை)',
});

/** The books' worked counts: [book, planet, star occupied, star kicked] (0-26). */
const WORKED_COUNTS = deepFreeze([
  ['KAPOOR', 'Sun', 18, 2], ['KAPOOR', 'Venus', 21, 17],
  ['BHAT', 'Sun', 11, 22], ['BHAT', 'Mars', 4, 6], ['BHAT', 'Jupiter', 18, 23], ['BHAT', 'Saturn', 19, 26],
  ['BHAT', 'Moon', 3, 9], ['BHAT', 'Mercury', 12, 6], ['BHAT', 'Venus', 13, 9], ['BHAT', 'Rahu', 10, 2],
  ['RAO', 'Sun', 4, 15], ['RAO', 'Mars', 4, 6], ['RAO', 'Jupiter', 2, 7], ['RAO', 'Saturn', 2, 9],
  ['RAO', 'Moon', 16, 22], ['RAO', 'Mercury', 6, 0], ['RAO', 'Venus', 4, 0], ['RAO', 'Rahu', 6, 25],
  ['RAJ_KUMAR', 'Sun', 12, 23], ['RAJ_KUMAR', 'Saturn', 13, 20], ['RAJ_KUMAR', 'Venus', 13, 9], ['RAJ_KUMAR', 'Rahu', 17, 9],
  ['GOUR', 'Mars', 13, 15], ['GOUR', 'Rahu', 11, 3],
  ['PULIPPANI', 'Sun', 13, 24], ['PULIPPANI', 'Mercury', 17, 11],
]);

// ---------------------------------------------------------------------------
// Where the books differ
// ---------------------------------------------------------------------------

const LATTA_DIFFERENCES = deepFreeze([
  {
    id: 'RAHU_EIGHTH',
    textTa: 'ராகுவின் லத்தை: ஸ்லோகம் (சாஸ்திரியின் பதிப்பில் "राहोस्तु नवमं") 9-வது; ராவ், பட், ராஜ் குமார், கௌர், புலிப்பாணி 9-வது; கபூரின் மொழிபெயர்ப்பு "8-வது" (கபூரின் சொற்களையே தரும் ஷிவ-விஷ்ணு மந்திர் "Reference Manual on Vedic Astrology" ப.27-லும் 8). இரண்டும் கணிக்கப்படுகின்றன; 9 இயல்பு.',
  },
  {
    id: 'KETU',
    textTa: 'கேது: ராஜ் குமார், கௌர், புலிப்பாணி எண்ணுகிறார்கள் (9-வது பின்னோக்கி); ஸ்லோகமும் பட்டும் பலனில் மட்டும்; ராவ், கபூர் இல்லை.',
  },
  {
    id: 'MARS_SATURN',
    textTa: 'செவ்வாய், சனி: ஸ்லோகம் 45-46 இருவருக்கும் தனிப் பலன் சொல்லவில்லை (பொதுப் பலன் — நோய், மனவேதனை — மட்டுமே); சாஸ்திரி, கபூர், கௌர் அப்படியே. பட்: செவ்வாய் "முழுமையான அழிவு", சனி "சூரியனுக்குச் சொன்னதே"; ராஜ் குமார்: இருவருக்கும் "மரணம் உட்பட எல்லா வகைத் துன்பமும்"; புலிப்பாணி: சனிக்கு "உயிருக்கு ஆபத்தும்", செவ்வாய்க்கு இல்லை.',
  },
  {
    id: 'MOON',
    textTa: 'சந்திரனின் லத்தை: ஸ்லோகம் "महाहानि" — சாஸ்திரி, பட், கௌர் "பெரும் இழப்பு"; கபூர் "மிகுந்த பண இழப்பு"; ராஜ் குமார் "மான இழப்பு அல்லது பெரும் அச்சம்"; புலிப்பாணி "அவமானம், மான இழப்பு".',
  },
  {
    id: 'JUPITER',
    textTa: 'குருவின் லத்தை: ஸ்லோகம் "मरणं" (மரணம்) — சாஸ்திரி, பட், கபூர், புலிப்பாணி மரணத்தைச் சொல்கின்றனர்; ராஜ் குமார், கௌர் "உறவினர் நாசம், அச்சம்" மட்டும்.',
  },
  {
    id: 'RAJ_KUMAR_ATTRIBUTION',
    textTa: 'ராஜ் குமார் தன் பட்டியலைப் "பலதீபிகை அத்.26 ஸ்லோகம் 42-47-ன்படி" என்கிறார்; ஆனால் சந்திரனுக்கும் செவ்வாய், சனி, ராகு-கேதுவுக்கும் அவர் தருவது ஸ்லோகத்தில் இல்லை.',
  },
  {
    id: 'RAO_LAGNA',
    textTa: 'ராவ் மட்டும் லக்ன நட்சத்திரத்தின் மீது விழும் லத்தையையும் பார்க்கிறார், பலனை உதைக்கும் கிரகத்தின் ஜாதக அதிபத்தியத்தைக் கொண்டு சொல்கிறார்; மற்றவர்கள் ஜன்ம நட்சத்திரம் மட்டும், கிரகத்துக்கு நிலையான பலன்.',
  },
  {
    id: 'GOUR_RAHU',
    textTa: 'கௌரின் உதாரணம் "ராகு உத்திரத்தில், லத்தை ரோகிணியில்" — எண்ணிக்கை சரி; ஆனால் அவரது செவ்வாய் உதாரணத்தின் நாளில் (10 அக்டோபர் 2006) உத்திரத்தில் இருந்தது கேது, ராகு பூரட்டாதியில்.',
  },
  {
    id: 'MULTIPLE',
    textTa: 'பல லத்தைகள் சேரும்போது: ஸ்லோகம் 47 (சாஸ்திரி, கபூர்) "இரண்டு, மூன்று மடங்கு"; பட் "பெரிதும் கூடும்"; கௌர் "எண்ணிக்கைக்கு நேர் விகிதம்"; ராவ், ராஜ் குமார், புலிப்பாணி சொல்லவில்லை.',
  },
]);

const OUR_READINGS_TA = deepFreeze([
  'எண்ணிக்கையில் கிரகம் இருக்கும் நட்சத்திரமே 1 — எல்லா நூல்களின் உதாரணங்களும் இப்படியே (சோதனை சரிபார்க்கிறது).',
  'லத்தை காலம் = உதைக்கும் நட்சத்திரத்தில் கிரகம் இருக்கும் முழுக் காலம்; கோசாரத்துக்குப் பாதம் பற்றி நூல்கள் எதுவும் சொல்லவில்லை.',
  'செவ்வாய், சனிக்கு — ஸ்லோகத்துக்குத் தனிப் பலன் இல்லாததால் — ஸ்லோகம் 44-ன் பொதுப் பலனே; மற்ற நூல்களின் சொற்கள் அவரவர் பெயரில் காட்டப்படுகின்றன.',
  'ராகு, கேது — திட்டத்தின் இயல்பான சராசரிக் கணு (mean node).',
  'லக்ன நட்சத்திரம் ராவின் வாசிப்புக்கு மட்டும்; பிறந்த நேரம் தெரியாவிட்டால் அது பொருளற்றது.',
]);

module.exports = {
  KICKS, kickedStar, kickerStar, RAHU_READINGS, DEFAULT_RAHU, KETU, COUNT_SOURCES, EFFECTS, LATTA_RANK, BOOK_TA,
  WORKED_COUNTS, LATTA_DIFFERENCES, OUR_READINGS_TA,
  SOURCES: { PHALADEEPIKA_SASTRI, PHALADEEPIKA_KAPOOR },
};
