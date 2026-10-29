const assert = require('assert');
const { buildPage2 } = require('./src/report/horoscopeBook/page2');

// Sample birth, PL9 aniruddha_HC4 page 2: 5 October 1990, 04:30 IST, Chennai (13N05' 80E17').
const sampleBirth = {
  year: 1990, month: 10, day: 5, hour: 4, minute: 30, ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330,
  latitude: 13 + 5 / 60, longitude: 80 + 17 / 60, placeName: 'Chennai',
};

const COLUMNS = ['Planet', 'R/C', 'Sign', 'Degree', 'Speed', 'Nakshatra', 'Pada', 'RL', 'NL', 'SL', 'SS', 'Status', 'SB'];
const NOT_BUILT = 'கட்டப்படவில்லை';

async function main() {
  const doc = await buildPage2({ name: 'aniruddha', birth: sampleBirth });
  assert.deepStrictEqual(doc.blocks.map((b) => b.kind), ['signGrid', 'signGrid', 'signGrid', 'table']);
  assert.ok(!/undefined|NaN|null/.test(JSON.stringify(doc)), 'no undefined or NaN in the page');

  // Planet table: each row is [Planet, R/C, Sign, Degree, Speed, Nakshatra, Pada, RL, NL, SL, SS, Status, SB].
  const table = doc.blocks[3];
  assert.deepStrictEqual(table.columns, COLUMNS);
  const row = (name) => {
    const r = table.rows.find((x) => x[0] === name);
    assert.ok(r, `${name} row exists`);
    return r;
  };

  // Lagna: Leo 25:03:02 in the sample (ours 25:03:15, 13 seconds apart); lords match.
  const lagna = row('Lagna');
  assert.equal(lagna[2], 'Leo');
  assert.ok(lagna[3].startsWith('25:03:'), 'lagna degree near 25:03');
  assert.deepStrictEqual(lagna.slice(5, 11), ['Purva Phalguni', '4', 'Sun', 'Venus', 'Mercury', 'Mars']);

  // Sample rows, exact on sign, nakshatra, pada, the four lords and status.
  assert.deepStrictEqual(row('Sun').slice(0, 12), ['Sun', '', 'Vir', '17:43:34', '00:59:05', 'Hasta', '3', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Enemy']);
  assert.deepStrictEqual(row('Moon').slice(2, 12), ['Pis', '23:56:35', '14:38:10', 'Revati', '3', 'Jupiter', 'Mercury', 'Mars', 'Venus', 'Enemy']);
  assert.deepStrictEqual(row('Mars').slice(2, 12), ['Tau', '19:05:25', '00:12:40', 'Rohini', '3', 'Venus', 'Moon', 'Mercury', 'Rahu', 'Enemy']);
  assert.deepStrictEqual(row('Mercury').slice(0, 12), ['Mercury', 'C', 'Vir', '04:55:20', '01:43:00', 'Uttara Phalguni', '3', 'Mercury', 'Sun', 'Saturn', 'Jupiter', 'Exalt.']);
  assert.deepStrictEqual(row('Jupiter').slice(2, 12), ['Can', '15:11:21', '00:09:08', 'Pushya', '4', 'Moon', 'Saturn', 'Jupiter', 'Saturn', 'Exalt.']);
  assert.deepStrictEqual(row('Venus').slice(0, 12), ['Venus', 'C', 'Vir', '10:34:14', '01:14:52', 'Hasta', '1', 'Mercury', 'Moon', 'Moon', 'Saturn', 'Debil.']);
  assert.deepStrictEqual(row('Saturn').slice(2, 12), ['Sag', '25:05:12', '00:01:10', 'Purva Ashadha', '4', 'Jupiter', 'Venus', 'Mercury', 'Rahu', 'Enemy']);
  // Nodes: sample Rahu/Ketu degrees 10:03:38 (ours 13 seconds later); speed -00:03:11 in both; no status is built for nodes.
  assert.deepStrictEqual(row('Rahu').slice(2, 11), ['Cap', '10:03:51', '-00:03:11', 'Shravana', '1', 'Saturn', 'Moon', 'Moon', 'Moon']);
  assert.equal(row('Rahu')[11], NOT_BUILT);
  assert.deepStrictEqual(row('Ketu').slice(2, 11), ['Can', '10:03:51', '-00:03:11', 'Pushya', '3', 'Moon', 'Saturn', 'Venus', 'Mercury']);

  // Shad Bala is not built for any row, and the table says why.
  for (const r of table.rows) assert.equal(r[12], NOT_BUILT);
  assert.ok(table.note.startsWith('SB (Shad Bala) is not built'));

  // Birth Chart grid (sign-fixed, index 0 = Aries). Ascendant in Leo; planets in their Rasi signs.
  const [rasi, moon, nav] = doc.blocks;
  assert.deepStrictEqual(rasi.cells[4], ['As 25:03', 'Gk 02:36']);
  assert.deepStrictEqual(rasi.cells[5], ['Su 17:43', 'Me 04:55', 'Ve 10:34']);
  assert.deepStrictEqual(rasi.cells[1], ['Ma 19:05']);
  assert.deepStrictEqual(rasi.cells[11], ['Mo 23:56']);
  assert.deepStrictEqual(rasi.cells[8], ['Sa 25:05']);
  assert.deepStrictEqual(rasi.cells[9], ['Ra 10:03']);
  // Sample: Ju 15:11 and Ke 10:03 share the Cancer cell.
  assert.ok(rasi.cells[3].includes('Ju 15:11') && rasi.cells[3].includes('Ke 10:03'));
  // Gulika (BPHS ch.3, Thursday night, 6/8 of the night): Leo 2°36′. The sample prints Gk 03:02 in Leo, about two minutes apart.
  assert.ok(rasi.cells[4].includes('Gk 02:36'));
  // The Moon chart in a sign-fixed grid is the same placement, as in the sample.
  assert.deepStrictEqual(moon.cells, rasi.cells);

  // Navamsha: planets by D9 sign. Sample: Ve, Ra in Aries; Su, Ma in Gemini; Mo, Me in Aquarius; As, Sa, Ju in Scorpio; Ke in Libra.
  assert.deepStrictEqual(nav.cells[0], ['Ve', 'Ra', 'Gk']);
  assert.deepStrictEqual(nav.cells[2], ['Su', 'Ma']);
  assert.deepStrictEqual(nav.cells[10], ['Mo', 'Me']);
  assert.deepStrictEqual(nav.cells[7], ['Ju', 'Sa', 'As']);
  assert.deepStrictEqual(nav.cells[6], ['Ke']);
  // Gulika's navamsha sign is Aries, as the sample prints.
  assert.ok(nav.cells[0].includes('Gk'));

  console.log('test-horoscope-book-page2: all assertions passed');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
