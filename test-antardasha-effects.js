/**
 * BPHS ch.52-60, the antardasha of each planet in the dasha of each of the nine (antardashaEffects.js, fixtures/dasha-effects/bphs-52-60.json):
 * the fixture's shape and the order of the book, then the placements checked against charts worked out by hand.
 */
const assert = require('assert');
const A = require('./src/report/antardashaEffects');

const ORDER = ['Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury', 'Ketu', 'Venus'];
const fx = A.FIXTURE;
assert.ok(fx.source.title && fx.source.pageLocus && fx.scope);
assert.deepStrictEqual(Object.keys(fx.pairs), ORDER);
assert.deepStrictEqual(Object.values(fx.chapters), [52, 53, 54, 55, 56, 57, 58, 59, 60]);

// the printed pages of each chapter (the scan binds pp.632-634 out of order, so the pages are the printed ones)
const PAGES = { 52: [627, 638], 53: [639, 650], 54: [651, 663], 55: [664, 677], 56: [678, 690], 57: [691, 704], 58: [705, 716], 59: [717, 729], 60: [730, 741] };
let sections = 0;
for (const dl of ORDER) {
  assert.deepStrictEqual(Object.keys(fx.pairs[dl]), ORDER, `${dl}: nine antardashas in the book's order`);
  const [lo, hi] = PAGES[fx.chapters[dl]];
  let lastFirstVerse = 0;
  // the chapter treats the dasha lord's own antardasha first, then the others in the order Sun, Moon, Mars, ...
  assert.deepStrictEqual(A.dashaAntardashas(dl, { lagnaSign: 0, signs: Object.fromEntries(ORDER.map((p) => [p, 0])), degrees: Object.fromEntries(ORDER.map((p) => [p, 1])) }).map((e) => e.antarLord), A.bookOrder(dl));
  assert.strictEqual(A.bookOrder(dl)[0], dl);
  for (const ad of A.bookOrder(dl)) {
    const list = fx.pairs[dl][ad];
    assert.ok(list.length >= 2, `${dl}-${ad} has sections`);
    assert.ok(list.some((s) => s.kind === 'fav' || s.kind === 'unfav' || s.kind === 'mixed'), `${dl}-${ad} has a result`);
    const verses = list.map((s) => s.verses.split('-').map(Number));
    // the book's verse numbers climb through the chapter, antardasha by antardasha
    assert.ok(verses[0][0] > lastFirstVerse, `${dl}-${ad}: verse ${verses[0][0]} follows ${lastFirstVerse}`);
    lastFirstVerse = verses[0][0];
    let lastPage = 0; let lastVerse = 0;
    for (const [i, s] of list.entries()) {
      sections += 1;
      assert.ok(['fav', 'unfav', 'mixed', 'remedy'].includes(s.kind), `${dl}-${ad} kind ${s.kind}`);
      assert.ok(s.page >= lo && s.page <= hi, `${dl}-${ad}: page ${s.page} lies in ch.${fx.chapters[dl]} (${lo}-${hi})`);
      assert.ok(s.page >= lastPage, `${dl}-${ad}: pages climb`);
      assert.ok(verses[i][0] >= lastVerse && verses[i][1] >= verses[i][0], `${dl}-${ad}: verses ${s.verses} climb`);
      assert.ok(s.ta.length > 10 && Array.isArray(s.conds), `${dl}-${ad}: Tamil text and conditions`);
      assert.ok((s.kind === 'remedy') === (s.conds.length === 0 && s.ta.startsWith('பரிகாரம்')) || s.conds.length === 0 || s.kind !== 'remedy', `${dl}-${ad}: a remedy names no placement`);
      lastPage = s.page; lastVerse = verses[i][0];
    }
  }
}
assert.strictEqual(sections, 421);

