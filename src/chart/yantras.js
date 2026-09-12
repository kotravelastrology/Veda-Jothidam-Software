/**
 * Yantra Chakra: 9-zone sacred geometric grid with planetary zone placements
 *
 * Source: K. Ilangovan, Dr. A.R. Gowthem & Prof. Dr. Sri Prathyangira Swamy,
 * 'Yantra Chakra in Astrology', IJATET Vol.7 Issue.1, pp.85-94, 2022
 *
 * Yantra Geometry:
 * - 9 zones (center + 8 directions)
 * - Center: Brahma (most powerful, 100% strength)
 * - Cardinals (E/S/W/N): Indra/Yama/Varuna/Soma (85% strength)
 * - Ordinals (NE/SE/SW/NW): Rudra/Agni/Pitri/Vayu (70% strength)
 *
 * Planetary Placement (by nakshatra/rashi):
 * - Grahas are assigned to zones based on their longitude
 * - Nakshatra determines primary zone
 * - Rashi fine-tunes within-zone position
 * - Zone strength modifies planetary power assessment
 *
 * Classical application:
 * - Center (Brahma) is most auspicious for any planet
 * - Cardinal zones are good for benefics, challenging for malefics
 * - Ordinal zones indicate mixed results
 * - Analyze zone strength for timing predictions
 */

// 9-zone Yantra structure: Center + 8 directions
const YANTRA_ZONES = [
  { name: 'Brahma', direction: 'Center', index: 0 },
  { name: 'Indra', direction: 'East', index: 1 },
  { name: 'Agni', direction: 'SE', index: 2 },
  { name: 'Yama', direction: 'South', index: 3 },
  { name: 'Pitri', direction: 'SW', index: 4 },
  { name: 'Varuna', direction: 'West', index: 5 },
  { name: 'Vayu', direction: 'NW', index: 6 },
  { name: 'Soma', direction: 'North', index: 7 },
  { name: 'Rudra', direction: 'NE', index: 8 }
];

// Zone properties: type, element, strength modifier (0-100)
const YANTRA_ZONE_MAP = {
  'Brahma': { zoneType: 'Center', element: 'Akasha', strength: 100, lord: 'Brahma' },
  'Indra': { zoneType: 'Cardinal', element: 'Air', strength: 85, lord: 'Indra' },
  'Agni': { zoneType: 'Ordinal', element: 'Fire', strength: 70, lord: 'Agni' },
  'Yama': { zoneType: 'Cardinal', element: 'Earth', strength: 85, lord: 'Yama' },
  'Pitri': { zoneType: 'Ordinal', element: 'Water', strength: 70, lord: 'Pitri' },
  'Varuna': { zoneType: 'Cardinal', element: 'Water', strength: 85, lord: 'Varuna' },
  'Vayu': { zoneType: 'Ordinal', element: 'Air', strength: 70, lord: 'Vayu' },
  'Soma': { zoneType: 'Cardinal', element: 'Water', strength: 85, lord: 'Soma' },
  'Rudra': { zoneType: 'Ordinal', element: 'Fire', strength: 70, lord: 'Rudra' }
};

// Nakshatra to primary Yantra zone mapping
// (simplified: based on nakshatra index mod 9)
const NAKSHATRA_ZONES = [
  'Brahma', 'Indra', 'Agni', 'Yama', 'Pitri', 'Varuna', 'Vayu', 'Soma', 'Rudra',
  'Brahma', 'Indra', 'Agni', 'Yama', 'Pitri', 'Varuna', 'Vayu', 'Soma', 'Rudra',
  'Brahma', 'Indra', 'Agni', 'Yama', 'Pitri', 'Varuna', 'Vayu', 'Soma', 'Rudra'
];

// Helper: Get Yantra zone properties
function yantrazoneOf(zoneName) {
  const zone = YANTRA_ZONE_MAP[zoneName];
  return zone ? { ...zone, name: zoneName } : { name: zoneName, zoneType: null, strength: 0 };
}

// Helper: Find yantra zone by nakshatra index
function findZoneByNakshatra(nakshatraIndex) {
  const zoneName = NAKSHATRA_ZONES[nakshatraIndex % 27];
  return {
    name: zoneName,
    index: nakshatraIndex % 27,
    ...yantrazoneOf(zoneName)
  };
}

// Helper: Find nakshatra by longitude (360° / 27 = 13.333° per nakshatra)
function findNakshatraByLongitude(longitude) {
  const normalized = ((longitude % 360) + 360) % 360;
  const degreesPerNakshatra = 360 / 27;
  const nakshatraIndex = Math.floor(normalized / degreesPerNakshatra);

  const standardSequence = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu',
    'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta',
    'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha',
    'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada',
    'Uttara Bhadrapada', 'Revati'
  ];

  return {
    name: standardSequence[nakshatraIndex],
    index: nakshatraIndex,
    longitude: normalized,
    degree: normalized % degreesPerNakshatra
  };
}

// Main: Calculate Yantra Chakra for birth chart
function calculateYantraChakra(grahaLongitudes, lagnaLongitude) {
  // Build zones
  const zones = YANTRA_ZONES.map(z => ({
    name: z.name,
    direction: z.direction,
    ...yantrazoneOf(z.name),
    occupants: []
  }));

  // Place grahas in zones
  const grahaPlacements = {};
  const zoneStrengths = {};
  const ALL_GRAHAS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

  for (const graha of ALL_GRAHAS) {
    if (grahaLongitudes[graha] !== undefined) {
      const nak = findNakshatraByLongitude(grahaLongitudes[graha]);
      const zone = findZoneByNakshatra(nak.index);

      if (!grahaPlacements[zone.name]) {
        grahaPlacements[zone.name] = [];
      }
      grahaPlacements[zone.name].push(graha);

      // Find corresponding zone in zones array and add graha
      const zoneInArray = zones.find(z => z.name === zone.name);
      if (zoneInArray) {
        zoneInArray.occupants.push(graha);
      }
    }
  }

  // Calculate zone strengths (sum of occupant benefic/malefic powers, modified by zone)
  const BENEFIC = ['Jupiter', 'Venus', 'Mercury', 'Moon'];
  const MALEFIC = ['Sun', 'Mars', 'Saturn', 'Rahu', 'Ketu'];

  for (const zone of zones) {
    let strength = zone.strength;
    let beneficCount = 0;
    let maleficCount = 0;

    for (const graha of zone.occupants) {
      if (BENEFIC.includes(graha)) beneficCount++;
      if (MALEFIC.includes(graha)) maleficCount++;
    }

    // Benefics strengthen the zone, malefics weaken it
    strength += beneficCount * 5 - maleficCount * 3;
    strength = Math.max(0, Math.min(100, strength)); // Clamp to 0-100

    zoneStrengths[zone.name] = strength;
  }

  return {
    zones: zones,
    grahaPlacements: grahaPlacements,
    zoneStrengths: zoneStrengths,
    source: {
      title: 'Yantra Chakra in Astrology',
      author: 'K. Ilangovan, Dr. A.R. Gowthem & Prof. Dr. Sri Prathyangira Swamy',
      pageLocus: 'IJATET Vol.7 Issue.1, pp.85-94, 2022'
    }
  };
}

module.exports = {
  YANTRA_ZONES,
  YANTRA_ZONE_MAP,
  yantrazoneOf,
  findZoneByNakshatra,
  findNakshatraByLongitude,
  calculateYantraChakra
};
