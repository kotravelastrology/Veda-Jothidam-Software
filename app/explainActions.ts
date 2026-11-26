'use server';

import Anthropic from '@anthropic-ai/sdk';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const X = require('../src/ai/pageExplain');

/**
 * "இந்தப் பக்கத்தை விளக்கு" on the server (src/ai/pageExplain.js holds the rules and the checks; src/ai/ExplainPanel.tsx is the panel).
 * Off unless the server has an Anthropic credential; the key never reaches the browser.
 */

export interface ExplainRequest {
  pageTitle: string;
  /** The text the panel prepared (preparePage on the browser side): the page or the selection, tidied, names replaced, cut to size. */
  text: string;
  usedSelection: boolean;
  question?: string;
  /** The open chart's name(s) and birthplace, replaced again here in case the browser's copy missed one. */
  names?: string[];
  places?: string[];
}

export interface ExplainQuote {
  text: string;
  note: string;
  found: boolean;
}

export type ExplainResult =
  | {
      ok: true;
      question: string;
      answer: string;
      quotes: ExplainQuote[];
      notInPage: boolean;
      verified: boolean;
      unverified: number;
      usedSelection: boolean;
      truncated: boolean;
      chars: number;
      model: string;
      usage: { input: number; cacheRead: number; cacheWrite: number; output: number };
    }
  | { ok: false; error: string };

export async function aiStatus(): Promise<{ enabled: boolean; model: string; perHour: number }> {
  return X.aiConfig();
}

let client: Anthropic | null = null;
let limiter: { take: (now?: number) => boolean; waitMinutes: (now?: number) => number } | null = null;
let limiterSize = -1;

function messageFor(e: unknown): string {
  if (e instanceof X.ExplainError) return (e as Error).message;
  if (e instanceof Anthropic.AuthenticationError) return 'Anthropic API key தவறு அல்லது செல்லாது: சேவையகத்தின் ANTHROPIC_API_KEY-ஐச் சரிபார்க்கவும்.';
  if (e instanceof Anthropic.PermissionDeniedError) return 'இந்த API key-க்கு இந்த மாதிரியைப் (model) பயன்படுத்த அனுமதி இல்லை.';
  if (e instanceof Anthropic.NotFoundError) return 'குறிப்பிட்ட AI மாதிரி (KOTRAVEL_AI_MODEL) கிடைக்கவில்லை.';
  if (e instanceof Anthropic.RateLimitError) return 'Anthropic சேவை இப்போது கேள்விகளை நிறுத்தி வைத்துள்ளது (வரம்பு). சற்று நேரம் கழித்துக் கேளுங்கள்.';
  if (e instanceof Anthropic.BadRequestError) return `கோரிக்கையை Anthropic ஏற்கவில்லை: ${e.message.slice(0, 200)}`;
  if (e instanceof Anthropic.APIConnectionError) return 'Anthropic சேவையை அடைய முடியவில்லை: சேவையகத்தின் இணைய இணைப்பைப் பார்க்கவும்.';
  if (e instanceof Anthropic.APIError) return `Anthropic சேவைப் பிழை (${e.status ?? '?'}). சற்று நேரம் கழித்து மீண்டும் முயலுங்கள்.`;
  console.error('explainPage:', e);
  return 'விளக்கம் பெற இயலவில்லை.';
}

export async function explainPage(req: ExplainRequest): Promise<ExplainResult> {
  const { enabled, model, perHour } = X.aiConfig();
  if (!enabled) return { ok: false, error: 'AI விளக்கம் இயக்கப்படவில்லை: சேவையகத்தில் Anthropic API key இல்லை.' };
  if (!limiter || limiterSize !== perHour) {
    limiter = X.makeRateLimiter(perHour);
    limiterSize = perHour;
  }
  try {
    // Prepared again on the server: the limits and the replacements hold whatever the browser sent.
    const page = X.preparePage({ text: String(req.text ?? ''), names: req.names, places: req.places });
    const usedSelection = req.usedSelection === true;
    const question = X.prepareQuestion(req.question, usedSelection);
    if (!limiter!.take()) {
      return { ok: false, error: `இந்த மணி நேரத்துக்கான AI கேள்விகள் (${perHour}) முடிந்தன; சுமார் ${limiter!.waitMinutes()} நிமிடம் கழித்துக் கேளுங்கள்.` };
    }
    client ??= new Anthropic({ maxRetries: 1, timeout: 120_000 });
    const r = await X.explainWithClient(client, { model, pageTitle: String(req.pageTitle ?? ''), pageText: page.pageText, question, usedSelection });
    return { ok: true, question, usedSelection, truncated: page.truncated, chars: page.chars, ...r };
  } catch (e) {
    return { ok: false, error: messageFor(e) };
  }
}
