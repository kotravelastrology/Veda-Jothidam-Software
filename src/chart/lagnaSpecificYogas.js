const { attachSource } = require('../contracts/chartContext');
const { RASI_LORD } = require('./karaka');

const BENEFICS = new Set(['Jupiter', 'Venus', 'Mercury']);

const BPHS_LAGNA_SPECIFIC_SOURCE = {
  title: 'Brihat Parashara Hora Shastra (BPHS)',
  author: 'R. Santhanam (translation)',
  file: 'C23_BPHS_Santhanam.pdf',
  tradition: 'Parashari',
  convention: 'Lagna-Specific Wealth Yogas, Ch.41',
  pageLocus: 'file pages TBD / printed pages TBD (Ch.41, verses 11-58) — S11-C Phase 3.2B',
};

// Helper: Find which house a planet is in
function findPlanetHouse(chart, planet) {
  for (let house = 1; house <= 12; house++) {
    if (chart.houses[house]?.includes(planet)) return house;
  }
  return null;
}

// Helper: Find lord of a house (by calculating which sign the house falls into)
function findHouseLord(chart, house) {
  // Get Ascendant sign
  const ascSign = Math.floor(chart.lagna.longitude / 30);

  // Calculate which sign this house falls into (counting from Ascendant)
  // House 1 = Ascendant sign, House 2 = next sign, etc.
  const houseSign = (ascSign + (house - 1)) % 12;

  return RASI_LORD[houseSign] || null;
}

// Helper: Check if house contains any benefics
function hasBenefic(chart, house) {
  const planets = chart.houses[house] || [];
  return planets.some(p => BENEFICS.has(p));
}

// Helper: Get Ascendant sign (0-11)
function getAscendantSign(chart) {
  if (!chart.lagna || typeof chart.lagna.longitude !== 'number') return null;
  return Math.floor(chart.lagna.longitude / 30);
}

// LAGNA_NAMES for reference
const RASI_NAMES = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

