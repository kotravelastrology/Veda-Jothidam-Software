const assert = require('assert');
const { calculateChart } = require('./src/ephemeris/swissEphemeris');
const { toEngineAyanamsa } = require('./src/ephemeris/ayanamsaNames');

// the app's names (chart form, settings page) map to the engine's; an engine name passes through; an unknown name is not mapped
assert.strictEqual(toEngineAyanamsa('kp'), 'Krishnamurti');
assert.strictEqual(toEngineAyanamsa('krishnamurti'), 'Krishnamurti');
assert.strictEqual(toEngineAyanamsa('fagan'), 'FaganBradley');
assert.strictEqual(toEngineAyanamsa('true_citra'), 'TrueCitra');
assert.strictEqual(toEngineAyanamsa('lahiri'), 'Lahiri');
assert.strictEqual(toEngineAyanamsa('Lahiri'), 'Lahiri');
assert.strictEqual(toEngineAyanamsa('constructor'), 'constructor', 'an object property name is not an alias');

// the same birth, under the app's name and the engine's name: the same positions and ascendant
const birth = { year: 1963, month: 5, day: 15, hour: 12, minute: 5, latitude: 23.0333, longitude: 72.6167, utcOffsetMinutes: 330, houseSystem: 'Placidus' };
const viaApp = calculateChart({ ...birth, ayanamsa: 'kp' });
const viaEngine = calculateChart({ ...birth, ayanamsa: 'Krishnamurti' });
assert.strictEqual(viaApp.positions.Sun.longitude, viaEngine.positions.Sun.longitude);
assert.strictEqual(viaApp.houses.ascendant, viaEngine.houses.ascendant);
assert.strictEqual(viaApp.ayanamsa, 'kp', 'the chart keeps the name it was given');

// every name the form and the settings page offer is accepted, and the ayanamshas differ as they should
for (const name of ['lahiri', 'raman', 'kp', 'true_citra', 'fagan', 'krishnamurti']) {
  assert.ok(calculateChart({ ...birth, ayanamsa: name }).positions.Sun, name);
}
const lahiri = calculateChart({ ...birth, ayanamsa: 'lahiri' }).positions.Sun.longitude;
const fagan = calculateChart({ ...birth, ayanamsa: 'fagan' }).positions.Sun.longitude;
assert.ok(Math.abs(lahiri - fagan) > 0.5, 'Fagan-Bradley and Lahiri are about a degree apart');

// an unknown name still fails loudly
assert.throws(() => calculateChart({ ...birth, ayanamsa: 'nope' }), /Unsupported ayanamsa: nope/);
assert.throws(() => calculateChart({ ...birth, ayanamsa: 'constructor' }), /Unsupported ayanamsa: constructor/);

console.log('test-ayanamsa-names ok');
