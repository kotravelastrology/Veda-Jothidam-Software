const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const T = require('./src/report/rogaArambhaTables');
const { rogaArambha, rogaArambhaTable, momentFacts, evaluateRule } = require('./src/report/rogaArambha');
const { createChartContext } = require('./src/contracts/chartContext');
const { calculateTirukanitaPanchangam, NAKSHATRA_NAMES, TITHI_NAMES, VARA_NAMES } = require('./src/panchangam/tirukanitaPanchangam');
const { citeTa } = require('./src/sources/citeTa');

const FIX = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/roga-arambha/books.json'), 'utf8'));
const STARS = ['ashwini', 'bharani', 'krittika', 'rohini', 'mrigasira', 'ardra', 'punarvasu', 'pushya', 'ashlesha', 'magha', 'purva phalguni', 'uttara phalguni', 'hasta', 'chitra', 'swati', 'vishakha', 'anuradha', 'jyeshtha', 'moola', 'purvashadha', 'uttarashadha', 'sravana', 'dhanishta', 'satabhisha', 'purva bhadrapada', 'uttarabhadrapada', 'revati'];
const idx = (name) => { const i = STARS.indexOf(name); assert.ok(i >= 0, name); return i; };
const plain = (o) => JSON.parse(JSON.stringify(o));
const DAY = 86400000;

// ----------------------------------------------- every book's list, star by star, from the fixture ---
const CELLS = { KALAPRAKASIKA: T.KALAPRAKASIKA_CELLS, MC: T.MC_CELLS, JOSHI: T.JOSHI_CELLS, RANGACHARYA: T.RANGACHARYA_CELLS, KR: T.KR_CELLS };
for (const [book, groups] of Object.entries(FIX.lengths)) {
  const seen = new Set();
  for (const g of groups) {
    for (const s of g.stars) {
      const c = CELLS[book][idx(s)];
      assert.ok(c, `${book}: ${s} missing`);
      assert.equal(c.kind, g.kind, `${book}: ${s} kind`);
      assert.deepEqual(plain(c.parts), g.parts, `${book}: ${s} length`);
      assert.ok(!seen.has(s), `${book}: ${s} printed twice`);
      seen.add(s);
    }
  }
  assert.equal(CELLS[book].filter(Boolean).length, seen.size, `${book}: no star beyond the printed ones`);
}
// Muhurta Chintamani gives 26 stars (Magha is not in its verse); Kalaprakasika, Joshi and Kalyanraman 27.
assert.equal(T.MC_CELLS.filter(Boolean).length, 26);
assert.equal(T.MC_CELLS[idx('magha')], null);
for (const b of ['KALAPRAKASIKA', 'JOSHI', 'KR']) assert.equal(CELLS[b].filter(Boolean).length, 27, b);
// Rangacharya gives 20: the seven death stars are only in his fatal list.
assert.equal(T.RANGACHARYA_CELLS.filter(Boolean).length, 20);

// Wilhelm repeats Kalaprakasika's list except two units (Visakha, Anuradha in nights).
FIX.wilhelmDiffersFromKalaprakasika.forEach((s) => assert.deepEqual(plain(T.WILHELM_CELLS[idx(s)].parts), [[s === 'vishakha' ? 25 : 10, 'NIGHT']]));
for (let i = 0; i < 27; i += 1) {
  const name = STARS[i];
  if (FIX.wilhelmDiffersFromKalaprakasika.includes(name)) continue;
  assert.deepEqual(plain(T.WILHELM_CELLS[i]), plain(T.KALAPRAKASIKA_CELLS[i]), `Wilhelm = Kalaprakasika at ${name}`);
}

// Wilhelm's report of Muhurta Chintamani, and where it parts from the verse itself.
const remarks = T.WILHELM_MC_REMARKS;
assert.equal(remarks.filter(Boolean).length, Object.keys(FIX.wilhelmMcRemarks).length);
const asKey = (c) => (c.kind === 'DEATH' ? 'DEATH' : c.kind === 'LONG' ? 'LONG' : c.parts[0][1] === 'MONTH' ? 'MONTH' : c.parts[0][0]);
const disagree = [];
for (const [s, v] of Object.entries(FIX.wilhelmMcRemarks)) {
  assert.equal(asKey(remarks[idx(s)]), v, `Wilhelm's MC remark, ${s}`);
  if (asKey(T.MC_CELLS[idx(s)]) !== v) disagree.push(s);
}
assert.deepEqual(disagree.sort(), [...FIX.wilhelmMcDisagreesWithMcVerse].sort());

