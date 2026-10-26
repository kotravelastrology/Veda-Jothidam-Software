const assert = require('assert');
const { stepMoment, partsOf, UNITS } = require('./src/report/animatedTransit');
const { siderealAscendant } = require('./src/ephemeris/swissEphemeris');

const place = { latitude: 12.9833, longitude: 77.5833, utcOffsetMinutes: 330, ayanamsha: 'Lahiri' };
// PL9's screen: Fri 18 Sep 2026 09:08:16 IST
const t0 = Date.UTC(2026, 8, 18, 9, 8, 16) - 330 * 60000;
const at = (ms) => partsOf(ms, 330);
const show = (ms) => { const p = at(ms); return `${p.year}-${String(p.month).padStart(2, '0')}-${String(p.day).padStart(2, '0')} ${String(p.hour).padStart(2, '0')}:${String(p.minute).padStart(2, '0')}:${String(p.second).padStart(2, '0')}`; };

assert.strictEqual(show(stepMoment(t0, 'Seconds', 1, place)), '2026-09-18 09:08:17');
assert.strictEqual(show(stepMoment(t0, '10 Seconds', -1, place)), '2026-09-18 09:08:06');
assert.strictEqual(show(stepMoment(t0, 'Minutes', 1, place)), '2026-09-18 09:09:16');
assert.strictEqual(show(stepMoment(t0, '10 Minutes', 1, place)), '2026-09-18 09:18:16');
assert.strictEqual(show(stepMoment(t0, 'Hours', -1, place)), '2026-09-18 08:08:16');
assert.strictEqual(show(stepMoment(t0, 'Day', 1, place)), '2026-09-19 09:08:16');
assert.strictEqual(show(stepMoment(t0, 'Week', 1, place)), '2026-09-25 09:08:16');
assert.strictEqual(show(stepMoment(t0, 'Month', 1, place)), '2026-10-18 09:08:16');
assert.strictEqual(show(stepMoment(t0, 'Year', -1, place)), '2025-09-18 09:08:16');
assert.strictEqual(show(stepMoment(t0, '10 Years', 1, place)), '2036-09-18 09:08:16');
// a month step clamps to the last day: 31 Jan + 1 month = 28 Feb 2026
assert.strictEqual(show(stepMoment(Date.UTC(2026, 0, 31, 12) - 330 * 60000, 'Month', 1, place)), '2026-02-28 12:00:00');
// forward and back return to the start for the fixed units
for (const u of ['Week', 'Day', 'Hours', 'Minutes', 'Seconds']) assert.strictEqual(stepMoment(stepMoment(t0, u, 1, place), u, -1, place), t0);

// Ascendant: the new moment is at the start of the next sign; the previous one at the start of the current sign
const asc = (ms) => siderealAscendant(ms / 86400000 + 2440587.5, place.latitude, place.longitude, 'Lahiri');
const norm = (x) => ((x % 360) + 360) % 360;
const a0 = norm(asc(t0));
const next = stepMoment(t0, 'Ascendant', 1, place);
assert.ok(next > t0 && next - t0 < 3 * 3600000, `next ascendant sign in ${(next - t0) / 60000} minutes`);
assert.ok(Math.abs(((norm(asc(next + 1000)) % 30) + 0) - 0) < 0.2 || Math.abs(norm(asc(next + 1000)) % 30) < 0.2, 'lagna is at the start of a sign');
assert.strictEqual(Math.floor(norm(asc(next + 2000)) / 30), (Math.floor(a0 / 30) + 1) % 12);
const prev = stepMoment(t0, 'Ascendant', -1, place);
assert.ok(prev < t0 && t0 - prev < 3 * 3600000);
assert.strictEqual(Math.floor(norm(asc(prev + 2000)) / 30), Math.floor(a0 / 30), 'a second after the previous boundary the lagna is in the current sign');
assert.strictEqual(Math.floor(norm(asc(prev - 2000)) / 30), (Math.floor(a0 / 30) + 11) % 12);
// Navamsha steps are a ninth of a sign: shorter than the sign step on average
const nav = stepMoment(t0, 'Navamsha', 1, place);
assert.ok(nav > t0 && nav - t0 < next - t0 + 1);
assert.ok(Math.abs(norm(asc(nav + 1000)) % (30 / 9)) < 0.1);
assert.throws(() => stepMoment(t0, 'Decade', 1, place), /unknown unit/);
assert.deepStrictEqual(UNITS.length, 12);

// PL9's "Gochara (Transits)" table for Fri 18 Sep 2026 09:08:16 Bengaluru: degrees within a sign (to the arc-minute) and the nakshatra of each planet
const { createChartContext } = require('./src/contracts/chartContext');
const { calculateParashariChart } = require('./src/chart/parashariChart');
const { eventChart } = require('./src/report/eventChart');
const ctx = createChartContext({ year: 1990, month: 10, day: 5, hour: 4, minute: 30, ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330, latitude: 13.0827, longitude: 80.2707, calendarMode: 'tirukanita' });
const natal = calculateParashariChart(ctx);
const ev = eventChart({ natal: { ctx, chart: natal }, event: { year: 2026, month: 9, day: 18, hour: 9, minute: 8, second: 16, latitude: 12.9833, longitude: 77.5833, utcOffsetMinutes: 330 } });
const pl9 = { Sun: [1, 1, 37, 11], Moon: [23, 15, 27, 17], Mars: [29, 48, 42, 6], Mercury: [17, 53, 36, 12], Jupiter: [22, 57, 5, 8], Venus: [10, 16, 37, 14], Saturn: [18, 19, 31, 26], Rahu: [4, 9, 38, 22], Ketu: [4, 9, 38, 9] };
for (const [name, [d, m, sec, star]] of Object.entries(pl9)) {
  const g = ev.chart.planets.find((p) => p.planet === name);
  assert.ok(Math.abs(g.degree - (d + m / 60 + sec / 3600)) < 1 / 60, `${name} ${g.degree}`);
  assert.strictEqual(Math.floor(g.longitude / (360 / 27)), star, `${name} star`);
}
assert.ok(Math.abs(ev.eventChart.lagna.degreeInSign - (14 + 0 / 60 + 44 / 3600)) < 2 / 60, 'lagna 14d00m44s Libra');
assert.strictEqual(ev.chart.lagnaSign, 6);
console.log('test-animated-transit positions ok');

console.log('test-animated-transit ok');
