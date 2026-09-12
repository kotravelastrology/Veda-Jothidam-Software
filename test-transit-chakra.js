const assert = require('node:assert/strict');
const { calculateTransitChakra, TRANSIT_ASPECTS } = require('./src/chart/transitChakra');

// --- Transit aspects definition ---
assert.ok(TRANSIT_ASPECTS, 'TRANSIT_ASPECTS exists');
assert.ok(TRANSIT_ASPECTS.conjunction !== undefined, 'Conjunction aspect exists');
assert.ok(TRANSIT_ASPECTS.opposition !== undefined, 'Opposition aspect exists');
assert.ok(TRANSIT_ASPECTS.trine !== undefined, 'Trine aspect exists');
assert.ok(TRANSIT_ASPECTS.square !== undefined, 'Square aspect exists');

// Verify aspect orbs (tolerance in degrees)
assert.ok(TRANSIT_ASPECTS.conjunction.orb > 0, 'Conjunction has positive orb');
assert.ok(TRANSIT_ASPECTS.opposition.orb > 0, 'Opposition has positive orb');

// --- Transit Chakra calculation ---
const natalGrahas = {
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

const transitGrahas = {
  Sun: { longitude: 15 },
  Moon: { longitude: 35 },
  Mars: { longitude: 230 },
  Mercury: { longitude: 12 },
  Jupiter: { longitude: 105 },
  Venus: { longitude: 38 },
  Saturn: { longitude: 282 },
  Rahu: { longitude: 62 },
  Ketu: { longitude: 242 }
};

const chakra = calculateTransitChakra(natalGrahas, transitGrahas);

// Basic structure
assert.ok(chakra, 'Chakra data calculated');
assert.ok(chakra.transitPositions, 'Transit positions exist');
assert.ok(chakra.transitHouses, 'Transit houses exist');
assert.ok(chakra.natalPositions, 'Natal positions stored');
assert.ok(chakra.transits, 'Transits array exists');
assert.ok(chakra.aspects, 'Aspects array exists');

// Verify transit positions
assert.equal(Object.keys(chakra.transitPositions).length, 9, 'All 9 grahas in transit positions');
for (const planet of Object.keys(transitGrahas)) {
  assert.ok(chakra.transitPositions[planet], `${planet} transit position exists`);
  assert.ok(chakra.transitPositions[planet].longitude !== undefined, `${planet} has longitude`);
  assert.ok(chakra.transitPositions[planet].house !== undefined, `${planet} has house`);
  assert.ok(chakra.transitPositions[planet].movement !== undefined, `${planet} has movement`);
}

// Verify house calculations (transit)
assert.ok(chakra.transitHouses.length > 0, 'Transit houses calculated');

// Verify natal positions stored
assert.ok(chakra.natalPositions.Sun, 'Natal Sun stored');
assert.equal(chakra.natalPositions.Sun.longitude, 10, 'Natal Sun longitude correct');

// Verify transits (movement of transit planets)
assert.ok(Array.isArray(chakra.transits), 'Transits is array');
for (const t of chakra.transits) {
  assert.ok(t.planet, 'Transit has planet name');
  assert.ok(t.natalLongitude !== undefined, 'Transit has natal longitude');
  assert.ok(t.transitLongitude !== undefined, 'Transit has transit longitude');
  assert.ok(t.movement !== undefined, 'Transit has movement distance');
  assert.ok(t.direction !== undefined, 'Transit has direction (direct/retrograde)');
}

// Verify aspects (transits to natal)
assert.ok(Array.isArray(chakra.aspects), 'Aspects is array');
for (const aspect of chakra.aspects) {
  assert.ok(aspect.transitPlanet, 'Aspect has transit planet');
  assert.ok(aspect.natalPlanet, 'Aspect has natal planet');
  assert.ok(aspect.aspectType, 'Aspect has type');
  assert.ok(typeof aspect.orb !== 'undefined', 'Aspect has orb value');
  assert.ok(aspect.influence !== undefined, 'Aspect has influence');
}

// Verify source
assert.ok(chakra.source, 'Source exists');
assert.ok(chakra.source.title, 'Source has title');
assert.ok(chakra.generatedAt, 'Generated timestamp exists');

console.log(JSON.stringify({
  pass: true,
  transitPlanets: Object.keys(chakra.transitPositions).length,
  totalTransits: chakra.transits.length,
  totalAspects: chakra.aspects.length,
  aspects: chakra.aspects.map(a => `${a.transitPlanet} ${a.aspectType} ${a.natalPlanet}`).slice(0, 5),
  natalSun: chakra.natalPositions.Sun.longitude,
  transitSun: chakra.transitPositions.Sun.longitude
}, null, 2));