// Master catalog: organized by Lagna (ascendant sign)
const LAGNA_SPECIFIC_YOGAS = {
  // ============ ARIES ASCENDANT (Sign 0) ============
  0: [
    {
      name: 'Aries Wealth Yoga 1',
      lagna: 'Aries',
      chapter: 41,
      formation_rule: 'Mars in 10th, Jupiter in 5th',
      effects: 'Strong career, wealth through enterprise, authority',
      severity: 'High',
      detection(chart) {
        try {
          const marsHouse = findPlanetHouse(chart, 'Mars');
          const jupiterHouse = findPlanetHouse(chart, 'Jupiter');

          return marsHouse === 10 && jupiterHouse === 5;
        } catch (e) {
          return false;
        }
      },
    },
    {
      name: 'Aries Wealth Yoga 2',
      lagna: 'Aries',
      chapter: 41,
      formation_rule: 'Sun in 1st, benefics in 7th',
      effects: 'Leadership, partnership wealth, authority',
      severity: 'High',
      detection(chart) {
        try {
          const sunHouse = findPlanetHouse(chart, 'Sun');
          return sunHouse === 1 && hasBenefic(chart, 7);
        } catch (e) {
          return false;
        }
      },
    },
  ],

  // ============ TAURUS ASCENDANT (Sign 1) ============
  1: [
    {
      name: 'Taurus Wealth Yoga 1',
      lagna: 'Taurus',
      chapter: 41,
      formation_rule: 'Venus (1st lord) in 10th, Jupiter in 4th',
      effects: 'Agricultural wealth, real estate, inherited property',
      severity: 'High',
      detection(chart) {
        try {
          const venusHouse = findPlanetHouse(chart, 'Venus');
          const jupiterHouse = findPlanetHouse(chart, 'Jupiter');

          return venusHouse === 10 && jupiterHouse === 4;
        } catch (e) {
          return false;
        }
      },
    },
    {
      name: 'Taurus Wealth Yoga 2',
      lagna: 'Taurus',
      chapter: 41,
      formation_rule: 'Mercury in 9th, benefics in 2nd',
      effects: 'Wealth through inheritance, trade, partnerships',
      severity: 'Medium',
      detection(chart) {
        try {
          const mercuryHouse = findPlanetHouse(chart, 'Mercury');
          return mercuryHouse === 9 && hasBenefic(chart, 2);
        } catch (e) {
          return false;
        }
      },
    },
  ],

  // ============ GEMINI ASCENDANT (Sign 2) ============
  2: [
    {
      name: 'Gemini Wealth Yoga 1',
      lagna: 'Gemini',
      chapter: 41,
      formation_rule: 'Mercury (1st lord) in 10th, Jupiter in 7th',
      effects: 'Wealth through commerce, business partnerships',
      severity: 'High',
      detection(chart) {
        try {
          const mercury1stLord = findHouseLord(chart, 1);
          if (mercury1stLord !== 'Mercury') return false;

          const mercuryHouse = findPlanetHouse(chart, 'Mercury');
          const jupiterHouse = findPlanetHouse(chart, 'Jupiter');

          return mercuryHouse === 10 && jupiterHouse === 7;
        } catch (e) {
          return false;
        }
      },
    },
    {
      name: 'Gemini Wealth Yoga 2',
      lagna: 'Gemini',
      chapter: 41,
      formation_rule: 'Venus in 9th, Sun in 1st',
      effects: 'Wealth through partnerships, artistic pursuits',
      severity: 'Medium',
      detection(chart) {
        try {
          const venusHouse = findPlanetHouse(chart, 'Venus');
          const sunHouse = findPlanetHouse(chart, 'Sun');

          return venusHouse === 9 && sunHouse === 1;
        } catch (e) {
          return false;
        }
      },
    },
  ],

  // ============ CANCER ASCENDANT (Sign 3) ============
  3: [
    {
      name: 'Cancer Wealth Yoga 1',
      lagna: 'Cancer',
      chapter: 41,
      formation_rule: 'Moon (1st lord) in 10th, Jupiter in 4th',
      effects: 'Emotional security, domestic wealth, property',
      severity: 'High',
      detection(chart) {
        try {
          const moon1stLord = findHouseLord(chart, 1);
          if (moon1stLord !== 'Moon') return false;

          const moonHouse = findPlanetHouse(chart, 'Moon');
          const jupiterHouse = findPlanetHouse(chart, 'Jupiter');

          return moonHouse === 10 && jupiterHouse === 4;
        } catch (e) {
          return false;
        }
      },
    },
    {
      name: 'Cancer Wealth Yoga 2',
      lagna: 'Cancer',
      chapter: 41,
      formation_rule: 'Mars in 7th, Saturn in 8th',
      effects: 'Wealth through struggle, perseverance',
      severity: 'Medium',
      detection(chart) {
        try {
          const marsHouse = findPlanetHouse(chart, 'Mars');
          const saturnHouse = findPlanetHouse(chart, 'Saturn');

          return marsHouse === 7 && saturnHouse === 8;
        } catch (e) {
          return false;
        }
      },
    },
  ],

  // ============ LEO ASCENDANT (Sign 4) ============
  4: [
    {
      name: 'Leo Wealth Yoga 1',
      lagna: 'Leo',
      chapter: 41,
      formation_rule: 'Sun (1st lord) in 10th, benefics in 9th',
      effects: 'Royal wealth, authority, spiritual richness',
      severity: 'Very High',
      detection(chart) {
        try {
          const sun1stLord = findHouseLord(chart, 1);
          if (sun1stLord !== 'Sun') return false;

          const sunHouse = findPlanetHouse(chart, 'Sun');
          return sunHouse === 10 && hasBenefic(chart, 9);
        } catch (e) {
          return false;
        }
      },
    },
    {
      name: 'Leo Wealth Yoga 2',
      lagna: 'Leo',
      chapter: 41,
      formation_rule: 'Jupiter in 1st, Venus in 5th',
      effects: 'Generosity, abundance, popularity',
      severity: 'High',
      detection(chart) {
        try {
          const jupiterHouse = findPlanetHouse(chart, 'Jupiter');
          const venusHouse = findPlanetHouse(chart, 'Venus');

          return jupiterHouse === 1 && venusHouse === 5;
        } catch (e) {
          return false;
        }
      },
    },
  ],

  // ============ VIRGO ASCENDANT (Sign 5) ============
  5: [
    {
      name: 'Virgo Wealth Yoga 1',
      lagna: 'Virgo',
      chapter: 41,
      formation_rule: 'Mercury (1st lord) in 10th, Jupiter in 9th',
      effects: 'Intellectual wealth, success in service, education',
      severity: 'High',
      detection(chart) {
        try {
          const mercury1stLord = findHouseLord(chart, 1);
          if (mercury1stLord !== 'Mercury') return false;

          const mercuryHouse = findPlanetHouse(chart, 'Mercury');
          const jupiterHouse = findPlanetHouse(chart, 'Jupiter');

          return mercuryHouse === 10 && jupiterHouse === 9;
        } catch (e) {
          return false;
        }
      },
    },
    {
      name: 'Virgo Wealth Yoga 2',
      lagna: 'Virgo',
      chapter: 41,
      formation_rule: 'Venus in 2nd, Moon in 11th',
      effects: 'Steady financial gains, artistic income',
      severity: 'Medium',
      detection(chart) {
        try {
          const venusHouse = findPlanetHouse(chart, 'Venus');
          const moonHouse = findPlanetHouse(chart, 'Moon');

          return venusHouse === 2 && moonHouse === 11;
        } catch (e) {
          return false;
        }
      },
    },
  ],

  // ============ LIBRA ASCENDANT (Sign 6) ============
  6: [
    {
      name: 'Libra Wealth Yoga 1',
      lagna: 'Libra',
      chapter: 41,
      formation_rule: 'Venus (1st lord) in 10th, Jupiter in 9th',
      effects: 'Wealth through arts, beauty, partnerships, luxury',
      severity: 'Very High',
      detection(chart) {
        try {
          const venus1stLord = findHouseLord(chart, 1);
          if (venus1stLord !== 'Venus') return false;

          const venusHouse = findPlanetHouse(chart, 'Venus');
          const jupiterHouse = findPlanetHouse(chart, 'Jupiter');

          return venusHouse === 10 && jupiterHouse === 9;
        } catch (e) {
          return false;
        }
      },
    },
    {
      name: 'Libra Wealth Yoga 2',
      lagna: 'Libra',
      chapter: 41,
      formation_rule: 'Mercury in 2nd, Saturn in 10th',
      effects: 'Wealth through business, gradual accumulation',
      severity: 'Medium',
      detection(chart) {
        try {
          const mercuryHouse = findPlanetHouse(chart, 'Mercury');
          const saturnHouse = findPlanetHouse(chart, 'Saturn');

          return mercuryHouse === 2 && saturnHouse === 10;
        } catch (e) {
          return false;
        }
      },
    },
  ],

  // ============ SCORPIO ASCENDANT (Sign 7) ============
  7: [
    {
      name: 'Scorpio Wealth Yoga 1',
      lagna: 'Scorpio',
      chapter: 41,
      formation_rule: 'Mars (1st lord) in 10th, Jupiter in 9th',
      effects: 'Power, control of resources, transformation wealth',
      severity: 'High',
      detection(chart) {
        try {
          const mars1stLord = findHouseLord(chart, 1);
          if (mars1stLord !== 'Mars') return false;

          const marsHouse = findPlanetHouse(chart, 'Mars');
          const jupiterHouse = findPlanetHouse(chart, 'Jupiter');

          return marsHouse === 10 && jupiterHouse === 9;
        } catch (e) {
          return false;
        }
      },
    },
    {
      name: 'Scorpio Wealth Yoga 2',
      lagna: 'Scorpio',
      chapter: 41,
      formation_rule: 'Saturn in 1st, Jupiter in 4th',
      effects: 'Mystical wealth, hidden resources, perseverance wealth',
      severity: 'Medium',
      detection(chart) {
        try {
          const saturnHouse = findPlanetHouse(chart, 'Saturn');
          const jupiterHouse = findPlanetHouse(chart, 'Jupiter');

          return saturnHouse === 1 && jupiterHouse === 4;
        } catch (e) {
          return false;
        }
      },
    },
  ],

  // ============ SAGITTARIUS ASCENDANT (Sign 8) ============
  8: [
    {
      name: 'Sagittarius Wealth Yoga 1',
      lagna: 'Sagittarius',
      chapter: 41,
      formation_rule: 'Jupiter (1st lord) in 10th, Venus in 9th',
      effects: 'Spiritual wealth, luck, abundance, teaching wealth',
      severity: 'Very High',
      detection(chart) {
        try {
          const jupiter1stLord = findHouseLord(chart, 1);
          if (jupiter1stLord !== 'Jupiter') return false;

          const jupiterHouse = findPlanetHouse(chart, 'Jupiter');
          const venusHouse = findPlanetHouse(chart, 'Venus');

          return jupiterHouse === 10 && venusHouse === 9;
        } catch (e) {
          return false;
        }
      },
    },
    {
      name: 'Sagittarius Wealth Yoga 2',
      lagna: 'Sagittarius',
      chapter: 41,
      formation_rule: 'Mercury in 2nd, Sun in 11th',
      effects: 'Wealth through communication, networks',
      severity: 'Medium',
      detection(chart) {
        try {
          const mercuryHouse = findPlanetHouse(chart, 'Mercury');
          const sunHouse = findPlanetHouse(chart, 'Sun');

          return mercuryHouse === 2 && sunHouse === 11;
        } catch (e) {
          return false;
        }
      },
    },
  ],

  // ============ CAPRICORN ASCENDANT (Sign 9) ============
  9: [
    {
      name: 'Capricorn Wealth Yoga 1',
      lagna: 'Capricorn',
      chapter: 41,
      formation_rule: 'Saturn (1st lord) in 10th, Jupiter in 11th',
      effects: 'Hardworking wealth, long-term accumulation, delayed gain',
      severity: 'High',
      detection(chart) {
        try {
          const saturn1stLord = findHouseLord(chart, 1);
          if (saturn1stLord !== 'Saturn') return false;

          const saturnHouse = findPlanetHouse(chart, 'Saturn');
          const jupiterHouse = findPlanetHouse(chart, 'Jupiter');

          return saturnHouse === 10 && jupiterHouse === 11;
        } catch (e) {
          return false;
        }
      },
    },
    {
      name: 'Capricorn Wealth Yoga 2',
      lagna: 'Capricorn',
      chapter: 41,
      formation_rule: 'Venus in 2nd, Moon in 9th',
      effects: 'Inherited wealth, emotional security',
      severity: 'Medium',
      detection(chart) {
        try {
          const venusHouse = findPlanetHouse(chart, 'Venus');
          const moonHouse = findPlanetHouse(chart, 'Moon');

          return venusHouse === 2 && moonHouse === 9;
        } catch (e) {
          return false;
        }
      },
    },
  ],

  // ============ AQUARIUS ASCENDANT (Sign 10) ============
  10: [
    {
      name: 'Aquarius Wealth Yoga 1',
      lagna: 'Aquarius',
      chapter: 41,
      formation_rule: 'Saturn (1st lord) in 10th, benefics in 9th',
      effects: 'Innovation wealth, technological success, unconventional income',
      severity: 'High',
      detection(chart) {
        try {
          const saturn1stLord = findHouseLord(chart, 1);
          if (saturn1stLord !== 'Saturn') return false;

          const saturnHouse = findPlanetHouse(chart, 'Saturn');
          return saturnHouse === 10 && hasBenefic(chart, 9);
        } catch (e) {
          return false;
        }
      },
    },
    {
      name: 'Aquarius Wealth Yoga 2',
      lagna: 'Aquarius',
      chapter: 41,
      formation_rule: 'Mercury in 2nd, Jupiter in 5th',
      effects: 'Intellectual property, teaching wealth',
      severity: 'Medium',
      detection(chart) {
        try {
          const mercuryHouse = findPlanetHouse(chart, 'Mercury');
          const jupiterHouse = findPlanetHouse(chart, 'Jupiter');

          return mercuryHouse === 2 && jupiterHouse === 5;
        } catch (e) {
          return false;
        }
      },
    },
  ],

  // ============ PISCES ASCENDANT (Sign 11) ============
  11: [
    {
      name: 'Pisces Wealth Yoga 1',
      lagna: 'Pisces',
      chapter: 41,
      formation_rule: 'Jupiter (1st lord) in 10th, benefics in 9th',
      effects: 'Spiritual abundance, healing wealth, compassion-based income',
      severity: 'Very High',
      detection(chart) {
        try {
          const jupiter1stLord = findHouseLord(chart, 1);
          if (jupiter1stLord !== 'Jupiter') return false;

          const jupiterHouse = findPlanetHouse(chart, 'Jupiter');
          return jupiterHouse === 10 && hasBenefic(chart, 9);
        } catch (e) {
          return false;
        }
      },
    },
    {
      name: 'Pisces Wealth Yoga 2',
      lagna: 'Pisces',
      chapter: 41,
      formation_rule: 'Venus in 2nd, Moon in 11th',
      effects: 'Artistic wealth, emotional relationships = financial',
      severity: 'Medium',
      detection(chart) {
        try {
          const venusHouse = findPlanetHouse(chart, 'Venus');
          const moonHouse = findPlanetHouse(chart, 'Moon');

          return venusHouse === 2 && moonHouse === 11;
        } catch (e) {
          return false;
        }
      },
    },
  ],
};

