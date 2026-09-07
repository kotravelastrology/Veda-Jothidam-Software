const { julianDay, julianDayToDate } = require('@swisseph/node');
const { sunMoonLongitudes, sunriseJulianDay } = require('../ephemeris/siderealPositions');
const { attachSource } = require('../contracts/chartContext');

const PANCHANGAM_CALCULATIONS_SOURCE = {
  title: 'Panchangam Calculations',
  author: 'Karanam Ramakumar',
  file: 'Panchangam Calculations.pdf',
  tradition: 'Hindu Panchangam',
  convention: 'tirukanita',
};

const TITHI_NAMES = [
  'Prathama', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami',
  'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima',
  'Prathama', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami',
  'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya',
];

const NAKSHATRA_NAMES = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya',
  'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati',
  'Vishakha', 'Anuradha', 'Jyeshtha', 'Moola', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana',
  'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
];

const YOGA_NAMES = [
  'Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda', 'Sukarman', 'Dhriti',
  'Shoola', 'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra', 'Siddhi', 'Vyatipata',
  'Variyana', 'Parigha', 'Shiva', 'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma', 'Indra', 'Vaidhriti',
];

const MOVABLE_KARANAS = ['Bava', 'Balava', 'Kaulava', 'Taitila', 'Garaja', 'Vanija', 'Vishti'];

const VARA_NAMES = ['Ravivara', 'Somavara', 'Mangalavara', 'Budhavara', 'Guruvara', 'Shukravara', 'Shanivara'];

function normalizeDegrees(deg) {
  return ((deg % 360) + 360) % 360;
}

/** Karana naming per B.V. Raman, Muhurtha, file page 6 (S1-E): 4 fixed karanas
 * (Kimstughna at serial 0; Shakuni, Chatushpada, Naga at serials 57-59) bracket
 * 56 movable-karana slots, where the 7 movable names repeat 8 times. */
function karanaName(serial) {
  if (serial === 0) return 'Kimstughna';
  if (serial === 57) return 'Shakuni';
  if (serial === 58) return 'Chatushpada';
  if (serial === 59) return 'Naga';
  return MOVABLE_KARANAS[(serial - 1) % 7];
}

function tithiIndexAt(jd, ayanamsha) {
  const { sunLongitude, moonLongitude } = sunMoonLongitudes(jd, ayanamsha);
  return Math.floor(normalizeDegrees(moonLongitude - sunLongitude) / 12);
}
function nakshatraIndexAt(jd, ayanamsha) {
  const { moonLongitude } = sunMoonLongitudes(jd, ayanamsha);
  return Math.floor(normalizeDegrees(moonLongitude) / (360 / 27));
}
function yogaIndexAt(jd, ayanamsha) {
  const { sunLongitude, moonLongitude } = sunMoonLongitudes(jd, ayanamsha);
  return Math.floor(normalizeDegrees(moonLongitude + sunLongitude) / (360 / 27));
}
function karanaSerialAt(jd, ayanamsha) {
  const { sunLongitude, moonLongitude } = sunMoonLongitudes(jd, ayanamsha);
  return Math.floor(normalizeDegrees(moonLongitude - sunLongitude) / 6);
}

/** Bisects to the moment `getIndexFn` stops returning `indexAtLow`, between two
 * JDs known to bracket exactly one boundary (see findLimbWindow's step scan). */
