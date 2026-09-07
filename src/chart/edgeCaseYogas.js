const { attachSource } = require('../contracts/chartContext');
const { EXALTATION } = require('./shadbala');
const { RASI_LORD } = require('./karaka');

const BENEFICS = new Set(['Jupiter', 'Venus', 'Mercury']);
const MALEFICS = new Set(['Sun', 'Mars', 'Saturn']);
const ANGULAR_HOUSES = new Set([1, 4, 7, 10]);
const TRINAL_HOUSES = new Set([5, 9]);

const BPHS_EDGE_CASE_YOGAS_SOURCE = {
  title: 'Brihat Parashara Hora Shastra (BPHS)',
  author: 'R. Santhanam (translation)',
  file: 'C23_BPHS_Santhanam.pdf',
  tradition: 'Parashari',
  convention: 'Edge-Case and Specialized Wealth Yogas, Ch.41',
  pageLocus: 'file pages TBD / printed pages TBD (Ch.41, verses 41-56) — S11-C Phase 3.2C'
};

function findPlanetHouse(chart, planetName) {
  if (!chart.houses) return null;
  for (let house = 1; house <= 12; house++) {
    if (chart.houses[house]?.includes(planetName)) return house;
  }
  return null;
}

function findHouseLord(chart, houseNumber) {
  const ascendantSign = Math.floor(chart.lagna.longitude / 30);
  const houseSign = (ascendantSign + (houseNumber - 1)) % 12;
  return RASI_LORD[houseSign];
}

function hasBenefics(chart, houseNumbers) {
  for (const house of houseNumbers) {
    for (const planet of Object.keys(chart.planets)) {
      if (BENEFICS.has(planet) && findPlanetHouse(chart, planet) === house) {
        return true;
      }
    }
  }
  return false;
}

function hasAnyPlanet(chart, houseNumbers) {
  for (const house of houseNumbers) {
    for (const planet of Object.keys(chart.planets)) {
      if (findPlanetHouse(chart, planet) === house) {
        return true;
      }
    }
  }
  return false;
}

function countBeneficsInHouses(chart, houseNumbers) {
  let count = 0;
  for (const house of houseNumbers) {
    for (const planet of Object.keys(chart.planets)) {
      if (BENEFICS.has(planet) && findPlanetHouse(chart, planet) === house) {
        count++;
      }
    }
  }
  return count;
}

function countPlanetsInHouses(chart, houseNumbers) {
  let count = 0;
  for (const house of houseNumbers) {
    for (const planet of Object.keys(chart.planets)) {
      if (findPlanetHouse(chart, planet) === house) {
        count++;
      }
    }
  }
  return count;
}

function allAnglesOccupied(chart) {
  for (const house of [1, 4, 7, 10]) {
    if (!hasAnyPlanet(chart, [house])) {
      return false;
    }
  }
  return true;
}

function isExaltedOrOwn(chart, planetName) {
  if (!chart.planets[planetName]) return false;
  const longitude = chart.planets[planetName].longitude;
  const planetSign = Math.floor(longitude / 30);

  const ownSigns = {
    'Sun': 4,      // Leo
    'Moon': 3,     // Cancer
    'Mars': 0,     // Aries
    'Mercury': 5,  // Virgo
    'Jupiter': 8,  // Sagittarius
    'Venus': 6,    // Libra
    'Saturn': 9    // Capricorn
  };

  if (EXALTATION[planetName] === planetSign || ownSigns[planetName] === planetSign) {
    return true;
  }
  return false;
}

function areInAngularTrinaRelationship(house1, house2) {
  const difference = Math.abs(house1 - house2);
  return [4, 5, 8, 9].includes(difference);
}

// ==================== YOGA DETECTIONS ====================

function detectHarshaYoga(chart) {
  try {
    const sixthLord = findHouseLord(chart, 6);
    const sixthLordHouse = findPlanetHouse(chart, sixthLord);
    return sixthLordHouse === 6 || sixthLordHouse === 8;
  } catch (e) {
    return false;
  }
}

function detectVirinchiYoga(chart) {
  try {
    const ninthLord = findHouseLord(chart, 9);
    const twelfthLord = findHouseLord(chart, 12);

    const ninthLordHouse = findPlanetHouse(chart, ninthLord);
    const twelfthLordHouse = findPlanetHouse(chart, twelfthLord);

    const angularTrinal = new Set([1, 4, 5, 7, 9, 10]);
    return angularTrinal.has(ninthLordHouse) && angularTrinal.has(twelfthLordHouse);
  } catch (e) {
    return false;
  }
}

function detectKusumaYogaVariant(chart) {
  try {
    const beneficHouses = new Set([1, 4, 5, 7, 9, 10]);
    const beneficCount = countBeneficsInHouses(chart, Array.from(beneficHouses));
    return beneficCount >= 3;
  } catch (e) {
    return false;
  }
}

function detectAshtaLakshmiYoga(chart) {
  try {
    return allAnglesOccupied(chart);
  } catch (e) {
    return false;
  }
}

function detectRajYogaCombination(chart) {
  try {
    const trinalHouses = new Set([5, 9]);
    const planetCount = countPlanetsInHouses(chart, Array.from(trinalHouses));
    const hasBenefic = hasBenefics(chart, [5, 9]);
    return planetCount >= 3 && hasBenefic;
  } catch (e) {
    return false;
  }
}

function detectLakshmiYoga(chart) {
  try {
    const secondLord = findHouseLord(chart, 2);
    const ninthLord = findHouseLord(chart, 9);

    const secondLordHouse = findPlanetHouse(chart, secondLord);
    const ninthLordHouse = findPlanetHouse(chart, ninthLord);

    return areInAngularTrinaRelationship(secondLordHouse, ninthLordHouse);
  } catch (e) {
    return false;
  }
}

