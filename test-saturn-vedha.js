const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const V = require('./src/report/gocharaVedhaTables');
const SV = require('./src/report/saturnVedha');
const HR = require('./src/report/saturnHouseResults');
const TM = require('./src/report/saturnTransitTamil');
const { computeSaturnTransits } = require('./src/report/saturnTransit');
const { planetLongitude, nodeLongitude } = require('./src/ephemeris/siderealPositions');
const { resolveByTitle } = require('./src/sources/registry');

const FIX = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/saturn-transit/vedha.json'), 'utf8'));
const DAY = 86400000;
const YEAR = 365.25 * DAY;
const nums = (s) => s.split(',').map((x) => (x === 'S' ? 'S' : Number(x)));
const plain = (o) => JSON.parse(JSON.stringify(o));
const sortPairs = (ps) => [...ps].map((p) => p.join('-')).sort();

// ------------------------------------------- the tables, as transcribed twice ---
for (const row of FIX.gochara.rows) {
  const [planet, good, vedha, exc] = row.split('|');
  const g = V.GOCHARA_VEDHA[planet];
  const goods = nums(good); const vedhas = nums(vedha);
  const pairs = vedhas.map((v, i) => [goods[i], v]);
  assert.deepEqual(plain(g.pairs), pairs, `${planet} gochara pairs`);
  const unpaired = goods.slice(vedhas.length);
  assert.deepEqual(plain(g.unpairedGood ?? []), unpaired, `${planet}: good places with no printed vedha`);
  const by = exc ? [exc.replace('no vedha by ', '')] : [];
  assert.deepEqual(plain(g.noVedhaBy), by, `${planet} exceptions`);
}
for (const row of FIX.vipareeta.rows) {
  const [planet, bad, vip] = row.split('|');
  const want = nums(bad).map((b, i) => [b === 'S' ? 8 : b, nums(vip)[i]]);
  assert.deepEqual(plain(V.VIPAREETA_VEDHA[planet].pairs), want, `${planet} vipareeta pairs`);
}
assert.deepEqual(plain(V.VIPAREETA_VEDHA.Jupiter.printed), { 8: 'S' }, 'Jupiter\'s "S" is recorded as printed');

// The vipareetha table is the gochara table read backwards — except where the print departs.
const mismatches = [];
for (const planet of Object.keys(V.GOCHARA_VEDHA)) {
  const reversed = sortPairs(V.GOCHARA_VEDHA[planet].pairs.map(([g, v]) => [v, g]));
  const printed = sortPairs(V.VIPAREETA_VEDHA[planet].pairs);
  for (const p of printed) if (!reversed.includes(p)) mismatches.push(`${planet} ${p}`);
}
assert.deepEqual(mismatches, ['Venus 3-12', 'Venus 6-11'], 'only Venus\'s last two vipareetha pairs depart from the gochara table');
assert.deepEqual(sortPairs(V.VIPAREETA_VEDHA.Venus.swappedAgainstGochara), ['3-12', '6-11']);

// Saturn: Pulippani, Vishnu Bhaskar and Sudamani verse 342 give the same pairs; vipareetha is their reverse.
assert.deepEqual(plain(V.SATURN_VEDHA), Object.fromEntries(V.GOCHARA_VEDHA.Saturn.pairs.map(([g, v]) => [g, v])));
assert.deepEqual(plain(V.SATURN_VEDHA), plain(TM.SATURN_GOOD_HOUSES.vedha), 'Sudamani verse 342');
assert.deepEqual(plain(V.SATURN_VIPAREETA), Object.fromEntries(V.VIPAREETA_VEDHA.Saturn.pairs.map(([b, p]) => [b, p])));
assert.deepEqual(plain(V.SATURN_VIPAREETA), Object.fromEntries(Object.entries(V.SATURN_VEDHA).map(([g, v]) => [v, Number(g)])), 'reversal of verse 342');
assert.deepEqual(V.GOCHARA_VEDHA.Saturn.noVedhaBy, ['Sun']);
assert.deepEqual(V.VIPAREETA_VEDHA.Saturn.noneBy, [], 'the vipareetha list names no exception for Saturn');
assert.deepEqual(V.VIPAREETA_VEDHA.Sun.noneBy, ['Saturn'], '... only the Sun\'s');

