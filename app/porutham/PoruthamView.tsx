'use client';

import { useState } from 'react';
import { BirthDataForm, type BirthData } from '@/src/ui/BirthDataForm';
import { computePorutham } from './actions';
import type { BirthFormInput } from '../report/actions';

const SIGN_TA = ['மேஷ', 'ரிஷப', 'மிது', 'கடக', 'சிம்', 'கன்னி', 'துலா', 'விரு', 'தனு', 'மகர', 'கும்ப', 'மீன'];

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

export default function PoruthamView() {
  const [girl, setGirl] = useState<BirthFormInput | null>(null);
  const [boy, setBoy] = useState<BirthFormInput | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (g: BirthFormInput, b: BirthFormInput) => {
    setLoading(true);
    setError(null);
    try {
      setResult(await computePorutham(g, b));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-6 max-w-3xl mx-auto">
      <header className="mb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">Marriage Matching</p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">திருமணப் பொருத்தம்</h1>
        <p className="text-sm text-ink-soft mt-1">
          10 தச கூட பொருத்தங்கள் — சந்திர நட்சத்திரம் / ராசி அடிப்படையில். இடதுபுறம் மணமகள், வலதுபுறம் மணமகன்.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="bg-surface border border-line rounded-2xl p-4">
          <h2 className="text-sm font-semibold text-ink mb-2">மணமகள் (Bride)</h2>
          <BirthDataForm
            isLoading={loading}
            onSubmit={(bd) => { const g = toInput(bd); setGirl(g); if (boy) run(g, boy); }}
          />
          {girl && <p className="text-xs text-teal mt-2">✓ சேமிக்கப்பட்டது</p>}
        </div>
        <div className="bg-surface border border-line rounded-2xl p-4">
          <h2 className="text-sm font-semibold text-ink mb-2">மணமகன் (Groom)</h2>
          <BirthDataForm
            isLoading={loading}
            onSubmit={(bd) => { const b = toInput(bd); setBoy(b); if (girl) run(girl, b); }}
          />
          {boy && <p className="text-xs text-teal mt-2">✓ சேமிக்கப்பட்டது</p>}
        </div>
      </div>
      {!result && <p className="text-sm text-ink-soft mb-4">இரு படிவங்களையும் நிரப்பி "கணக்கிடு" அழுத்தவும்.</p>}
      {error && <p className="text-rose text-sm mb-4">⚠️ {error}</p>}

      {result && (
        <div className="bg-surface border border-line rounded-2xl p-5">
          <div className="flex items-baseline justify-between mb-4">
            <div className="text-sm text-ink-soft">
              மணமகள்: <span className="text-ink font-medium">{result.girl.nakshatra}</span> / {SIGN_TA[result.girl.rasiIndex]}
              {' · '}மணமகன்: <span className="text-ink font-medium">{result.boy.nakshatra}</span> / {SIGN_TA[result.boy.rasiIndex]}
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-saffron">{result.passed}/{result.total}</div>
              <div className="text-xs text-ink-soft">{result.level}</div>
            </div>
          </div>
          <table className="w-full text-sm">
            <thead><tr className="text-ink-soft border-b border-line">
              <th className="text-left py-1">பொருத்தம்</th><th className="text-center py-1">முடிவு</th><th className="text-left py-1 pl-4">விவரம்</th>
            </tr></thead>
            <tbody>
              {result.rows.map((r: any) => (
                <tr key={r.name} className="border-b border-line/40">
                  <td className="py-1.5">{r.name}</td>
                  <td className="py-1.5 text-center">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${r.result ? 'bg-teal-soft text-teal' : 'bg-rose-soft text-rose'}`}>
                      {r.result ? '✓ பொருந்தும்' : '✗ இல்லை'}
                    </span>
                  </td>
                  <td className="py-1.5 pl-4 text-ink-soft">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[11px] text-ink-soft mt-3">
            10 தச கூட பொருத்தம் · முந்தைய AstrologicLab matching engine-லிருந்து port · பொது வழிகாட்டுதல்.
          </p>
        </div>
      )}

      {result?.extended && (
        <div className="bg-surface border border-line rounded-2xl p-5 mt-4">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-sm font-semibold text-ink">விரிவான நட்சத்திரப் பொருத்தம் (15)</h2>
            <div className="text-right">
              <div className="text-2xl font-bold text-saffron">{result.extended.passed}/{result.extended.total}</div>
              <div className="text-xs text-ink-soft">{result.extended.level}{result.extended.partial ? ` (+${result.extended.partial} மத்திமம்)` : ''}</div>
            </div>
          </div>
          <table className="w-full text-sm">
            <thead><tr className="text-ink-soft border-b border-line">
              <th className="text-left py-1">பொருத்தம்</th><th className="text-center py-1">முடிவு</th><th className="text-left py-1 pl-4">விவரம்</th>
            </tr></thead>
            <tbody>
              {result.extended.rows.map((r: any) => (
                <tr key={r.name} className="border-b border-line/40">
                  <td className="py-1.5">{r.name}</td>
                  <td className="py-1.5 text-center">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      r.verdict === 'உத்தமம்' ? 'bg-teal-soft text-teal' : r.verdict === 'மத்திமம்' ? 'bg-amber-100 text-amber-700' : 'bg-rose-soft text-rose'
                    }`}>
                      {r.verdict}
                    </span>
                  </td>
                  <td className="py-1.5 pl-4 text-ink-soft">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[11px] text-ink-soft mt-3">
            10 தச கூடத்திலிருந்து தனியான, இரண்டாவது 15-உறுப்பு பொருத்த முறை (ஏக தினம் · ராசி வர்ணம் · நட்சத்திர ஜாதி/கோத்திரம் ·
            சந்திரயோக வர்க்கம் · யோகினி · ஆய · விருட்சம் · பஞ்சபட்சி · லிங்கம் · விருத்தி · ஆயுள் · தசா சந்தி · நாடி · பஞ்சபூதம்).
            &ldquo;ஏக தினம்&rdquo; ஒரு எளிமைப்படுத்தப்பட்ட பட்டியல் (மூல நூலின் தசை/நிலை விதிவிலக்குகள் முழுமையாகக் கண்டறியப்படவில்லை).
            முந்தைய AstrologicLab matching engine-லிருந்து port.
          </p>
        </div>
      )}
    </main>
  );
}
