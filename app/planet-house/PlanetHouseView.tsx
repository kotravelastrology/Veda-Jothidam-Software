'use client';

import { useEffect, useState } from 'react';
import { PartyChooser, type Party } from '@/src/ui/PartyChooser';
import { computePlanetHouse } from './actions';
import { citeTa } from '@/src/sources/citeTa';

/**
 * Each planet in its house from the lagna, as the classical books describe it. One block per book, never merged;
 * the page of the printed book is shown. Only the verse itself is summarised (not the translator's notes). The
 * statements are the books' — a reading of the whole chart weighs dignity, aspects and more; this does not.
 */

const TAG_TA: Record<string, string> = {
  EXALTED: 'உச்சம்', OWN_SIGN: 'சொந்த வீடு', MOOLATRIKONA: 'மூலத்திரிகோணம்', DEBILITATED: 'நீசம்', KENDRA: 'கேந்திரம்', TRIKONA: 'திரிகோணம்',
  CONJ_MALEFIC: 'பாபருடன் சேர்க்கை', BENEFIC_CONJ: 'சுபருடன் சேர்க்கை', WANING: 'தேய்பிறைச் சந்திரன்',
  STRONG_VARGA: 'வர்க்கத்தில் பலம்', BENEFIC_NAVAMSA: 'சுப நவாம்சம்', OWN_NAVAMSA: 'சொந்த நவாம்சம்', EXALTED_NAVAMSA: 'உச்ச நவாம்சம்',
  FRIEND_SIGN: 'நட்பு வீடு', BENEFIC_SIGN: 'சுப ராசி', BENEFIC_ASPECT: 'சுப பார்வை', MALEFIC_ASPECT: 'பாப பார்வை', COMBUST: 'அஸ்தமனம்',
};
const tagTa = (t: string) => {
  if (TAG_TA[t]) return TAG_TA[t];
  let m = /^H(\d+)$/.exec(t); if (m) return `${m[1]}-ஆம் வீடு`;
  m = /^WITH_LORD_(\d+)$/.exec(t); if (m) return `${m[1]}-ஆம் அதிபதியுடன் சேர்க்கை`;
  m = /^LORD_(\d+)$/.exec(t); if (m) return `${m[1]}-ஆம் அதிபதி`;
  return t;
};
const KIND_TA: Record<string, string> = { fav: 'நல்ல பலன்', unfav: 'தீய பலன்', timing: 'தசையின் காலம்', note: 'மொழிபெயர்ப்பாளர் குறிப்பு', cond: 'குறிப்பிட்ட நிலை' };

