/** Colours and labels shared by the worksheet's cells. */

/** Planet colours, close to PL9's (Mars red, Mercury green, Jupiter orange, Venus magenta, Saturn blue). */
export const PLANET_COLOR: Record<string, string> = {
  Su: '#b45309', Mo: '#374151', Ma: '#dc2626', Me: '#15803d', Ju: '#d97706', Ve: '#c026d3', Sa: '#2563eb',
  Ra: '#6b7280', Ke: '#6b7280', As: '#7c2d12', Gk: '#78716c',
};

export const PLANET_TA: Record<string, string> = {
  Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு', Venus: 'சுக்கிரன்',
  Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது', Lagna: 'லக்னம்',
};

/** Dignity, in Tamil, best to worst, with a tone for its colour. */
export const DIGNITY_TA: Record<string, { label: string; tone: 'good' | 'ok' | 'bad' }> = {
  exalted: { label: 'உச்சம்', tone: 'good' },
  moolatrikona: { label: 'மூலத்ரிகோணம்', tone: 'good' },
  own: { label: 'ஆட்சி', tone: 'good' },
  greatFriend: { label: 'அதி நட்பு', tone: 'good' },
  friend: { label: 'நட்பு', tone: 'good' },
  neutral: { label: 'சமம்', tone: 'ok' },
  enemy: { label: 'பகை', tone: 'bad' },
  greatEnemy: { label: 'அதி பகை', tone: 'bad' },
  debilitated: { label: 'நீசம்', tone: 'bad' },
};

export const TONE_CLASS = { good: 'text-teal', ok: 'text-ink-soft', bad: 'text-rose' } as const;

/** The divisional charts a chart cell can show. D2 (Hora) has no sign of its own, so it is not here. */
export const VARGA_OPTIONS: { value: string; label: string }[] = [
  { value: 'D1', label: 'ராசி (D1)' },
  { value: 'D3', label: 'திரேக்காணம் (D3)' },
  { value: 'D4', label: 'சதுர்த்தாம்சம் (D4)' },
  { value: 'D7', label: 'சப்தாம்சம் (D7)' },
  { value: 'D9', label: 'நவாம்சம் (D9) — துணை' },
  { value: 'D10', label: 'தசாம்சம் (D10)' },
  { value: 'D12', label: 'துவாதசாம்சம் (D12)' },
  { value: 'D16', label: 'ஷோடசாம்சம் (D16)' },
  { value: 'D20', label: 'விம்சாம்சம் (D20)' },
  { value: 'D24', label: 'சதுர்விம்சாம்சம் (D24)' },
  { value: 'D27', label: 'சப்தவிம்சாம்சம் (D27)' },
  { value: 'D30', label: 'த்ரிம்சாம்சம் (D30)' },
  { value: 'D40', label: 'கவேதாம்சம் (D40)' },
  { value: 'D45', label: 'அக்ஷவேதாம்சம் (D45)' },
  { value: 'D60', label: 'ஷஷ்ட்யம்சம் (D60)' },
];
