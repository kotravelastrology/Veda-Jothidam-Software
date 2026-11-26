const assert = require('assert');
const Y = require('./src/report/varshaYogas');
const V = require('./src/report/varshaphala');

const SIGN_LORD = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'];
const NAMES = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
/** A varsha result from a compact spec: lagna sign, planets {name: sign}, muntha sign, age. Unlisted planets are parked in distinct signs. */
function mk({ lagna = 0, signs = {}, muntha = 0, age = 10 }) {
  const grahas = {};
  NAMES.forEach((p, i) => { grahas[p] = { rasiIndex: signs[p] ?? ((i * 5 + 3) % 12), degreeInSign: 10 }; });
  return { yearsElapsed: age, muntha: { rasiIndex: muntha, lord: SIGN_LORD[muntha] }, varshaChart: { lagna: { rasiIndex: lagna, degreeInSign: 10 }, grahas } };
}
const byId = (r, id) => r.rules.find((x) => x.id === id);
const ev = (spec) => Y.evaluateVarshaYogas(mk(spec));
/** Put every planet in the given sign unless listed (a quiet chart). */
const all = (sign, over = {}) => Object.fromEntries(NAMES.map((p) => [p, over[p] ?? sign]));

// Arishta v.9: the lagna lord, Munthesha or 8th lord in the 6th, 8th or 12th from the lagna or from the Moon
assert.strictEqual(byId(ev({ lagna: 0, muntha: 2, signs: all(0, { Mars: 7, Mercury: 0, Moon: 0 }) }), 'ARISHTA_9').status, 'HELD', 'Aries lagna: Mars the lagna lord in Scorpio, the 8th');
assert.strictEqual(byId(ev({ lagna: 0, muntha: 0, signs: all(0) }), 'ARISHTA_9').status, 'NOT_HELD', 'everything in the lagna');
assert.ok(byId(ev({ lagna: 0, muntha: 2, signs: all(0, { Moon: 1, Mars: 6 }) }), 'ARISHTA_9').evidence.hits.some((h) => h.p === 'Mars' && h.fromMoon === 6), 'Mars the 6th sign from Taurus is Libra');

// Arishta v.5: a malefic in 12, 6, 2 or 8, or malefics both in the 12th and in the 2nd
assert.strictEqual(byId(ev({ signs: all(0, { Saturn: 5 }) }), 'ARISHTA_5').status, 'HELD');
assert.strictEqual(byId(ev({ signs: all(2, { Saturn: 11, Mars: 1 }) }), 'ARISHTA_5').evidence.hemmed, true);
assert.strictEqual(byId(ev({ signs: all(2) }), 'ARISHTA_5').status, 'NOT_HELD');

// Arishta v.6: the Muntha in the 6th, 8th or 12th with a malefic in the Muntha's sign; with Saturn the wind disease is flagged
let r = ev({ lagna: 0, muntha: 5, signs: all(2, { Saturn: 5 }) });
assert.strictEqual(byId(r, 'ARISHTA_6').status, 'HELD');
assert.strictEqual(byId(r, 'ARISHTA_6').evidence.withSaturn, true);
assert.strictEqual(byId(ev({ lagna: 0, muntha: 5, signs: all(2) }), 'ARISHTA_6').status, 'NOT_HELD', 'no malefic with the Muntha');
assert.strictEqual(byId(ev({ lagna: 0, muntha: 2, signs: all(2) }), 'ARISHTA_6').status, 'NOT_HELD', 'the Muntha in the 3rd');

// Arishta v.7: in the named places the aspect is not computed, so the rule is UNKNOWN and never HELD
assert.strictEqual(byId(ev({ lagna: 0, muntha: 6, signs: all(2) }), 'ARISHTA_7').status, 'UNKNOWN');
assert.strictEqual(byId(ev({ lagna: 0, muntha: 2, signs: all(2) }), 'ARISHTA_7').status, 'NOT_HELD');
// the 8th from the janma lagna counts too: janma lagna = Muntha sign - age; age 5, Muntha Aries -> janma lagna Pisces, and Aries is its 2nd; use age 4: Muntha Aries(0) - 4 = Aquarius(8), Aries is its 3rd
assert.strictEqual(byId(ev({ lagna: 5, muntha: 0, age: 5, signs: all(2) }), 'ARISHTA_7').evidence.eighthFromJanma, false);
// janma lagna Aries (0), age 7, Muntha = Scorpio (7): the 8th from the janma lagna
assert.strictEqual(byId(ev({ lagna: 2, muntha: 7, age: 7, signs: all(2) }), 'ARISHTA_7').evidence.eighthFromJanma, true);

// Arishta v.8: the Moon in the 7th with the lagna lord and the 8th lord in 8, 12, 6; or the lagna lord and the Muntha lord both in the 8th
assert.strictEqual(byId(ev({ lagna: 1, muntha: 3, signs: all(2, { Moon: 7, Venus: 8, Jupiter: 8 }) }), 'ARISHTA_8').status, 'HELD', 'Taurus lagna: Moon in the 7th; Venus the lagna lord and Jupiter the 8th lord both in the 8th');
assert.strictEqual(byId(ev({ lagna: 0, muntha: 0, signs: all(2, { Mars: 7 }) }), 'ARISHTA_8').status, 'HELD', 'Aries lagna: Mars both the lagna lord and the Muntha lord, in the 8th');

