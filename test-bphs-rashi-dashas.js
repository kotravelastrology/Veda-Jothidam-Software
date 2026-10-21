const assert = require('assert');
const R = require('./src/dasha/bphsRashiDashas');

// The book's worked chart (BPHS Santhanam Vol.2 printed p.558): sign index, degree within the sign.
const POS = {
  Sun: [9, 29 + 36 / 60], Moon: [2, 22 + 6 / 60], Mars: [1, 0 + 56 / 60], Mercury: [10, 13 + 6 / 60], Jupiter: [10, 13 + 41 / 60],
  Venus: [10, 20 + 4 / 60], Saturn: [7, 13 + 24 / 60], Rahu: [2, 13 + 55 / 60],
};
const signs = Object.fromEntries(Object.entries(POS).map(([p, [s]]) => [p, s]));
signs.Ketu = (signs.Rahu + 6) % 12;
const degrees = Object.fromEntries(Object.entries(POS).map(([p, [, d]]) => [p, d]));
degrees.Ketu = degrees.Rahu;
const chart = { signs, degrees, lagnaSign: 10 };
const NAMES = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const byName = (r) => Object.fromEntries(r.periods.map((p) => [NAMES[p.sign], p.years]));

// Chara: order from Aquarius onward (9th sign Libra is an odd pada), printed p.556 table.
const chara = R.chara(chart);
assert.strictEqual(chara.forward, true);
assert.deepStrictEqual(chara.periods.map((p) => NAMES[p.sign]), ['Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn']);
const printedChara = { Aquarius: 8, Pisces: 1, Aries: 1, Taurus: 9, Gemini: 8, Cancer: 1, Leo: 7, Virgo: 7, Libra: 4, Scorpio: 6, Sagittarius: 2, Capricorn: 5 };
const got = byName(chara);
const mismatches = Object.keys(printedChara).filter((k) => got[k] !== printedChara[k]);
// the rule gives Scorpio 1 (Ketu's dual sign is stronger than Mars's fixed one) and Capricorn 2 (the Yogardha table
// printed on p.560 uses 2 too: (2+7)/2 = 4½), against the printed Chara cells 6 and 5.
assert.deepStrictEqual(mismatches, ['Scorpio', 'Capricorn']);
assert.strictEqual(got.Scorpio, 1);
assert.strictEqual(got.Capricorn, 2);
assert.strictEqual(got.Aquarius, 8, 'Aquarius: Rahu (with the Moon) is stronger than Saturn, counted backward');

// Sthira: Brahma Graha = Mercury in Aquarius (printed p.559); 7/8/9 by kind, forward from Aquarius.
const sthira = R.sthira(chart);
assert.strictEqual(sthira.detail.planet, 'Mercury');
assert.strictEqual(NAMES[sthira.start], 'Aquarius');
const printedSthira = { Aquarius: 8, Pisces: 9, Aries: 7, Taurus: 8, Gemini: 9, Cancer: 7, Leo: 8, Virgo: 9, Libra: 7, Scorpio: 8, Sagittarius: 9, Capricorn: 7 };
assert.deepStrictEqual(byName(sthira), printedSthira);

// Yogardha: half of Chara + Sthira from Aquarius; printed p.560 table.
const yog = byName(R.yogardha(chart));
const printedYog = { Aquarius: 8, Pisces: 5, Aries: 4, Taurus: 8.5, Gemini: 8.5, Cancer: 4, Leo: 8, Virgo: 8, Libra: 5.5, Scorpio: 7, Sagittarius: 5.5, Capricorn: 4.5 };
const yogMis = Object.keys(printedYog).filter((k) => yog[k] !== printedYog[k]);
// Scorpio agrees only with the printed Chara 6 ((6+8)/2); Leo prints 8 where (7+8)/2 = 7½.
assert.deepStrictEqual(yogMis, ['Leo', 'Scorpio']);
assert.strictEqual(yog.Capricorn, 4.5);
assert.strictEqual(yog.Leo, 7.5);

// Mandooka: Aquarius, then every third sign; fixed, dual, movable (printed p.564).
const man = R.mandooka(chart);
assert.deepStrictEqual(man.periods.map((p) => NAMES[p.sign]), ['Aquarius', 'Taurus', 'Leo', 'Scorpio', 'Pisces', 'Gemini', 'Virgo', 'Sagittarius', 'Aries', 'Cancer', 'Libra', 'Capricorn']);
assert.deepStrictEqual(man.periods.map((p) => p.years), [8, 8, 8, 8, 9, 9, 9, 9, 7, 7, 7, 7]);


// Dirga: 9th (Libra), 10th (Scorpio), 11th (Sagittarius), each with the signs it aspects (printed p.568).
const dir = R.dirga(chart);
assert.deepStrictEqual(dir.periods.map((p) => NAMES[p.sign]), ['Libra', 'Leo', 'Taurus', 'Aquarius', 'Scorpio', 'Capricorn', 'Aries', 'Cancer', 'Sagittarius', 'Pisces', 'Gemini', 'Virgo']);
assert.deepStrictEqual(dir.periods.map((p) => p.years), [7, 8, 8, 8, 8, 7, 7, 7, 9, 9, 9, 9]);

// Another lagna: the 9th, 10th and 11th are fixed, dual, movable, so some signs are reached twice and some never;
// the first place is kept and the gap is reported, not filled.
const dir2 = R.dirga({ signs, degrees, lagnaSign: 5 });
assert.ok(dir2.periods.length < 12 && dir2.detail.missing.length === 12 - dir2.periods.length && dir2.reasonTa);

// Lagnadi: Bhayat 3495 of Bhabhog 3571 palas -> 11s 22d20m17s added to lagna 10s 26d28m05s -> Aquarius 18d48m22s;
// the first dasha (8 years) has run 18d48m22s/30 of its length: balance 2y 11m 24d (printed p.569-570).
const lag = R.lagnadi({ lagnaLongitude: 10 * 30 + 26 + 28 / 60 + 5 / 3600, lagnaSign: 10, moonFraction: 3495 / 3571 });
assert.strictEqual(NAMES[lag.start], 'Aquarius');
assert.ok(Math.abs(lag.detail.expiredDegrees - (18 + 48 / 60 + 22 / 3600)) < 0.01);
assert.ok(Math.abs(lag.detail.balanceYears - (2 + 11 / 12 + 24 / 365.25)) < 0.02);
assert.deepStrictEqual(lag.periods.map((p) => NAMES[p.sign]), ['Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn']);

// A lord in its own sign gives 12 years.
const own = { signs: { ...signs, Sun: 4 }, degrees, lagnaSign: 10 };
assert.strictEqual(byName(R.chara(own)).Leo, 12);

// Schedule adds years from birth with 365.25-day years.
const sched = R.schedule(chara, 0);
assert.strictEqual(sched[0].endMs, 8 * 365.25 * 86400000);
assert.strictEqual(sched.length, 12);

console.log('test-bphs-rashi-dashas ok');
