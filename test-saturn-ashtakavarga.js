const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const A = require('./src/report/saturnAshtakavargaTables');
const S = require('./src/report/saturnAshtakavarga');
const { BINDU_TABLE } = require('./src/chart/ashtakavarga');
const { planetLongitude } = require('./src/ephemeris/siderealPositions');
const { createChartContext } = require('./src/contracts/chartContext');
const { calculateParashariChart } = require('./src/chart/parashariChart');
const { resolveByTitle } = require('./src/sources/registry');

const FIX = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/saturn-transit/ashtakavarga-patel.json'), 'utf8'));
const DAY = 86400000;
const YEAR = 365.25 * DAY;
const lon = ([s, d, m]) => s * 30 + d + m / 60;
const norm = (x) => ((x % 360) + 360) % 360;
const minutesApart = (a, b) => Math.abs(norm(a - b + 180) - 180) * 60;
const plain = (o) => JSON.parse(JSON.stringify(o));
const ms = (iso) => Date.parse(iso);

// ------------------------------------------------ the bindu tables, read twice ---
for (const [contributor, places] of Object.entries(FIX.saturnTable)) {
  if (contributor === 'source') continue;
  assert.deepEqual(plain(BINDU_TABLE.Saturn[contributor]), places, `Saturn's table from ${contributor}: Patel and Vinay Aditya agree`);
}
for (const [target, cells] of Object.entries(FIX.tableDifferences)) {
  if (target === 'source') continue;
  for (const [contributor, { patel, footnote }] of Object.entries(cells)) {
    assert.deepEqual(plain(A.PATEL_BINDU_DIFFERENCES[target][contributor]), patel, `${target} from ${contributor}: Patel's places`);
    assert.deepEqual(plain(BINDU_TABLE[target][contributor]), footnote, `${target} from ${contributor}: Vinay Aditya's are Patel's footnote reading`);
  }
}
assert.deepEqual(Object.keys(A.PATEL_BINDU_DIFFERENCES).sort(), ['Moon', 'Venus'], 'only two cells differ');
assert.ok(!('Saturn' in A.PATEL_BINDU_DIFFERENCES), 'Saturn\'s own table is the same in both books');

// ------------------------------------------------ Patel's standard horoscope ---
{
  const c = FIX.standardHoroscope;
  const longitudes = Object.fromEntries(Object.entries(c.planets).map(([p, v]) => [p, lon(v)]));
  const placed = S.natalPlacements({ lagnaLongitude: lon(c.lagna), mcLongitude: lon(c.mc), longitudes });

  // The bhava table (p.12): cusps and sandhis to the printed minute.
  for (const row of c.bhavaTable) {
    const b = placed.bhavas[row.bhava - 1];
    assert.ok(minutesApart(b.cusp, lon(row.cusp)) <= 0.6, `standard: cusp ${row.bhava}`);
    assert.ok(minutesApart(b.end, lon(row.sandhiAfter)) <= 0.6, `standard: sandhi after bhava ${row.bhava}`);
    const next = placed.bhavas[row.bhava % 12];
    assert.equal(next.start, b.end, 'each bhava starts where the last ends');
  }

  // The Sun's Prastara (p.66): columns are bhavas labelled by rasi from the Lagna's sign.
  const bhavaOfLabel = (label) => ((label - c.rasiLabelOfBhava1 + 12) % 12);
  const sun = S.prastara('Sun', placed.bhava, A.PATEL_BINDU_DIFFERENCES);
  for (const [contributor, labels] of Object.entries(c.sunPrastaraByLabel)) {
    assert.deepEqual(sun.rows[contributor], labels.map(bhavaOfLabel).sort((a, b) => a - b), `Sun's Prastara row ${contributor}`);
  }
  for (const [label, total] of Object.entries(c.sunTotalsByLabel)) {
    assert.equal(sun.bav[bhavaOfLabel(Number(label))], total, `Sun's Prastara total under ${label}`);
  }
  // The bhava method moves the Sun (Leo) into the 4th bhava, labelled Kanya — the reason the columns start at 6.
  assert.equal(placed.sign.Sun, 4);
  assert.equal(placed.bhava.Sun, 3);

  // Saturn's Ashtakavarga by bhava (p.154).
  assert.deepEqual(S.prastara('Saturn', placed.bhava).bav, c.saturnBavByBhava, 'Saturn\'s bindus by bhava');
  assert.deepEqual(S.prastara('Saturn', placed.bhava, A.PATEL_BINDU_DIFFERENCES).bav, c.saturnBavByBhava, 'same under Patel\'s table');

  // The Lagna bhava's bindu Kakshyas in the Sun's Ashtakavarga (p.68).
  const parts = S.kakshyaParts('BHAVA', placed.bhavas).filter((p) => p.unit === 0);
  const lords = A.KAKSHYA_METHODS.PATEL_BHAVA.lords;
  const binduParts = parts.filter((p) => sun.rows[lords[p.kakshya - 1]].includes(0));
  assert.deepEqual(binduParts.map((p) => lords[p.kakshya - 1]), c.lagnaBhavaSunBinduKakshyas.map((k) => k.lord), 'Lagna bhava: which Kakshyas hold the Sun\'s bindus');
  binduParts.forEach((p, i) => {
    const want = c.lagnaBhavaSunBinduKakshyas[i];
    assert.ok(minutesApart(p.fromLon, lon(want.from)) <= 1, `${want.lord}'s Kakshya starts at the printed minute`);
    assert.ok(minutesApart(p.toLon, lon(want.to)) <= 1, `${want.lord}'s Kakshya ends at the printed minute`);
  });
}

