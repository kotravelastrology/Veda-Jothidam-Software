/**
 * VJ-023 — PL9 XML import.
 *
 * Acceptance: test copies only; field mapping, duplicate detection, loss
 * report, rollback.
 *
 * The chart fixtures below are **synthetic**. They exercise the pipeline, not
 * the field mapping's fidelity to a real Parashara's Light export, which
 * remains unverified — see docs/VJ-023-pl9-import.md. The parser itself is
 * additionally checked against the repository's real PL9 `options.xml`.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { openLibrary, SCHEMA_VERSION } = require('./src/library/chartRepository');
const {
  inspectPl9File, planImport, applyImport, rollbackImport, parseUtcOffsetMinutes,
} = require('./src/import/pl9Import');
const { parseXml, describeShape } = require('./src/import/xml');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'vj023-test-'));
const dbPath = path.join(tmp, 'library.db');

// ------------------------------------------------- parser, on real XML --

const realOptions = path.join(__dirname, 'Options', 'options.xml');
if (fs.existsSync(realOptions)) {
  const doc = parseXml(fs.readFileSync(realOptions, 'utf8'));
  assert.equal(doc.name, 'Options', 'parses a real Parashara\'s Light options.xml');
  assert.ok(describeShape(doc).length > 10);
  const charts = doc.children.find((c) => c.name === 'ChartsOptions');
  assert.equal(charts.attributes.HighlightMode, '0', 'reads attributes from real PL9 XML');
}

// Malformed input must be refused, not half-read.
assert.throws(() => parseXml('<a><b></a>'), /does not match/);
assert.throws(() => parseXml('<a>'), /unclosed element/);
assert.throws(() => parseXml(''), /empty document/);
assert.throws(() => parseXml('not xml at all'), /no elements found/);

assert.equal(parseUtcOffsetMinutes('5:30'), 330);
assert.equal(parseUtcOffsetMinutes('-8:00'), -480);
assert.equal(parseUtcOffsetMinutes('5.5'), 330);
assert.equal(parseUtcOffsetMinutes('330'), 330);
assert.equal(parseUtcOffsetMinutes('nonsense'), null);

// --------------------------------------------------------- test copies --

const sourcePath = path.join(tmp, 'export.xml');
fs.writeFileSync(sourcePath, `<?xml version="1.0"?>
<ParasharaExport>
  <Chart Name="Ravi Kumar" Gender="M">
    <Year>1990</Year><Month>5</Month><Day>15</Day>
    <Hour>10</Hour><Minute>30</Minute>
    <Latitude>13.0827</Latitude><Longitude>80.2707</Longitude>
    <TimeZone>5:30</TimeZone><Place>Chennai</Place>
    <Rasi>Karkataka</Rasi><Nakshatra>Uttara Ashadha</Nakshatra>
    <AyanamsaUsed>Lahiri</AyanamsaUsed>
  </Chart>
  <Chart Name="Meena" Gender="F">
    <Year>2004</Year><Month>8</Month><Day>31</Day>
    <Hour>4</Hour><Minute>12</Minute>
    <Latitude>9.9252</Latitude><Longitude>78.1198</Longitude>
    <TimeZone>5:30</TimeZone><Place>Madurai</Place>
  </Chart>
  <Chart Name="No Timezone">
    <Year>1975</Year><Month>1</Month><Day>1</Day><Hour>6</Hour>
    <Latitude>51.5</Latitude><Longitude>-0.12</Longitude>
  </Chart>
  <Chart Name="Incomplete"><Year>1980</Year></Chart>
</ParasharaExport>
`, 'utf8');

const sourceBefore = fs.readFileSync(sourcePath);
const mtimeBefore = fs.statSync(sourcePath).mtimeMs;

const inspection = inspectPl9File(sourcePath);
assert.equal(inspection.recordElement, 'Chart');
assert.equal(inspection.recordCount, 4);

assert.deepEqual(fs.readFileSync(sourcePath), sourceBefore,
  'inspecting must not alter the source file — it is the user\'s only copy');
assert.equal(fs.statSync(sourcePath).mtimeMs, mtimeBefore, 'source mtime unchanged');

assert.throws(() => inspectPl9File(path.join(tmp, 'absent.xml')), /file not found/);

// ------------------------------------------------- mapping and refusal --

let lib = openLibrary(dbPath);
assert.equal(lib.schemaVersion, SCHEMA_VERSION);

const plan = planImport(inspection, lib);
assert.equal(plan.toImport.length, 2, 'two complete records are importable');
assert.equal(plan.rejected.length, 2, 'incomplete records are rejected, not guessed at');

const noTz = plan.rejected.find((r) => r.name === 'No Timezone');
assert.match(noTz.reason, /time zone/,
  'a missing time zone must be refused: guessing one shifts every calculation');
const incomplete = plan.rejected.find((r) => r.name === 'Incomplete');
assert.match(incomplete.reason, /missing required field/);

const ravi = plan.toImport.find((r) => r.name === 'Ravi Kumar');
assert.equal(ravi.input.year, 1990);
assert.equal(ravi.input.utcOffsetMinutes, 330, '5:30 became 330 minutes');
assert.equal(ravi.input.placeName, 'Chennai');
assert.equal(ravi.gender, 'M');
assert.equal(ravi.provenance.name, '@Name', 'mapping records where each value came from');
assert.equal(ravi.provenance.year, 'Year');

// A file whose shape is not recognised must say what it saw.
const foreignPath = path.join(tmp, 'foreign.xml');
fs.writeFileSync(foreignPath, '<Root><Unrelated><Thing>1</Thing></Unrelated></Root>');
assert.throws(() => planImport(inspectPl9File(foreignPath), lib),
  /no chart records recognised[\s\S]*Unrelated/,
  'an unrecognised file is refused with the paths it actually contains');

// ------------------------------------------------------- loss report --

assert.ok(plan.lossReport.unmappedFields.includes('Rasi'),
  'fields we do not store are reported as lost');
assert.ok(plan.lossReport.unmappedFields.includes('Nakshatra'));
assert.ok(plan.lossReport.unmappedFields.includes('AyanamsaUsed'));
assert.ok(!plan.lossReport.unmappedFields.includes('Year'), 'mapped fields are not reported lost');
assert.ok(!plan.lossReport.unmappedFields.includes('Name'));

// ------------------------------------------------------------ apply --

const result = applyImport(plan, lib);
assert.equal(result.imported, 2);
assert.equal(lib.listProfiles().length, 2);
assert.equal(lib.search('Ravi').length, 1, 'imported charts are searchable');

const stored = lib.getProfile(result.profileIds[0]);
assert.equal(stored.input.utcOffsetMinutes, 330);
assert.match(stored.note, /Imported from export\.xml/);

// ------------------------------------------------ duplicate detection --

const second = planImport(inspectPl9File(sourcePath), lib);
assert.equal(second.toImport.length, 0, 'a second run of the same file imports nothing');
assert.equal(second.duplicates.length, 2, 'both records are flagged as already present');
assert.ok(second.duplicates.every((d) => d.reason === 'already in the library'));
assert.ok(second.duplicates[0].existingProfileId, 'the duplicate names which profile it matched');

// Duplicates within one file are caught too.
const twicePath = path.join(tmp, 'twice.xml');
fs.writeFileSync(twicePath, `<Export>
  <Chart Name="Twin"><Year>2000</Year><Month>1</Month><Day>1</Day><Hour>1</Hour>
    <Latitude>10</Latitude><Longitude>77</Longitude><TimeZone>5:30</TimeZone></Chart>
  <Chart Name="Twin"><Year>2000</Year><Month>1</Month><Day>1</Day><Hour>1</Hour>
    <Latitude>10</Latitude><Longitude>77</Longitude><TimeZone>5:30</TimeZone></Chart>
</Export>`);
const twicePlan = planImport(inspectPl9File(twicePath), lib);
assert.equal(twicePlan.toImport.length, 1);
assert.equal(twicePlan.duplicates.length, 1);
assert.match(twicePlan.duplicates[0].reason, /more than once in this file/);

// ---------------------------------------------------------- rollback --

const before = lib.listProfiles().length;
const rolled = rollbackImport(result.importId, lib);
assert.equal(rolled.removed, 2);
assert.equal(lib.listProfiles().length, before - 2, 'rollback removes exactly what it added');
assert.equal(lib.search('Ravi').length, 0, 'the search index is cleaned too');
assert.equal(lib.getImport(result.importId).rolledBack, true);
assert.throws(() => rollbackImport('no-such-import', lib), /unknown import/);

// Rollback must not touch anything the import did not create.
const manual = lib.saveProfile({
  name: 'Typed By Hand',
  input: { year: 1999, month: 9, day: 9, hour: 9, minute: 0, ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330, latitude: 13, longitude: 80, placeName: 'Chennai' },
  settings: { ayanamsha: 'Lahiri', houseSystem: 'Porphyrius', nodeType: 'mean', calendarMode: 'tirukanita' },
});
const second2 = applyImport(planImport(inspectPl9File(sourcePath), lib), lib);
rollbackImport(second2.importId, lib);
assert.ok(lib.getProfile(manual.profileId), 'a hand-entered profile survives an unrelated rollback');

assert.equal(lib.listImports().length, 2, 'both applied imports are recorded (the twice.xml plan was never applied)');
lib.close();

fs.rmSync(tmp, { recursive: true, force: true });

console.log(JSON.stringify({
  pass: true,
  schemaVersion: SCHEMA_VERSION,
  mappingStatus: 'PROVISIONAL — not yet verified against a real PL9 export',
}, null, 2));
