# VJ-023 — Parashara's Light XML import

**Delivered:** 2026-09-27 · Deps VJ-006, VJ-011, VJ-012 met · Acceptance:
*test copies only; field mapping, duplicate detection, loss report, rollback*

## Read this first: the field mapping is unverified

I had **no real Parashara's Light chart export** to build against. The
repository contains PL9's `Options/options.xml`, which is an application
settings file with no birth data in it, and PL9 is not installed on this
machine.

`FIELD_MAP` in `src/import/pl9Import.js` is therefore **provisional**: element
and attribute names chosen from what PL9's documented export formats (XML,
QCK, AEF) and comparable Jyotish XML typically use. The test fixtures are
synthetic and are labelled as such. They prove the *pipeline* works; they
prove nothing about whether the mapping matches a real export.

**To finish this properly, export one chart from Parashara's Light as XML and
give me the file.** Confirming or correcting the mapping against it is a small
change. Until then the importer is honest about not knowing rather than
plausible and wrong.

The design compensates for this: an unrecognised file is **refused with the
element paths it actually contains**, so a wrong mapping produces a clear
"I do not understand this file" rather than a library full of wrong birth
data.

```
no chart records recognised. Expected one of Chart, Horoscope, Native,
Person, Record, Entry or birth fields on the root element, but the file
contains: Root, Root/Unrelated, Root/Unrelated/Thing
```

## Test copies only

`inspectPl9File()` copies the source into a temp directory and parses the
copy. The original is never opened for writing. The test asserts both the
bytes and the mtime of the source are unchanged after an inspection — someone
else's records are not ours to risk.

## Refuse rather than guess

Two refusals matter more than the rest:

- **A record with no time zone is rejected, not defaulted.** Assuming IST for
  a chart that is not Indian would shift every calculation downstream while
  looking perfectly normal. The rejection says so.
- **A record missing year, month, day, hour, latitude or longitude is
  rejected** and listed by name, rather than imported with holes.

Time zones are accepted as `5:30`, `-8:00`, `5.5` or `330`; anything else is
refused rather than coerced.

## Field mapping is recorded per record

Each planned import carries a `provenance` map — `name: '@Name'`,
`year: 'Year'` — so the wizard can show *where each value came from* rather
than asking the user to trust it.

## Duplicate detection

Matches on name plus birth moment, in two directions:

- against profiles already in the library (reporting which one it matched);
- against other records inside the same file.

Re-running the same file imports nothing and flags both records.

## Loss report

Every element or attribute present in the file that nothing mapped from is
listed. For the synthetic fixture that is `Rasi`, `Nakshatra` and
`AyanamsaUsed` — data PL9 stores that this schema has no place for. A
practitioner learns this before importing, not months later.

Note that PL9's computed values are deliberately *not* imported even where we
could store them: they were produced by a different engine. Birth data is
imported and the chart is recomputed here, which is the only way the result
stays consistent with the rest of the app.

## Rollback

Schema v4 adds an `imports` table recording which profile ids each import
created. `rollbackImport()` removes exactly those and marks the import
rolled back.

The test asserts the part that matters: a hand-entered profile created between
two imports **survives** the rollback of an unrelated import. Rollback by
"delete anything recent" would have taken it.

Imports are included in VJ-012 archives, so restoring a backup preserves the
rollback history too.

## The XML reader

`src/import/xml.js` is a small strict reader rather than a dependency: the
import path reads other people's files, so it understands exactly one simple
shape and throws on anything else. Mismatched tags, unclosed elements, empty
documents and non-XML input are all refused with a position.

It is validated against the repository's **real** PL9 `options.xml`, which
exercises attributes, nested text, self-closing and empty elements.

## Tested

`npm run test:import`. Not yet wired to a UI — `app/import/actions.ts` exposes
preview, run, undo and list, and the wizard screen belongs with the File menu
work still outstanding from VJ-015.
