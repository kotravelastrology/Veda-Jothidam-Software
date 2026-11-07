'use client';

import { useEffect, useState } from 'react';
import { useActiveBirthInput } from '@/src/workspace/useActiveBirthInput';
import { natureFromLagnaLord } from './actions';
import { PageEyebrow } from '@/src/ui/PageEyebrow';

interface NatureData {
  lagnaRasi: string;
  entry: { sign: string; planet: string; en: string; ta: string; page: number; citation: string };
}

export default function NatureView() {
  const { input: profileInput } = useActiveBirthInput();
  const [data, setData] = useState<NatureData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profileInput) return;
    setLoading(true);
    setError(null);
    natureFromLagnaLord(profileInput)
      .then((result: NatureData) => setData(result))
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, [profileInput]);

  return (
    <main className="min-h-screen p-6 max-w-3xl mx-auto">
      <header className="mb-6">
        <PageEyebrow fallback="Worksheet 039" />
        <h1 className="text-3xl font-bold text-ink">இயல்பும் குணமும் (Nature &amp; Temperament)</h1>
        <p className="text-sm text-ink-soft mt-1">
          The lagna lord placed in the lagna, as Bhrigu Samhita describes it for this rasi.
        </p>
      </header>

      {!profileInput && (
        <p className="text-sm text-ink-soft">Open a saved chart (File → Open) to see its nature.</p>
      )}
      {loading && <p className="text-sm text-ink-soft">Calculating…</p>}
      {error && <p className="text-sm text-rose">{error}</p>}

      {data && (
        <section className="bg-surface border border-line rounded-2xl p-5 space-y-3">
          <p className="text-sm text-ink-soft">
            Lagna: {data.lagnaRasi} · Lagna lord: {data.entry.planet} in the 1st house ({data.entry.sign})
          </p>
          <p className="text-base text-ink">{data.entry.ta}</p>
          <p className="text-sm text-ink-soft">{data.entry.en}</p>
          <p className="text-xs text-ink-soft">{data.entry.citation}</p>
        </section>
      )}
    </main>
  );
}
