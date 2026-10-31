const assert = require('assert');
const { julianDay } = require('@swisseph/node');
const K = require('./src/report/kpTransit');
const { calculateKpSystem } = require('./src/report/kpSystem');

const dm = (d, m, s = 0) => d + m / 60 + s / 3600;
const near = (a, b) => Math.abs(a - b) < 1e-6;
const pts = (a, b, c) => K.dbaPoints(a, b, c).byLords.map((r) => [r.signLord, r.starLord, r.subLord, r.from, r.to]);

// the worked groups of printed pp.161-163, each as the book lists them (sign, star, sub and the degrees)
let p = pts('Venus', 'Mars', 'Venus');            // "Mars sign, Venus star, Venus sub 13.20 to 15.33.20; Venus sign, Mars star, Venus sub 182.40 to 184.53.20"
assert.deepStrictEqual(p.map((r) => r.slice(0, 3)), [['Mars', 'Venus', 'Venus'], ['Venus', 'Mars', 'Venus']]);
assert.ok(near(p[0][3], dm(13, 20)) && near(p[0][4], dm(15, 33, 20)) && near(p[1][3], dm(182, 40)) && near(p[1][4], dm(184, 53, 20)));
p = pts('Mars', 'Venus', 'Sun');                  // three points: 15.33.20-16.13.20, 137.20-138.6.40, 184.53.20-185.33.20
assert.deepStrictEqual(p.map((r) => r.slice(0, 3)), [['Mars', 'Venus', 'Sun'], ['Sun', 'Venus', 'Mars'], ['Venus', 'Mars', 'Sun']]);
assert.ok(near(p[1][3], dm(137, 20)) && near(p[1][4], dm(138, 6, 40)) && near(p[2][3], dm(184, 53, 20)) && near(p[2][4], dm(185, 33, 20)));
p = pts('Mars', 'Saturn', 'Mercury');             // four points: Saturn/Mars/Mercury 300-301.53.20; Mars/Saturn/Mercury 215.26.40-217.20; Mars/Mercury/Saturn 237.53.20-240; Mercury/Mars/Saturn 177.53.20-180
assert.strictEqual(p.length, 4);
assert.ok(p.some((r) => r.slice(0, 3).join() === 'Saturn,Mars,Mercury' && near(r[3], 300) && near(r[4], dm(301, 53, 20))));
assert.ok(p.some((r) => r.slice(0, 3).join() === 'Mars,Saturn,Mercury' && near(r[3], dm(215, 26, 40)) && near(r[4], dm(217, 20))));
assert.ok(p.some((r) => r.slice(0, 3).join() === 'Mars,Mercury,Saturn' && near(r[3], dm(237, 53, 20)) && near(r[4], 240)));
assert.ok(p.some((r) => r.slice(0, 3).join() === 'Mercury,Mars,Saturn' && near(r[3], dm(177, 53, 20)) && near(r[4], 180)));
// Mars dasa, Kethu bhukti, Kethu anthra: 0 to 0.46.40, and by star, sub and sub-sub Kethu-Mars-Kethu or Kethu-Kethu-Mars
const mk = K.dbaPoints('Mars', 'Ketu', 'Ketu');
assert.ok(near(mk.byLords[0].from, 0) && near(mk.byLords[0].to, dm(0, 46, 40)) && mk.byLords.length === 1);
const four = new Set(mk.byStar.map((r) => `${r.starLord}/${r.subLord}/${r.subSubLord}`));
assert.ok(four.has('Ketu/Mars/Ketu') && four.has('Ketu/Ketu/Mars'));
// Venus dasa, Moon bhukti, Mercury anthra: Venus-Moon-Mercury, Moon-Mercury-Venus, Mercury-Moon-Venus
assert.deepStrictEqual(pts('Venus', 'Moon', 'Mercury').map((r) => r.slice(0, 3).join('/')), ['Venus/Moon/Mercury', 'Moon/Mercury/Venus', 'Mercury/Moon/Venus']);
// Mercury, Rahu, Jupiter: Mercury sign-Rahu star-Jupiter sub and Jupiter sign-Mercury star-Rahu sub
assert.deepStrictEqual(pts('Mercury', 'Rahu', 'Jupiter').map((r) => r.slice(0, 3).join('/')), ['Mercury/Rahu/Jupiter', 'Jupiter/Mercury/Rahu']);
// Sun, Venus, Mercury: Sun-Venus-Mercury, Venus-Sun-Mercury, Mercury-Sun-Venus
assert.deepStrictEqual(pts('Sun', 'Venus', 'Mercury').map((r) => r.slice(0, 3).join('/')).sort(), ['Mercury/Sun/Venus', 'Sun/Venus/Mercury', 'Venus/Sun/Mercury']);
// Venus, Jupiter, Moon: the book lists two (Venus-Jupiter-Moon 209.26.40-210 and Jupiter-Venus-Moon 256.13.20-257.20) and says "only two"; the table also has Venus sign, Moon star, Jupiter sub at 43.53.20-45.40
const vjm = pts('Venus', 'Jupiter', 'Moon').map((r) => r.slice(0, 3).join('/'));
assert.ok(vjm.includes('Venus/Jupiter/Moon') && vjm.includes('Jupiter/Venus/Moon'));
assert.strictEqual(vjm.length, 3, 'the book says only two; the 249-sub table has a third');
assert.strictEqual(K.subSubTable().length, 2193);

