/**
 * BPHS ch.83 (src/report/curseYogas.js, fixture bphs-83.json): the fixture's shape, each kind of condition on charts worked by hand, and some whole yogas.
 */
const assert = require('node:assert/strict');
const C = require('./src/report/curseYogas');

const D = C.DATA;
assert.ok(D.source.title && D.source.pageLocus && D.scope.length > 400 && D.general.ta.length > 60 && D.grahaRemedies.ta.length > 80);
assert.deepEqual(D.curses.map((c) => c.id), ['SERPENT', 'FATHER', 'MOTHER', 'BROTHER', 'UNCLE', 'BRAHMIN', 'WIFE', 'ANCESTORS']);
assert.deepEqual(D.curses.map((c) => c.yogas.length), [8, 11, 13, 10, 4, 9, 11, 9]);
for (const c of D.curses) {
  assert.ok(c.ta && c.remedy.ta.length > 60 && c.remedy.verses && c.remedy.page, c.id);
  assert.deepEqual(c.yogas.map((y) => y.n), c.yogas.map((_, i) => i + 1), c.id);
  const [a, b] = c.page.split('-').map(Number);
  assert.ok(a >= 987 && (b ?? a) <= 1002, c.id);
  for (const y of c.yogas) for (const at of [...y.atoms, ...(y.loose ?? [])]) assert.ok(C.describe(at).length > 3 && !/^[\w:@,=+>]+$/.test(C.describe(at)), `${c.id} ${y.n} ${JSON.stringify(at)}`);
}

