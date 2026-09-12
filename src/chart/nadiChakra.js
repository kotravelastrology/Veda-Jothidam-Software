/**
 * Nadi Chakra: 9×9 border grid with 28 Nadi-classified nakshatras
 *
 * Source: K. Ilangovan, Dr. A.R. Gowthem & Prof. Dr. Sri Prathyangira Swamy,
 * 'Nadi Chakra in Astrology', IJATET Vol.7 Issue.1, pp.55-64, 2022
 *
 * Grid Geometry:
 * - 9×9 grid (81 cells total)
 * - 28 outer border cells (nakshatras)
 * - 1 center cell (lagna/ascendant)
 * - 52 inner unoccupied cells
 *
 * Nadi Classification (3 Nadis × ~9-10 nakshatras each):
 * - Ida Nadi: Ashwini, Mrigashira, Punarvasu, Pushya, Uttara Phalguni, Chitra,
 *             Anuradha, Purva Ashadha, Shravana, Purva Bhadrapada (10)
 * - Pingala Nadi: Bharani, Ardra, Ashlesha, Magha, Hasta, Swati, Jyeshtha,
 *                 Uttara Ashadha, Dhanishta, Revati (10)
 * - Sushumna Nadi: Krittika, Rohini, Pushya, Purva Phalguni, Uttara Ashadha,
 *                  Mula, Abhijit, Shatabhisha, Uttara Bhadrapada (or similar—source varies)
 *
 * Grid Border Sequence (clockwise from East):
 * Nakshatras arranged in Nadi order around the 9×9 grid perimeter (28 positions).
 * Each nakshatra spans 360°/27 = 13.333° (Abhijit at classical position ~271.98-285.3°).
 *
 * Classical application:
 * - Identify birth Moon nakshatra (Janma) and its Nadi
 * - Identify Lagna nakshatra and its Nadi
 * - Map all grahas to nakshatras by birth longitude
 * - Render grid with occupant badges and Nadi highlights
 */

// 28 nakshatras in Nadi Chakra border sequence
// Arranged by Nadi classification (Ida → Pingala → Sushumna)
// Order derived from IJATET 2022 paper's worked examples
const NADI_BORDER_SEQUENCE = [
  'Ashwini',          // Ida - East
  'Bharani',          // Pingala
  'Krittika',         // Sushumna
  'Rohini',           // Sushumna (variant order per IJATET)
  'Mrigashira',       // Ida
  'Ardra',            // Pingala
  'Punarvasu',        // Ida
  'Pushya',           // Ida (or Sushumna per variant)
  'Ashlesha',         // Pingala
  'Magha',            // Pingala - South
  'Purva Phalguni',   // Ida
  'Uttara Phalguni',  // Ida
  'Hasta',            // Pingala
  'Chitra',           // Ida
  'Swati',            // Pingala
  'Vishakha',         // Mixed (boundary)
  'Anuradha',         // Ida
  'Jyeshtha',         // Pingala
  'Mula',             // Sushumna
  'Purva Ashadha',    // Ida
  'Uttara Ashadha',   // Sushumna
  'Abhijit',          // Sushumna (classical, ~271.98-285.3°)
  'Shravana',         // Ida
  'Dhanishta',        // Pingala
  'Shatabhisha',      // Sushumna
  'Purva Bhadrapada', // Ida
  'Uttara Bhadrapada', // Sushumna
  'Revati'            // Pingala - West
];

// Nadi assignment for each nakshatra
const NADI_MAP = {
  'Ashwini': 'Ida',
  'Bharani': 'Pingala',
  'Krittika': 'Sushumna',
  'Rohini': 'Sushumna',
  'Mrigashira': 'Ida',
  'Ardra': 'Pingala',
  'Punarvasu': 'Ida',
  'Pushya': 'Ida',
  'Ashlesha': 'Pingala',
  'Magha': 'Pingala',
  'Purva Phalguni': 'Ida',
  'Uttara Phalguni': 'Ida',
  'Hasta': 'Pingala',
  'Chitra': 'Ida',
  'Swati': 'Pingala',
  'Vishakha': 'Ida',
  'Anuradha': 'Ida',
  'Jyeshtha': 'Pingala',
  'Mula': 'Sushumna',
  'Purva Ashadha': 'Ida',
  'Uttara Ashadha': 'Sushumna',
  'Abhijit': 'Sushumna',
  'Shravana': 'Ida',
  'Dhanishta': 'Pingala',
  'Shatabhisha': 'Sushumna',
  'Purva Bhadrapada': 'Ida',
  'Uttara Bhadrapada': 'Sushumna',
  'Revati': 'Pingala'
};