// -------------------------------------------------------------- intervals ---
assert.deepEqual(SV.subtract([[0, 10]], [[2, 4], [6, 7]]), [[0, 2], [4, 6], [7, 10]]);
assert.deepEqual(SV.subtract([[0, 10]], [[-5, 20]]), []);
assert.deepEqual(SV.subtract([[0, 10]], [[10, 20]]), [[0, 10]]);
assert.equal(SV.unionDays([[0, 2 * DAY], [DAY, 3 * DAY], [5 * DAY, 6 * DAY]]), 4);
assert.equal(SV.unionDays([]), 0);
assert.deepEqual(SV.overlaps([{ sign: 3, fromMs: 0, toMs: 10 }, { sign: 4, fromMs: 10, toMs: 20 }, { sign: 3, fromMs: 20, toMs: 30 }], 3, 5, 25), [[5, 10], [20, 25]]);

// ------------------------------------------------------------- sign stays ---
const T0 = Date.UTC(2026, 0, 1);
const lon = (p, ms) => {
  const jd = ms / DAY + 2440587.5;
  if (p === 'Rahu') return nodeLongitude(jd, 'Lahiri', 'mean');
  if (p === 'Ketu') return (nodeLongitude(jd, 'Lahiri', 'mean') + 180) % 360;
  return planetLongitude(jd, p, 'Lahiri');
};
for (const p of ['Moon', 'Sun', 'Mercury', 'Jupiter', 'Rahu', 'Ketu']) {
  const st = SV.signStays(p, T0, T0 + 2 * YEAR);
  for (let i = 1; i < st.length; i += 1) {
    assert.equal(st[i].fromMs, st[i - 1].toMs, `${p}: stays are contiguous`);
    assert.notEqual(st[i].sign, st[i - 1].sign, `${p}: consecutive stays differ`);
  }
  for (const s of st) {
    const mid = (s.fromMs + s.toMs) / 2;
    assert.equal(Math.floor(lon(p, mid) / 30), s.sign, `${p}: the midpoint is in the stay's sign`);
  }
  if (p === 'Moon') {
    const mean = (2 * YEAR) / st.length / DAY;
    assert.ok(mean > 2.1 && mean < 2.4, `the Moon spends about 2.27 days a sign (${mean.toFixed(2)})`);
  }
}
// Rahu and Ketu are always seven signs apart.
const rahu = SV.signStays('Rahu', T0, T0 + 3 * YEAR);
for (const s of rahu) assert.equal(Math.floor(lon('Ketu', (s.fromMs + s.toMs) / 2) / 30), (s.sign + 6) % 12);

