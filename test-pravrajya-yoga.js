/**
 * The yogas leading to asceticism, BPHS ch.79 (src/report/pravrajyaYoga.js, fixture bphs-79.json): the fixture's shape, each rule on charts worked by hand.
 */
const assert = require('node:assert/strict');
const Y = require('./src/report/pravrajyaYoga');

const IDS = ['STELLIUM', 'COMBUST', 'MOON_LORD_ASPECTS_SATURN', 'MOON_LORD_WEAK', 'MOON_SATURN_DIV', 'WAR', 'ORDER_BY_DASHA', 'JUPITER_NINTH', 'SATURN_NINTH'];

// the fixture: nine rules in the chapter's order, pages 948-952, the seven orders
assert.ok(Y.DATA.source.title && Y.DATA.source.pageLocus && Y.DATA.scope);
assert.deepEqual(Y.DATA.rules.map((r) => r.id), IDS);
assert.deepEqual(Object.keys(Y.DATA.orders), Y.PLANETS);
for (const r of Y.DATA.rules) {
  const [a, b] = r.page.split('-').map(Number);
  assert.ok(a >= 948 && (b ?? a) <= 952 && r.verses && r.ta.length > 20, r.id);
}
assert.ok(Y.DATA.rules.filter((r) => r.reason).map((r) => r.id).join() === 'COMBUST,MOON_LORD_WEAK,WAR,ORDER_BY_DASHA');

// aspects by signs: the 7th for all; Mars 4 and 8, Jupiter 5 and 9, Saturn 3 and 10
assert.equal(Y.houseFrom(0, 0), 1);
assert.equal(Y.houseFrom(11, 0), 2);
assert.ok(Y.aspects('Sun', 0, 6) && !Y.aspects('Sun', 0, 3) && !Y.aspects('Sun', 0, 0));
assert.ok(Y.aspects('Mars', 0, 3) && Y.aspects('Mars', 0, 7) && Y.aspects('Mars', 0, 6) && !Y.aspects('Mars', 0, 4));
assert.ok(Y.aspects('Jupiter', 0, 4) && Y.aspects('Jupiter', 0, 8) && !Y.aspects('Jupiter', 0, 3));
assert.ok(Y.aspects('Saturn', 0, 2) && Y.aspects('Saturn', 0, 9) && Y.aspects('Saturn', 0, 6) && !Y.aspects('Saturn', 0, 4));
// the Parashari decanate: the sign, its 5th, its 9th
assert.deepEqual([5, 15, 25].map((d) => Y.drekkanaSign(d)), [0, 4, 8]);
assert.deepEqual([35, 45, 55].map((d) => Y.drekkanaSign(d)), [1, 5, 9]);

// a chart that holds nothing: the planets spread over the signs
const facts = (signs, over = {}) => ({ signs: { Sun: 0, Moon: 1, Mars: 2, Mercury: 5, Jupiter: 7, Venus: 9, Saturn: 11, ...signs }, lagnaSign: 0, moonLongitude: 35, wars: [], ...over });
const run = (f) => Object.fromEntries(Y.evaluate(f).map((r) => [r.id, r]));
const none = run(facts({}));
assert.deepEqual(Y.evaluate(facts({})).map((r) => r.id), IDS);
assert.equal(none.STELLIUM.status, 'not-held');
assert.equal(none.COMBUST.status, 'not-checked');
assert.equal(none.ORDER_BY_DASHA.status, 'not-checked');
assert.equal(none.WAR.status, 'not-held');
assert.ok(/இல்லை/.test(none.WAR.detail));

// v.2-3: four or more of the seven in one house; strength is not checked, so the result is partial and no planet is chosen
const four = run(facts({ Sun: 4, Moon: 4, Mars: 4, Mercury: 4 }));
assert.equal(four.STELLIUM.status, 'unknown');
assert.deepEqual(four.STELLIUM.orders, ['Sun', 'Moon', 'Mars', 'Mercury']);
assert.equal(run(facts({ Sun: 4, Moon: 4, Mars: 4 })).STELLIUM.status, 'not-held');
const two = run(facts({ Sun: 4, Moon: 4, Mars: 4, Mercury: 4, Jupiter: 8, Venus: 8, Saturn: 8 }));
assert.equal(two.STELLIUM.status, 'unknown');
assert.deepEqual(two.STELLIUM.orders, ['Sun', 'Moon', 'Mars', 'Mercury'], 'a group of four and a group of three: only the four count');

