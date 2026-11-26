'use client';

import { useCallback, useEffect, useState } from 'react';
import { computeToday } from '../../app/todayActions';
import { useSettings } from '../ui/SettingsPanel';
import { OFFLINE_CALC_KEY, EPHE_FILES, offlineCalcEnabled, warmLocalEngine, localToday } from './localEngine';

/**
 * Settings page: calculation on the device when there is no connection (src/offline/localEngine.ts). Whether it is on, whether this
 * device already holds what it needs (the service worker's copy of the ephemeris files), a button to fetch it now, and a check that
 * calculates today's panchangam both on the server and here and compares the two.
 */
export function OfflineCalcCard() {
  const { settings, loaded } = useSettings();
  const [on, setOn] = useState(true);
  const [held, setHeld] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState('');

  const checkHeld = useCallback(async () => {
    try {
      if (!('caches' in window)) { setHeld(false); return; }
      const hits = await Promise.all(EPHE_FILES.map((f) => caches.match(`/ephe/${f}`)));
      setHeld(hits.every(Boolean));
    } catch {
      setHeld(false);
    }
  }, []);

  useEffect(() => {
    setOn(offlineCalcEnabled());
    checkHeld();
  }, [checkHeld]);

  const toggle = (value: boolean) => {
    try { localStorage.setItem(OFFLINE_CALC_KEY, value ? 'on' : 'off'); } catch { /* the default (on) stays */ }
    setOn(value);
  };

  const prepare = async () => {
    setBusy(true);
    setNote('');
    try {
      await warmLocalEngine();
      await Promise.all(['/', '/worksheet', '/dasha-timeline'].map((p) => fetch(p, { headers: { accept: 'text/html' } }).catch(() => undefined)));
      await checkHeld();
      setNote('தயார்: கணக்குக் குறியீடும் ephemeris கோப்புகளும் இந்தச் சாதனத்தில் உள்ளன.');
    } catch (e) {
      setNote(`தயார் செய்ய இயலவில்லை: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setBusy(false);
    }
  };

  const verify = async () => {
    setBusy(true);
    setNote('');
    try {
      const place = { latitude: settings.astrologerPlace.latitude, longitude: settings.astrologerPlace.longitude, timeZone: settings.astrologerPlace.timeZone, placeName: settings.astrologerPlace.name };
      const [server, device] = await Promise.all([computeToday(place), localToday(place)]);
      const same = JSON.stringify(server) === JSON.stringify(device);
      setNote(same
        ? `✓ சேவையகமும் இந்தச் சாதனமும் ஒரே பஞ்சாங்கம் தந்தன (${place.placeName}, ${server.date}: ${server.tithi.name}, ${server.nakshatra.name}, உதயம் ${server.sunrise}).`
        : '✗ சேவையகமும் சாதனமும் வேறுபட்டன: இதை உருவாக்குநருக்குத் தெரிவிக்கவும்.');
    } catch (e) {
      setNote(`சரிபார்க்க இயலவில்லை: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="rounded-2xl border border-line bg-surface p-5 shadow-sm space-y-2" aria-labelledby="offline-calc-heading" data-testid="offline-calc">
      <h2 id="offline-calc-heading" className="font-semibold text-ink">📴 இணையம் இல்லாமலும் கணக்கிடு · Calculate without a connection</h2>
      <p className="text-xs text-ink-soft">
        சேவையகத்தை அடைய முடியாதபோது முகப்பின் பஞ்சாங்கமும் &quot;இன்று உங்களுக்கு&quot; அட்டையும், ஜாதக மேசை, தசைப் பக்கங்களும் இந்தச் சாதனத்திலேயே
        கணக்கிடப்படும்: சேவையகத்தின் அதே கணக்குக் குறியீடு, அதே Swiss Ephemeris (WebAssembly வடிவில்), அதே தரவுக் கோப்புகள். சுமார் 2.5 MB ஒரு முறை பதிவிறக்கம்.
      </p>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={on} onChange={(e) => toggle(e.target.checked)} data-testid="offline-calc-toggle" />
        இயக்கத்தில்
      </label>
      {on && (
        <p className="text-xs">
          {held === null ? '…' : held
            ? <span className="text-teal font-semibold">● இந்தச் சாதனம் தயார்</span>
            : <span className="text-ink-soft">● இன்னும் பதிவிறக்கப்படவில்லை (நிறுவிய ஆப்பில் தானாகவே நடக்கும்)</span>}
        </p>
      )}
      {on && (
        <div className="flex flex-wrap gap-2">
          <button onClick={prepare} disabled={busy} className="rounded-lg border border-line px-3 py-1.5 text-xs hover:bg-saffron-soft disabled:opacity-50" data-testid="offline-calc-prepare">
            ⬇️ இப்போதே தயார் செய்
          </button>
          <button onClick={verify} disabled={busy || !loaded} className="rounded-lg border border-line px-3 py-1.5 text-xs hover:bg-saffron-soft disabled:opacity-50" data-testid="offline-calc-verify">
            ⚖️ சேவையகத்தோடு ஒப்பிட்டுச் சரிபார்
          </button>
        </div>
      )}
      {note && <p className="text-xs text-ink" role="status">{note}</p>}
    </section>
  );
}
