const assert = require('node:assert/strict');
const { calculateKpSystem } = require('./src/report/kpSystem');
const { calculateKpEvents, loadEvents, parseEventsTxt, evaluateEvent, gradeEvent } = require('./src/report/kpEvents');

// ── The pre-parsed JSON matches a fresh parse of the raw events.txt ──────
const fresh = parseEventsTxt();
const cached = loadEvents();
assert.equal(cached.length, fresh.length, 'cached JSON count matches raw parse');
assert.deepEqual(cached, fresh, 'cached JSON is byte-identical to a fresh parse');

// 80 events (block 0 = "Default Event"), each with a numeric key and rules.
assert.equal(cached.length, 80);
assert.equal(cached[1].name, 'Surgical Operation');
assert.equal(cached[1].nameTa, 'அறுவைச் சிகிச்சை');
// Surgical Operation rule 0: target 1 (cusp), favorable [1,5,9,11], no unfavorable.
assert.equal(cached[1].rules[0].target, 1);
assert.deepEqual(cached[1].rules[0].favorable, [1, 5, 9, 11]);
// rule 1 "11:3:1:5:11:2:6:12:" -> target 11, favorable [1,5,11], badCount 2 -> unfavorable [6,12].
assert.deepEqual(cached[1].rules[1].favorable, [1, 5, 11]);
assert.deepEqual(cached[1].rules[1].unfavorable, [6, 12]);

// ── Evaluate against a chart ───────────────────────────────────────────
const kp = calculateKpSystem(
  { year: 1990, month: 5, day: 15, hour: 7, minute: 30, latitude: 11.34, longitude: 77.72, utcOffsetMinutes: 330 },
  { nodeType: 'mean' },
);
assert.deepEqual(kp.dbas, ['Sun', 'Moon', 'Sun', 'Rahu']); // natal Moon DBAS

const ev = calculateKpEvents(kp);
assert.equal(ev.available, true);
assert.equal(ev.count, 80);
for (const e of ev.events) {
  assert.ok(['RED', 'GREEN', 'DARK_GREEN', 'REVIEW'].includes(e.grade.code), `${e.name} grade`);
  assert.ok(e.grade.total >= 0 && e.grade.passed <= e.grade.total);
  for (const r of e.rows) {
    assert.ok(/^(Cusp \d+|Dasa|Bhukti|Antara|Sukshma)$/.test(r.target), `${e.name} target ${r.target}`);
    assert.ok(['Y', 'P', 'N', '-'].includes(r.positiveCode));
    assert.ok(Array.isArray(r.significators));
  }
}

// Surgical Operation: cusp-1 sub lord + its significators, deterministic.
const surg = ev.events.find((e) => e.name === 'Surgical Operation');
assert.equal(surg.rows[0].target, 'Cusp 1');
assert.equal(surg.rows[0].subLord, 'Venus');
assert.deepEqual(surg.rows[0].significators, [1, 2, 3, 5, 6, 8, 11]);
// favorable [1,5,9,11]: 1,5,11 hit but not 9 -> positive P.
assert.equal(surg.rows[0].positiveCode, 'P');

// gradeEvent honours the legacy colour priority: any red row -> RED.
const g = gradeEvent([
  { status: 'Excellent', color: 'green' },
  { status: 'Avoid', color: 'red' },
]);
assert.equal(g.code, 'RED');
assert.equal(gradeEvent([{ status: 'Excellent', color: 'green' }, { status: 'Excellent', color: 'green' }]).code, 'DARK_GREEN');
assert.equal(gradeEvent([{ status: 'Pass', color: 'green' }, { status: 'Excellent', color: 'green' }]).code, 'GREEN');

console.log(JSON.stringify({
  pass: true, events: ev.count, dbas: kp.dbas.join(','),
  surgicalGrade: surg.grade.code, surgicalCusp1: `${surg.rows[0].subLord} ${surg.rows[0].positiveCode}`,
}, null, 2));
