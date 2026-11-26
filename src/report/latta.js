/**
 * Latta as dated windows (tables in `lattaTables.js`): for every planet, the
 * star it kicks today, and the periods when it stands in the one star from
 * which it kicks the natal star (and, for Narasimha Rao's reading, the lagna
 * star); the periods when two or more such kicks coincide (Phaladeepika
 * XXVI.47); and, for Rao's reading, the houses the kicking planet owns and
 * occupies in the natal chart.
 */

const { planetLongitude, nodeLongitude } = require('../ephemeris/siderealPositions');
const { UnsupportedInputError } = require('../contracts/chartContext');
const { scanKey } = require('./saturnAshtakavarga');
const { NAKSHATRA_TA } = require('./babyNames');
const T = require('./lattaTables');

const DAY_MS = 86400000;
const YEAR_MS = 365.25 * DAY_MS;
const JD_UNIX_EPOCH = 2440587.5;
const STAR = 360 / 27;
const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const STEP_DAYS = { Sun: 1, Moon: 0.25, Mars: 1, Mercury: 1, Venus: 1, Jupiter: 2, Saturn: 2, Rahu: 2, Ketu: 2 };
/** Years back and ahead — long enough that a slow planet's next kick on the natal star is inside. */
const SPAN_YEARS = { Sun: [1, 3], Moon: [7 / 365.25, 1], Mars: [1, 4], Mercury: [1, 3], Venus: [1, 3], Jupiter: [1, 13], Saturn: [2, 31], Rahu: [2, 20], Ketu: [2, 20] };
const PLANET_TA = {
  Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு',
  Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது',
};
const RASI_LORDS = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'];
const iso = (ms) => new Date(ms).toISOString();
const days = (a, b) => Math.round(((b - a) / DAY_MS) * 10) / 10;
const norm360 = (d) => ((d % 360) + 360) % 360;
const star27Of = (lon) => Math.floor(norm360(lon) / STAR) % 27;

function longitudeOf(planet, ms, ayanamsha, nodeType) {
  const jd = ms / DAY_MS + JD_UNIX_EPOCH;
  if (planet === 'Rahu') return norm360(nodeLongitude(jd, ayanamsha, nodeType));
  if (planet === 'Ketu') return norm360(nodeLongitude(jd, ayanamsha, nodeType) + 180);
  return norm360(planetLongitude(jd, planet, ayanamsha));
}

/** Each kick computed: every planet's book count, and Kapoor's 8th for Rahu. */
const READINGS = [
  ...PLANETS.map((p) => ({ id: p, planet: p, ...T.KICKS[p], count: p === 'Rahu' ? T.RAHU_READINGS[T.DEFAULT_RAHU].count : T.KICKS[p].count, primary: true })),
  { id: 'Rahu-EIGHTH', planet: 'Rahu', count: T.RAHU_READINGS.EIGHTH.count, dir: -1, primary: false },
];

/** Rao: the houses (from the natal lagna) a planet owns, and the one it occupies. */
function natalHouses(planet, lagnaSign, natalLongitudes) {
  const owns = Array.from({ length: 12 }, (_, i) => i + 1).filter((h) => RASI_LORDS[(lagnaSign + h - 1) % 12] === planet);
  const lon = natalLongitudes?.[planet];
  const occupies = Number.isFinite(lon) ? ((Math.floor(norm360(lon) / 30) - lagnaSign + 12) % 12) + 1 : null;
  return { owns, occupies };
}

/** Intervals where two or more windows overlap, with the planets in each. */
function coincidences(windows) {
  const edges = [];
  windows.forEach((w, i) => { edges.push([w.fromMs, 1, i]); edges.push([w.toMs, -1, i]); });
  edges.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const open = new Set();
  const out = [];
  let last = null;
  for (const [t, kind, i] of edges) {
    if (open.size >= 2 && last !== null && t > last) {
      const ids = [...open].map((k) => windows[k].reading).sort();
      const prev = out[out.length - 1];
      if (prev && prev.toMs === last && prev.readings.join() === ids.join()) prev.toMs = t;
      else out.push({ fromMs: last, toMs: t, readings: ids });
    }
    if (kind === 1) open.add(i); else open.delete(i);
    last = t;
  }
  return out;
}

/**
 * @param natalMoonLongitude sidereal
 * @param lagnaLongitude     sidereal, or null (Rao's lagna-star reading is then skipped)
 * @param natalLongitudes    { Sun: deg, ... } for Rao's houses, or null
 */
