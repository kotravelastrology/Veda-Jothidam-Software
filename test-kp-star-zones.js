/**
 * KP Reader V printed pp.16-39 (src/report/kpStarZones.js): the 36 zones (27 stars, those running over two signs cut at the sign's end)
 * cover the zodiac without gap or overlap, each with the sign lord and star lord the book names, its fields as printed and a Tamil
 * summary of each; spot checks against the printed text.
 */
const assert = require('node:assert/strict');
const Z = require('./src/report/kpStarZones');

assert.strictEqual(Z.ZONES.length, 36);
let at = 0;
for (const z of Z.ZONES) {
  assert.ok(Math.abs(z.from - at) < 1e-9, `${z.id} starts where the previous ends`);
  assert.ok(z.to > z.from);
  at = z.to;
  for (const f of ['body', 'diseases', 'profession']) assert.ok(z[f] && z[`${f}Ta`], `${z.id} ${f}`);
  assert.strictEqual(Boolean(z.mental), Boolean(z.mentalTa), `${z.id} mental and its Tamil go together`);
  assert.strictEqual(Boolean(z.note), Boolean(z.noteTa), `${z.id} note and its Tamil go together`);
  assert.ok(/^\d+(-\d+)?$/.test(z.pages) && Number(z.pages.split('-')[0]) >= 16 && Number(z.pages.split('-').pop()) <= 39, z.id);
  // the sign lord is the lord of the sign the zone lies in; the star lord follows the Vimshottari order from Ketu
  const SIGN_LORDS = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'];
  const STAR_LORDS = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
  assert.strictEqual(z.signLord, SIGN_LORDS[Math.floor((z.from + 1e-9) / 30)], `${z.id} sign lord`);
  assert.strictEqual(z.starLord, STAR_LORDS[Math.floor((z.from + 1e-9) / (40 / 3)) % 9], `${z.id} star lord`);
}
assert.ok(Math.abs(at - 360) < 1e-9);

// spot checks against the print
assert.strictEqual(Z.zoneOf(5).id, 'ASHWINI');
assert.strictEqual(Z.zoneOf(5).body, 'Head, Cerebral hemispheres.');
assert.strictEqual(Z.zoneOf(28).id, 'KRITTIKA_A');
assert.strictEqual(Z.zoneOf(31).id, 'KRITTIKA_B');
assert.match(Z.zoneOf(70).note, /this zone of 13°-20' is barren/, 'Ardra, p.22');
assert.strictEqual(Z.zoneOf(353.34).id, 'REVATI');
assert.strictEqual(Z.zoneOf(359.999).id, 'REVATI');
assert.strictEqual(Z.ZONES.find((z) => z.id === 'MRIGASIRA_A').mental, '', 'the book prints no mental qualities for Mrigasira first half');
assert.match(Z.ZONES.find((z) => z.id === 'PUNARVASU_A').mental, /renowned and rich men/, 'read on the page image, p.22');
assert.match(Z.ZONES.find((z) => z.id === 'HASTA').diseases, /neuralgia \(imagination\), fear complex, hysteria/, 'p.27');
assert.strictEqual(Z.zoneOf(5).starTa, 'அசுவினி');
assert.strictEqual(Z.zoneOf(31).starTa, 'கார்த்திகை (2-4 பாதங்கள்)');

const H = require('./src/report/kpHorary');
const chart = H.horaryChart({ number: 246, year: 1967, month: 10, day: 24, hour: 17, minute: 30, utcOffsetMinutes: 330, latitude: 13.0827, longitude: 80.2707 }).kp;
const rows = Z.zonesForChart(chart);
assert.ok(rows.available);
assert.strictEqual(rows.rows.length, 10);
assert.strictEqual(rows.rows[0].name, 'Ascendant');
assert.strictEqual(rows.rows[0].zone.id, 'REVATI', 'Pisces 23°20\' lies in Revati');
assert.strictEqual(Z.zonesForChart(null).available, false);
console.log('test-kp-star-zones ok');
