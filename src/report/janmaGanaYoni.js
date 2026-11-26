/**
 * What Maansagari (Vol.1, chapter 1, printed pp.85-91) says of a person of the birth star's gana (Deva, Manushya or Rakshasa) and yoni (one of
 * fourteen animals). The gana and the yoni of each star are the software's own tables (ashtakootaTables.js, the ones page 1 prints); the book's
 * own lists of the stars of each (Table-3 on p.85 and Table-3A on p.87) are kept in the fixture and agree with them, which test-janma-gana-yoni.js
 * checks. The statements are summarised in Tamil, not quoted.
 */
const BOOK = require('../../fixtures/janma-nakshatra/mansagari-1-gana-yoni.json');
const T = require('./ashtakootaTables');

/**
 * The gana and the yoni of a star and what the book says of each.
 * @param star 1 (Ashwini) to 27 (Revati)
 * @returns {{ star: number, gana: object, yoni: object, source: object }} gana and yoni: { index, nameTa, key, bookName, verses, page, pageEnd?, ta, note? }
 */
function ganaYoniOf(star) {
  const g = T.GANA_OF_STAR[star - 1];
  const y = T.YONI_OF_STAR[star - 1];
  return {
    star,
    gana: { index: g, nameTa: T.GANA_TA[g], ...BOOK.gana[g] },
    yoni: { index: y, nameTa: T.YONI_TA[y], ...BOOK.yoni[y] },
    source: BOOK.source,
  };
}

module.exports = { BOOK, ganaYoniOf };
