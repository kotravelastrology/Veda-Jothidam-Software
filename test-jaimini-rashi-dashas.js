const assert = require('assert');
const J = require('./src/dasha/jaiminiRashiDashas');

// Table 2.7 of Rath's Narayana Dasa (printed p.208): the twelve signs in order for each starting sign (1 = Aries).
const TABLE_2_7 = [
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  [2, 9, 4, 11, 6, 1, 8, 3, 10, 5, 12, 7],
  [3, 11, 7, 6, 2, 10, 9, 5, 1, 12, 8, 4],
  [4, 3, 2, 1, 12, 11, 10, 9, 8, 7, 6, 5],
  [5, 10, 3, 8, 1, 6, 11, 4, 9, 2, 7, 12],
  [6, 10, 2, 3, 7, 11, 12, 4, 8, 9, 1, 5],
  [7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6],
  [8, 3, 10, 5, 12, 7, 2, 9, 4, 11, 6, 1],
  [9, 5, 1, 12, 8, 4, 3, 11, 7, 6, 2, 10],
  [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 12, 11],
  [11, 4, 9, 2, 7, 12, 5, 10, 3, 8, 1, 6],
  [12, 4, 8, 9, 1, 5, 6, 10, 2, 3, 7, 11],
];
const mism = [];
TABLE_2_7.forEach((row, i) => {
  const got = J.narayanaOrder(i).map((s) => s + 1);
  row.forEach((v, k) => { if (got[k] !== v) mism.push(`row ${i + 1} col ${k + 1}: printed ${v}, rule ${got[k]}`); });
});
// the printed rows follow the rule except where listed here
assert.deepStrictEqual(mism, [], mism.join('\n'));

// Table 1.9 (printed p.20): Rajiv Gandhi's chart — lagna Leo; Sun, Moon, Mercury, Venus, Jupiter in Leo; Mars Virgo;
// Saturn Gemini; Rahu Cancer; Ketu Capricorn. Degrees from p.17 (Rahu 4°25').
const signs = { Sun: 4, Moon: 4, Mercury: 4, Venus: 4, Jupiter: 4, Mars: 5, Saturn: 2, Rahu: 3, Ketu: 9 };
const degrees = { Sun: 3 + 50 / 60, Moon: 17.5, Mars: 1.2, Mercury: 28 + 34 / 60, Jupiter: 12.2, Venus: 18 + 39 / 60, Saturn: 14 + 13 / 60, Rahu: 4 + 25 / 60, Ketu: 4 + 25 / 60 };
const chart = { signs, degrees, lagnaSign: 4 };
assert.strictEqual(J.atmakaraka(degrees), 'Mercury');
const printed = [5, 3, 2, 11, 12, 1, 10, 2, 8, 7, 8, 7];
const years = Array.from({ length: 12 }, (_, s) => J.signYears(s, chart).years);
assert.deepStrictEqual(years, printed);
assert.strictEqual(J.signYears(7, chart).lord, 'Ketu', 'Scorpio: Ketu in Capricorn is joined by the aspects of Mercury and Jupiter; Mars in Virgo is not');
assert.strictEqual(J.signYears(10, chart).lord, 'Saturn', 'Aquarius: Saturn in a dual sign');

// Chara: lagna Leo, 9th sign Aries is odd-footed: forward from Leo.
const c = J.jaiminiChara(chart);
assert.strictEqual(c.forward, true);
assert.deepStrictEqual(c.periods.map((p) => p.sign), [4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3]);

// Narayana from this chart: the stronger of Leo (five planets) and Aquarius (none) is Leo; Leo's order is Table 2.7 row 5.
const n = J.narayana(chart);
assert.strictEqual(n.start, 4);
assert.deepStrictEqual(n.periods.map((p) => p.sign + 1), TABLE_2_7[4]);

// A lord in its own sign gives 12; exalted adds a year.
assert.strictEqual(J.signYears(4, chart).years, 12);
const ex = { signs: { ...signs, Mars: 9 }, degrees, lagnaSign: 4 };
assert.strictEqual(J.signYears(0, ex).years, 10, 'Aries: Mars exalted in Capricorn: nine signs counted forward, less one, plus one');

console.log('test-jaimini-rashi-dashas ok');
