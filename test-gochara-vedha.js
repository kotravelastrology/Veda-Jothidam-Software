const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const V = require('./src/report/gocharaVedhaTables');
const { gocharaVedha, SPAN } = require('./src/report/gocharaVedha');
const { saturnVedhaWindows } = require('./src/report/saturnVedha');
const { computeGocharaPhala } = require('./src/report/gocharaPhala');
const { planetLongitude, nodeLongitude } = require('./src/ephemeris/siderealPositions');
const { resolveByTitle } = require('./src/sources/registry');

const FIX = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/gochara-vedha/books.json'), 'utf8'));
const DAY = 86400000;
const nums = (s) => s.split(',').map(Number);
const plain = (o) => JSON.parse(JSON.stringify(o));
const sameSet = (a, b) => [...a].sort((x, y) => x - y).join() === [...b].sort((x, y) => x - y).join();

// ------------------------------------------------ the tables, read twice ---
for (const row of FIX.vishnuBhaskar.rows) {
  const [planet, good, vedha] = row.split('|');
  const want = nums(good).map((g, i) => [g, nums(vedha)[i]]);
  assert.deepEqual(plain(V.VB_GOCHARA_VEDHA[planet].pairs), want, `Vishnu Bhaskar ${planet}`);
}
assert.deepEqual(plain(V.KALAPRAKASIKA_TABLE), FIX.kalaprakasikaTable.jatakaParijataReprint, 'Kalaprakasika table as Jataka Parijata reprints it');
for (const [planet, cells] of Object.entries(V.KALAPRAKASIKA_1982_CELLS)) {
  for (const [col, printed] of cells) {
    assert.equal(FIX.kalaprakasikaTable.print1982[planet][col - 1], printed, `1982 print, ${planet} column ${col}`);
  }
}
// Every other 1982 cell equals the reprint.
for (const [planet, row] of Object.entries(FIX.kalaprakasikaTable.print1982)) {
  row.forEach((cell, i) => {
    const listed = (V.KALAPRAKASIKA_1982_CELLS[planet] ?? []).some(([c]) => c === i + 1);
    if (!listed) assert.equal(Number(cell), V.KALAPRAKASIKA_TABLE[planet][i], `1982 ${planet} column ${i + 1} agrees with the reprint`);
  });
}
assert.deepEqual(plain(V.SUDAMANI_SETS.good), FIX.sudamani.verse341Good);
assert.deepEqual(plain(V.SUDAMANI_SETS.vedha), FIX.sudamani.verse342Vedha);

// ------------------------------------------------ what agrees and what does not ---
const P = V.GOCHARA_VEDHA;
const VB = V.VB_GOCHARA_VEDHA;
const vedhaOf = (t, planet, house) => (t[planet].pairs.find(([g]) => g === house) ?? [])[1];

// Pulippani vs Vishnu Bhaskar: exactly the cells VEDHA_DIFFERENCES names.
const pvb = [];
for (const planet of V.PLANETS_9) {
  const houses = new Set([...P[planet].pairs.map(([g]) => g), ...VB[planet].pairs.map(([g]) => g)]);
  for (const h of houses) if (vedhaOf(P, planet, h) !== vedhaOf(VB, planet, h)) pvb.push(`${planet} ${h}: ${vedhaOf(P, planet, h)} / ${vedhaOf(VB, planet, h)}`);
}
assert.deepEqual(pvb, ['Mercury 10: 8 / 7', 'Venus 11: 3 / 6', 'Venus 12: 6 / 3'], 'Pulippani and Vishnu Bhaskar differ in three cells');

// Kalaprakasika's table, read column = house, entry = vedha house: every good-house cell is Pulippani's but Mercury's 10th.
const kpMisses = [];
for (const [planet, row] of Object.entries(V.KALAPRAKASIKA_TABLE)) {
  for (const [g, v] of P[planet].pairs) if (row[g - 1] !== v) kpMisses.push(`${planet} ${g}: ${row[g - 1]} / ${v}`);
}
assert.deepEqual(kpMisses, ['Mercury 10: 10 / 8'], 'the layout reading matches all good-house cells but one');
// Its bad-house columns are not the reversal (except Venus) — the reason they are not used.
const reversalOk = (planet) => P[planet].pairs.every(([g, v]) => P[planet].pairs.some(([gg]) => gg === v) || V.KALAPRAKASIKA_TABLE[planet][v - 1] === g);
assert.deepEqual(Object.keys(V.KALAPRAKASIKA_TABLE).filter(reversalOk), ['Venus'], 'only Venus\'s bad-house columns reverse the good pairs');

