/**
 * KP Muhurat — the sub-lord-transition election scan (நேரம் scan).
 *
 * Ported from kp_muhurat/events.py `sub_level_analysis` /
 * `candidate_windows_from_sub_levels` / `search_candidate_windows`: walks a
 * date range at fine resolution, finds every EXACT instant the Ascendant's
 * KP sub-lord changes (bisected to the second), evaluates the chosen event's
 * cusp/DBAS rules + special conditions (kpEvents.js / kpSpecialConditions.js)
 * and Badhaka/Maraka eligibility of the Ascendant sub-lord at the midpoint of
 * each resulting interval, and returns the accepted (GREEN/DARK_GREEN,
 * obstruction-free) intervals merged into ranked candidate windows.
 *
 * Positions from Kotravel's own Swiss Ephemeris (ascendant sampling is a
 * single house-cusp call, ~0.01ms; a full KP chart evaluation only runs once
 * per accepted interval, not per sample).
 */
const { julianDay } = require('@swisseph/node');
const { siderealAscendant } = require('../ephemeris/swissEphemeris');
const { kpChain, calculateKpSystem, planetSignificators } = require('./kpSystem');
const { evaluateEvent, gradeEvent } = require('./kpEvents');
const { evaluateSpecialConditions } = require('./kpSpecialConditions');

const DAY_MS = 86400000;
const SEC_JD = 1 / 86400;
const jdToMs = (jd) => (jd - 2440587.5) * DAY_MS;
const msToJd = (ms) => ms / DAY_MS + 2440587.5;

function ascendantState(jd, lat, lon) {
  const ascLon = siderealAscendant(jd, lat, lon, 'Krishnamurti');
  const chain = kpChain(ascLon);
  return { signLord: chain.signLord, starLord: chain.starLord, subLord: chain.sub };
}
const sameState = (a, b) => a.signLord === b.signLord && a.starLord === b.starLord && a.subLord === b.subLord;

/** Bisect to the second: the earliest instant in (left, right] with `rightState`. */
function bisectBoundary(leftJd, rightJd, rightState, lat, lon) {
  let l = leftJd;
  let r = rightJd;
  while ((r - l) > SEC_JD) {
    const mid = l + (r - l) / 2;
    if (sameState(ascendantState(mid, lat, lon), rightState)) r = mid; else l = mid;
  }
  return r;
}

/** birthInput fields (local wall clock at utcOffsetMinutes) for a JD instant. */
function birthInputAtJd(jd, latitude, longitude, utcOffsetMinutes) {
  const d = new Date(jdToMs(jd) + utcOffsetMinutes * 60000);
  return {
    year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate(),
    hour: d.getUTCHours(), minute: d.getUTCMinutes(), second: d.getUTCSeconds(),
    latitude, longitude, utcOffsetMinutes,
  };
}
function fmtHms(jd, utcOffsetMinutes) {
  const d = new Date(jdToMs(jd) + utcOffsetMinutes * 60000);
  const p = (n) => String(n).padStart(2, '0');
  return `${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())}`;
}

const MAX_RANGE_DAYS = 4;

/**
 * Every exact Ascendant sub-lord interval in [startJd, endJd], graded for `event`.
 * @param q { startJd, endJd, latitude, longitude, utcOffsetMinutes, stepMinutes=1, monetaryGain=false }
 */
function subLevelAnalysis(event, q) {
  const { latitude, longitude, utcOffsetMinutes } = q;
  const stepMinutes = q.stepMinutes || 1;
  let startJd = q.startJd;
  let endJd = q.endJd;
  if (endJd <= startJd) return [];
  if (endJd - startJd > MAX_RANGE_DAYS) endJd = startJd + MAX_RANGE_DAYS;

  const stepJd = stepMinutes / 1440;
  const boundaries = [{ jd: startJd, state: ascendantState(startJd, latitude, longitude) }];
  let cursor = startJd + stepJd;
  while (cursor <= endJd) {
    const current = ascendantState(cursor, latitude, longitude);
    if (!sameState(current, boundaries[boundaries.length - 1].state)) {
      boundaries.push({ jd: bisectBoundary(boundaries[boundaries.length - 1].jd, cursor, current, latitude, longitude), state: current });
    }
    cursor += stepJd;
  }
  const endState = ascendantState(endJd, latitude, longitude);
  if (!sameState(endState, boundaries[boundaries.length - 1].state)) {
    boundaries.push({ jd: bisectBoundary(boundaries[boundaries.length - 1].jd, endJd, endState, latitude, longitude), state: endState });
  }

  const rows = [];
  for (let i = 0; i < boundaries.length; i += 1) {
    const begin = boundaries[i].jd;
    const finish = i + 1 < boundaries.length ? boundaries[i + 1].jd - SEC_JD : endJd;
    const midJd = begin + (finish - begin) / 2;
    const kp = calculateKpSystem(birthInputAtJd(midJd, latitude, longitude, utcOffsetMinutes), { nodeType: 'mean' });

    const analysis = evaluateEvent(event, kp, kp.dbas, { monetaryGain: q.monetaryGain });
    const specialConditions = evaluateSpecialConditions(event, kp);
    const { signLord, starLord, subLord } = boundaries[i].state;
    const subSignificators = planetSignificators(subLord, kp);
    const blocked = new Set([kp.obstruction.badhaka, ...kp.obstruction.maraka]);
    const obstructionHits = subSignificators.filter((h) => blocked.has(h));
    const eligible = obstructionHits.length === 0;

    rows.push({
      start: fmtHms(begin, utcOffsetMinutes), end: fmtHms(finish, utcOffsetMinutes),
      startJd: begin, endJd: finish,
      signLord, starLord, subLord,
      eligible, obstructionHits, grade: gradeEvent(analysis, specialConditions),
      reason: `${subLord} signifies ${subSignificators.join(', ') || 'no houses'}. `
        + (obstructionHits.length ? `Badhaka/Maraka hit: ${obstructionHits.join(', ')}.` : 'No Badhaka or Maraka house hit.'),
    });
  }
  return rows;
}

