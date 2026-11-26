'use strict';

/**
 * Node's `fs` in the browser build (next.config.mjs aliases `fs` here): there is no file system on the device, so every read fails the
 * way a missing file fails, and the engines' own fallbacks apply (swissEphemeris.js and chartSnapshot.js report the library version as
 * 'unknown'). Nothing on the calculation path writes files.
 */
function missing(what) {
  const e = new Error(`${what}: no file system on the device`);
  e.code = 'ENOENT';
  throw e;
}

module.exports = {
  readFileSync: () => missing('readFileSync'),
  statSync: () => missing('statSync'),
  mkdirSync: () => missing('mkdirSync'),
  writeFileSync: () => missing('writeFileSync'),
  existsSync: () => false,
  readdirSync: () => [],
  promises: {
    readFile: async () => missing('readFile'),
    stat: async () => missing('stat'),
  },
};
