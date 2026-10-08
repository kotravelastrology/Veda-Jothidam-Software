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
 * *Jataka Parijata* verse on printed p.12 with an English rendering naming all
 * nine gems, Saturn's as blue sapphire. He prints the verse again on p.76,
 * where the English rendering omits Saturn. Both are recorded.
 *
 * ## Which book is shown first
 *
 * The owner's instruction (2026-10-03): show the book with the most explanation
 * first, then the others in order. `BOOK_RANK` holds the measure used and the
 * counts, so the order is a stated fact rather than a preference.
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
  pageLocus: 'printed p.12 (PDF 9): the Sanskrit verse from Jataka Parijata with an English rendering naming all nine gems, Saturn\'s as blue sapphire; printed again on p.76 (PDF 72), where the English rendering omits Saturn',
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
      id: 'TR_TRINE',
      textTa: 'திரிகோணம் எப்போதும் சுபம் என்பதால் லக்னம், 5, 9-ஆம் அதிபதிகளின் ரத்தினங்களை அணியலாம் — லக்ன அதிபதியினுடையது ஜீவன ரத்தினம், 5-ஆம் அதிபதியினுடையது காரக ரத்தினம், 9-ஆம் அதிபதியினுடையது பாக்கிய ரத்தினம். மூன்றையும் அணிய வேண்டியதில்லை. அந்தக் கிரகம் உச்சத்திலோ சொந்த ராசியிலோ இருந்தால் ஏற்கனவே வலிமையாக இருப்பதால் அதன் ரத்தினம் தேவையில்லை.',
      source: { ...TILAK_RAJ, pageLocus: 'printed p.20 (PDF 24), chapter 5 "Gems of Planets"' },
    },
    {
      id: 'TR_WEAK',
      textTa: 'சுப கிரகம் அஸ்தமனமாக அல்லது பலவீனமாக இருந்தால் அதன் ரத்தினத்தை அணியலாம்: லக்னம் பலவீனம் அல்லது லக்ன அதிபதி அஸ்தமனம் எனில் லக்ன அதிபதியின் ரத்தினம்; 5-ஆம் அதிபதி பலவீனம் எனில் அவரது ரத்தினம்; 9-ஆம் அதிபதி பலவீனம் அல்லது அஸ்தமனம் எனில் அவரது ரத்தினம்.',
      source: { ...TILAK_RAJ, pageLocus: 'printed p.20 (PDF 24)' },
    },
    {
      id: 'TR_NOT',
      textTa: 'திரிகோண அதிபதி நீசம் பெற்றிருந்தால் அவரது ரத்தினம் கூடாது; 2, 12-ஆம் அதிபதிகளின் ரத்தினங்களும் கூடாது; தடை செய்யும், நீச அல்லது அசுப கிரகத்தின் ரத்தினத்தை எந்நிலையிலும் அணியக் கூடாது. பெயர் ராசிப்படி ரத்தினம் அணிவது தவறு — ஜாதகத்தை ஆராய்ந்த பின்பே.',
      source: { ...TILAK_RAJ, pageLocus: 'printed p.20 (PDF 24)' },
    },
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

/**
 * Which book is shown first, and the measure behind the order.
 *
 * Counted from each PDF's text layer: the words (two or more letters) in the
 * part of the book about choosing a gem. Kapoor's layer is OCR of a scan and
 * the others' are near-clean, so the counts are approximate, but the gaps are
 * wide. Counting each book's whole gem chapter instead keeps Kapoor first and
 * puts Raj Kumar second: his extra pages are on gem quality, substitutes and
 * "energising", not on choosing. The selection measure is used because
 * choosing is what the page does.
 */