// Sudamani's verse 342 sets equal Pulippani's for every planet it decodes; Mercury's holds 8, not 7.
for (const [planet, set] of Object.entries(V.SUDAMANI_SETS.vedha)) {
  assert.ok(sameSet(set, P[planet].pairs.map(([, v]) => v)), `Sudamani ${planet} vedha set = Pulippani's`);
}
assert.ok(V.SUDAMANI_SETS.vedha.Mercury.includes(8) && !V.SUDAMANI_SETS.vedha.Mercury.includes(7));
assert.ok(!('Venus' in V.SUDAMANI_SETS.vedha), 'Sudamani\'s Venus line is recorded as not decoded');

// The difference list names those cells.
const ids = V.VEDHA_DIFFERENCES.map((d) => d.id);
for (const id of ['MERCURY_10', 'VENUS_11_12', 'TENTH_GOOD', 'VENUS_SUN', 'VIPAREETA']) assert.ok(ids.includes(id), id);

// ------------------------------------------------ the two methods ---
const PM = V.VEDHA_METHODS.PULIPPANI.table;
const VM = V.VEDHA_METHODS.VISHNU_BHASKAR.table;
assert.deepEqual(plain(PM.Saturn.vedhaOf), plain(V.SATURN_VEDHA), 'Saturn\'s pairs are the Saturn page\'s');
assert.deepEqual(plain(PM.Saturn.relievedBy), plain(V.SATURN_VIPAREETA));
assert.deepEqual(PM.Rahu.unpairedGood, [10]);
assert.deepEqual(VM.Rahu.unpairedGood, []);
assert.equal(PM.Jupiter.relievedBy[8], 11, 'Jupiter\'s printed "S" read as 8');
assert.deepEqual(plain(PM.Venus.relievedBy), { 7: 2, 10: 4, 6: 11 }, 'Venus: only her bad houses relieve; Pulippani prints 6↔11');
assert.deepEqual(plain(VM.Venus.relievedBy), { 7: 2, 10: 4, 6: 11 }, 'Vishnu Bhaskar\'s reversal gives the same three');
assert.equal(PM.Mercury.relievedBy[7], undefined, 'Pulippani gives Mercury\'s 7th no relief');
assert.equal(VM.Mercury.relievedBy[7], 10, 'Vishnu Bhaskar\'s 10↔7 relieves the 7th');
for (const p of V.PLANETS_9) {
  for (const t of [PM, VM]) {
    for (const b of Object.keys(t[p].relievedBy)) assert.ok(!t[p].good.includes(Number(b)), `${p}: a relieved house is never a good one`);
  }
}

// ------------------------------------------------ word order ---
const w = V.VEDHA_RANK.words;
assert.deepEqual(plain(w), FIX.wordCounts);
assert.deepEqual([...V.VEDHA_RANK.order], Object.keys(w).sort((a, b) => w[b] - w[a]));
assert.equal(V.DEFAULT_VEDHA_METHOD, V.VEDHA_RANK.order[0]);
assert.deepEqual([...V.VEDHA_RANK.computable], V.VEDHA_RANK.order.filter((b) => V.VEDHA_METHODS[b]));

// ------------------------------------------------ citations ---
const cites = [];
const walk = (o) => { if (o && typeof o === 'object') { if (typeof o.pageLocus === 'string') cites.push(o); Object.values(o).forEach(walk); } };
walk(V);
for (const c of cites) assert.ok(resolveByTitle(c.title), `registered: ${c.title}`);

