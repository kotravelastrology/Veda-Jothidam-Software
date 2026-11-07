/**
 * VJ-025 — conflict resolution.
 *
 * Acceptance: *same birth-time edit on two devices → explicit review; no
 * silent loss*.
 *
 * The scenario in the criterion is driven literally: two devices edit one
 * profile's birth time, the second to sync hits a conflict, and the test then
 * checks that nothing resolves itself and nothing disappears.
 */
const assert = require('node:assert/strict');

const { openLibrary } = require('./src/library/chartRepository');
const { FULL_ACCESS } = require('./src/sync/scopes');
const { drainOutbox, operationId } = require('./src/sync/syncEngine');
const { createLocalSyncService } = require('./src/sync/localSyncService');
const {
  RESOLUTION_IDS, diffPayloads, recordConflicts, reviewConflict, resolveConflict,
} = require('./src/sync/conflicts');

const BIRTH = {
  year: 1990, month: 5, day: 15, hour: 10, minute: 30,
  latitude: 13.0827, longitude: 80.2707, utcOffsetMinutes: 330,
  ianaTimeZone: 'Asia/Kolkata', name: 'A',
};

const grantOf = (lib, id) => {
  const d = lib.getDevice(id);
  return { deviceId: d.deviceId, scopes: d.scopes, revokedAt: d.revokedAt };
};

function device(service, label) {
  const lib = openLibrary(':memory:');
  lib.registerDevice(label, { label, scopes: FULL_ACCESS });
  service.registerDevice(label, FULL_ACCESS);
  return lib;
}

const queue = (lib, payload) => {
  const opId = operationId({ operation: 'profile.upsert', resourceId: 'p1', payload });
  lib.enqueue(opId, { operation: 'profile.upsert', resourceId: 'p1', payload });
  return opId;
};

// ------------------------------------------------------------- diff ----

{
  const d = diffPayloads({ ...BIRTH, minute: 30 }, { ...BIRTH, minute: 37 });
  assert.equal(d.changed.length, 1);
  assert.equal(d.changed[0].key, 'minute');
  assert.equal(d.changedBirthFields.length, 1, 'a minute is a birth field, not metadata');
  assert.equal(d.affectsChart, true);

  // A name change does not touch the chart.
  const meta = diffPayloads({ ...BIRTH, name: 'A' }, { ...BIRTH, name: 'A. Kumar' });
  assert.equal(meta.changedBirthFields.length, 0);
  assert.equal(meta.affectsChart, false);

  // The ayanamsha is not a birth field, but it does change the chart.
  const setting = diffPayloads({ ...BIRTH, ayanamsha: 'Lahiri' }, { ...BIRTH, ayanamsha: 'Raman' });
  assert.equal(setting.changedSettingFields.length, 1);
  assert.equal(setting.affectsChart, true);

  // A field present on only one side is a change: an edit that removes a
  // value would otherwise vanish from the diff entirely.
  const removed = diffPayloads({ ...BIRTH, note: 'x' }, { ...BIRTH });
  const noteField = removed.changed.find((f) => f.key === 'note');
  assert.ok(noteField, 'a removed field is reported');
  assert.equal(noteField.onlyOn, 'local');

  // baseVersion is protocol plumbing, not a user-visible difference.
  const plumbing = diffPayloads({ ...BIRTH, baseVersion: 1 }, { ...BIRTH, baseVersion: 4 });
  assert.equal(plumbing.changed.length, 0);
}

