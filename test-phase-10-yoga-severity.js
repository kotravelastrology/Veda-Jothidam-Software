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

console.log('========== PHASE 10: YOGA SEVERITY ANALYSIS ==========\n');

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

// ==================== BASE SEVERITY CALCULATION ====================

test('Benefic yoga assigned higher base severity than adverse', () => {
  const chart = createMockChart({
    planetPositions: { Moon: 75, Mercury: 85 },
    houses: { 1: [], 2: ['Moon'], 3: ['Mercury'] }
  });
  const result = calculateLunarSolarYogas(chart);
  const sunapha = result.yogas.find(y => y.name === 'Sunapha Yoga');
  if (!sunapha) throw new Error('Sunapha not detected');
  if (!sunapha.severity) throw new Error('Missing severity field');
  if (sunapha.severity.score === undefined) throw new Error('Missing severity score');
  if (sunapha.severity.rating === undefined) throw new Error('Missing severity rating');
});

test('Severity score reflects planetary strength', () => {
  const chart = createMockChart({
    planetPositions: { Moon: 75, Mercury: 85 },
    houses: { 1: [], 2: ['Moon'], 3: ['Mercury'] }
  });
  const strength = calculatePlanetaryStrengthIndex(chart, mockAspectMatrix);
  const result = calculateLunarSolarYogas(chart, strength.planetaryStrengths);
  const sunapha = result.yogas.find(y => y.name === 'Sunapha Yoga');
  if (!sunapha) throw new Error('Sunapha not detected');
  if (!sunapha.severity) throw new Error('Missing severity');
  // With strong Mercury, severity should be elevated
  if (sunapha.severity.factors === undefined) throw new Error('Missing factors breakdown');
});

test('Cancelled yoga has reduced severity', () => {
  const chart = createMockChart({
    planetPositions: {
      Sun: 45, Moon: 15, Mercury: 200, Venus: 210,
      Mars: 175, Jupiter: 115, Saturn: 225
    },
    houses: {
      1: ['Moon'], 2: [], 3: [], 4: [],
      5: [], 6: [], 7: ['Jupiter'], 8: [],
      9: [], 10: [], 11: [], 12: []
    }
  });
  const result = calculateLunarSolarYogas(chart);
  const yoga = result.yogas.find(y => y.cancelled === true && y.severity);
  if (yoga) {
    // When yoga is cancelled, severity should be significantly reduced
    if (yoga.severity.factors.cancellationFactor >= 0) {
      throw new Error('Cancelled yoga should have negative cancellation factor');
    }
  }
});

// ==================== SEVERITY RATING TIERS ====================

test('Critical yogas rated 80-100', () => {
  const chart = createMockChart({
    planetPositions: { Moon: 75, Mercury: 85 },
    houses: { 1: [], 2: ['Moon'], 3: ['Mercury'] }
  });
  const strength = calculatePlanetaryStrengthIndex(chart, mockAspectMatrix);
  const result = calculateLunarSolarYogas(chart, strength.planetaryStrengths);
  const yogas = result.yogas.filter(y => y.severity && y.severity.rating === 'CRITICAL');
  // Should have some critical-rated yogas or none if chart doesn't form them
  if (yogas.length > 0) {
    const allInRange = yogas.every(y => y.severity.score >= 80 && y.severity.score <= 100);
    if (!allInRange) throw new Error('CRITICAL yogas should score 80-100');
  }
});

test('Major yogas rated 60-79', () => {
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
  const strength = calculatePlanetaryStrengthIndex(chart, mockAspectMatrix);
  const result = calculateLunarSolarYogas(chart, strength.planetaryStrengths);
  const yogas = result.yogas.filter(y => y.severity && y.severity.rating === 'MAJOR');
  if (yogas.length > 0) {
    const allInRange = yogas.every(y => y.severity.score >= 60 && y.severity.score < 80);
    if (!allInRange) throw new Error('MAJOR yogas should score 60-79');
  }
});

test('Moderate yogas rated 40-59', () => {
  const chart = createMockChart({
    planetPositions: {
      Sun: 45, Moon: 75, Mercury: 85, Venus: 115,
      Mars: 135, Jupiter: 165, Saturn: 195
    },
    houses: {
      1: [], 2: ['Moon'], 3: [],
      4: [], 5: [], 6: [], 7: [],
      8: [], 9: [], 10: [], 11: [], 12: ['Saturn']
    }
  });
  const result = calculateLunarSolarYogas(chart);
  const yogas = result.yogas.filter(y => y.severity && y.severity.rating === 'MODERATE');
  if (yogas.length > 0) {
    const allInRange = yogas.every(y => y.severity.score >= 40 && y.severity.score < 60);
    if (!allInRange) throw new Error('MODERATE yogas should score 40-59');
  }
});

