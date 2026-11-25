# Modernisation pass, November 2026

The owner asked (2026-11-21) for the program to be brought up to what a current astrology app offers, as an astrologer, an engineer and
a UI/UX designer would. This records what was built, why, and what was deliberately left out. The sourcing rule is unchanged: nothing
here calculates anything new, every astrological statement shown comes from an engine that already cites its book, and no screen says
that a day or a period is good or bad.

## 1. Phone-first shell

- **Bottom tabs** on screens below `md` (`src/navigation/BottomNav.tsx`, data in `bottomNavItems.js`): முகப்பு, ஜாதகம் (worksheet),
  தசை (dasha timeline), நாட்காட்டி (Tamil calendar) and the ☰ menu with every page. Fixed, clear of the home indicator
  (`env(safe-area-inset-bottom)`), current tab marked with `aria-current` as well as colour. The status bar is hidden on phones; the page
  keeps clear of the tabs.
- **Search on phones**: a 🔎 button in the top bar opens the same command palette as Ctrl+K on a computer.
- **Less chrome**: on phones the toolbar keeps its icons (each has its name as `aria-label` and tooltip) and drops the words under them;
  the `Ctrl+K` hint is hidden on touch screens (`.kbd-hint`).
- **Viewport**: `h-dvh` (the height that follows the phone's browser bar), `viewport-fit=cover` and a theme colour for light and dark.

## 2. Installable app (PWA)

- `app/manifest.ts` (served at `/manifest.webmanifest`): Tamil name, standalone display, theme colours, icons, and long-press shortcuts
  (பஞ்சாங்கம், ஜாதக மேசை, புதிய ஜாதகம், நல்ல நேரம், முகூர்த்தம்).
- Icons: `public/icons/icon.svg` is the source (the home page's kolam wheel with the Om, saffron on the top bar's brown); the PNGs
  (`icon-192`, `icon-512`, `maskable-512`, `apple-touch-icon`, and `app/icon.png`, `app/apple-icon.png`) were rendered from it with a
  headless Chrome. Regenerate them the same way if the SVG changes.
- `public/sw.js`, registered by `src/pwa/PwaRegistrar.tsx` **in the production build only** (in development any old worker is removed):
  keeps the build's own files (`/_next/static/*`, content-hashed, so never stale) and the icons, and answers a page that cannot be
  reached with `public/offline.html` (Tamil). It never stores a page, a chart, a calculation or a server action's answer, so a chart is
  never shown from an old copy.
- Install: `src/pwa/InstallApp.tsx` on the home page: the browser's own install dialog (Chrome, Edge, Android) or, on an iPhone/iPad,
  the two Share-sheet steps. `src/pwa/pwaStore.ts` keeps the online / installable / installed facts in one store.
- The status bar (larger screens) now says whether the browser has a network (navigator.onLine, which cannot tell whether the server
  answers) and which ayanamsha and nodes new charts take, instead of a fixed "Ready".

## 3. Home page

- **Today's panchangam**: a shimmer placeholder while it is calculated; the last calculated day is kept on the device
  (`kotravel-last-today`) and shown, marked as saved, when there is no connection; a **share** button (see 5).
- **இன்று உங்களுக்கு (Today for you)**, under the open chart's card (`src/ui/PersonalTodayCard.tsx`, server action
  `computePersonalToday` in `app/todayActions.ts`, engine `src/report/personalToday.js`, test `test-personal-today.js`):
  - the running dasha, bhukti and antara (the dasha page's own division, `src/dasha/dashaDrill.js`) with dates, a bar of how much has
    passed, and days left;
  - the Moon of the day: star and quarter, its count from the birth star, the tara with Pulippani's name and result for it
    (`nakshatraGocharaTables.js`), its house from the birth Moon;
  - Saturn's sign and house from the birth Moon, with the Sade Sati phase from `saturnTransit.js`'s `saturnStateAt` and its table;
  - Jupiter's sign and house from the birth Moon.
  Every line opens the page with the whole reading and its sources (நட்சத்திரக் கோசாரம், சனிப் பெயர்ச்சி, கோசார வேதை). The card says
  "நூல்கள் கூறும் நிலைகள் மட்டும் · தீர்ப்பு இல்லை". It is read again when the person comes back to the tab after 15 minutes.
  The Jupiter test date was checked by hand: on 20 Nov 2026 Jupiter is at tropical ~146 deg (Leo 26), sidereal Leo 2, so in Simha.

## 4. Dasha life map

`app/dasha-timeline/DashaLifeMap.tsx` replaces the plain 120-year bar on the dasha page: the nine mahadashas as one bar with the
person's age along it and a "today · age" marker; a tap on a mahadasha opens a second bar of its nine bhuktis with the same marker and
their start months. Each period is a button with a full spoken label (lord, dates, ages). No calculation beyond `dashaDrill.js`.

## 5. Sharing

`src/ui/share.ts` + `ShareButton.tsx`: the phone's share sheet (WhatsApp, Telegram, messages), else the text is copied, else a WhatsApp
link with the text. Only text is shared, never a link to a chart. The texts are built by plain modules with tests
(`src/ui/shareText.js`, `panchangamShare.js`, `personalShare.js`; `test-modern-shell.js`). The personal text carries the name in its
title (to be removed before sending if wished) and no birth detail.

## 6. Accessibility and HTML

- One `<main>` per page: the layout's (`id="main-content"`); the 72 page views that had their own `<main>` now use `<div>`.
- A skip link ("உள்ளடக்கத்துக்குச் செல்") as the first Tab stop, a saffron focus ring wherever focus lands, progress bars with
  `role="progressbar"`, status lines with `aria-live`, and `prefers-reduced-motion` honoured (no transitions or shimmer).

## Second pass (2026-11-21, "மீதி உள்ளவற்றைக் கட்டு")

The owner asked for the rest to be built. Of the four items first left out, two are built in a form that keeps the sourcing rule, one
in part, and one is left for the owner's decision.

### 7. இந்தப் பக்கத்தை விளக்கு (AI explains the page in view)

- **What it does**: the ✨ button in the top bar sends the page's visible text (or the part the reader selected) with a question to
  Claude, which must answer from that text alone: no rule, meaning, prediction or remedy the page does not state, no verdict, every
  book's reading kept apart, and the page's own supporting lines copied word for word. `src/ai/pageExplain.js` then looks for each
  copied line on the page: a line found is marked ✓, a line not on the page ✗ with a warning not to rely on that part.
  `test-page-explain.js` (a stand-in client; nothing is sent).
- **Request**: `app/explainActions.ts` with the official SDK (`@anthropic-ai/sdk` 1.6.0, pinned); model `claude-opus-5-5` (env
  `KOTRAVEL_AI_MODEL` may name another), effort `medium`, the answer as structured output (JSON schema), the page in the user turn
  with a cache breakpoint (a second question on the same page reads it from the cache), and server-side refusal fallback
  (`fallbacks: "default"`).
- **Privacy**: before anything leaves the server the open chart's name and birthplace are replaced (ஜாதகர், பிறந்த ஊர்); the panel
  shows the exact text that is sent and, before the first question on a device, says what is sent, to whom, and that each question is
  billed. Birth date and time and other names on the page are sent as they are, and the panel says so.
- **Off by default**: the button appears only when the server has `ANTHROPIC_API_KEY` (or `ANTHROPIC_AUTH_TOKEN`). A server-wide limit
  (`KOTRAVEL_AI_PER_HOUR`, default 60 questions an hour) keeps a server left open to the internet from running up the key owner's bill:
  the program has no sign-in of its own, so the limit cannot be per person.
- **Checked**: on the production build against a local stand-in for the API (scratchpad `prod-with-mock.mjs`): the button, the consent,
  a whole-page and a selection question, ✓ ✓ ✗ marks and the warning, the name and place not in what was sent, and the request's
  model, effort, format, fallback and cache settings. **Not called with a real key** (none is configured here).

### 8. Notifications (அறிவிப்புகள்)

- **What**: the morning panchangam at a chosen time for the astrologer's place (the home card's five limbs, Rahu kalam, Yamagandam),
  and the starts of the open chart's dasha periods (dasha and bhukti, or with antara too) for two years, told on the morning of the
  day. Facts only, as the home page and the dasha page show them. A test message. Settings page card
  (`src/notify/NotificationSettings.tsx`).
