const assert = require('assert');
const { drikBalaRaman, DRIK_METHODS } = require('./src/chart/shadbala');

// Raman, Graha and Bhava Balas, Chapter I para 6 (PDF p.7): the Standard Horoscope's Nirayana longitudes.
const dms = (d, m, s) => d + m / 60 + s / 3600;
const longitudes = {
  Sun: dms(180, 53, 55), Moon: dms(311, 17, 19), Mars: dms(229, 30, 34), Mercury: dms(181, 31, 34),
  Jupiter: dms(84, 0, 49), Venus: dms(171, 9, 56), Saturn: dms(124, 22, 41),
};
const isWaxingMoon = true; // Moon 131° ahead of the Sun.

// Raman, Example 56 (PDF p.94-95): the Drik Bala row of the Standard Horoscope, in shashtiamsas.
const RAMAN = { Sun: 15.86, Moon: -21.73, Mars: 0.95, Mercury: 15.64, Jupiter: -16.03, Venus: 18.47 };
for (const [planet, expected] of Object.entries(RAMAN)) {
  const got = drikBalaRaman(planet, longitudes, isWaxingMoon);
  assert.ok(Math.abs(got - expected) < 0.03, `${planet} Drik ${got.toFixed(2)} vs Raman ${expected}`);
}
// Saturn: Raman's table gives 7.21 in the Drik row (the rupa column also shows 7.21); ours is 7.20.
assert.ok(Math.abs(drikBalaRaman('Saturn', longitudes, isWaxingMoon) - 7.21) < 0.03, 'Saturn Drik vs Raman 7.21');

// Budha is malefic when near Ravi (0.6° apart in the Standard Horoscope), so Raman's Budha is positive: subha from the benefics dominates.
assert.ok(drikBalaRaman('Mercury', longitudes, isWaxingMoon) > 0);

// The two readings are selectable by name; an unknown name is refused.
assert.deepStrictEqual(Object.keys(DRIK_METHODS), ['bphs', 'raman']);
assert.equal(DRIK_METHODS['no-such'], undefined);

console.log('test-shadbala-drik-raman: all assertions passed');
