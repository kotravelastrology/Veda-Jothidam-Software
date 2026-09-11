'use client';

interface YogasAndDoshasRendererProps {
  report: any;
}

interface NormalizedYoga {
  key: string;
  name: string;
  group: string;
  ref?: string;
  rule?: string;
  effect?: string;
  severity?: string;
}

interface NormalizedDosha {
  key: string;
  name: string;
  ref: string;
  rule?: string;
  effect?: string;
  severity?: string;
  remedies?: string;
}

// Defensive: several of the underlying engines occasionally enrich a field
// (e.g. lunarSolarYogas' severity) into a {score, rating, ...} object rather
// than the plain string every other engine returns. Never hand a raw object
// to React as a child.
function asText(value: unknown): string | undefined {
  if (value === null || value === undefined) return undefined;
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (typeof value === 'object') {
    const v = value as any;
    return v.rating ?? v.label ?? v.name ?? undefined;
  }
  return undefined;
}

function normalizeYogas(report: any): NormalizedYoga[] {
  const out: NormalizedYoga[] = [];

  (report?.rajaYogas?.yogas ?? []).forEach((y: any, i: number) => {
    out.push({
      key: `raja-${i}`,
      name: asText(y.name) ?? 'Yoga',
      group: 'ராஜயோகம் (Raja Yoga)',
      ref: asText(y.verse),
      rule: asText(y.formation_rule),
      effect: asText(y.effects),
    });
  });

  (report?.lunarSolarYogas?.yogas ?? []).forEach((y: any, i: number) => {
    out.push({
      key: `luso-${i}`,
      name: asText(y.name) ?? 'Yoga',
      group: 'சந்திர-சூரிய & பஞ்ச மகாபுருஷ யோகம்',
      ref: asText(y.chapter ? `BPHS Ch.${y.chapter}` : y.type),
      rule: asText(y.formation_rule),
      effect: asText(y.effects),
      severity: asText(y.severity),
    });
  });

  (report?.wealthYogas?.yogas ?? []).forEach((y: any, i: number) => {
    out.push({
      key: `wealth-${i}`,
      name: asText(y.name) ?? 'Yoga',
      group: 'தன யோகம் (Wealth Yoga)',
      ref: asText(y.chapter ? `BPHS Ch.${y.chapter}` : y.type),
      rule: asText(y.formation_rule),
      effect: asText(y.effects),
      severity: asText(y.severity),
    });
  });

  (report?.edgeCaseYogas?.yogas ?? []).forEach((y: any, i: number) => {
    out.push({
      key: `edge-${i}`,
      name: asText(y.name) ?? 'Yoga',
      group: 'சிறப்பு யோகம் (Special Yoga)',
      ref: asText(y.chapter ? `BPHS Ch.${y.chapter}${y.verses ? ' v.' + y.verses : ''}` : undefined),
      rule: asText(y.formation_rule || y.formation),
      effect: asText(y.effects),
      severity: asText(y.severity),
    });
  });

  (report?.nabhasaYoga?.yogas ?? []).forEach((y: any, i: number) => {
    out.push({
      key: `nabhasa-${i}`,
      name: asText(y.category ? `${y.name} (${y.category})` : y.name) ?? 'Yoga',
      group: 'நபஸ யோகம் (Nabhasa Yoga)',
      ref: asText(y.verse ? `BPHS 35.${y.verse}` : undefined),
    });
  });

  return out;
}

function normalizeDoshas(report: any): NormalizedDosha[] {
  return (report?.doshas?.doshas ?? []).map((d: any, i: number) => ({
    key: d.doshaKey || `dosha-${i}`,
    name: asText(d.name) ?? 'Dosha',
    ref: d.chapter === 83 ? 'BPHS அத்தியாயம் 83' : 'பாரம்பரிய விதி (traditional rule)',
    rule: asText(d.formation_rule),
    effect: asText(d.effects),
    severity: asText(d.severity),
    remedies: asText(d.remedies),
  }));
}

