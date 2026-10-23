/**
 * Moorthi Nirnaya as dated sign entries (tables in `moorthiTables.js`): for
 * every planet but the Moon, each entry into a sign over a window, with the
 * transit Moon's house from the natal Moon at that moment, the form it gives,
 * the planet's ordinary good/bad house (Pulippani's gochara table), and
 * Pulippani's grade and quantum for that form.
 *
 * The form depends on the minute of the entry: the Moon moves a sign in about
 * two and a quarter days, Saturn a few arc-minutes a day. Each entry therefore
 * carries how long before it the Moon entered its sign and how long after it
 * leaves, and the arc the planet moves in that time; under CLOSE_ARCMIN the
 * neighbouring sign's form is given too.
 */

const { planetLongitude, nodeLongitude } = require('../ephemeris/siderealPositions');
const { UnsupportedInputError } = require('../contracts/chartContext');
const { signStays } = require('./saturnVedha');
const { RASI_TA } = require('./saturnTransit');
const { natureAt } = require('./nakshatraGochara');
const { VEDHA_METHODS } = require('./gocharaVedhaTables');
const T = require('./moorthiTables');

const DAY_MS = 86400000;
const HOUR_MS = 3600000;
const YEAR_MS = 365.25 * DAY_MS;
const JD_UNIX_EPOCH = 2440587.5;
const PLANETS = ['Sun', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
/** Years back and ahead; back covers the longest single stay, so the current stay's entry is inside. */
const SPAN_YEARS = { Sun: [1, 1], Mercury: [1, 1], Venus: [1, 1.5], Mars: [1, 2], Jupiter: [2, 6], Saturn: [3, 10], Rahu: [2, 6], Ketu: [2, 6] };
const PLANET_TA = {
  Sun: 'சூரியன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு',
  Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது',
};
const iso = (ms) => new Date(ms).toISOString();
const norm360 = (d) => ((d % 360) + 360) % 360;
const norm180 = (d) => ((d + 540) % 360) - 180;
const round = (x, n) => Math.round(x * 10 ** n) / 10 ** n;
const houseFrom = (sign, from) => ((sign - from + 12) % 12) + 1;

function longitudeOf(planet, ms, ayanamsha, nodeType) {
  const jd = ms / DAY_MS + JD_UNIX_EPOCH;
  if (planet === 'Rahu') return norm360(nodeLongitude(jd, ayanamsha, nodeType));
  if (planet === 'Ketu') return norm360(nodeLongitude(jd, ayanamsha, nodeType) + 180);
  return norm360(planetLongitude(jd, planet, ayanamsha));
}
const signOf = (planet, ms, ayanamsha, nodeType) => Math.floor(longitudeOf(planet, ms, ayanamsha, nodeType) / 30) % 12;
/** Degrees per hour, signed. */
const speedOf = (planet, ms, ayanamsha, nodeType) => norm180(longitudeOf(planet, ms + HOUR_MS, ayanamsha, nodeType) - longitudeOf(planet, ms - HOUR_MS, ayanamsha, nodeType)) / 2;

/** signStays brackets each change within an hour; this narrows it to 30 seconds. */
function refineEntry(planet, approxMs, prevSign, ayanamsha, nodeType) {
  let lo = approxMs - HOUR_MS;
  let hi = approxMs;
  if (signOf(planet, lo, ayanamsha, nodeType) !== prevSign) return approxMs;
  while (hi - lo > 30000) {
    const mid = (lo + hi) / 2;
    if (signOf(planet, mid, ayanamsha, nodeType) === prevSign) lo = mid; else hi = mid;
  }
  return hi;
}

/** Pulippani's grade and quantum for one nature. */
function pulippaniFor(nature, conventional, moorthi) {
  const rank = T.PULIPPANI_ORDER[nature].indexOf(moorthi);
  const conv = T.PULIPPANI_QUANTA.conventional[conventional];
  const { TABLE, LIST } = T.PULIPPANI_QUANTA.series;
  return {
    nature, rank,
    fraction: T.PULIPPANI_FRACTION[rank], fractionTa: T.PULIPPANI_FRACTION_TA[rank],
    conventionalQuantum: conv,
    special: { TABLE: TABLE[rank], LIST: LIST[rank] },
    total: { TABLE: conv + TABLE[rank], LIST: conv + LIST[rank] },
  };
}
const natures = (nature) => (nature === 'UNDETERMINED' ? ['BENEFIC', 'MALEFIC'] : [nature]);

const isGood = (planet, house) => VEDHA_METHODS.PULIPPANI.table[planet].good.includes(house);

/**
 * The form of one entry for every natal Moon sign — Pulippani's Tables 17 and
 * 23 are this, for Jupiter.
 */
function byJanmaRasi(planet, sign, moonSign, nature) {
  return Array.from({ length: 12 }, (_, rasi) => {
    const house = houseFrom(sign, rasi);
    const conventional = isGood(planet, house) ? 'GOOD' : 'BAD';
    const moorthi = T.moorthiOfHouse(houseFrom(moonSign, rasi));
    return { rasi, rasiTa: RASI_TA[rasi], house, conventional, moorthi, pulippani: natures(nature).map((n) => pulippaniFor(n, conventional, moorthi)) };
  });
}

function entryAt(planet, ms, fromSign, sign, moonRasi, ayanamsha, nodeType) {
  const moonLon = longitudeOf('Moon', ms, ayanamsha, nodeType);
  const moonSign = Math.floor(moonLon / 30) % 12;
  const moonSpeed = speedOf('Moon', ms, ayanamsha, nodeType);
  const into = moonLon - moonSign * 30;
  const before = into / moonSpeed;
  const after = (30 - into) / moonSpeed;
  const planetArcminPerHour = Math.abs(speedOf(planet, ms, ayanamsha, nodeType)) * 60;
  const marginHours = Math.min(before, after);
  const marginArcmin = marginHours * planetArcminPerHour;
  const moonHouse = houseFrom(moonSign, moonRasi);
  const moorthi = T.moorthiOfHouse(moonHouse);
  const house = houseFrom(sign, moonRasi);
  const conventional = isGood(planet, house) ? 'GOOD' : 'BAD';
  const nature = natureAt(planet, ms, ayanamsha, nodeType);

  let neighbour = null;
  if (marginArcmin < T.CLOSE_ARCMIN) {
    const side = before < after ? 'EARLIER' : 'LATER';
    const nSign = side === 'EARLIER' ? (moonSign + 11) % 12 : (moonSign + 1) % 12;
    const nHouse = houseFrom(nSign, moonRasi);
    const nMoorthi = T.moorthiOfHouse(nHouse);
    neighbour = {
      side, hours: round(side === 'EARLIER' ? before : after, 1),
      moonSign: nSign, moonSignTa: RASI_TA[nSign], moonHouse: nHouse, moorthi: nMoorthi,
      pulippani: natures(nature).map((n) => pulippaniFor(n, conventional, nMoorthi)),
    };
  }

  return {
    utc: iso(ms),
    fromSign, fromSignTa: RASI_TA[fromSign], sign, signTa: RASI_TA[sign],
    backward: sign === (fromSign + 11) % 12,
    house, conventional, nature,
    moon: {
      sign: moonSign, signTa: RASI_TA[moonSign], degree: round(into, 2), house: moonHouse,
      enteredHoursBefore: round(before, 1), leavesHoursAfter: round(after, 1),
    },
    moorthi,
    planetArcminPerDay: round(planetArcminPerHour * 24, 2),
    marginArcmin: round(marginArcmin, 2),
    close: neighbour !== null,
    neighbour,
    pulippani: natures(nature).map((n) => pulippaniFor(n, conventional, moorthi)),
  };
}

/**
 * @param natalMoonLongitude sidereal
 */
function moorthiNirnaya({ natalMoonLongitude, atMs = Date.now(), ayanamsha = 'Lahiri', nodeType = 'mean' }) {
  if (!Number.isFinite(natalMoonLongitude)) throw new UnsupportedInputError('natal Moon longitude required', 'natalMoonLongitude');
  const moonRasi = Math.floor(norm360(natalMoonLongitude) / 30);

  const planets = {};
  for (const p of PLANETS) {
    const [back, ahead] = SPAN_YEARS[p];
    const from = atMs - back * YEAR_MS;
    const to = atMs + ahead * YEAR_MS;
    const stays = signStays(p, from, to, ayanamsha, nodeType);
    const entries = [];
    for (let i = 1; i < stays.length; i += 1) {
      const s = stays[i];
      const ms = refineEntry(p, s.fromMs, stays[i - 1].sign, ayanamsha, nodeType);
      entries.push({
        ...entryAt(p, ms, stays[i - 1].sign, s.sign, moonRasi, ayanamsha, nodeType),
        toUtc: iso(s.toMs), openEnd: i === stays.length - 1,
        current: ms <= atMs && atMs < s.toMs,
      });
    }
    const now = entries.find((e) => e.current) ?? null;
    planets[p] = {
      planet: p, planetTa: PLANET_TA[p],
      span: { fromUtc: iso(from), toUtc: iso(to) },
      good: [...VEDHA_METHODS.PULIPPANI.table[p].good].sort((a, b) => a - b),
      now,
      nowAllRasis: now ? byJanmaRasi(p, now.sign, now.moon.sign, now.nature) : null,
      entries,
    };
  }

  return {
    atUtc: iso(atMs),
    moonRasi: { rasiIndex: moonRasi, rasiTa: RASI_TA[moonRasi] },
    moorthis: T.MOORTHIS,
    rank: T.MOORTHI_RANK, bookTa: T.BOOK_TA,
    groupSources: T.GROUP_SOURCES,
    grades: T.GRADES,
    pulippani: {
      order: T.PULIPPANI_ORDER, fractionTa: T.PULIPPANI_FRACTION_TA, quanta: T.PULIPPANI_QUANTA,
      maleficSource: T.TABLE_SOURCES.TABLE_24,
    },
    combinations: T.COMBINATIONS,
    differences: T.MOORTHI_DIFFERENCES,
    ourReadingsTa: T.OUR_READINGS_TA,
    closeArcmin: T.CLOSE_ARCMIN,
    conventionalSource: VEDHA_METHODS.PULIPPANI.sources[0],
    planets,
  };
}

module.exports = { moorthiNirnaya, byJanmaRasi, entryAt, refineEntry, pulippaniFor, PLANETS };
