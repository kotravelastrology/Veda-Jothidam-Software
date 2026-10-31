const assert = require('assert');
const D = require('./src/dasha/dashaDrill');
const { withBirth } = require('./src/report/horoscopeBook/charts');
const { buildVimshottariDasha } = require('./src/dasha/vimshottariDasha');

// --- the cycle and the division of a period
assert.deepStrictEqual(D.orderFrom('Sun'), ['Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury', 'Ketu', 'Venus']);
assert.throws(() => D.orderFrom('Pluto'), RangeError);
const kids = D.childrenOf({ lord: 'Ketu', startJd: 0, endJd: 120 });
assert.deepStrictEqual(kids.map((k) => k.lord), D.orderFrom('Ketu'));
assert.deepStrictEqual(kids.map((k) => k.endJd - k.startJd), [7, 20, 6, 10, 7, 18, 16, 19, 17], 'a 120-day period gives each lord its years in days');
assert.strictEqual(kids[0].startJd, 0);
assert.ok(Math.abs(kids[8].endJd - 120) < 1e-9, 'the children fill the period');
for (let i = 1; i < kids.length; i += 1) assert.strictEqual(kids[i].startJd, kids[i - 1].endJd, 'contiguous');

// --- the local time text: noon UTC on 2000-01-01 is JD 2451545.0; in IST (+330) it is 17:30
assert.strictEqual(D.localText(2451545.0, 330), '2000-01-01 17:30');
assert.strictEqual(D.localText(2451545.0, 0), '2000-01-01 12:00');
assert.strictEqual(D.localText(2451545.0 + 20 / 86400, 330), '2000-01-01 17:30', '20 seconds past the minute rounds down');
assert.strictEqual(D.localText(2451545.0 + 40 / 86400, 330), '2000-01-01 17:31', '40 seconds past rounds up');
// 18:29:40 UT is 23:59:40 in IST: rounded to the minute it is midnight, and the date moves on with it
assert.strictEqual(D.localText(2451545.0 + (6 * 60 + 29) / 1440 + 40 / 86400, 330), '2000-01-02 00:00', 'the day rolls over');

async function main() {
  // The sample chart (5 October 1990, 04:30 IST, Chennai): the browser's sub-periods equal the engine's down to three levels.
  const birth = {
    year: 1990, month: 10, day: 5, hour: 4, minute: 30, ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330,
    latitude: 13 + 5 / 60, longitude: 80 + 17 / 60, placeName: 'Chennai',
  };
  const tree = await withBirth(birth, ({ chart }) => buildVimshottariDasha(chart.julianDay, chart.grahas.Moon.longitude, 330, { depth: 3 }));
  const mahadashas = tree.dashas.map((m) => ({ lord: m.lord, startJd: m.startJulianDay, endJd: m.endJulianDay }));
  assert.strictEqual(mahadashas.length, 9);
  let compared = 0;
  tree.dashas.forEach((maha, i) => {
    const bhuktis = D.childrenOf(mahadashas[i]);
    maha.Bhukti.forEach((b, j) => {
      assert.strictEqual(bhuktis[j].lord, b.lord);
      assert.strictEqual(D.localText(bhuktis[j].startJd, 330), b.startLocal, `${maha.lord}-${b.lord} start`);
      assert.strictEqual(D.localText(bhuktis[j].endJd, 330), b.endLocal, `${maha.lord}-${b.lord} end`);
      const antaras = D.childrenOf(bhuktis[j]);
      b.Antara.forEach((a, k) => {
        assert.strictEqual(antaras[k].lord, a.lord);
        assert.strictEqual(D.localText(antaras[k].startJd, 330), a.startLocal, `${maha.lord}-${b.lord}-${a.lord} start`);
        compared += 1;
      });
    });
  });
  assert.strictEqual(compared, 729, 'every period of the third level');

  // --- chains: along a path, and at a date (31 October 2026 is in Sun-Rahu, as PL9 lists)
  const jd = 2461345.0; // 2026-10-31 12:00 UT
  assert.strictEqual(D.localText(jd, 0), '2026-10-31 12:00');
  const now = D.chainAt(mahadashas, jd, 3);
  assert.deepStrictEqual(now.slice(0, 2).map((p) => p.lord), ['Sun', 'Rahu']);
  assert.deepStrictEqual(D.chainFromPath(mahadashas, ['Sun', 'Rahu']).map((p) => p.lord), ['Sun', 'Rahu']);
  assert.deepStrictEqual(D.chainFromPath(mahadashas, ['Sun', 'Rahu']).map((p) => p.startJd), now.slice(0, 2).map((p) => p.startJd));
  assert.deepStrictEqual(D.chainFromPath(mahadashas, ['Sun', 'Pluto']).map((p) => p.lord), ['Sun'], 'an unknown lord ends the chain');
  assert.strictEqual(D.chainAt(mahadashas, jd, 9).length, 5, 'never more than five levels');
  // before the birth and after the last period, the nearest mahadasha is used
  assert.strictEqual(D.chainAt(mahadashas, mahadashas[0].startJd - 100, 1)[0].lord, mahadashas[0].lord);
  assert.strictEqual(D.chainAt(mahadashas, mahadashas[8].endJd + 100, 1)[0].lord, mahadashas[8].lord);

  // --- the columns: the nine mahadashas, then the nine of the selected one, one level past the path
  const cols = D.columns(mahadashas, ['Sun', 'Rahu'], 4, jd);
  assert.deepStrictEqual(cols.map((c) => c.level), [1, 2, 3], 'columns stop after the first level without a selection');
  assert.strictEqual(cols[0].periods.length, 9);
  assert.deepStrictEqual(cols[0].periods.filter((p) => p.selected).map((p) => p.lord), ['Sun']);
  assert.deepStrictEqual(cols[0].periods.filter((p) => p.current).map((p) => p.lord), ['Sun']);
  assert.deepStrictEqual(cols[1].periods.filter((p) => p.selected).map((p) => p.lord), ['Rahu']);
  assert.deepStrictEqual(cols[1].periods.filter((p) => p.current).map((p) => p.lord), ['Rahu']);
  assert.deepStrictEqual(cols[1].periods.map((p) => p.lord), D.orderFrom('Sun'));
  assert.strictEqual(cols[2].periods.some((p) => p.selected), false);
  assert.strictEqual(D.columns(mahadashas, [], 5, jd).length, 1);

  console.log('test-dasha-drill: all assertions passed');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
