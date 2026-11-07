/**
 * What the classical books say of a person born in each of the 27 stars (the Moon's star at birth), one entry per
 * book, never merged. Brihat Jataka chapter 16 is one line per star; Hora Sara chapter 28 a few sentences. Both are
 * summarised in Tamil, not quoted. Neither book divides the star into quarters.
 */

const BRIHAT_JATAKA = require('../../fixtures/janma-nakshatra/brihat-jataka-16.json');
const HORA_SARA = require('../../fixtures/janma-nakshatra/hora-sara-28.json');

// Most explained first: Hora Sara's paragraphs are longer than Brihat Jataka's lines.
const BOOKS = [HORA_SARA, BRIHAT_JATAKA];
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