const BOOK_RANK = deepFreeze({
  decided: '2026-10-03',
  instruction: 'show the book with the most explanation first, then the others in order',
  measureTa: 'ரத்தினத் தேர்வு பற்றிய பகுதியில் உள்ள சொற்களின் எண்ணிக்கை (PDF உரையிலிருந்து எண்ணியது)',
  order: [
    { key: 'kapoor', words: 8410, range: 'PDF 72-95 (printed pp.76-99)', whatTa: 'ஒவ்வொரு ரத்தினத்துக்கும் 12 லக்னங்களுக்கும் தனித்தனிப் பத்தி — காரணம், நிபந்தனை, பலன், சேர்த்து அணியும் ரத்தினம், அணியும் முறை' },
    { key: 'tilakRaj', words: 4713, range: 'PDF 24-37 (printed pp.20-33)', whatTa: 'ஒவ்வொரு லக்னத்துக்கும் ஏழு ரத்தினங்களுக்குத் தீர்ப்பு, ஜீவன / காரக / பாக்கிய ரத்தின அட்டவணை, அணியும் முறை அட்டவணை' },
    { key: 'rajKumar', words: 3496, range: 'PDF 123-143', whatTa: 'சுப / அசுப ரத்தின அட்டவணை, ஒவ்வொரு ரத்தினத்துக்கும் "யார் அணியலாம்", அணியும் முறை' },
  ],
  alternative: {
    measureTa: 'முழு ரத்தின அத்தியாயத்தையும் எண்ணினால்',
    words: { kapoor: 11807, rajKumar: 11189, tilakRaj: 4713 },
    ranges: { kapoor: 'PDF 70-104 (chapters V-VI)', rajKumar: 'PDF 83-151 (chapter 4)', tilakRaj: 'PDF 24-37 (chapter 5)' },
    noteTa: 'அப்போதும் காபூர் முதலிடம்; ராஜ் குமார் இரண்டாம் இடத்துக்கு வருவார் — அவரது கூடுதல் பக்கங்கள் ரத்தினத் தரம், மாற்றுக் கற்கள், சக்தியூட்டல் பற்றியவை, தேர்வு பற்றியவை அல்ல.',
  },
});

/** Tilak Raj, printed p.21: the Jeevan (1st lord), Karaka (5th lord) and Bhagya (9th lord) gem of each Ascendant. */
const TILAK_RAJ_RATNA = deepFreeze({
  rows: [
    ['Mars', 'Sun', 'Jupiter'], ['Venus', 'Mercury', 'Saturn'], ['Mercury', 'Venus', 'Saturn'], ['Moon', 'Mars', 'Jupiter'],
    ['Sun', 'Jupiter', 'Mars'], ['Mercury', 'Saturn', 'Venus'], ['Venus', 'Saturn', 'Mercury'], ['Mars', 'Jupiter', 'Moon'],
    ['Jupiter', 'Mars', 'Sun'], ['Saturn', 'Venus', 'Mercury'], ['Saturn', 'Mercury', 'Venus'], ['Jupiter', 'Moon', 'Mars'],
  ].map(([jeevan, karaka, bhagya]) => ({ jeevan, karaka, bhagya })),
  source: { ...TILAK_RAJ, pageLocus: 'printed p.21 (PDF 25), "Gems according to ascendant": Jeevan Ratna, Karaka Ratna, Bhagya Ratna' },
});

/** Tilak Raj, printed p.21: "Yogakaraka, malefic and fatal planets according to ascendant". */
const TILAK_RAJ_PLANET_CLASS = deepFreeze({
  rows: [
    { yogakaraka: ['Mars', 'Sun', 'Jupiter', 'Moon'], malefic: ['Venus', 'Mercury', 'Saturn'] },
    { yogakaraka: ['Venus', 'Mercury', 'Sun', 'Saturn'], malefic: ['Moon', 'Jupiter', 'Mars'] },
    { yogakaraka: ['Mercury', 'Venus', 'Saturn'], malefic: ['Mars', 'Jupiter', 'Sun', 'Moon'] },
    { yogakaraka: ['Moon', 'Mars', 'Jupiter'], malefic: ['Mercury', 'Venus', 'Sun', 'Saturn'] },
    { yogakaraka: ['Sun', 'Mars', 'Jupiter'], malefic: ['Mercury', 'Venus', 'Moon', 'Saturn'] },
    { yogakaraka: ['Mercury', 'Saturn', 'Venus'], malefic: ['Mars', 'Moon', 'Sun', 'Jupiter'] },
    { yogakaraka: ['Venus', 'Saturn', 'Mercury'], malefic: ['Sun', 'Moon', 'Jupiter', 'Mars'] },
    { yogakaraka: ['Mars', 'Sun', 'Moon', 'Jupiter'], malefic: ['Venus', 'Mercury', 'Saturn'] },
    { yogakaraka: ['Jupiter', 'Sun', 'Mars'], malefic: ['Mercury', 'Venus', 'Saturn', 'Moon'] },
    { yogakaraka: ['Saturn', 'Mercury', 'Venus'], malefic: ['Moon', 'Jupiter', 'Sun', 'Mars'] },
    { yogakaraka: ['Saturn', 'Venus', 'Mercury'], malefic: ['Sun', 'Moon', 'Jupiter', 'Mars'] },
    { yogakaraka: ['Jupiter', 'Mars', 'Moon'], malefic: ['Sun', 'Mercury', 'Venus', 'Saturn'] },
  ],
  source: { ...TILAK_RAJ, pageLocus: 'printed p.21 (PDF 25), "Yogakaraka, malefic and fatal planets according to ascendant"' },
});