// --------------------------------------------------------------- Shridhar's Table 22.2 and its text ---
assert.equal(T.SHRIDHAR_QUARTERS.length, 27);
assert.equal(T.SHRIDHAR_QUARTERS[idx('revati')], null);
for (const [s, row] of Object.entries(FIX.shridharTable22_2)) {
  const i = idx(s);
  assert.deepEqual(plain(T.SHRIDHAR_QUARTERS[i].quarters), row.q, `Table 22.2 quarters, ${s}`);
  const c = T.SHRIDHAR_CELLS[i];
  if (row.death) assert.equal(c.kind, 'DEATH', s);
  else if (row.long) assert.equal(c.kind, 'LONG', s);
  else assert.deepEqual(plain(c.parts), [[row.days, 'DAY']], `Table 22.2 days of illness, ${s}`);
}
assert.equal(Object.keys(FIX.shridharTable22_2).length, 26);
// The text's death and long lists agree with the table.
const deathOf = (cells) => cells.map((c, i) => (c && c.kind === 'DEATH' ? STARS[i] : null)).filter(Boolean).sort();
assert.deepEqual(deathOf(T.SHRIDHAR_CELLS), [...FIX.shridharTextDeathStars].sort());
assert.deepEqual(T.SHRIDHAR_CELLS.map((c, i) => (c.kind === 'LONG' ? STARS[i] : null)).filter(Boolean).sort(), [...FIX.shridharTextLongStars].sort());
// Death lists of Muhurta Chintamani and Joshi are the same seven.
assert.deepEqual(deathOf(T.MC_CELLS), deathOf(T.SHRIDHAR_CELLS));
assert.deepEqual(deathOf(T.JOSHI_CELLS), deathOf(T.SHRIDHAR_CELLS));
// The one place Shridhar's table parts from the other books' 9 days.
assert.deepEqual(plain(T.SHRIDHAR_CELLS[idx('moola')].parts), [[7, 'DAY']]);
assert.deepEqual(plain(T.MC_CELLS[idx('moola')].parts), [[9, 'DAY']]);

// ---------------------------------------------------------------------------------- flag lists ---
for (const [book, list] of Object.entries(FIX.flags.NEEDS_TREATMENT)) assert.deepEqual(T.FLAGS[book].NEEDS_TREATMENT.map((i) => STARS[i]).sort(), [...list].sort(), book);
assert.deepEqual(T.FLAGS.RANGACHARYA.FATAL.map((i) => STARS[i]).sort(), [...FIX.flags.FATAL.RANGACHARYA].sort());
for (const b of ['SHRIDHAR', 'MC', 'KR', 'JOSHI']) assert.deepEqual(T.FLAGS[b].SNAKE.map((i) => STARS[i]).sort(), [...FIX.flags.SNAKE].sort(), b);

// ------------------------------------------------------------------------------- combinations ---
const rule = (id) => T.RULES.find((r) => r.id === id);
const VARA = { Sun: 0, Tue: 2, Sat: 6 };
for (const id of ['KP_COMBO', 'W_KP_COMBO', 'R_COMBO']) {
  assert.deepEqual(rule(id).any.map((a) => ({ vara: Object.keys(VARA).find((k) => VARA[k] === a.varas[0]), tithi: a.tithis[0], stars: a.stars.map((i) => STARS[i]).sort() })),
    FIX.combos.kalaprakasika.map((a) => ({ ...a, stars: [...a.stars].sort() })), id);
}
// Shridhar prints "Magha" where the others print Bharani on Tuesday.
assert.deepEqual(rule('S_KP_COMBO').any[1].stars.map((i) => STARS[i]).sort(), [...FIX.combos.shridharTable22_1TuesdayAsPrinted].sort());
assert.deepEqual(rule('S_KP_COMBO').any[0], rule('KP_COMBO').any[0]);
assert.deepEqual(rule('S_KP_COMBO').any[2], rule('KP_COMBO').any[2]);
assert.deepEqual(rule('MC_COMBO').when.stars.map((i) => STARS[i]).sort(), [...FIX.combos.mcStars].sort());
assert.deepEqual([...rule('MC_COMBO').when.tithis].sort((a, b) => a - b), [...FIX.combos.mcTithis].sort((a, b) => a - b));
assert.deepEqual(rule('W_MC_COMBO').when.stars, rule('MC_COMBO').when.stars);
for (const id of ['KR_COMBO', 'J_COMBO']) {
  assert.deepEqual(rule(id).when.stars.map((i) => STARS[i]).sort(), [...FIX.combos.krJoshiStars].sort(), id);
  assert.deepEqual(rule(id).when.tithis, FIX.combos.krJoshiTithis, id);
}
assert.deepEqual(rule('MC_COMBO').when.stars.length - rule('KR_COMBO').when.stars.length, 1, 'MC adds Dhanishta');
for (const id of ['KP_TITHI', 'W_TITHI']) assert.deepEqual(rule(id).when.tithis, FIX.combos.tithiSix, id);
for (const id of ['KP_TARA', 'W_TARA']) assert.deepEqual(rule(id).when.tara, FIX.combos.tara, id);
assert.deepEqual(rule('R_TARA').when.tara, FIX.combos.ramanTara);
for (const id of ['S_BJS']) assert.deepEqual(rule(id).when.varas, [0, 2, 6]);

