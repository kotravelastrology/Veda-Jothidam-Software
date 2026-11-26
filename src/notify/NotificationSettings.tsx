'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  pushPublicKey, pushStatus, savePush, removePush, testPush, followDasha, unfollowDasha,
  type NotifyPrefs, type PendingNotice,
} from '../../app/notifyActions';
import { useSettings, toDashaOptions } from '../ui/SettingsPanel';
import { useActiveBirthInput } from '../workspace/useActiveBirthInput';
import { useOpenChart } from '../ui/useScreenPrefs';
import { usePwa } from '../pwa/pwaStore';

/**
 * Settings page: notifications on this device (app/notifyActions.ts; the server sends them, src/notify/scheduler.js). The morning
 * panchangam at a chosen time for the astrologer's place, and the starts of the open chart's dasha periods. Only in the installed or
 * production app (the service worker shows them), only after the browser's own permission, and off again with one button.
 */

type Support = 'checking' | 'unsupported' | 'ios-install' | 'dev' | 'denied' | 'ready';

function keyBytes(base64url: string): Uint8Array<ArrayBuffer> {
  const padded = (base64url + '='.repeat((4 - (base64url.length % 4)) % 4)).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(padded);
  const out = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i += 1) out[i] = raw.charCodeAt(i);
  return out;
}

function sameKey(a: ArrayBuffer | null | undefined, b: Uint8Array): boolean {
  if (!a) return false;
  const x = new Uint8Array(a);
  return x.length === b.length && x.every((v, i) => v === b[i]);
}

