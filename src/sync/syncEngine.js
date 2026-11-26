/**
 * VJ-024 — draining the device outbox to a sync service.
 *
 * Acceptance: scoped access; device outbox; idempotent writes; revocation.
 *
 * ## What this is, and what it is not
 *
 * This is the **client half and the protocol contract**. There is no hosted
 * service, and none is claimed. ADR-05 makes sync optional: the product works
 * fully with the outbox empty and never drained, which is why the outbox lives
 * in the ordinary library database rather than behind a network layer.
 *
 * A `SyncTransport` is anything with `apply(request)`. `tests/` drives the
 * engine against a faithful in-process implementation, so the behaviour that
 * matters — idempotency, revocation, scope enforcement, conflict surfacing —
 * is verified without pretending a server exists.
 *
 * ## Why the outbox exists at all
 *
 * Writing straight to a server means a change made on a train is lost, or the
 * UI blocks until the network answers. Queueing locally and draining later
 * makes offline the normal case rather than an error path — and it is the only
 * design where "the write succeeded" can be true the moment the practitioner
 * finishes typing.
 *
 * ## Four failure kinds, deliberately distinguished
 *
 * - **retryable** (network, 5xx): stays pending, attempts increments.
 * - **blocked** (scope refused): parked. Retrying cannot fix a missing scope,
 *   and a row retrying forever in silence is how a queue quietly stops working.
 * - **revoked**: the whole drain stops immediately. Continuing to offer
 *   operations from a revoked device is pointless and looks like an attack.
 * - **conflict**: the server holds a newer version. Never resolved here —
 *   collected and handed back for VJ-025 to put in front of a person, because
 *   the one thing worse than a conflict is a silent overwrite.
 */

const crypto = require('node:crypto');

const { UnsupportedInputError } = require('../contracts/chartContext');
const { authorize, assertScopes, ScopeError, RevokedError } = require('./scopes');

const SYNC_PROTOCOL_VERSION = 'VJ024-SYNC-001';

/**
 * A stable operation id.
 *
 * Derived from the content, not random, so the *same* change produced twice —
 * by a retried caller, or by a crash between writing and enqueuing — is one
 * operation. A random id would make a retry look like a second edit.
 */
function operationId({ operation, resourceId, revision, payload }) {
  const canonical = JSON.stringify(canonicalise({ operation, resourceId, revision, payload }));
  return crypto.createHash('sha256').update(canonical).digest('hex').slice(0, 32);
}

function canonicalise(value) {
  if (Array.isArray(value)) return value.map(canonicalise);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((k) => [k, canonicalise(value[k])]));
  }
  return value;
}

/** Classifies what the transport said, so the drain can react correctly. */
function classify(response) {
  if (!response || typeof response !== 'object') return 'retryable';
  if (response.ok) return 'ok';
  switch (response.error) {
    case 'revoked': return 'revoked';
    case 'forbidden': return 'blocked';
    case 'conflict': return 'conflict';
    default: return 'retryable';
  }
}

/**
 * Sends pending outbox rows, oldest first.
 *
 * @param library   an open VJ-011 repository
 * @param transport { apply(request) => { ok } | { ok:false, error, ... } }
 * @param grant     { deviceId, scopes, revokedAt }
 * @param signal    AbortSignal — checked between operations
 */
async function drainOutbox({
  library, transport, grant, signal, limit = 100, onProgress,
}) {
  if (!library) throw new UnsupportedInputError('library is required', 'library');
  if (!transport || typeof transport.apply !== 'function') {
    throw new UnsupportedInputError('transport must have apply()', 'transport');
  }
  if (!grant || !grant.deviceId) throw new UnsupportedInputError('a grant is required', 'grant');
  assertScopes(grant.scopes ?? []);

  const result = {
    protocolVersion: SYNC_PROTOCOL_VERSION,
    deviceId: grant.deviceId,
    sent: [], blocked: [], conflicts: [], retryable: [],
    stopped: null,
  };

  // A revoked device is refused before anything is read from the outbox: it
  // has no business learning what is queued.
  if (grant.revokedAt) {
    result.stopped = 'revoked';
    return result;
  }

  const pending = library.pendingOutbox({ limit });

  for (const entry of pending) {
    if (signal?.aborted) { result.stopped = 'aborted'; break; }

    // Scope is checked locally first. Sending an operation this device is not
    // allowed to make, just to be told so, leaks what the practitioner is
    // doing to a service that has already said no.
    try {
      authorize(grant, entry.operation);
    } catch (error) {
      if (error instanceof RevokedError) {
        result.stopped = 'revoked';
        break;
      }
      if (error instanceof ScopeError) {
        library.markBlocked(entry.opId, error.message);
        result.blocked.push({ opId: entry.opId, reason: error.message });
        continue;
      }
      throw error;
    }

    let response;
    try {
      response = await transport.apply({
        protocolVersion: SYNC_PROTOCOL_VERSION,
        deviceId: grant.deviceId,
        opId: entry.opId,
        operation: entry.operation,
        resourceId: entry.resourceId,
        payload: entry.payload,
      });
    } catch (error) {
      response = { ok: false, error: 'transport', message: error.message };
    }

    switch (classify(response)) {
      case 'ok':
        library.markSent(entry.opId);
        // `applied: false` means the server had already seen this op_id and
        // did nothing — which is success, not a duplicate write.
        result.sent.push({ opId: entry.opId, applied: response.applied !== false });
        break;
      case 'revoked':
        result.stopped = 'revoked';
        break;
      case 'blocked':
        library.markBlocked(entry.opId, response.message ?? 'forbidden');
        result.blocked.push({ opId: entry.opId, reason: response.message ?? 'forbidden' });
        break;
      case 'conflict':
        // Left pending on purpose. The change is not lost, and it is not
        // applied either, until a person decides (VJ-025).
        library.markFailed(entry.opId, 'conflict');
        result.conflicts.push({
          opId: entry.opId,
          resourceId: entry.resourceId,
          operation: entry.operation,
          localPayload: entry.payload,
          remote: response.remote ?? null,
        });
        break;
      default:
        library.markFailed(entry.opId, response.message ?? 'unavailable');
        result.retryable.push({ opId: entry.opId, reason: response.message ?? 'unavailable' });
        break;
    }

    if (result.stopped === 'revoked') break;
    if (onProgress) {
      onProgress({
        done: result.sent.length + result.blocked.length + result.conflicts.length + result.retryable.length,
        total: pending.length,
      });
    }
  }

  if (result.stopped !== 'revoked' && result.sent.length > 0) {
    library.noteDeviceSync(grant.deviceId);
  }
  result.status = library.outboxStatus();
  return result;
}

module.exports = {
  drainOutbox, operationId, canonicalise, classify, SYNC_PROTOCOL_VERSION,
};
