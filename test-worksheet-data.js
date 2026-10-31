const assert = require('assert');
const { buildReportData } = require('./src/report/reportData');
const W = require('./src/worksheet/worksheetData');

// The PL9 sample chart: 5 October 1990, 04:30 IST, Chennai. Every expected value below is read from the screenshot of the
// PL9 9.0 worksheet "1. Birth chart I" (2026-10-31): the planet table, the strength table and the Vimshottari panel.
const input = {
  name: 'aniruddha', gender: 'male', year: 1990, month: 10, day: 5, hour: 4, minute: 30,
  ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330, latitude: 13 + 5 / 60, longitude: 80 + 17 / 60, placeName: 'Chennai',
};
const report = buildReportData(input);

// --- helpers
assert.strictEqual(W.dmsText(25.0541), '25:03:15');
assert.strictEqual(W.dmsText(0), '00:00:00');
assert.strictEqual(W.dmsText(29.99999), '29:59:59', 'rounding never reaches 30:00:00');
assert.strictEqual(W.nakshatraAbbr(0), 'Ash');
assert.strictEqual(W.nakshatraAbbr(359.9), 'Rev');
assert.strictEqual(W.nakshatraAbbr(285), 'Shr', 'Shravana, as PL9 prints it');
assert.strictEqual(W.nakshatraAbbr(300), 'Dha');
assert.deepStrictEqual(W.periodDateText('2026-08-19 15:36'), { date: '19-08-2026', weekday: 'Wed' });

// --- the planet table: pada and star/sub/sub-sub lords, nakshatra and degrees, as PL9 prints them
const PL9_PLANETS = {
  As: ['25:03:02', 'PPh', '4,Ve/Me/Ma'], Su: ['17:43:34', 'Has', '3,Mo/Sa/Ju'], Mo: ['23:56:35', 'Rev', '3,Me/Ma/Ve'],
  Ma: ['19:05:25', 'Roh', '3,Mo/Me/Ra'], Me: ['04:55:20', 'UPh', '3,Su/Sa/Ju'], Ju: ['15:11:21', 'Pus', '4,Sa/Ju/Sa'],
  Ve: ['10:34:14', 'Has', '1,Mo/Mo/Sa'], Sa: ['25:05:12', 'PSh', '4,Ve/Me/Ra'], Ra: ['10:03:38', 'Shr', '1,Mo/Mo/Mo'],
  Ke: ['10:03:38', 'Pus', '3,Sa/Ve/Me'],
};
const planets = W.planetRows(report.chart);
const order = ['As', 'Su', 'Mo', 'Ma', 'Me', 'Ju', 'Ve', 'Sa', 'Ra', 'Ke'];
assert.deepStrictEqual(planets.map((p) => p.abbr), order);
const seconds = (text) => text.split(':').reduce((acc, n) => acc * 60 + Number(n), 0);
for (const p of planets) {
  const [degrees, nak, lords] = PL9_PLANETS[p.abbr];
  assert.strictEqual(p.nakshatraAbbr, nak, `${p.abbr} nakshatra`);
  assert.strictEqual(p.lordsText, lords, `${p.abbr} pada and lords`);
  // Degrees: the same to the second for the planets; the ascendant and the nodes are 12-13 seconds off PL9's.
  const gap = Math.abs(seconds(p.degreeText) - seconds(degrees));
  const limit = ['As', 'Ra', 'Ke'].includes(p.abbr) ? 15 : 1;
  assert.ok(gap <= limit, `${p.abbr}: ${p.degreeText} against PL9's ${degrees}`);
}

// --- Gulika, drawn in the charts (PL9: "Gk 03:02 Mag"). Ours is at 02:36 in the same nakshatra; the 26 minutes of arc are the
// Gulika method (the book's gap register lists it).
const gulika = W.gulikaRow(report.upagraha);
assert.strictEqual(gulika.abbr, 'Gk');
assert.strictEqual(gulika.rasiIndex, 4, 'Leo, as in PL9');
assert.strictEqual(gulika.nakshatraAbbr, 'Mag');
assert.strictEqual(gulika.degreeText.slice(0, 2), '02');
assert.strictEqual(W.gulikaRow({}), null);

// --- the Navamsha PL9 draws: Ra with Ve and Gk in Aries, Su with Ma in Gemini, Mo with Me in Aquarius, Ke in Libra, and As with Sa
// and Ju in Scorpio. The report's varga data has the seven planets; the page adds the nodes and Gulika the same way.
const { calculateVargas } = require('./src/chart/vargaChart');
const d9 = (g) => calculateVargas(g.rasiIndex, g.degreeInSign).D9.signIndex;
assert.strictEqual(d9(report.chart.grahas.Rahu), 0, 'Ra in Aries');
assert.strictEqual(d9(report.chart.grahas.Ketu), 6, 'Ke in Libra');
assert.strictEqual(d9(gulika), 0, 'Gk in Aries');
assert.strictEqual(report.vargas.Venus.D9.signIndex, 0, 'Ve in Aries');
assert.strictEqual(report.vargas.Sun.D9.signIndex, 2);
assert.strictEqual(report.vargas.Mars.D9.signIndex, 2);
assert.strictEqual(report.vargas.Moon.D9.signIndex, 10);
assert.strictEqual(report.vargas.Mercury.D9.signIndex, 10);
assert.strictEqual(report.vargas.Lagna.D9.signIndex, 7);
assert.strictEqual(report.vargas.Saturn.D9.signIndex, 7);
assert.strictEqual(report.vargas.Jupiter.D9.signIndex, 7);

