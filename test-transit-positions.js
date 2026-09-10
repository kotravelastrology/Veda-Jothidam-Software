const assert = require('node:assert/strict');
const { computeTransitPositions } = require('./src/report/transitPositions');

// A date with a well-known sidereal (Lahiri) sky: 2026-09-10 06:00 UTC.
const r = computeTransitPositions(new Date('2026-09-10T06:00:00Z'), { latitude: 13.08, longitude: 80.27 });

const by = Object.fromEntries(r.planets.map((p) => [p.planet, p]));
assert.equal(r.planets.length, 9, 'Sun..Saturn + Rahu + Ketu');

// Sidereal Sun is in Leo (Simha) in early-mid September.
assert.equal(by.Sun.sign, 'Leo', `Sun sign ${by.Sun.sign}`);
// Sun's daily motion is ~1 deg/day, direct.
assert.ok(by.Sun.speed > 0.9 && by.Sun.speed < 1.05, `Sun speed ${by.Sun.speed}`);
assert.equal(by.Sun.isRetrograde, false);

// Moon moves ~12-15 deg/day.
assert.ok(by.Moon.speed > 11 && by.Moon.speed < 15.5, `Moon speed ${by.Moon.speed}`);

// Saturn is retrograde in Pisces through autumn 2026.
assert.equal(by.Saturn.sign, 'Pisces', `Saturn sign ${by.Saturn.sign}`);
assert.equal(by.Saturn.isRetrograde, true, 'Saturn retrograde Sep 2026');

// Nodes: Rahu/Ketu on the Aquarius-Leo axis in 2026, exactly 180 deg apart, always retrograde.
assert.equal(by.Rahu.sign, 'Aquarius', `Rahu sign ${by.Rahu.sign}`);
assert.equal(by.Ketu.sign, 'Leo', `Ketu sign ${by.Ketu.sign}`);
const axis = ((by.Ketu.longitude - by.Rahu.longitude) % 360 + 360) % 360;
assert.ok(Math.abs(axis - 180) < 1e-6, `Rahu-Ketu opposition ${axis}`);
assert.equal(by.Rahu.isRetrograde, true);

// Panchanga limbs present and shaped.
assert.ok(/^(Shukla|Krishna) /.test(r.tithi), `tithi ${r.tithi}`);
assert.equal(r.vaara, 'Thursday'); // 2026-09-10 is a Thursday
assert.ok(/ Hora$/.test(r.hora), `hora ${r.hora}`);
assert.ok(['new', 'waxing-crescent', 'first-quarter', 'waxing-gibbous', 'full',
  'waning-gibbous', 'last-quarter', 'waning-crescent'].includes(r.lunarPhase));

// Ayanamsha choice shifts every longitude by the same amount (frame shift).
const raman = computeTransitPositions(new Date('2026-09-10T06:00:00Z'), { latitude: 13.08, longitude: 80.27, ayanamsha: 'Raman' });
const rBy = Object.fromEntries(raman.planets.map((p) => [p.planet, p]));
const sunShift = ((rBy.Sun.longitude - by.Sun.longitude) % 360 + 360) % 360;
const marsShift = ((rBy.Mars.longitude - by.Mars.longitude) % 360 + 360) % 360;
assert.ok(sunShift > 1.2 && sunShift < 1.7, `Lahiri->Raman shift ${sunShift}`);
assert.ok(Math.abs(sunShift - marsShift) < 1e-6, 'all bodies shift by the same ayanamsha delta');

console.log(JSON.stringify({ pass: true, date: r.date, tithi: r.tithi, vaara: r.vaara,
  sun: `${by.Sun.sign} ${by.Sun.degree}`, saturn: `${by.Saturn.sign} ${by.Saturn.degree} R` }, null, 2));
