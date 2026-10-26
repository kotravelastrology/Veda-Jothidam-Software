const assert = require('assert');
const B = require('./src/report/varsheshaBook');
const V = require('./src/report/varshaphala');

const LORD = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'];
const SEVEN = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
/** A compact case: planets' signs in the varsha chart and the birth chart, strengths by planet. */
function run({ isDay = true, lagna = 0, janma = 0, muntha = 0, signs = {}, birth = {}, strength = {}, sunSign = 0, moonSign = 1 }) {
  const all = Object.fromEntries(SEVEN.map((p, i) => [p, signs[p] ?? ((i * 5 + 2) % 12)]));
  const b = Object.fromEntries(SEVEN.map((p, i) => [p, birth[p] ?? ((i * 7 + 3) % 12)]));
  return B.selectVarsheshaBook({
    isDay, varshaLagnaSign: lagna, janmaLagnaSign: janma, munthaSign: muntha, varshaSigns: all, varshaSunSign: sunSign, varshaMoonSign: moonSign,
    birthSigns: b, lordOfSign: (s) => LORD[s], strength: (p) => strength[p] ?? 1,
  });
}

// v.14 aspects: counted from the planet to the lagna sign: 3rd and 11th a quarter, 4th and 10th a half, 5th and 9th three quarters, 1st and 7th full
const share = (from, to) => B.aspectShare(from, to);
assert.strictEqual(share(0, 0), 1);
assert.strictEqual(share(0, 6), 1);
assert.strictEqual(share(0, 2), 0.25);   // the 3rd
assert.strictEqual(share(0, 10), 0.25);  // the 11th
assert.strictEqual(share(0, 3), 0.5);    // the 4th
assert.strictEqual(share(0, 9), 0.5);    // the 10th
assert.strictEqual(share(0, 4), 0.75);   // the 5th
assert.strictEqual(share(0, 8), 0.75);   // the 9th
for (const t of [1, 5, 7, 11]) assert.strictEqual(share(0, t), 0, `the ${t + 1}th gives no aspect`);

// the Trirashi tables (printed p.4): by day Aries Sun, Taurus Venus, Gemini Saturn, Cancer Venus (the older app table had the Moon), ...
assert.deepStrictEqual(B.TRIRASHI_DAY, ['Sun', 'Venus', 'Saturn', 'Venus', 'Jupiter', 'Moon', 'Mercury', 'Mars', 'Saturn', 'Mars', 'Jupiter', 'Moon']);
assert.deepStrictEqual(B.TRIRASHI_NIGHT, ['Jupiter', 'Moon', 'Mercury', 'Mars', 'Sun', 'Venus', 'Saturn', 'Venus', 'Saturn', 'Mars', 'Jupiter', 'Moon']);

// the five offices (v.34): janma lagna lord, varsha lagna lord, Munthesha, Sun-sign lord by day / Moon-sign lord by night, Trirashi lord
let r = run({ isDay: true, lagna: 3, janma: 4, muntha: 8, sunSign: 5, moonSign: 9 });
assert.deepStrictEqual(r.roles, { janmaLagnaLord: 'Sun', varshaLagnaLord: 'Moon', munthesha: 'Jupiter', luminarySignLord: 'Mercury', trirashiLord: 'Venus' });
r = run({ isDay: false, lagna: 3, janma: 4, muntha: 8, sunSign: 5, moonSign: 9 });
assert.strictEqual(r.roles.luminarySignLord, 'Saturn');
assert.strictEqual(r.roles.trirashiLord, 'Mars', 'Cancer by night');

