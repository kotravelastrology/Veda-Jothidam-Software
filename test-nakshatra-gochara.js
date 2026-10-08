const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const T = require('./src/report/nakshatraGocharaTables');
const { nakshatraGochara, classOf } = require('./src/report/nakshatraGochara');
const { planetLongitude, nodeLongitude, sunriseJulianDay } = require('./src/ephemeris/siderealPositions');
const { resolveByTitle } = require('./src/sources/registry');

const FIX = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/gochara-vedha/nakshatra-gochara.json'), 'utf8'));
const DAY = 86400000;
const plain = (o) => JSON.parse(JSON.stringify(o));
const nums = (s) => (s ? s.split(',').map(Number) : []);
const ranges = (rows) => rows.map(([f, t]) => `${f}-${t}`);

// ------------------------------------------------ Pulippani's Table 16 and taras ---
for (const row of FIX.pulippaniTable16.rows) {
  const [p, good, bad] = row.split('|');
  assert.deepEqual(plain(T.PULIPPANI_STAR_CLASS[p]), { good: nums(good), bad: nums(bad) }, `Table 16 ${p}`);
  for (const n of nums(good)) assert.ok(!nums(bad).includes(n), `${p}: a star is not both`);
}
assert.equal(T.TARAS.length, 9);
assert.deepEqual(T.TARAS.map((t) => t.pulippaniResultTa.length > 0), Array(9).fill(true));
assert.equal(FIX.pulippaniTaraResults.length, 9);
assert.equal(FIX.bhatTaraNames.length, 9);

// ------------------------------------------------ anga: the ranges, book by book ---
for (const [book, planets] of Object.entries(FIX.anga)) {
  for (const [planet, rows] of Object.entries(planets)) {
    if (planet === 'page') continue;
    const mine = T.ANGA[book].rows[planet];
    if (book === 'SUDAMANI') {
      // The verse's limb counts, accumulated from the natal star.
      let n = 1;
      const want = rows.map(([, k]) => { const s = `${n}-${n + k - 1}`; n += k; return s; });
      assert.equal(n - 1, 27, `Sudamani ${planet}: the verse's counts add to 27`);
      assert.deepEqual(ranges(mine), want, `Sudamani ${planet}`);
    } else {
      assert.deepEqual(ranges(mine), rows.map((r) => r.split('|')[0]), `${book} ${planet}`);
    }
  }
  // Mercury, Jupiter, Venus share a row; Saturn, Rahu, Ketu too (Sudamani: Saturn only).
  if (book !== 'SUDAMANI') {
    assert.deepEqual(ranges(T.ANGA[book].rows.Jupiter), ranges(T.ANGA[book].rows.Mercury));
    assert.deepEqual(ranges(T.ANGA[book].rows.Ketu), ranges(T.ANGA[book].rows.Saturn));
  }
}
assert.equal(T.ANGA.SUDAMANI.rows.Moon, undefined, 'no Moon verse in Sudamani');
assert.equal(T.ANGA.SUDAMANI.rows.Rahu, undefined, 'Sudamani\'s verse names Saturn only');

// Every count 1-27 is covered — by exactly one row, except the printed slips.
const coverage = (rows) => Array.from({ length: 27 }, (_, i) => rows.filter(([f, t]) => i + 1 >= f && i + 1 <= t).length);
for (const book of Object.keys(T.ANGA)) {
  for (const [planet, rows] of Object.entries(T.ANGA[book].rows)) {
    const c = coverage(rows);
    const zero = c.map((x, i) => (x === 0 ? i + 1 : null)).filter(Boolean);
    const twice = c.map((x, i) => (x > 1 ? i + 1 : null)).filter(Boolean);
    const want = book === 'PULIPPANI' && planet === 'Moon' ? { zero: [], twice: [24] }
      : book === 'PULIPPANI' && ['Saturn', 'Rahu', 'Ketu'].includes(planet) ? { zero: [], twice: [25] }
        : book === 'GOUR' && ['Saturn', 'Rahu', 'Ketu'].includes(planet) ? { zero: [9, 10, 11], twice: [] }
          : { zero: [], twice: [] };
    assert.deepEqual({ zero, twice }, want, `${book} ${planet}: coverage`);
  }
}
// Bhat and Gour agree row for row (Gour drops Saturn's 9-11).
for (const p of ['Sun', 'Moon', 'Mars', 'Mercury']) assert.deepEqual(ranges(T.ANGA.GOUR.rows[p]), ranges(T.ANGA.BHAT.rows[p]));
assert.deepEqual(ranges(T.ANGA.GOUR.rows.Saturn), ranges(T.ANGA.BHAT.rows.Saturn).filter((x) => x !== '9-11'));

