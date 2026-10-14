/**
 * The porutham tables, as Kalaprakasika prints them.
 *
 * Source: Kalaprakasika, N.P. Subramania Iyer's English translation,
 * marriage-suitability chapter, printed pp.69-76 (registered as
 * `KALAPRAKASIKA_NPS_IYER` in sources/registry.js). Every entry was read from
 * the rendered page. `fixtures/porutham/kalaprakasika-poruthams.json` is the
 * transcription with the page of each rule; `test-porutham-source.js` asserts
 * this file equals it, entry for entry.
 *
 * ## Why embedded rather than read from that JSON
 *
 * A calculation must not depend on finding a file at runtime. Inside the Next
 * bundle `__dirname` is a placeholder, and this project has been bitten by that
 * three times (engineVersion, the citation scanner, the ephemeris version).
 * Data that decides a client's result lives in code; the fixture exists so a
 * test can hold the code to the book.
 *
 * Indices: stars 0-26 (Ashwini..Revati), rasis 0-11 (Aries..Pisces).
 *
 * ## What was NOT taken from the book
 *
 * Rasi Adhipathi is unchanged from the earlier port: the book gives each
 * planet's friends but states no rule for what the two lords must be, so there
 * is nothing to implement it from. See `poruthamFactors.js`.
 */

const STARS = 27;
const RASIS = 12;

// ── Dina (printed pp.69, 71) ────────────────────────────────────────────────
const DINA = Object.freeze({
  /** Position within the nine-fold cycle, 1 = Jenma .. 9 = Parama-Maithra. */
  cycleGoodPositions: Object.freeze([2, 4, 6, 8, 9]),
  cycleBadPositions: Object.freeze([3, 5, 7]),
  /** The 22nd from either asterism is Vadha-Vainasika. */
  avoidCounts: Object.freeze([22]),
  /** A common janma nakshatra, graded by the star itself (printed p.71). */
  sameStar: Object.freeze({
    excellent: Object.freeze([3, 5, 9, 12, 15, 21, 25, 26]),
    neutral: Object.freeze([0, 2, 4, 6, 7, 10, 11, 13, 16, 19, 20]),
    unsuitable: Object.freeze([1, 8, 14, 17, 18, 22, 23, 24]),
  }),
});

// ── Gana (printed p.72) ─────────────────────────────────────────────────────
// Manushya is printed as only five stars; the last four are by elimination.
const GANA = Object.freeze({
  deva: Object.freeze([0, 4, 6, 7, 12, 14, 16, 21, 26]),
  manushya: Object.freeze([1, 3, 5, 10, 25, 11, 19, 20, 24]),
  rakshasa: Object.freeze([2, 8, 9, 13, 15, 17, 18, 22, 23]),
});

// ── Mahendra and Sthree-Dheergham (printed p.72) ────────────────────────────
const MAHENDRA_COUNTS = Object.freeze([4, 7, 10, 13, 16, 19, 22, 25]);
const STREE_DEERGHA_MINIMUM = 13;

// ── Yoni (printed p.73) ─────────────────────────────────────────────────────
const YONIS = Object.freeze({
  horse: Object.freeze([0, 23]),
  elephant: Object.freeze([1, 26]),
  sheep: Object.freeze([7, 2]),
  serpent: Object.freeze([3, 4]),
  cat: Object.freeze([8, 6]),
  rat: Object.freeze([9, 10]),
  cow: Object.freeze([11, 20, 25]),
  buffalo: Object.freeze([14, 12]),
  tiger: Object.freeze([15, 13]),
  deer: Object.freeze([17, 16]),
  dog: Object.freeze([18, 5]),
  monkey: Object.freeze([19, 21]),
  lion: Object.freeze([22, 24]),
});
/** As printed, anomalies included (see the fixture). */
const YONI_HOSTILE = Object.freeze([
  ['monkey', 'sheep'], ['deer', 'elephant'], ['horse', 'buffalo'], ['cow', 'tiger'],
  ['rat', 'cat'], ['serpent', 'rat'], ['serpent', 'mongoose'], ['dog', 'deer'],
]);
const YONI_TA = Object.freeze({
  horse: 'குதிரை', elephant: 'யானை', sheep: 'ஆடு', serpent: 'பாம்பு', cat: 'பூனை', rat: 'எலி',
  cow: 'பசு', buffalo: 'எருமை', tiger: 'புலி', deer: 'மான்', dog: 'நாய்', monkey: 'குரங்கு', lion: 'சிங்கம்',
});

