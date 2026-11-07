/**
 * The age at a date, the way Parashara's Light prints it on the dasha pages: the calendar difference between the birth date and the date, in the birth place's
 * time. The dasha balance at birth ("Venus 6y 6m 26d") is the birth date to the date the birth dasha ends, not the balance in dasha years: a dasha year of
 * 360 days is shorter than the calendar's. The days left over are counted by the length of the month before the one the date falls in (12 May 1983 to
 * 8 Dec 1989 is 6y 6m 26d: November has 30 days).
 */
const pad = (n) => String(n).padStart(2, '0');

const localDate = (ms, offsetMinutes) => new Date(ms + offsetMinutes * 60000);
const daysInMonth = (year, monthIndex) => new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();

/** { y, m, d } complete years, months and days from `fromMs` to `toMs` (UTC milliseconds) on the calendar of the zone `offsetMinutes`. */
function calendarYmd(fromMs, toMs, offsetMinutes) {
  const a = localDate(fromMs, offsetMinutes);
  const b = localDate(toMs, offsetMinutes);
  let y = b.getUTCFullYear() - a.getUTCFullYear();
  let m = b.getUTCMonth() - a.getUTCMonth();
  let d = b.getUTCDate() - a.getUTCDate();
  if (d < 0) {
    m -= 1;
    const before = b.getUTCMonth() === 0 ? [b.getUTCFullYear() - 1, 11] : [b.getUTCFullYear(), b.getUTCMonth() - 1];
    d += daysInMonth(before[0], before[1]);
  }
  if (m < 0) { y -= 1; m += 12; }
  return y < 0 ? { y: 0, m: 0, d: 0 } : { y, m, d };
}

/** "6y 6m 26d" */
function ymdText(fromMs, toMs, offsetMinutes) {
  const { y, m, d } = calendarYmd(fromMs, toMs, offsetMinutes);
  return `${y}y ${m}m ${d}d`;
}

/** "6y6m": the completed years and months, as the "From ... to ..." headings of the dasha blocks. */
function ageText(fromMs, toMs, offsetMinutes) {
  const { y, m } = calendarYmd(fromMs, toMs, offsetMinutes);
  return `${y}y${m}m`;
}

module.exports = { calendarYmd, ymdText, ageText, pad };