// Table 18.22's three nadis, each nine stars.
for (const [k, names] of Object.entries(FIX.triNadiTable18_22)) assert.deepEqual(T.NADI[k].map((i) => STARS[i]).sort(), [...names].sort(), k);
assert.equal(new Set([...T.NADI.ADI, ...T.NADI.MADHYA, ...T.NADI.ANTYA]).size, 27);

// ------------------------------------------------------------------------ words, order, sources ---
assert.equal(T.WORDS.WILHELM, FIX.words.WILHELM);
for (const b of ['KALAPRAKASIKA', 'MC', 'KR', 'JOSHI', 'RAMAN', 'RANGACHARYA']) assert.equal(T.WORDS[b], FIX.words[b], b);
assert.equal(T.WORDS.SHRIDHAR, FIX.words.SHRIDHAR_TEXT + T.SHRIDHAR_TABLE_WORDS);
assert.deepEqual(T.ORDER, ['WILHELM', 'SHRIDHAR', 'KALAPRAKASIKA', 'MC', 'KR', 'JOSHI', 'RAMAN', 'RANGACHARYA']);
for (let i = 1; i < T.ORDER.length; i += 1) assert.ok(T.WORDS[T.ORDER[i - 1]] >= T.WORDS[T.ORDER[i]], 'most-explained book first');
for (const b of T.ORDER) {
  assert.ok(T.SOURCES[b] && T.BOOK_TA[b], b);
  const line = citeTa(T.SOURCES[b]);
  assert.ok(!/PDF/.test(line), `${b}: a citation never shows a PDF number — ${line}`);
  assert.ok(/ப\./.test(line), `${b}: has a page — ${line}`);
}
for (const r of T.RULES) assert.ok(T.SOURCES[r.book], `${r.id}: its book`);
assert.match(citeTa(T.SOURCES.WILHELM), /ப\.270-272/);
assert.match(citeTa(T.SOURCES.KALAPRAKASIKA), /ப\.159-160/);
assert.match(citeTa(T.SOURCES.SHRIDHAR), /ப\.601-602/);
assert.match(citeTa(T.SOURCES.SHRIDHAR_TABLE), /ப\.609/);
assert.match(citeTa(T.SOURCES.MC), /ப\.79-80/);
assert.match(citeTa(T.SOURCES.KR), /ப\.201/);
assert.match(citeTa(T.SOURCES.JOSHI), /ப\.147-148/);
assert.match(citeTa(T.SOURCES.RANGACHARYA), /ப\.133/);