function bisectBoundary(getIndexFn, jdLow, jdHigh, indexAtLow, ayanamsha) {
  let lo = jdLow;
  let hi = jdHigh;
  for (let i = 0; i < 30; i += 1) {
    const mid = (lo + hi) / 2;
    if (getIndexFn(mid, ayanamsha) === indexAtLow) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

/** Scans outward from `jdAtSunrise` in fixed steps (well under the shortest
 * realistic limb duration) to find the start and end boundary of whichever
 * limb value holds at sunrise. */
function findLimbWindow(getIndexFn, jdAtSunrise, ayanamsha, stepDays = 1 / 48, maxSteps = 200) {
  const indexAtSunrise = getIndexFn(jdAtSunrise, ayanamsha);

  let end = jdAtSunrise;
  for (let i = 0; i < maxSteps; i += 1) {
    const next = end + stepDays;
    if (getIndexFn(next, ayanamsha) !== indexAtSunrise) {
      end = bisectBoundary(getIndexFn, end, next, indexAtSunrise, ayanamsha);
      break;
    }
    end = next;
  }

  let start = jdAtSunrise;
  for (let i = 0; i < maxSteps; i += 1) {
    const prev = start - stepDays;
    if (getIndexFn(prev, ayanamsha) !== indexAtSunrise) {
      start = bisectBoundary(getIndexFn, prev, start, getIndexFn(prev, ayanamsha), ayanamsha);
      break;
    }
    start = prev;
  }

  return { index: indexAtSunrise, startJulianDay: start, endJulianDay: end };
}

function formatLocalDateTime(jd, utcOffsetMinutes) {
  const local = julianDayToDate(jd + utcOffsetMinutes / 1440);
  const totalMinutes = Math.round(local.hour * 60);
  const hour = Math.floor(totalMinutes / 60) % 24;
  const minute = totalMinutes % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return `${local.year}-${pad(local.month)}-${pad(local.day)} ${pad(hour)}:${pad(minute)}`;
}

function weekdayIndexAt(localDateTimeJd) {
  const local = julianDayToDate(localDateTimeJd);
  return new Date(Date.UTC(local.year, local.month - 1, local.day)).getUTCDay();
}

function varaAt(localDateTimeJd) {
  return VARA_NAMES[weekdayIndexAt(localDateTimeJd)];
}

/**
 * S3 — Tirukanita Panchangam (WORKFLOW-REGISTER-001 S3; PLAN-001 item 3).
 * Computes Vara, Tithi, Nakshatra, Yoga and Karana with start/end times for
 * the calendar date in `chartContext`, using the sunrise-day-boundary rule
 * and five-limb definitions verified in S1-B.
 */
function calculateTirukanitaPanchangam(chartContext) {
  if (chartContext.calendarMode !== 'tirukanita') {
    throw new RangeError('calculateTirukanitaPanchangam requires calendarMode "tirukanita"');
  }
  const { year, month, day, latitude, longitude, utcOffsetMinutes } = chartContext.input;
  const { ayanamsha } = chartContext;

  const localMidnightUtcHour = -utcOffsetMinutes / 60;
  const jdLocalMidnight = julianDay(year, month, day, localMidnightUtcHour);
  const sunriseJd = sunriseJulianDay(jdLocalMidnight, latitude, longitude);

  const tithi = findLimbWindow(tithiIndexAt, sunriseJd, ayanamsha);
  const nakshatra = findLimbWindow(nakshatraIndexAt, sunriseJd, ayanamsha);
  const yoga = findLimbWindow(yogaIndexAt, sunriseJd, ayanamsha);
  const karana = findLimbWindow(karanaSerialAt, sunriseJd, ayanamsha);

  const withTimes = (limb) => ({
    index: limb.index,
    startLocal: formatLocalDateTime(limb.startJulianDay, utcOffsetMinutes),
    endLocal: formatLocalDateTime(limb.endJulianDay, utcOffsetMinutes),
    startJulianDay: limb.startJulianDay,
    endJulianDay: limb.endJulianDay,
  });

  const result = {
    date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    sunriseLocal: formatLocalDateTime(sunriseJd, utcOffsetMinutes),
    sunriseJulianDay: sunriseJd,
    vara: varaAt(sunriseJd + utcOffsetMinutes / 1440),
    tithi: { name: TITHI_NAMES[tithi.index], ...withTimes(tithi) },
    nakshatra: { name: NAKSHATRA_NAMES[nakshatra.index], ...withTimes(nakshatra) },
    yoga: { name: YOGA_NAMES[yoga.index], ...withTimes(yoga) },
    karana: { name: karanaName(karana.index), ...withTimes(karana) },
  };

  return attachSource(result, {
    ...PANCHANGAM_CALCULATIONS_SOURCE,
    pageLocus: 'file pages 1, 10, 13, 15, 18 (S1-B)',
  });
}

module.exports = {
  calculateTirukanitaPanchangam,
  karanaName,
  weekdayIndexAt,
  TITHI_NAMES,
  NAKSHATRA_NAMES,
  YOGA_NAMES,
  VARA_NAMES,
};
