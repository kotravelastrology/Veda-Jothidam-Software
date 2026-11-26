const assert = require('assert');
const { buildPage18 } = require('./src/report/horoscopeBook/divisionalAshtakavargaPage');

// Sample birth, PL9 aniruddha_HC4 page 18: 5 October 1990, 04:30 IST, Chennai (13N05' 80E17').
const birth = {
  year: 1990, month: 10, day: 5, hour: 4, minute: 30, ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330,
  latitude: 13 + 5 / 60, longitude: 80 + 17 / 60, placeName: 'Chennai',
};

// PL9 page 18, transcribed from the sample's text layer (cell positions). Samudaya: bindus by sign, sign 1 to 12.
// Labels: the planets and the Ascendant in each sign, without Gulika (Gk), which differs in two charts (see the module note).
const PL9 = {
  'Birth chart': {
    samudaya: [25, 37, 34, 32, 27, 21, 25, 26, 24, 33, 29, 24],
    labels: [[], ['Ma'], [], ['Ju', 'Ke'], ['As'], ['Me', 'Su', 'Ve'], [], [], ['Sa'], ['Ra'], [], ['Mo']],
  },
  'Hora (wealth)': {
    samudaya: [29, 44, 36, 22, 20, 29, 26, 27, 29, 22, 23, 30],
    labels: [[], [], [], ['As', 'Ke', 'Me', 'Ra', 'Sa', 'Ve'], ['Ju', 'Ma', 'Mo', 'Su'], [], [], [], [], [], [], []],
  },
  'Dreshkana (happiness, siblings)': {
    samudaya: [30, 26, 35, 30, 25, 36, 24, 31, 21, 29, 29, 21],
    labels: [['As'], ['Ra'], [], [], ['Sa'], ['Ma', 'Me'], [], ['Ju', 'Ke', 'Mo'], [], ['Su', 'Ve'], [], []],
  },
  'Saptamsha (children)': {
    samudaya: [29, 21, 25, 23, 26, 29, 25, 27, 31, 34, 33, 34],
    labels: [['Ju', 'Me'], ['Sa', 'Ve'], [], ['Su'], [], ['Ra'], [], [], [], ['As'], ['Mo'], ['Ke', 'Ma']],
  },
  'Navamsha (spouse)': {
    samudaya: [39, 17, 28, 30, 27, 35, 20, 27, 32, 26, 29, 27],
    labels: [['Ra', 'Ve'], [], ['Ma', 'Su'], [], [], [], ['Ke'], ['As', 'Ju', 'Sa'], [], [], ['Me', 'Mo'], []],
  },
  'Dashamsha (great successes)': {
    samudaya: [39, 30, 34, 26, 31, 21, 24, 28, 22, 28, 27, 27],
    labels: [['As'], [], ['Ke', 'Me', 'Mo'], ['Ma'], ['Ju', 'Sa', 'Ve'], [], ['Su'], [], ['Ra'], [], [], []],
  },
  'Dwadashamsha (parents)': {
    samudaya: [24, 25, 31, 25, 33, 27, 33, 30, 26, 25, 31, 27],
    labels: [['Su'], ['Ra'], ['As'], [], [], [], ['Me', 'Sa'], ['Ke'], ['Ma', 'Mo'], ['Ju', 'Ve'], [], []],
  },
  'Shodashamsha (conveyances)': {
    samudaya: [31, 24, 31, 37, 18, 29, 36, 29, 27, 22, 27, 26],
    labels: [[], ['Ve'], ['Ma'], [], [], ['As', 'Ke', 'Ra', 'Su'], [], [], ['Ju', 'Mo'], ['Sa'], ['Me'], []],
  },
  'Trimshamsha (misfortunes)': {
    samudaya: [21, 22, 24, 31, 30, 22, 33, 25, 30, 41, 26, 32],
    labels: [[], ['Me'], [], [], [], ['Ke', 'Ra', 'Ve'], ['As', 'Sa'], [], [], ['Mo'], [], ['Ju', 'Ma', 'Su']],
  },
  'Shashtiamsha (all areas)': {
    samudaya: [34, 29, 26, 26, 32, 20, 32, 33, 30, 21, 25, 29],
    labels: [[], [], ['Me', 'Ve'], ['Ma'], ['Su'], ['Ra'], ['As'], [], [], ['Ju'], ['Mo', 'Sa'], ['Ke']],
  },
};
const CHARTS = Object.keys(PL9);

async function main() {
  const page = await buildPage18({ name: 'aniruddha', birth });
  assert.ok(!/undefined|NaN|null/.test(JSON.stringify(page)), 'no undefined, NaN or null on page 18');
  assert.strictEqual(page.blocks.length, 20, 'a chart and a Samudaya grid for each of the ten divisional charts');
  assert.deepStrictEqual(page.blocks.map((b) => b.kind), Array(20).fill('signGrid'));

  CHARTS.forEach((title, i) => {
    const chart = page.blocks[2 * i];
    const samudaya = page.blocks[2 * i + 1];
    const expected = PL9[title];

    assert.strictEqual(chart.heading, title, `${title} heading`);
    assert.strictEqual(samudaya.heading, `${title} — Samudaya Ashtakavarga`, `${title} Samudaya heading`);

    // The Samudaya bindus by sign, cell for cell as PL9 prints them.
    assert.deepStrictEqual(samudaya.cells.map((c) => Number(c[0])), expected.samudaya, `${title} Samudaya`);

    // The planets in each varga sign, without Gulika (sorted, as the sample's order differs).
    expected.labels.forEach((want, s) => {
      const got = chart.cells[s].filter((l) => l !== 'Gk').sort();
      assert.deepStrictEqual(got, [...want].sort(), `${title} sign ${s + 1} planets`);
    });
  });

  console.log('test-horoscope-book-divisional-ashtakavarga-page: all assertions passed');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
