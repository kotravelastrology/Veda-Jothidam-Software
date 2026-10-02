# Gemstones (ரத்தினங்கள்) — `/gemstones`

**What it is:** a side-by-side of what three books say to wear for a person's
Ascendant (and Moon sign). **What it is not:** a recommendation. The books use
different methods and disagree on particular gems, so the page chooses nothing
and claims no benefit.

## Sources (all cite-only, in the registry)
- Kapoor, *Remedial Measures in Astrology* — ruling stone = gem of the Ascendant
  lord (p.77); strengthen lords of good houses; caution for 6/8/12 lords.
- Tilak Raj, *Remedies of Astrological Science* pp.25-33 — a verdict for each of
  7 planets × 12 Ascendants, plus gomed (Rahu) and cat's eye (Ketu).
- Raj Kumar, *Astro Remedies: A Vedic Approach* PDF 121-124 — benefic/malefic gem
  table by Lagna or Moon sign, two lordship rules that contradict each other, and
  the traditional "only in the planet's dasha" view.
- Planet→gem: Jataka Parijata verse as quoted in Kapoor p.76. The English
  rendering there omits Saturn; the verse gives nila (blue sapphire).

## Findings recorded, not resolved
- Raj Kumar's table lists a gem that also rules 6/7/8/12 as benefic in 8 of 12
  signs, against his own first rule; Cancer ruby fits neither rule.
- Tilak Raj prints Pisces/Venus as lord of 3 and 7 (really 3 and 8), omits some
  lordships, and has an "Emerald" misprint under Sagittarius/Jupiter.
- "Agreement" compares Kapoor, Tilak Raj and Raj Kumar's Lagna row only; the
  Moon-sign row is shown separately.
- No Tamil book gives an assignment or selection rule; Tamil gem names come from
  OCR text of Jataka Alankaram and are unverified against the page.

## Tests
`node test-gemstones.js` — engine tables equal an independent fixture
(`fixtures/gemstones/definitions.json`); stated vs real lordships; Raj Kumar's
table vs his rules.
