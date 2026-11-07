const assert = require('assert');
const { SIGN_DESCRIPTIONS } = require('./src/report/readerIISignDescriptions');

// Aries, printed pp.117-124: sixteen topics, each on the printed page the book gives
const a = SIGN_DESCRIPTIONS.Aries;
assert.strictEqual(a.pageFrom, 117);
assert.strictEqual(a.pageTo, 124);
assert.deepStrictEqual(a.sections.map((s) => s.id), ['PHYSICAL', 'MENTAL', 'CHARACTER', 'HEALTH', 'FINANCE', 'ROMANCE', 'DOMESTIC', 'PROFESSION', 'PLACES', 'DIRECTION', 'PRODUCTS', 'COUNTRIES', 'HANDWRITING', 'LUCKY_DAY', 'LUCKY_NUMBER', 'LUCKY_STONE']);
assert.deepStrictEqual(a.sections.map((s) => s.page), [118, 118, 118, 120, 121, 121, 122, 123, 123, 123, 123, 124, 124, 124, 124, 124]);
for (const s of a.sections) {
  assert.ok(s.page >= 117 && s.page <= 124, s.id);
  assert.ok(s.en.length > 0 && s.ta.length > 0 && s.titleTa.length > 0, s.id);
}
// spot checks against the book's text
const by = (id) => a.sections.find((s) => s.id === id);
assert.ok(by('PHYSICAL').en.startsWith('Persons born under this sign are of middle stature'));
assert.ok(by('HEALTH').en.includes('headaches, burns, inflammatory diseases'));
assert.strictEqual(by('DIRECTION').en, 'East.');
assert.strictEqual(by('DIRECTION').ta, 'கிழக்கு.');
assert.strictEqual(by('LUCKY_NUMBER').en, '9, 8 and 6.');
assert.strictEqual(by('LUCKY_STONE').en, 'Blue.');
assert.ok(by('COUNTRIES').en.startsWith('Britain, Galatia, Germany'));
// no page number left inside the English text
for (const s of a.sections) assert.ok(!/\s1[12]\d\s/.test(s.en) || s.id === 'COUNTRIES' || s.id === 'HANDWRITING', s.id);
console.log('test-reader-ii-sign-descriptions ok');
