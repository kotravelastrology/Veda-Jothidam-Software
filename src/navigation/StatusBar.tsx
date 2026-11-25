'use client';

import { useEffect, useState } from 'react';
import { usePwa } from '../pwa/pwaStore';
import { useSettings } from '../ui/SettingsPanel';

const AYANAMSHA_TA: Record<string, string> = { lahiri: 'லாஹிரி', raman: 'ராமன்', krishnamurti: 'கிருஷ்ணமூர்த்தி', truecitra: 'உண்மைச் சித்திரை' };

/**
 * The bar at the foot of a larger screen (a phone has the bottom tabs instead): whether the browser has a network (navigator.onLine,
 * which does not tell whether the server answers), the settings
 * that every new chart starts from (Settings: ayanamsha and node), and the clock.
 */
export function StatusBar() {
  const [time, setTime] = useState<string>('');
  const { online, installed } = usePwa();
  const { settings } = useSettings();

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-GB', { hour12: false }));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-bar text-bar-ink border-t border-bar-ink/10 px-4 py-1 hidden md:flex items-center justify-between text-xs h-8 fixed bottom-0 left-0 right-0 print:hidden" role="status">
      <div className="flex items-center gap-4">
        <span className={online ? 'text-teal' : 'text-rose'} title={online ? 'இணைய இணைப்பு உள்ளது' : 'இணைய இணைப்பு இல்லை: முகப்பு, பணித்தாள், தசைப் பக்கங்கள் தயார் செய்த சாதனத்திலேயே கணக்கிடப்படும்; மற்றவற்றுக்கு இணைப்பு வேண்டும்'}>
          ● {online ? 'இணைப்பில்' : 'இணைப்பு இல்லை'}
        </span>
        <span className="text-bar-ink/60">திருக்கணிதம் · {AYANAMSHA_TA[settings.ayanamsha] ?? settings.ayanamsha} அயனாம்சம் · {settings.nodeType === 'true' ? 'உண்மை' : 'சராசரி'} ராகு-கேது</span>
        {installed && <span className="text-bar-ink/50">📲 ஆப்</span>}
      </div>
      <div className="text-bar-ink/70 tabular-nums">{time || '--:--:--'}</div>
    </div>
  );
}
