const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const E = require('./src/report/eventMuhurtaTables');
const { panchangaCodes, varaCodes, lagnaCodes, doorCodes, withDoorStars, kumbhaCount, rejects } = require('./src/report/eventMuhurta');
const { muhurtaStarChecks } = require('./src/report/muhurtaStars');
const { planetLongitude } = require('./src/ephemeris/siderealPositions');
const { resolveByTitle } = require('./src/sources/registry');

const FIX = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/event-muhurta/books.json'), 'utf8'));
const G = E.EVENTS.GRIHA_PRAVESHA;
const sorted = (a) => [...a].sort((x, y) => x - y);

// ------------------------------------------------ the tables against the books ---
{
  assert.deepEqual({ ...E.RANK.GRIHA_PRAVESHA.words }, FIX.words);
  assert.deepEqual([...G.order], Object.keys(FIX.words).sort((a, b) => FIX.words[b] - FIX.words[a]));
  assert.equal(G.default, FIX.default);
  assert.ok(E.SOURCES.GRIHA_PRAVESHA.MUHURTA_CHINTAMANI.pageLocus.includes(FIX.mcSloka13_1));
  for (const b of G.order) {
    assert.ok(resolveByTitle(E.SOURCES.GRIHA_PRAVESHA[b].title), `registered: ${b}`);
    if (G[b].masa) for (const m of FIX.months_best_all) assert.ok(G[b].masa.good.includes(m), `${b} month ${m}`);
  }
  const S = FIX.stars;
  assert.deepEqual(sorted(G.SHRIDHAR.nak.good), sorted(S.SHRIDHAR));
  assert.deepEqual(sorted(G.MUHURTA_CHINTAMANI.nak.good), sorted(S.MUHURTA_CHINTAMANI));
  assert.deepEqual(sorted(G.WILHELM.nak.good), sorted(S.WILHELM_best));
  assert.deepEqual(sorted(G.WILHELM.nak.mid), sorted(S.WILHELM_middling));
  assert.deepEqual(sorted(G.RAMAN.nak.good), sorted(S.RAMAN_best));
  assert.deepEqual(sorted(G.RAMAN.nak.mid), sorted(S.RAMAN_permissible));
  assert.deepEqual(sorted(G.KALYANRAMAN.nak.good), sorted(S.KALYANRAMAN_counted));
  assert.deepEqual(sorted(G.RANGACHARYA.nak.good), sorted(S.RANGACHARYA));
  assert.deepEqual(sorted(G.VASHISTHA.nak.good), sorted(S.VASHISTHA_as_printed));
  assert.deepEqual(sorted(G.AGARWAL.nak.good), sorted(S.AGARWAL));
  const T = FIX.tithis;
  for (const b of ['SHRIDHAR', 'WILHELM', 'RAMAN', 'VASHISTHA']) assert.deepEqual(sorted(G[b].tithi), sorted(T[b]), `${b} tithis`);
  assert.deepEqual([...G.JOSHI.tithi], E.bothPakshas(T.JOSHI_paksha));
  assert.deepEqual([...G.AGARWAL.tithi], E.bothPakshas(T.AGARWAL_paksha));
  assert.ok(!G.JOSHI.tithi.includes(30) && G.JOSHI.tithi.includes(15), 'the 15th is the full Moon only');
  for (const t of T.MC_avoid) assert.ok(!G.MUHURTA_CHINTAMANI.tithi.includes(t));
  assert.equal(G.MUHURTA_CHINTAMANI.tithi.length, 30 - T.MC_avoid.length);
  assert.deepEqual(sorted(G.SHRIDHAR.vara.good), sorted(FIX.weekdays.SHRIDHAR_good));
  assert.deepEqual(sorted(G.SHRIDHAR.vara.mid), sorted(FIX.weekdays.SHRIDHAR_middling));
  for (const v of FIX.weekdays.MC_avoid) assert.ok(!G.MUHURTA_CHINTAMANI.vara.good.includes(v));
  assert.deepEqual([...G.MUHURTA_CHINTAMANI.kumbha], FIX.kumbhaGood_MC);
  for (const d of E.DOORS.order) {
    assert.deepEqual([...E.DOORS.tithi[d]], FIX.doors[d].tithi);
    assert.deepEqual([...E.DOORS.sun[d]], FIX.doors[d].sun);
  }
  // The four door directions share the 27 stars out (Krittika-Ashlesha east, Magha-Vishakha south, Anuradha-Shravana west, Dhanishta-Bharani north).
  assert.deepEqual(sorted(E.DOORS.order.flatMap((d) => E.DOORS.stars[d])), [...Array(27).keys()]);
}

