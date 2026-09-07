const {
  calculateEdgeCaseYogas,
  EDGE_CASE_YOGAS_CATALOG,
  detectHarshaYoga,
  detectVirinchiYoga,
  detectKusumaYogaVariant,
  detectAshtaLakshmiYoga,
  detectRajYogaCombination,
  detectLakshmiYoga,
  detectSaralaYoga,
  detectVridhiYoga
} = require('./src/chart/edgeCaseYogas');

const mockChart = (overrides = {}) => {
  // Helper: Calculate house from longitude and lagna
  const lagna = overrides.lagna?.longitude || 30;
  const calculateHouse = (longitude) => {
    const diff = (longitude - lagna + 360) % 360;
    return Math.floor(diff / 30) + 1;
  };

  const houses = {
    1: [], 2: [], 3: [], 4: [], 5: [], 6: [],
    7: [], 8: [], 9: [], 10: [], 11: [], 12: []
  };

  const planetData = {
    'Sun': { longitude: 45, ...overrides.sun },
    'Moon': { longitude: 75, ...overrides.moon },
    'Mars': { longitude: 105, ...overrides.mars },
    'Mercury': { longitude: 135, ...overrides.mercury },
    'Jupiter': { longitude: 165, ...overrides.jupiter },
    'Venus': { longitude: 195, ...overrides.venus },
    'Saturn': { longitude: 225, ...overrides.saturn },
    ...overrides.planets
  };

  // Populate houses
  for (const [planetName, data] of Object.entries(planetData)) {
    const house = calculateHouse(data.longitude);
    houses[house].push(planetName);
  }

  return {
    lagna: {
      longitude: 30,
      ...overrides.lagna
    },
    planets: planetData,
    houses,
    ...overrides
  };
};

console.log('========== EDGE-CASE YOGA TESTS ==========\n');

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

// ==================== TEST 1: HARSHA YOGA ====================

test('Harsha Yoga - 6th lord in 6th house', () => {
  // Aries Ascendant (0): 6th house = Virgo (5), lord = Mercury
  const chart = mockChart({
    lagna: { longitude: 15 }, // Aries
    mercury: { longitude: 165 } // 5 * 30 + 15 = house 6
  });
  const result = detectHarshaYoga(chart);
  if (!result) throw new Error('Expected Harsha Yoga but not detected');
});

test('Harsha Yoga - 6th lord in 8th house', () => {
  // Aries Ascendant (0): 6th house = Virgo (5), lord = Mercury in 8th
  const chart = mockChart({
    lagna: { longitude: 15 }, // Aries
    mercury: { longitude: 225 } // 7 * 30 + 15 = house 8
  });
  const result = detectHarshaYoga(chart);
  if (!result) throw new Error('Expected Harsha Yoga but not detected');
});

test('Harsha Yoga - 6th lord in 10th (negative)', () => {
  // Aries Ascendant (0): 6th house = Virgo (5), lord = Mercury in 10th
  const chart = mockChart({
    lagna: { longitude: 15 }, // Aries
    mercury: { longitude: 285 } // 9 * 30 + 15 = house 10
  });
  const result = detectHarshaYoga(chart);
  if (result) throw new Error('Expected no Harsha Yoga');
});

// ==================== TEST 2: VIRINCHI YOGA ====================

test('Virinchi Yoga - 9th & 12th lords in angles', () => {
  // Aries Ascendant (0): 9th = Sagittarius (8) lord = Jupiter, 12th = Pisces (11) lord = Jupiter
  // Both at same planet, place Jupiter in angle (house 1)
  const chart = mockChart({
    lagna: { longitude: 15 },
    jupiter: { longitude: 25 } // House 1
  });
  const result = detectVirinchiYoga(chart);
  if (!result) throw new Error('Expected Virinchi Yoga but not detected');
});

test('Virinchi Yoga - 9th & 12th lords in trines', () => {
  // Place 9th lord in house 5, 12th lord in house 9
  const chart = mockChart({
    lagna: { longitude: 15 }, // Aries
    jupiter: { longitude: 145 }, // House 5
    mercury: { longitude: 255 } // House 9 (for 12th lord scenario)
  });
  const result = detectVirinchiYoga(chart);
  if (!result) throw new Error('Expected Virinchi Yoga but not detected');
});

