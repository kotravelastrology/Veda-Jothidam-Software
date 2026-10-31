const { RASI_LORD } = require('./karaka');
const { calculateVargas } = require('./vargaChart');

/**
 * House lordships, the PL9 "Lordships" worksheet (user guide ch.6, "Lordships of Planets"): for each of the twelve houses,
 * the sign it holds, that sign's lord, the house the lord sits in, and an exchange flag. PL9 prints an exchange as an
 * asterisk on both houses ("3 - Me in 4 *": the lord of the 3rd is in the 4th and the lord of the 4th is in the 3rd).
 *
 * Houses are whole-sign from the ascendant's sign, the same as the rest of the chart. Lords use the sign lordship in
 * karaka.js (RASI_LORD, index 0 = Aries).
 */

/**
 * @param {number} lagnaSign sign index (0 = Aries) of the ascendant in the chart being read
 * @param {Record<string, number>} placements sign index of each planet in that chart, keyed by planet name
 * @returns {{house: number, sign: number, lord: string, lordHouse: number, exchange: boolean}[]}
 */
function houseLordships(lagnaSign, placements) {
  const rows = [];
  for (let h = 0; h < 12; h += 1) {
    const sign = (lagnaSign + h) % 12;
    const lord = RASI_LORD[sign];
    if (!Number.isInteger(placements[lord])) throw new RangeError(`no sign given for ${lord}, the lord of sign ${sign}`);
    const lordHouse = ((placements[lord] - lagnaSign + 12) % 12) + 1;
    rows.push({ house: h + 1, sign, lord, lordHouse, exchange: false });
  }
  for (const row of rows) {
    if (row.lordHouse === row.house) continue; // a lord in its own house is not an exchange
    const partner = rows[row.lordHouse - 1];
    if (partner.lordHouse === row.house) row.exchange = true;
  }
  return rows;
}

/**
 * The lordship table for one divisional chart. `key` is a varga key ('D1' for the Rasi, 'D9' Navamsha, 'D10' Dashamsha);
 * the ascendant and the planets are converted with the same varga rule the rest of the app uses.
 *
 * @param {number} lagnaLongitude sidereal longitude of the ascendant
 * @param {Record<string, number>} longitudes sidereal longitude of each planet, keyed by planet name
 * @param {'D1'|'D9'|'D10'} key
 */
function lordshipTable(lagnaLongitude, longitudes, key) {
  const signOf = (lon) => calculateVargas(Math.floor(lon / 30), lon % 30)[key].signIndex;
  const placements = Object.fromEntries(Object.entries(longitudes).map(([planet, lon]) => [planet, signOf(lon)]));
  return houseLordships(signOf(lagnaLongitude), placements);
}

module.exports = { houseLordships, lordshipTable };
