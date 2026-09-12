/**
 * Rashi Chakra: 9×9 grid with 12 houses/signs on border, lagna at top
 *
 * Source: K. Ilangovan, Dr. A.R. Gowthem & Prof. Dr. Sri Prathyangira Swamy,
 * 'Rashi Chakra in Astrology', IJATET Vol.7 Issue.1, pp.75-84, 2022
 *
 * Grid Geometry:
 * - 9×9 grid (81 cells total)
 * - 12 border positions (one per sign/house)
 * - 1 top center position (Lagna/Ascendant sign)
 * - Center 5×5 inner grid (additional analysis area)
 * - Placement: Aries (East) → Taurus → ... → Pisces (clockwise)
 *
 * Rashi Classification (12 signs × 4 elements = 3 signs per element):
 * - Fire: Aries, Leo, Sagittarius (ruled by Mars, Sun, Jupiter)
 * - Earth: Taurus, Virgo, Capricorn (ruled by Venus, Mercury, Saturn)
 * - Air: Gemini, Libra, Aquarius (ruled by Mercury, Venus, Saturn)
 * - Water: Cancer, Scorpio, Pisces (ruled by Moon, Mars/Rahu, Jupiter/Ketu)
 *
 * Classical application:
 * - Identify birth Lagna sign (Rashi) by ascendant degree
 * - Map all grahas to rashis by their longitudes
 * - Render grid with Lagna at top, grahas on border by sign
 * - Analyze planetary positions, rulers, elemental strengths
 */

// 12 rashis in classical order (Aries → Pisces, clockwise)
const RASHI_BORDER_SEQUENCE = [
  'Aries',       // 0-30°
  'Taurus',      // 30-60°
  'Gemini',      // 60-90°
  'Cancer',      // 90-120°
  'Leo',         // 120-150°
  'Virgo',       // 150-180°
  'Libra',       // 180-210°
  'Scorpio',     // 210-240°
  'Sagittarius', // 240-270°
  'Capricorn',   // 270-300°
  'Aquarius',    // 300-330°
  'Pisces'       // 330-360°
];

// Rashi properties: element, lord, nature
const RASHI_MAP = {
  'Aries': { element: 'Fire', lord: 'Mars', index: 0 },
  'Taurus': { element: 'Earth', lord: 'Venus', index: 1 },
  'Gemini': { element: 'Air', lord: 'Mercury', index: 2 },
  'Cancer': { element: 'Water', lord: 'Moon', index: 3 },
  'Leo': { element: 'Fire', lord: 'Sun', index: 4 },
  'Virgo': { element: 'Earth', lord: 'Mercury', index: 5 },
  'Libra': { element: 'Air', lord: 'Venus', index: 6 },
  'Scorpio': { element: 'Water', lord: 'Mars', index: 7 },
  'Sagittarius': { element: 'Fire', lord: 'Jupiter', index: 8 },
  'Capricorn': { element: 'Earth', lord: 'Saturn', index: 9 },
  'Aquarius': { element: 'Air', lord: 'Saturn', index: 10 },
  'Pisces': { element: 'Water', lord: 'Jupiter', index: 11 }
};

// Helper: Get Rashi properties
function rashiOf(rashiName) {
  const rashi = RASHI_MAP[rashiName];
  return rashi ? { ...rashi, name: rashiName } : { name: rashiName, element: null, lord: null };
}

// Helper: Get element of a rashi
function getRashiElement(rashiName) {
  return RASHI_MAP[rashiName]?.element || null;
}

// Helper: Find rashi by longitude (360° / 12 = 30° per rashi)
function findRashiByLongitude(longitude) {
  const normalized = ((longitude % 360) + 360) % 360;
  const degreesPerRashi = 30;
  const rashiIndex = Math.floor(normalized / degreesPerRashi);

  return {
    name: RASHI_BORDER_SEQUENCE[rashiIndex],
    index: rashiIndex,
    longitude: normalized,
    degree: normalized % degreesPerRashi
  };
}

// Main: Calculate Rashi Chakra for birth chart
function calculateRashiChakra(grahaLongitudes, lagnaLongitude) {
  // Find all graha rashis
  const grahaRashi = {};
  const ALL_GRAHAS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

  for (const graha of ALL_GRAHAS) {
    if (grahaLongitudes[graha] !== undefined) {
      const rashi = findRashiByLongitude(grahaLongitudes[graha]);
      grahaRashi[graha] = rashi.name;
    }
  }

  // Find Lagna rashi
  const lagnaRashi_ = findRashiByLongitude(lagnaLongitude);
  const lagnaRashi = lagnaRashi_.name;

  // Build 12-position grid with Rashi border arrangement
  const grid = [];

  for (let i = 0; i < RASHI_BORDER_SEQUENCE.length; i++) {
    const rashiName = RASHI_BORDER_SEQUENCE[i];
    const rashi = rashiOf(rashiName);

    // Calculate grid position (12 positions on 9×9 grid)
    // East (0): top-right corner
    // South (3): bottom-right to bottom-left
    // West (6): bottom-left to top-left
    // North (9): top-left to top-right
    let row, col, edge;

    if (i === 0) {
      // Aries: top-right (East, outer)
      row = 1;
      col = 9;
      edge = 'NE';
    } else if (i === 1) {
      // Taurus: right edge
      row = 3;
      col = 9;
      edge = 'E';
    } else if (i === 2) {
      // Gemini: right edge lower
      row = 5;
      col = 9;
      edge = 'E';
    } else if (i === 3) {
      // Cancer: bottom-right
      row = 7;
      col = 9;
      edge = 'SE';
    } else if (i === 4) {
      // Leo: bottom
      row = 9;
      col = 7;
      edge = 'S';
    } else if (i === 5) {
      // Virgo: bottom center
      row = 9;
      col = 5;
      edge = 'S';
    } else if (i === 6) {
      // Libra: bottom-left
      row = 9;
      col = 3;
      edge = 'SW';
    } else if (i === 7) {
      // Scorpio: left edge lower
      row = 7;
      col = 1;
      edge = 'W';
    } else if (i === 8) {
      // Sagittarius: left edge
      row = 5;
      col = 1;
      edge = 'W';
    } else if (i === 9) {
      // Capricorn: top-left lower
      row = 3;
      col = 1;
      edge = 'W';
    } else if (i === 10) {
      // Aquarius: top-left
      row = 1;
      col = 3;
      edge = 'NW';
    } else {
      // Pisces: top
      row = 1;
      col = 5;
      edge = 'N';
    }

    // Find grahas in this rashi
    const occupants = [];
    for (const [graha, rashi_] of Object.entries(grahaRashi)) {
      if (rashi_ === rashiName) {
        occupants.push(graha);
      }
    }

    grid.push({
      name: rashiName,
      element: rashi.element,
      lord: rashi.lord,
      row: row,
      col: col,
      edge: edge,
      occupants: occupants
    });
  }

  return {
    grid: grid,
    grahaRashi: grahaRashi,
    lagnaRashi: lagnaRashi,
    source: {
      title: 'Rashi Chakra in Astrology',
      author: 'K. Ilangovan, Dr. A.R. Gowthem & Prof. Dr. Sri Prathyangira Swamy',
      pageLocus: 'IJATET Vol.7 Issue.1, pp.75-84, 2022'
    }
  };
}

module.exports = {
  RASHI_BORDER_SEQUENCE,
  RASHI_MAP,
  rashiOf,
  getRashiElement,
  findRashiByLongitude,
  calculateRashiChakra
};
