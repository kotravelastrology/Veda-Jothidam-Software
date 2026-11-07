const { attachSource } = require('../contracts/chartContext');

const ASHTAKAVARGA_SOURCE = {
  title: 'Practical Ashtakavarga',
  author: 'Vinay Aditya',
  file: 'Jyotish_2011_Vinay Aditya_Practical Ashtakavarga.pdf',
  tradition: 'Parashari',
  convention: '337-bindu Ashtakavarga (the book\'s own footnote: "the 337 bindu Ashtakavarga system which is more widely accepted")',
};

const CONTRIBUTORS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Lagna'];
const TARGET_PLANETS = ['Sun', 'Mars', 'Jupiter', 'Saturn', 'Moon', 'Mercury', 'Venus'];

/**
 * Table-1, "Benefic places from each planet in their respective
 * Bhinnashtakavargas" (S1-D's selected source, file page 12 / printed page
 * 4, visually re-verified this stage). Each entry lists the house-offsets
 * (1 = the contributor's own sign, up to 12) that the contributor marks as
 * benefic for the named target planet's Bhinnashtakavarga. Rahu, Ketu and
 * the outer planets are excluded by the source's own opening line.
 */
const BINDU_TABLE = {
  Sun: {
    Sun: [1, 2, 4, 7, 8, 9, 10, 11], Moon: [3, 6, 10, 11], Mars: [1, 2, 4, 7, 8, 9, 10, 11],
    Mercury: [3, 5, 6, 9, 10, 11, 12], Jupiter: [5, 6, 9, 11], Venus: [6, 7, 12],
    Saturn: [1, 2, 4, 7, 8, 9, 10, 11], Lagna: [3, 4, 6, 10, 11, 12],
  },
  Mars: {
    Sun: [3, 5, 6, 10, 11], Moon: [3, 6, 11], Mars: [1, 2, 4, 7, 8, 10, 11], Mercury: [3, 5, 6, 11],
    Jupiter: [6, 10, 11, 12], Venus: [6, 8, 11, 12], Saturn: [1, 4, 7, 8, 9, 10, 11], Lagna: [1, 3, 6, 10, 11],
  },
  Jupiter: {
    Sun: [1, 2, 3, 4, 7, 8, 9, 10, 11], Moon: [2, 5, 7, 9, 11], Mars: [1, 2, 4, 7, 8, 10, 11],
    Mercury: [1, 2, 4, 5, 6, 9, 10, 11], Jupiter: [1, 2, 3, 4, 7, 8, 10, 11], Venus: [2, 5, 6, 9, 10, 11],
    Saturn: [3, 5, 6, 12], Lagna: [1, 2, 4, 5, 6, 7, 9, 10, 11],
  },
  Saturn: {
    Sun: [1, 2, 4, 7, 8, 10, 11], Moon: [3, 6, 11], Mars: [3, 5, 6, 10, 11, 12], Mercury: [6, 8, 9, 10, 11, 12],
    Jupiter: [5, 6, 11, 12], Venus: [6, 11, 12], Saturn: [3, 5, 6, 11], Lagna: [1, 3, 4, 6, 10, 11],
  },
  Moon: {
    Sun: [3, 6, 7, 8, 10, 11], Moon: [1, 3, 6, 7, 10, 11], Mars: [2, 3, 5, 6, 9, 10, 11],
    Mercury: [1, 3, 4, 5, 7, 8, 10, 11], Jupiter: [1, 4, 7, 8, 10, 11, 12], Venus: [3, 4, 5, 7, 9, 10, 11],
    Saturn: [3, 5, 6, 11], Lagna: [3, 6, 10, 11],
  },
  Mercury: {
    Sun: [5, 6, 9, 11, 12], Moon: [2, 4, 6, 8, 10, 11], Mars: [1, 2, 4, 7, 8, 9, 10, 11],
    Mercury: [1, 3, 5, 6, 9, 10, 11, 12], Jupiter: [6, 8, 11, 12], Venus: [1, 2, 3, 4, 5, 8, 9, 11],
    Saturn: [1, 2, 4, 7, 8, 9, 10, 11], Lagna: [1, 2, 4, 6, 8, 10, 11],
  },
  Venus: {
    Sun: [8, 11, 12], Moon: [1, 2, 3, 4, 5, 8, 9, 11, 12], Mars: [3, 5, 6, 9, 11, 12], Mercury: [3, 5, 6, 9, 11],
    Jupiter: [5, 8, 9, 10, 11], Venus: [1, 2, 3, 4, 5, 8, 9, 10, 11], Saturn: [3, 4, 5, 8, 9, 10, 11],
    Lagna: [1, 2, 3, 4, 5, 8, 9, 11],
  },
};

/** The encircled per-planet totals printed on the same page; chart-independent (see stage record). */
const EXPECTED_TOTAL = { Sun: 48, Mars: 39, Jupiter: 56, Saturn: 39, Moon: 49, Mercury: 54, Venus: 52 };
const EXPECTED_GRAND_TOTAL = 337;

