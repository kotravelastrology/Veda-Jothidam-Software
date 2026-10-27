const assert = require('assert');
const { calculateKpSystem } = require('./src/report/kpSystem');

// KP-Ezine (C69) worked example, Chart-1: 15-5-1963 12:05 IST (UTC+5:30), Ahmedabad 72°37'E 23°02'N.
// The book's "Computer SW" column (KPAstro 3.0 / Astrodienst, Tables 9 and 10) is the reference. Our Krishnamurti ayanamsha
// with Placidus cusps and the UT + longitude houses agree with it within 1 arcminute (planets about 42", cusps about 25").
const dms = (d, m, s) => d + m / 60 + s / 3600;
const TOLERANCE = 1 / 60; // one arcminute

const bookPlanets = {
  Sun: dms(30, 28, 4),
  Moon: dms(284, 38, 56),
  Mars: dms(117, 47, 23),
  Mercury: dms(34, 50, 17),
  Jupiter: dms(345, 59, 48),
};
const bookCusps = [
  dms(114, 41, 33), dms(140, 54, 30), dms(170, 42, 46), dms(202, 51, 2),
  dms(234, 52, 6), dms(265, 28, 12), dms(294, 41, 33), dms(320, 54, 30),
  dms(350, 42, 46), dms(22, 51, 2), dms(54, 52, 6), dms(85, 28, 12),
];

const kp = calculateKpSystem({
  year: 1963, month: 5, day: 15, hour: 12, minute: 5,
  latitude: 23 + 2 / 60, longitude: 72 + 37 / 60, utcOffsetMinutes: 330,
});

assert.strictEqual(kp.ayanamsha, 'Krishnamurti');
assert.strictEqual(kp.houseSystem, 'Placidus');

for (const [name, book] of Object.entries(bookPlanets)) {
  const ours = kp.positions.find((p) => p.name === name).longitude;
  const diff = Math.abs(ours - book);
  assert.ok(diff < TOLERANCE, `${name}: ${ours.toFixed(4)} vs book ${book.toFixed(4)} (${(diff * 60).toFixed(2)}')`);
}

kp.cusps.forEach((c, i) => {
  const diff = Math.abs(c.longitude - bookCusps[i]);
  assert.ok(diff < TOLERANCE, `cusp ${c.number}: ${c.longitude.toFixed(4)} vs book ${bookCusps[i].toFixed(4)} (${(diff * 60).toFixed(2)}')`);
});

// the ascendant is the first cusp
assert.ok(Math.abs(kp.ascendant - kp.cusps[0].longitude) < 1e-9);

console.log('test-kp-chart1 ok');
