const assert = require('node:assert/strict');
const { createBirthProfile } = require('./src/contracts/birthProfile');
const { calculateParashariChart } = require('./src/chart/parashariChart');
const {
  calculateJaimini, calculateCharaKarakas, calculateBhavaArudhas, calculateRashiDrishti,
} = require('./src/report/jaimini');

// ── Chara Karakas: highest degree-within-sign -> Atmakaraka ─────────────
const ck = calculateCharaKarakas({
  Sun: 30.27, Moon: 268.31, Mars: 294.30, Mercury: 14.34,
  Jupiter: 75.74, Venus: 348.62, Saturn: 271.53,
});
assert.equal(ck.length, 7);
assert.equal(ck[0].role, 'Atmakaraka');
assert.equal(ck[0].planet, 'Moon');          // 268.31 % 30 = 28.31, the highest
assert.equal(ck[6].role, 'Darakaraka');
assert.equal(ck[6].planet, 'Sun');           // 30.27 % 30 = 0.27, the lowest
// strictly descending by degree-in-sign
for (let i = 1; i < ck.length; i += 1) assert.ok(ck[i - 1].degreeInSign >= ck[i].degreeInSign);

// ── Rashi Drishti: static Jaimini sign aspects ─────────────────────────
const rd = calculateRashiDrishti();
assert.equal(rd.length, 12);
// Mesha (Movable) aspects the 3 Fixed signs except the adjacent next (Vrishabha).
assert.equal(rd[0].type, 'Movable');
assert.deepEqual(rd[0].aspects.sort(), ['Kumbha', 'Simha', 'Vrischika']);
// Mithuna (Dual) aspects the other 3 Dual signs.
assert.equal(rd[2].type, 'Dual');
assert.deepEqual(rd[2].aspects.sort(), ['Dhanu', 'Kanya', 'Meena']);

// ── Bhava Arudhas: 12 entries, A1 = Arudha Lagna, A12 = Upapada ────────
const PL = {
  Sun: 30.27, Moon: 268.31, Mars: 294.30, Mercury: 14.34,
  Jupiter: 75.74, Venus: 348.62, Saturn: 271.53, Rahu: 287.64, Ketu: 107.64,
};
const ba = calculateBhavaArudhas(52.55, PL); // Vrishabha lagna
assert.equal(ba.length, 12);
assert.equal(ba[0].label, 'A1 (AL)');
assert.equal(ba[11].label, 'A12 (UL)');
for (const a of ba) assert.ok(a.rasiIndex >= 0 && a.rasiIndex < 12);

// ── Full block off a real chart ───────────────────────────────────────
const p = createBirthProfile({
  name: 'T', year: 1990, month: 5, day: 15, hour: 7, minute: 30,
  ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330,
  latitude: 11.34, longitude: 77.72, placeName: 'Erode',
});
const c = calculateParashariChart(p.chartContext);
const grahaLongitudes = {};
for (const g of ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu']) grahaLongitudes[g] = c.grahas[g].longitude;
const birthMs = Date.UTC(1990, 4, 15, 7, 30) - 330 * 60000;
const j = calculateJaimini({ lagnaLongitude: c.lagna.longitude, grahaLongitudes, birthMs });

assert.equal(j.available, true);
assert.equal(j.charaKarakas[0].planet, 'Moon');
assert.equal(j.karkamsha.atmakaraka, 'Moon');
assert.ok(j.karkamsha.ishtaDevata.devata.length > 0);
// Chara dasha: Vrishabha lagna (1-indexed sign 2, even) -> indirect (reverse).
assert.equal(j.charaDasha.direction, 'indirect');
assert.equal(j.charaDasha.periods.length, 12);
assert.equal(j.charaDasha.periods[0].rasi, 'Vrishabha'); // starts from lagna sign
for (const d of j.charaDasha.periods) assert.ok(d.years >= 1 && d.years <= 12);
// consecutive reverse-order signs
assert.equal(j.charaDasha.periods[1].rasi, 'Mesha');

console.log(JSON.stringify({
  pass: true, atmakaraka: j.charaKarakas[0].planet,
  karkamsha: j.karkamsha.rasi, arudhaLagna: j.bhavaArudhas[0].rasi,
  charaDir: j.charaDasha.direction, charaFirst: j.charaDasha.periods[0].rasi,
}, null, 2));

// ── The other 9 Jaimini rasi dashas ──────────────────────────────────
const rdd = j.rasiDashas;
assert.equal(Object.keys(rdd).length, 10);
for (const k of Object.keys(rdd)) assert.equal(rdd[k].periods.length, 12, `${k} has 12 periods`);
// Sthira: cardinal 7 + fixed 8 + dual 9, four of each -> 96.
assert.ok(Math.abs(rdd.sthira.periods.reduce((s, x) => s + x.years, 0) - 96) < 0.1, 'Sthira total 96');
// Niryana Shoola: 9 years each -> 108.
assert.ok(Math.abs(rdd.shoola.periods.reduce((s, x) => s + x.years, 0) - 108) < 0.1, 'Shoola total 108');
// Kendradi: kendras first (Vrishabha lagna -> Vrishabha, Simha, Vrischika, Kumbha).
assert.deepEqual(rdd.kendradi.periods.slice(0, 4).map((x) => x.rasi), ['Vrishabha', 'Simha', 'Vrischika', 'Kumbha']);
// Karaka dasha starts from the Atmakaraka's sign (Moon = AK here, in Dhanu).
assert.equal(rdd.karaka.atmakaraka, 'Moon');
assert.equal(rdd.karaka.startRasi, 'Dhanu');
// Yogardha = per-sign average of Chara and Sthira years.
assert.ok(rdd.yogardha.periods.every((x) => x.years > 0 && x.years <= 12));
console.log(JSON.stringify({ rasiDashaPass: true, sthira96: true, shoola108: true, karakaAK: rdd.karaka.atmakaraka }, null, 2));
