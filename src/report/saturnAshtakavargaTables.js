/**
 * Saturn's transit judged by Ashtakavarga bindus and by Kakshya — what four
 * books say, read from their printed pages.
 *
 * This file holds doctrine only: which parts a sign or bhava is cut into, who
 * rules each part, and what each book says a bindu (or its absence) brings.
 * The positions and dates are computed in `saturnAshtakavarga.js`.
 *
 * ## Two questions, two book orders
 *
 * The owner's rule (2026-10-03) is that the book which explains a topic most
 * is shown first, measured in words. Two different topics are covered here,
 * and the books do not rank the same way on both:
 *
 *  - **Kakshya** (the 8 parts and their lords): C.S. Patel's Chapter V runs to
 *    1,532 words and is a whole method; the Parashara's Light manual gives 572,
 *    Vishnu Bhaskar 140, Vinay Aditya 43. So Patel's *bhava* method is the
 *    default, and the sign method the other three books use comes second.
 *  - **Bindus in the house Saturn transits**: Vinay Aditya's Chapter 15
 *    ("Transit of Saturn") is 1,501 words, Patel's Saturn chapter (slokas 1–8)
 *    669, Vishnu Bhaskar's two passages 142. So Vinay Aditya comes first there.
 *
 * Word counts are of the English text layer (the Sanskrit verses are not
 * counted). A count is a measure of how much is said, not of who is right.
 */

const { SOURCES: { VISHNU_BHASKAR, PARASHARAS_LIGHT } } = require('./saturnTransitTables');

const PATEL = Object.freeze({
  title: 'Ashtakavarga (with translation in English and explanatory notes)',
  author: 'Chandulal Sakaralal Patel and C.A. Subramania Aiyar',
  file: 'ashtakavarga-patel-subramania-aiyar/raw-scans/full-scan.pdf',
  tradition: 'Classical Ashtakavarga verses with modern English notes (bhava method)',
});

const VINAY_ADITYA = Object.freeze({
  title: 'Practical Ashtakavarga',
  author: 'Vinay Aditya',
  file: 'Jyotish_2011_Vinay Aditya_Practical Ashtakavarga.pdf',
  tradition: 'Parashari',
});

const PLANET_TA = Object.freeze({
  Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு',
  Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது', Lagna: 'லக்னம்',
});

// ---------------------------------------------------------------------------
// Kakshya: the eight parts and their lords
// ---------------------------------------------------------------------------

/** Slowest to fastest, the Lagna last — the order Patel, the PL manual, Vishnu Bhaskar and Vinay Aditya all give. */
const KAKSHYA_LORDS = Object.freeze(['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Lagna']);
/** The order Patel reports (p.67 note) for Parasarahora, Shambhu-horaprakasha and Manasagari. */
const KAKSHYA_LORDS_ALTERNATE = Object.freeze(['Sun', 'Saturn', 'Jupiter', 'Venus', 'Mars', 'Mercury', 'Moon', 'Lagna']);

const PATEL_DIVISION_LOCUS = 'Chapter V, printed p.69 (PDF 104): "Divide into 4 equal parts the difference in degrees from Arambhasandhi (beginning) to Bhavamadhya ... and similarly make 4 equal parts from Bhavamadhya to Bhavasandhi (i.e., end of the house)"; the bhavas by "the method followed in India (Method of Porphyry-Jatakapaddhati of Sharipati)"';

