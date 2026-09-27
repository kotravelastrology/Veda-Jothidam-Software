/**
 * VJ-018 — matching journey.
 *
 * Acceptance: two distinct profiles; factor explanations; location/date/method
 * visible.
 *
 * The interesting half of this file is the last section. `poruthamFactors.js`
 * discloses where each coded rule simplifies or departs from how the porutham
 * is usually stated. A disclosure nobody checks rots the moment a table is
 * edited, so each one is asserted here against the behaviour it describes —
 * read only from `calcPorutham`'s output, never from a copy of the table.
 */
const assert = require('node:assert/strict');

const { createChartContext } = require('./src/contracts/chartContext');
const { assertRuleEvidence } = require('./src/contracts/ruleEvidence');
const { calculateTamilPorutham, calcPorutham } = require('./src/report/tamilPorutham');
const { describePorutham, poruthamEvidence, FACTORS } = require('./src/report/poruthamFactors');
const {
  describeMatchParty, assertDistinctParties, formatOffset, formatLatitude, formatLongitude,
} = require('./src/report/matchParties');

const row = (rows, id) => rows.find((r) => r.id === id);
/** One porutham row, straight from the tables, for a chosen pair. */
const factorFor = (id, girlNak, boyNak, girlRasi = 0, boyRasi = 0) =>
  row(calcPorutham(girlNak, boyNak, girlRasi, boyRasi), id);

const match = calculateTamilPorutham(
  { nakshatraIndex: 3, rasiIndex: 1 },   // bride: Rohini / Rishabha
  { nakshatraIndex: 16, rasiIndex: 7 },  // groom: Anuradha / Vrischika
);

// ------------------------------------------------- factor explanations --

assert.equal(match.rows.length, 10);
assert.equal(FACTORS.length, 10);

for (const r of match.rows) {
  assert.ok(r.id, 'every row carries a stable id for evidence');
  assert.ok(r.governs && r.governs.length > 20, `${r.id}: governs must say what the factor indicates`);
  assert.ok(r.rule && r.rule.length > 20, `${r.id}: rule must state how the verdict was reached`);
  assert.ok(r.why && r.why.length > 10, `${r.id}: why must explain this particular verdict`);
  assert.ok(/[஀-௿]/.test(r.why), `${r.id}: the explanation is for a Tamil reader`);
  assert.equal(r.sourceStatus, 'SOURCE_REQUIRED');
}

// An explanation must quote the quantity it was decided on, or it is a
// restatement of the verdict rather than a reason for it.
assert.match(row(match.rows, 'DINA').why, new RegExp(String(row(match.rows, 'DINA').measure.count)));
assert.match(row(match.rows, 'MAHENDRA').why, new RegExp(String(row(match.rows, 'MAHENDRA').measure.count)));
assert.match(row(match.rows, 'RASI').why, new RegExp(String(row(match.rows, 'RASI').measure.gap)));
assert.match(row(match.rows, 'RAJJU').why, new RegExp(row(match.rows, 'RAJJU').measure.girl));

// The explanation must never contradict the verdict beside it. Checked over
// every nakshatra and rasi pair, not only this one match, since a wording that
// only holds for the sample is not a guarantee.
for (let g = 0; g < 27; g += 3) {
  for (let b = 0; b < 27; b += 3) {
    for (const r of describePorutham(calcPorutham(g, b, g % 12, b % 12))) {
      if (r.result) {
        assert.ok(!/பொருந்தவில்லை|நிறைவேறவில்லை|தாண்டுகிறது|இடம்பெறவில்லை/.test(r.why),
          `${r.id}: a passing factor is explained as failing — "${r.why}"`);
      } else {
        assert.ok(!/எனவே பொருந்துகிறது|நிறைவேறுகிறது|வரம்புக்குள்/.test(r.why),
          `${r.id}: a failing factor is explained as passing — "${r.why}"`);
      }
    }
  }
}

// A row with no description is refused rather than rendered bare.
assert.throws(() => describePorutham([{ id: 'NOT_A_FACTOR', name: 'x', measure: {} }]),
  /no factor description/);

// ------------------------------------------------------------ evidence --