test('Virinchi Yoga - 9th lord in angle, 12th lord in 3rd (negative)', () => {
  // For Aries Ascendant: 9th lord = Jupiter, 12th lord = Jupiter (same planet)
  // So we need a chart where Jupiter is in angle but we artificially break the yoga
  // Actually, with both lords being the same planet, if either condition fails, yoga fails
  // Let's use Taurus Ascendant instead where 9th = Capricorn (Saturn), 12th = Aries (Mars)
  const chart = mockChart({
    lagna: { longitude: 45 }, // Taurus
    saturn: { longitude: 55 }, // House 1 (angular)
    mars: { longitude: 85 } // House 3 (not angular/trinal)
  });
  const result = detectVirinchiYoga(chart);
  if (result) throw new Error('Expected no Virinchi Yoga');
});

// ==================== TEST 3: KUSUMA YOGA VARIANT ====================

test('Kusuma Yoga Variant - 3 benefics in angles/trines', () => {
  const chart = mockChart({
    lagna: { longitude: 15 },
    jupiter: { longitude: 25 }, // House 1 (benefic)
    venus: { longitude: 145 }, // House 5 (benefic)
    mercury: { longitude: 195 } // House 7 (benefic)
  });
  const result = detectKusumaYogaVariant(chart);
  if (!result) throw new Error('Expected Kusuma Yoga Variant but not detected');
});

test('Kusuma Yoga Variant - 4 benefics', () => {
  const chart = mockChart({
    lagna: { longitude: 15 },
    jupiter: { longitude: 25 }, // House 1
    venus: { longitude: 115 }, // House 4
    mercury: { longitude: 145 }, // House 5
    moon: { longitude: 265 } // House 9
  });
  const result = detectKusumaYogaVariant(chart);
  if (!result) throw new Error('Expected Kusuma Yoga Variant but not detected');
});

test('Kusuma Yoga Variant - 2 benefics (negative)', () => {
  const chart = mockChart({
    lagna: { longitude: 15 },
    jupiter: { longitude: 25 }, // House 1
    venus: { longitude: 85 }, // House 3 (not in benefit houses)
    sun: { longitude: 225 } // House 8 (malefic)
  });
  const result = detectKusumaYogaVariant(chart);
  if (result) throw new Error('Expected no Kusuma Yoga Variant');
});

// ==================== TEST 4: ASHTA LAKSHMI YOGA ====================

test('Ashta Lakshmi Yoga - All 4 angles occupied', () => {
  const chart = mockChart({
    lagna: { longitude: 15 },
    sun: { longitude: 25 }, // House 1
    mars: { longitude: 115 }, // House 4
    venus: { longitude: 195 }, // House 7
    saturn: { longitude: 285 } // House 10
  });
  const result = detectAshtaLakshmiYoga(chart);
  if (!result) throw new Error('Expected Ashta Lakshmi Yoga but not detected');
});

test('Ashta Lakshmi Yoga - 3 angles occupied (negative)', () => {
  const chart = mockChart({
    lagna: { longitude: 15 },
    sun: { longitude: 25 }, // House 1
    mars: { longitude: 115 }, // House 4
    venus: { longitude: 195 }, // House 7
    // 10th house empty
  });
  const result = detectAshtaLakshmiYoga(chart);
  if (result) throw new Error('Expected no Ashta Lakshmi Yoga');
});

// ==================== TEST 5: RAJ YOGA COMBINATION ====================

test('Raj Yoga Combination - 3 planets in trines with benefic', () => {
  const chart = mockChart({
    lagna: { longitude: 15 },
    sun: { longitude: 145 }, // House 5 (trine)
    mars: { longitude: 265 }, // House 9 (trine)
    jupiter: { longitude: 285 } // House 10 (benefic)
  });
  const result = detectRajYogaCombination(chart);
  if (!result) throw new Error('Expected Raj Yoga Combination but not detected');
});

