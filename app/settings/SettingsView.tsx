'use client';

import { useState } from 'react';

export default function SettingsView() {
  const [settings, setSettings] = useState({
    language: 'tamil',
    theme: 'light',
    ayanamsa: 'lahiri',
    timezone: 'Asia/Kolkata',
    dateFormat: 'dd-mm-yyyy',
    timeFormat: '24h',
    notifications: {
      followUpReminders: true,
      dashaChanges: true,
      transits: true,
      email: true,
    },
    display: {
      colorCodedStrength: true,
      showTamilNames: true,
      compactView: false,
      autoCalculate: true,
    },
    calculation: {
      houseSystem: 'placidus',
      retrogradeDisplay: true,
      aspectOrb: '8',
    },
    profile: {
      name: 'Astrologer Name',
      email: 'astrologer@example.com',
      phone: '+1-555-0000',
      licenseNumber: 'LIC-001-2024',
    },
  });

  const [activeTab, setActiveTab] = useState<'general' | 'display' | 'calculation' | 'notifications' | 'profile'>('general');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Save settings (would send to backend)
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <main className="min-h-screen p-6 max-w-6xl mx-auto">
      {/* Header */}
      <header className="mb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">
          Settings
        </p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">
          விருப்பங்கள் (Settings)
        </h1>
        <p className="text-sm text-ink-soft mt-1">
          விருப்பங்கள் மற்றும் அமைப்புகள் கட்டுப்பாடு. Customize your application preferences.
        </p>
      </header>

      {/* Tabs */}
      <div className="bg-surface border border-line rounded-2xl mb-6">
        <div className="flex flex-wrap border-b border-line">
          {(['general', 'display', 'calculation', 'notifications', 'profile'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-3 font-medium transition border-b-2 text-sm ${
                activeTab === tab
                  ? 'border-saffron text-saffron'
                  : 'border-transparent text-ink-soft hover:text-ink'
              }`}
            >
              {tab === 'general' && '⚙️ General'}
              {tab === 'display' && '🎨 Display'}
              {tab === 'calculation' && '🔢 Calculation'}
              {tab === 'notifications' && '🔔 Notifications'}
              {tab === 'profile' && '👤 Profile'}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-2">Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded"
                >
                  <option value="tamil">Tamil (தமிழ்)</option>
                  <option value="english">English</option>
                  <option value="hindi">Hindi (हिन्दी)</option>
                  <option value="kannada">Kannada (ಕನ್ನಡ)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-2">Theme</label>
                <div className="flex gap-4">
                  {['light', 'dark', 'auto'].map((theme) => (
                    <label key={theme} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="theme"
                        value={theme}
                        checked={settings.theme === theme}
                        onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-ink-soft capitalize">{theme}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-2">Ayanamsa</label>
                <select
                  value={settings.ayanamsa}
                  onChange={(e) => setSettings({ ...settings, ayanamsa: e.target.value })}
                  className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded"
                >
                  <option value="lahiri">Lahiri</option>
                  <option value="fagan">Fagan</option>
                  <option value="krishnamurti">Krishnamurti</option>
                  <option value="raman">Raman</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-2">Timezone</label>
                <input
                  type="text"
                  value={settings.timezone}
                  onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                  className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded"
                />
              </div>
            </div>
          )}

          {/* Display Settings */}
          {activeTab === 'display' && (
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded hover:bg-info/5">
                  <input
                    type="checkbox"
                    checked={settings.display.colorCodedStrength}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        display: { ...settings.display, colorCodedStrength: e.target.checked },
                      })
                    }
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-medium text-ink">Color-Coded Strength</p>
                    <p className="text-xs text-ink-soft">Show strength as green/orange/red</p>
                  </div>
                </label>
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded hover:bg-info/5">
                  <input
                    type="checkbox"
                    checked={settings.display.showTamilNames}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        display: { ...settings.display, showTamilNames: e.target.checked },
                      })
                    }
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-medium text-ink">Show Tamil Names</p>
                    <p className="text-xs text-ink-soft">Display Tamil alongside English</p>
                  </div>
                </label>
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded hover:bg-info/5">
                  <input
                    type="checkbox"
                    checked={settings.display.compactView}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        display: { ...settings.display, compactView: e.target.checked },
                      })
                    }
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-medium text-ink">Compact View</p>
                    <p className="text-xs text-ink-soft">Minimize white space and margins</p>
                  </div>
                </label>
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded hover:bg-info/5">
                  <input
                    type="checkbox"
                    checked={settings.display.autoCalculate}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        display: { ...settings.display, autoCalculate: e.target.checked },
                      })
                    }
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-medium text-ink">Auto Calculate</p>
                    <p className="text-xs text-ink-soft">Automatically compute when data changes</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Calculation Settings */}
          {activeTab === 'calculation' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-2">House System</label>
                <select
                  value={settings.calculation.houseSystem}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      calculation: { ...settings.calculation, houseSystem: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded"
                >
                  <option value="placidus">Placidus</option>
                  <option value="koch">Koch</option>
                  <option value="equal">Equal House</option>
                  <option value="whole">Whole Sign</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded hover:bg-info/5">
                  <input
                    type="checkbox"
                    checked={settings.calculation.retrogradeDisplay}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        calculation: { ...settings.calculation, retrogradeDisplay: e.target.checked },
                      })
                    }
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-medium text-ink">Show Retrograde Planets</p>
                    <p className="text-xs text-ink-soft">Mark planets in retrograde motion</p>
                  </div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-2">Aspect Orb (degrees)</label>
                <input
                  type="number"
                  value={settings.calculation.aspectOrb}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      calculation: { ...settings.calculation, aspectOrb: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded"
                />
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded hover:bg-info/5">
                  <input
                    type="checkbox"
                    checked={settings.notifications.followUpReminders}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, followUpReminders: e.target.checked },
                      })
                    }
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-medium text-ink">Follow-up Reminders</p>
                    <p className="text-xs text-ink-soft">Notify about scheduled follow-ups</p>
                  </div>
                </label>
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded hover:bg-info/5">
                  <input
                    type="checkbox"
                    checked={settings.notifications.dashaChanges}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, dashaChanges: e.target.checked },
                      })
                    }
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-medium text-ink">Dasha Changes</p>
                    <p className="text-xs text-ink-soft">Alert when dasha changes for clients</p>
                  </div>
                </label>
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded hover:bg-info/5">
                  <input
                    type="checkbox"
                    checked={settings.notifications.transits}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, transits: e.target.checked },
                      })
                    }
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-medium text-ink">Transit Alerts</p>
                    <p className="text-xs text-ink-soft">Notify about significant transits</p>
                  </div>
                </label>
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded hover:bg-info/5">
                  <input
                    type="checkbox"
                    checked={settings.notifications.email}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, email: e.target.checked },
                      })
                    }
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-medium text-ink">Email Notifications</p>
                    <p className="text-xs text-ink-soft">Send notifications via email</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-2">Name</label>
                <input
                  type="text"
                  value={settings.profile.name}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      profile: { ...settings.profile, name: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-2">Email</label>
                <input
                  type="email"
                  value={settings.profile.email}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      profile: { ...settings.profile, email: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-2">Phone</label>
                <input
                  type="tel"
                  value={settings.profile.phone}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      profile: { ...settings.profile, phone: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-2">License Number</label>
                <input
                  type="text"
                  value={settings.profile.licenseNumber}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      profile: { ...settings.profile, licenseNumber: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-4">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-saffron text-ink rounded-lg font-semibold hover:bg-saffron/90 transition"
        >
          💾 Save Settings
        </button>
        <button className="px-6 py-2 bg-line/20 text-ink rounded-lg font-semibold hover:bg-line/30 transition">
          ↩️ Reset to Defaults
        </button>
      </div>

      {/* Confirmation */}
      {saved && (
        <div className="mt-4 p-4 bg-green/10 border border-green rounded-lg text-sm text-green">
          ✓ Settings saved successfully
        </div>
      )}

      <footer className="mt-12 pt-6 border-t border-line text-xs text-ink-soft text-center">
        <p>விருப்பங்கள் — உங்கள் ஆராய்ச்சி பரிசரணை மற்றும் பணிமுறை தயாரிப்பு.</p>
      </footer>
    </main>
  );
}
