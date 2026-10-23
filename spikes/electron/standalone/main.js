/**
 * VJ-008 packaged proof, with the question that matters most: does the
 * packaged app still read the bundled .se1 ephemeris files, or does Swiss
 * Ephemeris quietly fall back to its Moshier analytical model because the
 * data is sealed inside app.asar where fopen cannot reach it?
 */
const { app, net } = require('electron');
const fs = require('node:fs');
const path = require('node:path');

app.disableHardwareAcceleration();

app.whenReady().then(() => {
  const out = { electron: process.versions.electron, node: process.versions.node, abi: process.versions.modules };
  try {
    const swe = require('@swisseph/node');
    const pkgDir = path.dirname(path.dirname(require.resolve('@swisseph/node')));
    const epheDir = path.join(pkgDir, 'ephemeris');

    out.epheDir = epheDir;
    out.epheDirInsideAsar = epheDir.includes('app.asar') && !epheDir.includes('app.asar.unpacked');
    // The real question: can the C library actually open the data?
    try {
      const f = path.join(epheDir, 'sepl_18.se1');
      out.epheReadable = fs.statSync(f).size > 0;
    } catch (e) {
      out.epheReadable = false;
      out.epheError = e.code;
    }

    // THE FIX: point the C library at the unpacked copy. Node's fs can read
    // inside app.asar, but the native library uses raw fopen and cannot, so
    // the auto-detected path silently yields Moshier.
    if (out.epheDirInsideAsar) {
      const unpacked = epheDir.replace('app.asar', 'app.asar.unpacked');
      if (fs.existsSync(path.join(unpacked, 'sepl_18.se1'))) {
        swe.setEphemerisPath(unpacked);
        out.redirectedTo = unpacked;
      } else {
        out.redirectedTo = null;
      }
    }

    const jd = swe.julianDay(1990, 5, 15, 5.0);
    swe.setSiderealMode(swe.SiderealMode.Lahiri);
    // The Moon exposes the difference; the Sun does not.
    const swiss = swe.calculatePosition(jd, swe.Planet.Moon,
      swe.CalculationFlag.SwissEphemeris | swe.CalculationFlag.Sidereal);
    const moshier = swe.calculatePosition(jd, swe.Planet.Moon,
      swe.CalculationFlag.Moshier | swe.CalculationFlag.Sidereal);

    out.swiss = Number(swiss.longitude.toFixed(8));
    out.moshier = Number(moshier.longitude.toFixed(8));
    out.swissEqualsMoshier = out.swiss === out.moshier;
    out.ok = true;
  } catch (error) {
    out.ok = false;
    out.error = error.message;
  }
  out.online = net.isOnline();
  console.log('VJ008_RESULT=' + JSON.stringify(out, null, 2));
  app.exit(out.ok ? 0 : 1);
});
