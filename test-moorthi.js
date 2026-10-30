const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const T = require('./src/report/moorthiTables');
const { moorthiNirnaya, byJanmaRasi, pulippaniFor } = require('./src/report/moorthi');
const { planetLongitude } = require('./src/ephemeris/siderealPositions');
const { resolveByTitle } = require('./src/sources/registry');

const FIX = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/gochara-vedha/moorthi.json'), 'utf8'));
const DAY = 86400000;
const plain = (o) => JSON.parse(JSON.stringify(o));
const RASI = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const rasiOf = (name) => RASI.findIndex((r) => r.toUpperCase() === name.toUpperCase());
// The books' spellings of the four forms.
const FORM = { SWARNA: 'SWARNA', SWAMA: 'SWARNA', RAJATHA: 'RAJATA', RAJATA: 'RAJATA', RAJAT: 'RAJATA', THAMBRA: 'TAMRA', TAMRA: 'TAMRA', TAAMRA: 'TAMRA', LOHA: 'LOHA', LOH: 'LOHA', IRON: 'LOHA' };
const form = (s) => FORM[s.toUpperCase()];
const printedNum = (s) => Number(s.replace(/^0(\d)/, '0.$1'));

// ------------------------------------------------ the four groups, six books ---
for (const [book, g] of Object.entries(FIX.groups)) {
  for (const [name, houses] of Object.entries(g)) {
    if (name === 'page') continue;
    const m = T.MOORTHIS.find((x) => x.id === form(name));
    assert.deepEqual([...m.houses].sort((a, b) => a - b), [...houses].sort((a, b) => a - b), `${book} ${name}`);
  }
}
assert.deepEqual(Array.from({ length: 12 }, (_, i) => T.moorthiOfHouse(i + 1)).filter((x, i, a) => a.indexOf(x) === i).length, 4);
for (let h = 1; h <= 12; h += 1) assert.equal(T.MOORTHIS.filter((m) => m.houses.includes(h)).length, 1, `house ${h} in one group`);

// ------------------------------------------------ Pulippani: grades and quanta ---
for (const nature of ['benefic', 'malefic']) {
  const want = FIX.pulippaniGrades[nature].map((r) => form(r.split('|')[0]));
  assert.deepEqual([...T.PULIPPANI_ORDER[nature.toUpperCase()]], want, `Pulippani ${nature} order`);
}
assert.deepEqual([...T.PULIPPANI_FRACTION], [1, 0.75, 0.5, 0.25]);
{
  const q = FIX.pulippaniQuanta;
  assert.equal(T.PULIPPANI_QUANTA.conventional.GOOD, q.p220.conventionalGood);
  assert.equal(T.PULIPPANI_QUANTA.conventional.BAD, 0, 'p.220 "Nil"');
  assert.deepEqual([...T.PULIPPANI_QUANTA.series.LIST], ['Swarna', 'Rajatha', 'Thambra', 'Loha'].map((k) => q.p220[k]));
  assert.deepEqual([...T.PULIPPANI_QUANTA.series.TABLE], ['Swarna', 'Rajatha', 'Thambra', 'Loha'].map((k) => printedNum(q.p334[k])));
  // TABLE is the half-unit times his fractions; LIST halves each time.
  assert.deepEqual([...T.PULIPPANI_QUANTA.series.TABLE], T.PULIPPANI_FRACTION.map((f) => f * 0.5));
}

