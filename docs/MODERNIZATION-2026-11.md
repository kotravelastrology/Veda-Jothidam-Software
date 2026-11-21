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
- The status bar (larger screens) now says whether the server can be reached and which ayanamsha and nodes new charts take, instead of
  a fixed "Ready".

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

## Deliberately not done

- **Free-form "ask the AI about my chart"**: an answer that is not one of the books' statements would break the sourcing rule. A safe
  form would explain the page in view from its own cited lines; that needs the owner's decision and an API key.
- **Push notifications** (Rahu kalam, a dasha change): needs a push server and the person's permission flow.
- **Calculation without a connection**: the ephemeris runs on the server; doing it in the browser means Swiss Ephemeris in WebAssembly
  and its licence. Offline, the app shows its shell, the saved panchangam and the no-connection page.
- **A second language for the whole interface**: every page's text would need translating.

## Notes

- `npx eslint` fails in this repository with "Converting circular structure to JSON" from the shared Next config (it did before this
  pass); `npx tsc --noEmit` and the test suite are the checks that run.
