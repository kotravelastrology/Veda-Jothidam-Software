/**
 * தமிழ் திருமணப் பொருத்தம் — the 10 Dasakoot poruthams (South-Indian
 * marriage matching), ported verbatim from the prior AstrologicLab
 * `src/app/matching/MatchingResults.tsx` `calcPorutham` and its lookup
 * tables (`NAKSHATRA_GANA`, `NAKSHATRA_YONI`, `RASHI_LORD`, Rajju groups,
 * Vedha pairs, Vasya). Source there: the "Marriage" reference workbook.
 *
 * Inputs are the two natives' Moon nakshatra index (0-26) and Moon rasi
 * index (0-11). Convention: "girl" = bride, "boy" = groom (the classical
 * poruthams are asymmetric — several count from the girl's star).
 */

const { describePorutham, poruthamEvidence } = require('./poruthamFactors');

const NAKSHATRA_NAMES = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu',
  'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta',
  'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha',
  'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha', 'Purva Bhadrapada',
  'Uttara Bhadrapada', 'Revati',
];
const NAKSHATRA_GANA = [
  0, 1, 2, 0, 0, 2, 0, 0, 2,
  2, 1, 0, 0, 2, 0, 1, 2, 0,
  2, 1, 0, 0, 2, 2, 1, 2, 0,
]; // 0 = Deva, 1 = Manushya, 2 = Rakshasa
const GANA_NAMES = ['தேவர்', 'மனிதர்', 'இராட்சதர்'];
const NAKSHATRA_YONI = [
  0, 7, 0, 5, 5, 4, 3, 1, 2,
  8, 6, 6, 5, 0, 8, 8, 4, 4,
  7, 7, 6, 8, 3, 3, 1, 2, 7,
];
const RASHI_LORD = [2, 5, 3, 1, 0, 3, 5, 2, 4, 6, 6, 4]; // 0 Sun..6 Saturn
const LORD_TA = ['சூரியன்', 'சந்திரன்', 'செவ்வாய்', 'புதன்', 'குரு', 'சுக்கிரன்', 'சனி'];
const RAJJU_GROUP = [0, 1, 2, 3, 4, 3, 2, 1, 0, 0, 1, 2, 3, 4, 3, 2, 1, 0, 0, 1, 2, 3, 4, 3, 2, 1, 0];
const RAJJU_TA = ['கால்', 'இடுப்பு', 'வயிறு', 'கழுத்து', 'தலை'];
const VEDHA_PAIRS = [
  [0, 17], [1, 23], [2, 11], [3, 10], [4, 9], [5, 24], [6, 25], [7, 26], [8, 14], [12, 13], [15, 20], [16, 19],
];
const VASYA = {
  0: [3, 8], 1: [6, 11], 2: [5, 10], 3: [0, 7], 4: [9], 5: [2, 7],
  6: [1, 8], 7: [3, 10], 8: [0, 5], 9: [4, 11], 10: [5], 11: [6, 9],
};

function getVedha(n1, n2) {
  return VEDHA_PAIRS.some(([a, b]) => (a === n1 && b === n2) || (a === n2 && b === n1));
}

/**
 * @returns array of 10 { id, name, result, note, measure } rows.
 *
 * `measure` carries the exact quantity the verdict was decided on — the count,
 * the two group names, the gap — so a reader can be shown *why* a factor
 * passed or failed rather than only that it did (VJ-018). `describePorutham`
 * in `poruthamFactors.js` turns it into a sentence; nothing here formats prose.
 */
