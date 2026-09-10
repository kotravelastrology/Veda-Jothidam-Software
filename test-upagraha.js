const assert = require('node:assert/strict');
const { createBirthProfile } = require('./src/contracts/birthProfile');
const { calculateParashariChart } = require('./src/chart/parashariChart');
const { calculateUpagrahas, sunDerivedUpagrahas } = require('./src/report/upagraha');

const norm360 = (d) => ((d % 360) + 360) % 360;

// ── Sun-derived upagrahas: exact offsets from the Sun (BPHS Ch.3) ──────────
const sun = 30.2685;
const s = sunDerivedUpagrahas(sun);
assert.ok(Math.abs(s.Dhuma.longitude - norm360(sun + 133 + 20 / 60)) < 1e-9, 'Dhuma = Sun + 133°20′');
assert.ok(Math.abs(s.Vyatipata.longitude - norm360(360 - s.Dhuma.longitude)) < 1e-9, 'Vyatipata = 360 − Dhuma');
assert.ok(Math.abs(s.Parivesha.longitude - norm360(s.Vyatipata.longitude + 180)) < 1e-9, 'Parivesha = Vyatipata + 180');
assert.ok(Math.abs(s.Indrachapa.longitude - norm360(360 - s.Parivesha.longitude)) < 1e-9, 'Indrachapa = 360 − Parivesha');
assert.ok(Math.abs(s.Upaketu.longitude - norm360(s.Indrachapa.longitude + 16 + 40 / 60)) < 1e-9, 'Upaketu = Indrachapa + 16°40′');

// ── Full report path (1990-05-15 07:30 IST Erode — a Tuesday, day birth) ───
const profile = createBirthProfile({
  name: 'T', year: 1990, month: 5, day: 15, hour: 7, minute: 30,
  ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330,
  latitude: 11.34, longitude: 77.72, placeName: 'Erode',
});
const chart = calculateParashariChart(profile.chartContext);
const u = calculateUpagrahas({
  sunLongitude: chart.grahas.Sun.longitude, birthJd: chart.julianDay,
  year: 1990, month: 5, day: 15, utcOffsetMinutes: 330,
  latitude: 11.34, longitude: 77.72, ayanamsha: 'Lahiri',
});

assert.equal(u.birthPeriod, 'day', 'born ~1.5h after sunrise');
const names = ['Dhuma', 'Vyatipata', 'Parivesha', 'Indrachapa', 'Upaketu', 'Gulika', 'Mandi'];
assert.deepEqual(Object.keys(u.upagrahas), names);
for (const n of names) {
  const v = u.upagrahas[n];
  assert.ok(Number.isFinite(v.longitude) && v.longitude >= 0 && v.longitude < 360, `${n} longitude`);
  assert.ok(v.degreeInSign >= 0 && v.degreeInSign < 30, `${n} degreeInSign`);
  assert.ok(typeof v.rasi === 'string', `${n} rasi`);
}
assert.equal(u.upagrahas.Gulika.parent, 'Saturn');
assert.equal(u.upagrahas.Dhuma.parent, 'Mars');

// Dhuma sits exactly Sun + 133°20′ regardless of path.
assert.ok(Math.abs(u.upagrahas.Dhuma.longitude - norm360(chart.grahas.Sun.longitude + 133 + 20 / 60)) < 1e-6);

// Māndi lags Gulika (its instant is Gulika-start + 1/16 of the day) so its
// longitude is further along the zodiac than Gulika's (same day arc).
const gap = norm360(u.upagrahas.Mandi.longitude - u.upagrahas.Gulika.longitude);
assert.ok(gap > 0 && gap < 40, `Mandi just after Gulika (gap ${gap.toFixed(2)}°)`);

console.log(JSON.stringify({
  pass: true, birthPeriod: u.birthPeriod,
  gulika: `${u.upagrahas.Gulika.rasi} ${u.upagrahas.Gulika.degreeInSign.toFixed(2)}`,
  dhuma: `${u.upagrahas.Dhuma.rasi} ${u.upagrahas.Dhuma.degreeInSign.toFixed(2)}`,
}, null, 2));
