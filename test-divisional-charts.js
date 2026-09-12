const assert = require('node:assert/strict');
const { DIVISIONAL_CHARTS, calculateDChart, getDChartName } = require('./src/chart/divisionalCharts');

// --- D-chart definitions sanity ---
// Divisional charts: D1-D60 representing 360°/N divisions
assert.ok(DIVISIONAL_CHARTS.length > 0, 'divisional charts are defined');

// Verify core D-charts
const d1 = DIVISIONAL_CHARTS.find(d => d.division === 1);
assert.ok(d1, 'D1 (Rashi) exists');
assert.equal(d1.degreesPerDivision, 30, 'D1 has 30° per sign');
assert.equal(d1.name, 'Rashi (D1)', 'D1 is named Rashi');

const d9 = DIVISIONAL_CHARTS.find(d => d.division === 9);
assert.ok(d9, 'D9 (Navamsha) exists');
assert.equal(d9.degreesPerDivision, 40, 'D9 has 40° per navamsha (360/9)');
assert.equal(d9.name, 'Navamsha (D9)', 'D9 is named Navamsha');

const d60 = DIVISIONAL_CHARTS.find(d => d.division === 60);
assert.ok(d60, 'D60 (Shastiamsha) exists');
assert.equal(d60.degreesPerDivision, 6, 'D60 has 6° per part');
assert.equal(d60.name, 'Shastiamsha (D60)', 'D60 is named Shastiamsha');

// --- D-chart placement calculations ---
// Sun at 10° (Aries, D1 #0, D9 #0, D60 #1)
const sunResult = calculateDChart(10, 1); // D1
assert.equal(sunResult.division, 0, 'Sun in D1 division 0');
assert.equal(sunResult.degreesInDivision, 10, 'Sun at 10° in its D1');

const sunD9 = calculateDChart(10, 9); // D9
assert.equal(sunD9.division, 0, 'Sun in D9 division 0');

const sunD60 = calculateDChart(10, 60); // D60
assert.equal(sunD60.division, 1, 'Sun in D60 division 1');

// --- Multi-graha placement ---
// Test that all 9 grahas can be placed in any D-chart
const grahaLongitudes = {
  Sun: 10, Moon: 40, Mars: 206, Mercury: 10, Jupiter: 100,
  Venus: 40, Saturn: 280, Rahu: 60, Ketu: 240
};

const placements = {};
for (const [graha, longitude] of Object.entries(grahaLongitudes)) {
  placements[graha] = calculateDChart(longitude, 9); // Use D9 for test
}

assert.equal(Object.keys(placements).length, 9, 'All 9 grahas placed');
for (const [graha, placement] of Object.entries(placements)) {
  assert.ok(placement.division >= 0, `${graha} has valid D9 division`);
  assert.ok(placement.degreesInDivision >= 0, `${graha} has valid degrees in D9`);
}

// --- D-chart name resolution ---
assert.equal(getDChartName(1), 'Rashi (D1)', 'getDChartName(1) returns Rashi');
assert.equal(getDChartName(9), 'Navamsha (D9)', 'getDChartName(9) returns Navamsha');
assert.equal(getDChartName(60), 'Shastiamsha (D60)', 'getDChartName(60) returns Shastiamsha');

console.log(JSON.stringify({
  pass: true,
  dchartCount: DIVISIONAL_CHARTS.length,
  mainCharts: {
    d1: getDChartName(1),
    d9: getDChartName(9),
    d12: getDChartName(12),
    d20: getDChartName(20),
    d60: getDChartName(60)
  },
  sunPlacements: {
    d1Division: calculateDChart(10, 1).division,
    d9Division: calculateDChart(10, 9).division,
    d60Division: calculateDChart(10, 60).division
  }
}, null, 2));
