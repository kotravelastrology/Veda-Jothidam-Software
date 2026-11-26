'use server';

import { randomUUID } from 'node:crypto';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { openLibrary } = require('../../src/library/chartRepository');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolveLibraryPath } = require('../../src/library/libraryPath');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { SCOPES, FULL_ACCESS, READ_ONLY, assertScopes } = require('../../src/sync/scopes');

function withLibrary<T>(fn: (lib: any) => T): T {
  const lib = openLibrary(resolveLibraryPath());
  try {
    return fn(lib);
  } finally {
    lib.close();
  }
}

/**
 * VJ-024 — devices and the outbox.
 *
 * No hosted sync service exists, so nothing here sends anything. What it
 * manages is real: which devices have been granted what, which have been
 * revoked, and what is queued locally. ADR-05 makes all of it optional — the
 * product works with an empty outbox that is never drained.
 */
export async function loadSyncState() {
  return withLibrary((lib) => JSON.parse(JSON.stringify({
    devices: lib.listDevices(),
    outbox: lib.outboxStatus(),
    pending: lib.pendingOutbox({ limit: 25 }),
    scopes: SCOPES,
    presets: { full: FULL_ACCESS, readOnly: READ_ONLY },
  })));
}

export async function addSyncDevice(label: string, scopes: string[]) {
  if (!label?.trim()) throw new Error('சாதனத்திற்கு ஒரு பெயர் தேவை');
  assertScopes(scopes);
  const deviceId = randomUUID();
  return withLibrary((lib) => {
    lib.registerDevice(deviceId, { label: label.trim(), scopes });
    return JSON.parse(JSON.stringify(lib.getDevice(deviceId)));
  });
}

export async function revokeSyncDevice(deviceId: string) {
  return withLibrary((lib) => JSON.parse(JSON.stringify(lib.revokeDevice(deviceId))));
}

/** Registers this browser as a sync device with full access. Called once per browser; the browser keeps the id. */
export async function registerThisComputer() {
  return addSyncDevice('This computer', [...FULL_ACCESS]);
}

/** Revokes this browser's device record. The browser keeps its id, so it is not registered again. */
export async function deactivateThisComputer(deviceId: string) {
  if (!/^[0-9a-f-]{36}$/i.test(deviceId)) throw new Error('invalid device id');
  return revokeSyncDevice(deviceId);
}
