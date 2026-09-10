/**
 * தினசரி முகூர்த்தம் — Choghaḍiyā, Gowri Panchāngam (Nalla Neram) and Hōrai
 * for a date + place. Pure over sunrise/sunset (from Kotravel's own Swiss
 * Ephemeris rise/set); no astronomy fork.
 *
 * Ported from the prior AstrologicLab `src/timing/{choghadiya,gowriPanchangam,
 * hora}.ts` (its GOV-REG-V11 F03 + Jātaka Alaṅkāram / Agathiyar Gowri +
 * classical Chaldean-hōra doctrine). Day = sunrise→sunset ÷ 8 (÷ 12 for hōra);
 * night = sunset→next sunrise ÷ 8 (÷ 12).
 */
const { julianDay } = require('@swisseph/node');
const { sunriseJulianDay, sunsetJulianDay } = require('../ephemeris/siderealPositions');

// ── Choghaḍiyā ──────────────────────────────────────────────────────────
const CHOGHADIYA_CYCLE = ['Udveg', 'Chal', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog'];
const CHOGHADIYA_TA = { Udveg: 'உத்வேக', Chal: 'சல', Labh: 'லாப', Amrit: 'அமிர்த', Kaal: 'கால', Shubh: 'சுப', Rog: 'ரோக' };
const CHOGHADIYA_LORD = { Udveg: 'Sun', Chal: 'Venus', Labh: 'Mercury', Amrit: 'Moon', Kaal: 'Saturn', Shubh: 'Jupiter', Rog: 'Mars' };
const CHOGHADIYA_QUALITY = { Amrit: 'good', Shubh: 'good', Labh: 'good', Chal: 'neutral', Udveg: 'bad', Kaal: 'bad', Rog: 'bad' };
const CHOG_DAY_START = [0, 3, 6, 2, 5, 1, 4];
const CHOG_NIGHT_START = [5, 1, 4, 0, 3, 6, 2];

// ── Gowri ───────────────────────────────────────────────────────────────
const GOWRI_CYCLE = ['uthi', 'amudham', 'rogam', 'soram', 'laabam', 'dhanam', 'visham', 'sugam'];
const GOWRI_TA = { uthi: 'உத்தி', amudham: 'அமுதம்', rogam: 'ரோகம்', soram: 'சோரம்', laabam: 'இலாபம்', dhanam: 'தனம்', visham: 'விஷம்', sugam: 'சுகம்' };
const GOWRI_AUSPICIOUS = { uthi: true, amudham: true, laabam: true, dhanam: true, sugam: true, rogam: false, soram: false, visham: false };
const GOWRI_DAY_START = [0, 1, 2, 3, 4, 5, 6];
const GOWRI_NIGHT_START = [1, 5, 3, 0, 7, 2, 4];

// ── Hōrai ───────────────────────────────────────────────────────────────
const CHALDEAN = ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'];
const WEEKDAY_LORD = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const HORA_QUALITY = { Jupiter: 'good', Venus: 'good', Mercury: 'good', Moon: 'good', Sun: 'neutral', Saturn: 'bad', Mars: 'bad' };
const HORA_NOTE = {
  Sun: 'அரசு/அதிகாரப் பணி', Moon: 'பயணம், நீர்/விவசாயம்', Mars: 'வழக்கு/போட்டி (சுபம் தவிர்)',
  Mercury: 'கல்வி, வியாபாரம்', Jupiter: 'அனைத்து சுப காரியங்களுக்கும் உத்தமம்', Venus: 'திருமணம், கலை',
  Saturn: 'நிலம்/கடின உழைப்பு (சுபம் தவிர்)',
};

const toLocalHr = (jd, offMin) => ((((jd - 2440587.5) * 86400000 + offMin * 60000) % 86400000) + 86400000) % 86400000 / 3600000;
const fmtHr = (h) => {
  const H = Math.floor(((h % 24) + 24) % 24);
  const M = Math.round((h - Math.floor(h)) * 60) % 60;
  return `${String(H).padStart(2, '0')}:${String(M).padStart(2, '0')}`;
};

/** @param q { year, month, day, latitude, longitude, utcOffsetMinutes } */
function calculateDailyMuhurta(q) {
  const off = q.utcOffsetMinutes || 0;
  const jdMid = julianDay(q.year, q.month, q.day, -off / 60);
  const sunrise = sunriseJulianDay(jdMid, q.latitude, q.longitude);
  const sunset = sunsetJulianDay(sunrise, q.latitude, q.longitude);
  const nextSunrise = sunriseJulianDay(sunset, q.latitude, q.longitude);

  const srHr = toLocalHr(sunrise, off);
  let ssHr = toLocalHr(sunset, off);
  if (ssHr <= srHr) ssHr += 24;
  let nsrHr = toLocalHr(nextSunrise, off);
  if (nsrHr <= ssHr) nsrHr += 24;

  const wd = new Date(Date.UTC(q.year, q.month - 1, q.day)).getUTCDay(); // 0 = Sun

  const buildEqual = (fromHr, toHr, n, startIdx, cycle, mapper, period) => {
    const span = (toHr - fromHr) / n;
    return Array.from({ length: n }, (_, i) => {
      const key = cycle[(startIdx + i) % cycle.length];
      return { index: i + 1, period, from: fmtHr(fromHr + i * span), to: fmtHr(fromHr + (i + 1) * span), ...mapper(key) };
    });
  };

  const chogMap = (name) => ({ name, nameTa: CHOGHADIYA_TA[name], lord: CHOGHADIYA_LORD[name], quality: CHOGHADIYA_QUALITY[name] });
  const gowriMap = (g) => ({ gowri: g, nameTa: GOWRI_TA[g], auspicious: GOWRI_AUSPICIOUS[g] });
  const horaMap = (lord) => ({ lord, quality: HORA_QUALITY[lord], note: HORA_NOTE[lord] });

  // Hōra starts at the weekday lord, then successive hōras in Chaldean order.
  const horaStartIdx = CHALDEAN.indexOf(WEEKDAY_LORD[wd]);

  return {
    available: true,
    sunrise: fmtHr(srHr),
    sunset: fmtHr(ssHr % 24),
    weekday: wd,
    choghadiya: {
      day: buildEqual(srHr, ssHr, 8, CHOG_DAY_START[wd], CHOGHADIYA_CYCLE, chogMap, 'day'),
      night: buildEqual(ssHr, nsrHr, 8, CHOG_NIGHT_START[wd], CHOGHADIYA_CYCLE, chogMap, 'night'),
    },
    gowri: {
      day: buildEqual(srHr, ssHr, 8, GOWRI_DAY_START[wd], GOWRI_CYCLE, gowriMap, 'day'),
      night: buildEqual(ssHr, nsrHr, 8, GOWRI_NIGHT_START[wd], GOWRI_CYCLE, gowriMap, 'night'),
    },
    hora: {
      day: buildEqual(srHr, ssHr, 12, horaStartIdx, CHALDEAN, horaMap, 'day'),
      night: buildEqual(ssHr, nsrHr, 12, (horaStartIdx + 12) % 7, CHALDEAN, horaMap, 'night'),
    },
  };
}

module.exports = { calculateDailyMuhurta };