// the Aries Lagna, houses = signs + 1 (Aries 1st ... Pisces 12th); longitudes mid-sign unless set
const make = (signs, extra = {}) => {
  const all = { Sun: 0, Moon: 0, Mars: 0, Mercury: 0, Jupiter: 0, Venus: 0, Saturn: 0, Rahu: 0, Ketu: 6, ...signs };
  const longitudes = Object.fromEntries(['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].map((p) => [p, all[p] * 30 + 15]));
  return { signs: all, longitudes: { ...longitudes, ...(extra.longitudes ?? {}) }, lagnaSign: extra.lagnaSign ?? 0, gulikaSign: extra.gulikaSign ?? 5 };
};
const atom = (f, a) => C.reader(f).atom(a);

// planets in houses, lords, conjunctions
let f = make({ Rahu: 4, Mars: 10, Sun: 8 });
assert.equal(atom(f, 'Rahu@5'), true);
assert.equal(atom(f, 'Rahu@4,6'), false);
assert.equal(atom(f, 'Rahu@4,5'), true);
assert.equal(atom(f, 'lord5@9'), true, 'the 5th is Leo, its lord the Sun, in Sagittarius, the 9th');
assert.equal(atom(f, 'lord1@11'), true, 'Aries: Mars in Aquarius, the 11th');
assert.equal(atom(f, 'Sun+Jupiter'), false);
f = make({ Sun: 4, Jupiter: 4, Moon: 4 });
assert.equal(atom(f, 'Sun+Jupiter+Moon'), true);
assert.equal(atom(f, 'lord5+Jupiter'), true);
// the lords of the houses
assert.equal(atom(make({}), 'lord:h5=Sun'), true);
assert.equal(atom(make({}), 'lord:h9=Jupiter'), true);
assert.equal(atom(make({}), 'sign:h5=Leo'), true);
assert.equal(atom(make({}), 'sign:h5=Aries,Scorpio'), false);
assert.equal(atom(make({}, { lagnaSign: 7 }), 'sign:h5=Aries,Scorpio'), false, 'the 5th from Scorpio is Pisces');
assert.equal(atom(make({}, { lagnaSign: 3 }), 'sign:h1=Cancer'), true);

// occupancy
f = make({ Sun: 4, Saturn: 4, Mars: 4, Jupiter: 1 });
assert.equal(atom(f, 'occ:5=Sun,Saturn,Mars'), true);
assert.equal(atom(f, 'occ:5=Sun,Moon'), false);
assert.equal(atom(f, 'occ:5=mal'), true);
assert.equal(atom(f, 'occ:2=ben'), true);
assert.equal(atom(f, 'occ:2=mal'), false);
assert.equal(atom(f, 'any:Sun,Venus@5'), true);
assert.equal(atom(f, 'any:Venus,Moon@5'), false);

// aspects counted by signs: Mars in Aquarius aspects Taurus (4th), Leo (7th) and Gemini (8th)
f = make({ Mars: 10, Rahu: 4 });
assert.equal(atom(f, 'asp:Mars>Rahu'), true);
f = make({ Mars: 10, Rahu: 6 }); // Libra is the 9th from Aquarius
assert.equal(atom(f, 'asp:Mars>Rahu'), false);
f = make({ Mars: 10 });
assert.equal(atom(f, 'asp:mal>h5'), true, 'Mars aspects Leo from Aquarius');
assert.equal(atom(make({ Saturn: 6, Moon: 1 }), 'asp:Saturn>Moon'), false, 'Taurus is the 8th from Libra');
assert.equal(atom(make({ Saturn: 6, Moon: 8 }), 'asp:Saturn>Moon'), true, 'Saturn in Libra aspects Sagittarius by its 3rd');

// hemmed between malefics: a malefic in the 12th and the 2nd from the sign
f = make({ Sun: 4, Mars: 6, Saturn: 4 });
assert.equal(atom(f, 'kartari:Sun'), false);
f = make({ Moon: 4, Mars: 3, Saturn: 5 });
assert.equal(atom(f, 'kartari:Moon'), true);
assert.equal(atom(f, 'kartari:h5'), true);
assert.equal(atom(make({ Moon: 4, Mars: 3, Jupiter: 5 }), 'kartari:Moon'), false);

// debilitation and navamsha owners
assert.equal(atom(make({ Sun: 6 }), 'deb:Sun'), true);
assert.equal(atom(make({ Sun: 0 }), 'deb:Sun'), false);
assert.equal(atom(make({ Moon: 7 }), 'deb:Moon'), true);
assert.equal(atom(make({ Jupiter: 9 }), 'deb:Jupiter'), true);
assert.equal(atom(make({ Rahu: 4 }), 'deb:Rahu'), false);
// Sun at Libra 15 deg: the 5th navamsha of Libra, counted from Libra: Aquarius (Saturn's)
assert.equal(atom(make({ Sun: 6 }), 'nav:Sun=Saturn'), true);
assert.equal(atom(make({ Sun: 6 }), 'nav:Sun=mal'), true);
assert.equal(atom(make({ Sun: 6 }), 'nav:Sun=Venus'), false);
// signs owned by
assert.equal(atom(make({ Jupiter: 4 }), 'insign:Jupiter=Sun'), true);
assert.equal(atom(make({ Jupiter: 9 }), 'insign:Jupiter=mal'), true, 'Capricorn is Saturn\'s');
assert.equal(atom(make({ Jupiter: 11 }), 'insign:Jupiter=mal'), false);
assert.equal(atom(make({ Rahu: 8 }), 'insign:Rahu=Jupiter'), true);
// with a malefic or benefic; enemies; aspected by a debilitated planet
f = make({ Moon: 3, Saturn: 3 });
assert.equal(atom(f, 'withmal:Moon'), true);
assert.equal(atom(f, 'withben:Moon'), false);
assert.equal(atom(make({ Mars: 2 }), 'inim:Mars'), true, 'Mars in Gemini, Mercury\'s sign');
assert.equal(atom(make({ Mars: 0 }), 'inim:Mars'), false);
assert.equal(atom(make({ Saturn: 0, Jupiter: 6 }), 'aspdeb:Jupiter'), true, 'Saturn debilitated in Aries aspects Libra by its 7th');
assert.equal(atom(make({ Saturn: 0, Jupiter: 5 }), 'aspdeb:Jupiter'), false);

// exchange of houses between the lords of the 5th and the 10th: Sun in Capricorn (the 10th), Saturn in Leo (the 5th)
assert.equal(atom(make({ Sun: 9, Saturn: 4 }), 'exch:5,10'), true);
assert.equal(atom(make({ Sun: 9, Saturn: 3 }), 'exch:5,10'), false);
// the waning Moon and Gulika
assert.equal(atom(make({ Moon: 8, Sun: 0 }, { longitudes: { Moon: 250, Sun: 15 } }), 'waning'), true);
assert.equal(atom(make({}, { longitudes: { Moon: 100, Sun: 15 } }), 'waning'), false);
assert.equal(atom(make({}, { gulikaSign: 0 }), 'Gulika@1'), true);
assert.equal(atom(make({}, { gulikaSign: 5 }), 'Gulika@1'), false);
// strength and combustion are not checked
for (const a of ['weak:Jupiter', 'strong:Sun,Mars', 'combust:lord5']) assert.equal(atom(make({}), a), 'unknown');
// or
assert.equal(C.reader(make({ Rahu: 4 })).atom({ or: [['Rahu@1'], ['Rahu@5']] }), true);
assert.equal(C.reader(make({ Rahu: 3 })).atom({ or: [['Rahu@1'], ['Rahu@5']] }), false);
assert.equal(C.reader(make({ Rahu: 3 })).atom({ or: [['Rahu@1'], ['weak:Rahu']] }), 'unknown');
assert.throws(() => atom(make({}), 'nonsense:1'));

// whole yogas: the serpent's 1st (Rahu in the 5th aspected by Mars from Aquarius)
const yoga = (id, n) => D.curses.find((c) => c.id === id).yogas[n - 1];
const read = (id, n, facts) => C.readYoga(C.reader(facts), yoga(id, n)).status;
assert.equal(read('SERPENT', 1, make({ Rahu: 4, Mars: 10 })), 'held');
assert.equal(read('SERPENT', 1, make({ Rahu: 4, Mars: 2 })), 'not-held');
// the 3rd needs the strength of the lord of the 5th: unclear when the rest holds (Jupiter with Rahu, the Lagna lord Mars with the Lagna lord)
assert.equal(read('SERPENT', 3, make({ Jupiter: 2, Rahu: 2, Mars: 5 })), 'not-held', 'Mars must be with the Lagna lord, which is Mars itself');
assert.equal(read('SERPENT', 3, make({ Jupiter: 2, Rahu: 2 })), 'not-held', 'lord1+Mars is a planet with itself');
// the 6th: the 5th is Aries (from a Sagittarius Lagna) or Scorpio (from Cancer), its lord Mars with Rahu or Mercury
assert.equal(read('SERPENT', 6, make({ Mars: 0, Rahu: 0 }, { lagnaSign: 8 })), 'held');
assert.equal(read('SERPENT', 6, make({ Mars: 0, Mercury: 0, Rahu: 5 }, { lagnaSign: 8 })), 'held', 'or with Mercury');
assert.equal(read('SERPENT', 6, make({ Mars: 7, Rahu: 7 }, { lagnaSign: 3 })), 'held');
assert.equal(read('SERPENT', 6, make({ Mars: 0, Rahu: 5, Mercury: 6 }, { lagnaSign: 8 })), 'not-held');
// the father's 8th: the translator's order holds, the looser reading is unclear, anything else is not
const strict = make({ Sun: 0, Mars: 4, Saturn: 4, Rahu: 7, Jupiter: 11 });
assert.equal(read('FATHER', 8, strict), 'held');
const loose = make({ Mars: 0, Saturn: 4, Sun: 4, Jupiter: 7, Rahu: 11 });
assert.equal(read('FATHER', 8, loose), 'unknown', 'Mars in the Lagna, the Sun and Saturn in the 5th, Jupiter in the 8th and Rahu in the 12th');
assert.equal(read('FATHER', 8, make({ Sun: 0, Mars: 4, Saturn: 4, Rahu: 7 })), 'not-held', 'nothing in the 12th');
// the father's 10th: lord of the 12th (Jupiter, Pisces) in the Lagna, lord of the 8th (Mars, Scorpio) in the 5th, lord of the 10th (Saturn) in the 8th
assert.equal(read('FATHER', 10, make({ Jupiter: 0, Mars: 4, Saturn: 7 })), 'held');
// the father's 4th is unclear: the Lagna lord (Mars) is in the 5th and the 5th and the Lagna hold malefics, but strength and combustion are not checked
assert.equal(read('FATHER', 4, make({ Mars: 4, Sun: 0, Saturn: 4 })), 'unknown');
// the mother's 13th: Mars, Rahu and Jupiter in the 8th, Saturn and the Moon in the 5th
assert.equal(read('MOTHER', 13, make({ Mars: 7, Rahu: 7, Jupiter: 7, Saturn: 4, Moon: 4 })), 'held');
assert.equal(read('MOTHER', 13, make({ Mars: 7, Rahu: 7, Jupiter: 6, Saturn: 4, Moon: 4 })), 'not-held');
// the mother's 11th: a Cancer Lagna with Mars and Rahu in it and the Moon and Saturn in the 5th (Scorpio)
assert.equal(read('MOTHER', 11, make({ Mars: 3, Rahu: 3, Moon: 7, Saturn: 7 }, { lagnaSign: 3 })), 'held');
// the mother's 9th: the Moon waning in the 7th with Rahu in the 4th, Saturn in the 5th and the Lagna between malefics
assert.equal(read('MOTHER', 9, make({ Moon: 6, Rahu: 3, Saturn: 4, Mars: 11, Ketu: 1 }, { longitudes: { Moon: 200, Sun: 15 } })), 'held', 'Mars in Pisces and Ketu in Taurus hem in the Aries Lagna; the Moon is 185 degrees ahead of the Sun');
// the brother's 2nd cannot hold as printed: Mars in the Lagna and in the 8th
for (let s = 0; s < 12; s += 1) assert.equal(read('BROTHER', 2, make({ Mars: s, Saturn: 4 })), 'not-held');
// the uncle's 1st: Mercury, Jupiter, Mars and Rahu in the 5th and Saturn in the Lagna
assert.equal(read('UNCLE', 1, make({ Mercury: 4, Jupiter: 4, Mars: 4, Rahu: 4, Saturn: 0 })), 'held');
// the Brahmin's 9th: Rahu with Jupiter in the 12th
assert.equal(read('BRAHMIN', 9, make({ Rahu: 11, Jupiter: 11 })), 'held');
assert.equal(read('BRAHMIN', 9, make({ Rahu: 11, Jupiter: 10 })), 'not-held');
// the wife's 11th: Rahu in the Lagna, Saturn in the 5th, Mars in the 9th, the lords of the 5th (Sun) and 7th (Venus) in the 8th
assert.equal(read('WIFE', 11, make({ Rahu: 0, Saturn: 4, Mars: 8, Sun: 7, Venus: 7 })), 'held');
// the ancestors' 7th: Saturn in the Lagna, Rahu in the 5th, the Sun in the 8th, Mars in the 12th
assert.equal(read('ANCESTORS', 7, make({ Saturn: 0, Rahu: 4, Sun: 7, Mars: 11 })), 'held');
// the ancestors' 5th: Venus, Jupiter, Rahu and the Moon in the Lagna, Saturn and the Lagna lord (Mars) in the 8th
assert.equal(read('ANCESTORS', 5, make({ Venus: 0, Jupiter: 0, Rahu: 0, Moon: 0, Saturn: 7, Mars: 7 })), 'held');
// the general yogas are about strength only
assert.deepEqual(C.evaluate(make({})).filter((r) => r.id === 'GENERAL').map((r) => r.status), ['not-checked', 'not-held'], 'the 1st is all strength; the 2nd needs four planets in the 5th');
assert.equal(C.evaluate(make({ Sun: 4, Mars: 4, Rahu: 4, Saturn: 4 })).find((r) => r.id === 'GENERAL' && r.n === 2).status, 'unknown');
assert.equal(C.evaluate(make({})).length, 77);
console.log('test-curse-yogas: all assertions passed');
