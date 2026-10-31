/**
 * The worksheet's dasha list (the Vimshottari panel of PL9's "1. Birth chart I"): the Mahadasha-Antardasha periods in order,
 * the one running on a date, and a window of them with each period's date and weekday. Kept apart from worksheetData.js
 * because it has no calculation in it, so the browser can use it: the page windows the list on the client as the date moves.
 */

/** @type {Record<string, string>} */
const ABBR = { Sun: 'Su', Moon: 'Mo', Mars: 'Ma', Mercury: 'Me', Jupiter: 'Ju', Venus: 'Ve', Saturn: 'Sa', Rahu: 'Ra', Ketu: 'Ke', Lagna: 'As', Gulika: 'Gk' };
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * The Mahadasha-Antardasha periods in order, from buildVimshottariDasha's depth-2 tree.
 * @returns {{md: string, ad: string, startLocal: string}[]}
 */
function flattenDasha(tree) {
  return tree.dashas.flatMap((maha) => (maha.Bhukti || []).map((antar) => ({ md: maha.lord, ad: antar.lord, startLocal: antar.startLocal })));
}

/** The index of the period running on a date ('YYYY-MM-DD'): the last that has begun by the end of that day. */
function currentPeriodIndex(periods, asOfDate) {
  let current = 0;
  periods.forEach((p, i) => { if (p.startLocal.slice(0, 10) <= asOfDate) current = i; });
  return current;
}

/** dd-mm-yyyy and the weekday of a period's start, read from its local date string. */
function periodDateText(startLocal) {
  const [y, m, d] = startLocal.slice(0, 10).split('-').map(Number);
  const pad = (n) => String(n).padStart(2, '0');
  return { date: `${pad(d)}-${pad(m)}-${y}`, weekday: WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()] };
}

/**
 * The window of the dasha list: `count` periods from `startIndex` on, each with its date and weekday, and which of them is
 * the one running on `asOfDate`.
 */
function dashaWindow(periods, asOfDate, startIndex, count) {
  const current = currentPeriodIndex(periods, asOfDate);
  const first = Math.max(0, Math.min(startIndex, periods.length - 1));
  const rows = periods.slice(first, first + count).map((p, i) => ({
    index: first + i,
    md: p.md,
    ad: p.ad,
    mdAbbr: ABBR[p.md],
    adAbbr: ABBR[p.ad],
    ...periodDateText(p.startLocal),
    startLocal: p.startLocal,
    isCurrent: first + i === current,
  }));
  return { current, first, rows };
}

module.exports = { ABBR, flattenDasha, currentPeriodIndex, periodDateText, dashaWindow };
