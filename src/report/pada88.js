/**
 * The 88th nakshatra pada as dated windows (tables in `pada88Tables.js`): the
 * pada, 87 quarters on from the natal Moon's; for every planet the periods it
 * stands there, with whether transiting Jupiter aspects that sign (Raj Kumar's
 * relief); the periods when two or more planets are there together; and the
 * Moon's monthly passages (Kalaprakasika's and Shubhakaran's time rule).
 */

const { planetLongitude, nodeLongitude } = require('../ephemeris/siderealPositions');
const { UnsupportedInputError } = require('../contracts/chartContext');
const { scanKey } = require('./saturnAshtakavarga');
const { coincidences } = require('./latta');
const { NAKSHATRA_TA } = require('./babyNames');
const { RASI_TA } = require('./saturnTransit');
const T = require('./pada88Tables');

const DAY_MS = 86400000;
const YEAR_MS = 365.25 * DAY_MS;
const JD_UNIX_EPOCH = 2440587.5;
const PADA = 360 / T.PADAS;
const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const STEP_DAYS = { Sun: 1, Moon: 0.1, Mars: 1, Mercury: 0.5, Venus: 1, Jupiter: 2, Saturn: 2, Rahu: 2, Ketu: 2 };
/** Years back and ahead — long enough that a slow planet's next passage is inside. */
const SPAN_YEARS = { Sun: [1, 3], Moon: [7 / 365.25, 1], Mars: [1, 4], Mercury: [1, 3], Venus: [1, 3], Jupiter: [1, 13], Saturn: [2, 31], Rahu: [2, 20], Ketu: [2, 20] };
const PLANET_TA = {
  Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு',
  Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது',
};
const iso = (ms) => new Date(ms).toISOString();
const days = (a, b) => Math.round(((b - a) / DAY_MS) * 100) / 100;
const norm360 = (d) => ((d % 360) + 360) % 360;
const padaOf = (lon) => Math.floor(norm360(lon) / PADA) % T.PADAS;
const describe = (p) => ({ pada108: p, star: Math.floor(p / 4), starTa: NAKSHATRA_TA[Math.floor(p / 4)], pada: (p % 4) + 1, fromDeg: p * PADA, toDeg: (p + 1) * PADA, sign: Math.floor((p * PADA) / 30), signTa: RASI_TA[Math.floor((p * PADA) / 30)] });

function longitudeOf(planet, ms, ayanamsha, nodeType) {
  const jd = ms / DAY_MS + JD_UNIX_EPOCH;
  if (planet === 'Rahu') return norm360(nodeLongitude(jd, ayanamsha, nodeType));
  if (planet === 'Ketu') return norm360(nodeLongitude(jd, ayanamsha, nodeType) + 180);
  return norm360(planetLongitude(jd, planet, ayanamsha));
}

/** Does Jupiter (by sign) cast his 5th, 7th or 9th aspect on `sign` at `ms`? */
function jupiterAspects(sign, ms, ayanamsha, nodeType) {
  const j = Math.floor(longitudeOf('Jupiter', ms, ayanamsha, nodeType) / 30) % 12;
  return [5, 7, 9].includes(((sign - j + 12) % 12) + 1);
}

/**
 * @param natalMoonLongitude sidereal
 */
function pada88({ natalMoonLongitude, atMs = Date.now(), ayanamsha = 'Lahiri', nodeType = 'mean' }) {
  if (!Number.isFinite(natalMoonLongitude)) throw new UnsupportedInputError('natal Moon longitude required', 'natalMoonLongitude');
  const natal = padaOf(natalMoonLongitude);
  const target = T.pada88Of(natal);
  const t = describe(target);

  const today = PLANETS.map((p) => {
    const lon = longitudeOf(p, atMs, ayanamsha, nodeType);
    const pd = padaOf(lon);
    return { planet: p, planetTa: PLANET_TA[p], ...describe(pd), inPada: pd === target };
  });

  const raw = [];
  const spans = {};
  for (const p of PLANETS) {
    const [back, ahead] = SPAN_YEARS[p];
    spans[p] = [atMs - back * YEAR_MS, atMs + ahead * YEAR_MS];
    const segs = scanKey(spans[p][0], spans[p][1], (ms) => padaOf(longitudeOf(p, ms, ayanamsha, nodeType)), STEP_DAYS[p] * DAY_MS);
    for (const s of segs) {
      if (s.key !== target) continue;
      const samples = [s.fromMs, (s.fromMs + s.toMs) / 2, s.toMs - 1].map((ms) => jupiterAspects(t.sign, ms, ayanamsha, nodeType));
      const n = samples.filter(Boolean).length;
      raw.push({
        reading: p, planet: p, fromMs: s.fromMs, toMs: s.toMs, openStart: Boolean(s.openStart), openEnd: Boolean(s.openEnd),
        jupiterAspect: p === 'Jupiter' ? null : n === 3 ? 'ALL' : n === 0 ? 'NONE' : 'PART',
      });
    }
  }
  raw.sort((a, b) => a.fromMs - b.fromMs);

  const together = coincidences(raw)
    .filter((c) => c.toMs > atMs - YEAR_MS)
    .map((c) => ({ fromUtc: iso(c.fromMs), toUtc: iso(c.toMs), days: days(c.fromMs, c.toMs), planets: c.readings, current: c.fromMs <= atMs && atMs < c.toMs }));

  return {
    atUtc: iso(atMs),
    natal: describe(natal),
    target: t,
    today,
    spans: Object.fromEntries(PLANETS.map((p) => [p, { fromUtc: iso(spans[p][0]), toUtc: iso(spans[p][1]) }])),
    windows: raw.map((w) => ({
      planet: w.planet, planetTa: PLANET_TA[w.planet],
      fromUtc: iso(w.fromMs), toUtc: iso(w.toMs), days: days(w.fromMs, w.toMs),
      openStart: w.openStart, openEnd: w.openEnd, current: w.fromMs <= atMs && atMs < w.toMs,
      jupiterAspect: w.jupiterAspect,
    })),
    together,
    rajKumarEffects: T.RAJ_KUMAR_EFFECTS,
    statements: T.STATEMENTS, countSources: T.COUNT_SOURCES, examples: T.EXAMPLES,
    rank: T.PADA88_RANK, bookTa: T.BOOK_TA, differences: T.PADA88_DIFFERENCES, ourReadingsTa: T.OUR_READINGS_TA,
  };
}

module.exports = { pada88, jupiterAspects, padaOf, PLANETS };
