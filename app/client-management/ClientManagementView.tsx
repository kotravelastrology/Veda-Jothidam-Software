'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  saveChart, updateChart, listCharts, searchCharts, deleteChart, listChartRevisions,
} from '../library/actions';
import type { BirthFormInput } from '../report/actions';

interface Client {
  profileId: string;
  revision: number;
  name: string;
  gender: string | null;
  email: string | null;
  phone: string | null;
  birthDate: string | null;
  placeName: string | null;
  note: string | null;
  updatedAt?: string;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  gender: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  latitude: string;
  longitude: string;
  utcOffsetMinutes: string;
  note: string;
}

const EMPTY_FORM: FormState = {
  name: '', email: '', phone: '', gender: '',
  birthDate: '', birthTime: '', birthPlace: '',
  latitude: '13.0827', longitude: '80.2707', utcOffsetMinutes: '330',
  note: '',
};

/** The library stores a full birth input, so a saved client can be recomputed
 *  later without re-entering anything. */
function toBirthInput(form: FormState): BirthFormInput {
  const [year, month, day] = form.birthDate.split('-').map(Number);
  const [hour, minute] = form.birthTime.split(':').map(Number);
  return {
    name: form.name,
    gender: form.gender || 'other',
    year, month, day,
    hour: hour || 0,
    minute: minute || 0,
    ianaTimeZone: 'Asia/Kolkata',
    utcOffsetMinutes: Number(form.utcOffsetMinutes),
    latitude: Number(form.latitude),
    longitude: Number(form.longitude),
    placeName: form.birthPlace,
  };
}

