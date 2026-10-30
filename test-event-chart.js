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
// Vimshottari at the event instant: Sun-Rahu-Rahu-Ketu-Moon, which is what PL9's own "New Event Gochara data" panel shows; its overview row is date-only
assert.deepStrictEqual(r.dashas.vimshottari.slice(0, 4).map((x) => x.lord), ['Sun', 'Rahu', 'Rahu', 'Ketu']);
assert.strictEqual(r.dashas.vimshottari.length, 5);
assert.strictEqual(r.dashas.vimshottari[4].lord, 'Moon');
// Sthira: BPHS (Santhanam) gives Scorpio; Rath's Brahma gives Capricorn, as PL9
assert.strictEqual(r.dashas.sthira.sign, 7);
assert.strictEqual(r.dashas.jaiminiSthira.sign, 9);
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
// PL9 121: "Progression (35) 5 Oct 2025 03:46:09" and the same for Bengaluru: lagna Leo, Muntha Cancer, Su Vir, Mo Aqu with Ra, Ju Gem, Ve Leo with Ke, Me and Ma Lib, Sa Pis
const vp = r.varsha;
assert.deepStrictEqual([vp.age, vp.munthaSign], [35, 3]);
for (const b of [vp.birthPlace, vp.eventPlace]) {
  assert.deepStrictEqual([b.local.year, b.local.month, b.local.day, b.local.hour, b.local.minute], [2025, 10, 5, 3, 46], 'return at 03:46, PL9 03:46:09 (the seconds differ by about twelve)');
  assert.strictEqual(b.lagnaSign, 4);
  const sg = Object.fromEntries(b.planets.map((p) => [p.planet, p.sign]));
  assert.deepStrictEqual([sg.Sun, sg.Moon, sg.Rahu, sg.Jupiter, sg.Venus, sg.Ketu, sg.Mercury, sg.Mars, sg.Saturn], [5, 10, 10, 2, 4, 4, 6, 6, 11]);
}
// on the day before the 35th return the age is 34; at the instant of birth there is no return chart yet
const day = E.eventChart({ natal: { ctx, chart }, event: { year: 2025, month: 10, day: 4, hour: 12, minute: 0, latitude: 13.0827, longitude: 80.2707, utcOffsetMinutes: 330 } });
assert.strictEqual(day.varsha.age, 34);
assert.strictEqual(same.varsha, null);
// PL9's "New Event Gochara data" five-level strings: Yogini Saturn-Rahu-Saturn-Mercury-Rahu, Ashtottari Moon-Moon-Venus-Venus-Moon
assert.deepStrictEqual(r.dashas.yogini5.map((x) => x.lord), ['Saturn', 'Rahu', 'Saturn', 'Mercury', 'Rahu']);
assert.deepStrictEqual(r.dashas.ashtottari5.map((x) => x.lord), ['Moon', 'Moon', 'Venus', 'Venus', 'Moon']);
// each level lies inside the one above it and contains the instant
const eventMs = (r.event.julianDay - 2440587.5) * 86400000;
for (const chain of [r.dashas.yogini5, r.dashas.ashtottari5, r.dashas.narayana5, r.dashas.jaiminiSthira5]) {
  assert.strictEqual(chain.length, 5);
  chain.forEach((c, i) => {
    assert.ok(c.startMs <= eventMs && eventMs < c.endMs + 1);
    if (i) assert.ok(c.startMs >= chain[i - 1].startMs - 1 && c.endMs <= chain[i - 1].endMs + 1);
  });
}
// Narayana main period Pisces as PL9; the lower signs follow Rath 2.4.31-34 (PL9 prints Lib-Pis-Gem-Aqu there, not reproduced); the main period of the Rath Sthira is Capricorn
assert.strictEqual(r.dashas.narayana5[0].sign, 11);
assert.strictEqual(r.dashas.jaiminiSthira5[0].sign, 9);
// Shatabdika (BPHS ch.46: Revati to the birth star, mod 7; 5, 5, 10, 10, 20, 20, 30) and Kalachakra (Thillainayaka Pulavar) at the event: five and two levels inside each other
const sh = r.dashas.shatabdika5;
assert.strictEqual(sh.chain.length, 5);
assert.strictEqual(sh.chain[0].lord, 'Jupiter', 'born in Revati: Sun (balance), Moon, Venus, Mercury, then Jupiter from 2018');
assert.strictEqual(sh.applies.applies, false, 'the lagna is not vargottama');
sh.chain.forEach((c, i) => { assert.ok(c.startMs <= eventMs && eventMs < c.endMs + 1); if (i) assert.ok(c.startMs >= sh.chain[i - 1].startMs - 1 && c.endMs <= sh.chain[i - 1].endMs + 1); });
const kc = r.dashas.kalachakra;
assert.deepStrictEqual([kc.nakshatra, kc.pada, kc.maha.rasiIndex, kc.bhukti.rasiIndex], ['ரேவதி', 3, 1, 2]);
assert.ok(kc.maha.startMs <= eventMs && eventMs < kc.maha.endMs && kc.bhukti.startMs <= eventMs && eventMs < kc.bhukti.endMs);
console.log('test-event-chart ok');
