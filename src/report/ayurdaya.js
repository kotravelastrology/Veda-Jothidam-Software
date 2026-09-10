/**
 * ஆயுர்தாயம் (Ayurdaya) — BPHS Ch.43 longevity. Three systems (Piṇḍāyu /
 * Naisargāyu / Aṁśāyu), one chosen per chart by the relative strength of
 * Lagna / Sun / Moon (v.30-31).
 *
 * Ported from the prior AstrologicLab `src/lib/ayurdaya.ts` (BPHS Santhanam
 * ch.43 vv.2-31, with its worked-example golden test), adapted to Kotravel's
 * English graha keys and its planetaryRelationship.naturalRelation.
 *
 * DISCLOSED SIMPLIFICATIONS (as in the source module):
 *  - Vyayādi Haraṇa uses the flat per-house table (the OCR-corrupt continuous
 *    degree refinement is not reconstructible).
 *  - "Strongest of Lagna/Sun/Moon" uses a dignity score (exalt 5 · own/MT 4 ·
 *    friend 3 · neutral 2 · enemy 1 · debil 0), not a full Ṣaḍbala.
 */
const { EXALTATION, MOOLATRIKONA, OWN_SIGNS } = require('../chart/shadbala');
const { naturalRelation } = require('../chart/planetaryRelationship');

const CLASSICAL_7 = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const RASI_LORDS = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'];
const SAVANA_TO_SAURA = 0.9856034;

const DEEP_EXALT = {
  Sun: [0, 10], Moon: [1, 3], Mars: [9, 28], Mercury: [5, 15], Jupiter: [3, 5], Venus: [11, 27], Saturn: [6, 20],
};
const PINDAYU_YEARS = { Sun: 19, Moon: 25, Mars: 15, Mercury: 12, Jupiter: 15, Venus: 21, Saturn: 20 };
const NISARGAYU_YEARS = { Moon: 1, Mars: 2, Mercury: 9, Venus: 20, Jupiter: 18, Sun: 20, Saturn: 50 };
const COMBUST_ORB = { Moon: 12, Mars: 17, Mercury: 14, Jupiter: 11, Venus: 10, Saturn: 15 };
const MALEFICS = new Set(['Sun', 'Mars', 'Saturn']);
const BENEFICS = new Set(['Moon', 'Mercury', 'Jupiter', 'Venus']);
const VYAYADI_FRACTION = { 12: 1, 11: 1 / 2, 10: 1 / 3, 9: 1 / 4, 8: 1 / 5, 7: 1 / 6 };
const LIFESPAN = [
  ['பாலாரிஷ்டம் (Bālāriṣṭa)', 8], ['யோகாரிஷ்டம் (Yogāriṣṭa)', 20], ['அல்பாயுள் (Alpāyu)', 32],
  ['மத்யாயுள் (Madhyāyu)', 64], ['பூர்ணாயுள் (Pūrṇāyu)', 120], ['திவ்யாயுள் (Divyāyu)', 1000],
];

const norm360 = (d) => ((d % 360) + 360) % 360;
const sep = (a, b) => { const d = Math.abs(norm360(a) - norm360(b)); return Math.min(d, 360 - d); };

function ruleOfThree(fullYears, planet, lon) {
  const [exS, exD] = DEEP_EXALT[planet];
  const d = norm360(norm360(lon) - (exS * 30 + exD));
  return d < 180 ? fullYears - (d * fullYears) / 360 : (d * fullYears) / 360;
}
function pindayuBasic(planet, lon) { return ruleOfThree(PINDAYU_YEARS[planet], planet, lon); }
function nisargayuBasic(planet, lon) { return ruleOfThree(NISARGAYU_YEARS[planet], planet, lon); }
function amsayuBasic(lon) {
  const d9 = norm360(norm360(lon) * 108);
  return Math.floor(d9 / 30) + (d9 % 30) / 30;
}
function ascendantContribution(ascLon) {
  const l = norm360(ascLon);
  return Math.floor(l / 30) + (l % 30) / 30;
}

function isEnemySign(planet, s) {
  const lord = RASI_LORDS[s];
  return lord !== planet && naturalRelation(planet, lord) === 'enemy';
}
function dignityScore(planet, s) {
  if (s === EXALTATION[planet].sign) return 5;
  if (s === (EXALTATION[planet].sign + 6) % 12) return 0;
  if (s === MOOLATRIKONA[planet].sign || (OWN_SIGNS[planet] || []).includes(s)) return 4;
  const lord = RASI_LORDS[s];
  if (lord === planet) return 4;
  const r = naturalRelation(planet, lord);
  return r === 'friend' ? 3 : r === 'enemy' ? 1 : 2;
}

