const assert = require('assert');
const { buildPage13 } = require('./src/report/horoscopeBook/avasthaPage');
const { JAGRADADI, BALADI, DEEPTADI, LAJJITADI, SHAYANADI_NAMES } = require('./src/report/avasthas');

// Sample birth, PL9 aniruddha_HC4 page 13: 5 October 1990, 04:30 IST, Chennai (13N05' 80E17').
const birth = {
  year: 1990, month: 10, day: 5, hour: 4, minute: 30, ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330,
  latitude: 13 + 5 / 60, longitude: 80 + 17 / 60, placeName: 'Chennai',
};
const NOT_BUILT = 'கட்டப்படவில்லை';
const NONE = '—';
const GRAHAS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

// PL9 page 13, read from the page image (aniruddha_HC4.pdf, PDF page 13).
const PL9 = {
  Sun: { jagradadi: JAGRADADI.dream, baladi: BALADI[2], lajjitadi: ['kshudhit', 'mudit'], deeptadi: DEEPTADI.dukhita, shayanadi: 11 },
  Moon: { jagradadi: JAGRADADI.dream, baladi: BALADI[1], lajjitadi: ['kshudhit', 'mudit'], deeptadi: DEEPTADI.dukhita, shayanadi: 5 },
  Mars: { jagradadi: JAGRADADI.dream, baladi: BALADI[1], lajjitadi: ['kshudhit'], deeptadi: DEEPTADI.dukhita, shayanadi: 5 },
  Mercury: { jagradadi: JAGRADADI.awake, baladi: BALADI[4], lajjitadi: ['garvit', 'mudit', 'kshobhit'], deeptadi: DEEPTADI.deepta, shayanadi: 5 },
  Jupiter: { jagradadi: JAGRADADI.awake, baladi: BALADI[2], lajjitadi: ['garvit', 'trashit'], deeptadi: DEEPTADI.deepta, shayanadi: 1 },
  Venus: { jagradadi: JAGRADADI.sleep, baladi: BALADI[3], lajjitadi: ['kshobhit'], deeptadi: DEEPTADI.khala, shayanadi: 5 },
  Saturn: { jagradadi: JAGRADADI.dream, baladi: BALADI[4], lajjitadi: ['lajjit', 'kshudhit'], deeptadi: DEEPTADI.dukhita, shayanadi: 9 },
  Rahu: { jagradadi: JAGRADADI.dream, baladi: BALADI[3], lajjitadi: ['mudit'], deeptadi: null, shayanadi: 1 },
  Ketu: { jagradadi: JAGRADADI.sleep, baladi: BALADI[3], lajjitadi: ['trashit', 'mudit'], deeptadi: null, shayanadi: 5 },
};
const LAJJITADI_BY_KEY = Object.fromEntries(Object.keys(LAJJITADI).map((k) => [k, LAJJITADI[k]]));
const lajjitadiCell = (keys) => (keys.length === 0 ? NONE : keys.map((k) => LAJJITADI_BY_KEY[k]).join(' · '));

async function main() {
  const page = await buildPage13({ name: 'aniruddha', birth });
  assert.ok(!/undefined|NaN|null/.test(JSON.stringify(page)), 'no undefined, NaN or null on page 13');
  assert.deepStrictEqual(page.blocks.map((b) => b.heading), ['Planetary Avasthas']);

  const table = page.blocks[0];
  assert.deepStrictEqual(table.columns, ['Planet', 'Jagradadi (3)', 'Baladi (5)', 'Lajjitadi (6)', 'Deeptadi (9)', 'Shayanadi (12)']);
  assert.strictEqual(table.rows.length, GRAHAS.length);
  const byPlanet = Object.fromEntries(table.rows.map((r) => [r[0], r]));

  for (const planet of GRAHAS) {
    const row = byPlanet[planet];
    assert.ok(row, `${planet} row exists`);
    const want = PL9[planet];
    // Jagradadi (BPHS v.5), Baladi (v.3) and Shayanadi (v.30-37) match PL9 on all nine grahas.
    assert.strictEqual(row[1], want.jagradadi, `${planet} Jagradadi vs PL9`);
    assert.strictEqual(row[2], want.baladi, `${planet} Baladi vs PL9`);
    assert.strictEqual(row[5], SHAYANADI_NAMES[want.shayanadi - 1], `${planet} Shayanadi vs PL9`);
    if (want.deeptadi === null) {
      assert.strictEqual(row[4], NOT_BUILT, `${planet} Deeptadi is not built (no exaltation or own sign in BPHS ch.45)`);
    } else {
      // Deeptadi (v.8-10) matches PL9 on the seven planets.
      assert.strictEqual(row[4], want.deeptadi, `${planet} Deeptadi vs PL9`);
    }
  }

  // Lajjitadi: the PL9 states hold on Sun, Moon, Mars and Saturn. Mercury, Venus and Jupiter differ from PL9 on this birth:
  // the BPHS conditions give Mercury a Kshudhita (enemy aspect by the Moon) and Venus Kshudhita and Mudita, while PL9 prints
  // Jupiter a Trashita that no enemy aspect on Cancer gives. Those three are pinned at the values our reading gives.
  for (const planet of ['Sun', 'Moon', 'Mars', 'Saturn']) {
    assert.strictEqual(byPlanet[planet][3], lajjitadiCell(PL9[planet].lajjitadi), `${planet} Lajjitadi vs PL9`);
  }
  assert.strictEqual(byPlanet.Mercury[3], lajjitadiCell(['kshudhit', 'garvit', 'mudit', 'kshobhit']),
    'Mercury Lajjitadi: BPHS gives Kshudhita (aspect of the Moon, its natural enemy); PL9 does not print it');
  assert.strictEqual(byPlanet.Jupiter[3], lajjitadiCell(['garvit']),
    'Jupiter Lajjitadi: no enemy aspects Cancer, so no Trashita; PL9 prints one');
  assert.strictEqual(byPlanet.Venus[3], lajjitadiCell(['kshudhit', 'mudit', 'kshobhit']),
    'Venus Lajjitadi: the Sun (natural enemy) is in conjunction, and Mercury (natural friend) too; PL9 prints Kshobhita only');
  // The nodes' Lajjitadi is not built.
  assert.strictEqual(byPlanet.Rahu[3], NOT_BUILT, 'Rahu Lajjitadi is not built');
  assert.strictEqual(byPlanet.Ketu[3], NOT_BUILT, 'Ketu Lajjitadi is not built');

  // The note names the differences from PL9, so the reader can check them against the sample.
  assert.ok(table.note.includes('Mercury') && table.note.includes('Venus') && table.note.includes('Jupiter'),
    'the note names the three Lajjitadi differences');

  console.log('test-horoscope-book-avastha-page: all assertions passed');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