/**
 * The Lagna's own Ashtakavarga: the benefic places from each contributor (house-offsets from its own rasi), from C.S. Patel,
 * Jyotish Ashtakavarga (1957 ed.), "The Lagna's Ashtakavarga Table", printed p.34 (file page 68). Patel's note: the Lagna
 * Ashtakavarga (49 bindus) is used only for Ayurdaya and is not part of the 337 Samudayashtakavarga. Kept apart from
 * BINDU_TABLE, which is the seven planets' Table-1 of Practical Ashtakavarga.
 */
const LAGNA_PLACES = {
  Lagna: {
    Sun: [3, 4, 6, 10, 11, 12], Moon: [3, 6, 10, 11, 12], Mars: [1, 3, 6, 10, 11], Mercury: [1, 2, 4, 6, 8, 10, 11],
    Jupiter: [1, 2, 4, 5, 6, 7, 9, 10, 11], Venus: [1, 2, 3, 4, 5, 8, 9], Saturn: [1, 3, 4, 6, 10, 11], Lagna: [3, 6, 10, 11],
  },
};
const LAGNA_EXPECTED_TOTAL = 49;

/**
 * The benefic marks behind a Bhinnashtakavarga: for each of the 8 contributors, a 12-entry 0/1 array (index 0 = Mesha ..
 * 11 = Meena) of the signs that contributor marks for `targetPlanet`, placed from that contributor's own rasi. `places` is
 * the book's table; another book's (Phaladeepika's) can be passed.
 */
function contributionMatrix(targetPlanet, rasiPositions, places = BINDU_TABLE) {
  const table = places[targetPlanet];
  if (!table) throw new RangeError(`Unsupported Ashtakavarga target: ${targetPlanet}`);
  const matrix = {};
  for (const contributor of CONTRIBUTORS) {
    const referenceRasi = rasiPositions[contributor];
    if (!Number.isInteger(referenceRasi) || referenceRasi < 0 || referenceRasi > 11) {
      throw new TypeError(`Missing or invalid rasi position for contributor: ${contributor}`);
    }
    const marks = new Array(12).fill(0);
    for (const offset of table[contributor]) {
      const sign = (referenceRasi + offset - 1) % 12;
      marks[sign] += 1;
    }
    matrix[contributor] = marks;
  }
  return matrix;
}

/**
 * Bhinnashtakavarga of `targetPlanet`: a 12-entry bindu-count array (index 0
 * = Mesha .. 11 = Meena), the sum of the contributors' marks.
 */
function calculateBhinnashtakavarga(targetPlanet, rasiPositions, places = BINDU_TABLE) {
  const matrix = contributionMatrix(targetPlanet, rasiPositions, places);
  const bindus = new Array(12).fill(0);
  for (const contributor of CONTRIBUTORS) {
    for (let i = 0; i < 12; i += 1) bindus[i] += matrix[contributor][i];
  }
  return bindus;
}

/**
 * S9 — Ashtakavarga (WORKFLOW-REGISTER-001 S9; PLAN-001 item 9): the 7
 * classical grahas' Bhinnashtakavarga plus their Sarvashtakavarga total.
 * `rasiPositions` is a { Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn,
 * Lagna } map of 0-based rasi indices, as already produced by
 * `calculateParashariChart` (S6) — Rahu/Ketu are excluded by the source's
 * own scope, so this stage has no dependency on S6's still-open Rahu/Ketu
 * item.
 */
function calculateAshtakavarga(rasiPositions) {
  const bhinna = {};
  const sarva = new Array(12).fill(0);
  for (const planet of TARGET_PLANETS) {
    const bindus = calculateBhinnashtakavarga(planet, rasiPositions);
    bhinna[planet] = bindus;
    for (let i = 0; i < 12; i += 1) sarva[i] += bindus[i];
  }

  return attachSource({ bhinna, sarva }, {
    ...ASHTAKAVARGA_SOURCE,
    pageLocus: 'file page 12 / printed page 4, Table-1 — S9',
  });
}

/** The eight kakshas of a sign, in the order PL9 prints them on the edge of its Sarva Chancha Chakra (Sa Ju Ma Su Ve Me Mo As). */
const KAKSHA_LORDS = ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Lagna'];

/**
 * The Sarva Chancha Chakra of one planet: for each sign, a string of eight marks (one per kaksha, in KAKSHA_LORDS order). A
 * kaksha is marked 1 when its lord marks that sign in the planet's Bhinnashtakavarga, so the count of 1s is the bindu count.
 * PL 6.1 manual, Sarva Chancha Chakra (pp.81-82): eight kakshas to a sign, one ring per planet.
 */
function kakshaMarks(targetPlanet, rasiPositions, places = BINDU_TABLE) {
  const matrix = contributionMatrix(targetPlanet, rasiPositions, places);
  return Array.from({ length: 12 }, (_, sign) => KAKSHA_LORDS.map((c) => matrix[c][sign]).join(''));
}

module.exports = {
  calculateAshtakavarga,
  calculateBhinnashtakavarga,
  contributionMatrix,
  kakshaMarks,
  KAKSHA_LORDS,
  BINDU_TABLE,
  LAGNA_PLACES,
  LAGNA_EXPECTED_TOTAL,
  EXPECTED_TOTAL,
  EXPECTED_GRAND_TOTAL,
  CONTRIBUTORS,
  TARGET_PLANETS,
};
