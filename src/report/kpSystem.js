/**
 * Krishnamurti Paddhati (KP) core — sub-lord chains, cuspal / planetary
 * significators, Ruling Planets and Badhaka/Maraka.
 *
 * Ported from the prior "kp-muhurat-workspace" Python engine
 * (`kp_muhurat/engine.py`: kp_sub_lord, house_cusps, obstruction_houses,
 * ruling_planets, house_for_longitude, significator_breakdown) and the
 * kottravel-Nadi `kpLords` 5-level chain. Both are pure Vimshottari-
 * proportional subdivisions of the 13°20′ nakshatra — standard KP.
 *
 * KP practice casts on the Krishnamurti (KP) ayanamsha with Placidus cusps;
 * this module always uses Krishnamurti + Placidus regardless of the report's
 * own ayanamsha / house-system choice, and says so in the output.
 */
const { calculateChart } = require('../ephemeris/swissEphemeris');
const { nodeLongitude } = require('../ephemeris/siderealPositions');
const { kpLords } = require('./nadiCombinations');

const norm = (n) => ((n % 360) + 360) % 360;

const SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const SIGN_LORDS = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'];
const MODALITY = ['Movable', 'Fixed', 'Dual', 'Movable', 'Fixed', 'Dual', 'Movable', 'Fixed', 'Dual', 'Movable', 'Fixed', 'Dual'];
const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu',
  'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta',
  'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha',
  'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha', 'Purva Bhadrapada',
  'Uttara Bhadrapada', 'Revati',
];
// Python's date.weekday(): Mon=0..Sun=6 -> weekday lord.
const WEEKDAY_LORDS = ['Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Sun'];
const NADI_PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

/** Full KP chain for a longitude: nakshatra + pada + 5 lords + nak progress. */
function kpChain(longitude) {
  const lon = norm(longitude);
  const nakSpan = 360 / 27;
  const nakIndex = Math.min(Math.floor(lon / nakSpan), 26);
  const within = lon - nakIndex * nakSpan;
  const [signLord, starLord, sub, subSub, subSubSub] = kpLords(lon);
  return {
    longitude: lon,
    sign: SIGNS[Math.floor(lon / 30)],
    degreeInSign: lon - Math.floor(lon / 30) * 30,
    nakshatra: NAKSHATRAS[nakIndex],
    pada: Math.floor(within / (nakSpan / 4)) + 1,
    nakProgress: Math.round((within / nakSpan) * 1000) / 1000,
    signLord, starLord, sub, subSub, subSubSub,
  };
}

/** Which Placidus house arc a longitude falls in (1-12). */
function houseForLongitude(longitude, cusps) {
  const lon = norm(longitude);
  for (let i = 0; i < 12; i += 1) {
    const span = norm(cusps[(i + 1) % 12].longitude - cusps[i].longitude);
    const offset = norm(lon - cusps[i].longitude);
    if (offset < span) return i + 1;
  }
  return 12;
}

function obstructionHouses(cusps) {
  const ascSignIndex = Math.floor(norm(cusps[0].longitude) / 30);
  const modality = MODALITY[ascSignIndex];
  const badhaka = { Movable: 11, Fixed: 9, Dual: 7 }[modality];
  return { ascendantSign: SIGNS[ascSignIndex], modality, badhaka, maraka: [2, 7] };
}

function rulingPlanets(weekdayPython, moon, ascCusp) {
  const factors = [
    ['Day Lord', WEEKDAY_LORDS[weekdayPython]],
    ['Moon Sign Lord', SIGN_LORDS[Math.floor(norm(moon.longitude) / 30)]],
    ['Moon Star Lord', moon.starLord],
    ['Asc Sign Lord', SIGN_LORDS[Math.floor(norm(ascCusp.longitude) / 30)]],
    ['Asc Star Lord', ascCusp.starLord],
  ];
  const seen = new Set();
  const unique = [];
  for (const [, lord] of factors) if (!seen.has(lord)) { seen.add(lord); unique.push(lord); }
  return { factors, unique };
}

