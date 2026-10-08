/**
 * Every link in the navigation must resolve to a route that exists.
 *
 * The PL9 parity audit found six that did not: /tools/location, /tools/time,
 * /tools/rectification, /reference/yogas, /reference/nakshatras and
 * /reference/karanas. Three of those named tools the product does not have;
 * the fourth pointed one directory too deep at a page that does exist.
 *
 * A menu entry is a promise. This test is the thing that keeps it.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const APP = path.join(__dirname, 'app');

/** Route paths, from the directories that contain a page.tsx. */
function routes(dir = APP, prefix = '') {
  const found = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory()) {
      if (e.name === 'page.tsx' && prefix) found.push(prefix);
      continue;
    }
    if (e.name === 'api' || e.name.startsWith('_')) continue;
    found.push(...routes(path.join(dir, e.name), `${prefix}/${e.name}`));
  }
  return found;
}

const existing = new Set(routes());
existing.add('/');
assert.ok(existing.size > 20, `expected the app's routes; found ${existing.size}`);

/** Does this href match a route, allowing for [dynamic] segments? */
function resolves(href) {
  if (existing.has(href)) return true;
  const parts = href.split('/');
  return [...existing].some((route) => {
    const rp = route.split('/');
    if (rp.length !== parts.length) return false;
    return rp.every((seg, i) => seg === parts[i] || /^\[.+\]$/.test(seg));
  });
}

const NAV_FILES = ['src/navigation/Sidebar.tsx', 'src/navigation/TopMenuBar.tsx', 'src/navigation/MainLayout.tsx'];

const broken = [];
let checked = 0;
for (const file of NAV_FILES) {
  const full = path.join(__dirname, file);
  if (!fs.existsSync(full)) continue;
  const text = fs.readFileSync(full, 'utf8');
  // href: '/x' and href="/x" — internal links only; external and anchors are
  // not this test's business.
  for (const m of text.matchAll(/href[:=]\s*["'](\/[^"'#?]*)["']/g)) {
    const href = m[1].replace(/\/$/, '') || '/';
    if (href.startsWith('/api')) continue;
    checked += 1;
    if (!resolves(href)) {
      broken.push(`${file}: ${href}`);
    }
  }
}

assert.ok(checked > 5, `expected navigation links to check; found ${checked}`);
assert.deepEqual(broken, [],
  `navigation links point at routes that do not exist:\n  ${broken.join('\n  ')}`);

// The specific six the audit found must stay gone.
for (const dead of ['/tools/location', '/tools/time', '/tools/rectification',
  '/reference/yogas', '/reference/nakshatras', '/reference/karanas']) {
  assert.equal(existing.has(dead), false, `${dead} should not exist`);
  for (const file of NAV_FILES) {
    const full = path.join(__dirname, file);
    if (!fs.existsSync(full)) continue;
    assert.ok(!fs.readFileSync(full, 'utf8').includes(`'${dead}'`),
      `${file} still links to ${dead}`);
  }
}

// Rectification does exist, and the menu must reach it.
assert.ok(existing.has('/rectification'));

console.log(JSON.stringify({
  pass: true, routes: existing.size, navLinksChecked: checked, broken: broken.length,
}, null, 2));
