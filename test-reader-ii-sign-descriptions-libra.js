const assert = require('assert');
const { SIGN_DESCRIPTIONS } = require('./src/report/readerIISignDescriptions');

// Libra, printed pp.195-207: fifteen topics, each on the printed page the book gives
const l = SIGN_DESCRIPTIONS.Libra;
assert.strictEqual(l.pageFrom, 195);
assert.strictEqual(l.pageTo, 207);
assert.deepStrictEqual(l.sections.map((s) => s.id), ['PHYSICAL', 'CHARACTER', 'CORRECTION', 'HEALTH', 'FINANCE', 'DOMESTIC', 'ROMANCE', 'CHILDREN', 'LUCKY_DAY', 'LUCKY_COLOUR', 'LUCKY_NUMBER', 'ANIMATE', 'PLACES', 'CITIES', 'COUNTRIES']);
assert.deepStrictEqual(l.sections.map((s) => s.page), [197, 197, 199, 200, 201, 202, 203, 204, 204, 205, 206, 206, 206, 206, 207]);
for (const s of l.sections) {
  assert.ok(s.page >= 195 && s.page <= 207, s.id);
  assert.ok(s.en.length > 0 && s.ta.length > 0 && s.titleTa.length > 0, s.id);
}
const by = (id) => l.sections.find((s) => s.id === id);
// spot checks against the book's text, and no Virgo or Scorpio text leaked in
assert.ok(by('PHYSICAL').en.startsWith('The person born with Libra as ascendant'));
assert.ok(by('PHYSICAL').en.endsWith('The nose will be a little bent like the parrot.'));
assert.ok(by('CHARACTER').en.startsWith('As Libra is symbolised with Balance'));
assert.ok(by('CHARACTER').en.endsWith('spell-bound.'));
assert.ok(by('CORRECTION').en.startsWith('Generally. Libra-borns gain materially'));
assert.ok(by('CORRECTION').en.endsWith('in their case.'));
assert.ok(by('HEALTH').en.endsWith('lumbago polyuria etc.'));
assert.ok(by('FINANCE').en.startsWith('Librans are the best suited for business'));
assert.ok(by('FINANCE').en.endsWith('will be generous and liberal.'));
assert.ok(by('DOMESTIC').en.startsWith('Their family life will be happy'));
assert.ok(by('DOMESTIC').en.endsWith('cannot be helpful.'));
assert.ok(by('ROMANCE').en.startsWith('Librans are the most lovable people'));
assert.ok(by('ROMANCE').en.endsWith('Librans will manage with others.'));
assert.ok(by('CHILDREN').en.endsWith("'Yes' and they avoid saying 'No' to anybody."));
assert.ok(by('LUCKY_DAY').en.startsWith('Sundays and Mondays are the successful days'));
assert.ok(by('LUCKY_DAY').en.endsWith('Fridays offer mixed results.'));
assert.ok(by('LUCKY_COLOUR').en.startsWith('Orange, white and red.'));
assert.ok(by('LUCKY_NUMBER').en.startsWith('1, 10, 19 28, 37 etc'));
assert.ok(by('LUCKY_NUMBER').en.endsWith('But Venus does not give smooth life.'));
assert.ok(by('ANIMATE').en.startsWith('Libra indicates the prices of cotton'));
assert.ok(by('ANIMATE').en.endsWith('are indicated by Virgo.'));
assert.ok(by('PLACES').en.startsWith('Libra denotes sawpits'));
assert.ok(by('CITIES').en.startsWith('Antwerp, Nottingham, Lezds'));
assert.ok(by('CITIES').en.endsWith('Johannesburg and Gaeta.'));
assert.ok(by('COUNTRIES').en.startsWith('Northern Provinces of India, Burma'));
assert.ok(by('COUNTRIES').en.endsWith('Bactrianna and Livonia.'));
assert.ok(!l.sections.some((s) => /Scorpio or Vrischika|Scorpio is the 8th|Libra - Thulam|Lucky stone : Emerald/.test(s.en)), 'no Scorpio or Virgo text in Libra');
console.log('test-reader-ii-sign-descriptions-libra ok');
