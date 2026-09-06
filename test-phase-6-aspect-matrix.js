const {
  calculateAspectMatrix,
  calculateAspectStrength,
  isValidAspect,
  getPlanetModifier,
  getHouseModifier,
  isBeneficAspect,
} = require('./src/chart/aspectMatrix');

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

console.log('========== PHASE 6: ASPECT MATRIX ENGINE ==========\n');

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

// ==================== ASPECT VALIDITY ====================

test('Sun aspects Moon in 7th house', () => {
  if (!isValidAspect('Sun', 'Moon', 1, 7)) throw new Error('Sun should aspect 7th house');
});

test('Sun does not aspect planets in other houses', () => {
  if (isValidAspect('Sun', 'Mercury', 1, 2)) throw new Error('Sun should not aspect 2nd house');
});

test('Mars aspects 4th, 8th, 7th from its house', () => {
  if (!isValidAspect('Mars', 'Venus', 1, 4)) throw new Error('Mars in 1st should aspect 4th');
  if (!isValidAspect('Mars', 'Mercury', 1, 8)) throw new Error('Mars in 1st should aspect 8th');
  if (!isValidAspect('Mars', 'Saturn', 1, 7)) throw new Error('Mars in 1st should aspect 7th');
});

test('Jupiter aspects 5th, 9th, 7th from its house', () => {
  if (!isValidAspect('Jupiter', 'Venus', 1, 5)) throw new Error('Jupiter in 1st should aspect 5th');
  if (!isValidAspect('Jupiter', 'Saturn', 1, 9)) throw new Error('Jupiter in 1st should aspect 9th');
  if (!isValidAspect('Jupiter', 'Mercury', 1, 7)) throw new Error('Jupiter in 1st should aspect 7th');
});

test('Saturn aspects 3rd, 10th, 7th from its house', () => {
  if (!isValidAspect('Saturn', 'Venus', 1, 3)) throw new Error('Saturn in 1st should aspect 3rd');
  if (!isValidAspect('Saturn', 'Mercury', 1, 10)) throw new Error('Saturn in 1st should aspect 10th');
  if (!isValidAspect('Saturn', 'Moon', 1, 7)) throw new Error('Saturn in 1st should aspect 7th');
});

// ==================== BENEFIC ASPECT STRENGTH ====================

test('Jupiter 7th aspect (benefic) base strength +1', () => {
  const chart = createMockChart({
    planetPositions: { Jupiter: 45, Moon: 195 },
    houses: { 1: ['Jupiter'], 7: ['Moon'] }
  });
  const strength = calculateAspectStrength(chart, 'Jupiter', 'Moon');
  if (strength < 0.5) throw new Error(`Expected strength > 0.5, got ${strength}`);
});

test('Venus 7th aspect (benefic) base strength +1', () => {
  const chart = createMockChart({
    planetPositions: { Venus: 45, Mercury: 195 },
    houses: { 1: ['Venus'], 7: ['Mercury'] }
  });
  const strength = calculateAspectStrength(chart, 'Venus', 'Mercury');
  if (strength < 0.5) throw new Error(`Expected strength > 0.5, got ${strength}`);
});

test('Mercury 7th aspect (benefic) base strength +1', () => {
  const chart = createMockChart({
    planetPositions: { Mercury: 45, Saturn: 195 },
    houses: { 1: ['Mercury'], 7: ['Saturn'] }
  });
  const strength = calculateAspectStrength(chart, 'Mercury', 'Saturn');
  if (strength < 0.5) throw new Error(`Expected strength > 0.5, got ${strength}`);
});

// ==================== MALEFIC ASPECT STRENGTH ====================

test('Mars 7th aspect (malefic) base strength -1', () => {
  const chart = createMockChart({
    planetPositions: { Mars: 45, Jupiter: 195 },
    houses: { 1: ['Mars'], 7: ['Jupiter'] }
  });
  const strength = calculateAspectStrength(chart, 'Mars', 'Jupiter');
  if (strength > -0.5) throw new Error(`Expected strength < -0.5, got ${strength}`);
});

test('Saturn 7th aspect (malefic) base strength -1', () => {
  const chart = createMockChart({
    planetPositions: { Saturn: 45, Venus: 195 },
    houses: { 1: ['Saturn'], 7: ['Venus'] }
  });
  const strength = calculateAspectStrength(chart, 'Saturn', 'Venus');
  if (strength > -0.5) throw new Error(`Expected strength < -0.5, got ${strength}`);
});

