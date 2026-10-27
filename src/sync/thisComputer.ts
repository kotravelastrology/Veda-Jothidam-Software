import { registerThisComputer, deactivateThisComputer } from '../../app/sync/actions';

/**
 * "This computer": a browser can register itself as a sync device with full access, when the
 * user asks for it (the button on the Sync page). The device id is kept in localStorage.
 * Deactivate (Help menu) revokes that device record and forgets the id; the button can then
 * register the browser again.
 */
const DEVICE_KEY = 'kotravel-device-id';

export type DeactivateResult = 'revoked' | 'not-registered';

function storedDeviceId(): string | null {
  try {
    return localStorage.getItem(DEVICE_KEY);
  } catch {
    return null;
  }
}

export function hasThisComputerRegistered(): boolean {
  return storedDeviceId() !== null;
}

// Shared by every caller, so a double click registers once.
let registering: Promise<void> | null = null;

/** Registers this browser unless it is already registered. A failure is left to the caller. */
export function registerThisComputerNow(): Promise<void> {
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
  localStorage.removeItem(DEVICE_KEY);
  return revoked ? 'revoked' : 'not-registered';
}
