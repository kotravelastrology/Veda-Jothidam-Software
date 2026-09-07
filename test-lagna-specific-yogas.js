const assert = require('node:assert/strict');
const { calculateLagnaSpecificYogas, LAGNA_SPECIFIC_YOGAS } = require('./src/chart/lagnaSpecificYogas');

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
    lagna: config.lagna || { longitude: 0, rasiIndex: 0 },
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

// ============ ARIES ASCENDANT (Sign 0) TESTS ============

// Test 1: Aries Wealth 1 - Mars (1st lord/Ascendant) in 10th, Jupiter in 5th
// For Aries: 1st lord = Mars, need Mars in 10th
const chart1 = createMockChart({
  lagna: { longitude: 15, rasiIndex: 0 },  // Aries
  houses: {
    1: [],
    2: [],
    3: [],
    4: [],
    5: ['Jupiter'],  // Jupiter in 5th
    6: [],
    7: [],
    8: [],
    9: [],
    10: ['Mars'],    // Mars (Ascendant lord) in 10th
    11: [],
    12: [],
  },
});
const result1 = calculateLagnaSpecificYogas(chart1);
assert.ok(
  result1.yogas.some(y => y.name === 'Aries Wealth Yoga 1'),
  'Test 1: Aries Wealth Yoga 1'
);
console.log('✓ Test 1: Aries Wealth Yoga 1');

// Test 2: Aries Wealth 2 - Sun in 1st, benefics in 7th
const chart2 = createMockChart({
  lagna: { longitude: 15, rasiIndex: 0 },
  houses: {
    1: ['Sun'],      // Sun in 1st
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: ['Venus'],    // Benefic in 7th
    8: [],
    9: [],
    10: [],
    11: [],
    12: [],
  },
});
const result2 = calculateLagnaSpecificYogas(chart2);
assert.ok(
  result2.yogas.some(y => y.name === 'Aries Wealth Yoga 2'),
  'Test 2: Aries Wealth Yoga 2'
);
console.log('✓ Test 2: Aries Wealth Yoga 2');

// ============ TAURUS ASCENDANT (Sign 1) TESTS ============

// Test 3: Taurus Wealth 1 - Venus in 10th, Jupiter in 4th
const chart3 = createMockChart({
  lagna: { longitude: 45, rasiIndex: 1 },  // Taurus
  houses: {
    1: [],
    2: [],
    3: [],
    4: ['Jupiter'],  // Jupiter in 4th
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: ['Venus'],   // Venus in 10th
    11: [],
    12: [],
  },
});
const result3 = calculateLagnaSpecificYogas(chart3);
assert.ok(
  result3.yogas.some(y => y.name === 'Taurus Wealth Yoga 1'),
  'Test 3: Taurus Wealth Yoga 1'
);
console.log('✓ Test 3: Taurus Wealth Yoga 1');

// Test 4: Taurus Wealth 2 - Mercury in 9th, benefics in 2nd
const chart4 = createMockChart({
  lagna: { longitude: 45, rasiIndex: 1 },
  houses: {
    1: [],
    2: ['Jupiter'],  // Benefic in 2nd
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: ['Mercury'],  // Mercury in 9th
    10: [],
    11: [],
    12: [],
  },
});
const result4 = calculateLagnaSpecificYogas(chart4);
assert.ok(
  result4.yogas.some(y => y.name === 'Taurus Wealth Yoga 2'),
  'Test 4: Taurus Wealth Yoga 2'
);
console.log('✓ Test 4: Taurus Wealth Yoga 2');

// ============ GEMINI ASCENDANT (Sign 2) TESTS ============

// Test 5: Gemini Wealth 1 - Mercury in 10th, Jupiter in 7th
const chart5 = createMockChart({
  lagna: { longitude: 75, rasiIndex: 2 },  // Gemini
  houses: {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: ['Jupiter'],  // Jupiter in 7th
    8: [],
    9: [],
    10: ['Mercury'], // Mercury in 10th
    11: [],
    12: [],
  },
});
const result5 = calculateLagnaSpecificYogas(chart5);
assert.ok(
  result5.yogas.some(y => y.name === 'Gemini Wealth Yoga 1'),
  'Test 5: Gemini Wealth Yoga 1'
);
console.log('✓ Test 5: Gemini Wealth Yoga 1');

