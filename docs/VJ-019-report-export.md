# VJ-019 — ReportDocument and PDF export

**Delivered:** 2026-09-27 · Deps VJ-006, VJ-016 met · Acceptance: *valid
bytes; Tamil fonts; long names; no clipped tables; export preview*

## Why Chromium and not a PDF library

Tamil is a complex script: vowel signs reorder around consonants and clusters
form ligatures, so correct output needs real text shaping. The common
JavaScript PDF libraries place glyphs without shaping and would emit
disconnected marks that look like text but are not — which, for a report handed
to a client, is worse than failing outright.

Chromium shapes through HarfBuzz, and Electron's `printToPDF` embeds the fonts
it used. VJ-008 already proved Electron viable, so the PDF is produced by
printing the report page rather than by drawing it.

This also settles F05 from the Phase 30 audit — HTML served under a PDF MIME
type — with a real PDF rather than a better label.

## The model

`buildReportDocument({ snapshot, subject, generatedAtMs })` builds a document
from a VJ-006 `ChartSnapshot` and carries its `snapshotId`. A PDF in a
client's hands can therefore be traced to exactly the chart that produced it,
even after the birth time is later rectified (ADR-07).

Nothing reads the clock. `generatedAtMs` is a parameter, so building twice from
one snapshot gives an identical document — which is what makes "this PDF
matches that reading" checkable rather than merely asserted. Omitting it leaves
the field `null` instead of stamping *now*.

Withheld evidence is printed **as withheld**, with its reason. A report that
quietly dropped the Shadbala total would let a gap read as a finding.

## Export preview

`renderReportHtml()` produces the printable page, and that same HTML is both
the preview and the input to `printToPDF`. What the practitioner approves is
what the client receives; there is no second renderer to drift.

## Measured results

From `npm run export:pdf-proof` (Electron 44.4.5), using a deliberately long
60-character Tamil name:

| Criterion | Result |
|---|---|
| Valid bytes | `%PDF-1.4`, 59,434 bytes, 2 pages, catalog and `%%EOF` present |
| Tamil fonts | **3 embedded** font subsets (`NirmalaUI`, `NirmalaUI-Bold`), with `/ToUnicode` |
| Long names | `h1` scrollWidth 1209 = clientWidth 1209 — the name wraps, nothing overflows |
| No clipped tables | widest table scrollWidth 1209 = body clientWidth 1209 — the 16-column varga table fits |
| Export preview | the preview HTML *is* the print input |

Two further properties worth having: the HTML renders byte-identically twice,
and so does the PDF (`pdfReproducible: true`).

**Tamil was verified as text, not just as a font name.** Inflating the PDF's
streams and reading its ToUnicode CMaps found **26 distinct Tamil codepoints
mapped** across 3 CMaps — அ, இ, ஏ, ஐ, க, ச, ட and others — so the text is
shaped, embedded and extractable, not pictures of letters.

`inspectPdf()` does this validation without a PDF parsing dependency, since
the point is an independent check. It rejects the F05 case explicitly: HTML
bytes produce *"missing %PDF- header — this is not a PDF"*.

## Layout rules that earn their place

- Headings and cells use `overflow-wrap: anywhere`, so a long name wraps
  instead of pushing the page sideways.
- Nothing uses `overflow: hidden`; a wide table reduces its type instead of
  losing columns.
- `thead` repeats across pages and rows are not split, so a table spanning a
  page break stays readable.
- A name is user input and is escaped — the test asserts `<script>` in a name
  cannot reach the output.

## Not done yet

- **A Tamil font must be bundled before release.** The proof used Windows'
  NirmalaUI, so output currently depends on the user's system fonts. Shipping
  Noto Sans Tamil (SIL OFL, so redistributable) with the app is required for
  VJ-029, and the licence should be recorded alongside VJ-007's inventory.
- No UI calls this yet: `/pdf-reports` still proxies Flask. Wiring the button
  to `printToPDF` belongs with the Electron shell.
- PNG export is not implemented. The same print pipeline can produce it, but
  it is not done and is not claimed.
