const {
  julianDay,
  calculatePosition,
  calculateHouses,
  setSiderealMode,
  Planet,
  HouseSystem,
  SiderealMode,
  CalculationFlag,
} = require('@swisseph/node');
// Read @swisseph/node's own version for display purposes only. Avoids
// require.resolve('@swisseph/node') (it does not reliably return a real
// filesystem path when a bundler, e.g. a Next.js Server Action build,
// treats the package as an external module) by locating node_modules
// relative to this file's own __dirname instead, which bundlers preserve.
// Never worth crashing chart calculation over a version string, so this
// falls back to 'unknown' rather than throwing.
function readSwissephVersion() {
  try {
    const fs = require('node:fs');
    const path = require('node:path');
    const pkgPath = path.join(__dirname, '..', '..', 'node_modules', '@swisseph', 'node', 'package.json');
    return JSON.parse(fs.readFileSync(pkgPath, 'utf8')).version;
  } catch {
    return 'unknown';
  }
}
const packageMetadata = { version: readSwissephVersion() };

const PLANETS = [
  ['Sun', Planet.Sun], ['Moon', Planet.Moon], ['Mercury', Planet.Mercury],
  ['Venus', Planet.Venus], ['Mars', Planet.Mars], ['Jupiter', Planet.Jupiter],
  ['Saturn', Planet.Saturn],
];

/**
 * Calculate astronomical positions for a governed chart input.
 * `utcOffsetMinutes` is required so local birth time is converted deterministically.
 * This module only supplies positions/houses; source books govern astrology rules.
 */
function calculateChart({ year, month, day, hour, minute = 0, second = 0,
  latitude, longitude, utcOffsetMinutes = 0, ayanamsa = 'Lahiri',
  houseSystem = 'Placidus' }) {
  if (![year, month, day, hour, latitude, longitude].every(Number.isFinite)) {
    throw new TypeError('year, month, day, hour, latitude and longitude are required');
  }
  const utcHour = hour + (minute / 60) + (second / 3600) - (utcOffsetMinutes / 60);
  const jd = julianDay(year, month, day, utcHour);
  const siderealMode = SiderealMode[ayanamsa];
  if (siderealMode === undefined) throw new RangeError(`Unsupported ayanamsa: ${ayanamsa}`);
  const system = HouseSystem[houseSystem];
  if (system === undefined) throw new RangeError(`Unsupported house system: ${houseSystem}`);
  setSiderealMode(siderealMode);
  const flags = CalculationFlag.SwissEphemeris | CalculationFlag.Speed | CalculationFlag.Sidereal;
  const positions = Object.fromEntries(PLANETS.map(([name, body]) => [name, calculatePosition(jd, body, flags)]));
  const houses = calculateHouses(jd, latitude, longitude, system);
  return {
    engine: '@swisseph/node',
    engineVersion: packageMetadata.version,
    julianDay: jd,
    input: { year, month, day, hour, minute, second, latitude, longitude, utcOffsetMinutes },
    ayanamsa,
    houseSystem,
    positions,
    houses,
  };
}

module.exports = { calculateChart };
