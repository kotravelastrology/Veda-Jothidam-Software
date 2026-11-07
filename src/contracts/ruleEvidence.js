const { UnsupportedInputError } = require('./chartContext');

const RULE_EVIDENCE_VERSION = 'VJ006-EV-001';

/**
 * VJ-006 — RuleEvidence.
 *
 * One doctrinal rule's outcome together with where the rule came from and
 * what it was applied to. This formalises the discipline the calculators
 * already follow by hand (`attachSource`, `sourceRequired`) into a shape the
 * UI and reports can render uniformly: every claim shown to a user can be
 * traced to a page.
 *
 * A rule that has no verified source does not get a fabricated outcome. It
 * gets `withheldEvidence()`, which carries the same SOURCE_REQUIRED status the
 * engine already uses.
 */
function createRuleEvidence({ ruleId, name, outcome, source, appliedTo = null, notes = null }) {
  if (!ruleId) throw new UnsupportedInputError('ruleId is required', 'ruleId');
  if (!name) throw new UnsupportedInputError('name is required', 'name');
  if (outcome === undefined) throw new UnsupportedInputError('outcome is required', 'outcome');

  // Same provenance fields attachSource() demands, so evidence cannot be
  // weaker than what the calculators already stamp on their results.
  for (const field of ['title', 'author', 'file', 'pageLocus', 'tradition', 'convention']) {
    if (!source || !source[field]) {
      throw new UnsupportedInputError(`source.${field} is required for rule evidence`, field);
    }
  }

  return Object.freeze({
    evidenceVersion: RULE_EVIDENCE_VERSION,
    ruleId,
    name,
    status: 'APPLIED',
    outcome,
    appliedTo: appliedTo ? Object.freeze({ ...appliedTo }) : null,
    notes,
    source: Object.freeze({ ...source }),
  });
}

/**
 * Evidence for a rule that cannot be honestly stated yet. Mirrors
 * `sourceRequired()` so the UI can treat both the same way, and keeps the
 * reason visible instead of letting a gap read as a negative finding.
 */
function withheldEvidence({ ruleId, name, reason, appliedTo = null }) {
  if (!ruleId) throw new UnsupportedInputError('ruleId is required', 'ruleId');
  if (!reason) throw new UnsupportedInputError('reason is required to withhold a rule', 'reason');

  return Object.freeze({
    evidenceVersion: RULE_EVIDENCE_VERSION,
    ruleId,
    name: name ?? ruleId,
    status: 'SOURCE_REQUIRED',
    outcome: null,
    appliedTo: appliedTo ? Object.freeze({ ...appliedTo }) : null,
    reason,
    message: 'ஆதாரம் தேவை / SOURCE REQUIRED',
    source: null,
  });
}

function assertRuleEvidence(value, label = 'value') {
  if (!value || typeof value !== 'object') {
    throw new UnsupportedInputError(`${label} is not RuleEvidence`, label);
  }
  if (value.evidenceVersion !== RULE_EVIDENCE_VERSION) {
    throw new UnsupportedInputError(`${label}.evidenceVersion is wrong or missing`, 'evidenceVersion');
  }
  if (!value.ruleId) throw new UnsupportedInputError(`${label}.ruleId is required`, 'ruleId');

  if (value.status === 'APPLIED') {
    if (!value.source) throw new UnsupportedInputError(`${label}.source is required when APPLIED`, 'source');
    for (const field of ['title', 'pageLocus', 'tradition']) {
      if (!value.source[field]) {
        throw new UnsupportedInputError(`${label}.source.${field} is required`, field);
      }
    }
  } else if (value.status === 'SOURCE_REQUIRED') {
    if (!value.reason) throw new UnsupportedInputError(`${label}.reason is required when withheld`, 'reason');
  } else {
    throw new UnsupportedInputError(`${label}.status must be APPLIED or SOURCE_REQUIRED`, 'status');
  }
  return value;
}

module.exports = {
  createRuleEvidence,
  withheldEvidence,
  assertRuleEvidence,
  RULE_EVIDENCE_VERSION,
};
