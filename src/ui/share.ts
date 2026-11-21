'use client';

import { composeShareText, whatsappLink } from './shareText';

/**
 * Sharing a piece of text (today's panchangam, a chart's summary) the way people pass things on in India: through the phone's share
 * sheet (WhatsApp, Telegram, a message) where the browser has one, and otherwise by copying it to the clipboard.
 * Only text is shared, never a link to a chart: nothing about a person leaves the device except what the person chooses to send.
 */
export type ShareOutcome = 'shared' | 'copied' | 'cancelled' | 'failed';

export interface ShareInput {
  title: string;
  text: string;
  /** a page to link, when the text is about the program rather than about a person */
  url?: string;
}

export { composeShareText, whatsappLink };

export async function shareText(input: ShareInput): Promise<ShareOutcome> {
  const body = composeShareText(input);
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      await navigator.share({ title: input.title, text: body });
      return 'shared';
    }
  } catch (error) {
    if ((error as Error)?.name === 'AbortError') return 'cancelled';
    // a share sheet that refuses: fall through to the clipboard
  }
  try {
    await navigator.clipboard.writeText(body);
    return 'copied';
  } catch {
    return 'failed';
  }
}