// ==================== PLANET MODIFIER ====================

test('Exalted planet gets +1 modifier', () => {
  const modifier = getPlanetModifier('Jupiter', 105); // Cancer (exalted)
  if (modifier !== 1.0) throw new Error(`Expected modifier 1.0, got ${modifier}`);
});

test('Debilitated planet gets -1 modifier', () => {
  const modifier = getPlanetModifier('Jupiter', 285); // Capricorn (debilitated)
  if (modifier !== -1.0) throw new Error(`Expected modifier -1.0, got ${modifier}`);
});

test('Neutral planet gets 0 modifier', () => {
  const modifier = getPlanetModifier('Jupiter', 75); // Gemini (neutral)
  if (modifier !== 0) throw new Error(`Expected modifier 0, got ${modifier}`);
});

// ==================== HOUSE MODIFIER ====================

test('Angular house (1) gets 1.0 multiplier', () => {
  if (getHouseModifier(1) !== 1.0) throw new Error('Angular house should be 1.0');
});

test('Angular house (4) gets 1.0 multiplier', () => {
  if (getHouseModifier(4) !== 1.0) throw new Error('Angular house should be 1.0');
});

test('Trinal house (5) gets 0.8 multiplier', () => {
  if (getHouseModifier(5) !== 0.8) throw new Error('Trinal house should be 0.8');
});

test('Trinal house (9) gets 0.8 multiplier', () => {
  if (getHouseModifier(9) !== 0.8) throw new Error('Trinal house should be 0.8');
});

test('Dusthana house (6) gets 1.2 multiplier', () => {
  if (getHouseModifier(6) !== 1.2) throw new Error('Dusthana house should be 1.2');
});

test('Other house (2) gets 1.0 multiplier', () => {
  if (getHouseModifier(2) !== 1.0) throw new Error('Other house should be 1.0');
});

// ==================== ASPECT MATRIX GENERATION ====================

test('Aspect matrix generated with all planets', () => {
  const chart = createMockChart({
    planetPositions: {
      Sun: 45,
      Moon: 75,
      Mercury: 85,
      Venus: 115,
      Mars: 135,
      Jupiter: 165,
      Saturn: 195,
    },
    houses: {
      1: ['Sun', 'Mercury', 'Venus'],
      2: ['Moon'],
      3: [],
      4: ['Mars'],
      5: [],
      6: [],
      7: ['Jupiter', 'Saturn'],
      8: [],
      9: [],
      10: [],
      11: [],
      12: [],
    }
  });

  const result = calculateAspectMatrix(chart);
  if (!result.matrix || result.matrix.length !== 7) throw new Error('Matrix should be 7x7');
});

test('Summary contains beneficial aspects count', () => {
  const chart = createMockChart({
    planetPositions: {
      Sun: 45,
      Moon: 75,
      Mercury: 85,
      Venus: 115,
      Mars: 135,
      Jupiter: 165,
      Saturn: 195,
    },
    houses: {
      1: ['Sun', 'Mercury', 'Venus'],
      2: ['Moon'],
      3: [],
      4: ['Mars'],
      5: [],
      6: [],
      7: ['Jupiter', 'Saturn'],
      8: [],
      9: [],
      10: [],
      11: [],
      12: [],
    }
  });

  const result = calculateAspectMatrix(chart);
  if (result.summary.totalBeneficAspects === undefined) throw new Error('Missing benefic count');
  if (result.summary.totalBeneficAspects < 0) throw new Error('Benefic count should be non-negative');
});

test('Aspect details include strength values', () => {
  const chart = createMockChart({
    planetPositions: {
      Sun: 45,
      Moon: 75,
      Mercury: 85,
      Venus: 115,
      Mars: 135,
      Jupiter: 165,
      Saturn: 195,
    },
    houses: {
      1: ['Sun', 'Mercury', 'Venus'],
      2: ['Moon'],
      3: [],
      4: ['Mars'],
      5: [],
      6: [],
      7: ['Jupiter', 'Saturn'],
      8: [],
      9: [],
      10: [],
      11: [],
      12: [],
    }
  });

  const result = calculateAspectMatrix(chart);
  for (const key in result.aspectDetails) {
    const detail = result.aspectDetails[key];
    if (detail.strength === undefined) throw new Error(`${key} missing strength`);
    if (detail.isBenefic === undefined) throw new Error(`${key} missing benefic flag`);
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
