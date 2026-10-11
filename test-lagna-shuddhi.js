const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const T = require('./src/report/lagnaShuddhiTables');
const { lagnaShuddhiOf, lagnaVerdict, navamsaOf, vargaIndices, shadvargaOf, drekkanaOf, vishanadiOf, sees, pointsOf, placementsOf, ashtamaOf, pdbOf, kartariOf, commonOf, adverseOf, houseOf } = require('./src/report/lagnaShuddhi');
const { combustionOrb } = require('./src/report/phaladeepikaGocharaTables');
const { muhurtaStarChecks } = require('./src/report/muhurtaStars');
const { planetLongitude, nodeLongitude, sunriseJulianDay, sunsetJulianDay } = require('./src/ephemeris/siderealPositions');
const { siderealAscendant } = require('./src/ephemeris/swissEphemeris');
const { resolveByTitle } = require('./src/sources/registry');

const FIX = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/lagna-shuddhi/books.json'), 'utf8'));
const plain = (o) => JSON.parse(JSON.stringify(o));
const housesFrom = (lagna, signs) => Object.fromEntries(T.PLANETS.map((p) => [p, houseOf(signs[p], lagna)]));

// ------------------------------------------------ the twenty points ---
{
  const P = FIX.points;
  for (const [p, n] of Object.entries(P.MUHURTA_CHINTAMANI_p216)) assert.equal(T.POINTS[p].points, n, p);
  for (const p of ['Sun', 'Ketu', 'Rahu', 'Saturn', 'Mars', 'Moon']) assert.deepEqual([...T.POINTS[p].good], P.goodPlaces_MC_p214[p], p);
  const rest = (not) => [...Array(12).keys()].map((i) => i + 1).filter((h) => !not.includes(h));
  assert.deepEqual([...T.POINTS.Mercury.good], rest(P.goodPlaces_MC_p214.MercuryJupiterNot));
  assert.deepEqual([...T.POINTS.Jupiter.good], rest(P.goodPlaces_MC_p214.MercuryJupiterNot));
  assert.deepEqual([...T.POINTS.Venus.good], rest(P.goodPlaces_MC_p214.VenusNot));
  // Rahu and Ketu are never both in 3, 6, 8, 11, so the most is twenty.
  let max = 0;
  for (let r = 1; r <= 12; r += 1) {
    const houses = { Sun: 3, Moon: 2, Mars: 3, Mercury: 1, Jupiter: 1, Venus: 1, Saturn: 3, Rahu: r, Ketu: ((r + 5) % 12) + 1 };
    max = Math.max(max, pointsOf(houses, 'ADD'));
  }
  assert.equal(max, P.max);
  // Rangacharya's example: Aries lagna, 8 vimsopakas with the losses; 11.5 counting gains only.
  const E = FIX.rangacharyaExample;
  const h = housesFrom(E.lagna, E.signs);
  assert.equal(pointsOf(h, 'PLUS_MINUS'), E.total, 'Rangacharya p.100');
  assert.equal(pointsOf(h, 'ADD'), Object.values(E.lines).filter((x) => x > 0).reduce((a, b) => a + b, 0));
  assert.equal(placementsOf(h, h.Mars).RANGACHARYA.grade, 'LOW', '5 to 10: mediocre');
}

// ------------------------------------------------ the places to avoid ---
{
  const A = FIX.avoid;
  assert.deepEqual(plain(T.AVOID.JOSHI), A.JOSHI_p75);
  assert.deepEqual(A.JOSHI_p75, A.KALYANRAMAN_v2_p127, 'Joshi = Kalyanraman (Jyotirvidabharana)');
  assert.deepEqual(plain(T.AVOID.SHRIDHAR), A.SHRIDHAR_table18_5);
  const { LAGNA_LORD, ...ranga } = plain(T.AVOID.RANGACHARYA);
  assert.deepEqual(ranga, A.RANGACHARYA_p99);
  // Muhurta Chintamani sloka 86, place by place; and nothing else.
  const mc = new Set(A.MC_sloka86.map(([p, hh]) => `${p}${hh}`));
  const ours = new Set(Object.entries(T.AVOID.MUHURTA_CHINTAMANI).flatMap(([p, hs]) => hs.map((hh) => `${p}${hh}`)));
  assert.deepEqual([...ours].sort(), [...mc].sort());
  // Wilhelm = Muhurta Chintamani but for Venus in the 3rd ("according to some").
  assert.deepEqual(plain({ ...T.AVOID.WILHELM, Venus: [3, 6, 7, 8] }), plain(T.AVOID.MUHURTA_CHINTAMANI));
  // Grades.
  for (const [book, rows] of Object.entries(FIX.grades)) {
    const r = T.PLACEMENTS[book];
    for (const [pts, grade] of rows) assert.equal(r.grades.find(([min]) => pts >= min)?.[1] ?? 'REJECT', grade, `${book} ${pts}`);
  }
  // Shridhar: one adverse place may pass, two may not.
  const base = { Sun: 11, Moon: 3, Mars: 6, Mercury: 10, Jupiter: 9, Venus: 5, Saturn: 3, Rahu: 6, Ketu: 12 };
  const ok = placementsOf(base, 9);
  assert.equal(ok.SHRIDHAR.points, 3.5 + 5 + 1.5 + 2 + 3 + 2 + 1.5 + 1.5);
  assert.equal(ok.SHRIDHAR.pass, true);
  assert.equal(placementsOf({ ...base, Saturn: 12 }, 9).SHRIDHAR.avoid.length, 1);
  assert.equal(placementsOf({ ...base, Saturn: 12, Sun: 7 }, 9).SHRIDHAR.pass, false);
  assert.equal(placementsOf({ ...base, Saturn: 12 }, 9).MUHURTA_CHINTAMANI.pass, false, 'Muhurta Chintamani: none');
}

