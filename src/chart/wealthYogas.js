const { attachSource } = require('../contracts/chartContext');
const { EXALTATION } = require('./shadbala');
const { RASI_LORD } = require('./karaka');

const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const BENEFICS = new Set(['Jupiter', 'Venus', 'Mercury']);
const MALEFICS = new Set(['Sun', 'Mars', 'Saturn']);

const BPHS_WEALTH_YOGAS_SOURCE = {
  title: 'Brihat Parashara Hora Shastra (BPHS)',
  author: 'R. Santhanam (translation)',
  file: 'C23_BPHS_Santhanam.pdf',
  tradition: 'Parashari',
  convention: 'Wealth & Authority Yogas, Ch.36, Ch.40, Ch.41',
  pageLocus: 'file pages TBD / printed pages TBD — S11-C Phase 3.2A',
};

// Helper: Find which house a planet is in
function findPlanetHouse(chart, planet) {
  for (let house = 1; house <= 12; house++) {
    if (chart.houses[house]?.includes(planet)) return house;
  }
  return null;
}

// Helper: Find lord of a house (ruling planet of that sign)
function findHouseLord(chart, house) {
  const planetsInHouse = chart.houses[house] || [];
  if (planetsInHouse.length === 0) return null;

  const firstPlanet = planetsInHouse[0];
  const planetPos = chart.planetPositions?.[firstPlanet];
  if (typeof planetPos !== 'number') return null;

  const houseSign = Math.floor(planetPos / 30);
  return RASI_LORD[houseSign] || null;
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

// Helper: Check if houses contain any planets from a set
function housesContainPlanets(chart, houseNumbers, planetSet) {
  for (const house of houseNumbers) {
    const planets = chart.houses[house] || [];
    for (const planet of planets) {
      if (planetSet.has(planet)) return true;
    }
  }
  return false;
}

const WEALTH_YOGAS_CATALOG = {
  // ============ CHAPTER 36 YOGAS ============

  // 1. Gaja Kesari Yoga
  GAJA_KESARI_YOGA: {
    name: 'Gaja Kesari Yoga',
    chapter: 36,
    type: 'Miscellaneous',
    formation_rule: 'Jupiter in angular house (1/4/7/10) from Moon',
    effects: 'Wise, virtuous, strong, prosperous, respected, long life',
    severity: 'High',
    detection(chart) {
      try {
        const moonHouse = findPlanetHouse(chart, 'Moon');
        if (moonHouse === null) return false;

        const jupiterHouse = findPlanetHouse(chart, 'Jupiter');
        if (!jupiterHouse) return false;

        // Angular houses from Moon: 1, 4, 7, 10 positions relative to Moon
        const angular = new Set([
          moonHouse,
          moonHouse === 12 ? 3 : moonHouse + 3,
          moonHouse === 9 ? 6 : moonHouse === 10 ? 7 : moonHouse === 11 ? 8 : moonHouse === 12 ? 9 : moonHouse + 6 > 12 ? (moonHouse + 6) % 12 : moonHouse + 6,
          moonHouse === 6 ? 9 : moonHouse === 7 ? 10 : moonHouse === 8 ? 11 : moonHouse === 9 ? 12 : moonHouse === 10 ? 1 : moonHouse === 11 ? 2 : moonHouse === 12 ? 3 : moonHouse + 9 > 12 ? (moonHouse + 9) % 12 || 12 : moonHouse + 9,
        ]);

        // Simpler: Check if Jupiter is 1/4/7/10 positions from Moon
        const offset = (jupiterHouse - moonHouse + 12) % 12;
        return offset === 0 || offset === 3 || offset === 6 || offset === 9;
      } catch (e) {
        return false;
      }
    },
  },

  // 2. Shubha Yoga
  SHUBHA_YOGA: {
    name: 'Shubha Yoga',
    chapter: 36,
    type: 'Miscellaneous',
    formation_rule: 'Benefic in angular house (1/4/7/10) from Ascendant',
    effects: 'Auspicious, good fortune, favorable circumstances, health',
    severity: 'High',
    detection(chart) {
      try {
        const angular = new Set([1, 4, 7, 10]);
        return housesContainPlanets(chart, Array.from(angular), BENEFICS);
      } catch (e) {
        return false;
      }
    },
  },

  // 3. Ashubha Yoga
  ASHUBHA_YOGA: {
    name: 'Ashubha Yoga',
    chapter: 36,
    type: 'Miscellaneous',
    formation_rule: 'Malefic in angular house (1/4/7/10) from Ascendant',
    effects: 'Inauspicious, bad luck, obstacles, health problems',
    severity: 'High (Negative)',
    detection(chart) {
      try {
        const angular = new Set([1, 4, 7, 10]);
        return housesContainPlanets(chart, Array.from(angular), MALEFICS);
      } catch (e) {
        return false;
      }
    },
  },

  // ============ CHAPTER 40 YOGAS ============

  // 4. Raja Sevanarthakari Yoga
  RAJA_SEVANARTHAKARI_YOGA: {
    name: 'Raja Sevanarthakari Yoga',
    chapter: 40,
    type: 'Royal Association',
    formation_rule: '10th lord in 2nd house',
    effects: 'Service to king, high official position, authority',
    severity: 'Medium',
    detection(chart) {
      try {
        const tenthLord = findHouseLord(chart, 10);
        if (!tenthLord) return false;

        const tenthLordHouse = findPlanetHouse(chart, tenthLord);
        return tenthLordHouse === 2;
      } catch (e) {
        return false;
      }
    },
  },

  // 5. Dhana Yoga Variant A
  DHANA_YOGA_VARIANT_A: {
    name: 'Dhana Yoga Variant A',
    chapter: 40,
    type: 'Wealth',
    formation_rule: '2nd lord in 9th house (aspected by benefic)',
    effects: 'Wealth through fortune and inheritance',
    severity: 'High',
    detection(chart) {
      try {
        const secondLord = findHouseLord(chart, 2);
        if (!secondLord) return false;

        const secondLordHouse = findPlanetHouse(chart, secondLord);
        return secondLordHouse === 9;
      } catch (e) {
        return false;
      }
    },
  },

  // 6. Dhana Yoga Variant B
  DHANA_YOGA_VARIANT_B: {
    name: 'Dhana Yoga Variant B',
    chapter: 40,
    type: 'Wealth',
    formation_rule: '11th lord in angle or trine (1/4/5/7/9/10)',
    effects: 'Steady wealth accumulation and gains',
    severity: 'High',
    detection(chart) {
      try {
        const eleventhLord = findHouseLord(chart, 11);
        if (!eleventhLord) return false;

        const eleventhLordHouse = findPlanetHouse(chart, eleventhLord);
        if (!eleventhLordHouse) return false;

        const angularTrinal = new Set([1, 4, 5, 7, 9, 10]);
        return angularTrinal.has(eleventhLordHouse);
      } catch (e) {
        return false;
      }
    },
  },

  // 7. Labha Yoga
  LABHA_YOGA: {
    name: 'Labha Yoga',
    chapter: 40,
    type: 'Wealth',
    formation_rule: '11th lord in 1st, 5th, or 9th house',
    effects: 'Gains, profits, abundance, prosperity',
    severity: 'High',
    detection(chart) {
      try {
        const eleventhLord = findHouseLord(chart, 11);
        if (!eleventhLord) return false;

        const eleventhLordHouse = findPlanetHouse(chart, eleventhLord);
        return eleventhLordHouse === 1 || eleventhLordHouse === 5 || eleventhLordHouse === 9;
      } catch (e) {
        return false;
      }
    },
  },

  // 8. Jaya Yoga
  JAYA_YOGA: {
    name: 'Jaya Yoga',
    chapter: 40,
    type: 'Royal Association',
    formation_rule: '10th lord exalted or in own sign',
    effects: 'Victory and success in career and ventures',
    severity: 'High',
    detection(chart) {
      try {
        const tenthLord = findHouseLord(chart, 10);
        if (!tenthLord) return false;

        const tenthLordPos = chart.planetPositions?.[tenthLord];
        return isExaltedOrOwn(tenthLord, tenthLordPos);
      } catch (e) {
        return false;
      }
    },
  },

  // 9. Apad Yoga
  APAD_YOGA: {
    name: 'Apad Yoga',
    chapter: 40,
    type: 'Relief',
    formation_rule: '6th lord weak/debilitated, malefics absent from 6/8/12',
    effects: 'Relief from debts and enemies, overcoming obstacles',
    severity: 'Medium',
    detection(chart) {
      try {
        const sixthLord = findHouseLord(chart, 6);
        if (!sixthLord) return false;

        const sixthLordPos = chart.planetPositions?.[sixthLord];
        const sixthLordWeak = !isExaltedOrOwn(sixthLord, sixthLordPos);

        // Check no malefics in 6/8/12
        const malefikHouses = new Set([6, 8, 12]);
        const noMaleficsInAffliction = !housesContainPlanets(chart, Array.from(malefikHouses), MALEFICS);

        return sixthLordWeak && noMaleficsInAffliction;
      } catch (e) {
        return false;
      }
    },
  },

  // ============ CHAPTER 41 YOGAS ============

  // 10. Dhanayoga
  DHANAYOGA: {
    name: 'Dhanayoga',
    chapter: 41,
    type: 'Wealth',
    formation_rule: '2nd and 11th lords strong and in angles (1/4/7/10)',
    effects: 'Wealth, riches, financial security, prosperity',
    severity: 'Very High',
    detection(chart) {
      try {
        const secondLord = findHouseLord(chart, 2);
        const eleventhLord = findHouseLord(chart, 11);

        if (!secondLord || !eleventhLord) return false;

        const secondLordHouse = findPlanetHouse(chart, secondLord);
        const eleventhLordHouse = findPlanetHouse(chart, eleventhLord);

        if (!secondLordHouse || !eleventhLordHouse) return false;

        const angular = new Set([1, 4, 7, 10]);
        return angular.has(secondLordHouse) && angular.has(eleventhLordHouse);
      } catch (e) {
        return false;
      }
    },
  },

  // 11. Amala Yoga
  AMALA_YOGA: {
    name: 'Amala Yoga',
    chapter: 41,
    type: 'Reputation',
    formation_rule: 'Benefic in 10th house (Karma Lagna)',
    effects: 'Pure/spotless reputation, wealth through right action',
    severity: 'High',
    detection(chart) {
      try {
        return housesContainPlanets(chart, [10], BENEFICS);
      } catch (e) {
        return false;
      }
    },
  },

  // 12. Kendra Yoga
  KENDRA_YOGA: {
    name: 'Kendra Yoga',
    chapter: 41,
    type: 'Wealth',
    formation_rule: 'Benefics in all four angles (1/4/7/10)',
    effects: 'Wealth, health, happiness, security, prosperity',
    severity: 'Very High',
    detection(chart) {
      try {
        const angular = [1, 4, 7, 10];
        for (const house of angular) {
          const hasNoBenefic = !housesContainPlanets(chart, [house], BENEFICS);
          if (hasNoBenefic) return false;
        }
        return true;
      } catch (e) {
        return false;
      }
    },
  },

  // 13. Parivartana Yoga
  PARIVARTANA_YOGA: {
    name: 'Parivartana Yoga',
    chapter: 41,
    type: 'Wealth',
    formation_rule: '2nd and 9th lords exchange signs',
    effects: 'Inherited wealth, family prosperity, fortunate',
    severity: 'High',
    detection(chart) {
      try {
        const secondLord = findHouseLord(chart, 2);
        const ninthLord = findHouseLord(chart, 9);

        if (!secondLord || !ninthLord) return false;

        // Check if they're in each other's signs
        // This requires checking: is secondLord in sign ruled by ninthLord, AND ninthLord in sign ruled by secondLord
        const secondLordSign = Math.floor((chart.planetPositions?.[secondLord] || 0) / 30);
        const ninthLordSign = Math.floor((chart.planetPositions?.[ninthLord] || 0) / 30);

        const secondLordRules = RASI_LORD.indexOf(secondLord);
        const ninthLordRules = RASI_LORD.indexOf(ninthLord);

        return (secondLordSign === ninthLordRules) && (ninthLordSign === secondLordRules);
      } catch (e) {
        return false;
      }
    },
  },

  // 14. Vipareeta Raj Yoga
  VIPAREETA_RAJ_YOGA: {
    name: 'Vipareeta Raj Yoga',
    chapter: 41,
    type: 'Overcoming',
    formation_rule: '6th, 8th, 12th lords in 6th/8th/12th house (own places)',
    effects: 'Reversal of fortune, overcoming adversity',
    severity: 'Medium',
    detection(chart) {
      try {
        const sixthLord = findHouseLord(chart, 6);
        const eighthLord = findHouseLord(chart, 8);
        const twelfthLord = findHouseLord(chart, 12);

        if (!sixthLord || !eighthLord || !twelfthLord) return false;

        const sixthLordHouse = findPlanetHouse(chart, sixthLord);
        const eighthLordHouse = findPlanetHouse(chart, eighthLord);
        const twelfthLordHouse = findPlanetHouse(chart, twelfthLord);

        const afflicted = new Set([6, 8, 12]);
        return (sixthLordHouse && afflicted.has(sixthLordHouse)) &&
               (eighthLordHouse && afflicted.has(eighthLordHouse)) &&
               (twelfthLordHouse && afflicted.has(twelfthLordHouse));
      } catch (e) {
        return false;
      }
    },
  },

  // 15. Kusuma Yoga
  KUSUMA_YOGA: {
    name: 'Kusuma Yoga',
    chapter: 41,
    type: 'Wealth',
    formation_rule: 'All benefics in angle or trine (1/4/5/7/9/10)',
    effects: 'Wealth, beauty, auspiciousness, happiness',
    severity: 'High',
    detection(chart) {
      try {
        const angularTrinal = [1, 4, 5, 7, 9, 10];
        const beneficsToCheck = ['Jupiter', 'Venus', 'Mercury'];

        for (const planet of beneficsToCheck) {
          const house = findPlanetHouse(chart, planet);
          if (!house || !angularTrinal.includes(house)) {
            return false;
          }
        }
        return true;
      } catch (e) {
        return false;
      }
    },
  },
};

// Helper: Enrich detected wealth yoga with strength metadata
function enrichWealthYogaMetadata(yogaKey, chart, baseYoga) {
  const enriched = { ...baseYoga };

  try {
    if (yogaKey === 'DHANAYOGA') {
      const secondLord = findHouseLord(chart, 2);
      const eleventhLord = findHouseLord(chart, 11);

      if (!secondLord || !eleventhLord) return enriched;

      const secondLordHouse = findPlanetHouse(chart, secondLord);
      const eleventhLordHouse = findPlanetHouse(chart, eleventhLord);

      if (!secondLordHouse || !eleventhLordHouse) return enriched;

      const angular = new Set([1, 4, 7, 10]);
      const trinal = new Set([5, 9]);

      const secondLordAngular = angular.has(secondLordHouse);
      const secondLordTrinal = trinal.has(secondLordHouse);
      const eleventhLordAngular = angular.has(eleventhLordHouse);
      const eleventhLordTrinal = trinal.has(eleventhLordHouse);

      // Calculate severity based on conditions A-D from BPHS
      let severity = 1;
      let conditionType = 'Weak';

      if (secondLordAngular && eleventhLordAngular) {
        severity = 4;
        conditionType = 'Strong (both lords in angles)';
      } else if ((secondLordAngular && eleventhLordTrinal) || (secondLordTrinal && eleventhLordAngular)) {
        severity = 3;
        conditionType = 'Moderate (one lord angular, one trinal)';
      } else if (secondLordTrinal && eleventhLordTrinal) {
        severity = 2;
        conditionType = 'Weak (both lords in trines)';
      } else {
        severity = 1;
        conditionType = 'Challenged (suboptimal positions)';
      }

      enriched.dhanaSeverity = severity;
      enriched.lords_positions = {
        '2nd_lord': { name: secondLord, house: secondLordHouse },
        '11th_lord': { name: eleventhLord, house: eleventhLordHouse }
      };

      // Update effects based on severity
      if (severity === 4) {
        enriched.effects = 'Wealth, riches, financial security, prosperity. Strong: abundant, steady wealth accumulation, multiple sources of income';
      } else if (severity === 3) {
        enriched.effects = 'Wealth, riches, financial security, prosperity. Moderate: fluctuating wealth, opportunities through effort';
      } else if (severity === 2) {
        enriched.effects = 'Wealth, riches, financial security, prosperity. Weak: limited wealth, requires hard work and persistence';
      } else {
        enriched.effects = 'Wealth, riches, financial security, prosperity. Challenged: wealth struggles, delays, potential losses (check for lord debilitation)';
      }
    }
  } catch (e) {
    // Silently skip enrichment errors
  }

  return enriched;
}

function calculateWealthYogas(chart) {
  const matchedYogas = [];

  try {
    if (!chart || !chart.houses || !chart.planetPositions) {
      return attachSource({
        yogas: [],
        totalMatched: 0,
      }, BPHS_WEALTH_YOGAS_SOURCE);
    }

    for (const yogaKey in WEALTH_YOGAS_CATALOG) {
      const yoga = WEALTH_YOGAS_CATALOG[yogaKey];
      if (yoga.detection && typeof yoga.detection === 'function') {
        try {
          if (yoga.detection(chart)) {
            const baseYoga = {
              yogaKey,
              name: yoga.name,
              chapter: yoga.chapter,
              type: yoga.type,
              formation_rule: yoga.formation_rule,
              effects: yoga.effects,
              severity: yoga.severity,
            };

            // Enrich with metadata (strength scales, lord positions)
            const enrichedYoga = enrichWealthYogaMetadata(yogaKey, chart, baseYoga);
            matchedYogas.push(enrichedYoga);
          }
        } catch (error) {
          console.warn(`Error detecting ${yogaKey}:`, error.message);
        }
      }
    }
  } catch (error) {
    console.error('Error in calculateWealthYogas:', error);
  }

  return attachSource({
    yogas: matchedYogas,
    totalMatched: matchedYogas.length,
  }, BPHS_WEALTH_YOGAS_SOURCE);
}

module.exports = {
  calculateWealthYogas,
  WEALTH_YOGAS_CATALOG,
  BPHS_WEALTH_YOGAS_SOURCE,
};
