# Sripati bhava, the KP chart's source, and the Sun and Moon lagnas (PL9 gap items)

Read on 2026-10-23 from the owner's books; every page checked in the scan image.

## Sripati bhava (`/sripati-bhava`, `src/chart/sripatiBhava.js`, `test-sripati-bhava.js`)

Source: *Sripatipaddhati* (V. Subrahmanya Sastri), Adhyaya I slokas 6-11, printed pp.10-14; Santhanam's note to BPHS ch.5 v.9 (the
Chaukhamba edition's hints) says the same.

- The twelve points got by taking a third and two thirds of the arc between Lagna, 4th, 7th and 10th are the *bhavas*, that is
  their middles. The engine's "Porphyrius" cusps are exactly these points (checked: zero difference).
- A half of the sum of two contiguous bhavas is their *Sandhi*; a planet short of a Sandhi gives the effect of the preceding
  bhava, past it that of the next (sloka 8).
- The effect is full at the bhava point and falls to nothing at the Sandhi (slokas 9-10); the worked example is a fraction, the
  distance to the nearer Sandhi over the Bhavamsa (the bhava point to that Sandhi): Aroha before the bhava point, Avaroha after.

The test reproduces the book's twelve bhavas and twelve Sandhis to the second and six of its seven planet effects to four places
(Sun .7694, Moon .5791, Mars .0313, Mercury .2579, Jupiter .3823, Saturn .0334).

**Venus differs.** The book prints .9653; the rule gives .9702 (Venus is before the bhava point, so the Bhavamsa on its side is
16d8'16"). The printed figure is 1 - 0d28'50"/13d51'44", the width on the other side. Both are kept; the page shows the rule's.

**A difference from the app's other pages.** `parashariChart.houseOfLongitude` and everything built on it take these points as
the *beginnings* of the houses (cusp-as-start, the Porphyry way). In Sripatipaddhati the points are the middles; the beginnings are
the Sandhis. A planet in the first half of a house by one reading is in the previous house by the other (e.g. 5 Oct 1990, 04:30,
Chennai: the Sun is in house 1 by the cusp-start reading and in bhava 2 by Sripati). No page was changed and no choice is made;
the Sripati page lists both. This is the owner's decision to make.

## KP chart (already built: `kpSystem.js`, report section "KP ஜோதிடம்")

The engine was ported from earlier software. It is now checked against *Krishnamurti Padhdhati, Reader III: Predictive Stellar
Astrology* (K.S. Krishnamurti): printed pp.11-13 (the nine subs in the Vimshottari proportion; 249 combinations, not 243), p.393
(the 206th sub begins at Capricorn 26d6'40"; Krishnamurti ayanamsa 23d20' for 1969; cusps from Raphael's Table of Houses less the
ayanamsa) and p.481 (22d40' for 1922). `test-kp-source.js`: 249 subs, the 206th sub, the sub widths, the sub order of Krittika and
Punarvasu, and the Swiss Ephemeris Krishnamurti ayanamsa at both dates all agree. One misprint: the book gives Mercury's sub as
1d53'40"; 17/120 of 800 minutes is 1d53'20". The book names Raphael's tables of houses, not Placidus by name; Raphael's are
Placidus tables. Reader I (*Fundamental Principles of Astrology*) is not in the corpus; the cuspal sub-lord rules of the Readers I
and II are not yet read.

## Sun and Moon lagnas (on `/special-lagnas`)

BPHS (Santhanam) ch.7 vv.39-43, printed p.72: the 9th, 10th, 11th from the Sun; the 4th, 1st, 2nd, 11th, 9th from the Moon (and
the 3rd from Mars, 6th from Mercury, 5th from Jupiter, 7th from Venus, 8th and 12th from Saturn). The page shows the whole-sign
houses from the Sun's and the Moon's sign and marks which houses the book reads. It does not say the rest are to be read.
