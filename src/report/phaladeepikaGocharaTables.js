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

const { PHALADEEPIKA_SASTRI, PHALADEEPIKA_KAPOOR, JATAKA_PARIJATA_VOL2, BRIHAT_JATAKA_CHIDAMBARAM } = require('./classicSources');
const { SOURCES: { VISHNU_BHASKAR, PULIPPANI } } = require('./saturnTransitTables');
const { PATEL } = require('./saturnAshtakavargaTables');
const { BHAT, CHARAK } = require('./saptashalakaTables');
const { SOURCES: { RAJ_KUMAR_CHARISMA } } = require('./moorthiTables');
const { BINDU_TABLE } = require('../chart/ashtakavarga');

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
  { id: 'ASPECT', verse: '30', computed: true, textTa: 'தீய பலன் தர வேண்டிய கிரகத்தைச் சுபக் கிரகம் பார்த்தால், அல்லது நல்ல பலன் தர வேண்டிய கிரகத்தைப் பாபக் கிரகம் பார்த்தால் — இரண்டும் பலன் அற்றுப் போகும்; பகைக் கிரகம் பார்க்கும் கிரகமும் அப்படியே.', noteTa: 'ஸ்லோகம்: "…यः शत्रुणा … विलोकितश्च" — பகைவர் பார்க்கும் கிரகமும் "பலன் அற்றது" (சாஸ்திரி: "the same will be the case"); கபூர் அதை "நன்மை செய்யும் திறனை இழக்கும்" என்று நல்ல பலனுக்கு மட்டும் சுருக்குகிறார். பார்வை: II.23; சுப / பாபர்: II.27; பகை: II.21-22, 35.', source: Object.freeze({ ...PHALADEEPIKA_SASTRI, pageLocus: 'Adhyaya XXVI, sloka 30, printed p.299 (PDF 334): the verse "असत्फलः सौम्यनिरीक्षितो यः शुभप्रदश्चाप्यशुभेक्षितश्च । द्वौ निष्फलौ … यः शत्रुणा … विलोकितश्च"; "A planet yielding unfavourable result when aspected by a benefic, or the one that gives good results if aspected by a malefic, both become void of effect. The same will be the case if they are aspected by their respective inimical planets"' }), kapoor: Object.freeze({ ...PHALADEEPIKA_KAPOOR, pageLocus: 'Chapter 26, sloka 30, e-text p.253: "(c) A planet loses his capability to do good If he is aspected by an Inimical planet or planets"' }) },
  { id: 'OWN_EXALTED', verse: '31', computed: true, textTa: 'தீய இடத்தில் இருந்தாலும் உச்சத்திலோ சொந்த ராசியிலோ ("स्वोच्चस्वगेह") இருந்தால் தீமை செய்யாது; நல்ல இடத்திலும் உச்ச / சொந்த ராசியில் இருந்தால் முழு நற்பலன்.', noteTa: 'உச்சம், சொந்த வீடு: பலதீபிகை I.6. ராகு, கேதுவுக்கு மந்த்ரேஸ்வரர் சொல்லவில்லை — கணிக்கவில்லை.', source: Object.freeze({ ...PHALADEEPIKA_SASTRI, pageLocus: 'Adhyaya XXVI, sloka 31, printed p.299 (PDF 334): the verse "अनिष्टभावस्थितखेचरेन्द्रः स्वोच्चस्वगेहोपगतो यदि स्यात् । न दोषकृच्चोत्तमभावगश्चेत् पूर्णं फलं यच्छति गोचरेषु"' }) },
  { id: 'DEBILITATED', verse: '32', computed: true, textTa: 'நல்ல இடத்தில் இருந்தாலும் நீசம், பகை வீடு அல்லது அஸ்தங்கம் ("नीचारिमौढ्यं") என்றால் பலன் அற்றுப் போகும்; தீய இடத்திலும் அப்படி என்றால் மிகுந்த கஷ்டம்.', noteTa: 'நீசம்: I.6; பகை வீடு: இயற்கைப் பகைவர் ஆளும் ராசி (II.21-22, 35); அஸ்தங்கப் பாகைகள்: கபூரின் குறிப்பு (II.36), விஷ்ணு பாஸ்கர் — ஸ்லோகம் பாகை தரவில்லை.', source: Object.freeze({ ...PHALADEEPIKA_SASTRI, pageLocus: 'Adhyaya XXVI, sloka 32, printed p.299 (PDF 334): the verse "ग्रहेश्वरास्ते शुभगोचरस्था नीचारिमौढ्यं समुपाश्रिताश्चेत् । ते निष्फलाः किन्त्वशुभाङ्कसंस्थाः कष्टं फलं संविदधत्यनल्पम्"' }) },
  { id: 'DANGER_12_8_1', verse: '33', computed: true, planets: ['Saturn', 'Sun', 'Mars', 'Jupiter'], houses: [12, 8, 1], textTa: 'சனி, சூரியன், செவ்வாய், குரு சந்திரனிலிருந்து 12, 8, 1-ஆம் இடங்களில் செல்லும்போது உயிருக்கு ஐயம், பதவியிலிருந்து வீழ்ச்சி, பண இழப்பு.', noteTa: 'ஸ்லோகம்: "द्वादशाष्टमजन्मस्थाः" — 12, 8, 1 (சாஸ்திரி). கபூரின் மொழிபெயர்ப்பு "1st, 8th or 10th" — ஸ்லோகத்துடன் பொருந்தவில்லை.', source: Object.freeze({ ...PHALADEEPIKA_SASTRI, pageLocus: 'Adhyaya XXVI, sloka 33, printed p.300 (PDF 335): "Saturn, the Sun, Mars and Jupiter when they transit the 12th, 8th or the 1st, (counted from the Moon\'s place) bring about danger to life itself, a fall from one\'s position and loss of wealth"; the verse "द्वादशाष्टमजन्मस्थाः शन्यर्काङ्गारका गुरुः"' }), kapoor: Object.freeze({ ...PHALADEEPIKA_KAPOOR, pageLocus: 'Chapter 26, sloka 33, e-text p.253: "the 1st, 8th or 10th house reckoned from the Moon sign"' }) },
  { id: 'ALL_EIGHT', verse: '34', computed: true, positions: { Moon: 8, Mars: 7, Rahu: 9, Venus: 6, Jupiter: 3, Sun: 5, Saturn: 1, Mercury: 4 }, textTa: 'சந்திரன் 8, செவ்வாய் 7, ராகு 9, சுக்கிரன் 6, குரு 3, சூரியன் 5, சனி 1, புதன் 4 — "இவை எல்லாம் ஒருசேர இருந்தால்" மதிப்பும் செல்வமும் இழப்பு, உயிருக்கும் ஆபத்து.', source: Object.freeze({ ...PHALADEEPIKA_SASTRI, pageLocus: 'Adhyaya XXVI, sloka 34, printed p.300 (PDF 335): "... bring about loss of honour and wealth, and danger to life also, if all the conditions exist"' }) },
  { id: 'BINDUS', verse: '41', computed: true, textTa: 'அஷ்டகவர்க்கத்தில் அதிக நன்மைப் புள்ளிகள் உள்ள ராசியில் செல்லும் கிரகம் — அது 12, 6, 8-ஆக இருந்தாலும் — எப்போதும் நல்ல பலன்.', noteTa: 'ஸ்லோகம்: "यत्राष्टवर्गेऽधिकबिन्दवः" — "அதிக பரல்" எத்தனை என்று இங்கே சொல்லவில்லை. இரண்டு வாசிப்புகளும் கணிக்கப்படுகின்றன (கீழே): சர்வாஷ்டகம் 28-க்கு மேல் (இயல்பு — அதே நூல் XXIII.20 அதே சொல்லை 28-க்கு மேல் என்று எண்ணுடன் சொல்கிறது; புலிப்பாணி), அல்லது கிரகத்தின் சொந்த அஷ்டகவர்க்கத்தில் 5 அல்லது மேல் (ஜாதக பாரிஜாதம் X.9, 11; வராகமிகிரர் IX.8; படேல்).', source: Object.freeze({ ...PHALADEEPIKA_SASTRI, pageLocus: 'Adhyaya XXVI, sloka 41, printed p.303 (PDF 338): the verse "यत्राष्टवर्गेऽधिकबिन्दवः स्युस्तत्र स्थितो गोचरतो ग्रहेन्द्रः"; "Planets passing through Rasis containing more benefic dots in the Ashtakavarga produce good effect always. Even when such Rasis happen to be the 12th, 6th or 8th"' }) },
]);

