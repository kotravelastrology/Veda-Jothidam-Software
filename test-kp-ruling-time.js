const assert = require('assert');
const { julianDay } = require('@swisseph/node');
const { rulingRisingMoments, rulingTransitMoments, clockOf } = require('./src/report/kpRulingTime');

const at = (x) => (x.signLord + '/' + x.starLord + '/' + x.subLord + '/' + x.subSubLord);
// Reader VI printed p.126: Matale (7°28'N 80°27'E), 21-9-1969 9:00 IST, ruling planets Sun, Saturn, Venus, Jupiter. The book names Venus sign, Jupiter star, Sun sub, Venus sub-sub at 29°20' Libra
// and gets 9:41 from its sidereal-time table; the exact ascendant reaches that point at 9:39:49 and leaves it at 9:40:18 (about a minute earlier than the printed time, recorded).
let from = julianDay(1969, 9, 21, 9 - 5.5);
let r = rulingRisingMoments(['Sun', 'Saturn', 'Venus', 'Jupiter'], { latitude: 7.4667, longitude: 80.45, fromJd: from, hours: 6 });
let row = r.bySubSub.find((x) => at(x) === 'Venus/Jupiter/Sun/Venus');
assert.ok(row && Math.abs(row.from - (209 + 20 / 60)) < 1e-6);
assert.strictEqual(clockOf(row.jds[0], 330, from).text, '9:39:49');
assert.strictEqual(clockOf(row.ends[0], 330, from).text, '9:40:18');
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

// printed pp.138-141, the birth time from the ruling planets of the moment of judgment. 16-10-1919, between 4:30 and 5:30 at 21°07'N 73°40'E, ruling Rahu, Moon, Mercury, Sun, Saturn:
// the book chooses Mercury sign, Moon star, Rahu sub, Saturn sub-sub and gets 5:23:50 IST; the position is entered at 5:23:22 and left at 5:24:43.
from = julianDay(1919, 10, 16, 4.5 - 5.5);
r = rulingRisingMoments(['Rahu', 'Moon', 'Mercury', 'Sun', 'Saturn'], { latitude: 21.1167, longitude: 73.6667, fromJd: from, hours: 1 });
row = r.bySubSub.find((x) => at(x) === 'Mercury/Moon/Rahu/Saturn');
assert.ok(row);
assert.deepStrictEqual([clockOf(row.jds[0], 330, from).text, clockOf(row.ends[0], 330, from).text], ['5:23:22', '5:24:43']);
// 13-11-1948 at 17°44'N 83°23'E: Mercury sign, Moon star, Sun sub, Mercury sub-sub (23°10' Virgo); the book's birth time 3:36:45 IST is two seconds after the point is left at 3:36:43
from = julianDay(1948, 11, 13, 0 - 5.5);
r = rulingRisingMoments(['Sun', 'Moon', 'Mercury'], { latitude: 17.7333, longitude: 83.3833, fromJd: from, hours: 24 });
row = r.bySubSub.find((x) => at(x) === 'Mercury/Moon/Sun/Mercury');
assert.ok(row);
assert.deepStrictEqual([clockOf(row.jds[0], 330, from).text, clockOf(row.ends[0], 330, from).text], ['3:36:19', '3:36:43']);

// printed p.131 (N.B.): the Moon for days. The drugs example (Matale, 13-9-1969 1:15 P.M.; ruling Rahu, Jupiter, Venus, Saturn): the book has the Moon reach Rahu star, Jupiter sub, Venus
// sub-sub (9°32'28" Libra) at 2:39 P.M. on 15-9-1969. Its chart has the Moon at 11°27' Virgo at 1:15; the ephemeris here has 14°31', so the Moon reaches the point at 11:06:48 that day (recorded).
from = julianDay(1969, 9, 13, 13.25 - 5.5);
const t = rulingTransitMoments(['Rahu', 'Jupiter', 'Venus', 'Saturn'], { body: 'Moon', fromJd: from, days: 4 });
row = t.bySubSub.find((x) => at(x) === 'Venus/Rahu/Jupiter/Venus');
assert.ok(row && Math.abs(row.from - (180 + 9 + 32 / 60 + 27 / 3600)) < 0.001);
assert.strictEqual(clockOf(row.times[0].enterJd, 330, from).text, '11:06:48');
assert.strictEqual(clockOf(row.times[0].enterJd, 330, from).dayOffset, 2);
// Sun and Jupiter walk sub by sub; the 249-sub table only
assert.strictEqual(rulingTransitMoments(['Rahu', 'Jupiter', 'Venus', 'Saturn'], { body: 'Jupiter', fromJd: from, days: 1500 }).bySubSub.length, 0);
assert.throws(() => rulingTransitMoments(['Sun'], { body: 'Mars', fromJd: from, days: 10 }), RangeError);
console.log('test-kp-ruling-time ok');