// ------------------------------------------------ Pulippani's 1998 list and Table 17 ---
{
  const ex = FIX.pulippani1998;
  assert.deepEqual([...T.PULIPPANI_ORDER.BENEFIC].length, 4);
  const rows = byJanmaRasi('Jupiter', 10, rasiOf('Aries'), 'BENEFIC'); // Kumbha; the book's Moon, Mesha
  for (const name of ['Swarna', 'Rajatha', 'Thambra', 'Loha']) {
    for (const r of ex[name]) assert.equal(rows[rasiOf(r)].moorthi, form(name), `1998 list: ${r} ${name}`);
  }
  assert.deepEqual(rows.filter((r) => r.conventional === 'GOOD').map((r) => r.house).sort((a, b) => a - b), ex.goodHousesJupiter);

  const printed = {};
  for (const line of FIX.table17.rows) {
    const [rasi, conv, , special, sq, total] = line.split('|');
    printed[rasiOf(rasi)] = { conv: conv.startsWith('Good') ? 'GOOD' : 'BAD', house: Number(conv.replace(/\D/g, '')), form: form(special), sq: printedNum(sq), total: printedNum(total) };
  }
  assert.equal(printed[6], undefined, 'Table 17 prints no Libra row');
  assert.equal(T.TABLE_17.printSlips.missingRasi, 6);
  for (const [i, p] of Object.entries(printed)) {
    const r = rows[i];
    const mine = T.TABLE_17.rows[i];
    assert.deepEqual([...mine], [p.conv, p.house, p.form, p.sq, p.total], `Table 17 transcription ${RASI[i]}`);
    assert.deepEqual([r.conventional, r.house, r.moorthi], [p.conv, p.house, p.form], `Table 17 ${RASI[i]}: engine`);
    const q = r.pulippani[0];
    if (RASI[i] === 'Capricorn') {
      // Printed: Loha 0.625 and total 0.5625 = 0.5 + 0.0625 (the LIST series).
      assert.equal(q.special.TABLE, 0.125);
      assert.equal(p.sq, T.TABLE_17.printSlips.capricornSpecial);
      assert.equal(p.total, q.total.LIST);
      assert.equal(p.total, T.TABLE_17.printSlips.capricornTotal);
    } else {
      assert.equal(q.special.TABLE, p.sq, `Table 17 ${RASI[i]}: form quantum`);
      assert.equal(q.total.TABLE, p.total, `Table 17 ${RASI[i]}: total`);
    }
  }
}

// ------------------------------------------------ Table 23 (Jupiter into Gemini) and Table 24 (Saturn into Taurus) ---
{
  const rows = byJanmaRasi('Jupiter', 2, rasiOf('Pisces'), 'BENEFIC');
  for (const line of FIX.table23.rows) {
    const [rasi, conv, , special, sq, total] = line.split('|');
    const i = rasiOf(rasi);
    const r = rows[i];
    assert.equal(r.conventional, /GOOD/.test(conv) ? 'GOOD' : 'BAD', `Table 23 ${rasi}: conventional`);
    assert.equal(r.moorthi, form(special), `Table 23 ${rasi}: form`);
    assert.equal(r.pulippani[0].special.TABLE, Number(sq), `Table 23 ${rasi}: form quantum`);
    // The printed total is the form's quantum alone — the good rows' 0.5 is not added.
    assert.equal(Number(total), r.pulippani[0].special.TABLE, `Table 23 ${rasi}: printed total`);
    if (r.conventional === 'GOOD') assert.notEqual(Number(total), r.pulippani[0].total.TABLE);
    assert.deepEqual(T.TABLE_23.rows[i].slice(0, 4), [r.conventional, r.house, r.moorthi, r.pulippani[0].special.TABLE]);
  }
  const sat = byJanmaRasi('Saturn', 1, rasiOf('Cancer'), 'MALEFIC');
  assert.deepEqual(sat.map((r) => r.moorthi), FIX.table24Saturn.forms.map(form), 'Table 24: Saturn\'s forms from a Cancer Moon');
  assert.deepEqual(Object.values(T.TABLE_24_SATURN.forms), sat.map((r) => r.moorthi));
  // Malefic order: silver is the full share.
  assert.equal(pulippaniFor('MALEFIC', 'BAD', 'RAJATA').fraction, 1);
  assert.equal(pulippaniFor('MALEFIC', 'BAD', 'SWARNA').fraction, 0.25);
}

