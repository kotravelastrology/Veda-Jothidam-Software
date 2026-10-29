const assert = require('assert');
const { buildPage11 } = require('./src/report/horoscopeBook/shadbalaPage');

// Sample birth, PL9 aniruddha_HC4 page 11: 5 October 1990, 04:30 IST, Chennai (13N05' 80E17').
const birth = {
  year: 1990, month: 10, day: 5, hour: 4, minute: 30, ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330,
  latitude: 13 + 5 / 60, longitude: 80 + 17 / 60, placeName: 'Chennai',
};
const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const NOT_BUILT = 'கட்டப்படவில்லை';

async function main() {
  const page = await buildPage11({ name: 'aniruddha', birth });
  assert.ok(!/undefined|NaN|null/.test(JSON.stringify(page)), 'no undefined or NaN on page 11');
  assert.deepStrictEqual(page.blocks.map((b) => b.heading), ['Shad Bala', 'Bhava Bala']);

  const table = page.blocks[0];
  const row = (label) => {
    const r = table.rows.find((x) => x[0] === label);
    assert.ok(r, `${label} row exists`);
    return r.slice(1).map(Number);
  };

  // Rows that match PL9's printed page exactly (to the paisa): Ochcha, Dig, and the Lagna-independent Kaala parts.
  assert.deepStrictEqual(row('Ochcha Bala'), [7.42, 46.98, 22.97, 56.64, 56.60, 5.48, 38.30]);
  assert.deepStrictEqual(row('2. Dig Bala'), [22.70, 20.63, 57.75, 56.71, 46.71, 34.91, 40.01]);
  assert.deepStrictEqual(row('Varsha Bala'), [0, 15, 0, 0, 0, 0, 0], 'Chandra is the lord of the year');
  assert.deepStrictEqual(row('Maasa Bala'), [0, 0, 0, 0, 0, 30, 0], 'Shukra is the lord of the month');
  assert.deepStrictEqual(row('Vaara Bala'), [0, 0, 0, 0, 45, 0, 0], 'Guru is the lord of the day');
  assert.deepStrictEqual(row('Hora Bala'), [0, 0, 60, 0, 0, 0, 0], 'Kuja is the lord of the hour');
  assert.deepStrictEqual(row('Tri-Bhaga Bala'), [0, 0, 60, 0, 60, 0, 0], 'Kuja and Guru get Tribhaga (PL9 agrees)');

  // Naisargika (PL9 60, 51.42, 17.16, 25.74, 34.26, 42.84, 8.58): our rank constants give 0.03 off at most.
  const naisargika = row('5. Naisargika Bala');
  [60, 51.42, 17.16, 25.74, 34.26, 42.84, 8.58].forEach((v, i) => {
    assert.ok(Math.abs(naisargika[i] - v) < 0.035, `${PLANETS[i]} Naisargika ${naisargika[i]} vs PL9 ${v}`);
  });

  // The minimum Pinda is BPHS v.32-33, and PL9 prints the same numbers.
  assert.deepStrictEqual(row('Minimum requirements'), [390, 360, 300, 420, 390, 330, 300]);

  // The parts sum to their headings (an internal check on the table, not on PL9).
  const sum = (labels) => PLANETS.map((_, i) => labels.reduce((s, l) => s + row(l)[i], 0));
  const sthanaParts = ['Ochcha Bala', 'Sapta-vargaja Bala', 'Ojhayugma Bala', 'Kendradi Bala', 'Drekkana Bala'];
  const kaalaParts = ['Nata-Unnata Bala', 'Paksha Bala', 'Tri-Bhaga Bala', 'Varsha Bala', 'Maasa Bala', 'Vaara Bala', 'Hora Bala',
    'Ayana Bala', 'Yuddha Bala'];
  sum(sthanaParts).forEach((v, i) => assert.ok(Math.abs(v - row('1. Sthana Bala')[i]) < 0.01, `${PLANETS[i]} Sthana parts sum`));
  sum(kaalaParts).forEach((v, i) => assert.ok(Math.abs(v - row('3. Kaala Bala')[i]) < 0.01, `${PLANETS[i]} Kaala parts sum`));

  // Not built: the total, the rupas, the Drik minimum, the rank and the Phala rows.
  for (const label of ['Total Shadbala', 'Shadbala in Rupas', 'Drik Bala % of required', 'Relative Rank', 'Ishta Phala', 'Kashta Phala']) {
    const r = table.rows.find((x) => x[0] === label);
    assert.ok(r && r.slice(1).every((v) => v === NOT_BUILT), `${label} is not built`);
  }

  // Bhava Bala (PL9 sample, page 11): Planets in (BPHS v.30) and Day-Night (BPHS v.31) match PL9 exactly on this night birth.
  // Digbala (Raman Art.131) is within one unit of PL9 for every house but XII (ours 20, PL9 10), whose Cancer base gives 20 by
  // Raman's rule. Drishti and From Lord are Raman's readings and are not asserted against PL9's own.
  const bhava = page.blocks[1];
  const bhavaRow = (label) => {
    const r = bhava.rows.find((x) => x[0] === label);
    assert.ok(r, `${label} bhava row exists`);
    return r.slice(1).map(Number);
  };
  assert.deepStrictEqual(bhavaRow('Planets in'), [0, 0, 0, 0, -60, 0, 0, 0, 0, -60, 0, 60]);
  assert.deepStrictEqual(bhavaRow('Day-Night'), [0, 0, 0, 0, 15, 15, 0, 0, 15, 15, 0, 15]);
  const pl9Dig = [30, 49, 39, 30, 9, 40, 0, 20, 49, 59, 40, 10];
  bhavaRow('Dig Bala').forEach((v, i) => {
    if (i === 11) return;
    assert.ok(Math.abs(v - pl9Dig[i]) <= 1, `house ${i + 1} Digbala ${v} vs PL9 ${pl9Dig[i]}`);
  });
  assert.deepStrictEqual(bhavaRow('Rashi').length, 12);
  for (const label of ['From Lord', 'Drishti', 'Bhava Bala Total']) {
    assert.ok(bhavaRow(label).every((v) => Number.isFinite(v)), `${label} is finite`);
  }
  const total = bhavaRow('Bhava Bala Total');
  const parts = ['From Lord', 'Dig Bala', 'Drishti', 'Planets in', 'Day-Night'].map(bhavaRow);
  total.forEach((t, i) => assert.ok(Math.abs(t - (parts[0][i] + parts[1][i] + parts[2][i] + parts[3][i] + parts[4][i])) <= 1,
    `house ${i + 1} total is the sum of its parts`));

  // Component "% of required" uses BPHS v.34-36's group minimums: Sun's Sthana 134.92 would read 0.82 against 165 in PL9;
  // our Sun Sthana (140.42, with our Saptavargaja) reads 0.85. Assert the arithmetic, not PL9's figure.
  const sthanaOf = row('1. Sthana Bala');
  const sthanaRequired = row('Sthana Bala % of required');
  assert.ok(Math.abs(sthanaRequired[0] - sthanaOf[0] / 165) < 0.006, 'Sun Sthana % of required = Sthana / 165');
  assert.ok(Math.abs(row('Dig Bala % of required')[0] - 22.70 / 35) < 0.006, 'Sun Dig % of required = 22.70 / 35');
  assert.ok(Math.abs(row('Kaala Bala % of required')[0] - row('3. Kaala Bala')[0] / 50) < 0.006,
    'Sun Kaala % of required uses the Kaala minimum 50 (BPHS v.34-36)');
  assert.ok(Math.abs(row('Chesta Bala % of required')[0] - row('4. Chesta Bala')[0] / 112) < 0.006,
    'Sun Chesta % of required uses the Chesta minimum 112 (BPHS v.34-36)');

  console.log('test-horoscope-book-shadbala-page: all assertions passed');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
