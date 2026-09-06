const {
  calculatePlanetaryStrengthIndex,
  calculatePlanetStrength,
  getExaltationComponent,
  getHouseComponent,
  getAspectComponent,
  getSignStrengthComponent,
  getNakshatraComponent,
  getRatingFromScore,
  getPlanetSignStatus,
} = require('./src/chart/planetaryStrength');

// Mock chart helper
function createMockChart(config = {}) {
  const houses = config.houses || {
    1: [], 2: [], 3: [], 4: [], 5: [], 6: [],
    7: [], 8: [], 9: [], 10: [], 11: [], 12: [],
  };

  return {
    lagna: config.lagna || { longitude: 0 },
    planetPositions: config.planetPositions || {},
    houses,
  };
}

// Mock aspect matrix
const mockAspectMatrix = {
  aspectDetails: {
    'Jupiter-Sun': { aspected: 'Sun', isBenefic: true, strength: 2 },
    'Venus-Sun': { aspected: 'Sun', isBenefic: true, strength: 1.5 },
    'Mars-Moon': { aspected: 'Moon', isBenefic: false, strength: -2 },
  }
};

console.log('========== PHASE 7: PLANETARY STRENGTH INDEX ==========\n');

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

// ==================== PLANET SIGN STATUS ====================

test('Jupiter exalted in Cancer', () => {
  const status = getPlanetSignStatus('Jupiter', 105);
  if (status !== 'exalted') throw new Error(`Expected exalted, got ${status}`);
});

test('Jupiter own sign in Sagittarius', () => {
  const status = getPlanetSignStatus('Jupiter', 255);
  if (status !== 'own') throw new Error(`Expected own, got ${status}`);
});

test('Jupiter debilitated in Capricorn', () => {
  const status = getPlanetSignStatus('Jupiter', 285);
  if (status !== 'debilitated') throw new Error(`Expected debilitated, got ${status}`);
});

// ==================== EXALTATION COMPONENT ====================

test('Exalted planet: +30', () => {
  const comp = getExaltationComponent('Jupiter', 105); // Cancer (exalted)
  if (comp !== 30) throw new Error(`Expected 30, got ${comp}`);
});

test('Own sign: +15', () => {
  const comp = getExaltationComponent('Jupiter', 255); // Sagittarius (own)
  if (comp !== 15) throw new Error(`Expected 15, got ${comp}`);
});

test('Debilitated: −30', () => {
  const comp = getExaltationComponent('Jupiter', 285); // Capricorn (debilitated)
  if (comp !== -30) throw new Error(`Expected -30, got ${comp}`);
});

// ==================== HOUSE COMPONENT ====================

test('Angular house (1): +20', () => {
  const comp = getHouseComponent(1);
  if (comp !== 20) throw new Error(`Expected 20, got ${comp}`);
});

test('Trinal house (5): +10', () => {
  const comp = getHouseComponent(5);
  if (comp !== 10) throw new Error(`Expected 10, got ${comp}`);
});

test('Upachaya house (3): +5', () => {
  const comp = getHouseComponent(3);
  if (comp !== 5) throw new Error(`Expected 5, got ${comp}`);
});

test('Trika house (8): −15', () => {
  const comp = getHouseComponent(8);
  if (comp !== -15) throw new Error(`Expected -15, got ${comp}`);
});

test('Other house (2): 0', () => {
  const comp = getHouseComponent(2);
  if (comp !== 0) throw new Error(`Expected 0, got ${comp}`);
});

// ==================== ASPECT COMPONENT ====================

test('Benefic aspects increase strength', () => {
  const chart = createMockChart({
    planetPositions: { Sun: 45, Jupiter: 195 },
    houses: { 1: ['Sun'], 7: ['Jupiter'] }
  });
  const comp = getAspectComponent(chart, 'Sun', mockAspectMatrix);
  if (comp <= 0) throw new Error(`Expected positive aspect bonus, got ${comp}`);
});

test('Malefic aspects decrease strength', () => {
  const chart = createMockChart({
    planetPositions: { Moon: 75, Mars: 195 },
    houses: { 2: ['Moon'], 8: ['Mars'] }
  });
  const comp = getAspectComponent(chart, 'Moon', mockAspectMatrix);
  if (comp >= 0) throw new Error(`Expected negative aspect penalty, got ${comp}`);
});

// ==================== SIGN STRENGTH COMPONENT ====================

test('Own sign: +15', () => {
  const comp = getSignStrengthComponent('Jupiter', 255); // Sagittarius (own)
  if (comp !== 15) throw new Error(`Expected 15, got ${comp}`);
});

test('Exalted sign: +15', () => {
  const comp = getSignStrengthComponent('Jupiter', 105); // Cancer (exalted)
  if (comp !== 15) throw new Error(`Expected 15, got ${comp}`);
});

