const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const T = require('./src/report/saptashalakaTables');
const { saptashalaka, chakraOf27, chakraStarOf } = require('./src/report/saptashalaka');
const { planetLongitude, nodeLongitude } = require('./src/ephemeris/siderealPositions');
const { resolveByTitle } = require('./src/sources/registry');

const FIX = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/gochara-vedha/saptashalaka.json'), 'utf8'));
const DAY = 86400000;
const YEAR = 365.25 * DAY;
const plain = (o) => JSON.parse(JSON.stringify(o));

// Chakra numbering by name (Krittika = 1 … Bharani = 28, Abhijit = 20).
const CHAKRA_NAMES = [null, 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha',
  'Magha', 'Purvaphalguni', 'Uttaraphalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Moola',
  'Purvashadha', 'Uttarashadha', 'Abhijit', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purvabhadrapada', 'Uttarabhadrapada',
  'Revati', 'Ashwini', 'Bharani'];
const num = (name) => { const i = CHAKRA_NAMES.indexOf(name); assert.ok(i > 0, name); return i; };

// ------------------------------------------------ the layout, as Pulippani draws it ---
const D = FIX.pulippaniDiagram;
D.east_top_to_bottom.forEach((n, i) => assert.deepEqual(T.pointOf(num(n)), { x: 8, y: i + 1 }, `${n} on the east side`));
D.south_right_to_left.forEach((n, i) => assert.deepEqual(T.pointOf(num(n)), { x: 7 - i, y: 8 }, `${n} on the south side`));
D.west_bottom_to_top.forEach((n, i) => assert.deepEqual(T.pointOf(num(n)), { x: 0, y: 7 - i }, `${n} on the west side`));
D.north_left_to_right.forEach((n, i) => assert.deepEqual(T.pointOf(num(n)), { x: i + 1, y: 0 }, `${n} on the north side`));
for (let s = 1; s <= 28; s += 1) assert.equal(T.starAt(T.pointOf(s)), s);

// ------------------------------------------------ straight lines = Bhat's grid ---
const B = FIX.bhatDiagram;
for (const [a, b] of [...B.vertical_lines_top_to_bottom, ...B.horizontal_lines_left_to_right, ...B.text_pairs_p251]) {
  assert.equal(T.straightPartner(num(a)), num(b), `${a}–${b}`);
  assert.equal(T.straightPartner(num(b)), num(a), `${b}–${a}`);
}
assert.equal(B.vertical_lines_top_to_bottom.length + B.horizontal_lines_left_to_right.length, 14, 'fourteen lines, 28 ends');

// ------------------------------------------------ three lines = Gour's examples ---
for (const [star, want] of Object.entries(FIX.gourExamples)) {
  if (star === 'page') continue;
  assert.deepEqual(T.READINGS.THREE_LINES.partners(num(star)).map((s) => CHAKRA_NAMES[s]).sort(), [...want].sort(), `${star}: Gour's three`);
}
for (let s = 1; s <= 28; s += 1) {
  const p = T.READINGS.THREE_LINES.partners(s);
  assert.equal(new Set(p).size, 3, `star ${s}: three distinct partners`);
  assert.ok(!p.includes(s));
  for (const q of p) assert.ok(T.READINGS.THREE_LINES.partners(q).includes(s), `vedha is mutual: ${s} and ${q}`);
}

// ------------------------------------------------ Abhijit and numbering ---
const [f0, f1, f2] = FIX.charakAbhijit.from;
const [t0, t1, t2] = FIX.charakAbhijit.to;
assert.ok(Math.abs(T.ABHIJIT.from - (f0 + f1 / 60 + f2 / 3600)) < 1e-9);
assert.ok(Math.abs(T.ABHIJIT.to - (t0 + t1 / 60 + t2 / 3600)) < 1e-9);
assert.equal(chakraOf27(0), 27, 'Ashwini');
assert.equal(chakraOf27(1), 28, 'Bharani');
assert.equal(chakraOf27(2), 1, 'Krittika');
assert.equal(chakraOf27(20), 19, 'Uttarashadha');
assert.equal(chakraOf27(21), 21, 'Shravana');
assert.equal(chakraOf27(26), 26, 'Revati');
assert.equal(chakraStarOf(276.5), 19);
assert.equal(chakraStarOf(277), 20);
assert.equal(chakraStarOf(280.9), 21);

// ------------------------------------------------ Bhat's worked example ---
{
  // Natal Moon in Mrigashira (27-star index 4: 53°20′–66°40′).
  const r = saptashalaka({ natalMoonLongitude: 60, fromMs: Date.UTC(2026, 0, 1), toMs: Date.UTC(2027, 0, 1), atMs: Date.UTC(2026, 5, 1) });
  const e = B.example_p251;
  assert.equal(CHAKRA_NAMES[r.natal.JANMA.chakraStar], e.natal);
  assert.equal(CHAKRA_NAMES[r.readings.STRAIGHT.vedhaStars.JANMA[0].star], e.natalVedha);
  assert.equal(CHAKRA_NAMES[r.natal.ADHANA.chakraStar], e.adhana, 'the 19th counted in 27 stars');
  assert.equal(CHAKRA_NAMES[r.readings.STRAIGHT.vedhaStars.ADHANA[0].star], e.adhanaVedha);
}

