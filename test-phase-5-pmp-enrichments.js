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

console.log('========== PHASE 5: PANCHA MAHA PURUSHA YOGA ENRICHMENTS ==========\n');

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

// ==================== RUCHAKA YOGA (MARS) ====================

test('Ruchaka - Own sign angular (strength 3)', () => {
  const chart = createMockChart({
    lagna: { longitude: 15 },
    planetPositions: {
      Sun: 45,
      Moon: 75,
      Mercury: 0,
      Venus: 125,
      Mars: 15,     // Mars in Aries (sign 0, own sign) at 15 degrees
      Jupiter: 250,
      Saturn: 225,
    },
    houses: {
      1: ['Mars'],  // Mars in 1st (angular)
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
    }
  });

  const result = calculateLunarSolarYogas(chart);
  const ruchaka = result.yogas.find(y => y.name === 'Ruchaka Yoga');
  if (!ruchaka) throw new Error('Ruchaka not detected');
  if (ruchaka.ruchakaStrength !== 3) throw new Error(`Expected strength 3, got ${ruchaka.ruchakaStrength}`);
  if (ruchaka.mars_sign_status !== 'own sign') throw new Error('Mars should be in own sign');
});

test('Ruchaka - Strength metadata tracked', () => {
  const chart = createMockChart({
    lagna: { longitude: 15 },
    planetPositions: {
      Sun: 45,
      Moon: 75,
      Mercury: 0,
      Venus: 125,
      Mars: 15,     // Mars in Aries (own sign)
      Jupiter: 250,
      Saturn: 225,
    },
    houses: {
      1: ['Mars'],  // Mars in 1st (angular)
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
    }
  });

  const result = calculateLunarSolarYogas(chart);
  const ruchaka = result.yogas.find(y => y.name === 'Ruchaka Yoga');
  if (!ruchaka) throw new Error('Ruchaka not detected');
  if (ruchaka.ruchakaStrength === undefined) throw new Error('Strength metadata missing');
  if (ruchaka.mars_house === undefined) throw new Error('Mars house metadata missing');
  if (ruchaka.mars_sign_status === undefined) throw new Error('Mars sign status metadata missing');
});

// ==================== BHADRA YOGA (MERCURY) ====================

test('Bhadra - Own sign angular with Jupiter (strength 4)', () => {
  const chart = createMockChart({
    lagna: { longitude: 15 },
    planetPositions: {
      Sun: 45,
      Moon: 75,
      Mercury: 165,  // Mercury in Virgo (sign 5, own sign) at 165 degrees
      Venus: 125,
      Mars: 175,
      Jupiter: 170,  // Jupiter in same house/nearby for aspect
      Saturn: 225,
    },
    houses: {
      1: ['Mercury', 'Jupiter'],  // Both in same angular house
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
    }
  });

  const result = calculateLunarSolarYogas(chart);
  const bhadra = result.yogas.find(y => y.name === 'Bhadra Yoga');
  if (!bhadra) throw new Error('Bhadra not detected');
  if (bhadra.bhadraStrength !== 4) throw new Error(`Expected strength 4, got ${bhadra.bhadraStrength}`);
  if (!bhadra.effects.includes('Exceptional')) throw new Error('Effects should mention Exceptional');
});

test('Bhadra - Own sign angular (strength 3)', () => {
  const chart = createMockChart({
    lagna: { longitude: 15 },
    planetPositions: {
      Sun: 45,
      Moon: 75,
      Mercury: 75,   // Mercury in Gemini (sign 2, own sign) at 75 degrees
      Venus: 125,
      Mars: 175,
      Jupiter: 250,
      Saturn: 225,
    },
    houses: {
      1: ['Mercury'],
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
      12: ['Jupiter'],
    }
  });

  const result = calculateLunarSolarYogas(chart);
  const bhadra = result.yogas.find(y => y.name === 'Bhadra Yoga');
  if (!bhadra) throw new Error('Bhadra not detected');
  if (bhadra.bhadraStrength !== 3) throw new Error(`Expected strength 3, got ${bhadra.bhadraStrength}`);
  if (bhadra.mercury_sign_status !== 'own sign') throw new Error('Mercury should be in own sign');
});

// ==================== HAMSA YOGA (JUPITER) ====================

