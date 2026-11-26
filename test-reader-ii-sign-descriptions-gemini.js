const assert = require('assert');
const { SIGN_DESCRIPTIONS } = require('./src/report/readerIISignDescriptions');

// Gemini, printed pp.138-151: nineteen topics, each on the printed page the book gives
const g = SIGN_DESCRIPTIONS.Gemini;
assert.strictEqual(g.pageFrom, 138);
assert.strictEqual(g.pageTo, 151);
assert.deepStrictEqual(g.sections.map((s) => s.id), ['PHYSICAL', 'CHARACTER', 'WEAKNESS', 'HEALTH', 'FINANCE', 'PROFESSION', 'DOMESTIC', 'ROMANCE', 'CHILDREN', 'HANDWRITING', 'LUCKY_DAY', 'LUCKY_COLOUR', 'LUCKY_NUMBER', 'LUCKY_STONE', 'PLACES', 'COUNTRIES', 'CITIES', 'ANIMATE', 'CORRECTION']);
assert.deepStrictEqual(g.sections.map((s) => s.page), [139, 139, 142, 143, 143, 144, 146, 147, 149, 149, 149, 150, 150, 150, 150, 150, 150, 150, 151]);
for (const s of g.sections) {
  assert.ok(s.page >= 138 && s.page <= 151, s.id);
  assert.ok(s.en.length > 0 && s.ta.length > 0 && s.titleTa.length > 0, s.id);
}
const by = (id) => g.sections.find((s) => s.id === id);
// spot checks against the book's text, and no Taurus text leaked into Gemini
assert.ok(by('PHYSICAL').en.startsWith('Gemini gives a tall, upright, straight body'));
assert.ok(by('HEALTH').en.includes('Scorpio : Gemini-borns may complain of straniury'));
assert.ok(by('ROMANCE').en.endsWith('comes to an end in fireworks.'));
assert.strictEqual(by('HANDWRITING').en.startsWith('Gemini-barns will write a little above the line'), true);
assert.strictEqual(by('LUCKY_COLOUR').en, 'Green and Yellow. Avoid Blue and Red.');
assert.strictEqual(by('LUCKY_NUMBER').en, 'Five and Three, Fourteen, Twelve, etc.');
assert.strictEqual(by('LUCKY_STONE').en, 'Emerald and Yellow sapphire.');
assert.ok(by('PLACES').en.startsWith('Walls, plastering, coffers'));
assert.ok(by('COUNTRIES').en.startsWith('The West of England'));
assert.ok(by('CITIES').en.startsWith('London, Versailles, Nuremburg'));
assert.ok(!g.sections.some((s) => /For instance, Mars and Mercury|Saturn and Mercury give/.test(s.en)), 'no Taurus correction text in Gemini');
assert.ok(by('ANIMATE').en.endsWith('all commodities of green colour.'));
assert.ok(by('CORRECTION').en.startsWith('Lack of concentration give only'));
assert.ok(by('CORRECTION').en.endsWith('easily influenced.'));
assert.ok(!g.sections.some((s) => /Amsterdam, Berne|Cancer - Katakam/.test(s.en)), 'no Cancer text in Gemini');
console.log('test-reader-ii-sign-descriptions-gemini ok');
