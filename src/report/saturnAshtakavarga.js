/**
 * Saturn's transit refined by Ashtakavarga and Kakshya.
 *
 * The Saturn page already says *which house from the Moon* Saturn is in. The
 * Ashtakavarga books go further: how many bindus that house holds in Saturn's
 * own Ashtakavarga (and in the Sarvashtakavarga), and — inside the house —
 * which eighth part (Kakshya) Saturn is crossing and whether that part's lord
 * gave a bindu there. They also list what else to watch while Saturn moves:
 * retrogression, combustion, the nakshatra and navamsha it enters.
 *
 * Doctrine lives in `saturnAshtakavargaTables.js`; this file computes.
 *
 * ## Two ways to cut the zodiac
 *
 *  - **Sign method** (PL manual, Vishnu Bhaskar, Vinay Aditya): each sign in 8
 *    parts of 3°45′; the Ashtakavarga is counted from the planets' signs.
 *  - **Bhava method** (Patel): Sripati bhavas — the four angles from the
 *    Lagna and MC, each quadrant trisected, the sandhi halfway between two
 *    cusps — and each bhava cut into 4 equal parts from its starting sandhi to
 *    its cusp and 4 from the cusp to its ending sandhi. The Ashtakavarga is
 *    counted from the planets' *bhavas*, so a planet that sits in one sign but
 *    the next bhava changes the bindus. The bhavas are computed here from the
 *    Lagna and MC alone, whatever house system the chart was saved with,
 *    because the method is Patel's and he names the system (p.69).
 *
 * `test-saturn-ashtakavarga.js` reproduces both of Patel's worked charts —
 * the bhava table, the Sun's Prastara, Saturn's bindus by bhava, the Lagna
 * bhava's bindu Kakshyas, and Edward VII's bhavas, bindus and natal Kakshyas.
 */

const { planetLongitude } = require('../ephemeris/siderealPositions');
const { UnsupportedInputError } = require('../contracts/chartContext');
const { BINDU_TABLE, CONTRIBUTORS, TARGET_PLANETS } = require('../chart/ashtakavarga');
const { naturalRelation } = require('../chart/planetaryRelationship');
const { RASI_LORD } = require('../chart/karaka');
const { NAKSHATRA_LORDS } = require('../dasha/vimshottariDasha');
const { NAKSHATRA_TA } = require('./babyNames');
const { RASI_TA } = require('./saturnTransit');
const A = require('./saturnAshtakavargaTables');

const DAY_MS = 86400000;
const YEAR_MS = 365.25 * DAY_MS;
const JD_UNIX_EPOCH = 2440587.5;
const NAKSHATRA_DEGREES = 360 / 27;
const NAVAMSHA_DEGREES = 30 / 9;
const SIGN_KAKSHYA_DEGREES = 30 / 8;

const norm360 = (d) => ((d % 360) + 360) % 360;
/** Forward arc from `a` to `b`, in [0, 360). */
const arc = (a, b) => norm360(b - a);
const toJd = (ms) => ms / DAY_MS + JD_UNIX_EPOCH;
const iso = (ms) => new Date(ms).toISOString();
const days = (a, b) => Math.round(((b - a) / DAY_MS) * 10) / 10;

// ---------------------------------------------------------------------------
// Bhavas and Kakshya parts
// ---------------------------------------------------------------------------

/**
 * Sripati bhavas from the sidereal Lagna and MC: cusps 1, 4, 7, 10 at the
 * angles, each quadrant trisected along the ecliptic, and each bhava running
 * from the sandhi before its cusp to the sandhi after it, a sandhi lying
 * halfway between two successive cusps.
 */
