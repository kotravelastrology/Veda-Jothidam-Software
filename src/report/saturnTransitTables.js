/**
 * Saturn-transit definitions — Sade Sati, Dhaiya (Ardhashtama / Ashtama) and
 * Kantaka Saturn — and where each one comes from.
 *
 * ## Why this is a table and not a calculation
 *
 * *Where Saturn is* is astronomy and is computed (`saturnTransit.js`). *Which
 * houses from the Moon carry which name* is doctrine, and it is a table read
 * from a page. Nothing here is derived; every entry was read from a rendered
 * page image on 2026-09-30, not from OCR. The tables are embedded in this file
 * rather than loaded from JSON because Next's bundler replaces `__dirname`
 * (see `poruthamTables.js`); `fixtures/saturn-transit/definitions.json` is the
 * transcription record and `test-saturn-transit.js` asserts the two agree.
 *
 * ## What the books agree on, and what they do not
 *
 *   Sade Sati   Saturn in the 12th, 1st and 2nd from the natal Moon sign.
 *               Every source agrees.
 *   Ardhashtama Saturn in the 4th. Vishnu Bhaskar, Pulippani.
 *   Ashtama     Saturn in the 8th. Vishnu Bhaskar, Pulippani, Shubhakaran.
 *   Kantaka     **The sources disagree.** Parashara's Light and Pulippani's
 *               detailed chapter name the 4th and 7th; Vishnu Bhaskar the 4th,
 *               7th and 10th; Rath the 1st, 8th and 10th; Pulippani's own
 *               introduction the 8th. Only the 4th and 7th are named by three
 *               of the four. The default was that pair until 2026-10-03, when
 *               the owner set the rule "the book with the most explanation
 *               first": it is now Pulippani's (4, 7, 8), whose Kantaka text is
 *               the longest by far (`KANTAKA_RANK`). Neither is a finding
 *               about which is right.
 *
 * Kantaka is therefore a *selectable, labelled convention*, never a silent
 * choice. The same holds for the sign-wise arishta table, whose printed wording
 * is ambiguous in five rows (recorded below, with our reading).
 */

const deepFreeze = (o) => {
  Object.values(o).forEach((v) => { if (v && typeof v === 'object') deepFreeze(v); });
  return Object.freeze(o);
};

/**
 * The sources, in the shape `attachSource` and `createRuleEvidence` demand.
 * Each is registered in `sources/registry.js`; `citationScan.js` checks that
 * every `pageLocus` below resolves to one of them.
 */
const VISHNU_BHASKAR = Object.freeze({
  title: 'Advanced Techniques of Predictive Astrology: A Vedic Treatise in Modern Times',
  author: 'Vishnu Bhaskar',
  file: 'advanced-techniques-of-predictive-astrology-vishnu-bhaskar/raw-scans/volume-1-part-02-pages-87-183.pdf',
  tradition: 'Parashari (modern compilation of classics)',
});

const PULIPPANI = Object.freeze({
  title: 'Gochar Phaladeepika (Transit Results)',
  author: 'Dr. U.S. Pulippani',
  file: 'gochar-phaladeepika-pulippani/raw-scans/full-scan.pdf',
  tradition: 'Tamil / Sanskrit transit tradition (Phaladeepika commentary)',
});

const PARASHARAS_LIGHT = Object.freeze({
  title: "Parashara's Light 6.1 manual",
  author: 'Parashara\'s Light (publisher not read from the file)',
  file: 'parasharas-light-6-1-manual/raw-scans/full-scan.pdf',
  tradition: 'Reference software manual',
});

const RATH = Object.freeze({
  title: 'Vedic Remedies in Astrology',
  author: 'Sanjay Rath',
  file: 'vedic-remedies-in-astrology-rath/raw-scans/full-scan.pdf',
  tradition: 'Jaimini / Parashari (modern)',
});

