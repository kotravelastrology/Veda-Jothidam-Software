/**
 * The deeds each nakshatra suits — Kalyanraman, Muhoortha Sangraha vol. 1, chapter 9.
 *
 * "Nakshatras and Suitable deeds" (printed pp.140-215): the seven kinds of nakshatra with their weekdays, the three
 * "mukha" groups, then for each of the 27 stars (and Abhijit) the deeds it is "good for performing" and a second,
 * alphabetical list of what it "can also be selected for". The deeds are kept in the book's own English words
 * (`data/nakshatraDeeds.json`, read from the page images with the scan's run-together words separated and a few
 * misprints noted in the docs); the headings, classes and notes are ours, in Tamil. This book gives the deeds by
 * star where the other nine give the stars by act, so the page is the same material read the other way round.
 *
 * Stars are 0-26 from Ashwini; Abhijit is index 27.
 */

const { BOOKS: { KALYANRAMAN_V1 } } = require('./muhurtaStarTables');
const { NAKSHATRA_TA } = require('./babyNames');
const DATA = require('./data/nakshatraDeeds.json').slice().sort((a, b) => a.index - b.index);

const deepFreeze = (o) => {
  Object.values(o).forEach((v) => { if (v && typeof v === 'object') deepFreeze(v); });
  return Object.freeze(o);
};

const PRINTED_OFFSET = 10; // printed page = scan page - 10, in this volume

const NAMES_TA = Object.freeze([...NAKSHATRA_TA, 'அபிஜித்']);

/** The seven kinds, as the book's pp.140-143 give them: the stars, the weekday, and what each suits. */
const CLASSES = deepFreeze({
  STHIRA: {
    nameTa: 'ஸ்திர / துருவம் (நிலையானது)', stars: [3, 11, 20, 25], vara: 'ஞாயிறு', borrowsTa: 'மிருது நட்சத்திரங்களுக்குரிய காரியங்களும் (வசிஷ்டர்)',
    suitsTa: 'நிலையான, நிரந்தரப் பலன் தரும் காரியங்கள்: விதை விதைத்தல், புது வீடு புகுதல், விரதம், அஸ்திவாரம், கிரகப்பிரவேசம், சத்தியம் செய்தல். உத்திரமும் உத்திரட்டாதியும் புதிய தொழிலுக்குச் சிறப்பு.',
  },
  CHARA: {
    nameTa: 'சர / சலம் (இயங்குவது)', stars: [6, 14, 21, 22, 23], vara: 'திங்கள்', borrowsTa: 'லகு (க்ஷிப்ர) நட்சத்திரங்களுக்குரிய காரியங்களும்',
    suitsTa: 'தோட்டம், பயணம், வாகனம் வாங்குதல், ஓட்டுதல், நிலையற்ற தன்மையுடைய நற்காரியங்கள். சுவாதி திருமணம், புதிய தொழிலுக்கும்; சதயம் புதிய தொழில், கிரகப்பிரவேசத்துக்கும்; புனர்பூசம் கிரகப்பிரவேசத்துக்கும்.',
  },
  MISRA: {
    nameTa: 'மிஸ்ர / சாதாரணம் (கலப்பு)', stars: [2, 15], vara: 'புதன்', borrowsTa: 'உக்ர நட்சத்திரங்களுக்குரிய காரியங்களும்',
    suitsTa: 'யாக ஹோமம், கலப்படம் / கலத்தல், தானம் (விருப்ப நிறைவுக்கு எருது தானம்), வழக்கமான தினசரிக் கடமைகள், தியானம். புதிய முக்கியப் பணிக்கு ஆகாது.',
  },
  UGRA: {
    nameTa: 'உக்ர / க்ரூரம் (கடுமையானது)', stars: [1, 9, 10, 19, 24], vara: 'செவ்வாய்', borrowsTa: 'தீக்ஷ்ண நட்சத்திரங்களுக்குரிய காரியங்களும்',
    suitsTa: 'தீய தன்மையுள்ள செயல்கள்: பதுங்கித் தாக்குதல், கொலை, தீ வைத்தல், ஏமாற்றுதல், விஷம் கொடுத்தல், ஆயுதம் செய்தல் / பயன்படுத்துதல். புதிதாக எதையும் தொடங்கத் தகாதவை; பூரம் மட்டும் அதிர்ஷ்டமானது.',
  },
  KSHIPRA: {
    nameTa: 'க்ஷிப்ர / லகு (விரைவானது)', stars: [0, 7, 12], vara: 'வியாழன்', borrowsTa: 'சர நட்சத்திரங்களுக்குரிய காரியங்களும்',
    suitsTa: 'அலங்காரம், உல்லாசப் பயணம், விளையாட்டு, வணிகம் தொடங்குதல், பயணம், மருந்து கொடுத்தல்; விற்பனை, நகை வாங்குதல், 64 கலைகள். அஸ்தம் திருமணத்துக்கும்; அசுவினியும் பூசமும் புதிய தொழிலுக்குச் சிறந்தவை; பூசம், அஸ்தம் கிரகப்பிரவேசத்துக்கும். (அபிஜித்தும் இந்தப் பிரிவில்.)',
  },
  MRIDU: {
    nameTa: 'மிருது / மைத்ரம் (மென்மையானது)', stars: [4, 13, 16, 26], vara: 'வெள்ளி', borrowsTa: 'ஸ்திர (துருவ) நட்சத்திரங்களுக்குரிய காரியங்களும்',
    suitsTa: 'இசை, ஆடை-நகை செய்தல் / அணிதல், கருத்தரிக்கும் உறவு, நடனம், கலை, சடங்குகள், விளையாட்டு, நண்பர் தொடர்பான விஷயங்கள். மிருகசீரிடம், அனுஷம், ரேவதி கிரகப்பிரவேசத்துக்கும்; மிருகசீரிடம், அனுஷம் திருமணத்துக்கும் (சித்திரை, ரேவதி ஆகாது).',
  },
  TEEKSHNA: {
    nameTa: 'தீக்ஷ்ண / தாருணம் (கூர்மையானது)', stars: [5, 8, 17, 18], vara: 'சனி', borrowsTa: null,
    suitsTa: 'பிரித்தல், வாதம் புரிதல், வலிமையான மந்திர ஜபம், வெட்டுதல் போன்ற கடினமான செயல்கள்; சூனியம், ஆபிசாரம், மோகனம், உச்சாடனம். திருவாதிரை புதிய தொழிலுக்கும் புது வீட்டை ஆசீர்வதிக்கவும் நல்லது.',
  },
});
const CLASS_OF = Object.freeze(Object.fromEntries(Object.entries(CLASSES).flatMap(([k, c]) => c.stars.map((s) => [s, k])).concat([[27, 'KSHIPRA']])));