test('Enemy sign: −5', () => {
  const comp = getSignStrengthComponent('Jupiter', 45); // Aries (neutral/enemy)
  if (comp !== 0 && comp !== -5) throw new Error(`Expected 0 or -5, got ${comp}`);
});

// ==================== NAKSHATRA COMPONENT ====================

test('Early sign position: +10', () => {
  const comp = getNakshatraComponent(30); // 0 degrees of a sign
  if (comp !== 10) throw new Error(`Expected 10, got ${comp}`);
});

test('Mid sign position: +5', () => {
  const comp = getNakshatraComponent(40); // 10 degrees of a sign
  if (comp !== 5) throw new Error(`Expected 5, got ${comp}`);
});

test('Late sign position: −5', () => {
  const comp = getNakshatraComponent(58); // 28 degrees of a sign
  if (comp !== -5) throw new Error(`Expected -5, got ${comp}`);
});

// ==================== RATING SYSTEM ====================

test('Rating: Exceptionally Strong (81+)', () => {
  const rating = getRatingFromScore(85);
  if (rating !== 'Exceptionally Strong') throw new Error(`Expected 'Exceptionally Strong', got ${rating}`);
});

test('Rating: Very Strong (61-80)', () => {
  const rating = getRatingFromScore(70);
  if (rating !== 'Very Strong') throw new Error(`Expected 'Very Strong', got ${rating}`);
});

test('Rating: Moderate (41-60)', () => {
  const rating = getRatingFromScore(50);
  if (rating !== 'Moderate') throw new Error(`Expected 'Moderate', got ${rating}`);
});

test('Rating: Weak (21-40)', () => {
  const rating = getRatingFromScore(30);
  if (rating !== 'Weak') throw new Error(`Expected 'Weak', got ${rating}`);
});

test('Rating: Very Weak (1-20)', () => {
  const rating = getRatingFromScore(15);
  if (rating !== 'Very Weak') throw new Error(`Expected 'Very Weak', got ${rating}`);
});

test('Rating: Severely Afflicted (0)', () => {
  const rating = getRatingFromScore(0);
  if (rating !== 'Severely Afflicted') throw new Error(`Expected 'Severely Afflicted', got ${rating}`);
});

// ==================== COMPLETE STRENGTH INDEX ====================

test('Strength index calculated for all planets', () => {
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

  const result = calculatePlanetaryStrengthIndex(chart, mockAspectMatrix);
  if (!result.planetaryStrengths) throw new Error('Missing planetaryStrengths');
  if (Object.keys(result.planetaryStrengths).length !== 7) {
    throw new Error(`Expected 7 planets, got ${Object.keys(result.planetaryStrengths).length}`);
  }
});

test('Summary includes strongest and weakest planets', () => {
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

  const result = calculatePlanetaryStrengthIndex(chart, mockAspectMatrix);
  if (!result.summary.strongestPlanet) throw new Error('Missing strongest planet');
  if (!result.summary.weakestPlanet) throw new Error('Missing weakest planet');
  if (result.summary.averageStrength === undefined) throw new Error('Missing average strength');
});

test('Benefic and malefic strength totals calculated', () => {
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

  const result = calculatePlanetaryStrengthIndex(chart, mockAspectMatrix);
  if (result.summary.beneficStrengthTotal === undefined) throw new Error('Missing benefic total');
  if (result.summary.maleficStrengthTotal === undefined) throw new Error('Missing malefic total');
  if (result.summary.beneficStrengthTotal < 0) throw new Error('Benefic total should be non-negative');
});

// ==================== INDIVIDUAL PLANET STRENGTH ====================

test('Individual planet strength has all components', () => {
  const chart = createMockChart({
    planetPositions: { Jupiter: 165 },
    houses: { 7: ['Jupiter'] }
  });

  const strength = calculatePlanetStrength(chart, 'Jupiter', mockAspectMatrix);
  if (strength.totalStrength === undefined) throw new Error('Missing totalStrength');
  if (strength.components.exaltation === undefined) throw new Error('Missing exaltation');
  if (strength.components.house === undefined) throw new Error('Missing house');
  if (strength.components.aspect === undefined) throw new Error('Missing aspect');
  if (strength.components.sign === undefined) throw new Error('Missing sign');
  if (strength.components.nakshatra === undefined) throw new Error('Missing nakshatra');
  if (strength.rating === undefined) throw new Error('Missing rating');
});

test('Planetary strength within 0-100 range', () => {
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

  const result = calculatePlanetaryStrengthIndex(chart, mockAspectMatrix);
  for (const planet in result.planetaryStrengths) {
    const strength = result.planetaryStrengths[planet].totalStrength;
    if (strength < 0 || strength > 100) {
      throw new Error(`${planet} strength ${strength} outside 0-100 range`);
    }
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
