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

/** @param grahaLongitudes { Sun..Saturn : sidereal longitude } */
function calculateAvasthas(grahaLongitudes) {
  return {
    available: true,
    rows: CLASSICAL_7.map((p) => {
      const lon = grahaLongitudes[p];
      return {
        planet: p,
        jagradadi: jagradadi(p, sign0(lon)),
        baladi: baladi(sign0(lon), degInSign(lon)),
        deeptadi: deeptadi(p, grahaLongitudes),
      };
    }),
  };
}

module.exports = { calculateAvasthas, jagradadi, baladi, deeptadi };
