/**
 * கேள்வி–விடை நியாய இயந்திரம் — the question-judgement engine.
 *
 * Turns a plain question ("இந்த வருடம் வேலை கிடைக்குமா?") into a reasoned
 * standing by running the classical adjudication order:
 *
 *   1. PROMISE  — the strength and affliction of the topic's bhāvas and
 *                 kārakas. BPHS Adhyāya 11 (bhāva-viveka), 32 (kārakas).
 *   2. TIMING   — a daśā lord gives the results of the bhāva it OWNS,
 *                 OCCUPIES or ASPECTS. BPHS 46-47 (daśā-phala); Phaladīpikā 19.
 *   3. GOCHARA  — Candra-gochara with vedha + the slow grahas over the bhāva.
 *                 Phaladīpikā 26.3-8 (via src/report/gocharaPhala.js).
 *
 * It returns NO yes/no. The classical method weighs converging and conflicting
 * testimonies and a chart routinely carries both; every step is returned with
 * its sign, its weight and its source, and the standing states how the
 * testimonies stood rather than pronouncing an outcome.
 *
 * PROMISE-strength note: Kotravel does not total Shadbala (its `shadbalaTotal`
 * is SOURCE_REQUIRED while Ayana Bala's BPHS v.15-17 formula/table conflict is
 * unresolved), so promise here is judged from what IS classically settled —
 * graha dignity (BPHS 3), Sarvāṣṭakavarga bindus in the bhāva (BPHS 66) and
 * benefic/malefic occupancy and dṛṣṭi (BPHS 3, 26) — not from a rūpa total.
 *
 * Bhāva / kāraka mappings below are classical doctrine (BPHS 11, 32;
 * Phaladīpikā 2). No modern compilation is transcribed. Where a signification
 * is contested the divergence is recorded on the topic (`note`), not resolved.
 *
 * Ported from the prior AstrologicLab `answerEngine.ts` / `answerTopics.ts`,
 * rewritten natively against Kotravel's report shapes.
 */
const { EXALTATION, DEBILITATION, OWN_SIGNS, MOOLATRIKONA } = require('../chart/shadbala');
const { computeGocharaPhala } = require('./gocharaPhala');

const CLASSICAL_7 = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const ALL_9 = [...CLASSICAL_7, 'Rahu', 'Ketu'];

const TAMIL_BY_GRAHA = {
  Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்',
  Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது',
};

/** Rāśi lords, 0-indexed rāśi (Aries=0). BPHS 4. */
const RASHI_LORD = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'];
const RASHI_LORD_TAMIL = RASHI_LORD.map((g) => TAMIL_BY_GRAHA[g]);

/** Natural benefics / malefics — BPHS Adhyāya 3. Mercury and the Moon are
 *  conditional and resolved per-chart in `beneficNature`. */
const NATURAL_BENEFIC = new Set(['Jupiter', 'Venus']);
const NATURAL_MALEFIC = new Set(['Sun', 'Mars', 'Saturn', 'Rahu', 'Ketu']);

/** Bhāva significations — BPHS 11.2-11.14; Phaladīpikā 2.1-2.10. */
const BHAVA_MEANING = {
  1: { ta: 'உடல், தன்மை, ஆரோக்கியம்', en: 'body, disposition, health' },
  2: { ta: 'சேர்த்த செல்வம், குடும்பம், வாக்கு', en: 'accumulated wealth, family, speech' },
  3: { ta: 'தைரியம், உடன்பிறந்தோர், சிறு பயணம்', en: 'courage, siblings, short journeys' },
  4: { ta: 'தாய், வீடு, நிலம், வாகனம், ஆரம்பக் கல்வி', en: 'mother, home, land, vehicles, early education' },
  5: { ta: 'குழந்தை, அறிவு, பூர்வ புண்ணியம்', en: 'children, intelligence, past merit' },
  6: { ta: 'நோய், எதிரி, கடன், சேவை', en: 'disease, enemies, debt, service' },
  7: { ta: 'மணவாழ்க்கை, துணை, கூட்டாண்மை', en: 'marriage, spouse, partnership' },
  8: { ta: 'ஆயுள், நீண்ட நோய், மறைபொருள், வாரிசுச் சொத்து', en: 'longevity, chronic illness, the occult, inheritance' },
  9: { ta: 'அதிர்ஷ்டம், தந்தை, தர்மம், உயர்கல்வி, நீண்ட பயணம்', en: 'fortune, father, dharma, higher learning, long journeys' },
  10: { ta: 'தொழில், கர்மம், அந்தஸ்து, அதிகாரம்', en: 'career, action, status, authority' },
  11: { ta: 'இலாபம், வருமானம், விருப்ப நிறைவேற்றம்', en: 'gains, income, fulfilment of desires' },
  12: { ta: 'செலவு, இழப்பு, வெளிநாடு, மோட்சம்', en: 'expenditure, loss, foreign lands, liberation' },
};

