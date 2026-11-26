# VJ-022 — consultation notes and event journal

**Delivered:** 2026-09-26 · Depends on VJ-011 · Acceptance: *evidence links;
draft recovery; immutable report association*

Schema v3 adds `consultations`, `consultation_evidence`, `journal_events` and
`drafts`. Wired to `/consultation-tools`.

## Immutable report association

A consultation captures the profile's **revision** — and the snapshot id where
one exists — at the moment it is written, and never recomputes them.

This is the point of the whole feature. If a birth time is rectified six
months after a reading, the old consultation must still say what it was
actually about. Binding to "the profile" would silently re-point every past
note at a chart the client was never shown.

Editing a consultation's text deliberately cannot move its binding:
`updateConsultationNotes()` writes only the four text fields. Verified in the
browser — after correcting a birth time to v2, the earlier consultation still
reads *"பதிவு செய்யப்பட்ட revision v1 · தற்போதைய v2 — பழைய பதிவு மாறவில்லை"*.

## Evidence links

A consultation stores the VJ-006 `RuleEvidence` it was reasoning from, so a
note can be traced to the page it rests on.

Withheld evidence is stored **as withheld** rather than dropped. A rule with
no verified source stays visible as `SOURCE_REQUIRED` in the record, because
silently omitting it would let a gap read as a finding — the same discipline
that removed the random prediction engine.

The write is transactional: a consultation whose evidence is rejected rolls
back entirely rather than leaving a note with no provenance.

## Draft recovery

Typing autosaves to the `drafts` table after 800ms. Reopening the client
restores the text and shows when it was saved.

Tested two ways: the unit test closes and reopens the library to simulate a
crash; the browser test navigates away mid-sentence and back, and the draft
returns. Submitting clears the draft, so a recovered note cannot reappear
after it has been filed.

Autosave is best-effort — a failed save is swallowed rather than interrupting
typing with an error.

## Event journal

Life events (date, category, description) recorded against a person,
independent of any consultation. Newest first, indexed by
`(profile_id, event_date)`. Intended to support rectification work, where
known events are compared against dasha periods.

## Backups cover all of it

`exportAll`/`importAll` were extended to carry consultations, evidence links
and journal entries. An archive that silently dropped the practitioner's own
notes would be worse than no archive. The VJ-022 test asserts a consultation
survives a backup and restore **with its revision binding and evidence
intact**, not merely that the text came back.

## Tested

`npm run test:consultations`, plus the browser flow end to end: save a client,
type a note, navigate away, return to find the draft recovered, record it,
correct the birth time to v2, and confirm the consultation still reports v1.

## Not done yet

- The UI records evidence links but does not yet let a practitioner *attach*
  specific rules from a chart view — the data layer supports it, the picker
  belongs with VJ-016's evidence panels.
- Consultations bind a `snapshotId` when given one, but no page currently
  computes and passes a snapshot. That connection arrives with VJ-016/VJ-019.
