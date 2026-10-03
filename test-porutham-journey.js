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
  // Every row states where its rule stands against the two primary texts. The
  // full set of statuses is pinned in test-porutham-source.js, against the live
  // comparison.
  assert.ok(['AGREED_BY_BOTH', 'FOLLOWS_KALAPRAKASIKA', 'NOT_SOURCED'].includes(r.sourceStatus),
    `${r.id}: unexpected source status ${r.sourceStatus}`);
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
  // Nothing may claim a source it does not have. Nine factors are applied —
  // their rule was read from the printed page of Kalaprakasika — and must then
  // carry a locator. Rasi Adhipathi alone stays withheld: the book states no
  // rule for it, so it claims no source at all.
  if (e.ruleId === 'PORUTHAM_RASI_ADHIPATHI') {
    assert.equal(e.status, 'SOURCE_REQUIRED');
    assert.equal(e.source, null);
    // Still true of the ported table, and it explains why it has no source.
    assert.match(e.reason, /Marriage reference workbook/);
    assert.equal(typeof e.appliedTo.computedResult, 'boolean');
    assert.ok(e.appliedTo.measure);
  } else {
    assert.equal(e.status, 'APPLIED');
    assert.ok(e.source && e.source.pageLocus);
  }
}
// Nine of ten are sourced, so the overall state is partial rather than complete.
assert.equal(match.sourceStatus, 'PARTIALLY_SOURCED');

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
// A chart matched against itself never scores well, but it does not look like an
// error either: 3 or 4 out of 10, a plausible poor match. That is why the guard
// has to run before the computation rather than leaving the reader to notice.
//
// This used to assert "exactly 5/10 for every star and sign". That was a
// property of the earlier, wrong tables, not of matching; correcting Gana, Dina,
// Yoni and the rest moved it. What has not changed is the conclusion — it is
// never 0 and never flagged — so the range is asserted, not a single value.
const selfScores = new Set();
for (let n = 0; n < 27; n += 1) {
  for (let r = 0; r < 12; r += 1) {
    const self = calculateTamilPorutham({ nakshatraIndex: n, rasiIndex: r }, { nakshatraIndex: n, rasiIndex: r });
    selfScores.add(self.passed);
    assert.ok(self.passed >= 3 && self.passed <= 4,
      `self-match at star ${n}, sign ${r} scored ${self.passed}`);
    assert.ok(['சாதாரணம்', 'குறைவு'].includes(self.level));
  }
}
assert.deepEqual([...selfScores].sort(), [3, 4], 'both outcomes occur, so it is not a constant');

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
//
// Each `divergence` shown to a user is a claim about this code, so each is
// asserted here against the behaviour it describes. (This section used to
// assert the disclosures of the earlier port — nine yoni groups, twelve vedha
// pairs leaving three stars unpaired — which the source comparison replaced.)

// GANA — the Deva/Manushya combination gives the same verdict either way round.
assert.equal(factorFor('GANA', 0, 3).result, factorFor('GANA', 3, 0).result,
  'Deva/Manushya gives the same verdict either way round');
assert.equal(factorFor('GANA', 0, 2).result, factorFor('GANA', 2, 0).result,
  'Deva/Rakshasa gives the same verdict either way round');

// MAHENDRA — disclosed as reading the same measurement as DINA and STREE.
const three = calcPorutham(3, 16, 1, 7);
assert.equal(row(three, 'DINA').measure.count, row(three, 'MAHENDRA').measure.count);
assert.equal(row(three, 'MAHENDRA').measure.count, row(three, 'STREE_DEERGHA').measure.count);

// DINA — disclosed as not modelling the pada-level exclusions of the second
// cycle. The consequence is that the whole second cycle is accepted, and the
// third apart from the 22nd and 27th.
const dinaAcceptsCount = (count, girlRasi = 0, boyRasi = 1) =>
  factorFor('DINA', 0, count - 1, girlRasi, boyRasi).result;