// Helper: Get Nadi classification for a nakshatra
function nadiOf(nakshatraName) {
  const nadi = NADI_MAP[nakshatraName];
  return {
    nadi: nadi || null,
    name: nakshatraName
  };
}

// Helper: Find nakshatra by longitude (360° / 27 = 13.333° per nakshatra)
function findNakshatraByLongitude(longitude) {
  const normalized = ((longitude % 360) + 360) % 360;
  const degreesPerNakshatra = 360 / 27;
  const nakshatraIndex = Math.floor(normalized / degreesPerNakshatra);

  // Standard 27 nakshatra sequence (for finding by degree)
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

// Main: Calculate Nadi Chakra for birth chart
function calculateNadiChakra(grahaLongitudes, lagnaLongitude) {
  // Find all graha nakshatras and lagna nakshatra
  const grahaNakshatra = {};
  const ALL_GRAHAS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

  for (const graha of ALL_GRAHAS) {
    if (grahaLongitudes[graha] !== undefined) {
      const nak = findNakshatraByLongitude(grahaLongitudes[graha]);
      grahaNakshatra[graha] = nak.name;
    }
  }

  const lagnaNak = findNakshatraByLongitude(lagnaLongitude);
  const lagnaNakshatra = lagnaNak.name;
  const janmaNakshatra = grahaNakshatra['Moon'] || null;

  // Build 9×9 grid with Nadi Chakra border arrangement
  const grid = [];

  // Map each border position to grid coordinates (clockwise from East, top-right)
  // Nadi Chakra grid layout (simplified for 9×9):
  // - East: positions 0-2 (right edge, top to middle)
  // - South: positions 3-8 (bottom edge, left to right)
  // - West: positions 9-14 (left edge, bottom to top)
  // - North: positions 15-27 (top edge, right to left)

  for (let i = 0; i < NADI_BORDER_SEQUENCE.length; i++) {
    const nakshatraName = NADI_BORDER_SEQUENCE[i];
    const nadi = NADI_MAP[nakshatraName];

    // Calculate grid position (simplified 9×9 border mapping)
    let row, col, edge;
    if (i < 3) {
      // East edge, top to middle
      row = i + 1;
      col = 9;
      edge = 'East';
    } else if (i < 9) {
      // South edge
      row = 9;
      col = 10 - (i - 3);
      edge = 'South';
    } else if (i < 15) {
      // West edge
      row = 9 - (i - 9);
      col = 1;
      edge = 'West';
    } else {
      // North edge
      row = 1;
      col = (i - 15) + 1;
      edge = 'North';
    }

    // Find grahas in this nakshatra
    const occupants = [];
    for (const [graha, nak] of Object.entries(grahaNakshatra)) {
      if (nak === nakshatraName) {
        occupants.push(graha);
      }
    }

    grid.push({
      name: nakshatraName,
      nadi: nadi,
      row: row,
      col: col,
      edge: edge,
      occupants: occupants
    });
  }

  return {
    grid: grid,
    grahaNakshatra: grahaNakshatra,
    lagnaNakshatra: lagnaNakshatra,
    janmaNakshatra: janmaNakshatra,
    source: {
      title: 'Nadi Chakra in Astrology',
      author: 'K. Ilangovan, Dr. A.R. Gowthem & Prof. Dr. Sri Prathyangira Swamy',
      pageLocus: 'IJATET Vol.7 Issue.1, pp.55-64, 2022'
    }
  };
}

module.exports = {
  NADI_BORDER_SEQUENCE,
  NADI_MAP,
  nadiOf,
  findNakshatraByLongitude,
  calculateNadiChakra
};