const SHUBHAKARAN = Object.freeze({
  title: 'Nakshatra based predictions, part 1',
  author: 'K.T. Shubhakaran',
  file: 'nakshatra-based-predictions-part1-shubhakaran/raw-scans/full-scan.pdf',
  tradition: 'Parashari (modern)',
});

/** Vishnu Bhaskar's curated scan paginates one page later than the D:\1 copy. */
const VB_LOCUS_DEFINITIONS = 'Chapter 14 §VII–X, printed p.142 (PDF page 56 of volume-1 part 02; '
  + 'another copy of the book has it on p.141)';
const VB_LOCUS_DURATION = 'Chapter 14 §XIII, printed p.143 (PDF page 57 of volume-1 part 02)';

/** House from the natal Moon -> which Sade Sati phase it is. */
const SADE_SATI_PHASES = deepFreeze({
  12: {
    phase: 'RISING', order: 1,
    nameTa: 'முதல் இரண்டரை ஆண்டு (12-ஆம் இடம்)',
    bodyPart: 'தலை',
    book: { dhaiya: 'First', bodyPart: 'head', aspects: [2, 6, 9] },
    resultTa: 'சனி 12-ஆம் இடத்தில் — நூல் இதைத் "தலை"யில் சனி என்கிறது. அவரது முழுப் பார்வை '
      + '2, 6, 9-ஆம் பாவங்களில் விழுகிறது: செலவு, உடல்/பணச் சிக்கல்கள், குடும்ப அமைதியின்மை, '
      + 'நோய் அச்சம், தந்தைக்குத் துன்பம், அதிர்ஷ்டக் குறைவு.',
    source: { ...VISHNU_BHASKAR, pageLocus: `${VB_LOCUS_DEFINITIONS}: First Dhaiya, Saturn in the 12th` },
  },
  1: {
    phase: 'PEAK', order: 2,
    nameTa: 'இரண்டாம் இரண்டரை ஆண்டு (ஜென்ம ராசி)',
    bodyPart: 'வயிறு',
    book: { dhaiya: 'Second', bodyPart: 'abdomen', aspects: [3, 7, 10] },
    resultTa: 'சனி ஜென்ம ராசியில் — நூல் இதை "வயிறு" என்கிறது. முழுப் பார்வை 3, 7, 10-ஆம் '
      + 'பாவங்களில்: மன வேதனை, உடலின் நடுப்பகுதி நோய்கள், உடன்பிறந்தோர்/கூட்டாளிகளுடன் '
      + 'தகராறு, வாழ்க்கைத் துணைக்கு நோய், தாம்பத்திய அமைதியின்மை, தொழில்/பண இழப்பு.',
    source: { ...VISHNU_BHASKAR, pageLocus: `${VB_LOCUS_DEFINITIONS}: Second Dhaiya, Saturn on the Moon sign` },
  },
  2: {
    phase: 'SETTING', order: 3,
    nameTa: 'மூன்றாம் இரண்டரை ஆண்டு (2-ஆம் இடம்)',
    bodyPart: 'கால்',
    book: { dhaiya: 'Third', bodyPart: 'legs', aspects: [4, 8, 11] },
    resultTa: 'சனி 2-ஆம் இடத்தில் — நூல் இதைத் "கால்"களில் சனி என்கிறது. முழுப் பார்வை 4, 8, 11-ஆம் '
      + 'பாவங்களில்: பண இழப்பு, குடும்பச் சிக்கல், நோய், சிரமங்கள், வருமானக் குறைவு.',
    source: { ...VISHNU_BHASKAR, pageLocus: `${VB_LOCUS_DEFINITIONS}: Third Dhaiya, Saturn in the 2nd` },
  },
});

/**
 * What the book says of the first, second and third Sade Sati in a life.
 * Only three are described; a fourth is not (Pulippani mentions "3rd or 4th
 * round" once, only in a life-span remark, without characterising it).
 */