/** Three groups of nine by the way the star "looks" (pp.143-144). */
const MUKHA = deepFreeze({
  URDHVA: {
    nameTa: 'ஊர்த்வமுகம் (மேல்நோக்கு)', stars: [3, 5, 7, 11, 20, 21, 22, 23, 25],
    suitsTa: 'கட்டுமானம் (சுற்றுச்சுவர், வீடு, மண்டபம், கோயில்), கொடியேற்றம், திருமணம் போன்ற சடங்குகள், முடிசூட்டு.',
  },
  ADHO: {
    nameTa: 'அதோமுகம் (கீழ்நோக்கு)', stars: [1, 2, 8, 9, 10, 15, 18, 19, 24],
    suitsTa: 'கிணறு, குளம் தோண்டுதல் / ஆழப்படுத்துதல், சுரங்கம், மறைந்த புதையல் தேடுதல், ஜோதிடம், சிற்பம், மறைபொருள் கல்வி, கணிதம், நிலத்தடிப் பாதை அமைத்தல்.',
  },
  TIRYANG: {
    nameTa: 'திர்யங்முகம் (நேர்நோக்கு)', stars: [0, 4, 6, 12, 13, 14, 16, 17, 26],
    suitsTa: 'வாகனம் வாங்குதல், குதிரை / ஒட்டகம் வாங்கிப் பழக்குதல், பாடுதல், இசைக்கருவி வாசித்தல், வாகனம் ஓட்டக் கற்றல், கடிதத் தொடர்பு, நீர் / நில / வான் பயணம்.',
  },
});
const MUKHA_OF = Object.freeze(Object.fromEntries(Object.entries(MUKHA).flatMap(([k, m]) => m.stars.map((s) => [s, k]))));

