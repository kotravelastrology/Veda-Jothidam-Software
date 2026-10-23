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
 * Every method in `VEDHA_RANK.computable` is computed — Pulippani, Santhanam,
 * Phaladeepika (Sastri; the default since 2026-10-10, the owner's decision) and
 * Vishnu Bhaskar, the books whose tables can be read without guessing
 * (`gocharaVedhaTables.js` says why the others are compared but not computed).
 *
 * Who counts as "another planet" follows `saturnVedha.js`: every planet except
 * those the book exempts (father and son; Pulippani's Venus–Sun), with the
 * Moon's short passes counted rather than listed and left out of the totals,
 * and Rahu–Ketu — always opposite — shown but not counted.
 */

const { UnsupportedInputError } = require('../contracts/chartContext');
const { signStays, overlaps, subtract, unionDays } = require('./saturnVedha');
const { houseFromMoon, RASI_TA } = require('./saturnTransit');
const { planetLongitude, nodeLongitude } = require('../ephemeris/siderealPositions');
const V = require('./gocharaVedhaTables');
const P = require('./phaladeepikaGocharaTables');
const { scanKey } = require('./saturnAshtakavarga');
const { phaladeepikaNow, binduCharts, bindusAt, BINDU_META } = require('./phaladeepikaGochara');

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

/** Sampling step for the decanate scan (days): a few samples per decanate. */
const DECANATE_STEP_DAYS = { Moon: 0.1, Sun: 0.5, Venus: 0.5, Mars: 1, Jupiter: 2, Saturn: 2 };
/** Sampling step for the combustion scan (days). */
const COMBUST_STEP_DAYS = { Moon: 0.1, Mercury: 0.5, Venus: 0.5, Mars: 2, Jupiter: 2, Saturn: 2 };

const wrap180 = (d) => ((((d + 180) % 360) + 360) % 360) - 180;

/** Phaladeepika XXVI.32 "mauḍhya": distance from the Sun, retrograde motion, and whether within the orb. */
function combustionAt(planet, ms, ayanamsha, nodeType) {
  const lon = longitudeOf(planet, ms, ayanamsha, nodeType);
  const separation = Math.abs(wrap180(lon - longitudeOf('Sun', ms, ayanamsha, nodeType)));
  const retrograde = wrap180(longitudeOf(planet, ms + 6 * 3600000, ayanamsha, nodeType) - longitudeOf(planet, ms - 6 * 3600000, ayanamsha, nodeType)) < 0;
  const orb = P.combustionOrb(planet, retrograde);
  return { separation: Math.round(separation * 100) / 100, retrograde, orb, combust: orb === null ? null : separation < orb };
}

/**
 * Phaladeepika XXVI.25: the intervals of [a, b] in which `planet` stands in
 * its effective third of `sign`. 'ALL' for Mercury and Rahu, null for Ketu
 * (no verse).
 */
function effectiveWithin(planet, sign, a, b, decanates) {
  if (!(planet in P.DECANATE)) return null;
  if (P.DECANATE[planet] === null) return 'ALL';
  const want = sign * 3 + P.DECANATE[planet];
  return decanates[planet]
    .filter((s) => s.key === want && s.toMs > a && s.fromMs < b)
    .map((s) => ({ fromUtc: iso(Math.max(s.fromMs, a)), toUtc: iso(Math.min(s.toMs, b)), days: days(Math.max(s.fromMs, a), Math.min(s.toMs, b)) }));
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
 * @param natalRasi     the seven planets' and the Lagna's natal signs 0-11, for
 *                      Phaladeepika XXVI.41 (the Ashtakavarga); omitted → not judged
 */
function gocharaVedha({ moonRasiIndex, atMs = Date.now(), ayanamsha = 'Lahiri', nodeType = 'mean', natalRasi }) {
  if (!Number.isInteger(moonRasiIndex) || moonRasiIndex < 0 || moonRasiIndex > 11) {
    throw new UnsupportedInputError('moonRasiIndex must be an integer 0-11', 'moonRasiIndex');
  }
  // Each planet's stays are needed over the widest span in which it can stand
  // in another planet's paired house: Saturn's thirty years.
  const fromMs = atMs - Math.max(...Object.values(SPAN).map(([b]) => b));
  const toMs = atMs + Math.max(...Object.values(SPAN).map(([, a]) => a));
  const stays = Object.fromEntries(PLANETS.map((p) => [p, signStays(p, fromMs, toMs, ayanamsha, nodeType)]));
  // Phaladeepika XXVI.25: each timed planet's thirds of signs over its own span.
  const decanates = Object.fromEntries(Object.keys(DECANATE_STEP_DAYS).map((p) => [p, scanKey(
    atMs - SPAN[p][0], atMs + SPAN[p][1],
    (ms) => Math.floor((((longitudeOf(p, ms, ayanamsha, nodeType) % 360) + 360) % 360) / 10) % 36,
    DECANATE_STEP_DAYS[p] * DAY_MS,
  )]));

  // Verse 32: each planet's combust spells over its own span. Motion is looked at only where the orb depends on it (Mercury, Venus).
  const combustKey = (p) => (Array.isArray(P.COMBUSTION_DEGREES[p])
    ? (ms) => (combustionAt(p, ms, ayanamsha, nodeType).combust ? 1 : 0)
    : (ms) => (Math.abs(wrap180(longitudeOf(p, ms, ayanamsha, nodeType) - longitudeOf('Sun', ms, ayanamsha, nodeType))) < P.combustionOrb(p, false) ? 1 : 0));
  const combustion = Object.fromEntries(Object.keys(COMBUST_STEP_DAYS).map((p) => [p, scanKey(
    atMs - SPAN[p][0], atMs + SPAN[p][1], combustKey(p), COMBUST_STEP_DAYS[p] * DAY_MS,
  )]));

  const methods = {};
  for (const id of V.VEDHA_RANK.computable) {
    methods[id] = vedhaForMethod({ methodId: id, stays, moonRasiIndex, atMs, ayanamsha, nodeType });
  }

  // Phaladeepika XXVI, once per planet (the stays are the same under every table, in the same order):
  // house results (9-24), the effective third (25), verse 33, and verses 31-32 judged by verse 2's good houses.
  const pdGood = (p, house) => V.VEDHA_METHODS.PHALADEEPIKA_SASTRI.table[p].good.includes(house);
  const within = (segs, key, a, b) => segs
    .filter((s) => s.key === key && s.toMs > a && s.fromMs < b)
    .map((s) => ({ fromUtc: iso(Math.max(s.fromMs, a)), toUtc: iso(Math.min(s.toMs, b)), days: days(Math.max(s.fromMs, a), Math.min(s.toMs, b)) }));
  const verse33 = P.RULES.find((x) => x.id === 'DANGER_12_8_1');

  // Verse 30: full aspects (II.23) on a stay, by aspecting planet, with its nature (II.27) and enmity.
  const mergeIv = (ivs) => {
    const out = [];
    for (const [a, b] of [...ivs].sort((x, y) => x[0] - y[0])) {
      if (out.length && a <= out[out.length - 1][1]) out[out.length - 1][1] = Math.max(out[out.length - 1][1], b);
      else out.push([a, b]);
    }
    return out;
  };
  const intersect = (A, B) => mergeIv(A.flatMap(([a, b]) => B.map(([c, d]) => [Math.max(a, c), Math.min(b, d)]).filter(([x, y]) => y > x)));
  const fromSigns = (o, S) => P.aspectsOf(o).full.map((k) => (((S - (k - 1)) % 12) + 12) % 12);
  const ASPECTORS = ['Sun', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  const aspectsWithin = (p, S, a, b, goodHouse) => {
    const by = [];
    for (const o of ASPECTORS) {
      if (o === p) continue;
      const enemy = P.NATURAL_ENEMIES[p].includes(o);
      const push = (nature, ivs) => {
        if (!ivs.length) return;
        by.push({ planet: o, planetTa: PLANET_TA[o], nature, enemy, windows: describe(ivs), ...P.verse30Effect({ nature, enemy }, goodHouse) });
      };
      if (o === 'Mercury') {
        // Mercury is malefic while a malefic shares his sign (II.27).
        const mal = []; const ben = [];
        for (const T of fromSigns(o, S)) {
          const iv = overlaps(stays.Mercury, T, a, b);
          if (!iv.length) continue;
          const company = mergeIv(P.MALEFIC_FIXED.flatMap((m) => overlaps(stays[m], T, a, b)));
          mal.push(...intersect(iv, company));
          ben.push(...subtract(iv, company));
        }
        push('MALEFIC', mergeIv(mal));
        push('BENEFIC', mergeIv(ben));
        continue;
      }
      push(P.MALEFIC_FIXED.includes(o) ? 'MALEFIC' : 'BENEFIC', mergeIv(fromSigns(o, S).flatMap((T) => overlaps(stays[o], T, a, b))));
    }
    return { by, moonPasses: p === 'Moon' ? 0 : overlaps(stays.Moon, (S + 6) % 12, a, b).length };
  };

  // Verse 41: the natal Ashtakavarga under both tables of places.
  const bindus = natalRasi ? binduCharts(natalRasi) : null;

  // The present, shared with the report (`phaladeepikaGochara.js`).
  const pdNow = phaladeepikaNow({
    moonRasiIndex, bindus: bindus ?? undefined,
    lon: Object.fromEntries(PLANETS.map((o) => [o, longitudeOf(o, atMs, ayanamsha, nodeType)])),
    retrograde: Object.fromEntries(PLANETS.map((o) => [o, combustionAt(o, atMs, ayanamsha, nodeType).retrograde])),
  });

  const pdPlanets = Object.fromEntries(PLANETS.map((p) => {
    const from = atMs - SPAN[p][0];
    const to = atMs + SPAN[p][1];
    const pdStays = stays[p].filter((s) => s.toMs > from && s.fromMs < to).map((s) => {
      const a = Math.max(s.fromMs, from);
      const b = Math.min(s.toMs, to);
      const house = houseFromMoon(s.sign, moonRasiIndex);
      const dignity = P.dignityOf(p, s.sign);
      return {
        fromUtc: iso(a), toUtc: iso(b), house,
        resultTa: P.HOUSE_RESULTS[p]?.[house - 1] ?? null,
        effective: effectiveWithin(p, s.sign, a, b, decanates),
        dangerVerse33: verse33.planets.includes(p) && verse33.houses.includes(house),
        dignity, goodHouse: pdGood(p, house),
        bySign: P.verses31and32(dignity, undefined, pdGood(p, house)),
        combust: combustion[p] ? within(combustion[p], 1, a, b) : null,
        aspects: aspectsWithin(p, s.sign, a, b, pdGood(p, house)),
        bindus: bindus ? bindusAt(bindus, p, s.sign) : null,
      };
    });
    return [p, { stays: pdStays, now: pdNow.planets[p] }];
  }));

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
    phaladeepika: {
      planets: pdPlanets,
      houseResultsSources: P.HOUSE_RESULTS_SOURCES, verseOf: P.VERSE_OF, ketuNoteTa: P.KETU_NOTE_TA,
      decanate: P.DECANATE, decanateTa: P.DECANATE_TA, decanateSources: P.DECANATE_SOURCES, decanateWords: P.DECANATE_WORDS,
      rules: P.RULES,
      dignitySources: P.DIGNITY_SOURCES, dignityReadingsTa: P.DIGNITY_READINGS_TA, combustionDegrees: P.COMBUSTION_DEGREES,
      aspectSources: P.ASPECT_SOURCES, aspectReadingsTa: P.ASPECT_READINGS_TA,
      moonNow: pdNow.moonNow, mercuryNow: pdNow.mercuryNow, verse34Now: pdNow.verse34Now,
      bindu: bindus ? {
        ...BINDU_META,
        tableSources: Object.fromEntries(P.BINDU_TABLES.order.map((id) => [id, P.BINDU_TABLES[id].sources])),
        readingTexts: Object.fromEntries(P.BINDU_READINGS.order.map((id) => [id, { textTa: P.BINDU_READINGS[id].textTa, sources: P.BINDU_READINGS[id].sources }])),
        resultsTa: P.BINDU_RESULTS_TA, resultsSource: P.BINDU_RESULTS_SOURCE,
        fourNote: P.BINDU_FOUR_NOTE, survey: P.BINDU_SURVEY, surveySources: P.BINDU_SURVEY_SOURCES, notesTa: P.BINDU_NOTES_TA,
        sav: Object.fromEntries(Object.entries(bindus).map(([id, c]) => [id, c.sav])),
      } : null,
    },
  };
}

module.exports = { gocharaVedha, vedhaForMethod, classify, effectiveWithin, combustionAt, SPAN, PLANET_TA };