const SADE_SATI_CYCLES = deepFreeze({
  1: {
    book: 'Extremely painful; obstacles and hardships of various kinds; trouble to parents.',
    textTa: 'நூல்: மிகவும் வேதனை தருவது; பல வகைத் தடைகளும் சிரமங்களும்; பெற்றோருக்குத் துன்பம்.',
    citeTa: 'விஷ்ணு பாஸ்கர் — அச்சுப் பக்கம் 142 (VII.2)',
    source: { ...VISHNU_BHASKAR, pageLocus: `${VB_LOCUS_DEFINITIONS}: VII.2 First Cycle of Sadhe Sati` },
  },
  2: {
    book: 'Mediocre influence; success through struggle and labour; mental unrest; separation or loss of parents.',
    textTa: 'நூல்: நடுத்தர தாக்கம்; போராடி உழைத்தால் வெற்றி; மன அமைதியின்மை; பெற்றோர் பிரிவு அல்லது இழப்பு.',
    citeTa: 'விஷ்ணு பாஸ்கர் — அச்சுப் பக்கம் 142 (VII.3)',
    source: { ...VISHNU_BHASKAR, pageLocus: `${VB_LOCUS_DEFINITIONS}: VII.3 Second Cycle of Sadhe Sati` },
  },
  3: {
    book: 'Extremely harsh; tremendous physical hardships; fear of death; only the fortunate survive.',
    textTa: 'நூல்: மிகக் கடுமையானது; பெரும் உடல் சிரமம்; மரண அச்சம்; அதிர்ஷ்டசாலிகள் மட்டுமே தாண்டுவர்.',
    citeTa: 'விஷ்ணு பாஸ்கர் — அச்சுப் பக்கம் 142 (VII.4)',
    source: { ...VISHNU_BHASKAR, pageLocus: `${VB_LOCUS_DEFINITIONS}: VII.4 Third Cycle of Sadhe Sati` },
  },
});

/**
 * Vishnu Bhaskar's sign-wise arishta table (§X).
 *
 * `printed` is the cell as printed. `phases` and `especially` are OUR reading
 * of it, in terms of the three Sade Sati phases (First / Middle / Last 2½ years
 * = RISING / PEAK / SETTING). Five rows are ambiguous in print — Leo, Virgo,
 * Capricorn, Scorpio and Pisces carry a second clause ("… are specially bad") that
 * could be read as a subset of the first; the reading below takes it as one,
 * which is the natural one, but it is a reading. `readingUncertain` marks them.
 */
const ARISHTA_BY_MOON_SIGN = deepFreeze([
  { rasi: 0, printed: 'Middle 2½ yrs', phases: ['PEAK'], especially: [], readingUncertain: false },
  { rasi: 1, printed: 'First 2½ yrs', phases: ['RISING'], especially: [], readingUncertain: false },
  { rasi: 2, printed: 'Last 2½ yrs', phases: ['SETTING'], especially: [], readingUncertain: false },
  { rasi: 3, printed: 'Middle 2½ yrs', phases: ['PEAK'], especially: [], readingUncertain: false },
  { rasi: 4, printed: '1st 5 yrs. – Middle 2½ yrs are specially bad', phases: ['RISING', 'PEAK'], especially: ['PEAK'], readingUncertain: true },
  { rasi: 5, printed: '1st 5 yrs. – Middle 2½ yrs are specially bad', phases: ['RISING', 'PEAK'], especially: ['PEAK'], readingUncertain: true },
  { rasi: 6, printed: 'Last 2½ yrs', phases: ['SETTING'], especially: [], readingUncertain: false },
  { rasi: 7, printed: 'Last 5 yrs. – Middle 2½ yrs are too bad', phases: ['PEAK', 'SETTING'], especially: ['PEAK'], readingUncertain: true },
  { rasi: 8, printed: 'First 2½ yrs', phases: ['RISING'], especially: [], readingUncertain: false },
  { rasi: 9, printed: '1st 5 yrs. – First 2½ yrs are specially bad', phases: ['RISING', 'PEAK'], especially: ['RISING'], readingUncertain: true },
  { rasi: 10, printed: 'First and last 2½ yrs. (Total 5 yrs.)', phases: ['RISING', 'SETTING'], especially: [], readingUncertain: false },
  { rasi: 11, printed: 'Whole 7½ yrs. – Last 2½ yrs especially bad', phases: ['RISING', 'PEAK', 'SETTING'], especially: ['SETTING'], readingUncertain: true },
]);
const ARISHTA_SOURCE = Object.freeze({
  ...VISHNU_BHASKAR,
  pageLocus: `${VB_LOCUS_DEFINITIONS}: X Sign-wise Arishta Period during Sadhe Sati`,
});

