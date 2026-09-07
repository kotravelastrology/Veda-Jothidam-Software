const assert = require('node:assert/strict');
const { createBirthProfile } = require('./src/contracts/birthProfile');
const {
  calculateParashariChart, rasiFromLongitude, houseOfLongitude, RASI_NAMES,
} = require('./src/chart/parashariChart');

// houseOfLongitude, using Sripatipaddhati's own worked example cusps
// (Sloka 6-7, file page 21 / printed page 10): 1st=0s14-31-46 (14.5294deg),
// 2nd=1s12-15-14 (42.2539deg), 3rd=2s9-58-43 (69.9786deg), 4th=3s7-42-11
// (97.7031deg); 7th/10th are always 1st/4th + 180deg (Sloka 6). The
// remaining cusps are filled with placeholders far from the sample points
// below, since the book only worked out the 1st-4th quadrant in detail.
const sripatiCusps = {
  1: 14.5294, 2: 42.2539, 3: 69.9786, 4: 97.7031,
  5: 130, 6: 160, 7: 194.5294, 8: 230, 9: 260,
  10: 277.7031, 11: 310, 12: 340,
};
assert.equal(houseOfLongitude(20, sripatiCusps), 1); // between 1st and 2nd
assert.equal(houseOfLongitude(50, sripatiCusps), 2); // between 2nd and 3rd
assert.equal(houseOfLongitude(80, sripatiCusps), 3); // between 3rd and 4th
assert.equal(houseOfLongitude(100, sripatiCusps), 4); // just past 4th
assert.equal(houseOfLongitude(sripatiCusps[1], sripatiCusps), 1); // exactly on a cusp belongs to that house
assert.equal(houseOfLongitude(5, sripatiCusps), 12); // wraps around before the 1st cusp

// rasiFromLongitude: boundary and wraparound behaviour.
assert.deepEqual(rasiFromLongitude(0), { rasiIndex: 0, rasi: 'Mesha', degreeInSign: 0 });
assert.equal(rasiFromLongitude(29.9999999).rasi, 'Mesha');
assert.deepEqual(rasiFromLongitude(30), { rasiIndex: 1, rasi: 'Vrishabha', degreeInSign: 0 });
assert.equal(rasiFromLongitude(359).rasi, 'Meena');
assert.equal(rasiFromLongitude(-10).rasi, 'Meena'); // wraps to 350
assert.equal(rasiFromLongitude(370).rasi, 'Mesha'); // wraps to 10
assert.equal(RASI_NAMES.length, 12);

const profile = createBirthProfile({
  name: 'Test Native',
  year: 1990, month: 5, day: 15, hour: 7, minute: 30,
  ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330,
  latitude: 11.34, longitude: 77.72, placeName: 'Erode',
});

const chart = calculateParashariChart(profile.chartContext);

assert.equal(chart.engine, '@swisseph/node');
assert.equal(chart.ayanamsha, 'Lahiri');
assert.ok(Number.isFinite(chart.julianDay));

// Lagna carries longitude + Rasi placement.
assert.ok(Number.isFinite(chart.lagna.longitude));
assert.ok(RASI_NAMES.includes(chart.lagna.rasi));
assert.ok(chart.lagna.degreeInSign >= 0 && chart.lagna.degreeInSign < 30);

// All seven classical grahas plus Rahu/Ketu are present with Rasi placement.
const expectedGrahas = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Rahu', 'Ketu'];
assert.deepEqual(Object.keys(chart.grahas).sort(), [...expectedGrahas].sort());
for (const name of expectedGrahas) {
  const graha = chart.grahas[name];
  assert.ok(Number.isFinite(graha.longitude), `${name} longitude`);
  assert.ok(RASI_NAMES.includes(graha.rasi), `${name} rasi`);
  assert.ok(Number.isInteger(graha.house) && graha.house >= 1 && graha.house <= 12, `${name} house`);
}

// Bhava now uses the Porphyrius (= Sripati Paddhati) house system by S2's default.
assert.equal(chart.houseSystem, 'Porphyrius');
assert.equal(chart.cusps.length, 13); // 1-indexed, index 0 unused

// Ketu is always exactly opposite Rahu (Mean Node convention).
const expectedKetu = (chart.grahas.Rahu.longitude + 180) % 360;
assert.ok(Math.abs(chart.grahas.Ketu.longitude - expectedKetu) < 1e-9);

// Determinism: same chart context -> byte-identical positions.
const chartAgain = calculateParashariChart(profile.chartContext);
assert.equal(chart.lagna.longitude, chartAgain.lagna.longitude);
assert.equal(chart.grahas.Moon.longitude, chartAgain.grahas.Moon.longitude);
assert.equal(chart.grahas.Rahu.longitude, chartAgain.grahas.Rahu.longitude);

console.log(JSON.stringify({
  pass: true,
  lagna: chart.lagna,
  moon: chart.grahas.Moon,
  rahu: chart.grahas.Rahu,
  ketu: chart.grahas.Ketu,
}, null, 2));
