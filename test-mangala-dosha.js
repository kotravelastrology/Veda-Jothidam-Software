const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const M = require('./src/report/mangalaDosha');
const T = require('./src/report/mangalaDoshaTables');
const { resolveByTitle } = require('./src/sources/registry');
const { createChartContext } = require('./src/contracts/chartContext');
const { calculateParashariChart } = require('./src/chart/parashariChart');

const FIX = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/mangala-dosha/definitions.json'), 'utf8'));
const { SIGN } = M;
const H = (lagna, house) => (lagna + house - 1) % 12; // the sign of a house

/**
 * A chart from signs. The five malefics default to the 3rd from Lagna, which with
 * the default Moon (6th) and Venus (11th) is outside every dosha house counted
 * from Lagna, Moon *and* Venus — so a test sees only what it sets. (They share a
 * sign, so a test that cares about conjunction sets them explicitly.)
 */
function F(o = {}) {
  const lagna = o.lagna ?? 0;
  const rasi = {
    Sun: H(lagna, 3), Moon: H(lagna, 6), Mars: H(lagna, 3), Mercury: H(lagna, 3), Jupiter: H(lagna, 11),
    Venus: H(lagna, 11), Saturn: H(lagna, 3), Rahu: H(lagna, 3), Ketu: H(lagna, 3),
  };
  for (const g of Object.keys(rasi)) if (o[g] !== undefined) rasi[g] = o[g];
  return M.buildFacts({ lagna, rasi, nakshatra: o.nak ?? {}, retrograde: o.retro ?? {}, gender: o.gender ?? null, weekday: o.weekday ?? null });
}
const ev = (id, a, b = null) => {
  const r = M.evaluateConditions(a, b).find((e) => e.id === id);
  assert.ok(r, `condition ${id} exists`);
  return r.status;
};

// ------------------------------------------------------------ the tables ----
for (const [id, r] of Object.entries(FIX.readings)) {
  assert.deepEqual([...T.READINGS[id].houses], r.houses, `${id} houses`);
  assert.deepEqual([...T.READINGS[id].references], r.references, `${id} references`);
  assert.deepEqual([...T.READINGS[id].otherMalefics], r.otherMalefics ?? [], `${id} other malefics`);
}
assert.equal(Object.keys(T.READINGS).length, Object.keys(FIX.readings).length);
assert.equal(T.READINGS.MANSAGARI.classical, true);
assert.ok(Object.values(T.READINGS).filter((r) => r.classical).length === 1, 'exactly one reading is a classical verse');
// Vishnu Bhaskar contradicts himself and both lines are kept.
assert.deepEqual([...T.READINGS.VISHNU_BHASKAR_SUMMARY.houses], [1, 4, 7, 8, 12]);
assert.deepEqual([...T.READINGS.VISHNU_BHASKAR.houses], [1, 2, 4, 7, 8, 12]);
assert.ok(!T.READINGS.VISHNU_BHASKAR_SUMMARY.otherMalefics.includes('Sun'));
assert.ok(T.READINGS.VISHNU_BHASKAR.otherMalefics.includes('Sun'));
// The South Indian variant is Lagna's 1st replaced by the 2nd.
assert.deepEqual([...T.READINGS.VISHNU_BHASKAR_SOUTH.houses], [2, 4, 7, 8, 12]);

for (const [h, p] of Object.entries(FIX.intensityPercent)) {
  if (h !== 'page') assert.equal(T.INTENSITY_PERCENT.percent[h], p, `percent for house ${h}`);
}
// The units table matches the page, and is internally consistent: Saturn, Rahu
// and Ketu are three quarters of Mars, the Sun half, and the 1/2/12/4 columns
// are half of the 7/8 ones. That regularity is independent evidence that the
// transcription is right, not just that it was copied twice.
FIX.unitsTable.rows.forEach((d, i) => {
  assert.equal(T.UNITS.houses7_8.Mars[d], FIX.unitsTable.houses7_8.Mars[i]);
  assert.equal(T.UNITS.houses7_8.SaturnNodes[d], FIX.unitsTable.houses7_8.SaturnRahuKetu[i]);
  assert.equal(T.UNITS.houses7_8.Sun[d], FIX.unitsTable.houses7_8.Sun[i]);
  assert.equal(T.UNITS.houses1_2_12_4.Mars[d], FIX.unitsTable.houses1_2_12_4.Mars[i]);
  assert.equal(T.UNITS.houses1_2_12_4.SaturnNodes[d], FIX.unitsTable.houses1_2_12_4.SaturnRahuKetu[i]);
  assert.equal(T.UNITS.houses1_2_12_4.Sun[d], FIX.unitsTable.houses1_2_12_4.Sun[i]);
  assert.equal(T.UNITS.houses7_8.SaturnNodes[d], T.UNITS.houses7_8.Mars[d] * 0.75);
  assert.equal(T.UNITS.houses7_8.Sun[d], T.UNITS.houses7_8.Mars[d] * 0.5);
  for (const col of ['Mars', 'SaturnNodes', 'Sun']) {
    assert.equal(T.UNITS.houses1_2_12_4[col][d], T.UNITS.houses7_8[col][d] * 0.5, `${col} ${d}`);
  }
});
// Dignity rows fall by 10 for each step from debilitation to exaltation.
const marsRow = T.UNITS.dignities.map((d) => T.UNITS.houses7_8.Mars[d]);
assert.deepEqual(marsRow, [100, 90, 80, 70, 60, 50]);

// Remedies are recorded practices; the Sanskrit text of nothing is reproduced.
assert.deepEqual(FIX.remedies.beforeMarriage.length, 3);
assert.equal(T.REMEDIES.afterMarriage.items.length, FIX.remedies.afterMarriage.length);
assert.ok(!/[ऀ-ॿ]/.test(JSON.stringify([T.REMEDIES, T.GUIDANCE])), 'no Devanagari mantra text is reproduced in remedies or guidance');