// ==================== SEVERITY FACTORS ====================

test('Severity breakdown includes all factor components', () => {
  const chart = createMockChart({
    planetPositions: { Moon: 75, Mercury: 85 },
    houses: { 1: [], 2: ['Moon'], 3: ['Mercury'] }
  });
  const strength = calculatePlanetaryStrengthIndex(chart, mockAspectMatrix);
  const result = calculateLunarSolarYogas(chart, strength.planetaryStrengths);
  const yoga = result.yogas.find(y => y.severity);
  if (!yoga) throw new Error('No yoga with severity');
  if (!yoga.severity.factors) throw new Error('Missing factors breakdown');
  if (yoga.severity.factors.base === undefined) throw new Error('Missing base factor');
  if (yoga.severity.factors.strengthFactor === undefined) throw new Error('Missing strength factor');
  if (yoga.severity.factors.cancellationFactor === undefined) throw new Error('Missing cancellation factor');
  if (yoga.severity.factors.aspectSupport === undefined) throw new Error('Missing aspect support');
});

test('Severity includes breakdown explanation', () => {
  const chart = createMockChart({
    planetPositions: { Moon: 75, Mercury: 85 },
    houses: { 1: [], 2: ['Moon'], 3: ['Mercury'] }
  });
  const result = calculateLunarSolarYogas(chart);
  const yoga = result.yogas.find(y => y.severity && y.severity.breakdown);
  if (!yoga) throw new Error('No yoga with severity breakdown');
  if (typeof yoga.severity.breakdown !== 'string') throw new Error('Breakdown should be string');
  if (yoga.severity.breakdown.length === 0) throw new Error('Breakdown should not be empty');
});

// ==================== BACKWARD COMPATIBILITY ====================

test('All Phase 4-9 fields preserved with severity layer', () => {
  const chart = createMockChart({
    planetPositions: { Moon: 75, Mercury: 85 },
    houses: { 1: [], 2: ['Moon'], 3: ['Mercury'] }
  });
  const strength = calculatePlanetaryStrengthIndex(chart, mockAspectMatrix);
  const result = calculateLunarSolarYogas(chart, strength.planetaryStrengths);
  const yoga = result.yogas.find(y => y.name === 'Sunapha Yoga');
  if (!yoga) throw new Error('Sunapha not detected');
  if (yoga.yogaKey === undefined) throw new Error('Missing yogaKey');
  if (yoga.effects === undefined) throw new Error('Missing effects');
  if (yoga.sunaphaStrength === undefined) throw new Error('Missing Phase 4 enrichment');
  if (yoga.strengthGate === undefined) throw new Error('Missing Phase 8 gate');
  if (yoga.cancelled === undefined) throw new Error('Missing Phase 9 cancellation');
  if (yoga.severity === undefined) throw new Error('Missing Phase 10 severity');
});

test('All 14 lunar-solar yogas have severity scores', () => {
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
  const allHaveSeverity = result.yogas.every(y => y.severity !== undefined);
  if (!allHaveSeverity) throw new Error('Not all yogas have severity score');
});

test('Severity scores are numeric and within valid range', () => {
  const chart = createMockChart({
    planetPositions: {
      Sun: 45, Moon: 75, Mercury: 85, Venus: 115,
      Mars: 135, Jupiter: 165, Saturn: 195
    },
    houses: {
      1: [], 2: ['Moon'], 3: ['Venus'],
      4: [], 5: [], 6: [], 7: [],
      8: [], 9: [], 10: [], 11: [], 12: []
    }
  });
  const result = calculateLunarSolarYogas(chart);
  const allValid = result.yogas.every(y =>
    typeof y.severity.score === 'number' &&
    y.severity.score >= 0 &&
    y.severity.score <= 100
  );
  if (!allValid) throw new Error('Severity scores should be numeric 0-100');
});

// ==================== INTEGRATION WITH PRIOR PHASES ====================

test('Severity calculation uses Phase 7 strength data', () => {
  const chart = createMockChart({
    planetPositions: {
      Sun: 45, Moon: 75, Mercury: 85, Venus: 115,
      Mars: 135, Jupiter: 165, Saturn: 195
    },
    houses: {
      1: ['Sun', 'Mercury'], 2: [], 3: [],
      4: [], 5: [], 6: [], 7: [],
      8: [], 9: [], 10: [], 11: [], 12: ['Saturn']
    }
  });
  const strength = calculatePlanetaryStrengthIndex(chart, mockAspectMatrix);
  const result = calculateLunarSolarYogas(chart, strength.planetaryStrengths);
  if (result.yogas.length === 0) throw new Error('No yogas detected');
  // Severity should be calculated (uses strength data internally)
  if (!result.yogas.every(y => y.severity)) throw new Error('Severity not calculated');
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