// ------------------------------------------------ the 8th sign from birth ---
{
  // The 8th with one lord or friends is free — exactly Muhurta Chintamani's six signs.
  const free = [];
  for (let n = 0; n < 12; n += 1) {
    const eighth = (n + 7) % 12;
    const a = ashtamaOf(eighth, n, null);
    assert.equal(a.houses[0].house, 8);
    if (a.EIGHTH.length === 0) free.push(eighth);
    // The other reading adds the 4th and 12th.
    assert.equal(ashtamaOf((n + 3) % 12, n, null).FOUR_EIGHT_TWELVE.length, 1);
    assert.equal(ashtamaOf((n + 11) % 12, n, null).FOUR_EIGHT_TWELVE.length, 1);
    assert.equal(ashtamaOf((n + 3) % 12, n, null).EIGHTH.length, 0);
  }
  assert.deepEqual(free.sort((a, b) => a - b), [...FIX.ashtamaFreeEighths_MC_p186].sort((a, b) => a - b));
  // From the birth Moon as well.
  assert.deepEqual(ashtamaOf(8, 0, 1).EIGHTH.map((x) => x.from), ['MOON'], 'Sagittarius: 9th from Aries, 8th from Taurus — Venus and Jupiter are enemies');
  assert.deepEqual(ashtamaOf(9, 0, 2).EIGHTH, [], 'Capricorn, 8th from Gemini: Saturn friendly, Mercury neutral');
}

// ------------------------------------------------ deaf, blind, lame ---
{
  for (const [time, kinds] of Object.entries(FIX.pdb_MC_sloka80)) {
    for (const [k, signs] of Object.entries(kinds)) assert.deepEqual([...T.PDB[time][k]].sort(), [...signs].sort(), `${time} ${k}`);
    for (const [k, signs] of Object.entries(FIX.pdb_Rangacharya_p97_1based[time])) assert.deepEqual([...T.PDB[time][k]].sort(), signs.map((s) => s - 1).sort(), `Rangacharya ${time} ${k}`);
  }
  // Libra by day is deaf; Jupiter in Aquarius aspects it (9th) — no dosha.
  const signs = { Sun: 0, Moon: 0, Mars: 0, Mercury: 0, Jupiter: 1, Venus: 0, Saturn: 0, Rahu: 0, Ketu: 6 };
  assert.deepEqual(plain(pdbOf(6, false, signs)), { kind: 'DEAF', relief: false, present: true });
  assert.equal(pdbOf(6, false, { ...signs, Jupiter: 10 }).present, false);
  assert.equal(pdbOf(6, true, signs).kind, null, 'not deaf at night');
  // Jupiter aspecting the lagna's lord (Venus, in Taurus, from Capricorn's 5th aspect) also lifts it.
  assert.equal(pdbOf(6, false, { ...signs, Venus: 1, Jupiter: 9 }).relief, true);
}

// ------------------------------------------------ Kartari ---
{
  const h = (o) => ({ Sun: 5, Moon: 5, Mars: 5, Mercury: 5, Jupiter: 5, Venus: 5, Saturn: 5, Rahu: 9, Ketu: 3, ...o });
  assert.equal(kartariOf(h({ Sun: 12, Saturn: 2 }), { Saturn: true }).SCISSORS, true, 'direct Sun in 12, retrograde Saturn in 2');
  assert.equal(kartariOf(h({ Sun: 12, Saturn: 2 }), { Saturn: false }).SCISSORS, false);
  assert.equal(kartariOf(h({ Sun: 12, Saturn: 2 }), { Saturn: false }).HEMMED, true);
  assert.equal(kartariOf(h({ Mars: 12, Rahu: 2, Ketu: 8 }), {}).SCISSORS, true, 'Rahu is always retrograde');
  // Rangacharya: both retrograde — no Kartari; Shridhar's reading still has it.
  const both = kartariOf(h({ Saturn: 12, Rahu: 2, Ketu: 8 }), { Saturn: true });
  assert.equal(both.SCISSORS, false);
  assert.equal(both.RETRO_SECOND, true);
  assert.equal(kartariOf(h({ Jupiter: 12, Saturn: 2 }), { Saturn: true }).HEMMED, false, 'Jupiter is no malefic');
}

// ------------------------------------------------ Bana by tithi and lagna ---
{
  const signs = { Sun: 0, Moon: 0, Mars: 0, Mercury: 0, Jupiter: 0, Venus: 0, Saturn: 0, Rahu: 0, Ketu: 6 };
  for (const e of FIX.banaTithiLagna) {
    const l = lagnaShuddhiOf({ lagna: e.lagna, signs, retro: {}, night: false, gandanta: {}, natalLagna: null, natalMoon: null, tithi: e.tithi });
    assert.equal(l.banaMrityu, e.mrityu, e.book);
  }
}

// ------------------------------------------------ order by words; sources ---
{
  for (const [k, words] of Object.entries(FIX.words)) {
    assert.deepEqual(plain(T.RANK[k].words), words, k);
    assert.deepEqual([...T.RANK[k].order], Object.keys(words).sort((a, b) => words[b] - words[a]), k);
    assert.equal(T.RANK[k].order[0], Object.keys(T.SOURCES[k])[0], `${k}: sources most-explained first`);
  }
  for (const [k, id] of Object.entries(FIX.defaults)) assert.equal(T[k].default, id, k);
  assert.equal(T.PLACEMENTS.default, T.RANK.PLACEMENTS.order[0]);
  const cites = [];
  const walk = (o) => { if (o && typeof o === 'object') { if (typeof o.pageLocus === 'string') cites.push(o); Object.values(o).forEach(walk); } };
  walk(T);
  assert.ok(cites.length >= 30);
  for (const c of cites) assert.ok(resolveByTitle(c.title), `registered: ${c.title}`);
  assert.ok(T.SOURCES.PLACEMENTS.MUHURTA_CHINTAMANI.pageLocus.includes('व्यये शनिः खेऽवनिजस्तृतीये'));
  // The verdict rule.
  const signs = { Sun: 2, Moon: 2, Mars: 5, Mercury: 9, Jupiter: 8, Venus: 10, Saturn: 2, Rahu: 5, Ketu: 11 };
  const l = lagnaShuddhiOf({ lagna: 0, signs, retro: {}, night: false, gandanta: { MINUTES_12: true, DEGREES_3: false }, natalLagna: null, natalMoon: null, tithi: 1 });
  assert.ok(lagnaVerdict(l, { PLACEMENTS: 'RANGACHARYA', ASHTAMA: 'EIGHTH', KARTARI: 'SCISSORS', GANDANTA: 'MINUTES_12' }).reasons.includes('GANDANTA'));
  assert.ok(!lagnaVerdict(l, { PLACEMENTS: 'RANGACHARYA', ASHTAMA: 'EIGHTH', KARTARI: 'SCISSORS', GANDANTA: 'DEGREES_3' }).reasons.includes('GANDANTA'));
}

