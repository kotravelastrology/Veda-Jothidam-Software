/**
 * KP Muhurat — the 80-event legacy KP suitability catalog.
 *
 * Ported from the prior kp-muhurat-workspace (`kp_muhurat/events.py`:
 * load_events, planet_significators, evaluate_event, grade_event) plus its
 * `data/events.txt` (copied verbatim to `data/kp-events.txt`) and Tamil
 * names (`data/kp-event-names-ta.json`). Screenshot-validated there against
 * all 80 reference events.
 *
 * SCOPE: the cusp / DBAS house-rule grading (RED / GREEN / DARK_GREEN /
 * REVIEW). The ~35 event-specific special-condition prose branches and the
 * 1-second sub-lord-transition election scan from that engine are NOT
 * ported yet — this evaluates a fixed chart's cuspal sub-lord significators
 * against each event's favorable / unfavorable house lists.
 */
const { vimshottariLevels, planetSignificators } = require('./kpSystem');

// Pre-parsed from `data/kp-events.txt` + `kp-event-names-ta.json` at commit
// time via `parseEventsTxt` below — bundlers reliably include a required
// JSON, not an fs.readFileSync of a .txt at runtime. Regenerate with:
//   node -e "require('fs').writeFileSync('src/report/data/kp-events.json', \
//     JSON.stringify(require('./src/report/kpEvents').parseEventsTxt()))"
const PARSED_EVENTS = require('./data/kp-events.json');

/** Parse the raw legacy events.txt block format (used to regenerate the JSON). */
function parseEventsTxt() {
  const fs = require('node:fs');
  const path = require('node:path');
  const text = fs.readFileSync(path.join(__dirname, 'data', 'kp-events.txt'), 'utf8');
  let tamil = {};
  try { tamil = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'kp-event-names-ta.json'), 'utf8')); } catch { /* optional */ }
  const events = [];
  text.split('<end>').forEach((raw, index) => {
    const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith(';'));
    if (lines.length < 2) return;
    const title = lines[0];
    const name = title.includes('.') ? title.split('.').slice(1).join('.').trim() : title;
    const rules = [];
    let remarks = '';
    for (const line of lines.slice(2)) {
      if (line.startsWith(':')) { remarks = line.slice(1).trim(); continue; }
      const nums = line.split(':').map((v) => v.trim()).filter((v) => v !== '').map(Number).filter((n) => Number.isFinite(n));
      if (nums.length < 2) continue;
      const target = nums[0];
      const goodCount = nums[1];
      const favorable = nums.slice(2, 2 + goodCount);
      const cursor = 2 + goodCount;
      const badCount = cursor < nums.length ? nums[cursor] : 0;
      const unfavorable = nums.slice(cursor + 1, cursor + 1 + badCount);
      rules.push({ target, favorable, unfavorable });
    }
    const key = String(index).padStart(3, '0');
    events.push({ key, name, rules, remarks, nameTa: tamil[key] || '' });
  });
  return events;
}

function loadEvents() {
  return PARSED_EVENTS;
}

const STATUS_TA = { Excellent: 'மிகச் சிறப்பு', Pass: 'ஏற்றது', Avoid: 'தவிர்க்கவும்', 'Not Applicable': 'பொருந்தாது' };
const PERIOD_NAMES = { 101: 'Dasa', 102: 'Bhukti', 103: 'Antara', 104: 'Sukshma' };

const FOREIGN_EVENTS = new Set(['Foreign Settlement', 'Going Abroad', 'Migrating to a Foreign Country']);

/**
 * @param opts.monetaryGain  for "Apply for Getting an Award/Prize": whether
 *   the purpose is a monetary award (house 2 included) or not (excluded).
 */