// the native's chart of printed pp.151-155 (Bombay, 23-12-1924 21:00 IST) and the significations of printed p.155: the module agrees for the seven planets;
// for Rahu and Kethu the book adds house 4, which the four-level order does not give
const kp = calculateKpSystem({ year: 1924, month: 12, day: 23, hour: 21, minute: 0, utcOffsetMinutes: 330, latitude: 18.65, longitude: 72.9167 });
const ph = K.planetHouses(kp);
const book = { Sun: [2, 7, 5], Moon: [4, 1, 5, 6, 9], Mars: [4, 8, 7, 5, 10], Mercury: [11, 4, 5, 3, 12], Jupiter: [7, 5, 6, 9], Venus: [4, 11, 7, 8], Saturn: [1, 4, 8, 7] };
for (const [pl, hs] of Object.entries(book)) assert.deepStrictEqual(ph[pl], [...hs].sort((a, b) => a - b), pl);
assert.deepStrictEqual(ph.Rahu, [1, 3, 5, 12]);   // the book: 3, 12, 5, 1 and 4
assert.deepStrictEqual(ph.Ketu, [5, 7, 8, 10]);   // the book: 8, 10, 5, 7 and 4

// the ready reckoner of the stars (printed p.158): Kethu rules stars 1, 10 and 19 at 0-13.20, 120-133.20, 240-253.20 and signifies what Kethu signifies
const rr = K.starReadyReckoner(kp);
assert.strictEqual(rr.length, 27);
for (const n of [1, 10, 19]) assert.strictEqual(rr[n - 1].lord, 'Ketu');
assert.ok(near(rr[9].from, 120) && near(rr[9].to, dm(133, 20)) && near(rr[18].from, 240));
assert.deepStrictEqual(rr[0].houses, ph.Ketu);
assert.deepStrictEqual([rr[1].lord, rr[2].lord, rr[3].lord, rr[26].lord], ['Venus', 'Sun', 'Moon', 'Mercury']);

// the reading of transiting bodies: the matter is the star lord's houses, the source the body's own, the outcome the sub lord's
const lons = { Sun: 10, Moon: 50, Mars: 100, Mercury: 150, Jupiter: 200, Venus: 250, Saturn: 300, Rahu: 330, Ketu: 150 };
const tr = K.transitReading(kp, lons);
assert.strictEqual(tr.length, 9);
const moon = tr.find((r) => r.planet === 'Moon');
assert.strictEqual(moon.starLord, 'Moon');           // 50 degrees is Rohini
assert.deepStrictEqual(moon.matterHouses, ph.Moon);
assert.deepStrictEqual(moon.subHouses, ph[moon.subLord]);

// a body inside a point: the Moon enters the points of Mars-Kethu-Kethu (Aries 0-0.46.40) within a month and is inside between enter and leave
const jd0 = julianDay(2026, 9, 18, 0);
const w = K.entryWindows({ points: mk.byLords, body: 'Moon', fromJd: jd0, days: 35, ayanamsha: 'Krishnamurti' });
assert.ok(w.length >= 1 && w[0].leaveJd > w[0].enterJd);
const mid = (w[0].enterJd + w[0].leaveJd) / 2;
const x = K.bodyLongitude(mid, 'Moon', 'Krishnamurti', 'mean');
assert.ok(x >= mk.byLords[0].from && x < mk.byLords[0].to);
assert.ok((w[0].leaveJd - w[0].enterJd) * 24 < 3.5, 'the Moon crosses 46 minutes of arc in under two hours');
// the ascendant reaches the start of the point once a day: its longitude at that instant is the point's start
const ae = K.ascendantEntries({ points: mk.byLords, latitude: 13.0827, longitude: 80.2707, fromJd: jd0, hours: 24 });
assert.ok(ae.length >= 1);
const { calculateHouses, setSiderealMode, SiderealMode, HouseSystem } = require('@swisseph/node');
const { trueAyanamsa } = require('./src/ephemeris/swissEphemeris');
setSiderealMode(SiderealMode.Krishnamurti);
const asc = ((calculateHouses(ae[0].jd, 13.0827, 80.2707, HouseSystem.Placidus).ascendant - trueAyanamsa(ae[0].jd)) % 360 + 360) % 360;
assert.ok(Math.abs(asc - mk.byLords[0].from) < 1e-4 || Math.abs(asc - 360) < 1e-4);
console.log('test-kp-transit ok');