const KAKSHYA_METHODS = Object.freeze({
  PATEL_BHAVA: Object.freeze({
    id: 'PATEL_BHAVA',
    division: 'BHAVA',
    lords: KAKSHYA_LORDS,
    labelTa: 'பாவ முறை (படேல்)',
    explainTa: 'ஸ்ரீபதி முறையில் பாவங்கள்; ஒவ்வொரு பாவத்திலும் ஆரம்ப சந்தியிலிருந்து பாவ மத்தி வரை 4 சம பாகம், பாவ மத்தியிலிருந்து முடிவுச் சந்தி வரை 4 சம பாகம் — மொத்தம் 8 கக்ஷ்யை. அஷ்டகவர்க்கமும் பாவ (சலித) நிலைகளிலிருந்தே கணிக்கப்படுகிறது; ஆகவே பரல் எண்ணிக்கை ராசி முறையிலிருந்து மாறலாம்.',
    sources: Object.freeze([
      Object.freeze({ ...PATEL, pageLocus: 'Chapter V, printed p.65 (PDF 99): "The Lagna, the Moon, Mercury, Venus, the Sun, Mars, Jupiter and Saturn in their order are the lords of the 8 Kakshyas of a bhava from the South to the North"' }),
      Object.freeze({ ...PATEL, pageLocus: PATEL_DIVISION_LOCUS }),
      Object.freeze({ ...PATEL, pageLocus: 'Chapter V sloka 4 notes, printed p.68 (PDF 103): in the standard horoscope the Lagna bhava runs 1s18°39′ to 2s18°39′ and the Sun\'s bindu Kakshyas there are Jupiter\'s 1s22°38′–1s26°38′, Mars\' to 2s0°37′, the Sun\'s to 2s4°37′ and Mercury\'s 2s8°8′–2s11°38′' }),
      Object.freeze({ ...PATEL, pageLocus: 'Introduction, printed p.8 (para. 4-5) and p.66 (PDF 100): the Ashtakavarga is cast from the bhava (Chalita) positions; the Sun\'s Prastarashtakavarga columns are "Bhavas represented by rasis"' }),
    ]),
  }),
  SIGN: Object.freeze({
    id: 'SIGN',
    division: 'SIGN',
    lords: KAKSHYA_LORDS,
    labelTa: 'ராசி முறை (பராசரர் லைட், விஷ்ணு பாஸ்கர், வினய் ஆதித்யா)',
    explainTa: 'ஒவ்வொரு ராசியும் 3°45′ வீதம் 8 சம பாகம்; ராசி அஷ்டகவர்க்கம்.',
    sources: Object.freeze([
      Object.freeze({ ...PARASHARAS_LIGHT, pageLocus: 'printed pp.81-84, Sarva Chancha Chakra and the Kaksha & Dasha calendar: "Transit of each planet in one sign is divided into eight Kakshas (parts) of 3°45 each in order of the movement of the planets from slowest to the fastest (Saturn, Jupiter, Mars, the Sun, Venus, Mercury, the Moon and the Ascendant)"' }),
      Object.freeze({ ...VISHNU_BHASKAR, pageLocus: 'Chapter 14 §XIX Kakshya Principle, printed pp.144-145 (PDF pages 58-59 of volume-1 part 02): the table of Kakshya lords Saturn 0°–3°45′ ... Lagna 26°15′–30°' }),
      Object.freeze({ ...VINAY_ADITYA, pageLocus: 'Chapter 15, printed p.165 (PDF 173): the Kakshya consideration "divides the entire period of seven and a half years, into 24 parts of 3 degrees 45 minutes each"' }),
    ]),
  }),
  SIGN_ALTERNATE_ORDER: Object.freeze({
    id: 'SIGN_ALTERNATE_ORDER',
    division: 'SIGN',
    lords: KAKSHYA_LORDS_ALTERNATE,
    labelTa: 'மாற்று அதிபதி வரிசை (பராசர ஹோரை, சம்பு ஹோரா பிரகாசம், மானசாகரி — படேல் குறிப்பு)',
    explainTa: 'அதிபதி வரிசை: சூரியன், சனி, குரு, சுக்கிரன், செவ்வாய், புதன், சந்திரன், லக்னம். இந்த வரிசையைப் படேல் மேற்கோள் காட்டுகிறார்; இந்நூல்கள் ராசியைப் பிரிக்கின்றனவா பாவத்தையா என்று அவர் குறிப்பு சொல்லவில்லை — ராசியைப் பிரிப்பது எங்கள் வாசிப்பு.',
    sources: Object.freeze([
      Object.freeze({ ...PATEL, pageLocus: 'Chapter V notes, printed p.67 (PDF 101): "Parasarahora, Shambhu-horaprakasha and Manasagari give a different order for Kakshya lords ... The Sun, Saturn, Jupiter, Venus, Mars, Mercury, the Moon and the Lagna"' }),
    ]),
  }),
});

const DEFAULT_KAKSHYA_METHOD = 'PATEL_BHAVA';

const KAKSHYA_RANK = Object.freeze({
  order: Object.freeze(['PATEL_BHAVA', 'SIGN', 'SIGN_ALTERNATE_ORDER']),
  words: Object.freeze({ PATEL: 1532, PARASHARAS_LIGHT: 572, VISHNU_BHASKAR: 140, VINAY_ADITYA: 43 }),
  measureTa: 'கக்ஷ்யை பற்றிய பகுதியின் சொற்கள்: படேல் அத்தியாயம் V (பக்.65-71) 1,532; பராசரர் லைட் கையேடு (பக்.81-84) 572; விஷ்ணு பாஸ்கர் §XIX 140; வினய் ஆதித்யா 43. ராசி முறையைச் சொல்லும் மூன்று நூல்களையும் சேர்த்தாலும் 755 — படேலுக்குக் குறைவு. மாற்று வரிசை படேலின் ஒரு குறிப்பில் மட்டும் (சுமார் 30 சொற்கள்) உள்ளதால் கடைசி.',
  alternativeTa: 'படேலின் அத்தியாயம் XVII (பிறப்பில் கிரகம் நின்ற கக்ஷ்யையின் பலன், பக்.273-294, 4,492 சொற்கள்) சேர்த்தால் இடைவெளி இன்னும் கூடும்; எந்த அளவிலும் வரிசை மாறாது.',
});