// every placement tag the fixture names is one the engine tests or states it does not test
const probe = { lagnaSign: 4, signs: { Sun: 4, Moon: 4, Mars: 5, Mercury: 4, Jupiter: 4, Venus: 4, Saturn: 2, Rahu: 3, Ketu: 9 }, degrees: { Sun: 10, Moon: 10, Mars: 5, Mercury: 12, Jupiter: 3, Venus: 8, Saturn: 20, Rahu: 6, Ketu: 6 }, moonWaning: false };
for (const dl of ORDER) {
  for (const ad of ORDER) {
    const e = A.antardashaEffects(dl, ad, probe);
    for (const s of e.sections) {
      for (const tag of s.conds) {
        const known = s.held.includes(tag) || s.failed.includes(tag) || s.unknown.includes(tag);
        assert.ok(known, `${dl}-${ad}: ${tag} is sorted into held, failed or unknown`);
      }
      assert.strictEqual(s.held.length + s.failed.length + s.unknown.length, s.conds.length);
    }
    // a tag that lands in `unknown` must be one the engine declares untested, not a misspelling
    const f = A.adFacts(ad, dl, probe);
    for (const s of e.sections) for (const tag of s.unknown) assert.ok(!f.tested.has(tag), `${dl}-${ad}: ${tag} is untested`);
  }
}
const untested = new Set();
for (const dl of ORDER) for (const ad of ORDER) for (const s of A.antardashaEffects(dl, ad, probe).sections) s.unknown.forEach((t) => untested.add(t));
assert.deepStrictEqual([...untested].sort(), [
  'ASPECT_BENEFIC', 'ASPECT_LORD_1_9_10', 'ASPECT_MALEFIC', 'ASPECT_Jupiter', 'ASPECT_Mars', 'ASPECT_Saturn', 'COMBUST', 'CRUEL_NAVAMSA', 'DEEP_EXALTATION', 'D_AUSPICIOUS',
  'ENEMY_SIGN', 'FRIEND_NAVAMSA', 'FRIEND_SIGN', 'INAUSPICIOUS_PLACE', 'OWN_VARGA', 'STRENGTH', 'WEAK', 'WITH_FRIEND', 'YOGAKARAKA',
].sort());

// Aries lagna: Sun in Leo, Moon in Cancer, Mars in Capricorn, Mercury in Virgo, Jupiter in Cancer, Venus in Pisces (27 degrees), Saturn in Libra,
// Rahu in Taurus, Ketu in Scorpio. 9th lord Jupiter, 10th Saturn, 2nd Venus, 7th Venus, 8th Mars.
const chart = {
  lagnaSign: 0,
  signs: { Sun: 4, Moon: 3, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6, Rahu: 1, Ketu: 7 },
  degrees: { Sun: 10, Moon: 5, Mars: 28, Mercury: 15, Jupiter: 5, Venus: 27, Saturn: 20, Rahu: 6, Ketu: 6 },
  moonWaning: false,
};
const pick = (e, kind, verses) => e.sections.find((s) => s.kind === kind && (!verses || s.verses === verses));

// Moon in the Sun's dasha (ch.52 v.4-13): Moon in Cancer is the 4th from the Lagna (a kendra), in her own sign, and the 12th from the Sun
const moon = A.antardashaEffects('Sun', 'Moon', chart);
assert.strictEqual(moon.house, 4);
assert.strictEqual(moon.houseFromDasaLord, 12);
assert.deepStrictEqual(pick(moon, 'fav', '4-6').held, ['KENDRA']);
assert.deepStrictEqual(pick(moon, 'fav', '4-6').failed, ['TRIKONA']);
const moonOwn = moon.sections.filter((s) => s.verses === '4-6')[1];
assert.deepStrictEqual(moonOwn.held, ['OWN_SIGN']);
assert.deepStrictEqual(moonOwn.failed, ['EXALTED']);
const moonBad = pick(moon, 'unfav', '7-10');
assert.deepStrictEqual(moonBad.failed, ['WANING', 'CONJ_MALEFIC']); // waxing, with Jupiter
assert.deepStrictEqual(moon.sections.filter((s) => s.verses === '7-10')[1].failed, ['H6', 'H8', 'H12']);
const away = pick(moon, 'unfav', '13-14');
assert.deepStrictEqual(away.held, ['D12']);
assert.deepStrictEqual(away.failed, ['D6', 'D8']);
assert.deepStrictEqual(away.unknown, ['WEAK']);
// Jupiter, Venus and Mercury stand 12th, 8th and 2nd from the Sun: no benefic in his 1st, 9th or a kendra; Mercury in Leo with him would be the 1st
const benef = (c) => A.antardashaEffects('Sun', 'Moon', c).sections.find((s) => s.conds.includes('BENEFIC_D_1_9_KENDRA'));
assert.deepStrictEqual(benef(chart).failed, ['BENEFIC_D_1_9_KENDRA']);
assert.deepStrictEqual(benef({ ...chart, signs: { ...chart.signs, Mercury: 4 } }).held, ['BENEFIC_D_1_9_KENDRA']);
assert.ok(moon.sections.find((s) => s.kind === 'remedy').conds.length === 0);