export default function ClientManagementView() {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [revisions, setRevisions] = useState<Record<string, number>>({});

  const refresh = useCallback(async (term: string) => {
    setLoading(true);
    setError(null);
    try {
      const rows = term.trim() ? await searchCharts(term) : await listCharts();
      setClients(rows);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(''); }, [refresh]);

  // Search runs in SQLite (FTS5), so it is debounced rather than filtering a
  // local array — the list is not all loaded client-side.
  useEffect(() => {
    const t = setTimeout(() => { refresh(searchTerm); }, 250);
    return () => clearTimeout(t);
  }, [searchTerm, refresh]);

  const resetForm = () => { setForm(EMPTY_FORM); setEditing(null); setShowForm(false); };

  const submit = async () => {
    if (!form.name.trim()) { setError('Name is required'); return; }
    if (!form.birthDate) { setError('Birth date is required'); return; }
    setBusy(true);
    setError(null);
    try {
      if (editing) {
        await updateChart(editing.profileId, {
          name: form.name,
          gender: form.gender || undefined,
          email: form.email || undefined,
          phone: form.phone || undefined,
          note: form.note || undefined,
          input: toBirthInput(form),
        });
      } else {
        await saveChart({
          name: form.name,
          gender: form.gender || undefined,
          email: form.email || undefined,
          phone: form.phone || undefined,
          note: form.note || undefined,
          input: toBirthInput(form),
        });
      }
      resetForm();
      await refresh(searchTerm);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const beginEdit = (client: Client) => {
    setEditing(client);
    setShowForm(true);
    setForm({
      ...EMPTY_FORM,
      name: client.name,
      email: client.email ?? '',
      phone: client.phone ?? '',
      gender: client.gender ?? '',
      birthDate: client.birthDate ?? '',
      birthPlace: client.placeName ?? '',
      note: client.note ?? '',
    });
  };

  const remove = async (client: Client) => {
    if (!confirm(`Delete ${client.name}? This removes all ${client.revision} revision(s).`)) return;
    setBusy(true);
    try {
      await deleteChart(client.profileId);
      await refresh(searchTerm);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const showHistory = async (client: Client) => {
    const list = await listChartRevisions(client.profileId);
    setRevisions((prev) => ({ ...prev, [client.profileId]: list.length }));
    alert(list.map((r: any) => `v${r.revision} · ${r.name} · ${r.birthDate} · ${r.createdAt.slice(0, 10)}`).join('\n'));
  };

  return (
    <main className="min-h-screen p-6 max-w-7xl mx-auto">
      <header className="mb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">
          Client Management
        </p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">
          வாடிக்கையாளர் நிர்வாகம்
        </h1>
        <p className="text-sm text-ink-soft mt-1">
          உள்ளூர் ஜாதக நூலகத்தில் சேமிக்கப்படுகிறது — திருத்தங்கள் பழைய பதிப்பை அழிக்காமல் புதிய revision ஆக பதிவாகும்.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-info/10 border border-info rounded-lg p-4">
          <p className="text-xs font-semibold text-info uppercase mb-1">சேமிக்கப்பட்டவர்கள்</p>
          <p className="text-3xl font-bold text-info tabular-nums">{clients.length}</p>
        </div>
        <div className="bg-green/10 border border-green rounded-lg p-4">
          <p className="text-xs font-semibold text-green uppercase mb-1">மொத்த Revisions</p>
          <p className="text-3xl font-bold text-green tabular-nums">
            {clients.reduce((sum, c) => sum + c.revision, 0)}
          </p>
        </div>
      </div>

      <div className="bg-surface border border-line rounded-2xl p-5 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="பெயர், இடம், மின்னஞ்சல், தொலைபேசி, குறிப்பு…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 bg-ink-soft/10 border border-line rounded-lg"
          />
          <button
            onClick={() => (showForm ? resetForm() : setShowForm(true))}
            className="px-4 py-2 bg-saffron text-ink rounded-lg font-medium hover:bg-saffron/90"
          >
            {showForm ? 'ரத்து' : '+ புதியவர்'}
          </button>
        </div>

        {showForm && (
          <div className="bg-info/5 border border-info/20 rounded-lg p-4">
            <h3 className="font-semibold text-ink mb-4">
              {editing ? `திருத்து — ${editing.name} (v${editing.revision} → v${editing.revision + 1})` : 'புதிய வாடிக்கையாளர்'}
            </h3>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              {([
                ['name', 'பெயர் *', 'text'],
                ['email', 'மின்னஞ்சல்', 'email'],
                ['phone', 'தொலைபேசி', 'tel'],
                ['birthDate', 'பிறந்த தேதி *', 'date'],
                ['birthTime', 'பிறந்த நேரம்', 'time'],
                ['birthPlace', 'பிறந்த இடம்', 'text'],
                ['latitude', 'அட்சரேகை', 'number'],
                ['longitude', 'தீர்க்கரேகை', 'number'],
              ] as Array<[keyof FormState, string, string]>).map(([key, label, type]) => (
                <label key={key}>
                  <span className="block text-xs font-medium text-ink-soft mb-1">{label}</span>
                  <input
                    type={type}
                    step={type === 'number' ? '0.0001' : undefined}
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded text-sm"
                  />
                </label>
              ))}
              <label>
                <span className="block text-xs font-medium text-ink-soft mb-1">பாலினம்</span>
                <select
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded text-sm"
                >
                  <option value="">—</option>
                  <option value="male">ஆண்</option>
                  <option value="female">பெண்</option>
                  <option value="other">மற்றவை</option>
                </select>
              </label>
              <label className="sm:col-span-2">
                <span className="block text-xs font-medium text-ink-soft mb-1">குறிப்பு</span>
                <textarea
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded text-sm"
                />
              </label>
            </div>
            <div className="flex gap-2">
              <button onClick={submit} disabled={busy}
                className="px-4 py-2 bg-green text-white rounded font-medium text-sm disabled:opacity-50">
                {busy ? 'சேமிக்கிறது…' : editing ? '✓ புதிய revision சேமி' : '+ சேமி'}
              </button>
              <button onClick={resetForm}
                className="px-4 py-2 bg-line/20 text-ink rounded font-medium text-sm">
                ரத்து
              </button>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-rose/10 border border-rose rounded-lg p-4 mb-6 text-sm text-rose">{error}</div>
      )}

      <div className="space-y-3">
        {loading && <p className="text-sm text-ink-soft text-center py-8">ஏற்றுகிறது…</p>}

        {!loading && clients.map((client) => (
          <div key={client.profileId}
            className="bg-surface border border-line rounded-lg p-4 hover:border-saffron/50 transition">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-ink text-lg">{client.name}</h3>
                  <span className="px-2 py-0.5 bg-info/10 text-info rounded text-xs font-mono">
                    v{client.revision}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-ink-soft">
                  {client.email && <span>{client.email}</span>}
                  {client.phone && <span>{client.phone}</span>}
                  {client.birthDate && <span className="tabular-nums">{client.birthDate}</span>}
                  {client.placeName && <span>{client.placeName}</span>}
                </div>
                {client.note && <p className="text-sm text-ink-soft mt-2 italic">{client.note}</p>}
              </div>
              <div className="flex gap-2">
                {client.revision > 1 && (
                  <button onClick={() => showHistory(client)}
                    className="px-3 py-2 bg-ink-soft/10 text-ink-soft rounded font-medium text-sm">
                    வரலாறு
                  </button>
                )}
                <button onClick={() => beginEdit(client)}
                  className="px-3 py-2 bg-info/10 text-info rounded font-medium text-sm">
                  திருத்து
                </button>
                <button onClick={() => remove(client)} disabled={busy}
                  className="px-3 py-2 bg-rose/10 text-rose rounded font-medium text-sm disabled:opacity-50">
                  நீக்கு
                </button>
              </div>
            </div>
          </div>
        ))}

        {!loading && clients.length === 0 && (
          <div className="text-center py-12 text-ink-soft">
            <p className="text-sm">
              {searchTerm ? 'பொருந்தும் வாடிக்கையாளர் இல்லை.' : 'இன்னும் யாரும் சேமிக்கப்படவில்லை. "+ புதியவர்" கிளிக் செய்யுங்கள்.'}
            </p>
          </div>
        )}
      </div>

      <footer className="mt-12 pt-6 border-t border-line text-xs text-ink-soft text-center">
        <p>
          உள்ளூர் SQLite நூலகம் — account தேவையில்லை, offline வேலை செய்யும்.
          திருத்தங்கள் revision ஆகப் பதிவாகும்; பழைய பதிப்புகள் அழிக்கப்படுவதில்லை.
        </p>
      </footer>
    </main>
  );
}
