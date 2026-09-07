const { julianDay } = require('@swisseph/node');
const { sunriseJulianDay, sunsetJulianDay } = require('../ephemeris/siderealPositions');
const { calculateTirukanitaPanchangam, weekdayIndexAt } = require('./tirukanitaPanchangam');
const { calculateKalams, calculateAmritKaalVarjyam } = require('./kalams');
const { sourceRequired } = require('../contracts/chartContext');

/**
 * S5 daily Muhurtham (WORKFLOW-REGISTER-001 S5) — the "neutral time windows"
 * scope: Rahu Kalam, Gulika Kalam, Yamagandam, Durmuhurtham, Amrit Kaal and
 * Varjyam, all verified at S1-B. Does not include personalised event-muhurtham
 * matching (Tarabala/Chandrabala/Panchaka against a birth chart, S1-E) — that
 * requires a birth profile, which is a later stage. Abhijit Muhurta is not
 * covered by any source verified so far and is returned as SOURCE_REQUIRED
 * rather than computed from an unverified rule.
 */
function calculateDailyMuhurtham(chartContext) {
  const panchangam = calculateTirukanitaPanchangam(chartContext);
  const { year, month, day, latitude, longitude, utcOffsetMinutes } = chartContext.input;

  const localMidnightUtcHour = -utcOffsetMinutes / 60;
  const jdLocalMidnight = julianDay(year, month, day, localMidnightUtcHour);
  const sunriseJd = sunriseJulianDay(jdLocalMidnight, latitude, longitude);
  const sunsetJd = sunsetJulianDay(sunriseJd, latitude, longitude);
  const nextSunriseJd = sunriseJulianDay(sunsetJd, latitude, longitude);
  const weekdayIndex = weekdayIndexAt(sunriseJd + utcOffsetMinutes / 1440);

  const kalams = calculateKalams({
    sunriseJd, sunsetJd, nextSunriseJd, weekdayIndex, utcOffsetMinutes,
  });

  const amritKaalVarjyam = calculateAmritKaalVarjyam({
    nakshatraName: panchangam.nakshatra.name,
    nakshatraStartJd: panchangam.nakshatra.startJulianDay,
    nakshatraEndJd: panchangam.nakshatra.endJulianDay,
    utcOffsetMinutes,
  });

  return {
    date: panchangam.date,
    vara: panchangam.vara,
    sunriseLocal: panchangam.sunriseLocal,
    rahuKalam: kalams.rahuKalam,
    gulikaKalam: kalams.gulikaKalam,
    yamagandam: kalams.yamagandam,
    durmuhurtham: kalams.durmuhurtham,
    amritKaal: amritKaalVarjyam.amritKaal ?? null,
    varjyam: amritKaalVarjyam.varjyam ?? null,
    abhijitMuhurta: sourceRequired('Abhijit Muhurta is not covered by any source verified so far (S1-B pages 1-27 do not include it).'),
  };
}

module.exports = { calculateDailyMuhurtham };
