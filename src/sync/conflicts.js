/**
 * VJ-025 — putting a conflict in front of a person.
 *
 * Acceptance: *same birth-time edit on two devices → explicit review; no
 * silent loss*.
 *
 * VJ-024 detects conflicts and refuses to resolve them. This decides what a
 * resolution can be, and makes the two guarantees structural rather than
 * intentions:
 *
 * **Explicit review.** There is no default resolution and no "merge
 * automatically" path. `RESOLUTIONS` is a closed set, and `resolveConflict`
 * refuses anything outside it. A conflict cannot be cleared by doing nothing,
 * because doing nothing leaves it open.
 *
 * **No silent loss.** The losing side is never deleted. Both payloads stay in
 * the conflict row for good, so a discarded edit can always be read back and
 * any resolution can be explained afterwards. That is a property of the
 * schema, not a promise about the screen.
 *
 * ## Why birth fields get their own treatment
 *
 * The acceptance names the birth time specifically, and it is the right
 * example: a minute's difference moves house cusps, can change the lagna
 * outright, and silently invalidates every reading already given from the old
 * time. A diff that lists it as one changed field among a dozen buries the one
 * thing the practitioner has to look at, so birth fields are marked and
 * surfaced first.
 */

const crypto = require('node:crypto');

const { UnsupportedInputError } = require('../contracts/chartContext');

/** The only decisions a person may make. There is deliberately no default. */
const RESOLUTIONS = {
  KEEP_LOCAL: 'இந்தச் சாதனத்தின் திருத்தத்தை வை',
  KEEP_REMOTE: 'மற்ற சாதனத்தின் திருத்தத்தை வை',
  KEEP_BOTH: 'இரண்டையும் வை — மற்றதை ஏற்று, இதை ஒரு புதிய திருத்தமாகச் சேர்',
};

const RESOLUTION_IDS = Object.keys(RESOLUTIONS);

/**
 * Fields whose difference changes the chart itself rather than its labelling.
 * A disagreement in any of these is not a metadata clash.
 */
const BIRTH_FIELDS = new Set([
  'year', 'month', 'day', 'hour', 'minute', 'second',
  'latitude', 'longitude', 'utcOffsetMinutes', 'ianaTimeZone',
]);

/** Fields that describe the calculation rather than the birth. */
const SETTING_FIELDS = new Set(['ayanamsha', 'houseSystem', 'nodeType', 'calendarMode']);

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/**
 * A field-by-field comparison of the two sides.
 *
 * Fields present on only one side are reported too — an edit that *removes* a
 * value is a change, and a diff that only walked the keys both sides share
 * would miss it entirely.
 */
function diffPayloads(local, remote) {
  const l = local ?? {};
  const r = remote ?? {};
  const keys = [...new Set([...Object.keys(l), ...Object.keys(r)])].sort();

  const fields = keys
    .filter((k) => k !== 'baseVersion')
    .map((key) => ({
      key,
      local: l[key],
      remote: r[key],
      changed: !same(l[key], r[key]),
      kind: BIRTH_FIELDS.has(key) ? 'birth' : SETTING_FIELDS.has(key) ? 'setting' : 'other',
      onlyOn: key in l && !(key in r) ? 'local' : key in r && !(key in l) ? 'remote' : null,
    }));

  const changed = fields.filter((f) => f.changed);
  return {
    fields,
    changed,
    // Birth fields first: they are what the practitioner must look at.
    changedBirthFields: changed.filter((f) => f.kind === 'birth'),
    changedSettingFields: changed.filter((f) => f.kind === 'setting'),
    affectsChart: changed.some((f) => f.kind === 'birth' || f.kind === 'setting'),
  };
}

/** A stable id, so the same conflict seen twice is one row to review. */
function conflictId({ opId, resourceId, remoteVersion }) {
  return crypto.createHash('sha256')
    .update(`${opId}|${resourceId}|${remoteVersion ?? ''}`)
    .digest('hex').slice(0, 24);
}

/**
 * Persists the conflicts a drain reported, so they survive the page that
 * found them.
 */
function recordConflicts(library, conflicts) {
  const ids = [];
  for (const c of conflicts) {
    const id = conflictId({
      opId: c.opId, resourceId: c.resourceId, remoteVersion: c.remote?.version,
    });
    library.recordConflict(id, {
      opId: c.opId,
      resourceId: c.resourceId,
      operation: c.operation,
      localPayload: c.localPayload,
      remote: c.remote,
    });
    ids.push(id);
  }
  return ids;
}

/** The review a person is shown: both sides, the diff, and the choices. */
function reviewConflict(library, id) {
  const conflict = library.getConflict(id);
  if (!conflict) throw new UnsupportedInputError(`no conflict ${id}`, 'conflictId');
  const diff = diffPayloads(conflict.localPayload, conflict.remotePayload);
  return {
    ...conflict,
    diff,
    choices: RESOLUTION_IDS.map((rid) => ({ id: rid, label: RESOLUTIONS[rid] })),
    // A conflict in the birth data is not a merge candidate: two different
    // birth times are two different charts, not two halves of one.
    mergeable: !diff.affectsChart,
  };
}

/**
 * Applies a decision.
 *
 * The outbox row is what actually changes: `KEEP_LOCAL` re-bases the local
 * operation onto the remote version so it applies next drain; `KEEP_REMOTE`
 * blocks it so it is never sent; `KEEP_BOTH` re-bases it, exactly like
 * `KEEP_LOCAL`, because VJ-011 appends revisions rather than overwriting — so
 * accepting the remote and then applying the local edit on top leaves both
 * readable in the profile's history.
 *
 * Under every branch the conflict row keeps both payloads.
 */
function resolveConflict(library, id, resolution) {
  if (!RESOLUTION_IDS.includes(resolution)) {
    throw new UnsupportedInputError(
      `unknown resolution ${JSON.stringify(resolution)}; choose one of ${RESOLUTION_IDS.join(', ')}`,
      'resolution',
    );
  }
  const conflict = library.getConflict(id);
  if (!conflict) throw new UnsupportedInputError(`no conflict ${id}`, 'conflictId');
  if (conflict.state !== 'open') {
    throw new UnsupportedInputError(`conflict ${id} is already ${conflict.state}`, 'state');
  }

  if (resolution === 'KEEP_REMOTE') {
    // The local edit is not sent. It is not deleted either — it stays in the
    // conflict row, which is the whole point.
    library.markBlocked(conflict.opId, `superseded by remote v${conflict.remoteVersion}`);
  } else {
    // Re-base: the operation keeps its intent but now declares the version it
    // was reviewed against, so the server will accept it instead of reporting
    // the same conflict again.
    const rebased = { ...conflict.localPayload, baseVersion: conflict.remoteVersion };
    library.enqueue(`${conflict.opId}-r${conflict.remoteVersion}`, {
      operation: conflict.operation,
      resourceId: conflict.resourceId,
      payload: rebased,
    });
    library.markBlocked(conflict.opId, `re-based as ${conflict.opId}-r${conflict.remoteVersion}`);
  }

  library.resolveConflict(id, { resolution });
  return {
    conflictId: id,
    resolution,
    // Always true by construction; asserted in the test so it stays true.
    localPayloadRetained: library.getConflict(id).localPayload !== null,
  };
}

module.exports = {
  RESOLUTIONS, RESOLUTION_IDS, BIRTH_FIELDS, SETTING_FIELDS,
  diffPayloads, conflictId, recordConflicts, reviewConflict, resolveConflict,
};
