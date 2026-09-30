/**
 * Compares tamilPorutham.js against a primary text.
 *
 * VJ-018 disclosed that none of the ten porutham rule tables had a cited
 * source; they were ported from an earlier screen whose only reference was "the
 * Marriage reference workbook". This is the first time there is a text to
 * compare them with: the Sudamani Ullamudaiyan edition prints all ten
 * (பொருத்தவியல், verses 183-199), and each rule below was read from the
 * rendered page image.
 *
 * ## How it compares
 *
 * It does not read our tables. It calls the public `calcPorutham` over **every
 * possible input** — all 27x27 star pairs, all 12x12 rasi pairs — and compares
 * the pass/fail our code would show a client with the pass/fail the book
 * prescribes for the same pair. What is measured is behaviour, so a change to
 * how our code is organised cannot hide a difference, and an agreement means
 * the two really do give clients the same answer.
 *
 * ## What it does not claim
 *
 * That this book is *the* authority. It is one Tamil text. Other traditions
 * differ from it, and the popular rules a practitioner uses may differ from all
 * of them. Divergence from this book is a finding to decide on, not proof our
 * rule is wrong — with one exception the test calls out: a table entry that
 * contradicts the book *and* the standard star classification is an error, not
 * a variant.
 *
 * Tooling and tests only: nothing in the app imports this module.
 */

const fs = require('node:fs');
const path = require('node:path');

const { calcPorutham } = require('./tamilPorutham');

const FIXTURE = path.join(__dirname, '..', '..', 'fixtures', 'porutham', 'choodamani-poruthavial.json');

const loadBook = () => JSON.parse(fs.readFileSync(FIXTURE, 'utf8'));

const STARS = 27;
const RASIS = 12;
const range = (n) => Array.from({ length: n }, (_, i) => i);

/** Count from the first to the second, inclusive, as the book counts. */
const starCount = (girl, boy) => ((boy - girl + STARS) % STARS) + 1;
const rasiCount = (girl, boy) => ((boy - girl + RASIS) % RASIS) + 1;

const has = (list, n) => list.includes(n);

/** What the book prescribes for a pair, as pass/fail. Star-based factors. */
function bookStarVerdicts(book) {
  const ganaOf = new Map();
  for (const s of book.GANA.manushya) ganaOf.set(s, 'M');
  for (const s of book.GANA.deva) ganaOf.set(s, 'D');
  for (const s of book.GANA.rakshasa) ganaOf.set(s, 'R');

  const bandOf = new Map();
  for (const band of Object.values(book.RAJJU.bands)) for (const s of band.stars) bandOf.set(s, band.ta);

  const vedha = new Set();
  const addPair = (a, b) => { vedha.add(`${a}|${b}`); vedha.add(`${b}|${a}`); };
  for (const [a, b] of book.VEDHA.pairs) addPair(a, b);
  const [t0, t1, t2] = book.VEDHA.triple;
  addPair(t0, t1); addPair(t0, t2); addPair(t1, t2);

  const dinaSame = new Set([...book.DINA.sameStar.uttama, ...book.DINA.sameStar.madhyama]);

  return {
    DINA: (g, b) => {
      const count = starCount(g, b);
      // Count 1 is the same star, which the book grades by the star itself.
      if (count === 1) return dinaSame.has(g);
      return has(book.DINA.acceptedCounts, count);
    },
    GANA: (g, b) => {
      const a = ganaOf.get(g); const c = ganaOf.get(b);
      return a === c || (a === 'D' && c === 'M') || (a === 'M' && c === 'D');
    },
    MAHENDRA: (g, b) => has(book.MAHENDRA.acceptedCounts, starCount(g, b)),
    STREE_DEERGHA: (g, b) => starCount(g, b) >= book.STREE_DEERGHA.minimumCount,
    RAJJU: (g, b) => bandOf.get(g) !== bandOf.get(b),
    VEDHA: (g, b) => !vedha.has(`${g}|${b}`),
    _ganaOf: ganaOf,
    _bandOf: bandOf,
  };
}

/** Rasi-based factors. */
function bookRasiVerdicts(book) {
  const friends = book.RASI_ADHIPATHI.friendsOfWomansRasi;
  const vasya = book.VASYA.vasya;
  return {
    RASI: (g, b) => rasiCount(g, b) >= book.RASI.minimumCount,
    RASI_ADHIPATHI: (g, b) => has(friends[String(g)] ?? [], b),
    // Ours accepts either direction, so the book is read the same way to keep
    // the comparison fair; the directional reading only makes them differ more.
    VASYA: (g, b) => has(vasya[String(g)] ?? [], b) || has(vasya[String(b)] ?? [], g),
  };
}

