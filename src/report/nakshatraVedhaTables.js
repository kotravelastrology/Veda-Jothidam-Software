/**
 * Nakshatra vedha — sixteen positions counted from the planets' natal stars.
 *
 * Rasi vedha (`gocharaVedhaTables.js`) counts houses from the natal Moon.
 * Nakshatra vedha counts *stars*, and from each planet's own natal star: when
 * a named planet transits the Nth star from (say) the Sun's natal star, the
 * transit's good effects are held back. Two books print the table, the same in
 * every cell:
 *
 *  - Pulippani, *Gochar Phaladeepika*, ch.23 (printed pp.207-208), 238 words;
 *  - R. Santhanam, *Jyotisharnava Navanitam*, ch.3 commentary (printed
 *    pp.149-150), 235 words — nearly the same sentences.
 *
 * Pulippani comes first by three words; the counts are practically equal and
 * the page says so. Where the two differ is in what follows, not in the
 * table, and both readings are shown.
 *
 * Counting is inclusive (the natal star is the 1st): both books' example puts
 * the Sun in Aswini at birth and calls Aslesha the 9th and Swati the 15th.
 */

const { SOURCES: { PULIPPANI } } = require('./saturnTransitTables');

const SANTHANAM_JN = Object.freeze({
  title: 'Jyotisharnava Navanitam',
  author: 'R. Santhanam (translation and commentary)',
  file: 'jyotisharnava-navanitam-santhanam/raw-scans/full-scan.pdf',
  tradition: 'Classical Sanskrit text with a modern English translation and commentary',
});

const deepFreeze = (o) => {
  Object.values(o).forEach((v) => { if (v && typeof v === 'object') deepFreeze(v); });
  return Object.freeze(o);
};

/** Natal planet, Nth star from its natal star, and the transiting planet(s) that cause the vedha. */
const NAKSHATRA_VEDHA = deepFreeze([
  { id: 'SUN_9', natal: 'Sun', count: 9, by: ['Rahu', 'Ketu'] },
  { id: 'SUN_15', natal: 'Sun', count: 15, by: ['Ketu'] },
  { id: 'MOON_7', natal: 'Moon', count: 7, by: ['Mars'] },
  { id: 'MOON_12', natal: 'Moon', count: 12, by: ['Sun'] },
  { id: 'MARS_4', natal: 'Mars', count: 4, by: ['Mercury'] },
  { id: 'MARS_12', natal: 'Mars', count: 12, by: ['Moon'] },
  { id: 'MERCURY_5', natal: 'Mercury', count: 5, by: ['Jupiter'] },
  { id: 'MERCURY_17', natal: 'Mercury', count: 17, by: ['Saturn'] },
  { id: 'JUPITER_6', natal: 'Jupiter', count: 6, by: ['Venus'] },
  { id: 'JUPITER_12', natal: 'Jupiter', count: 12, by: ['Rahu'] },
  { id: 'VENUS_8', natal: 'Venus', count: 8, by: ['Saturn'] },
  { id: 'VENUS_18', natal: 'Venus', count: 18, by: ['Mercury'] },
  { id: 'SATURN_9', natal: 'Saturn', count: 9, by: ['Sun'] },
  { id: 'SATURN_12', natal: 'Saturn', count: 12, by: ['Jupiter'] },
  { id: 'NODES_9', natal: 'Rahu/Ketu', count: 9, by: ['Moon'] },
  { id: 'NODES_13', natal: 'Rahu/Ketu', count: 13, by: ['Mars'] },
]);

