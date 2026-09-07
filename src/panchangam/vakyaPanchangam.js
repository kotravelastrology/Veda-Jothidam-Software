const { sourceRequired } = require('../contracts/chartContext');

/**
 * S4 — Vakya Panchangam (WORKFLOW-REGISTER-001 S4; PLAN-001 item 4).
 * The Vakya source is identified and partially verified (see
 * S4-VAKYA-SOURCE-VERIFICATION-001.md: Vakyakarana, Kuppanna Sastri & Sarma,
 * 1962) but the Chandravakya table is not yet digitized and the
 * Ahargana/Sun/locality-correction chain is not yet implemented or
 * cross-checked. Returning a computed value here would be exactly the
 * "silently reconstructed rule" PLAN-001 prohibits, so this returns the
 * registered SOURCE_REQUIRED state instead. Must never reuse the Tirukanita
 * (Swiss Ephemeris) Sun/Moon positions — Vakya is a separate convention.
 */
function calculateVakyaPanchangam(chartContext) {
  if (chartContext.calendarMode !== 'vakya') {
    throw new RangeError('calculateVakyaPanchangam requires calendarMode "vakya"');
  }
  return sourceRequired(
    'Vakya Panchangam not yet admitted: Chandravakya table (Vakyakarana, Kuppanna '
    + 'Sastri & Sarma 1962, Appendix II) is source-verified (S4) but not yet '
    + 'digitized, and the Ahargana/Sun-equation/locality-correction chain is not '
    + 'yet implemented or cross-checked. See S4-VAKYA-SOURCE-VERIFICATION-001.md.',
  );
}

module.exports = { calculateVakyaPanchangam };
