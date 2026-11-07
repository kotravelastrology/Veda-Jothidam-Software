const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const G = require('./src/report/gemstones');
const T = require('./src/report/gemstoneTables');
const KB = require('./src/report/gemstoneKapoor');
const { WEARING } = require('./src/report/gemstoneWearing');
const { resolveByTitle } = require('./src/sources/registry');
const { RASI_LORD } = require('./src/chart/karaka');

const FIX = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/gemstones/definitions.json'), 'utf8'));
const SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const range = (n) => Array.from({ length: n }, (_, i) => i);
const sorted = (a) => [...a].sort((x, y) => (x < y ? -1 : x > y ? 1 : 0));
const plain = (o) => JSON.parse(JSON.stringify(o));

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

// --------------------------------------------------------- book order -----
assert.deepEqual(T.BOOK_RANK.order.map((b) => b.key), ['kapoor', 'tilakRaj', 'rajKumar']);
for (const b of T.BOOK_RANK.order) assert.equal(b.words, FIX.bookRank.counts[b.key], `${b.key} word count matches the record`);
const words = T.BOOK_RANK.order.map((b) => b.words);
assert.deepEqual(words, [...words].sort((a, b) => b - a), 'the books are ordered by how much they explain, most first');
assert.deepEqual(plain(T.BOOK_RANK.alternative.words), FIX.bookRank.wholeChapter);
assert.equal(Object.entries(T.BOOK_RANK.alternative.words).sort((a, b) => b[1] - a[1])[0][0], 'kapoor', 'Kapoor is first by either measure');

// --------------------------------- the second transcription agrees with the first
// Tilak Raj
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
    assert.deepEqual(plain(T.TILAK_RAJ_BY_SIGN[i][p]), parseEntry(FIX.tilakRaj[sign][p]), `${sign} ${p}`);
    entries += 1;
  }
});
assert.equal(entries, 84, '12 signs x 7 gems');

// Kapoor, chapter V: verdict, lordship, page, pairing and every placement case
const parseKapoor = (s) => {
  const [v, lords, page, ...flags] = s.split('|');
  const e = { v, lords: lords.split(',').map(Number), page: Number(page), cases: [] };
  for (const f of flags) {
    if (f === 'dasha') e.dasha = true;
    else if (f === 'charm') e.charm = true;
    else if (f.startsWith('must=')) e.must = f.slice(5);
    else if (f.startsWith('with=')) e.with = f.slice(5).split('+');
    else if (f.startsWith('also=')) e.also = f.slice(5).split('+');
    else if (f.startsWith('slip=')) e.slip = f.slice(5);
    else if (f.startsWith('case=')) {
      const [houses, qual, cv] = f.slice(5).split(':');
      const c = { v: cv };
      if (houses !== '-') c.at = sorted(houses.split(',').map(Number));
      if (qual === 'own') c.own = true;
      else if (qual === 'exalted') c.exalted = true;
      else if (qual.startsWith('with-')) c.withPlanet = qual.slice(5);
      else if (qual.startsWith('withany-')) c.withAny = qual.slice(8).split('+');
      else assert.equal(qual, '', `unknown case qualifier ${qual}`);
      e.cases.push(c);
    } else assert.fail(`unknown Kapoor flag ${f}`);
  }
  return e;
};
const kapoorKey = (e) => ({
  v: e.v, lords: e.lords, page: e.page, dasha: Boolean(e.dasha), charm: Boolean(e.charm), must: e.must ?? null,
  with: e.with ?? [], also: e.also ?? [], slip: e.slip ?? null,
  cases: (e.cases ?? []).map((c) => ({ ...c, ...(c.at ? { at: sorted(c.at) } : {}) })),
});
let kapoorEntries = 0;
for (const p of T.PLANETS) {
  assert.equal(KB.KAPOOR_BY_GEM[p].length, 12, `${p}: twelve Ascendants`);
  SIGNS.forEach((sign, i) => {
    assert.deepEqual(kapoorKey(plain(KB.KAPOOR_BY_GEM[p][i])), kapoorKey(parseKapoor(FIX.kapoor.byGem[p][i])), `Kapoor ${p} ${sign}`);
    kapoorEntries += 1;
  });
}
assert.equal(kapoorEntries, 84);

// Kapoor ruling stone
FIX.kapoorRulingStone.rows.forEach((row, i) => {
  const [sign, lord, gem] = row.split('|');
  assert.equal(sign, SIGNS[i]);
  assert.equal(T.KAPOOR_RULING_STONE.table[i].lord, lord);
  assert.equal(T.KAPOOR_RULING_STONE.table[i].gem, gem);
  assert.equal(RASI_LORD[i], lord);
  assert.equal(G.GEM_PLANET[gem], lord, `${gem} is ${lord}'s gem`);
});