// ------------------------------------------------ the books' examples ---
{
  const v = FIX.examples.pulippaniVenus;
  // Hasta is the 13th star (index 12), Mrigashira the 5th (index 4).
  const count = ((4 - 12 + 27) % 27) + 1;
  assert.equal(count, v.count);
  assert.equal(T.TARAS[((count - 1) % 9)].pulippaniTa, 'சம்பத்');
  const s = FIX.examples.pulippaniSaturn;
  const c2 = ((21 - 13 + 27) % 27) + 1; // Chitra index 13, Shravana index 21
  assert.equal(c2, s.count);
  const row = T.ANGA.PULIPPANI.rows.Saturn.find(([f, t]) => c2 >= f && c2 <= t);
  assert.deepEqual([row[2], row[3]], ['வலக் கால்', 'இழப்பு'], 'Pulippani: right leg, loss');
  const srow = T.ANGA.SUDAMANI.rows.Saturn.find(([f, t]) => c2 >= f && c2 <= t);
  assert.deepEqual([srow[2], srow[3]], ['கால்', 'யாத்திரை'], 'Sudamani: legs, travel');
}

// ------------------------------------------------ order, weekday, citations ---
assert.deepEqual(plain(T.ANGA_RANK.words), FIX.wordCounts);
assert.deepEqual([...T.ANGA_RANK.order], Object.keys(FIX.wordCounts).sort((a, b) => FIX.wordCounts[b] - FIX.wordCounts[a]));
assert.equal(T.WEEKDAY.results.length, FIX.weekdayCount);
const cites = [];
const walk = (o) => { if (o && typeof o === 'object') { if (typeof o.pageLocus === 'string') cites.push(o); Object.values(o).forEach(walk); } };
walk(T);
for (const c of cites) assert.ok(resolveByTitle(c.title), `registered: ${c.title}`);

// ------------------------------------------------ the engine against the sky ---
{
  const atMs = Date.UTC(2026, 9, 8);
  const place = { latitude: 11.34, longitude: 77.72, utcOffsetMinutes: 330 };
  const natal = 48; // Rohini
  const t0 = Date.now();
  const r = nakshatraGochara({ natalMoonLongitude: natal, birthPlace: place, atMs, years: 5 });
  const elapsed = Date.now() - t0;
  const lon = (p, ms) => {
    const jd = ms / DAY + 2440587.5;
    if (p === 'Rahu') return nodeLongitude(jd, 'Lahiri', 'mean');
    if (p === 'Ketu') return (nodeLongitude(jd, 'Lahiri', 'mean') + 180) % 360;
    return planetLongitude(jd, p, 'Lahiri');
  };
  const star = (p, ms) => Math.floor((((lon(p, ms) % 360) + 360) % 360) / (360 / 27)) % 27;
  const janma = Math.floor(natal / (360 / 27));
  for (const p of Object.values(r.planets)) {
    assert.equal(p.stays.filter((s) => s.current).length, 1, `${p.planet}: one current star`);
    for (const s of p.stays) {
      const mid = (Date.parse(s.fromUtc) + Date.parse(s.toUtc)) / 2;
      assert.equal(star(p.planet, mid), s.star27, `${p.planet} in ${s.starTa} mid-stay`);
      assert.equal(s.count, ((s.star27 - janma + 27) % 27) + 1);
      assert.equal(s.tara, ((s.count - 1) % 9) + 1);
      assert.equal(s.starClass, classOf(p.planet, s.count));
      for (const [book, idx] of Object.entries(s.anga)) {
        if (idx === null) { assert.equal(p.angaTables[book], null); continue; }
        assert.ok(idx.length >= (book === 'GOUR' && p.angaTables.GOUR.length === 8 && s.count >= 9 && s.count <= 11 ? 0 : 1), `${p.planet} ${book} count ${s.count}`);
        for (const i of idx) assert.ok(s.count >= p.angaTables[book][i].from && s.count <= p.angaTables[book][i].to);
      }
      for (const c of s.combination) {
        const rule = T.COMBINATION.rules.find((x) => x.id === c.id);
        assert.ok(rule.houses.includes(c.house) && s.houses.includes(c.house) && rule.nature === s.nature && rule.star === s.starClass);
      }
    }
  }
  assert.ok(r.weekday.list.length >= 11 && r.weekday.list.length <= 15, 'the natal star runs at sunrise about once a month');
  for (const w of r.weekday.list) {
    assert.equal(star('Moon', Date.parse(w.sunriseUtc)), janma, `${w.dateLocal}: natal star at sunrise`);
    assert.equal(new Date(`${w.dateLocal}T00:00:00Z`).getUTCDay(), w.weekday);
    const jd0 = (Date.parse(`${w.dateLocal}T00:00:00Z`) - place.utcOffsetMinutes * 60000) / DAY + 2440587.5;
    assert.ok(Math.abs((sunriseJulianDay(jd0, place.latitude, place.longitude) - 2440587.5) * DAY - Date.parse(w.sunriseUtc)) < 1000);
  }
  console.log(`  engine: ${Object.values(r.planets).reduce((a, p) => a + p.stays.length, 0)} stays, ${r.weekday.list.length} natal-star days in ${elapsed} ms`);
}

console.log('test-nakshatra-gochara: all checks passed');
