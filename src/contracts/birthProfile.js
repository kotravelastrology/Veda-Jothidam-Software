const crypto = require('node:crypto');
const { createChartContext } = require('./chartContext');

/**
 * A birth profile's "chart identity" (WORKFLOW-REGISTER-001 S6: "complete
 * intake and stable chart identity") depends only on the astronomical
 * parameters that determine the chart — not the person's name or gender —
 * so two people born at the same instant/place deterministically share one
 * chart identity, which is astronomically correct.
 */
function deriveChartId(chartContext) {
  const { year, month, day, hour, minute, second, latitude, longitude, utcOffsetMinutes } = chartContext.input;
  const canonical = JSON.stringify({
    year, month, day, hour, minute, second, latitude, longitude, utcOffsetMinutes,
    ayanamsha: chartContext.ayanamsha, houseSystem: chartContext.houseSystem,
    nodeType: chartContext.nodeType,
  });
  return crypto.createHash('sha256').update(canonical).digest('hex').slice(0, 16);
}

/**
 * S6 birth profile intake (WORKFLOW-REGISTER-001 S6; PLAN-001 item 6).
 * Wraps the S2 chart context with the person-identity fields a natal chart
 * needs (name, gender) plus a stable, reproducible `chartId`. `calendarMode`
 * is a Panchangam-specific S2 field with no bearing on a natal chart; it
 * defaults to 'tirukanita' here purely to satisfy S2's required-field
 * validation, not as an astrological choice.
 */
function createBirthProfile({ name, gender = null, calendarMode = 'tirukanita', ...astronomicalInput }) {
  if (typeof name !== 'string' || !name.trim()) {
    throw new TypeError('name is required to create a birth profile');
  }
  const chartContext = createChartContext({ ...astronomicalInput, calendarMode });
  return Object.freeze({
    name: name.trim(),
    gender,
    chartContext,
    chartId: deriveChartId(chartContext),
  });
}

module.exports = { createBirthProfile, deriveChartId };
