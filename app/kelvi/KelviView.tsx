'use client';

import { useState } from 'react';
import { BirthDataForm, type BirthData } from '@/src/ui/BirthDataForm';
import { computeAnswer } from './actions';
import type { BirthFormInput } from '../report/actions';

function toInput(bd: BirthData): BirthFormInput {
  return {
    name: bd.name, gender: bd.gender,
    year: parseInt(bd.dateOfBirth.split('-')[0]),
    month: parseInt(bd.dateOfBirth.split('-')[1]),
    day: parseInt(bd.dateOfBirth.split('-')[2]),
    hour: parseInt(bd.timeOfBirth.split(':')[0]),
    minute: parseInt(bd.timeOfBirth.split(':')[1]),
    placeName: bd.place, latitude: bd.latitude, longitude: bd.longitude,
    utcOffsetMinutes: bd.utcOffset, ianaTimeZone: 'Asia/Kolkata',
  };
}

const SUGGESTIONS = [
  'இந்த வருடம் வேலை கிடைக்குமா?',
  'திருமணம் எப்போது நடக்கும்?',
  'குழந்தை பாக்கியம் உண்டா?',
  'பணவரவு எப்படி இருக்கும்?',
  'உடல்நலம் எப்படி?',
  'வெளிநாட்டு பயணம் அமையுமா?',
  'இந்த வழக்கில் வெற்றி கிடைக்குமா?',
  'சொந்த வீடு அமையுமா?',
];

const STAGE_TA: Record<string, string> = {
  promise: 'வாக்குறுதி (ஜாதகம்)',
  timing: 'காலம் (தசை)',
  gochara: 'கோசாரம் (இப்போதைய கோள் நிலை)',
};

const STANDING_COLOR: Record<string, string> = {
  'strongly-supported': 'text-emerald-700 bg-emerald-50 border-emerald-300',
  supported: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  mixed: 'text-amber-700 bg-amber-50 border-amber-300',
  obstructed: 'text-rose-700 bg-rose-50 border-rose-200',
  'strongly-obstructed': 'text-rose-700 bg-rose-50 border-rose-300',
};

export default function KelviView() {
  const [input, setInput] = useState<BirthFormInput | null>(null);
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ask = async (q: string) => {
    if (!input) { setError('முதலில் பிறப்பு விவரங்களை உள்ளிடவும்.'); return; }
    if (!q.trim()) { setError('கேள்வியை உள்ளிடவும்.'); return; }
    setLoading(true);
    setError(null);
    try {
      setResult(await computeAnswer(input, q));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-6 max-w-3xl mx-auto">
      <header className="mb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">Prashna reading</p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">கேள்வி–விடை</h1>
        <p className="text-sm text-ink-soft mt-1">
          ஒரு கேள்வியை பாரம்பரிய நியாய முறையில் ஆராய்கிறது: ஜாதகம் என்ன <strong>வாக்குறுதி</strong> தருகிறது,
          நடக்கும் <strong>தசை</strong> அதைக் கொடுக்குமா, இப்போதைய <strong>கோசாரம்</strong> உறுதிப்படுத்துகிறதா
          (BPHS 11, 32, 46-47 · பலதீபிகா 2, 19, 26). ஆம்/இல்லை என்று தீர்ப்பு சொல்லாது — சாட்சியங்கள் எப்படி
          நின்றன என்பதை மட்டுமே காட்டும்.
        </p>
      </header>

      <section className="mb-6">
        <h2 className="font-semibold text-ink mb-2">பிறப்பு விவரம்</h2>
        <BirthDataForm
          onSubmit={(bd) => { setInput(toInput(bd)); setError(null); }}
          isLoading={loading}
        />
        {input && <p className="text-xs text-emerald-700 mt-1">✓ {input.name || 'ஜாதகர்'} — {input.placeName}</p>}
      </section>

      <section className="mb-6">
        <h2 className="font-semibold text-ink mb-2">கேள்வி</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') ask(question); }}
            placeholder="உங்கள் கேள்வியை இங்கே எழுதவும்…"
            className="flex-1 px-3 py-2 rounded border border-line bg-surface text-ink text-sm"
          />
          <button
            onClick={() => ask(question)}
            disabled={loading}
            className="px-4 py-2 bg-saffron text-ink font-semibold rounded hover:bg-saffron/90 disabled:opacity-50"
          >
            {loading ? 'ஆராய்கிறது…' : 'ஆராய்'}
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => { setQuestion(s); ask(s); }}
              className="text-xs px-2 py-1 rounded-full border border-line text-ink-soft hover:border-saffron hover:text-ink"
            >
              {s}
            </button>
          ))}
        </div>
      </section>

      {error && <p className="text-rose-700 text-sm mb-4">⚠️ {error}</p>}

      {result && !result.matched && (
        <p className="text-amber-700 text-sm bg-amber-50 border border-amber-200 rounded p-3">
          {result.note || 'இந்தக் கேள்வியை அறியப்பட்ட தலைப்புகளுடன் பொருத்த முடியவில்லை.'}
        </p>
      )}

      {result && result.matched && result.topics.map((topic: any) => (
        <article key={topic.topicId} className="mb-6 border border-line rounded-lg overflow-hidden">
          <div className={`p-4 border-b ${STANDING_COLOR[topic.standing] || 'bg-surface-soft'}`}>
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-[family-name:var(--font-tamil-serif)] text-xl font-bold">{topic.ta}</h3>
              <span className="text-sm font-semibold">{topic.standingTa} ({topic.score > 0 ? '+' : ''}{topic.score})</span>
            </div>
            <p className="text-xs mt-1 opacity-80">{topic.en} · {topic.source}</p>
          </div>

          <div className="p-4 space-y-4 bg-surface">
            {/* significators */}
            <div className="text-xs text-ink-soft">
              <span className="font-semibold">பாவங்கள்: </span>
              {topic.significators.bhavas.map((b: any) => `${b.bhava} (${b.lordTa})`).join(', ')}
              {' · '}
              <span className="font-semibold">காரகர்: </span>
              {topic.significators.karakas.map((k: any) => k.tamil).join(', ')}
            </div>

            {/* reasoning grouped by stage */}
            {['promise', 'timing', 'gochara'].map((stage) => {
              const rows = topic.steps.filter((s: any) => s.stage === stage);
              if (!rows.length) return null;
              const sub = rows.reduce((a: number, s: any) => a + s.weight, 0);
              return (
                <div key={stage}>
                  <h4 className="text-sm font-semibold text-ink mb-1">
                    {STAGE_TA[stage]} <span className="text-ink-soft font-normal">({sub > 0 ? '+' : ''}{sub})</span>
                  </h4>
                  <ul className="space-y-1">
                    {rows.map((s: any, i: number) => (
                      <li key={i} className="text-sm text-ink flex gap-2">
                        <span className={`font-mono text-xs w-10 shrink-0 text-right ${s.weight > 0 ? 'text-emerald-700' : s.weight < 0 ? 'text-rose-700' : 'text-ink-soft'}`}>
                          {s.weight > 0 ? '+' : ''}{s.weight}
                        </span>
                        <span>{s.ta} <span className="text-ink-soft text-xs">— {s.source}</span></span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}

            {topic.note && (
              <p className="text-xs text-ink-soft border-t border-line pt-2">
                <span className="font-semibold">குறிப்பு: </span>{topic.note.ta}
              </p>
            )}
            {!topic.usedGochara && (
              <p className="text-xs text-ink-soft">கோசார சாட்சியம் சேர்க்கப்படவில்லை.</p>
            )}
          </div>
        </article>
      ))}
    </main>
  );
}
