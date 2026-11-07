const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const T = require('./src/report/pada88Tables');
const { pada88, jupiterAspects } = require('./src/report/pada88');
const { planetLongitude, nodeLongitude } = require('./src/ephemeris/siderealPositions');
const { resolveByTitle } = require('./src/sources/registry');

const FIX = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/gochara-vedha/pada88.json'), 'utf8'));
const DAY = 86400000;
const PADA = 360 / 108;
const plain = (o) => JSON.parse(JSON.stringify(o));
const STARS = ['ashwini', 'bharani', 'krittika', 'rohini', 'mrigasira', 'ardra', 'punarvasu', 'pushya', 'ashlesha', 'magha', 'purva phalguni', 'uttara phalguni', 'hasta', 'chitra', 'swati', 'vishakha', 'anuradha', 'jyeshtha', 'moola', 'purvashadha', 'uttarashadha', 'sravana', 'dhanishta', 'satabhisha', 'purva bhadrapada', 'uttarabhadrapada', 'revati'];
const pada = (s) => { const [name, q] = s.split('|'); const i = STARS.indexOf(name.toLowerCase()); assert.ok(i >= 0, name); return i * 4 + Number(q) - 1; };
const lon = (p, ms) => {
  const jd = ms / DAY + 2440587.5;
  if (p === 'Rahu') return nodeLongitude(jd, 'Lahiri', 'mean');
  if (p === 'Ketu') return (nodeLongitude(jd, 'Lahiri', 'mean') + 180) % 360;
  return planetLongitude(jd, p, 'Lahiri');
};
const padaAt = (p, ms) => Math.floor((((lon(p, ms) % 360) + 360) % 360) / PADA) % 108;

// ------------------------------------------------ the count, from the books' examples ---
for (const ex of FIX.examples) {
  assert.equal(T.pada88Of(pada(ex.natal)), pada(ex.pada88), `${ex.book}: ${ex.natal} → ${ex.pada88}`);
}
assert.deepEqual(plain(T.EXAMPLES), FIX.examples.map((e) => {
  const n = pada(e.natal); const t = pada(e.pada88);
  return [e.book, Math.floor(n / 4), (n % 4) + 1, Math.floor(t / 4), (t % 4) + 1];
}));
// The 88th pada is in the 22nd star only for a 1st-pada birth; otherwise the 23rd.
for (let n = 0; n < 108; n += 1) {
  const t = T.pada88Of(n);
  const starCount = ((Math.floor(t / 4) - Math.floor(n / 4) + 27) % 27) + 1;
  assert.equal(starCount, n % 4 === 0 ? 22 : 23, `natal pada ${n}`);
  assert.equal((t - n + 108) % 108, 87);
}

