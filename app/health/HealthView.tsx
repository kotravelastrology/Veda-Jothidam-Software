'use client';

import { useEffect, useState } from 'react';
import { PartyChooser, type Party } from '@/src/ui/PartyChooser';
import { computeHealth } from './actions';
import { citeTa } from '@/src/sources/citeTa';
import { PageEyebrow } from '@/src/ui/PageEyebrow';

/**
 * Health in BPHS (R. Santhanam's translation): the seven dhatus (ch.3 v.31), the limbs of Kalapurusha by the sthoola scheme (ch.4 v.4-4.5) and the sookshma scheme
 * (the first house chapter v.12-15, with the ascendant and the Moon), and the Sixth House chapter's diseases, timing of illness and unfortunate years (v.9-28).
 * Conditions only: where the book says "will suffer", this says that the condition holds. The Tamil is a rendering of the printed English.
 */

const num = { fontVariantNumeric: 'tabular-nums' as const };
const STATUS: Record<string, { label: string; cls: string }> = {
  HELD: { label: 'உள்ளது', cls: 'bg-rose-soft text-rose' },
  NOT_HELD: { label: 'இல்லை', cls: 'bg-surface-2 text-ink-soft' },
  UNKNOWN: { label: 'அறியப்படவில்லை', cls: 'bg-amber-100 text-amber-800' },
};
const GROUPS: [string, string][] = [['general', 'பொது நோய்கள் (பா.9-12½, ப.116)'], ['timing', 'நோய் வரும் காலம் (பா.13-19½, ப.118)'], ['years', 'துரதிர்ஷ்ட ஆண்டுகள் (பா.20-28, ப.119-120)']];

