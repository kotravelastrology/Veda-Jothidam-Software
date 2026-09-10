const assert = require('node:assert/strict');
const { buildReportData } = require('./src/report/reportData');
const {
  TOPICS, classifyQuestion, topicBhavas, readTopic, answerQuestion,
  aspectsRasi, classifyDignity, beneficNature, standingOf, runningChain,
} = require('./src/report/answerEngine');

// ── primitives ───────────────────────────────────────────────────────────
// Parāśari dṛṣṭi: everyone aspects the 7th; Mars also 4th/8th, Jupiter 5th/9th,
// Saturn 3rd/10th (offsets from the graha's own rāśi).
assert.deepEqual([...aspectsRasi('Sun', 0)].sort((a, b) => a - b), [6]);
assert.deepEqual([...aspectsRasi('Mars', 0)].sort((a, b) => a - b), [3, 6, 7]);  // 4th & 8th houses
assert.deepEqual([...aspectsRasi('Jupiter', 0)].sort((a, b) => a - b), [4, 6, 8]);
assert.deepEqual([...aspectsRasi('Saturn', 0)].sort((a, b) => a - b), [2, 6, 9]);

// dignity: Sun exalted in Aries (0), debilitated in Libra (6), own Leo (4)
assert.equal(classifyDignity('Sun', 0, 10), 'exalted');
assert.equal(classifyDignity('Sun', 6, 10), 'debilitated');
assert.equal(classifyDignity('Sun', 4, 25), 'own-sign');
assert.equal(classifyDignity('Sun', 4, 10), 'moolatrikona');   // Leo 0-20°
assert.equal(classifyDignity('Rahu', 3, 5), 'neutral');        // no table -> neutral

// benefic nature: Jupiter/Venus always benefic; Moon malefic when near the Sun
assert.equal(beneficNature({ rasi0: {} }, 'Jupiter'), 1);
assert.equal(beneficNature({ rasi0: { Sun: 0, Moon: 0 } }, 'Moon'), -1);   // 0 houses from Sun
assert.equal(beneficNature({ rasi0: { Sun: 0, Moon: 6 } }, 'Moon'), 1);    // 6 houses -> waxing
assert.equal(beneficNature({ rasi0: { Mercury: 2 } }, 'Mercury'), 1);
assert.equal(beneficNature({ rasi0: { Mercury: 2, Saturn: 2 } }, 'Mercury'), -1); // with a malefic

// standing thresholds
assert.equal(standingOf(50), 'strongly-supported');
assert.equal(standingOf(20), 'supported');
assert.equal(standingOf(0), 'mixed');
assert.equal(standingOf(-20), 'obstructed');
assert.equal(standingOf(-60), 'strongly-obstructed');

// ── question routing ─────────────────────────────────────────────────────
assert.equal(classifyQuestion('இந்த வருடம் வேலை கிடைக்குமா?')[0].id, 'career');
assert.equal(classifyQuestion('when will I get married')[0].id, 'marriage');
assert.equal(classifyQuestion('will I buy a house or a car')[0].id, 'property');
assert.deepEqual(classifyQuestion(''), []);
assert.deepEqual(classifyQuestion('what is the meaning of life'), []);
// a two-topic question returns both, ranked
const multi = classifyQuestion("my wife's health");
assert.ok(multi.length >= 2 && multi.some((t) => t.id === 'health') && multi.some((t) => t.id === 'marriage'));

// every topic: primary bhāvas 1-12, karakas known, source cited
for (const t of TOPICS) {
  assert.ok(t.primaryBhavas.every((b) => b >= 1 && b <= 12), `${t.id} bhavas`);
  assert.ok(topicBhavas(t).length >= t.primaryBhavas.length, `${t.id} topicBhavas`);
  assert.ok(/BPHS/.test(t.source), `${t.id} source`);
}

// ── a real reading ───────────────────────────────────────────────────────
const rd = buildReportData({
  name: 'Test Native', gender: 'female',
  year: 1990, month: 5, day: 15, hour: 7, minute: 30,
  ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330,
  latitude: 11.34, longitude: 77.72, placeName: 'Erode',
});

// running dasha chain at birth should be the starting lord's mahādaśā
const atBirth = runningChain(rd.dasha, Date.UTC(1990, 4, 15, 2, 0));
assert.equal(atBirth[0].lord, rd.dasha.startingLord);
assert.equal(atBirth[0].level, 'Dasha');

const career = readTopic(rd, TOPICS.find((t) => t.id === 'career'), { nowMs: Date.now() });
assert.equal(career.topicId, 'career');
assert.ok(['strongly-supported', 'supported', 'mixed', 'obstructed', 'strongly-obstructed'].includes(career.standing));
assert.ok(career.standingTa && career.standingTa.length);
assert.ok(career.steps.length >= 3, 'career reasoning has steps');
assert.ok(career.steps.every((s) => ['promise', 'timing', 'gochara'].includes(s.stage)));
assert.ok(career.steps.every((s) => typeof s.weight === 'number' && s.ta && s.en && s.source));
// promise steps only — no shadbala-rupas step (Kotravel doesn't total Shadbala)
assert.ok(!career.steps.some((s) => /ரூபம்|rupa/i.test(s.en + s.ta)), 'no rupa-total step');
assert.equal(career.significators.bhavas[0].bhava, 10);
assert.equal(career.significators.karakas[0].graha, 'Saturn');
assert.ok(career.runningDasha.length >= 1);
// score == sum of step weights
assert.equal(career.score, Math.round(career.steps.reduce((a, s) => a + s.weight, 0)));

// gochara stage runs only when transit rāśis are supplied
const noGochara = readTopic(rd, TOPICS.find((t) => t.id === 'marriage'), {});
assert.equal(noGochara.usedGochara, false);
assert.ok(!noGochara.steps.some((s) => s.stage === 'gochara'));

const withGochara = readTopic(rd, TOPICS.find((t) => t.id === 'marriage'), {
  transitRasis: { Sun: 4, Moon: 8, Mars: 2, Mercury: 4, Jupiter: 2, Venus: 5, Saturn: 11, Rahu: 10, Ketu: 4 },
});
assert.equal(withGochara.usedGochara, true);
assert.ok(withGochara.steps.some((s) => s.stage === 'gochara'));

// ── answerQuestion end to end ────────────────────────────────────────────
const ans = answerQuestion(rd, 'இந்த வருடம் திருமணம் நடக்குமா?', { nowMs: Date.now() });
assert.equal(ans.matched, true);
assert.equal(ans.topics[0].topicId, 'marriage');
const miss = answerQuestion(rd, 'xyzzy plugh', {});
assert.equal(miss.matched, false);
assert.deepEqual(miss.topics, []);

console.log(JSON.stringify({
  pass: true,
  topics: TOPICS.length,
  careerStanding: career.standing,
  careerScore: career.score,
  careerSteps: career.steps.length,
  runningDasha: career.runningDasha.map((d) => `${d.level}:${d.lord}`).join(' / '),
}, null, 2));
