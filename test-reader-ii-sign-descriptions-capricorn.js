const assert = require('assert');
const { SIGN_DESCRIPTIONS } = require('./src/report/readerIISignDescriptions');

// Capricorn, printed pp.229-244: fourteen topics, each on the printed page the book gives
const c = SIGN_DESCRIPTIONS.Capricorn;
assert.strictEqual(c.pageFrom, 229);
assert.strictEqual(c.pageTo, 244);
assert.deepStrictEqual(c.sections.map((x) => x.id), ['PHYSICAL', 'CHARACTER', 'CORRECTION', 'HEALTH', 'FINANCE', 'DOMESTIC', 'ROMANCE', 'CHILDREN', 'LUCKY_DAY', 'LUCKY_COLOUR', 'LUCKY_NUMBER', 'ANIMATE', 'PLACES', 'COUNTRIES']);
assert.deepStrictEqual(c.sections.map((x) => x.page), [230, 231, 233, 234, 236, 239, 241, 242, 242, 243, 243, 243, 244, 244]);
for (const x of c.sections) {
  assert.ok(x.page >= 229 && x.page <= 244, x.id);
  assert.ok(x.en.length > 0 && x.ta.length > 0 && x.titleTa.length > 0, x.id);
}
const by = (id) => c.sections.find((x) => x.id === id);
// spot checks against the book's text, and no Sagittarius or Aquarius text leaked in
assert.ok(by('PHYSICAL').en.startsWith('Saturn, the lord of the sign, shows'));
assert.ok(by('PHYSICAL').en.endsWith('in the knee-cap or at least a mole.'));
assert.ok(by('CHARACTER').en.startsWith('Capricorn is an earthy sign'));
assert.ok(by('CHARACTER').en.endsWith('for ultimate grand success.'));
assert.ok(by('CORRECTION').en.startsWith('If either the ascendant in Capricorn'));
assert.ok(by('CORRECTION').en.endsWith('avoid nervousness and discontent.'));
assert.ok(by('HEALTH').en.startsWith('Capricorn governs the knees'));
assert.ok(by('HEALTH').en.endsWith('the same diseases.'));
assert.ok(by('FINANCE').en.startsWith('Capricorn-barns are conservatives.'));
assert.ok(by('FINANCE').en.endsWith('will prove to be advantageous.'));
assert.ok(by('DOMESTIC').en.startsWith('Generally, Capricorn-barns are not very anxious'));
assert.ok(by('DOMESTIC').en.endsWith('though not as a gift.'));
assert.ok(by('ROMANCE').en.startsWith('Even though the native may have affection'));
assert.ok(by('ROMANCE').en.endsWith('celebrated suddenly at a very early age.'));
assert.ok(by('CHILDREN').en.endsWith('for their comforts and conveniences.'));
assert.ok(by('LUCKY_DAY').en.startsWith('Fridays Tuesdays and Saturdays are the best.'));
assert.ok(by('LUCKY_COLOUR').en.startsWith('White, red and blue are lucky colours.'));
assert.ok(by('LUCKY_NUMBER').en.startsWith('6, 15, 24, 33, 42, 51'));
assert.ok(by('ANIMATE').en.startsWith('Uthrashada star in Capricorn'));
assert.ok(by('PLACES').en.startsWith('Safe vaults, cells, isolation'));
assert.ok(by('COUNTRIES').en.startsWith('India, Punjab, Circram'));
assert.ok(by('COUNTRIES').en.endsWith('Prato Fayence, Tortano, Mayence.'));
assert.ok(!c.sections.some((x) => /Aquarius - Kumbba|Aquarius is the eleventh|Capricorn - Makaram|Sagittarius-Dhanus/.test(x.en)), 'no Sagittarius or Aquarius text in Capricorn');
console.log('test-reader-ii-sign-descriptions-capricorn ok');
