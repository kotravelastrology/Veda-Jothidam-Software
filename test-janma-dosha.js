/**
 * The inauspicious births of BPHS ch.85-96 (src/report/janmaDosha.js, fixture bphs-85-96.json): the fixture's shape, each condition on facts worked by hand,
 * and the facts of real births.
 */
const assert = require('node:assert/strict');
const J = require('./src/report/janmaDosha');

const IDS = ['AMAVASYA', 'K_CHATURDASHI', 'BHADRA', 'YOGA', 'TITHI_GANDANTA', 'NAK_GANDANTA', 'LAGNA_GANDANTA', 'ABHUKTA_MOOLA', 'MARRIAGE_STARS'];
const GH = J.GHATIKA;

// the fixture: nine conditions in order, each with an effect and a remedy, pages inside the chapters' range; six not checked, each with its reason
assert.ok(J.DATA.source.title && J.DATA.source.pageLocus && J.DATA.scope && J.DATA.list.ta);
assert.deepEqual(J.DATA.conditions.map((c) => c.id), IDS);
const pageOk = (x) => { const [a, b] = String(x.page).split('-').map(Number); return a >= 1009 && (b ?? a) <= 1039 && a <= (b ?? a) && x.ch >= 85 && x.ch <= 96 && x.verses && x.ta.length > 10; };
for (const c of J.DATA.conditions) {
  assert.ok(pageOk(c.effect) && c.remedy && pageOk(c.remedy), c.id);
  if (c.define) assert.ok(pageOk(c.define), `${c.id}: definition`);
}
assert.equal(J.byId.K_CHATURDASHI.parts.length, 6);
assert.equal(J.DATA.unchecked.length, 6);
for (const u of J.DATA.unchecked) assert.ok(pageOk(u.effect) && u.reason.length > 10 && (u.remedy === null || pageOk(u.remedy)), u.id);
assert.ok(/5 மற்றும் 8/.test(J.byId.ABHUKTA_MOOLA.define.ta), 'the Sanskrit reads 5 and 8, not the English print\'s 6');

// facts worked by hand (day numbers are Julian days; a ghatika is 1/60 of a day)
const base = () => ({
  jd: 100,
  tithi: { index: 8, startJulianDay: 99.5, endJulianDay: 100.5 },
  nak: { index: 3, startJulianDay: 99.5, endJulianDay: 100.5, pada: 2 },
  yogaIndex: 3, karanaSerial: 2, lagnaSign: 1, lagnaEndsWithin12: false, lagnaStartedWithin12: false, gender: 'male',
});
const run = (over) => Object.fromEntries(J.evaluate({ ...base(), ...over }).map((r) => [r.id, r]));
const status = (r) => Object.fromEntries(Object.entries(r).map(([k, v]) => [k, v.status]));

assert.deepEqual(J.evaluate(base()).map((r) => r.id), IDS);
assert.ok(Object.values(status(run({}))).every((s) => s === 'not-held'), 'an ordinary birth holds none');

assert.equal(run({ tithi: { index: 29, startJulianDay: 99.2, endJulianDay: 100.3 } }).AMAVASYA.status, 'held');
// Chaturdashi in six parts
const ch = (jd) => run({ jd, tithi: { index: 28, startJulianDay: 99, endJulianDay: 100 } }).K_CHATURDASHI;
assert.deepEqual([99.1, 99.2, 99.4, 99.55, 99.7, 99.99].map((jd) => ch(jd).part), [1, 2, 3, 4, 5, 6]);
assert.equal(run({ tithi: { index: 13, startJulianDay: 99.5, endJulianDay: 100.5 } }).K_CHATURDASHI.status, 'not-held', 'the bright Chaturdashi is not named');
// Vishti is karana serial 7, 14, ...; Vyatipata, Parigha and Vajra are yoga 16, 18 and 14
assert.equal(run({ karanaSerial: 7 }).BHADRA.status, 'held');
assert.equal(run({ karanaSerial: 14 }).BHADRA.status, 'held');
assert.equal(run({ karanaSerial: 6 }).BHADRA.status, 'not-held');
assert.deepEqual([14, 16, 18, 15].map((i) => run({ yogaIndex: i }).YOGA.status), ['held', 'held', 'held', 'not-held']);

