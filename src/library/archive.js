const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const { UnsupportedInputError } = require('../contracts/chartContext');
const { openLibrary, SCHEMA_VERSION } = require('./chartRepository');

/**
 * VJ-012 — backup, archive and restore.
 *
 * The archive is JSON rather than a copy of the SQLite file: it can be
 * inspected, diffed and restored into a newer schema, which a binary copy of
 * a v1 database cannot. ADR-08 asks for migrations that are versioned and
 * independently restore-tested, and that needs a format which survives the
 * schema moving underneath it.
 */

const ARCHIVE_VERSION = 1;
const ARCHIVE_KIND = 'veda-jothidam-library-archive';

/** Key-order-independent, so re-serialising cannot invalidate a checksum. */
function canonicalise(value) {
  if (Array.isArray(value)) return value.map(canonicalise);
  if (value && typeof value === 'object') {
    return Object.keys(value).sort().reduce((acc, k) => {
      acc[k] = canonicalise(value[k]);
      return acc;
    }, {});
  }
  return value;
}

function checksumOf(payload) {
  return crypto.createHash('sha256').update(JSON.stringify(canonicalise(payload))).digest('hex');
}

/** Writes every profile, revision and snapshot to `archivePath`. */
function createArchive(libraryPath, archivePath) {
  const lib = openLibrary(libraryPath);
  let payload;
  try {
    payload = lib.exportAll();
  } finally {
    lib.close();
  }

  const archive = {
    kind: ARCHIVE_KIND,
    archiveVersion: ARCHIVE_VERSION,
    schemaVersion: SCHEMA_VERSION,
    createdAt: new Date().toISOString(),
    counts: {
      profiles: payload.profiles.length,
      revisions: payload.revisions.length,
      snapshots: payload.snapshots.length,
      consultations: payload.consultations.length,
      journalEvents: payload.journalEvents.length,
    },
    checksum: checksumOf(payload),
    payload,
  };

  fs.mkdirSync(path.dirname(path.resolve(archivePath)), { recursive: true });
  fs.writeFileSync(archivePath, `${JSON.stringify(archive, null, 2)}\n`, 'utf8');
  return { archivePath, ...archive.counts, checksum: archive.checksum, schemaVersion: SCHEMA_VERSION };
}

/**
 * Reads and validates an archive without writing anything. Every failure
 * names what is wrong, because "restore failed" on someone's only backup is
 * not an acceptable message.
 */
function verifyArchive(archivePath) {
  if (!fs.existsSync(archivePath)) {
    throw new UnsupportedInputError(`archive not found: ${archivePath}`, 'archivePath');
  }

  let archive;
  try {
    archive = JSON.parse(fs.readFileSync(archivePath, 'utf8'));
  } catch {
    throw new UnsupportedInputError('archive is not valid JSON; the file may be truncated', 'archive');
  }

  if (archive.kind !== ARCHIVE_KIND) {
    throw new UnsupportedInputError('not a Veda Jothidam library archive', 'kind');
  }
  if (archive.archiveVersion > ARCHIVE_VERSION) {
    throw new UnsupportedInputError(
      `archive format v${archive.archiveVersion} is newer than this build (v${ARCHIVE_VERSION}); upgrade to restore it`,
      'archiveVersion',
    );
  }
  if (archive.schemaVersion > SCHEMA_VERSION) {
    throw new UnsupportedInputError(
      `archive holds schema v${archive.schemaVersion}, newer than this build (v${SCHEMA_VERSION}); upgrade to restore it`,
      'schemaVersion',
    );
  }
  if (!archive.payload) {
    throw new UnsupportedInputError('archive has no payload', 'payload');
  }

  const actual = checksumOf(archive.payload);
  if (actual !== archive.checksum) {
    throw new UnsupportedInputError(
      `archive checksum mismatch: contents do not match the recorded checksum (expected ${archive.checksum.slice(0, 12)}…, got ${actual.slice(0, 12)}…)`,
      'checksum',
    );
  }

  return {
    archiveVersion: archive.archiveVersion,
    schemaVersion: archive.schemaVersion,
    createdAt: archive.createdAt,
    counts: archive.counts,
    checksum: archive.checksum,
  };
}

/**
 * Restores an archive into `targetLibraryPath`.
 *
 * The archive file is opened read-only and never written, so a failed restore
 * cannot cost someone their backup. Refuses a target that already holds
 * profiles unless `overwrite` is passed.
 */
function restoreArchive(archivePath, targetLibraryPath, { overwrite = false } = {}) {
  const manifest = verifyArchive(archivePath);
  const archive = JSON.parse(fs.readFileSync(archivePath, 'utf8'));

  // openLibrary migrates an older schema on the way in, so a v1 archive lands
  // in a v2 library with the new columns null rather than being rejected.
  const lib = openLibrary(targetLibraryPath);
  try {
    const restored = lib.importAll(archive.payload, { overwrite });
    return { ...restored, fromSchemaVersion: manifest.schemaVersion, intoSchemaVersion: lib.schemaVersion };
  } finally {
    lib.close();
  }
}

module.exports = {
  createArchive,
  verifyArchive,
  restoreArchive,
  ARCHIVE_VERSION,
  ARCHIVE_KIND,
};
