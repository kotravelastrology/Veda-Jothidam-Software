/**
 * Horoscope book, pages 33-40 (PL9 sample aniruddha_HC4): the Ashtottari and Yogini dashas.
 *
 *  - Page 33, "Ashtottari MD and AD": the eight mahadashas, each with its eight antardashas; the birth dasha's antardashas that ended
 *    before birth are shown as "-".
 *  - Pages 34-37, "Ashtottari (Short) AD and PD": each antardasha from birth with its eight pratyantardashas and the date each begins.
 *  - Pages 38-40, "Yogini Dasha": the three thirty-six-year cycles, a page each: the eight Yoginis with their antardashas.
 * The engines are altDashas.js (Yogini: BPHS Uttara; Ashtottari: BPHS ch.46 vv.17-23 through bphsDashas.js). The sub-periods of a
 * period are laid over its full length in the cycle's order from its own lord, and the period running at birth keeps only what was
 * still to run. Dates are in the birth place's time. Each builder returns a Promise of { title, subtitle, blocks }.
 */
const { withBirth } = require('./charts');
const A = require('../../dasha/altDashas');

const MONTH_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MS_PER_YEAR = 365.25 * 86400000;
const YOGINI_ABBR = ['Mang Mo', 'Ping Su', 'Dhan Ju', 'Bhra Ma', 'Bhad Me', 'Ulka Sa', 'Sidh Ve', 'Sank Ra'];
const YOGINI_NAMES = ['Mangala', 'Pingala', 'Dhanya', 'Bhramari', 'Bhadrika', 'Ulka', 'Siddha', 'Sankata'];

const ABBR3 = { Sun: 'Sun', Moon: 'Mon', Mars: 'Mar', Mercury: 'Mer', Jupiter: 'Jup', Venus: 'Ven', Saturn: 'Sat', Rahu: 'Rah', Ketu: 'Ket' };
const pad = (n) => String(n).padStart(2, '0');
/** 'dd-mm-yyyy' of a UTC millisecond count in the zone of `offsetMinutes`. */
function dmyOf(ms, offsetMinutes) {
  const d = new Date(ms + offsetMinutes * 60000);
  return `${pad(d.getUTCDate())}-${pad(d.getUTCMonth() + 1)}-${d.getUTCFullYear()}`;
}
/** Completed years and months from `fromMs` to `toMs`, "7y3m". */
function ageOf(fromMs, toMs, offsetMinutes) {
  const a = new Date(fromMs + offsetMinutes * 60000);
  const b = new Date(toMs + offsetMinutes * 60000);
  let months = (b.getUTCFullYear() - a.getUTCFullYear()) * 12 + (b.getUTCMonth() - a.getUTCMonth()) - (b.getUTCDate() < a.getUTCDate() ? 1 : 0);
  if (months < 0) months = 0;
  return `${Math.floor(months / 12)}y${months % 12}m`;
}

function head(name, birth) {
  return { title: `ஜாதகம் — ${name}`.trim(), subtitle: `${birth.placeName} · ${birth.day} ${MONTH_EN[birth.month - 1]} ${birth.year}` };
}

/** The engine's periods for one birth: the Moon's longitude and the birth moment in ms. */
function enginesFor(birth, build) {
  return withBirth(birth, ({ chart }) => {
    const birthMs = (chart.julianDay - 2440587.5) * 86400000;
    return build(chart.grahas.Moon.longitude, birthMs, birth.utcOffsetMinutes ?? 0);
  });
}

/** years of the lord at index i in a cycle, and the cycle's total, for dividing a period into its own cycle's proportions */
const ASHT = { lords: A.ASHTOTTARI_LORDS, years: A.ASHTOTTARI_YEARS, total: 108 };

/**
 * The sub-periods of an Ashtottari period (an antardasha or a mahadasha) in order from its own lord, over its full length; ones that ended before
 * `period.startMs` are returned with `null` dates.
 */
function divideAshtottari(period) {
  const full = ASHT.years[period.index];
  let cursor = period.endMs - full * MS_PER_YEAR;
  const out = [];
  for (let i = 0; i < 8; i += 1) {
    const idx = (period.index + i) % 8;
    const len = (ASHT.years[idx] / ASHT.total) * full * MS_PER_YEAR;
    const end = cursor + len;
    out.push({ index: idx, lord: ASHT.lords[idx], startMs: end > period.startMs + 1 ? Math.max(cursor, period.startMs) : null, endMs: end > period.startMs + 1 ? end : null, fullStartMs: cursor, fullEndMs: end });
    cursor = end;
  }
  return out;
}

