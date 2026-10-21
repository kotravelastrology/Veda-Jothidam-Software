const assert = require('node:assert/strict');
const B = require('./src/dasha/bphsDashas');
const R = require('./src/dasha/rareDashas');
const { buildDasha, birthBalance } = require('./src/dasha/nakshatraDashaEngine');
const { buildAshtottariDasha } = require('./src/dasha/altDashas');
const { citeTa } = require('./src/sources/citeTa');

const STAR_DEG = 360 / 27;
/** The book counts in 360-day years and 30-day months; a ghatika is 1/60 of a day and a pala 1/60 of a ghatika. */
const bookYears = (y, m, d, gh = 0, pa = 0) => (y * 360 + m * 30 + d + gh / 60 + pa / 3600) / 360;

// ----------------------------------------------------------------- the tables as printed ---
const TOTAL = { shodashottari: 116, dwadashottari: 112, panchottari: 105, shatabdika: 100, 'chaturashiti-sama': 84, 'dwisaptati-sama': 72, 'shattrimshat-sama': 36 };
for (const [id, total] of Object.entries(TOTAL)) {
  assert.equal(B.TABLES[id].totalYears, total, `${id}: total`);
  assert.equal(new Set(B.SYSTEMS[id].cycle).size, B.SYSTEMS[id].cycle.length, `${id}: no lord twice`);
  assert.equal(B.SYSTEMS[id].cycle.length, B.SYSTEMS[id].mod, `${id}: as many lords as the divisor`);
}
assert.deepEqual(B.SYSTEMS.shodashottari.cycle, ['Sun', 'Mars', 'Jupiter', 'Saturn', 'Ketu', 'Moon', 'Mercury', 'Venus']);
assert.deepEqual(B.SYSTEMS.shodashottari.years, [11, 12, 13, 14, 15, 16, 17, 18]);
assert.ok(!B.SYSTEMS.shodashottari.cycle.includes('Rahu'), '"Rahu has no Dasha in this system"');
assert.ok(!B.SYSTEMS.dwadashottari.cycle.includes('Venus'), '"Venus does not find a place in this Dasha system"');
assert.deepEqual(B.SYSTEMS.dwadashottari.cycle, ['Sun', 'Jupiter', 'Ketu', 'Mercury', 'Rahu', 'Mars', 'Saturn', 'Moon']);
assert.ok(!B.SYSTEMS.panchottari.cycle.includes('Rahu') && !B.SYSTEMS.panchottari.cycle.includes('Ketu'));
assert.deepEqual(B.SYSTEMS.shatabdika.years, [5, 5, 10, 10, 20, 20, 30]);
assert.deepEqual(B.SYSTEMS['shattrimshat-sama'].cycle, ['Moon', 'Sun', 'Jupiter', 'Mars', 'Mercury', 'Saturn', 'Venus', 'Rahu']);

// ----------------------------------------------------------------- the start rules ---
// Each lord holds a star in turn along the 27, so every lord has 3 or 4 stars, none has 0.
for (const id of Object.keys(TOTAL)) {
  const lords = Array.from({ length: 27 }, (_, n) => B.lordOf(id, n));
  const c = {};
  lords.forEach((l) => { c[l] = (c[l] ?? 0) + 1; });
  assert.equal(Object.keys(c).length, B.SYSTEMS[id].cycle.length, `${id}: every lord is used`);
  assert.ok(Object.values(c).every((n) => n === 3 || n === 4), `${id}: 3 or 4 stars each (${JSON.stringify(c)})`);
  // The lord of the counted-from star itself is the first of the cycle.
  assert.equal(B.lordOf(id, B.SYSTEMS[id].dir === 'TO_BIRTH' ? B.SYSTEMS[id].from : B.SYSTEMS[id].from), B.SYSTEMS[id].cycle[B.SYSTEMS[id].dir === 'TO_BIRTH' ? 0 : 0]);
}
// Dwadashottari counts from the birth star to Revati, so the order runs backwards along the stars.
assert.equal(B.lordOf('dwadashottari', B.NAK.Revati), 'Sun');
assert.equal(B.lordOf('dwadashottari', B.NAK.UBhadra), 'Jupiter');
assert.equal(B.lordOf('shodashottari', B.NAK.Pushya), 'Sun');
assert.equal(B.lordOf('shodashottari', B.NAK.Ashlesha), 'Mars');

