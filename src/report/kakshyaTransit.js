/**
 * Every planet's transit by Kakshya (doctrine in `kakshyaTransitTables.js`; the bindus, bhavas and Kakshya parts are
 * `saturnAshtakavarga.js`). At a moment: for each of the seven planets its bhava and Kakshya, the Kakshya's lord, and
 * whether that lord gave a bindu in the planet's own Ashtakavarga; whether the planet is debilitated, in an enemy's
 * sign or combust (Patel's sloka 5); how many of the seven are in bindu and how many in void Kakshyas (slokas 6-10);
 * and, for each planet, the dated Kakshya windows around the moment.
 */

const { planetLongitude } = require('../ephemeris/siderealPositions');
const { UnsupportedInputError } = require('../contracts/chartContext');
const { kakshyaParts, bhavaKakshyaOf, signKakshyaOf, prastara, ashtakavargaWith, natalPlacements, scanKey } = require('./saturnAshtakavarga');
const A = require('./saturnAshtakavargaTables');
const P = require('./phaladeepikaGocharaTables');
const T = require('./kakshyaTransitTables');
const R = require('./kakshyaResultsTables');
const { RASI_TA } = require('./saturnTransit');

const DAY_MS = 86400000;
const JD_UNIX_EPOCH = 2440587.5;
const norm360 = (d) => ((d % 360) + 360) % 360;
const toJd = (ms) => ms / DAY_MS + JD_UNIX_EPOCH;
const iso = (ms) => new Date(ms).toISOString();

/** Scan step, and how far back and forward the windows run, per planet (days). */
const SCAN = {
  Sun: { step: 1, back: 8, ahead: 40 }, Moon: { step: 1 / 12, back: 1, ahead: 6 }, Mars: { step: 1, back: 20, ahead: 150 },
  Mercury: { step: 0.5, back: 6, ahead: 30 }, Jupiter: { step: 2, back: 100, ahead: 500 }, Venus: { step: 1, back: 8, ahead: 45 },
  Saturn: { step: 2, back: 240, ahead: 900 },
};

const makeSky = (ayanamsha) => {
  const cache = new Map();
  const lon = (planet, ms) => {
    const key = `${planet}:${ms}`;
    let v = cache.get(key);
    if (v === undefined) {
      v = norm360(planetLongitude(toJd(ms), planet, ayanamsha));
      if (cache.size > 100000) cache.clear();
      cache.set(key, v);
    }
    return v;
  };
  /** Signed degrees a day, from six hours either side. */
  const speed = (planet, ms) => (norm360(lon(planet, ms + DAY_MS / 4) - lon(planet, ms - DAY_MS / 4) + 180) - 180) * 2;
  const elongation = (planet, ms) => Math.abs(norm360(lon(planet, ms) - lon('Sun', ms) + 180) - 180);
  return { lon, speed, elongation };
};

/** Patel's sloka 5 standing of one planet at one moment. */
function afflictionOf(planet, longitude, retrograde, elongation) {
  const sign = Math.floor(norm360(longitude) / 30);
  const d = P.dignityOf(planet, sign);
  const orb = P.combustionOrb(planet, retrograde);
  const combust = orb != null && elongation < orb;
  const reasons = [d.debilitated && 'DEBILITATED', d.enemySign && 'ENEMY_SIGN', combust && 'COMBUST'].filter(Boolean);
  return { exalted: d.exalted, own: d.own, debilitated: d.debilitated, enemySign: d.enemySign, combust, reasons, afflicted: reasons.length > 0 };
}

/**
 * @param natal { lagnaLongitude, mcLongitude, longitudes } sidereal, the seven planets
 * @param method 'PATEL_BHAVA' (default) or 'SIGN'
 */
