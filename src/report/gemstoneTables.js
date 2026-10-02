/**
 * Gemstones — what three books say about which gem to wear, and where.
 *
 * ## No single method exists, so three are shown
 *
 * The books held do not share a method for choosing a gem, and they disagree
 * about particular gems for the same Ascendant:
 *
 *   Kapoor      the gem of the **Ascendant lord** is the "ruling stone", a
 *               protective charm wearable in any planet's period; strengthen
 *               only lords of auspicious houses, never those of the 6th, 8th and
 *               12th.
 *   Tilak Raj   a **verdict for each of seven gems for each of the twelve
 *               Ascendants**, with the house lordships it rests on.
 *   Raj Kumar   gems of lords of the 1st, 5th, 9th (or exalted/yogakaraka
 *               planets) counted from the Ascendant **or the Moon sign**, never
 *               those of the 6th, 7th, 8th, 12th lords — with a table by sign;
 *               in the same book a second rule names the 1st, 4th, 5th, 9th and
 *               10th. His book also states the older view: a planet's gem is worn
 *               in that planet's dasha only.
 *
 * The planet-to-gem assignment is the classical one: Kapoor prints the Sanskrit
 * *Jataka Parijata* verse on printed p.76. Its English rendering names five
 * gems and Rahu's and Ketu's, and omits Saturn; the verse itself gives Saturn
 * blue sapphire (नीलं). That is recorded as a discrepancy, not silently fixed.
 *
 * ## What the Tamil texts hold
 *
 * The nine gem names (Jathaka Alangaram's commentary, OCR text only) and the
 * statement that the 2nd house shows gold and the nine gems one wears. No Tamil
 * text held assigns a gem to a planet or gives a rule for choosing one, so no
 * Tamil method is invented.
 *
 * ## What the verdicts are
 *
 * Tilak Raj's verdicts are encoded as structured codes, not as his sentences:
 * a verdict, the lordships he states, and whatever condition he attaches
 * (a dasha, the planet's placement, its own sign, a gem to wear it with). His
 * stated lordships are checked in the test against the real lordship of each
 * sign — an independent check on the transcription, and on the book. Where he
 * omits a lordship (Aries: he calls Mars lord of the Ascendant and says nothing
 * of the 8th), the result says so.
 *
 * Tables are embedded here (Next replaces \`__dirname\`); the transcription is
 * \`fixtures/gemstones/definitions.json\` and the test asserts they agree.
 */

const deepFreeze = (o) => {
  Object.values(o).forEach((v) => { if (v && typeof v === 'object') deepFreeze(v); });
  return Object.freeze(o);
};

const KAPOOR = Object.freeze({
  title: 'Remedial Measures in Astrology',
  author: 'G.S. Kapoor',
  file: 'remedial-measures-in-astrology-kapoor/raw-scans/full-scan.pdf',
  tradition: 'Parashari / remedies (modern)',
});
const TILAK_RAJ = Object.freeze({
  title: 'Remedies of Astrological Science',
  author: 'Tilak Raj',
  file: 'remedies-of-astrological-science-tilak-raj/raw-scans/full-scan.pdf',
  tradition: 'Parashari / remedies (modern)',
});
const RAJ_KUMAR = Object.freeze({
  title: 'Astro Remedies: A Vedic Approach',
  author: 'Raj Kumar',
  file: 'astro-remedies-a-vedic-approach-raj-kumar/raw-scans/full-scan.pdf',
  tradition: 'Parashari / remedies (modern)',
});

const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const PLANET_TA = {
  Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு',
  Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது',
};

