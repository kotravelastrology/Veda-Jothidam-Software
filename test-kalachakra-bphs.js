/**
 * The BPHS Kala Chakra dasha (src/dasha/kalachakraBphs.js): the structure of the tables, and the PL9 sample's twelve mahadashas and antardashas
 * (5 October 1990, 04:30 IST, Chennai, a Savya birth in Revati pada 3) reproduced date for date on the sample's 360-day year.
 */
const assert = require('node:assert/strict');
const K = require('./src/dasha/kalachakraBphs');
const { withBirth } = require('./src/report/horoscopeBook/charts');

// every nakshatra is in exactly one of the four groups
assert.equal(Object.keys(K.GROUP_OF).length, 27);
const count = (chakra) => Object.values(K.GROUP_OF).filter((g) => g.chakra === chakra).length;
assert.equal(count('savya'), 15);
assert.equal(count('apsavya'), 12);

// each group's four padas have the Poorna Ayu of BPHS v.89: 100, 85, 83 and 86 years (the check on the transcription)
const years = (seq) => seq.reduce((n, s) => n + K.SIGN_YEARS[s], 0);
for (const table of [K.SAVYA.ashwini, K.SAVYA.bharani]) {
  assert.deepEqual(table.map(years), [100, 85, 83, 86]);
  for (const seq of table) assert.equal(seq.length, 9);
}
// the Apsavya groups are the Savya ones reversed: the same totals in the opposite order of padas
assert.deepEqual(K.APSAVYA.mrigasira.map(years), [86, 83, 85, 100]);
assert.deepEqual(K.APSAVYA.rohini.map(years), [86, 83, 85, 100]);
// the sign years of v.84 total 118 over the twelve signs
assert.equal(K.SIGN_YEARS.reduce((a, b) => a + b, 0), 118);

// the balance: the expired part is the pada's total years times the share of the pada passed, taken off the sequence
const start = K.kalachakraMahadashas(0, 3); // the very start of Ashwini pada 1: Aries first, nothing expired
assert.equal(start.mahas[0].sign, 0);
assert.ok(Math.abs(start.mahas[0].years - 7) < 1e-9);
const half = K.kalachakraMahadashas((360 / 27 / 4) / 2, 2); // half through Ashwini pada 1: 50 years expired of 100: Aries 7, Taurus 16, Gemini 9, Cancer 21 = 53, so Cancer has 3 left
assert.equal(half.mahas[0].sign, 3);
assert.ok(Math.abs(half.mahas[0].years - 3) < 1e-6);

(async () => {
  const birth = { year: 1990, month: 10, day: 5, hour: 4, minute: 30, ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330, latitude: 13 + 5 / 60, longitude: 80 + 17 / 60, placeName: 'Chennai' };
  await withBirth(birth, ({ chart }) => {
    const PL = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
    const facts = {
      signs: Object.fromEntries(PL.map((p) => [p, chart.grahas[p].rasiIndex])),
      degrees: Object.fromEntries(PL.map((p) => [p, chart.grahas[p].longitude % 30])),
      lagnaSign: Math.floor(chart.lagna.longitude / 30),
    };
    const k = K.kalachakraMahadashas(chart.grahas.Moon.longitude, 12);
    assert.equal(k.nakshatra, 26);
    assert.equal(k.pada, 3);
    assert.equal(k.chakra, 'savya');
    assert.equal(k.deha, 1); // Taurus
    assert.equal(k.jeeva, 2); // Gemini
    assert.equal(k.totalYears, 83);
    // the sample's mahadashas in order: Tau Ari Pis Aqu Cap Sag Ari Tau Gem Can Leo Vir
    assert.deepEqual(k.mahas.map((m) => m.sign), [1, 0, 11, 10, 9, 8, 0, 1, 2, 3, 4, 5]);
    // the balance of Taurus: 0y 9m 21d on the sample, within a few days here
    assert.ok(Math.abs(k.balanceYears * 360 - (9 * 30 + 21)) < 6, String(k.balanceYears * 360));

    const birthMs = (chart.julianDay - 2440587.5) * 86400000;
    const date = (y) => new Date(birthMs + y * 360 * 86400000 + 330 * 60000).toISOString().slice(0, 10).split('-').reverse().join('-');
    const ends = ['26-07-1991', '19-06-1998', '27-04-2008', '06-04-2012', '16-03-2016', '23-01-2026', '17-12-2032', '24-09-2048', '08-08-2057', '20-04-2078', '25-03-2083', '06-02-2092'];
    assert.deepEqual(k.mahas.map((m) => date(m.endYears)), ends);

    // the antardashas: twelve parts from the sign or its seventh (the stronger), onward from an odd sign and backward from an even one
    const walk = (m) => K.subPeriods(m, facts).map((a) => a.sign + 1);
    assert.deepEqual(walk(k.mahas[0]), [2, 1, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3]); // Taurus
    assert.deepEqual(walk(k.mahas[1]), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]); // Aries
    assert.deepEqual(walk(k.mahas[2]), [6, 5, 4, 3, 2, 1, 12, 11, 10, 9, 8, 7]); // Pisces starts from its seventh, Virgo
    assert.deepEqual(walk(k.mahas[4]), [4, 3, 2, 1, 12, 11, 10, 9, 8, 7, 6, 5]); // Capricorn from Cancer
    assert.deepEqual(walk(k.mahas[8]), [9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8]); // Gemini from Sagittarius
    assert.deepEqual(walk(k.mahas[10]), [11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); // Leo from Aquarius
    // the birth mahadasha's antardashas: eleven ended before birth, the last (Gemini) is running
    const first = K.subPeriods(k.mahas[0], facts);
    assert.equal(first.filter((a) => a.elapsed).length, 11);
    assert.equal(first[11].sign, 2);
  });
  console.log('test-kalachakra-bphs: all assertions passed');
})().catch((e) => { console.error(e); process.exit(1); });