// Tithi Gandanta: the last 2 ghatikas of Panchami, Dashami, Purnima, Amavasya (either paksha) and the first 2 of Pratipada, Shashthi, Ekadashi
const tg = (index, fromStart, toEnd) => run({ tithi: { index, startJulianDay: 100 - fromStart, endJulianDay: 100 + toEnd } }).TITHI_GANDANTA;
assert.equal(tg(4, 20 * GH, 1.5 * GH).status, 'held');
assert.equal(tg(4, 20 * GH, 2.5 * GH).status, 'not-held');
assert.equal(tg(9, 20 * GH, 1 * GH).status, 'held');
assert.equal(tg(14, 20 * GH, 1 * GH).status, 'held', 'Purnima');
assert.equal(tg(29, 20 * GH, 1 * GH).status, 'held', 'Amavasya is the fifteenth of the dark half');
assert.equal(tg(19, 20 * GH, 1 * GH).status, 'held', 'the dark Panchami');
assert.equal(tg(0, 1 * GH, 30 * GH).status, 'held');
assert.equal(tg(5, 1.9 * GH, 30 * GH).status, 'held');
assert.equal(tg(10, 3 * GH, 30 * GH).status, 'not-held');
assert.equal(tg(2, 0.5 * GH, 30 * GH).status, 'not-held', 'Tritiya is neither');
assert.equal(tg(4, 0.5 * GH, 30 * GH).status, 'not-held', 'the start of Panchami is not a Gandanta');
assert.equal(tg(4, 20 * GH, 1.5 * GH).part, 1);
assert.equal(tg(0, 1 * GH, 30 * GH).part, 2);

// Nakshatra Gandanta: the last 2 ghatikas of Revati, Ashlesha, Jyeshtha; the first 2 of Ashwini, Magha, Moola
const ng = (index, fromStart, toEnd) => run({ nak: { index, startJulianDay: 100 - fromStart, endJulianDay: 100 + toEnd, pada: 1 } }).NAK_GANDANTA;
assert.deepEqual([26, 8, 17].map((i) => ng(i, 20 * GH, 1.5 * GH).status), ['held', 'held', 'held']);
assert.deepEqual([0, 9, 18].map((i) => ng(i, 1.5 * GH, 30 * GH).status), ['held', 'held', 'held']);
assert.equal(ng(26, 1 * GH, 30 * GH).status, 'not-held', 'the start of Revati');
assert.equal(ng(0, 20 * GH, 1 * GH).status, 'not-held', 'the end of Ashwini');
assert.equal(ng(17, 20 * GH, 2.5 * GH).status, 'not-held');
assert.equal(ng(5, 1 * GH, 1 * GH).status, 'not-held');

// Abhukta Moola: the last 5 ghatikas of Jyeshtha and the first 8 of Moola
const am = (index, fromStart, toEnd) => run({ nak: { index, startJulianDay: 100 - fromStart, endJulianDay: 100 + toEnd, pada: 1 } });
assert.equal(am(17, 20 * GH, 4.5 * GH).ABHUKTA_MOOLA.status, 'held');
assert.equal(am(17, 20 * GH, 5.5 * GH).ABHUKTA_MOOLA.status, 'not-held');
assert.equal(am(18, 7.5 * GH, 30 * GH).ABHUKTA_MOOLA.status, 'held');
assert.equal(am(18, 8.5 * GH, 30 * GH).ABHUKTA_MOOLA.status, 'not-held');
assert.equal(am(18, 7.5 * GH, 30 * GH).NAK_GANDANTA.status, 'not-held', 'seven ghatikas into Moola is Abhukta, not the 2-ghatika Gandanta');

