const assert = require('node:assert/strict');
const { subLevelAnalysis, candidateWindowsFromSubLevels, searchCandidateWindows, ascendantState } = require('./src/report/kpTimeScan');
const { loadEvents } = require('./src/report/kpEvents');
const { julianDay } = require('@swisseph/node');

const CH = { latitude: 13.0827, longitude: 80.2707 };
const event = loadEvents().find((e) => e.name === 'Publishing a Book');
assert.ok(event, 'fixture event found');

// ── ascendantState is stable arithmetic, not random ─────────────────
const jd0 = julianDay(2026, 9, 10, 5.5);
const s1 = ascendantState(jd0, CH.latitude, CH.longitude);
const s2 = ascendantState(jd0, CH.latitude, CH.longitude);
assert.deepEqual(s1, s2);
assert.ok(s1.signLord && s1.starLord && s1.subLord);

// ── subLevelAnalysis: contiguous intervals covering the whole range ──
const startJd = julianDay(2026, 9, 10, 6 - 330 / 60);
const endJd = julianDay(2026, 9, 10, 20 - 330 / 60);
const rows = subLevelAnalysis(event, {
  startJd, endJd, latitude: CH.latitude, longitude: CH.longitude, utcOffsetMinutes: 330, stepMinutes: 1,
});
assert.ok(rows.length > 5, `expected several sub-lord intervals, got ${rows.length}`);
// contiguous: each row's end is exactly one second before the next row's start
// (the end label is inclusive, matching kp_muhurat's `finish = next.start - 1s`)
const toSec = (hms) => hms.split(':').reduce((a, x) => a * 60 + Number(x), 0);
for (let i = 1; i < rows.length; i++) {
  assert.equal((toSec(rows[i].start) - toSec(rows[i - 1].end) + 86400) % 86400, 1, `row ${i} contiguous`);
}
for (const r of rows) {
  assert.ok(r.signLord && r.starLord && r.subLord);
  assert.equal(typeof r.eligible, 'boolean');
  assert.ok(['RED', 'GREEN', 'DARK_GREEN', 'REVIEW'].includes(r.grade.code));
  assert.match(r.start, /^\d{2}:\d{2}:\d{2}$/);
  assert.ok(r.reason.length > 10);
}

// ── candidateWindowsFromSubLevels: only eligible GREEN/DARK_GREEN merge ──
const windows = candidateWindowsFromSubLevels(rows, 330);
for (const w of windows) {
  assert.ok(['GREEN', 'DARK_GREEN'].includes(w.code));
  assert.ok(w.durationSeconds > 0);
  assert.match(w.recommendedTime, /^\d{2}:\d{2}:\d{2}$/);
  // recommendedTime falls within [start, end]
  assert.ok(w.recommendedTime >= w.start && w.recommendedTime <= w.end);
}
// ranked: DARK_GREEN before GREEN, then longest first
for (let i = 1; i < windows.length; i++) {
  const rank = { DARK_GREEN: 0, GREEN: 1 };
  assert.ok(
    rank[windows[i - 1].code] < rank[windows[i].code]
    || (rank[windows[i - 1].code] === rank[windows[i].code] && windows[i - 1].durationSeconds >= windows[i].durationSeconds),
    `window ${i} ranked correctly`,
  );
}
if (windows.length) { assert.equal(windows[0].rank, 1); assert.equal(windows[0].bestChoice, true); }

// ── searchCandidateWindows: end-to-end from ISO strings ─────────────
const res = searchCandidateWindows(event, {
  startISO: '2026-09-10T06:00', endISO: '2026-09-10T20:00',
  latitude: CH.latitude, longitude: CH.longitude, utcOffsetMinutes: 330, stepMinutes: 1,
});
assert.equal(res.available, true);
assert.equal(res.scannedIntervals, rows.length);
assert.deepEqual(res.windows.map((w) => w.start), windows.map((w) => w.start));

// ── a too-wide range is clamped to MAX_RANGE_DAYS (server protection) ──
const wide = searchCandidateWindows(event, {
  startISO: '2026-09-01T00:00', endISO: '2026-09-20T00:00',
  latitude: CH.latitude, longitude: CH.longitude, utcOffsetMinutes: 330, stepMinutes: 3,
});
assert.ok(wide.available);
assert.ok(wide.scannedIntervals < 3000, 'clamped scan stays bounded');

console.log(JSON.stringify({
  pass: true,
  intervals: rows.length,
  windows: windows.length,
  best: windows[0] ? { start: windows[0].start, end: windows[0].end, code: windows[0].code, recommended: windows[0].recommendedTime } : null,
}, null, 2));
