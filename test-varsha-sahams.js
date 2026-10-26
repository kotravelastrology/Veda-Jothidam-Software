const assert = require('assert');
const fs = require('fs');
const T = require('./src/report/varshaInterpretationTables');
const S = require('./src/report/varshaSahams');
const V = require('./src/report/varshaphala');

// the embedded table is the fixture
assert.deepStrictEqual(T, JSON.parse(fs.readFileSync('./fixtures/varshaphala/tajika-bhushana.json', 'utf8')));
const F = T.sahams.formulas;
assert.strictEqual(F.length, 19);
// verse order: v.1 punya rajya | v.2 jiva mrityu | v.3 matri bhratri | v.4 pitri putra | v.5 yasha bala | v.6 vidya gaurava | v.7 karma paradesha | v.8 dhana labha | v.9 karyasiddhi | v.10 stri vyapara
assert.deepStrictEqual(F.map((f) => f.verse), ['v.1', 'v.1', 'v.2', 'v.2', 'v.3', 'v.3', 'v.4', 'v.4', 'v.5', 'v.5', 'v.6', 'v.6', 'v.7', 'v.7', 'v.8', 'v.8', 'v.9', 'v.10', 'v.10']);
assert.deepStrictEqual(F.map((f) => f.key), ['punya', 'rajya', 'jiva', 'mrityu', 'matri', 'bhratri', 'pitri', 'putra', 'yasha', 'bala', 'vidya', 'gaurava', 'karma', 'paradesha', 'dhana', 'labha', 'karyasiddhi', 'stri', 'vyapara']);
for (const f of F) assert.ok(f.operands.length === 3 && ['DAY', 'BOTH'].includes(f.when) && f.printedPage && f.textTa.length > 20, f.key);
// pages never run backwards
const pages = F.map((f) => Number(f.printedPage.split('-')[0]));
assert.deepStrictEqual([...pages].sort((a, b) => a - b), pages);
assert.strictEqual(T.sahams.reading.verse, 'v.11');

