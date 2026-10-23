/**
 * What BPHS chapter 47 says of the Vimshottari dasha of each planet, with the placements the book names checked
 * against a chart. For each planet the book gives the placements that bring good results, those that bring bad
 * results, and what follows; it does not say how many must hold, so every section reports which of its named
 * placements hold, which do not, and which this page cannot check — and gives no verdict.
 *
 * Checked: exaltation, own sign, moolatrikona, debilitation, the houses (kendra, trikona, 2/3/5/6/8/9/10/11/12), a
 * planet sharing the sign (benefic / malefic / the lord of a house), being the lord of a house, the waning Moon.
 * Not checked (need more of the chart than this takes): strength in the vargas, the navamsha, friendly signs,
 * benefic or malefic aspect, combustion, "benefic sign". They come back as `unknown`.
 */

const { EXALTATION, DEBILITATION, OWN_SIGNS, MOOLATRIKONA } = require('../chart/shadbala');

const FIXTURE = require('../../fixtures/dasha-effects/bphs-47.json');

const SIGN_LORD = Object.freeze(['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter']);
const BENEFICS = ['Jupiter', 'Venus', 'Mercury'];
const MALEFICS = ['Sun', 'Mars', 'Saturn', 'Rahu', 'Ketu'];
// The book's own signs for the nodes (v.34-39): Rahu exalted in Taurus, moolatrikona Gemini, own Aquarius; Ketu exalted
// in Scorpio, moolatrikona Sagittarius, own Scorpio. Debilitation is the opposite sign (the book names Scorpio for Rahu).
const NODES = Object.freeze({
  Rahu: { exalted: 1, moola: 2, own: [10], debilitated: 7 },
  Ketu: { exalted: 7, moola: 8, own: [7], debilitated: 1 },
});
const UNCHECKED = new Set(['STRONG_VARGA', 'BENEFIC_NAVAMSA', 'OWN_NAVAMSA', 'EXALTED_NAVAMSA', 'FRIEND_SIGN', 'BENEFIC_SIGN', 'BENEFIC_ASPECT', 'MALEFIC_ASPECT', 'COMBUST']);

const houseOf = (lagnaSign, sign) => ((sign - lagnaSign + 12) % 12) + 1;

/** Which of the book's placement tags hold for `planet` in this chart: { held:Set, tested:Set }. */
function facts(planet, { lagnaSign, signs, degrees }) {
  const sign = signs[planet];
  const house = houseOf(lagnaSign, sign);
  const held = new Set();
  const add = (tag, ok) => { if (ok) held.add(tag); };

  const node = NODES[planet];
  if (node) {
    add('EXALTED', sign === node.exalted);
    add('MOOLATRIKONA', sign === node.moola);
    add('OWN_SIGN', node.own.includes(sign));
    add('DEBILITATED', sign === node.debilitated);
  } else {
    add('EXALTED', EXALTATION[planet]?.sign === sign);
    add('DEBILITATED', DEBILITATION[planet]?.sign === sign);
    add('OWN_SIGN', (OWN_SIGNS[planet] ?? []).includes(sign));
    const mt = MOOLATRIKONA[planet];
    add('MOOLATRIKONA', !!mt && mt.sign === sign && degrees[planet] >= mt.from && degrees[planet] < mt.to);
  }
  for (let h = 1; h <= 12; h += 1) add(`H${h}`, house === h);
  add('KENDRA', [1, 4, 7, 10].includes(house));
  add('TRIKONA', [1, 5, 9].includes(house));

  const others = Object.keys(signs).filter((p) => p !== planet && signs[p] === sign);
  add('CONJ_MALEFIC', others.some((p) => MALEFICS.includes(p)));
  add('BENEFIC_CONJ', others.some((p) => BENEFICS.includes(p)));
  const lordOfHouse = (n) => SIGN_LORD[(lagnaSign + n - 1) % 12];
  for (let n = 1; n <= 12; n += 1) {
    add(`WITH_LORD_${n}`, others.includes(lordOfHouse(n)));
    add(`LORD_${n}`, lordOfHouse(n) === planet);
  }
  // waning Moon: the Moon less than 180 degrees behind the Sun's longitude is waxing; a planet's own sign index cannot say,
  // so this needs the elongation, passed in as `moonWaning`
  const tested = new Set([...Object.keys({ EXALTED: 1, DEBILITATED: 1, OWN_SIGN: 1, MOOLATRIKONA: 1, KENDRA: 1, TRIKONA: 1, CONJ_MALEFIC: 1, BENEFIC_CONJ: 1 })]);
  for (let h = 1; h <= 12; h += 1) tested.add(`H${h}`);
  for (let n = 1; n <= 12; n += 1) { tested.add(`WITH_LORD_${n}`); tested.add(`LORD_${n}`); }
  return { held, tested, house, sign };
}

/** The dasha of one planet: its sections with the placements split into held, not held and not checked. */
function dashaEffects(planet, chart) {
  const f = facts(planet, chart);
  const sections = (FIXTURE.planets[planet] ?? []).map((s) => {
    const held = []; const failed = []; const unknown = [];
    for (const tag of s.conds) {
      if (tag === 'WANING') {
        if (planet === 'Moon' && chart.moonWaning !== undefined) (chart.moonWaning ? held : failed).push(tag); else unknown.push(tag);
      } else if (UNCHECKED.has(tag) || !f.tested.has(tag)) unknown.push(tag);
      else (f.held.has(tag) ? held : failed).push(tag);
    }
    return { ...s, held, failed, unknown };
  });
  return { planet, house: f.house, sign: f.sign, sections };
}

/** All nine planets, in the book's order of treatment, and the book's general verses. */
function allDashaEffects(chart) {
  return {
    source: FIXTURE.source, scope: FIXTURE.scope, general: FIXTURE.general,
    planets: ['Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury', 'Ketu', 'Venus'].map((p) => dashaEffects(p, chart)),
  };
}

module.exports = { FIXTURE, facts, dashaEffects, allDashaEffects, houseOf };
