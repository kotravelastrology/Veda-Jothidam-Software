const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { HOME_SECTIONS, allHomeLinks } = require('./src/navigation/homeSections');
const T = require('./src/sources/tamilNames');

// --- every link is a page of the program
const appDir = path.join(__dirname, 'app');
const pageOf = (route) => path.join(appDir, route.split('?')[0], 'page.tsx');
const links = allHomeLinks();
for (const l of links) {
  assert.ok(fs.existsSync(pageOf(l.route)), `${l.route} (${l.ta}) is not a page`);
  assert.ok(l.ta && /[஀-௿]/.test(l.ta), `${l.route} has a Tamil name`);
  assert.ok(l.en && l.icon, `${l.route} has an English name and an icon`);
}

// --- no page twice, and no empty section
const routes = links.map((l) => l.route);
assert.strictEqual(new Set(routes).size, routes.length, `a page is listed twice: ${routes.filter((r, i) => routes.indexOf(r) !== i)}`);
for (const s of HOME_SECTIONS) assert.ok(s.links.length > 0, `${s.key} is empty`);
assert.strictEqual(new Set(HOME_SECTIONS.map((s) => s.key)).size, HOME_SECTIONS.length);

// --- every page of the program is on the home page (a new page must be given a place); only these are not
const NOT_LISTED = new Set(['/', '/sync/conflicts']);
function pages(dir, base = '') {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    const route = `${base}/${e.name}`;
    if (fs.existsSync(path.join(dir, e.name, 'page.tsx'))) out.push(route);
    out.push(...pages(path.join(dir, e.name), route));
  }
  return out;
}
const missing = pages(appDir).filter((r) => !NOT_LISTED.has(r) && !r.includes('[') && !routes.includes(r));
assert.deepStrictEqual(missing, [], `pages not on the home page: ${missing.join(', ')}`);

// --- the shared Tamil names
assert.strictEqual(T.RASI_TA.length, 12);
assert.strictEqual(T.RASI_TA_SHORT.length, 12);
assert.strictEqual(T.NAKSHATRA_TA.length, 27);
assert.strictEqual(T.WEEKDAY_TA.length, 7);
assert.strictEqual(T.YOGA_TA.length, 27);
assert.strictEqual(T.NAKSHATRA_TA[0], 'அசுவினி');
assert.strictEqual(T.NAKSHATRA_TA[16], 'அனுஷம்');
assert.deepStrictEqual(T.tithiTa(0), { paksha: 'வளர்பிறை', name: 'பிரதமை' });
assert.deepStrictEqual(T.tithiTa(14), { paksha: 'வளர்பிறை', name: 'பௌர்ணமி' });
assert.deepStrictEqual(T.tithiTa(20), { paksha: 'தேய்பிறை', name: 'சஷ்டி' });
assert.deepStrictEqual(T.tithiTa(29), { paksha: 'தேய்பிறை', name: 'அமாவாசை' });
assert.ok(Object.isFrozen(T.RASI_TA) && Object.isFrozen(T.NAKSHATRA_TA), 'a page cannot change the shared names');

console.log(`test-home-sections: ${HOME_SECTIONS.length} sections, ${links.length} pages; all assertions passed`);
