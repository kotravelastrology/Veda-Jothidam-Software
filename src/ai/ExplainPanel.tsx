'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import { aiStatus, explainPage, type ExplainResult } from '../../app/explainActions';
import { useWorkspace } from '../workspace/workspaceContext';
import { readStash } from '../ui/openChartStore';
import { preparePage, SUGGESTED_QUESTIONS, MAX_PAGE_CHARS } from './pageExplain';

/**
 * The ✨ button of the top bar and its panel: Claude explains the page in view (or the part the reader selected) from that page's own
 * lines (src/ai/pageExplain.js). The button shows only when the server has an Anthropic key (aiStatus). Before the first question the
 * panel says what is sent and to whom; the text that is sent can be read in the panel itself.
 */

const CONSENT_KEY = 'kotravel-ai-consent';

type Status = { enabled: boolean; model: string; perHour: number };
let statusOnce: Promise<Status> | null = null;

function useAiStatus(): Status | null {
  const [status, setStatus] = useState<Status | null>(null);
  useEffect(() => {
    let live = true;
    statusOnce ??= aiStatus().catch(() => ({ enabled: false, model: '', perHour: 0 }));
    statusOnce.then((s) => { if (live) setStatus(s); });
    return () => { live = false; };
  }, []);
  return status;
}

function readConsent(): boolean {
  try { return localStorage.getItem(CONSENT_KEY) === '1'; } catch { return false; }
}

function mainElement(): HTMLElement | null {
  return document.getElementById('main-content');
}

/** The selected text, if the selection lies in the page's own content (not in a menu or this panel). */
function selectionInMain(): string {
  const sel = window.getSelection();
  const main = mainElement();
  if (!sel || sel.isCollapsed || !main || !sel.anchorNode || !main.contains(sel.anchorNode)) return '';
  return sel.toString();
}

function pageTitle(): string {
  const h1 = mainElement()?.querySelector('h1')?.textContent?.trim();
  return h1 || document.title || 'பக்கம்';
}

/** The open chart's name and birthplace, to be replaced before anything is sent. */
function whoToHide(active: { name?: string; placeName?: string | null } | null): { names: string[]; places: string[] } {
  const stash = readStash();
  const names = [stash?.birthData?.name, stash?.profile?.name, active?.name].filter((v): v is string => typeof v === 'string' && v.trim() !== '');
  const places = [stash?.birthData?.place, stash?.profile?.placeName, active?.placeName].filter((v): v is string => typeof v === 'string' && v.trim() !== '');
  return { names: [...new Set(names)], places: [...new Set(places)] };
}

interface Prepared {
  pageText: string;
  usedSelection: boolean;
  truncated: boolean;
  redactions: number;
  chars: number;
}

interface Turn {
  question: string;
  result: ExplainResult | null;
}

export function ExplainLauncher() {
  const status = useAiStatus();
  const [open, setOpen] = useState(false);
  const selectionRef = useRef('');
  const buttonRef = useRef<HTMLButtonElement>(null);
  if (!status?.enabled) return null;
  return (
    <>
      <button
        ref={buttonRef}
        // The selection is read before the click takes the focus
        onPointerDown={() => { selectionRef.current = selectionInMain(); }}
        onClick={() => {
          if (!selectionRef.current) selectionRef.current = selectionInMain();
          setOpen(true);
        }}
        className="grid place-items-center size-9 rounded-lg hover:bg-bar-ink/10 text-base"
        aria-label="இந்தப் பக்கத்தை விளக்கு (AI)"
        title="இந்தப் பக்கத்தை விளக்கு (AI) — ஒரு பகுதியைத் தேர்ந்தெடுத்தும் கேட்கலாம்"
        data-hint="Explain this page (AI): from the page's own lines only. Select a part of the page first to ask about that part."
        data-testid="explain-button"
      >
        ✨
      </button>
      {open && (
        <ExplainPanel
          model={status.model}
          selection={selectionRef.current}
          onClose={() => {
            setOpen(false);
            selectionRef.current = '';
            buttonRef.current?.focus();
          }}
        />
      )}
    </>
  );
}

