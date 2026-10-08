/**
 * Compares tamilPorutham.js against two primary texts, and the two texts against
 * each other.
 *
 * VJ-018 disclosed that the ten porutham rule tables had no cited source. Two
 * now exist, and each rule below was read from the rendered page image:
 *
 *   - Kalaprakasika (N.P. Subramania Iyer's translation, printed pp.69-76) — the
 *     AUTHORITY the calculation follows.
 *   - Sudamani Ullamudaiyan (Saraswati Mahal, 2007, verses 183-199) — the
 *     cross-check.
 *
 * ## How it compares
 *
 * It does not read our tables. It calls the public `calcPorutham` over **every
 * possible input** — all 27x27 star pairs (with the two rasis both equal and
 * different, because Dina's 27th-star rule depends on it) and all 12x12 rasi
 * pairs — and compares the pass/fail a client would see with what each book
 * prescribes. What is measured is behaviour, so reorganising the code cannot
 * hide a difference.
 *
 * Each book's verdicts are written here *from that book's fixture*, not from the
 * calculation's own tables, so an agreement means two independently-encoded
 * readings of the same page give the same answer. (They are both by the same
 * hand, so this catches coding slips, not a shared misreading; that is what the
 * page-by-page verification of the fixtures is for.)
 *
 * ## What a disagreement means
 *
 * Divergence from one book is not proof the code is wrong: neither text is the
 * only tradition. The exception is a table that contradicts *both*, or that
 * fails a structural fact — Gana's 9/9/9 split — which is an error.
 *
 * Tooling and tests only: nothing in the app imports this module.
 */

const fs = require('node:fs');
const path = require('node:path');

const { calcPorutham } = require('./tamilPorutham');

const FIXTURES = path.join(__dirname, '..', '..', 'fixtures', 'porutham');
const load = (name) => JSON.parse(fs.readFileSync(path.join(FIXTURES, name), 'utf8'));
const loadSudamani = () => load('choodamani-poruthavial.json');
const loadKalaprakasika = () => load('kalaprakasika-poruthams.json');

const STARS = 27;
const RASIS = 12;
const range = (n) => Array.from({ length: n }, (_, i) => i);
const starCount = (g, b) => ((b - g + STARS) % STARS) + 1;
const rasiCount = (g, b) => ((b - g + RASIS) % RASIS) + 1;
const has = (list, n) => list.includes(n);

const STAR_FACTORS = ['DINA', 'GANA', 'MAHENDRA', 'STREE_DEERGHA', 'YONI', 'RAJJU', 'VEDHA'];
const RASI_FACTORS = ['RASI', 'RASI_ADHIPATHI', 'VASYA'];

/**
 * What Sudamani prescribes, as pass/fail. A factor it cannot be compared on
 * returns `undefined`, which the harness reports as not comparable.
 *
 * Verdict functions take (girlNak, boyNak, girlRasi, boyRasi).
 */
function sudamaniVerdicts(book) {
  const ganaOf = new Map();
  for (const s of book.GANA.manushya) ganaOf.set(s, 'M');
  for (const s of book.GANA.deva) ganaOf.set(s, 'D');
  for (const s of book.GANA.rakshasa) ganaOf.set(s, 'R');
  const bandOf = new Map();
  for (const [name, band] of Object.entries(book.RAJJU.bands)) for (const s of band.stars) bandOf.set(s, name);
  const vedha = new Set();
  const link = (a, b) => { vedha.add(`${a}|${b}`); vedha.add(`${b}|${a}`); };
  for (const [a, b] of book.VEDHA.pairs) link(a, b);
  const [t0, t1, t2] = book.VEDHA.triple;
  link(t0, t1); link(t0, t2); link(t1, t2);
  const same = new Set([...book.DINA.sameStar.uttama, ...book.DINA.sameStar.madhyama]);
  const friends = book.RASI_ADHIPATHI.friendsOfWomansRasi;
  const vasya = book.VASYA.vasya;

  return {
    DINA: (g, b) => (starCount(g, b) === 1 ? same.has(g) : has(book.DINA.acceptedCounts, starCount(g, b))),
    GANA: (g, b) => {
      const x = ganaOf.get(g); const y = ganaOf.get(b);
      return x === y || (x === 'D' && y === 'M') || (x === 'M' && y === 'D');
    },
    MAHENDRA: (g, b) => has(book.MAHENDRA.acceptedCounts, starCount(g, b)),
    STREE_DEERGHA: (g, b) => starCount(g, b) >= book.STREE_DEERGHA.minimumCount,
    YONI: undefined, // a different model (animals with sex); see the fixture
    RAJJU: (g, b) => bandOf.get(g) !== bandOf.get(b),
    VEDHA: (g, b) => !vedha.has(`${g}|${b}`),
    RASI: (_g, _b, gr, br) => rasiCount(gr, br) >= book.RASI.minimumCount,
    RASI_ADHIPATHI: (_g, _b, gr, br) => has(friends[String(gr)] ?? [], br),
    // Ours accepts either direction, so the book is read the same way to keep
    // the comparison fair; the directional reading only makes them differ more.
    VASYA: (_g, _b, gr, br) => has(vasya[String(gr)] ?? [], br) || has(vasya[String(br)] ?? [], gr),
    _ganaOf: ganaOf,
    _bandOf: bandOf,
    _vedha: vedha,
  };
}

