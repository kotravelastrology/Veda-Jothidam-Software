const assert = require('node:assert/strict');
const { calculateDoshas, DOSHAS_CATALOG } = require('./src/chart/doshas');

// Mock chart helper
function createMockChart(config = {}) {
  return {
    planetPositions: config.planetPositions || {
      Sun: 0,
      Moon: 60,
      Mercury: 30,
      Venus: 45,
      Mars: 90,
      Jupiter: 120,
      Saturn: 150,
    },
    houses: config.houses || {
      1: ['Sun'],
      2: ['Moon'],
      3: ['Mercury'],
      4: ['Venus'],
      5: ['Mars'],
      6: [],
      7: ['Jupiter'],
      8: [],
      9: ['Saturn'],
      10: [],
      11: [],
      12: [],
    },
  };
}

// ============ DOSHA TESTS ============

// Test 1: Pitra Dosha - Sun in 8th house
const chart1 = createMockChart({
  houses: {
    1: ['Moon'],
    2: [],
    3: [],
    4: ['Venus'],
    5: ['Mars'],
    6: [],
    7: ['Jupiter'],
    8: ['Sun'],  // Sun in 8th = Pitra Dosha
    9: [],
    10: [],
    11: [],
    12: [],
  },
});
const result1 = calculateDoshas(chart1);
assert.ok(
  result1.doshas.some(d => d.doshaKey === 'PITRA_DOSHA'),
  'Test 1: Pitra Dosha (Sun in 8th)'
);
console.log('✓ Test 1: Pitra Dosha');

// Test 2: Matri Dosha - Moon in 12th house
const chart2 = createMockChart({
  houses: {
    1: ['Sun'],
    2: [],
    3: ['Mercury'],
    4: ['Venus'],
    5: ['Mars'],
    6: [],
    7: ['Jupiter'],
    8: [],
    9: [],
    10: [],
    11: [],
    12: ['Moon'],  // Moon in 12th = Matri Dosha
  },
});
const result2 = calculateDoshas(chart2);
assert.ok(
  result2.doshas.some(d => d.doshaKey === 'MATRI_DOSHA'),
  'Test 2: Matri Dosha (Moon in 12th)'
);
console.log('✓ Test 2: Matri Dosha');

// Test 3: Sarpa Dosha - 5th house with 2 malefics
const chart3 = createMockChart({
  houses: {
    1: [],
    2: [],
    3: [],
    4: ['Venus'],
    5: ['Sun', 'Mars'],  // 2 malefics in 5th = Sarpa Dosha
    6: [],
    7: ['Jupiter'],
    8: [],
    9: [],
    10: [],
    11: [],
    12: ['Moon'],
  },
});
const result3 = calculateDoshas(chart3);
assert.ok(
  result3.doshas.some(d => d.doshaKey === 'SARPA_DOSHA'),
  'Test 3: Sarpa Dosha (malefics in 5th)'
);
console.log('✓ Test 3: Sarpa Dosha');

// Test 4: Kalakarma Dosha - Venus in 6th house
const chart4 = createMockChart({
  houses: {
    1: ['Sun'],
    2: [],
    3: ['Mercury'],
    4: [],
    5: ['Mars'],
    6: ['Venus'],  // Venus in 6th = Kalakarma Dosha
    7: [],
    8: [],
    9: ['Saturn'],
    10: [],
    11: [],
    12: [],
  },
});
const result4 = calculateDoshas(chart4);
assert.ok(
  result4.doshas.some(d => d.doshaKey === 'KALAKARMA_DOSHA'),
  'Test 4: Kalakarma Dosha (Venus in 6th)'
);
console.log('✓ Test 4: Kalakarma Dosha');

// Test 5: Bhuta Dosha - Saturn in 8th house
const chart5 = createMockChart({
  houses: {
    1: ['Sun'],
    2: [],
    3: [],
    4: ['Venus'],
    5: [],
    6: [],
    7: ['Jupiter'],
    8: ['Saturn'],  // Saturn in 8th = Bhuta Dosha
    9: [],
    10: [],
    11: [],
    12: [],
  },
});
const result5 = calculateDoshas(chart5);
assert.ok(
  result5.doshas.some(d => d.doshaKey === 'BHUTA_DOSHA'),
  'Test 5: Bhuta Dosha (Saturn in 8th)'
);
console.log('✓ Test 5: Bhuta Dosha');

