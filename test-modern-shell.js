/**
 * The modern shell: the phone's bottom tabs, the shared panchangam and "Today for you" texts, and the installable app's files
 * (manifest, icons, service worker, the no-connection page).
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

// ------------------------------------------------------------------ the bottom tabs
const { BOTTOM_NAV, isActiveTab } = require('./src/navigation/bottomNavItems');
const { allHomeLinks } = require('./src/navigation/homeSections');
const routes = new Set(allHomeLinks().map((l) => l.route));
assert.equal(BOTTOM_NAV.length, 4, 'four tabs and the ☰ button make the five places of a thumb bar');
for (const t of BOTTOM_NAV) {
  assert.ok(t.route === '/' || routes.has(t.route), `${t.route} is a page of the program`);
  assert.ok(/[஀-௿]/.test(t.ta) && t.en && t.icon, `${t.key}: a Tamil name, an English name and an icon`);
}
assert.equal(new Set(BOTTOM_NAV.map((t) => t.route)).size, BOTTOM_NAV.length);
assert.equal(isActiveTab('/', '/'), true);
assert.equal(isActiveTab('/', '/worksheet'), false, 'the home tab is only the home page');
assert.equal(isActiveTab('/worksheet', '/worksheet'), true);
assert.equal(isActiveTab('/worksheet', '/worksheet/anything'), true);
assert.equal(isActiveTab('/dasha-timeline', '/dasha-timelines'), false, 'a longer name is not a sub-page');

// ------------------------------------------------------------------ the texts that are shared
const { composeShareText, whatsappLink } = require('./src/ui/shareText');
const { panchangamShareText, dateTa } = require('./src/ui/panchangamShare');
const { personalShareText } = require('./src/ui/personalShare');

assert.equal(dateTa('2026-11-20'), '20 நவம்பர் 2026');
assert.equal(dateTa('2027-01-05'), '5 ஜனவரி 2027');
const today = {
  date: '2026-11-20', placeName: 'Chennai', weekdayTa: 'வெள்ளி', sunrise: '06:10',
  tithi: { paksha: 'வளர்பிறை', name: 'தசமி', until: '07:16' }, nakshatra: { name: 'பூரட்டாதி', until: '06:57' },
  yoga: { name: 'ஹர்ஷணம்', until: '06:40' }, karana: { name: 'கரசை', until: '07:16' },
  rahuKalam: '10:28–11:54', yamagandam: '14:47–16:13', gulikaKalam: '07:36–09:02',
};
const p = panchangamShareText(today);
assert.equal(p.title, '🗓️ இன்றைய பஞ்சாங்கம் — வெள்ளி, 20 நவம்பர் 2026');
for (const line of ['📍 Chennai · 🌅 உதயம் 06:10', 'திதி: வளர்பிறை தசமி (07:16 வரை)', 'நட்சத்திரம்: பூரட்டாதி (06:57 வரை)', 'யோகம்: ஹர்ஷணம் (06:40 வரை)', 'கரணம்: கரசை (07:16 வரை)', 'ராகு காலம்: 10:28–11:54', 'எமகண்டம்: 14:47–16:13', 'குளிகை: 07:36–09:02', 'திருக்கணிதம் · Karanam Ramakumar, Panchangam Calculations']) {
  assert.ok(p.text.split('\n').includes(line), line);
}
const message = composeShareText(p);
assert.ok(message.startsWith(p.title) && message.endsWith('— Kotravel வேத ஜோதிடம்'));
assert.ok(!/undefined|null|NaN/.test(message));
assert.equal(composeShareText({ title: 'a', text: ' b ' }, '— f'), 'a\n\nb\n\n— f');
assert.equal(composeShareText({ title: 'a', text: 'b', url: 'https://x.test/' }, '— f'), 'a\n\nb\n\n— f\nhttps://x.test/');
assert.equal(whatsappLink('வணக்கம் 1&2'), 'https://wa.me/?text=' + encodeURIComponent('வணக்கம் 1&2'));

const pt = {
  janma: { starTa: 'ரேவதி', rasiTa: 'மீனம்' },
  dasha: [
    { levelTa: 'தசை', lordTa: 'சூரியன்', end: '2031-06-26' }, { levelTa: 'புக்தி', lordTa: 'சந்திரன்', end: '2027-01-01' }, { levelTa: 'அந்தரம்', lordTa: 'செவ்வாய்', end: '2026-12-01' },
  ],
  moon: { starTa: 'உத்திரட்டாதி', count: 27, tara: 9, taraTa: 'பரம மைத்ர', houseFromMoon: 1 },
  saturn: { rasiTa: 'மீனம்', houseFromMoon: 1, sadeSati: { nameTa: 'இரண்டாம் இரண்டரை ஆண்டு (ஜென்ம ராசி)' } },
  jupiter: { rasiTa: 'சிம்மம்', houseFromMoon: 6 },
};
const s = personalShareText('Test', pt, '2026-11-20');
assert.equal(s.title, '✨ Test — இன்றைய நிலை (20 நவம்பர் 2026)');
const lines = s.text.split('\n');
assert.equal(lines[0], 'ஜன்ம ராசி மீனம், ஜன்ம நட்சத்திரம் ரேவதி');
assert.equal(lines[1], 'தசை: சூரியன் · புக்தி: சந்திரன் · அந்தரம்: செவ்வாய்');
assert.equal(lines[2], 'தசை முடிவு: 26-06-2031');
assert.ok(lines.includes('சந்திரன் இன்று: உத்திரட்டாதி (ரேவதி-இலிருந்து 27-ஆவது நட்சத்திரம், 9-ஆம் தாரை பரம மைத்ர), ராசிக்கு 1-ஆம் வீடு'));
assert.ok(lines.includes('சனி: மீனம் — ராசிக்கு 1-ஆம் வீடு · சாடே சாதி: இரண்டாம் இரண்டரை ஆண்டு (ஜென்ம ராசி)'));
assert.ok(lines.includes('குரு: சிம்மம் — ராசிக்கு 6-ஆம் வீடு'));
assert.equal(lines.at(-2), '');
assert.equal(lines.at(-1), 'நூல்கள் கூறும் நிலைகள் மட்டும்; தீர்ப்பு அல்ல.');
// no Sade Sati: the line carries only the house; and nothing says that the day is good or bad
const calm = personalShareText('Test', { ...pt, saturn: { rasiTa: 'ரிஷபம்', houseFromMoon: 4, sadeSati: null } }, '2026-11-20');
assert.ok(calm.text.includes('சனி: ரிஷபம் — ராசிக்கு 4-ஆம் வீடு\n'));
assert.ok(!/சாடே சாதி/.test(calm.text));
assert.ok(!/நல்ல நாள்|கெட்ட நாள்|அதிர்ஷ்ட/.test(s.text + calm.text));
assert.ok(!/1990|05-10|Chennai|சென்னை/.test(s.text), 'no birth detail is in the text');

// ------------------------------------------------------------------ the installable app's files
const root = __dirname;
const exists = (f) => fs.existsSync(path.join(root, f));
for (const f of ['public/sw.js', 'public/offline.html', 'public/icons/icon.svg', 'public/icons/icon-192.png', 'public/icons/icon-512.png', 'public/icons/maskable-512.png', 'public/icons/apple-touch-icon.png', 'app/icon.png', 'app/apple-icon.png', 'app/manifest.ts']) {
  assert.ok(exists(f), `${f} exists`);
}
// the icons are PNGs of the sizes the manifest names
const pngSize = (f) => { const b = fs.readFileSync(path.join(root, f)); assert.equal(b.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', `${f} is a PNG`); return [b.readUInt32BE(16), b.readUInt32BE(20)]; };
assert.deepEqual(pngSize('public/icons/icon-192.png'), [192, 192]);
assert.deepEqual(pngSize('public/icons/icon-512.png'), [512, 512]);
assert.deepEqual(pngSize('public/icons/maskable-512.png'), [512, 512]);
assert.deepEqual(pngSize('public/icons/apple-touch-icon.png'), [180, 180]);

// the manifest names only files that exist and routes that are pages
const manifestSrc = fs.readFileSync(path.join(root, 'app/manifest.ts'), 'utf8');
for (const m of manifestSrc.matchAll(/src: '(\/[^']+)'/g)) assert.ok(exists(`public${m[1]}`), `manifest icon ${m[1]}`);
for (const m of manifestSrc.matchAll(/url: '(\/[^']*)'/g)) {
  const route = m[1].split('?')[0];
  assert.ok(route === '/' || routes.has(route), `manifest shortcut ${m[1]} is a page`);
}
assert.ok(/display: 'standalone'/.test(manifestSrc) && /lang: 'ta'/.test(manifestSrc) && /start_url: '\/'/.test(manifestSrc));

// the service worker keeps the build's files and the icons and the no-connection page, and nothing of a chart: it never answers a POST (server actions) or a page from a cache
const sw = fs.readFileSync(path.join(root, 'public/sw.js'), 'utf8');
assert.ok(/request\.method !== 'GET'\) return/.test(sw), 'only GET requests are looked at');
assert.ok(/\/_next\/static\//.test(sw) && /\/icons\//.test(sw), 'the build files and the icons are kept');
assert.ok(/caches\.match\('\/offline\.html'\)/.test(sw), 'the no-connection page answers a page that cannot be reached');
const [beforePages, pagesPart] = sw.split("request.mode === 'navigate'");
assert.ok(pagesPart && !/put\(/.test(pagesPart), 'no page is put in the cache');
assert.equal((sw.match(/cache\.put\(/g) || []).length, 1, 'the one cache write is the build file branch');
assert.ok(/isBuildFile/.test(beforePages.split('cache.put(')[0]), 'and it is inside that branch');
for (const asset of sw.match(/PRECACHE = \[([^\]]*)\]/)[1].match(/'(\/[^']+)'/g).map((q) => q.slice(1, -1))) assert.ok(exists(`public${asset}`), `pre-cached ${asset} exists`);
const offline = fs.readFileSync(path.join(root, 'public/offline.html'), 'utf8');
assert.ok(/lang="ta"/.test(offline) && /இணைய இணைப்பு இல்லை/.test(offline) && /location\.reload\(\)/.test(offline) && /href="\/"/.test(offline));

// the registrar runs the worker in production only and removes a development one
const registrar = fs.readFileSync(path.join(root, 'src/pwa/PwaRegistrar.tsx'), 'utf8');
assert.ok(/process\.env\.NODE_ENV !== 'production'/.test(registrar) && /unregister\(\)/.test(registrar) && /register\('\/sw\.js'/.test(registrar));

console.log('test-modern-shell: all assertions passed');
