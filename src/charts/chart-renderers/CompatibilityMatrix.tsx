'use client';

import { SourceRequiredPanel } from './SourceRequiredPanel';

/**
 * Ashtakoota (36-guna) matching — **not implemented**.
 *
 * What stood here until 2026-09-28 was a 36-guna score computed from formulas
 * that were not the Ashtakoota rules. Its own comment said
 * `simplified for demonstration`: Varna tested whether the two signs were
 * equal or six apart rather than the signs' varna; Yoni was
 * `(rashi1 + rashi2) % 3` rather than the animal table; Gana was the same
 * expression mod 2 rather than Deva/Manushya/Rakshasa; Graha Maitri was sign
 * distance rather than planetary friendship; Bhakuta was a nakshatra count
 * rather than the twelve-sign position.
 *
 * It was also **constant**. The only call site passed
 * `rashi: 0, nakshatra: 0, moon: { sign: 0 }` for both charts, so the
 * arithmetic ran on zeros and every couple received the same 26/36 — 72.2% —
 * whoever they were. A number that never changes is not a calculation, and
 * one presented as a marriage score is worse than none.
 *
 * The Tamil dasakoota at `/porutham` is the sourced equivalent: ten factors,
 * each with its rule, its reasoning for the pair in hand, and an explicit
 * statement that its tables still lack a cited edition (VJ-018). Ashtakoota
 * is the North Indian system and would need its own sourcing before it can
 * return here.
 */
export function CompatibilityMatrix(_props: { report?: unknown }) {
  return (
    <SourceRequiredPanel
      title="Ashtakoota / Guna Milan (36)"
      titleTa="அஷ்டகூட பொருத்தம்"
      reason={
        'வட இந்திய 36-குண பொருத்த முறை இந்த software-இல் இன்னும் '
        + 'செயல்படுத்தப்படவில்லை. சரிபார்க்கப்பட்ட நூல் ஆதாரம் இல்லாமல் '
        + 'ஒரு புள்ளியைக் காட்ட மாட்டோம்.'
      }
      wasShowing={
        '36-இல் ஒரு புள்ளி — ஆனால் அதன் சூத்திரங்கள் உண்மையான அஷ்டகூட '
        + 'விதிகள் அல்ல, மேலும் அது ஒவ்வொரு ஜோடிக்கும் ஒரே எண்ணையே '
        + '(26/36) தந்துகொண்டிருந்தது'
      }
      alternative={{
        href: '/porutham',
        label: 'தமிழ் தச கூட பொருத்தம் — ஒவ்வொரு காரணிக்கும் விதியும் விளக்கமும்',
      }}
    />
  );
}
