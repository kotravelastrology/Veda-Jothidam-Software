const { attachSource } = require('../contracts/chartContext');
const { EXALTATION } = require('./shadbala');
const { RASI_LORD } = require('./karaka');

const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const MALEFICS = new Set(['Sun', 'Mars', 'Saturn']);

const BPHS_DOSHAS_SOURCE = {
  title: 'Brihat Parashara Hora Shastra (BPHS)',
  author: 'R. Santhanam (translation)',
  file: 'C23_BPHS_Santhanam.pdf',
  tradition: 'Parashari',
  convention: 'Doshas/Curses, Ch.83',
  pageLocus: 'file pages TBD / printed pages TBD (Ch.83) — S11-B',
};

// Helper: Find which house a planet is in
function findPlanetHouse(chart, planet) {
  for (let house = 1; house <= 12; house++) {
    if (chart.houses[house]?.includes(planet)) return house;
  }
  return null;
}

// Helper: Find lord of a house
function findHouseLord(chart, house) {
  const planetsInHouse = chart.houses[house] || [];
  if (planetsInHouse.length === 0) return null;

  const firstPlanet = planetsInHouse[0];
  const planetPos = chart.planetPositions?.[firstPlanet];
  if (typeof planetPos !== 'number') return null;

  const houseSign = Math.floor(planetPos / 30);
  return RASI_LORD[houseSign] || null;
}

// Helper: Check if planet is debilitated or combust
function isDebilitatedOrCombust(planet, planetPos) {
  if (typeof planetPos !== 'number') return false;

  const planetSign = Math.floor(planetPos / 30);
  const exaltInfo = EXALTATION[planet];

  if (!exaltInfo) return false;

  // Debilitated = opposite of exalted sign
  const debilSign = (exaltInfo.sign + 6) % 12;
  return planetSign === debilSign;
}

