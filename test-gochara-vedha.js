const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const V = require('./src/report/gocharaVedhaTables');
const { gocharaVedha, SPAN } = require('./src/report/gocharaVedha');
const { saturnVedhaWindows } = require('./src/report/saturnVedha');
const { computeGocharaPhala } = require('./src/report/gocharaPhala');
const { planetLongitude, nodeLongitude } = require('./src/ephemeris/siderealPositions');
const { resolveByTitle } = require('./src/sources/registry');
const PG = require('./src/report/phaladeepikaGocharaTables');
const { phaladeepikaNow, phaladeepikaReportBlock, binduCharts, bindusAt, NOW_SOURCES } = require('./src/report/phaladeepikaGochara');

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

// ------------------------------------------------ Phaladeepika XXVI.2-8 ---
{
  const F = FIX.phaladeepika;
  const nums = (s) => s.split(',').map(Number);
  const pairsOf = (row) => { const [h, v] = row.split('|').map(nums); assert.equal(h.length, v.length, row); return h.map((x, i) => [x, v[i]]).sort((a, b) => a[0] - b[0]); };
  const PD = V.PHALADEEPIKA_GOCHARA_VEDHA;
  // Sastri's verses 3-8, pair by pair.
  for (const [planet, row] of Object.entries(F.sastriRows)) {
    const want = row === 'same as Mars' ? pairsOf(F.sastriRows.Mars) : pairsOf(row);
    assert.deepEqual(plain(PD[planet].pairs), want, `Phaladeepika ${planet} (Sastri)`);
  }
  // Verse 2's good houses (all planets good in the 11th; Venus all but 10, 7, 6; the nodes like the Sun).
  const good2 = {
    ...Object.fromEntries(Object.entries(F.sastriGoodSloka2).filter(([k]) => !['VenusNot', 'RahuKetu'].includes(k)).map(([k, v]) => [k, [...new Set([...v, 11])]])),
    Venus: Array.from({ length: 12 }, (_, i) => i + 1).filter((h) => !F.sastriGoodSloka2.VenusNot.includes(h)),
  };
  good2.Rahu = good2.Sun; good2.Ketu = good2.Sun;
  for (const p of V.PLANETS_9) {
    const g = [...PD[p].pairs.map(([x]) => x), ...(PD[p].unpairedGood ?? [])];
    assert.ok(sameSet(g, good2[p]), `Phaladeepika ${p}: verse 2's good houses`);
    assert.ok(sameSet(g, F.kapoorGood[p]), `Phaladeepika ${p}: Kapoor's verse 2 agrees`);
  }
  assert.deepEqual(plain(PD.Rahu), { pairs: [], unpairedGood: [3, 6, 10, 11] }, 'no vedha house for the nodes');
  // The seven planets' pairs are Pulippani's, cell for cell — the two disputed cells included.
  for (const p of ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']) assert.deepEqual(plain(PD[p].pairs), plain(P[p].pairs), `Phaladeepika ${p} = Pulippani`);
  assert.equal(PD.Mercury.pairs.find(([g]) => g === 10)[1], 8);
  assert.deepEqual([11, 12].map((h) => PD.Venus.pairs.find(([g]) => g === h)[1]), [3, 6]);
  assert.deepEqual(F.sanskrit, { Mercury10: 'नैधन', Venus11: 'सहज', Venus12: 'वैरि' });
  // Exemptions: the father-son pair both ways, nothing for Venus; no vipareetha.
  const PM2 = V.VEDHA_METHODS.PHALADEEPIKA_SASTRI;
  assert.deepEqual(Object.fromEntries(Object.entries(PM2.exempt.gochara).map(([k, v]) => [k, v.join()])), F.sastriNoVedhaBy);
  assert.ok(!PM2.exempt.gochara.Venus, 'no Venus–Sun exemption');
  for (const p of V.PLANETS_9) assert.deepEqual(plain(PM2.table[p].relievedBy), {}, `${p}: no vipareetha in Phaladeepika ch.26`);
  // Kapoor: the same pairs, with one vedha place missing for Mercury and two houses for Venus.
  for (const [planet, row] of Object.entries(F.kapoorRows)) {
    const [h, v] = row.split('|').map(nums);
    assert.deepEqual(plain(V.PHALADEEPIKA_KAPOOR_PRINTED[planet]), { houses: h, vedha: v });
    assert.notEqual(h.length, v.length, `Kapoor ${planet}: lists of unequal length`);
  }
  const mk = V.PHALADEEPIKA_KAPOOR_PRINTED.Mercury;
  assert.deepEqual([...mk.vedha.slice(0, 3), 1, ...mk.vedha.slice(3)], PD.Mercury.pairs.map(([, x]) => x), 'Kapoor\'s Mercury + Sastri\'s "1st"');
  const vk = V.PHALADEEPIKA_KAPOOR_PRINTED.Venus;
  const vkFilled = [1, ...vk.houses.slice(0, 5), 9, ...vk.houses.slice(5)];
  assert.deepEqual(vkFilled.map((x, i) => [x, vk.vedha[i]]).sort((a, b) => a[0] - b[0]), plain(PD.Venus.pairs), 'Kapoor\'s Venus + Sastri\'s 1st and 9th');
  // The table this repo carried as "Phaladeepika 26.3-8": right for the seven planets and the exemptions, not for the nodes.
  const old = F.astrologicLabPort;
  for (const p of ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']) {
    assert.deepEqual(Object.entries(old.vedha[p]).map(([g, v]) => [Number(g), v]), plain(PD[p].pairs), `old port ${p}`);
    assert.ok(sameSet(old.good[p], good2[p]));
  }
  assert.deepEqual(old.exempt, F.sastriNoVedhaBy);
  assert.ok(!old.good.Rahu.includes(10) && good2.Rahu.includes(10), 'the old port left out the nodes\' 10th');
  // In the report: Venus in the 1st with the Sun in the 8th — Pulippani exempts the Sun, Phaladeepika does not.
  assert.equal(computeGocharaPhala(0, { Venus: 0, Sun: 7 }, 'PHALADEEPIKA_SASTRI').find((r) => r.graha === 'Venus').verdict, 'vedha');
  assert.equal(computeGocharaPhala(0, { Rahu: 9 }, 'PHALADEEPIKA_SASTRI').find((r) => r.graha === 'Rahu').verdict, 'benefic');
  assert.equal(computeGocharaPhala(0, { Rahu: 10, Mars: 4 }, 'PHALADEEPIKA_SASTRI').find((r) => r.graha === 'Rahu').verdict, 'benefic', 'nothing obstructs the nodes');
  assert.equal(computeGocharaPhala(0, { Rahu: 10, Mars: 4 }, 'PULIPPANI').find((r) => r.graha === 'Rahu').verdict, 'vedha', 'Pulippani: Rahu 11th obstructed from the 5th');
  const ids2 = V.VEDHA_DIFFERENCES.map((d) => d.id);
  for (const id of ['NODE_VEDHA', 'KAPOOR_OMISSIONS']) assert.ok(ids2.includes(id), id);
  for (const d of V.VEDHA_DIFFERENCES) for (const b of Object.keys(d.byBook)) assert.ok(V.VEDHA_RANK.order.includes(b), `${d.id}: ${b} ranked`);
}

// ------------------------------------------------ Phaladeepika XXVI.9-34, 41 ---
{
  const F = FIX.phaladeepikaRest;
  // Verses 9-24: twelve results for each planet the verses cover; none for Ketu (verse 24 is "तमः", Rahu).
  assert.deepEqual(Object.keys(PG.HOUSE_RESULTS), Object.keys(F.houseResultVerses));
  assert.deepEqual(plain(PG.VERSE_OF), F.houseResultVerses);
  for (const rows of Object.values(PG.HOUSE_RESULTS)) assert.equal(rows.length, 12);
  assert.ok(!('Ketu' in PG.HOUSE_RESULTS));
  assert.equal(F.verse24Subject, 'तमः');
  // Rahu's results by kind: the good houses (happiness / gain) are 3, 6, 10, 11 — verse 2's "similar to the Sun".
  const goodRahu = F.rahuResults.map((t, i) => (/happiness|gain/.test(t) ? i + 1 : null)).filter(Boolean);
  assert.deepEqual(goodRahu, [3, 6, 10, 11]);
  assert.ok(sameSet(goodRahu, [...V.PHALADEEPIKA_GOCHARA_VEDHA.Rahu.unpairedGood]));
  // Verse 25 = Vishnu Bhaskar's item 13.
  const thirds = { first: 0, middle: 1, last: 2, throughout: null };
  for (const [k, ps] of Object.entries(F.verse25)) {
    for (const p of ps) assert.equal(PG.DECANATE[p], thirds[k], `verse 25: ${p}`);
    assert.deepEqual([...ps].sort(), [...F.vishnuBhaskarItem13[k]].sort(), `Vishnu Bhaskar agrees: ${k}`);
  }
  assert.ok(!('Ketu' in PG.DECANATE), 'verse 25 does not name Ketu');
  // Verse 33: the verse's 12, 8, 1 (Sastri) — Kapoor's 10th is recorded as his.
  const r33 = PG.RULES.find((x) => x.id === 'DANGER_12_8_1');
  assert.deepEqual([...r33.planets], F.verse33.planets);
  assert.deepEqual([...r33.houses], F.verse33.sastriHouses);
  assert.ok(r33.noteTa.includes(F.verse33.sanskrit) && r33.kapoor.pageLocus.includes('10th'));
  assert.deepEqual(plain(PG.RULES.find((x) => x.id === 'ALL_EIGHT').positions), F.verse34);
  for (const ru of PG.RULES) assert.ok(ru.computed || ru.whyNotTa, `${ru.id}: computed or says why not`);
  for (const s of [...PG.HOUSE_RESULTS_SOURCES, ...PG.DECANATE_SOURCES, ...PG.RULES.map((x) => x.source)]) assert.ok(resolveByTitle(s.title), s.title);
  // Verses 31-32's definitions: I.6, II.21-22, II.35, and the two books' combustion degrees.
  const SIGNS = ['Mesha', 'Vrishabha', 'Mithuna', 'Karkataka', 'Simha', 'Kanya', 'Tula', 'Vrischika', 'Dhanus', 'Makara', 'Kumbha', 'Meena'];
  assert.deepEqual([...PG.SIGN_LORDS], F.I6.lordsFromMesha);
  assert.deepEqual(['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].map((p) => SIGNS[PG.EXALTATION_SIGN[p]]), F.I6.exaltationFromSun);
  const { EXALTATION } = require('./src/chart/shadbala');
  for (const [p, e] of Object.entries(EXALTATION)) assert.equal(PG.EXALTATION_SIGN[p], e.sign, `${p}: Phaladeepika I.6 = BPHS (shadbala.js)`);
  const { NATURAL_ENEMIES: BPHS_ENEMIES } = require('./src/chart/planetaryRelationship');
  if (BPHS_ENEMIES) for (const [p, es] of Object.entries(BPHS_ENEMIES)) assert.deepEqual([...PG.NATURAL_ENEMIES[p]].sort(), [...es].sort(), `${p}: Phaladeepika II.21-22 = BPHS v.55`);
  // II.21-22 as stated, with "the unmentioned take the remaining relation": enemies are those named, or the rest when the friends were named.
  assert.deepEqual([...PG.NATURAL_ENEMIES.Venus].sort(), ['Moon', 'Sun'], 'Venus: Mars, Jupiter neutral, Saturn, Mercury friends — the Sun and Moon remain');
  assert.deepEqual([...PG.NATURAL_ENEMIES.Saturn].sort(), ['Mars', 'Moon', 'Sun']);
  assert.deepEqual(PG.NATURAL_ENEMIES.Moon, []);
  for (const n of ['Rahu', 'Ketu']) {
    assert.deepEqual([...PG.NATURAL_ENEMIES[n]].sort(), ['Jupiter', 'Moon', 'Sun'], `${n}: II.35 — the rest after Mercury, Saturn, Venus and Mars`);
    assert.deepEqual(plain(PG.dignityOf(n, 4)), { exalted: null, debilitated: null, own: null, enemySign: true, lord: 'Sun' });
  }
  const K = F.combustionKapoor;
  assert.deepEqual(plain(PG.COMBUSTION_DEGREES), { Moon: K.Moon, Mars: K.Mars, Mercury: [K.MercuryDirect, K.MercuryRetro], Jupiter: K.Jupiter, Venus: [K.VenusDirect, K.VenusRetro], Saturn: K.Saturn });
  for (const k of Object.keys(K)) assert.equal(F.combustionVishnuBhaskar[k], K[k], `Vishnu Bhaskar agrees: ${k}`);
  assert.equal(PG.combustionOrb('Sun', false), null);
  assert.deepEqual([PG.combustionOrb('Mercury', false), PG.combustionOrb('Mercury', true), PG.combustionOrb('Venus', true)], [14, 12, 8]);
  // The verdicts: verse 31 for exalted / own, verse 32 for debilitated / enemy's sign / combust; both can hold.
  const d = (o) => ({ exalted: false, debilitated: false, own: false, enemySign: false, lord: 'Sun', ...o });
  assert.deepEqual(plain(PG.verses31and32(d({ exalted: true }), false, false)), { v31: 'NO_HARM', v32: null, reasons: [] });
  assert.deepEqual(plain(PG.verses31and32(d({ own: true }), false, true)), { v31: 'FULL', v32: null, reasons: [] });
  assert.deepEqual(plain(PG.verses31and32(d({ debilitated: true }), false, true)), { v31: null, v32: 'VOID', reasons: ['DEBILITATED'] });
  assert.deepEqual(plain(PG.verses31and32(d({ enemySign: true }), true, false)), { v31: null, v32: 'AGGRAVATED', reasons: ['ENEMY_SIGN', 'COMBUST'] });
  assert.deepEqual(plain(PG.verses31and32(d({ own: true }), true, true)), { v31: 'FULL', v32: 'VOID', reasons: ['COMBUST'] }, 'own sign and combust: both verses');
  assert.ok(PG.RULES.find((x) => x.id === 'OWN_EXALTED').source.pageLocus.includes(F.verse31));
  assert.ok(PG.RULES.find((x) => x.id === 'DEBILITATED').source.pageLocus.includes(F.verse32));
  for (const s of Object.values(PG.DIGNITY_SOURCES)) assert.ok(resolveByTitle(s.title), s.title);
  // Verse 30's definitions: II.23 aspects, II.27 natures.
  for (const p of ['Sun', 'Moon', 'Mercury', 'Venus']) assert.deepEqual([...PG.aspectsOf(p).full], F.II23.full.all, `${p}: the 7th only`);
  for (const p of ['Saturn', 'Jupiter', 'Mars']) assert.deepEqual([...PG.aspectsOf(p).full].sort((a, b) => a - b), [...F.II23.full[p], 7].sort((a, b) => a - b), `${p}: special aspects`);
  for (const [k, hs] of [[0.25, F.II23.quarter], [0.5, F.II23.half], [0.75, F.II23.threeQuarters]]) for (const h of hs) assert.equal(PG.PARTIAL_ASPECTS[h], k);
  assert.deepEqual(PG.aspectsOf('Saturn').partial.map(([h]) => h).sort((a, b) => a - b), [4, 5, 8, 9], 'Saturn\'s 3rd and 10th are full, not partial');
  assert.deepEqual(PG.aspectsOf('Rahu'), { full: [], partial: [] }, 'II.23 gives the nodes no aspect');
  assert.deepEqual([...PG.MALEFIC_FIXED].sort(), ['Ketu', 'Mars', 'Rahu', 'Saturn', 'Sun']);
  assert.deepEqual([...PG.BENEFIC_FIXED].sort(), ['Jupiter', 'Venus']);
  assert.ok(F.II27.malefic.includes('waning Moon') && F.II27.mercury.includes('conjunction'));
  assert.deepEqual(plain(PG.verse30Effect({ nature: 'MALEFIC', enemy: false }, true)), { voids: 'GOOD', enemy: false });
  assert.deepEqual(plain(PG.verse30Effect({ nature: 'BENEFIC', enemy: true }, false)), { voids: 'BAD', enemy: true });
  assert.deepEqual(plain(PG.verse30Effect({ nature: 'BENEFIC', enemy: false }, true)), { voids: null, enemy: false }, 'a benefic on a good house: not in the verse');
  const r30 = PG.RULES.find((x) => x.id === 'ASPECT');
  assert.ok(r30.computed && r30.source.pageLocus.includes(F.verse30.sanskritStart) && r30.source.pageLocus.includes(F.verse30.enemyClause));
  assert.ok(r30.kapoor.pageLocus.includes(F.verse30.kapoorEnemy));
  for (const s of Object.values(PG.ASPECT_SOURCES)) assert.ok(resolveByTitle(s.title), s.title);
  assert.deepEqual(Object.keys(PG.DECANATE_WORDS), ['PHALADEEPIKA', 'VISHNU_BHASKAR']);
  assert.ok(PG.DECANATE_WORDS.PHALADEEPIKA > PG.DECANATE_WORDS.VISHNU_BHASKAR, 'Phaladeepika listed first by words');
}

// ------------------------------------------------ the present block, worked by hand ---
{
  // Natal Moon in Mesha. Saturn 5° Tula (exalted, 7th, within 15° of the Sun), the Sun 10° Tula
  // (debilitated, Venus's sign), Jupiter 5° Mesha (1st; aspects Tula by its 7th), the Moon 10°
  // Karkata (90° behind the Sun: waning), Mars 0° Kumbha, Mercury 10° Kanya, Venus 10° Vrishabha,
  // Rahu 10° Dhanus, Ketu 10° Mithuna.
  const lon = { Sun: 190, Moon: 100, Mars: 300, Mercury: 160, Jupiter: 5, Venus: 40, Saturn: 185, Rahu: 250, Ketu: 70 };
  const n = phaladeepikaNow({ moonRasiIndex: 0, lon, retrograde: {} });
  const P = n.planets;
  assert.deepEqual(Object.values(P).map((x) => x.house), [7, 4, 11, 6, 1, 2, 7, 9, 3]);
  assert.equal(n.moonNow.nature, 'MALEFIC');
  assert.equal(n.mercuryNow.nature, 'BENEFIC', 'no malefic in Kanya');
  // Saturn: exalted in a bad house (31: no harm) and combust (32: much suffering) — both verses.
  assert.equal(P.Saturn.goodHouse, false);
  assert.deepEqual([P.Saturn.combustion.separation, P.Saturn.combustion.combust], [5, true]);
  assert.deepEqual(plain(P.Saturn.verdict), { v31: 'NO_HARM', v32: 'AGGRAVATED', reasons: ['COMBUST'] });
  assert.equal(P.Saturn.effectiveNow, false, 'Saturn gives its result in the last third; it is at 5°');
  // The Sun: debilitated and in an enemy's sign, in a bad house; no orb of its own.
  assert.deepEqual(plain(P.Sun.verdict), { v31: null, v32: 'AGGRAVATED', reasons: ['DEBILITATED', 'ENEMY_SIGN'] });
  assert.equal(P.Sun.combustion.combust, null);
  // Verse 30 on Tula: Jupiter fully (7th) — a benefic on a bad house voids the bad; the Moon (4th) and Mars (9th) partly.
  for (const p of ['Saturn', 'Sun']) {
    const a = P[p].aspects;
    assert.deepEqual(a.filter((x) => x.full).map((x) => [x.planet, x.house, x.voids]), [['Jupiter', 7, 'BAD']], p);
    assert.deepEqual(a.filter((x) => !x.full).map((x) => [x.planet, x.fraction]), [['Moon', 0.75], ['Mars', 0.5]], p);
  }
  // Verse 33: Jupiter in the 1st; Saturn and the Sun in the 7th are not.
  assert.deepEqual(Object.values(P).filter((x) => x.dangerVerse33).map((x) => x.planet), ['Jupiter']);
  // Verse 34: only Rahu (9th) stands where the verse puts it.
  assert.deepEqual([n.verse34Now.met, n.verse34Now.all], [1, false]);
  assert.equal(P.Mercury.effectiveNow, 'ALL');
  assert.equal(P.Ketu.effectiveNow, null);
  assert.equal(P.Ketu.resultTa, null);
  assert.equal(P.Mercury.resultTa, PG.HOUSE_RESULTS.Mercury[5]);
  // Mercury retrograde narrows its orb from 14° to 12°.
  const m13 = { ...lon, Mercury: 177 };
  assert.equal(phaladeepikaNow({ moonRasiIndex: 0, lon: m13, retrograde: {} }).planets.Mercury.combustion.combust, true);
  assert.equal(phaladeepikaNow({ moonRasiIndex: 0, lon: m13, retrograde: { Mercury: true } }).planets.Mercury.combustion.combust, false);
  // The report's block: the same, with the wording tables and every page cited.
  const b = phaladeepikaReportBlock({ moonRasiIndex: 0, lon, retrograde: {} });
  assert.deepEqual(plain(b.planets), plain(P));
  assert.ok(b.decanateTa.length === 3 && b.ketuNoteTa && b.verse34Ta);
  for (const s of NOW_SOURCES) assert.ok(resolveByTitle(s.title) && s.pageLocus, s.title);
  assert.ok(NOW_SOURCES.some((s) => s.pageLocus.includes('slokas 2-8')), 'verse 2, whose good houses judge 30-32');
}

// ------------------------------------------------ Phaladeepika XXVI.41: "more bindus" ---
{
  const F = FIX.verse41;
  const { BINDU_TABLE, EXPECTED_TOTAL, EXPECTED_GRAND_TOTAL } = require('./src/chart/ashtakavarga');
  const sorted = (a) => [...a].sort((x, y) => x - y);
  const planetsOf = (book) => Object.fromEntries(Object.entries(book).filter(([k]) => k in BINDU_TABLE));
  const same = (table, book, label) => {
    assert.deepEqual(Object.keys(table).sort(), Object.keys(planetsOf(book)).sort(), label);
    for (const [p, row] of Object.entries(table)) {
      assert.deepEqual(Object.keys(row).sort(), Object.keys(book[p]).sort(), `${label} ${p}`);
      for (const [c, hs] of Object.entries(row)) assert.deepEqual(sorted(hs), sorted(book[p][c]), `${label} ${p} from ${c}`);
    }
  };
  // Each book's table cell by cell against the page transcription.
  same(PG.BINDU_TABLES.PHALADEEPIKA.table, F.phaladeepikaXXIII, 'Phaladeepika XXIII.3-9');
  same(PG.BINDU_TABLES.VARAHAMIHIRA.table, F.brihatJatakaIX, 'Brihat Jataka IX.1-7');
  same(BINDU_TABLE, F.brihatJatakaIX, 'ashtakavarga.js = Brihat Jataka IX');
  // They differ in one cell, and Sastri's footnotes say whose each is.
  const diffs = Object.keys(BINDU_TABLE).flatMap((p) => Object.keys(BINDU_TABLE[p])
    .filter((c) => sorted(F.phaladeepikaXXIII[p][c]).join() !== sorted(F.brihatJatakaIX[p][c]).join()).map((c) => `${p}/${c}`));
  assert.deepEqual(diffs, ['Moon/Jupiter']);
  assert.deepEqual(sorted(F.brihatJatakaIX.Moon.Jupiter), sorted(F.phaladeepikaXXIII.footnotes.MoonFromJupiterVarahamihira));
  assert.notDeepEqual(sorted(F.phaladeepikaXXIII.Venus.Mars), sorted(F.phaladeepikaXXIII.footnotes.VenusFromMarsParasara), 'Venus from Mars: Varahamihira\'s, not Parasara\'s');
  assert.deepEqual(plain(PG.PHALADEEPIKA_BINDU_CELLS), { Moon: { Jupiter: F.phaladeepikaXXIII.Moon.Jupiter } });
  for (const s of [...PG.BINDU_TABLES.PHALADEEPIKA.sources, ...PG.BINDU_TABLES.VARAHAMIHIRA.sources]) assert.ok(resolveByTitle(s.title), s.title);

  // XXIII.11: nine results, 3 and 4 both fear (भीति, भय) — Kapoor lists seven.
  assert.equal(PG.BINDU_RESULTS_TA.length, 9);
  assert.equal(PG.BINDU_RESULTS_TA[3], PG.BINDU_RESULTS_TA[4]);
  assert.equal(F.XXIII11.results[3], F.XXIII11.results[4]);
  assert.ok(PG.BINDU_RESULTS_SOURCE.pageLocus.includes(F.XXIII11.verse));
  assert.ok(PG.BINDU_FOUR_NOTE.sources[0].pageLocus.includes('seven') && F.XXIII11.kapoorCount === 7);
  // The two readings: XXIII.20's "more than 28" (the same word as verse 41), Jataka Parijata X.9's "from 5".
  const R = PG.BINDU_READINGS;
  assert.equal(R.default, 'SAV_28');
  assert.equal(R.SAV_28.threshold, F.XXIII20.threshold);
  assert.ok(R.SAV_28.sources[0].pageLocus.includes(F.XXIII20.verse) && R.SAV_28.sources[0].pageLocus.includes(`p.${F.XXIII20.printedPage}`));
  const r41 = PG.RULES.find((x) => x.id === 'BINDUS');
  assert.ok(r41.computed && r41.source.pageLocus.includes(F.XXVI41.verse));
  // (In verse 41 the अ is elided after वर्गे — "ऽधिकबिन्दवः".)
  assert.ok(F.XXIII20.verse.includes('धिकबिन्दव') && F.XXVI41.verse.includes('ऽधिकबिन्दव'), 'the same word in both verses');
  assert.ok(R.SAV_28.sources[1].pageLocus.includes(F.pulippani.text) && R.SAV_28.sources[1].pageLocus.includes(`p.${F.pulippani.printedPage}`));
  const J = F.jatakaParijataX;
  assert.equal(R.BAV_5.threshold, J.alwaysFrom);
  assert.ok([J.sloka9, J.sloka9Transit, J.sloka11].every((w) => R.BAV_5.sources[0].pageLocus.includes(w)));
  assert.ok(R.BAV_5.sources[1].pageLocus.includes(J.sloka4));
  assert.ok(R.BAV_5.sources[2].pageLocus.includes(F.brihatJatakaIX.sloka8));
  assert.ok(R.BAV_5.sources[3].pageLocus.includes(`p.${F.patel.printedPage}`));
  for (const s of [...R.SAV_28.sources, ...R.BAV_5.sources, ...PG.BINDU_FOUR_NOTE.sources, ...PG.BINDU_SURVEY_SOURCES, PG.BINDU_RESULTS_SOURCE]) assert.ok(resolveByTitle(s.title), s.title);
  assert.ok(PG.BINDU_SURVEY.every((s) => ['SAV_28', 'BAV_5', 'BAV_4'].includes(s.reading)));

  // The charts. Every planet and the Lagna in Mesha: each sign's count is the number of contributors naming that house.
  const allMesha = { Sun: 0, Moon: 0, Mars: 0, Mercury: 0, Jupiter: 0, Venus: 0, Saturn: 0, Lagna: 0 };
  const C = binduCharts(allMesha);
  for (const id of ['PHALADEEPIKA', 'VARAHAMIHIRA']) {
    for (const [p, total] of Object.entries(EXPECTED_TOTAL)) assert.equal(C[id].bav[p].reduce((a, x) => a + x, 0), total, `${id} ${p}`);
    assert.equal(C[id].sav.reduce((a, x) => a + x, 0), EXPECTED_GRAND_TOTAL);
  }
  // The one cell: Jupiter's 2nd (Vrishabha) under Phaladeepika, 12th (Meena) under Varahamihira.
  for (let s = 0; s < 12; s += 1) {
    const d = C.PHALADEEPIKA.bav.Moon[s] - C.VARAHAMIHIRA.bav.Moon[s];
    assert.equal(d, s === 1 ? 1 : s === 11 ? -1 : 0, `Moon, sign ${s}`);
    for (const p of ['Sun', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']) assert.equal(C.PHALADEEPIKA.bav[p][s], C.VARAHAMIHIRA.bav[p][s]);
  }
  // By hand: Saturn in Tula (the 7th) — only the Sun names Saturn's 7th: 1 bindu, "destruction or loss".
  // Tula's total: Sun's chart 4 (Sun, Mars, Venus, Saturn), Moon's 5, Mars's 2, Mercury's 2, Jupiter's 5, Venus's 0, Saturn's 1.
  const t = bindusAt(C, 'Saturn', 6).PHALADEEPIKA;
  assert.deepEqual(plain(t), { bav: 1, sav: 19, bySav: false, byBav: false, resultTa: PG.BINDU_RESULTS_TA[1] });
  // Jupiter in Mesha: the Sun, Mars, Mercury, himself and the Lagna name his 1st — 5, "the desired object".
  const j = bindusAt(C, 'Jupiter', 0).PHALADEEPIKA;
  assert.deepEqual([j.bav, j.byBav, j.resultTa], [5, true, PG.BINDU_RESULTS_TA[5]]);
  assert.equal(j.sav, C.PHALADEEPIKA.sav[0]);
  assert.equal(j.bySav, C.PHALADEEPIKA.sav[0] > 28);
  // The nodes have no chart of their own; the total still applies.
  const rh = bindusAt(C, 'Rahu', 8).VARAHAMIHIRA;
  assert.deepEqual([rh.bav, rh.byBav, rh.resultTa, rh.sav], [null, null, null, C.VARAHAMIHIRA.sav[8]]);

  // In the present block, and in the page's stays.
  const lon = { Sun: 190, Moon: 100, Mars: 300, Mercury: 160, Jupiter: 5, Venus: 40, Saturn: 185, Rahu: 250, Ketu: 70 };
  const n = phaladeepikaNow({ moonRasiIndex: 0, lon, retrograde: {}, bindus: C });
  assert.deepEqual(plain(n.planets.Saturn.bindus.PHALADEEPIKA), plain(t));
  assert.equal(n.planets.Jupiter.goodHouse, false, 'Jupiter in the 1st: a bad house, where verse 41 says good all the same');
  assert.equal(n.planets.Jupiter.bindus.PHALADEEPIKA.byBav, true);
  assert.equal(phaladeepikaNow({ moonRasiIndex: 0, lon, retrograde: {} }).planets.Saturn.bindus, null, 'not judged without the natal chart');
  const rb = phaladeepikaReportBlock({ moonRasiIndex: 0, lon, retrograde: {}, natalRasi: allMesha });
  assert.deepEqual(plain(rb.planets.Saturn.bindus), plain(n.planets.Saturn.bindus));
  assert.deepEqual([rb.bindu.defaultTable, rb.bindu.defaultReading], ['PHALADEEPIKA', 'SAV_28']);
  const g = gocharaVedha({ moonRasiIndex: 3, atMs: Date.parse('2026-10-08T06:00:00Z'), natalRasi: allMesha });
  for (const [p, x] of Object.entries(g.phaladeepika.planets)) {
    for (const s of x.stays) assert.deepEqual(plain(s.bindus), plain(bindusAt(C, p, (3 + s.house - 1) % 12)), `${p} ${s.fromUtc}`);
    assert.deepEqual(plain(x.now.bindus), plain(bindusAt(C, p, (3 + x.now.house - 1) % 12)), `${p} now`);
  }
  assert.deepEqual(plain(g.phaladeepika.bindu.sav), { PHALADEEPIKA: plain(C.PHALADEEPIKA.sav), VARAHAMIHIRA: plain(C.VARAHAMIHIRA.sav) });
  assert.equal(gocharaVedha({ moonRasiIndex: 3, atMs: Date.parse('2026-10-08T06:00:00Z') }).phaladeepika.bindu, null);
}

// ------------------------------------------------ word order ---
const w = V.VEDHA_RANK.words;
assert.deepEqual(plain(w), FIX.wordCounts);
assert.deepEqual([...V.VEDHA_RANK.order], Object.keys(w).sort((a, b) => w[b] - w[a]));
// The owner's decision (2026-10-10): Phaladeepika is the default, not the first by words; the order stays by words.
assert.equal(V.DEFAULT_VEDHA_METHOD, 'PHALADEEPIKA_SASTRI');
assert.ok(V.VEDHA_RANK.computable.includes(V.DEFAULT_VEDHA_METHOD));
assert.ok(V.VEDHA_RANK.defaultTa.includes('2026-10-10') && !V.VEDHA_RANK.alternativeTa.includes('காத்திருக்கிறது'), 'the decision is recorded, no longer pending');
assert.deepEqual([...V.VEDHA_RANK.computable], V.VEDHA_RANK.order.filter((b) => V.VEDHA_METHODS[b]));

// ------------------------------------------------ citations ---
const cites = [];
const walk = (o) => { if (o && typeof o === 'object') { if (typeof o.pageLocus === 'string') cites.push(o); Object.values(o).forEach(walk); } };
walk(V);
for (const c of cites) assert.ok(resolveByTitle(c.title), `registered: ${c.title}`);

// ------------------------------------------------ the present, by hand ---
{
  // Venus in the 1st, the Sun in the 8th (Venus's vedha house): Pulippani exempts the Sun; Phaladeepika (the default) and Vishnu Bhaskar do not.
  const pRow = computeGocharaPhala(0, { Venus: 0, Sun: 7 }, 'PULIPPANI').find((r) => r.graha === 'Venus');
  const vRow = computeGocharaPhala(0, { Venus: 0, Sun: 7 }, 'VISHNU_BHASKAR').find((r) => r.graha === 'Venus');
  const dRow = computeGocharaPhala(0, { Venus: 0, Sun: 7 }).find((r) => r.graha === 'Venus');
  assert.equal(pRow.verdict, 'benefic');
  assert.equal(vRow.verdict, 'vedha');
  assert.equal(dRow.verdict, 'vedha', 'the default has no Venus–Sun exemption');
  assert.ok(dRow.source.startsWith('Phaladeepika (V. Subrahmanya Sastri, 1950)') && dRow.source.includes('slokas 2-8'), dRow.source);
  assert.equal(pRow.source, 'Gochar Phaladeepika (Transit Results) — printed pp.204-205 (PDF 197-198), chapter 22 "Gochara Vedha and Vipareetha Vedha", table 1');
  // Rahu in the 10th: good with no vedha house under Pulippani and Phaladeepika; not good under Vishnu Bhaskar.
  assert.equal(computeGocharaPhala(0, { Rahu: 9 }, 'PULIPPANI').find((r) => r.graha === 'Rahu').verdict, 'benefic');
  assert.equal(computeGocharaPhala(0, { Rahu: 9 }).find((r) => r.graha === 'Rahu').verdict, 'benefic');
  assert.equal(computeGocharaPhala(0, { Rahu: 9 }, 'VISHNU_BHASKAR').find((r) => r.graha === 'Rahu').verdict, 'neutral');
  // Rahu in the 11th, Ketu necessarily in the 5th (Pulippani's vedha house): not counted.
  assert.equal(computeGocharaPhala(0, { Rahu: 10, Ketu: 4 }, 'PULIPPANI').find((r) => r.graha === 'Rahu').verdict, 'benefic');
  // Vipareetha: Saturn in the 12th, Jupiter in the 3rd — Pulippani's; the default has none.
  const sat = computeGocharaPhala(0, { Saturn: 11, Jupiter: 2 }, 'PULIPPANI').find((r) => r.graha === 'Saturn');
  assert.equal(sat.vipareetaHouse, 3);
  assert.deepEqual(sat.relievedBy, ['Jupiter']);
  const satD = computeGocharaPhala(0, { Saturn: 11, Jupiter: 2 }).find((r) => r.graha === 'Saturn');
  assert.deepEqual([satD.vipareetaHouse, satD.relievedBy, satD.verdict], [0, [], 'neutral'], 'Phaladeepika XXVI has no vipareetha vedha');
  // Mercury in the 10th, a planet in the 8th: obstructed by Pulippani's and Phaladeepika's table, not Vishnu Bhaskar's.
  assert.equal(computeGocharaPhala(0, { Mercury: 9, Mars: 7 }, 'PULIPPANI').find((r) => r.graha === 'Mercury').verdict, 'vedha');
  assert.equal(computeGocharaPhala(0, { Mercury: 9, Mars: 7 }).find((r) => r.graha === 'Mercury').verdict, 'vedha');
  assert.equal(computeGocharaPhala(0, { Mercury: 9, Mars: 7 }, 'VISHNU_BHASKAR').find((r) => r.graha === 'Mercury').verdict, 'benefic');
  // Santhanam: Saturn in the 1st (Sade Sati) with Mars in the same sign — checked; with the Sun — the Sun is exempt.
  const s1 = computeGocharaPhala(0, { Saturn: 0, Mars: 0 }, 'SANTHANAM').find((r) => r.graha === 'Saturn');
  assert.deepEqual([s1.vipareetaHouses, s1.relievedBy], [[1], ['Mars']]);
  assert.deepEqual(computeGocharaPhala(0, { Saturn: 0, Sun: 0 }, 'SANTHANAM').find((r) => r.graha === 'Saturn').relievedBy, []);
  // Santhanam: the Sun in the 4th relieved from the 10th (reversal) or the 3rd (bad places).
  assert.deepEqual(computeGocharaPhala(0, { Sun: 3, Mars: 2 }, 'SANTHANAM').find((r) => r.graha === 'Sun').relievedBy, ['Mars']);
  assert.deepEqual(computeGocharaPhala(0, { Sun: 3, Mars: 2 }, 'PULIPPANI').find((r) => r.graha === 'Sun').relievedBy, [], 'Pulippani has no 3rd for it');
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
  assert.deepEqual(Object.keys(r.methods), [...V.VEDHA_RANK.computable]);
  // Phaladeepika XXVI: one list per planet, in the order of every method's stays.
  const PD = r.phaladeepika.planets;
  for (const id of Object.keys(r.methods)) {
    for (const p of Object.values(r.methods[id].planets)) {
      assert.deepEqual(PD[p.planet].stays.map((s) => [s.fromUtc, s.house]), p.stays.map((s) => [s.fromUtc, s.house]), `${id} ${p.planet}: same stays`);
    }
  }
  // Verse 25: every effective interval lies in the planet's stated third of the stay's sign.
  const third = (p, ms) => Math.floor((((lon(p, ms) % 360) + 360) % 360 % 30) / 10);
  let effChecked = 0;
  for (const [planet, pd] of Object.entries(PD)) {
    for (const s of pd.stays) {
      const e = s.effective;
      assert.equal(s.resultTa, PG.HOUSE_RESULTS[planet]?.[s.house - 1] ?? null);
      assert.equal(s.dangerVerse33, ['Saturn', 'Sun', 'Mars', 'Jupiter'].includes(planet) && [12, 8, 1].includes(s.house));
      if (planet === 'Ketu') { assert.equal(e, null); continue; }
      if (PG.DECANATE[planet] === null) { assert.equal(e, 'ALL'); continue; }
      for (const w of e) {
        const m2 = (ms(w.fromUtc) + ms(w.toUtc)) / 2;
        assert.equal(third(planet, m2), PG.DECANATE[planet], `${planet} ${w.fromUtc}: in its third`);
        assert.equal(((signAt(planet, m2) - moonRasiIndex + 12) % 12) + 1, s.house, `${planet} ${w.fromUtc}: in the stay's sign`);
        assert.ok(ms(w.fromUtc) >= ms(s.fromUtc) && ms(w.toUtc) <= ms(s.toUtc));
        effChecked += 1;
      }
    }
    if (planet in PG.DECANATE && PG.DECANATE[planet] !== null) assert.equal(pd.now.effectiveNow, third(planet, atMs) === PG.DECANATE[planet]);
  }
  assert.ok(effChecked > 20, `effective windows checked (${effChecked})`);
  // And no window is missed: sampled through each stay, the planet is in its third only inside the windows listed.
  for (const [planet, pd] of Object.entries(PD)) {
    if (!(planet in PG.DECANATE) || PG.DECANATE[planet] === null) continue;
    for (const s of pd.stays) {
      const a = ms(s.fromUtc); const b = ms(s.toUtc);
      for (let i = 1; i < 40; i += 1) {
        const t = a + ((b - a) * i) / 40;
        const inside = s.effective.some((w) => ms(w.fromUtc) - 60000 <= t && t <= ms(w.toUtc) + 60000);
        assert.equal(third(planet, t) === PG.DECANATE[planet], inside, `${planet} ${new Date(t).toISOString()}: in its third ⇔ listed`);
      }
    }
  }
  // Sun: one effective window a year per sign it enters — about ten days each.
  for (const w of PD.Sun.stays.flatMap((s) => s.effective).filter((x) => !x.fromUtc.startsWith(PD.Sun.stays[0].fromUtc.slice(0, 10)))) assert.ok(w.days > 9 && w.days < 12, `Sun's first third lasts about ten days (${w.days})`);
  // Verses 31-32: dignity by sign; combustion windows against the sky, sampled both ways.
  const sep = (p, t) => Math.abs(((((lon(p, t) - lon('Sun', t)) + 180) % 360) + 360) % 360 - 180);
  const retro = (p, t) => ((((lon(p, t + 6 * 3600000) - lon(p, t - 6 * 3600000)) + 180) % 360) + 360) % 360 - 180 < 0;
  const isCombust = (p, t) => sep(p, t) < PG.combustionOrb(p, retro(p, t));
  let combustChecked = 0;
  for (const [planet, pd] of Object.entries(PD)) {
    for (const s of pd.stays) {
      const sign = (moonRasiIndex + s.house - 1) % 12;
      assert.deepEqual(plain(s.dignity), PG.dignityOf(planet, sign));
      assert.equal(s.goodHouse, V.VEDHA_METHODS.PHALADEEPIKA_SASTRI.table[planet].good.includes(s.house));
      if (!(planet in PG.COMBUSTION_DEGREES)) { assert.equal(s.combust, null); continue; }
      const a = ms(s.fromUtc); const b = ms(s.toUtc);
      for (let i = 1; i < 30; i += 1) {
        const t = a + ((b - a) * i) / 30;
        // Boundaries are bisected to a minute; samples within five minutes of one are not judged.
        if (s.combust.some((w) => Math.min(Math.abs(t - ms(w.fromUtc)), Math.abs(t - ms(w.toUtc))) < 5 * 60000)) continue;
        const listed = s.combust.some((w) => ms(w.fromUtc) <= t && t <= ms(w.toUtc));
        assert.equal(isCombust(planet, t), listed, `${planet} ${new Date(t).toISOString()}: combust ⇔ listed`);
        combustChecked += 1;
      }
    }
    const n = pd.now;
    if (planet in PG.COMBUSTION_DEGREES) assert.equal(n.combustion.combust, isCombust(planet, atMs));
    else assert.equal(n.combustion.combust, null);
    assert.deepEqual(plain(n.verdict), PG.verses31and32(PG.dignityOf(planet, signAt(planet, atMs)), n.combustion.combust, n.goodHouse));
  }
  assert.ok(combustChecked > 500 && PD.Mercury.stays.some((s) => s.combust.length), `combustion sampled (${combustChecked})`);
  // Verse 30, now: every full and partial aspect from the signs in the sky; natures by II.27 at this moment.
  const signNowT = (p) => signAt(p, atMs);
  const elong = ((((lon('Moon', atMs) - lon('Sun', atMs)) % 360) + 360) % 360);
  assert.equal(r.phaladeepika.moonNow.nature, elong < 180 ? 'BENEFIC' : 'MALEFIC');
  const merMal = ['Sun', 'Mars', 'Saturn', 'Rahu', 'Ketu', ...(elong >= 180 ? ['Moon'] : [])].some((m) => signNowT(m) === signNowT('Mercury'));
  assert.equal(r.phaladeepika.mercuryNow.nature, merMal ? 'MALEFIC' : 'BENEFIC');
  for (const [planet, pd] of Object.entries(PD)) {
    const want = Object.keys(PG.FULL_ASPECTS).filter((o) => o !== planet).map((o) => {
      const k = ((signNowT(planet) - signNowT(o) + 12) % 12) + 1;
      const a = PG.aspectsOf(o);
      return a.full.includes(k) ? [o, k, 1] : a.partial.some(([h]) => h === k) ? [o, k, a.partial.find(([h]) => h === k)[1]] : null;
    }).filter(Boolean);
    assert.deepEqual(pd.now.aspects.map((x) => [x.planet, x.house, x.fraction]), want, `${planet}: aspects now`);
    for (const x of pd.now.aspects.filter((y) => y.full)) {
      assert.equal(x.enemy, PG.NATURAL_ENEMIES[planet].includes(x.planet));
      assert.deepEqual({ voids: x.voids, enemy: x.enemy }, plain(PG.verse30Effect({ nature: x.nature, enemy: x.enemy }, pd.now.goodHouse)));
    }
  }
  // Verse 30, per stay: each window is a full aspect from the sky; Mercury's nature by his company; nothing missed.
  let aspChecked = 0;
  for (const [planet, pd] of Object.entries(PD)) {
    for (const s of pd.stays) {
      const S = (moonRasiIndex + s.house - 1) % 12;
      for (const b of s.aspects.by) {
        for (const w of b.windows) {
          const m2 = (ms(w.fromUtc) + ms(w.toUtc)) / 2;
          const k = ((S - signAt(b.planet, m2) + 12) % 12) + 1;
          assert.ok(PG.aspectsOf(b.planet).full.includes(k), `${b.planet} aspects ${planet}'s sign at ${w.fromUtc} (house ${k})`);
          if (b.planet === 'Mercury') {
            const company = ['Sun', 'Mars', 'Saturn', 'Rahu', 'Ketu'].some((m) => signAt(m, m2) === signAt('Mercury', m2));
            assert.equal(b.nature, company ? 'MALEFIC' : 'BENEFIC', `Mercury's nature at ${w.fromUtc}`);
          }
          aspChecked += 1;
        }
      }
      const a = ms(s.fromUtc); const b2 = ms(s.toUtc);
      for (const o of ['Sun', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].filter((x) => x !== planet)) {
        const ws = s.aspects.by.filter((x) => x.planet === o).flatMap((x) => x.windows);
        for (let i = 1; i < 12; i += 1) {
          const t = a + ((b2 - a) * i) / 12;
          if (ws.some((w) => Math.min(Math.abs(t - ms(w.fromUtc)), Math.abs(t - ms(w.toUtc))) < 2 * 3600000)) continue;
          const k = ((S - signAt(o, t) + 12) % 12) + 1;
          assert.equal(PG.aspectsOf(o).full.includes(k), ws.some((w) => ms(w.fromUtc) <= t && t <= ms(w.toUtc)), `${o} on ${planet} at ${new Date(t).toISOString()}: aspect ⇔ listed`);
        }
      }
    }
  }
  assert.ok(aspChecked > 200, `aspect windows checked (${aspChecked})`);
  // Verse 34: each position checked against the sky.
  for (const x of r.phaladeepika.verse34Now.positions) assert.equal(x.nowHouse, ((signAt(x.planet, atMs) - moonRasiIndex + 12) % 12) + 1);
  assert.equal(r.phaladeepika.verse34Now.met, r.phaladeepika.verse34Now.positions.filter((x) => x.house === x.nowHouse).length);
  // Phaladeepika's windows: no stay is relievable (no vipareetha), and its seven-planet classification is Pulippani's.
  for (const p of Object.values(r.methods.PHALADEEPIKA_SASTRI.planets)) {
    assert.ok(p.stays.every((s) => s.kind !== 'RELIEVABLE'), `${p.planet}: no vipareetha`);
    if (p.planet === 'Rahu' || p.planet === 'Ketu') continue;
    const pu = r.methods.PULIPPANI.planets[p.planet];
    p.stays.forEach((s, i) => assert.equal(s.pairedHouse ?? null, pu.stays[i].kind === 'GOOD' ? pu.stays[i].pairedHouse : null, `${p.planet} stay ${i}`));
  }
  console.log(`  engine: nine planets, ${Object.keys(r.methods).length} books, in ${elapsed} ms`);
}

console.log('test-gochara-vedha: all checks passed');
