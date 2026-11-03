/**
 * What BPHS chapters 52-60 say of the Vimshottari antardasha of each planet in the dasha of each of the nine, with the placements the
 * book names checked against a chart. For each pair the book gives the placements that bring good results, those that bring bad results,
 * the part of the antardasha in which they come, and a remedy; it does not say how many must hold, so every section reports which of
 * its named placements hold, which do not, and which this page cannot check — and gives no verdict (the same rule as dashaEffects.js).
 *
 * The book reads the antardasha lord in two ways: from the Lagna (`H1`..`H12`, kendra, trikona, the sign it holds, the houses it rules)
 * and from the lord of the dasha (`D1`..`D12`, `D_KENDRA`, `D_TRIKONA`, together with the dasha lord, `CONJ_DL`).
 *
 * Checked: exaltation, own sign, moolatrikona, debilitation, the houses from the Lagna and from the dasha lord, kendra and trikona, a
 * planet sharing the sign (benefic / malefic / a named planet / the lord of a house / a debilitated planet), being the lord of a house, the
 * sign it stands in, a sign of a malefic owner, the waxing or waning Moon, a benefic in the 1st, 9th or a kendra from the dasha lord, and the
 * Navamsha (own, exalted, debilitated, a benefic's). Not checked (they need more of the chart than this takes): the planet's strength, aspects,
 * combustion, friendly and enemy signs, the Vargas, the yogakaraka, "an auspicious place". They come back as `unknown`.
 */
const { EXALTATION, DEBILITATION, OWN_SIGNS } = require('../chart/shadbala');
const { facts, houseOf } = require('./dashaEffects');
const { navamshaSign } = require('./specialPoints');

const FIXTURE = require('../../fixtures/dasha-effects/bphs-52-60.json');

const ORDER = Object.freeze(['Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury', 'Ketu', 'Venus']);
const SIGN_LORD = Object.freeze(['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter']);
const BENEFICS = ['Jupiter', 'Venus', 'Mercury'];
const MALEFIC_OWNERS = ['Sun', 'Mars', 'Saturn'];
const PLANET_NAMES = new Set(['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu']);
// the book's own signs for the nodes (as dashaEffects.js reads BPHS ch.47 v.34-39); a node's Navamsha is not read against them
const NODES = new Set(['Rahu', 'Ketu']);

/** Tags the book uses that this reading does not test. */
const UNCHECKED = new Set([
  'STRENGTH', 'WEAK', 'YOGAKARAKA', 'D_AUSPICIOUS', 'INAUSPICIOUS_PLACE', 'DEEP_EXALTATION', 'CRUEL_NAVAMSA', 'FRIEND_SIGN', 'ENEMY_SIGN',
  'FRIEND_NAVAMSA', 'WITH_FRIEND', 'OWN_VARGA', 'COMBUST', 'ASPECT_BENEFIC', 'ASPECT_MALEFIC', 'ASPECT_LORD_1_9_10', 'ASPECT_Jupiter', 'ASPECT_Mars', 'ASPECT_Saturn',
]);

/** Which of the book's placement tags hold for antardasha lord `ad` in dasha lord `dl`'s dasha: { held:Set, tested:Set }. */
function adFacts(ad, dl, chart) {
  const f = facts(ad, chart);
  const { lagnaSign, signs, degrees } = chart;
  const held = new Set(f.held);
  const tested = new Set(f.tested);
  const add = (tag, ok) => { tested.add(tag); if (ok) held.add(tag); };
  const sign = signs[ad];
  const others = Object.keys(signs).filter((p) => p !== ad && signs[p] === sign);

  // names the book uses for what dashaEffects.js calls BENEFIC_CONJ
  add('CONJ_BENEFIC', f.held.has('BENEFIC_CONJ'));
  for (const p of PLANET_NAMES) if (p !== ad) add(`WITH_${p}`, others.includes(p));
  add('WITH_DEBILITATED', others.some((p) => DEBILITATION[p]?.sign === signs[p]));
  for (let s = 0; s < 12; s += 1) add(`SIGN_${s}`, sign === s);
  add('NOT_EXALTED', !f.held.has('EXALTED'));
  add('NEITHER_EXALTED_NOR_DEBILITATED', !f.held.has('EXALTED') && !f.held.has('DEBILITATED'));
  add('IN_MALEFIC_SIGN', MALEFIC_OWNERS.includes(SIGN_LORD[sign]));

  // the Moon's waxing and waning need the elongation, passed in as `moonWaning`
  if (ad === 'Moon' && chart.moonWaning !== undefined) { add('WANING', chart.moonWaning); add('WAXING', !chart.moonWaning); }

  // the Navamsha of the antardasha lord
  const nav = navamshaSign(sign * 30 + degrees[ad]);
  if (!NODES.has(ad)) {
    add('OWN_NAVAMSA', (OWN_SIGNS[ad] ?? []).includes(nav));
    add('EXALTED_NAVAMSA', EXALTATION[ad]?.sign === nav);
    add('DEBILITATED_NAVAMSA', DEBILITATION[ad]?.sign === nav);
  }
  add('BENEFIC_NAVAMSA', BENEFICS.includes(SIGN_LORD[nav]));

  // read from the lord of the dasha
  if (ad !== dl) {
    const d = houseOf(signs[dl], sign);
    for (let h = 1; h <= 12; h += 1) add(`D${h}`, d === h);
    add('D_KENDRA', [1, 4, 7, 10].includes(d));
    add('D_TRIKONA', [1, 5, 9].includes(d));
    add('CONJ_DL', d === 1);
    const benefic = Object.keys(signs).some((p) => BENEFICS.includes(p) && [1, 4, 7, 9, 10].includes(houseOf(signs[dl], signs[p])));
    add('BENEFIC_D_1_9_KENDRA', benefic);
  }
  return { ...f, held, tested };
}

/** The antardasha of `ad` in the dasha of `dl`: its sections with the placements split into held, not held and not checked. */
function antardashaEffects(dl, ad, chart) {
  const f = adFacts(ad, dl, chart);
  const sections = (FIXTURE.pairs[dl]?.[ad] ?? []).map((s) => {
    const held = []; const failed = []; const unknown = [];
    for (const tag of s.conds) {
      if (UNCHECKED.has(tag) || !f.tested.has(tag)) unknown.push(tag);
      else (f.held.has(tag) ? held : failed).push(tag);
    }
    return { ...s, held, failed, unknown };
  });
  return {
    dasaLord: dl, antarLord: ad, house: f.house, sign: f.sign,
    houseFromDasaLord: ad === dl ? null : houseOf(chart.signs[dl], f.sign),
    chapter: FIXTURE.chapters[dl], sections,
  };
}

/** The book treats the antardashas of a dasha from the dasha lord's own, in the order Sun, Moon, Mars, Rahu, Jupiter, Saturn, Mercury, Ketu, Venus. */
const bookOrder = (dl) => ORDER.slice(ORDER.indexOf(dl)).concat(ORDER.slice(0, ORDER.indexOf(dl)));

/** The nine antardashas of one dasha, in the book's order of treatment. */
function dashaAntardashas(dl, chart) {
  return bookOrder(dl).map((ad) => antardashaEffects(dl, ad, chart));
}

module.exports = { FIXTURE, ORDER, bookOrder, adFacts, antardashaEffects, dashaAntardashas };
