/**
 * கிரக அவஸ்தைகள் (planetary states) — three of the five classical systems:
 * Jāgradādi (3), Bālādi (5) and Dīptādi (9). Ported from the prior
 * AstrologicLab `src/lib/avasthas.ts`; adapted to Kotravel's English graha
 * keys and its shadbala EXALTATION / MOOLATRIKONA / OWN_SIGNS + the
 * planetaryRelationship / planetaryWar helpers.
 *
 * Śayanādi (12) and Lajjitādi (6) are not ported yet (Śayanādi needs the
 * ghati-since-sunrise term; Lajjitādi needs a disclosed aspect synthesis).
 */
const { EXALTATION, MOOLATRIKONA, OWN_SIGNS } = require('../chart/shadbala');
const { naturalRelation } = require('../chart/planetaryRelationship');

const RASI_LORDS = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'];
const CLASSICAL_7 = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const WAR_PLANETS = new Set(['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']);

const norm360 = (d) => ((d % 360) + 360) % 360;
const sign0 = (lon) => Math.floor(norm360(lon) / 30);
const degInSign = (lon) => norm360(lon) % 30;
const exaltSign = (p) => EXALTATION[p].sign;
const debilSign = (p) => (EXALTATION[p].sign + 6) % 12;
const isOwnLike = (p, s) => s === exaltSign(p) || s === MOOLATRIKONA[p].sign || (OWN_SIGNS[p] || []).includes(s);

const JAGRADADI = { awake: 'ஜாக்ரத் (விழிப்பு)', dream: 'ஸ்வப்ன (கனவு)', sleep: 'சுஷுப்தி (உறக்கம்)' };

function jagradadi(planet, s) {
  if (isOwnLike(planet, s)) return JAGRADADI.awake;
  if (s === debilSign(planet)) return JAGRADADI.sleep;
  const rel = planet === RASI_LORDS[s] ? 'friend' : naturalRelation(planet, RASI_LORDS[s]);
  return rel === 'enemy' ? JAGRADADI.sleep : JAGRADADI.dream;
}

// Bālādi (5 states, 6deg each). Odd (1-indexed) signs run Bala->Mrita; even reverse.
const BALADI = ['பால (குழந்தை)', 'குமார (இளைஞன்)', 'யுவ (வாலிபன்)', 'வ்ருத்த (முதியவர்)', 'ம்ருத (இறந்த)'];
function baladi(s, deg) {
  const part = Math.min(Math.floor(deg / 6), 4);
  const oddSign = s % 2 === 0; // 0-indexed even = 1-indexed odd
  return oddSign ? BALADI[part] : BALADI[4 - part];
}

const DEEPTADI = {
  deepta: 'தீப்த (உச்சம்)', svastha: 'ஸ்வஸ்த (சொந்த வீடு)', shanta: 'சாந்த (நட்பு)',
  dina: 'தீன (சமம்)', dukhita: 'துக்கித (பகை)', vikala: 'விகல (அஸ்தமனம்)',
  khala: 'கல (நீசம்)', nipidita: 'நிபீடித (கிரக யுத்தம்)',
};

function deeptadi(planet, lonByPlanet) {
  const lon = lonByPlanet[planet];
  const s = sign0(lon);
  // war-defeat: another tara-graha in the same sign within 1deg, this one further along
  if (WAR_PLANETS.has(planet)) {
    for (const o of CLASSICAL_7) {
      if (o !== planet && WAR_PLANETS.has(o) && sign0(lonByPlanet[o]) === s
        && Math.abs(lon - lonByPlanet[o]) <= 1 && lon > lonByPlanet[o]) return DEEPTADI.nipidita;
    }
  }
  // combust: non-Sun within 10deg of Sun in the same sign
  if (planet !== 'Sun' && sign0(lonByPlanet.Sun) === s && Math.abs(lon - lonByPlanet.Sun) <= 10) return DEEPTADI.vikala;
  if (s === exaltSign(planet)) return DEEPTADI.deepta;
  if (s === debilSign(planet)) return DEEPTADI.khala;
  if (isOwnLike(planet, s)) return DEEPTADI.svastha;
  const rel = planet === RASI_LORDS[s] ? 'friend' : naturalRelation(planet, RASI_LORDS[s]);
  return rel === 'friend' ? DEEPTADI.shanta : rel === 'enemy' ? DEEPTADI.dukhita : DEEPTADI.dina;
}

// ── Śayanādi (12 states) ────────────────────────────────────────────────
// {(S·P·c) + (A + G + R)} mod 12; remainder 0 → the 12th state (Nidrā).
//  S = planet's nakshatra serial (1-27) · P = planet's serial from the Sun
//  (Sun=1..Saturn=7) · c = planet's degree-number within its own sign (1-30)
//  A = janma-nakshatra serial (Moon's, 1-27) · G = ghaṭis since sunrise at
//  birth (1 ghaṭi = 24 min) · R = Lagna rāśi serial from Aries (1-12).
const SHAYANADI_NAMES = [
  'சயன (உறக்கம்)', 'உபவேசன (அமர்தல்)', 'நேத்ரபாணி (விழிப்பு)', 'பிரகாசன (முழு விழிப்பு)',
  'கமனேச்சா (செல்ல ஆசை)', 'கமனாவஸ்தா (பயணம்)', 'சபாவாஸ (அவையில்)', 'ஆகமன (திரும்புதல்)',
  'போஜன (உணவு)', 'ந்ருத்யாலிப்சா (நடன ஆசை)', 'கௌதுக (மகிழ்ச்சி)', 'நித்ரா (உறக்கம்)',
];
const PLANET_SERIAL_FROM_SUN = { Sun: 1, Moon: 2, Mars: 3, Mercury: 4, Jupiter: 5, Venus: 6, Saturn: 7 };

