'use client';

import { useEffect, useState } from 'react';
import { aiStatus } from '../../app/explainActions';

const CONSENT_KEY = 'kotravel-ai-consent';

/** Settings page: whether "இந்தப் பக்கத்தை விளக்கு" is on (the server has an Anthropic key), and how to switch it on. Not a setting. */
export function AiStatusCard() {
  const [s, setS] = useState<{ enabled: boolean; model: string; perHour: number } | null>(null);
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    let live = true;
    aiStatus()
      .then((r) => { if (live) setS(r); })
      .catch(() => { if (live) setS({ enabled: false, model: '', perHour: 0 }); });
    try { setConsented(localStorage.getItem(CONSENT_KEY) === '1'); } catch { /* no storage */ }
    return () => { live = false; };
  }, []);

  const withdraw = () => {
    try { localStorage.removeItem(CONSENT_KEY); } catch { /* no storage */ }
    setConsented(false);
  };

  return (
    <section className="rounded-2xl border border-line bg-surface p-5 shadow-sm space-y-2" aria-labelledby="ai-status-heading" data-testid="ai-status">
      <h2 id="ai-status-heading" className="font-semibold text-ink">✨ AI விளக்கம் · Explain this page</h2>
      {s === null && <div className="skeleton h-4 w-2/3" />}
      {s?.enabled && (
        <>
          <p className="text-sm text-ink">
            <span className="text-teal font-semibold">● இயங்குகிறது</span> · {s.model} · மணிக்கு {s.perHour} கேள்விகள் வரை (முழுச் சேவையகத்துக்கும்).
          </p>
          <p className="text-xs text-ink-soft">
            மேல் பட்டியின் ✨ பொத்தான் திரையில் உள்ள பக்கத்தை, அல்லது நீங்கள் தேர்ந்தெடுத்த பகுதியை, அந்தப் பக்கத்தின் வரிகளைக் கொண்டு மட்டும் விளக்கும்.
            பக்கத்தில் இல்லாத வரி ✗ எனக் குறிக்கப்படும். திறந்த ஜாதகத்தின் பெயரும் ஊரும் அனுப்பும் முன் நீக்கப்படும்.
          </p>
          {consented && (
            <button onClick={withdraw} className="text-xs underline text-ink-soft hover:text-ink">
              இந்தக் கணினியில் கொடுத்த ஒப்புதலைத் திரும்பப் பெறு
            </button>
          )}
        </>
      )}
      {s && !s.enabled && (
        <p className="text-sm text-ink-soft">
          இயக்கப்படவில்லை. சேவையகத்தின் <code>.env.local</code> கோப்பில் <code>ANTHROPIC_API_KEY=…</code> சேர்த்து, சேவையகத்தை மீண்டும் தொடங்கினால்
          மேல் பட்டியில் ✨ பொத்தான் தோன்றும். விருப்பமாக: <code>KOTRAVEL_AI_MODEL</code> (இயல்பு claude-opus-5-5), <code>KOTRAVEL_AI_PER_HOUR</code> (இயல்பு 60).
        </p>
      )}
    </section>
  );
}
