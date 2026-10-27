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

const second = H.Second;
assert.strictEqual(second.pageFrom, 275);
assert.strictEqual(second.pageTo, 280);
assert.strictEqual(second.page, 275);
assert.ok(second.en.startsWith('Artha (wealth); Bhukthl (food'));
assert.ok(second.en.endsWith('the malefics occupy the second house of the native.'));
assert.ok(second.ta.length > 0 && second.titleTa.length > 0);
assert.ok(!second.en.includes('Thi rd House') && !second.en.includes('Third House'), 'the third house is its own entry');
assert.ok(!second.en.includes('relative and be worried'), 'the first house is its own entry');
const third = H.Third;
assert.strictEqual(third.pageFrom, 280);
assert.strictEqual(third.pageTo, 284);
assert.strictEqual(third.page, 280);
assert.ok(third.en.startsWith('Dhairya (courage, firmness)'));
assert.ok(third.en.endsWith("who would have caused loss to the native's mother."));
assert.ok(third.ta.length > 0 && third.titleTa.length > 0);
assert.ok(!third.en.includes('Fourth House'), 'the fourth house is its own entry');
assert.ok(!third.en.includes('Artha (wealth)'), 'the second house is its own entry');
const fourth = H.Fourth;
assert.strictEqual(fourth.pageFrom, 284);
assert.strictEqual(fourth.pageTo, 287);
assert.strictEqual(fourth.page, 284);
assert.ok(fourth.en.startsWith('Graha (house); Vesma (home)'));
assert.ok(fourth.en.endsWith('their children etc., are also shown by the 4th house.'));
assert.ok(fourth.ta.length > 0 && fourth.titleTa.length > 0);
assert.ok(!fourth.en.includes('Fifth House'), 'the fifth house is its own entry');
assert.ok(!fourth.en.includes('who would have caused loss'), 'the third house is its own entry');
console.log('test-reader-ii-house-descriptions ok');
