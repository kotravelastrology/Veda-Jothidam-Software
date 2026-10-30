/**
 * Horoscope book, page 14 (PL9 sample aniruddha_HC4, "Ashtakavarga - Bhinnashtakavarga #1"): the Bhinnashtakavarga of the
 * Sun, Moon, Mars and Mercury.
 *
 * Each planet has its contributor table: the benefic mark (1) of each of the eight contributors in each sign, from the
 * Table-1 of src/chart/ashtakavarga.js, with the row and sign totals. The signs run from the planet's own sign, as PL9 prints
 * them. Each planet also has its bindu count per sign in the chart layout. Page 15 (Bhinnashtakavarga #2) follows the same
 * pattern for Jupiter, Venus and Saturn.
 *
 * Returns a Promise of { title, subtitle, blocks }, in the printSets shape.
 */
const { withBirth } = require('./charts');
const { contributionMatrix, calculateBhinnashtakavarga, CONTRIBUTORS } = require('../../chart/ashtakavarga');

const PAGE_PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury'];
// The row order PL9 prints the contributors in.
const ROW_ORDER = ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Lagna'];
const MONTH_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const sum = (values) => values.reduce((a, b) => a + b, 0);

/** The 0-based rasi of each contributor (the Ascendant included), as the Ashtakavarga engine takes them. */
function rasiPositions(chart) {
  return Object.fromEntries(CONTRIBUTORS.map((c) => [
    c,
    Math.floor((c === 'Lagna' ? chart.lagna : chart.grahas[c]).longitude / 30),
  ]));
}

/** The contributor table and the chart of one planet's Bhinnashtakavarga. */
function planetBlocks(planet, rasi) {
  const marks = contributionMatrix(planet, rasi);
  const bindus = calculateBhinnashtakavarga(planet, rasi);
  const signOrder = Array.from({ length: 12 }, (_, j) => (rasi[planet] + j) % 12);

  const contributorRows = ROW_ORDER.map((c) => [
    c,
    ...signOrder.map((s) => String(marks[c][s])),
    String(sum(marks[c])),
  ]);
  const totalRow = ['Total', ...signOrder.map((s) => String(bindus[s])), String(sum(bindus))];

  return [
    {
      kind: 'table',
      heading: `${planet} Bhinnashtakavarga`,
      columns: ['Sign', ...signOrder.map((s) => String(s + 1)), 'Total'],
      rows: [...contributorRows, totalRow],
      note: 'Each contributor row is the benefic mark (1) of that contributor in each sign, counted from the contributor\'s own rasi '
        + '(BPHS Table-1, Practical Ashtakavarga, Vinay Aditya). The Total row is the bindu count of each sign.',
    },
    {
      kind: 'signGrid',
      heading: `${planet} (bindus)`,
      cells: bindus.map((n) => [String(n)]),
    },
  ];
}

/** Page 14: Bhinnashtakavarga of the Sun, Moon, Mars and Mercury. */
function buildPage14({ name = '', birth }) {
  return withBirth(birth, ({ chart }) => {
    const rasi = rasiPositions(chart);
    const blocks = PAGE_PLANETS.flatMap((planet) => planetBlocks(planet, rasi));
    return {
      title: `ஜாதகம் — ${name}`.trim(),
      subtitle: `${birth.placeName} · ${birth.day} ${MONTH_EN[birth.month - 1]} ${birth.year}`,
      blocks,
    };
  });
}

module.exports = { buildPage14 };
