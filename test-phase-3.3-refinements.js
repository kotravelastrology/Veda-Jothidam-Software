const { calculateLunarSolarYogas } = require('./src/chart/lunarSolarYogas');

// Mock chart helper with full structure
function createMockChart(config = {}) {
  const houses = config.houses || {
    1: [],
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
  };

  const planets = Object.keys(config.planetPositions || {})
    .reduce((acc, planet) => {
      acc[planet] = { longitude: config.planetPositions[planet] };
      return acc;
    }, {});

  return {
    lagna: config.lagna || { longitude: 0 },
    planetPositions: config.planetPositions || {},
    houses,
    planets,
  };
}

console.log('========== PHASE 3.3 REFINEMENT TESTS ==========\n');

let passCount = 0;
let failCount = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passCount++;
  } catch (e) {
    console.log(`❌ ${name}`);
    console.log(`   Error: ${e.message}`);
    failCount++;
  }
}

// ==================== REFINEMENT 1: KEMADRUMA CANCELLATION ====================

test('Kemadruma - Basic detection (no cancellation)', () => {
  const chart = createMockChart({
    lagna: { longitude: 15 },
    planetPositions: {
      Sun: 45,
      Moon: 75,      // Moon in house 2-3 region
      Mercury: 0,    // Not in 2nd/12th from Moon
      Venus: 180,    // Not in 2nd/12th from Moon
      Mars: 90,      // Not in 2nd/12th from Moon
      Jupiter: 200,  // Jupiter NOT in angle/5th
      Saturn: 150,   // Not in 2nd/12th from Moon
    },
    houses: {
      1: [],
      2: ['Moon'],
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
    }
  });

  const result = calculateLunarSolarYogas(chart);
  const hasKemadruma = result.yogas.some(y => y.name === 'Kemadruma Yoga');
  if (!hasKemadruma) throw new Error('Expected Kemadruma Yoga to be detected');
});

test('Kemadruma - Cancelled by Jupiter in 1st (angle)', () => {
  const chart = createMockChart({
    lagna: { longitude: 15 },
    planetPositions: {
      Sun: 45,
      Moon: 75,      // Moon in house 2
      Mercury: 0,
      Venus: 180,
      Mars: 90,
      Jupiter: 30,   // Jupiter in house 1 (angle) - CANCELS Kemadruma
      Saturn: 150,
    },
    houses: {
      1: ['Jupiter'],  // Jupiter in 1st house
      2: ['Moon'],
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
    }
  });

  const result = calculateLunarSolarYogas(chart);
  const hasKemadruma = result.yogas.some(y => y.name === 'Kemadruma Yoga');
  if (hasKemadruma) throw new Error('Expected Kemadruma Yoga to be CANCELLED by Jupiter in 1st');
});

test('Kemadruma - Cancelled by Jupiter in 4th (angle)', () => {
  const chart = createMockChart({
    lagna: { longitude: 15 },
    planetPositions: {
      Sun: 45,
      Moon: 75,
      Mercury: 0,
      Venus: 180,
      Mars: 90,
      Jupiter: 115,  // Jupiter in house 4 (angle)
      Saturn: 150,
    },
    houses: {
      1: [],
      2: ['Moon'],
      3: [],
      4: ['Jupiter'],  // Jupiter in 4th house
      5: [],
      6: [],
      7: [],
      8: [],
      9: [],
      10: [],
      11: [],
      12: [],
    }
  });

  const result = calculateLunarSolarYogas(chart);
  const hasKemadruma = result.yogas.some(y => y.name === 'Kemadruma Yoga');
  if (hasKemadruma) throw new Error('Expected Kemadruma Yoga to be CANCELLED by Jupiter in 4th');
});

