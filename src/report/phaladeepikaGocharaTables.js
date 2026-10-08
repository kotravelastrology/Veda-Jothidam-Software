/**
 * Phaladeepika XXVI — the rest of the transit chapter (added 2026-10-08):
 * each planet's result in each house from the Moon (verses 9-24), the part of
 * a sign in which a planet gives its result (verse 25, with Vishnu Bhaskar),
 * and the general rules of verses 30-34 and 41. The vedha pairs (2-8),
 * Saptashalaka (26-29), anga (35-40) and latta (42-47) are in their own tables.
 *
 * The texts are V. Subrahmanya Sastri's translation (1950), condensed into
 * Tamil, checked against the Sanskrit where the two translations differ. They
 * are the book's statements, not predictions.
 */

const { PHALADEEPIKA_SASTRI, PHALADEEPIKA_KAPOOR } = require('./classicSources');
const { SOURCES: { VISHNU_BHASKAR } } = require('./saturnTransitTables');

const deepFreeze = (o) => {
  Object.values(o).forEach((v) => { if (v && typeof v === 'object') deepFreeze(v); });
  return Object.freeze(o);
};

/** Verses 9-24: [house 1 … house 12]. Ketu has no verse. */
const HOUSE_RESULTS = deepFreeze({
  Sun: [
    'களைப்பு, பண இழப்பு; எரிச்சல், நோய்; களைப்பூட்டும் பயணம்',
    'பண இழப்பு, மகிழ்ச்சியின்மை; பிறரால் ஏமாற்றப்படுதல்; பிடிவாதம்',
    'புதிய பதவி, பண வரவு, மகிழ்ச்சி, நோய் நீங்குதல், பகைவர் அழிவு',
    'நோய்கள்; தாம்பத்திய இன்பத்துக்கு அடிக்கடி தடை',
    'மனக் கலக்கம், உடல் நலக் குறைவு, எல்லா வகையிலும் சங்கடம்',
    'எல்லா நோய்களும் நீங்கும்; பகைவர் அழிவு; துக்கமும் மனக்கவலையும் நீங்கும்',
    'களைப்பூட்டும் பயணம்; வயிறு, குதம் சார்ந்த நோய்; அவமானம்',
    'அச்சம், நோய்; சண்டை; அரசின் அதிருப்தி; மிகுந்த வெப்பத்தால் துன்பம்',
    'ஆபத்து, அவமானம், உறவினரைப் பிரிதல், மன அழுத்தம்',
    'மிகப் பெரிய முயற்சி வெற்றியுடன் நிறைவேறும்',
    'புதிய பதவி, மதிப்பு, செல்வம், நோயிலிருந்து விடுதலை',
    'துக்கம், பண இழப்பு, நண்பர்களுடன் சண்டை, காய்ச்சல்',
  ],
  Moon: [
    'அதிர்ஷ்டம் உதித்தல்', 'பண இழப்பு', 'வெற்றி', 'அச்சம்', 'துக்கம்', 'நோயிலிருந்து விடுதலை',
    'மகிழ்ச்சி', 'தீய நிகழ்வுகள்', 'நோய்', 'விரும்பியது கைகூடுதல்', 'மகிழ்ச்சி', 'செலவு',
  ],
  Mars: [
    'மனச்சோர்வு, உறவினரைப் பிரிதல்; இரத்தம், பித்தம், வெப்பம் சார்ந்த நோய்கள்',
    'அச்சம், கடுஞ்சொல், பண இழப்பு',
    'எல்லாவற்றிலும் வெற்றி; பொன் அணிகலன்கள் கிடைத்து மகிழ்ச்சி',
    'பதவி இழப்பு; வயிற்றுப்போக்கு போன்ற வயிற்று நோய்; உறவினரால் துக்கம்',
    'காய்ச்சல், முறையற்ற ஆசைகள், மகனால் மனவேதனை அல்லது உறவினருடன் சண்டை',
    'சச்சரவு முடிவு, பகைவர் விலகல், நோய் தணிவு, வெற்றி, பண லாபம், எல்லா முயற்சிகளிலும் வெற்றி',
    'மனைவியுடன் கருத்து வேறுபாடு; கண் நோய், வயிற்று வலி முதலியன',
    'காய்ச்சல்; உடல் இரத்தத்தால் கறைபடும்; பணமும் மதிப்பும் இழப்பு',
    'பண இழப்பு முதலியவற்றால் அவமானம்; உடல் பலவீனத்தால் நடை தளரும்',
    'நடத்தை சரியில்லாமை அல்லது முயற்சிகளில் தோல்வி; களைப்பு',
    'பண லாபம், நோயிலிருந்து விடுதலை, நிலச் சொத்து சேர்தல்',
    'பண இழப்பு; மிகுந்த வெப்பத்தால் நோய்கள்',
  ],
  Mercury: [
    'பண இழப்பு', 'பண லாபம்', 'பகைவரால் அச்சம்', 'பண வரவு', 'மனைவி, மக்களுடன் சண்டை', 'வெற்றி',
    'கருத்து வேறுபாடுகள்', 'மக்கள், செல்வம் முதலியன கிடைத்தல்', 'தடைகள்', 'எங்கும் மகிழ்ச்சி', 'செழிப்பு', 'அவமான அச்சம்',
  ],
  Jupiter: [
    'சொந்த ஊரை விட்டுச் செல்லுதல், பெருஞ்செலவு, பிறர் மீது பகைமை',
    'பண வரவு, குடும்ப மகிழ்ச்சி; சொல்லுக்கு மதிப்பு',
    'பதவி இழப்பு, நண்பர்களைப் பிரிதல், தொழிலுக்குத் தடை, நோய்',
    'உறவினரால் துக்கம்; அவமானம்; கால்நடைகளால் ஆபத்து',
    'மக்கட்பேறு, நல்லோர் நட்பு, அரசின் ஆதரவு',
    'பகைவர், பங்காளிகளால் தொல்லை; நோய்கள்',
    'சுப காரியத்துக்காகப் பயணம், மனைவியுடன் மகிழ்ச்சி, மக்கட்பேறு',
    'களைப்பூட்டும் பயணங்கள், துரதிர்ஷ்டம், பண இழப்பு, துன்பம்',
    'எல்லாச் செழிப்பையும் அனுபவித்தல்',
    'சொத்து, பதவி, பிள்ளைகளுக்கு ஆபத்து',
    'மக்கட்பேறு, புதிய பதவி, மதிப்பு',
    'சொத்தால் துக்கமும் அச்சமும்',
  ],
  Venus: [
    'எல்லா வகை இன்பங்களும்', 'பண லாபம்', 'செழிப்பு', 'மகிழ்ச்சியும் நண்பர்களும் பெருகுதல்', 'மக்கட்பேறு', 'விபத்து',
    'மனைவிக்குத் தொல்லை', 'செல்வம்', 'மகிழ்ச்சி', 'சண்டை', 'பாதுகாப்பு', 'பண வரவு',
  ],
  Saturn: [
    'நோய்; இறுதிச் சடங்கு செய்ய நேரும்',
    'செல்வத்துக்கும் பிள்ளைகளுக்கும் தொல்லை',
    'பதவி அல்லது வேலை, பணியாளர்கள், பணம் கிடைத்தல்',
    'மனைவி, உறவினர், செல்வம் இழப்பு',
    'செல்வம் குறையும், பிள்ளைகளை இழத்தல், மனக் குழப்பம்',
    'எங்கும் மகிழ்ச்சி',
    'மனைவி துன்புறுவாள்; பயணம்; அச்சத்தால் மனச்சோர்வு',
    'பிள்ளைகள், கால்நடைகள், நண்பர்கள், செல்வம் இழப்பு; நோய்',
    'பண இழப்பு; நற்செயலுக்குப் பல தடைகள்; தந்தைக்கு நிகரான உறவினர் மரணம்; நீடித்த துக்கம்',
    'பாவச் செயல் செய்ய நேரும்; மதிப்பு இழப்பு; நோய் வரலாம்',
    'எல்லா வகை மகிழ்ச்சியும் செல்வமும்; தனிச் சிறப்பான மதிப்பு',
    'பயனற்ற தொழிலில் களைப்பு; பகைவரால் பண இழப்பு; மனைவி, மக்களுக்கு நோய்',
  ],
  Rahu: [
    'நோய் அல்லது மரணம்', 'பண இழப்பு', 'மகிழ்ச்சி', 'துக்கம்', 'பண இழப்பு', 'மகிழ்ச்சி',
    'இழப்பு', 'உயிருக்கு ஆபத்து', 'இழப்பு', 'லாபம்', 'மகிழ்ச்சி', 'செலவு',
  ],
});