// Bhanga v.1: the lagna lord and a benefic in a kendra or trikona
assert.strictEqual(byId(ev({ lagna: 0, signs: all(2, { Mars: 3, Jupiter: 3 }) }), 'BHANGA_1').status, 'HELD');
assert.strictEqual(byId(ev({ lagna: 0, signs: all(1) }), 'BHANGA_1').status, 'NOT_HELD', 'all in the 2nd');
// Bhanga v.2: a malefic in the 3rd, 11th or 6th from the lagna
assert.strictEqual(byId(ev({ lagna: 0, signs: all(1, { Sun: 2 }) }), 'BHANGA_2').status, 'HELD');

// Yoga v.1: Jupiter in the lagna, 3rd, 11th or 4th
assert.strictEqual(byId(ev({ lagna: 0, signs: all(1, { Jupiter: 10 }) }), 'YOGA_1').status, 'HELD');
assert.strictEqual(byId(ev({ lagna: 0, muntha: 0, age: 0, signs: all(1) }), 'YOGA_1').status, 'NOT_HELD');
// Yoga v.3: the 7th lord in the lagna: Aries lagna, Venus (lord of Libra, the 7th) in Aries
assert.strictEqual(byId(ev({ lagna: 0, signs: all(1, { Venus: 0 }) }), 'YOGA_3').status, 'HELD');
// Yoga v.4: a benefic in a kendra or trikona and a malefic in the 3rd, 6th or 11th; the malefics all elsewhere -> not held
assert.strictEqual(byId(ev({ lagna: 0, signs: all(1, { Jupiter: 4, Saturn: 2 }) }), 'YOGA_4').status, 'HELD');
assert.strictEqual(byId(ev({ lagna: 0, signs: all(1, { Jupiter: 4 }) }), 'YOGA_4').status, 'NOT_HELD');
// Yoga v.6: Sun, Mars and Saturn all in 3, 6, 11 and a benefic in a kendra
assert.strictEqual(byId(ev({ lagna: 0, signs: all(1, { Sun: 2, Mars: 5, Saturn: 10, Jupiter: 3 }) }), 'YOGA_6').status, 'HELD');
assert.strictEqual(byId(ev({ lagna: 0, signs: all(1, { Sun: 2, Mars: 5, Saturn: 7, Jupiter: 3 }) }), 'YOGA_6').status, 'NOT_HELD');
// Yoga v.5: Saturn and Venus both in own or exalted signs is UNKNOWN (combustion has no orb), otherwise NOT_HELD
assert.strictEqual(byId(ev({ signs: all(2, { Saturn: 9, Venus: 1 }) }), 'YOGA_5').status, 'UNKNOWN');
assert.strictEqual(byId(ev({ signs: all(3, { Saturn: 9, Venus: 2 }) }), 'YOGA_5').status, 'NOT_HELD');
assert.strictEqual(byId(ev({ signs: all(3, { Saturn: 6, Venus: 11 }) }), 'YOGA_5').status, 'UNKNOWN', 'Saturn exalted in Libra, Venus in Pisces');
// Yoga v.100: the 11th lord in the 11th is UNKNOWN (aspect, exaltation, distance from the Sun), else NOT_HELD
assert.strictEqual(byId(ev({ lagna: 0, signs: all(1, { Saturn: 10 }) }), 'YOGA_LABHA').status, 'UNKNOWN');
assert.strictEqual(byId(ev({ lagna: 0, signs: all(1, { Saturn: 3 }) }), 'YOGA_LABHA').status, 'NOT_HELD');

// every rule has a verse, a printed page, Tamil text and a legal status; ids are unique; the counts add up
for (const age of [10, 20, 36, 41]) {
  const v = V.calculateVarshaphala({ name: 'A', year: 1990, month: 10, day: 5, hour: 4, minute: 30, latitude: 13.0827, longitude: 80.2707, utcOffsetMinutes: 330, ianaTimeZone: 'Asia/Kolkata', placeName: 'Chennai', calendarMode: 'tirukanita' }, age);
  const out = Y.evaluateVarshaYogas(v);
  const ids = out.rules.map((x) => x.id);
  assert.strictEqual(new Set(ids).size, ids.length);
  for (const x of out.rules) {
    assert.ok(['HELD', 'NOT_HELD', 'UNKNOWN'].includes(x.status), x.id);
    assert.ok(x.verse.startsWith('v.') && x.printedPage && x.titleTa && x.detail.length > 10, x.id);
  }
  assert.strictEqual(out.summary.held + out.summary.unknown + out.summary.notHeld, out.rules.length);
}