/** Natural kāraka roles — BPHS 32 (Kārakādhyāya). */
const KARAKA_ROLE = {
  Sun: { ta: 'ஆத்மா, தந்தை, அதிகாரம், உயிர்ச்சக்தி', en: 'soul, father, authority, vitality' },
  Moon: { ta: 'மனம், தாய், உணர்வு', en: 'mind, mother, feeling' },
  Mars: { ta: 'தைரியம், நிலம், சண்டை, இளைய உடன்பிறப்பு', en: 'courage, land, conflict, younger siblings' },
  Mercury: { ta: 'அறிவு, பேச்சு, கல்வி, வணிகம்', en: 'intellect, speech, learning, commerce' },
  Jupiter: { ta: 'செல்வம், குழந்தை, ஞானம், குரு', en: 'wealth, children, wisdom, the teacher' },
  Venus: { ta: 'மனைவி/கணவன், இன்பம், வாகனம், கலை', en: 'spouse, pleasure, vehicles, art' },
  Saturn: { ta: 'ஆயுள், உழைப்பு, துன்பம், சேவை', en: 'longevity, labour, sorrow, service' },
  Rahu: { ta: 'விருப்பம், வெளிநாடு, திடீர் மாற்றம்', en: 'craving, foreign lands, sudden change' },
  Ketu: { ta: 'விடுதலை, ஆன்மிகம், பிரிவு', en: 'release, spirituality, separation' },
};