const VERSE_OF = Object.freeze({ Sun: '9-11', Moon: '12', Mars: '13-16', Mercury: '17', Jupiter: '18-20', Venus: '21', Saturn: '22-23', Rahu: '24' });

const HOUSE_RESULTS_SOURCES = Object.freeze([
  Object.freeze({ ...PHALADEEPIKA_SASTRI, pageLocus: 'Adhyaya XXVI, slokas 9-24, printed pp.289-296 (PDF 324-331): the Sun (9-11), the Moon (12), Mars (13-16), Mercury (17), Jupiter (18-20), Venus (21), Saturn (22-23), Rahu (24, "तमः")' }),
  Object.freeze({ ...PHALADEEPIKA_KAPOOR, pageLocus: 'Chapter 26, slokas 9-24, e-text pp.247-251; note to sloka 24: "The author has not given the effects of the transit of Ketu. Probably they will be the same as those of Rahu"' }),
]);
const KETU_NOTE_TA = 'கேதுவுக்கு ஸ்லோகம் இல்லை — ஸ்லோகம் 24 "तमः" (ராகு) மட்டும் சொல்கிறது; கபூர்: "ராகுவைப் போலவே இருக்கலாம்". இங்கே கேதுவுக்குப் பலன் காட்டப்படவில்லை.';

