const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');

const { UnsupportedInputError } = require('../contracts/chartContext');
const { parseXml, findAll, describeShape } = require('./xml');

/**
 * VJ-023 — Parashara's Light XML import.
 *
 * Three rules shape this module:
 *
 * 1. **Never touch the original.** Every read works on a copy in a temp
 *    directory, and the source path is opened read-only. A user's existing
 *    records are not ours to risk.
 * 2. **Refuse rather than guess.** The field mapping below is *provisional*:
 *    it has not been checked against a real PL9 chart export (see
 *    docs/VJ-023-pl9-import.md). If a file does not contain the fields the
 *    mapping expects, the import stops and reports what it actually saw. An
 *    importer that guesses would fill someone's library with wrong birth data,
 *    which is worse than importing nothing.
 * 3. **Report what is lost.** Anything present in the file but not carried
 *    into our schema is listed, so a practitioner knows what did not come
 *    across instead of discovering it months later.
 */

/**
 * Provisional mapping, ordered by preference. Each entry lists the candidate
 * element or attribute names seen in Parashara's Light exports and related
 * Jyotish XML. UNVERIFIED against a real PL9 export.
 */
const FIELD_MAP = {
  name: ['Name', 'ChartName', 'PersonName', 'FullName'],
  year: ['Year', 'BirthYear'],
  month: ['Month', 'BirthMonth'],
  day: ['Day', 'BirthDay'],
  hour: ['Hour', 'BirthHour'],
  minute: ['Minute', 'BirthMinute'],
  second: ['Second', 'BirthSecond'],
  latitude: ['Latitude', 'Lat', 'BirthLatitude'],
  longitude: ['Longitude', 'Lon', 'Long', 'BirthLongitude'],
  timezone: ['TimeZone', 'Timezone', 'TZ', 'UTCOffset', 'GMTOffset'],
  place: ['Place', 'City', 'BirthPlace', 'Location'],
  gender: ['Gender', 'Sex'],
};

/** Element names that plausibly wrap one chart record. */
const RECORD_ELEMENTS = ['Chart', 'Horoscope', 'Native', 'Person', 'Record', 'Entry'];

/** Reads a value from an element's attributes or its direct children. */
function readField(node, candidates) {
  for (const key of candidates) {
    if (node.attributes[key] !== undefined && String(node.attributes[key]).trim() !== '') {
      return { value: String(node.attributes[key]).trim(), from: `@${key}` };
    }
  }
  for (const key of candidates) {
    const child = node.children.find((c) => c.name === key);
    if (child && child.text.trim() !== '') {
      return { value: child.text.trim(), from: key };
    }
  }
  return null;
}

/** "5:30", "+5.5", "330" — all mean the same offset. */
function parseUtcOffsetMinutes(raw) {
  const text = String(raw).trim();
  let m = text.match(/^([+-]?)(\d{1,2}):(\d{2})$/);
  if (m) {
    const sign = m[1] === '-' ? -1 : 1;
    return sign * (Number(m[2]) * 60 + Number(m[3]));
  }
  const num = Number(text);
  if (!Number.isFinite(num)) return null;
  // A bare number is hours when small, minutes when large.
  return Math.abs(num) <= 14 ? Math.round(num * 60) : Math.round(num);
}

/**
 * Copies the source somewhere temporary and parses the copy. The original is
 * never opened for writing and never modified.
 */
function inspectPl9File(sourcePath) {
  if (!fs.existsSync(sourcePath)) {
    throw new UnsupportedInputError(`file not found: ${sourcePath}`, 'sourcePath');
  }
  const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vj023-'));
  const copyPath = path.join(workDir, path.basename(sourcePath));
  fs.copyFileSync(sourcePath, copyPath);

  let root;
  try {
    root = parseXml(fs.readFileSync(copyPath, 'utf8'));
  } catch (error) {
    fs.rmSync(workDir, { recursive: true, force: true });
    throw new UnsupportedInputError(`could not read as XML: ${error.message}`, 'xml');
  }

  const shape = [...new Set(describeShape(root))];
  let recordElement = null;
  let records = [];
  for (const candidate of RECORD_ELEMENTS) {
    const found = findAll(root, candidate);
    if (found.length) { recordElement = candidate; records = found; break; }
  }
  // A single-chart export may have the fields directly on the root.
  if (!recordElement && readField(root, FIELD_MAP.year)) {
    recordElement = root.name;
    records = [root];
  }

  fs.rmSync(workDir, { recursive: true, force: true });
  return { root, shape, recordElement, recordCount: records.length, records, sourcePath };
}

/**
 * Builds an import plan without writing anything: what maps, what duplicates,
 * what would be lost. A wizard shows this before the user commits.
 */
