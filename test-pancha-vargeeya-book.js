const assert = require('assert');
const B = require('./src/report/panchaVargeeyaBook');

// every sign's hadda bands total 30 degrees
for (const [i, row] of B.HADDA.entries()) assert.strictEqual(row.reduce((s, b) => s + b[1], 0), 30, `hadda of sign ${i}`);
// the three signs whose printed digits do not total 30 (printed p.8) and the verse figures used
assert.deepStrictEqual(Object.keys(B.HADDA_PRINT_DIFFERS), ['2', '7', '11']);
const PRINTED_TOTAL = { 2: 32, 7: 32, 11: 27 };
for (const [sign, [planet, printed, used]] of Object.entries(B.HADDA_PRINT_DIFFERS)) {
  const band = B.HADDA[sign].find((b) => b[0] === planet)[1];
  assert.strictEqual(band, used);
  assert.strictEqual(30 - used + printed, PRINTED_TOTAL[sign], `printed total of sign ${sign}`);
}
// hadda lords: Aries Jupiter 0-6, Venus 6-12, Saturn 25-30; Virgo (book) Venus 7-13, Jupiter 13-17, Saturn 24-30
const at = (sign, deg) => sign * 30 + deg;
assert.strictEqual(B.haddaLord(at(0, 0)), 'Jupiter');
assert.strictEqual(B.haddaLord(at(0, 6)), 'Venus');
assert.strictEqual(B.haddaLord(at(0, 29.9)), 'Saturn');
assert.strictEqual(B.haddaLord(at(5, 12.9)), 'Venus');
assert.strictEqual(B.haddaLord(at(5, 15)), 'Jupiter', 'Virgo 13-17 is Jupiter in the book (Venus in the Egyptian terms)');
assert.strictEqual(B.haddaLord(at(5, 25)), 'Saturn');
assert.strictEqual(B.haddaLord(at(11, 20)), 'Mars', 'Pisces Mars 19-28');

// drekkana table (printed p.8): first, second and third drekkana lords of Aries..Pisces
const T = { Ma: 'Mars', Me: 'Mercury', Ju: 'Jupiter', Ve: 'Venus', Sa: 'Saturn', Su: 'Sun', Mo: 'Moon' };
const rows = [
  'Ma Me Ju Ve Sa Su Mo Ma Me Ju Ve Sa',
  'Su Mo Ma Me Ju Ve Sa Su Mo Ma Me Ju',
  'Ve Sa Su Mo Ma Me Ju Ve Sa Su Mo Ma',
].map((r) => r.split(' ').map((x) => T[x]));
for (let part = 0; part < 3; part += 1) for (let sign = 0; sign < 12; sign += 1) {
  assert.strictEqual(B.drekkanaLord(sign * 30 + part * 10 + 5), rows[part][sign], `drekkana ${part + 1} of sign ${sign}`);
}
// mushallaha table (printed p.9): the same three lords for the four signs of each triplicity
assert.deepStrictEqual(B.MUSHALLAHA[0], ['Sun', 'Jupiter', 'Saturn']);
assert.deepStrictEqual(B.MUSHALLAHA[0], B.MUSHALLAHA[4]);
assert.deepStrictEqual(B.MUSHALLAHA[3], ['Venus', 'Mars', 'Moon']);
assert.strictEqual(B.mushallahaLord(at(1, 15)), 'Moon');

// v.32-33: own place 30/15/10/5 and exaltation 20; friend three quarters, neutral a half, enemy a quarter
assert.deepStrictEqual({ ...B.WEIGHT }, { kshetra: 30, uchcha: 20, hadda: 15, drekkana: 10, mushallaha: 5 });
// the Sun at Aries 5 degrees: Aries (Mars, friend) 22.5, exalted 20, hadda Jupiter (friend) 11.25, drekkana Mars (friend) 7.5, mushallaha Sun (own) 5
const s = B.panchaVargeeyaBook('Sun', at(0, 5));
assert.deepStrictEqual(Object.fromEntries(Object.entries(s.parts).map(([k, v]) => [k, v.points])), { kshetra: 22.5, uchcha: 20, hadda: 11.25, drekkana: 7.5, mushallaha: 5 });
assert.strictEqual(s.total, 66.25);
// Mars exalted in Capricorn; the Moon in her own sign Cancer gets 30 for the house
assert.strictEqual(B.panchaVargeeyaBook('Mars', at(9, 20.5)).parts.uchcha.points, 20);
assert.strictEqual(B.panchaVargeeyaBook('Moon', at(3, 1)).parts.kshetra.points, 30);
assert.throws(() => B.panchaVargeeyaBook('Rahu', 10), /seven planets/);
console.log('test-pancha-vargeeya-book ok');
