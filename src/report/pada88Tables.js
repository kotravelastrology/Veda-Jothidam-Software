/**
 * The 88th nakshatra pada — the books' statements.
 *
 * Counted from the pada (quarter, 3°20′) of the natal Moon, that pada being
 * the 1st, the 88th pada is evil. Two transit books say what each planet does
 * there: Raj Kumar (a table for all nine, Jupiter's aspect giving relief) and
 * Vishnu Bhaskar (adverse to the planet's significations). Two muhurta books
 * use the same pada for the quality of a time: Kalaprakasika (four places —
 * shaving, a patient's critical period, generally inauspicious, and a remedy)
 * and Shubhakaran. Order by words (owner's rule, 2026-10-03): Raj Kumar 299,
 * Kalaprakasika 131, Vishnu Bhaskar 81, Shubhakaran 21.
 */

const { SOURCES: { VISHNU_BHASKAR, SHUBHAKARAN } } = require('./saturnTransitTables');
const { SOURCES: { RAJ_KUMAR_CHARISMA } } = require('./moorthiTables');

const deepFreeze = (o) => {
  Object.values(o).forEach((v) => { if (v && typeof v === 'object') deepFreeze(v); });
  return Object.freeze(o);
};

const KALAPRAKASIKA = Object.freeze({
  title: 'Kalaprakasika',
  author: 'N.P. Subramania Iyer (translator)',
  file: 'kalaprakasika-nps-iyer-1982/raw-scans/full-scan.pdf',
  tradition: 'Tamil / Sanskrit classical (muhurta)',
});

/** Padas counted from the natal pada, which is the 1st. */
const COUNT = 88;
const PADAS = 108;
/** The 88th pada (0-107) from a natal pada (0-107). */
const pada88Of = (natalPada) => (natalPada + COUNT - 1) % PADAS;

const COUNT_SOURCES = Object.freeze({
  RAJ_KUMAR: Object.freeze({ ...RAJ_KUMAR_CHARISMA, pageLocus: 'Section 6.4 "88th Nakshtra Pada", PDF pp.265-266 — "born with the Moon in 3rd pada of Rohini Nakshtra. The 88thpada of 22nd Nakshtra from it will be 2ndpada of Uttar-bhadrapad"' }),
  VISHNU_BHASKAR: Object.freeze({ ...VISHNU_BHASKAR, pageLocus: 'Chapter 14, Part A, item 12 "Transit over 88th Nakshatra Pada (Charan)", printed p.141 (PDF page 55 of volume-1 part 02) — "A person born in Ashwini 1st Pada will have 4th Pada of Sravana as its 88th Pada"' }),
});

/** The books' worked examples: [book, natal star 0-26, natal pada 1-4, 88th star, 88th pada]. */
const EXAMPLES = deepFreeze([
  ['RAJ_KUMAR', 3, 3, 25, 2],
  ['VISHNU_BHASKAR', 0, 1, 21, 4],
]);