// ------------------------------------------------ the lagna's navamsa ---
{
  const signs = { Sun: 0, Moon: 1, Mars: 0, Mercury: 0, Jupiter: 0, Venus: 0, Saturn: 0, Rahu: 0, Ketu: 6 };
  const nv = (n108, o = {}) => navamsaOf({ n108, half: 0, signs: { ...signs, ...o.signs }, natalLagnaLongitude: o.natalLagnaLongitude, natalLagna: o.natalLagna ?? null, natalMoon: o.natalMoon ?? null, ...o.extra });
  const N = FIX.navamsa;
  const signSet = (id) => [...T.NAV_WHICH[id].signs].sort((a, b) => a - b);
  assert.deepEqual(signSet('MUHURTA_CHINTAMANI'), [...N.MC_sloka84_signs].sort((a, b) => a - b));
  assert.deepEqual(signSet('NARADA'), [...N.narada_signs].sort((a, b) => a - b));
  assert.deepEqual(signSet('RANGACHARYA'), [...N.rangacharya_signs].sort((a, b) => a - b));
  assert.deepEqual(signSet('JOSHI'), [...N.joshi_7_9_3_6].sort((a, b) => a - b));
  assert.deepEqual(signSet('BIPED'), N.biped);
  assert.ok(T.SOURCES.NAV_LAST.MUHURTA_CHINTAMANI.pageLocus.includes(N.MC_sloka85));
  // Vargottama: the 1st navamsa of movable signs, the 5th of fixed, the 9th of dual.
  for (let s = 0; s < 12; s += 1) {
    const varg = [...Array(9).keys()].filter((k) => nv(s * 9 + k).varg).map((k) => k + 1);
    assert.deepEqual(varg, [T.MOVABLE.includes(s) ? 1 : T.DUAL.includes(s) ? 9 : 5], `sign ${s}`);
    // Muhurta Chintamani: the last navamsa only where it is not vargottama — every sign but the dual ones.
    assert.equal(nv(s * 9 + 8).last.MUHURTA_CHINTAMANI.includes('LAST'), !T.DUAL.includes(s));
  }
  // The Moon in Libra or Capricorn: no movable navamsa in a movable lagna, vargottama or not (MC); Shridhar keeps Aries's and Cancer's vargottama.
  assert.deepEqual(nv(0, { signs: { Moon: 6 } }).last.MUHURTA_CHINTAMANI, ['MOVABLE'], 'Aries 1st (Aries), the Moon in Libra');
  assert.deepEqual(nv(0, { signs: { Moon: 6 } }).last.SHRIDHAR, []);
  assert.deepEqual(nv(1, { signs: { Moon: 9 } }).last.MUHURTA_CHINTAMANI, [], 'Aries 2nd navamsa is Taurus — fixed');
  assert.deepEqual(nv(3, { signs: { Moon: 9 } }).last.MUHURTA_CHINTAMANI, ['MOVABLE'], 'Aries 4th navamsa is Cancer');
  // Shridhar: the vargottama of Libra and Capricorn, and Pisces's last; Rangacharya: the first of the cardinal signs.
  assert.ok(nv(54).last.SHRIDHAR.includes('VARG_LIB_CAP'));
  assert.ok(nv(11 * 9 + 8).last.SHRIDHAR.includes('LAST'));
  assert.ok(!nv(2 * 9 + 8).last.SHRIDHAR.includes('LAST'), 'Gemini\'s 9th, vargottama');
  assert.ok(nv(27).last.RANGACHARYA.includes('FIRST_CARDINAL'), 'Cancer\'s first');
  // Which navamsa: Sagittarius's only in its first half for Narada and Rangacharya.
  const sag = 8; // Aries's 9th navamsa is Sagittarius
  assert.equal(nv(sag).which.NARADA, true);
  assert.equal(navamsaOf({ n108: sag, half: 1, signs, natalLagna: null, natalMoon: null }).which.NARADA, false);
  assert.equal(navamsaOf({ n108: sag, half: 1, signs, natalLagna: null, natalMoon: null }).which.MUHURTA_CHINTAMANI, true);
  for (let n108 = 0; n108 < 12; n108 += 1) {
    const w = nv(n108).which;
    assert.equal(w.BENEFIC_LORD, !['Sun', 'Mars', 'Saturn'].includes(T.RASI_LORDS[n108]), `lord of ${n108}`);
    assert.equal(w.BIPED, [2, 5, 6].includes(n108));
  }
  // Wilhelm's example: the natal lagna at 6° Aries — the natal 8th's navamsa is Leo, so a Leo lagna is left.
  const leo = nv(4 * 9, { natalLagnaLongitude: 6, natalLagna: 0 });
  assert.ok(leo.natal.MUHURTA_CHINTAMANI.includes('NAV8'), 'Wilhelm p.261');
  assert.ok(!nv(5 * 9, { natalLagnaLongitude: 6, natalLagna: 0 }).natal.MUHURTA_CHINTAMANI.includes('NAV8'));
  // The natal 8th lord (Mars, for an Aries birth) in the lagna.
  assert.ok(nv(4 * 9, { natalLagnaLongitude: 6, natalLagna: 0, signs: { Mars: 4 } }).natal.MUHURTA_CHINTAMANI.includes('LORD8'));
  // Muhurta Chintamani's example: Libra rising in the Sagittarius navamsa (Libra's 3rd); Jupiter in Gemini aspects both.
  const libSag = 6 * 9 + 2;
  assert.equal(libSag % 12, 8);
  assert.equal(nv(libSag, { signs: { Jupiter: 2 } }).udaya.MUHURTA_CHINTAMANI.udaya, true, 'MC p.208');
  for (const j of [8, 6]) assert.equal(nv(libSag, { signs: { Jupiter: j } }).udaya.MUHURTA_CHINTAMANI.udaya, true, `Jupiter in ${j}`);
  assert.equal(nv(libSag, { signs: { Jupiter: 1 } }).udaya.MUHURTA_CHINTAMANI.udaya, false, 'Jupiter in Taurus sees neither');
  // For the bride: Mercury (lord of Gemini, the 7th from Sagittarius) in Sagittarius aspects Gemini; or aspects Aries, the 7th house.
  assert.equal(nv(libSag, { signs: { Mercury: 8 } }).udaya.MUHURTA_CHINTAMANI.asta, true);
  assert.equal(nv(libSag, { signs: { Mercury: 6 } }).udaya.MUHURTA_CHINTAMANI.asta, true);
  assert.equal(nv(libSag, { signs: { Mercury: 3 } }).udaya.MUHURTA_CHINTAMANI.asta, false);
  // The aspects: the 7th for all; Mars 4, 8; Jupiter 5, 9; Saturn 3, 10.
  assert.equal(sees('Saturn', 0, 2), true); assert.equal(sees('Saturn', 0, 9), true); assert.equal(sees('Saturn', 0, 4), false);
  assert.equal(sees('Mars', 0, 3), true); assert.equal(sees('Mars', 0, 7), true); assert.equal(sees('Jupiter', 0, 8), true);
  assert.equal(sees('Venus', 0, 6), true); assert.equal(sees('Venus', 0, 4), false);
  // Any of four is at least as wide as Muhurta Chintamani's.
  for (let n108 = 0; n108 < 108; n108 += 1) {
    const u = nv(n108, { signs: { Jupiter: n108 % 12, Venus: (n108 * 7) % 12 } }).udaya;
    if (u.MUHURTA_CHINTAMANI.udaya) assert.ok(u.ANY_OF_FOUR.udaya, `${n108}`);
  }
}

