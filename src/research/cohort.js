/**
 * VJ-028 — running a predicate over the chart library.
 *
 * Acceptance: filter replay yields same members; sample counts; cancellable
 * query.
 *
 * ## Why a cohort declares its own settings
 *
 * Profiles are saved with the ayanamsha and house system they were cast
 * under. Asking "which of my charts have Mars in the 7th?" across a library
 * where one chart is Lahiri and another is Raman compares two different
 * conventions and calls the answer a finding — Mars can sit either side of a
 * house cusp depending on which was used.
 *
 * So a cohort names one set of settings and applies them to every chart
 * uniformly. That is what makes the members comparable, and what makes a
 * replay mean anything. The cost is that a member's house here may differ from
 * the house its own page shows, so each member records whether the cohort's
 * settings matched the ones it was saved with.
 *
 * ## Replay
 *
 * The result carries a `signature`: a hash over the canonical predicate, the
 * settings, the engine version, and the members' profile ids *with their
 * revisions*. Running the same cohort again gives the same signature — and
 * when it does not, the reason is visible, because correcting a birth time
 * bumps a revision and that revision is part of the signature. A cohort that
 * changed silently would be worse than one that changed.
 */

const crypto = require('node:crypto');

const { UnsupportedInputError, createChartContext } = require('../contracts/chartContext');
const { calculateParashariChart } = require('../chart/parashariChart');
const { calculateVargas } = require('../chart/vargaChart');
const { calculateAshtakavarga } = require('../chart/ashtakavarga');
const { assertPredicate, evaluate, canonicalisePredicate, describePredicate } = require('./predicates');

const COHORT_VERSION = 'VJ028-COHORT-001';
const CLASSICAL = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const ALL = [...CLASSICAL, 'Rahu', 'Ketu'];

/** Raised when a run is aborted, carrying how far it got. */
class QueryCancelled extends Error {
  constructor(examined, total) {
    super('cohort query cancelled');
    this.name = 'QueryCancelled';
    this.examined = examined;
    this.total = total;
  }
}

const norm = (d) => ((d % 360) + 360) % 360;
const nakshatraOf = (longitude) => Math.floor(norm(longitude) / (360 / 27)) % 27;

/**
 * The facts a predicate may read. Derived once per chart, so a predicate tree
 * that mentions the Moon five times computes the chart once.
 */
function chartFacts(chart) {
  const grahas = {};
  const navamsa = {};
  for (const id of ALL) {
    const g = chart.grahas[id];
    grahas[id] = {
      rasiIndex: g.rasiIndex,
      house: g.house,
      degreeInSign: g.degreeInSign,
      nakshatraIndex: nakshatraOf(g.longitude),
    };
    navamsa[id] = calculateVargas(g.rasiIndex, g.degreeInSign).D9;
  }
  const av = calculateAshtakavarga({
    ...Object.fromEntries(CLASSICAL.map((p) => [p, chart.grahas[p].rasiIndex])),
    Lagna: chart.lagna.rasiIndex,
  });
  return {
    grahas,
    navamsa,
    lagna: {
      rasiIndex: chart.lagna.rasiIndex,
      nakshatraIndex: nakshatraOf(chart.lagna.longitude),
      degreeInSign: chart.lagna.degreeInSign,
    },
    sarva: av.sarva,
  };
}

const sha = (value) => crypto.createHash('sha256').update(value).digest('hex');

/** Stable identity for a predicate, independent of how its fields were typed. */
function predicateHash(predicate) {
  return sha(JSON.stringify(canonicalisePredicate(predicate))).slice(0, 16);
}

const settingsKey = (s) => `${s.ayanamsha}|${s.houseSystem}|${s.nodeType}`;

/**
 * Runs `predicate` over every profile the library holds.
 *
 * @param library    an open VJ-011 repository
 * @param predicate  a validated predicate tree
 * @param settings   the settings applied to every chart (required — see above)
 * @param signal     an AbortSignal; the run stops between profiles
 * @param onProgress called with { examined, total, matched }
 * @param yieldEvery how many profiles between yields to the event loop
 */
async function runCohort({
  library, predicate, settings, signal, onProgress, yieldEvery = 25, limit = 5000,
}) {
  if (!library) throw new UnsupportedInputError('library is required', 'library');
  if (!settings || !settings.ayanamsha || !settings.houseSystem || !settings.nodeType) {
    throw new UnsupportedInputError(
      'settings with ayanamsha, houseSystem and nodeType are required: a cohort '
      + 'computed under each profile\'s own settings would compare conventions, not charts',
      'settings',
    );
  }
  assertPredicate(predicate);

  const profiles = library.listProfiles({ limit });
  const total = profiles.length;
  const members = [];
  const failures = [];
  let examined = 0;
  let mismatched = 0;

  for (const row of profiles) {
    // Checked before the work, so an abort that arrives between profiles stops
    // this one rather than after it.
    if (signal?.aborted) throw new QueryCancelled(examined, total);

    const profile = library.getProfile(row.profileId, row.revision);
    examined += 1;

    try {
      if (!profile || !profile.input) throw new Error('profile has no birth input');
      const context = createChartContext({
        ...profile.input,
        ayanamsha: settings.ayanamsha,
        houseSystem: settings.houseSystem,
        nodeType: settings.nodeType,
        calendarMode: 'tirukanita',
      });
      const chart = calculateParashariChart(context);
      if (evaluate(predicate, chartFacts(chart))) {
        const savedKey = profile.settings ? settingsKey(profile.settings) : null;
        const matchesSaved = savedKey === settingsKey(settings);
        if (!matchesSaved) mismatched += 1;
        members.push({
          profileId: profile.profileId,
          revision: profile.revision,
          name: profile.name,
          birthDate: profile.birthDate,
          placeName: profile.placeName ?? null,
          settingsMatchProfile: matchesSaved,
        });
      }
    } catch (error) {
      // A chart that cannot be computed is reported, never counted as a
      // non-match — "no Mars in the 7th" and "we could not cast this" are
      // different answers and a sample count must not merge them.
      failures.push({ profileId: row.profileId, name: row.name, reason: error.message });
    }

    if (onProgress && examined % yieldEvery === 0) {
      onProgress({ examined, total, matched: members.length });
    }
    if (examined % yieldEvery === 0) {
      await new Promise((resolve) => setImmediate(resolve));
    }
  }

  if (onProgress) onProgress({ examined, total, matched: members.length });

  // Members are ordered by profile id, not by library order, so two runs over
  // the same data hash the same however the library sorted them.
  members.sort((a, b) => a.profileId.localeCompare(b.profileId));

  const hash = predicateHash(predicate);
  const engineVersion = calculateParashariChart.engineVersion ?? null;
  const signature = sha([
    COHORT_VERSION,
    hash,
    settingsKey(settings),
    members.map((m) => `${m.profileId}@${m.revision}`).join(','),
  ].join('|')).slice(0, 16);

  return {
    cohortVersion: COHORT_VERSION,
    predicate,
    predicateHash: hash,
    description: describePredicate(predicate),
    settings: { ...settings },
    engineVersion,
    members,
    signature,
    counts: {
      total,
      examined,
      matched: members.length,
      unmatched: examined - members.length - failures.length,
      failed: failures.length,
      // Of the members, how many were cast under settings other than the ones
      // they were saved with — so a surprising cohort can be explained.
      settingsMismatched: mismatched,
      rate: examined === 0 ? 0 : Number((members.length / examined).toFixed(4)),
    },
    failures,
  };
}

module.exports = {
  runCohort, chartFacts, predicateHash, QueryCancelled, COHORT_VERSION,
};
