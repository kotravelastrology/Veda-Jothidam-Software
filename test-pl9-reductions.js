/**
 * Page 17 (Ashtakavarga reductions) against the pindas Parashara's Light prints on three printouts: Arjun (HC4 p.17), meera (HC2 p.16) and the aniruddha sample (HC4 p.17).
 * Every Rashi, Graha and Sodhya Pinda of every planet and the Lagna agrees to the unit: the Rashi multiplier of Virgo is 6 (BPHS Santhanam Vol.2 ch.69 p.879) and a sign
 * holding only the Lagna counts as occupied for the Ekadhipatya rule.
 */
const assert = require('assert');
const { BOOK_SECTIONS } = require('./src/report/horoscopeBook/bookSections');
const BIRTHS = {"arjun": {"year": 1983, "month": 5, "day": 12, "hour": 15, "minute": 5, "second": 0, "ianaTimeZone": "Asia/Kolkata", "utcOffsetMinutes": 330, "latitude": 12.983333333333333, "longitude": 77.58333333333333, "placeName": "x"}, "meera": {"year": 2019, "month": 10, "day": 14, "hour": 8, "minute": 31, "second": 0, "ianaTimeZone": "Europe/Oslo", "utcOffsetMinutes": 120, "latitude": 58.96666666666667, "longitude": 5.75, "placeName": "x"}, "anir": {"year": 1990, "month": 10, "day": 5, "hour": 4, "minute": 30, "second": 0, "ianaTimeZone": "Asia/Kolkata", "utcOffsetMinutes": 330, "latitude": 13.083333333333334, "longitude": 80.28333333333333, "placeName": "x"}};
const PL9 = {"arjun": {"Sun": [114, 49, 163], "Moon": [91, 25, 116], "Mars": [151, 78, 229], "Mercury": [55, 29, 84], "Jupiter": [110, 16, 126], "Venus": [90, 14, 104], "Saturn": [119, 60, 179], "Lagna": [102, 7, 109]}, "meera": {"Sun": [111, 80, 191], "Moon": [131, 45, 176], "Mars": [90, 70, 160], "Mercury": [63, 48, 111], "Jupiter": [65, 23, 88], "Venus": [82, 0, 82], "Saturn": [100, 70, 170], "Lagna": [135, 48, 183]}, "anir": {"Sun": [159, 57, 216], "Moon": [122, 56, 178], "Mars": [141, 49, 190], "Mercury": [139, 41, 180], "Jupiter": [101, 51, 152], "Venus": [74, 10, 84], "Saturn": [72, 44, 116], "Lagna": [77, 49, 126]}};
(async () => {
  for (const key of Object.keys(PL9)) {
    const doc = await BOOK_SECTIONS.find((s) => s.id === 'p17').build({ name: key, birth: BIRTHS[key] });
    const flat = JSON.stringify(doc.blocks.filter((b) => b.kind === 'table'));
    const tables = doc.blocks.filter((b) => b.kind === 'table');
    const names = Object.keys(PL9[key]);
    assert.strictEqual(tables.length, names.length, `${key}: one pinda table for each body`);
    tables.forEach((t, i) => {
      const got = t.rows.map((r) => Number(r[1]));
      assert.deepStrictEqual(got, PL9[key][names[i]], `${key} ${names[i]} pindas ${got} against PL9 ${PL9[key][names[i]]}`);
    });
  }
  console.log('test-pl9-reductions: all assertions passed');
})().catch((e) => { console.error(e); process.exit(1); });
