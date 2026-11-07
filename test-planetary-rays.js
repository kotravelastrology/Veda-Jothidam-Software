/**
 * BPHS ch.73 (src/report/planetaryRays.js, fixture bphs-73.json): the fixture's shape, the rule worked by hand, the dignity corrections, the table of effects and the book's worked example recomputed.
 */
const assert = require('node:assert/strict');
const R = require('./src/report/planetaryRays');

const D = R.DATA;
assert.ok(D.source.title && D.source.pageLocus && D.scope.length > 800 && D.rule.ta.length > 80 && D.corrections.ta.length > 80 && D.status.ta.length > 80 && D.direction.ta.length > 40 && D.closing.ta.length > 40);
assert.deepEqual(D.maxRays, { Sun: 10, Moon: 9, Mars: 5, Mercury: 5, Jupiter: 7, Venus: 8, Saturn: 5 });
assert.deepEqual(D.corrections.factor, { exalted: 3, moolatrikona: 2, own: 1.5, greatFriend: 4 / 3, friend: 1.2, neutral: 1, enemy: 0.5, greatEnemy: 0.4 });
assert.equal(D.effects.table.length, 19);
const T = D.effects.table;
assert.equal(T[0].min, 1);
assert.equal(T.at(-1).max, null);
for (let i = 1; i < T.length; i += 1) assert.ok(T[i].min >= T[i - 1].max || (T[i].min === 40 && T[i - 1].max === 40), `row ${i}`);
assert.ok(T.every((r) => r.ta.length >= 5));

// the rule: nothing at the point of deep debilitation, the full rays at deep exaltation, in proportion between
const deb = { Sun: 190, Moon: 213, Mars: 118, Mercury: 345, Jupiter: 275, Venus: 177, Saturn: 20 };
for (const p of R.PLANETS) {
  assert.equal(R.distanceFromDebilitation(p, deb[p]), 0, p);
  assert.equal(R.grossRays(p, deb[p]), 0, p);
  assert.equal(R.grossRays(p, (deb[p] + 180) % 360), D.maxRays[p], `${p} at its point of deep exaltation`);
  assert.ok(Math.abs(R.grossRays(p, (deb[p] + 90) % 360) - D.maxRays[p] / 2) < 1e-9, `${p} half-way`);
  assert.ok(Math.abs(R.grossRays(p, (deb[p] - 90 + 360) % 360) - D.maxRays[p] / 2) < 1e-9, `${p} half-way the other way: 12 signs less the remainder`);
}
assert.ok(Math.abs(R.distanceFromDebilitation('Mars', 118 + 200) - 160) < 1e-9, 'more than 6 signs from the point: taken from 12');
assert.equal(R.direction('Sun', 190 + 90), 'ascending');
assert.equal(R.direction('Sun', 190 - 90), 'descending');

// the dignities: the sign of exaltation first, then Moolatrikona (its degree band), own sign, and the compound relationship of the sign's lord
const quiet = { Sun: 0, Moon: 0, Mars: 0, Mercury: 0, Jupiter: 0, Venus: 0, Saturn: 0 };
const dig = (p, lon, signs = {}) => R.dignityOf(p, lon, { ...quiet, ...signs });
assert.equal(dig('Sun', 10), 'exalted');
assert.equal(dig('Moon', 33), 'exalted', 'the Moon in Taurus is exalted, not Moolatrikona');
assert.equal(dig('Saturn', 200), 'exalted');
assert.equal(dig('Mars', 5), 'moolatrikona');
assert.equal(dig('Mars', 20), 'own', 'Aries beyond 12 degrees is Mars\'s own sign only');
assert.equal(dig('Mars', 215), 'own');
assert.equal(dig('Sun', 130), 'moolatrikona');
assert.equal(dig('Sun', 145), 'own', 'Leo 25 degrees is beyond the Moolatrikona band of 20');
assert.equal(dig('Jupiter', 245), 'moolatrikona');
assert.equal(dig('Venus', 190), 'moolatrikona');
assert.equal(dig('Venus', 50), 'own');
assert.equal(dig('Saturn', 310), 'moolatrikona');
assert.equal(dig('Saturn', 280), 'own');
// Mercury in Taurus (Venus's sign): Venus is Mercury's natural friend and in the 2nd from it, a temporary friend: a great friend
assert.equal(dig('Mercury', 45, { Mercury: 1, Venus: 2 }), 'greatFriend');
// Saturn in Leo (the Sun's sign), the Sun in Capricorn, the 6th from Leo: natural and temporary enemy: a great enemy
assert.equal(dig('Saturn', 125, { Saturn: 4, Sun: 9 }), 'greatEnemy');
// Saturn in Gemini (Mercury's, a natural friend), Mercury in Cancer, the 2nd from it: a great friend; with Mercury in Aries, the 11th... Gemini to Aries is the 11th: a temporary friend too
assert.equal(dig('Saturn', 65, { Saturn: 2, Mercury: 3 }), 'greatFriend');
// the corrected rays
const sky = { Sun: 10, Moon: 33, Mars: 215, Mercury: 345, Jupiter: 275, Venus: 177, Saturn: 20 }; // exalted Sun, Moon; Mars own; the rest at their points of debilitation
const full = R.rays(sky);
assert.equal(full.planets.Sun.gross, 10, 'the Sun at Aries 10 degrees is at its point of deep exaltation');
assert.equal(full.planets.Sun.dignity, 'exalted');
assert.ok(Math.abs(full.planets.Moon.net - full.planets.Moon.gross * 3) < 1e-9);
assert.equal(full.planets.Mars.dignity, 'own');
assert.ok(Math.abs(full.planets.Mars.net - full.planets.Mars.gross * 1.5) < 1e-9);
assert.equal(full.planets.Mercury.net, 0);
assert.ok(Math.abs(full.total - R.PLANETS.reduce((s, p) => s + full.planets[p].net, 0)) < 1e-9);
// every planet at its point of deep exaltation in its own sign of exaltation: all the full rays, trebled: 3 x 49 = 147
const exalt = { Sun: 10, Moon: 33, Mars: 298, Mercury: 165, Jupiter: 95, Venus: 357, Saturn: 200 };
const top = R.rays(exalt);
assert.ok(R.PLANETS.every((p) => top.planets[p].dignity === 'exalted' && Math.abs(top.planets[p].gross - D.maxRays[p]) < 1e-9));
assert.ok(Math.abs(top.total - 3 * 49) < 1e-9);

