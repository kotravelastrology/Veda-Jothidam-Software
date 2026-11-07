const assert = require('assert');
const { SIGN_DESCRIPTIONS } = require('./src/report/readerIISignDescriptions');

// Sagittarius, printed pp.218-229: fifteen topics, each on the printed page the book gives
const s = SIGN_DESCRIPTIONS.Sagittarius;
assert.strictEqual(s.pageFrom, 218);
assert.strictEqual(s.pageTo, 229);
assert.deepStrictEqual(s.sections.map((x) => x.id), ['PHYSICAL', 'CHARACTER', 'CORRECTION', 'HEALTH', 'FINANCE', 'DOMESTIC', 'ROMANCE', 'CHILDREN', 'LUCKY_DAY', 'LUCKY_COLOUR', 'LUCKY_NUMBER', 'ANIMATE', 'PLACES', 'COUNTRIES', 'CITIES']);
assert.deepStrictEqual(s.sections.map((x) => x.page), [220, 220, 222, 223, 223, 224, 225, 226, 227, 227, 228, 228, 228, 228, 228]);
for (const x of s.sections) {
  assert.ok(x.page >= 218 && x.page <= 229, x.id);
  assert.ok(x.en.length > 0 && x.ta.length > 0 && x.titleTa.length > 0, x.id);
}
const by = (id) => s.sections.find((x) => x.id === id);
// spot checks against the book's text, and no Scorpio or Capricorn text leaked in
assert.ok(by('PHYSICAL').en.startsWith('A well-proportioned and a well developed body'));
assert.ok(by('PHYSICAL').en.endsWith('fair complexion and handsome figure.'));
assert.ok(by('CHARACTER').en.startsWith('Sagittarius is a fiery sign.'));
assert.ok(by('CHARACTER').en.endsWith('change your opinion often.'));
assert.ok(by('CORRECTION').en.startsWith('If the ascendant or the planet in the Ascendant is afflicted'));
assert.ok(by('CORRECTION').en.endsWith('hatred towards your parents and brothers.'));
assert.ok(by('HEALTH').en.startsWith('Sagittarius governs the hips'));
assert.ok(by('HEALTH').en.endsWith('to cause fatal disease.'));
assert.ok(by('FINANCE').en.startsWith('Being a fiery sign, you do not like others ordering you'));
assert.ok(by('FINANCE').en.endsWith('gains without pains.'));
assert.ok(by('DOMESTIC').en.startsWith('You do not like your close relatives.'));
assert.ok(by('DOMESTIC').en.endsWith('the constellation of lord of 8 in the tenth house.'));
assert.ok(by('ROMANCE').en.startsWith('If you are a male, your wife should be wise and tactful.'));
assert.ok(by('ROMANCE').en.endsWith('have chances to have contact with more than one.'));
assert.ok(by('CHILDREN').en.startsWith('Houses 2, 5 and 11 indicate the birth of children.'));
assert.ok(by('CHILDREN').en.endsWith('very tactful in dealing with your children.'));
assert.ok(by('LUCKY_DAY').en.startsWith('Wednesdays and Fridays are very lucky.'));
assert.ok(by('LUCKY_COLOUR').en.startsWith('White, cream, green, orange and light blue'));
assert.strictEqual(by('LUCKY_NUMBER').en, '6, 5, 3 and 8. Of these 6 and 8 are for finance, family and fortune. Avoid 2, 7 and 9.');
assert.ok(by('ANIMATE').en.startsWith('Moolam constellation governs medicine'));
assert.ok(by('PLACES').en.startsWith('Hills, in a house the topmost room'));
assert.ok(by('COUNTRIES').en.startsWith('Australia, Arabia, Madagascar, Hungary'));
assert.ok(by('CITIES').en.startsWith('Naples, Narbonne, Stutland'));
assert.ok(!s.sections.some((x) => /Places indicated by Scorpio|Capricorn - Makaram|Capricorn is the tenth/.test(x.en)), 'no Scorpio or Capricorn text in Sagittarius');
console.log('test-reader-ii-sign-descriptions-sagittarius ok');