function lattaNirnaya({ natalMoonLongitude, lagnaLongitude = null, natalLongitudes = null, atMs = Date.now(), ayanamsha = 'Lahiri', nodeType = 'mean' }) {
  if (!Number.isFinite(natalMoonLongitude)) throw new UnsupportedInputError('natal Moon longitude required', 'natalMoonLongitude');
  const janma = star27Of(natalMoonLongitude);
  const lagnaStar = Number.isFinite(lagnaLongitude) ? star27Of(lagnaLongitude) : null;
  const lagnaSign = Number.isFinite(lagnaLongitude) ? Math.floor(norm360(lagnaLongitude) / 30) : null;
  const targets = [{ id: 'JANMA', star: janma }, ...(lagnaStar === null ? [] : [{ id: 'LAGNA', star: lagnaStar }])];

  // Today: where each planet kicks.
  const today = READINGS.map((r) => {
    const star = star27Of(longitudeOf(r.planet, atMs, ayanamsha, nodeType));
    const kicked = T.kickedStar(star, r.count, r.dir);
    return {
      reading: r.id, planet: r.planet, planetTa: PLANET_TA[r.planet], primary: r.primary, count: r.count, dir: r.dir,
      star, starTa: NAKSHATRA_TA[star], kicked, kickedTa: NAKSHATRA_TA[kicked],
      onJanma: kicked === janma, onLagna: lagnaStar !== null && kicked === lagnaStar,
    };
  });

  // Windows: the stays of each planet in the star that kicks each target.
  const stays = {};
  const spans = {};
  for (const p of PLANETS) {
    const [back, ahead] = SPAN_YEARS[p];
    spans[p] = [atMs - back * YEAR_MS, atMs + ahead * YEAR_MS];
    stays[p] = scanKey(spans[p][0], spans[p][1], (ms) => star27Of(longitudeOf(p, ms, ayanamsha, nodeType)), STEP_DAYS[p] * DAY_MS);
  }
  const windowsRaw = [];
  for (const target of targets) {
    for (const r of READINGS) {
      const kicker = T.kickerStar(target.star, r.count, r.dir);
      for (const s of stays[r.planet]) {
        if (s.key !== kicker) continue;
        windowsRaw.push({ target: target.id, reading: r.id, planet: r.planet, primary: r.primary, fromMs: s.fromMs, toMs: s.toMs, openStart: Boolean(s.openStart), openEnd: Boolean(s.openEnd) });
      }
    }
  }
  const asOut = (w) => ({
    target: w.target, reading: w.reading, planet: w.planet, planetTa: PLANET_TA[w.planet], primary: w.primary,
    fromUtc: iso(w.fromMs), toUtc: iso(w.toMs), days: days(w.fromMs, w.toMs),
    openStart: w.openStart, openEnd: w.openEnd, current: w.fromMs <= atMs && atMs < w.toMs,
  });

  const kickers = Object.fromEntries(targets.map((t) => [t.id, READINGS.map((r) => {
    const k = T.kickerStar(t.star, r.count, r.dir);
    return { reading: r.id, planet: r.planet, planetTa: PLANET_TA[r.planet], primary: r.primary, star: k, starTa: NAKSHATRA_TA[k] };
  })]));

  const together = coincidences(windowsRaw.filter((w) => w.target === 'JANMA' && w.primary))
    .filter((c) => c.toMs > atMs - YEAR_MS)
    .map((c) => ({ fromUtc: iso(c.fromMs), toUtc: iso(c.toMs), days: days(c.fromMs, c.toMs), readings: c.readings, current: c.fromMs <= atMs && atMs < c.toMs }));

  return {
    atUtc: iso(atMs),
    janma: { star: janma, starTa: NAKSHATRA_TA[janma] },
    lagna: lagnaStar === null ? null : { star: lagnaStar, starTa: NAKSHATRA_TA[lagnaStar], sign: lagnaSign },
    spans: Object.fromEntries(PLANETS.map((p) => [p, { fromUtc: iso(spans[p][0]), toUtc: iso(spans[p][1]) }])),
    today,
    kickers,
    windows: windowsRaw.sort((a, b) => a.fromMs - b.fromMs).map(asOut),
    together,
    rao: lagnaSign === null ? null : Object.fromEntries(PLANETS.map((p) => [p, natalHouses(p, lagnaSign, natalLongitudes)])),
    kicks: T.KICKS, rahuReadings: T.RAHU_READINGS, ketu: T.KETU,
    countSources: T.COUNT_SOURCES, effects: T.EFFECTS, rank: T.LATTA_RANK, bookTa: T.BOOK_TA,
    differences: T.LATTA_DIFFERENCES, ourReadingsTa: T.OUR_READINGS_TA,
  };
}

module.exports = { lattaNirnaya, natalHouses, coincidences, READINGS, PLANETS };
