const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const G = require('./src/report/gemstones');
const T = require('./src/report/gemstoneTables');
const { resolveByTitle } = require('./src/sources/registry');
const { RASI_LORD } = require('./src/chart/karaka');

const FIX = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/gemstones/definitions.json'), 'utf8'));
const SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const range = (n) => Array.from({ length: n }, (_, i) => i);

// ------------------------------------------------------------ lordship -----
for (const lagna of range(12)) {
  const lords = G.lordships(lagna);
  const all = Object.values(lords).flat().sort((a, b) => a - b);
  assert.deepEqual(all, range(12).map((i) => i + 1), `every house has exactly one lord from ${SIGNS[lagna]}`);
  assert.equal(lords.Sun.length, 1);
  assert.equal(lords.Moon.length, 1);
  assert.deepEqual(lords[RASI_LORD[lagna]].includes(1), true, 'the Ascendant lord rules the 1st');
}
assert.deepEqual(G.lordships(0), { Sun: [5], Moon: [4], Mars: [1, 8], Mercury: [3, 6], Jupiter: [9, 12], Venus: [2, 7], Saturn: [10, 11] });
assert.throws(() => G.lordships(12), /0-11/);
assert.throws(() => G.lordships(-1), /0-11/);

// --------------------------------- the second transcription agrees with the first
const parseEntry = (s) => {
  const [v, lords, ...flags] = s.split('|');
  const e = { v, lords: lords ? lords.split(',').map(Number) : [] };
  for (const f of flags) {
    if (f === 'dasha') e.dasha = true;
    else if (f === 'own') e.own = true;
    else if (f === 'exalted') e.exalted = true;
    else if (f === 'eye') e.eyeTrouble = true;
    else if (f === 'extreme') e.extremeNeed = true;
    else if (f === 'duhsthana') e.duhsthana = true;
    else if (f === 'slip') e.printedAsEmerald = true;
    else if (f.startsWith('at=')) e.houses = f.slice(3).split(',').map(Number);
    else if (f.startsWith('with=')) e.with = f.slice(5).split('+');
    else assert.fail(`unknown flag ${f}`);
  }
  return e;
};
let entries = 0;
SIGNS.forEach((sign, i) => {
  for (const p of T.PLANETS) {
    const want = parseEntry(FIX.tilakRaj[sign][p]);
    const got = T.TILAK_RAJ_BY_SIGN[i][p];
    assert.deepEqual(JSON.parse(JSON.stringify(got)), want, `${sign} ${p}`);
    entries += 1;
  }
});
assert.equal(entries, 84, '12 signs x 7 gems');

// Kapoor
FIX.kapoorRulingStone.rows.forEach((row, i) => {
  const [sign, lord, gem] = row.split('|');
  assert.equal(sign, SIGNS[i]);
  assert.equal(T.KAPOOR_RULING_STONE.table[i].lord, lord);
  assert.equal(T.KAPOOR_RULING_STONE.table[i].gem, gem);
  // and the printed lord is the real lord of the sign, and the gem is that planet's gem
  assert.equal(RASI_LORD[i], lord);
  assert.equal(G.GEM_PLANET[gem], lord, `${gem} is ${lord}'s gem`);
});

// Raj Kumar
FIX.rajKumar.rows.forEach((row, i) => {
  const [sign, benefic, malefic] = row.split('|');
  assert.equal(sign, SIGNS[i]);
  assert.deepEqual([...T.RAJ_KUMAR_TABLE.rows[i].benefic], benefic.split(', ').filter(Boolean));
  assert.deepEqual([...T.RAJ_KUMAR_TABLE.rows[i].malefic], malefic.split(', ').filter(Boolean));
});
assert.equal(T.RAJ_KUMAR_TABLE.rows[3].malefic.length, 0, 'Cancer prints no malefic gems');
assert.deepEqual([...T.RAJ_KUMAR_TABLE.rows[6].malefic], [...T.RAJ_KUMAR_TABLE.rows[5].malefic], 'Libra is "Do" for the row above');

// The nine gems, in planet order, with their Tamil names
const order = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
assert.deepEqual(order.map((p) => T.PLANET_GEMS[p].ta), FIX.tamilNames.order);
assert.equal(T.PLANET_GEMS.Saturn.en, 'Blue sapphire', 'the verse gives Saturn nila even though the English rendering omits it');
assert.match(T.PLANET_GEMS_SOURCE.pageLocus, /omits Saturn/);
assert.match(T.TAMIL_NAMES_NOTE, /OCR/, 'the Tamil names are flagged as OCR-only');

