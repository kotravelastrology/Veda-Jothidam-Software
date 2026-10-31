'use client';

import type { ReactNode } from 'react';
import { citeTa } from '@/src/sources/citeTa';

/**
 * One planet's dasha as BPHS chapters 47 and 48 give it (src/report/dashaEffects.js): the book's sections with the placements
 * it names split into those that hold in this chart, those that do not and those this page cannot check, then the houses the
 * planet rules and the chapter 48 rules that hold. Shared by the planets-in-houses page and the dasha browser.
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

/** `p` is one entry of allDashaEffects(...).planets with planetTa and signTa added; `effects` is the whole result (its sources). */
export function DashaEffectCard({ p, effects, highlight = false, badge, title }: {
  p: any; effects: any; highlight?: boolean; badge?: ReactNode; title?: string;
}) {
  return (
    <section className={`bg-surface border rounded-2xl p-4 mb-3 text-sm ${highlight ? 'border-rose' : 'border-line'}`}>
      <h3 className="font-semibold text-ink">{title ?? `${p.planetTa} தசை — ${p.house}-ஆம் வீட்டில் (${p.signTa})`}{badge}</h3>
      {p.sections.map((s: any, i: number) => (
        <div key={i} className="mt-2">
          <p className="text-[11px] text-ink-soft">{KIND_TA[s.kind]} · பாடல் {s.verses} · {citeTa({ ...effects.source, pageLocus: `printed p.${s.page}` })}</p>
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
      {p.lordship.lordOf.length > 0 && (
        <div className="mt-3 border-t border-line pt-2">
          <p className="text-[11px] text-ink-soft">அத்.48 — {p.planetTa} ஆளும் வீடுகள்: {p.lordship.lordOf.join(', ')}</p>
          {p.lordship.houseLords.map((h: any) => (
            <p key={h.house} className="text-ink">{h.ta} <span className="text-[11px] text-ink-soft">(பாடல் {h.verses}, {citeTa({ ...effects.lordship.source, pageLocus: `printed p.${h.page}` })})</span></p>
          ))}
        </div>
      )}
      {p.lordship.rules.filter((r: any) => r.holds !== false).length > 0 && (
        <div className="mt-2">
          <p className="text-[11px] text-ink-soft">பிறப்பு ஜாதகத்தில் இந்தக் கிரகத்துக்குப் பொருந்தும் அத்.48 விதிகள்:</p>
          <ul className="list-disc pl-5 text-[13px]">
            {p.lordship.rules.filter((r: any) => r.holds !== false).map((r: any) => (
              <li key={r.id} className={r.holds === null ? 'text-ink-soft' : r.kind === 'unfav' ? 'text-rose' : 'text-teal'}>
                {r.ta} <span className="text-[11px] text-ink-soft">(பாடல் {r.verses}, ப.{r.page})</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
