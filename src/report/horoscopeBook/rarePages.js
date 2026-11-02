/**
 * Horoscope book, pages 62-63 and 67-70 and 73-78 (PL9 sample aniruddha_HC4): the nakshatra dashas of the registry with a table
 * (rareDashas.js: Tribhagi, Shodashottari, Dwadashottari, Dwisaptatisama, Shattrimshatsama, Panchottari, Satabdika, Chaturashitisama). Each page is the
 * sample's "... Mahadasha and Antardashas": the dasha balance at birth, and a block for each mahadasha (nine to a page, in order from
 * birth) with its antardashas and their dates. The periods are nakshatraDashaEngine.js's: a period's sub-periods are laid over its
 * full length from its own lord, and the birth dasha keeps only what was still to run (those that ended before birth have no dates).
 * Shastihayani (pages 71-72) is the registry's table of 28 divisions (bphsDashas.js). Not built here: the other dashas the registry declares without a table.
 * Dates are in the birth place's time, on the settings' dasha year. Each builder returns a Promise of { title, subtitle, blocks }.
 */
const { withBirth } = require('./charts');
const R = require('../../dasha/rareDashas');
const E = require('../../dasha/nakshatraDashaEngine');
const FL = require('../../dasha/fiveLevel');

const MONTH_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const ABBR = { Sun: 'Su', Moon: 'Mo', Mars: 'Ma', Mercury: 'Me', Jupiter: 'Ju', Venus: 'Ve', Saturn: 'Sa', Rahu: 'Ra', Ketu: 'Ke' };
const PER_PAGE = 9;
const pad = (n) => String(n).padStart(2, '0');

/** The method's name as the sample's page title has it. */
const TITLES = {
  tribhagi: 'Tribhagi', 'tribhagi-40': 'Tribhagi 40', shodashottari: 'Shodashottari', dwadashottari: 'Dwadashottari', 'dwisaptati-sama': 'Dwisaptatisama',
  'shattrimshat-sama': 'Shattrimshatsama', panchottari: 'Panchottari', shatabdika: 'Satabdika', 'chaturashiti-sama': 'Chaturshitisama', shashtihayani: 'Shastihayani',
};

/** 'dd-mm-yyyy' of a UTC millisecond count in the zone of `offsetMinutes`. */
function dmyOf(ms, offsetMinutes) {
  const d = new Date(ms + offsetMinutes * 60000);
  return `${pad(d.getUTCDate())}-${pad(d.getUTCMonth() + 1)}-${d.getUTCFullYear()}`;
}

/** Years as "5y 0m 26d" (a month a twelfth of the year, a day a thirtieth of a month). */
function ymd(years) {
  let y = Math.floor(years);
  let m = Math.floor((years - y) * 12);
  let d = Math.round((((years - y) * 12) - m) * 30);
  if (d >= 30) { d -= 30; m += 1; }
  if (m >= 12) { m -= 12; y += 1; }
  return `${y}y ${m}m ${d}d`;
}

/**
 * One page of one method. `page` is 0 for the first nine mahadashas, 1 for the next nine, and so on.
 * @param {{ name?: string, birth: object, dashaOptions?: {yearDays:number}, method: string, page: number }} q
 */
function buildRarePage({ name = '', birth, dashaOptions, method, page }) {
  const table = R.getTable(method);
  if (!table) throw new Error(`no table for ${method}`);
  const yearDays = dashaOptions?.yearDays ?? 365.25;
  return withBirth(birth, ({ chart }) => {
    const off = birth.utcOffsetMinutes ?? 0;
    const birthMs = (chart.julianDay - 2440587.5) * 86400000;
    const moon = chart.grahas.Moon.longitude;
    const tree = E.buildDasha(table, { birthMs, moonLongitude: moon, depth: 2, cycles: Math.ceil(130 / table.totalYears) + 1 });
    // the settings' dasha year: the engine counts in 365.25-day years, so scale the distance from birth
    const at = (years) => birthMs + years * yearDays * 86400000;
    // the mahadashas that begin within a lifetime of 120 years
    const lifetime = tree.periods.filter((p) => p.startYears < 120);
    const chunk = lifetime.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);
    const blocks = chunk.map((p) => {
      const byLord = new Map((p.children || []).map((c) => [c.lord, c]));
      return {
        kind: 'table', tile: true,
        heading: `${p.lord} (${Number(table.years[p.lord].toFixed(2))}y)`,
        columns: ['Antar', 'Beginning', 'Ending'],
        rows: E.orderFrom(table, p.lord).map((lord) => {
          const c = byLord.get(lord);
          return [lord, c ? dmyOf(at(c.startYears), off) : '', c ? dmyOf(at(c.endYears), off) : ''];
        }),
      };
    });
    const atBirth = FL.tableChain({ table, birthMs, moonLongitude: moon, atMs: birthMs + 1000, depth: 5 }).map((l) => ABBR[l.lord] ?? l.lord).join('-');
    return {
      title: `ஜாதகம் — ${name}`.trim(),
      subtitle: `${birth.placeName} · ${birth.day} ${MONTH_EN[birth.month - 1]} ${birth.year}`,
      blocks: [
        {
          kind: 'text',
          heading: `${TITLES[method]} Mahadashas and Antardashas`,
          text: `Dasha balance at birth: ${tree.startLord} ${ymd(tree.balanceYears)} · Dasha at the time of birth: ${atBirth} · ${table.totalYears}-year cycle`,
        },
        ...blocks,
      ],
    };
  });
}

module.exports = { buildRarePage, ymd, TITLES };
