// Transit Chakra - Current planetary transits with natal comparisons
// Real-time movement analysis and transit-to-natal aspects

const TRANSIT_ASPECTS = {
  conjunction: {
    angle: 0,
    orb: 8,
    influence: 'Peak influence - strong conjunction',
    strength: 100
  },
  opposition: {
    angle: 180,
    orb: 8,
    influence: 'Challenging opposition aspect',
    strength: 80
  },
  trine: {
    angle: 120,
    orb: 8,
    influence: 'Harmonious trine aspect',
    strength: 70
  },
  square: {
    angle: 90,
    orb: 8,
    influence: 'Tense square aspect',
    strength: 60
  },
  sextile: {
    angle: 60,
    orb: 6,
    influence: 'Mildly harmonious sextile',
    strength: 50
  }
};

const ALL_GRAHAS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

function normalizeDegrees(deg) {
  return ((deg % 360) + 360) % 360;
}

function calculateHouse(longitude) {
  // Simplified: 30° per house starting from 0°
  return Math.floor(longitude / 30) + 1;
}

function findAspects(transitLongitude, natalLongitude) {
  const diff = Math.abs(transitLongitude - natalLongitude);
  const normalizedDiff = Math.min(diff, 360 - diff);

  const aspects = [];

  for (const [name, aspectData] of Object.entries(TRANSIT_ASPECTS)) {
    const angleDiff = Math.abs(normalizedDiff - aspectData.angle);
    if (angleDiff <= aspectData.orb) {
      aspects.push({
        type: name,
        orb: angleDiff,
        influence: aspectData.influence,
        strength: aspectData.strength
      });
    }
  }

  return aspects;
}

function calculateTransitChakra(natalGrahas, transitGrahas) {
  const now = new Date();

  // Store natal positions
  const natalPositions = {};
  for (const [planet, data] of Object.entries(natalGrahas)) {
    natalPositions[planet] = {
      longitude: data.longitude,
      house: data.house
    };
  }

  // Calculate transit positions and houses
  const transitPositions = {};
  for (const [planet, data] of Object.entries(transitGrahas)) {
    const transitLong = data.longitude;
    const natalLong = natalGrahas[planet]?.longitude || 0;
    const movement = normalizeDegrees(transitLong - natalLong);
    const directMovement = movement > 180 ? movement - 360 : movement;

    transitPositions[planet] = {
      longitude: transitLong,
      house: calculateHouse(transitLong),
      natalLongitude: natalLong,
      movement: Math.abs(directMovement),
      direction: directMovement < 0 ? 'retrograde' : 'direct'
    };
  }

  // Generate transit list (movement relative to natal)
  const transits = [];
  for (const planet of ALL_GRAHAS) {
    if (transitGrahas[planet]) {
      transits.push({
        planet,
        natalLongitude: natalPositions[planet].longitude,
        transitLongitude: transitPositions[planet].longitude,
        movement: transitPositions[planet].movement,
        direction: transitPositions[planet].direction,
        natalHouse: natalPositions[planet].house,
        transitHouse: transitPositions[planet].house
      });
    }
  }

  // Calculate transit-to-natal aspects
  const aspects = [];
  for (const transitPlanet of ALL_GRAHAS) {
    if (!transitGrahas[transitPlanet]) continue;

    for (const natalPlanet of ALL_GRAHAS) {
      if (!natalGrahas[natalPlanet]) continue;
      if (transitPlanet === natalPlanet) continue; // Skip self-aspects

      const foundAspects = findAspects(
        transitGrahas[transitPlanet].longitude,
        natalGrahas[natalPlanet].longitude
      );

      for (const foundAspect of foundAspects) {
        aspects.push({
          transitPlanet,
          natalPlanet,
          aspectType: foundAspect.type,
          orb: foundAspect.orb,
          influence: foundAspect.influence,
          strength: foundAspect.strength
        });
      }
    }
  }

  // Transit houses (simplified: 12 houses)
  const transitHouses = [];
  for (let h = 1; h <= 12; h++) {
    const planetsInHouse = Object.entries(transitPositions)
      .filter(([_, data]) => data.house === h)
      .map(([planet, _]) => planet);

    transitHouses.push({
      number: h,
      planetsHere: planetsInHouse,
      strength: planetsInHouse.length * 20
    });
  }

  // Calculate Bhukti period (sub-period) - simplified
  // Real implementation would use dasha system
  const bhuktis = [
    {
      lord: 'Sun',
      startDate: new Date(now.getFullYear(), now.getMonth(), 1),
      endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0),
      daysRemaining: Math.ceil((new Date(now.getFullYear(), now.getMonth() + 1, 0) - now) / (1000 * 60 * 60 * 24))
    }
  ];

  return {
    natalPositions,
    transitPositions,
    transitHouses,
    transits,
    aspects,
    bhuktis,
    generatedAt: now.toISOString(),
    source: {
      title: 'Brihat Parashara Hora Shastra',
      author: 'Sage Parashara',
      chapter: 'Gochara (Transit) Analysis'
    }
  };
}

module.exports = {
  TRANSIT_ASPECTS,
  calculateTransitChakra
};
