/**
 * Vimshopaka Bala, the twenty-point strength of a planet over a group of divisional charts (BPHS chapter 7 verses
 * 17-27; R. Santhanam's translation, Vol.1 printed pp.95-99, file `Jyotish_BPHS_Santhanam_Vol.1_2 chapters missing.pdf`
 * with PDF page = printed page).
 *
 * Four schemes, each splitting twenty points among its vargas (the Swaviswa): Shadvarga 6, 2, 4, 5, 2, 1 for Rasi, Hora,
 * Drekkana, Navamsa, Dvadasamsa, Trimsamsa; Saptavarga 5, 2, 3, 2½, 4½, 2, 1 for Rasi, Hora, Drekkana, Saptamsa, Navamsa,
 * Dvadasamsa, Trimsamsa; Dasavarga 3 for Rasi, 5 for Shashtiamsa and 1½ for the eight others; Shodasavarga Rasi 3½, Hora 1,
 * Drekkana 1, Shodasamsa 2, Navamsa 3, Trimsamsa 1, Shashtiamsa 4 and ½ for the other nine. In each varga the planet scores
 * the Varga Viswa of its dignity there — own 20, great friend 18, friend 15, equal 10, enemy 7, great enemy 5 — and the planet's
 * strength is the sum of Swaviswa x Varga Viswa / 20. The relation to the varga's lord is the natal compound relationship
 * (Panchadha Maitri) always, as in `saptavargajaBala`.
 *
 * Read: below 5 inauspicious (the good is neutralised), 5-10 some good, 10-15 mediocre, above 15 wholly favourable (v.26-27).
 * The translator's table on p.97 lists the Saptavarga column out of the verse's order (Navamsa 2½, Dvadasamsa 4½, Trimsamsa 2,
 * Saptamsa 1); the verse's order, which is the usual one, is used and the discrepancy is kept in `TABLE_DISCREPANCY`.
 * The translator's eight-grade table on p.101 (Atipoorna … Atiheena) is his own numerical assignment and is given as
 * `translatorGrade`, apart from the sage's reading.
 */

const { calculateVargas } = require('./vargaChart');
const { compoundRelationship } = require('./planetaryRelationship');
const { OWN_SIGNS } = require('./shadbala');
const { RASI_LORD } = require('./karaka');

const SOURCE = Object.freeze({
  title: 'Brihat Parashara Hora Shastra (BPHS)',
  author: 'R. Santhanam (translation)',
  tradition: 'Parashari',
  file: 'Jyotish_BPHS_Santhanam_Vol.1_2 chapters missing.pdf',
  pageLocus: 'Chapter 7 vv.17-27 "Vimsopaka strength", printed pp.95-99: "The full strength … Shadvarga 6, 2, 4, 5, 2 and 1 … declines from 20 to 18 in extreme friend\'s Vargas, to 15 in friendly Vargas, to 10 in equal\'s divisions, to 7 in enemy\'s Vargas and to 5 in sworn enemy\'s Vargas"',
});

const SCHEMES = Object.freeze({
  shadvarga: { nameTa: 'ஷட்வர்க்கம்', weights: { D1: 6, D2: 2, D3: 4, D9: 5, D12: 2, D30: 1 } },
  saptavarga: { nameTa: 'சப்தவர்க்கம்', weights: { D1: 5, D2: 2, D3: 3, D7: 2.5, D9: 4.5, D12: 2, D30: 1 } },
  dasavarga: { nameTa: 'தசவர்க்கம்', weights: { D1: 3, D2: 1.5, D3: 1.5, D7: 1.5, D9: 1.5, D10: 1.5, D12: 1.5, D16: 1.5, D30: 1.5, D60: 5 } },
  shodasavarga: { nameTa: 'ஷோடசவர்க்கம்', weights: { D1: 3.5, D2: 1, D3: 1, D4: 0.5, D7: 0.5, D9: 3, D10: 0.5, D12: 0.5, D16: 2, D20: 0.5, D24: 0.5, D27: 0.5, D30: 1, D40: 0.5, D45: 0.5, D60: 4 } },
});

const VARGA_VISWA = Object.freeze({ own: 20, greatFriend: 18, friend: 15, neutral: 10, enemy: 7, greatEnemy: 5 });
const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

const TABLE_DISCREPANCY = Object.freeze({
  scheme: 'saptavarga',
  verse: { D1: 5, D2: 2, D3: 3, D7: 2.5, D9: 4.5, D12: 2, D30: 1 },
  printedTable: { D1: 5, D2: 2, D3: 3, D9: 2.5, D12: 4.5, D30: 2, D7: 1 },
});