// Test 6: Gemini Wealth 2 - Venus in 9th, Sun in 1st
const chart6 = createMockChart({
  lagna: { longitude: 75, rasiIndex: 2 },
  houses: {
    1: ['Sun'],      // Sun in 1st
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: ['Venus'],    // Venus in 9th
    10: [],
    11: [],
    12: [],
  },
});
const result6 = calculateLagnaSpecificYogas(chart6);
assert.ok(
  result6.yogas.some(y => y.name === 'Gemini Wealth Yoga 2'),
  'Test 6: Gemini Wealth Yoga 2'
);
console.log('✓ Test 6: Gemini Wealth Yoga 2');

// ============ CANCER ASCENDANT (Sign 3) TESTS ============

// Test 7: Cancer Wealth 1 - Moon in 10th, Jupiter in 4th
const chart7 = createMockChart({
  lagna: { longitude: 105, rasiIndex: 3 },  // Cancer
  houses: {
    1: [],
    2: [],
    3: [],
    4: ['Jupiter'],  // Jupiter in 4th
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: ['Moon'],    // Moon in 10th
    11: [],
    12: [],
  },
});
const result7 = calculateLagnaSpecificYogas(chart7);
assert.ok(
  result7.yogas.some(y => y.name === 'Cancer Wealth Yoga 1'),
  'Test 7: Cancer Wealth Yoga 1'
);
console.log('✓ Test 7: Cancer Wealth Yoga 1');

// Test 8: Cancer Wealth 2 - Mars in 7th, Saturn in 8th
const chart8 = createMockChart({
  lagna: { longitude: 105, rasiIndex: 3 },
  houses: {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: ['Mars'],     // Mars in 7th
    8: ['Saturn'],   // Saturn in 8th
    9: [],
    10: [],
    11: [],
    12: [],
  },
});
const result8 = calculateLagnaSpecificYogas(chart8);
assert.ok(
  result8.yogas.some(y => y.name === 'Cancer Wealth Yoga 2'),
  'Test 8: Cancer Wealth Yoga 2'
);
console.log('✓ Test 8: Cancer Wealth Yoga 2');

// ============ LEO ASCENDANT (Sign 4) TESTS ============

// Test 9: Leo Wealth 1 - Sun in 10th, benefics in 9th
const chart9 = createMockChart({
  lagna: { longitude: 135, rasiIndex: 4 },  // Leo
  houses: {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: ['Jupiter'],  // Benefic in 9th
    10: ['Sun'],     // Sun in 10th
    11: [],
    12: [],
  },
});
const result9 = calculateLagnaSpecificYogas(chart9);
assert.ok(
  result9.yogas.some(y => y.name === 'Leo Wealth Yoga 1'),
  'Test 9: Leo Wealth Yoga 1'
);
console.log('✓ Test 9: Leo Wealth Yoga 1');

// Test 10: Leo Wealth 2 - Jupiter in 1st, Venus in 5th
const chart10 = createMockChart({
  lagna: { longitude: 135, rasiIndex: 4 },
  houses: {
    1: ['Jupiter'],  // Jupiter in 1st
    2: [],
    3: [],
    4: [],
    5: ['Venus'],    // Venus in 5th
    6: [],
    7: [],
    8: [],
    9: [],
    10: [],
    11: [],
    12: [],
  },
});
const result10 = calculateLagnaSpecificYogas(chart10);
assert.ok(
  result10.yogas.some(y => y.name === 'Leo Wealth Yoga 2'),
  'Test 10: Leo Wealth Yoga 2'
);
console.log('✓ Test 10: Leo Wealth Yoga 2');

// ============ VIRGO ASCENDANT (Sign 5) TESTS ============

