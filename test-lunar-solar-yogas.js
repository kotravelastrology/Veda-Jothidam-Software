const assert = require('node:assert/strict');
const { calculateLunarSolarYogas, LUNAR_SOLAR_YOGAS_CATALOG } = require('./src/chart/lunarSolarYogas');

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

// ============ LUNAR YOGA TESTS ============

// Test 1: Sunapha Yoga - benefic in 2nd from Moon
const chart1 = createMockChart({
  planetPositions: {
    Sun: 0,
    Moon: 60,      // Moon in 2nd house
    Mercury: 90,   // Mercury (benefic) in 3rd house = 2nd from Moon
    Venus: 45,
    Mars: 150,
    Jupiter: 120,
    Saturn: 180,
  },
  houses: {
    1: ['Sun'],
    2: ['Moon'],
    3: ['Mercury'],  // Mercury in 2nd from Moon
    4: ['Venus'],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: ['Mars'],
    11: ['Jupiter'],
    12: ['Saturn'],
  },
});
const result1 = calculateLunarSolarYogas(chart1);
assert.ok(
  result1.yogas.some(y => y.yogaKey === 'SUNAPHA_YOGA'),
  'Test 1: Sunapha Yoga (benefic in 2nd from Moon)'
);
console.log('✓ Test 1: Sunapha Yoga');

// Test 2: Anapha Yoga - benefic in 12th from Moon
const chart2 = createMockChart({
  houses: {
    1: ['Moon'],    // Moon in 1st
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: [],
    11: [],
    12: ['Venus'],  // Venus (benefic) in 12th = 12th from Moon in 1st
  },
});
const result2 = calculateLunarSolarYogas(chart2);
assert.ok(
  result2.yogas.some(y => y.yogaKey === 'ANAPHA_YOGA'),
  'Test 2: Anapha Yoga (benefic in 12th from Moon)'
);
console.log('✓ Test 2: Anapha Yoga');

// Test 3: Duradhara Yoga - benefics in 2nd AND 12th from Moon
const chart3 = createMockChart({
  houses: {
    1: ['Moon'],
    2: ['Venus'],   // Benefic in 2nd from Moon
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: [],
    11: [],
    12: ['Mercury'], // Benefic in 12th from Moon
  },
});
const result3 = calculateLunarSolarYogas(chart3);
assert.ok(
  result3.yogas.some(y => y.yogaKey === 'DURADHARA_YOGA'),
  'Test 3: Duradhara Yoga (benefics 2nd AND 12th from Moon)'
);
console.log('✓ Test 3: Duradhara Yoga');

// Test 4: Kemadruma Yoga - no benefics 2nd/12th from Moon
const chart4 = createMockChart({
  planetPositions: {
    Sun: 0,
    Moon: 60,       // Moon in house 2
    Mercury: 0,     // Mercury not in benefic position
    Venus: 180,
    Mars: 90,
    Jupiter: 120,
    Saturn: 150,
  },
  houses: {
    1: [],
    2: ['Moon'],
    3: [],          // No benefic in 2nd from Moon
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: [],
    11: [],
    12: [],         // No benefic in 12th from Moon
  },
});
const result4 = calculateLunarSolarYogas(chart4);
assert.ok(
  result4.yogas.some(y => y.yogaKey === 'KEMADRUMA_YOGA'),
  'Test 4: Kemadruma Yoga (no benefics 2nd/12th from Moon)'
);
console.log('✓ Test 4: Kemadruma Yoga');

// Test 5: Dhana Yoga - benefics in 2nd and 11th houses
const chart5 = createMockChart({
  houses: {
    1: [],
    2: ['Mercury'],  // Benefic in 2nd
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: [],
    11: ['Venus'],   // Benefic in 11th
    12: [],
  },
});
const result5 = calculateLunarSolarYogas(chart5);
assert.ok(
  result5.yogas.some(y => y.yogaKey === 'DHANA_YOGA'),
  'Test 5: Dhana Yoga (2nd and 11th lords in angles)'
);
console.log('✓ Test 5: Dhana Yoga');

// Test 6: Adhi Yoga - benefic in 6th/7th/8th from Moon
const chart6 = createMockChart({
  houses: {
    1: ['Moon'],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: ['Venus'],   // Benefic in 7th from Moon (house 7)
    8: [],
    9: [],
    10: [],
    11: [],
    12: [],
  },
});
const result6 = calculateLunarSolarYogas(chart6);
assert.ok(
  result6.yogas.some(y => y.yogaKey === 'ADHI_YOGA'),
  'Test 6: Adhi Yoga (benefic in 6/7/8 from Moon)'
);
console.log('✓ Test 6: Adhi Yoga');

