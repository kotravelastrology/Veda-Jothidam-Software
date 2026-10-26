const assert = require('assert');
const T = require('./src/report/poruthamTables');
const C = require('./src/report/poruthamC32');

const sorted = (a) => [...a].sort((x, y) => x - y);
const eq = (a, b) => JSON.stringify(sorted(a)) === JSON.stringify(sorted(b));

// Agreements with Kalaprakasika (the module's authority)
assert.ok(eq(C.GANA.deva, T.GANA.deva) && eq(C.GANA.manushya, T.GANA.manushya) && eq(C.GANA.rakshasa, T.GANA.rakshasa), 'Gana');
assert.deepStrictEqual(C.MAHENDRA_COUNTS, [...T.MAHENDRA_COUNTS]);
assert.strictEqual(C.STREE_DEERGHA_MINIMUM, T.STREE_DEERGHA_MINIMUM);
assert.deepStrictEqual(C.RASI_BAD_COUNTS, [...T.RASI_BAD_COUNTS]);
const rajjuName = { foot: 'padha', thigh: 'ooroo', navel: 'nabhi', neck: 'kanta', head: 'siro' };
for (const [k, v] of Object.entries(C.RAJJU)) assert.ok(eq(v, T.RAJJU_BANDS[rajjuName[k]]), `Rajju ${k}`);
// the stars C32 lists for a common janma star fall in the same Kalaprakasika grade (C32 lists 21 of 27)
for (const s of C.SAME_STAR.excellent) assert.ok(T.DINA.sameStar.excellent.includes(s), `excellent ${s}`);
for (const s of C.SAME_STAR.fair) assert.ok(T.DINA.sameStar.neutral.includes(s), `fair ${s}`);
for (const s of C.SAME_STAR.ignored) assert.ok(T.DINA.sameStar.unsuitable.includes(s), `ignored ${s}`);

// The differences, pinned so a change on either side is noticed.
const yoniDiffs = [];
for (const [y, stars] of Object.entries(C.YONI)) {
  for (const s of stars) {
    const mine = { goat: 'sheep', snake: 'serpent' }[y] || y;
    if (mine !== T.YONI_OF[s]) yoniDiffs.push(`star ${s}: C32 ${y}, Kalaprakasika ${T.YONI_OF[s]}`);
  }
}
assert.deepStrictEqual(yoniDiffs, [
  'star 11: C32 camel, Kalaprakasika cow',
  'star 22: C32 human, Kalaprakasika lion',
  'star 24: C32 human, Kalaprakasika lion',
]);

const rename = (n) => ({ goat: 'sheep', snake: 'serpent' }[n] || n);
const pairKey = (a, b) => [rename(a), rename(b)].sort().join('|');
const c32h = new Set(C.YONI_HOSTILE.map(([a, b]) => pairKey(a, b)));
const kph = new Set(T.YONI_HOSTILE.map(([a, b]) => pairKey(a, b)));
assert.deepStrictEqual([...c32h].filter((k) => !kph.has(k)), ['elephant|sheep']);
assert.deepStrictEqual([...kph].filter((k) => !c32h.has(k)).sort(), ['deer|elephant', 'mongoose|serpent']);

const vasyaDiffs = [];
for (let r = 0; r < 12; r += 1) {
  if (!eq(C.VASYA[r], T.VASYA[r])) vasyaDiffs.push(`rasi ${r}: C32 ${sorted(C.VASYA[r])}, Kalaprakasika ${sorted(T.VASYA[r])}`);
}
assert.deepStrictEqual(vasyaDiffs, ['rasi 1: C32 3,6, Kalaprakasika 3,4']);

const vk = (p) => [...p].sort((a, b) => a - b).join('-');
const c32v = new Set(C.VEDHA_PAIRS.map(vk));
const t = T.VEDHA_TRIPLE;
const kpv = new Set([...T.VEDHA_PAIRS, [t[0], t[1]], [t[0], t[2]], [t[1], t[2]]].map(vk));
assert.deepStrictEqual([...c32v].filter((k) => !kpv.has(k)), ['1-7']);
assert.deepStrictEqual([...kpv].filter((k) => !c32v.has(k)).sort(), ['1-16', '10-25', '11-24', '12-23', '13-22', '4-22']);
// the one triple link both share is Mrigasirisha-Chithra
assert.ok(c32v.has('4-13') && kpv.has('4-13'));
console.log('test-porutham-c32 ok');