// ------------------------------------------------ book order, rule 3 counts, citations ---
assert.deepEqual(plain(T.RANK.words), FIX.wordCounts);
assert.deepEqual([...T.RANK.order], Object.keys(T.RANK.words).sort((a, b) => T.RANK.words[b] - T.RANK.words[a]));
assert.equal(T.DEFAULT_READING, 'STRAIGHT', 'Bhat, who explains most, reads straight lines');
const occ = T.RULES.find((x) => x.id === 'OCCUPATION');
assert.deepEqual([...occ.counts], FIX.rule3Counts.BHAT);
assert.deepEqual([...FIX.rule3Counts.PULIPPANI].sort((a, b) => a - b), FIX.rule3Counts.BHAT, 'Pulippani lists the same seven');
// Phaladeepika XXVI.28 names its stars; Sastri and Kapoor give the same seven numbers as Pulippani, in his order.
assert.deepEqual(FIX.rule3Counts.PHALADEEPIKA_SASTRI, FIX.rule3Counts.PULIPPANI);
assert.deepEqual(FIX.rule3Counts.PHALADEEPIKA_KAPOOR, FIX.rule3Counts.PULIPPANI);
{
  // The seven names, numbered by Jataka Parijata IX.78-80 (Vipat, Pratyari, Vadha are the 3rd, 5th, 7th taras).
  const jp = FIX.phaladeepika.jataakaParijataNamedStars;
  const byName = { 'आधान': jp.Adhana, 'कर्मर्क्ष': jp.Karmarksha, 'विपत्': 3, 'जन्म': jp.Janmarksha, 'वैनाशिक': jp.Vainasika, 'प्रत्यर': 5, 'वध': 7 };
  assert.deepEqual(FIX.phaladeepika.sloka28Names.map((n) => byName[n]), FIX.rule3Counts.PHALADEEPIKA_SASTRI, 'the verse\'s names, numbered by Jataka Parijata, are Sastri\'s numbers');
  // Vainashika: 23rd by Jataka Parijata, 22nd by Kalaprakasika — Gour's 22nd.
  assert.deepEqual([occ.vainashika.default, occ.vainashika.alternative], [FIX.phaladeepika.vainashika.JATAKA_PARIJATA_IX_79, FIX.phaladeepika.vainashika.KALAPRAKASIKA_P167]);
  assert.equal(FIX.phaladeepika.vainashika.GOUR, FIX.rule3Counts.GOUR.find((c) => !FIX.rule3Counts.BHAT.includes(c)));
  assert.ok(occ.counts.includes(occ.vainashika.default) && !occ.counts.includes(occ.vainashika.alternative));
  assert.ok(T.NOTES_TA.pulippaniQuotesTa.length > 0);
}
for (const ru of T.RULES) assert.deepEqual(ru.books.map((b) => b.book), [...T.RANK.order], `${ru.id}: books in order`);
const cites = [];
const walk = (o) => { if (o && typeof o === 'object') { if (typeof o.pageLocus === 'string') cites.push(o); Object.values(o).forEach(walk); } };
walk(T);
assert.ok(cites.length >= 15);
for (const c of cites) assert.ok(resolveByTitle(c.title), `registered: ${c.title}`);

// ------------------------------------------------ windows against the sky ---
{
  const atMs = Date.UTC(2026, 9, 7);
  const t = Date.now();
  const r = saptashalaka({ natalMoonLongitude: 48, fromMs: atMs - YEAR, toMs: atMs + 12 * YEAR, atMs });
  const elapsed = Date.now() - t;
  const lon = (p, ms) => {
    const jd = ms / DAY + 2440587.5;
    if (p === 'Rahu') return nodeLongitude(jd, 'Lahiri', 'mean');
    if (p === 'Ketu') return (nodeLongitude(jd, 'Lahiri', 'mean') + 180) % 360;
    return planetLongitude(jd, p, 'Lahiri');
  };
  const mid = (w) => (Date.parse(w.fromUtc) + Date.parse(w.toUtc)) / 2;
  for (const [rid, reading] of Object.entries(r.readings)) {
    const vstars = new Set(Object.values(reading.vedhaStars).flat().map((v) => v.star));
    for (const w of [...reading.sun, ...reading.others]) {
      assert.equal(chakraStarOf(lon(w.planet, mid(w))), w.star, `${rid}: ${w.planet} in ${w.starTa} mid-window`);
      assert.ok(vstars.has(w.star));
      if (!w.openStart) assert.notEqual(chakraStarOf(lon(w.planet, Date.parse(w.fromUtc) - 2 * 60000)), w.star);
    }
    assert.ok(reading.sun.length >= 12, `${rid}: the Sun reaches each vedha star yearly`);
  }
  assert.ok(r.readings.THREE_LINES.sun.length > r.readings.STRAIGHT.sun.length, 'three lines give more windows');
  for (const w of r.occupation) {
    assert.equal(Math.floor((((lon(w.planet, mid(w)) % 360) + 360) % 360) / (360 / 27)), w.star27);
    assert.equal(((w.star27 - r.natal.JANMA.star27 + 27) % 27) + 1, w.count);
    assert.equal(w.vainashikaAlternative, w.count === 22);
  }
  assert.ok(r.occupation.some((w) => w.count === 22) && r.occupation.some((w) => w.count === 23), 'both Vainashika stars are listed');
  for (const x of r.rounds) {
    const at = Date.parse(x.atUtc);
    const sign = (ms) => Math.floor((((lon(x.planet, ms) % 360) + 360) % 360) / 30);
    assert.notEqual(sign(at - 2 * 3600000), sign(at + 2 * 3600000), `${x.planet} changes sign at ${x.atUtc}`);
    assert.equal(r.natal[x.round].starTa, x.moonStarTa);
  }
  console.log(`  engine: ${r.readings.STRAIGHT.sun.length} / ${r.readings.THREE_LINES.sun.length} Sun windows, ${r.occupation.length} occupations, ${r.rounds.length} sign changes in ${elapsed} ms`);
}

console.log('test-saptashalaka: all checks passed');