// ============ SOLAR YOGA TESTS ============

// Test 7: Vesi Yoga - benefic in 12th from Sun
const chart7 = createMockChart({
  houses: {
    1: ['Sun'],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: [],
    11: [],
    12: ['Mercury'],  // Benefic in 12th from Sun in 1st
  },
});
const result7 = calculateLunarSolarYogas(chart7);
assert.ok(
  result7.yogas.some(y => y.yogaKey === 'VESI_YOGA'),
  'Test 7: Vesi Yoga (benefic in 12th from Sun)'
);
console.log('✓ Test 7: Vesi Yoga');

// Test 8: Vosi Yoga - benefic in 2nd from Sun
const chart8 = createMockChart({
  houses: {
    1: ['Sun'],
    2: ['Venus'],   // Benefic in 2nd from Sun
    3: [],
    4: [],
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
const result8 = calculateLunarSolarYogas(chart8);
assert.ok(
  result8.yogas.some(y => y.yogaKey === 'VOSI_YOGA'),
  'Test 8: Vosi Yoga (benefic in 2nd from Sun)'
);
console.log('✓ Test 8: Vosi Yoga');

// Test 9: Ubhayachari Yoga - benefics in 2nd AND 12th from Sun
const chart9 = createMockChart({
  houses: {
    1: ['Sun'],
    2: ['Venus'],    // Benefic in 2nd from Sun
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: [],
    11: [],
    12: ['Mercury'], // Benefic in 12th from Sun
  },
});
const result9 = calculateLunarSolarYogas(chart9);
assert.ok(
  result9.yogas.some(y => y.yogaKey === 'UBHAYACHARI_YOGA'),
  'Test 9: Ubhayachari Yoga (benefics 2nd AND 12th from Sun)'
);
console.log('✓ Test 9: Ubhayachari Yoga');

// ============ PANCHA MAHA PURUSHA TESTS ============

// Test 10: Ruchaka Yoga - Mars exalted in angle
const chart10 = createMockChart({
  planetPositions: {
    Sun: 0,
    Moon: 60,
    Mercury: 30,
    Venus: 45,
    Mars: 270,      // Capricorn (Mars exaltation)
    Jupiter: 120,
    Saturn: 150,
  },
  houses: {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: ['Mars'],    // Mars in 7th (angular)
    8: [],
    9: [],
    10: [],
    11: [],
    12: [],
  },
});
const result10 = calculateLunarSolarYogas(chart10);
assert.ok(
  result10.yogas.some(y => y.yogaKey === 'RUCHAKA_YOGA'),
  'Test 10: Ruchaka Yoga (Mars exalted in angle)'
);
console.log('✓ Test 10: Ruchaka Yoga');

// Test 11: Bhadra Yoga - Mercury exalted in angle
const chart11 = createMockChart({
  planetPositions: {
    Sun: 0,
    Moon: 60,
    Mercury: 165,   // Virgo (sign 5, Mercury exaltation/own sign)
    Venus: 45,
    Mars: 90,
    Jupiter: 120,
    Saturn: 150,
  },
  houses: {
    1: [],
    2: [],
    3: [],
    4: ['Mercury'], // Mercury in 4th (angular)
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
const result11 = calculateLunarSolarYogas(chart11);
assert.ok(
  result11.yogas.some(y => y.yogaKey === 'BHADRA_YOGA'),
  'Test 11: Bhadra Yoga (Mercury exalted in angle)'
);
console.log('✓ Test 11: Bhadra Yoga');

// Test 12: Hamsa Yoga - Jupiter exalted in angle
const chart12 = createMockChart({
  planetPositions: {
    Sun: 0,
    Moon: 60,
    Mercury: 30,
    Venus: 45,
    Mars: 90,
    Jupiter: 90,    // Cancer (Jupiter exaltation)
    Saturn: 150,
  },
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
    10: ['Jupiter'], // Jupiter in 10th (angular)
    11: [],
    12: [],
  },
});
const result12 = calculateLunarSolarYogas(chart12);
assert.ok(
  result12.yogas.some(y => y.yogaKey === 'HAMSA_YOGA'),
  'Test 12: Hamsa Yoga (Jupiter exalted in angle)'
);
console.log('✓ Test 12: Hamsa Yoga');

// Test 13: Malavya Yoga - Venus exalted in angle
const chart13 = createMockChart({
  planetPositions: {
    Sun: 0,
    Moon: 60,
    Mercury: 30,
    Venus: 330,     // Pisces (Venus exaltation)
    Mars: 90,
    Jupiter: 120,
    Saturn: 150,
  },
  houses: {
    1: ['Venus'],   // Venus in 1st (angular)
    2: [],
    3: [],
    4: [],
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
const result13 = calculateLunarSolarYogas(chart13);
assert.ok(
  result13.yogas.some(y => y.yogaKey === 'MALAVYA_YOGA'),
  'Test 13: Malavya Yoga (Venus exalted in angle)'
);
console.log('✓ Test 13: Malavya Yoga');

// Test 14: Sasa Yoga - Saturn in own sign in angle
const chart14 = createMockChart({
  planetPositions: {
    Sun: 0,
    Moon: 60,
    Mercury: 30,
    Venus: 45,
    Mars: 90,
    Jupiter: 120,
    Saturn: 285,    // Capricorn (sign 9, Saturn own sign)
  },
  houses: {
    1: [],
    2: [],
    3: [],
    4: ['Saturn'],  // Saturn in 4th (angular)
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
const result14 = calculateLunarSolarYogas(chart14);
assert.ok(
  result14.yogas.some(y => y.yogaKey === 'SASA_YOGA'),
  'Test 14: Sasa Yoga (Saturn in own sign in angle)'
);
console.log('✓ Test 14: Sasa Yoga');

// Test 15: Source attribution
const chart15 = createMockChart();
const result15 = calculateLunarSolarYogas(chart15);
assert.ok(result15.source, 'Test 15: Source attribution present');
assert.ok(result15.source.convention.includes('Ch.37') || result15.source.convention.includes('Ch.38') || result15.source.convention.includes('Ch.31'),
  'Should cite BPHS chapters');
console.log('✓ Test 15: Source attribution');

// Test 16: Multiple yogas in one chart
const chart16 = createMockChart({
  planetPositions: {
    Sun: 0,
    Moon: 60,
    Mercury: 165,   // Mercury exalted (Virgo)
    Venus: 330,     // Venus exalted (Pisces)
    Mars: 270,      // Mars exalted (Capricorn)
    Jupiter: 90,    // Jupiter exalted (Cancer)
    Saturn: 285,    // Saturn own sign (Capricorn)
  },
  houses: {
    1: ['Sun'],
    2: ['Venus'],   // Vosi + Malavya setup
    3: [],
    4: ['Mercury'], // Bhadra setup
    5: [],
    6: [],
    7: ['Mars'],    // Ruchaka setup
    8: [],
    9: [],
    10: ['Jupiter', 'Saturn'], // Hamsa + Sasa setup
    11: [],
    12: [],
  },
});
const result16 = calculateLunarSolarYogas(chart16);
assert.ok(result16.yogas.length >= 3, 'Test 16: Multiple yogas detected');
console.log(`✓ Test 16: Multiple yogas (${result16.yogas.length} detected)`);

// Test 17: Error handling
const invalidChart = {
  planetPositions: null,
  houses: null,
};
const result17 = calculateLunarSolarYogas(invalidChart);
assert.equal(result17.yogas.length, 0, 'Test 17: Handles invalid chart gracefully');
console.log('✓ Test 17: Error handling');

// Test 18: All 14 yogas have metadata
let metadataOk = 0;
Object.entries(LUNAR_SOLAR_YOGAS_CATALOG).forEach(([key, yoga]) => {
  assert.ok(yoga.name, `${key} has name`);
  assert.ok(yoga.chapter, `${key} has chapter`);
  assert.ok(yoga.type, `${key} has type`);
  assert.ok(yoga.formation_rule, `${key} has formation_rule`);
  assert.ok(yoga.effects, `${key} has effects`);
  assert.ok(yoga.severity, `${key} has severity`);
  assert.ok(typeof yoga.detection === 'function', `${key} has detection function`);
  metadataOk++;
});
console.log(`✓ Test 18: All ${metadataOk} yogas have complete metadata`);

// Summary
console.log('\n' + '='.repeat(60));
console.log('✅ ALL LUNAR/SOLAR/PMP TESTS PASSED (18 test cases, 100% pass rate)');
console.log('='.repeat(60));
console.log(`Total Yogas Implemented: ${Object.keys(LUNAR_SOLAR_YOGAS_CATALOG).length}`);
console.log('Lunar: Sunapha, Anapha, Duradhara, Kemadruma, Dhana, Adhi');
console.log('Solar: Vesi, Vosi, Ubhayachari');
console.log('PMP: Ruchaka, Bhadra, Hamsa, Malavya, Sasa');
console.log('='.repeat(60));
