const { attachSource } = require('../contracts/chartContext');
const { EXALTATION, MOOLATRIKONA } = require('./shadbala');
const { RASI_LORD } = require('./karaka');
const { equalDivisionVarga, EQUAL_DIVISION_VARGAS } = require('./vargaChart');

const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const BENEFICS = new Set(['Jupiter', 'Venus', 'Mercury']);
const MALEFICS = new Set(['Sun', 'Mars', 'Saturn']);

// Helper: Find which house a planet is in
function findPlanetHouse(chart, planet) {
  for (let house = 1; house <= 12; house++) {
    if (chart.houses[house]?.includes(planet)) return house;
  }
  return null;
}

// Helper: Find lord of a house (by finding which planet rules the sign in that house)
function findHouseLord(chart, house) {
  const planetsInHouse = chart.houses[house] || [];
  if (planetsInHouse.length === 0) return null;

  // Find the rasi/sign occupying this house
  // This is a simplified approach: we assume the first planet's sign determines the house sign
  const firstPlanet = planetsInHouse[0];
  const planetPos = chart.planetPositions?.[firstPlanet];
  if (typeof planetPos !== 'number') return null;

  const houseSign = Math.floor(planetPos / 30);
  return RASI_LORD[houseSign] || null;
}

// Helper: Check if two planets are in same house (conjunction)
function arePlanetsConjunct(chart, planet1, planet2) {
  const house1 = findPlanetHouse(chart, planet1);
  const house2 = findPlanetHouse(chart, planet2);
  return house1 !== null && house1 === house2;
}

const BPHS_RAJA_YOGAS_SOURCE = {
  title: 'Brihat Parashara Hora Shastra (BPHS)',
  author: 'R. Santhanam (translation)',
  file: 'C23_BPHS_Santhanam.pdf',
  tradition: 'Parashari',
  convention: 'Raja Yogas, Ch.39 v.6-48',
  pageLocus: 'file pages TBD / printed pages TBD (Ch.39 v.6-48) — S11-A',
};

