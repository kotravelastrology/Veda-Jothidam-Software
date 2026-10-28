/**
 * Nature and temperament from the lagna lord (PL9 gap register, group 2, worksheet 039).
 *
 * The lagna lord standing in the lagna is the 1st-house entry of T.M. Rao's Bhrigu Samhita for the lagna's own
 * lord: `Venus in the 1st House (Libra)` is the Libra lagna's lord in the lagna. The entries themselves are in
 * `bhriguFirstHouse.js`; this file picks the lord of each lagna from the own-sign table and adds the citation.
 */

const { FIRST_HOUSE } = require('./bhriguFirstHouse');
const { citeTa } = require('../sources/citeTa');
const { OWN_SIGNS } = require('../chart/shadbala');

const LAGNA_PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

/** The twelve rasis in order, 0 Aries .. 11 Pisces. */
const RASI_ORDER = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

/** The lord of a rasi: the one of the seven planets whose own-sign table holds it. */
function lordOf(rasiIndex) {
  const lord = LAGNA_PLANETS.find((p) => OWN_SIGNS[p].includes(rasiIndex));
  if (!lord) throw new Error(`no lord for rasi index ${rasiIndex}`);
  return lord;
}

/**
 * The lagna lord's entry for a lagna rasi.
 * @param lagnaRasiIndex 0 Aries .. 11 Pisces
 * @returns {{ sign, planet, page, en, ta, citation }}
 */
function lagnaLordInLagna(lagnaRasiIndex) {
  if (!Number.isInteger(lagnaRasiIndex) || lagnaRasiIndex < 0 || lagnaRasiIndex > 11) {
    throw new Error(`lagna rasi index out of range: ${lagnaRasiIndex}`);
  }
  const sign = RASI_ORDER[lagnaRasiIndex];
  const planet = lordOf(lagnaRasiIndex);
  const entry = FIRST_HOUSE.find((e) => e.sign === sign && e.planet === planet);
  if (!entry) throw new Error(`no entry for ${planet} in ${sign}`);
  return {
    ...entry,
    citation: citeTa({ title: 'Bhrigu Samhita', author: 'T.M. Rao', pageLocus: `printed p.${entry.page}` }),
  };
}

module.exports = { lagnaLordInLagna, RASI_ORDER };
