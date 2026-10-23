'use client';

/**
 * VJ-013 — browser storage that reports its failures.
 *
 * `localStorage` throws when the origin's quota is exhausted, and the usual
 * `catch {}` turns that into silent data loss: the user keeps working, nothing
 * is saved, and they find out after a restart. The acceptance criterion is
 * that a quota failure is *visible*, so writes return a result the caller can
 * surface rather than an exception it is tempted to swallow.
 *
 * Nothing here holds records. Charts, consultations and journal entries live
 * in the SQLite library, so a browser-storage failure costs preferences, never
 * the practitioner's work.
 */

export type StoreFailure =
  | { kind: 'quota'; message: string }
  | { kind: 'unavailable'; message: string }
  | { kind: 'corrupt'; message: string };

export type StoreResult = { ok: true } | { ok: false; failure: StoreFailure };

function classify(error: unknown): StoreFailure {
  const e = error as { name?: string; code?: number; message?: string };
  const name = e?.name ?? '';
  // Browsers disagree on the name; the code is the reliable signal.
  if (name === 'QuotaExceededError' || name === 'NS_ERROR_DOM_QUOTA_REACHED' || e?.code === 22 || e?.code === 1014) {
    return {
      kind: 'quota',
      message: 'Browser storage is full, so this preference was not saved. Clearing site data for this app will free it; your charts and notes are stored separately and are unaffected.',
    };
  }
  return {
    kind: 'unavailable',
    message: `Browser storage is unavailable (${name || 'unknown error'}), so preferences will not persist this session.`,
  };
}

export function readJson<T>(key: string, fallback: T): { value: T; failure?: StoreFailure } {
  if (typeof window === 'undefined') return { value: fallback };
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return { value: fallback };
    return { value: JSON.parse(raw) as T };
  } catch (error) {
    const e = error as Error;
    if (e instanceof SyntaxError) {
      return {
        value: fallback,
        failure: { kind: 'corrupt', message: `Saved preferences for "${key}" were unreadable and defaults were used.` },
      };
    }
    return { value: fallback, failure: classify(error) };
  }
}

export function writeJson(key: string, value: unknown): StoreResult {
  if (typeof window === 'undefined') return { ok: true };
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return { ok: true };
  } catch (error) {
    return { ok: false, failure: classify(error) };
  }
}