/** Raj Kumar, Table No.21 — each planet transiting the 88th pada. */
const RAJ_KUMAR_EFFECTS = deepFreeze({
  Sun: 'தொழில் / வியாபாரத்தில் இழப்பு; அரசு அல்லது மேலதிகாரிகளின் கோபம்; உறவினருடன் தகராறு, குடும்பப் பிளவு',
  Moon: 'மன அழுத்தம், வேதனை; தாய்வழி உறவுகளுடன் தொல்லை; ஊக வணிகத்தில் இழப்பு, நோய்',
  Mars: 'ஆயுதம் / வாகன விபத்தால் காயம்; மருத்துவமனை, அறுவை சிகிச்சை; உடன்பிறந்தோருடன் தகராறு; அசையாச் சொத்து வழக்கு',
  Mercury: 'தோல் / நரம்பு நோய்கள்; திருட்டு, கொள்ளையால் இழப்பு; வாராக் கடன், ஊக வணிகத்தால் இழப்பு',
  Jupiter: 'செல்வ இழப்பு, கல்வியில் தோல்வி; பிள்ளைகளுக்கு நோய் அல்லது பிள்ளைகளால் இழப்பு',
  Venus: 'வியாபாரம் / கூட்டாண்மையில் இழப்பு, தகராறு; துணையால் இழப்பு / பெண்ணால் ஏமாற்றம்; நீண்டகால நோய்',
  Saturn: 'பெண்கள் / விதவைகளுடனான உறவால் அவமானம்; விபத்தால் உடல்நலக் குறைவு, எலும்பு முறிவு; சமூகத்தில் அவமரியாதை அல்லது குடும்பப் பிணக்கு',
  Rahu: 'தகராறுகளில் தோல்வி; ஏமாற்றத்தால் இழப்பு; தீயவர்கள் / எதிரிகளால் ஏமாற்றம், சேதம்',
  Ketu: 'தாய்வழி உறவுகள் இழப்பு; நண்பர், உறவினருடன் தகராறு; சமய நிறுவனங்களுக்கு அவமரியாதை; புரோகிதர்களின் சாபம்',
});

const STATEMENTS = deepFreeze({
  RAJ_KUMAR: {
    kind: 'TRANSIT',
    textTa: 'சுபரோ பாபரோ, எந்தக் கிரகம் 88-வது பாதத்தைக் கடந்தாலும் தீய பலனே. தீமையின் அளவு அந்தக் கிரகத்தின் ஜாதக இயல்பு, பலம், நிலை, அந்த நேரத்தில் அந்தப் பாதத்தில் உள்ள கிரகங்களின் எண்ணிக்கை ஆகியவற்றைப் பொறுத்தது. கோசாரக் குரு அந்தக் கிரகங்களைப் பார்த்தால் சற்றுத் தணிவு.',
    sources: [Object.freeze({ ...RAJ_KUMAR_CHARISMA, pageLocus: 'Section 6.4, PDF pp.265-267 — "Planets, whether malefic or benefic, while transiting the 88th Nakshtra pada ... always give malefic results"; "if transiting Jupiter aspects the planets in 88thpada, some relief may be expected"; Table No.21' })],
  },
  KALAPRAKASIKA: {
    kind: 'TIME',
    items: [
      { id: 'SHAVING', textTa: 'முடி திருத்தத்துக்கு: ஜன்ம நட்சத்திரப் பாதத்திலிருந்து 88-வது பாதம் தவிர்க்கப்பட வேண்டும்.', source: Object.freeze({ ...KALAPRAKASIKA, pageLocus: 'printed p.40 (PDF 70), tonsure — "The 88th quarter from that of the asterism at birth should be avoided"' }) },
      { id: 'PATIENT', textTa: 'உடல்நலம் குன்றும் நோயாளிக்கு நெருக்கடிக் காலங்கள்: சந்திராஷ்டமம், தக்த யோகம், ஜன்ம நட்சத்திரம், அதிலிருந்து 22-வது நட்சத்திரம், பிறப்பில் சந்திரன் இருந்த பாதத்திலிருந்து 88-வது பாதம், செவ்வாய், சனி, ஞாயிறு, விஷநாடி (தியாஜ்யம்), அந்திப் பொழுது.', source: Object.freeze({ ...KALAPRAKASIKA, pageLocus: 'printed p.160 (PDF 190) — "The Critical Time ... the 88th stellar quarter from that occupied by the Moon at birth"' }) },
      { id: 'INAUSPICIOUS', textTa: 'வைநாசிகம் (ஜன்ம நட்சத்திரத்திலிருந்து 22-வது) அழிவைக் குறிக்கும், தவிர்க்க வேண்டும்; பிறப்புப் பாதத்திலிருந்து 88-வது "நட்சத்திர பாதமும்" அசுபம்.', source: Object.freeze({ ...KALAPRAKASIKA, pageLocus: 'printed p.167 (PDF 197) — "Vainasika ... The 88th Naksathra-Padha (stellar quarter) from that at birth is also inauspicious"' }) },
      { id: 'REMEDY', textTa: 'பரிகாரம்: (அந்த நேரத்தின்) லக்னாதிபதியும் 10-ஆம் வீட்டு அதிபதியும் நண்பர்கள் என்றால், ஜன்ம நட்சத்திரத்திலிருந்து 88-வது பாதம் தரும் தீமை நீங்கும்.', source: Object.freeze({ ...KALAPRAKASIKA, pageLocus: 'printed p.190 (PDF 220) — "If the lord of the rising sign and that of the 10th house be friends, the adverse effects produced by the 88th stellar quarter (in the 22nd asterism) from that of the Jenma-Nakshathra will vanish"' }) },
    ],
  },
  VISHNU_BHASKAR: {
    kind: 'TRANSIT',
    textTa: 'பொதுவாக, ஒரு கிரகம் 88-வது பாதத்தைக் கடப்பது அசுபம் — அந்தக் கிரகத்தின் காரகத்துவங்களுக்கும் தொடர்புடைய வீடுகளுக்கும் தீய பலன். ஆனால் அதன் நிலை, பார்வை, சேர்க்கை முதலியவற்றையும் பார்க்க வேண்டும்.',
    sources: [COUNT_SOURCES.VISHNU_BHASKAR],
  },
  SHUBHAKARAN: {
    kind: 'TIME',
    textTa: 'ஜன்ம நட்சத்திரப் பாதத்திலிருந்து 88-வது பாதத்தில் விழும் நேரத்தில் சுப காரியம் எதுவும் செய்யக் கூடாது.',
    sources: [Object.freeze({ ...SHUBHAKARAN, pageLocus: 'PDF page 357 (printed 357), muhurta rule 10 — "No auspicious work should be done when such time falls in 88th quarter counted from the quarter of one\'s birth constellation"' })],
  },
});