// ---------------------------------------------------------------------------
// What a bindu (or its absence) in a Kakshya brings — book order Patel, PL, VB, VA
// ---------------------------------------------------------------------------

const KAKSHYA_READINGS = Object.freeze([
  Object.freeze({
    book: 'PATEL',
    bookTa: 'படேல் (அஷ்டகவர்க்கம், அத்தியாயம் XII சனி)',
    bindu: Object.freeze({
      textTa: 'பரல் உள்ள கக்ஷ்யையில் சனி செல்லும்போது: பரம்பரைச் சொத்து வழிச் செல்வம், அரசு அமைச்சர் வழியாகக் காரிய வெற்றி, நல்லோர் தொடர்பு, நிலம், ஏமாற்றுவோர் மீது வெற்றி, புனித / சமயக் கடமைகளில் ஈடுபாடு, இனிய உணவு, அரசர் அருள், விவசாய விளைச்சல் பெருக்கம்.',
      source: Object.freeze({ ...PATEL, pageLocus: 'Chapter XII sloka 2, printed p.154 (PDF 189): "When Saturn transits a Kakshya having a bindu in his Ashtakavarga he confers wealth by way of legacy, success in undertakings through a minister of a king ..."' }),
    }),
    void: Object.freeze({
      textTa: 'பரல் இல்லாத கக்ஷ்யையில்: துன்பம், அரசர் அச்சம், உறவினரால் / உறவினருக்குத் தொல்லை கூடுதல், ஆயுதக் காயம், பண இழப்பு, பலவகை மனக்கலக்கம், நில இழப்பு அல்லது சண்டை, மனத் திரிபு, பயணத்தில் இழப்பு.',
      source: Object.freeze({ ...PATEL, pageLocus: 'Chapter XII sloka 3, printed p.154 (PDF 189): "While transiting a Kakshya void of a bindu, he causes misery, fear from a King, increase of troubles from or to relatives ..."' }),
    }),
    afflicted: Object.freeze({
      textTa: 'பொது விதி: பரல் உள்ள கக்ஷ்யை நன்மை; பரல் இல்லாதது பலன் இல்லை. ஆனால் பரல் உள்ள கக்ஷ்யையில் செல்லும்போது கிரகம் நீசத்திலோ பகை வீட்டிலோ அஸ்தங்கதத்திலோ இருந்தால் பெரும் துன்பம்.',
      source: Object.freeze({ ...PATEL, pageLocus: 'Chapter V sloka 5, printed p.71 (PDF 106): "if at the time of passing through a Kakshya having a bindu, the planet is in his debilitation, inimical house or in combust, he causes great sorrow"' }),
      readingTa: '"பகை வீடு" = சனிக்கு இயற்கைப் பகைவர் (சூரியன், சந்திரன், செவ்வாய் — BPHS 3.55) ஆளும் ராசி: சிம்மம், கடகம், மேஷம், விருச்சிகம். இயற்கை உறவைக் கொண்டது எங்கள் வாசிப்பு; நூல் எந்த உறவு என்று சொல்லவில்லை.',
    }),
    timing: Object.freeze({
      textTa: 'சனி ஒரு கக்ஷ்யையைக் கடக்கச் சராசரியாக 3¾ மாதம்.',
      source: Object.freeze({ ...PATEL, pageLocus: 'Chapter V, printed p.71 (PDF 106): "Average time taken by planets to transit a Kakshya ... Saturn 3¾ months"' }),
    }),
  }),
  Object.freeze({
    book: 'PARASHARAS_LIGHT',
    bookTa: 'பராசரர் லைட் 6.1 கையேடு',
    textTa: 'கக்ஷ்யை அதிபதி பரல் கொடுத்திருந்தால் பச்சை, கொடுக்காவிட்டால் சிவப்பு எனக் காட்டுகிறது; வக்கிரம் (R), நேர்கதி (D) குறிக்கப்படுகிறது. பலன் வாசகம் இல்லை.',
    source: Object.freeze({ ...PARASHARAS_LIGHT, pageLocus: 'printed pp.83-84, Kaksha & Dasha calendar: "Contribution of a benefic point to the Bhinnashtakavarga by the Kaksha ruler is indicated by a green color Kaksha and no contribution is indicated by a red color Kaksha"' }),
  }),
  Object.freeze({
    book: 'VISHNU_BHASKAR',
    bookTa: 'விஷ்ணு பாஸ்கர் (அத்தியாயம் 14 §XIX)',
    items: Object.freeze([
      Object.freeze({ id: 'KL_BINDU', textTa: 'அந்த ராசியில் சனியின் பின்னாஷ்டகவர்க்கத்தில் கக்ஷ்யை அதிபதி பரல் கொடுத்திருந்தால், அந்தக் கக்ஷ்யையின் 3.75 மாதம் நல்லது.', applied: true }),
      Object.freeze({ id: 'MANY_PLANETS', textTa: 'பல கிரகங்கள் ஒரே நேரத்தில் பரல் உள்ள கக்ஷ்யைகளில் சென்றால் நன்மை கூடும்; பரல் இல்லாதவற்றில் சென்றால் அழிவு (தசை/புக்தி சாதகமில்லையெனில் குறிப்பாக).', applied: false, whyNotTa: 'இது எல்லாக் கிரகங்களின் கோசாரத்தையும் ஒருசேரக் கேட்கிறது; இந்தப் பக்கம் சனியை மட்டும் கணிக்கிறது.' }),
      Object.freeze({ id: 'FRIENDS', textTa: 'கோசாரக் கிரகமும் கக்ஷ்யை அதிபதியும் நண்பர்கள் எனில் நன்மை கூடும் (பகைவர் எனில் மாறாக).', applied: true }),
      Object.freeze({ id: 'DIGNITY', textTa: 'சொந்த வீடு, உச்சம், நண்பர் வீடு அல்லது மூலத்திரிகோணத்தில் கோசாரம் நன்மை தரும்.', applied: true }),
    ]),
    source: Object.freeze({ ...VISHNU_BHASKAR, pageLocus: 'Chapter 14 §XIX.1-4, printed p.145 (PDF page 59 of volume-1 part 02): "Kakshya Lord (KL) contributing a bindu in Saturn\'s BAV in that sign would give good 3.75 months period in that Kakshya"' }),
  }),
  Object.freeze({
    book: 'VINAY_ADITYA',
    bookTa: 'வினய் ஆதித்யா (அத்தியாயம் 15)',
    textTa: 'ஏழரைச் சனியின் 7½ ஆண்டுகளை 3°45′ வீதம் 24 பாகங்களாகப் பிரித்து, சனியின் பிரஸ்தாரத்தில் கக்ஷ்யை அதிபதி பரல் கொடுத்த பாகங்கள் நன்மை தரும்.',
    source: Object.freeze({ ...VINAY_ADITYA, pageLocus: 'Chapter 15, printed p.165 (PDF 173): "Those parts give auspicious results where the Kakshya lord has given a bindu in Saturn\'s prastaraka"' }),
  }),
]);