/** The gem of each planet — the Jataka Parijata verse, as printed in Kapoor p.76. */
const PLANET_GEMS = deepFreeze({
  Sun: { en: 'Ruby', ta: 'மாணிக்கம்' },
  Moon: { en: 'Pearl', ta: 'முத்து' },
  Mars: { en: 'Red coral', ta: 'பவழம்' },
  Mercury: { en: 'Emerald', ta: 'மரகதம்' },
  Jupiter: { en: 'Yellow sapphire', ta: 'புஷ்பராகம்', alsoCalled: 'Topaz (Tilak Raj)' },
  Venus: { en: 'Diamond', ta: 'வைரம்' },
  Saturn: { en: 'Blue sapphire', ta: 'நீலம்', alsoCalled: 'Sapphire (Tilak Raj)' },
  Rahu: { en: 'Hessonite (gomed)', ta: 'கோமேதகம்' },
  Ketu: { en: "Cat's eye", ta: 'வைடூரியம்' },
});
const PLANET_GEMS_SOURCE = Object.freeze({
  ...KAPOOR,
  pageLocus: 'printed p.76 (PDF 72): the Sanskrit verse from Jataka Parijata giving each planet\'s gem; the English rendering beside it omits Saturn, whose gem the verse gives as nila (blue sapphire)',
});
const TAMIL_NAMES_NOTE = 'நவரத்தினப் பெயர்கள் (மாணிக்கம், முத்து, பவழம், மரகதம், புஷ்பராகம், வைரம், நீலம், கோமேதகம், வைடூரியம்): சாதக அலங்காரம் (சரசுவதி மகால் 2007) உரையில் உள்ளவை; OCR உரை மட்டுமே — பக்கம் சரிபார்க்கப்படவில்லை. அந்த நூல் கிரகத்துக்கு ரத்தினம் ஒதுக்கவில்லை.';

/** Kapoor, printed p.77: the Ascendant, its lord, and the "ruling stone". */
const KAPOOR_RULING_STONE = deepFreeze({
  table: [
    { lagna: 0, lord: 'Mars', gem: 'Red coral' }, { lagna: 1, lord: 'Venus', gem: 'Diamond' },
    { lagna: 2, lord: 'Mercury', gem: 'Emerald' }, { lagna: 3, lord: 'Moon', gem: 'White pearl' },
    { lagna: 4, lord: 'Sun', gem: 'Ruby' }, { lagna: 5, lord: 'Mercury', gem: 'Emerald' },
    { lagna: 6, lord: 'Venus', gem: 'Diamond' }, { lagna: 7, lord: 'Mars', gem: 'Red coral' },
    { lagna: 8, lord: 'Jupiter', gem: 'Yellow sapphire' }, { lagna: 9, lord: 'Saturn', gem: 'Blue sapphire' },
    { lagna: 10, lord: 'Saturn', gem: 'Blue sapphire' }, { lagna: 11, lord: 'Jupiter', gem: 'Yellow sapphire' },
  ],
  source: { ...KAPOOR, pageLocus: 'printed p.77 (PDF 73): "Sign of the Ascendant / Lord of the Ascendant / Related gem stone"' },
});