/** Per object: occupied house, owned houses, plus its star lord's occupancy/ownership. */
function significatorBreakdown(positions, cusps) {
  const byName = Object.fromEntries(positions.map((p) => [p.name, p]));
  const direct = (name) => {
    const p = byName[name];
    if (!p) return { occupied: null, owned: [] };
    const occupied = houseForLongitude(p.longitude, cusps);
    const owned = cusps
      .filter((c) => SIGN_LORDS[Math.floor(norm(c.longitude) / 30)] === name)
      .map((c) => c.number);
    return { occupied, owned };
  };
  return positions.map((p) => {
    const self = direct(p.name);
    const star = direct(p.starLord);
    const total = [...new Set([self.occupied, ...self.owned, star.occupied, ...star.owned].filter((x) => x != null))].sort((a, b) => a - b);
    return {
      name: p.name,
      occupied: self.occupied,
      owned: self.owned,
      starLord: p.starLord,
      starOccupied: star.occupied,
      starOwned: star.owned,
      total,
    };
  });
}

/**
 * @param birthInput  the governed chart-context input (year..utcOffsetMinutes, lat, lng)
 * @param nodeType    'mean' | 'true'
 */
function calculateKpSystem(birthInput, { nodeType = 'mean' } = {}) {
  const chart = calculateChart({ ...birthInput, ayanamsa: 'Krishnamurti', houseSystem: 'Placidus' });

  const positions = [];
  for (const id of ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']) {
    const p = chart.positions[id];
    positions.push({ name: id, ...kpChain(p.longitude), speed: p.longitudeSpeed, retrograde: p.longitudeSpeed < 0 });
  }
  const rahuLon = nodeLongitude(chart.julianDay, 'Krishnamurti', nodeType);
  positions.push({ name: 'Rahu', ...kpChain(rahuLon), speed: -0.053, retrograde: true });
  positions.push({ name: 'Ketu', ...kpChain(rahuLon + 180), speed: -0.053, retrograde: true });

  const cuspsRaw = chart.houses.cusps; // 1-indexed sidereal
  const cusps = Array.from({ length: 12 }, (_, i) => ({ number: i + 1, ...kpChain(cuspsRaw[i + 1]) }));

  // assign each object its Placidus house
  for (const p of positions) p.house = houseForLongitude(p.longitude, cusps);

  const { year, month, day } = birthInput;
  const jsDay = new Date(Date.UTC(year, month - 1, day)).getUTCDay(); // 0 = Sun
  const weekdayPython = (jsDay + 6) % 7; // 0 = Mon

  const moon = positions.find((p) => p.name === 'Moon');

  return {
    available: true,
    ayanamsha: 'Krishnamurti',
    houseSystem: 'Placidus',
    ascendant: norm(chart.houses.ascendant),
    positions: positions.map((p) => ({
      name: p.name, longitude: p.longitude, sign: p.sign, degreeInSign: p.degreeInSign,
      nakshatra: p.nakshatra, pada: p.pada, house: p.house, retrograde: p.retrograde,
      signLord: p.signLord, starLord: p.starLord, sub: p.sub, subSub: p.subSub, subSubSub: p.subSubSub,
    })),
    cusps: cusps.map((c) => ({
      number: c.number, longitude: c.longitude, sign: c.sign, degreeInSign: c.degreeInSign,
      nakshatra: c.nakshatra, signLord: c.signLord, starLord: c.starLord, sub: c.sub, subSub: c.subSub,
    })),
    obstruction: obstructionHouses(cusps),
    rulingPlanets: rulingPlanets(weekdayPython, moon, cusps[0]),
    significators: significatorBreakdown(positions, cusps),
  };
}

module.exports = {
  calculateKpSystem, kpChain, houseForLongitude, obstructionHouses,
  rulingPlanets, significatorBreakdown,
};
