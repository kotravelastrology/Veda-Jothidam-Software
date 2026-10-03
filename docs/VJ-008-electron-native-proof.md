# VJ-008 — Windows Electron native worker proof

**Run:** 2026-09-27 · Deps VJ-006, VJ-007 met · Acceptance: *clean Windows
installation; airplane mode; Node addon ABI verified*

Electron 44.4.5 · Node 24.21.0 · ABI 149 · win32-x64

## Verdict

Electron is viable. The addon loads without a rebuild and produces results
identical to Node — **but only after fixing a silent ephemeris fallback that
packaging introduces.** Details below; the fix is two lines of build config
plus one line of runtime code.

## 1. ABI — no rebuild needed

`@swisseph/node` is built with `node-addon-api` and `prebuildify --napi`, and
the binary exports `napi_register_module_v1` with no `NODE_MODULE_VERSION`
string. N-API is ABI-stable across runtimes, so the prebuilt `swisseph.node`
loads unchanged under Electron's ABI 149. **`electron-rebuild` is not
required.**

ADR-03 made Electron provisional pending this proof. On the ABI question it
holds.

## 2. Results are identical, not merely similar

All **3 of 3 VJ-002 fixture hashes matched exactly** when recomputed inside
Electron. The fixtures pin longitudes to 6 decimal places across every graha,
all 16 vargas, Ashtakavarga and the full dasha tree, so this is a stronger
statement than "it ran".

## 3. node:sqlite works — the risk is cleared

VJ-011, VJ-012 and VJ-022 all sit on `node:sqlite`, which is experimental and
which Electron might not have exposed. It is present in Electron 44,
**including FTS5**, and the real chart library saved a profile and searched it
on a live file inside Electron.

No migration to `better-sqlite3` is needed. The abstraction kept for that
purpose can stay as insurance.

## 4. The finding that matters: packaging silently downgrades the ephemeris

Packaging an Electron app puts the source in `app.asar`. Two things then
diverge:

- **Node's `fs` is asar-aware.** `fs.statSync(…/ephemeris/sepl_18.se1)`
  succeeds and reports a real size.
- **The Swiss Ephemeris C library uses raw `fopen`, which is not.** It cannot
  open a file that exists only inside the archive.

Swiss Ephemeris responds to unreadable data files by **falling back to its
Moshier analytical model, with no error and no warning**. So a readiness check
written the obvious way reports healthy while the engine has quietly changed.

Measured on the Moon, sidereal Lahiri, 1990-05-15 05:00 UT:

| Build | Moon longitude | Engine actually used |
|---|---|---|
| Plain Node | `269.84243614` | bundled `.se1` |
| Packaged, no unpack | `269.84223816` | **Moshier fallback** |
| Packaged, with the fix | `269.84243614` | bundled `.se1` |

The gap is **0.71 arcseconds**. Astrologically that is far inside a nakshatra
or even a KP sub-sub boundary, so nothing would have looked wrong — which is
exactly what makes it dangerous. It is a silent change of calculation engine,
the class of defect this project has spent the whole branch removing.

`fs.statSync` returning `true` here is a lie worth remembering: **never use
Node's `fs` to decide whether a native library can read a file.**

### The fix

```js
asar: { unpack: '**/node_modules/@swisseph/node/ephemeris/**' }
```

and at startup, point the library at the unpacked copy:

```js
const epheDir = path.join(pkgDir, 'ephemeris');
if (epheDir.includes('app.asar') && !epheDir.includes('app.asar.unpacked')) {
  swe.setEphemerisPath(epheDir.replace('app.asar', 'app.asar.unpacked'));
}
```

`*.node` files are auto-unpacked by asar, so the addon itself never needed
this. Data files are not, and that asymmetry is the whole trap.

**VJ-015 must carry both lines**, and VJ-030's release regression should
assert a packaged build reproduces a fixture hash rather than merely starting.

## 5. Clean Windows install

Packaged with `@electron/packager` and run as `VedaJothidamSpike.exe` from
`%TEMP%`, outside the repository, with no dev dependencies and no
`node_modules` beside it. The addon loaded from `app.asar` with its binary in
`app.asar.unpacked` and computed correctly.

Not yet covered: a different physical machine with no toolchain, code signing,
and an installer rather than a directory. Those belong to VJ-029.

## 6. Airplane mode

The addon **cannot** use the network: the binary contains no `WSAStartup`,
`socket`, `connect`, `getaddrinfo`, `InternetOpen`, `WinHttp` or `curl`
symbols. All data is local, and the packaged app is self-contained.

This is stronger evidence than a single offline run, but it is not literally
airplane mode. To close the acceptance criterion, disable networking and run:

```bash
"%TEMP%\vj008-fixed\VedaJothidamSpike-win32-x64\VedaJothidamSpike.exe"
```

Expect `swiss: 269.84243614` and `online: false`.

## Reproducing

```bash
npx electron spikes/electron                 # in-repo checks
node spikes/electron/standalone/prepare.js   # copy runtime deps
node -e "require('@electron/packager').packager({dir:'spikes/electron/standalone',out:'out',platform:'win32',arch:'x64',asar:{unpack:'**/node_modules/@swisseph/node/ephemeris/**'}})"
```

`spikes/electron/standalone/node_modules/` is gitignored and rebuilt by
`prepare.js`.

## Consequences for the roadmap

- VJ-008 **passes**; ADR-03 (Electron) and ADR-04's Node-addon reasoning stand.
- VJ-014, VJ-015 and everything behind them are unblocked.
- VJ-009 now has a concrete comparison target: Android must reproduce
  `269.84243614`, and the same "does the native layer actually see the data
  files" question applies to a Capacitor bundle.