// ------------------------------------------------ the books' worked examples against the sky ---
const entry = (planet, natalRasi, aroundMs, sign) => {
  const r = moorthiNirnaya({ natalMoonLongitude: natalRasi * 30 + 15, atMs: aroundMs });
  const e = r.planets[planet].entries.filter((x) => x.sign === sign && !x.backward)
    .sort((a, b) => Math.abs(Date.parse(a.utc) - aroundMs) - Math.abs(Date.parse(b.utc) - aroundMs))[0];
  assert.ok(e, `${planet} enters ${RASI[sign]} near ${new Date(aroundMs).toISOString()}`);
  return e;
};
{
  // Rao: Mercury into Gemini 3:06 pm IST 26 May 2000, the Moon 10°29′ Aquarius.
  const ex = FIX.examples.rao;
  const printed = Date.parse(ex.printedIst);
  const a = entry('Mercury', rasiOf('Aquarius'), printed, rasiOf('Gemini'));
  assert.ok(Math.abs(Date.parse(a.utc) - printed) < 15 * 60000, `Rao: within 15 minutes (${a.utc})`);
  assert.equal(a.moon.signTa, 'கும்பம்');
  assert.ok(Math.abs(a.moon.degree - (10 + 29 / 60)) < 0.2, `Rao: Moon ${a.moon.degree}`);
  assert.equal(a.moorthi, form(ex.natalAquarius));
  assert.equal(entry('Mercury', rasiOf('Pisces'), printed, rasiOf('Gemini')).moorthi, form(ex.natalPisces));
  assert.equal(a.close, false);

  // Gour: Saturn into Leo 07:12 on 1 Nov 2006, the Moon in Aquarius; natal Moon Gemini → Rajat.
  const g = FIX.examples.gour;
  const gp = Date.parse(g.printedIst);
  const ge = entry('Saturn', rasiOf(g.natal), gp, rasiOf(g.sign));
  assert.ok(Math.abs(Date.parse(ge.utc) - gp) < 5 * 60000, `Gour: within 5 minutes (${ge.utc})`);
  assert.equal(ge.moon.sign, rasiOf(g.moon));
  assert.equal(ge.moorthi, form(g.murti));
  assert.equal(ge.close, false);

  // Raj Kumar 2002: natal Moon Taurus; both entries iron.
  for (const k of ['rajKumarJupiter2002', 'rajKumarSaturn2002']) {
    const x = FIX.examples[k];
    const e = entry(x.planet, rasiOf(x.natal), Date.parse(`${x.printedDate}T12:00:00+05:30`), rasiOf(x.sign));
    assert.equal(new Date(Date.parse(e.utc) + 330 * 60000).toISOString().slice(0, 10), x.printedDate, `${k}: date`);
    assert.equal(e.moon.sign, rasiOf(x.moon), `${k}: Moon`);
    assert.equal(e.moorthi, form(x.moorthy), `${k}: form`);
    assert.equal(e.close, false, `${k}: not close`);
  }

  // Raj Kumar 1958 (Indira Gandhi, natal Moon Capricorn): the book has 9 Nov and the Moon in Virgo (Rajat).
  // Lahiri puts the entry on 7 Nov with the Moon at the end of Leo (iron) — close; the neighbour is the book's.
  const ik = FIX.examples.rajKumarIndira;
  const ie = entry('Saturn', rasiOf('Capricorn'), Date.parse(`${ik.printedDate}T12:00:00+05:30`), rasiOf(ik.sign));
  assert.equal(new Date(Date.parse(ie.utc) + 330 * 60000).toISOString().slice(0, 10), '1958-11-07');
  assert.equal(ie.moon.sign, rasiOf('Leo'));
  assert.equal(ie.moorthi, 'LOHA');
  assert.equal(ie.close, true);
  assert.equal(ie.neighbour.side, 'LATER');
  assert.equal(ie.neighbour.moonSign, rasiOf(ik.moon));
  assert.equal(ie.neighbour.moorthi, form(ik.moorthy));

  // Pulippani 1998: Jupiter into Kumbha; he has the Moon in Mesha at "9.1.1998 1.38 a.m.".
  // Lahiri: 8 Jan, 1.4 hours after the Moon entered Rishabha — close; the neighbour is the book's Mesha.
  const pe = entry('Jupiter', rasiOf('Aries'), Date.parse('1998-01-09T01:38+05:30'), 10);
  assert.equal(new Date(Date.parse(pe.utc) + 330 * 60000).toISOString().slice(0, 10), '1998-01-08');
  assert.equal(pe.moon.sign, rasiOf('Taurus'));
  assert.ok(pe.moon.enteredHoursBefore > 1 && pe.moon.enteredHoursBefore < 2, `entered ${pe.moon.enteredHoursBefore} h before`);
  assert.equal(pe.close, true);
  assert.equal(pe.neighbour.side, 'EARLIER');
  assert.equal(pe.neighbour.moonSign, rasiOf('Aries'));
  assert.equal(pe.neighbour.moorthi, 'SWARNA', 'Aries native: Swarna, as the book');
  const moonAtPrinted = planetLongitude(Date.parse('1998-01-09T01:38+05:30') / DAY + 2440587.5, 'Moon', 'Lahiri');
  assert.equal(Math.floor(moonAtPrinted / 30), rasiOf('Taurus'), 'at the moment he prints, the Moon is in Rishabha too');

  // Pulippani p.332 (Jupiter into Gemini) and Table 24 (Saturn into Taurus): the transit Moon matches.
  assert.equal(entry('Jupiter', 0, Date.UTC(2001, 5, 16), 2).moon.sign, rasiOf('Pisces'));
  assert.equal(entry('Saturn', 0, Date.UTC(2000, 5, 7), 1).moon.sign, rasiOf('Cancer'));
}