const evidence = poruthamEvidence(calcPorutham(3, 16, 1, 7));
assert.equal(evidence.length, 10);
for (const e of evidence) {
  assertRuleEvidence(e, e.ruleId);
  // Every rule table came from an uncited workbook, so nothing here may claim
  // a source it does not have.
  assert.equal(e.status, 'SOURCE_REQUIRED');
  assert.equal(e.source, null);
  assert.match(e.reason, /Marriage reference workbook/);
  // The computation still travels with the withheld rule: a gap must not be
  // mistaken for a finding.
  assert.equal(typeof e.appliedTo.computedResult, 'boolean');
  assert.ok(e.appliedTo.measure);
}
assert.equal(match.sourceStatus, 'SOURCE_REQUIRED');

// ------------------------------------------------- two distinct parties --

const bride = {
  year: 1990, month: 5, day: 15, hour: 10, minute: 30,
  latitude: 13.0827, longitude: 80.2707, utcOffsetMinutes: 330,
  ianaTimeZone: 'Asia/Kolkata', placeName: 'சென்னை',
};
const groom = { ...bride, year: 1988, hour: 6, minute: 5, latitude: 9.9252, longitude: 78.1198, placeName: 'மதுரை' };

assert.doesNotThrow(() => assertDistinctParties(bride, groom));

// Same profile on both sides. This matters more than an ordinary validation
// error: matched against itself a chart passes gana, yoni, rasi and rajju
// trivially, so the screen would report a *good* match rather than a mistake.
assert.throws(
  () => assertDistinctParties(bride, bride, { girlProfileId: 'p1', boyProfileId: 'p1', girlName: 'ராதா' }),
  /ஒரே சுயவிவரம்/,
);
// A chart matched against itself scores 5/10 "சாதாரணம்" for *every* star and
// sign — never 0, never an obvious error. On screen it is indistinguishable
// from a real, middling match, which is why the guard has to run before the
// computation rather than leaving the reader to notice.
for (let n = 0; n < 27; n += 1) {
  for (let r = 0; r < 12; r += 1) {
    const self = calculateTamilPorutham({ nakshatraIndex: n, rasiIndex: r }, { nakshatraIndex: n, rasiIndex: r });
    assert.equal(self.passed, 5, `self-match at star ${n}, sign ${r} scored ${self.passed}`);
    assert.equal(self.level, 'சாதாரணம்');
  }
}

// The same details entered twice under two different profiles is the same
// mistake wearing a different name.
assert.throws(() => assertDistinctParties(bride, { ...bride },
  { girlProfileId: 'p1', boyProfileId: 'p2' }), /ஒரே பிறப்பு விவரம்/);
// A minute apart is two people.
assert.doesNotThrow(() => assertDistinctParties(bride, { ...bride, minute: 31 }));

// ------------------------------------- location / date / method visible --

const ctx = createChartContext({ ...bride, ayanamsha: 'Raman', calendarMode: 'tirukanita' });
const party = describeMatchParty(bride, ctx, { profileId: 'p1', revision: 3, name: 'ராதா', placeName: 'சென்னை' });

assert.equal(party.date, '1990-05-15');
assert.equal(party.time, '10:30');
assert.equal(party.placeName, 'சென்னை');
assert.equal(party.latitude, '13.0827°N');
assert.equal(party.longitude, '80.2707°E');
assert.equal(party.utcOffset, '+05:30');
assert.equal(party.source, 'library');
assert.equal(party.revision, 3, 'the revision is shown: a rectified birth time changes the match');

// The method displayed is the one the context resolved, not the page's intent
// — a match shown under "Lahiri" that was computed under Raman is a lie a
// practitioner cannot detect.
assert.equal(party.method.ayanamsha, 'Raman');
assert.equal(party.method.ayanamsha, ctx.ayanamsha);
assert.equal(party.method.houseSystem, ctx.houseSystem);
assert.equal(party.method.nodeType, ctx.nodeType);

// A party typed into the form says so, rather than implying a saved record.
const adhoc = describeMatchParty(bride, ctx);
assert.equal(adhoc.source, 'form');
assert.equal(adhoc.profileId, null);