// ----------------------------------------------------------------- the book's examples ---
// Mrigasira: Panchottari - Mercury (13 years); Shatabdika - Mars; Shat-trimsat - Jupiter, "The Dasha span of Jupiter is 3 years".
assert.equal(B.lordOf('panchottari', B.NAK.Mrigashira), 'Mercury');
assert.equal(B.TABLES.panchottari.years.Mercury, 13);
assert.equal(B.lordOf('shatabdika', B.NAK.Mrigashira), 'Mars');
assert.equal(B.lordOf('shattrimshat-sama', B.NAK.Mrigashira), 'Jupiter');
assert.equal(B.TABLES['shattrimshat-sama'].years.Jupiter, 3);
// Chaturashiti-sama: the printed rule (count 18, remainder 4) gives Mercury; the printed example says Mars. Both kept.
assert.equal(B.countFor('chaturashiti-sama', B.NAK.Mrigashira), 18);
assert.equal(B.lordOf('chaturashiti-sama', B.NAK.Mrigashira), 'Mercury');
assert.deepEqual(B.SYSTEMS['chaturashiti-sama'].example, { birthStar: 4, firstLord: 'Mars', disagrees: true });
// Shodashottari, Rohini: Venus; Bhayat 10/15 = 615 palas, Bhabhog 65/20 = 3920 palas.
assert.equal(B.countFor('shodashottari', B.NAK.Rohini), 24);
assert.equal(B.lordOf('shodashottari', B.NAK.Rohini), 'Venus');
{
  const f = 615 / 3920;
  const moon = B.NAK.Rohini * STAR_DEG + f * STAR_DEG;
  const bal = birthBalance(B.TABLES.shodashottari, moon);
  assert.equal(bal.lord, 'Venus');
  const expired = 18 * f;
  // The book: expired 2 years 9 months 26 days (19 ghatikas 29 palas); balance 15 years 2 months 3 days (20 ghatikas 31 palas).
  // Its ghatikas do not follow from its own figures (0.64 of a day is 38 ghatikas; 18 years less the expired leaves 40, not 20);
  // the years, months and days do.
  assert.ok(Math.abs(expired * 360 - (2 * 360 + 9 * 30 + 26)) < 1, `expired ${expired * 360} days vs 2y 9m 26d`);
  assert.ok(Math.abs(bal.balanceYears * 360 - (15 * 360 + 2 * 30 + 3)) < 1, `balance ${bal.balanceYears * 360} days vs 15y 2m 3d`);
  assert.ok(Math.abs(bal.balanceYears - bookYears(15, 2, 3, 40, 31)) < 0.001, 'with the ghatikas the subtraction gives (40, 31)');
}

