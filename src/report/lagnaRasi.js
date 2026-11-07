/**
 * What the classical books say of a person born with each of the twelve signs rising (the lagna): body, nature and
 * life, one entry per book, never merged. Today: Saravali chapter 48 (written for tracing a lost horoscope; the book
 * says its rules serve known horoscopes too). Summarised in Tamil, not quoted.
 */

const SARAVALI_48 = require('../../fixtures/lagna-rasi/saravali-48.json');

const BOOKS = [SARAVALI_48];

/** The books' statements for a rising sign (0 = Aries). */
function readings(sign) {
  return BOOKS.flatMap((b) => {
    const cell = b.cells[String(sign + 1)];
    return cell ? [{ bookId: b.id, source: b.source, scope: b.scope, ...cell }] : [];
  });
}

module.exports = { BOOKS, readings };
