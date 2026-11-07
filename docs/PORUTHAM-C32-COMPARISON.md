# Porutham: K.S. Krishnamurti (Reader IV) against our Kalaprakasika tables

Read on 2026-10-26 from the page images of C32, printed pp.17-44. Our module (`src/report/poruthamTables.js`) follows
Kalaprakasika (N.P. Subramania Iyer, printed pp.69-76), with Sudamani as the cross-check. C32 is a third reading, encoded in
`src/report/poruthamC32.js` and compared by `test-porutham-c32.js`, which pins every difference below. Nothing in the calculation
was changed.

## Agrees with Kalaprakasika
- **Gana**: the three groups of nine stars are identical (C32 p.29).
- **Mahendra**: 4th, 7th, 10th ... 25th from the bride's star (pp.29-30).
- **Sthree Dheerga**: 13th and above (p.31); C32 adds that some sages begin at the 8th.
- **Rasi**: the boy's rasi 2nd to 6th from the bride's is bad (p.33).
- **Rajju**: all five bands hold the same stars (p.37, Aroha and Avaroha together).
- **Dina cycle**: the nine names and which are good (2, 4, 6, 8, 9) and bad (3, 5, 7), counted from the girl's star (pp.20-22).
- **Common janma star** (p.24): every star C32 lists falls in the same grade as ours. C32 names 21 of 27 and says 8 excellent, 11 fair,
  8 to be ignored, which is our 8/11/8.

## Differs (each pinned by the test)
1. **Yoni, three stars.** C32 gives Uthiram (Uttara Phalguni) alone as Camel, and Dhanishta and Poorattadhi as Human. We have Uthiram
   as Cow and Dhanishta and Poorattadhi as Lion (the lion's pair). C32 therefore has 14 yonis; we have 13. I re-read the table at
   twice the size to confirm the printing.
2. **Yoni enmity.** C32 lists goat and elephant; we have deer and elephant (a Kalaprakasika misprint we already flag) and also
   serpent and mongoose, which C32 does not have. C32's other six pairs equal ours.
3. **Vasya, Taurus.** C32: Cancer and Libra. Ours: Cancer and Leo. All other eleven rows agree.
4. **Vedha.** C32 pairs Bharani with Pushyam; we pair Bharani with Anuradha. C32 has the ten pairs, with Mrigasirisha-Chithra as the
   only Mrigasirisha pair; we also carry Mrigasirisha-Dhanishta and Chithra-Dhanishta (a triple), and the pairs Pooram-Uthirattadhi,
   Uthiram-Poorattadhi and Hastham-Shatabhisha, which C32 does not give: it says Pooram and Uthiram have no Vedha at all.

## In C32 and not in our module
- **Dina**: C32 grades the nine positions as Sampat, Kshemam, Sadhakam, Maitram, Parama Maitram good, and lists the Vatham and
  Vainasikam (7th star) exceptions with sixteen Kasyapa pairings (pp.24-26). Our module uses the 22nd star (Vadha-Vainasika) from
  Kalaprakasika; C32 does not mention the 22nd.
- **Rasyadhipathi** is given with a planet-relationship table (p.35) that differs from the standard one in places.
- Exceptions that waive Gana, Rajju or Rasi dosha (pp.29, 39-40, 33-34), Nadi (p.42), star gender (pp.42-43), Gotram (p.43) and the
  caste-by-sign rule (p.44): none of these is in `poruthamTables.js`.
- C32's stance: it ranks the poruthams below the individual charts (pp.15-17) and holds that "more than five out of ten" is the
  usual rule (p.33).

## Decisions for the owner
Which of the three Yoni readings to follow for Uthiram, Dhanishta and Poorattadhi; whether the Bharani Vedha partner is Pushyam or
Anuradha; and whether to add C32's Dina, Gana and Rajju exceptions as an optional second source, as Sudamani is now.

## Decision (owner, 2026-10-26): follow Kalaprakasika; C32 as an optional second source
Built in `src/report/poruthamC32Notes.js` and returned as `result.c32` by `calculateTamilPorutham`; the Porutham page shows it folded
under "இரண்டாம் துணை நூல்". It changes neither the ten verdicts, the passed count, the level nor the source status (checked for every
27x27 star pair in `test-porutham-c32-notes.js`).

What it shows:
- **Per factor**: whether C32 matches, diverges or uses a different model, with printed pages (the differences above).
- **Exceptions that apply to this pair**, only when the factor failed: Gana (bride Rakshasa and the boy's star more than 14th counted
  back; or same Moon sign, friendly lords, Sama-saptama), Rajju (the same three Moon-sign conditions, with a caution for the stars whose
  padas are excepted), Rasi (6th place for an Oja-rasi bride or lords Aries/Scorpio, Taurus/Libra; 2nd place for six boy signs; 5th
  place for an Aries or Cancer bride), plus notes on the eight stars for which dasa porutham "need not be seen", the Vatham (7th star)
  Kasyapa warnings and the twelve named pairs, and the four stars Moolam, Ashlesha, Jyeshta and Visakam (pada-dependent).
- **Three extra factors, not counted**: Nadi, star gender, and caste by rasi.

Choices made where C32 is not explicit: "friends" means mutual friends in C32's own printed table (p.35); Mercury's only printed friend is
Saturn, so Mercury with Venus is not a waiver. Pada exceptions are shown as cautions because the input has no pada. The Kasyapa
pairs are applied only for the exact star pairs the book names.
