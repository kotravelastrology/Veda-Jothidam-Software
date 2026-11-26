/**
 * Lost horoscopy of BPHS ch.78 (src/report/nashtaJataka.js, fixture bphs-78.json): the fixture's shape, the book's own worked example read step by step, the ritu rules
 * and the exchange of v.7, and the birth moment found from the ephemeris.
 */
const assert = require('node:assert/strict');
const N = require('./src/report/nashtaJataka');

assert.ok(N.DATA.source.title && N.DATA.source.pageLocus && N.DATA.scope.length > 200 && N.DATA.scopeTa.length > 200 && N.DATA.example.note);
for (const k of ['samvatsara', 'ayana', 'ritu', 'ayanaRitu', 'contradiction', 'month', 'sun', 'istakala']) assert.ok(N.DATA.steps[k].ta.length > 40 && N.DATA.steps[k].verses && N.DATA.steps[k].page, k);
assert.deepEqual(Object.keys(N.DATA.ritus), ['Vasanta', 'Grishma', 'Varsha', 'Sharad', 'Hemanta', 'Shishira']);
// two consecutive solar months for each ritu, the six following in order, Varsha being Cancer and Leo (p.941)
assert.deepEqual(Object.values(N.DATA.ritus).flatMap((r) => r.signs), [11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
assert.deepEqual(N.DATA.ritus.Varsha.signs, [3, 4]);
assert.deepEqual(Object.keys(N.DATA.ritus).map((r) => N.DATA.ritus[r].ayana), ['uttara', 'uttara', 'dakshina', 'dakshina', 'dakshina', 'uttara'], 'Varsha, Sharad, Hemanta are Yamyayana (p.941)');
// the ritu lords of v.5-6 agree with the lords of chapter 3 v.45-46 in the fixture
for (const [r, d] of Object.entries(N.DATA.ritus)) assert.equal(N.RITU_OF_LORD[d.lord], r, r);
assert.equal(N.DATA.lagnaNotes.signs.length, 12);
assert.ok(N.DATA.lagnaNotes.signs.every((s) => s.ta.length > 80 && /^9(4[2-7])/.test(s.page.split('-')[0])));

// the Dwadasamsa: 2.5-degree parts from the sign itself
assert.equal(N.dwadasamsaSign(0), 0);
assert.equal(N.dwadasamsaSign(2.5), 1);
assert.equal(N.dwadasamsaSign(29.9), 11);
assert.equal(N.dwadasamsaSign(346.2858333), 5, 'Pisces 16 deg 17 min is the 7th Dwadasamsa of Pisces, Virgo');
assert.equal(N.dwadasamsaSign(60 + 4.9), 3, 'the 2nd part of Gemini (2.5 to 5 deg) is Cancer');
assert.equal(N.dwadasamsaSign(60 + 5), 4, 'the 3rd part of Gemini (from 5 deg) is Leo');

// the book's example (p.940-942): Lagna 11 signs 16 deg 17 min 9 sec, found step by step
const ex = N.DATA.example;
const p = N.readPrasna(ex.lagnaLongitude);
assert.equal(p.samvatsaraSign, ex.samvatsaraSign, 'Jupiter in Virgo at birth');
assert.equal(p.ayana, 'dakshina', 'past 15 degrees');
assert.equal(p.drekkanaLord, 'Moon');
assert.equal(p.ritu, ex.ritu);
assert.ok(!p.exchanged && !p.contradiction);
assert.equal(p.half, 1, 'the latter part of the Drekkana');
assert.equal(p.monthSign, ex.monthSign, 'the 2nd month of Varsha, the Sun in Leo');
assert.ok(Math.abs(p.expiredDegrees - (1 + 17 / 60 + 9 / 3600)) < 1e-9, '1 deg 17 min 9 sec expired');
assert.ok(Math.abs(p.sunDegrees - (7 + 42 / 60 + 54 / 3600)) < 1e-9, 'the Sun at 7 deg 42 min 54 sec');
assert.ok(Math.abs(p.sunLongitude - ex.sunLongitude) < 1e-6);
// the years back (v.11-12): Jupiter in Capricorn (sign 9) at the query and Virgo (5) at birth is 4 years earlier, then 16, 28
assert.equal(((ex.jupiterSignAtQuery - p.samvatsaraSign) % 12 + 12) % 12, 4);
assert.equal(4 + 12 + 12, ex.yearsBack);
// the Istakala arithmetic of the example: 0 deg 20 min 40 sec = 1240 sec, times 60, over the Sun's motion 58 min 2 sec = 3482 sec: 21.37 ghatikas
assert.ok(Math.abs((1240 * 60) / 3482 - 21.3670) < 1e-3);

// the ritu rules of v.5-6: Aries 3 deg: first half so Uttarayana; the 1st Drekkana is Aries's own, Mars, so Grishma; first half so its first month (Taurus); 3 deg x 6 = 18 deg
let r = N.readPrasna(3);
assert.deepEqual([r.ayana, r.drekkanaLord, r.ritu, r.half, r.monthSign, r.sunDegrees, r.sunLongitude], ['uttara', 'Mars', 'Grishma', 0, 1, 18, 48]);
// the 2nd Drekkana of Pisces is Cancer's, the Moon's: Varsha, as in the example
assert.equal(N.readPrasna(330 + 16).ritu, 'Varsha');
// ... but at 12 degrees the first half is Uttarayana, the Moon's Varsha contradicts it and the Moon and Venus exchange: Vasanta
r = N.readPrasna(330 + 12);
assert.deepEqual([r.ayana, r.rituByLord, r.exchanged, r.usedLord, r.ritu, r.contradiction], ['uttara', 'Varsha', true, 'Venus', 'Vasanta', false]);
// v.7: Scorpio 12 deg is in Pisces's Drekkana, Jupiter's, Hemanta (Yamyayana), but the first half is Uttarayana: Jupiter and Saturn exchange, Shishira
r = N.readPrasna(210 + 12);
assert.deepEqual([r.ayana, r.rituByLord, r.exchanged, r.usedLord, r.ritu, r.contradiction], ['uttara', 'Hemanta', true, 'Saturn', 'Shishira', false]);
assert.equal(r.monthSign, 9, 'Capricorn: the first of Shishira, the first half of that Drekkana (2 deg into it)');
// Pisces 25 deg: second half so Yamyayana; its 3rd Drekkana is Scorpio's, Mars: Grishma, Uttarayana, so Mars and Mercury exchange, Sharad
r = N.readPrasna(330 + 25);
assert.deepEqual([r.ayana, r.rituByLord, r.exchanged, r.usedLord, r.ritu, r.contradiction, r.monthSign, r.sunDegrees], ['dakshina', 'Grishma', true, 'Mercury', 'Sharad', false, 6, 0]);
// the Sun has no partner (v.7): Aries 18 deg is Yamyayana, its 2nd Drekkana Leo's, the Sun's, Grishma (Uttarayana): the contradiction stays
r = N.readPrasna(18);
assert.deepEqual([r.ayana, r.drekkanaLord, r.ritu, r.exchanged, r.contradiction], ['dakshina', 'Sun', 'Grishma', false, true]);

// the birth moment from the ephemeris, for the book's query (Wednesday 23 February 1949, about 8:40, Delhi; the book names no place)
const place = { offsetMinutes: 330, latitude: 28.6, longitude: 77.2 };
const queryMs = Date.UTC(1949, 1, 23, 8, 40) - 330 * 60000;
const by = N.birthYears({ prasna: p, lagnaSign: 11, queryMs, ageMin: 25, ageMax: 30, ...place });
assert.ok(by.years.length >= 5 && by.years.every((y) => y.age >= 25 && y.age <= 30 && y.year >= 1919 && y.year <= 1923));
assert.ok(by.candidates.length >= 1 && !by.viaTrikona);
assert.ok(by.years.filter((y) => y.matches).every((y) => y.jupiterSign === 5), 'Jupiter in Virgo when the Sun was at Leo 7.7 deg');
assert.ok(by.years.some((y) => y.year === 1921 && y.matches), 'Samvat 1977 (1920-21), 28 years before the query, is among them');
for (const c of by.candidates) {
  const t = N.istakala({ sunLongitude: p.sunLongitude, year: c.year, ...place });
  assert.ok(t.ghatikas >= 0 && t.ghatikas < 60, `${c.year}: ${t.ghatikas}`);
  assert.equal(t.date.m, 8, 'the Sun is in Leo 7.7 deg in late August');
  assert.ok(Math.abs(t.differenceMinutes) < 5, `the book's proportion reaches the Sun's exact moment within 5 minutes (${t.differenceMinutes})`);
  assert.ok(Math.abs((((N.sunReaches(p.sunLongitude, t.exactJd) - t.exactJd) * 1) )) < 1e-6);
  const sunNow = require('./src/ephemeris/siderealPositions').planetLongitude(t.exactJd, 'Sun');
  assert.ok(Math.abs(sunNow - p.sunLongitude) < 1e-5);
  assert.ok(t.sunriseJd < t.birthJd + 1e-9 && t.birthJd - t.sunriseJd < 1);
}
// when the Jupiter sign of the Prasna matches no year in the window, the trikona reading of v.12 is tried and marked
const none = N.birthYears({ prasna: { ...p, samvatsaraSign: 8 }, lagnaSign: 11, queryMs, ageMin: 25, ageMax: 30, ...place });
assert.ok(none.viaTrikona || none.candidates.length === 0);
console.log('test-nashta-jataka: all assertions passed');