function sripatiBhavas(lagnaLongitude, mcLongitude) {
  if (!Number.isFinite(lagnaLongitude) || !Number.isFinite(mcLongitude)) {
    throw new UnsupportedInputError('the Lagna and MC longitudes are required', 'bhavas');
  }
  const cusp = new Array(13);
  cusp[1] = norm360(lagnaLongitude);
  cusp[10] = norm360(mcLongitude);
  cusp[4] = norm360(cusp[10] + 180);
  cusp[7] = norm360(cusp[1] + 180);
  for (const [from, to] of [[1, 4], [4, 7], [7, 10], [10, 13]]) {
    const start = cusp[from];
    const span = arc(start, cusp[to === 13 ? 1 : to]);
    cusp[from + 1] = norm360(start + span / 3);
    cusp[from + 2] = norm360(start + (2 * span) / 3);
  }
  const after = (n) => norm360(cusp[n] + arc(cusp[n], cusp[n === 12 ? 1 : n + 1]) / 2);
  return Array.from({ length: 12 }, (_, i) => {
    const n = i + 1;
    return { number: n, start: after(n === 1 ? 12 : n - 1), cusp: cusp[n], end: after(n) };
  });
}

/** The 96 Kakshya parts of the zodiac for one division, each with its longitude range. */
function kakshyaParts(division, bhavas) {
  const parts = [];
  if (division === 'SIGN') {
    for (let r = 0; r < 12; r += 1) {
      for (let k = 0; k < 8; k += 1) {
        parts.push({ unit: r, kakshya: k + 1, fromLon: r * 30 + k * SIGN_KAKSHYA_DEGREES, toLon: r * 30 + (k + 1) * SIGN_KAKSHYA_DEGREES });
      }
    }
    return parts;
  }
  for (const b of bhavas) {
    const first = arc(b.start, b.cusp) / 4;
    const second = arc(b.cusp, b.end) / 4;
    for (let k = 0; k < 8; k += 1) {
      const from = k < 4 ? norm360(b.start + k * first) : norm360(b.cusp + (k - 4) * second);
      const to = k < 4 ? norm360(b.start + (k + 1) * first) : norm360(b.cusp + (k - 3) * second);
      parts.push({ unit: b.number - 1, kakshya: k + 1, fromLon: from, toLon: to });
    }
  }
  return parts;
}

/** Which bhava (1–12) and which of its Kakshyas (1–8) a longitude falls in. */
function bhavaKakshyaOf(longitude, bhavas) {
  const lon = norm360(longitude);
  for (const b of bhavas) {
    const into = arc(b.start, lon);
    const width = arc(b.start, b.end);
    if (into < width) {
      const toCusp = arc(b.start, b.cusp);
      const k = into < toCusp
        ? Math.floor(into / (toCusp / 4))
        : 4 + Math.floor((into - toCusp) / (arc(b.cusp, b.end) / 4));
      return { bhava: b.number, kakshya: Math.min(k, 7) + 1 };
    }
  }
  // Only reachable through floating-point at the very end of bhava 12.
  return { bhava: 12, kakshya: 8 };
}

const signKakshyaOf = (longitude) => {
  const lon = norm360(longitude);
  return { rasi: Math.floor(lon / 30), kakshya: Math.floor((lon % 30) / SIGN_KAKSHYA_DEGREES) + 1 };
};

/** The signs a longitude range [from, to) touches, in order. */
function rasisOfRange(fromLon, toLon) {
  const first = Math.floor(norm360(fromLon) / 30);
  const width = arc(fromLon, toLon);
  const last = Math.floor(norm360(fromLon + Math.max(0, width - 1e-9)) / 30);
  const out = [first];
  for (let r = first; r !== last;) { r = (r + 1) % 12; out.push(r); }
  return out;
}

// ---------------------------------------------------------------------------
// Prastara: who gives a bindu where
// ---------------------------------------------------------------------------

/**
 * The Prastarashtakavarga of `target`: for each contributor, the units (signs
 * or bhavas, 0–11) where it gives a bindu, and the per-unit totals. `positions`
 * maps the eight contributors to their unit index. `overrides` replaces cells
 * of the bindu table ({ Moon: { Jupiter: [...] } }) — Patel's two differences.
 */
