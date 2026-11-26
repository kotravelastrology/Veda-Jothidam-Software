/**
 * The ayanamsha names the app uses (the chart form and the settings page, in lower case) and the names the engine knows (the keys of `SiderealMode`).
 * The engine accepts only its own names, so an app name such as 'kp' used to throw "Unsupported ayanamsa". `toEngineAyanamsa` turns an app name into the engine's
 * and passes any other name through unchanged, so the engine still rejects what it does not know.
 */
const APP_TO_ENGINE = {
  lahiri: 'Lahiri',
  raman: 'Raman',
  kp: 'Krishnamurti',
  krishnamurti: 'Krishnamurti',
  fagan: 'FaganBradley',
  true_citra: 'TrueCitra',
};

function toEngineAyanamsa(name) {
  return Object.prototype.hasOwnProperty.call(APP_TO_ENGINE, name) ? APP_TO_ENGINE[name] : name;
}

module.exports = { APP_TO_ENGINE, toEngineAyanamsa };
