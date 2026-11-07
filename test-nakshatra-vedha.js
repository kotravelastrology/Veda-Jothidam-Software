const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const T = require('./src/report/nakshatraVedhaTables');
const { nakshatraVedha, nthStar } = require('./src/report/nakshatraVedha');
const { NAKSHATRA_TA } = require('./src/report/babyNames');
const { planetLongitude, nodeLongitude } = require('./src/ephemeris/siderealPositions');
const { resolveByTitle } = require('./src/sources/registry');

const FIX = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/gochara-vedha/books.json'), 'utf8')).nakshatraVedha;
const DAY = 86400000;
const YEAR = 365.25 * DAY;
const plain = (o) => JSON.parse(JSON.stringify(o));

// ------------------------------------------------ the table, read from both books ---
const encoded = T.NAKSHATRA_VEDHA.map((r) => `${r.natal}|${r.count}|${r.by.join('/')}`);
assert.deepEqual(encoded, FIX.pulippani.rows, 'Pulippani\'s Table 14');
assert.deepEqual(encoded, FIX.santhanam.rows.map((s) => s.replace(' only', '')), 'Santhanam\'s table is the same ("Ketu only" = Ketu)');
assert.equal(T.NAKSHATRA_VEDHA.length, 16, 'sixteen positions: two for each of the seven planets, two for the nodes jointly');
for (const p of ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu/Ketu']) {
  assert.equal(T.NAKSHATRA_VEDHA.filter((r) => r.natal === p).length, 2, `${p}: two positions`);
}

// The books' example: the Sun in Aswini at birth — the 9th is Aslesha, the 15th Swati (inclusive count).
assert.equal(NAKSHATRA_TA[nthStar(0, 9)], NAKSHATRA_TA[8]);
assert.equal(nthStar(0, 9), 8, 'Aslesha');
assert.equal(nthStar(0, 15), 14, 'Swati');
assert.equal(nthStar(26, 2), 0, 'wraps from Revati to Aswini');

// Word order.
assert.deepEqual(plain(T.NAKSHATRA_VEDHA_RANK.words), FIX.wordCounts);
const w = T.NAKSHATRA_VEDHA_RANK.words;
assert.deepEqual([...T.NAKSHATRA_VEDHA_RANK.order], Object.keys(w).sort((a, b) => w[b] - w[a]));
assert.deepEqual(T.READINGS.map((r) => r.book), [...T.NAKSHATRA_VEDHA_RANK.order], 'readings in book order');

// Citations.
const cites = [];
const walk = (o) => { if (o && typeof o === 'object') { if (typeof o.pageLocus === 'string') cites.push(o); Object.values(o).forEach(walk); } };
walk(T);
assert.ok(cites.length >= 4);
for (const c of cites) assert.ok(resolveByTitle(c.title), `registered: ${c.title}`);

// ------------------------------------------------ windows against the sky ---
{
  const atMs = Date.UTC(2026, 9, 6);
  // Natal positions spread round the zodiac so every row has a target.
  const natalLongitudes = { Sun: 65, Moon: 48, Mars: 20, Mercury: 47, Jupiter: 300, Venus: 22, Saturn: 147, Rahu: 275 };
  natalLongitudes.Ketu = (natalLongitudes.Rahu + 180) % 360;
  const fromMs = atMs - 2 * YEAR;
  const toMs = atMs + 30 * YEAR;
  const t0 = Date.now();
  const r = nakshatraVedha({ natalLongitudes, fromMs, toMs, atMs });
  const elapsed = Date.now() - t0;
  assert.equal(r.rows.length, 18, 'sixteen positions, the two node rows counted from each node');
  const lon = (p, ms) => {
    const jd = ms / DAY + 2440587.5;
    if (p === 'Rahu') return nodeLongitude(jd, 'Lahiri', 'mean');
    if (p === 'Ketu') return (nodeLongitude(jd, 'Lahiri', 'mean') + 180) % 360;
    return planetLongitude(jd, p, 'Lahiri');
  };
  const star = (p, ms) => Math.floor((((lon(p, ms) % 360) + 360) % 360) / (360 / 27)) % 27;
  for (const row of r.rows) {
    const natal = Math.floor(natalLongitudes[row.natalPlanet] / (360 / 27));
    assert.equal(row.natalNakshatraIndex, natal);
    assert.equal(row.targetIndex, (natal + row.count - 1) % 27);
    for (const win of row.windows) {
      const a = Date.parse(win.fromUtc); const b = Date.parse(win.toUtc);
      assert.equal(star(win.planet, (a + b) / 2), row.targetIndex, `${row.id}: ${win.planet} is in the target star mid-window`);
      if (!win.openStart) assert.notEqual(star(win.planet, a - 2 * 60000), row.targetIndex, `${row.id}: entered at ${win.fromUtc}`);
      if (!win.openEnd) assert.notEqual(star(win.planet, b + 2 * 60000), row.targetIndex, `${row.id}: left at ${win.toUtc}`);
      assert.ok(row.by.includes(win.planet));
    }
    if (row.by.includes('Moon')) {
      assert.ok(row.windows.every((x) => Date.parse(x.toUtc) <= atMs + 400 * DAY + 1), 'the Moon is listed for thirteen months only');
      assert.ok(row.windows.length >= 13, 'the Moon passes each star monthly');
    }
  }
  // Rahu and Ketu, nineteen years round the zodiac, reach every star in thirty-two years.
  for (const id of ['JUPITER_12', 'SUN_15']) {
    assert.ok(r.rows.find((x) => x.id === id).windows.length >= 1, `${id} occurs within thirty-two years`);
  }
  // "Now" is consistent with the windows.
  for (const row of r.rows) {
    const live = row.by.filter((p) => star(p, atMs) === row.targetIndex);
    assert.deepEqual([...row.activeNow].sort(), live.sort(), `${row.id}: active now`);
  }
  console.log(`  engine: 18 rows over 32 years in ${elapsed} ms`);
}

console.log('test-nakshatra-vedha: all checks passed');
