'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PartyChooser, type Party } from '@/src/ui/PartyChooser';
import { useSettings, toDashaOptions } from '@/src/ui/SettingsPanel';
import { buildPrintDocument, bookSectionList, type PrintKind } from './actions';
import { PageEyebrow } from '@/src/ui/PageEyebrow';

/**
 * PL9's Print menu and the two text exports of its Research menu, from this software's own engines: the ephemeris and the panchang of a month, the KP chart,
 * the dashas to one to five levels, the compact lifetime (three levels), the transit/dasha report, and the birth-data and ephemeris files. The document shown is the one
 * that prints (only the document is printed; the menus and the controls are hidden by the print stylesheet in globals.css).
 */

const KINDS: { key: PrintKind; label: string; note: string; text?: boolean }[] = [
  { key: 'ephemeris', label: 'எபிமெரிஸ்', note: 'ஒரு மாதம், தினமும் 0h UT: ஒன்பது கிரகங்களின் நிரயண தீர்க்கம், வேகம்' },
  { key: 'panchang', label: 'பஞ்சாங்கம்', note: 'ஒரு மாதம், தினசரி; திருக்கணித முறை, மேலே தேர்ந்த நபரின் ஊருக்கு' },
  { key: 'kp', label: 'கிருஷ்ணமூர்த்தி (KP)', note: 'கஸ்ப்கள், கிரகங்கள், வீட்டுக் குறிகாட்டிகள்' },
  { key: 'dashas', label: 'தசைகள் 1–5 நிலை', note: 'விம்சோத்தரி; 4, 5 நிலைகள் ஆண்டு வரம்புக்குள்' },
  { key: 'compact', label: 'வாழ்நாள் தசைகள் (சுருக்கம், 3 நிலை)', note: 'முழு ஆயுள், ஒவ்வொரு தசைக்கும் புக்தி-அந்தரம்' },
  { key: 'transit', label: 'கோசாரம்-தசை அறிக்கை', note: 'ஒரு தேதியில் ஓடும் தசை, கோசார கிரகங்கள்' },
  { key: 'birth-export', label: 'பிறப்புத் தரவு கோப்பு (உரை)', note: 'பெயர், இடம், நேரம், தீர்க்கங்கள் — தாவல் பிரித்த ஒரு வரி', text: true },
  { key: 'ephemeris-csv', label: 'எபிமெரிஸ் கோப்பு (CSV)', note: 'அதே மாத எபிமெரிஸ், பாகைகளில்', text: true },
  { key: 'book', label: 'ஜாதக புத்தகம் (பக்கங்கள்)', note: 'பக்கங்களைத் தேர்ந்து ஒரே புத்தகமாக அச்சிடலாம்' },
];

const field = 'px-2 py-1.5 text-sm bg-surface border border-line rounded text-ink';
const today = new Date();

const SIGN_ABBR = ['Ari', 'Tau', 'Gem', 'Can', 'Leo', 'Vir', 'Lib', 'Sco', 'Sag', 'Cap', 'Aqu', 'Pis'];
// South-Indian grid: the sign in each cell; -1 is the centre, which spans four cells.
const GRID_SIGNS = [[11, 0, 1, 2], [10, -1, -1, 3], [9, -1, -1, 4], [8, 7, 6, 5]];

function SignGrid({ cells }: { cells: string[][] }) {
  return (
    <div className="grid grid-cols-4 gap-px bg-line border border-line max-w-md print:bg-black print:border-black">
      {GRID_SIGNS.flatMap((row, r) => row.map((sign, c) => {
        if (sign < 0) {
          return r === 1 && c === 1 ? <div key={`${r}${c}`} className="col-span-2 row-span-2 bg-surface print:bg-white" /> : null;
        }
        return (
          <div key={`${r}${c}`} className="bg-surface p-1 min-h-14 text-[11px] leading-tight print:bg-white print:text-black">
            <div className="text-[9px] text-ink-soft print:text-black">{SIGN_ABBR[sign]}</div>
            {cells[sign].map((label, i) => <div key={i}>{label}</div>)}
          </div>
        );
      }))}
    </div>
  );
}