function prastara(target, positions, overrides = {}) {
  const table = { ...BINDU_TABLE[target], ...(overrides[target] ?? {}) };
  const rows = {};
  const bav = new Array(12).fill(0);
  for (const c of CONTRIBUTORS) {
    const at = positions[c];
    if (!Number.isInteger(at) || at < 0 || at > 11) throw new UnsupportedInputError(`no position for ${c}`, 'positions');
    rows[c] = table[c].map((offset) => (at + offset - 1) % 12).sort((x, y) => x - y);
    for (const u of rows[c]) bav[u] += 1;
  }
  return { rows, bav };
}

/** Bhinnashtakavarga of the seven planets and their sum, with optional table overrides. */
function ashtakavargaWith(positions, overrides = {}) {
  const bhinna = {};
  const sarva = new Array(12).fill(0);
  for (const p of TARGET_PLANETS) {
    bhinna[p] = prastara(p, positions, overrides).bav;
    for (let i = 0; i < 12; i += 1) sarva[i] += bhinna[p][i];
  }
  return { bhinna, sarva };
}

/** Natal positions of the eight contributors by sign and by Sripati bhava. */
function natalPlacements({ lagnaLongitude, mcLongitude, longitudes }) {
  const bhavas = sripatiBhavas(lagnaLongitude, mcLongitude);
  const sign = { Lagna: Math.floor(norm360(lagnaLongitude) / 30) };
  const bhava = { Lagna: 0 };
  for (const p of CONTRIBUTORS) {
    if (p === 'Lagna') continue;
    const lon = longitudes[p];
    if (!Number.isFinite(lon)) throw new UnsupportedInputError(`no natal longitude for ${p}`, 'longitudes');
    sign[p] = Math.floor(norm360(lon) / 30);
    bhava[p] = bhavaKakshyaOf(lon, bhavas).bhava - 1;
  }
  return { bhavas, sign, bhava };
}

// ---------------------------------------------------------------------------
// Scanning Saturn's motion
// ---------------------------------------------------------------------------

/**
 * Splits [fromMs, toMs] wherever `keyFn` changes value, sampling once a day
 * and bisecting each change to a minute. A key that leaves and returns within
 * one day is missed; none of the keys used here can (Saturn moves at most
 * about 0.13° a day, and the narrowest division is about one degree).
 */
function scanKey(fromMs, toMs, keyFn, stepMs = DAY_MS) {
  const segs = [];
  let cur = { key: keyFn(fromMs), fromMs, openStart: true };
  let prevMs = fromMs;
  for (let t = fromMs + stepMs; ; t += stepMs) {
    const ms = Math.min(t, toMs);
    const k = keyFn(ms);
    let lo = prevMs;
    for (let guard = 0; k !== cur.key && guard < 8; guard += 1) {
      let a = lo;
      let b = ms;
      while (b - a > 60000) {
        const m = (a + b) / 2;
        if (keyFn(m) === cur.key) a = m; else b = m;
      }
      cur.toMs = b;
      segs.push(cur);
      cur = { key: keyFn(b), fromMs: b };
      lo = b;
    }
    prevMs = ms;
    if (ms >= toMs) break;
  }
  cur.toMs = toMs;
  cur.openEnd = true;
  segs.push(cur);
  return segs;
}

function makeSky(ayanamsha) {
  const cache = new Map();
  const lon = (planet, ms) => {
    const key = `${planet}:${ms}`;
    let v = cache.get(key);
    if (v === undefined) {
      v = norm360(planetLongitude(toJd(ms), planet, ayanamsha));
      if (cache.size > 200000) cache.clear();
      cache.set(key, v);
    }
    return v;
  };
  const saturn = (ms) => lon('Saturn', ms);
  /** Degrees per day, signed; six hours either side. */
  const speed = (ms) => {
    const d = norm360(lon('Saturn', ms + DAY_MS / 4) - lon('Saturn', ms - DAY_MS / 4) + 180) - 180;
    return d * 2;
  };
  const elongation = (ms) => {
    const d = Math.abs(norm360(lon('Saturn', ms) - lon('Sun', ms) + 180) - 180);
    return d;
  };
  return { saturn, speed, elongation };
}

