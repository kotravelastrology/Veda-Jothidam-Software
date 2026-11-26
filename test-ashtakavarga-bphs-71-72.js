/**
 * BPHS ch.71 (src/report/ashtakavargaLongevity.js, fixture bphs-71.json) and ch.72 (src/report/samudayaEffects.js, fixture bphs-72.json): the fixtures' shape, the book's worked
 * span of the Sun's Ashtakavarga, and the Samudaya rules on counts and charts worked by hand.
 */
const assert = require('node:assert/strict');
const L = require('./src/report/ashtakavargaLongevity');
const S = require('./src/report/samudayaEffects');
const { withBirth } = require('./src/report/horoscopeBook/charts');
const { calculateBhinnashtakavarga, LAGNA_PLACES } = require('./src/chart/ashtakavarga');

// ch.71 fixture and the spans of v.1-4, in ghatikas (a day is 60, a month 30 days, a year 12 months)
assert.ok(L.DATA.source.title && L.DATA.source.pageLocus && L.DATA.scope.length > 200 && L.DATA.spans.ta.length > 80 && L.DATA.spans.page === '895');
assert.deepEqual(L.DATA.spans.perRekha.map((r) => r.rekhas), [0, 1, 2, 3, 4, 5, 6, 7, 8]);
const days = (d) => d * 60;
const years = (y) => y * 360 * 60;
assert.deepEqual(L.DATA.spans.perRekha.map((r) => r.ghatikas), [days(2), days(1.5), days(1), days(0.5), days(7.5), years(2), years(4), years(6), years(8)]);
assert.throws(() => L.spanGhatikas([9]), RangeError);

// the book's chart (p.896): the Sun's rekhas 5 3 2 4 3 4 6 5 2 3 6 5 give 14 years 0 months 18 days 30 ghatikas, half 7 years 0 months 9 days 15 ghatikas
const ex = L.DATA.example;
const span = L.spanGhatikas(ex.sunRekhas);
assert.deepEqual(L.toYmd(span), ex.total);
assert.deepEqual(L.toYmd(span / 2), ex.half);
// the book's own row of years: 2 0 0 0 0 0 4 2 0 0 4 2 (rekhas 5 and 6 give 2 and 4 years), days 0 0 1 7 0 7 0 0 1 0 0 0 and ghatikas
assert.deepEqual(ex.sunRekhas.map((r) => L.SPAN_OF[r] >= years(1) ? L.SPAN_OF[r] / years(1) : 0), [2, 0, 0, 0, 0, 0, 4, 2, 0, 0, 4, 2]);
assert.deepEqual(L.toYmd(0), { years: 0, months: 0, days: 0, ghatikas: 0 });
assert.deepEqual(L.toYmd(years(1) + 31 * 60 + 5), { years: 1, months: 1, days: 1, ghatikas: 5 });

// ch.72 fixture
assert.ok(S.DATA.source.title && S.DATA.source.pageLocus && S.DATA.scope.length > 300 && S.DATA.limits.page === '897-898' && S.DATA.houses.page === '898');
assert.deepEqual(S.DATA.counts.map((c) => c.max), Array.from({ length: 24 }, (_, i) => i + 7), '7 or fewer, then 8 to 30');
assert.ok(S.DATA.counts.every((c) => c.effect.length > 5 && c.remedy.length > 5 && c.label));
assert.equal(S.DATA.counts.at(-1).remedy, 'பரிகாரம் சொல்லப்படவில்லை', 'the book names no remedy for 30');
for (const k of ['limits', 'houses', 'wealth', 'sections', 'month', 'above', 'muhurta']) assert.ok(S.DATA[k].ta.length > 60 && S.DATA[k].verses && S.DATA[k].page, k);

// the bands of v.3-6 and the count that the verses and the worked example read differently
assert.deepEqual(S.band(31), { band: 'favourable', exactly30: false, above40: false });
assert.deepEqual(S.band(30), { band: 'medium', exactly30: true, above40: false });
assert.deepEqual(S.band(25), { band: 'medium', exactly30: false, above40: false });
assert.deepEqual(S.band(24), { band: 'adverse', exactly30: false, above40: false });
assert.equal(S.band(41).above40, true);
assert.equal(S.band(40).above40, false);

