/**
 * BPHS ch.76 (the five elements) and ch.77 (the three gunas), Santhanam vol.2, printed pp.928-935; fixture fixtures/elements/bphs-76-77.json.
 * Each planet has an element (fire the Sun and Mars, earth Mercury, ether Jupiter, water the Moon and Venus, air Saturn) and a guna (sattva the Sun, Moon and Jupiter;
 * rajas Mercury and Venus; tamas Mars and Saturn). The element of the planet of greater strength gives the native's temperament, mixed when many are equal; the guna that
 * predominates gives the class (uttama, madhyama, adhama; udaseena when equal). The books name no measure of strength, so this module takes the planets' strengths as
 * given and reports who leads; it does not choose among measures. Two planets are equal when their strengths differ by less than `EPS`.
 */
const DATA = require('../../fixtures/elements/bphs-76-77.json');
const { DEBILITATION } = require('../chart/shadbala');

const PLANETS = Object.freeze(['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']);
const GUNAS = Object.freeze(['sattva', 'rajas', 'tamas']);
const EPS = 1e-9;

/** The planets whose strength equals the greatest (within EPS), in the order of PLANETS. */
function leaders(strength) {
  const top = Math.max(...PLANETS.map((p) => strength[p]));
  return PLANETS.filter((p) => top - strength[p] < EPS);
}

/**
 * The element read from `strength` ({planet: number}): the leading planets and, when they all share one element, that element; otherwise 'mixed' (v.3-4).
 * @returns {{ leaders: string[], element: string|'mixed' }}
 */
function elementOf(strength) {
  const lead = leaders(strength);
  const elements = [...new Set(lead.map((p) => DATA.element[p]))];
  return { leaders: lead, element: elements.length === 1 ? elements[0] : 'mixed' };
}

/** The sum of `strength` over the planets of each guna. */
function gunaTotals(strength) {
  return Object.fromEntries(GUNAS.map((g) => [g, PLANETS.filter((p) => DATA.guna[p] === g).reduce((s, p) => s + strength[p], 0)]));
}

/**
 * The guna that exceeds the others (v.10), or 'equal' when none does. `values` is {guna: number}.
 * @returns {string|'equal'}
 */
function gunaLeading(values) {
  const top = Math.max(...GUNAS.map((g) => values[g]));
  const lead = GUNAS.filter((g) => top - values[g] < EPS);
  return lead.length === 1 ? lead[0] : 'equal';
}

/** The guna of the single strongest planet, or 'equal' when planets of different gunas tie for it. */
function gunaOfLeader(strength) {
  const gunas = [...new Set(leaders(strength).map((p) => DATA.guna[p]))];
  return gunas.length === 1 ? gunas[0] : 'equal';
}

/** Whether `planet`, standing in `sign` (0-11), is in its sign of debilitation (v.17). */
const debilitated = (planet, sign) => DEBILITATION[planet].sign === sign;

module.exports = { DATA, PLANETS, GUNAS, leaders, elementOf, gunaTotals, gunaLeading, gunaOfLeader, debilitated };