// ------------------------------------------------ the codes ---
{
  // Rohini, Shukla 2nd, Vaishakha, the Sun in Aries in Revati (Rohini the 4th from it — the pitcher's east: bad).
  const x = { star: 3, tithi: 2, month: 1, sunSign: 0, sunStar: 26 };
  assert.equal(kumbhaCount(26, 3), 5);
  assert.deepEqual(panchangaCodes(G.SHRIDHAR, x), ['KUMBHA']);
  assert.deepEqual(panchangaCodes(G.SHRIDHAR, { ...x, sunStar: 24 }), [], 'Rohini the 7th from Purva Bhadrapada: the south');
  assert.deepEqual(panchangaCodes(G.RANGACHARYA, { ...x, sunStar: 24 }), [], 'his count: the 7th is good too');
  assert.deepEqual(panchangaCodes(G.MUHURTA_CHINTAMANI, { ...x, sunStar: 24, month: 0, sunSign: 11 }), ['MASA'], 'Chaitra');
  assert.deepEqual(panchangaCodes(G.MUHURTA_CHINTAMANI, { ...x, sunStar: 24, month: 7, sunSign: 6 }), ['MASA', 'UTTARAYANA'], 'Kartika, the Sun in Libra');
  assert.deepEqual(panchangaCodes(G.SHRIDHAR, { ...x, sunStar: 24, month: 7, sunSign: 6 }), ['MASA_MID', 'UTTARAYANA_MID']);
  assert.deepEqual(panchangaCodes(G.WILHELM, { ...x, sunStar: 24, star: 7 }), ['NAK_MID'], 'Pushya middling; the 12th from Purva Bhadrapada, the west: good');
  assert.deepEqual(panchangaCodes(G.WILHELM, { ...x, sunStar: 24, star: 9 }), ['NAK'], 'Magha: not listed (the 13th, the west)');
  assert.deepEqual(rejects(['NAK_MID', 'VARA_MID']), []);
  assert.deepEqual(varaCodes(G.SHRIDHAR, 6), ['VARA_MID']);
  assert.deepEqual(varaCodes(G.SHRIDHAR, 2), ['VARA']);
  assert.deepEqual(varaCodes(G.RANGACHARYA, 2), [], 'he gives no weekdays');

  // A Taurus lagna with the 4th and 8th empty, benefics in 1/2/5, malefics in 3/6/11.
  const signs = { Sun: 3, Moon: 2, Mars: 6, Mercury: 1, Jupiter: 2, Venus: 5, Saturn: 11, Rahu: 9, Ketu: 3 };
  const m = { lagna: 1, nav: 2, signs, natalLagna: 6, natalMoon: 10, combust: { Jupiter: false, Venus: false } };
  assert.deepEqual(lagnaCodes(G.SHRIDHAR, m), []);
  assert.deepEqual(lagnaCodes(G.SHRIDHAR, { ...m, combust: { Jupiter: true } }), ['JUP_VEN_SET']);
  assert.deepEqual(lagnaCodes(G.SHRIDHAR, { ...m, signs: { ...signs, Rahu: 4, Ketu: 10 } }), ['EMPTY_4']);
  assert.deepEqual(lagnaCodes(G.WILHELM, { ...m, signs: { ...signs, Rahu: 4, Ketu: 10 } }), ['EMPTY_4_MID'], 'Wilhelm: the 4th "a good principle"');
  assert.deepEqual(lagnaCodes(G.WILHELM, { ...m, nav: 0 }), ['NAV'], 'an Aries navamsa: a malefic\'s');
  // A movable lagna: only with a Taurus navamsa (Shridhar/K.P., Wilhelm, Raman); never for MC; Joshi by the birth upachaya.
  const aries = { ...m, lagna: 0, signs: { ...signs }, natalLagna: 9, natalMoon: 7 };
  assert.ok(lagnaCodes(G.SHRIDHAR, { ...aries, nav: 1 }).every((c) => c !== 'LAGNA'));
  assert.ok(lagnaCodes(G.SHRIDHAR, { ...aries, nav: 2 }).includes('LAGNA'));
  assert.ok(lagnaCodes(G.MUHURTA_CHINTAMANI, { ...aries, nav: 1 }).includes('LAGNA'), 'Aries is the 4th from Capricorn — and movable');
  assert.ok(!lagnaCodes(G.JOSHI, { ...aries, natalLagna: 10 }).includes('LAGNA'), 'Aries the 3rd from Aquarius');
  assert.ok(lagnaCodes(G.KALYANRAMAN, { ...aries, natalLagna: 10, natalMoon: 0 }).includes('LAGNA'), 'Kalyanraman counts from the Moon only');
  assert.ok(!lagnaCodes(G.RANGACHARYA, { ...aries, nav: 2, natalLagna: 10 }).includes('LAGNA'), 'a cardinal lagna with a benefic navamsa, 3rd from birth');
  assert.ok(lagnaCodes(G.RANGACHARYA, { ...aries, nav: 0, natalLagna: 10 }).includes('LAGNA'));
  assert.ok(lagnaCodes(G.SHRIDHAR, { ...m, lagna: 2 }).includes('LAGNA_MID'), 'a dual lagna: middling');

  // The door: tithi class, the Sun on the left, the door's stars.
  assert.deepEqual(doorCodes(G.SHRIDHAR, 'E', { tithi: 20, sunHouse: 9 }), [], 'Krishna 5th is a Poorna tithi');
  assert.deepEqual(doorCodes(G.SHRIDHAR, 'E', { tithi: 2, sunHouse: 3 }), ['TITHI_DOOR', 'SUN_LEFT']);
  assert.deepEqual(doorCodes(G.RAMAN, 'E', { tithi: 2, sunHouse: 3 }), [], 'Raman gives no door rules');
  assert.deepEqual(doorCodes(G.SHRIDHAR, null, { tithi: 2, sunHouse: 3 }), []);
  assert.deepEqual(withDoorStars(G.MUHURTA_CHINTAMANI, 'E', ['NAK', 'TITHI'], 2), ['TITHI'], 'Krittika faces an eastern door');
  assert.deepEqual(withDoorStars(G.MUHURTA_CHINTAMANI, 'W', ['NAK'], 2), ['NAK']);
  assert.deepEqual(withDoorStars(G.WILHELM, 'E', ['NAK'], 2), ['NAK'], 'Wilhelm: facing the door is only "more favorable"');
}