/** Kula (the attacked) / Akula (the attacker) / Kulakula (compromise): who the star favours in a dispute. */
const KULA_TA = Object.freeze({
  KULA: 'குலம் — தாக்கப்பட்டவருக்கு / எதிர்வாதிக்கு மட்டுமே வெற்றி',
  AKULA: 'அகுலம் — தாக்குபவருக்கு / வாதிக்கு வெற்றி; வழக்குகளைத் தொடங்க நல்லது',
  KULAKULA: 'குலாகுலம் — வழக்கில் சமரசம்',
});

const SOURCE = Object.freeze({ ...KALYANRAMAN_V1, pageLocus: 'Chapter 9 "Nakshatras and Suitable deeds", printed pp.140-215 (PDF 150-225)' });

const pageLocus = (s) => `Chapter 9 "Nakshatras and Suitable deeds", ${NAMES_EN_UP[s.index]}, printed pp.${s.pdfFrom - PRINTED_OFFSET}-${s.pdfTo - PRINTED_OFFSET} (PDF ${s.pdfFrom}-${s.pdfTo})`;
const NAMES_EN_UP = Object.freeze(DATA.map((s) => s.nameEn.toUpperCase()));

/** The 28 entries: Tamil name, kind, mukha, kula, the two lists and the book's own page. */
const STARS = deepFreeze(DATA.map((s) => ({
  index: s.index, nameEn: s.nameEn, nameTa: NAMES_TA[s.index],
  classKey: CLASS_OF[s.index], mukhaKey: s.index === 27 ? null : MUKHA_OF[s.index], kula: s.kula, borrows: s.index === 27 ? 'Chara' : s.borrows, // Abhijit: "Things which are preferred for the Chara nakshatras can also be performed"
  introEn: s.intro, good: s.good, also: s.also,
  pageFrom: s.pdfFrom - PRINTED_OFFSET, pageTo: s.pdfTo - PRINTED_OFFSET,
  source: { ...KALYANRAMAN_V1, pageLocus: pageLocus(s) },
})));

/**
 * Tamil words to the English the book uses, for searching. Each is a regular expression over the deed text
 * (case-insensitive); a query may mix Tamil and English words, and a deed matches when it has every word.
 */
const SYNONYMS = deepFreeze({
  'திருமணம்': 'marriage(?![- ]?halls?)', 'கல்யாணம்': 'marriage(?![- ]?halls?)', 'வீடு': 'house|home', 'கிரகப்பிரவேசம்': 'gruhapravesha|house[- ]?warming|entering (a |an )?(new|old|rented)', 'புதுமனை': 'gruhapravesha|house[- ]?warming',
  'பயணம்': 'journey|travel|expedition', 'உபநயனம்': 'upanayan', 'அன்னப்பிராசனம்': 'annaprasana|anna prasana', 'நாமகரணம்': 'naamakarana|namakarana|christening',
  'கல்வி': 'learn|study|studies|education', 'வித்யாரம்பம்': 'vidyaarambha', 'வாகனம்': 'vehicle|conveyance', 'கடன்': 'loan|debt|borrow|repay',
  'விதை': 'sowing|seeds', 'வேலை': 'job|service|employ', 'நிலம்': 'land|propert', 'மருந்து': 'medic', 'சிகிச்சை': 'treatment|medication',
  'அறுவை': 'surgery', 'ஆயுதம்': 'weapon|arms|ammunition', 'போர்': 'war|battle|combat', 'வழக்கு': 'court|legal|litigation|dispute',
  'கட்டுமானம்': 'construct', 'கிணறு': 'well', 'கோயில்': 'temple', 'ஆடை': 'cloth|garment|apparel', 'நகை': 'jewel|ornament|gold|silver',
  'வணிகம்': 'business|trade|trading|commerc|shop', 'வியாபாரம்': 'business|trade|trading|commerc|shop', 'விவசாயம்': 'agricultur|farming|plough|crop',
  'பசு': 'cow|oxen|\\box\\b', 'மாடு': 'cow|oxen|\\box\\b', 'குதிரை': 'horse', 'குழந்தை': 'child|new born|newborn', 'பிள்ளை': 'child',
  'மொட்டை': 'tonsure', 'சவரம்': 'tonsure|hair|shav', 'காதுகுத்து': 'ear-?boring|ear boring', 'சீமந்தம்': 'seemantha', 'புஸவனம்': 'pumsavana',
  'வாஸ்து': 'vaastu|vastu', 'யாகம்': 'yaga|yagjna|homa|agnihotra', 'ஹோமம்': 'homa|yaga|agnihotra', 'சாந்தி': 'shanthi|peace',
  'இசை': 'music|musical', 'நடனம்': 'dance', 'ஜோதிடம்': 'astrology', 'காப்பீடு': 'insurance', 'அடிக்கல்': 'foundation',
  'தோட்டம்': 'garden', 'திருட்டு': 'theft|thieve', 'விஷம்': 'poison', 'கொலை': 'murder|killing|\\bkill', 'ஆசிரியர்': 'teach', 'தானம்': 'daana|donat|giving away',
  'ஒப்பந்தம்': 'treaty|agreement|contract', 'முடிசூட்டு': 'coronation', 'சத்தியம்': 'oath', 'கடிதம்': 'correspondence|letter', 'விளையாட்டு': 'sport|games|play',
});