test('Raj Yoga Combination - 4 planets in trines with benefic', () => {
  const chart = mockChart({
    lagna: { longitude: 15 },
    sun: { longitude: 145 }, // House 5
    mars: { longitude: 155 }, // House 5
    moon: { longitude: 265 }, // House 9
    jupiter: { longitude: 275 } // House 9 (benefic)
  });
  const result = detectRajYogaCombination(chart);
  if (!result) throw new Error('Expected Raj Yoga Combination but not detected');
});

test('Raj Yoga Combination - 3 planets in trines but no benefic (negative)', () => {
  const chart = mockChart({
    lagna: { longitude: 15 },
    sun: { longitude: 145 }, // House 5
    mars: { longitude: 155 }, // House 5
    moon: { longitude: 275 }, // House 9
    jupiter: { longitude: 35 }, // House 1 (move benefic away)
    venus: { longitude: 55 }, // House 2 (move benefic away)
    mercury: { longitude: 75 } // House 3 (move benefic away)
  });
  const result = detectRajYogaCombination(chart);
  if (result) throw new Error('Expected no Raj Yoga Combination');
});

// ==================== TEST 6: LAKSHMI YOGA ====================

test('Lakshmi Yoga - 2nd & 9th lords 4 houses apart', () => {
  // Aries Ascendant: 2nd = Taurus (1) lord = Venus, 9th = Sagittarius (8) lord = Jupiter
  // Place Venus in house 1, Jupiter in house 5 (4 houses apart = angular/trinal)
  const chart = mockChart({
    lagna: { longitude: 15 },
    venus: { longitude: 25 }, // House 1
    jupiter: { longitude: 145 } // House 5
  });
  const result = detectLakshmiYoga(chart);
  if (!result) throw new Error('Expected Lakshmi Yoga but not detected');
});

test('Lakshmi Yoga - 2nd & 9th lords 5 houses apart', () => {
  const chart = mockChart({
    lagna: { longitude: 15 },
    venus: { longitude: 25 }, // House 1
    jupiter: { longitude: 165 } // House 6
  });
  const result = detectLakshmiYoga(chart);
  if (!result) throw new Error('Expected Lakshmi Yoga but not detected');
});

test('Lakshmi Yoga - 2nd & 9th lords 3 houses apart (negative)', () => {
  const chart = mockChart({
    lagna: { longitude: 15 },
    venus: { longitude: 25 }, // House 1
    jupiter: { longitude: 125 } // House 4
  });
  const result = detectLakshmiYoga(chart);
  if (result) throw new Error('Expected no Lakshmi Yoga');
});

// ==================== TEST 7: SARALA YOGA ====================

test('Sarala Yoga - 3rd & 8th lords in angles/trines', () => {
  // Aries Ascendant: 3rd = Gemini (2) lord = Mercury, 8th = Scorpio (7) lord = Mars
  // Place Mercury in house 1 (angle), Mars in house 5 (trine)
  const chart = mockChart({
    lagna: { longitude: 15 },
    mercury: { longitude: 25 }, // House 1
    mars: { longitude: 145 } // House 5
  });
  const result = detectSaralaYoga(chart);
  if (!result) throw new Error('Expected Sarala Yoga but not detected');
});

test('Sarala Yoga - 3rd & 8th lords both in trines', () => {
  const chart = mockChart({
    lagna: { longitude: 15 },
    mercury: { longitude: 145 }, // House 5
    mars: { longitude: 265 } // House 9
  });
  const result = detectSaralaYoga(chart);
  if (!result) throw new Error('Expected Sarala Yoga but not detected');
});

test('Sarala Yoga - 3rd lord in angle, 8th lord in 2nd (negative)', () => {
  const chart = mockChart({
    lagna: { longitude: 15 },
    mercury: { longitude: 25 }, // House 1
    mars: { longitude: 75 } // House 3
  });
  const result = detectSaralaYoga(chart);
  if (result) throw new Error('Expected no Sarala Yoga');
});

// ==================== TEST 8: VRIDHI YOGA ====================

test('Vridhi Yoga - 11th lord in angle with benefic in 11th', () => {
  // Aries Ascendant: 11th = Aquarius (10) lord = Saturn
  // Place Saturn in house 1 (angle), and benefic in house 11
  const chart = mockChart({
    lagna: { longitude: 15 },
    saturn: { longitude: 25 }, // House 1
    venus: { longitude: 325 } // House 11
  });
  const result = detectVridhiYoga(chart);
  if (!result) throw new Error('Expected Vridhi Yoga but not detected');
});

