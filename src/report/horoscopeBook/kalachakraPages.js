/**
 * Horoscope book, pages 41-46 (PL9 sample aniruddha_HC4): the Kala Chakra dasha.
 *
 *  - Page 41, "Kala Chakra Dasha - MD and AD": the dasha balance at birth with the Jeeva and Deha signs, then the first twelve mahadashas, each with its twelve
 *    antardashas and the date each begins (those that ended before birth have no date).
 *  - Pages 42-46, "Kala Chakra Dasha AD and PD": the antardashas from birth, fifteen to a page, each with its twelve pratyantardashas and their beginning dates.
 * The reckoning is kalachakraBphs.js's (BPHS ch.46 and ch.64). Dates are in the birth place's time on the settings' dasha year. The twelve mahadashas, the
 * balance and the antardashas of the sample's Savya birth are reproduced date for date (test-book-pages.js). Each builder returns a Promise of { title, subtitle, blocks }.
 */
const { withBirth } = require('./charts');
const K = require('../../dasha/kalachakraBphs');
const { ymdText } = require('./calendarAge');

const MONTH_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const SIGN = ['Ari', 'Tau', 'Gem', 'Can', 'Leo', 'Vir', 'Lib', 'Sco', 'Sag', 'Cap', 'Aqu', 'Pis'];
const SIGN_FULL = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const pad = (n) => String(n).padStart(2, '0');

function dmyOf(ms, offsetMinutes) {
  const d = new Date(ms + offsetMinutes * 60000);
  return `${pad(d.getUTCDate())}-${pad(d.getUTCMonth() + 1)}-${d.getUTCFullYear()}`;
}
function ageText(fromMs, toMs, offsetMinutes) {
  const a = new Date(fromMs + offsetMinutes * 60000);
  const b = new Date(toMs + offsetMinutes * 60000);
  let months = (b.getUTCFullYear() - a.getUTCFullYear()) * 12 + (b.getUTCMonth() - a.getUTCMonth()) - (b.getUTCDate() < a.getUTCDate() ? 1 : 0);
  if (months < 0) months = 0;
  return `${Math.floor(months / 12)}y${months % 12}m`;
}
function balanceText(years) {
  let y = Math.floor(years);
  let m = Math.floor((years - y) * 12);
  let d = Math.round((((years - y) * 12) - m) * 30);
  if (d >= 30) { d -= 30; m += 1; }
  if (m >= 12) { m -= 12; y += 1; }
  return `${y}y ${m}m ${d}d`;
}

/** Everything the six pages share: the dasha from birth and how to date it. */
function setup(birth, dashaOptions, mahaCount) {
  const yearDays = dashaOptions?.yearDays ?? 365.25;
  return withBirth(birth, ({ chart }) => {
    const off = birth.utcOffsetMinutes ?? 0;
    const signs = Object.fromEntries(PLANETS.map((p) => [p, chart.grahas[p].rasiIndex]));
    const degrees = Object.fromEntries(PLANETS.map((p) => [p, chart.grahas[p].longitude % 30]));
    const facts = { signs, degrees, lagnaSign: Math.floor(chart.lagna.longitude / 30) };
    const birthMs = (chart.julianDay - 2440587.5) * 86400000;
    const k = K.kalachakraMahadashas(chart.grahas.Moon.longitude, mahaCount);
    const at = (years) => birthMs + years * yearDays * 86400000;
    const mark = (s) => (s === k.deha ? ' D' : s === k.jeeva ? ' J' : '');
    return { k, facts, birthMs, off, at, mark };
  });
}

const head = (name, birth) => ({ title: `ஜாதகம் — ${name}`.trim(), subtitle: `${birth.placeName} · ${birth.day} ${MONTH_EN[birth.month - 1]} ${birth.year}` });

/** Page 41. */
async function buildKalachakraMain({ name = '', birth, dashaOptions }) {
  const { k, facts, birthMs, off, at, mark } = await setup(birth, dashaOptions, 12);
  const blocks = k.mahas.map((m, i) => {
    const start = m.fullStartYears === undefined ? m.startYears : m.startYears;
    return {
      kind: 'table', tile: true,
      heading: `${SIGN[m.sign]} (${m.fullYears}y)`,
      aside: i === 0 ? '0y0m*' : ageText(birthMs, at(start), off),
      columns: ['Antar', 'Beginning'],
      rows: [
        ['Beginning', dmyOf(at(m.startYears), off)],
        ['Ending', dmyOf(at(m.endYears), off)],
        ...K.subPeriods(m, facts).map((a) => [`${a.sign + 1} ${SIGN[a.sign]}${mark(a.sign)}`, a.elapsed ? '' : dmyOf(at(a.startYears), off)]),
      ],
    };
  });
  return {
    ...head(name, birth),
    blocks: [
      {
        kind: 'text',
        heading: 'Kala Chakra Mahadashas and Antardashas',
        text: `Dasha balance at birth: ${SIGN_FULL[k.mahas[0].sign]} ${ymdText(birthMs, at(k.mahas[0].endYears), off)} • Jeeva Rashi: ${SIGN_FULL[k.jeeva]} • Deha Rashi: ${SIGN_FULL[k.deha]} • ${k.chakra === 'savya' ? 'Savya' : 'Apsavya'} chakra, pada ${k.pada} · The dates are the dasha beginning dates.`,
      },
      ...blocks,
    ],
  };
}

/** Pages 42-46: fifteen antardashas to a page from birth, `part` 0-4. */
async function buildKalachakraShort({ name = '', birth, dashaOptions, part }) {
  const { k, facts, off, at, mark } = await setup(birth, dashaOptions, 9);
  const flat = [];
  for (const m of k.mahas) {
    for (const a of K.subPeriods(m, facts)) {
      if (a.elapsed) continue;
      flat.push({ m, a });
    }
  }
  const blocks = flat.slice(part * 15, part * 15 + 15).map(({ m, a }) => ({
    kind: 'table', tile: true,
    heading: `${SIGN[m.sign]}-${SIGN[a.sign]}${mark(a.sign)}`,
    aside: `${dmyOf(at(a.startYears), off)} → ${dmyOf(at(a.endYears), off)}`,
    columns: ['Pratyantar', 'Begins'],
    rows: K.subPeriods({ sign: a.sign, startYears: a.startYears, endYears: a.endYears, fullStartYears: a.fullStartYears }, facts)
      .map((p) => [`${SIGN[p.sign]}${mark(p.sign)}`, p.elapsed ? '' : dmyOf(at(p.startYears), off)]),
  }));
  return {
    ...head(name, birth),
    blocks: [
      { kind: 'text', heading: 'Kala Chakra Antardashas and Pratyantardashas', text: 'The dates are given for dasha beginning dates. Jeeva and Deha signs are marked J and D.' },
      ...blocks,
    ],
  };
}

module.exports = { buildKalachakraMain, buildKalachakraShort };
