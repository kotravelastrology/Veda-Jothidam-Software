/**
 * Horoscope book, page 18 (PL9 sample aniruddha_HC4, "Divisional Charts - Ashtakavarga"): ten divisional charts, each with its
 * Samudaya Ashtakavarga.
 *
 * Each divisional chart places the bodies by their varga sign (vargaSign in charts.js). Its Samudaya Ashtakavarga is the Sarva
 * Ashtakavarga cast on those varga signs: the seven grahas and the Ascendant mark the signs in their varga positions, and each
 * sign's total is the Samudaya bindus for that sign. The Birth chart's Samudaya is the Sarva of page 16.
 *
 * Against PL9 on this birth, all ten Samudaya grids (120 signs) match. The chart labels match except Gulika (Gk) in the
 * Dashamsha and the Shashtiamsha, where the varga sign of Gulika differs; Gulika is not an Ashtakavarga contributor, so the
 * Samudaya grids are not affected. Returns a Promise of { title, subtitle, blocks }, in the printSets shape.
 */
const { withBirth, vargaSign, gridCells } = require('./charts');
const { calculateAshtakavarga, CONTRIBUTORS } = require('../../chart/ashtakavarga');

const MONTH_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// The ten charts in PL9's order. Birth chart is the rasi (no varga key).
const VARGAS = [
  { title: 'Birth chart', key: null },
  { title: 'Hora (wealth)', key: 'D2' },
  { title: 'Dreshkana (happiness, siblings)', key: 'D3' },
  { title: 'Saptamsha (children)', key: 'D7' },
  { title: 'Navamsha (spouse)', key: 'D9' },
  { title: 'Dashamsha (great successes)', key: 'D10' },
  { title: 'Dwadashamsha (parents)', key: 'D12' },
  { title: 'Shodashamsha (conveyances)', key: 'D16' },
  { title: 'Trimshamsha (misfortunes)', key: 'D30' },
  { title: 'Shashtiamsha (all areas)', key: 'D60' },
];

/** Page 18: the divisional charts and their Samudaya Ashtakavarga. */
function buildPage18({ name = '', birth }) {
  return withBirth(birth, ({ chart, bodies }) => {
    const blocks = VARGAS.flatMap(({ title, key }) => {
      const sign = (lon) => (key ? vargaSign(lon, key) : Math.floor(lon / 30));
      const rasi = Object.fromEntries(CONTRIBUTORS.map((c) => [
        c,
        sign(c === 'Lagna' ? chart.lagna.longitude : chart.grahas[c].longitude),
      ]));
      const { sarva } = calculateAshtakavarga(rasi);
      return [
        {
          kind: 'signGrid',
          heading: title,
          cells: gridCells(bodies.map((b) => ({ sign: sign(b.lon), label: b.abbr }))),
        },
        {
          kind: 'signGrid',
          heading: `${title} — Samudaya Ashtakavarga`,
          cells: sarva.map((n) => [String(n)]),
        },
      ];
    });

    return {
      title: `ஜாதகம் — ${name}`.trim(),
      subtitle: `${birth.placeName} · ${birth.day} ${MONTH_EN[birth.month - 1]} ${birth.year}`,
      blocks,
    };
  });
}

module.exports = { buildPage18, VARGAS };