// --- the strength table: dignity, Vimshopaka (Shadvarga, rounded), own-sign Ashtakavarga, avasthas
const strength = W.strengthRows(report);
assert.deepStrictEqual(strength.map((s) => s.abbr), ['Su', 'Mo', 'Ma', 'Me', 'Ju', 'Ve', 'Sa']);
assert.deepStrictEqual(strength.map((s) => s.dignity), ['enemy', 'enemy', 'enemy', 'exalted', 'exalted', 'debilitated', 'enemy']);
assert.deepStrictEqual(strength.map((s) => Math.round(s.vimshopaka)), [10, 11, 8, 16, 15, 11, 9], 'PL9 VB column');
assert.deepStrictEqual(strength.map((s) => s.ownSignBindus), [2, 5, 4, 4, 5, 4, 2], 'PL9 AV column');
// Jagradadi (Av3: Drm = Svapna, Alr = Jagrat, Slp = Sushupti) and Baladi (Av5: Adoles = Yuva, Youth = Kumara, Old = Vriddha, Dead = Mrita)
assert.deepStrictEqual(strength.map((s) => s.jagradadi), ['ஸ்வப்ன', 'ஸ்வப்ன', 'ஸ்வப்ன', 'ஜாக்ரத்', 'ஜாக்ரத்', 'சுஷுப்தி', 'ஸ்வப்ன']);
assert.deepStrictEqual(strength.map((s) => s.baladi), ['யுவ', 'குமார', 'குமார', 'ம்ருத', 'யுவ', 'வ்ருத்த', 'ம்ருத']);
// Shad Bala as a share of the BPHS minimum: the page 11 figures (PL9's worksheet shows other numbers, see worksheetData.js).
assert.deepStrictEqual(strength.map((s) => s.shadbalaRatio.toFixed(2)), ['0.55', '1.03', '1.53', '1.02', '1.20', '1.09', '1.16']);

// --- the houses: the Sarvashtakavarga points PL9 prints on the chart's edge, 1st to 12th
assert.deepStrictEqual(W.houseRows(report).map((h) => h.sav), [27, 21, 25, 26, 24, 33, 29, 24, 25, 37, 34, 32]);
assert.strictEqual(W.houseRows(report).reduce((sum, h) => sum + h.sav, 0), 337, 'the points of the twelve houses total 337');
assert.deepStrictEqual(W.houseRows(report).map((h) => h.rasiIndex).slice(0, 3), [4, 5, 6], 'Leo, Virgo, Libra');

// --- the dasha list: from the running period on 31 October 2026, as the PL9 panel starts
const periods = W.flattenDasha(report.dasha);
assert.strictEqual(periods.length, 81, 'nine mahadashas of nine antardashas');
const current = W.dashaWindow(periods, '2026-10-31', 0, 0).current;
const win = W.dashaWindow(periods, '2026-10-31', current, 10);
assert.strictEqual(win.rows[0].isCurrent, true);
assert.deepStrictEqual(win.rows.slice(0, 4).map((r) => `${r.mdAbbr}-${r.adAbbr} ${r.weekday} ${r.date}`), [
  'Su-Ra Wed 19-08-2026', 'Su-Ju Wed 14-07-2027', 'Su-Sa Mon 01-05-2028', 'Su-Me Fri 13-04-2029',
]);
// PL9 lists Su-Ke on 17-02-2030 and Mo-Mo on 25-06-2031; both begin a few hours into the next day here (see test-dasha-calendar.js).
assert.deepStrictEqual(win.rows.slice(4, 10).map((r) => `${r.mdAbbr}-${r.adAbbr} ${r.date}`), [
  'Su-Ke 18-02-2030', 'Su-Ve 25-06-2030', 'Mo-Mo 26-06-2031', 'Mo-Ma 25-04-2032', 'Mo-Ra 24-11-2032', 'Mo-Ju 26-05-2034',
]);
// The window follows the date: a day before Su-Ra the previous period is the running one.
assert.strictEqual(W.dashaWindow(periods, '2026-08-18', 0, 1).current, current - 1);
assert.strictEqual(W.dashaWindow(periods, '2026-08-19', 0, 1).current, current);
// The window never runs past either end.
assert.strictEqual(W.dashaWindow(periods, '2026-10-31', 500, 5).rows.length, 1);
assert.strictEqual(W.dashaWindow(periods, '2026-10-31', -3, 3).rows[0].index, 0);

console.log('test-worksheet-data: all assertions passed');
