/**
 * Nakshatra Sanghatta Chakra of Narapati's Svarodaya (Narapatijayacarya, the Sanghatta chapter, Chaukhamba 1971 with
 * Pt. Ganesh Datt Pathaka's Subodhini commentary, printed pp.148-150; the scan is in the corpus as C48). The twenty-seven
 * stars stand at the row ends and bottom points of a trapezoid of nine rows of triangles, and a star is joined by straight
 * lines of the figure to two others: its vedha. A star is struck (viddha) by a planet standing in a star joined to it.
 *
 * The book itself lists five pairs (v.2: Ashwini-Revati, Ashwini-Jyeshtha, Magha-Revati, Magha-Ashlesha, Ashlesha-Mula);
 * the lines read off the diagram give twenty-seven pairs, every one of those five among them, which is the test of the reading.
 * No verdict is made: a rule is reported when its placements hold.
 */

const { starOf } = require('./kotaChakra');

const DATA = require('../../fixtures/sanghatta-chakra/narapati.json');

const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const BENEFICS = ['Mercury', 'Venus', 'Moon', 'Jupiter'];

/** The lines of the figure as pairs of stars: rows (left-right), slants from the right ends, slants from the left ends. */
function linePairs() {
  const { left, right, bottom } = DATA;
  const pairs = [];
  for (let k = 0; k < 9; k += 1) pairs.push([left[k], right[k]]);
  for (let k = 0; k < 9; k += 1) pairs.push([right[k], bottom[k]]);
  for (let k = 0; k < 9; k += 1) pairs.push([left[k], bottom[8 - k]]);
  return pairs;
}

const PAIRS = linePairs();
const PARTNERS = {};
for (const [a, b] of PAIRS) {
  (PARTNERS[a] ??= []).push(b);
  (PARTNERS[b] ??= []).push(a);
}

/** The stars joined to a star (its two vedha). */
const vedhaStars = (star) => PARTNERS[star] ?? [];
const joined = (a, b) => vedhaStars(a).includes(b);

/** The chakra has 27 stars, so a planet in Abhijit is placed in Uttarashada. */
function placeOf(longitude) {
  const s = starOf(longitude);
  return s === 'Abhijit' ? 'UAshadha' : s;
}

/**
 * The planets' stars, the pairs of joined stars that both hold planets, and the rules whose placements hold.
 * `longitudes` maps planet names to sidereal longitudes; `focusStar` is the star whose striking is asked about.
 */
function sanghatta(longitudes, focusStar = null) {
  const placed = PLANETS.filter((p) => longitudes[p] !== undefined).map((planet) => ({ planet, star: placeOf(longitudes[planet]) }));
  const at = (planet) => placed.find((p) => p.planet === planet)?.star;
  const vedha = PAIRS.map(([a, b]) => ({ a, b, planetsA: placed.filter((p) => p.star === a).map((p) => p.planet), planetsB: placed.filter((p) => p.star === b).map((p) => p.planet) }))
    .filter((v) => v.planetsA.length && v.planetsB.length);

  const matches = [];
  const add = (id) => matches.push(DATA.rules.find((r) => r.id === id));

  const strikers = focusStar ? placed.filter((p) => joined(focusStar, p.star)) : [];
  if (focusStar) {
    if (strikers.every((p) => BENEFICS.includes(p.planet))) add('V6_NO_VEDHA');
    if (strikers.some((p) => !BENEFICS.includes(p.planet))) add('V6_MALEFIC_VEDHA');
  }
  const moon = at('Moon');
  if (moon && ['Saturn', 'Mars', 'Sun', 'Rahu'].some((p) => at(p) && joined(moon, at(p)))) add('V7_MOON_VEDHA');
  if (moon && at('Sun') && joined(moon, at('Sun'))) add('V11_SUN_MOON_LINE');
  if (at('Mars') && at('Rahu') && joined(at('Mars'), at('Rahu')) && moon && (moon === at('Mars') || moon === at('Rahu'))) add('V12_MARS_RAHU_MOON');
  if (at('Mercury') && at('Venus') && at('Mercury') === at('Venus') && moon === at('Mercury')) add('V13_MERCURY_VENUS_MOON');
  if (moon && ['Sun', 'Saturn', 'Rahu'].every((p) => at(p) === moon)) add('V14_FOUR_ONE_STAR');
  return { placed, vedha, focusStar, strikers, matches, source: DATA.source, scope: DATA.scope, notBuilt: DATA.notBuilt };
}

module.exports = { DATA, PLANETS, BENEFICS, PAIRS, vedhaStars, joined, sanghatta };
