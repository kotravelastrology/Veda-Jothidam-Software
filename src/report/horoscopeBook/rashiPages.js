/**
 * Horoscope book, pages 48-49 (Jaimini Chara dasha), 57-58 (Narayana dasha) and 61 (Shoola dasha) of the PL9 sample aniruddha_HC4: the sign
 * dashas. Each page is twelve blocks, one for each sign period in order from birth, headed by the sign, its years and the age at which it begins;
 * under it the twelve sub-periods (the sign, and the date it begins). The periods are bphsRashiDashas.js's: Rath's reading of the Jaimini Upadesa
 * Sutras (chara and Narayana: the sign's years by counting to its lord's sign) and P.S. Sastri's Jaimini Sutram 2.3 (the Shoola dasha of nine
 * years a sign, here the Niryaana Shoola engine). The sub-periods are the twelve equal parts of a period in the order fiveLevel.js's subOrder takes
 * from Rath 2.4.31-34 (from the sign of the period's lord; forward or backward by the sign and by Saturn and Ketu's place).
 *
 * Differences from the sample, recorded and not hidden: for the chara dasha PL9's years for Libra, Sagittarius and Pisces differ from the
 * Rath count by a year; the sub-periods start from the period's own sign in the sample, from its lord's sign here. The Narayana periods (signs
 * and years) match the sample's. Dates are in the birth place's time on the settings' dasha year (a year counted as 360 days is what the sample uses).
 * Each builder returns a Promise of { title, subtitle, blocks }.
 */
const { withBirth } = require('./charts');
const RS = require('../../dasha/bphsRashiDashas');
const FL = require('../../dasha/fiveLevel');

const MONTH_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const SIGN = ['Ari', 'Tau', 'Gem', 'Can', 'Leo', 'Vir', 'Lib', 'Sco', 'Sag', 'Cap', 'Aqu', 'Pis'];
const SIGN_FULL = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const pad = (n) => String(n).padStart(2, '0');

const TITLES = {
  'jaimini-chara': { page: 'Jaimini Chara Dasha', note: 'Rath\'s reading of the Jaimini Upadesa Sutras (counting from a sign to its lord\'s sign). PL9\'s years differ by a year for Libra, Sagittarius and Pisces; the sub-periods here start from the lord\'s sign (Rath 2.4.31-34), PL9\'s from the period\'s own sign.' },
  narayana: { page: 'Narayana Dasha', note: 'Rath, Jaimini Upadesa Sutras: the signs and years agree with the sample; the sub-periods start from the lord\'s sign (Rath 2.4.31-34), the sample\'s from the period\'s own sign.' },
  'niryaana-shoola': { page: 'Shoola Dasha', note: 'Nine years a sign from the stronger of the Lagna and the seventh (P.S. Sastri, Jaimini Sutram 2.3.5-12 and 2.3.18). PL9 prints this reckoning as "Shoola Dasha"; its own "Niryaana Shoola" pages differ.' },
};

function dmyOf(ms, offsetMinutes) {
  const d = new Date(ms + offsetMinutes * 60000);
  return `${pad(d.getUTCDate())}-${pad(d.getUTCMonth() + 1)}-${d.getUTCFullYear()}`;
}
function ageOf(fromMs, toMs, offsetMinutes) {
  const a = new Date(fromMs + offsetMinutes * 60000); const b = new Date(toMs + offsetMinutes * 60000);
  let months = (b.getUTCFullYear() - a.getUTCFullYear()) * 12 + (b.getUTCMonth() - a.getUTCMonth()) - (b.getUTCDate() < a.getUTCDate() ? 1 : 0);
  if (months < 0) months = 0;
  return `${Math.floor(months / 12)}y${months % 12}m`;
}

/** The sign dasha `system`, its cycle number `cycle` (0 or 1): twelve sign periods with their twelve sub-periods. */
async function buildRashiDasha({ name = '', birth, dashaOptions, system, cycle }) {
  const yearDays = dashaOptions?.yearDays ?? 365.25;
  return withBirth(birth, ({ chart }) => {
    const off = birth.utcOffsetMinutes ?? 0;
    const signs = Object.fromEntries(PLANETS.map((p) => [p, chart.grahas[p].rasiIndex]));
    const degrees = Object.fromEntries(PLANETS.map((p) => [p, chart.grahas[p].longitude % 30]));
    const lagnaSign = Math.floor(chart.lagna.longitude / 30);
    const facts = { signs, degrees, lagnaSign, lagnaLongitude: chart.lagna.longitude, moonFraction: (chart.grahas.Moon.longitude % (360 / 27)) / (360 / 27) };
    const birthMs = (chart.julianDay - 2440587.5) * 86400000;
    const result = RS.SYSTEMS[system](facts);
    const all = RS.schedule(result, birthMs, 2);
    const at = (ms) => birthMs + (ms - birthMs) * (yearDays / 365.25);
    const perCycle = result.periods.length;
    const slice = all.slice(cycle * perCycle, cycle * perCycle + perCycle);
    const blocks = slice.map((p) => {
      const start = at(p.startMs); const end = at(p.endMs);
      const { order } = FL.subOrder(p.sign, facts);
      const part = (end - start) / 12;
      return {
        kind: 'table', tile: true,
        heading: `${SIGN_FULL[p.sign]} (${Number(p.years.toFixed(2))}y)`,
        aside: cycle === 0 && p === slice[0] ? `${ageOf(birthMs, start, off)}*` : ageOf(birthMs, start, off),
        columns: ['Antar', 'Beginning'],
        rows: [['Beginning', dmyOf(start, off)], ['Ending', dmyOf(end, off)], ...order.map((s, i) => [`${s + 1} ${SIGN[s]}`, dmyOf(start + i * part, off)])],
      };
    });
    const t = TITLES[system];
    return {
      title: `ஜாதகம் — ${name}`.trim(),
      subtitle: `${birth.placeName} · ${birth.day} ${MONTH_EN[birth.month - 1]} ${birth.year}`,
      blocks: [
        { kind: 'text', heading: t.page, text: `The dates are given for dasha beginning dates. The running age is given for the beginning of the dasha. ${t.note}` },
        ...blocks,
      ],
    };
  });
}

module.exports = { buildRashiDasha };
