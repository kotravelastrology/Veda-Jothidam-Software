const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const T = require('./src/report/lattaTables');
const { lattaNirnaya, natalHouses, coincidences } = require('./src/report/latta');
const { planetLongitude, nodeLongitude } = require('./src/ephemeris/siderealPositions');
const { resolveByTitle } = require('./src/sources/registry');

const FIX = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/gochara-vedha/latta.json'), 'utf8'));
const DAY = 86400000;
const STAR = 360 / 27;
const plain = (o) => JSON.parse(JSON.stringify(o));

// The books' spellings of the 27 stars → index.
const NAMES = [
  ['aswini', 'ashwini'], ['bharani'], ['krittika'], ['rohini'], ['mrigasira', 'mrigashira'], ['ardra', 'aardra'],
  ['punarvasu'], ['pushya', 'pushyami'], ['ashlesha', 'aslesha'], ['magha', 'makha'], ['purva phalguni', 'poorva phalguni'], ['uttara phalguni', 'uttaraphalguni'],
  ['hasta'], ['chitra'], ['swati'], ['visakha', 'vishakha', 'visaakha'], ['anuradha'], ['jyeshtha', 'jyestha'],
  ['moola', 'mula'], ['purvashadha', 'poorvaashaadha'], ['uttarashadha', 'uttar ashad'], ['sravana', 'shravana'], ['dhanishta', 'dhanishtha'], ['satabhisha', 'shatabhisha'],
  ['purva bhadrapada', 'poorvabhadrapada'], ['uttarabhadrapada', 'uttara bhadrapada'], ['revati'],
];
const starOf = (name) => {
  const i = NAMES.findIndex((a) => a.includes(name.toLowerCase()));
  assert.ok(i >= 0, `star name ${name}`);
  return i;
};
const lon = (p, ms) => {
  const jd = ms / DAY + 2440587.5;
  if (p === 'Rahu') return nodeLongitude(jd, 'Lahiri', 'mean');
  if (p === 'Ketu') return (nodeLongitude(jd, 'Lahiri', 'mean') + 180) % 360;
  return planetLongitude(jd, p, 'Lahiri');
};
const star = (p, ms) => Math.floor((((lon(p, ms) % 360) + 360) % 360) / STAR) % 27;

// ------------------------------------------------ the counts, seven books ---
for (const [book, { rows }] of Object.entries(FIX.counts)) {
  for (const row of rows) {
    const [planet, count, dir] = row.split('|');
    const k = T.KICKS[planet];
    const want = { count: Number(count), dir: dir === 'forward' ? 1 : -1 };
    if (book === 'KAPOOR' && planet === 'Rahu') {
      assert.equal(want.count, T.RAHU_READINGS.EIGHTH.count, 'Kapoor: Rahu 8th');
      continue;
    }
    assert.deepEqual({ count: k.count, dir: k.dir }, want, `${book} ${planet}`);
  }
  const hasKetu = rows.some((r) => r.startsWith('Ketu|'));
  assert.equal(T.KETU.counted.includes(book), hasKetu, `${book}: Ketu counted`);
}
assert.equal(T.RAHU_READINGS[T.DEFAULT_RAHU].count, 9);
assert.ok(FIX.sanskritRahu.includes('नवमं'), 'the verse: ninth');

// ------------------------------------------------ the books' worked counts ---
for (const line of FIX.workedCounts) {
  const [book, planet, from, to] = line.split('|');
  const k = T.KICKS[planet];
  assert.equal(T.kickedStar(starOf(from), k.count, k.dir), starOf(to), line);
  assert.equal(T.kickerStar(starOf(to), k.count, k.dir), starOf(from), `${line} (inverse)`);
}
assert.deepEqual(plain(T.WORKED_COUNTS), FIX.workedCounts.map((l) => {
  const [book, planet, from, to] = l.split('|');
  return [book, planet, starOf(from), starOf(to)];
}));

// ------------------------------------------------ dated examples against the sky ---
const checkRows = (iso, rows, label) => {
  const ms = Date.parse(iso);
  for (const row of rows) {
    const [planet, occ, kicked] = row.split('|');
    assert.equal(star(planet, ms), starOf(occ), `${label}: ${planet} in ${occ}`);
    const k = T.KICKS[planet];
    assert.equal(T.kickedStar(starOf(occ), k.count, k.dir), starOf(kicked), `${label}: ${planet} kicks ${kicked}`);
  }
};
{
  const r70 = FIX.raoTable70;
  checkRows('1996-12-05T18:00:00+05:30', r70.rows, 'Rao Table 70');
  const r = lattaNirnaya({ natalMoonLongitude: starOf('Poorvabhadrapada') * STAR + 5, lagnaLongitude: starOf('Hasta') * STAR + 5, atMs: Date.parse('1996-12-05T18:00:00+05:30') });
  const primary = r.today.filter((x) => x.primary);
  assert.deepEqual(primary.filter((x) => x.onJanma).map((x) => x.planet), r70.onJanma);
  assert.deepEqual(primary.filter((x) => x.onLagna).map((x) => x.planet), r70.onLagna);
  for (const [p, owns] of Object.entries(r70.lords)) assert.deepEqual(r.rao[p].owns, owns, `Rao: ${p} owns ${owns} from Virgo`);
  assert.deepEqual(natalHouses('Rahu', 5, null).owns, [], 'the nodes own no sign');

  checkRows(`${FIX.raoExercise45.date}T12:00:00-07:00`, FIX.raoExercise45.rows, 'Rao Exercise 45');
  checkRows(`${FIX.rajKumar2011.date}T12:00:00+05:30`, FIX.rajKumar2011.rows, 'Raj Kumar 2011');
  checkRows(`${FIX.gourMars2006.date}T12:00:00+05:30`, FIX.gourMars2006.rows, 'Gour Mars 2006');
  // Gour's "Rahu in Uttara Phalguni": that day it was Ketu.
  const g = Date.parse(`${FIX.gourMars2006.date}T12:00:00+05:30`);
  assert.equal(star('Ketu', g), starOf('Uttara Phalguni'));
  assert.notEqual(star('Rahu', g), starOf('Uttara Phalguni'));
}

