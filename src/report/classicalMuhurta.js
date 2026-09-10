/**
 * பாரம்பரிய முகூர்த்த தொகுப்பு — three classical timing tools ported from the
 * prior AstrologicLab `src/timing/*`:
 *
 *  1. Pañca-pakṣi (பஞ்சபட்சி) — the birth bird from Moon nakṣatra + pakṣa, and
 *     its activity (அரசு/ஊண்/நடை/துயில்/சாவு) across the day's 10 jāmas.
 *     Source of record: பதினெண் சித்தர்கள் பஞ்சபட்சி சாத்திரம் (Saraswati Mahal
 *     Library, Thanjavur; TVA_BOK_0022647), p.96-99 / 132-134 / 136 / 202-209.
 *  2. Yātrā muhūrta (யாத்ரா முகூர்த்தம்) — a travel election scored on
 *     Dik-śūla, lagna class, Aṣṭama-śuddhi, tithi/nakṣatra, Chandra-nivāsa and
 *     Yoginī-nivāsa. Muhūrta Chintāmaṇi Yātrā Prakaraṇam · Kalaprakāśikā ·
 *     Jyotirvidābharaṇa.
 *  3. Eclipse finder (கிரகணம்) — the next solar/lunar eclipses via Swiss
 *     Ephemeris, with the sidereal rāśi / nakṣatra the eclipse falls in.
 *
 * Positions from Kotravel's own Swiss Ephemeris. Nothing here predicts an
 * outcome; the yātrā result is a factor tally, not a verdict.
 */
const { julianDay, findNextSolarEclipse, findNextLunarEclipse } = require('@swisseph/node');
const { sunMoonLongitudes, sunriseJulianDay, sunsetJulianDay } = require('../ephemeris/siderealPositions');
const { siderealAscendant } = require('../ephemeris/swissEphemeris');
const { computeTransitPositions } = require('./transitPositions');

const norm360 = (d) => ((d % 360) + 360) % 360;
const NAK_SPAN = 360 / 27;
const DAY_MS = 86400000;
const jdToMs = (jd) => (jd - 2440587.5) * DAY_MS;
const msToJd = (ms) => ms / DAY_MS + 2440587.5;

const NAKSHATRA_TA = [
  'அசுவினி', 'பரணி', 'கிருத்திகை', 'ரோகிணி', 'மிருகசீரிடம்', 'திருவாதிரை', 'புனர்பூசம்',
  'பூசம்', 'ஆயில்யம்', 'மகம்', 'பூரம்', 'உத்திரம்', 'ஹஸ்தம்', 'சித்திரை', 'சுவாதி',
  'விசாகம்', 'அனுஷம்', 'கேட்டை', 'மூலம்', 'பூராடம்', 'உத்திராடம்', 'திருவோணம்',
  'அவிட்டம்', 'சதயம்', 'பூரட்டாதி', 'உத்திரட்டாதி', 'ரேவதி',
];
const RASI_TA = ['மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கடகம்', 'சிம்மம்', 'கன்னி', 'துலாம்', 'விருச்சிகம்', 'தனுசு', 'மகரம்', 'கும்பம்', 'மீனம்'];

// ═══ 1. PAÑCA-PAKṢI ══════════════════════════════════════════════════════════
const BIRD_ORDER = ['vulture', 'owl', 'crow', 'cock', 'peacock'];
const BIRD_TA = { vulture: 'வல்லூறு', owl: 'ஆந்தை', crow: 'காகம்', cock: 'கோழி', peacock: 'மயில்' };
const BIRD_EN = { vulture: 'Vulture', owl: 'Owl', crow: 'Crow', cock: 'Cock', peacock: 'Peacock' };
const ACTIVITY_TA = { rule: 'அரசு', eat: 'ஊண்', walk: 'நடை', sleep: 'துயில்', die: 'சாவு' };
const ACTIVITY_EN = { rule: 'Ruling', eat: 'Eating', walk: 'Walking', sleep: 'Sleeping', die: 'Dying' };
const ACTIVITY_QUALITY = { rule: 'auspicious', eat: 'auspicious', walk: 'neutral', sleep: 'inauspicious', die: 'inauspicious' };

