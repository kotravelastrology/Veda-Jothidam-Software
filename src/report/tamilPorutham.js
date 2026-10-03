/**
 * தமிழ் திருமணப் பொருத்தம் — the ten poruthams (South-Indian marriage
 * matching).
 *
 * ## Source
 *
 * The rules follow **Kalaprakasika**, N.P. Subramania Iyer's English
 * translation, marriage-suitability chapter (printed pp.69-76), whose tables
 * are in `poruthamTables.js`. Each was read from the rendered page and is
 * pinned by `test-porutham-source.js`, which also cross-checks the Sudamani
 * Ullamudaiyan edition.
 *
 * These rules were first ported from an earlier AstrologicLab screen whose only
 * reference was "the Marriage reference workbook". Comparing that port against
 * the printed texts found errors, not merely tradition differences:
 *
 *   - **Gana** put Rohini, Ardra, Uttara Phalguni, Uttara Ashadha and Uttara
 *     Bhadra outside Manushya, Vishakha and Jyeshtha outside Rakshasa and
 *     Anuradha outside Deva — a 12/5/10 split where the classical division of
 *     the 27 stars is 9/9/9.
 *   - **Dina** was inverted: it rejected remainders 2, 4, 6, 8, 9, which is
 *     what *both* texts say are the good ones. A test comment recorded the
 *     inversion as though it were intended.
 *   - **Rasi** accepted {1, 2, 5, 6, 7, 11}; both texts accept the 7th to 12th
 *     and reject the 2nd to 6th.
 *   - **Yoni**, **Vasya** and **Vedha** used tables matching neither text.
 *
 * Mahendra and Rajju were already identical to Kalaprakasika and are unchanged.
 * Rasi Adhipathi is also unchanged, because the book gives each planet's
 * friends but states no rule for what the two lords must be.
 *
 * ## What is not modelled
 *
 * Only what the star and rasi index can carry. Left out, and recorded in
 * `fixtures/porutham/kalaprakasika-poruthams.json`: the pada-level exclusions
 * in Dina's second cycle, the named happy and unsuitable pairs, the rasi
 * exceptions, and the rule that at least five of the ten must agree.
 *
 * Inputs are the two natives' Moon nakshatra index (0-26) and Moon rasi
 * index (0-11). Convention: "girl" = bride, "boy" = groom (the classical
 * poruthams are asymmetric — several count from the girl's star).
 */

const { describePorutham, poruthamEvidence } = require('./poruthamFactors');
const T = require('./poruthamTables');

const NAKSHATRA_NAMES = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu',
  'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta',
  'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha',
  'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha', 'Purva Bhadrapada',
  'Uttara Bhadrapada', 'Revati',
];
const GANA_TA = { deva: 'தேவர்', manushya: 'மனிதர்', rakshasa: 'இராட்சதர்' };

// Rasi Adhipathi: unchanged from the earlier port (see the header).
const RASHI_LORD = [2, 5, 3, 1, 0, 3, 5, 2, 4, 6, 6, 4]; // 0 Sun..6 Saturn
const LORD_TA = ['சூரியன்', 'சந்திரன்', 'செவ்வாய்', 'புதன்', 'குரு', 'சுக்கிரன்', 'சனி'];

/** Count from `from` to `to` inclusive, cyclically, as the books count. */
const starCount = (from, to) => ((to - from + T.STARS) % T.STARS) + 1;
const rasiCount = (from, to) => ((to - from + T.RASIS) % T.RASIS) + 1;

/**
 * Dina, after Kalaprakasika printed pp.69 and 71.
 *
 * Returns { result, measure }. `measure.basis` names which clause decided it,
 * so the explanation can quote the rule that was actually applied.
 */
