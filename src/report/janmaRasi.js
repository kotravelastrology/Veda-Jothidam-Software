/**
 * What the classical books say of a person whose Moon is in each of the twelve signs at birth (body and nature), one
 * entry per book, never merged. Hora Sara chapter 29 and Brihat Jataka chapter 17, both summarised in Tamil.
 * Each book adds a condition, kept in its `scope`: Hora Sara — the results hold when no planet joins or aspects the Moon
 * sign, else that planet's results come; Brihat Jataka — the results come fully only if the sign, its lord and the Moon
 * are strong.
 */

const HORA_SARA = require('../../fixtures/janma-rasi/hora-sara-29.json');
const BRIHAT_JATAKA = require('../../fixtures/janma-rasi/brihat-jataka-17.json');

const BOOKS = [HORA_SARA, BRIHAT_JATAKA];

/** The books' statements for the Moon in a sign (0 = Aries). */
function readings(sign) {
  return BOOKS.flatMap((b) => {
    const cell = b.cells[String(sign + 1)];
    return cell ? [{ bookId: b.id, source: b.source, scope: b.scope, ...cell }] : [];
  });
}

/** Planets other than the Moon in the Moon's sign (the condition Hora Sara names). */
const joiners = (signs) => Object.keys(signs).filter((p) => p !== 'Moon' && signs[p] === signs.Moon);

function janmaRasi(signs) {
  return { sign: signs.Moon, joined: joiners(signs), readings: readings(signs.Moon) };
}

module.exports = { BOOKS, readings, joiners, janmaRasi };
