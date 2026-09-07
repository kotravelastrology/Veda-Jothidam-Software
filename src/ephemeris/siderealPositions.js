const {
  calculatePosition, calculateRiseTransitSet, setSiderealMode,
  Planet, LunarPoint, SiderealMode, CalculationFlag, RiseTransitFlag,
} = require('@swisseph/node');

/**
 * Sidereal Sun/Moon longitudes at a given Julian Day, for Panchangam limb
 * calculations. Kept separate from swissEphemeris.js (which builds a full
 * chart with houses) because Panchangam limbs only need Sun/Moon longitude
 * and are computed many times per day during boundary search.
 */
function sunMoonLongitudes(julianDay, ayanamsha = 'Lahiri') {
  const siderealMode = SiderealMode[ayanamsha];
  if (siderealMode === undefined) throw new RangeError(`Unsupported ayanamsa: ${ayanamsha}`);
  setSiderealMode(siderealMode);
  const flags = CalculationFlag.SwissEphemeris | CalculationFlag.Sidereal;
  const sun = calculatePosition(julianDay, Planet.Sun, flags);
  const moon = calculatePosition(julianDay, Planet.Moon, flags);
  return { sunLongitude: sun.longitude, moonLongitude: moon.longitude };
}

/**
 * Rahu's sidereal longitude, as the Mean lunar node — S6's follow-up source
 * check (*Rahu & Kethu in Bhrigu Astrology*, Srinivasan Shastry, 2009, file
 * page 5 / printed page xii) describes Rahu/Ketu's motion as "always
 * retrograde" at a constant "rate of 19 degrees 20 minutes per year": the
 * Mean Node's defining behaviour (~19.355 deg/year, a smooth constant
 * regression). The True Node's motion is not constant and periodically
 * turns direct for short spells, which this source's description does not
 * allow for — so Mean Node, not True Node, is this project's convention.
 * Ketu is always exactly Rahu + 180 degrees, kept separate from `PLANETS`
 * in swissEphemeris.js since Ashtakavarga/Shadbala/Nabhasa-Yoga/Karaka each
 * have their own BPHS citation excluding the nodes from those calculations.
 */
function meanNodeLongitude(julianDay, ayanamsha = 'Lahiri') {
  const siderealMode = SiderealMode[ayanamsha];
  if (siderealMode === undefined) throw new RangeError(`Unsupported ayanamsa: ${ayanamsha}`);
  setSiderealMode(siderealMode);
  const flags = CalculationFlag.SwissEphemeris | CalculationFlag.Sidereal;
  const rahu = calculatePosition(julianDay, LunarPoint.MeanNode, flags);
  return rahu.longitude;
}

/**
 * Sunrise for the given UTC-midnight Julian Day at a location, per the
 * sunrise-day-boundary rule verified in S1-B (Panchangam Calculations,
 * Karanam Ramakumar, file page 1). Longitude is east-positive, matching the
 * convention already used by calculateHouses in swissEphemeris.js.
 */
function sunriseJulianDay(julianDayUTCMidnight, latitude, longitude, altitude = 0) {
  const result = calculateRiseTransitSet(
    julianDayUTCMidnight, Planet.Sun, RiseTransitFlag.Rise,
    longitude, latitude, altitude, CalculationFlag.SwissEphemeris,
  );
  return result.time;
}

/** Sunset following a given sunrise, for day-duration-based kalam calculations. */
function sunsetJulianDay(julianDayAtOrAfterSunrise, latitude, longitude, altitude = 0) {
  const result = calculateRiseTransitSet(
    julianDayAtOrAfterSunrise, Planet.Sun, RiseTransitFlag.Set,
    longitude, latitude, altitude, CalculationFlag.SwissEphemeris,
  );
  return result.time;
}

module.exports = {
  sunMoonLongitudes, meanNodeLongitude, sunriseJulianDay, sunsetJulianDay,
};
