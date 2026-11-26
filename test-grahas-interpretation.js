const assert = require('assert');
const { buildGrahaRows, NOT_BUILT, PLANETS } = require('./src/report/grahaInterpretation');

// Lagna Aries. Each planet sits in its own sign, outside its moolatrikona band, so every dignity is 'own'.
const longitudes = { Sun: 145, Moon: 100, Mars: 225, Mercury: 175, Jupiter: 340, Venus: 200, Saturn: 280 };

// Stand-in Shadbala parts (the real totals are not used here): each part gets its own number.
const shadbala = {
  perPlanet: Object.fromEntries(PLANETS.map((p) => [p, {
    sthanaBala: 10, digBala: 20, kaalaBala: 30, naisargikaBala: 40, cheshtaBala: 50, drikBala: -5,
  }])),
};

const rows = buildGrahaRows({ lagnaRasiIndex: 0, longitudes, shadbala });
const byPlanet = Object.fromEntries(rows.map((r) => [r.planet, r]));

// one row per classical graha, in the order of PLANETS
assert.deepStrictEqual(rows.map((r) => r.planet), PLANETS);

// house from the lagna, counted from Aries
assert.equal(byPlanet.Sun.house, 5);
assert.equal(byPlanet.Moon.house, 4);
assert.equal(byPlanet.Mars.house, 8, 'Scorpio is the 8th sign from Aries');
assert.equal(byPlanet.Mercury.house, 6);
assert.equal(byPlanet.Jupiter.house, 12);
assert.equal(byPlanet.Venus.house, 7);
assert.equal(byPlanet.Saturn.house, 10);

// houses owned, from the own-sign table: Mars owns Aries and Scorpio, i.e. houses 1 and 8
assert.deepStrictEqual(byPlanet.Mars.housesOwned, [1, 8]);
assert.deepStrictEqual(byPlanet.Sun.housesOwned, [5]);
assert.deepStrictEqual(byPlanet.Mercury.housesOwned, [3, 6]);
assert.deepStrictEqual(byPlanet.Jupiter.housesOwned, [9, 12]);

// the Saptavargaja relation from the shared Shadbala helper
for (const r of rows) assert.equal(r.relation, 'own', `${r.planet} is in its own sign`);

// exaltation comes from the exact-sign table: Jupiter in Cancer is exalted; Jupiter in Pisces is neither
assert.equal(byPlanet.Jupiter.exaltation, null);
const exalted = buildGrahaRows({ lagnaRasiIndex: 0, longitudes: { ...longitudes, Jupiter: 95 }, shadbala });
assert.equal(exalted.find((r) => r.planet === 'Jupiter').exaltation, 'exalted');

// avasthas come from the avasthas engine, so each is a named state
for (const r of rows) {
  assert.equal(typeof r.jagradadi, 'string');
  assert.equal(typeof r.baladi, 'string');
  assert.equal(typeof r.deeptadi, 'string');
}

// the six Shadbala parts are passed through unchanged, and no total is shown
assert.deepStrictEqual(byPlanet.Moon.shadbala, { sthana: 10, dig: 20, kaala: 30, naisargika: 40, cheshta: 50, drik: -5 });
assert.equal(rows[0].shadbala.total, undefined);

// the page lists what it does not show, Shadbala % included, with a reason for each
const notBuiltColumns = NOT_BUILT.map((x) => x.column);
assert.ok(notBuiltColumns.includes('Shadbala %'));
assert.ok(NOT_BUILT.every((x) => x.reason && x.reason.length > 0));

console.log('test-grahas-interpretation ok');