export default function PlanetHouseView() {
  const [party, setParty] = useState<Party | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!party) { setResult(null); return; }
    let cancelled = false;
    setLoading(true); setError(null);
    computePlanetHouse(party.kind === 'profile' ? { profile: { profileId: party.profileId, revision: party.revision } } : { form: party.input })
      .then((r) => { if (!cancelled) setResult(r); })
      .catch((e) => { if (!cancelled) { setError(e instanceof Error ? e.message : String(e)); setResult(null); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [party]);

  return (
    <main className="min-h-screen p-6 max-w-4xl mx-auto">
      <header className="mb-5">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">Planets in houses</p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">பிறந்த நட்சத்திரம், கிரகம் பாவத்தில், தசாநாதன், பாவாதிபதி — நூல்கள் சொல்வது</h1>
        <p className="text-sm text-ink-soft mt-1 max-w-3xl">
          ஒவ்வொரு கிரகமும் லக்னத்திலிருந்து எந்த வீட்டில் உள்ளது, அதைப் பற்றி நூல் என்ன சொல்கிறது — நூல் வாரியாக, அச்சுப் பக்கத்துடன். நூலின் சொற்கள் சுருக்கப்பட்டுள்ளன (மேற்கோள் அல்ல).
          இது நூலின் கூற்று மட்டுமே; கிரகத்தின் பலம், பார்வை, சேர்க்கை ஆகியவற்றையும் சேர்த்துப் பார்த்தே பலன் சொல்ல வேண்டும்.
        </p>
      </header>

      <PartyChooser party={party} setParty={(x) => { setParty(x); if (!x) setResult(null); }} loading={loading} />
      {loading && <p className="text-sm text-ink-soft mb-4">கணக்கிடப்படுகிறது…</p>}
      {error && <p className="text-rose text-sm mb-4 bg-rose-soft rounded-xl p-3">⚠️ {error}</p>}

      {result && (
        <>
          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="font-semibold text-ink">{result.native.name ?? '(பெயர் இல்லை)'} · {result.native.date} {result.native.time} · {result.native.placeName ?? '—'}</h2>
            <p className="text-xs text-ink-soft">{result.native.method.ayanamsha} அயனாம்சம் · லக்னம்: {result.lagnaTa}</p>
            <p className="text-[11px] text-ink-soft mt-1">{result.books.map((b: any) => `${citeTa(b.source)} — ${b.scope}`).join(' · ')}</p>
          </section>
          <h2 className="text-lg font-semibold text-ink mb-1">பிறந்த நட்சத்திரம் — {result.janma.starTa} (பாதம் {result.janma.pada})</h2>
          <p className="text-[11px] text-ink-soft mb-3">இரு நூல்களும் நட்சத்திரத்தை மட்டுமே சொல்கின்றன, பாதம் வாரியாக அல்ல. நூல்: சந்திரனின் பலத்துக்கு ஏற்ப இவை வெளிப்படும்.</p>
          {result.janma.readings.map((x: any) => (
            <section key={x.bookId} className="bg-surface border border-line rounded-2xl p-4 mb-3 text-sm">
              <p className="text-ink">{x.ta}</p>
              <p className="text-[11px] text-ink-soft mt-0.5">{citeTa({ ...x.source, pageLocus: x.source.pageLocus.includes('PDF pp.') ? `Chapter 28, PDF p.${x.page}` : `printed p.${x.page}` })}{x.stanza ? ` · பாடல் ${x.stanza}` : ''}</p>
            </section>
          ))}
          <h2 className="text-lg font-semibold text-ink mt-6 mb-1">கிரகம் பாவத்தில்</h2>
          {result.rows.map((r: any) => (
            <section key={r.planet} className="bg-surface border border-line rounded-2xl p-4 mb-3 text-sm">
              <h2 className="font-semibold text-ink">{r.planetTa} — {r.house}-ஆம் வீடு <span className="text-ink-soft font-normal">({r.signTa})</span></h2>
              {r.readings.length === 0 && <p className="text-xs text-ink-soft mt-1">இந்த நூல்களில் இந்தக் கிரகத்துக்கு வீட்டுப் பலன் தரப்படவில்லை.</p>}
              {r.readings.map((x: any) => (
                <div key={x.bookId} className="mt-2">
                  <p className="text-ink">{x.ta}</p>
                  {x.sameAs && <p className="text-[11px] text-ink-soft mt-0.5">நூல்: "மற்ற இடங்களில் {x.sameAs === 'Sun' ? 'சூரியனைப்' : x.sameAs === 'Jupiter' ? 'குருவைப்' : x.sameAs} போல" — அந்தக் கிரகத்தின் இதே வீட்டுப் பலன் இங்கே காட்டப்படுகிறது.</p>}
                  {x.caveat && <p className="text-[11px] text-rose mt-0.5">{x.caveat}</p>}
                  {x.misprint && <p className="text-[11px] text-rose mt-0.5">அச்சுப்பிழை: நூலின் இந்த இடம் தன் சொந்தத் தலைப்புடன் ஒத்துப்போகவில்லை.</p>}
                  {x.gloss && <p className="text-[11px] text-ink-soft mt-0.5">மொழிபெயர்ப்பில் உரையாசிரியர் விளக்கம் மூலத்துடன் கலந்துள்ளது.</p>}
                  <p className="text-[11px] text-ink-soft mt-0.5">{citeTa({ ...x.source, pageLocus: `printed p.${x.page}` })} · பாடல் {x.verse}</p>
                </div>
              ))}
            </section>
          ))}
          <h2 className="text-lg font-semibold text-ink mt-6 mb-1">தசாநாதன் பலன் — {result.dashaEffects.source.title}, அத்.47</h2>
          <p className="text-[11px] text-ink-soft mb-2">{citeTa(result.dashaEffects.source)} · {result.dashaEffects.scope}</p>
          <ul className="text-[11px] text-ink-soft mb-3 list-disc pl-5">
            {result.dashaEffects.general.map((g: any) => <li key={g.verses}>பாடல் {g.verses}: {g.ta}</li>)}
          </ul>
          {result.dashaEffects.planets.map((p: any) => (
            <section key={p.planet} className={`bg-surface border rounded-2xl p-4 mb-3 text-sm ${result.dashaEffects.currentDasha === p.planet ? 'border-rose' : 'border-line'}`}>
              <h3 className="font-semibold text-ink">{p.planetTa} தசை — {p.house}-ஆம் வீட்டில் ({p.signTa}){result.dashaEffects.currentDasha === p.planet && <span className="text-rose font-normal"> ← நடப்பு மகா தசை</span>}</h3>
              {p.sections.map((s: any, i: number) => (
                <div key={i} className="mt-2">
                  <p className="text-[11px] text-ink-soft">{KIND_TA[s.kind]} · பாடல் {s.verses} · {citeTa({ ...result.dashaEffects.source, pageLocus: `printed p.${s.page}` })}</p>
                  <p className="text-ink">{s.ta}</p>
                  {s.conds.length > 0 && (
                    <p className="text-[11px] mt-0.5">
                      {s.held.length > 0 && <span className="text-teal">இந்த ஜாதகத்தில் உள்ளவை: {s.held.map(tagTa).join(', ')}. </span>}
                      {s.failed.length > 0 && <span className="text-ink-soft">இல்லாதவை: {s.failed.map(tagTa).join(', ')}. </span>}
                      {s.unknown.length > 0 && <span className="text-ink-soft">இங்கே சரிபார்க்கப்படாதவை: {s.unknown.map(tagTa).join(', ')}.</span>}
                    </p>
                  )}
                </div>
              ))}
            </section>
          ))}
          <h2 className="text-lg font-semibold text-ink mt-6 mb-1">பாவாதிபதி பலன்கள்</h2>
          <p className="text-[11px] text-ink-soft mb-3">{result.bhaveshBooks.map((b: any) => `${citeTa(b.source)} — ${b.scope}`).join(' · ')}</p>
          {result.bhavesh.map((r: any) => (
            <section key={r.bhava} className="bg-surface border border-line rounded-2xl p-4 mb-3 text-sm">
              <h3 className="font-semibold text-ink">{r.bhava}-ஆம் வீடு ({r.signTa}) அதிபதி {r.lordTa} — {r.lordHouse}-ஆம் வீட்டில் ({r.lordSignTa})</h3>
              {r.readings.map((x: any) => (
                <div key={x.bookId} className="mt-2">
                  <p className="text-ink">{x.ta}</p>
                  <p className="text-[11px] text-ink-soft mt-0.5">{citeTa({ ...x.source, pageLocus: `printed p.${x.page}` })} · பாடல் {x.verse}</p>
                </div>
              ))}
            </section>
          ))}
        </>
      )}
    </main>
  );
}