const TOPICS = [
  {
    id: 'career', ta: 'தொழில் / வேலை', en: 'Career and work',
    primaryBhavas: [10], supportingBhavas: [6, 11, 2], karakas: ['Saturn', 'Sun', 'Mercury'], denyingBhavas: [12],
    note: {
      ta: 'சனி கர்ம காரகன்; சூரியன் அதிகாரம், புதன் வணிகம். 6-ஆம் இடம் ஊழியம், 11-ஆம் இடம் வருமானம்.',
      en: 'Saturn is karma kāraka; the Sun rules authority and Mercury commerce. The 6th covers employment, the 11th the income from it.',
    },
    match: ['வேலை', 'தொழில்', 'உத்தியோகம்', 'பதவி', 'சம்பளம்', 'பிழைப்பு', 'job', 'career', 'work', 'promotion', 'business', 'employment'],
    source: 'BPHS 11.11 (karma bhāva) · BPHS 32 (Saturn as karma kāraka) · Phaladīpikā 2.9',
  },
  {
    id: 'marriage', ta: 'திருமணம் / மணவாழ்க்கை', en: 'Marriage',
    primaryBhavas: [7], supportingBhavas: [2, 11], karakas: ['Venus', 'Jupiter'], denyingBhavas: [6, 8, 12],
    note: {
      ta: 'சுக்கிரன் களத்திர காரகன். பெண் ஜாதகத்தில் கணவனுக்கு குரு காரகன் — இரு பாரம்பரியமும் பயன்பாட்டில் உள்ளது.',
      en: "Venus is kalatra kāraka. For a woman's husband many traditions take Jupiter; both readings are in use and both are weighed here.",
    },
    match: ['திருமணம்', 'கல்யாணம்', 'மணவாழ்க்கை', 'வரன்', 'மனைவி', 'கணவன்', 'marriage', 'married', 'marry', 'wedding', 'spouse', 'partner', 'wife', 'husband'],
    source: 'BPHS 11.8 · BPHS 32 (Venus as kalatra kāraka) · Phaladīpikā 2.6',
  },
  {
    id: 'children', ta: 'குழந்தை பாக்கியம்', en: 'Children',
    primaryBhavas: [5], supportingBhavas: [2, 9, 11], karakas: ['Jupiter'], denyingBhavas: [6, 8, 12],
    match: ['குழந்தை', 'சந்தானம்', 'புத்திர', 'வாரிசு', 'child', 'children', 'progeny', 'pregnancy', 'conception'],
    source: 'BPHS 11.6 · BPHS 32 (Jupiter as putra kāraka) · Phaladīpikā 2.4',
  },
  {
    id: 'wealth', ta: 'செல்வம் / பணம்', en: 'Wealth and money',
    primaryBhavas: [2, 11], supportingBhavas: [5, 9, 10], karakas: ['Jupiter', 'Venus'], denyingBhavas: [12, 6, 8],
    note: {
      ta: '2-ஆம் இடம் சேர்த்து வைத்த செல்வம்; 11-ஆம் இடம் வரும் இலாபம். இரண்டும் வேறு — கேள்விக்கேற்ப எடை மாறும்.',
      en: 'The 2nd is wealth already held, the 11th is gain arriving. They are different questions and are weighed separately.',
    },
    match: ['பணம்', 'செல்வம்', 'பொருள்', 'இலாபம்', 'லாபம்', 'வருமானம்', 'கடன்', 'money', 'wealth', 'finance', 'income', 'profit', 'loan', 'debt'],
    source: 'BPHS 11.3, 11.12 · BPHS 32 (Jupiter as dhana kāraka) · Phaladīpikā 2.2',
  },
  {
    id: 'health', ta: 'உடல்நலம்', en: 'Health',
    primaryBhavas: [1, 6], supportingBhavas: [8, 12], karakas: ['Sun', 'Moon', 'Saturn'], denyingBhavas: [],
    note: {
      ta: '1-ஆம் இடம் உடல் வலிமை; 6-ஆம் இடம் நோய்; 8-ஆம் இடம் நீடித்த பாதிப்பு. இது மருத்துவ ஆலோசனை அல்ல.',
      en: 'The 1st is bodily strength, the 6th acute illness, the 8th what becomes chronic. This is not medical advice.',
    },
    match: ['உடல்நலம்', 'நோய்', 'ஆரோக்கியம்', 'வியாதி', 'சுகம்', 'health', 'illness', 'disease', 'sickness', 'recovery'],
    source: 'BPHS 11.2, 11.7 · BPHS 32 (Sun as vitality) · Phaladīpikā 2.5',
  },
  {
    id: 'education', ta: 'கல்வி', en: 'Education',
    primaryBhavas: [4, 5], supportingBhavas: [9, 2, 11], karakas: ['Mercury', 'Jupiter'], denyingBhavas: [6, 8, 12],
    note: {
      ta: '4-ஆம் இடம் ஆரம்பக் கல்வி, 5-ஆம் இடம் அறிவுத்திறன், 9-ஆம் இடம் உயர்கல்வி.',
      en: 'The 4th is schooling, the 5th native intelligence, the 9th higher and religious learning.',
    },
    match: ['கல்வி', 'படிப்பு', 'தேர்வு', 'பரீட்சை', 'பள்ளி', 'கல்லூரி', 'education', 'study', 'exam', 'school', 'college', 'degree'],
    source: 'BPHS 11.5, 11.6, 11.10 · BPHS 32 (Mercury as vidyā kāraka) · Phaladīpikā 2.3',
  },
  {
    id: 'property', ta: 'வீடு / நிலம் / வாகனம்', en: 'Property and vehicles',
    primaryBhavas: [4], supportingBhavas: [2, 11, 12], karakas: ['Mars', 'Venus'], denyingBhavas: [6, 8],
    note: {
      ta: 'செவ்வாய் பூமி காரகன்; சுக்கிரன் வாகன காரகன். 12-ஆம் இடம் இங்கே செலவாகவும் வரும்.',
      en: 'Mars is bhūmi kāraka and Venus vāhana kāraka. The 12th enters here as the expenditure a purchase requires.',
    },
    match: ['வீடு', 'நிலம்', 'மனை', 'சொத்து', 'வாகனம்', 'கார்', 'house', 'property', 'land', 'vehicle', 'car', 'home'],
    source: 'BPHS 11.5 · BPHS 32 (Mars as bhūmi kāraka, Venus as vāhana kāraka) · Phaladīpikā 2.3',
  },
  {
    id: 'travel', ta: 'பயணம் / வெளிநாடு', en: 'Travel and going abroad',
    primaryBhavas: [12, 9], supportingBhavas: [3, 7], karakas: ['Rahu', 'Moon'], denyingBhavas: [4],
    note: {
      ta: '3-ஆம் இடம் சிறு பயணம், 9-ஆம் இடம் நீண்ட பயணம், 12-ஆம் இடம் வெளிநாட்டு வாசம். 4-ஆம் இடம் வலுவானால் சொந்த ஊரிலேயே நிலைக்க வைக்கும்.',
      en: 'The 3rd is short journeys, the 9th long ones, the 12th residence abroad. A strong 4th holds the native at home instead.',
    },
    match: ['பயணம்', 'வெளிநாடு', 'வெளிநாட்டு', 'விசா', 'குடியேற்றம்', 'travel', 'abroad', 'foreign', 'visa', 'migration', 'overseas'],
    source: 'BPHS 11.4, 11.10, 11.13 · Phaladīpikā 2.10',
  },
  {
    id: 'litigation', ta: 'வழக்கு / பகை', en: 'Litigation and disputes',
    primaryBhavas: [6], supportingBhavas: [8, 12, 7], karakas: ['Mars', 'Saturn'], denyingBhavas: [],
    note: {
      ta: '6-ஆம் இடம் வலுவானால் வழக்கில் வெற்றி; 7-ஆம் இடம் எதிராளியைக் குறிக்கும்.',
      en: 'A strong 6th favours the native in a dispute; the 7th stands for the opponent.',
    },
    match: ['வழக்கு', 'கோர்ட்', 'நீதிமன்றம்', 'பகை', 'எதிரி', 'தகராறு', 'litigation', 'court', 'lawsuit', 'dispute', 'enemy', 'legal'],
    source: 'BPHS 11.7 · Phaladīpikā 2.5',
  },
  {
    id: 'longevity', ta: 'ஆயுள்', en: 'Longevity',
    primaryBhavas: [8, 1], supportingBhavas: [3, 10], karakas: ['Saturn'], denyingBhavas: [],
    note: {
      ta: 'ஆயுள் கணிப்பு பாரம்பரியத்தில் மிக நுட்பமானது; இங்கே பாவ-கிரக பலம் மட்டுமே காட்டப்படுகிறது, ஆயுள் அளவு அல்ல.',
      en: 'Longevity judgement is the most guarded reading in the tradition. Only the strength of the relevant bhāvas and kāraka is shown — no span is estimated.',
    },
    match: ['ஆயுள்', 'ஆயுட்காலம்', 'நீண்ட ஆயுள்', 'longevity', 'lifespan', 'age'],
    source: 'BPHS 11.9 · BPHS 32 (Saturn as āyuṣ kāraka) · Phaladīpikā 2.7',
  },
  {
    id: 'spirituality', ta: 'ஆன்மிகம்', en: 'Spiritual life',
    primaryBhavas: [9, 12], supportingBhavas: [5, 8], karakas: ['Jupiter', 'Ketu'], denyingBhavas: [],
    match: ['ஆன்மிகம்', 'தெய்வம்', 'பக்தி', 'மோட்சம்', 'குரு', 'spiritual', 'moksha', 'devotion', 'religion', 'guru'],
    source: 'BPHS 11.10, 11.13 · BPHS 32 (Ketu as mokṣa kāraka) · Phaladīpikā 2.10',
  },
  {
    id: 'family', ta: 'குடும்பம் / பெற்றோர்', en: 'Family and parents',
    primaryBhavas: [2, 4, 9], supportingBhavas: [3, 11], karakas: ['Moon', 'Sun', 'Jupiter'], denyingBhavas: [6, 8, 12],
    note: {
      ta: '4-ஆம் இடம் தாய், 9-ஆம் இடம் தந்தை; சந்திரன் மாத்ரு காரகன், சூரியன் பித்ரு காரகன்.',
      en: 'The 4th is the mother and the 9th the father; the Moon is mātṛ kāraka and the Sun pitṛ kāraka.',
    },
    match: ['குடும்பம்', 'தாய்', 'தந்தை', 'அம்மா', 'அப்பா', 'பெற்றோர்', 'சகோதரர்', 'family', 'mother', 'father', 'parents', 'sibling', 'brother', 'sister'],
    source: 'BPHS 11.5, 11.10 · BPHS 32 (Moon as mātṛ, Sun as pitṛ kāraka) · Phaladīpikā 2.3',
  },
];