/** The rules each book states, in Tamil, each with its page. Not computed. */
const RULES = deepFreeze({
  kapoor: [
    {
      id: 'K_RULING',
      textTa: 'லக்ன அதிபதியின் ரத்தினம் "ஆளும் கல்" — எப்போதும் பாதுகாப்புக் கவசமாக இருக்கும்; எந்தக் கிரகத்தின் தசை அல்லது புத்தியிலும் அணியலாம்.',
      source: { ...KAPOOR, pageLocus: 'printed p.77 (PDF 73)' },
    },
    {
      id: 'K_STRENGTHEN',
      textTa: 'ரத்தினம் அணிவதால் அந்தக் கிரகமும் அவர் ஆளும் பாவங்களும் வலுப்பெறும்; ரத்தினம் தோலைத் தொடும்படி மோதிரம் அமைய வேண்டும். எந்தப் பாவம் வலுப்பெற வேண்டும் என்பதைப் பார்த்துத் தேர்ந்தெடுக்க வேண்டும்.',
      source: { ...KAPOOR, pageLocus: 'printed p.77 (PDF 73)' },
    },
    {
      id: 'K_AUSPICIOUS_ONLY',
      textTa: 'சுப பாவங்களின் அதிபதிகளை மட்டுமே வலுப்படுத்த வேண்டும்; 6, 8, 12-ஆம் அதிபதிகளை ஒருபோதும் வலுப்படுத்தக் கூடாது — அவர்கள் பலவீனமாக இருப்பதே நல்லது; அவர்களின் ரத்தினங்கள் விதிவிலக்கான சூழ்நிலைகளில் மட்டும்.',
      source: { ...KAPOOR, pageLocus: 'printed p.78 (PDF 74)' },
    },
    {
      id: 'K_RITUAL',
      textTa: 'ரத்தினம் முடிந்தவரை திங்கள், வியாழக்கிழமைகளில் வாங்க வேண்டும் (சுக்கிரன், சனி, ராகு, கேது ரத்தினங்களை வெள்ளி, சனியிலும் வாங்கலாம்); அந்தக் கிரகத்தின் கிழமையில் அணிய வேண்டும்; அணிவதற்கு முன் கங்கை நீர் அல்லது காய்ச்சாத பாலில் தூய்மைப்படுத்தி, கிரக நிறப் பூ, தூபம் காட்டி, அந்தக் கிரகத்தின் நமஸ்கார, தாந்திரிக மந்திரங்களை 108 முறை ஜபிக்க வேண்டும்.',
      source: { ...KAPOOR, pageLocus: 'printed p.78 (PDF 74)' },
    },
  ],
  rajKumar: [
    {
      id: 'RK_DASHA',
      textTa: 'பாரம்பரியக் கருத்து: கிரகம் தன் தசை, புத்தியில்தான் நன்மை தீமை தருவதால், அந்தக் கிரகத்தின் ரத்தினத்தை அந்தக் காலத்தில் மட்டுமே அணிய வேண்டும்.',
      source: { ...RAJ_KUMAR, pageLocus: 'PDF page 122 (end of the page), item 3: "Indian astrologers have been of the opinion ..."' },
    },
    {
      id: 'RK_LONG_TERM',
      textTa: 'பிந்தைய வழக்கம்: நீண்டகாலத்துக்கு 1, 5, 9-ஆம் அதிபதிகள், அல்லது உச்ச அல்லது யோககாரக கிரகங்களின் ரத்தினங்களை — லக்னம் அல்லது சந்திர ராசியிலிருந்து (எது வலிமையோ அதிலிருந்து) — அணியலாம்; 6, 7, 8, 12-ஆம் அதிபதிகள், நீச அல்லது அஸ்தமனக் கிரகங்களின் ரத்தினங்களை அணியக் கூடாது.',
      source: { ...RAJ_KUMAR, pageLocus: 'PDF page 123 (top)' },
    },
    {
      id: 'RK_FAVOURABLE_LORDS',
      textTa: 'அதே நூலின் பிரிவு 4.8: 1, 4, 5, 9, 10-ஆம் அதிபதிகளின் ரத்தினங்கள் சாதகம்; செயல்பாட்டுப் பாப கிரகத்தின் ரத்தினத்தை ஒருபோதும் பரிந்துரைக்கக் கூடாது (அதன் தீய போக்கை வலுப்படுத்தும்); அந்தக் கிரகம் காரணமெனில் அதன் கடும் பகைவரை அல்லது இயற்கை சுப நண்பரை வலுப்படுத்த வேண்டும். — மேலே உள்ள விதியுடன் (1, 5, 9) முரண்படுகிறது.',
      source: { ...RAJ_KUMAR, pageLocus: 'PDF page 124, section 4.8 "Gems, Birth Chart and Profession"' },
    },
  ],
  tilakRaj: [
    {
      id: 'TR_POINTS',
      textTa: 'முக்கிய குறிப்புகள்: ராசிக்குப் பொருந்தாத ரத்தினத்தை அணியக் கூடாது (அது லக்ன அதிபதியின் பலத்தைக் குறைக்கும்); தேவையெனில் லக்ன அதிபதியின் நண்பர் ரத்தினத்தை அணியலாம்; கிரகங்களின் உதயம், அஸ்தமனத்தைப் பார்க்க வேண்டும் (அஸ்தமனக் கிரகத்தின் ரத்தினம் அதன் பலத்தைக் கூட்டும்); தசை, புத்தி, பார்வை, உச்சம், நீசம், நட்பு/பகை வீடுகளை ஆராய்ந்த பின்பே அணிய வேண்டும்; ரத்தினத்தை உரிய விரலில் மட்டுமே அணிய வேண்டும்; சிறந்த தரமுள்ளதை மட்டுமே எடுக்க வேண்டும்.',
      source: { ...TILAK_RAJ, pageLocus: 'printed p.33 (PDF 37), "Some main points"' },
    },
    {
      id: 'TR_HAND',
      textTa: 'ஆண் தன் இடக்கை உரிய விரலில் அணியும் ரத்தினம் அவன் மனைவிக்குப் பலன் தரும்; மனைவி தன் வலக்கை உரிய விரலில் அணிவது கணவனுக்குப் பலன் தரும்.',
      source: { ...TILAK_RAJ, pageLocus: 'printed p.33 (PDF 37), "Some main points"' },
    },
  ],
});