// ---------------------------------------------------------------------------
// Verses 31-32: exaltation, own sign, debilitation, enemy's sign, combustion
// ---------------------------------------------------------------------------

/**
 * The definitions verses 31-32 need, from the same book: lords of the signs
 * and exaltation signs (I.6; debilitation is the 7th), natural enmity (II.21-22,
 * the unmentioned taking the remaining relation; Rahu and Ketu II.35).
 * Mantreswara gives no exaltation or own sign for the nodes (Kapoor's note to
 * I.6), so for them only the enemy's sign is judged. Combustion degrees are not
 * in the verses; Kapoor's note to II.36 and Vishnu Bhaskar give the same
 * figures.
 */
const SIGN_LORDS = Object.freeze(['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter']);
const EXALTATION_SIGN = deepFreeze({ Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6 });
const NATURAL_ENEMIES = deepFreeze({
  Sun: ['Venus', 'Saturn'], Moon: [], Mars: ['Mercury'], Mercury: ['Moon'], Jupiter: ['Mercury', 'Venus'],
  Venus: ['Sun', 'Moon'], Saturn: ['Sun', 'Moon', 'Mars'], Rahu: ['Sun', 'Moon', 'Jupiter'], Ketu: ['Sun', 'Moon', 'Jupiter'],
});
/** Degrees from the Sun within which a planet is combust; [direct, retrograde] where they differ. */
const COMBUSTION_DEGREES = deepFreeze({ Moon: 12, Mars: 17, Mercury: [14, 12], Jupiter: 11, Venus: [10, 8], Saturn: 15 });

