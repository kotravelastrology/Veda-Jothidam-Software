const assert = require('node:assert/strict');
const { calculateElementalChakra, ELEMENT_MAP, ELEMENT_COMPATIBILITY } = require('./src/chart/elementalChakra');

// --- Element definitions ---
assert.ok(ELEMENT_MAP, 'ELEMENT_MAP exists');
assert.equal(Object.keys(ELEMENT_MAP).length, 9, '9 grahas mapped to elements');

// Verify individual graha elements
assert.equal(ELEMENT_MAP.Sun, 'Fire', 'Sun is Fire');
assert.equal(ELEMENT_MAP.Moon, 'Water', 'Moon is Water');
assert.equal(ELEMENT_MAP.Mars, 'Fire', 'Mars is Fire');
assert.equal(ELEMENT_MAP.Mercury, 'Air', 'Mercury is Air');
assert.equal(ELEMENT_MAP.Jupiter, 'Fire', 'Jupiter is Fire');
assert.equal(ELEMENT_MAP.Venus, 'Earth', 'Venus is Earth');
assert.equal(ELEMENT_MAP.Saturn, 'Earth', 'Saturn is Earth');
assert.equal(ELEMENT_MAP.Rahu, 'Air', 'Rahu is Air');
assert.equal(ELEMENT_MAP.Ketu, 'Water', 'Ketu is Water');

// --- Element compatibility matrix ---
assert.ok(ELEMENT_COMPATIBILITY, 'ELEMENT_COMPATIBILITY exists');
assert.ok(ELEMENT_COMPATIBILITY.Fire, 'Fire compatibility exists');
assert.ok(ELEMENT_COMPATIBILITY.Water, 'Water compatibility exists');

// Fire & Fire = same element (harmonious)
assert.ok(ELEMENT_COMPATIBILITY.Fire.Fire > 0, 'Same element compatible');
// Fire & Water = opposing (incompatible)
assert.ok(ELEMENT_COMPATIBILITY.Fire.Water < 0, 'Opposing elements incompatible');

// --- Elemental Chakra calculation ---
const grahas = {
  Sun: { longitude: 10 },
  Moon: { longitude: 40 },
  Mars: { longitude: 225 },
  Mercury: { longitude: 10 },
  Jupiter: { longitude: 100 },
  Venus: { longitude: 40 },
  Saturn: { longitude: 280 },
  Rahu: { longitude: 60 },
  Ketu: { longitude: 240 }
};

const chakra = calculateElementalChakra(grahas);

// Basic structure
assert.ok(chakra, 'Chakra data calculated');
assert.ok(chakra.elementalPairs, 'Elemental pairs exist');
assert.ok(chakra.compatibilityMatrix, 'Compatibility matrix exists');
assert.ok(chakra.elementalStrength, 'Element strength scores exist');
assert.ok(chakra.harmonies, 'Harmony groups exist');
assert.ok(chakra.conflicts, 'Conflict groups exist');

// Verify pairs
assert.ok(Array.isArray(chakra.elementalPairs), 'Pairs is array');
assert.ok(chakra.elementalPairs.length > 0, 'Has graha pairs');

// Verify pairs have required fields
const firstPair = chakra.elementalPairs[0];
assert.ok(firstPair.graha1, 'Pair has graha1');
assert.ok(firstPair.graha2, 'Pair has graha2');
assert.ok(firstPair.element1, 'Pair has element1');
assert.ok(firstPair.element2, 'Pair has element2');
assert.ok(typeof firstPair.compatibility !== 'undefined', 'Pair has compatibility score');

// Verify matrix (4x4 for 4 elements)
assert.equal(Object.keys(chakra.compatibilityMatrix).length, 4, 'Matrix has 4 elements');
assert.ok(chakra.compatibilityMatrix.Fire, 'Matrix has Fire row');
assert.ok(chakra.compatibilityMatrix.Fire.Fire !== undefined, 'Matrix has Fire-Fire cell');

// Verify element strength (0-100 scale)
for (const [element, strength] of Object.entries(chakra.elementalStrength)) {
  assert.ok(typeof strength === 'number', `${element} has numeric strength`);
  assert.ok(strength >= 0 && strength <= 100, `${element} strength 0-100`);
}

// Verify harmonies (same element or compatible pairs)
assert.ok(Array.isArray(chakra.harmonies), 'Harmonies is array');
for (const h of chakra.harmonies) {
  assert.ok(h.graha1, 'Harmony has graha1');
  assert.ok(h.graha2, 'Harmony has graha2');
}

// Verify conflicts (opposing elements)
assert.ok(Array.isArray(chakra.conflicts), 'Conflicts is array');
for (const c of chakra.conflicts) {
  assert.ok(c.graha1, 'Conflict has graha1');
  assert.ok(c.graha2, 'Conflict has graha2');
}

// Verify counts (Fire, Earth, Air, Water distribution)
assert.ok(chakra.elementCounts, 'Element counts exist');
assert.ok(chakra.elementCounts.Fire !== undefined, 'Fire count exists');
assert.ok(chakra.elementCounts.Water !== undefined, 'Water count exists');

// Verify source
assert.ok(chakra.source, 'Source exists');
assert.ok(chakra.source.title, 'Source has title');

console.log(JSON.stringify({
  pass: true,
  totalPairs: chakra.elementalPairs.length,
  harmonies: chakra.harmonies.length,
  conflicts: chakra.conflicts.length,
  elementCounts: chakra.elementCounts,
  elementalStrength: chakra.elementalStrength,
  fireFireCompatibility: chakra.compatibilityMatrix.Fire.Fire,
  fireWaterCompatibility: chakra.compatibilityMatrix.Fire.Water
}, null, 2));
