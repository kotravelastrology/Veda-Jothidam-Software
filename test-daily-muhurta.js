const assert = require('node:assert/strict');
const { calculateDailyMuhurta } = require('./src/report/dailyMuhurta');

// 2026-09-10 is a Thursday (weekday 4) at Chennai.
const r = calculateDailyMuhurta({ year: 2026, month: 9, day: 10, latitude: 13.0827, longitude: 80.2707, utcOffsetMinutes: 330 });
assert.equal(r.available, true);
assert.equal(r.weekday, 4);

// ── Choghadiya: 8 day + 8 night; Thursday day starts at Shubh ──────────
assert.equal(r.choghadiya.day.length, 8);
assert.equal(r.choghadiya.night.length, 8);
assert.equal(r.choghadiya.day[0].name, 'Shubh');       // CHOG_DAY_START[4] = 5 -> cycle[5]
assert.equal(r.choghadiya.day[0].quality, 'good');
assert.equal(r.choghadiya.day[1].name, 'Rog');         // next in cycle
// each slot's [from,to] are HH:MM strings and consecutive
for (const s of r.choghadiya.day) assert.ok(/^\d\d:\d\d$/.test(s.from) && /^\d\d:\d\d$/.test(s.to));

// ── Gowri: Thursday day starts at laabam ──────────────────────────────
assert.equal(r.gowri.day.length, 8);
assert.equal(r.gowri.day[0].gowri, 'laabam');          // GOWRI_DAY_START[4] = 4
assert.equal(r.gowri.day[0].auspicious, true);
assert.equal(r.gowri.day[2].gowri, 'visham');
assert.equal(r.gowri.day[2].auspicious, false);

// ── Hora: 12 day + 12 night; Thursday's first hora = Jupiter ─────────
assert.equal(r.hora.day.length, 12);
assert.equal(r.hora.night.length, 12);
assert.equal(r.hora.day[0].lord, 'Jupiter');           // weekday lord Thursday
assert.equal(r.hora.day[0].quality, 'good');
// successive horas follow the Chaldean order from Jupiter: Jup, Mars, Sun, Venus...
assert.equal(r.hora.day[1].lord, 'Mars');
assert.equal(r.hora.day[2].lord, 'Sun');
assert.equal(r.hora.day[3].lord, 'Venus');
// the 24 horas cycle the 7 lords; hora 8 (index 7) wraps back to Jupiter
assert.equal(r.hora.day[7].lord, 'Jupiter');

// Different weekday -> different start lord.
const sun = calculateDailyMuhurta({ year: 2026, month: 9, day: 13, latitude: 13.08, longitude: 80.27, utcOffsetMinutes: 330 });
assert.equal(sun.weekday, 0);
assert.equal(sun.hora.day[0].lord, 'Sun');
assert.equal(sun.choghadiya.day[0].name, 'Udveg');

console.log(JSON.stringify({
  pass: true, sunrise: r.sunrise, sunset: r.sunset,
  chogFirst: r.choghadiya.day[0].name, gowriFirst: r.gowri.day[0].gowri, horaFirst: r.hora.day[0].lord,
}, null, 2));

// ── Panchaka / Nakshatra Karma / Panchaka Rahitam ────────────────────
{
  const d = calculateDailyMuhurta({ year: 2026, month: 9, day: 13, latitude: 13.08, longitude: 80.27, utcOffsetMinutes: 330 });
  assert.ok(typeof d.panchaka.active === 'boolean');
  assert.ok(d.panchaka.moonNakshatraIndex >= 0 && d.panchaka.moonNakshatraIndex < 27);
  // Panchaka active iff Moon is in one of the last 5 nakshatras (22..26).
  assert.equal(d.panchaka.active, d.panchaka.moonNakshatraIndex >= 22);
  // Nakshatra Karma: one of the 7 classes, with suitable-activities text.
  assert.ok(['sthira', 'chara', 'ugra', 'mishra', 'kshipra', 'mridu', 'tikshna'].includes(d.nakshatraKarma.key));
  assert.ok(d.nakshatraKarma.suitable.length > 0);
  // Panchaka Rahitam: remainder 0-8, classified; 1/2/4/6/8 inauspicious, 0/3/5/7 auspicious.
  assert.ok(d.panchakaRahitam.remainder >= 0 && d.panchakaRahitam.remainder <= 8);
  assert.equal(d.panchakaRahitam.ok, [0, 3, 5, 7].includes(d.panchakaRahitam.remainder));
}
console.log(JSON.stringify({ panchakaExtrasPass: true }, null, 2));