// Raj Kumar table
FIX.rajKumar.rows.forEach((row, i) => {
  const [sign, benefic, malefic] = row.split('|');
  assert.equal(sign, SIGNS[i]);
  assert.deepEqual([...T.RAJ_KUMAR_TABLE.rows[i].benefic], benefic.split(', ').filter(Boolean));
  assert.deepEqual([...T.RAJ_KUMAR_TABLE.rows[i].malefic], malefic.split(', ').filter(Boolean));
});
assert.equal(T.RAJ_KUMAR_TABLE.rows[3].malefic.length, 0, 'Cancer prints no malefic gems');
assert.deepEqual([...T.RAJ_KUMAR_TABLE.rows[6].malefic], [...T.RAJ_KUMAR_TABLE.rows[5].malefic], 'Libra is "Do" for the row above');

// Tilak Raj's two tables on printed p.21
const TR_GEM = { Coral: 'Mars', Ruby: 'Sun', Topaz: 'Jupiter', Diamond: 'Venus', Emerald: 'Mercury', Sapphire: 'Saturn', Pearl: 'Moon' };
FIX.tilakRajTables.ratna.forEach((row, i) => {
  const [sign, jeevan, karaka, bhagya] = row.split('|');
  assert.equal(sign, SIGNS[i]);
  assert.deepEqual(plain(T.TILAK_RAJ_RATNA.rows[i]), { jeevan: TR_GEM[jeevan], karaka: TR_GEM[karaka], bhagya: TR_GEM[bhagya] });
  // and the printed table is exactly the lords of the 1st, 5th and 9th — an independent check of book and transcription
  const lordOf = (h) => RASI_LORD[(i + h - 1) % 12];
  assert.deepEqual(plain(T.TILAK_RAJ_RATNA.rows[i]), { jeevan: lordOf(1), karaka: lordOf(5), bhagya: lordOf(9) }, `${sign}: Jeevan/Karaka/Bhagya are the 1st/5th/9th lords`);
});
FIX.tilakRajTables.planetClass.forEach((row, i) => {
  const [sign, yk, mal] = row.split('|');
  assert.equal(sign, SIGNS[i]);
  assert.deepEqual([...T.TILAK_RAJ_PLANET_CLASS.rows[i].yogakaraka], yk.split(', '));
  assert.deepEqual([...T.TILAK_RAJ_PLANET_CLASS.rows[i].malefic], mal.split(', '));
  assert.deepEqual(sorted([...T.TILAK_RAJ_PLANET_CLASS.rows[i].yogakaraka, ...T.TILAK_RAJ_PLANET_CLASS.rows[i].malefic]), sorted(T.PLANETS), `${sign}: every planet in exactly one column`);
});

// Raj Kumar "who should wear"
const signIdx = (names) => names.split(',').map((n) => SIGNS.indexOf(n));
for (const p of T.PLANETS) {
  const want = {};
  for (const part of FIX.rajKumarWho[p].split('|')) {
    const [k, v] = part.split('=');
    want[k] = k.startsWith('avoidIf') ? v.split(',').map(Number) : signIdx(v);
  }
  const w = T.RAJ_KUMAR_WHO[p];
  for (const k of ['good', 'ownOrExalted', 'limited', 'not', 'avoidIfLordOf', 'avoidIfHouse']) {
    assert.deepEqual(sorted(w[k] ?? []), sorted(want[k] ?? []), `Raj Kumar ${p} ${k}`);
  }
}
const RK_GEM = { 'Yellow sapphire': 'Jupiter', Ruby: 'Sun', Diamond: 'Venus', 'Blue sapphire': 'Saturn', Pearl: 'Moon', 'Red coral': 'Mars', Emerald: 'Mercury' };
const counterWant = Object.fromEntries(FIX.rajKumarWho.counter.split('|').map((x) => x.split('>')));
for (const r of T.RAJ_KUMAR_COUNTER.rows) assert.equal(r.gemOf, RK_GEM[counterWant[r.dashaLord]], `counter gem for ${r.dashaLord}`);
assert.equal(T.RAJ_KUMAR_COUNTER.general, RK_GEM[counterWant.general]);

// Wearing: weight and "not with" for every gem in every book
for (const book of ['kapoor', 'tilakRaj', 'rajKumar']) {
  for (const p of [...T.PLANETS, 'Rahu', 'Ketu']) {
    const [weight, notWith] = FIX.wearing[book][p].split('|');
    const [min, unit] = weight.split(' ');
    const g = WEARING[book].gems[p];
    assert.equal(g.weight.min, Number(min), `${book} ${p} weight`);
    assert.equal(g.weight.unit, unit, `${book} ${p} unit`);
    assert.deepEqual([...g.notWith], notWith.split(','), `${book} ${p} not with`);
    assert.ok(!g.notWith.includes(p), `${book} ${p}: a gem is not barred from itself`);
  }
}

