const { calculateLunarSolarYogas } = require('./src/chart/lunarSolarYogas');

// Mock chart helper
function createMockChart(config = {}) {
  const houses = config.houses || {
    1: [], 2: [], 3: [], 4: [], 5: [], 6: [],
    7: [], 8: [], 9: [], 10: [], 11: [], 12: [],
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

console.log('========== PHASE 3.3 PART 2: MERCURY ENHANCEMENTS ==========\n');

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

// ==================== SUNAPHA YOGA MERCURY TRACKING ====================

test('Sunapha - Mercury flanking (strength 3)', () => {
  const chart = createMockChart({
    lagna: { longitude: 15 },
    planetPositions: {
      Sun: 45,
      Moon: 75,      // Moon in house 2
      Mercury: 85,   // Mercury in house 3 (2nd from Moon) - FLANKING
      Venus: 125,
      Mars: 175,
      Jupiter: 250,
      Saturn: 225,
    },
    houses: {
      1: [],
      2: ['Moon'],
      3: ['Mercury'],  // Mercury flanking
      4: ['Venus'],
      5: [],
      6: ['Mars'],
      7: [],
      8: ['Saturn'],
      9: [],
      10: [],
      11: [],
      12: ['Jupiter'],
    }
  });

  const result = calculateLunarSolarYogas(chart);
  const sunapha = result.yogas.find(y => y.name === 'Sunapha Yoga');
  if (!sunapha) throw new Error('Sunapha not detected');
  if (sunapha.sunaphaStrength !== 3) throw new Error(`Expected strength 3, got ${sunapha.sunaphaStrength}`);
  if (sunapha.flanking_planet !== 'Mercury') throw new Error(`Expected Mercury, got ${sunapha.flanking_planet}`);
  if (!sunapha.effects.includes('Mercury')) throw new Error('Effects should mention Mercury');
});

test('Sunapha - Jupiter flanking (strength 2)', () => {
  const chart = createMockChart({
    lagna: { longitude: 15 },
    planetPositions: {
      Sun: 45,
      Moon: 75,      // Moon in house 2
      Mercury: 0,
      Venus: 125,
      Mars: 175,
      Jupiter: 85,   // Jupiter in house 3 (2nd from Moon) - FLANKING
      Saturn: 225,
    },
    houses: {
      1: [],
      2: ['Moon'],
      3: ['Jupiter'],  // Jupiter flanking
      4: ['Venus'],
      5: [],
      6: ['Mars'],
      7: [],
      8: ['Saturn'],
      9: [],
      10: [],
      11: [],
      12: [],
    }
  });

  const result = calculateLunarSolarYogas(chart);
  const sunapha = result.yogas.find(y => y.name === 'Sunapha Yoga');
  if (!sunapha) throw new Error('Sunapha not detected');
  if (sunapha.sunaphaStrength !== 2) throw new Error(`Expected strength 2, got ${sunapha.sunaphaStrength}`);
  if (sunapha.flanking_planet !== 'Jupiter') throw new Error(`Expected Jupiter, got ${sunapha.flanking_planet}`);
});

test('Sunapha - Venus flanking (strength 1)', () => {
  const chart = createMockChart({
    lagna: { longitude: 15 },
    planetPositions: {
      Sun: 45,
      Moon: 75,      // Moon in house 2
      Mercury: 0,
      Venus: 85,     // Venus in house 3 (2nd from Moon) - FLANKING
      Mars: 175,
      Jupiter: 250,
      Saturn: 225,
    },
    houses: {
      1: [],
      2: ['Moon'],
      3: ['Venus'],   // Venus flanking
      4: [],
      5: [],
      6: ['Mars'],
      7: [],
      8: ['Saturn'],
      9: [],
      10: [],
      11: [],
      12: ['Jupiter'],
    }
  });

  const result = calculateLunarSolarYogas(chart);
  const sunapha = result.yogas.find(y => y.name === 'Sunapha Yoga');
  if (!sunapha) throw new Error('Sunapha not detected');
  if (sunapha.sunaphaStrength !== 1) throw new Error(`Expected strength 1, got ${sunapha.sunaphaStrength}`);
});

// ==================== ANAPHA YOGA MERCURY TRACKING ====================

test('Anapha - Mercury flanking (strength 2)', () => {
  const chart = createMockChart({
    lagna: { longitude: 15 },
    planetPositions: {
      Sun: 45,
      Moon: 75,      // Moon in house 2
      Mercury: 30,   // Mercury in house 1 (12th from Moon) - FLANKING
      Venus: 125,
      Mars: 175,
      Jupiter: 250,
      Saturn: 225,
    },
    houses: {
      1: ['Mercury'],  // Mercury flanking (12th from Moon)
      2: ['Moon'],
      3: [],
      4: ['Venus'],
      5: [],
      6: ['Mars'],
      7: [],
      8: ['Saturn'],
      9: [],
      10: [],
      11: [],
      12: ['Jupiter'],
    }
  });

  const result = calculateLunarSolarYogas(chart);
  const anapha = result.yogas.find(y => y.name === 'Anapha Yoga');
  if (!anapha) throw new Error('Anapha not detected');
  if (anapha.anaphaStrength !== 2) throw new Error(`Expected strength 2, got ${anapha.anaphaStrength}`);
  if (anapha.flanking_planet !== 'Mercury') throw new Error(`Expected Mercury, got ${anapha.flanking_planet}`);
  if (!anapha.effects.includes('Mercury')) throw new Error('Effects should mention Mercury');
});

test('Anapha - Jupiter flanking (strength 2)', () => {
  const chart = createMockChart({
    lagna: { longitude: 15 },
    planetPositions: {
      Sun: 45,
      Moon: 75,      // Moon in house 2
      Mercury: 0,
      Venus: 125,
      Mars: 175,
      Jupiter: 30,   // Jupiter in house 1 (12th from Moon) - FLANKING
      Saturn: 225,
    },
    houses: {
      1: ['Jupiter'],  // Jupiter flanking
      2: ['Moon'],
      3: [],
      4: ['Venus'],
      5: [],
      6: ['Mars'],
      7: [],
      8: ['Saturn'],
      9: [],
      10: [],
      11: [],
      12: [],
    }
  });

  const result = calculateLunarSolarYogas(chart);
  const anapha = result.yogas.find(y => y.name === 'Anapha Yoga');
  if (!anapha) throw new Error('Anapha not detected');
  if (anapha.anaphaStrength !== 2) throw new Error(`Expected strength 2, got ${anapha.anaphaStrength}`);
});

// ==================== VESI YOGA BENEFIC COUNTING ====================

test('Vesi - Single benefic (strength 1)', () => {
  const chart = createMockChart({
    lagna: { longitude: 15 },
    planetPositions: {
      Sun: 75,       // Sun in house 2
      Moon: 45,
      Mercury: 0,
      Venus: 125,
      Mars: 175,
      Jupiter: 250,
      Saturn: 30,    // Saturn in house 1 (12th from Sun) - but it's malefic
    },
    houses: {
      1: ['Venus'],  // Venus in 12th from Sun (Vesi)
      2: ['Sun'],
      3: [],
      4: [],
      5: [],
      6: ['Mars'],
      7: [],
      8: [],
      9: [],
      10: [],
      11: [],
      12: ['Jupiter'],
    }
  });

  const result = calculateLunarSolarYogas(chart);
  const vesi = result.yogas.find(y => y.name === 'Vesi Yoga');
  if (!vesi) throw new Error('Vesi not detected');
  if (vesi.vesiStrength !== 1) throw new Error(`Expected strength 1, got ${vesi.vesiStrength}`);
  if (!vesi.benefics_present.includes('Venus')) throw new Error('Should include Venus');
  if (vesi.benefics_present.length !== 1) throw new Error(`Expected 1 benefic, got ${vesi.benefics_present.length}`);
});

test('Vesi - Dual benefics (strength 2)', () => {
  const chart = createMockChart({
    lagna: { longitude: 15 },
    planetPositions: {
      Sun: 75,       // Sun in house 2
      Moon: 45,
      Mercury: 45,   // Mercury in house 1 (12th from Sun)
      Venus: 35,     // Venus in house 1 (12th from Sun)
      Mars: 175,
      Jupiter: 250,
      Saturn: 225,
    },
    houses: {
      1: ['Mercury', 'Venus'],  // Mercury + Venus in 12th from Sun
      2: ['Sun'],
      3: [],
      4: [],
      5: [],
      6: ['Mars'],
      7: [],
      8: [],
      9: [],
      10: [],
      11: [],
      12: ['Jupiter'],
    }
  });

  const result = calculateLunarSolarYogas(chart);
  const vesi = result.yogas.find(y => y.name === 'Vesi Yoga');
  if (!vesi) throw new Error('Vesi not detected');
  if (vesi.vesiStrength !== 2) throw new Error(`Expected strength 2, got ${vesi.vesiStrength}`);
  if (vesi.benefics_present.length !== 2) throw new Error(`Expected 2 benefics, got ${vesi.benefics_present.length}`);
});

test('Vesi - Triple benefics (strength 3)', () => {
  const chart = createMockChart({
    lagna: { longitude: 15 },
    planetPositions: {
      Sun: 75,       // Sun in house 2
      Moon: 45,
      Mercury: 40,   // Mercury in house 1 (12th from Sun)
      Venus: 35,     // Venus in house 1 (12th from Sun)
      Mars: 175,
      Jupiter: 30,   // Jupiter in house 1 (12th from Sun)
      Saturn: 225,
    },
    houses: {
      1: ['Mercury', 'Venus', 'Jupiter'],  // 3 benefics in 12th from Sun
      2: ['Sun'],
      3: [],
      4: [],
      5: [],
      6: ['Mars'],
      7: [],
      8: [],
      9: [],
      10: [],
      11: [],
      12: [],
    }
  });

  const result = calculateLunarSolarYogas(chart);
  const vesi = result.yogas.find(y => y.name === 'Vesi Yoga');
  if (!vesi) throw new Error('Vesi not detected');
  if (vesi.vesiStrength !== 3) throw new Error(`Expected strength 3, got ${vesi.vesiStrength}`);
  if (vesi.benefics_present.length !== 3) throw new Error(`Expected 3 benefics, got ${vesi.benefics_present.length}`);
});

// ==================== VOSI YOGA BENEFIC COUNTING ====================

test('Vosi - Mercury in 2nd (strength 2)', () => {
  const chart = createMockChart({
    lagna: { longitude: 15 },
    planetPositions: {
      Sun: 75,       // Sun in house 2
      Moon: 45,
      Mercury: 95,   // Mercury in house 3 (2nd from Sun) - MERCURY enhances
      Venus: 125,
      Mars: 175,
      Jupiter: 250,
      Saturn: 225,
    },
    houses: {
      1: [],
      2: ['Sun'],
      3: ['Mercury'],  // Mercury in 3rd = 2nd from Sun
      4: [],
      5: [],
      6: ['Mars'],
      7: [],
      8: [],
      9: [],
      10: [],
      11: [],
      12: ['Jupiter'],
    }
  });

  const result = calculateLunarSolarYogas(chart);
  const vosi = result.yogas.find(y => y.name === 'Vosi Yoga');
  if (!vosi) throw new Error('Vosi not detected');
  if (vosi.vosiStrength !== 2) throw new Error(`Expected strength 2, got ${vosi.vosiStrength}`);
  if (!vosi.effects.includes('Mercury')) throw new Error('Effects should mention Mercury');
});

test('Vosi - Mercury + Jupiter (strength 3)', () => {
  const chart = createMockChart({
    lagna: { longitude: 15 },
    planetPositions: {
      Sun: 75,       // Sun in house 2
      Moon: 45,
      Mercury: 90,   // Mercury in house 3 (2nd from Sun)
      Venus: 125,
      Mars: 175,
      Jupiter: 95,   // Jupiter in house 3 (2nd from Sun)
      Saturn: 225,
    },
    houses: {
      1: [],
      2: ['Sun'],
      3: ['Mercury', 'Jupiter'],  // Mercury + Jupiter in 3rd = 2nd from Sun
      4: [],
      5: [],
      6: ['Mars'],
      7: [],
      8: [],
      9: [],
      10: [],
      11: [],
      12: [],
    }
  });

  const result = calculateLunarSolarYogas(chart);
  const vosi = result.yogas.find(y => y.name === 'Vosi Yoga');
  if (!vosi) throw new Error('Vosi not detected');
  if (vosi.vosiStrength !== 3) throw new Error(`Expected strength 3, got ${vosi.vosiStrength}`);
});

// ==================== BACKWARD COMPATIBILITY ====================

test('All 14 yogas still detected', () => {
  const chart = createMockChart({
    lagna: { longitude: 15 },
    planetPositions: {
      Sun: 75,
      Moon: 75,
      Mercury: 85,
      Venus: 115,
      Mars: 135,
      Jupiter: 165,
      Saturn: 195,
    },
    houses: {
      1: ['Mercury', 'Jupiter'],
      2: [],
      3: ['Venus'],
      4: [],
      5: [],
      6: ['Mars'],
      7: [],
      8: [],
      9: [],
      10: [],
      11: [],
      12: ['Saturn'],
    }
  });

  const result = calculateLunarSolarYogas(chart);
  const yogaCount = result.yogas.length;
  if (yogaCount === 0) throw new Error('No yogas detected');
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
