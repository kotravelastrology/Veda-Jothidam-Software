# Veda Jothidam — Kotravel Vedic Astrology

A Tamil-first Vedic astrology program for practising astrologers, built page by page to the feature set of Parashara's Light 9,
with every calculation checked against a named book, author and page.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # 224 test scripts, one after another; exit 0 = all pass
npx tsc --noEmit   # 0 errors expected
npm run build      # production build
```

Node 24 or newer (the chart library uses the built-in `node:sqlite`). The Swiss Ephemeris comes with `@swisseph/node`.

## How it is laid out

| Where | What |
|---|---|
| `app/` | One folder per page (Next.js app router). `app/page.tsx` is the home page: the open chart, today's panchangam, every page by task. |
| `app/worksheet/` | The worksheet a chart opens on (PL9's "Birth chart I"): Rasi, Navamsha, dasha, planets, strengths. |
| `src/report/`, `src/chart/`, `src/dasha/`, `src/panchangam/` | The calculations, plain JavaScript, each tested by a `test-*.js` in the root. |
| `src/sources/` | Shared data: citations (`citeTa.js`), Tamil names (`tamilNames.js`), the place atlas and historical time zones (`places/`). |
| `src/navigation/` | Menus (`pl9Menus.js`, PL9's order), the icon toolbar (`toolbarPanels.js`), the home page's map of pages (`homeSections.js`). |
| `docs/` | `PL9-gap-register.md` (what matches PL9, what does not, by date), `PL9-menu-inventory.md`, one note per feature. |
| `docs/source-records/` | The stage records: which book and page each calculation was verified against. |
| `docs/archive/` | Old progress reports, kept unchanged; their "complete" claims were often not true (see `docs/AUDIT-phase30-claims.md`). |
| `backend/` | A separate Flask service (accounts, licences, sync). The web app does not need it to calculate. |

## Rules the code keeps

- A calculation has a source: book, author, page (never a PDF file name). Where books differ, every reading is kept and the most
  explained one is shown first.
- No page shows sample numbers as if they were the chart's.
- A new page is added to `src/navigation/homeSections.js` (the home page and Ctrl+K read it); `test-home-sections.js` fails otherwise.
- Tamil sign, nakshatra and weekday names come from `src/sources/tamilNames.js`, never a local list.
- A setting is offered only if something reads it.

## Docker

`docker compose up` starts PostgreSQL, Redis, the Flask backend and the web app (`Dockerfile.frontend`, the Next.js program; the
saved charts are kept in the `veda_library` volume). `docker-compose.production.yml` does the same for a server; put TLS in front of
port 80.

The README that described the earlier SaaS setup (Flask with a static HTML frontend) is in `docs/archive/README-old-saas-setup.md`.