// ------------------------------------------------ shadvarga, decanate, the poison portions ---
{
  const S = FIX.shadvarga;
  // Rangacharya's example: Gemini 26° — four benefic lords, acceptable.
  const E = S.rangacharyaExample;
  const sv = shadvargaOf(vargaIndices(E.longitude));
  assert.deepEqual(plain(sv.lords), E.lords, 'Rangacharya pp.53-54');
  assert.equal(sv.benefic, E.benefic);
  assert.equal(sv.readings.RANGACHARYA, E.acceptable);
  assert.deepEqual([...T.VARGA_BENEFICS], S.benefics);
  // The trimsamsa's spans.
  for (const [kind, rows] of [['ODD', S.trimsamsa_odd], ['EVEN', S.trimsamsa_even]]) {
    let at = 0;
    rows.forEach(([lord, span], i) => { at += span; assert.equal(T.TRIMSAMSA[kind].lords[i], lord); assert.equal(T.TRIMSAMSA[kind].ends[i], at); });
  }
  // Hora: odd signs the Sun then the Moon; even the Moon then the Sun. Drekkana: the sign, its 5th, its 9th. Dwadasamsa from the sign.
  assert.equal(shadvargaOf(vargaIndices(5)).lords.D2, 'Sun');
  assert.equal(shadvargaOf(vargaIndices(20)).lords.D2, 'Moon');
  assert.equal(shadvargaOf(vargaIndices(35)).lords.D2, 'Moon');
  assert.deepEqual([5, 15, 25].map((d) => shadvargaOf(vargaIndices(d)).lords.D3), ['Mars', 'Sun', 'Jupiter']);
  for (let k = 0; k < 12; k += 1) assert.equal(shadvargaOf(vargaIndices(120 + k * 2.5 + 1)).lords.D12, T.RASI_LORDS[(4 + k) % 12], `Leo dwadasamsa ${k + 1}`);
  // The readings by count: Rangacharya 4, Shridhar 3, Wilhelm 3 only with a benefic navamsa lord.
  for (let deg = 0.5; deg < 360; deg += 0.5) {
    const s = shadvargaOf(vargaIndices(deg));
    assert.equal(s.readings.RANGACHARYA, s.benefic >= 4);
    assert.equal(s.readings.SHRIDHAR, s.benefic >= 3);
    assert.equal(s.readings.WILHELM, s.benefic >= 4 || (s.benefic === 3 && T.VARGA_BENEFICS.includes(s.lords.D9)));
  }
  // Shridhar's malefic decanates.
  for (const [name, list] of Object.entries(FIX.drekkana)) {
    for (const [sgn, num] of list) assert.equal(drekkanaOf(vargaIndices(sgn * 30 + (num - 1) * 10 + 5)).malefic, name, `${name} ${sgn}:${num}`);
  }
  assert.equal([...Array(36).keys()].filter((i) => drekkanaOf(vargaIndices(i * 10 + 5)).malefic).length, 5);
  assert.equal(drekkanaOf(vargaIndices(35)).nature, 'INAUSPICIOUS', 'Taurus 1st: fixed sign');
  assert.equal(drekkanaOf(vargaIndices(5)).nature, 'AUSPICIOUS', 'Aries 1st: movable sign');
  // The poison portions.
  const V = FIX.vishanadi;
  assert.deepEqual(plain(T.VISHANADI.WILHELM.groups), V.WILHELM_groups);
  const no = { first: false, middle: false, last: false };
  assert.equal(vishanadiOf(vargaIndices(1), 3, no).WILHELM, true, 'Aries 1st navamsa on Wednesday — Bhujanga');
  assert.equal(vishanadiOf(vargaIndices(1), 2, no).WILHELM, false, 'not on Tuesday');
  assert.equal(vishanadiOf(vargaIndices(60 + 14), 5, no).WILHELM, true, 'Gemini 5th navamsa on Friday — Gridhra');
  assert.equal(vishanadiOf(vargaIndices(120 - 1), 0, no).WILHELM, true, 'Cancer 9th navamsa on Sunday — Varaha');
  assert.equal(vishanadiOf(vargaIndices(60 + 1), 3, no).AGARWAL_DAYS, true, 'any sign\'s 1st navamsa on Wednesday');
  const R = V.RAMAN_degrees;
  for (let sg = 0; sg < 12; sg += 1) {
    assert.equal(vishanadiOf(vargaIndices(sg * 30 + 1), 0, no).DEGREES, R.first3.includes(sg), `first 3° of ${sg}`);
    assert.equal(vishanadiOf(vargaIndices(sg * 30 + 15), 0, no).DEGREES, R.middle.includes(sg), `middle of ${sg}`);
    assert.equal(vishanadiOf(vargaIndices(sg * 30 + 29), 0, no).DEGREES, R.last3.includes(sg), `last 3° of ${sg}`);
    assert.equal(vishanadiOf(vargaIndices(sg * 30 + 10), 0, no).DEGREES, false);
  }
  assert.equal(vishanadiOf(vargaIndices(61), 0, { first: false, middle: true, last: false }).HALF_GHATI, true, 'Gemini: the middle 12 minutes');
  assert.equal(vishanadiOf(vargaIndices(61), 0, { first: true, middle: false, last: false }).HALF_GHATI, false);
  // The verdict rule: a sign that passes everything else, then the three new checks.
  const l = { placements: { X: { pass: true } }, ashtama: { X: [] }, pdb: { present: false }, kartari: { X: false }, gandanta: { X: false } };
  const chosen = { PLACEMENTS: 'X', ASHTAMA: 'X', KARTARI: 'X', GANDANTA: 'X', SHADVARGA: 'RANGACHARYA', DREKKANA: 'MALEFIC', VISHANADI: 'WILHELM' };
  const vaOf = (lon) => ({ ...shadvargaOf(vargaIndices(lon)), drekkana: drekkanaOf(vargaIndices(lon)) });
  assert.deepEqual(lagnaVerdict(l, chosen, null, vaOf(86), vishanadiOf(vargaIndices(86), 0, no)).reasons, [], 'Gemini 26° (Rangacharya\'s example) on a Sunday');
  assert.deepEqual(lagnaVerdict(l, chosen, null, vaOf(115), null).reasons, ['SHADVARGA', 'DREKKANA'], 'Cancer 25°: the Sarpa decanate');
  assert.deepEqual(lagnaVerdict(l, chosen, null, null, vishanadiOf(vargaIndices(1), 3, no)).reasons, ['VISHANADI']);
}

