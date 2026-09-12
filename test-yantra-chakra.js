const assert = require('node:assert/strict');
const { YANTRA_ZONES, yantrazoneOf, calculateYantraChakra } = require('./src/chart/yantras');

// --- Yantra zone sanity ---
// Yantra Chakra: 9-zone symbolic grid (center + 8 directions)
// Classical arrangement: Brahma (center) surrounded by 8 cardinal/ordinal zones
assert.equal(YANTRA_ZONES.length, 9, 'yantra has 9 zones (center + 8 directions)');

// Verify zone classification
const center = yantrazoneOf('Brahma');
assert.ok(center.zoneType, 'Center (Brahma) has a zone type');
assert.equal(center.zoneType, 'Center', 'Brahma is the center zone');
assert.ok(center.element, 'Center zone has an element');

const east = yantrazoneOf('Indra');
assert.ok(east.zoneType, 'East (Indra) has a zone type');
assert.equal(east.zoneType, 'Cardinal', 'Indra is a cardinal zone');

const northeast = yantrazoneOf('Rudra');
assert.ok(northeast.zoneType, 'NE (Rudra) has a zone type');
assert.equal(northeast.zoneType, 'Ordinal', 'Rudra is an ordinal zone');

// Verify all zones have strength modifiers (geometric positioning strength)
for (const zone of YANTRA_ZONES) {
  const z = yantrazoneOf(zone.name);
  assert.ok(z.strength !== undefined, `${zone.name} has strength modifier`);
  assert.ok(z.strength >= 0 && z.strength <= 100, `${zone.name} strength is 0-100`);
}

// --- Natal application ---
// 9 grahas positioned in yantra zones by nakshatra/rashi
// Test that Yantra Chakra calculates zone placements and strengths
const result = calculateYantraChakra(
  {
    Sun: 10, Moon: 40, Mars: 206, Mercury: 10, Jupiter: 100, Venus: 40, Saturn: 280, Rahu: 60, Ketu: 240,
  },
  15 // Lagna in Aries
);

assert.ok(result.zones, 'Yantra Chakra zones are generated');
assert.equal(result.zones.length, 9, 'yantra has 9 zones');
assert.ok(result.grahaPlacements, 'graha zone placements are provided');
assert.ok(result.zoneStrengths, 'zone strength calculations are provided');
assert.ok(result.source.title, 'source attribution present');

// Verify each zone has occupants and strength data
for (const zone of result.zones) {
  assert.ok(zone.name, `zone ${zone.name} exists`);
  assert.ok(zone.element !== undefined, `zone has element`);
  assert.ok(zone.strength >= 0, 'zone has valid strength');
}

// Verify grahas are assigned to zones
let totalGrahasPlaced = 0;
for (const placements of Object.values(result.grahaPlacements)) {
  if (Array.isArray(placements)) {
    totalGrahasPlaced += placements.length;
  }
}
assert.ok(totalGrahasPlaced > 0, 'at least one graha is placed in a zone');

console.log(JSON.stringify({
  pass: true,
  zoneCount: YANTRA_ZONES.length,
  zoneTypes: {
    center: yantrazoneOf('Brahma').zoneType,
    cardinal: yantrazoneOf('Indra').zoneType,
    ordinal: yantrazoneOf('Rudra').zoneType
  },
  zoneStrengths: {
    brahma: yantrazoneOf('Brahma').strength,
    indra: yantrazoneOf('Indra').strength,
    rudra: yantrazoneOf('Rudra').strength,
    varuna: yantrazoneOf('Varuna').strength
  },
  totalZones: result.zones.length,
  grahaPlacements: Object.keys(result.grahaPlacements).length
}, null, 2));
