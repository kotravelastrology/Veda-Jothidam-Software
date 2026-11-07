/**
 * Horoscope book, page 13 (PL9 sample aniruddha_HC4, "Planetary Avasthas"): the five avasthas of the nine grahas.
 *
 * Jagradadi (BPHS v.5), Baladi (v.3), Lajjitadi (v.11-18, every state that holds), Deeptadi (v.8-10) and Shayanadi (v.30-37).
 * The nodes take Jagradadi, Baladi and Shayanadi; their Deeptadi and Lajjitadi are not built (see avasthas.js).
 *
 * Returns a Promise of { title, subtitle, blocks }, in the printSets shape.
 */
const { julianDay } = require('@swisseph/node');
const { sunriseJulianDay } = require('../../ephemeris/siderealPositions');
const { calculateAvasthas } = require('../avasthas');
const { withBirth } = require('./charts');

const NOT_BUILT = 'கட்டப்படவில்லை';
const NONE = '—';
const GRAHAS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const MONTH_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** The ghatis elapsed since sunrise, the same reading as the report (a birth before sunrise counts from the sunrise before). */
function ghatisSinceSunrise(chart, birth) {
  const jdLocalMidnight = julianDay(birth.year, birth.month, birth.day, -birth.utcOffsetMinutes / 60);
  const sunrise = sunriseJulianDay(jdLocalMidnight, birth.latitude, birth.longitude);
  return ((((chart.julianDay - sunrise) * 24 * 60) / 24) % 60 + 60) % 60;
}

/** Page 13: the avasthas table for the nine grahas. */
function buildPage13({ name = '', birth }) {
  return withBirth(birth, ({ chart }) => {
    const longitudes = Object.fromEntries(GRAHAS.map((p) => [p, chart.grahas[p].longitude]));
    const moonNakSerial = Math.floor(longitudes.Moon / (360 / 27)) + 1;
    const { rows } = calculateAvasthas(longitudes, {
      moonNakSerial,
      ghatisSinceSunrise: ghatisSinceSunrise(chart, birth),
      lagnaRasi0: chart.lagna.rasiIndex,
    });
    const byPlanet = Object.fromEntries(rows.map((r) => [r.planet, r]));
    const cell = (value, empty = NONE) => (value === null ? NOT_BUILT : (value === '' ? empty : value));

    return {
      title: `ஜாதகம் — ${name}`.trim(),
      subtitle: `${birth.placeName} · ${birth.day} ${MONTH_EN[birth.month - 1]} ${birth.year}`,
      blocks: [
        {
          kind: 'table',
          heading: 'Planetary Avasthas',
          columns: ['Planet', 'Jagradadi (3)', 'Baladi (5)', 'Lajjitadi (6)', 'Deeptadi (9)', 'Shayanadi (12)'],
          rows: GRAHAS.map((p) => {
            const r = byPlanet[p];
            return [
              p,
              r.jagradadi,
              r.baladi,
              cell(r.lajjitadi),
              cell(r.deeptadi),
              r.shayanadi,
            ];
          }),
          note: 'BPHS ch.45 (Santhanam, file 612; Girish Chand Vol.1, printed pp.619-625). Jagradadi (v.5): own or exaltation '
            + 'sign awake, friend or neutral dreaming, enemy or debilitation asleep. Baladi (v.3): six-degree stages, reversed in '
            + 'even signs. Deeptadi (v.8-10): exaltation, debilitation, combustion, own sign, then the compound friendship of the '
            + 'sign\'s lord. Lajjitadi (v.11-18): each state as its own condition, so several can hold. Shayanadi (v.30-37): '
            + 'navamsha 1-9 and the ishta ghati rounded up. Against PL9 on this birth: Jagradadi, Baladi and Shayanadi match on all '
            + 'nine grahas; Deeptadi matches on the seven planets; Lajjitadi matches on Sun, Moon, Mars and Saturn. Mercury and Venus '
            + 'carry a Kshudhita that PL9 does not print, Venus a Mudita too, and Jupiter lacks the Trashita PL9 prints. The nodes\' '
            + 'Deeptadi and Lajjitadi are not built: BPHS ch.45 gives them no exaltation or own sign.',
        },
      ],
    };
  });
}

module.exports = { buildPage13 };