function rectify(planet, basic, s, input, ascLon, ascBeneficAspect) {
  const cands = [{ y: 0, reason: 'குறைப்பு இல்லை' }];
  if (planet !== 'Venus' && planet !== 'Saturn') {
    const orb = COMBUST_ORB[planet];
    if (orb !== undefined && sep(input.longitude, input.sunLongitude) <= orb) {
      cands.push({ y: basic / 2, reason: 'அஸ்தங்கத ஹரணம் (எரிதல்)' });
    }
  }
  if (!input.retrograde && isEnemySign(planet, s)) cands.push({ y: basic / 3, reason: 'சத்ரு க்ஷேத்ர ஹரணம் (பகை ராசி)' });
  const vf = VYAYADI_FRACTION[input.houseFromLagna];
  if (vf !== undefined) {
    const frac = BENEFICS.has(planet) ? vf / 2 : vf;
    cands.push({ y: basic * frac, reason: `வ்யயாதி ஹரணம் (${input.houseFromLagna}-ஆம் பாவம்)` });
  }
  if (input.houseFromLagna === 1 && MALEFICS.has(planet)) {
    let loss = (norm360(ascLon) * 60 * basic) / 21600;
    if (ascBeneficAspect) loss /= 2;
    cands.push({ y: loss, reason: 'க்ரூரோதய ஹரணம் (பாபன் லக்னத்தில்)' });
  }
  const hi = cands.reduce((a, b) => (b.y > a.y ? b : a));
  return { netYears: Math.max(0, basic - hi.y), reason: hi.reason };
}

function classifyLifespan(y) {
  for (const [name, ceil] of LIFESPAN) if (y <= ceil) return name;
  return 'அமிதாயுள் (Amitāyu)';
}

const SYSTEM_TA = { pindayu: 'பிண்டாயு', nisargayu: 'நைசர்க்காயு', amsayu: 'அம்சாயு' };

/**
 * @param opts.grahas       [{ planet, longitude, retrograde, houseFromLagna }] for the 7
 * @param opts.sunLongitude
 * @param opts.ascendantLongitude
 * @param opts.lagnaRasi0
 * @param opts.ascBeneficAspect  bool
 */
function calculateAyurdaya(opts) {
  const { grahas, sunLongitude, ascendantLongitude, lagnaRasi0, ascBeneficAspect = false } = opts;
  const byName = Object.fromEntries(grahas.map((g) => [g.planet, g]));

  // system choice: strongest of Lagna(lord) / Sun / Moon by dignity score
  const lagnaLord = RASI_LORDS[lagnaRasi0];
  const lagnaStr = byName[lagnaLord] ? dignityScore(lagnaLord, Math.floor(norm360(byName[lagnaLord].longitude) / 30)) : 0;
  const sunStr = dignityScore('Sun', Math.floor(norm360(byName.Sun.longitude) / 30));
  const moonStr = dignityScore('Moon', Math.floor(norm360(byName.Moon.longitude) / 30));
  const system = (lagnaStr >= sunStr && lagnaStr >= moonStr) ? 'amsayu' : (sunStr >= moonStr ? 'pindayu' : 'nisargayu');

  const basicFn = system === 'pindayu' ? pindayuBasic : system === 'nisargayu' ? nisargayuBasic : null;
  const contributions = CLASSICAL_7.map((p) => {
    const g = byName[p];
    const s = Math.floor(norm360(g.longitude) / 30);
    const basic = basicFn ? basicFn(p, g.longitude) : amsayuBasic(g.longitude);
    const { netYears, reason } = rectify(p, basic, s, {
      longitude: g.longitude, sunLongitude, retrograde: !!g.retrograde, houseFromLagna: g.houseFromLagna,
    }, ascendantLongitude, ascBeneficAspect);
    return { planet: p, basicYears: Math.round(basic * 1000) / 1000, netYears: Math.round(netYears * 1000) / 1000, reason };
  });

  const ascendantYears = ascendantContribution(ascendantLongitude);
  const totalSavana = contributions.reduce((s, c) => s + c.netYears, 0) + ascendantYears;
  const totalSaura = totalSavana * SAVANA_TO_SAURA;

  return {
    available: true,
    system, systemTa: SYSTEM_TA[system],
    strengths: { lagna: lagnaStr, sun: sunStr, moon: moonStr, lagnaLord },
    contributions,
    ascendantYears: Math.round(ascendantYears * 1000) / 1000,
    totalSavana: Math.round(totalSavana * 100) / 100,
    totalSaura: Math.round(totalSaura * 100) / 100,
    category: classifyLifespan(totalSaura),
  };
}

module.exports = { calculateAyurdaya, pindayuBasic, nisargayuBasic, amsayuBasic, classifyLifespan };
