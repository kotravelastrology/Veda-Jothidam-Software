/**
 * The ayanamsha saved in Settings (the SettingsPanel key) → the value the chart form's
 * ayanamsa list uses (AYANAMSA_OPTIONS in app/lib/constants.ts). The two lists name
 * Krishnamurti and True Citra differently, so the saved key is translated here.
 */
const SETTINGS_TO_CHART_FORM = {
  lahiri: 'lahiri',
  raman: 'raman',
  krishnamurti: 'kp',
  truecitra: 'true_citra',
};

/** @param saved the ayanamsha key stored by the Settings panel; anything unknown falls back to Lahiri */
function chartFormAyanamsa(saved) {
  return Object.prototype.hasOwnProperty.call(SETTINGS_TO_CHART_FORM, saved)
    ? SETTINGS_TO_CHART_FORM[saved]
    : 'lahiri';
}

module.exports = { chartFormAyanamsa, SETTINGS_TO_CHART_FORM };
