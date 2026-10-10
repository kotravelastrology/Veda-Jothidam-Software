/**
 * The star of a muhurta, checked over a period (tables in `muhurtaStarTables.js`).
 *
 * The period is cut wherever the Moon or a kicking planet enters a new pada
 * (quarter star, 3°20′); inside each piece every check is constant:
 *
 *  - Latta: a planet in star S kicks S ± (count − 1); the muhurta star (the
 *    Moon's) is kicked when it is that star. Rahu both ways; each quarter rule
 *    flagged (same quarter as the kicking planet; Jyotirvidabharana's 1st/4th).
 *  - For the person: the birth star (and pada), the 88th and 108th padas from
 *    the birth pada, and Vainashika under three readings.
 *  - Within the 88th pada, the stretches when the lagna's lord and the 10th
 *    lord are friends (Kalaprakasika's remedy), for the given place.
 */

const { planetLongitude, nodeLongitude } = require('../ephemeris/siderealPositions');
const { siderealAscendant } = require('../ephemeris/swissEphemeris');
const { UnsupportedInputError } = require('../contracts/chartContext');
const { naturalRelation } = require('../chart/planetaryRelationship');
const { scanKey } = require('./saturnAshtakavarga');
const { NAKSHATRA_TA } = require('./babyNames');
const { kickedStar } = require('./lattaTables');
const T = require('./muhurtaStarTables');

const DAY_MS = 86400000;
const JD_UNIX_EPOCH = 2440587.5;
const PADA = 360 / 108;
const MAX_DAYS = 120;
/** Sampling step (days) for each body's pada scan: a few samples per pada. */
const STEP_DAYS = { Moon: 0.04, Sun: 1, Mercury: 0.25, Venus: 0.5, Mars: 1, Jupiter: 2, Saturn: 2, Rahu: 2 };
const PLANET_TA = {
  Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு',
  Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு',
};
const RASI_TA = ['மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கடகம்', 'சிம்மம்', 'கன்னி', 'துலாம்', 'விருச்சிகம்', 'தனுசு', 'மகரம்', 'கும்பம்', 'மீனம்'];
const RASI_LORDS = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'];
const iso = (ms) => new Date(ms).toISOString();
const norm360 = (d) => ((d % 360) + 360) % 360;
const padaOf = (lon) => Math.floor(norm360(lon) / PADA) % 108;
const jdOf = (ms) => ms / DAY_MS + JD_UNIX_EPOCH;

function longitudeOf(planet, ms, ayanamsha, nodeType) {
  if (planet === 'Rahu') return norm360(nodeLongitude(jdOf(ms), ayanamsha, nodeType));
  return norm360(planetLongitude(jdOf(ms), planet, ayanamsha));
}

/** The lagna's lord and the 10th lord: friends both ways (BPHS natural), or one planet. */
function lordsFriendly(lagnaSign) {
  const a = RASI_LORDS[lagnaSign];
  const b = RASI_LORDS[(lagnaSign + 9) % 12];
  return { lagnaLord: a, tenthLord: b, friends: a === b || (naturalRelation(a, b) === 'friend' && naturalRelation(b, a) === 'friend') };
}

/** Where `star` lies for the person: which of their checks it (and its pada) meets. */
function personalOf(janmaPada, moonPada) {
  const janmaStar = Math.floor(janmaPada / 4);
  const star = Math.floor(moonPada / 4);
  const p88 = (janmaPada + 87) % 108;
  return {
    JANMA: star === janmaStar,
    JANMA_PADA: moonPada === janmaPada,
    PADA_88: moonPada === p88,
    PADA_108: moonPada === (janmaPada + 107) % 108,
    VAINASHIKA: {
      STAR_23: star === (janmaStar + 22) % 27,
      STAR_22: star === (janmaStar + 21) % 27,
      PADA88_STAR: star === Math.floor(p88 / 4),
    },
  };
}

/** Each kick that lands on the muhurta star, with the quarter rules. */
function lattaOf(moonPada, kickerPadas) {
  const star = Math.floor(moonPada / 4);
  const quarter = moonPada % 4;
  const hits = [];
  for (const p of T.KICKERS) {
    const kp = kickerPadas[p];
    const ks = Math.floor(kp / 4);
    const kq = kp % 4;
    const readings = p === 'Rahu'
      ? T.RAHU_DIRECTION.order.map((id) => ({ rahu: id, dir: T.RAHU_DIRECTION[id].dir }))
      : [{ rahu: null, dir: T.KICKS[p].dir }];
    for (const { rahu, dir } of readings) {
      if (kickedStar(ks, T.KICKS[p].count, dir) !== star) continue;
      hits.push({
        planet: p, planetTa: PLANET_TA[p], rahu,
        kickerStar: ks, kickerStarTa: NAKSHATRA_TA[ks], kickerPada: kq + 1,
        sameQuarter: quarter === kq,
        jvQuarter: quarter === (dir > 0 ? 0 : 3),
      });
    }
  }
  return hits;
}

/**
 * @param natalMoonLongitude sidereal, for the person's checks
 * @param fromMs, toMs       the period (at most 120 days)
 * @param latitude, longitude the place, for the lagna in the 88th-pada remedy
 */