// Śukla nakṣatra → bird groups: Vulture N1-5, Owl N6-11, Crow N12-16, Cock N17-22, Peacock N23-27.
const SHUKLA_GROUPS = [['vulture', 5], ['owl', 6], ['crow', 5], ['cock', 6], ['peacock', 5]];
const SHUKLA_BIRD_BY_NAK = SHUKLA_GROUPS.flatMap(([b, n]) => Array(n).fill(b));
const reverseBird = (b) => BIRD_ORDER[BIRD_ORDER.length - 1 - BIRD_ORDER.indexOf(b)];
const KRISHNA_BIRD_BY_NAK = SHUKLA_BIRD_BY_NAK.map(reverseBird);

function birthBird(nakIndex, paksha) {
  const i = ((nakIndex % 27) + 27) % 27;
  return paksha === 'shukla' ? SHUKLA_BIRD_BY_NAK[i] : KRISHNA_BIRD_BY_NAK[i];
}
function pakshaFromElongation(moonLon, sunLon) {
  return norm360(moonLon - sunLon) < 180 ? 'shukla' : 'krishna';
}

const B = { vulture: 0, owl: 1, crow: 2, cock: 3, peacock: 4 };
// jāma-1 ruling bird (Sun..Sat), per pakṣa × day/night — from C1.
const RULER_JAMA1 = {
  shukla: {
    day: [B.crow, B.cock, B.crow, B.cock, B.peacock, B.vulture, B.crow],
    night: [B.owl, B.crow, B.owl, B.crow, B.cock, B.peacock, B.vulture],
  },
  krishna: {
    day: [B.crow, B.cock, B.crow, B.owl, B.vulture, B.peacock, B.cock],
    night: [B.owl, B.peacock, B.owl, B.crow, B.cock, B.vulture, B.peacock],
  },
};
const RULER_STEP = { shukla: { day: -1, night: 1 }, krishna: { day: 2, night: 1 } };
const OFFSET_PATTERN = {
  shukla: { day: ['rule', 'sleep', 'die', 'eat', 'walk'], night: ['rule', 'eat', 'sleep', 'walk', 'die'] },
  krishna: { day: ['rule', 'eat', 'sleep', 'walk', 'die'], night: ['rule', 'die', 'walk', 'sleep', 'eat'] },
};
const TIMELINE_DURATIONS_MIN = {
  shukla: { day: { rule: 48, eat: 30, walk: 36, sleep: 18, die: 12 }, night: { rule: 24, eat: 30, walk: 30, sleep: 36, die: 24 } },
  krishna: { day: { rule: 18, eat: 48, walk: 36, sleep: 12, die: 30 }, night: { rule: 18, eat: 42, walk: 42, sleep: 18, die: 24 } },
};
const mod5 = (n) => ((n % 5) + 5) % 5;

function jamaRulingBird(paksha, dayNight, weekday, jamaIndex) {
  const wd = ((weekday % 7) + 7) % 7;
  const r0 = RULER_JAMA1[paksha][dayNight][wd];
  return BIRD_ORDER[mod5(r0 + RULER_STEP[paksha][dayNight] * jamaIndex)];
}
function birdActivityInJama(bird, paksha, dayNight, weekday, jamaIndex) {
  const ruler = BIRD_ORDER.indexOf(jamaRulingBird(paksha, dayNight, weekday, jamaIndex));
  const offset = mod5(BIRD_ORDER.indexOf(bird) - ruler);
  return OFFSET_PATTERN[paksha][dayNight][offset];
}

