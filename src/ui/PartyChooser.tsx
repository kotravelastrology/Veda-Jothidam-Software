'use client';

import { useEffect, useRef, useState } from 'react';
import { BirthDataForm, type BirthData } from '@/src/ui/BirthDataForm';
import { listCharts, searchCharts } from '@/app/library/actions';
import type { BirthFormInput } from '@/app/report/actions';
import { useWorkspace } from '../workspace/workspaceContext';
import { resolveOpenParty, useRememberParty } from './chartParty';

/**
 * "யாருக்கு?" — pick a saved profile or type birth details. The same block the
 * Saturn, Mangala, gemstone and vedha pages each carry their own copy of;
 * new pages use this one.
 */

interface LibraryRow {
  profileId: string; revision: number; name: string; birthDate: string; placeName: string | null;
}
export type Party =
  | { kind: 'profile'; profileId: string; revision: number; label: string; name?: string; birthDate?: string | null; placeName?: string | null }
  | { kind: 'form'; input: BirthFormInput; label: string };

export function toBirthInput(bd: BirthData): BirthFormInput {
  return {
    name: bd.name, gender: bd.gender,
    year: parseInt(bd.dateOfBirth.split('-')[0]),
    month: parseInt(bd.dateOfBirth.split('-')[1]),
    day: parseInt(bd.dateOfBirth.split('-')[2]),
    hour: parseInt(bd.timeOfBirth.split(':')[0]),
    minute: parseInt(bd.timeOfBirth.split(':')[1]),
    placeName: bd.place, latitude: bd.latitude, longitude: bd.longitude,
    utcOffsetMinutes: bd.utcOffset, ianaTimeZone: bd.timeZone ?? 'Asia/Kolkata',
  };
}

/**
 * `auto` (default): when no person is chosen yet, the chart that is open (File > New, File > Open, a chart chosen on another page)
 * is chosen here by itself, so the page does not ask for the name, place, date and time again. `remember` (default): a person
 * chosen here becomes the open chart. A second person on a page (a partner, the bride) passes both as false. `?new=1` in the
 * address (File > New) leaves the chooser blank, on the birth-details form.
 */
export function PartyChooser({ party, setParty, loading, startManual = false, auto = true, remember = true }: {
  party: Party | null; setParty: (p: Party | null) => void; loading: boolean; startManual?: boolean; auto?: boolean; remember?: boolean;
}) {
  const [rows, setRows] = useState<LibraryRow[]>([]);
  const [query, setQuery] = useState('');
  const [manual, setManual] = useState(startManual);
  const { activeProfile, restored } = useWorkspace();
  const rememberParty = useRememberParty();
  const triedOpen = useRef(false);

  useEffect(() => {
    if (!auto || party || startManual || !restored || triedOpen.current) return;
    triedOpen.current = true;
    if (new URLSearchParams(window.location.search).get('new') === '1') return;
    const open = resolveOpenParty(activeProfile);
    if (open) setParty(open);
  }, [auto, party, startManual, restored, activeProfile, setParty]);

  const choose = (p: Party) => {
    if (remember) rememberParty(p);
    setParty(p);
  };

  useEffect(() => {
    (query.trim() ? searchCharts(query.trim(), 25) : listCharts(50))
      .then((r: any) => setRows(r)).catch(() => setRows([]));
  }, [query]);

  return (
    <section className="bg-surface border border-line rounded-2xl p-4 mb-4">
      <div className="flex items-baseline justify-between mb-2">
        <h2 className="text-sm font-semibold text-ink">யாருக்கு?</h2>
        {party && <button type="button" onClick={() => setParty(null)} className="text-xs text-ink-soft hover:text-rose">மாற்று</button>}
      </div>
      {party ? <p className="text-sm text-teal">✓ {party.label}</p> : manual ? (
        <>
          <BirthDataForm isLoading={loading}
            onSubmit={(bd) => choose({ kind: 'form', input: toBirthInput(bd), label: bd.name || 'படிவ விவரம்' })} />
          <button type="button" onClick={() => setManual(false)} className="text-xs text-ink-soft mt-2 underline">சேமித்த சுயவிவரங்களிலிருந்து தேர்ந்தெடு</button>
        </>
      ) : (
        <>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="சேமித்த சுயவிவரங்களில் தேடு (பெயர் / இடம்)"
            className="w-full mb-2 px-3 py-2 text-sm bg-surface-2 border border-line rounded-xl text-ink" />
          <ul className="max-h-44 overflow-y-auto divide-y divide-line/40 mb-2">
            {rows.length === 0 && <li className="text-xs text-ink-soft py-2">சேமித்த சுயவிவரம் இல்லை.</li>}
            {rows.map((r) => (
              <li key={r.profileId}>
                <button type="button" className="w-full text-left py-1.5 text-sm text-ink hover:text-saffron"
                  onClick={() => choose({ kind: 'profile', profileId: r.profileId, revision: r.revision, label: `${r.name} · ${r.birthDate}${r.placeName ? ` · ${r.placeName}` : ''}`, name: r.name, birthDate: r.birthDate, placeName: r.placeName })}>
                  {r.name}<span className="text-xs text-ink-soft block">{r.birthDate}{r.placeName ? ` · ${r.placeName}` : ''}</span>
                </button>
              </li>
            ))}
          </ul>
          <button type="button" onClick={() => setManual(true)} className="text-xs text-ink-soft underline">அல்லது பிறப்பு விவரத்தை நேரடியாக உள்ளிடு</button>
        </>
      )}
    </section>
  );
}
