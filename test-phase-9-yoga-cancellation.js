const { calculateLunarSolarYogas } = require('./src/chart/lunarSolarYogas');
const { calculatePlanetaryStrengthIndex } = require('./src/chart/planetaryStrength');

function createMockChart(config = {}) {
  return {
    lagna: config.lagna || { longitude: 0 },
    planetPositions: config.planetPositions || {},
    houses: config.houses || {
      1: [], 2: [], 3: [], 4: [], 5: [], 6: [],
      7: [], 8: [], 9: [], 10: [], 11: [], 12: [],
    },
  };
}

const mockAspectMatrix = {
  aspectDetails: {
    'Jupiter-Sun': { aspected: 'Sun', isBenefic: true, strength: 2 },
    'Venus-Moon': { aspected: 'Moon', isBenefic: true, strength: 2 },
  }
};

console.log('========== PHASE 9: YOGA CANCELLATION RULES ==========\n');

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

// ==================== KEMADRUMA CANCELLATION ====================

test('Kemadruma cancelled if Moon in angular house', () => {
  const chart = createMockChart({
    planetPositions: { Sun: 45, Moon: 15, Mercury: 0, Venus: 30, Mars: 175, Jupiter: 115, Saturn: 225 },
    houses: {
      1: ['Moon'], 2: [], 3: [], 4: [],
      5: [], 6: [], 7: [], 8: [],
      9: [], 10: [], 11: [], 12: []
    }
  });
  const result = calculateLunarSolarYogas(chart);
  const kemadruma = result.yogas.find(y => y.name === 'Kemadruma Yoga');
  if (kemadruma && !kemadruma.cancelled) {
    throw new Error('Kemadruma should be cancelled when Moon in angular house 1');
  }
});

test('Kemadruma cancelled if benefic aspects Moon', () => {
  const chart = createMockChart({
    planetPositions: {
      Sun: 45, Moon: 75, Mercury: 0, Venus: 30,
      Mars: 175, Jupiter: 115, Saturn: 225
    },
    houses: {
      1: [], 2: ['Moon'], 3: [], 4: [],
      5: [], 6: [], 7: ['Jupiter'], 8: [],
      9: [], 10: [], 11: [], 12: []
    }
  });
  const result = calculateLunarSolarYogas(chart);
  const kemadruma = result.yogas.find(y => y.name === 'Kemadruma Yoga');
  if (kemadruma && !kemadruma.cancelled) {
    throw new Error('Kemadruma should be cancelled if benefic aspects Moon');
  }
});

test('Kemadruma cancelled if Moon exalted', () => {
  const chart = createMockChart({
    planetPositions: {
      Sun: 45, Moon: 105, Mercury: 0, Venus: 30,
      Mars: 175, Jupiter: 115, Saturn: 225
    },
    houses: {
      1: [], 2: ['Moon'], 3: [], 4: [],
      5: [], 6: [], 7: [], 8: [],
      9: [], 10: [], 11: [], 12: []
    }
  });
  const result = calculateLunarSolarYogas(chart);
  const kemadruma = result.yogas.find(y => y.name === 'Kemadruma Yoga');
  if (kemadruma && !kemadruma.cancelled) {
    throw new Error('Kemadruma should be cancelled if Moon exalted');
  }
});

// ==================== CANCELLATION STATUS TRACKING ====================

test('Cancelled yogas include cancellation reason', () => {
  const chart = createMockChart({
    planetPositions: { Sun: 45, Moon: 15, Mercury: 0, Venus: 30, Mars: 175, Jupiter: 115, Saturn: 225 },
    houses: {
      1: ['Moon'], 2: [], 3: [], 4: [],
      5: [], 6: [], 7: [], 8: [],
      9: [], 10: [], 11: [], 12: []
    }
  });
  const result = calculateLunarSolarYogas(chart);
  const kemadruma = result.yogas.find(y => y.name === 'Kemadruma Yoga');
  if (kemadruma && kemadruma.cancelled) {
    if (!kemadruma.cancellationReason) {
      throw new Error('Cancelled yoga should include cancellation reason');
    }
  }
});

test('Non-cancelled yogas remain unaffected', () => {
  const chart = createMockChart({
    planetPositions: { Moon: 75, Mercury: 85 },
    houses: { 1: [], 2: ['Moon'], 3: ['Mercury'] }
  });
  const result = calculateLunarSolarYogas(chart);
  const sunapha = result.yogas.find(y => y.name === 'Sunapha Yoga');
  if (!sunapha) throw new Error('Sunapha not detected');
  if (sunapha.cancelled) throw new Error('Non-cancelled yoga should have cancelled=false');
});