/**
 * Raj Kumar, "Who should wear a ... and how?" (PDF 124-143): for each gem, the
 * Ascendants he names. Lists are as printed; the test reports where one gem's
 * lists contradict each other or his own lordship clause.
 *
 *   good           named as suitable
 *   ownOrExalted   suitable for these Ascendants if the planet is in its own or exaltation sign
 *   limited        "to a limited scale" / only in the planet's dasha
 *   not            named as unsuitable
 *   avoidIfLordOf  "should not be worn when <planet> is lord of ..."
 *   avoidIfHouse   "should not be worn if <planet> is in the ... house"
 *   avoidIf        dignities he names as a bar (only debilitation is computed)
 *   notUnless      Jupiter: barred Ascendants may wear it if exalted, in own sign or in Gajakesari
 *   extraIf        exaltation, or the planet's Pancha Mahapurusha yoga, makes it "extra" good
 */
const RAJ_KUMAR_WHO = deepFreeze({
  Sun: {
    good: [0, 4, 7, 8], ownOrExalted: [3, 11], avoidIfLordOf: [6, 8, 12], page: 'PDF 124-125 (the first line of item i is lost at the page break)',
    textTa: 'சூரியன் 1, 5, 9 அல்லது 10-ஆம் அதிபதியாக இருந்தால் (மேஷம், சிம்மம், விருச்சிகம், தனுசு லக்னம்), அல்லது லக்ன அதிபதியின் நண்பராகச் சொந்த அல்லது உச்ச ராசியில் இருந்தால் (கடகம், மீனம் லக்னம்) மாணிக்கம் பயன் தரும்; சுப சூரியன் பாதிக்கப்பட்டிருந்தாலும் அணியலாம். சூரியன் திரிக (6, 8, 12) அதிபதியாக இருந்தால், அல்லது இயற்கைச் சுபர்களில் பெரும்பாலோர் அஸ்தமனம் / பாதிப்பு / சூரியனுக்கு எதிரில் இருந்தால் தவிர்க்க வேண்டும்.',
  },
  Moon: {
    good: [0, 3, 7, 11], limited: [1, 2, 5, 6], not: [4, 8, 9, 10], avoidIfLordOf: [3, 6, 8], page: 'PDF 127-129',
    textTa: 'சந்திரன் 1, 4, 5, 9-ஆம் அதிபதியாக இருந்தால் முத்து பயன் தரும்: மேஷம், கடகம், விருச்சிகம், மீனம் லக்னத்துக்கு மிக நல்லது; சிம்மம், தனுசு, மகரம், கும்பத்துக்கு (சந்திரன் 12, 8, 7, 6-ஆம் அதிபதி) கூடாது; மற்ற லக்னங்களுக்குச் சந்திர தசை / புத்தியில் குறைந்த அளவில். சந்திரன் 3, 6, 8-ஆம் அதிபதியாக இருந்தால் அணியக் கூடாது.',
  },
  Mars: {
    good: [0, 3, 4], extraIf: 'EXALTED_OR_MAHAPURUSHA', avoidIf: ['DEBILITATED'], page: 'PDF 129-131',
    textTa: 'செவ்வாய் சுப பாவ (1, 5, 9, 10) அதிபதியாக இருந்தால் — மேஷம், கடகம், சிம்மம் லக்னம் போல — பவழம் அணியலாம். செவ்வாய் உச்சத்தில் அல்லது ருசக யோகத்தில் (மேஷம், விருச்சிகம், மகரத்தில் கேந்திரத்தில்) இருந்தால் சுப அதிபதியாக இல்லாவிட்டாலும், குறிப்பாகச் செவ்வாய் தசை / புத்தியில் பெரும் நன்மை. ஏழரைச் சனியிலும் பயன் என்கிறது. மங்கள தோஷம் உள்ளவர்கள், செவ்வாய் நீசம் / அஸ்தமனம் / கடும் பாதிப்பில் இருந்தால் அணியக் கூடாது.',
  },
  Mercury: {
    good: [1, 2, 5, 6, 9], limited: [4, 10], not: [0, 7], extraIf: 'EXALTED_OR_MAHAPURUSHA', page: 'PDF 131-133',
    textTa: 'புதன் சுப பாவ அதிபதியாக உள்ள ரிஷபம், மிதுனம், கன்னி, துலாம், மகரம் லக்னத்துக்கு மிகுந்த நன்மை; சிம்மம், கும்பத்துக்குக் குறைந்த அளவில் — புதன் கெட்ட நிலையில் இருந்தால் மரகதம் அதைச் சரிசெய்யும். உச்சத்தில் அல்லது பத்ர யோகத்தில் சிறப்பு. மேஷம், விருச்சிகம் லக்னத்தினர் அணியக் கூடாது.',
  },
  Jupiter: {
    limited: [4, 7], not: [1, 6, 9, 10], notUnless: 'EXALTED_OWN_GAJAKESARI', extraIf: 'EXALTED_OR_MAHAPURUSHA', page: 'PDF 133-135',
    textTa: 'குரு சுப பாவ அதிபதியாக இருந்தால் புஷ்பராகம் பயன் தரும் (லக்னப் பட்டியல் இல்லை); சிம்மம், விருச்சிகம் லக்னத்துக்குக் குறைந்த அளவில். ஹம்ச யோகத்தில் சிறப்பு; திரிக அதிபதியாகவும் திரிகோண அதிபதியாகவும் இருந்தால் திரிகத் தீமையை நீக்கும். ரிஷபம், துலாம், மகரம், கும்பம் லக்னத்தினர் அணியக் கூடாது — குரு உச்சம், சொந்த ராசி அல்லது நல்ல கஜகேசரி யோகத்தில் இருந்தால் மட்டும் குரு தசை / புத்தியில்.',
  },
  Venus: {
    good: [1, 2, 5, 6, 9, 10], avoidIfHouse: [6, 7, 8], avoidIf: ['DEBILITATED'], extraIf: 'EXALTED_OR_MAHAPURUSHA', page: 'PDF 135-137',
    textTa: 'சுக்கிரன் திரிகோண அதிபதி அல்லது யோககாரகராக உள்ள ரிஷபம், மிதுனம், கன்னி, துலாம், மகரம், கும்பம் லக்னத்துக்கு வைரம் பயன் தரும் — கெட்ட நிலையில் இருந்தாலும் சரிசெய்யும். எந்த லக்னத்திலும் சுக்கிரன் உச்சம் அல்லது மாளவ்ய யோகத்தில் இருந்தால் கூடுதல் நன்மை. சுக்கிரன் 6, 7, 8-ல் இருந்தால், ஸ்திர ராசியில் செவ்வாயால் பாதிக்கப்பட்டிருந்தால், அஸ்தமனம் அல்லது நீசம் எனில் அணியக் கூடாது.',
  },
  Saturn: {
    good: [1, 6, 9, 10], limited: [0, 2, 5, 7], not: [0, 3, 4, 8, 11], avoidIfLordOf: [2, 6, 7, 8, 12], avoidIf: ['DEBILITATED'], extraIf: 'EXALTED_OR_MAHAPURUSHA', page: 'PDF 137-140',
    textTa: 'சனி சுப பாவ அதிபதி அல்லது யோககாரகராக உள்ள ரிஷபம், துலாம், மகரம், கும்பம் லக்னத்துக்கு நீலம் பயன் தரும்; மேஷம், மிதுனம், கன்னி, விருச்சிகத்துக்குக் குறைந்த அளவில்; சனி தசை / புத்தியில். உச்சம், திக்பலம், சச யோகத்தில் கூடுதல் நன்மை; தனுசு, மீனம், கும்பம், மகரம், துலாம் லக்னத்தில் சனி இருந்தால் (பிருஹஜ்ஜாதகம்) மிக நன்மை. ஆனால் மேஷம், கடகம், சிம்மம், தனுசு, மீனம் லக்னத்தினர், அல்லது சனி அஸ்தமனம் / நீசம் / 2, 6, 7, 8, 12-ஆம் அதிபதி எனில் தவிர்க்க வேண்டும்; ஏழரைச் சனியில் அணியக் கூடாது.',
  },
  Rahu: {
    page: 'PDF 140-142 (a line is lost at the PDF 140-141 break)',
    textTa: 'ராகு, கேது சேர்ந்த கிரகம் அல்லது நிற்கும் வீட்டின் அதிபதியின் பலனைத் தரும் (பிருஹத் பராசர ஹோரை). கோமேதகம் / வைடூரியம் தவறான வழியில் விரைவான உயர்வும் பின் விரைவான வீழ்ச்சியும் தரக்கூடும் — எனவே தசை / புத்தியில் மட்டும். ராகு ஒரு சுப கிரகத்தைப் பாதித்தால் அந்தக் கிரகத்தையே வலுப்படுத்துவது நல்லது. ராகு கேந்திர / திரிகோணத்தில் கடும் பாப பார்வையுடன் இருந்தால் கோமேதகம் கூடாது.',
  },
  Ketu: {
    page: 'PDF 142-143',
    textTa: 'வைடூரியம் கேது தசை / புத்தியில் மட்டும். இரத்தப்போக்கு, கடும் காய்ச்சல், தலைவலி, புண், தொற்று, கண் வலி இருக்கும்போது அணியக் கூடாது.',
  },
});
const RAJ_KUMAR_WHO_SOURCE = Object.freeze({
  ...RAJ_KUMAR,
  pageLocus: 'PDF pages 124-143, section 4.8, items 1-9 "Who should wear a ... and how?"',
});