// ------------------------------------------------ Shridhar §13.10, adverse combinations ---
{
  assert.equal(T.RANK.ADVERSE.words.SHRIDHAR, FIX.words.ADVERSE.SHRIDHAR);
  assert.equal(T.ADVERSE.default, FIX.defaults.ADVERSE);
  // Taurus rising, its 8th Sagittarius (lord Jupiter) empty and unaspected; nothing adverse.
  const sky = { Sun: 4, Moon: 5, Mars: 9, Mercury: 4, Jupiter: 3, Venus: 11, Saturn: 10, Rahu: 4, Ketu: 10 };
  const none = (ps) => Object.fromEntries(ps.map((p) => [p, false]));
  const adv = (o = {}) => adverseOf({
    lagna: 1, d3: 0, nav: 6, signs: { ...sky, ...o.signs }, navSigns: { ...Object.fromEntries(T.PLANETS.map((p) => [p, 0])), ...o.navSigns },
    moonN108: 45, retro: { ...none(T.MOVERS), ...o.retro }, combust: { ...none(T.SETTERS), ...o.combust },
    natalLagna: o.natalLagna ?? 4, natalMoon: o.natalMoon ?? 3, natalNav8: o.natalNav8 ?? [],
  });
  assert.deepEqual(adv(), []);
  assert.deepEqual(adv({ combust: { Venus: true } }), ['LORD_SET'], '1: the lagna lord set');
  assert.deepEqual(adv({ signs: { Venus: 6 } }), ['LORD_6_8_12'], '1: Venus in Libra, the 6th');
  assert.deepEqual(adv({ signs: { Venus: 5 } }), ['LORD_DEBIL'], '1: Venus in Virgo');
  assert.deepEqual(adv({ signs: { Venus: 4 } }), ['LORD_ENEMY'], '1: Venus in Leo, the Sun\'s');
  assert.deepEqual(adv({ retro: { Venus: true } }), ['LORD_RETRO'], '13');
  assert.deepEqual(adv({ natalNav8: [1] }), ['NAV8_LORD'], '3');
  assert.deepEqual(adv({ signs: { Jupiter: 1 }, natalLagna: 0 }), ['LORD8_IN_LAGNA', 'CHHIDRA'], '4 and 15a');
  assert.deepEqual(adv({ navSigns: { Saturn: 6 } }), ['MALEFIC_RISING'], '5: Saturn in the rising navamsa');
  assert.deepEqual(adv({ navSigns: { Mercury: 6 }, retro: { Mercury: true } }), ['RISING_RETRO_SET'], '7');
  assert.deepEqual(adv({ navSigns: { Mercury: 6 }, combust: { Mercury: true } }), [], '7: Mercury set is allowed');
  assert.deepEqual(adv({ natalMoon: 11, retro: { Jupiter: true } }), ['NATAL_LORD_RETRO'], '6: the birth Moon\'s lord retrograde');
  assert.deepEqual(adv({ natalMoon: 11, combust: { Jupiter: true } }), ['NATAL_LORD_SET'], '12');
  assert.deepEqual(adv({ signs: { Moon: 1 } }), [], '8: the Moon in Taurus rising is allowed');
  assert.deepEqual(adverseOf({ ...{ lagna: 2, d3: 0, nav: 6, moonN108: 45, retro: none(T.MOVERS), combust: none(T.SETTERS), natalLagna: 6, natalMoon: 3, natalNav8: [] }, signs: { Sun: 5, Moon: 2, Mars: 10, Mercury: 5, Jupiter: 4, Venus: 0, Saturn: 11, Rahu: 5, Ketu: 11 }, navSigns: Object.fromEntries(T.PLANETS.map((p) => [p, 0])) }).includes('MOON_IN_LAGNA'), true, '8: the Moon in Gemini rising');
  assert.deepEqual(adv({ signs: { Rahu: 0, Ketu: 6 } }), ['MALEFIC_8'], '9: Rahu 8th from the Moon');
  assert.deepEqual(adv({ signs: { Moon: 6 } }), ['MOON_6_8_12'], '10');
  assert.deepEqual(adv({ signs: { Saturn: 6 }, natalLagna: 4 }), ['NATAL_6_8_LORD'], '14: Saturn, 6th lord of a Leo birth, in the 6th');
  assert.deepEqual(adv({ signs: { Mars: 7 } }), ['CHHIDRA'], '15g: Mars, lord of the 64th navamsa from the Moon, aspects the lagna');
  // The verdict: both kinds of event; the second reading leaves out item 8.
  const l = { placements: { X: { pass: true } }, ashtama: { X: [] }, pdb: { present: false }, kartari: { X: false }, gandanta: { X: false }, common: { X: [] } };
  const chosen = { PLACEMENTS: 'X', ASHTAMA: 'X', KARTARI: 'X', GANDANTA: 'X', COMMON: 'X' };
  for (const EVENT of T.EVENTS.order) {
    assert.deepEqual(lagnaVerdict(l, { ...chosen, EVENT, ADVERSE: 'ALL' }, null, null, null, ['MOON_IN_LAGNA']).reasons, ['ADVERSE'], EVENT);
    assert.deepEqual(lagnaVerdict(l, { ...chosen, EVENT, ADVERSE: 'NO_OPINION' }, null, null, null, ['MOON_IN_LAGNA']).reasons, []);
  }
}

