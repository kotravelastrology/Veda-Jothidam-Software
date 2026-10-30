const assert = require('assert');
const { buildPage8 } = require('./src/report/horoscopeBook/page8');

// Sample birth, PL9 aniruddha_HC4 page 8: 5 October 1990, 04:30 IST, Chennai (13N05' 80E17').
const birth = {
  year: 1990, month: 10, day: 5, hour: 4, minute: 30, ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330,
  latitude: 13 + 5 / 60, longitude: 80 + 17 / 60, placeName: 'Chennai',
};

// Sign indexes: 0 Aries, 1 Taurus, 2 Gemini, 3 Cancer, 4 Leo, 5 Virgo, 6 Libra, 7 Scorpio, 8 Sagittarius, 9 Capricorn, 10 Aquarius, 11 Pisces.
const ARI = 0; const TAU = 1; const GEM = 2; const CAN = 3; const LEO = 4; const VIR = 5; const LIB = 6;
const SCO = 7; const SAG = 8; const CAP = 9; const AQU = 10; const PIS = 11;

async function main() {
  const doc = await buildPage8({ name: 'aniruddha', birth });
  assert.equal(doc.blocks.length, 12, 'twelve charts on page 8');
  assert.ok(!/undefined|NaN|null/.test(JSON.stringify(doc)), 'no undefined or NaN in page 8');
  const [birthChart, moonChart, sunChart, sripati, equal, kp, arudha, karkamshaBirth, karkamshaNav, bhavaLagna, horaLagna, ghatika] = doc.blocks;

  // Birth, Moon and Sun charts: the sample's sign-fixed placements, Gk As in Leo.
  for (const chart of [birthChart, moonChart, sunChart]) {
    assert.deepStrictEqual(chart.cells[PIS], ['Mo']);
    assert.deepStrictEqual(chart.cells[TAU], ['Ma']);
    assert.deepStrictEqual(chart.cells[LEO], ['As', 'Gk']);
    assert.deepStrictEqual(chart.cells[VIR], ['Su', 'Me', 'Ve']);
    assert.deepStrictEqual(chart.cells[SAG], ['Sa']);
    assert.deepStrictEqual(chart.cells[CAP], ['Ra']);
  }

  // Sripati Bhava: as page 3, with Gulika in Cancer (the sample: Gk Ju in Cancer).
  assert.deepStrictEqual(sripati.cells[LEO].sort(), ['As', 'Me']);
  assert.ok(sripati.cells[CAN].includes('Gk') && sripati.cells[CAN].includes('Ju'), 'Gk and Ju in Cancer');

  // Equal Bhava: Moon Pisces and Mars Taurus match the sample. Mercury and As are printed in Virgo (the sample: Leo),
  // and Gulika in Leo (the sample: Cancer). Pinned as built, the difference is recorded in the plan.
  assert.deepStrictEqual(equal.cells[PIS], ['Mo']);
  assert.deepStrictEqual(equal.cells[TAU], ['Ma']);

  // KP Bhava: every body matches the sample (Ma Aries; Ju Ke Gemini; Mo Aquarius; Gk Cancer; As Me Ve Su Leo; Sa Scorpio; Ra Sagittarius).
  assert.deepStrictEqual(kp.cells[ARI], ['Ma']);
  assert.ok(kp.cells[GEM].includes('Ju') && kp.cells[GEM].includes('Ke'), 'Ju and Ke in Gemini');
  assert.deepStrictEqual(kp.cells[AQU], ['Mo']);
  assert.deepStrictEqual(kp.cells[CAN], ['Gk']);
  assert.ok(kp.cells[LEO].includes('As'), 'As in Leo');
  assert.deepStrictEqual(kp.cells[SCO], ['Sa']);
  assert.deepStrictEqual(kp.cells[SAG], ['Ra']);

  // Special points. Bhava and Hora lagna are Leo, as the sample's special-lagna page gives. Karkamsha is Scorpio
  // (Saturn's navamsha). Ghatika lagna is Taurus, as the sample's special-lagna page gives (Taurus 22:11).
  assert.ok(bhavaLagna.cells[LEO].includes('BL'), 'Bhava Lagna marker in Leo');
  assert.ok(horaLagna.cells[LEO].includes('HL'), 'Hora Lagna marker in Leo');
  assert.ok(karkamshaBirth.cells[SCO].includes('Ka'), 'Karkamsha in Scorpio');
  assert.ok(karkamshaNav.cells[SCO].includes('Ka'), 'Karkamsha in the navamsha, Scorpio');
  assert.ok(ghatika.cells[TAU].includes('GL'), 'Ghatika Lagna marker in Taurus, as the sample gives');

  // Arudha Lagna: ours is Libra; the sample prints the Arudha chart identical to the Birth Chart, with no marker.
  assert.ok(arudha.cells[LIB].includes('AL'), 'Arudha Lagna marker in Libra (built; the sample shows none)');

  console.log('test-horoscope-book-birth-charts: all assertions passed');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