function muhurtaStarChecks({ natalMoonLongitude, fromMs, toMs, atMs = Date.now(), ayanamsha = 'Lahiri', nodeType = 'mean', latitude, longitude }) {
  if (!Number.isFinite(natalMoonLongitude)) throw new UnsupportedInputError('natalMoonLongitude is required', 'natalMoonLongitude');
  if (!(toMs > fromMs) || toMs - fromMs > MAX_DAYS * DAY_MS) throw new UnsupportedInputError(`period must be 1-${MAX_DAYS} days`, 'toMs');
  const janmaPada = padaOf(natalMoonLongitude);
  const janmaStar = Math.floor(janmaPada / 4);

  // Pada segments of every body, then the pieces between all their boundaries.
  const bodies = ['Moon', ...T.KICKERS];
  const segs = Object.fromEntries(bodies.map((b) => [b, scanKey(fromMs, toMs, (ms) => padaOf(longitudeOf(b, ms, ayanamsha, nodeType)), STEP_DAYS[b] * DAY_MS)]));
  const cuts = [...new Set(bodies.flatMap((b) => segs[b].map((s) => s.fromMs)).concat([toMs]))].sort((a, b) => a - b);
  const keyAt = (b, ms) => segs[b].find((s) => s.fromMs <= ms && ms < s.toMs)?.key ?? segs[b][segs[b].length - 1].key;

  const pieces = [];
  for (let i = 0; i + 1 < cuts.length; i += 1) {
    const a = cuts[i];
    const b = cuts[i + 1];
    if (b <= a) continue;
    const mid = (a + b) / 2;
    const moonPada = keyAt('Moon', mid);
    const kickerPadas = Object.fromEntries(T.KICKERS.map((p) => [p, keyAt(p, mid)]));
    const latta = lattaOf(moonPada, kickerPadas);
    const personal = personalOf(janmaPada, moonPada);
    const sig = JSON.stringify([moonPada, latta, personal]);
    const last = pieces[pieces.length - 1];
    if (last && last.sig === sig && last.toMs === a) { last.toMs = b; continue; }
    pieces.push({ sig, fromMs: a, toMs: b, moonPada, latta, personal });
  }

  // The remedy, inside the 88th pada: the lagna sign through those hours.
  const remedyFor = (a, b) => {
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
    return scanKey(a, b, (ms) => Math.floor(siderealAscendant(jdOf(ms), latitude, longitude, ayanamsha) / 30) % 12, 10 * 60000)
      .map((s) => ({ fromUtc: iso(s.fromMs), toUtc: iso(s.toMs), lagna: s.key, lagnaTa: RASI_TA[s.key], ...lordsFriendly(s.key) }));
  };

  const segments = pieces.map((p) => ({
    fromUtc: iso(p.fromMs), toUtc: iso(p.toMs),
    star: Math.floor(p.moonPada / 4), starTa: NAKSHATRA_TA[Math.floor(p.moonPada / 4)], pada: (p.moonPada % 4) + 1,
    current: p.fromMs <= atMs && atMs < p.toMs,
    personal: p.personal,
    latta: p.latta,
    remedy88: p.personal.PADA_88 ? remedyFor(p.fromMs, p.toMs) : null,
  }));

  const p88 = (janmaPada + 87) % 108;
  const p108 = (janmaPada + 107) % 108;
  const starOf = (pada) => ({ star: Math.floor(pada / 4), starTa: NAKSHATRA_TA[Math.floor(pada / 4)], pada: (pada % 4) + 1 });
  return {
    atUtc: iso(atMs), fromUtc: iso(fromMs), toUtc: iso(toMs),
    janma: {
      ...starOf(janmaPada),
      pada88: starOf(p88), pada108: starOf(p108),
      vainashika: {
        STAR_23: { star: (janmaStar + 22) % 27, starTa: NAKSHATRA_TA[(janmaStar + 22) % 27] },
        STAR_22: { star: (janmaStar + 21) % 27, starTa: NAKSHATRA_TA[(janmaStar + 21) % 27], wilhelmExempt: T.VAINASHIKA.STAR_22.wilhelmExempt.includes(janmaStar) },
        PADA88_STAR: { star: Math.floor(p88 / 4), starTa: NAKSHATRA_TA[Math.floor(p88 / 4)] },
      },
    },
    place: Number.isFinite(latitude) && Number.isFinite(longitude) ? { latitude, longitude } : null,
    segments,
    books: {
      lattaRank: T.LATTA_RANK, personalRank: T.PERSONAL_RANK, bookTa: T.BOOK_TA,
      rahu: T.RAHU_DIRECTION, padaRules: T.PADA_RULES, lattaSources: T.LATTA_SOURCES, lattaEffects: T.LATTA_EFFECTS,
      kicks: Object.fromEntries(T.KICKERS.map((p) => [p, { ...T.KICKS[p], planetTa: PLANET_TA[p] }])),
      personal: T.PERSONAL_CHECKS, vainashika: T.VAINASHIKA, remedy88: T.REMEDY_88, notesTa: T.NOTES_TA,
    },
  };
}

module.exports = { muhurtaStarChecks, personalOf, lattaOf, lordsFriendly, MAX_DAYS };
