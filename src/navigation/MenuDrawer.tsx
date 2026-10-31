'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * The menu drawer: the ☰ button opens it and every menu of the program is in it, top to bottom, one group each. A search
 * box at the top filters all the entries of all the menus at once. Entries whose page is not built yet are dimmed and say
 * so. It replaces the row of drop-down menus: eleven menus with up to forty entries each do not fit a drop-down, and the
 * drawer works the same on a phone and on a wide screen.
 */

export interface DrawerItem {
  key: string;
  label?: string;
  divider?: boolean;
  status?: string;
  target?: { route?: string; action?: string; pending?: string; items?: DrawerItem[] };
}

export interface DrawerMenu {
  key: string;
  label: string;
  submenu?: DrawerItem[];
}

/** Icon and Tamil name of each menu. */
const MENU_META: Record<string, { icon: string; ta: string }> = {
  file: { icon: '📁', ta: 'கோப்பு' },
  edit: { icon: '✏️', ta: 'திருத்து' },
  charts: { icon: '📊', ta: 'கட்டங்கள்' },
  printMenu: { icon: '🖨️', ta: 'அச்சு' },
  reports: { icon: '📖', ta: 'அறிக்கைகள்' },
  references: { icon: '📚', ta: 'சாஸ்திர நூல்கள்' },
  options: { icon: '⚙️', ta: 'விருப்பங்கள்' },
  tools: { icon: '🛠️', ta: 'கருவிகள்' },
  research: { icon: '🔬', ta: 'ஆராய்ச்சி' },
  windows: { icon: '🪟', ta: 'சாளரங்கள்' },
  help: { icon: '❓', ta: 'உதவி' },
};

const entries = (items: DrawerItem[] = []) => items.filter((i) => !i.divider);

/** Every entry of a menu, the entries inside a submenu included. */
function flatten(items: DrawerItem[] = []): DrawerItem[] {
  return entries(items).flatMap((i) => (i.target?.items ? [i, ...flatten(i.target.items)] : [i]));
}

export function MenuDrawer({ menus, open, onClose, onSelect }: {
  menus: DrawerMenu[];
  open: boolean;
  onClose: () => void;
  /** Called with the entry's key; the menu bar runs it, and closes the drawer. */
  onSelect: (key: string) => void;
}) {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [openSub, setOpenSub] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    const t = setTimeout(() => searchRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { clearTimeout(t); window.removeEventListener('keydown', onKey); };
  }, [open, onClose]);

  const needle = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!needle) return [];
    return menus.flatMap((m) =>
      flatten(m.submenu)
        .filter((i) => (i.label ?? '').toLowerCase().includes(needle) && !i.target?.items)
        .map((i) => ({ menu: m, item: i })),
    );
  }, [menus, needle]);

  const row = 'w-full text-left px-3 py-2 text-sm rounded-lg transition-colors hover:bg-saffron/15 focus-visible:bg-saffron/15 focus:outline-none';
  const itemButton = (item: DrawerItem, extra = '') => {
    const pending = Boolean(item.target?.pending);
    return (
      <button
        key={item.key}
        type="button"
        onClick={() => onSelect(item.key)}
        title={item.target?.pending}
        className={`${row} ${extra} flex items-center justify-between gap-2 ${pending ? 'text-ink-soft italic' : 'text-ink'}`}
      >
        <span>{item.label}</span>
        {pending && <span className="shrink-0 rounded-full border border-line px-1.5 text-[9px] not-italic text-ink-soft">விரைவில்</span>}
      </button>
    );
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-[1px] transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden
      />
      <aside
        className={`fixed left-0 top-0 bottom-0 z-[70] w-[22rem] max-w-[90vw] bg-surface border-r border-line shadow-2xl flex flex-col transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-full'}`}
        role="dialog"
        aria-label="மெனு"
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between px-4 h-12 bg-ink text-surface shrink-0">
          <span className="font-[family-name:var(--font-tamil-serif)] font-bold text-saffron">Kotravel · மெனு</span>
          <button type="button" onClick={onClose} className="px-2 py-1 rounded hover:bg-surface/10" aria-label="மெனுவை மூடு">✕</button>
        </div>

        <div className="p-3 border-b border-line shrink-0">
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && results[0]) onSelect(results[0].item.key); }}
            placeholder="எல்லா மெனுக்களிலும் தேடு…"
            aria-label="மெனுக்களில் தேடு"
            className="w-full px-3 py-2 text-sm rounded-xl bg-surface-2 border border-line text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-saffron"
          />
        </div>

        <nav className="flex-1 overflow-y-auto p-2" aria-label="முதன்மை மெனு">
          {needle ? (
            results.length === 0 ? (
              <p className="px-3 py-6 text-sm text-ink-soft text-center">பொருத்தம் இல்லை.</p>
            ) : (
              <ul>
                {results.map(({ menu, item }) => (
                  <li key={`${menu.key}-${item.key}`}>
                    {itemButton(item)}
                    <p className="px-3 -mt-1 pb-1 text-[10px] text-ink-soft">{MENU_META[menu.key]?.icon} {menu.label}</p>
                  </li>
                ))}
              </ul>
            )
          ) : (
            <ul className="space-y-1">
              {menus.map((m) => {
                const meta = MENU_META[m.key];
                const count = flatten(m.submenu).filter((i) => !i.target?.items).length;
                const isOpen = openGroup === m.key;
                return (
                  <li key={m.key} className={`rounded-xl ${isOpen ? 'bg-surface-2/60' : ''}`}>
                    <button
                      type="button"
                      onClick={() => { setOpenGroup(isOpen ? null : m.key); setOpenSub(null); }}
                      aria-expanded={isOpen}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-saffron/10 text-left"
                    >
                      <span className="text-lg w-6 text-center" aria-hidden>{meta?.icon ?? '•'}</span>
                      <span className="flex-1">
                        <span className="block text-sm font-semibold text-ink leading-tight">{m.label}</span>
                        {meta && <span className="block text-[11px] text-ink-soft leading-tight">{meta.ta}</span>}
                      </span>
                      <span className="text-[10px] text-ink-soft tabular-nums">{count}</span>
                      <span className={`text-ink-soft transition-transform ${isOpen ? 'rotate-90' : ''}`} aria-hidden>›</span>
                    </button>
                    {isOpen && (
                      <div className="pb-2 pl-3 pr-1">
                        {(m.submenu ?? []).map((item) => {
                          if (item.divider) return <div key={item.key} className="h-px bg-line my-1 mx-2" />;
                          if (item.target?.items) {
                            const subOpen = openSub === item.key;
                            return (
                              <div key={item.key}>
                                <button
                                  type="button"
                                  onClick={() => setOpenSub(subOpen ? null : item.key)}
                                  aria-expanded={subOpen}
                                  className={`${row} flex items-center justify-between text-ink`}
                                >
                                  <span>{item.label}</span>
                                  <span className={`text-ink-soft transition-transform ${subOpen ? 'rotate-90' : ''}`} aria-hidden>›</span>
                                </button>
                                {subOpen && item.target.items.map((sub) => itemButton(sub, 'pl-8'))}
                              </div>
                            );
                          }
                          return itemButton(item);
                        })}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </nav>
      </aside>
    </>
  );
}
