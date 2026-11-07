'use client';

import { SourceRequiredPanel } from './SourceRequiredPanel';

/**
 * Synastry insights — **not implemented**.
 *
 * What stood here until 2026-09-28 read:
 *
 * ```
 * const score = analysisData?.compatibilityScore || analysisData?.gunaScore || 50;
 * if (score >= 32) { title: 'Excellent Match', … }
 * ```
 *
 * The fallback is the problem. With no analysis data — which is what the call
 * site supplied — the score became **50**, 50 passes the 32 threshold, and the
 * panel declared an *Excellent Match* with prose about "strong planetary
 * harmony and favourable dasha combinations" for two people whose charts had
 * never been compared. Every pair, every time.
 *
 * Narrative verdicts over a default constant are the VJ-003 defect in its
 * purest form: the text is confident, specific, personalised by name, and
 * derived from nothing. Removed rather than repaired, because there is no
 * sourced synastry rule set behind it to repair it to.
 *
 * The neighbouring tabs — Shadbala, aspects, dasha overlap — compute from the
 * real engines and are unaffected.
 */
export function ComparisonInsights(_props: { report?: unknown }) {
  return (
    <SourceRequiredPanel
      title="Synastry insights"
      titleTa="ஒப்பீட்டு நுண்ணறிவு"
      reason={
        'இரு ஜாதகங்களை ஒப்பிட்டு உரைநடையில் பலன் சொல்லும் முறைக்கு, '
        + 'சரிபார்க்கப்பட்ட விதித் தொகுப்பு இந்த software-இல் இல்லை.'
      }
      wasShowing={
        '"Excellent Match" போன்ற தீர்ப்புகள் — ஆனால் அவை ஒரு நிலையான '
        + 'இயல்புநிலை எண்ணிலிருந்து (50) உருவானவை; இரு ஜாதகங்களும் '
        + 'ஒப்பிடப்படாமலேயே ஒவ்வொரு ஜோடிக்கும் அதே தீர்ப்பு வந்தது'
      }
      alternative={{
        href: '/porutham',
        label: 'தமிழ் பொருத்தம் — காரணியும் விதியும் ஆதார நிலையும்',
      }}
    />
  );
}
