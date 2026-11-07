const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const T = require('./src/report/bandOfYearsTables');
const { bandOfYears, bandsOf, thirdsOf, progressionOf, contactsOf, yearOfLife, PLANETS } = require('./src/report/bandOfYears');
const { planetLongitude } = require('./src/ephemeris/siderealPositions');
const { resolveByTitle } = require('./src/sources/registry');

const FIX = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/band-of-years/books.json'), 'utf8'));
const DAY = 86400000;
const YEAR = 365.25 * DAY;

// ------------------------------------------------ the tables ---
{
  assert.deepEqual({ ...T.SPANS }, FIX.lalKitabSpans);
  assert.equal(Object.values(T.SPANS).reduce((a, b) => a + b, 0), T.CYCLE_YEARS);
  assert.deepEqual([...T.ORDERS.JUPITER_FIRST.sequence], FIX.lalKitabOrder);
  assert.deepEqual(JSON.parse(JSON.stringify(T.INTERVENING)), FIX.intervening_Gosvami_p78);
  assert.deepEqual(FIX.intervening_Gosvami_p78, FIX.intervening_Mahajan_p26, 'the two books\' tables agree');
  // Saturn-first gives Raj Kumar's Table 3 …
  const bands = bandsOf(0, 'SATURN_FIRST');
  for (const [p, [a, b]] of Object.entries(FIX.rajKumarTable3)) {
    const band = bands.find((x) => x.planet === p && x.cycle === 1);
    assert.deepEqual([band.fromYear, band.toYear], [a, b], p);
  }
  // … his "Ketu is also ruler of 48-50th year", and Mahajan's "total years" column as the first year of each band.
  assert.deepEqual((({ fromYear, toYear }) => [fromYear, toYear])(bands.find((x) => x.planet === 'Ketu' && x.cycle === 2)), FIX.rajKumarKetuSecondCycle);
  for (const [p, y] of Object.entries(FIX.mahajanTotalYears_p24)) assert.ok(bands.some((x) => x.planet === p && x.fromYear === y), `${p} starts in year ${y}`);
  // Bands tile three cycles.
  for (const id of T.ORDERS.order) {
    const bs = bandsOf(0, id);
    assert.equal(bs.length, 27);
    assert.equal(bs[0].fromYear, 1);
    assert.equal(bs[26].toYear, 105);
    for (let i = 1; i < bs.length; i += 1) { assert.equal(bs[i].fromYear, bs[i - 1].toYear + 1); assert.equal(bs[i].fromMs, bs[i - 1].toMs); }
  }
  assert.equal(T.ORDERS.default, 'SATURN_FIRST');
  assert.deepEqual([...T.RANK.order], Object.keys(T.RANK.words).sort((a, b) => T.RANK.words[b] - T.RANK.words[a]));
  for (const list of Object.values(T.SOURCES)) for (const s of list) assert.ok(resolveByTitle(s.title), `registered: ${s.title}`);
  // Thirds.
  const jb = bandsOf(0, 'JUPITER_FIRST')[0];
  const th = thirdsOf(jb);
  assert.deepEqual(th.map((x) => x.planet), ['Ketu', 'Jupiter', 'Sun']);
  assert.equal(th[1].toMs - th[1].fromMs, 2 * YEAR);
}

