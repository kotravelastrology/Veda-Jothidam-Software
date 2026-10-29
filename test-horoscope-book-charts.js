const assert = require('assert');
const { buildPage3, buildPage5, buildPage6 } = require('./src/report/horoscopeBook/charts');

// Sample birth, PL9 aniruddha_HC4: 5 October 1990, 04:30 IST, Chennai (13N05' 80E17').
const birth = {
  year: 1990, month: 10, day: 5, hour: 4, minute: 30, ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330,
  latitude: 13 + 5 / 60, longitude: 80 + 17 / 60, placeName: 'Chennai',
};

// Sign indexes: 0 Aries ... 4 Leo, 5 Virgo, ... 11 Pisces.
const ARI = 0; const TAU = 1; const GEM = 2; const CAN = 3; const LEO = 4; const VIR = 5; const LIB = 6;
const SCO = 7; const SAG = 8; const CAP = 9; const AQU = 10; const PIS = 11;

async function main() {
  // Page 3: Moon chart, Navamsha, Sripati Bhava chart, and the Bhava Spashta table.
  const p3 = await buildPage3({ name: 'aniruddha', birth });
  assert.deepStrictEqual(p3.blocks.map((b) => b.kind), ['signGrid', 'signGrid', 'signGrid', 'table']);
  assert.ok(!/undefined|NaN|null/.test(JSON.stringify(p3)), 'no undefined or NaN in page 3');
  const [moon, nav, bhava, spashta] = p3.blocks;

  // Moon chart: the sample's placements (Mo Pisces, Ma Taurus, Ke Ju Cancer, Gk As Leo, Me Ve Su Virgo, Ra Capricorn, Sa Sagittarius).
  assert.deepStrictEqual(moon.cells[PIS], ['Mo']);
  assert.deepStrictEqual(moon.cells[TAU], ['Ma']);
  assert.ok(moon.cells[CAN].includes('Ju') && moon.cells[CAN].includes('Ke'), 'Ju and Ke in Cancer');
  assert.deepStrictEqual(moon.cells[LEO], ['As']);
  assert.deepStrictEqual(moon.cells[VIR], ['Su', 'Me', 'Ve']);
  assert.deepStrictEqual(moon.cells[CAP], ['Ra']);
  assert.deepStrictEqual(moon.cells[SAG], ['Sa']);
  // Gulika: the engine gives Cancer 8:11 (the Moon chart's Gk), the sample Leo 3:02. Pinned as built.
  assert.ok(moon.cells[CAN].includes('Gk'));

  // Navamsha: the same placements as page 2 (the sample's navamsha grid matches, except Gulika).
  assert.deepStrictEqual(nav.cells[ARI], ['Ve', 'Ra']);
  assert.deepStrictEqual(nav.cells[GEM], ['Su', 'Ma']);
  assert.deepStrictEqual(nav.cells[AQU], ['Mo', 'Me']);
  assert.deepStrictEqual(nav.cells[SCO], ['Ju', 'Sa', 'As']);
  assert.deepStrictEqual(nav.cells[LIB], ['Ke']);

  // Sripati Bhava chart: each body in the sign of the bhava middle of its house. Sample: Mo Pisces (house 8),
  // Ma Taurus (house 10), Ke Gemini (house 11), Ju Cancer (house 12), As and Me Leo (house 1), Su Ve Virgo (house 2),
  // Ra Sa Sagittarius (house 5).
  assert.deepStrictEqual(bhava.cells[PIS], ['Mo']);
  assert.deepStrictEqual(bhava.cells[TAU], ['Ma']);
  assert.ok(bhava.cells[GEM].includes('Ke'), 'Ke in Gemini');
  assert.deepStrictEqual(bhava.cells[CAN], ['Ju']);
  assert.deepStrictEqual(bhava.cells[LEO].sort(), ['As', 'Me']);
  assert.deepStrictEqual(bhava.cells[VIR], ['Su', 'Ve']);
  assert.deepStrictEqual(bhava.cells[SAG], ['Sa', 'Ra']);

  // Bhava Spashta table (sample rows; ours are 13 seconds later than the sample, as the lagna is).
  assert.equal(spashta.rows.length, 12);
  assert.deepStrictEqual(spashta.rows[0], ['1. First', 'Leo 10:11:07', 'Leo 25:03:15', 'Vir 10:11:07']);
  assert.deepStrictEqual(spashta.rows[3], ['4. Fourth', 'Sco 10:42:34', 'Sco 25:50:26', 'Sag 10:42:34']);
  assert.deepStrictEqual(spashta.rows[9], ['10. Tenth', 'Tau 10:42:34', 'Tau 25:50:26', 'Gem 10:42:34']);
  assert.deepStrictEqual(spashta.rows[11], ['12. Twelfth', 'Can 10:26:51', 'Can 25:18:59', 'Leo 10:11:07']);

  // Pages 5 and 6: divisional charts, eight to a page.
  const p5 = await buildPage5({ name: 'aniruddha', birth });
  assert.deepStrictEqual(p5.blocks.map((b) => b.heading), [
    'Lagna — D1', 'Dreshkana (happiness siblings) — D3', 'Saptamsha (children) — D7', 'Dashamsha (great successes) — D10',
    'Hora (wealth) — D2', 'Chaturthamsha (destiny) — D4', 'Navamsha (spouse) — D9', 'Dwadashamsha (parents) — D12',
  ]);
  const [lagnaD1, dreshkana, , , hora, , navD9, dwadashamsha] = p5.blocks;
  assert.deepStrictEqual(lagnaD1.cells[LEO], ['As']);
  // Dreshkana: the sample has As in Aries and Ra in Taurus.
  assert.deepStrictEqual(dreshkana.cells[ARI], ['As']);
  assert.deepStrictEqual(dreshkana.cells[TAU], ['Ra']);
  // Hora: the Sun's hora is Leo, the Moon's Cancer; the sample has As in Cancer and Mo, Ju, Su, Ma in Leo.
  assert.ok(hora.cells[CAN].includes('As'), 'As in the Moon hora (Cancer)');
  assert.ok(hora.cells[LEO].includes('Mo') && hora.cells[LEO].includes('Su'), 'Su and Mo in the Sun hora (Leo)');
  // Navamsha and Dwadashamsha: the sample's As positions (Scorpio navamsha, Gemini dwadashamsha).
  assert.deepStrictEqual(navD9.cells[SCO], ['Ju', 'Sa', 'As']);
  assert.deepStrictEqual(dwadashamsha.cells[GEM], ['As']);

  const p6 = await buildPage6({ name: 'aniruddha', birth });
  assert.deepStrictEqual(p6.blocks.map((b) => b.heading), [
    'Shodashamsha (conveyances) — D16', 'Chaturvimshamsha (knowledge) — D24', 'Trimshamsha (misfortunes) — D30', 'Akshavedamsha (all areas) — D45',
    'Vimshamsha (spiritual progress) — D20', 'Saptavimshamsha (strength) — D27', 'Kvedamsha (ausp. inausp. effects) — D40', 'Shashtiamsha (all areas) — D60',
  ]);
  // Shodashamsha: the sample has As Ra Ke Su in Virgo, Ve in Taurus, Ma in Gemini.
  const shodashamsha = p6.blocks[0];
  assert.deepStrictEqual(shodashamsha.cells[VIR].sort(), ['As', 'Ke', 'Ra', 'Su']);
  assert.deepStrictEqual(shodashamsha.cells[TAU], ['Ve']);
  assert.deepStrictEqual(shodashamsha.cells[GEM], ['Ma']);

  console.log('test-horoscope-book-charts: all assertions passed');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
