const { EXALTATION } = require('./shadbala');
const { RASI_LORD } = require('./karaka');

const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const BENEFICS = new Set(['Jupiter', 'Venus', 'Mercury']);

// Planetary friendships (classical Vedic)
const PLANETARY_FRIENDS = {
  'Sun': new Set(['Moon', 'Mars', 'Jupiter']),
  'Moon': new Set(['Sun', 'Mercury']),
  'Mars': new Set(['Sun', 'Moon', 'Jupiter']),
  'Mercury': new Set(['Sun', 'Venus']),
  'Jupiter': new Set(['Sun', 'Moon', 'Mars']),
  'Venus': new Set(['Mercury', 'Saturn']),
  'Saturn': new Set(['Mercury', 'Venus']),
};

// Helper: Find which house a planet is in
function findPlanetHouse(chart, planet) {
  for (let house = 1; house <= 12; house++) {
    if (chart.houses[house]?.includes(planet)) return house;
  }
  return null;
}

// Helper: Check if planet is exalted, own sign, or debilitated
function getPlanetSignStatus(planet, planetPos) {
  if (typeof planetPos !== 'number') return 'neutral';

  const planetSign = Math.floor(planetPos / 30);
  const exaltInfo = EXALTATION[planet];

  if (!exaltInfo) return 'neutral';

  if (planetSign === exaltInfo.sign) return 'exalted';

  const ownSign = RASI_LORD.indexOf(planet);
  if (ownSign >= 0 && planetSign === ownSign) return 'own';

  const debilitatedSign = (exaltInfo.sign + 6) % 12;
  if (planetSign === debilitatedSign) return 'debilitated';

  // Check if friend's sign
  const signLord = RASI_LORD[planetSign];
  if (signLord && PLANETARY_FRIENDS[planet]?.has(signLord)) return 'friend';

  // Check if enemy's sign
  if (signLord && !PLANETARY_FRIENDS[planet]?.has(signLord)) return 'enemy';

  return 'neutral';
}

// Get exaltation component (-30 to +30)
function getExaltationComponent(planet, planetPos) {
  const status = getPlanetSignStatus(planet, planetPos);

  switch (status) {
    case 'exalted': return 30;
    case 'own': return 15;
    case 'friend': return 5;
    case 'enemy': return -10;
    case 'debilitated': return -30;
    default: return 0;
  }
}

// Get house component (-15 to +20)
function getHouseComponent(house) {
  const angularHouses = new Set([1, 4, 7, 10]);
  const trinalHouses = new Set([5, 9]);
  const upachayaHouses = new Set([3, 6, 11]);
  const trikaHouses = new Set([8, 12]);

  if (angularHouses.has(house)) return 20;
  if (trinalHouses.has(house)) return 10;
  if (upachayaHouses.has(house)) return 5;
  if (trikaHouses.has(house)) return -15;
  return 0; // House 2
}

// Get aspect component (-25 to +25)
function getAspectComponent(chart, planet, aspectMatrix) {
  if (!aspectMatrix || !aspectMatrix.aspectDetails) return 0;

  let aspectScore = 0;

  for (const key in aspectMatrix.aspectDetails) {
    const detail = aspectMatrix.aspectDetails[key];

    // Aspects TO this planet
    if (detail.aspected === planet) {
      if (detail.isBenefic && detail.strength > 0) {
        aspectScore += detail.strength * 5; // +5 per strength point
      } else if (!detail.isBenefic && detail.strength < 0) {
        aspectScore += detail.strength * 5; // −5 per strength point
      }
    }
  }

  return Math.max(-25, Math.min(25, aspectScore));
}

// Get sign strength component (-15 to +15)
function getSignStrengthComponent(planet, planetPos) {
  const status = getPlanetSignStatus(planet, planetPos);

  switch (status) {
    case 'exalted':
    case 'own': return 15;
    case 'friend': return 5;
    case 'enemy': return -5;
    case 'debilitated': return -15;
    default: return 0;
  }
}

