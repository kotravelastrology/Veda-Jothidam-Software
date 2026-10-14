/**
 * Phaladeepika XXVI for the present, in words. /gochara-vedha and the report's
 * gochara section both show it from this file, so the two say the same thing.
 * The data is `phaladeepikaNow()` in `src/report/phaladeepikaGochara.js`.
 */

export const PLANET_TA: Record<string, string> = {
  Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு',
  Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது',
};
export const NATURE_TA: Record<string, string> = { MALEFIC: 'பாபர்', BENEFIC: 'சுபர்' };
export const REASON_TA: Record<string, string> = { DEBILITATED: 'நீசம்', ENEMY_SIGN: 'பகை வீடு', COMBUST: 'அஸ்தங்கம்' };

export const cite = (s: any) => `${s.title} — ${String(s.pageLocus).split(':')[0]}`;
export const Cites = ({ list }: { list: any[] }) => (
  <span className="block text-[11px] text-ink-soft mt-1">{list.map((s, i) => <span key={i} className="block">{cite(s)}</span>)}</span>
);

/** Phaladeepika XXVI.31-32 verdicts in words. */
export function verdictTa(v: any) {
  const out: { ta: string; cls: string }[] = [];
  if (v.v31 === 'FULL') out.push({ ta: 'ஸ்லோ. 31: உச்சம் / சொந்த வீடு — முழுப் பலன்', cls: 'text-teal' });
  if (v.v31 === 'NO_HARM') out.push({ ta: 'ஸ்லோ. 31: உச்சம் / சொந்த வீடு — தீமை செய்யாது', cls: 'text-teal' });
  const why = v.reasons.map((r: string) => REASON_TA[r]).join(', ');
  if (v.v32 === 'VOID') out.push({ ta: `ஸ்லோ. 32: ${why} — நல்ல பலன் இல்லாமல் போகும்`, cls: 'text-amber-700' });
  if (v.v32 === 'AGGRAVATED') out.push({ ta: `ஸ்லோ. 32: ${why} — மிகுந்த கஷ்டம்`, cls: 'text-rose' });
  return out;
}

/** Verse 30 for one aspecting planet. */
export function aspectTa(x: any) {
  const what = x.voids === 'GOOD' ? 'நல்ல பலன் அற்றுப் போகும்' : x.voids === 'BAD' ? 'தீய பலன் அற்றுப் போகும்' : null;
  const enemy = x.enemy ? 'பகைவர் பார்வை — பலன் அற்றுப் போகும் (கபூர்: நல்ல பலன் மட்டும்)' : null;
  return { label: `${x.planetTa} (${NATURE_TA[x.nature]}${x.enemy ? ', பகை' : ''})`, effects: [what, enemy].filter(Boolean) as string[] };
}

/** The planet's standing in its sign (I.6, II.21-22, II.35). */
export function dignityTa(d: any) {
  const parts = [d.exalted && 'உச்சம்', d.own && 'சொந்த வீடு', d.debilitated && 'நீசம்', d.enemySign && `பகை வீடு (${PLANET_TA[d.lord]})`].filter(Boolean);
  return parts.length ? parts.join(', ') : null;
}

/** Phaladeepika XXVI.25 for the present: in the third of the sign that gives the result? `pd` carries `decanate` and `decanateTa`. */
export function effectiveNowTa(pd: any, n: any) {
  if (n.effectiveNow === null) return 'ஸ்லோகம் 25 கேதுவைச் சொல்லவில்லை';
  if (n.effectiveNow === 'ALL') return 'ராசி முழுவதும் பலன் தரும் (ஸ்லோ. 25)';
  const where = pd.decanateTa[pd.decanate[n.planet]];
  return n.effectiveNow ? `இப்போது பலன் தரும் பகுதியில் — ${where} (${n.degreeInSign}°)` : `பலன் தரும் பகுதி ${where}; இப்போது ${n.degreeInSign}°`;
}

/**
 * Verse 41 for one planet in one sign, under one table of places: the total
 * (above 28 — the default reading), the planet's own count (5 or more), and
 * XXIII.11's result for that count. `b` is one table's entry of `bindusAt`.
 */
