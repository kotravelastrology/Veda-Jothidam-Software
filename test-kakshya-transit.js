const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const T = require('./src/report/kakshyaTransitTables');
const S = require('./src/report/saturnAshtakavarga');
const { kakshyaTransit, afflictionOf, SCAN } = require('./src/report/kakshyaTransit');
const { planetLongitude } = require('./src/ephemeris/siderealPositions');
const { citeTa } = require('./src/sources/citeTa');

const FIX = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/saturn-transit/ashtakavarga-patel.json'), 'utf8'));
const DAY = 86400000;
const lon = ([s, d, m]) => s * 30 + d + m / 60;
const norm = (x) => ((x % 360) + 360) % 360;
const sep = (a, b) => Math.abs(norm(a - b + 180) - 180);
const plain = (o) => JSON.parse(JSON.stringify(o));

const c = FIX.standardHoroscope;
const natal = {
  lagnaLongitude: lon(c.lagna), mcLongitude: lon(c.mc),
  longitudes: Object.fromEntries(Object.entries(c.planets).map(([p, v]) => [p, lon(v)])),
};
const AT = Date.parse('2026-10-21T06:00:00Z');

// ------------------------------------------------------------------ the doctrine, as printed ---
assert.deepEqual([...T.PLANETS], ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']);
assert.deepEqual([...T.STRENGTH_ORDER], ['Sun', 'Moon', 'Jupiter', 'Venus', 'Mars', 'Mercury', 'Saturn'], 'p.72: the natural order of strength');
assert.deepEqual(plain(T.TOGETHER.BINDU), { 4: 'செல்வம் சேரும்', 5: 'மதிப்பு, நல்ல உடல்நலம், ஆடை லாபம்', 6: 'முடிசூட்டு', 7: 'அரசாட்சி பெறுதல்' });
assert.deepEqual(Object.keys(T.TOGETHER.VOID), ['4', '5', '6', '7']);
assert.deepEqual(Object.keys(T.BHAVA_EXTREMES).sort(), ['0', '1', '7', '8']);
// p.71: the average times, in days — Sun 3¾, Moon 6¾ hours, Mars 5, Mercury 2½, Jupiter 1½ months, Venus 3, Saturn 3¾ months.
assert.deepEqual(plain(T.AVERAGE_DAYS), { Sun: 3.75, Moon: 0.28125, Mars: 5, Mercury: 2.5, Jupiter: 45, Venus: 3, Saturn: 112.5 });
// The slow planets' printed averages are their sidereal periods over 96 Kakshyas, to a few per cent.
for (const [p, years] of Object.entries({ Sun: 1, Moon: 27.321661 / 365.25, Jupiter: 11.862, Saturn: 29.457 })) {
  const calc = (years * 365.25) / 96;
  assert.ok(Math.abs(calc - T.AVERAGE_DAYS[p]) / T.AVERAGE_DAYS[p] < 0.025, `${p}: ${calc} vs ${T.AVERAGE_DAYS[p]}`);
}
for (const k of ['AVERAGE', 'SLOKA_5', 'SLOKAS_6_10', 'SLOKA_11', 'SLOKA_14', 'STRENGTH_ORDER']) {
  const line = citeTa(T.SOURCES[k]);
  assert.ok(/Patel|Ashtakavarga/.test(line) && !/PDF/.test(line) && /ப\.\d+/.test(line), line);
}
assert.match(citeTa(T.SOURCES.AVERAGE), /ப\.71/);
assert.match(citeTa(T.SOURCES.SLOKAS_6_10), /ப\.72/);
assert.match(citeTa(T.SOURCES.SLOKA_14), /ப\.74-75/);

// ------------------------------------------------------------------ the engine, both methods ---
for (const method of ['PATEL_BHAVA', 'SIGN']) {
  const r = kakshyaTransit({ natal, atMs: AT, method });
  const bhava = method === 'PATEL_BHAVA';
  const units = bhava ? 12 : 12;
  assert.equal(r.planets.length, 7);
  assert.equal(r.method.division, bhava ? 'BHAVA' : 'SIGN');
  const lords = T.KAKSHYA_METHODS[method].lords;
  // Every planet's bindu is recomputed from the planet's own Prastara and the lord of its Kakshya.
  const placed = S.natalPlacements(natal);
  const pos = bhava ? placed.bhava : placed.sign;
  for (const p of r.planets) {
    const pr = S.prastara(p.planet, pos, bhava ? require('./src/report/saturnAshtakavargaTables').PATEL_BINDU_DIFFERENCES : {});
    assert.equal(p.lord, lords[p.kakshya - 1], `${p.planet}: the Kakshya lord`);
    assert.equal(p.bindu, pr.rows[p.lord].includes(p.unit), `${p.planet}: bindu`);
    assert.equal(p.bhavaBindus, pr.bav[p.unit], `${p.planet}: the bhava's bindus`);
    assert.ok(p.unit >= 0 && p.unit < units && p.kakshya >= 1 && p.kakshya <= 8);
    assert.equal(p.standing, !p.bindu ? 'VOID' : p.affliction.afflicted ? 'SORROW' : 'BINDU');
    // The longitude agrees with the ephemeris.
    const jd = AT / DAY + 2440587.5;
    assert.ok(sep(p.longitude, planetLongitude(jd, p.planet, 'Lahiri')) < 1e-6, `${p.planet}: longitude`);
    assert.equal(p.rasiIndex, Math.floor(p.longitude / 30));
  }
  assert.equal(r.bhavaBindus.Sun.reduce((a, b) => a + b, 0) > 0, true);
  // Slokas 6-10.
  const nb = r.planets.filter((p) => p.bindu).length;
  assert.equal(r.together.binduCount, nb);
  assert.equal(r.together.voidCount, 7 - nb);
  assert.equal(r.together.binduText, nb >= 4 ? T.TOGETHER.BINDU[nb] : null);
  assert.equal(r.together.voidText, 7 - nb >= 4 ? T.TOGETHER.VOID[7 - nb] : null);
  assert.equal(r.together.moreThanThree, nb > 3);
  assert.equal(r.together.deathCertain, false, 'death is certain only with all seven in void Kakshyas');

  // The windows: contiguous, one current, each with the right lord and bindu.
  for (const planet of T.PLANETS) {
    const w = r.windows[planet];
    assert.ok(w.list.length >= 3, `${planet}: ${w.list.length} windows`);
    assert.equal(w.list.filter((x) => x.current).length, 1, `${planet}: one current window`);
    for (let i = 1; i < w.list.length; i += 1) assert.equal(w.list[i].fromUtc, w.list[i - 1].toUtc, `${planet}: windows are contiguous`);
    const pr = S.prastara(planet, pos, bhava ? require('./src/report/saturnAshtakavargaTables').PATEL_BINDU_DIFFERENCES : {});
    const nowP = r.planets.find((p) => p.planet === planet);
    for (const x of w.list) {
      assert.equal(x.lord, lords[x.kakshya - 1]);
      assert.equal(x.bindu, pr.rows[x.lord].includes(x.unit), `${planet}: window bindu`);
      if (x.current) assert.deepEqual([x.unit, x.kakshya, x.bindu], [nowP.unit, nowP.kakshya, nowP.bindu], `${planet}: the current window is where it stands`);
    }
    // A window's edges are the Kakshya's edges: the planet is at the part's boundary then (a minute's motion).
    const mid = w.list.find((x) => !x.openStart && !x.openEnd);
    const jdFrom = Date.parse(mid.fromUtc) / DAY + 2440587.5;
    const there = norm(planetLongitude(jdFrom, planet, 'Lahiri'));
    assert.ok(Math.min(sep(there, mid.fromLon), sep(there, mid.toLon)) < 0.05, `${planet}: at its window's start the planet is at an edge of the part`);
    assert.ok(w.span.fromUtc < w.span.toUtc);
  }
  // The Moon crosses a Kakshya in about 6¾ hours (p.71); the Sun in about 3¾ days.
  assert.ok(Math.abs(r.windows.Moon.meanDays - 27.3217 / 96) < (bhava ? 0.08 : 0.01), `Moon ${r.windows.Moon.meanDays}`);
  assert.ok(r.windows.Moon.wholeWindows >= 15);
  assert.ok(r.windows.Sun.meanDays > 3 && r.windows.Sun.meanDays < 5, `Sun ${r.windows.Sun.meanDays}`);
}

// The sign method's Kakshyas are equal parts of 3°45′: the Moon's mean is the printed 6¾ hours to a few per cent.
{
  const r = kakshyaTransit({ natal, atMs: AT, method: 'SIGN' });
  assert.ok(Math.abs(r.windows.Moon.meanDays - T.AVERAGE_DAYS.Moon) / T.AVERAGE_DAYS.Moon < 0.04, `Moon mean ${r.windows.Moon.meanDays} d`);
  for (const x of r.windows.Moon.list.filter((w) => !w.openStart && !w.openEnd)) assert.ok(Math.abs(norm(x.toLon - x.fromLon) - 3.75) < 1e-9 || Math.abs(norm(x.toLon - x.fromLon) - 3.75) < 1e-6);
}

// Patel's own Sun in the standard horoscope: the Lagna bhava's four bindu Kakshyas are Jupiter, Mars, Sun, Mercury (p.68),
// found here through the same prastara and Kakshya parts the windows use.
{
  const placed = S.natalPlacements(natal);
  const pr = S.prastara('Sun', placed.bhava, require('./src/report/saturnAshtakavargaTables').PATEL_BINDU_DIFFERENCES);
  const lords = T.KAKSHYA_METHODS.PATEL_BHAVA.lords;
  const parts = S.kakshyaParts('BHAVA', placed.bhavas).filter((p) => p.unit === 0);
  assert.deepEqual(parts.filter((p) => pr.rows[lords[p.kakshya - 1]].includes(0)).map((p) => lords[p.kakshya - 1]), FIX.standardHoroscope.lagnaBhavaSunBinduKakshyas.map((k) => k.lord));
}

// ------------------------------------------------------------------ sloka 5: debilitation, enemy's sign, combust ---
{
  // Sun in Libra (debilitated; Saturn's sign is a friend of the Sun? Venus's sign is the Sun's enemy).
  const sunLibra = afflictionOf('Sun', 190, false, 99);
  assert.equal(sunLibra.debilitated, true);
  assert.equal(sunLibra.enemySign, true, 'Venus rules Libra; Venus is the Sun\'s enemy');
  assert.equal(afflictionOf('Sun', 130, false, 99).afflicted, false, 'Sun in Leo');
  assert.deepEqual(afflictionOf('Mars', 15, false, 40).reasons, [], 'Mars in his own Aries, far from the Sun');
  assert.deepEqual(afflictionOf('Mars', 15, false, 10).reasons, ['COMBUST'], 'within 17 degrees of the Sun');
  assert.deepEqual(afflictionOf('Mercury', 75, false, 13).reasons, ['COMBUST'], 'Mercury: 14 direct');
  assert.deepEqual(afflictionOf('Mercury', 75, true, 13).reasons, ['COMBUST'].filter(() => 13 < 12), 'Mercury retrograde: 12');
  assert.equal(afflictionOf('Saturn', 0, false, 90).debilitated, true, 'Saturn debilitated in Aries');
}

// ------------------------------------------------------------------ inputs ---
assert.throws(() => kakshyaTransit({ natal, atMs: AT, method: 'NOPE' }), /unknown Kakshya method/);
assert.throws(() => kakshyaTransit({ natal, atMs: NaN }), /moment/);
assert.throws(() => kakshyaTransit({ natal: { ...natal, mcLongitude: NaN }, atMs: AT }), /Lagna and MC|MC/);
assert.deepEqual(Object.keys(SCAN).sort(), [...T.PLANETS].sort());

// ------------------------------------------------------------------ the page's words ---
const r = kakshyaTransit({ natal, atMs: AT });
assert.ok(!/\bundefined\b|NaN/.test(JSON.stringify(r)));
for (const t of [...T.OUR_READINGS_TA, T.SLOKA_14_TA, ...Object.values(T.SLOKA_5_TA), ...Object.values(T.BHAVA_EXTREMES)]) assert.ok(/[஀-௿]/.test(t));

// ------------------------------------------------------------------ chapters VI-XII: the results, as printed ---
{
  const R = require('./src/report/kakshyaResultsTables');
  const A = require('./src/report/saturnAshtakavargaTables');
  assert.deepEqual(Object.keys(R.RESULTS), ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']);
  // Sloka 1's first list gives all nine counts, 8 to 0, for every planet.
  for (const [p, v] of Object.entries(R.RESULTS)) {
    assert.deepEqual(Object.keys(v.primary).map(Number).sort(), [0, 1, 2, 3, 4, 5, 6, 7, 8], `${p}: counts 0-8`);
    for (const t of [...Object.values(v.primary), ...Object.values(v.others), v.kakshyaBindu, v.kakshyaVoid]) assert.ok(/[஀-௿]/.test(t), `${p}: Tamil`);
    assert.equal(v.sources.length, 2);
    assert.ok(/printed pp?\.\d/.test(v.sources[0].pageLocus) && /PDF 1\d\d/.test(v.sources[0].pageLocus));
    for (const src of v.sources) assert.ok(!/PDF/.test(citeTa(src)) && /ப\.\d+/.test(citeTa(src)), citeTa(src));
  }
  // The second list ("given by other authors") covers different counts for each planet.
  const othersKeys = (p) => Object.keys(R.RESULTS[p].others).map(Number).sort((x, y) => x - y);
  assert.deepEqual(othersKeys('Sun'), [1, 2, 3, 4, 5, 6, 7, 8]);
  assert.deepEqual(othersKeys('Moon'), [0, 1, 2, 3, 4, 5, 6, 7, 8]);
  assert.deepEqual(othersKeys('Mars'), [2, 3, 4, 5, 7]);
  assert.deepEqual(othersKeys('Mercury'), [0, 1, 4, 6, 7, 8]);
  assert.deepEqual(othersKeys('Jupiter'), [0, 1, 2, 3, 4, 5, 7]);
  assert.deepEqual(othersKeys('Venus'), [], 'Venus has no second list');
  assert.deepEqual(othersKeys('Saturn'), [0, 1, 2]);
  // Saturn's are the ones the Saturn page already holds.
  assert.equal(R.RESULTS.Saturn.primary, A.PATEL_BY_BINDUS);
  assert.equal(R.RESULTS.Saturn.others, A.PATEL_OTHER_AUTHORS);
  // The page chapters: Sun VI p.76, Moon VII p.87, Mars VIII p.96, Mercury IX p.105, Jupiter X p.115, Venus XI p.139, Saturn XII p.153.
  for (const [p, pg] of Object.entries({ Sun: 76, Moon: 87, Mars: 96, Mercury: 105, Jupiter: 115, Venus: 139, Saturn: 153 })) {
    assert.ok(citeTa(R.RESULTS[p].sources[0]).includes(`ப.${pg}`), `${p}: sloka 1 on p.${pg}`);
  }
  // Two cells read from the images: Mercury's 2 and 3 (the scan runs the lines together) and the Sun has no 0 among the others.
  assert.match(R.RESULTS.Mercury.primary[2], /முத்தோஷ/);
  assert.match(R.RESULTS.Mercury.primary[3], /மனக் கவலை/);
  assert.equal(R.RESULTS.Sun.others[0], undefined);
  // The engine hands each planet the text for its bhava count and for bindu or void.
  const eng = kakshyaTransit({ natal, atMs: AT });
  for (const p of eng.planets) {
    assert.equal(p.texts.bhava, R.RESULTS[p.planet].primary[p.bhavaBindus]);
    assert.equal(p.texts.bhavaOthers, R.RESULTS[p.planet].others[p.bhavaBindus] ?? null);
    assert.equal(p.texts.kakshya, p.bindu ? R.RESULTS[p.planet].kakshyaBindu : R.RESULTS[p.planet].kakshyaVoid);
  }
  assert.equal(Object.keys(eng.doctrine.resultSources).length, 7);
}

console.log('kakshya-transit: ok');