const DIGNITY_SOURCES = Object.freeze({
  lords: Object.freeze({ ...PHALADEEPIKA_SASTRI, pageLocus: 'Adhyaya I, sloka 6, printed p.3 (PDF 40): "Mars, Venus, Mercury, the Moon, the Sun, Mercury, Venus, Mars, Jupiter, Saturn, Saturn and Jupiter are respectively declared the lords of the signs from Mesha onwards. Mesha, Vrishabha, Makara, Kanya, Karkataka, Meena and Tula are the exaltation signs of the seven planets respectively from the Sun onwards, their signs of \'fall\' being the 7th from their exaltation ones"' }),
  friends: Object.freeze({ ...PHALADEEPIKA_SASTRI, pageLocus: 'Adhyaya II, slokas 21-22, printed p.17 (PDF 54): "Mercury is the Sun\'s neutral; Saturn and Venus are his enemies ... In cases where certain planets have been omitted, they must be considered to fulfil the relationship that has not been mentioned"' }),
  nodes: Object.freeze({ ...PHALADEEPIKA_SASTRI, pageLocus: 'Adhyaya II, sloka 35, printed p.22 (PDF 59): "Mercury, Saturn and Venus are the friends of Rahu as well as Ketu. Mars is neutral to them. The rest are enemies"' }),
  nodesExaltation: Object.freeze({ ...PHALADEEPIKA_KAPOOR, pageLocus: 'Chapter 1, note to sloka 6, e-text p.12: "There is great difference of opinion amongst the ancient learneds about the exaltation and debilitation signs of Rahu and Ketu. Mantreswara has expressed no opinion in that regard"' }),
  badlyPlaced: Object.freeze({ ...PHALADEEPIKA_SASTRI, pageLocus: 'Adhyaya II, sloka 36, printed p.23 (PDF 60): "Planets are said to be badly-placed when they are eclipsed, debilitated (occupy a depression sign or Amsa), when they are posited in the house of an enemy"' }),
  combustionKapoor: Object.freeze({ ...PHALADEEPIKA_KAPOOR, pageLocus: 'Chapter 2, note to sloka 36, e-text pp.26-27: "The Moon is said to be eclipsed if she is 12° away from the Sun. Mars ... 17° ... Mercury in direct motion ... 14° ... Retrograde Mercury ... 12° ... Jupiter, Venus and Saturn ... 11°, 10° and 15° ... A retrograde Venus ... 8°"' }),
  combustionVishnuBhaskar: Object.freeze({ ...VISHNU_BHASKAR, pageLocus: 'Chapter 1 §XX.6 "Combustion and its cancellation", printed p.13 (PDF page 25 of volume-1 part 01): "Degrees of combustion" — Moon 12°, Mars 17°, Mercury 13° (14° direct, 12° retrograde), Jupiter 11°, Venus 9° (10° direct, 8° retrograde), Saturn 15°' }),
});

const DIGNITY_READINGS_TA = Object.freeze([
  'உச்சம், நீசம், சொந்த வீடு, பகை வீடு — முழு ராசி (I.6); உச்சப் பாகை கணக்கில் இல்லை.',
  '"பகை வீடு" ("अरि") = இயற்கைப் பகைவர் ஆளும் ராசி (II.21-22; ராகு, கேது II.35). ஜாதகத்தின் தற்காலிக உறவு கோசாரத்துக்குப் பொருந்துமா என்று ஸ்லோகம் சொல்லவில்லை — இயற்கை உறவு மட்டும் (எங்கள் வாசிப்பு).',
  '"மௌட்யம்" (அஸ்தங்கம்): சூரியனிலிருந்து கபூர், விஷ்ணு பாஸ்கர் தரும் பாகைக்குள் — புதன், சுக்கிரன் வக்கிரமாக இருந்தால் குறைந்த அளவு. ஸ்லோகம் பாகை தரவில்லை. சூரியனுக்கும் ராகு, கேதுவுக்கும் அஸ்தங்கம் இல்லை.',
  'ராகு, கேது: உச்சமோ சொந்த வீடோ மந்த்ரேஸ்வரர் சொல்லவில்லை (கபூர்) — அதனால் ஸ்லோ. 31-ம் நீசமும் அவற்றுக்குக் கணிக்கப்படவில்லை; பகை வீடு மட்டும்.',
  '"நல்ல இடம் / தீய இடம்" — பலதீபிகை ஸ்லோ. 2-ன் நல்ல இடங்கள் (மேலே தேர்ந்தெடுத்த நூல் எதுவானாலும்).',
  'இரண்டு ஸ்லோகங்களும் ஒரே நேரத்தில் பொருந்தினால் (எ.கா. உச்சத்தில் இருக்கும் குரு அஸ்தங்கமானால்) இரண்டும் காட்டப்படுகின்றன — எது வெல்லும் என்று ஸ்லோகம் சொல்லவில்லை.',
]);

// ---------------------------------------------------------------------------
// Verse 30: aspects (II.23), benefic and malefic (II.27)
// ---------------------------------------------------------------------------

