/**
 * VJ-028 — research predicates and saved cohorts.
 *
 * Acceptance: filter replay yields same members; sample counts; cancellable
 * query.
 *
 * The replay half is the one worth attention. "Same members" is easy to assert
 * weakly — run twice, compare counts — and that would pass even if the cohort
 * had quietly swapped one chart for another. So replay is checked on the
 * signature, which covers the predicate, the settings and every member's
 * revision; and the test then proves the signature actually moves when the
 * underlying data does, so a stable signature means something.
 */
const assert = require('node:assert/strict');

const { openLibrary } = require('./src/library/chartRepository');
const {
  assertPredicate, evaluate, describePredicate, canonicalisePredicate, MAX_DEPTH,
} = require('./src/research/predicates');
const { runCohort, chartFacts, predicateHash, QueryCancelled } = require('./src/research/cohort');
const { createChartContext } = require('./src/contracts/chartContext');
const { calculateParashariChart } = require('./src/chart/parashariChart');

const SETTINGS = { ayanamsha: 'Lahiri', houseSystem: 'Porphyrius', nodeType: 'mean' };
const RAMAN = { ...SETTINGS, ayanamsha: 'Raman' };

const base = { ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330 };
const PEOPLE = [
  { name: 'A', year: 1990, month: 5, day: 15, hour: 10, minute: 30, latitude: 13.0827, longitude: 80.2707, placeName: 'சென்னை' },
  { name: 'B', year: 1988, month: 11, day: 3, hour: 6, minute: 5, latitude: 9.9252, longitude: 78.1198, placeName: 'மதுரை' },
  { name: 'C', year: 1975, month: 2, day: 20, hour: 22, minute: 45, latitude: 11.0168, longitude: 76.9558, placeName: 'கோயம்புத்தூர்' },
  { name: 'D', year: 2001, month: 7, day: 9, hour: 14, minute: 0, latitude: 8.0883, longitude: 77.5385, placeName: 'நாகர்கோவில்' },
  { name: 'E', year: 1996, month: 9, day: 28, hour: 3, minute: 15, latitude: 10.7905, longitude: 78.7047, placeName: 'திருச்சி' },
];

function seed() {
  const library = openLibrary(':memory:');
  const ids = [];
  for (const p of PEOPLE) {
    const { name, ...rest } = p;
    ids.push(library.saveProfile({
      name, placeName: p.placeName,
      input: { ...base, ...rest },
      settings: { ...SETTINGS, calendarMode: 'tirukanita' },
    }));
  }
  return { library, ids };
}

// ------------------------------------------------ predicate validation --

assert.throws(() => assertPredicate(null), /must be an object/);
assert.throws(() => assertPredicate({ kind: 'nope' }), /unknown predicate kind/);
assert.throws(() => assertPredicate({ kind: 'grahaInHouse', graha: 'Pluto', house: 1 }), /unknown graha/);
assert.throws(() => assertPredicate({ kind: 'grahaInHouse', graha: 'Mars', house: 13 }), /house must be 1-12/);
assert.throws(() => assertPredicate({ kind: 'grahaInHouse', graha: 'Mars' }), /requires house/);
assert.throws(() => assertPredicate({ kind: 'lagnaRasi', rasi: 12 }), /rasi must be 0-11/);
assert.throws(() => assertPredicate({ kind: 'conjunct', grahas: ['Mars'] }), /exactly two/);
assert.throws(() => assertPredicate({ kind: 'conjunct', grahas: ['Mars', 'Mars'] }), /not conjunct itself/);
assert.throws(() => assertPredicate({ kind: 'and', of: [] }), /at least one operand/);

// A typo in a field name must not be ignored — it would silently widen the
// cohort and the run would still look successful.
assert.throws(
  () => assertPredicate({ kind: 'grahaInHouse', graha: 'Mars', house: 7, houze: 8 }),
  /unexpected field houze/,
);

// Depth is bounded, so a pathological saved cohort cannot blow the stack.
let deep = { kind: 'lagnaRasi', rasi: 0 };
for (let i = 0; i <= MAX_DEPTH + 1; i += 1) deep = { kind: 'not', of: deep };
assert.throws(() => assertPredicate(deep), /nested deeper than/);

// There is no retrograde predicate, because the engine computes no retrograde
// flag. A cohort built on a guessed fact would mean nothing.
assert.throws(() => assertPredicate({ kind: 'grahaRetrograde', graha: 'Mars' }), /unknown predicate kind/);

// ------------------------------------------------------ evaluation ------

const ctx = createChartContext({ ...base, ...PEOPLE[0], ...SETTINGS, calendarMode: 'tirukanita' });
const facts = chartFacts(calculateParashariChart(ctx));

