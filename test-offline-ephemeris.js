/**
 * Calculation without a connection (src/ephemeris/browserSwisseph.js): the Swiss Ephemeris compiled to WebAssembly (@swisseph/browser),
 * with the same .se1 files, must give what the server's native @swisseph/node gives.
 *  1. every function the engines use, over dates from 1800 to 2100, places from 34° S to 65° N, four ayanamshas and three house systems;
 *     the rising and setting of the Sun, ported from swecl.c rise_set_fast, in both of the program's sunrise modes;
 *  2. the engines themselves (the panchangam, the daily kalams, the birth chart, the Vimshottari dasha, "Today for you") run once on the
 *     native library and once on the WebAssembly one, and their results compared whole.
 * The WebAssembly module runs in Node here; the browser loads the same files (public/ephe/).
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const { pathToFileURL } = require('node:url');

const ROOT = __dirname;
const native = require('@swisseph/node');
const SHIM = path.join(ROOT, 'src/ephemeris/browserSwisseph.js');
const shim = require(SHIM);

async function loadWasmInstance() {
  const dist = path.join(ROOT, 'node_modules/@swisseph/browser/dist');
  const { SwissEphemeris } = await import(pathToFileURL(path.join(dist, 'swisseph-browser.js')).href);
  const factory = (await import(pathToFileURL(path.join(dist, 'swisseph.js')).href)).default;
  const bytes = fs.readFileSync(path.join(dist, 'swisseph.wasm'));
  const s = new SwissEphemeris();
  s.module = await factory({
    instantiateWasm(imports, done) {
      WebAssembly.instantiate(bytes, imports).then((r) => done(r.instance, r.module));
      return {};
    },
  });
  s._wrapFunctions();
  s.ready = true;
  try { s.module.FS.mkdir('/ephemeris'); } catch { /* exists */ }
  for (const f of ['sepl_18.se1', 'semo_18.se1', 'seas_18.se1']) {
    // the files the browser fetches from public/ephe/ must be these
    const pub = fs.readFileSync(path.join(ROOT, 'public/ephe', f));
    const pkg = fs.readFileSync(path.join(ROOT, 'node_modules/@swisseph/node/ephemeris', f));
    assert.ok(pub.equals(pkg), `public/ephe/${f} is @swisseph/node's own file`);
    s.module.FS.writeFile(`/ephemeris/${f}`, pub);
  }
  s.setEphemerisPath('/ephemeris');
  return s;
}

const near = (a, b, tol, what) => assert.ok(Math.abs(a - b) <= tol, `${what}: ${a} vs ${b} (diff ${a - b})`);

