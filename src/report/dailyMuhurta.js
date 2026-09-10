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
const { sunriseJulianDay, sunsetJulianDay, sunMoonLongitudes } = require('../ephemeris/siderealPositions');
const { siderealAscendant } = require('../ephemeris/swissEphemeris');

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

// ── Panchaka (Moon in the last 5 nakshatras) ───────────────────────────
const PANCHAK_NAKS = new Set([22, 23, 24, 25, 26]); // Dhanishtha..Revati
const PANCHAK_BY_WEEKDAY = [
  { name: 'ரோக பஞ்சகம்', severity: 'bad', note: 'ஞாயிறு — நோய்/உடல்நலம்' },
  { name: 'ராஜ பஞ்சகம்', severity: 'good', note: 'திங்கள் — சொத்து/பதவி லாபம்' },
  { name: 'அக்னி பஞ்சகம்', severity: 'bad', note: 'செவ்வாய் — தீ ஆபத்து; கட்டிடம்/நெருப்பு வேலை தவிர்' },
  null, null, // Wed/Thu — general
  { name: 'சோர பஞ்சகம்', severity: 'bad', note: 'வெள்ளி — களவு/நிதி இழப்பு' },
  { name: 'மிருத்யு பஞ்சகம்', severity: 'bad', note: 'சனி — உயிராபத்து; மிகுந்த கவனம்' },
];

// ── Nakshatra Karma (7-fold, Brihat Samhita ch.98) ─────────────────────
const NAK_KARMA = [
  { key: 'sthira', ta: 'ஸ்திரம் (த்ருவம்)', naks: [3, 11, 20, 25], suit: 'நிலையான காரியங்கள் — கிரகப்பிரவேசம், கட்டிடம், மரம் நடுதல், விதைப்பு, சாந்தி' },
  { key: 'chara', ta: 'சரம் (சலம்)', naks: [6, 14, 21, 22, 23], suit: 'நகரும் காரியங்கள் — பயணம், வாகனம், இயந்திரம், இடமாறுதல்' },
  { key: 'ugra', ta: 'உக்ரம் (குரூரம்)', naks: [1, 9, 10, 19, 24], suit: 'கடும் காரியங்கள் — ஆயுதம், தண்டனை; சுப காரியம் தவிர்' },
  { key: 'mishra', ta: 'மிஸ்ரம் (சாதாரணம்)', naks: [2, 15], suit: 'கலப்பு — அக்னி காரியம், ஹோமம், சாதாரண வேலைகள்' },
  { key: 'kshipra', ta: 'க்ஷிப்ரம் (லகு)', naks: [0, 7, 12], suit: 'விரைவு காரியங்கள் — வியாபாரம், மருத்துவம், கலை, ஆபரணம், பயணம்' },
  { key: 'mridu', ta: 'மிருது (மைத்ரம்)', naks: [4, 13, 16, 26], suit: 'மென்மையான காரியங்கள் — கல்வி, இசை/கலை, ஆடை, நட்பு, திருமணம்' },
  { key: 'tikshna', ta: 'தீக்ஷ்ணம் (தாருணம்)', naks: [5, 8, 17, 18], suit: 'கூர்மையான காரியங்கள் — மந்திரம், பிரிவு, அடக்குதல்; சுப காரியம் தவிர்' },
];
const NAK_KARMA_BY_INDEX = (() => { const a = new Array(27); for (const c of NAK_KARMA) for (const n of c.naks) a[n] = c; return a; })();

// ── Panchaka Rahitam (Muhurta Chintamani lagna-shuddhi remainder) ──────
const PANCHAKA_RAHITAM = {
  1: { ta: 'மிருத்யு பஞ்சகம்', ok: false, effect: 'மரண பயம், பெரும் ஆபத்து' },
  2: { ta: 'அக்னி பஞ்சகம்', ok: false, effect: 'தீ விபத்து, சேதம்' },
  4: { ta: 'ராஜ பஞ்சகம்', ok: false, effect: 'அரசு தடை, தண்டனை, நஷ்டம்' },
  6: { ta: 'சோர பஞ்சகம்', ok: false, effect: 'களவு பயம், நிதி இழப்பு' },
  8: { ta: 'ரோக பஞ்சகம்', ok: false, effect: 'நீண்டகால நோய்' },
  3: { ta: 'சுப பஞ்சகம்', ok: true, effect: 'நன்மையும் சுப பலனும்' },
  5: { ta: 'வம்சவிருத்தி பஞ்சகம்', ok: true, effect: 'குடும்ப வளர்ச்சி (திருமணத்திற்கு உத்தமம்)' },
  7: { ta: 'தேவதா பஞ்சகம்', ok: true, effect: 'தெய்வ அனுகிரகம், காரிய வெற்றி' },
  0: { ta: 'நிஷ்பஞ்சகம் (அமிர்த)', ok: true, effect: 'தோஷமற்ற மிகத் தூய்மையான முகூர்த்தம்' },
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

  // ── Moon-nakshatra / tithi / lagna at sunrise (day-level convention) ──
  const { sunLongitude, moonLongitude } = sunMoonLongitudes(sunrise, 'Lahiri');
  const norm = (d) => ((d % 360) + 360) % 360;
  const moonNak = Math.floor(norm(moonLongitude) / (360 / 27)) % 27;
  const elong = norm(moonLongitude - sunLongitude);
  const tithiNum = Math.floor(elong / 12) + 1; // 1-30
  const lagnaSunrise = siderealAscendant(sunrise, q.latitude, q.longitude, 'Lahiri');
  const lagnaNum = Math.floor(norm(lagnaSunrise) / 30) + 1; // 1-12
  const vaaraNum = wd + 1; // 1 = Sun

  const inPanchak = PANCHAK_NAKS.has(moonNak);
  const panchaka = {
    active: inPanchak,
    moonNakshatraIndex: moonNak,
    type: inPanchak ? (PANCHAK_BY_WEEKDAY[wd] || { name: 'பொது பஞ்சகம்', severity: 'neutral', note: 'புதன்/வியாழன் — பெயரிடப்பட்ட தோஷம் இல்லை' }) : null,
  };
  const nk = NAK_KARMA_BY_INDEX[moonNak];
  const nakshatraKarma = { key: nk.key, nameTa: nk.ta, suitable: nk.suit, moonNakshatraIndex: moonNak };
  const prRem = (tithiNum + vaaraNum + moonNak + 1 + lagnaNum) % 9;
  const panchakaRahitam = { remainder: prRem, ...PANCHAKA_RAHITAM[prRem] };

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
    panchaka,
    nakshatraKarma,
    panchakaRahitam,
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