/** Raj Kumar, PDF 143-144: a gem against a dasha that is "causing professional hurdles". */
const RAJ_KUMAR_COUNTER = deepFreeze({
  rows: [
    { dashaLord: 'Sun', gemOf: 'Jupiter' }, { dashaLord: 'Moon', gemOf: 'Sun' },
    { dashaLord: 'Mars', gemOf: 'Venus', alt: 'வெள்ளை புஷ்பராகம்' }, { dashaLord: 'Mercury', gemOf: 'Saturn' },
    { dashaLord: 'Jupiter', gemOf: 'Moon' }, { dashaLord: 'Venus', gemOf: 'Jupiter' },
    { dashaLord: 'Saturn', gemOf: 'Mars' }, { dashaLord: 'Rahu', gemOf: 'Mercury' }, { dashaLord: 'Ketu', gemOf: 'Mercury' },
  ],
  general: 'Sun',
  source: { ...RAJ_KUMAR, pageLocus: 'PDF pages 143-144, item 10 "Anti-Evil Gems": "Mischievous Dasha Lord / Counter Gem recommended"' },
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
  PLANETS, PLANET_TA, PLANET_GEMS, PLANET_GEMS_SOURCE, TAMIL_NAMES_NOTE, BOOK_RANK,
  KAPOOR_RULING_STONE, RULES, RAJ_KUMAR_TABLE, TILAK_RAJ_BY_SIGN, TILAK_RAJ_SOURCE, TILAK_RAJ_NODES, VERDICTS,
  TILAK_RAJ_RATNA, TILAK_RAJ_PLANET_CLASS, RAJ_KUMAR_WHO, RAJ_KUMAR_WHO_SOURCE, RAJ_KUMAR_COUNTER,
  SOURCES: { KAPOOR, TILAK_RAJ, RAJ_KUMAR },
};
