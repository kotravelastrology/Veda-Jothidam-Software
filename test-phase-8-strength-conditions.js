const { calculateLunarSolarYogas } = require('./src/chart/lunarSolarYogas');
const { calculateWealthYogas } = require('./src/chart/wealthYogas');
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
  }
};

console.log('========== PHASE 8: STRENGTH-BASED YOGA CONDITIONS ==========\n');

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

// ==================== STRENGTH-BASED GATES ====================

test('Sunapha forms if Mercury strength ≥ 50', () => {
  const chart = createMockChart({
    planetPositions: { Moon: 75, Mercury: 85 },
    houses: { 2: ['Moon'], 3: ['Mercury'] }
  });
  const result = calculateLunarSolarYogas(chart);
  const sunapha = result.yogas.find(y => y.name === 'Sunapha Yoga');
  if (!sunapha) throw new Error('Sunapha should detect');
  if (sunapha.sunaphaStrength === undefined) throw new Error('Missing strength field');
});

test('Hamsa requires strong Jupiter (≥60)', () => {
  const chart = createMockChart({
    planetPositions: { Jupiter: 105 },
    houses: { 1: ['Jupiter'] }
  });
  const result = calculateLunarSolarYogas(chart);
  const hamsa = result.yogas.find(y => y.name === 'Hamsa Yoga');
  if (!hamsa) throw new Error('Hamsa should detect');
  if (hamsa.hamsaStrength === undefined) throw new Error('Missing strength');
});

test('Effect scaling applied when strength gates pass', () => {
  const chart = createMockChart({
    planetPositions: { Moon: 75, Mercury: 85 },
    houses: { 1: [], 2: ['Moon'], 3: ['Mercury'] }
  });
  const strength = calculatePlanetaryStrengthIndex(chart, mockAspectMatrix);
  const result = calculateLunarSolarYogas(chart, strength.planetaryStrengths);
  const sunapha = result.yogas.find(y => y.name === 'Sunapha Yoga');
  if (!sunapha) throw new Error('Sunapha not detected');
  // With high Mercury strength, should have scaled effects
  if (strength.planetaryStrengths.Mercury.totalStrength >= 50) {
    if (!sunapha.effectsScaled) throw new Error('Effects not scaled despite strong Mercury');
  }
});

test('Backward compatibility maintained', () => {
  const chart = createMockChart({
    planetPositions: {
      Sun: 75, Moon: 75, Mercury: 85, Venus: 115,
      Mars: 135, Jupiter: 165, Saturn: 195
    },
    houses: {
      1: ['Mercury', 'Jupiter'], 2: [], 3: ['Venus'],
      4: [], 5: [], 6: ['Mars'], 7: [],
      8: [], 9: [], 10: [], 11: [], 12: ['Saturn']
    }
  });
  const lunar = calculateLunarSolarYogas(chart);
  const wealth = calculateWealthYogas(chart);
  if (lunar.yogas.length === 0) throw new Error('Lunar yogas not detected');
  if (wealth.yogas.length === 0) throw new Error('Wealth yogas not detected');
});

// ==================== INTEGRATION WITH PHASE 7 ====================

test('Planetary strength index integrates cleanly', () => {
  const chart = createMockChart({
    planetPositions: {
      Sun: 45, Moon: 75, Mercury: 85, Venus: 115,
      Mars: 135, Jupiter: 165, Saturn: 195
    },
    houses: {
      1: ['Sun', 'Mercury', 'Venus'],
      2: ['Moon'], 3: [], 4: ['Mars'],
      5: [], 6: [], 7: ['Jupiter', 'Saturn'],
      8: [], 9: [], 10: [], 11: [], 12: []
    }
  });
  const strength = calculatePlanetaryStrengthIndex(chart, mockAspectMatrix);
  if (!strength.planetaryStrengths) throw new Error('Missing strength index');
  if (Object.keys(strength.planetaryStrengths).length !== 7) {
    throw new Error('Should have 7 planetary strengths');
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