/** Raj Kumar's table of benefic and malefic gems by Ascendant or Moon sign (PDF pp.123-124). */
const RAJ_KUMAR_TABLE = deepFreeze({
  rows: [
    { sign: 0, benefic: ['Ruby', 'Red coral', 'Pearl', 'Yellow sapphire'], malefic: ['Emerald', 'Diamond'] },
    { sign: 1, benefic: ['Blue sapphire', 'Diamond', 'Emerald', 'Ruby'], malefic: ['Pearl', 'Coral', 'Yellow sapphire'] },
    { sign: 2, benefic: ['Diamond', 'Emerald'], malefic: ['Coral', 'Yellow sapphire'] },
    { sign: 3, benefic: ['Ruby', 'Red coral', 'Pearl'], malefic: [] },
    { sign: 4, benefic: ['Ruby', 'Coral'], malefic: ['Diamond', 'Blue sapphire'] },
    { sign: 5, benefic: ['Emerald', 'Diamond'], malefic: ['Ruby', 'Coral', 'Yellow sapphire'] },
    { sign: 6, benefic: ['Diamond', 'Blue sapphire', 'Emerald'], malefic: ['Ruby', 'Coral', 'Yellow sapphire'] },
    { sign: 7, benefic: ['Ruby', 'Coral', 'Pearl'], malefic: ['Diamond', 'Emerald'] },
    { sign: 8, benefic: ['Ruby', 'Coral', 'Yellow sapphire'], malefic: ['Diamond', 'Pearl', 'Blue sapphire'] },
    { sign: 9, benefic: ['Blue sapphire', 'Diamond', 'Emerald'], malefic: ['Ruby', 'Yellow sapphire'] },
    { sign: 10, benefic: ['Blue sapphire', 'Diamond'], malefic: ['Ruby', 'Pearl', 'Coral'] },
    { sign: 11, benefic: ['Pearl', 'Yellow sapphire', 'Coral'], malefic: ['Emerald', 'Diamond', 'Blue sapphire'] },
  ],
  notes: {
    cancerMalefic: 'The Cancer row prints nothing in the "Malefic Gems" column.',
    libraMalefic: 'The Libra row prints "Do" (ditto) in the "Malefic Gems" column, read as the row above it: Ruby, Coral, Yellow Sapphire.',
    sagittariusSplit: 'The Sagittarius row is split across two pages (PDF 123 to 124); its cells are read as joined.',
  },
  source: { ...RAJ_KUMAR, pageLocus: 'PDF pages 123-124: "list of benefic and malefic gems" by "Ascendant/Moon sign"' },
});

const E = (lords, v, x = {}) => ({ lords, v, ...x });