/** Merge consecutive accepted (eligible + GREEN/DARK_GREEN) rows into ranked windows. */
function candidateWindowsFromSubLevels(rows, utcOffsetMinutes = 0) {
  const accepted = rows.filter((r) => r.eligible && (r.grade.code === 'GREEN' || r.grade.code === 'DARK_GREEN'));
  const windows = [];
  for (const row of accepted) {
    const last = windows[windows.length - 1];
    // contiguous when this row starts exactly 1 second after the previous
    // window's end (rows.end is inclusive, i.e. next.start - 1s by construction)
    if (last && Math.abs((row.startJd - last.endJd) * 86400 - 1) < 0.5 && last.code === row.grade.code) {
      last.end = row.end;
      last.endJd = row.endJd;
      continue;
    }
    windows.push({
      start: row.start, end: row.end, startJd: row.startJd, endJd: row.endJd,
      code: row.grade.code, color: row.grade.color, label: row.grade.label, labelTa: row.grade.labelTa,
    });
  }
  for (const w of windows) {
    const seconds = Math.max(1, Math.round((w.endJd - w.startJd) * 86400) + 1);
    w.durationSeconds = seconds;
    w.duration = `${String(Math.floor(seconds / 60)).padStart(2, '0')}m ${String(seconds % 60).padStart(2, '0')}s`;
    const midJd = w.startJd + (seconds - 1) / 2 / 86400;
    w.recommendedTime = fmtHms(midJd, utcOffsetMinutes);
    delete w.startJd; delete w.endJd;
  }
  const priority = { DARK_GREEN: 0, GREEN: 1 };
  windows.sort((a, b) => (priority[a.code] ?? 9) - (priority[b.code] ?? 9) || b.durationSeconds - a.durationSeconds || a.start.localeCompare(b.start));
  windows.forEach((w, i) => { w.rank = i + 1; w.bestChoice = i === 0; });
  return windows;
}

/**
 * @param q { key|name, startISO, endISO, latitude, longitude, utcOffsetMinutes,
 *   stepMinutes?, monetaryGain? }  startISO/endISO 'YYYY-MM-DDTHH:MM' local wall clock.
 */
function searchCandidateWindows(event, q) {
  const [sd, st = '00:00'] = q.startISO.split('T');
  const [ed, et = '23:59'] = q.endISO.split('T');
  const [sy, sm, sdd] = sd.split('-').map(Number);
  const [sh, smin] = st.split(':').map(Number);
  const [ey, em, edd] = ed.split('-').map(Number);
  const [eh, emin] = et.split(':').map(Number);
  const off = q.utcOffsetMinutes || 0;
  const startJd = julianDay(sy, sm, sdd, sh + smin / 60 - off / 60);
  const endJd = julianDay(ey, em, edd, eh + emin / 60 - off / 60);

  const rows = subLevelAnalysis(event, {
    startJd, endJd, latitude: q.latitude, longitude: q.longitude, utcOffsetMinutes: off,
    stepMinutes: q.stepMinutes || 1, monetaryGain: q.monetaryGain,
  });
  const windows = candidateWindowsFromSubLevels(rows, off);
  return { available: true, rows, windows, scannedIntervals: rows.length, maxRangeDays: MAX_RANGE_DAYS };
}

module.exports = { subLevelAnalysis, candidateWindowsFromSubLevels, searchCandidateWindows, ascendantState };