const overlapMs = (aFrom, aTo, bFrom, bTo) => Math.max(0, Math.min(aTo, bTo) - Math.max(aFrom, bFrom));
const overlapDays = (seg, list) => Math.round((list.reduce((s, x) => s + overlapMs(seg.fromMs, seg.toMs, x.fromMs, x.toMs), 0) / DAY_MS) * 10) / 10;

// ---------------------------------------------------------------------------
// Dignity and relations for Saturn in a sign
// ---------------------------------------------------------------------------

function saturnInSign(rasi) {
  const S = A.SATURN_SIGNS;
  if (rasi === S.exalted) return 'EXALTED';
  if (rasi === S.debilitated) return 'DEBILITATED';
  if (rasi === S.moolatrikona.sign) return 'MOOLATRIKONA_OR_OWN';
  if (S.own.includes(rasi)) return 'OWN';
  const rel = naturalRelation('Saturn', RASI_LORD[rasi]);
  return rel === 'friend' ? 'FRIEND' : rel === 'enemy' ? 'ENEMY' : 'NEUTRAL';
}

const relationTo = (lord) => {
  if (lord === 'Saturn') return 'SELF';
  if (!['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus'].includes(lord)) return null;
  return naturalRelation('Saturn', lord).toUpperCase();
};

// ---------------------------------------------------------------------------
// House readings
// ---------------------------------------------------------------------------

function vaBand(bindus) {
  return A.VA_BANDS.find((b) => b.bindus.includes(bindus)) ?? null;
}

function houseReadings({ moonRasiIndex, sign, bhava, signSav, bhavaSav }) {
  const vinayAditya = Array.from({ length: 12 }, (_, i) => {
    const rasi = (moonRasiIndex + i) % 12;
    const bav = sign.bav[rasi];
    const band = vaBand(bav);
    return { house: i + 1, rasiIndex: rasi, rasiTa: RASI_TA[rasi], bav, sav: signSav[rasi], verdict: band?.verdict ?? null, verdictTa: band?.ta ?? null };
  });

  const max = Math.max(...bhava.bav);
  const patel = bhava.bav.map((bav, i) => ({
    bhava: i + 1,
    bav,
    sav: bhavaSav[i],
    textTa: A.PATEL_BY_BINDUS[bav] ?? null,
    otherAuthorsTa: A.PATEL_OTHER_AUTHORS[bav] ?? null,
    highest: bav === max,
    zero: bav === 0,
  }));

  const VB = A.VISHNU_BHASKAR_HOUSE;
  const sadeSati = [12, 1, 2].map((house) => {
    const rasi = (moonRasiIndex + house - 1) % 12;
    const sav = signSav[rasi];
    const bav = sign.bav[rasi];
    return {
      house, rasiIndex: rasi, rasiTa: RASI_TA[rasi], sav, bav,
      savAbove: sav > VB.sadeSati.savThreshold,
      bavAbove5: bav > 5,
      bavAbove6: bav > 6,
    };
  });
  const vishnuBhaskar = {
    sadeSatiRows: sadeSati,
    allSavAbove: sadeSati.every((h) => h.savAbove),
    byHouse: vinayAditya.map((r) => ({ house: r.house, rasiIndex: r.rasiIndex, rasiTa: r.rasiTa, bav: r.bav, textTa: A.VB_BY_BINDUS[r.bav] ?? null })),
  };

  return {
    order: A.HOUSE_READING_RANK.order,
    rank: A.HOUSE_READING_RANK,
    VINAY_ADITYA: { rows: vinayAditya, ...A.VINAY_ADITYA_HOUSE },
    PATEL: { rows: patel, ...A.PATEL_HOUSE },
    VISHNU_BHASKAR: { ...vishnuBhaskar, ...A.VISHNU_BHASKAR_HOUSE },
  };
}

