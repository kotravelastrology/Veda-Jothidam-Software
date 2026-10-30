/**
 * Jaimini's own Chara and Narayana dashas, as Sanjay Rath gives them in "Jaimini Maharishi's Upadesa Sutras"
 * (Chapter I Quarter 1 stanzas 26-29 with Table 1.9, printed pp.12-14 and 20; Chapter II Quarter 4 stanzas 7-10 with
 * Table 2.7, printed pp.205-208). Signs are 0 = Aries … 11 = Pisces.
 *
 * Years of a sign (1.1.26-27): count from the sign to the sign of its lord, both included, less one; forward for the
 * "odd-footed" signs (Aries, Taurus, Gemini, Libra, Scorpio, Sagittarius), backward for the others (the fixed signs
 * Taurus and Scorpio count forward and Leo and Aquarius backward, against their odd/even number). A lord in its own sign
 * gives 12. The lord exalted adds a year, debilitated takes one off. Scorpio has Mars and Ketu, Aquarius Saturn and
 * Rahu: both in the sign give 12; one away, count to that one; both away, the stronger sign decides; equal strength, the
 * larger period.
 *
 * "Stronger" for the two lords' signs is the second source of strength (2.4.1, used in Chara and Narayana): the number of
 * the Atmakaraka, Mercury, Jupiter and the sign's own lord that join or aspect the sign; then the planets in it; then
 * dual over fixed over movable. This follows Rath's worked chart (Rajiv Gandhi), whose Table 1.9 is the test.
 *
 * Chara runs from the lagna, direction by the 9th sign from it (2.3.29). Narayana starts at the stronger of lagna and
 * seventh (the first source of strength, as in `jaiminiShoola.js`); direction is forward when the 9th sign from the
 * starting sign is odd-footed; movable starts take the signs in order, fixed every sixth, dual by trines then the tenth.
 * Table 2.7 is printed in full and is the test for all twelve starts.
 */

const { EXALTATION, DEBILITATION } = require('../chart/shadbala');
const { strongerOfPair } = require('./jaiminiShoola');
const { aspected } = require('./jaiminiShoola');

const SOURCE = Object.freeze({
  title: "Jaimini Maharishi's Upadesa Sutras",
  author: 'Sanjay Rath',
  tradition: 'Jaimini',
  file: 'Jyotish_Jaimini upadesa sutras_S.Rath ban.pdf',
  pageLocus: 'Chapter I Quarter 1 stanzas 26-29 and Table 1.9, printed pp.12-14 and 20; Chapter II Quarter 4 stanzas 7-10 and Table 2.7, printed pp.205-208: '
    + '"The dasa of the signs are determined by counting from a sign to the sign occupied by its lord. This count is zodiacal if the sign is odd and reverse if the sign is even"',
});

const LORD = Object.freeze(['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter']);
const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const CO_LORD = Object.freeze({ 7: 'Ketu', 10: 'Rahu' });
const quality = (s) => s % 3;
/** Odd-footed (vimsapada): forward count. */
const oddFooted = (s) => Math.floor(s / 3) % 2 === 0;
const forward = (from, to) => (to - from + 12) % 12;
const backward = (from, to) => (from - to + 12) % 12;

/** Atmakaraka: the planet with the most degrees in its sign; Rahu counts 30 less its degrees; Ketu is left out. */
function atmakaraka(degrees) {
  const eight = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu'];
  const deg = (p) => (p === 'Rahu' ? 30 - degrees[p] : degrees[p]);
  return eight.reduce((best, p) => (deg(p) > deg(best) ? p : best));
}

/** Second source of strength, then planets in the sign, then nature. Higher compares greater. */
function strengthKey(sign, chart) {
  const { signs, degrees } = chart;
  const ak = atmakaraka(degrees);
  const helpers = new Set([ak, 'Mercury', 'Jupiter', LORD[sign]]);
  let influence = 0;
  for (const p of helpers) {
    if (signs[p] === sign || aspected(signs[p]).includes(sign)) influence += 1;
  }
  const inside = PLANETS.filter((p) => signs[p] === sign).length;
  return [influence, inside, quality(sign)];
}
const compareKeys = (a, b) => { for (let i = 0; i < a.length; i += 1) if (a[i] !== b[i]) return a[i] - b[i]; return 0; };

/** Years of one sign, and the lord's sign it was counted to. */
function signYears(sign, chart) {
  const { signs } = chart;
  const fwd = oddFooted(sign);
  const steps = (to) => (fwd ? forward(sign, to) : backward(sign, to));
  const lords = CO_LORD[sign] ? [LORD[sign], CO_LORD[sign]] : [LORD[sign]];
  let lord;
  let target;
  if (lords.length === 1) {
    [lord] = lords;
  } else {
    const away = lords.filter((l) => signs[l] !== sign);
    if (away.length === 0) { lord = lords[0]; } else if (away.length === 1) { [lord] = away; } else {
      const c = compareKeys(strengthKey(signs[away[0]], chart), strengthKey(signs[away[1]], chart));
      if (c !== 0) lord = c > 0 ? away[0] : away[1];
      else lord = steps(signs[away[0]]) >= steps(signs[away[1]]) ? away[0] : away[1];
    }
  }
  target = signs[lord];
  let years = steps(target);
  if (years === 0) years = 12;
  else {
    if (EXALTATION[lord]?.sign === target) years += 1;
    if (DEBILITATION[lord]?.sign === target) years -= 1;
  }
  return { years, lord, target };
}

/** Jaimini Chara: lagna first, the signs in order, forward when the 9th sign from the lagna is odd-footed. */
function jaiminiChara(chart) {
  const ninth = (chart.lagnaSign + 8) % 12;
  const fwd = oddFooted(ninth);
  const periods = Array.from({ length: 12 }, (_, i) => {
    const sign = fwd ? (chart.lagnaSign + i) % 12 : (chart.lagnaSign - i + 12) % 12;
    return { sign, ...signYears(sign, chart) };
  });
  return { id: 'jaimini-chara', source: SOURCE, start: chart.lagnaSign, forward: fwd, detail: { ninthSign: ninth }, periods };
}

/** The twelve signs in Narayana order from a starting sign (Table 2.7). */
function narayanaOrder(start) {
  const fwd = oddFooted((start + 8) % 12);
  const d = fwd ? 1 : -1;
  const at = (n) => (((start + d * n) % 12) + 12) % 12;
  const q = quality(start);
  if (q === 0) return Array.from({ length: 12 }, (_, i) => at(i));
  if (q === 1) return Array.from({ length: 12 }, (_, i) => at(5 * i));
  return Array.from({ length: 12 }, (_, i) => at(9 * Math.floor(i / 3) + 4 * (i % 3)));
}

/** Narayana (Padakrama): from the stronger of lagna and seventh, Table 2.7 order, Chara years. */
function narayana(chart) {
  const seventh = (chart.lagnaSign + 6) % 12;
  const { winner, step } = strongerOfPair(chart.lagnaSign, seventh, chart);
  const periods = narayanaOrder(winner).map((sign) => ({ sign, ...signYears(sign, chart) }));
  return { id: 'narayana', source: SOURCE, start: winner, forward: oddFooted((winner + 8) % 12), detail: { decidedBy: step, lagnaStronger: winner === chart.lagnaSign }, periods };
}

module.exports = { SOURCE, oddFooted, atmakaraka, strengthKey, signYears, jaiminiChara, narayanaOrder, narayana };