// ------------------------------------------------ Raj Kumar's table and the other books ---
assert.deepEqual(Object.keys(T.RAJ_KUMAR_EFFECTS), ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu']);
assert.equal(FIX.rajKumarTable21.rowsInOrder[4], '(label lost at the page break)');
assert.ok(T.PADA88_DIFFERENCES.some((d) => d.id === 'JUPITER_ROW'), 'the lost label is recorded');
const kp = T.STATEMENTS.KALAPRAKASIKA.items;
assert.deepEqual(kp.map((i) => i.id), Object.keys(FIX.kalaprakasika.pages));
for (const i of kp) assert.ok(i.source.pageLocus.startsWith(FIX.kalaprakasika.pages[i.id]), `Kalaprakasika ${i.id} page`);
assert.ok(kp.find((i) => i.id === 'REMEDY').source.pageLocus.includes(FIX.kalaprakasika.remedyParenthesis));
assert.ok(T.STATEMENTS.SHUBHAKARAN.sources[0].pageLocus.includes(`rule ${FIX.shubhakaran.rule}`));

// ------------------------------------------------ the engine against the sky ---
{
  const atMs = Date.UTC(2026, 9, 8);
  const natalLon = pada('Rohini|3') * PADA + 1.5;
  const t0 = Date.now();
  const r = pada88({ natalMoonLongitude: natalLon, atMs });
  const elapsed = Date.now() - t0;
  assert.equal(r.target.pada108, pada('Uttarabhadrapada|2'), 'Raj Kumar\'s example through the engine');
  assert.equal(r.target.signTa, 'மீனம்');
  for (const x of r.today) {
    assert.equal(x.pada108, padaAt(x.planet, atMs), `${x.planet} today`);
    assert.equal(x.inPada, x.pada108 === r.target.pada108);
  }
  for (const w of r.windows) {
    const a = Date.parse(w.fromUtc); const b = Date.parse(w.toUtc); const mid = (a + b) / 2;
    assert.equal(padaAt(w.planet, mid), r.target.pada108, `${w.planet} ${w.fromUtc}: in the pada`);
    if (!w.openStart) assert.notEqual(padaAt(w.planet, a - 120000), r.target.pada108, `${w.planet} ${w.fromUtc}: enters`);
    if (!w.openEnd) assert.notEqual(padaAt(w.planet, b + 120000), r.target.pada108, `${w.planet} ${w.toUtc}: leaves`);
    if (w.planet === 'Jupiter') { assert.equal(w.jupiterAspect, null); continue; }
    const s = [a, mid, b - 1].map((ms) => jupiterAspects(r.target.sign, ms));
    assert.equal(w.jupiterAspect, s.every(Boolean) ? 'ALL' : s.some(Boolean) ? 'PART' : 'NONE');
  }
  const moon = r.windows.filter((w) => w.planet === 'Moon');
  assert.ok(moon.length >= 12 && moon.length <= 15, `the Moon passes about monthly (${moon.length})`);
  for (const m of moon) assert.ok(m.days > 0.18 && m.days < 0.32, `a Moon passage lasts about six hours (${m.days})`);
  for (const p of ['Sun', 'Mars', 'Mercury', 'Venus', 'Jupiter', 'Saturn', 'Rahu', 'Ketu']) assert.ok(r.windows.some((w) => w.planet === p), `${p} passes in its span`);
  for (const c of r.together) {
    const mid = (Date.parse(c.fromUtc) + Date.parse(c.toUtc)) / 2;
    const live = r.windows.filter((w) => Date.parse(w.fromUtc) <= mid && mid < Date.parse(w.toUtc)).map((w) => w.planet).sort();
    assert.deepEqual(live, c.planets, `together ${c.fromUtc}`);
  }
  assert.ok(elapsed < 3000, `fast enough (${elapsed} ms)`);
  console.log(`  engine: ${r.windows.length} windows, ${r.together.length} together, in ${elapsed} ms`);
}
// Jupiter's aspect by sign: from Aries he aspects Leo (5), Libra (7), Sagittarius (9).
{
  const ms = Date.UTC(2026, 9, 8);
  const j = Math.floor(lon('Jupiter', ms) / 30) % 12;
  const want = [4, 6, 8].map((k) => (j + k) % 12);
  for (let s = 0; s < 12; s += 1) assert.equal(jupiterAspects(s, ms), want.includes(s), `sign ${s}`);
}

// ------------------------------------------------ order and citations ---
assert.deepEqual(plain(T.PADA88_RANK.words), FIX.wordCounts);
assert.deepEqual([...T.PADA88_RANK.order], Object.keys(FIX.wordCounts).sort((a, b) => FIX.wordCounts[b] - FIX.wordCounts[a]));
const cites = [];
const walk = (o) => { if (o && typeof o === 'object') { if (typeof o.pageLocus === 'string') cites.push(o); Object.values(o).forEach(walk); } };
walk(T);
assert.ok(cites.length >= 8);
for (const c of cites) assert.ok(resolveByTitle(c.title), `registered: ${c.title}`);

console.log('test-pada88: all checks passed');
