const { calculateChart } = require('../ephemeris/swissEphemeris');
const { createBirthProfile } = require('../contracts/birthProfile');
const { calculateParashariChart, rasiFromLongitude } = require('../chart/parashariChart');
const { sunriseJulianDay } = require('../ephemeris/siderealPositions');
const { julianDay: sweJulianDay } = require('@swisseph/node');
const { buildVimshottariDasha } = require('../dasha/vimshottariDasha');
const { calculateVargas } = require('../chart/vargaChart');
const { calculateAshtakavarga } = require('../chart/ashtakavarga');
const { calculateTransitContext } = require('../chart/ashtakavargaTransit');
const { calculateShadbala } = require('../chart/shadbala');
const { calculateNabhasaYogas } = require('../chart/nabhasaYoga');
const { calculateKarakas } = require('../chart/karaka');
const { calculateBhavaBala } = require('../chart/bhavaBala');
const { calculateRajaYogas } = require('../chart/rajaYogas');
const { calculateDoshas } = require('../chart/doshas');
const { calculateLunarSolarYogas } = require('../chart/lunarSolarYogas');
const { calculateWealthYogas } = require('../chart/wealthYogas');
const { calculateEdgeCaseYogas } = require('../chart/edgeCaseYogas');
const { calculateUpagrahas } = require('./upagraha');
const { calculateNumerology } = require('./numerology');
const { calculateNadiCombinations } = require('./nadiCombinations');
const { calculateBhriguProgressions } = require('./bhriguProgressions');
const { calculateKpSystem } = require('./kpSystem');
const { buildYoginiDasha, buildAshtottariDasha } = require('../dasha/altDashas');
const { calculateKpEvents } = require('./kpEvents');
const { calculateJaimini } = require('./jaimini');
const { calculateAvasthas } = require('./avasthas');
const { calculateNakshatraExtras } = require('./nakshatraExtras');
const { calculateAshtakavargaShodhana } = require('./ashtakavargaShodhana');
const { computeGocharaPhala } = require('./gocharaPhala');
const { computeTransitPositions } = require('./transitPositions');

const ALL_GRAHAS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

const CLASSICAL_GRAHAS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

function normalizeDegrees(deg) {
  return ((deg % 360) + 360) % 360;
}

// Helper: Convert Parashari chart format to yogas/doshas calculator format
function buildYogasDoshasChart(chart, rasiPositions) {
  const houses = {};
  for (let h = 1; h <= 12; h++) {
    houses[h] = [];
  }

  // Assign each planet to its house
  for (const planet of CLASSICAL_GRAHAS) {
    if (chart.grahas[planet]) {
      const house = chart.grahas[planet].house;
      if (house >= 1 && house <= 12) {
        houses[house].push(planet);
      }
    }
  }

  // Build planetPositions (0-360 degrees)
  const planetPositions = Object.fromEntries(
    CLASSICAL_GRAHAS.map(planet => [planet, chart.grahas[planet].longitude % 360])
  );

  // Build planets object for edge-case and specialized yogas
  const planets = Object.fromEntries(
    CLASSICAL_GRAHAS.map(planet => [planet, { longitude: chart.grahas[planet].longitude % 360 }])
  );

  return { houses, planetPositions, lagna: chart.lagna, planets };
}

/** Current (transit-moment) rasi for each classical graha — location only
 * matters here in that different observers see negligibly different
 * geocentric longitudes, so the birth place is reused rather than adding a
 * separate "current location" input. */
function currentTransitRasiPositions(latitude, longitude, ayanamsha = 'Lahiri') {
  const now = new Date();
  const chart = calculateChart({
    year: now.getUTCFullYear(),
    month: now.getUTCMonth() + 1,
    day: now.getUTCDate(),
    hour: now.getUTCHours(),
    minute: now.getUTCMinutes(),
    second: now.getUTCSeconds(),
    latitude,
    longitude,
    utcOffsetMinutes: 0,
    ayanamsa: ayanamsha,
  });
  return Object.fromEntries(
    Object.entries(chart.positions).map(([planet, position]) => [
      planet, rasiFromLongitude(position.longitude).rasiIndex,
    ]),
  );
}

/**
 * S12 — Report builder data (WORKFLOW-REGISTER-001 S12; PLAN-001 item 13).
 * Orchestrates the calculators already built in S6-S11 into one call per
 * birth profile, producing the section-by-section data a report UI selects
 * from. This module adds no new astrological rule of its own — every value
 * here, including every `SOURCE_REQUIRED` refusal, comes straight from the
 * calculator that already owns it; a report can only show what those
 * calculators are honestly able to compute.
 */
