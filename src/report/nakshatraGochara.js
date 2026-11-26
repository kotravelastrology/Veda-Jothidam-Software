/**
 * Nakshatra gochara as dated stays (tables in `nakshatraGocharaTables.js`):
 * for every planet, each star it occupies, counted from the natal star, with
 * the tara, Pulippani's good/bad class for that planet, each book's limb and
 * result, the house from the natal Moon's sign and Pulippani's combination
 * rule; and, for the coming year, the weekdays on which the natal star falls.
 */

const { planetLongitude, nodeLongitude, sunriseJulianDay } = require('../ephemeris/siderealPositions');
const { UnsupportedInputError } = require('../contracts/chartContext');
const { scanKey, rasisOfRange } = require('./saturnAshtakavarga');
const { NAKSHATRA_TA } = require('./babyNames');
const { RASI_TA } = require('./saturnTransit');
const T = require('./nakshatraGocharaTables');

const DAY_MS = 86400000;
const YEAR_MS = 365.25 * DAY_MS;
const JD_UNIX_EPOCH = 2440587.5;
const STAR = 360 / 27;
const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const STEP_DAYS = { Sun: 1, Moon: 0.25, Mars: 1, Mercury: 1, Venus: 1, Jupiter: 2, Saturn: 2, Rahu: 2, Ketu: 2 };
const PLANET_TA = {
  Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு',
  Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது',
};
const FIXED_NATURE = { Sun: 'MALEFIC', Mars: 'MALEFIC', Saturn: 'MALEFIC', Rahu: 'MALEFIC', Ketu: 'MALEFIC', Jupiter: 'BENEFIC', Venus: 'BENEFIC' };
const iso = (ms) => new Date(ms).toISOString();
const days = (a, b) => Math.round(((b - a) / DAY_MS) * 10) / 10;
const norm360 = (d) => ((d % 360) + 360) % 360;
const toJd = (ms) => ms / DAY_MS + JD_UNIX_EPOCH;
const toMs = (jd) => (jd - JD_UNIX_EPOCH) * DAY_MS;

function longitudeOf(planet, ms, ayanamsha, nodeType) {
  const jd = toJd(ms);
  if (planet === 'Rahu') return norm360(nodeLongitude(jd, ayanamsha, nodeType));
  if (planet === 'Ketu') return norm360(nodeLongitude(jd, ayanamsha, nodeType) + 180);
  return norm360(planetLongitude(jd, planet, ayanamsha));
}
const star27Of = (lon) => Math.floor(norm360(lon) / STAR) % 27;

/** The planet's nature for Pulippani's combination rules, at an instant. */
function natureAt(planet, ms, ayanamsha, nodeType) {
  if (FIXED_NATURE[planet]) return FIXED_NATURE[planet];
  if (planet === 'Moon') {
    const e = norm360(longitudeOf('Moon', ms, ayanamsha, nodeType) - longitudeOf('Sun', ms, ayanamsha, nodeType));
    return e < 180 ? 'BENEFIC' : 'MALEFIC';
  }
  // Mercury: by the planets in his sign (aspects not computed).
  const sign = Math.floor(longitudeOf('Mercury', ms, ayanamsha, nodeType) / 30);
  const withHim = PLANETS.filter((p) => p !== 'Mercury' && p !== 'Moon' && Math.floor(longitudeOf(p, ms, ayanamsha, nodeType) / 30) === sign);
  const b = withHim.some((p) => FIXED_NATURE[p] === 'BENEFIC');
  const m = withHim.some((p) => FIXED_NATURE[p] === 'MALEFIC');
  return b && !m ? 'BENEFIC' : m && !b ? 'MALEFIC' : 'UNDETERMINED';
}

/** Each book's rows (indices into its table for the planet) that contain this count; null where the book has none for the planet. */
const angaFor = (planet, count) => Object.fromEntries(T.ANGA_RANK.order.map((book) => {
  const rows = T.ANGA[book].rows[planet];
  if (!rows) return [book, null];
  return [book, rows.map((row, i) => [row, i]).filter(([[f, t]]) => count >= f && count <= t).map(([, i]) => i)];
}));
const angaTablesFor = (planet) => Object.fromEntries(T.ANGA_RANK.order.map((book) => {
  const rows = T.ANGA[book].rows[planet];
  return [book, rows ? rows.map(([from, to, limbTa, resultTa]) => ({ from, to, limbTa, resultTa })) : null];
}));

function classOf(planet, count) {
  const c = T.PULIPPANI_STAR_CLASS[planet];
  return c.good.includes(count) ? 'GOOD' : c.bad.includes(count) ? 'BAD' : 'NONE';
}

function combinationFor(nature, houses, starClass) {
  if (starClass === 'NONE' || nature === 'UNDETERMINED') return [];
  return houses.flatMap((h) => T.COMBINATION.rules
    .filter((r) => r.nature === nature && r.star === starClass && r.houses.includes(h))
    .map((r) => ({ house: h, id: r.id, textTa: r.textTa })));
}

