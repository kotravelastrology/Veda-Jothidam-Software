/**
 * What the classical books say of the lord of each house standing in each house ("Bhavesh" reports, PL9 gap register
 * group 2). One entry per book, never merged; each cell carries the verse, the printed page and the book's own words
 * summarised, not quoted.
 *
 * Today: BPHS chapter 24 (all twelve lords in all twelve houses, verses 1-144). Scorpio's lord is taken as Mars and
 * Aquarius's as Saturn, as in the book; Rahu and Ketu are not house lords.
 */

const BPHS_24 = require('../../fixtures/bhavesh/bphs-24.json');

const BOOKS = [BPHS_24];
const SIGN_LORD = Object.freeze(['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter']);

const houseOf = (lagnaSign, sign) => ((sign - lagnaSign + 12) % 12) + 1;

/** The books' statements for the lord of house `lord` standing in house `house`. */
function readings(lord, house) {
  return BOOKS.flatMap((b) => {
    const cell = b.cells[String(lord)]?.[String(house)];
    return cell ? [{ bookId: b.id, source: b.source, scope: b.scope, ...cell }] : [];
  });
}

/**
 * For a chart: for each house 1-12, its sign, its lord, the house the lord stands in, and what each book says.
 * `signs` maps planet names to sign indexes (0 = Aries).
 */
function bhaveshReadings({ lagnaSign, signs }) {
  return Array.from({ length: 12 }, (_, i) => {
    const bhava = i + 1;
    const sign = (lagnaSign + i) % 12;
    const lord = SIGN_LORD[sign];
    const lordHouse = houseOf(lagnaSign, signs[lord]);
    return { bhava, sign, lord, lordSign: signs[lord], lordHouse, readings: readings(bhava, lordHouse) };
  });
}

module.exports = { BOOKS, SIGN_LORD, houseOf, readings, bhaveshReadings };
