const assert = require('assert');
const L = require('./src/chart/specialLagnas');
const { sunriseBefore } = require('./src/chart/sunriseBefore');
const { createChartContext } = require('./src/contracts/chartContext');
const { calculateParashariChart } = require('./src/chart/parashariChart');

// The book's worked example (BPHS ch.5, printed pp.62-64): birth 12 ghatis 30 vighatis after sunrise (5 hours), the Sun at
// sunrise 4s 12d = 132d.
const hours = (12.5 * 24) / 60;
assert.strictEqual(hours, 5);
assert.strictEqual(L.bhavaLagna(132, hours), 207, 'Bhava Lagna: 2.5 signs added = Libra 27');
assert.strictEqual(L.horaLagna(132, hours), 282, 'Hora Lagna: 5 signs added = Capricorn 12');
assert.strictEqual(L.ghatikaLagna(132, hours), 147, 'Ghatika Lagna: 12 signs and 15 degrees added = Leo 27');
// the book's Varnada example: Libra (7th sign) ascendant, Hora Lagna in Scorpio (8th): counts 7 and 5, both odd, 12; even, so
// 12 from Pisces backward = Aries
const v = L.varnadaLagna(7, 8);
assert.deepStrictEqual(v.counts, [7, 5]);
assert.strictEqual(v.total, 12);
assert.strictEqual(v.sign, 1, 'Aries');
assert.strictEqual(L.signFromCount(1), 1);
assert.strictEqual(L.signFromCount(2), 11, '2 from Pisces backward is Aquarius');
assert.strictEqual(L.signFromCount(3), 3);
assert.strictEqual(L.signFromCount(22), 3);
// every folded count is odd, so the counts always add
for (let s = 1; s <= 12; s += 1) assert.strictEqual(L.countOf(s) % 2, 1);

// PL9's "Special Lagnas" screen (5 Oct 1990, 04:30 IST, Chennai): Bhava Lagna 23d52'49" Leo, Hora Lagna 0d57'23" Leo, Ghatika
// Lagna 22d11'04" Taurus. The birth is before sunrise, so the sunrise of 4 Oct is taken.
const dms = (sign, d, m, s) => (sign - 1) * 30 + d + m / 60 + s / 3600;
const ctx = createChartContext({ year: 1990, month: 10, day: 5, hour: 4, minute: 30, ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330, latitude: 13.0827, longitude: 80.2707, placeName: 'Chennai', calendarMode: 'tirukanita' });
const chart = calculateParashariChart(ctx);
const geo = sunriseBefore(chart.julianDay, 13.0827, 80.2707, 'Lahiri', 'geometric');
assert.ok(geo.hoursSinceSunrise > 22 && geo.hoursSinceSunrise < 23, 'sunrise of the day before');
const sl = L.specialLagnas({ lagnaLongitude: chart.lagna.longitude, sunLongitudeAtSunrise: geo.sunLongitudeAtSunrise, hoursSinceSunrise: geo.hoursSinceSunrise });
const near = (a, b, tol) => Math.abs(((a - b + 540) % 360) - 180) < tol;
assert.ok(near(sl.bhava, dms(5, 23, 52, 49), 0.1), `bhava ${sl.bhava}`);
assert.ok(near(sl.hora, dms(5, 0, 57, 23), 0.1), `hora ${sl.hora}`);
assert.ok(near(sl.ghatika, dms(2, 22, 11, 4), 0.15), `ghatika ${sl.ghatika}`);
// the app's visible sunrise is a few minutes earlier, which moves the Ghatika Lagna by several degrees
const vis = sunriseBefore(chart.julianDay, 13.0827, 80.2707, 'Lahiri', 'visible');
assert.ok(vis.hoursSinceSunrise > geo.hoursSinceSunrise);
const slv = L.specialLagnas({ lagnaLongitude: chart.lagna.longitude, sunLongitudeAtSunrise: vis.sunLongitudeAtSunrise, hoursSinceSunrise: vis.hoursSinceSunrise });
assert.ok(Math.abs(slv.ghatika - sl.ghatika) > 3);
// a birth after sunrise takes that day's sunrise
const ctx2 = createChartContext({ year: 1990, month: 10, day: 5, hour: 12, minute: 0, ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330, latitude: 13.0827, longitude: 80.2707, placeName: 'Chennai', calendarMode: 'tirukanita' });
const c2 = calculateParashariChart(ctx2);
const noon = sunriseBefore(c2.julianDay, 13.0827, 80.2707, 'Lahiri', 'visible');
assert.ok(noon.hoursSinceSunrise > 5 && noon.hoursSinceSunrise < 7);
console.log('test-special-lagnas ok');
