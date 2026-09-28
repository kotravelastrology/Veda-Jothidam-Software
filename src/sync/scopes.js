/**
 * VJ-024 — what a device token is allowed to do.
 *
 * Acceptance names "scoped access" first, and it is first for a reason. The
 * easy design is one token that means "this is me", and then every device that
 * has ever been signed in can read and rewrite everything — including the
 * consultation notes and the client contact details the VJ-011 library holds.
 * A practitioner's phone, a laptop lent to an assistant and a desktop in a
 * shared office are not the same trust level, and a single token cannot say so.
 *
 * So a token carries an explicit set of scopes, checked per operation. A token
 * with no scopes can do nothing; there is no implicit default, because the
 * default is exactly what goes wrong.
 */

const { UnsupportedInputError } = require('../contracts/chartContext');

/**
 * Read and write are separate for every resource. A device that should be
 * able to *show* a chart at a consultation does not need to be able to
 * rewrite the birth data.
 */
const SCOPES = {
  'profiles:read': 'ஜாதகங்களைப் படிக்க',
  'profiles:write': 'ஜாதகங்களைச் சேர்க்க / திருத்த',
  'consultations:read': 'ஆலோசனைக் குறிப்புகளைப் படிக்க',
  'consultations:write': 'ஆலோசனைக் குறிப்புகளை எழுத',
  'journal:read': 'நிகழ்வுப் பதிவைப் படிக்க',
  'journal:write': 'நிகழ்வுப் பதிவில் எழுத',
};

const ALL_SCOPES = Object.keys(SCOPES);

/** Which scope each sync operation needs. */
const OPERATION_SCOPES = {
  'profile.upsert': 'profiles:write',
  'profile.delete': 'profiles:write',
  'consultation.upsert': 'consultations:write',
  'journal.append': 'journal:write',
};

const OPERATIONS = Object.keys(OPERATION_SCOPES);

/** A sensible starting set for a practitioner's own second device. */
const FULL_ACCESS = Object.freeze([...ALL_SCOPES]);
/** For a device that should display but not alter — a tablet at a reading. */
const READ_ONLY = Object.freeze(ALL_SCOPES.filter((s) => s.endsWith(':read')));

class ScopeError extends Error {
  constructor(message, { operation, required, granted }) {
    super(message);
    this.name = 'ScopeError';
    this.operation = operation;
    this.required = required;
    this.granted = granted;
  }
}

class RevokedError extends Error {
  constructor(deviceId, revokedAt) {
    super(`device ${deviceId} was revoked at ${revokedAt}`);
    this.name = 'RevokedError';
    this.deviceId = deviceId;
    this.revokedAt = revokedAt;
  }
}

function assertScopes(scopes) {
  if (!Array.isArray(scopes)) {
    throw new UnsupportedInputError('scopes must be an array', 'scopes');
  }
  const unknown = scopes.filter((s) => !ALL_SCOPES.includes(s));
  if (unknown.length) {
    throw new UnsupportedInputError(`unknown scope(s): ${unknown.join(', ')}`, 'scopes');
  }
  return scopes;
}

/**
 * The single check every write passes through.
 *
 * Revocation is tested *before* scope, so a revoked device is told it is
 * revoked rather than being told it lacks a scope — the two call for
 * completely different actions by whoever reads the message.
 */
function authorize(grant, operation) {
  if (!grant) throw new UnsupportedInputError('a grant is required', 'grant');
  if (grant.revokedAt) {
    throw new RevokedError(grant.deviceId, grant.revokedAt);
  }
  const required = OPERATION_SCOPES[operation];
  if (!required) {
    throw new UnsupportedInputError(`unknown sync operation ${operation}`, 'operation');
  }
  if (!grant.scopes.includes(required)) {
    throw new ScopeError(
      `${operation} needs ${required}; this device has [${grant.scopes.join(', ') || 'none'}]`,
      { operation, required, granted: [...grant.scopes] },
    );
  }
  return required;
}

module.exports = {
  SCOPES, ALL_SCOPES, OPERATION_SCOPES, OPERATIONS, FULL_ACCESS, READ_ONLY,
  assertScopes, authorize, ScopeError, RevokedError,
};