// The nine gems, in planet order, with their Tamil names
const order = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
assert.deepEqual(order.map((p) => T.PLANET_GEMS[p].ta), FIX.tamilNames.order);
assert.equal(T.PLANET_GEMS.Saturn.en, 'Blue sapphire');
assert.match(T.PLANET_GEMS_SOURCE.pageLocus, /p\.12 .*all nine gems/, 'the English rendering on p.12 names Saturn\'s gem');
assert.match(T.PLANET_GEMS_SOURCE.pageLocus, /p\.76 .*omits Saturn/, 'and the repeat on p.76 omits it');
assert.match(T.TAMIL_NAMES_NOTE, /OCR/, 'the Tamil names are flagged as OCR-only');

// ----------------------------------------- independent checks on the books ---
// Tilak Raj's stated lordships against the real ones.
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

// Kapoor's stated lordships against the real ones: one printed error, two omissions.
const kWrong = []; const kOmitted = [];
SIGNS.forEach((sign, i) => {
  const lords = G.lordships(i);
  for (const p of T.PLANETS) {
    const e = KB.KAPOOR_BY_GEM[p][i];
    for (const h of e.lords) if (!lords[p].includes(h)) kWrong.push(`${sign} ${p} says ${h}, really ${lords[p].join('/')}`);
    for (const h of lords[p]) if (!e.lords.includes(h)) kOmitted.push(`${sign} ${p} omits ${h}`);
  }
});
assert.deepEqual(kWrong, ['Aquarius Jupiter says 12, really 2/11'], 'confirmed on the image of printed p.92');
assert.deepEqual(kOmitted.sort(), ['Aquarius Jupiter omits 11', 'Taurus Saturn omits 10']);
assert.deepEqual(Object.keys(KB.KAPOOR_SLIPS).sort(), ['AQU_JUP_12', 'SAG_LORD_MARS', 'TAU_SAT_EMERALD']);
assert.equal(FIX.kapoor.knownBookErrors.length, 3);
const slipsUsed = T.PLANETS.flatMap((p) => KB.KAPOOR_BY_GEM[p].filter((e) => e.slip).map((e) => e.slip));
assert.deepEqual(sorted(slipsUsed), Object.keys(KB.KAPOOR_SLIPS).sort(), 'each recorded slip is attached to its paragraph');
// The Taurus slip: Kapoor says to pair with "emerald, the gem of the Ascendant lord"; the Ascendant lord is Venus.
assert.deepEqual([...KB.KAPOOR_BY_GEM.Saturn[1].with], ['Mercury']);
assert.equal(RASI_LORD[1], 'Venus');

// Kapoor's paragraphs against his own general rule (printed pp.77-78).
const kTally = {};
SIGNS.forEach((sign, i) => {
  const lords = G.lordships(i);
  for (const p of T.PLANETS) {
    const cls = G.kapoorClass(p, i, lords[p]);
    const stance = KB.KAPOOR_VERDICTS[KB.KAPOOR_BY_GEM[p][i].v].stance;
    kTally[cls] = kTally[cls] ?? {};
    kTally[cls][stance] = (kTally[cls][stance] ?? 0) + 1;
    if (cls === 'DUSTHANA_ONLY') assert.equal(stance, 'UNFAV', `${sign} ${p}: a pure 6/8/12 lord is never favoured`);
    if (cls === 'RULING') assert.equal(stance, 'FAV', `${sign} ${p}: the Ascendant lord's gem is always favoured`);
  }
});
assert.deepEqual(kTally.RULING, { FAV: 12 });
assert.deepEqual(kTally.DUSTHANA_ONLY, { UNFAV: 6 });
// ...but his paragraphs are stricter than his rule: 16 lords of no 6th/8th/12th house are still
// advised against (the 3rd and the maraka 2nd and 7th count against a planet in his practice).
assert.deepEqual(kTally.AUSPICIOUS_ONLY, { FAV: 24, UNFAV: 16, COND: 1 });
assert.deepEqual(kTally.MIXED_LORDSHIP, { UNFAV: 16, FAV: 9 });

// Tilak Raj against his own tables and rules.
const trClass = []; const tr212 = [];
SIGNS.forEach((sign, i) => {
  const lords = G.lordships(i);
  const row = T.TILAK_RAJ_PLANET_CLASS.rows[i];
  for (const p of T.PLANETS) {
    const stance = T.VERDICTS[T.TILAK_RAJ_BY_SIGN[i][p].v].stance;
    if ((row.yogakaraka.includes(p) && stance === 'UNFAV') || (row.malefic.includes(p) && stance === 'FAV')) trClass.push(`${sign} ${p}`);
    if (stance === 'FAV' && lords[p].some((h) => h === 2 || h === 12)) tr212.push(`${sign} ${p}`);
  }
});
assert.deepEqual(trClass, ['Taurus Sun'], 'his p.21 table calls the Sun a yogakaraka for Taurus; his Taurus paragraph says avoid the ruby');
assert.equal(tr212.length, 10, 'ten favourable verdicts for a 2nd or 12th lord, against his own p.20 rule');

