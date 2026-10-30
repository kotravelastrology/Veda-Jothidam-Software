const assert = require('assert');
const T = require('./src/report/kpPartnerTables');
const P = require('./src/report/kpPartnerDescription');
const { calculateKpSystem } = require('./src/report/kpSystem');
const { evaluateKpMarriage } = require('./src/report/kpMarriage');

// the table: seven planets by twelve signs, each with the printed page (86-97), the English as printed and a Tamil rendering
assert.deepStrictEqual(T.PLANETS, ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']);
assert.strictEqual(T.SIGNS.length, 12);
let n = 0;
for (const p of T.PLANETS) {
  assert.strictEqual(T.TABLE[p].length, 12, p);
  let last = 0;
  for (const e of T.TABLE[p]) {
    n += 1;
    assert.ok(e.en.length > 20 && e.ta.length > 20, `${p} entry text`);
    assert.ok(e.page >= 86 && e.page <= 97, `${p} page ${e.page}`);
    assert.ok(e.page >= last, `${p} pages run forward`);
    last = e.page;
  }
}
assert.strictEqual(n, 84);
// the first page of each planet's heading in the book: Sun 86, Moon 88, Mars 89, Mercury 91, Jupiter 92, Venus 94, Saturn 95
assert.deepStrictEqual(T.PLANETS.map((p) => T.TABLE[p][0].page), [86, 88, 89, 91, 92, 94, 95]);
// spot checks against the page images
assert.ok(T.TABLE.Sun[0].en.startsWith('Middle statue, strong and well-made'));
assert.ok(T.TABLE.Sun[3].en.includes('15th July and 17th August'), 'the warning under the Sun in Cancer');
assert.ok(T.TABLE.Moon[11].en.startsWith('Below average, plumpy, fleshy, fat bloated face'));
assert.ok(T.TABLE.Mars[2].en.includes('never repays loan'));
assert.ok(T.TABLE.Mercury[5].en.startsWith('Tall, lean, brown hair') && T.TABLE.Mercury[5].page === 91, 'Mercury in Virgo begins on printed 91 and runs onto 92');
assert.ok(T.TABLE.Jupiter[10].en.startsWith('Below average, tall'), 'both heights are printed for Jupiter in Aquarius');
assert.ok(T.TABLE.Venus[8].en.includes('horse-racing, shipping'));
assert.ok(T.TABLE.Saturn[11].en.includes('persistent effort, deep intuition'));

// the engine on the audit chart (5 Oct 1990 04:30 Chennai): the 7th cusp sub-lord Mercury stands in Virgo, in the star of the Sun, who is also in Virgo
const kp = calculateKpSystem({ year: 1990, month: 10, day: 5, hour: 4, minute: 30, utcOffsetMinutes: 330, latitude: 13.0827, longitude: 80.2707, ianaTimeZone: 'Asia/Kolkata' });
const d = P.describePartner(kp);
assert.deepStrictEqual([d.first.subLord, d.first.subLordSign, d.first.starLord], ['Mercury', 'Virgo', 'Sun']);
assert.deepStrictEqual(d.first.readings.map((r) => [r.basis, r.entries[0].planet, r.entries[0].sign]), [['SUBLORD', 'Mercury', 'Virgo'], ['STARLORD_OWN_SIGN', 'Sun', 'Virgo']]);
// the 2nd cusp sub-lord is Rahu: no planet conjoined with it in Capricorn, so the aspect step is reported and the star lord (the Moon, in Pisces) is read
assert.strictEqual(d.second.subLord, 'Rahu');
const node = d.second.readings[0];
assert.deepStrictEqual([node.node, node.via, node.aspectStepNotComputed, node.entries[0].planet, node.entries[0].sign], ['Rahu', 'star', true, 'Moon', 'Pisces']);
// a node with a conjoined planet reads that planet's paragraph
const pos = { Rahu: { name: 'Rahu', sign: 'Leo', starLord: 'Mars' }, Venus: { name: 'Venus', sign: 'Leo', starLord: 'Sun' }, Mars: { name: 'Mars', sign: 'Aries', starLord: 'Ketu' } };
const r = P.resolveNode('Rahu', pos);
assert.deepStrictEqual([r.how, r.planets], ['conjoined', ['Venus']]);
// carried in the KP marriage evaluation
assert.strictEqual(evaluateKpMarriage(kp).partner.first.subLord, 'Mercury');
console.log('test-kp-partner ok');
