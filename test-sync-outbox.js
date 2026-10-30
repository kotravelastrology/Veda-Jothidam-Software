/**
 * VJ-024 — optional auth/sync service.
 *
 * Acceptance: scoped access; device outbox; idempotent writes; revocation.
 *
 * There is no hosted service and none is claimed. What is tested is the client
 * half and the protocol contract, driven against `localSyncService`, which
 * enforces the server's rules for real rather than returning what the test
 * wants. When a real service is built it must satisfy this same contract, and
 * this file is the specification of what that means.
 */
const assert = require('node:assert/strict');

const { openLibrary } = require('./src/library/chartRepository');
const {
  ALL_SCOPES, FULL_ACCESS, READ_ONLY, OPERATIONS, authorize, assertScopes,
  ScopeError, RevokedError,
} = require('./src/sync/scopes');
const { drainOutbox, operationId, SYNC_PROTOCOL_VERSION } = require('./src/sync/syncEngine');
const { createLocalSyncService } = require('./src/sync/localSyncService');

const grantOf = (library, deviceId) => {
  const d = library.getDevice(deviceId);
  return { deviceId: d.deviceId, scopes: d.scopes, revokedAt: d.revokedAt };
};

function seed({ scopes = FULL_ACCESS } = {}) {
  const library = openLibrary(':memory:');
  const service = createLocalSyncService();
  library.registerDevice('dev-1', { label: 'Practitioner laptop', scopes });
  service.registerDevice('dev-1', scopes);
  return { library, service };
}

const queueProfile = (library, resourceId, payload) => {
  const opId = operationId({ operation: 'profile.upsert', resourceId, payload });
  library.enqueue(opId, { operation: 'profile.upsert', resourceId, payload });
  return opId;
};

// ---------------------------------------------------- scoped access ----

assert.ok(ALL_SCOPES.length >= 6);
assert.ok(READ_ONLY.every((s) => s.endsWith(':read')));
assert.ok(READ_ONLY.length < FULL_ACCESS.length, 'read-only is a real restriction');
assert.throws(() => assertScopes(['profiles:everything']), /unknown scope/);
assert.throws(() => assertScopes('profiles:read'), /must be an array/);

// A token with no scopes can do nothing. There is no implicit default,
// because the default is exactly what goes wrong.
for (const op of OPERATIONS) {
  assert.throws(() => authorize({ deviceId: 'd', scopes: [] }, op), ScopeError);
}
assert.throws(() => authorize({ deviceId: 'd', scopes: FULL_ACCESS }, 'profile.obliterate'),
  /unknown sync operation/);

// Read does not imply write: a device that shows a chart at a reading must not
// be able to rewrite the birth data.
assert.throws(() => authorize({ deviceId: 'd', scopes: ['profiles:read'] }, 'profile.upsert'), ScopeError);
assert.doesNotThrow(() => authorize({ deviceId: 'd', scopes: ['profiles:write'] }, 'profile.upsert'));

// One resource's scope does not open another's.
assert.throws(
  () => authorize({ deviceId: 'd', scopes: ['profiles:write'] }, 'consultation.upsert'),
  ScopeError,
);

// Revocation is reported before scope: the two call for completely different
// actions by whoever reads the message.
assert.throws(
  () => authorize({ deviceId: 'd', scopes: [], revokedAt: '2026-09-28T00:00:00Z' }, 'profile.upsert'),
  RevokedError,
);

// ----------------------------------------------------- device outbox ----