// the table: the whole number of the total counts; 40 is in two rows; under 1 no row
const rows = (t) => R.effectRows(t).map((r) => `${r.min}-${r.max}`);
assert.deepEqual(rows(0.9), []);
assert.deepEqual(rows(1), ['1-5']);
assert.deepEqual(rows(5.99), ['1-5']);
assert.deepEqual(rows(6), ['6-10']);
assert.deepEqual(rows(11.5), ['11-11']);
assert.deepEqual(rows(23.9), ['23-23']);
assert.deepEqual(rows(24), ['24-30']);
assert.deepEqual(rows(30.9), ['24-30']);
assert.deepEqual(rows(31), ['31-40']);
assert.deepEqual(rows(40), ['31-40', '40-50']);
assert.deepEqual(rows(40.9), ['31-40', '40-50']);
assert.deepEqual(rows(41), ['40-50']);
assert.deepEqual(rows(50.9), ['40-50']);
assert.deepEqual(rows(51), ['51-null']);
assert.deepEqual(rows(147), ['51-null']);

// the worked example (pp.906-908) recomputed from its longitudes: the printed rays of Mercury, Jupiter and Saturn follow the rule; those of the Sun, Moon, Mars and Venus do not
const sg = ([s, d, m, sec]) => s * 30 + d + m / 60 + sec / 3600;
const ex = D.example.planets;
const exLon = Object.fromEntries(R.PLANETS.map((p) => [p, sg(ex[p].longitude)]));
for (const p of ['Mercury', 'Jupiter', 'Saturn']) assert.ok(Math.abs(R.grossRays(p, exLon[p]) - ex[p].printedGross) < 0.05, `${p}: ${R.grossRays(p, exLon[p])} against ${ex[p].printedGross}`);
for (const p of ['Sun', 'Moon', 'Mars', 'Venus']) assert.ok(Math.abs(R.grossRays(p, exLon[p]) - ex[p].printedGross) > 0.2, `${p} does not follow the rule`);
assert.deepEqual(R.PLANETS.map((p) => R.grossRays(p, exLon[p]).toFixed(3)), ['6.090', '7.332', '2.141', '0.885', '1.505', '6.359', '4.360']);
// its printed corrections follow the rule (Venus times 4/3 although its text says 5/3), and the book's total and the rule's net total fall in the same row of the table
const factorsOf = { Sun: 1, Moon: 1, Mars: 1.2, Mercury: 1.2, Jupiter: 1.2, Venus: 4 / 3, Saturn: 0.4 };
for (const p of R.PLANETS) assert.ok(Math.abs(ex[p].printedGross * factorsOf[p] - ex[p].printedNet) < 0.02, p);
const ruleTotal = R.PLANETS.reduce((s, p) => s + R.grossRays(p, exLon[p]) * factorsOf[p], 0);
assert.ok(Math.abs(ruleTotal - 29.08) < 0.05, `${ruleTotal}`);
assert.deepEqual(rows(ruleTotal), ['24-30']);
assert.deepEqual(rows(D.example.printedTotal), ['24-30']);
console.log('test-planetary-rays: all assertions passed');
