/**
 * The Sudarshana Chakra dasha of BPHS ch.74 (src/report/sudarshanaDasha.js, fixture bphs-74.json): the fixture's shape, the facts of v.24-26 on a chart worked by hand,
 * the circles of v.19-20, and the solar years and months against the ephemeris.
 */
const assert = require('node:assert/strict');
const S = require('./src/report/sudarshanaDasha');
const { sunLon } = require('./src/report/masaPravesha');

for (const k of ['general', 'separate', 'dasha', 'favourable', 'ashtakavarga']) assert.ok(S.DATA[k].ta.length > 60 && S.DATA[k].verses && S.DATA[k].page, k);
assert.ok(S.DATA.source.title && S.DATA.source.pageLocus && S.DATA.scope && S.DATA.note);
assert.deepEqual(S.DATA.separate.verses, '19-20');
assert.deepEqual(S.DATA.favourable.verses, '24-26');
assert.deepEqual(S.DATA.favourable.page, '921');

assert.equal(S.houseFrom(0, 0), 1);
assert.equal(S.houseFrom(2, 11), 4);
assert.equal(S.houseFrom(11, 0), 12);

// v.19-20: all three apart reads three circles; two or three together reads the birth chart only
assert.equal(S.circlesApply({ lagna: 0, Sun: 4, Moon: 8 }), true);
assert.equal(S.circlesApply({ lagna: 0, Sun: 0, Moon: 8 }), false);
assert.equal(S.circlesApply({ lagna: 0, Sun: 4, Moon: 4 }), false);
assert.deepEqual(S.circlesOf({ lagna: 0, Sun: 4, Moon: 8 }).map((c) => [c.id, c.ref]), [['lagna', 0], ['moon', 8], ['sun', 4]]);
assert.deepEqual(S.circlesOf({ lagna: 3, Sun: 3, Moon: 8 }).map((c) => c.id), ['lagna']);

// year n makes the nth house the Ascendant, back to the 1st after twelve
assert.equal(S.periodAscendant(5, 1), 5);
assert.equal(S.periodAscendant(5, 2), 6);
assert.equal(S.periodAscendant(5, 12), 4);
assert.equal(S.periodAscendant(5, 13), 5);

// v.24-26 by hand, from Aries: Sun 1st, Moon 4th, Mars 7th, Mercury 10th, Jupiter 2nd, Venus 3rd, Saturn 5th, Rahu 9th, Ketu 3rd
const signs = { Sun: 0, Moon: 3, Mars: 6, Mercury: 9, Jupiter: 1, Venus: 2, Saturn: 4, Rahu: 8, Ketu: 2 };
const r = S.readPeriod(signs, 0);
assert.deepEqual(r.goodBenefics, [{ planet: 'Moon', house: 4 }, { planet: 'Mercury', house: 10 }]);
assert.deepEqual(r.maleficsIn3611, [{ planet: 'Ketu', house: 3 }]);
assert.deepEqual(r.nodesOnly, [9], 'Rahu alone in the 9th; Ketu shares the 3rd with Venus');
assert.deepEqual(r.maleficMajority, [1, 5, 7, 9], 'the 3rd holds a benefic and a malefic, not a majority');
assert.deepEqual(r.beneficsIn6Or12, [3, 4, 5, 9, 10, 11]);
// counted from Taurus every house number drops by one: Moon 3rd, Mercury 9th, Jupiter 1st, Venus 2nd, Ketu 2nd, Saturn 4th, Rahu 8th, Mars 6th, Sun 12th
const t = S.readPeriod(signs, 1);
assert.deepEqual(t.goodBenefics, [{ planet: 'Mercury', house: 9 }, { planet: 'Jupiter', house: 1 }]);
assert.deepEqual(t.maleficsIn3611, [{ planet: 'Mars', house: 6 }]);
assert.deepEqual(t.nodesOnly, [8]);
assert.equal(t.ascSign, 1);

// the solar years and months: contiguous, each begins with the Sun at the birth longitude (years) or the birth longitude plus whole signs (months)
const birthMs = Date.UTC(1990, 9, 5, 4, 30) - 330 * 60000;
const natalSun = sunLon(birthMs);
const years = S.yearBounds(birthMs, natalSun, 1, 3);
assert.equal(years[0].startMs, birthMs);
assert.equal(years.length, 3);
for (let i = 0; i < 3; i += 1) {
  assert.equal(years[i].year, i + 1);
  if (i) assert.equal(years[i].startMs, years[i - 1].endMs);
  const days = (years[i].endMs - years[i].startMs) / 86400000;
  assert.ok(days > 365.0 && days < 365.6, `year ${i + 1} is ${days} days`);
  const off = Math.abs(((sunLon(years[i].endMs) - natalSun + 540) % 360) - 180);
  assert.ok(off < 0.001, `the Sun at the end of year ${i + 1} is ${off} degrees from its birth longitude`);
}
const months = S.monthBounds(birthMs, natalSun, 2);
assert.equal(months.length, 12);
assert.equal(months[0].startMs, years[1].startMs);
assert.ok(Math.abs(months[11].endMs - years[2].startMs) < 1000, 'the twelfth month ends where the next year begins');
months.forEach((m, k) => {
  if (k) assert.equal(m.startMs, months[k - 1].endMs);
  const d = (m.endMs - m.startMs) / 86400000;
  assert.ok(d > 28.5 && d < 32, `month ${k + 1} is ${d} days`);
  const off = Math.abs(((sunLon(m.startMs) - (natalSun + 30 * k) + 540) % 360) - 180);
  assert.ok(off < 0.001, `month ${k + 1} begins ${off} degrees from the book's solar month`);
});

// the year that contains a moment
const mid = (years[1].startMs + years[1].endMs) / 2;
assert.equal(S.yearNumberAt(birthMs, natalSun, mid), 2);
assert.equal(S.yearNumberAt(birthMs, natalSun, years[1].startMs), 2, 'a year begins at its first instant');
assert.equal(S.yearNumberAt(birthMs, natalSun, years[1].startMs - 1), 1);
assert.equal(S.yearNumberAt(birthMs, natalSun, birthMs), 1);
assert.equal(S.yearNumberAt(birthMs, natalSun, birthMs - 86400000), 1, 'before birth counts as the first year');
console.log('test-sudarshana-dasha: all assertions passed');
