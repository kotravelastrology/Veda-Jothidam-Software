'use client';

import { useEffect, useState } from 'react';
import type { Party } from './PartyChooser';
import { useWorkspace } from '../workspace/workspaceContext';
import { resolveOpenParty } from './chartParty';

/**
 * "Use the open chart here": for a page that needs two people (the bride and the groom), where the open chart cannot be told
 * which of the two it is. One click puts the open chart in this place; nothing is chosen for the user.
 */
export function OpenChartChip({ onPick }: { onPick: (p: Party) => void }) {
  const { activeProfile, restored } = useWorkspace();
  const [open, setOpen] = useState<Party | null>(null);
  useEffect(() => { if (restored) setOpen(resolveOpenParty(activeProfile)); }, [restored, activeProfile]);
  if (!open) return null;
  return (
    <button
      type="button"
      onClick={() => onPick(open)}
      className="mb-2 rounded-full border border-saffron/60 bg-saffron/15 px-3 py-1 text-xs text-ink hover:bg-saffron/30"
    >
      திறந்துள்ள ஜாதகம்: <strong>{open.label}</strong> — இங்கே எடு
    </button>
  );
}