export default function PrintView() {
  const { settings } = useSettings();
  const [party, setParty] = useState<Party | null>(null);
  const asked = useSearchParams().get('kind');
  const [kind, setKind] = useState<PrintKind>(KINDS.some((k) => k.key === asked) ? (asked as PrintKind) : 'ephemeris');
  const [year, setYear] = useState(String(today.getFullYear()));
  const [month, setMonth] = useState(String(today.getMonth() + 1));
  const [local, setLocal] = useState(true);
  const [levels, setLevels] = useState('3');
  const [fromYear, setFromYear] = useState(String(today.getFullYear()));
  const [toYear, setToYear] = useState(String(today.getFullYear() + 1));
  const [on, setOn] = useState(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`);
  const [doc, setDoc] = useState<any>(null);
  const [text, setText] = useState<{ filename: string; mime: string; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [sectionList, setSectionList] = useState<{ id: string; title: string }[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    bookSectionList().then((list: { id: string; title: string }[]) => { setSectionList(list); setSelected(list.map((s) => s.id)); }).catch(() => setSectionList([]));
  }, []);
  const toggleSection = (id: string) => setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));

  const needsMonth = kind === 'ephemeris' || kind === 'panchang' || kind === 'ephemeris-csv';
  const run = async () => {
    if (!party) return;
    setLoading(true); setError(null); setDoc(null); setText(null); setNote(null);
    try {
      const [y, m, d] = on.split('-').map(Number);
      const r: any = await buildPrintDocument({
        ...(party.kind === 'profile' ? { profile: { profileId: party.profileId, revision: party.revision } } : { form: party.input }),
        kind, local, year: parseInt(year, 10), month: parseInt(month, 10), levels: parseInt(levels, 10), fromYear: parseInt(fromYear, 10), toYear: parseInt(toYear, 10), on: { year: y, month: m, day: d },
        sections: selected,
        dashaOptions: toDashaOptions(settings),
      });
      if (r.kind === 'document') setDoc(r.doc); else setText(r);
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); } finally { setLoading(false); }
  };

  const download = () => {
    if (!text) return;
    const blob = new Blob([text.text], { type: `${text.mime};charset=utf-8` });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = text.filename; a.click();
    URL.revokeObjectURL(a.href);
  };
  const copyDoc = async () => {
    if (!doc) return;
    const lines = [doc.title, doc.subtitle, ''];
    for (const b of doc.blocks) {
      lines.push(b.heading);
      if (b.kind === 'table') { lines.push(b.columns.join('\t')); for (const r of b.rows) lines.push(r.join('\t')); } else if (b.kind === 'signGrid') { b.cells.forEach((c: string[], i: number) => lines.push(`${SIGN_ABBR[i]}\t${c.join(' ')}`)); } else if (b.kind !== 'section') lines.push(b.text);
      lines.push('');
    }
    try { await navigator.clipboard.writeText(lines.join('\n')); setNote('உரை நகலெடுக்கப்பட்டது (படமாக அல்ல).'); } catch { setNote('நகலெடுக்க முடியவில்லை.'); }
  };

  return (
    <main className="min-h-screen p-6 max-w-6xl mx-auto">
      <div className="print:hidden">
        <header className="mb-5">
          <PageEyebrow fallback="Print · Research exports" />
          <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">அச்சு மையம்</h1>
          <p className="text-sm text-ink-soft mt-1 max-w-3xl">
            PL9-இன் Print பட்டியல்: எபிமெரிஸ், பஞ்சாங்கம், KP, 1–5 நிலை தசைகள், வாழ்நாள் தசைகள், கோசாரம்-தசை அறிக்கை; மேலும் பிறப்புத் தரவு, எபிமெரிஸ் கோப்புகள். காட்டப்படும் ஆவணமே அச்சாகிறது.
            இவை மேலேயுள்ள நபரின் ஜாதகத்திலிருந்தும் இந்த மென்பொருளின் சொந்தக் கணிதத்திலிருந்தும் வருகின்றன; பலன் அல்லது தீர்ப்பு எதுவும் இல்லை.
          </p>
        </header>

        <PartyChooser party={party} setParty={(x) => { setParty(x); setDoc(null); setText(null); }} loading={loading} />

        <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
          <h2 className="font-semibold text-ink mb-2">எதை அச்சிட?</h2>
          <div className="grid sm:grid-cols-2 gap-2 mb-3">
            {KINDS.map((k) => (
              <label key={k.key} className={`border rounded p-2 cursor-pointer ${kind === k.key ? 'border-saffron bg-saffron/10' : 'border-line'}`}>
                <input type="radio" name="kind" className="mr-2" checked={kind === k.key} onChange={() => setKind(k.key)} />
                <span className="text-ink">{k.label}</span>
                <span className="block text-[11px] text-ink-soft ml-5">{k.note}</span>
              </label>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 items-end text-xs text-ink-soft">
            {needsMonth && (<>
              <label>ஆண்டு<br /><input className={`${field} w-20`} value={year} onChange={(e) => setYear(e.target.value)} /></label>
              <label>மாதம்<br /><input className={`${field} w-14`} value={month} onChange={(e) => setMonth(e.target.value)} /></label>
              {(kind === 'ephemeris' || kind === 'ephemeris-csv') && <label className="flex items-center gap-1"><input type="checkbox" checked={local} onChange={(e) => setLocal(e.target.checked)} />0h உள்ளூர் நேரம் (இல்லையேல் 0h UT)</label>}
            </>)}
            {kind === 'dashas' && (<>
              <label>நிலைகள் (1-5)<br /><input className={`${field} w-14`} value={levels} onChange={(e) => setLevels(e.target.value)} /></label>
              <label>ஆண்டு முதல்<br /><input className={`${field} w-20`} value={fromYear} onChange={(e) => setFromYear(e.target.value)} /></label>
              <label>ஆண்டு வரை<br /><input className={`${field} w-20`} value={toYear} onChange={(e) => setToYear(e.target.value)} /></label>
            </>)}
            {kind === 'transit' && <label>தேதி<br /><input type="date" className={field} value={on} onChange={(e) => setOn(e.target.value)} /></label>}
            <button type="button" onClick={run} disabled={!party || loading} className="px-4 py-1.5 rounded bg-saffron text-ink text-sm disabled:opacity-50">{loading ? 'உருவாக்குகிறது…' : 'உருவாக்கு'}</button>
            {doc && <button type="button" onClick={() => window.print()} className="px-4 py-1.5 rounded border border-line text-ink text-sm">அச்சிடு (Ctrl+P — PDF ஆகவும் சேமிக்கலாம்)</button>}
            {doc && <button type="button" onClick={copyDoc} className="px-4 py-1.5 rounded border border-line text-ink text-sm">உரையாக நகலெடு</button>}
            {text && <button type="button" onClick={download} className="px-4 py-1.5 rounded border border-line text-ink text-sm">பதிவிறக்கு ({text.filename})</button>}
          </div>
          {kind === 'book' && (
            <div className="mt-3 text-xs">
              <div className="flex gap-2 mb-2">
                <button type="button" onClick={() => setSelected(sectionList.map((s) => s.id))} className="px-2 py-1 rounded border border-line text-ink">அனைத்தும்</button>
                <button type="button" onClick={() => setSelected([])} className="px-2 py-1 rounded border border-line text-ink">எதுவுமில்லை</button>
              </div>
              <div className="grid sm:grid-cols-2 gap-1">
                {sectionList.map((s) => (
                  <label key={s.id} className="flex items-center gap-2 text-ink cursor-pointer">
                    <input type="checkbox" checked={selected.includes(s.id)} onChange={() => toggleSection(s.id)} />
                    {s.title}
                  </label>
                ))}
              </div>
            </div>
          )}
          {!party && <p className="text-[11px] text-ink-soft mt-2">முதலில் மேலே யாருடைய ஜாதகம் என்பதைத் தேர்வு செய்யுங்கள்.</p>}
          {error && <p className="text-rose text-sm mt-2">⚠️ {error}</p>}
          {note && <p className="text-xs text-ink mt-2">{note}</p>}
        </section>
      </div>

      {text && (
        <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-xs print:hidden">
          <h2 className="font-semibold text-ink mb-1">{text.filename}</h2>
          <pre className="overflow-x-auto whitespace-pre-wrap break-all text-ink-soft max-h-64">{text.text.slice(0, 3000)}{text.text.length > 3000 ? '\n…' : ''}</pre>
        </section>
      )}

      {doc && (
        <article className="print-area bg-surface border border-line rounded-2xl p-6 print:border-0 print:p-0 print:bg-white print:text-black">
          <h2 className="font-[family-name:var(--font-tamil-serif)] text-2xl font-bold text-ink print:text-black">{doc.title}</h2>
          <p className="text-xs text-ink-soft mb-4 print:text-black">{doc.subtitle}</p>
          {doc.blocks.map((b: any, i: number) => b.kind === 'section' ? (
            <h2 key={i} className="break-before-page pt-2 text-base font-bold text-ink mb-2 print:text-black">{b.heading}</h2>
          ) : (
            <section key={i} className="mb-5">
              <h3 className="text-sm font-semibold text-ink mb-1 print:text-black">{b.heading}</h3>
              {b.kind === 'table' ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-[11px] border-collapse" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    <thead><tr className="text-left text-ink-soft border-b border-line print:text-black print:border-black">{b.columns.map((c: string) => <th key={c} className="py-1 pr-2 font-semibold">{c}</th>)}</tr></thead>
                    <tbody>
                      {b.rows.map((r: string[], ri: number) => (
                        <tr key={ri} className="border-t border-line/40 print:border-gray-400 break-inside-avoid">{r.map((c, ci) => <td key={ci} className="py-0.5 pr-2 align-top">{c}</td>)}</tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : b.kind === 'signGrid' ? (
                <SignGrid cells={b.cells} />
              ) : <p className="text-xs">{b.text}</p>}
              {b.note && <p className="text-[11px] text-ink-soft mt-1 print:text-black">{b.note}</p>}
            </section>
          ))}
        </article>
      )}
    </main>
  );
}