function kakshyaTransit({ natal, atMs = Date.now(), ayanamsha = 'Lahiri', method = T.DEFAULT_KAKSHYA_METHOD, planets = T.PLANETS }) {
  const m = T.KAKSHYA_METHODS[method];
  if (!m || !['PATEL_BHAVA', 'SIGN'].includes(method)) throw new UnsupportedInputError(`unknown Kakshya method ${method}`, 'method');
  if (!Number.isFinite(atMs)) throw new UnsupportedInputError('a moment is required', 'atMs');
  const placements = natalPlacements(natal);
  const { bhavas } = placements;
  const bhavaMethod = m.division === 'BHAVA';
  const natalPos = bhavaMethod ? placements.bhava : placements.sign;
  const overrides = bhavaMethod ? A.PATEL_BINDU_DIFFERENCES : {};
  const pr = Object.fromEntries(T.PLANETS.map((p) => [p, prastara(p, natalPos, overrides)]));
  const sav = ashtakavargaWith(natalPos, overrides).sarva;
  const parts = kakshyaParts(m.division, bhavas);
  const sky = makeSky(ayanamsha);
  const lords = m.lords;
  const unitTa = (u) => (bhavaMethod ? `${u + 1}-ஆம் பாவம்` : RASI_TA[u]);

  const where = (lon) => {
    if (bhavaMethod) { const { bhava, kakshya } = bhavaKakshyaOf(lon, bhavas); return { unit: bhava - 1, kakshya }; }
    const { rasi, kakshya } = signKakshyaOf(lon);
    return { unit: rasi, kakshya };
  };
  const retroOf = (planet, ms) => (planet === 'Sun' || planet === 'Moon' ? false : sky.speed(planet, ms) < 0);
  const affOf = (planet, ms) => afflictionOf(planet, sky.lon(planet, ms), retroOf(planet, ms), planet === 'Sun' ? 99 : sky.elongation(planet, ms));

  const now = planets.map((planet) => {
    const lon = sky.lon(planet, atMs);
    const at = where(lon);
    const lord = lords[at.kakshya - 1];
    const bindu = pr[planet].rows[lord].includes(at.unit);
    const bav = pr[planet].bav[at.unit];
    const aff = affOf(planet, atMs);
    return {
      planet, planetTa: T.PLANET_TA[planet], longitude: lon, retrograde: retroOf(planet, atMs),
      rasiIndex: Math.floor(lon / 30), rasiTa: RASI_TA[Math.floor(lon / 30)],
      unit: at.unit, unitTa: unitTa(at.unit), kakshya: at.kakshya, lord, lordTa: T.PLANET_TA[lord],
      bindu, bhavaBindus: bav, affliction: aff, standing: !bindu ? 'VOID' : aff.afflicted ? 'SORROW' : 'BINDU',
      noBinduAtAll: bav === 0, allBindus: bav === 8,
      texts: {
        bhava: R.RESULTS[planet].primary[bav], bhavaOthers: R.RESULTS[planet].others[bav] ?? null,
        kakshya: bindu ? R.RESULTS[planet].kakshyaBindu : R.RESULTS[planet].kakshyaVoid,
      },
    };
  });

  const inBindu = now.filter((x) => x.bindu);
  const inVoid = now.filter((x) => !x.bindu);
  const together = {
    binduCount: inBindu.length, voidCount: inVoid.length,
    binduText: inBindu.length >= 4 ? T.TOGETHER.BINDU[inBindu.length] : null,
    voidText: inVoid.length >= 4 ? T.TOGETHER.VOID[inVoid.length] : null,
    moreThanThree: inBindu.length > 3,
    deathCertain: inVoid.length === 7 && now.some((x) => x.noBinduAtAll),
    allSeven: planets.length === 7,
  };

  // Dated windows around the moment, per planet.
  const windows = {};
  for (const planet of planets) {
    const sc = SCAN[planet];
    const from = atMs - sc.back * DAY_MS;
    const to = atMs + sc.ahead * DAY_MS;
    const segs = scanKey(from, to, (ms) => {
      const a = where(sky.lon(planet, ms));
      return a.unit * 8 + (a.kakshya - 1);
    }, sc.step * DAY_MS);
    const list = segs.map((seg) => {
      const part = parts[seg.key];
      const lord = lords[part.kakshya - 1];
      const bindu = pr[planet].rows[lord].includes(part.unit);
      const aff = affOf(planet, (seg.fromMs + seg.toMs) / 2);
      return {
        fromUtc: iso(seg.fromMs), toUtc: iso(seg.toMs), hours: Math.round(((seg.toMs - seg.fromMs) / 3600000) * 10) / 10,
        days: Math.round(((seg.toMs - seg.fromMs) / DAY_MS) * 100) / 100,
        openStart: !!seg.openStart, openEnd: !!seg.openEnd, current: seg.fromMs <= atMs && atMs < seg.toMs,
        unit: part.unit, unitTa: unitTa(part.unit), kakshya: part.kakshya, lord, lordTa: T.PLANET_TA[lord],
        bindu, standing: !bindu ? 'VOID' : aff.afflicted ? 'SORROW' : 'BINDU', fromLon: part.fromLon, toLon: part.toLon,
        spanMs: seg.toMs - seg.fromMs,
      };
    });
    const whole = list.filter((w) => !w.openStart && !w.openEnd);
    windows[planet] = {
      list: list.map(({ spanMs, ...w }) => w),
      meanDays: whole.length ? Math.round((whole.reduce((s, w) => s + w.spanMs, 0) / whole.length / DAY_MS) * 1000) / 1000 : null,
      wholeWindows: whole.length,
      span: { fromUtc: iso(from), toUtc: iso(to) },
    };
  }

  return {
    atUtc: iso(atMs), method: { id: method, labelTa: m.labelTa, explainTa: m.explainTa, division: m.division, sources: m.sources },
    bhavas, bhavaBindus: Object.fromEntries(T.PLANETS.map((p) => [p, pr[p].bav])), sarva: sav,
    planets: now, together, windows,
    doctrine: {
      sloka5: T.SLOKA_5_TA, sloka14: T.SLOKA_14_TA, strengthOrder: T.STRENGTH_ORDER, together: T.TOGETHER, bhavaExtremes: T.BHAVA_EXTREMES,
      average: { days: T.AVERAGE_DAYS, ta: T.AVERAGE_TA },
      sources: T.SOURCES, ourReadingsTa: [...T.OUR_READINGS_TA, ...R.OUR_READINGS_TA],
      resultSources: Object.fromEntries(Object.entries(R.RESULTS).map(([p, v]) => [p, v.sources])),
    },
  };
}

module.exports = { kakshyaTransit, afflictionOf, SCAN };