// ------------------------------------------------ the engine over a window ---
{
  const atMs = Date.UTC(2026, 9, 8);
  const t0 = Date.now();
  const r = moorthiNirnaya({ natalMoonLongitude: 280, atMs });
  const elapsed = Date.now() - t0;
  const moonRasi = 9;
  assert.equal(r.planets.Moon, undefined, 'the Moon has no form of its own');
  for (const p of Object.values(r.planets)) {
    assert.equal(p.entries.filter((e) => e.current).length, 1, `${p.planet}: one current stay`);
    assert.ok(p.now && p.nowAllRasis.length === 12);
    assert.equal(p.nowAllRasis[moonRasi].moorthi, p.now.moorthi, `${p.planet}: the twelve-rasi row for the native agrees`);
    for (const e of p.entries) {
      const ms = Date.parse(e.utc);
      const lon = (planet, t) => {
        const jd = t / DAY + 2440587.5;
        if (planet === 'Rahu' || planet === 'Ketu') return null;
        return planetLongitude(jd, planet, 'Lahiri');
      };
      const l1 = lon(p.planet, ms + 60000);
      const l0 = lon(p.planet, ms - 60000);
      if (l1 !== null) {
        assert.equal(Math.floor(l1 / 30), e.sign, `${p.planet} ${e.utc}: in the new sign a minute after`);
        assert.equal(Math.floor(l0 / 30), e.fromSign, `${p.planet} ${e.utc}: in the old sign a minute before`);
      }
      const m = planetLongitude(ms / DAY + 2440587.5, 'Moon', 'Lahiri');
      assert.equal(Math.floor(m / 30), e.moon.sign);
      assert.equal(e.moon.house, ((e.moon.sign - moonRasi + 12) % 12) + 1);
      assert.equal(e.moorthi, T.moorthiOfHouse(e.moon.house));
      assert.equal(e.close, e.marginArcmin < T.CLOSE_ARCMIN);
      if (e.close) assert.notEqual(e.neighbour.moorthi, undefined);
      assert.equal(e.pulippani.length, e.nature === 'UNDETERMINED' ? 2 : 1);
    }
  }
  assert.ok(elapsed < 2000, `fast enough (${elapsed} ms)`);
  console.log(`  engine: ${Object.values(r.planets).reduce((a, p) => a + p.entries.length, 0)} entries, ${Object.values(r.planets).reduce((a, p) => a + p.entries.filter((e) => e.close).length, 0)} close, in ${elapsed} ms`);
}

// ------------------------------------------------ order and citations ---
assert.deepEqual(plain(T.MOORTHI_RANK.words), FIX.wordCounts);
assert.deepEqual([...T.MOORTHI_RANK.order], Object.keys(FIX.wordCounts).sort((a, b) => FIX.wordCounts[b] - FIX.wordCounts[a]));
const cites = [];
const walk = (o) => { if (o && typeof o === 'object') { if (typeof o.pageLocus === 'string') cites.push(o); Object.values(o).forEach(walk); } };
walk(T);
assert.ok(cites.length >= 10);
for (const c of cites) assert.ok(resolveByTitle(c.title), `registered: ${c.title}`);
for (const [conv, forms] of Object.entries(T.COMBINATIONS)) {
  for (const [f, list] of Object.entries(forms)) {
    for (const s of list) assert.ok(T.MOORTHI_RANK.order.includes(s.book) && s.sources.length > 0, `${conv} ${f} ${s.book}`);
  }
}

console.log('test-moorthi: all checks passed');
