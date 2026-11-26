const assert = require('assert');
const S = require('./src/report/sanghattaChakra');

const { left, right, bottom, listedPairs, rules } = S.DATA;
const all = [...left, ...right, ...bottom];
assert.strictEqual(new Set(all).size, 27, 'the 27 stars stand at the edge of the figure, once each');
assert.strictEqual(S.PAIRS.length, 27);
// every star is joined to exactly two others
for (const s of all) assert.strictEqual(S.vedhaStars(s).length, 2, s);
// the book's own five pairs (v.2) are among the lines read off the diagram
for (const [a, b] of listedPairs) assert.ok(S.joined(a, b) && S.joined(b, a), `${a}-${b}`);
assert.deepStrictEqual(S.vedhaStars('Ashwini').sort(), ['Jyeshtha', 'Revati']);
assert.deepStrictEqual(S.vedhaStars('Magha').sort(), ['Ashlesha', 'Revati']);
assert.deepStrictEqual(S.vedhaStars('Ashlesha').sort(), ['Magha', 'Mula']);
// the three families
assert.ok(S.joined('Bharani', 'UBhadra') && S.joined('Bharani', 'Anuradha'), 'row 2 and the slant from Bharani');
assert.ok(S.joined('Mula', 'Jyeshtha'), 'the slant from the lowest left end meets the first bottom point');
// the stars run round the figure in zodiac order: right edge down, bottom right to left, left edge up
const round = [...right, ...[...bottom].reverse(), ...[...left].reverse()];
const zodiac = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'PPhalguni', 'UPhalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'PAshadha', 'UAshadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'PBhadra', 'UBhadra', 'Revati'];
assert.deepStrictEqual(round, zodiac);
assert.ok(rules.every((r) => r.page >= 148 && r.page <= 150 && r.ta.length > 15));

// Rules. Longitudes: Ashwini 0-13d20, Jyeshtha 226d40-240, Revati 346d40-360.
const lon = { Ashwini: 5, Revati: 350, Jyeshtha: 233, Magha: 125, Ashlesha: 110, Mula: 245, Bharani: 18 };
// the Moon in Ashwini struck by Saturn in Revati: a malefic vedha, war that day (v.7)
let r = S.sanghatta({ Moon: lon.Ashwini, Saturn: lon.Revati });
assert.ok(r.matches.some((m) => m.id === 'V7_MOON_VEDHA'));
assert.ok(!r.matches.some((m) => m.id === 'V11_SUN_MOON_LINE'));
// Sun in Jyeshtha with the Moon in Ashwini: the same line (v.11)
r = S.sanghatta({ Moon: lon.Ashwini, Sun: lon.Jyeshtha });
assert.ok(r.matches.some((m) => m.id === 'V11_SUN_MOON_LINE') && r.matches.some((m) => m.id === 'V7_MOON_VEDHA'));
// a focus star with no striker: calm (v.6); with a malefic striker: war; with a benefic only: calm
r = S.sanghatta({ Jupiter: lon.Ashlesha }, 'Ashwini');
assert.ok(r.matches.some((m) => m.id === 'V6_NO_VEDHA') && !r.matches.some((m) => m.id === 'V6_MALEFIC_VEDHA'));
r = S.sanghatta({ Jupiter: lon.Revati }, 'Ashwini');
assert.ok(r.matches.some((m) => m.id === 'V6_NO_VEDHA') && r.strikers.length === 1);
r = S.sanghatta({ Mars: lon.Revati }, 'Ashwini');
assert.ok(r.matches.some((m) => m.id === 'V6_MALEFIC_VEDHA') && !r.matches.some((m) => m.id === 'V6_NO_VEDHA'));
// Mars in Magha, Rahu in Revati (joined), Moon with Mars: fire and iron (v.12)
r = S.sanghatta({ Mars: lon.Magha, Rahu: lon.Revati, Moon: lon.Magha });
assert.ok(r.matches.some((m) => m.id === 'V12_MARS_RAHU_MOON'));
r = S.sanghatta({ Mars: lon.Magha, Rahu: lon.Revati, Moon: lon.Bharani });
assert.ok(!r.matches.some((m) => m.id === 'V12_MARS_RAHU_MOON'));
// Mercury, Venus and Moon in one star (v.13); Moon, Sun, Saturn, Rahu in one star (v.14)
r = S.sanghatta({ Mercury: 5, Venus: 6, Moon: 7 });
assert.ok(r.matches.some((m) => m.id === 'V13_MERCURY_VENUS_MOON'));
r = S.sanghatta({ Moon: 5, Sun: 6, Saturn: 7, Rahu: 8 });
assert.ok(r.matches.some((m) => m.id === 'V14_FOUR_ONE_STAR'));
assert.deepStrictEqual(S.sanghatta({}).matches, []);
console.log('test-sanghatta-chakra ok');
