const assert = require('assert');
const P = require('./src/report/printSets');

const birth = { year: 1990, month: 10, day: 5, hour: 4, minute: 30, second: 0, ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330, latitude: 13.0827, longitude: 80.2707, placeName: 'Chennai' };

// the ephemeris at 0h local time (UT+5:30) for 18 Sep 2026 against PL9's ephemeris file of the audit (its row of 18-09-26: Su 5 00:39:19, Ma 2 29:34:50, Me 5 17:17:58,
// Ju 3 22:52:38, Ve 6 10:05:19, Sa 11 18:21:11 retrograde, Ra 10 04:10:51 retrograde): the same instant, within ten seconds of arc (the Moon and the node differ by a few)
const e = P.ephemerisDocument({ year: 2026, month: 9, offsetMinutes: 330 });
assert.strictEqual(e.blocks[0].rows.length, 30);
const row = e.rows.find((r) => r.date === '18-09-2026');
const pl9 = { Sun: [5, 0, 39, 19], Mars: [2, 29, 34, 50], Mercury: [5, 17, 17, 58], Jupiter: [3, 22, 52, 38], Venus: [6, 10, 5, 19], Saturn: [11, 18, 21, 11], Rahu: [10, 4, 10, 51], Moon: [7, 18, 42, 49] };
for (const [b, [sign, d, m, s]] of Object.entries(pl9)) {
  const want = sign * 30 + d + m / 60 + s / 3600;
  const tol = b === 'Moon' ? 15 : 10;
  assert.ok(Math.abs(row.lon[b] - want) * 3600 <= tol, `${b} ${row.lon[b]} vs PL9 ${want}`);
}
assert.ok(row.speed.Saturn < 0 && row.speed.Rahu < 0 && row.speed.Sun > 0, 'Saturn and the node retrograde');
assert.ok(e.blocks[0].rows[17].join('|').includes('ஆர்'));
// the CSV carries the same rows in degrees
const csv = P.ephemerisCsv({ year: 2026, month: 9, offsetMinutes: 330 }).trim().split('\n');
assert.strictEqual(csv.length, 31);
assert.ok(csv[0].startsWith('date,julian_day_ut,longitude_Sun,speed_Sun'));
assert.ok(Math.abs(Number(csv[18].split(',')[2]) - row.lon.Sun) < 1e-5);
// the arc formats
assert.strictEqual(P.dms(30 + 12.5 + 1 / 120), 'ரிஷபம் 12°30′30″');
assert.strictEqual(P.speedText(-0.0728), '-00:04:22');

// the panchang of a month: one row a day with the Tirukanita limbs (18 Sep 2026 at Bengaluru: Shukla Saptami, Moon in Scorpio's Anuradha/Jyeshtha neighbourhood)
const pc = P.panchangDocument({ year: 2026, month: 9, place: { latitude: 12.9833, longitude: 77.5833, utcOffsetMinutes: 330, placeName: 'Bengaluru' } });
assert.strictEqual(pc.blocks[0].rows.length, 30);
assert.ok(pc.blocks[0].rows[17][3].startsWith('Saptami'), pc.blocks[0].rows[17][3]);

// the KP print: twelve cusps, nine planets, twelve houses of significators; Mercury is the 7th cusp sub-lord of the audit chart
const kp = P.kpDocument({ birth, name: 'A' });
assert.deepStrictEqual(kp.blocks.map((b) => b.rows.length), [12, 9, 12]);
assert.strictEqual(kp.blocks[0].rows[6][5], 'புதன்');

// dashas: three levels is nine by nine by nine for a whole life; the first row is Mercury-Mercury-Mercury from birth; level 5 is limited to the window
const d3 = P.dashaDocument({ birth, name: 'A', levels: 3 });
assert.strictEqual(d3.blocks[0].rows.length, 729);
assert.deepStrictEqual(d3.blocks[0].rows[0].slice(0, 4), ['புதன்', 'புதன்', 'புதன்', '1990-10-05']);
const d5 = P.dashaDocument({ birth, name: 'A', levels: 5, fromYear: 2026, toYear: 2026 });
assert.ok(d5.blocks[0].rows.length > 100 && d5.blocks[0].rows.length <= 800);
assert.ok(d5.blocks[0].rows.every((r) => r.length === 7 && r[5] >= '2026'), 'five levels, then the start and the end');
// the compact lifetime: nine dashas, each with nine bhuktis
const cl = P.compactLifetimeDocument({ birth, name: 'A' });
assert.deepStrictEqual(cl.blocks.map((b) => b.rows.length), Array(9).fill(9));
// the transit/dasha report on 18 Sep 2026: Sun dasha, Rahu bhukti, Rahu antara (as the event board), nine transit rows
const tr = P.transitDocument({ birth, name: 'A', on: { year: 2026, month: 9, day: 18 } });
assert.deepStrictEqual(tr.blocks[0].rows.slice(0, 3).map((r) => r[1]), ['சூரியன்', 'ராகு', 'ராகு']);
assert.strictEqual(tr.blocks[1].rows.length, 9);
// the birth-data file: a header and one record with the lagna and nine longitudes
const bx = P.birthExportText({ birth, name: 'A' }).trim().split('\n');
assert.strictEqual(bx.length, 2);
assert.strictEqual(bx[0].split('\t').length, bx[1].split('\t').length);
assert.strictEqual(bx[1].split('\t')[2], '05:10:1990');
console.log('test-print-sets ok');
