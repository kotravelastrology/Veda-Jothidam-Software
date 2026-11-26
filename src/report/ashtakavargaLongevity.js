/**
 * BPHS ch.71, "Determination of Longevity Through the Ashtakavarga" (Santhanam, vol.2, printed pp.895-896; fixture fixtures/ashtakavarga/bphs-71.json): each rasi of an
 * Ashtakavarga is given a span of life by its rekhas (none 2 days, 1 rekha 1.5 days, 2 one day, 3 half a day, 4 seven and a half days, 5 two years, 6 four years,
 * 7 six years, 8 eight years); the spans of the twelve rasis are added, and half the sum of the Ashtakavargas of the Ascendant and the seven planets is the longevity.
 * Time is kept in ghatikas: a day is 60, a month 30 days, a year 12 months, the units in which the book's own totals add up.
 */
const { calculateBhinnashtakavarga, CONTRIBUTORS, LAGNA_PLACES } = require('../chart/ashtakavarga');
const DATA = require('../../fixtures/ashtakavarga/bphs-71.json');

const GHATIKAS_PER_DAY = 60;
const GHATIKAS_PER_MONTH = 30 * GHATIKAS_PER_DAY;
const GHATIKAS_PER_YEAR = 12 * GHATIKAS_PER_MONTH;
const SPAN_OF = Object.freeze(Object.fromEntries(DATA.spans.perRekha.map((r) => [r.rekhas, r.ghatikas])));
/** The eight Ashtakavargas of the book's table: the seven planets and the Ascendant. */
const CHARTS = Object.freeze(['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Lagna']);

/** The span, in ghatikas, that `rekhas` (an array of the twelve rasis' counts, each 0-8) gives. */
function spanGhatikas(rekhas) {
  return rekhas.reduce((sum, r) => {
    if (!(r in SPAN_OF)) throw new RangeError(`A rasi of an Ashtakavarga holds 0 to 8 rekhas, not ${r}`);
    return sum + SPAN_OF[r];
  }, 0);
}

/** Ghatikas as { years, months, days, ghatikas } (a fraction of a ghatika is dropped). */
function toYmd(gh) {
  const whole = Math.floor(gh);
  return {
    years: Math.floor(whole / GHATIKAS_PER_YEAR),
    months: Math.floor((whole % GHATIKAS_PER_YEAR) / GHATIKAS_PER_MONTH),
    days: Math.floor((whole % GHATIKAS_PER_MONTH) / GHATIKAS_PER_DAY),
    ghatikas: whole % GHATIKAS_PER_DAY,
  };
}

/**
 * The longevity of a chart: for each of the eight Ashtakavargas its twelve counts, span and half span, and the sum of the halves.
 * @param rasi { Sun..Saturn, Lagna: 0-11 }
 * @returns {{ charts: {chart: string, rekhas: number[], span: number, half: number}[], total: number }} spans in ghatikas
 */
function longevity(rasi) {
  const charts = CHARTS.map((c) => {
    const rekhas = c === 'Lagna' ? calculateBhinnashtakavarga('Lagna', rasi, LAGNA_PLACES) : calculateBhinnashtakavarga(c, rasi);
    const span = spanGhatikas(rekhas);
    return { chart: c, rekhas, span, half: span / 2 };
  });
  return { charts, total: charts.reduce((s, c) => s + c.half, 0) };
}

/** The 0-based rasi of each contributor of a parashari chart. */
const rasiPositions = (chart) => Object.fromEntries(CONTRIBUTORS.map((c) => [c, Math.floor((c === 'Lagna' ? chart.lagna : chart.grahas[c]).longitude / 30)]));

module.exports = { DATA, CHARTS, GHATIKAS_PER_DAY, GHATIKAS_PER_MONTH, GHATIKAS_PER_YEAR, SPAN_OF, spanGhatikas, toYmd, longevity, rasiPositions };