// ------------------------------------------------ the lagna for any auspicious act ---
{
  const C = FIX.common;
  assert.equal(T.SOURCES.COMMON.MUHURTA_CHINTAMANI.pageLocus.includes(C.MC_sloka2_44), true, 'MC sloka 2/44 transcribed');
  assert.deepEqual([...T.UPACHAYA], C.upachaya);
  assert.deepEqual([...T.BENEFIC_SIGNS], C.WILHELM_beneficSigns);
  assert.deepEqual([...Array(12).keys()].filter((s) => !T.BENEFIC_SIGNS.includes(s)), C.WILHELM_maleficSigns);
  assert.deepEqual(T.EVENTS.OTHER.checks, C.OTHER_checks);
  assert.deepEqual(T.EVENTS.MARRIAGE.checks.filter((k) => !T.EVENTS.OTHER.checks.includes(k)), C.OTHER_not);
  for (const k of T.EVENTS.OTHER.checks.filter((x) => x !== 'COMMON')) assert.ok(T.SCOPE[k]?.length, `a book states ${k} for every act`);
  for (const k of C.OTHER_not) assert.ok(T.SCOPE_OUT_TA[k], `why ${k} is left out`);

  // A moment: lagna, planets' signs, the birth lagna and Moon, the tithi.
  const at = (lagna, signs, o = {}) => commonOf({ lagna, signs, natalLagna: 11, natalMoon: 4, tithi: 10, ...o }, housesFrom(lagna, signs));
  // Taurus rising: 3rd from a Pisces birth lagna, 10th from a Leo birth Moon; Mercury in it; the Moon
  // in Cancer (3rd); nothing in Sagittarius (8th) or Aries (12th); Saturn in the 11th, Mars in the 6th.
  const mcSky = { Sun: 2, Moon: 3, Mars: 6, Mercury: 1, Jupiter: 4, Venus: 2, Saturn: 11, Rahu: 9, Ketu: 3 };
  assert.deepEqual(at(1, mcSky).MUHURTA_CHINTAMANI, [], 'MC 2/44 met');
  assert.deepEqual(at(1, mcSky).SHRIDHAR, []);
  // A birth Moon in Aries makes Taurus the 2nd: both-ways fails, either-way holds.
  assert.deepEqual(at(1, mcSky, { natalMoon: 0 }).MUHURTA_CHINTAMANI, ['NOT_UPACHAYA']);
  assert.deepEqual(at(1, mcSky, { natalMoon: 0 }).SHRIDHAR, []);
  assert.deepEqual(at(1, { ...mcSky, Saturn: 8 }).SHRIDHAR, ['OCC_8']);
  assert.deepEqual(at(1, { ...mcSky, Mercury: 2, Venus: 3 }).SHRIDHAR, ['NO_BENEFIC'], 'no benefic in the lagna or aspecting it');
  assert.deepEqual(at(1, { ...mcSky, Mercury: 2, Venus: 7 }).SHRIDHAR, [], 'Venus in Scorpio aspects Taurus');
  assert.deepEqual(at(1, { ...mcSky, Moon: 5 }).SHRIDHAR, ['MOON_NOT_UPACHAYA'], 'the Moon in Virgo, the 5th');

  // Wilhelm: Aries rising is a malefic's sign …
  const aries = { Sun: 2, Moon: 6, Mars: 2, Mercury: 2, Jupiter: 2, Venus: 2, Saturn: 2, Rahu: 2, Ketu: 8 };
  assert.deepEqual(at(0, { ...aries, Ketu: 5, Rahu: 11 }).WILHELM, ['MALEFIC_SIGN', 'OCC_12']);
  const ariesClear = { ...aries, Rahu: 5, Ketu: 11 };
  assert.deepEqual(at(0, { ...ariesClear, Ketu: 5, Rahu: 2 }).WILHELM, ['MALEFIC_SIGN']);
  // … rescued by Jupiter aspecting it from Leo (9th aspect), not from debilitation in Capricorn,
  assert.deepEqual(at(0, { ...ariesClear, Ketu: 5, Rahu: 2, Jupiter: 4 }).WILHELM, []);
  assert.deepEqual(at(0, { ...ariesClear, Ketu: 5, Rahu: 2, Jupiter: 9 }).WILHELM, ['MALEFIC_SIGN'], 'Jupiter debilitated in an angle');
  // by Jupiter exalted in an angle (Cancer, the 4th), or by the Moon in the 11th.
  assert.deepEqual(at(0, { ...ariesClear, Ketu: 5, Rahu: 2, Jupiter: 3 }).WILHELM, []);
  assert.deepEqual(at(0, { ...ariesClear, Ketu: 5, Rahu: 2, Moon: 10 }).WILHELM, []);
  // Cancer is good unless the Moon is a malefic (within 60° of the Sun: tithis 1-5, 26-30).
  const cancer = { Sun: 6, Moon: 7, Mars: 6, Mercury: 6, Jupiter: 6, Venus: 6, Saturn: 6, Rahu: 5, Ketu: 11 };
  assert.deepEqual(at(3, cancer).WILHELM, []);
  assert.deepEqual(at(3, cancer, { tithi: 3 }).WILHELM, ['CANCER_MOON']);
  assert.deepEqual(at(3, cancer, { tithi: 28 }).WILHELM, ['CANCER_MOON']);
  // No malefic in the lagna — unless Venus or the Moon is in the 10th and Jupiter in an angle.
  assert.deepEqual(at(3, { ...cancer, Saturn: 3 }).WILHELM, ['MALEFIC_IN_LAGNA']);
  assert.deepEqual(at(3, { ...cancer, Saturn: 3, Venus: 0, Jupiter: 9 }).WILHELM, []);

  // Varahamihira (B.S. 98/16): benefics in 1, 4, 7, 8, 10, 12, the Sun, Mars, Saturn in 3, 6, 11, Jupiter or Venus in an angle or trine.
  const B = C.BS_98_16;
  const bsSky = { Sun: 10, Moon: 5, Mars: 2, Mercury: 0, Jupiter: 3, Venus: 9, Saturn: 5, Rahu: 1, Ketu: 7 };
  const bsH = housesFrom(0, bsSky);
  assert.ok(T.BENEFICS.every((p) => B.benefics.includes(bsH[p])) && T.MALEFICS_SEVEN.every((p) => B.malefics.includes(bsH[p])));
  assert.deepEqual(at(0, bsSky).VARAHAMIHIRA, []);
  assert.deepEqual(at(0, { ...bsSky, Mercury: 1 }).VARAHAMIHIRA, ['BENEFIC_PLACE']);
  assert.deepEqual(at(0, { ...bsSky, Sun: 0 }).VARAHAMIHIRA, ['MALEFIC_PLACE']);
  // Rahu and Ketu are never both in 3, 6, 11 — hence the seven-planet malefics.
  for (let r = 0; r < 12; r += 1) assert.ok(!(B.malefics.includes(r + 1) && B.malefics.includes(((r + 6) % 12) + 1)));

  // Agarwal: failing the lagna, the transiting Moon in an upachaya from the birth lagna or Moon suffices.
  const agSky = { Sun: 2, Moon: 5, Mars: 9, Mercury: 3, Jupiter: 4, Venus: 3, Saturn: 10, Rahu: 6, Ketu: 0 };
  assert.ok(!at(0, agSky, { natalLagna: 0, natalMoon: 0 }).AGARWAL.includes('NOT_UPACHAYA'), 'the Moon in Virgo, 6th from Aries');
  assert.ok(at(0, { ...agSky, Moon: 4 }, { natalLagna: 0, natalMoon: 0 }).AGARWAL.includes('NOT_UPACHAYA'));

  // Raman's four placements.
  assert.deepEqual(at(0, { ...bsSky, Moon: 7 }).RAMAN.includes('MOON_6_8_12'), true);
  assert.deepEqual(at(0, { ...bsSky, Moon: 10 }).RAMAN, ['MOON_WITH'], 'the Moon with the Sun');
  assert.deepEqual(at(0, { ...bsSky, Moon: 4, Venus: 5 }).RAMAN, ['VENUS_6']);
  assert.deepEqual(at(0, { ...bsSky, Moon: 4, Mars: 7 }).RAMAN, ['MARS_8']);

  // The verdict for another act: the marriage tables give way to COMMON; Narada's navamsas to a benefic's.
  const l = lagnaShuddhiOf({ lagna: 1, signs: mcSky, retro: {}, night: false, gandanta: { MINUTES_12: false, DEGREES_3: false }, natalLagna: 11, natalMoon: 4, tithi: 10 });
  const nv = navamsaOf({ n108: 9 * 1 + 2, half: 0, signs: mcSky, natalLagnaLongitude: 335, natalLagna: 11, natalMoon: 4 });
  const base = { ...FIX.defaults, PLACEMENTS: 'WILHELM', COMMON: 'MUHURTA_CHINTAMANI' };
  const other = lagnaVerdict(l, { ...base, EVENT: 'OTHER' }, nv).reasons;
  const marriage = lagnaVerdict(l, { ...base, EVENT: 'MARRIAGE' }, nv).reasons;
  for (const k of C.OTHER_not) assert.ok(!other.includes(k), `${k} not for other acts`);
  assert.ok(!other.includes('COMMON') && !marriage.includes('COMMON'));
  assert.equal(nv.which.NARADA, false, 'Cancer navamsa: not Narada\'s');
  assert.ok(marriage.includes('NAV_WHICH') && !other.includes('NAV_WHICH'), 'Cancer navamsa is a benefic\'s');
  assert.ok(lagnaVerdict(lagnaShuddhiOf({ lagna: 1, signs: { ...mcSky, Saturn: 8 }, retro: {}, night: false, gandanta: { MINUTES_12: false, DEGREES_3: false }, natalLagna: 11, natalMoon: 4, tithi: 10 }), { ...base, EVENT: 'OTHER' }).reasons.includes('COMMON'));
}