// ---------------------------------------------------------------------------
// The whole computation
// ---------------------------------------------------------------------------

/**
 * @param natal        { lagnaLongitude, mcLongitude, longitudes: {Sun..Saturn} } (sidereal)
 * @param moonRasiIndex / moonNakshatraIndex / moonLongitude  the natal Moon
 * @param rahuDashas   [{ fromMs, toMs }] — Rahu's Vimshottari mahadasha(s)
 * @param fromMs, toMs the window the timelines cover; atMs "now"
 */
function saturnAshtakavarga({
  natal, moonRasiIndex, moonNakshatraIndex, moonLongitude, rahuDashas = [],
  fromMs, toMs, atMs = Date.now(), ayanamsha = 'Lahiri',
}) {
  if (!(Number.isInteger(moonRasiIndex) && moonRasiIndex >= 0 && moonRasiIndex < 12)) {
    throw new UnsupportedInputError('moonRasiIndex must be 0-11', 'moonRasiIndex');
  }
  if (!(Number.isFinite(fromMs) && Number.isFinite(toMs) && toMs > fromMs) || (toMs - fromMs) / YEAR_MS > 40) {
    throw new UnsupportedInputError('the window must run forwards and be at most 40 years', 'window');
  }

  const placements = natalPlacements(natal);
  const { bhavas } = placements;
  const sign = prastara('Saturn', placements.sign);
  const bhava = prastara('Saturn', placements.bhava, A.PATEL_BINDU_DIFFERENCES);
  const signSav = ashtakavargaWith(placements.sign).sarva;
  // Patel's block is Patel's method throughout, so its Sarvashtakavarga uses
  // his table; the bhavas where Vinay Aditya's table would give another total
  // are reported rather than hidden.
  const bhavaSav = ashtakavargaWith(placements.bhava, A.PATEL_BINDU_DIFFERENCES).sarva;
  const bhavaSavOtherTable = ashtakavargaWith(placements.bhava).sarva;
  const savTableDiffers = bhavaSav
    .map((v, i) => ({ bhava: i + 1, patel: v, vinayAditya: bhavaSavOtherTable[i] }))
    .filter((d) => d.patel !== d.vinayAditya);

  const sky = makeSky(ayanamsha);

  // Retrogression, stations and combustion.
  const motion = scanKey(fromMs, toMs, (ms) => (sky.speed(ms) < 0 ? 1 : 0));
  const retro = motion.filter((s) => s.key === 1);
  const stationHalf = A.STATION_DAYS * DAY_MS;
  const stations = motion.slice(1).map((s) => ({
    atMs: s.fromMs, turns: s.key === 1 ? 'RETROGRADE' : 'DIRECT',
    fromMs: s.fromMs - stationHalf, toMs: s.fromMs + stationHalf,
  }));
  const combustSegs = scanKey(fromMs, toMs, (ms) => (sky.elongation(ms) < A.SATURN_COMBUSTION_DEGREES ? 1 : 0))
    .filter((s) => s.key === 1);

  const dignityOf = (rasis) => rasis.map((r) => ({ rasiIndex: r, dignity: saturnInSign(r) }));

  // Kakshya windows, per method.
  const signScan = scanKey(fromMs, toMs, (ms) => Math.floor(sky.saturn(ms) / SIGN_KAKSHYA_DEGREES) % 96);
  const bhavaScan = scanKey(fromMs, toMs, (ms) => {
    const { bhava: b, kakshya } = bhavaKakshyaOf(sky.saturn(ms), bhavas);
    return (b - 1) * 8 + (kakshya - 1);
  });
  const signParts = kakshyaParts('SIGN');
  const bhavaParts = kakshyaParts('BHAVA', bhavas);

  function windowsFor(method) {
    const m = A.KAKSHYA_METHODS[method];
    const scan = m.division === 'SIGN' ? signScan : bhavaScan;
    const parts = m.division === 'SIGN' ? signParts : bhavaParts;
    const pr = m.division === 'SIGN' ? sign : bhava;
    return scan.map((seg) => {
      const part = parts[seg.key];
      const lord = m.lords[part.kakshya - 1];
      const bindu = pr.rows[lord].includes(part.unit);
      const rasis = rasisOfRange(part.fromLon, part.toLon);
      const dignities = dignityOf(rasis);
      const retroDays = overlapDays(seg, retro);
      const combustDays = overlapDays(seg, combustSegs);
      const debilitated = dignities.some((d) => d.dignity === 'DEBILITATED');
      const enemySign = dignities.some((d) => d.dignity === 'ENEMY');
      return {
        fromUtc: iso(seg.fromMs), toUtc: iso(seg.toMs), days: days(seg.fromMs, seg.toMs),
        openStart: !!seg.openStart, openEnd: !!seg.openEnd,
        current: seg.fromMs <= atMs && atMs < seg.toMs,
        division: m.division,
        unit: part.unit,
        unitTa: m.division === 'SIGN' ? RASI_TA[part.unit] : `${part.unit + 1}-ஆம் பாவம்`,
        kakshya: part.kakshya,
        lord,
        lordTa: A.PLANET_TA[lord],
        lordRelation: relationTo(lord),
        bindu,
        bav: pr.bav[part.unit],
        fromLon: part.fromLon, toLon: part.toLon,
        rasis,
        rasisTa: rasis.map((r) => RASI_TA[r]),
        housesFromMoon: rasis.map((r) => ((r - moonRasiIndex + 12) % 12) + 1),
        dignities,
        retroDays, combustDays,
        afflictedInBindu: bindu && (debilitated || enemySign || combustDays > 0),
      };
    });
  }
  const methods = {};
  for (const id of A.KAKSHYA_RANK.order) {
    const windows = windowsFor(id);
    methods[id] = {
      ...A.KAKSHYA_METHODS[id],
      windows,
      now: windows.find((w) => w.current) ?? null,
      binduWindows: windows.filter((w) => w.bindu).length,
    };
  }

  // Nakshatra and navamsha stays.
  const nakshatras = scanKey(fromMs, toMs, (ms) => Math.floor(sky.saturn(ms) / NAKSHATRA_DEGREES) % 27).map((seg) => {
    const lord = NAKSHATRA_LORDS[seg.key];
    const count = Number.isInteger(moonNakshatraIndex) ? ((seg.key - moonNakshatraIndex + 27) % 27) + 1 : null;
    const tara = count === null ? null : ((count - 1) % 9) + 1;
    return {
      fromUtc: iso(seg.fromMs), toUtc: iso(seg.toMs), days: days(seg.fromMs, seg.toMs),
      openStart: !!seg.openStart, openEnd: !!seg.openEnd, current: seg.fromMs <= atMs && atMs < seg.toMs,
      nakshatraIndex: seg.key, nakshatraTa: NAKSHATRA_TA[seg.key], lord, lordTa: A.PLANET_TA[lord], lordRelation: relationTo(lord),
      count, tara,
      adverseTara: tara !== null && A.WATCH.tara.adverse.includes(tara),
      adverseExact: count !== null && A.WATCH.tara.adverse.includes(count),
      retroDays: overlapDays(seg, retro),
    };
  });
  const navamshas = scanKey(fromMs, toMs, (ms) => Math.floor(sky.saturn(ms) / NAVAMSHA_DEGREES) % 108).map((seg) => {
    const navSign = seg.key % 12;
    const lord = RASI_LORD[navSign];
    return {
      fromUtc: iso(seg.fromMs), toUtc: iso(seg.toMs), days: days(seg.fromMs, seg.toMs),
      openStart: !!seg.openStart, openEnd: !!seg.openEnd, current: seg.fromMs <= atMs && atMs < seg.toMs,
      navamshaIndex: seg.key, rasiIndex: Math.floor(seg.key / 9), rasiTa: RASI_TA[Math.floor(seg.key / 9)],
      navamshaSign: navSign, navamshaSignTa: RASI_TA[navSign], lord, lordTa: A.PLANET_TA[lord], lordRelation: relationTo(lord),
    };
  });

  // Chandra navamsha rasi (and the Moon's own rasi), with Rahu's dasha.
  const moonNavamshaSign = Number.isFinite(moonLongitude) ? Math.floor(norm360(moonLongitude) / NAVAMSHA_DEGREES) % 12 : null;
  const rasiScan = scanKey(fromMs, toMs, (ms) => Math.floor(sky.saturn(ms) / 30) % 12);
  const staysIn = (rasi) => rasiScan.filter((s) => s.key === rasi).map((s) => ({
    fromUtc: iso(s.fromMs), toUtc: iso(s.toMs), days: days(s.fromMs, s.toMs),
    openStart: !!s.openStart, openEnd: !!s.openEnd, current: s.fromMs <= atMs && atMs < s.toMs,
    rahuDashaDays: overlapDays(s, rahuDashas),
  }));

  const describe = (segs) => segs.map((s) => ({
    fromUtc: iso(s.fromMs), toUtc: iso(s.toMs), days: days(s.fromMs, s.toMs),
    openStart: !!s.openStart, openEnd: !!s.openEnd, current: s.fromMs <= atMs && atMs < s.toMs,
  }));

  return {
    window: { fromUtc: iso(fromMs), toUtc: iso(toMs), atUtc: iso(atMs) },
    bhavas,
    placements: { sign: placements.sign, bhava: placements.bhava },
    prastara: { sign, bhava },
    sav: { sign: signSav, bhava: bhavaSav, bhavaTableDiffers: savTableDiffers, tableNote: A.PATEL_BINDU_NOTE },
    houseReadings: houseReadings({ moonRasiIndex, sign, bhava, signSav, bhavaSav }),
    kakshya: {
      order: A.KAKSHYA_RANK.order,
      defaultMethod: A.DEFAULT_KAKSHYA_METHOD,
      rank: A.KAKSHYA_RANK,
      methods,
      readings: A.KAKSHYA_READINGS,
    },
    watch: {
      retrograde: describe(retro),
      stations: stations.map((s) => ({
        atUtc: iso(s.atMs), turns: s.turns, fromUtc: iso(s.fromMs), toUtc: iso(s.toMs),
        current: s.fromMs <= atMs && atMs < s.toMs,
      })),
      combust: describe(combustSegs),
      nakshatras,
      navamshas,
      moonRasi: { rasiIndex: moonRasiIndex, stays: staysIn(moonRasiIndex) },
      moonNavamsha: moonNavamshaSign === null ? null : { rasiIndex: moonNavamshaSign, stays: staysIn(moonNavamshaSign) },
      rahuDashas: rahuDashas.map((d) => ({ fromUtc: iso(d.fromMs), toUtc: iso(d.toMs), current: d.fromMs <= atMs && atMs < d.toMs })),
      now: {
        retrograde: retro.some((s) => s.fromMs <= atMs && atMs < s.toMs),
        station: stations.find((s) => s.fromMs <= atMs && atMs < s.toMs) ? true : false,
        combust: combustSegs.some((s) => s.fromMs <= atMs && atMs < s.toMs),
        elongation: Math.round(sky.elongation(atMs) * 10) / 10,
        longitude: sky.saturn(atMs),
        dignity: saturnInSign(Math.floor(sky.saturn(atMs) / 30)),
      },
      texts: A.WATCH,
      combustionDegrees: A.SATURN_COMBUSTION_DEGREES,
    },
  };
}

module.exports = {
  saturnAshtakavarga, sripatiBhavas, kakshyaParts, bhavaKakshyaOf, signKakshyaOf, prastara, ashtakavargaWith, natalPlacements,
  rasisOfRange, scanKey, saturnInSign,
};