const SOURCES = Object.freeze({
  pulippaniTable: Object.freeze({ ...PULIPPANI, pageLocus: 'Chapter 23 "Nakshathra Vedha", printed p.207 (PDF 200), Table 14: "Natal Nakshatra / Transit in Occupied by / Vedha causing transit by"' }),
  pulippaniExample: Object.freeze({ ...PULIPPANI, pageLocus: 'Chapter 23, printed p.208 (PDF 201): "suppose the Sun is in Aswini Nakshatra in the birth horoscope. The 9th Nakshatra therefrom is Aslesha. When Rahu or Ketu moves in Aslesha Nakshatra most of the good effects indicated by other planetary transit will be suspended and only malefic effects will come to pass"' }),
  santhanamTable: Object.freeze({ ...SANTHANAM_JN, pageLocus: 'Chapter 3 commentary, printed pp.149-150 (PDF 156-157): "The third kind of the Vedhas is Nakshatra Vedha ... These are 16 in all (two each for the 7 planets and 2 jointly for the nodes)"' }),
  santhanamExample: Object.freeze({ ...SANTHANAM_JN, pageLocus: 'Chapter 3 commentary, printed p.150 (PDF 157): "When Ketu, as per the above table, comes to move in Svathi Nakshatra, all good effects of the Sun will vanish and adversities will be on the dawn"' }),
});

const NAKSHATRA_VEDHA_RANK = deepFreeze({
  order: ['PULIPPANI', 'SANTHANAM'],
  words: { PULIPPANI: 238, SANTHANAM: 235 },
  measureTa: 'நட்சத்திர வேதைப் பகுதியின் சொற்கள்: புலிப்பாணி அத்தியாயம் 23 (பக்.207-208) 238; சந்தானம், ஜோதிஷார்ணவ நவநீதம் அத்.3 உரை (பக்.149-150) 235. கிட்டத்தட்ட சமம் — மூன்று சொற்கள் வித்தியாசம்; அட்டவணை இரண்டிலும் ஒன்றே.',
});

/** What each book says follows, in Tamil, in book order. */
const READINGS = deepFreeze([
  {
    book: 'PULIPPANI',
    bookTa: 'புலிப்பாணி (கோசார பலதீபிகை, அத். 23)',
    items: [
      { id: 'INTRO', textTa: 'நட்சத்திரங்களில் கிரகங்கள் செல்லும் கோசாரத்தின் நல்ல அல்லது தீய பலன்கள், கணக்கில் எடுக்கும் கிரகம் (பிறப்பில்) நின்ற நட்சத்திரத்திலிருந்து எண்ணிய குறிப்பிட்ட நட்சத்திரங்களில் கிரகங்கள் இருக்கும்போது சமன்படுகின்றன (neutralised).', source: SOURCES.pulippaniTable },
      { id: 'EXAMPLE_9', textTa: 'பிறப்பில் சூரியன் அசுவினியில் இருந்தால் அதிலிருந்து 9-வது ஆயில்யம்; ராகுவோ கேதுவோ ஆயில்யத்தில் செல்லும்போது மற்ற கிரகங்களின் கோசாரம் காட்டும் நல்ல பலன்களில் பெரும்பாலானவை நிறுத்தப்பட்டு தீய பலன்கள் மட்டுமே நடக்கும்.', source: SOURCES.pulippaniExample },
      { id: 'EXAMPLE_15', textTa: '15-வது சுவாதியில் கேது செல்லும்போதும் அதே போன்ற பலன். மற்ற நட்சத்திர வேதைகளையும் இப்படியே எந்தக் கோசாரத்தைக் கணிக்கும்போதும் புறக்கணிக்கக் கூடாது; திசைப் பலன்கள் (directional influences) மிகச் சாதகமாக இருந்தால் வேறு விஷயம்.', source: SOURCES.pulippaniExample },
    ],
  },
  {
    book: 'SANTHANAM',
    bookTa: 'சந்தானம் (ஜோதிஷார்ணவ நவநீதம், அத். 3 உரை)',
    items: [
      { id: 'INTRO', textTa: 'மூன்றாம் வகை வேதை நட்சத்திர வேதை: ஒரு கிரகத்தின் பிறப்பு நட்சத்திரத்திலிருந்து எண்ணிய குறிப்பிட்ட நட்சத்திரத்தில் குறிப்பிட்ட கிரகம் கோசாரத்தில் செல்வதால் ஏற்படுவது. மொத்தம் 16.', source: SOURCES.santhanamTable },
      { id: 'EXAMPLE_9', textTa: '9-வது நட்சத்திரம் (ராகு/கேது): புலிப்பாணியின் வாக்கியமே — மற்ற கோசாரங்களின் நல்ல பலன்களில் பெரும்பாலானவை நிறுத்தப்படும், தீய பலன்கள் மட்டும்.', source: SOURCES.santhanamExample },
      { id: 'EXAMPLE_15', textTa: '15-வது சுவாதியில் கேது ("கேது மட்டும்"): சூரியனின் நல்ல பலன்கள் எல்லாம் மறைந்து, இடர்கள் தொடங்கும். திசைப் பலன்கள் மிக வலுவாகச் சாதகமாக இருந்தால் வேறு விஷயம்.', source: SOURCES.santhanamExample },
    ],
  },
]);

