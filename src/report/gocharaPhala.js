/**
 * சந்திர கோசார பலன் + வேதை (Chandra Gochara Phala + Vedha).
 *
 * Ported verbatim (benefic-house lists, Vedha pairs, father/son exemptions)
 * from the prior AstrologicLab `src/lib/gocharaPhala.ts`. Source: Mantreśvara,
 * *Phaladeepika* Adhyāya 26 ślokas 3-8 (V. Subrahmanya Sastri) — the benefic
 * transit houses counted from the natal Moon and the paired Vedha
 * (obstruction) house for each graha, plus the Sun↔Saturn and Moon↔Mercury
 * non-mutual-Vedha exceptions.
 */
const GOCHARA_GRAHAS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

const GOCHARA_BENEFIC = {
  Sun: [3, 6, 10, 11],
  Moon: [1, 3, 6, 7, 10, 11],
  Mars: [3, 6, 11],
  Mercury: [2, 4, 6, 8, 10, 11],
  Jupiter: [2, 5, 7, 9, 11],
  Venus: [1, 2, 3, 4, 5, 8, 9, 11, 12],
  Saturn: [3, 6, 11],
  Rahu: [3, 6, 11],
  Ketu: [3, 6, 11],
};

const GOCHARA_VEDHA = {
  Sun: { 3: 9, 6: 12, 10: 4, 11: 5 },
  Moon: { 1: 5, 3: 9, 6: 12, 7: 2, 10: 4, 11: 8 },
  Mars: { 3: 12, 6: 9, 11: 5 },
  Mercury: { 2: 5, 4: 3, 6: 9, 8: 1, 10: 8, 11: 12 },
  Jupiter: { 2: 12, 5: 4, 7: 3, 9: 10, 11: 8 },
  Venus: { 1: 8, 2: 7, 3: 1, 4: 10, 5: 9, 8: 5, 9: 11, 11: 3, 12: 6 },
  Saturn: { 3: 12, 6: 9, 11: 5 },
  Rahu: { 3: 12, 6: 9, 11: 5 },
  Ketu: { 3: 12, 6: 9, 11: 5 },
};

const GOCHARA_VEDHA_EXEMPT = { Sun: 'Saturn', Saturn: 'Sun', Moon: 'Mercury', Mercury: 'Moon' };

/**
 * @param moonRasi0  natal Moon's rasi index (0-11)
 * @param transitRasiByGraha  { graha : current rasi index 0-11 } for the 9 grahas
 */
function computeGocharaPhala(moonRasi0, transitRasiByGraha) {
  const norm = (n) => ((n % 12) + 12) % 12;
  const houseOf = (r0) => norm(r0 - moonRasi0) + 1;

  return GOCHARA_GRAHAS
    .filter((g) => transitRasiByGraha[g] !== undefined)
    .map((graha) => {
      const houseFromMoon = houseOf(norm(transitRasiByGraha[graha]));
      const isBenefic = (GOCHARA_BENEFIC[graha] || []).includes(houseFromMoon);
      if (!isBenefic) {
        return { graha, houseFromMoon, isBenefic: false, vedhaHouse: 0, obstructedBy: [], verdict: 'neutral' };
      }
      const vedhaHouse = GOCHARA_VEDHA[graha][houseFromMoon];
      const exempt = GOCHARA_VEDHA_EXEMPT[graha];
      const obstructedBy = GOCHARA_GRAHAS.filter((other) => {
        if (other === graha || other === exempt) return false;
        const r = transitRasiByGraha[other];
        if (r === undefined) return false;
        return houseOf(norm(r)) === vedhaHouse;
      });
      return {
        graha, houseFromMoon, isBenefic: true, vedhaHouse, obstructedBy,
        verdict: obstructedBy.length > 0 ? 'vedha' : 'benefic',
      };
    });
}

module.exports = { computeGocharaPhala, GOCHARA_BENEFIC, GOCHARA_VEDHA, GOCHARA_GRAHAS };
