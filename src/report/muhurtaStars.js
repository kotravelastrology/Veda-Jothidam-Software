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
const STAR = 360 / 27;
/**
 * Where a star is cut for the Moon: the ghatis of Raman's urgent rule (3, 6, 7,
 * 8 of 60), the quarters (padas) and the thirds — every boundary a tara rule
 * uses, so each piece lies wholly inside or outside each rule's portion.
 */
const STAR_CUTS = Object.freeze([0, 3 / 60, 6 / 60, 7 / 60, 8 / 60, 1 / 4, 1 / 3, 1 / 2, 2 / 3, 3 / 4]);
const sliceOf = (frac) => {
  let i = 0;
  while (i + 1 < STAR_CUTS.length && frac >= STAR_CUTS[i + 1]) i += 1;
  return i;
};
/** The Moon's key: star × 10 + the slice of the star. */
const moonKeyOf = (lon) => {
  const l = norm360(lon);
  const star = Math.floor(l / STAR) % 27;
  return star * 10 + sliceOf((l - star * STAR) / STAR);
};
const sliceBounds = (slice) => [STAR_CUTS[slice], STAR_CUTS[slice + 1] ?? 1];

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

/**
 * The tara of the muhurta star: count from the birth star (the birth star is
 * the 1st), the tara 1-9, the round 1-3, and the part of the star the Moon is
 * in (fractions), which the rules on the second round and on ghatis use.
 */
function taraOf(janmaStar, star, slice) {
  const count = ((star - janmaStar + 27) % 27) + 1;
  const [from, to] = sliceBounds(slice);
  return { count, n: ((count - 1) % 9) + 1, cycle: Math.floor((count - 1) / 9) + 1, from, to };
}

/**
 * Chandra bala: the Moon's house from the natal Moon's sign, the paksha, the
 * planets (not Mercury) in its vedha house when it is in a good house, and for
 * the 8th Wilhelm's kind of Chandrashtama by the tara count.
 */