// Raj Kumar's "who should wear" against itself.
const rkClash = [];
for (const p of T.PLANETS) {
  SIGNS.forEach((sign, i) => {
    const r = G.rajKumarWho(p, i, null, G.lordships(i)[p], null);
    if (r.status === 'CONTRADICTS' || r.flagsTa.some((f) => /முரண்/.test(f))) rkClash.push(`${sign} ${p}`);
  });
}
assert.deepEqual(rkClash.sort(), [
  'Aquarius Saturn', 'Aries Saturn', 'Capricorn Saturn', 'Gemini Saturn', 'Pisces Sun', 'Taurus Moon', 'Virgo Saturn',
], 'Aries is in both his "limited" and his "avoid" list for blue sapphire; the rest name an Ascendant his own lordship clause bars');

// Raj Kumar's table against his own two rules.
for (const row of T.RAJ_KUMAR_TABLE.rows) {
  const lords = G.lordships(row.sign);
  const planets = (names) => names.map((g) => G.GEM_PLANET[g]);
  for (const p of planets(row.malefic)) {
    assert.ok(!lords[p].some((h) => [1, 5, 9].includes(h)), `${SIGNS[row.sign]}: malefic ${p} rules ${lords[p]}`);
  }
  for (const p of planets(row.benefic)) {
    const ok = lords[p].some((h) => [1, 4, 5, 9, 10].includes(h));
    if (!ok) assert.equal(`${SIGNS[row.sign]} ${p}`, 'Cancer Sun', 'the one benefic gem outside his own 1/4/5/9/10 rule');
  }
  for (const p of planets(row.benefic)) {
    assert.ok(!lords[p].every((h) => [6, 7, 8, 12].includes(h)), `${SIGNS[row.sign]}: ${p}`);
  }
}
const conflicts = T.RAJ_KUMAR_TABLE.rows.filter((row) => row.benefic
  .some((g) => G.lordships(row.sign)[G.GEM_PLANET[g]].some((h) => [6, 7, 8, 12].includes(h)))).length;
assert.equal(conflicts, 8, 'in 8 of 12 signs a gem he calls benefic is also the gem of a 6th/7th/8th/12th lord');

// "Not with" is not always stated both ways round within a book.
const oneWay = Object.fromEntries(Object.keys(WEARING).map((b) => {
  const g = WEARING[b].gems;
  const a = [];
  for (const p of Object.keys(g)) for (const q of g[p].notWith) if (!g[q].notWith.includes(p)) a.push(`${p}>${q}`);
  return [b, a];
}));
assert.deepEqual(oneWay.kapoor, ['Jupiter>Mercury', 'Jupiter>Venus']);
assert.deepEqual(oneWay.tilakRaj, ['Mercury>Moon']);
assert.equal(oneWay.rajKumar.length, 6, 'four of the six involve the pearl and coral lists cut by a lost PDF line');
assert.ok(WEARING.rajKumar.gems.Moon.lostLine && WEARING.rajKumar.gems.Mars.lostLine);
// The books disagree on the metal for coral and on weights.
assert.match(WEARING.tilakRaj.gems.Mars.metal, /வெள்ளி/);
assert.match(WEARING.kapoor.gems.Mars.metal, /தங்கம்/);
assert.notEqual(WEARING.kapoor.gems.Saturn.weight.min, WEARING.rajKumar.gems.Saturn.weight.min);
// Tilak Raj's quarter-ratti diamond sits beside his own "at least 3 rattis".
assert.ok(WEARING.tilakRaj.gems.Venus.weight.min < 3);
assert.match(WEARING.tilakRaj.general, /குறைந்தது 3 ரத்தி/);

