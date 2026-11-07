/**
 * Horoscope book, page 12 (PL9 sample aniruddha_HC4, "Aspects on Planets and Bhavas").
 *
 * Aspects on planets: the aspected grahas (rows) and the aspecting grahas (columns), each cell the slab and the virupa
 * value (BPHS ch.26, see src/chart/aspectTables.js). Aspects on bhavas are given twice, on two bhava conventions: the
 * equal houses (the Ascendant degree and each thirty degrees after it, which agrees with PL9's bhava values on this birth),
 * and the Sripati bhava madhyas that page 3's Bhava chart uses. Both are labelled in the book.
 *
 * The aspecting nodes aspect as Jupiter does (aspectTables.js), as Parashara's Light prints. Returns a Promise of
 * { title, subtitle, blocks }, in the printSets shape.
 */
const { withBirth, sripatiHouses } = require('./charts');
const { aspectsOnPlanets, aspectsOnBhavas, GRAHAS } = require('../../chart/aspectTables');

const NONE = '-';
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
const MONTH_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const norm = (d) => ((d % 360) + 360) % 360;

/** A longitude as PL9 prints it: degrees and minutes, e.g. 167:44. */
function degreeText(lon) {
  const total = Math.floor(norm(lon) * 60 + 1e-6); // PL9 cuts the seconds off (27:28:58 is 27:28)
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
      ...row.cells.map((cell) => planetCell(cell)),
    ]);
    const bhavaRowsFor = (points) => aspectsOnBhavas(longitudes, points).map((row) => [
      ROMAN[row.house - 1],
      degreeText(points[row.house - 1]),
      ...row.cells.map((value) => (value === null ? NONE : String(value))),
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
          note: `The aspected graha is the row, the aspecting graha the column. Each cell is the slab (1/4, 1/2, 3/4, full) and the `
            + `value in virupas, from BPHS ch.26 (Santhanam, printed pp.255-258); a point off the slab houses has its angular value under a dash. Mars (4th, 8th), `
            + `Jupiter (5th, 9th) and Saturn (3rd, 10th) have their special aspects, printed as full; Rahu and Ketu aspect as Jupiter does, which is how Parashara's `
            + `Light prints them. Against PL9 (Arjun, 12 May 1983) every cell agrees but one: Saturn's 3rd on Ketu at 57.3 degrees, PL9 54 and ours 13.`,
        },
        {
          kind: 'table',
          heading: 'Aspects on Bhavas (equal houses)',
          columns,
          rows: bhavaRowsFor(equalPoints),
          note: `Each bhava is a point thirty degrees after the Ascendant (I at the Ascendant, II thirty degrees on, and so on), `
            + `taken as a planetary degree (BPHS ch.26, the cusp). The values are the virupas from each graha, the nodes as Jupiter. They are the values PL9 prints `
            + `(its Bhava Degree column prints the first point of each sign, 150:00 for a Virgo ascendant, but its values are these points' — Arjun's and the `
            + `aniruddha sample's every cell agree but the Saturn to the seventh bhava of the sample, the point lying within 0.1 degree of the 60-degree boundary).`,
        },
        {
          kind: 'table',
          heading: 'Aspects on Bhavas (Sripati)',
          columns,
          rows: bhavaRowsFor(sripatiPoints),
          note: `Each bhava is its Sripati bhava madhya, the trisection point that page 3's Bhava chart places the bodies by `
            + `(Sripatipaddhati, Adhyaya I). The first is the Ascendant, as in the equal houses; the rest are not thirty degrees `
            + `apart. The values are the virupas from each graha, by the same rules. PL9 prints the equal-house reading, so this table is not compared with PL9.`,
        },
      ],
    };
  });
}

module.exports = { buildPage12 };
