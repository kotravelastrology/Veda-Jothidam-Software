'use client';

import { useEffect, useRef, useState } from 'react';
import { shareText, whatsappLink, composeShareText, type ShareInput, type ShareOutcome } from './share';

/**
 * A "share" button: the phone's share sheet, or the text copied with a short confirmation. If neither works the confirmation line
 * offers a WhatsApp link with the text in it.
 */
export function ShareButton({ input, label = 'பகிர்', className = '' }: { input: ShareInput; label?: string; className?: string }) {
  const [outcome, setOutcome] = useState<ShareOutcome | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const go = async () => {
    const result = await shareText(input);
    setOutcome(result);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setOutcome(null), result === 'failed' ? 8000 : 2600);
  };

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={go}
        className={`inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-1 text-xs hover:border-saffron ${className}`}
        data-testid="share-button"
      >
        📤 {label}
      </button>
      <span role="status" aria-live="polite" className="text-[11px] text-ink-soft">
        {outcome === 'copied' && '✓ நகலெடுக்கப்பட்டது'}
        {outcome === 'failed' && (
          <a href={whatsappLink(composeShareText(input))} target="_blank" rel="noopener noreferrer" className="text-saffron underline">WhatsApp-இல் அனுப்பு</a>
        )}
      </span>
    </span>
  );
}