// ----------------------------------------------------------------- Ashtottari ---
const blocks = B.ASHTOTTARI_BLOCKS;
assert.deepEqual(blocks.map((b) => b.lord), ['Sun', 'Moon', 'Mars', 'Mercury', 'Saturn', 'Jupiter', 'Rahu', 'Venus']);
assert.deepEqual(blocks.map((b) => b.years), [6, 15, 8, 17, 10, 19, 12, 21]);
assert.equal(blocks.reduce((s, b) => s + b.years, 0), 108);
assert.deepEqual(blocks.map((b) => b.parts.length), [4, 3, 4, 3, 4, 3, 4, 3], '28 divisions: 4, 3, 4, 3, 4, 3, 4, 3');
const parts = blocks.flatMap((b) => b.parts);
assert.equal(new Set(parts).size, 28);
assert.ok(parts.includes(B.ABHIJIT));
for (let n = 0; n < 27; n += 1) assert.ok(parts.includes(n), `star ${n}`);
assert.deepEqual(blocks[0].parts, [B.NAK.Ardra, B.NAK.Punarvasu, B.NAK.Pushya, B.NAK.Ashlesha], '"From 4 Nakshatras from Aridra commences the Dasha of the Sun"');
assert.deepEqual(blocks[4].parts, [B.NAK.PAshadha, B.NAK.UAshadha, B.ABHIJIT, B.NAK.Shravana]);
// Abhijit: the 4th pada of Uttarashada and the first 1/15 of Sravana (276°40′ to 280°53′20″).
assert.ok(Math.abs(B.ABHIJIT_FROM - (276 + 40 / 60)) < 1e-9);
assert.ok(Math.abs(B.ABHIJIT_TO - (280 + 53 / 60 + 20 / 3600)) < 1e-9);
assert.equal(B.divisionOf(279).division, B.ABHIJIT);
assert.equal(B.divisionOf(270).division, B.NAK.UAshadha);
assert.equal(B.divisionOf(285).division, B.NAK.Shravana);
assert.equal(B.divisionOf(B.ABHIJIT_TO - 1e-9).division, B.ABHIJIT);
// The book's example: Uttarashada, Bhabhog 64/16 (3856 palas), Bhayat 24/20 (1460 palas) — the 2nd pada.
{
  const moon = B.NAK.UAshadha * STAR_DEG + (1460 / 3856) * STAR_DEG;
  const d = B.divisionOf(moon);
  assert.equal(d.division, B.NAK.UAshadha);
  assert.ok(Math.abs(d.fraction - 1460 / 2892) < 1e-9, '"deducting 16/4 ... the actual Bhabhog as 48/12 and the Bhayat 24/20"');
  const bal = B.ashtottariBalance(moon);
  assert.equal(bal.lord, 'Saturn');
  assert.equal(bal.share, 2.5, '"Its Dasha span is 30 months"');
  // The book's expired period in the star: 30 months x 1460 / 2892 = 15 months 4 days 21 ghatikas 24 palas; it prints
  // "15 months, 21 days, 24 ghatikas" (the 4 days dropped out), and the balance in the star "14 months, 25 days, 38 ghatikas, 36 palas".
  const expiredInStar = 30 * (1460 / 2892);
  assert.ok(Math.abs(expiredInStar - (15 + 4 / 30 + 21 / 1800 + 24 / 108000)) < 0.001);
  // Total balance: 14 m 25 d 38 gh 36 pa + Abhijit and Sravana 60 months = 6 years 2 months 25 days 38 ghatikas 36 palas.
  assert.ok(Math.abs(bal.balanceYears - bookYears(6, 2, 25, 38, 36)) < 0.0005, `${bal.balanceYears} vs 6y 2m 25d 38gh 36pa = ${bookYears(6, 2, 25, 38, 36)}`);
}
// Each division's share is the lord's years over the block: 18, 15/3 = 5 ... Venus 7.
assert.equal(B.ashtottariBalance(B.NAK.Krittika * STAR_DEG).share, 7);
assert.ok(Math.abs(B.ashtottariBalance(B.NAK.Ardra * STAR_DEG).balanceYears - 6) < 1e-9, 'the very start of Ardra: the Sun\'s whole 6 years');
assert.ok(Math.abs(B.ashtottariBalance(B.NAK.Ashlesha * STAR_DEG + STAR_DEG - 1e-9).balanceYears) < 1e-6, 'the end of Ashlesha: nothing of the Sun\'s left');
// Dhanishta to Krittika, which the earlier port (4,3,4,3,4,3,4,2 on 27 stars) put with the wrong lords.
assert.equal(B.ashtottariBalance(B.NAK.Dhanishta * STAR_DEG + 1).lord, 'Jupiter');
assert.equal(B.ashtottariBalance(B.NAK.Revati * STAR_DEG + 1).lord, 'Rahu');
assert.equal(B.ashtottariBalance(B.NAK.Krittika * STAR_DEG + 1).lord, 'Venus');
assert.equal(B.ashtottariBalance(B.NAK.Shravana * STAR_DEG + 5).lord, 'Saturn');
// Through the report's builder (the shape the report reads).
{
  const a = buildAshtottariDasha(B.NAK.Dhanishta * STAR_DEG + 1, Date.UTC(2000, 0, 1));
  assert.equal(a.startLord, 'Jupiter');
  assert.equal(a.periods.length, 8);
  const total = a.periods.reduce((s, p) => s + p.years, 0);
  assert.ok(total > 100 && total <= 108);
  assert.ok(Math.abs(a.periods[0].subs.reduce((s, x) => s + x.years, 0) - a.periods[0].years) < 0.05);
}

