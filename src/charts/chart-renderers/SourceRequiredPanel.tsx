'use client';

import Link from 'next/link';

/**
 * The registered refusal state, on screen.
 *
 * `sourceRequired()` in `contracts/chartContext.js` is what a calculator
 * returns when it has no verified source, and PLAN-001's non-negotiable rule
 * is that no substitute value is ever fabricated in its place. This is that
 * same state rendered for a user: it says what is missing, why the number is
 * not shown, and where a sourced equivalent lives.
 *
 * It exists because the alternative is not a blank tab — it is what was here
 * before: a plausible number produced by arithmetic nobody could cite.
 */
export function SourceRequiredPanel({
  title, titleTa, reason, wasShowing, alternative,
}: {
  title: string;
  titleTa: string;
  reason: string;
  /** What used to be displayed here, so the removal is not silent. */
  wasShowing?: string;
  alternative?: { href: string; label: string };
}) {
  return (
    <div className="border border-amber-300 bg-amber-50 rounded-xl p-5 text-sm">
      <p className="text-xs font-mono uppercase tracking-widest text-amber-700 mb-1">
        ஆதாரம் தேவை / Source required
      </p>
      <h3 className="text-lg font-semibold text-amber-900">
        {titleTa} <span className="text-sm font-normal text-amber-700">{title}</span>
      </h3>

      <p className="text-amber-900 mt-2">{reason}</p>

      {wasShowing && (
        <p className="text-amber-800 mt-2 text-xs">
          <strong>முன்பு இங்கே காட்டப்பட்டது:</strong> {wasShowing} — அது
          நீக்கப்பட்டுவிட்டது. தவறான எண்ணைக் காட்டுவதை விட எதுவும் காட்டாமல்
          இருப்பதே மேல்.
        </p>
      )}

      {alternative && (
        <p className="mt-3">
          <Link href={alternative.href}
            className="text-amber-900 underline underline-offset-2 font-medium">
            {alternative.label} →
          </Link>
        </p>
      )}
    </div>
  );
}
