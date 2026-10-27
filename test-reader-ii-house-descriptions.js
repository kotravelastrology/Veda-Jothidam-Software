const assert = require('assert');
const { HOUSE_DESCRIPTIONS: H } = require('./src/report/readerIIHouseDescriptions');

// Reader II houses, printed pp.272-344: the chapter's opening and each house as its own text, with the page its heading is on
const intro = H.INTRO;
assert.strictEqual(intro.pageFrom, 272);
assert.strictEqual(intro.pageTo, 274);
assert.ok(intro.en.startsWith('All matters are distributed among the 12 houses'));
assert.ok(intro.en.endsWith('is the 12th Bhava.'));
assert.ok(intro.ta.length > 0 && intro.titleTa.length > 0);

const first = H.First;
assert.strictEqual(first.pageFrom, 272);
assert.strictEqual(first.pageTo, 275);
assert.strictEqual(first.page, 272);
assert.ok(first.en.startsWith('Lagnam : Adya (first); Kalpa.'));
assert.ok(first.en.endsWith('relative and be worried because of the relative.'));
assert.ok(first.ta.length > 0 && first.titleTa.length > 0);
assert.ok(!first.en.includes('Second House'), 'the second house is its own entry');
assert.ok(!first.en.includes('All matters are distributed'), 'the chapter opening is its own entry');
console.log('test-reader-ii-house-descriptions ok');
