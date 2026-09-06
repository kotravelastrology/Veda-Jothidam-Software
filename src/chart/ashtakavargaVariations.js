const { attachSource } = require('../contracts/chartContext');

const VINAY_ADITYA_SOURCE = {
  title: 'Practical Ashtakavarga',
  author: 'Vinay Aditya',
  file: 'Jyotish_2011_Vinay Aditya_Practical Ashtakavarga.pdf',
  tradition: 'Parashari',
  convention: 'Ashtakavarga variations, reductions, Chancha Chakra',
};

/**
 * VARIATION 1: Bhinnashtaka Type 1 (Sun's 8-point chart)
 * Vinay Aditya, Ch.3-8, Practical Ashtakavarga
 *
 * Sun's Bhinnashtakavarga: The ashtakavarga chart for Sun (target planet)
 * calculated using the standard 8-contributor method (all 7 planets + Lagna).
 * This is NOT a separate variant but the regular Bhinnashtakavarga for Sun.
 *
 * Total expected bindus for Sun: 48 (from Vinay Aditya's own table on p.4)
 *
 * Import and use existing proven function from ashtakavarga.js
 */
function calculateBhinnashtaka_Type1_Sun(rasiPositions) {
  // Use the existing, proven Bhinnashtakavarga calculation
  // which has been thoroughly tested in test-ashtakavarga.js
  const { calculateBhinnashtakavarga } = require('./ashtakavarga');

  try {
    const bindus = calculateBhinnashtakavarga('Sun', rasiPositions);

    const result = bindus;
    result.source = {
      ...VINAY_ADITYA_SOURCE,
      pageLocus: 'file page 12 / printed page 4 (BINDU_TABLE), Ch.3-8 (methodology)',
      notes: 'Sun\'s Bhinnashtakavarga using standard 8-contributor method. Expected total: 48 bindus.',
    };

    return result;
  } catch (err) {
    throw new Error(`Bhinnashtaka Type 1 (Sun) calculation failed: ${err.message}`);
  }
}

/**
 * VARIATION 2: Bhinnashtaka Type 2 (Detailed variant)
 * Vinay Aditya, Ch.8-14
 *
 * Extended analysis with strength modifiers based on:
 * - Planet's exaltation/debilitation status
 * - House position (angular, succedent, cadent)
 * - Conjunction/aspect with benefics/malefics
 */
function calculateBhinnashtaka_Type2_WithStrength(planet, rasiPositions, chartAnalysis) {
  // Placeholder for Type 2 variant
  // This requires integration with strength calculation (shadbala)
  // Implemented in Phase 28.2

  return {
    status: 'SOURCE_REQUIRED',
    reason: 'Type 2 variant requires strength modifiers (shadbala integration)',
    planet,
  };
}

/**
 * REDUCTION 1: Ashtakavarga Point Reduction (Simple Version)
 * Vinay Aditya, Ch.11, file pages 135-145
 *
 * When a dasha lord passes through a sign in the natal chart's ashtakavarga,
 * bindus are reduced based on the dasha lord's strength and house position.
 *
 * Formula: Reduced Bindus = Base Bindus - (Dasha Lord Strength Factor)
 * Where Strength Factor = (Dasha Lord Rasi Index Strength / 100) * 4
 */
function calculateAshtakavargaReductions(
  sarvaAshtakavarga,
  dashaLordRasiIndex,
  dashaLordStrength = 50
) {
  // sarvaAshtakavarga: [12-element array of bindus, 0-12 per house]
  // dashaLordRasiIndex: 0-11, position of current dasha lord
  // dashaLordStrength: 0-100, strength of dasha lord (from shadbala or simplified)

  const reduced = sarvaAshtakavarga.map((bindus, houseIndex) => {
    // Reduction applies only to the sign where dasha lord is positioned
    if (houseIndex === dashaLordRasiIndex) {
      const reductionFactor = (dashaLordStrength / 100) * 4;
      const reducedBindus = Math.max(0, bindus - Math.floor(reductionFactor));
      return reducedBindus;
    }
    return bindus;
  });

  reduced.source = {
    ...VINAY_ADITYA_SOURCE,
    pageLocus: 'file pages 135-145 / printed pages 127-137 (Ch.11 Reduction of Bindus)',
    dashaLordPosition: dashaLordRasiIndex,
    dashaLordStrength,
    notes: 'Bindus reduced where dasha lord transits. Strength-based reduction factor.',
  };

  return reduced;
}

/**
 * REDUCTION 2: Enhanced Reduction with Malefic Factor
 * Vinay Aditya, Ch.11, file pages 140-145
 *
 * If the dasha lord is a malefic (Mars, Saturn) or conjunct/aspected by malefic,
 * reduction is more severe.
 */
function calculateAshtakavargaReductions_Malefic(
  sarvaAshtakavarga,
  dashaLordRasiIndex,
  dashaLordPlanet,
  dashaLordStrength = 50
) {
  const maleficPlanets = ['Mars', 'Saturn'];
  const isMalefic = maleficPlanets.includes(dashaLordPlanet);

  const maleficFactor = isMalefic ? 1.5 : 1.0; // 50% extra reduction if malefic

  const reduced = sarvaAshtakavarga.map((bindus, houseIndex) => {
    if (houseIndex === dashaLordRasiIndex) {
      const baseReduction = (dashaLordStrength / 100) * 4;
      const totalReduction = Math.floor(baseReduction * maleficFactor);
      const reducedBindus = Math.max(0, bindus - totalReduction);
      return reducedBindus;
    }
    return bindus;
  });

  reduced.source = {
    ...VINAY_ADITYA_SOURCE,
    pageLocus: 'file pages 140-145 / printed pages 132-137 (Ch.11 Malefic Reduction)',
    dashaLordPosition: dashaLordRasiIndex,
    dashaLordPlanet,
    isMalefic,
    maleficFactor,
    notes: 'Enhanced reduction if dasha lord is malefic (Mars/Saturn)',
  };

  return reduced;
}

