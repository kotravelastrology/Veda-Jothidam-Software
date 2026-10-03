const path = require('node:path');
const os = require('node:os');

/**
 * Where the local chart library lives.
 *
 * Local-first (ADR-05): a file the user owns, outside the repository so a
 * `git clean` or a reinstall cannot delete someone's saved charts.
 * `VEDA_LIBRARY_PATH` overrides it, which is how the desktop build will point
 * at its own user-data directory.
 */
function resolveLibraryPath() {
  if (process.env.VEDA_LIBRARY_PATH) return process.env.VEDA_LIBRARY_PATH;

  const home = os.homedir();
  const base = process.platform === 'win32'
    ? (process.env.APPDATA || path.join(home, 'AppData', 'Roaming'))
    : path.join(home, '.local', 'share');

  return path.join(base, 'VedaJothidam', 'library.db');
}

module.exports = { resolveLibraryPath };
