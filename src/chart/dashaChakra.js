/**
 * Dasha Chakra: 9×9 grid with current Mahadasha lord at center, 28 nakshatras on border
 *
 * Source: K. Ilangovan, Dr. A.R. Gowthem & Prof. Dr. Sri Prathyangira Swamy,
 * 'Dasha Chakra in Astrology', IJATET Vol.7 Issue.1, pp.65-74, 2022
 *
 * Grid Geometry:
 * - 9×9 grid (81 cells total)
 * - 1 center cell (current Mahadasha lord)
 * - 28 outer border cells (nakshatras in Vimshottari sequence)
 * - 52 inner unoccupied cells
 *
 * Vimshottari Dasha Sequence (120-year cycle):
 * Ketu (7yr) → Venus (20yr) → Sun (6yr) → Moon (10yr) → Mars (7yr) →
 * Rahu (18yr) → Jupiter (16yr) → Saturn (19yr) → Mercury (17yr)
 *
 * Border Nakshatras (by Dasha lord, repeating 3 times for 28 positions):
 * - Ketu: Ashwini, Magha, Mula
 * - Venus: Bharani, Purva Phalguni, Purva Ashadha
 * - Sun: Krittika, Uttara Phalguni, Uttara Ashadha
 * - Moon: Rohini, Hasta, Shravana
 * - Mars: Mrigashira, Chitra, Dhanishta
 * - Rahu: Ardra, Swati, Shatabhisha
 * - Jupiter: Punarvasu, Vishakha, Purva Bhadrapada
 * - Saturn: Pushya, Anuradha, Uttara Bhadrapada
 * - Mercury: Ashlesha, Jyeshtha, Revati
 * - Abhijit: (placed at classical position, lord varies)
 *
 * Classical application:
 * - Identify current Mahadasha lord (from birth time + elapsed days)
 * - Place lord at center in prominent position
 * - Map all grahas to border by their nakshatras
 * - Analyze inter-Dasha (Bhukti) placements and afflictions
 */

// Vimshottari Dasha lords and their nakshatras (3 per lord = 27 + Abhijit = 28)
const VIMSHOTTARI_DASHAS = [
  { lord: 'Ketu', nakshatras: ['Ashwini', 'Magha', 'Mula'] },
  { lord: 'Venus', nakshatras: ['Bharani', 'Purva Phalguni', 'Purva Ashadha'] },
  { lord: 'Sun', nakshatras: ['Krittika', 'Uttara Phalguni', 'Uttara Ashadha'] },
  { lord: 'Moon', nakshatras: ['Rohini', 'Hasta', 'Shravana'] },
  { lord: 'Mars', nakshatras: ['Mrigashira', 'Chitra', 'Dhanishta'] },
  { lord: 'Rahu', nakshatras: ['Ardra', 'Swati', 'Shatabhisha'] },
  { lord: 'Jupiter', nakshatras: ['Punarvasu', 'Vishakha', 'Purva Bhadrapada'] },
  { lord: 'Saturn', nakshatras: ['Pushya', 'Anuradha', 'Uttara Bhadrapada'] },
  { lord: 'Mercury', nakshatras: ['Ashlesha', 'Jyeshtha', 'Revati'] },
];

// 28-position border sequence: Dasha nakshatras in order (Ketu 1-3, Venus 1-3, ... Mercury 1-3, Abhijit)
const DASHA_BORDER_SEQUENCE = [
  'Ashwini',          // Ketu 1
  'Bharani',          // Venus 1
  'Krittika',         // Sun 1
  'Rohini',           // Moon 1
  'Mrigashira',       // Mars 1
  'Ardra',            // Rahu 1
  'Punarvasu',        // Jupiter 1
  'Pushya',           // Saturn 1
  'Ashlesha',         // Mercury 1
  'Magha',            // Ketu 2
  'Purva Phalguni',   // Venus 2
  'Uttara Phalguni',  // Sun 2
  'Hasta',            // Moon 2
  'Chitra',           // Mars 2
  'Swati',            // Rahu 2
  'Vishakha',         // Jupiter 2
  'Anuradha',         // Saturn 2
  'Jyeshtha',         // Mercury 2
  'Mula',             // Ketu 3
  'Purva Ashadha',    // Venus 3
  'Uttara Ashadha',   // Sun 3
  'Shravana',         // Moon 3
  'Dhanishta',        // Mars 3
  'Shatabhisha',      // Rahu 3
  'Purva Bhadrapada', // Jupiter 3
  'Uttara Bhadrapada', // Saturn 3
  'Revati',           // Mercury 3
  'Abhijit'           // Central (lord varies)
];

// Map nakshatra to Dasha lord
function dashaOf(nakshatraName) {
  for (const dasha of VIMSHOTTARI_DASHAS) {
    if (dasha.nakshatras.includes(nakshatraName)) {
      return {
        dashaLord: dasha.lord,
        name: nakshatraName,
        cycle: dasha.nakshatras.indexOf(nakshatraName) + 1
      };
    }
  }
  // Abhijit case
  if (nakshatraName === 'Abhijit') {
    return {
      dashaLord: 'Mixed', // Abhijit's lord is debated; classical position used
      name: 'Abhijit',
      cycle: 0
    };
  }
  return { dashaLord: null, name: nakshatraName };
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

// Main: Calculate Dasha Chakra for birth chart
function calculateDashaChakra(grahaLongitudes, lagnaLongitude, currentMahadashaLord) {
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

  // Center cell: Current Mahadasha lord
  const centerCell = {
    dashaLord: currentMahadashaLord,
    row: 5,
    col: 5,
    edge: 'Center',
    occupants: [] // Center displays only the dasha lord, not grahas
  };

  // Build 9×9 grid with Dasha border arrangement
  const grid = [];

  for (let i = 0; i < DASHA_BORDER_SEQUENCE.length; i++) {
    const nakshatraName = DASHA_BORDER_SEQUENCE[i];
    const dasha = dashaOf(nakshatraName);

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
      dashaLord: dasha.dashaLord,
      row: row,
      col: col,
      edge: edge,
      occupants: occupants
    });
  }

  return {
    grid: grid,
    centerCell: centerCell,
    grahaNakshatra: grahaNakshatra,
    lagnaNakshatra: lagnaNakshatra,
    janmaNakshatra: janmaNakshatra,
    currentMahadashaLord: currentMahadashaLord,
    source: {
      title: 'Dasha Chakra in Astrology',
      author: 'K. Ilangovan, Dr. A.R. Gowthem & Prof. Dr. Sri Prathyangira Swamy',
      pageLocus: 'IJATET Vol.7 Issue.1, pp.65-74, 2022'
    }
  };
}

module.exports = {
  DASHA_BORDER_SEQUENCE,
  VIMSHOTTARI_DASHAS,
  dashaOf,
  findNakshatraByLongitude,
  calculateDashaChakra
};