/** Saturn's nominal timing, as the book states it (the sky gives the real one). */
const NOMINAL_DURATION = deepFreeze({
  cycleMonths: 90,
  dhaiyaMonths: 30,
  maleficMonths: 25,
  source: { ...VISHNU_BHASKAR, pageLocus: `${VB_LOCUS_DURATION}: Saturn takes 90 months in one cycle of Sadhe Sati and 30 in each Dhaiya` },
});

/**
 * The named conditions and the houses (from the natal Moon sign) they occupy.
 * `sources` lists every book we hold that names the condition, each with the
 * page it was read from.
 */
const DEFINITIONS = deepFreeze({
  SADE_SATI: {
    nameTa: 'ஏழரைச் சனி', name: 'Sade Sati', houses: [12, 1, 2],
    sources: [
      { ...VISHNU_BHASKAR, pageLocus: `${VB_LOCUS_DEFINITIONS}: VII Sadhe Sati, Saturn over the 12th, the Moon sign and the 2nd` },
      { ...PULIPPANI, pageLocus: 'printed p.69 (PDF 80) and p.171 (PDF 164): "7 1/2 years of Saturn Sadesathi"; the 12th "is starting of Sadhe Saati"' },
      { ...SHUBHAKARAN, pageLocus: `section 34, PDF page 39 (printed 38): "Sade-Sathi is the period of Saturn's transit through the 12th, 1st and 2nd house"` },
    ],
  },
  ARDHASHTAMA: {
    nameTa: 'அர்த்தாஷ்டமச் சனி', name: 'Ardhashtama Saturn', houses: [4],
    sources: [
      { ...VISHNU_BHASKAR, pageLocus: `${VB_LOCUS_DEFINITIONS}: VIII Laghu Kalyani Dhaiya, Saturn on the 4th (Ardhastama Saturn)` },
      { ...PULIPPANI, pageLocus: 'printed p.168 (PDF 161): Saturn through the fourth "is called Ardhashtama Sani or Kantaka Sani"' },
    ],
  },
  ASHTAMA: {
    nameTa: 'அஷ்டமச் சனி', name: 'Ashtama Saturn', houses: [8],
    sources: [
      { ...VISHNU_BHASKAR, pageLocus: `${VB_LOCUS_DEFINITIONS}: VIII Laghu Kalyani Dhaiya, 8H from Moon (Ashtama Saturn)` },
      { ...PULIPPANI, pageLocus: 'printed p.169 (PDF 162): Saturn through the eighth "is also called Ashtama Kantaka Sani"' },
      { ...SHUBHAKARAN, pageLocus: `section 34, PDF page 39 (printed 38): "Ashtama Sani is the period of Saturn's sojourn through the 8th house"` },
    ],
  },
});

/**
 * Kantaka Saturn under each source's reading. See the header: the books
 * disagree, so each is kept as its own convention.
 */
