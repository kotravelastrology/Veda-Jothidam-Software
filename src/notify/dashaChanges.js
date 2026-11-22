'use strict';

/**
 * The coming starts of Vimshottari periods of one chart, for the dasha notices (app/notifyActions.ts stores them as dated messages; the
 * birth details themselves are not kept). The periods are the dasha page's own (src/dasha/dashaDrill.js chainAt): nothing new is
 * computed here, only where the innermost running period ends and what runs after it.
 */
const { chainAt } = require('../dasha/dashaDrill');

const DAY_MS = 86400000;
const JD_UNIX_EPOCH = 2440587.5;
/** A step past a period's end, to read the period that follows (about 0.09 s). */
const STEP = 1e-6;

/**
 * @param {{ mahadashas: { lord: string, startJd: number, endJd: number, fullStartJd?: number }[], fromMs: number, untilMs: number,
 *   levels?: number, max?: number }} p levels 1 = dasha, 2 = with bhukti, 3 = with antara
 * @returns {{ atMs: number, level: number, chain: { lord: string }[] }[]} level = the outermost level that changes (1 = a new dasha)
 */
function upcomingDashaChanges({ mahadashas, fromMs, untilMs, levels = 2, max = 40 }) {
  if (!Array.isArray(mahadashas) || mahadashas.length === 0) return [];
  const out = [];
  let jd = fromMs / DAY_MS + JD_UNIX_EPOCH;
  const untilJd = untilMs / DAY_MS + JD_UNIX_EPOCH;
  while (out.length < max) {
    const chain = chainAt(mahadashas, jd, levels);
    const end = Math.min(...chain.map((p) => p.endJd));
    if (!(end > jd) || end > untilJd) break;
    const next = chainAt(mahadashas, end + STEP, levels);
    if (!(next[next.length - 1].startJd > jd)) break; // past the last period of the cycle
    const changed = next.findIndex((p, i) => p.lord !== chain[i].lord || p.startJd !== chain[i].startJd);
    out.push({ atMs: Math.round((end - JD_UNIX_EPOCH) * DAY_MS), level: changed + 1, chain: next.map((p) => ({ lord: p.lord })) });
    jd = end + STEP;
  }
  return out;
}

module.exports = { upcomingDashaChanges };