/**
 * Verse 25 (and Vishnu Bhaskar): the third of a sign in which a planet gives
 * its result — 0 first (0-10°), 1 middle, 2 last; null all through. Ketu is
 * named by neither.
 */
const DECANATE = deepFreeze({
  Sun: 0, Mars: 0, Jupiter: 1, Venus: 1, Moon: 2, Saturn: 2, Mercury: null, Rahu: null,
});
const DECANATE_TA = Object.freeze(['முதல் மூன்றில் ஒரு பகுதி (0°-10°)', 'நடு மூன்றில் ஒரு பகுதி (10°-20°)', 'கடைசி மூன்றில் ஒரு பகுதி (20°-30°)']);
const DECANATE_SOURCES = Object.freeze([
  Object.freeze({ ...PHALADEEPIKA_SASTRI, pageLocus: 'Adhyaya XXVI, sloka 25, printed p.296 (PDF 331): "Mars and the Sun produce effect (during their passage) when they are in the initial 10 degrees or first decanate of a sign. Jupiter and Venus become effective when they are in the middle portion of a sign (2nd decanate) while the Moon and Saturn bear fruit when in the last portion. Mercury and Rahu produce effect throughout their passage"' }),
  Object.freeze({ ...VISHNU_BHASKAR, pageLocus: 'Chapter 14, Part A, item 13 "Timing of result of a planet\'s transit", printed p.141 (PDF page 55 of volume-1 part 02): "Su, Ma: in 1st decanate ... Ju, Ve: in a 2nd decanate. Mo, Sa: in a 3rd decanate. Me, Ra: always effective"' }),
]);

