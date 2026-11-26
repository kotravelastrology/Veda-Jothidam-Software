/**
 * BPHS ch.84 on propitiating the planets (fixture fixtures/remedies/bphs-84.json): the shape of the table, the nine planets in the book's order, the figures as printed.
 */
const assert = require('node:assert/strict');
const R = require('./fixtures/remedies/bphs-84.json');

const ORDER = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
assert.ok(R.source.title && R.source.pageLocus && R.scope);
assert.deepEqual(Object.keys(R.planets), ORDER);
for (const [p, r] of Object.entries(R.planets)) {
  for (const k of ['idol', 'form', 'mantra', 'wood', 'food', 'gift']) assert.ok(String(r[k]).length > 2, `${p}: ${k}`);
  assert.ok(Number.isInteger(r.count), p);
}
// the prescribed numbers of recitations, v.17-20 (p.1006)
assert.deepEqual(ORDER.map((p) => R.planets[p].count), [7000, 11000, 11000, 9000, 19000, 16000, 23000, 18000, 17000]);
for (const g of Object.values(R.general)) {
  const [a, b] = g.page.split('-').map(Number);
  assert.ok(a >= 1003 && (b ?? a) <= 1008 && g.verses && g.ta.length > 20);
}
for (const c of [...Object.values(R.citations), R.havana]) {
  const [a, b] = c.page.split('-').map(Number);
  assert.ok(a >= 1003 && (b ?? a) <= 1007 && a <= (b ?? a) && c.verses);
}
assert.ok(R.planets.Saturn.form.includes('கிருத்ர') && R.planets.Ketu.form.includes('கிருத்ர'), "the Sanskrit's vulture is noted where the English print says donkey");
console.log('test-planet-remedies: all assertions passed');