function ExplainPanel({ model, selection, onClose }: { model: string; selection: string; onClose: () => void }) {
  const titleId = useId();
  const pathname = usePathname();
  const { activeProfile } = useWorkspace();
  const [consented, setConsented] = useState(readConsent);
  const [question, setQuestion] = useState('');
  const [turns, setTurns] = useState<Turn[]>([]);
  const [busy, setBusy] = useState(false);
  const [prepared, setPrepared] = useState<Prepared | null>(null);
  const [prepError, setPrepError] = useState('');
  const [scope, setScope] = useState<'selection' | 'page'>(selection.trim() ? 'selection' : 'page');
  const textRef = useRef<HTMLTextAreaElement>(null);
  // Read once when the panel opens: the chart open at that moment is the one whose name and place are hidden
  const [hideWho] = useState(() => whoToHide(activeProfile));
  const hide = useRef(hideWho);

  // What would be sent: prepared once on opening and when the reader switches between the selection and the whole page
  useEffect(() => {
    try {
      const p = preparePage({
        text: mainElement()?.innerText ?? '',
        selection: scope === 'selection' ? selection : '',
        names: hide.current.names,
        places: hide.current.places,
      }) as Prepared;
      setPrepared(p);
      setPrepError('');
    } catch (e) {
      setPrepared(null);
      setPrepError(e instanceof Error ? e.message : String(e));
    }
  }, [scope, selection, pathname]);

  // Escape closes the panel. The listener is added once and reads the latest onClose from a ref: re-adding it on each render (the
  // top bar re-renders when another Escape handler closes its panels) dropped the very key press that caused the render.
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; });
  useEffect(() => {
    textRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onCloseRef.current(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const ask = useCallback(async (q: string) => {
    if (!prepared || busy) return;
    const shown = q.trim() || (prepared.usedSelection ? 'தேர்ந்தெடுத்த பகுதியை விளக்கவும்' : 'இந்தப் பக்கத்தை விளக்கவும்');
    setBusy(true);
    setTurns((t) => [...t, { question: shown, result: null }]);
    let result: ExplainResult;
    try {
      result = await explainPage({
        pageTitle: pageTitle(),
        text: prepared.pageText,
        usedSelection: prepared.usedSelection,
        question: q,
        names: hide.current.names,
        places: hide.current.places,
      });
    } catch {
      result = { ok: false, error: 'சேவையகத்தை அடைய முடியவில்லை (இணைப்பு இல்லை?).' };
    }
    setTurns((t) => t.map((turn, i) => (i === t.length - 1 ? { question: result.ok ? result.question : shown, result } : turn)));
    setBusy(false);
    setQuestion('');
  }, [prepared, busy]);

  const accept = () => {
    try { localStorage.setItem(CONSENT_KEY, '1'); } catch { /* the panel asks again next time */ }
    setConsented(true);
  };

  const hasSelection = selection.trim().length > 0;

  return createPortal(
    <div className="fixed inset-0 z-[70] print:hidden" data-testid="explain-panel">
      <button className="absolute inset-0 bg-ink/30 cursor-default" aria-label="மூடு" onClick={onClose} tabIndex={-1} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={(e) => { if (e.key === 'Escape') { e.stopPropagation(); onClose(); } }}
        className="absolute right-0 top-0 h-dvh w-full sm:max-w-md bg-surface text-ink shadow-2xl flex flex-col border-l border-line"
      >
        <header className="flex items-start gap-2 px-4 py-3 border-b border-line">
          <div className="flex-1">
            <h2 id={titleId} className="font-[family-name:var(--font-tamil-serif)] text-lg font-bold">✨ இந்தப் பக்கத்தை விளக்கு</h2>
            <p className="text-xs text-ink-soft">பக்கத்தின் வரிகளைக் கொண்டு மட்டும் · தீர்ப்பு அல்ல · AI ({model})</p>
          </div>
          <button onClick={onClose} className="grid place-items-center size-9 rounded-lg hover:bg-ink/10" aria-label="மூடு">✕</button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" aria-live="polite">
          {/* What is sent */}
          <div className="rounded-xl bg-surface-2 border border-line p-3 text-xs space-y-2">
            {hasSelection && (
              <div className="flex gap-1" role="radiogroup" aria-label="எதை விளக்குவது">
                {([['selection', 'தேர்ந்தெடுத்த பகுதி'], ['page', 'முழுப் பக்கம்']] as const).map(([k, label]) => (
                  <button
                    key={k}
                    role="radio"
                    aria-checked={scope === k}
                    onClick={() => setScope(k)}
                    className={`rounded-full px-3 py-1 border ${scope === k ? 'bg-saffron text-ink border-saffron font-semibold' : 'border-line hover:bg-ink/5'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
            {prepared ? (
              <p>
                {prepared.usedSelection ? 'தேர்ந்தெடுத்த பகுதி' : 'முழுப் பக்கம்'} · {prepared.chars.toLocaleString('en-IN')} எழுத்துகள்
                {prepared.redactions > 0 && <> · பெயர்/ஊர் {prepared.redactions} இடங்களில் நீக்கப்பட்டன</>}
              </p>
            ) : (
              <p className="text-rose">{prepError || '…'}</p>
            )}
            {prepared?.truncated && (
              <p className="text-rose">
                பக்கம் நீளமானது: முதல் {MAX_PAGE_CHARS.toLocaleString('en-IN')} எழுத்துகள் மட்டும் அனுப்பப்படும். ஒரு பகுதியைத் தேர்ந்தெடுத்து ✨ அழுத்தினால் அந்தப் பகுதி முழுதும் போகும்.
              </p>
            )}
            {prepared && (
              <details>
                <summary className="cursor-pointer text-ink-soft">அனுப்பப்படும் உரையைப் பார்</summary>
                <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-surface p-2 font-sans text-[11px] leading-relaxed">{prepared.pageText}</pre>
              </details>
            )}
          </div>

          {!consented && (
            <div className="rounded-xl border border-saffron bg-saffron-soft p-3 text-sm space-y-2" data-testid="explain-consent">
              <p className="font-semibold">அனுப்பும் முன் ஒரு முறை படிக்கவும்</p>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li>மேலே உள்ள உரை (பக்கம் அல்லது தேர்ந்தெடுத்த பகுதி) Anthropic நிறுவனத்தின் Claude சேவைக்கு அனுப்பப்படும்.</li>
                <li>திறந்துள்ள ஜாதகத்தின் பெயரும் பிறந்த ஊரும் அனுப்பும் முன் நீக்கப்படும். பிறந்த தேதி, நேரம், பக்கத்தில் உள்ள மற்றப் பெயர்கள் அப்படியே போகும்.</li>
                <li>ஒவ்வொரு கேள்விக்கும் API key உரிமையாளருக்குக் கட்டணம் உண்டு.</li>
                <li>விளக்கம் பக்கத்தின் வரிகளிலிருந்து மட்டும்; பக்கத்தில் இல்லாத வரி ✗ எனக் குறிக்கப்படும்.</li>
              </ul>
              <button onClick={accept} className="rounded-lg bg-saffron text-ink px-3 py-1.5 text-sm font-semibold hover:brightness-105">
                புரிந்தது, தொடர்
              </button>
            </div>
          )}

          {turns.map((t, i) => (
            <TurnView key={i} turn={t} />
          ))}

          {consented && turns.length === 0 && (
            <div className="space-y-1.5">
              <p className="text-xs text-ink-soft">இவற்றில் ஒன்றைக் கேட்கலாம், அல்லது கீழே உங்கள் கேள்வியை எழுதலாம்:</p>
              {SUGGESTED_QUESTIONS.map((q: string) => (
                <button
                  key={q}
                  disabled={!prepared || busy}
                  onClick={() => ask(q)}
                  className="block w-full text-left rounded-lg border border-line px-3 py-2 text-sm hover:bg-saffron-soft disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>

        <form
          className="border-t border-line p-3 flex gap-2 items-end"
          onSubmit={(e) => { e.preventDefault(); ask(question); }}
        >
          <label className="sr-only" htmlFor={`${titleId}-q`}>உங்கள் கேள்வி</label>
          <textarea
            id={`${titleId}-q`}
            ref={textRef}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            // Enter asks, Shift+Enter starts a new line; not while a Tamil keyboard is still composing a letter
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); ask(question); } }}
            rows={2}
            maxLength={600}
            disabled={!consented}
            placeholder={consented ? 'இந்தப் பக்கத்தைப் பற்றி உங்கள் கேள்வி…' : 'மேலே "புரிந்தது" அழுத்திய பின் கேட்கலாம்'}
            className="flex-1 resize-none rounded-lg border border-line bg-surface px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={!consented || !prepared || busy}
            className="rounded-lg bg-saffron text-ink px-3 py-2 text-sm font-semibold hover:brightness-105 disabled:opacity-50"
            data-testid="explain-send"
          >
            {busy ? '…' : 'கேள்'}
          </button>
        </form>
      </div>
    </div>,
    document.body,
  );
}

function TurnView({ turn }: { turn: Turn }) {
  const r = turn.result;
  return (
    <article className="rounded-xl border border-line p-3 space-y-2" data-testid="explain-turn">
      <p className="text-sm font-semibold">❓ {turn.question}</p>
      {!r && (
        <div className="space-y-2" aria-busy="true">
          <div className="skeleton h-3 w-11/12" />
          <div className="skeleton h-3 w-10/12" />
          <div className="skeleton h-3 w-8/12" />
          <p className="text-xs text-ink-soft">பக்கத்தின் வரிகளைப் படித்து விளக்கம் தயாராகிறது…</p>
        </div>
      )}
      {r && !r.ok && <p className="text-sm text-rose" role="alert">{r.error}</p>}
      {r && r.ok && (
        <>
          {r.notInPage && (
            <p className="text-xs rounded-lg bg-indigo-soft px-2 py-1">இந்தக் கேள்விக்கான பதில் இந்தப் பக்கத்தில் இல்லை.</p>
          )}
          {!r.notInPage && !r.verified && (
            <p className="text-xs rounded-lg bg-rose-soft text-ink px-2 py-1" role="alert" data-testid="explain-unverified">
              {r.quotes.length === 0
                ? '⚠️ ஆதார வரி எதுவும் தரப்படவில்லை: இந்த விளக்கத்தை நம்ப வேண்டாம்.'
                : `⚠️ ${r.unverified} வரி பக்கத்தில் அப்படியே இல்லை (✗): அந்தப் பகுதியை நம்ப வேண்டாம்.`}
            </p>
          )}
          <div className="text-sm leading-relaxed space-y-2">
            {r.answer.split(/\n{2,}|\n/).filter(Boolean).map((para, i) => <p key={i}>{para}</p>)}
          </div>
          {r.quotes.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-ink-soft">பக்கத்தின் வரிகள்</p>
              {r.quotes.map((q, i) => (
                <figure key={i} className={`rounded-lg border px-2 py-1.5 text-xs ${q.found ? 'border-teal/40 bg-teal-soft' : 'border-rose/40 bg-rose-soft'}`}>
                  <blockquote className="whitespace-pre-wrap">
                    <span aria-label={q.found ? 'பக்கத்தில் உள்ளது' : 'பக்கத்தில் இல்லை'}>{q.found ? '✓' : '✗'}</span> {q.text}
                  </blockquote>
                  {q.note && <figcaption className="mt-0.5 text-ink-soft">{q.note}</figcaption>}
                </figure>
              ))}
            </div>
          )}
          <p className="text-[10px] text-ink-soft">
            AI விளக்கம் · {r.model} · உள்ளீடு {r.usage.input + r.usage.cacheRead + r.usage.cacheWrite} (cache {r.usage.cacheRead}) · வெளியீடு {r.usage.output} tokens
          </p>
        </>
      )}
    </article>
  );
}
