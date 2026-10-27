const assert = require('assert');
const { PLANET_DESCRIPTIONS: P } = require('./src/report/readerIIPlanetDescriptions');

// Reader II planets, printed pp.345-488: each planet as its own text, with the page its heading is on
const sun = P.Sun;
assert.strictEqual(sun.pageFrom, 345);
assert.strictEqual(sun.pageTo, 356);
assert.strictEqual(sun.page, 345);
assert.ok(sun.en.startsWith('Astronomy: Sun is the parent of the entire solar system.'));
assert.ok(sun.en.endsWith('neither is a planet in the strict dictionary sense.'));
assert.ok(!sun.en.includes('Astronomy : Moon is the planet nearest'), 'the moon is its own entry');
assert.ok(!sun.en.includes('SUN THE FATHER'), 'the heading is not in the text');
assert.ok(sun.ta.length > 0 && sun.titleTa.length > 0);
const moon = P.Moon;
assert.strictEqual(moon.pageFrom, 356);
assert.strictEqual(moon.pageTo, 365);
assert.strictEqual(moon.page, 356);
assert.ok(moon.en.startsWith('to the earth. It is the only planet in the Solar system'));
assert.ok(moon.en.endsWith('Push pa raga m-Dia mond-AI I white'));
assert.ok(!moon.en.includes('MARS-THE BROTHER'), 'the mars section is its own entry');
assert.ok(!moon.en.includes('Sun is the parent of the entire solar system'), 'the sun section is its own entry');
assert.ok(moon.ta.length > 0 && moon.titleTa.length > 0);
console.log('test-reader-ii-planet-descriptions ok');
