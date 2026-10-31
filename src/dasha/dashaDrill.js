/**
 * Drilling down the Vimshottari periods one level at a time, for the dasha browser (PL9: "you can select 5 levels of dasha
 * which you want to study"). The nine mahadashas come from the engine (buildVimshottariDasha at depth 1); every deeper level
 * is the same arithmetic the engine uses: a period is divided among the nine lords in the cycle, starting from its own lord,
 * each taking its years over 120 of the period (BPHS ch.51 v.2). So the browser can go to any depth without a server call.
 * No calculation beyond that is in here and nothing in it needs the ephemeris, so the browser can use it.
 */

const CYCLE = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
const YEARS = { Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17 };
const TOTAL_YEARS = 120;
const MAX_LEVELS = 5;

/** The nine lords in cycle order, starting from `lord`. */
function orderFrom(lord) {
  const i = CYCLE.indexOf(lord);
  if (i === -1) throw new RangeError(`Unknown Vimshottari lord: ${lord}`);
  return [...CYCLE.slice(i), ...CYCLE.slice(0, i)];
}

/**
 * The nine sub-periods of a period, in order.
 * @param {{lord: string, startJd: number, endJd: number}} period
 */
function childrenOf(period) {
  const length = period.endJd - period.startJd;
  let cursor = period.startJd;
  return orderFrom(period.lord).map((lord) => {
    const start = cursor;
    cursor += (length * YEARS[lord]) / TOTAL_YEARS;
    return { lord, startJd: start, endJd: cursor };
  });
}

/** 'YYYY-MM-DD HH:mm' in the birth place's time, to the minute, from a Julian day and the UTC offset in minutes. */
function localText(jd, utcOffsetMinutes) {
  const minutes = Math.round(((jd - 2440587.5) * 1440) + utcOffsetMinutes);
  return new Date(minutes * 60000).toISOString().slice(0, 16).replace('T', ' ');
}

/** The periods along a path of lords: path ['Sun', 'Rahu'] gives the Sun mahadasha and its Rahu bhukti. */
function chainFromPath(mahadashas, path) {
  const chain = [];
  let periods = mahadashas;
  for (const lord of path.slice(0, MAX_LEVELS)) {
    const found = periods.find((p) => p.lord === lord);
    if (!found) break;
    chain.push(found);
    periods = childrenOf(found);
  }
  return chain;
}

/** The periods running at a Julian day, down to `levels` levels (the last mahadasha is used before the first begins and after the last ends). */
function chainAt(mahadashas, jd, levels) {
  const chain = [];
  let periods = mahadashas;
  for (let level = 0; level < Math.min(levels, MAX_LEVELS); level += 1) {
    let found = periods.find((p) => p.startJd <= jd && jd < p.endJd);
    if (!found) found = jd < periods[0].startJd ? periods[0] : periods[periods.length - 1];
    chain.push(found);
    periods = childrenOf(found);
  }
  return chain;
}

/**
 * The columns of the browser: the nine mahadashas, then the nine sub-periods of the selected one, and so on, as far as the
 * path goes and one level beyond it (to the number of levels asked for). Each period says whether it is the selected one and
 * whether it is the one running at `jd`.
 * @returns {{level: number, periods: {lord: string, startJd: number, endJd: number, selected: boolean, current: boolean}[]}[]}
 */
function columns(mahadashas, path, levels, jd) {
  const running = chainAt(mahadashas, jd, levels);
  const result = [];
  let periods = mahadashas;
  for (let level = 0; level < Math.min(levels, MAX_LEVELS); level += 1) {
    result.push({
      level: level + 1,
      periods: periods.map((p) => ({ ...p, selected: path[level] === p.lord, current: running[level]?.lord === p.lord && running[level]?.startJd === p.startJd })),
    });
    const selected = periods.find((p) => p.lord === path[level]);
    if (!selected) break;
    periods = childrenOf(selected);
  }
  return result;
}

module.exports = { CYCLE, YEARS, MAX_LEVELS, orderFrom, childrenOf, localText, chainFromPath, chainAt, columns };