// ------------------------------------------------------- Saturn's windows ---
const W = { fromMs: Date.UTC(2024, 0, 1), toMs: Date.UTC(2056, 0, 1), atMs: Date.UTC(2026, 9, 3) };
let jupiterReliefSeen = 0; let checkedWindows = 0;
for (let moon = 0; moon < 12; moon += 1) {
  const r = SV.saturnVedhaWindows({ moonRasiIndex: moon, ...W });
  const signOfHouse = (h) => (moon + h - 1) % 12;
  for (const s of r.stays) {
    const kindWant = [3, 6, 11].includes(s.house) ? 'GOOD' : [12, 9, 5].includes(s.house) ? 'RELIEVABLE' : 'NO_RELIEF';
    assert.equal(s.kind, kindWant, `house ${s.house}`);
    if (s.kind === 'NO_RELIEF') { assert.equal(s.pairedHouse, null); assert.equal(s.byPlanet.length, 0); }
    const a = Date.parse(s.fromUtc); const b = Date.parse(s.toUtc);
    for (const bp of s.byPlanet) {
      assert.ok(!['Sun', 'Moon'].includes(bp.planet), 'the Sun and Moon are reported apart');
      for (const w of bp.windows) {
        const wa = Date.parse(w.fromUtc); const wb = Date.parse(w.toUtc);
        assert.ok(wa >= a && wb <= b, 'a window lies inside its Saturn stay');
        const mid = (wa + wb) / 2;
        assert.equal(Math.floor(lon(bp.planet, mid) / 30), signOfHouse(s.pairedHouse), `${bp.planet} is in the paired house`);
        assert.equal((Math.floor(lon('Saturn', mid) / 30) - moon + 12) % 12 + 1, s.house, 'and Saturn is where the stay says');
        checkedWindows += 1;
      }
      if (bp.planet === 'Jupiter' && s.house === 12) {
        jupiterReliefSeen += 1;
        assert.ok(bp.days <= 420, 'Jupiter stays about a year in a sign, so the book\'s "one year" relief is at most that');
      }
    }
    assert.ok(s.coveredDays <= s.days + 0.1, 'covered days never exceed the stay');
    if (s.kind === 'GOOD' && s.sun) assert.equal(s.sun.status, 'EXCLUDED', 'the Sun causes Saturn no gochara vedha');
    if (s.kind === 'RELIEVABLE' && s.sun) assert.equal(s.sun.status, 'UNCERTAIN', 'the Sun\'s vipareetha for Saturn is not settled by the book');
    if (s.ordeal) {
      assert.ok([12, 1, 2].includes(s.house));
      for (const f of s.ordeal.fast) {
        for (const w of f.windows ?? []) {
          const mid = (Date.parse(w.fromUtc) + Date.parse(w.toUtc)) / 2;
          assert.equal(Math.floor(lon(f.planet, mid) / 30), Math.floor(lon('Saturn', mid) / 30), `${f.planet} is in Saturn's sign`);
          assert.notEqual(Math.floor(lon('Jupiter', mid) / 30), signOfHouse(3), 'and Jupiter is not in the 3rd');
        }
      }
    } else assert.ok(![12, 1, 2].includes(s.house), 'every Sade Sati stay carries the ordeal check');
  }
  assert.ok(r.now && r.now.house >= 1 && r.now.house <= 12);
  for (const p of r.now.planetsInPaired) {
    if (p.planet === 'Sun') assert.equal(p.status, r.now.kind === 'GOOD' ? 'EXCLUDED' : 'UNCERTAIN', 'the present applies the same Sun rule as the windows');
    else assert.equal(p.status, 'COUNTS');
  }
  assert.equal(r.now.active, r.now.planetsInPaired.some((p) => p.status === 'COUNTS'));
}
assert.ok(jupiterReliefSeen >= 1, 'Pulippani\'s own example (Saturn 12th, Jupiter 3rd) happens for some Moon sign in these thirty years');
assert.ok(checkedWindows > 100);

assert.throws(() => SV.saturnVedhaWindows({ moonRasiIndex: 12, ...W }), /moonRasiIndex/);
assert.throws(() => SV.saturnVedhaWindows({ moonRasiIndex: 0, fromMs: 0, toMs: 50 * YEAR }), /40 years/);

