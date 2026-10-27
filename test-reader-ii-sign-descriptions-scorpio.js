const assert = require('assert');
const { SIGN_DESCRIPTIONS } = require('./src/report/readerIISignDescriptions');

// Scorpio, printed pp.207-217: twelve topics, each on the printed page the book gives
const s = SIGN_DESCRIPTIONS.Scorpio;
assert.strictEqual(s.pageFrom, 207);
assert.strictEqual(s.pageTo, 217);
assert.deepStrictEqual(s.sections.map((x) => x.id), ['PHYSICAL', 'CHARACTER', 'CORRECTION', 'HEALTH', 'FINANCE', 'DOMESTIC', 'ROMANCE', 'CHILDREN', 'LUCKY_DAY', 'LUCKY_COLOUR', 'LUCKY_NUMBER', 'ANIMATE']);
assert.deepStrictEqual(s.sections.map((x) => x.page), [208, 208, 211, 211, 212, 212, 214, 216, 216, 217, 217, 217]);
for (const x of s.sections) {
  assert.ok(x.page >= 207 && x.page <= 217, x.id);
  assert.ok(x.en.length > 0 && x.ta.length > 0 && x.titleTa.length > 0, x.id);
}
const by = (id) => s.sections.find((x) => x.id === id);
// spot checks against the book's text, and no Libra or Sagittarius text leaked in
assert.ok(by('PHYSICAL').en.startsWith('The body will be well proportioned'));
assert.ok(by('PHYSICAL').en.endsWith('They have good personality.'));
assert.ok(by('CHARACTER').en.startsWith('Scorpio is a fixed sign'));
assert.ok(by('CHARACTER').en.endsWith('Then you will be revengeful and relentless.'));
assert.ok(by('CORRECTION').en.startsWith('Do not pass sarcastic remarks.'));
assert.ok(by('CORRECTION').en.endsWith('if thebad side of scorpio dominates.'));
assert.ok(by('HEALTH').en.startsWith('Scorpio governs the generative organs'));
assert.ok(by('HEALTH').en.endsWith('[6th house disease ; 2, 7 and 8 danger].'));
assert.ok(by('FINANCE').en.startsWith('Scorpio indicates chemistry, medicine'));
assert.ok(by('FINANCE').en.endsWith('They are extravagant.'));
assert.ok(by('DOMESTIC').en.startsWith('For your jolly good life'));
assert.ok(by('DOMESTIC').en.endsWith('Yet observe this very strictly.'));
assert.ok(by('ROMANCE').en.startsWith('Scorpio-barns have complex moods.'));
assert.ok(by('ROMANCE').en.endsWith('They will appreciate the qualities of their wives.'));
assert.ok(by('CHILDREN').en.startsWith('Jupiter rules the houses 2 and 5'));
assert.ok(by('CHILDREN').en.endsWith('be not only intelligent but also lucky.'));
assert.ok(by('LUCKY_DAY').en.startsWith('Sundays, Mondays, Tuesdays, and Thursday are successful days'));
assert.ok(by('LUCKY_DAY').en.endsWith('avoid commitments on Fridays.'));
assert.ok(by('LUCKY_COLOUR').en.startsWith('Yellow, red, orange, cream are favourable.'));
assert.strictEqual(by('LUCKY_NUMBER').en, '3, 9, 4, 1, 2 and 7 are in this order, lucky to you. Avoid 5, 6 and 8.');
assert.ok(by('ANIMATE').en.startsWith('Explosives, bombs, crackers, knives'));
assert.ok(by('ANIMATE').en.endsWith('linseed and mustard.'));
assert.ok(!s.sections.some((x) => /Johannesburg and Gaeta|Sagittarius-Dhanus|Libra - Thulam|Scorpio or Vrischika/.test(x.en)), 'no Libra or Sagittarius text in Scorpio');
console.log('test-reader-ii-sign-descriptions-scorpio ok');
