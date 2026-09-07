'use client';

interface YogasAndDoshasRendererProps {
  report: any;
}

interface Yoga {
  name: string;
  tamil: string;
  type: 'yoga' | 'dosha';
  description: string;
  effect: string;
  planets?: string[];
}

export function YogasAndDoshasRenderer({ report }: YogasAndDoshasRendererProps) {
  // Mock data - will be replaced with actual yoga calculations
  const yogas: Yoga[] = [
    {
      name: 'Gajakesari Yoga',
      tamil: 'கஜகேசரி யோகம்',
      type: 'yoga',
      description: 'Jupiter and Moon in benefic relationship',
      effect: 'Intelligence, wisdom, and prosperity',
      planets: ['Jupiter', 'Moon'],
    },
    {
      name: 'Rajayoga',
      tamil: 'ராஜயோகம்',
      type: 'yoga',
      description: 'Lords of 1st and 10th house together or aspecting',
      effect: 'Authority, power, and success',
      planets: ['Sun', 'Saturn'],
    },
    {
      name: 'Dhanyoga',
      tamil: 'தன்யயோகம்',
      type: 'yoga',
      description: 'Lords of 2nd and 11th house in relationship',
      effect: 'Wealth, property, and financial gains',
      planets: ['Venus', 'Jupiter'],
    },
  ];

  const doshas: Yoga[] = [
    {
      name: 'Mangal Dosha',
      tamil: 'மங்கள தோஷம்',
      type: 'dosha',
      description: 'Mars in certain houses without beneficial aspects',
      effect: 'Delays in marriage and relationships',
      planets: ['Mars'],
    },
    {
      name: 'Pitra Dosha',
      tamil: 'பித்ர தோஷம்',
      type: 'dosha',
      description: 'Ancestral debts affecting current life',
      effect: 'Obstacles in career and family',
      planets: ['Sun', 'Saturn'],
    },
    {
      name: 'Kaal Sarp Dosha',
      tamil: 'காலசர்ப தோஷம்',
      type: 'dosha',
      description: 'All planets between Rahu and Ketu nodes',
      effect: 'Life cycles with struggles and growth periods',
      planets: ['Rahu', 'Ketu'],
    },
  ];

  const totalYogas = yogas.length;
  const totalDoshas = doshas.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-soft/30 to-orange-soft/30 rounded-lg p-6 border-l-4 border-amber">
        <h3 className="text-xl font-bold text-ink mb-2">யோகங்கள் மற்றும் தோஷங்கள் (Yogas & Doshas)</h3>
        <p className="text-sm text-ink-soft">
          Auspicious combinations (Yogas) and inauspicious influences (Doshas) in the birth chart. These special planetary arrangements affect life outcomes significantly.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="bg-green-100 rounded-lg p-4 border border-green-300">
          <div className="text-xs text-green-900 mb-1">Auspicious Yogas</div>
          <div className="text-3xl font-bold text-green">{totalYogas}</div>
          <div className="text-xs text-green-900">Favorable combinations</div>
        </div>
        <div className="bg-red-100 rounded-lg p-4 border border-red-300">
          <div className="text-xs text-red-900 mb-1">Doshas</div>
          <div className="text-3xl font-bold text-red">{totalDoshas}</div>
          <div className="text-xs text-red-900">Challenging influences</div>
        </div>
        <div className="bg-amber-100 rounded-lg p-4 border border-amber-300">
          <div className="text-xs text-amber-900 mb-1">Net Effect</div>
          <div className="text-2xl font-bold text-amber">Balanced</div>
          <div className="text-xs text-amber-900">Growth with lessons</div>
        </div>
      </div>

      {/* Auspicious Yogas */}
      <div>
        <h4 className="font-semibold text-green mb-3">🟢 Auspicious Yogas (Subyogam)</h4>
        <div className="space-y-3">
          {yogas.map((yoga, idx) => (
            <div key={idx} className="bg-green-50 rounded-lg p-4 border-2 border-green-300">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-semibold text-ink">{yoga.name}</div>
                  <div className="text-sm text-ink-soft font-[family-name:var(--font-tamil-serif)]">
                    {yoga.tamil}
                  </div>
                </div>
                <div className="text-2xl">✨</div>
              </div>
              <div className="space-y-2 text-sm">
                <p><span className="font-semibold text-ink">Condition:</span> {yoga.description}</p>
                <p><span className="font-semibold text-ink">Effect:</span> <span className="text-green">{yoga.effect}</span></p>
                {yoga.planets && (
                  <p><span className="font-semibold text-ink">Planets:</span> {yoga.planets.join(', ')}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inauspicious Doshas */}
      <div>
        <h4 className="font-semibold text-red mb-3">🔴 Inauspicious Doshas (Dushta)</h4>
        <div className="space-y-3">
          {doshas.map((dosha, idx) => (
            <div key={idx} className="bg-red-50 rounded-lg p-4 border-2 border-red-300">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-semibold text-ink">{dosha.name}</div>
                  <div className="text-sm text-ink-soft font-[family-name:var(--font-tamil-serif)]">
                    {dosha.tamil}
                  </div>
                </div>
                <div className="text-2xl">⚠️</div>
              </div>
              <div className="space-y-2 text-sm">
                <p><span className="font-semibold text-ink">Condition:</span> {dosha.description}</p>
                <p><span className="font-semibold text-ink">Effect:</span> <span className="text-red">{dosha.effect}</span></p>
                {dosha.planets && (
                  <p><span className="font-semibold text-ink">Planets Involved:</span> {dosha.planets.join(', ')}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Remedies Guide */}
      <div className="bg-gradient-to-r from-blue-soft/10 to-indigo-soft/10 rounded-lg p-4 border-l-4 border-blue">
        <div className="text-sm">
          <div className="font-semibold text-ink mb-3">🛡️ Dosha Remedies & Mitigation</div>
          <div className="space-y-2 text-ink-soft text-xs">
            <div>
              <span className="font-semibold text-ink">For Mangal Dosha:</span>
              <p>• Worship Mars with discipline and courage</p>
              <p>• Wear red coral (Moonga) as advised</p>
              <p>• Perform Mars propitiation rituals (Mangala Homam)</p>
            </div>
            <div className="mt-2">
              <span className="font-semibold text-ink">For Pitra Dosha:</span>
              <p>• Perform Pitra Shanti rituals for ancestors</p>
              <p>• Recite Mahamrityunjaya Mantra</p>
              <p>• Engage in charitable acts and social service</p>
            </div>
            <div className="mt-2">
              <span className="font-semibold text-ink">For Kaal Sarp Dosha:</span>
              <p>• Perform Kaal Sarp Puja with qualified priests</p>
              <p>• Meditate on spiritual practices</p>
              <p>• Wear Rahu-Ketu remedies as per astrologer guidance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Interpretation Guide */}
      <div className="bg-gradient-to-r from-green-soft/10 to-teal-soft/10 rounded-lg p-4 border-l-4 border-green">
        <div className="text-sm">
          <div className="font-semibold text-ink mb-2">📖 Understanding Yogas & Doshas</div>
          <div className="text-ink-soft space-y-2">
            <p>• Yogas are auspicious combinations that grant specific blessings and opportunities</p>
            <p>• Doshas are challenging influences that require conscious awareness and effort to overcome</p>
            <p>• A chart with multiple yogas but also doshas is considered balanced</p>
            <p>• The strength of planets involved modifies yoga/dosha effects significantly</p>
            <p>• Remedies are not about "fixing" doshas but about harmonizing their energies</p>
            <p>• Spiritual practices amplify the benefits of yogas and mitigate dosha effects</p>
          </div>
        </div>
      </div>

      {/* Yoga Classification */}
      <div>
        <h4 className="font-semibold text-ink mb-3">யோக வகைப்பாடு (Yoga Classification)</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-surface-soft rounded-lg p-4 border border-line">
            <div className="font-semibold text-ink mb-2">राज Yogas</div>
            <div className="text-xs text-ink-soft">Authority, power, and rulership. Indicates success in worldly endeavors.</div>
          </div>
          <div className="bg-surface-soft rounded-lg p-4 border border-line">
            <div className="font-semibold text-ink mb-2">धन Yogas</div>
            <div className="text-xs text-ink-soft">Wealth and prosperity. Financial gains and material success.</div>
          </div>
          <div className="bg-surface-soft rounded-lg p-4 border border-line">
            <div className="font-semibold text-ink mb-2">विवाह Yogas</div>
            <div className="text-xs text-ink-soft">Marriage and relationships. Happy partnerships and family life.</div>
          </div>
        </div>
      </div>

      {/* Technical Note */}
      <div className="bg-surface-soft rounded-lg p-3 border border-line text-xs text-ink-soft">
        <div className="font-semibold text-ink mb-1">ℹ️ Complex Yoga Calculation</div>
        <p>Yoga identification requires analyzing multiple planetary combinations, house lords, sign placements, and dasha periods. This simplified view highlights major yogas present in the chart.</p>
      </div>
    </div>
  );
}
