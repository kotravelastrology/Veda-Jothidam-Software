/**
 * Pancha Vargeeya Bala — Tajika 5-fold candidate strength, used by the
 * extended Tajika yogas and (optionally) Varsheshwara ranking.
 *
 * = (Kshetra + Uchcha + Hadda + Drekkana + Navamsa) / 4, adapted from
 * AstrologicLab panchaVargeeyaBala.ts ("Vedic Astrology: An Integrated
 * Approach" ch.28.4). Own/friend/enemy scales:
 *   Kshetra 30 / 15 / 7.5 · Hadda 15 / 7.5 / 3.75 · Drekkana 10 / 5 / 2.5 ·
 *   Navamsa 5 / 2.5 / 1.25 · Uchcha 0-20 linear from debilitation.
 * Natural relationship comes from Kotravel's planetaryRelationship
 * (naturalRelation); the source's undocumented "neutral" case uses the
 * friend/enemy midpoint (disclosed in the source's own docstring).
 */
const { EXALTATION, OWN_SIGNS } = require('../chart/shadbala');
const { naturalRelation } = require('../chart/planetaryRelationship');
const { equalDivisionVarga, EQUAL_DIVISION_VARGAS } = require('../chart/vargaChart');

const RASI_LORDS = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'];

function exaltLon(planet) {
  const e = EXALTATION[planet];
  return e ? e.sign * 30 + e.degree : 0;
}

function ownFriendEnemy(planet, rasi0, own, friend, enemy) {
  if ((OWN_SIGNS[planet] || []).includes(rasi0)) return own;
  const lord = RASI_LORDS[rasi0];
  if (lord === planet) return own;
  const rel = naturalRelation(planet, lord);
  if (rel === 'friend') return friend;
  if (rel === 'enemy') return enemy;
  return (friend + enemy) / 2;
}

function kshetraBala(planet, lon) {
  return ownFriendEnemy(planet, Math.floor(lon / 30) % 12, 30, 15, 7.5);
}

function uchchaBala(planet, lon) {
  const debil = (exaltLon(planet) + 180) % 360;
  let diff = ((lon - debil) % 360 + 360) % 360;
  if (diff > 180) diff = 360 - diff;
  return (diff / 180) * 20;
}

// Hadda (Term) table — Table 72. 5 unequal degree bands per rasi Mesha..Meena.
const HADDA_TABLE = [
  [[6, 'Jupiter'], [12, 'Venus'], [20, 'Mercury'], [25, 'Mars'], [30, 'Saturn']],
  [[8, 'Venus'], [14, 'Mercury'], [22, 'Jupiter'], [27, 'Saturn'], [30, 'Mars']],
  [[6, 'Mercury'], [12, 'Venus'], [17, 'Jupiter'], [24, 'Mars'], [30, 'Saturn']],
  [[7, 'Mars'], [13, 'Venus'], [19, 'Mercury'], [26, 'Jupiter'], [30, 'Saturn']],
  [[6, 'Jupiter'], [11, 'Venus'], [18, 'Saturn'], [24, 'Mercury'], [30, 'Mars']],
  [[7, 'Mercury'], [17, 'Venus'], [21, 'Jupiter'], [28, 'Mars'], [30, 'Saturn']],
  [[6, 'Saturn'], [14, 'Mercury'], [21, 'Jupiter'], [28, 'Venus'], [30, 'Mars']],
  [[7, 'Mars'], [11, 'Venus'], [19, 'Mercury'], [24, 'Jupiter'], [30, 'Saturn']],
  [[12, 'Jupiter'], [17, 'Venus'], [21, 'Mercury'], [26, 'Mars'], [30, 'Saturn']],
  [[7, 'Mercury'], [14, 'Jupiter'], [22, 'Venus'], [26, 'Saturn'], [30, 'Mars']],
  [[7, 'Mercury'], [13, 'Venus'], [20, 'Jupiter'], [25, 'Mars'], [30, 'Saturn']],
  [[12, 'Venus'], [16, 'Jupiter'], [19, 'Mercury'], [28, 'Mars'], [30, 'Saturn']],
];

function haddaLord(lon) {
  const rasi0 = Math.floor(lon / 30) % 12;
  const deg = lon % 30;
  const band = HADDA_TABLE[rasi0].find((b) => deg < b[0]) || HADDA_TABLE[rasi0][4];
  return band[1];
}

function isOwnHadda(planet, lon) {
  return haddaLord(lon) === planet;
}

function haddaBala(planet, lon) {
  const lord = haddaLord(lon);
  if (lord === planet) return 15;
  const rel = naturalRelation(planet, lord);
  if (rel === 'friend') return 7.5;
  if (rel === 'enemy') return 3.75;
  return (7.5 + 3.75) / 2;
}

function d3Rashi(lon) {
  return equalDivisionVarga(EQUAL_DIVISION_VARGAS.D3, Math.floor(lon / 30) % 12, lon % 30);
}
function d9Rashi(lon) {
  return equalDivisionVarga(EQUAL_DIVISION_VARGAS.D9, Math.floor(lon / 30) % 12, lon % 30);
}

function drekkanaBala(planet, lon) { return ownFriendEnemy(planet, d3Rashi(lon), 10, 5, 2.5); }
function navamsaBala(planet, lon) { return ownFriendEnemy(planet, d9Rashi(lon), 5, 2.5, 1.25); }

function panchaVargeeyaBala(planet, lon) {
  const total = kshetraBala(planet, lon) + uchchaBala(planet, lon)
    + haddaBala(planet, lon) + drekkanaBala(planet, lon) + navamsaBala(planet, lon);
  return Math.round((total / 4) * 100) / 100;
}

// ── Tajika aspect on a point ("Integrated Approach" ch.28.2) ────────────────
// house-offset (aspecting planet → target point) → aspect kind. Only the 5
// classical Ptolemaic aspects (offsets 0/2/3/4/6/8/9/10); 1 & 11 (semi-sextile,
// 2nd/12th) and 5 & 7 (6-8) cast no Tajika aspect.
const ASPECT_BY_OFFSET = {
  0: 'malefic', 2: 'benefic', 3: 'malefic', 4: 'benefic',
  6: 'malefic', 8: 'benefic', 9: 'malefic', 10: 'benefic',
};
const DEEPTAMSA = { Sun: 15, Moon: 12, Mars: 8, Mercury: 7, Jupiter: 9, Venus: 7, Saturn: 9 };

/** Does `planet` at `planetLon` cast a Tajika aspect on `targetLon`? 'benefic'|'malefic'|null. */
function tajikaAspectOnPoint(planet, planetLon, targetLon) {
  const pR = Math.floor(((planetLon % 360) + 360) % 360 / 30) % 12;
  const tR = Math.floor(((targetLon % 360) + 360) % 360 / 30) % 12;
  const offset = (((tR - pR) % 12) + 12) % 12;
  const kind = ASPECT_BY_OFFSET[offset];
  if (!kind) return null;
  const sameDegTarget = tR * 30 + (planetLon % 30);
  const orb = DEEPTAMSA[planet] || 0;
  const diff = Math.abs(targetLon - sameDegTarget);
  if (Math.min(diff, 360 - diff) > orb) return null;
  return kind;
}

module.exports = { panchaVargeeyaBala, isOwnHadda, exaltLon, d3Rashi, d9Rashi, tajikaAspectOnPoint };