// ---------------------------------------------------------------------------
// Bindus in the house Saturn transits — book order VA, Patel, VB
// ---------------------------------------------------------------------------

const HOUSE_READING_RANK = Object.freeze({
  order: Object.freeze(['VINAY_ADITYA', 'PATEL', 'VISHNU_BHASKAR']),
  words: Object.freeze({ VINAY_ADITYA: 1501, PATEL: 669, VISHNU_BHASKAR: 142 }),
  measureTa: 'சனி கோசாரத்தைப் பரல்களால் மதிப்பிடும் பகுதியின் சொற்கள்: வினய் ஆதித்யா அத்தியாயம் 15 முழுவதும் (பக்.164-167) 1,501; படேல் அத்தியாயம் XII ஸ்லோகம் 1-8 (பக்.153-156) 669; விஷ்ணு பாஸ்கர் §XVIII + §XX.3 (பக்.144-145) 142.',
  alternativeTa: 'பரல் விதியைச் சொல்லும் வாக்கியங்களை மட்டும் எண்ணினால் படேல் (ஸ்லோகம் 1, 5, 7-8: 294) வினய் ஆதித்யாவை (182) முந்தும் — அந்த அளவில் முதல் இரண்டு இடம் மாறும்.',
});

/** Vinay Aditya p.165: his examples of high and low, and 3 as near average. 4 and 8 he does not place. */
const VA_BANDS = Object.freeze([
  Object.freeze({ bindus: [5, 6, 7], verdict: 'GOOD', ta: 'நல்லது (5, 6, 7 — நூலின் உதாரணம்)' }),
  Object.freeze({ bindus: [3], verdict: 'MIXED', ta: 'சராசரிக்கு அருகில் — கலப்புப் பலன்' }),
  Object.freeze({ bindus: [0, 1, 2], verdict: 'BAD', ta: 'தீமை (0, 1, 2)' }),
]);

