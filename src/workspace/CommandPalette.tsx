'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWorkspace } from './workspaceContext';
import { searchCharts, listCharts, backupLibrary } from '../../app/library/actions';

interface Command {
  id: string;
  label: string;
  hint?: string;
  group: string;
  run: () => void | Promise<void>;
}

const PAGES: Array<[string, string]> = [
  ['/evidence', 'ஆதாரப் பலகைகள்'],
  ['/report', 'ஜாதக அறிக்கை'],
  ['/divisional-charts', 'வர்க கட்டங்கள்'],
  ['/yoga-detection', 'யோக பகுப்பாய்வு'],
  ['/house-analysis', 'பாவ பலம்'],
  ['/dasha-timeline', 'விம்சோத்தரி தசை'],
  ['/client-management', 'வாடிக்கையாளர் நிர்வாகம்'],
  ['/consultation-tools', 'ஆலோசனைக் குறிப்புகள்'],
  ['/muhurta', 'முகூர்த்தம்'],
  ['/porutham', 'பொருத்தம்'],
  ['/panchangam', 'பஞ்சாங்கம்'],
  ['/settings', 'அமைப்புகள்'],
];

/**
 * VJ-015 — command search.
 *
 * Ctrl/Cmd+K. Searches pages *and* saved charts, because "find the person I
 * am looking for" is the search a practitioner actually runs. Chart results
 * come from the library's FTS index via a Server Action, so the palette is
 * not limited to whatever the current page happens to have loaded.
 */
export function CommandPalette() {
  const router = useRouter();
  const { commandPaletteOpen, setCommandPaletteOpen, setActiveProfile } = useWorkspace();
  const [query, setQuery] = useState('');
  const [charts, setCharts] = useState<any[]>([]);
  const [selected, setSelected] = useState(0);
  const [status, setStatus] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Ctrl+K from anywhere, Escape to close.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      } else if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setCommandPaletteOpen]);

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
      setSelected(0);
      setStatus(null);
      listCharts(8).then(setCharts).catch(() => setCharts([]));
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [commandPaletteOpen]);

  // Chart search runs in SQLite, debounced.
  useEffect(() => {
    if (!commandPaletteOpen) return;
    const t = setTimeout(() => {
      (query.trim() ? searchCharts(query, 8) : listCharts(8))
        .then(setCharts).catch(() => setCharts([]));
    }, 200);
    return () => clearTimeout(t);
  }, [query, commandPaletteOpen]);

  const close = useCallback(() => setCommandPaletteOpen(false), [setCommandPaletteOpen]);

  const commands: Command[] = [
    ...charts.map((c) => ({
      id: `chart:${c.profileId}`,
      label: c.name,
      hint: [c.birthDate, c.placeName].filter(Boolean).join(' · ') || undefined,
      group: 'ஜாதகங்கள்',
      run: () => {
        setActiveProfile({
          profileId: c.profileId, revision: c.revision, name: c.name,
          birthDate: c.birthDate ?? null, placeName: c.placeName ?? null,
        });
        close();
      },
    })),
    ...PAGES.filter(([href, label]) => {
      const q = query.trim().toLowerCase();
      return !q || label.toLowerCase().includes(q) || href.includes(q);
    }).map(([href, label]) => ({
      id: `page:${href}`,
      label,
      hint: href,
      group: 'பக்கங்கள்',
      run: () => { router.push(href); close(); },
    })),
    {
      id: 'action:backup',
      label: 'நூலகத்தை Backup செய்',
      hint: 'VJ-012',
      group: 'செயல்கள்',
      run: async () => {
        setStatus('Backup எடுக்கிறது…');
        try {
          const result = await backupLibrary();
          setStatus(`${result.profiles} ஜாதகம் → ${result.archivePath}`);
        } catch (e) {
          setStatus(e instanceof Error ? e.message : String(e));
        }
      },
    },
  ].filter((c) => {
    const q = query.trim().toLowerCase();
    return !q || c.label.toLowerCase().includes(q) || (c.hint ?? '').toLowerCase().includes(q);
  });

  useEffect(() => { setSelected(0); }, [query, charts.length]);

  if (!commandPaletteOpen) return null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected((s) => Math.min(s + 1, commands.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); commands[selected]?.run(); }
  };

  let lastGroup = '';

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/40"
      onClick={close} role="presentation">
      <div className="w-full max-w-xl bg-surface border border-line rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Command search">
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="ஜாதகம், பக்கம் அல்லது செயலைத் தேடுங்கள்…"
          className="w-full px-4 py-3 bg-transparent border-b border-line text-ink outline-none"
        />
        <div className="max-h-80 overflow-y-auto">
          {commands.length === 0 && (
            <p className="px-4 py-6 text-sm text-ink-soft text-center">பொருத்தம் இல்லை.</p>
          )}
          {commands.map((c, i) => {
            const header = c.group !== lastGroup ? c.group : null;
            lastGroup = c.group;
            return (
              <div key={c.id}>
                {header && (
                  <p className="px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
                    {header}
                  </p>
                )}
                <button
                  onClick={() => c.run()}
                  onMouseEnter={() => setSelected(i)}
                  className={`w-full text-left px-4 py-2 flex justify-between items-center gap-3 ${
                    i === selected ? 'bg-saffron/15' : ''
                  }`}>
                  <span className="text-sm text-ink">{c.label}</span>
                  {c.hint && <span className="text-xs text-ink-soft truncate max-w-[45%]">{c.hint}</span>}
                </button>
              </div>
            );
          })}
        </div>
        {status && (
          <p className="px-4 py-2 border-t border-line text-xs text-ink-soft break-all">{status}</p>
        )}
        <div className="px-4 py-2 border-t border-line flex gap-4 text-[10px] text-ink-soft">
          <span>↑↓ நகர்</span><span>↵ தேர்ந்தெடு</span><span>Esc மூடு</span>
        </div>
      </div>
    </div>
  );
}
