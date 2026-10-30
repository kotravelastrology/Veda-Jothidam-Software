/**
 * The running period of a dasha down to five levels (main, sub, sub-sub, prana, sookshma) at one instant, for the dashas whose engines build
 * the main period and one sub level only.
 *
 *  - Yogini and Ashtottari: each period is shared among the eight lords in the cycle's order from the period's own lord, in proportion to
 *    their years (the rule `altDashas.js` already uses for the sub level), applied again at each level. A first period that is only a balance
 *    is taken as the tail of the full period.
 *  - Narayana and Rath's Sthira (sign dashas): each period is split into twelve equal parts. The order is Rath's Jaimini Upadesa Sutras 2.4.31-34
 *    (printed p.218): "the antardasa (subperiods) and bhuktis (sub-sub-periods) commence from the lord of the dasa sign" (its sign, or the seventh from
 *    it: only the lord's own sign is used here); regular and zodiacal if the lord stands in an odd sign, reversed in an even sign; zodiacal if
 *    Saturn is in the dasa sign, reversed if Ketu is. "This system of antar & bhukti reckoning is used in all phalita dasas."
 * Parashara's Light prints other strings for the sign dashas below the main level; they are not reproduced.
 */
const { signYears } = require('./jaiminiRashiDashas');
const { buildDasha, subPeriods } = require('./nakshatraDashaEngine');

const LEVELS = ['Mahadasha', 'Antardasha', 'Pratyantardasha', 'Sookshma', 'Prana'];

function proportional({ periods, lords, years, cycleYears, atMs, depth = 5 }) {
  const p = periods.find((x) => x.startMs <= atMs && atMs < x.endMs);
  if (!p) return [];
  const full = years[p.index];
  const spanMs = (full / p.years) * (p.endMs - p.startMs);
  let node = { index: p.index, start: p.endMs - spanMs, end: p.endMs };
  const out = [{ level: 1, lord: lords[node.index], startMs: p.startMs, endMs: p.endMs }];
  for (let lvl = 2; lvl <= depth; lvl += 1) {
    const total = node.end - node.start;
    let t = node.start;
    let next = null;
    for (let i = 0; i < 8; i += 1) {
      const idx = (node.index + i) % 8;
      const len = (years[idx] / cycleYears) * total;
      if (t <= atMs && atMs < t + len) { next = { index: idx, start: t, end: t + len }; break; }
      t += len;
    }
    if (!next) break;
    node = next;
    out.push({ level: lvl, lord: lords[node.index], startMs: node.start, endMs: node.end });
  }
  return out;
}

/** Order of the twelve sub-periods of a sign (Rath 2.4.31-34). */
function subOrder(sign, facts) {
  const { lord, target } = signYears(sign, facts);
  let fwd = target % 2 === 0; // Aries, Gemini ... are the odd signs
  if (facts.signs.Saturn === sign) fwd = true;
  if (facts.signs.Ketu === sign) fwd = false;
  return { lord, start: target, forward: fwd, order: Array.from({ length: 12 }, (_, i) => (fwd ? (target + i) % 12 : (target - i + 12) % 12)) };
}

/** @param schedule  RS.schedule(...) entries: { sign, startMs, endMs } */
function signChain({ schedule, facts, atMs, depth = 5 }) {
  const m = schedule.find((s) => s.startMs <= atMs && atMs < s.endMs);
  if (!m) return [];
  const out = [{ level: 1, sign: m.sign, startMs: m.startMs, endMs: m.endMs }];
  let node = { sign: m.sign, start: m.startMs, end: m.endMs };
  for (let lvl = 2; lvl <= depth; lvl += 1) {
    const len = (node.end - node.start) / 12;
    const { order } = subOrder(node.sign, facts);
    const i = Math.min(11, Math.floor((atMs - node.start) / len));
    node = { sign: order[i], start: node.start + i * len, end: node.start + (i + 1) * len };
    out.push({ level: lvl, sign: node.sign, startMs: node.start, endMs: node.end });
  }
  return out;
}

/**
 * The running periods of a nakshatra-based table (`rareDashas.js` getTable) at an instant, to five levels: the engine builds four, the fifth is the proration of the fourth.
 * A sub-period takes its parent's years in proportion to the lords' years, in the cycle's order from the parent's lord (nakshatraDashaEngine.js).
 */
function tableChain({ table, birthMs, moonLongitude, atMs, depth = 5 }) {
  const YEAR_MS = 365.25 * 86400000;
  const tree = buildDasha(table, { birthMs, moonLongitude, depth: Math.min(depth, 4), cycles: Math.ceil(125 / table.totalYears) + 1 });
  const at = (yrs) => birthMs + yrs * YEAR_MS;
  const inside = (p) => at(p.startYears) <= atMs && atMs < at(p.endYears);
  const out = [];
  let list = tree.periods;
  let node = null;
  for (let level = 1; level <= Math.min(depth, 4); level += 1) {
    node = list.find(inside);
    if (!node) return out;
    out.push({ level, lord: node.lord, startMs: at(node.startYears), endMs: at(node.endYears) });
    list = node.children || [];
  }
  if (depth >= 5 && node) {
    const next = subPeriods(table, node.lord, node.durationYears, node.startYears).find(inside);
    if (next) out.push({ level: 5, lord: next.lord, startMs: at(next.startYears), endMs: at(next.endYears) });
  }
  return out;
}

module.exports = { proportional, signChain, subOrder, tableChain, LEVELS };
