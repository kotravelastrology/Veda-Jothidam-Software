const assert = require('assert');
const { julianDay } = require('@swisseph/node');
const { rulingRisingMoments, clockOf } = require('./src/report/kpRulingTime');

const at = (x) => (x.signLord + '/' + x.starLord + '/' + x.subLord + '/' + x.subSubLord);
// Reader VI printed p.126: Matale (7°28'N 80°27'E), 21-9-1969 9:00 IST, ruling planets Sun, Saturn, Venus, Jupiter. The book names Venus sign, Jupiter star, Sun sub, Venus sub-sub at 29°20' Libra
// and gets 9:41 from its sidereal-time table; the exact ascendant reaches that point at 9:39:49 and leaves it at 9:40:17 (about a minute earlier than the printed time, recorded).
let from = julianDay(1969, 9, 21, 9 - 5.5);
let r = rulingRisingMoments(['Sun', 'Saturn', 'Venus', 'Jupiter'], { latitude: 7.4667, longitude: 80.45, fromJd: from, hours: 6 });
let row = r.bySubSub.find((x) => at(x) === 'Venus/Jupiter/Sun/Venus');
assert.ok(row && Math.abs(row.from - (209 + 20 / 60)) < 1e-6);
assert.strictEqual(clockOf(row.jds[0], 330, from).text, '9:39:49');
assert.strictEqual(clockOf(row.ends[0], 330, from).text, '9:40:17');
// every row has all its lords among the ruling planets
assert.ok(r.bySubSub.every((x) => ['Sun', 'Saturn', 'Venus', 'Jupiter'].includes(x.signLord) && ['Sun', 'Saturn', 'Venus', 'Jupiter'].includes(x.subSubLord)));
// printed p.129: Madras, 13-12-1968 11:00, Friday, ruling Venus, Sun, Mercury, Saturn; "Taurus sign and Sun star, sub of Saturn and sub-sub of Mercury, 3°30' must rise ... 4 P.M."
from = julianDay(1968, 12, 13, 11 - 5.5);
r = rulingRisingMoments(['Venus', 'Sun', 'Mercury', 'Saturn'], { latitude: 13.0827, longitude: 80.2707, fromJd: from, hours: 8 });
row = r.bySubSub.find((x) => at(x) === 'Venus/Sun/Saturn/Mercury');
assert.ok(row && row.from < 33.5 + 1e-9 && row.to > 33.5);
assert.strictEqual(clockOf(row.jds[0], 330, from).text, '15:58:52');
assert.strictEqual(clockOf(row.ends[0], 330, from).text, '16:00:02', 'the book says 4 P.M. exactly');
assert.ok(r.bySub.some((x) => x.signLord === 'Venus' && x.starLord === 'Sun' && x.subLord === 'Saturn'));
console.log('test-kp-ruling-time ok');