const dateTimeTa = (ms: number) => new Date(ms).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export function NotificationSettings() {
  const { settings, loaded } = useSettings();
  const { iosHint } = usePwa();
  const { input } = useActiveBirthInput();
  const chart = useOpenChart();
  const [support, setSupport] = useState<Support>('checking');
  const [sub, setSub] = useState<PushSubscription | null>(null);
  const [prefs, setPrefs] = useState<NotifyPrefs | null>(null);
  const [pending, setPending] = useState<PendingNotice[]>([]);
  const [dailyTime, setDailyTime] = useState('06:00');
  const [levels, setLevels] = useState(2);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState('');

  const place = settings.astrologerPlace;
  const placePrefs = { latitude: place.latitude, longitude: place.longitude, timeZone: place.timeZone, placeName: place.name };
  const deviceZone = typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'Asia/Kolkata';

  const refresh = useCallback(async (s: PushSubscription | null) => {
    setSub(s);
    if (!s) { setPrefs(null); setPending([]); return; }
    const st = await pushStatus(s.endpoint);
    if (st.subscribed) {
      setPrefs(st.prefs);
      setPending(st.pending);
      if (st.prefs.daily.on && st.prefs.daily.time) setDailyTime(st.prefs.daily.time);
      if (st.prefs.dasha.on && st.prefs.dasha.levels) setLevels(st.prefs.dasha.levels);
    } else {
      setPrefs(null);
      setPending([]);
    }
  }, []);

  useEffect(() => {
    const has = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
    if (!has) { setSupport(iosHint ? 'ios-install' : 'unsupported'); return; }
    if (process.env.NODE_ENV !== 'production') { setSupport('dev'); return; }
    if (Notification.permission === 'denied') { setSupport('denied'); return; }
    setSupport('ready');
    let live = true;
    navigator.serviceWorker.ready
      .then((reg) => reg.pushManager.getSubscription())
      .then((s) => { if (live) return refresh(s); })
      .catch(() => { /* the card still offers to switch on */ });
    return () => { live = false; };
  }, [iosHint, refresh]);

  const run = async (label: string, fn: () => Promise<string | void>) => {
    setBusy(true);
    setNote('');
    try {
      const msg = await fn();
      setNote(msg || '');
    } catch (e) {
      setNote(`${label}: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setBusy(false);
    }
  };

  const prefsWith = (patch: Partial<NotifyPrefs>): NotifyPrefs => ({
    timeZone: deviceZone,
    daily: prefs?.daily ?? { on: false },
    dasha: prefs?.dasha ?? { on: false },
    ...patch,
  });

  const switchOn = () => run('இயக்க இயலவில்லை', async () => {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      if (permission === 'denied') setSupport('denied');
      return 'அனுமதி கொடுக்கப்படவில்லை; அறிவிப்புகள் இயக்கப்படவில்லை.';
    }
    const key = keyBytes(await pushPublicKey());
    const reg = await navigator.serviceWorker.ready;
    let s = await reg.pushManager.getSubscription();
    if (s && !sameKey(s.options.applicationServerKey, key)) {
      await s.unsubscribe(); // made for another server key: subscribe again for this server
      s = null;
    }
    s ??= await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: key });
    const r = await savePush(s.toJSON(), prefsWith({ daily: { on: true, time: dailyTime, place: placePrefs } }));
    if (!r.ok) return r.error;
    await refresh(s);
    return 'இயக்கப்பட்டது. "சோதனை அறிவிப்பு" அழுத்திப் பார்க்கலாம்.';
  });

  const saveDaily = (on: boolean, time = dailyTime) => run('சேமிக்க இயலவில்லை', async () => {
    if (!sub) return;
    const r = await savePush(sub.toJSON(), prefsWith({ daily: on ? { on: true, time, place: placePrefs } : { on: false } }));
    if (!r.ok) return r.error;
    await refresh(sub);
    return on ? `காலைப் பஞ்சாங்கம்: தினமும் ${time}, ${place.name}.` : 'காலைப் பஞ்சாங்கம் நிறுத்தப்பட்டது.';
  });

  const follow = () => run('பின்தொடர இயலவில்லை', async () => {
    if (!sub || !input || !chart) return 'முதலில் ஒரு ஜாதகத்தைத் திறக்கவும்.';
    const r = await followDasha(sub.endpoint, input, chart.name, levels, toDashaOptions(settings));
    if (!r.ok) return r.error;
    await refresh(sub);
    return r.count ? `${chart.name}: அடுத்த ${r.count} மாற்றங்கள் அமைந்தன.` : 'அடுத்த இரண்டு ஆண்டுகளில் மாற்றம் இல்லை.';
  });

  const unfollow = () => run('நிறுத்த இயலவில்லை', async () => {
    if (!sub) return;
    await unfollowDasha(sub.endpoint);
    await refresh(sub);
    return 'தசை அறிவிப்புகள் நிறுத்தப்பட்டன.';
  });

  const test = () => run('அனுப்ப இயலவில்லை', async () => {
    if (!sub) return;
    const r = await testPush(sub.endpoint);
    return r.ok ? 'சோதனை அறிவிப்பு அனுப்பப்பட்டது; சில நொடிகளில் வர வேண்டும்.' : (r.error ?? 'அனுப்ப இயலவில்லை.');
  });

  const switchOff = () => run('நிறுத்த இயலவில்லை', async () => {
    if (!sub) return;
    await removePush(sub.endpoint);
    await sub.unsubscribe().catch(() => false);
    await refresh(null);
    return 'இந்தச் சாதனத்தில் அறிவிப்புகள் நிறுத்தப்பட்டன.';
  });

  // The place of the morning message follows Settings > astrologer's location
  const placeChanged = Boolean(prefs?.daily.on && prefs.daily.place && (prefs.daily.place.placeName !== place.name || prefs.daily.place.latitude !== place.latitude));

  return (
    <section className="rounded-2xl border border-line bg-surface p-5 shadow-sm space-y-3" aria-labelledby="notify-heading" data-testid="notify-settings">
      <h2 id="notify-heading" className="font-semibold text-ink">🔔 அறிவிப்புகள் · Notifications</h2>

      {support === 'checking' && <div className="skeleton h-4 w-2/3" />}
      {support === 'unsupported' && <p className="text-sm text-ink-soft">இந்த உலாவியில் அறிவிப்பு வசதி இல்லை.</p>}
      {support === 'ios-install' && (
        <p className="text-sm text-ink-soft">iPhone/iPad-இல் அறிவிப்புகள் ஆப்பாக நிறுவிய பின்தான் வரும்: Share ⬆️ → &quot;Add to Home Screen&quot;, பிறகு அந்த ஐகானிலிருந்து திறந்து இங்கே இயக்கவும்.</p>
      )}
      {support === 'dev' && (
        <p className="text-sm text-ink-soft">அறிவிப்புகள் production பதிப்பில் மட்டும் (npm run build, npm start): development பதிப்பில் service worker பதிவாவதில்லை.</p>
      )}
      {support === 'denied' && (
        <p className="text-sm text-ink-soft">இந்தத் தளத்துக்கு அறிவிப்பு அனுமதி உலாவியில் மறுக்கப்பட்டுள்ளது. முகவரிப் பட்டியின் 🔒 → Notifications → Allow என மாற்றி, பக்கத்தை மீண்டும் திறக்கவும்.</p>
      )}

      {support === 'ready' && !prefs && (
        <div className="space-y-2">
          <p className="text-sm text-ink-soft">
            தினமும் காலைப் பஞ்சாங்கமும் (திதி, நட்சத்திரம், ராகு காலம்), நீங்கள் பின்தொடரும் ஜாதகத்தின் தசை மாற்றங்களும் இந்தச் சாதனத்துக்கு வரும். உலாவி அனுமதி கேட்கும்.
          </p>
          <label className="flex items-center gap-2 text-sm">
            காலை நேரம்
            <input type="time" value={dailyTime} onChange={(e) => setDailyTime(e.target.value || '06:00')} className="rounded-lg border border-line bg-surface px-2 py-1" />
            <span className="text-ink-soft">· {loaded ? place.name : '…'}</span>
          </label>
          <button onClick={switchOn} disabled={busy || !loaded} className="rounded-lg bg-saffron text-ink px-3 py-1.5 text-sm font-semibold hover:brightness-105 disabled:opacity-50" data-testid="notify-on">
            🔔 அறிவிப்புகளை இயக்கு
          </button>
        </div>
      )}

      {support === 'ready' && prefs && (
        <div className="space-y-3 text-sm">
          <div className="rounded-xl bg-surface-2 border border-line p-3 space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={prefs.daily.on} onChange={(e) => saveDaily(e.target.checked)} disabled={busy} />
              <span className="font-medium">காலைப் பஞ்சாங்கம்</span>
            </label>
            {prefs.daily.on && (
              <div className="flex flex-wrap items-center gap-2 pl-6">
                <input type="time" value={dailyTime} onChange={(e) => setDailyTime(e.target.value || '06:00')} onBlur={() => prefs.daily.time !== dailyTime && saveDaily(true)} className="rounded-lg border border-line bg-surface px-2 py-1" aria-label="காலை நேரம்" />
                <span className="text-ink-soft">{prefs.daily.place?.placeName}</span>
                {placeChanged && (
                  <button onClick={() => saveDaily(true)} className="text-xs underline">இடத்தை {place.name} என மாற்று</button>
                )}
              </div>
            )}
          </div>

          <div className="rounded-xl bg-surface-2 border border-line p-3 space-y-2">
            <p className="font-medium">⏳ தசை மாற்றங்கள்</p>
            {prefs.dasha.on ? (
              <>
                <p className="text-ink-soft">
                  பின்தொடர்வது: <b className="text-ink">{prefs.dasha.name}</b> · {prefs.dasha.levels === 3 ? 'தசை, புக்தி, அந்தரம்' : prefs.dasha.levels === 1 ? 'தசை மட்டும்' : 'தசை, புக்தி'}
                  {prefs.dasha.until ? <> · {dateTimeTa(prefs.dasha.until)} வரை அமைந்துள்ளன (அதன் பின் மீண்டும் பின்தொடரவும்)</> : null}
                </p>
                {pending.length > 0 && (
                  <ul className="text-xs text-ink-soft list-disc pl-5">
                    {pending.map((n) => <li key={n.atMs}>{dateTimeTa(n.atMs)} — {n.title}</li>)}
                  </ul>
                )}
                <button onClick={unfollow} disabled={busy} className="text-xs underline">நிறுத்து</button>
              </>
            ) : (
              <p className="text-ink-soft">எந்த ஜாதகமும் பின்தொடரப்படவில்லை.</p>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <select value={levels} onChange={(e) => setLevels(Number(e.target.value))} className="rounded-lg border border-line bg-surface px-2 py-1 text-xs" aria-label="எந்த அளவு வரை">
                <option value={1}>தசை மட்டும்</option>
                <option value={2}>தசை, புக்தி</option>
                <option value={3}>தசை, புக்தி, அந்தரம்</option>
              </select>
              <button onClick={follow} disabled={busy || !input || !chart} className="rounded-lg border border-line px-3 py-1 text-xs hover:bg-saffron-soft disabled:opacity-50">
                {chart ? `திறந்துள்ள ஜாதகம் (${chart.name}) — பின்தொடர்` : 'ஜாதகம் திறக்கப்படவில்லை'}
              </button>
            </div>
            <p className="text-[11px] text-ink-soft">அறிவிப்பில் ஜாதகத்தின் பெயர் வரும். பிறந்த விவரம் சேவையகத்தில் சேமிக்கப்படுவதில்லை; அறிவிப்புச் செய்திகள் மட்டும்.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button onClick={test} disabled={busy} className="rounded-lg border border-line px-3 py-1.5 text-xs hover:bg-ink/5 disabled:opacity-50" data-testid="notify-test">🔔 சோதனை அறிவிப்பு</button>
            <button onClick={switchOff} disabled={busy} className="rounded-lg border border-line px-3 py-1.5 text-xs hover:bg-rose-soft disabled:opacity-50">இந்தச் சாதனத்தில் நிறுத்து</button>
          </div>
        </div>
      )}

      {note && <p className="text-xs text-ink" role="status">{note}</p>}
    </section>
  );
}
