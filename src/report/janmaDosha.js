/**
 * The inauspicious births of BPHS ch.85-96 (Santhanam, vol.2, printed pp.1009-1039; fixture fixtures/janma-dosha/bphs-85-96.json): the births the book calls
 * inauspicious although the Lagna and the planets are well placed, with the effect and the remedy it gives for each.
 *
 * Read from the chart: birth on Amavasya (ch.86), in the dark Chaturdashi with the sixth of it reached (ch.87), in the Vishti karana (Bhadra), in Vyatipata,
 * Parigha or Vajra (ch.88), in a Tithi, Nakshatra or Lagna Gandanta (ch.92), in Abhukta Moola (ch.93) and the nakshatra-and-quarter rules for marriage (ch.94).
 * A ghatika is 24 minutes of time, so the "last 2 ghatikas" of a tithi or nakshatra are the last 48 minutes of it and the Lagna's "half ghatika" is 12 minutes;
 * the Lagna Gandanta is read from the rising sign twelve minutes after and before the birth. What the chart cannot say (eclipse, Sankranti, the order of the
 * children, the delivery) is listed and not checked. No verdict is given and the remedies are the book's rites, summarised.
 */
const { withBirth } = require('./horoscopeBook/charts');
const { findLimbWindow, tithiIndexAt, nakshatraIndexAt, yogaIndexAt, karanaSerialAt, karanaName } = require('../panchangam/tirukanitaPanchangam');
const N = require('../sources/tamilNames');

const DATA = require('../../fixtures/janma-dosha/bphs-85-96.json');

const GHATIKA = 1 / 60; // a day is 60 ghatikas
const NAKSHATRA = { Ashwini: 0, Ashlesha: 8, Magha: 9, Vishakha: 15, Jyeshtha: 17, Moola: 18, Revati: 26 };
const YOGA = { Vajra: 14, Vyatipata: 16, Parigha: 18 };
const END_SIGNS = Object.freeze([3, 7, 11]); // Cancer, Scorpio, Pisces: the last half ghatika is the Gandanta
const START_SIGNS = Object.freeze([0, 4, 8]); // Aries, Leo, Sagittarius: the first half ghatika

const ghatis = (days) => Math.round(days / GHATIKA * 10) / 10;
const byId = Object.freeze(Object.fromEntries(DATA.conditions.map((c) => [c.id, c])));

/** The birth `minutes` later (negative: earlier), in the same local time. */
function shiftBirth(birth, minutes) {
  const t = new Date(Date.UTC(birth.year, birth.month - 1, birth.day, birth.hour, birth.minute ?? 0, birth.second ?? 0) + minutes * 60000);
  return { ...birth, year: t.getUTCFullYear(), month: t.getUTCMonth() + 1, day: t.getUTCDate(), hour: t.getUTCHours(), minute: t.getUTCMinutes(), second: t.getUTCSeconds() };
}

/** The facts of a birth that the conditions read: the limb windows around the birth and the rising sign twelve minutes either side. */
async function janmaFacts(birth) {
  const base = await withBirth(birth, ({ chart }) => {
    const jd = chart.julianDay;
    const ay = chart.ayanamsha;
    const nak = findLimbWindow(nakshatraIndexAt, jd, ay);
    const moon = chart.grahas.Moon.longitude;
    return {
      jd,
      tithi: findLimbWindow(tithiIndexAt, jd, ay),
      nak: { ...nak, pada: Math.floor((((moon % 360) + 360) % 360 % (360 / 27)) / (360 / 108)) + 1 },
      yogaIndex: findLimbWindow(yogaIndexAt, jd, ay).index,
      karanaSerial: findLimbWindow(karanaSerialAt, jd, ay).index,
      lagnaSign: chart.lagna.rasiIndex,
      gender: birth.gender === 'female' || birth.gender === 'male' ? birth.gender : null,
    };
  });
  const after = await withBirth(shiftBirth(birth, 12), ({ chart }) => chart.lagna.rasiIndex);
  const before = await withBirth(shiftBirth(birth, -12), ({ chart }) => chart.lagna.rasiIndex);
  return { ...base, lagnaEndsWithin12: after !== base.lagnaSign, lagnaStartedWithin12: before !== base.lagnaSign };
}

/**
 * Each condition read against `facts`: { id, status: 'held' | 'not-held' | 'unknown', detail, part? } in the fixture's order.
 * The detail is a Tamil sentence of the figures that decided it.
 */
