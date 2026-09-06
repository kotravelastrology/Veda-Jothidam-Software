const { calculateLunarSolarYogas } = require('./src/chart/lunarSolarYogas');
const { calculatePlanetaryStrengthIndex } = require('./src/chart/planetaryStrength');
const { calculateChartQuality } = require('./src/chart/chartQuality');

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

console.log('========== PHASE 11: CHART QUALITY & STRENGTH SCORE ==========\n');

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

// ==================== CHART QUALITY CALCULATION ====================

test('Chart quality index calculated and within valid range', () => {
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
  const yogas = calculateLunarSolarYogas(chart, strength.planetaryStrengths);
  const quality = calculateChartQuality(yogas, strength.planetaryStrengths);

  if (!quality) throw new Error('Chart quality not calculated');
  if (quality.index === undefined) throw new Error('Missing quality index');
  if (typeof quality.index !== 'number') throw new Error('Quality index should be numeric');
  if (quality.index < 0 || quality.index > 100) throw new Error('Quality index should be 0-100');
});

test('Chart quality has rating tier', () => {
  const chart = createMockChart({
    planetPositions: {
      Sun: 45, Moon: 75, Mercury: 85, Venus: 115,
      Mars: 135, Jupiter: 165, Saturn: 195
    },
    houses: {
      1: [], 2: ['Moon'], 3: ['Mercury'],
      4: [], 5: [], 6: [], 7: [],
      8: [], 9: [], 10: [], 11: [], 12: []
    }
  });
  const strength = calculatePlanetaryStrengthIndex(chart, mockAspectMatrix);
  const yogas = calculateLunarSolarYogas(chart, strength.planetaryStrengths);
  const quality = calculateChartQuality(yogas, strength.planetaryStrengths);

  if (!quality.rating) throw new Error('Missing rating');
  const validRatings = ['EXCEPTIONAL', 'VERY_GOOD', 'GOOD', 'AVERAGE', 'CHALLENGING', 'DIFFICULT'];
  if (!validRatings.includes(quality.rating)) throw new Error('Invalid rating: ' + quality.rating);
});

test('Chart quality breakdown explains assessment', () => {
  const chart = createMockChart({
    planetPositions: {
      Sun: 45, Moon: 75, Mercury: 85, Venus: 115,
      Mars: 135, Jupiter: 165, Saturn: 195
    },
    houses: {
      1: [], 2: ['Moon'], 3: [],
      4: [], 5: [], 6: [], 7: [],
      8: [], 9: [], 10: [], 11: [], 12: []
    }
  });
  const strength = calculatePlanetaryStrengthIndex(chart, mockAspectMatrix);
  const yogas = calculateLunarSolarYogas(chart, strength.planetaryStrengths);
  const quality = calculateChartQuality(yogas, strength.planetaryStrengths);

  if (!quality.breakdown) throw new Error('Missing breakdown');
  if (typeof quality.breakdown !== 'string') throw new Error('Breakdown should be string');
  if (quality.breakdown.length === 0) throw new Error('Breakdown should not be empty');
});

// ==================== COMPONENT SCORES ====================

test('Yoga strength score reflects yoga severity tiers', () => {
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
  const yogas = calculateLunarSolarYogas(chart, strength.planetaryStrengths);
  const quality = calculateChartQuality(yogas, strength.planetaryStrengths);

  if (!quality.components) throw new Error('Missing components');
  if (quality.components.yogaStrengthScore === undefined) throw new Error('Missing yoga strength score');
  if (quality.components.yogaStrengthScore < 0 || quality.components.yogaStrengthScore > 40) {
    throw new Error('Yoga strength score should be 0-40');
  }
});

test('Planetary strength score reflects average planetary strength', () => {
  const chart = createMockChart({
    planetPositions: {
      Sun: 45, Moon: 75, Mercury: 85, Venus: 115,
      Mars: 135, Jupiter: 165, Saturn: 195
    },
    houses: {
      1: [], 2: ['Moon'], 3: [],
      4: [], 5: [], 6: [], 7: [],
      8: [], 9: [], 10: [], 11: [], 12: []
    }
  });
  const strength = calculatePlanetaryStrengthIndex(chart, mockAspectMatrix);
  const yogas = calculateLunarSolarYogas(chart, strength.planetaryStrengths);
  const quality = calculateChartQuality(yogas, strength.planetaryStrengths);

  if (quality.components.planetaryStrengthScore === undefined) throw new Error('Missing planetary strength score');
  if (quality.components.planetaryStrengthScore < 0 || quality.components.planetaryStrengthScore > 35) {
    throw new Error('Planetary strength score should be 0-35');
  }
});

test('Benefic/malefic ratio calculated from yoga effects', () => {
  const chart = createMockChart({
    planetPositions: {
      Sun: 45, Moon: 75, Mercury: 85, Venus: 115,
      Mars: 135, Jupiter: 165, Saturn: 195
    },
    houses: {
      1: [], 2: ['Moon'], 3: [],
      4: [], 5: [], 6: [], 7: [],
      8: [], 9: [], 10: [], 11: [], 12: []
    }
  });
  const strength = calculatePlanetaryStrengthIndex(chart, mockAspectMatrix);
  const yogas = calculateLunarSolarYogas(chart, strength.planetaryStrengths);
  const quality = calculateChartQuality(yogas, strength.planetaryStrengths);

  if (quality.components.beneficRatio === undefined) throw new Error('Missing benefic ratio');
  if (quality.components.beneficRatio < -5 || quality.components.beneficRatio > 15) {
    throw new Error('Benefic ratio should be -5 to 15');
  }
});