// ----------------------------------------------------------------- the engine builds them ---
for (const id of [...Object.keys(TOTAL), 'ashtottari']) {
  const table = R.getTable(id);
  assert.ok(table, `${id}: a table`);
  const d = buildDasha(table, { birthMs: Date.UTC(1990, 5, 15), moonLongitude: 100.3, depth: 2, cycles: 1 });
  assert.equal(d.periods.length, table.cycle.length);
  const sum = d.periods.reduce((s, p) => s + p.durationYears, 0);
  assert.ok(Math.abs(sum - (table.totalYears - (table.years[d.startLord] - d.balanceYears))) < 1e-9, `${id}: the cycle less what was spent before birth`);
  assert.ok(d.balanceYears > 0 && d.balanceYears <= table.years[d.startLord]);
  for (const p of d.periods) {
    const kids = p.children.reduce((s, c) => s + c.durationYears, 0);
    assert.ok(Math.abs(kids - p.durationYears) < 1e-9, `${id}: ${p.lord}'s sub-periods sum to it`);
  }
}

// ----------------------------------------------------------------- the register ---
const dec = R.getMethod('shashtihayani');
assert.equal(dec.level, 'DECLARED');
assert.equal(R.getTable('shashtihayani'), null);
assert.match(dec.notes, /சித்திரை/, 'the reason: Chitra is named nowhere in the completed table');
for (const id of [...Object.keys(TOTAL), 'ashtottari']) {
  const m = R.getMethod(id);
  assert.equal(m.level, 'SOURCED', id);
  assert.equal(m.promoted, false, `${id} is not promoted: no worked example replays exactly`);
  assert.ok(m.implemented && m.source && !/PDF$/.test(m.source.pageLocus));
  assert.ok(/printed pp?\.\d/.test(m.source.pageLocus), `${id}: printed pages in the locus`);
  assert.ok(!/PDF/.test(citeTa(m.source)) && /ப\.\d+/.test(citeTa(m.source)), citeTa(m.source));
}
assert.equal(R.promotedMethods().length, 1, 'only Vimshottari is promoted');
// The PDF page is the printed page + 7 in this scan (the Ashtottari table: printed 410, PDF 417).
assert.match(B.ASHTOTTARI_SOURCE.pageLocus, /printed pp\.409-410 \(PDF 416-417\)/);
assert.match(B.SYSTEMS.shodashottari.source.pageLocus, /printed pp\.410-411 \(PDF 417-418\)/);
assert.match(citeTa(B.SYSTEMS['dwisaptati-sama'].source), /ப\.414/);
for (const [id, s] of Object.entries(B.SYSTEMS)) assert.ok(/[஀-௿]/.test(s.nameTa) && /[஀-௿]/.test(s.whenTa), id);
assert.ok(/[஀-௿]/.test(B.SHASTIHAYANI_PROBLEM_TA));

