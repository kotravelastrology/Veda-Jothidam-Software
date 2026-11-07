/**
 * Which pages of the horoscope book are chosen when nothing has been picked. Pages whose effects are the classical books' words about widowhood, barrenness and curses (the female
 * horoscopy of BPHS ch.80, the curses of the previous birth of ch.83) are for the astrologer's reading and are not to be handed to a client unedited, so they are left out of the
 * default choice and of the "all" buttons; they can still be picked one by one, or all together with `withAstrologer`.
 * Pure and free of imports, so that the book page (a client component) can use it as it is.
 */

/** The first page of each catalogue item that is for the astrologer. */
const ASTROLOGER_ONLY = Object.freeze([137, 138]);

/** 'astrologer' or 'client' for an item that starts at page `from`. */
const audienceOf = (from) => (ASTROLOGER_ONLY.includes(from) ? 'astrologer' : 'client');

/**
 * The ids of the built items to choose: every built item that is for a client, and with `withAstrologer` those for the astrologer too.
 * @param catalogue the families of bookCatalogue(), each with its items { id, built, audience }
 */
function defaultSelection(catalogue, { withAstrologer = false } = {}) {
  return catalogue.flatMap((f) => f.items.filter((i) => i.built && (withAstrologer || i.audience !== 'astrologer')).map((i) => i.id));
}

module.exports = { ASTROLOGER_ONLY, audienceOf, defaultSelection };