function evaluate(f) {
  const out = [];
  const put = (id, status, detail, extra = {}) => out.push({ id, status, detail, ...extra });
  const tithiNo = (f.tithi.index % 15) + 1;
  const t = N.tithiTa(f.tithi.index);
  const inTithi = `${t.paksha} ${t.name}`;
  const toEnd = (w) => (w.endJulianDay - f.jd);
  const fromStart = (w) => (f.jd - w.startJulianDay);

  put('AMAVASYA', f.tithi.index === 29 ? 'held' : 'not-held', f.tithi.index === 29 ? 'அமாவாசையில் பிறப்பு.' : `திதி: ${inTithi}.`);

  if (f.tithi.index === 28) {
    const frac = fromStart(f.tithi) / (f.tithi.endJulianDay - f.tithi.startJulianDay);
    const part = Math.min(6, Math.floor(frac * 6) + 1);
    put('K_CHATURDASHI', 'held', `தேய்பிறை சதுர்த்தசியின் ${part}-ஆம் பகுதி (திதியின் ${Math.round(frac * 100)}% கடந்தது).`, { part });
  } else {
    put('K_CHATURDASHI', 'not-held', `திதி: ${inTithi}.`);
  }

  const karana = karanaName(f.karanaSerial);
  put('BHADRA', karana === 'Vishti' ? 'held' : 'not-held', `கரணம்: ${N.KARANA_TA[karana] ?? karana}.`);

  const yogaHeld = Object.values(YOGA).includes(f.yogaIndex);
  put('YOGA', yogaHeld ? 'held' : 'not-held', `யோகம்: ${N.YOGA_TA[f.yogaIndex]}.`);

  const poornaEnd = [5, 10, 15].includes(tithiNo) && toEnd(f.tithi) <= 2 * GHATIKA;
  const nandaStart = [1, 6, 11].includes(tithiNo) && fromStart(f.tithi) <= 2 * GHATIKA;
  if (poornaEnd) put('TITHI_GANDANTA', 'held', `${inTithi}: திதி முடிய ${ghatis(toEnd(f.tithi))} நாழிகை (கடைசி 2-க்குள்).`, { part: 1 });
  else if (nandaStart) put('TITHI_GANDANTA', 'held', `${inTithi}: திதி தொடங்கி ${ghatis(fromStart(f.tithi))} நாழிகை (முதல் 2-க்குள்).`, { part: 2 });
  else put('TITHI_GANDANTA', 'not-held', `${inTithi}: தொடக்கத்திலிருந்து ${ghatis(fromStart(f.tithi))}, முடிவுக்கு ${ghatis(toEnd(f.tithi))} நாழிகை.`);

  const nakName = N.NAKSHATRA_TA[f.nak.index];
  const nakEnd = [NAKSHATRA.Revati, NAKSHATRA.Ashlesha, NAKSHATRA.Jyeshtha].includes(f.nak.index) && toEnd(f.nak) <= 2 * GHATIKA;
  const nakStart = [NAKSHATRA.Ashwini, NAKSHATRA.Magha, NAKSHATRA.Moola].includes(f.nak.index) && fromStart(f.nak) <= 2 * GHATIKA;
  if (nakEnd) put('NAK_GANDANTA', 'held', `${nakName}: நட்சத்திரம் முடிய ${ghatis(toEnd(f.nak))} நாழிகை (கடைசி 2-க்குள்).`, { part: 1 });
  else if (nakStart) put('NAK_GANDANTA', 'held', `${nakName}: நட்சத்திரம் தொடங்கி ${ghatis(fromStart(f.nak))} நாழிகை (முதல் 2-க்குள்).`, { part: 2 });
  else put('NAK_GANDANTA', 'not-held', `${nakName}: தொடக்கத்திலிருந்து ${ghatis(fromStart(f.nak))}, முடிவுக்கு ${ghatis(toEnd(f.nak))} நாழிகை.`);

  const lagnaTa = N.RASI_TA[f.lagnaSign];
  if (END_SIGNS.includes(f.lagnaSign) && f.lagnaEndsWithin12) put('LAGNA_GANDANTA', 'held', `${lagnaTa} லக்னத்தின் கடைசி அரை நாழிகைக்குள் (12 நிமிடத்துக்குள்) பிறப்பு.`, { part: 1 });
  else if (START_SIGNS.includes(f.lagnaSign) && f.lagnaStartedWithin12) put('LAGNA_GANDANTA', 'held', `${lagnaTa} லக்னம் தொடங்கி அரை நாழிகைக்குள் (12 நிமிடத்துக்குள்) பிறப்பு.`, { part: 2 });
  else put('LAGNA_GANDANTA', 'not-held', `லக்னம்: ${lagnaTa}.`);

  const abhuktaEnd = f.nak.index === NAKSHATRA.Jyeshtha && toEnd(f.nak) <= 5 * GHATIKA;
  const abhuktaStart = f.nak.index === NAKSHATRA.Moola && fromStart(f.nak) <= 8 * GHATIKA;
  if (abhuktaEnd) put('ABHUKTA_MOOLA', 'held', `கேட்டை முடிய ${ghatis(toEnd(f.nak))} நாழிகை (கடைசி 5-க்குள்).`);
  else if (abhuktaStart) put('ABHUKTA_MOOLA', 'held', `மூலம் தொடங்கி ${ghatis(fromStart(f.nak))} நாழிகை (முதல் 8-க்குள்).`);
  else put('ABHUKTA_MOOLA', 'not-held', `${nakName}.`);

  // ch.94 v.10-13: a girl in Jyeshtha or the 4th quarter of Vishakha; a boy or girl in the 2nd-4th of Ashlesha or the 1st-3rd of Moola
  const girlOnly = f.nak.index === NAKSHATRA.Jyeshtha || (f.nak.index === NAKSHATRA.Vishakha && f.nak.pada === 4);
  const either = (f.nak.index === NAKSHATRA.Ashlesha && f.nak.pada >= 2) || (f.nak.index === NAKSHATRA.Moola && f.nak.pada <= 3);
  const place = `${nakName} ${f.nak.pada}-ஆம் பாதம்`;
  if (either) put('MARRIAGE_STARS', 'held', `${place}.`);
  else if (girlOnly && f.gender === 'female') put('MARRIAGE_STARS', 'held', `${place}, பெண்.`);
  else if (girlOnly && f.gender === null) put('MARRIAGE_STARS', 'unknown', `${place}; இந்த விதி பெண்ணுக்கு மட்டும், பாலினம் குறிப்பில் இல்லை.`);
  else put('MARRIAGE_STARS', 'not-held', `${place}${girlOnly ? ', ஆண்' : ''}.`);
  return out;
}

module.exports = { DATA, byId, evaluate, janmaFacts, shiftBirth, GHATIKA };
