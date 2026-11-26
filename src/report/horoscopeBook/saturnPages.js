/**
 * Horoscope book, pages 79-80 (PL9 sample aniruddha_HC4): Saturn's transit over the Moon.
 *
 *  - Page 79, "Sadhesati of Saturn": the cycles of Saturn's passage through the twelfth, the birth sign and the second from it, each stay with its
 *    dates, its length (years-months-days) and the Ashtakavarga points of that sign (Saturn's own Bhinnashtakavarga and the Sarvashtakavarga).
 *  - Page 80, "Laghu Kalyani Dhayya and Kantaka Saturn": Saturn in the fourth and eighth from the Moon (Laghu Kalyani Dhayya, the Ardhashtama and
 *    Ashtama of saturnTransit.js) and in the fourth, seventh and tenth (Kantaka Saturn, the Vishnu Bhaskar convention, which is the sample's).
 * The passages are saturnTransit.js's (Swiss Ephemeris, Saturn's own ingresses and retrogrades, in the chart's ayanamsha); a stay is each time
 * Saturn is in a sign, so a retrograde return is a stay of its own, as the sample lists them. Dates are in the birth place's time. Each builder returns
 * a Promise of { title, subtitle, blocks }.
 */
const { withBirth } = require('./charts');
const { computeSaturnTransits } = require('../saturnTransit');
const { calculateAshtakavarga, CONTRIBUTORS } = require('../../chart/ashtakavarga');
const N = require('../../sources/tamilNames');

const MONTH_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const ORDINAL_EN = ['First', 'Second', 'Third'];
const pad = (n) => String(n).padStart(2, '0');
/** The house a stay is in, as the sample words it for the Sadhesati. */
const SADE_LABEL = { 12: 'Twelfth from birth rashi', 1: 'On birth rashi', 2: 'Second from birth rashi' };
const HOUSE_TA = { 4: 'நான்காம் வீடு', 7: 'ஏழாம் வீடு', 8: 'எட்டாம் வீடு', 10: 'பத்தாம் வீடு' };

/** 'dd-mm-yyyy' of an ISO instant in the zone of `offsetMinutes`. */
function dmy(iso, offsetMinutes) {
  const d = new Date(Date.parse(iso) + offsetMinutes * 60000);
  return `${pad(d.getUTCDate())}-${pad(d.getUTCMonth() + 1)}-${d.getUTCFullYear()}`;
}

/** The length between two instants as the sample prints it, "years-months-days" ("1-6-23"). */
function span(fromIso, toIso) {
  const a = new Date(Date.parse(fromIso));
  const b = new Date(Date.parse(toIso));
  let months = (b.getUTCFullYear() - a.getUTCFullYear()) * 12 + (b.getUTCMonth() - a.getUTCMonth());
  let anchor = new Date(Date.UTC(a.getUTCFullYear(), a.getUTCMonth() + months, a.getUTCDate(), a.getUTCHours(), a.getUTCMinutes()));
  if (anchor > b) { months -= 1; anchor = new Date(Date.UTC(a.getUTCFullYear(), a.getUTCMonth() + months, a.getUTCDate(), a.getUTCHours(), a.getUTCMinutes())); }
  const days = Math.round((b - anchor) / 86400000);
  return `${Math.floor(months / 12)}-${months % 12}-${days}`;
}

function setup(birth, kantakaConvention) {
  return withBirth(birth, ({ chart }) => {
    const moonRasiIndex = chart.grahas.Moon.rasiIndex;
    const birthMs = (chart.julianDay - 2440587.5) * 86400000;
    const result = computeSaturnTransits({
      moonRasiIndex,
      moonNakshatraIndex: Math.floor(chart.grahas.Moon.longitude / (360 / 27)) % 27,
      birthMs, horizonYears: 100, ayanamsha: chart.ayanamsha, kantakaConvention,
    });
    const rasi = Object.fromEntries(CONTRIBUTORS.map((c) => [c, Math.floor((c === 'Lagna' ? chart.lagna : chart.grahas[c]).longitude / 30)]));
    const av = calculateAshtakavarga(rasi);
    return { chart, result, moonRasiIndex, saturnBindus: av.bhinna.Saturn, sarva: av.sarva, off: birth.utcOffsetMinutes ?? 0, birthMs };
  });
}

function head(name, birth) {
  return { title: `ஜாதகம் — ${name}`.trim(), subtitle: `${birth.placeName} · ${birth.day} ${MONTH_EN[birth.month - 1]} ${birth.year}` };
}