// Test 11: Virgo Wealth 1 - Mercury in 10th, Jupiter in 9th
const chart11 = createMockChart({
  lagna: { longitude: 165, rasiIndex: 5 },  // Virgo
  houses: {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: ['Jupiter'],  // Jupiter in 9th
    10: ['Mercury'], // Mercury in 10th
    11: [],
    12: [],
  },
});
const result11 = calculateLagnaSpecificYogas(chart11);
assert.ok(
  result11.yogas.some(y => y.name === 'Virgo Wealth Yoga 1'),
  'Test 11: Virgo Wealth Yoga 1'
);
console.log('✓ Test 11: Virgo Wealth Yoga 1');

// Test 12: Virgo Wealth 2 - Venus in 2nd, Moon in 11th
const chart12 = createMockChart({
  lagna: { longitude: 165, rasiIndex: 5 },
  houses: {
    1: [],
    2: ['Venus'],    // Venus in 2nd
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: [],
    11: ['Moon'],    // Moon in 11th
    12: [],
  },
});
const result12 = calculateLagnaSpecificYogas(chart12);
assert.ok(
  result12.yogas.some(y => y.name === 'Virgo Wealth Yoga 2'),
  'Test 12: Virgo Wealth Yoga 2'
);
console.log('✓ Test 12: Virgo Wealth Yoga 2');

// ============ LIBRA ASCENDANT (Sign 6) TESTS ============

// Test 13: Libra Wealth 1 - Venus in 10th, Jupiter in 9th
const chart13 = createMockChart({
  lagna: { longitude: 195, rasiIndex: 6 },  // Libra
  houses: {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: ['Jupiter'],  // Jupiter in 9th
    10: ['Venus'],   // Venus in 10th
    11: [],
    12: [],
  },
});
const result13 = calculateLagnaSpecificYogas(chart13);
assert.ok(
  result13.yogas.some(y => y.name === 'Libra Wealth Yoga 1'),
  'Test 13: Libra Wealth Yoga 1'
);
console.log('✓ Test 13: Libra Wealth Yoga 1');

// Test 14: Libra Wealth 2 - Mercury in 2nd, Saturn in 10th
const chart14 = createMockChart({
  lagna: { longitude: 195, rasiIndex: 6 },
  houses: {
    1: [],
    2: ['Mercury'],  // Mercury in 2nd
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: ['Saturn'],  // Saturn in 10th
    11: [],
    12: [],
  },
});
const result14 = calculateLagnaSpecificYogas(chart14);
assert.ok(
  result14.yogas.some(y => y.name === 'Libra Wealth Yoga 2'),
  'Test 14: Libra Wealth Yoga 2'
);
console.log('✓ Test 14: Libra Wealth Yoga 2');

// ============ SCORPIO ASCENDANT (Sign 7) TESTS ============

// Test 15: Scorpio Wealth 1 - Mars in 10th, Jupiter in 9th
const chart15 = createMockChart({
  lagna: { longitude: 225, rasiIndex: 7 },  // Scorpio
  houses: {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: ['Jupiter'],  // Jupiter in 9th
    10: ['Mars'],    // Mars in 10th
    11: [],
    12: [],
  },
});
const result15 = calculateLagnaSpecificYogas(chart15);
assert.ok(
  result15.yogas.some(y => y.name === 'Scorpio Wealth Yoga 1'),
  'Test 15: Scorpio Wealth Yoga 1'
);
console.log('✓ Test 15: Scorpio Wealth Yoga 1');

// Test 16: Scorpio Wealth 2 - Saturn in 1st, Jupiter in 4th
const chart16 = createMockChart({
  lagna: { longitude: 225, rasiIndex: 7 },
  houses: {
    1: ['Saturn'],   // Saturn in 1st
    2: [],
    3: [],
    4: ['Jupiter'],  // Jupiter in 4th
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: [],
    11: [],
    12: [],
  },
});
const result16 = calculateLagnaSpecificYogas(chart16);
assert.ok(
  result16.yogas.some(y => y.name === 'Scorpio Wealth Yoga 2'),
  'Test 16: Scorpio Wealth Yoga 2'
);
console.log('✓ Test 16: Scorpio Wealth Yoga 2');

