/**
 * Horoscope book, pages 21-32 (PL9 sample aniruddha_HC4): the Vimshottari dasha in detail.
 *
 *  - Pages 21-29, "Vimshottari Detailed AD and PD": one page for each of the nine mahadashas, with a block for each of its nine
 *    antardashas that lists the nine pratyantardashas and their beginning and ending dates; the age at which the antardasha begins
 *    is beside its name. The birth dasha's antardashas that ended before birth are listed without dates, as the sample lists them.
 *  - Pages 30-32, "Vimshottari Dasha - PD and Sookshma": the pratyantardashas from the one running on the date of printing, thirty-six
 *    of them (twelve a page), each with its nine sookshma dashas and the date and time each begins.
 *  - The "Vimshottari (Short) AD and PD" pages of PL9's shorter print (meera_HC2, pages 18-22): fifteen antardashas to a page, each with its
 *    beginning and ending and only the beginning of each of its pratyantardashas, from the first antardasha still running at birth to the
 *    seventy-fifth; the same dates as the detailed pages.
 * The periods are the engine's (vimshottariDasha.js, BPHS ch.46 and ch.51): the sub-periods of a period are laid over its full
 * length from its own lord, and a period running at birth keeps only what was still to run. The dasha year and the balance method
 * are the settings'. Each builder returns a Promise of { title, subtitle, blocks }.
 */
const { withBirth } = require('./charts');
const { buildVimshottariDasha, orderFrom } = require('../../dasha/vimshottariDasha');
const { planetLongitude } = require('../../ephemeris/siderealPositions');
const { PLANET_TA } = require('../../sources/tamilNames');

const MONTH_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const LEVEL_KEY = ['Bhukti', 'Antara', 'Sookshma'];

/** 'YYYY-MM-DD HH:mm' as 'dd-mm-yyyy'. */
const dmy = (local) => { const [y, m, d] = local.slice(0, 10).split('-'); return `${d}-${m}-${y}`; };
/** 'YYYY-MM-DD HH:mm' as 'dd-mm-yyyy HH:mm'. */
const dmyHm = (local) => `${dmy(local)} ${local.slice(11, 16)}`;

/** Completed years and months between two 'YYYY-MM-DD ...' local dates, as PL9 prints a running age ("0y2m"). */
function ageText(fromLocal, toLocal) {
  const [y1, m1, d1] = fromLocal.slice(0, 10).split('-').map(Number);
  const [y2, m2, d2] = toLocal.slice(0, 10).split('-').map(Number);
  let months = (y2 - y1) * 12 + (m2 - m1) - (d2 < d1 ? 1 : 0);
  if (months < 0) months = 0;
  return `${Math.floor(months / 12)}y${months % 12}m`;
}

/** The Vimshottari tree of one birth to `depth` levels, with the settings' dasha year and balance method. */
function treeFor(birth, dashaOptions, depth) {
  return withBirth(birth, ({ chart }) => {
    const options = dashaOptions ?? { yearDays: 365.25, balance: 'degree' };
    const tree = buildVimshottariDasha(chart.julianDay, chart.grahas.Moon.longitude, birth.utcOffsetMinutes ?? 0, {
      depth, yearDays: options.yearDays, balance: options.balance,
      moonLongitudeAt: (jd) => planetLongitude(jd, 'Moon', chart.ayanamsha),
    });
    return { tree, chart, birthLocal: tree.dashas[0].startLocal };
  });
}

/**
 * The nine sub-periods of a node in order, with the dates of those still to run: a sub-period that ended before birth has none.
 * @returns {{ lord: string, node: object|null }[]}
 */
function listChildren(node, childKey) {
  const byLord = new Map((node[childKey] || []).map((c) => [c.lord, c]));
  return orderFrom(node.lord).map((lord) => ({ lord, node: byLord.get(lord) ?? null }));
}

const ta = (lord) => PLANET_TA[lord] ?? lord;

/** Page 21 + i: the antardashas and pratyantardashas of the i-th mahadasha (0 to 8). */
async function buildVimshottariDetail({ name = '', birth, dashaOptions, index }) {
  const { tree, birthLocal } = await treeFor(birth, dashaOptions, 3);
  const md = tree.dashas[index];
  const blocks = listChildren(md, 'Bhukti').map(({ lord, node: ad }) => {
    const rows = ad
      ? listChildren(ad, 'Antara').map(({ lord: pd, node }) => [pd, node ? dmy(node.startLocal) : '', node ? dmy(node.endLocal) : ''])
      : orderFrom(lord).map((pd) => [pd, '', '']);
    return {
      kind: 'table', tile: true,
      heading: `${md.lord}-${lord}`,
      aside: ad ? ageText(birthLocal, ad.startLocal) : '',
      columns: ['Antar', 'Beginning', 'Ending'],
      rows,
    };
  });
  const age = `${ageText(birthLocal, md.startLocal)} to ${ageText(birthLocal, md.endLocal)}`;
  return {
    title: `ஜாதகம் — ${name}`.trim(),
    subtitle: `${birth.placeName} · ${birth.day} ${MONTH_EN[birth.month - 1]} ${birth.year}`,
    blocks: [
      {
        kind: 'text',
        heading: `Vimshottari Antardasha and Pratyantardashas — ${ta(md.lord)} (${md.lord}) mahadasha`,
        text: `Mahadasha ${md.lord}: ${dmy(md.startLocal)} to ${dmy(md.endLocal)} · Age: ${age} · the running age is given for the dasha beginning dates`,
      },
      ...blocks,
    ],
  };
}