- **How**: Web Push. The browser's subscription is checked to point at a real push service (FCM, Mozilla, Apple, Windows; the server
  will not post to any other address) and kept in `notifications.db` beside the chart library (`src/notify/notifyStore.js`;
  `VEDA_NOTIFY_PATH`), with the server's VAPID keys (made once, or `VAPID_PUBLIC_KEY`/`VAPID_PRIVATE_KEY`). A dasha notice is stored as
  its finished text and time: no birth details are kept. `instrumentation.ts` starts a one-minute clock in the production server
  (`src/notify/schedulerHost.ts`, `scheduler.js`); each message is claimed in the store before it is sent, so two servers on one file
  never both send it; a failed send is retried the next minute; a browser the push service no longer knows is removed. `web-push` 3.6.7
  (pinned; 4.0.0 was 15 days old) signs and encrypts. The service worker (`kotravel-v2`) shows the message and opens only this app's
  pages. `test-notify.js`.
- **Checked**: on the production build in Chrome: permission, subscription with Google's push service, the server's test message
  through FCM to the service worker (decrypted, in about a second), `showNotification` with these options, following a chart (21
  antara starts listed). Headless Chrome does not keep shown notifications, so a notification on a real phone's screen is the
  remaining device check (VJ-021).
- **Limits**: only in the production build (the service worker is not registered in development); on an iPhone only after "Add to
  Home Screen"; when the browser replaces a subscription by itself, opening the settings page and switching on again is needed.