const VINAY_ADITYA_HOUSE = Object.freeze({
  bands: VA_BANDS,
  unplacedTa: 'நூல் இந்த எண்ணிக்கையை வகைப்படுத்தவில்லை (அது 5, 6, 7-ஐ "உதாரணமாக" உயர்ந்தது என்றும் 3-ஐ சராசரி என்றும் மட்டும் சொல்கிறது).',
  notesTa: Object.freeze([
    'சர்வாஷ்டக, பின்னாஷ்டக (சனியின்) பரல்கள் இரண்டும் உயர்ந்தால் கோசாரம் நன்மை; பின்னாஷ்டகத்துக்கு அதிக எடை.',
    'சனியின் மொத்தப் பரல் 39 மட்டுமே; ஆகவே சராசரி 4 அல்ல, 3-க்கு அருகில்.',
    'ஏழரைச் சனியின் மூன்று 2½ ஆண்டுகளில் சனியின் பின்னாஷ்டகப் பரல் உயர்ந்த பகுதிகள் நல்லவை, குறைந்தவை தீயவை.',
    'சனியின் 3, 7, 10-ஆம் பார்வை பெறும் வீடுகளுக்கும் திரிகோண வீடுகளுக்கும் அதே பரல் விதி — இந்தப் பக்கம் அதைக் கணிக்கவில்லை.',
  ]),
  sources: Object.freeze([
    Object.freeze({ ...VINAY_ADITYA, pageLocus: 'Chapter 15, printed p.164 (PDF 172): "if the planet is transiting a house (or sign) that has high Sarvashtaka bindus and high Bhinnashtaka (Saturn\'s) bindus, the transit results will be good. Here higher weightage has to be given to the Bhinnashtaka bindus"' }),
    Object.freeze({ ...VINAY_ADITYA, pageLocus: 'Chapter 15, printed p.165 (PDF 173): "those two and a half year period/s will be good in which the bindus are high in the bhinnashtakavarga of Saturn (say, 5, 6 or 7), and those will be bad that have low bindus (0, 1 or 2). 3 bindus are near to average and will give mixed results"' }),
  ]),
});

/** Patel Chapter XII sloka 1 (p.153): Saturn transiting a bhava with n bindus in his Ashtakavarga. */
const PATEL_BY_BINDUS = Object.freeze({
  8: 'கிராமம் அல்லது நகரத் தலைவர் ஆதல், அல்லது அரச அரண்மனை அதிகாரி',
  7: 'பணிப்பெண்கள், கழுதைகள், ஒட்டகங்கள் கிடைத்தல்',
  6: 'கள்வர் தலைவர்கள், காட்டுக் குடிகளின் தலைவர்களிடமிருந்து மதிப்பு',
  5: 'பெருமளவு விவசாய விளைச்சல்',
  4: 'மிதமான இன்பமும் துன்பமும்',
  3: 'செல்வம், பணியாளர், பெண்கள், மகிழ்ச்சி இழப்பு',
  2: 'சிறைப்படுதல், கவலை அல்லது நோய்',
  1: 'எல்லாச் செயல்களிலும் நயமின்மை',
  0: 'எல்லாம் இழத்தல்',
});
/** The same page: "Additional results given by other authors". */
const PATEL_OTHER_AUTHORS = Object.freeze({ 2: 'வறுமை', 1: 'நோய்', 0: 'மரண வாய்ப்பு' });

/**
 * Patel's bindu places (Prasnamarga's mnemonic verses, pp.17-21) where they
 * differ from Vinay Aditya's table, which `ashtakavarga.js` uses everywhere
 * else. Two cells only; every total stays the same, and Saturn's own table is
 * identical in both — so Saturn's bindus never change, only the
 * Sarvashtakavarga does. Patel's own Edward VII figures follow these cells.
 */
const PATEL_BINDU_DIFFERENCES = Object.freeze({
  Moon: Object.freeze({ Jupiter: Object.freeze([1, 2, 4, 7, 8, 10, 11]) }),
  Venus: Object.freeze({ Mars: Object.freeze([3, 4, 6, 9, 11, 12]) }),
});

const PATEL_BINDU_NOTE = Object.freeze({
  textTa: 'படேலின் பரல் அட்டவணை வினய் ஆதித்யாவின் அட்டவணையிலிருந்து இரண்டு இடங்களில் மாறுகிறது: சந்திரனின் அஷ்டகவர்க்கத்தில் குரு கொடுக்கும் இடங்கள் 1, 2, 4, 7, 8, 10, 11 (வினய் ஆதித்யா: 2-க்குப் பதில் 12); சுக்கிரனின் அஷ்டகவர்க்கத்தில் செவ்வாய் கொடுக்கும் இடங்கள் 3, 4, 6, 9, 11, 12 (வினய் ஆதித்யா: 4-க்குப் பதில் 5). வினய் ஆதித்யாவின் இடங்களைப் படேல் அடிக்குறிப்பில் பிருஹத் ஜாதகம் (சந்திரனுக்கு சாராவளியும்) தருவதாகச் சொல்கிறார். சனியின் அட்டவணை இரண்டிலும் ஒன்றே; சர்வாஷ்டகம் மட்டும் மாறலாம். இந்தப் பாவ அட்டவணையின் சர்வாஷ்டகம் படேலின் அட்டவணையால்; ராசி அட்டவணைகள் வினய் ஆதித்யாவின் அட்டவணையால்.',
  sources: Object.freeze([
    Object.freeze({ ...PATEL, pageLocus: 'Chapter II sloka 5, printed p.18 (PDF 52): "Jupiter* in the 1st, 2nd, 4th, 7th, 8th, 10th and 11th houses"; footnote: "In the 1st, 4th, 7th, 8th, 10th, 11th, and 12th hours from Jupiter according to Brihat-jataka and Saravali"' }),
    Object.freeze({ ...PATEL, pageLocus: 'Chapter II slokas 10-11, printed p.20 (PDF 54): "Mars* in the 3rd, 4th, 6th, 9th, 11th and 12th houses"; footnote: "In the 3rd, 5th, 6th, 9th, 11th and 12th houses from Mars. according to Brihat-jataka. Here Saravali follows Parasara."' }),
    Object.freeze({ ...PATEL, pageLocus: 'Chapter II notes, printed p.21 (PDF 55): "there is a difference between Parasara and Varahamihira, in the case of Jupiter in the Moon\'s Ashtakavarga and of Mars in that of Venus\' Ashtakavarga ... In this book Parasara is followed throughout"' }),
  ]),
});

