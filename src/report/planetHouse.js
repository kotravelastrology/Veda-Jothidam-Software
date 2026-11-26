/**
 * What the classical books say of each planet standing in each house from the lagna ("Reports / Interpretations",
 * PL9 gap register group 2). One entry per book, never merged; each cell carries the verse, the printed page and the
 * book's own words summarised (not quoted). Books are listed with the most explained first.
 *
 * Today: Saravali chapter 30 and Brihat Jataka chapter 20 (Sun to Saturn; Rahu and Ketu are in neither).
 * A cell may say `sameAs: <planet>` where the book writes "the rest as for the Sun"; it is resolved to that planet's cell
 * of the same book and marked, never copied into the data.
 */

const SARAVALI = require('../../fixtures/planet-house/saravali.json');
const BRIHAT_JATAKA = require('../../fixtures/planet-house/brihat-jataka.json');

const BOOKS = [SARAVALI, BRIHAT_JATAKA];
const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

/** House (1-12) of a sign counted from the lagna sign. */
const houseOf = (lagnaSign, sign) => ((sign - lagnaSign + 12) % 12) + 1;

/** The text of a cell, following `sameAs` to the other planet's cell of the same book. */
function resolve(book, planet, house, depth = 0) {
  const cell = book.cells[planet]?.[String(house)];
  if (!cell) return null;
  if (!cell.sameAs) return { ta: cell.ta, from: null };
  if (depth > 2) throw new Error(`sameAs loop in ${book.id} ${planet} ${house}`);
  const base = resolve(book, cell.sameAs, house, depth + 1);
  return base ? { ta: base.ta, from: base.from ?? cell.sameAs } : null;
}

/** The books' statements for one planet in one house. */
function readings(planet, house) {
  return BOOKS.flatMap((b) => {
    const cell = b.cells[planet]?.[String(house)];
    const text = cell && resolve(b, planet, house);
    if (!text) return [];
    return [{ bookId: b.id, source: b.source, scope: b.scope, ...cell, ta: text.ta, sameAs: text.from ?? undefined }];
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

module.exports = { BOOKS, PLANETS, houseOf, resolve, readings, planetHouseReadings };
