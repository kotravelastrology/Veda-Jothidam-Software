const assert = require('assert');
const { buildReportData } = require('./src/report/reportData');
const B = require('./src/dasha/dashaBrowser');

// --- the distances
assert.strictEqual(B.signDistance(4, 4), 1, 'the same sign is the first');
assert.strictEqual(B.signDistance(4, 5), 2);
assert.strictEqual(B.signDistance(4, 10), 7);
assert.strictEqual(B.signDistance(10, 4), 7, 'counted forward round the zodiac');
assert.strictEqual(B.signDistance(11, 0), 2);
assert.strictEqual(B.nakshatraDistance(12, 12), 1);
assert.strictEqual(B.nakshatraDistance(12, 13), 2, 'the 2nd nakshatra from the first');
assert.strictEqual(B.nakshatraDistance(26, 0), 2, 'Revati to Ashwini');
assert.strictEqual(B.nakshatraDistance(12, 21), 10);
assert.deepStrictEqual([1, 2, 9, 10, 11, 18, 19, 27].map(B.taraOf), [1, 2, 9, 1, 2, 9, 1, 9]);

// --- sign dignity at a moment
assert.strictEqual(B.signDignity('Jupiter', 3), 'exalted', 'Jupiter in Cancer');
assert.strictEqual(B.signDignity('Saturn', 6), 'exalted', 'Saturn in Libra');
assert.strictEqual(B.signDignity('Mars', 9), 'exalted', 'Mars in Capricorn');
assert.strictEqual(B.signDignity('Venus', 5), 'debilitated', 'Venus in Virgo');
assert.strictEqual(B.signDignity('Sun', 4), 'own', 'Sun in Leo');
assert.strictEqual(B.signDignity('Moon', 1), 'exalted', 'Moon in Taurus');
assert.strictEqual(B.signDignity('Sun', 7), null);
assert.strictEqual(B.signDignity('Rahu', 1), null, 'the nodes have none here');
const moment = B.momentFacts({ Sun: 125, Moon: 40, Mars: 280, Mercury: 150, Jupiter: 100, Venus: 170, Saturn: 200, Rahu: 10, Ketu: 190 }, 4);
assert.deepStrictEqual(moment.map((m) => m.rasiIndex), [4, 1, 9, 5, 3, 5, 6, 0, 6]);
assert.strictEqual(moment[0].house, 1, 'the Sun in the ascendant sign');
assert.strictEqual(moment[2].house, 6, 'Mars in Capricorn, the 6th from Leo');
assert.strictEqual(moment[0].dignity, 'own');
assert.strictEqual(moment[1].dignity, 'exalted');
assert.strictEqual(moment[5].dignity, 'debilitated');
assert.ok(Math.abs(moment[0].degreeInSign - 5) < 1e-9);

// --- the sample chart (5 October 1990, 04:30 IST, Chennai): Leo ascendant, as the PL9 worksheet shows it
const report = buildReportData({
  name: 'aniruddha', gender: 'male', year: 1990, month: 10, day: 5, hour: 4, minute: 30,
  ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330, latitude: 13 + 5 / 60, longitude: 80 + 17 / 60, placeName: 'Chennai',
});
const natal = Object.fromEntries(B.natalFacts(report.chart).map((f) => [f.id, f]));
assert.deepStrictEqual(Object.keys(natal), B.GRAHAS);
// houses from the Leo ascendant: Sun, Mercury, Venus in the 2nd (Virgo); Mars in the 10th (Taurus); Jupiter, Ketu in the 12th; Saturn in the 5th; Moon in the 8th; Rahu in the 6th
assert.deepStrictEqual(B.GRAHAS.map((p) => natal[p].house), [2, 8, 10, 2, 12, 2, 5, 6, 12]);
// the houses each rules from Leo: Sun 1, Moon 12, Mars 4 and 9, Mercury 2 and 11, Jupiter 5 and 8, Venus 3 and 10, Saturn 6 and 7
assert.deepStrictEqual(B.GRAHAS.map((p) => natal[p].lordOf), [[1], [12], [4, 9], [2, 11], [5, 8], [3, 10], [6, 7], [], []]);
// dignity as the worksheet's strength table has it (PL9: Su Enemy, Mo Enemy, Ma Enemy, Me Exalt, Ju Exalt, Ve Debil, Sa Enemy)
assert.deepStrictEqual(B.GRAHAS.slice(0, 7).map((p) => natal[p].dignity), ['enemy', 'enemy', 'enemy', 'exalted', 'exalted', 'debilitated', 'enemy']);
assert.strictEqual(natal.Rahu.dignity, null);
// nakshatras PL9 prints: Sun Hasta (12), Moon Revati (26), Mars Rohini (3), Rahu Shravana (21)
assert.deepStrictEqual(['Sun', 'Moon', 'Mars', 'Rahu'].map((p) => natal[p].star27), [12, 26, 3, 21]);
// the Sun-Rahu pair of the running period: 5 signs apart; Hasta to Shravana is the 10th nakshatra, the first tara
assert.strictEqual(B.signDistance(natal.Sun.rasiIndex, natal.Rahu.rasiIndex), 5);
assert.strictEqual(B.nakshatraDistance(natal.Sun.star27, natal.Rahu.star27), 10);
assert.strictEqual(B.taraOf(10), 1);

console.log('test-dasha-browser: all assertions passed');