function dina(girlNak, boyNak, girlRashi, boyRashi) {
  const count = starCount(girlNak, boyNak);

  // A common janma nakshatra is graded by the star itself.
  if (count === 1) {
    const { excellent, neutral, unsuitable } = T.DINA.sameStar;
    const grade = excellent.includes(girlNak) ? 'excellent'
      : neutral.includes(girlNak) ? 'neutral' : unsuitable.includes(girlNak) ? 'unsuitable' : null;
    return { result: grade !== 'unsuitable', measure: { count, basis: 'SAME_STAR', grade } };
  }

  const position = ((count - 1) % 9) + 1;
  const cycle = Math.floor((count - 1) / 9) + 1;
  const base = { count, cycle, position };

  // The 22nd from either asterism is Vadha-Vainasika. Counted from the
  // bridegroom's it is the 7th from the bride's, which the first cycle
  // already rejects, so only the direct count needs testing here.
  if (T.DINA.avoidCounts.includes(count)) {
    return { result: false, measure: { ...base, basis: 'VAINASIKA' } };
  }
  // The 27th is to be avoided unless the two asterisms share a sign.
  if (count === 27) {
    const sameSign = girlRashi === boyRashi;
    return { result: sameSign, measure: { ...base, basis: 'TWENTY_SEVENTH', sameSign } };
  }

  if (cycle === 1) {
    return {
      result: T.DINA.cycleGoodPositions.includes(position),
      measure: { ...base, basis: 'FIRST_CYCLE' },
    };
  }
  // The second and third Pariyaya are not rejected as a whole. The second
  // excludes single quarters of the 3rd, 5th and 7th, which needs the pada and
  // is not modelled; the third produces no evil.
  return {
    result: true,
    measure: { ...base, basis: cycle === 2 ? 'SECOND_CYCLE' : 'THIRD_CYCLE' },
  };
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

  const d = dina(girlNak, boyNak, girlRashi, boyRashi);
  rows.push({ id: 'DINA', name: 'தினம்', result: d.result, note: `எண்: ${d.measure.count}`, measure: d.measure });

  const gG = T.GANA_OF[girlNak];
  const gB = T.GANA_OF[boyNak];
  const ganaOk = gG === gB || (gG === 'deva' && gB === 'manushya') || (gG === 'manushya' && gB === 'deva');
  rows.push({
    id: 'GANA', name: 'கணம்',
    result: ganaOk, note: `பெண்: ${GANA_TA[gG]}, ஆண்: ${GANA_TA[gB]}`,
    measure: { girl: GANA_TA[gG], boy: GANA_TA[gB], same: gG === gB },
  });

  const mah = starCount(girlNak, boyNak);
  rows.push({
    id: 'MAHENDRA', name: 'மகேந்திரம்',
    result: T.MAHENDRA_COUNTS.includes(mah), note: `எண்: ${mah}`,
    measure: { count: mah, accepted: T.MAHENDRA_COUNTS },
  });

  const stree = starCount(girlNak, boyNak);
  rows.push({
    id: 'STREE_DEERGHA', name: 'ஸ்திரீ தீர்க்கம்',
    result: stree >= T.STREE_DEERGHA_MINIMUM, note: `எண்: ${stree}`,
    measure: { count: stree, minimum: T.STREE_DEERGHA_MINIMUM },
  });

  const yG = T.YONI_OF[girlNak];
  const yB = T.YONI_OF[boyNak];
  const hostile = T.yoniHostile(yG, yB);
  rows.push({
    id: 'YONI', name: 'யோனி',
    result: !hostile, note: `பெண்: ${T.YONI_TA[yG]}, ஆண்: ${T.YONI_TA[yB]}`,
    measure: { girl: T.YONI_TA[yG], boy: T.YONI_TA[yB], same: yG === yB, hostile },
  });

  const rashiDiff = rasiCount(girlRashi, boyRashi);
  rows.push({
    id: 'RASI', name: 'ராசி',
    result: rashiDiff >= 7, note: `இடைவெளி: ${rashiDiff}`,
    measure: { gap: rashiDiff, minimum: 7 },
  });

  const gL = RASHI_LORD[girlRashi];
  const bL = RASHI_LORD[boyRashi];
  rows.push({
    id: 'RASI_ADHIPATHI', name: 'ராசி அதிபதி',
    result: gL !== bL, note: `பெண்: ${LORD_TA[gL]}, ஆண்: ${LORD_TA[bL]}`,
    measure: { girl: LORD_TA[gL], boy: LORD_TA[bL], same: gL === bL },
  });

  const girlControlsBoy = (T.VASYA[girlRashi] || []).includes(boyRashi);
  const boyControlsGirl = (T.VASYA[boyRashi] || []).includes(girlRashi);
  const vasya = girlControlsBoy || boyControlsGirl;
  rows.push({
    id: 'VASYA', name: 'வசியம்',
    result: vasya, note: vasya ? 'பொருந்தும்' : 'பொருந்தாது',
    measure: { found: vasya, girlControlsBoy, boyControlsGirl },
  });

  const gR = T.RAJJU_OF[girlNak];
  const bR = T.RAJJU_OF[boyNak];
  rows.push({
    id: 'RAJJU', name: 'ரஜ்ஜு',
    result: gR !== bR, note: `பெண்: ${T.RAJJU_TA[gR]}, ஆண்: ${T.RAJJU_TA[bR]}`,
    measure: { girl: T.RAJJU_TA[gR], boy: T.RAJJU_TA[bR], same: gR === bR },
  });

  const vedha = T.hasVedha(girlNak, boyNak);
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
    // The verdicts travel with where each rule stands against the two primary
    // texts (see poruthamFactors.js), rather than depending on the UI to
    // remember it. The overall score is only as good as the rules that produce
    // it, which is why the count is here and not just per row.
    evidence: poruthamEvidence(raw),
    sourceSummary: summariseSources(rows),
    sourceStatus: rows.every((r) => r.sourceStatus !== 'NOT_SOURCED')
      ? 'SOURCED' : 'PARTIALLY_SOURCED',
  };
}

/**
 * How many factors both texts agree on, how many follow Kalaprakasika alone
 * (Sudamani differs), and how many have no source at all.
 */
function summariseSources(rows) {
  const count = (status) => rows.filter((r) => r.sourceStatus === status).length;
  return {
    agreedByBoth: count('AGREED_BY_BOTH'),
    followsKalaprakasika: count('FOLLOWS_KALAPRAKASIKA'),
    notSourced: count('NOT_SOURCED'),
    total: rows.length,
  };
}

/** Moon sidereal longitude -> { nakshatraIndex, rasiIndex, nakshatra }. */
function moonToStar(moonLongitude) {
  const lon = ((moonLongitude % 360) + 360) % 360;
  const nakshatraIndex = Math.floor(lon / (360 / 27)) % 27;
  return { nakshatraIndex, rasiIndex: Math.floor(lon / 30), nakshatra: NAKSHATRA_NAMES[nakshatraIndex] };
}

module.exports = { calculateTamilPorutham, calcPorutham, moonToStar, NAKSHATRA_NAMES };
