/**
 * Varshaphala (வருஷபலன்) — Tajika annual / solar-return chart.
 *
 * Casts a full Parashari chart for the instant the transiting Sun returns to
 * its natal SIDEREAL longitude in a given year, at the birthplace. Adds:
 *   - Muntha (progressed Lagna: natal Lagna rasi + 1 rasi per elapsed year)
 *   - Muntha lord (rasi lord of the Muntha sign)
 *   - Varshesha / year lord — the 5 classical Panchadhikari candidates
 *     (BPHS / Tajaka Neelakanteeyam ch.4): (1) Varsha-Lagna lord,
 *     (2) natal Lagna lord, (3) Muntha lord, (4) day-birth → Sun's-varsha-
 *     rasi lord / night-birth → Moon's-varsha-rasi lord, (5) lord of the
 *     Varsha Moon's rasi — the candidate that fills the most roles wins,
 *     Varsha-Lagna lord breaking ties.  (Full Pancha-Vargeeya-Bala +
 *     Tajika-aspect selection is not implemented; this is the common
 *     "most-roles" simplification.)
 *   - Patyayini / Mudda dasha — the varsha chart's own annual dasha, from
 *     Tajaka Neelakanteeyam ch.5: 8 candidates (Varsha Lagna + Sun..Saturn),
 *     ordered by degree-within-own-rasi (Rekhamsam); Pathiyamsam = gap to
 *     the previous candidate's Rekhamsam; days = Pathiyamsam × 365.25 / Σ.
 *
 * Positions come from the same `@swisseph/node` pipeline as the natal chart.
 */
const { calculateChart } = require('../ephemeris/swissEphemeris');
const { calculateParashariChart, rasiFromLongitude } = require('../chart/parashariChart');
const { calculateSahams } = require('./sahams');
const { calculateTajikaYogas, calculateExtendedTajikaYogas } = require('./tajikaYogas');
const { panchaVargeeyaBala, tajikaAspectOnPoint } = require('./panchaVargeeyaBala');

