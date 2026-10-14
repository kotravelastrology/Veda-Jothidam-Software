/**
 * VJ-024 — a faithful in-process implementation of the sync service contract.
 *
 * This is not a mock that returns whatever the test wants. It enforces the
 * server's half of the protocol for real: it keeps its own record of applied
 * `op_id`s, its own resource versions, its own device grants and revocations.
 * A test driving it is therefore testing the actual rules, not a rehearsal of
 * them.
 *
 * It exists because there is no hosted service, and writing half of one that
 * nobody runs is how a repository ends up with capabilities that were never
 * true. When a real service is built, it must satisfy this same contract —
 * and the tests here are the specification of what that means.
 *
 * ## The idempotency rule
 *
 * The server records every `op_id` it has applied. A redelivered operation
 * returns `{ ok: true, applied: false }` — success, because the caller's
 * intent is satisfied, and `applied: false` so the client can tell the
 * difference between "written" and "already written". Without that record,
 * a network timeout followed by a retry writes the change twice, and for an
 * append-only journal that is a duplicate entry nobody can explain.
 */

const { authorize, RevokedError, ScopeError } = require('./scopes');

function createLocalSyncService() {
  /** op_id -> what it did. The idempotency ledger. */
  const applied = new Map();
  /** resourceId -> { version, payload } */
  const resources = new Map();
  /** deviceId -> { scopes, revokedAt } */
  const devices = new Map();
  const log = [];

  return {
    registerDevice(deviceId, scopes) {
      devices.set(deviceId, { deviceId, scopes: [...scopes], revokedAt: null });
      return { deviceId };
    },

    revokeDevice(deviceId, at = new Date().toISOString()) {
      const d = devices.get(deviceId);
      if (!d) return { revoked: false };
      d.revokedAt = at;
      return { revoked: true, at };
    },

    /** Seeds a resource at a version, to set up a conflict. */
    seed(resourceId, version, payload) {
      resources.set(resourceId, { version, payload });
    },

    getResource(resourceId) {
      return resources.get(resourceId) ?? null;
    },

    appliedCount() { return applied.size; },
    writeCount() { return log.filter((l) => l.applied).length; },
    history() { return [...log]; },

    apply(request) {
      const { deviceId, opId, operation, resourceId, payload } = request;
      const device = devices.get(deviceId);

      if (!device) {
        return { ok: false, error: 'forbidden', message: `unknown device ${deviceId}` };
      }

      // Revocation is checked before idempotency: a revoked device must not
      // even be told that its operation was already applied.
      if (device.revokedAt) {
        return { ok: false, error: 'revoked', revokedAt: device.revokedAt };
      }

      try {
        authorize({ deviceId, scopes: device.scopes, revokedAt: device.revokedAt }, operation);
      } catch (error) {
        if (error instanceof RevokedError) {
          return { ok: false, error: 'revoked', revokedAt: device.revokedAt };
        }
        if (error instanceof ScopeError) {
          return { ok: false, error: 'forbidden', message: error.message };
        }
        return { ok: false, error: 'bad_request', message: error.message };
      }

      // Already applied: report success without writing again.
      if (applied.has(opId)) {
        log.push({ opId, operation, applied: false });
        return { ok: true, applied: false, version: applied.get(opId).version };
      }

      const current = resources.get(resourceId);
      const baseVersion = payload && typeof payload === 'object' ? payload.baseVersion : undefined;

      // A write that names the version it was based on, against a resource
      // that has since moved, is a conflict. Applying it would silently
      // discard whatever the other device wrote.
      if (current && baseVersion !== undefined && baseVersion !== current.version) {
        return {
          ok: false,
          error: 'conflict',
          remote: { version: current.version, payload: current.payload },
        };
      }

      const version = (current?.version ?? 0) + 1;
      if (operation === 'profile.delete') {
        resources.delete(resourceId);
      } else {
        resources.set(resourceId, { version, payload });
      }
      applied.set(opId, { operation, resourceId, version });
      log.push({ opId, operation, applied: true });
      return { ok: true, applied: true, version };
    },
  };
}

module.exports = { createLocalSyncService };