// ----------------------------------------- independent checks on the books ---
// Tilak Raj's stated lordships against the real ones. Every stated house is real
// except one printed error, and the omissions are exactly the documented ones.
const wrong = []; const omitted = [];
SIGNS.forEach((sign, i) => {
  const lords = G.lordships(i);
  for (const p of T.PLANETS) {
    const e = T.TILAK_RAJ_BY_SIGN[i][p];
    for (const h of e.lords) if (!lords[p].includes(h)) wrong.push(`${sign} ${p} says ${h}, really ${lords[p].join('/')}`);
    for (const h of lords[p]) if (!e.lords.includes(h)) omitted.push(`${sign} ${p} omits ${h}`);
  }
});
assert.deepEqual(wrong, ['Pisces Venus says 7, really 3/8'], 'one printed error, confirmed on the page image');
assert.deepEqual(omitted.sort(), [
  'Aquarius Saturn omits 12', 'Aries Mars omits 8', 'Pisces Venus omits 8', 'Sagittarius Moon omits 8', 'Taurus Venus omits 6',
]);
assert.equal(FIX.knownBookErrors.length, 2);

// Raj Kumar's table against his own two rules.
for (const row of T.RAJ_KUMAR_TABLE.rows) {
  const lords = G.lordships(row.sign);
  const planets = (names) => names.map((g) => G.GEM_PLANET[g]);
  // no gem he calls malefic is a lord of the 1st, 5th or 9th
  for (const p of planets(row.malefic)) {
    assert.ok(!lords[p].some((h) => [1, 5, 9].includes(h)), `${SIGNS[row.sign]}: malefic ${p} rules ${lords[p]}`);
  }
  // every benefic gem rules the 1st, 4th, 5th, 9th or 10th (his section 4.8) — except Cancer's ruby
  for (const p of planets(row.benefic)) {
    const ok = lords[p].some((h) => [1, 4, 5, 9, 10].includes(h));
    if (!ok) assert.equal(`${SIGNS[row.sign]} ${p}`, 'Cancer Sun', 'the one benefic gem outside his own 1/4/5/9/10 rule');
  }
  // and none of them rules ONLY a 6th, 7th, 8th or 12th: mixed lordships are resolved in favour of the good house
  for (const p of planets(row.benefic)) {
    assert.ok(!lords[p].every((h) => [6, 7, 8, 12].includes(h)), `${SIGNS[row.sign]}: ${p}`);
  }
}
const conflicts = T.RAJ_KUMAR_TABLE.rows.filter((row) => row.benefic
  .some((g) => G.lordships(row.sign)[G.GEM_PLANET[g]].some((h) => [6, 7, 8, 12].includes(h)))).length;
assert.equal(conflicts, 8, 'in 8 of 12 signs a gem he calls benefic is also the gem of a 6th/7th/8th/12th lord, which his first rule forbids');

// ---------------------------------------------------------- verdict codes ---
const codes = Object.keys(T.VERDICTS);
for (const sign of T.TILAK_RAJ_BY_SIGN) {
  for (const p of T.PLANETS) {
    const e = sign[p];
    assert.ok(codes.includes(e.v), e.v);
    for (const g of e.with ?? []) assert.ok(T.PLANETS.includes(g) && g !== p, `${p} with ${g}`);
    // a "JEEVANA" entry is the Ascendant lord's own gem
  }
}
SIGNS.forEach((s, i) => {
  const jeevana = T.PLANETS.filter((p) => T.TILAK_RAJ_BY_SIGN[i][p].v === 'JEEVANA');
  assert.ok(jeevana.length <= 1, `${s}: one Jeevana Ratna at most`);
  if (jeevana.length) assert.equal(jeevana[0], RASI_LORD[i], `${s}: the Jeevana Ratna is the Ascendant lord's`);
});
// ... and for 9 of 12 signs the book uses the word; the other three (Capricorn, Aries... checked below) do not.
const withoutWord = SIGNS.filter((s, i) => !T.PLANETS.some((p) => T.TILAK_RAJ_BY_SIGN[i][p].v === 'JEEVANA'));
assert.deepEqual(withoutWord, ['Capricorn'], 'only Capricorn\'s Ascendant-lord gem is not called Jeevana Ratna (printed p.31: "will prove to be favourable")');
assert.deepEqual(Object.values(T.VERDICTS).map((v) => v.stance).filter((s) => !['FAV', 'COND', 'UNFAV'].includes(s)), []);

