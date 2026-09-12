// Elemental Chakra - Fire, Earth, Air, Water element compatibility analysis
// Based on classical Vedic astrology element theory (Panchabhuta)

const ELEMENT_MAP = {
  Sun: 'Fire',
  Moon: 'Water',
  Mars: 'Fire',
  Mercury: 'Air',
  Jupiter: 'Fire',
  Venus: 'Earth',
  Saturn: 'Earth',
  Rahu: 'Air',
  Ketu: 'Water'
};

// Compatibility matrix: same element (harmonious), friendly (neutral), opposing (conflict)
const ELEMENT_COMPATIBILITY = {
  Fire: {
    Fire: 85,    // Same element - highly harmonious
    Earth: 40,   // Complementary (fire warms earth)
    Air: 75,     // Air feeds fire - harmonious
    Water: -70   // Fire quenches water - opposing
  },
  Earth: {
    Fire: 40,    // Fire warms earth - neutral
    Earth: 80,   // Same element - harmonious
    Air: -60,    // Air erodes earth - opposing
    Water: 60    // Water nourishes earth - harmonious
  },
  Air: {
    Fire: 75,    // Air feeds fire - harmonious
    Earth: -60,  // Air erodes earth - opposing
    Air: 85,     // Same element - harmonious
    Water: -50   // Air disturbs water - opposing
  },
  Water: {
    Fire: -70,   // Water quenches fire - opposing
    Earth: 60,   // Water nourishes earth - harmonious
    Air: -50,    // Air disturbs water - opposing
    Water: 80    // Same element - harmonious
  }
};

const ALL_GRAHAS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

function calculateElementalChakra(grahas) {
  // Count elements
  const elementCounts = { Fire: 0, Earth: 0, Air: 0, Water: 0 };
  for (const planet of ALL_GRAHAS) {
    if (grahas[planet]) {
      const element = ELEMENT_MAP[planet];
      elementCounts[element]++;
    }
  }

  // Calculate element strength (normalized 0-100)
  const totalGrahas = ALL_GRAHAS.length;
  const elementalStrength = {};
  for (const [element, count] of Object.entries(elementCounts)) {
    elementalStrength[element] = (count / totalGrahas) * 100;
  }

  // Generate all graha pairs and their compatibility
  const elementalPairs = [];
  for (let i = 0; i < ALL_GRAHAS.length; i++) {
    for (let j = i + 1; j < ALL_GRAHAS.length; j++) {
      const g1 = ALL_GRAHAS[i];
      const g2 = ALL_GRAHAS[j];
      const e1 = ELEMENT_MAP[g1];
      const e2 = ELEMENT_MAP[g2];
      const compat = ELEMENT_COMPATIBILITY[e1][e2];

      elementalPairs.push({
        graha1: g1,
        graha2: g2,
        element1: e1,
        element2: e2,
        compatibility: compat,
        type: compat > 50 ? 'harmonious' : compat >= -30 ? 'neutral' : 'conflicting'
      });
    }
  }

  // Build compatibility matrix (element-to-element)
  const compatibilityMatrix = ELEMENT_COMPATIBILITY;

  // Separate harmonies and conflicts
  const harmonies = elementalPairs.filter(p => p.compatibility > 50);
  const conflicts = elementalPairs.filter(p => p.compatibility <= -30);

  return {
    elementCounts,
    elementalStrength,
    elementalPairs,
    compatibilityMatrix,
    harmonies,
    conflicts,
    source: {
      title: 'Brihat Parashara Hora Shastra',
      author: 'Sage Parashara',
      chapter: 'Panchabhuta (Five Elements) Analysis'
    }
  };
}

module.exports = {
  ELEMENT_MAP,
  ELEMENT_COMPATIBILITY,
  calculateElementalChakra
};
