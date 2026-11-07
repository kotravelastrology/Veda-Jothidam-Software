/**
 * The sunrise that began a birth's day: the latest sunrise at or before the birth moment (so a birth before sunrise takes the
 * sunrise of the day before). Two conventions, since the books do not fix one:
 *  - 'visible': the upper limb on the horizon with refraction, the sunrise of the app's Panchangam;
 *  - 'geometric': the Sun's centre on the horizon, no refraction (PL9's special lagnas agree with this one).
 */

const { calculateRiseTransitSet, Planet, RiseTransitFlag, CalculationFlag } = require('@swisseph/node');
const { sunMoonLongitudes } = require('../ephemeris/siderealPositions');

const BIT_DISC_CENTER = 256;
const BIT_NO_REFRACTION = 512;

function sunriseOn(jdUtMidnight, latitude, longitude, kind) {
  const extra = kind === 'geometric' ? BIT_DISC_CENTER | BIT_NO_REFRACTION : 0;
  return calculateRiseTransitSet(jdUtMidnight, Planet.Sun, RiseTransitFlag.Rise | extra, longitude, latitude, 0, CalculationFlag.SwissEphemeris).time;
}

/**
 * @returns { sunriseJd, hoursSinceSunrise, sunLongitudeAtSunrise } for a birth at `birthJd` (UT Julian day) at the place
 * (latitude north, longitude east positive).
 */
function sunriseBefore(birthJd, latitude, longitude, ayanamsha = 'Lahiri', kind = 'visible') {
  const midnight = Math.floor(birthJd - 0.5) + 0.5;
  let best = null;
  for (const day of [-1, 0, 1]) {
    const sr = sunriseOn(midnight + day, latitude, longitude, kind);
    if (sr <= birthJd && (best === null || sr > best)) best = sr;
  }
  if (best === null) throw new Error('no sunrise found before the birth (polar latitude?)');
  return { sunriseJd: best, hoursSinceSunrise: (birthJd - best) * 24, sunLongitudeAtSunrise: sunMoonLongitudes(best, ayanamsha).sunLongitude, kind };
}

module.exports = { sunriseBefore };