/**
 * Tilak Raj, printed pp.25-32: a verdict for each gem for each Ascendant.
 *
 * v:  JEEVANA   "Jeevana Ratna" — the Ascendant lord's own gem, worn for life
 *     MUST      "must be worn"
 *     FAV       favourable / auspicious / "should be worn" / "can be worn"
 *     CONSIDER  "advised to wear it after considering all aspects"
 *     MIXED     "both good and bad results"
 *     AVOID     "better to avoid" / "if not necessary, it should not be worn"
 *     UNFAV     "unfavourable" / malefic / "will not give good results"
 *     NOT_WORN  "should not / must not be worn"
 *     NEVER     "never" / "prohibited"
 * lords: the houses the book says the planet rules for that Ascendant
 * dasha: the book ties it to the planet's major period
 * houses / own: it holds if the planet stands there / in its own sign
 * with: gems the book says to wear it together with
 */
const TILAK_RAJ_BY_SIGN = deepFreeze([
  { // Aries
    Sun: E([5], 'FAV', { dasha: true }), Moon: E([4], 'FAV', { with: ['Mars'] }), Mars: E([1], 'JEEVANA'),
    Mercury: E([3, 6], 'CONSIDER'), Jupiter: E([9, 12], 'FAV', { with: ['Mars'], dasha: true }),
    Venus: E([2, 7], 'AVOID', { dasha: true, own: true, exalted: true }),
    Saturn: E([10, 11], 'AVOID', { dasha: true, houses: [1, 2, 4, 5, 9, 10, 11] }),
  },
  { // Taurus
    Sun: E([4], 'AVOID', { dasha: true }), Moon: E([3], 'NOT_WORN'), Mars: E([7, 12], 'NOT_WORN'),
    Mercury: E([2, 5], 'MUST', { dasha: true, with: ['Venus'] }),
    Jupiter: E([8, 11], 'AVOID', { dasha: true, houses: [1, 2, 4, 5, 9] }), Venus: E([1], 'JEEVANA'),
    Saturn: E([9, 10], 'FAV', { with: ['Venus'] }),
  },
  { // Gemini
    Sun: E([3], 'NOT_WORN'), Moon: E([2], 'AVOID', { dasha: true, houses: [9, 10, 11], own: true }),
    Mars: E([6, 11], 'NEVER'), Mercury: E([1, 4], 'JEEVANA'), Jupiter: E([7, 10], 'NEVER'),
    Venus: E([5, 12], 'FAV', { dasha: true }), Saturn: E([8, 9], 'FAV', { dasha: true, with: ['Mercury'] }),
  },
  { // Cancer
    Sun: E([2], 'AVOID', { eyeTrouble: true }), Moon: E([1], 'JEEVANA'),
    Mars: E([5, 10], 'MUST', { dasha: true, with: ['Moon'] }), Mercury: E([3, 12], 'NOT_WORN'),
    Jupiter: E([6, 9], 'FAV', { with: ['Moon'] }), Venus: E([4, 11], 'UNFAV'), Saturn: E([7, 8], 'NEVER'),
  },
  { // Leo
    Sun: E([1], 'JEEVANA'), Moon: E([12], 'AVOID', { dasha: true, own: true }),
    Mars: E([4, 9], 'FAV', { with: ['Sun'] }), Mercury: E([2, 11], 'UNFAV', { dasha: true }),
    Jupiter: E([5, 8], 'FAV', { with: ['Sun'], dasha: true }), Venus: E([3, 10], 'AVOID', { dasha: true }),
    Saturn: E([6, 7], 'NOT_WORN'),
  },
  { // Virgo
    Sun: E([12], 'NEVER'), Moon: E([11], 'AVOID', { dasha: true }), Mars: E([3, 8], 'AVOID'),
    Mercury: E([1, 10], 'JEEVANA', { dasha: true }), Jupiter: E([4, 7], 'AVOID', { dasha: true }),
    Venus: E([2, 9], 'FAV', { with: ['Mercury'] }), Saturn: E([5, 6], 'FAV', { dasha: true }),
  },
  { // Libra
    Sun: E([11], 'AVOID', { dasha: true }), Moon: E([10], 'MIXED', { dasha: true }), Mars: E([2, 7], 'NEVER'),
    Mercury: E([9, 12], 'FAV', { with: ['Venus'] }), Jupiter: E([3, 6], 'NOT_WORN'), Venus: E([1, 8], 'JEEVANA'),
    Saturn: E([4, 5], 'FAV', { with: ['Venus', 'Mercury'] }),
  },
  { // Scorpio
    Sun: E([10], 'FAV', { dasha: true }), Moon: E([9], 'FAV', { with: ['Mars'] }), Mars: E([1, 6], 'JEEVANA'),
    Mercury: E([8, 11], 'AVOID', { dasha: true, houses: [1, 2, 4, 5, 9, 11] }), Jupiter: E([2, 5], 'FAV'),
    Venus: E([12, 7], 'NOT_WORN'), Saturn: E([3, 4], 'AVOID', { dasha: true, houses: [5, 9, 10, 11] }),
  },
  { // Sagittarius
    Sun: E([9], 'FAV', { dasha: true }), Moon: E([], 'NOT_WORN', { duhsthana: true }), Mars: E([5, 12], 'FAV'),
    Mercury: E([7, 10], 'AVOID', { dasha: true, houses: [1, 2, 5, 9, 10, 11] }),
    Jupiter: E([1, 4], 'JEEVANA', { with: ['Sun'], dasha: true, printedAsEmerald: true }),
    Venus: E([6, 11], 'AVOID', { dasha: true, houses: [1, 2, 4, 5, 9, 11], extremeNeed: true }),
    Saturn: E([2, 3], 'NOT_WORN'),
  },
  { // Capricorn
    Sun: E([8], 'NOT_WORN'), Moon: E([7], 'NEVER'), Mars: E([4, 11], 'AVOID', { dasha: true, extremeNeed: true }),
    Mercury: E([6, 9], 'FAV', { with: ['Saturn'], dasha: true }), Jupiter: E([3, 12], 'UNFAV'),
    Venus: E([5, 10], 'FAV', { with: ['Saturn'], dasha: true }), Saturn: E([1, 2], 'FAV'),
  },
  { // Aquarius
    Sun: E([7], 'NOT_WORN'), Moon: E([6], 'NOT_WORN'), Mars: E([3, 10], 'AVOID', { houses: [10], own: true }),
    Mercury: E([5, 8], 'FAV', { with: ['Venus', 'Saturn'] }), Jupiter: E([2, 11], 'NOT_WORN'),
    Venus: E([4, 9], 'FAV', { with: ['Saturn'] }), Saturn: E([1], 'JEEVANA'),
  },
  { // Pisces
    Sun: E([6], 'AVOID', { dasha: true, houses: [6], own: true }), Moon: E([5], 'FAV', { dasha: true, with: ['Jupiter'] }),
    Mars: E([2, 9], 'FAV', { with: ['Jupiter', 'Moon'] }), Mercury: E([4, 7], 'AVOID'),
    Jupiter: E([1, 10], 'JEEVANA', { with: ['Moon', 'Mars'] }), Venus: E([3, 7], 'NOT_WORN'),
    Saturn: E([11, 12], 'AVOID', { dasha: true, houses: [1, 2, 4, 5, 9, 11] }),
  },
]);
const TILAK_RAJ_SOURCE = Object.freeze({
  ...TILAK_RAJ,
  pageLocus: 'printed pp.25-32 (PDF 29-36), "How to select gems according to signs" — Aries on p.25, Taurus p.25-26, Gemini p.26, Cancer-Leo p.27, Leo-Libra p.28, Libra-Scorpio p.29, Sagittarius-Capricorn p.30, Capricorn-Aquarius p.31, Pisces p.32',
});

