/**
 * Interpreting Grahas (PL9 worksheet 020), the part Kotravel can compute now: one row per
 * classical graha with its rasi, degree and house from the lagna, the houses it owns, its
 * dignity, the three avasthas (Jagradadi, Baladi, Dipta) and the six parts of Shadbala.
 *
 * Sources are the engines these values come from: `d1Dignity` and `OWN_SIGNS` in
 * `src/chart/shadbala.js`, and `calculateAvasthas` in `avasthas.js`. The Shadbala total is
 * not shown: `calculateShadbala` refuses to total it (Ayana Bala contradicts its own source).
 *
 * `NOT_BUILT` lists each PL9 column this page does not show, with the reason.
 */
const { rasiFromLongitude, RASI_NAMES } = require('../chart/parashariChart');
const { d1Dignity, OWN_SIGNS, EXALTATION, DEBILITATION } = require('../chart/shadbala');
const { calculateAvasthas } = require('./avasthas');

const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

const NOT_BUILT = [
  { column: 'Dignity (Shadbala scale)', reason: 'the Shadbala dignity helper does not test exaltation or debilitation, so the exaltation column is shown beside it' },
  { column: 'Shadbala %', reason: 'the total is refused: Ayana Bala contradicts its own BPHS formula and table; the six parts are shown instead' },
  { column: 'Func. (benefic / malefic from the lagna)', reason: 'the functional nature for this lagna is not built' },
  { column: 'Shastiamsha', reason: 'not built' },
  { column: 'IshKas (ishta and kashta)', reason: 'not built' },
  { column: 'Hemmed', reason: 'not built' },
  { column: 'Modality and element', reason: 'not built' },
  { column: 'Shayanadi (Av12)', reason: 'needs the ghatis since sunrise, which this page does not compute' },
  { column: 'Ashtakavarga disposition', reason: 'not built' },
  { column: 'Rahu and Ketu', reason: 'not in the Shadbala or avasthas engines' },
];

/**
 * @param lagnaRasiIndex  the lagna's rasi, 0 Aries..11 Pisces
 * @param longitudes      sidereal longitude of each planet in PLANETS
 * @param shadbala        the output of calculateShadbala (its `perPlanet`)
 */
function buildGrahaRows({ lagnaRasiIndex, longitudes, shadbala }) {
  const placed = Object.fromEntries(PLANETS.map((planet) => {
    const { rasiIndex, degreeInSign } = rasiFromLongitude(longitudes[planet]);
    return [planet, { rasiIndex, degreeInSign }];
  }));
  const rasiPositions = Object.fromEntries(PLANETS.map((planet) => [planet, placed[planet].rasiIndex]));
  const avasthas = Object.fromEntries(calculateAvasthas(longitudes).rows.map((row) => [row.planet, row]));
  const houseOf = (rasiIndex) => ((rasiIndex - lagnaRasiIndex + 12) % 12) + 1;

  return PLANETS.map((planet) => {
    const { rasiIndex, degreeInSign } = placed[planet];
    const part = shadbala.perPlanet[planet];
    return {
      planet,
      rasi: RASI_NAMES[rasiIndex],
      degreeInSign,
      house: houseOf(rasiIndex),
      housesOwned: OWN_SIGNS[planet].map(houseOf).sort((a, b) => a - b),
      dignity: d1Dignity(planet, rasiIndex, degreeInSign, rasiPositions),
      // Exaltation and debilitation from the exact sign of the tables; d1Dignity does not test them.
      exaltation: rasiIndex === EXALTATION[planet].sign ? 'exalted'
        : rasiIndex === DEBILITATION[planet].sign ? 'debilitated' : null,
      jagradadi: avasthas[planet].jagradadi,
      baladi: avasthas[planet].baladi,
      deeptadi: avasthas[planet].deeptadi,
      shadbala: {
        sthana: part.sthanaBala,
        dig: part.digBala,
        kaala: part.kaalaBala,
        naisargika: part.naisargikaBala,
        cheshta: part.cheshtaBala,
        drik: part.drikBala,
      },
    };
  });
}

module.exports = { buildGrahaRows, NOT_BUILT, PLANETS };