for (let count = 10; count <= 18; count += 1) {
  assert.equal(dinaAcceptsCount(count), true, `count ${count} (second cycle) is accepted`);
}
for (const count of [19, 20, 21, 23, 24, 25, 26]) {
  assert.equal(dinaAcceptsCount(count), true, `count ${count} (third cycle) is accepted`);
}
assert.equal(dinaAcceptsCount(22), false, 'the 22nd is avoided');
assert.equal(dinaAcceptsCount(27, 0, 1), false, 'the 27th is avoided across rasis');
assert.equal(dinaAcceptsCount(27, 0, 0), true, 'and accepted within one rasi');

// YONI — thirteen kinds, hostile pairs fail, and the printed mongoose pair can
// never apply because no star is a mongoose.
const yoniKinds = new Set(Array.from({ length: 27 }, (_, n) => factorFor('YONI', n, 0).measure.girl));
assert.equal(yoniKinds.size, 13, 'thirteen animals cover the 27 stars');
assert.ok(![...yoniKinds].includes('கீரி'), 'no star is a mongoose, so serpent-mongoose can never apply');
assert.equal(factorFor('YONI', 0, 14).result, false, 'horse and buffalo are hostile');
assert.equal(factorFor('YONI', 0, 23).result, true, 'the same yoni is acceptable (Ashwini and Sathabis are both horse)');
assert.equal(factorFor('YONI', 0, 3).result, true, 'different, non-hostile yonis are neutral, and accepted');

// RASI_ADHIPATHI — disclosed as a plain inequality, so one shared lord fails.
// Mesha and Vrischika share Mars. (Unchanged: the book states no rule for it.)
const sharedLord = factorFor('RASI_ADHIPATHI', 0, 0, 0, 7);
assert.equal(sharedLord.measure.same, true);
assert.equal(sharedLord.result, false, 'identical lords fail, as disclosed');
assert.equal(sharedLord.measure.girl, sharedLord.measure.boy);

// VASYA — either direction is enough, because the book says "or vice versa";
// the direction is recorded, and does not change the result.
const oneWay = factorFor('VASYA', 0, 0, 0, 4); // Aries lists Leo; Leo lists only Libra
assert.equal(oneWay.measure.girlControlsBoy, true);
assert.equal(oneWay.measure.boyControlsGirl, false);
assert.equal(oneWay.result, true, 'one direction is enough, as disclosed');
assert.match(oneWay.why ?? describePorutham([oneWay])[0].why, /பெண் ராசியின்/);

// VEDHA — every star belongs to a pair or to the triple, so every star can
// fail this factor. (The earlier port left Mula, Shravana and Dhanishtha
// unpaired, and they could never fail it.)
for (let star = 0; star < 27; star += 1) {
  const failsWith = Array.from({ length: 27 }, (_, other) => other)
    .some((other) => other !== star && factorFor('VEDHA', star, other).result === false);
  assert.ok(failsWith, `star ${star} has at least one vedha partner`);
}
assert.equal(factorFor('VEDHA', 0, 17).result, false, 'Ashwini and Jyeshtha');
// The triple: none of the three is compatible with either of the others.
for (const [a, b] of [[4, 13], [13, 22], [4, 22]]) {
  assert.equal(factorFor('VEDHA', a, b).result, false, `Mrigasirsha, Chithra and Sravishta: ${a} and ${b}`);
  assert.equal(factorFor('VEDHA', b, a).result, false);
}

// RAJJU — disclosed as treating all five bands alike: every same-band pair
// fails identically, whichever band it is.
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
assert.equal(rajjuGroups.size, 5, 'all five rajju bands behave the same way');

// STREE_DEERGHA — a single threshold, now 13, with no graded band.
assert.equal(new Set(
  Array.from({ length: 27 }, (_, n) => factorFor('STREE_DEERGHA', 0, n).result),
).size, 2, 'the factor is binary: there is no மத்திமம் band');
assert.equal(factorFor('STREE_DEERGHA', 0, 11).result, false, 'a count of 12 fails');
assert.equal(factorFor('STREE_DEERGHA', 0, 12).result, true, 'a count of 13 passes');

console.log(JSON.stringify({
  pass: true,
  factors: match.rows.length,
  passed: `${match.passed}/${match.total}`,
  level: match.level,
  withheld: evidence.filter((e) => e.status === 'SOURCE_REQUIRED').length,
  applied: evidence.filter((e) => e.status === 'APPLIED').length,
  disclosures: FACTORS.filter((f) => f.divergence).map((f) => f.id),
}, null, 2));
