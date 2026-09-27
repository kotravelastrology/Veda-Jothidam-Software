const { setSiderealMode, SiderealMode, setEphemerisPath } = require('@swisseph/node');

/**
 * VJ-014 — ephemeris request isolation.
 *
 * Swiss Ephemeris keeps the ayanamsha in **global** state: `swe_set_sid_mode`
 * applies to the whole library, not to a call. Our code sets it and then
 * computes, which is safe only while that pair stays synchronous — Node will
 * not interleave synchronous code.
 *
 * The moment anything awaits between the two, a concurrent request overwrites
 * the mode and the first request silently receives the wrong ayanamsha.
 * Measured on the Sun for 1990-05-15: a request asking for Lahiri received the
 * Raman position, **1.45° out** — more than enough to move a navamsa or a
 * rasi near a cusp, and with nothing on screen to suggest anything was wrong.
 *
 * This module makes the isolation explicit instead of accidental. Work that
 * spans an await runs inside `withEphemeris`, which serialises sessions so
 * only one set of global settings is live at a time.
 */

/** Serialises sessions. Native calls are microseconds, so the queue costs
 *  nothing meaningful and correctness is not negotiable here. */
let queue = Promise.resolve();

/** What the globals are currently set to, for assertions and diagnostics. */
let current = { ayanamsha: null, ephemerisPath: null };
let depth = 0;

function applySettings({ ayanamsha, ephemerisPath }) {
  if (ayanamsha !== undefined && ayanamsha !== null) {
    const mode = SiderealMode[ayanamsha];
    if (mode === undefined) throw new RangeError(`Unsupported ayanamsha: ${ayanamsha}`);
    setSiderealMode(mode);
    current.ayanamsha = ayanamsha;
  }
  if (ephemerisPath) {
    setEphemerisPath(ephemerisPath);
    current.ephemerisPath = ephemerisPath;
  }
}

/**
 * Runs `fn` with the given ephemeris settings applied, with no other session
 * able to change them until it finishes. `fn` may be async.
 *
 * Nested calls reuse the session rather than deadlocking, so a helper that
 * also wants isolation can be called from inside one.
 */
function withEphemeris(settings, fn) {
  if (depth > 0) {
    // Already inside a session: the outer one owns the settings.
    if (settings && settings.ayanamsha && settings.ayanamsha !== current.ayanamsha) {
      throw new Error(
        `nested ephemeris session asked for ${settings.ayanamsha} while `
        + `${current.ayanamsha} is active; finish the outer session first`,
      );
    }
    return Promise.resolve().then(fn);
  }

  const run = queue.then(async () => {
    depth += 1;
    try {
      applySettings(settings || {});
      return await fn();
    } finally {
      depth -= 1;
    }
  });
  // Keep the chain alive even if this session rejects, or every later request
  // would inherit the failure.
  queue = run.then(() => undefined, () => undefined);
  return run;
}

/** The settings currently applied to the library's globals. */
function currentEphemerisSettings() {
  return { ...current };
}

/**
 * Throws if the globals are not what the caller expects. Cheap enough to run
 * after a computation, which is how a contamination regression gets caught in
 * tests rather than in a reading.
 */
function assertEphemerisSettings(expected) {
  if (expected.ayanamsha && current.ayanamsha !== expected.ayanamsha) {
    throw new Error(
      `ephemeris contamination: expected ayanamsha ${expected.ayanamsha}, `
      + `library is set to ${current.ayanamsha}`,
    );
  }
  return true;
}

/** Test-only: forget what we believe the globals are. */
function resetIsolationState() {
  current = { ayanamsha: null, ephemerisPath: null };
  depth = 0;
  queue = Promise.resolve();
}

module.exports = {
  withEphemeris,
  currentEphemerisSettings,
  assertEphemerisSettings,
  resetIsolationState,
};
