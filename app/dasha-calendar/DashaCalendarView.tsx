'use client';

import { useEffect, useState } from 'react';
import { PartyChooser, type Party } from '@/src/ui/PartyChooser';
import { useSettings, toDashaOptions } from '@/src/ui/SettingsPanel';
import { computeDashaCalendar } from './actions';

/**
 * PL9's Calendar worksheet: a month laid out as a calendar, with the dasha combination (Mahadasha-Antardasha) written on
 * each day a new one begins. Abbreviations follow PL9 ("Su-Ra" = Sun mahadasha, Rahu antardasha). The dasha year and
 * balance method come from the settings, the same as the print centre's dashas.
 */

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const ABBR: Record<string, string> = { Sun: 'Su', Moon: 'Mo', Mars: 'Ma', Mercury: 'Me', Jupiter: 'Ju', Venus: 'Ve', Saturn: 'Sa', Rahu: 'Ra', Ketu: 'Ke' };

export default function DashaCalendarView() {
  const { settings } = useSettings();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [party, setParty] = useState<Party | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!party) { setResult(null); return; }
    let cancelled = false;
    setLoading(true); setError(null);
    const base = party.kind === 'profile' ? { profile: { profileId: party.profileId, revision: party.revision } } : { form: party.input };
    computeDashaCalendar({ ...base, year, month, dashaOptions: toDashaOptions(settings) })
      .then((r) => { if (!cancelled) setResult(r); })
      .catch((e) => { if (!cancelled) { setError(e instanceof Error ? e.message : String(e)); setResult(null); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [party, year, month, settings.dashaYearDays, settings.dashaBalance]);

  const step = (delta: number) => {
    const d = new Date(Date.UTC(year, month - 1 + delta, 1));
    setYear(d.getUTCFullYear());
    setMonth(d.getUTCMonth() + 1);
  };

  const cells: (number | null)[] = [];
  if (result) {
    for (let i = 0; i < result.firstWeekday; i += 1) cells.push(null);
    for (let d = 1; d <= result.daysInMonth; d += 1) cells.push(d);
  }
  const changesByDay = new Map<number, any[]>();
  for (const d of result?.days ?? []) changesByDay.set(d.day, d.changes);

  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto">
      <header className="mb-5">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">Calendar</p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">தசா நாட்காட்டி (Calendar)</h1>
        <p className="text-sm text-ink-soft mt-1 max-w-2xl">
          ஒவ்வொரு நாளிலும் புதிய மகாதசை–அந்தரதசை தொடங்கினால் அந்த நாளில் அது குறிக்கப்படும் (PL9 "Calendar" வடிவம்: "Su-Ra" = சூரிய மகாதசை, ராகு அந்தரதசை).
          தசை ஆண்டு, சமன் முறை ஆகியவை அமைப்புகளில் உள்ளபடி.
        </p>
      </header>

      <PartyChooser party={party} setParty={(x) => { setParty(x); if (!x) setResult(null); }} loading={loading} />

      <div className="flex items-center gap-3 mb-4">
        <button type="button" onClick={() => step(-1)} className="px-3 py-1 rounded border border-line text-sm">◀</button>
        <span className="font-semibold text-ink min-w-[10rem] text-center">{MONTHS[month - 1]} {year}</span>
        <button type="button" onClick={() => step(1)} className="px-3 py-1 rounded border border-line text-sm">▶</button>
      </div>

      {loading && <p className="text-sm text-ink-soft mb-4">கணக்கிடப்படுகிறது…</p>}
      {error && <p className="text-rose text-sm mb-4 bg-rose-soft rounded-xl p-3">⚠️ {error}</p>}

      {result && (
        <section className="bg-surface border border-line rounded-2xl p-3 text-xs">
          <p className="text-ink-soft mb-2">
            {result.native.name ?? '(பெயர் இல்லை)'} · தசை ஆண்டு {result.dashaYearDays} நாள் · சமன்: {result.balance === 'time' ? 'நேரம்' : 'பாகை'}
          </p>
          <div className="grid grid-cols-7 gap-1">
            {WEEKDAYS.map((w) => <div key={w} className="text-center font-semibold text-ink-soft py-1">{w}</div>)}
            {cells.map((d, i) => (
              <div key={i} className="min-h-[4.5rem] rounded border border-line/50 p-1">
                {d && (
                  <>
                    <div className="font-semibold text-ink">{d}</div>
                    {(changesByDay.get(d) ?? []).map((c: any) => (
                      <div key={c.startLocal} className="font-mono text-[11px] text-ink" title={`${c.mahadashaTa} – ${c.antardashaTa}`}>
                        {ABBR[c.mahadasha]}-{ABBR[c.antardasha]} <span className="text-ink-soft">{c.time}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
