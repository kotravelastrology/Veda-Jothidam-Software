/**
 * Gochara vedha and vipareetha vedha for all nine planets, as dated windows.
 *
 * For each planet, every stay in a sign over its own span (the Moon's next two
 * months, the Sun's next year, Jupiter's next twelve years, …) is counted from
 * the natal Moon and classified by the chosen book's table:
 *
 *   GOOD           a good house with a vedha house — any other planet there
 *                  obstructs the good (gochara vedha)
 *   GOOD_UNPAIRED  a good house the book gives no vedha house for
 *   RELIEVABLE     a bad house with a vipareetha house — any other planet there
 *                  cancels the bad
 *   NO_RELIEF      a bad house with neither
 *
 * Every method in `VEDHA_RANK.computable` is computed — Pulippani (default —
 * the book that explains most), Santhanam, Phaladeepika (Sastri) and Vishnu
 * Bhaskar, the books whose tables can be read without guessing
 * (`gocharaVedhaTables.js` says why the others are compared but not computed).
 *
 * Who counts as "another planet" follows `saturnVedha.js`: every planet except
 * those the book exempts (father and son; Pulippani's Venus–Sun), with the
 * Moon's short passes counted rather than listed and left out of the totals,
 * and Rahu–Ketu — always opposite — shown but not counted.
 */

const { UnsupportedInputError } = require('../contracts/chartContext');
const { signStays, overlaps, unionDays } = require('./saturnVedha');
const { houseFromMoon, RASI_TA } = require('./saturnTransit');
const { planetLongitude, nodeLongitude } = require('../ephemeris/siderealPositions');
const V = require('./gocharaVedhaTables');

const DAY_MS = 86400000;
const YEAR_MS = 365.25 * DAY_MS;
const JD_UNIX_EPOCH = 2440587.5;
const PLANETS = V.PLANETS_9;
const PLANET_TA = {
  Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு',
  Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது',
};
/** How far back and ahead each planet's stays are listed: a span that shows a few full cycles of its sign changes. */
const SPAN = {
  Moon: [2 * DAY_MS, 60 * DAY_MS],
  Sun: [31 * DAY_MS, 366 * DAY_MS],
  Mercury: [31 * DAY_MS, 366 * DAY_MS],
  Venus: [31 * DAY_MS, 366 * DAY_MS],
  Mars: [62 * DAY_MS, 2 * YEAR_MS],
  Jupiter: [YEAR_MS, 12 * YEAR_MS],
  Saturn: [2 * YEAR_MS, 30 * YEAR_MS],
  Rahu: [YEAR_MS, 18 * YEAR_MS],
  Ketu: [YEAR_MS, 18 * YEAR_MS],
};
const iso = (ms) => new Date(ms).toISOString();
const days = (a, b) => Math.round(((b - a) / DAY_MS) * 10) / 10;
const describe = (ivs) => ivs.map(([a, b]) => ({ fromUtc: iso(a), toUtc: iso(b), days: days(a, b) }));

function longitudeOf(planet, ms, ayanamsha, nodeType) {
  const jd = ms / DAY_MS + JD_UNIX_EPOCH;
  if (planet === 'Rahu') return nodeLongitude(jd, ayanamsha, nodeType);
  if (planet === 'Ketu') return (nodeLongitude(jd, ayanamsha, nodeType) + 180) % 360;
  return planetLongitude(jd, planet, ayanamsha);
}

/**
 * What a planet in `house` is, under one method's table. `pairedHouses` lists
 * every house whose occupant obstructs (GOOD) or relieves (RELIEVABLE) it —
 * one book gives two relieving houses for some bad houses — and `paired` is the
 * first, for callers that show one.
 */
