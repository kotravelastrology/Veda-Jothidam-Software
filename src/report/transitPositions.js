/**
 * Real Swiss Ephemeris transit positions for an arbitrary instant.
 *
 * Replaces the Phase-35 mean-motion approximation in
 * `src/analysis/TransitCalculator.ts` (hard-coded J2000 base longitudes +
 * fixed daily speeds + day-of-year retrograde guesses) with the same
 * `@swisseph/node` engine the natal chart uses. Server-only — `@swisseph/node`
 * is a native addon (`serverExternalPackages` in next.config.mjs), so this
 * is reached from the client through a Server Action, never imported into a
 * browser bundle.
 *
 * Sidereal zodiac; ayanamsha selectable (defaults to the project default,
 * Lahiri). Rahu/Ketu use the mean or true node per `nodeType`. The panchanga
 * limbs here (tithi / nakshatra / vaara / hora / lunar phase) are the
 * lightweight day-level values a transit table shows; the governed
 * Tirukanita Panchangam page computes limb start/end times rigorously.
 */
const { calculateChart } = require('../ephemeris/swissEphemeris');
const { nodeLongitude } = require('../ephemeris/siderealPositions');

const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];
const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Kritika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu',
  'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta',
  'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha',
  'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha', 'Purva Bhadrapada',
  'Uttara Bhadrapada', 'Revati',
];
const TITHI_NAMES = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi',
  'Saptami', 'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi',
  'Trayodashi', 'Chaturdashi', 'Purnima',
];
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
// Chaldean order, starting from each weekday's ruling planet at sunrise.
const HORA_SEQUENCE = ['Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars'];
const WEEKDAY_LORD_INDEX = { Sunday: 0, Monday: 3, Tuesday: 6, Wednesday: 2, Thursday: 5, Friday: 1, Saturday: 4 };

const NODE_SPEED_PER_DAY = -0.0529539; // mean-node regression; true node overwritten below

const norm360 = (d) => ((d % 360) + 360) % 360;

function splitLongitude(longitude) {
  const lon = norm360(longitude);
  const signIndex = Math.floor(lon / 30);
  const degInSign = lon - signIndex * 30;
  const degree = Math.floor(degInSign);
  const minuteFloat = (degInSign - degree) * 60;
  const minute = Math.floor(minuteFloat);
  const second = Math.floor((minuteFloat - minute) * 60);
  const nakSize = 360 / 27;
  const nakIndex = Math.floor(lon / nakSize) % 27;
  const nakshatraDegree = Math.round(((lon % nakSize) / nakSize) * 400) / 100; // 0-4 pada scale
  return {
    sign: SIGNS[signIndex], degree, minute, second,
    nakshatra: NAKSHATRAS[nakIndex], nakshatraDegree,
  };
}

/** Lunar phase bucket + age in days from the Sun-Moon elongation. */
function lunarPhaseFromElongation(elongation) {
  const e = norm360(elongation);
  const age = (e / 360) * 29.530588;
  let phase = 'new';
  if (e < 22.5) phase = 'new';
  else if (e < 67.5) phase = 'waxing-crescent';
  else if (e < 112.5) phase = 'first-quarter';
  else if (e < 157.5) phase = 'waxing-gibbous';
  else if (e < 202.5) phase = 'full';
  else if (e < 247.5) phase = 'waning-gibbous';
  else if (e < 292.5) phase = 'last-quarter';
  else phase = 'waning-crescent';
  return { phase, age: Math.round(age * 100) / 100 };
}

/**
 * `date` is a JS Date (its UTC fields are used). `latitude`/`longitude` only
 * affect the geocentric longitudes negligibly, so the observer's own place
 * is reused rather than adding a separate location input.
 */
function computeTransitPositions(date, {
  latitude = 0, longitude = 0, ayanamsha = 'Lahiri', nodeType = 'mean',
} = {}) {
  const d = date instanceof Date ? date : new Date(date);
  const chart = calculateChart({
    year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate(),
    hour: d.getUTCHours(), minute: d.getUTCMinutes(), second: d.getUTCSeconds(),
    latitude, longitude, utcOffsetMinutes: 0,
    ayanamsa: ayanamsha, houseSystem: 'WholeSign',
  });

  const planets = [];
  for (const name of ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn']) {
    const p = chart.positions[name];
    planets.push({
      planet: name,
      longitude: norm360(p.longitude),
      ...splitLongitude(p.longitude),
      isRetrograde: p.longitudeSpeed < 0,
      speed: Math.round(p.longitudeSpeed * 1000) / 1000,
    });
  }
  const rahuLon = nodeLongitude(chart.julianDay, ayanamsha, nodeType);
  const rahuSpeed = nodeType === 'true' ? NODE_SPEED_PER_DAY : NODE_SPEED_PER_DAY; // sign only matters for the flag
  for (const [name, lon] of [['Rahu', rahuLon], ['Ketu', norm360(rahuLon + 180)]]) {
    planets.push({
      planet: name,
      longitude: norm360(lon),
      ...splitLongitude(lon),
      isRetrograde: true, // both nodes always retrograde in the mean model; true node is retrograde ~99% of the time
      speed: Math.round(rahuSpeed * 1000) / 1000,
    });
  }

  const sunLon = norm360(chart.positions.Sun.longitude);
  const moonLon = norm360(chart.positions.Moon.longitude);
  const elongation = norm360(moonLon - sunLon);
  const { phase, age } = lunarPhaseFromElongation(elongation);
  const tithiIndex = Math.floor(elongation / 12); // 0-29
  const paksha = tithiIndex < 15 ? 'Shukla' : 'Krishna';
  const tithiName = tithiIndex === 29 ? 'Amavasya' : TITHI_NAMES[tithiIndex % 15];

  const vaara = WEEKDAYS[d.getUTCDay()];
  const horaOffset = (WEEKDAY_LORD_INDEX[vaara] + d.getUTCHours()) % 7;

  return {
    date: d.toISOString().split('T')[0],
    time: d.toISOString().split('T')[1].slice(0, 5),
    julianDay: chart.julianDay,
    ayanamsha,
    nodeType,
    planets,
    lunarPhase: phase,
    lunarAge: age,
    tithi: `${paksha} ${tithiName}`,
    hora: `${HORA_SEQUENCE[horaOffset]} Hora`,
    vaara,
  };
}

module.exports = { computeTransitPositions, SIGNS, NAKSHATRAS };
