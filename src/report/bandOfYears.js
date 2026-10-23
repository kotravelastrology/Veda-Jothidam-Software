/**
 * The band of years (tables in `bandOfYearsTables.js`): which planet rules
 * each year of a life under each order of the 35-year cycle, the Lal Kitab
 * thirds of each band, Raj Kumar's progression of the ruler round the zodiac
 * during its band and its contacts with the birth planets, and where the
 * ruler is in transit now.
 *
 *   birthMs           the birth moment (UTC ms)
 *   natalLongitudes   { planet: sidereal longitude } at birth (nine planets)
 *   natalLagnaLongitude
 *   atMs              now
 */

const T = require('./bandOfYearsTables');
const { planetLongitude, nodeLongitude } = require('../ephemeris/siderealPositions');
const { NAKSHATRA_TA } = require('./babyNames');

const DAY_MS = 86400000;
const YEAR_MS = T.YEAR_DAYS * DAY_MS;
const PLANETS = Object.freeze(['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu']);
const RASI_LORDS = Object.freeze(['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter']);
const PLANET_TA = Object.freeze({ Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது' });
const RASI_TA = Object.freeze(['மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கடகம்', 'சிம்மம்', 'கன்னி', 'துலாம்', 'விருச்சிகம்', 'தனுசு', 'மகரம்', 'கும்பம்', 'மீனம்']);
const STAR = 360 / 27;
const norm360 = (d) => ((d % 360) + 360) % 360;
const iso = (ms) => new Date(ms).toISOString();
const signOf = (lon) => Math.floor(norm360(lon) / 30) % 12;
const starOf = (lon) => Math.floor(norm360(lon) / STAR) % 27;
const houseOf = (sign, from) => ((sign - from + 12) % 12) + 1;
/** Signs a planet in `sign` aspects fully. */
const aspectedSigns = (planet, sign) => T.ASPECTS[planet].map((h) => (sign + h - 1) % 12);

/** The n-th year of life (1 from birth). */
const yearOfLife = (birthMs, ms) => Math.floor((ms - birthMs) / YEAR_MS) + 1;
const yearStartMs = (birthMs, n) => birthMs + (n - 1) * YEAR_MS;

/** Every band over three cycles, in an order's sequence. */
function bandsOf(birthMs, orderId) {
  const seq = T.ORDERS[orderId].sequence;
  const out = [];
  let year = 1;
  for (let cycle = 1; cycle <= T.CYCLES; cycle += 1) {
    for (const planet of seq) {
      const span = T.SPANS[planet];
      out.push({ planet, cycle, fromYear: year, toYear: year + span - 1, fromMs: yearStartMs(birthMs, year), toMs: yearStartMs(birthMs, year + span) });
      year += span;
    }
  }
  return out;
}

/** Lal Kitab's thirds of a band and their intervening planets. */
const thirdsOf = (band) => {
  const len = (band.toMs - band.fromMs) / 3;
  return T.INTERVENING[band.planet].map((planet, i) => ({ planet, part: i, fromMs: band.fromMs + i * len, toMs: band.fromMs + (i + 1) * len }));
};

/**
 * Raj Kumar's progression: from its birth longitude the ruler goes once round
 * the zodiac at an even pace over its band. Returns the moment it reaches
 * `deg` degrees past its birth longitude, and the sign stages.
 */
function progressionOf(band, natalLon) {
  const len = band.toMs - band.fromMs;
  const at = (deg) => band.fromMs + (len * deg) / 360;
  const lonAt = (ms) => norm360(natalLon + (360 * (ms - band.fromMs)) / len);
  const first = 30 - (norm360(natalLon) % 30);
  const s0 = signOf(natalLon);
  const stages = [{ sign: s0, fromMs: band.fromMs, toMs: at(first) }];
  for (let k = 1; k <= 11; k += 1) stages.push({ sign: (s0 + k) % 12, fromMs: at(first + (k - 1) * 30), toMs: at(first + k * 30) });
  stages.push({ sign: s0, fromMs: at(first + 330), toMs: band.toMs });
  return { stages, lonAt, at };
}

/**
 * When the progressed ruler meets each birth planet: in its sign, in its
 * nakshatra, or aspecting its sign (the ruler's full aspects).
 */
function contactsOf(band, natalLongitudes, prog) {
  const ruler = band.planet;
  const natalLon = natalLongitudes[ruler];
  const out = [];
  for (const p of PLANETS) {
    if (p === ruler) continue;
    const lon = natalLongitudes[p];
    // An arc [a, b) of the zodiac → the moments the progressed ruler is in it (one or two pieces).
    const windows = (a, b) => {
      const d0 = norm360(a - natalLon); const d1 = d0 + (b - a);
      return d1 <= 360 ? [[prog.at(d0), prog.at(d1)]] : [[prog.at(d0), band.toMs], [band.fromMs, prog.at(d1 - 360)]];
    };
    const sign = signOf(lon);
    const star = starOf(lon);
    for (const [fromMs, toMs] of windows(sign * 30, sign * 30 + 30)) out.push({ planet: p, kind: 'SIGN', fromMs, toMs });
    for (const [fromMs, toMs] of windows(star * STAR, star * STAR + STAR)) out.push({ planet: p, kind: 'STAR', fromMs, toMs });
    for (const st of prog.stages) if (aspectedSigns(ruler, st.sign).includes(sign)) out.push({ planet: p, kind: 'ASPECT', fromMs: st.fromMs, toMs: st.toMs });
  }
  return out.filter((c) => c.toMs - c.fromMs > 60000).sort((a, b) => a.fromMs - b.fromMs);
}

function longitudeNow(planet, ms, ayanamsha, nodeType) {
  const jd = ms / DAY_MS + 2440587.5;
  if (planet === 'Rahu') return norm360(nodeLongitude(jd, ayanamsha, nodeType));
  if (planet === 'Ketu') return norm360(nodeLongitude(jd, ayanamsha, nodeType) + 180);
  return norm360(planetLongitude(jd, planet, ayanamsha));
}

function bandOfYears({ birthMs, natalLongitudes, natalLagnaLongitude, atMs = Date.now(), ayanamsha = 'Lahiri', nodeType = 'mean' }) {
  const year = yearOfLife(birthMs, atMs);
  const natalLagna = Number.isFinite(natalLagnaLongitude) ? signOf(natalLagnaLongitude) : null;
  const natalMoonSign = signOf(natalLongitudes.Moon);
  const transit = Object.fromEntries(PLANETS.map((p) => [p, longitudeNow(p, atMs, ayanamsha, nodeType)]));
  const plain = (b) => ({ ...b, fromUtc: iso(b.fromMs), toUtc: iso(b.toMs), fromMs: undefined, toMs: undefined });

  const orders = Object.fromEntries(T.ORDERS.order.map((id) => {
    const bands = bandsOf(birthMs, id);
    const current = bands.find((b) => b.fromMs <= atMs && atMs < b.toMs) ?? null;
    let now = null;
    if (current) {
      const prog = progressionOf(current, natalLongitudes[current.planet]);
      const r = current.planet;
      const nSign = signOf(natalLongitudes[r]);
      const tSign = signOf(transit[r]);
      const thirds = thirdsOf(current);
      now = {
        band: plain(current),
        thirds: thirds.map((x) => ({ ...plain(x), current: x.fromMs <= atMs && atMs < x.toMs })),
        natal: {
          sign: nSign, star: starOf(natalLongitudes[r]),
          house: natalLagna !== null ? houseOf(nSign, natalLagna) : null,
          owns: natalLagna !== null ? RASI_LORDS.map((l, s) => (l === r ? houseOf(s, natalLagna) : null)).filter(Boolean) : [],
        },
        progression: {
          longitude: prog.lonAt(atMs),
          stages: prog.stages.map((s) => ({ ...plain(s), current: s.fromMs <= atMs && atMs < s.toMs, natalHere: PLANETS.filter((p) => p !== r && signOf(natalLongitudes[p]) === s.sign) })),
          contacts: contactsOf(current, natalLongitudes, prog).map((c) => ({ ...plain(c), current: c.fromMs <= atMs && atMs < c.toMs })),
        },
        transit: {
          longitude: transit[r], sign: tSign, star: starOf(transit[r]),
          houseFromLagna: natalLagna !== null ? houseOf(tSign, natalLagna) : null,
          houseFromMoon: houseOf(tSign, natalMoonSign),
          withNatal: PLANETS.filter((p) => p !== r && signOf(natalLongitudes[p]) === tSign),
          aspectsNatal: PLANETS.filter((p) => aspectedSigns(r, tSign).includes(signOf(natalLongitudes[p]))),
          withTransit: PLANETS.filter((p) => p !== r && signOf(transit[p]) === tSign),
        },
      };
    }
    return [id, { bands: bands.map(plain), now }];
  }));

  return {
    birthUtc: iso(birthMs), atUtc: iso(atMs), yearOfLife: year, cycle: Math.ceil(year / T.CYCLE_YEARS),
    orders,
    natal: Object.fromEntries(PLANETS.map((p) => [p, { sign: signOf(natalLongitudes[p]), star: starOf(natalLongitudes[p]) }])),
    natalLagna,
    books: {
      orders: T.ORDERS, spans: T.SPANS, intervening: T.INTERVENING, partTa: T.PART_TA,
      rank: T.RANK, sources: T.SOURCES, notesTa: T.NOTES_TA,
      planetTa: PLANET_TA, rasiTa: RASI_TA, starTa: NAKSHATRA_TA,
    },
  };
}

module.exports = { bandOfYears, bandsOf, thirdsOf, progressionOf, contactsOf, yearOfLife, yearStartMs, PLANETS };
