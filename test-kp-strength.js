const assert = require('assert');
const { describeStrength, ECLIPSE, RETRO_TOPICS } = require('./src/report/kpStrength');
const { calculateKpSystem } = require('./src/report/kpSystem');

// twelve cusp paragraphs on printed pp.151-152, in order
assert.deepStrictEqual(ECLIPSE.map((e) => e[0]), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
assert.ok(ECLIPSE.every((e) => e[1] === 151 || e[1] === 152) && ECLIPSE.slice(0, 7).every((e) => e[1] === 151) && ECLIPSE.slice(7).every((e) => e[1] === 152));
assert.ok(ECLIPSE[0][2].startsWith('the native will be imprisoned') && ECLIPSE[7][2].includes('want of sense') && ECLIPSE[11][2] === 'Various diseases, dishonour, disappearance of wealth, detention, bondage.');
assert.deepStrictEqual(RETRO_TOPICS.map((t) => t.houses), [[2, 7, 11], [1, 6, 10], [3, 12], [6, 11]]);

const kp = calculateKpSystem({ year: 1990, month: 10, day: 5, hour: 4, minute: 30, utcOffsetMinutes: 330, latitude: 13.0827, longitude: 80.2707, ianaTimeZone: 'Asia/Kolkata' });
const s = describeStrength(kp);
assert.strictEqual(s.available, true);
// nodes are never retrograde; a planet's own retrograde flag equals the chart's (except the nodes)
for (const p of s.planets) {
  const src = kp.positions.find((x) => x.name === p.planet);
  assert.strictEqual(p.retrograde, ['Rahu', 'Ketu'].includes(p.planet) ? false : Boolean(src.retrograde));
  assert.strictEqual(p.inRetrogradeStar, ['Rahu', 'Ketu'].includes(p.starLord) ? false : Boolean(kp.positions.find((x) => x.name === p.starLord).retrograde));
}
// blocked + free = the significators of the topic's houses
for (const t of s.topics) assert.strictEqual(t.status, t.blocked.length ? 'HELD' : 'NOT_HELD');
assert.strictEqual(s.eclipse.length, 12);
for (const e of s.eclipse) {
  assert.strictEqual(e.subLord, kp.cusps.find((c) => c.number === e.cusp).sub);
  if (e.starLord === 'Sun' || ['Rahu', 'Ketu'].includes(e.starLord)) assert.strictEqual(e.separationFromSun, null);
  else assert.ok(e.separationFromSun >= 0 && e.separationFromSun <= 180);
}
console.log('test-kp-strength ok');