function classify(row, house) {
  if (row.notCovered) return { kind: 'NOT_COVERED', paired: null, pairedHouses: [] };
  if (row.vedhaOf[house] !== undefined) return { kind: 'GOOD', paired: row.vedhaOf[house], pairedHouses: [row.vedhaOf[house]] };
  if (row.unpairedGood.includes(house)) return { kind: 'GOOD_UNPAIRED', paired: null, pairedHouses: [] };
  if (row.relievedBy[house] !== undefined) return { kind: 'RELIEVABLE', paired: row.relievedBy[house][0], pairedHouses: [...row.relievedBy[house]] };
  return { kind: 'NO_RELIEF', paired: null, pairedHouses: [] };
}

/** How another planet in the paired house is treated: counted, exempt by the book, or the opposite node. */
function statusOf(method, planet, other, kind) {
  const list = kind === 'GOOD' ? method.exempt.gochara : method.exempt.vipareeta;
  if ((list[planet] ?? []).includes(other)) return 'EXEMPT';
  if ((planet === 'Rahu' && other === 'Ketu') || (planet === 'Ketu' && other === 'Rahu')) return 'NODE_PAIR';
  return 'COUNTS';
}

/**
 * One method over precomputed sign stays of all nine planets.
 * `stays` maps planet → [{ sign, fromMs, toMs }] covering at least each planet's span.
 */
function vedhaForMethod({ methodId, stays, moonRasiIndex, atMs, ayanamsha, nodeType }) {
  const method = V.VEDHA_METHODS[methodId];
  const signOfHouse = (h) => (moonRasiIndex + h - 1) % 12;
  const planets = {};
  for (const p of PLANETS) {
    const row = method.table[p];
    const [before, after] = SPAN[p];
    const from = atMs - before;
    const to = atMs + after;
    const own = stays[p].filter((s) => s.toMs > from && s.fromMs < to);
    const rows = own.map((s) => {
      const a = Math.max(s.fromMs, from);
      const b = Math.min(s.toMs, to);
      const house = houseFromMoon(s.sign, moonRasiIndex);
      const { kind, paired, pairedHouses } = classify(row, house);
      const out = {
        house, rasi: RASI_TA[s.sign], fromUtc: iso(a), toUtc: iso(b), days: days(a, b),
        clippedStart: s.fromMs < from, clippedEnd: s.toMs > to, current: s.fromMs <= atMs && atMs < s.toMs,
        kind, pairedHouse: paired, pairedHouses, byPlanet: [], exempt: [], nodePair: null, moon: null, coveredDays: 0,
      };
      if (pairedHouses.length) {
        const targets = pairedHouses.map(signOfHouse);
        const counted = [];
        for (const o of PLANETS) {
          if (o === p) continue;
          const iv = targets.flatMap((t) => overlaps(stays[o], t, a, b)).sort((x, y) => x[0] - y[0]);
          if (!iv.length) continue;
          const st = statusOf(method, p, o, kind);
          if (st === 'EXEMPT') { out.exempt.push({ planet: o, planetTa: PLANET_TA[o], windows: describe(iv) }); continue; }
          if (st === 'NODE_PAIR') { out.nodePair = { planet: o, planetTa: PLANET_TA[o], days: unionDays(iv) }; continue; }
          if (o === 'Moon') { out.moon = { count: iv.length, days: unionDays(iv) }; continue; }
          out.byPlanet.push({ planet: o, planetTa: PLANET_TA[o], windows: describe(iv), days: unionDays(iv) });
          counted.push(...iv);
        }
        out.coveredDays = unionDays(counted);
      }
      return out;
    });

    // The present.
    const sign = Math.floor(longitudeOf(p, atMs, ayanamsha, nodeType) / 30) % 12;
    const house = houseFromMoon(sign, moonRasiIndex);
    const { kind, paired, pairedHouses } = classify(row, house);
    const targets = new Set(pairedHouses.map(signOfHouse));
    const inPaired = PLANETS
      .filter((o) => o !== p && targets.has(Math.floor(longitudeOf(o, atMs, ayanamsha, nodeType) / 30) % 12))
      .map((o) => ({ planet: o, planetTa: PLANET_TA[o], status: statusOf(method, p, o, kind) }));
    planets[p] = {
      planet: p, planetTa: PLANET_TA[p],
      span: { fromUtc: iso(atMs - SPAN[p][0]), toUtc: iso(atMs + SPAN[p][1]) },
      notCovered: Boolean(row.notCovered),
      good: row.good, vedhaOf: row.vedhaOf, relievedBy: row.relievedBy, unpairedGood: row.unpairedGood,
      now: {
        house, rasi: RASI_TA[sign], kind, pairedHouse: paired, pairedHouses, planetsInPaired: inPaired,
        active: inPaired.some((x) => x.status === 'COUNTS'),
      },
      stays: rows,
    };
  }
  return {
    id: methodId, labelTa: method.labelTa, exemptNoteTa: method.exemptNoteTa, sources: method.sources,
    planets,
  };
}

