const {
  julianDay,
  calculatePosition,
  calculateHouses,
  setSiderealMode,
  getAyanamsa,
  Planet,
  HouseSystem,
  SiderealMode,
  CalculationFlag,
} = require('@swisseph/node');

const norm360 = (deg) => ((deg % 360) + 360) % 360;

/**
 * `@swisseph/node`'s `calculateHouses` wraps `swe_houses()`, which has no
 * flags parameter and therefore always returns TROPICAL cusps/angles —
 * it does not honour the ambient `swe_set_sid_mode`. Swiss Ephemeris's
 * documented manual equivalent of `swe_houses_ex(..., SEFLG_SIDEREAL)` is
 * to subtract the ayanamsha (from `swe_get_ayanamsa_ut`, which does honour
 * the sidereal mode) from every angle and cusp. Without this the Lagna and
 * all Bhava placements come out ~24 degrees adrift of the sidereal grahas.
 */
function siderealizeHouses(houses, jd) {
  const ayanamsa = getAyanamsa(jd);
  const shift = (deg) => norm360(deg - ayanamsa);
  const cusps = houses.cusps.map((c, i) => (i === 0 ? c : shift(c))); // cusps is 1-indexed; [0] is unused
  return {
    ...houses,
    ayanamsaApplied: ayanamsa,
    cusps,
    ascendant: shift(houses.ascendant),
    mc: shift(houses.mc),
    armc: houses.armc, // sidereal-time value, not an ecliptic longitude — left as-is
  };
}
// Read @swisseph/node's own version for display purposes only. Avoids
// require.resolve('@swisseph/node') (it does not reliably return a real
// filesystem path when a bundler, e.g. a Next.js Server Action build,
// treats the package as an external module) by locating node_modules
// relative to this file's own __dirname instead, which bundlers preserve.
// Never worth crashing chart calculation over a version string, so this
// falls back to 'unknown' rather than throwing.
//
// Next.js bundles this module, and inside the bundle `__dirname` is a
// placeholder rather than the source tree — so the lone `__dirname` path this
// used to take resolved to nothing, and every chart computed through a page
// reported its engine version as "unknown". That is the third place this trap
// has been found, after `chartSnapshot.engineVersion` and `citationScan`, so
// the candidates are ordered the same way: the server process runs from the
// project root, which is where node_modules is, and `__dirname` is kept last
// for plain Node, where it is correct.
function readSwissephVersion() {
  const fs = require('node:fs');
  const path = require('node:path');
  const candidates = [];
  try {
    const entry = require.resolve('@swisseph/node');
    let dir = path.dirname(entry);
    for (let i = 0; i < 4; i += 1) {
      candidates.push(path.join(dir, 'package.json'));
      dir = path.dirname(dir);
    }
  } catch { /* fall through to the path guesses */ }
  candidates.push(path.join(process.cwd(), 'node_modules', '@swisseph', 'node', 'package.json'));
  candidates.push(path.join(__dirname, '..', '..', 'node_modules', '@swisseph', 'node', 'package.json'));

  for (const candidate of candidates) {
    try {
      const pkg = JSON.parse(fs.readFileSync(candidate, 'utf8'));
      if (pkg.name === '@swisseph/node' && pkg.version) return pkg.version;
    } catch { /* try the next candidate */ }
  }
  return 'unknown';
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
  const houses = siderealizeHouses(calculateHouses(jd, latitude, longitude, system), jd);
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

/**
 * Sidereal Ascendant (Lagna longitude) for a raw Julian Day — used by
 * time-slot calculations (Gulika/Mandi and other kāla-based upagrahas) that
 * need the rising sign at instants between sunrise and sunset rather than a
 * full chart. Same tropical→sidereal correction as `siderealizeHouses`.
 */
function siderealAscendant(jd, latitude, longitude, ayanamsa = 'Lahiri') {
  const siderealMode = SiderealMode[ayanamsa];
  if (siderealMode === undefined) throw new RangeError(`Unsupported ayanamsa: ${ayanamsa}`);
  setSiderealMode(siderealMode);
  const houses = calculateHouses(jd, latitude, longitude, HouseSystem.Porphyrius);
  return norm360(houses.ascendant - getAyanamsa(jd));
}

module.exports = { calculateChart, siderealAscendant };
