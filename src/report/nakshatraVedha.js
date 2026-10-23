/**
 * Nakshatra vedha as dated windows: for each of the sixteen positions in
 * `nakshatraVedhaTables.js`, the target star (the Nth from the natal planet's
 * star) and the spells when the named planet transits it.
 *
 * Each transiting planet's star changes are scanned once and shared by every
 * position it causes. The Moon passes every star monthly, so its spells are
 * scanned for the next thirteen months only; the others for the full window.
 */

const { planetLongitude, nodeLongitude } = require('../ephemeris/siderealPositions');
const { UnsupportedInputError } = require('../contracts/chartContext');
const { scanKey } = require('./saturnAshtakavarga');
const { NAKSHATRA_TA } = require('./babyNames');
const T = require('./nakshatraVedhaTables');

const DAY_MS = 86400000;
const YEAR_MS = 365.25 * DAY_MS;
const JD_UNIX_EPOCH = 2440587.5;
const STAR = 360 / 27;
const MOON_SPAN_MS = 400 * DAY_MS;
const STEP_DAYS = { Sun: 1, Moon: 0.25, Mars: 1, Mercury: 1, Venus: 1, Jupiter: 2, Saturn: 2, Rahu: 2, Ketu: 2 };
const PLANET_TA = {
  Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு',
  Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது',
};
const iso = (ms) => new Date(ms).toISOString();
const days = (a, b) => Math.round(((b - a) / DAY_MS) * 10) / 10;
const norm360 = (d) => ((d % 360) + 360) % 360;

function longitudeOf(planet, ms, ayanamsha, nodeType) {
  const jd = ms / DAY_MS + JD_UNIX_EPOCH;
  if (planet === 'Rahu') return norm360(nodeLongitude(jd, ayanamsha, nodeType));
  if (planet === 'Ketu') return norm360(nodeLongitude(jd, ayanamsha, nodeType) + 180);
  return norm360(planetLongitude(jd, planet, ayanamsha));
}
const starOf = (lon) => Math.floor(norm360(lon) / STAR) % 27;

/** The star `count` places from `natalStar`, counting the natal star as the 1st. */
const nthStar = (natalStar, count) => (natalStar + count - 1) % 27;

/**
 * @param natalLongitudes { Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu } sidereal
 * @param fromMs, toMs    the window for every planet but the Moon
 * @param atMs            "now"; the Moon is scanned from a month before to thirteen months after
 */
function nakshatraVedha({ natalLongitudes, fromMs, toMs, atMs = Date.now(), ayanamsha = 'Lahiri', nodeType = 'mean' }) {
  if (!(Number.isFinite(fromMs) && Number.isFinite(toMs) && toMs > fromMs) || (toMs - fromMs) > 40 * YEAR_MS) {
    throw new UnsupportedInputError('the window must be a forward span of at most 40 years', 'window');
  }
  const natal = {};
  for (const p of Object.keys(PLANET_TA)) {
    const lon = natalLongitudes[p];
    if (!Number.isFinite(lon)) throw new UnsupportedInputError(`no natal longitude for ${p}`, 'natalLongitudes');
    natal[p] = { nakshatraIndex: starOf(lon), nakshatraTa: NAKSHATRA_TA[starOf(lon)] };
  }

  // Expand "Rahu/Ketu" as the natal planet into one row counted from each node.
  const rows = [];
  for (const r of T.NAKSHATRA_VEDHA) {
    const from = r.natal === 'Rahu/Ketu' ? ['Rahu', 'Ketu'] : [r.natal];
    for (const n of from) rows.push({ ...r, natalPlanet: n, countedFrom: r.natal === 'Rahu/Ketu' ? n : null });
  }

  // Star stays of every planet that causes a vedha, scanned once.
  const causers = [...new Set(T.NAKSHATRA_VEDHA.flatMap((r) => r.by))];
  const span = (p) => (p === 'Moon' ? [Math.max(fromMs, atMs - 31 * DAY_MS), Math.min(toMs, atMs + MOON_SPAN_MS)] : [fromMs, toMs]);
  const stays = {};
  for (const p of causers) {
    const [a, b] = span(p);
    stays[p] = scanKey(a, b, (ms) => starOf(longitudeOf(p, ms, ayanamsha, nodeType)), STEP_DAYS[p] * DAY_MS);
  }

  const out = rows.map((r) => {
    const natalStar = natal[r.natalPlanet].nakshatraIndex;
    const target = nthStar(natalStar, r.count);
    const windows = [];
    for (const p of r.by) {
      for (const s of stays[p]) {
        if (s.key !== target) continue;
        windows.push({
          planet: p, planetTa: PLANET_TA[p], fromUtc: iso(s.fromMs), toUtc: iso(s.toMs), days: days(s.fromMs, s.toMs),
          openStart: Boolean(s.openStart), openEnd: Boolean(s.openEnd), current: s.fromMs <= atMs && atMs < s.toMs,
        });
      }
    }
    windows.sort((x, y) => Date.parse(x.fromUtc) - Date.parse(y.fromUtc));
    const next = windows.find((w) => Date.parse(w.fromUtc) > atMs) ?? null;
    return {
      id: r.countedFrom ? `${r.id}_${r.countedFrom.toUpperCase()}` : r.id,
      tableId: r.id,
      natal: r.natal, natalPlanet: r.natalPlanet, natalTa: PLANET_TA[r.natalPlanet], countedFrom: r.countedFrom,
      natalNakshatraIndex: natalStar, natalNakshatraTa: NAKSHATRA_TA[natalStar],
      count: r.count, targetIndex: target, targetTa: NAKSHATRA_TA[target],
      by: r.by, byTa: r.by.map((p) => PLANET_TA[p]),
      windows,
      activeNow: windows.filter((w) => w.current).map((w) => w.planet),
      next,
      spanOfMoon: r.by.includes('Moon') ? { fromUtc: iso(span('Moon')[0]), toUtc: iso(span('Moon')[1]) } : null,
    };
  });

  return {
    window: { fromUtc: iso(fromMs), toUtc: iso(toMs) },
    atUtc: iso(atMs),
    natal,
    rows: out,
    activeNow: out.filter((r) => r.activeNow.length).map((r) => r.id),
    rank: T.NAKSHATRA_VEDHA_RANK,
    readings: T.READINGS,
    notes: T.NOTES,
    sources: [T.SOURCES.pulippaniTable, T.SOURCES.santhanamTable],
  };
}

module.exports = { nakshatraVedha, nthStar, starOf };