function calculateLagnaSpecificYogas(chart) {
  const matchedYogas = [];

  try {
    if (!chart || !chart.houses || !chart.planetPositions || !chart.lagna) {
      return attachSource({
        yogas: [],
        totalMatched: 0,
      }, BPHS_LAGNA_SPECIFIC_SOURCE);
    }

    const ascendantSign = getAscendantSign(chart);
    if (ascendantSign === null || ascendantSign < 0 || ascendantSign > 11) {
      return attachSource({
        yogas: [],
        totalMatched: 0,
      }, BPHS_LAGNA_SPECIFIC_SOURCE);
    }

    // Get yogas specific to this Lagna
    const yogasForThisLagna = LAGNA_SPECIFIC_YOGAS[ascendantSign] || [];

    for (const yoga of yogasForThisLagna) {
      if (yoga.detection && typeof yoga.detection === 'function') {
        try {
          if (yoga.detection(chart)) {
            matchedYogas.push({
              yogaKey: yoga.name.replace(/\s+/g, '_').toUpperCase(),
              name: yoga.name,
              lagna: yoga.lagna,
              chapter: yoga.chapter,
              formation_rule: yoga.formation_rule,
              effects: yoga.effects,
              severity: yoga.severity,
            });
          }
        } catch (error) {
          console.warn(`Error detecting ${yoga.name}:`, error.message);
        }
      }
    }
  } catch (error) {
    console.error('Error in calculateLagnaSpecificYogas:', error);
  }

  return attachSource({
    yogas: matchedYogas,
    totalMatched: matchedYogas.length,
  }, BPHS_LAGNA_SPECIFIC_SOURCE);
}

module.exports = {
  calculateLagnaSpecificYogas,
  LAGNA_SPECIFIC_YOGAS,
  BPHS_LAGNA_SPECIFIC_SOURCE,
};
