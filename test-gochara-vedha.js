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
{
  // Venus's line is partly reconstruction, checked below; the fixture holds only what is read.
  const { Venus, ...decoded } = plain(V.SUDAMANI_SETS.vedha);
  assert.deepEqual(decoded, FIX.sudamani.verse342Vedha);
  assert.equal(Venus.length, FIX.sudamani.verse342VenusRead.length);
}

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

// Sudamani's verse 342 sets equal Pulippani's for every planet; Mercury's holds 8, not 7.
for (const [planet, set] of Object.entries(V.SUDAMANI_SETS.vedha)) {
  if (planet === 'Venus') continue;
  assert.ok(sameSet(set, P[planet].pairs.map(([, v]) => v)), `Sudamani ${planet} vedha set = Pulippani's`);
}
assert.ok(V.SUDAMANI_SETS.vedha.Mercury.includes(8) && !V.SUDAMANI_SETS.vedha.Mercury.includes(7));
// Venus: the verse's eight good houses; the five numbers read from the print
// are Pulippani's vedha places for the same good houses, in verse-341 order;
// the reading fills the three unread places from Pulippani's pairs.
{
  const SV = V.SUDAMANI_VENUS;
  assert.deepEqual([...SV.verse341Good], FIX.sudamani.verse341Good.Venus);
  assert.deepEqual([...SV.verse342Read], FIX.sudamani.verse342VenusRead);
  assert.deepEqual([...SV.commentaryGood341], FIX.sudamani.commentaryVenusGood341);
  assert.ok(!SV.verse341Good.includes(8) && SV.commentaryGood341.includes(8), 'the 8th is the commentary\'s');
  const pulippaniFor = (g) => P.Venus.pairs.find(([gg]) => gg === g)[1];
  const expected = SV.verse341Good.map(pulippaniFor);
  SV.verse342Read.forEach((v, i) => { if (v !== null) assert.equal(v, expected[i], `read place ${i}: ${v}`); });
  assert.deepEqual([...SV.verse342Reading], expected, 'the reading = Pulippani\'s pairs in verse-341 order');
  assert.deepEqual([...V.SUDAMANI_SETS.vedha.Venus], [...SV.verse342Reading]);
  assert.equal(SV.verse342Read.filter((v) => v === null).length, 3, 'three places are reconstruction');
  // Santhanam and Vishnu Bhaskar pair the 11th with 6; the read first place is 3.
  assert.equal(SV.verse342Read[0], 3);
  assert.equal(V.VB_GOCHARA_VEDHA.Venus.pairs.find(([g]) => g === 11)[1], 6);
  // The commentary's seven vedha places are all in Pulippani's set.
  assert.ok(SV.commentary342.clean.every((v) => P.Venus.pairs.some(([, pv]) => pv === v)));
  assert.deepEqual(plain(SV.commentary342), FIX.sudamani.commentaryVenus);
}

// The difference list names those cells.
const ids = V.VEDHA_DIFFERENCES.map((d) => d.id);
for (const id of ['MERCURY_10', 'VENUS_11_12', 'TENTH_GOOD', 'VENUS_SUN', 'VIPAREETA']) assert.ok(ids.includes(id), id);