const TOPIC_BY_ID = Object.fromEntries(TOPICS.map((t) => [t.id, t]));

/** Every house a topic touches, primary first, without duplicates. */
function topicBhavas(t) {
  return [...new Set([...t.primaryBhavas, ...t.supportingBhavas])];
}

/**
 * Route a free-text question to topics. Conservative: returns EVERY topic whose
 * keywords appear, ranked by matched-keyword length, rather than guessing one.
 * Returns [] when nothing matches — the caller asks rather than inventing.
 */
function classifyQuestion(text) {
  const q = String(text || '').toLowerCase();
  if (!q.trim()) return [];
  const scored = TOPICS.map((t) => {
    let score = 0;
    for (const kw of t.match) {
      if (q.includes(kw.toLowerCase())) score += kw.length;
    }
    return { t, score };
  }).filter((x) => x.score > 0);
  scored.sort((a, b) => b.score - a.score);
  return scored.map((x) => x.t);
}

// ── chart primitives ──────────────────────────────────────────────────────
const norm360 = (d) => ((d % 360) + 360) % 360;
const sign0 = (lon) => Math.floor(norm360(lon) / 30) % 12;

/** Parāśari graha dṛṣṭi as a set of aspected rāśi indices. BPHS 26. */
const SPECIAL_ASPECT_OFFSETS = { Mars: [3, 7], Jupiter: [4, 8], Saturn: [2, 9] };
function aspectsRasi(graha, rasi0) {
  return new Set([6, ...(SPECIAL_ASPECT_OFFSETS[graha] || [])].map((o) => (rasi0 + o) % 12));
}