function LimbsTable({ title, data }: { title: string; data: any }) {
  return (
    <div className="mb-4">
      <h4 className="text-xs font-semibold text-ink mb-1">{title} — லக்ன ராசியின் {data.decanate}-ஆம் திரேக்காணம்</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-xs" style={num}>
          <thead><tr className="text-left text-ink-soft border-b border-line"><th className="py-1 pr-2">வீடு</th><th className="pr-2">ராசி</th><th className="pr-2">ஸ்தூலம் (அத்.4)</th><th className="pr-2">சூக்ஷ்மம் (திரேக்காணம்)</th><th>பக்கம்</th></tr></thead>
          <tbody>
            {data.rows.map((r: any) => (
              <tr key={r.house} className="border-t border-line/40">
                <td className="py-0.5 pr-2">{r.house}</td><td className="pr-2">{r.signTa}</td><td className="pr-2">{r.sthoolaTa}</td><td className="pr-2">{r.sookshmaTa}</td><td>{r.sideTa}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h5 className="text-xs font-semibold text-ink mt-2 mb-1">கிரகங்கள் அமர்ந்த உறுப்புகள்</h5>
      <table className="w-full text-xs" style={num}>
        <thead><tr className="text-left text-ink-soft border-b border-line"><th className="py-1 pr-2">கிரகம்</th><th className="pr-2">வீடு</th><th className="pr-2">ஸ்தூலம்</th><th className="pr-2">சூக்ஷ்மம்</th><th className="pr-2">பக்கம்</th><th>பா.15</th></tr></thead>
        <tbody>
          {data.planets.map((p: any) => (
            <tr key={p.planet} className="border-t border-line/40">
              <td className="py-0.5 pr-2">{p.planetTa}</td><td className="pr-2">{p.house}</td><td className="pr-2">{p.sthoolaTa}</td><td className="pr-2">{p.sookshmaTa}</td><td className="pr-2">{p.sideTa}</td><td className="text-ink-soft">{p.markTa ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function HealthView() {
  const [party, setParty] = useState<Party | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    if (!party) { setResult(null); return; }
    let cancelled = false;
    setLoading(true); setError(null);
    computeHealth(party.kind === 'profile' ? { profile: { profileId: party.profileId, revision: party.revision } } : { form: party.input })
      .then((r) => { if (!cancelled) setResult(r); })
      .catch((e) => { if (!cancelled) { setError(e instanceof Error ? e.message : String(e)); setResult(null); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [party]);

  return (
    <main className="min-h-screen p-6 max-w-4xl mx-auto">
      <header className="mb-5">
        <PageEyebrow fallback="Health · BPHS" />
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">ஆரோக்கியம் — பராசரர் (BPHS)</h1>
        <p className="text-sm text-ink-soft mt-1 max-w-3xl">
          தாதுக்கள், உடல் உறுப்புகள் (ஸ்தூலம், சூக்ஷ்மம்), ஆறாம் பாவ அத்தியாயத்தின் நோய்கள், நோய் வரும் காலம், துரதிர்ஷ்ட ஆண்டுகள். நூல் கூறும் நிபந்தனைகள் இந்த ஜாதகத்தில் உள்ளனவா என்று மட்டும் காட்டுகிறது;
          "நோய் வரும்" என்ற தீர்ப்பு தரப்படவில்லை. இது மருத்துவ ஆலோசனை அல்ல.
        </p>
      </header>

      <PartyChooser party={party} setParty={setParty} loading={loading} />
      {error && <p className="text-rose text-sm mb-3">⚠️ {error}</p>}
      {loading && <p className="text-sm text-ink-soft mb-3">கணக்கிடப்படுகிறது…</p>}

      {result && (
        <>
          <p className="text-xs text-ink-soft mb-3">{result.native?.name ?? ''} · {citeTa(result.source)}</p>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="font-semibold text-ink mb-1">சப்த தாதுக்கள் (அத்.3 பா.31, ப.15)</h2>
            <p className="text-xs text-ink-soft mb-2">சூரியன் முதல் சனி வரை முறையே எலும்பு, இரத்தம், மஜ்ஜை, தோல், கொழுப்பு, விந்து, தசை; பிறப்பில் அந்தக் கிரகம் பாதிக்கப்பட்டால் அந்தத் தாதுவுக்கு நோய் (நூலின் குறிப்பு). "பாதிப்பு" என்பதற்கு நூல் அளவு தரவில்லை; கிரகத்தின் நிலை மட்டும் காட்டப்படுகிறது.</p>
            <table className="w-full text-xs" style={num}>
              <thead><tr className="text-left text-ink-soft border-b border-line"><th className="py-1 pr-2">கிரகம்</th><th className="pr-2">தாது</th><th className="pr-2">ராசி</th><th className="pr-2">வீடு</th><th className="pr-2">நிலை</th><th>பாப சேர்க்கை</th></tr></thead>
              <tbody>
                {result.dhatus.map((d: any) => (
                  <tr key={d.planet} className="border-t border-line/40">
                    <td className="py-0.5 pr-2">{d.planetTa}</td><td className="pr-2">{d.dhatuTa}</td><td className="pr-2">{d.signTa}</td><td className="pr-2">{d.house}</td><td className="pr-2">{d.dignityTa ?? '—'}</td>
                    <td>{d.withMalefics.length ? d.withMalefics.length + ' கிரகம்' : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="font-semibold text-ink mb-1">உடல் உறுப்புகள் (அத்.4 பா.4-4½, ப.27; முதல் பாவ அத்தியாயம் பா.12-15, ப.94-96)</h2>
            <p className="text-xs text-ink-soft mb-2">
              ஸ்தூலம்: லக்ன ராசி தலை, 2-ஆம் ராசி முகம் … என்று கால புருஷனின் உறுப்புகள். சூக்ஷ்மம்: லக்னத்தில் எழும் திரேக்காணத்தைப் பொறுத்து வீடுகள் உறுப்புகளைக் குறிக்கும்; எழுந்த பாதி (12-8 வீடுகள்) இடது, எழாத பாதி (2-6 வீடுகள்) வலது; லக்னமும் 7-ஆம் வீடும் இரு பாதிகளாகப் பிரிகின்றன.
              பாவம் உள்ள உறுப்பில் புண் அல்லது தழும்பு, சுபர் உள்ள உறுப்பில் மச்சம் போன்ற குறி (பா.15). சந்திரனையும் லக்னம் போல எடுக்கலாம் (பா.11), அதனால் இரண்டும் காட்டப்படுகின்றன. பெண்ணுக்கு விரைக்குப் பதில் சூற்பை, ஆண்குறிக்குப் பதில் மறைவிடம் (நூல் குறிப்பு).
            </p>
            <LimbsTable title="லக்னத்திலிருந்து" data={result.limbs.lagna} />
            <LimbsTable title="சந்திரனிலிருந்து" data={result.limbs.moon} />
            <p className="text-[11px] text-ink-soft">அச்சில் உள்ள இரண்டு முரண்கள்: 2-ஆம் திரேக்காண வரைபடத்தின் மேல் வரிசையில் "Neck (Right)" என்பதற்குப் பதில் "Right Side of Head" என்றும், வலது நெடுவரிசையில் 4-ஆம் வீட்டுக்கு "Right side of trunk" என்பதற்குப் பதில் "Right side of Heart" என்றும் அச்சிடப்பட்டுள்ளது; மற்ற எல்லா கட்டங்களும் வீட்டு வரிசையுடன் பொருந்துகின்றன. நூலின் சமஸ்கிருதம் 11-ஆம் உறுப்பை "ஜங்கே" (கெண்டைக்கால்) என்கிறது; மொழிபெயர்ப்பு "ankles" (கணுக்கால்).</p>
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="font-semibold text-ink mb-1">நோய்களும் காலமும் — ஆறாம் பாவ அத்தியாயம் (ப.116-120)</h2>
            <p className="text-xs text-ink-soft mb-2">உள்ளது {result.summary.held} · இல்லை {result.summary.notHeld} · அறியப்படவில்லை {result.summary.unknown}. ஒவ்வொரு வரியையும் தொட்டால் நிபந்தனை, நூலின் விளைவு (வயதுடன்), இந்த ஜாதகத்தின் நிலை தெரியும்.</p>
            {GROUPS.map(([g, title]) => {
              const rows = result.rules.filter((r: any) => r.group === g);
              if (!rows.length) return null;
              return (
                <div key={g} className="mb-3">
                  <h3 className="text-xs font-semibold text-ink mb-1">{title}</h3>
                  <ul className="space-y-1 text-xs">
                    {rows.map((r: any) => {
                      const st = STATUS[r.status];
                      return (
                        <li key={r.id} className="border-b border-line/40 pb-1">
                          <button type="button" onClick={() => setOpen(open === r.id ? null : r.id)} className="text-left w-full">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded mr-2 ${st.cls}`}>{st.label}</span>
                            <span className="text-ink">{r.titleTa}</span> <span className="text-ink-soft">(ப.{r.printedPage})</span>
                          </button>
                          {open === r.id && (
                            <div className="mt-1 text-ink-soft leading-relaxed">
                              <p><span className="text-ink">நூலின் விளைவு:</span> {r.resultTa}</p>
                              <p><span className="text-ink">இந்த ஜாதகத்தில்:</span> {r.detailTa}</p>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
            <ul className="mt-2 text-[11px] text-ink-soft list-disc pl-4">
              {result.conventions.map((c: string) => <li key={c}>{c}</li>)}
              <li>கணக்கிடப்படாதவை: உறவினர்களுக்கான நோய்கள் (பாவத்தை லக்னமாக எடுத்து), மொழிபெயர்ப்பாளர் மேற்கோள் காட்டும் டாக்டர் கார்னலின் நோய்ப் பட்டியல்கள் (ப.116-118; அது நவீன மருத்துவப் பட்டியல், முனிவரின் நூல் அல்ல).</li>
            </ul>
          </section>
        </>
      )}
    </main>
  );
}
