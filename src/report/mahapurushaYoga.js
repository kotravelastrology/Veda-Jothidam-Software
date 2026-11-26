/**
 * The Panchamahapurusha yogas as BPHS ch.75 gives them (Santhanam, vol.2, printed pp.924-927; fixture fixtures/yogas/bphs-75.json): Mars, Mercury, Jupiter, Venus or Saturn in
 * its own sign or its sign of exaltation and in a kendra from the Lagna makes Ruchaka, Bhadra, Hamsa, Malavya or Sasa. The chapter asks for nothing more (not the planet's
 * strength, aspects or degree), so nothing more is read; the features the book gives for the native of each yoga are shown for the yogas that hold.
 */
const { EXALTATION, OWN_SIGNS } = require('../chart/shadbala');
const DATA = require('../../fixtures/yogas/bphs-75.json');

const YOGAS = Object.freeze(Object.keys(DATA.yogas));
const KENDRA = Object.freeze([1, 4, 7, 10]);

/** The house (1-12) of sign `to` from sign `from`. */
const houseFrom = (from, to) => ((to - from + 12) % 12) + 1;

/**
 * Each yoga read against `{ signs: { Mars, Mercury, Jupiter, Venus, Saturn: sign index }, lagnaSign }`:
 * [{ yoga, planet, status: 'held' | 'not-held', sign, house, dignity: 'own' | 'exalted' | null }] in the chapter's order.
 */
function evaluate({ signs, lagnaSign }) {
  return YOGAS.map((yoga) => {
    const planet = DATA.yogas[yoga].planet;
    const sign = signs[planet];
    const house = houseFrom(lagnaSign, sign);
    const dignity = OWN_SIGNS[planet].includes(sign) ? 'own' : EXALTATION[planet].sign === sign ? 'exalted' : null;
    return { yoga, planet, status: dignity && KENDRA.includes(house) ? 'held' : 'not-held', sign, house, dignity };
  });
}

module.exports = { DATA, YOGAS, KENDRA, houseFrom, evaluate };
