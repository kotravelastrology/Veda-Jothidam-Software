const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const T = require('./src/report/ashtakootaTables');
const { ashtakoota, moonOf, taraOf } = require('./src/report/ashtakoota');
const { citeTa } = require('./src/sources/citeTa');

const FIX = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/ashtakoota/shridhar-18-33.json'), 'utf8'));
const lon = (star, pada) => star * (360 / 27) + (pada - 1) * (360 / 108) + 0.5;
const plain = (o) => JSON.parse(JSON.stringify(o));

// ------------------------------------------------------------------ the maxima: 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 = 36 ---
assert.deepEqual([...T.KOOTAS], ['VARNA', 'VASHYA', 'TARA', 'YONI', 'GRAHA_MAITRI', 'GANA', 'BHAKUTA', 'NADI']);
assert.deepEqual(T.KOOTAS.map((k) => T.MAX[k]), [1, 2, 3, 4, 5, 6, 7, 8]);
assert.equal(T.KOOTAS.reduce((s, k) => s + T.MAX[k], 0), 36);
// Each table's largest cell is the koota's maximum, and every table cell is within it.
const flat = (m) => m.flat();
assert.equal(Math.max(...flat(T.VASHYA)), 2);
assert.equal(Math.max(...flat(T.YONI)), 4);
assert.equal(Math.max(...flat(T.GRAHA_MAITRI)), 5);
assert.equal(Math.max(...flat(T.GANA)), 6);
assert.equal(Math.max(...flat(T.BHAKUTA_PRINTED)), 7);

// ---------------------------------------------------------------- Table 18.8: the Varna of the rashi ---
assert.deepEqual(T.VARNA_OF_RASHI.map((v, r) => [r, v]).filter(([, v]) => v === 0).map(([r]) => r + 1), [4, 8, 12], 'Brahmin: Cancer, Scorpio, Pisces');
assert.deepEqual(T.VARNA_OF_RASHI.map((v, r) => [r, v]).filter(([, v]) => v === 1).map(([r]) => r + 1), [1, 5, 9], 'Kshatriya: Aries, Leo, Sagittarius');
assert.deepEqual(T.VARNA_OF_RASHI.map((v, r) => [r, v]).filter(([, v]) => v === 2).map(([r]) => r + 1), [2, 6, 10], 'Vaishya: Taurus, Virgo, Capricorn');
assert.deepEqual(T.VARNA_OF_RASHI.map((v, r) => [r, v]).filter(([, v]) => v === 3).map(([r]) => r + 1), [3, 7, 11], 'Shudra: Gemini, Libra, Aquarius');
// Pisces (Brahmin) bridegroom is compatible with every bride, a Shudra bride with every bridegroom (p.482).
for (let b = 0; b < 12; b += 1) assert.equal(ashtakoota({ bride: { moonLongitude: b * 30 + 5 }, groom: { moonLongitude: 11 * 30 + 5 } }).rows[0].points, 1);
for (let g = 0; g < 12; g += 1) assert.equal(ashtakoota({ bride: { moonLongitude: 2 * 30 + 5 }, groom: { moonLongitude: g * 30 + 5 } }).rows[0].points, 1);
assert.equal(ashtakoota({ bride: { moonLongitude: 3 * 30 + 5 }, groom: { moonLongitude: 2 * 30 + 5 } }).rows[0].points, 0, 'a Brahmin bride, a Shudra bridegroom: 0');

// ---------------------------------------------------------------- Table 18.11: Vashya groups ---
assert.equal(T.vashyaGroup(2, 3), 0); assert.equal(T.vashyaGroup(8, 3), 0); assert.equal(T.vashyaGroup(8, 20), 1);
assert.equal(T.vashyaGroup(9, 3), 1); assert.equal(T.vashyaGroup(9, 20), 2); assert.equal(T.vashyaGroup(3, 1), 2);
assert.equal(T.vashyaGroup(4, 1), 3); assert.equal(T.vashyaGroup(7, 1), 4);
for (let g = 0; g < 5; g += 1) assert.equal(T.VASHYA[g][g], 2, 'the same group: the maximum two');
assert.equal(T.VASHYA[3][0], 0, 'Leo (Vanchar) bride, biped bridegroom');

