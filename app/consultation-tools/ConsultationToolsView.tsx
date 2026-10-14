'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  listCharts, recordConsultation, listConsultations, getConsultation,
  addJournalEvent, listJournalEvents, deleteJournalEvent,
  saveDraft, getDraft, discardDraft,
} from '../library/actions';

interface ChartRow { profileId: string; name: string; revision: number; birthDate: string | null }
interface ConsultationRow {
  consultationId: string; revision: number; snapshotId: string | null;
  occurredAt: string; summary: string | null;
}
interface JournalRow {
  eventId: string; eventDate: string; category: string | null; description: string;
}

const EMPTY_NOTE = { summary: '', notes: '', recommendations: '', remedies: '' };

export default function ConsultationToolsView() {
  const [clients, setClients] = useState<ChartRow[]>([]);
  const [selected, setSelected] = useState<ChartRow | null>(null);
  const [consultations, setConsultations] = useState<ConsultationRow[]>([]);
  const [journal, setJournal] = useState<JournalRow[]>([]);
  const [note, setNote] = useState(EMPTY_NOTE);
  const [draftNotice, setDraftNotice] = useState<string | null>(null);
  const [event, setEvent] = useState({ eventDate: '', category: '', description: '' });
  const [detail, setDetail] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const draftTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const draftKey = selected ? `consultation:${selected.profileId}` : null;

  useEffect(() => {
    listCharts().then(setClients).catch((e) => setError(String(e)));
  }, []);

  const loadFor = useCallback(async (client: ChartRow) => {
    setError(null);
    setDetail(null);
    const [cs, js, draft] = await Promise.all([
      listConsultations(client.profileId),
      listJournalEvents(client.profileId),
      getDraft(`consultation:${client.profileId}`),
    ]);
    setConsultations(cs);
    setJournal(js);
    if (draft) {
      setNote({ ...EMPTY_NOTE, ...(draft.payload as object) });
      setDraftNotice(`சேமிக்கப்படாத வரைவு மீட்கப்பட்டது (${new Date(draft.updatedAt).toLocaleString()})`);
    } else {
      setNote(EMPTY_NOTE);
      setDraftNotice(null);
    }
  }, []);

  const choose = (client: ChartRow) => { setSelected(client); loadFor(client); };

  // Autosave, so a crash or navigating away does not lose a half-written note.
  useEffect(() => {
    if (!draftKey || !selected) return;
    if (Object.values(note).every((v) => !v.trim())) return;
    if (draftTimer.current) clearTimeout(draftTimer.current);
    const profileId = selected.profileId;
    draftTimer.current = setTimeout(() => {
      saveDraft(draftKey, note, profileId).catch(() => { /* autosave is best-effort */ });
    }, 800);
    return () => { if (draftTimer.current) clearTimeout(draftTimer.current); };
  }, [note, draftKey, selected]);

  const submit = async () => {
    if (!selected) return;
    if (!note.summary.trim() && !note.notes.trim()) { setError('சுருக்கம் அல்லது குறிப்பு தேவை'); return; }
    setBusy(true);
    setError(null);
    try {
      await recordConsultation({ profileId: selected.profileId, ...note });
      if (draftKey) await discardDraft(draftKey);
      setNote(EMPTY_NOTE);
      setDraftNotice(null);
      await loadFor(selected);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const addEvent = async () => {
    if (!selected || !event.eventDate || !event.description.trim()) {
      setError('நிகழ்வுக்கு தேதியும் விவரமும் தேவை'); return;
    }
    setBusy(true);
    try {
      await addJournalEvent({ profileId: selected.profileId, ...event });
      setEvent({ eventDate: '', category: '', description: '' });
      setJournal(await listJournalEvents(selected.profileId));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const removeEvent = async (eventId: string) => {
    await deleteJournalEvent(eventId);
    if (selected) setJournal(await listJournalEvents(selected.profileId));
  };

  return (
    <main className="min-h-screen p-6 max-w-6xl mx-auto">
      <header className="mb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">
          Consultation Tools
        </p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">
          ஆலோசனைக் குறிப்புகள்
        </h1>
        <p className="text-sm text-ink-soft mt-1">
          ஒவ்வொரு ஆலோசனையும் அப்போதிருந்த revision-உடன் பிணைக்கப்படுகிறது — பின்னர் பிறந்த நேரம் திருத்தப்பட்டாலும் பழைய பதிவு மாறாது.
        </p>
      </header>

      {error && (
        <div className="bg-rose/10 border border-rose rounded-lg p-4 mb-6 text-sm text-rose">{error}</div>
      )}

      <div className="bg-surface border border-line rounded-2xl p-5 mb-6">
        <p className="text-xs font-semibold text-ink-soft uppercase mb-2">வாடிக்கையாளர்</p>
        {clients.length === 0 ? (
          <p className="text-sm text-ink-soft">
            யாரும் சேமிக்கப்படவில்லை. முதலில் வாடிக்கையாளர் நிர்வாகத்தில் ஒருவரைச் சேர்க்கவும்.
          </p>
        ) : (
          <div className="flex gap-2 flex-wrap">
            {clients.map((c) => (
              <button key={c.profileId} onClick={() => choose(c)}
                className={`px-3 py-2 rounded-lg border text-sm transition ${
                  selected?.profileId === c.profileId
                    ? 'border-saffron bg-saffron/10 text-ink'
                    : 'border-line text-ink-soft hover:border-line/60'
                }`}>
                {c.name}
                <span className="ml-2 font-mono text-xs text-ink-soft">v{c.revision}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div className="grid lg:grid-cols-2 gap-6">
          <section className="space-y-4">
            <div className="bg-surface border border-line rounded-2xl p-5">
              <h2 className="font-semibold text-ink mb-1">புதிய ஆலோசனை</h2>
              <p className="text-xs text-ink-soft mb-4">
                {selected.name} · தற்போதைய revision <span className="font-mono">v{selected.revision}</span>
              </p>

              {draftNotice && (
                <div className="bg-orange/10 border border-orange/40 rounded p-3 mb-4 text-xs text-ink-soft">
                  {draftNotice}
                </div>
              )}

              {([
                ['summary', 'சுருக்கம்'],
                ['notes', 'குறிப்புகள்'],
                ['recommendations', 'பரிந்துரைகள்'],
                ['remedies', 'பரிகாரங்கள்'],
              ] as Array<[keyof typeof EMPTY_NOTE, string]>).map(([key, label]) => (
                <label key={key} className="block mb-3">
                  <span className="block text-xs font-medium text-ink-soft mb-1">{label}</span>
                  <textarea
                    value={note[key]}
                    onChange={(e) => setNote({ ...note, [key]: e.target.value })}
                    rows={key === 'summary' ? 1 : 3}
                    className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded text-sm"
                  />
                </label>
              ))}

              <button onClick={submit} disabled={busy}
                className="px-4 py-2 bg-green text-white rounded font-medium text-sm disabled:opacity-50">
                {busy ? 'பதிவு செய்கிறது…' : 'ஆலோசனையைப் பதிவு செய்'}
              </button>
              <p className="text-xs text-ink-soft/70 mt-2">
                தட்டச்சு செய்யும்போது தானாக வரைவாகச் சேமிக்கப்படுகிறது.
              </p>
            </div>

            <div className="bg-surface border border-line rounded-2xl p-5">
              <h2 className="font-semibold text-ink mb-3">வாழ்க்கை நிகழ்வுகள்</h2>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input type="date" value={event.eventDate}
                  onChange={(e) => setEvent({ ...event, eventDate: e.target.value })}
                  className="px-3 py-2 bg-ink-soft/10 border border-line rounded text-sm" />
                <input type="text" placeholder="வகை" value={event.category}
                  onChange={(e) => setEvent({ ...event, category: e.target.value })}
                  className="px-3 py-2 bg-ink-soft/10 border border-line rounded text-sm" />
              </div>
              <input type="text" placeholder="என்ன நடந்தது" value={event.description}
                onChange={(e) => setEvent({ ...event, description: e.target.value })}
                className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded text-sm mb-2" />
              <button onClick={addEvent} disabled={busy}
                className="px-4 py-2 bg-info/10 text-info rounded font-medium text-sm disabled:opacity-50">
                + நிகழ்வு சேர்
              </button>

              <div className="mt-4 space-y-2">
                {journal.map((j) => (
                  <div key={j.eventId} className="flex justify-between items-start gap-3 border-t border-line/30 pt-2">
                    <div>
                      <p className="text-sm text-ink">{j.description}</p>
                      <p className="text-xs text-ink-soft tabular-nums">
                        {j.eventDate}{j.category ? ` · ${j.category}` : ''}
                      </p>
                    </div>
                    <button onClick={() => removeEvent(j.eventId)}
                      className="text-xs text-rose">நீக்கு</button>
                  </div>
                ))}
                {journal.length === 0 && (
                  <p className="text-xs text-ink-soft">இன்னும் நிகழ்வுகள் இல்லை.</p>
                )}
              </div>
            </div>
          </section>

          <section className="bg-surface border border-line rounded-2xl p-5">
            <h2 className="font-semibold text-ink mb-3">
              ஆலோசனை வரலாறு ({consultations.length})
            </h2>
            <div className="space-y-2">
              {consultations.map((c) => (
                <button key={c.consultationId}
                  onClick={async () => setDetail(await getConsultation(c.consultationId))}
                  className="w-full text-left border border-line/40 rounded p-3 hover:border-saffron/50 transition">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-sm text-ink">{c.summary || '(சுருக்கம் இல்லை)'}</span>
                    <span className="font-mono text-xs text-ink-soft whitespace-nowrap">v{c.revision}</span>
                  </div>
                  <p className="text-xs text-ink-soft tabular-nums mt-1">
                    {new Date(c.occurredAt).toLocaleDateString()}
                    {c.snapshotId && <span className="ml-2">· snapshot {c.snapshotId.slice(0, 8)}</span>}
                  </p>
                </button>
              ))}
              {consultations.length === 0 && (
                <p className="text-xs text-ink-soft">இன்னும் ஆலோசனைகள் பதிவாகவில்லை.</p>
              )}
            </div>

            {detail && (
              <div className="mt-4 border-t border-line pt-4 space-y-3 text-sm">
                <p className="text-xs text-ink-soft">
                  பதிவு செய்யப்பட்ட revision <span className="font-mono">v{detail.revision}</span>
                  {selected.revision !== detail.revision && (
                    <span className="text-orange"> · தற்போதைய v{selected.revision} — பழைய பதிவு மாறவில்லை</span>
                  )}
                </p>
                {detail.notes && (
                  <div>
                    <p className="text-xs font-semibold text-ink-soft uppercase">குறிப்புகள்</p>
                    <p className="text-ink-soft">{detail.notes}</p>
                  </div>
                )}
                {detail.recommendations && (
                  <div>
                    <p className="text-xs font-semibold text-ink-soft uppercase">பரிந்துரைகள்</p>
                    <p className="text-ink-soft">{detail.recommendations}</p>
                  </div>
                )}
                {detail.remedies && (
                  <div>
                    <p className="text-xs font-semibold text-ink-soft uppercase">பரிகாரங்கள்</p>
                    <p className="text-ink-soft">{detail.remedies}</p>
                  </div>
                )}
                {detail.evidence?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-ink-soft uppercase mb-1">ஆதாரம்</p>
                    {detail.evidence.map((e: any) => (
                      <p key={e.ruleId} className="text-xs text-ink-soft">
                        {e.name} — {e.status === 'SOURCE_REQUIRED' ? 'ஆதாரம் தேவை' : e.source?.pageLocus}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      )}

      <footer className="mt-12 pt-6 border-t border-line text-xs text-ink-soft text-center">
        <p>
          ஆலோசனைகள் அவை கொடுக்கப்பட்ட revision-உடன் நிரந்தரமாகப் பிணைக்கப்படுகின்றன;
          குறிப்பைத் திருத்தினாலும் அந்தப் பிணைப்பு மாறாது.
        </p>
      </footer>
    </main>
  );
}