/**
 * @param moonRasiIndex natal Moon sign 0-11
 * @param atMs          "now"
 */
function gocharaVedha({ moonRasiIndex, atMs = Date.now(), ayanamsha = 'Lahiri', nodeType = 'mean' }) {
  if (!Number.isInteger(moonRasiIndex) || moonRasiIndex < 0 || moonRasiIndex > 11) {
    throw new UnsupportedInputError('moonRasiIndex must be an integer 0-11', 'moonRasiIndex');
  }
  // Each planet's stays are needed over the widest span in which it can stand
  // in another planet's paired house: Saturn's thirty years.
  const fromMs = atMs - Math.max(...Object.values(SPAN).map(([b]) => b));
  const toMs = atMs + Math.max(...Object.values(SPAN).map(([, a]) => a));
  const stays = Object.fromEntries(PLANETS.map((p) => [p, signStays(p, fromMs, toMs, ayanamsha, nodeType)]));

  const methods = {};
  for (const id of V.VEDHA_RANK.computable) {
    methods[id] = vedhaForMethod({ methodId: id, stays, moonRasiIndex, atMs, ayanamsha, nodeType });
  }
  return {
    atUtc: iso(atMs),
    moonRasiIndex, moonRasi: RASI_TA[moonRasiIndex],
    nodeType,
    defaultMethod: V.DEFAULT_VEDHA_METHOD,
    rank: V.VEDHA_RANK,
    methods,
    comparison: {
      differences: V.VEDHA_DIFFERENCES,
      kalaprakasikaTable: V.KALAPRAKASIKA_TABLE,
      kalaprakasika1982Cells: V.KALAPRAKASIKA_1982_CELLS,
      kalaprakasikaSources: V.KALAPRAKASIKA_SOURCES,
      sudamaniSets: V.SUDAMANI_SETS,
      sudamaniVenus: { textTa: V.SUDAMANI_VENUS.textTa, read: V.SUDAMANI_VENUS.verse342Read, source: V.SUDAMANI_VENUS.source },
      sudamaniSources: V.SUDAMANI_SOURCES,
      fatherSonSources: V.FATHER_SON_SOURCES,
    },
    notes: {
      nodePairTa: V.NODE_PAIR_NOTE_TA,
      moonTa: 'சந்திரன் மாதந்தோறும் சுமார் 2¼ நாள் ஒரு ராசியில் இருக்கும் — வேறு கிரகத்தின் இணை இடத்தில் அதன் வருகைகள் எண்ணப்படுகின்றன, பட்டியலிடப்படவில்லை; மொத்தக் கணக்கிலும் இல்லை. "இப்போது" என்பதில் மட்டும் கணக்கில் வரும்.',
      sudamaniTimingTa: V.SATURN_VEDHA_TEXT.sudamaniTiming.textTa,
    },
  };
}

module.exports = { gocharaVedha, vedhaForMethod, classify, SPAN, PLANET_TA };