const PATEL_HOUSE = Object.freeze({
  byBindus: PATEL_BY_BINDUS,
  otherAuthors: PATEL_OTHER_AUTHORS,
  highestTa: 'சனியின் அஷ்டகவர்க்கத்தில் அதிக பரல் உள்ள பாவத்தில் சனி செல்லும்போது பணியாளர் சேர்க்கை, விவசாயப் பணி முதலியவை பலன் தரும்.',
  zeroTa: 'பரல் இல்லாத பாவத்தில் சனி செல்லும்போது அந்தப் பாவம் வாக்களிக்கும் நற்பலன் நிகழாது.',
  zeroRestTa: 'அதே ஸ்லோகத்தின் மீதி (சூரியன், சந்திரனும் சேர்ந்து, மாரக தசையும் நடந்தால்) இங்கே கணிக்கப்படவில்லை — மாரகக் கிரக நிர்ணயம் இந்த மென்பொருளில் இன்னும் இல்லை.',
  noteTa: 'படேல் பாவ முறையில் எண்ணுகிறார்; ஆகவே இந்த அட்டவணை பாவங்களுக்கு (ஸ்ரீபதி), பாவ நிலைகளிலிருந்து கணித்த பரல்களுடன்.',
  sources: Object.freeze([
    Object.freeze({ ...PATEL, pageLocus: 'Chapter XII sloka 1, printed p.153 (PDF 188): "When Saturn in his Ashtakavarga transits bhavas containing 8 to 0 bindus, the results are as follows" and "Additional results given by other authors"' }),
    Object.freeze({ ...PATEL, pageLocus: 'Chapter XII slokas 5 and 7-8, printed pp.155-156 (PDF 190-191): the bhava with the highest bindus, and "Find out a bhava having no bindu in the Ashtakavarga of Saturn. When Saturn transits that house, no (good) results promised by the bhava will happen"' }),
  ]),
});

/** Vishnu Bhaskar §XX.3 (p.145): any planet's BAV bindus in a sign. */
const VB_BY_BINDUS = Object.freeze({
  8: 'செழிப்பு, அரசுநிலை', 7: 'மதிப்பு, விருது', 6: 'செல்வம், வாகனம்', 5: 'குழந்தைப் பிறப்பு, ஆடை',
  4: 'நன்மை தீமை சமம்', 3: 'மன / உடல் அசௌகரியம்', 2: 'பண இழப்பு', 1: 'நோய்', 0: 'உயிருக்கு ஆபத்து, அவமானம்',
});

const VISHNU_BHASKAR_HOUSE = Object.freeze({
  sadeSati: Object.freeze({
    savTa: 'ஏழரைச் சனியின் 12, 1, 2-ஆம் வீடுகளின் சர்வாஷ்டகப் பரல் 30-க்கு மேல் இருந்தால் 7½ ஆண்டுகளும் சிறப்பாக இருக்கும்.',
    savReadingTa: 'மூன்று வீடுகளும் ஒவ்வொன்றும் 30-க்கு மேல் என்று எடுத்தது எங்கள் வாசிப்பு (கூட்டுத்தொகை அல்ல).',
    savThreshold: 30,
    bavTa: 'அவற்றில் எந்த வீட்டிலாவது சனியின் பின்னாஷ்டகப் பரல் "5 அல்லது 6-க்கு மேல்" இருந்தால், சனி அந்த ராசியில் செல்லும் காலம் நல்லது.',
    bavReadingTa: '"5 அல்லது 6-க்கு மேல்" என்பது 6 முதல் என்றும் 7 முதல் என்றும் படிக்கலாம்; இரண்டையும் காட்டுகிறோம்.',
    bavThresholds: Object.freeze([5, 6]),
  }),
  byBindus: VB_BY_BINDUS,
  byBindusNoteTa: 'இது எந்தக் கிரகத்தின் பின்னாஷ்டகத்துக்கும் நூல் தரும் பொது அட்டவணை; இங்கே சனியின் ராசிப் பரல்களுக்குப் பொருத்தப்படுகிறது.',
  sources: Object.freeze([
    Object.freeze({ ...VISHNU_BHASKAR, pageLocus: 'Chapter 14 §XVIII, printed p.144 (PDF page 58 of volume-1 part 02): "SAV of 12th House, over Moon sign and 2nd House from Moon greater than 30 would give excellent 7½ years" and "BAV of Saturn in any of above houses greater than 5 or 6 would give good when Saturn transit in that sign"' }),
    Object.freeze({ ...VISHNU_BHASKAR, pageLocus: 'Chapter 14 §XX.3, printed p.145 (PDF page 59 of volume-1 part 02): "No. of BAV bindus of a planet in a sign: Results as per number of bindus are: 8; Prosperity, king ... 0 : fatality, humiliation"' }),
  ]),
});

