'use client';

import { useCallback, useEffect, useState } from 'react';
import { loadSyncState, addSyncDevice, revokeSyncDevice } from './actions';

/**
 * VJ-024 — devices, their scopes, and the local outbox.
 *
 * Revocation is the reason this page exists. A device can be granted access
 * from a dozen places, but there must be exactly one place to take it away,
 * and it has to be findable by someone who has just lost a phone.
 */

interface Device {
  deviceId: string;
  label: string;
  scopes: string[];
  createdAt: string;
  revokedAt: string | null;
  lastSyncAt: string | null;
}

interface Entry {
  opId: string;
  operation: string;
  resourceId: string;
  state: string;
  attempts: number;
  lastError: string | null;
  createdAt: string;
}

export default function SyncView() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [outbox, setOutbox] = useState<any>(null);
  const [pending, setPending] = useState<Entry[]>([]);
  const [scopes, setScopes] = useState<Record<string, string>>({});
  const [presets, setPresets] = useState<any>(null);
  const [label, setLabel] = useState('');
  const [chosen, setChosen] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const refresh = useCallback(() => {
    loadSyncState()
      .then((s: any) => {
        setDevices(s.devices); setOutbox(s.outbox); setPending(s.pending);
        setScopes(s.scopes); setPresets(s.presets);
        if (chosen.length === 0) setChosen(s.presets.readOnly);
      })
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(refresh, [refresh]);

  const add = async () => {
    setError(null); setStatus(null);
    try {
      const d = await addSyncDevice(label, chosen);
      setLabel(''); setStatus(`"${d.label}" சேர்க்கப்பட்டது`); refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  const revoke = async (d: Device) => {
    if (!confirm(`"${d.label}" சாதனத்தின் அணுகலை நிரந்தரமாக நீக்கவா?`)) return;
    try {
      await revokeSyncDevice(d.deviceId);
      setStatus(`"${d.label}" அணுகல் நீக்கப்பட்டது`); refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  const toggle = (s: string) =>
    setChosen(chosen.includes(s) ? chosen.filter((x) => x !== s) : [...chosen, s]);

  return (
    <main className="min-h-screen p-6 max-w-3xl mx-auto">
      <header className="mb-5">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">Sync</p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">
          சாதனங்களும் அனுப்பு வரிசையும்
        </h1>
        <p className="text-sm text-ink-soft mt-1">
          எந்தச் சாதனத்துக்கு என்ன அனுமதி உள்ளது, எது நீக்கப்பட்டுள்ளது, உள்ளூரில்
          எவை அனுப்பக் காத்திருக்கின்றன என்பது.
        </p>
      </header>

      {/* Saying what does not exist is part of the feature. */}
      <p className="text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-3 mb-4">
        <strong>இணைய சேவை இன்னும் இல்லை.</strong> இந்தப் பக்கம் அனுமதிகளையும்
        உள்ளூர் வரிசையையும் நிர்வகிக்கிறது; எதுவும் வெளியே அனுப்பப்படுவதில்லை.
        ADR-05 படி sync என்பது விருப்பத்தேர்வு — கணக்கு இல்லாமலும் software
        முழுமையாக வேலை செய்யும், வரிசை காலியாகவே இருந்தாலும் பிரச்சினை இல்லை.
      </p>

      {error && <p className="text-rose text-sm mb-4 bg-rose-soft rounded-xl p-3">⚠️ {error}</p>}
      {status && <p className="text-sm text-teal mb-4">{status}</p>}

      {outbox && (
        <dl className="grid grid-cols-3 gap-2 text-center mb-5">
          {([
            ['காத்திருப்பவை', outbox.pending, 'text-saffron'],
            ['அனுப்பப்பட்டவை', outbox.sent, 'text-teal'],
            ['தடுக்கப்பட்டவை', outbox.blocked, outbox.blocked ? 'text-rose' : 'text-ink-soft'],
          ] as const).map(([l, v, cls]) => (
            <div key={l} className="border border-line rounded-lg py-2">
              <dd className={`text-2xl font-bold ${cls}`}>{v}</dd>
              <dt className="text-[11px] text-ink-soft">{l}</dt>
            </div>
          ))}
        </dl>
      )}

      <section className="bg-surface border border-line rounded-2xl p-4 mb-5">
        <h2 className="text-sm font-semibold text-ink mb-2">புதிய சாதனம்</h2>
        <input value={label} onChange={(e) => setLabel(e.target.value)}
          placeholder="சாதனத்தின் பெயர் (எ.கா. அலுவலக laptop)"
          className="w-full mb-3 px-3 py-2 text-sm bg-surface border border-line rounded-lg text-ink" />

        <div className="flex gap-1 mb-2 text-xs">
          {presets && ([['படிக்க மட்டும்', presets.readOnly], ['முழு அனுமதி', presets.full]] as const).map(([l, p]) => (
            <button key={l} type="button" onClick={() => setChosen(p)}
              className="px-2 py-1 rounded border border-line text-ink-soft hover:text-ink">{l}</button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-1 mb-3">
          {Object.entries(scopes).map(([id, desc]) => (
            <label key={id} className="flex items-center gap-2 text-xs text-ink-soft cursor-pointer">
              <input type="checkbox" checked={chosen.includes(id)} onChange={() => toggle(id)} />
              <span className="text-ink">{desc}</span>
              <span className="font-mono text-[10px]">{id}</span>
            </label>
          ))}
        </div>

        <p className="text-[11px] text-ink-soft mb-3">
          படிக்கும் அனுமதி எழுதும் அனுமதியைத் தானாகத் தராது — ஒரு ஆலோசனையின்போது
          ஜாதகத்தைக் காட்டும் சாதனம் பிறப்பு விவரத்தைத் திருத்த வேண்டியதில்லை.
        </p>

        <button type="button" onClick={add} disabled={!label.trim() || chosen.length === 0}
          className="px-4 py-2 rounded-xl bg-saffron text-white text-sm font-semibold disabled:opacity-40">
          சேர்
        </button>
      </section>

      <section className="mb-5">
        <h2 className="text-sm font-semibold text-ink mb-2">சாதனங்கள் ({devices.length})</h2>
        {devices.length === 0 && <p className="text-sm text-ink-soft">சாதனம் எதுவும் இல்லை.</p>}
        <ul className="space-y-2">
          {devices.map((d) => (
            <li key={d.deviceId}
              className={`border rounded-xl p-3 text-sm ${d.revokedAt ? 'border-rose/40 bg-rose-soft/20' : 'border-line bg-surface'}`}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-ink font-medium">
                  {d.label}
                  {d.revokedAt && <span className="text-rose text-xs font-normal"> · அணுகல் நீக்கப்பட்டது</span>}
                </span>
                {!d.revokedAt && (
                  <button type="button" onClick={() => revoke(d)}
                    className="text-xs text-rose hover:underline shrink-0">அணுகலை நீக்கு</button>
                )}
              </div>
              <p className="text-[11px] text-ink-soft mt-1 font-mono">
                {d.scopes.length ? d.scopes.join(' · ') : 'அனுமதி எதுவும் இல்லை'}
              </p>
              <p className="text-[11px] text-ink-soft">
                சேர்க்கப்பட்டது {d.createdAt.slice(0, 10)}
                {d.lastSyncAt ? ` · கடைசி sync ${d.lastSyncAt.slice(0, 10)}` : ' · இதுவரை sync இல்லை'}
                {d.revokedAt ? ` · நீக்கப்பட்டது ${d.revokedAt.slice(0, 10)}` : ''}
              </p>
            </li>
          ))}
        </ul>
        {devices.some((d) => d.revokedAt) && (
          <p className="text-[11px] text-ink-soft mt-2">
            நீக்கப்பட்ட சாதனங்களும் பட்டியலில் இருக்கும் — அவற்றை அழித்தால்,
            அந்தச் சாதனத்துக்கு எப்போதாவது அணுகல் இருந்தது என்ற பதிவே
            இல்லாமல் போகும்.
          </p>
        )}
      </section>

      {pending.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-ink mb-2">அனுப்பக் காத்திருப்பவை</h2>
          <ul className="divide-y divide-line/40 text-xs">
            {pending.map((e) => (
              <li key={e.opId} className="py-1.5 flex items-baseline justify-between gap-3">
                <span className="text-ink font-mono">{e.operation}</span>
                <span className="text-ink-soft">
                  {e.resourceId}
                  {e.attempts > 0 && <span className="text-amber-700"> · {e.attempts} முயற்சி</span>}
                  {e.lastError && <span className="text-rose"> · {e.lastError.slice(0, 40)}</span>}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
