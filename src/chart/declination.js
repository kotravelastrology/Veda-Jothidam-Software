/**
 * Declination (kranti) of the seven planets at a moment: the planet's angular distance north (+) or south (-) of the
 * celestial equator. It is an astronomical quantity, independent of the ayanamsha, read from the Swiss Ephemeris in
 * equatorial mode — the same `kranti` that BPHS chapter 27 verses 15-17 (Ayana Bala) uses. The classical books read it
 * as Northern or Southern Kranti; nothing more is claimed here.
 */

const { kranti } = require('./shadbala');

const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
/** The Sun's greatest declination, the obliquity of the ecliptic in degrees (about 23d26'), for a plausibility bound. */
const OBLIQUITY = 23.44;

/** Degrees, minutes, seconds of an absolute angle. */
function dms(deg) {
  const a = Math.abs(deg);
  let d = Math.floor(a);
  let m = Math.floor((a - d) * 60);
  let s = Math.round(((a - d) * 60 - m) * 60);
  if (s === 60) { s = 0; m += 1; }
  if (m === 60) { m = 0; d += 1; }
  return { d, m, s };
}

/** Declination of every planet at Julian day `jd`. */
function declinations(jd) {
  return PLANETS.map((planet) => {
    const value = kranti(planet, jd);
    return { planet, declination: value, hemisphere: value >= 0 ? 'N' : 'S', dms: dms(value) };
  });
}

module.exports = { PLANETS, OBLIQUITY, dms, declinations };
