const assert = require('node:assert/strict');
const { naturalRelation, temporaryRelation, compoundRelationship } = require('./src/chart/planetaryRelationship');

// Natural relationship (v.55): spot-check the book's own printed table.
assert.equal(naturalRelation('Sun', 'Moon'), 'friend');
assert.equal(naturalRelation('Sun', 'Saturn'), 'enemy');
assert.equal(naturalRelation('Sun', 'Mercury'), 'neutral');
assert.equal(naturalRelation('Moon', 'Mars'), 'neutral', 'Moon has no natural enemy per BPHS');
assert.equal(naturalRelation('Saturn', 'Jupiter'), 'neutral');
assert.equal(naturalRelation('Saturn', 'Mars'), 'enemy');
assert.equal(naturalRelation('Saturn', 'Venus'), 'friend');

// Worked examples straight from the chapter's own text (v.55 Notes): Mars's
// Moolatrikona is Aries; Saturn rules the 11th from Aries (enemy by count)
// but also rules Mars's exaltation sign (friend by the exaltation-lord rule)
// -- BPHS's natural-relationship table already folds this into "neutral".
assert.equal(naturalRelation('Mars', 'Saturn'), 'neutral');
// Venus rules the 2nd (friend) and 7th (enemy) from Aries -> neutral too.
assert.equal(naturalRelation('Mars', 'Venus'), 'neutral');

// Temporary relationship (v.56): 2/3/4/10/11/12 signs apart = friend, else enemy.
assert.equal(temporaryRelation(0, 1), 'friend'); // 2nd from Aries
assert.equal(temporaryRelation(0, 3), 'friend'); // 4th from Aries
assert.equal(temporaryRelation(0, 9), 'friend'); // 10th from Aries
assert.equal(temporaryRelation(0, 0), 'enemy'); // same sign (1st) -> enemy
assert.equal(temporaryRelation(0, 4), 'enemy'); // 5th from Aries
assert.equal(temporaryRelation(0, 6), 'enemy'); // 7th from Aries

// Compound relationship (v.57-58): the book's own stated combinations.
assert.equal(compoundRelationship('Sun', 'Sun', { Sun: 0 }), 'own');
// Sun natural friend with Moon; place them 2nd apart (temporary friend) -> great friend.
assert.equal(compoundRelationship('Sun', 'Moon', { Sun: 0, Moon: 1 }), 'greatFriend');
// Sun natural friend with Moon; place them 1st (same sign, temporary enemy) -> friend+enemy = neutral.
assert.equal(compoundRelationship('Sun', 'Moon', { Sun: 0, Moon: 0 }), 'neutral');
// Sun natural enemy with Saturn; same sign (temporary enemy too) -> great enemy.
assert.equal(compoundRelationship('Sun', 'Saturn', { Sun: 0, Saturn: 0 }), 'greatEnemy');
// Sun natural enemy with Saturn; 2nd apart (temporary friend) -> enemy+friend = neutral.
assert.equal(compoundRelationship('Sun', 'Saturn', { Sun: 0, Saturn: 1 }), 'neutral');
// Sun natural neutral with Mercury; 2nd apart (temporary friend) -> neutral+friend = friend.
assert.equal(compoundRelationship('Sun', 'Mercury', { Sun: 0, Mercury: 1 }), 'friend');
// Sun natural neutral with Mercury; same sign (temporary enemy) -> neutral+enemy = enemy.
assert.equal(compoundRelationship('Sun', 'Mercury', { Sun: 0, Mercury: 0 }), 'enemy');

console.log(JSON.stringify({ pass: true }, null, 2));