// Every source resolves, is cite-only, and every condition names one.
for (const s of Object.values(T.SOURCES)) {
  const reg = resolveByTitle(s.title);
  assert.ok(reg, `${s.title} is registered`);
  assert.equal(reg.rights.status, 'RESTRICTED');
  assert.equal(reg.rights.mayShip, false);
}
for (const c of M.CONDITIONS) {
  assert.ok(T.SOURCES[c.source], `${c.id} names a known source`);
  assert.ok(c.page && c.en && c.ta, `${c.id} has a page and both texts`);
  assert.ok(['NATIVE', 'PARTNER'].includes(c.scope));
}
const idsBySource = {};
for (const c of M.CONDITIONS) (idsBySource[c.source] ??= []).push(c.id);
for (const [src, spec] of Object.entries(FIX.cancellationLists)) {
  const expected = new Set(spec.ids); const have = new Set(idsBySource[src]);
  for (const id of expected) assert.ok(have.has(id), `${id} is encoded`);
}
assert.equal(new Set(M.CONDITIONS.map((c) => c.id)).size, M.CONDITIONS.length, 'condition ids are unique');
// Mansagari's translator's list has eight items; item (iii) is split in two and
// a judgement-only paragraph is added, so ten conditions encode eight items.
assert.equal(idsBySource.MANSAGARI.length, 10);
assert.ok(idsBySource.MANSAGARI.includes('MAN_STRONG_BENEFIC'));
// Mansagari's list is the translator's own and says so on the page string.
assert.match(M.CONDITIONS.find((c) => c.id === 'MAN_I').page, /translator's list/);

// ------------------------------------------------------------- arithmetic ---
const f0 = F({ lagna: 0, Mars: SIGN.Libra }); // Libra is the 7th from Aries
assert.equal(f0.houseOf('Mars'), 7);
assert.equal(f0.houseFrom('MOON', 'Mars'), ((SIGN.Libra - f0.rasi.Moon + 12) % 12) + 1);
assert.equal(F({ lagna: 0 }).lordOfHouse(7), 'Venus', 'the 7th from Aries is Libra, Venus\'s');
assert.equal(F({ lagna: SIGN.Cancer }).lordOfHouse(7), 'Saturn', 'the 7th from Cancer is Capricorn, Saturn\'s');
assert.throws(() => M.buildFacts({ lagna: 12, rasi: {} }), /lagna/);
assert.throws(() => M.buildFacts({ lagna: 0, rasi: { Sun: 0 } }), /rasi\.Moon/);
assert.equal(F({ lagna: 0, Mars: SIGN.Libra, Jupiter: SIGN.Taurus }).aspectsGraha('Jupiter', 'Mars'), false, 'Libra is the 6th from Taurus');
assert.equal(F({ lagna: 0, Mars: SIGN.Libra, Jupiter: SIGN.Aries }).aspectsGraha('Jupiter', 'Mars'), true, 'Libra is the 7th from Aries');
assert.equal(F({ Jupiter: 0, Mars: 4 }).aspectsGraha('Jupiter', 'Mars'), true, 'Jupiter aspects the 5th');
assert.equal(F({ Jupiter: 0, Mars: 8 }).aspectsGraha('Jupiter', 'Mars'), true, 'and the 9th');
assert.equal(F({ Jupiter: 0, Mars: 6 }).aspectsGraha('Jupiter', 'Mars'), true, 'and the 7th');
assert.equal(F({ Jupiter: 0, Mars: 3 }).aspectsGraha('Jupiter', 'Mars'), false);
assert.equal(F({ Rahu: 0 }).aspectsGraha('Rahu', 'Mars'), null, 'Rahu has no sourced aspect rule');

// dignity
const dg = (s) => M.dignityOf('Mars', s);
assert.deepEqual([SIGN.Capricorn, SIGN.Cancer, SIGN.Aries, SIGN.Scorpio, SIGN.Leo, SIGN.Gemini, SIGN.Taurus].map(dg),
  ['EXAL', 'DEB', 'OH', 'OH', 'FH', 'EH', 'NH']);

// ------------------------------------------------------------- formation ---
// Mars in each house from Lagna, everything else benign, under each reading.
const expectedFromLagna = {
  MANSAGARI: [1, 4, 7, 8, 12], VISHNU_BHASKAR_SUMMARY: [1, 4, 7, 8, 12],
  VISHNU_BHASKAR: [1, 2, 4, 7, 8, 12], VISHNU_BHASKAR_SOUTH: [2, 4, 7, 8, 12], BHAGAT: [1, 2, 4, 7, 8, 12],
};
for (let house = 1; house <= 12; house += 1) {
  const f = F({ lagna: 3, Mars: H(3, house), Moon: H(3, 6), Venus: H(3, 6) });
  for (const r of M.considerFormation(f)) {
    const fromLagna = r.perReference.find((p) => p.reference === 'LAGNA');
    assert.equal(fromLagna.marsHouse, house);
    assert.equal(fromLagna.present, expectedFromLagna[r.id].includes(house), `${r.id}, Mars in house ${house}`);
  }
}
// The 2nd house is where the readings split: the classical verse and the book's
// own summary do not count it, the detailed list and Bhagat do.
const second = M.considerFormation(F({ lagna: 0, Mars: H(0, 2), Moon: H(0, 6), Venus: H(0, 6) }));
assert.deepEqual(second.filter((r) => r.presentFromLagna).map((r) => r.id), ['VISHNU_BHASKAR', 'VISHNU_BHASKAR_SOUTH', 'BHAGAT']);
// ... and Lagna itself is where the South Indian variant departs.
const first = M.considerFormation(F({ lagna: 0, Mars: H(0, 1), Moon: H(0, 6), Venus: H(0, 6) }));
assert.deepEqual(first.filter((r) => r.presentFromLagna).map((r) => r.id).sort(),
  ['BHAGAT', 'MANSAGARI', 'VISHNU_BHASKAR', 'VISHNU_BHASKAR_SUMMARY']);
// Mansagari counts from Lagna only, so Mars in the 7th from the Moon alone does not make it.
// Moon and Venus in Gemini, Mars in Sagittarius: the 7th from both, and the 9th from Aries Lagna.
const fromMoonOnly = M.considerFormation(F({ lagna: 0, Moon: SIGN.Gemini, Venus: SIGN.Gemini, Mars: SIGN.Sagittarius }));
const mansagari = fromMoonOnly.find((r) => r.id === 'MANSAGARI');
assert.equal(mansagari.present, false);
assert.deepEqual(mansagari.perReference.map((p) => p.reference), ['LAGNA']);
const bhagat = fromMoonOnly.find((r) => r.id === 'BHAGAT');
assert.equal(bhagat.present, true);
assert.equal(bhagat.presentFromLagna, false);
assert.deepEqual(bhagat.perReference.filter((p) => p.present).map((p) => p.reference), ['MOON', 'VENUS']);
// Other malefics are counted only by the readings that count them.
const withSun = M.considerFormation(F({ lagna: 0, Sun: H(0, 2), Moon: H(0, 6), Venus: H(0, 6), Mars: H(0, 3) }));
assert.equal(withSun.find((r) => r.id === 'VISHNU_BHASKAR').otherMalefics.some((o) => o.graha === 'Sun' && o.reference === 'LAGNA'), true);
assert.equal(withSun.find((r) => r.id === 'VISHNU_BHASKAR_SUMMARY').otherMalefics.some((o) => o.graha === 'Sun'), false, 'the summary line has no Sun');
assert.equal(withSun.find((r) => r.id === 'BHAGAT').otherMalefics.length, 0);

// ------------------------------------------------------------- intensity ---
const inten = (house, sign, extra = {}) => M.considerIntensity(F({ lagna: 0, Mars: sign ?? H(0, house), Moon: H(0, 6), Venus: H(0, 6), ...extra }));
let r = inten(8, SIGN.Gemini).perReference.find((p) => p.reference === 'LAGNA');
// Gemini is the 3rd from Aries, so give Mars an 8th-house sign: Scorpio (own sign).
r = inten(8, SIGN.Scorpio).perReference.find((p) => p.reference === 'LAGNA');
assert.equal(r.marsHouse, 8);
assert.equal(r.percent, 100);
assert.equal(r.marsUnits, T.UNITS.houses7_8.Mars.OH);
assert.equal(inten(8, SIGN.Scorpio).marsDignity, 'OH');
// Mars debilitated in the 7th... Cancer is the 4th from Aries; use lagna Capricorn so Cancer is the 7th.
const deb7 = M.considerIntensity(F({ lagna: SIGN.Capricorn, Mars: SIGN.Cancer, Moon: H(9, 6), Venus: H(9, 6) })).perReference[0];
assert.equal(deb7.marsHouse, 7);
assert.equal(deb7.marsUnits, 100);
// Mars exalted in the 12th: Capricorn is the 12th from Sagittarius.
const exal12 = M.considerIntensity(F({ lagna: SIGN.Sagittarius, Mars: SIGN.Capricorn, Moon: H(8, 6), Venus: H(8, 6) })).perReference[0];
assert.equal(exal12.marsHouse, 2, 'Capricorn is the 2nd from Sagittarius');
assert.equal(exal12.percent, 80);
assert.equal(exal12.marsUnits, T.UNITS.houses1_2_12_4.Mars.EXAL);
// A house that is not in the table gets no percentage and no units.
const nine = M.considerIntensity(F({ lagna: 0, Mars: H(0, 9), Moon: H(0, 6), Venus: H(0, 6) })).perReference[0];
assert.equal(nine.percent, null);
assert.equal(nine.marsUnits, 0);
// Rahu and Ketu are named as not counted rather than given an invented dignity.
const nodes = M.considerIntensity(F({ lagna: 0, Mars: H(0, 3), Rahu: H(0, 7), Ketu: H(0, 9), Moon: H(0, 6), Venus: H(0, 6) })).perReference[0];
assert.deepEqual([...nodes.nodesNotCounted], ['Rahu']);
assert.deepEqual([...M.considerIntensity(F()).perReference[0].nodesNotCounted], [], 'default nodes sit outside the dosha houses');
assert.ok(M.considerIntensity(F()).notStated.length === 3);
assert.equal(M.considerIntensity(F()).notStatedTa.length, M.considerIntensity(F()).notStated.length, 'the Tamil list matches the English one');
// Saturn's units are added where they apply (the 7th from Lagna, Saturn's own sign Capricorn: 45).
const withSat = M.considerIntensity(F({ lagna: SIGN.Cancer, Mars: H(3, 3), Saturn: SIGN.Capricorn, Moon: H(3, 6), Venus: H(3, 6) })).perReference[0];
assert.equal(withSat.units.Saturn, T.UNITS.houses7_8.SaturnNodes.OH);

// ----------------------------------------- the conditions, one at a time ---
const NA = 'NEEDS_PARTNER';
// Mansagari
assert.equal(ev('MAN_I', F({ lagna: 0, Saturn: H(0, 4) })), 'MET');
assert.equal(ev('MAN_I', F({ lagna: 0, Saturn: H(0, 5) })), 'NOT_MET');
assert.equal(ev('MAN_I', F({ lagna: 0, Saturn: H(0, 2) })), 'NOT_MET', 'the 2nd is not in Mansagari\'s five');
assert.equal(ev('MAN_II', F({ lagna: 0, Sun: H(0, 1) }), F({ lagna: 0, Rahu: H(0, 8) })), 'MET');
assert.equal(ev('MAN_II', F({ lagna: 0, Sun: H(0, 1) }), F({ lagna: 0 })), 'NOT_MET');
assert.equal(ev('MAN_II', F({ lagna: 0, Sun: H(0, 1) })), NA);
assert.equal(ev('MAN_III_A', F({ lagna: 0, Jupiter: SIGN.Aries, Venus: SIGN.Aries })), 'JUDGEMENT');
assert.equal(ev('MAN_III_A', F({ lagna: 0, Jupiter: SIGN.Aries, Venus: SIGN.Taurus })), 'NOT_MET');
assert.equal(ev('MAN_III_B', F({ Mars: SIGN.Cancer, retro: { Mars: true } })), 'MET');
assert.equal(ev('MAN_III_B', F({ Mars: SIGN.Gemini, retro: { Mars: true } })), 'MET', 'Mercury is Mars\'s enemy, so Gemini is an inimical sign');
assert.equal(ev('MAN_III_B', F({ Mars: SIGN.Leo, retro: { Mars: true } })), 'JUDGEMENT', 'combustion is not assessed');
assert.equal(ev('MAN_III_B', F({ Mars: SIGN.Cancer, retro: { Mars: false } })), 'NOT_MET');
assert.equal(ev('MAN_IV', F({ lagna: 0, Mars: SIGN.Aries })), 'MET');
assert.equal(ev('MAN_IV', F({ lagna: 0, Mars: SIGN.Capricorn })), 'MET');
assert.equal(ev('MAN_IV', F({ lagna: 0, Mars: SIGN.Scorpio })), 'NOT_MET', 'Scorpio is the 8th from Aries, not a kendra');
assert.equal(ev('MAN_V', F({ Mars: SIGN.Cancer })), 'MET');
assert.equal(ev('MAN_V', F({ Mars: SIGN.Leo })), 'NOT_MET');
assert.equal(ev('MAN_VI', F({ Mars: SIGN.Leo, Moon: SIGN.Leo })), 'MET');
assert.equal(ev('MAN_VI', F({ Mars: SIGN.Leo, Jupiter: SIGN.Leo })), 'MET');
assert.equal(ev('MAN_VI', F({ Mars: SIGN.Leo, Moon: SIGN.Virgo, Jupiter: SIGN.Libra })), 'NOT_MET');
assert.equal(ev('MAN_VII', F({ lagna: 0, Mars: H(0, 7) }), F({ lagna: 4, Mars: H(4, 1) })), 'MET');
assert.equal(ev('MAN_VII', F({ lagna: 0, Mars: H(0, 7) }), F({ lagna: 4, Mars: H(4, 3) })), 'NOT_MET');
assert.equal(ev('MAN_VIII', F({ lagna: SIGN.Taurus, Mars: SIGN.Aries })), 'MET', 'Aries is the 12th from Taurus');
assert.equal(ev('MAN_VIII', F({ lagna: SIGN.Aries, Mars: SIGN.Scorpio })), 'MET', 'Scorpio is the 8th from Aries');
assert.equal(ev('MAN_VIII', F({ lagna: SIGN.Aries, Mars: SIGN.Aries })), 'NOT_MET');
assert.equal(ev('MAN_STRONG_BENEFIC', F()), 'NOT_COMPUTED');

// Bhagat
assert.equal(ev('BHA_2', F({ Mars: SIGN.Leo })), 'MET');
assert.equal(ev('BHA_2', F({ Mars: SIGN.Gemini })), 'NOT_MET');
const cancerDetail = M.evaluateConditions(F({ Mars: SIGN.Cancer })).find((e) => e.id === 'BHA_2');
assert.equal(cancerDetail.status, 'MET');
assert.match(cancerDetail.detail, /நீச/, 'Cancer is called out as Mars\'s debilitation too');
for (const [id, house, signs, miss] of [
  ['BHA_3', 2, [SIGN.Gemini, SIGN.Virgo], SIGN.Aries], ['BHA_4', 4, [SIGN.Aries, SIGN.Scorpio], SIGN.Gemini],
  ['BHA_5', 7, [SIGN.Cancer, SIGN.Capricorn], SIGN.Leo], ['BHA_6', 8, [SIGN.Sagittarius, SIGN.Pisces], SIGN.Aries],
  ['BHA_7', 12, [SIGN.Taurus, SIGN.Libra], SIGN.Aries],
]) {
  // choose a Lagna that puts the sign in the named house
  for (const s of signs) assert.equal(ev(id, F({ lagna: (s - (house - 1) + 12) % 12, Mars: s })), 'MET', `${id} ${s}`);
  assert.equal(ev(id, F({ lagna: (signs[0] - (house - 1) + 12) % 12, Mars: miss })), 'NOT_MET', `${id} wrong sign`);
  assert.equal(ev(id, F({ lagna: (signs[0] - (house) + 12) % 12, Mars: signs[0] })), 'NOT_MET', `${id} wrong house`);
}
assert.equal(ev('BHA_8', F({ lagna: SIGN.Cancer })), 'MET');
assert.equal(ev('BHA_8', F({ lagna: SIGN.Leo })), 'MET');
assert.equal(ev('BHA_8', F({ lagna: SIGN.Virgo })), 'NOT_MET');
assert.equal(ev('BHA_9', F({ lagna: SIGN.Aquarius, Mars: H(10, 4) })), 'MET');
assert.equal(ev('BHA_9', F({ lagna: SIGN.Aquarius, Mars: H(10, 8) })), 'MET');
assert.equal(ev('BHA_9', F({ lagna: SIGN.Aquarius, Mars: H(10, 5) })), 'NOT_MET');
assert.equal(ev('BHA_9', F({ lagna: SIGN.Pisces, Mars: H(11, 4) })), 'NOT_MET');
assert.equal(ev('BHA_10', F({ lagna: 2, Jupiter: 2 })), 'MET');
assert.equal(ev('BHA_10', F({ lagna: 2, Venus: 2 })), 'MET');
assert.equal(ev('BHA_10', F({ lagna: 2 })), 'NOT_MET');
assert.equal(ev('BHA_11', F({ Mars: SIGN.Leo, Moon: SIGN.Leo })), 'MET');
assert.equal(ev('BHA_11', F({ Mars: SIGN.Leo, Jupiter: SIGN.Aries })), 'MET', 'Jupiter aspects the 5th: Leo is the 5th from Aries');
assert.equal(ev('BHA_11', F({ Mars: SIGN.Leo, Moon: SIGN.Pisces, Jupiter: SIGN.Taurus })), 'NOT_MET');
assert.equal(ev('BHA_12', F({ Mars: SIGN.Leo, Saturn: SIGN.Leo })), 'MET');
assert.equal(ev('BHA_12', F({ Mars: SIGN.Leo, Saturn: SIGN.Gemini })), 'MET', 'Saturn aspects the 3rd: Leo is the 3rd from Gemini');
assert.equal(ev('BHA_12', F({ Mars: SIGN.Leo, Saturn: SIGN.Aquarius })), 'MET', 'and the 7th');
assert.equal(ev('BHA_12', F({ Mars: SIGN.Leo, Saturn: SIGN.Scorpio })), 'MET', 'and the 10th');
// With no conjunction or aspect from the four, Rahu's aspect cannot be ruled out
// (no sourced rule for it), so this is NOT_COMPUTED rather than NOT_MET.
assert.equal(ev('BHA_12', F({ Mars: SIGN.Leo, Sun: SIGN.Taurus, Mercury: SIGN.Taurus, Saturn: SIGN.Taurus, Rahu: SIGN.Pisces })), 'NOT_COMPUTED');
assert.equal(ev('BHA_12', F({ Mars: SIGN.Leo, Rahu: SIGN.Leo, Sun: SIGN.Taurus, Mercury: SIGN.Taurus, Saturn: SIGN.Taurus })), 'MET', 'Rahu conjunct is a plain conjunction');
// The two Characteristics
assert.equal(ev('BHA_TUESDAY', F({ weekday: 2 })), 'MET');
assert.equal(ev('BHA_TUESDAY', F({ weekday: 3 })), 'NOT_MET');
assert.equal(ev('BHA_TUESDAY', F()), 'NOT_COMPUTED');
assert.equal(ev('BHA_BOTH', F({ lagna: 0, Mars: H(0, 7) }), F({ lagna: 5, Mars: H(5, 2) })), 'MET', 'the 2nd counts for Bhagat');
assert.equal(ev('BHA_BOTH', F({ lagna: 0, Mars: H(0, 7) }), F({ lagna: 5, Mars: H(5, 3), Moon: H(5, 6), Venus: H(5, 6) })), 'NOT_MET');
assert.equal(ev('BHA_BOTH', F({ lagna: 0, Mars: H(0, 7) })), NA);

// Vishnu Bhaskar — native's chart (printed pp.99-100)
const lagnaFor = (sign, house) => (sign - (house - 1) + 12) % 12; // a Lagna that puts `sign` in `house`
assert.equal(ev('VB_A', F({ lagna: SIGN.Aries, Mars: SIGN.Aries })), 'MET');
assert.equal(ev('VB_A', F({ lagna: lagnaFor(SIGN.Sagittarius, 12), Mars: SIGN.Sagittarius })), 'MET');
assert.equal(ev('VB_A', F({ lagna: lagnaFor(SIGN.Scorpio, 4), Mars: SIGN.Scorpio })), 'MET');
assert.equal(ev('VB_A', F({ lagna: lagnaFor(SIGN.Capricorn, 7), Mars: SIGN.Capricorn })), 'MET');
assert.equal(ev('VB_A', F({ lagna: lagnaFor(SIGN.Cancer, 8), Mars: SIGN.Cancer })), 'MET');
assert.equal(ev('VB_A', F({ lagna: lagnaFor(SIGN.Cancer, 7), Mars: SIGN.Cancer })), 'NOT_MET', 'right sign, wrong house');
assert.equal(ev('VB_B', F({ lagna: lagnaFor(SIGN.Libra, 12), Mars: SIGN.Libra })), 'MET');
assert.equal(ev('VB_B', F({ lagna: lagnaFor(SIGN.Virgo, 2), Mars: SIGN.Virgo })), 'MET');
assert.equal(ev('VB_B', F({ lagna: lagnaFor(SIGN.Taurus, 4), Mars: SIGN.Taurus })), 'MET');
assert.equal(ev('VB_B', F({ lagna: lagnaFor(SIGN.Cancer, 7), Mars: SIGN.Cancer })), 'MET', 'exalted or debilitated in the 7th');
assert.equal(ev('VB_B', F({ lagna: lagnaFor(SIGN.Pisces, 8), Mars: SIGN.Pisces })), 'MET');
assert.equal(ev('VB_B', F({ lagna: lagnaFor(SIGN.Leo, 12), Mars: SIGN.Leo })), 'NOT_MET');
assert.equal(ev('VB_C', F({ Mars: SIGN.Leo, Venus: SIGN.Leo })), 'JUDGEMENT');
assert.equal(ev('VB_C', F({ Mars: SIGN.Leo, Venus: SIGN.Virgo, Moon: SIGN.Libra, Mercury: SIGN.Libra, Rahu: SIGN.Libra })), 'NOT_MET');
assert.equal(ev('VB_D', F({ Mars: SIGN.Leo })), 'MET');
assert.equal(ev('VB_D', F({ Mars: SIGN.Aquarius })), 'MET');
assert.equal(ev('VB_D', F({ Mars: SIGN.Virgo })), 'NOT_MET');
assert.equal(ev('VB_E', F({ lagna: SIGN.Cancer, Mars: SIGN.Cancer })), 'MET');
assert.equal(ev('VB_E', F({ lagna: SIGN.Leo, Mars: SIGN.Leo })), 'MET');
assert.equal(ev('VB_E', F({ lagna: SIGN.Virgo, Mars: SIGN.Virgo })), 'NOT_MET');
assert.equal(ev('VB_E', F({ lagna: SIGN.Cancer, Mars: SIGN.Leo })), 'NOT_MET', 'not in Lagna');
assert.equal(ev('VB_F', F({ Mars: SIGN.Aquarius })), 'MET');
assert.equal(ev('VB_F', F({ Mars: SIGN.Sagittarius })), 'MET');
assert.equal(ev('VB_F', F({ Mars: SIGN.Gemini })), 'NOT_MET');
assert.equal(ev('VB_G', F({ gender: 'female', lagna: 0, Jupiter: H(0, 9) })), 'MET');
assert.equal(ev('VB_G', F({ gender: 'female', lagna: 0, Jupiter: H(0, 6) })), 'NOT_MET');
assert.equal(ev('VB_G', F({ gender: 'male', lagna: 0, Jupiter: H(0, 9) })), 'NOT_COMPUTED', 'a rule for females only');
assert.equal(ev('VB_G', F({ lagna: 0 })), 'NOT_COMPUTED', 'no sex given');
assert.equal(ev('VB_H', F({ Mars: SIGN.Leo, Jupiter: SIGN.Aries })), 'MET');
assert.equal(ev('VB_H', F({ Mars: SIGN.Leo, Jupiter: SIGN.Taurus })), 'NOT_MET');
assert.equal(ev('VB_I', F({ Mars: SIGN.Capricorn, Saturn: SIGN.Aries })), 'MET', 'Mars in Saturn\'s sign, Saturn in Mars\'s');
assert.equal(ev('VB_I', F({ Mars: SIGN.Sagittarius, Jupiter: SIGN.Aries })), 'MET', 'Mars in Jupiter\'s sign, Jupiter in Mars\'s');
assert.equal(ev('VB_I', F({ Mars: SIGN.Capricorn, Saturn: SIGN.Taurus })), 'NOT_MET');
assert.equal(ev('VB_J', F({ Mars: SIGN.Libra })), 'MET', 'movable sign');
assert.equal(ev('VB_J', F({ Mars: SIGN.Leo, retro: { Saturn: true } })), 'MET');
assert.equal(ev('VB_J', F({ Mars: SIGN.Leo, retro: { Mars: true } })), 'MET');
assert.equal(ev('VB_J', F({ Mars: SIGN.Leo })), 'NOT_MET');
assert.equal(ev('VB_K', F({ lagna: 0, Venus: H(0, 2), Moon: H(0, 7) })), 'JUDGEMENT');
assert.equal(ev('VB_K', F({ lagna: 0, Venus: H(0, 3), Moon: H(0, 7) })), 'NOT_MET');
assert.equal(ev('VB_K', F({ lagna: 0, Venus: H(0, 2), Moon: H(0, 6) })), 'NOT_MET');
assert.equal(ev('VB_L', F({ nak: { Mars: 18 } })), 'MET');
assert.equal(ev('VB_L', F({ nak: { Mars: 0 } })), 'MET');
assert.equal(ev('VB_L', F({ nak: { Mars: 9 } })), 'MET');
assert.equal(ev('VB_L', F({ nak: { Mars: 5 } })), 'NOT_MET');
assert.equal(ev('VB_L', F()), 'NOT_COMPUTED');
assert.equal(ev('VB_M', F({ lagna: 0, Mars: H(0, 7), retro: { Mars: true } })), 'MET');
assert.equal(ev('VB_M', F({ lagna: 0, Mars: H(0, 7) })), 'NOT_MET');
assert.equal(ev('VB_M', F({ lagna: 0, Mars: H(0, 3), retro: { Mars: true } })), 'NOT_MET', 'retrograde, but not in a relevant bhava');
assert.equal(ev('VB_N', F({ lagna: 0, Venus: H(0, 7) })), 'JUDGEMENT');
assert.equal(ev('VB_N', F({ lagna: 0, Venus: H(0, 1) })), 'JUDGEMENT', 'Venus in Lagna aspects the 7th');
assert.equal(ev('VB_N', F({ lagna: 0, Venus: H(0, 3) })), 'NOT_MET');
assert.equal(ev('VB_O', F({ lagna: 0, Mars: SIGN.Taurus, Venus: H(0, 11), Moon: H(0, 6) })), 'NOT_MET', 'Mars is in Venus\'s sign, but the 7th lord Venus in the 11th is not in a kendra or trikona');
assert.equal(ev('VB_O', F({ lagna: 0, Mars: SIGN.Taurus, Venus: H(0, 10) })), 'JUDGEMENT', '7th lord in a kendra');
assert.equal(ev('VB_O', F({ lagna: 0, Mars: SIGN.Leo })), 'NOT_MET');
assert.equal(ev('VB_P', F({ lagna: 0, Mars: SIGN.Gemini, Mercury: H(0, 4) })), 'MET', 'the dispositor Mercury is in the 4th from Lagna');
assert.equal(ev('VB_P', F({ lagna: 0, Mars: SIGN.Gemini, Mercury: H(0, 6), Moon: H(0, 11) })), 'NOT_MET', 'Mercury in Virgo: the 6th from Aries and the 8th from an Aquarius Moon');
assert.equal(ev('VB_Q', F()), 'NOT_COMPUTED');
assert.equal(ev('VB_R', F()), 'NOT_COMPUTED');

// Vishnu Bhaskar — partner's chart
assert.equal(ev('VBP_1', F({ lagna: 0, Mars: H(0, 1) }), F({ lagna: 0, Mars: H(0, 7) })), 'MET');
assert.equal(ev('VBP_1', F({ lagna: 0, Mars: H(0, 2) }), F({ lagna: 0, Mars: H(0, 8) })), 'MET');
assert.equal(ev('VBP_1', F({ lagna: 0, Mars: H(0, 2) }), F({ lagna: 0, Mars: H(0, 7) })), 'NOT_MET');
assert.equal(ev('VBP_1', F({ lagna: 0, Mars: H(0, 2) })), NA);
assert.equal(ev('VBP_2', F({ lagna: 0, Mars: H(0, 7) }), F({ lagna: 0, Saturn: H(0, 8), Rahu: H(0, 8) })), 'MET');
assert.equal(ev('VBP_2', F({ lagna: 0, Mars: H(0, 8) }), F({ lagna: 0, Saturn: H(0, 7), Sun: H(0, 7) })), 'MET');
assert.equal(ev('VBP_2', F({ lagna: 0, Mars: H(0, 7) }), F({ lagna: 0, Saturn: H(0, 8), Rahu: H(0, 7) })), 'NOT_MET', 'Saturn and Rahu must be together');
assert.equal(ev('VBP_2', F({ lagna: 0, Mars: H(0, 3) }), F({ lagna: 0, Saturn: H(0, 8), Rahu: H(0, 8) })), 'NOT_MET');
assert.equal(ev('VBP_3', F({ lagna: 0, Sun: H(0, 1) }), F({ lagna: 0, Saturn: H(0, 4) })), 'MET', 'one malefic each in 12/1/2/4');
assert.equal(ev('VBP_3', F({ lagna: 0, Sun: H(0, 1) }), F({ lagna: 0, Saturn: H(0, 4), Mars: H(0, 2) })), 'NOT_MET', 'one against two');
assert.equal(ev('VBP_3', F({ lagna: 0 }), F({ lagna: 0 })), 'NOT_MET', 'two empty charts are not "equal malefics"');
assert.equal(ev('VBP_4', F({ lagna: 0, Mars: H(0, 2), nak: { Moon: 5 } }), F({ lagna: 0, nak: { Moon: 17 } })), 'MET', 'an 80% dosha, a partner born in Jyeshtha');
assert.equal(ev('VBP_4', F({ lagna: 0, Mars: H(0, 2), nak: { Moon: 5 } }), F({ lagna: 0, nak: { Moon: 18 } })), 'MET', 'or in Mula');
assert.equal(ev('VBP_4', F({ lagna: 0, Mars: H(0, 7), nak: { Moon: 5 } }), F({ lagna: 0, nak: { Moon: 17 } })), 'NOT_MET', '100% is outside 50-80');
assert.equal(ev('VBP_4', F({ lagna: 0, Mars: H(0, 2), nak: { Moon: 17 } }), F({ lagna: 0, nak: { Moon: 18 } })), 'NOT_MET', 'the first was born in Jyeshtha');
assert.equal(ev('VBP_4', F({ lagna: 0, Mars: H(0, 2), nak: { Moon: 5 } }), F({ lagna: 0, Mars: H(0, 1), nak: { Moon: 17 } })), 'NOT_MET', 'the partner must be non-Manglik');
assert.equal(ev('VBP_4', F({ lagna: 0, Mars: H(0, 2) }), F({ lagna: 0 })), 'NOT_COMPUTED', 'needs the stars');
// 5A-5G: one malefic here, none in the partner
const oneHere = { lagna: 0, Sun: H(0, 1) };
assert.equal(ev('VBP_5A', F({ ...oneHere, Moon: SIGN.Leo }), F({ lagna: 0, Moon: SIGN.Aquarius })), 'MET', 'Moon signs 1/7 apart');
assert.equal(ev('VBP_5A', F({ ...oneHere }), F({ lagna: 0 })), 'MET', 'same Lagna');
assert.equal(ev('VBP_5A', F({ ...oneHere, Moon: SIGN.Leo }), F({ lagna: 4, Moon: SIGN.Gemini })), 'NOT_MET');
assert.equal(ev('VBP_5A', F({ lagna: 0, Sun: H(0, 1), Saturn: H(0, 4) }), F({ lagna: 0 })), 'NOT_MET', 'two malefics here: the precondition fails');
assert.equal(ev('VBP_5B', F({ ...oneHere, Moon: 3, nak: { Moon: 5 } }), F({ lagna: 0, Moon: 3, nak: { Moon: 6 } })), 'MET');
assert.equal(ev('VBP_5B', F({ ...oneHere, Moon: 3, nak: { Moon: 5 } }), F({ lagna: 0, Moon: 3, nak: { Moon: 5 } })), 'NOT_MET');
assert.equal(ev('VBP_5C', F(oneHere), F({ lagna: 0 })), 'NOT_COMPUTED', 'no Ashtakoota score exists in this software');
assert.equal(ev('VBP_5D', F({ ...oneHere, Moon: 3, nak: { Moon: 8 } }), F({ lagna: 0, Moon: 4, nak: { Moon: 8 } })), 'MET');
assert.equal(ev('VBP_5D', F({ ...oneHere, Moon: 3, nak: { Moon: 8 } }), F({ lagna: 0, Moon: 3, nak: { Moon: 8 } })), 'NOT_MET');
assert.equal(ev('VBP_5E', F(oneHere), F({ lagna: 0 })), 'NOT_COMPUTED');
// Gana comes from the Kalaprakasika-corrected table: Ashwini (0) deva, Mula (18) rakshasa? check from the table itself.
const { GANA_OF } = require('./src/report/poruthamTables');
const devaStar = GANA_OF.indexOf('deva'); const rakStar = GANA_OF.indexOf('rakshasa');
assert.equal(ev('VBP_5F', F({ ...oneHere, nak: { Moon: devaStar } }), F({ lagna: 0, nak: { Moon: rakStar } })), 'MET');
assert.equal(ev('VBP_5F', F({ ...oneHere, nak: { Moon: rakStar } }), F({ lagna: 0, nak: { Moon: devaStar } })), 'NOT_MET');
assert.equal(ev('VBP_5G', F({ lagna: 0, Sun: H(0, 4) }), F({ lagna: 0, Saturn: H(0, 4) })), 'MET', 'a malefic in the same bhava');
assert.equal(ev('VBP_5G', F({ lagna: 0, Sun: H(0, 4) }), F({ lagna: 0, Saturn: H(0, 5) })), 'NOT_MET');
// the two "does not cancel" rules are flagged as negative
const negs = M.CONDITIONS.filter((c) => c.negative).map((c) => c.id).sort();
assert.deepEqual(negs, ['VBP_NOT_78', 'VBP_NOT_SAME']);
assert.equal(ev('VBP_NOT_78', F({ lagna: 0, Mars: H(0, 7) }), F({ lagna: 0, Mars: H(0, 8) })), 'MET');
assert.equal(ev('VBP_NOT_78', F({ lagna: 0, Mars: H(0, 7) }), F({ lagna: 0, Mars: H(0, 7) })), 'NOT_MET');
assert.equal(ev('VBP_NOT_SAME', F({ lagna: 0, Mars: H(0, 8) }), F({ lagna: 0, Mars: H(0, 8) })), 'MET');
assert.equal(ev('VBP_NOT_SAME', F({ lagna: 0, Mars: H(0, 3) }), F({ lagna: 0, Mars: H(0, 3) })), 'NOT_MET', 'the same irrelevant house is nothing');
assert.equal(ev('VBP_MS', F({ lagna: 0, Mars: 4, Saturn: 4 }), F({ lagna: 0, Mars: 2, Saturn: 8 })), 'MET', 'conjunct here, 1/7 there');
assert.equal(ev('VBP_MS', F({ lagna: 0, Mars: 4, Saturn: 4 }), F({ lagna: 0, Mars: 2, Saturn: 5 })), 'NOT_MET');
assert.equal(ev('VBP_RM', F({ lagna: 0, Mars: H(0, 7), Rahu: H(0, 7) }), F({ lagna: 0, Mars: H(0, 1), Rahu: H(0, 1) })), 'MET');
assert.equal(ev('VBP_RM', F({ lagna: 0, Mars: H(0, 7), Rahu: H(0, 7) }), F({ lagna: 0, Mars: H(0, 3), Rahu: H(0, 3) })), 'NOT_MET');

// Every conditions in the PARTNER scope says so without a partner, and none in the NATIVE scope does.
for (const e of M.evaluateConditions(F())) {
  if (e.scope === 'PARTNER') assert.equal(e.status, NA, e.id);
  else assert.notEqual(e.status, NA, e.id);
}
// Every status is one of the five, and detail travels with it.
for (const e of M.evaluateConditions(F({ lagna: 0, Mars: H(0, 7) }), F({ lagna: 3, Mars: H(3, 8) }))) {
  assert.ok(['MET', 'NOT_MET', 'JUDGEMENT', 'NOT_COMPUTED'].includes(e.status), `${e.id}: ${e.status}`);
}

// ------------------------------------------------- no merged verdict -------
const a = M.analyseChart(F({ lagna: 0, Mars: H(0, 7), Moon: H(0, 6), Venus: H(0, 6) }));
assert.equal(a.formation.length, 5);
assert.equal(a.tamilNotFound.names.length, 3, 'the page can say the Tamil texts hold no Mangala rule');
assert.ok(a.results.length >= 1 && a.results.every((x) => x.textTa && x.page));
assert.deepEqual(Object.keys(a.summary).sort(), ['BHAGAT', 'MANSAGARI', 'VISHNU_BHASKAR']);
assert.ok(!('verdict' in a) && !('cancelled' in a) && !('overall' in a), 'there is no single verdict');
const total = Object.values(a.summary).reduce((n, s) => n + s.MET + s.NOT_MET + s.JUDGEMENT + s.NOT_COMPUTED + s.NEEDS_PARTNER + s.negativeMet, 0);
assert.equal(total, M.CONDITIONS.length, 'every condition is counted exactly once');

// ------------------------------------------------------ the two charts ------
const pair = (g, b) => M.analysePair(g, b).units.verdict.code;
const marsAt = (house, sign) => F({ lagna: 0, Mars: sign ?? H(0, house), Moon: H(0, 6), Venus: H(0, 6) });
assert.equal(pair(marsAt(3), marsAt(3)), 'BOTH_ZERO');
// Girl 7H Mars own-sign... Aries is the 1st from Aries, so use Libra (7th, Venus's sign: neutral for Mars) for both: equal
assert.equal(pair(marsAt(7, SIGN.Libra), marsAt(7, SIGN.Libra)), 'EQUAL');
assert.equal(pair(marsAt(7, SIGN.Libra), marsAt(3)), 'FEMALE_HIGHER', 'the girl\'s units exceed the boy\'s');
assert.equal(pair(marsAt(3), marsAt(7, SIGN.Libra)), 'MALE_25_PERCENT_MORE');
// boy a little higher: girl Mars 7H neutral (80), boy Mars 7H neutral + Saturn adds
const girl80 = marsAt(7, SIGN.Libra);
const boy90 = F({ lagna: 0, Mars: SIGN.Libra, Saturn: H(0, 12), Moon: H(0, 6), Venus: H(0, 6) }); // adds Saturn units
const between = M.analysePair(girl80, boy90).units;
assert.ok(between.boy > between.girl);
assert.equal(between.verdict.code, between.boy >= between.girl * 1.25 ? 'MALE_25_PERCENT_MORE' : 'BETWEEN');
assert.ok(M.analysePair(girl80, boy90).units.notStated.length === 3);
const pr = M.analysePair(girl80, girl80);
assert.equal(pr.guidance.length, 2);
assert.ok(pr.guidance.every((g) => g.sources.length >= 1 && g.sources.every((s) => s.page)));
// The pair view feeds each side the other as partner.
assert.ok(pr.girl.conditions.every((c) => c.status !== NA) && pr.boy.conditions.every((c) => c.status !== NA));

// ------------------------------------------------------------ a real chart --
const input = { year: 1990, month: 5, day: 15, hour: 10, minute: 30, latitude: 11.341, longitude: 77.7172, utcOffsetMinutes: 330, ianaTimeZone: 'Asia/Kolkata' };
const chart = calculateParashariChart(createChartContext({ ...input, calendarMode: 'tirukanita' }));
const real = M.factsFromChart(chart, { input, gender: 'female' });
assert.equal(real.lagna, chart.lagna.rasiIndex);
for (const g of M.GRAHAS) assert.equal(real.rasi[g], chart.grahas[g].rasiIndex);
assert.equal(real.weekday, 2, '15 May 1990 was a Tuesday');
assert.equal(real.nakshatra.Moon, Math.floor(chart.grahas.Moon.longitude / (360 / 27)));
// The Vedic day starts at sunrise: the same date at 04:00 belongs to Monday, at 07:00 to Tuesday.
const wk = (hour) => {
  const inp = { ...input, hour, minute: 0 };
  const c = calculateParashariChart(createChartContext({ ...inp, calendarMode: 'tirukanita' }));
  return M.vedicWeekday({ julianDay: c.julianDay, latitude: inp.latitude, longitude: inp.longitude, utcOffsetMinutes: inp.utcOffsetMinutes });
};
assert.equal(wk(4), 1, 'before sunrise is still Monday');
assert.equal(wk(7), 2);
assert.equal(wk(23), 2, 'late evening is the same Vedic day');
assert.equal(wk(1), 1);
// Retrograde detection against a well-known period: Mars was retrograde from
// 30 Oct 2022 to 12 Jan 2023 (public ephemeris knowledge, used here only as a
// sanity check on the day-apart longitude test, not as a source).
const jd = (y, m, d) => Date.UTC(y, m - 1, d) / 86400000 + 2440587.5;
assert.equal(M.isRetrograde(jd(2022, 12, 1), 'Mars', 'Lahiri'), true);
assert.equal(M.isRetrograde(jd(2023, 3, 1), 'Mars', 'Lahiri'), false);
assert.equal(M.isRetrograde(jd(2022, 10, 1), 'Mars', 'Lahiri'), false);
// The ayanamsha moves the Moon-sign-dependent answers only where it moves a sign; the adapter keeps the chart's own.
const realChart = M.analyseChart(real);
assert.equal(realChart.formation.length, 5);
// This chart: Mars in Aquarius, the 8th from a Cancer Lagna.
assert.equal(real.houseOf('Mars'), 8);
assert.equal(realChart.formation.find((x) => x.id === 'MANSAGARI').present, true);
assert.equal(realChart.formation.find((x) => x.id === 'VISHNU_BHASKAR_SOUTH').perReference[0].marsHouse, 8);

console.log(JSON.stringify({
  pass: true,
  conditions: M.CONDITIONS.length,
  bySource: Object.fromEntries(Object.entries(idsBySource).map(([k, v]) => [k, v.length])),
  readings: Object.keys(T.READINGS),
  secondHouseSplitsReadings: second.filter((x) => x.presentFromLagna).map((x) => x.id),
}, null, 2));