/** What Kalaprakasika prescribes, written from its own fixture. */
function kalaprakasikaVerdicts(book) {
  const ganaOf = new Map();
  for (const s of book.GANA.deva) ganaOf.set(s, 'D');
  for (const s of book.GANA.manushya) ganaOf.set(s, 'M');
  for (const s of book.GANA.rakshasa) ganaOf.set(s, 'R');
  const yoniOf = new Map();
  for (const [name, stars] of Object.entries(book.YONI.yonis)) for (const s of stars) yoniOf.set(s, name);
  const hostile = (a, b) => book.YONI.hostilePairsAsPrinted
    .some(([x, y]) => (x === a && y === b) || (x === b && y === a));
  const bandOf = new Map();
  for (const [name, band] of Object.entries(book.RAJJU.bands)) for (const s of band.stars) bandOf.set(s, name);
  const vedha = new Set();
  const link = (a, b) => { vedha.add(`${a}|${b}`); vedha.add(`${b}|${a}`); };
  for (const [a, b] of book.VEDHA.pairs) link(a, b);
  const [t0, t1, t2] = book.VEDHA.triple;
  link(t0, t1); link(t0, t2); link(t1, t2);
  const vasya = book.VASYA.concordantTo;
  const d = book.DINA;

  return {
    DINA: (g, b, gr, br) => {
      const count = starCount(g, b);
      if (count === 1) {
        if (has(d.sameStar.excellent, g) || has(d.sameStar.neutral, g)) return true;
        return !has(d.sameStar.unsuitable, g);
      }
      if (has(d.avoidCounts, count)) return false;
      if (count === 27) return gr === br;
      const cycle = Math.floor((count - 1) / 9) + 1;
      const position = ((count - 1) % 9) + 1;
      if (cycle === 1) return has(d.cycleGoodPositions, position);
      return true; // second and third Pariyaya: not rejected as a whole
    },
    GANA: (g, b) => {
      const x = ganaOf.get(g); const y = ganaOf.get(b);
      return x === y || (x === 'D' && y === 'M') || (x === 'M' && y === 'D');
    },
    MAHENDRA: (g, b) => has(book.MAHENDRA.acceptedCounts, starCount(g, b)),
    STREE_DEERGHA: (g, b) => starCount(g, b) >= book.STREE_DEERGHA.minimumCount,
    YONI: (g, b) => !hostile(yoniOf.get(g), yoniOf.get(b)),
    RAJJU: (g, b) => bandOf.get(g) !== bandOf.get(b),
    VEDHA: (g, b) => !vedha.has(`${g}|${b}`),
    // A count of 1 is not addressed by the passage, so it is not compared.
    RASI: (_g, _b, gr, br) => {
      const count = rasiCount(gr, br);
      if (has(book.RASI.unaddressed, count)) return null;
      return has(book.RASI.goodCounts, count);
    },
    RASI_ADHIPATHI: undefined, // the book states no rule (see the fixture)
    VASYA: (_g, _b, gr, br) => has(vasya[String(gr)] ?? [], br) || has(vasya[String(br)] ?? [], gr),
    _ganaOf: ganaOf,
    _yoniOf: yoniOf,
    _bandOf: bandOf,
    _vedha: vedha,
  };
}

const ourRow = (rows, id) => rows.find((r) => r.id === id);

