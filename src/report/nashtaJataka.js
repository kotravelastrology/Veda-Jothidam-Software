/**
 * Lost horoscopy (Nashta Jataka), BPHS ch.78 (Santhanam vol.2, printed pp.937-947; fixture fixtures/nashta/bphs-78.json): the birth moment of one who does not know it,
 * from the chart of the moment of the question (the Prasna Lagna), the Jupiter of that chart and the querist's approximate age.
 *
 *  v.5-6   the Dwadasamsa sign of the Prasna Lagna is the sign Jupiter held at birth; the first half of the Lagna's sign is Uttarayana, the second Dakshinayana;
 *          the lord of the Drekkana the Lagna falls in gives the ritu (Saturn Shishira, Sun and Mars Grishma, Venus Vasanta, Moon Varsha, Mercury Sharad, Jupiter Hemanta).
 *  v.7     when the ayana and the ritu contradict, the lords are exchanged: Mars and Mercury, the Moon and Venus, Jupiter and Saturn (the Sun has no partner).
 *  v.8-9   the first half of the Drekkana is the first month of the ritu, the latter half the second; what has expired of that half, in proportion, is the Sun's degrees.
 *  v.14-16 the Sun's longitude at sunrise on the day that many days after its entry into the sign, its daily motion and the difference to the Sun of birth give the Istakala.
 * The ephemeris supplies every longitude, the sunrise and Jupiter's sign; nothing is looked up in a table the book does not give. A birth moment is shown for each year in the
 * age window in which Jupiter really stood in the sign the Dwadasamsa gave (the check the book makes with the almanac); no year is chosen.
 */
const { julianDay } = require('@swisseph/node');
const { planetLongitude, sunriseJulianDay } = require('../ephemeris/siderealPositions');
const DATA = require('../../fixtures/nashta/bphs-78.json');

const DAY_MS = 86400000;
const GHATIKA_MINUTES = 24;
const RASI_LORD = Object.freeze(['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter']);
/** The ritu of the lord of the Lagna's Drekkana (v.5-6). */
const RITU_OF_LORD = Object.freeze({ Saturn: 'Shishira', Sun: 'Grishma', Mars: 'Grishma', Venus: 'Vasanta', Moon: 'Varsha', Mercury: 'Sharad', Jupiter: 'Hemanta' });
/** The lords exchanged when the ayana and the ritu contradict (v.7). */
const EXCHANGE = Object.freeze({ Mars: 'Mercury', Mercury: 'Mars', Moon: 'Venus', Venus: 'Moon', Jupiter: 'Saturn', Saturn: 'Jupiter' });

const jdOfMs = (ms) => ms / DAY_MS + 2440587.5;
const msOfJd = (jd) => (jd - 2440587.5) * DAY_MS;
const norm = (x) => ((x % 360) + 360) % 360;
const wrap = (a, b) => ((((a - b + 180) % 360) + 360) % 360) - 180;
const sunLon = (jd) => planetLongitude(jd, 'Sun');

/** The sign (0-11) of the Dwadasamsa of `longitude`: the 2.5-degree parts counted from the sign itself. */
const dwadasamsaSign = (longitude) => (Math.floor(norm(longitude) / 30) + Math.floor((norm(longitude) % 30) / 2.5)) % 12;

/**
 * The steps of v.5-9 for the Prasna Lagna `lagnaLongitude` (sidereal degrees).
 * @returns {{ samvatsaraSign: number, ayana: 'uttara'|'dakshina', drekkanaSign: number, drekkanaLord: string, ritu: string, rituByLord: string,
 *   exchanged: boolean, contradiction: boolean, usedLord: string, half: 0|1, monthSign: number, expiredDegrees: number, sunDegrees: number, sunLongitude: number }}
 *   `contradiction` is true when the ayana and the ritu still disagree after the exchange (the book gives no partner for the Sun)
 */
function readPrasna(lagnaLongitude) {
  const lon = norm(lagnaLongitude);
  const sign = Math.floor(lon / 30);
  const deg = lon % 30;
  const ayana = deg < 15 ? 'uttara' : 'dakshina';
  const drekkanaSign = (sign + 4 * Math.floor(deg / 10)) % 12;
  const drekkanaLord = RASI_LORD[drekkanaSign];
  const rituByLord = RITU_OF_LORD[drekkanaLord];
  let usedLord = drekkanaLord;
  let ritu = rituByLord;
  let exchanged = false;
  if (DATA.ritus[ritu].ayana !== ayana && EXCHANGE[drekkanaLord]) {
    usedLord = EXCHANGE[drekkanaLord];
    ritu = RITU_OF_LORD[usedLord];
    exchanged = true;
  }
  const half = Math.floor((deg % 10) / 5);
  const monthSign = DATA.ritus[ritu].signs[half];
  const expiredDegrees = deg % 5;
  const sunDegrees = expiredDegrees * 6;
  return {
    samvatsaraSign: dwadasamsaSign(lon), ayana, drekkanaSign, drekkanaLord, ritu, rituByLord, exchanged, contradiction: DATA.ritus[ritu].ayana !== ayana,
    usedLord, half, monthSign, expiredDegrees, sunDegrees, sunLongitude: monthSign * 30 + sunDegrees,
  };
}

