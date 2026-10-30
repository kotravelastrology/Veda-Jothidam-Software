/**
 * Horoscope book, page 12 (PL9 sample aniruddha_HC4, "Aspects on Planets and Bhavas").
 *
 * Aspects on planets: the aspected grahas (rows) and the aspecting grahas (columns), each cell the slab and the virupa
 * value (BPHS ch.26, see src/chart/aspectTables.js). Aspects on bhavas are given twice, on two bhava conventions: the
 * equal houses (the Ascendant degree and each thirty degrees after it, which agrees with PL9's bhava values on this birth),
 * and the Sripati bhava madhyas that page 3's Bhava chart uses. Both are labelled in the book.
 *
 * The aspecting nodes are not built (BPHS ch.26 gives drishti for the grahas only). Returns a Promise of
 * { title, subtitle, blocks }, in the printSets shape.
 */
const { withBirth, sripatiHouses } = require('./charts');
const { aspectsOnPlanets, aspectsOnBhavas, GRAHAS, SEVEN } = require('../../chart/aspectTables');

const NOT_BUILT = 'கட்டப்படவில்லை';
const NONE = '-';
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
const MONTH_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const norm = (d) => ((d % 360) + 360) % 360;

/** A longitude as PL9 prints it: degrees and minutes, e.g. 167:44. */
function degreeText(lon) {
  const total = Math.round(norm(lon) * 60);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

/** The aspect cell as PL9 prints it: the slab and the value in brackets, or '-'. */
function planetCell(cell) {
  if (cell === null) return NONE;
  return `${cell.fraction} (${cell.virupa})`;
}

/** Page 12: aspects on planets and on bhavas (equal houses and Sripati). */
function buildPage12({ name = '', birth }) {
  return withBirth(birth, ({ chart }) => {
    const longitudes = Object.fromEntries(GRAHAS.map((p) => [p, chart.grahas[p].longitude]));
    const lagna = chart.lagna.longitude;
    const equalPoints = ROMAN.map((_, i) => norm(lagna + 30 * i));
    const sripatiPoints = sripatiHouses(chart).middles;

    const planetRows = aspectsOnPlanets(longitudes).map((row) => [
      row.aspected,
      degreeText(longitudes[row.aspected]),
      ...row.cells.map((cell, i) => (i < SEVEN.length ? planetCell(cell) : NOT_BUILT)),
    ]);
    const bhavaRowsFor = (points) => aspectsOnBhavas(longitudes, points).map((row) => [
      ROMAN[row.house - 1],
      degreeText(points[row.house - 1]),
      ...row.cells.map((value, i) => (i < SEVEN.length ? (value === null ? NONE : String(value)) : NOT_BUILT)),
    ]);
    const columns = ['', 'Degree', ...GRAHAS];

    return {
      title: `ஜாதகம் — ${name}`.trim(),
      subtitle: `${birth.placeName} · ${birth.day} ${MONTH_EN[birth.month - 1]} ${birth.year}`,
      blocks: [
        {
          kind: 'table',
          heading: 'Aspects on Planets',
          columns,
          rows: planetRows,
          note: 'The aspected graha is the row, the aspecting graha the column. Each cell is the slab (1/4, 1/2, 3/4, full) and the '
            + 'value in virupas, from BPHS ch.26 (Santhanam, printed pp.255-258). Mars (4th, 8th), Jupiter (5th, 9th) and Saturn '
            + '(3rd, 10th) have their special aspects, printed as full. Against PL9 on this birth, 60 of 63 cells match; the three exceptions are values PL9 prints on houses where BPHS gives no aspect (Saturn to Mars 5, Moon to Rahu 6, Sun to Ketu 3). The aspecting nodes are not built.',
        },
        {
          kind: 'table',
          heading: 'Aspects on Bhavas (equal houses)',
          columns,
          rows: bhavaRowsFor(equalPoints),
          note: 'Each bhava is a point thirty degrees after the Ascendant (I at the Ascendant, II thirty degrees on, and so on), '
            + 'taken as a planetary degree (BPHS ch.26, the cusp). The values are the virupas from each graha. Against PL9 on this '
            + 'birth, 83 of 84 values match; the Saturn to the seventh bhava is the exception (PL9 59, ours 14): the point lies '
            + 'within 0.1 degree of the 60-degree boundary of Saturn\'s rule, so the two readings can fall either side. The nodes are '
            + 'not built.',
        },
        {
          kind: 'table',
          heading: 'Aspects on Bhavas (Sripati)',
          columns,
          rows: bhavaRowsFor(sripatiPoints),
          note: 'Each bhava is its Sripati bhava madhya, the trisection point that page 3\'s Bhava chart places the bodies by '
            + '(Sripatipaddhati, Adhyaya I). The first is the Ascendant, as in the equal houses; the rest are not thirty degrees '
            + 'apart. The values are the virupas from each graha, by the same BPHS ch.26 rules. PL9 prints the equal-house reading, '
            + 'so this table is not compared with PL9. The nodes are not built.',
        },
      ],
    };
  });
}

module.exports = { buildPage12 };
