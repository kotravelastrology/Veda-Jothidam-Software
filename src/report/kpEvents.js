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
const { houseForLongitude, vimshottariLevels } = require('./kpSystem');

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

/**
 * KP significators of `lord`: its own direct houses + its star lord's +
 * its sub lord's. Direct houses = the house it occupies + the houses whose
 * cusp it lords. Rahu/Ketu also contribute their sign lord's direct houses.
 * @param kp  the object from calculateKpSystem (positions[], cusps[])
 */
function planetSignificators(lordName, kp) {
  const byName = Object.fromEntries(kp.positions.map((p) => [p.name, p]));
  if (!byName[lordName]) return [];

  const baseDirect = (name) => {
    const p = byName[name];
    if (!p) return new Set();
    const houses = new Set([houseForLongitude(p.longitude, kp.cusps)]);
    for (const c of kp.cusps) if (c.signLord === name) houses.add(c.number);
    return houses;
  };
  const direct = (name) => {
    const houses = baseDirect(name);
    const p = byName[name];
    if (p && (name === 'Rahu' || name === 'Ketu')) {
      const signLord = kp.cusps.length ? null : null; // unused
      const sl = require('./kpSystem').SIGN_LORDS[Math.floor(((p.longitude % 360) + 360) % 360 / 30)];
      for (const h of baseDirect(sl)) houses.add(h);
    }
    return houses;
  };

  const p = byName[lordName];
  const all = new Set([...direct(lordName), ...direct(p.starLord), ...direct(p.sub)]);
  return [...all].sort((a, b) => a - b);
}

const STATUS_TA = { Excellent: 'மிகச் சிறப்பு', Pass: 'ஏற்றது', Avoid: 'தவிர்க்கவும்', 'Not Applicable': 'பொருந்தாது' };
const PERIOD_NAMES = { 101: 'Dasa', 102: 'Bhukti', 103: 'Antara', 104: 'Sukshma' };

function evaluateEvent(event, kp, periods) {
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
    const favorable = rule.favorable;
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
      status, color, statusTa: STATUS_TA[status] || status,
    });
  }
  return rows;
}

function gradeEvent(rows) {
  const active = rows.filter((r) => r.status !== 'Not Applicable');
  if (!active.length) return { code: 'REVIEW', labelTa: 'மீள் ஆய்வு தேவை', color: 'amber', passed: 0, total: 0 };
  const failed = active.filter((r) => r.color === 'red');
  const excellent = active.filter((r) => r.status === 'Excellent');
  const passed = active.filter((r) => r.color === 'green');
  let code;
  let labelTa;
  let color;
  if (failed.length) { code = 'RED'; labelTa = 'ஏற்றதல்ல'; color = 'red'; } else if (excellent.length === active.length) { code = 'DARK_GREEN'; labelTa = 'மிகச் சிறந்த முகூர்த்தம்'; color = 'darkgreen'; } else if (passed.length === active.length) { code = 'GREEN'; labelTa = 'நல்ல முகூர்த்தம்'; color = 'green'; } else { code = 'REVIEW'; labelTa = 'மீள் ஆய்வு தேவை'; color = 'amber'; }
  return { code, labelTa, color, passed: passed.length, total: active.length };
}

/** Evaluate every catalog event against a chart's KP block. */
function calculateKpEvents(kp) {
  if (!kp || !kp.available) return { available: false };
  const events = loadEvents();
  const results = events
    .filter((e) => e.rules.length)
    .map((e) => {
      const rows = evaluateEvent(e, kp);
      return { key: e.key, name: e.name, nameTa: e.nameTa, remarks: e.remarks, rows, grade: gradeEvent(rows) };
    });
  return { available: true, count: results.length, events: results };
}

module.exports = { calculateKpEvents, loadEvents, parseEventsTxt, evaluateEvent, gradeEvent, planetSignificators };