// -------------------------------------------------- what the book says, 4/7/8 ---
for (const h of [4, 7, 8]) {
  const r = HR.HOUSE_RESULTS[h];
  assert.equal(r.main.page.split(' (')[0], FIX.saturnResults.main[h], `main text page, house ${h}`);
  assert.equal(r.sundarananda.page.split(' (')[0], FIX.saturnResults.sundarananda[h]);
  for (const round of [1, 2, 3]) assert.equal(r.paryaya[round].page.split(' (')[0], FIX.saturnResults.paryaya[h][round], `house ${h} round ${round}`);
  for (const t of [r.main.textTa, r.sundarananda.waxingTa, r.sundarananda.waningTa, ...Object.values(r.paryaya).map((x) => x.textTa)]) {
    assert.ok(t.length > 5 && /[஀-௿]/.test(t), 'Tamil text present');
    assert.ok(!/[ऀ-ॿ]/.test(t), 'no Sanskrit reproduced');
  }
}
// Round numbering: each lived passage in order; past the third there is no text.
const fake = [1, 2, 3, 4].map((i) => ({ fromUtc: `20${i}0-01-01T00:00:00.000Z`, toUtc: `20${i}2-01-01T00:00:00.000Z`, years: 2 }));
const got = HR.houseResultsFor(8, fake);
assert.deepEqual(got.periods.map((p) => p.round), [1, 2, 3, 4]);
assert.equal(got.periods[1].paryayaTa, HR.HOUSE_RESULTS[8].paryaya[2].textTa);
assert.equal(got.periods[3].paryayaTa, null, 'the book describes three rounds only');
assert.equal(HR.houseResultsFor(5, fake), null, 'only the 4th, 7th and 8th are encoded');
// The same book's parts disagree about the 8th: recorded.
assert.match(HR.NOTES.disagreeTa, /பண வரவு/);
assert.match(HR.NOTES.missingPagesTa, /148-167/);

// Integration: the engine returns the texts with periods equal to its own spans.
const birthMs = Date.UTC(1985, 4, 10, 6, 0);
const tr = computeSaturnTransits({ moonRasiIndex: 4, birthMs, horizonYears: 90, atMs: W.atMs });
const h4 = tr.houseResults.houses.find((h) => h.house === 4);
assert.deepEqual(h4.periods.map((p) => [p.fromUtc, p.toUtc]), tr.ardhashtama.map((p) => [p.fromUtc, p.toUtc]), 'the 4th-house periods are the Ardhashtama periods');
const h8 = tr.houseResults.houses.find((h) => h.house === 8);
assert.deepEqual(h8.periods.map((p) => p.fromUtc), tr.ashtama.map((p) => p.fromUtc));
assert.ok(h4.periods.length >= 3, 'ninety years hold three passages through the 4th');
assert.ok(resolveByTitle(tr.houseResults.sourceTitle));

// Sundarananda's two readings follow the fortnight running at the time (book p.86).
assert.match(HR.NOTES.pakshaMeaningTa, /பிறப்புப் பட்சம் அல்ல/);
assert.match(HR.NOTES.pakshaSourcePage, /p\.86/);
assert.equal(tr.houseResults.saturnHouseNow, tr.now.houseFromMoon);
let at = W.atMs; let prevTurn = null;
for (let i = 0; i < 6; i += 1) {
  const p = HR.pakshaAt(at);
  assert.ok(p.tithi >= 1 && p.tithi <= 15, 'tithi within the fortnight');
  const turn = Date.parse(p.turnsUtc);
  assert.equal(HR.pakshaAt(turn - 600000).waxing, p.waxing, 'the same fortnight just before the turn');
  assert.equal(HR.pakshaAt(turn + 600000).waxing, !p.waxing, 'the other just after');
  if (prevTurn !== null) {
    const days = (turn - prevTurn) / DAY;
    assert.ok(days > 13.5 && days < 16, `a fortnight lasts about 14.8 days (${days.toFixed(2)})`);
  }
  prevTurn = turn; at = turn + 3600000;
}

// ------------------------------------------------------------- citations ---
for (const s of [V.GOCHARA_VEDHA_SOURCE, V.VIPAREETA_VEDHA_SOURCE, HR.HOUSE_RESULTS_SOURCE, ...Object.values(V.SATURN_VEDHA_TEXT).map((x) => x.source)]) {
  assert.ok(s.pageLocus, 'has a page');
  assert.ok(resolveByTitle(s.title), `${s.title} is registered`);
}

console.log(JSON.stringify({
  pass: true,
  vipareethaDepartsFromGochara: mismatches,
  saturnWindowsChecked: checkedWindows,
  jupiterReliefCases: jupiterReliefSeen,
  ardhashtamaPassages: h4.periods.map((p) => `${p.fromUtc.slice(0, 10)} round ${p.round}`),
}, null, 2));
