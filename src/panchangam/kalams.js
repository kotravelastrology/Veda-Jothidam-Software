const { julianDayToDate } = require('@swisseph/node');
const { attachSource, sourceRequired } = require('../contracts/chartContext');

const PANCHANGAM_CALCULATIONS_SOURCE = {
  title: 'Panchangam Calculations',
  author: 'Karanam Ramakumar',
  file: 'Panchangam Calculations.pdf',
  tradition: 'Hindu Panchangam',
  convention: 'tirukanita',
};

/** Weekday-indexed multipliers (index 0=Sunday..6=Saturday, matching
 * VARA_NAMES/getUTCDay), verified at S1-B file pages 22-23: start = sunrise +
 * dayDuration * multiplier; duration = dayDuration * 0.125 for all three. */
const RAHU_KALAM_MULTIPLIERS = [0.875, 0.125, 0.75, 0.5, 0.625, 0.375, 0.25];
const GULIKA_KALAM_MULTIPLIERS = [0.75, 0.625, 0.5, 0.375, 0.25, 0.125, 0];
const YAMAGANDAM_MULTIPLIERS = [0.5, 0.375, 0.25, 0.125, 0, 0.75, 0.625];

/** Durmuhurtham windows per weekday, verified at S1-B file page 23. Each
 * window's `from` is 'sunrise' or 'sunset', its `basis` is 'day' or 'night'
 * duration, and duration is always dayDuration * 0.8/12 per the source table
 * (stated uniformly, including for the one night-based window on Tuesday). */
const DURMUHURTHAM_WINDOWS = [
  [{ from: 'sunrise', basis: 'day', fraction: 10.4 / 12 }],
  [{ from: 'sunrise', basis: 'day', fraction: 6.4 / 12 }, { from: 'sunrise', basis: 'day', fraction: 8.8 / 12 }],
  [{ from: 'sunrise', basis: 'day', fraction: 2.4 / 12 }, { from: 'sunset', basis: 'night', fraction: 4.8 / 12 }],
  [{ from: 'sunrise', basis: 'day', fraction: 5.6 / 12 }],
  [{ from: 'sunrise', basis: 'day', fraction: 4 / 12 }, { from: 'sunrise', basis: 'day', fraction: 8.8 / 12 }],
  [{ from: 'sunrise', basis: 'day', fraction: 2.4 / 12 }, { from: 'sunrise', basis: 'day', fraction: 6.4 / 12 }],
  [{ from: 'sunrise', basis: 'day', fraction: 1.6 / 12 }],
];
const DURMUHURTHAM_DURATION_FRACTION = 0.8 / 12;

/** Amrita Gadiya / Varjyam table by nakshatra, verified at S1-B file page 21.
 * `x` values assume a 24-hour nakshatra; actual start/duration scale by the
 * real nakshatra duration per the formula on file page 20. Moola alone has
 * two Varjyam windows, per the source table (not simplified away). */
const AMRITA_VARJYAM_TABLE = {
  Ashwini: { amrita: 16.8, varjyam: [20] },
  Bharani: { amrita: 19.2, varjyam: [9.6] },
  Krittika: { amrita: 21.6, varjyam: [12] },
  Rohini: { amrita: 20.8, varjyam: [16] },
  Mrigashira: { amrita: 15.2, varjyam: [5.6] },
  Ardra: { amrita: 14, varjyam: [8.4] },
  Punarvasu: { amrita: 21.6, varjyam: [12] },
  Pushya: { amrita: 17.6, varjyam: [8] },
  Ashlesha: { amrita: 22.4, varjyam: [12.8] },
  Magha: { amrita: 21.6, varjyam: [12] },
  'Purva Phalguni': { amrita: 17.6, varjyam: [8] },
  'Uttara Phalguni': { amrita: 16.8, varjyam: [7.2] },
  Hasta: { amrita: 18, varjyam: [8.4] },
  Chitra: { amrita: 17.6, varjyam: [8] },
  Swati: { amrita: 15.2, varjyam: [5.6] },
  Vishakha: { amrita: 15.2, varjyam: [5.6] },
  Anuradha: { amrita: 13.6, varjyam: [4] },
  Jyeshtha: { amrita: 15.2, varjyam: [5.6] },
  Moola: { amrita: 17.6, varjyam: [8, 22.4] },
  'Purva Ashadha': { amrita: 19.2, varjyam: [9.6] },
  'Uttara Ashadha': { amrita: 17.6, varjyam: [8] },
  Shravana: { amrita: 13.6, varjyam: [4] },
  Dhanishta: { amrita: 13.6, varjyam: [4] },
  Shatabhisha: { amrita: 16.8, varjyam: [7.2] },
  'Purva Bhadrapada': { amrita: 16, varjyam: [6.4] },
  'Uttara Bhadrapada': { amrita: 19.2, varjyam: [9.6] },
  Revati: { amrita: 21.6, varjyam: [12] },
};

