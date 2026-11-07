# S10-G — Ayana Bala (resolving the source-internal contradiction)

Status: Ayana Bala is now fully resolved. **Kaala Bala's own six-verse span (v.8-17) is entirely complete** (Nathonnata, Paksha, Tribhaga, Varsha-Masa-Dina-Hora, Ayana). With this, Sthana, Dig, Kaala, Naisargika, Drik and Yuddha Bala are ALL fully resolved — the only remaining Shadbala gap is Cheshta Bala for 6 of 7 planets. Working tree only — no commit/push/backup (no git repository yet). Per the Owner's explicit instruction this session: re-examine the single admitted BPHS source itself rather than treating a formula/table mismatch as automatically unresolvable, and prefer whichever single reading within that one book is actually correct.

## What was wrong with the earlier "unresolvable contradiction" conclusion

S10's original pass found that the translator's own "simple formula" note --- "Ayana Bala = ((23°27' + Kranti) × 60) ÷ 46°54'" --- did not reproduce the same note's own printed "Speculum of Ayana Bala" table, and concluded this was a genuine, irreconcilable source-internal contradiction.

Per the Owner's instruction, the actual PDF pages (file p.218-219, printed p.218-219) were re-rendered and visually inspected directly (not just the OCR'd text extraction, which had already caused a small amount of table-column confusion elsewhere in this project, e.g. the Ahargana table in S10-E):

- File p.218 ends with the table's own header row: **"Kranti | Ayana Bala | Kranti | Ayana Bala | Kranti | Ayana Bala"** (three repeated column-pairs, since the table is laid out in three side-by-side blocks for space).
- File p.219 continues the SAME header, wrapped onto a second line for typesetting reasons: **"+ | Bala | + | Bala | + | Bala"** then **"23°27' | | 23°27' | | 23°27' |"** then **"° ' | | ° ' | | ° '"** (degree/minute sub-labels) -- i.e. the full two-line header for each block is "Kranti" / "(ranges 0 to) +23°27'", annotating the column's *maximum possible value* (the obliquity of the ecliptic, ≈23°27', the largest declination the Sun can ever reach) -- not an operand to be added to every row.
- **Hand-verified against many rows with this "+23°27'" annotation removed from the arithmetic** (i.e. Ayana Bala = Kranti × 60/46°54' alone, no addition): 0°47' → 1.00 (0.7833° × 1.2793 = 1.0016), 1°34' → 2.00, 2°21' → 3.00, 5°10' → 6.6, 7°30' → 9.6 -- every checked row matches to the printed precision.

**Conclusion**: the translator's printed formula prose ("(23°27' + Kranti) × 60 ÷ 46°54'") mistakenly folded the table's own column-range header annotation into the arithmetic expression -- a transcription artifact, not a second convention or a genuine disagreement between two independently-stated rules. Removing that folded-in term makes the formula and the table agree exactly. This is resolved using only this one admitted book, exactly as instructed -- no second corpus source was needed once the actual page images were examined directly instead of relying on the noisy text extraction alone.

## Implementation

- `src/chart/shadbala.js`: added `kranti(planet, jd)` (fetches ecliptic-independent equatorial declination via `@swisseph/node`'s `CalculationFlag.Equatorial` -- verified against the Sun's own declination at the June/December 2000 solstices, ±23.437°/-23.438°, matching Earth's obliquity exactly) and `ayanaBala(planet, planetKranti)` (the corrected formula: `Kranti × 60/46°54'`, with the v.15-17 Notes' own sign convention -- Southern Kranti counts as positive for the Moon and Saturn, contrary for the other four; Mercury is always positive regardless of hemisphere; the Sun's result is doubled). Wired into `calculateShadbala`, replacing the previous `sourceRequired(...)` refusal.
- Since all five Kaala Bala sub-components are now resolved, **`kaalaBalaPartial` is renamed to `kaalaBala`** throughout (`shadbala.js`, `test-shadbala.js`, `app/report/ReportBuilder.tsx`) -- matching the same "stop calling it partial once it's actually complete" discipline already applied to `sthanaBalaPartial` in S10-C. `shadbalaTotal`'s refusal reason updated to name the one remaining real gap (Cheshta Bala, 6 of 7 planets) -- Sthana, Dig, Kaala, Naisargika, Drik and Yuddha Bala are all now fully resolved.
- `app/report/ReportBuilder.tsx`: the itemized Kaala Bala breakdown table (added in S10-E, styled after Parashara's Light 9's "Detailed Shad Bala" report) now shows a real Ayana row instead of a `SourceRequiredBadge` for all 7 planets; the காலம் (Kaala) column header's asterisk footnote was removed since it's fully resolved, and moved to a new சேஷ்டா* footnote naming the one real remaining gap.

## Tests

- `test-shadbala.js`: `ayanaBala` checked directly against 4 rows of the chapter's own printed Speculum table (using Mars, whose result isn't doubled, to isolate the raw table match); the Sun's doubling rule checked explicitly; the Moon's Southern-Kranti-is-positive / Northern-is-negative sign flip checked in both directions; Mercury's always-positive rule checked for both hemispheres. Updated the integration test's stale `ayanaBala.status === 'SOURCE_REQUIRED'` assertion to `Number.isFinite(...)`, renamed `kaalaBalaPartial` references to `kaalaBala` and extended the component-sum check to include the newly-resolved Ayana term.
- Full suite: `npm test` → all 22 scripts pass (no new test file this stage; additions went into the existing `test-shadbala.js`).

## TypeScript/lint/build

`npm run build` → compiles, TypeScript check passes, all 4 routes prerender successfully.

## Desktop/mobile validation

Verified live via the dev server (Browser pane): confirmed the itemized Kaala Bala breakdown now shows real Ayana values for all 7 planets (e.g. Sun +48.0, Mars -8.1 for the test birth used throughout S10) with no `SourceRequiredBadge`. One transient console error ("Cannot read properties of undefined (reading 'toFixed')") was observed in the tab that had stayed open live-reloading across all of this session's edits -- traced to a stale HMR log accumulated from a genuinely inconsistent *intermediate* code state mid-edit (confirmed via the console's own "[Fast Refresh] performing full reload because your application had an unrecoverable error" log immediately following it), not a current bug: opening a completely fresh tab and repeating the same birth input produced zero console errors and fully correct rendering.

## Backup

Not performed — still no git repository.

## Next workflow position

Shadbala's only remaining gap is Cheshta Bala for 6 of 7 planets (the Moon's own is already resolved, equal to her Paksha Bala) -- it needs the classical Seeghrocha/mean-motion apogee model, a genuinely new Siddhantic astronomical sub-system this project has not built, distinct in kind from every other Shadbala gap closed this session (each of which was a self-contained rule with either its own worked example or a resolvable transcription issue). Shodasa Bala's point table remains unsourced (Bhava Bala is unaffected by any of this). Given how much of S10 is now resolved, this is a strong point to also address the Owner's second standing request this session: cataloguing Parashara's Light 9's "Charts" menu as a feature-parity checklist (saved to memory), to work through alongside the harder remaining Shadbala items.