/** Dignity of a graha in its sign. BPHS 3. Rahu/Ketu have none here → 'neutral'. */
function classifyDignity(graha, rasi0, degInSign) {
  const ex = EXALTATION[graha];
  const de = DEBILITATION[graha];
  const mt = MOOLATRIKONA[graha];
  if (ex && rasi0 === ex.sign) return 'exalted';
  if (de && rasi0 === de.sign) return 'debilitated';
  if (mt && rasi0 === mt.sign && degInSign >= mt.from && degInSign <= mt.to) return 'moolatrikona';
  if ((OWN_SIGNS[graha] || []).includes(rasi0)) return 'own-sign';
  return 'neutral';
}

function chartView(rd) {
  const lagna0 = rd.chart.lagna.rasiIndex;
  const rasi0 = {};
  const degIn = {};
  for (const g of ALL_9) {
    const e = rd.chart.grahas[g];
    if (!e) continue;
    rasi0[g] = e.rasiIndex;
    degIn[g] = e.degreeInSign;
  }
  return {
    lagna0,
    rasi0,
    degIn,
    sav: (rd.ashtakavarga && rd.ashtakavarga.sarva) || [],
    moonRasi0: rasi0.Moon ?? 0,
  };
}

const bhavaRasi0 = (v, bhava) => (v.lagna0 + bhava - 1) % 12;
const bhavaOf = (v, g) => (v.rasi0[g] === undefined ? 0 : (((v.rasi0[g] - v.lagna0) % 12) + 12) % 12 + 1);

/** Benefic (1) or malefic (-1) for THIS chart. BPHS 3.11-3.13. */
function beneficNature(v, g) {
  if (NATURAL_BENEFIC.has(g)) return 1;
  if (g === 'Mercury') {
    const withMalefic = [...NATURAL_MALEFIC].some((m) => v.rasi0[m] === v.rasi0.Mercury);
    return withMalefic ? -1 : 1;
  }
  if (g === 'Moon') {
    const sun = v.rasi0.Sun, moon = v.rasi0.Moon;
    if (sun === undefined || moon === undefined) return 1;
    const houses = (((moon - sun) % 12) + 12) % 12;
    return houses >= 3 && houses <= 9 ? 1 : -1;   // waxing
  }
  return -1;
}

const T = (ta, en) => ({ ta, en });

/** Assess one bhāva: its lord's dignity, its occupants, its aspects, its bindus. */
function judgeBhava(v, bhava, primary) {
  const steps = [];
  const r0 = bhavaRasi0(v, bhava);
  const lord = RASHI_LORD[r0];
  const lordTamil = TAMIL_BY_GRAHA[lord];
  const scale = primary ? 1 : 0.5;
  const meaning = BHAVA_MEANING[bhava];

  if (primary && meaning) {
    steps.push({
      stage: 'promise',
      ...T(`${bhava}-ஆம் இடம் — ${meaning.ta}.`, `The ${bhava}th house — ${meaning.en}.`),
      weight: 0, source: 'BPHS 11 · Phaladīpikā 2',
    });
  }

  // the bhāva lord's dignity
  if (lord && v.rasi0[lord] !== undefined) {
    const dig = classifyDignity(lord, v.rasi0[lord], v.degIn[lord] ?? 0);
    const digWeight = { exalted: 15, moolatrikona: 12, 'own-sign': 10, debilitated: -15, neutral: 0 };
    const dw = (digWeight[dig] ?? 0) * scale;
    if (dw !== 0) {
      const label = {
        exalted: T('உச்சம்', 'exalted'), moolatrikona: T('மூலத்திரிகோணம்', 'moolatrikona'),
        'own-sign': T('சொந்த வீடு', 'own sign'), debilitated: T('நீசம்', 'debilitated'),
      }[dig];
      steps.push({
        stage: 'promise',
        ...T(`${bhava}-ஆம் இடத்தின் அதிபதி ${lordTamil} ${label.ta} நிலையில் உள்ளார்.`,
          `The ${bhava}th lord ${lordTamil} is ${label.en}.`),
        weight: dw, source: 'BPHS 3 (dignity)',
      });
    }
    // the lord standing in a dusthāna weakens the promise
    const lb = bhavaOf(v, lord);
    if ([6, 8, 12].includes(lb)) {
      steps.push({
        stage: 'promise',
        ...T(`${bhava}-ஆம் இடத்தின் அதிபதி ${lordTamil} ${lb}-ஆம் துஸ்தானத்தில் உள்ளார்.`,
          `The ${bhava}th lord ${lordTamil} falls in the ${lb}th, a dusthāna.`),
        weight: -6 * scale, source: 'BPHS 11 (duḥsthāna)',
      });
    }
  }

  // occupants
  const occupants = ALL_9.filter((g) => v.rasi0[g] === r0);
  for (const occ of occupants) {
    const nature = beneficNature(v, occ);
    steps.push({
      stage: 'promise',
      ...T(`${TAMIL_BY_GRAHA[occ]} ${bhava}-ஆம் இடத்தில் அமர்ந்துள்ளார் — ${nature > 0 ? 'சுபம்' : 'பாபம்'}.`,
        `${TAMIL_BY_GRAHA[occ]} occupies the ${bhava}th — ${nature > 0 ? 'a benefic' : 'a malefic'}.`),
      weight: nature * 8 * scale, source: 'BPHS 3 (benefic/malefic) · BPHS 11',
    });
  }

  // aspects onto the bhāva
  for (const g of ALL_9) {
    if (v.rasi0[g] === undefined || v.rasi0[g] === r0) continue;
    if (!aspectsRasi(g, v.rasi0[g]).has(r0)) continue;
    const nature = beneficNature(v, g);
    steps.push({
      stage: 'promise',
      ...T(`${TAMIL_BY_GRAHA[g]} ${bhava}-ஆம் இடத்தைப் பார்க்கிறார் — ${nature > 0 ? 'சுப பார்வை' : 'பாப பார்வை'}.`,
        `${TAMIL_BY_GRAHA[g]} aspects the ${bhava}th — ${nature > 0 ? 'a benefic aspect' : 'a malefic aspect'}.`),
      weight: nature * 5 * scale, source: 'BPHS 26 (dṛṣṭi)',
    });
  }

  // Sarvāṣṭakavarga bindus in the bhāva (mean 28 across the twelve rāśis)
  const bindus = v.sav[r0];
  if (typeof bindus === 'number') {
    const w = bindus >= 30 ? 8 : bindus >= 25 ? 2 : -8;
    steps.push({
      stage: 'promise',
      ...T(`${bhava}-ஆம் இடத்தில் சர்வாஷ்டகவர்க்க புள்ளி ${bindus} (சராசரி 28).`,
        `The ${bhava}th holds ${bindus} Sarvāṣṭakavarga bindus (mean 28).`),
      weight: w * scale, source: 'Ashtakavarga · BPHS 66',
    });
  }
  return steps;
}