// the effect of the Sun's month by count (v.11-28)
assert.equal(S.monthEntry(0).max, 7);
assert.equal(S.monthEntry(7).max, 7);
assert.equal(S.monthEntry(8).max, 8);
assert.equal(S.monthEntry(9).effect, 'பாம்பு ஆபத்து');
assert.equal(S.monthEntry(12).effect, 'நீரில் மூழ்கி மரண ஆபத்து');
assert.equal(S.monthEntry(24).effect, 'உறவினர் மரணம்');
assert.equal(S.monthEntry(30).effect, 'செல்வமும் தானியமும் கிடைக்கும்');
assert.equal(S.monthEntry(31), null, 'above 30 is v.29');

// the wealth condition of v.7-8 by hand: Lagna 40; 10th 20, 11th 30, 12th 25
const house = (...v) => Array.from({ length: 12 }, (_, i) => v[i] ?? 20);
let w = S.wealthCondition(house(40, 20, 20, 20, 20, 20, 20, 20, 20, 20, 30, 25));
assert.deepEqual(w, { held: true, eleventhOverTenth: true, twelfthUnderEleventh: true, lagnaLargest: true, reverse: false });
w = S.wealthCondition(house(40, 20, 20, 20, 20, 20, 20, 20, 20, 30, 20, 25));
assert.deepEqual([w.held, w.eleventhOverTenth, w.twelfthUnderEleventh, w.lagnaLargest, w.reverse], [false, false, false, true, false]);
w = S.wealthCondition(house(20, 20, 20, 20, 20, 20, 20, 20, 20, 30, 20, 25));
assert.equal(w.reverse, true, 'all three conditions fail');
assert.equal(S.wealthCondition(house(30, 20, 20, 20, 20, 20, 20, 20, 20, 20, 25, 20)).lagnaLargest, true);
assert.equal(S.wealthCondition(house(30, 30, 20, 20, 20, 20, 20, 20, 20, 20, 25, 20)).lagnaLargest, false, 'a tie is not the largest');

// the three parts of life of v.9-10, from Aries: Moon 1st, Mercury 3rd, Mars 5th, Saturn 6th, Rahu 7th, Jupiter 9th, Venus 10th, Sun 11th, Ketu 12th
const signs = { Moon: 0, Mercury: 2, Mars: 4, Saturn: 5, Rahu: 6, Jupiter: 8, Venus: 9, Sun: 10, Ketu: 11 };
const parts = S.sections(signs, 0);
assert.deepEqual(parts.map((p) => [p.benefics, p.malefics, p.reading]), [
  [['Moon', 'Mercury'], [], 'benefics'],
  [[], ['Mars', 'Saturn', 'Rahu'], 'malefics'],
  [['Jupiter', 'Venus'], ['Sun', 'Ketu'], 'equal'],
]);

// a real chart: the 5 October 1990 sample; the Samudaya is the seven Bhinnashtakavargas and the Ascendant's (337 + 49), the longevity the book's spans of the eight
const birth = { year: 1990, month: 10, day: 5, hour: 4, minute: 30, ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330, latitude: 13 + 5 / 60, longitude: 80 + 17 / 60, placeName: 'Chennai' };
(async () => {
  await withBirth(birth, ({ chart }) => {
    const rasi = L.rasiPositions(chart);
    const sam = S.samudaya(rasi);
    assert.equal(sam.length, 12);
    assert.equal(sam.reduce((a, b) => a + b, 0), 337 + 49);
    const lagnaBav = calculateBhinnashtakavarga('Lagna', rasi, LAGNA_PLACES);
    assert.equal(lagnaBav.reduce((a, b) => a + b, 0), 49);
    for (let i = 0; i < 12; i += 1) assert.equal(sam[i], S.PLANETS.reduce((s, p) => s + calculateBhinnashtakavarga(p, rasi)[i], 0) + lagnaBav[i]);
    const counts = S.houseCounts(sam, chart.lagna.rasiIndex);
    assert.equal(counts[0], sam[chart.lagna.rasiIndex]);
    assert.equal(counts[11], sam[(chart.lagna.rasiIndex + 11) % 12]);
    const lon = L.longevity(rasi);
    assert.equal(lon.charts.length, 8);
    assert.deepEqual(lon.charts.map((c) => c.chart), ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Lagna']);
    assert.ok(lon.charts.every((c) => c.span === L.spanGhatikas(c.rekhas) && c.half === c.span / 2));
    assert.equal(lon.charts.find((c) => c.chart === 'Sun').rekhas.reduce((a, b) => a + b, 0), 48);
    assert.equal(lon.total, lon.charts.reduce((a, c) => a + c.half, 0));
  });
  console.log('test-ashtakavarga-bphs-71-72: all assertions passed');
})().catch((e) => { console.error(e); process.exit(1); });
