# VJ-007 — Swiss Ephemeris dependency, license and data inventory

**Compiled:** 2026-09-26 · **Status:** inventory complete, **decision outstanding**

This records what the project depends on and what each licence requires. It is
**not legal advice**, and it does not make the choice. The choice belongs to
the owner, and per Astrodienst's own terms it must be made *before* the
software is distributed or a public service using it is activated.

---

## 1. The dependency

| | |
|---|---|
| Package | `@swisseph/node` **1.3.1** (`dependencies`, `^1.3.1`) |
| Declared licence | **AGPL-3.0** |
| Source | https://github.com/swisseph-js/swisseph |
| Upstream | Swiss Ephemeris by Dieter Koch and Alois Treindl, © 1997–2021 **Astrodienst AG**, Switzerland |

The npm package is a wrapper. It ships three things that matter here:

- `libswe/` — the original Astrodienst **C source**, compiled into a native addon.
- `ephemeris/` — **2.1 MB of ephemeris data**: `sepl_18.se1` (planets), `semo_18.se1` (Moon), `seas_18.se1` (asteroids), `sefstars.txt` (fixed stars).
- `prebuilds/` — prebuilt native binaries.

So the project redistributes Astrodienst's code *and* its data, not merely a
thin binding.

## 2. What the upstream licence actually says

Verbatim from the header of `libswe/swephlib.c`:

> Swiss Ephemeris is made available by its authors under a dual licensing
> system. The software developer, who uses any part of Swiss Ephemeris in his
> or her software, must choose between one of the two license models, which are
> **a) GNU Affero General Public License (AGPL)**
> **b) Swiss Ephemeris Professional License**
>
> The choice must be made **before** the software developer distributes
> software containing parts of Swiss Ephemeris to others, and **before any
> public service using the developed software is activated**.
>
> If the developer choses the AGPL software license, he or she must fulfill the
> conditions of that license, which includes **the obligation to place his or
> her whole software project under the AGPL or a compatible license**.

Two consequences follow directly from that text.

**a) AGPL is whole-project, not file-level.** Choosing AGPL means Veda
Jothidam itself — the Next.js app, the rule modules under `src/`, the Flask
backend — goes under AGPL or a compatible licence. It cannot stay proprietary
while linking Swiss Ephemeris under AGPL.

**b) AGPL §13 is triggered by hosting, not just by shipping.** The engine runs
**server-side**: `src/ephemeris/swissEphemeris.js` and
`src/ephemeris/siderealPositions.js` are reached through 16 `actions.ts`
Server Action files, all executing on the server. Under AGPL, users
interacting with the app over a network must be offered its complete
corresponding source. Astrodienst's wording ("before any public service … is
activated") says the same thing. **Publishing the web app is itself a
distribution trigger**, even if no installer is ever shipped.

## 3. Current state of the project

| Item | Finding |
|---|---|
| Repository `LICENSE` file | **None** |
| `package.json` `license` | `"UNLICENSED"` |
| Repository visibility | **Public** — github.com/kotravelastrology/Veda-Jothidam-Software |
| Choice recorded anywhere | **No** |

`"UNLICENSED"` asserts a proprietary, all-rights-reserved position. That is
**in direct tension** with depending on AGPL-3.0 code and publishing the
result. Either the dependency's terms are not being met, or the declared
licence is wrong. This needs resolving before any release, and it is the
single most important item in this document.

## 4. Other production dependencies

| Licence | Package |
|---|---|
| AGPL-3.0 | `@swisseph/node@1.3.1` |
| MIT | `next@16.3.4` |
| MIT | `react@19.2.8` |
| MIT | `react-dom@19.2.8` |

No other copyleft dependency. Swiss Ephemeris is the only constraint.

## 5. Packaging targets and how each is affected

| Target | Status | Effect |
|---|---|---|
| Web app (current) | live in dev, server-side engine | AGPL §13 network clause applies on public hosting |
| Electron desktop (VJ-008) | not started | Ships libswe + data → classic distribution trigger |
| Capacitor Android (VJ-009) | not started | Same, plus a native bridge that embeds the C library |

All three redistribute Astrodienst's code and data. None avoids the choice.

## 6. The options

**Option A — adopt AGPL-3.0.** Place the whole project under AGPL, add a
`LICENSE`, correct `package.json`, and offer complete source to network users.
Zero licence cost. Competitors may legally use the source. Note the repo is
already public, so the source is visible today regardless — but visible is not
the same as licensed, and AGPL also obliges you to *keep* offering it.

**Option B — buy the Swiss Ephemeris Professional License.** A paid contract
with Astrodienst (astro.com/swisseph). Keeps Veda Jothidam proprietary and is
consistent with a commercial product and the existing activation/licensing
work. Cost and terms must be obtained from Astrodienst; the `package.json`
`license` field would then be corrected to a proprietary declaration, and the
AGPL wrapper's own terms still need checking — the *wrapper* is published as
AGPL-3.0 independently of Astrodienst's dual offer, so confirm with Astrodienst
and the wrapper's authors that a Professional licence covers use via this npm
package.

**Option C — remove the dependency.** Replace with a differently licensed
ephemeris. Large engineering cost, and every fixture and cited calculation in
`src/` would need revalidation. Not recommended given VJ-002 is built on this
engine's output.

## 7. Recommendation

Decide between **A** and **B before VJ-008 begins.** VJ-008 and VJ-009 build
installers that embed this library; doing that work before the licence is
settled risks building a distribution that cannot lawfully ship.

Given the project already contains device activation and time-limited
licensing — machinery that only makes sense for a proprietary commercial
product — **Option B is the likely fit**, but the cost is unknown until
Astrodienst is contacted. That contact is the immediate next action, and it is
the owner's to make.

## 8. Decision record — to be completed by the owner

```
Chosen model:      [ ] A: AGPL-3.0     [ ] B: Professional License
Decided by:        ____________________
Date:              ____________________
Evidence:          ____________________   (contract ref, or LICENSE commit)
package.json fix:  ____________________
Data files:        confirmed covered?  [ ] yes  [ ] no
```

Until this block is filled in, no installer should be published and no public
deployment activated. `docs/AUDIT-phase30-claims.md` release gate item 10
("dependency/content rights … ready") stays **unmet**.

## 9. Sources

- `node_modules/@swisseph/node/libswe/swephlib.c`, lines 21–60 — Astrodienst dual-licence header (quoted above).
- `node_modules/@swisseph/node/LICENSE` — full AGPL-3.0 text.
- `node_modules/@swisseph/node/package.json` — `"license": "AGPL-3.0"`.
- https://www.astro.com/swisseph/ — Professional Edition terms and pricing.
- https://www.gnu.org/licenses/agpl-3.0.html — AGPL-3.0, §13 for the network clause.