// Lagna Gandanta: the end of Cancer, Scorpio, Pisces; the start of Aries, Leo, Sagittarius
const lg = (sign, ends, starts) => run({ lagnaSign: sign, lagnaEndsWithin12: ends, lagnaStartedWithin12: starts }).LAGNA_GANDANTA.status;
assert.deepEqual([3, 7, 11].map((s) => lg(s, true, false)), ['held', 'held', 'held']);
assert.deepEqual([0, 4, 8].map((s) => lg(s, false, true)), ['held', 'held', 'held']);
assert.equal(lg(3, false, true), 'not-held', 'the start of Cancer is not a Gandanta');
assert.equal(lg(0, true, false), 'not-held', 'the end of Aries is not a Gandanta');
assert.equal(lg(1, true, true), 'not-held');

// ch.94: a girl in Jyeshtha or the 4th quarter of Vishakha; a boy or girl in the 2nd-4th of Ashlesha, the 1st-3rd of Moola
const ms = (index, pada, gender) => run({ nak: { index, startJulianDay: 99, endJulianDay: 101, pada }, gender }).MARRIAGE_STARS.status;
assert.deepEqual([ms(17, 1, 'female'), ms(17, 1, 'male'), ms(17, 1, null)], ['held', 'not-held', 'unknown']);
assert.deepEqual([ms(15, 4, 'female'), ms(15, 3, 'female'), ms(15, 4, 'male')], ['held', 'not-held', 'not-held']);
assert.deepEqual([ms(8, 1, 'male'), ms(8, 2, 'male'), ms(8, 4, null)], ['not-held', 'held', 'held']);
assert.deepEqual([ms(18, 3, 'female'), ms(18, 4, 'female'), ms(18, 1, null)], ['held', 'not-held', 'held']);

// the birth shifted by minutes, across midnight and a leap day
const b = { year: 2024, month: 3, day: 1, hour: 0, minute: 5, second: 0, placeName: 'x' };
const back = J.shiftBirth(b, -12);
assert.deepEqual([back.year, back.month, back.day, back.hour, back.minute], [2024, 2, 29, 23, 53]);
assert.deepEqual([J.shiftBirth(b, 12).hour, J.shiftBirth(b, 12).minute], [0, 17]);

// the facts of real births (Chennai, IST): 4 March 2024 18:20 is a Moola birth about five ghatikas in, 9 March 2024 18:20 an Amavasya, 4 March 2024 01:10 Scorpio's last half ghatika
const mk = (day, hour, minute) => ({ year: 2024, month: 3, day, hour, minute, ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330, latitude: 13 + 5 / 60, longitude: 80 + 17 / 60, placeName: 'Chennai' });
(async () => {
  const f = await J.janmaFacts(mk(4, 18, 20));
  for (const w of [f.tithi, f.nak]) assert.ok(w.startJulianDay <= f.jd && f.jd < w.endJulianDay);
  assert.equal(f.nak.index, 18);
  assert.ok(f.nak.pada >= 1 && f.nak.pada <= 4 && (f.jd - f.nak.startJulianDay) / GH < 8);
  const r = Object.fromEntries(J.evaluate(f).map((x) => [x.id, x]));
  assert.equal(r.ABHUKTA_MOOLA.status, 'held');
  assert.equal(r.NAK_GANDANTA.status, 'not-held');
  assert.equal(r.MARRIAGE_STARS.status, 'held');
  assert.ok(Object.values(r).every((x) => x.detail.length > 3 && !/undefined|NaN/.test(x.detail)));
  const amavasya = Object.fromEntries(J.evaluate(await J.janmaFacts(mk(9, 18, 20))).map((x) => [x.id, x]));
  assert.equal(amavasya.AMAVASYA.status, 'held');
  assert.equal(amavasya.K_CHATURDASHI.status, 'not-held');
  const lag = Object.fromEntries(J.evaluate(await J.janmaFacts(mk(4, 1, 10))).map((x) => [x.id, x]));
  assert.equal(lag.LAGNA_GANDANTA.status, 'held');
  console.log('test-janma-dosha: all assertions passed');
})().catch((e) => { console.error(e); process.exit(1); });