test('Kemadruma - Cancelled by Jupiter in 5th (trine)', () => {
  const chart = createMockChart({
    lagna: { longitude: 15 },
    planetPositions: {
      Sun: 45,
      Moon: 75,
      Mercury: 0,
      Venus: 180,
      Mars: 90,
      Jupiter: 145,  // Jupiter in house 5
      Saturn: 150,
    },
    houses: {
      1: [],
      2: ['Moon'],
      3: [],
      4: [],
      5: ['Jupiter'],  // Jupiter in 5th house (trine, but still cancels)
      6: [],
      7: [],
      8: [],
      9: [],
      10: [],
      11: [],
      12: [],
    }
  });

  const result = calculateLunarSolarYogas(chart);
  const hasKemadruma = result.yogas.some(y => y.name === 'Kemadruma Yoga');
  if (hasKemadruma) throw new Error('Expected Kemadruma Yoga to be CANCELLED by Jupiter in 5th');
});

test('Kemadruma - Cancelled by Jupiter in 7th (angle)', () => {
  const chart = createMockChart({
    lagna: { longitude: 15 },
    planetPositions: {
      Sun: 45,
      Moon: 75,
      Mercury: 0,
      Venus: 180,
      Mars: 90,
      Jupiter: 195,  // Jupiter in house 7
      Saturn: 150,
    },
    houses: {
      1: [],
      2: ['Moon'],
      3: [],
      4: [],
      5: [],
      6: [],
      7: ['Jupiter'],  // Jupiter in 7th house
      8: [],
      9: [],
      10: [],
      11: [],
      12: [],
    }
  });

  const result = calculateLunarSolarYogas(chart);
  const hasKemadruma = result.yogas.some(y => y.name === 'Kemadruma Yoga');
  if (hasKemadruma) throw new Error('Expected Kemadruma Yoga to be CANCELLED by Jupiter in 7th');
});

test('Kemadruma - Cancelled by Jupiter in 10th (angle)', () => {
  const chart = createMockChart({
    lagna: { longitude: 15 },
    planetPositions: {
      Sun: 45,
      Moon: 75,
      Mercury: 0,
      Venus: 180,
      Mars: 90,
      Jupiter: 285,  // Jupiter in house 10
      Saturn: 150,
    },
    houses: {
      1: [],
      2: ['Moon'],
      3: [],
      4: [],
      5: [],
      6: [],
      7: [],
      8: [],
      9: [],
      10: ['Jupiter'],  // Jupiter in 10th house
      11: [],
      12: [],
    }
  });

  const result = calculateLunarSolarYogas(chart);
  const hasKemadruma = result.yogas.some(y => y.name === 'Kemadruma Yoga');
  if (hasKemadruma) throw new Error('Expected Kemadruma Yoga to be CANCELLED by Jupiter in 10th');
});

test('Kemadruma - NOT cancelled by Jupiter in 3rd (not angular/5th)', () => {
  const chart = createMockChart({
    lagna: { longitude: 15 },
    planetPositions: {
      Sun: 45,       // Sun in house 1
      Moon: 75,      // Moon in house 2
      Mercury: 125,  // Mercury in house 4 (NOT in 2nd or 12th from Moon)
      Venus: 200,    // Venus in house 7 (NOT in 2nd or 12th from Moon)
      Mars: 175,     // Mars in house 6 (NOT in 2nd or 12th from Moon)
      Jupiter: 250,  // Jupiter in house 9 (NOT angular/5th) - NO Jupiter to cancel
      Saturn: 225,   // Saturn in house 8 (NOT in 2nd or 12th from Moon)
    },
    houses: {
      1: ['Sun'],
      2: ['Moon'],
      3: [],         // Empty (3rd from Moon) = NO benefic in 2nd from Moon
      4: ['Mercury'],
      5: [],
      6: ['Mars'],
      7: ['Venus'],
      8: ['Saturn'],
      9: ['Jupiter'],
      10: [],
      11: [],
      12: [],        // Empty (12th from Moon) = NO benefic in 12th from Moon
    }
  });

  const result = calculateLunarSolarYogas(chart);
  const hasKemadruma = result.yogas.some(y => y.name === 'Kemadruma Yoga');
  if (!hasKemadruma) throw new Error('Expected Kemadruma Yoga to still be detected (Jupiter in 9th does not cancel)');
});