// ------------------------------------------------ the stretches, against the sky ---
{
  const DAY = 86400000;
  const fromMs = Date.parse('2026-10-10T18:30:00Z');
  const toMs = fromMs + 6 * DAY;
  const lat = 13.08; const lon = 80.27; // the event in Chennai
  const natalLagna = 200; const natalMoon = 45.5;
  // Birth positions for §13.10.3: the 8th lords from Libra rising and a Taurus Moon are Venus and Jupiter.
  const natalLongitudes = { Sun: 30.5, Moon: natalMoon, Mars: 100, Mercury: 20, Jupiter: 250, Venus: 60, Saturn: 300, Rahu: 120, Ketu: 300 };
  const r = muhurtaStarChecks({ natalMoonLongitude: natalMoon, natalLagnaLongitude: natalLagna, fromMs, toMs, latitude: lat, longitude: lon, natalLongitudes });
  const natalNav8 = [...new Set(['Venus', 'Jupiter'].map((p) => Math.floor(natalLongitudes[p] / (10 / 3)) % 12))];
  assert.deepEqual(natalNav8, [6, 3]);
  const jd = (ms) => ms / DAY + 2440587.5;
  const L360 = (x) => ((x % 360) + 360) % 360;
  const pl = (p, ms) => L360(p === 'Rahu' ? nodeLongitude(jd(ms), 'Lahiri', 'mean') : p === 'Ketu' ? nodeLongitude(jd(ms), 'Lahiri', 'mean') + 180 : planetLongitude(jd(ms), p, 'Lahiri'));
  const asc = (ms) => siderealAscendant(jd(ms), lat, lon, 'Lahiri');
  const sign = (x) => Math.floor(L360(x) / 30) % 12;
  // Day or night: the last sunrise and sunset before the moment, found from the day before.
  const nightAt = (ms) => {
    const rise = (sunriseJulianDay(Math.floor(jd(ms) - 0.5) - 0.5, lat, lon) - 2440587.5) * DAY;
    let lastRise = rise;
    for (let k = 0; k < 3; k += 1) { const next = (sunriseJulianDay(jd(lastRise) + 0.01, lat, lon) - 2440587.5) * DAY; if (next <= ms) lastRise = next; }
    const set = (sunsetJulianDay(jd(lastRise), lat, lon) - 2440587.5) * DAY;
    return ms >= set;
  };
  const retro = (p, ms) => ((pl(p, ms + DAY / 2) - pl(p, ms - DAY / 2) + 540) % 360) - 180 < 0;
  let n = 0;
  const sec = (ms) => Math.round((ms - fromMs) / 1000);
  for (const s of r.segments) {
    assert.equal(s.lagnas[0][0], sec(Date.parse(s.fromUtc)));
    assert.equal(s.lagnas[s.lagnas.length - 1][1], sec(Date.parse(s.toUtc)));
    for (let i = 1; i < s.lagnas.length; i += 1) assert.equal(s.lagnas[i][0], s.lagnas[i - 1][1]);
    for (const arr of s.lagnas) {
      const [f, t, rRef, nRef, vRef, g, bana, w, d] = arr;
      const x = { f, t, r: rRef, n: nRef, v: vRef, g, b: bana, w, d };
      const a = fromMs + x.f * 1000; const b = fromMs + x.t * 1000;
      if (b - a < 2 * 60000) continue;
      const mid = (a + b) / 2;
      x.fromUtc = new Date(a).toISOString();
      const signs = Object.fromEntries(T.PLANETS.map((p) => [p, sign(pl(p, mid))]));
      const ascMid = asc(mid);
      const lg = sign(ascMid);
      const deg = L360(ascMid) - lg * 30;
      const want = lagnaShuddhiOf({
        lagna: lg, signs, retro: { Mars: retro('Mars', mid), Saturn: retro('Saturn', mid) }, night: nightAt(mid),
        gandanta: {
          MINUTES_12: (T.GANDANTA_START.includes(lg) && sign(asc(mid - 12 * 60000)) !== lg) || (T.GANDANTA_END.includes(lg) && sign(asc(mid + 12 * 60000)) !== lg),
          DEGREES_3: (T.GANDANTA_START.includes(lg) && deg < 3) || (T.GANDANTA_END.includes(lg) && deg >= 27),
        },
        natalLagna: sign(natalLagna), natalMoon: sign(natalMoon), tithi: s.tithi,
      });
      const got = r.lagnaTable[x.r];
      assert.equal(got.lagna, want.lagna, `lagna ${x.fromUtc}`);
      assert.equal(got.night, nightAt(mid), `night ${x.fromUtc}`);
      assert.deepEqual(plain(got.placements), plain(want.placements), `placements ${x.fromUtc}`);
      assert.deepEqual(plain(got.ashtama), plain({ EIGHTH: want.ashtama.EIGHTH, FOUR_EIGHT_TWELVE: want.ashtama.FOUR_EIGHT_TWELVE }));
      assert.deepEqual(plain(got.pdb), plain(want.pdb), `pdb ${x.fromUtc}`);
      assert.deepEqual(plain(got.kartari), plain(want.kartari), `kartari ${x.fromUtc}`);
      assert.deepEqual(plain(got.common), plain(want.common), `common ${x.fromUtc}`);
      assert.deepEqual({ MINUTES_12: Boolean(x.g & 1), DEGREES_3: Boolean(x.g & 2) }, plain(want.gandanta), `gandanta ${x.fromUtc}`);
      assert.equal(Boolean(x.b), want.banaMrityu);
      // The navamsa: recomputed from the ascendant at the middle.
      const n108 = Math.floor(L360(ascMid) / (10 / 3)) % 108;
      const half = n108 % 12 === 8 && L360(ascMid) - n108 * (10 / 3) >= 5 / 3 ? 1 : 0;
      const nvWant = navamsaOf({ n108, half, signs, natalLagnaLongitude: natalLagna, natalLagna: sign(natalLagna), natalMoon: sign(natalMoon) });
      assert.deepEqual(plain(r.navamsaTable[x.n]), plain(nvWant), `navamsa ${x.fromUtc}`);
      // Shadvarga and decanate from the ascendant; the weekday from the last sunrise (local mean date).
      const vi = vargaIndices(ascMid);
      assert.deepEqual(plain(r.vargaTable[x.v]), plain({ ...shadvargaOf(vi), drekkana: drekkanaOf(vi) }), `vargas ${x.fromUtc}`);
      let lastRise = (sunriseJulianDay(Math.floor(jd(mid) - 0.5) - 1.5, lat, lon) - 2440587.5) * DAY;
      for (let k = 0; k < 4; k += 1) { const next = (sunriseJulianDay(jd(lastRise) + 0.01, lat, lon) - 2440587.5) * DAY; if (next <= mid) lastRise = next; }
      const vara = new Date(lastRise + (lon / 15) * 3600000).getUTCDay();
      assert.equal(x.d, vara, `weekday ${x.fromUtc}`);
      const ghati = { first: sign(asc(mid - 12 * 60000)) !== lg, last: sign(asc(mid + 12 * 60000)) !== lg, middle: false };
      const vs = vishanadiOf(vi, vara, ghati);
      assert.equal(Boolean(x.w & 1), vs.WILHELM, `Wilhelm's vishanadi ${x.fromUtc}`);
      assert.equal(Boolean(x.w & 2), vs.DEGREES);
      assert.equal(Boolean(x.w & 4), vs.AGARWAL_DAYS);
      if (![2, 4, 6, 10].includes(lg)) assert.equal(Boolean(x.w & 8), vs.HALF_GHATI, `half ghati ${x.fromUtc}`);
      // Shridhar §13.10 from the planets at the middle: their navamsas, motion and combustion.
      const lonAt = Object.fromEntries(T.PLANETS.map((p) => [p, pl(p, mid)]));
      const retroAt = Object.fromEntries(T.MOVERS.map((p) => [p, retro(p, mid)]));
      const combustAt = Object.fromEntries(T.SETTERS.map((p) => [p, Math.abs(((lonAt[p] - lonAt.Sun + 540) % 360) - 180) < combustionOrb(p, retroAt[p])]));
      const advWant = adverseOf({
        lagna: lg, d3: vi.d3, nav: n108 % 12, signs, navSigns: Object.fromEntries(T.PLANETS.map((p) => [p, Math.floor(lonAt[p] / (10 / 3)) % 12])),
        moonN108: Math.floor(lonAt.Moon / (10 / 3)) % 108, retro: retroAt, combust: combustAt,
        natalLagna: sign(natalLagna), natalMoon: sign(natalMoon), natalNav8,
      });
      assert.deepEqual(plain(r.adverseTable[arr[9]]), advWant, `§13.10 ${x.fromUtc}`);
      n += 1;
    }
  }
  assert.ok(n > 300, `checked ${n}`);
  assert.equal(r.books.lagna.natalLagna, sign(natalLagna));
  // About two hours a sign: some 70-85 lagna changes in six days; nine navamsas to each.
  const all = r.segments.flatMap((s) => s.lagnas).map(([, , rr, nn]) => ({ r: rr, n: nn }));
  const changes = all.filter((x, i) => i > 0 && r.lagnaTable[x.r].lagna !== r.lagnaTable[all[i - 1].r].lagna).length;
  assert.ok(changes > 65 && changes < 80, `lagna changes ${changes}`);
  const navChanges = all.filter((x, i) => i > 0 && r.navamsaTable[x.n].n108 !== r.navamsaTable[all[i - 1].n].n108).length;
  assert.ok(navChanges > changes * 8 && navChanges < changes * 10, `navamsa changes ${navChanges}`);
  // Without a place there are no lagnas.
  assert.equal(muhurtaStarChecks({ natalMoonLongitude: natalMoon, fromMs, toMs: fromMs + DAY }).segments[0].lagnas, null);
}

console.log('test-lagna-shuddhi: all checks passed');