const PADA88_RANK = deepFreeze({
  order: ['RAJ_KUMAR', 'KALAPRAKASIKA', 'VISHNU_BHASKAR', 'SHUBHAKARAN'],
  words: { RAJ_KUMAR: 299, KALAPRAKASIKA: 131, VISHNU_BHASKAR: 81, SHUBHAKARAN: 21 },
  measureTa: '88-வது பாதம் பற்றிய பகுதியின் சொற்கள்: ராஜ் குமார் 299 (Charisma of Planets §6.4, அட்டவணை 21 உட்பட); காலப்பிரகாசிகை 131 (பக்.40, 160, 167, 190 — நான்கு இடங்கள்); விஷ்ணு பாஸ்கர் 81 (அத்.14, ப.141); சுபகரன் 21 (ப.357).',
});

const BOOK_TA = deepFreeze({ RAJ_KUMAR: 'ராஜ் குமார்', KALAPRAKASIKA: 'காலப்பிரகாசிகை', VISHNU_BHASKAR: 'விஷ்ணு பாஸ்கர்', SHUBHAKARAN: 'சுபகரன்' });

const PADA88_DIFFERENCES = deepFreeze([
  {
    id: 'TWENTY_SECOND',
    textTa: '"22-வது நட்சத்திரத்தில்": ராஜ் குமார் "22-வது நட்சத்திரத்தின் 88-வது பாதம்" என்று எழுதுகிறார்; காலப்பிரகாசிகையின் மொழிபெயர்ப்பாளர் அடைப்புக்குள் "(22-வது நட்சத்திரத்தில்)" என்கிறார். ஜன்ம பாதத்திலிருந்து 88 பாதம் எண்ணினால் அது 22-வது நட்சத்திரத்தில் விழுவது முதல் பாதத்தில் பிறந்தவர்களுக்கு மட்டுமே (விஷ்ணு பாஸ்கரின் அஸ்வினி 1 → திருவோணம் 4); 2, 3, 4-ஆம் பாதங்களுக்கு அது 23-வது நட்சத்திரத்தின் 1, 2, 3-ஆம் பாதம். ராஜ் குமாரின் சொந்த உதாரணமே (ரோகிணி 3 → உத்திரட்டாதி 2) 23-வது நட்சத்திரம். இந்தப் பக்கம் பாத எண்ணிக்கையைப் பின்பற்றுகிறது — இரு உதாரணங்களும் அதனுடன் பொருந்துகின்றன.',
  },
  {
    id: 'TWO_USES',
    textTa: 'பயன்பாடு இரண்டு: ராஜ் குமார், விஷ்ணு பாஸ்கர் — எந்தக் கிரகமும் அந்தப் பாதத்தைக் கடக்கும் கோசாரம்; காலப்பிரகாசிகை, சுபகரன் — ஒரு செயலுக்கான நேரத்தின் தரம் (சந்திரன் / அன்றைய நட்சத்திரப் பாதம்), நோயாளியின் நெருக்கடிக் காலம்.',
  },
  {
    id: 'VAINASIKA',
    textTa: 'காலப்பிரகாசிகை 22-வது நட்சத்திரத்தையும் (வைநாசிகம்) 88-வது பாதத்தையும் இரண்டு தனி விஷயங்களாகச் சொல்கிறது (ப.160, 167).',
  },
  {
    id: 'RELIEF',
    textTa: 'தணிவு: ராஜ் குமார் — கோசாரக் குருவின் பார்வை; விஷ்ணு பாஸ்கர் — நிலை, பார்வை, சேர்க்கையைப் பார்க்க வேண்டும்; காலப்பிரகாசிகை (முகூர்த்தத்தில்) — லக்னாதிபதியும் 10-ஆம் அதிபதியும் நண்பர்கள் என்றால் தீமை நீங்கும்.',
  },
  {
    id: 'JUPITER_ROW',
    textTa: 'ராஜ் குமாரின் அட்டவணை 21-ல் ஒரு வரிசைக்குக் கிரகப் பெயர் பக்க முறிவில் விடுபட்டுள்ளது ("Loss of wealth, failure in academic pursuits ..."); வரிசை முறையிலும் விடுபட்ட கிரகம் என்பதாலும் அது குரு.',
  },
]);