// ------------------------------------------------ the present, by hand ---
{
  // Venus in the 1st, the Sun in the 8th (Venus's vedha house): Pulippani exempts the Sun, Vishnu Bhaskar does not.
  const pRow = computeGocharaPhala(0, { Venus: 0, Sun: 7 }).find((r) => r.graha === 'Venus');
  const vRow = computeGocharaPhala(0, { Venus: 0, Sun: 7 }, 'VISHNU_BHASKAR').find((r) => r.graha === 'Venus');
  assert.equal(pRow.verdict, 'benefic');
  assert.equal(vRow.verdict, 'vedha');
  // Rahu in the 10th: good with no vedha house under Pulippani; not good under Vishnu Bhaskar.
  assert.equal(computeGocharaPhala(0, { Rahu: 9 }).find((r) => r.graha === 'Rahu').verdict, 'benefic');
  assert.equal(computeGocharaPhala(0, { Rahu: 9 }, 'VISHNU_BHASKAR').find((r) => r.graha === 'Rahu').verdict, 'neutral');
  // Rahu in the 11th, Ketu necessarily in the 5th (its vedha house): not counted.
  assert.equal(computeGocharaPhala(0, { Rahu: 10, Ketu: 4 }).find((r) => r.graha === 'Rahu').verdict, 'benefic');
  // Vipareetha: Saturn in the 12th, Jupiter in the 3rd.
  const sat = computeGocharaPhala(0, { Saturn: 11, Jupiter: 2 }).find((r) => r.graha === 'Saturn');
  assert.equal(sat.vipareetaHouse, 3);
  assert.deepEqual(sat.relievedBy, ['Jupiter']);
  // Mercury in the 10th, a planet in the 8th: obstructed by Pulippani's table, not Vishnu Bhaskar's.
  assert.equal(computeGocharaPhala(0, { Mercury: 9, Mars: 7 }).find((r) => r.graha === 'Mercury').verdict, 'vedha');
  assert.equal(computeGocharaPhala(0, { Mercury: 9, Mars: 7 }, 'VISHNU_BHASKAR').find((r) => r.graha === 'Mercury').verdict, 'benefic');
}

// ------------------------------------------------ the windows, against the sky ---
{
  const atMs = Date.UTC(2026, 9, 6);
  const moonRasiIndex = 1;
  const t0 = Date.now();
  const r = gocharaVedha({ moonRasiIndex, atMs });
  const elapsed = Date.now() - t0;
  const lon = (p, ms) => {
    const jd = ms / DAY + 2440587.5;
    if (p === 'Rahu') return nodeLongitude(jd, 'Lahiri', 'mean');
    if (p === 'Ketu') return (nodeLongitude(jd, 'Lahiri', 'mean') + 180) % 360;
    return planetLongitude(jd, p, 'Lahiri');
  };
  const signAt = (p, ms) => Math.floor(lon(p, ms) / 30) % 12;
  const ms = (iso) => Date.parse(iso);
  for (const id of Object.keys(r.methods)) {
    for (const p of Object.values(r.methods[id].planets)) {
      assert.equal(p.stays.filter((s) => s.current).length, 1, `${id} ${p.planet}: one current stay`);
      assert.equal(ms(p.stays[0].fromUtc), atMs - SPAN[p.planet][0]);
      assert.equal(ms(p.stays.at(-1).toUtc), atMs + SPAN[p.planet][1]);
      for (const s of p.stays) {
        const mid = (ms(s.fromUtc) + ms(s.toUtc)) / 2;
        assert.equal(((signAt(p.planet, mid) - moonRasiIndex + 12) % 12) + 1, s.house, `${p.planet} is in house ${s.house} mid-stay`);
        for (const b of s.byPlanet) {
          for (const win of b.windows) {
            const m2 = (ms(win.fromUtc) + ms(win.toUtc)) / 2;
            assert.equal(((signAt(b.planet, m2) - moonRasiIndex + 12) % 12) + 1, s.pairedHouse, `${b.planet} sits in ${p.planet}'s paired house`);
          }
        }
        assert.ok(s.coveredDays <= s.days + 0.1);
      }
    }
  }

  // Saturn under Pulippani is the Saturn page's computation.
  const sp = r.methods.PULIPPANI.planets.Saturn;
  const sv = saturnVedhaWindows({ moonRasiIndex, fromMs: atMs - SPAN.Saturn[0], toMs: atMs + SPAN.Saturn[1], atMs });
  assert.equal(sp.stays.length, sv.stays.length, 'same Saturn stays');
  sp.stays.forEach((s, i) => {
    const o = sv.stays[i];
    assert.equal(s.house, o.house);
    assert.equal(s.pairedHouse, o.pairedHouse);
    assert.ok(Math.abs(ms(s.fromUtc) - ms(o.fromUtc)) < 2 * 3600000, 'same boundaries within the coarser bisection');
    assert.deepEqual(s.byPlanet.map((b) => b.planet), o.byPlanet.map((b) => b.planet), `stay ${i}: same planets in the paired house`);
    assert.ok(Math.abs(s.coveredDays - o.coveredDays) <= 0.2, `stay ${i}: same covered days`);
  });
  assert.equal(sp.now.house, sv.now.house);
  assert.equal(sp.now.active, sv.now.active);
  console.log(`  engine: nine planets, two books, in ${elapsed} ms`);
}

console.log('test-gochara-vedha: all checks passed');