const KANTAKA_CONVENTIONS = deepFreeze({
  PULIPPANI: {
    id: 'PULIPPANI',
    label: 'Pulippani (4, 7, 8)',
    labelTa: 'புலிப்பாணி — 4, 7, 8',
    houses: [4, 7, 8],
    source: { ...PULIPPANI, pageLocus: 'printed pp.168-169 (PDF 161-162): the 4th ("Ardhashtama Sani or Kantaka Sani"), the 7th ("also known as Kantaka Shani, worse than his 4th") and the 8th ("Ashtama Kantaka Sani")' },
    note: 'The book\'s own introduction (printed p.69) names only the 8th as Kantaka, so it is not consistent with itself.',
  },
  RATH: {
    id: 'RATH',
    label: 'Rath (1, 8, 10)',
    labelTa: 'ராத் — 1, 8, 10',
    houses: [1, 8, 10],
    source: { ...RATH, pageLocus: 'printed p.170 (PDF 176), footnote 52: Saturn in "the 1st, 8th or 10th house from the Lagna, AL or Natal Moon"' },
    note: 'Derived from Saturn\'s aspect on the 10th; counted here from the Moon only, though Rath also counts from Lagna and Arudha Lagna.',
  },
  VISHNU_BHASKAR: {
    id: 'VISHNU_BHASKAR',
    label: 'Vishnu Bhaskar (4, 7, 10)',
    labelTa: 'விஷ்ணு பாஸ்கர் — 4, 7, 10',
    houses: [4, 7, 10],
    source: { ...VISHNU_BHASKAR, pageLocus: `${VB_LOCUS_DEFINITIONS}: IX Kantaka Saturn, "in 4, 7, 10th house from Moon Lagna"` },
    note: 'Adds the 10th, which only Vishnu Bhaskar and Rath name.',
  },
  PARASHARAS_LIGHT: {
    id: 'PARASHARAS_LIGHT',
    label: 'Parashara\'s Light (4, 7)',
    labelTa: 'பராசரர் லைட் — 4, 7',
    houses: [4, 7],
    source: { ...PARASHARAS_LIGHT, pageLocus: 'printed p.191 (PDF 191), glossary: "Kantaka Saturn: Transit of Saturn in the 4th and 7th rashis from the Moon"' },
    note: 'The reference software\'s reading; also what Pulippani\'s detailed chapter gives for the 4th and 7th.',
  },
});

/**
 * The order the conventions are shown in, and so the default (owner,
 * 2026-10-03: "the book with the most explanation first"): words each source
 * spends on Kantaka Saturn. Pulippani: his 4th, 7th and 8th passages, which name
 * Kantaka. Rath: §e and footnote 52. Vishnu Bhaskar: §IX (count from the
 * owner's library index OCR of the same edition). Parashara's Light: the
 * glossary line.
 */
const KANTAKA_RANK = deepFreeze({
  decided: '2026-10-03',
  measureTa: 'கண்டகச் சனி பற்றி ஒவ்வொரு நூலும் எழுதியுள்ள சொற்களின் எண்ணிக்கை',
  order: [
    { id: 'PULIPPANI', words: 576, range: 'printed pp.168-170, the 4th, 7th and 8th' },
    { id: 'RATH', words: 182, range: 'printed p.170, §e and footnote 52' },
    { id: 'VISHNU_BHASKAR', words: 27, range: 'printed p.142, §IX' },
    { id: 'PARASHARAS_LIGHT', words: 13, range: 'manual 6.1, glossary p.191' },
  ],
  countOfSourcesTa: '4, 7 என்ற இணையை நான்கில் மூன்று நூல்கள் சொல்கின்றன — இது முன்பு இயல்புநிலையாக இருந்தது.',
});
const DEFAULT_KANTAKA = KANTAKA_RANK.order[0].id;