// Mesha..Meena rasi lords
const RASI_LORDS = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'];
const RASI_NAMES = ['Mesha', 'Vrishabha', 'Mithuna', 'Karkataka', 'Simha', 'Kanya', 'Tula', 'Vrischika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'];
const PATYAYINI_CANDIDATES = ['Lagna', 'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

// Trirasi Chakra day/night lords per Varsha-Lagna rasi (Mesha..Meena) — Tajaka
// Neelakanteeyam திரராசிச் சக்கரம் p.56-57. Signs 9-12 (Dhanu..Meena) are
// day/night-invariant (Saturn, Mars, Jupiter, Moon). Cross-checked against
// "Integrated Approach" Table 73 (11/12 match; Karkataka day lord differs —
// kept as Moon per the Tamil source's running prose).
const TRIRASI_DAY_LORDS   = ['Sun', 'Venus', 'Saturn', 'Moon', 'Jupiter', 'Moon', 'Mercury', 'Mars', 'Saturn', 'Mars', 'Jupiter', 'Moon'];
const TRIRASI_NIGHT_LORDS = ['Jupiter', 'Moon', 'Mercury', 'Mars', 'Sun', 'Venus', 'Saturn', 'Venus', 'Saturn', 'Mars', 'Jupiter', 'Moon'];

function norm360(x) { return ((x % 360) + 360) % 360; }
function wrappedDiff(a, b) { return (((a - b + 180) % 360) + 360) % 360 - 180; }

/** Sun's sidereal longitude at a UTC instant (ms since epoch). Geocentric — place doesn't matter. */
function sunSiderealLon(utcMs) {
  const d = new Date(utcMs);
  const c = calculateChart({
    year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate(),
    hour: d.getUTCHours(), minute: d.getUTCMinutes(), second: d.getUTCSeconds(),
    latitude: 0, longitude: 0, utcOffsetMinutes: 0,
  });
  return norm360(c.positions.Sun.longitude);
}

/** Bisection for the UTC ms when the Sun's sidereal longitude === natalSunLon, ~yearsElapsed sidereal years after birth. */
function findSolarReturnUtcMs(natalSunLon, birthUtcMs, yearsElapsed) {
  const guess = birthUtcMs + yearsElapsed * 365.25636 * 86400000; // sidereal year
  let lo = guess - 6 * 86400000;
  let hi = guess + 6 * 86400000;
  const f = (ms) => wrappedDiff(sunSiderealLon(ms), natalSunLon);
  if (f(lo) > 0) lo -= 12 * 86400000;
  if (f(hi) < 0) hi += 12 * 86400000;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (f(mid) < 0) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

function fmtIst(ms) {
  const d = new Date(ms + 330 * 60000);
  const p = (n) => String(n).padStart(2, '0');
  return {
    date: `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())}`,
    time: `${p(d.getUTCHours())}:${p(d.getUTCMinutes())}`,
  };
}

/**
 * Patyayini (Mudda) dasha for the varsha chart.
 * @param {{lagnaLon:number, planetLons:Record<string,number>}} v
 * @param {number} startMs solar-return instant
 */
function calculatePatyayiniDasha(v, startMs) {
  const rekha = (lon) => norm360(lon) % 30;
  const cands = [
    { lord: 'Lagna', rekhamsam: rekha(v.lagnaLon) },
    ...['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']
      .map((p) => ({ lord: p, rekhamsam: rekha(v.planetLons[p]) })),
  ].sort((a, b) => a.rekhamsam - b.rekhamsam);

  const pathiyamsam = cands.map((c, i) => (i === 0 ? c.rekhamsam : c.rekhamsam - cands[i - 1].rekhamsam));
  const total = pathiyamsam.reduce((s, x) => s + x, 0) || 1;
  const days = pathiyamsam.map((p) => (p * 365.25) / total);

  let cursor = startMs;
  return cands.map((c, i) => {
    const startMsX = cursor;
    const endMsX = startMsX + days[i] * 86400000;
    cursor = endMsX;
    return {
      lord: c.lord,
      days: Math.round(days[i] * 10) / 10,
      start: fmtIst(startMsX).date,
      end: fmtIst(endMsX).date,
    };
  });
}

/**
 * @param {object} birthInput BirthFormInput (year..minute, latitude, longitude, utcOffsetMinutes, ...)
 * @param {number} age completed years since birth (>=1)
 */
function calculateVarshaphala(birthInput, age) {
  const yearsElapsed = Math.max(1, Math.floor(age));

  // Natal chart → natal Sun sidereal longitude + natal Lagna rasi
  const natalCtx = { input: birthInput, ayanamsha: 'Lahiri', houseSystem: 'Placidus' };
  const natal = calculateParashariChart(natalCtx);
  const natalSunLon = natal.grahas.Sun.longitude;
  const natalMoonRasi0 = natal.grahas.Moon.rasiIndex;
  const natalLagnaRasi0 = natal.lagna.rasiIndex;

  const birthUtcMs = Date.UTC(
    birthInput.year, birthInput.month - 1, birthInput.day,
    birthInput.hour, birthInput.minute || 0, 0,
  ) - (birthInput.utcOffsetMinutes || 0) * 60000;

  const returnUtcMs = findSolarReturnUtcMs(natalSunLon, birthUtcMs, yearsElapsed);
  const ist = fmtIst(returnUtcMs);

  // Varsha chart: same place, the solar-return date/time (given in IST → convert back with the birth offset)
  const varshaInput = {
    ...birthInput,
    year: Number(ist.date.slice(0, 4)),
    month: Number(ist.date.slice(5, 7)),
    day: Number(ist.date.slice(8, 10)),
    hour: Number(ist.time.slice(0, 2)),
    minute: Number(ist.time.slice(3, 5)),
    utcOffsetMinutes: 330, // fmtIst produced an IST wall-clock time
  };
  const varsha = calculateParashariChart({ input: varshaInput, ayanamsha: 'Lahiri', houseSystem: 'Placidus' });

  const varshaLagnaRasi0 = varsha.lagna.rasiIndex;
  const varshaSunRasi0 = varsha.grahas.Sun.rasiIndex;
  const varshaMoonRasi0 = varsha.grahas.Moon.rasiIndex;

  // Muntha
  const munthaRasi0 = (natalLagnaRasi0 + yearsElapsed) % 12;
  const munthaLord = RASI_LORDS[munthaRasi0];

  // Day/night at the solar return (Sun above horizon ≈ 6:00–18:00 local as a cheap proxy)
  const localHour = Number(ist.time.slice(0, 2)) + Number(ist.time.slice(3, 5)) / 60
    + (birthInput.longitude - 82.5) / 15; // rough LMT correction from IST meridian
  const daytime = localHour >= 6 && localHour < 18;

  // ── Varshesha (year lord) — classical Panchadhikari + PVB selection ────────
  // 5 candidates per Tajaka Neelakanteeyam ch.4/10.
  const trirasiLord = (daytime ? TRIRASI_DAY_LORDS : TRIRASI_NIGHT_LORDS)[varshaLagnaRasi0];
  const roleLabels = ['varshaLagnaLord', 'natalLagnaLord', 'trirasiLord', 'munthaLord', 'luminaryRasiLord'];
  const roles = [
    RASI_LORDS[varshaLagnaRasi0],                            // 1 Varsha-Lagna lord
    RASI_LORDS[natalLagnaRasi0],                             // 2 natal Lagna lord
    trirasiLord,                                             // 3 Trirasi lord of the Varsha Lagna's rasi
    munthaLord,                                              // 4 Muntha-rasi lord
    RASI_LORDS[daytime ? varshaSunRasi0 : varshaMoonRasi0],  // 5 day→Sun's rasi lord / night→Moon's
  ];
  const roleCount = new Map();
  roles.forEach((r) => roleCount.set(r, (roleCount.get(r) || 0) + 1));
  const uniqueCandidates = [...new Set(roles)]; // candidates[0] === Varsha-Lagna lord (Set keeps first-seen order)

  const SEVEN = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  const planetLons = Object.fromEntries(SEVEN.map((p) => [p, varsha.grahas[p].longitude]));

  // Selection per "Vedic Astrology: An Integrated Approach" ch.28.6 (p.336):
  // (1) short-list candidates with a BENEFIC Tajika aspect on the Varsha Lagna;
  // (2) among those, highest Pancha-Vargeeya-Bala; (3) tie → fills more of the
  // 5 roles; (4) fall back to malefic-aspect, then any-aspect, then all
  // candidates by PVB alone; (5) final tie → Varsha-Lagna lord (candidates[0]).
  const candLon = (p) => planetLons[p] ?? 0;
  const pickBest = (pool) => pool.reduce((best, p) => {
    const bp = panchaVargeeyaBala(p, candLon(p));
    const bb = panchaVargeeyaBala(best, candLon(best));
    if (bp !== bb) return bp > bb ? p : best;
    return (roleCount.get(p) || 0) > (roleCount.get(best) || 0) ? p : best;
  }, pool[0]);
  const aspectOf = (p) => tajikaAspectOnPoint(p, candLon(p), varsha.lagna.longitude);
  const withBenefic = uniqueCandidates.filter((p) => aspectOf(p) === 'benefic');
  const withMalefic = uniqueCandidates.filter((p) => aspectOf(p) === 'malefic');
  const withAny = uniqueCandidates.filter((p) => aspectOf(p) !== null);
  const varsheshaTier = withBenefic.length ? 'benefic aspect + highest PVB'
    : withMalefic.length ? 'malefic aspect + highest PVB (no benefic-aspect candidate)'
    : withAny.length ? 'any aspect + highest PVB (no benefic/malefic-aspect candidate)'
    : 'highest PVB alone (no candidate aspects the Varsha Lagna)';
  const varshesha = withBenefic.length ? pickBest(withBenefic)
    : withMalefic.length ? pickBest(withMalefic)
    : withAny.length ? pickBest(withAny)
    : pickBest(uniqueCandidates);
  const patyayiniDasha = calculatePatyayiniDasha(
    { lagnaLon: varsha.lagna.longitude, planetLons },
    returnUtcMs,
  );

  // Retrograde flags at the Varsha Pravesha (needed for Ithāsāla direction)
  const varshaRaw = calculateChart({ ...varshaInput, ayanamsa: 'Lahiri', houseSystem: 'Placidus' });
  const retro = Object.fromEntries(SEVEN.map((p) => [p, (varshaRaw.positions[p]?.longitudeSpeed ?? 0) < 0]));

  const grahaRasi0 = Object.fromEntries(SEVEN.map((p) => [p, varsha.grahas[p].rasiIndex]));
  const sahams = calculateSahams({
    lagnaLon: varsha.lagna.longitude,
    lagnaRasi0: varshaLagnaRasi0,
    cusps: varsha.cusps,
    grahaLon: planetLons,
    grahaRasi0,
    isDayBirth: daytime,
  });
  const tajikaYogas = calculateTajikaYogas({ grahaLon: planetLons, retro });
  const extendedTajikaYogas = calculateExtendedTajikaYogas({
    grahaLon: planetLons, grahaRasi0, retro, lagnaRasi0: varshaLagnaRasi0,
  });

  return {
    yearsElapsed,
    solarReturn: { date: ist.date, time: ist.time },
    natal: {
      sunLongitude: Math.round(natalSunLon * 100) / 100,
      lagnaRasi: RASI_NAMES[natalLagnaRasi0],
      moonRasi: RASI_NAMES[natalMoonRasi0],
    },
    varshaChart: varsha, // full Parashari chart — wrap as { chart: varshaChart } for RasiChartRenderer
    muntha: {
      rasiIndex: munthaRasi0,
      rasi: RASI_NAMES[munthaRasi0],
      lord: munthaLord,
      house: ((munthaRasi0 - varshaLagnaRasi0 + 12) % 12) + 1,
    },
    varshesha,
    varsheshaSelection: {
      tier: varsheshaTier,
      candidates: uniqueCandidates.map((p) => ({
        planet: p,
        roles: roleLabels.filter((_, i) => roles[i] === p),
        pvb: panchaVargeeyaBala(p, planetLons[p] ?? 0),
        lagnaAspect: aspectOf(p),
      })),
    },
    varsheshaRoles: {
      varshaLagnaLord: roles[0],
      natalLagnaLord: roles[1],
      trirasiLord: roles[2],
      munthaLord: roles[3],
      luminaryRasiLord: roles[4],
    },
    patyayiniDasha,
    sahams,
    tajikaYogas,
    extendedTajikaYogas,
  };
}

module.exports = { calculateVarshaphala };