/** @param q { year, month, day, latitude, longitude, utcOffsetMinutes, moonLongitudeAtBirth?, sunLongitudeAtBirth? } */
function calculatePanchaPakshi(q) {
  const off = q.utcOffsetMinutes || 0;
  const jdMid = julianDay(q.year, q.month, q.day, -off / 60);
  const sunriseJd = sunriseJulianDay(jdMid, q.latitude, q.longitude);
  const sunsetJd = sunsetJulianDay(sunriseJd, q.latitude, q.longitude);
  const nextSunriseJd = sunriseJulianDay(jdMid + 1, q.latitude, q.longitude);
  const sunrise = jdToMs(sunriseJd);
  const sunset = jdToMs(sunsetJd);
  const nextSunrise = jdToMs(nextSunriseJd);

  const { sunLongitude, moonLongitude } = sunMoonLongitudes(sunriseJd, 'Lahiri');
  const dayPaksha = pakshaFromElongation(moonLongitude, sunLongitude);
  const weekday = new Date(Date.UTC(q.year, q.month - 1, q.day)).getUTCDay();

  // birth bird — from supplied natal Moon/Sun, else fall back to this day's
  const bMoon = typeof q.moonLongitudeAtBirth === 'number' ? q.moonLongitudeAtBirth : moonLongitude;
  const bSun = typeof q.sunLongitudeAtBirth === 'number' ? q.sunLongitudeAtBirth : sunLongitude;
  const bNak = Math.floor(norm360(bMoon) / NAK_SPAN) % 27;
  const bPaksha = pakshaFromElongation(bMoon, bSun);
  const bird = birthBird(bNak, bPaksha);

  const fmt = (ms) => {
    const d = new Date(ms + off * 60000);
    return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
  };

  const timeline = [];
  for (const [period, start, end] of [['day', sunrise, sunset], ['night', sunset, nextSunrise]]) {
    const len = (end - start) / 5;
    for (let j = 0; j < 5; j += 1) {
      const activity = birdActivityInJama(bird, dayPaksha, period, weekday, j);
      timeline.push({
        period,
        jama: j + 1,
        from: fmt(start + j * len),
        to: fmt(start + (j + 1) * len),
        rulingBird: jamaRulingBird(dayPaksha, period, weekday, j),
        rulingBirdTa: BIRD_TA[jamaRulingBird(dayPaksha, period, weekday, j)],
        activity,
        activityTa: ACTIVITY_TA[activity],
        activityEn: ACTIVITY_EN[activity],
        quality: ACTIVITY_QUALITY[activity],
        durationMin: TIMELINE_DURATIONS_MIN[dayPaksha][period][activity],
      });
    }
  }

  return {
    available: true,
    birthBird: { key: bird, ta: BIRD_TA[bird], en: BIRD_EN[bird], nakshatra: NAKSHATRA_TA[bNak], paksha: bPaksha },
    dayPaksha,
    sunrise: fmt(sunrise),
    sunset: fmt(sunset),
    timeline,
    source: 'பதினெண் சித்தர்கள் பஞ்சபட்சி சாத்திரம் (Saraswati Mahal Library, TVA_BOK_0022647) p.96-99 / 132-134 / 136 / 202-209',
  };
}

// ═══ 2. YĀTRĀ MUHŪRTA ════════════════════════════════════════════════════════
const DIRECTIONS = ['east', 'south', 'west', 'north'];
const DIRECTION_TA = { east: 'கிழக்கு', south: 'தெற்கு', west: 'மேற்கு', north: 'வடக்கு' };
const DIR_INDEX = { east: 0, south: 1, west: 2, north: 3 };
const DIKSHULA_BARRED = { east: [1, 6], south: [4], west: [0, 5], north: [2, 3] };
const CHARA = [0, 3, 6, 9];
const STHIRA = [1, 4, 7, 10];
const SHUBHA_TITHI = new Set([2, 3, 5, 7, 10, 11, 13]);
const RIKTA_TITHI = new Set([4, 9, 14]);
const SHUBHA_NAK = new Set([0, 4, 6, 7, 12, 14, 16, 21, 22, 23, 26]);
const DIR8_TA = ['கிழக்கு', 'தென்கிழக்கு', 'தெற்கு', 'தென்மேற்கு', 'மேற்கு', 'வடமேற்கு', 'வடக்கு', 'வடகிழக்கு'];
const TRAVEL_DIR8 = { east: 0, south: 2, west: 4, north: 6 };

function yoginiDir8(tithiIndex) {
  if (tithiIndex === 29) return 6;
  const t = (tithiIndex % 15) + 1;
  const MAP = [0, 7, 1, 2, 3, 4, 5, 6];
  const tt = t <= 8 ? t : t - 8;
  return MAP[tt - 1];
}

