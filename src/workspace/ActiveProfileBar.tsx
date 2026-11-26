'use client';

import { useWorkspace } from './workspaceContext';

/**
 * VJ-013 — a storage failure is shown, never swallowed. It sits under the toolbar because it affects whatever the user does next.
 *
 * Which chart is open is written once, in the toolbar's line under its icons (src/navigation/WorksheetToolbar.tsx), for a saved
 * profile and a chart entered by hand alike; this bar used to say it too and, for a hand-entered chart, said "nothing is open".
 */
export function ActiveProfileBar() {
  const { restored, storageFailure, dismissStorageFailure } = useWorkspace();
  if (!restored || !storageFailure) return null;
  return (
    <div className="px-4 py-2 border-b border-rose bg-rose/10 flex items-start gap-3">
      <span className="text-xs text-rose flex-1">{storageFailure.message}</span>
      <button onClick={dismissStorageFailure} className="text-xs text-rose/70 hover:text-rose">
        மூடு
      </button>
    </div>
  );
}
