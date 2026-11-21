'use client';

import { useState } from 'react';
import { promptInstall, usePwa } from './pwaStore';

/**
 * "Install the app": the browser's own install dialog where it offers one (Chrome, Edge, Android), and on an iPhone or iPad, which has
 * no such dialog, the two steps that add the program to the home screen. Nothing is shown once the program runs as an installed app.
 */
export function InstallApp({ className = '' }: { className?: string }) {
  const { installable, installed, iosHint } = usePwa();
  const [steps, setSteps] = useState(false);
  if (installed) return null;

  if (installable) {
    return (
      <button
        type="button"
        onClick={() => { void promptInstall(); }}
        className={`inline-flex items-center gap-1.5 rounded-full border border-saffron/50 bg-saffron/10 px-3.5 py-1.5 text-sm font-semibold text-saffron hover:bg-saffron/20 ${className}`}
        data-testid="install-app"
      >
        📲 ஆப்பாக நிறுவு
      </button>
    );
  }
  if (iosHint) {
    return (
      <div className={className} data-testid="install-app-ios">
        <button
          type="button"
          onClick={() => setSteps((s) => !s)}
          aria-expanded={steps}
          className="inline-flex items-center gap-1.5 rounded-full border border-saffron/50 bg-saffron/10 px-3.5 py-1.5 text-sm font-semibold text-saffron hover:bg-saffron/20"
        >
          📲 முகப்புத் திரையில் சேர்
        </button>
        {steps && (
          <p className="mt-2 max-w-xs rounded-xl border border-line bg-surface p-3 text-xs leading-relaxed text-ink-soft">
            Safari-இன் கீழ்ப் பட்டியில் <strong className="text-ink">பகிர் (⬆️)</strong> பொத்தானை அழுத்தி, <strong className="text-ink">"முகப்புத் திரையில் சேர்"</strong> என்பதைத் தேர்ந்தெடுக்கவும்.
          </p>
        )}
      </div>
    );
  }
  return null;
}
