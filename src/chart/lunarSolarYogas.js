const { attachSource } = require('../contracts/chartContext');
const { EXALTATION } = require('./shadbala');
const { RASI_LORD } = require('./karaka');

const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const BENEFICS = new Set(['Jupiter', 'Venus', 'Mercury']);

const BPHS_LUNAR_SOLAR_SOURCE = {
  title: 'Brihat Parashara Hora Shastra (BPHS)',
  author: 'R. Santhanam (translation)',
  file: 'C23_BPHS_Santhanam.pdf',
  tradition: 'Parashari',
  convention: 'Lunar, Solar & PMP Yogas, Ch.31-32, Ch.37-38',
  pageLocus: 'file pages TBD / printed pages TBD — S11-C',
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

// Helper: Check if planet is exalted or in own sign
function isExaltedOrOwn(planet, planetPos) {
  if (typeof planetPos !== 'number') return false;

  const planetSign = Math.floor(planetPos / 30);
  const exaltInfo = EXALTATION[planet];

  if (!exaltInfo) return false;

  // Exalted = exaltation sign
  if (planetSign === exaltInfo.sign) return true;

  // Own sign depends on planet (Rasi lord)
  const ownSign = RASI_LORD.indexOf(planet);
  return ownSign >= 0 && planetSign === ownSign;
}

const LUNAR_SOLAR_YOGAS_CATALOG = {
  // ============ LUNAR YOGAS (BPHS Ch.37) ============

  // 1. Sunapha Yoga
  SUNAPHA_YOGA: {
    name: 'Sunapha Yoga',
    chapter: 37,
    type: 'Lunar',
    formation_rule: 'Benefic in 2nd house from Moon',
    effects: 'Eloquence, learning, wealth, fame in speech and communication',
    severity: 'High',
    detection(chart) {
      try {
        const moonHouse = findPlanetHouse(chart, 'Moon');
        if (moonHouse === null) return false;

        // 2nd from Moon
        const targetHouse = moonHouse === 12 ? 1 : moonHouse + 1;
        const planetsInTarget = chart.houses[targetHouse] || [];

        // Check if any benefic is in this house
        for (const planet of planetsInTarget) {
          if (BENEFICS.has(planet)) return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    },
  },

  // 2. Anapha Yoga
  ANAPHA_YOGA: {
    name: 'Anapha Yoga',
    chapter: 37,
    type: 'Lunar',
    formation_rule: 'Benefic in 12th house from Moon',
    effects: 'Fortunate, famous, wealthy, graceful, successful in all undertakings',
    severity: 'High',
    detection(chart) {
      try {
        const moonHouse = findPlanetHouse(chart, 'Moon');
        if (moonHouse === null) return false;

        // 12th from Moon
        const targetHouse = moonHouse === 1 ? 12 : moonHouse - 1;
        const planetsInTarget = chart.houses[targetHouse] || [];

        // Check if any benefic is in this house
        for (const planet of planetsInTarget) {
          if (BENEFICS.has(planet)) return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    },
  },

  // 3. Duradhara Yoga
  DURADHARA_YOGA: {
    name: 'Duradhara Yoga',
    chapter: 37,
    type: 'Lunar',
    formation_rule: 'Benefics in both 2nd and 12th houses from Moon',
    effects: 'Most fortunate, king-like status, extraordinary wealth, long life, excellent health',
    severity: 'Very High',
    detection(chart) {
      try {
        const moonHouse = findPlanetHouse(chart, 'Moon');
        if (moonHouse === null) return false;

        // Houses around Moon
        const house2 = moonHouse === 12 ? 1 : moonHouse + 1;
        const house12 = moonHouse === 1 ? 12 : moonHouse - 1;

        const beneficIn2 = (chart.houses[house2] || []).some(p => BENEFICS.has(p));
        const beneficIn12 = (chart.houses[house12] || []).some(p => BENEFICS.has(p));

        return beneficIn2 && beneficIn12;
      } catch (e) {
        return false;
      }
    },
  },

  // 4. Kemadruma Yoga
  KEMADRUMA_YOGA: {
    name: 'Kemadruma Yoga',
    chapter: 37,
    type: 'Lunar',
    formation_rule: 'No benefics in 2nd or 12th from Moon, Moon not exalted/own sign (unless cancelled by Jupiter in angle/5th)',
    effects: 'Inauspicious, loss of wealth, unstable mind, obstacles in all endeavors (can be cancelled by strong Jupiter or 2nd/12th lords)',
    severity: 'High (Negative)',
    cancellation_conditions: 'Jupiter in 1st/4th/5th/7th/10th houses or 2nd/12th lords exalted/own sign',
    detection(chart) {
      try {
        const moonHouse = findPlanetHouse(chart, 'Moon');
        if (moonHouse === null) return false;

        const house2 = moonHouse === 12 ? 1 : moonHouse + 1;
        const house12 = moonHouse === 1 ? 12 : moonHouse - 1;

        const beneficIn2 = (chart.houses[house2] || []).some(p => BENEFICS.has(p));
        const beneficIn12 = (chart.houses[house12] || []).some(p => BENEFICS.has(p));

        // Check if Moon is exalted or in own sign
        const moonPos = chart.planetPositions?.Moon;
        const moonStrong = isExaltedOrOwn('Moon', moonPos);

        // Base Kemadruma: NO benefics AND Moon not strong
        if (!(!beneficIn2 && !beneficIn12 && !moonStrong)) {
          return false;
        }

        // Simplified cancellation: Check only if Jupiter is in angle (1, 4, 7, 10) or 5th
        const jupiterHouse = findPlanetHouse(chart, 'Jupiter');
        if (jupiterHouse && [1, 4, 5, 7, 10].includes(jupiterHouse)) {
          return false; // Kemadruma cancelled by strong Jupiter position
        }

        return true; // Kemadruma confirmed
      } catch (e) {
        return false;
      }
    },
  },

  // 5. Dhana Yoga
  DHANA_YOGA: {
    name: 'Dhana Yoga',
    chapter: 37,
    type: 'Lunar',
    formation_rule: 'Benefics in 2nd and 11th houses',
    effects: 'Very wealthy, financial abundance, good fortune, inheritance, generosity',
    severity: 'High',
    detection(chart) {
      try {
        const house2Planets = chart.houses[2] || [];
        const house11Planets = chart.houses[11] || [];

        // Simplified: Check if benefics occupy both 2nd and 11th houses
        const beneficIn2nd = house2Planets.some(p => BENEFICS.has(p));
        const beneficIn11th = house11Planets.some(p => BENEFICS.has(p));

        return beneficIn2nd && beneficIn11th;
      } catch (e) {
        return false;
      }
    },
  },

  // 6. Adhi Yoga
  ADHI_YOGA: {
    name: 'Adhi Yoga',
    chapter: 37,
    type: 'Lunar',
    formation_rule: 'Benefics in 6th, 7th, 8th from Moon',
    effects: 'Fortunate, popular, good health, success in overcoming obstacles, good marriage',
    severity: 'High',
    detection(chart) {
      try {
        const moonHouse = findPlanetHouse(chart, 'Moon');
        if (moonHouse === null) return false;

        // 6th, 7th, 8th from Moon
        const house6 = ((moonHouse + 5) % 12) || 12;
        const house7 = ((moonHouse + 6) % 12) || 12;
        const house8 = ((moonHouse + 7) % 12) || 12;

        const beneficIn6 = (chart.houses[house6] || []).some(p => BENEFICS.has(p));
        const beneficIn7 = (chart.houses[house7] || []).some(p => BENEFICS.has(p));
        const beneficIn8 = (chart.houses[house8] || []).some(p => BENEFICS.has(p));

        // At least one benefic in these houses (simplified; source says all three for max effect)
        return beneficIn6 || beneficIn7 || beneficIn8;
      } catch (e) {
        return false;
      }
    },
  },

  // ============ SOLAR YOGAS (BPHS Ch.38) ============

  // 7. Vesi Yoga
  VESI_YOGA: {
    name: 'Vesi Yoga',
    chapter: 38,
    type: 'Solar',
    formation_rule: 'Benefic in 12th house from Sun',
    effects: 'Leader, renowned, authoritative, wealth, prosperity',
    severity: 'High',
    detection(chart) {
      try {
        const sunHouse = findPlanetHouse(chart, 'Sun');
        if (sunHouse === null) return false;

        // 12th from Sun
        const targetHouse = sunHouse === 1 ? 12 : sunHouse - 1;
        const planetsInTarget = chart.houses[targetHouse] || [];

        // Check if any benefic is in this house
        for (const planet of planetsInTarget) {
          if (BENEFICS.has(planet)) return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    },
  },

  // 8. Vosi Yoga
  VOSI_YOGA: {
    name: 'Vosi Yoga',
    chapter: 38,
    type: 'Solar',
    formation_rule: 'Benefic in 2nd house from Sun',
    effects: 'Fortunate, virtuous, respected, prosperous, good health, long life',
    severity: 'High',
    detection(chart) {
      try {
        const sunHouse = findPlanetHouse(chart, 'Sun');
        if (sunHouse === null) return false;

        // 2nd from Sun
        const targetHouse = sunHouse === 12 ? 1 : sunHouse + 1;
        const planetsInTarget = chart.houses[targetHouse] || [];

        // Check if any benefic is in this house
        for (const planet of planetsInTarget) {
          if (BENEFICS.has(planet)) return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    },
  },

  // 9. Ubhayachari Yoga
  UBHAYACHARI_YOGA: {
    name: 'Ubhayachari Yoga',
    chapter: 38,
    type: 'Solar',
    formation_rule: 'Benefics in both 2nd and 12th from Sun',
    effects: 'Most auspicious, royal status, great wealth, extraordinary intelligence, long life',
    severity: 'Very High',
    detection(chart) {
      try {
        const sunHouse = findPlanetHouse(chart, 'Sun');
        if (sunHouse === null) return false;

        const house2 = sunHouse === 12 ? 1 : sunHouse + 1;
        const house12 = sunHouse === 1 ? 12 : sunHouse - 1;

        const beneficIn2 = (chart.houses[house2] || []).some(p => BENEFICS.has(p));
        const beneficIn12 = (chart.houses[house12] || []).some(p => BENEFICS.has(p));

        return beneficIn2 && beneficIn12;
      } catch (e) {
        return false;
      }
    },
  },

  // ============ PANCHA MAHA PURUSHA YOGAS (BPHS Ch.31-32) ============

  // 10. Ruchaka Yoga (Mars)
  RUCHAKA_YOGA: {
    name: 'Ruchaka Yoga',
    chapter: 31,
    type: 'Pancha Maha Purusha',
    planet: 'Mars',
    formation_rule: 'Mars exalted/own sign in angular house (1, 4, 7, 10)',
    effects: 'Valiant, courageous, strong, leadership, victory, military capability',
    severity: 'High',
    detection(chart) {
      try {
        const marsHouse = findPlanetHouse(chart, 'Mars');
        if (!marsHouse || ![1, 4, 7, 10].includes(marsHouse)) return false;

        const marsPos = chart.planetPositions?.Mars;
        return isExaltedOrOwn('Mars', marsPos);
      } catch (e) {
        return false;
      }
    },
  },

  // 11. Bhadra Yoga (Mercury)
  BHADRA_YOGA: {
    name: 'Bhadra Yoga',
    chapter: 31,
    type: 'Pancha Maha Purusha',
    planet: 'Mercury',
    formation_rule: 'Mercury exalted/own sign in angular house (1, 4, 7, 10)',
    effects: 'Intelligent, articulate, educated, business acumen, success in commerce',
    severity: 'High',
    detection(chart) {
      try {
        const mercuryHouse = findPlanetHouse(chart, 'Mercury');
        if (!mercuryHouse || ![1, 4, 7, 10].includes(mercuryHouse)) return false;

        const mercuryPos = chart.planetPositions?.Mercury;
        return isExaltedOrOwn('Mercury', mercuryPos);
      } catch (e) {
        return false;
      }
    },
  },

  // 12. Hamsa Yoga (Jupiter)
  HAMSA_YOGA: {
    name: 'Hamsa Yoga',
    chapter: 31,
    type: 'Pancha Maha Purusha',
    planet: 'Jupiter',
    formation_rule: 'Jupiter exalted/own sign in angular house (1, 4, 7, 10)',
    effects: 'Wise, virtuous, spiritual, prosperous, respected, graceful, good health',
    severity: 'High',
    detection(chart) {
      try {
        const jupiterHouse = findPlanetHouse(chart, 'Jupiter');
        if (!jupiterHouse || ![1, 4, 7, 10].includes(jupiterHouse)) return false;

        const jupiterPos = chart.planetPositions?.Jupiter;
        return isExaltedOrOwn('Jupiter', jupiterPos);
      } catch (e) {
        return false;
      }
    },
  },

  // 13. Malavya Yoga (Venus)
  MALAVYA_YOGA: {
    name: 'Malavya Yoga',
    chapter: 31,
    type: 'Pancha Maha Purusha',
    planet: 'Venus',
    formation_rule: 'Venus exalted/own sign in angular house (1, 4, 7, 10)',
    effects: 'Beautiful, charming, attractive, successful in arts, excellent marriage, wealthy',
    severity: 'High',
    detection(chart) {
      try {
        const venusHouse = findPlanetHouse(chart, 'Venus');
        if (!venusHouse || ![1, 4, 7, 10].includes(venusHouse)) return false;

        const venusPos = chart.planetPositions?.Venus;
        return isExaltedOrOwn('Venus', venusPos);
      } catch (e) {
        return false;
      }
    },
  },

  // 14. Sasa Yoga (Saturn)
  SASA_YOGA: {
    name: 'Sasa Yoga',
    chapter: 31,
    type: 'Pancha Maha Purusha',
    planet: 'Saturn',
    formation_rule: 'Saturn exalted/own sign in angular house (1, 4, 7, 10)',
    effects: 'Disciplined, responsible, hardworking, longevity, leadership, authority, perseverance',
    severity: 'High',
    detection(chart) {
      try {
        const saturnHouse = findPlanetHouse(chart, 'Saturn');
        if (!saturnHouse || ![1, 4, 7, 10].includes(saturnHouse)) return false;

        const saturnPos = chart.planetPositions?.Saturn;
        return isExaltedOrOwn('Saturn', saturnPos);
      } catch (e) {
        return false;
      }
    },
  },
};

// Helper: Enrich detected yoga with Mercury enhancement metadata
function enrichYogaMetadata(yogaKey, chart, baseYoga) {
  const enriched = { ...baseYoga };

  try {
    switch (yogaKey) {
      case 'SUNAPHA_YOGA': {
        const moonHouse = findPlanetHouse(chart, 'Moon');
        const targetHouse = moonHouse === 12 ? 1 : moonHouse + 1;
        const planetsInTarget = chart.houses[targetHouse] || [];

        for (const planet of planetsInTarget) {
          if (BENEFICS.has(planet)) {
            enriched.flanking_planet = planet;
            if (planet === 'Mercury') {
              enriched.sunaphaStrength = 3;
              enriched.effects = 'Eloquence, learning, wealth, fame in speech and communication. Enhanced by Mercury: excellent intellect, business acumen, writing skill';
            } else if (planet === 'Jupiter') {
              enriched.sunaphaStrength = 2;
              enriched.effects = 'Eloquence, learning, wealth, fame in speech and communication. With Jupiter: expanded wisdom, spiritual communication';
            } else {
              enriched.sunaphaStrength = 1;
            }
            break;
          }
        }
        break;
      }

      case 'ANAPHA_YOGA': {
        const moonHouse = findPlanetHouse(chart, 'Moon');
        const targetHouse = moonHouse === 1 ? 12 : moonHouse - 1;
        const planetsInTarget = chart.houses[targetHouse] || [];

        for (const planet of planetsInTarget) {
          if (BENEFICS.has(planet)) {
            enriched.flanking_planet = planet;
            if (planet === 'Mercury') {
              enriched.anaphaStrength = 2;
              enriched.effects = 'Fortunate, famous, wealthy, graceful, successful in all undertakings. Mercury in 12th: emotional intellect, persuasive communication, diplomacy';
            } else if (planet === 'Jupiter') {
              enriched.anaphaStrength = 2;
              enriched.effects = 'Fortunate, famous, wealthy, graceful, successful in all undertakings. With Jupiter: spiritual grace, wisdom, charitable nature';
            } else {
              enriched.anaphaStrength = 1;
            }
            break;
          }
        }
        break;
      }

      case 'VESI_YOGA': {
        const sunHouse = findPlanetHouse(chart, 'Sun');
        const targetHouse = sunHouse === 1 ? 12 : sunHouse - 1;
        const planetsInTarget = chart.houses[targetHouse] || [];

        const beneficsInHouse = [];
        for (const planet of planetsInTarget) {
          if (BENEFICS.has(planet)) beneficsInHouse.push(planet);
        }

        enriched.benefics_present = beneficsInHouse;
        enriched.vesiStrength = beneficsInHouse.length === 1 ? 1 : beneficsInHouse.length === 2 ? 2 : 3;

        if (enriched.vesiStrength === 3) {
          enriched.effects = 'Leader, renowned, authoritative, wealth, prosperity. With 3+ benefics: exceptional authority, multiple income streams, widespread recognition';
        } else if (enriched.vesiStrength === 2) {
          enriched.effects = 'Leader, renowned, authoritative, wealth, prosperity. With multiple benefics: enhanced authority and prosperity';
        }
        break;
      }

      case 'VOSI_YOGA': {
        const sunHouse = findPlanetHouse(chart, 'Sun');
        const targetHouse = sunHouse === 12 ? 1 : sunHouse + 1;
        const planetsInTarget = chart.houses[targetHouse] || [];

        const beneficsInHouse = [];
        for (const planet of planetsInTarget) {
          if (BENEFICS.has(planet)) beneficsInHouse.push(planet);
        }

        enriched.benefics_present = beneficsInHouse;
        const hasMercury = beneficsInHouse.includes('Mercury');
        const hasJupiter = beneficsInHouse.includes('Jupiter');

        if (beneficsInHouse.length === 1) {
          enriched.vosiStrength = hasMercury ? 2 : 1;
        } else if (beneficsInHouse.length === 2) {
          enriched.vosiStrength = hasMercury && hasJupiter ? 3 : 2;
        } else {
          enriched.vosiStrength = 3;
        }

        if (hasMercury) {
          enriched.effects = 'Fortunate, virtuous, respected, prosperous, good health, long life. With Mercury: analytical mind, business acumen, detailed planning ability';
        } else if (hasJupiter) {
          enriched.effects = 'Fortunate, virtuous, respected, prosperous, good health, long life. With Jupiter: moral authority, expanded prosperity, spiritual wellness';
        } else if (beneficsInHouse.length >= 2) {
          enriched.effects = 'Fortunate, virtuous, respected, prosperous, good health, long life. Multiple benefics enhance all benefits';
        }
        break;
      }

      case 'ADHI_YOGA': {
        const moonHouse = findPlanetHouse(chart, 'Moon');
        if (moonHouse === null) break;

        // 6th, 7th, 8th from Moon
        const house6 = ((moonHouse + 5) % 12) || 12;
        const house7 = ((moonHouse + 6) % 12) || 12;
        const house8 = ((moonHouse + 7) % 12) || 12;

        // Find benefics and their houses
        const beneficsInAdhi = [];
        const beneficsInAngles = [];
        const beneficsInTrines = [];

        for (const planet of chart.houses[house6] || []) {
          if (BENEFICS.has(planet)) {
            beneficsInAdhi.push(planet);
            beneficsInAngles.push(planet); // 6th from Moon: consider angular context
          }
        }
        for (const planet of chart.houses[house7] || []) {
          if (BENEFICS.has(planet)) {
            beneficsInAdhi.push(planet);
            beneficsInAngles.push(planet); // 7th from Moon: angular
          }
        }
        for (const planet of chart.houses[house8] || []) {
          if (BENEFICS.has(planet)) {
            beneficsInAdhi.push(planet);
            beneficsInTrines.push(planet); // 8th from Moon: more trinal
          }
        }

        // Calculate intensity based on how many benefics in angles vs trines
        let intensity = 1;
        if (beneficsInAdhi.length === 0) {
          // No benefics, shouldn't happen if detected, but handle gracefully
          intensity = 0;
        } else if (beneficsInAdhi.length === 1) {
          intensity = 1;
        } else if (beneficsInAdhi.length === 2) {
          intensity = 2;
        } else if (beneficsInAdhi.length >= 3) {
          intensity = 3;
        }

        enriched.adhiIntensity = intensity;
        enriched.benefics_in_adhi = beneficsInAdhi;

        // Update effects based on intensity
        if (intensity === 3) {
          enriched.effects = 'Fortunate, popular, good health, success in overcoming obstacles, good marriage. Exceptional: excellent health, long life, overcoming chronic disease, rapid recovery';
        } else if (intensity === 2) {
          enriched.effects = 'Fortunate, popular, good health, success in overcoming obstacles, good marriage. Moderate: improved health after treatment, good recovery';
        } else if (intensity === 1) {
          enriched.effects = 'Fortunate, popular, good health, success in overcoming obstacles, good marriage. Weak: slow health improvement, careful living needed';
        }
        break;
      }

      case 'KEMADRUMA_YOGA': {
        const moonHouse = findPlanetHouse(chart, 'Moon');
        const jupiterHouse = findPlanetHouse(chart, 'Jupiter');

        enriched.jupiter_position = jupiterHouse;
        enriched.mitigating_factors = [];

        // Check for any mitigating benefics (in trines 5, 9)
        if ([5, 9].includes(jupiterHouse)) {
          enriched.mitigating_factors.push('jupiter_in_trine');
        }

        // Check if any benefic in trines from Moon
        const moonHouse_safe = moonHouse || 1;
        const moonTrine1 = ((moonHouse_safe + 4) % 12) || 12;
        const moonTrine2 = ((moonHouse_safe + 8) % 12) || 12;

        const beneficInTrine1 = (chart.houses[moonTrine1] || []).some(p => BENEFICS.has(p) && p !== 'Jupiter');
        const beneficInTrine2 = (chart.houses[moonTrine2] || []).some(p => BENEFICS.has(p) && p !== 'Jupiter');

        if (beneficInTrine1 || beneficInTrine2) {
          enriched.mitigating_factors.push('benefic_in_trine_from_moon');
        }

        // Intensity based on mitigation
        if (enriched.mitigating_factors.length === 0) {
          enriched.kemadruma_intensity = 'Strong';
          enriched.effects = 'Inauspicious, loss of wealth, unstable mind, obstacles in all endeavors. No mitigation: severe obstacles, mental disturbance, financial struggles';
        } else {
          enriched.kemadruma_intensity = 'Weak';
          enriched.effects = 'Inauspicious, loss of wealth, unstable mind, obstacles in all endeavors. Partially mitigated: challenges surmountable with effort, support available';
        }
        break;
      }

      case 'RUCHAKA_YOGA': {
        const marsHouse = findPlanetHouse(chart, 'Mars');
        const marsPos = chart.planetPositions?.Mars;
        const marsSign = Math.floor(marsPos / 30);

        const isAngular = [1, 4, 7, 10].includes(marsHouse);
        const isTrinal = [5, 9].includes(marsHouse);
        const isExalted = marsSign === 10; // Capricorn
        const isOwnSign = marsSign === 0 || marsSign === 7; // Aries or Scorpio

        let strength = 1;
        if (isAngular && isExalted) {
          strength = 4;
          enriched.effects = 'Valiant, courageous, strong, leadership, victory, military capability. Exceptional: warrior spirit, supreme authority, physical prowess, triumph over enemies';
        } else if (isAngular && isOwnSign) {
          strength = 3;
          enriched.effects = 'Valiant, courageous, strong, leadership, victory, military capability. Strong: commanding presence, military success, physical strength';
        } else if (isTrinal && isExalted) {
          strength = 2;
          enriched.effects = 'Valiant, courageous, strong, leadership, victory, military capability. Moderate: steady courage, gradual success, athletic ability';
        } else if (isTrinal && isOwnSign) {
          strength = 1;
          enriched.effects = 'Valiant, courageous, strong, leadership, victory, military capability. Weak: basic courage, local influence, sports interest';
        }

        enriched.ruchakaStrength = strength;
        enriched.mars_house = isAngular ? 'angular' : isTrinal ? 'trinal' : 'other';
        enriched.mars_sign_status = isExalted ? 'exalted' : isOwnSign ? 'own sign' : 'other';
        break;
      }

      case 'BHADRA_YOGA': {
        const mercuryHouse = findPlanetHouse(chart, 'Mercury');
        const mercuryPos = chart.planetPositions?.Mercury;
        const mercurySign = Math.floor(mercuryPos / 30);
        const jupiterHouse = findPlanetHouse(chart, 'Jupiter');

        const isAngular = [1, 4, 7, 10].includes(mercuryHouse);
        const isTrinal = [5, 9].includes(mercuryHouse);
        const isOwnSign = mercurySign === 2 || mercurySign === 5; // Gemini or Virgo
        const jupiterAspects = jupiterHouse && Math.abs(jupiterHouse - mercuryHouse) <= 2;

        let strength = 1;
        if (isAngular && isOwnSign && jupiterAspects) {
          strength = 4;
          enriched.effects = 'Handsome, eloquent, famous, intelligent, wealthy, virtuous. Exceptional: diplomatic genius, commercial mastery, literary excellence';
        } else if (isAngular && isOwnSign) {
          strength = 3;
          enriched.effects = 'Handsome, eloquent, famous, intelligent, wealthy, virtuous. Strong: business acumen, verbal fluency, intellectual success';
        } else if (isTrinal && isOwnSign) {
          strength = 2;
          enriched.effects = 'Handsome, eloquent, famous, intelligent, wealthy, virtuous. Moderate: technical skill, writing ability, calculation mastery';
        } else if (isTrinal && isOwnSign) {
          strength = 1;
          enriched.effects = 'Handsome, eloquent, famous, intelligent, wealthy, virtuous. Weak: basic learning, small business, local communication';
        }

        enriched.bhadraStrength = strength;
        enriched.mercury_house = isAngular ? 'angular' : isTrinal ? 'trinal' : 'other';
        enriched.mercury_sign_status = isOwnSign ? 'own sign' : 'other';
        enriched.jupiter_aspect = jupiterAspects;
        break;
      }

      case 'HAMSA_YOGA': {
        const jupiterHouse = findPlanetHouse(chart, 'Jupiter');
        const jupiterPos = chart.planetPositions?.Jupiter;
        const jupiterSign = Math.floor(jupiterPos / 30);

        const isAngular = [1, 4, 7, 10].includes(jupiterHouse);
        const isTrinal = [5, 9].includes(jupiterHouse);
        const isExalted = jupiterSign === 3; // Cancer
        const isOwnSign = jupiterSign === 8 || jupiterSign === 11; // Sagittarius or Pisces

        let strength = 1;
        if (isAngular && isExalted) {
          strength = 4;
          enriched.effects = 'Fortunate, pious, virtuous, wise, wealthy, long-lived, powerful. Exceptional: saint-like wisdom, universal benevolence, supreme prosperity';
        } else if (isAngular && isOwnSign) {
          strength = 3;
          enriched.effects = 'Fortunate, pious, virtuous, wise, wealthy, long-lived, powerful. Strong: spiritual authority, widespread prosperity, moral leadership';
        } else if (isTrinal && isExalted) {
          strength = 2;
          enriched.effects = 'Fortunate, pious, virtuous, wise, wealthy, long-lived, powerful. Moderate: spiritual learning, steady prosperity, benevolent nature';
        } else if (isTrinal && isOwnSign) {
          strength = 1;
          enriched.effects = 'Fortunate, pious, virtuous, wise, wealthy, long-lived, powerful. Weak: basic learning, local charity, modest prosperity';
        }

        enriched.hamsaStrength = strength;
        enriched.jupiter_house = isAngular ? 'angular' : isTrinal ? 'trinal' : 'other';
        enriched.jupiter_sign_status = isExalted ? 'exalted' : isOwnSign ? 'own sign' : 'other';
        break;
      }

      case 'MALAVYA_YOGA': {
        const venusHouse = findPlanetHouse(chart, 'Venus');
        const venusPos = chart.planetPositions?.Venus;
        const venusSign = Math.floor(venusPos / 30);

        const isAngular = [1, 4, 7, 10].includes(venusHouse);
        const isTrinal = [5, 9].includes(venusHouse);
        const isExalted = venusSign === 11; // Pisces
        const isOwnSign = venusSign === 1 || venusSign === 6; // Taurus or Libra

        let strength = 1;
        if (isAngular && isExalted) {
          strength = 4;
          enriched.effects = 'Fortunate, attractive, wealthy, famous, devoted to spouse, enjoys sensual pleasures. Exceptional: unparalleled beauty, artistic genius, supreme luxury';
        } else if (isAngular && isOwnSign) {
          strength = 3;
          enriched.effects = 'Fortunate, attractive, wealthy, famous, devoted to spouse, enjoys sensual pleasures. Strong: artistic talent, harmonious relationships, refined tastes';
        } else if (isTrinal && isExalted) {
          strength = 2;
          enriched.effects = 'Fortunate, attractive, wealthy, famous, devoted to spouse, enjoys sensual pleasures. Moderate: artistic appreciation, loving nature, comfort-seeking';
        } else if (isTrinal && isOwnSign) {
          strength = 1;
          enriched.effects = 'Fortunate, attractive, wealthy, famous, devoted to spouse, enjoys sensual pleasures. Weak: basic aesthetic sense, simple pleasures, loyal nature';
        }

        enriched.malavyaStrength = strength;
        enriched.venus_house = isAngular ? 'angular' : isTrinal ? 'trinal' : 'other';
        enriched.venus_sign_status = isExalted ? 'exalted' : isOwnSign ? 'own sign' : 'other';
        break;
      }

      case 'SASA_YOGA': {
        const saturnHouse = findPlanetHouse(chart, 'Saturn');
        const saturnPos = chart.planetPositions?.Saturn;
        const saturnSign = Math.floor(saturnPos / 30);

        const isAngular = [1, 4, 7, 10].includes(saturnHouse);
        const isTrinal = [5, 9].includes(saturnHouse);
        const isExalted = saturnSign === 6; // Libra
        const isOwnSign = saturnSign === 9 || saturnSign === 10; // Capricorn or Aquarius

        let strength = 1;
        if (isAngular && isExalted) {
          strength = 4;
          enriched.effects = 'Disciplined, responsible, hardworking, longevity, leadership, authority, perseverance. Exceptional: iron will, judicial authority, lifetime achievement';
        } else if (isAngular && isOwnSign) {
          strength = 3;
          enriched.effects = 'Disciplined, responsible, hardworking, longevity, leadership, authority, perseverance. Strong: career mastery, systematic thinking, long-term success';
        } else if (isTrinal && isExalted) {
          strength = 2;
          enriched.effects = 'Disciplined, responsible, hardworking, longevity, leadership, authority, perseverance. Moderate: steady progress, fair judgment, patient accumulation';
        } else if (isTrinal && isOwnSign) {
          strength = 1;
          enriched.effects = 'Disciplined, responsible, hardworking, longevity, leadership, authority, perseverance. Weak: basic diligence, slow progress, practical skills';
        }

        enriched.sasaStrength = strength;
        enriched.saturn_house = isAngular ? 'angular' : isTrinal ? 'trinal' : 'other';
        enriched.saturn_sign_status = isExalted ? 'exalted' : isOwnSign ? 'own sign' : 'other';
        break;
      }
    }
  } catch (e) {
    // Silently skip enrichment errors
  }

  return enriched;
}

function calculateLunarSolarYogas(chart) {
  const matchedYogas = [];

  try {
    if (!chart || !chart.houses || !chart.planetPositions) {
      return attachSource({
        yogas: [],
        totalMatched: 0,
      }, BPHS_LUNAR_SOLAR_SOURCE);
    }

    for (const yogaKey in LUNAR_SOLAR_YOGAS_CATALOG) {
      const yoga = LUNAR_SOLAR_YOGAS_CATALOG[yogaKey];
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

            // Enrich with metadata (Mercury tracking, strength scales)
            const enrichedYoga = enrichYogaMetadata(yogaKey, chart, baseYoga);
            matchedYogas.push(enrichedYoga);
          }
        } catch (error) {
          console.warn(`Error detecting ${yogaKey}:`, error.message);
        }
      }
    }
  } catch (error) {
    console.error('Error in calculateLunarSolarYogas:', error);
  }

  return attachSource({
    yogas: matchedYogas,
    totalMatched: matchedYogas.length,
  }, BPHS_LUNAR_SOLAR_SOURCE);
}

module.exports = {
  calculateLunarSolarYogas,
  LUNAR_SOLAR_YOGAS_CATALOG,
  BPHS_LUNAR_SOLAR_SOURCE,
};
