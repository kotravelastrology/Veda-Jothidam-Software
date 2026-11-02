/**
 * The Shadbala "pl9" reading (shadbala.js, reading: 'pl9') against the rows Parashara's Light prints on three printouts: Arjun (12 May 1983 15:05 Bengalooru, HC4 p.11),
 * meera (14 Oct 2019 08:31 Stavanger, HC2 p.10) and the aniruddha sample (5 Oct 1990 04:30 Chennai, HC4 p.11). Every component listed here is identical to the paisa
 * on all three; Nata-Unnata, Ayana, Chesta and Drik are PL9's own approximations and are not asserted (see docs/PL9-multi-sample-audit.md).
 */
const assert = require('assert');
const { withBirth } = require('./src/report/horoscopeBook/charts');
const SB = require('./src/chart/shadbala');
const PL = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const BIRTHS = {"arjun": {"year": 1983, "month": 5, "day": 12, "hour": 15, "minute": 5, "second": 0, "ianaTimeZone": "Asia/Kolkata", "utcOffsetMinutes": 330, "latitude": 12.983333333333333, "longitude": 77.58333333333333, "placeName": "x"}, "meera": {"year": 2019, "month": 10, "day": 14, "hour": 8, "minute": 31, "second": 0, "ianaTimeZone": "Europe/Oslo", "utcOffsetMinutes": 120, "latitude": 58.96666666666667, "longitude": 5.75, "placeName": "x"}, "anir": {"year": 1990, "month": 10, "day": 5, "hour": 4, "minute": 30, "second": 0, "ianaTimeZone": "Asia/Kolkata", "utcOffsetMinutes": 330, "latitude": 13.083333333333334, "longitude": 80.28333333333333, "placeName": "x"}};
const PL9 = {"arjun": {"ochcha": [54.17, 56.41, 28.27, 14.31, 16.88, 35.77, 55.33], "sapta": [61.88, 82.5, 108.75, 73.13, 97.5, 93.75, 65.63], "ojha": [30.0, 0.0, 0.0, 30.0, 0.0, 0.0, 15.0], "kendradi": [30.0, 30.0, 15.0, 30.0, 15.0, 60.0, 30.0], "drek": [0.0, 15.0, 15.0, 0.0, 0.0, 0.0, 0.0], "sthana": [176.05, 183.91, 167.02, 147.44, 129.38, 189.52, 165.95], "dig": [46.75, 15.0, 48.65, 16.88, 37.65, 0.82, 9.56], "paksha": [58.25, 1.75, 58.25, 58.25, 1.75, 1.75, 58.25], "tri": [0.0, 0.0, 0.0, 0.0, 60.0, 0.0, 60.0], "naisarg": [60.0, 51.42, 17.16, 25.74, 34.26, 42.84, 8.58]}, "meera": {"ochcha": [4.5, 49.28, 14.79, 48.23, 12.98, 5.26, 39.89], "sapta": [112.5, 30.0, 112.5, 129.38, 120.0, 142.5, 84.38], "ojha": [15.0, 0.0, 15.0, 30.0, 15.0, 15.0, 30.0], "kendradi": [60.0, 30.0, 60.0, 30.0, 15.0, 30.0, 60.0], "drek": [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], "sthana": [192.0, 109.28, 202.29, 237.61, 162.98, 192.76, 214.27], "dig": [34.36, 32.91, 39.07, 52.77, 40.85, 31.07, 27.24], "paksha": [1.45, 58.55, 1.45, 58.55, 58.55, 58.55, 1.45], "tri": [0.0, 0.0, 0.0, 60.0, 60.0, 0.0, 0.0], "naisarg": [60.0, 51.42, 17.16, 25.74, 34.26, 42.84, 8.58]}, "anir": {"ochcha": [7.42, 46.98, 22.97, 56.64, 56.6, 5.48, 38.3], "sapta": [82.5, 75.0, 82.5, 95.63, 131.25, 95.63, 88.13], "ojha": [15.0, 15.0, 15.0, 15.0, 0.0, 15.0, 15.0], "kendradi": [30.0, 30.0, 60.0, 30.0, 15.0, 30.0, 30.0], "drek": [0.0, 15.0, 0.0, 0.0, 0.0, 0.0, 0.0], "sthana": [134.92, 181.98, 180.47, 197.27, 202.85, 146.1, 171.43], "dig": [22.7, 20.63, 57.75, 56.71, 46.71, 34.91, 40.01], "paksha": [2.07, 57.93, 2.07, 2.07, 57.93, 57.93, 2.07], "tri": [0.0, 0.0, 60.0, 0.0, 60.0, 0.0, 0.0], "naisarg": [60.0, 51.42, 17.16, 25.74, 34.26, 42.84, 8.58]}};
const PARTS = {
  ochcha: (e) => e.sthana.uchchaBala, sapta: (e) => e.sthana.saptavargajaBala, ojha: (e) => e.sthana.ojhayugmarasyamsaBala, kendradi: (e) => e.sthana.kendradiBala,
  drek: (e) => e.sthana.drekkanaBala, sthana: (e) => e.sthanaBala, dig: (e) => e.digBala, paksha: (e) => e.kaala.pakshaBala, tri: (e) => e.kaala.tribhagaBala,
  naisarg: (e) => e.naisargikaBala,
};
(async () => {
  for (const key of Object.keys(PL9)) {
    const birth = BIRTHS[key];
    await withBirth(birth, ({ chart }) => {
      const longitudes = Object.fromEntries(PL.map((p) => [p, chart.grahas[p].longitude]));
      const r = SB.calculateShadbala({
        longitudes, lagnaRasiIndex: chart.lagna.rasiIndex, ascendant: chart.lagna.longitude, mc: chart.mc, birthJd: chart.julianDay,
        latitude: birth.latitude, longitude: birth.longitude, year: birth.year, month: birth.month, day: birth.day, utcOffsetMinutes: birth.utcOffsetMinutes, reading: 'pl9',
      });
      for (const [name, pick] of Object.entries(PARTS)) {
        PL.forEach((p, i) => {
          const got = Math.round(pick(r.perPlanet[p]) * 100) / 100;
          assert.ok(Math.abs(got - PL9[key][name][i]) < 0.02, `${key} ${p} ${name}: ${got} against PL9 ${PL9[key][name][i]}`);
        });
      }
    });
  }
  console.log('test-shadbala-pl9: all assertions passed');
})().catch((e) => { console.error(e); process.exit(1); });