// ---------------------------------------------------------- verdict codes ---
const codes = Object.keys(T.VERDICTS);
for (const sign of T.TILAK_RAJ_BY_SIGN) {
  for (const p of T.PLANETS) {
    const e = sign[p];
    assert.ok(codes.includes(e.v), e.v);
    for (const g of e.with ?? []) assert.ok(T.PLANETS.includes(g) && g !== p, `${p} with ${g}`);
  }
}
SIGNS.forEach((s, i) => {
  const jeevana = T.PLANETS.filter((p) => T.TILAK_RAJ_BY_SIGN[i][p].v === 'JEEVANA');
  assert.ok(jeevana.length <= 1, `${s}: one Jeevana Ratna at most`);
  if (jeevana.length) assert.equal(jeevana[0], RASI_LORD[i], `${s}: the Jeevana Ratna is the Ascendant lord's`);
});
const withoutWord = SIGNS.filter((s, i) => !T.PLANETS.some((p) => T.TILAK_RAJ_BY_SIGN[i][p].v === 'JEEVANA'));
assert.deepEqual(withoutWord, ['Capricorn'], 'only Capricorn\'s Ascendant-lord gem is not called Jeevana Ratna (printed p.31)');
assert.deepEqual(Object.values(T.VERDICTS).map((v) => v.stance).filter((s) => !['FAV', 'COND', 'UNFAV'].includes(s)), []);
// Kapoor's codes all resolve to Tamil
for (const p of T.PLANETS) {
  for (const e of KB.KAPOOR_BY_GEM[p]) {
    assert.ok(KB.KAPOOR_VERDICTS[e.v], e.v);
    for (const c of e.cases ?? []) assert.ok(KB.KAPOOR_VERDICTS[c.v], c.v);
    for (const r of e.reasons ?? []) assert.ok(KB.KAPOOR_REASONS_TA[r], r);
    for (const r of e.results ?? []) assert.ok(KB.KAPOOR_RESULTS_TA[r], r);
    for (const n of e.notJudged ?? []) assert.ok(KB.KAPOOR_NOT_JUDGED_TA[n], n);
    for (const c of e.cites ?? []) assert.ok(KB.KAPOOR_EXTRA_TA[c], c);
    if (e.note) assert.ok(KB.KAPOOR_EXTRA_TA[e.note], e.note);
    for (const g of [...(e.with ?? []), ...(e.also ?? [])]) assert.ok(T.PLANETS.includes(g) && g !== p, `${p} with ${g}`);
  }
}
for (const v of Object.values(KB.KAPOOR_VERDICTS)) assert.ok(['FAV', 'COND', 'UNFAV'].includes(v.stance));

// ------------------------------------------------- Kapoor, settled on a chart ---
const base = { Sun: 0, Moon: 0, Mars: 0, Mercury: 0, Jupiter: 0, Venus: 0, Saturn: 0, Rahu: 0, Ketu: 6 };
const kap = (planet, lagna, rasi) => G.kapoorReading(planet, lagna, rasi, G.lordships(lagna)[planet]);
// Gemini Ascendant, ruby: only in the Sun's period, and only if the Sun is in its own sign in the 3rd.
assert.equal(kap('Sun', 2, { ...base, Sun: 4 }).verdict, 'PERMIT');
assert.equal(kap('Sun', 2, { ...base, Sun: 4 }).stance, 'COND');
assert.match(kap('Sun', 2, { ...base, Sun: 4 }).evaluationTa, /நிபந்தனை 1 பொருந்துகிறது/);
assert.equal(kap('Sun', 2, { ...base, Sun: 5 }).verdict, 'NOT_ADVISED');
assert.equal(kap('Sun', 2, { ...base, Sun: 5 }).stance, 'UNFAV');
assert.equal(kap('Sun', 2, null).status, 'NEEDS_CHART', 'no chart, no condition decided');
assert.equal(kap('Sun', 2, null).stance, 'COND');
// Gemini, pearl: exalted in the 12th, or in the 11th or 9th.
assert.equal(kap('Moon', 2, { ...base, Moon: 1 }).verdict, 'PERMIT', 'Taurus is the 12th from Gemini and the Moon\'s exaltation');
assert.equal(kap('Moon', 2, { ...base, Moon: 10 }).verdict, 'PERMIT', 'Aquarius is the 9th');
assert.equal(kap('Moon', 2, { ...base, Moon: 3 }).verdict, 'AVOID');
// Gemini, blue sapphire: the book's own "ambiguous" case, in its order.
assert.equal(kap('Saturn', 2, { ...base, Saturn: 7 }).verdict, 'NOT', 'Scorpio is the 6th');
assert.equal(kap('Saturn', 2, { ...base, Saturn: 10 }).verdict, 'PERMIT', 'the 9th');
assert.equal(kap('Saturn', 2, { ...base, Saturn: 11, Jupiter: 11 }).verdict, 'PERMIT', 'the 10th with Jupiter');
assert.equal(kap('Saturn', 2, { ...base, Saturn: 11, Jupiter: 3 }).verdict, 'NOT_ADVISED', 'the 10th without Jupiter');
assert.equal(kap('Saturn', 2, { ...base, Saturn: 0, Venus: 0 }).verdict, 'JUDGE', 'with Venus in a house the book does not classify');
// Aries, diamond: own sign or exalted; otherwise "well placed" is not judged, so not counted against.
assert.equal(kap('Venus', 0, { ...base, Venus: 11 }).verdict, 'FAV');
assert.equal(kap('Venus', 0, { ...base, Venus: 6 }).verdict, 'FAV');
assert.equal(kap('Venus', 0, { ...base, Venus: 3 }).stance, 'COND');
// Pisces, blue sapphire: allowed in several houses, then narrowed by the author to two.
assert.equal(kap('Saturn', 11, { ...base, Saturn: 9 }).verdict, 'DASHA', 'Capricorn is the 11th from Pisces');
assert.equal(kap('Saturn', 11, { ...base, Saturn: 2 }).verdict, 'NARROWED', 'Gemini is the 4th from Pisces');
assert.equal(kap('Saturn', 11, { ...base, Saturn: 1 }).verdict, 'ONLY_THESE', 'Taurus, the 3rd, is not among his houses');
// Sagittarius, emerald: badly placed it is worn to undo the placement.
assert.equal(kap('Mercury', 8, { ...base, Mercury: 1 }).verdict, 'NEUTRALISES', 'Taurus is the 6th from Sagittarius');
assert.equal(kap('Mercury', 8, { ...base, Mercury: 5 }).verdict, 'DASHA', 'Virgo, the 10th, own sign');
// The slips travel with their rows.
assert.match(kap('Sun', 8, null).slipTa, /குரு/);
assert.deepEqual(kap('Jupiter', 10, null).misstatedLords, [12]);
assert.deepEqual(kap('Jupiter', 10, null).omittedLords, [11]);

