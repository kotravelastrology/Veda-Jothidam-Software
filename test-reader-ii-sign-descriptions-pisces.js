const assert = require('assert');
const { SIGN_DESCRIPTIONS } = require('./src/report/readerIISignDescriptions');

// Pisces, printed pp.258-271: fourteen topics, each on the printed page the book gives
const p = SIGN_DESCRIPTIONS.Pisces;
assert.strictEqual(p.pageFrom, 258);
assert.strictEqual(p.pageTo, 271);
assert.deepStrictEqual(p.sections.map((x) => x.id), ['PHYSICAL', 'CHARACTER', 'HEALTH', 'FINANCE', 'DOMESTIC', 'ROMANCE', 'CHILDREN', 'LUCKY_DAY', 'LUCKY_COLOUR', 'LUCKY_NUMBER', 'ANIMATE', 'PLACES', 'COUNTRIES', 'PRODUCTS']);
assert.deepStrictEqual(p.sections.map((x) => x.page), [260, 261, 263, 264, 266, 268, 269, 270, 270, 271, 271, 271, 271, 271]);
for (const x of p.sections) {
  assert.ok(x.page >= 258 && x.page <= 271, x.id);
  assert.ok(x.en.length > 0 && x.ta.length > 0 && x.titleTa.length > 0, x.id);
}
const by = (id) => p.sections.find((x) => x.id === id);
// spot checks against the book's text, and no Aquarius or the houses chapter leaked in
assert.ok(by('PHYSICAL').en.startsWith('Pisces generally produce short people'));
assert.ok(by('PHYSICAL').en.endsWith('But the hair will be soft and silk.'));
assert.ok(by('CHARACTER').en.startsWith('Pisces is a watery sign ruled by Jupiter'));
assert.ok(by('CHARACTER').en.endsWith('Do not be contemplating and dreaming always.'));
assert.ok(by('HEALTH').en.startsWith('Being a watery sign, one will be addicted to drink'));
assert.ok(by('HEALTH').en.endsWith('cause deafness, general nervous debility, cramps, etc.'));
assert.ok(by('FINANCE').en.startsWith('Pisceans are really happy'));
assert.ok(by('FINANCE').en.endsWith('and if allowed, to be business also.'));
assert.ok(by('DOMESTIC').en.startsWith('These people generally welcome many friends'));
assert.ok(by('DOMESTIC').en.endsWith('and imprisonment.'));
assert.ok(by('ROMANCE').en.startsWith('Pisces people prefer the beauty'));
assert.ok(by('ROMANCE').en.endsWith('with Virgo-borns and Cancer-borns.'));
assert.ok(by('CHILDREN').en.startsWith('Jupiter, lord of Pisces, gets exalted'));
assert.ok(by('CHILDREN').en.endsWith('metals, boilers, oils etc.'));
assert.ok(by('LUCKY_DAY').en.startsWith('Thursdays, Tuesdays and Sundays.'));
assert.ok(by('LUCKY_DAY').en.endsWith('be avoided for dispute, agreement, etc.'));
assert.ok(by('LUCKY_COLOUR').en.startsWith('Red and yellow, rose and orange'));
assert.ok(by('LUCKY_COLOUR').en.endsWith('may be used with advantage.'));
assert.strictEqual(by('LUCKY_NUMBER').en, '1, 4, 3, 9. Avoid 8.');
assert.ok(by('ANIMATE').en.startsWith('Poorva- path ri pada constellation'));
assert.ok(by('ANIMATE').en.endsWith('bankers, electric thermal station, etc.'));
assert.ok(by('PLACES').en.startsWith('Pond, ocean, fisheries'));
assert.ok(by('PLACES').en.endsWith('water-mills, old hermitage, wells, cisterns, etc.'));
assert.ok(by('COUNTRIES').en.startsWith('South of Asia Minor'));
assert.ok(by('COUNTRIES').en.endsWith('Worms, Chicago.'));
assert.strictEqual(by('PRODUCTS').en, 'Fisheries, breweries, rubber, submarine, diving operation, shipping, navigation, liquids.');
assert.ok(!p.sections.some((x) => /Pisces is the 12th sign|Places - Meena|THE TWELVE HOUSES|Aquarius - Kumbba/.test(x.en)), 'no Aquarius or houses text in Pisces');
console.log('test-reader-ii-sign-descriptions-pisces ok');