// ------------------------------------------------ the engine over a window ---
{
  const atMs = Date.UTC(2026, 9, 8);
  const natal = 48; // Rohini
  const t0 = Date.now();
  const r = lattaNirnaya({ natalMoonLongitude: natal, lagnaLongitude: 200, natalLongitudes: { Sun: 66, Moon: 48, Mars: 120, Mercury: 80, Jupiter: 300, Venus: 40, Saturn: 150, Rahu: 10, Ketu: 190 }, atMs });
  const elapsed = Date.now() - t0;
  const janma = Math.floor(natal / STAR);
  assert.equal(r.janma.star, janma);
  for (const x of r.today) {
    assert.equal(x.star, star(x.planet, atMs), `${x.reading} today`);
    assert.equal(x.onJanma, T.kickedStar(x.star, x.count, x.dir) === janma);
  }
  for (const w of r.windows) {
    const target = w.target === 'JANMA' ? janma : r.lagna.star;
    const mid = (Date.parse(w.fromUtc) + Date.parse(w.toUtc)) / 2;
    const reading = w.reading === 'Rahu-EIGHTH' ? { count: 8, dir: -1 } : T.KICKS[w.planet];
    assert.equal(T.kickedStar(star(w.planet, mid), reading.count, reading.dir), target, `${w.reading} ${w.target} ${w.fromUtc}`);
    if (!w.openStart) assert.notEqual(star(w.planet, Date.parse(w.fromUtc) - 120000), star(w.planet, mid), `${w.reading}: enters the star at ${w.fromUtc}`);
  }
  // Every planet kicks the natal star at least once in its span (the Moon monthly).
  for (const p of ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu']) {
    assert.ok(r.windows.some((w) => w.target === 'JANMA' && w.reading === p), `${p} kicks the natal star in its span`);
  }
  const moon = r.windows.filter((w) => w.target === 'JANMA' && w.reading === 'Moon');
  assert.ok(moon.length >= 12 && moon.length <= 15, `the Moon kicks the natal star about monthly (${moon.length})`);
  for (const c of r.together) {
    const mid = (Date.parse(c.fromUtc) + Date.parse(c.toUtc)) / 2;
    const live = r.windows.filter((w) => w.target === 'JANMA' && w.primary && Date.parse(w.fromUtc) <= mid && mid < Date.parse(w.toUtc)).map((w) => w.reading).sort();
    assert.deepEqual(live, c.readings, `together ${c.fromUtc}`);
    assert.ok(c.readings.length >= 2);
  }
  assert.ok(elapsed < 3000, `fast enough (${elapsed} ms)`);
  console.log(`  engine: ${r.windows.length} windows, ${r.together.length} coincidences, in ${elapsed} ms`);
}
// coincidences(): two overlapping, one apart.
assert.deepEqual(coincidences([{ fromMs: 0, toMs: 10, reading: 'A' }, { fromMs: 5, toMs: 20, reading: 'B' }, { fromMs: 30, toMs: 40, reading: 'C' }]), [{ fromMs: 5, toMs: 10, readings: ['A', 'B'] }]);

// ------------------------------------------------ order and citations ---
assert.deepEqual(plain(T.LATTA_RANK.words), FIX.wordCounts);
assert.deepEqual([...T.LATTA_RANK.order], Object.keys(FIX.wordCounts).sort((a, b) => FIX.wordCounts[b] - FIX.wordCounts[a]));
for (const b of T.LATTA_RANK.order) assert.ok(T.EFFECTS[b] && T.BOOK_TA[b], b);
const cites = [];
const walk = (o) => { if (o && typeof o === 'object') { if (typeof o.pageLocus === 'string') cites.push(o); Object.values(o).forEach(walk); } };
walk(T);
assert.ok(cites.length >= 12);
for (const c of cites) assert.ok(resolveByTitle(c.title), `registered: ${c.title}`);

console.log('test-latta: all checks passed');