// Kapoor's rule for Rahu and Ketu.
const kn = (lagna, rasi) => G.kapoorNodes(lagna, rasi);
assert.equal(kn(0, { ...base, Rahu: 2, Ketu: 8 }).rahu.status, 'MET', 'Rahu in the 3rd');
assert.equal(kn(0, { ...base, Rahu: 4, Ketu: 10, Sun: 4 }).rahu.status, 'MET', 'Rahu with the Sun, lord of the 5th (a trine)');
assert.equal(kn(3, { ...base, Rahu: 9, Ketu: 3, Mars: 9 }).rahu.status, 'MET', 'Rahu with Mars, yogakaraka for Cancer');
assert.equal(kn(0, { ...base, Rahu: 0, Ketu: 6, Sun: 4, Mars: 3, Jupiter: 3, Moon: 3, Venus: 3, Mercury: 3, Saturn: 3 }).rahu.status, 'NOT_MET');
assert.equal(kn(0, { ...base, Rahu: 1, Ketu: 7, Venus: 1, Sun: 4, Mars: 3, Jupiter: 3, Moon: 3, Mercury: 3, Saturn: 3 }).rahu.status, 'JUDGE', 'with Venus, lord of the 2nd and 7th: "auspicious" is not defined');
assert.equal(kn(0, null).rahu.status, 'NEEDS_CHART');
for (const [lagna, yk] of [[3, 'Mars'], [4, 'Mars'], [6, 'Saturn'], [9, 'Venus'], [10, 'Venus']]) {
  assert.ok(kn(lagna, null).yogakarakas.includes(yk), `${SIGNS[lagna]}: ${yk} is yogakaraka, as Kapoor calls it`);
}