// Test 6: Bhrata Dosha - Mars in 12th house
const chart6 = createMockChart({
  houses: {
    1: ['Sun'],
    2: [],
    3: [],
    4: ['Venus'],
    5: [],
    6: [],
    7: ['Jupiter'],
    8: [],
    9: [],
    10: [],
    11: [],
    12: ['Mars'],  // Mars in 12th = Bhrata Dosha
  },
});
const result6 = calculateDoshas(chart6);
assert.ok(
  result6.doshas.some(d => d.doshaKey === 'BHRATA_DOSHA'),
  'Test 6: Bhrata Dosha (Mars in 12th)'
);
console.log('✓ Test 6: Bhrata Dosha');

// Test 7: Matula Dosha - Mercury in 6th house
const chart7 = createMockChart({
  houses: {
    1: ['Sun'],
    2: [],
    3: [],
    4: ['Venus'],
    5: [],
    6: ['Mercury'],  // Mercury in 6th = Matula Dosha
    7: ['Jupiter'],
    8: [],
    9: [],
    10: [],
    11: [],
    12: [],
  },
});
const result7 = calculateDoshas(chart7);
assert.ok(
  result7.doshas.some(d => d.doshaKey === 'MATULA_DOSHA'),
  'Test 7: Matula Dosha (Mercury in 6th)'
);
console.log('✓ Test 7: Matula Dosha');

// Test 8: Brahmanda Dosha - Jupiter in 8th house
const chart8 = createMockChart({
  houses: {
    1: ['Sun'],
    2: [],
    3: ['Mercury'],
    4: ['Venus'],
    5: [],
    6: [],
    7: [],
    8: ['Jupiter'],  // Jupiter in 8th = Brahmanda Dosha
    9: [],
    10: [],
    11: [],
    12: [],
  },
});
const result8 = calculateDoshas(chart8);
assert.ok(
  result8.doshas.some(d => d.doshaKey === 'BRAHMANDA_DOSHA'),
  'Test 8: Brahmanda Dosha (Jupiter in 8th)'
);
console.log('✓ Test 8: Brahmanda Dosha');

// Test 9: Source attribution
const chart9 = createMockChart();
const result9 = calculateDoshas(chart9);
assert.ok(result9.source, 'Test 9: Source attribution present');
assert.ok(result9.source.convention.includes('83'), 'Should cite BPHS Chapter 83');
console.log('✓ Test 9: Source attribution');

// Test 10: Multiple doshas in single chart
const chart10 = createMockChart({
  houses: {
    1: [],
    2: [],
    3: [],
    4: [],
    5: ['Sun', 'Mars'],  // Sarpa
    6: ['Venus'],        // Kalakarma
    7: [],
    8: ['Jupiter', 'Saturn'],  // Brahmanda + Bhuta
    9: [],
    10: [],
    11: [],
    12: ['Moon'],        // Matri
  },
});
const result10 = calculateDoshas(chart10);
assert.ok(
  result10.doshas.length >= 3,
  'Test 10: Multiple doshas detected'
);
console.log(`✓ Test 10: Multiple doshas (${result10.doshas.length} detected)`);

// Test 11: Error handling (invalid chart)
const invalidChart = {
  planetPositions: null,
  houses: null,
};
const result11 = calculateDoshas(invalidChart);
assert.equal(result11.doshas.length, 0, 'Test 11: Handles invalid chart gracefully');
console.log('✓ Test 11: Error handling');

// Test 12: All doshas have metadata
let metadataOk = 0;
Object.entries(DOSHAS_CATALOG).forEach(([key, dosha]) => {
  assert.ok(dosha.name, `${key} has name`);
  assert.ok(dosha.chapter, `${key} has chapter`);
  assert.ok(dosha.formation_rule, `${key} has formation_rule`);
  assert.ok(dosha.effects, `${key} has effects`);
  assert.ok(dosha.severity, `${key} has severity`);
  assert.ok(dosha.remedies, `${key} has remedies`);
  assert.ok(typeof dosha.detection === 'function', `${key} has detection function`);
  metadataOk++;
});
console.log(`✓ Test 12: All ${metadataOk} doshas have complete metadata`);

// Summary
console.log('\n' + '='.repeat(60));
console.log('✅ ALL DOSHA TESTS PASSED (12 test cases, 100% pass rate)');
console.log('='.repeat(60));
console.log(`Total Doshas Implemented: ${Object.keys(DOSHAS_CATALOG).length}`);
console.log('Pitra, Matri, Sarpa, Kalakarma');
console.log('Bhuta, Bhrata, Matula, Brahmanda');
console.log('='.repeat(60));
