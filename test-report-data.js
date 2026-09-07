const assert = require('node:assert/strict');
const { buildReportData, CLASSICAL_GRAHAS } = require('./src/report/reportData');

const report = buildReportData({
  name: 'Test Native',
  gender: 'female',
  year: 1990, month: 5, day: 15, hour: 7, minute: 30,
  ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330,
  latitude: 11.34, longitude: 77.72, placeName: 'Erode',
});

// Profile identity carries through unchanged.
assert.equal(report.profile.name, 'Test Native');
assert.equal(report.profile.gender, 'female');
assert.equal(typeof report.profile.chartId, 'string');

// Parashari chart: Lagna + all 7 classical grahas present with a Rasi and a house.
assert.ok(report.chart.lagna.rasi);
for (const planet of CLASSICAL_GRAHAS) {
  assert.ok(report.chart.grahas[planet].rasi, `${planet} rasi`);
  assert.ok(report.chart.grahas[planet].house >= 1 && report.chart.grahas[planet].house <= 12, `${planet} house`);
}
assert.equal(report.chart.houseSystem, 'Porphyrius');
assert.ok(Number.isFinite(report.chart.mc));

// Rahu/Ketu (Mean Node convention) are computed, always exactly opposite each other.
assert.ok(report.chart.grahas.Rahu.rasi);
assert.ok(report.chart.grahas.Ketu.rasi);
const expectedKetuLongitude = (report.chart.grahas.Rahu.longitude + 180) % 360;
assert.ok(Math.abs(report.chart.grahas.Ketu.longitude - expectedKetuLongitude) < 1e-9);

// Dasha: 9 Mahadashas, each with a Bhukti array (depth 2).
assert.equal(report.dasha.dashas.length, 9);
assert.ok(Array.isArray(report.dasha.dashas[0].Bhukti));

// Vargas: all 8 chart points (Lagna + 7 grahas), each with all 16 divisions.
assert.equal(Object.keys(report.vargas).length, 8);
for (const point of ['Lagna', ...CLASSICAL_GRAHAS]) {
  assert.equal(Object.keys(report.vargas[point]).filter((k) => k.startsWith('D')).length, 16);
}

// Ashtakavarga: Sarvashtakavarga totals 337.
const sarvaTotal = report.ashtakavarga.sarva.reduce((a, b) => a + b, 0);
assert.equal(sarvaTotal, 337);

// Shadbala: partial data present for all 7 planets, with explicit gaps.
assert.equal(Object.keys(report.shadbala.perPlanet).length, 7);
assert.equal(report.shadbala.perPlanet.Sun.shadbalaTotal.status, 'SOURCE_REQUIRED');
assert.ok(Number.isFinite(report.shadbala.perPlanet.Sun.kaala.nathonnataBala));

// Bhava Bala: all 12 houses present, each with a house/lord/karaka bindu reading.
assert.equal(Object.keys(report.bhavaBala.houses).length, 12);
assert.ok(report.bhavaBala.houses[1].lord.planet);
assert.ok(report.bhavaBala.houses[1].karaka.planet);

// Nabhasa Yoga: at least the fallback/derived list is present (an array, possibly empty).
assert.ok(Array.isArray(report.nabhasaYoga.yogas));

// Karaka: constant tables present, Chara Karaka still an explicit refusal.
assert.equal(report.karaka.naisargika.Moon, 'Mother');
assert.equal(report.karaka.bhava[7], 'Venus');
assert.ok(Array.isArray(report.karaka.yoga));
assert.equal(report.karaka.charaKaraka.status, 'SOURCE_REQUIRED');

// Transit: current Ashtakavarga transit reading present for all 7 classical grahas.
assert.equal(Object.keys(report.transit.perPlanet).length, 7);
for (const planet of CLASSICAL_GRAHAS) {
  const reading = report.transit.perPlanet[planet];
  assert.ok(reading.rasi, `${planet} transit rasi`);
  assert.ok(reading.bhinnaBindus >= 0 && reading.bhinnaBindus <= 8, `${planet} transit bhinna bindus`);
  assert.ok(reading.sarvaClassification, `${planet} transit sarva classification`);
}

// Raja Yogas (S11-A): 22 yogas available, with source attribution.
assert.ok(report.rajaYogas, 'Raja Yogas present');
assert.ok(Array.isArray(report.rajaYogas.yogas), 'Raja Yogas array present');
assert.ok(report.rajaYogas.source, 'Raja Yogas source attribution');
assert.ok(report.rajaYogas.source.convention.includes('Ch.39'), 'Source cites BPHS Chapter 39');

// Doshas (S11-B): 8 doshas available, with source attribution.
assert.ok(report.doshas, 'Doshas present');
assert.ok(Array.isArray(report.doshas.doshas), 'Doshas array present');
assert.ok(report.doshas.source, 'Doshas source attribution');
assert.ok(report.doshas.source.convention.includes('Ch.83'), 'Source cites BPHS Chapter 83');

// Lunar/Solar/PMP Yogas (S11-C): 14 yogas available, with source attribution.
assert.ok(report.lunarSolarYogas, 'Lunar/Solar yogas present');
assert.ok(Array.isArray(report.lunarSolarYogas.yogas), 'Lunar/Solar yogas array present');
assert.ok(report.lunarSolarYogas.source, 'Lunar/Solar yogas source attribution');
assert.ok(report.lunarSolarYogas.source.convention.includes('Ch.37') ||
          report.lunarSolarYogas.source.convention.includes('Ch.38') ||
          report.lunarSolarYogas.source.convention.includes('Ch.31'),
  'Source cites BPHS chapters for lunar/solar/PMP yogas');

// Wealth Yogas (S11-C Phase 3.2): 15 yogas available, with source attribution.
assert.ok(report.wealthYogas, 'Wealth yogas present');
assert.ok(Array.isArray(report.wealthYogas.yogas), 'Wealth yogas array present');
assert.ok(report.wealthYogas.source, 'Wealth yogas source attribution');
assert.ok(report.wealthYogas.source.convention.includes('Ch.'),
  'Source cites BPHS chapters for wealth yogas');

// Determinism: same birth input -> same chartId and same Lagna.
const reportAgain = buildReportData({
  name: 'Test Native', gender: 'female',
  year: 1990, month: 5, day: 15, hour: 7, minute: 30,
  ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330,
  latitude: 11.34, longitude: 77.72, placeName: 'Erode',
});
assert.equal(reportAgain.profile.chartId, report.profile.chartId);
assert.equal(reportAgain.chart.lagna.rasi, report.chart.lagna.rasi);

console.log(JSON.stringify({
  pass: true, name: report.profile.name, lagna: report.chart.lagna.rasi,
  moonRasi: report.chart.grahas.Moon.rasi, startingDashaLord: report.dasha.startingLord,
  nabhasaYogas: report.nabhasaYoga.yogas.map((y) => y.name),
  rajaYogas: report.rajaYogas.yogas.map((y) => y.name).slice(0, 3),
  doshas: report.doshas.doshas.map((d) => d.name).slice(0, 3),
  lunarSolarYogas: report.lunarSolarYogas.yogas.map((y) => y.name).slice(0, 2),
  wealthYogas: report.wealthYogas.yogas.map((y) => y.name).slice(0, 3),
}, null, 2));
