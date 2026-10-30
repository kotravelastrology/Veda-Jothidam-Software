/**
 * VJ-017 — deterministic dasha/transit timeline.
 *
 * Acceptance: period boundary drill; selected-date replay; cancellation of
 * long scans.
 */
const assert = require('node:assert/strict');

const { createChartContext } = require('./src/contracts/chartContext');
const { calculateParashariChart } = require('./src/chart/parashariChart');
const { buildVimshottariDasha, DASHA_LEVEL_NAMES } = require('./src/dasha/vimshottariDasha');
const {
  chainAtJulianDay, chainAtDate, boundariesBetween, statusAt,
  julianDayFromDate, scanForChanges, ScanCancelled,
} = require('./src/dasha/timeline');

const input = {
  year: 1990, month: 5, day: 15, hour: 10, minute: 30,
  ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330,
  latitude: 13.0827, longitude: 80.2707, placeName: 'Chennai',
};
const chart = calculateParashariChart(createChartContext({ ...input, calendarMode: 'tirukanita' }));
// Depth 4 so the boundary drill has real levels to descend through.
const dasha = buildVimshottariDasha(chart.julianDay, chart.grahas.Moon.longitude, 330, { depth: 4 });

// --------------------------------------------------------- determinism --

assert.equal(statusAt(10, 5, 15), 'current');
assert.equal(statusAt(20, 5, 15), 'past');
assert.equal(statusAt(1, 5, 15), 'future');
// A boundary belongs to the period it starts, not the one it ends.
assert.equal(statusAt(15, 5, 15), 'past');
assert.equal(statusAt(5, 5, 15), 'current');

// --------------------------------------------- selected-date replay --

const replayDate = '2026-09-27T12:00:00.000Z';
const first = chainAtDate(dasha, replayDate);
assert.ok(first.length >= 4, 'depth 4 must yield a four-level chain');
assert.deepEqual(first.map((c) => c.level), DASHA_LEVEL_NAMES.slice(0, 4));

// Replaying the same instant must give the identical answer, every time.
for (let i = 0; i < 5; i += 1) {
  assert.deepEqual(chainAtDate(dasha, replayDate), first,
    'the same date must always replay to the same chain');
}
assert.deepEqual(chainAtDate(dasha, new Date(replayDate)), first,
  'a Date and its ISO string must agree');

// Each level must sit inside its parent, or the drill would be meaningless.
for (let i = 1; i < first.length; i += 1) {
  assert.ok(first[i].startJulianDay >= first[i - 1].startJulianDay,
    `${first[i].level} starts before its parent ${first[i - 1].level}`);
  assert.ok(first[i].endJulianDay <= first[i - 1].endJulianDay,
    `${first[i].level} ends after its parent ${first[i - 1].level}`);
}

// And the instant asked about must actually be inside every level returned.
const replayJd = julianDayFromDate(replayDate);
for (const period of first) {
  assert.ok(replayJd >= period.startJulianDay && replayJd < period.endJulianDay,
    `${period.level} ${period.lord} does not contain the requested instant`);
}

// Outside the 120-year cycle we return nothing rather than extrapolating.
assert.deepEqual(chainAtJulianDay(dasha, chart.julianDay - 1000), [],
  'before birth there is no period, and inventing one would be fabrication');
assert.deepEqual(chainAtJulianDay(dasha, chart.julianDay + 200 * 365.25), []);

// ------------------------------------------------ period boundary drill --

// Mahadasha boundaries across the whole cycle: nine periods, so nine starts.
const allDasha = boundariesBetween(dasha, chart.julianDay - 1, chart.julianDay + 121 * 365.25);
assert.equal(allDasha.length, 9, 'nine mahadasha starts in a 120-year cycle');
assert.equal(allDasha[0].lord, dasha.startingLord);
for (let i = 1; i < allDasha.length; i += 1) {
  assert.ok(allDasha[i].julianDay > allDasha[i - 1].julianDay, 'boundaries must be ordered');
}

// The periods must tile the cycle with no gap and no overlap: each start is
// the previous end.
for (let i = 1; i < allDasha.length; i += 1) {
  assert.ok(Math.abs(allDasha[i].julianDay - allDasha[i - 1].endsJulianDay) < 1e-6,
    `gap or overlap between ${allDasha[i - 1].lord} and ${allDasha[i].lord}`);
}

