/**
 * Horoscope book, pages 83-88 (PL9 sample aniruddha_HC4): the Varshaphala (annual) charts, twelve to a page for the completed years 1 to 72. Each is the
 * chart cast for the moment the Sun returns to its birth longitude, with the planets in their signs, the Muntha ("Mun"), and the degrees of the
 * Ascendant and the planets, the year's lord (Varshesha) and the Muntha's sign. The returns and charts are varshaphala.js's (Tajika Bhushana, Ganesha
 * Daivajna, for the Varshesha; the solar return by the Swiss Ephemeris, at the birth place). Each builder returns a Promise of { title, subtitle, blocks }.
 */
const { calculateVarshaphala } = require('../varshaphala');
const { RASI_LORD } = require('../../chart/karaka');

const MONTH_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const ABBR = { Sun: 'Su', Moon: 'Mo', Mars: 'Ma', Mercury: 'Me', Jupiter: 'Ju', Venus: 'Ve', Saturn: 'Sa', Rahu: 'Ra', Ketu: 'Ke' };
const pad = (n) => String(n).padStart(2, '0');
const mm = (deg) => `${pad(Math.floor(deg))}:${pad(Math.floor((deg % 1) * 60))}`;

function chartCard(birth, age) {
  const v = calculateVarshaphala(birth, age);
  const c = v.varshaChart;
  const cells = Array.from({ length: 12 }, () => []);
  cells[c.lagna.rasiIndex].push('As');
  for (const [name, g] of Object.entries(c.grahas)) cells[g.rasiIndex].push(ABBR[name]);
  cells[v.muntha.rasiIndex].push('Mun');
  const [y, m, d] = v.solarReturn.date.split('-').map(Number);
  const deg = (n) => mm(c.grahas[n].degreeInSign);
  const rows = [
    ['As', mm(c.lagna.degreeInSign), 'Ma', deg('Mars'), 'Ve', deg('Venus')],
    ['Su', deg('Sun'), 'Me', deg('Mercury'), 'Sa', deg('Saturn')],
    ['Mo', deg('Moon'), 'Ju', deg('Jupiter'), 'Ra', deg('Rahu')],
    ['YL', v.varshesha, 'Mun', v.muntha.rasi, '', ''],
  ];
  return {
    kind: 'chartCard', tile: true,
    heading: `Completed: ${age} year${age === 1 ? '' : 's'} — ${d} ${MONTH_EN[m - 1]} ${y} ${v.solarReturn.time} hrs.`,
    cells,
    columns: ['', '', '', '', '', ''],
    rows,
  };
}

/** Page 83 + part: the charts for ages 12 * part + 1 to 12 * part + 12. */
async function buildVarshaCharts({ name = '', birth, part }) {
  const blocks = [];
  for (let age = part * 12 + 1; age <= part * 12 + 12; age += 1) blocks.push(chartCard(birth, age));
  return {
    title: `ஜாதகம் — ${name}`.trim(),
    subtitle: `${birth.placeName} · ${birth.day} ${MONTH_EN[birth.month - 1]} ${birth.year}`,
    blocks: [{ kind: 'text', heading: `Varshaphala Charts #${part + 1}`, text: `Annual charts for the completed years ${part * 12 + 1} to ${part * 12 + 12}: the Sun's return to its birth longitude, cast at the birth place. YL is the lord of the year (Varshesha), Mun the Muntha.` }, ...blocks],
  };
}

module.exports = { buildVarshaCharts };