// ── Rasi (printed pp.73-74) ─────────────────────────────────────────────────
const RASI_GOOD_COUNTS = Object.freeze([7, 8, 9, 10, 11, 12]);
const RASI_BAD_COUNTS = Object.freeze([2, 3, 4, 5, 6]);

// ── Vasya (printed p.75) ────────────────────────────────────────────────────
const VASYA = Object.freeze({
  0: Object.freeze([4, 7]), 1: Object.freeze([3, 4]), 2: Object.freeze([5]), 3: Object.freeze([7, 8]),
  4: Object.freeze([6]), 5: Object.freeze([2, 11]), 6: Object.freeze([9]), 7: Object.freeze([5, 3]),
  8: Object.freeze([11]), 9: Object.freeze([10, 0]), 10: Object.freeze([0]), 11: Object.freeze([9]),
});

// ── Rajju (printed p.75) ────────────────────────────────────────────────────
const RAJJU_BANDS = Object.freeze({
  padha: Object.freeze([0, 8, 9, 17, 18, 26]),
  ooroo: Object.freeze([1, 7, 10, 16, 19, 25]),
  nabhi: Object.freeze([2, 6, 11, 15, 20, 24]),
  kanta: Object.freeze([3, 5, 12, 14, 21, 23]),
  siro: Object.freeze([4, 13, 22]),
});
const RAJJU_TA = Object.freeze({
  padha: 'கால்', ooroo: 'இடுப்பு', nabhi: 'வயிறு', kanta: 'கழுத்து', siro: 'தலை',
});

// ── Vedha (printed p.76) ────────────────────────────────────────────────────
const VEDHA_PAIRS = Object.freeze([
  [0, 17], [1, 16], [2, 15], [3, 14], [5, 21], [6, 20],
  [7, 19], [8, 18], [9, 26], [10, 25], [11, 24], [12, 23],
].map((p) => Object.freeze(p)));
const VEDHA_TRIPLE = Object.freeze([4, 13, 22]);

// ── Derived lookups ─────────────────────────────────────────────────────────

/** star -> 'deva' | 'manushya' | 'rakshasa' */
const GANA_OF = Object.freeze(Array.from({ length: STARS }, (_, s) => (
  GANA.deva.includes(s) ? 'deva' : GANA.manushya.includes(s) ? 'manushya' : 'rakshasa')));

/** star -> yoni name */
const YONI_OF = Object.freeze(Array.from({ length: STARS }, (_, s) => (
  Object.entries(YONIS).find(([, stars]) => stars.includes(s))[0])));

/** star -> rajju band name */
const RAJJU_OF = Object.freeze(Array.from({ length: STARS }, (_, s) => (
  Object.entries(RAJJU_BANDS).find(([, stars]) => stars.includes(s))[0])));

const yoniHostile = (a, b) => YONI_HOSTILE.some(([x, y]) => (x === a && y === b) || (x === b && y === a));

const VEDHA_SET = (() => {
  const set = new Set();
  const link = (a, b) => { set.add(`${a}|${b}`); set.add(`${b}|${a}`); };
  for (const [a, b] of VEDHA_PAIRS) link(a, b);
  const [t0, t1, t2] = VEDHA_TRIPLE;
  link(t0, t1); link(t0, t2); link(t1, t2);
  return set;
})();
const hasVedha = (a, b) => VEDHA_SET.has(`${a}|${b}`);

/** Every star must be assigned exactly once in each partition; refuse to load otherwise. */
(function assertPartitions() {
  const each = (name, groups) => {
    const all = groups.flat().sort((a, b) => a - b);
    if (all.length !== STARS || all.some((s, i) => s !== i)) {
      throw new Error(`porutham table ${name} does not assign each of the 27 stars exactly once`);
    }
  };
  each('GANA', Object.values(GANA));
  each('YONIS', Object.values(YONIS));
  each('RAJJU_BANDS', Object.values(RAJJU_BANDS));
  each('DINA.sameStar', Object.values(DINA.sameStar));
  each('VEDHA', [...VEDHA_PAIRS.flat(), ...VEDHA_TRIPLE].map((s) => [s]));
}());

module.exports = {
  STARS, RASIS,
  DINA, GANA, MAHENDRA_COUNTS, STREE_DEERGHA_MINIMUM,
  YONIS, YONI_HOSTILE, YONI_TA, RASI_GOOD_COUNTS, RASI_BAD_COUNTS,
  VASYA, RAJJU_BANDS, RAJJU_TA, VEDHA_PAIRS, VEDHA_TRIPLE,
  GANA_OF, YONI_OF, RAJJU_OF, yoniHostile, hasVedha,
};