// ----------------------------------------------------------------- reading --
const cancerRasi = { Sun: 0, Moon: 8, Mars: 10, Mercury: 1, Jupiter: 5, Venus: 2, Saturn: 9, Rahu: 4, Ketu: 10 };
const r = G.gemReading({ lagna: 3, moon: 8, rasi: cancerRasi });
assert.deepEqual(r.books.map((b) => b.key), ['kapoor', 'tilakRaj', 'rajKumar'], 'the books come back most-explained first');
assert.deepEqual(r.books.map((b) => b.rank), [1, 2, 3]);
assert.equal(r.lagnaLord, 'Moon');
assert.equal(r.kapoor.rulingStone.gem, 'White pearl');
assert.equal(r.rows.length, 7);
const row = (p) => r.rows.find((x) => x.planet === p);
assert.equal(row('Moon').kapoor.verdict, 'LIFELONG');
assert.equal(row('Moon').tilakRaj.verdict, 'JEEVANA');
assert.equal(row('Moon').agreement, 'AGREE_FAVOURABLE');
assert.equal(row('Mars').kapoor.verdict, 'LIFELONG', 'yogakaraka for Cancer: worn always');
assert.deepEqual(row('Mars').kapoor.with, ['Moon']);
assert.equal(row('Mars').agreement, 'AGREE_FAVOURABLE');
// The ruby for a Cancer Ascendant: Kapoor "if the native faces loss of wealth or eye disease",
// Tilak Raj "better to avoid", Raj Kumar "benefic".
assert.equal(row('Sun').kapoor.verdict, 'IF_NEED');
assert.equal(row('Sun').tilakRaj.verdict, 'AVOID');
assert.equal(row('Sun').rajKumarLagna.listed, 'BENEFIC');
assert.equal(row('Sun').agreement, 'DISAGREE');
assert.ok(row('Sun').kapoor.notJudgedTa.length === 1);
// Saturn for Cancer: Kapoor "should never touch", Tilak Raj "never": the books now agree.
assert.equal(row('Saturn').kapoor.verdict, 'NEVER');
assert.equal(row('Saturn').agreement, 'AGREE_UNFAVOURABLE');
// Mercury for Cancer rules the 3rd and 12th; Kapoor allows it only in its own sign there.
assert.deepEqual(row('Mercury').actualLords, [3, 12]);
assert.equal(row('Mercury').kapoor.status, 'NO_CASE', 'Mercury in Taurus, the 11th');
assert.equal(row('Mercury').kapoor.stance, 'UNFAV');
// Tilak Raj's p.21 roles: Moon Jeevan, Mars Karaka, Jupiter Bhagya for Cancer.
assert.equal(row('Moon').tilakRaj.ratnaRole, 'jeevan');
assert.equal(row('Mars').tilakRaj.ratnaRole, 'karaka');
assert.equal(row('Jupiter').tilakRaj.ratnaRole, 'bhagya');
assert.equal(row('Venus').tilakRaj.ratnaRole, null);
// Raj Kumar per gem: Cancer is named for ruby (if the Sun is in own or exaltation sign), pearl and coral.
assert.equal(row('Sun').rajKumarWho.status, 'GOOD', 'the Sun is exalted in Aries in this chart');
assert.equal(G.gemReading({ lagna: 3, moon: 8, rasi: { ...cancerRasi, Sun: 1 } }).rows[0].rajKumarWho.status, 'CONDITION_NOT_MET');
assert.equal(row('Moon').rajKumarWho.status, 'GOOD');
assert.equal(row('Saturn').rajKumarWho.status, 'NOT');
assert.equal(row('Jupiter').rajKumarWho.status, 'RULE_ONLY', 'he gives no list of Ascendants for yellow sapphire, only a rule');
assert.equal(Object.values(r.agreementCounts).reduce((a, b) => a + b, 0), 7);
// Rahu and Ketu
assert.equal(r.nodes.rahu.kapoor.house, 2, 'Rahu in Leo is the 2nd from Cancer');
assert.ok(['MET', 'NOT_MET', 'JUDGE'].includes(r.nodes.rahu.kapoor.status));
assert.ok(r.nodes.rahu.agreement && r.nodes.ketu.agreement);
// Wearing comes back for all nine gems with all three books, in rank order.
assert.equal(r.wearing.length, 9);
assert.deepEqual(Object.keys(r.wearing[0].books), ['kapoor', 'tilakRaj', 'rajKumar']);
assert.match(r.wearing[0].books.tilakRaj.weightTa, /314/, 'the printed "314 Rattis" is shown beside the reading');

// Tilak Raj's Tamil text is built from the fields.
assert.match(G.describeEntry(T.TILAK_RAJ_BY_SIGN[0].Saturn, 'Saturn'), /சனி தசையில்/);
assert.match(G.describeEntry(T.TILAK_RAJ_BY_SIGN[0].Saturn, 'Saturn'), /1, 2, 4, 5, 9, 10, 11-ஆம் இடத்தில்/);
assert.match(G.describeEntry(T.TILAK_RAJ_BY_SIGN[0].Moon, 'Moon'), /பவழம்/);
assert.match(G.describeEntry(T.TILAK_RAJ_BY_SIGN[8].Jupiter, 'Jupiter'), /Emerald/);
assert.match(G.describeEntry(T.TILAK_RAJ_BY_SIGN[3].Sun, 'Sun'), /கண் நோய்/);
const pisces = G.gemReading({ lagna: 11, moon: 0 });
const venus = pisces.rows.find((x) => x.planet === 'Venus');
assert.deepEqual(venus.tilakRaj.misstatedLords, [7]);
assert.deepEqual(venus.tilakRaj.omittedLords, [8]);
// Tilak Raj's own tables flag his verdicts: Taurus ruby.
const taurus = G.gemReading({ lagna: 1, moon: 1 });
assert.equal(taurus.rows[0].tilakRaj.classConflict, true);
assert.ok(taurus.rows.find((x) => x.planet === 'Mercury').tilakRaj.rule212Clash, 'Taurus emerald: 2nd lord, verdict "must"');

