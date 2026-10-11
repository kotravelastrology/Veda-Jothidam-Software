const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const T = require('./src/report/lagnaShuddhiTables');
const { lagnaShuddhiOf, lagnaVerdict, pointsOf, placementsOf, ashtamaOf, pdbOf, kartariOf, houseOf } = require('./src/report/lagnaShuddhi');
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

// ------------------------------------------------ the stretches, against the sky ---
{
  const DAY = 86400000;
  const fromMs = Date.parse('2026-10-10T18:30:00Z');
  const toMs = fromMs + 6 * DAY;
  const lat = 13.08; const lon = 80.27; // the event in Chennai
  const natalLagna = 200; const natalMoon = 45.5;
  const r = muhurtaStarChecks({ natalMoonLongitude: natalMoon, natalLagnaLongitude: natalLagna, fromMs, toMs, latitude: lat, longitude: lon });
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
  for (const s of r.segments) {
    assert.equal(s.lagnas[0].fromUtc, s.fromUtc);
    assert.equal(s.lagnas[s.lagnas.length - 1].toUtc, s.toUtc);
    for (let i = 1; i < s.lagnas.length; i += 1) assert.equal(s.lagnas[i].fromUtc, s.lagnas[i - 1].toUtc);
    for (const x of s.lagnas) {
      const a = Date.parse(x.fromUtc); const b = Date.parse(x.toUtc);
      if (b - a < 4 * 60000) continue;
      const mid = (a + b) / 2;
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
      const got = r.lagnaTable[x.ref];
      assert.equal(got.lagna, want.lagna, `lagna ${x.fromUtc}`);
      assert.equal(got.night, nightAt(mid), `night ${x.fromUtc}`);
      assert.deepEqual(plain(got.placements), plain(want.placements), `placements ${x.fromUtc}`);
      assert.deepEqual(plain(got.ashtama), plain({ EIGHTH: want.ashtama.EIGHTH, FOUR_EIGHT_TWELVE: want.ashtama.FOUR_EIGHT_TWELVE }));
      assert.deepEqual(plain(got.pdb), plain(want.pdb), `pdb ${x.fromUtc}`);
      assert.deepEqual(plain(got.kartari), plain(want.kartari), `kartari ${x.fromUtc}`);
      assert.deepEqual(plain(x.gandanta), plain(want.gandanta), `gandanta ${x.fromUtc}`);
      assert.equal(x.banaMrityu, want.banaMrityu);
      n += 1;
    }
  }
  assert.ok(n > 60, `checked ${n}`);
  assert.equal(r.books.lagna.natalLagna, sign(natalLagna));
  // About two hours a sign: some 70-85 lagna changes in six days.
  const changes = r.segments.flatMap((s) => s.lagnas).filter((x, i, all) => i > 0 && r.lagnaTable[x.ref].lagna !== r.lagnaTable[all[i - 1].ref].lagna).length;
  assert.ok(changes > 65 && changes < 80, `lagna changes ${changes}`);
  // Without a place there are no lagnas.
  assert.equal(muhurtaStarChecks({ natalMoonLongitude: natalMoon, fromMs, toMs: fromMs + DAY }).segments[0].lagnas, null);
}

console.log('test-lagna-shuddhi: all checks passed');
