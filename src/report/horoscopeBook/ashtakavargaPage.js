/**
 * Horoscope book, pages 14 to 16 (PL9 sample aniruddha_HC4, "Ashtakavarga - Bhinnashtakavarga #1", "#2" and "Sarvashtaka &
 * Chancha Chakra").
 *
 * Page 14 has the Bhinnashtakavarga of the Sun, Moon, Mars and Mercury; page 15 of Jupiter, Venus, Saturn and the Lagna.
 * Page 16 has the Sarvashtakavarga (the seven planets' bindus by sign, 337 in all) and the Sarva Chancha Chakra.
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
  contributionMatrix, calculateBhinnashtakavarga, calculateAshtakavarga, kakshaMarks, LAGNA_PLACES, CONTRIBUTORS,
} = require('../../chart/ashtakavarga');

// The row order PL9 prints the contributors in.
const ROW_ORDER = ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Lagna'];
// The seven planets in the order PL9 prints them on page 16.
const SEVEN_PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
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

/**
 * Page 16: the Sarvashtakavarga (the seven planets' bindus by sign, summed by sign, with the Lagna's row above them as PL9
 * prints it) and the Sarva Chancha Chakra as a table of kaksha marks.
 */
function buildPage16({ name = '', birth }) {
  return withBirth(birth, ({ chart }) => {
    const rasi = rasiPositions(chart);
    const { bhinna, sarva } = calculateAshtakavarga(rasi);
    const lagna = calculateBhinnashtakavarga('Lagna', rasi, LAGNA_PLACES);
    const signColumns = Array.from({ length: 12 }, (_, i) => String(i + 1));
    const rowOf = (label, values) => [label, ...values.map(String), String(sum(values))];

    const sarvashtaka = {
      kind: 'table',
      heading: 'Sarvashtakavarga',
      columns: ['Sign', ...signColumns, 'Total'],
      rows: [
        rowOf('Lagna', lagna),
        ...SEVEN_PLANETS.map((p) => rowOf(p, bhinna[p])),
        rowOf('Sarva', sarva),
      ],
      note: 'The seven planets\' bindus summed by sign (Sarva, 337 in all). The Lagna row is C.S. Patel\'s Lagna Ashtakavarga, '
        + 'printed as PL9 prints it; it is not part of the Sarva total.',
    };
    const chart4x4 = {
      kind: 'signGrid',
      heading: 'Sarvashtakavarga',
      cells: sarva.map((n) => [String(n)]),
    };
    const chakra = {
      kind: 'table',
      heading: 'Sarva Chancha Chakra',
      columns: ['Planet', ...signColumns],
      rows: [
        ...SEVEN_PLANETS.map((p) => [p, ...kakshaMarks(p, rasi)]),
        ['Sarva', ...sarva.map(String)],
      ],
      note: 'The wheel as a table: for each planet and sign, its eight kakshas in the order Sa Ju Ma Su Ve Me Mo As (the edge of '
        + 'PL9\'s wheel). A 1 is a kaksha whose lord marks that sign in the planet\'s Bhinnashtakavarga, so the count of 1s is the '
        + 'bindu count PL9 prints in the wheel. The dot positions on the wheel itself are not drawn.',
    };

    return {
      title: `ஜாதகம் — ${name}`.trim(),
      subtitle: `${birth.placeName} · ${birth.day} ${MONTH_EN[birth.month - 1]} ${birth.year}`,
      blocks: [sarvashtaka, chart4x4, chakra],
    };
  });
}

module.exports = { buildPage14, buildPage15, buildPage16 };