test('Kemadruma - NOT cancelled by Jupiter in 6th (not angular/5th)', () => {
  const chart = createMockChart({
    lagna: { longitude: 15 },
    planetPositions: {
      Sun: 45,
      Moon: 75,
      Mercury: 0,
      Venus: 180,
      Mars: 90,
      Jupiter: 165,  // Jupiter in house 6
      Saturn: 150,
    },
    houses: {
      1: [],
      2: ['Moon'],
      3: [],
      4: [],
      5: [],
      6: ['Jupiter'],  // Jupiter in 6th house
      7: [],
      8: [],
      9: [],
      10: [],
      11: [],
      12: [],
    }
  });

  const result = calculateLunarSolarYogas(chart);
  const hasKemadruma = result.yogas.some(y => y.name === 'Kemadruma Yoga');
  if (!hasKemadruma) throw new Error('Expected Kemadruma Yoga to still be detected (Jupiter in 6th does not cancel)');
});

// ==================== BACKWARD COMPATIBILITY TESTS ====================

test('Existing Sunapha Yoga still works', () => {
  const chart = createMockChart({
    lagna: { longitude: 15 },
    planetPositions: {
      Sun: 45,
      Moon: 75,      // Moon in house 2
      Mercury: 85,
      Venus: 120,    // Venus - benefic in 3rd house (2nd from Moon)
      Mars: 90,
      Jupiter: 200,
      Saturn: 150,
    },
    houses: {
      1: [],
      2: ['Moon'],   // Moon in house 2
      3: ['Venus'],  // Venus in 3rd house (2nd from Moon) = Sunapha
      4: [],
      5: [],
      6: [],
      7: [],
      8: [],
      9: [],
      10: [],
      11: [],
      12: [],
    }
  });

  const result = calculateLunarSolarYogas(chart);
  const hasSunapha = result.yogas.some(y => y.name === 'Sunapha Yoga');
  if (!hasSunapha) throw new Error('Expected Sunapha Yoga to be detected');
});

test('Existing Anapha Yoga still works', () => {
  const chart = createMockChart({
    lagna: { longitude: 15 },
    planetPositions: {
      Sun: 45,
      Moon: 75,      // Moon in house 2
      Mercury: 85,
      Venus: 30,     // Venus in 1st house (12th from Moon = house 2-2 = 0, wrap to 12, but adjusted)
      Mars: 90,
      Jupiter: 200,
      Saturn: 150,
    },
    houses: {
      1: ['Venus'],  // Venus in 1st house (12th from Moon) = Anapha
      2: ['Moon'],   // Moon in house 2
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
    }
  });

  const result = calculateLunarSolarYogas(chart);
  const hasAnapha = result.yogas.some(y => y.name === 'Anapha Yoga');
  if (!hasAnapha) throw new Error('Expected Anapha Yoga to be detected');
});

test('Source attribution still present', () => {
  const chart = createMockChart({
    lagna: { longitude: 15 },
    planetPositions: { Sun: 45, Moon: 75, Mercury: 0, Venus: 180, Mars: 90, Jupiter: 200, Saturn: 150 },
    houses: { 1: [], 2: ['Moon'], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [] }
  });

  const result = calculateLunarSolarYogas(chart);
  if (!result.source || !result.source.convention) {
    throw new Error('Expected source attribution');
  }
});

// ==================== SUMMARY ====================

console.log('\n========== TEST SUMMARY ==========');
console.log(`✅ Passed: ${passCount}`);
console.log(`❌ Failed: ${failCount}`);
console.log(`📊 Total:  ${passCount + failCount}`);
console.log(`✨ Pass Rate: ${((passCount / (passCount + failCount)) * 100).toFixed(1)}%`);

if (failCount > 0) {
  process.exit(1);
}