// Offices for the cases below: Taurus varsha lagna (lord Venus, who is also the Trirashi lord by day), Aries janma lagna (Mars), Muntha in Gemini (Mercury),
// the Sun in Cancer (the Moon). Candidates: Venus (two offices), Mars, Mercury, Moon. Taurus is seen from Taurus and Scorpio fully, from Capricorn and Virgo
// three quarters, from Aquarius and Leo a half, from Pisces and Cancer a quarter.
const CASE = { lagna: 1, janma: 0, muntha: 2, sunSign: 3, moonSign: 5 };
const rest = { Sun: 11, Saturn: 11, Jupiter: 11 }; // non-candidates parked in a sign that gives Taurus a quarter
// v.35: Venus in Taurus (full aspect) and the strongest
r = run({ ...CASE, signs: { ...rest, Venus: 1, Mars: 4, Mercury: 4, Moon: 4 }, strength: { Venus: 9, Mars: 5, Mercury: 4, Moon: 3 } });
assert.deepStrictEqual(r.rows.map((x) => x.planet).sort(), ['Mars', 'Mercury', 'Moon', 'Venus']);
assert.strictEqual(r.planet, 'Venus');
assert.strictEqual(r.rule, 'V35_FULL_ASPECT_AND_STRENGTH');
// the aspect level comes first: Mars in Scorpio aspects Taurus fully though Venus (a quarter, from Pisces) and Mercury are stronger
r = run({ ...CASE, signs: { ...rest, Venus: 11, Mars: 7, Mercury: 11, Moon: 11 }, strength: { Venus: 12, Mars: 2, Mercury: 15, Moon: 14 } });
assert.strictEqual(r.planet, 'Mars', 'the only full aspect, though the weakest');
assert.strictEqual(r.aspectAndStrengthLeadersDiffer, true);
assert.deepStrictEqual(r.strengthLeaders, ['Mercury']);
// equal aspects (a half each from Aquarius): the stronger (v.36)
r = run({ ...CASE, signs: { ...rest, Venus: 10, Mars: 10, Mercury: 10, Moon: 10 }, strength: { Venus: 5, Mars: 8, Mercury: 6, Moon: 4 } });
assert.strictEqual(r.planet, 'Mars');
assert.strictEqual(r.rule, 'V36_BEST_ASPECT_THEN_STRENGTH');
// equal in aspect and strength: the one with more offices (Venus holds two)
r = run({ ...CASE, signs: { ...rest, Venus: 10, Mars: 10, Mercury: 10, Moon: 10 }, strength: { Venus: 6, Mars: 6, Mercury: 6, Moon: 6 } });
assert.strictEqual(r.planet, 'Venus');
assert.strictEqual(r.rule, 'V36_MOST_OFFICES');
// night, Aries varsha lagna: Trirashi Jupiter; janma lord Moon, varsha lord Mars, Munthesha Mercury, Moon-sign lord Mercury (Moon in Virgo): Mercury holds two offices
r = run({ isDay: false, lagna: 0, janma: 3, muntha: 2, sunSign: 4, moonSign: 5, signs: Object.fromEntries(SEVEN.map((p) => [p, 10])), strength: Object.fromEntries(SEVEN.map((p) => [p, 5])) });
assert.strictEqual(r.planet, 'Mercury');
assert.strictEqual(r.rule, 'V36_MOST_OFFICES');
// Moon (janma lord and Moon-sign lord) and Mars (varsha lord and Munthesha) hold two offices each, all else equal: the Munthesha
r = run({ isDay: false, lagna: 0, janma: 3, muntha: 7, sunSign: 4, moonSign: 3, signs: Object.fromEntries(SEVEN.map((p) => [p, 10])), strength: Object.fromEntries(SEVEN.map((p) => [p, 5])) });
assert.strictEqual(r.planet, 'Mars');
assert.strictEqual(r.rule, 'V36_ALL_EQUAL_MUNTHESHA');
// v.37: nobody aspects the varsha lagna: the one that aspects its sign in the birth chart
r = run({ ...CASE, signs: Object.fromEntries(SEVEN.map((p) => [p, 2])), birth: { Venus: 7, Mars: 2, Mercury: 2, Moon: 2, Sun: 2, Saturn: 2, Jupiter: 2 } });
assert.strictEqual(Math.max(...r.rows.map((x) => x.aspect)), 0);
assert.strictEqual(r.usedBirthAspect, true);
assert.strictEqual(r.planet, 'Venus', 'Venus in Scorpio in the birth chart sees Taurus fully');
assert.strictEqual(r.rule, 'V37_BIRTH_ASPECT');
// ... and when no one aspects even then: the Munthesha
r = run({ ...CASE, signs: Object.fromEntries(SEVEN.map((p) => [p, 2])), birth: Object.fromEntries(SEVEN.map((p) => [p, 2])) });
assert.strictEqual(r.rule, 'V37_MUNTHESHA');
assert.strictEqual(r.planet, 'Mercury');

// on real charts: the book's selection is the year lord by default, the older selection is kept, and the two are named
const birth = { name: 'A', year: 1990, month: 10, day: 5, hour: 4, minute: 30, latitude: 13.0827, longitude: 80.2707, utcOffsetMinutes: 330, ianaTimeZone: 'Asia/Kolkata', placeName: 'Chennai', calendarMode: 'tirukanita' };
for (const age of [10, 25, 36, 52]) {
  const book = V.calculateVarshaphala(birth, age);
  const old = V.calculateVarshaphala(birth, age, { varsheshaMethod: 'ROLES' });
  assert.strictEqual(book.varshesha, book.varsheshaSelection.book.planet);
  assert.strictEqual(old.varshesha, old.varsheshaSelection.legacy.planet);
  assert.strictEqual(book.varsheshaSelection.legacy.planet, old.varsheshaSelection.legacy.planet);
  assert.strictEqual(book.varsheshaSelection.book.planet, old.varsheshaSelection.book.planet);
  const offices = book.varsheshaSelection.book.rows.flatMap((x) => x.offices);
  assert.strictEqual(offices.length, 5, 'five offices, each held once');
  assert.ok(book.varsheshaSelection.book.rows.every((x) => x.aspect >= 0 && x.aspect <= 1));
}
console.log('test-varshesha-book ok');
