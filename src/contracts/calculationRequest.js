const { createChartContext, UnsupportedInputError } = require('./chartContext');

/** Bumped when the request shape changes in a way consumers must notice. */
const CALCULATION_REQUEST_VERSION = 'VJ006-REQ-001';

/**
 * The outputs a caller may ask for. Named after the engine module that
 * produces each, so a request states exactly which calculators must run.
 */
const SUPPORTED_OUTPUTS = [
  'parashariChart', 'vargas', 'ashtakavarga', 'shadbala',
  'vimshottari', 'yogas', 'doshas', 'panchangam',
];

/**
 * VJ-006 — CalculationRequest.
 *
 * One validated, versioned description of *what to compute*. Every
 * calculation entry point builds one of these, so a result can always be
 * traced back to the exact inputs, settings and code version that produced
 * it — rather than to "whatever the defaults were that day".
 *
 * Settings and version tags are mandatory by construction: the chart context
 * fills in and validates ayanamsha / house system / node type, and the
 * version fields below are written here, not supplied by the caller.
 */
function createCalculationRequest({ input, settings = {}, outputs, requestedBy = null }) {
  if (!input || typeof input !== 'object') {
    throw new UnsupportedInputError('input is required to build a calculation request', 'input');
  }
  if (!Array.isArray(outputs) || outputs.length === 0) {
    throw new UnsupportedInputError('outputs must be a non-empty array', 'outputs');
  }
  for (const output of outputs) {
    if (!SUPPORTED_OUTPUTS.includes(output)) {
      throw new UnsupportedInputError(`Unsupported output: ${output}`, 'outputs');
    }
  }

  // calendarMode has no engine default, so a request must be explicit rather
  // than inheriting whatever a caller happened to pass.
  const chartContext = createChartContext({
    ...input,
    ...settings,
    calendarMode: settings.calendarMode ?? 'tirukanita',
  });

  return Object.freeze({
    requestVersion: CALCULATION_REQUEST_VERSION,
    contextVersion: chartContext.contextVersion,
    chartContext,
    settings: Object.freeze({
      ayanamsha: chartContext.ayanamsha,
      houseSystem: chartContext.houseSystem,
      nodeType: chartContext.nodeType,
      calendarMode: chartContext.calendarMode,
      dayBoundary: chartContext.dayBoundary,
    }),
    outputs: Object.freeze([...outputs]),
    requestedBy,
  });
}

/**
 * Throws unless `value` is a CalculationRequest with every mandatory settings
 * and version tag present. Used by consumers that receive a request from
 * elsewhere rather than building it themselves.
 */
function assertCalculationRequest(value, label = 'value') {
  if (!value || typeof value !== 'object') {
    throw new UnsupportedInputError(`${label} is not a CalculationRequest`, label);
  }
  for (const field of ['requestVersion', 'contextVersion', 'chartContext', 'settings', 'outputs']) {
    if (value[field] === undefined) {
      throw new UnsupportedInputError(`${label}.${field} is required`, field);
    }
  }
  for (const setting of ['ayanamsha', 'houseSystem', 'nodeType', 'calendarMode', 'dayBoundary']) {
    if (!value.settings[setting]) {
      throw new UnsupportedInputError(`${label}.settings.${setting} is required`, setting);
    }
  }
  if (value.requestVersion !== CALCULATION_REQUEST_VERSION) {
    throw new UnsupportedInputError(
      `${label}.requestVersion ${value.requestVersion} != ${CALCULATION_REQUEST_VERSION}`,
      'requestVersion',
    );
  }
  return value;
}

module.exports = {
  createCalculationRequest,
  assertCalculationRequest,
  CALCULATION_REQUEST_VERSION,
  SUPPORTED_OUTPUTS,
};