// ---------------------------------------------------------------- Table 18.13: Tara, counted by the rule ---
// The printed table (rows: the bride's group, columns: the bridegroom's), read from the page image.
const TARA_PRINTED = [
  [[3], [3], [1.5, 'B'], [1.5, 'G'], [1.5, 'B'], [1.5, 'G'], [1.5, 'B'], [1.5, 'G'], [3]],
  [[3], [3], [3], [1.5, 'B'], [1.5, 'G'], [1.5, 'B'], [1.5, 'G'], [1.5, 'B'], [3, 'G']],
  [[1.5, 'G'], [3], [3], [3], [1.5, 'B'], [1.5, 'G'], [1.5, 'B'], [1.5, 'G'], [1.5, 'B']],
  [[1.5, 'B'], [1.5, 'G'], [3], [3], [3], [1.5, 'B'], [1.5, 'G'], [1.5, 'B'], [1.5, 'G']],
  [[1.5, 'G'], [1.5, 'B'], [1.5, 'G'], [3], [3], [3], [1.5, 'B'], [1.5, 'G'], [1.5, 'B']],
  [[1.5, 'B'], [1.5, 'G'], [1.5, 'B'], [1.5, 'G'], [3], [3], [3], [1.5, 'B'], [1.5, 'G']],
  [[1.5, 'G'], [1.5, 'B'], [1.5, 'G'], [1.5, 'B'], [1.5, 'G'], [3], [3], [3], [1.5, 'B']],
  [[1.5, 'B'], [1.5, 'G'], [1.5, 'B'], [1.5, 'G'], [1.5, 'B'], [1.5, 'G'], [3], [3], [3]],
  [[3], [1.5, 'B'], [1.5, 'G'], [1.5, 'B'], [1.5, 'G'], [1.5, 'B'], [1.5, 'G'], [3], [3]],
];
let taraDiffer = 0;
for (let r = 0; r < 9; r += 1) {
  for (let c = 0; c < 9; c += 1) {
    const t = taraOf({ star: r }, { star: c });
    const [pts, who] = TARA_PRINTED[r][c];
    if (t.points !== pts || (who === 'G' && !t.deathToBride) || (who === 'B' && !t.deathToGroom)) {
      taraDiffer += 1;
      assert.deepEqual([r + 1, c + 1], [2, 9], 'the only printed cell the rule does not give: row 2, column 9 ("3 (-G)")');
    }
  }
}
assert.equal(taraDiffer, 1, 'the book prints "3 (-G)" at bride group 2 / bridegroom group 9; its own rule gives 1.5');
assert.equal(taraOf({ star: 1 }, { star: 8 }).points, 1.5);
// The same star is always 3 (the 1st and 1st) — both counts are 1.
assert.equal(taraOf({ star: 5 }, { star: 5 }).points, 3);
// A bad count in both directions would be 0; it never happens (3 + 7 = 10, and 5 + 5 = 10 — not 9 or 18).
for (let a = 0; a < 27; a += 1) for (let b = 0; b < 27; b += 1) assert.ok(taraOf({ star: a }, { star: b }).points > 0, `${a},${b}`);