function evaluateEvent(event, kp, periods, opts = {}) {
  const dbas = periods || kp.dbas || vimshottariLevels(
    kp.positions.find((p) => p.name === 'Moon').longitude, 4,
  );
  const rows = [];
  for (const rule of event.rules) {
    let lord;
    let label;
    if (rule.target >= 1 && rule.target <= 12) {
      lord = kp.cusps[rule.target - 1].sub;
      label = `Cusp ${rule.target}`;
    } else if (PERIOD_NAMES[rule.target]) {
      lord = dbas[rule.target - 101];
      label = PERIOD_NAMES[rule.target];
    } else {
      continue;
    }
    const signs = planetSignificators(lord, kp);
    let favorable = rule.favorable;
    let adjustment = '';
    // Legacy per-event rule adjustments (kp_muhurat/events.py evaluate_event).
    if (FOREIGN_EVENTS.has(event.name) && rule.target === 1 && kp.obstruction && kp.obstruction.modality === 'Dual') {
      favorable = favorable.filter((h) => h !== 9);
      adjustment = ' Dual Lagna rule applied: house 9 excluded from Ascendant sub-lord analysis.';
    }
    if (event.name === 'Apply for Getting an Award/Prize' && [10, 11, 101, 102, 103, 104].includes(rule.target)) {
      if (opts.monetaryGain) {
        adjustment = ' Monetary-gain purpose selected: house 2 included.';
      } else {
        favorable = favorable.filter((h) => h !== 2);
        adjustment = ' Non-monetary award purpose selected: house 2 excluded.';
      }
    }
    const goodHits = signs.filter((h) => favorable.includes(h));
    const badHits = signs.filter((h) => rule.unfavorable.includes(h));

    if (!favorable.length && !rule.unfavorable.length) {
      rows.push({
        target: label, subLord: lord, significators: signs, favorable: [], unfavorable: [],
        goodHits: [], badHits: [], positiveCode: '-', negativeCode: '-', resultCode: '--',
        status: 'Not Applicable', color: 'green', statusTa: STATUS_TA['Not Applicable'],
      });
      continue;
    }
    const subset = (arr) => arr.every((h) => signs.includes(h));
    const positiveCode = !favorable.length ? '-' : (subset(favorable) ? 'Y' : (goodHits.length ? 'P' : 'N'));
    const negativeCode = !rule.unfavorable.length ? '-' : (subset(rule.unfavorable) ? 'Y' : (badHits.length ? 'P' : 'N'));
    let status;
    let color;
    if (positiveCode === 'Y') { status = 'Excellent'; color = 'green'; } else if (positiveCode === 'N' || (positiveCode === 'P' && negativeCode === 'Y')) { status = 'Avoid'; color = 'red'; } else { status = 'Pass'; color = 'green'; }
    rows.push({
      target: label, subLord: lord, significators: signs,
      favorable, unfavorable: rule.unfavorable, goodHits, badHits,
      positiveCode, negativeCode, resultCode: positiveCode + negativeCode,
      status, color, statusTa: STATUS_TA[status] || status, adjustment: adjustment || null,
    });
  }
  return rows;
}

/**
 * @param specialConditions  rows from kpSpecialConditions.evaluateSpecialConditions
 *   (optional). Mandatory ones (affects_result / affectsResult) gate the grade:
 *   a red mandatory condition forces RED; DARK_GREEN additionally requires
 *   every mandatory condition to be darkgreen. Matches kp_muhurat grade_event.
 */
function gradeEvent(rows, specialConditions) {
  const active = rows.filter((r) => r.status !== 'Not Applicable');
  const mandatory = (specialConditions || []).filter((r) => r.affectsResult);
  const specialFailed = mandatory.some((r) => r.color === 'red');
  const specialAllExcellent = !mandatory.length || mandatory.every((r) => r.color === 'darkgreen');
  if (!active.length && !mandatory.length) return { code: 'REVIEW', labelTa: 'மீள் ஆய்வு தேவை', color: 'amber', passed: 0, total: 0 };
  const failed = active.filter((r) => r.color === 'red');
  const excellent = active.filter((r) => r.status === 'Excellent');
  const passed = active.filter((r) => r.color === 'green');
  let code;
  let labelTa;
  let color;
  if (failed.length || specialFailed) { code = 'RED'; labelTa = 'ஏற்றதல்ல'; color = 'red'; } else if (excellent.length === active.length && specialAllExcellent) { code = 'DARK_GREEN'; labelTa = 'மிகச் சிறந்த முகூர்த்தம்'; color = 'darkgreen'; } else if (passed.length === active.length) { code = 'GREEN'; labelTa = 'நல்ல முகூர்த்தம்'; color = 'green'; } else { code = 'REVIEW'; labelTa = 'மீள் ஆய்வு தேவை'; color = 'amber'; }
  return { code, labelTa, color, passed: passed.length, total: active.length };
}

/** Evaluate every catalog event against a chart's KP block, including any
 *  event-specific special conditions (kpSpecialConditions.js) that gate the
 *  grade. */
function calculateKpEvents(kp) {
  if (!kp || !kp.available) return { available: false };
  const { evaluateSpecialConditions } = require('./kpSpecialConditions');
  const events = loadEvents();
  const results = events
    .filter((e) => e.rules.length)
    .map((e) => {
      const rows = evaluateEvent(e, kp);
      const specialConditions = evaluateSpecialConditions(e, kp);
      return {
        key: e.key, name: e.name, nameTa: e.nameTa, remarks: e.remarks, rows,
        specialConditions, grade: gradeEvent(rows, specialConditions),
      };
    });
  return { available: true, count: results.length, events: results };
}

module.exports = { calculateKpEvents, loadEvents, parseEventsTxt, evaluateEvent, gradeEvent, planetSignificators };
