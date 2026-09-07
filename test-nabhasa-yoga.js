const assert = require('node:assert/strict');
const { calculateNabhasaYogas } = require('./src/chart/nabhasaYoga');

const names = (result) => result.yogas.map((y) => y.name);

// Rajju: all 7 planets in movable signs (Aries=0).
const rajju = calculateNabhasaYogas({
  Sun: 0, Moon: 0, Mars: 0, Mercury: 0, Jupiter: 0, Venus: 0, Saturn: 0, Lagna: 0,
});
assert.ok(names(rajju).includes('Rajju'));

// Musala: all 7 in a fixed sign (Taurus=1).
const musala = calculateNabhasaYogas({
  Sun: 1, Moon: 1, Mars: 1, Mercury: 1, Jupiter: 1, Venus: 1, Saturn: 1, Lagna: 0,
});
assert.ok(names(musala).includes('Musala'));

// Nala: all 7 in a dual sign (Gemini=2).
const nala = calculateNabhasaYogas({
  Sun: 2, Moon: 2, Mars: 2, Mercury: 2, Jupiter: 2, Venus: 2, Saturn: 2, Lagna: 0,
});
assert.ok(names(nala).includes('Nala'));

// Sringataka: planets spread across houses 1, 5 and 9 from Lagna (Aries lagna
// -> Aries, Leo, Sagittarius -- three different modalities, so Rajju/Musala/
// Nala correctly do NOT also fire).
const sringataka = calculateNabhasaYogas({
  Sun: 0, Moon: 0, Mars: 4, Mercury: 4, Jupiter: 8, Venus: 8, Saturn: 8, Lagna: 0,
});
assert.ok(names(sringataka).includes('Sringataka'));
assert.ok(!names(sringataka).some((n) => ['Rajju', 'Musala', 'Nala'].includes(n)));

// Kamala: all 7 planets in the four angles (houses 1,4,7,10 from Lagna).
const kamala = calculateNabhasaYogas({
  Sun: 0, Moon: 0, Mars: 3, Mercury: 3, Jupiter: 6, Venus: 9, Saturn: 9, Lagna: 0,
});
assert.ok(names(kamala).includes('Kamala'));
// Sankhya yogas must NOT also appear once any other Nabhasa yoga is found (v.17).
assert.ok(!names(kamala).some((n) => ['Gola', 'Yuga', 'Soola', 'Kedara', 'Paasa', 'Dama', 'Veena'].includes(n)));

// Vajra: benefics (Jupiter, Venus, Mercury) confined to houses 1 & 7; malefics
// (Sun, Mars, Saturn) confined to houses 4 & 10; Moon placed elsewhere (waxing -> benefic group,
// so keep her out of the malefic houses to avoid breaking the malefic-only condition).
const vajra = calculateNabhasaYogas({
  Jupiter: 0, Venus: 6, Mercury: 0, // houses 1, 7, 1
  Sun: 3, Mars: 9, Saturn: 3, // houses 4, 10, 4
  Moon: 6, // house 7 (waxing -> benefic group, consistent with benefics-in-{1,7})
  Lagna: 0,
}, { isWaxingMoon: true });
assert.ok(names(vajra).includes('Vajra'));

// Sankhya (Soola, 3 signs): houses 1, 5 and 10 from Lagna deliberately avoid
// every Akriti/Asraya pattern (verified by hand in the S11 stage record), so
// only the Sankhya fallback applies.
const soola = calculateNabhasaYogas({
  Sun: 0, Moon: 0, Mars: 4, Mercury: 4, Jupiter: 4, Venus: 9, Saturn: 9, Lagna: 0,
});
assert.deepEqual(names(soola), ['Soola']);

assert.equal(rajju.source.tradition, 'Parashari');

console.log(JSON.stringify({ pass: true, rajju: names(rajju), sringataka: names(sringataka), kamala: names(kamala), soola: names(soola) }, null, 2));