// Get nakshatra component (-5 to +10)
function getNakshatraComponent(planetPos) {
  if (typeof planetPos !== 'number') return 0;

  // Simplified nakshatra strength (based on position in sign)
  const posInSign = planetPos % 30;

  // Own nakshatra: assume early part of sign
  if (posInSign < 3.33) return 10;

  // Benefic nakshatra: mid-part
  if (posInSign < 13.33) return 5;

  // Malefic nakshatra: late part
  if (posInSign > 26.67) return -5;

  return 0; // Neutral
}

// Get strength rating based on score
function getRatingFromScore(score) {
  if (score >= 81) return 'Exceptionally Strong';
  if (score >= 61) return 'Very Strong';
  if (score >= 41) return 'Moderate';
  if (score >= 21) return 'Weak';
  if (score >= 1) return 'Very Weak';
  return 'Severely Afflicted';
}

// Calculate planetary strength for single planet
function calculatePlanetStrength(chart, planet, aspectMatrix) {
  const planetHouse = findPlanetHouse(chart, planet);
  const planetPos = chart.planetPositions?.[planet];

  if (!planetHouse || typeof planetPos !== 'number') {
    return {
      planet,
      totalStrength: 0,
      components: {
        exaltation: 0,
        house: 0,
        aspect: 0,
        sign: 0,
        nakshatra: 0,
      },
      rating: 'Severely Afflicted',
    };
  }

  const exaltationComp = getExaltationComponent(planet, planetPos);
  const houseComp = getHouseComponent(planetHouse);
  const aspectComp = getAspectComponent(chart, planet, aspectMatrix);
  const signComp = getSignStrengthComponent(planet, planetPos);
  const nakshatraComp = getNakshatraComponent(planetPos);

  // Aggregate with baseline offset
  let totalStrength = exaltationComp + houseComp + aspectComp + signComp + nakshatraComp + 50;

  // Clamp to 0-100
  totalStrength = Math.max(0, Math.min(100, totalStrength));

  return {
    planet,
    totalStrength: Math.round(totalStrength * 10) / 10,
    components: {
      exaltation: exaltationComp,
      house: houseComp,
      aspect: aspectComp,
      sign: signComp,
      nakshatra: nakshatraComp,
    },
    rating: getRatingFromScore(totalStrength),
  };
}

// Calculate strength index for all planets
function calculatePlanetaryStrengthIndex(chart, aspectMatrix) {
  if (!chart || !chart.houses || !chart.planetPositions) {
    return {
      planetaryStrengths: {},
      summary: {
        strongestPlanet: '',
        weakestPlanet: '',
        averageStrength: 0,
        beneficStrengthTotal: 0,
        maleficStrengthTotal: 0,
      }
    };
  }

  const planetaryStrengths = {};
  let maxStrength = -1;
  let minStrength = 101;
  let maxPlanet = '';
  let minPlanet = '';
  let beneficTotal = 0;
  let maleficTotal = 0;
  let totalStrength = 0;

  for (const planet of PLANETS) {
    const strength = calculatePlanetStrength(chart, planet, aspectMatrix);
    planetaryStrengths[planet] = strength;

    if (strength.totalStrength > maxStrength) {
      maxStrength = strength.totalStrength;
      maxPlanet = planet;
    }
    if (strength.totalStrength < minStrength) {
      minStrength = strength.totalStrength;
      minPlanet = planet;
    }

    totalStrength += strength.totalStrength;

    if (BENEFICS.has(planet)) {
      beneficTotal += strength.totalStrength;
    } else {
      maleficTotal += strength.totalStrength;
    }
  }

  return {
    planetaryStrengths,
    summary: {
      strongestPlanet: `${maxPlanet} (${maxStrength})`,
      weakestPlanet: `${minPlanet} (${minStrength})`,
      averageStrength: Math.round((totalStrength / PLANETS.length) * 10) / 10,
      beneficStrengthTotal: Math.round(beneficTotal * 10) / 10,
      maleficStrengthTotal: Math.round(maleficTotal * 10) / 10,
    }
  };
}

module.exports = {
  calculatePlanetaryStrengthIndex,
  calculatePlanetStrength,
  getExaltationComponent,
  getHouseComponent,
  getAspectComponent,
  getSignStrengthComponent,
  getNakshatraComponent,
  getRatingFromScore,
  getPlanetSignStatus,
};