/** II.23: houses (counted from the planet's sign) a planet aspects fully; the nodes are given none. */
const FULL_ASPECTS = deepFreeze({ Sun: [7], Moon: [7], Mars: [4, 7, 8], Mercury: [7], Jupiter: [5, 7, 9], Venus: [7], Saturn: [3, 7, 10] });
/** II.23: the partial glances of every planet, where not full. */
const PARTIAL_ASPECTS = deepFreeze({ 3: 0.25, 10: 0.25, 5: 0.5, 9: 0.5, 4: 0.75, 8: 0.75 });
/** The houses `planet` aspects fully and partly. */
function aspectsOf(planet) {
  const full = FULL_ASPECTS[planet] ?? [];
  const partial = planet in FULL_ASPECTS ? Object.entries(PARTIAL_ASPECTS).filter(([h]) => !full.includes(Number(h))).map(([h, f]) => [Number(h), f]) : [];
  return { full, partial };
}
/** II.27: fixed natures; the Moon by her paksha, Mercury by his company. */
const MALEFIC_FIXED = Object.freeze(['Sun', 'Mars', 'Saturn', 'Rahu', 'Ketu']);
const BENEFIC_FIXED = Object.freeze(['Jupiter', 'Venus']);

const ASPECT_SOURCES = Object.freeze({
  aspects: Object.freeze({ ...PHALADEEPIKA_SASTRI, pageLocus: 'Adhyaya II, sloka 23, printed p.18 (PDF 55): "Saturn casts a full glance at the 3rd and 10th houses; Jupiter at the 5th and 9th; and Mars at the 4th and 8th. All planets cast a quarter glance at the 3rd and 10th houses, half a glance at the 5th and 9th; three-quarters of a glance at the 4th and 8th; and a full eye at the 7th"' }),
  nature: Object.freeze({ ...PHALADEEPIKA_SASTRI, pageLocus: 'Adhyaya II, sloka 27, printed pp.19-20 (PDF 56-57): "The waning Moon, the Sun, Mars, Rahu, Ketu and Saturn are known as malefic planets. Mercury too in conjunction with any of them is malignant also"; the verse "क्षीणेन्दुर्ककुजाहिकेतुरविजाः पापाः सपापश्च वित्"' }),
});

const ASPECT_READINGS_TA = Object.freeze([
  'பார்வை (II.23): எல்லாக் கிரகங்களும் 7-ஆம் இடத்தை முழுமையாக; சனி 3, 10; குரு 5, 9; செவ்வாய் 4, 8 முழுமையாக. மற்றவை 3, 10-ல் கால், 5, 9-ல் அரை, 4, 8-ல் முக்கால் பார்வை. ஸ்லோ. 30-க்கு முழுப் பார்வை மட்டும் கணக்கில் (எங்கள் வாசிப்பு); மற்றவை "இப்போது" பகுதியில் தகவலாக மட்டும். ராசி அடிப்படையில் (முழு ராசி).',
  'ராகு, கேதுவுக்குப் பார்வை II.23-ல் இல்லை — அவை பார்ப்பதாகக் கணக்கில் இல்லை; அவை பார்க்கப்படுவது கணக்கில் உண்டு.',
  'சுப / பாபர் (II.27): சூரியன், செவ்வாய், சனி, ராகு, கேது, "க்ஷீண" (தேய்) சந்திரன் பாபர்; இவர்களில் ஒருவருடன் அதே ராசியில் இருக்கும் புதனும் பாபர். குரு, சுக்கிரன், வளர் சந்திரன், தனியாக அல்லது சுபருடன் உள்ள புதன் சுபர். "தேய் சந்திரன்" = பௌர்ணமி முதல் அமாவாசை வரை (சூரியனிலிருந்து 180°-360°) — எங்கள் வாசிப்பு.',
  'காலவரிசையில் சந்திரனின் பார்வைகள் (மாதம் ஒருமுறை, சுமார் 2¼ நாள்) எண்ணிக்கையாக மட்டும் — பட்டியலிடப்படவில்லை; புதனின் தன்மை சூரியன், செவ்வாய், சனி, ராகு, கேது உடனிருப்பைக் கொண்டு (சந்திரனின் குறுகிய வருகைகள் காலவரிசையில் கணக்கில் இல்லை; "இப்போது" பகுதியில் உண்டு).',
  '"பகைக் கிரகம்" = இயற்கைப் பகைவர் (II.21-22, 35). சுபர் நல்ல இடத்தில் உள்ள கிரகத்தைப் பார்ப்பதும், பாபர் தீய இடத்தில் உள்ளதைப் பார்ப்பதும் ஸ்லோகத்தில் இல்லை — அவை காட்டப்படுகின்றன, தீர்ப்பு இல்லை.',
]);

/** Verse 30 for one aspecting planet: what its aspect does to a planet in a good or bad house. */
function verse30Effect({ nature, enemy }, goodHouse) {
  return {
    voids: (goodHouse && nature === 'MALEFIC') ? 'GOOD' : (!goodHouse && nature === 'BENEFIC') ? 'BAD' : null,
    enemy: Boolean(enemy),
  };
}

/** Words on verse 25's rule (sources in that order): Sastri 57, Vishnu Bhaskar 43 — the two agree. */
const DECANATE_WORDS = deepFreeze({ PHALADEEPIKA: 57, VISHNU_BHASKAR: 43 });