function shayanadi(planet, lon, moonNakSerial, ghatisSinceSunrise, lagnaRasiSerial) {
  const S = Math.floor(((lon % 360) + 360) % 360 / (360 / 27)) + 1;
  const P = PLANET_SERIAL_FROM_SUN[planet];
  const c = Math.max(1, Math.round(degInSign(lon)));
  const total = S * P * c + (moonNakSerial + ghatisSinceSunrise + lagnaRasiSerial);
  let rem = Math.round(total) % 12;
  if (rem === 0) rem = 12;
  return { index: rem, name: SHAYANADI_NAMES[rem - 1] };
}

// ── Lajjitādi (6 states) — disclosed synthesis (most specific first) ─────
const LAJJITADI = {
  lajjit: 'லஜ்ஜித (வெட்கம்)', kshobhit: 'க்ஷோபித (கொந்தளிப்பு)', garvit: 'கர்வித (பெருமிதம்)',
  trishit: 'த்ரிஷித (தாகம்)', mudit: 'முதித (மகிழ்ச்சி)', kshudhit: 'க்ஷுதித (பசி)',
};
const SPECIAL_ASPECT_OFFSETS = { Mars: [3, 7], Jupiter: [4, 8], Saturn: [2, 9] };
function aspectsRasi(planet, rasi0) {
  const set = new Set([6, ...(SPECIAL_ASPECT_OFFSETS[planet] || [])].map((o) => (rasi0 + o) % 12));
  return set;
}
const WATER_SIGNS = new Set([3, 7, 11]);

function lajjitadi(planet, lonByPlanet, lagnaRasi0) {
  const lon = lonByPlanet[planet];
  const s = sign0(lon);
  const houseNum = ((s - lagnaRasi0 + 12) % 12) + 1;
  const others = CLASSICAL_7.filter((o) => o !== planet);
  const conj = (name) => name !== planet && sign0(lonByPlanet[name]) === s;
  const rel = (name) => (planet === name ? 'friend' : naturalRelation(planet, name));
  const aspBy = (name) => name !== planet && aspectsRasi(name, sign0(lonByPlanet[name])).has(s);

  if (houseNum === 5 && (conj('Sun') || conj('Mars') || conj('Saturn'))) return LAJJITADI.lajjit;
  const enemyAspect = others.some((o) => rel(o) === 'enemy' && aspBy(o));
  if (conj('Sun') || enemyAspect) return LAJJITADI.kshobhit;
  if (s === exaltSign(planet) || s === MOOLATRIKONA[planet].sign || (OWN_SIGNS[planet] || []).includes(s)) return LAJJITADI.garvit;
  const beneficAspect = ['Moon', 'Mercury', 'Venus'].some((b) => aspBy(b));
  if (WATER_SIGNS.has(s) && enemyAspect && !beneficAspect) return LAJJITADI.trishit;
  const friendNear = others.some((o) => rel(o) === 'friend' && (conj(o) || aspBy(o)));
  if (friendNear || conj('Jupiter')) return LAJJITADI.mudit;
  return LAJJITADI.kshudhit;
}

/**
 * @param grahaLongitudes { Sun..Saturn : sidereal longitude }
 * @param opts.moonNakSerial   janma-nakshatra serial (1-27), for Śayanādi
 * @param opts.ghatisSinceSunrise  ghaṭis since birth-day sunrise (1 = 24 min)
 * @param opts.lagnaRasi0      Lagna rāśi index (0-11)
 */
function calculateAvasthas(grahaLongitudes, opts = {}) {
  const { moonNakSerial, ghatisSinceSunrise, lagnaRasi0 } = opts;
  const canShayana = Number.isFinite(moonNakSerial) && Number.isFinite(ghatisSinceSunrise) && Number.isFinite(lagnaRasi0);
  return {
    available: true,
    rows: CLASSICAL_7.map((p) => {
      const lon = grahaLongitudes[p];
      const row = {
        planet: p,
        jagradadi: jagradadi(p, sign0(lon)),
        baladi: baladi(sign0(lon), degInSign(lon)),
        deeptadi: deeptadi(p, grahaLongitudes),
      };
      if (canShayana) {
        row.shayanadi = shayanadi(p, lon, moonNakSerial, ghatisSinceSunrise, lagnaRasi0 + 1).name;
        row.lajjitadi = lajjitadi(p, grahaLongitudes, lagnaRasi0);
      }
      return row;
    }),
    hasFullSet: canShayana,
  };
}

module.exports = { calculateAvasthas, jagradadi, baladi, deeptadi, shayanadi, lajjitadi };
