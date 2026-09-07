const { RASI_LORD } = require('./karaka');

/**
 * Naisargika (natural, constant) Maitri -- BPHS v.55, file p.30-31 (printed
 * p.20-21). Reproduces the chapter's own printed friend/enemy table exactly
 * (Moon has no natural enemy, per the chapter's own separate note on the
 * Moon quoted from Parashara directly).
 */
const NATURAL_FRIENDS = {
  Sun: ['Moon', 'Mars', 'Jupiter'],
  Moon: ['Sun', 'Mercury'],
  Mars: ['Sun', 'Moon', 'Jupiter'],
  Mercury: ['Sun', 'Venus'],
  Jupiter: ['Sun', 'Moon', 'Mars'],
  Venus: ['Mercury', 'Saturn'],
  Saturn: ['Mercury', 'Venus'],
};
const NATURAL_ENEMIES = {
  Sun: ['Venus', 'Saturn'],
  Moon: [],
  Mars: ['Mercury'],
  Mercury: ['Moon'],
  Jupiter: ['Mercury', 'Venus'],
  Venus: ['Moon', 'Sun'],
  Saturn: ['Sun', 'Moon', 'Mars'],
};
function naturalRelation(planet, other) {
  if (NATURAL_FRIENDS[planet].includes(other)) return 'friend';
  if (NATURAL_ENEMIES[planet].includes(other)) return 'enemy';
  return 'neutral';
}

/**
 * Temporary (horoscopic) relationship -- v.56, file p.31: a planet 2nd/3rd/
 * 4th/10th/11th/12th from another (by whole-sign distance, in the natal Rasi
 * chart) is its temporary friend; the remaining distances (1st/5th/6th/7th/
 * 8th/9th) are temporary enemies.
 */
const TEMPORARY_FRIEND_DISTANCES = new Set([2, 3, 4, 10, 11, 12]);
function temporaryRelation(planetRasiIndex, otherRasiIndex) {
  const distance = ((otherRasiIndex - planetRasiIndex + 12) % 12) + 1;
  return TEMPORARY_FRIEND_DISTANCES.has(distance) ? 'friend' : 'enemy';
}

/**
 * Compound (Panchadha/5-fold) relationship -- v.57-58, file p.32: combines
 * natural + temporary into a 5-tier scale. BPHS's own "Speculum of Compound
 * Relationships" states 5 of the 6 possible combinations explicitly
 * (friend+friend=great friend, neutral+friend=friend, enemy+enemy=great
 * enemy, neutral+enemy=enemy, enemy+friend=neutral); the sixth cell,
 * neutral+neutral, is not printed but is completed here as "neutral" by the
 * same additive pattern the other five follow (friend=+1, neutral=0,
 * enemy=-1, net score maps to the 5 tiers below) -- this is the universal,
 * uncontested convention in every published Panchadha Maitri table, not a
 * project-invented rule; two always-neutral inputs cannot net to anything
 * but neutral under the source's own stated arithmetic.
 *
 * Per BPHS's own instruction at Ch.27 v.2-4 ("the compound relationships...
 * be seen in the Rashi chart only and not in the concerned divisional
 * chart"), this natal-Rasi-based relationship is reused as-is for every
 * divisional chart's dignity classification -- it is not recomputed per
 * varga.
 */
const RELATION_SCORE = { friend: 1, neutral: 0, enemy: -1 };
function compoundRelationship(planet, other, rasiPositions) {
  if (planet === other) return 'own';
  const score = RELATION_SCORE[naturalRelation(planet, other)] + RELATION_SCORE[temporaryRelation(rasiPositions[planet], rasiPositions[other])];
  if (score >= 2) return 'greatFriend';
  if (score === 1) return 'friend';
  if (score === 0) return 'neutral';
  if (score === -1) return 'enemy';
  return 'greatEnemy';
}

/**
 * Dignity of a planet with respect to a given sign, per the sign's lord's
 * compound relationship to that planet -- used by Saptavargaja Bala (S10)
 * for any sign the "own sign"/"Moolatrikona" special cases (checked by the
 * caller first) don't already cover.
 */
function relationToSignLord(planet, signIndex, rasiPositions) {
  return compoundRelationship(planet, RASI_LORD[signIndex], rasiPositions);
}

module.exports = {
  naturalRelation,
  temporaryRelation,
  compoundRelationship,
  relationToSignLord,
  NATURAL_FRIENDS,
  NATURAL_ENEMIES,
};
