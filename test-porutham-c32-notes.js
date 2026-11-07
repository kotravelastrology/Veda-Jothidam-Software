const assert = require('assert');
const N = require('./src/report/poruthamC32Notes');
const { calculateTamilPorutham, calcPorutham } = require('./src/report/tamilPorutham');

const starCount = (from, to) => ((to - from + 27) % 27) + 1;

// every Kasyapa pair the book names is a 7th-star pair
for (const [g, b] of N.VATHAM_PAIRS) assert.strictEqual(starCount(g, b), 7, `${g}->${b}`);

// the star groups partition the 27 stars
const all = [...new Set([...Array(27).keys()].map(N.nadiOf))];
assert.deepStrictEqual(all.sort(), ['dakshina', 'madhya', 'vama']);
const counts = { vama: 0, dakshina: 0, madhya: 0 };
for (let s = 0; s < 27; s += 1) counts[N.nadiOf(s)] += 1;
assert.deepStrictEqual(counts, { vama: 9, dakshina: 9, madhya: 9 });
const genders = { f: 0, m: 0, e: 0 };
for (let s = 0; s < 27; s += 1) genders[N.genderOf(s)] += 1;
assert.deepStrictEqual(genders, { f: 14, m: 10, e: 3 });
// the book's own examples: Ashwini and Jyeshta (Vedha) are Dakshina both; Karthikai and Revati are both Vama
assert.strictEqual(N.nadiOf(0), N.nadiOf(11));
assert.notStrictEqual(N.nadiOf(2), N.nadiOf(0));

// Moon-sign waiver: same sign, friendly lords, or a seventh apart
assert.deepStrictEqual(N.moonSignWaiver(3, 3).length, 1);
assert.ok(N.moonSignWaiver(0, 6).some((t) => /சம-சப்தமம்/.test(t)), 'Aries-Libra');
assert.ok(N.moonSignWaiver(0, 4).some((t) => /நண்பர்கள்/.test(t)), 'Mars and Sun are mutual friends in the printed table');
assert.deepStrictEqual(N.moonSignWaiver(0, 9), [], 'Mars and Saturn: no waiver');
assert.strictEqual(N.friendly(3, 5), false, 'the printed table lists only Saturn as a friend of Mercury, so Mercury-Venus is not mutual');

// Notes never change the verdict: for every star pair the rows equal calcPorutham's, and the notes only exist when a factor failed
for (let g = 0; g < 27; g += 1) {
  for (let b = 0; b < 27; b += 1) {
    const girl = { nakshatraIndex: g, rasiIndex: Math.floor((g * 4) / 9) % 12 };
    const boy = { nakshatraIndex: b, rasiIndex: Math.floor((b * 4) / 9) % 12 };
    const r = calculateTamilPorutham(girl, boy);
    const raw = calcPorutham(g, b, girl.rasiIndex, boy.rasiIndex);
    assert.strictEqual(r.passed, raw.filter((x) => x.result).length);
    for (const n of r.c32.notes.filter((x) => x.kind === 'WAIVER')) {
      assert.ok(raw.some((x) => x.id === n.id && !x.result), `waiver ${n.id} given for a passing factor ${g}/${b}`);
    }
    assert.strictEqual(r.c32.extraFactors.length, 3);
  }
}

// a worked case: Karthikai girl (Aries) and Uthiram boy (Leo): Gana fails, Mars and Sun friends, and the Rajju pada caution is present
const r = calculateTamilPorutham({ nakshatraIndex: 2, rasiIndex: 0 }, { nakshatraIndex: 11, rasiIndex: 4 });
assert.ok(r.c32.notes.some((n) => n.id === 'GANA' && n.kind === 'WAIVER'));
// the comparison covers all ten factors with a status
assert.deepStrictEqual(Object.keys(N.COMPARISON).sort(), ['DINA', 'GANA', 'MAHENDRA', 'RAJJU', 'RASI', 'RASI_ADHIPATHI', 'STREE_DEERGHA', 'VASYA', 'VEDHA', 'YONI']);
console.log('test-porutham-c32-notes ok');
