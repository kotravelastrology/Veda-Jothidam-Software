'use client';

import { useEffect, useState } from 'react';
import { computeBabyNames, babyNameTables } from './actions';

export default function BabyNamesView() {
  const [tables, setTables] = useState<{ nakshatras: string[]; syllables: string[][] } | null>(null);
  const [nakshatraIndex, setNakshatraIndex] = useState(0);
  const [pada, setPada] = useState(1);
  const [gender, setGender] = useState<'boy' | 'girl' | 'both'>('both');
  const [search, setSearch] = useState('');
  const [result, setResult] = useState<any>(null);

  useEffect(() => { babyNameTables().then(setTables); }, []);
  useEffect(() => {
    computeBabyNames({ nakshatraIndex, pada, gender, search: search || undefined }).then(setResult);
  }, [nakshatraIndex, pada, gender, search]);

  return (
    <main className="min-h-screen p-6 max-w-2xl mx-auto">
      <header className="mb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">Baby names</p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">குழந்தை பெயர்</h1>
        <p className="text-sm text-ink-soft mt-1">
          108-பாத நாமகரண சக்கரப்படி ஜன்ம நட்சத்திரப் பாதத்தின் எழுத்தில் தொடங்கும் பெயர்கள்.
          உங்கள் ஜன்ம நட்சத்திரத்தை அறிக்கையின் &ldquo;நட்சத்திரக் கூறுகள்&rdquo; பகுதியில் காணலாம்.
          பெயர்ப் பட்டியல் ஒரு மாதிரி; முழுமையானது அல்ல.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <label className="text-sm">
          <span className="block text-xs text-ink-soft mb-1">நட்சத்திரம்</span>
          <select value={nakshatraIndex} onChange={(e) => { setNakshatraIndex(Number(e.target.value)); setPada(1); }}
            className="w-full px-2 py-1.5 rounded border border-line bg-surface text-ink text-sm">
            {(tables?.nakshatras || []).map((n, i) => <option key={i} value={i}>{i + 1}. {n}</option>)}
          </select>
        </label>
        <label className="text-sm">
          <span className="block text-xs text-ink-soft mb-1">பாதம்</span>
          <select value={pada} onChange={(e) => setPada(Number(e.target.value))}
            className="w-full px-2 py-1.5 rounded border border-line bg-surface text-ink text-sm">
            {[1, 2, 3, 4].map((p) => (
              <option key={p} value={p}>{p}வது பாதம் — &ldquo;{tables?.syllables[nakshatraIndex]?.[p - 1]}&rdquo;</option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex gap-2 mb-3">
        {(['both', 'boy', 'girl'] as const).map((g) => (
          <button key={g} onClick={() => setGender(g)}
            className={`px-3 py-1.5 text-xs rounded-full border font-semibold ${gender === g ? 'bg-saffron text-ink border-saffron' : 'bg-surface border-line text-ink-soft'}`}>
            {g === 'both' ? 'இரண்டும்' : g === 'boy' ? 'ஆண்' : 'பெண்'}
          </button>
        ))}
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="பெயர் தேடு…"
          className="flex-1 px-3 py-1.5 rounded border border-line bg-surface text-ink text-sm" />
      </div>

      {result && (
        <div className="bg-saffron/15 border border-saffron/40 rounded-lg p-3 text-center mb-4">
          <p className="text-xs text-ink-soft">{result.nakshatra} — {result.pada}வது பாதம்</p>
          <p className="text-3xl font-bold text-ink mt-0.5">&ldquo;{result.syllable}&rdquo;</p>
          <p className="text-xs text-ink-soft mt-0.5">இந்த எழுத்தில் பெயர் தொடங்க வேண்டும்</p>
        </div>
      )}

      {result && (result.count > 0 ? (
        <>
          <p className="text-xs text-ink-soft mb-2">{result.count} பெயர்கள்</p>
          <div className="grid grid-cols-3 gap-2">
            {result.names.map((n: any, i: number) => (
              <div key={i} className={`border rounded p-2 text-center text-sm ${n.gender === 'boy' ? 'bg-sky-50 border-sky-200' : 'bg-pink-50 border-pink-200'}`}>
                <div className="font-medium text-ink">{n.name}</div>
                <div className={`text-[10px] mt-0.5 ${n.gender === 'boy' ? 'text-sky-700' : 'text-pink-700'}`}>{n.gender === 'boy' ? 'ஆண்' : 'பெண்'}</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-center text-ink-soft py-8 text-sm">
          &ldquo;{result.syllable}&rdquo; எழுத்திற்கான பெயர்கள் இன்னும் சேர்க்கப்படவில்லை.
        </p>
      ))}
    </main>
  );
}
