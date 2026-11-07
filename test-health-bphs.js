const assert = require('assert');
const H = require('./src/report/healthBphs');

// ── the sookshma limbs against the three diagrams of printed pp.94-96 (Aries ascendant: house 1 is Aries ... house 12 is Pisces)
const cell = (house, dec) => { const s = H.sookshmaLimb(house, dec); return `${s.limb}/${s.side}`; };
// first decanate: Pisces (12th) Left Eye; Aries Head both; Taurus Right Eye; Gemini Right Ear; Aquarius Left Ear; Capricorn Left Nostril; Sagittarius Left Temple;
// Cancer Right Nostril; Leo Right Temple; Scorpio Chin Left; Libra Face both; Virgo Chin Right
assert.deepStrictEqual([12, 1, 2, 3, 11, 10, 9, 4, 5, 8, 7, 6].map((h) => cell(h, 0)),
  ['Eye/LEFT', 'Head/BOTH', 'Eye/RIGHT', 'Ear/RIGHT', 'Ear/LEFT', 'Nostril (nose)/LEFT', 'Temple/LEFT', 'Nostril (nose)/RIGHT', 'Temple/RIGHT', 'Chin/LEFT', 'Face/BOTH', 'Chin/RIGHT']);
// second decanate: Pisces Shoulder (Left); Aries Neck both; Taurus Shoulder (Right); Gemini Arm (Right); Aquarius Arm (Left); Capricorn Left side of trunk;
// Sagittarius Left side of heart; Scorpio Left side of stomach; Libra Navel both; Virgo Right side of stomach; Leo Right side of heart
assert.deepStrictEqual([12, 1, 2, 3, 11, 10, 9, 8, 7, 6, 5].map((h) => cell(h, 1)),
  ['Shoulder/LEFT', 'Neck/BOTH', 'Shoulder/RIGHT', 'Arm/RIGHT', 'Arm/LEFT', 'Side of trunk/LEFT', 'Heart/LEFT', 'Stomach/LEFT', 'Navel/BOTH', 'Stomach/RIGHT', 'Heart/RIGHT']);
// third decanate: Pisces Anus/Penis (Left); Aries Pelvis both; Taurus Anus/Penis (Right); Gemini Right Testicle; Aquarius Left Testicle; Capricorn Left Thigh;
// Sagittarius Left Knee; Scorpio Left calf; Libra Foot both; Virgo Right Calf; Leo Right Knee; Cancer Right Thigh
assert.deepStrictEqual([12, 1, 2, 3, 11, 10, 9, 8, 7, 6, 5, 4].map((h) => cell(h, 2)),
  ['Anus/Penis/LEFT', 'Pelvis/BOTH', 'Anus/Penis/RIGHT', 'Testicle/RIGHT', 'Testicle/LEFT', 'Thigh/LEFT', 'Knee/LEFT', 'Calf/LEFT', 'Foot/BOTH', 'Calf/RIGHT', 'Knee/RIGHT', 'Thigh/RIGHT']);

// the sthoola limbs (ch.4 v.4-4.5): head, face, arms, heart, stomach, hip, space below navel, privities, thighs, knees, ankles, feet
assert.deepStrictEqual(H.STHOOLA.map((x) => x[0]), ['Head', 'Face', 'Arms', 'Heart', 'Stomach', 'Hip', 'Space below navel', 'Privities', 'Thighs', 'Knees', 'Ankles', 'Feet']);
// the dhatus (ch.3 v.31)
assert.deepStrictEqual(H.DHATU.map((x) => x[1]), ['Bones', 'Blood', 'Marrow', 'Skin', 'Fat', 'Semen', 'Muscles']);

// the halves of the ascendant and the seventh: the risen part is the left (Aries ascendant at 15 degrees)
assert.strictEqual(H.halfSide(1, 5, 15), 'LEFT');
assert.strictEqual(H.halfSide(1, 25, 15), 'RIGHT');
assert.strictEqual(H.halfSide(7, 186, 15), 'RIGHT', 'Libra 6: before the descendant (Libra 15), not yet risen');
assert.strictEqual(H.halfSide(7, 200, 15), 'LEFT', 'Libra 20: after the descendant, risen');
assert.strictEqual(H.halfSide(1, 100, 15), null, 'not in the ascending sign');

