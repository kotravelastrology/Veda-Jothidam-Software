/**
 * Horoscope book, pages 14 and 15 (PL9 sample aniruddha_HC4, "Ashtakavarga - Bhinnashtakavarga #1" and "#2").
 *
 * Page 14 has the Bhinnashtakavarga of the Sun, Moon, Mars and Mercury; page 15 of Jupiter, Venus, Saturn and the Lagna.
 * Each planet has its contributor table: the benefic mark (1) of each of the eight contributors in each sign, with the row
 * and sign totals, and its bindu count per sign in the chart layout. The signs run from the planet's own sign, as PL9 prints
 * them.
 *
 * The seven planets' marks are the Table-1 of Practical Ashtakavarga (src/chart/ashtakavarga.js, BINDU_TABLE). The Lagna's
 * marks are C.S. Patel's Lagna Ashtakavarga (LAGNA_PLACES), which is not part of the 337 total.
 *
 * Returns a Promise of { title, subtitle, blocks }, in the printSets shape.
 */
const { withBirth } = require('./charts');
const {
  contributionMatrix, calculateBhinnashtakavarga, LAGNA_PLACES, CONTRIBUTORS,
} = require('../../chart/ashtakavarga');

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

/** The contributor table and the chart of one planet's Bhinnashtakavarga (the Lagna's uses Patel's table). */
function planetBlocks(planet, rasi) {
  const isLagna = planet === 'Lagna';
  const places = isLagna ? LAGNA_PLACES : undefined;
  const marks = contributionMatrix(planet, rasi, places);
  const bindus = calculateBhinnashtakavarga(planet, rasi, places);
  const signOrder = Array.from({ length: 12 }, (_, j) => (rasi[planet] + j) % 12);

  const contributorRows = ROW_ORDER.map((c) => [
    c,
    ...signOrder.map((s) => String(marks[c][s])),
    String(sum(marks[c])),
  ]);
  const totalRow = ['Total', ...signOrder.map((s) => String(bindus[s])), String(sum(bindus))];

  const note = isLagna
    ? 'The Lagna\'s marks are C.S. Patel\'s Lagna Ashtakavarga (Jyotish Ashtakavarga, 1957 ed., printed p.34). It is not part '
      + 'of the 337 total, and Patel uses it only for Ayurdaya.'
    : 'Each contributor row is the benefic mark (1) of that contributor in each sign, counted from the contributor\'s own rasi '
      + '(BPHS Table-1, Practical Ashtakavarga, Vinay Aditya). The Total row is the bindu count of each sign.';

  return [
    {
      kind: 'table',
      heading: `${planet} Bhinnashtakavarga`,
      columns: ['Sign', ...signOrder.map((s) => String(s + 1)), 'Total'],
      rows: [...contributorRows, totalRow],
      note,
    },
    {
      kind: 'signGrid',
      heading: `${planet} (bindus)`,
      cells: bindus.map((n) => [String(n)]),
    },
  ];
}

/** A page of Bhinnashtakavarga tables, one planet after another. */
function bhinnaPage(planets) {
  return function build({ name = '', birth }) {
    return withBirth(birth, ({ chart }) => {
      const rasi = rasiPositions(chart);
      const blocks = planets.flatMap((planet) => planetBlocks(planet, rasi));
      return {
        title: `ஜாதகம் — ${name}`.trim(),
        subtitle: `${birth.placeName} · ${birth.day} ${MONTH_EN[birth.month - 1]} ${birth.year}`,
        blocks,
      };
    });
  };
}

/** Page 14: Bhinnashtakavarga of the Sun, Moon, Mars and Mercury. */
const buildPage14 = bhinnaPage(['Sun', 'Moon', 'Mars', 'Mercury']);

/** Page 15: Bhinnashtakavarga of Jupiter, Venus, Saturn and the Lagna. */
const buildPage15 = bhinnaPage(['Jupiter', 'Venus', 'Saturn', 'Lagna']);

module.exports = { buildPage14, buildPage15 };