// ============ SAGITTARIUS ASCENDANT (Sign 8) TESTS ============

// Test 17: Sagittarius Wealth 1 - Jupiter in 10th, Venus in 9th
const chart17 = createMockChart({
  lagna: { longitude: 255, rasiIndex: 8 },  // Sagittarius
  houses: {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: ['Venus'],    // Venus in 9th
    10: ['Jupiter'], // Jupiter in 10th
    11: [],
    12: [],
  },
});
const result17 = calculateLagnaSpecificYogas(chart17);
assert.ok(
  result17.yogas.some(y => y.name === 'Sagittarius Wealth Yoga 1'),
  'Test 17: Sagittarius Wealth Yoga 1'
);
console.log('✓ Test 17: Sagittarius Wealth Yoga 1');

// Test 18: Sagittarius Wealth 2 - Mercury in 2nd, Sun in 11th
const chart18 = createMockChart({
  lagna: { longitude: 255, rasiIndex: 8 },
  houses: {
    1: [],
    2: ['Mercury'],  // Mercury in 2nd
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: [],
    11: ['Sun'],     // Sun in 11th
    12: [],
  },
});
const result18 = calculateLagnaSpecificYogas(chart18);
assert.ok(
  result18.yogas.some(y => y.name === 'Sagittarius Wealth Yoga 2'),
  'Test 18: Sagittarius Wealth Yoga 2'
);
console.log('✓ Test 18: Sagittarius Wealth Yoga 2');

// ============ CAPRICORN ASCENDANT (Sign 9) TESTS ============

// Test 19: Capricorn Wealth 1 - Saturn in 10th, Jupiter in 11th
const chart19 = createMockChart({
  lagna: { longitude: 285, rasiIndex: 9 },  // Capricorn
  houses: {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: ['Saturn'],  // Saturn in 10th
    11: ['Jupiter'], // Jupiter in 11th
    12: [],
  },
});
const result19 = calculateLagnaSpecificYogas(chart19);
assert.ok(
  result19.yogas.some(y => y.name === 'Capricorn Wealth Yoga 1'),
  'Test 19: Capricorn Wealth Yoga 1'
);
console.log('✓ Test 19: Capricorn Wealth Yoga 1');

// Test 20: Capricorn Wealth 2 - Venus in 2nd, Moon in 9th
const chart20 = createMockChart({
  lagna: { longitude: 285, rasiIndex: 9 },
  houses: {
    1: [],
    2: ['Venus'],    // Venus in 2nd
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: ['Moon'],     // Moon in 9th
    10: [],
    11: [],
    12: [],
  },
});
const result20 = calculateLagnaSpecificYogas(chart20);
assert.ok(
  result20.yogas.some(y => y.name === 'Capricorn Wealth Yoga 2'),
  'Test 20: Capricorn Wealth Yoga 2'
);
console.log('✓ Test 20: Capricorn Wealth Yoga 2');

// ============ AQUARIUS ASCENDANT (Sign 10) TESTS ============

// Test 21: Aquarius Wealth 1 - Saturn in 10th, benefics in 9th
const chart21 = createMockChart({
  lagna: { longitude: 315, rasiIndex: 10 },  // Aquarius
  houses: {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: ['Jupiter'],  // Benefic in 9th
    10: ['Saturn'],  // Saturn in 10th
    11: [],
    12: [],
  },
});
const result21 = calculateLagnaSpecificYogas(chart21);
assert.ok(
  result21.yogas.some(y => y.name === 'Aquarius Wealth Yoga 1'),
  'Test 21: Aquarius Wealth Yoga 1'
);
console.log('✓ Test 21: Aquarius Wealth Yoga 1');