assert.equal(Object.keys(facts.grahas).length, 9);
assert.equal(facts.sarva.reduce((a, b) => a + b, 0), 337, 'the sarva row foots to the classical total');
assert.ok(facts.lagna.nakshatraIndex >= 0 && facts.lagna.nakshatraIndex <= 26);

const moonHouse = facts.grahas.Moon.house;
assert.equal(evaluate({ kind: 'grahaInHouse', graha: 'Moon', house: moonHouse }, facts), true);
assert.equal(evaluate({ kind: 'grahaInHouse', graha: 'Moon', house: (moonHouse % 12) + 1 }, facts), false);
assert.equal(evaluate({ kind: 'not', of: { kind: 'grahaInHouse', graha: 'Moon', house: moonHouse } }, facts), false);
assert.equal(evaluate({
  kind: 'or',
  of: [
    { kind: 'grahaInHouse', graha: 'Moon', house: (moonHouse % 12) + 1 },
    { kind: 'grahaInHouse', graha: 'Moon', house: moonHouse },
  ],
}, facts), true);

// ---------------------------------------------------- Tamil description --

const readable = { kind: 'and', of: [
  { kind: 'grahaInHouse', graha: 'Mars', house: 7 },
  { kind: 'lagnaRasi', rasi: 0 },
] };
const described = describePredicate(readable);
assert.match(described, /செவ்வாய்/);
assert.match(described, /மேஷம்/);
assert.match(described, /மற்றும்/);

// ------------------------------------------- hash is order-independent --

assert.equal(
  predicateHash({ kind: 'grahaInHouse', graha: 'Mars', house: 7 }),
  predicateHash({ house: 7, graha: 'Mars', kind: 'grahaInHouse' }),
  'two predicates that differ only in field order are one cohort',
);
assert.notEqual(
  predicateHash({ kind: 'grahaInHouse', graha: 'Mars', house: 7 }),
  predicateHash({ kind: 'grahaInHouse', graha: 'Mars', house: 8 }),
);
assert.deepEqual(
  Object.keys(canonicalisePredicate({ kind: 'x', b: 1, a: 2 })),
  ['a', 'b', 'kind'],
);

// ---------------------------------------------------------- the run ----

