const assert = require('assert');
const { houseLordships, lordshipTable } = require('./src/chart/lordships');

// Ascendant Aries (0). Every planet in its own house, except Mercury and the Moon in each other's houses.
const plain = { Sun: 4, Moon: 3, Mars: 7, Mercury: 2, Jupiter: 8, Venus: 6, Saturn: 9 };
const rows = houseLordships(0, plain);
assert.strictEqual(rows.length, 12);
assert.deepStrictEqual(rows.map((r) => r.house), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

// House 1 is Aries, lord Mars; Mars is in Scorpio (7), the 8th from Aries, so the lord is in the 8th house.
assert.deepStrictEqual(rows[0], { house: 1, sign: 0, lord: 'Mars', lordHouse: 8, exchange: false });
// House 2 is Taurus, lord Venus in Libra (6) = house 7.
assert.strictEqual(rows[1].lord, 'Venus');
assert.strictEqual(rows[1].lordHouse, 7);
// House 3 is Gemini, lord Mercury in Gemini (own sign) = house 3, no exchange.
assert.deepStrictEqual(rows[2], { house: 3, sign: 2, lord: 'Mercury', lordHouse: 3, exchange: false });
// No row here is an exchange: no two lords sit in each other's houses.
assert.ok(rows.every((r) => r.exchange === false));

// The PL9 pattern "3 - Me in 4 *": lord of the 3rd (Mercury) in Cancer (the 4th), lord of the 4th (Moon) in Gemini (the 3rd).
const exchanged = { ...plain, Mercury: 3, Moon: 2 };
const ex = houseLordships(0, exchanged);
assert.strictEqual(ex[2].lordHouse, 4, 'house 3 lord in house 4');
assert.strictEqual(ex[3].lordHouse, 3, 'house 4 lord in house 3');
assert.strictEqual(ex[2].exchange, true, 'house 3 marked');
assert.strictEqual(ex[3].exchange, true, 'house 4 marked');
assert.strictEqual(ex.filter((r) => r.exchange).length, 2, 'only the pair is marked');

// Lagna Libra (6): the table starts from Libra, so house 1 is Libra with lord Venus.
const libra = houseLordships(6, { ...plain, Venus: 6 });
assert.strictEqual(libra[0].sign, 6);
assert.strictEqual(libra[0].lord, 'Venus');
assert.strictEqual(libra[0].lordHouse, 1, 'Venus in its own rising sign is in house 1');

// Every lord needs a placement; a missing one is an error, not a silent NaN house.
assert.throws(() => houseLordships(0, { Moon: 3 }), RangeError);

// From longitudes: the Rasi table reads each planet's sign from its longitude (Moon 65 = Gemini, Mercury 95 = Cancer).
const fromLongitudes = lordshipTable(0.5, { Moon: 65, Mercury: 95, Venus: 150, Mars: 200, Sun: 30, Jupiter: 270, Saturn: 300 }, 'D1');
assert.strictEqual(fromLongitudes.length, 12);
assert.strictEqual(fromLongitudes[2].lord, 'Mercury');
assert.strictEqual(fromLongitudes[2].lordHouse, 4, 'Mercury at 95 degrees is in Cancer, the 4th from Aries');
assert.strictEqual(fromLongitudes[3].lord, 'Moon');
assert.strictEqual(fromLongitudes[3].lordHouse, 3, 'Moon at 65 degrees is in Gemini, the 3rd');
assert.strictEqual(fromLongitudes[2].exchange, true, 'the same exchange as above, read from longitudes');

// A divisional table has the same shape and every lordHouse is a house number.
const navamsha = lordshipTable(0.5, { Moon: 65, Mercury: 95, Venus: 150, Mars: 200, Sun: 30, Jupiter: 270, Saturn: 300 }, 'D9');
assert.strictEqual(navamsha.length, 12);
assert.ok(navamsha.every((r) => Number.isInteger(r.lordHouse) && r.lordHouse >= 1 && r.lordHouse <= 12));

console.log('test-lordships: all assertions passed');