/** Assess a kāraka's own condition. BPHS 32. */
function judgeKaraka(v, g) {
  const steps = [];
  const tamil = TAMIL_BY_GRAHA[g];
  const role = KARAKA_ROLE[g];
  if (v.rasi0[g] === undefined) return steps;

  const dig = classifyDignity(g, v.rasi0[g], v.degIn[g] ?? 0);
  if (dig === 'exalted' || dig === 'own-sign' || dig === 'moolatrikona') {
    steps.push({
      stage: 'promise',
      ...T(`காரகன் ${tamil} (${role.ta}) வலுவான ராசியில் உள்ளார்.`, `The kāraka ${tamil} (${role.en}) holds a dignified sign.`),
      weight: 10, source: 'BPHS 32 (kārakas) · BPHS 3 (dignity)',
    });
  } else if (dig === 'debilitated') {
    steps.push({
      stage: 'promise',
      ...T(`காரகன் ${tamil} (${role.ta}) நீச ராசியில் உள்ளார்.`, `The kāraka ${tamil} (${role.en}) is debilitated.`),
      weight: -12, source: 'BPHS 32 · BPHS 3 (dignity)',
    });
  }

  const nature = beneficNature(v, g);
  const b = bhavaOf(v, g);
  if ([1, 4, 5, 7, 9, 10, 11].includes(b)) {
    steps.push({
      stage: 'promise',
      ...T(`காரகன் ${tamil} ${b}-ஆம் நல்ல இடத்தில் உள்ளார்.`, `The kāraka ${tamil} stands in the ${b}th, a supportive house.`),
      weight: (nature > 0 ? 6 : 3), source: 'BPHS 11 (kendra/trikoṇa)',
    });
  } else if ([6, 8, 12].includes(b)) {
    steps.push({
      stage: 'promise',
      ...T(`காரகன் ${tamil} ${b}-ஆம் துஸ்தானத்தில் உள்ளார்.`, `The kāraka ${tamil} falls in the ${b}th, a dusthāna.`),
      weight: -8, source: 'BPHS 11 (duḥsthāna)',
    });
  }
  return steps;
}

/**
 * Timing. A daśā lord gives the results of the bhāva it owns, occupies or
 * aspects (BPHS 46-47). Each running level is tested against the topic's houses
 * and kārakas, weighted by level (mahādaśā sets the tone, finer levels colour).
 */