test('Vridhi Yoga - 11th lord in trine', () => {
  const chart = mockChart({
    lagna: { longitude: 15 },
    saturn: { longitude: 265 }, // House 9 (trine)
    venus: { longitude: 325 } // House 11
  });
  const result = detectVridhiYoga(chart);
  if (!result) throw new Error('Expected Vridhi Yoga but not detected');
});

test('Vridhi Yoga - 11th lord in 2nd (negative)', () => {
  const chart = mockChart({
    lagna: { longitude: 15 },
    jupiter: { longitude: 75 }, // House 3
    venus: { longitude: 295 } // House 11
  });
  const result = detectVridhiYoga(chart);
  if (result) throw new Error('Expected no Vridhi Yoga');
});

// ==================== INTEGRATION TESTS ====================

test('Calculate Edge-Case Yogas - Full pipeline', () => {
  // Setup chart with Virinchi Yoga: 9th & 12th lords in angles
  // Aries Ascendant: 9th = Jupiter, 12th = Jupiter (both in house 1 = angle)
  const chart = mockChart({
    lagna: { longitude: 15 },
    jupiter: { longitude: 25 }, // House 1 (9th and 12th lord)
    venus: { longitude: 55 }, // House 2
    mercury: { longitude: 85 }, // House 3
    sun: { longitude: 115 }, // House 4
    mars: { longitude: 145 }, // House 5
    saturn: { longitude: 235 } // House 8
  });
  const result = calculateEdgeCaseYogas(chart);
  if (!result.yogas || result.yogas.length === 0) {
    throw new Error('Expected some yogas to be detected (Virinchi Yoga should match)');
  }
  if (result.totalMatched !== result.yogas.length) {
    throw new Error('Total matched should match yogas length');
  }
});

test('Calculate Edge-Case Yogas - Invalid chart', () => {
  const result = calculateEdgeCaseYogas(null);
  if (result.yogas.length !== 0 || result.totalMatched !== 0) {
    throw new Error('Expected empty yogas for invalid chart');
  }
});

test('Edge-Case Yogas Catalog metadata', () => {
  if (EDGE_CASE_YOGAS_CATALOG.length !== 8) {
    throw new Error(`Expected 8 yogas, got ${EDGE_CASE_YOGAS_CATALOG.length}`);
  }
  for (const yoga of EDGE_CASE_YOGAS_CATALOG) {
    if (!yoga.id || !yoga.name || !yoga.chapter || !yoga.formation || !yoga.effects) {
      throw new Error(`Yoga missing required metadata: ${yoga.name}`);
    }
    if (typeof yoga.detection !== 'function') {
      throw new Error(`Yoga missing detection function: ${yoga.name}`);
    }
  }
});

test('Source attribution present', () => {
  const chart = mockChart({
    lagna: { longitude: 15 },
    jupiter: { longitude: 25 },
    venus: { longitude: 55 },
    mercury: { longitude: 85 }
  });
  const result = calculateEdgeCaseYogas(chart);
  if (!result.source || !result.source.title || !result.source.convention) {
    throw new Error('Source attribution missing');
  }
});

test('Multiple yogas detection', () => {
  // Setup chart for multiple yogas:
  // 1. Ashta Lakshmi: All 4 angles (1, 4, 7, 10) occupied
  // 2. Virinchi: 9th & 12th lords in angles
  const chart = mockChart({
    lagna: { longitude: 15 },
    sun: { longitude: 25 }, // House 1
    mars: { longitude: 115 }, // House 4
    venus: { longitude: 195 }, // House 7
    mercury: { longitude: 285 }, // House 10
    jupiter: { longitude: 265 }, // House 9 (also 9th & 12th lord)
    saturn: { longitude: 325 } // House 11
  });
  const result = calculateEdgeCaseYogas(chart);
  if (result.yogas.length < 2) {
    throw new Error(`Expected multiple yogas to be detected, but got ${result.yogas.length}: ${result.yogas.map(y => y.name).join(', ')}`);
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
