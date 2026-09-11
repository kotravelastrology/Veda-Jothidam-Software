/**
 * ஜாமக்கோள் ப்ரசன்னம் — sunrise-anchored Tamil horary.
 *
 * Ported from the prior Jamakkol native app's spec engine
 * (`reference/source-engine.js`: jkComputeUdayam / jkComputeArudam /
 * jkSunVithi / jkComputeKavippu / jkDegPlanet / getJKBaseConst /
 * jkJamaSeqDeg / nokkiVarum / getKPChain). That engine's own low-precision
 * analytic ephemeris is replaced here by Kotravel's `@swisseph/node`
 * sidereal Sun + rise/set; every Jamakkol-specific formula is unchanged.
 *
 * Everything is a function of: the query instant (to the second), the
 * place, the sidereal Sun longitude, and the local sunrise/sunset.
 */
const { julianDay, HouseSystem, SiderealMode, setSiderealMode, calculateHouses, getAyanamsa } = require('@swisseph/node');
const { sunMoonLongitudes, sunriseJulianDay, sunsetJulianDay } = require('../ephemeris/siderealPositions');
const { kpChain } = require('./kpSystem');
const { computeTransitPositions } = require('./transitPositions');

const norm = (n) => ((n % 360) + 360) % 360;

const RASI_TA = ['மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கடகம்', 'சிம்மம்', 'கன்னி', 'துலாம்', 'விருச்சிகம்', 'தனுசு', 'மகரம்', 'கும்பம்', 'மீனம்'];
const JK_WEEKDAY_LORDS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const JK_JAMA_SEQ = ['Sun', 'Mars', 'Jupiter', 'Mercury', 'Venus', 'Saturn', 'Moon', 'Rahu'];
const JK_DAY_START_LORD = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const PLANET_TA = { Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது' };

// Weekday 0 = Sun. pakal = day birth, iravu = night birth. Values are degrees
// added to the sidereal Sun longitude to place each kāla point in the zodiac.
const JK_RAHU_DEG = { pakal: [180, 36, 154, 108, 132, 84, 60], iravu: [84, 108, 60, 180, 36, 154, 132] };
const JK_EMA_DEG = { pakal: [108, 84, 60, 36, 12, 154, 132], iravu: [12, 154, 132, 108, 84, 60, 36] };
const JK_MRITYU_DEG = { pakal: [60, 36, 12, 156, 132, 108, 84], iravu: [312, 288, 264, 240, 216, 192, 336] };
const JK_MANDI_DEG = { pakal: [156, 132, 108, 84, 60, 36, 12], iravu: [240, 216, 192, 336, 312, 288, 264] };

function placed(absDeg) {
  const d = norm(absDeg);
  const rasi = Math.floor(d / 30) % 12;
  return { deg360: d, rasi, rasiName: RASI_TA[rasi], degInRasi: d - rasi * 30 };
}

function jkComputeArudam(minute, second) {
  const totalMin = minute + second / 60;
  const rasi = Math.floor(totalMin / 5) % 12;
  const within = totalMin - Math.floor(totalMin / 5) * 5;
  return { rasi, deg: (within / 5) * 30, totalMin };
}

function jkSunVithi(sunRasi) {
  const rishaba = [0, 11, 6, 5];
  const mithuna = [8, 7, 9, 10];
  if (rishaba.includes(sunRasi)) return 1;
  if (mithuna.includes(sunRasi)) return 2;
  return 0;
}

function jkComputeKavippu(arudamRasi, udayamRasi, sunRasi, arudamDeg) {
  const vithi = jkSunVithi(sunRasi);
  const target = vithi;
  const n = ((target - arudamRasi + 12) % 12) + 1;
  const rasi = (udayamRasi + n - 1) % 12;
  const deg = 30 - arudamDeg;
  return { rasi, deg: deg < 0 ? deg + 30 : deg, n, vithi, vithiName: ['மேஷ வீதி', 'ரிஷப வீதி', 'மிதுன வீதி'][vithi] };
}

function jkComputeUdayam(nowHr, sunriseHr, sunsetHr, sunLon) {
  const isDay = nowHr >= sunriseHr && nowHr < sunsetHr;
  const dayLen = sunsetHr - sunriseHr;
  const nightLen = 24 - dayLen;
  const sunRasi = Math.floor(sunLon / 30) % 12;
  const sunDegInRasi = sunLon - sunRasi * 30;
  const maanamMin = (isDay ? dayLen : nightLen) * 60;
  const rasiUdayaMin = maanamMin / 12;
  const remFrac = (30 - sunDegInRasi) / 30;
  const remMin = remFrac * rasiUdayaMin;
  const baseHr = isDay ? sunriseHr : sunsetHr;
  let nowH = nowHr;
  if (!isDay && nowHr < sunsetHr) nowH += 24;
  let baseEndHr = baseHr + remMin / 60;
  if (!isDay && baseEndHr < sunsetHr) baseEndHr += 24;
  let segStart = baseHr;
  if (!isDay && segStart < sunsetHr) segStart += 24;

  let udayaRasi = sunRasi;
  let segS = segStart;
  let segE = baseEndHr;
  if (nowH < baseEndHr) { udayaRasi = sunRasi; segS = segStart; segE = baseEndHr; } else {
    let c = baseEndHr;
    let r = (sunRasi + 1) % 12;
    for (let k = 0; k < 12; k += 1) {
      const e = c + rasiUdayaMin / 60;
      if (nowH < e) { udayaRasi = r; segS = c; segE = e; break; }
      c = e; r = (r + 1) % 12;
    }
  }
  const segLen = segE - segS;
  let degInUdaya = segLen > 0 ? ((nowH - segS) / segLen) * 30 : 0;
  degInUdaya = Math.max(0, Math.min(30, degInUdaya));
  return { rasi: udayaRasi, deg: degInUdaya, isDay, sunRasi, sunDegInRasi };
}

/** Sidereal Ascendant at a JD (same tropical→sidereal correction as elsewhere). */
function siderealAscAt(jd, latitude, longitude) {
  setSiderealMode(SiderealMode.Lahiri);
  const h = calculateHouses(jd, latitude, longitude, HouseSystem.Placidus);
  return norm(h.ascendant - getAyanamsa(jd));
}

/**
 * @param q { year, month, day, hour, minute, second=0, latitude, longitude, utcOffsetMinutes }
 */
function calculateJamakkol(q) {
  const second = q.second || 0;
  const offMin = q.utcOffsetMinutes || 0;
  const utcHour = q.hour + q.minute / 60 + second / 3600 - offMin / 60;
  const jd = julianDay(q.year, q.month, q.day, utcHour);
  const jdMidnightUt = julianDay(q.year, q.month, q.day, -offMin / 60);

  const sunriseJd = sunriseJulianDay(jdMidnightUt, q.latitude, q.longitude);
  const sunsetJd = sunsetJulianDay(sunriseJd, q.latitude, q.longitude);
  const toLocalHr = (j) => ((((j - 2440587.5) * 86400000 + offMin * 60000) % 86400000) + 86400000) % 86400000 / 3600000;
  const sunriseHr = toLocalHr(sunriseJd);
  const sunsetHr = toLocalHr(sunsetJd);

  const nowHr = q.hour + q.minute / 60 + second / 3600;
  const { sunLongitude } = sunMoonLongitudes(jd, 'Lahiri');
  const sunLon = norm(sunLongitude);

  const localWeekday = new Date(Date.UTC(q.year, q.month - 1, q.day)).getUTCDay(); // 0 = Sun
  const jdWeekday = Math.floor(jd + 1.5) % 7;
  const isNight = !(nowHr >= sunriseHr && nowHr < sunsetHr);

  const ud = jkComputeUdayam(nowHr, sunriseHr, sunsetHr, sunLon);
  const ar = jkComputeArudam(q.minute, second);
  const kv = jkComputeKavippu(ar.rasi, ud.rasi, ud.sunRasi, ar.deg);

  const degPoint = (table) => placed(table[isNight ? 'iravu' : 'pakal'][localWeekday] + sunLon);
  const rahuKalam = degPoint(JK_RAHU_DEG);
  const emakandam = degPoint(JK_EMA_DEG);
  const mrityu = degPoint(JK_MRITYU_DEG);
  const mandi = degPoint(JK_MANDI_DEG);

  // 8 Jama planets
  const BASE = 540 + 45 * JK_JAMA_SEQ.indexOf(JK_WEEKDAY_LORDS[jdWeekday]);
  const startSeqIdx = JK_JAMA_SEQ.indexOf(JK_DAY_START_LORD[localWeekday]);
  const dayLen = sunsetHr - sunriseHr;
  const nightLen = 24 - dayLen;
  const dayJama = dayLen / 8;
  const nightJama = nightLen / 8;
  let activeI;
  if (nowHr >= sunriseHr && nowHr < sunsetHr) activeI = Math.min(7, Math.floor((nowHr - sunriseHr) / dayJama));
  else { const tt = nowHr < sunriseHr ? nowHr + 24 : nowHr; activeI = Math.min(7, Math.floor((tt - sunsetHr) / nightJama)); }

  const jamas = Array.from({ length: 8 }, (_, i) => {
    const seqIdx = (startSeqIdx + i) % 8;
    const lord = JK_JAMA_SEQ[seqIdx];
    const deg = norm(BASE - 30 * nowHr - 45 * seqIdx);
    const p = placed(deg);
    const startHr = isNight
      ? (sunsetHr + i * nightJama) % 24
      : (sunriseHr + i * dayJama) % 24;
    const endHr = isNight
      ? (sunsetHr + (i + 1) * nightJama) % 24
      : (sunriseHr + (i + 1) * dayJama) % 24;
    return {
      jamaNum: i + 1, lord, lordTa: PLANET_TA[lord], ...p,
      startHr, endHr, active: i === activeI,
    };
  });

  const nokkiVarum = (targetAbsDeg) => {
    let best = null;
    let bestDist = Infinity;
    for (const j of jamas) {
      const dist = norm(j.deg360 - targetAbsDeg);
      if (dist < bestDist) { bestDist = dist; best = j; }
    }
    if (!best) return { lord: '', pct: 0 };
    return { lord: best.lordTa, pct: Math.round(Math.max(0, Math.min(100, (45 - bestDist) / 45 * 100)) * 100) / 100 };
  };

  const lagnaLon = siderealAscAt(jd, q.latitude, q.longitude);
  const lagna = placed(lagnaLon);

  // Today's transiting grahas (கோசாரம்) at the query instant, for the chart box.
  const queryInstant = new Date(Date.UTC(q.year, q.month - 1, q.day, q.hour, q.minute, second) - offMin * 60000);
  const transitPlanets = computeTransitPositions(queryInstant, {
    latitude: q.latitude, longitude: q.longitude, ayanamsha: 'Lahiri', nodeType: 'mean',
  }).planets.map((p) => {
    const r = Math.floor(p.longitude / 30) % 12;
    return { id: p.planet, rasiIndex: r, degreeInSign: p.longitude - r * 30, retrograde: p.isRetrograde };
  });

  const point = (label, p) => ({
    label,
    rasi: p.rasi, rasiName: RASI_TA[p.rasi], deg: p.degInRasi ?? p.deg,
    abs: p.deg360 ?? (p.rasi * 30 + (p.degInRasi ?? p.deg)),
    kp: kpChain(p.deg360 ?? (p.rasi * 30 + (p.degInRasi ?? p.deg))),
    nokki: nokkiVarum(p.deg360 ?? (p.rasi * 30 + (p.degInRasi ?? p.deg))),
  });

  return {
    available: true,
    query: { ...q, second },
    sunLongitude: sunLon,
    sunriseHr, sunsetHr,
    isNight,
    weekday: localWeekday,
    points: [
      point('உதயம்', { rasi: ud.rasi, deg: ud.deg }),
      point('ஆரூடம்', { rasi: ar.rasi, deg: ar.deg }),
      point('கவிப்பு', { rasi: kv.rasi, deg: kv.deg }),
      point('குளிகன் (மாந்தி)', mandi),
      point('ராகு காலம்', rahuKalam),
      point('எமகண்டம்', emakandam),
      point('ம்ருத்யு', mrityu),
      point('லக்னம்', { rasi: lagna.rasi, deg: lagna.degInRasi }),
    ],
    kavippu: kv,
    jamas,
    activeJama: activeI + 1,
    lagnaRasiIndex: lagna.rasi,
    transitPlanets,
  };
}

module.exports = { calculateJamakkol, jkComputeArudam, jkComputeKavippu, jkComputeUdayam, jkSunVithi };