const ourRow = (rows, id) => rows.find((r) => r.id === id);

/**
 * @returns per-factor { agree, total, rate, disagreements[] }
 */
function compareAll(book = loadBook()) {
  const starBook = bookStarVerdicts(book);
  const rasiBook = bookRasiVerdicts(book);
  const out = {};

  const tally = (id, cases, ours, theirs, describe) => {
    let agree = 0;
    const disagreements = [];
    for (const c of cases) {
      const o = ours(c); const t = theirs(c);
      if (o === t) agree += 1; else disagreements.push({ ...describe(c), ours: o, book: t });
    }
    out[id] = {
      agree, total: cases.length,
      rate: Number((agree / cases.length).toFixed(4)),
      disagreements,
    };
  };

  const starPairs = range(STARS).flatMap((g) => range(STARS).map((b) => [g, b]));
  for (const id of ['DINA', 'GANA', 'MAHENDRA', 'STREE_DEERGHA', 'RAJJU', 'VEDHA']) {
    tally(
      id, starPairs,
      ([g, b]) => ourRow(calcPorutham(g, b, 0, 0), id).result,
      ([g, b]) => starBook[id](g, b),
      ([g, b]) => ({ girl: g, boy: b }),
    );
  }

  const rasiPairs = range(RASIS).flatMap((g) => range(RASIS).map((b) => [g, b]));
  for (const id of ['RASI', 'RASI_ADHIPATHI', 'VASYA']) {
    tally(
      id, rasiPairs,
      ([g, b]) => ourRow(calcPorutham(0, 0, g, b), id).result,
      ([g, b]) => rasiBook[id](g, b),
      ([g, b]) => ({ girl: g, boy: b }),
    );
  }

  return out;
}

/**
 * Star-level comparison for the two factors defined by a *table* rather than a
 * rule — which entries differ, not merely how often the answer differs.
 */
function tableDifferences(book = loadBook()) {
  const { _ganaOf, _bandOf } = bookStarVerdicts(book);

  // Our gana class for a star, recovered through public behaviour: a star is
  // in the same gana as another exactly when the pair is "same" in the note.
  const ourGana = range(STARS).map((s) => {
    const note = ourRow(calcPorutham(s, s, 0, 0), 'GANA').note; // "பெண்: X, ஆண்: X"
    return note.replace(/^பெண்: /, '').split(',')[0];
  });
  const NAME = { D: 'தேவர்', M: 'மனிதர்', R: 'இராட்சதர்' };
  const ganaDiffs = range(STARS)
    .filter((s) => ourGana[s] !== NAME[_ganaOf.get(s)])
    .map((s) => ({ star: s, ours: ourGana[s], book: NAME[_ganaOf.get(s)] }));

  const ourRajju = range(STARS).map((s) =>
    ourRow(calcPorutham(s, s, 0, 0), 'RAJJU').note.replace(/^பெண்: /, '').split(',')[0]);
  const rajjuDiffs = range(STARS)
    .filter((s) => {
      // Compare partitions rather than names: two stars share a band in one
      // scheme exactly when they share a band in the other.
      return range(STARS).some((t) => (ourRajju[s] === ourRajju[t]) !== (_bandOf.get(s) === _bandOf.get(t)));
    });

  return { ganaDiffs, rajjuDiffs };
}

/** Vedha pairs the book prints that ours lacks, and the reverse. */
function vedhaPairDifferences(book = loadBook()) {
  const bookPairs = new Set();
  for (const [a, b] of book.VEDHA.pairs) bookPairs.add([a, b].sort((x, y) => x - y).join('-'));
  const [t0, t1, t2] = book.VEDHA.triple;
  for (const [a, b] of [[t0, t1], [t0, t2], [t1, t2]]) bookPairs.add([a, b].sort((x, y) => x - y).join('-'));

  const ourPairs = new Set();
  for (const g of range(STARS)) {
    for (const b of range(STARS)) {
      if (g < b && !ourRow(calcPorutham(g, b, 0, 0), 'VEDHA').result) ourPairs.add(`${g}-${b}`);
    }
  }
  return {
    bookPairs: [...bookPairs].sort(),
    ourPairs: [...ourPairs].sort(),
    shared: [...bookPairs].filter((p) => ourPairs.has(p)).sort(),
    onlyInBook: [...bookPairs].filter((p) => !ourPairs.has(p)).sort(),
    onlyInOurs: [...ourPairs].filter((p) => !bookPairs.has(p)).sort(),
  };
}

module.exports = {
  compareAll, tableDifferences, vedhaPairDifferences, loadBook, starCount, rasiCount,
};