// The mixed chapter (printed 71-73). mk() puts the janma lagna at Muntha - age; here lagna 0 (Aries), muntha 0 and age 0 give janma lagna Aries (lord Mars)
const mishra = (spec, extra = {}) => Y.evaluateVarshaYogas({ ...mk(spec), ...extra });
// v.3: Jupiter in the 1st or 3rd and the janma lagna lord in the 4th
let m = mishra({ lagna: 0, muntha: 0, age: 0, signs: all(8, { Jupiter: 2, Mars: 3 }) });
assert.strictEqual(byId(m, 'MISHRA_3').status, 'HELD', 'Jupiter in Gemini (3rd from Aries), Mars the janma lagna lord in Cancer (4th)');
assert.strictEqual(byId(mishra({ lagna: 0, muntha: 0, age: 0, signs: all(8, { Jupiter: 4, Mars: 3 }) }), 'MISHRA_3').status, 'NOT_HELD');
// v.5: the 2nd lord in the 2nd with Jupiter; the 5th lord in the 5th
m = mishra({ lagna: 0, signs: all(8, { Venus: 1, Jupiter: 1, Sun: 4 }) });
assert.strictEqual(byId(m, 'MISHRA_5A').status, 'HELD', 'Venus the 2nd lord in Taurus with Jupiter');
assert.strictEqual(byId(m, 'MISHRA_5B').status, 'HELD', 'the Sun the 5th lord in Leo');
// v.7: the lagna lord in the 8th with Mars joined: HELD; Mars only a partial glance: UNKNOWN; no glance: NOT_HELD (lagna Taurus, lord Venus in Sagittarius, the 8th)
assert.strictEqual(byId(mishra({ lagna: 1, signs: all(0, { Venus: 8, Mars: 8 }) }), 'MISHRA_7').status, 'HELD');
assert.strictEqual(byId(mishra({ lagna: 1, signs: all(0, { Venus: 8, Mars: 5 }) }), 'MISHRA_7').status, 'UNKNOWN', 'Sagittarius is the 4th from Virgo: a half share');
assert.strictEqual(byId(mishra({ lagna: 1, signs: all(0, { Venus: 8, Mars: 7 }) }), 'MISHRA_7').status, 'NOT_HELD', 'Sagittarius is the 2nd from Scorpio: no glance');
assert.strictEqual(byId(mishra({ lagna: 1, signs: all(0, { Venus: 6, Mars: 6 }) }), 'MISHRA_7').status, 'NOT_HELD', 'the lagna lord is not in the 8th');
// v.9: the lagna joined by a malefic and not by benefics (and no benefic or partial glance) is HELD; a benefic in the lagna makes it NOT_HELD
assert.strictEqual(byId(mishra({ lagna: 0, signs: all(1, { Saturn: 0, Rahu: 0 }) }), 'MISHRA_9').status, 'HELD', 'Saturn and Rahu in the lagna; the benefics in Taurus (the 12th from it) cast no glance on Aries');
assert.strictEqual(byId(mishra({ lagna: 0, signs: all(2, { Saturn: 0, Rahu: 0 }) }), 'MISHRA_9').status, 'UNKNOWN', 'benefics in Gemini glance Aries by a quarter: left open');
assert.strictEqual(byId(mishra({ lagna: 0, signs: all(0, { Mercury: 0, Moon: 0, Jupiter: 0, Venus: 0 }) }), 'MISHRA_9').status, 'NOT_HELD', 'benefics in the lagna');
// v.11 and v.12: the Varshapati's house and nature
m = mishra({ lagna: 0, signs: all(1, { Jupiter: 3 }) }, { varshesha: 'Jupiter' });
assert.strictEqual(byId(m, 'MISHRA_11B').status, 'HELD', 'Jupiter in the 4th is a benefic in a kendra');
assert.strictEqual(byId(m, 'MISHRA_12A').status, 'NOT_HELD');
m = mishra({ lagna: 0, signs: all(1, { Mars: 10 }) }, { varshesha: 'Mars' });
assert.strictEqual(byId(m, 'MISHRA_12A').status, 'HELD', 'a malefic Varshapati in the 11th');
m = mishra({ lagna: 0, signs: all(1, { Saturn: 11 }) }, { varshesha: 'Saturn' });
assert.strictEqual(byId(m, 'MISHRA_12B').status, 'UNKNOWN', 'a malefic Varshapati in the 12th: the loss of strength is not defined');
assert.strictEqual(byId(mishra({ lagna: 0, signs: all(1) }), 'MISHRA_11B').status, 'UNKNOWN', 'no Varshapati given');
// v.6: the Moon in its fall (Scorpio) leaves the rule open (combustion has no orb in the verses); otherwise it fails
assert.strictEqual(byId(mishra({ lagna: 0, signs: all(1, { Moon: 7 }) }), 'MISHRA_6').status, 'UNKNOWN');
assert.strictEqual(byId(mishra({ lagna: 0, signs: all(1) }), 'MISHRA_6').status, 'NOT_HELD');
assert.strictEqual(m.rules.filter((x) => x.group === 'mishraka').length, 16);
console.log('test-varsha-yogas ok');
