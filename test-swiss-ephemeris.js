const assert = require('node:assert/strict');
const { calculateChart } = require('./src/ephemeris/swissEphemeris');

const chart = calculateChart({
  year: 1990, month: 5, day: 15, hour: 7, minute: 30,
  latitude: 11.34, longitude: 77.72, utcOffsetMinutes: 330,
  ayanamsa: 'Lahiri', houseSystem: 'Placidus',
});

assert.equal(chart.engine, '@swisseph/node');
assert.equal(chart.ayanamsa, 'Lahiri');
assert.equal(chart.houseSystem, 'Placidus');
assert.equal(Object.keys(chart.positions).length, 7);
assert.ok(Number.isFinite(chart.positions.Sun.longitude));
assert.ok(Number.isFinite(chart.houses.ascendant));
console.log(JSON.stringify({
  pass: true, engine: chart.engine, version: chart.engineVersion,
  julianDay: chart.julianDay, sunLongitude: chart.positions.Sun.longitude,
  ascendant: chart.houses.ascendant,
}, null, 2));