(async () => {
  {
    const { library, service } = seed();

    // Enqueuing the same operation twice is one row: a crash between writing
    // a profile and queueing its sync row must be safe to repeat.
    const opId = queueProfile(library, 'p1', { name: 'A', baseVersion: 0 });
    const again = queueProfile(library, 'p1', { name: 'A', baseVersion: 0 });
    assert.equal(opId, again, 'the op id is derived from the content, not random');
    assert.equal(library.pendingOutbox().length, 1);

    queueProfile(library, 'p2', { name: 'B', baseVersion: 0 });
    assert.equal(library.outboxStatus().pending, 2);

    // Oldest first, so changes reach the server in the order they were made.
    assert.deepEqual(library.pendingOutbox().map((e) => e.resourceId), ['p1', 'p2']);

    const r = await drainOutbox({ library, transport: service, grant: grantOf(library, 'dev-1') });
    assert.equal(r.protocolVersion, SYNC_PROTOCOL_VERSION);
    assert.equal(r.sent.length, 2);
    assert.ok(r.sent.every((s) => s.applied), 'both were genuinely written');
    assert.equal(library.outboxStatus().pending, 0);
    assert.equal(library.outboxStatus().sent, 2);
    assert.equal(service.writeCount(), 2);
    assert.ok(library.getDevice('dev-1').lastSyncAt, 'a successful drain is recorded');

    library.close();
  }

  // The outbox survives a restart: it is ordinary durable storage, not memory.
  {
    const path = `${require('node:os').tmpdir()}/vj024-${Date.now()}.db`;
    const first = openLibrary(path);
    first.registerDevice('dev-1', { label: 'L', scopes: FULL_ACCESS });
    queueProfile(first, 'p1', { name: 'A', baseVersion: 0 });
    first.close();

    const second = openLibrary(path);
    assert.equal(second.pendingOutbox().length, 1, 'the queue outlives the process');
    assert.equal(second.getDevice('dev-1').label, 'L');
    second.close();
    require('node:fs').rmSync(path, { force: true });
  }

  // -------------------------------------------------- idempotent writes --

  {
    const { library, service } = seed();
    const opId = queueProfile(library, 'p1', { name: 'A', baseVersion: 0 });
    await drainOutbox({ library, transport: service, grant: grantOf(library, 'dev-1') });
    assert.equal(service.writeCount(), 1);
    assert.equal(service.getResource('p1').version, 1);

    // The classic failure: the write succeeded but the acknowledgement was
    // lost, so the client retries. Re-queue the identical operation and drain
    // again — the server must recognise the op_id and not write twice.
    library.enqueue(opId, { operation: 'profile.upsert', resourceId: 'p1', payload: { name: 'A', baseVersion: 0 } });
    // (already sent, so it is not pending — force it back to pending as a
    // redelivery would)
    assert.equal(library.getOutboxEntry(opId).state, 'sent');

    const redelivery = await Promise.resolve(service.apply({
      deviceId: 'dev-1', opId, operation: 'profile.upsert', resourceId: 'p1',
      payload: { name: 'A', baseVersion: 0 },
    }));
    assert.equal(redelivery.ok, true, 'a redelivery is success, not an error');
    assert.equal(redelivery.applied, false, 'but it did not write again');
    assert.equal(service.writeCount(), 1, 'still one write');
    assert.equal(service.getResource('p1').version, 1, 'and the version did not move');

    // A genuinely different edit is a different op id, and does write.
    const opId2 = queueProfile(library, 'p1', { name: 'A corrected', baseVersion: 1 });
    assert.notEqual(opId2, opId);
    await drainOutbox({ library, transport: service, grant: grantOf(library, 'dev-1') });
    assert.equal(service.writeCount(), 2);
    assert.equal(service.getResource('p1').version, 2);

    library.close();
  }

  // ---------------------------------------------------- scope refusal ----

  {
    const { library, service } = seed({ scopes: READ_ONLY });
    queueProfile(library, 'p1', { name: 'A', baseVersion: 0 });
    const r = await drainOutbox({ library, transport: service, grant: grantOf(library, 'dev-1') });

    assert.equal(r.sent.length, 0);
    assert.equal(r.blocked.length, 1);
    assert.match(r.blocked[0].reason, /profiles:write/);
    assert.equal(service.writeCount(), 0, 'nothing reached the server');

    // Parked, not retried: retrying cannot fix a missing scope, and a row
    // retrying forever in silence is how a queue quietly stops working.
    const entry = library.getOutboxEntry(r.blocked[0].opId);
    assert.equal(entry.state, 'blocked');
    assert.ok(entry.lastError);
    assert.equal(library.outboxStatus().pending, 0);
    assert.equal(library.outboxStatus().blocked, 1);

    library.close();
  }

  // ------------------------------------------------------- revocation ----

  {
    const { library, service } = seed();
    queueProfile(library, 'p1', { name: 'A', baseVersion: 0 });
    queueProfile(library, 'p2', { name: 'B', baseVersion: 0 });

    library.revokeDevice('dev-1');
    service.revokeDevice('dev-1');

    const r = await drainOutbox({ library, transport: service, grant: grantOf(library, 'dev-1') });
    assert.equal(r.stopped, 'revoked');
    assert.equal(r.sent.length, 0);
    assert.equal(service.writeCount(), 0);
    // The whole drain stops; it does not plough on offering each operation.
    assert.equal(library.outboxStatus().pending, 2, 'the work is kept, not discarded');

    // The device row survives revocation — losing it would lose the record
    // that it ever had access, which is the first thing anyone asks after.
    const d = library.getDevice('dev-1');
    assert.ok(d, 'the device is still listed');
    assert.ok(d.revokedAt);
    assert.equal(library.listDevices().length, 1);

    // And the server refuses independently, so a client that ignored its own
    // revocation still gets nowhere.
    const direct = service.apply({
      deviceId: 'dev-1', opId: 'x', operation: 'profile.upsert', resourceId: 'p1', payload: {},
    });
    assert.equal(direct.ok, false);
    assert.equal(direct.error, 'revoked');

    library.close();
  }

  // An unknown device is refused too — registering locally is not enough.
  {
    const library = openLibrary(':memory:');
    const service = createLocalSyncService();
    library.registerDevice('rogue', { label: 'R', scopes: FULL_ACCESS });
    queueProfile(library, 'p1', { name: 'A', baseVersion: 0 });
    const r = await drainOutbox({ library, transport: service, grant: grantOf(library, 'rogue') });
    assert.equal(r.blocked.length, 1);
    assert.match(r.blocked[0].reason, /unknown device/);
    library.close();
  }

  // --------------------------------------------- conflicts are surfaced --

  {
    const { library, service } = seed();
    // Another device already moved p1 to version 3.
    service.seed('p1', 3, { name: 'edited elsewhere' });

    queueProfile(library, 'p1', { name: 'edited here', baseVersion: 1 });
    const r = await drainOutbox({ library, transport: service, grant: grantOf(library, 'dev-1') });

    assert.equal(r.sent.length, 0);
    assert.equal(r.conflicts.length, 1);
    assert.equal(r.conflicts[0].resourceId, 'p1');
    assert.deepEqual(r.conflicts[0].localPayload, { name: 'edited here', baseVersion: 1 });
    assert.equal(r.conflicts[0].remote.version, 3);
    assert.equal(r.conflicts[0].remote.payload.name, 'edited elsewhere');

    // Neither side is lost: the remote is untouched and the local change is
    // still queued, waiting for a person (VJ-025).
    assert.equal(service.getResource('p1').payload.name, 'edited elsewhere');
    assert.equal(library.getOutboxEntry(r.conflicts[0].opId).state, 'pending');
    assert.equal(library.outboxStatus().pending, 1);

    library.close();
  }

  // -------------------------------------------- retryable vs permanent --

  {
    const { library } = seed();
    queueProfile(library, 'p1', { name: 'A', baseVersion: 0 });
    const offline = { apply: () => { throw new Error('ECONNREFUSED'); } };

    const r = await drainOutbox({ library, transport: offline, grant: grantOf(library, 'dev-1') });
    assert.equal(r.retryable.length, 1);
    assert.equal(r.blocked.length, 0);
    const entry = library.getOutboxEntry(r.retryable[0].opId);
    assert.equal(entry.state, 'pending', 'a network failure stays pending');
    assert.equal(entry.attempts, 1);
    assert.match(entry.lastError, /ECONNREFUSED/);

    // Draining again while still offline increments rather than duplicating.
    await drainOutbox({ library, transport: offline, grant: grantOf(library, 'dev-1') });
    assert.equal(library.getOutboxEntry(r.retryable[0].opId).attempts, 2);
    assert.equal(library.outboxStatus().pending, 1);

    library.close();
  }

  // ----------------------------------------------------- cancellation ----

  {
    const { library, service } = seed();
    for (let i = 0; i < 5; i += 1) queueProfile(library, `p${i}`, { name: `N${i}`, baseVersion: 0 });
    const controller = new AbortController();
    controller.abort();
    const r = await drainOutbox({
      library, transport: service, grant: grantOf(library, 'dev-1'), signal: controller.signal,
    });
    assert.equal(r.stopped, 'aborted');
    assert.equal(r.sent.length, 0);
    assert.equal(library.outboxStatus().pending, 5);
    library.close();
  }

  // --------------------------------------------------- input guards -----

  {
    const { library, service } = seed();
    await assert.rejects(() => drainOutbox({ transport: service, grant: { deviceId: 'd', scopes: [] } }),
      /library is required/);
    await assert.rejects(() => drainOutbox({ library, transport: {}, grant: { deviceId: 'd', scopes: [] } }),
      /transport must have apply/);
    await assert.rejects(() => drainOutbox({ library, transport: service, grant: null }),
      /grant is required/);
    await assert.rejects(
      () => drainOutbox({ library, transport: service, grant: { deviceId: 'd', scopes: ['nope'] } }),
      /unknown scope/,
    );
    assert.throws(() => library.enqueue('', { operation: 'x' }), /opId is required/);
    assert.throws(() => library.registerDevice('d', { scopes: [] }), /needs a label/);
    library.close();
  }

  console.log(JSON.stringify({
    pass: true,
    protocol: SYNC_PROTOCOL_VERSION,
    scopes: ALL_SCOPES.length,
    operations: OPERATIONS.length,
    covered: ['scoped access', 'device outbox', 'idempotent writes', 'revocation',
      'conflicts surfaced', 'retryable vs blocked', 'cancellation', 'restart'],
  }, null, 2));
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