// Jupiter in the Sun's dasha: exalted in Cancer, 4th from the Lagna, the 9th lord (Sagittarius), 12th from the Sun, with the Moon
const jup = A.antardashaEffects('Sun', 'Jupiter', chart);
assert.deepStrictEqual(pick(jup, 'fav', '32-33').held, ['KENDRA', 'EXALTED']);
assert.deepStrictEqual(pick(jup, 'fav', '32-33').unknown, ['OWN_VARGA']);
assert.deepStrictEqual(pick(jup, 'fav', '34-36').held, ['LORD_9']);
assert.deepStrictEqual(pick(jup, 'fav', '34-36').failed, ['LORD_10']);
assert.deepStrictEqual(pick(jup, 'unfav', '37-39').failed, ['D6', 'D8', 'CONJ_MALEFIC']);

// Rahu in the Mars dasha (ch.54 v.9-14): Rahu in Taurus (his exaltation), the 2nd from the Lagna, the 5th from Capricorn
const rahu = A.antardashaEffects('Mars', 'Rahu', chart);
assert.strictEqual(rahu.house, 2);
assert.strictEqual(rahu.houseFromDasaLord, 5);
assert.deepStrictEqual(pick(rahu, 'fav', '9-10').held, ['EXALTED']);
assert.ok(pick(rahu, 'fav', '9-10').failed.includes('KENDRA'));
assert.deepStrictEqual(rahu.sections.find((s) => s.verses === '11-14' && s.conds[0] === 'H2').held, ['H2']);

// Saturn in the Rahu dasha (ch.55 v.21-29): exalted in Libra, 7th from the Lagna; and Rahu in Taurus is not "not exalted" (ch.57 v.63-64)
const sat = A.antardashaEffects('Rahu', 'Saturn', chart);
assert.ok(pick(sat, 'fav', '21-24').held.includes('EXALTED') && pick(sat, 'fav', '21-24').held.includes('KENDRA'));
const satRahu = A.antardashaEffects('Saturn', 'Rahu', chart);
assert.deepStrictEqual(pick(satRahu, 'unfav', '63-64').held, []);
assert.deepStrictEqual(pick(satRahu, 'unfav', '63-64').failed, ['NOT_EXALTED']);
assert.ok(pick(satRahu, 'fav', '68-68').held.includes('SIGN_1'));

// Venus: exalted in Pisces at 27 degrees, so exalted in the Navamsha too (the 9th part of Pisces is Pisces)
const ven = A.antardashaEffects('Venus', 'Venus', chart);
assert.ok(pick(ven, 'fav', '3-6').held.includes('EXALTED') && pick(ven, 'fav', '3-6').held.includes('EXALTED_NAVAMSA'));
assert.ok(pick(ven, 'fav', '3-6').failed.includes('OWN_NAVAMSA'));
// the antardasha of the dasha lord has no "from the dasha lord" tags to test
assert.ok(ven.houseFromDasaLord === null);

// the Moon's waxing and waning are judged only when the elongation is known
const noElongation = { ...chart, moonWaning: undefined };
const m2 = A.antardashaEffects('Sun', 'Moon', noElongation);
assert.deepStrictEqual(pick(m2, 'unfav', '7-10').unknown, ['WANING']);
const waning = A.antardashaEffects('Sun', 'Moon', { ...chart, moonWaning: true });
assert.deepStrictEqual(pick(waning, 'unfav', '7-10').held, ['WANING']);

// a planet with another in its sign: Ketu in Scorpio alone; Mars joins Saturn in Libra
const lib = { ...chart, signs: { ...chart.signs, Mars: 6 } };
const marsSat = A.antardashaEffects('Saturn', 'Mars', lib);
assert.ok(pick(marsSat, 'unfav', '58-60').held.includes('CONJ_MALEFIC'));
assert.ok(A.antardashaEffects('Saturn', 'Mars', chart).sections.find((s) => s.verses === '58-60').failed.includes('CONJ_MALEFIC'));
assert.ok(A.antardashaEffects('Venus', 'Venus', { ...chart, signs: { ...chart.signs, Saturn: 11 } }).sections.length > 0);
// a named planet in the sign: Mercury with the Sun (ch.57 v.12-13 names the Sun, Mars and Rahu)
const merSun = A.antardashaEffects('Saturn', 'Mercury', { ...chart, signs: { ...chart.signs, Mercury: 4 } });
assert.deepStrictEqual(pick(merSun, 'mixed', '12-13').held.filter((t) => t.startsWith('WITH_')), ['WITH_Sun']);

assert.strictEqual(A.dashaAntardashas('Sun', chart).length, 9);
console.log(`test-antardasha-effects: ${sections} sections of 81 antardashas; all assertions passed`);