// ---------------------------------------------------------------------------
// Vinay Aditya's watch-list (p.166) and what other pages add to it
// ---------------------------------------------------------------------------

/** Vishnu Bhaskar p.13: degrees from the Sun within which Saturn is combust. */
const SATURN_COMBUSTION_DEGREES = 15;
/** Vishnu Bhaskar p.13: Saturn's station lasts 5 days before and after it turns. */
const STATION_DAYS = 5;

const WATCH = Object.freeze({
  retrograde: Object.freeze({
    textTa: 'சனி எப்போது வக்கிரமாகிறது, எப்போது நேர்கதிக்கு வருகிறது: வக்கிரத்தில் அசுபம் மிகும்; நேர்கதிச் சனி மிகச் சிறந்தது.',
    source: Object.freeze({ ...VINAY_ADITYA, pageLocus: 'Chapter 15, printed p.166 (PDF 174), item 1: "When is Saturn becoming retrograde (inauspicious results abound) and when is it coming out of retrogression? A direct Saturn is much better than the retrograde one."' }),
    stationTa: 'வக்கிர காலம் சுமார் 4½ மாதம்; திரும்பும் நாளுக்கு முன்னும் பின்னும் 5 நாள் "நிலை" (stationary) — நிலையில் நிற்கும் கிரகம் மிகுந்த அசுபம்.',
    stationSource: Object.freeze({ ...VISHNU_BHASKAR, pageLocus: 'Chapter 1 §XX.1, printed p.13 (PDF page 25 of volume-1 part 01): "Period of retrogression: Sat 4½ m., Stationary Period 5day before/after" and "Stationary planet is highly malefic"' }),
  }),
  combustion: Object.freeze({
    textTa: 'சனி அஸ்தங்கதமாவதும் அதிலிருந்து விடுபடுவதும்: அஸ்தங்கதச் சனி கோசாரத்தில் சுபப் பலன் தராது.',
    source: Object.freeze({ ...VINAY_ADITYA, pageLocus: 'Chapter 15, printed p.166 (PDF 174), item 2: "A combust Saturn does not give auspicious results in transit."' }),
    orbTa: 'சூரியனிலிருந்து 15°-க்குள் சனி அஸ்தங்கதம் (விஷ்ணு பாஸ்கர்). வினய் ஆதித்யா பாகை சொல்லவில்லை.',
    orbSource: Object.freeze({ ...VISHNU_BHASKAR, pageLocus: 'Chapter 1 §XX.6, printed p.13 (PDF page 25 of volume-1 part 01): "Degrees of combustion ... Sat 15°"' }),
    contrastTa: 'அதே நூல் அடுத்த பக்கத்தில் "சுக்கிரனும் சனியும் அஸ்தங்கதமானாலும் வலிமை உள்ளவை" என்கிறது — அது ஜாதக (பிறப்பு) வலிமை பற்றியது, கோசாரம் அல்ல; இரண்டும் ஒரே கேள்வி அல்ல.',
    contrastSource: Object.freeze({ ...VISHNU_BHASKAR, pageLocus: 'Chapter 1 §XX.6, printed p.14 (PDF page 26 of volume-1 part 01): "Venus & Saturn strong even combust"' }),
  }),
  nakshatra: Object.freeze({
    textTa: 'சனி புதிய நட்சத்திரத்தில் நுழையும்போது: அந்த நட்சத்திர அதிபதி சனிக்கு நண்பரா பகைவரா; அந்த அதிபதி நல்ல நிலையில் அதிக பரலுடன் உள்ளாரா.',
    source: Object.freeze({ ...VINAY_ADITYA, pageLocus: 'Chapter 15, printed p.166 (PDF 174), item 3: "Whether the nakshatra lord is a friend or foe to Saturn and whether that nakshatra lord is well placed having high bindus or not."' }),
    relationTa: 'நண்பர் / பகைவர்: BPHS இயற்கை உறவு அட்டவணை (சனிக்கு நண்பர் புதன், சுக்கிரன்; பகைவர் சூரியன், சந்திரன், செவ்வாய்; குரு சமம்). ராகு, கேது அந்த அட்டவணையில் இல்லை.',
    notAppliedTa: '"அதிக பரலுடன் நல்ல நிலை" — யாருடைய அஷ்டகவர்க்கத்தில், எந்த ராசியில் என்று நூல் சொல்லவில்லை; ஆகவே கணிக்கப்படவில்லை.',
  }),
  tara: Object.freeze({
    textTa: 'ஜன்ம நட்சத்திரத்திலிருந்து 3, 5, 7-ஆம் தாரையில் சனி செல்வது படிப்படியாக அதிகத் தீமை.',
    source: Object.freeze({ ...VINAY_ADITYA, pageLocus: 'Chapter 15, printed p.166 (PDF 174), item 4: "One should also check whether Saturn is transiting 3rd, 5th or 7th Tara (nakshatra) from Janma nakshatra. These are progressively adverse."' }),
    readingTa: 'தாரையை ஒன்பது ஒன்பதாகச் சுழற்றி எண்ணியது (3-ஆம் தாரை = 3, 12, 21-ஆம் நட்சத்திரம்) எங்கள் வாசிப்பு; நூல் "(nakshatra)" என்று மட்டும் சேர்க்கிறது. நேரடியாக 3, 5, 7-ஆம் நட்சத்திரமா என்பதையும் தனியே குறிக்கிறோம்.',
    adverse: Object.freeze([3, 5, 7]),
  }),
  navamsha: Object.freeze({
    textTa: 'சனி அடுத்த நவாம்சத்தில் நுழையும்போது அந்த நவாம்ச அதிபதி சனிக்கு நண்பரா பகைவரா — 7½ ஆண்டை 27 பிரிவுகளாக்கும்.',
    source: Object.freeze({ ...VINAY_ADITYA, pageLocus: 'Chapter 15, printed p.166 (PDF 174), item 5: "When is Saturn going into the next navamsha and whether the navamsha lord is a friend or foe to Saturn?"' }),
  }),
  chandraNavamsha: Object.freeze({
    textTa: 'சந்திர கலா நாடி: ராசிச் சக்கரத்தில் சந்திரன் நின்ற ராசியிலோ, நவாம்சத்தில் சந்திரன் நின்ற ராசியிலோ (சந்திர நவாம்ச ராசி) சனி செல்லும்போது பகைவரால் துன்பம், மன வேதனை, மறைவான குறையால் அவமானம்; பரல் அதிகமெனில் பாதிப்பு குறையலாம், தெரியாமலும் போகலாம்.',
    source: Object.freeze({ ...VINAY_ADITYA, pageLocus: 'Chapter 15, printed p.166 (PDF 174), "Saturn\'s transit through natal Moon", from Chandrakala Nadi' }),
    rahuTa: 'சந்திர நவாம்ச ராசியில் சனி செல்லும்போது ராகு தசையும் நடந்தால் பெரும் இடர் (அதுவரை சேர்ந்த நற்பலன் நின்றுபோதல்); ராகு தசை இல்லாவிட்டாலும் மன நலனுக்கும் துணையின் உடல் நலனுக்கும் பாதகமாகலாம்; பரல்களைக் கணக்கில் கொள்ள வேண்டும்.',
    rahuSource: Object.freeze({ ...VINAY_ADITYA, pageLocus: 'Chapter 15, printed p.167 (PDF 175), "Saturn\'s transit through Chandra Navamsha Rashi": "the native may suffer from great calamity ... if simultaneously Rahu\'s dasha is running"' }),
  }),
});

/** Saturn's sign dignities in transit (BPHS, as `shadbala.js` already holds them), for Patel sloka 5 and VB §XIX.4. */
const SATURN_SIGNS = Object.freeze({
  exalted: 6, debilitated: 0, own: Object.freeze([9, 10]), moolatrikona: Object.freeze({ sign: 10, from: 0, to: 20 }),
});

module.exports = {
  PATEL, VINAY_ADITYA, PLANET_TA,
  KAKSHYA_LORDS, KAKSHYA_LORDS_ALTERNATE, KAKSHYA_METHODS, DEFAULT_KAKSHYA_METHOD, KAKSHYA_RANK, KAKSHYA_READINGS,
  HOUSE_READING_RANK, VINAY_ADITYA_HOUSE, VA_BANDS, PATEL_HOUSE, PATEL_BY_BINDUS, PATEL_OTHER_AUTHORS,
  PATEL_BINDU_DIFFERENCES, PATEL_BINDU_NOTE,
  VISHNU_BHASKAR_HOUSE, VB_BY_BINDUS,
  WATCH, SATURN_COMBUSTION_DEGREES, STATION_DAYS, SATURN_SIGNS,
};
