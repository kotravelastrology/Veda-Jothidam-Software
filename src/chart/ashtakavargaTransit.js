const { attachSource } = require('../contracts/chartContext');
const { RASI_NAMES } = require('./parashariChart');

const VINAY_ADITYA_TRANSIT_SOURCE = {
  title: 'Practical Ashtakavarga',
  author: 'Vinay Aditya',
  file: 'Jyotish_2011_Vinay Aditya_Practical Ashtakavarga.pdf',
  tradition: 'Parashari',
  convention: 'Ashtakavarga transit analysis, Ch.3 & Ch.15',
};

const TARGET_PLANETS = ['Sun', 'Mars', 'Jupiter', 'Saturn', 'Moon', 'Mercury', 'Venus'];

/**
 * Bhinnashtakavarga bindu classification (Ch.3 "General Principles", item 9,
 * file page 19 / printed page 11): "Maximum Bhinnashtaka bindus a planet can
 * have in a sign are 8 and the minimum is 0. Therefore, 4 is the average,
 * above which results are good and below which results are bad" — with a
 * named tier for every value 0-8.
 */
const BHINNA_BINDU_LABELS = [
  'Calamitous', 'Adverse', 'Mediocre', 'Tolerable', 'Average',
  'Advantageous', 'Fortunate', 'Remarkable', 'Magnificent',
];
function classifyBhinnaBindus(bindus) {
  return BHINNA_BINDU_LABELS[bindus];
}

/**
 * Sarvashtakavarga bindu classification (Ch.3 items 1 & 3, file pages 17-18
 * / printed pages 9-10): average is 337/12 ~= 28; "in practice... 25 to 30
 * bindus are considered average," above 30 increasingly favourable, and a
 * malefic transiting a sign under 21 bindus risks "annihilation of the
 * significations of that house."
 */
function classifySarvaBindus(bindus) {
  if (bindus < 21) return 'Very inauspicious';
  if (bindus < 25) return 'Inauspicious';
  if (bindus <= 30) return 'Average';
  return 'Auspicious';
}

/**
 * One transiting planet's Ashtakavarga transit reading against the natal
 * chart. The source's own combining rule is qualitative, not a single
 * numeric formula (Ch.15, file page 172 / printed page 164): "if the planet
 * is transiting a house (or sign) that has high Sarvashtaka bindus and high
 * Bhinnashtaka (the planet's own) bindus, the transit results will be
 * good... higher weightage has to be given to the Bhinnashtaka bindus."
 * Rather than inventing an unstated numeric weighting to collapse this into
 * one score, both classifications are returned side by side so that
 * emphasis rule can be applied by a reader exactly as written.
 */
function evaluateTransit(transitPlanet, transitRasiIndex, natalAshtakavarga) {
  const bhinnaBindus = natalAshtakavarga.bhinna[transitPlanet][transitRasiIndex];
  const sarvaBindus = natalAshtakavarga.sarva[transitRasiIndex];
  return {
    rasiIndex: transitRasiIndex,
    rasi: RASI_NAMES[transitRasiIndex],
    bhinnaBindus,
    bhinnaClassification: classifyBhinnaBindus(bhinnaBindus),
    sarvaBindus,
    sarvaClassification: classifySarvaBindus(sarvaBindus),
  };
}

/**
 * S9 (continued) — Ashtakavarga transit context (WORKFLOW-REGISTER-001 S9).
 * `transitRasiPositions` is a `{ Sun, Mars, Jupiter, Saturn, Moon, Mercury,
 * Venus }` map of each planet's CURRENT (transit-date) 0-based rasi index;
 * `natalAshtakavarga` is the birth chart's own `calculateAshtakavarga(...)`
 * result. Deliberately excludes two deeper refinements this same chapter
 * mentions but does not itself define: Sadhe Sati's own extra checks
 * (retrograde/combustion/nakshatra-lord state) and Kakshya-based narrowing
 * (the book explicitly defers Kakshya's full method to the author's
 * separate, uncatalogued book "Dots of Destiny") — both are real, named
 * next steps rather than silently folded into this result.
 */
function calculateTransitContext(transitRasiPositions, natalAshtakavarga) {
  const perPlanet = {};
  for (const planet of TARGET_PLANETS) {
    if (transitRasiPositions[planet] === undefined) continue;
    perPlanet[planet] = evaluateTransit(planet, transitRasiPositions[planet], natalAshtakavarga);
  }
  return attachSource({ perPlanet }, {
    ...VINAY_ADITYA_TRANSIT_SOURCE,
    pageLocus: 'file pages 17-19 / printed pages 9-11 (Ch.3 General Principles) '
      + 'and file pages 172-173 / printed pages 164-165 (Ch.15 Transit of Saturn) — S9',
  });
}

module.exports = {
  calculateTransitContext,
  evaluateTransit,
  classifyBhinnaBindus,
  classifySarvaBindus,
  BHINNA_BINDU_LABELS,
  TARGET_PLANETS,
};