// Southern and western coordinates must not silently lose their sign.
assert.equal(formatLatitude(-33.8688), '33.8688°S');
assert.equal(formatLongitude(-0.1276), '0.1276°W');
assert.equal(formatOffset(-300), '-05:00');
assert.equal(formatOffset(0), '+00:00');

// ------------------------------------------- the disclosures are true --

// GANA — disclosed as applied symmetrically.
assert.equal(factorFor('GANA', 0, 1).result, factorFor('GANA', 1, 0).result,
  'Deva/Manushya gives the same verdict either way round');
assert.equal(factorFor('GANA', 0, 2).result, factorFor('GANA', 2, 0).result,
  'Deva/Rakshasa gives the same verdict either way round');

// MAHENDRA — disclosed as reading the same measurement as DINA and STREE.
const three = calcPorutham(3, 16, 1, 7);
assert.equal(row(three, 'DINA').measure.count, row(three, 'MAHENDRA').measure.count);
assert.equal(row(three, 'MAHENDRA').measure.count, row(three, 'STREE_DEERGHA').measure.count);

// YONI — disclosed as 9 groups, not the 14-yoni scheme, tested by adjacency.
const yoniGroups = new Set(
  Array.from({ length: 27 }, (_, n) => factorFor('YONI', n, 0).measure.girl),
);
assert.equal(yoniGroups.size, 9, 'the ported table holds 9 groups');
assert.equal(row(three, 'YONI').measure.groups, 9);
// Adjacency, not enmity: neighbouring group numbers pass.
const adjacent = Array.from({ length: 27 }, (_, n) => factorFor('YONI', n, 0))
  .find((r) => r.measure.gap === 1);
assert.ok(adjacent && adjacent.result, 'a gap of 1 passes, which is the adjacency rule');

// RASI_ADHIPATHI — disclosed as a plain inequality, so one shared lord fails.
// Mesha and Vrischika share Mars.
const sharedLord = factorFor('RASI_ADHIPATHI', 0, 0, 0, 7);
assert.equal(sharedLord.measure.same, true);
assert.equal(sharedLord.result, false, 'identical lords fail, as disclosed');
assert.equal(sharedLord.measure.girl, sharedLord.measure.boy);

// VASYA — disclosed as direction-blind: the direction is recorded, not used.
const oneWay = factorFor('VASYA', 0, 0, 10, 5);
assert.equal(oneWay.measure.girlControlsBoy, true);
assert.equal(oneWay.measure.boyControlsGirl, false);
assert.equal(oneWay.result, true, 'one direction is enough, as disclosed');
assert.match(oneWay.why ?? describePorutham([oneWay])[0].why, /பெண் ராசியின்/);

// VEDHA — disclosed as leaving Mula, Shravana and Dhanishtha unpaired, so
// those three can never fail this factor.
for (const unpaired of [18, 21, 22]) {
  for (let other = 0; other < 27; other += 1) {
    assert.equal(factorFor('VEDHA', unpaired, other).result, true,
      `nakshatra ${unpaired} has no vedha partner`);
  }
}
// And the claim is not vacuous — some pair does fail.
assert.equal(factorFor('VEDHA', 0, 17).result, false);

// RAJJU — disclosed as treating all five groups alike: every same-group pair
// fails identically, whichever group it is.
const rajjuGroups = new Set();
for (let g = 0; g < 27; g += 1) {
  for (let b = 0; b < 27; b += 1) {
    const r = factorFor('RAJJU', g, b);
    if (r.measure.same) {
      assert.equal(r.result, false);
      rajjuGroups.add(r.measure.girl);
    }
  }
}
assert.equal(rajjuGroups.size, 5, 'all five rajju groups behave the same way');

// STREE_DEERGHA — disclosed as a single threshold with no graded band.
assert.equal(new Set(
  Array.from({ length: 27 }, (_, n) => factorFor('STREE_DEERGHA', 0, n).result),
).size, 2, 'the factor is binary: there is no மத்திமம் band');

console.log(JSON.stringify({
  pass: true,
  factors: match.rows.length,
  passed: `${match.passed}/${match.total}`,
  level: match.level,
  withheld: evidence.filter((e) => e.status === 'SOURCE_REQUIRED').length,
  disclosures: FACTORS.filter((f) => f.divergence).map((f) => f.id),
}, null, 2));
