'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { resolvePlace, type Place } from '@/src/sources/places/location';
import { resolveTimeZone } from '@/src/sources/places/timezone';

/** A place chosen from the atlas: its name, coordinates and IANA time zone. */
export interface PickedPlace {
  name: string;
  latitude: number;
  longitude: number;
  timeZone: string;
  /** "Tamil Nadu, India" — shown under the name. */
  region: string;
}

export function pickedFrom(p: Place): PickedPlace {
  return {
    name: p.name,
    latitude: p.lat,
    longitude: p.lng,
    timeZone: resolveTimeZone(p.lat, p.lng).zoneId,
    region: [p.admin, p.country].filter(Boolean).join(', '),
  };
}

/**
 * A place box with the atlas's suggestions (src/sources/places/location.ts, from the AstrologicLab software): English, Tamil and old
 * names ("சென்னை", "Madras", "Trichy") all find the place, and a partial name only offers places, it never picks one by itself.
 * Typing a name that is not in the atlas keeps the text; the coordinates are then entered by hand.
 */
export function PlaceSearchInput({ value, onText, onPick, placeholder, className, inputName }: {
  value: string;
  onText: (text: string) => void;
  onPick: (place: PickedPlace) => void;
  placeholder?: string;
  className?: string;
  inputName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const box = useRef<HTMLDivElement>(null);

  const candidates = useMemo(() => (value.trim().length >= 2 ? resolvePlace(value, { limit: 8 }).candidates : []), [value]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => { if (box.current && !box.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const choose = (p: Place) => { onPick(pickedFrom(p)); setOpen(false); };

  return (
    <div ref={box} className="relative">
      <input
        type="text"
        name={inputName}
        value={value}
        autoComplete="off"
        role="combobox"
        aria-expanded={open && candidates.length > 0}
        aria-autocomplete="list"
        placeholder={placeholder ?? 'ஊர் பெயர் — Chennai, சென்னை, Madurai…'}
        onChange={(e) => { onText(e.target.value); setOpen(true); setActive(0); }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (!open || candidates.length === 0) return;
          if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => (a + 1) % candidates.length); }
          if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => (a - 1 + candidates.length) % candidates.length); }
          if (e.key === 'Enter') { e.preventDefault(); choose(candidates[active]); }
          if (e.key === 'Escape') setOpen(false);
        }}
        className={className}
      />
      {open && candidates.length > 0 && (
        <ul role="listbox" className="absolute left-0 right-0 top-full z-30 mt-1 max-h-72 overflow-y-auto rounded-xl border border-line bg-surface py-1 shadow-lg">
          {candidates.map((p, i) => {
            const ta = p.aliases.find((a) => /[஀-௿]/.test(a));
            return (
              <li key={`${p.name}|${p.admin}|${p.country}`} role="option" aria-selected={i === active}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => choose(p)}
                  onMouseEnter={() => setActive(i)}
                  className={`flex w-full items-baseline justify-between gap-3 px-3 py-2 text-left text-sm ${i === active ? 'bg-saffron/15' : ''}`}
                >
                  <span className="text-ink">📍 {p.name}{ta && <span className="ml-1.5 text-ink-soft">{ta}</span>}</span>
                  <span className="shrink-0 text-[11px] text-ink-soft">{[p.admin, p.country].filter(Boolean).join(', ')}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