/** Tilak Raj's rules for Rahu's and Ketu's gems (printed pp.32-33). */
const TILAK_RAJ_NODES = deepFreeze({
  gomed: {
    favourableLagnas: [2, 5, 1, 6, 9, 10], // Gemini, Virgo, Taurus, Libra, Capricorn, Aquarius
    notLagnas: [0, 7, 3, 4],               // Aries, Scorpio, Cancer, Leo
    notUnlessEssential: [8, 11],           // Sagittarius, Pisces (Chandal yoga with Jupiter)
    source: { ...TILAK_RAJ, pageLocus: 'printed p.32 (PDF 36), "Selecting the Rahu Ratna Gomed and Ketu Ratna Cat\'s eye"' },
    textTa: 'ராகுவின் நண்பர்கள் புதன், சுக்கிரன், சனி; எனவே மிதுனம், கன்னி, ரிஷபம், துலாம், மகரம், கும்ப லக்னத்தினருக்கு கோமேதகம் சாதகம். சூரியன், சந்திரன், செவ்வாய் பகை; எனவே மேஷம், விருச்சிகம், கடகம், சிம்ம லக்னத்தினர் அணியக் கூடாது. தனுசு, மீனம் (குருவுடன் சண்டாள யோகம்) அவசியமில்லையெனில் அணியக் கூடாது. ராகு தசையில் திறமையான ஜோதிடரின் ஆலோசனையின் பின்னரே.',
  },
  catsEye: {
    favourableKetuHouses: [2, 3, 4, 5, 9, 10],
    source: { ...TILAK_RAJ, pageLocus: 'printed p.33 (PDF 37), Ketu / cat\'s eye' },
    textTa: 'ஜாதகத்தில் கேது பாதகமாக, பலவீனமாக அல்லது அஸ்தமனமாக இருப்பவர்கள் மட்டுமே வைடூரியம் அணிய வேண்டும். கேது 2, 3, 4, 5, 9, 10-ஆம் இடங்களில் இருந்தால் சாதகம். கேதுவின் தசை/புத்தியில், திறமையான ஜோதிடரின் ஆலோசனையுடன் அணிவது நல்லது — அது தொடர்புடைய கிரகத்தின்படி பலன் தரும்.',
  },
});