// Moon sign vs Ascendant for Raj Kumar: two rows, not a choice of the stronger.
const split = G.gemReading({ lagna: 0, moon: 6 });
assert.deepEqual(split.rajKumar.lagnaRow.malefic, ['Emerald', 'Diamond']);
assert.deepEqual(split.rajKumar.moonRow.malefic, ['Ruby', 'Coral', 'Yellow sapphire']);
assert.ok(split.rajKumar.notJudged.length === 3);
const fromMoon = split.rajKumar.rulesFromMoon.find((x) => x.planet === 'Venus');
assert.deepEqual(fromMoon.houses, [1, 8]);
assert.equal(fromMoon.conflict, true);
assert.equal(G.rajKumarRules(0, { Sun: 9, Moon: 0, Mars: 9, Mercury: 0, Jupiter: 3, Venus: 0, Saturn: 6, Rahu: 0, Ketu: 6 }).find((x) => x.planet === 'Mars').dignity, 'EXALTED');
assert.equal(G.rajKumarRules(0, null).every((x) => x.dignity === null), true);
assert.equal(split.rajKumar.counter.length, 9);

// Rahu and Ketu (Tilak Raj)
for (const lagna of range(12)) {
  const n = G.gemReading({ lagna, moon: 0 }).nodes.rahu;
  const want = [2, 5, 1, 6, 9, 10].includes(lagna) ? 'FAV' : [0, 7, 3, 4].includes(lagna) ? 'NOT_FOR_THIS_LAGNA' : 'NOT_UNLESS_ESSENTIAL';
  assert.equal(n.status, want, SIGNS[lagna]);
}
const ketu = G.gemReading({ lagna: 0, moon: 0, rasi: { ...cancerRasi, Ketu: 1 } }).nodes.ketu;
assert.equal(ketu.ketuHouse, 2);
assert.equal(ketu.houseFavourable, true);
assert.equal(G.gemReading({ lagna: 0, moon: 0 }).nodes.ketu.houseFavourable, null);

// ------------------------------------------------------- no recommendation --
const keys = JSON.stringify(Object.keys(r)) + JSON.stringify(Object.keys(r.rows[0])) + JSON.stringify(Object.keys(r.rows[0].kapoor));
assert.ok(!/recommend|prescri|should/i.test(keys), 'the result recommends nothing');
assert.ok(r.rows.every((x) => !('wear' in x)));
assert.ok(r.rules.kapoor.every((x) => x.page && x.textTa));
assert.equal(r.rules.rajKumar.length, 3);
assert.equal(r.rules.tilakRaj.length, 5);
assert.match(r.rules.rajKumar[2].textTa, /முரண்படுகிறது/);

// ------------------------------------------------------------- citations ---
for (const s of Object.values(T.SOURCES)) {
  const reg = resolveByTitle(s.title);
  assert.ok(reg, `${s.title} is registered`);
  assert.equal(reg.rights.status, 'RESTRICTED');
  assert.equal(reg.rights.mayShip, false);
}
for (const list of Object.values(T.RULES)) for (const rule of list) assert.ok(rule.source.pageLocus && resolveByTitle(rule.source.title));
for (const s of [KB.KAPOOR_SECTION, KB.KAPOOR_NODES.source, T.TILAK_RAJ_RATNA.source, T.TILAK_RAJ_PLANET_CLASS.source, T.RAJ_KUMAR_WHO_SOURCE, T.RAJ_KUMAR_COUNTER.source, ...Object.values(WEARING).map((w) => w.source)]) {
  assert.ok(s.pageLocus && resolveByTitle(s.title), s.pageLocus);
}
assert.ok(!/[ऀ-ॿ]/.test(JSON.stringify([T.RULES, T.RAJ_KUMAR_TABLE, T.TILAK_RAJ_NODES, KB, WEARING])), 'no Sanskrit text is reproduced');

// ------------------------------------------------------------- validation ---
assert.throws(() => G.gemReading({ lagna: 12, moon: 0 }), /lagna/);
assert.throws(() => G.gemReading({ lagna: 0, moon: -1 }), /moon/);
assert.throws(() => G.gemReading({ lagna: 0, moon: 0, rasi: { ...cancerRasi, Ketu: 12 } }), /rasi\.Ketu/);
assert.deepEqual(plain(G.gemReading({ lagna: 3, moon: 8, rasi: cancerRasi })), plain(r), 'deterministic');

console.log(JSON.stringify({
  pass: true,
  bookOrder: r.books.map((b) => `${b.rank}. ${b.key} (${b.words} words)`),
  kapoorParagraphsChecked: kapoorEntries,
  tilakRajEntriesChecked: entries,
  kapoorBookErrors: kWrong,
  tilakRajBookError: wrong,
  kapoorStricterThanHisRule: kTally.AUSPICIOUS_ONLY,
  tilakRajAgainstOwnRule212: tr212.length,
  rajKumarSelfClashes: rkClash.length,
  notWithOneWay: Object.fromEntries(Object.entries(oneWay).map(([k, v]) => [k, v.length])),
  cancerLagna: r.agreementCounts,
}, null, 2));
