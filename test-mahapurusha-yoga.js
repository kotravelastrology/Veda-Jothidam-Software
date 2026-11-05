/**
 * The Panchamahapurusha yogas of BPHS ch.75 (src/report/mahapurushaYoga.js, fixture bphs-75.json): the fixture's shape and each yoga on charts worked by hand.
 */
const assert = require('node:assert/strict');
const M = require('./src/report/mahapurushaYoga');

assert.ok(M.DATA.source.title && M.DATA.source.pageLocus && M.DATA.scope && M.DATA.general.ta.length > 40);
assert.deepEqual(M.YOGAS, ['Ruchaka', 'Bhadra', 'Hamsa', 'Malavya', 'Sasa']);
assert.deepEqual(M.YOGAS.map((y) => M.DATA.yogas[y].planet), ['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']);
let lastPage = 924;
for (const y of M.YOGAS) {
  const d = M.DATA.yogas[y];
  const [a, b] = d.page.split('-').map(Number);
  assert.ok(a >= lastPage && (b ?? a) <= 927 && d.ta.length > 80 && d.verses, y);
  lastPage = a;
}
assert.deepEqual(M.YOGAS.map((y) => M.DATA.yogas[y].verses), ['3-7', '8-12', '13-16', '17-19', '20-22']);

assert.equal(M.houseFrom(0, 0), 1);
assert.equal(M.houseFrom(11, 2), 4);

// planets in the kendras from Aries in their own signs: Mars in Aries (1st), Mercury in Virgo (6th is not a kendra), Jupiter in Cancer (4th, exalted), Venus in Libra (7th, own), Saturn in Capricorn (10th, own)
const base = { Mars: 0, Mercury: 5, Jupiter: 3, Venus: 6, Saturn: 9 };
const run = (signs, lagnaSign = 0) => Object.fromEntries(M.evaluate({ signs: { ...base, ...signs }, lagnaSign }).map((r) => [r.yoga, r]));
const r = run({});
assert.deepEqual(Object.fromEntries(Object.entries(r).map(([y, x]) => [y, x.status])), { Ruchaka: 'held', Bhadra: 'not-held', Hamsa: 'held', Malavya: 'held', Sasa: 'held' });
assert.equal(r.Ruchaka.dignity, 'own');
assert.equal(r.Hamsa.dignity, 'exalted');
assert.equal(r.Bhadra.house, 6, 'Mercury in Virgo is own and exalted but in the 6th, not a kendra');
assert.equal(r.Bhadra.dignity, 'own');

// own signs of each planet and the exaltation sign, in each kendra and out of it
const held = (planet, sign, lagna) => run({ [planet]: sign }, lagna)[{ Mars: 'Ruchaka', Mercury: 'Bhadra', Jupiter: 'Hamsa', Venus: 'Malavya', Saturn: 'Sasa' }[planet]].status === 'held';
assert.ok(held('Mars', 0, 0) && held('Mars', 7, 7), 'Mars in Aries or Scorpio, each as the Lagna');
assert.ok(held('Mars', 9, 0), 'Mars exalted in Capricorn, the 10th from Aries');
assert.ok(!held('Mars', 9, 1), 'Capricorn is the 9th from Taurus');
assert.ok(held('Mercury', 2, 2), 'Mercury in Gemini as the Lagna');
assert.ok(held('Mercury', 5, 5), 'Mercury in Virgo as the Lagna');
assert.ok(!held('Mercury', 8, 8), 'Mercury in Sagittarius is neither own nor exalted');
assert.ok(held('Jupiter', 8, 8) && held('Jupiter', 11, 11) && held('Jupiter', 3, 0));
assert.ok(held('Venus', 1, 1) && held('Venus', 6, 6) && held('Venus', 11, 11) && held('Venus', 11, 2), 'Venus exalted in Pisces, the 10th from Gemini');
assert.ok(!held('Venus', 1, 2), 'Taurus is the 12th from Gemini');
assert.ok(held('Saturn', 9, 9) && held('Saturn', 10, 10) && held('Saturn', 6, 0));
assert.ok(!held('Saturn', 6, 1), 'Libra is the 6th from Taurus');
// debilitation is not asked for: Mars in Cancer in a kendra is not Ruchaka
assert.ok(!held('Mars', 3, 3));
console.log('test-mahapurusha-yoga: all assertions passed');
