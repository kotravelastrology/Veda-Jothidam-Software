/**
 * "Today for you" (src/report/personalToday.js): the facts of one chart on one day, for the sample birth 5 Oct 1990 04:30 Chennai (the Moon in
 * Revati, the birth dasha Mercury), on 20 Nov 2026 17:00 UTC.
 */
const assert = require('node:assert/strict');
const { createChartContext } = require('./src/contracts/chartContext');
const { calculateParashariChart } = require('./src/chart/parashariChart');
const { buildVimshottariDasha } = require('./src/dasha/vimshottariDasha');
const { planetLongitude } = require('./src/ephemeris/siderealPositions');
const GT = require('./src/report/nakshatraGocharaTables');
const { personalToday, runningDashas, houseFrom } = require('./src/report/personalToday');

const input = { year: 1990, month: 10, day: 5, hour: 4, minute: 30, second: 0, ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330, latitude: 13.0827, longitude: 80.2707, placeName: 'Chennai' };
const chart = calculateParashariChart(createChartContext({ ...input, calendarMode: 'tirukanita' }));
const dasha = buildVimshottariDasha(chart.julianDay, chart.grahas.Moon.longitude, 330, {
  depth: 1, yearDays: 365.25, balance: 'degree', moonLongitudeAt: (jd) => planetLongitude(jd, 'Moon', 'Lahiri'),
});
const mahadashas = dasha.dashas.map((d) => ({ lord: d.lord, startJd: d.startJulianDay, endJd: d.endJulianDay, ...(d.fullStartJulianDay !== undefined ? { fullStartJd: d.fullStartJulianDay } : {}) }));
const base = { natalMoonLongitude: chart.grahas.Moon.longitude, mahadashas, utcOffsetMinutes: 330, ayanamsha: 'Lahiri' };
const at = Date.UTC(2026, 10, 20, 17, 0, 0);

const r = personalToday({ ...base, atMs: at });

// the birth star and sign
assert.deepEqual(r.janma, { starTa: 'ரேவதி', rasiTa: 'மீனம்' });
assert.equal(r.atUtc, '2026-11-20T17:00:00.000Z');

// the running periods: the Sun mahadasha (Venus ended on 25 June 2025, the birth balance of Mercury having ended on 25 June 1998 and Ketu 7 and Venus 20 years after it)
assert.equal(r.dasha.length, 3);
assert.deepEqual(r.dasha.map((d) => d.levelTa), ['தசை', 'புக்தி', 'அந்தரம்']);
assert.equal(r.dasha[0].lord, 'Sun');
assert.equal(r.dasha[0].lordTa, 'சூரியன்');
assert.equal(r.dasha[0].start, '2025-06-25');
assert.equal(r.dasha[0].end, '2031-06-26'); // 6 dasha years of 365.25 days (the settings' default), so a day later than the calendar date six years on
for (const d of r.dasha) {
  assert.ok(d.progress >= 0 && d.progress <= 1 && d.start < d.end && d.daysLeft >= 0, JSON.stringify(d));
}
// a sub-period lies inside its period
assert.ok(r.dasha[1].start >= r.dasha[0].start && r.dasha[1].end <= r.dasha[0].end);
assert.ok(r.dasha[2].start >= r.dasha[1].start && r.dasha[2].end <= r.dasha[1].end);
// the progress is the share of the period gone: the Sun mahadasha is 6 years from 25 June 2025, and 20 Nov 2026 is 513 days in (23.4 %)
assert.ok(Math.abs(r.dasha[0].progress - 513 / (6 * 365.25)) < 0.01, `progress ${r.dasha[0].progress}`);
assert.ok(Math.abs(r.dasha[0].daysLeft - (6 * 365.25 - 513)) < 3);

// the Moon of the day: in Uttarabhadrapada, the 27th star from Revati's... counted from the birth star Revati it is the 27th (the star before it), tara 9
assert.equal(r.moon.starTa, 'உத்திரட்டாதி');
assert.equal(r.moon.count, 27);
assert.equal(r.moon.tara, 9);
assert.equal(r.moon.taraTa, GT.TARAS[8].pulippaniTa);
assert.equal(r.moon.taraResultTa, GT.TARAS[8].pulippaniResultTa);
assert.ok(r.moon.pada >= 1 && r.moon.pada <= 4);
assert.equal(r.moon.rasiTa, 'மீனம்');
assert.equal(r.moon.houseFromMoon, 1);

// Saturn in Pisces, the birth Moon's own sign: the middle of the Sade Sati; Jupiter in Leo (sidereal 122 deg, which checks against the tropical 146 deg that Jupiter's orbit gives for
// that day, less the ayanamsha of 24.2 deg), the 6th from Pisces
assert.equal(r.saturn.rasiTa, 'மீனம்');
assert.equal(r.saturn.houseFromMoon, 1);
assert.equal(r.saturn.sadeSati.phase, 'PEAK');
assert.ok(/ஜென்ம ராசி/.test(r.saturn.sadeSati.nameTa));
assert.equal(r.jupiter.rasiTa, 'சிம்மம்');
assert.equal(r.jupiter.houseFromMoon, 6);
assert.ok(r.sources.tara.length > 0 && r.sources.sadeSati.title);

// the Sade Sati is named exactly when Saturn is in the 12th, 1st or 2nd from the birth Moon, on any day
for (let year = 2020; year <= 2044; year += 1) {
  const x = personalToday({ ...base, atMs: Date.UTC(year, 5, 15) });
  assert.equal(x.saturn.sadeSati !== null, [12, 1, 2].includes(x.saturn.houseFromMoon), `${year}: house ${x.saturn.houseFromMoon}`);
  assert.ok(x.moon.count >= 1 && x.moon.count <= 27 && x.moon.tara >= 1 && x.moon.tara <= 9 && ((x.moon.count - 1) % 9) + 1 === x.moon.tara);
}

// nothing reads the clock: the same instant gives the same answer
assert.deepEqual(personalToday({ ...base, atMs: at }), r);

// the houses
assert.equal(houseFrom(11, 11), 1);
assert.equal(houseFrom(0, 11), 2);
assert.equal(houseFrom(10, 11), 12);
assert.equal(houseFrom(3, 11), 5);

// before birth the first mahadasha is used, as the dasha page does; a missing Moon is refused
assert.equal(runningDashas({ mahadashas, atMs: Date.UTC(1980, 0, 1), utcOffsetMinutes: 330 })[0].lord, mahadashas[0].lord);
assert.throws(() => personalToday({ ...base, natalMoonLongitude: NaN, atMs: at }), RangeError);

console.log('test-personal-today: all assertions passed');
