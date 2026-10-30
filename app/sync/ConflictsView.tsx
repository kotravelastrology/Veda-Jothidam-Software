'use client';

import { useCallback, useEffect, useState } from 'react';
import { loadConflicts, applyConflictResolution } from './conflictActions';

/**
 * VJ-025 — the review screen.
 *
 * Two rules shape it. There is no default and no "resolve all": every
 * conflict is decided one at a time by a person, because the alternative is a
 * button that silently picks a winner. And the birth fields are shown first
 * and marked, because a minute's difference moves house cusps and can change
 * the lagna outright — listing it as one row among a dozen buries the only
 * thing that matters.
 */

interface Field {
  key: string;
  local: unknown;
  remote: unknown;
  changed: boolean;
  kind: 'birth' | 'setting' | 'other';
  onlyOn: 'local' | 'remote' | null;
}

interface Conflict {
  conflictId: string;
  resourceId: string;
  operation: string;
  remoteVersion: number | null;
  detectedAt: string;
  localPayload: Record<string, unknown>;
  remotePayload: Record<string, unknown> | null;
  mergeable: boolean;
  diff: { fields: Field[]; changed: Field[]; changedBirthFields: Field[]; affectsChart: boolean };
  choices: { id: string; label: string }[];
}

const show = (v: unknown) =>
  v === undefined ? '—' : typeof v === 'object' ? JSON.stringify(v) : String(v);

const KIND_TA: Record<Field['kind'], string> = {
  birth: 'பிறப்பு விவரம்',
  setting: 'கணிப்பு அமைப்பு',
  other: 'மற்றவை',
};