/** A planet's standing in a sign under I.6, II.21-22 and II.35. null where the book gives nothing (the nodes' exaltation and own sign). */
function dignityOf(planet, sign) {
  const node = planet === 'Rahu' || planet === 'Ketu';
  const lord = SIGN_LORDS[sign];
  return {
    exalted: node ? null : EXALTATION_SIGN[planet] === sign,
    debilitated: node ? null : (EXALTATION_SIGN[planet] + 6) % 12 === sign,
    own: node ? null : lord === planet,
    enemySign: NATURAL_ENEMIES[planet].includes(lord),
    lord,
  };
}

/** The orb for combustion; null for the Sun and the nodes. */
function combustionOrb(planet, retrograde) {
  const d = COMBUSTION_DEGREES[planet];
  if (d === undefined) return null;
  return Array.isArray(d) ? d[retrograde ? 1 : 0] : d;
}

/**
 * Verses 31-32 for a planet in a good or bad house: 'FULL' / 'NO_HARM' (exalted
 * or own sign), 'VOID' / 'AGGRAVATED' (debilitated, enemy's sign or combust);
 * both may hold at once (own sign and combust, say). `combust` may be null (not
 * applicable) or undefined (not judged for a whole stay).
 */
function verses31and32(dignity, combust, goodHouse) {
  const v31 = dignity.exalted || dignity.own ? (goodHouse ? 'FULL' : 'NO_HARM') : null;
  const reasons = [dignity.debilitated && 'DEBILITATED', dignity.enemySign && 'ENEMY_SIGN', combust === true && 'COMBUST'].filter(Boolean);
  const v32 = reasons.length ? (goodHouse ? 'VOID' : 'AGGRAVATED') : null;
  return { v31, v32, reasons };
}

// ---------------------------------------------------------------------------
// Verse 41: "more bindus" (added 2026-10-10)
// ---------------------------------------------------------------------------

/**
 * Two tables of benefic places. Varahamihira's (Brihat Jataka IX.1-7) is the
 * one `ashtakavarga.js` uses — every cell checked against the 1905 translation.
 * Phaladeepika's own (XXIII.3-9) is the same in all cells but one: the Moon's
 * from Jupiter, where Mantreswara gives the 2nd (Parasara's) and Varahamihira
 * the 12th — Sastri's footnote says so. For Venus's from Mars Mantreswara gives
 * Varahamihira's 5th; the footnote gives Parasara's 4th.
 */
const PHALADEEPIKA_BINDU_CELLS = deepFreeze({ Moon: { Jupiter: [1, 2, 4, 7, 8, 10, 11] } });
const BINDU_TABLES = deepFreeze({
  order: ['PHALADEEPIKA', 'VARAHAMIHIRA'],
  default: 'PHALADEEPIKA',
  PHALADEEPIKA: {
    labelTa: 'பலதீபிகை XXIII.3-9',
    table: Object.fromEntries(Object.entries(BINDU_TABLE).map(([t, row]) => [t, { ...row, ...(PHALADEEPIKA_BINDU_CELLS[t] ?? {}) }])),
    noteTa: 'மந்த்ரேஸ்வரரின் சொந்த அட்டவணை. வராகமிகிரருடையதிலிருந்து ஒரே ஒரு இடம் மாறுகிறது: சந்திரனின் அஷ்டகவர்க்கத்தில் குரு கொடுக்கும் இடங்கள் 1, 2, 4, 7, 8, 10, 11 (வராகமிகிரர்: 2-க்குப் பதில் 12).',
    sources: [
      Object.freeze({ ...PHALADEEPIKA_SASTRI, pageLocus: 'Adhyaya XXIII, slokas 3-9, printed pp.258-261 (PDF 295-298): the benefic places of the seven planets\' Ashtakavargas' }),
      Object.freeze({ ...PHALADEEPIKA_SASTRI, pageLocus: 'Adhyaya XXIII, sloka 4, printed p.258 (PDF 295): the Moon "in the 1st, 2nd, 4th, 7th, 8th, 10th and 11th places from Jupiter"; footnote: "According to Varahamihira, 1st, 4th, 7th, 8th, 10th, 11th and 12th places from Jupiter"' }),
      Object.freeze({ ...PHALADEEPIKA_SASTRI, pageLocus: 'Adhyaya XXIII, sloka 8, printed p.260 (PDF 297): Venus "in the 3rd, 5th, 6th, 9th, 11th and 12th places from Mars"; footnote: "According to Parasara, the 3rd, 4th, 6th, 9th, 11th and 12th places from Mars"' }),
    ],
  },
  VARAHAMIHIRA: {
    labelTa: 'வராகமிகிரர் (பிருஹத் ஜாதகம் IX)',
    table: BINDU_TABLE,
    noteTa: 'இந்த மென்பொருளின் மற்ற பக்கங்கள் பயன்படுத்தும் அட்டவணை (வினய் ஆதித்யா) — பிருஹத் ஜாதகம் IX.1-7-உடன் எல்லா இடங்களிலும் ஒன்றே.',
    sources: [
      Object.freeze({ ...BRIHAT_JATAKA_CHIDAMBARAM, pageLocus: 'Chapter IX "On Ashtakavargas", slokas 1-7, printed pp.97-99 (PDF 134-136): the benefic places of the seven planets; the Moon\'s "1st, 4th, 7th, 8th, 10th, 11th and 12th houses from Jupiter", Venus\'s "3rd, 5th, 6th, 9th, 11th and 12th houses from Mars"' }),
    ],
  },
});