function chandraOf(natalSign, moonSign, paksha, taraCount, planetSigns) {
  const house = ((moonSign - natalSign + 12) % 12) + 1;
  const vedhaHouse = T.MOON_VEDHA[house] ?? (paksha === 'SHUKLA' ? T.MOON_VEDHA_BRIGHT[house] : undefined);
  const vedhaBy = vedhaHouse === undefined ? [] : Object.entries(planetSigns)
    .filter(([p, s]) => p !== 'Mercury' && ((s - natalSign + 12) % 12) + 1 === vedhaHouse).map(([p]) => p);
  const kind = house !== 8 ? null : taraCount >= 19 ? 'THIRD' : String(taraCount);
  return { house, paksha, vedhaHouse: vedhaHouse ?? null, vedhaBy, chandrashtama: kind && T.CHANDRASHTAMA_KINDS[kind] ? kind : (house === 8 ? 'OTHER' : null) };
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

  const natalSign = Math.floor(norm360(natalMoonLongitude) / 30);

  // Segments of every body (the Moon by slice of star, the rest by pada) and of
  // the paksha, then the pieces between all their boundaries.
  const keyFns = {
    Moon: (ms) => moonKeyOf(longitudeOf('Moon', ms, ayanamsha, nodeType)),
    ...Object.fromEntries(T.KICKERS.map((b) => [b, (ms) => padaOf(longitudeOf(b, ms, ayanamsha, nodeType))])),
    paksha: (ms) => Math.floor(norm360(longitudeOf('Moon', ms, ayanamsha, nodeType) - longitudeOf('Sun', ms, ayanamsha, nodeType)) / 180),
  };
  const steps = { ...STEP_DAYS, paksha: 0.25 };
  const segs = Object.fromEntries(Object.keys(keyFns).map((b) => [b, scanKey(fromMs, toMs, keyFns[b], steps[b] * DAY_MS)]));
  const cuts = [...new Set(Object.values(segs).flatMap((ss) => ss.map((s) => s.fromMs)).concat([toMs]))].sort((a, b) => a - b);
  const keyAt = (b, ms) => segs[b].find((s) => s.fromMs <= ms && ms < s.toMs)?.key ?? segs[b][segs[b].length - 1].key;

  const pieces = [];
  for (let i = 0; i + 1 < cuts.length; i += 1) {
    const a = cuts[i];
    const b = cuts[i + 1];
    if (b <= a) continue;
    const mid = (a + b) / 2;
    const moonKey = keyAt('Moon', mid);
    const star = Math.floor(moonKey / 10);
    const slice = moonKey % 10;
    const moonPada = star * 4 + Math.floor(STAR_CUTS[slice] * 4 + 1e-9);
    const kickerPadas = Object.fromEntries(T.KICKERS.map((p) => [p, keyAt(p, mid)]));
    const planetSigns = Object.fromEntries(T.KICKERS.map((p) => [p, Math.floor(kickerPadas[p] / 9)]));
    planetSigns.Ketu = (planetSigns.Rahu + 6) % 12;
    const latta = lattaOf(moonPada, kickerPadas);
    const personal = personalOf(janmaPada, moonPada);
    const tara = taraOf(janmaStar, star, slice);
    const chandra = chandraOf(natalSign, Math.floor(moonPada / 9), keyAt('paksha', mid) === 0 ? 'SHUKLA' : 'KRISHNA', tara.count, planetSigns);
    // Every reading's verdict, so the page needs no rules of its own and pieces merge only where all agree.
    const taraVerdicts = Object.fromEntries(T.TARA_BAD.order.map((bad) => [bad, Object.fromEntries(T.TARA_CYCLES.order.map((cy) => [cy, taraVerdict(tara, bad, cy)]))]));
    const chandraBala = Object.fromEntries(T.CHANDRA_READINGS.order.map((r) => [r, chandraPresent(chandra, r)]));
    const sig = JSON.stringify([moonPada, latta, personal, tara.n, tara.cycle, chandra, taraVerdicts]);
    const last = pieces[pieces.length - 1];
    if (last && last.sig === sig && last.toMs === a) { last.toMs = b; last.tara.to = tara.to; continue; }
    pieces.push({ sig, fromMs: a, toMs: b, moonPada, latta, personal, tara, chandra, taraVerdicts, chandraBala });
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
    tara: { ...p.tara, from: Math.round(p.tara.from * 1e4) / 1e4, to: Math.round(p.tara.to * 1e4) / 1e4 },
    taraVerdicts: p.taraVerdicts,
    chandra: p.chandra,
    chandraBala: p.chandraBala,
    remedy88: p.personal.PADA_88 ? remedyFor(p.fromMs, p.toMs) : null,
  }));
  const natalLord = RASI_LORDS[natalSign];
  const eighthLord = RASI_LORDS[(natalSign + 7) % 12];

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
      sign: natalSign, signTa: RASI_TA[natalSign],
      // Wilhelm: Chandrashtama "loses all capacity for ill" when these two are friends (BPHS natural, both ways — our reading).
      chandrashtamaLords: {
        natalLord, eighthLord,
        friends: natalLord === eighthLord || (naturalRelation(natalLord, eighthLord) === 'friend' && naturalRelation(eighthLord, natalLord) === 'friend'),
      },
    },
    place: Number.isFinite(latitude) && Number.isFinite(longitude) ? { latitude, longitude } : null,
    segments,
    books: {
      lattaRank: T.LATTA_RANK, personalRank: T.PERSONAL_RANK, bookTa: T.BOOK_TA,
      rahu: T.RAHU_DIRECTION, padaRules: T.PADA_RULES, lattaSources: T.LATTA_SOURCES, lattaEffects: T.LATTA_EFFECTS,
      kicks: Object.fromEntries(T.KICKERS.map((p) => [p, { ...T.KICKS[p], planetTa: PLANET_TA[p] }])),
      personal: T.PERSONAL_CHECKS, vainashika: T.VAINASHIKA, remedy88: T.REMEDY_88, notesTa: T.NOTES_TA,
      taraNamesTa: T.TARA_NAMES_TA, taraRank: T.TARA_RANK, taraBad: T.TARA_BAD, taraCycles: T.TARA_CYCLES, secondRound: T.SECOND_ROUND,
      taraSources: T.TARA_SOURCES, taraNotesTa: T.TARA_NOTES_TA,
      chandraRank: T.CHANDRA_RANK, chandrashtamaKinds: T.CHANDRASHTAMA_KINDS, chandraReadings: T.CHANDRA_READINGS,
      chandraSources: T.CHANDRA_SOURCES, chandraNotesTa: T.CHANDRA_NOTES_TA, moonVedha: T.MOON_VEDHA, moonVedhaBright: T.MOON_VEDHA_BRIGHT,
    },
  };
}

/**
 * The tara verdict under the chosen readings: 'REJECT', 'CAUTION' (the birth
 * group in the later rounds; a bad tara's untouched part in round 2 under the
 * partial rules is clear) or null. `t` is a segment's tara.
 */
function taraVerdict(t, badId, cycleId) {
  const bad = T.TARA_BAD[badId].set.includes(t.n);
  if (!bad) return null;
  if (cycleId === 'FULL') return 'REJECT';
  if (cycleId === 'GHATI') return t.to <= T.TARA_CYCLES.GHATI.ghatis[t.n] / 60 + 1e-9 ? 'REJECT' : null;
  if (t.cycle === 1) return 'REJECT';
  if (t.n === 1) return 'CAUTION';
  if (t.cycle === 3) return null;
  if (cycleId === 'QUARTERS') {
    const q = Math.floor(t.from * 4 + 1e-9) + 1;
    return q === T.SECOND_ROUND.quarter[t.n] ? 'REJECT' : null;
  }
  const third = Math.floor(t.from * 3 + 1e-9);
  return third === T.SECOND_ROUND.third[t.n] ? 'REJECT' : null;
}

/** Chandra bala under a reading: true when present. The 8th is never present. */
function chandraPresent(c, readingId) {
  const r = T.CHANDRA_READINGS[readingId];
  if (c.house === 8) return false;
  if (r.good) {
    const good = r.good.includes(c.house) || (c.paksha === 'SHUKLA' && r.goodBright.includes(c.house));
    return good && c.vedhaBy.length === 0;
  }
  return !r.bad.includes(c.house);
}

module.exports = { muhurtaStarChecks, personalOf, lattaOf, lordsFriendly, taraOf, chandraOf, taraVerdict, chandraPresent, STAR_CUTS, MAX_DAYS };