/** The sage's reading of a total (v.26-27). */
function reading(total) {
  if (total < 5) return { id: 'BELOW_5', ta: 'நல்ல பலன் தர இயலாது (நன்மை தணியும்)' };
  if (total < 10) return { id: '5_10', ta: 'சில நன்மைகள்' };
  if (total < 15) return { id: '10_15', ta: 'நடுத்தரப் பலன்' };
  return { id: 'OVER_15', ta: 'முழுவதும் நல்ல பலன்' };
}

/** The translator's eight grades (printed p.101); ranges are his assignment, not the sage's. */
function translatorGrade(total) {
  const grades = [[17.5, 'Atipoorna', 'அதிபூர்ண'], [15, 'Poorna', 'பூர்ண'], [12.5, 'Atimadhya', 'அதிமத்திய'], [10, 'Madhya', 'மத்திய'], [7.5, 'Swalpa', 'ஸ்வல்ப'], [5, 'Atiswalpa', 'அதிஸ்வல்ப'], [2.5, 'Heena', 'ஹீன'], [0, 'Atiheena', 'அதிஹீன']];
  const g = grades.find(([min]) => total >= min);
  return { id: g[1], ta: g[2] };
}

/**
 * Vimshopaka of one planet in one scheme. `rasiPositions` maps the seven planets to their natal sign index; `rasiIndex` and
 * `degreeInSign` place the planet itself.
 */
/**
 * Vimshopaka of one planet in one scheme. `rasiPositions` maps the seven planets to their natal sign index; `rasiIndex` and
 * `degreeInSign` place the planet itself. `method` picks the BPHS reading of the weights:
 *   'bphs-verse'   the weights in the verse order (v.19, Saptavarga 5, 2, 3, 2½, 4½, 2, 1) — the default;
 *   'bphs-printed' the translator's printed table (p.97), which orders Saptavarga as Saptamsa 1, Navamsa 2½,
 *                  Dvadasamsa 4½, Trimsamsa 2.
 * Each varga scores the Varga Viswa of the planet's relation to that varga's lord (vv.26-27).
 */
const METHODS = Object.freeze({
  'bphs-verse': { title: 'BPHS: verse order (default)', schemes: SCHEMES },
  'bphs-printed': {
    title: 'BPHS: translator\'s printed table (p.97)',
    schemes: { ...SCHEMES, saptavarga: { ...SCHEMES.saptavarga, weights: { D1: 5, D2: 2, D3: 3, D7: 1, D9: 2.5, D12: 4.5, D30: 2 } } },
  },
});
const DEFAULT_METHOD = 'bphs-verse';

function vimshopaka(planet, rasiIndex, degreeInSign, rasiPositions, scheme = 'shadvarga', method = DEFAULT_METHOD) {
  const methodDef = METHODS[method];
  if (!methodDef) throw new Error(`unknown method ${method}`);
  const def = methodDef.schemes[scheme];
  if (!def) throw new Error(`unknown scheme ${scheme}`);
  const vargas = calculateVargas(rasiIndex, degreeInSign);
  const rows = Object.entries(def.weights).map(([key, swaviswa]) => {
    const lord = key === 'D2' ? vargas.D2.lord : RASI_LORD[vargas[key].signIndex];
    const sign = key === 'D2' ? null : vargas[key].signIndex;
    const own = lord === planet || (sign !== null && OWN_SIGNS[planet].includes(sign));
    const relation = own ? 'own' : compoundRelationship(planet, lord, rasiPositions);
    const viswa = VARGA_VISWA[relation];
    return { varga: key, sign, lord, relation, swaviswa, viswa, points: (swaviswa * viswa) / 20 };
  });
  const total = rows.reduce((s, r) => s + r.points, 0);
  return { planet, scheme, method, rows, total, reading: reading(total), translatorGrade: translatorGrade(total), source: SOURCE };
}

/** All seven planets in a scheme, from the chart's sign indexes and degrees within the sign. */
function allVimshopaka({ signs, degrees }, scheme = 'shadvarga') {
  const rasiPositions = Object.fromEntries(PLANETS.map((p) => [p, signs[p]]));
  return PLANETS.map((p) => vimshopaka(p, signs[p], degrees[p], rasiPositions, scheme));
}

module.exports = {
  SOURCE, SCHEMES, METHODS, DEFAULT_METHOD, VARGA_VISWA, PLANETS, TABLE_DISCREPANCY, reading, translatorGrade, vimshopaka, allVimshopaka,
};