/** XXIII.11: a planet transiting a sign with n bindus in its own Ashtakavarga (n = 0 … 8). */
const BINDU_RESULTS_TA = Object.freeze([
  'உயிருக்கு ஆபத்து', 'அழிவு அல்லது இழப்பு', 'செலவு', 'அச்சம்', 'அச்சம்',
  'நினைத்த காரியம் கைகூடும்', 'பெண் / மனைவி கிடைத்தல்', 'செல்வம், சொத்து சேர்க்கை', 'அரசு அல்லது உயர் அரசுப் பதவி',
]);
const BINDU_RESULTS_SOURCE = Object.freeze({ ...PHALADEEPIKA_SASTRI, pageLocus: 'Adhyaya XXIII, sloka 11, printed p.262 (PDF 299): the verse "… मृतिरेकबिन्दोः । नाशो व्ययो भीतिभयार्थनारीश्रीराज्यसिद्धिः क्रमशः फलानि"; "void of any benefic dot … will lose his life … one, two, three, four, five, six, seven or eight … (1) destruction or loss (2) expenditure (3) fear (4) fear (5) accomplishment of the desired object (6) acquisition of a damsel (7) gain of wealth or property and (8) gaining a Kingdom or high Government position"' });

/** The two readings of verse 41's "more bindus", both computed; the first is the default. */
const BINDU_READINGS = deepFreeze({
  order: ['SAV_28', 'BAV_5'],
  default: 'SAV_28',
  SAV_28: {
    threshold: 28,
    labelTa: 'சர்வாஷ்டகம் 28-க்கு மேல்',
    textTa: 'ஏழு கிரகங்களின் அஷ்டகவர்க்கக் கூட்டுத்தொகையில் (சர்வாஷ்டகம்) அந்த ராசிக்கு 28-க்கு மேல் பரல். ஸ்லோகம் 41-ன் சொல் "अधिकबिन्दवः"; அதே நூல் XXIII.20-ல் அதே சொல்லை எண்ணுடன் சொல்கிறது — "अष्टाक्षसंख्याधिकबिन्दवः" (28-க்கு மேல்) — கோசாரத்துக்கே. புலிப்பாணி ஸ்லோகம் 41-ஐ இப்படியே தருகிறார்: 28-க்கு மேல் உள்ள ராசி ஜன்ம ராசிக்கு 6, 8, 12 ஆனாலும் அதில் செல்லும் எந்தக் கிரகமும் நன்மை. ராசியின் எண்ணிக்கை என்பதால் ராகு, கேதுவுக்கும் பொருந்தும். இதுவே இயல்பு: நூலின் சொந்தச் சொல்.',
    sources: [
      Object.freeze({ ...PHALADEEPIKA_SASTRI, pageLocus: 'Adhyaya XXIII, sloka 20, printed p.265 (PDF 302): the verse "सर्वग्रहाणां प्रहितेऽष्टवर्गे … अष्टाक्षसंख्याधिकबिन्दवश्चेच्छुभं तदूने व्यसनं क्रमेण"; "if it be found that any Rasi contains figures exceeding 28, it must be understood that planets in their transit over that Rasi produce good or auspicious effects. Any number falling short of that particular figure produces danger, or sorrow"' }),
      Object.freeze({ ...PULIPPANI, pageLocus: 'printed p.250 (PDF 243), "Sarvashtakavarga General" item 1: "The Rasis having more than Sarvashtaka 28 bindus, even though these Rasis are 6, 8 and 12th from Janma Rasis, whatever planet or planets crosses these Rasis ... they will give benefic results"' }),
    ],
  },
  BAV_5: {
    threshold: 5,
    labelTa: 'சொந்த அஷ்டகவர்க்கத்தில் 5 அல்லது மேல்',
    textTa: 'கோசாரக் கிரகத்தின் சொந்த (பின்ன) அஷ்டகவர்க்கத்தில் அந்த ராசிக்கு 5 அல்லது மேல் பரல் (8-ல்). ஜாதக பாரிஜாதம் X.9: "शरादि" (5 முதல்) பரல் உள்ள ராசியில் செல்லும் கிரகம் "गोचारतः" எப்போதும் நன்மை, பரல் இல்லாவிடில் கேடு; X.11: தீய இடம், நீசம், பகை ராசி ஆனாலும் "अधिबिन्दु" இருந்தால் நன்மை — ஸ்லோகம் 41-க்கு இணையான வரி; X.4: 4 பரல் ("सागर") கலப்பு. படேலின் ஸ்லோகம் 32 அதே வரி. வராகமிகிரர் IX.8: நன்மைப் பரல் தீமையை விட அதிகம் (8-ல் 5 முதல்) என்றால் நன்மை. பலதீபிகையின் சொந்த XXIII.11-லும் 3, 4 அச்சம்; 5-லிருந்தே நன்மை. ராகு, கேதுவுக்கு அஷ்டகவர்க்கம் இல்லை.',
    sources: [
      Object.freeze({ ...JATAKA_PARIJATA_VOL2, pageLocus: 'Adhyaya X, slokas 9 and 11, printed p.667 (PDF 351): "शरादिबिन्दुस्थितराशियातः स्वकीयवर्गे शुभदस्तु नित्यम् । अतोऽन्यथा चेदफलप्रदाता गोचारतः शून्यफले प्रमाथी" — "A planet is invariably benefic in his own varga in any sign which has five or more dots. If otherwise, it yields no good effect. In its range in a sign which is without dots, it becomes positively hurtful"; sloka 11 "ते सर्वे शुभदा नित्यमधिबिन्दुयुता यदि" — planets in bad positions, depression or an inimical sign' }),
      Object.freeze({ ...JATAKA_PARIJATA_VOL2, pageLocus: 'Adhyaya X, sloka 4, printed p.665 (PDF 349): "मिश्रं फलं भवति सागरबिन्दुयोगे" — "When a house has 4 dots, it produces mixed effects"; and the note on printed p.664 (PDF 338): "benefic, mixed or malefic according as the number of benefic dots in the Rasi … in the Bhinnashtakavarga of the planet is greater than, equal to or less than 4"' }),
      Object.freeze({ ...BRIHAT_JATAKA_CHIDAMBARAM, pageLocus: 'Chapter IX, sloka 8, printed p.99 (PDF 136): "A place will produce benefic or malefic effects if it be more benefic for the planet than malefic or vice versa"' }),
      Object.freeze({ ...PATEL, pageLocus: 'slokas 29 and 32, printed p.59 (PDF 93): sloka 32 the same verse as Jataka Parijata X.9, "A planet is always auspicious when he transits a bhava having 5 or more bindus in his own Ashtakavarga … 3 or less … incapable of giving good results"; sloka 29 "with 4 bindus … mixed effects"' }),
    ],
  },
});