/** A variant recorded but not implemented: one author's own degree-based counting. */
const NOT_IMPLEMENTED = deepFreeze([
  {
    id: 'SHUBHAKARAN_DEGREE_BASED',
    reasonTa: 'கே.டி. சுபகரன் சாடே-சாத்தியை ராசி அடிப்படையில் அல்லாமல், ஜனன சந்திரனின் பாகையிலிருந்து '
      + '330° முதல் 60° வரை (ஷனி 12 → 2) எனத் தன் சொந்தக் கருத்தாகக் கூறுகிறார்; கண்டகச் சனியை '
      + 'பாகை 90°–120° எனவும், அஷ்டமத்தை 210°–240° எனவும். அவரே இதைப் "பொதுவாக ஏற்கப்பட்ட" '
      + 'கருத்திலிருந்து "சற்று வேறுபடுகிறேன்" என்று சொல்கிறார்; ஒரே ஆசிரியரின் கருத்து என்பதால் '
      + 'செயல்படுத்தப்படவில்லை.',
    source: { ...SHUBHAKARAN, pageLocus: `section 34, PDF page 39 (printed 38): the author's degree-based Sade-Sathi, Ashtama and Kantaka windows` },
  },
]);

/**
 * Remedies exactly as two books record them. These are *recorded practices*,
 * not claims that they work, and nothing here is computed. The Sanskrit text of
 * the mantras is deliberately not reproduced: the books cite a Rudram passage
 * and a Shani verse, and a transcription made here could differ from the
 * printed text.
 */
const REMEDIES = deepFreeze([
  {
    id: 'RATH_RUDRAM_KANTAKA',
    appliesTo: ['KANTAKA'],
    textTa: 'ஸ்ரீ ருத்ரத்தின் ஒரு பகுதியைத் தினமும் காலையில் (குளித்து, கிழக்கு நோக்கி அமர்ந்து) 11 முறை '
      + 'பாராயணம் செய்தல். நூல் சனியை "முள்" எனக் கொண்டு, பரிகாரம் ருத்ர வழிபாட்டில் உள்ளது என்கிறது.',
    source: { ...RATH, pageLocus: 'printed p.170 (PDF 176), §e "Remedy for Kantaka Sani" and footnote 52' },
  },
  {
    id: 'SHUBHAKARAN_SHANI_VERSE',
    appliesTo: ['SADE_SATI', 'ASHTAMA', 'KANTAKA'],
    textTa: 'சனியின் தீய கோசாரக் காலத்தில் ஒரு சனி ஸ்லோகத்தை (நூலில் அச்சிடப்பட்டுள்ளது) தினமும் 11 முறை '
      + 'ஜபித்தல்.',
    source: { ...SHUBHAKARAN, pageLocus: `section 34, PDF page 41 (printed 40): recitation "for 11 times daily during the period of saturn's evil transit"` },
  },
  {
    id: 'SHUBHAKARAN_RUDRAM_40_DAYS',
    appliesTo: ['SADE_SATI', 'ASHTAMA', 'KANTAKA'],
    textTa: 'ருத்ரத்திலிருந்து எடுத்த ஒரு மந்திரத்தை 40 நாட்கள் தினமும் 11 முறை ஜபித்து, ருத்ரனுக்கு (சிவனுக்கு) '
      + 'பூஜை செய்து, 41-ஆம் நாள் ஹோமம் செய்தல்.',
    source: { ...SHUBHAKARAN, pageLocus: 'section 34, PDF pages 41-42 (printed 40-41): "for 11 times daily for 40 days ... puja of Lord Rudra ... on the 41st day do homa"' },
  },
]);

/**
 * Saturn in the 3rd, 6th and 11th from the Moon is favourable; not part of
 * Sade Sati and not needed here, so it is not encoded. (Pulippani printed p.69.)
 */

module.exports = {
  SADE_SATI_PHASES, SADE_SATI_CYCLES, ARISHTA_BY_MOON_SIGN, ARISHTA_SOURCE,
  NOMINAL_DURATION, DEFINITIONS, KANTAKA_CONVENTIONS, DEFAULT_KANTAKA, KANTAKA_RANK,
  NOT_IMPLEMENTED, REMEDIES,
  SOURCES: { VISHNU_BHASKAR, PULIPPANI, PARASHARAS_LIGHT, RATH, SHUBHAKARAN },
};
