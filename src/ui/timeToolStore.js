/**
 * The time tool's moment, without React (PL9's Change Time tool, user guide ch.9): the moment the open chart is read at. It is one value
 * shared by the pages that use it (the worksheet's dasha list now), held in memory for the session: `null` means "now", following the
 * clock, and a number is a Unix time in milliseconds the user has moved to. The steps themselves are src/report/animatedTransit.js
 * (10 years, year, month, week, day, ascendant, navamsha, hours, 10 minutes, minutes, 10 seconds, seconds).
 */

let atMs = null;
const listeners = new Set();

function getAt() { return atMs; }

/** Moves the tool to a moment (Unix ms), or back to "now" with null. */
function setAt(ms) {
  const next = ms == null || !Number.isFinite(ms) ? null : ms;
  if (next === atMs) return;
  atMs = next;
  listeners.forEach((fn) => fn());
}

function subscribe(fn) {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}

/** The moment to read the chart at: the tool's, or the clock's when the tool is on "now". */
function currentMs(now = Date.now()) {
  return atMs ?? now;
}

const pad = (n) => String(n).padStart(2, '0');

/** 'YYYY-MM-DD' of a moment in the zone `offsetMinutes` east of UT. */
function localDateText(ms, offsetMinutes) {
  const d = new Date(ms + offsetMinutes * 60000);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

/** 'HH:mm:ss' of a moment in that zone. */
function localTimeText(ms, offsetMinutes) {
  const d = new Date(ms + offsetMinutes * 60000);
  return `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
}

/** The moment (Unix ms) of a local date 'YYYY-MM-DD' and time 'HH:mm[:ss]' in that zone; noon when no time is given. */
function dateTextToMs(dateText, offsetMinutes, timeText = '12:00:00') {
  const [y, m, d] = dateText.split('-').map(Number);
  const [h, mi, s] = timeText.split(':').map(Number);
  if (![y, m, d, h, mi].every(Number.isFinite)) return null;
  return Date.UTC(y, m - 1, d, h, mi, s || 0) - offsetMinutes * 60000;
}

module.exports = { getAt, setAt, subscribe, currentMs, localDateText, localTimeText, dateTextToMs };