/** Pages 30-32: thirty-six pratyantardashas from the one running on `asOf`, twelve to a page (`part` 0, 1, 2), each with its sookshma dashas. */
async function buildVimshottariSookshma({ name = '', birth, dashaOptions, part, asOf = new Date() }) {
  const { tree } = await treeFor(birth, dashaOptions, 4);
  const flat = [];
  for (const md of tree.dashas) for (const ad of md.Bhukti || []) for (const pd of ad.Antara || []) flat.push({ md, ad, pd });
  const asOfJd = asOf.getTime() / 86400000 + 2440587.5;
  let first = flat.findIndex((x) => x.pd.startJulianDay <= asOfJd && asOfJd < x.pd.endJulianDay);
  if (first < 0) first = asOfJd < flat[0].pd.startJulianDay ? 0 : Math.max(0, flat.length - 36);
  const slice = flat.slice(first + part * 12, first + part * 12 + 12);
  const blocks = slice.map(({ md, ad, pd }) => ({
    kind: 'table', tile: true,
    heading: `${md.lord}-${ad.lord}-${pd.lord}`,
    aside: `${dmy(pd.startLocal)} → ${dmy(pd.endLocal)}`,
    columns: ['Sookshma', 'Beginning', 'Ending'],
    rows: listChildren(pd, 'Sookshma').map(({ lord, node }) => [lord, node ? dmyHm(node.startLocal) : '', node ? dmyHm(node.endLocal) : '']),
  }));
  return {
    title: `ஜாதகம் — ${name}`.trim(),
    subtitle: `${birth.placeName} · ${birth.day} ${MONTH_EN[birth.month - 1]} ${birth.year}`,
    blocks: [
      { kind: 'text', heading: 'Vimshottari Pratyantardasha and Sookshma Dasha', text: 'The dates are given for dasha beginning dates; from the pratyantardasha running when the book was made.' },
      ...blocks,
    ],
  };
}

/** The antardashas that end after birth, in order, each with its mahadasha. */
function flatAntardashas(tree, birthLocal) {
  const out = [];
  for (const md of tree.dashas) for (const ad of md.Bhukti || []) {
    if (ad.endLocal.slice(0, 10) > birthLocal.slice(0, 10)) out.push({ md, ad });
  }
  return out;
}

// PL9 prints seventy-five antardashas, five pages of fifteen (to the 108th year on meera's chart): the count, not an age, ends them
const SHORT_PER_PAGE = 15;
const SHORT_PAGES = 5;
/** PL9's three-letter names for the nine lords. */
const ABBR3 = { Sun: 'Sun', Moon: 'Mon', Mars: 'Mar', Mercury: 'Mer', Jupiter: 'Jup', Venus: 'Ven', Saturn: 'Sat', Rahu: 'Rah', Ketu: 'Ket' };

/** Short pages 0 to 4: fifteen antardashas each, with the beginning dates of their pratyantardashas. */
async function buildVimshottariShort({ name = '', birth, dashaOptions, part }) {
  const { tree, birthLocal } = await treeFor(birth, dashaOptions, 3);
  const slice = flatAntardashas(tree, birthLocal).slice(0, SHORT_PER_PAGE * SHORT_PAGES).slice(part * SHORT_PER_PAGE, (part + 1) * SHORT_PER_PAGE);
  const blocks = slice.map(({ md, ad }) => ({
    kind: 'table', tile: true,
    heading: `${ABBR3[md.lord]}-${ABBR3[ad.lord]}`,
    aside: `${dmy(ad.startLocal)} → ${dmy(ad.endLocal)}`,
    columns: ['Antar', 'Begin'],
    rows: listChildren(ad, 'Antara').map(({ lord, node }) => [ABBR3[lord], node ? dmy(node.startLocal) : '']),
  }));
  return {
    title: `ஜாதகம் — ${name}`.trim(),
    subtitle: `${birth.placeName} · ${birth.day} ${MONTH_EN[birth.month - 1]} ${birth.year}`,
    blocks: [
      { kind: 'text', heading: 'Vimshottari Antardasha and Pratyantardashas', text: '*The dates are given for dasha beginning dates.' },
      ...blocks,
    ],
  };
}

module.exports = { buildVimshottariShort, buildVimshottariDetail, buildVimshottariSookshma, ageText, listChildren, treeFor, dmy };
