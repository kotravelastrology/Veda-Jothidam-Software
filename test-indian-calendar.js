const assert = require('assert');
const { julianDay } = require('@swisseph/node');
const C = require('./src/panchangam/indianCalendar');
const E = require('./src/report/eventChart');
const { createChartContext } = require('./src/contracts/chartContext');
const { calculateParashariChart } = require('./src/chart/parashariChart');

const bengaluru = { latitude: 12.9833, longitude: 77.5833, utcOffsetMinutes: 330 };

// the Chaitradi year of A.D. 2026 is Vikram Samvat 2083; it holds an intercalated Jyeshtha (17 May to 15 June 2026) before the real Jyeshtha
const y = C.lunarYear(2026);
assert.strictEqual(y.vikramSamvat, 2083);
assert.deepStrictEqual(y.months.map((m) => C.MONTHS[m.nameIndex] + (m.adhika ? '*' : '')),
  ['Chaitra', 'Vaishakha', 'Jyeshtha*', 'Jyeshtha', 'Ashadha', 'Shravana', 'Bhadrapada', 'Ashvina', 'Kartika', 'Margashirsha', 'Pausha', 'Magha', 'Phalguna']);

// the intercalated months of 2001-2026 as the almanacs have them (Ashvina 2001, Shravana 2004, Jyeshtha 2007, Vaishakha 2010, Bhadrapada 2012, Ashadha 2015, Jyeshtha 2018, Ashvina 2020, Shravana 2023, Jyeshtha 2026)
const adhika = {};
for (let a = 2001; a <= 2026; a += 1) {
  const m = C.lunarYear(a).months.filter((x) => x.adhika);
  if (m.length) adhika[a] = C.MONTHS[m[0].nameIndex];
}
assert.deepStrictEqual(adhika, { 2001: 'Ashvina', 2004: 'Shravana', 2007: 'Jyeshtha', 2010: 'Vaishakha', 2012: 'Bhadrapada', 2015: 'Ashadha', 2018: 'Jyeshtha', 2020: 'Ashvina', 2023: 'Shravana', 2026: 'Jyeshtha' });

// the event of the audit chart: 18 Sep 2026 07:59:35 Bengaluru is Bhadrapada bright 7 (PL9: Shukla Saptami)
const now = C.indianFromJd(julianDay(2026, 9, 18, 7 + 59 / 60 + 35 / 3600 - 5.5), bengaluru);
assert.deepStrictEqual([now.vikramSamvat, now.amantaMonth, now.paksha, now.tithi, now.adhika], [2083, 5, 'SHUKLA', 7, false]);
// the other way: Vikram Samvat 2083 Bhadrapada bright 7 at sunrise is 18 September 2026
let r = C.civilFromIndian({ vikramSamvat: 2083, month: 5, tithi: 7, method: 'AMANTA', place: bengaluru });
assert.deepStrictEqual([r.ok, r.date.year, r.date.month, r.date.day], [true, 2026, 9, 18]);
assert.ok(r.date.hour === 6 && r.sunrise.hour === 6, 'sunrise in the early morning at Bengaluru');
// ghatis after sunrise: 2 ghatis 30 palas = 2 x 24 + 30 x 0.4 = 60 minutes
const later = C.civilFromIndian({ vikramSamvat: 2083, month: 5, tithi: 7, method: 'AMANTA', ghatis: { ghati: 2, pala: 30, vipala: 0 }, place: bengaluru });
assert.ok(Math.abs((later.jd - r.jd) * 1440 - 60) < 0.01);
// the intercalated Jyeshtha begins 17 May 2026; the real one's first tithi (08:24 on 15 June to 04:30 on 16 June at Bengaluru) holds no sunrise, so its second tithi is on 16 June
r = C.civilFromIndian({ vikramSamvat: 2083, month: 2, tithi: 1, method: 'AMANTA', adhika: true, place: bengaluru });
assert.deepStrictEqual([r.ok, r.date.month, r.date.day, r.adhika], [true, 5, 17, true]);
assert.strictEqual(C.civilFromIndian({ vikramSamvat: 2083, month: 2, tithi: 1, method: 'AMANTA', place: bengaluru }).kshaya, true);
r = C.civilFromIndian({ vikramSamvat: 2083, month: 2, tithi: 2, method: 'AMANTA', place: bengaluru });
assert.deepStrictEqual([r.date.month, r.date.day], [6, 16]);
// Bhadrapada has no intercalated month in 2083
assert.strictEqual(C.civilFromIndian({ vikramSamvat: 2083, month: 5, tithi: 7, method: 'AMANTA', adhika: true, place: bengaluru }).ok, false);

// purnimanta: the dark half of Ashvina (purnimanta) is the dark half of Bhadrapada (amanta); the bright half has one name in both
const am = C.civilFromIndian({ vikramSamvat: 2083, month: 5, tithi: 20, method: 'AMANTA', place: bengaluru });
const pu = C.civilFromIndian({ vikramSamvat: 2083, month: 6, tithi: 20, method: 'PURNIMANTA', place: bengaluru });
assert.strictEqual(am.jd, pu.jd);
assert.strictEqual(C.civilFromIndian({ vikramSamvat: 2083, month: 6, tithi: 5, method: 'AMANTA', place: bengaluru }).jd, C.civilFromIndian({ vikramSamvat: 2083, month: 6, tithi: 5, method: 'PURNIMANTA', place: bengaluru }).jd);
const dk = C.indianFromJd(am.jd, bengaluru);
assert.deepStrictEqual([dk.paksha, dk.tithiInPaksha, dk.amantaMonth, dk.purnimantaMonth], ['KRISHNA', 5, 5, 6]);

// a tithi that has no sunrise in it (Chaitra bright 1 of 2083 begins 06:53 on 19 March and ends 04:52 on 20 March at Bengaluru) is reported, not guessed
r = C.civilFromIndian({ vikramSamvat: 2083, month: 0, tithi: 1, method: 'AMANTA', place: bengaluru });
assert.strictEqual(r.ok, false);
assert.strictEqual(r.kshaya, true);
// a tithi with sunrises on two days (vriddhi) is found by the second-day option, and refused otherwise
let found = null;
for (let t = 1; t <= 30 && !found; t += 1) {
  const x = C.civilFromIndian({ vikramSamvat: 2083, month: 7, tithi: t, method: 'AMANTA', vriddhi: true, place: bengaluru });
  if (x.ok) found = { t, x };
}
if (found) {
  const first = C.civilFromIndian({ vikramSamvat: 2083, month: 7, tithi: found.t, method: 'AMANTA', place: bengaluru });
  assert.ok(Math.abs(found.x.jd - first.jd - 1) < 0.05, 'the second day is a day after the first');
}
assert.strictEqual(C.civilFromIndian({ vikramSamvat: 2083, month: 5, tithi: 7, method: 'AMANTA', vriddhi: true, place: bengaluru }).vriddhiMissing, true);

// the event page carries the Indian date
const ctx = createChartContext({ year: 1990, month: 10, day: 5, hour: 4, minute: 30, ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330, latitude: 13.0827, longitude: 80.2707, calendarMode: 'tirukanita' });
const ev = E.eventChart({ natal: { ctx, chart: calculateParashariChart(ctx) }, event: { year: 2026, month: 9, day: 18, hour: 7, minute: 59, second: 35, ...bengaluru } });
assert.deepStrictEqual([ev.gochara.indian.vikramSamvat, ev.gochara.indian.amantaMonth, ev.gochara.indian.tithi], [2083, 5, 7]);
console.log('test-indian-calendar ok');
