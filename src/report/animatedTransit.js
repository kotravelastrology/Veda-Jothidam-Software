/**
 * Steps for PL9's "Animated transits" (093, 098, 099): the moment moves by a chosen unit forward or back, and the chart of the moment is read
 * against the birth chart (eventChart.js). The units are PL9's: 10 years, year, month, week, day, ascendant, navamsha, hours, 10 minutes,
 * minutes, 10 seconds, seconds.
 *
 * Year and month steps move the calendar field at the same clock time (clamped to the month's last day), as a calendar does; the others are
 * fixed lengths of time. "Ascendant" moves to the instant the lagna next enters (or last entered) a sign, and "Navamsha" the same for each
 * 3 deg 20 min of the lagna, both at the event place and found by bisection on the ascendant.
 */
const { siderealAscendant } = require('../ephemeris/swissEphemeris');

const MS = { seconds: 1000, minutes: 60000, hours: 3600000, day: 86400000, week: 7 * 86400000 };
const UNITS = ['10 Years', 'Year', 'Month', 'Week', 'Day', 'Ascendant', 'Navamsha', 'Hours', '10 Minutes', 'Minutes', '10 Seconds', 'Seconds'];
const FIXED_MS = { Week: MS.week, Day: MS.day, Hours: MS.hours, '10 Minutes': 10 * MS.minutes, Minutes: MS.minutes, '10 Seconds': 10 * MS.seconds, Seconds: MS.seconds };
const jdOf = (ms) => ms / 86400000 + 2440587.5;
const norm = (x) => ((x % 360) + 360) % 360;

/** Move a local-clock field (months) keeping the clock time; `offsetMinutes` is the zone east of UT. */
function addMonths(ms, months, offsetMinutes) {
  const local = new Date(ms + offsetMinutes * 60000);
  const day = local.getUTCDate();
  const target = new Date(Date.UTC(local.getUTCFullYear(), local.getUTCMonth() + months, 1, local.getUTCHours(), local.getUTCMinutes(), local.getUTCSeconds()));
  const last = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(day, last));
  return target.getTime() - offsetMinutes * 60000;
}

/** The next (direction +1) or previous (-1) instant at which the ascendant reaches a multiple of `arc` degrees. */
function nextAscendantBoundary(ms, direction, arc, { latitude, longitude, ayanamsha }) {
  const asc = (t) => siderealAscendant(jdOf(t), latitude, longitude, ayanamsha);
  const cell = (t) => Math.floor(norm(asc(t)) / arc);
  const start = cell(ms);
  const stepMs = 60000;
  let a = ms;
  // walk until the cell changes; the ascendant crosses about 1 degree in 4 minutes, so this takes at most a couple of hours
  for (let i = 0; i < 24 * 60; i += 1) {
    const b = a + direction * stepMs;
    if (cell(b) !== start) {
      let lo = direction > 0 ? a : b;
      let hi = direction > 0 ? b : a; // cell(lo) === start side when forward; for backward lo=b (other cell), hi=a (start cell)
      for (let k = 0; k < 20; k += 1) {
        const mid = (lo + hi) / 2;
        const inStart = cell(mid) === start;
        if (direction > 0) { if (inStart) lo = mid; else hi = mid; } else if (inStart) hi = mid; else lo = mid;
      }
      return Math.round(direction > 0 ? hi : lo);
    }
    a = b;
  }
  throw new Error('no ascendant boundary found');
}

/**
 * @param ms         the moment (Unix ms)
 * @param unit       one of UNITS
 * @param direction  +1 or -1
 * @param place      { latitude, longitude, utcOffsetMinutes, ayanamsha }
 */
function stepMoment(ms, unit, direction, place) {
  if (!UNITS.includes(unit)) throw new RangeError(`unknown unit ${unit}`);
  if (direction !== 1 && direction !== -1) throw new RangeError('direction must be +1 or -1');
  if (unit === '10 Years') return addMonths(ms, 120 * direction, place.utcOffsetMinutes);
  if (unit === 'Year') return addMonths(ms, 12 * direction, place.utcOffsetMinutes);
  if (unit === 'Month') return addMonths(ms, direction, place.utcOffsetMinutes);
  if (unit === 'Ascendant') return nextAscendantBoundary(ms, direction, 30, place);
  if (unit === 'Navamsha') return nextAscendantBoundary(ms, direction, 30 / 9, place);
  return ms + direction * FIXED_MS[unit];
}

/** Local clock parts of a moment at the offset. */
function partsOf(ms, offsetMinutes) {
  const d = new Date(ms + offsetMinutes * 60000);
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate(), hour: d.getUTCHours(), minute: d.getUTCMinutes(), second: d.getUTCSeconds() };
}

module.exports = { stepMoment, partsOf, UNITS };