// ---------------------------------------------------------------- Table 18.14: Yoni ---
assert.equal(T.YONI.length, 14);
for (let i = 0; i < 14; i += 1) { assert.equal(T.YONI[i].length, 14); assert.equal(T.YONI[i][i], 4, `${T.YONI_NAMES[i]} with itself`); }
// Natural enemies score 0: Horse-Buffalo, Elephant-Lion, Sheep-Monkey, Serpent-Mongoose, Dog-Hare, Cat-Rat, Cow-Tiger.
for (const [a, b] of [[0, 8], [1, 13], [2, 11], [3, 12], [4, 10], [5, 6], [7, 9]]) {
  assert.equal(T.YONI[a][b], 0, `${T.YONI_NAMES[a]} / ${T.YONI_NAMES[b]}`);
  assert.equal(T.YONI[b][a], 0, `${T.YONI_NAMES[b]} / ${T.YONI_NAMES[a]}`);
}
// 27 stars, 14 animals: each animal two stars except the Mongoose and Lion (UAshadha; Purvabhadrapada), the Serpent's pair is Rohini and Mrigashira.
assert.equal(T.YONI_OF_STAR.length, 27);
assert.deepEqual([T.YONI_OF_STAR[3], T.YONI_OF_STAR[4]], [3, 3]);
assert.equal(T.YONI_OF_STAR[0], T.YONI_OF_STAR[23], 'Ashvani and Shatabhisha: the horse');
assert.equal(T.YONI_OF_STAR[24], 13, 'the Lion (the table prints Uttarabhadrapada twice; read as Purvabhadrapada)');
assert.equal(T.YONI_OF_STAR[25], 7, 'the Cow');

// ---------------------------------------------------------------- Table 18.17: Graha Maitri ---
for (let a = 0; a < 7; a += 1) for (let b = 0; b < 7; b += 1) assert.equal(T.GRAHA_MAITRI[a][b], T.GRAHA_MAITRI[b][a], 'planetary friendship is read the same both ways');
assert.deepEqual(T.MAITRI_GROUP_OF_RASHI, [0, 1, 2, 3, 4, 2, 1, 0, 5, 6, 6, 5], 'the signs of each lord');
assert.equal(T.GRAHA_MAITRI[1][4], 0, 'Venus and the Sun: bitter enmity');
assert.equal(T.GRAHA_MAITRI[6][4], 0, 'Saturn and the Sun');

// ---------------------------------------------------------------- Table 18.18 and 18.22: Gana and Nadi ---
for (const g of [0, 1, 2]) assert.equal(T.GANA_OF_STAR.filter((x) => x === g).length, 9, 'nine stars to each Gana');
for (const n of [0, 1, 2]) assert.equal(T.NADI_OF_STAR.filter((x) => x === n).length, 9, 'nine stars to each Nadi');
assert.deepEqual(T.GANA, [[6, 5, 1], [6, 6, 0], [0, 0, 6]]);
assert.deepEqual([0, 5, 6, 11, 12, 17, 18, 23, 24].map((s) => T.NADI_OF_STAR[s]), new Array(9).fill(0), 'Adi: Ashvani, Ardra, Punarvasu, U.Falguni, Hasta, Jyeshta, Moola, Shatabhisha, P.Bhadra');
assert.deepEqual([2, 3, 8, 9, 14, 15, 20, 21, 26].map((s) => T.NADI_OF_STAR[s]), new Array(9).fill(2), 'Antya: Krittika, Rohini, Ashlesha, Magha, Swati, Vishakha, U.Shada, Shravana, Revati');
assert.deepEqual([0, 4, 7].map((s) => T.GANA_OF_STAR[s]), [0, 0, 0], 'Deva: Ashvani, Mrigashira, Pushya');

// ---------------------------------------------------------------- Table 18.20: Bhakuta ---
// The printed 12 x 12 table is exactly the rule: the bridegroom's sign 1, 3, 4, 7, 10, 11 from the bride's give 7; 2, 5, 6, 8, 9, 12 give 0.
for (let b = 0; b < 12; b += 1) {
  for (let g = 0; g < 12; g += 1) {
    const d = ((g - b + 12) % 12) + 1;
    assert.equal(T.BHAKUTA_PRINTED[b][g], T.BHAKUTA_GOOD_DISTANCES.includes(d) ? 7 : 0, `Bhakuta ${b + 1} / ${g + 1}`);
    const r = ashtakoota({ bride: { moonLongitude: b * 30 + 7 }, groom: { moonLongitude: g * 30 + 7 } });
    assert.equal(r.rows[6].points, T.BHAKUTA_PRINTED[b][g]);
  }
}

