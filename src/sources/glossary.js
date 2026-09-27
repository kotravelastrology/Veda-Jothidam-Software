/**
 * VJ-026 — the Tamil glossary: term ↔ rule ↔ source locator.
 *
 * Each entry says what a Tamil term means, **which module implements the rule
 * that uses it**, and which registered source that module cites. The page
 * locator is not written here — it is read from the module's own
 * `attachSource` call at lookup time (`citationScan.js`).
 *
 * That is the whole point. A glossary that repeats the page numbers is a
 * second copy that drifts the first time a locator is corrected, and then it
 * shows a reader a page the engine no longer uses. Deriving it means the
 * glossary cannot claim a citation the code does not make — and when a
 * locator is still `TBD`, the glossary says so rather than implying the page
 * was checked.
 *
 * `locusMatch` picks one citation when a module makes several. If it matches
 * none, or more than one, lookup fails loudly instead of guessing — a term
 * silently bound to the wrong page would be the exact failure this design
 * exists to prevent.
 */

const { scanCitations } = require('./citationScan');
const { resolveByTitle } = require('./registry');

const TERMS = [
  {
    id: 'VARGA',
    ta: 'வர்க்கம்',
    translit: 'Varga',
    en: 'Divisional chart',
    meaning: 'ஒரு ராசியை மேலும் பிரித்து உருவாக்கப்படும் துணை கட்டம். ஒவ்வொரு '
      + 'வர்க்கமும் வாழ்வின் ஒரு துறையை நுணுக்கமாகப் பார்க்கப் பயன்படுகிறது '
      + '(எ.கா. நவாம்சம் D9 — திருமணம்).',
    module: 'chart/vargaChart.js',
  },
  {
    id: 'ASHTAKAVARGA',
    ta: 'அஷ்டகவர்க்கம்',
    translit: 'Ashtakavarga',
    en: 'Eight-fold bindu system',
    meaning: 'ஏழு கிரகங்களும் லக்னமும் ஒவ்வொரு ராசிக்கும் அளிக்கும் நன்மைப் '
      + 'புள்ளிகளின் (பிந்து) தொகுப்பு. மொத்தம் 337 பிந்துக்கள்.',
    module: 'chart/ashtakavarga.js',
  },
  {
    id: 'BHINNA_BINDU',
    ta: 'பிந்து',
    translit: 'Bindu',
    en: 'Benefic point',
    meaning: 'அஷ்டகவர்க்கத்தில் ஒரு கிரகம் ஒரு ராசிக்கு அளிக்கும் ஒரு நன்மைப் '
      + 'புள்ளி. பிந்து அதிகமெனில் அந்த ராசி/பாவம் வலுவானது.',
    module: 'chart/ashtakavargaVariations.js',
    locusMatch: 'BINDU_TABLE',
  },
  {
    id: 'SHODHANA',
    ta: 'சுத்தி (பிந்து சுருக்கம்)',
    translit: 'Shodhana',
    en: 'Reduction of bindus',
    meaning: 'மொத்த பிந்துக்களிலிருந்து திரிகோண மற்றும் ஏகாதிபத்திய சுருக்கம் '
      + 'செய்து, பலன் கணிப்புக்கான சுத்தமான எண்ணைப் பெறும் முறை.',
    module: 'chart/ashtakavargaVariations.js',
    locusMatch: 'Reduction of Bindus',
  },
  {
    id: 'CHANCHA_CHAKRA',
    ta: 'சஞ்சார சக்கரம்',
    translit: 'Chancha Chakra',
    en: 'Chancha Chakra',
    meaning: 'சர்வாஷ்டகவர்க்கப் புள்ளிகளை வைத்து கோச்சாரப் பலனை வாசிக்கும் '
      + 'அட்டவணை முறை.',
    module: 'chart/ashtakavargaVariations.js',
    locusMatch: 'Chancha Chakra',
  },
  {
    id: 'GOCHARA_AV',
    ta: 'அஷ்டகவர்க்க கோச்சாரம்',
    translit: 'Ashtakavarga Gochara',
    en: 'Transit through Ashtakavarga',
    meaning: 'கடந்து செல்லும் கிரகம் நிற்கும் ராசியின் பிந்து எண்ணிக்கையை வைத்து '
      + 'அந்தக் கோச்சாரத்தின் பலனை மதிப்பிடும் முறை.',
    module: 'chart/ashtakavargaTransit.js',
  },
  {
    id: 'SHADBALA',
    ta: 'ஷட்பலம்',
    translit: 'Shadbala',
    en: 'Six-fold planetary strength',
    meaning: 'ஸ்தான, திக், கால, நைசர்கிக, சேஷ்டா, திருக் — ஆறு வகை பலங்களைச் '
      + 'சேர்த்து ஒரு கிரகத்தின் மொத்த வலிமையை ரூபங்களில் அளக்கும் முறை.',
    module: 'chart/shadbala.js',
  },
  {
    id: 'BHAVA_BALA',
    ta: 'பாவ பலம்',
    translit: 'Bhava Bala',
    en: 'House strength',
    meaning: 'ஒவ்வொரு பாவத்தின் வலிமை — அதன் அதிபதி, அதில் நிற்கும் கிரகங்கள், '
      + 'அதன் மீது விழும் பார்வைகள் ஆகியவற்றைச் சேர்த்துக் கணக்கிடப்படுவது.',
    module: 'chart/bhavaBala.js',
  },
  {
    id: 'KARAKA',
    ta: 'காரகன்',
    translit: 'Karaka',
    en: 'Significator',
    meaning: 'ஒரு பொருளையோ உறவையோ குறிக்கும் கிரகம். நைசர்கிக (இயற்கை), '
      + 'பாவ மற்றும் யோக காரகர்கள் என வகைப்படும்.',
    module: 'chart/karaka.js',
  },
  {
    id: 'NABHASA_YOGA',
    ta: 'நாபச யோகம்',
    translit: 'Nabhasa Yoga',
    en: 'Nabhasa yoga',
    meaning: 'கிரகங்கள் கட்டத்தில் அமையும் வடிவ அமைப்பால் உருவாகும் யோகங்கள் — '
      + 'ஆக்ருதி, சங்க்யா, தள, ஆஸ்ரய என நான்கு வகை.',
    module: 'chart/nabhasaYoga.js',
  },
  {
    id: 'VIMSHOTTARI',
    ta: 'விம்சோத்தரி தசை',
    translit: 'Vimshottari Dasha',
    en: 'Vimshottari period system',
    meaning: 'சந்திர நட்சத்திரத்திலிருந்து தொடங்கும் 120 ஆண்டு தசைச் சுழற்சி. '
      + 'ஒவ்வொரு கிரகத்துக்கும் நிர்ணயிக்கப்பட்ட ஆண்டுகள் உண்டு.',
    module: 'dasha/vimshottariDasha.js',
  },
  {
    id: 'RAHU_KALAM',
    ta: 'ராகு காலம்',
    translit: 'Rahu Kalam',
    en: 'Rahu period of the day',
    meaning: 'பகலை எட்டாகப் பிரித்து, கிழமைக்கேற்ப ஒரு பகுதி ராகுவுக்கு உரியதாகக் '
      + 'கொள்ளப்படுவது. சுப காரியங்கள் தவிர்க்கப்படும் நேரம்.',
    module: 'panchangam/kalams.js',
    locusMatch: '20-21',
  },
  {
    id: 'YAMAGANDAM',
    ta: 'எமகண்டம் / குளிகை',
    translit: 'Yamagandam / Gulika',
    en: 'Yama and Gulika periods',
    meaning: 'ராகு காலம் போலவே கிழமை அடிப்படையில் நிர்ணயிக்கப்படும் மேலும் இரு '
      + 'தவிர்க்கத்தக்க நேரப் பகுதிகள்.',
    module: 'panchangam/kalams.js',
    locusMatch: '22-23',
  },
  {
    id: 'PANCHANGAM',
    ta: 'பஞ்சாங்கம்',
    translit: 'Panchangam',
    en: 'The five limbs of the day',
    meaning: 'திதி, வாரம், நட்சத்திரம், யோகம், கரணம் — ஒரு நாளின் ஐந்து '
      + 'அங்கங்கள். திருக்கணித முறையில் கணிக்கப்படுகிறது.',
    module: 'panchangam/tirukanitaPanchangam.js',
  },
  {
    id: 'SARVATOBHADRA',
    ta: 'சர்வதோபத்ர சக்கரம்',
    translit: 'Sarvatobhadra Chakra',
    en: 'Sarvatobhadra Chakra',
    meaning: '28 நட்சத்திரங்களை 9×9 கட்டத்தின் விளிம்பில் அமைத்து, வேதை '
      + '(குத்தல்) உறவுகளைப் பார்க்கும் முகூர்த்த அட்டவணை.',
    module: 'chart/sarvatobhadraChakra.js',
  },
  {
    id: 'RASHI_CHAKRA',
    ta: 'ராசி சக்கரம்',
    translit: 'Rashi Chakra',
    en: 'Rashi Chakra',
    meaning: 'பன்னிரு ராசிகளின் அமைப்பை ஒரு சக்கரமாக வரைந்து பகுப்பாய்வு '
      + 'செய்யும் முறை.',
    module: 'chart/rashiChakra.js',
  },
  {
    id: 'NADI_CHAKRA',
    ta: 'நாடி சக்கரம்',
    translit: 'Nadi Chakra',
    en: 'Nadi Chakra',
    meaning: 'நட்சத்திரங்களை நாடிப் பிரிவுகளாக அமைத்துப் பார்க்கும் சக்கரம்.',
    module: 'chart/nadiChakra.js',
  },
  {
    id: 'DASHA_CHAKRA',
    ta: 'தசா சக்கரம்',
    translit: 'Dasha Chakra',
    en: 'Dasha Chakra',
    meaning: 'தசைக் காலங்களை சக்கர வடிவில் காட்டி, நடப்புக் காலத்தை '
      + 'ஒப்பிடும் அமைப்பு.',
    module: 'chart/dashaChakra.js',
  },
  {
    id: 'YANTRA_CHAKRA',
    ta: 'யந்திர சக்கரம்',
    translit: 'Yantra Chakra',
    en: 'Yantra Chakra',
    meaning: 'எண் அமைப்புகளைக் கொண்ட யந்திரக் கட்டங்கள், பரிகாரம் தொடர்பாகப் '
      + 'பயன்படுத்தப்படுபவை.',
    module: 'chart/yantras.js',
  },
  // ── Below: the rule is implemented, the page is not yet verified ──────────
  {
    id: 'RAJA_YOGA',
    ta: 'ராஜ யோகம்',
    translit: 'Raja Yoga',
    en: 'Raja yoga',
    meaning: 'கேந்திர மற்றும் திரிகோண அதிபதிகளின் தொடர்பால் உருவாகும், '
      + 'உயர்வையும் அதிகாரத்தையும் தரும் யோகங்கள்.',
    module: 'chart/rajaYogas.js',
  },
  {
    id: 'DHANA_YOGA',
    ta: 'தன யோகம்',
    translit: 'Dhana Yoga',
    en: 'Wealth yoga',
    meaning: '2, 5, 9, 11 ஆகிய பாவங்களின் அதிபதிகளின் தொடர்பால் உருவாகும் '
      + 'செல்வ யோகங்கள்.',
    module: 'chart/wealthYogas.js',
  },
  {
    id: 'LAGNA_YOGA',
    ta: 'லக்ன யோகங்கள்',
    translit: 'Lagna-specific yogas',
    en: 'Ascendant-specific yogas',
    meaning: 'ஒவ்வொரு லக்னத்துக்கும் தனித்தனியாகக் கூறப்பட்ட யோக அமைப்புகள்.',
    module: 'chart/lagnaSpecificYogas.js',
  },
  {
    id: 'LUNAR_SOLAR_YOGA',
    ta: 'சந்திர / சூரிய யோகங்கள்',
    translit: 'Lunar and solar yogas',
    en: 'Lunar and solar yogas',
    meaning: 'சந்திரனை ஒட்டிய சுனபா/அனபா/துரதுரா/கேமத்ரும மற்றும் சூரியனை '
      + 'ஒட்டிய வேசி/வோசி/உபயசரி யோகங்கள்.',
    module: 'chart/lunarSolarYogas.js',
  },
  {
    id: 'EDGE_YOGA',
    ta: 'சிறப்பு யோகங்கள்',
    translit: 'Edge-case yogas',
    en: 'Edge-case yogas',
    meaning: 'அரிதாக அமையும், கூடுதல் நிபந்தனைகள் கொண்ட யோக அமைப்புகள்.',
    module: 'chart/edgeCaseYogas.js',
  },
  {
    id: 'CHART_QUALITY',
    ta: 'ஜாதகத் தரம்',
    translit: 'Chart quality',
    en: 'Overall chart assessment',
    meaning: 'யோகங்கள், பலங்கள், தோஷங்கள் ஆகியவற்றைச் சேர்த்து ஜாதகத்தின் '
      + 'ஒட்டுமொத்த நிலையை மதிப்பிடும் தொகுப்பு.',
    module: 'chart/chartQuality.js',
  },
  {
    id: 'DOSHA',
    ta: 'தோஷம்',
    translit: 'Dosha',
    en: 'Affliction',
    meaning: 'ஒரு குறிப்பிட்ட அமைப்பால் ஏற்படும் குறைபாடு. BPHS அத்.83 '
      + 'அடிப்படையிலான தோஷங்கள்.',
    module: 'chart/doshas.js',
    locusMatch: 'Ch.83',
  },
  {
    id: 'KUJA_DOSHA',
    ta: 'செவ்வாய் தோஷம்',
    translit: 'Kuja / Mangal Dosha',
    en: 'Mars affliction',
    meaning: 'செவ்வாய் 1, 2, 4, 7, 8, 12 ஆகிய பாவங்களில் அமைவதால் திருமணத்துக்குக் '
      + 'கூறப்படும் தோஷம். இது ஒரே செய்யுளிலிருந்து வராமல் மரபு வழக்கிலிருந்து '
      + 'வருவது — அதனால் ஆதார நிலை வேறுபடுகிறது.',
    module: 'chart/doshas.js',
    locusMatch: 'traditional rule',
  },
];