// v.6: the lord of the Moon's sign, aspected by no one, aspects Saturn: the Moon in Pisces, Jupiter its lord in Pisces, Saturn in Cancer (the 5th from Jupiter)
const v6 = run(facts({ Sun: 0, Moon: 11, Mars: 1, Mercury: 2, Jupiter: 11, Venus: 9, Saturn: 3 }, { moonLongitude: 345 }));
assert.equal(v6.MOON_LORD_ASPECTS_SATURN.status, 'held');
assert.deepEqual(v6.MOON_LORD_ASPECTS_SATURN.orders, ['Jupiter', 'Saturn']);
// a planet that aspects the lord stops it: Mars in Virgo's... the 7th from Pisces is Virgo
assert.equal(run(facts({ Sun: 0, Moon: 11, Mars: 1, Mercury: 5, Jupiter: 11, Venus: 9, Saturn: 3 }, { moonLongitude: 345 })).MOON_LORD_ASPECTS_SATURN.status, 'not-held');
// the Moon in Aquarius: its lord is Saturn himself
assert.equal(run(facts({ Moon: 10 }, { moonLongitude: 315 })).MOON_LORD_ASPECTS_SATURN.status, 'not-held');

// v.7: the lord aspected by Saturn alone (Saturn in Virgo, the 7th from Pisces)
const v7 = run(facts({ Sun: 0, Moon: 11, Mars: 1, Mercury: 2, Jupiter: 11, Venus: 9, Saturn: 5 }, { moonLongitude: 345 }));
assert.equal(v7.MOON_LORD_WEAK.status, 'unknown');
assert.deepEqual(v7.MOON_LORD_WEAK.orders, ['Saturn']);
assert.equal(v7.MOON_LORD_ASPECTS_SATURN.status, 'not-held', 'Saturn aspects the lord, so the lord is not unaspected');
assert.equal(v6.MOON_LORD_WEAK.status, 'not-held');

// v.8: the Moon at 5 degrees of Taurus is in the Navamsha of Aquarius (Saturn); Saturn in Scorpio aspects Taurus
const v8 = run(facts({ Moon: 1, Saturn: 7 }, { moonLongitude: 35 }));
assert.equal(v8.MOON_SATURN_DIV.status, 'held');
assert.deepEqual(v8.MOON_SATURN_DIV.orders, ['Saturn']);
assert.equal(run(facts({ Moon: 1, Saturn: 6 }, { moonLongitude: 35 })).MOON_SATURN_DIV.status, 'not-held', 'Saturn must aspect the Moon');
// the Moon at 1 degree of Taurus is in the Navamsha of Capricorn (Saturn's), at 8 degrees in that of Pisces (Jupiter's)
assert.equal(run(facts({ Moon: 1, Saturn: 7 }, { moonLongitude: 31 })).MOON_SATURN_DIV.status, 'held');
assert.equal(run(facts({ Moon: 1, Saturn: 7 }, { moonLongitude: 38 })).MOON_SATURN_DIV.status, 'not-held');
// the Moon at 15 degrees of Aries is in the decanate of Leo and the Navamsha of Cancer: not Saturn's
assert.equal(run(facts({ Moon: 0, Saturn: 6 }, { moonLongitude: 15 })).MOON_SATURN_DIV.status, 'not-held');

// v.9: wars are shown as given
const war = run(facts({}, { wars: [['Mars', 'Venus', 'Venus']] }));
assert.equal(war.WAR.status, 'unknown');
assert.ok(/வெல்கிறார்/.test(war.WAR.detail));

// v.14: Saturn in Libra aspects Jupiter in Sagittarius (3rd), the Lagna Aries (7th) and the Moon in Cancer (10th); Jupiter is the 9th from Aries
const v14 = run(facts({ Saturn: 6, Jupiter: 8, Moon: 3 }, { moonLongitude: 95 }));
assert.equal(v14.JUPITER_NINTH.status, 'held');
assert.equal(run(facts({ Saturn: 6, Jupiter: 8, Moon: 4 }, { moonLongitude: 125 })).JUPITER_NINTH.status, 'not-held');
assert.equal(run(facts({ Saturn: 6, Jupiter: 4, Moon: 3 }, { moonLongitude: 95 })).JUPITER_NINTH.status, 'not-held');

// v.15: Saturn in Sagittarius (the 9th) with nothing aspecting it
const v15 = run(facts({ Sun: 9, Moon: 10, Mars: 10, Mercury: 11, Jupiter: 11, Venus: 9, Saturn: 8 }, { moonLongitude: 315 }));
assert.equal(v15.SATURN_NINTH.status, 'held');
assert.equal(run(facts({ Sun: 9, Moon: 10, Mars: 10, Mercury: 11, Jupiter: 11, Venus: 2, Saturn: 8 }, { moonLongitude: 315 })).SATURN_NINTH.status, 'not-held', 'Venus in Gemini aspects Sagittarius (7th)');
assert.equal(run(facts({ Saturn: 7 })).SATURN_NINTH.status, 'not-held');

for (const r of Y.evaluate(facts({}))) assert.ok(r.detail.length > 3 && !/undefined|NaN/.test(r.detail), r.id);
console.log('test-pravrajya-yoga: all assertions passed');
