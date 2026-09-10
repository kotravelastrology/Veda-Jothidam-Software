// Ayanamsha options are named exactly as @swisseph/node's `SiderealMode` keys.
// 'Lahiri' (Chitrapaksha) stays the project default and the only one required
// for the governed S6-S12 calculators; the others are user-selectable
// alternatives, each a standard, widely-published ayanamsha:
//   'Raman'       — B. V. Raman's ayanamsha (Raman's ephemerides / *A Manual
//                   of Hindu Astrology*).
//   'Krishnamurti'— the KP ayanamsha (SE_SIDM_KRISHNAMURTI), used by
//                   *Krishnamurti Paddhati* practice.
//   'TrueCitra'   — true Chitrapaksha (Spica fixed at 180deg 00'), the modern
//                   "true Lahiri" variant.
const SUPPORTED_AYANAMSHAS = ['Lahiri', 'Raman', 'Krishnamurti', 'TrueCitra'];
// 'Porphyrius' is the engine's name for simple ecliptic-arc trisection between
// the four angular cusps, which S6's follow-up source check (Sripatipaddhati,
// V. Subrahmanya Sastri translation) confirmed is mathematically identical to
// Sripati Paddhati -- reproduces that source's own worked example exactly, and
// stays the default. 'Placidus' (semi-arc), 'WholeSign' (sign = house, the
// classical North/East-Indian bhava), 'Equal' (30deg from Lagna) and 'Koch'
// are standard alternative house systems offered as user choices.
const SUPPORTED_HOUSE_SYSTEMS = ['Porphyrius', 'Placidus', 'WholeSign', 'Equal', 'Koch'];
// Lunar-node model — see nodeLongitude() in ephemeris/siderealPositions.js.
// 'mean' is the project default; 'true' (osculating node) is the KP / modern
// opt-in.
const SUPPORTED_NODE_TYPES = ['mean', 'true'];
const SUPPORTED_CALENDAR_MODES = ['tirukanita', 'vakya'];
const SUPPORTED_DAY_BOUNDARIES = ['sunrise'];

class UnsupportedInputError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'UnsupportedInputError';
    this.field = field;
  }
}

/**
 * S2 shared time/chart-identity contract (WORKFLOW-REGISTER-001 S2; PLAN-001 item 2).
 * Every calculator (Panchangam, Muhurtham, and later stages) takes its astronomical/
 * time/location parameters through this contract so identity and provenance are
 * recorded the same way everywhere, per PLAN-001's non-negotiable method rules.
 */
function createChartContext({
  year, month, day, hour, minute = 0, second = 0,
  ianaTimeZone, utcOffsetMinutes,
  latitude, longitude, placeName,
  ayanamsha = 'Lahiri', houseSystem = 'Porphyrius', nodeType = 'mean',
  calendarMode, dayBoundary = 'sunrise',
}) {
  const required = { year, month, day, hour, latitude, longitude, utcOffsetMinutes, ianaTimeZone, calendarMode };
  for (const [field, value] of Object.entries(required)) {
    if (value === undefined || value === null || (typeof value === 'number' && !Number.isFinite(value))) {
      throw new UnsupportedInputError(`${field} is required to build a chart context`, field);
    }
  }
  if (latitude < -90 || latitude > 90) {
    throw new UnsupportedInputError('latitude must be between -90 and 90', 'latitude');
  }
  if (longitude < -180 || longitude > 180) {
    throw new UnsupportedInputError('longitude must be between -180 and 180', 'longitude');
  }
  if (!SUPPORTED_AYANAMSHAS.includes(ayanamsha)) {
    throw new UnsupportedInputError(`Unsupported ayanamsha: ${ayanamsha}`, 'ayanamsha');
  }
  if (!SUPPORTED_HOUSE_SYSTEMS.includes(houseSystem)) {
    throw new UnsupportedInputError(`Unsupported house system: ${houseSystem}`, 'houseSystem');
  }
  if (!SUPPORTED_NODE_TYPES.includes(nodeType)) {
    throw new UnsupportedInputError(`Unsupported node type: ${nodeType}`, 'nodeType');
  }
  if (!SUPPORTED_CALENDAR_MODES.includes(calendarMode)) {
    throw new UnsupportedInputError(`Unsupported calendar mode: ${calendarMode}`, 'calendarMode');
  }
  if (!SUPPORTED_DAY_BOUNDARIES.includes(dayBoundary)) {
    throw new UnsupportedInputError(`Unsupported day boundary: ${dayBoundary}`, 'dayBoundary');
  }

  return Object.freeze({
    input: Object.freeze({
      year, month, day, hour, minute, second,
      ianaTimeZone, utcOffsetMinutes,
      latitude, longitude, placeName: placeName ?? null,
    }),
    ayanamsha,
    houseSystem,
    nodeType,
    calendarMode,
    dayBoundary,
    contextVersion: 'S2-001',
  });
}

/**
 * Stamps a calculation result with the exact governing source citation, so no
 * calculator can silently omit where its rule came from (PLAN-001: "Every result
 * retains chart identity, parameters, engine, source, edition, page, tradition
 * and derivation identity").
 */
function attachSource(result, source) {
  const requiredFields = ['title', 'author', 'file', 'pageLocus', 'tradition', 'convention'];
  for (const field of requiredFields) {
    if (!source || !source[field]) {
      throw new UnsupportedInputError(`source.${field} is required to attach provenance`, field);
    }
  }
  return Object.freeze({ ...result, source: Object.freeze({ ...source }) });
}

/**
 * The registered refusal state for a rule/value that has no verified source yet.
 * Never fabricate a substitute value in its place (PLAN-001 non-negotiable rule).
 */
function sourceRequired(reason) {
  return Object.freeze({
    status: 'SOURCE_REQUIRED',
    reason,
    message: 'ஆதாரம் தேவை / SOURCE REQUIRED',
  });
}

module.exports = {
  createChartContext,
  attachSource,
  sourceRequired,
  UnsupportedInputError,
  SUPPORTED_AYANAMSHAS,
  SUPPORTED_HOUSE_SYSTEMS,
  SUPPORTED_NODE_TYPES,
  SUPPORTED_CALENDAR_MODES,
  SUPPORTED_DAY_BOUNDARIES,
};