// a chart built by hand: every planet at a round longitude so the arithmetic is checkable
const NAMES = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const LON = { Sun: 100, Moon: 200, Mars: 20, Mercury: 110, Jupiter: 250, Venus: 330, Saturn: 40, Rahu: 0, Ketu: 180 };
function mk(time) {
  const grahas = {};
  for (const p of NAMES) grahas[p] = { longitude: LON[p], rasiIndex: Math.floor(LON[p] / 30), degreeInSign: LON[p] % 30 };
  const cusps = [0, ...Array.from({ length: 12 }, (_, i) => (15 + i * 30) % 360)]; // cusp n at 15 + (n-1)*30
  return {
    yearsElapsed: 10, muntha: { rasiIndex: 5, lord: 'Mercury' }, natal: { lagnaDegree: 12 }, solarReturn: { time },
    varshaChart: { lagna: { longitude: 15, rasiIndex: 0 }, grahas, cusps }, sahams: [],
  };
}
const day = S.varshaSahams(mk('10:00'));
const night = S.varshaSahams(mk('22:00'));
assert.strictEqual(day.isDay, true);
assert.strictEqual(night.isDay, false);
const val = (o, k) => o.sahams.find((s) => s.key === k).longitude;
const n = (x) => ((x % 360) + 360) % 360;
// day: punya = Moon - Sun + L = 200 - 100 + 15 = 115; night reverses: Sun - Moon + L = -85 + 15 = 290
assert.strictEqual(val(day, 'punya'), 115);
assert.strictEqual(val(night, 'punya'), n(100 - 200 + 15));
// rajya (printed p.68): Saturn - Sun + L by day = 40 - 100 + 15 = 315
assert.strictEqual(val(day, 'rajya'), n(40 - 100 + 15));
// jiva: Saturn - Jupiter + janma lagna: janma lagna sign = muntha 5 - 10 years = 7 (Scorpio), degree 12 -> 222; 40 - 250 + 222 = 12
assert.strictEqual(val(day, 'jiva'), n(40 - 250 + 222));
// mrityu both ways: H8 - Moon + Saturn: cusp 8 = 15 + 7*30 = 225; 225 - 200 + 40 = 65
assert.strictEqual(val(day, 'mrityu'), 65);
assert.strictEqual(val(night, 'mrityu'), 65);
// the same-for-both formulas do not change at night
for (const k of ['bhratri', 'pitri', 'putra', 'dhana', 'labha', 'stri', 'vyapara', 'mrityu']) assert.strictEqual(val(day, k), val(night, k), k);
// the day-only formulas reverse at night
for (const k of ['punya', 'rajya', 'matri', 'vidya', 'karma']) {
  const f = F.find((x) => x.key === k);
  assert.strictEqual(f.when, 'DAY');
}
assert.strictEqual(val(day, 'matri'), n(200 - 330 + 15));
assert.strictEqual(val(night, 'matri'), n(330 - 200 + 15));
// yasha uses the punya saham: day punya 115 - Jupiter 250 + 15 = 240; bala = Mars - punya + L = 20 - 115 + 15 = 280
assert.strictEqual(val(day, 'yasha'), n(115 - 250 + 15));
assert.strictEqual(val(day, 'bala'), n(20 - 115 + 15));
// dhana: lord of the 2nd sign (cusp 2 = 45 = Taurus, lord Venus 330) - cusp 2 (45) + L (15) = 300
assert.strictEqual(val(day, 'dhana'), n(330 - 45 + 15));
// labha: L - lagna lord (Aries -> Mars 20) + L = 15 - 20 + 15 = 10
assert.strictEqual(val(day, 'labha'), 10);
// stri: Venus - lord of the 7th (cusp 7 = 195 = Libra, lord Venus 330) + cusp 7 = 330 - 330 + 195 = 195
assert.strictEqual(val(day, 'stri'), 195);
// karyasiddhi: by day Sun - Saturn + the Sun's sign lord (Sun at 100 = Cancer, lord Moon 200) = 100 - 40 + 200 = 260; the night rule is left unclear
assert.strictEqual(val(day, 'karyasiddhi'), 260);
assert.strictEqual(night.sahams.find((s) => s.key === 'karyasiddhi').status, 'NEEDS_NIGHT_OR_UNCLEAR'.replace('NEEDS_NIGHT_OR_UNCLEAR', 'NIGHT_UNCLEAR'));
// paradesha: lord of the punya saham's sign (115 = Cancer, Moon 200) - punya 115 + L 15 = 100
assert.strictEqual(val(day, 'paradesha'), n(200 - 115 + 15));

// the comparison with the app's table on a real chart: same where the formulas agree, 30 degrees where only the correction differs
const birth = { name: 'A', year: 1990, month: 10, day: 5, hour: 4, minute: 30, latitude: 13.0827, longitude: 80.2707, utcOffsetMinutes: 330, ianaTimeZone: 'Asia/Kolkata', placeName: 'Chennai', calendarMode: 'tirukanita' };
for (const age of [20, 36]) {
  const v = V.calculateVarshaphala(birth, age);
  const o = S.varshaSahams(v);
  assert.strictEqual(o.sahams.length, 19);
  for (const s of o.sahams) {
    assert.ok(s.status === 'COMPUTED' || s.status === 'NIGHT_UNCLEAR', s.key);
    if (s.status === 'COMPUTED') { assert.ok(s.longitude >= 0 && s.longitude < 360); assert.strictEqual(s.signIndex, Math.floor(s.longitude / 30)); }
  }
  // the app and the book agree on the three formulas that read the same in both: punya, matri, karma (before the +30 correction)
  for (const k of ['punya', 'matri', 'karma']) {
    const s = o.sahams.find((x) => x.key === k);
    assert.ok(s.app && (s.app.same || s.app.onlyThe30), `${k} age ${age}`);
  }
  // yasha and stri have no counterpart in the app
  assert.strictEqual(o.sahams.find((x) => x.key === 'yasha').app, null);
  assert.strictEqual(o.sahams.find((x) => x.key === 'stri').app, null);
}
console.log('test-varsha-sahams ok');