/**
 * @param natalMoonLongitude sidereal
 * @param birthPlace         { latitude, longitude, utcOffsetMinutes } for the weekday rule's sunrise
 */
function nakshatraGochara({ natalMoonLongitude, birthPlace, atMs = Date.now(), ayanamsha = 'Lahiri', nodeType = 'mean', years = 6 }) {
  if (!Number.isFinite(natalMoonLongitude)) throw new UnsupportedInputError('natal Moon longitude required', 'natalMoonLongitude');
  const janma = star27Of(natalMoonLongitude);
  const moonRasi = Math.floor(norm360(natalMoonLongitude) / 30);
  const span = (p) => (p === 'Moon' ? [atMs - DAY_MS, atMs + 30 * DAY_MS] : [atMs - YEAR_MS, atMs + years * YEAR_MS]);

  const planets = {};
  for (const p of PLANETS) {
    const [from, to] = span(p);
    const segs = scanKey(from, to, (ms) => star27Of(longitudeOf(p, ms, ayanamsha, nodeType)), STEP_DAYS[p] * DAY_MS);
    const stays = segs.map((s) => {
      const count = ((s.key - janma + 27) % 27) + 1;
      const tara = ((count - 1) % 9) + 1;
      const rasis = rasisOfRange(s.key * STAR, (s.key + 1) * STAR);
      const houses = rasis.map((x) => ((x - moonRasi + 12) % 12) + 1);
      const mid = (s.fromMs + s.toMs) / 2;
      const nature = natureAt(p, mid, ayanamsha, nodeType);
      const starClass = classOf(p, count);
      return {
        fromUtc: iso(s.fromMs), toUtc: iso(s.toMs), days: days(s.fromMs, s.toMs),
        openStart: Boolean(s.openStart), openEnd: Boolean(s.openEnd), current: s.fromMs <= atMs && atMs < s.toMs,
        star27: s.key, starTa: NAKSHATRA_TA[s.key], count, tara, taraTa: T.TARAS[tara - 1].pulippaniTa,
        starClass, rasisTa: rasis.map((x) => RASI_TA[x]), houses, nature,
        combination: combinationFor(nature, houses, starClass),
        anga: angaFor(p, count),
      };
    });
    planets[p] = {
      planet: p, planetTa: PLANET_TA[p],
      span: { fromUtc: iso(span(p)[0]), toUtc: iso(span(p)[1]) },
      starClass: T.PULIPPANI_STAR_CLASS[p],
      angaTables: angaTablesFor(p),
      now: stays.find((x) => x.current) ?? null,
      stays,
    };
  }

  // Weekday rule: the days on which the natal star runs at sunrise at the birth place, for a year.
  const weekdays = [];
  if (birthPlace && Number.isFinite(birthPlace.latitude) && Number.isFinite(birthPlace.longitude)) {
    const offsetMs = (birthPlace.utcOffsetMinutes ?? 0) * 60000;
    const startLocal = Math.floor((atMs + offsetMs) / DAY_MS) * DAY_MS;
    for (let d = 0; d < 366; d += 1) {
      const localMidnightUtc = startLocal + d * DAY_MS - offsetMs;
      const rise = sunriseJulianDay(toJd(localMidnightUtc), birthPlace.latitude, birthPlace.longitude);
      if (!Number.isFinite(rise)) continue;
      const riseMs = toMs(rise);
      if (star27Of(longitudeOf('Moon', riseMs, ayanamsha, nodeType)) !== janma) continue;
      const localDate = new Date(startLocal + d * DAY_MS);
      const wd = localDate.getUTCDay();
      weekdays.push({
        dateLocal: localDate.toISOString().slice(0, 10), sunriseUtc: iso(riseMs),
        weekday: wd, weekdayTa: T.WEEKDAY_TA[wd], resultTa: T.WEEKDAY.results[wd],
      });
    }
  }

  return {
    atUtc: iso(atMs),
    janma: { star27: janma, starTa: NAKSHATRA_TA[janma] },
    moonRasi: { rasiIndex: moonRasi, rasiTa: RASI_TA[moonRasi] },
    taras: T.TARAS, taraSources: T.TARA_SOURCES,
    starClassSource: T.STAR_CLASS_SOURCE,
    combination: { readingTa: T.COMBINATION.readingTa, alsoTa: T.COMBINATION.alsoTa, source: T.COMBINATION.source, rules: T.COMBINATION.rules },
    anga: { order: T.ANGA_RANK.order, rank: T.ANGA_RANK, books: Object.fromEntries(Object.entries(T.ANGA).map(([k, v]) => [k, { bookTa: v.bookTa, source: v.source }])), differences: T.ANGA_DIFFERENCES },
    weekday: { list: weekdays, source: T.WEEKDAY.source, readingTa: T.WEEKDAY.readingTa },
    combinedTa: T.COMBINED_TA,
    planets,
  };
}

module.exports = { nakshatraGochara, angaFor, classOf, natureAt };