(async () => {
  const { library } = seed();

  // Settings are required: a cohort computed under each profile's own
  // settings would compare conventions rather than charts.
  await assert.rejects(
    () => runCohort({ library, predicate: { kind: 'lagnaRasi', rasi: 0 } }),
    /settings with ayanamsha/,
  );

  // Something every chart satisfies, so the counts are known exactly.
  const everyone = { kind: 'or', of: Array.from({ length: 12 }, (_, r) => ({ kind: 'lagnaRasi', rasi: r })) };
  const all = await runCohort({ library, predicate: everyone, settings: SETTINGS });

  assert.equal(all.counts.total, PEOPLE.length);
  assert.equal(all.counts.examined, PEOPLE.length);
  assert.equal(all.counts.matched, PEOPLE.length);
  assert.equal(all.counts.unmatched, 0);
  assert.equal(all.counts.failed, 0);
  assert.equal(all.counts.rate, 1);
  assert.equal(all.counts.settingsMismatched, 0, 'seeded under the cohort settings');

  // Nobody satisfies this, and the counts must say so without failing.
  const nobody = { kind: 'and', of: [
    { kind: 'lagnaRasi', rasi: 0 }, { kind: 'not', of: { kind: 'lagnaRasi', rasi: 0 } },
  ] };
  const none = await runCohort({ library, predicate: nobody, settings: SETTINGS });
  assert.equal(none.counts.matched, 0);
  assert.equal(none.counts.unmatched, PEOPLE.length);
  assert.equal(none.counts.failed, 0);
  assert.equal(none.counts.rate, 0);
  assert.deepEqual(none.members, []);

  // ------------------------------------------------ replay determinism --

  const again = await runCohort({ library, predicate: everyone, settings: SETTINGS });
  assert.equal(again.signature, all.signature, 'the same cohort over the same data replays identically');
  assert.deepEqual(
    again.members.map((m) => `${m.profileId}@${m.revision}`),
    all.members.map((m) => `${m.profileId}@${m.revision}`),
  );

  // Members are sorted by profile id, so library ordering cannot move the hash.
  const sorted = [...all.members].sort((a, b) => a.profileId.localeCompare(b.profileId));
  assert.deepEqual(all.members.map((m) => m.profileId), sorted.map((m) => m.profileId));

  // ...and the signature is not merely constant: correcting a birth time bumps
  // a revision, and that revision is part of it. A cohort that changed
  // silently would be worse than one that changed.
  const first = all.members[0];
  library.updateProfile(first.profileId, { input: { ...PEOPLE[0], ...base, minute: 31 } });
  const afterEdit = await runCohort({ library, predicate: everyone, settings: SETTINGS });
  assert.equal(afterEdit.counts.matched, PEOPLE.length);
  assert.notEqual(afterEdit.signature, all.signature,
    'a rectified birth time must move the signature, not hide in it');

  // A different ayanamsha is a different cohort even with the same members.
  const raman = await runCohort({ library, predicate: everyone, settings: RAMAN });
  assert.notEqual(raman.signature, afterEdit.signature);
  assert.equal(raman.counts.settingsMismatched, PEOPLE.length,
    'every member was saved under Lahiri, so each is flagged');
  assert.ok(raman.members.every((m) => m.settingsMatchProfile === false));

  // ------------------------------------------- failures are not misses --

  // A profile whose chart cannot be cast is reported, never counted as a
  // non-match: "no Mars in the 7th" and "we could not cast this" are different
  // answers and a sample count must not merge them.
  const broken = library.saveProfile({
    name: 'broken', placeName: 'x',
    input: { ...base, year: 1990, month: 5, day: 15, hour: 10, minute: 30, latitude: 999, longitude: 80 },
    settings: { ...SETTINGS, calendarMode: 'tirukanita' },
  });
  assert.ok(broken.profileId);
  const withBroken = await runCohort({ library, predicate: everyone, settings: SETTINGS });
  assert.equal(withBroken.counts.total, PEOPLE.length + 1);
  assert.equal(withBroken.counts.failed, 1, 'the uncastable chart is a failure, not a non-match');
  assert.equal(withBroken.counts.matched, PEOPLE.length);
  assert.equal(withBroken.counts.unmatched, 0);
  assert.equal(withBroken.failures.length, 1);
  assert.ok(withBroken.failures[0].reason);
  library.deleteProfile(broken.profileId);

  // ------------------------------------------------------ cancellation --

  const controller = new AbortController();
  controller.abort();
  await assert.rejects(
    () => runCohort({ library, predicate: everyone, settings: SETTINGS, signal: controller.signal }),
    (e) => {
      assert.ok(e instanceof QueryCancelled);
      assert.equal(e.examined, 0, 'an abort before the first profile stops before any work');
      assert.ok(e.total >= PEOPLE.length);
      return true;
    },
  );

  // Aborting partway reports how far it got.
  const mid = new AbortController();
  let seen = 0;
  await assert.rejects(
    () => runCohort({
      library, predicate: everyone, settings: SETTINGS, signal: mid.signal,
      yieldEvery: 1,
      onProgress: ({ examined }) => { seen = examined; if (examined >= 2) mid.abort(); },
    }),
    (e) => {
      assert.ok(e instanceof QueryCancelled);
      assert.ok(e.examined >= 2 && e.examined < e.total, `stopped at ${e.examined} of ${e.total}`);
      return true;
    },
  );
  assert.ok(seen >= 2);

  // ------------------------------------------------------- persistence --

  const saved = library.saveCohort('coh-1', {
    name: 'எல்லா லக்னமும்',
    predicate: everyone,
    predicateHash: all.predicateHash,
    settings: SETTINGS,
  });
  assert.equal(saved.cohortId, 'coh-1');

  library.recordCohortRun('coh-1', { signature: all.signature, counts: all.counts });
  const read = library.getCohort('coh-1');
  assert.equal(read.name, 'எல்லா லக்னமும்');
  assert.deepEqual(read.predicate, everyone);
  assert.equal(read.lastSignature, all.signature);
  assert.equal(read.lastCounts.matched, PEOPLE.length);
  assert.ok(read.lastRunAt);

  // A cohort stores the question, not the answer — no member list is frozen
  // into it, or a saved question would become a stale answer.
  assert.ok(!('members' in read));

  assert.equal(library.listCohorts().length, 1);
  assert.throws(() => library.recordCohortRun('missing', { signature: 'x', counts: {} }), /no cohort/);
  assert.throws(() => library.saveCohort('c2', { predicate: everyone, predicateHash: 'h', settings: SETTINGS }), /needs a name/);

  // Re-saving the same id updates rather than duplicating.
  library.saveCohort('coh-1', {
    name: 'மறுபெயர்', predicate: everyone, predicateHash: all.predicateHash, settings: SETTINGS,
  });
  assert.equal(library.listCohorts().length, 1);
  assert.equal(library.getCohort('coh-1').name, 'மறுபெயர்');

  assert.equal(library.deleteCohort('coh-1').deleted, 1);
  assert.equal(library.getCohort('coh-1'), null);

  library.close();

  console.log(JSON.stringify({
    pass: true,
    profiles: PEOPLE.length,
    signature: all.signature,
    replayStable: again.signature === all.signature,
    signatureMovedOnEdit: afterEdit.signature !== all.signature,
    counts: withBroken.counts,
    description: described,
  }, null, 2));
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