// ── the rules of the Sixth House chapter, on compact charts: signs by planet, longitude = sign x 30 + 15
const { d9Rashi } = require('./src/report/panchaVargeeyaBala');
const NAMES = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
function chart({ lagna = 0, signs = {}, mandi = null, park = 2 }) {
  const planets = Object.fromEntries(NAMES.map((p) => [p, { longitude: (signs[p] ?? park) * 30 + 15 }]));
  return {
    lagnaSign: lagna, lagnaLongitude: lagna * 30 + 15, planets, mandiLongitude: mandi === null ? null : mandi * 30 + 15,
    navamshaSign: (p) => d9Rashi(planets[p].longitude), navamshaLagnaSign: d9Rashi(lagna * 30 + 15),
  };
}
const st = (c, id) => H.evaluateHealth(c).rules.find((r) => r.id === id).status;
// Aries lagna: lords 1 Mars, 2 Venus, 3 Mercury, 4 Moon, 5 Sun, 6 Mercury, 7 Venus, 8 Mars, 9 Jupiter, 10 Saturn, 11 Saturn, 12 Jupiter
// 9-12.5: the lords of the 6th (Mercury) and 8th (Mars) in the ascendant with the Sun
let c = chart({ lagna: 0, signs: { Mercury: 0, Mars: 0, Sun: 0 } });
assert.strictEqual(st(c, 'SIX_9'), 'HELD');
assert.ok(H.evaluateHealth(c).rules.find((r) => r.id === 'SIX_9').resultTa.includes('சூரியன்: கட்டிகள், காய்ச்சல்'));
assert.strictEqual(st(chart({ lagna: 0, signs: { Mercury: 0, Mars: 0 } }), 'SIX_9'), 'UNKNOWN', 'both lords there but no other planet');
assert.strictEqual(st(chart({ lagna: 0, signs: { Mercury: 0, Mars: 1, Sun: 0 } }), 'SIX_9'), 'NOT_HELD');
// 13: Saturn with Rahu; the 6th house (Virgo) holds a malefic and the 6th lord (Mercury) is with a malefic
assert.strictEqual(st(chart({ lagna: 0, signs: { Saturn: 3, Rahu: 3, Ketu: 5, Mercury: 8, Sun: 8 } }), 'SIX_13'), 'HELD');
assert.strictEqual(st(chart({ lagna: 0, signs: { Saturn: 3, Rahu: 3, Mercury: 8 } }), 'SIX_13'), 'NOT_HELD');
// 14: Mars in the 6th and the 6th lord (Mercury) in the 8th
assert.strictEqual(st(chart({ lagna: 0, signs: { Mars: 5, Mercury: 7 } }), 'SIX_14'), 'HELD');
assert.strictEqual(st(chart({ lagna: 0, signs: { Mars: 5, Mercury: 6 } }), 'SIX_14'), 'NOT_HELD');
// 15: the Moon in Sagittarius or Pisces and Jupiter in the 6th
assert.strictEqual(st(chart({ lagna: 0, signs: { Moon: 8, Jupiter: 5 } }), 'SIX_15'), 'HELD');
assert.strictEqual(st(chart({ lagna: 0, signs: { Moon: 7, Jupiter: 5 } }), 'SIX_15'), 'NOT_HELD');
// 16: Rahu in the 6th, the ascendant lord (Mars) in the 8th, Mandi in an angle; Mandi unknown is UNKNOWN
assert.strictEqual(st(chart({ lagna: 0, signs: { Rahu: 5, Mars: 7 }, mandi: 3 }), 'SIX_16'), 'HELD');
assert.strictEqual(st(chart({ lagna: 0, signs: { Rahu: 5, Mars: 7 }, mandi: 4 }), 'SIX_16'), 'NOT_HELD');
assert.strictEqual(st(chart({ lagna: 0, signs: { Rahu: 5, Mars: 7 } }), 'SIX_16'), 'UNKNOWN');
// 17: the 6th (Mercury) and 12th (Jupiter) lords exchange: Mercury in Sagittarius or Pisces, Jupiter in Gemini or Virgo
assert.strictEqual(st(chart({ lagna: 0, signs: { Mercury: 8, Jupiter: 2 } }), 'SIX_17'), 'HELD');
assert.strictEqual(st(chart({ lagna: 0, signs: { Mercury: 8, Jupiter: 3 } }), 'SIX_17'), 'NOT_HELD');
// 18: Saturn and the Moon together in the 6th
assert.strictEqual(st(chart({ lagna: 0, signs: { Saturn: 5, Moon: 5 } }), 'SIX_18'), 'HELD');
assert.strictEqual(st(chart({ lagna: 0, signs: { Saturn: 5, Moon: 6 } }), 'SIX_18'), 'NOT_HELD');
// 19: Saturn with an inimical planet (Sun, Moon, Mars) while the ascendant lord is in the ascendant
assert.strictEqual(st(chart({ lagna: 0, signs: { Saturn: 9, Sun: 9, Mars: 0 } }), 'SIX_19'), 'HELD');
assert.strictEqual(st(chart({ lagna: 0, signs: { Saturn: 9, Venus: 9, Mars: 0 } }), 'SIX_19'), 'NOT_HELD', 'Venus is not inimical to Saturn');
// 20: the Moon with the 6th lord (Mercury), the 8th lord (Mars) in the 6th, the 12th lord (Jupiter) in the ascendant
assert.strictEqual(st(chart({ lagna: 0, signs: { Moon: 4, Mercury: 4, Mars: 5, Jupiter: 0 } }), 'SIX_20'), 'HELD');
// 21: Rahu in the 6th and Saturn in the 8th from Rahu (Virgo + 7 = Aries)
assert.strictEqual(st(chart({ lagna: 0, signs: { Rahu: 5, Saturn: 0 } }), 'SIX_21'), 'HELD');
assert.strictEqual(st(chart({ lagna: 0, signs: { Rahu: 5, Saturn: 1 } }), 'SIX_21'), 'NOT_HELD');
// 23: the Sun in the 6th or 8th with the Moon in the 12th from the Sun
assert.strictEqual(st(chart({ lagna: 0, signs: { Sun: 5, Moon: 4 } }), 'SIX_23'), 'HELD');
assert.strictEqual(st(chart({ lagna: 0, signs: { Sun: 5, Moon: 6 } }), 'SIX_23'), 'NOT_HELD');
// 24: Saturn in the 8th and Mars in the 7th
assert.strictEqual(st(chart({ lagna: 0, signs: { Saturn: 7, Mars: 6 } }), 'SIX_24'), 'HELD');
// 25: the 8th lord (Mars) with Rahu in the 2nd, 4th, 5th, 11th or 12th and in the 8th from the navamsha ascendant. Aries lagna 15 degrees: navamsha lagna Virgo
c = chart({ lagna: 0, signs: { Mars: 3, Rahu: 3 } });
const navLagna = c.navamshaLagnaSign;
assert.strictEqual(st(c, 'SIX_25'), (d9Rashi(c.planets.Mars.longitude) - navLagna + 12) % 12 === 7 ? 'HELD' : 'NOT_HELD');
// 26: the 11th (Saturn) and 6th (Mercury) lords exchange: Saturn in Gemini or Virgo, Mercury in Capricorn or Aquarius
assert.strictEqual(st(chart({ lagna: 0, signs: { Saturn: 2, Mercury: 9 } }), 'SIX_26'), 'HELD');
// 27: the 5th lord (Sun) in the 6th, the 6th lord (Mercury) with Jupiter, the 12th lord (Jupiter) in the ascendant: Jupiter in Aries, Mercury with him
assert.strictEqual(st(chart({ lagna: 0, signs: { Sun: 5, Mercury: 0, Jupiter: 0 } }), 'SIX_27'), 'HELD');
// 28: the ascendant lord (Mars) and the 6th lord (Mercury) exchange: Mars in Gemini or Virgo, Mercury in Aries or Scorpio
assert.strictEqual(st(chart({ lagna: 0, signs: { Mars: 2, Mercury: 0 } }), 'SIX_28'), 'HELD');
assert.strictEqual(st(chart({ lagna: 0, signs: { Mars: 2, Mercury: 1 } }), 'SIX_28'), 'NOT_HELD');

// every rule carries its printed page and result
for (const r of H.evaluateHealth(chart({ lagna: 0 })).rules) {
  assert.ok(['116', '118', '119', '120'].includes(r.printedPage), r.id);
  assert.ok(r.resultTa.length > 5 && r.titleTa.length > 5, r.id);
}
// the planets' limbs follow the sign counted from the reference: Aries ascendant, Moon in Taurus: 2nd house = face (sthoola); first decanate: Eye, right
c = chart({ lagna: 0, signs: { Moon: 1 } });
c.lagnaLongitude = 5; // first decanate rises
const lm = H.evaluateHealth(c).limbs.lagna;
const moon = lm.planets.find((p) => p.planet === 'Moon');
assert.deepStrictEqual([lm.decanate, moon.house, moon.sthoola, moon.sookshma, moon.side], [1, 2, 'Face', 'Eye', 'RIGHT']);
assert.strictEqual(lm.planets.find((p) => p.planet === 'Saturn').markTa.startsWith('பாபர்'), true);
console.log('test-health-bphs ok');