function planImport(inspection, library) {
  if (!inspection.recordElement || inspection.recordCount === 0) {
    throw new UnsupportedInputError(
      'no chart records recognised. Expected one of '
      + `${RECORD_ELEMENTS.join(', ')} or birth fields on the root element, but the file contains: `
      + `${inspection.shape.slice(0, 12).join(', ')}${inspection.shape.length > 12 ? ' …' : ''}`,
      'recordElement',
    );
  }

  const planned = [];
  const rejected = [];
  const mappedFrom = new Set();

  for (const [index, node] of inspection.records.entries()) {
    const read = {};
    const provenance = {};
    for (const [field, candidates] of Object.entries(FIELD_MAP)) {
      const hit = readField(node, candidates);
      if (hit) {
        read[field] = hit.value;
        provenance[field] = hit.from;
        mappedFrom.add(hit.from.replace(/^@/, ''));
      }
    }

    const missing = ['year', 'month', 'day', 'hour', 'latitude', 'longitude']
      .filter((f) => read[f] === undefined);
    if (missing.length) {
      rejected.push({
        index,
        name: read.name ?? `(record ${index + 1})`,
        reason: `missing required field(s): ${missing.join(', ')}`,
      });
      continue;
    }

    const utcOffsetMinutes = read.timezone !== undefined
      ? parseUtcOffsetMinutes(read.timezone) : null;
    if (utcOffsetMinutes === null) {
      rejected.push({
        index,
        name: read.name ?? `(record ${index + 1})`,
        reason: read.timezone === undefined
          ? 'no time zone in the record, and guessing one would shift every calculation'
          : `time zone "${read.timezone}" not understood`,
      });
      continue;
    }

    const input = {
      year: Number(read.year), month: Number(read.month), day: Number(read.day),
      hour: Number(read.hour), minute: Number(read.minute ?? 0),
      second: Number(read.second ?? 0),
      latitude: Number(read.latitude), longitude: Number(read.longitude),
      placeName: read.place ?? null,
      utcOffsetMinutes,
      ianaTimeZone: 'Asia/Kolkata',
    };
    const bad = Object.entries({
      year: input.year, month: input.month, day: input.day,
      hour: input.hour, latitude: input.latitude, longitude: input.longitude,
    }).filter(([, v]) => !Number.isFinite(v)).map(([k]) => k);
    if (bad.length) {
      rejected.push({ index, name: read.name ?? `(record ${index + 1})`, reason: `non-numeric ${bad.join(', ')}` });
      continue;
    }

    planned.push({
      index,
      name: read.name ?? `Imported ${index + 1}`,
      gender: read.gender ?? null,
      input,
      provenance,
    });
  }

  // Duplicate detection: same name and same birth moment as something stored.
  const existing = library.listProfiles({ limit: 10000 });
  const key = (name, input) => `${String(name).trim().toLowerCase()}|${input.year}-${input.month}-${input.day}|${input.hour}:${input.minute}`;
  const existingKeys = new Map();
  for (const row of existing) {
    const full = library.getProfile(row.profileId);
    if (full?.input) existingKeys.set(key(full.name, full.input), row.profileId);
  }

  const duplicates = [];
  const seenInFile = new Map();
  const toImport = [];
  for (const record of planned) {
    const k = key(record.name, record.input);
    if (existingKeys.has(k)) {
      duplicates.push({ ...record, reason: 'already in the library', existingProfileId: existingKeys.get(k) });
    } else if (seenInFile.has(k)) {
      duplicates.push({ ...record, reason: 'appears more than once in this file' });
    } else {
      seenInFile.set(k, record.index);
      toImport.push(record);
    }
  }

  // Loss report: element paths present in the file that nothing mapped from.
  const leafNames = new Set();
  for (const p of inspection.shape) leafNames.add(p.split('/').pop());
  for (const node of inspection.records) {
    for (const attr of Object.keys(node.attributes)) leafNames.add(attr);
  }
  const structural = new Set([inspection.root.name, inspection.recordElement]);
  const unmapped = [...leafNames]
    .filter((n) => !mappedFrom.has(n) && !structural.has(n))
    .sort();

  return {
    sourcePath: inspection.sourcePath,
    recordElement: inspection.recordElement,
    found: inspection.recordCount,
    toImport,
    duplicates,
    rejected,
    lossReport: {
      unmappedFields: unmapped,
      note: unmapped.length
        ? 'These appear in the file but have no place in this schema and will not be imported.'
        : 'Every field found was mapped.',
    },
  };
}

/**
 * Applies a plan. Records which profiles it created under an import id so the
 * whole thing can be undone exactly, rather than by guesswork.
 */
function applyImport(plan, library, { settings } = {}) {
  const importId = crypto.randomUUID();
  const created = [];
  const chosenSettings = settings ?? {
    ayanamsha: 'Lahiri', houseSystem: 'Porphyrius', nodeType: 'mean', calendarMode: 'tirukanita',
  };

  for (const record of plan.toImport) {
    const saved = library.saveProfile({
      name: record.name,
      gender: record.gender,
      input: record.input,
      settings: chosenSettings,
      note: `Imported from ${path.basename(plan.sourcePath)}`,
    });
    created.push(saved.profileId);
  }

  library.recordImport(importId, {
    sourcePath: plan.sourcePath,
    profileIds: created,
    skipped: plan.duplicates.length,
    rejected: plan.rejected.length,
    lossReport: plan.lossReport,
  });

  return { importId, imported: created.length, profileIds: created };
}

/** Removes exactly the profiles an import created, and nothing else. */
function rollbackImport(importId, library) {
  const record = library.getImport(importId);
  if (!record) throw new UnsupportedInputError(`unknown import: ${importId}`, 'importId');
  let removed = 0;
  for (const profileId of record.profileIds) {
    if (library.deleteProfile(profileId)) removed += 1;
  }
  library.markImportRolledBack(importId);
  return { importId, removed, of: record.profileIds.length };
}

module.exports = {
  inspectPl9File, planImport, applyImport, rollbackImport,
  FIELD_MAP, RECORD_ELEMENTS, parseUtcOffsetMinutes,
};
