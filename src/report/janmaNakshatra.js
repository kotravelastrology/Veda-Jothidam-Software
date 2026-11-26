/**
 * What the classical books say of a person born in each of the 27 stars (the Moon's star at birth), one entry per
 * book, never merged. Brihat Jataka chapter 16 is one line per star; Hora Sara chapter 28 a few sentences; Maansagari
 * chapter 1 (Vol.1, printed pp.62-73) and Jatakabharanam chapter 8 (printed pp.64-107) one verse per star. All are
 * summarised in Tamil, not quoted. No book divides the star into quarters in the statement itself.
 */

const BRIHAT_JATAKA = require('../../fixtures/janma-nakshatra/brihat-jataka-16.json');
const HORA_SARA = require('../../fixtures/janma-nakshatra/hora-sara-28.json');
const MANSAGARI = require('../../fixtures/janma-nakshatra/mansagari-1.json');
const JATAKABHARANAM = require('../../fixtures/janma-nakshatra/jatakabharanam-8.json');

// Most explained first (by the words of the summaries): Jatakabharanam's verses (369 words), Hora Sara's paragraphs (352), Maansagari's verses (270), Brihat Jataka's lines (204).
const BOOKS = [JATAKABHARANAM, HORA_SARA, MANSAGARI, BRIHAT_JATAKA];
const STAR_SPAN = 360 / 27;

/** Star number 1-27 (Ashwini = 1) of a sidereal longitude. */
const starOf = (longitude) => Math.floor((((longitude % 360) + 360) % 360) / STAR_SPAN) + 1;

/** Each book's statement for a star. */
function readings(star) {
  return BOOKS.flatMap((b) => {
    const cell = b.cells[String(star)];
    return cell ? [{ bookId: b.id, source: b.source, scope: b.scope, ...cell }] : [];
  });
}

/** The Moon's star at birth and what each book says of it. */
function janmaNakshatra(moonLongitude) {
  const star = starOf(moonLongitude);
  const pada = Math.floor(((((moonLongitude % 360) + 360) % 360) % STAR_SPAN) / (STAR_SPAN / 4)) + 1;
  return { star, pada, readings: readings(star) };
}

module.exports = { BOOKS, STAR_SPAN, starOf, readings, janmaNakshatra };
