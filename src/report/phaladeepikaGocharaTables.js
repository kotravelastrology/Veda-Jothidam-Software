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
  { id: 'ASPECT', verse: '30', computed: true, textTa: 'தீய பலன் தர வேண்டிய கிரகத்தைச் சுபக் கிரகம் பார்த்தால், அல்லது நல்ல பலன் தர வேண்டிய கிரகத்தைப் பாபக் கிரகம் பார்த்தால் — இரண்டும் பலன் அற்றுப் போகும்; பகைக் கிரகம் பார்க்கும் கிரகமும் அப்படியே.', noteTa: 'ஸ்லோகம்: "…यः शत्रुणा … विलोकितश्च" — பகைவர் பார்க்கும் கிரகமும் "பலன் அற்றது" (சாஸ்திரி: "the same will be the case"); கபூர் அதை "நன்மை செய்யும் திறனை இழக்கும்" என்று நல்ல பலனுக்கு மட்டும் சுருக்குகிறார். பார்வை: II.23; சுப / பாபர்: II.27; பகை: II.21-22, 35.', source: Object.freeze({ ...PHALADEEPIKA_SASTRI, pageLocus: 'Adhyaya XXVI, sloka 30, printed p.299 (PDF 334): the verse "असत्फलः सौम्यनिरीक्षितो यः शुभप्रदश्चाप्यशुभेक्षितश्च । द्वौ निष्फलौ … यः शत्रुणा … विलोकितश्च"; "A planet yielding unfavourable result when aspected by a benefic, or the one that gives good results if aspected by a malefic, both become void of effect. The same will be the case if they are aspected by their respective inimical planets"' }), kapoor: Object.freeze({ ...PHALADEEPIKA_KAPOOR, pageLocus: 'Chapter 26, sloka 30, e-text p.253: "(c) A planet loses his capability to do good If he is aspected by an Inimical planet or planets"' }) },
  { id: 'OWN_EXALTED', verse: '31', computed: true, textTa: 'தீய இடத்தில் இருந்தாலும் உச்சத்திலோ சொந்த ராசியிலோ ("स्वोच्चस्वगेह") இருந்தால் தீமை செய்யாது; நல்ல இடத்திலும் உச்ச / சொந்த ராசியில் இருந்தால் முழு நற்பலன்.', noteTa: 'உச்சம், சொந்த வீடு: பலதீபிகை I.6. ராகு, கேதுவுக்கு மந்த்ரேஸ்வரர் சொல்லவில்லை — கணிக்கவில்லை.', source: Object.freeze({ ...PHALADEEPIKA_SASTRI, pageLocus: 'Adhyaya XXVI, sloka 31, printed p.299 (PDF 334): the verse "अनिष्टभावस्थितखेचरेन्द्रः स्वोच्चस्वगेहोपगतो यदि स्यात् । न दोषकृच्चोत्तमभावगश्चेत् पूर्णं फलं यच्छति गोचरेषु"' }) },
  { id: 'DEBILITATED', verse: '32', computed: true, textTa: 'நல்ல இடத்தில் இருந்தாலும் நீசம், பகை வீடு அல்லது அஸ்தங்கம் ("नीचारिमौढ्यं") என்றால் பலன் அற்றுப் போகும்; தீய இடத்திலும் அப்படி என்றால் மிகுந்த கஷ்டம்.', noteTa: 'நீசம்: I.6; பகை வீடு: இயற்கைப் பகைவர் ஆளும் ராசி (II.21-22, 35); அஸ்தங்கப் பாகைகள்: கபூரின் குறிப்பு (II.36), விஷ்ணு பாஸ்கர் — ஸ்லோகம் பாகை தரவில்லை.', source: Object.freeze({ ...PHALADEEPIKA_SASTRI, pageLocus: 'Adhyaya XXVI, sloka 32, printed p.299 (PDF 334): the verse "ग्रहेश्वरास्ते शुभगोचरस्था नीचारिमौढ्यं समुपाश्रिताश्चेत् । ते निष्फलाः किन्त्वशुभाङ्कसंस्थाः कष्टं फलं संविदधत्यनल्पम्"' }) },
  { id: 'DANGER_12_8_1', verse: '33', computed: true, planets: ['Saturn', 'Sun', 'Mars', 'Jupiter'], houses: [12, 8, 1], textTa: 'சனி, சூரியன், செவ்வாய், குரு சந்திரனிலிருந்து 12, 8, 1-ஆம் இடங்களில் செல்லும்போது உயிருக்கு ஐயம், பதவியிலிருந்து வீழ்ச்சி, பண இழப்பு.', noteTa: 'ஸ்லோகம்: "द्वादशाष्टमजन्मस्थाः" — 12, 8, 1 (சாஸ்திரி). கபூரின் மொழிபெயர்ப்பு "1st, 8th or 10th" — ஸ்லோகத்துடன் பொருந்தவில்லை.', source: Object.freeze({ ...PHALADEEPIKA_SASTRI, pageLocus: 'Adhyaya XXVI, sloka 33, printed p.300 (PDF 335): "Saturn, the Sun, Mars and Jupiter when they transit the 12th, 8th or the 1st, (counted from the Moon\'s place) bring about danger to life itself, a fall from one\'s position and loss of wealth"; the verse "द्वादशाष्टमजन्मस्थाः शन्यर्काङ्गारका गुरुः"' }), kapoor: Object.freeze({ ...PHALADEEPIKA_KAPOOR, pageLocus: 'Chapter 26, sloka 33, e-text p.253: "the 1st, 8th or 10th house reckoned from the Moon sign"' }) },
  { id: 'ALL_EIGHT', verse: '34', computed: true, positions: { Moon: 8, Mars: 7, Rahu: 9, Venus: 6, Jupiter: 3, Sun: 5, Saturn: 1, Mercury: 4 }, textTa: 'சந்திரன் 8, செவ்வாய் 7, ராகு 9, சுக்கிரன் 6, குரு 3, சூரியன் 5, சனி 1, புதன் 4 — "இவை எல்லாம் ஒருசேர இருந்தால்" மதிப்பும் செல்வமும் இழப்பு, உயிருக்கும் ஆபத்து.', source: Object.freeze({ ...PHALADEEPIKA_SASTRI, pageLocus: 'Adhyaya XXVI, sloka 34, printed p.300 (PDF 335): "... bring about loss of honour and wealth, and danger to life also, if all the conditions exist"' }) },
  { id: 'BINDUS', verse: '41', computed: false, textTa: 'அஷ்டகவர்க்கத்தில் அதிக நன்மைப் புள்ளிகள் உள்ள ராசியில் செல்லும் கிரகம் — அது 12, 6, 8-ஆக இருந்தாலும் — எப்போதும் நல்ல பலன்.', whyNotTa: '"அதிக" என்பது எத்தனை என்று சொல்லப்படவில்லை — கணிக்கவில்லை; சனிக்கு அஷ்டகவர்க்கக் கணக்கு /saturn-transit பக்கத்தில்.', source: Object.freeze({ ...PHALADEEPIKA_SASTRI, pageLocus: 'Adhyaya XXVI, sloka 41, printed p.303 (PDF 338): "Planets passing through Rasis containing more benefic dots in the Ashtakavarga produce good effect always. Even when such Rasis happen to be the 12th, 6th or 8th"' }) },
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

module.exports = {
  HOUSE_RESULTS, VERSE_OF, HOUSE_RESULTS_SOURCES, KETU_NOTE_TA, DECANATE, DECANATE_TA, DECANATE_SOURCES, DECANATE_WORDS, RULES,
  SIGN_LORDS, EXALTATION_SIGN, NATURAL_ENEMIES, COMBUSTION_DEGREES, DIGNITY_SOURCES, DIGNITY_READINGS_TA,
  dignityOf, combustionOrb, verses31and32,
  FULL_ASPECTS, PARTIAL_ASPECTS, MALEFIC_FIXED, BENEFIC_FIXED, ASPECT_SOURCES, ASPECT_READINGS_TA, aspectsOf, verse30Effect,
};