test('Hamsa - Exalted angular (strength 4)', () => {
  const chart = createMockChart({
    lagna: { longitude: 15 },
    planetPositions: {
      Sun: 45,
      Moon: 75,
      Mercury: 0,
      Venus: 125,
      Mars: 175,
      Jupiter: 105,  // Jupiter in Cancer (sign 3, exalted) at 105 degrees
      Saturn: 225,
    },
    houses: {
      1: ['Jupiter'],
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
    }
  });

  const result = calculateLunarSolarYogas(chart);
  const hamsa = result.yogas.find(y => y.name === 'Hamsa Yoga');
  if (!hamsa) throw new Error('Hamsa not detected');
  if (hamsa.hamsaStrength !== 4) throw new Error(`Expected strength 4, got ${hamsa.hamsaStrength}`);
  if (!hamsa.effects.includes('Exceptional')) throw new Error('Effects should mention Exceptional');
  if (hamsa.jupiter_sign_status !== 'exalted') throw new Error('Jupiter should be exalted');
});

test('Hamsa - Own sign angular (strength 3)', () => {
  const chart = createMockChart({
    lagna: { longitude: 15 },
    planetPositions: {
      Sun: 45,
      Moon: 75,
      Mercury: 0,
      Venus: 125,
      Mars: 175,
      Jupiter: 255,  // Jupiter in Sagittarius (sign 8, own sign) at 255 degrees
      Saturn: 225,
    },
    houses: {
      1: ['Jupiter'],
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
    }
  });

  const result = calculateLunarSolarYogas(chart);
  const hamsa = result.yogas.find(y => y.name === 'Hamsa Yoga');
  if (!hamsa) throw new Error('Hamsa not detected');
  if (hamsa.hamsaStrength !== 3) throw new Error(`Expected strength 3, got ${hamsa.hamsaStrength}`);
  if (hamsa.jupiter_sign_status !== 'own sign') throw new Error('Jupiter should be in own sign');
});

// ==================== MALAVYA YOGA (VENUS) ====================

test('Malavya - Exalted angular (strength 4)', () => {
  const chart = createMockChart({
    lagna: { longitude: 15 },
    planetPositions: {
      Sun: 45,
      Moon: 75,
      Mercury: 0,
      Venus: 345,   // Venus in Pisces (sign 11, exalted) at 345 degrees
      Mars: 175,
      Jupiter: 250,
      Saturn: 225,
    },
    houses: {
      1: ['Venus'],
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
    }
  });

  const result = calculateLunarSolarYogas(chart);
  const malavya = result.yogas.find(y => y.name === 'Malavya Yoga');
  if (!malavya) throw new Error('Malavya not detected');
  if (malavya.malavyaStrength !== 4) throw new Error(`Expected strength 4, got ${malavya.malavyaStrength}`);
  if (!malavya.effects.includes('Exceptional')) throw new Error('Effects should mention Exceptional');
});

test('Malavya - Own sign angular (strength 3)', () => {
  const chart = createMockChart({
    lagna: { longitude: 15 },
    planetPositions: {
      Sun: 45,
      Moon: 75,
      Mercury: 0,
      Venus: 45,    // Venus in Taurus (sign 1, own sign) at 45 degrees
      Mars: 175,
      Jupiter: 250,
      Saturn: 225,
    },
    houses: {
      1: ['Venus'],
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
    }
  });

  const result = calculateLunarSolarYogas(chart);
  const malavya = result.yogas.find(y => y.name === 'Malavya Yoga');
  if (!malavya) throw new Error('Malavya not detected');
  if (malavya.malavyaStrength !== 3) throw new Error(`Expected strength 3, got ${malavya.malavyaStrength}`);
  if (malavya.venus_sign_status !== 'own sign') throw new Error('Venus should be in own sign');
});

// ==================== SASA YOGA (SATURN) ====================

test('Sasa - Exalted angular (strength 4)', () => {
  const chart = createMockChart({
    lagna: { longitude: 15 },
    planetPositions: {
      Sun: 45,
      Moon: 75,
      Mercury: 0,
      Venus: 125,
      Mars: 175,
      Jupiter: 250,
      Saturn: 195,  // Saturn in Libra (sign 6, exalted) at 195 degrees
    },
    houses: {
      1: ['Saturn'],
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
    }
  });

  const result = calculateLunarSolarYogas(chart);
  const sasa = result.yogas.find(y => y.name === 'Sasa Yoga');
  if (!sasa) throw new Error('Sasa not detected');
  if (sasa.sasaStrength !== 4) throw new Error(`Expected strength 4, got ${sasa.sasaStrength}`);
  if (!sasa.effects.includes('Exceptional')) throw new Error('Effects should mention Exceptional');
});