function judgeDasha(v, topic, chain) {
  const steps = [];
  const levelWeight = [16, 12, 8, 4, 2];
  const primary = new Set(topic.primaryBhavas);

  chain.forEach((period, i) => {
    const g = period.lord;
    if (!g || v.rasi0[g] === undefined) return;
    const w = levelWeight[i] ?? 1;
    const links = [];

    for (const bhava of topicBhavas(topic)) {
      const r0 = bhavaRasi0(v, bhava);
      const mult = primary.has(bhava) ? 1 : 0.5;
      if (RASHI_LORD[r0] === g) links.push({ ta: `${bhava}-ஆம் இடத்துக்கு அதிபதி`, en: `owns the ${bhava}th`, mult: mult * 1.0 });
      if (v.rasi0[g] === r0) links.push({ ta: `${bhava}-ஆம் இடத்தில் அமர்ந்துள்ளார்`, en: `occupies the ${bhava}th`, mult: mult * 0.8 });
      else if (aspectsRasi(g, v.rasi0[g]).has(r0)) links.push({ ta: `${bhava}-ஆம் இடத்தைப் பார்க்கிறார்`, en: `aspects the ${bhava}th`, mult: mult * 0.6 });
    }
    if (topic.karakas.includes(g)) links.push({ ta: 'இந்த விஷயத்தின் காரகன்', en: 'is the kāraka for this matter', mult: 0.9 });

    const levelTa = period.level || `நிலை ${i + 1}`;
    if (!links.length) {
      steps.push({
        stage: 'timing',
        ...T(`${levelTa} அதிபதி ${TAMIL_BY_GRAHA[g]} — இந்த விஷயத்தோடு நேரடித் தொடர்பு இல்லை.`,
          `The ${levelTa} lord ${TAMIL_BY_GRAHA[g]} has no direct link to this matter.`),
        weight: 0, source: 'BPHS 46-47 (daśā-phala)',
      });
      return;
    }
    const best = links.reduce((a, b) => (b.mult > a.mult ? b : a));
    const nature = beneficNature(v, g);
    steps.push({
      stage: 'timing',
      ...T(`${levelTa} அதிபதி ${TAMIL_BY_GRAHA[g]} ${links.map((l) => l.ta).join(', ')} — ${nature > 0 ? 'சாதகம்' : 'கவனம் தேவை'}.`,
        `The ${levelTa} lord ${TAMIL_BY_GRAHA[g]} ${links.map((l) => l.en).join(', ')} — ${nature > 0 ? 'favourable' : 'needs care'}.`),
      weight: Math.round(w * best.mult * nature), source: 'BPHS 46-47 (daśā-phala) · Phaladīpikā 19',
    });
  });
  return steps;
}

/** Gochara: Candra-gochara with vedha + the slow grahas over the bhāva. */
function judgeGochara(v, topic, transitRasis, rows) {
  const steps = [];
  const byGraha = new Map(rows.map((r) => [r.graha, r]));

  for (const g of ['Jupiter', 'Saturn']) {
    const row = byGraha.get(g);
    if (!row) continue;
    const tamil = TAMIL_BY_GRAHA[g];
    const houseFromMoon = row.houseFromMoon ?? row.house ?? '?';
    if (row.verdict === 'benefic') {
      steps.push({
        stage: 'gochara',
        ...T(`${tamil} சந்திரனிலிருந்து ${houseFromMoon}-ஆம் இடத்தில் சஞ்சரிக்கிறார் — தடையின்றி சுபம்.`,
          `${tamil} transits the ${houseFromMoon}th from the Moon — benefic and unobstructed.`),
        weight: g === 'Jupiter' ? 12 : 8, source: 'Phaladīpikā 26.3-8 (gochara + vedha)',
      });
    } else if (row.verdict === 'vedha') {
      const byList = Array.isArray(row.obstructedBy) ? row.obstructedBy : (row.obstructedBy ? [row.obstructedBy] : []);
      const by = byList.map((n) => TAMIL_BY_GRAHA[n] || n).join(', ');
      steps.push({
        stage: 'gochara',
        ...T(`${tamil} ${houseFromMoon}-ஆம் இடத்தில் சுபமாக இருந்தாலும் ${by} வேதையால் தடுக்கப்படுகிறது.`,
          `${tamil} would be benefic in the ${houseFromMoon}th but is obstructed by ${by}.`),
        weight: 0, source: 'Phaladīpikā 26.3-8 (vedha)',
      });
    } else {
      steps.push({
        stage: 'gochara',
        ...T(`${tamil} சந்திரனிலிருந்து ${houseFromMoon}-ஆம் இடத்தில் — சுப இடம் அல்ல.`,
          `${tamil} transits the ${houseFromMoon}th from the Moon — not a benefic house for it.`),
        weight: g === 'Jupiter' ? -6 : -4, source: 'Phaladīpikā 26.3-8',
      });
    }
  }

  for (const bhava of topic.primaryBhavas) {
    const r0 = bhavaRasi0(v, bhava);
    for (const g of ['Jupiter', 'Saturn']) {
      if (transitRasis[g] !== r0) continue;
      steps.push({
        stage: 'gochara',
        ...T(`${TAMIL_BY_GRAHA[g]} தற்போது ${bhava}-ஆம் இடத்தின் மேலேயே சஞ்சரிக்கிறார்.`,
          `${TAMIL_BY_GRAHA[g]} is transiting the ${bhava}th itself.`),
        weight: g === 'Jupiter' ? 10 : -8, source: 'BPHS 11 · gochara over the bhāva',
      });
    }
  }
  return steps;
}

