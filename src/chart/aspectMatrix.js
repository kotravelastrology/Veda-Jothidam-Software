const { EXALTATION } = require('./shadbala');
const { RASI_LORD } = require('./karaka');

const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const BENEFICS = new Set(['Jupiter', 'Venus', 'Mercury']);
const MALEFICS = new Set(['Sun', 'Mars', 'Saturn']);

// Vedic aspects (graha drishti) - which houses each planet aspects
const VEDIC_ASPECTS = {
  'Sun': [7],           // 7th house only
  'Moon': [7],          // 7th house only
  'Mars': [4, 8, 7],    // 4th, 8th, 7th (special 7-view)
  'Mercury': [7],       // 7th house only
  'Jupiter': [5, 9, 7], // 5th, 9th, 7th (special 5-view, 9-view)
  'Venus': [7],         // 7th house only
  'Saturn': [3, 10, 7], // 3rd, 10th, 7th (special 3-view, 10-view)
};

// Helper: Find which house a planet is in
function findPlanetHouse(chart, planet) {
  for (let house = 1; house <= 12; house++) {
    if (chart.houses[house]?.includes(planet)) return house;
  }
  return null;
}

// Helper: Check if planet is exalted or in own sign
function isExaltedOrOwn(planet, planetPos) {
  if (typeof planetPos !== 'number') return false;

  const planetSign = Math.floor(planetPos / 30);
  const exaltInfo = EXALTATION[planet];

  if (!exaltInfo) return false;

  if (planetSign === exaltInfo.sign) return true;

  const ownSign = RASI_LORD.indexOf(planet);
  return ownSign >= 0 && planetSign === ownSign;
}

// Helper: Check if planet is debilitated
function isDebilitated(planet, planetPos) {
  if (typeof planetPos !== 'number') return false;

  const planetSign = Math.floor(planetPos / 30);
  const exaltInfo = EXALTATION[planet];

  if (!exaltInfo) return false;

  // Debilitated = opposite of exaltation sign
  const debilitatedSign = (exaltInfo.sign + 6) % 12;
  return planetSign === debilitatedSign;
}

// Check if two planets form a valid Vedic aspect
function isValidAspect(aspectingPlanet, aspectedPlanet, aspectingHouse, aspectedHouse) {
  if (aspectingPlanet === aspectedPlanet) return false;
  if (!aspectingHouse || !aspectedHouse) return false;

  const aspectHouses = VEDIC_ASPECTS[aspectingPlanet];
  if (!aspectHouses) return false;

  // Calculate which house is aspected (relative to aspecting planet's house)
  for (const aspect of aspectHouses) {
    const targetHouse = ((aspectingHouse + aspect - 1) % 12) || 12;
    if (targetHouse === aspectedHouse) return true;
  }

  return false;
}

// Get modifier for aspecting planet (exaltation/debilitation/own sign)
function getPlanetModifier(planet, planetPos) {
  if (isExaltedOrOwn(planet, planetPos)) return 1.0; // Exalted or own sign: +1
  if (isDebilitated(planet, planetPos)) return -1.0; // Debilitated: -1
  return 0; // Neutral
}

// Get modifier for aspected planet (house strength)
function getHouseModifier(house) {
  const angularHouses = new Set([1, 4, 7, 10]);
  const trinalHouses = new Set([5, 9]);
  const dusthanaHouses = new Set([6, 8, 12]);

  if (angularHouses.has(house)) return 1.0; // Angular: strong
  if (trinalHouses.has(house)) return 0.8; // Trinal: 80%
  if (dusthanaHouses.has(house)) return 1.2; // Dusthana: 120% for malefics, 80% for benefics
  return 1.0; // Neutral
}

// Determine if aspect is benefic or malefic
function isBeneficAspect(planet) {
  return BENEFICS.has(planet);
}

// Calculate single aspect strength
function calculateAspectStrength(chart, aspectingPlanet, aspectedPlanet) {
  const aspectingHouse = findPlanetHouse(chart, aspectingPlanet);
  const aspectedHouse = findPlanetHouse(chart, aspectedPlanet);

  if (!isValidAspect(aspectingPlanet, aspectedPlanet, aspectingHouse, aspectedHouse)) {
    return 0; // No aspect
  }

  const isBenefic = isBeneficAspect(aspectingPlanet);
  const baseStrength = isBenefic ? 1 : -1;

  // Get modifiers
  const aspectingPlanetPos = chart.planetPositions?.[aspectingPlanet];
  const aspectingModifier = getPlanetModifier(aspectingPlanet, aspectingPlanetPos);

  const houseModifier = getHouseModifier(aspectedHouse);

  // Calculate final strength
  let finalStrength = baseStrength + aspectingModifier;

  // Apply house multiplier
  if (isBenefic) {
    finalStrength = finalStrength * houseModifier;
  } else {
    // Malefic aspects are stronger in dusthana
    if (aspectedHouse === 6 || aspectedHouse === 8 || aspectedHouse === 12) {
      finalStrength = finalStrength * houseModifier;
    } else {
      finalStrength = finalStrength / houseModifier;
    }
  }

  // Clamp to -3 to +3 range
  return Math.max(-3, Math.min(3, finalStrength));
}

// Generate complete aspect matrix
function calculateAspectMatrix(chart) {
  if (!chart || !chart.houses || !chart.planetPositions) {
    return {
      matrix: [],
      aspectDetails: {},
      summary: {
        totalBeneficAspects: 0,
        totalMaleficAspects: 0,
        netAspectStrength: 0,
      }
    };
  }

  const matrix = [];
  const aspectDetails = {};
  let totalBenefic = 0;
  let totalMalefic = 0;
  let netStrength = 0;
  let strongestBenefic = '';
  let strongestMalefic = '';
  let maxBeneficStrength = 0;
  let maxMaleficStrength = 0;

  for (let i = 0; i < PLANETS.length; i++) {
    const row = [];
    const aspectingPlanet = PLANETS[i];

    for (let j = 0; j < PLANETS.length; j++) {
      const aspectedPlanet = PLANETS[j];
      const strength = calculateAspectStrength(chart, aspectingPlanet, aspectedPlanet);
      row.push(strength);

      if (strength !== 0) {
        const key = `${aspectingPlanet}-${aspectedPlanet}`;
        const isBenefic = isBeneficAspect(aspectingPlanet);

        aspectDetails[key] = {
          aspecting: aspectingPlanet,
          aspected: aspectedPlanet,
          strength: strength,
          isBenefic: isBenefic,
        };

        if (strength > 0) {
          totalBenefic++;
          netStrength += strength;
          if (strength > maxBeneficStrength) {
            maxBeneficStrength = strength;
            strongestBenefic = `${key} (+${strength.toFixed(1)})`;
          }
        } else {
          totalMalefic++;
          netStrength += strength;
          if (Math.abs(strength) > maxMaleficStrength) {
            maxMaleficStrength = Math.abs(strength);
            strongestMalefic = `${key} (${strength.toFixed(1)})`;
          }
        }
      }
    }

    matrix.push(row);
  }

  return {
    matrix,
    aspectDetails,
    summary: {
      totalBeneficAspects: totalBenefic,
      totalMaleficAspects: totalMalefic,
      netAspectStrength: parseFloat(netStrength.toFixed(1)),
      strongestBeneficAspect: strongestBenefic,
      strongestMaleficAspect: strongestMalefic,
    }
  };
}

module.exports = {
  calculateAspectMatrix,
  calculateAspectStrength,
  isValidAspect,
  getPlanetModifier,
  getHouseModifier,
  isBeneficAspect,
  VEDIC_ASPECTS,
};
