const assert = require('assert');
const { kpChain } = require('./src/report/kpSystem');
const { SOURCE } = require('./src/report/kpSource');
const S = require('@swisseph/node');

// The subs: walk the zodiac and list every (sign lord, star lord, sub lord) run
const subs = [];
let prev = null;
for (let l = 0; l < 360; l += 1 / 3600) {
  const c = kpChain(l + 1e-6);
  const key = `${c.signLord}|${c.starLord}|${c.sub}`;
  if (key !== prev) { subs.push({ start: l, key, c }); prev = key; }
}
// printed p.13: "the lord of the sign, the lord of the star and the lord of the sub will be 249 instead of 243"
assert.strictEqual(subs.length, 249);
// printed p.393: the 206th sub begins at Capricorn 26d 6' 40"
const cap = 9 * 30 + 26 + 6 / 60 + 40 / 3600;
assert.ok(Math.abs(subs[205].start - cap) < 1.5 / 3600, `206th sub starts at ${subs[205].start}`);
// printed p.12: the widths of the subs in a star of 800 minutes
const width = (planet) => {
  // the sub of this planet in the Ketu star (Ashwini)
  const own = subs.filter((s) => s.start < 360 / 27 && s.c.sub === planet);
  const i = subs.indexOf(own[0]);
  return (subs[i + 1].start - subs[i].start) * 60;
};
const expected = { Sun: 40, Moon: 66 + 2 / 3, Mars: 46 + 2 / 3, Ketu: 46 + 2 / 3, Rahu: 120, Jupiter: 106 + 2 / 3, Saturn: 126 + 2 / 3, Venus: 133 + 1 / 3 };
for (const [p, minutes] of Object.entries(expected)) {
  assert.ok(Math.abs(width(p) - minutes) < 0.05, `${p} ${width(p)} vs ${minutes}`);
}
// Mercury: the book prints 1d53'40" (113 2/3 minutes); 17/120 of 800 minutes is 113 1/3 (1d53'20"), so the printed figure is a misprint, kept as printed
assert.ok(Math.abs(width('Mercury') - (113 + 1 / 3)) < 0.05);
// the order within a star: Karthika (Sun) begins Sun, Moon, Mars, Rahu ... Venus (printed p.12)
const kart = subs.filter((s) => s.c.nakshatra === 'Krittika').map((s) => s.c.sub);
assert.deepStrictEqual(kart.slice(0, 4), ['Sun', 'Moon', 'Mars', 'Rahu']);
assert.strictEqual(kart[kart.length - 1], 'Venus');
// Punarvasu: Jupiter, Saturn, ... last Rahu (printed p.13)
const pun = subs.filter((s) => s.c.nakshatra === 'Punarvasu').map((s) => s.c.sub);
assert.deepStrictEqual([pun[0], pun[1], pun[pun.length - 1]], ['Jupiter', 'Saturn', 'Rahu']);
// the ayanamsa: 23d20' for 1969, 22d40' for 1922 (printed pp.393, 481)
S.setSiderealMode(S.SiderealMode.Krishnamurti);
const ay = (y, m, d, h) => S.getAyanamsa(S.julianDay(y, m, d, h));
assert.ok(Math.abs(ay(1969, 9, 13, 3) - (23 + 20 / 60)) < 1 / 60, `1969 ${ay(1969, 9, 13, 3)}`);
assert.ok(Math.abs(ay(1922, 7, 18, 2.8) - (22 + 40 / 60)) < 1 / 60);
assert.ok(SOURCE.pageLocus.includes('249'));
console.log('test-kp-source ok');