function buildReportData(birthInput) {
  const profile = createBirthProfile(birthInput);
  const chart = calculateParashariChart(profile.chartContext);

  const longitudes = Object.fromEntries(
    CLASSICAL_GRAHAS.map((planet) => [planet, chart.grahas[planet].longitude]),
  );
  const rasiPositions = {
    ...Object.fromEntries(CLASSICAL_GRAHAS.map((planet) => [planet, chart.grahas[planet].rasiIndex])),
    Lagna: chart.lagna.rasiIndex,
  };
  const isWaxingMoon = normalizeDegrees(longitudes.Moon - longitudes.Sun) <= 180;

  const dasha = buildVimshottariDasha(
    chart.julianDay,
    longitudes.Moon,
    profile.chartContext.input.utcOffsetMinutes,
    { depth: 2 },
  );

  const vargas = {
    Lagna: calculateVargas(chart.lagna.rasiIndex, chart.lagna.degreeInSign),
    ...Object.fromEntries(CLASSICAL_GRAHAS.map((planet) => [
      planet,
      calculateVargas(chart.grahas[planet].rasiIndex, chart.grahas[planet].degreeInSign),
    ])),
  };

  const ashtakavarga = calculateAshtakavarga(rasiPositions);
  const ashtakavargaShodhana = calculateAshtakavargaShodhana(ashtakavarga.bhinna, rasiPositions);

  const shadbala = calculateShadbala({
    longitudes,
    lagnaRasiIndex: chart.lagna.rasiIndex,
    ascendant: chart.lagna.longitude,
    mc: chart.mc,
    birthJd: chart.julianDay,
    latitude: profile.chartContext.input.latitude,
    longitude: profile.chartContext.input.longitude,
    year: profile.chartContext.input.year,
    month: profile.chartContext.input.month,
    day: profile.chartContext.input.day,
    utcOffsetMinutes: profile.chartContext.input.utcOffsetMinutes,
  });

  const nabhasaYoga = calculateNabhasaYogas(rasiPositions, { isWaxingMoon });
  const karaka = calculateKarakas(chart.lagna.rasiIndex);

  const upagraha = calculateUpagrahas({
    sunLongitude: chart.grahas.Sun.longitude,
    birthJd: chart.julianDay,
    year: profile.chartContext.input.year,
    month: profile.chartContext.input.month,
    day: profile.chartContext.input.day,
    utcOffsetMinutes: profile.chartContext.input.utcOffsetMinutes,
    latitude: profile.chartContext.input.latitude,
    longitude: profile.chartContext.input.longitude,
    ayanamsha: profile.chartContext.ayanamsha,
  });

  const numerology = calculateNumerology({
    name: profile.name,
    year: profile.chartContext.input.year,
    month: profile.chartContext.input.month,
    day: profile.chartContext.input.day,
  });

  const nadi = calculateNadiCombinations(profile.chartContext.input, {
    ayanamsha: profile.chartContext.ayanamsha,
    nodeType: profile.chartContext.nodeType,
  });

  const nowJd = Date.now() / 86400000 + 2440587.5;
  const runningMaha = dasha.dashas.find((d) => nowJd >= d.startJulianDay && nowJd < d.endJulianDay);
  const bhriguProgressions = calculateBhriguProgressions({
    grahas: ALL_GRAHAS.map((id) => ({
      id, sign: chart.grahas[id].rasiIndex, longitude: chart.grahas[id].longitude,
    })),
    birthISO: `${profile.chartContext.input.year}-${String(profile.chartContext.input.month).padStart(2, '0')}-${String(profile.chartContext.input.day).padStart(2, '0')}`,
    mahadashaLord: runningMaha ? runningMaha.lord : null,
  });

  const bi = profile.chartContext.input;
  const birthMs = Date.UTC(bi.year, bi.month - 1, bi.day, bi.hour, bi.minute || 0, bi.second || 0) - (bi.utcOffsetMinutes || 0) * 60000;

  const kp = calculateKpSystem(profile.chartContext.input, { nodeType: profile.chartContext.nodeType });
  const kpEvents = calculateKpEvents(kp);

  const _jdMidnightUt = sweJulianDay(bi.year, bi.month, bi.day, -(bi.utcOffsetMinutes || 0) / 60);
  const _sunriseJd = sunriseJulianDay(_jdMidnightUt, bi.latitude, bi.longitude);
  const _ghatisSinceSunrise = ((chart.julianDay - _sunriseJd) * 24 * 60) / 24; // ghatis (1 = 24 min); may be negative for pre-sunrise births
  const avasthas = calculateAvasthas(
    Object.fromEntries(CLASSICAL_GRAHAS.map((id) => [id, chart.grahas[id].longitude])),
    {
      moonNakSerial: Math.floor(((chart.grahas.Moon.longitude % 360) + 360) % 360 / (360 / 27)) + 1,
      ghatisSinceSunrise: ((_ghatisSinceSunrise % 60) + 60) % 60,
      lagnaRasi0: chart.lagna.rasiIndex,
    },
  );

  const _nowT = new Date();
  const _transitChart = calculateChart({
    year: _nowT.getUTCFullYear(), month: _nowT.getUTCMonth() + 1, day: _nowT.getUTCDate(),
    hour: _nowT.getUTCHours(), minute: _nowT.getUTCMinutes(), second: _nowT.getUTCSeconds(),
    latitude: profile.chartContext.input.latitude, longitude: profile.chartContext.input.longitude,
    utcOffsetMinutes: 0, ayanamsa: profile.chartContext.ayanamsha,
  });
  const nakshatraExtras = calculateNakshatraExtras(
    chart.grahas.Moon.longitude,
    _transitChart.positions.Moon.longitude,
    Object.fromEntries(ALL_GRAHAS.map((id) => [id, chart.grahas[id].longitude])),
  );

  const _tp = computeTransitPositions(new Date(), {
    latitude: profile.chartContext.input.latitude,
    longitude: profile.chartContext.input.longitude,
    ayanamsha: profile.chartContext.ayanamsha,
    nodeType: profile.chartContext.nodeType,
  });
  const _transitRasiByGraha = Object.fromEntries(
    _tp.planets.map((p) => [p.planet, Math.floor(((p.longitude % 360) + 360) % 360 / 30)]),
  );
  const gocharaPhala = {
    available: true,
    moonRasi: chart.grahas.Moon.rasi,
    rows: computeGocharaPhala(chart.grahas.Moon.rasiIndex, _transitRasiByGraha),
  };

  const jaimini = calculateJaimini({
    lagnaLongitude: chart.lagna.longitude,
    grahaLongitudes: Object.fromEntries(
      ALL_GRAHAS.map((id) => [id, chart.grahas[id].longitude]),
    ),
    birthMs,
  });

  const altDashas = {
    yogini: buildYoginiDasha(longitudes.Moon, birthMs),
    ashtottari: buildAshtottariDasha(longitudes.Moon, birthMs),
  };

  const transitRasiPositions = currentTransitRasiPositions(
    profile.chartContext.input.latitude,
    profile.chartContext.input.longitude,
    profile.chartContext.ayanamsha,
  );
  const transit = calculateTransitContext(transitRasiPositions, ashtakavarga);
  const bhavaBala = calculateBhavaBala(chart.lagna.rasiIndex, rasiPositions, ashtakavarga);

  // S11-A: Raja Yogas (22 formations)
  const yogaChartContext = buildYogasDoshasChart(chart, rasiPositions);
  const rajaYogas = calculateRajaYogas(yogaChartContext);

  // S11-B: Doshas/Curses (8 formations)
  const doshas = calculateDoshas(yogaChartContext);

  // S11-C: Lunar/Solar/Pancha Maha Purusha (14 formations)
  const lunarSolarYogas = calculateLunarSolarYogas(yogaChartContext);

  // S11-C Phase 3.2A: Wealth Yogas (15 formations)
  const wealthYogas = calculateWealthYogas(yogaChartContext);

  // S11-C Phase 3.2C: Edge-Case Yogas (8 formations)
  const edgeCaseYogas = calculateEdgeCaseYogas(yogaChartContext);

  return {
    profile: { name: profile.name, gender: profile.gender, chartId: profile.chartId },
    input: profile.chartContext.input,
    chart,
    dasha,
    vargas,
    ashtakavarga,
    ashtakavargaShodhana,
    gocharaPhala,
    transit,
    shadbala,
    bhavaBala,
    nabhasaYoga,
    karaka,
    upagraha,
    numerology,
    nadi,
    bhriguProgressions,
    kp,
    kpEvents,
    jaimini,
    avasthas,
    nakshatraExtras,
    altDashas,
    rajaYogas,
    doshas,
    lunarSolarYogas,
    wealthYogas,
    edgeCaseYogas,
  };
}

module.exports = { buildReportData, CLASSICAL_GRAHAS };