const DOSHAS_CATALOG = {
  // ============ 8 Primary Doshas from BPHS Ch.83 ============

  // 1. Pitra Dosha (Father's Curse)
  PITRA_DOSHA: {
    name: 'Pitra Dosha',
    chapter: 83,
    formation_rule: 'Sun or 9th lord in 6th/8th/12th house, or Sun debilitated/combust',
    effects: 'Obstacles to paternal inheritance, lack of father\'s blessing, ancestral curses',
    severity: 'Major',
    remedies: 'Worship Sun, Pitri Puja, charity to elderly men',
    detection(chart) {
      try {
        const sunHouse = findPlanetHouse(chart, 'Sun');
        const ninthLord = findHouseLord(chart, 9);
        const ninthLordHouse = ninthLord ? findPlanetHouse(chart, ninthLord) : null;

        // Check Sun in 6/8/12
        if (sunHouse === 6 || sunHouse === 8 || sunHouse === 12) return true;

        // Check 9th lord in 6/8/12
        if (ninthLordHouse === 6 || ninthLordHouse === 8 || ninthLordHouse === 12) return true;

        // Check Sun debilitated
        const sunPos = chart.planetPositions?.Sun;
        if (isDebilitatedOrCombust('Sun', sunPos)) return true;

        return false;
      } catch (e) {
        return false;
      }
    },
  },

  // 2. Matri Dosha (Mother's Curse)
  MATRI_DOSHA: {
    name: 'Matri Dosha',
    chapter: 83,
    formation_rule: 'Moon or 4th lord in 6th/8th/12th house, or Moon debilitated',
    effects: 'Loss of mother\'s blessing, maternal obstacles, health issues for daughters',
    severity: 'Major',
    remedies: 'Worship Moon, Durga Puja, charity to women, fast on Mondays',
    detection(chart) {
      try {
        const moonHouse = findPlanetHouse(chart, 'Moon');
        const fourthLord = findHouseLord(chart, 4);
        const fourthLordHouse = fourthLord ? findPlanetHouse(chart, fourthLord) : null;

        // Check Moon in 6/8/12
        if (moonHouse === 6 || moonHouse === 8 || moonHouse === 12) return true;

        // Check 4th lord in 6/8/12
        if (fourthLordHouse === 6 || fourthLordHouse === 8 || fourthLordHouse === 12) return true;

        // Check Moon debilitated
        const moonPos = chart.planetPositions?.Moon;
        if (isDebilitatedOrCombust('Moon', moonPos)) return true;

        return false;
      } catch (e) {
        return false;
      }
    },
  },

  // 3. Sarpa Dosha (Serpent's Curse)
  SARPA_DOSHA: {
    name: 'Sarpa Dosha',
    chapter: 83,
    formation_rule: '5th lord in 6th/8th/12th house, or 5th house heavily afflicted by malefics',
    effects: 'Sudden problems, miscarriage risks, skin diseases, obstacles to family expansion',
    severity: 'High',
    remedies: 'Worship Shiva, Sarpa Dosha Nivaran Puja, Navagraha Shanti',
    detection(chart) {
      try {
        const fifthLord = findHouseLord(chart, 5);
        const fifthLordHouse = fifthLord ? findPlanetHouse(chart, fifthLord) : null;

        // Check 5th lord in 6/8/12
        if (fifthLordHouse === 6 || fifthLordHouse === 8 || fifthLordHouse === 12) return true;

        // Check 5th house afflicted by malefics (2+ malefics)
        const fifthHouse = chart.houses[5] || [];
        const maleficCount = fifthHouse.filter(p => MALEFICS.has(p)).length;
        if (maleficCount >= 2) return true;

        return false;
      } catch (e) {
        return false;
      }
    },
  },

  // 4. Kalakarma Dosha (Wife's Curse / Marital Discord)
  KALAKARMA_DOSHA: {
    name: 'Kalakarma Dosha',
    chapter: 83,
    formation_rule: 'Venus or 7th lord in 6th/8th/12th house, or Venus debilitated',
    effects: 'Marital discord, divorce risk, sexual problems, wife\'s health issues',
    severity: 'High',
    remedies: 'Worship Venus, Lakshmi worship, marital counseling, Navgrah Shanti',
    detection(chart) {
      try {
        const venusHouse = findPlanetHouse(chart, 'Venus');
        const seventhLord = findHouseLord(chart, 7);
        const seventhLordHouse = seventhLord ? findPlanetHouse(chart, seventhLord) : null;

        // Check Venus in 6/8/12
        if (venusHouse === 6 || venusHouse === 8 || venusHouse === 12) return true;

        // Check 7th lord in 6/8/12
        if (seventhLordHouse === 6 || seventhLordHouse === 8 || seventhLordHouse === 12) return true;

        // Check Venus debilitated
        const venusPos = chart.planetPositions?.Venus;
        if (isDebilitatedOrCombust('Venus', venusPos)) return true;

        return false;
      } catch (e) {
        return false;
      }
    },
  },

  // 5. Bhuta Dosha (Departed Soul's Curse)
  BHUTA_DOSHA: {
    name: 'Bhuta Dosha',
    chapter: 83,
    formation_rule: 'Saturn or 8th lord in 6th/8th/12th house, or 8th house with malefics',
    effects: 'Spiritual disturbances, chronic illness, psychological issues, sleep problems',
    severity: 'High',
    remedies: 'Bhuta Shanti, Maha Mrityunjaya mantra, ancestors\' memorial, meditation',
    detection(chart) {
      try {
        const saturnHouse = findPlanetHouse(chart, 'Saturn');
        const eighthLord = findHouseLord(chart, 8);
        const eighthLordHouse = eighthLord ? findPlanetHouse(chart, eighthLord) : null;

        // Check Saturn in 6/8/12
        if (saturnHouse === 6 || saturnHouse === 8 || saturnHouse === 12) return true;

        // Check 8th lord in 6/8/12
        if (eighthLordHouse === 6 || eighthLordHouse === 8 || eighthLordHouse === 12) return true;

        // Check 8th house with 2+ malefics
        const eighthHouse = chart.houses[8] || [];
        const maleficCount = eighthHouse.filter(p => MALEFICS.has(p)).length;
        if (maleficCount >= 2) return true;

        return false;
      } catch (e) {
        return false;
      }
    },
  },

  // 6. Bhrata Dosha (Brother's Curse)
  BHRATA_DOSHA: {
    name: 'Bhrata Dosha',
    chapter: 83,
    formation_rule: 'Mars or 3rd lord in 6th/8th/12th house, or Mars debilitated',
    effects: 'Sibling conflict, lack of support, separation from siblings, inheritance disputes',
    severity: 'Medium',
    remedies: 'Worship Mars, Hanuman worship, reconciliation with siblings, charity to youth',
    detection(chart) {
      try {
        const marsHouse = findPlanetHouse(chart, 'Mars');
        const thirdLord = findHouseLord(chart, 3);
        const thirdLordHouse = thirdLord ? findPlanetHouse(chart, thirdLord) : null;

        // Check Mars in 6/8/12
        if (marsHouse === 6 || marsHouse === 8 || marsHouse === 12) return true;

        // Check 3rd lord in 6/8/12
        if (thirdLordHouse === 6 || thirdLordHouse === 8 || thirdLordHouse === 12) return true;

        // Check Mars debilitated
        const marsPos = chart.planetPositions?.Mars;
        if (isDebilitatedOrCombust('Mars', marsPos)) return true;

        return false;
      } catch (e) {
        return false;
      }
    },
  },

  // 7. Matula Dosha (Maternal Uncle's Curse)
  MATULA_DOSHA: {
    name: 'Matula Dosha',
    chapter: 83,
    formation_rule: 'Mercury or 6th lord in 6th/8th/12th house, or Mercury debilitated',
    effects: 'Maternal family obstacles, education problems, health issues for maternal relatives',
    severity: 'Medium',
    remedies: 'Worship Mercury, respect maternal relatives, education charity, Navgrah Shanti',
    detection(chart) {
      try {
        const mercuryHouse = findPlanetHouse(chart, 'Mercury');
        const sixthLord = findHouseLord(chart, 6);
        const sixthLordHouse = sixthLord ? findPlanetHouse(chart, sixthLord) : null;

        // Check Mercury in 6/8/12
        if (mercuryHouse === 6 || mercuryHouse === 8 || mercuryHouse === 12) return true;

        // Check 6th lord in 6/8/12
        if (sixthLordHouse === 6 || sixthLordHouse === 8 || sixthLordHouse === 12) return true;

        // Check Mercury debilitated
        const mercuryPos = chart.planetPositions?.Mercury;
        if (isDebilitatedOrCombust('Mercury', mercuryPos)) return true;

        return false;
      } catch (e) {
        return false;
      }
    },
  },

  // 8. Brahmanda Dosha (Cosmic/Universal Curse)
  BRAHMANDA_DOSHA: {
    name: 'Brahmanda Dosha',
    chapter: 83,
    formation_rule: 'Jupiter or 5th lord in 6th/8th/12th house, or Jupiter debilitated',
    effects: 'Loss of divine grace, spiritual confusion, fertility issues, general misfortune',
    severity: 'Major',
    remedies: 'Worship Jupiter, Navagraha Shanti, charity/social service, Vedic study',
    detection(chart) {
      try {
        const jupiterHouse = findPlanetHouse(chart, 'Jupiter');
        const fifthLord = findHouseLord(chart, 5);
        const fifthLordHouse = fifthLord ? findPlanetHouse(chart, fifthLord) : null;

        // Check Jupiter in 6/8/12
        if (jupiterHouse === 6 || jupiterHouse === 8 || jupiterHouse === 12) return true;

        // Check 5th lord in 6/8/12
        if (fifthLordHouse === 6 || fifthLordHouse === 8 || fifthLordHouse === 12) return true;

        // Check Jupiter debilitated
        const jupiterPos = chart.planetPositions?.Jupiter;
        if (isDebilitatedOrCombust('Jupiter', jupiterPos)) return true;

        return false;
      } catch (e) {
        return false;
      }
    },
  },
};

function calculateDoshas(chart) {
  const matchedDoshas = [];

  try {
    if (!chart || !chart.houses || !chart.planetPositions) {
      return attachSource({
        doshas: [],
        totalMatched: 0,
      }, BPHS_DOSHAS_SOURCE);
    }

    for (const doshaKey in DOSHAS_CATALOG) {
      const dosha = DOSHAS_CATALOG[doshaKey];
      if (dosha.detection && typeof dosha.detection === 'function') {
        try {
          if (dosha.detection(chart)) {
            matchedDoshas.push({
              doshaKey,
              name: dosha.name,
              chapter: dosha.chapter,
              formation_rule: dosha.formation_rule,
              effects: dosha.effects,
              severity: dosha.severity,
              remedies: dosha.remedies,
            });
          }
        } catch (error) {
          console.warn(`Error detecting ${doshaKey}:`, error.message);
        }
      }
    }
  } catch (error) {
    console.error('Error in calculateDoshas:', error);
  }

  return attachSource({
    doshas: matchedDoshas,
    totalMatched: matchedDoshas.length,
  }, BPHS_DOSHAS_SOURCE);
}

module.exports = {
  calculateDoshas,
  DOSHAS_CATALOG,
  BPHS_DOSHAS_SOURCE,
};