/** Thrown rather than returning a wrong page number. */
class GlossaryError extends Error {}

let cache = null;
const citations = () => (cache ??= scanCitations());

/** Clears the cached scan — only needed by tests that write source files. */
function resetGlossaryCache() { cache = null; }

/**
 * Resolves one term to the citation its rule actually makes.
 *
 * Returns the source (from the registry, with its rights), the live
 * `pageLocus` and whether that locator is complete — never a page number
 * typed into this file.
 */
function describeTerm(term) {
  const all = citations().filter((c) => c.module === term.module);
  if (all.length === 0) {
    throw new GlossaryError(`${term.id}: ${term.module} cites no source`);
  }
  const matched = term.locusMatch
    ? all.filter((c) => c.pageLocus.includes(term.locusMatch))
    : all;
  if (matched.length !== 1) {
    throw new GlossaryError(
      `${term.id}: ${term.module} has ${all.length} citations and `
      + `locusMatch ${JSON.stringify(term.locusMatch ?? null)} selected ${matched.length}. `
      + 'A term must name exactly one.',
    );
  }
  const citation = matched[0];
  const source = resolveByTitle(citation.title);
  if (!source) {
    throw new GlossaryError(`${term.id}: "${citation.title}" is not a registered source`);
  }
  return {
    ...term,
    source: {
      id: source.id, title: source.title, titleTa: source.titleTa,
      author: source.author, file: source.file, tradition: source.tradition,
      rights: source.rights,
    },
    pageLocus: citation.pageLocus,
    locatorComplete: citation.complete,
    citedAt: `src/${citation.module}:${citation.line}`,
  };
}

/** The whole glossary, resolved. Throws if any term cannot be resolved. */
function buildGlossary() {
  return TERMS.map(describeTerm);
}

module.exports = { TERMS, buildGlossary, describeTerm, resetGlossaryCache, GlossaryError };
