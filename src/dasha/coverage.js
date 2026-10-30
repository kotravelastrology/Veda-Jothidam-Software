/**
 * VJ-027 — coverage labels for dasha methods, and the gate that stops an
 * unverified one reaching a client.
 *
 * Acceptance: *independent worked examples; coverage labels before promotion*.
 *
 * ## Why this exists before any new dasha is written
 *
 * PL9 offers around twenty-three dasha systems; this software has four. The
 * tempting move is to write the other nineteen tables from general knowledge
 * and ship them. That is precisely the defect VJ-003 removed and VJ-018 and
 * VJ-026 found surviving elsewhere: output that looks sourced because it looks
 * confident.
 *
 * So the acceptance criterion is taken literally. A method carries a coverage
 * label, and **only a VERIFIED method is promoted** — shown by default, usable
 * in a report. Everything below that is visible only when the practitioner
 * asks for it, and carries its label on screen.
 *
 * ## The four levels
 *
 * - `VERIFIED` — a source locator *and* an independent worked example that
 *   replays exactly. Promotable.
 * - `SOURCED` — a source locator recorded, no worked example yet. The rule was
 *   read from a text; nobody has checked the engine reproduces a published
 *   result.
 * - `STRUCTURE_ONLY` — the table is present and its arithmetic self-checks
 *   (the per-lord years sum to the stated total), but **nobody has read it
 *   against a text**. The sum check catches a transcription slip; it says
 *   nothing about whether the table is right.
 * - `DECLARED` — the method is known to exist and is deliberately not
 *   implemented, because the table could not be established without guessing.
 *
 * The distinction between `STRUCTURE_ONLY` and `DECLARED` is where the
 * honesty lives. A table entered from memory and labelled `SOURCED` would be
 * a lie; entered from memory, labelled `STRUCTURE_ONLY` and gated is a
 * candidate awaiting verification; guessed and labelled anything at all is
 * not acceptable, which is why methods whose tables could not be established
 * are `DECLARED` with no table at all.
 */

const { UnsupportedInputError } = require('../contracts/chartContext');

const LEVELS = ['VERIFIED', 'SOURCED', 'STRUCTURE_ONLY', 'DECLARED'];

/** Only this level may be shown without the practitioner opting in. */
const PROMOTED_LEVEL = 'VERIFIED';

const LEVEL_TA = {
  VERIFIED: 'சரிபார்க்கப்பட்டது',
  SOURCED: 'ஆதாரம் உண்டு — உதாரணம் சரிபார்க்கப்படவில்லை',
  STRUCTURE_ONLY: 'அட்டவணை மட்டும் — நூலுடன் ஒப்பிடப்படவில்லை',
  DECLARED: 'அறியப்பட்டது — செயல்படுத்தப்படவில்லை',
};

const LEVEL_NOTE_TA = {
  VERIFIED: 'ஆதாரப் பக்கமும், தனித்த ஒரு worked example-உம் உள்ளன; '
    + 'engine அந்த உதாரணத்தை அப்படியே மீளுருவாக்குகிறது.',
  SOURCED: 'விதி ஒரு நூலிலிருந்து எடுக்கப்பட்டது. ஆனால் வெளியிடப்பட்ட ஒரு '
    + 'முடிவை இந்த engine மீளுருவாக்குகிறதா என்பது சோதிக்கப்படவில்லை.',
  STRUCTURE_ONLY: 'அட்டவணையின் கணக்கு சரியாக உள்ளது (ஆண்டுகளின் கூட்டுத்தொகை '
    + 'மொத்தத்துடன் பொருந்துகிறது) — ஆனால் அதை யாரும் நூலுடன் ஒப்பிட்டுப் '
    + 'பார்க்கவில்லை. கூட்டுத்தொகைச் சோதனை நகல் பிழையைப் பிடிக்கும்; அட்டவணை '
    + 'சரியானதா என்பதைச் சொல்லாது.',
  DECLARED: 'இந்த முறை உள்ளது என்பது தெரியும். ஆனால் அதன் அட்டவணையை ஊகிக்காமல் '
    + 'நிறுவ முடியவில்லை, எனவே வேண்டுமென்றே செயல்படுத்தப்படவில்லை.',
};