// ----------------------------------------------------------------- reading --
const cancerRasi = { Sun: 0, Moon: 8, Mars: 10, Mercury: 1, Jupiter: 5, Venus: 2, Saturn: 9, Rahu: 4, Ketu: 10 };
const r = G.gemReading({ lagna: 3, moon: 8, rasi: cancerRasi });
assert.equal(r.lagnaLord, 'Moon');
assert.equal(r.kapoor.rulingStone.gem, 'White pearl');
assert.equal(r.rows.length, 7);
const row = (p) => r.rows.find((x) => x.planet === p);
assert.equal(row('Moon').kapoor.class, 'RULING');
assert.equal(row('Moon').tilakRaj.verdict, 'JEEVANA');
assert.equal(row('Moon').agreement, 'AGREE_FAVOURABLE');
assert.equal(row('Mars').kapoor.class, 'AUSPICIOUS_ONLY', 'Mars rules the 5th and 10th from Cancer');
assert.equal(row('Mars').agreement, 'AGREE_FAVOURABLE');
// The two books really do disagree about the ruby for a Cancer Ascendant.
assert.equal(row('Sun').tilakRaj.verdict, 'AVOID');
assert.equal(row('Sun').rajKumarLagna.listed, 'BENEFIC');
assert.equal(row('Sun').agreement, 'DISAGREE');
assert.equal(row('Saturn').tilakRaj.verdict, 'NEVER');
assert.equal(row('Saturn').kapoor.class, 'MIXED_LORDSHIP', 'rules the 7th and 8th: Kapoor\'s general rule does not settle it');
assert.equal(row('Saturn').agreement, 'ONE_SOURCE');
assert.equal(row('Mercury').kapoor.class, 'MIXED_LORDSHIP');
assert.deepEqual(row('Mercury').actualLords, [3, 12]);
// Kapoor's "never strengthen" applies to a pure 6/8/12 lord: find one.
assert.equal(G.kapoorClass('Venus', 0, [6]), 'DUSTHANA_ONLY');
assert.equal(G.kapoorClass('Venus', 0, [6, 8]), 'DUSTHANA_ONLY');
assert.equal(G.kapoorClass('Venus', 0, [2, 7]), 'AUSPICIOUS_ONLY');
assert.equal(G.kapoorClass('Venus', 0, [6, 7]), 'MIXED_LORDSHIP');
assert.equal(G.kapoorClass('Venus', 0, []), 'NO_LORDSHIP');
assert.equal(G.kapoorClass('Mars', 0, [1, 8]), 'RULING', 'the Ascendant lord is ruling even if it also rules the 8th');
// The counts add up and no row is lost.
assert.equal(Object.values(r.agreementCounts).reduce((a, b) => a + b, 0), 7);
// Tamil text is generated from the fields, so it carries each condition.
assert.match(G.describeEntry(T.TILAK_RAJ_BY_SIGN[0].Saturn, 'Saturn'), /சனி தசையில்/);
assert.match(G.describeEntry(T.TILAK_RAJ_BY_SIGN[0].Saturn, 'Saturn'), /1, 2, 4, 5, 9, 10, 11-ஆம் இடத்தில்/);
assert.match(G.describeEntry(T.TILAK_RAJ_BY_SIGN[0].Moon, 'Moon'), /பவழம்/, 'worn with coral');
assert.match(G.describeEntry(T.TILAK_RAJ_BY_SIGN[8].Jupiter, 'Jupiter'), /Emerald/, 'the printing slip is flagged');
assert.match(G.describeEntry(T.TILAK_RAJ_BY_SIGN[3].Sun, 'Sun'), /கண் நோய்/);
// Misstated and omitted lordships travel with the row.
const pisces = G.gemReading({ lagna: 11, moon: 0 });
const venus = pisces.rows.find((x) => x.planet === 'Venus');
assert.deepEqual(venus.tilakRaj.misstatedLords, [7]);
assert.deepEqual(venus.tilakRaj.omittedLords, [8]);
assert.deepEqual(G.gemReading({ lagna: 0, moon: 0 }).rows.find((x) => x.planet === 'Mars').tilakRaj.omittedLords, [8]);