export function YogasAndDoshasRenderer({ report }: YogasAndDoshasRendererProps) {
  const yogas = normalizeYogas(report);
  const doshas = normalizeDoshas(report);
  const groups = Array.from(new Set(yogas.map((y) => y.group)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-soft/30 to-orange-soft/30 rounded-lg p-6 border-l-4 border-amber">
        <h3 className="text-xl font-bold text-ink mb-2">யோகங்கள் மற்றும் தோஷங்கள் (Yogas &amp; Doshas)</h3>
        <p className="text-sm text-ink-soft">
          இந்த ஜாதகத்தில் உண்மையாகக் கணக்கிடப்பட்ட யோக/தோஷ சேர்க்கைகள் — ஒவ்வொன்றும் formation rule மற்றும் ஆதாரத்துடன்.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="bg-green-100 rounded-lg p-4 border border-green-300">
          <div className="text-xs text-green-900 mb-1">Auspicious Yogas</div>
          <div className="text-3xl font-bold text-green">{yogas.length}</div>
          <div className="text-xs text-green-900">இந்த ஜாதகத்தில் பொருந்தியவை</div>
        </div>
        <div className="bg-red-100 rounded-lg p-4 border border-red-300">
          <div className="text-xs text-red-900 mb-1">Doshas</div>
          <div className="text-3xl font-bold text-red">{doshas.length}</div>
          <div className="text-xs text-red-900">இந்த ஜாதகத்தில் பொருந்தியவை</div>
        </div>
      </div>

      {/* Auspicious Yogas, grouped by calculation engine */}
      <div>
        <h4 className="font-semibold text-green mb-3">🟢 யோகங்கள் (Yogas)</h4>
        {groups.length === 0 ? (
          <div className="bg-surface-soft rounded-lg p-4 border border-line text-sm text-ink-soft">
            இந்த ஜாதகத்தில் சோதிக்கப்பட்ட யோக சேர்க்கைகள் எதுவும் பொருந்தவில்லை.
          </div>
        ) : (
          <div className="space-y-5">
            {groups.map((group) => (
              <div key={group}>
                <div className="text-xs font-semibold text-ink-soft uppercase tracking-wide mb-2">{group}</div>
                <div className="space-y-3">
                  {yogas
                    .filter((y) => y.group === group)
                    .map((yoga) => (
                      <div key={yoga.key} className="bg-green-50 rounded-lg p-4 border-2 border-green-300">
                        <div className="flex items-start justify-between mb-2 gap-3">
                          <div className="font-semibold text-ink">{yoga.name}</div>
                          {yoga.ref && (
                            <div className="text-xs text-ink-soft whitespace-nowrap">{yoga.ref}</div>
                          )}
                        </div>
                        <div className="space-y-1 text-sm">
                          {yoga.rule && (
                            <p>
                              <span className="font-semibold text-ink">Condition:</span> {yoga.rule}
                            </p>
                          )}
                          {yoga.effect && (
                            <p>
                              <span className="font-semibold text-ink">Effect:</span>{' '}
                              <span className="text-green">{yoga.effect}</span>
                            </p>
                          )}
                          {yoga.severity && (
                            <p>
                              <span className="font-semibold text-ink">Strength:</span> {yoga.severity}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Doshas */}
      <div>
        <h4 className="font-semibold text-red mb-3">🔴 தோஷங்கள் (Doshas)</h4>
        {doshas.length === 0 ? (
          <div className="bg-surface-soft rounded-lg p-4 border border-line text-sm text-ink-soft">
            இந்த ஜாதகத்தில் சோதிக்கப்பட்ட தோஷங்கள் எதுவும் பொருந்தவில்லை.
          </div>
        ) : (
          <div className="space-y-3">
            {doshas.map((dosha) => (
              <div key={dosha.key} className="bg-red-50 rounded-lg p-4 border-2 border-red-300">
                <div className="flex items-start justify-between mb-2 gap-3">
                  <div className="font-semibold text-ink">{dosha.name}</div>
                  <div className="text-xs text-ink-soft whitespace-nowrap">{dosha.ref}</div>
                </div>
                <div className="space-y-1 text-sm">
                  {dosha.rule && (
                    <p>
                      <span className="font-semibold text-ink">Condition:</span> {dosha.rule}
                    </p>
                  )}
                  {dosha.effect && (
                    <p>
                      <span className="font-semibold text-ink">Effect:</span>{' '}
                      <span className="text-red">{dosha.effect}</span>
                    </p>
                  )}
                  {dosha.severity && (
                    <p>
                      <span className="font-semibold text-ink">Severity:</span> {dosha.severity}
                    </p>
                  )}
                  {dosha.remedies && (
                    <p>
                      <span className="font-semibold text-ink">Remedy:</span> {dosha.remedies}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Technical Note */}
      <div className="bg-surface-soft rounded-lg p-3 border border-line text-xs text-ink-soft">
        <div className="font-semibold text-ink mb-1">ℹ️ ஆதாரம்</div>
        <p>
          ராஜயோகம் (BPHS 39.6-48) · நபஸ யோகம் (BPHS 35, formation rule மட்டும் — predictive
          உரை மொழிபெயர்க்கப்படவில்லை) · சந்திர-சூரிய/பஞ்ச மகாபுருஷ/தன/சிறப்பு யோகம் (BPHS 41) ·
          தோஷங்கள் — Pitra/Matri/Sarpa/Kalakarma/Bhuta/Bhrata/Matula/Brahmanda (BPHS அத்தியாயம் 83),
          Mangal &amp; Kala Sarpa (பாரம்பரிய விதி, classical page-citation நிலுவையில்). ஒவ்வொரு
          சேர்க்கையும் இந்தச் சொந்த ஜாதகத்திற்கே தனியாகக் கணக்கிடப்பட்டது — முன்கூட்டியே
          தீர்மானிக்கப்பட்ட பட்டியல் அல்ல.
        </p>
      </div>
    </div>
  );
}