(async () => {
  const s = await loadWasmInstance();
  shim.useSwissEphemerisInstance(s);
  assert.equal(s.version(), '2.10.03', 'the same Swiss Ephemeris release as @swisseph/node 1.3.1 (libswe/sweph.h SE_VERSION)');
  assert.equal(shim.isBrowserSwissephReady(), true);

  // ------------------------------------------------------------------ 1. the functions
  const { Planet, LunarPoint, SiderealMode, CalculationFlag, HouseSystem, RiseTransitFlag } = native;
  const bodies = [Planet.Sun, Planet.Moon, Planet.Mercury, Planet.Venus, Planet.Mars, Planet.Jupiter, Planet.Saturn, LunarPoint.MeanNode, LunarPoint.TrueNode];
  const dates = [];
  for (let y = 1800; y <= 2100; y += 13) for (const [m, d, h] of [[1, 3, 0.25], [6, 21, 12.5], [10, 9, 23.75]]) dates.push([y, m, d, h]);
  const flagSets = [undefined, CalculationFlag.SwissEphemeris | CalculationFlag.Speed | CalculationFlag.Sidereal, CalculationFlag.SwissEphemeris | CalculationFlag.Equatorial];
  let positions = 0;
  let worst = 0;
  for (const mode of ['Lahiri', 'Raman', 'Krishnamurti', 'TrueCitra']) {
    native.setSiderealMode(SiderealMode[mode]);
    shim.setSiderealMode(SiderealMode[mode]);
    for (const [y, m, d, h] of dates) {
      const jd = native.julianDay(y, m, d, h);
      assert.equal(shim.julianDay(y, m, d, h), jd);
      assert.deepEqual({ ...shim.julianDayToDate(jd) }, { ...native.julianDayToDate(jd) });
      near(shim.getAyanamsa(jd), native.getAyanamsa(jd), 1e-12, `ayanamsa ${mode} ${y}`);
      near(shim.getAyanamsaExUt(jd), native.getAyanamsaExUt(jd), 1e-12, `ayanamsa ex ${mode} ${y}`);
      for (const body of bodies) {
        for (const flags of flagSets) {
          const a = native.calculatePosition(jd, body, flags);
          const b = shim.calculatePosition(jd, body, flags);
          // Positions agree to about 1e-11 degree. Speeds are the library's numerical derivative, where the two builds' maths
          // libraries differ in the last bits: measured up to 2.5e-8 degree a day (0.0001" a day), far below any use of them.
          for (const k of ['longitude', 'latitude', 'distance']) {
            worst = Math.max(worst, Math.abs(a[k] - b[k]));
            near(b[k], a[k], 1e-9, `${mode} ${y}-${m}-${d} body ${body} flags ${flags} ${k}`);
          }
          for (const k of ['longitudeSpeed', 'latitudeSpeed', 'distanceSpeed']) near(b[k], a[k], 1e-6, `${mode} ${y}-${m}-${d} body ${body} flags ${flags} ${k}`);
          positions += 1;
        }
      }
    }
  }
  console.log(`  ${positions} positions, largest difference ${worst.toExponential(2)} (degrees or au)`);

  const places = [[13.0827, 80.2707], [11.34, 77.72], [28.61, 77.21], [51.5, -0.12], [40.71, -74.0], [-33.87, 151.21], [58.97, 5.73], [64.5, -21.9], [-26.2, 28.05]];
  for (const hs of ['Porphyrius', 'Placidus', 'Equal']) {
    for (const [lat, lon] of places) {
      for (const [y, m, d, h] of dates.slice(0, 40)) {
        const jd = native.julianDay(y, m, d, h);
        const a = native.calculateHouses(jd, lat, lon, HouseSystem[hs]);
        const b = shim.calculateHouses(jd, lat, lon, HouseSystem[hs]);
        assert.deepEqual(Object.keys(b).sort(), Object.keys(a).sort());
        for (const k of Object.keys(a)) {
          if (Array.isArray(a[k])) a[k].forEach((v, i) => near(b[k][i], v, 1e-9, `${hs} ${k}[${i}]`));
          else if (typeof a[k] === 'number') near(b[k], a[k], 1e-9, `${hs} ${k}`);
        }
      }
    }
  }

  // the Sun's rising and setting: swe_rise_trans (native) and its fast method ported to JavaScript (shim), in both sunrise modes
  let rises = 0;
  let worstRise = 0;
  for (const bits of [0, 256 | 512]) {
    for (const event of [RiseTransitFlag.Rise, RiseTransitFlag.Set]) {
      for (const [lat, lon] of places) {
        for (let k = 0; k < 24; k += 1) {
          const jd = native.julianDay(1950 + k * 3, 1 + (k % 12), 1 + ((k * 7) % 28), 0) - lon / 360;
          for (const alt of [0, 350]) {
            const a = native.calculateRiseTransitSet(jd, Planet.Sun, event | bits, lon, lat, alt, CalculationFlag.SwissEphemeris);
            const b = shim.calculateRiseTransitSet(jd, Planet.Sun, event | bits, lon, lat, alt, CalculationFlag.SwissEphemeris);
            worstRise = Math.max(worstRise, Math.abs(a.time - b.time));
            near(b.time, a.time, 1e-9, `sun ${event} bits ${bits} at ${lat},${lon} alt ${alt} k ${k}`);
            rises += 1;
          }
        }
      }
    }
  }
  console.log(`  ${rises} sunrises and sunsets, largest difference ${(worstRise * 86400 * 1e6).toFixed(3)} microseconds`);
  assert.throws(() => shim.calculateRiseTransitSet(2460000.5, Planet.Sun, RiseTransitFlag.Rise, 18.96, 69.65, 0), RangeError, 'beyond 65°: not on the device');

  // eclipses (the classical muhurta page looks for the next ones)
  for (const start of [2451545.0, 2460000.5, 2470000.5]) {
    const sa = native.findNextSolarEclipse(start);
    const sb = shim.findNextSolarEclipse(start);
    near(sb.maximum, sa.maximum, 1e-9, 'solar eclipse maximum');
    assert.equal(sb.type, sa.type);
    const la = native.findNextLunarEclipse(start);
    const lb = shim.findNextLunarEclipse(start);
    near(lb.maximum, la.maximum, 1e-9, 'lunar eclipse maximum');
    assert.equal(lb.type, la.type);
  }

  // ------------------------------------------------------------------ 2. the engines, once on each library
  const ENGINE = ['src/contracts/chartContext', 'src/panchangam/tirukanitaPanchangam', 'src/panchangam/muhurtham', 'src/chart/parashariChart',
    'src/dasha/vimshottariDasha', 'src/ephemeris/siderealPositions', 'src/report/personalToday', 'src/chart/vargaChart'];
  function runEngines() {
    const [CC, TP, MU, PC, VD, SP, PT, VC] = ENGINE.map((m) => require(path.join(ROOT, m)));
    const out = [];
    const days = [[2026, 11, 22], [2027, 4, 14], [1990, 10, 5], [2000, 2, 29]];
    for (const [lat, lon, tz, off] of [[13.0827, 80.2707, 'Asia/Kolkata', 330], [11.34, 77.72, 'Asia/Kolkata', 330], [58.97, 5.73, 'Europe/Oslo', 60], [-33.87, 151.21, 'Australia/Sydney', 660]]) {
      for (const [y, m, d] of days) {
        for (const sunrise of ['disc-centre', 'upper-limb']) {
          const ctx = CC.createChartContext({ year: y, month: m, day: d, hour: 12, ianaTimeZone: tz, utcOffsetMinutes: off, latitude: lat, longitude: lon, placeName: 'x', calendarMode: 'tirukanita', sunrise });
          out.push(TP.calculateTirukanitaPanchangam(ctx), MU.calculateDailyMuhurtham(ctx));
        }
      }
    }
    const births = [
      { year: 1990, month: 10, day: 5, hour: 4, minute: 30, ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330, latitude: 13.0827, longitude: 80.2707, placeName: 'Chennai' },
      { year: 1973, month: 11, day: 15, hour: 8, minute: 15, ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330, latitude: 11.34, longitude: 77.72, placeName: 'Erode' },
      { year: 2019, month: 10, day: 14, hour: 8, minute: 31, ianaTimeZone: 'Europe/Oslo', utcOffsetMinutes: 120, latitude: 58.97, longitude: 5.73, placeName: 'Stavanger' },
    ];
    for (const b of births) {
      for (const ayanamsha of ['Lahiri', 'Krishnamurti']) {
        const chart = PC.calculateParashariChart(CC.createChartContext({ ...b, ayanamsha, calendarMode: 'tirukanita' }));
        out.push(chart, VC.calculateVargas ? VC.calculateVargas(chart) : null);
        const dasha = VD.buildVimshottariDasha(chart.julianDay, chart.grahas.Moon.longitude, b.utcOffsetMinutes, {
          depth: 2, yearDays: 365.25, balance: 'degree', moonLongitudeAt: (jd) => SP.planetLongitude(jd, 'Moon', ayanamsha),
        });
        out.push(dasha);
        const mahadashas = dasha.dashas.map((x) => ({ lord: x.lord, startJd: x.startJulianDay, endJd: x.endJulianDay, ...(x.fullStartJulianDay !== undefined ? { fullStartJd: x.fullStartJulianDay } : {}) }));
        for (const atMs of [Date.UTC(2026, 10, 22, 3, 0), Date.UTC(2031, 5, 26, 12, 0)]) {
          out.push(PT.personalToday({ natalMoonLongitude: chart.grahas.Moon.longitude, mahadashas, utcOffsetMinutes: b.utcOffsetMinutes, atMs, ayanamsha }));
        }
      }
    }
    return JSON.parse(JSON.stringify(out));
  }

  const nativeRun = runEngines();
  // the same engine files again, with @swisseph/node resolved to the WebAssembly interface, as the browser build resolves it
  for (const key of Object.keys(require.cache)) if (key.startsWith(path.join(ROOT, 'src')) && key !== SHIM) delete require.cache[key];
  const resolve = Module._resolveFilename;
  Module._resolveFilename = function (request, parent, ...rest) {
    if (request === '@swisseph/node') return SHIM;
    return resolve.call(this, request, parent, ...rest);
  };
  let wasmRun;
  try {
    wasmRun = runEngines();
  } finally {
    Module._resolveFilename = resolve;
  }
  assert.equal(wasmRun.length, nativeRun.length);
  const diffs = [];
  (function compare(a, b, at) {
    if (typeof a === 'number' && typeof b === 'number') {
      if (Math.abs(a - b) > 1e-7 * Math.max(1, Math.abs(a))) diffs.push(`${at}: ${a} vs ${b}`);
    } else if (a && b && typeof a === 'object') {
      for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) compare(a[k], b[k], `${at}.${k}`);
    } else if (a !== b && !(at.endsWith('.engine') || at.endsWith('.engineVersion'))) diffs.push(`${at}: ${JSON.stringify(a)} vs ${JSON.stringify(b)}`);
  })(nativeRun, wasmRun, 'run');
  assert.deepEqual(diffs, [], 'the engines give the same results on the device as on the server');
  console.log(`  ${nativeRun.length} engine results (panchangam, kalams, charts, vargas, dashas, Today for you) the same on both`);

  // ------------------------------------------------------------------ 3. the stand-ins for Node's modules in the browser build
  const nodeCrypto = require('node:crypto');
  const bc = require('./src/offline/browserCrypto');
  for (const text of ['', 'abc', 'a'.repeat(55), 'a'.repeat(56), 'a'.repeat(64), 'x'.repeat(1000), 'ரேவதி · 15-11-1973 · ஈரோடு', JSON.stringify({ k: [1, 2, 3], t: 'தமிழ்' })]) {
    assert.equal(bc.createHash('sha256').update(text).digest('hex'), nodeCrypto.createHash('sha256').update(text).digest('hex'), `sha256 of ${text.slice(0, 20)}`);
  }
  assert.equal(bc.createHash('sha256').update('ab').update('c').digest('hex'), nodeCrypto.createHash('sha256').update('abc').digest('hex'), 'in parts');
  assert.throws(() => bc.createHash('md5'), /not available/);
  const bp = require('./src/offline/browserPath');
  assert.equal(bp.join('/', 'node_modules', '@swisseph', 'node', 'package.json'), '/node_modules/@swisseph/node/package.json');
  assert.equal(bp.join('a', '..', 'b', './c'), 'b/c');
  assert.equal(bp.dirname('/a/b/c.js'), '/a/b');
  assert.equal(bp.dirname(17), '.', 'a bundler module id is not a path');
  assert.equal(bp.basename('/a/b/c.js', '.js'), 'c');
  assert.equal(bp.extname('x/y.se1'), '.se1');
  assert.equal(bp.resolve('/a', 'b', '../c'), '/a/c');
  const bf = require('./src/offline/browserFs');
  assert.throws(() => bf.readFileSync('/node_modules/@swisseph/node/package.json'), (e) => e.code === 'ENOENT');
  assert.equal(bf.existsSync('/x'), false);
  // the bundlers hand these to the browser build and nothing else (next.config.mjs)
  const cfg = fs.readFileSync(path.join(ROOT, 'next.config.mjs'), 'utf8');
  for (const [name, file] of [['@swisseph/node', 'src/ephemeris/browserSwisseph.js'], ['fs', 'src/offline/browserFs.js'], ['path', 'src/offline/browserPath.js'], ['crypto', 'src/offline/browserCrypto.js']]) {
    assert.ok(cfg.includes(`'./${file}'`) && (cfg.includes(`'${name}'`) || cfg.includes(`${name}:`)), `${name} -> ${file}`);
  }
  assert.ok(/browser: file/.test(cfg) && /if \(!isServer\)/.test(cfg), 'Turbopack under the browser condition, webpack for the client build only');
  assert.ok(/serverExternalPackages: \['@swisseph\/node'\]/.test(cfg), 'the server keeps the native addon');

  console.log('test-offline-ephemeris: all assertions passed');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
