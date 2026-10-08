/**
 * சந்திர கோசார பலன் + வேதை (Chandra Gochara Phala + Vedha) — the present
 * moment only, for the report and the answer engine.
 *
 * Until 2026-10-06 this module carried its own copy of the tables, ported from
 * the prior AstrologicLab code with a citation (Phaladeepika 26.3-8) whose page
 * was never seen; no translation of that chapter is in the library. The tables
 * are now read from `gocharaVedhaTables.js`, where five books are compared
 * page by page, and the method is the default there — Pulippani, *Gochar
 * Phaladeepika* ch.22, printed pp.204-206. Two things changed as a result, both
 * the book's: Rahu and Ketu are good in the 10th (with no vedha house), and the
 * Sun causes Venus no vedha. Vipareetha vedha is reported alongside.
 *
 * Dated windows for every planet, and the other book, are on /gochara-vedha
 * (`gocharaVedha.js`).
 */
const V = require('./gocharaVedhaTables');

const GOCHARA_GRAHAS = V.PLANETS_9;
const SOURCE_LABEL = 'Pulippani, Gochar Phaladeepika ch.22, printed pp.204-206';

function methodTables(methodId = V.DEFAULT_VEDHA_METHOD) {
  const m = V.VEDHA_METHODS[methodId];
  if (!m) throw new RangeError(`unknown vedha method: ${methodId}`);
  return m;
}

/** Good houses per planet under the default book (kept as an export for callers that list them). */
const GOCHARA_BENEFIC = Object.freeze(Object.fromEntries(GOCHARA_GRAHAS.map((g) => [g, [...methodTables().table[g].good]])));
/** Good house → vedha house per planet under the default book. */
const GOCHARA_VEDHA = Object.freeze(Object.fromEntries(GOCHARA_GRAHAS.map((g) => [g, { ...methodTables().table[g].vedhaOf }])));

/**
 * @param moonRasi0  natal Moon's rasi index (0-11)
 * @param transitRasiByGraha  { graha : current rasi index 0-11 } for the 9 grahas
 * @param methodId  'PULIPPANI' (default), 'SANTHANAM' or 'VISHNU_BHASKAR'
 */
function computeGocharaPhala(moonRasi0, transitRasiByGraha, methodId) {
  const m = methodTables(methodId);
  const norm = (n) => ((n % 12) + 12) % 12;
  const houseOf = (r0) => norm(r0 - moonRasi0) + 1;
  const othersIn = (graha, house, exemptList) => GOCHARA_GRAHAS.filter((other) => {
    if (other === graha || (exemptList[graha] ?? []).includes(other)) return false;
    // Rahu and Ketu always stand opposite; no book says they obstruct each other.
    if ((graha === 'Rahu' && other === 'Ketu') || (graha === 'Ketu' && other === 'Rahu')) return false;
    const r = transitRasiByGraha[other];
    return r !== undefined && houseOf(norm(r)) === house;
  });

  return GOCHARA_GRAHAS
    .filter((g) => transitRasiByGraha[g] !== undefined)
    .map((graha) => {
      const row = m.table[graha];
      const houseFromMoon = houseOf(norm(transitRasiByGraha[graha]));
      if (row.notCovered) {
        return {
          graha, houseFromMoon, isBenefic: false, vedhaHouse: 0, obstructedBy: [],
          vipareetaHouse: 0, vipareetaHouses: [], relievedBy: [], verdict: 'notCovered', source: SOURCE_LABEL,
        };
      }
      const isBenefic = row.good.includes(houseFromMoon);
      if (!isBenefic) {
        const vipareetaHouses = row.relievedBy[houseFromMoon] ?? [];
        const relievedBy = [...new Set(vipareetaHouses.flatMap((h) => othersIn(graha, h, m.exempt.vipareeta)))];
        return {
          graha, houseFromMoon, isBenefic: false, vedhaHouse: 0, obstructedBy: [],
          vipareetaHouse: vipareetaHouses[0] ?? 0, vipareetaHouses, relievedBy, verdict: 'neutral', source: SOURCE_LABEL,
        };
      }
      const vedhaHouse = row.vedhaOf[houseFromMoon] ?? 0;
      const obstructedBy = vedhaHouse ? othersIn(graha, vedhaHouse, m.exempt.gochara) : [];
      return {
        graha, houseFromMoon, isBenefic: true, vedhaHouse, obstructedBy,
        vipareetaHouse: 0, vipareetaHouses: [], relievedBy: [],
        verdict: obstructedBy.length > 0 ? 'vedha' : 'benefic', source: SOURCE_LABEL,
      };
    });
}

module.exports = { computeGocharaPhala, GOCHARA_BENEFIC, GOCHARA_VEDHA, GOCHARA_GRAHAS, SOURCE_LABEL };
