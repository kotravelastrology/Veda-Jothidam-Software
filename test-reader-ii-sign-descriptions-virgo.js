const assert = require('assert');
const { SIGN_DESCRIPTIONS } = require('./src/report/readerIISignDescriptions');

// Virgo, printed pp.178-194: thirteen topics, each on the printed page the book gives
const v = SIGN_DESCRIPTIONS.Virgo;
assert.strictEqual(v.pageFrom, 178);
assert.strictEqual(v.pageTo, 194);
assert.deepStrictEqual(v.sections.map((s) => s.id), ['PHYSICAL', 'CHARACTER', 'CORRECTION', 'HEALTH', 'FINANCE', 'PROFESSION', 'DOMESTIC', 'ROMANCE', 'CHILDREN', 'HANDWRITING', 'LUCKY_DAY', 'LUCKY_COLOUR', 'LUCKY_NUMBER']);
assert.deepStrictEqual(v.sections.map((s) => s.page), [180, 180, 183, 184, 185, 186, 189, 191, 193, 193, 193, 194, 194]);
for (const s of v.sections) {
  assert.ok(s.page >= 178 && s.page <= 194, s.id);
  assert.ok(s.en.length > 0 && s.ta.length > 0 && s.titleTa.length > 0, s.id);
}
const by = (id) => v.sections.find((s) => s.id === id);
// spot checks against the book's text, and no Leo text leaked in
assert.ok(by('PHYSICAL').en.startsWith('The native will be tall with a slender body'));
assert.ok(by('PHYSICAL').en.endsWith('(Venus is the ruler of the second sign).'));
assert.ok(by('CHARACTER').en.startsWith('Virgo is ruled by inconstant Mercury'));
assert.ok(by('CHARACTER').en.endsWith('so born under such favourable positions.'));
assert.ok(by('CORRECTION').en.startsWith("The native's nature is to be very chatty"));
assert.ok(by('CORRECTION').en.endsWith('long sustained resentment.'));
assert.ok(by('HEALTH').en.endsWith('"An apple a day, will keep the doctor away".'));
assert.ok(by('FINANCE').en.startsWith('As you possess a sound commercial instinct'));
assert.ok(by('PROFESSION').en.endsWith('in shipping.'));
assert.ok(by('DOMESTIC').en.endsWith('will be good friends, indeed.'));
assert.ok(by('ROMANCE').en.startsWith('You have your own ideals.'));
assert.ok(by('CHILDREN').en.endsWith('with less of efforts.'));
assert.ok(by('HANDWRITING').en.endsWith('you will do it twice.'));
assert.ok(by('LUCKY_DAY').en.startsWith('Your ruling planet is Mercury'));
assert.ok(by('LUCKY_COLOUR').en.startsWith('Green, white and yellow. Avoid red and blue.'));
assert.strictEqual(by('LUCKY_NUMBER').en, '5, 14, 23, 32, 41, etc. 2, 11,20, 38, 47, etc. 7, 16, 25, 34, 43, etc. 6, 15, 24, 33, 42, etc. 3, 12,21, 30, 48, etc.');
assert.ok(!v.sections.some((s) => /Ruby, Emerald|Animate and Inanimate|Leo or Simha|Libra - Thulam/.test(s.en)), 'no Leo or Libra text in Virgo');
console.log('test-reader-ii-sign-descriptions-virgo ok');
