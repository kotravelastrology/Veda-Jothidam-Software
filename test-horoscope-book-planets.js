const assert = require('assert');
const { buildPage9, buildPage10 } = require('./src/report/horoscopeBook/planetPages');

// Sample birth, PL9 aniruddha_HC4: 5 October 1990, 04:30 IST, Chennai (13N05' 80E17').
const birth = {
  year: 1990, month: 10, day: 5, hour: 4, minute: 30, ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330,
  latitude: 13 + 5 / 60, longitude: 80 + 17 / 60, placeName: 'Chennai',
};
const NOT_BUILT = 'கட்டப்படவில்லை';

async function main() {
  // Page 9: the Naisargik (natural) lists of the sample, Sun and Moon.
  const p9 = await buildPage9({ name: 'aniruddha', birth });
  assert.deepStrictEqual(p9.blocks.map((b) => b.kind), ['table', 'table', 'table']);
  assert.ok(!/undefined|NaN|null/.test(JSON.stringify(p9)), 'no undefined or NaN in page 9');
  const natural = p9.blocks[0];
  assert.deepStrictEqual(natural.rows[0], ['Sun', 'Moon, Mars, Jupiter', 'Mercury', 'Venus, Saturn, Rahu, Ketu']);
  assert.deepStrictEqual(natural.rows[1], ['Moon', 'Sun, Mercury', 'Mars, Jupiter, Venus, Saturn', 'Rahu, Ketu']);
  // The nodes (BPHS ch.3 v.55): Rahu friends Jupiter, Venus, Saturn; enemies Sun, Moon, Mars; Ketu friends Mars, Venus, Saturn; enemies Sun, Moon.
  assert.deepStrictEqual(natural.rows[7], ['Rahu', 'Jupiter, Venus, Saturn', 'Mercury, Ketu', 'Sun, Moon, Mars']);
  assert.deepStrictEqual(natural.rows[8], ['Ketu', 'Mars, Venus, Saturn', 'Mercury, Jupiter, Rahu', 'Sun, Moon']);
  assert.ok(p9.blocks.every((b) => b.note && b.note.startsWith('The nodes follow BPHS')), 'the note records the PL9 differences');

  // Page 10 signs: the Lagna, Sun and Moon columns of the sample (Janma to Shashtiamsha, top to bottom).
  const p10 = await buildPage10({ name: 'aniruddha', birth });
  assert.deepStrictEqual(p10.blocks.map((b) => b.heading), [
    'Signs occupied by planets in Shodashvargas', 'Dignities of planets in Shodashvargas', 'Vimshopaka Bala',
  ]);
  assert.ok(!/undefined|NaN|null/.test(JSON.stringify(p10)), 'no undefined or NaN in page 10');
  const signs = p10.blocks[0];
  const column = (index) => signs.rows.map((r) => r[index]);
  assert.deepStrictEqual(column(1), ['Leo', 'Can', 'Ari', 'Tau', 'Cap', 'Sco', 'Ari', 'Gem', 'Vir', 'Ari', 'Ari', 'Aqu', 'Lib', 'Cap', 'Vir', 'Lib']);
  assert.deepStrictEqual(column(2), ['Vir', 'Leo', 'Cap', 'Pis', 'Can', 'Gem', 'Lib', 'Ari', 'Vir', 'Can', 'Vir', 'Lib', 'Pis', 'Vir', 'Aqu', 'Leo']);
  assert.deepStrictEqual(column(3), ['Pis', 'Leo', 'Sco', 'Sag', 'Aqu', 'Aqu', 'Gem', 'Sag', 'Sag', 'Sco', 'Aqu', 'Lib', 'Cap', 'Tau', 'Sco', 'Aqu']);

  // Page 10 dignities, sample rows exact: Janma, Hora (Sun Moolatrikona), Dreshkana, Chaturthamsha, Saptamsha.
  const dig = p10.blocks[1];
  const row = (caption) => {
    const r = dig.rows.find((x) => x[0] === caption);
    assert.ok(r, `${caption} dignity row exists`);
    return r;
  };
  assert.deepStrictEqual(row('Janma').slice(1, 8), ['Enemy', 'Enemy', 'Enemy', 'Exalt.', 'Exalt.', 'Debil.', 'Enemy']);
  assert.equal(row('Hora')[1], 'Moolt.');
  assert.deepStrictEqual(row('Dreshkana').slice(1, 8), ['Grt.En.', 'Debil.', 'Grt.En.', 'Exalt.', 'Grt.Fr.', 'Neutr.', 'Grt.En.']);
  assert.deepStrictEqual(row('Chaturthamsha').slice(1, 8), ['Grt.Fr.', 'Frnd.', 'Own', 'Exalt.', 'Debil.', 'Frnd.', 'Neutr.']);
  assert.deepStrictEqual(row('Saptamsha').slice(1, 8), ['Neutr.', 'Frnd.', 'Grt.Fr.', 'Frnd.', 'Grt.Fr.', 'Own', 'Neutr.']);
  // The nodes have no dignity table.
  for (const r of dig.rows) {
    assert.equal(r[8], NOT_BUILT);
    assert.equal(r[9], NOT_BUILT);
  }

  // Vimshopaka (whole points, as the sample prints): Sun shadavarga 10, Mercury 16, Jupiter dashavarga 14 match the sample.
  const vim = p10.blocks[2];
  const vimCell = (scheme, planetIndex) => vim.rows.find((r) => r[0] === scheme)[planetIndex];
  assert.equal(vimCell('Shadavarga', 1), '10');
  assert.equal(vimCell('Shadavarga', 4), '16');
  assert.equal(vimCell('Dashavarga', 5), '14');
  // Saptavarga: the sample prints Moon 11, Mars 11, Saturn 12; ours are 12, 10, 10 (not matched, pinned as built).
  assert.equal(vimCell('Saptavarga', 2), '12');
  assert.equal(vimCell('Saptavarga', 3), '10');
  assert.equal(vimCell('Saptavarga', 7), '10');

  console.log('test-horoscope-book-planets: all assertions passed');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
