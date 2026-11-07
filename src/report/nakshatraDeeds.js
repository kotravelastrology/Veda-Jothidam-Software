/**
 * The deeds each nakshatra suits (tables in `nakshatraDeedsTables.js`): the whole book chapter, and a search that
 * reads it the other way round — which stars the book lists a deed under. A query is words, Tamil or English; a
 * deed matches when it has every word (Tamil words stand for the English the book uses).
 */

const T = require('./nakshatraDeedsTables');

const escapeRe = (w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** One query word as a case-insensitive pattern: a Tamil word through the synonyms, anything else as plain text. */
function wordPattern(word) {
  const w = word.trim();
  if (!w) return null;
  if (T.SYNONYMS[w]) return new RegExp(T.SYNONYMS[w], 'i');
  // A Tamil word followed by a case ending ("திருமணத்துக்கு") still finds its stem.
  const stemOf = (k) => (k.endsWith('ம்') ? k.slice(0, -2) : k);
  const stem = Object.keys(T.SYNONYMS).filter((k) => stemOf(k).length >= 4 && w.startsWith(stemOf(k))).sort((x, y) => y.length - x.length)[0];
  if (stem && /[஀-௿]/.test(w)) return new RegExp(T.SYNONYMS[stem], 'i');
  if (/[஀-௿]/.test(w)) return { unknown: w };
  return new RegExp(escapeRe(w), 'i');
}

/** The star table as the page shows it: all 28 entries. */
function deedsTable() {
  return {
    stars: T.STARS.map((s) => ({
      index: s.index, nameEn: s.nameEn, nameTa: s.nameTa, classKey: s.classKey, mukhaKey: s.mukhaKey, kula: s.kula,
      introEn: s.introEn, good: s.good, also: s.also, pageFrom: s.pageFrom, pageTo: s.pageTo, source: s.source,
    })),
    classes: T.CLASSES, mukha: T.MUKHA, kulaTa: T.KULA_TA, source: T.SOURCE,
    differences: T.DIFFERENCES, ourReadingsTa: T.OUR_READINGS_TA,
    counts: { stars: T.STARS.length, good: T.STARS.reduce((n, s) => n + s.good.length, 0), also: T.STARS.reduce((n, s) => n + s.also.length, 0) },
  };
}

/**
 * Which stars the book lists the deed(s) under. Returns the stars with the matching deeds, most matches first, and
 * any Tamil words it could not turn into English.
 */
function searchDeeds(query) {
  const words = String(query ?? '').split(/[\s,;]+/).filter(Boolean);
  const pats = words.map(wordPattern).filter(Boolean);
  const unknown = pats.filter((p) => p.unknown).map((p) => p.unknown);
  const real = pats.filter((p) => !p.unknown);
  if (real.length === 0) return { query: String(query ?? ''), unknown, stars: [] };
  const match = (deed) => real.every((p) => p.test(deed));
  const stars = T.STARS.map((s) => {
    const good = s.good.filter(match);
    const also = s.also.filter(match);
    return { index: s.index, nameTa: s.nameTa, nameEn: s.nameEn, classKey: s.classKey, good, also, count: good.length + also.length };
  }).filter((s) => s.count > 0).sort((a, b) => b.count - a.count || a.index - b.index);
  return { query: String(query ?? ''), unknown, stars };
}

module.exports = { deedsTable, searchDeeds, wordPattern };
