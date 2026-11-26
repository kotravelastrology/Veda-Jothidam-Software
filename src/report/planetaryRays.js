/**
 * The rays (rashmi) of the planets, BPHS ch.73 (Santhanam, vol.2, printed pp.905-911; fixture fixtures/rays/bphs-73.json).
 * A planet has its full rays at its point of deep exaltation (Sun 10, Moon 9, Mars 5, Mercury 5, Jupiter 7, Venus 8, Saturn 5) and none at its point of deep debilitation, and between
 * them in proportion to its distance from the debilitation point (6 signs at most): rays = distance in signs x full rays / 6 (v.1-2). The rays are then corrected by the planet's
 * dignity (v.3-7) and the effects read from the sum of the net rays (v.8-18). The sign's lord is a friend, great friend, enemy or great enemy by the compound relationship of
 * BPHS ch.3 in the birth chart; the Moolatrikona is the degree band of ch.3 v.51-54; a planet in its sign of exaltation is read as exalted before any other dignity.
 * The book's worked example is not copied: four of its printed gross figures do not follow its own rule (see the fixture's scope).
 */
const { EXALTATION, DEBILITATION, d1Dignity } = require('../chart/shadbala');
const DATA = require('../../fixtures/rays/bphs-73.json');

const PLANETS = Object.freeze(['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']);
const norm = (x) => ((x % 360) + 360) % 360;

/** The angular distance (0-180 degrees) of `longitude` from the planet's point of deep debilitation. */
function distanceFromDebilitation(planet, longitude) {
  const point = DEBILITATION[planet].sign * 30 + DEBILITATION[planet].degree;
  const r = norm(longitude - point);
  return r > 180 ? 360 - r : r;
}

/** The planet's rays before correction (v.1-2). */
const grossRays = (planet, longitude) => (distanceFromDebilitation(planet, longitude) / 30) * DATA.maxRays[planet] / 6;

/**
 * The dignity of the planet in its sign for the correction of v.3-7: 'exalted', 'moolatrikona', 'own', 'greatFriend', 'friend', 'neutral', 'enemy' or 'greatEnemy'.
 * @param rasiPositions { Sun..Saturn: 0-11 } the signs of the birth chart (for the compound relationship)
 */
function dignityOf(planet, longitude, rasiPositions) {
  const sign = Math.floor(norm(longitude) / 30);
  if (EXALTATION[planet].sign === sign) return 'exalted';
  return d1Dignity(planet, sign, norm(longitude) % 30, rasiPositions);
}

/** Whether the planet is going from debilitation to exaltation (its longitude 0-180 degrees beyond the debilitation point) or from exaltation to debilitation (v.21). */
function direction(planet, longitude) {
  const point = DEBILITATION[planet].sign * 30 + DEBILITATION[planet].degree;
  return norm(longitude - point) < 180 ? 'ascending' : 'descending';
}

/**
 * The rays of the seven planets of a chart.
 * @param longitudes { Sun..Saturn: sidereal degrees }
 * @returns {{ planets: Object<string, { longitude: number, distance: number, gross: number, dignity: string, factor: number, net: number, direction: 'ascending'|'descending' }>, total: number }}
 */
function rays(longitudes) {
  const rasiPositions = Object.fromEntries(PLANETS.map((p) => [p, Math.floor(norm(longitudes[p]) / 30)]));
  const planets = {};
  let total = 0;
  for (const p of PLANETS) {
    const gross = grossRays(p, longitudes[p]);
    const dignity = dignityOf(p, longitudes[p], rasiPositions);
    const factor = DATA.corrections.factor[dignity];
    const net = gross * factor;
    planets[p] = { longitude: longitudes[p], distance: distanceFromDebilitation(p, longitudes[p]), gross, dignity, factor, net, direction: direction(p, longitudes[p]) };
    total += net;
  }
  return { planets, total };
}

/** The rows of the book's table for a total of rays (the whole number counts; 40 is in two rows; under 1 there is none). */
function effectRows(total) {
  const n = Math.floor(total);
  return DATA.effects.table.filter((r) => n >= r.min && (r.max === null || n <= r.max));
}

module.exports = { DATA, PLANETS, distanceFromDebilitation, grossRays, dignityOf, direction, rays, effectRows };