// ------------------------------------------------ Santhanam's three tables ---
const S = FIX.santhanam;
for (const row of S.vedhaRows) {
  const [planet, good, vedha] = row.split('|');
  assert.deepEqual(plain(V.SANTHANAM_GOCHARA_VEDHA[planet].pairs), nums(good).map((g, i) => [g, nums(vedha)[i]]), `Santhanam ${planet} vedha`);
}
assert.deepEqual(Object.keys(V.SANTHANAM_GOCHARA_VEDHA), ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'], 'no rows for the nodes');
// His vipareetha table (p.149) is his vedha table (p.147) read upside down, as he says.
for (const row of S.vipareetaRows) {
  const [planet, top, bottom] = row.split('|');
  const reversed = nums(top).map((v, i) => [nums(bottom)[i], v]);
  assert.deepEqual(reversed, plain(V.SANTHANAM_GOCHARA_VEDHA[planet].pairs), `Santhanam ${planet}: p.149 reverses p.147`);
}
for (const [planet, cells] of Object.entries(S.badPlaces)) {
  const want = Object.fromEntries(cells.map((c, i) => [i + 1, c]).filter(([, c]) => c !== '..').map(([h, c]) => [h, Number(c)]));
  assert.deepEqual(plain(V.SANTHANAM_BAD_PLACES[planet]), want, `Santhanam ${planet} bad places`);
  // A house with a figure is never one of his good houses.
  for (const h of Object.keys(want)) assert.ok(!V.SANTHANAM_GOCHARA_VEDHA[planet].pairs.some(([g]) => g === Number(h)), `${planet} ${h} is a bad house`);
}
assert.deepEqual(S.badPlaces.Saturn, S.badPlaces.Mars, 'Saturn\'s row is Mars\'s, as Kalaprakasika says of their vedhai places');

// Kalaprakasika's bad-house columns are this table in 35 of 39 cells; the four that differ:
const kpDiff = [];
let kpCells = 0;
for (const [planet, row] of Object.entries(V.KALAPRAKASIKA_TABLE)) {
  for (const [h, r] of Object.entries(V.SANTHANAM_BAD_PLACES[planet])) {
    kpCells += 1;
    if (row[Number(h) - 1] !== r) kpDiff.push(`${planet} ${h}: KP ${row[Number(h) - 1]} / Santhanam ${r}`);
  }
}
assert.equal(kpCells, 39);
assert.deepEqual(kpDiff, ['Mars 4: KP 3 / Santhanam 4', 'Mars 12: KP 11 / Santhanam 12', 'Jupiter 8: KP 7 / Santhanam 8', 'Jupiter 12: KP 11 / Santhanam 12']);
// And every bad house of Kalaprakasika's columns (Pulippani's bad houses) is one Santhanam lists.
for (const [planet, row] of Object.entries(V.KALAPRAKASIKA_TABLE)) {
  const bad = row.map((_, i) => i + 1).filter((h) => !P[planet].pairs.some(([g]) => g === h));
  assert.deepEqual(bad.sort((a, b) => a - b), Object.keys(V.SANTHANAM_BAD_PLACES[planet]).map(Number).sort((a, b) => a - b), `${planet}: same bad houses`);
}
// Santhanam against Pulippani: only Venus's 11th and 12th.
const ps = [];
for (const planet of Object.keys(V.SANTHANAM_GOCHARA_VEDHA)) {
  for (const [g] of P[planet].pairs) if (vedhaOf(P, planet, g) !== vedhaOf(V.SANTHANAM_GOCHARA_VEDHA, planet, g)) ps.push(`${planet} ${g}`);
}
assert.deepEqual(ps, ['Venus 11', 'Venus 12']);
for (const id of ['BAD_PLACES', 'SADE_SATI_COMPANION', 'SANTHANAM_MARS_EXAMPLE']) assert.ok(ids.includes(id), id);

// ------------------------------------------------ the three methods ---
const PM = V.VEDHA_METHODS.PULIPPANI.table;
const VM = V.VEDHA_METHODS.VISHNU_BHASKAR.table;
const SM = V.VEDHA_METHODS.SANTHANAM.table;
const one = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, v.length === 1 ? v[0] : v]));
assert.deepEqual(plain(PM.Saturn.vedhaOf), plain(V.SATURN_VEDHA), 'Saturn\'s pairs are the Saturn page\'s');
assert.deepEqual(one(plain(PM.Saturn.relievedBy)), plain(V.SATURN_VIPAREETA));
assert.deepEqual(PM.Rahu.unpairedGood, [10]);
assert.deepEqual(VM.Rahu.unpairedGood, []);
assert.deepEqual(PM.Jupiter.relievedBy[8], [11], 'Jupiter\'s printed "S" read as 8');
assert.deepEqual(one(plain(PM.Venus.relievedBy)), { 7: 2, 10: 4, 6: 11 }, 'Venus: only her bad houses relieve; Pulippani prints 6↔11');
assert.deepEqual(one(plain(VM.Venus.relievedBy)), { 7: 2, 10: 4, 6: 11 }, 'Vishnu Bhaskar\'s reversal gives the same three');
assert.equal(PM.Mercury.relievedBy[7], undefined, 'Pulippani gives Mercury\'s 7th no relief');
assert.deepEqual(VM.Mercury.relievedBy[7], [10], 'Vishnu Bhaskar\'s 10↔7 relieves the 7th');
assert.ok(SM.Rahu.notCovered && SM.Ketu.notCovered, 'Santhanam has no rows for the nodes');
assert.deepEqual(plain(SM.Venus.relievedBy), { 6: [11, 12], 7: [2], 10: [4] }, 'Santhanam: reversal and bad-places tables both relieve');
assert.deepEqual(plain(SM.Saturn.relievedBy[1]), [1], 'Saturn in the 1st: a planet with him');
assert.deepEqual(plain(SM.Sun.relievedBy[4]), [10, 3], 'Sun in the 4th: the reversal\'s 10th and the bad-places 3rd');
for (const p of V.PLANETS_9) {
  for (const t of [PM, VM, SM]) {
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
  // Santhanam: Saturn in the 1st (Sade Sati) with Mars in the same sign — checked; with the Sun — the Sun is exempt.
  const s1 = computeGocharaPhala(0, { Saturn: 0, Mars: 0 }, 'SANTHANAM').find((r) => r.graha === 'Saturn');
  assert.deepEqual([s1.vipareetaHouses, s1.relievedBy], [[1], ['Mars']]);
  assert.deepEqual(computeGocharaPhala(0, { Saturn: 0, Sun: 0 }, 'SANTHANAM').find((r) => r.graha === 'Saturn').relievedBy, []);
  // Santhanam: the Sun in the 4th relieved from the 10th (reversal) or the 3rd (bad places).
  assert.deepEqual(computeGocharaPhala(0, { Sun: 3, Mars: 2 }, 'SANTHANAM').find((r) => r.graha === 'Sun').relievedBy, ['Mars']);
  assert.deepEqual(computeGocharaPhala(0, { Sun: 3, Mars: 2 }).find((r) => r.graha === 'Sun').relievedBy, [], 'Pulippani has no 3rd for it');
  // Santhanam has no row for Rahu.
  assert.equal(computeGocharaPhala(0, { Rahu: 9 }, 'SANTHANAM').find((r) => r.graha === 'Rahu').verdict, 'notCovered');
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
            assert.ok(s.pairedHouses.includes(((signAt(b.planet, m2) - moonRasiIndex + 12) % 12) + 1), `${b.planet} sits in one of ${p.planet}'s paired houses`);
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
  console.log(`  engine: nine planets, three books, in ${elapsed} ms`);
}

console.log('test-gochara-vedha: all checks passed');
