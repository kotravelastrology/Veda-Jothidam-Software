/**
 * Horoscope book, page 4 (PL9 sample aniruddha_HC4, "Sudarshan Chakra"): the comparative positions of the planets in the Sun chart (outer ring),
 * the Moon chart (middle) and the birth chart (inner), each counted from its own reference sign: the Sun's sign, the Moon's sign, the Ascendant.
 * To study a house, all three are read together. The positions are the birth chart's (parashariChart.js); nothing else is calculated.
 * The builder returns a Promise of { title, subtitle, blocks } with one 'sudarshana' block.
 */
const { withBirth } = require('./charts');

const MONTH_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const ABBR = { Sun: 'Su', Moon: 'Mo', Mars: 'Ma', Mercury: 'Me', Jupiter: 'Ju', Venus: 'Ve', Saturn: 'Sa', Rahu: 'Ra', Ketu: 'Ke' };

async function buildSudarshana({ name = '', birth }) {
  return withBirth(birth, ({ chart, gulika }) => {
    const bodies = [['As', chart.lagna.rasiIndex], ...Object.keys(ABBR).map((p) => [ABBR[p], chart.grahas[p].rasiIndex]), ['Gk', gulika.rasiIndex]];
    const ring = (label, refSign) => ({
      label,
      houses: Array.from({ length: 12 }, (_, h) => bodies.filter(([, sign]) => sign === (refSign + h) % 12).map(([mark]) => mark)),
    });
    return {
      title: `ஜாதகம் — ${name}`.trim(),
      subtitle: `${birth.placeName} · ${birth.day} ${MONTH_EN[birth.month - 1]} ${birth.year}`,
      blocks: [
        {
          kind: 'sudarshana',
          heading: 'Sudarshan Chakra',
          rings: [ring('Surya (Sun chart)', chart.grahas.Sun.rasiIndex), ring('Chandra (Moon chart)', chart.grahas.Moon.rasiIndex), ring('Lagna (Birth chart)', chart.lagna.rasiIndex)],
          note: 'Outer circle: Surya chart · Middle circle: Chandra chart · Inner circle: Birth chart. Sudarshan Chakra shows the comparative positions of the planets in the Sun chart, the Moon chart and the birth chart together, from outer to inner circle respectively. To study a house, consider the signs in all the three charts simultaneously.',
        },
      ],
    };
  });
}

module.exports = { buildSudarshana };