(async () => {
  // ------------------ the scenario: two devices, one birth time ---------

  const service = createLocalSyncService();
  const phone = device(service, 'phone');
  const laptop = device(service, 'laptop');

  // Both start from the same known state.
  service.seed('p1', 1, { ...BIRTH });

  // The phone corrects the birth time to 10:37 and syncs first.
  queue(phone, { ...BIRTH, minute: 37, baseVersion: 1 });
  const first = await drainOutbox({ library: phone, transport: service, grant: grantOf(phone, 'phone') });
  assert.equal(first.sent.length, 1);
  assert.equal(service.getResource('p1').version, 2);
  assert.equal(service.getResource('p1').payload.minute, 37);

  // The laptop, offline until now, corrects the same birth time to 10:42.
  const laptopOp = queue(laptop, { ...BIRTH, minute: 42, baseVersion: 1 });
  const second = await drainOutbox({ library: laptop, transport: service, grant: grantOf(laptop, 'laptop') });

  assert.equal(second.sent.length, 0, 'the second edit must not overwrite the first');
  assert.equal(second.conflicts.length, 1);
  assert.equal(service.getResource('p1').payload.minute, 37, 'the remote is untouched');

  // ----------------------------------------------- explicit review ------

  // The conflict is made durable: a page reload must not lose the fact that
  // two devices disagree about a birth time.
  const [id] = recordConflicts(laptop, second.conflicts);
  assert.equal(laptop.openConflicts().length, 1);

  // Recording the same conflict twice is one row to review.
  recordConflicts(laptop, second.conflicts);
  assert.equal(laptop.openConflicts().length, 1);

  const review = reviewConflict(laptop, id);
  assert.equal(review.state, 'open');
  assert.equal(review.localPayload.minute, 42);
  assert.equal(review.remotePayload.minute, 37);
  assert.equal(review.remoteVersion, 2);
  assert.equal(review.diff.changedBirthFields.length, 1);
  assert.equal(review.diff.changedBirthFields[0].key, 'minute');

  // Two different birth times are two different charts, not two halves of
  // one, so nothing offers to merge them.
  assert.equal(review.mergeable, false);

  // The choices are a closed set with no default.
  assert.deepEqual(review.choices.map((c) => c.id), RESOLUTION_IDS);
  assert.throws(() => resolveConflict(laptop, id, 'MERGE_AUTOMATICALLY'), /unknown resolution/);
  assert.throws(() => resolveConflict(laptop, id, undefined), /unknown resolution/);
  assert.throws(() => resolveConflict(laptop, id, ''), /unknown resolution/);

  // Doing nothing leaves it open — a conflict cannot clear itself.
  assert.equal(laptop.openConflicts().length, 1);

  // --------------------------------------------------- no silent loss ---

  const outcome = resolveConflict(laptop, id, 'KEEP_LOCAL');
  assert.equal(outcome.resolution, 'KEEP_LOCAL');
  assert.equal(laptop.openConflicts().length, 0);

  const after = laptop.getConflict(id);
  assert.equal(after.state, 'resolved');
  assert.equal(after.resolution, 'KEEP_LOCAL');
  assert.ok(after.resolvedAt);
  // BOTH sides survive the decision.
  assert.equal(after.localPayload.minute, 42, 'the chosen side is kept');
  assert.equal(after.remotePayload.minute, 37, 'and so is the discarded one');

  // The original operation is retired and a re-based one queued in its place,
  // so the change applies instead of conflicting again.
  assert.equal(laptop.getOutboxEntry(laptopOp).state, 'blocked');
  const rebased = laptop.pendingOutbox();
  assert.equal(rebased.length, 1);
  assert.equal(rebased[0].payload.minute, 42);
  assert.equal(rebased[0].payload.baseVersion, 2, 're-based onto the version reviewed');

  const applied = await drainOutbox({ library: laptop, transport: service, grant: grantOf(laptop, 'laptop') });
  assert.equal(applied.sent.length, 1);
  assert.equal(applied.conflicts.length, 0, 'the re-based operation does not conflict again');
  assert.equal(service.getResource('p1').payload.minute, 42);
  assert.equal(service.getResource('p1').version, 3);

  // A resolved conflict cannot be resolved again into something else.
  assert.throws(() => resolveConflict(laptop, id, 'KEEP_REMOTE'), /already resolved/);
  assert.throws(() => laptop.resolveConflict(id, { resolution: 'KEEP_REMOTE' }), /no open conflict/);
  assert.throws(() => reviewConflict(laptop, 'nope'), /no conflict/);

  phone.close();
  laptop.close();

  // ----------------------------------- KEEP_REMOTE also loses nothing ---

  {
    const svc = createLocalSyncService();
    const lib = device(svc, 'tablet');
    svc.seed('p1', 5, { ...BIRTH, minute: 11 });
    const op = queue(lib, { ...BIRTH, minute: 59, baseVersion: 2 });
    const r = await drainOutbox({ library: lib, transport: svc, grant: grantOf(lib, 'tablet') });
    const [cid] = recordConflicts(lib, r.conflicts);

    resolveConflict(lib, cid, 'KEEP_REMOTE');

    // Nothing is sent, and the remote stands.
    assert.equal(lib.pendingOutbox().length, 0, 'the discarded edit is not queued');
    assert.equal(lib.getOutboxEntry(op).state, 'blocked');
    assert.match(lib.getOutboxEntry(op).lastError, /superseded by remote v5/);
    assert.equal(svc.getResource('p1').payload.minute, 11);

    // But the discarded local edit is still readable — the point of the
    // criterion. Deleting it would be exactly the silent loss.
    const kept = lib.getConflict(cid);
    assert.equal(kept.localPayload.minute, 59);
    assert.equal(kept.resolution, 'KEEP_REMOTE');

    lib.close();
  }

  // ------------------------------------------------------- KEEP_BOTH ---

  {
    const svc = createLocalSyncService();
    const lib = device(svc, 'desk');
    svc.seed('p1', 4, { ...BIRTH, minute: 20 });
    queue(lib, { ...BIRTH, minute: 25, baseVersion: 1 });
    const r = await drainOutbox({ library: lib, transport: svc, grant: grantOf(lib, 'desk') });
    const [cid] = recordConflicts(lib, r.conflicts);

    resolveConflict(lib, cid, 'KEEP_BOTH');

    // KEEP_BOTH re-bases like KEEP_LOCAL, because VJ-011 appends revisions
    // rather than overwriting: accepting the remote and then applying the
    // local edit on top leaves both readable in the profile's history.
    const pending = lib.pendingOutbox();
    assert.equal(pending.length, 1);
    assert.equal(pending[0].payload.baseVersion, 4);
    assert.equal(pending[0].payload.minute, 25);

    await drainOutbox({ library: lib, transport: svc, grant: grantOf(lib, 'desk') });
    assert.equal(svc.getResource('p1').version, 5, 'the remote version was not discarded');
    assert.equal(svc.getResource('p1').payload.minute, 25);
    assert.equal(lib.getConflict(cid).remotePayload.minute, 20, 'the earlier value is still on record');

    lib.close();
  }

  // ------------------------------------------ conflicts are durable -----

  {
    const path = `${require('node:os').tmpdir()}/vj025-${Date.now()}.db`;
    const a = openLibrary(path);
    a.recordConflict('c1', {
      opId: 'o1', resourceId: 'p1', operation: 'profile.upsert',
      localPayload: { minute: 1 }, remote: { version: 2, payload: { minute: 2 } },
    });
    a.close();

    const b = openLibrary(path);
    assert.equal(b.openConflicts().length, 1, 'a conflict outlives the page that found it');
    assert.equal(b.getConflict('c1').remoteVersion, 2);
    b.close();
    require('node:fs').rmSync(path, { force: true });
  }

  console.log(JSON.stringify({
    pass: true,
    scenario: 'two devices edited the same birth time (10:37 vs 10:42)',
    resolutions: RESOLUTION_IDS,
    guarantees: [
      'conflict is durable across restart',
      'no default resolution — a closed set, explicitly chosen',
      'both payloads retained under every resolution',
      'remote untouched until a decision',
      're-based operation does not conflict again',
    ],
  }, null, 2));
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