// Moon sign vs Ascendant for Raj Kumar: two rows, not a choice of the stronger.
const split = G.gemReading({ lagna: 0, moon: 6 });
assert.deepEqual(split.rajKumar.lagnaRow.malefic, ['Emerald', 'Diamond']);
assert.deepEqual(split.rajKumar.moonRow.malefic, ['Ruby', 'Coral', 'Yellow sapphire']);
assert.ok(split.rajKumar.notJudged.length === 3, 'strength, yogakaraka and combustion are named as not judged');
// His rules per planet, from each point of count
const fromMoon = split.rajKumar.rulesFromMoon.find((x) => x.planet === 'Venus');
assert.deepEqual(fromMoon.houses, [1, 8], 'from a Libra Moon, Venus rules the 1st and 8th');
assert.equal(fromMoon.rule123, true);
assert.equal(fromMoon.forbiddenLords, true);
assert.equal(fromMoon.conflict, true, 'a planet that rules both a favourable and a forbidden house is flagged, not resolved');
assert.equal(G.rajKumarRules(0, { Sun: 9, Moon: 0, Mars: 9, Mercury: 0, Jupiter: 3, Venus: 0, Saturn: 6, Rahu: 0, Ketu: 6 }).find((x) => x.planet === 'Mars').dignity, 'EXALTED');
assert.equal(G.rajKumarRules(0, { Sun: 9, Moon: 0, Mars: 9, Mercury: 0, Jupiter: 3, Venus: 0, Saturn: 6, Rahu: 0, Ketu: 6 }).find((x) => x.planet === 'Jupiter').dignity, 'EXALTED', 'Jupiter in Cancer');
assert.equal(G.rajKumarRules(0, { Sun: 9, Moon: 0, Mars: 3, Mercury: 0, Jupiter: 9, Venus: 0, Saturn: 6, Rahu: 0, Ketu: 6 }).find((x) => x.planet === 'Mars').dignity, 'DEBILITATED');
assert.equal(G.rajKumarRules(0, null).every((x) => x.dignity === null), true, 'no chart, no dignity');

// Rahu and Ketu (Tilak Raj only)
for (const lagna of range(12)) {
  const n = G.gemReading({ lagna, moon: 0 }).nodes.rahu;
  const want = [2, 5, 1, 6, 9, 10].includes(lagna) ? 'FAV' : [0, 7, 3, 4].includes(lagna) ? 'NOT_FOR_THIS_LAGNA' : 'NOT_UNLESS_ESSENTIAL';
  assert.equal(n.status, want, SIGNS[lagna]);
}
const ketu = G.gemReading({ lagna: 0, moon: 0, rasi: { ...cancerRasi, Ketu: 1 } }).nodes.ketu;
assert.equal(ketu.ketuHouse, 2);
assert.equal(ketu.houseFavourable, true);
assert.equal(G.gemReading({ lagna: 0, moon: 0, rasi: { ...cancerRasi, Ketu: 0 } }).nodes.ketu.houseFavourable, false, 'Ketu in the 1st is not in his list');
assert.equal(G.gemReading({ lagna: 0, moon: 0 }).nodes.ketu.houseFavourable, null, 'no chart, no Ketu house');
assert.match(ketu.conditionNotJudged, /மதிப்பிடப்படவில்லை/);

// ------------------------------------------------------- no recommendation --
const keys = JSON.stringify(Object.keys(r)) + JSON.stringify(Object.keys(r.rows[0]));
assert.ok(!/recommend|prescri|should/i.test(keys), 'the result recommends nothing');
assert.ok(r.rows.every((x) => !('wear' in x)));
assert.ok(r.rules.kapoor.every((x) => x.page && x.textTa));
assert.ok(r.rules.rajKumar.length === 3 && r.rules.tilakRaj.length === 2);
// the two Raj Kumar lordship rules contradict each other and both are present
assert.match(r.rules.rajKumar[2].textTa, /முரண்படுகிறது/);

// ------------------------------------------------------------- citations ---
for (const s of Object.values(T.SOURCES)) {
  const reg = resolveByTitle(s.title);
  assert.ok(reg, `${s.title} is registered`);
  assert.equal(reg.rights.status, 'RESTRICTED');
  assert.equal(reg.rights.mayShip, false);
}
for (const list of Object.values(T.RULES)) for (const rule of list) assert.ok(rule.source.pageLocus && resolveByTitle(rule.source.title));
assert.ok(!/[ऀ-ॿ]/.test(JSON.stringify([T.RULES, T.RAJ_KUMAR_TABLE, T.TILAK_RAJ_NODES])), 'no Sanskrit text is reproduced beyond a short quoted fragment');

// ------------------------------------------------------------- validation ---
assert.throws(() => G.gemReading({ lagna: 12, moon: 0 }), /lagna/);
assert.throws(() => G.gemReading({ lagna: 0, moon: -1 }), /moon/);
assert.throws(() => G.gemReading({ lagna: 0, moon: 0, rasi: { ...cancerRasi, Ketu: 12 } }), /rasi\.Ketu/);
assert.deepEqual(JSON.parse(JSON.stringify(G.gemReading({ lagna: 3, moon: 8, rasi: cancerRasi }))), JSON.parse(JSON.stringify(r)), 'deterministic');

console.log(JSON.stringify({
  pass: true,
  tilakRajEntriesChecked: entries,
  bookErrorFound: wrong,
  omittedLordships: omitted.length,
  rajKumarSignsWithAForbiddenLordBenefic: conflicts,
  cancerLagna: r.agreementCounts,
}, null, 2));
