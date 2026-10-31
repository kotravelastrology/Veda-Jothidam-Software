const { EXALTATION, DEBILITATION, OWN_SIGNS } = require('../chart/shadbala');
const { RASI_LORD } = require('../chart/karaka');
const { dignityKey } = require('../worksheet/worksheetData');
const { ABBR } = require('../worksheet/dashaList');

/**
 * The facts the dasha browser sets beside a selected period (PL9's Dasha Effects Browser, user guide ch.8 "Dasha browser" and
 * the "Advanced display options" of the dasha cell): where each lord is in the birth chart, how far the antardasha lord is
 * from the mahadasha lord in signs and in nakshatras, and where the planets stand when the period begins.
 *
 * The guide says of the two distances: the nakshatra distance "is a similar principle to Tara bala" (the antardasha lord in
 * the 2nd nakshatra counted from the mahadasha lord's is favourable) and the sign distance is unfavourable at 6, 8 or 12.
 * Those verdicts are PL9's; here the distances are given as numbers, the tara of the nakshatra distance is named with its
 * result as Pulippani's table gives it, and the 6, 8, 12 are marked as PL9's statement, not a classical rule of ours.
 */

const GRAHAS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const SEVEN = GRAHAS.slice(0, 7);
const STAR = 360 / 27;

/** The house count from one sign to another, both ends included: the same sign is 1, the next 2, the 7th from it 7. */
function signDistance(fromSign, toSign) {
  return ((toSign - fromSign + 12) % 12) + 1;
}

/** The nakshatra count from one star (0-26) to another, both included: the same star is 1. */
function nakshatraDistance(fromStar, toStar) {
  return ((toStar - fromStar + 27) % 27) + 1;
}

/** The tara (1-9) of a nakshatra count: the 1st, 10th and 19th are the first tara (Janma), the 2nd, 11th and 20th the second, and so on. */
function taraOf(count) {
  return ((count - 1) % 9) + 1;
}

/**
 * Each planet in the birth chart: sign, degrees, nakshatra (0-26), house from the ascendant, dignity (the seven planets; the
 * nodes have none here) and the houses it rules.
 * @param {{lagna: {rasiIndex: number}, grahas: Record<string, {rasiIndex: number, degreeInSign: number, longitude: number}>}} chart
 */
function natalFacts(chart) {
  const lagnaSign = chart.lagna.rasiIndex;
  const rasiPositions = { ...Object.fromEntries(GRAHAS.map((p) => [p, chart.grahas[p].rasiIndex])), Lagna: lagnaSign };
  return GRAHAS.map((id) => {
    const g = chart.grahas[id];
    return {
      id,
      abbr: ABBR[id],
      rasiIndex: g.rasiIndex,
      degreeInSign: g.degreeInSign,
      star27: Math.min(26, Math.floor((((g.longitude % 360) + 360) % 360) / STAR)),
      house: signDistance(lagnaSign, g.rasiIndex),
      dignity: SEVEN.includes(id) ? dignityKey(id, g.rasiIndex, g.degreeInSign, rasiPositions) : null,
      lordOf: Array.from({ length: 12 }, (_, i) => i + 1).filter((h) => RASI_LORD[(lagnaSign + h - 1) % 12] === id),
    };
  });
}

/** A planet's dignity from its sign alone: exalted, debilitated or own (the seven planets), otherwise null. */
function signDignity(planet, signIndex) {
  if (!SEVEN.includes(planet)) return null;
  if (EXALTATION[planet].sign === signIndex) return 'exalted';
  if (DEBILITATION[planet].sign === signIndex) return 'debilitated';
  if (OWN_SIGNS[planet].includes(signIndex)) return 'own';
  return null;
}

/**
 * The planets at a moment (the start of a period): sign, degrees, house counted from the birth ascendant and the dignity of
 * the sign. `longitudes` maps each of the nine to its sidereal longitude.
 */
function momentFacts(longitudes, natalLagnaSign) {
  return GRAHAS.map((id) => {
    const lon = ((longitudes[id] % 360) + 360) % 360;
    const rasiIndex = Math.floor(lon / 30);
    return { id, abbr: ABBR[id], rasiIndex, degreeInSign: lon - rasiIndex * 30, house: signDistance(natalLagnaSign, rasiIndex), dignity: signDignity(id, rasiIndex) };
  });
}

module.exports = { GRAHAS, signDistance, nakshatraDistance, taraOf, natalFacts, signDignity, momentFacts };
