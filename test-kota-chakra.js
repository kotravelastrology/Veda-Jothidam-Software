const assert = require('assert');
const K = require('./src/report/kotaChakra');

const { zones, stambha, entry, natures, rules } = K.DATA;

// The structure: 28 distinct stars, 12 outer + 8 wall + 8 inner, four pillars among the inner stars, 12 entry stars.
assert.deepStrictEqual([zones.BAHYA.length, zones.PRAKARA.length, zones.MADHYA.length], [12, 8, 8]);
const all = [...zones.BAHYA, ...zones.PRAKARA, ...zones.MADHYA];
assert.strictEqual(new Set(all).size, 28);
assert.ok(all.includes('Abhijit'));
for (const s of K.STAR_NAMES) assert.ok(all.includes(s), s);
assert.deepStrictEqual(Object.keys(stambha), ['East', 'South', 'West', 'North']);
for (const s of Object.values(stambha)) assert.ok(zones.MADHYA.includes(s), `${s} is inside`);
assert.strictEqual(entry.length, 12);
assert.ok(entry.every((s) => all.includes(s)) && entry.every((s) => !Object.values(stambha).includes(s)));
// each quarter's trio of entry stars runs through the three parts of the fort (outer, wall, inner)
for (let i = 0; i < 12; i += 3) assert.deepStrictEqual(entry.slice(i, i + 3).map((s) => K.ZONE_OF[s]).sort(), ['BAHYA', 'MADHYA', 'PRAKARA'].sort(), `entry trio ${i / 3}`);
assert.deepStrictEqual(natures.benefic, ['Mercury', 'Venus', 'Moon', 'Jupiter']);
assert.deepStrictEqual(natures.malefic, ['Saturn', 'Sun', 'Mars', 'Rahu', 'Ketu']);
assert.ok(rules.every((r) => r.page >= 233 && r.page <= 240 && r.ta.length > 15 && Array.isArray(r.conds)));

// A longitude's place: 0 degrees is Ashwini (outer), 40 degrees is Rohini (wall), Ardra 66.7-80 is an inner pillar.
assert.deepStrictEqual([K.place(1).star, K.place(1).zone, K.place(1).gate], ['Ashwini', 'BAHYA', 'NIRGAMA']);
assert.deepStrictEqual([K.place(45).star, K.place(45).zone, K.place(45).gate], ['Rohini', 'PRAKARA', 'PRAVESHA']);
assert.deepStrictEqual([K.place(70).star, K.place(70).zone, K.place(70).pillar, K.place(70).gate], ['Ardra', 'MADHYA', true, 'STAMBHA']);
// Abhijit stands between Uttarashada and Shravana (276d40' to 280d53'20")
assert.strictEqual(K.starOf(278), 'Abhijit');
assert.strictEqual(K.starOf(270), 'UAshadha');
assert.strictEqual(K.starOf(283), 'Shravana');

// Rules. Mars in Mrigashira (inner), Jupiter in Ashwini (outer): malefic inside, benefic outside -> the fort is taken (v.46).
const lon = (star) => ({ Ashwini: 5, Mrigashira: 55, Ardra: 70, Hasta: 170, PAshadha: 255, UBhadra: 345, Rohini: 45, Chitra: 185, Bharani: 18 }[star]);
let r = K.kotaChakra({ Mars: lon('Mrigashira'), Jupiter: lon('Ashwini') });
let ids = r.matches.map((m) => m.id);
assert.ok(ids.includes('K46_FALL') && ids.includes('K57') && ids.includes('K50_FALL_EASY') === false);
assert.ok(ids.includes('K45_MADHYA'));
assert.ok(!ids.includes('K46_HOLD'));
// The reverse: Jupiter inside, Mars outside -> the fort cannot be taken (v.46, v.49, v.51)
r = K.kotaChakra({ Jupiter: lon('Mrigashira'), Mars: lon('Ashwini') });
ids = r.matches.map((m) => m.id);
assert.ok(ids.includes('K46_HOLD') && ids.includes('K49') && ids.includes('K51_HOLD'));
assert.ok(!ids.includes('K46_FALL'));
// Sun, Rahu, Saturn and Mars in the four pillars (v.55)
r = K.kotaChakra({ Sun: lon('Ardra'), Rahu: lon('Hasta'), Saturn: lon('PAshadha'), Mars: lon('UBhadra') });
assert.ok(r.matches.some((m) => m.id === 'K55_STAMBHA_FOUR'));
r = K.kotaChakra({ Sun: lon('Ardra'), Rahu: lon('Hasta'), Saturn: lon('PAshadha'), Mars: lon('Rohini') });
assert.ok(!r.matches.some((m) => m.id === 'K55_STAMBHA_FOUR'));
// two benefics in the pillars: the fort is never destroyed (v.53)
r = K.kotaChakra({ Jupiter: lon('Ardra'), Venus: lon('Hasta') });
assert.ok(r.matches.some((m) => m.id === 'K53_STAMBHA_BENEFIC'));
// a benefic and a malefic in the same star: a terrible battle (v.60)
r = K.kotaChakra({ Venus: 5, Saturn: 6 });
assert.ok(r.matches.some((m) => m.id === 'K60_TOGETHER'));
r = K.kotaChakra({ Venus: 5, Saturn: 20 });
assert.ok(!r.matches.some((m) => m.id === 'K60_TOGETHER'));
// planet-in-the-inner-part rules (v.91-93)
r = K.kotaChakra({ Rahu: lon('Mrigashira') });
assert.ok(r.matches.some((m) => m.id === 'K93_Rahu') && r.matches.some((m) => m.id === 'K45_MADHYA'));
// four malefics inside, a benefic on the wall (v.47)
r = K.kotaChakra({ Sun: 56, Mars: 57, Saturn: 58, Rahu: 59, Venus: 45 });
assert.ok(r.matches.some((m) => m.id === 'K47_NO_BATTLE'));
// no verdict is invented for an empty chart
assert.deepStrictEqual(K.kotaChakra({}).matches, []);
console.log('test-kota-chakra ok');