/** Kapoor's "4 or more", and the books that say so: recorded, not computed. */
const BINDU_FOUR_NOTE = deepFreeze({
  textTa: '4 பரல்: ஜாதக பாரிஜாதம் X.4, படேல் — கலப்பு; பலதீபிகை XXIII.11 — அச்சம். கபூர் 4-ஐ "மிதம்" என்றும் "4 அல்லது மேல்" நன்மை கூடும் என்றும் எழுதுகிறார்; அவரது XXIII.11 பட்டியலில் ஏழு பலன்களே — ஒரு "அச்சம்" விடுபட்டு 4-க்கே "நினைத்தது கைகூடும்" வருகிறது; ஸ்லோகத்தில் "भीति", "भय" என இரண்டு. ராஜ் குமாரும் (Charisma) "4 அல்லது மேல்" நன்மை என்கிறார். இந்த வாசிப்பு கணிக்கப்படவில்லை; 4 பரல் வரும்போது குறிக்கப்படுகிறது.',
  sources: [
    Object.freeze({ ...PHALADEEPIKA_KAPOOR, pageLocus: 'Chapter 23, notes to slokas 9-10 and sloka 11, e-text pp.225-226: "Medium effects may be expected in case of 4 benefic bindus. Increasingly good effects may be expected when there are 4 or more benefic bindus"; sloka 11 lists seven results for 1-7 bindus (one "fear")' }),
    Object.freeze({ ...RAJ_KUMAR_CHARISMA, pageLocus: 'PDF p.252: "If a sign has four or more benefic points in its Bhinnastak, the planet while transiting in it gives auspicious results"' }),
  ],
});