/** Page 33: Ashtottari mahadashas with their antardashas. */
async function buildAshtottariMain({ name = '', birth }) {
  return enginesFor(birth, (moon, birthMs, off) => {
    const d = A.buildAshtottariDasha(moon, birthMs);
    const blocks = d.periods.map((p) => ({
      kind: 'table', tile: true,
      heading: `${p.lord} (${ASHT.years[p.index]}y)`,
      aside: `From ${ageOf(birthMs, p.startMs, off)} to ${ageOf(birthMs, p.endMs, off)}`,
      columns: ['Antar', 'Beginning', 'Ending'],
      rows: divideAshtottari(p).map((s) => [s.lord, s.startMs === null ? '-' : dmyOf(s.startMs, off), s.endMs === null ? '-' : dmyOf(s.endMs, off)]),
    }));
    const balYears = d.periods[0].years;
    const y = Math.floor(balYears); const m = Math.floor((balYears - y) * 12); const dd = Math.round((((balYears - y) * 12) - m) * 30);
    return {
      ...head(name, birth),
      blocks: [
        { kind: 'text', heading: 'Ashtottari Mahadashas and Antardashas', text: `Dasha balance at birth: ${d.startLord} ${y}y ${m}m ${dd}d. ${d.note ?? ''}`.trim() },
        ...blocks,
      ],
    };
  });
}

/** Pages 34-37: Ashtottari antardashas from birth with their pratyantardashas, `per` to a page; `part` is 0-3. */
async function buildAshtottariShort({ name = '', birth, part }) {
  return enginesFor(birth, (moon, birthMs, off) => {
    const d = A.buildAshtottariDasha(moon, birthMs);
    const flat = [];
    for (const md of d.periods) {
      for (const ad of divideAshtottari(md)) {
        if (ad.startMs === null) continue;
        flat.push({ md, ad: { ...ad, index: ad.index } });
      }
    }
    const per = Math.ceil(flat.length / 4);
    const blocks = flat.slice(part * per, part * per + per).map(({ md, ad }) => ({
      kind: 'table', tile: true,
      heading: `${ABBR3[md.lord]}-${ABBR3[ad.lord]}`,
      aside: `${dmyOf(ad.startMs, off)} → ${dmyOf(ad.endMs, off)}`,
      columns: ['Pratyantar', 'Begins'],
      rows: divideAshtottari({ index: ad.index, startMs: ad.startMs, endMs: ad.endMs }).map((s) => [s.lord, s.startMs === null ? '' : dmyOf(s.startMs, off)]),
    }));
    return { ...head(name, birth), blocks: [{ kind: 'text', heading: 'Ashtottari Antardashas and Pratyantardashas', text: 'The dates are given for dasha beginning dates.' }, ...blocks] };
  });
}

/** The eight sub-periods of a Yogini period over its full length, in order from its own Yogini. */
function divideYogini(period) {
  const full = A.YOGINI_YEARS[period.index];
  let cursor = period.endMs - full * MS_PER_YEAR;
  const out = [];
  for (let i = 0; i < 8; i += 1) {
    const idx = (period.index + i) % 8;
    const len = (A.YOGINI_YEARS[idx] / 36) * full * MS_PER_YEAR;
    const end = cursor + len;
    const kept = end > period.startMs + 1;
    out.push({ index: idx, startMs: kept ? Math.max(cursor, period.startMs) : null, endMs: kept ? end : null });
    cursor = end;
  }
  return out;
}

/** Pages 38-40: the Yogini dasha, one thirty-six-year cycle to a page (`cycle` 0-2). */
async function buildYogini({ name = '', birth, cycle }) {
  return enginesFor(birth, (moon, birthMs, off) => {
    const d = A.buildYoginiDasha(moon, birthMs);
    const first = d.periods[0];
    const slice = d.periods.slice(cycle * 8, cycle * 8 + 8);
    const blocks = slice.map((p) => ({
      kind: 'table', tile: true,
      heading: `${YOGINI_NAMES[p.index]} (${A.YOGINI_YEARS[p.index]}y)`,
      aside: `From ${ageOf(birthMs, p.startMs, off)} to ${ageOf(birthMs, p.endMs, off)}`,
      columns: ['Antar', 'Beginning', 'Ending'],
      rows: divideYogini(p).map((s) => [YOGINI_ABBR[s.index], s.startMs === null ? '' : dmyOf(s.startMs, off), s.endMs === null ? '' : dmyOf(s.endMs, off)]),
    }));
    const years = first.years; const y = Math.floor(years); const m = Math.floor((years - y) * 12); const dd = Math.round((((years - y) * 12) - m) * 30);
    return {
      ...head(name, birth),
      blocks: [
        { kind: 'text', heading: `Yogini Mahadashas and Antardashas (${['First', 'Second', 'Third'][cycle]} cycle)`, text: `Dasha balance at birth: ${YOGINI_NAMES[first.index]} ${y}y ${m}m ${dd}d.` },
        ...blocks,
      ],
    };
  });
}

module.exports = { buildAshtottariMain, buildAshtottariShort, buildYogini, divideAshtottari, divideYogini };