function formatLocalDateTime(jd, utcOffsetMinutes) {
  const local = julianDayToDate(jd + utcOffsetMinutes / 1440);
  const totalMinutes = Math.round(local.hour * 60);
  const hour = Math.floor(totalMinutes / 60) % 24;
  const minute = totalMinutes % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return `${local.year}-${pad(local.month)}-${pad(local.day)} ${pad(hour)}:${pad(minute)}`;
}

function windowFromSunrise(sunriseJd, sunsetJd, multiplier, durationFraction) {
  const dayDurationDays = sunsetJd - sunriseJd;
  const startJd = sunriseJd + dayDurationDays * multiplier;
  const endJd = startJd + dayDurationDays * durationFraction;
  return { startJd, endJd };
}

/**
 * S5 daily "neutral time windows" (WORKFLOW-REGISTER-001 S5), verified at
 * S1-B. Requires sunrise, sunset, and the *next* sunrise (for the
 * night-duration basis used by Tuesday's Durmuhurtham window).
 */
function calculateKalams({ sunriseJd, sunsetJd, nextSunriseJd, weekdayIndex, utcOffsetMinutes }) {
  const dayDurationDays = sunsetJd - sunriseJd;
  const nightDurationDays = nextSunriseJd - sunsetJd;

  const rahu = windowFromSunrise(sunriseJd, sunsetJd, RAHU_KALAM_MULTIPLIERS[weekdayIndex], 0.125);
  const gulika = windowFromSunrise(sunriseJd, sunsetJd, GULIKA_KALAM_MULTIPLIERS[weekdayIndex], 0.125);
  const yamagandam = windowFromSunrise(sunriseJd, sunsetJd, YAMAGANDAM_MULTIPLIERS[weekdayIndex], 0.125);

  const durmuhurthamWindows = DURMUHURTHAM_WINDOWS[weekdayIndex].map((w) => {
    const basisDurationDays = w.basis === 'day' ? dayDurationDays : nightDurationDays;
    const anchorJd = w.from === 'sunrise' ? sunriseJd : sunsetJd;
    const startJd = anchorJd + basisDurationDays * w.fraction;
    const endJd = startJd + dayDurationDays * DURMUHURTHAM_DURATION_FRACTION;
    return { startJd, endJd };
  });

  const toLocal = (w) => ({
    startLocal: formatLocalDateTime(w.startJd, utcOffsetMinutes),
    endLocal: formatLocalDateTime(w.endJd, utcOffsetMinutes),
  });

  const result = {
    rahuKalam: toLocal(rahu),
    gulikaKalam: toLocal(gulika),
    yamagandam: toLocal(yamagandam),
    durmuhurtham: durmuhurthamWindows.map(toLocal),
  };

  return attachSource(result, {
    ...PANCHANGAM_CALCULATIONS_SOURCE,
    pageLocus: 'file pages 22-23 (S1-B)',
  });
}

/**
 * Amrit Kaal (Amrita Gadiya) and Varjyam for the nakshatra active at sunrise,
 * verified at S1-B file pages 20-21. Takes the nakshatra's own start/end (from
 * tirukanitaPanchangam's limb-boundary search) so the scaling in the source
 * formula (actual nakshatra duration, not the tabulated 24h reference) is
 * exact rather than approximated.
 */
function calculateAmritKaalVarjyam({ nakshatraName, nakshatraStartJd, nakshatraEndJd, utcOffsetMinutes }) {
  const entry = AMRITA_VARJYAM_TABLE[nakshatraName];
  if (!entry) {
    return sourceRequired(`No Amrita Gadiya/Varjyam table entry for nakshatra "${nakshatraName}"`);
  }
  const durationDays = nakshatraEndJd - nakshatraStartJd;
  const windowFor = (x) => {
    const startJd = nakshatraStartJd + (durationDays * x) / 24;
    const endJd = startJd + (durationDays * 1.6) / 24;
    return {
      startLocal: formatLocalDateTime(startJd, utcOffsetMinutes),
      endLocal: formatLocalDateTime(endJd, utcOffsetMinutes),
    };
  };

  const result = {
    amritKaal: windowFor(entry.amrita),
    varjyam: entry.varjyam.map(windowFor),
  };
  return attachSource(result, {
    ...PANCHANGAM_CALCULATIONS_SOURCE,
    pageLocus: 'file pages 20-21 (S1-B)',
  });
}

module.exports = {
  calculateKalams,
  calculateAmritKaalVarjyam,
  RAHU_KALAM_MULTIPLIERS,
  GULIKA_KALAM_MULTIPLIERS,
  YAMAGANDAM_MULTIPLIERS,
  AMRITA_VARJYAM_TABLE,
};