/** The JD (UT) at which the Sun's sidereal longitude is `target`, near `guessJd`. */
function sunReaches(target, guessJd) {
  let lo = guessJd - 16;
  let hi = guessJd + 16;
  const f = (jd) => wrap(sunLon(jd), target);
  while (f(lo) > 0) lo -= 20;
  while (f(hi) < 0) hi += 20;
  for (let i = 0; i < 45; i += 1) {
    const mid = (lo + hi) / 2;
    if (f(mid) < 0) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

/** The sidereal Sun is at 0 Aries about 14 April; the JD near which it is at `longitude` in the Gregorian year `year`. */
const sunGuessJd = (year, longitude) => jdOfMs(Date.UTC(year, 0, 1) + ((103.5 + (norm(longitude) / 360) * 365.25) % 365.25) * DAY_MS);

/** The local civil date { y, m, d } of a JD at a zone offset. */
function civilOf(jd, offsetMinutes) {
  const d = new Date(msOfJd(jd) + offsetMinutes * 60000);
  return { y: d.getUTCFullYear(), m: d.getUTCMonth() + 1, d: d.getUTCDate() };
}

/** Sunrise (JD, UT) on a local civil date. */
function sunriseOn({ y, m, d }, offsetMinutes, latitude, longitude) {
  return sunriseJulianDay(julianDay(y, m, d, -offsetMinutes / 60), latitude, longitude);
}

const addDays = ({ y, m, d }, n) => {
  const t = new Date(Date.UTC(y, m - 1, d) + n * DAY_MS);
  return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() };
};

/**
 * The Istakala of v.14-16 for the Sun of birth at `sunLongitude`, found near the Gregorian year `year`: the day that many whole days after the Sun's entry into its sign, the Sun at
 * that day's sunrise, its motion in the next 24 hours, the difference in kalas times 60 over the motion in kalas. The day is moved on until the result lies within one day after sunrise.
 * @returns {{ date: {y,m,d}, sunriseJd: number, sunAtSunriseLongitude: number, motion: number, ghatikas: number, birthJd: number, exactJd: number, differenceMinutes: number }}
 */
function istakala({ sunLongitude, year, offsetMinutes, latitude, longitude }) {
  const target = norm(sunLongitude);
  const signStart = Math.floor(target / 30) * 30;
  const entryJd = sunReaches(signStart, sunGuessJd(year, target) - (target - signStart) * 1.0);
  const exactJd = sunReaches(target, entryJd + (target - signStart));
  let date = addDays(civilOf(entryJd, offsetMinutes), Math.floor(target - signStart));
  for (let guard = 0; guard < 6; guard += 1) {
    const sunriseJd = sunriseOn(date, offsetMinutes, latitude, longitude);
    const sunAt = sunLon(sunriseJd);
    const motion = wrap(sunLon(sunriseJd + 1), sunAt);
    const ghatikas = (wrap(target, sunAt) / motion) * 60;
    if (ghatikas >= 60) { date = addDays(date, 1); continue; }
    if (ghatikas < 0) { date = addDays(date, -1); continue; }
    const birthJd = sunriseJd + (ghatikas * GHATIKA_MINUTES) / 1440;
    return { date, sunriseJd, sunAtSunriseLongitude: sunAt, motion, ghatikas, birthJd, exactJd, differenceMinutes: (birthJd - exactJd) * 1440 };
  }
  throw new Error('The Istakala did not settle within six days.');
}

/**
 * Jupiter's sidereal sign at a JD.
 */
const jupiterSignAt = (jd) => Math.floor(norm(planetLongitude(jd, 'Jupiter')) / 30);

/**
 * The years in which the birth can have been: for each Gregorian year a querist of age between `ageMin` and `ageMax` can have been born in, the moment the Sun reaches
 * the longitude the Prasna gave and Jupiter's sign then. A year `matches` when Jupiter stood in `jupiterSign`. When none matches, the book's other reading
 * (v.12: Jupiter in the 5th or 9th sign from the Prasna Lagna's sign) is tried and marked `viaTrikona`.
 * @returns {{ years: object[], candidates: object[], viaTrikona: boolean }}
 */
function birthYears({ prasna, lagnaSign, queryMs, ageMin, ageMax, offsetMinutes, latitude, longitude }) {
  const queryYear = new Date(queryMs + offsetMinutes * 60000).getUTCFullYear();
  const years = [];
  for (let y = queryYear - Math.ceil(ageMax) - 1; y <= queryYear - Math.floor(ageMin) + 1; y += 1) {
    const jd = sunReaches(prasna.sunLongitude, sunGuessJd(y, prasna.sunLongitude));
    const age = (queryMs - msOfJd(jd)) / (365.25 * DAY_MS);
    if (age < ageMin || age > ageMax) continue;
    years.push({ year: civilOf(jd, offsetMinutes).y, jd, age, jupiterSign: jupiterSignAt(jd) });
  }
  const pick = (signs) => years.filter((e) => signs.includes(e.jupiterSign));
  let candidates = pick([prasna.samvatsaraSign]);
  let viaTrikona = false;
  if (!candidates.length) {
    candidates = pick([(lagnaSign + 4) % 12, (lagnaSign + 8) % 12]);
    viaTrikona = candidates.length > 0;
  }
  return { years: years.map((e) => ({ ...e, matches: candidates.includes(e) })), candidates, viaTrikona };
}

module.exports = {
  DATA, RASI_LORD, RITU_OF_LORD, EXCHANGE, dwadasamsaSign, readPrasna, sunReaches, sunriseOn, istakala, jupiterSignAt, birthYears, civilOf, jdOfMs, msOfJd, GHATIKA_MINUTES,
};
