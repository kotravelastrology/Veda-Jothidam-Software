const assert = require('assert');
const { SIGN_DESCRIPTIONS } = require('./src/report/readerIISignDescriptions');

// Taurus, printed pp.124-137: twenty topics, each on the printed page the book gives
const t = SIGN_DESCRIPTIONS.Taurus;
assert.strictEqual(t.pageFrom, 124);
assert.strictEqual(t.pageTo, 138);
assert.deepStrictEqual(t.sections.map((s) => s.id), ['PHYSICAL', 'CHARACTER', 'WEAKNESS', 'HEALTH', 'DISEASE', 'FINANCE', 'PROFESSION', 'DOMESTIC', 'ROMANCE', 'CHILDREN', 'HANDWRITING', 'LUCKY_DAY', 'LUCKY_COLOUR', 'LUCKY_NUMBER', 'LUCKY_STONE', 'PLACES', 'COUNTRIES', 'CITIES', 'ANIMATE', 'CORRECTION']);
assert.deepStrictEqual(t.sections.map((s) => s.page), [125, 126, 129, 129, 129, 129, 130, 134, 134, 136, 136, 136, 136, 137, 137, 137, 137, 137, 137, 137]);
for (const s of t.sections) {
  assert.ok(s.page >= 124 && s.page <= 137, s.id);
  assert.ok(s.en.length > 0 && s.ta.length > 0 && s.titleTa.length > 0, s.id);
}
const by = (id) => t.sections.find((s) => s.id === id);
// spot checks against the book's text, and no Aries text leaked into Taurus
assert.ok(by('PHYSICAL').en.startsWith('The stature will be middle'));
assert.ok(by('PHYSICAL').en.includes('muscles well developed'));
assert.ok(by('CORRECTION').en.includes('Saturn and Mercury give them the courage to commit forgery'));
assert.strictEqual(by('LUCKY_STONE').en, 'Sapphire, diamond and emerald.');
assert.strictEqual(by('LUCKY_NUMBER').en, '6, 5 and 8.');
assert.strictEqual(by('LUCKY_COLOUR').en, 'Pink, green and white.');
assert.ok(by('COUNTRIES').en.startsWith('Persia, Modia'));
assert.ok(by('CITIES').en.startsWith('Rhodes, Mantua, Dublin'));
assert.ok(by('PROFESSION').en.length > 4000 && by('PROFESSION').en.includes('kerosene'), 'profession runs the full section');
assert.ok(!t.sections.some((s) => /Lucky Stone : Ruby|Blue\./.test(s.en)), 'no Aries lucky items in Taurus');
console.log('test-reader-ii-sign-descriptions-taurus ok');