/** Where the two books read the same table differently, and choices this software makes. */
const NOTES = deepFreeze({
  readingsDifferTa: 'அட்டவணை இரண்டிலும் ஒன்றே; விளைவு பற்றிய வாசகம் மாறுகிறது. புலிப்பாணியின் முன்னுரை: அந்தக் கிரகத்தின் கோசாரப் பலன் (நல்லதோ தீயதோ) சமன்படும். அவரது உதாரணம்: மற்ற கிரகங்களின் நல்ல பலன் நிறுத்தப்படும். சந்தானம், 15-வது நட்சத்திரத்துக்கு: சூரியனின் நல்ல பலன் மறையும். இந்தப் பக்கம் காலங்களை மட்டும் கணிக்கிறது; எந்த வாசகம் என்பதைத் தீர்மானிக்கவில்லை.',
  nodesNatalTa: '"ராகு/கேது" பிறப்பு நட்சத்திரம்: ராகுவும் கேதுவும் 180° இடைவெளியில் இருப்பதால் அவற்றின் நட்சத்திரங்கள் 13 அல்லது 14 நட்சத்திரம் தள்ளியிருக்கும்; நூல்கள் எதிலிருந்து எண்ண வேண்டும் என்று சொல்லவில்லை. இரண்டிலிருந்தும் எண்ணிக் காட்டுகிறோம் (எங்கள் வாசிப்பு).',
  nodesByTa: 'சூரியனின் 9-வது நட்சத்திரத்துக்கு "ராகு/கேது" — எந்தக் கணு அங்கே சென்றாலும் கணக்கில் வருகிறது (இரு நூல்களின் உதாரணமும் "Rahu or Ketu" என்கிறது).',
  directionalTa: '"Directional influences" — ஆங்கில ஜோதிட நூல்களில் இது பெரும்பாலும் தசை (directions) என்பதைக் குறிக்கும்; இந்தப் பக்கம் அதைக் கணிக்கவில்லை.',
  moonTa: 'சந்திரன் ஒவ்வொரு நட்சத்திரத்திலும் மாதத்துக்கு ஒருமுறை சுமார் ஒரு நாள் இருக்கும் — அதனால் சந்திரனால் ஏற்படும் வேதைகள் அடுத்த 13 மாதங்களுக்கு மட்டும் பட்டியலிடப்படுகின்றன.',
  countingTa: 'எண்ணும் முறை: பிறப்பு நட்சத்திரமே முதலாவது (அசுவினியிலிருந்து 9-வது ஆயில்யம், 15-வது சுவாதி — இரு நூல்களின் உதாரணம்). 27 நட்சத்திரங்கள்; அபிஜித் இல்லை.',
});

module.exports = { NAKSHATRA_VEDHA, SOURCES, NAKSHATRA_VEDHA_RANK, READINGS, NOTES, SANTHANAM_JN };