/**
 * Describes one dasha method's verification state.
 *
 * The invariants are enforced here rather than left to reviewers, because the
 * failure mode is a label that drifts upward: a method acquires a table, keeps
 * its old label, and quietly becomes production output.
 */
function createCoverage({
  id, name, nameTa, family, level,
  source = null, workedExample = null, implemented = false, notes = null,
}) {
  if (!id) throw new UnsupportedInputError('id is required', 'id');
  if (!name || !nameTa) throw new UnsupportedInputError(`${id}: name and nameTa are required`, 'name');
  if (!family) throw new UnsupportedInputError(`${id}: family is required`, 'family');
  if (!LEVELS.includes(level)) {
    throw new UnsupportedInputError(`${id}: unknown coverage level ${level}`, 'level');
  }

  // VERIFIED means both halves of the acceptance are present. Without the
  // worked example it is SOURCED, whatever anyone intended.
  if (level === 'VERIFIED' && !(source && workedExample)) {
    throw new UnsupportedInputError(
      `${id}: VERIFIED needs both a source locator and a worked example`, 'level',
    );
  }
  if (level === 'SOURCED' && !source) {
    throw new UnsupportedInputError(`${id}: SOURCED needs a source locator`, 'source');
  }
  // A claimed source must actually locate something.
  if (source && !source.pageLocus) {
    throw new UnsupportedInputError(`${id}: a source without a pageLocus locates nothing`, 'source');
  }
  // STRUCTURE_ONLY exists precisely because there is no source; claiming one
  // would mean the label understates what is known, which hides a promotion.
  if (level === 'STRUCTURE_ONLY' && source) {
    throw new UnsupportedInputError(
      `${id}: STRUCTURE_ONLY must not carry a source — label it SOURCED`, 'level',
    );
  }
  if (level === 'DECLARED' && implemented) {
    throw new UnsupportedInputError(
      `${id}: DECLARED means deliberately not implemented`, 'implemented',
    );
  }
  if (level !== 'DECLARED' && !implemented) {
    throw new UnsupportedInputError(
      `${id}: a method above DECLARED must be implemented`, 'implemented',
    );
  }

  return Object.freeze({
    id, name, nameTa, family, level,
    source: source ? Object.freeze({ ...source }) : null,
    workedExample,
    implemented,
    notes,
    promoted: level === PROMOTED_LEVEL,
    levelTa: LEVEL_TA[level],
    levelNoteTa: LEVEL_NOTE_TA[level],
  });
}

/**
 * The gate. A method below VERIFIED is refused unless the caller explicitly
 * says it accepts unverified methods — so the default path cannot produce one
 * by omission.
 */
function assertPromotable(coverage, { allowUnverified = false } = {}) {
  if (!coverage) throw new UnsupportedInputError('coverage is required', 'coverage');
  if (coverage.promoted) return coverage;
  if (!allowUnverified) {
    throw new UnsupportedInputError(
      `${coverage.id} is ${coverage.level}, not ${PROMOTED_LEVEL}: ${LEVEL_NOTE_TA[coverage.level]} `
      + '(pass allowUnverified to use it anyway)',
      'coverage',
    );
  }
  if (!coverage.implemented) {
    throw new UnsupportedInputError(
      `${coverage.id} is DECLARED and has no table; there is nothing to compute`, 'coverage',
    );
  }
  return coverage;
}

module.exports = {
  LEVELS, PROMOTED_LEVEL, LEVEL_TA, LEVEL_NOTE_TA,
  createCoverage, assertPromotable,
};