// Drilling a level down inside one mahadasha: nine bhuktis, tiling it exactly.
const firstDasha = dasha.dashas[0];
const bhuktis = boundariesBetween(dasha, firstDasha.startJulianDay, firstDasha.endJulianDay - 1e-9,
  { level: 'Bhukti' });
assert.equal(bhuktis.length, 9, 'each mahadasha divides into nine bhuktis');
assert.equal(bhuktis[0].chain[0], firstDasha.lord, 'the chain names the parent');
assert.equal(bhuktis[0].chain.length, 2, 'a bhukti boundary carries a two-level chain');

// A narrow window returns only what falls inside it.
const narrow = boundariesBetween(dasha, bhuktis[2].julianDay, bhuktis[4].julianDay);
assert.equal(narrow.length, 0, 'no mahadasha starts inside two bhuktis');
const narrowBhuktis = boundariesBetween(dasha, bhuktis[2].julianDay, bhuktis[4].julianDay,
  { level: 'Bhukti' });
assert.equal(narrowBhuktis.length, 3, 'inclusive of both ends');

assert.throws(() => boundariesBetween(dasha, 10, 5), /must not be before/);
assert.throws(() => boundariesBetween(dasha, 0, 1, { level: 'Nonsense' }), /unknown level/);

// The chain at a boundary instant must name the period that just began.
const atBoundary = chainAtJulianDay(dasha, allDasha[3].julianDay);
assert.equal(atBoundary[0].lord, allDasha[3].lord,
  'at the exact boundary the new period is the active one');

// ------------------------------------------- cancellation of long scans --

(async () => {
  // A scan long enough that cancelling it means something: one step a day for
  // forty years, probing which rasi the Moon-like value is in.
  const fromJd = chart.julianDay;
  const toJd = fromJd + 40 * 365.25;
  const probe = (jd) => Math.floor(((jd * 13.176) % 360) / 30);

  const full = await scanForChanges({ fromJd, toJd, stepDays: 1, probe });
  assert.ok(full.completed);
  assert.ok(full.scanned > 14000, 'the uncancelled scan really is long');
  assert.ok(full.changes.length > 100, 'and it finds many crossings');

  // Cancelling part-way must stop promptly and report how far it got.
  const controller = new AbortController();
  let progressReports = 0;
  const cancelled = scanForChanges({
    fromJd, toJd, stepDays: 1, probe, signal: controller.signal,
    onProgress: () => { progressReports += 1; if (progressReports === 2) controller.abort(); },
  });
  await assert.rejects(cancelled, (error) => {
    assert.ok(error instanceof ScanCancelled, 'cancellation is distinguishable from failure');
    assert.ok(error.scanned > 0, 'it reports how much work was done');
    assert.ok(error.scanned < full.scanned,
      `cancelled after ${error.scanned} of ${full.scanned} steps — it must stop early`);
    return true;
  });

  // An already-aborted signal must stop before doing any work.
  const pre = new AbortController();
  pre.abort();
  await assert.rejects(
    scanForChanges({ fromJd, toJd, stepDays: 1, probe, signal: pre.signal }),
    (error) => error instanceof ScanCancelled && error.scanned === 0,
  );

  // A completed scan is reproducible, like everything else here.
  const again = await scanForChanges({ fromJd, toJd, stepDays: 1, probe });
  assert.deepEqual(again.changes, full.changes, 'the same scan must give the same crossings');

  await assert.rejects(scanForChanges({ fromJd, toJd, stepDays: 0, probe }), /stepDays must be positive/);
  await assert.rejects(scanForChanges({ fromJd, toJd, probe: null }), /probe must be a function/);

  console.log(JSON.stringify({
    pass: true,
    chainLevels: first.map((c) => `${c.level}:${c.lord}`),
    mahadashaBoundaries: allDasha.length,
    bhuktisInFirstDasha: bhuktis.length,
    fullScanSteps: full.scanned,
  }, null, 2));
})().catch((error) => { console.error(error); process.exit(1); });