// ------------------------------------------------ the engine ---
{
  const DAY = 86400000;
  const fromMs = Date.parse('2026-10-10T18:30:00Z');
  const r = muhurtaStarChecks({ natalMoonLongitude: 45.5, natalLagnaLongitude: 200, fromMs, toMs: fromMs + 40 * DAY, latitude: 13.08, longitude: 80.27 });
  const jd = (ms) => ms / DAY + 2440587.5;
  const sunSign = (ms) => Math.floor(planetLongitude(jd(ms), 'Sun', 'Lahiri') / 30);
  const elong = (ms) => ((planetLongitude(jd(ms), 'Moon', 'Lahiri') - planetLongitude(jd(ms), 'Sun', 'Lahiri')) % 360 + 360) % 360;
  for (const s of r.segments) {
    const mid = (Date.parse(s.fromUtc) + Date.parse(s.toUtc)) / 2;
    // The month: back to the last new moon (elongation through 0), the Sun's sign there, plus one.
    let t = mid;
    while (elong(t) > 1) t -= Math.min(elong(t), 30) / 13 * DAY * 0.9;
    let lo = t - DAY; let hi = t;
    while (elong(lo) < 180) lo -= DAY;
    for (let k = 0; k < 40; k += 1) { const c = (lo + hi) / 2; if (elong(c) > 180) lo = c; else hi = c; }
    assert.equal(s.month, (sunSign(hi) + 1) % 12, `month at ${s.fromUtc}`);
    assert.equal(s.sunSign, sunSign(mid));
    for (const b of G.order) assert.deepEqual(s.ev.GRIHA_PRAVESHA[b], panchangaCodes(G[b], { star: s.star, tithi: s.tithi, month: s.month, sunSign: s.sunSign, sunStar: s.sunStar }), `${b} ${s.fromUtc}`);
  }
  // Mid-October 2026 is Ashvin (the new moon of 10 October with the Sun in Virgo), then Kartika.
  assert.equal(r.segments.find((s) => s.fromUtc.startsWith('2026-10-15')).month, 6);
  assert.equal(r.segments.find((s) => s.fromUtc.startsWith('2026-11-15')).month, 7);
  assert.ok(r.eventTable.length > 0 && r.segments.every((s) => s.lagnas.every((x) => Number.isInteger(x[10]))));
}

console.log('test-event-muhurta: all checks passed');
