const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { chartFormAyanamsa, SETTINGS_TO_CHART_FORM } = require('./src/ui/chartFormAyanamsa');

// the saved Settings ayanamsha becomes the chart form's default
assert.strictEqual(chartFormAyanamsa('lahiri'), 'lahiri');
assert.strictEqual(chartFormAyanamsa('raman'), 'raman');
assert.strictEqual(chartFormAyanamsa('krishnamurti'), 'kp');
assert.strictEqual(chartFormAyanamsa('truecitra'), 'true_citra');

// an unknown or inherited key falls back to Lahiri, never to undefined
assert.strictEqual(chartFormAyanamsa('fagan'), 'lahiri');
assert.strictEqual(chartFormAyanamsa(undefined), 'lahiri');
assert.strictEqual(chartFormAyanamsa('constructor'), 'lahiri');

// every value the mapping can produce is one the chart form's list actually offers
const constants = fs.readFileSync(path.join(__dirname, 'app', 'lib', 'constants.ts'), 'utf8');
const block = constants.slice(constants.indexOf('AYANAMSA_OPTIONS'), constants.indexOf('];', constants.indexOf('AYANAMSA_OPTIONS')));
const offered = [...block.matchAll(/value: '([^']+)'/g)].map((m) => m[1]);
assert.ok(offered.length >= 4, 'AYANAMSA_OPTIONS should list the chart form ayanamsas');
for (const formValue of Object.values(SETTINGS_TO_CHART_FORM)) {
  assert.ok(offered.includes(formValue), `chart form has no option "${formValue}"`);
}

console.log('test-settings-ayanamsa ok');
