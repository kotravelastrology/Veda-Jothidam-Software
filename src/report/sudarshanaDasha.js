/**
 * The Sudarshana Chakra dasha of BPHS ch.74 (Santhanam, vol.2, printed pp.912-923; fixture fixtures/sudarshana/bphs-74.json).
 * Each year of life gives one house the role of Ascendant (year 1 the 1st house, year 2 the 2nd ... year 13 the 1st again), each of its months likewise, in
 * each of the three circles (counted from the Ascendant, the Moon and the Sun) that v.19-20 allows. Years and months are solar: a year runs from one return
 * of the Sun to its birth longitude to the next, a month from the Sun's birth longitude plus k signs to plus k+1 signs (the same convention as masaPravesha.js).
 * The facts v.24-26 asks for are listed for each period; the book gives no scale to weigh them, so none is given.
 */
const DATA = require('../../fixtures/sudarshana/bphs-74.json');
const { whenSunAt } = require('./masaPravesha');

const DAY_MS = 86400000;
const SOLAR_YEAR_DAYS = 365.25636;
/** The book's worked example (p.918) takes the Moon and Mercury as benefics. */
const BENEFICS = Object.freeze(['Moon', 'Mercury', 'Jupiter', 'Venus']);
const MALEFICS = Object.freeze(['Sun', 'Mars', 'Saturn', 'Rahu', 'Ketu']);
const GOOD_FROM_ASCENDANT = Object.freeze([1, 4, 5, 7, 8, 9, 10]);
const MALEFIC_GOOD = Object.freeze([3, 6, 11]);

/** The 1-based house of `sign` counted from `base` (both 0-11). */
const houseFrom = (sign, base) => ((((sign - base) % 12) + 12) % 12) + 1;

/** Whether the Ascendant, the Sun and the Moon stand in three different signs, so that the Moon and Sun circles are read (v.19-20). */
const circlesApply = ({ lagna, Sun, Moon }) => new Set([lagna, Sun, Moon]).size === 3;

/**
 * The facts of v.24-26 for the year (or month) whose Ascendant is `ascSign`.
 * @param signs  { Sun..Ketu: 0-11 } the planets' signs
 * @returns {{ ascSign: number, goodBenefics: {planet: string, house: number}[], maleficsIn3611: {planet: string, house: number}[], nodesOnly: number[], maleficMajority: number[], beneficsIn6Or12: number[] }}
 *   `beneficsIn6Or12` are the houses having a benefic in the 6th or 12th from them
 */
function readPeriod(signs, ascSign) {
  const planets = [...BENEFICS, ...MALEFICS].map((planet) => ({ planet, house: houseFrom(signs[planet], ascSign) }));
  const goodBenefics = planets.filter((p) => BENEFICS.includes(p.planet) && GOOD_FROM_ASCENDANT.includes(p.house));
  const maleficsIn3611 = planets.filter((p) => MALEFICS.includes(p.planet) && MALEFIC_GOOD.includes(p.house));
  const nodesOnly = [];
  const maleficMajority = [];
  const beneficsIn6Or12 = [];
  for (let h = 1; h <= 12; h += 1) {
    const here = planets.filter((p) => p.house === h).map((p) => p.planet);
    if (here.length && here.every((p) => p === 'Rahu' || p === 'Ketu')) nodesOnly.push(h);
    const b = here.filter((p) => BENEFICS.includes(p)).length;
    const m = here.length - b;
    if (m > b) maleficMajority.push(h);
    const sixth = ((h - 1 + 5) % 12) + 1;
    const twelfth = ((h - 1 + 11) % 12) + 1;
    if (planets.some((p) => BENEFICS.includes(p.planet) && (p.house === sixth || p.house === twelfth))) beneficsIn6Or12.push(h);
  }
  return { ascSign, goodBenefics, maleficsIn3611, nodesOnly, maleficMajority, beneficsIn6Or12 };
}

/** The circles read for a chart: always the birth chart's, and the Moon's and Sun's when v.19-20 allows. */
function circlesOf({ lagna, Sun, Moon }) {
  const all = [{ id: 'lagna', ref: lagna }, { id: 'moon', ref: Moon }, { id: 'sun', ref: Sun }];
  return circlesApply({ lagna, Sun, Moon }) ? all : all.slice(0, 1);
}

/** The sign that is the Ascendant of period number `n` (1-based) in the circle counted from `ref`. */
const periodAscendant = (ref, n) => (ref + ((n - 1) % 12)) % 12;

/**
 * The start of each of the twelve years from year number `firstYear` (1-based), and their end, as UTC ms.
 * Year 1 starts at the birth itself; year n at the Sun's n-1 returns to the birth longitude.
 */
function yearBounds(birthMs, sunLongitude, firstYear, count = 12) {
  const start = (n) => (n === 1 ? birthMs : whenSunAt(sunLongitude, birthMs + (n - 1) * SOLAR_YEAR_DAYS * DAY_MS));
  const out = [];
  let from = start(firstYear);
  for (let n = firstYear; n < firstYear + count; n += 1) {
    const to = start(n + 1);
    out.push({ year: n, startMs: from, endMs: to });
    from = to;
  }
  return out;
}

/** The twelve months of year number `year`: month k runs from the Sun at the birth longitude + 30k to + 30(k+1), as UTC ms; month 1 of year 1 starts at the birth. */
function monthBounds(birthMs, sunLongitude, year) {
  const yearStart = year === 1 ? birthMs : whenSunAt(sunLongitude, birthMs + (year - 1) * SOLAR_YEAR_DAYS * DAY_MS);
  const starts = [yearStart];
  for (let k = 1; k <= 12; k += 1) starts.push(whenSunAt((sunLongitude + 30 * k) % 360, yearStart + k * 30.4369 * DAY_MS));
  return Array.from({ length: 12 }, (_, k) => ({ month: k + 1, startMs: starts[k], endMs: starts[k + 1] }));
}

/** The number of the solar year of life that contains `ms` (1 = from birth to the first return). */
function yearNumberAt(birthMs, sunLongitude, ms) {
  let n = Math.max(1, Math.floor((ms - birthMs) / (SOLAR_YEAR_DAYS * DAY_MS)) + 1);
  while (n > 1 && whenSunAt(sunLongitude, birthMs + (n - 1) * SOLAR_YEAR_DAYS * DAY_MS) > ms) n -= 1;
  while (whenSunAt(sunLongitude, birthMs + n * SOLAR_YEAR_DAYS * DAY_MS) <= ms) n += 1;
  return n;
}

module.exports = { DATA, BENEFICS, MALEFICS, GOOD_FROM_ASCENDANT, MALEFIC_GOOD, houseFrom, circlesApply, circlesOf, readPeriod, periodAscendant, yearBounds, monthBounds, yearNumberAt };
