'use client';

import { SettingsForm, useSettings } from '@/src/ui/SettingsPanel';

/** The settings as a page: the same form as the ⚙️ panel (src/ui/SettingsPanel.tsx), so each setting has one place. */
export default function SettingsPageView() {
  const { resetSettings } = useSettings();
  return (
    <main className="min-h-screen p-4 sm:p-6 max-w-2xl mx-auto">
      <header className="mb-5">
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">⚙️ அமைப்புகள்</h1>
        <p className="text-sm text-ink-soft mt-1">ஒவ்வொரு மாற்றமும் உடனே சேமிக்கப்படும்; எல்லாப் பக்கங்களும் இதையே படிக்கின்றன. · Each change is saved at once and every page reads it.</p>
      </header>
      <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
        <SettingsForm />
      </div>
      <div className="mt-4 text-right">
        <button onClick={resetSettings} className="px-4 py-2 text-sm font-medium rounded-lg border border-line text-ink hover:bg-ink-soft/10 transition-colors">
          இயல்புநிலை · Reset to defaults
        </button>
      </div>
    </main>
  );
}
