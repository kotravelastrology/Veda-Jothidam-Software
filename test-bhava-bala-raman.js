const assert = require('assert');
const { bhavaPoints } = require('./src/chart/sripatiBhava');
const { ramanBhavaBala, ramanBhavaDigbala, dayNightBhava } = require('./src/chart/bhavaBalaRaman');

// Raman, Graha and Bhava Balas, Standard Horoscope, Example 59 (PDF pp.97-98): Bhava Bala of houses I-IV. The midpoints are
// the Sripati trisections (Raman prints house II as 311d10', an OCR slip for 331d10', which the trisection gives). The lord's
// strength is Raman's Shadbala Pinda of the lord (Art.133): Sani 389.21, Guru 433.77, Kuja 298.14, Sukra 376.25.
const dms = (d, m, s) => d + m / 60 + s / 3600;
const longitudes = {
  Sun: dms(180, 53, 55), Moon: dms(311, 17, 19), Mars: dms(229, 30, 34), Mercury: dms(181, 31, 34),
  Jupiter: dms(84, 0, 49), Venus: dms(171, 9, 56), Saturn: dms(124, 22, 41),
};
const lagna = dms(298, 27, 0);
const mc = dms(216, 30, 0);
const norm = (d) => ((d % 360) + 360) % 360;
const middles = bhavaPoints(lagna, norm(mc + 180), norm(lagna + 180), mc);

const RAMAN_EXAMPLE_59 = {
  // House IV is the IC (36d30' from the MC); Raman's OCR-read figure is 36.36, which this tolerance allows.
  midpoint: [298 + 27 / 60, 331 + 10 / 60, 3 + 53 / 60, 36.5],
  digbala: [30, 40, 10, 0],
  nettDrishti: [54.18, 36.44, 58.99, 28.10],
  lordPinda: [389.21, 433.77, 298.14, 376.25],
  // House IV: Raman prints 404.15, but his parts (376.25 + 28.10) make 404.35, so the sum is the expected total there.
  total: [473.39, 510.21, 367.13, 404.35],
};

// Raman's lord strengths, keyed by the lord of each of houses I-IV (Saturn, Jupiter, Mars, Venus), and the rest set to zero.
const lordPinda = {
  Sun: 0, Moon: 0, Mars: 298.14, Mercury: 0, Jupiter: 433.77, Venus: 376.25, Saturn: 389.21,
};

function main() {
  for (let i = 0; i < 4; i += 1) {
    assert.ok(Math.abs(middles[i] - RAMAN_EXAMPLE_59.midpoint[i]) < 0.1,
      `house ${i + 1} midpoint ${middles[i].toFixed(2)} vs Raman ${RAMAN_EXAMPLE_59.midpoint[i].toFixed(2)}`);
  }

  const rows = ramanBhavaBala({ middles, longitudes, isWaxingMoon: true, lordPinda, dayPart: 'night' });
  for (let i = 0; i < 4; i += 1) {
    const row = rows[i];
    assert.strictEqual(row.dig, RAMAN_EXAMPLE_59.digbala[i], `house ${i + 1} Digbala`);
    assert.ok(Math.abs(row.drishti - RAMAN_EXAMPLE_59.nettDrishti[i]) < 0.1,
      `house ${i + 1} nett Drishti ${row.drishti.toFixed(2)} vs Raman ${RAMAN_EXAMPLE_59.nettDrishti[i]}`);
    assert.ok(Math.abs(row.raman - RAMAN_EXAMPLE_59.total[i]) < 0.15,
      `house ${i + 1} Bhava Bala ${row.raman.toFixed(2)} vs Raman ${RAMAN_EXAMPLE_59.total[i]}`);
  }

  // Art.131: the Digbala is 60 for the Lagna in a human sign, 0 for the 7th in one, 60 for the 10th in a quadruped sign.
  assert.strictEqual(ramanBhavaDigbala(1, dms(65, 0, 0)), 60, 'Lagna in Mithuna: 60');
  assert.strictEqual(ramanBhavaDigbala(7, dms(65, 0, 0)), 0, '7th in Mithuna: 0');
  assert.strictEqual(ramanBhavaDigbala(10, dms(15, 0, 0)), 60, '10th in Mesha: 60');
  assert.strictEqual(ramanBhavaDigbala(4, dms(15, 0, 0)), 0, '4th in Mesha: 0');
  assert.strictEqual(ramanBhavaDigbala(8, dms(185, 0, 0)), 10, 'Standard 8th in Kanya: 10 (Raman\'s own example)');

  // BPHS v.31: Seershodaya signs by day, Prishtodaya by night, Ubhayodaya (Gemini, Pisces) for twilight.
  assert.strictEqual(dayNightBhava(dms(125, 0, 0), 'day'), 15, 'Leo by day: 15');
  assert.strictEqual(dayNightBhava(dms(125, 0, 0), 'night'), 0, 'Leo by night: 0');
  assert.strictEqual(dayNightBhava(dms(5, 0, 0), 'night'), 15, 'Aries by night: 15');
  assert.strictEqual(dayNightBhava(dms(65, 0, 0), 'twilight'), 15, 'Gemini in twilight: 15');
  assert.strictEqual(dayNightBhava(dms(65, 0, 0), 'day'), 0, 'Gemini by day: 0');

  console.log('test-bhava-bala-raman: all assertions passed');
}

try {
  main();
} catch (e) {
  console.error(e);
  process.exit(1);
}