/** Verses 30-34 and 41. `computed` says what the page works out. */
const RULES = deepFreeze([
  { id: 'ASPECT', verse: '30', computed: false, textTa: 'தீய பலன் தர வேண்டிய கிரகத்தைச் சுபக் கிரகம் பார்த்தால், அல்லது நல்ல பலன் தர வேண்டிய கிரகத்தைப் பாபக் கிரகம் பார்த்தால் — இரண்டும் பலன் அற்றுப் போகும்; அவரவர் பகைக் கிரகங்கள் பார்த்தாலும் அப்படியே.', whyNotTa: 'பார்வையும் பகைமையும் இந்த அத்தியாயத்தில் வரையறுக்கப்படவில்லை — கணிக்கவில்லை.', source: Object.freeze({ ...PHALADEEPIKA_SASTRI, pageLocus: 'Adhyaya XXVI, sloka 30, printed p.299 (PDF 334)' }) },
  { id: 'OWN_EXALTED', verse: '31', computed: false, textTa: 'தீய இடத்தில் இருந்தாலும் உச்சத்திலோ சொந்த ராசியிலோ இருந்தால் தீமை செய்யாது; நல்ல இடத்திலும் உச்ச / சொந்த ராசியில் இருந்தால் முழு நற்பலன்.', whyNotTa: 'இன்னும் கணிக்கப்படவில்லை.', source: Object.freeze({ ...PHALADEEPIKA_SASTRI, pageLocus: 'Adhyaya XXVI, sloka 31, printed p.299 (PDF 334)' }) },
  { id: 'DEBILITATED', verse: '32', computed: false, textTa: 'நல்ல இடத்தில் இருந்தாலும் நீசம், பகை வீடு அல்லது அஸ்தங்கம் என்றால் பலன் அற்றுப் போகும்; தீய இடத்திலும் அப்படி என்றால் தீமை மிகும்.', whyNotTa: 'பகை வீடும் அஸ்தங்க அளவும் இந்த அத்தியாயத்தில் இல்லை — கணிக்கவில்லை.', source: Object.freeze({ ...PHALADEEPIKA_SASTRI, pageLocus: 'Adhyaya XXVI, sloka 32, printed p.299 (PDF 334)' }) },
  { id: 'DANGER_12_8_1', verse: '33', computed: true, planets: ['Saturn', 'Sun', 'Mars', 'Jupiter'], houses: [12, 8, 1], textTa: 'சனி, சூரியன், செவ்வாய், குரு சந்திரனிலிருந்து 12, 8, 1-ஆம் இடங்களில் செல்லும்போது உயிருக்கு ஐயம், பதவியிலிருந்து வீழ்ச்சி, பண இழப்பு.', noteTa: 'ஸ்லோகம்: "द्वादशाष्टमजन्मस्थाः" — 12, 8, 1 (சாஸ்திரி). கபூரின் மொழிபெயர்ப்பு "1st, 8th or 10th" — ஸ்லோகத்துடன் பொருந்தவில்லை.', source: Object.freeze({ ...PHALADEEPIKA_SASTRI, pageLocus: 'Adhyaya XXVI, sloka 33, printed p.300 (PDF 335): "Saturn, the Sun, Mars and Jupiter when they transit the 12th, 8th or the 1st, (counted from the Moon\'s place) bring about danger to life itself, a fall from one\'s position and loss of wealth"; the verse "द्वादशाष्टमजन्मस्थाः शन्यर्काङ्गारका गुरुः"' }), kapoor: Object.freeze({ ...PHALADEEPIKA_KAPOOR, pageLocus: 'Chapter 26, sloka 33, e-text p.253: "the 1st, 8th or 10th house reckoned from the Moon sign"' }) },
  { id: 'ALL_EIGHT', verse: '34', computed: true, positions: { Moon: 8, Mars: 7, Rahu: 9, Venus: 6, Jupiter: 3, Sun: 5, Saturn: 1, Mercury: 4 }, textTa: 'சந்திரன் 8, செவ்வாய் 7, ராகு 9, சுக்கிரன் 6, குரு 3, சூரியன் 5, சனி 1, புதன் 4 — "இவை எல்லாம் ஒருசேர இருந்தால்" மதிப்பும் செல்வமும் இழப்பு, உயிருக்கும் ஆபத்து.', source: Object.freeze({ ...PHALADEEPIKA_SASTRI, pageLocus: 'Adhyaya XXVI, sloka 34, printed p.300 (PDF 335): "... bring about loss of honour and wealth, and danger to life also, if all the conditions exist"' }) },
  { id: 'BINDUS', verse: '41', computed: false, textTa: 'அஷ்டகவர்க்கத்தில் அதிக நன்மைப் புள்ளிகள் உள்ள ராசியில் செல்லும் கிரகம் — அது 12, 6, 8-ஆக இருந்தாலும் — எப்போதும் நல்ல பலன்.', whyNotTa: '"அதிக" என்பது எத்தனை என்று சொல்லப்படவில்லை — கணிக்கவில்லை; சனிக்கு அஷ்டகவர்க்கக் கணக்கு /saturn-transit பக்கத்தில்.', source: Object.freeze({ ...PHALADEEPIKA_SASTRI, pageLocus: 'Adhyaya XXVI, sloka 41, printed p.303 (PDF 338): "Planets passing through Rasis containing more benefic dots in the Ashtakavarga produce good effect always. Even when such Rasis happen to be the 12th, 6th or 8th"' }) },
]);

/** Words on verse 25's rule (sources in that order): Sastri 57, Vishnu Bhaskar 43 — the two agree. */
const DECANATE_WORDS = deepFreeze({ PHALADEEPIKA: 57, VISHNU_BHASKAR: 43 });

module.exports = { HOUSE_RESULTS, VERSE_OF, HOUSE_RESULTS_SOURCES, KETU_NOTE_TA, DECANATE, DECANATE_TA, DECANATE_SOURCES, DECANATE_WORDS, RULES };