// ------------------------------------------------ Edward VII (pp.xxxiii–xxxv) ---
{
  const c = FIX.edwardVII;
  assert.ok(c.cuspPrinted1[1] >= 30, 'the printed 1st cusp has an impossible degree — a print slip');
  assert.ok(minutesApart(lon(c.lagna) + 180, lon(c.cusps[6])) < 0.01, 'the 7th cusp shows what the 1st should be');
  const longitudes = Object.fromEntries(Object.entries(c.planets).map(([p, v]) => [p, lon(v)]));
  const placed = S.natalPlacements({ lagnaLongitude: lon(c.lagna), mcLongitude: lon(c.mc), longitudes });
  placed.bhavas.forEach((b, i) => {
    assert.ok(minutesApart(b.cusp, lon(c.cusps[i])) <= 0.6, `Edward VII cusp ${i + 1}`);
    assert.ok(minutesApart(b.end, lon(c.terminalSandhis[i])) <= 0.6, `Edward VII terminal sandhi ${i + 1}`);
  });

  const patel = S.ashtakavargaWith(placed.bhava, A.PATEL_BINDU_DIFFERENCES);
  for (const [planet, row] of Object.entries(c.bhinnaByBhava)) {
    assert.deepEqual(patel.bhinna[planet], row, `Edward VII ${planet}'s bindus by bhava, Patel's table`);
  }
  assert.deepEqual(patel.sarva, c.samudayaByBhava, 'Edward VII Samudaya by bhava');

  // Vinay Aditya's table moves exactly one bindu in each of the two planets — the cells that differ.
  const va = S.ashtakavargaWith(placed.bhava);
  const moved = (planet) => va.bhinna[planet].map((v, i) => v - c.bhinnaByBhava[planet][i]);
  assert.deepEqual(moved('Moon'), [0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 'Moon: Jupiter (bhava 1) gives the 12th instead of the 2nd');
  assert.deepEqual(moved('Venus'), [0, 0, 0, -1, 1, 0, 0, 0, 0, 0, 0, 0], 'Venus: Mars (bhava 1) gives the 5th instead of the 4th');
  for (const p of ['Sun', 'Mars', 'Mercury', 'Jupiter', 'Saturn']) assert.deepEqual(va.bhinna[p], c.bhinnaByBhava[p], `${p} is the same under either table`);

  // Natal Kakshyas: bhava, Kakshya and bindu/rekha for all seven.
  const lords = A.KAKSHYA_METHODS.PATEL_BHAVA.lords;
  for (const want of c.natalKakshyas) {
    const got = S.bhavaKakshyaOf(longitudes[want.planet], placed.bhavas);
    assert.deepEqual([got.bhava, got.kakshya], [want.bhava, want.kakshya], `${want.planet}'s bhava and Kakshya`);
    const pr = S.prastara(want.planet, placed.bhava, A.PATEL_BINDU_DIFFERENCES);
    const bindu = pr.rows[lords[got.kakshya - 1]].includes(got.bhava - 1);
    assert.equal(bindu ? 'bindu' : 'rekha', want.point, `${want.planet}'s Kakshya holds a ${want.point}`);
  }
}

// ------------------------------------------------ division geometry ---
assert.deepEqual(S.signKakshyaOf(0), { rasi: 0, kakshya: 1 });
assert.deepEqual(S.signKakshyaOf(3.75), { rasi: 0, kakshya: 2 });
assert.deepEqual(S.signKakshyaOf(59.999), { rasi: 1, kakshya: 8 });
for (const division of ['SIGN', 'BHAVA']) {
  const bh = S.sripatiBhavas(52.546, 314.922);
  const parts = S.kakshyaParts(division, bh);
  assert.equal(parts.length, 96, `${division}: 96 parts`);
  let total = 0;
  parts.forEach((p, i) => {
    const next = parts[(i + 1) % 96];
    assert.ok(minutesApart(p.toLon, next.fromLon) < 1e-6, `${division}: part ${i} meets the next`);
    total += norm(p.toLon - p.fromLon);
  });
  assert.ok(Math.abs(total - 360) < 1e-6, `${division}: parts cover the circle once`);
}
assert.deepEqual(S.rasisOfRange(28, 31), [0, 1]);
assert.deepEqual(S.rasisOfRange(355, 2), [11, 0]);
assert.deepEqual(S.rasisOfRange(30, 33.75), [1]);

// ------------------------------------------------ book order by measured words ---
{
  const w = A.KAKSHYA_RANK.words;
  assert.equal(A.KAKSHYA_RANK.order[0], 'PATEL_BHAVA');
  assert.ok(w.PATEL > w.PARASHARAS_LIGHT + w.VISHNU_BHASKAR + w.VINAY_ADITYA, 'Patel alone outweighs the three sign-method books');
  assert.equal(A.DEFAULT_KAKSHYA_METHOD, A.KAKSHYA_RANK.order[0], 'the default is the most-explained');
  assert.deepEqual(A.KAKSHYA_READINGS.map((r) => r.book), ['PATEL', 'PARASHARAS_LIGHT', 'VISHNU_BHASKAR', 'VINAY_ADITYA']);
  const hw = A.HOUSE_READING_RANK.words;
  assert.deepEqual([...A.HOUSE_READING_RANK.order], Object.keys(hw).sort((a, b) => hw[b] - hw[a]), 'house readings in word order');
}

// ------------------------------------------------ every citation is registered ---
const cites = [];
const walk = (o) => {
  if (!o || typeof o !== 'object') return;
  if (typeof o.pageLocus === 'string') cites.push(o);
  for (const v of Object.values(o)) walk(v);
};
walk(A);
assert.ok(cites.length >= 25, 'the tables cite their pages');
for (const c of cites) assert.ok(resolveByTitle(c.title), `registered: ${c.title}`);

// ------------------------------------------------ a real chart through the engine ---
{
  const ctx = createChartContext({
    year: 1990, month: 5, day: 15, hour: 7, minute: 30, ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330,
    latitude: 11.34, longitude: 77.72, placeName: 'Erode', calendarMode: 'tirukanita',
  });
  const chart = calculateParashariChart(ctx);
  const longitudes = Object.fromEntries(['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].map((p) => [p, chart.grahas[p].longitude]));
  const fromMs = Date.UTC(2024, 0, 1);
  const toMs = Date.UTC(2036, 0, 1);
  const atMs = Date.UTC(2026, 9, 6);
  const t0 = Date.now();
  const r = S.saturnAshtakavarga({
    natal: { lagnaLongitude: chart.lagna.longitude, mcLongitude: chart.mc, longitudes },
    moonRasiIndex: chart.grahas.Moon.rasiIndex,
    moonNakshatraIndex: Math.floor(chart.grahas.Moon.longitude / (360 / 27)),
    moonLongitude: chart.grahas.Moon.longitude,
    rahuDashas: [{ fromMs: Date.UTC(2030, 0, 1), toMs: Date.UTC(2048, 0, 1) }],
    fromMs, toMs, atMs, ayanamsha: 'Lahiri',
  });
  const elapsed = Date.now() - t0;
  const sat = (t) => norm(planetLongitude(t / DAY + 2440587.5, 'Saturn', 'Lahiri'));
  const sun = (t) => norm(planetLongitude(t / DAY + 2440587.5, 'Sun', 'Lahiri'));
  const inside = (x, a, b) => norm(x - a) < norm(b - a);

  // The chart's own Porphyry cusps are the Sripati cusps.
  r.bhavas.forEach((b) => assert.ok(minutesApart(b.cusp, chart.cusps[b.number]) < 1e-3, `cusp ${b.number} agrees with the chart`));

  for (const id of A.KAKSHYA_RANK.order) {
    const m = r.kakshya.methods[id];
    assert.equal(m.windows.filter((w) => w.current).length, 1, `${id}: exactly one current Kakshya`);
    assert.equal(ms(m.windows[0].fromUtc), fromMs);
    assert.equal(ms(m.windows.at(-1).toUtc), toMs);
    const pr = r.prastara[m.division === 'SIGN' ? 'sign' : 'bhava'];
    m.windows.forEach((w, i) => {
      if (i > 0) assert.equal(w.fromUtc, m.windows[i - 1].toUtc, `${id}: windows are contiguous`);
      const mid = (ms(w.fromUtc) + ms(w.toUtc)) / 2;
      assert.ok(inside(sat(mid), w.fromLon, w.toLon), `${id}: Saturn is inside window ${i}'s part at its middle`);
      assert.equal(w.lord, m.lords[w.kakshya - 1]);
      assert.equal(w.bindu, pr.rows[w.lord].includes(w.unit), `${id}: bindu flag follows the Prastara`);
      if (!w.openStart) {
        const t = ms(w.fromUtc);
        assert.ok(!inside(sat(t - 2 * 60000), w.fromLon, w.toLon) || !inside(sat(t + 2 * 60000), m.windows[i - 1].fromLon, m.windows[i - 1].toLon), `${id}: boundary ${i} is a real crossing`);
      }
    });
  }
  // The two sign methods cut at the same instants; only the lords differ.
  assert.deepEqual(r.kakshya.methods.SIGN.windows.map((w) => w.fromUtc), r.kakshya.methods.SIGN_ALTERNATE_ORDER.windows.map((w) => w.fromUtc));

  // Retrogression, stations, combustion, nakshatras, navamshas.
  const speed = (t) => norm(sat(t + DAY / 4) - sat(t - DAY / 4) + 180) - 180;
  for (const w of r.watch.retrograde) assert.ok(speed((ms(w.fromUtc) + ms(w.toUtc)) / 2) < 0, 'retrograde at the middle of a retrograde spell');
  assert.ok(r.watch.retrograde.length >= 11, 'Saturn turns retrograde about once a year');
  assert.equal(r.watch.stations.length, r.watch.retrograde.length * 2 - (r.watch.retrograde[0].openStart ? 1 : 0) - (r.watch.retrograde.at(-1).openEnd ? 1 : 0), 'two stations per closed retrograde spell');
  const elong = (t) => Math.abs(norm(sat(t) - sun(t) + 180) - 180);
  for (const w of r.watch.combust) {
    assert.ok(elong((ms(w.fromUtc) + ms(w.toUtc)) / 2) < 15, 'combust at the middle of a combust spell');
    if (!w.openStart) assert.ok(elong(ms(w.fromUtc) - DAY) >= 15, 'not combust a day before');
    if (!w.openEnd) assert.ok(elong(ms(w.toUtc) + DAY) >= 15, 'not combust a day after');
    assert.ok(w.days > 15 && w.days < 45, `a combust spell lasts weeks (${w.days} d)`);
  }
  assert.ok(r.watch.combust.length >= 11, 'Saturn is combust about once a year');
  for (const n of r.watch.nakshatras) {
    const mid = (ms(n.fromUtc) + ms(n.toUtc)) / 2;
    assert.equal(Math.floor(sat(mid) / (360 / 27)), n.nakshatraIndex);
    assert.equal(n.tara, ((n.count - 1) % 9) + 1);
  }
  for (const n of r.watch.navamshas) {
    const mid = (ms(n.fromUtc) + ms(n.toUtc)) / 2;
    assert.equal(Math.floor(sat(mid) / (30 / 9)) % 108, n.navamshaIndex);
  }
  const moonNav = Math.floor(chart.grahas.Moon.longitude / (30 / 9)) % 12;
  assert.equal(r.watch.moonNavamsha.rasiIndex, moonNav);

  // House readings line up with the Prastara.
  const hr = r.houseReadings;
  hr.VINAY_ADITYA.rows.forEach((row) => assert.equal(row.bav, r.prastara.sign.bav[row.rasiIndex]));
  assert.deepEqual(hr.PATEL.rows.map((x) => x.bav), r.prastara.bhava.bav);
  // The computed rows must survive being merged with the book's text objects.
  assert.equal(hr.VISHNU_BHASKAR.sadeSatiRows.length, 3);
  assert.equal(typeof hr.VISHNU_BHASKAR.sadeSati.savTa, 'string');
  for (const block of ['VINAY_ADITYA', 'PATEL']) assert.equal(hr[block].rows.length, 12, `${block} rows kept`);
  assert.equal(r.prastara.sign.bav.reduce((a, b) => a + b, 0), 39);
  assert.equal(r.prastara.bhava.bav.reduce((a, b) => a + b, 0), 39);
  assert.equal(r.sav.sign.reduce((a, b) => a + b, 0), 337);
  assert.equal(r.sav.bhava.reduce((a, b) => a + b, 0), 337);
  console.log(`  engine: ${r.kakshya.methods.PATEL_BHAVA.windows.length} bhava Kakshya windows, ${r.kakshya.methods.SIGN.windows.length} sign windows, `
    + `${r.watch.retrograde.length} retrograde spells, ${r.watch.combust.length} combust spells over 12 years in ${elapsed} ms`);
}

console.log('test-saturn-ashtakavarga: all checks passed');
