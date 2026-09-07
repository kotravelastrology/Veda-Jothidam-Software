const { calculateChart } = require('../ephemeris/swissEphemeris');
const { meanNodeLongitude } = require('../ephemeris/siderealPositions');

/**
 * The 12 Rasi in order from Mesha. This is the universal sidereal-zodiac
 * 30-degrees-per-sign definition shared by every Vedic astrology source —
 * not a book-specific rule, so it is not run through `attachSource`.
 */
const RASI_NAMES = [
  'Mesha', 'Vrishabha', 'Mithuna', 'Karkataka', 'Simha', 'Kanya',
  'Tula', 'Vrischika', 'Dhanu', 'Makara', 'Kumbha', 'Meena',
];

function rasiFromLongitude(longitude) {
  const normalized = ((longitude % 360) + 360) % 360;
  const index = Math.floor(normalized / 30);
  return { rasiIndex: index, rasi: RASI_NAMES[index], degreeInSign: normalized - index * 30 };
}

/**
 * Which of the 12 Bhava (house) cusps a longitude falls into — a planet is
 * in house N if it lies on or after cusp N and before cusp N+1, going
 * forward around the zodiac (with 12 wrapping to 1). `cusps` is the
 * 1-indexed array `calculateHouses` already returns.
 */
function houseOfLongitude(longitude, cusps) {
  const normalized = ((longitude % 360) + 360) % 360;
  for (let house = 1; house <= 12; house += 1) {
    const start = cusps[house];
    const end = cusps[house === 12 ? 1 : house + 1];
    const span = ((end - start) % 360 + 360) % 360;
    const offset = ((normalized - start) % 360 + 360) % 360;
    if (offset < span) return house;
  }
  return 12;
}

/**
 * S6 — Birth profile and Parashari chart (WORKFLOW-REGISTER-001 S6; PLAN-001
 * item 6): Lagna and the seven classical grahas (Sun–Saturn), each with
 * sidereal longitude, Rasi placement and Bhava (house), via the S1-C Swiss
 * Ephemeris engine already used by S2 onward.
 *
 * Bhava (house) placement uses the engine's `Porphyrius` house system —
 * simple ecliptic-arc trisection between the four angular cusps (Lagna,
 * 4th, 7th, 10th). A follow-up source check (recorded in
 * S6-BHAVA-001.md) found a dedicated translated primary source,
 * *Sripatipaddhati* (V. Subrahmanya Sastri), whose own worked example
 * (Sloka 6-7, file page 21 / printed page 10) defines Bhava this exact
 * way — reproduced exactly by `Porphyrius` (confirmed to 4 decimal places
 * against that worked example before this was implemented, and pinned as
 * this project's supported convention in S2's `chartContext.js`). This
 * closes the gap left open since S6's first pass, where BPHS/Santhanam's
 * own preface named "Sripati Paddhati" without giving its formula.
 *
 * Rahu/Ketu (lunar nodes) use the Mean Node. A follow-up source check
 * (recorded in S6-RAHU-KETU-001.md) found *Rahu & Kethu in Bhrigu
 * Astrology* (Srinivasan Shastry, 2009, file page 5 / printed page xii),
 * which describes the nodes' motion as "always retrograde" at a constant
 * "rate of 19 degrees 20 minutes per year" — the Mean Node's defining
 * behaviour (a smooth, unbroken regression); the True Node's motion is not
 * constant and periodically turns direct for short spells, which this
 * description does not allow for. Swiss Ephemeris's own Mean Node speed
 * for a sample date matched this rate almost exactly (~19.36 deg/year)
 * before this was implemented.
 */
function calculateParashariChart(chartContext) {
  const { input, ayanamsha, houseSystem } = chartContext;
  const chart = calculateChart({ ...input, ayanamsa: ayanamsha, houseSystem });

  const lagnaLongitude = chart.houses.ascendant;
  const lagna = { longitude: lagnaLongitude, ...rasiFromLongitude(lagnaLongitude) };

  const grahas = Object.fromEntries(
    Object.entries(chart.positions).map(([name, position]) => [
      name,
      {
        longitude: position.longitude,
        ...rasiFromLongitude(position.longitude),
        house: houseOfLongitude(position.longitude, chart.houses.cusps),
      },
    ]),
  );

  const rahuLongitude = meanNodeLongitude(chart.julianDay, ayanamsha);
  const ketuLongitude = (rahuLongitude + 180) % 360;
  grahas.Rahu = {
    longitude: rahuLongitude,
    ...rasiFromLongitude(rahuLongitude),
    house: houseOfLongitude(rahuLongitude, chart.houses.cusps),
  };
  grahas.Ketu = {
    longitude: ketuLongitude,
    ...rasiFromLongitude(ketuLongitude),
    house: houseOfLongitude(ketuLongitude, chart.houses.cusps),
  };

  return {
    engine: chart.engine,
    engineVersion: chart.engineVersion,
    julianDay: chart.julianDay,
    ayanamsha,
    houseSystem,
    lagna,
    mc: chart.houses.mc,
    cusps: chart.houses.cusps,
    grahas,
  };
}

module.exports = { calculateParashariChart, rasiFromLongitude, houseOfLongitude, RASI_NAMES };