// ------------------------------------------------ Raj Kumar's example ---
{
  const E = FIX.rajKumarExample;
  const birth = Date.parse(E.birth);
  const venus = 210 + E.venusDegInScorpio;
  const band = bandsOf(birth, 'SATURN_FIRST').find((b) => b.planet === 'Venus' && b.cycle === 1);
  assert.equal(new Date(band.fromMs).toISOString().slice(0, 10), '1970-10-16', 'the 25th year');
  const prog = progressionOf(band, venus);
  const days = (s) => (s.toMs - s.fromMs) / DAY;
  assert.ok(Math.abs(days(prog.stages[1]) - E.daysPerSign) < 0.02, '365.25 × 3 / 12');
  assert.ok(Math.abs(days(prog.stages[0]) - E.firstStageDays) < 0.05, '24° of Scorpio');
  assert.deepEqual(prog.stages.map((s) => s.sign), [7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7]);
  // His remainder: 365.25 × 3 − 1077.34 = 18.41 (he prints 18.34); exactly, 6/30 of 91.31 = 18.26.
  assert.ok(Math.abs(days(prog.stages[12]) - 18.2625) < 0.01);
  // On the wedding day progressed Venus is in Leo by his arithmetic, not "Libra".
  const wed = Date.parse(`${E.marriage}T12:00:00Z`);
  const at = prog.stages.find((s) => s.fromMs <= wed && wed < s.toMs);
  assert.equal(at.sign, 4, 'Leo');
  const libra = prog.stages.find((s) => s.sign === 6);
  assert.equal(new Date(libra.fromMs).toISOString().slice(0, 10), '1973-06-28');
  assert.equal(new Date(libra.toMs).toISOString().slice(0, 10), '1973-09-27');
  // The child in the 29th year: Mars's band (28-33).
  assert.equal(yearOfLife(birth, Date.parse(`${E.childBirth}T12:00:00Z`)), 29);
  assert.equal(bandsOf(birth, 'SATURN_FIRST').find((b) => b.fromMs <= Date.parse(`${E.childBirth}T12:00:00Z`) && Date.parse(`${E.childBirth}T12:00:00Z`) < b.toMs).planet, 'Mars');
}

// ------------------------------------------------ contacts and the engine ---
{
  const natal = { Sun: 10, Moon: 50, Mars: 100, Mercury: 15, Jupiter: 200, Venus: 216, Saturn: 300, Rahu: 120, Ketu: 300 };
  const band = { planet: 'Venus', fromMs: 0, toMs: 3 * YEAR };
  const prog = progressionOf(band, natal.Venus);
  const cs = contactsOf(band, natal, prog);
  // Every contact window: the progressed Venus really is in the planet's sign / star, or aspects its sign.
  for (const c of cs) {
    const mid = (c.fromMs + c.toMs) / 2;
    const lon = prog.lonAt(mid);
    const target = natal[c.planet];
    if (c.kind === 'SIGN') assert.equal(Math.floor(lon / 30), Math.floor(target / 30), `${c.planet} sign`);
    if (c.kind === 'STAR') assert.equal(Math.floor(lon / (360 / 27)), Math.floor(target / (360 / 27)), `${c.planet} star`);
    if (c.kind === 'ASPECT') assert.equal((Math.floor(lon / 30) + 6) % 12, Math.floor(target / 30), `${c.planet} aspect`);
  }
  // Each other planet: one sign window (two when it shares the ruler's birth sign), one or two star windows.
  for (const p of PLANETS.filter((x) => x !== 'Venus')) {
    const sign = cs.filter((c) => c.planet === p && c.kind === 'SIGN');
    const sumDays = sign.reduce((a, c) => a + (c.toMs - c.fromMs), 0) / DAY;
    assert.ok(Math.abs(sumDays - 3 * 365.25 / 12) < 0.01, `${p}: a sign is 1/12 of the band`);
  }

  // The engine: the year, the current band, the transit position.
  const birth = Date.parse('1990-05-15T02:00:00Z');
  const atMs = Date.parse('2026-10-11T06:00:00Z');
  const r = bandOfYears({ birthMs: birth, natalLongitudes: natal, natalLagnaLongitude: 40, atMs });
  assert.equal(r.yearOfLife, 37);
  assert.equal(r.cycle, 2);
  const now = r.orders.SATURN_FIRST.now;
  assert.equal(now.band.planet, 'Saturn', 'year 37 = year 2 of the second cycle');
  assert.equal(r.orders.JUPITER_FIRST.now.band.planet, 'Jupiter');
  assert.equal(now.thirds.filter((x) => x.current).length, 1);
  assert.equal(now.progression.stages.filter((x) => x.current).length, 1);
  const jd = atMs / DAY + 2440587.5;
  assert.equal(now.transit.sign, Math.floor(planetLongitude(jd, 'Saturn', 'Lahiri') / 30));
  assert.equal(now.natal.house, ((Math.floor(300 / 30) - 1 + 12) % 12) + 1);
  assert.deepEqual(now.natal.owns, [9, 10], 'Saturn owns Capricorn and Aquarius: the 9th and 10th from Taurus');
}

console.log('test-band-of-years: all checks passed');