function standingOf(score) {
  if (score >= 45) return 'strongly-supported';
  if (score >= 15) return 'supported';
  if (score > -15) return 'mixed';
  if (score > -45) return 'obstructed';
  return 'strongly-obstructed';
}
const STANDING_TA = {
  'strongly-supported': 'மிகவும் சாதகம்', supported: 'சாதகம்', mixed: 'கலப்பான சாட்சியம்',
  obstructed: 'தடைகள் மிகுந்துள்ளன', 'strongly-obstructed': 'மிகுந்த தடை',
};

/** JD (UT) from epoch ms. */
const jdFromMs = (ms) => 2440587.5 + ms / 86400000;

/**
 * Running daśā chain at an instant. Walks rd.dasha's nested levels
 * (levelNames) and returns [{ level, lord }] deepest-first-available.
 */
function runningChain(dasha, nowMs) {
  const jd = jdFromMs(nowMs);
  const levelNames = dasha.levelNames || ['Dasha', 'Bhukti'];
  const out = [];
  let periods = dasha.dashas || [];
  for (let depth = 0; depth < levelNames.length; depth++) {
    const hit = periods.find((p) => jd >= p.startJulianDay && jd < p.endJulianDay);
    if (!hit) break;
    out.push({ level: levelNames[depth], lord: hit.lord });
    periods = hit[levelNames[depth + 1]] || [];
    if (!periods.length) break;
  }
  return out;
}

/**
 * Read one topic against a report at a moment in time.
 * @param rd            output of buildReportData
 * @param topic         a TOPICS entry
 * @param opts.nowMs    instant for timing + gochara (default: now)
 * @param opts.transitRasis  { graha: rasi0 } to run gochara; omit to skip it
 */
function readTopic(rd, topic, opts = {}) {
  const v = chartView(rd);
  const nowMs = opts.nowMs ?? Date.now();
  const steps = [];

  for (const b of topic.primaryBhavas) steps.push(...judgeBhava(v, b, true));
  for (const b of topic.supportingBhavas) steps.push(...judgeBhava(v, b, false));
  for (const k of topic.karakas) steps.push(...judgeKaraka(v, k));

  const chain = runningChain(rd.dasha, nowMs);
  steps.push(...judgeDasha(v, topic, chain));

  let usedGochara = false;
  if (opts.transitRasis) {
    const entries = Object.keys(opts.transitRasis)
      .filter((g) => typeof opts.transitRasis[g] === 'number')
      .map((g) => ({ key: g, rasi0: opts.transitRasis[g] }));
    const rows = computeGocharaPhala(v.moonRasi0, Object.fromEntries(entries.map((e) => [e.key, e.rasi0])));
    steps.push(...judgeGochara(v, topic, opts.transitRasis, rows));
    usedGochara = true;
  }

  const score = Math.round(steps.reduce((a, s) => a + s.weight, 0));
  const standing = standingOf(score);

  return {
    topicId: topic.id, ta: topic.ta, en: topic.en,
    score, standing, standingTa: STANDING_TA[standing],
    runningDasha: chain, usedGochara,
    steps,
    significators: {
      bhavas: topicBhavas(topic).map((b) => {
        const r0 = bhavaRasi0(v, b);
        return { bhava: b, rasi0: r0, lord: RASHI_LORD[r0], lordTa: RASHI_LORD_TAMIL[r0], ...BHAVA_MEANING[b] };
      }),
      karakas: topic.karakas.map((g) => ({ graha: g, tamil: TAMIL_BY_GRAHA[g], ...KARAKA_ROLE[g] })),
    },
    note: topic.note || null,
    source: topic.source,
  };
}

/**
 * Answer a free-text question. Routes to every matching topic and reads each.
 * @returns { matched:boolean, question, topics:[readings] }  — matched:false and
 *          topics:[] when the question routed to nothing (caller should ask).
 */
function answerQuestion(rd, text, opts = {}) {
  const topics = classifyQuestion(text);
  if (!topics.length) return { matched: false, question: String(text || ''), topics: [] };
  return {
    matched: true,
    question: String(text || ''),
    topics: topics.map((t) => readTopic(rd, t, opts)),
  };
}

module.exports = {
  TOPICS, TOPIC_BY_ID, BHAVA_MEANING, KARAKA_ROLE,
  classifyQuestion, topicBhavas, readTopic, answerQuestion,
  // primitives (tested)
  aspectsRasi, classifyDignity, beneficNature, standingOf, runningChain,
};
