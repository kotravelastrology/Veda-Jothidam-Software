/**
 * Copies just the runtime dependencies the packaged spike needs, so the spike
 * app is self-contained without checking 7 MB of node_modules into the repo.
 */
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.join(__dirname, '..', '..', '..');
const target = path.join(__dirname, 'node_modules');
fs.rmSync(target, { recursive: true, force: true });

for (const dep of ['@swisseph/node', '@swisseph/core', 'node-addon-api', 'node-gyp-build']) {
  const from = path.join(repoRoot, 'node_modules', dep);
  if (!fs.existsSync(from)) continue;
  fs.cpSync(from, path.join(target, dep), { recursive: true });
}
console.log('prepared', target);