// ---------------------------------------------------------------- the engine ---
{
  // Table 18.33(a), the first cell: Ashvani with Ashvani — 28 gunas, the Nadi alone lost (8).
  const r = ashtakoota({ bride: { moonLongitude: lon(0, 1) }, groom: { moonLongitude: lon(0, 1) } });
  assert.deepEqual(r.rows.map((x) => x.points), [1, 2, 3, 4, 5, 6, 7, 0]);
  assert.equal(r.total, 28);
  assert.equal(r.nadiDosha, true);
  assert.equal(r.band.code, 'VERY_GOOD');
  assert.match(r.nadiRejectTa, /28/);
  assert.equal(r.rows.find((x) => x.id === 'NADI').major, true);
  assert.equal(r.maximum, 36);
  // Ashvani with Bharani: 33.
  assert.equal(ashtakoota({ bride: { moonLongitude: lon(0, 1) }, groom: { moonLongitude: lon(1, 1) } }).total, 33);
  assert.equal(ashtakoota({ bride: { moonLongitude: lon(0, 1) }, groom: { moonLongitude: lon(1, 1) } }).band.code, 'EXCELLENT');
}
// The bands: the Bhakuta-absent grouping is stricter.
{
  const lowBhakuta = ashtakoota({ bride: { moonLongitude: lon(0, 1) }, groom: { moonLongitude: lon(3, 1) } }); // Aries bride, Taurus groom: the 2nd, Bhakuta 0
  assert.equal(lowBhakuta.rows[6].points, 0);
  assert.equal(lowBhakuta.band.bhakutaAbsent, true);
  assert.equal(lowBhakuta.bhakutaDosha, true);
}
assert.deepEqual(T.BANDS.NORMAL.map((b) => b.from), [31, 21, 17, 0]);
assert.deepEqual(T.BANDS.BHAKUTA_ABSENT.map((b) => b.from), [31, 26, 21, 0]);

// ---------------------------------------------------------------- the book's grand table, as sampled ---
assert.equal(FIX.cells.length, 54);
let agree = 0;
for (const c of FIX.cells) {
  const r = ashtakoota({ bride: { moonLongitude: lon(c.bride[1], c.bride[2]) }, groom: { moonLongitude: lon(c.groom[1], c.groom[2]) } });
  assert.equal(r.total, c.computed, `${c.bride[0]} with ${c.groom[0]}: the eight tables still give ${c.computed}`);
  assert.deepEqual(r.rows.map((x) => x.points), c.points);
  assert.ok(Math.abs(c.book - c.computed) <= 2, `${c.bride[0]} with ${c.groom[0]}: the book's total is within 2 of the tables'`);
  if (c.book === c.computed) agree += 1;
}
assert.equal(agree, 24, 'the book total and its own eight tables agree in 24 of 54 sampled cells (documented, not hidden)');
// The first six cells of the Ashvani row all agree with the book where it counts: Ashvani/Ashvani and Ashvani/Bharani.
assert.equal(FIX.cells[0].book, 28);
assert.equal(FIX.cells[1].book, 33);

// ---------------------------------------------------------------- inputs, sources, words ---
assert.throws(() => ashtakoota({ bride: { moonLongitude: NaN }, groom: { moonLongitude: 10 } }), /Moon/);
const m = moonOf(100);
assert.equal(m.star, Math.floor(100 / (360 / 27)));
assert.equal(moonOf(-10).longitude, 350);
for (const k of Object.keys(T.SOURCES)) assert.ok(!/PDF/.test(citeTa(T.SOURCES[k])) && /ப\.\d+/.test(citeTa(T.SOURCES[k])), k);
assert.match(citeTa(T.SOURCES.NADI), /ப\.504/);
assert.match(citeTa(T.SOURCES.TOTALS), /ப\.535-540/);
const r0 = ashtakoota({ bride: { moonLongitude: 10 }, groom: { moonLongitude: 200 } });
assert.ok(!/\bundefined\b|NaN/.test(JSON.stringify(plain(r0))));
for (const t of [...T.OUR_READINGS_TA, ...Object.values(T.AREA_TA), ...Object.values(T.KOOTA_TA)]) assert.ok(/[஀-௿]/.test(t));

console.log('ashtakoota: ok');
