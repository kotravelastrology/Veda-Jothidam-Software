const assert = require('assert');
const { SIGN_DESCRIPTIONS } = require('./src/report/readerIISignDescriptions');

// Aquarius, printed pp.244-258: fourteen topics, each on the printed page the book gives
const a = SIGN_DESCRIPTIONS.Aquarius;
assert.strictEqual(a.pageFrom, 244);
assert.strictEqual(a.pageTo, 258);
assert.deepStrictEqual(a.sections.map((x) => x.id), ['PHYSICAL', 'CHARACTER', 'CORRECTION', 'HEALTH', 'FINANCE', 'DOMESTIC', 'ROMANCE', 'CHILDREN', 'LUCKY_DAY', 'LUCKY_COLOUR', 'LUCKY_NUMBER', 'PLACES', 'PRODUCTS', 'COUNTRIES']);
assert.deepStrictEqual(a.sections.map((x) => x.page), [246, 246, 249, 249, 251, 253, 254, 255, 256, 256, 257, 257, 258, 258]);
for (const x of a.sections) {
  assert.ok(x.page >= 244 && x.page <= 258, x.id);
  assert.ok(x.en.length > 0 && x.ta.length > 0 && x.titleTa.length > 0, x.id);
}
const by = (id) => a.sections.find((x) => x.id === id);
// spot checks against the book's text, and no Capricorn or Pisces text leaked in
assert.ok(by('PHYSICAL').en.startsWith('Though this sign is of short ascension'));
assert.ok(by('PHYSICAL').en.endsWith('There may be a mole or scar in the calf muscle.'));
assert.ok(by('CHARACTER').en.startsWith('Aquarius is an airy sign'));
assert.ok(by('CHARACTER').en.endsWith('they are strong pessimists.'));
assert.ok(by('CORRECTION').en.startsWith('If either the ascendant or Saturn'));
assert.ok(by('CORRECTION').en.endsWith('towards those whom the Aquarians dislike.'));
assert.ok(by('HEALTH').en.startsWith('As Aquarius opposes the sign of Sun'));
assert.ok(by('HEALTH').en.endsWith('of the native.'));
assert.ok(by('FINANCE').en.startsWith('Generally Aquarians make money'));
assert.ok(by('FINANCE').en.endsWith('Captain of a ship, salt dealer, etc.'));
assert.ok(by('DOMESTIC').en.startsWith('As Aquarians are very social'));
assert.ok(by('DOMESTIC').en.endsWith('make the home life pleasant.'));
assert.ok(by('ROMANCE').en.startsWith('As Aquarians are intelligent'));
assert.ok(by('ROMANCE').en.endsWith('carry research on science, etc?'));
assert.ok(by('CHILDREN').en.startsWith('The Aquarians do not pose'));
assert.ok(by('CHILDREN').en.endsWith('propagandists, etc.'));
assert.ok(by('LUCKY_DAY').en.startsWith('Thursday, Fridays, Tuesdays, and Mondays'));
assert.ok(by('LUCKY_DAY').en.endsWith('Never speculate on Wednesdays and Sundays.'));
assert.ok(by('LUCKY_COLOUR').en.startsWith('Yellow, red, white and cream'));
assert.ok(by('LUCKY_NUMBER').en.startsWith('3, 12, 21, 30, 48, 57 and so on'));
assert.ok(by('LUCKY_NUMBER').en.endsWith('Birth and death Registrar, lecturer.'));
assert.ok(by('PLACES').en.startsWith('Hilly and uneven places where streams flow'));
assert.ok(by('PLACES').en.endsWith('ladders, stairways, etc.'));
assert.ok(by('PRODUCTS').en.startsWith('Buckets, cups, ferries'));
assert.ok(by('PRODUCTS').en.endsWith('wool, fleece, hair.'));
assert.ok(by('COUNTRIES').en.startsWith('Arabia, Abyssinia, Prussia'));
assert.ok(by('COUNTRIES').en.endsWith('mainly Russia, Salisbury.'));
assert.ok(!a.sections.some((x) => /Places - Meena|Pisces is the 12th|Aquarius - Kumbba|Countries and Towns/.test(x.en)), 'no Pisces or Capricorn text in Aquarius');
console.log('test-reader-ii-sign-descriptions-aquarius ok');
