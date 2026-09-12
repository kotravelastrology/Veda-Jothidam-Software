const assert = require('node:assert/strict');
const { calculateBhavaChakra, BHAVA_HOUSES } = require('./src/chart/bhavaChakra');

// --- Bhava definitions sanity ---
assert.ok(BHAVA_HOUSES.length === 12, '12 houses defined');

const bhava1 = BHAVA_HOUSES.find(b => b.number === 1);
assert.ok(bhava1, 'Bhava 1 (Self) exists');
assert.equal(bhava1.name, 'Lagna (Self)', 'Bhava 1 named correctly');
assert.equal(bhava1.domainEn, 'Self, personality, body', 'Bhava 1 domain correct');

const bhava10 = BHAVA_HOUSES.find(b => b.number === 10);
assert.ok(bhava10, 'Bhava 10 (Karma) exists');
assert.equal(bhava10.name, 'Karma (Profession)', 'Bhava 10 named correctly');

// --- House strength calculation ---
// Strength from: planets in house, aspects on house, ruler strength
const grahas = {
  Sun: { longitude: 10, house: 1 },
  Moon: { longitude: 40, house: 2 },
  Mars: { longitude: 225, house: 8 },
  Mercury: { longitude: 10, house: 1 },
  Jupiter: { longitude: 100, house: 4 },
  Venus: { longitude: 40, house: 2 },
  Saturn: { longitude: 280, house: 10 },
  Rahu: { longitude: 60, house: 3 },
  Ketu: { longitude: 240, house: 9 }
};

const bhavaData = calculateBhavaChakra(grahas);

assert.ok(bhavaData, 'Bhava Chakra data calculated');
assert.ok(bhavaData.houses, 'Houses array exists');
assert.equal(bhavaData.houses.length, 12, 'All 12 houses calculated');

// Verify house 1 (with Sun and Mercury)
const h1 = bhavaData.houses[0];
assert.equal(h1.number, 1, 'House 1 number correct');
assert.ok(h1.strength >= 0 && h1.strength <= 100, 'House 1 strength 0-100');
assert.ok(Array.isArray(h1.planetsHere), 'House 1 planets array exists');
assert.ok(h1.planetsHere.length > 0, 'House 1 has planets');

// Verify house 10 (with Saturn)
const h10 = bhavaData.houses[9];
assert.equal(h10.number, 10, 'House 10 number correct');
assert.ok(h10.strength >= 0 && h10.strength <= 100, 'House 10 strength 0-100');

// --- Planetary placements in houses ---
assert.ok(bhavaData.planetaryPlacements, 'Planetary placements object exists');
assert.ok(bhavaData.planetaryPlacements.Sun, 'Sun placement exists');
assert.equal(bhavaData.planetaryPlacements.Sun.house, 1, 'Sun in house 1');
assert.equal(bhavaData.planetaryPlacements.Mars.house, 8, 'Mars (225°) in house 8');
assert.equal(bhavaData.planetaryPlacements.Saturn.house, 10, 'Saturn in house 10');

// --- House relationships (trine, square, opposition) ---
assert.ok(bhavaData.houseRelationships, 'House relationships exist');
const trines1 = bhavaData.houseRelationships.filter(r => r.from === 1 && r.type === 'trine');
assert.ok(trines1.length > 0, 'House 1 has trine relationships');

const opposites1 = bhavaData.houseRelationships.filter(r => r.from === 1 && r.type === 'opposition');
assert.equal(opposites1.length, 1, 'House 1 has 1 opposition (to house 7)');

// --- Verify all houses have strength ---
for (let i = 0; i < 12; i++) {
  const h = bhavaData.houses[i];
  assert.ok(typeof h.strength === 'number', `House ${i + 1} has numeric strength`);
  assert.ok(h.strength >= 0 && h.strength <= 100, `House ${i + 1} strength 0-100`);
}

console.log(JSON.stringify({
  pass: true,
  bhavaCount: bhavaData.houses.length,
  housesWithPlanets: bhavaData.houses.filter(h => h.planetsHere.length > 0).length,
  averageHouseStrength: (bhavaData.houses.reduce((sum, h) => sum + h.strength, 0) / 12).toFixed(1),
  house1Strength: h1.strength.toFixed(1),
  house10Strength: h10.strength.toFixed(1)
}, null, 2));
