# S5 — Next.js Frontend Setup

Status: FRAMEWORK INSTALLED, FIRST PAGE BUILDS AND RENDERS REAL DATA (dev server verified in-browser, desktop/mobile/dark checked). Not yet Tamil-script-complete — see "Known gap" below. No commit/push (no git repository yet).

## Environment finding (important, unrelated to this project's own code)

`npm view`/`npm install` initially failed with `ENOSPC`. Diagnosis: **the C: drive is completely full** (`147G used / 147G total, 1.4MB free`); D: has 221GB free. npm's default cache/temp directories live under `C:\Users\gvkot\AppData\Local`, so any C:-drive npm operation fails regardless of this project. Worked around it for this session only by pointing `npm_config_cache`/`TEMP`/`TMP` at `D:\npm-temp\` (created fresh, nothing on C: was touched or deleted). This is a standing problem on the Owner's machine beyond this project's scope — flagged here rather than silently worked around forever; every future `npm install` in this environment will need the same redirection (or the Owner freeing C: drive space) until fixed.

## Stack chosen

- **Next.js 16.3.4** (App Router, Turbopack), **React 19**, **TypeScript 5**, **Tailwind CSS 4** (CSS-based `@theme inline` config, no separate `tailwind.config.ts` needed at this version), ESLint 9 flat config with `eslint-config-next`.
- Chosen to match the sibling AstrologicLab worktrees' stack for consistency — but this is an **entirely new, separate project tree**; nothing under the legacy `AstrologicLab` worktrees was read, copied, or modified, per PLAN-001's read-only rule on legacy repositories.
- `next.config.mjs` sets `serverExternalPackages: ['@swisseph/node']` so the native ephemeris addon is never bundled for the client, only ever runs server-side.
- Removed `"type": "commonjs"` from `package.json` (it was forcing Turbopack to treat the new `.tsx` ESM files as CommonJS and fail the build); the existing `src/*.js` and `test-*.js` CommonJS files are unaffected, since plain `.js` without a `"type"` field still defaults to CommonJS in Node.

## What was built

- `app/layout.tsx` — root layout, `lang="ta"`, Noto Sans Tamil (body) + Noto Serif Tamil (headings) via `next/font/google`.
- `app/globals.css` — light/dark tokens (`prefers-color-scheme`, no manual toggle yet) mapped into Tailwind v4 via `@theme inline`: saffron (auspicious accent), rose (avoid-time semantic), teal (good-time semantic), indigo (structural accent) — chosen so colour carries meaning (avoid vs. good time) rather than being decorative.
- `app/page.tsx` — the S5 daily dashboard, a Server Component (so the native Swiss-Ephemeris addon only ever executes on the server): computes **today's actual date in Asia/Kolkata** (not the server's own timezone) for a default location (Chennai, 13.0827°N 80.2707°E), then renders real output from `calculateTirukanitaPanchangam`, `calculateDailyMuhurtham`, and `calculateVakyaPanchangam` — no placeholder/sample data.
  - Five-limb cards (Tithi, Nakshatra, Yoga, Karana; Vara in the header).
  - Colour-coded time-window chips: Rahu Kalam/Yamagandam/Gulika Kalam/Durmuhurtham/Varjyam in rose ("avoid"), Amrit Kaal in teal ("good") — matching S1-B's own good/avoid framing.
  - Abhijit Muhurta and Vakya Panchangam rendered as honest dashed "pending" cards showing the exact `SOURCE_REQUIRED` message, never hidden or faked.
  - Source citation footer, reusing S2's `attachSource` data already present on the panchangam result.

## Verification performed

- `npm run build` → compiles and prerenders `/` as static content; no TypeScript errors (Next auto-updated `tsconfig.json`'s `jsx` setting to `react-jsx` and added a dev-types include, both expected/standard Next.js behaviour, left as Next set them).
- `npm test` → all 5 existing backend suites still pass unchanged.
- Dev server started on port 3001 (3000 was already occupied — likely by the concurrent session noted separately) and checked live in-browser: desktop screenshot, mobile (375×812) screenshot, and dark-mode screenshot all confirmed — cards render, colours and both Tamil fonts load, layout reflows correctly on mobile, dark palette stays legible.

## Known gap — not Tamil-script-complete

All astronomical term names (Navami, Mrigashira, Vajra, Taitila, Shanivara, etc.) currently render in Latin transliteration, because that is how `TITHI_NAMES`/`NAKSHATRA_NAMES`/`YOGA_NAMES`/`VARA_NAMES`/`karanaName()` are defined in the S3 backend. PLAN-001 calls for a "Tamil-first" presentation, which for a genuinely public-facing card means these should show in actual Tamil script (e.g. நவமி, மிருகசீரிடம், சனிக்கிழமை), with the transliteration as a secondary label if useful. This was not done in this stage — it is a real, sizeable content task (translating ~30+27+27+7+11 terms correctly, not just transliterating) rather than a UI change, and is recorded here honestly rather than silently left unmentioned.

## Next workflow position

Two concrete follow-ups, either can come next: (a) add correct Tamil-script names for all five-limb and kalam labels, closing the gap above; (b) continue the registered sequence into S6 (birth profile and Parashari chart), which will need its own UI. Event-type filters (mentioned in WORKFLOW-REGISTER-001's S5 description) apply to personalised Muhurtham matching (S1-E, Tarabala/Chandrabala/Panchaka against a birth chart) rather than this daily neutral-time-window view, so they naturally belong with whichever stage introduces birth profiles.
