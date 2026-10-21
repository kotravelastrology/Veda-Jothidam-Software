/**
 * What the classical books say of each planet standing in each house from the lagna ("Reports / Interpretations",
 * PL9 gap register group 2). One entry per book, never merged; each cell carries the verse, the printed page and the
 * book's own words summarised (not quoted). Books are listed with the most explained first.
 *
 * Today: Saravali chapter 30 (Sun to Saturn; Rahu and Ketu are not in the chapter).
 */

const SARAVALI = require('../../fixtures/planet-house/saravali.json');

const BOOKS = [SARAVALI];
const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

/** House (1-12) of a sign counted from the lagna sign. */
const houseOf = (lagnaSign, sign) => ((sign - lagnaSign + 12) % 12) + 1;

/** The books' statements for one planet in one house. */
function readings(planet, house) {
  return BOOKS.flatMap((b) => {
    const cell = b.cells[planet]?.[String(house)];
    return cell ? [{ bookId: b.id, source: b.source, scope: b.scope, ...cell }] : [];
  });
}

/**
 * For a chart: each planet's house and what each book says. `signs` maps planet names to sign indexes (0 = Aries).
 * Rahu and Ketu come back with their house and no readings, stated plainly.
 */
function planetHouseReadings({ lagnaSign, signs }) {
  return ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'].map((planet) => {
    const house = houseOf(lagnaSign, signs[planet]);
    return { planet, sign: signs[planet], house, readings: PLANETS.includes(planet) ? readings(planet, house) : [] };
  });
}

module.exports = { BOOKS, PLANETS, houseOf, readings, planetHouseReadings };