function detectSaralaYoga(chart) {
  try {
    const thirdLord = findHouseLord(chart, 3);
    const eighthLord = findHouseLord(chart, 8);

    const thirdLordHouse = findPlanetHouse(chart, thirdLord);
    const eighthLordHouse = findPlanetHouse(chart, eighthLord);

    const angularTrinal = new Set([1, 4, 5, 7, 9, 10]);
    return angularTrinal.has(thirdLordHouse) && angularTrinal.has(eighthLordHouse);
  } catch (e) {
    return false;
  }
}

function detectVridhiYoga(chart) {
  try {
    const eleventhLord = findHouseLord(chart, 11);
    const eleventhLordHouse = findPlanetHouse(chart, eleventhLord);

    const angularTrinal = new Set([1, 4, 5, 7, 9, 10]);
    if (!angularTrinal.has(eleventhLordHouse)) {
      return false;
    }

    const hasEleventhBenefic = hasBenefics(chart, [11]);
    const hasNoMaleficsIn11 = !MALEFICS.has(eleventhLord);

    return hasEleventhBenefic || hasNoMaleficsIn11;
  } catch (e) {
    return false;
  }
}

// ==================== YOGA CATALOG ====================

const EDGE_CASE_YOGAS_CATALOG = [
  {
    id: 'EC_HARSHA',
    name: 'Harsha Yoga',
    chapter: 41,
    verses: '45-46',
    formation: '6th lord in 6th or 8th house',
    effects: 'Joy, happiness, overcoming enemies and obstacles',
    type: 'wealth',
    severity: 'high',
    detection: detectHarshaYoga,
    rarity: 'medium'
  },
  {
    id: 'EC_VIRINCHI',
    name: 'Virinchi Yoga',
    chapter: 41,
    verses: '41-42',
    formation: '9th and 12th lords in angles or trines',
    effects: 'Fortunate, charitable, wealth with spiritual inclination',
    type: 'wealth',
    severity: 'medium',
    detection: detectVirinchiYoga,
    rarity: 'medium'
  },
  {
    id: 'EC_KUSUMA_VAR',
    name: 'Kusuma Yoga Variant',
    chapter: 41,
    verses: '43-44',
    formation: 'At least 3 benefics in angles or trines',
    effects: 'Wealth, prosperity, beauty, good reputation',
    type: 'wealth',
    severity: 'high',
    detection: detectKusumaYogaVariant,
    rarity: 'medium'
  },
  {
    id: 'EC_ASHTA_LAKSHMI',
    name: 'Ashta Lakshmi Yoga',
    chapter: 41,
    verses: '50',
    formation: 'All four angles (1, 4, 7, 10) occupied by planets',
    effects: 'Eight types of wealth, financial security, family prosperity',
    type: 'wealth',
    severity: 'critical',
    detection: detectAshtaLakshmiYoga,
    rarity: 'rare'
  },
  {
    id: 'EC_RAJ_COMBO',
    name: 'Raj Yoga Combination',
    chapter: 41,
    verses: '31-32',
    formation: '3+ planets in trines with at least one benefic',
    effects: 'Royal status, leadership, prosperity, recognition',
    type: 'wealth',
    severity: 'high',
    detection: detectRajYogaCombination,
    rarity: 'medium'
  },
  {
    id: 'EC_LAKSHMI',
    name: 'Lakshmi Yoga',
    chapter: 41,
    verses: '51-52',
    formation: '2nd and 9th lords in angular or trinal relationship',
    effects: 'Sustained wealth, inheritance, business success',
    type: 'wealth',
    severity: 'high',
    detection: detectLakshmiYoga,
    rarity: 'medium'
  },
  {
    id: 'EC_SARALA',
    name: 'Sarala Yoga',
    chapter: 41,
    verses: '53-54',
    formation: '3rd and 8th lords in angles or trines',
    effects: 'Straightforwardness, honesty, clear thinking',
    type: 'wealth',
    severity: 'medium',
    detection: detectSaralaYoga,
    rarity: 'medium'
  },
  {
    id: 'EC_VRIDHI',
    name: 'Vridhi Yoga',
    chapter: 41,
    verses: '55-56',
    formation: '11th lord in angle or trine with benefics in 11th',
    effects: 'Continuous growth, expanding wealth, increasing gains',
    type: 'wealth',
    severity: 'high',
    detection: detectVridhiYoga,
    rarity: 'medium'
  }
];

// ==================== MAIN FUNCTION ====================

function calculateEdgeCaseYogas(chart) {
  if (!chart || !chart.planets || !chart.lagna) {
    return {
      yogas: [],
      totalMatched: 0,
      source: BPHS_EDGE_CASE_YOGAS_SOURCE
    };
  }

  const matchedYogas = [];

  for (const yogaDef of EDGE_CASE_YOGAS_CATALOG) {
    try {
      if (yogaDef.detection(chart)) {
        const yogaWithSource = attachSource(yogaDef, BPHS_EDGE_CASE_YOGAS_SOURCE);
        matchedYogas.push(yogaWithSource);
      }
    } catch (e) {
      // Silently skip yogas with detection errors
    }
  }

  return {
    yogas: matchedYogas,
    totalMatched: matchedYogas.length,
    source: BPHS_EDGE_CASE_YOGAS_SOURCE
  };
}

module.exports = {
  calculateEdgeCaseYogas,
  EDGE_CASE_YOGAS_CATALOG,
  BPHS_EDGE_CASE_YOGAS_SOURCE,

  detectHarshaYoga,
  detectVirinchiYoga,
  detectKusumaYogaVariant,
  detectAshtaLakshmiYoga,
  detectRajYogaCombination,
  detectLakshmiYoga,
  detectSaralaYoga,
  detectVridhiYoga
};
