/**
 * The PL9 "Calendar" worksheet (user guide ch.8, "Dashas in calendar format"): for each day of a month, the dasha
 * combination that begins on that day. PL9 writes the Mahadasha and Bhukti (Antardasha) combination on the day it starts.
 *
 * Input is buildVimshottariDasha's tree at depth 2 (each mahadasha carries its antardashas under `Bhukti`). Dates are
 * read from the engine's local strings ("YYYY-MM-DD HH:mm"), so no timezone arithmetic happens here.
 */

/** Number of days in a month of the civil (Gregorian) calendar, for year and month 1-12. */
function daysInMonth(year, month) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/** Weekday of the first of the month, 0 = Sunday, as the calendar grid lays it out. */
function firstWeekday(year, month) {
  return new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
}

/**
 * The dasha changes that begin in one month, grouped by day.
 *
 * @param {{dashas: {lord: string, Bhukti?: {lord: string, startLocal: string}[]}[]}} dashaTree
 * @param {number} year
 * @param {number} month 1-12
 * @returns {{day: number, changes: {mahadasha: string, antardasha: string, time: string, startLocal: string}[]}[]}
 */
function dashaChangesInMonth(dashaTree, year, month) {
  const prefix = `${year}-${String(month).padStart(2, '0')}-`;
  const byDay = new Map();
  for (const maha of dashaTree.dashas) {
    for (const antar of maha.Bhukti || []) {
      if (!antar.startLocal.startsWith(prefix)) continue;
      const day = Number(antar.startLocal.slice(8, 10));
      if (!byDay.has(day)) byDay.set(day, []);
      byDay.get(day).push({
        mahadasha: maha.lord,
        antardasha: antar.lord,
        time: antar.startLocal.slice(11, 16),
        startLocal: antar.startLocal,
      });
    }
  }
  return [...byDay.entries()]
    .sort(([a], [b]) => a - b)
    .map(([day, changes]) => ({ day, changes: changes.sort((x, y) => (x.startLocal < y.startLocal ? -1 : 1)) }));
}

module.exports = { daysInMonth, firstWeekday, dashaChangesInMonth };