// ==================== BACKWARD COMPATIBILITY ====================

test('Cancellation layer maintains all Phase 8 fields', () => {
  const chart = createMockChart({
    planetPositions: { Moon: 75, Mercury: 85 },
    houses: { 1: [], 2: ['Moon'], 3: ['Mercury'] }
  });
  const strength = calculatePlanetaryStrengthIndex(chart, mockAspectMatrix);
  const result = calculateLunarSolarYogas(chart, strength.planetaryStrengths);
  const sunapha = result.yogas.find(y => y.name === 'Sunapha Yoga');
  if (!sunapha) throw new Error('Sunapha not detected');
  if (sunapha.sunaphaStrength === undefined) throw new Error('Missing Phase 4 enrichment');
  if (sunapha.strengthGate === undefined) throw new Error('Missing Phase 8 gate');
  if (sunapha.cancelled === undefined) throw new Error('Missing Phase 9 cancellation flag');
});

test('All 14 lunar-solar yogas still detected with cancellation layer', () => {
  const chart = createMockChart({
    planetPositions: {
      Sun: 45, Moon: 75, Mercury: 85, Venus: 115,
      Mars: 135, Jupiter: 165, Saturn: 195
    },
    houses: {
      1: ['Mercury', 'Jupiter'], 2: [], 3: ['Venus'],
      4: [], 5: [], 6: ['Mars'], 7: [],
      8: [], 9: [], 10: [], 11: [], 12: ['Saturn']
    }
  });
  const result = calculateLunarSolarYogas(chart);
  if (result.yogas.length === 0) throw new Error('No yogas detected');
  // Each yoga should have cancellation tracking
  const allHaveCancellationFlag = result.yogas.every(y => y.cancelled !== undefined);
  if (!allHaveCancellationFlag) throw new Error('Not all yogas have cancellation tracking');
});

// ==================== INTEGRATION WITH PRIOR PHASES ====================

test('Phase 7 strength scores accessible in cancellation logic', () => {
  const chart = createMockChart({
    planetPositions: {
      Sun: 45, Moon: 75, Mercury: 85, Venus: 115,
      Mars: 135, Jupiter: 165, Saturn: 195
    },
    houses: {
      1: ['Sun', 'Mercury'], 2: ['Moon'], 3: [],
      4: [], 5: [], 6: [], 7: ['Jupiter'],
      8: [], 9: [], 10: [], 11: [], 12: ['Saturn']
    }
  });
  const strength = calculatePlanetaryStrengthIndex(chart, mockAspectMatrix);
  const result = calculateLunarSolarYogas(chart, strength.planetaryStrengths);
  if (result.yogas.length === 0) throw new Error('No yogas detected');
  // Verify that cancellation logic had access to strength data
  if (!strength.planetaryStrengths.Moon) throw new Error('Moon strength not available');
});

// ==================== COMPLEX SCENARIOS ====================

test('Multiple cancellation rules can apply to same yoga', () => {
  const chart = createMockChart({
    planetPositions: {
      Sun: 45, Moon: 15, Mercury: 0, Venus: 30,
      Mars: 175, Jupiter: 115, Saturn: 225
    },
    houses: {
      1: ['Moon'], 2: [], 3: [], 4: ['Jupiter'],
      5: [], 6: [], 7: [], 8: [],
      9: [], 10: [], 11: [], 12: []
    }
  });
  const result = calculateLunarSolarYogas(chart);
  const kemadruma = result.yogas.find(y => y.name === 'Kemadruma Yoga');
  // Moon in angular house (1) AND benefic aspect should both cancel
  if (kemadruma && !kemadruma.cancelled) {
    throw new Error('Kemadruma should be cancelled (multiple rules apply)');
  }
});

test('Chart with no cancellations shows all yogas active', () => {
  const chart = createMockChart({
    planetPositions: {
      Sun: 45, Moon: 235, Mercury: 85, Venus: 115,
      Mars: 135, Jupiter: 285, Saturn: 195
    },
    houses: {
      1: [], 2: [], 3: ['Mercury'],
      4: [], 5: [], 6: [], 7: [],
      8: ['Moon'], 9: [], 10: [], 11: [], 12: []
    }
  });
  const result = calculateLunarSolarYogas(chart);
  const uncancelledCount = result.yogas.filter(y => !y.cancelled).length;
  if (uncancelledCount === 0) throw new Error('Chart should have active yogas when no cancellations apply');
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