// ----------------------------------------------------------------- when each system is said to suit ---
{
  const signs = { Sun: 0, Moon: 5, Mars: 2, Mercury: 1, Jupiter: 2, Venus: 1, Saturn: 9, Rahu: 4, Ketu: 10 };
  const f = (lagna, extra = {}) => ({ lagnaLongitude: lagna, signs, paksha: 'SHUKLA', day: true, ...extra });
  // Hora: an odd sign's first 15 degrees are the Sun's; an even sign's, the Moon's.
  assert.equal(B.horaOf(5), 'Sun'); assert.equal(B.horaOf(20), 'Moon'); assert.equal(B.horaOf(35), 'Moon'); assert.equal(B.horaOf(50), 'Sun');
  assert.equal(B.applicability('shodashottari', f(5)).applies, true, 'Sun\'s hora, Shukla');
  assert.equal(B.applicability('shodashottari', f(5, { paksha: 'KRISHNA' })).applies, false);
  assert.equal(B.applicability('shodashottari', f(20, { paksha: 'KRISHNA' })).applies, true, 'Moon\'s hora, Krishna');
  assert.equal(B.applicability('shattrimshat-sama', f(5)).applies, true, 'day, Sun\'s hora');
  assert.equal(B.applicability('shattrimshat-sama', f(5, { day: false })).applies, false);
  assert.equal(B.applicability('shattrimshat-sama', f(20, { day: false })).applies, true, 'night, Moon\'s hora');
  // Vargottama: Aries 0-3°20′ has the Aries navamsha; Taurus's first navamsha is Capricorn.
  assert.equal(B.applicability('shatabdika', f(1)).applies, true);
  assert.equal(B.applicability('shatabdika', f(31)).applies, false);
  // Dwadashottari: the Lagna's navamsha in Taurus or Libra (Aries 3°20′-6°40′ is Taurus's navamsha, 20°-23°20′ Libra's).
  assert.equal(B.applicability('dwadashottari', f(4)).applies, true);
  assert.equal(B.applicability('dwadashottari', f(21)).applies, true);
  assert.equal(B.applicability('dwadashottari', f(7)).applies, false, 'Gemini navamsha');
  assert.equal(B.applicability('dwadashottari', f(1)).applies, false);
  // Panchottari: Cancer, in Cancer's dwadashamsa (the first 2.5 degrees).
  assert.equal(B.applicability('panchottari', f(91)).applies, true);
  assert.equal(B.applicability('panchottari', f(100)).applies, false);
  // The lord of the 10th in the 10th; the lord of the Lagna in the Lagna or the 7th.
  assert.equal(B.applicability('chaturashiti-sama', { ...f(5), signs: { ...signs, Saturn: 9 } }).applies, true, 'Aries: the 10th is Capricorn, its lord Saturn there');
  assert.equal(B.applicability('dwisaptati-sama', { ...f(5), signs: { ...signs, Mars: 0 } }).applies, true, 'Aries lord Mars in Aries');
  assert.equal(B.applicability('dwisaptati-sama', { ...f(5), signs: { ...signs, Mars: 6 } }).applies, true, 'Mars in the 7th');
  assert.equal(B.applicability('dwisaptati-sama', { ...f(5), signs: { ...signs, Mars: 2 } }).applies, false);
  // Ashtottari: Rahu not in the Lagna nor a kendra / trikona from the Lagna's lord.
  assert.equal(B.applicability('ashtottari', { ...f(5), signs: { ...signs, Mars: 0, Rahu: 1 } }).applies, true, 'Rahu in the 2nd from Mars: not a kendra or trikona, not the Lagna');
  assert.equal(B.applicability('ashtottari', { ...f(5), signs: { ...signs, Mars: 0, Rahu: 0 } }).applies, false, 'Rahu in the Lagna');
  assert.equal(B.applicability('ashtottari', { ...f(5), signs: { ...signs, Mars: 0, Rahu: 3 } }).applies, false, 'Rahu in a kendra (4th) from the lord');
  assert.equal(B.applicability('vimshottari', f(5)).applies, null);
}

console.log('bphs-dashas: ok');
