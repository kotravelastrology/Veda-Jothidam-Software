const assert = require('assert');
const { buildPage19, sookshmaText } = require('./src/report/horoscopeBook/healthPage');

// Sample birth, PL9 aniruddha_HC4 page 19: 5 October 1990, 04:30 IST, Chennai (13N05' 80E17').
const birth = {
  year: 1990, month: 10, day: 5, hour: 4, minute: 30, ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330,
  latitude: 13 + 5 / 60, longitude: 80 + 17 / 60, placeName: 'Chennai',
};

// PL9 page 19, Sookshma and Sthoola schemes, from the sample's text layer. Our labels in the comments where they differ.
const PL9_SOOKSHMA = {
  Sun: 'Right Shoulder', Moon: 'Left calf', Mars: 'Left side', Mercury: 'Right eye', Jupiter: 'Left shoulder',
  Venus: 'Right Shoulder', Saturn: 'Right knee', Rahu: 'Right chest', Ketu: 'Left shoulder',
};
// Sthoola: the two limbs, in the order PL9 prints them ("Generative organs" is our "Privities").
const PL9_STHOOLA = {
  Sun: ['Hip', 'Face'], Moon: ['Feet', 'Privities'], Mars: ['Face', 'Knees'], Mercury: ['Hip', 'Face'],
  Jupiter: ['Heart', 'Feet'], Venus: ['Hip', 'Face'], Saturn: ['Thighs', 'Stomach'], Rahu: ['Knees', 'Hip'], Ketu: ['Heart', 'Feet'],
};

async function main() {
  // The limb text: side as a word, both-sided limbs in brackets.
  assert.strictEqual(sookshmaText({ limb: 'Shoulder', side: 'RIGHT' }), 'Right Shoulder');
  assert.strictEqual(sookshmaText({ limb: 'Head', side: 'BOTH' }), 'Head (both)');

  const page = await buildPage19({ name: 'aniruddha', birth });
  assert.ok(!/undefined|NaN|null/.test(JSON.stringify(page)), 'no undefined, NaN or null on page 19');
  assert.deepStrictEqual(page.blocks.map((b) => b.heading), ['Sookshma Scheme', 'Sthoola Scheme']);
  const [sookshma, sthoola] = page.blocks;

  // Sookshma: eight of nine as PL9 prints them. Mars's "Left side" is the trunk's left side (BPHS "Side of trunk").
  // Rahu differs: PL9 Right chest, the BPHS limb for the sixth house's second decanate is Right stomach.
  const expectedSookshma = { ...PL9_SOOKSHMA, Mars: 'Left Side of trunk', Rahu: 'Right Stomach' };
  for (const [graha, want] of Object.entries(expectedSookshma)) {
    const row = sookshma.rows.find((r) => r[0] === graha);
    assert.ok(row, `${graha} row`);
    assert.strictEqual(row[1].toLowerCase(), want.toLowerCase(), `${graha} Sookshma`);
  }
  assert.strictEqual(sookshma.rows.length, 9);

  // Sthoola: each graha's two limbs, cell for cell, in PL9's order (our Privities is PL9's Generative organs).
  for (const [graha, want] of Object.entries(PL9_STHOOLA)) {
    const row = sthoola.rows.find((r) => r[0] === graha);
    assert.ok(row, `${graha} row`);
    assert.deepStrictEqual(row.slice(1), want, `${graha} Sthoola`);
  }
  assert.strictEqual(sthoola.rows.length, 9);

  console.log('test-horoscope-book-health-page: all assertions passed');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