/** Every book in the library that puts a number on "more" for a transit, read 2026-10-10. */
const BINDU_SURVEY = deepFreeze([
  { reading: 'SAV_28', bookTa: 'பலதீபிகை XXIII.20 (சாஸ்திரி)', saysTa: 'சர்வாஷ்டகம் 28-க்கு மேல் — கோசாரத்தில் நன்மை; குறைந்தால் துன்பம்' },
  { reading: 'SAV_28', bookTa: 'புலிப்பாணி ப.250', saysTa: 'சர்வாஷ்டகம் 28-க்கு மேல் — ஜன்ம ராசிக்கு 6, 8, 12 ஆனாலும் நன்மை (ஸ்லோ. 41-ன் வாசிப்பு)' },
  { reading: 'BAV_5', bookTa: 'பலதீபிகை XXIII.11 (சாஸ்திரி)', saysTa: '0 உயிருக்கு ஆபத்து … 3, 4 அச்சம்; 5 நினைத்தது கைகூடும் … 8 அரசு' },
  { reading: 'BAV_5', bookTa: 'ஜாதக பாரிஜாதம் X.4, 9, 11', saysTa: '4 கலப்பு; 5 முதல் கோசாரத்தில் எப்போதும் நன்மை; தீய இடத்திலும் அதிக பரல் நன்மை' },
  { reading: 'BAV_5', bookTa: 'வராகமிகிரர், பிருஹத் ஜாதகம் IX.8', saysTa: 'நன்மைப் பரல் தீமையை விட அதிகம் என்றால் நன்மை' },
  { reading: 'BAV_5', bookTa: 'படேல், ஸ்லோ. 29, 32; முன்னுரை ப.xxvi', saysTa: '4 கலப்பு; 5 அல்லது மேல் எப்போதும் நன்மை; 4-க்கு மேல் நன்மை, 4-க்குக் கீழ் தீமை' },
  { reading: 'BAV_5', bookTa: 'பட், Fundamentals ப.259', saysTa: '4-க்கு மேல் உள்ள வீடுகள் மட்டுமே நல்லவை; சந்திரனுக்கு 12-ஆம் வீட்டில் 6 பரல் — கேடில்லை' },
  { reading: 'BAV_5', bookTa: 'புலிப்பாணி ப.243, 250', saysTa: 'சூரியனுக்கு 4-க்கு மேல் நன்மை; 4 — வருவது வந்து செலவாகும்' },
  { reading: 'BAV_5', bookTa: 'சரக், Elements (PDF ப.501)', saysTa: '4 சராசரி அல்லது கலப்பு; 5, 6, 7 நன்மை கூடும்; 3, 2, 1 தீமை கூடும்' },
  { reading: 'BAV_4', bookTa: 'கபூர் (பலதீபிகை மொழிபெயர்ப்பு)', saysTa: '4 மிதம்; 4 அல்லது மேல் நன்மை கூடும்' },
  { reading: 'BAV_4', bookTa: 'ராஜ் குமார், Charisma (PDF ப.252)', saysTa: '4 அல்லது மேல் — கோசாரத்தில் நன்மை' },
]);
const BINDU_SURVEY_SOURCES = Object.freeze([
  Object.freeze({ ...PATEL, pageLocus: 'Introduction, p.xxvi (PDF 26): "The transits of planets through a bhava containing more than 4 bindus in their respective Ashtakavargas produce auspicious results relating to that bhava; and conversely, transits through a bhava containing less than 4 bindus produce adverse results"' }),
  Object.freeze({ ...BHAT, pageLocus: 'Astakavarga chapter, printed p.259 (PDF 277): "Only those houses which contain more than 4 benefic dots are considered to be auspicious … Though Aquarius is the 12th house from the Moon, yet the Sun\'s transit through that house will not prove harmful inasmuch as he has acquired 6 benefic dots"' }),
  Object.freeze({ ...PULIPPANI, pageLocus: 'printed pp.243 and 250 (PDF 236, 243): the Sun through a Rasi with "5 bindus … gain of money", "4 bindus … moderate gain of money but will be spent soon after"; "In Sun\'s Ashtakavarga, whichever Rasis contains more than 4 (benefic) bindus … beneficial"' }),
  Object.freeze({ ...CHARAK, pageLocus: 'PDF p.501, item 5: "Four points in a house indicates average or mixed results. As the number of benefic points increases to 5, 6 or 7, the beneficence of the house increases … Houses with 3, 2 or 1 benefic points become progressively inauspicious"' }),
]);
const BINDU_NOTES_TA = Object.freeze([
  'கணக்கு பிறப்பு ஜாதகத்தின் அஷ்டகவர்க்கம் (கிரகங்களும் லக்னமும் பிறப்பில் நின்ற ராசிகளிலிருந்து); கோசாரக் கிரகம் இப்போது நிற்கும் ராசியின் பரல். ராசி முழுவதும் ஒரே எண் (கக்ஷ்யை /saturn-transit பக்கத்தில்).',
  'பலதீபிகையில் சர்வாஷ்டகத்துக்கு இன்னோர் அளவும் உண்டு — XXIV.37: 30 அல்லது மேல் எப்போதும் நன்மை, 25-30 நடுத்தரம், 25-க்குக் கீழ் துன்பம்; XXIV.39-40 அதை லக்னத்திலிருந்து எண்ணி 6, 8, 12-ஐ விலக்குகிறது. அது பாவங்களுக்கும் சுப காரியங்களுக்கும்; ஸ்லோ. 41-க்கு XXIII.20-ன் 28 எடுக்கப்பட்டது (அதே சொல், கோசாரம்).',
  'பிருஹத் பராசர ஹோரா சாஸ்திரம் (சந்தானம், கிரிஷ் சந்த்) கோசாரத்துக்கு "அதிக ரேகைகள்" என்று மட்டும் சொல்கிறது — எண் தரவில்லை. சாராவளியும் ("more benefic dots") அப்படியே.',
]);

module.exports = {
  HOUSE_RESULTS, VERSE_OF, HOUSE_RESULTS_SOURCES, KETU_NOTE_TA, DECANATE, DECANATE_TA, DECANATE_SOURCES, DECANATE_WORDS, RULES,
  SIGN_LORDS, EXALTATION_SIGN, NATURAL_ENEMIES, COMBUSTION_DEGREES, DIGNITY_SOURCES, DIGNITY_READINGS_TA,
  dignityOf, combustionOrb, verses31and32,
  FULL_ASPECTS, PARTIAL_ASPECTS, MALEFIC_FIXED, BENEFIC_FIXED, ASPECT_SOURCES, ASPECT_READINGS_TA, aspectsOf, verse30Effect,
  PHALADEEPIKA_BINDU_CELLS, BINDU_TABLES, BINDU_RESULTS_TA, BINDU_RESULTS_SOURCE, BINDU_READINGS, BINDU_FOUR_NOTE,
  BINDU_SURVEY, BINDU_SURVEY_SOURCES, BINDU_NOTES_TA,
};