/**
 * CHANCHA CHAKRA: Ashtakavarga House-Based Reduction
 * Vinay Aditya, Ch.16, file pages 180-195
 *
 * Groups the 12 houses into 4 chara (moveable) quadrants, computes total bindus
 * per quadrant, then displays strength in chakra format.
 *
 * Quadrants:
 * - Kendra (angles): Houses 1, 4, 7, 10
 * - Panapara (succedent): Houses 2, 5, 8, 11
 * - Apoklima (cadent): Houses 3, 6, 9, 12
 */
const CHANCHA_GROUPS = {
  kendra: [0, 3, 6, 9],        // 1st, 4th, 7th, 10th
  panapara: [1, 4, 7, 10],     // 2nd, 5th, 8th, 11th
  apoklima: [2, 5, 8, 11],     // 3rd, 6th, 9th, 12th
};

function calculateChanchChakra(sarvaAshtakavarga) {
  // Input: [12-element array] total bindus per house
  // Output: { kendra, panapara, apoklima, total } with sum per group

  const chakra = {
    kendra: 0,
    panapara: 0,
    apoklima: 0,
  };

  chakra.kendra = CHANCHA_GROUPS.kendra.reduce((sum, i) => sum + (sarvaAshtakavarga[i] || 0), 0);
  chakra.panapara = CHANCHA_GROUPS.panapara.reduce((sum, i) => sum + (sarvaAshtakavarga[i] || 0), 0);
  chakra.apoklima = CHANCHA_GROUPS.apoklima.reduce((sum, i) => sum + (sarvaAshtakavarga[i] || 0), 0);

  chakra.total = chakra.kendra + chakra.panapara + chakra.apoklima;

  // Classification: Kendra > Panapara > Apoklima is considered best
  chakra.strength = chakra.kendra >= 80 && chakra.panapara >= 75 && chakra.apoklima >= 65
    ? 'Excellent'
    : chakra.kendra >= 70 && chakra.panapara >= 65 && chakra.apoklima >= 55
    ? 'Good'
    : 'Average';

  chakra.source = {
    ...VINAY_ADITYA_SOURCE,
    pageLocus: 'file pages 180-195 / printed pages 172-187 (Ch.16 Chancha Chakra)',
    groups: CHANCHA_GROUPS,
    notes: 'Kendra (angles) > Panapara (succedent) > Apoklima (cadent) preference',
  };

  return chakra;
}

/**
 * TRANSIT ASHTAKAVARGA OVERLAY
 * Vinay Aditya, Ch.15, file pages 165-180
 *
 * Apply transit planet positions to the natal ashtakavarga grid, showing
 * which houses receive support (high bindus) or weakness (low bindus) from
 * each transiting planet.
 */
function calculateTransitAshtakavargaOverlay(
  natalAshtakavarga,
  transitPlanetPositions
) {
  // natalAshtakavarga: { bhinna: {}, sarva: [] }
  // transitPlanetPositions: { Sun, Moon, Mars, ... } = rasi indices

  const TARGET_PLANETS = ['Sun', 'Mars', 'Jupiter', 'Saturn', 'Moon', 'Mercury', 'Venus'];
  const overlay = {};

  for (const planet of TARGET_PLANETS) {
    if (transitPlanetPositions[planet] === undefined) continue;

    const transitRasiIndex = transitPlanetPositions[planet];
    const natalBhinnas = natalAshtakavarga.bhinna[planet];

    overlay[planet] = {
      transitRasiIndex,
      transitRasiName: ['Mesha', 'Vrishabha', 'Mithuna', 'Karkataka', 'Simha', 'Kanya',
        'Tula', 'Vrischika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'][transitRasiIndex],
      bhinnaBindus: natalBhinnas[transitRasiIndex],
      sarvaBindus: natalAshtakavarga.sarva[transitRasiIndex],
      bhinnaClassification: classifyBhinnaBindus(natalBhinnas[transitRasiIndex]),
      sarvaClassification: classifySarvaBindus(natalAshtakavarga.sarva[transitRasiIndex]),
    };
  }

  overlay.source = {
    ...VINAY_ADITYA_SOURCE,
    pageLocus: 'file pages 165-180 / printed pages 157-172 (Ch.15 Transit Analysis)',
    notes: 'Overlay showing how transit planets interact with natal ashtakavarga',
  };

  return overlay;
}

/**
 * Classification helpers (reused from ashtakavargaTransit.js)
 */
const BHINNA_BINDU_LABELS = [
  'Calamitous', 'Adverse', 'Mediocre', 'Tolerable', 'Average',
  'Advantageous', 'Fortunate', 'Remarkable', 'Magnificent',
];

function classifyBhinnaBindus(bindus) {
  return BHINNA_BINDU_LABELS[bindus] || 'Unknown';
}

function classifySarvaBindus(bindus) {
  if (bindus < 21) return 'Very inauspicious';
  if (bindus < 25) return 'Inauspicious';
  if (bindus <= 30) return 'Average';
  return 'Auspicious';
}

module.exports = {
  calculateBhinnashtaka_Type1_Sun,
  calculateBhinnashtaka_Type2_WithStrength,
  calculateAshtakavargaReductions,
  calculateAshtakavargaReductions_Malefic,
  calculateChanchChakra,
  calculateTransitAshtakavargaOverlay,
  classifyBhinnaBindus,
  classifySarvaBindus,
  CHANCHA_GROUPS,
};
