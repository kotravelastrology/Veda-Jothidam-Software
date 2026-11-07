const assert = require('assert');
const { SIGN_DESCRIPTIONS } = require('./src/report/readerIISignDescriptions');

// Leo, printed pp.163-178: seventeen topics, each on the printed page the book gives
const l = SIGN_DESCRIPTIONS.Leo;
assert.strictEqual(l.pageFrom, 163);
assert.strictEqual(l.pageTo, 178);
assert.deepStrictEqual(l.sections.map((s) => s.id), ['PHYSICAL', 'CHARACTER', 'CORRECTION', 'HEALTH', 'FINANCE', 'PROFESSION', 'DOMESTIC', 'ROMANCE', 'CHILDREN', 'HANDWRITING', 'LUCKY_DAY', 'LUCKY_COLOUR', 'LUCKY_STONE', 'LUCKY_NUMBER', 'PLACES', 'COUNTRIES', 'ANIMATE']);
assert.deepStrictEqual(l.sections.map((s) => s.page), [164, 165, 169, 170, 171, 171, 173, 173, 175, 176, 176, 177, 177, 177, 177, 177, 178]);
for (const s of l.sections) {
  assert.ok(s.page >= 163 && s.page <= 178, s.id);
  assert.ok(s.en.length > 0 && s.ta.length > 0 && s.titleTa.length > 0, s.id);
}
const by = (id) => l.sections.find((s) => s.id === id);
// spot checks against the book's text, and no Cancer or Virgo text leaked in
assert.ok(by('PHYSICAL').en.startsWith('One born in Leo will have well developed bones'));
assert.ok(by('CHARACTER').en.startsWith('Sun owns Leo-Sim ha'));
assert.ok(by('CHARACTER').en.endsWith('the deepest shadow.'));
assert.ok(by('CORRECTION').en.startsWith('Generally Leonians do not consider both sides'));
assert.ok(by('CORRECTION').en.endsWith('the ever-changing fashion.'));
assert.ok(by('HEALTH').en.endsWith("'Sathvic' diet."));
assert.ok(by('FINANCE').en.startsWith('Leo is symbolised by the Lion'));
assert.ok(by('PROFESSION').en.endsWith('the nature of the profession is to be judged.'));
assert.ok(by('DOMESTIC').en.endsWith('then his home is his Heaven. Romance,'));
assert.ok(by('ROMANCE').en.startsWith('The person born in Leo is romantic'));
assert.ok(by('CHILDREN').en.endsWith('crown them with success.'));
assert.strictEqual(by('LUCKY_COLOUR').en, 'Orange, Red, Green. Avoid Blue and White.');
assert.strictEqual(by('LUCKY_STONE').en, 'Ruby, Emerald.');
assert.strictEqual(by('LUCKY_NUMBER').en, '1, 4, 5, 9, 6, Avoid 2, 7 and 8;');
assert.ok(by('PLACES').en.startsWith('High hills ; places inhabited by wild animals'));
assert.ok(by('COUNTRIES').en.startsWith('France, Italy, Sicily, Bohemia'));
assert.ok(by('COUNTRIES').en.endsWith('Vanga, Kalinga, etc.'));
assert.ok(by('ANIMATE').en.startsWith('Asafoetida, omum, pine'));
assert.ok(!l.sections.some((s) => /Amsterdam, Berne|Virgo - Kanni|Leo or Simha/.test(s.en)), 'no Cancer or Virgo text in Leo');
console.log('test-reader-ii-sign-descriptions-leo ok');