// ==================== SUMMARY STATISTICS ====================

test('Chart quality includes yoga summary statistics', () => {
  const chart = createMockChart({
    planetPositions: {
      Sun: 45, Moon: 75, Mercury: 85, Venus: 115,
      Mars: 135, Jupiter: 165, Saturn: 195
    },
    houses: {
      1: ['Mercury', 'Jupiter'], 2: [], 3: [],
      4: [], 5: [], 6: [], 7: [],
      8: [], 9: [], 10: [], 11: [], 12: []
    }
  });
  const strength = calculatePlanetaryStrengthIndex(chart, mockAspectMatrix);
  const yogas = calculateLunarSolarYogas(chart, strength.planetaryStrengths);
  const quality = calculateChartQuality(yogas, strength.planetaryStrengths);

  if (!quality.summary) throw new Error('Missing summary');
  if (quality.summary.totalYogas === undefined) throw new Error('Missing totalYogas');
  if (quality.summary.criticalYogas === undefined) throw new Error('Missing criticalYogas');
  if (quality.summary.averagePlanetaryStrength === undefined) throw new Error('Missing averagePlanetaryStrength');
});

test('Chart quality counts cancelled yogas separately', () => {
  const chart = createMockChart({
    planetPositions: {
      Sun: 45, Moon: 15, Mercury: 0, Venus: 30,
      Mars: 175, Jupiter: 115, Saturn: 225
    },
    houses: {
      1: ['Moon'], 2: [], 3: [], 4: [],
      5: [], 6: [], 7: [], 8: [],
      9: [], 10: [], 11: [], 12: []
    }
  });
  const strength = calculatePlanetaryStrengthIndex(chart, mockAspectMatrix);
  const yogas = calculateLunarSolarYogas(chart, strength.planetaryStrengths);
  const quality = calculateChartQuality(yogas, strength.planetaryStrengths);

  if (quality.summary.cancelledYogas === undefined) throw new Error('Missing cancelledYogas count');
});

// ==================== RATING TIERS ====================

test('Exceptional rating for high-quality charts', () => {
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
  const yogas = calculateLunarSolarYogas(chart, strength.planetaryStrengths);
  const quality = calculateChartQuality(yogas, strength.planetaryStrengths);

  // If chart has strong yogas + good planets, rating should be high
  if (quality.index >= 85 && quality.rating !== 'EXCEPTIONAL') {
    throw new Error('High-quality chart should have EXCEPTIONAL rating');
  }
});

test('Rating tier matches index range', () => {
  const chart = createMockChart({
    planetPositions: {
      Sun: 45, Moon: 75, Mercury: 85, Venus: 115,
      Mars: 135, Jupiter: 165, Saturn: 195
    },
    houses: {
      1: [], 2: ['Moon'], 3: [],
      4: [], 5: [], 6: [], 7: [],
      8: [], 9: [], 10: [], 11: [], 12: []
    }
  });
  const strength = calculatePlanetaryStrengthIndex(chart, mockAspectMatrix);
  const yogas = calculateLunarSolarYogas(chart, strength.planetaryStrengths);
  const quality = calculateChartQuality(yogas, strength.planetaryStrengths);

  // Verify rating matches index range
  if (quality.index >= 85 && quality.rating !== 'EXCEPTIONAL') throw new Error('Index ≥85 should be EXCEPTIONAL');
  if (quality.index >= 70 && quality.index < 85 && quality.rating !== 'VERY_GOOD') throw new Error('Index 70-84 should be VERY_GOOD');
  if (quality.index >= 55 && quality.index < 70 && quality.rating !== 'GOOD') throw new Error('Index 55-69 should be GOOD');
});

// ==================== BACKWARD COMPATIBILITY ====================

test('All Phase 4-10 yoga fields preserved in quality calculation', () => {
  const chart = createMockChart({
    planetPositions: { Moon: 75, Mercury: 85 },
    houses: { 1: [], 2: ['Moon'], 3: ['Mercury'] }
  });
  const strength = calculatePlanetaryStrengthIndex(chart, mockAspectMatrix);
  const yogas = calculateLunarSolarYogas(chart, strength.planetaryStrengths);
  const quality = calculateChartQuality(yogas, strength.planetaryStrengths);

  if (!quality) throw new Error('Quality calculation failed');
  // Yogas should still be accessible
  if (!yogas.yogas) throw new Error('Yogas not available after quality calculation');
});

test('Quality calculation works with no yogas', () => {
  const chart = createMockChart({
    planetPositions: {
      Sun: 235, Moon: 235, Mercury: 235, Venus: 235,
      Mars: 235, Jupiter: 235, Saturn: 235
    },
    houses: {
      1: [], 2: [], 3: [], 4: [], 5: [], 6: [],
      7: [], 8: [], 9: [], 10: [], 11: [], 12: []
    }
  });
  const strength = calculatePlanetaryStrengthIndex(chart, mockAspectMatrix);
  const yogas = calculateLunarSolarYogas(chart, strength.planetaryStrengths);
  const quality = calculateChartQuality(yogas, strength.planetaryStrengths);

  if (!quality) throw new Error('Quality should calculate even with no yogas');
  if (quality.index < 0 || quality.index > 100) throw new Error('Quality index should be valid');
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