function ConflictCard({ c, onResolve, busy }: {
  c: Conflict; onResolve: (id: string, r: string) => void; busy: boolean;
}) {
  const [showAll, setShowAll] = useState(false);
  const rows = showAll ? c.diff.fields : c.diff.changed;

  return (
    <li className="border border-rose/40 bg-rose-soft/10 rounded-2xl p-4">
      <div className="flex items-baseline justify-between gap-3 mb-1">
        <span className="text-ink font-medium">{c.resourceId}</span>
        <span className="text-[11px] text-ink-soft font-mono shrink-0">
          {c.operation} · மற்ற பதிப்பு v{c.remoteVersion}
        </span>
      </div>

      {c.diff.changedBirthFields.length > 0 && (
        <p className="text-xs text-rose mb-2">
          ⚠ <strong>பிறப்பு விவரத்தில் வேறுபாடு.</strong> ஒரு நிமிட வேறுபாடு கூட
          பாவ எல்லைகளை நகர்த்தும், லக்னத்தையே மாற்றக்கூடும் — ஏற்கெனவே இந்த
          ஜாதகத்திலிருந்து சொன்ன பலன்கள் பொருந்தாமல் போகும்.
        </p>
      )}

      <table className="w-full text-xs mb-3">
        <thead>
          <tr className="text-ink-soft border-b border-line">
            <th className="text-left py-1">புலம்</th>
            <th className="text-left py-1">இந்தச் சாதனம்</th>
            <th className="text-left py-1">மற்ற சாதனம்</th>
          </tr>
        </thead>
        <tbody>
          {[...rows].sort((a, b) => (a.kind === 'birth' ? -1 : 1) - (b.kind === 'birth' ? -1 : 1))
            .map((f) => (
              <tr key={f.key} className={`border-b border-line/40 ${f.changed ? '' : 'opacity-50'}`}>
                <td className="py-1">
                  {f.key}
                  {f.kind !== 'other' && (
                    <span className={`ml-1 text-[10px] px-1 rounded ${
                      f.kind === 'birth' ? 'bg-rose-soft text-rose' : 'bg-amber-100 text-amber-800'}`}>
                      {KIND_TA[f.kind]}
                    </span>
                  )}
                </td>
                <td className={`py-1 ${f.changed ? 'text-ink font-medium' : 'text-ink-soft'}`}>
                  {show(f.local)}{f.onlyOn === 'local' && <span className="text-ink-soft"> (இங்கே மட்டும்)</span>}
                </td>
                <td className={`py-1 ${f.changed ? 'text-ink font-medium' : 'text-ink-soft'}`}>
                  {show(f.remote)}{f.onlyOn === 'remote' && <span className="text-ink-soft"> (அங்கே மட்டும்)</span>}
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <button type="button" onClick={() => setShowAll((v) => !v)}
        className="text-[11px] text-ink-soft underline mb-3">
        {showAll ? 'மாறியவற்றை மட்டும் காட்டு' : `அனைத்துப் புலங்களையும் காட்டு (${c.diff.fields.length})`}
      </button>

      {!c.mergeable && (
        <p className="text-[11px] text-ink-soft mb-2">
          இரு வெவ்வேறு பிறப்பு நேரங்கள் என்பவை ஒரே ஜாதகத்தின் இரு பாதிகள் அல்ல —
          அவை இரு வெவ்வேறு ஜாதகங்கள். எனவே தானாக இணைக்கும் வழி இங்கே இல்லை.
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {c.choices.map((ch) => (
          <button key={ch.id} type="button" disabled={busy}
            onClick={() => onResolve(c.conflictId, ch.id)}
            className="px-3 py-1.5 text-xs rounded-lg border border-line bg-surface text-ink hover:border-saffron disabled:opacity-40">
            {ch.label}
          </button>
        ))}
      </div>

      <p className="text-[11px] text-ink-soft mt-2">
        எந்தத் தேர்வு செய்தாலும் <strong>மற்றப் பக்கம் அழிக்கப்படுவதில்லை</strong> —
        இரண்டும் பதிவில் இருக்கும், பின்னர் படிக்கலாம்.
      </p>
    </li>
  );
}

export default function ConflictsView() {
  const [open, setOpen] = useState<Conflict[]>([]);
  const [resolved, setResolved] = useState<any[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    loadConflicts()
      .then((d: any) => { setOpen(d.open); setResolved(d.resolved); })
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));
  }, []);
  useEffect(refresh, [refresh]);

  const resolve = async (id: string, resolution: string) => {
    setBusy(true); setError(null);
    try {
      await applyConflictResolution(id, resolution);
      refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen p-6 max-w-3xl mx-auto">
      <header className="mb-5">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">Conflicts</p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">
          முரண்பாடுகள்
        </h1>
        <p className="text-sm text-ink-soft mt-1">
          இரு சாதனங்கள் ஒரே ஜாதகத்தை வெவ்வேறு விதமாகத் திருத்தியிருந்தால், எது
          நிற்க வேண்டும் என்பதை நீங்கள் முடிவு செய்ய வேண்டும். தானாக எதுவும்
          தேர்ந்தெடுக்கப்படுவதில்லை.
        </p>
      </header>

      {error && <p className="text-rose text-sm mb-4 bg-rose-soft rounded-xl p-3">⚠️ {error}</p>}

      {open.length === 0 ? (
        <p className="text-sm text-ink-soft mb-6">முரண்பாடு எதுவும் இல்லை.</p>
      ) : (
        <ul className="space-y-4 mb-6">
          {open.map((c) => <ConflictCard key={c.conflictId} c={c} onResolve={resolve} busy={busy} />)}
        </ul>
      )}

      {resolved.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-ink mb-2">முடிவு செய்யப்பட்டவை</h2>
          <ul className="divide-y divide-line/40 text-xs">
            {resolved.map((c) => (
              <li key={c.conflictId} className="py-1.5 flex items-baseline justify-between gap-3">
                <span className="text-ink">{c.resourceId}</span>
                <span className="text-ink-soft font-mono">
                  {c.resolution} · {c.resolvedAt?.slice(0, 10)}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-ink-soft mt-2">
            இவற்றின் இரு பக்கமும் இன்னும் பதிவில் உள்ளன — கைவிடப்பட்ட திருத்தத்தையும்
            பின்னர் படிக்க முடியும்.
          </p>
        </section>
      )}
    </main>
  );
}
