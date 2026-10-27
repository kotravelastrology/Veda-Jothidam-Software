import { registerThisComputer, deactivateThisComputer } from '../../app/sync/actions';

/**
 * "This computer" (Help > Deactivate on this Computer): this browser is registered as a
 * sync device with full access the first time the app runs in it. The device id is kept
 * in localStorage, so the browser is registered once; deactivating revokes the record but
 * keeps the id, so the browser is not registered again.
 */
const DEVICE_KEY = 'kotravel-device-id';

export type DeactivateResult = 'revoked' | 'already-revoked' | 'not-registered';

function storedDeviceId(): string | null {
  try {
    return localStorage.getItem(DEVICE_KEY);
  } catch {
    return null;
  }
}

// Shared by every caller, so an effect that runs twice (React strict mode) registers once.
let registering: Promise<void> | null = null;

/** Registers this browser once. A failure is left to the caller; the app works without a device record. */
export function ensureThisComputerRegistered(): Promise<void> {
  if (storedDeviceId()) return Promise.resolve();
  if (!registering) {
    registering = registerThisComputer()
      .then((device) => localStorage.setItem(DEVICE_KEY, device.deviceId))
      .finally(() => {
        registering = null;
      });
  }
  return registering;
}

export async function deactivateThisComputerNow(): Promise<DeactivateResult> {
  const deviceId = storedDeviceId();
  if (!deviceId) return 'not-registered';
  const { revoked } = await deactivateThisComputer(deviceId);
  return revoked ? 'revoked' : 'already-revoked';
}
