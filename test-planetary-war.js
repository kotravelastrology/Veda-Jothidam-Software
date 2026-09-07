const assert = require('node:assert/strict');
const { julianDay } = require('@swisseph/node');
const { warWinner, eclipticLatitude, WAR_ELIGIBLE_PLANETS } = require('./src/chart/planetaryWar');

// Venus always wins when involved, regardless of latitude, per v.9's own explicit rule.
assert.equal(warWinner('Venus', 'Mars', { Venus: 100, Mars: 100.5 }, julianDay(2000, 1, 1, 0)), 'Venus');
assert.equal(warWinner('Saturn', 'Venus', { Saturn: 50, Venus: 50.9 }, julianDay(2000, 1, 1, 0)), 'Venus');

// No war outside the 1-degree orb (v.9).
assert.equal(warWinner('Mars', 'Saturn', { Mars: 100, Saturn: 101.5 }, julianDay(2000, 1, 1, 0)), null);

// Luminaries never participate, even if conjunct within the orb.
assert.equal(warWinner('Sun', 'Mars', { Sun: 100, Mars: 100.2 }, julianDay(2000, 1, 1, 0)), null);
assert.equal(warWinner('Moon', 'Mercury', { Moon: 100, Mercury: 100.2 }, julianDay(2000, 1, 1, 0)), null);

// BPHS's own reproduced example (translator's Notes, citing C.G. Rajan):
// Mars vs Saturn, 03:47 hrs, 15 Dec 1925 -- book states Saturn wins (higher
// latitude, +2 deg 25' vs Mars's +0 deg 21'). A modern sidereal-Lahiri
// ephemeris gives Mars +0.36 deg and Saturn +2.08 deg -- both positive
// (North) and Saturn clearly the higher of the two, reproducing the same
// winner the book declares (exact degree/minute figures differ slightly,
// expected for a ~100-year-old source using older tables).
const rajanJd = julianDay(1925, 12, 15, 3 + 47 / 60);
const marsLat = eclipticLatitude('Mars', rajanJd);
const saturnLat = eclipticLatitude('Saturn', rajanJd);
assert.ok(marsLat > 0 && marsLat < 1, `Mars latitude should be a small positive (North) figure, got ${marsLat}`);
assert.ok(saturnLat > 1 && saturnLat < 3, `Saturn latitude should be a larger positive (North) figure, got ${saturnLat}`);
assert.ok(saturnLat > marsLat, "Saturn's latitude must exceed Mars's, matching the book's declared winner");
assert.equal(
  warWinner('Mars', 'Saturn', { Mars: 208.4, Saturn: 208.28 }, rajanJd),
  'Saturn',
  "BPHS's own reproduced example: Saturn wins by higher latitude",
);

assert.deepEqual(WAR_ELIGIBLE_PLANETS, ['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']);

console.log(JSON.stringify({ pass: true, marsLat, saturnLat }, null, 2));
