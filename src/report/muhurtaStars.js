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
 *  - The other nine evils of a marriage muhurta (`marriageDoshas.js`): the
 *    period is also cut where the Sun changes degree, the yoga or the tithi
 *    changes, or a planet enters or leaves Abhijit.
 *  - Lagna shuddhi (`lagnaShuddhi.js`): inside each piece, the stretches of one
 *    rising sign at the event's place, cut also at its first and last 3°, at
 *    sunrise and sunset, at the 12-minute Gandanta marks and where Mars or
 *    Saturn turns retrograde or direct.
 */

const { planetLongitude, nodeLongitude, sunriseJulianDay, sunsetJulianDay } = require('../ephemeris/siderealPositions');
const { siderealAscendant } = require('../ephemeris/swissEphemeris');
const { UnsupportedInputError } = require('../contracts/chartContext');
const { naturalRelation } = require('../chart/planetaryRelationship');
const { scanKey } = require('./saturnAshtakavarga');
const { NAKSHATRA_TA } = require('./babyNames');
const { kickedStar } = require('./lattaTables');
const T = require('./muhurtaStarTables');
const D = require('./marriageDoshaTables');
const { marriageDoshasOf, dashaVerdict, banaOf, PLANETS: DOSHA_PLANETS } = require('./marriageDoshas');
const L = require('./lagnaShuddhiTables');
const { lagnaShuddhiOf, navamsaOf, vargaIndices, shadvargaOf, drekkanaOf, vishanadiOf, adverseOf } = require('./lagnaShuddhi');
const { combustionOrb } = require('./phaladeepikaGocharaTables');
const EV = require('./eventMuhurtaTables');
const { piecesCodesOf, stretchCodesOf, isVishti, isSthiraKarana } = require('./eventMuhurta');

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
 * uses, so each piece lies wholly inside or outside each rule's portion — and
 * 4/60, where Abhijit ends inside Shravana (it begins at Uttarashadha's 4th
 * quarter); and the travel ghatis of the cruel stars (11, 13, 14, 16, 21 of 60;
 * Muhurta Chintamani XI.12). At most 16 cuts (the Moon's key is star × 16 + slice).
 */
const STAR_CUTS = Object.freeze([0, 3 / 60, 4 / 60, 6 / 60, 7 / 60, 8 / 60, 11 / 60, 13 / 60, 14 / 60, 1 / 4, 16 / 60, 1 / 3, 21 / 60, 1 / 2, 2 / 3, 3 / 4]);
const sliceOf = (frac) => {
  let i = 0;
  while (i + 1 < STAR_CUTS.length && frac >= STAR_CUTS[i + 1]) i += 1;
  return i;
};
/** The Moon's key: star × 16 + the slice of the star. */
const moonKeyOf = (lon) => {
  const l = norm360(lon);
  const star = Math.floor(l / STAR) % 27;
  return star * 16 + sliceOf((l - star * STAR) / STAR);
};
const sliceBounds = (slice) => [STAR_CUTS[slice], STAR_CUTS[slice + 1] ?? 1];
/** The Moon is in Abhijit in Uttarashadha's last quarter and Shravana's first 4/60. */
const moonInAbhijit = (star, slice) => (star === 20 && STAR_CUTS[slice] >= 3 / 4) || (star === 21 && STAR_CUTS[slice] < 4 / 60);
const inAbhijit = (lon) => lon >= D.ABHIJIT.from && lon < D.ABHIJIT.to;
const YOGA = 360 / 27;

function longitudeOf(planet, ms, ayanamsha, nodeType) {
  if (planet === 'Rahu') return norm360(nodeLongitude(jdOf(ms), ayanamsha, nodeType));
  return norm360(planetLongitude(jdOf(ms), planet, ayanamsha));
}

/**
 * A piece's evils for the page: only the readings under which each is present
 * and what the page shows. Jamitra's lagna lists change only with the planets'
 * padas, so they are kept once in `lagnaTable` and referred to by index; Bana's
 * lagnas depend only on the tithi and are in `books.dasha.banaLagnas`.
 */
function compactDoshas(ds, lagnaTable) {
  const present = (r) => Object.fromEntries(Object.entries(r).filter(([, x]) => x));
  const lagnas = JSON.stringify([ds.JAMITRA.lagnaSigns, ds.JAMITRA.lagnaNavamsas]);
  let ref = lagnaTable.indexOf(lagnas);
  if (ref < 0) { lagnaTable.push(lagnas); ref = lagnaTable.length - 1; }
  return {
    PAATA: { readings: present(ds.PAATA.readings), yogaEnds: ds.PAATA.yogaEnds },
    YUTI: { readings: present(ds.YUTI.readings), starOtherSign: ds.YUTI.starOtherSign, moonDignity: ds.YUTI.moonDignity },
    VEDHA: { readings: present(ds.VEDHA.readings) },
    JAMITRA: { readings: present(ds.JAMITRA.readings), mercurySeventh: ds.JAMITRA.mercurySeventh, lagnaRef: ref },
    BANA: { readings: present(ds.BANA.readings), sunDeg: ds.BANA.sunDeg, banasDeg: ds.BANA.byDegree.present, banasOrd: ds.BANA.byOrdinal.present, sashalya: ds.BANA.byDegree.sashalya },
    EKARGALA: { readings: present(ds.EKARGALA.readings), yoga: ds.EKARGALA.yoga, count28: ds.EKARGALA.count28, exempt: ds.EKARGALA.exempt },
    UPAGRAHA: { readings: present(ds.UPAGRAHA.readings), count: ds.UPAGRAHA.count },
    KRANTI: { readings: present(ds.KRANTI.readings) },
    DAGDHA: { readings: present(ds.DAGDHA.readings) },
  };
}

/**
 * The lagna's key: where it falls in the six vargas, the half of Sagittarius's
 * navamsa and the degree zone (`vargaIndices`) — every boundary a lagna rule uses.
 */
const lagnaKeyOf = (asc) => {
  const v = vargaIndices(asc);
  return [v.sign, v.d2, v.d3, v.n108, v.half, v.d12, v.d30, v.zone].join('|');
};
const lagnaKeyParts = (key) => {
  const [sign, d2, d3, n108, half, d12, d30, zone] = key.split('|').map(Number);
  return { sign, d2, d3, n108, half, d12, d30, zone };
};

/**
 * The lagna stretches inside a piece of the period, at the event's place: one
 * rising sign, day or night, the Gandanta flags and Mars's and Saturn's
 * motion constant in each, and lagna shuddhi computed for it. Returns a
 * function of the piece, or null without a place.
 */
function lagnaStretches({ fromMs, toMs, latitude, longitude, ayanamsha, nodeType, natalLagnaLongitude, natalMoonSign, natalLongitudes, tithiSegAt, dir = null }) {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  const PAD = 3 * 3600000;
  const MIN = 60000;
  // The lagna, scanned three hours beyond each end so every sign's true start and end are known.
  const lagnaSegs = scanKey(fromMs - PAD, toMs + PAD, (ms) => lagnaKeyOf(siderealAscendant(jdOf(ms), latitude, longitude, ayanamsha)), 2 * MIN);
  const signSegs = [];
  for (const s of lagnaSegs) {
    const { sign } = lagnaKeyParts(s.key);
    const last = signSegs[signSegs.length - 1];
    if (last && last.sign === sign) { last.toMs = s.toMs; last.openEnd = s.openEnd; } else signSegs.push({ sign, fromMs: s.fromMs, toMs: s.toMs, openStart: s.openStart, openEnd: s.openEnd });
  }
  // Muhurta Chintamani's and Shridhar's 12 minutes: from the start of Aries, Leo, Sagittarius; before the end of Cancer, Scorpio, Pisces.
  const g12 = [];
  for (const s of signSegs) {
    if (L.GANDANTA_START.includes(s.sign) && !s.openStart) g12.push([s.fromMs, s.fromMs + 12 * MIN]);
    if (L.GANDANTA_END.includes(s.sign) && !s.openEnd) g12.push([s.toMs - 12 * MIN, s.toMs]);
  }
  g12.sort((a, b) => a[0] - b[0]);
  // Kalyanraman's half ghati: the first, middle and last 12 minutes of each sign's rising.
  const ghatiWins = { first: [], middle: [], last: [] };
  for (const sg of signSegs) {
    if (sg.openStart || sg.openEnd) continue;
    const m = (sg.fromMs + sg.toMs) / 2;
    ghatiWins.first.push([sg.fromMs, sg.fromMs + 12 * MIN]);
    ghatiWins.middle.push([m - 6 * MIN, m + 6 * MIN]);
    ghatiWins.last.push([sg.toMs - 12 * MIN, sg.toMs]);
  }
  // Windows of one kind are sorted and apart: binary search for the last one starting at or before ms.
  const inAny = (wins, ms) => {
    let lo = -1; let hi = wins.length - 1;
    while (lo < hi) { const m = (lo + hi + 1) >> 1; if (wins[m][0] <= ms) lo = m; else hi = m - 1; }
    return lo >= 0 && ms < wins[lo][1];
  };
  // Sunrises and sunsets at the place.
  const sun = [];
  for (let jd0 = Math.floor(jdOf(fromMs - DAY_MS) - 0.5) + 0.5; jd0 <= jdOf(toMs + DAY_MS); jd0 += 1) {
    const rise = sunriseJulianDay(jd0, latitude, longitude);
    if (!Number.isFinite(rise)) continue;
    const set = sunsetJulianDay(rise, latitude, longitude);
    for (const [jd, isRise] of [[rise, true], [set, false]]) {
      const ms = Math.round((jd - JD_UNIX_EPOCH) * DAY_MS);
      if (Number.isFinite(ms) && !sun.some((e) => Math.abs(e.ms - ms) < 3600000)) sun.push({ ms, rise: isRise });
    }
  }
  sun.sort((a, b) => a.ms - b.ms);
  const nightAt = (ms) => { const e = sun.filter((x) => x.ms <= ms).pop(); return e ? !e.rise : false; };
  // The weekday runs from sunrise to sunrise; its date is the place's local mean date of that sunrise.
  const varaAt = (ms) => {
    const rise = sun.filter((x) => x.rise && x.ms <= ms).pop();
    return new Date((rise ? rise.ms : ms) + (longitude / 15) * 3600000).getUTCDay();
  };
  // The day from sunrise to sunset: 1 its first third, 2 to noon, 3 to two-thirds, 4 the last third; 0 the night.
  const dayOf = (ms) => {
    const rise = sun.filter((x) => x.rise && x.ms <= ms).pop();
    const set = rise && sun.find((x) => !x.rise && x.ms > rise.ms);
    const next = set && sun.find((x) => x.rise && x.ms > set.ms);
    return { rise: rise?.ms, set: set?.ms, next: next?.ms };
  };
  const dayPartAt = (ms) => {
    const { rise, set } = dayOf(ms);
    if (rise === undefined || set === undefined || ms >= set) return 0;
    const f = (ms - rise) / (set - rise);
    return f < 1 / 3 ? 1 : f < 1 / 2 ? 2 : f < 2 / 3 ? 3 : 4;
  };
  // The night's thirds (travel's Kaala Shoola): 1-3 from sunset to sunrise, 0 by day.
  const nightPartAt = (ms) => {
    if (!nightAt(ms)) return 0;
    const set = sun.filter((x) => !x.rise && x.ms <= ms).pop();
    const rise = set && sun.find((x) => x.rise && x.ms > set.ms);
    if (!set || !rise) return 0;
    const f = (ms - set.ms) / (rise.ms - set.ms);
    return f < 1 / 3 ? 1 : f < 2 / 3 ? 2 : 3;
  };
  // Ghatis (24 minutes) since the weekday's sunrise (the Vaar Shoola's release), and Abhijit, the
  // 8th of the day's 15 muhurtas.
  const GHATI_MS = 24 * 60000;
  const ghatisAt = (ms) => { const { rise } = dayOf(ms); return rise === undefined ? 0 : (ms - rise) / GHATI_MS; };
  const abhijitAt = (ms) => {
    const { rise, set } = dayOf(ms);
    if (rise === undefined || set === undefined || ms >= set) return false;
    const f = (ms - rise) / (set - rise);
    return f >= 7 / 15 && f < 8 / 15;
  };
  const dayMarks = [];
  for (const e of sun) {
    const set = e.rise && sun.find((x) => !x.rise && x.ms > e.ms);
    if (set) for (const f of [1 / 3, 1 / 2, 2 / 3, 7 / 15, 8 / 15]) dayMarks.push(Math.round(e.ms + (set.ms - e.ms) * f));
    if (e.rise) for (const g of [8, 12, 15, 16, 20, 22]) dayMarks.push(e.ms + g * GHATI_MS);
    const rise = !e.rise && sun.find((x) => x.rise && x.ms > e.ms);
    if (rise) for (const f of [1 / 3, 2 / 3]) dayMarks.push(Math.round(e.ms + (rise.ms - e.ms) * f));
  }
  // Pradosha (MC V.55, Wilhelm): the day's tithi at sunrise, the 12th, 6th or 3rd, ends before midnight,
  // 1½ or 1 prahara (a quarter of the night) into the night — that day, sunrise to sunrise, both halves.
  const pradoshaAt = (ms) => {
    const { rise, set, next } = dayOf(ms);
    if (!tithiSegAt || rise === undefined || set === undefined || next === undefined) return false;
    const seg = tithiSegAt(rise);
    if (!seg || seg.openEnd) return false;
    const n = (seg.key % 15) + 1;
    const prahara = (next - set) / 4;
    const limit = { 12: 2, 6: 1.5, 3: 1 }[n];
    return limit !== undefined && seg.toMs < set + limit * prahara;
  };
  // Mars and Saturn turning retrograde or direct (longitude half a day either side).
  const retroOf = (p, ms) => ((longitudeOf(p, ms + DAY_MS / 2, ayanamsha, nodeType) - longitudeOf(p, ms - DAY_MS / 2, ayanamsha, nodeType) + 540) % 360) - 180 < 0;
  const retroSegs = scanKey(fromMs, toMs, (ms) => (retroOf('Mars', ms) ? 1 : 0) | (retroOf('Saturn', ms) ? 2 : 0), DAY_MS / 2);
  // Shridhar §13.10: every planet's retrograde motion and combustion (orbs: Shridhar p.211, Phaladeepika II.36 note).
  const motionKey = (ms) => {
    const sun = longitudeOf('Sun', ms, ayanamsha, nodeType);
    const retro = L.MOVERS.filter((p) => retroOf(p, ms));
    const combust = L.SETTERS.filter((p) => Math.abs(((longitudeOf(p, ms, ayanamsha, nodeType) - sun + 540) % 360) - 180) < combustionOrb(p, retro.includes(p)));
    return `${retro.join(',')}|${combust.join(',')}`;
  };
  const motionSegs = scanKey(fromMs, toMs, motionKey, DAY_MS / 4);
  const motionAt = (ms) => {
    const [r, c] = keyIn(motionSegs, ms).split('|');
    const retro = Object.fromEntries(L.MOVERS.map((p) => [p, r.split(',').includes(p)]));
    const combust = Object.fromEntries(L.SETTERS.map((p) => [p, c.split(',').includes(p)]));
    return { retro, combust };
  };
  // The birth 8th lords' navamsa signs (from the birth lagna and the birth Moon).
  const navSignOf = (lon) => Math.floor(norm360(lon) / (10 / 3)) % 12;
  const natalNav8 = natalLongitudes
    ? [...new Set([natalLagnaLongitude, natalLongitudes.Moon].filter(Number.isFinite).map((lon) => {
      const lord8 = RASI_LORDS[(Math.floor(norm360(lon) / 30) + 7) % 12];
      return navSignOf(natalLongitudes[lord8]);
    }))]
    : [];
  // Binary search: the segment holding ms (segments are sorted and contiguous).
  const keyIn = (segs, ms) => {
    let lo = 0; let hi = segs.length - 1;
    while (lo < hi) { const m = (lo + hi + 1) >> 1; if (segs[m].fromMs <= ms) lo = m; else hi = m - 1; }
    return segs[lo].key;
  };

  const marks = [
    ...lagnaSegs.map((s) => s.fromMs), ...g12.flat(), ...sun.map((e) => e.ms), ...retroSegs.map((s) => s.fromMs), ...motionSegs.map((s) => s.fromMs),
    ...Object.values(ghatiWins).flat(2), ...dayMarks,
  ].filter((ms) => ms > fromMs && ms < toMs).sort((a, b) => a - b);
  const natalLagna = Number.isFinite(natalLagnaLongitude) ? Math.floor(norm360(natalLagnaLongitude) / 30) : null;

  // What depends only on the lagna, the planets' signs, their motion and day or night is kept once
  // (`table`), and likewise what depends only on the lagna's navamsa and the planets' signs (`navTable`).
  const tableOf = () => {
    const keys = [];
    const index = new Map();
    const ref = (x) => {
      const k = JSON.stringify(x);
      if (!index.has(k)) { index.set(k, keys.length); keys.push(k); }
      return index.get(k);
    };
    return { ref, all: () => keys.map((k) => JSON.parse(k)) };
  };
  const table = tableOf();
  const navTable = tableOf();
  const vargaTable = tableOf();
  const advTable = tableOf();
  const evTable = tableOf();

  // A stretch is an array [f, t, r, n, v, g, b, w, d]: seconds from the period's start (f, t), the
  // three tables' entries (r, n, v), the Gandanta flags (g: 1 the 12 minutes, 2 the 3°), Mrityu
  // Bana by tithi and lagna (b), the poison portions (w: 1 Wilhelm's, 2 the degrees, 4 Agarwal's
  // days, 8 the half ghati), the weekday (d, 0 = Sunday), Shridhar's §13.10 combinations (a, `advTable`)
  // and each event's own lagna and weekday codes (e, `eventTable`).
  const stretchesOf = (piece) => {
    const cuts = [piece.fromMs, ...marks.filter((ms) => ms > piece.fromMs && ms < piece.toMs), piece.toMs];
    const out = [];
    // The planets' navamsas: a navamsa is a pada, and pieces are cut at every planet's pada.
    const pieceMid = (piece.fromMs + piece.toMs) / 2;
    const pieceLon = Object.fromEntries(['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu'].map((p) => [p, longitudeOf(p, pieceMid, ayanamsha, nodeType)]));
    pieceLon.Ketu = norm360(pieceLon.Rahu + 180);
    const navSigns = Object.fromEntries(L.PLANETS.map((p) => [p, navSignOf(pieceLon[p])]));
    const moonN108 = Math.floor(pieceLon.Moon / (10 / 3)) % 108;
    for (let i = 0; i + 1 < cuts.length; i += 1) {
      const a = cuts[i];
      const b = cuts[i + 1];
      if (b <= a) continue;
      const mid = (a + b) / 2;
      const vi = lagnaKeyParts(keyIn(lagnaSegs, mid));
      const { n108, half, zone, sign } = vi;
      const retro = keyIn(retroSegs, mid);
      const l = lagnaShuddhiOf({
        lagna: sign,
        signs: piece.signs,
        retro: { Mars: Boolean(retro & 1), Saturn: Boolean(retro & 2) },
        night: nightAt(mid),
        gandanta: {
          MINUTES_12: inAny(g12, mid),
          DEGREES_3: (L.GANDANTA_START.includes(sign) && zone === 0) || (L.GANDANTA_END.includes(sign) && zone === 4),
        },
        natalLagna, natalMoon: natalMoonSign, tithi: piece.tithi,
      });
      const { houses, gandanta, banaMrityu, ...shared } = l;
      const nv = navamsaOf({ n108, half, signs: piece.signs, natalLagnaLongitude, natalLagna, natalMoon: natalMoonSign });
      const visha = vishanadiOf(vi, varaAt(mid), { first: inAny(ghatiWins.first, mid), middle: inAny(ghatiWins.middle, mid), last: inAny(ghatiWins.last, mid) });
      const entry = {
        r: table.ref({ ...shared, night: nightAt(mid), ashtama: { EIGHTH: l.ashtama.EIGHTH, FOUR_EIGHT_TWELVE: l.ashtama.FOUR_EIGHT_TWELVE } }),
        n: navTable.ref(nv),
        v: vargaTable.ref({ ...shadvargaOf(vi), drekkana: drekkanaOf(vi) }),
        g: (gandanta.MINUTES_12 ? 1 : 0) | (gandanta.DEGREES_3 ? 2 : 0),
        b: banaMrityu ? 1 : 0,
        w: (visha.WILHELM ? 1 : 0) | (visha.DEGREES ? 2 : 0) | (visha.AGARWAL_DAYS ? 4 : 0) | (visha.HALF_GHATI ? 8 : 0),
        d: varaAt(mid),
        a: advTable.ref(adverseOf({
          lagna: sign, d3: vi.d3, nav: n108 % 12, signs: piece.signs, navSigns, moonN108, ...motionAt(mid),
          natalLagna, natalMoon: natalMoonSign, natalNav8,
        })),
        // Each event's own rules for this stretch, book by book, and the Sun's house (for the door).
        e: evTable.ref({
          sunHouse: ((piece.signs.Sun - sign + 12) % 12) + 1,
          ...Object.fromEntries(EV.EVENTS.order.map((ev) => [ev, stretchCodesOf(ev, {
            lagna: sign, nav: n108 % 12, signs: piece.signs, natalLagna, natalMoon: natalMoonSign, combust: motionAt(mid).combust,
            dayPart: dayPartAt(mid), pradosha: pradoshaAt(mid), tithi: piece.tithi, star: Math.floor(piece.moonPada / 4),
            // Travel: the direction, the night's third, ghatis since sunrise, Abhijit muhurta, the planets' motion, the Moon in Abhijit.
            dir, nightPart: nightPartAt(mid), ghatis: ghatisAt(mid), abhijitMuhurta: abhijitAt(mid), retro: motionAt(mid).retro, abhijit: Boolean(piece.abhijit),
            // Vidyarambha: the lunar month, Vijayadashami's day, the planets' navamsa signs.
            month: piece.month, vijaya: Boolean(piece.vijaya), navSigns,
          }, varaAt(mid))])),
        }),
      };
      const sig = JSON.stringify(entry);
      const last = out[out.length - 1];
      if (last && last.sig === sig && last.toMs === a) { last.toMs = b; continue; }
      out.push({ sig, fromMs: a, toMs: b, entry });
    }
    return out.map((x) => [Math.round((x.fromMs - fromMs) / 1000), Math.round((x.toMs - fromMs) / 1000), x.entry.r, x.entry.n, x.entry.v, x.entry.g, x.entry.b, x.entry.w, x.entry.d, x.entry.a, x.entry.e]);
  };
  return { stretchesOf, table: table.all, navTable: navTable.all, vargaTable: vargaTable.all, advTable: advTable.all, evTable: evTable.all };
}

/**
 * Vijayadashami (Kalyanraman vol.2 p.96): the day — sunrise to sunrise at the place — on which Ashvin
 * Shukla 10 runs six ghatis or more after sunrise; if it runs less, the day before; a Dashami that
 * holds no sunrise falls in the day it runs in (our reading). Returns [[startMs, endMs]].
 */
function vijayadashamiDays({ fromMs, toMs, latitude, longitude, tithiWide, monthAt }) {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return [];
  const rises = [];
  for (let jd0 = Math.floor(jdOf(fromMs - 3 * DAY_MS) - 0.5) + 0.5; jd0 <= jdOf(toMs + 3 * DAY_MS); jd0 += 1) {
    const r = sunriseJulianDay(jd0, latitude, longitude);
    if (!Number.isFinite(r)) continue;
    const ms = Math.round((r - JD_UNIX_EPOCH) * DAY_MS);
    if (!rises.some((x) => Math.abs(x - ms) < 3600000)) rises.push(ms);
  }
  rises.sort((a, b) => a - b);
  const SIX_GHATIS = 6 * 24 * 60000;
  const days = [];
  for (const s of tithiWide) {
    if (s.key !== 9 || s.openStart || s.openEnd || monthAt(s.fromMs + 1) !== 6) continue;
    const inside = rises.filter((r) => s.fromMs <= r && r < s.toMs);
    const start = inside.length
      ? (s.toMs - inside[0] >= SIX_GHATIS ? inside[0] : rises.filter((r) => r < inside[0]).pop())
      : rises.filter((r) => r <= s.fromMs).pop();
    const end = start === undefined ? undefined : rises.find((r) => r > start);
    if (end !== undefined) days.push([start, end]);
  }
  return days;
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
 * @param natalMoonLongitude  sidereal, for the person's checks
 * @param natalLagnaLongitude sidereal, for the 8th-sign rule of lagna shuddhi (optional)
 * @param fromMs, toMs        the period (at most 120 days)
 * @param latitude, longitude the event's place: the lagna (shuddhi and the 88th-pada remedy), sunrise and sunset
 * @param natalLongitudes     { planet: sidereal longitude } at birth, for Shridhar §13.10.3 (optional)
 * @param direction           a journey's direction, 'E' … 'NE' (eventMuhurtaTables DIRECTIONS), for travel's rules (optional)
 */
function muhurtaStarChecks({ natalMoonLongitude, natalLagnaLongitude, fromMs, toMs, atMs = Date.now(), ayanamsha = 'Lahiri', nodeType = 'mean', latitude, longitude, natalLongitudes = null, direction = null }) {
  if (!Number.isFinite(natalMoonLongitude)) throw new UnsupportedInputError('natalMoonLongitude is required', 'natalMoonLongitude');
  if (!(toMs > fromMs) || toMs - fromMs > MAX_DAYS * DAY_MS) throw new UnsupportedInputError(`period must be 1-${MAX_DAYS} days`, 'toMs');
  const dir = direction === null || direction === undefined || direction === '' ? null : EV.DIRECTIONS.order.indexOf(direction);
  if (dir === -1) throw new UnsupportedInputError(`direction must be one of ${EV.DIRECTIONS.order.join(', ')}`, 'direction');
  const natalLagnaSign = Number.isFinite(natalLagnaLongitude) ? Math.floor(norm360(natalLagnaLongitude) / 30) : null;
  const janmaPada = padaOf(natalMoonLongitude);
  const janmaStar = Math.floor(janmaPada / 4);

  const natalSign = Math.floor(norm360(natalMoonLongitude) / 30);
  // Wilhelm: Chandrashtama "loses all capacity for ill" when these two are friends (BPHS natural, both ways — our reading).
  const natalLord = RASI_LORDS[natalSign];
  const eighthLord = RASI_LORDS[(natalSign + 7) % 12];
  const lordsFriends = natalLord === eighthLord || (naturalRelation(natalLord, eighthLord) === 'friend' && naturalRelation(eighthLord, natalLord) === 'friend');

  // Segments of every body (the Moon by slice of star, the rest by pada), of
  // the tithi and yoga, of the Sun's degree and of who is in Abhijit, then the
  // pieces between all their boundaries.
  const lon = (b, ms) => longitudeOf(b, ms, ayanamsha, nodeType);
  const keyFns = {
    Moon: (ms) => moonKeyOf(lon('Moon', ms)),
    ...Object.fromEntries(T.KICKERS.map((b) => [b, (ms) => padaOf(lon(b, ms))])),
    tithi: (ms) => Math.floor(norm360(lon('Moon', ms) - lon('Sun', ms)) / 12),
    yoga: (ms) => Math.floor(norm360(lon('Moon', ms) + lon('Sun', ms)) / YOGA) % 27,
    // The yoga's halves (0-53): travel leaves Parigha's first half (Joshi, Kalyanraman).
    yogaHalf: (ms) => Math.floor(norm360(lon('Moon', ms) + lon('Sun', ms)) / (YOGA / 2)) % 54,
    // The karana: half a tithi (6° of elongation), 0-59.
    karana: (ms) => Math.floor(norm360(lon('Moon', ms) - lon('Sun', ms)) / 6),
    // Venus behind the Sun in longitude (rising in the east, a morning star) or ahead.
    venusSide: (ms) => ((((lon('Venus', ms) - lon('Sun', ms) + 540) % 360) - 180) < 0 ? 1 : 0),
    sunDeg: (ms) => Math.floor(lon('Sun', ms)),
    abhijit: (ms) => DOSHA_PLANETS.reduce((bits, p, i) => bits | (inAbhijit(p === 'Ketu' ? norm360(lon('Rahu', ms) + 180) : lon(p, ms)) ? 1 << i : 0), 0),
  };
  const steps = { ...STEP_DAYS, tithi: 0.05, yoga: 0.05, yogaHalf: 0.025, karana: 0.025, sunDeg: 0.25, abhijit: 0.25, venusSide: 0.5 };
  const segs = Object.fromEntries(Object.keys(keyFns).map((b) => [b, scanKey(fromMs, toMs, keyFns[b], steps[b] * DAY_MS)]));
  const cuts = [...new Set(Object.values(segs).flatMap((ss) => ss.map((s) => s.fromMs)).concat([toMs]))].sort((a, b) => a - b);
  const keyAt = (b, ms) => segs[b].find((s) => s.fromMs <= ms && ms < s.toMs)?.key ?? segs[b][segs[b].length - 1].key;

  // Paata: the Moon's star when one of its six yogas ends strikes that star for
  // the whole of the Moon's passage through it — so the yogas and the Moon's
  // passages are scanned two days beyond each end of the period.
  const passages = scanKey(fromMs - 2 * DAY_MS, toMs + 2 * DAY_MS, (ms) => Math.floor(lon('Moon', ms) / STAR) % 27, STEP_DAYS.Moon * DAY_MS);
  const paataEnds = scanKey(fromMs - 2 * DAY_MS, toMs + 2 * DAY_MS, keyFns.yoga, steps.yoga * DAY_MS)
    .filter((s) => !s.openEnd && D.PAATA_YOGAS.includes(s.key))
    .map((s) => ({ yoga: s.key, atMs: s.toMs - 30000, moonPada: padaOf(lon('Moon', s.toMs - 30000)) }));
  const passageAt = (ms) => passages.find((p) => p.fromMs <= ms && ms < p.toMs);
  // The lunar month (amanta): from each new moon, named by the Sun's sign then (Chaitra with the Sun in Pisces).
  const newMoons = scanKey(fromMs - 32 * DAY_MS, toMs, keyFns.tithi, steps.tithi * DAY_MS)
    .filter((s) => s.key === 0 && !s.openStart)
    .map((s) => ({ ms: s.fromMs, month: (Math.floor(lon('Sun', s.fromMs) / 30) + 1) % 12 }));
  const monthAt = (ms) => newMoons.filter((n) => n.ms <= ms).pop()?.month ?? null;
  // The tithis two days beyond each end (Pradosha needs the end of a day's tithi), and the Sun's
  // ingresses: a tithi holding one is the Sankranti tithi.
  const tithiWide = scanKey(fromMs - 2 * DAY_MS, toMs + 2 * DAY_MS, keyFns.tithi, steps.tithi * DAY_MS);
  const ingresses = scanKey(fromMs - 2 * DAY_MS, toMs + 2 * DAY_MS, (ms) => Math.floor(lon('Sun', ms) / 30), 0.25 * DAY_MS)
    .filter((s) => !s.openStart).map((s) => s.fromMs);
  const tithiSegAt = (ms) => tithiWide.find((s) => s.fromMs <= ms && ms < s.toMs);
  const sankrantiAt = (ms) => { const s = tithiSegAt(ms); return Boolean(s) && ingresses.some((i) => s.fromMs <= i && i < s.toMs); };
  const vijayaDays = vijayadashamiDays({ fromMs, toMs, latitude, longitude, tithiWide, monthAt });
  const vijayaAt = (ms) => vijayaDays.some(([a, b]) => a <= ms && ms < b);
  // Pieces are cut where Vijayadashami's day begins and ends too.
  const pieceCuts = [...new Set([...cuts, ...vijayaDays.flat().filter((ms) => ms > fromMs && ms < toMs)])].sort((a, b) => a - b);

  const pieces = [];
  for (let i = 0; i + 1 < pieceCuts.length; i += 1) {
    const a = pieceCuts[i];
    const b = pieceCuts[i + 1];
    if (b <= a) continue;
    const mid = (a + b) / 2;
    const moonKey = keyAt('Moon', mid);
    const star = Math.floor(moonKey / 16);
    const slice = moonKey % 16;
    const moonPada = star * 4 + Math.floor(STAR_CUTS[slice] * 4 + 1e-9);
    const kickerPadas = Object.fromEntries(T.KICKERS.map((p) => [p, keyAt(p, mid)]));
    const planetSigns = Object.fromEntries(T.KICKERS.map((p) => [p, Math.floor(kickerPadas[p] / 9)]));
    planetSigns.Ketu = (planetSigns.Rahu + 6) % 12;
    const tithi = keyAt('tithi', mid) + 1;
    const latta = lattaOf(moonPada, kickerPadas);
    const personal = personalOf(janmaPada, moonPada);
    const tara = taraOf(janmaStar, star, slice);
    const chandra = chandraOf(natalSign, Math.floor(moonPada / 9), tithi <= 15 ? 'SHUKLA' : 'KRISHNA', tara.count, planetSigns);
    // Every reading's verdict, so the page needs no rules of its own and pieces merge only where all agree.
    const taraVerdicts = Object.fromEntries(T.TARA_BAD.order.map((bad) => [bad, Object.fromEntries(T.TARA_CYCLES.order.map((cy) => [cy, taraVerdict(tara, bad, cy)]))]));
    const chandraBala = Object.fromEntries(T.CHANDRA_READINGS.order.map((r) => [r,
      Object.fromEntries(T.CHANDRA_RELIEF.order.map((x) => [x, chandraPresent(chandra, r, x, lordsFriends)]))]));
    const bits = keyAt('abhijit', mid);
    const padas = { ...kickerPadas, Ketu: (kickerPadas.Rahu + 54) % 108 };
    const passage = passageAt(mid);
    const doshas = marriageDoshasOf({
      moon: { pada: moonPada, abhijit: moonInAbhijit(star, slice) },
      sun: { pada: kickerPadas.Sun, deg: keyAt('sunDeg', mid) % 30, abhijit: Boolean(bits & 1) },
      planets: Object.fromEntries(DOSHA_PLANETS.map((p, k) => [p, { pada: padas[p], abhijit: Boolean(bits & (1 << k)) }])),
      yoga: keyAt('yoga', mid),
      tithi,
      paataEnds: paataEnds.filter((e) => passage && passage.fromMs <= e.atMs && e.atMs < passage.toMs).map(({ yoga, moonPada: mp }) => ({ yoga, moonPada: mp })),
    });
    // The month, the Sun's sign and star, and each event's panchanga codes.
    const month = monthAt(mid);
    const sunStar = Math.floor(kickerPadas.Sun / 4);
    const signs = { ...planetSigns, Moon: Math.floor(moonPada / 9) };
    // A navamsa is a pada's: pieces are cut at every planet's pada, so the navamsas hold through the piece.
    const navs = { Sun: kickerPadas.Sun % 12, Jupiter: kickerPadas.Jupiter % 12, Moon: moonPada % 12 };
    // The 28 stars with Abhijit (Rahu's halves): the Moon's and Rahu's places, and the Moon's from Rahu's.
    const abhijit = moonInAbhijit(star, slice);
    const star28 = (inAbh, s) => (inAbh ? 21 : s <= 20 ? s : s + 1);
    const rahu28 = star28(Boolean(bits & (1 << DOSHA_PLANETS.indexOf('Rahu'))), Math.floor(kickerPadas.Rahu / 4));
    const ev = Object.fromEntries(EV.EVENTS.order.map((e) => [e, piecesCodesOf(e, {
      star, tithi, month, sunSign: planetSigns.Sun, sunStar, sunDeg: keyAt('sunDeg', mid) % 30, yoga: keyAt('yoga', mid),
      vishti: isVishti(keyAt('karana', mid)), sankranti: sankrantiAt(mid), taraCount: tara.count, signs, navs, moonPada, natalMoon: natalSign,
      vedha: { PANCHA: Boolean(doshas.VEDHA.readings.PANCHA), SAPTA: Boolean(doshas.VEDHA.readings.SAPTA) }, bana: Boolean(doshas.BANA.readings.SUN_DEGREE),
      dir, starFrac: STAR_CUTS[slice], yogaHalf: keyAt('yogaHalf', mid), rahuCount: ((star28(abhijit, star) - rahu28 + 28) % 28) + 1,
      venus: { east: keyAt('venusSide', mid) === 1, sign: planetSigns.Venus, star: Math.floor(kickerPadas.Venus / 4) }, natalLagna: natalLagnaSign,
      // Vidyarambha: the fixed karanas, the Moon in Abhijit, Vijayadashami's day.
      karanaFixed: isSthiraKarana(keyAt('karana', mid)), moonAbhijit: abhijit, vijaya: vijayaAt(mid),
    })]));
    const sig = JSON.stringify([moonPada, latta, personal, tara.n, tara.cycle, chandra, taraVerdicts, doshas, tithi, month, sunStar, ev, vijayaAt(mid)]);
    const last = pieces[pieces.length - 1];
    if (last && last.sig === sig && last.toMs === a) { last.toMs = b; last.tara.to = tara.to; continue; }
    pieces.push({ sig, fromMs: a, toMs: b, moonPada, latta, personal, tara, chandra, taraVerdicts, chandraBala, tithi, doshas, signs, month, sunStar, ev, abhijit, vijaya: vijayaAt(mid) });
  }

  const lagnasFor = lagnaStretches({ fromMs, toMs, latitude, longitude, ayanamsha, nodeType, natalLagnaLongitude, natalMoonSign: natalSign, natalLongitudes, tithiSegAt, dir });

  // The remedy, inside the 88th pada: the lagna sign through those hours.
  const remedyFor = (a, b) => {
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
    return scanKey(a, b, (ms) => Math.floor(siderealAscendant(jdOf(ms), latitude, longitude, ayanamsha) / 30) % 12, 10 * 60000)
      .map((s) => ({ fromUtc: iso(s.fromMs), toUtc: iso(s.toMs), lagna: s.key, lagnaTa: RASI_TA[s.key], ...lordsFriendly(s.key) }));
  };

  const lagnaTable = [];
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
    tithi: p.tithi,
    month: p.month, sunStar: p.sunStar, sunSign: p.signs.Sun, ev: p.ev,
    doshas: compactDoshas(p.doshas, lagnaTable),
    remedy88: p.personal.PADA_88 ? remedyFor(p.fromMs, p.toMs) : null,
    lagnas: lagnasFor ? lagnasFor.stretchesOf(p) : null,
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
      sign: natalSign, signTa: RASI_TA[natalSign],
      chandrashtamaLords: { natalLord, eighthLord, friends: lordsFriends },
    },
    place: Number.isFinite(latitude) && Number.isFinite(longitude) ? { latitude, longitude } : null,
    direction: dir === null ? null : EV.DIRECTIONS.order[dir],
    segments,
    // Jamitra from the lagna: [signs → planets in their 7th, lagna navamsas (padas) → planets in their 55th].
    jamitraLagnas: lagnaTable.map((s) => JSON.parse(s)),
    // Lagna shuddhi: each segment's `lagnas` are [f, t, r, n, v, g, b, w, d] — seconds from fromUtc;
    // indices into lagnaTable (the sign, the planets' houses, day or night), navamsaTable and
    // vargaTable (shadvarga and decanate); Gandanta, Bana, poison-portion bits; the weekday.
    lagnaTable: lagnasFor ? lagnasFor.table() : [],
    navamsaTable: lagnasFor ? lagnasFor.navTable() : [],
    vargaTable: lagnasFor ? lagnasFor.vargaTable() : [],
    adverseTable: lagnasFor ? lagnasFor.advTable() : [],
    eventTable: lagnasFor ? lagnasFor.evTable() : [],
    books: {
      lattaRank: T.LATTA_RANK, personalRank: T.PERSONAL_RANK, bookTa: T.BOOK_TA,
      rahu: T.RAHU_DIRECTION, padaRules: T.PADA_RULES, lattaSources: T.LATTA_SOURCES, lattaEffects: T.LATTA_EFFECTS,
      kicks: Object.fromEntries(T.KICKERS.map((p) => [p, { ...T.KICKS[p], planetTa: PLANET_TA[p] }])),
      personal: T.PERSONAL_CHECKS, vainashika: T.VAINASHIKA, remedy88: T.REMEDY_88, notesTa: T.NOTES_TA,
      taraNamesTa: T.TARA_NAMES_TA, taraRank: T.TARA_RANK, taraBad: T.TARA_BAD, taraCycles: T.TARA_CYCLES, secondRound: T.SECOND_ROUND,
      taraSources: T.TARA_SOURCES, taraNotesTa: T.TARA_NOTES_TA,
      chandraRank: T.CHANDRA_RANK, chandrashtamaKinds: T.CHANDRASHTAMA_KINDS, chandraRelief: T.CHANDRA_RELIEF, chandraReadings: T.CHANDRA_READINGS,
      chandraSources: T.CHANDRA_SOURCES, chandraNotesTa: T.CHANDRA_NOTES_TA, moonVedha: T.MOON_VEDHA, moonVedhaBright: T.MOON_VEDHA_BRIGHT,
      dasha: {
        doshas: D.DOSHAS, serious: D.SERIOUS, nameTa: D.NAME_TA, readings: D.READINGS, rules: D.RULES, rank: D.RANK,
        sources: D.SOURCES, notesTa: D.NOTES_TA, banaTa: D.BANA_TA, yogaTa: D.YOGA_TA, abhijitSource: D.ABHIJIT_SOURCE,
        // Bana by tithi and lagna: for tithi 1-30 (index 0-29), the lagna numbers (1 = Aries) giving each bana.
        banaLagnas: [...Array(30).keys()].map((i) => banaOf({ sun: { deg: 0 }, tithi: i + 1 }).lagnas),
      },
      lagna: {
        placements: L.PLACEMENTS, avoid: L.AVOID, points: L.POINTS, gradeTa: L.GRADE_TA, ashtama: L.ASHTAMA,
        pdbTa: L.PDB_TA, pdb: L.PDB, kartari: L.KARTARI, gandanta: L.GANDANTA, rank: L.RANK, sources: L.SOURCES, notesTa: L.NOTES_TA,
        navLast: L.NAV_LAST, navWhich: L.NAV_WHICH, navNatal: L.NAV_NATAL, udaya: L.UDAYA,
        shadvarga: L.SHADVARGA, drekkana: L.DREKKANA, vishanadi: L.VISHANADI, vargaTa: L.VARGA_TA, vargas: L.VARGAS, varaTa: L.VARA_TA, drekkanaTa: L.DREKKANA_TA,
        common: L.COMMON, commonWhyTa: L.COMMON_WHY_TA, events: L.EVENTS, scope: L.SCOPE, scopeOutTa: L.SCOPE_OUT_TA,
        adverse: L.ADVERSE, adverseTa: L.ADVERSE_TA, adverseCautionTa: L.ADVERSE_CAUTION_TA,
        tiers: L.TIERS, tierTa: L.TIER_TA, tierNoteTa: L.TIER_NOTE_TA,
        eventRules: EV.EVENTS, doors: EV.DOORS, monthTa: EV.MONTH_TA, starTa: NAKSHATRA_TA, eventRank: EV.RANK, eventSources: EV.SOURCES, eventCodeTa: EV.CODE_TA, eventNotesTa: EV.NOTES_TA, eventYears: EV.UPANAYANA_YEARS, directions: EV.DIRECTIONS,
        natalLagna: Number.isFinite(natalLagnaLongitude) ? Math.floor(norm360(natalLagnaLongitude) / 30) : null,
      },
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

/**
 * Chandra bala under a reading: true when present. The 8th is present only when relieved
 * (`reliefId`, CHANDRA_RELIEF; `lordsFriends`, the natal Moon's lord and the 8th lord).
 */
function chandraPresent(c, readingId, reliefId = 'NONE', lordsFriends = false) {
  const r = T.CHANDRA_READINGS[readingId];
  if (c.house === 8) return chandrashtamaRelieved(c, reliefId, lordsFriends);
  if (r.good) {
    const good = r.good.includes(c.house) || (c.paksha === 'SHUKLA' && r.goodBright.includes(c.house));
    return good && c.vedhaBy.length === 0;
  }
  return !r.bad.includes(c.house);
}

/** Whether a Chandrashtama is relieved: by its kind (Wilhelm's harmless three) or by the lords' friendship. */
function chandrashtamaRelieved(c, reliefId, lordsFriends) {
  const r = T.CHANDRA_RELIEF[reliefId];
  return c.house === 8 && ((r.kinds && Boolean(T.CHANDRASHTAMA_KINDS[c.chandrashtama]?.harmless)) || (r.friends && lordsFriends));
}

module.exports = { muhurtaStarChecks, personalOf, lattaOf, lordsFriendly, taraOf, chandraOf, taraVerdict, chandraPresent, chandrashtamaRelieved, dashaVerdict, moonInAbhijit, vijayadashamiDays, STAR_CUTS, MAX_DAYS };
