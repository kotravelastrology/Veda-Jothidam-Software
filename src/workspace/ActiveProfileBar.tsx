'use client';

import { useWorkspace } from './workspaceContext';

/**
 * VJ-015 — profile context, made visible.
 *
 * Ambient state that cannot be seen is a trap: a practitioner must never be
 * unsure which person the screen refers to. This bar always says who is
 * loaded, at which revision, and offers one click to clear it.
 */
export function ActiveProfileBar() {
  const {
    activeProfile, setActiveProfile, setCommandPaletteOpen, restored,
    storageFailure, dismissStorageFailure,
  } = useWorkspace();

  // Render nothing until the persisted profile has been read, so the bar does
  // not flash "nobody selected" over a session that has one.
  if (!restored) return null;

  // VJ-013: a storage failure is shown, never swallowed. It sits above the
  // profile bar because it affects whatever the user does next.
  const failureBanner = storageFailure ? (
    <div className="px-4 py-2 border-b border-rose bg-rose/10 flex items-start gap-3">
      <span className="text-xs text-rose flex-1">{storageFailure.message}</span>
      <button onClick={dismissStorageFailure} className="text-xs text-rose/70 hover:text-rose">
        மூடு
      </button>
    </div>
  ) : null;

  if (!activeProfile) {
    return (
      <>
        {failureBanner}
        <div className="px-4 py-1.5 border-b border-line bg-surface/60 flex items-center gap-3">
          <span className="text-xs text-ink-soft">ஜாதகம் எதுவும் திறக்கப்படவில்லை</span>
          <button onClick={() => setCommandPaletteOpen(true)}
            className="text-xs text-saffron hover:underline">
            திற <kbd className="font-mono text-[10px] text-ink-soft">Ctrl+K</kbd>
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      {failureBanner}
      <div className="px-4 py-1.5 border-b border-line bg-saffron/10 flex items-center gap-3 flex-wrap">
      <span className="text-xs font-semibold text-ink">{activeProfile.name}</span>
      <span className="font-mono text-[10px] text-ink-soft">v{activeProfile.revision}</span>
      {activeProfile.birthDate && (
        <span className="text-xs text-ink-soft tabular-nums">{activeProfile.birthDate}</span>
      )}
      {activeProfile.placeName && (
        <span className="text-xs text-ink-soft">{activeProfile.placeName}</span>
      )}
      <div className="ml-auto flex gap-3">
        <button onClick={() => setCommandPaletteOpen(true)}
          className="text-xs text-ink-soft hover:text-ink">மாற்று</button>
        <button onClick={() => setActiveProfile(null)}
          className="text-xs text-ink-soft hover:text-rose">மூடு</button>
        </div>
      </div>
    </>
  );
}