// The Tamil of every cell is words, never a raw kind or an undefined.
for (const cells of [...Object.values(CELLS), T.WILHELM_CELLS, T.SHRIDHAR_CELLS]) {
  for (const c of cells) if (c) assert.ok(T.cellTa(c) && !/undefined|NaN|\[object/.test(T.cellTa(c)), JSON.stringify(c));
}
assert.equal(T.cellTa(T.KALAPRAKASIKA_CELLS[idx('ardra')]), '5 நாளில் அல்லது 3 பக்ஷத்தில் ஆபத்து — நூல்: "disastrous"');
assert.equal(T.cellTa(T.MC_CELLS[idx('rohini')]), '7 நாளில் குணம்');

// --------------------------------------------------------- the moment: against the panchangam ---
// 2026-09-05 at Erode, the panchangam test's own reference day: Saturday, Navami, Mrigashira, Taitila.
const erode = { latitude: 11.34, longitude: 77.72, utcOffsetMinutes: 330, ayanamsha: 'Lahiri' };
const ctx = createChartContext({ year: 2026, month: 9, day: 5, hour: 12, ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330, latitude: 11.34, longitude: 77.72, placeName: 'Erode', calendarMode: 'tirukanita' });
const panch = calculateTirukanitaPanchangam(ctx);
const at = Date.parse('2026-09-05T08:00:00+05:30');
const f = momentFacts({ atMs: at, ...erode });
assert.equal(STARS[f.star], 'mrigasira');
assert.equal(NAKSHATRA_NAMES[f.star], panch.nakshatra.name);
assert.equal(TITHI_NAMES[f.tithi30 - 1], panch.tithi.name);
assert.equal(f.karana, panch.karana.name);
assert.equal(VARA_NAMES[f.vara], panch.vara);
assert.equal(f.tithi30, 24);
assert.equal(f.paksha, 'KRISHNA');
assert.equal(f.tithiNum, 9);
assert.equal(f.pada, Math.floor(((f.moonLongitude % (360 / 27)) / (360 / 108))) + 1);
// Before sunrise the Hindu day is still the day before: Friday at 04:30.
assert.equal(momentFacts({ atMs: Date.parse('2026-09-05T04:30:00+05:30'), ...erode }).vara, 5);
assert.equal(momentFacts({ atMs: Date.parse('2026-09-05T07:00:00+05:30'), ...erode }).vara, 6);

// ------------------------------------------------------------------------------- the engine ---
const r = rogaArambha({ atMs: at, latitude: erode.latitude, longitude: erode.longitude, utcOffsetMinutes: 330, natalMoonLongitude: null, snakeBite: false });
assert.equal(r.books.length, 8);
assert.deepEqual(r.books.map((b) => b.key), T.ORDER);
const book = (k) => r.books.find((b) => b.key === k);
// Mrigashira: Kalaprakasika 5 or 9 days; Muhurta Chintamani, Joshi, Rangacharya one month / 30 days; Shridhar 30.
assert.equal(book('KALAPRAKASIKA').cell.textTa, '5 நாளில் அல்லது 9 நாளில் குணம்');
assert.deepEqual(book('KALAPRAKASIKA').cell.expectedUtc, [new Date(at + 5 * DAY).toISOString(), new Date(at + 9 * DAY).toISOString()]);
assert.equal(book('MC').cell.days[0], 30);
assert.equal(book('SHRIDHAR').cell.days[0], 30);
assert.equal(book('SHRIDHAR').quarter.days, T.SHRIDHAR_QUARTERS[idx('mrigasira')].quarters[f.pada - 1]);
assert.equal(book('WILHELM').wilhelmMc.textTa, T.cellTa(T.WILHELM_MC_REMARKS[idx('mrigasira')]));
assert.equal(book('RAMAN').cell, null);
assert.ok(book('RAMAN').listsStars && book('RAMAN').flagsHere.length === 0, 'Raman lists stars, and Mrigashira is not one');
assert.equal(book('MC').listsStars, false, 'MC has only the snake-bite list');
// Without a patient the birth-star rules are unknown, not false; bite rules are absent.
const byId = (id) => r.rules.find((x) => x.id === id);
for (const id of ['KP_TARA', 'W_TARA', 'R_TARA', 'S_NADI']) assert.equal(byId(id).met, null, id);
assert.equal(r.rules.find((x) => /SNAKE/.test(x.id)), undefined);
// Saturday, Navami, Mrigashira: Tuesday's combination needs Tuesday; the Saturday one needs Chaturdashi.
assert.equal(byId('KP_COMBO').met, false);
assert.equal(byId('KP_TITHI').met, true, 'Navami is in the six tithis');
assert.equal(byId('W_TITHI').met, true);
assert.equal(byId('KP_KARANA').met, false, 'Taitila is a movable karana');
assert.equal(byId('MC_COMBO').met, false, 'Mrigashira is not in the eleven stars');
assert.ok(r.crisisUtc && Date.parse(r.crisisUtc) - at > 13 * DAY && Date.parse(r.crisisUtc) - at < 16 * DAY, 'the Moon opposite its onset place in about 14-15 days');

// With a patient: a birth Moon in Mrigashira makes the onset the Janma star (count 1) — tara rules fire; same nadi too.
const natal = f.moonLongitude;
const withNatal = rogaArambha({ atMs: at, latitude: erode.latitude, longitude: erode.longitude, utcOffsetMinutes: 330, natalMoonLongitude: natal, snakeBite: true });
const idN = (id) => withNatal.rules.find((x) => x.id === id);
assert.equal(withNatal.natal.tara, 1);
for (const id of ['KP_TARA', 'W_TARA', 'R_TARA']) assert.equal(idN(id).met, true, id);
// Janma and the Moon's star are Mrigashira; the Sun, 5 September, is in Purva Phalguni: all three Madhya, so Shridhar's Tri-Nadi death rule holds.
assert.equal(STARS[f.sunStar], 'purva phalguni');
assert.equal(T.nadiOf(f.star), 'MADHYA');
assert.equal(T.nadiOf(f.sunStar), 'MADHYA');
assert.equal(idN('S_NADI').met, true);
// A patient born with the Moon in Ashwini (Adi) is outside it.
const ashwiniBorn = rogaArambha({ atMs: at, latitude: erode.latitude, longitude: erode.longitude, utcOffsetMinutes: 330, natalMoonLongitude: 5, snakeBite: false });
assert.equal(ashwiniBorn.rules.find((x) => x.id === 'S_NADI').met, false);
assert.equal(ashwiniBorn.natal.tara, ((f.star - 0 + 27) % 27) + 1);
// Snake rules appear only with the bite; Mrigashira is in none of the four lists.
for (const id of ['MC_SNAKE', 'KR_SNAKE', 'J_SNAKE', 'S_SNAKE']) assert.equal(idN(id).met, false, id);

// A hand-made moment: a Sunday Chaturthi under Ardra is Kalaprakasika's first disaster; Shridhar and Raman repeat it.
const ardraSunday = { star: idx('ardra'), vara: 0, tithiNum: 4, amavasya: false, purnima: false, karanaSthira: false, sunStar: 0 };
for (const id of ['KP_COMBO', 'W_KP_COMBO', 'R_COMBO', 'S_KP_COMBO']) assert.equal(evaluateRule(rule(id), ardraSunday, null).met, true, id);
assert.equal(evaluateRule(rule('S_BJS'), { ...ardraSunday, tithiNum: 9 }, null).met, true, 'B.J.S.: Rikta tithi (9) on a malefic day under Ardra');
assert.equal(evaluateRule(rule('S_BJS'), { ...ardraSunday, tithiNum: 5 }, null).met, false);
assert.equal(evaluateRule(rule('S_BDR'), { ...ardraSunday, tithiNum: 8 }, null).met, true);
assert.equal(evaluateRule(rule('S_BDR'), { ...ardraSunday, tithiNum: 8 }, null).daysAssumed, true);
assert.equal(evaluateRule(rule('MC_COMBO'), { ...ardraSunday, tithiNum: 6 }, null).met, true);
assert.equal(evaluateRule(rule('KR_COMBO'), { ...ardraSunday, vara: 3, tithiNum: 6 }, null).met, false, 'a Wednesday is not a malefic day');
// Tuesday Navami under Magha: Shridhar's printed table says so, the other books say Bharani.
const tueMagha = { star: idx('magha'), vara: 2, tithiNum: 9, amavasya: false, purnima: false, karanaSthira: false, sunStar: 0 };
assert.equal(evaluateRule(rule('S_KP_COMBO'), tueMagha, null).met, true);
assert.equal(evaluateRule(rule('KP_COMBO'), tueMagha, null).met, false);
assert.equal(evaluateRule(rule('KP_COMBO'), { ...tueMagha, star: idx('bharani') }, null).met, true);
// The new moon is its own tithi, not the 15th.
assert.equal(evaluateRule(rule('KP_TITHI'), { ...tueMagha, tithiNum: 15, amavasya: true }, null).met, true);
assert.equal(evaluateRule(rule('KP_TITHI'), { ...tueMagha, tithiNum: 15, amavasya: false, purnima: true }, null).met, false);
// Sthira karanas and Vishti.
assert.equal(evaluateRule(rule('KP_KARANA'), { ...tueMagha, karanaSthira: true }, null).met, true);

// -------------------------------------------------------------------------------------- table ---
const table = rogaArambhaTable();
assert.equal(table.stars.length, 27);
assert.equal(table.books.length, 8);
assert.deepEqual(table.order, T.ORDER);
assert.equal(table.shridharTable.length, 27);
assert.ok(table.rank.measureTa.startsWith('நோய்த் தொடக்கம் பற்றிய சொற்கள்'));
assert.equal(table.books.find((b) => b.key === 'RAMAN').cells.filter(Boolean).length, 0, 'Raman gives no lengths');
assert.ok(table.differences.length >= 8 && table.ourReadingsTa.length >= 8);
// Nothing in the table is a raw code.
assert.ok(!/\bundefined\b/.test(JSON.stringify(table)));
for (const d of T.DIFFERENCES) assert.ok(/[஀-௿]/.test(d.textTa), d.id);

console.log('roga-arambha: ok');
