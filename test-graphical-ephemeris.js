const assert = require('assert');
const { julianDay } = require('@swisseph/node');
const G = require('./src/chart/graphicalEphemeris');

const jd0 = julianDay(2026, 1, 1, 0);
const year = G.graphicalEphemeris({ startJd: jd0, days: 365 });

// samples: daily, 366 per planet
for (const p of G.PLANETS) assert.strictEqual(year.series[p].length, 366, p);

// the Sun is never retrograde and enters twelve signs (thirteen only if the year starts just before an ingress) in a year
const sun = year.events.filter((e) => e.planet === 'Sun');
assert.ok(sun.every((e) => e.kind === 'INGRESS' && !e.backward));
assert.ok(sun.length === 12 || sun.length === 13, `Sun ingresses ${sun.length}`);
// Mesha Sankranti 2026 (Lahiri): the Sun reaches sidereal Aries about 14 April; the ingress is on the 0-degree line of sign 0
const mesha = sun.find((e) => e.sign === 0);
const local = G.jdToLocal(mesha.jd, 330);
assert.ok(local >= '2026-04-13 00:00' && local <= '2026-04-15 23:59', `Mesha Sankranti ${local}`);
assert.strictEqual(mesha.longitude, 0);

// Mercury turns retrograde and direct about three or four times a year, alternating
const merc = year.events.filter((e) => e.planet === 'Mercury' && e.kind !== 'INGRESS');
assert.ok(merc.length >= 5 && merc.length <= 8, `Mercury stations ${merc.length}`);
for (let i = 1; i < merc.length; i += 1) assert.notStrictEqual(merc[i].kind, merc[i - 1].kind, 'stations alternate');
// at a station the speed is zero to within a few thousandths of a degree a day
for (const e of merc) assert.ok(Math.abs(G.speedAt(e.jd, 'Mercury', 'Lahiri', 'mean')) < 0.01, `station speed ${G.speedAt(e.jd, 'Mercury', 'Lahiri', 'mean')}`);

// the mean node only moves backward and has no stations; Ketu is 180 degrees from Rahu
assert.ok(year.events.filter((e) => e.planet === 'Rahu').every((e) => e.kind === 'INGRESS' && e.backward));
for (let i = 0; i < 366; i += 30) assert.ok(Math.abs(Math.abs(G.longitudeAt(jd0 + i, 'Rahu', 'Lahiri', 'mean') - G.longitudeAt(jd0 + i, 'Ketu', 'Lahiri', 'mean')) - 180) < 1e-6);

// an ingress is exactly on a sign boundary: the longitude there is within a thousandth of a degree of the line
for (const e of year.events.filter((x) => x.kind === 'INGRESS').slice(0, 10)) {
  const lon = G.longitudeAt(e.jd, e.planet, 'Lahiri', 'mean');
  const off = Math.abs(((lon + 15) % 30) - 15);
  assert.ok(off < 0.001, `${e.planet} ${off}`);
}
assert.throws(() => G.graphicalEphemeris({ startJd: jd0, days: 5, planets: ['Moon'] }), /Unsupported planet/);
console.log('test-graphical-ephemeris ok');
