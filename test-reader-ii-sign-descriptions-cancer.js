const assert = require('assert');
const { SIGN_DESCRIPTIONS } = require('./src/report/readerIISignDescriptions');

// Cancer, printed pp.151-163: nineteen topics, each on the printed page the book gives
const c = SIGN_DESCRIPTIONS.Cancer;
assert.strictEqual(c.pageFrom, 151);
assert.strictEqual(c.pageTo, 163);
assert.deepStrictEqual(c.sections.map((s) => s.id), ['PHYSICAL', 'CHARACTER', 'CORRECTION', 'HEALTH', 'DISEASE', 'PROFESSION', 'DOMESTIC', 'ROMANCE', 'CHILDREN', 'HANDWRITING', 'LUCKY_DAY', 'LUCKY_COLOUR', 'LUCKY_NUMBER', 'LUCKY_STONE', 'PLACES', 'PRODUCTS', 'COUNTRIES', 'CITIES', 'ANIMATE']);
assert.deepStrictEqual(c.sections.map((s) => s.page), [152, 152, 156, 157, 157, 157, 159, 159, 160, 161, 161, 162, 162, 162, 162, 162, 162, 162, 163]);
for (const s of c.sections) {
  assert.ok(s.page >= 151 && s.page <= 163, s.id);
  assert.ok(s.en.length > 0 && s.ta.length > 0 && s.titleTa.length > 0, s.id);
}
const by = (id) => c.sections.find((s) => s.id === id);
// spot checks against the book's text, and no Gemini or Leo text leaked in
assert.ok(by('PHYSICAL').en.startsWith('Clumsy body, slender limbs and powerful claws'));
assert.ok(by('CHARACTER').en.startsWith('The ruling planet of Cancer is the Luna or the Moon'));
assert.ok(by('DISEASE').en.startsWith('Affections of both the lungs, flu, cough'));
assert.ok(by('PROFESSION').en.startsWith('People having the influence of Cancer'));
assert.ok(by('PROFESSION').en.endsWith('cumulate wealth by dint of their own hard efforts.'));
assert.strictEqual(by('LUCKY_COLOUR').en, 'White, cream, red and yellow are lucky colours. Blue and green colours should be avoided.');
assert.strictEqual(by('LUCKY_NUMBER').en, '2, 7 and 9 are fortunate. 1, 3, 4 and 6 are good. 5 and 8 are to be avoided.');
assert.ok(by('LUCKY_STONE').en.startsWith('Diamond, pearls, .ruby, yellow sapphire.'));
assert.ok(by('COUNTRIES').en.startsWith('Holland, Scotland, New Zealand'));
assert.ok(by('CITIES').en.startsWith('St. Andrews, Deptford, Manchester'));
assert.ok(by('CITIES').en.includes('Algiers, Amsterdam, Berne'), 'cities run onto the next page');
assert.ok(by('ANIMATE').en.startsWith('Paspalum, plantains, Dhurva grass'));
assert.ok(by('ANIMATE').en.endsWith('And success will be in store for them.'));
assert.ok(!c.sections.some((s) => /Lack of concentration give only|Railways, trams|Leo or Simha/.test(s.en)), 'no Gemini or Leo text in Cancer');
assert.ok(!c.sections.some((s) => /•\s*$/.test(s.en)), 'no bullet left at the end of a section');
console.log('test-reader-ii-sign-descriptions-cancer ok');
