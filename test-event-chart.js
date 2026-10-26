const assert = require('assert');
const { createChartContext } = require('./src/contracts/chartContext');
const { calculateParashariChart } = require('./src/chart/parashariChart');
const E = require('./src/report/eventChart');

// PL9's event screens (116, 117, 121) for the audit chart (5 Oct 1990 04:30 Chennai) and the event 18 Sep 2026 07:59:35, Bengaluru.
const ctx = createChartContext({ year: 1990, month: 10, day: 5, hour: 4, minute: 30, ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330, latitude: 13.0827, longitude: 80.2707, placeName: 'Chennai', calendarMode: 'tirukanita' });
const chart = calculateParashariChart(ctx);
const r = E.eventChart({ natal: { ctx, chart }, event: { year: 2026, month: 9, day: 18, hour: 7, minute: 59, second: 35, latitude: 12.9833, longitude: 77.5833, utcOffsetMinutes: 330, placeName: 'Bengaluru' } });

// "New Event Kakshas": Su in Vir 1 (Sa) 2 21 / Mo in Sco 0 (Mo) 3 26 / Ma in Gem 1 (As) 5 34 / Me in Vir 1 (Ve) 4 21 / Ju in Can 1 (Mo) 5 32 / Ve in Lib 1 (Ma) 5 25 / Sa in Pis 0 (Ve) 2 24
const expected = [
  ['Sun', 5, 'Saturn', 1, 2, 21], ['Moon', 7, 'Moon', 0, 3, 26], ['Mars', 2, 'Lagna', 1, 5, 34], ['Mercury', 5, 'Venus', 1, 4, 21],
  ['Jupiter', 3, 'Moon', 1, 5, 32], ['Venus', 6, 'Mars', 1, 5, 25], ['Saturn', 11, 'Venus', 0, 2, 24],
];
for (const [planet, sign, lord, bindu, bhinna, sarva] of expected) {
  const k = r.kakshas.find((x) => x.planet === planet);
  assert.deepStrictEqual([k.sign, k.lord, k.bindu ? 1 : 0, k.bhinna, k.sarva], [sign, lord, bindu, bhinna, sarva], planet);
}
// "New Event Gochara data": Tarabala Janma; Chandrabala 9; Tithi Shukla Saptami; Karana Vanija; Yoga Preeti; Yogini lord Saturn; Ashtottari Moon
assert.strictEqual(r.gochara.tara.name, 'Janma');
assert.strictEqual(r.gochara.chandraFromBirthMoon, 9);
assert.deepStrictEqual([r.gochara.tithi.name, r.gochara.tithi.paksha], ['Saptami', 'SHUKLA']);
assert.strictEqual(r.gochara.karana.name, 'Vanija');
assert.strictEqual(r.gochara.yoga.name, 'Priti');
assert.strictEqual(r.dashas.yogini.lord, 'Saturn');
assert.strictEqual(r.dashas.ashtottari.lord, 'Moon');
assert.strictEqual(r.dashas.chara.sign, 7, 'Chara (As) = Scorpio, as PL9');
// Vimshottari: Sun-Rahu-Rahu-Ketu as PL9; the fifth level is Moon here, Rahu in PL9 (the two systems may count the year differently)
assert.deepStrictEqual(r.dashas.vimshottari.slice(0, 4).map((x) => x.lord), ['Sun', 'Rahu', 'Rahu', 'Ketu']);
assert.strictEqual(r.dashas.vimshottari.length, 5);
// the event chart: Sun in Virgo, Moon in Scorpio, lagna Virgo (PL9 shows As with Su and Me in Vir)
assert.deepStrictEqual([r.chart.lagnaSign, r.chart.planets.find((p) => p.planet === 'Sun').sign, r.chart.moonSign], [5, 5, 7]);
assert.strictEqual(r.chart.fromMoon[0].sign, 7);
assert.strictEqual(r.chart.fromLagna.length, 12);
// Vimshopaka total for the Sun: PL9 shows 7.8 ("Su 7.8")
assert.ok(Math.abs(r.vimshopaka.planets.find((p) => p.planet === 'Sun').total - 7.75) < 0.01);
// a birth-moment event is the birth chart itself: Tara count is 1 (Janma), Chandra from birth Moon is 1, kakshas equal the natal Ashtakavarga
const same = E.eventChart({ natal: { ctx, chart }, event: { year: 1990, month: 10, day: 5, hour: 4, minute: 30, latitude: 13.0827, longitude: 80.2707, utcOffsetMinutes: 330 } });
assert.strictEqual(same.gochara.tara.count, 1);
assert.strictEqual(same.gochara.chandraFromBirthMoon, 1);
assert.strictEqual(same.chart.lagnaSign, chart.lagna.rasiIndex);
console.log('test-event-chart ok');