function calcPorutham(girlNak, boyNak, girlRashi, boyRashi) {
  const rows = [];

  const dhin = ((boyNak - girlNak + 27) % 27) + 1;
  const dinaRemainder = dhin % 9 || 9;
  const DINA_REJECTED = [2, 4, 6, 8, 9];
  rows.push({
    id: 'DINA', name: 'தினம்',
    result: !DINA_REJECTED.includes(dinaRemainder), note: `எண்: ${dhin}`,
    measure: { count: dhin, remainder: dinaRemainder, rejected: DINA_REJECTED },
  });

  const gG = NAKSHATRA_GANA[girlNak];
  const gB = NAKSHATRA_GANA[boyNak];
  const ganaOk = gG === gB || (gG === 0 && gB === 1) || (gG === 1 && gB === 0);
  rows.push({
    id: 'GANA', name: 'கணம்',
    result: ganaOk, note: `பெண்: ${GANA_NAMES[gG]}, ஆண்: ${GANA_NAMES[gB]}`,
    measure: { girl: GANA_NAMES[gG], boy: GANA_NAMES[gB], same: gG === gB },
  });

  const mah = ((boyNak - girlNak + 27) % 27) + 1;
  const MAHENDRA_ACCEPTED = [4, 7, 10, 13, 16, 19, 22, 25];
  rows.push({
    id: 'MAHENDRA', name: 'மகேந்திரம்',
    result: MAHENDRA_ACCEPTED.includes(mah), note: `எண்: ${mah}`,
    measure: { count: mah, accepted: MAHENDRA_ACCEPTED },
  });

  const stree = ((boyNak - girlNak + 27) % 27) + 1;
  rows.push({
    id: 'STREE_DEERGHA', name: 'ஸ்திரீ தீர்க்கம்',
    result: stree >= 7, note: `எண்: ${stree}`,
    measure: { count: stree, minimum: 7 },
  });

  const yG = NAKSHATRA_YONI[girlNak % 27];
  const yB = NAKSHATRA_YONI[boyNak % 27];
  rows.push({
    id: 'YONI', name: 'யோனி',
    result: yG === yB || Math.abs(yG - yB) <= 1, note: `பெண்: ${yG}, ஆண்: ${yB}`,
    measure: { girl: yG, boy: yB, gap: Math.abs(yG - yB), groups: 9 },
  });

  const rashiDiff = ((boyRashi - girlRashi + 12) % 12) + 1;
  const RASI_ACCEPTED = [1, 2, 5, 6, 7, 11];
  rows.push({
    id: 'RASI', name: 'ராசி',
    result: RASI_ACCEPTED.includes(rashiDiff), note: `இடைவெளி: ${rashiDiff}`,
    measure: { gap: rashiDiff, accepted: RASI_ACCEPTED },
  });

  const gL = RASHI_LORD[girlRashi];
  const bL = RASHI_LORD[boyRashi];
  rows.push({
    id: 'RASI_ADHIPATHI', name: 'ராசி அதிபதி',
    result: gL !== bL, note: `பெண்: ${LORD_TA[gL]}, ஆண்: ${LORD_TA[bL]}`,
    measure: { girl: LORD_TA[gL], boy: LORD_TA[bL], same: gL === bL },
  });

  const vasya = (VASYA[girlRashi] || []).includes(boyRashi) || (VASYA[boyRashi] || []).includes(girlRashi);
  rows.push({
    id: 'VASYA', name: 'வசியம்',
    result: !!vasya, note: vasya ? 'பொருந்தும்' : 'பொருந்தாது',
    measure: {
      found: !!vasya,
      girlControlsBoy: (VASYA[girlRashi] || []).includes(boyRashi),
      boyControlsGirl: (VASYA[boyRashi] || []).includes(girlRashi),
    },
  });

  const gR = RAJJU_GROUP[girlNak % 27];
  const bR = RAJJU_GROUP[boyNak % 27];
  rows.push({
    id: 'RAJJU', name: 'ரஜ்ஜு',
    result: gR !== bR, note: `பெண்: ${RAJJU_TA[gR]}, ஆண்: ${RAJJU_TA[bR]}`,
    measure: { girl: RAJJU_TA[gR], boy: RAJJU_TA[bR], same: gR === bR },
  });

  const vedha = getVedha(girlNak, boyNak);
  rows.push({
    id: 'VEDHA', name: 'வேதை',
    result: !vedha, note: vedha ? 'வேதை உண்டு' : 'வேதை இல்லை',
    measure: { present: vedha },
  });

  return rows;
}

/**
 * @param girl  { nakshatraIndex, rasiIndex, nakshatra }
 * @param boy   { nakshatraIndex, rasiIndex, nakshatra }
 */
function calculateTamilPorutham(girl, boy) {
  const raw = calcPorutham(girl.nakshatraIndex, boy.nakshatraIndex, girl.rasiIndex, boy.rasiIndex);
  // Every row leaves here explained. A verdict shown without its reasoning is
  // the defect VJ-018 removes, so there is no unexplained path out.
  const rows = describePorutham(raw);
  const passed = rows.filter((r) => r.result).length;
  const level = passed >= 8 ? 'உத்தமம்' : passed >= 6 ? 'மத்திமம்' : passed >= 4 ? 'சாதாரணம்' : 'குறைவு';
  return {
    girl: { nakshatra: NAKSHATRA_NAMES[girl.nakshatraIndex], rasiIndex: girl.rasiIndex },
    boy: { nakshatra: NAKSHATRA_NAMES[boy.nakshatraIndex], rasiIndex: boy.rasiIndex },
    rows,
    passed,
    total: rows.length,
    level,
    // All ten rule tables are unsourced (see poruthamFactors.js), so the
    // verdicts travel with that fact attached rather than depending on the UI
    // to remember it.
    evidence: poruthamEvidence(raw),
    sourceStatus: 'SOURCE_REQUIRED',
  };
}

/** Moon sidereal longitude -> { nakshatraIndex, rasiIndex, nakshatra }. */
function moonToStar(moonLongitude) {
  const lon = ((moonLongitude % 360) + 360) % 360;
  const nakshatraIndex = Math.floor(lon / (360 / 27)) % 27;
  return { nakshatraIndex, rasiIndex: Math.floor(lon / 30), nakshatra: NAKSHATRA_NAMES[nakshatraIndex] };
}

module.exports = { calculateTamilPorutham, calcPorutham, moonToStar, NAKSHATRA_NAMES };