// Test 22: Aquarius Wealth 2 - Mercury in 2nd, Jupiter in 5th
const chart22 = createMockChart({
  lagna: { longitude: 315, rasiIndex: 10 },
  houses: {
    1: [],
    2: ['Mercury'],  // Mercury in 2nd
    3: [],
    4: [],
    5: ['Jupiter'],  // Jupiter in 5th
    6: [],
    7: [],
    8: [],
    9: [],
    10: [],
    11: [],
    12: [],
  },
});
const result22 = calculateLagnaSpecificYogas(chart22);
assert.ok(
  result22.yogas.some(y => y.name === 'Aquarius Wealth Yoga 2'),
  'Test 22: Aquarius Wealth Yoga 2'
);
console.log('✓ Test 22: Aquarius Wealth Yoga 2');

// ============ PISCES ASCENDANT (Sign 11) TESTS ============

// Test 23: Pisces Wealth 1 - Jupiter in 10th, benefics in 9th
const chart23 = createMockChart({
  lagna: { longitude: 345, rasiIndex: 11 },  // Pisces
  houses: {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: ['Venus'],    // Benefic in 9th
    10: ['Jupiter'], // Jupiter in 10th
    11: [],
    12: [],
  },
});
const result23 = calculateLagnaSpecificYogas(chart23);
assert.ok(
  result23.yogas.some(y => y.name === 'Pisces Wealth Yoga 1'),
  'Test 23: Pisces Wealth Yoga 1'
);
console.log('✓ Test 23: Pisces Wealth Yoga 1');

// Test 24: Pisces Wealth 2 - Venus in 2nd, Moon in 11th
const chart24 = createMockChart({
  lagna: { longitude: 345, rasiIndex: 11 },
  houses: {
    1: [],
    2: ['Venus'],    // Venus in 2nd
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: [],
    11: ['Moon'],    // Moon in 11th
    12: [],
  },
});
const result24 = calculateLagnaSpecificYogas(chart24);
assert.ok(
  result24.yogas.some(y => y.name === 'Pisces Wealth Yoga 2'),
  'Test 24: Pisces Wealth Yoga 2'
);
console.log('✓ Test 24: Pisces Wealth Yoga 2');

// ============ ADDITIONAL TESTS ============

// Test 25: Source attribution
const chart25 = createMockChart({ lagna: { longitude: 15, rasiIndex: 0 } });
const result25 = calculateLagnaSpecificYogas(chart25);
assert.ok(result25.source, 'Test 25: Source attribution present');
assert.ok(result25.source.convention.includes('Ch.41'), 'Should cite BPHS Chapter 41');
console.log('✓ Test 25: Source attribution');

// Test 26: Error handling - invalid lagna
const invalidChart = {
  planetPositions: { Sun: 0, Moon: 60, Mercury: 30, Venus: 45, Mars: 90, Jupiter: 120, Saturn: 150 },
  lagna: null,
  houses: { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [] },
};
const result26 = calculateLagnaSpecificYogas(invalidChart);
assert.equal(result26.yogas.length, 0, 'Test 26: Handles invalid lagna gracefully');
console.log('✓ Test 26: Error handling');

// Test 27: All 24 yogas have metadata
let metadataOk = 0;
for (const sign in LAGNA_SPECIFIC_YOGAS) {
  for (const yoga of LAGNA_SPECIFIC_YOGAS[sign]) {
    assert.ok(yoga.name, `Yoga has name`);
    assert.ok(yoga.lagna, `Yoga has lagna`);
    assert.ok(yoga.chapter, `Yoga has chapter`);
    assert.ok(yoga.formation_rule, `Yoga has formation_rule`);
    assert.ok(yoga.effects, `Yoga has effects`);
    assert.ok(yoga.severity, `Yoga has severity`);
    assert.ok(typeof yoga.detection === 'function', `Yoga has detection function`);
    metadataOk++;
  }
}
console.log(`✓ Test 27: All ${metadataOk} yogas have complete metadata`);

// Summary
console.log('\n' + '='.repeat(60));
console.log('✅ ALL LAGNA-SPECIFIC YOGA TESTS PASSED (27 test cases, 100% pass rate)');
console.log('='.repeat(60));
console.log(`Total Yogas Implemented: ${metadataOk}`);
console.log('2 yogas per Lagna × 12 Lagnas = 24 total yogas');
console.log('='.repeat(60));
