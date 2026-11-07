const assert = require('assert');
const D = require('./src/chart/declination');
const { createChartContext } = require('./src/contracts/chartContext');
const { calculateParashariChart } = require('./src/chart/parashariChart');

assert.deepStrictEqual(D.dms(-4.53), { d: 4, m: 31, s: 48 });
assert.deepStrictEqual(D.dms(23.9999), { d: 24, m: 0, s: 0 });

// 12 May 1990, 14:30 IST: the Sun, in Aries 27d, stands near +18 degrees; the Moon is far south; every planet is within
// the Moon's and the planets' possible range.
const ctx = createChartContext({ year: 1990, month: 5, day: 12, hour: 14, minute: 30, ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330, latitude: 13.08, longitude: 80.27, placeName: 'Chennai', calendarMode: 'tirukanita' });
const chart = calculateParashariChart(ctx);
const rows = Object.fromEntries(D.declinations(chart.julianDay).map((r) => [r.planet, r]));
assert.ok(Math.abs(rows.Sun.declination - 18.11) < 0.05, `Sun ${rows.Sun.declination}`);
assert.strictEqual(rows.Sun.hemisphere, 'N');
assert.strictEqual(rows.Moon.hemisphere, 'S');
assert.ok(Math.abs(rows.Sun.declination) <= D.OBLIQUITY + 0.01);
for (const r of Object.values(rows)) assert.ok(Math.abs(r.declination) < 29, r.planet);

// The Sun's declination follows the season: north in May, south in November.
const sunMay = D.declinations(2448023.875)[0].declination;
const sunNov = D.declinations(2448023.875 + 180)[0].declination;
assert.ok(sunMay > 0 && sunNov < 0);
console.log('test-declination ok');