// Phase 1A: Rasi-only Raja Yogas (no divisional dependencies)
const RAJA_YOGAS_CATALOG = {
  // Verse 17: Royal Placement Yoga
  ROYAL_PLACEMENT_YOGA: {
    name: 'Royal Placement Yoga',
    verse: 'BPHS 39.17',
    formation_rule: 'Ascendant, 2nd, 4th occupied by benefices; malefic in 3rd',
    effects: 'Native becomes king or equal to king',
    detection(chart) {
      try {
        // Check benefices in 1st, 2nd, 4th
        const hasBeneficAsc = chart.houses[1]?.some(p => BENEFICS.has(p));
        const hasBenefic2nd = chart.houses[2]?.some(p => BENEFICS.has(p));
        const hasBenefic4th = chart.houses[4]?.some(p => BENEFICS.has(p));

        // Check malefic in 3rd
        const hasMalefic3rd = chart.houses[3]?.some(p => MALEFICS.has(p));

        return hasBeneficAsc && hasBenefic2nd && hasBenefic4th && hasMalefic3rd;
      } catch (e) {
        return false;
      }
    },
  },

  // Verse 18: 2nd House Exaltation Yoga
  SECOND_HOUSE_EXALTATION_YOGA: {
    name: '2nd House Exaltation Yoga',
    verse: 'BPHS 39.18',
    formation_rule: 'Moon, Jupiter, Venus, or Mercury exalted in 2nd house',
    effects: 'Native becomes wealthy',
    detection(chart) {
      try {
        const secondHouse = chart.houses[2] || [];
        const exaltedJVM = ['Moon', 'Jupiter', 'Venus', 'Mercury'];

        return secondHouse.some(planet => {
          if (!exaltedJVM.includes(planet)) return false;
          const exaltInfo = EXALTATION[planet];
          if (!exaltInfo) return false;
          const planetPos = chart.planetPositions?.[planet];
          if (typeof planetPos !== 'number') return false;
          const planetSign = Math.floor(planetPos / 30);
          return planetSign === exaltInfo.sign;
        });
      } catch (e) {
        return false;
      }
    },
  },

  // Verse 41: Moon-Venus Aspect Yoga
  MOON_VENUS_ASPECT_YOGA: {
    name: 'Moon-Venus Aspect Yoga',
    verse: 'BPHS 39.41',
    formation_rule: 'Moon and Venus mutually aspect (anywhere in chart)',
    effects: 'Raja yoga obtained',
    detection(chart) {
      try {
        const moonAspects = chart.aspects?.Moon || [];
        const venusAspects = chart.aspects?.Venus || [];
        return moonAspects.includes('Venus') && venusAspects.includes('Moon');
      } catch (e) {
        return false;
      }
    },
  },

  // Verse 44: Exalted Planets Yoga (1-3 planets)
  EXALTED_PLANETS_YOGA_1_TO_3: {
    name: 'Exalted Planets Yoga (1-3 planets)',
    verse: 'BPHS 39.44',
    formation_rule: '1, 2, or 3 planets in exaltation in natal chart',
    effects: 'Royal scion becomes king; another equal to king or wealthy',
    detection(chart) {
      try {
        let exaltedCount = 0;
        PLANETS.forEach(planet => {
          const exaltInfo = EXALTATION[planet];
          if (!exaltInfo) return;
          const planetPos = chart.planetPositions?.[planet];
          if (typeof planetPos !== 'number') return;
          const planetSign = Math.floor(planetPos / 30);
          if (planetSign === exaltInfo.sign) exaltedCount++;
        });
        return exaltedCount >= 1 && exaltedCount <= 3;
      } catch (e) {
        return false;
      }
    },
  },

  // Verse 45: Exalted Planets Yoga (4-5 planets)
  EXALTED_PLANETS_YOGA_4_TO_5: {
    name: 'Exalted Planets Yoga (4-5 planets)',
    verse: 'BPHS 39.45',
    formation_rule: '4-5 planets in exaltation',
    effects: 'Even person of base-birth becomes king',
    detection(chart) {
      try {
        let exaltedCount = 0;
        PLANETS.forEach(planet => {
          const exaltInfo = EXALTATION[planet];
          if (!exaltInfo) return;
          const planetPos = chart.planetPositions?.[planet];
          if (typeof planetPos !== 'number') return;
          const planetSign = Math.floor(planetPos / 30);
          if (planetSign === exaltInfo.sign) exaltedCount++;
        });
        return exaltedCount >= 4 && exaltedCount <= 5;
      } catch (e) {
        return false;
      }
    },
  },

  // Verse 46: Six Exalted Planets Yoga
  SIX_EXALTED_PLANETS_YOGA: {
    name: 'Six Exalted Planets Yoga',
    verse: 'BPHS 39.46',
    formation_rule: '6 planets in exaltation',
    effects: 'Native becomes emperor',
    detection(chart) {
      try {
        let exaltedCount = 0;
        PLANETS.forEach(planet => {
          const exaltInfo = EXALTATION[planet];
          if (!exaltInfo) return;
          const planetPos = chart.planetPositions?.[planet];
          if (typeof planetPos !== 'number') return;
          const planetSign = Math.floor(planetPos / 30);
          if (planetSign === exaltInfo.sign) exaltedCount++;
        });
        return exaltedCount >= 6;
      } catch (e) {
        return false;
      }
    },
  },

  // Verse 47: Jupiter-Venus-Mercury Exaltation Yoga
  JVM_EXALTATION_YOGA: {
    name: 'Jupiter-Venus-Mercury Exaltation Yoga',
    verse: 'BPHS 39.47',
    formation_rule: 'One among Jupiter, Venus, Mercury exalted + benefice in angle',
    effects: 'Native becomes king or equal to king',
    detection(chart) {
      try {
        const jvmPlanets = ['Jupiter', 'Venus', 'Mercury'];
        const exaltedJVM = jvmPlanets.some(planet => {
          const exaltInfo = EXALTATION[planet];
          if (!exaltInfo) return false;
          const planetPos = chart.planetPositions?.[planet];
          if (typeof planetPos !== 'number') return false;
          const planetSign = Math.floor(planetPos / 30);
          return planetSign === exaltInfo.sign;
        });

        if (!exaltedJVM) return false;

        // Check benefice in angle (1, 4, 7, 10)
        const beneficInAngle = [1, 4, 7, 10].some(house => {
          return chart.houses[house]?.some(p => BENEFICS.has(p));
        });

        return beneficInAngle;
      } catch (e) {
        return false;
      }
    },
  },

  // Verse 48: Benefics and Malefics Placement Yoga
  BENEFICS_MALEFICS_PLACEMENT_YOGA: {
    name: 'Benefics and Malefics Placement Yoga',
    verse: 'BPHS 39.48',
    formation_rule: 'All benefices in angles (1, 4, 7, 10); malefics in 3rd, 6th, 11th',
    effects: 'Person of mean descent ascends throne',
    detection(chart) {
      try {
        // All benefices in angles
        const allBeneficsInAngles = PLANETS.every(planet => {
          if (!BENEFICS.has(planet)) return true; // Malefics don't need to be in angles
          return chart.houses[1]?.includes(planet) ||
                 chart.houses[4]?.includes(planet) ||
                 chart.houses[7]?.includes(planet) ||
                 chart.houses[10]?.includes(planet);
        });

        if (!allBeneficsInAngles) return false;

        // All malefics in 3rd, 6th, 11th
        const allMaleficsInMaraka = PLANETS.every(planet => {
          if (!MALEFICS.has(planet)) return true; // Benefics don't need to be restricted
          return chart.houses[3]?.includes(planet) ||
                 chart.houses[6]?.includes(planet) ||
                 chart.houses[11]?.includes(planet);
        });

        return allMaleficsInMaraka;
      } catch (e) {
        return false;
      }
    },
  },

  // ============ Phase 1B: Angular-Trinal Lord Conjunctions & Aspects ============

  // Verse 21: 10th Lord Raja Yoga
  TENTH_LORD_RAJA_YOGA: {
    name: '10th Lord Raja Yoga',
    verse: 'BPHS 39.21',
    formation_rule: '10th lord in own house/exaltation, aspects ascendant, benefices in angles',
    effects: 'Raja yoga formed',
    detection(chart) {
      try {
        const tenthLord = findHouseLord(chart, 10);
        if (!tenthLord) return false;

        // Check if 10th lord in own sign or exaltation
        const tenthLordPos = chart.planetPositions?.[tenthLord];
        if (typeof tenthLordPos !== 'number') return false;

        const tenthLordSign = Math.floor(tenthLordPos / 30);
        const tenthLordRulerSign = RASI_LORD.indexOf(tenthLord);
        const exaltInfo = EXALTATION[tenthLord];

        const isStrong = (tenthLordRulerSign === tenthLordSign) ||
                         (exaltInfo && exaltInfo.sign === tenthLordSign);

        if (!isStrong) return false;

        // Check if aspects ascendant (simplified: must be in opposite house)
        const tenthLordHouse = findPlanetHouse(chart, tenthLord);
        const aspectsAsc = (tenthLordHouse === 1 || tenthLordHouse === 7);

        if (!aspectsAsc) return false;

        // Check benefices in angles
        const beneficsInAngles = [1, 4, 7, 10].some(house => {
          return chart.houses[house]?.some(p => BENEFICS.has(p));
        });

        return beneficsInAngles;
      } catch (e) {
        return false;
      }
    },
  },

  // Verse 33-34: 5th & 9th Lord Yoga
  FIFTH_NINTH_LORD_YOGA: {
    name: '5th & 9th Lord Yoga',
    verse: 'BPHS 39.33-34',
    formation_rule: '5th lord and 9th lord mutually aspect OR conjunct',
    effects: 'Native obtains kingdom',
    detection(chart) {
      try {
        const fifthLord = findHouseLord(chart, 5);
        const ninthLord = findHouseLord(chart, 9);

        if (!fifthLord || !ninthLord) return false;

        // Check if conjunct (in same house)
        if (arePlanetsConjunct(chart, fifthLord, ninthLord)) return true;

        // Check mutual aspect (simplified: in opposite houses or same aspect pattern)
        const fifthHouse = findPlanetHouse(chart, fifthLord);
        const ninthHouse = findPlanetHouse(chart, ninthLord);

        const mutualAspect = chart.aspects?.[fifthLord]?.includes(ninthLord) &&
                             chart.aspects?.[ninthLord]?.includes(fifthLord);

        return mutualAspect || false;
      } catch (e) {
        return false;
      }
    },
  },

  // Verse 37: 4th-5th Lord Conjunction Yoga
  FOURTH_FIFTH_CONJUNCTION_YOGA: {
    name: '4th-5th Lord Conjunction Yoga',
    verse: 'BPHS 39.37',
    formation_rule: '4th lord conjunct 5th lord',
    effects: 'Native obtains kingdom',
    detection(chart) {
      try {
        const fourthLord = findHouseLord(chart, 4);
        const fifthLord = findHouseLord(chart, 5);

        if (!fourthLord || !fifthLord) return false;

        return arePlanetsConjunct(chart, fourthLord, fifthLord);
      } catch (e) {
        return false;
      }
    },
  },

  // Verse 37: 10th-5th Lord Conjunction Yoga
  TENTH_FIFTH_CONJUNCTION_YOGA: {
    name: '10th-5th Lord Conjunction Yoga',
    verse: 'BPHS 39.37',
    formation_rule: '10th lord conjunct 5th lord',
    effects: 'Native obtains kingdom',
    detection(chart) {
      try {
        // Find which planets are in 10th and 5th
        const tenthPlanets = new Set(chart.houses[10] || []);
        const fifthPlanets = new Set(chart.houses[5] || []);

        // Check if any planet is in both (conjunct)
        for (const planet of tenthPlanets) {
          if (fifthPlanets.has(planet)) {
            return true;  // Same planet in both houses = conjunction
          }
        }
        return false;
      } catch (e) {
        return false;
      }
    },
  },

  // Verse 35: Angular-Trinal Lord Exchange Yoga
  ANGULAR_TRINAL_EXCHANGE_YOGA: {
    name: 'Angular-Trinal Lord Exchange Yoga',
    verse: 'BPHS 39.35',
    formation_rule: '4th lord in 10th, 10th lord in 4th',
    effects: 'Native attains kingdom',
    detection(chart) {
      try {
        const fourthLord = findHouseLord(chart, 4);
        const tenthLord = findHouseLord(chart, 10);

        if (!fourthLord || !tenthLord) return false;

        // Check exchange: 4th lord in 10th, 10th lord in 4th
        const fourthInTenth = findPlanetHouse(chart, fourthLord) === 10;
        const tenthInFourth = findPlanetHouse(chart, tenthLord) === 4;

        return fourthInTenth && tenthInFourth;
      } catch (e) {
        return false;
      }
    },
  },

  // Verse 36: Multiple Lord Conjunction Yoga
  MULTIPLE_LORD_CONJUNCTION_YOGA: {
    name: 'Multiple Lord Conjunction Yoga',
    verse: 'BPHS 39.36',
    formation_rule: '5th, 10th, 4th, Ascendant lords join in 9th house',
    effects: 'Native becomes ruler with fame in four directions',
    detection(chart) {
      try {
        const ascLord = findHouseLord(chart, 1);
        const fourthLord = findHouseLord(chart, 4);
        const fifthLord = findHouseLord(chart, 5);
        const tenthLord = findHouseLord(chart, 10);

        if (!ascLord || !fourthLord || !fifthLord || !tenthLord) return false;

        // All four lords must be in 9th house
        const ninthHouse = chart.houses[9] || [];
        return ninthHouse.includes(ascLord) &&
               ninthHouse.includes(fourthLord) &&
               ninthHouse.includes(fifthLord) &&
               ninthHouse.includes(tenthLord);
      } catch (e) {
        return false;
      }
    },
  },

  // Verse 38: 5th Lord Placement Yoga
  FIFTH_LORD_PLACEMENT_YOGA: {
    name: '5th Lord Placement Yoga',
    verse: 'BPHS 39.38',
    formation_rule: '5th lord in ascendant/4th/10th conjunct 9th lord or Ascendant lord',
    effects: 'Native becomes king',
    detection(chart) {
      try {
        const fifthLord = findHouseLord(chart, 5);
        const ninthLord = findHouseLord(chart, 9);
        const ascLord = findHouseLord(chart, 1);

        if (!fifthLord || !ninthLord || !ascLord) return false;

        const fifthHouse = findPlanetHouse(chart, fifthLord);
        const isInAngle = fifthHouse === 1 || fifthHouse === 4 || fifthHouse === 10;

        if (!isInAngle) return false;

        // Conjunct with 9th lord or Ascendant lord
        return arePlanetsConjunct(chart, fifthLord, ninthLord) ||
               arePlanetsConjunct(chart, fifthLord, ascLord);
      } catch (e) {
        return false;
      }
    },
  },

  // Verse 29-31: Angular Lord Aspect Yoga
  ANGULAR_LORD_ASPECT_YOGA: {
    name: 'Angular Lord Aspect Yoga',
    verse: 'BPHS 39.29-31',
    formation_rule: '4th/10th/2nd/11th lord aspects ascendant',
    effects: 'Native becomes king',
    detection(chart) {
      try {
        const angularLords = [
          findHouseLord(chart, 2),
          findHouseLord(chart, 4),
          findHouseLord(chart, 10),
          findHouseLord(chart, 11),
        ].filter(Boolean);

        if (angularLords.length === 0) return false;

        // At least one angular lord must aspect ascendant (be in 1st or 7th)
        return angularLords.some(lord => {
          const house = findPlanetHouse(chart, lord);
          return house === 1 || house === 7;
        });
      } catch (e) {
        return false;
      }
    },
  },

  // Verse 28: Debilitated Single Lord Yoga
  DEBILITATED_SINGLE_LORD_YOGA: {
    name: 'Debilitated Single Lord Yoga',
    verse: 'BPHS 39.28',
    formation_rule: 'One among 6th/8th/12th lords debilitated, aspects ascendant',
    effects: 'Raja yoga (affliction becomes strength)',
    detection(chart) {
      try {
        const lords = [
          findHouseLord(chart, 6),
          findHouseLord(chart, 8),
          findHouseLord(chart, 12),
        ].filter(Boolean);

        if (lords.length === 0) return false;

        const debilitatedCount = lords.filter(lord => {
          const lordPos = chart.planetPositions?.[lord];
          if (typeof lordPos !== 'number') return false;
          const lordSign = Math.floor(lordPos / 30);
          const debilInfo = EXALTATION[lord];
          if (!debilInfo) return false;
          const debilSign = (debilInfo.sign + 6) % 12;
          return lordSign === debilSign;
        }).length;

        if (debilitatedCount !== 1) return false;

        // One of them must aspect ascendant (be in 1st or 7th)
        return lords.some(lord => {
          const house = findPlanetHouse(chart, lord);
          return house === 1 || house === 7;
        });
      } catch (e) {
        return false;
      }
    },
  },

  // ============ Phase 1C: Divisional & Timing-Based Yogas ============

  // Verse 42: Moon Vargothamsa Yoga
  MOON_VARGOTHAMSA_YOGA: {
    name: 'Moon Vargothamsa Yoga',
    verse: 'BPHS 39.42',
    formation_rule: 'Moon strong, in Vargothamsa (own sign in Navamsha), aspected by 4+ planets',
    effects: 'Native becomes king',
    detection(chart) {
      try {
        if (!chart.planetPositions?.Moon) return false;

        const moonPos = chart.planetPositions.Moon;
        const moonSign = Math.floor(moonPos / 30);
        const moonDegreeInSign = moonPos % 30;

        // Check if Moon is in own sign (Cancer = 3)
        if (moonSign !== 3) return false;

        // Check if Moon is in own Navamsha (Moon's own sign in D9)
        const navamsaConfig = EQUAL_DIVISION_VARGAS.D9;
        const navamsaSign = equalDivisionVarga(navamsaConfig, moonSign, moonDegreeInSign);
        if (navamsaSign !== 3) return false;  // Must also be in Cancer in Navamsha

        // Check if aspected by 4+ planets
        const moonAspects = chart.aspects?.Moon || [];
        const aspectingCount = moonAspects.length;

        return aspectingCount >= 4;
      } catch (e) {
        return false;
      }
    },
  },

  // Verse 43: Ascendant Uttamamsa Yoga
  ASCENDANT_UTTAMAMSA_YOGA: {
    name: 'Ascendant Uttamamsa Yoga',
    verse: 'BPHS 39.43',
    formation_rule: 'Ascendant in Uttamamsa (exalted in divisional charts), aspected by 4+ planets',
    effects: 'Native becomes king',
    detection(chart) {
      try {
        // Simplified: Check if Ascendant sign has an exalted planet aspecting it
        // Uttamamsa = planet in its exaltation sign in a divisional chart
        // For now, check if any exalted planet aspects Ascendant

        const ascSign = chart.ascendant ? Math.floor(chart.ascendant / 30) : null;
        if (ascSign === null) return false;

        let exaltedAspectCount = 0;

        PLANETS.forEach(planet => {
          const planetPos = chart.planetPositions?.[planet];
          if (typeof planetPos !== 'number') return;

          const planetSign = Math.floor(planetPos / 30);
          const exaltInfo = EXALTATION[planet];

          // Check if exalted
          if (exaltInfo && planetSign === exaltInfo.sign) {
            // Check if aspects Ascendant
            const aspects = chart.aspects?.[planet] || [];
            if (aspects.includes('Ascendant')) {
              exaltedAspectCount++;
            }
          }
        });

        return exaltedAspectCount >= 4;
      } catch (e) {
        return false;
      }
    },
  },

  // Verse 40: Dinardha Yoga (Day-midpoint birth)
  DINARDHA_YOGA: {
    name: 'Dinardha Yoga',
    verse: 'BPHS 39.40',
    formation_rule: 'Birth within 2.5 ghatis (60 min) from solar noon',
    effects: 'Native becomes king or equal to king',
    detection(chart) {
      try {
        // Requires birth time in context
        // Check if chart has noon time marker
        const birthTime = chart.birthTime;
        if (!birthTime) return false;

        // Simplified: if birth hour is between 11:00-13:00, roughly within 2.5 ghatis of noon
        const hour = Math.floor(birthTime);
        return hour === 11 || hour === 12;
      } catch (e) {
        return false;
      }
    },
  },

  // Verse 40: Nisardha Yoga (Night-midpoint birth)
  NISARDHA_YOGA: {
    name: 'Nisardha Yoga',
    verse: 'BPHS 39.40',
    formation_rule: 'Birth within 2.5 ghatis (60 min) from midnight',
    effects: 'Native becomes king or equal to king',
    detection(chart) {
      try {
        const birthTime = chart.birthTime;
        if (!birthTime) return false;

        // Simplified: if birth hour is 23 or 0, roughly within 2.5 ghatis of midnight
        const hour = Math.floor(birthTime);
        return hour === 23 || hour === 0;
      } catch (e) {
        return false;
      }
    },
  },

  // Additional: Exalted Planets with Moolatrikona
  EXALTED_MOOLATRIKONA_YOGA: {
    name: 'Exalted & Moolatrikona Planets Yoga',
    verse: 'BPHS 39.45 (variant)',
    formation_rule: '4-5 planets in exaltation or Moolatrikona signs',
    effects: 'Even person of base-birth becomes king',
    detection(chart) {
      try {
        let exaltedCount = 0;
        let moolatrikonaCount = 0;

        PLANETS.forEach(planet => {
          const planetPos = chart.planetPositions?.[planet];
          if (typeof planetPos !== 'number') return;

          const planetSign = Math.floor(planetPos / 30);
          const exaltInfo = EXALTATION[planet];
          const mtInfo = MOOLATRIKONA?.[planet];

          // Check exaltation
          if (exaltInfo && planetSign === exaltInfo.sign) {
            exaltedCount++;
          }

          // Check Moolatrikona (if in sign and degree range)
          if (mtInfo && planetSign === mtInfo.sign) {
            const degreeInSign = planetPos % 30;
            if (degreeInSign >= mtInfo.from && degreeInSign <= mtInfo.to) {
              moolatrikonaCount++;
            }
          }
        });

        const totalStrong = exaltedCount + moolatrikonaCount;
        return totalStrong >= 4 && totalStrong <= 5;
      } catch (e) {
        return false;
      }
    },
  },
};

function calculateRajaYogas(chart) {
  const matchedYogas = [];

  try {
    if (!chart || !chart.houses || !chart.planetPositions) {
      return attachSource({
        yogas: [],
        totalMatched: 0,
        source: BPHS_RAJA_YOGAS_SOURCE,
      });
    }

    for (const yogaKey in RAJA_YOGAS_CATALOG) {
      const yoga = RAJA_YOGAS_CATALOG[yogaKey];
      if (yoga.detection && typeof yoga.detection === 'function') {
        try {
          if (yoga.detection(chart)) {
            matchedYogas.push({
              yogaKey,
              name: yoga.name,
              verse: yoga.verse,
              formation_rule: yoga.formation_rule,
              effects: yoga.effects,
            });
          }
        } catch (error) {
          console.warn(`Error detecting ${yogaKey}:`, error.message);
        }
      }
    }
  } catch (error) {
    console.error('Error in calculateRajaYogas:', error);
  }

  return attachSource({
    yogas: matchedYogas,
    totalMatched: matchedYogas.length,
  }, BPHS_RAJA_YOGAS_SOURCE);
}

module.exports = {
  calculateRajaYogas,
  RAJA_YOGAS_CATALOG,
  BPHS_RAJA_YOGAS_SOURCE,
};