/** @param q { year, month, day, hour, minute, direction, latitude, longitude, utcOffsetMinutes, janmaRasi? } */
function calculateYatraMuhurta(q) {
  const off = q.utcOffsetMinutes || 0;
  const dir = DIRECTIONS.includes(q.direction) ? q.direction : 'east';
  const jd = julianDay(q.year, q.month, q.day, (q.hour + (q.minute || 0) / 60) - off / 60);
  const weekday = new Date(Date.UTC(q.year, q.month - 1, q.day)).getUTCDay();

  const ascLon = siderealAscendant(jd, q.latitude, q.longitude, 'Lahiri');
  const lagnaSign = Math.floor(norm360(ascLon) / 30) % 12;
  const { sunLongitude, moonLongitude } = sunMoonLongitudes(jd, 'Lahiri');
  const elong = norm360(moonLongitude - sunLongitude);
  const tithiIndex = Math.floor(elong / 12) % 30;
  const tithiNum = (tithiIndex % 15) + 1;
  const nakIndex = Math.floor(norm360(moonLongitude) / NAK_SPAN) % 27;
  const moonSign = Math.floor(norm360(moonLongitude) / 30) % 12;

  const factors = [];
  const F = (key, label, status, detail) => factors.push({ key, label, status, detail });

  // 1. Dik-śūla
  const barred = DIKSHULA_BARRED[dir].includes(weekday);
  F('dikshula', 'திக்கு சூலை', barred ? 'fail' : 'pass',
    barred ? `${DIRECTION_TA[dir]} திசைக்கு இந்தக் கிழமை சூலை` : 'கிழமை–திசை சரி');

  // 2. Lagna class
  const lagnaStatus = STHIRA.includes(lagnaSign) ? 'fail' : CHARA.includes(lagnaSign) ? 'pass' : 'neutral';
  F('lagna', 'லக்ன வகை', lagnaStatus,
    lagnaStatus === 'fail' ? `${RASI_TA[lagnaSign]} — ஸ்திர லக்னம், தவிர்க்கவும்`
      : lagnaStatus === 'pass' ? `${RASI_TA[lagnaSign]} — சர லக்னம், உத்தமம்`
        : `${RASI_TA[lagnaSign]} — உபய லக்னம், மத்திமம்`);

  // 3. Aṣṭama-śuddhi
  const eighth = (lagnaSign + 7) % 12;
  const tp = computeTransitPositions(new Date(Date.UTC(q.year, q.month - 1, q.day, q.hour, q.minute || 0) - off * 60000), {
    latitude: q.latitude, longitude: q.longitude, ayanamsha: 'Lahiri', nodeType: 'mean',
  });
  const inEighth = tp.planets.filter((p) => Math.floor(norm360(p.longitude) / 30) % 12 === eighth);
  F('ashtama', 'அஷ்டம சுத்தி', inEighth.length ? 'fail' : 'pass',
    inEighth.length ? `8-ல் ${inEighth.map((p) => p.planet).join(', ')}` : '8-ஆம் இடம் சுத்தம்');

  // 4. Tithi + nakṣatra
  const tithiStatus = RIKTA_TITHI.has(tithiNum) || tithiNum === 8 || tithiNum === 15 ? 'fail'
    : SHUBHA_TITHI.has(tithiNum) ? 'pass' : 'neutral';
  F('tithi', 'திதி', tithiStatus, `திதி ${tithiNum}${tithiIndex >= 15 ? ' (கிருஷ்ண)' : ' (சுக்ல)'}`);
  F('nakshatra', 'நட்சத்திரம்', SHUBHA_NAK.has(nakIndex) ? 'pass' : 'neutral',
    `${NAKSHATRA_TA[nakIndex]}${SHUBHA_NAK.has(nakIndex) ? ' — பயண சுபம்' : ' — பட்டியலில் இல்லை'}`);

  // 5. Chandra-nivāsa
  const moonDirIdx = moonSign % 4;
  const moonDirection = DIRECTIONS[moonDirIdx];
  const rel = (moonDirIdx - DIR_INDEX[dir] + 4) % 4;
  const relName = ['sammukha', 'dakshina', 'prishtha', 'vama'][rel];
  F('chandra-nivasa', 'சந்திர நிவாசம்', rel === 0 || rel === 1 ? 'pass' : 'fail',
    `சந்திரன் ${DIRECTION_TA[moonDirection]} (${['முன்', 'வலது', 'பின்', 'இடது'][rel]})`);

  // 6. Yoginī-nivāsa (opposite polarity: right/behind PASS, front/left FAIL)
  const yDir = yoginiDir8(tithiIndex);
  const yRel = (yDir - TRAVEL_DIR8[dir] + 8) % 8;
  const yStatus = yRel === 0 || yRel === 6 ? 'fail' : yRel === 2 || yRel === 4 ? 'pass' : 'neutral';
  F('yogini', 'யோகினி நிவாசம்', yStatus,
    `யோகினி ${DIR8_TA[yDir]}${yRel === 0 ? ' (முன் — நாசம்)' : yRel === 6 ? ' (இடது — நஷ்டம்)' : yRel === 2 ? ' (வலது — சுபம்)' : yRel === 4 ? ' (பின் — வெற்றி)' : ' (கோண திசை)'}`);

  // 7. Chandra-bala (optional)
  if (q.janmaRasi != null) {
    const count = ((moonSign - q.janmaRasi + 12) % 12) + 1;
    const bad = count === 4 || count === 8 || count === 12;
    F('chandra-bala', 'சந்திர பலம்', bad ? 'fail' : 'pass', `ஜென்ம ராசியிலிருந்து ${count}`);
  }

  const hasFail = factors.some((f) => f.status === 'fail');
  const allPass = factors.every((f) => f.status === 'pass');
  return {
    available: true,
    direction: dir,
    directionTa: DIRECTION_TA[dir],
    factors,
    overall: hasFail ? 'avoid' : allPass ? 'auspicious' : 'middling',
    moonDirection,
    chandraRelative: relName,
    source: 'Muhūrta Chintāmaṇi Yātrā Prakaraṇam · Kalaprakāśikā Yātrā Adhyāya · Jyotirvidābharaṇa',
  };
}