/** Verdict codes in Tamil, and how each counts when the books are compared. */
const VERDICTS = deepFreeze({
  JEEVANA: { ta: 'ஜீவன ரத்தினம் — வாழ்நாள் முழுவதும் அணியலாம்', stance: 'FAV' },
  MUST: { ta: 'கட்டாயம் அணிய வேண்டும்', stance: 'FAV' },
  FAV: { ta: 'சாதகம் — அணியலாம்', stance: 'FAV' },
  CONSIDER: { ta: 'எல்லாவற்றையும் ஆராய்ந்த பிறகு அணியலாம்', stance: 'COND' },
  MIXED: { ta: 'நன்மையும் தீமையும் கலந்தது', stance: 'COND' },
  AVOID: { ta: 'தவிர்ப்பது நல்லது (தேவையில்லாவிட்டால் அணியக் கூடாது)', stance: 'UNFAV' },
  UNFAV: { ta: 'சாதகமற்றது', stance: 'UNFAV' },
  NOT_WORN: { ta: 'அணியக் கூடாது', stance: 'UNFAV' },
  NEVER: { ta: 'ஒருபோதும் அணியக் கூடாது', stance: 'UNFAV' },
});

module.exports = {
  PLANETS, PLANET_TA, PLANET_GEMS, PLANET_GEMS_SOURCE, TAMIL_NAMES_NOTE,
  KAPOOR_RULING_STONE, RULES, RAJ_KUMAR_TABLE, TILAK_RAJ_BY_SIGN, TILAK_RAJ_SOURCE, TILAK_RAJ_NODES, VERDICTS,
  SOURCES: { KAPOOR, TILAK_RAJ, RAJ_KUMAR },
};
