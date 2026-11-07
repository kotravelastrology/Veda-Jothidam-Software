/**
 * BPHS ch.70, "Effects of the Ashtakavarga" (Santhanam, vol.2, printed pp.881-894; fixture fixtures/ashtakavarga/bphs-70.json): when Saturn's transit harms what each
 * planet shows. For each of the seven planets the book takes a house from the planet (the 9th from the Sun for the father, the 4th from the Moon for the mother, the 3rd from
 * Mars for the brothers, the 4th from Mercury, the 5th from Jupiter for the children, the 7th from Venus for the wife, the 8th from Saturn for death), the rekhas of that sign
 * in the planet's Bhinnashtakavarga before reduction, times the planet's Yoga Pinda (its Rashi Pinda plus Graha Pinda after the Trikona and Ekadhipatya reductions,
 * the Shodhya Pinda of ashtakavargaReductions.js); the product divided by 27 gives a nakshatra and divided by 12 a sign, each by its remainder (0 is the 27th and the 12th), and
 * Saturn's transit through them or the two trinal to each is the time of harm.
 * The book works each planet on its own example chart; test-ashtakavarga-effects.js reproduces the seven remainders it states from the rekhas and pindas it gives.
 */
const { calculateBhinnashtakavarga, CONTRIBUTORS } = require('../chart/ashtakavarga');
const { trikonaReduction, ekadhipatyaReduction, shodhyaPinda, rashiPinda, grahaPinda } = require('../chart/ashtakavargaReductions');
const DATA = require('../../fixtures/ashtakavarga/bphs-70.json');

const PLANETS = Object.freeze(['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']);

/**
 * The nakshatra and sign that the book's product points to, with the two trinal to each.
 * @returns {{ product: number, nakshatra: number|null, nakshatras: number[], rasi: number|null, rasis: number[] }} numbers 1-based (Ashwini 1 ... Revati 27; Aries 1 ... Pisces 12); nothing when the product is 0
 */
function saturnTargets(rekhas, yogaPinda) {
  const product = rekhas * yogaPinda;
  if (product === 0) return { product, nakshatra: null, rasi: null, nakshatras: [], rasis: [] };
  const nakshatra = product % 27 || 27;
  const rasi = product % 12 || 12;
  const wrap = (n, size, step) => ((n - 1 + step) % size) + 1;
  return {
    product, nakshatra, rasi,
    nakshatras: [nakshatra, wrap(nakshatra, 27, 9), wrap(nakshatra, 27, 18)],
    rasis: [rasi, wrap(rasi, 12, 4), wrap(rasi, 12, 8)],
  };
}

/** The 0-based sign of each contributor (the Lagna included) of a chart, as the Ashtakavarga engine takes them. */
const rasiPositions = (chart) => Object.fromEntries(CONTRIBUTORS.map((c) => [c, Math.floor((c === 'Lagna' ? chart.lagna : chart.grahas[c]).longitude / 30)]));

/**
 * For each of the seven planets of `chart`: the sign of the book's house, its rekhas before reduction, the Yoga Pinda and the targets of Saturn's transit.
 * @returns {Object<string, { house: number, sign: number, rekhas: number, rashiPinda: number, grahaPinda: number, yogaPinda: number, targets: object }>}
 */
function chartEffects(chart) {
  const rasi = rasiPositions(chart);
  const grahaSigns = new Set([...PLANETS.map((p) => rasi[p]), rasi.Lagna]);
  const out = {};
  for (const p of PLANETS) {
    const before = calculateBhinnashtakavarga(p, rasi);
    const reduced = ekadhipatyaReduction(trikonaReduction(before), grahaSigns);
    const house = DATA.planets[p].house;
    const sign = (rasi[p] + house - 1) % 12;
    const yogaPinda = shodhyaPinda(reduced, rasi);
    out[p] = { house, sign, rekhas: before[sign], rashiPinda: rashiPinda(reduced), grahaPinda: grahaPinda(reduced, rasi), yogaPinda, targets: saturnTargets(before[sign], yogaPinda) };
  }
  return out;
}

module.exports = { DATA, PLANETS, saturnTargets, chartEffects };
