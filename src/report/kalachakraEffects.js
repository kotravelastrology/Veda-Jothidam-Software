/**
 * What BPHS says of the Kalachakra dasha's results (Santhanam, vol.2):
 *  - ch.65 (printed pp.835-841): the effect of the dasha of each sign in the nine-sign sequence of each of the twelve Amsas;
 *  - ch.64 (printed pp.825-834): the effect of an antardasha, named by the lord of its sign, in the dashas of each Amsa.
 * An "Amsa" is the Navamsha sign of the Moon's pada, which names the pada's sequence of nine dasha signs (kalachakraBphs.js). The book gives both for the Savya
 * chakra only; for the Apsavya it says (ch.64 v.56-58) to judge the antardashas from the nature of the sign lords and their friendship with the dasha lord, and
 * gives no table, so none is shown. Fixtures: fixtures/dasha-effects/bphs-64.json and bphs-65.json (Tamil summaries of the English print).
 */
const K = require('../dasha/kalachakraBphs');

const ANTARDASHA = require('../../fixtures/dasha-effects/bphs-64.json');
const DASHA = require('../../fixtures/dasha-effects/bphs-65.json');

const AMSA_NAMES = Object.freeze(Object.keys(DASHA.amsas));
const SIGN_LORD = Object.freeze(['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter']);

/**
 * The ch.65 effect of a mahadasha of kalachakraMahadashas (its Amsa and place in the sequence), or null for an Apsavya dasha, for which the book gives none.
 * @returns {{ verses: string, page: string, sign: number, ta: string }|null}
 */
function dashaEffect(maha) {
  if (maha.chakra !== 'savya') return null;
  const a = DASHA.amsas[AMSA_NAMES[maha.amsa]];
  const e = a.entries[maha.position - 1];
  return { verses: a.verses, page: a.page, sign: e.sign, ta: e.ta };
}

/**
 * The ch.64 effects of the antardasha of sign `antarSign` in a mahadasha of kalachakraBphs.js: the entries of its Amsa that name the sign's lord, in the book's
 * order (Saturn has two in the Capricorn Amsa); empty where the book names none, null for an Apsavya dasha.
 * @returns {{ verses: string, page: string, lord: string, ta: string[] }|null}
 */
function antardashaEffect(maha, antarSign) {
  if (maha.chakra !== 'savya') return null;
  const a = ANTARDASHA.amsas[AMSA_NAMES[maha.amsa]];
  const lord = SIGN_LORD[antarSign];
  return { verses: a.verses, page: a.page, lord, ta: a.entries.filter((e) => e.lords.includes(lord)).map((e) => e.ta) };
}

module.exports = { ANTARDASHA, DASHA, AMSA_NAMES, SIGN_LORD, dashaEffect, antardashaEffect, SAVYA: K.SAVYA };