const OUR_READINGS_TA = Object.freeze([
  'காரியங்கள் நூலின் ஆங்கிலச் சொற்களிலேயே; தலைப்புகள், வகைகள், குறிப்புகள் தமிழில். தமிழ்ச் சொல்லால் தேடினால் அதற்கான ஆங்கிலச் சொற்களில் தேடப்படும்.',
  'நூல் ஒவ்வொரு நட்சத்திரத்துக்கும் இரு பட்டியல் தருகிறது: "செய்ய ஏற்றது" (பத்தி பத்தியாக) மற்றும் "இவற்றுக்கும் தேர்ந்தெடுக்கலாம்" (அகர வரிசை). இரண்டும் அப்படியே.',
  'ஸ்கேனில் தடித்த எழுத்துச் சொற்கள் இடைவெளி இன்றி ஒட்டியுள்ளன (Causingdeceit); அவை பிரிக்கப்பட்டுள்ளன. அச்சுப் பிழைகள் (எ.கா. சித்திரையில் "Moingspinning") அடுத்தடுத்த நட்சத்திரப் பட்டியல் ஒப்பீட்டால் "Doing spinning" என்று படிக்கப்பட்டுள்ளன.',
  'மற்ற ஒன்பது நூல்கள் செயலுக்கு நட்சத்திரம் தருகின்றன (/muhurta-stars); இங்கே நட்சத்திரத்துக்குச் செயல் — அதே பொருள் தலைகீழாக. இரண்டும் எப்போதும் ஒத்துப்போவதில்லை; ஒப்பிடுவது உங்கள் பார்வைக்கு.',
  'இந்த நூல் கால கணிப்பைச் செய்யவில்லை; இது நட்சத்திரப் பட்டியல் மட்டுமே — திதி, கிழமை, லக்னம் முதலிய விதிகளை இது சொல்லவில்லை.',
]);

const DIFFERENCES = deepFreeze([
  { id: 'OTHER_CLASSES', textTa: 'ஒவ்வொரு வகையும் இன்னொரு வகையின் காரியங்களை ஏற்கிறது (ஸ்திரம் ← மிருது; சரம் ← லகு; மிஸ்ரம் ← உக்ரம்; உக்ரம் ← தீக்ஷ்ணம்; லகு ← சரம்; மிருது ← ஸ்திரம்); தீக்ஷ்ணம் எதையும் ஏற்பதாக அச்சில் இல்லை. இது ஒவ்வொரு நட்சத்திரத்தின் அறிமுகப் பகுதியில் உள்ளபடி; அந்த வகையின் பட்டியல்கள் இங்கே சேர்க்கப்படவில்லை.' },
  { id: 'NO_TIME_RULES', textTa: 'இந்த அத்தியாயம் நட்சத்திரம் மட்டுமே சொல்கிறது; திதி, கிழமை, லக்னம் ஆகியவற்றை ஒவ்வொரு காரியத்துக்கும் மற்ற நூல்களிலும், இதே நூலின் தொகுதி 2 இலும் (/muhurta-stars) காண்க.' },
]);

module.exports = {
  PRINTED_OFFSET, NAMES_TA, CLASSES, CLASS_OF, MUKHA, MUKHA_OF, KULA_TA, SOURCE, STARS, SYNONYMS, OUR_READINGS_TA, DIFFERENCES,
};