### 9. A saved copy for "இன்று உங்களுக்கு"

The card keeps its last result for the chart on the device (`src/ui/savedCopy.js`, keyed by birth moment, place and settings, never
shown for another chart) and with no connection shows it marked with the time it was computed. The calculation itself still needs the
server (see below).

### 10. ESLint

`eslint.config.mjs` now uses Next 16's own flat configs (the FlatCompat wrapper had stopped ESLint before any rule ran). `npx eslint .`
ends with 0 errors and about 1,036 warnings. Turned off or down, with the reason in the file: `no-require-imports` (the engines are
CommonJS by design), `no-explicit-any` (warning: engine results are untyped JSON), `react/no-unescaped-entities` (quotes in Tamil and
English text), and the React Compiler checks of eslint-plugin-react-hooks 6 (warnings: 54 setState-in-effect, 9 components made during
render, 4 used-before-declared, 3 Date.now in render, 1 ref read in render), which are worth a later pass page by page. One real error
fixed (`prefer-const` in app/kota-chakra/actions.ts).

## Third pass (2026-11-22, "இந்த இரண்டையும் செய்து முடித்து விடலாம்")

### 11. Calculation without a connection (இணையம் இல்லாமல் கணக்கிடுதல்)

When the server cannot be reached, the home page's panchangam and "இன்று உங்களுக்கு", the worksheet and the dasha page are computed
on the device by **the same engine code** the server runs, on **the same Swiss Ephemeris** compiled to WebAssembly, with **the same
data files**. There is no second calculation path to drift: the three server actions' bodies moved into `src/calc/chartRuns.ts`, which
both the server actions and the device (`src/offline/localEngine.ts`) call.

- `@swisseph/browser` 1.4.0 (pinned; libswe 2.10.03, the same version as the server's `@swisseph/node` 1.3.1) and the three .se1
  files in `public/ephe/` (planets 1800-2399, Moon, main asteroids). One download of about 2.5 MB (425 KB wasm + 2.0 MB data),
  kept by the service worker.
- `src/ephemeris/browserSwisseph.js` gives the browser module the native module's shape and defaults (the browser build defaults to
  Moshier; the native one to the Swiss Ephemeris files). `swe_rise_trans` is not in the WebAssembly build: its fast path
  (`rise_set_fast` in swecl.c, with Sinclair refraction) is ported line by line; it covers what the program asks for (Sun to true
  node, rise and set, |latitude| ≤ 60°, the Sun to 65°) and throws a RangeError outside it rather than guess.