/**
 * Agreement between the calculation and one book, per factor, over every input.
 *
 * @returns { [factor]: { comparable, agree, total, rate, disagreements[] } }
 *   `comparable: false` where the book gives no rule to test.
 */
function compareCode(verdicts) {
  const out = {};

  const run = (id, cases, ours) => {
    const theirs = verdicts[id];
    if (!theirs) { out[id] = { comparable: false }; return; }
    let agree = 0; let total = 0;
    const disagreements = [];
    for (const c of cases) {
      const t = theirs(...c);
      if (t === null) continue; // the book is silent on this input
      total += 1;
      const o = ours(c);
      if (o === t) agree += 1; else disagreements.push({ input: c, ours: o, book: t });
    }
    out[id] = { comparable: true, agree, total, rate: Number((agree / total).toFixed(4)), disagreements };
  };

  // Star factors over every star pair, with the two rasis both equal and
  // different — Dina's 27th-star rule depends on it.
  const starCases = range(STARS).flatMap((g) => range(STARS).flatMap((b) => [[g, b, 0, 0], [g, b, 0, 1]]));
  for (const id of STAR_FACTORS) {
    run(id, starCases, ([g, b, gr, br]) => ourRow(calcPorutham(g, b, gr, br), id).result);
  }

  // Rasi factors over every rasi pair.
  const rasiCases = range(RASIS).flatMap((g) => range(RASIS).map((b) => [0, 0, g, b]));
  for (const id of RASI_FACTORS) {
    run(id, rasiCases, ([g, b, gr, br]) => ourRow(calcPorutham(g, b, gr, br), id).result);
  }
  return out;
}

const compareToSudamani = (book = loadSudamani()) => compareCode(sudamaniVerdicts(book));
const compareToKalaprakasika = (book = loadKalaprakasika()) => compareCode(kalaprakasikaVerdicts(book));

/**
 * The two books against each other, independent of the code — where they
 * agree the rule is well supported, and where they differ the choice between
 * them is a decision rather than a fact.
 */
function compareBooks(s = loadSudamani(), k = loadKalaprakasika()) {
  const sv = sudamaniVerdicts(s);
  const kv = kalaprakasikaVerdicts(k);
  const out = {};
  const starCases = range(STARS).flatMap((g) => range(STARS).flatMap((b) => [[g, b, 0, 0], [g, b, 0, 1]]));
  const rasiCases = range(RASIS).flatMap((g) => range(RASIS).map((b) => [0, 0, g, b]));
  const both = (id, cases) => {
    if (!sv[id] || !kv[id]) { out[id] = { comparable: false }; return; }
    let agree = 0; let total = 0;
    for (const c of cases) {
      const b = kv[id](...c);
      if (b === null) continue;
      total += 1;
      if (sv[id](...c) === b) agree += 1;
    }
    out[id] = { comparable: true, agree, total, rate: Number((agree / total).toFixed(4)) };
  };
  for (const id of STAR_FACTORS) both(id, starCases);
  for (const id of RASI_FACTORS) both(id, rasiCases);
  return out;
}

/** Vedha pairs the books print and the code holds, as sorted "a-b" strings. */
function vedhaPairs(verdictSet) {
  const pairs = new Set();
  for (const key of verdictSet) {
    const [a, b] = key.split('|').map(Number);
    if (a < b) pairs.add(`${a}-${b}`);
  }
  return [...pairs].sort();
}

function codeVedhaPairs() {
  const pairs = new Set();
  for (const g of range(STARS)) {
    for (const b of range(STARS)) {
      if (g < b && !ourRow(calcPorutham(g, b, 0, 0), 'VEDHA').result) pairs.add(`${g}-${b}`);
    }
  }
  return [...pairs].sort();
}

/** The code's gana class per star, recovered through public behaviour. */
function codeGanaByStar() {
  return range(STARS).map((s) => ourRow(calcPorutham(s, s, 0, 0), 'GANA').note
    .replace(/^பெண்: /, '').split(',')[0]);
}

module.exports = {
  compareToSudamani, compareToKalaprakasika, compareBooks,
  sudamaniVerdicts, kalaprakasikaVerdicts, vedhaPairs, codeVedhaPairs, codeGanaByStar,
  loadSudamani, loadKalaprakasika, starCount, rasiCount,
  STAR_FACTORS, RASI_FACTORS,
};
