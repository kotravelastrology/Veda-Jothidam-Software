const assert = require('node:assert/strict');
const { drishtiPinda, specialAspectBonus, aspectualValue } = require('./src/chart/aspectStrength');

const close = (actual, expected, tolerance, msg) => {
  assert.ok(Math.abs(actual - expected) < tolerance, `${msg}: expected ~${expected}, got ${actual}`);
};

// Spot-checked directly against the chapter's own printed "Speculum of Aspectual Values" table.
close(drishtiPinda(47), 8.5, 1e-9, 'Speculum 47deg -> 8.50');
close(drishtiPinda(64), 19, 1e-9, 'Speculum 64deg -> 19.00');
close(drishtiPinda(30), 0, 1e-9, 'Speculum 30deg -> 0.00');
close(drishtiPinda(32), 1, 1e-9, 'Speculum 32deg -> 1.00');
close(drishtiPinda(48), 9, 1e-9, 'Speculum 48deg -> 9.00');
close(drishtiPinda(65), 20, 1e-9, 'Speculum 65deg -> 20.00');

// Boundary continuity: v.2-5's "all planets aspect the 7th fully" -> peak of
// exactly 60 Virupas at opposition (180deg).
close(drishtiPinda(180), 60, 1e-9, 'Full aspect (7th house / opposition)');
// No aspect within the "same sign to 5th-from" dead zone (v.2-5's implicit gap).
assert.equal(drishtiPinda(0), 0, 'No aspect at conjunction');
assert.equal(drishtiPinda(15), 0, 'No aspect before the 30deg threshold');
assert.equal(drishtiPinda(310), 0, 'No aspect past the 300deg threshold');
// Rule-boundary continuity (each adjacent rule must agree at its shared edge).
close(drishtiPinda(59.999), drishtiPinda(60.001), 0.01, 'continuous at 60deg');
close(drishtiPinda(89.999), drishtiPinda(90.001), 0.01, 'continuous at 90deg');
close(drishtiPinda(119.999), drishtiPinda(120.001), 0.01, 'continuous at 120deg');
close(drishtiPinda(149.999), drishtiPinda(150.001), 0.01, 'continuous at 150deg');
close(drishtiPinda(179.999), drishtiPinda(180.001), 0.01, 'continuous at 180deg');

// Special aspects (v.9-12): Mars/Jupiter/Saturn get an extra bonus in their special-aspect zones.
assert.equal(specialAspectBonus('Mars', 100), 15);
assert.equal(specialAspectBonus('Mars', 230), 15);
assert.equal(specialAspectBonus('Mars', 50), 0);
assert.equal(specialAspectBonus('Jupiter', 135), 30);
assert.equal(specialAspectBonus('Jupiter', 255), 30);
assert.equal(specialAspectBonus('Saturn', 75), 45);
assert.equal(specialAspectBonus('Saturn', 285), 45);
assert.equal(specialAspectBonus('Venus', 100), 0, 'Venus has no special aspect bonus');

// aspectualValue combines both, wrapping the angle correctly regardless of longitude order.
close(aspectualValue('Sun', 10, 190), 60, 1e-9, 'Sun 180deg ahead -> full aspect');
close(aspectualValue('Sun', 190, 10), 60, 1e-9, 'wraps correctly when aspected < aspector');
close(aspectualValue('Mars', 0, 100), drishtiPinda(100) + 15, 1e-9, "Mars's special bonus included");

console.log(JSON.stringify({ pass: true }, null, 2));
