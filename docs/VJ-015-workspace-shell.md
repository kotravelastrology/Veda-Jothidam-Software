# VJ-015 — desktop workspace shell

**Delivered:** 2026-09-27 · Acceptance: *keyboard, command search, profile
context, saved layouts*

## Dependency not met

The plan lists VJ-010 (clickable prototype and usability review) as a
dependency, and it has **not** been done. This shell was therefore designed
from the plan's acceptance criteria and the existing navigation code, not from
observed user behaviour.

That is a real gap, not a formality: VJ-010 exists to find confusion points
before a shell is built around them. Treat the layout choices here as a first
proposal to be tested, not as settled.

## What was already there

`NavigationProvider`, `TopMenuBar`, `Sidebar`, `Breadcrumb`, `StatusBar`,
`useKeyboardShortcuts` (Ctrl+N/O/S/P/Q and others), and the Settings / Tools /
Help panels. This work builds on them rather than replacing them.

## Profile context — the real gap

Before this, every page carried its own birth form. Opening the same person on
four pages meant typing the birth details four times, and nothing told you
which chart a screen referred to.

`WorkspaceProvider` now holds the active profile for the whole app:

- Selected from the command palette, which searches the VJ-011 library.
- Shown permanently in `ActiveProfileBar` with name, **revision** and birth
  details. Ambient state that cannot be seen is a trap — a practitioner must
  never be unsure which person is on screen, and showing the revision matters
  because VJ-011 keeps several.
- Survives navigation and reload.
- Cleared in one click.

The bar renders nothing until the persisted state has been read, so a session
with a profile does not flash "nobody selected" first.

## Command search — Ctrl+K

Searches three groups in one box:

| Group | Source |
|---|---|
| ஜாதகங்கள் | The library's FTS5 index, via a Server Action |
| பக்கங்கள் | The app's routes |
| செயல்கள் | Library backup (VJ-012) |

Charts come from SQLite rather than from whatever the current page has
loaded, so the palette can find a person the page has never heard of. Search
is debounced; arrow keys and Enter work; Escape closes.

**This is also where VJ-012 finally becomes reachable.** Backup had working,
tested Server Actions that no UI called. Now `Ctrl+K → "Backup"` runs it and
reports the archive path.

## Saved layouts

Sidebar visibility and display density persist across restarts. Ownership
moved from `NavigationProvider`'s local `useState` to the workspace, so the
value is read from storage rather than reset to `true` on every reload.

Persisted to `localStorage`, **deliberately not to the chart library**: this
is per-machine UI preference, not user data, and it must not end up inside a
VJ-012 archive where restoring someone else's backup would drag their sidebar
state along. Reads and writes are wrapped in try/catch, because
`localStorage` throws in a private window.

## Keyboard

The existing `useKeyboardShortcuts` bindings are unchanged. Ctrl/Cmd+K is
added at the window level so the palette opens from any page, and Escape
closes it.

## Verified in the browser

Saved a client, opened Ctrl+K, confirmed all three groups appear with the real
chart listed, selected it, and checked that:

- the profile bar shows the name and `v1`;
- the context follows a navigation to another page;
- it survives a full reload with no flash of the empty state;
- `localStorage` holds both the profile and the layout.

Test data was removed from the user library afterwards.

## Not done yet

- **Pages do not consume the active profile.** The context is set and visible,
  but `/dasha-timeline` and the others still have their own birth forms. Making
  each page prefer the workspace profile is the obvious follow-up and is what
  turns this from plumbing into time saved.
- Backup is in the palette but restore is not; restore needs a file picker and
  a confirmation step, which belongs with a real File menu.
- `WindowManager.tsx` remains unused. Saved *window* layouts, as opposed to
  panel layouts, are an Electron concern and belong with VJ-029's shell work.