// ═══ 3. ECLIPSE FINDER ═══════════════════════════════════════════════════════
const ECLIPSE_TYPE_TA = { Total: 'முழு', Annular: 'வளைய', Partial: 'பகுதி', Penumbral: 'நிழல்', AnnularTotal: 'கலப்பு' };
function eclipseKind(typeBits) {
  if (typeBits & 4) return 'Total';
  if (typeBits & 32) return 'AnnularTotal';
  if (typeBits & 8) return 'Annular';
  if (typeBits & 64) return 'Penumbral';
  return 'Partial';
}

/** @param q { fromMs?, count? } — next solar + lunar eclipses, merged chronological. */
function upcomingEclipses(q = {}) {
  const fromJd = msToJd(q.fromMs || Date.now());
  const count = Math.max(1, Math.min(20, q.count || 8));
  const events = [];

  let cursor = fromJd;
  for (let i = 0; i < count + 2; i += 1) {
    const e = findNextSolarEclipse(cursor);
    if (!e || !Number.isFinite(e.maximum)) break;
    events.push(mkEclipse('solar', e));
    cursor = e.maximum + 1;
  }
  cursor = fromJd;
  for (let i = 0; i < count + 2; i += 1) {
    const e = findNextLunarEclipse(cursor);
    if (!e || !Number.isFinite(e.maximum)) break;
    events.push(mkEclipse('lunar', e));
    cursor = e.maximum + 1;
  }

  return {
    available: true,
    events: events
      .filter((e) => e.jd >= fromJd)
      .sort((a, b) => a.jd - b.jd)
      .slice(0, count),
    note: 'சூரிய கிரகணத்தின் உள்ளூர் தெரிவு பார்வையாளர் இடத்தைப் பொறுத்தது. நேரம் UTC.',
    source: 'Swiss Ephemeris — findNextSolarEclipse / findNextLunarEclipse',
  };
}
function mkEclipse(category, e) {
  const { sunLongitude, moonLongitude } = sunMoonLongitudes(e.maximum, 'Lahiri');
  const grahanaLon = category === 'solar' ? sunLongitude : moonLongitude;
  const kind = eclipseKind(e.type);
  const d = new Date(jdToMs(e.maximum));
  return {
    category,
    categoryTa: category === 'solar' ? 'சூரிய கிரகணம்' : 'சந்திர கிரகணம்',
    kind,
    kindTa: ECLIPSE_TYPE_TA[kind] || kind,
    jd: e.maximum,
    peakUtc: `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')} ${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')} UTC`,
    rasi: RASI_TA[Math.floor(norm360(grahanaLon) / 30) % 12],
    nakshatra: NAKSHATRA_TA[Math.floor(norm360(grahanaLon) / NAK_SPAN) % 27],
  };
}

module.exports = {
  calculatePanchaPakshi, calculateYatraMuhurta, upcomingEclipses,
  birthBird, pakshaFromElongation, jamaRulingBird, birdActivityInJama,
  BIRD_ORDER, BIRD_TA, ACTIVITY_TA, DIRECTIONS,
};