test('Sasa - Own sign angular (strength 3)', () => {
  const chart = createMockChart({
    lagna: { longitude: 15 },
    planetPositions: {
      Sun: 45,
      Moon: 75,
      Mercury: 0,
      Venus: 125,
      Mars: 175,
      Jupiter: 250,
      Saturn: 285,  // Saturn in Capricorn (sign 9, own sign) at 285 degrees
    },
    houses: {
      1: ['Saturn'],
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
    }
  });

  const result = calculateLunarSolarYogas(chart);
  const sasa = result.yogas.find(y => y.name === 'Sasa Yoga');
  if (!sasa) throw new Error('Sasa not detected');
  if (sasa.sasaStrength !== 3) throw new Error(`Expected strength 3, got ${sasa.sasaStrength}`);
  if (sasa.saturn_sign_status !== 'own sign') throw new Error('Saturn should be in own sign');
});

// ==================== BACKWARD COMPATIBILITY ====================

test('All 5 PMP yogas still detect correctly', () => {
  const chart = createMockChart({
    lagna: { longitude: 15 },
    planetPositions: {
      Sun: 75,
      Moon: 75,
      Mercury: 165,  // Virgo (own sign)
      Venus: 45,     // Taurus (own sign)
      Mars: 15,      // Aries (own sign)
      Jupiter: 255,  // Sagittarius (own sign)
      Saturn: 285,   // Capricorn (own sign)
    },
    houses: {
      1: ['Mercury', 'Mars', 'Venus'],
      2: [],
      3: [],
      4: ['Jupiter'],
      5: [],
      6: [],
      7: ['Saturn'],
      8: [],
      9: [],
      10: [],
      11: [],
      12: [],
    }
  });

  const result = calculateLunarSolarYogas(chart);
  const pmpYogas = result.yogas.filter(y =>
    ['Ruchaka Yoga', 'Bhadra Yoga', 'Hamsa Yoga', 'Malavya Yoga', 'Sasa Yoga'].includes(y.name)
  );
  if (pmpYogas.length < 5) throw new Error(`Expected 5 PMP yogas, found ${pmpYogas.length}`);
});

test('Enrichment metadata present on all PMP yogas', () => {
  const chart = createMockChart({
    lagna: { longitude: 15 },
    planetPositions: {
      Sun: 75,
      Moon: 75,
      Mercury: 165,
      Venus: 45,
      Mars: 15,
      Jupiter: 255,
      Saturn: 285,
    },
    houses: {
      1: ['Mercury', 'Mars', 'Venus'],
      2: [],
      3: [],
      4: ['Jupiter'],
      5: [],
      6: [],
      7: ['Saturn'],
      8: [],
      9: [],
      10: [],
      11: [],
      12: [],
    }
  });

  const result = calculateLunarSolarYogas(chart);
  const pmpYogas = result.yogas.filter(y =>
    ['Ruchaka Yoga', 'Bhadra Yoga', 'Hamsa Yoga', 'Malavya Yoga', 'Sasa Yoga'].includes(y.name)
  );

  for (const yoga of pmpYogas) {
    if (!yoga.name || !yoga.chapter || !yoga.effects) {
      throw new Error(`Yoga ${yoga.name} missing base metadata`);
    }
    const strengthField = yoga.name.split(' ')[0].toLowerCase() + 'Strength';
    if (yoga[strengthField] === undefined) {
      throw new Error(`${yoga.name} missing strength field`);
    }
  }
});

test('Multiple PMP yogas detected in one chart', () => {
  const chart = createMockChart({
    lagna: { longitude: 15 },
    planetPositions: {
      Sun: 75,
      Moon: 45,
      Mercury: 165,  // Virgo - own sign
      Venus: 45,     // Taurus - own sign
      Mars: 15,      // Aries - own sign
      Jupiter: 255,  // Sagittarius - own sign
      Saturn: 285,   // Capricorn - own sign
    },
    houses: {
      1: ['Mercury', 'Mars', 'Venus'],
      2: [],
      3: [],
      4: ['Jupiter'],
      5: [],
      6: [],
      7: ['Saturn'],
      8: [],
      9: [],
      10: [],
      11: [],
      12: ['Moon'],
    }
  });

  const result = calculateLunarSolarYogas(chart);
  const pmpYogas = result.yogas.filter(y =>
    ['Ruchaka Yoga', 'Bhadra Yoga', 'Hamsa Yoga', 'Malavya Yoga', 'Sasa Yoga'].includes(y.name)
  );
  if (pmpYogas.length < 3) throw new Error(`Expected at least 3 PMP yogas, got ${pmpYogas.length}`);
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
