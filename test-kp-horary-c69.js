const assert = require('assert');
const H = require('./src/report/kpHorary');
const T = require('./src/report/kpHoraryTopics');
const { C69_TOPICS, C69_SOURCE } = require('./src/report/kpHoraryC69');

// the two KP-Ezine entries (C69, "Matters Controlled by BHAVAS", Kuppu Ganapathi, printed pp.8-9)
assert.deepStrictEqual(C69_TOPICS.map((q) => q.id), ['LOST_PROPERTY_C69', 'PARTICULAR_PARTNER_C69']);
assert.strictEqual(C69_SOURCE.title, 'Compilation of Articles Published in KP-Ezine, Series 1');
assert.strictEqual(C69_SOURCE.author, 'Kuppu Ganapathi');

// the lost-property line under the Seventh Bhava: Lagna = owner, IV = place, VII = thief, VIII = details
const lost = T.BY_ID.LOST_PROPERTY_C69;
assert.deepStrictEqual(lost.houses, [1, 4, 7, 8]);
assert.strictEqual(lost.page, 8);
assert.strictEqual(lost.rules.length, 0, 'the book states no condition for it');
assert.ok(lost.citation.endsWith('ப.8'), lost.citation);
assert.ok(lost.citation.includes('Kuppu Ganapathi'), lost.citation);

// the Eighth Bhava line: the sub-lord of the 8th cusp signifies 5 and 11 (both)
const partner = T.BY_ID.PARTICULAR_PARTNER_C69;
assert.deepStrictEqual(partner.houses, [5, 8, 11]);
assert.strictEqual(partner.page, 9);
assert.ok(partner.citation.endsWith('ப.9'), partner.citation);
assert.strictEqual(partner.rules.length, 1);

// the condition on a made-up chart: the 8th cusp's sub-lord (Venus) signifies both 5 and 11
const mk = (sub8, sig) => ({
  cusps: Array.from({ length: 12 }, (_, i) => ({ number: i + 1, sign: 'Aries', sub: i === 7 ? sub8 : 'Mars', starLord: 'Sun' })),
  positions: [{ name: 'Sun', starLord: 'Sun', retrograde: false }],
  houseSignificators: Array.from({ length: 12 }, (_, i) => ({ house: i + 1, level1: sig[i + 1] ?? [], level2: [], level3: [], level4: [] })),
  obstruction: { badhaka: 11, maraka: [2, 7] },
});
assert.strictEqual(T.evaluateRule(mk('Venus', { 5: ['Venus'], 11: ['Venus'] }), partner.rules[0]).status, 'HELD');
assert.strictEqual(T.evaluateRule(mk('Venus', { 5: ['Venus'] }), partner.rules[0]).status, 'NOT_HELD', 'Venus signifies 5 but not 11');
assert.strictEqual(T.evaluateRule(mk('Sun', { 5: ['Venus'], 11: ['Venus'] }), partner.rules[0]).status, 'NOT_HELD', 'the 8th sub-lord is Sun');

// both entries evaluate on a real horary chart
const c = H.horaryChart({ number: 77, year: 2026, month: 9, day: 18, hour: 8, minute: 0, utcOffsetMinutes: 330, latitude: 13.0827, longitude: 80.2707 });
const a = T.analyseTopic(c.kp, c.ruling, 'LOST_PROPERTY_C69');
assert.deepStrictEqual(a.cusps.map((x) => x.house), [1, 4, 7, 8]);
assert.strictEqual(a.rules.length, 0);
const b = T.analyseTopic(c.kp, c.ruling, 'PARTICULAR_PARTNER_C69');
assert.deepStrictEqual(b.cusps.map((x) => x.house), [5, 8, 11]);
assert.ok(['HELD', 'NOT_HELD'].includes(b.rules[0].status));

console.log('test-kp-horary-c69 ok');