export function Verse41Lines({ b, goodHouse }: { b: any; goodHouse: boolean }) {
  if (!b) return null;
  const always = goodHouse ? 'எப்போதும் நல்ல பலன்' : 'தீய இடமாயினும் நல்ல பலன்';
  return (
    <>
      <span className={`block text-[11px] ${b.bySav ? 'text-teal' : 'text-ink-soft'}`}>
        ஸ்லோ. 41: சர்வாஷ்டகம் {b.sav}{b.bySav ? ` — 28-க்கு மேல்: ${always}` : ' (28-க்கு மேல் இல்லை)'}
      </span>
      {b.bav !== null && (
        <span className={`block text-[11px] ${b.byBav ? 'text-teal' : 'text-ink-soft'}`}>
          சொந்த அஷ்டகவர்க்கம் {b.bav}/8{b.byBav ? ` — 5 அல்லது மேல் (ஜா.பா. X.9): ${always}` : ''} · XXIII.11: {b.resultTa}{b.bav === 4 ? ' · 4: கபூர் வாசிப்பில் நன்மை' : ''}
        </span>
      )}
    </>
  );
}

/**
 * One planet now: the verse's result in its house (9-24), the effective third
 * (25), dignity and combustion with verses 31-32, verse 33, the full aspects on
 * it (30), the partial aspects as information, and verse 41 under `table`
 * (Phaladeepika's places by default).
 */
export function PhaladeepikaNowCell({ pd, n, table }: { pd: any; n: any; table?: string }) {
  const dt = dignityTa(n.dignity);
  const tableId = table ?? pd.bindu?.defaultTable;
  return (
    <>
      {n.resultTa ?? <span className="text-ink-soft">—</span>}
      <span className="block text-[11px] text-ink-soft">{effectiveNowTa(pd, n)}</span>
      {(dt || n.combustion.combust) && <span className="block text-[11px] text-ink-soft">{[dt, n.combustion.combust && `அஸ்தங்கம் (சூரியனிலிருந்து ${n.combustion.separation}°${n.combustion.retrograde ? ', வக்கிரம்' : ''})`].filter(Boolean).join(' · ')}</span>}
      {verdictTa(n.verdict).map((x) => <span key={x.ta} className={`block text-[11px] ${x.cls}`}>{x.ta}</span>)}
      {n.dangerVerse33 && <span className="block text-[11px] text-rose">ஸ்லோ. 33: சந்திரனிலிருந்து {n.house}-ஆம் இடம் — உயிருக்கு ஐயம், பதவியிலிருந்து வீழ்ச்சி, பண இழப்பு</span>}
      {n.aspects.filter((x: any) => x.full).map((x: any) => {
        const t = aspectTa(x);
        return <span key={x.planet} className={`block text-[11px] ${t.effects.length ? 'text-amber-700' : 'text-ink-soft'}`}>ஸ்லோ. 30: {t.label} {x.house}-ஆம் பார்வை{t.effects.length ? ` — ${t.effects.join('; ')}` : ''}</span>;
      })}
      {n.aspects.some((x: any) => !x.full) && <span className="block text-[11px] text-ink-soft">பகுதிப் பார்வை (கணக்கில் இல்லை): {n.aspects.filter((x: any) => !x.full).map((x: any) => `${x.planetTa} ${x.fraction}`).join(', ')}</span>}
      {n.bindus && tableId && <Verse41Lines b={n.bindus[tableId]} goodHouse={n.goodHouse} />}
    </>
  );
}

/** Two buttons: whose table of Ashtakavarga places verse 41 counts with. */
export function BinduTablePicker({ meta, value, onChange }: { meta: any; value: string; onChange: (id: string) => void }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-1 text-[11px]">
      <span className="text-ink-soft">ஸ்லோ. 41 பரல் அட்டவணை:</span>
      {meta.tableOrder.map((id: string) => (
        <button
          key={id} type="button" onClick={() => onChange(id)}
          className={`px-2 py-0.5 rounded-full border ${value === id ? 'border-saffron bg-saffron/10 text-ink font-semibold' : 'border-line text-ink-soft'}`}
        >
          {meta.tables[id].labelTa}{id === meta.defaultTable ? ' (இயல்பு)' : ''}
        </button>
      ))}
    </span>
  );
}