/** Page 79. */
async function buildSadhesati({ name = '', birth }) {
  const { result, moonRasiIndex, saturnBindus, sarva, off, birthMs } = await setup(birth);
  const moon = N.RASI_TA[moonRasiIndex];
  const rows = [];
  result.sadeSati.forEach((cycle, ci) => {
    rows.push([`${ORDINAL_EN[ci] ?? ci + 1} cycle of Sadhesati`, '', '', '', '', '', '']);
    // a sign's stays are listed one by one; its bindus once, on the first
    const seen = new Set();
    for (const stay of cycle.stays) {
      if (Date.parse(stay.toUtc) <= birthMs) continue; // ended before birth
      const first = !seen.has(stay.house);
      seen.add(stay.house);
      rows.push([
        SADE_LABEL[stay.house] ?? `House ${stay.house}`,
        N.RASI_TA[stay.rasiIndex],
        stay.openStart || Date.parse(stay.fromUtc) < birthMs ? '--' : dmy(stay.fromUtc, off),
        stay.openEnd ? '—' : dmy(stay.toUtc, off),
        stay.openEnd ? '—' : span(new Date(Math.max(Date.parse(stay.fromUtc), birthMs)).toISOString(), stay.toUtc),
        first ? String(saturnBindus[stay.rasiIndex]) : '',
        first ? String(sarva[stay.rasiIndex]) : '',
      ]);
    }
  });
  return {
    ...head(name, birth),
    blocks: [
      {
        kind: 'text',
        heading: 'Sadhesati of Saturn',
        text: `The seven and a half year period during which Saturn transits in the twelfth, the first and the second houses from the birth rashi (Moon sign) is the Sadhesati of Saturn. Your birth rashi is ${moon}. `
          + 'It is made up of three periods of about two and a half years each, as Saturn travels in each rashi for two and a half years; in a lifetime it occurs about three times.',
      },
      { kind: 'table', heading: 'Sadhesati cycles', columns: ['Sadhesati cycle', 'Transit of Saturn', 'Beginning date', 'Ending date', 'Duration Yr-Mn-Dy', 'Saturn BAV', 'Sarva'], rows },
    ],
  };
}

/** Page 80. */
async function buildLaghuKalyani({ name = '', birth }) {
  const { result, moonRasiIndex, saturnBindus, sarva, off, birthMs } = await setup(birth, 'VISHNU_BHASKAR');
  const moon = N.RASI_TA[moonRasiIndex];
  const stayRows = (periods, label) => {
    const rows = [];
    for (const p of periods) {
      const seen = new Set();
      for (const stay of p.stays) {
        if (Date.parse(stay.toUtc) <= birthMs) continue; // ended before birth
        const first = !seen.has(stay.rasiIndex);
        seen.add(stay.rasiIndex);
        rows.push([
          `${label(stay)}`,
          N.RASI_TA[stay.rasiIndex],
          stay.openStart || Date.parse(stay.fromUtc) < birthMs ? '--' : dmy(stay.fromUtc, off),
          stay.openEnd ? '—' : dmy(stay.toUtc, off),
          stay.openEnd ? '—' : span(new Date(Math.max(Date.parse(stay.fromUtc), birthMs)).toISOString(), stay.toUtc),
          first ? String(saturnBindus[stay.rasiIndex]) : '',
          first ? String(sarva[stay.rasiIndex]) : '',
        ]);
      }
    }
    return rows;
  };
  const columns = ['Transit of Saturn', 'Sign', 'Beginning date', 'Ending date', 'Duration Yr-Mn-Dy', 'Saturn BAV', 'Sarva'];
  const laghu = [...result.ardhashtama, ...result.ashtama].sort((a, b) => Date.parse(a.fromUtc) - Date.parse(b.fromUtc));
  const kantaka = result.kantaka.periods ?? [];
  return {
    ...head(name, birth),
    blocks: [
      {
        kind: 'text',
        heading: 'Laghu Kalyani Dhayya and Kantaka Saturn',
        text: `Transit of Saturn in the fourth and eighth house from the Moon sign is called Laghu Kalyani Dhayya; in the fourth, seventh and tenth house it is called Kantaka Saturn (the Vishnu Bhaskar convention). Your Moon sign is ${moon}.`,
      },
      { kind: 'table', heading: 'Laghu Kalyani Dhayya (fourth and eighth from the Moon)', columns, rows: stayRows(laghu, (s) => `Laghu Kalyani Dhayya — ${HOUSE_TA[s.house] ?? s.house}`) },
      { kind: 'table', heading: 'Kantaka Saturn (fourth, seventh and tenth from the Moon)', columns, rows: stayRows(kantaka, (s) => `Kantaka Saturn — ${HOUSE_TA[s.house] ?? s.house}`) },
    ],
  };
}

module.exports = { buildSadhesati, buildLaghuKalyani, span };