const OUR_READINGS_TA = deepFreeze([
  'ஜன்ம பாதமே 1 — 88-வது பாதம் அதிலிருந்து 87 பாதங்கள் (290°) முன்னே; இரண்டு நூல்களின் உதாரணங்களும் இப்படியே.',
  'காலம் = கிரகம் அந்த 3°20′ பாதத்தில் இருக்கும் முழுக் காலம்.',
  'குருவின் பார்வை (ராஜ் குமார்): ராசி அடிப்படையில் குருவின் 5, 7, 9-ஆம் பார்வை அந்தப் பாதம் உள்ள ராசியின் மீது; குரு அதே பாதத்தில் இருப்பது பார்வையாகக் கணக்கில் இல்லை. காலத்தின் தொடக்கம், நடு, முடிவு மூன்றிலும் பார்த்து — முழுவதும் / ஒரு பகுதி / இல்லை.',
  'ராகு, கேது — சராசரிக் கணு. காலப்பிரகாசிகையின் பரிகாரம் (லக்னாதிபதி, 10-ஆம் அதிபதி) ஒரு செயலின் நேரத்து லக்னத்தைப் பொறுத்தது; இங்கு கணிக்கப்படவில்லை.',
]);

module.exports = {
  COUNT, PADAS, pada88Of, COUNT_SOURCES, EXAMPLES, RAJ_KUMAR_EFFECTS, STATEMENTS, PADA88_RANK, BOOK_TA,
  PADA88_DIFFERENCES, OUR_READINGS_TA, SOURCES: { KALAPRAKASIKA },
};