- The bundlers swap `@swisseph/node`, `fs`, `path` and `crypto` for browser stand-ins in client code only (`next.config.mjs`,
  webpack and Turbopack); the server keeps the native module.
- Only a network failure falls back to the device (`withLocalFallback`); a server answer that is an error is shown as an error. A
  page computed on the device says so (📴 chip). Settings has a card to switch it off on a device, to prepare it now, and to compare
  the server's and the device's panchangam for today.
- Verified: `test-offline-ephemeris.js` compares native and WebAssembly over 1800-2100, 34° S-65° N, four ayanamshas, three house
  systems (positions to 1e-9°, speeds to 1e-6°/day, sunrises/sunsets to a microsecond) and runs 94 engine results both ways, all
  equal; in the browser, with the production server stopped, the three pages showed the same text as with the server running
  (production builds of Next 16.3.4, webpack and Turbopack; also in English). The Turbopack build also passes on Next 16.4.5.
- **Licence (VJ-007)**: serving `public/ephe/` and the WebAssembly build distributes Astrodienst's Swiss Ephemeris to every visitor.
  Under the AGPL that obliges offering the program's source to them; the alternative is Astrodienst's commercial licence. This is the
  owner's decision and must be made before the site is public; until then, deploy only privately, or remove `public/ephe/` and the
  package.

### 12. English interface (ஆங்கில இடைமுகம்)

The **EN / த** switch in the top bar (`src/i18n/LangToggle.tsx`) shows every page in English; the choice is kept per device. The
pages are not changed and the program stays written in Tamil: `src/i18n/Translator.tsx` replaces the Tamil text on the screen (and
title, aria-label, placeholder, alt) from a catalogue as React draws it, after hydration; a boot script hides the page until the first
pass is done (at most 3 s).

- The catalogue `src/i18n/en.json` is built by `node scripts/i18n/build.js` from: the names (`src/i18n/catalog/names.js`, index by
  index from `src/sources/tamilNames.js`), the books' own English where the data keeps it beside the Tamil, and the hand translations
  `src/i18n/catalog/*.json`. Text the code builds from parts is a pattern with {0}, {1}… so English can order its own words.
- **Coverage: all 4,219 Tamil texts of the interface** (everything in `app/` and `src/**/*.tsx`). `test-i18n.js` fails when one has no
  English, or only part of it; after adding Tamil to a page run `node scripts/i18n/build.js --missing out.json`, add the English to a
  `src/i18n/catalog/*.json`, and build again.
- A word with two senses gets its sense from the page: `data-i18n-ctx="weekday"` (செவ்வாய் = Tuesday, not Mars), `"month"`
  (சித்திரை = Chithirai, not Chitra), `"abbr"` (the worksheet chart's Su, Mo, Ju…); a weekday or month word after a part fixes it too.
- What the engines write (names of avasthas, taras, sahams, KP events, gem-wearing rules, the horoscope book's page titles…) has
  English too (`src/i18n/catalog/engine-*.json`). Measured on all 73 pages with a chart open (every page opened in Tamil, its texts
  put through the catalogue the way the Translator does): 22,158 of 25,182 texts come out wholly in English (88%); 46 pages have no
  Tamil left and 55 are at 95% or more. Most of what is left is on the book pages: /muhurta-stars, /samudrika, /planet-house,
  /varshaphala, /gochara-vedha, /latta.
- **What stays in Tamil**: the books' statements whose English the data does not keep (the summaries the program wrote in Tamil from
  the books). Putting them into English would be a new translation of a translation that no page cites, so they are left as written,
  like the names and places people type in (and the Tamil names on /baby-names).

## Still not done

- **The books' statements in English**: where the data keeps only the Tamil summary (see above), and some of the rule labels of the
  book pages named there.
- **Free-form chat about a chart**: replaced by the page explainer above, which answers only from the page.

## Notes

- `npm audit` lists advisories in packages that were here before this pass (next 16.3.4: one critical, fixed in 16.4.6; electron,
  sharp, undici, zod and others). Neither package added here is among them. Upgrading Next is a separate step with its own testing.
